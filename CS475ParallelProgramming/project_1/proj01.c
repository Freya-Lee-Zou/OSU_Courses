#include <stdio.h>
#define _USE_MATH_DEFINES
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <omp.h>

// print debugging messages?
#ifndef DEBUG
#define DEBUG	false
#endif

// setting the number of threads:
#ifndef NUMT
#define NUMT		    2
#endif

// setting the number of trials in the monte carlo simulation:
#ifndef NUMTRIALS
#define NUMTRIALS	50000
#endif

// how many tries to discover the maximum performance:
#define NUMTIMES	20

#define CSV

// ranges for the random numbers:

#define GRAVITY		32.2f


const float BEFOREY     =   80.f;
const float AFTERY  =   20.f;
const float DISTX    =   70.f;
const float RADIUS   =    3.f;

const float BEFOREYDY   =    5.f;
const float AFTERYDY =   1.f;
const float DISTXDX   =   5.f;

float	BeforeY[NUMTRIALS];
float	AfterY[NUMTRIALS];
float	DistX[NUMTRIALS];



float
Ranf( float low, float high )
{
        float r = (float) rand();               // 0 - RAND_MAX
        float t = r  /  (float) RAND_MAX;       // 0. - 1.

        return   low  +  t * ( high - low );
}

// call this if you want to force your program to use
// a different random number sequence every time you run it:
void
TimeOfDaySeed( )
{
	struct tm y2k = { 0 };
	y2k.tm_hour = 0;   y2k.tm_min = 0; y2k.tm_sec = 0;
	y2k.tm_year = 100; y2k.tm_mon = 0; y2k.tm_mday = 1;

	time_t  timer;
	time( &timer );
	double seconds = difftime( timer, mktime(&y2k) );
	unsigned int seed = (unsigned int)( 1000.*seconds );    // milliseconds
	srand( seed );
}


int 
main( int argc, char *argv[ ] )
{
#ifdef _OPENMP
	#ifndef CSV
		fprintf( stderr, "OpenMP is supported -- version = %d\n", _OPENMP );
	#endif
#else
        fprintf( stderr, "No OpenMP support!\n" );
        return 1;
#endif

        TimeOfDaySeed( );               // seed the random number generator

        omp_set_num_threads( NUMT );    // set the number of threads to use in parallelizing the for-loop:`

        // better to define these here so that the rand() calls don't get into the thread timing:
        // fill the random-value arrays:
        for( int n = 0; n < NUMTRIALS; n++ )
        {
                BeforeY[n] = Ranf(  BEFOREY - BEFOREYDY, BEFOREY + BEFOREYDY );
                AfterY[n]  = Ranf(  AFTERY - AFTERYDY, AFTERY + AFTERYDY );
                DistX[n]   = Ranf(  DISTX - DISTXDX, DISTX + DISTXDX );
        }

        // get ready to record the maximum performance and the probability:
        double  maxPerformance = 0.;    // must be declared outside the NUMTIMES loop
        int     numSuccesses;                // must be declared outside the NUMTIMES loop

        // looking for the maximum performance:
        for( int times = 0; times < NUMTIMES; times++ )
        {
                double time0 = omp_get_wtime( );

                numSuccesses = 0;

                #pragma omp parallel for default(none) shared(BeforeY, AfterY, DistX, stderr) reduction(+:numSuccesses)
                for( int n = 0; n < NUMTRIALS; n++ )
                {
                        // randomize everything:
			float beforey = BeforeY[n];
			float aftery  = AfterY[n];
			float distx   = DistX[n];
                        const float RADIUS = 3.f;

			float vx = sqrt(2.0f * GRAVITY *(beforey - aftery));
			float t  = sqrt(2.0f * aftery/GRAVITY);
			float dx  = vx * t;
                        
                        
			if(fabs(dx - distx) <= RADIUS)
				numSuccesses++;

                } // for( # of  monte carlo trials )

                double time1 = omp_get_wtime( );
                double megaTrialsPerSecond = (double)NUMTRIALS / ( time1 - time0 ) / 1000000.;
                if( megaTrialsPerSecond > maxPerformance )
                        maxPerformance = megaTrialsPerSecond;

        } // for ( # of timing tries )
        // printf("numSuccesses: %d\n", numSuccesses);
        // printf("NUMTRIALS: %d\n", NUMTRIALS);
        float probability = (float)numSuccesses/(float)( NUMTRIALS );        // just get for last NUMTIMES run


#ifdef CSV
        fprintf(stderr, "%2d , %8d , %6.2f , %6.2lf\n",
                NUMT, NUMTRIALS, 100.*probability, maxPerformance);
#else
        fprintf(stderr, "%2d threads : %8d trials ; probability = %6.2f ; megatrials/sec = %6.2lf\n",
                NUMT, NUMTRIALS, 100.*probability, maxPerformance);
#endif

}
