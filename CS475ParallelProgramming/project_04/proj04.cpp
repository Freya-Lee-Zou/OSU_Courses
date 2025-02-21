#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <ctime>
#include <sys/time.h>
#include <sys/resource.h>
#include <omp.h>

// SSE stands for Streaming SIMD Extensions

#define SSE_WIDTH 4
#define ALIGNED __attribute__((aligned(16)))

#define NUMTRIES 100

ALIGNED float *A;
ALIGNED float *B;
ALIGNED float *C;

void SimdMul(float *, float *, float *, int);
void NonSimdMul(float *, float *, float *, int);
float SimdMulSum(float *, float *, int);
float NonSimdMulSum(float *, float *, int);

int main(int argc, char *argv[])
{
    int sizes[] = {1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608};
    int numSizes = sizeof(sizes) / sizeof(sizes[0]);

    printf("ArraySize,NonSIMD_Mult,SIMD_Mult,Speedup_Mult,NonSIMD_MultSum,SIMD_MultSum,Speedup_MultSum\n");

    for (int s = 0; s < numSizes; s++)
    {
        int arraySize = sizes[s];

        // Allocate memory for arrays
        A = (float *)aligned_alloc(16, arraySize * sizeof(float));
        B = (float *)aligned_alloc(16, arraySize * sizeof(float));
        C = (float *)aligned_alloc(16, arraySize * sizeof(float));

        // Initialize arrays
        for (int i = 0; i < arraySize; i++)
        {
            A[i] = sqrtf((float)(i + 1));
            B[i] = sqrtf((float)(i + 1));
        }

        // Non-SIMD Multiplication
        double maxPerformance = 0.;
        for (int t = 0; t < NUMTRIES; t++)
        {
            double time0 = omp_get_wtime();
            NonSimdMul(A, B, C, arraySize);
            double time1 = omp_get_wtime();
            double perf = (double)arraySize / (time1 - time0);
            if (perf > maxPerformance)
                maxPerformance = perf;
        }
        double megaMults = maxPerformance / 1000000.;
        double nonSimdMultPerf = megaMults;

        // SIMD Multiplication
        maxPerformance = 0.;
        for (int t = 0; t < NUMTRIES; t++)
        {
            double time0 = omp_get_wtime();
            SimdMul(A, B, C, arraySize);
            double time1 = omp_get_wtime();
            double perf = (double)arraySize / (time1 - time0);
            if (perf > maxPerformance)
                maxPerformance = perf;
        }
        megaMults = maxPerformance / 1000000.;
        double simdMultPerf = megaMults;

        // Non-SIMD Multiplication and Sum
        maxPerformance = 0.;
        float sumn, sums;
        for (int t = 0; t < NUMTRIES; t++)
        {
            double time0 = omp_get_wtime();
            sumn = NonSimdMulSum(A, B, arraySize);
            double time1 = omp_get_wtime();
            double perf = (double)arraySize / (time1 - time0);
            if (perf > maxPerformance)
                maxPerformance = perf;
        }
        double megaMultAdds = maxPerformance / 1000000.;
        double nonSimdMultSumPerf = megaMultAdds;

        // SIMD Multiplication and Sum
        maxPerformance = 0.;
        for (int t = 0; t < NUMTRIES; t++)
        {
            double time0 = omp_get_wtime();
            sums = SimdMulSum(A, B, arraySize);
            double time1 = omp_get_wtime();
            double perf = (double)arraySize / (time1 - time0);
            if (perf > maxPerformance)
                maxPerformance = perf;
        }
        megaMultAdds = maxPerformance / 1000000.;
        double simdMultSumPerf = megaMultAdds;

        // Calculate Speedups
        double multSpeedup = simdMultPerf / nonSimdMultPerf;
        double multSumSpeedup = simdMultSumPerf / nonSimdMultSumPerf;

				#ifdef CSV
        	fprintf("%d,%.2lf,%.2lf,%.2lf,%.2lf,%.2lf,%.2lf\n",
               arraySize, nonSimdMultPerf, simdMultPerf, multSpeedup);
					// fprintf("%d,%.2lf,%.2lf,%.2lf,%.2lf,%.2lf,%.2lf\n",
          //      arraySize, nonSimdMultPerf, simdMultPerf, multSpeedup,
          //      nonSimdMultSumPerf, simdMultSumPerf, multSumSpeedup);
				#else
        	printf("%d,%.2lf,%.2lf,%.2lf,%.2lf,%.2lf,%.2lf\n",
               arraySize, nonSimdMultPerf, simdMultPerf, multSpeedup,
               nonSimdMultSumPerf, simdMultSumPerf, multSumSpeedup);
				#endif


        // Free allocated memory
        free(A);
        free(B);
        free(C);
    }

    return 0;
}

void NonSimdMul(float *A, float *B, float *C, int n)
{
    for (int i = 0; i < n; i++)
    {
        C[i] = A[i] * B[i];
    }
}

float NonSimdMulSum(float *A, float *B, int n)
{
    float sum = 0.0;
    for (int i = 0; i < n; i++)
    {
        sum += A[i] * B[i];
    }
    return sum;
}

void SimdMul(float *a, float *b, float *c, int len)
{
    int limit = (len / SSE_WIDTH) * SSE_WIDTH;
    __asm(
        ".att_syntax\n\t"
        "movq    -24(%rbp), %r8\n\t" // a
        "movq    -32(%rbp), %rcx\n\t" // b
        "movq    -40(%rbp), %rdx\n\t" // c
    );

    for (int i = 0; i < limit; i += SSE_WIDTH)
    {
        __asm(
            ".att_syntax\n\t"
            "movups (%r8), %xmm0\n\t" // load the first sse register
            "movups (%rcx), %xmm1\n\t" // load the second sse register
            "mulps  %xmm1, %xmm0\n\t" // do the multiply
            "movups %xmm0, (%rdx)\n\t" // store the result
            "addq $16, %r8\n\t"
            "addq $16, %rcx\n\t"
            "addq $16, %rdx\n\t"
        );
    }

    for (int i = limit; i < len; i++)
    {
        c[i] = a[i] * b[i];
    }
}

float SimdMulSum(float *a, float *b, int len)
{
    float sum[4] = {0., 0., 0., 0.};
    int limit = (len / SSE_WIDTH) * SSE_WIDTH;

    __asm(
        ".att_syntax\n\t"
        "movq    -40(%rbp), %r8\n\t" // a
        "movq    -48(%rbp), %rcx\n\t" // b
        "leaq    -32(%rbp), %rdx\n\t" // &sum[0]
        "movups  (%rdx), %xmm2\n\t" // 4 copies of 0. in xmm2
    );

    for (int i = 0; i < limit; i += SSE_WIDTH)
    {
        __asm(
            ".att_syntax\n\t"
            "movups (%r8), %xmm0\n\t" // load the first sse register
            "movups (%rcx), %xmm1\n\t" // load the second sse register
            "mulps  %xmm1, %xmm0\n\t" // do the multiply
            "addps  %xmm0, %xmm2\n\t" // do the add
            "addq $16, %r8\n\t"
            "addq $16, %rcx\n\t"
        );
    }

    __asm(
        ".att_syntax\n\t"
        "movups  %xmm2, (%rdx)\n\t" // copy the sums back to sum[ ]
    );

    for (int i = limit; i < len; i++)
    {
        sum[0] += a[i] * b[i];
    }

    return sum[0] + sum[1] + sum[2] + sum[3];
}
