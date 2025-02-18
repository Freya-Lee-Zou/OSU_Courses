#include <stdlib.h>
#include <string.h> // for strstr() and strcmp()
#include <ctype.h>
#include <stdio.h>
#include <pthread.h> // for threads
#include <unistd.h>
#include <stdbool.h>


// defind variables
#define BUFFER_LENGTH 9999

//decare 4 buffers to store shared data
struct buffer *buffer_1, *buffer_2, *buffer_3, *buffer_4;
//This is when I need to deallocate the memory 
struct buffer* buffers[4];


//Buffer Structure
struct buffer 
{
    char buffer[60][BUFFER_LENGTH];
    pthread_mutex_t mutex;
    pthread_cond_t is_full;
};


//======Input Thread===========
//reads in lines of characters from 
//the standard input and put in buffer_1
void* get_input(void* args){    
  int RunFlag = 1;
  bool stopFlag= 0;
  char userInput[BUFFER_LENGTH];
  // initialize userInput
  memset(userInput, '\0', BUFFER_LENGTH);
  int len = 0;
  // Thread starts here 
  while(RunFlag ==1 && len != 60){ 
    
    // get user input from stdin
    if(fgets(userInput, BUFFER_LENGTH, stdin) == NULL){
      perror("Error: fgets failed to read user input"); 
    }
    // check if unserInput has "STOP\n" character, 
    // if it has it, then set stopFlag to true get out while loop
    if (strcmp(userInput,"STOP\n")== 0){
      userInput[0] = '\3';
      stopFlag = 1;
    }

    // Lock Mutex before writing character to the buffer
    pthread_mutex_lock(&buffer_1->mutex);

    // copy userUnput to buffer_1->buffer
    strcpy(buffer_1->buffer[len], userInput);

    // Send signal to consumer that buffer is full
    pthread_cond_signal(&buffer_1->is_full);    

    // Unlock Mutex
    pthread_mutex_unlock(&buffer_1->mutex);

    // exit if there is STOP\n in the user input 
    if (stopFlag == true)
    {
        RunFlag = 0;
    }

    // incrementing by one for moving to the next line of input
    len += 1;    
  }

  return NULL;

}


// This algorithm is refrenced:https://www.geeksforgeeks.org/c-program-replace-word-text-another-given-word/
void symblolReplacing(char* SRC_string, const char* targetStr, const char* replaceTarStr){
   
    char buff[BUFFER_LENGTH];
    memset(buff, '\0', BUFFER_LENGTH);
    int runFlg = 1;
    char *ptr = &buff[0];
    //declare the tempStr to pointe SRC_string for operations
    const char *tempStr = SRC_string;
    size_t lenTargetStr = strlen(targetStr);
    size_t replaceTarStrLen = strlen(replaceTarStr);
   
    
   
    // replace starts from here 
    while (runFlg) {
        
        // Check if there is another targetStr in the temStr
        const char *substringIndex = strstr(tempStr, targetStr);
        // if there if no more targetStr then exit the loop
        if (!substringIndex) {  
            strcpy(ptr, tempStr);
            break;
        }
        // Use memcopy to copy Src_string to index of found string
        memcpy(ptr, tempStr, substringIndex - tempStr);
        ptr += substringIndex - tempStr;
          
        // Use memcopy to copy Src_string to index of found string
        memcpy(ptr, replaceTarStr, replaceTarStrLen);
        ptr += replaceTarStrLen;

        //Increment the pointer to continue searching
        tempStr = substringIndex + lenTargetStr;
    }

    // replace the new cerated string with the original string
    strcpy(SRC_string, buff);
}


