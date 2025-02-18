----------------I included the makefile-----------------
To compile this program use command: make all
To run the object file with input1.txt use command: make run1
To run the object file with input2.txt use command: make run2
To run the object file with input3.txt use command: make run3


**********************HINT**********************************
if these command: make run1, run2 and run 3 don't work, please try the follwoing: 
To compile program: gcc -g --std=gnu99 -Wall -pthread -o line_processor main.c
To Run object file with input text files:  ./line_processor < (input_.txt file)