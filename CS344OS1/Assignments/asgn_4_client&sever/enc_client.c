#include <fcntl.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <sys/errno.h>
#include <stdio.h>
#include <sys/types.h>  // ssize_t contains a number of data types used in sustem calls
#include <sys/socket.h> // send(),recv()
#include <netdb.h>      // gethostbyname()
#include <stdlib.h>
#include <unistd.h>
#include <string.h>


#define MAX_SIZE 149999
int bufferLength = 0;

/******************************************************************************
* enc_client code
* 1. Create a socket and connect to the server specified in the command arugments.
* 2. Open plaintxt file and key txt file in the command argumens and send that input 
as a message to the server.
* 3. Print the message received from the server and exit the program.
*/


// Error function used for reporting issues
void error(const char *msg) {
  perror(msg);
  exit(0);
}


// Set up the address struct
void setupAddressStruct(struct sockaddr_in* address,
                                    int portNumber,
                                    char* hostname){

  // Clear out the address struct
  memset((char*) address, '\0', sizeof(*address));

  // The address should be network capable
  address->sin_family = AF_INET;
  // Store the port number
  address->sin_port = htons(portNumber);

  // Get the DNS entry for this host name
  struct hostent* hostInfo = gethostbyname(hostname);
  if (hostInfo == NULL) {
    fprintf(stderr, "CLIENT: ERROR, no such host\n");
    exit(0);
  }
  // Copy the first IP address from the DNS entry to sin_addr.s_addr
  memcpy((char*) &address->sin_addr.s_addr,
        hostInfo->h_addr_list[0],
        hostInfo->h_length);
}



//========================Recive the message============
void recevePlaintext(int socketFD, char* buffer, int bufferLen){
  int charsRead = 0;
  int sizeLeft = bufferLen;
  int i = 0, j = 0;
  char* tempStr = calloc(MAX_SIZE, sizeof(char));
  memset(buffer, '\0', MAX_SIZE);
  // Send a Success message back to the client
  //charsRead < bufferLen
  while(strstr(buffer,"\n end \n") == NULL) {
    memset(tempStr, '\0', strlen(tempStr));
     errno = 0;
     // printf("recv in enc_client\n");
     charsRead = recv(socketFD, tempStr, sizeof(tempStr), 0);

     // printf("tempStr@enc_server159:%s\n", tempStr);
     if (charsRead < 0){
       error("SERVER: ERROR reading from socket");
     }
     if (buffer[0] == '\0')
      strcpy(buffer, tempStr);
     else
      strcat(buffer, tempStr);
  }
 
  fflush(stdout);
  buffer = strtok(buffer, "\n");
  printf("%s\n",buffer);
  
}


int main(int argc, char *argv[]) {
  char *sendInfo = calloc(MAX_SIZE, sizeof(char));
  char *plaintxtBuf = calloc(MAX_SIZE, sizeof(char));
  char *keyBuf = calloc(MAX_SIZE, sizeof(char));
  int socketFD, charsWritten, charsRead,keyLength, plaintxtLen;
  // Assign localhost to hostname pass as an argument by the command
  char* hostname = "localhost";
  // For opening the plaintext file and key text file
  FILE *fd;
  struct sockaddr_in serverAddress;
  char buffer[MAX_SIZE], key[MAX_SIZE], tempStr[MAX_SIZE];
  int i = 0, j = 0;
  // set up buffer to \0
  memset(buffer, '\0', strlen(buffer));
  
  // Check usage & args
  if (argc < 3) {
    fprintf(stderr,"USAGE: %s enc_client plaintext key port\n", argv[0]);
    exit(0);
  }
  
  // Create a socket
  socketFD = socket(AF_INET, SOCK_STREAM, 0);
  if (socketFD < 0){
    error("CLIENT: ERROR opening socket");
  }
  // Set up the server address struct
  setupAddressStruct(&serverAddress, atoi(argv[3]), hostname);
  
  // Connect to server
  if (connect(socketFD, (struct sockaddr*)&serverAddress,
                              sizeof(serverAddress)) < 0){
    error("CLIENT: ERROR connecting");
  }



  //****************************** open plaintext file**************************
  //put a smybol "@@"  int the variable sendInfo to mark as start
  strcpy(sendInfo, "@@ \n");
  //open plaintext file and put
  fd = fopen(argv[1], "r"); 
  // get a the plaintxt and store in the plaintxt buffer
  fgets(plaintxtBuf, MAX_SIZE, fd);
  fclose(fd); // once is read and stored in the plaintxtBuf then we can close the file
  
  //check if there is bad chracter in the plaintext file
  while(j < strlen(plaintxtBuf)){
    if(plaintxtBuf[j] != ' ' && (plaintxtBuf[j] > 'Z' || plaintxtBuf[j] < 'A')){
      if(plaintxtBuf[j] != '\n'){
        fprintf(stderr, "Error: %s being bad!!\n",argv[1]);
        exit(1);
      }
    }
    j++;
  }
 

  plaintxtLen = strlen(plaintxtBuf);
  //catenate plaintext into varible sendInfo
  strcat(sendInfo, plaintxtBuf); 
  bufferLength = strlen(plaintxtBuf);
  
  //=======================open key txt file===================================
  strcat(sendInfo, "\n");
  fd = fopen(argv[2], "r");
  fgets(keyBuf, MAX_SIZE, fd);
  fclose(fd);

  //check if there is bad key generated 
  while(i < strlen(keyBuf)){
    if(keyBuf[i] != ' ' && (keyBuf[i] > 'Z' || keyBuf[i] < 'A')){
      if(keyBuf[i] != '\n'){
        fprintf(stderr, "Error: %s being bad!!\n",argv[2]);
        exit(1);
      }
    }
    i++;
  }


  keyLength = strlen(keyBuf);
   // catenate key to the varible sendInfo
  strcat(sendInfo, keyBuf);
  strcat(sendInfo, "\n end \n");

  //Check if the length of key is smaller, if it is smaller then print error mesg
  if (keyLength < plaintxtLen) {
    fprintf(stderr, "Error: The key you generatd is too short!!\n");
    exit(1);
  }
 
  //============================================================
  //---------Send the plaintext and the key to enc_server------
  charsWritten = send(socketFD, sendInfo, strlen(sendInfo), 0);
  if (charsWritten < 0){
    error("CLIENT: ERROR writing to socket");
  }
  if (charsWritten < strlen(sendInfo)){
    printf("CLIENT WARNING: Not all data is written to socket!\n");
  }
  
  //============================================================
  //-------------------Recive encrypted plaintxt-----------------
  recevePlaintext(socketFD, sendInfo, MAX_SIZE);
  //============================================================
  
  // Close the socket
  close(socketFD);

  return 0;
}