//======Line Separator Thread===
//replaces every line separator
// in the input by a space.
void* space_seperator(void* args){
    int RunFlag = 1;
    bool stopFlag= 0;
    char userInput[BUFFER_LENGTH];
    //initialize userInput
    memset(userInput, '\0', BUFFER_LENGTH);
    int len = 0;
   
    // Thread Task
    while(RunFlag)
    {
       
        // get the length of buffer
        ssize_t lineLn = strlen(buffer_1->buffer[len]);
        
        // Lock Mutex in order to other threads not excute
        pthread_mutex_lock(&buffer_1->mutex);

        // if the buffer is empty then wait()
        while (lineLn == 0)
        {
            pthread_cond_wait(&buffer_1->is_full, &buffer_1->mutex);
            lineLn = strlen(buffer_1->buffer[len]);
        }
        
        // copy buffer line to output
        strcpy(userInput, buffer_1->buffer[len]);
       
        // Unlock Mutex
        pthread_mutex_unlock(&buffer_1->mutex);

        // Check for stop marker
        if (strstr(userInput, "\3") != NULL)
        {
            stopFlag = true;
        }

        // Call the function symbolReplacing
        // and replate '\n' with " "
        symblolReplacing(userInput, "\n", " ");
   
        // Output to production buffer
        pthread_mutex_lock(&buffer_2->mutex);

        // copy userInput to buffer_2
        strcpy(buffer_2->buffer[len], userInput);
        
        // Send signal to consumer that buffer_2 is full
        pthread_cond_signal(&buffer_2->is_full);    

        // Unlock the mutex
        pthread_mutex_unlock(&buffer_2->mutex);

        // exit if the consume buffer is the stop command
        if (stopFlag == true)
        {
            RunFlag = 0;
        }
         // incrementing by one for moving to the next line of input
        len += 1;
    }
   
    return NULL;
}


//====Plus Sign thread=====
//replaces every pair of plus signs("++", by a "^")
// - get input from buffer_2 and then put 
//new created text into buffer_3
void* replace_plus_signs(void* args) {
    int RunFlag = 1;
    bool stopFlag= 0;
    char userInput[BUFFER_LENGTH];
    //initialize userInput
    memset(userInput, '\0', BUFFER_LENGTH);
    int len = 0;

    //Thread starts from here
    while (RunFlag ==1)
    {
        // Get input from consumer buffer
        ssize_t lineLn= strlen(buffer_2->buffer[len]);

        // Lock Mutex before writing character to the buffer
        pthread_mutex_lock(&buffer_2->mutex);

        // Wait() for thread if the buffer is empty
        while (lineLn == 0){
            pthread_cond_wait(&buffer_2->is_full, &buffer_2->mutex);
            lineLn = strlen(buffer_2->buffer[len]);
        }
        
        // copy buffer line to userInput
        strcpy(userInput, buffer_2->buffer[len]);

        // Unlock Mutex
        pthread_mutex_unlock(&buffer_2->mutex);

        // Check for if there "\3" in the userinput
        if (strstr(userInput, "\3") != NULL){
          stopFlag = true;
        }

        // call the symblolReplacing and replace ++ to ^
        symblolReplacing(userInput, "++", "^");

        //lock buffer mutex 3
        pthread_mutex_lock(&buffer_3->mutex);

        // write input to buffer line
        strcpy(buffer_3->buffer[len], userInput);

        // Send signal to consumer taht buffer_3 is ful
        pthread_cond_signal(&buffer_3->is_full);    

        // Unlock Mutex
        pthread_mutex_unlock(&buffer_3->mutex);

        // exit if the consume buffer is the stop command
        if (stopFlag == true){
            RunFlag = 0;
        }

        // incrementing by one for moving to the next line of input
        len += 1;
    }

    return NULL;
}


