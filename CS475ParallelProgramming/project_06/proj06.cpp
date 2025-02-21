// 1. Program header

#include <stdio.h>
#include <math.h>
#include <string.h>
#include <stdlib.h>
#include <omp.h>

#include "cl.h"
#include "cl_platform.h"


// the matrix-width and the number of work-items per work-group:
// note: the matrices are actually MATWxMATW and the work group sizes are LOCALSIZExLOCALSIZE:

#define DATAFILE        "p6.data"

#ifndef DATASIZE
#define DATASIZE        4*1024*1024
#endif

#ifndef LOCALSIZE
#define	LOCALSIZE	8
#endif

#define NUMGROUPS	DATASIZE/LOCALSIZE

// opencl objects:
cl_platform_id		Platform;
cl_device_id		Device;
cl_kernel		Kernel;
cl_program		Program;
cl_context		Context;
cl_command_queue	CmdQueue;


// do we want to print in csv file format?

#define CSV


float			hX[DATASIZE];
float			hY[DATASIZE];

float			hSumx2[DATASIZE];
float			hSumx[DATASIZE];
float			hSumxy[DATASIZE];
float			hSumy[DATASIZE];

const char *		CL_FILE_NAME = { "proj06.cl" };


// function prototypes:
void			SelectOpenclDevice();
char *			Vendor( cl_uint );
char *			Type( cl_device_type );
void			Wait( cl_command_queue );




// // solves the linear equation:
// |A  B|    |m|     |E|
// |    |  * | |  =  | |
// |C  D|    |b|     |F|

void
Solve( float A, float B, float C, float D,   float E, float F,   float *m,   float *b )
{
	float det = A*D - C*B;
	*m = ( E*D - F*B ) / det;
	*b = ( A*F - C*E ) / det;
}



