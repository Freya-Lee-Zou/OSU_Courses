#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h> // For execv(), getpid(), fork()
#include <sys/types.h>
#include <fcntl.h>
#include <signal.h> // for signal 
#include <sys/wait.h> // For waitpid 
#include <sys/stat.h>


#define  maxLength 2048
#define maxSizeArguments 512
#define columSize 50
#define TOKEN_DELIMITERS " "
//I set up a global varible to avoid signal passing to sig functions.
int flagSigSat; 


// This function does checking the status and print status
void statusChecking(int* status)
{
    int wstatus;
    // WNOHANG specifying waitpid non-blocking, i.e., if WNOHANG flag is specified and no child process has terminated, then waitpid will return immediately with the return value of 0,
    pid_t PID_VAL = waitpid(-1, &wstatus, WNOHANG);
    // printf("PID_VAL and wstatus in the statusChecking function: %d %d\n ",PID_VAL,wstatus);
    if(PID_VAL != 0 && PID_VAL != -1)
    {   
        // printf("This is in the statusChecking fucntion is called and going to print\n");
        *status = WEXITSTATUS(wstatus);
        printf("background process %i is done: ", PID_VAL );
        fflush(stdout);
        // WIFSIGNALED returns true if the child was terminated abnormally. Note that exactly one of WIFEXITED and WIFSIGNALED will return true.
        if(WIFSIGNALED(wstatus))
        {
            printf("terminated by signal %i.", WTERMSIG(wstatus));
            fflush(stdout);
        }
        else
        {
            printf("exit value %i. ", *status);
        }
        printf("\n");
        fflush(stdout);
    }
}


//  **************** 6. Input & Output Redirection*************
//input file redirected via stdin should be opened for reading only; if your shell cannot open the file for reading, it should print an error message and set the exit status to 1 (but don't exit the shell), and Similarly, an output file redirected via stdout should be opened for writing only; it should be truncated if it already exists or created if it does not exist. If your shell cannot open the output file it should print an error message and set the exit status to 1 (but don't exit the shell).
int redirections(char tokens[maxSizeArguments][columSize], int* tokensCounter, int* status)
{
    int fd = 0;
    //check the second postion if it is < or > if it is 
    //printf("pos1 in the redirection fucntion: %c\n",*pos1);
    char* pos1 = tokens[(*tokensCounter)-2]; 
    //filename for input or output file
    //printf("fname1 in the redirection fucntion: %c\n",*fname1);
    char* fname1 = tokens[(*tokensCounter)-1];
    //check for input file  
    if(strcmp(pos1,"<") == 0 ) 
    {
        *tokensCounter = (*tokensCounter) - 2;
        fd = open(fname1, O_RDONLY);
        lseek(fd, 0, SEEK_CUR);
        if(fd != -1)
        { 
            //system calls duplicates a file descriptor. If it executes successfully, then newfd will point to a copy of oldfd. The two file descriptors can be used interchangeably and share the same file pointer. If the newfd was previously open it will be automatically closed. If it successful it returns the new file descriptor, otherwise it returns -1.
            dup2(fd, STDIN_FILENO);
            close(fd);
            return 0;
        }
        else // if open file fail, then print a message to the user
        {
            *status = 1;
            printf("cannot open %s for input.\n", fname1);
            fflush(stdout);
            return 1;
        }
    }
    else if (strcmp(pos1, ">") == 0) //check for output file
    {
        *tokensCounter = (*tokensCounter) - 2;
        int fd = open(fname1, O_WRONLY | O_CREAT | O_TRUNC, 0664);
        // To check if it is sucessfully opend a file, if it opend sucessuflly then duplicates the file descriptor fd to file descriptor 1, which is the file descriptor for standard output. In other words, it sets the standard output to refer to the same file or device as the file referred to by fd. if fd is negative 1 then print a message to the user.
        if(fd == -1)
        {
            *status = 1;
            printf("cannot open %s for output.\n", fname1);
            fflush(stdout);
            return 1;
        }
        else 
        {
           
          dup2(fd, 1);
          close(fd);
          return 0;
        }
    }
    
    return 0;
}


