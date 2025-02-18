#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <string.h>
#include <unistd.h> // pipe
#include <time.h>


#define ALLOWED_CHARS "ABCDEFGHIJKLMNOPQRSTUVWXYZ "

//****************************************************************************
// This program  creates a key file of specified length.                     *
// The characters in the file generated will be any of the 27 ALLOWED_CHARS, *     
// generated using the standard Unix randomization methods.                  *
//****************************************************************************


int main (int argc, char* argv[]){

  // Seed the random number generator
  srand(time(NULL)); 

  int kyeLength = -1;
  int i= -1;
  
  // Check the number of command-line arguments
  if (argc != 2) {
      fprintf(stderr, "Usage: %s keylength\n", argv[0]);
      exit(1);
  }
  // Read the key length from the command-line arguments
  char* key = malloc(kyeLength + 1);
  kyeLength = atoi(argv[1]);
  // if length is negative or 0, then print a message to users
  if (kyeLength <= 0) {
      fprintf(stderr, "%s: Invalid key length '%s'.\n", argv[0], argv[1]);
      exit(1);
  }
  
  // get size of the varibale sizeAllowedChar
  int sizeAllowedChar = sizeof(ALLOWED_CHARS)-1;

  // printf("sizeAllowedChar is %d \n",sizeAllowedChar);
  // Generate keylengthrandom uppercase letters and print them
  for (i = 0; i < kyeLength ; i++) {
    //generates a random character from the ALLOWED_CHARS string and stores it in the key array at position i. 
    key[i] = ALLOWED_CHARS[(rand() % sizeAllowedChar)];
  }
  
  // Add null terminator at the end of the key string
  key[kyeLength+1] = '\0';
  // print the generated ky on terminal
  printf("%s\n",key);
  return 0;
}