int
main( int argc, char *argv[ ] )
{
	// see if we can even open the opencl kernel program
	// (no point going on if we can't):

	FILE *fp;
#ifdef _WIN32
	errno_t err = fopen_s( &fp, CL_FILE_NAME, "r" );
	if( err != 0 )
#else
	fp = fopen( CL_FILE_NAME, "r" );
	if( fp == NULL )
#endif
	{
		fprintf( stderr, "Cannot open OpenCL source file '%s'\n", CL_FILE_NAME );
		return 1;
	}

	cl_int status;		// returned status from opencl calls -- test against CL_SUCCESS


	// get the platform id and the device id:

	SelectOpenclDevice();		// sets the global variables Platform and Device




	// 2. xreate the host memory buffers:

	// read the data file:

	FILE* fdata;
#ifdef _WIN32
	err = fopen_s(&fdata, DATAFILE, "r");
	if (err != 0)
#else
	fdata = fopen(DATAFILE, "r");
	if (fdata == NULL)
#endif
	{
		fprintf( stderr, "Cannot open data file '%s'\n", DATAFILE );
		return -1;
	}

	float x, y;
	for( int i = 0; i < DATASIZE; i++ )
	{
#ifdef _WIN32
		fscanf_s(fdata, "%f %f", &x, &y);
#else
		fscanf( fdata, "%f %f", &x, &y );
#endif
		hX[i] = x;
		hY[i] = y;
	}
	fclose( fdata );


	// 3. create an opencl context:

	Context = clCreateContext( NULL, 1, &Device, NULL, NULL, &status );
	if( status != CL_SUCCESS )
		fprintf( stderr, "clCreateContext failed\n" );


	// 4. create an opencl command queue:

	CmdQueue = clCreateCommandQueue( Context, Device, 0, &status );
	if( status != CL_SUCCESS )
		fprintf( stderr, "clCreateCommandQueue failed\n" );


	// 5. allocate the device memory buffers:

	size_t xySize = DATASIZE  * sizeof(float);

	cl_mem dX     = clCreateBuffer( Context, CL_MEM_READ_ONLY,  xySize, NULL, &status );
	cl_mem dY     = clCreateBuffer( Context, CL_MEM_READ_ONLY,  xySize, NULL, &status );
	cl_mem dSumx2 = clCreateBuffer( Context, CL_MEM_READ_ONLY,  xySize, NULL, &status );
	cl_mem dSumx  = clCreateBuffer( Context, CL_MEM_READ_ONLY,  xySize, NULL, &status );
	cl_mem dSumxy = clCreateBuffer( Context, CL_MEM_READ_ONLY,  xySize, NULL, &status );
	cl_mem dSumy  = clCreateBuffer( Context, CL_MEM_READ_ONLY,  xySize, NULL, &status );

	if( status != CL_SUCCESS )
		fprintf( stderr, "clCreateBuffer failed\n" );


	// 6. enqueue the 2 commands to write the data from the host buffers to the device buffers:
  status = clEnqueueWriteBuffer( CmdQueue, dX, CL_FALSE, 0, xySize, hX, 0, NULL, NULL );
  if( status != CL_SUCCESS )
	  fprintf( stderr, "clEnqueueWriteBuffer failed (1)\n" );

  status = clEnqueueWriteBuffer( CmdQueue, dY, CL_FALSE, 0, xySize, hY, 0, NULL, NULL );
  if( status != CL_SUCCESS )
    fprintf( stderr, "clEnqueueWriteBuffer failed (2)\n" );

  Wait( CmdQueue );


	// 7. read the kernel code from a file ...

	fseek( fp, 0, SEEK_END );
	size_t fileSize = ftell( fp );
	fseek( fp, 0, SEEK_SET );
	char *clProgramText = new char[ fileSize+1 ];		// leave room for '\0'
	size_t n = fread( clProgramText, 1, fileSize, fp );
	clProgramText[fileSize] = '\0';
	fclose( fp );
	if( n != fileSize )
		fprintf( stderr, "Expected to read %d bytes read from '%s' -- actually read %d.\n", (int)fileSize, CL_FILE_NAME, (int)n );

	// ... and create the kernel program:

	char *strings[1];
	strings[0] = clProgramText;
	Program = clCreateProgramWithSource( Context, 1, (const char **)strings, NULL, &status );
	if( status != CL_SUCCESS )
		fprintf( stderr, "clCreateProgramWithSource failed\n" );
	delete [ ] clProgramText;


	// 8. compile and link the kernel code:

	char *options = { (char *)"" };
	status = clBuildProgram( Program, 1, &Device, options, NULL, NULL );
	if( status != CL_SUCCESS )
	{
		size_t size;
		clGetProgramBuildInfo( Program, Device, CL_PROGRAM_BUILD_LOG, 0, NULL, &size );
		cl_char *log = new cl_char[ size ];
		clGetProgramBuildInfo( Program, Device, CL_PROGRAM_BUILD_LOG, size, log, NULL );
		fprintf( stderr, "clBuildProgram failed:\n%s\n", log );
		delete [ ] log;
	}


	// 9. create the kernel object:

	Kernel = clCreateKernel( Program, "Regression", &status );
	if( status != CL_SUCCESS )
		fprintf( stderr, "clCreateKernel failed\n" );


	// 10. setup the arguments to the kernel object:

	status = clSetKernelArg( Kernel, 0, sizeof(cl_mem), &dX );
  status = clSetKernelArg( Kernel, 1, sizeof(cl_mem), &dY );

  status = clSetKernelArg( Kernel, 2, sizeof(cl_mem), &dSumx2 );
  status = clSetKernelArg( Kernel, 3, sizeof(cl_mem), &dSumx );
  status = clSetKernelArg( Kernel, 4, sizeof(cl_mem), &dSumxy );
  status = clSetKernelArg( Kernel, 5, sizeof(cl_mem), &dSumy );

	// 11. enqueue the kernel object for execution:

	size_t globalWorkSize[3] = { DATASIZE,  1, 1 };
	size_t localWorkSize[3]  = { LOCALSIZE, 1, 1 };

	Wait( CmdQueue );

	double time0 = omp_get_wtime( );

	status = clEnqueueNDRangeKernel( CmdQueue, Kernel, 1, NULL, globalWorkSize, localWorkSize, 0, NULL, NULL );
	if( status != CL_SUCCESS )
		fprintf( stderr, "clEnqueueNDRangeKernel failed: %d\n", status );

	Wait( CmdQueue );
	double time1 = omp_get_wtime( );


	// 12. read the results buffer back from the device to the host:

	status = clEnqueueReadBuffer( CmdQueue, dSumx2, CL_FALSE, 0, xySize, hSumx2, 0, NULL, NULL );
  status = clEnqueueReadBuffer( CmdQueue, dSumx, CL_FALSE, 0, xySize, hSumx , 0, NULL, NULL );
  status = clEnqueueReadBuffer( CmdQueue, dSumxy, CL_FALSE, 0, xySize, hSumxy , 0, NULL, NULL );
  status = clEnqueueReadBuffer( CmdQueue, dSumy, CL_FALSE, 0, xySize, hSumy , 0, NULL, NULL );

  Wait( CmdQueue );

	float sumx  = 0.;
	float sumx2 = 0.;
	float sumxy = 0.;
	float sumy  = 0.;

	for( int i = 0; i < DATASIZE; i++ )
	{
    sumx  += hSumx[i];
    sumx2 += hSumx2[i];
    sumy  += hSumy[i];
    sumxy += hSumxy[i];
	}

	float m, b;
	Solve( sumx2, sumx, sumx, (float)DATASIZE, sumxy, sumy,   &m, &b );
	// fprintf( stderr, "** m = %8.2f, b = %8.2f **\n", m, b );


#ifdef CSV
	fprintf( stderr, "%8d , %6d , %10.2lf\n",
		DATASIZE, LOCALSIZE, (double)DATASIZE/(time1-time0)/1000000. );

#else
	fprintf( stderr, "Array Size: %6d , Work Elements: %4d , MegaPointsProcessedPerSecond: %10.2lf\n",
		DATASIZE, LOCALSIZE, 9.*(double)DATASIZE/(time1-time0)/1000000. );
#endif


	// 13. clean everything up:

	clReleaseKernel(        Kernel   );
	clReleaseProgram(       Program  );
	clReleaseCommandQueue(  CmdQueue );
	clReleaseMemObject(     dSumx2  );
	clReleaseMemObject(     dSumx   );
	clReleaseMemObject(     dSumxy  );
	clReleaseMemObject(     dSumy  );

	return 0;
}


