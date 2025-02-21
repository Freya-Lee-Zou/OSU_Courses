
// Monte Carlo simulation of golf balls:

// system includes
#include <stdio.h>
#define _USE_MATH_DEFINES
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <omp.h>
#include <assert.h>
#include <malloc.h>

// CUDA runtime
#include <cuda_runtime.h>

// Helper functions and utilities to work with CUDA
#include "helper_functions.h"
#include "helper_cuda.h"

// setting the number of trials in the monte carlo simulation:
#ifndef NUMTRIALS
#define NUMTRIALS	131072
#endif

#ifndef BLOCKSIZE
#define BLOCKSIZE	64     // number of threads per block
#endif

#define NUMBLOCKS	( NUMTRIALS / BLOCKSIZE )


#define CSV

#define GRAVITY		32.2f

const float BEFOREY = 70.f;
const float AFTERY  = 10.f;
const float DISTX   = 50.f;

__device__ const float RADIUS   =    5.f;		// so that the device (GPU) can see this variable

const float BEFOREYDY = 5.f;
const float AFTERYDY  = 1.f;
const float DISTXDX   = 5.f;

float	hbeforey[NUMTRIALS];
float	haftery[NUMTRIALS];
float	hdistx[NUMTRIALS];
int	hsuccesses[NUMTRIALS];


float
Ranf(float low, float high)
{
	float r = (float)rand();               // 0 - RAND_MAX
	float t = r / (float)RAND_MAX;       // 0. - 1.

	return   low + t * (high - low);
}


// call this if you want to force your program to use
// a different random number sequence every time you run it:
void
TimeOfDaySeed()
{
	struct tm y2k = { 0 };
	y2k.tm_hour = 0;   y2k.tm_min = 0; y2k.tm_sec = 0;
	y2k.tm_year = 100; y2k.tm_mon = 0; y2k.tm_mday = 1;

	time_t  timer;
	time(&timer);
	double seconds = difftime(timer, mktime(&y2k));
	unsigned int seed = (unsigned int)(1000. * seconds);    // milliseconds
	srand(seed);
}


void
CudaCheckError()
{
	cudaError_t e = cudaGetLastError();
	if (e != cudaSuccess)
	{
		fprintf(stderr, "Cuda failure %s:%d: '%s'\n", __FILE__, __LINE__, cudaGetErrorString(e));
	}
}


__device__
float
Sqr(float x)
{
	return x * x;
}


__device__
float
Length(float dx, float dy)
{
	return  sqrt(Sqr(dx) + Sqr(dy));
}


#define IN
#define OUT

__global__
void
MonteCarlo( IN float* dbeforey, IN float* daftery, IN float* ddistx, OUT int* dsuccesses)
{
	//unsigned int numItems = blockDim.x;		// don't need this for this project
	//unsigned int wgNum    = blockIdx.x;		// don't need this for this project
	//unsigned int tnum     = threadIdx.x;		// don't need this for this project
	// "gid", the global identifier, is essentially the for-loop index:
	unsigned int gid = blockIdx.x * blockDim.x + threadIdx.x;

	dsuccesses[gid] = 0;

	// randomize everything:

	float beforey = dbeforey[gid];
	float aftery  = daftery[gid];
	float distx   = ddistx[gid];

	float vx = sqrt(2.*GRAVITY*(beforey - aftery));
	float t  = sqrt(2.f * aftery / GRAVITY);
	float x  = vx * t;
	if (fabs(x - distx) <= RADIUS)
		dsuccesses[gid] = 1;
}


int
main(int argc, char* argv[])
{
	TimeOfDaySeed();               // seed the random number generator

	// fill the random-value arrays:
	for (int n = 0; n < NUMTRIALS; n++)
	{
		hbeforey[n] = Ranf(BEFOREY - BEFOREYDY, BEFOREY + BEFOREYDY);
		haftery[n]  = Ranf(AFTERY - AFTERYDY,   AFTERY + AFTERYDY);
		hdistx[n]   = Ranf(DISTX - DISTXDX,     DISTX + DISTXDX);
	}

	// allocate device memory:

	float* dbeforey, * daftery, * ddistx;
	int*   dsuccesses;

	cudaMalloc((void**)(&dbeforey), NUMTRIALS * sizeof(float));
	cudaMalloc((void**)(&daftery),  NUMTRIALS * sizeof(float));
	cudaMalloc((void**)(&ddistx),   NUMTRIALS * sizeof(float));

	cudaMalloc((void**)(&dsuccesses), NUMTRIALS * sizeof(int));

	CudaCheckError();


	// copy host memory to the device:

	cudaMemcpy(dbeforey, hbeforey, NUMTRIALS * sizeof(float), cudaMemcpyHostToDevice);
	cudaMemcpy(daftery,haftery,  NUMTRIALS * sizeof(float), cudaMemcpyHostToDevice);
	cudaMemcpy(ddistx, hdistx,   NUMTRIALS * sizeof(float),   cudaMemcpyHostToDevice);

	CudaCheckError();


	// setup the execution parameters:
	dim3 threads(BLOCKSIZE, 1, 1);
	dim3 grid(NUMBLOCKS, 1, 1);

	// create and start timer
	cudaDeviceSynchronize();

	// allocate CUDA events that we'll use for timing:
	cudaEvent_t start, stop;
	cudaEventCreate(&start);
	CudaCheckError();
	cudaEventCreate(&stop);
	CudaCheckError();

	// record the start event:
	cudaEventRecord(start, NULL);
	CudaCheckError();

	// execute the kernel:
	MonteCarlo<<< grid, threads >>>(dbeforey, daftery, ddistx, dsuccesses);

	// record the stop event:
	cudaEventRecord(stop, NULL);

	// wait for the stop event to complete:
	cudaEventSynchronize(stop);

	float msecTotal = 0.0f;
	cudaEventElapsedTime(&msecTotal, start, stop);
	CudaCheckError();

	// copy result from the device to the host:
	cudaMemcpy(hsuccesses, dsuccesses, NUMTRIALS * sizeof(int), cudaMemcpyDeviceToHost);
	CudaCheckError();

	// compute the sum :
	int numSuccesses = 0;
	for (int i = 0; i < NUMTRIALS; i++)
	{
		numSuccesses += hsuccesses[i];
	}

	float probability = (float)numSuccesses / (float)NUMTRIALS;

	// compute and print the performance:
	double secondsTotal    = 0.001 * (double)msecTotal;
	double trialsPerSecond = (float)NUMTRIALS / secondsTotal;
	double megaTrialsPerSecond = trialsPerSecond / 1000000.;

#ifdef CSV
	fprintf(stderr, "%10d , %8d , %10.4lf , %6.2f\n",
		NUMTRIALS, BLOCKSIZE, megaTrialsPerSecond, 100.f * probability);
#else
	fprintf(stderr, "Number of Trials = %10d, Blocksize = %8d, MegaTrials/Second = %10.4lf, Probability = %6.2f%%\n",
		NUMTRIALS, BLOCKSIZE, megaTrialsPerSecond, 100. * probability);
#endif

	// clean up device memory:
	cudaFree(dbeforey);
	cudaFree(daftery);
	cudaFree(ddistx);
	cudaFree(dsuccesses);

	CudaCheckError();

	return 0;
}