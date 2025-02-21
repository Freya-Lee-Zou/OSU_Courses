/***************************************
Studnet: YA Zou
date: Apr,25,2024
Project 2: Functional Decompositon
****************************************/

#include <math.h>
#include <time.h> 
#include <stdlib.h>
#include <stdio.h>
#include <omp.h>




int	NowYear;		// 2024- 2029
int	NowMonth;		// 0 - 11

float	NowPrecip;		// inches of rain per month
float	NowTemp;		// temperature this month
float	NowHeight;		// grain height in inches
int	    NowNumDeer;		// number of deer in the current population

float NowDeerFarmer;    // Represents that much deers will be hunted my farmers
float NowGrainFarmer;   // Represents percent of height in grains cut by farmers
int     PrintMonthCTR;

const float GRAIN_GROWS_PER_MONTH   =	       12.0;
const float ONE_DEER_EATS_PER_MONTH    =	   1.0;
const float AVG_PRECIP_PER_MONTH =		       7.0;	// average
const float AMP_PRECIP_PER_MONTH =		       6.0;	// plus or minus
const float RANDOM_PRECIP =			           2.0;	// plus or minus noise
const float AVG_TEMP =				60.0;	// average
const float AMP_TEMP =				20.0;	// plus or minus
const float RANDOM_TEMP =			10.0;	// plus or minus noise
const float MIDTEMP =				40.0;
const float MIDPRECIP =				10.0;

unsigned int seed = 0;

// barrier variables 
omp_lock_t	Lock;
int		NumInThreadTeam;
int		NumAtBarrier;
int		NumGone;

// Function prototypes
void InitBarrier( int );
void WaitBarrier( );
float Ranf(float low, float high,unsigned int* seed );
int Ranf(unsigned int *seedp, int ilow, int ihigh);
float SQR(float x);
void Deer();
void Grain();
void Watcher();
void Farmer();


void InitBarrier( int n )
{
    NumInThreadTeam = n;
    NumAtBarrier = 0;
    omp_init_lock( &Lock );      
}

void WaitBarrier( )
{
    omp_set_lock( &Lock );
    {
        NumAtBarrier++;
        if( NumAtBarrier == NumInThreadTeam )
        {
            NumGone = 0;
            NumAtBarrier = 0;
            // let all other threads get back to what they were doing
            // before this one unlocks, knowing that they might immediately
            // call WaitBarrier( ) again:
            while( NumGone != NumInThreadTeam-1 );
            omp_unset_lock( &Lock );
            return;
        }
    }
    omp_unset_lock( &Lock );
    // this waits for the nth thread to arrive
    while( NumAtBarrier != 0 );	
    #pragma omp atomic
    NumGone++;			// this flags how many threads have returned
}


float SQR(float x) {
    return x*x;
}

float Ranf(unsigned int *seedp, float low, float high) {
    float r = (float) rand_r( seedp ); // 0 - RAND_MAX
    return(low+r*(high-low)/(float)RAND_MAX);
}


int Ranf(unsigned int *seedp, int ilow, int ihigh) {
    float low = (float)ilow;
    float high = (float)ihigh + 0.9999f;
    return (int)(Ranf(seedp, low,high));
}

// helper funtion to  update temp and precip
void helperRecalculte() {
    float ang = (  30.*(float)NowMonth + 15.  ) * ( M_PI / 180. );
    
    float temp = AVG_TEMP - AMP_TEMP * cos( ang );
    NowTemp = temp + Ranf( &seed, -RANDOM_TEMP, RANDOM_TEMP );

    float precip = AVG_PRECIP_PER_MONTH + AMP_PRECIP_PER_MONTH * sin( ang );
    NowPrecip = precip + Ranf( &seed,  -RANDOM_PRECIP, RANDOM_PRECIP );
    if( NowPrecip < 0. ) {
        NowPrecip = 0.;
    }
}

// Threads start here 
void Deer() {
    //int nextXXX= << function of what all states are right Now >>
    // compute a temporary next-value for this quantity
    // based on the current state of the simulation:
    while(NowYear < 2030) {
        
        int nextNumDeer = NowNumDeer;
        int carryingCapacity = (int)( NowHeight );
        if( nextNumDeer < carryingCapacity )
            nextNumDeer++;
        else
            if( nextNumDeer > carryingCapacity )
                nextNumDeer--;

        if( nextNumDeer < 0 )
            nextNumDeer = 0;

        // Modify if Disease is Present
        if (NowDeerFarmer > .0) {
            nextNumDeer = nextNumDeer - int(nextNumDeer * NowDeerFarmer);
        }
        
        // DoneComputing barrier:
        WaitBarrier( );
        NowNumDeer = nextNumDeer;

        // DoneAssigning barrier:
        WaitBarrier( );

        // DonePrinting barrier:
        WaitBarrier( );
    }
}