//****************5. Executing Other Commands ***************
// Your shell will execute any commands other than the 3 built-in command by using fork() , exec() and waitpid()   Whenever a non-built in command is received, the parent (i.e., smallsh) will fork off a child.
// The child will use a function from the exec() family of functions to run the command.
void executeOtherCommands(char tokens[maxSizeArguments][columSize], int tokensCounter, int* status)
{

    int i;
    char* args[tokensCounter];
    int fileStat1 = redirections(tokens, &tokensCounter, status);
    int fileStat2 = redirections(tokens, &tokensCounter, status);

    // if userinputis bad input or output file then just simply exit 
    if(fileStat1 || fileStat2 )
    {
        exit(1);
    }    
    
    
    for(i=0;i<tokensCounter;i++)
    {
        args[i] = (char*) &tokens[i];
    }
    args[tokensCounter] = NULL;
    
    // excute the command 
    int err = execvp(args[0],args);
    if (err == -1){
      printf("%s:no such file or directory \n",*args);
      exit(1);
    }
}

//  ********************1. The Command Prompt**********************
//  * This fucntion prompt ":" to the user to insert a command    *
//  * and read the command in a line and parse it into tokens.    *
int tokenizeUserInput(char* userCommand, char tokens[maxSizeArguments][columSize]) {
  int counter = 0;

  printf(":");
  fflush(stdout);

  if (fgets(userCommand, maxLength, stdin) != NULL) {
    // Remove trailing newline character, if it exists
    size_t len = strlen(userCommand);
    if (len > 0 && userCommand[len-1] == '\n') {
      userCommand[len-1] = '\0';
    }
  } else {
    clearerr(stdin);
  }

  // Expand any instance of "$$" in a command into the process ID of the smallsh itself. it does not otherwise perform variable expansion.
  char* expandVariables = strstr(userCommand, "$$");
  if (expandVariables != NULL) {
    char expandedCommand[maxLength] = {0};
    int pid = getpid();
    strncpy(expandedCommand, userCommand, expandVariables - userCommand);
    sprintf(expandedCommand + strlen(expandedCommand), "%d%s", pid, expandVariables + 2);
    strncpy(userCommand, expandedCommand, maxLength);
  }

  // Tokenize user input and populate tokens array
  char* token = strtok(userCommand, TOKEN_DELIMITERS);
  while (token != NULL) {
    strncpy(tokens[counter], token, columSize);
    //printf("tokenized command line index %d the while loop is %s \n", counter, tokens[counter]);
    counter++;
    token = strtok(NULL, TOKEN_DELIMITERS);
  }

  return counter;
}



/* Our signal handler for SIGTSTP */
// This fucntion us referenced course matirials
void handle_SIGTSTP(int signo)
{
    if(flagSigSat)
    {    // We are using write rather than printf
        char* messeage = "\nExiting foreground-only mode\n: ";
        write(STDOUT_FILENO, messeage, columSize);
        fflush(stdout);
    }
    else
    {    // We are using write rather than printf
      char* message= "\nEntering foreground-only mode (& is now ignored)\n: ";
      write(STDOUT_FILENO, message, columSize);
      fflush(stdout);
    }
    // set up flagSigSat is not true 
    flagSigSat = !flagSigSat;
     fflush(stdout);
}

// Handle_ SIGINT
//if the program is interrupted by sigint, print a message to the user immediately
void handle_SIGINT(int signo){
  
printf("terminated by signal %d \n",signo);
  
}


