#!/bin/bash

# Compilation options
OPTIONS="-o proj01 -lm -Xpreprocessor -fopenmp"

# Loop over the number of threads
for t in 1 2 4 6 8
do
    export OMP_NUM_THREADS=$t

    # Loop over the number of trials
    for n in 1 10 100 1000 10000 50000 100000 500000 750000 1000000 1500000 2000000
    do
        # Compile the program with the current number of threads and trials
        clang $OPTIONS -DNUMT=$t -DNUMTRIALS=$n main.c -o proj01

        # Run the compiled program
        ./proj01
    done
done