// wait until all queued tasks have taken place:

void
Wait( cl_command_queue queue )
{
      cl_event wait;
      cl_int      status;

      status = clEnqueueMarker( queue, &wait );
      if( status != CL_SUCCESS )
	      fprintf( stderr, "Wait: clEnqueueMarker failed\n" );

      status = clWaitForEvents( 1, &wait );
      if( status != CL_SUCCESS )
	      fprintf( stderr, "Wait: clWaitForEvents failed\n" );
}


// vendor ids:
#define ID_AMD		0x1002
#define ID_INTEL	0x8086
#define ID_NVIDIA	0x10de

void
SelectOpenclDevice()
{
		// select which opencl device to use:
		// priority order:
		//	1. a gpu
		//	2. an nvidia or amd gpu
		//	3. an intel gpu
		//	4. an intel cpu

	int bestPlatform = -1;
	int bestDevice = -1;
	cl_device_type bestDeviceType;
	cl_uint bestDeviceVendor;
	cl_int status;		// returned status from opencl calls
				// test against CL_SUCCESS

	// find out how many platforms are attached here and get their ids:

	cl_uint numPlatforms;
	status = clGetPlatformIDs(0, NULL, &numPlatforms);
	if( status != CL_SUCCESS )
		fprintf(stderr, "clGetPlatformIDs failed (1)\n");

	cl_platform_id* platforms = new cl_platform_id[numPlatforms];
	status = clGetPlatformIDs(numPlatforms, platforms, NULL);
	if( status != CL_SUCCESS )
		fprintf(stderr, "clGetPlatformIDs failed (2)\n");

	for( int p = 0; p < (int)numPlatforms; p++ )
	{
		// find out how many devices are attached to each platform and get their ids:

		cl_uint numDevices;

		status = clGetDeviceIDs(platforms[p], CL_DEVICE_TYPE_ALL, 0, NULL, &numDevices);
		if( status != CL_SUCCESS )
			fprintf(stderr, "clGetDeviceIDs failed (2)\n");

		cl_device_id* devices = new cl_device_id[numDevices];
		status = clGetDeviceIDs(platforms[p], CL_DEVICE_TYPE_ALL, numDevices, devices, NULL);
		if( status != CL_SUCCESS )
			fprintf(stderr, "clGetDeviceIDs failed (2)\n");

		for( int d = 0; d < (int)numDevices; d++ )
		{
			cl_device_type type;
			cl_uint vendor;
			size_t sizes[3] = { 0, 0, 0 };

			clGetDeviceInfo(devices[d], CL_DEVICE_TYPE, sizeof(type), &type, NULL);

			clGetDeviceInfo(devices[d], CL_DEVICE_VENDOR_ID, sizeof(vendor), &vendor, NULL);

			// select:

			if( bestPlatform < 0 )		// not yet holding anything -- we'll accept anything
			{
				bestPlatform = p;
				bestDevice = d;
				Platform = platforms[bestPlatform];
				Device = devices[bestDevice];
				bestDeviceType = type;
				bestDeviceVendor = vendor;
			}
			else					// holding something already -- can we do better?
			{
				if( bestDeviceType == CL_DEVICE_TYPE_CPU )		// holding a cpu already -- switch to a gpu if possible
				{
					if( type == CL_DEVICE_TYPE_GPU )			// found a gpu
					{										// switch to the gpu we just found
						bestPlatform = p;
						bestDevice = d;
						Platform = platforms[bestPlatform];
						Device = devices[bestDevice];
						bestDeviceType = type;
						bestDeviceVendor = vendor;
					}
				}
				else										// holding a gpu -- is a better gpu available?
				{
					if( bestDeviceVendor == ID_INTEL )			// currently holding an intel gpu
					{										// we are assuming we just found a bigger, badder nvidia or amd gpu
						bestPlatform = p;
						bestDevice = d;
						Platform = platforms[bestPlatform];
						Device = devices[bestDevice];
						bestDeviceType = type;
						bestDeviceVendor = vendor;
					}
				}
			}
		}
		delete [ ] devices;
	}
	delete [ ] platforms;


	if( bestPlatform < 0 )
	{
		fprintf(stderr, "I found no OpenCL devices!\n");
		exit( 1 );
	}
	// fprintf(stderr, "I have selected Platform #%d, Device #%d: ", bestPlatform, bestDevice);
	// fprintf(stderr, "Vendor = %s, Type = %s\n", Vendor(bestDeviceVendor), Type(bestDeviceType) );
}

char *
Vendor( cl_uint v )
{
	switch( v )
	{
		case ID_AMD:
			return (char *)"AMD";
		case ID_INTEL:
			return (char *)"Intel";
		case ID_NVIDIA:
			return (char *)"NVIDIA";
	}
	return (char *)"Unknown";
}

char *
Type( cl_device_type t )
{
	switch( t )
	{
		case CL_DEVICE_TYPE_CPU:
			return (char *)"CL_DEVICE_TYPE_CPU";
		case CL_DEVICE_TYPE_GPU:
			return (char *)"CL_DEVICE_TYPE_GPU";
		case CL_DEVICE_TYPE_ACCELERATOR:
			return (char *)"CL_DEVICE_TYPE_ACCELERATOR";
	}
	return (char *)"Unknown";
}