int main()
{
  
    char tokens[maxSizeArguments][columSize];
    char userCommand[maxLength];
    int status = 0;
    int backgrounflag = 0;
    int childStatus;
    flagSigSat = 0; 
    
    // Code for SIGTSTP and SIGINT us referenced the 
    //course material which provided on Canvas
    //**********  Custom SigSTP*********** 
    // Initialize SIGTSTP_action struct to be empty
    struct sigaction SIGTSTP_action;
    
    // Fill out the SIGTSTP_action struct
    // Register handle_SIGTSTP as the signal handler 
    SIGTSTP_action.sa_handler = &handle_SIGTSTP;
    // Block all catchable signals while handle_SIGTSTP is running
    sigfillset(&SIGTSTP_action.sa_mask);
    // No flags set
    SIGTSTP_action.sa_flags = 0;
    // Install our signal handler
    sigaction(SIGTSTP, &SIGTSTP_action, NULL);


    //************ignore sigint signals*********
    // Initialize SIGINT_action struct to be empty
    struct sigaction SIGINT_action;

    // Fill out the SIGINT_action struct

    // Register handle_SIGINT as the signal handler
    SIGINT_action.sa_handler = &handle_SIGINT;
    // Block all catchable signals while handle_SIGINT is running
    sigfillset(&SIGINT_action.sa_mask);
    // No flags set
    SIGINT_action.sa_flags = 0;
    // Install our signal handler
    sigaction(SIGINT, &SIGINT_action, NULL);
    

    while(1) 
    {
        statusChecking(&status);

        int tokensCounter = tokenizeUserInput(userCommand, tokens);
        // ********* 2.Comments & Blank Lines*************
        // Do Nothing if user input is a blank line 
        //or starts with "#" sign if argumentsCounter equals to 0, 
        //it means that there is no userinput.
        if (tokensCounter == 0 || tokens[0][0] == '#'){
           //do nothing	
            continue;
        } 
        
        // This is for checking built in commands 
        // if userinput is cd, then change directoty to home
        // else if userinput is 
        // else if userinput is exit then break the loop exit,
        // otherwise we fork() and excute the command
        if(strcmp(tokens[0], "cd")== 0){
          if(tokensCounter == 1){   
    
            char* home = getenv("HOME");
            // change directory 
            if (chdir(home) != 0)
            { 
                printf("Failed to change to home directory\n");
                fflush(stdout);
            }
          }
          else {
              if (chdir(tokens[1]) != 0)
              {
                  printf("Error: could not cd into %s\n", tokens[1]);
                  fflush(stdout);
              }
          } 
      }else if (strcmp(tokens[0], "status")==0){ // we have to write something here 

         printf("exit value %i.\n ", status);   
       
      }else if(strcmp(tokens[0], "exit")==0)
      {
        break;
      } 
      else{  

          backgrounflag = 0;
          //check the last character if it is & which means that we are going to start baground mode
          if (strcmp(tokens[tokensCounter-1], "&") == 0){
              tokensCounter --; 
              backgrounflag = 1;
          }
          // this creates a child process by calling the fork() system call
          pid_t PID_VAL = fork();
          //if PID_VAL smaller than 0 , print a error message to users, if PID_VAL equals 0, it means we are in child process, otherwise we are in parent process
          if (PID_VAL < 0) {
            // Fork failed
            perror("fork");
            exit(EXIT_FAILURE);
          }
          else if (PID_VAL == 0){

            //ignore SIGTSTP in children
            SIGTSTP_action.sa_handler = &handle_SIGINT;
            // Install our signal handler
            sigaction(SIGTSTP, &SIGTSTP_action, NULL);
            
      
            if(backgrounflag && !flagSigSat)
            {
                printf("background pid is %i \n:",getpid());
                fflush(stdout);
                int null = open("/dev/null", O_WRONLY);
                //redirect stdout to null
                dup2(null,1); 
            }
            else
            {   
                // this block of code is process is in foreground; a signal handler is installed to ignore SIGTSTP signals, which is done using the sigaction() system call. If the backgrounflag variable is set, the child process prints a message indicating that it is running in the background and redirects its standard output to /dev/null. Otherwise, the signal handler for SIGINT is set to the default behavior, which is to terminate the process. Finally, the executeOtherCommands() function is called to execute the user command in the child process.
                SIGINT_action.sa_handler = SIG_DFL;
                sigaction(SIGINT, &SIGINT_action, NULL); 
            }
            executeOtherCommands(tokens, tokensCounter, &status);
          }else{
              // This block of code is executed in the parent process. If the flagSigSat variable is set or the backgrounflag variable is not set, the parent process waits for the child process to terminate using the waitpid() system call. If the child process exits normally, the WEXITSTATUS macro is used to extract the exit status of the child process. Finally, the statusChecking() function is called to check the exit status and excute
              if(flagSigSat|| !backgrounflag) 
              {
                  waitpid(PID_VAL, &childStatus, 0);
                  status = WEXITSTATUS(childStatus);
              }
              statusChecking(&status);   
          }
      }

    }

    return 0;
}