// ===Output Thread===
// take it from buffer_3 and then just 
//simplely print it out on the console
void* write_stdout(void* args){
  int RunFlag = 1;
  bool stopFlag= 0;
  char userInput[BUFFER_LENGTH];
  //initialize userInput
  memset(userInput, '\0', BUFFER_LENGTH);
  int outPutLen= 81;
  int outPutlen2= 80;
  char outputStr[outPutLen];
  //initialize outputStr
  memset(outputStr, '\0', outPutLen);
  char outputBuff[BUFFER_LENGTH];
  //initialize outputBuff
  memset(outputBuff, '\0', BUFFER_LENGTH);
  int len = 0;
  size_t j = 0, i = 0;
   
  // Thread Task
  while (RunFlag == 1){

    ssize_t lineLn = strlen(buffer_3->buffer[len]);

    // lock mutex 3
    pthread_mutex_lock(&buffer_3->mutex);

    // if buffer is empty then wait() for the thread
    while (lineLn == 0){
        pthread_cond_wait(&buffer_3->is_full, &buffer_3->mutex);
        lineLn = strlen(buffer_3->buffer[len]);
    }
    
    //read buffer line to output
    strcpy(userInput, buffer_3->buffer[len]);

    // Unlock mutex
    pthread_mutex_unlock(&buffer_3->mutex);

    //Catenate userInput to the total input received
    strcat(outputBuff, userInput);

    // Check for the stop marker
    if (strstr(userInput, "\3") != NULL){
        stopFlag = true;
    }

    // Print 80 characters at a time from total input received
    while (j < (strlen(outputBuff)) && outputBuff[j] != '\3'){
        // Copy character from total input to outputStr
        outputStr[i] = outputBuff[j];
        // Increment i and j by 1 for accoutning new aadded cahracter
        i++;
        j++;
        outPutlen2 -= 1;
        
        // if there is 80 character then print it out 
        if (outPutlen2 == 0){
            // print out the outputStr on the terminal
            printf("%s\n",outputStr);
            fflush(stdout);
            //reset outputStr array
            memset(outputStr, 0, 81);
            i = 0;
            outPutlen2 = 80;
        }
    }

    // check if there is "STOP\n", if true then exit the while loop
    if (stopFlag == 1){
        RunFlag = 0;
    }

     // incrementing by one for moving to the next line of input
    len += 1;
  }

  return NULL;
}


// In the main fucntion I created 4 threads and 
//defined 4 buffer to store shared data 
int main(void) {
    
    //Dynamicaaly Initialize Buffers Array
    buffer_1 = (struct buffer*) malloc(sizeof(struct buffer));
    memset(buffer_1, 0, sizeof(struct buffer));
    buffer_2 = (struct buffer*) malloc(sizeof(struct buffer));
    memset(buffer_2, 0, sizeof(struct buffer));
    buffer_3 = (struct buffer*) malloc(sizeof(struct buffer));
    memset(buffer_3, 0, sizeof(struct buffer));
    buffer_4 = (struct buffer*) malloc(sizeof(struct buffer));
    memset(buffer_4, 0, sizeof(struct buffer));
     
    struct buffer** buffers = calloc(4, sizeof(struct buffer*));
    for(int i = 0; i < 4; i++){
      buffers[i] = calloc(1, sizeof(struct buffer));
    }

    // Initialize buffers and mutex con conditonal variables 
    for(int i = 0; i < 4; i++){
        memset(buffers[i]->buffer, 0, BUFFER_LENGTH);
        pthread_mutex_init(&buffers[i]->mutex, NULL);
        pthread_cond_init(&buffers[i]->is_full, NULL);
    }
    
    // Create variables for thread IDs
    pthread_t input_std, seperator, plus_sign, output_stdout;
    
    // Create 4 threads 
    pthread_create(&input_std, NULL, get_input, NULL);
    pthread_create(&seperator, NULL, space_seperator, NULL);
    pthread_create(&plus_sign, NULL, replace_plus_signs, NULL);
    pthread_create(&output_stdout, NULL, write_stdout, NULL);
    
    // wait for  4threads 
    pthread_join(input_std, NULL);
    pthread_join(seperator, NULL);
    pthread_join(plus_sign, NULL);
    pthread_join(output_stdout, NULL);

    // Deallocate memory 
    for (int i = 0; i < 4; i++){
        free(buffers[i]);
    }
    free(buffers);

    
    return EXIT_SUCCESS;

}