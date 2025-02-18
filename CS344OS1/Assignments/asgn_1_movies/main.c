#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h> // For the bool fuction 

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


//Print the menue 
int PrintMenu()
{
  int selections = 0;
  printf("1. Show movies released in the specified year\n");
  printf("2. Show highest rated movie for each year\n");
  printf("3. Show the title and year of release of all movies in a specific language\n");
  printf("4. Exit from the program\n\n");
  printf("Enter a choice from 1 to 4: ");
  scanf("%d",&selections);
  
  // Check user input, if it is an integer then return to the main()
  // If user input is not an integer then prompt a message to the user and exit the program.
  if(selections){
    return selections;
  }else{
     printf("Sorry, you input is invalid!\n");
     printf("Thank you for using the program!!!\n");
     exit(1);
  }
}


 //show movies to the user base on users' input,
 //if information can be found in the file then print the names of the film, 
 //if it can't be found then print a message to the user to inform 
 //that there are no data shown about that year.
 void serchMovieByYear(struct movie *list,int target)
 {

  int flag = 0;
  //Use if statement to check if target is valid input,else print a error 
  struct movie* head = list;
  struct movie* temp = NULL;
  temp = head;
  
  //if the target is not true then print a message to the user and 
  //call the printMenu() to let users select again, 
  //otherwise traverse the whole singly linked list t to find the data, 
  //if data is found then print the found data, 
  //if not print a message to the user that data is no show
  if(target){
    
      if (head == NULL&& temp == NULL){
        printf("The list is empty!\n ");
      }
      else{
        while (head!= NULL && temp!= NULL){
          if(temp->year == target){   
             printf("%s\n", temp->titles);
             temp = temp->next;
             flag = 1;
        	} 
          else if(temp!= NULL && temp->year != target ){
               temp = temp->next;	
               if(temp == NULL&& flag == 0){
                  printf("\n No data about movies released in the year %d \n",target);
               }    
        
          }

        }

      }
          
  }else{
    printf("Invalid input,pelase select again: \n");
    PrintMenu();
  }
  
 }
 

// This function is using strcasestr to find the fist occurence of the substring needle in fullstr,
//it targetStr is found in fullstr tehn return a pointer to the beginning of the substring,
// or NULL if the substring is not found.
bool findTargetLan(char const *fullstr, char const *targetStr)
{
  char *subString = strcasestr(fullstr, targetStr);
  if (subString)
	{
		return true;
	}
	else
	{
		return false;
	}	
  
}


//Seearching by different languges 
void serchMovieByLanguages(struct movie *list){
  int flag = 0;
  char targetLanguage[20];
  struct movie* temp = list;
  
  //Get user input store in static char array targetLanguage
  printf("Enter the language for which you want to see movies: \n");
  scanf("%s",targetLanguage);
  
  //while linked list is not empty then traverse the LinkedList to find the specific data, 
  //if data is found then print the data, 
  //if data is not shown then prompt a message to the user that no data is shown
	while (temp != NULL && list != NULL){
		if (findTargetLan( temp->languages,targetLanguage)== true)
		{
			flag =1	;
			printf("%d %s\n", temp->year, temp->titles);
		}
		temp = temp->next;
	}

	if (flag == 0)
	{
		printf("\nNo data about movies released in %s.\n",targetLanguage);
	}

}
 
// Swap movie a and b
void swap(struct movie *a, struct movie *b) 
{ 
    int tempYear = a->year; 
    a->year = b->year; 
    b->year = tempYear;
    
    float tempRatingVal = a->ratingValue;
    a->ratingValue = b->ratingValue;
    b->ratingValue =tempRatingVal;
    
    char* tempTitle = a->titles;
    a->titles = b->titles;
    b->titles = tempTitle;

    char *tempLan = a->languages;
    a->languages = b->languages;
    b->languages = tempLan;
} 


// Use bubble_Sort to sort linked list in increasing order base on diffrient years
// bubble sort algorithm is refrenced on geeksforgeeks
//(https://www.geeksforgeeks.org/sorting-algorithms/)
 struct movie *bubble_sort(struct movie *list ){
  struct movie* head = list;
  int swapped, i; 
  struct movie *ptr1; 
  struct movie *lptr = NULL; 
  
    /* Checking for empty list */
    if (head == NULL) 
        printf("list is empty");
    // if linekd list if not empty then sort the list
    do
    { 
        swapped = 0; 
        ptr1 = head; 
  
        while (ptr1->next != lptr) 
        { 
            if (ptr1->year > ptr1->next->year) 
            { 
                swap(ptr1, ptr1->next); 
                swapped = 1; 
            } 
            ptr1 = ptr1->next; 
        } 
        lptr = ptr1; 
    } 
    while (swapped); 
  return list;
 }


// Use bubble sort to sort the linked list base on year, 
//then use  prev and curr pointers to traverse the linked list based on year, if the year is  not the same, then print the data, if the movie's year is the same //
//then compare their rating value find the highest rating value then store it in a temp variable until it finds the highest one then print   
void serchMovieByRatingVal(struct movie *list){
  
  //
  struct movie* sortedList = bubble_sort(list);
  struct movie* curr = sortedList;

  float currentHighestRating = curr->ratingValue;
  int currentHighestYear = curr->year;
  int previousYear = currentHighestYear;
  char* currentHighestTitle = (char*)malloc(strlen(curr->titles)*sizeof(char));
  strcpy(currentHighestTitle, curr->titles);

  while(curr->next != NULL)
  {
    curr = curr->next;
    // Accoding to sorted list, if year changes which means that the year is unique then we can simply print rating value,so we can check if year changed.
    if(curr->year != previousYear)
    {
      //in this case, print highest
      printf("%d %.1f %s\n", currentHighestYear, currentHighestRating, currentHighestTitle);
      previousYear = curr->year;
      currentHighestYear = curr->year;

      //Fill in new year's information (with the first node of new year)
      free(currentHighestTitle);
      currentHighestTitle = (char*)malloc(strlen(curr->titles)*sizeof(char));
      strcpy(currentHighestTitle, curr->titles);
      currentHighestRating = curr->ratingValue;
    }
    else
    {
      //check if current node is higher than previous highest
      if(curr->ratingValue > currentHighestRating)
      {
        free(currentHighestTitle);
        currentHighestTitle = (char*)malloc(strlen(curr->titles)*sizeof(char));
        strcpy(currentHighestTitle, curr->titles);
        currentHighestRating = curr->ratingValue;
      }
      // Print the last element in the linked list 
      else if (curr->next == NULL)
      {
         printf("%d %.1f %s\n", currentHighestYear, currentHighestRating, currentHighestTitle);

      }
      
    }
   
  }

}


int main(int argc, char *argv[]) 
{
  struct movie *list = processFile("movies_sample_1.csv");
  int options= 0, MAX_SIZE = 40,targetYear = 0, i = 0;
  

  options = PrintMenu();
  while(options!= 4){
    if(options == 1){
      printf("Enter the year for which you want to see movies: ");
      scanf("%d",&targetYear);
      printf("\n");
      serchMovieByYear(list,targetYear);
    }
    else if (options== 2){
      serchMovieByRatingVal(list);
    }
    else if (options == 3){
      printf("\n");
      serchMovieByLanguages(list);
    }
    else if (options == 4){
      printf("Thanks for using the program!\n");
      exit(1);
    }
    else
    {
      printf("\nYou entered an incorrect choice. Try again.\n");
    }
    printf("\n");
    options = PrintMenu();
    
  }
   return 0;
}