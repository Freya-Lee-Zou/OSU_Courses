#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h> // For generating a random number
#include <dirent.h> //  to open read, clode a directory
#include <sys/types.h> 
#include <sys/stat.h> // to user mkdir
#include <unistd.h>
#include <errno.h> // for printing Errors when create directories
#include <fcntl.h> 

#define PREFIX "movies_"


//Declare a struct(linked list) with (Title,Year,Languages,Rating Value)

struct movie
{
  char *titles;
  int year;
  char *languages;
  float ratingValue;
  struct movie *next;
};


// Create movie
struct movie *createMovie(char *currLine ,int year, double ratingValue)
{
    struct movie *currMovie = malloc(sizeof(struct movie));

    // For use with strtok_r
    char *saveptr;
    
    // The first token is the titles
    char *token = strtok_r(currLine, ",", &saveptr);
    currMovie->titles = calloc(strlen(token) + 1, sizeof(char));
    strcpy(currMovie->titles, token);
    
    // The next token is year
    token = strtok_r(NULL, ",", &saveptr);
    //currMovie->titles = calloc(strlen(token) + 1, sizeof(char));
    currMovie->year = atoi(token);


    // The next token is the languages
    token = strtok_r(NULL, ", ", &saveptr);
    currMovie->languages = calloc(strlen(token) + 1, sizeof(char));
    strcpy(currMovie->languages, token);

    // The last token is rating value
    token = strtok_r(NULL, "\n", &saveptr);
    
    currMovie->ratingValue = strtod(token,NULL); 

    // Set the next node to NULL in the newly created student entry
    currMovie->next = NULL;
    
    return currMovie;
}


struct movie *processFile(char *filePath){
  // Open the specified file and give permission to reading
  FILE *MovieFile = fopen(filePath, "r");
  
  // If fail to open the file 
  //print a message to the user then exit the progream
  if (MovieFile == NULL){
    fprintf(stderr,"Faild to open file");
    exit(1);
  }
  
  char *currLine = NULL;
  int year = 0;
  double ratingValue = 0.0;
  size_t len = 0;
  ssize_t nread;
  char *token;

  // The head of the linked list
  struct movie *head = NULL;
  // The tail of the linked list
  struct movie * tail = NULL;

 
  // Read the first line which I don't need it
  nread = getline(&currLine, &len, MovieFile);
  // Read the file line by line
  while ((nread = getline(&currLine, &len, MovieFile)) != -1)
  {
    // Get a new movie node corresponding to the current line
    struct movie *newNode = createMovie(currLine,year,ratingValue);

    // If the linked list is empty, simpley store head and tail
    if (head == NULL)
    {
      // This is the first node in the linked link
      // Set the head and the tail to this node
      head = newNode;
      tail = newNode;
    }
    else{
      // This is not the first node.
      // Add this node to the list and advance the tail
      tail->next = newNode;
      tail = newNode;
    }
  }
    //Free memory and close the file. 
    free(currLine);
    fclose(MovieFile);
    return head;
}


//Print the menu
int PrintMenu(){
  int selections = 0;
  printf("1. Select file to process\n");
  printf("2. Exit the program\n");

  printf("Enter a choice from 1 to 2: ");
  scanf("%d",&selections);

  return selections; 
}



 //Use mkdir to create directories
 //This fucntion's code is referenced:https://www.delftstack.com/howto/c/concatenate-string-and-int-in-c/
void CreateDirectory(struct movie *list){
  
  FILE* moviesFile;
  // int file_descriptor;
  char *num;
  char buffer[100];
  char buffer2[100];
  const char *onid = "zouy2.movies.";
 
  int randomNum = 0;
  // seed the random number generator with the current time
  srand(time(0));
  // generate a random number in the range [0, 99999]
  randomNum = rand()/100000;
  
  // sprintf() to store the passed integer as a character string.
  if (asprintf(&num, "%d", randomNum) == -1){
    perror("asprintf");
  }else {
    //calls strcat() to concatenate two given character strings in the buffer.
    strcat(strcpy(buffer, onid), num); 
    free(num);
  }
  
  // Use mkdir() to create a directory named whatever in the buffer, if failed to create a directory print a specific error, otherwise print a message to inform users that a directory is successfully created and create different files based on years. 
  if((mkdir(buffer,0750)) == -1){
    perror("Error");
  }else{
  
        printf("Created directory with name %s\n", buffer);
        printf("\n");
        
        // Change to the directory(zouy2.movies.random)just created
        char *newdir = buffer;
        chdir(newdir);
    
        // *******Create the first file ***************
        const char *fileTxt = ".txt";
        // sprintf() to store the passed integer as a character string.
        if (asprintf(&num, "%d", list->year) == -1) {
          perror("asprintf");
        }else {
          //calls strcat() to concatenate two given character strings in the num.
          strcat(num,strcpy(buffer, fileTxt)); 
          
        }
      
        char* newFilePath = num;
        free(num);
        
        while (list!= NULL){
            
            //const char *fileTxt = ".txt";
            // sprintf() to store the passed integer as a character string.
            if (asprintf(&num, "%d", list->year) == -1) {
              perror("asprintf");
            }else {
              //calls strcat() to concatenate two given character strings in the buffer.
              strcat(num,".txt"); 
            }
        
            char* newFilePath = num;
            // We first open a file for read write, creating it if necessary and truncating it if it already exists
            moviesFile = fopen(newFilePath,"ab");
            if (!moviesFile){
             perror("Error");
             exit(1);
            }
        
            //Change all new created files permision to 0640
            chmod(newFilePath,0640);
            
           // wriete title to txt file 
           fprintf(moviesFile, "%s\n",list->titles);
           
            // go through the list
            list = list->next;
            //close the directory in each iliteration
            fclose(moviesFile);
        }
       
      }
  // change back to home dirctory
  chdir("..");

}


