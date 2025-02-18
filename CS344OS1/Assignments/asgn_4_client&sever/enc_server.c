#include <sys/stat.h>
#include <sys/wait.h>
#include <sys/errno.h>
#include <unistd.h>     // read() write() close()
#include <netinet/in.h> // sockaddr_in()
#include <sys/types.h>  // ssize_t
#include <sys/socket.h> // defines the socketaddr structure
#include <netdb.h>      // gethostbyname()
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>     // atoi() variable types
#include <string.h>




#define MAX_SIZE 149999


/******************************************************************************
* dec_server code
* 1. Create a socket and connect to the dec_client.
* 2. Receve plaintxt file and key from dec_client.c .
* 3. Decreypt the plaintext with specified key and send back to the dec_client
*/


// Error function used for reporting issues
void error(const char *msg) {
   perror(msg);
   exit(1);
}

// Set up the address struct for the server socket
void setupAddressStruct(struct sockaddr_in* address, int portNumber){
   // Clear out the address struct
   memset((char*) address, '\0', sizeof(*address));

   // The address should be network capable
   address->sin_family = AF_INET;
   // Store the port number
   address->sin_port = htons(portNumber);
   // Allow a client at any address to connect to this server
   address->sin_addr.s_addr = INADDR_ANY;
}


// This function encrypts plaintext with the key which generated in the keygen.c file
char *encryptPlaintext(char* buffer){
   int ASKII_A = 0, ASKII_B = 0, alphbetNum = 27;
   unsigned int i = 0;
   char *keyBuf = NULL;
   keyBuf = malloc((MAX_SIZE + 1) *sizeof(char));
   char *verficationEnc = NULL;
   verficationEnc = malloc((MAX_SIZE + 1) *sizeof(char));
   char *plaintextEncypt = NULL;
   plaintextEncypt = malloc((MAX_SIZE + 1)*sizeof(char));

   char *copy = strdup(buffer);
   verficationEnc = strtok(copy,"\n");
   //This algorith is referenced here:http://www.trytoprogram.com/c-examples/c-program-to-encrypt-and-decrypt-string/
   // if statement check if the message is correct, 
   //if not correct then print an error to the terminal
   if(strcmp(verficationEnc,"@@ ") != 0) {
     return("Error: dec_client cannot use enc_server! \n end \n");
   }
   else{
     plaintextEncypt = strtok(NULL,"\n" );
     keyBuf = strtok(NULL,"\n" );
      for (i = 0; i < strlen(plaintextEncypt); i++) {
         //Get ascii value for a then set to A
         ASKII_A = plaintextEncypt[i]; 
         if(ASKII_A == 32){
            ASKII_A = 91;
         } 
         //Get ascii value for b then set to B
         ASKII_B = keyBuf[i]; 
         if (ASKII_B == 32){
            ASKII_B = 91;
         } 
         //Subtract 65 from the abs of ASKII_A
         ASKII_A = abs(ASKII_A) - 65; 
         //Subtract 65 from the abs of ASKII_B
         ASKII_B = abs(ASKII_B) - 65; 
         //Add key and buffer value
         ASKII_A += ASKII_B; 
         // mod 26 of ASKIIA
         ASKII_A = ASKII_A % alphbetNum; 
         ASKII_A += 65;
         if(ASKII_A == 91 ){
            ASKII_A = 32;
         } 
         // store ascii value of a + 65 into array at i
         plaintextEncypt[i] = ASKII_A; 
      }
   }
   strcat(plaintextEncypt, "\n end \n");
   return(plaintextEncypt);
}


int main(int argc, char *argv[]){
   int connectionSocket, charsRead,socketFD;
   char buffer[MAX_SIZE], key[MAX_SIZE], tempStr[MAX_SIZE];
   struct sockaddr_in serverAddress, clientAddress;
   socklen_t sizeOfClientInfo = sizeof(clientAddress);
   pid_t pid_val = -5;
   int childpid = 0;
   int childstatus = 0;

   // Check usage & args
   if (argc < 2) {
      fprintf(stderr,"USAGE: %s port\n", argv[0]);
      exit(1);
   }


   // Create the socket that will listen for connections
   // Create a socket
   // int sockfd = socket (int domain, int type, int protocol)
   //AF_INET ->IPv4, SOCK_STREAM -> TCP (UDP->SOCK_DGRAM)
   int listenSocket = socket(AF_INET, SOCK_STREAM, 0);
   if (listenSocket < 0) {
      error("ERROR opening socket");
   }
   
   // int flg = 1;
   // //make socket reusable
	// setsockopt(socketFD, SOL_SOCKET, SO_REUSEADDR, &flg, sizeof(int)); 
   // Set up the address struct for the server socket
   setupAddressStruct(&serverAddress, atoi(argv[1]));

   // Associate the socket to the port
   // int bind (int sockfd, const struct sockaddr*addr,socklen_t addrlen) 
   if (bind(listenSocket,
	    (struct sockaddr *)&serverAddress,
	    sizeof(serverAddress)) < 0){
      error("ERROR on binding");
   }

   // Start listening for connetions. Allow up to 5 connections to queue up
   // listen (int sockfd, int backlog)
   // backlog: number of connecton a system can handle at a single time
   listen(listenSocket, 5);

   // ***********Connection of enc_clinet.c  starts here*****************
   // Accept a connection, blocking if one is not available until one connects
   while(1){
      // Accept the connection request which creates a connection socket
      // doing tyapecsting (struct sockaddr *) and sockaddr_in are different 
      connectionSocket = accept(listenSocket,
	    (struct sockaddr *)&clientAddress,
	    &sizeOfClientInfo);
      if (connectionSocket < 0){
	      error("ERROR on accept");
      }
      
      
      pid_val = fork();
      if (pid_val == -1){
	      perror("fork() is failed");
         exit(1);
      }else if(pid_val == 0){ // we are in the child process
	   
         int charsSent = 0,  i = 0;
         memset(buffer, '\0', strlen(buffer));
	      
         // Read the client's message from the socket
         //=============================================================
         // Recv loop error is here
         while (strstr(buffer,"\n end \n") == NULL) {
            memset(tempStr, '\0', strlen(tempStr));
            errno = 0;
            charsRead = recv(connectionSocket, tempStr, sizeof(tempStr), 0);
            if (charsRead < 0){
                  error("SERVER: ERROR reading from socket");
            }
            if (buffer[0] == '\0')
            strcpy(buffer, tempStr);
            else
            strcat(buffer, tempStr);
         }
         
         // ---------------------------------- encrypt the plaintxt by using the key--------
         // 1: parse the data
         // 2: encrypt the text 
         // 3: store in the variable buffer
         fflush(stdout);
         strcpy(buffer,encryptPlaintext(buffer));
         fflush(stdout);
         

         //==========================================================================
         int sizeLeft = strlen(buffer);
         // Send a Success message back to the client
         while (i < strlen(buffer)) {
            // printf("sending in enc_server\n");
            charsSent = send(connectionSocket, buffer, sizeLeft , 0);
            if (charsSent < 0) error("ERROR writing to socket");
            i += charsSent;
            sizeLeft -= charsSent;
         }
         
         // Close the connection socket for this client
         close(connectionSocket);
  
      }else{ // we are in the parent process
         waitpid(pid_val, &childstatus, 1);
      }
   }
 // Close the listening socket
 close(listenSocket);
 return 0;
}