void Grain() {

    // compute a temporary next-value for this quantity
    // based on the current state of the simulation:
    while(NowYear < 2030) {
       
        float tempFactor = exp(-SQR((NowTemp-MIDTEMP)/10.));
        float precipFactor = exp(-SQR((NowPrecip-MIDPRECIP)/10.));

        float nextHeight = NowHeight;
        nextHeight += tempFactor*precipFactor*GRAIN_GROWS_PER_MONTH;
        nextHeight -= (float)NowNumDeer*ONE_DEER_EATS_PER_MONTH;

        if (nextHeight < 0.) {
            nextHeight = 0;
        }

        // Modify if Disease
        if (NowGrainFarmer > .0) {
            nextHeight = nextHeight - (nextHeight * NowGrainFarmer);
        }

        // DoneComputing barrier:
        WaitBarrier( );

        NowHeight = nextHeight;
        
        // DoneAssigning barrier:
        WaitBarrier( );

        // DonePrinting barrier:
        WaitBarrier( );
    }
}

// The following funtion is referenced in Copilot
void Farmer() {
    while(NowYear < 2030) {
       // Compute a random number between 2 and 20
        int randNum= Ranf(&seed, 2, 20);
        float NextDeerFarmer = 0.0;
        float NextGrainFarmer = 0.0;
        

        if (randNum % 5 == 0) {
             // Introduce a factor that affects 20% of the deer population
            NextDeerFarmer = 0.2;
        }

        else if (randNum % 8 == 0) {
            NextGrainFarmer = 0.3;
        }
        
        // DoneComputing barrier:
        WaitBarrier( );
        NowDeerFarmer = NextDeerFarmer;
        NowGrainFarmer = NextGrainFarmer;

        // DoneAssigning barrier:
        WaitBarrier( );
        
        // DonePrinting barrier:
        WaitBarrier( );
    }
}

void Watcher() {
    
    while(NowYear < 2030) {
 
        // do nothing 
        WaitBarrier( );

        // do nothing
        WaitBarrier( );
         
        // << write out the “Now” state of data >>
        // << advance time and re-compute all environmental variables >>
        // write out the "noew" state of data
        // advance time and recompute all environmental variables
        // print the current state of the global variables
        // Increment Time
        if (NowMonth >= 11) {
            NowMonth = 0;
            NowYear++;
        }
        else {
            NowMonth++;
        }
        PrintMonthCTR++;

        // update the temp and percip 
        helperRecalculte();

       // print the result
        printf("%d, %6.2f,%6.2f,%d,%6.2f,%d,%d\n", PrintMonthCTR,(5./9.)*(NowTemp-32), (NowPrecip * 2.54),NowNumDeer, (NowHeight * 2.54),int(NowDeerFarmer * 100),int(NowGrainFarmer * 100));

        // DonePrinting barrier:
        WaitBarrier( );
    }
}

int main() {

    // starting date and time:
    NowMonth =    0;
    NowYear  = 2024;
    // starting state (feel free to change this if you want):
    NowNumDeer = 1;
    NowHeight =  1.;

    NowDeerFarmer = 0.;
    NowGrainFarmer = 0.;

    // update temp and percip
    helperRecalculte();


    printf("Month,Temp(C),Precip(cm),NumDeer,Height(cm),NowDeerFarmer,NowGrainFarmer,\n");
    printf("%d, %6.2f,%6.2f,%d,%6.2f,%d,%d\n", PrintMonthCTR,(5./9.)*(NowTemp-32), (NowPrecip * 2.54),NowNumDeer, (NowHeight * 2.54),int(NowDeerFarmer * 100),int(NowGrainFarmer * 100));
    
    omp_set_num_threads(4);
    InitBarrier(4);
    #pragma omp parallel sections
    {
        #pragma omp section
        {
            Deer();
        }

        #pragma omp section
        {
            Grain();
        }

        #pragma omp section
        {
            Watcher();
        }

        #pragma omp section
        {
            Farmer();
        }
    } // implied barrier -- all functions must return in order
	// to allow any of them to get past here
    return 0;
}