// Find the largest file in the current directory
void FindTheLargestFile(struct movie *list){
  
  // Open the current dirrctory
  DIR* currDir = opendir(".");
  struct dirent *aDir;
  struct stat dirStat;
  struct stat largestSize;
  char largestFileN[40];
  largestSize.st_size = 0;
    char buffer[5]= ".csv";
  
  
  while((aDir = readdir(currDir)) != NULL){
    
    //printf("%s\n",aDir->d_name);
    if(strncmp(PREFIX, aDir->d_name, strlen(PREFIX)) == 0 && strstr(aDir->d_name,buffer)){
      // Get meta-data for the current entry
      stat(aDir->d_name, &dirStat); 
      if (dirStat.st_size >= largestSize.st_size){
        largestSize.st_size = dirStat.st_size;
        printf("%s %lld\n",aDir->d_name,largestSize.st_size);
        memset(largestFileN, '\0', sizeof(largestFileN));
        strcpy(largestFileN, aDir->d_name);
      }
    }
  }
   
  printf ("Now processing the chosen file named %s\n",largestFileN );
  CreateDirectory(list);
  printf("\n");
  // Close the directory
  closedir(currDir);

}



// Find the smallest file in the current directory
void FindSmallestFile(struct movie *list){

  // Open the current dirrctory
  DIR* currDir = opendir(".");
  struct dirent *aDir;
  struct stat dirStat;
  struct stat smellestSize;
  char smellestFileName[100];
  smellestSize.st_size = 99999;
  char buffer[5]= ".csv";
  
  while((aDir = readdir(currDir)) != NULL){
    
    // printf("%s\n",aDir->d_name);
    if(strncmp(PREFIX, aDir->d_name, strlen(PREFIX)) == 0 && strstr(aDir->d_name,buffer)){
      // Get meta-data for the current entry
      stat(aDir->d_name, &dirStat); 
          
      if (dirStat.st_size < smellestSize.st_size ){
        smellestSize.st_size = dirStat.st_size;
        // printf("%s %lld\n",aDir->d_name,smellestSize.st_size);
        memset(smellestFileName, '\0', sizeof(smellestFileName));
        strcpy(smellestFileName, aDir->d_name);
      }
      
    }
  }
   
  printf ("Now processing the chosen file named %s\n",smellestFileName );
  CreateDirectory(list);
  // Close the directory
  closedir(currDir);

}


//Find the specific file in the current directory according to user's input
void specifyingNameFile(struct movie *list, int *flag){

 // Open the current dirrctory
  //int flag = 0;
  DIR* currDir = opendir(".");
  struct dirent *aDir;
  char tempName[60];
  char targetFileName [100];
  printf("Enter the complete file name: \n");
  // strcpy(targetFileName ,"food_txt.bar");
  scanf("%s",targetFileName);
  while((aDir = readdir(currDir)) != NULL){
    // printf("%s\n",aDir->d_name);
    if(strcmp(aDir->d_name, targetFileName) == 0){
      memset(tempName, '\0', sizeof(tempName));
      strcpy(tempName, aDir->d_name);
      printf ("Now processing the chosen file named %s\n",tempName);
      *flag = 1;
    }  
  }
  if(*flag == 0){
    printf("The file %s was not found. Try again \n",targetFileName);
    printf("\n"); 
  }
  
  if(*flag == 1)
  {
    CreateDirectory(list);
    
  }
  //Close the directory 
  closedir(currDir); 
   
}



// If users chose procesing files then  print 3 more options to users. 
void printMenu2(struct movie*list, int *flag){
  
  int choices = 0;
  printf("Which file you want to process?\n");
  printf("Enter 1 to pick the largest file\n");
  printf("Enter 2 to pick the smallest file\n");
  printf("Enter 3 to specify the name of a file\n");
  printf("\n");
  printf("Enter a choice from 1 to 3:");
  scanf("%d",&choices);
  
  // set flag = 1 for not exiting to the main when user select opeiton 3, only if user found the text file to exit to the mian. 
  switch (choices)
      {
        case 1:
          FindTheLargestFile(list);
          *flag = 1;
            break;
        case 2:
          FindSmallestFile(list);
          *flag = 1;
            break;
        case 3:
         *flag = 0;
         specifyingNameFile(list,flag); 
         printf("\n"); 
             break;
        default:
          printf("Invalid input, please select again:\n");
          break;
       } 
}



int main(int argc, char *argv[]){

  struct movie *list = processFile("movies_sample_1.csv");
    //if user didn't include a txt file then print a message
    if (argc < 2)
    {
        printf("You must provide the name of the file to process\n");
        printf("Example usage: ./movies movie_sample_1.csv\n");
        return EXIT_FAILURE;
    }

  int option1 = 0, option2 = 0,flag1 = 0;  
  // declare a pointer to point flag1 in order to if user chose option 3 and didn't find the file not go back to the main untill user find the file they want to. 
  int *flag = &flag1;
  // call printMenu function
  option1 = PrintMenu();
  while(option1!= 2){
    if(option1 == 1){
      printf("\n");
      printMenu2(list, flag);
      while(*flag == 0){
        printMenu2(list,flag);
      } 
    }
    else if (option1 == 2){
      printf("Thanks for using the program!\n");
      exit(1);
    }
    else{
      printf("\nYou entered an incorrect choice. Try again.\n");
    }
  
    printf("\n");
    option1 = PrintMenu();

  } 
  return 0;
}
