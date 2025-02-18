CFLAGS = -g --std=gnu99 -Wall

all: line_processor 

line_processor:
	gcc $(CFLAGS) -pthread -o line_processor main.c

run1:
	./line_processor < input1.txt

run2:
	./line_processor < input2.txt

run3:
	./line_processor < input3.txt
	
clean:
	rm line_processor
