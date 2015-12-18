#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdint.h>

//<parametrs for managing time spent>
const int timeNAlimit = 10*60; //seconds n/a limit
float curTimeSpent = 0;
clock_t timeStart;
//</parametrs for managing time spent>

const int eachFuncRunCount = 2;


//<helpful functions>
void swap(int *first, int *second) {
    int tmp = *first;
    *first = *second;
    *second = tmp;
}


void printArray(int *arrayPointer, int size) {
    int j;
    for(j = 0; j < size; j++){
        printf("%d_", arrayPointer[j]);
    }
    printf("\n");
}

void fillRandomly(int *arrayPointer, int size) {
    int i;
    for (i = 0; i < size; i++) {
        arrayPointer[i] = rand()%1000000;
    }
}

int checkFunctionTime() {
    curTimeSpent = (float)(clock() - timeStart)/CLOCKS_PER_SEC;

    if(curTimeSpent > timeNAlimit) {
        return 0;
    }

    return 1;
}

int isSorted(int *arrayPointer, int size) {
    int i;
    for (i = 0; i < size - 1; i++) {
        if(arrayPointer[i] > arrayPointer[i + 1]){
            return 0;
        }
    }
    return 1;
}

int findMaxInArray(int *arrayPointer, int size) {
    int i, max = arrayPointer[0];
    for (i = 1; i < size; i++) {
        if (arrayPointer[i] > max) {
            max = arrayPointer[i];
        }
    }
    return max;
}
//</helpful functions>


//<N^2 bubbleSort>
void bubbleSort(int *arrayPointer, int size) {
    int i, j, tmp;

    for (i = 0; i < size - 1; i++) {
        for (j = 0; j < size - 1 - i; j++) {
            if (arrayPointer[j] > arrayPointer[j + 1]) {
                tmp = arrayPointer[j];
                arrayPointer[j] = arrayPointer[j + 1];
                arrayPointer[j + 1] = tmp;
            }
        }

        if (!checkFunctionTime()) return;//timeLimit execution
    }
}
//</N^2 bubbleSort>


//<NLOGN quickSort>
int partition(int *arrayPointer, int startIndex, int endIndex) {//parts the array into left and right part
    int pivotIndex = endIndex;//can change for perfomance reasons
    int pivotIndexAfterPartition = startIndex;

    int i;
    for (i = startIndex; i < endIndex; i++) {
        if (arrayPointer[i] <= arrayPointer[pivotIndex]) {
            swap(&arrayPointer[i], &arrayPointer[pivotIndexAfterPartition]);
            pivotIndexAfterPartition++;
        }
    }

    swap(&arrayPointer[pivotIndexAfterPartition], &arrayPointer[pivotIndex]);

    return pivotIndexAfterPartition;
}

void quick(int *arrayPointer, int startIndex, int endIndex) {
    if (!checkFunctionTime()) return;//timeLimit execution

    if (startIndex >= endIndex) return;

    int pivotIndexAfterPartition = partition(arrayPointer, startIndex, endIndex);

    quick(arrayPointer, startIndex, pivotIndexAfterPartition - 1);
    quick(arrayPointer, pivotIndexAfterPartition + 1, endIndex);
}


void quickSort(int *arrayPointer, int size) {
    quick(arrayPointer, 0, size - 1);
}
//</NLOGN quickSort>


//<NLOGN mergeSort>
void merge(int *arrayPointerLeft, int *arrayPointerRight, int size, int sizeLeft, int sizeRight) {
    int *result = (int *)malloc(size * sizeof(int));
    if(result == NULL) {
        printf("mergeSort: malloc failed");
        return;
    }

    int i = 0, j = 0;
    while (i < sizeLeft && j < sizeRight) {
        if (arrayPointerLeft[i] <= arrayPointerRight[j]) {
            result[i + j] = arrayPointerLeft[i];
            i++;
        } else {
            result[i + j] = arrayPointerRight[j];
            j++;
        }
    }

    if (i == sizeLeft) {//means that all left part already pushed to the back of result, so we push to the back the rest of right part
        memcpy(&result[i + j], &arrayPointerRight[j], (sizeRight - j) * sizeof(int));
    } else {//similar with left part
        memcpy(&result[i + j], &arrayPointerLeft[i], (sizeLeft - i) * sizeof(int));
    }

    memcpy(arrayPointerLeft, result, size * sizeof(int));
    free(result);
}


void mergeSort(int *arrayPointer, int size) {
    if (!checkFunctionTime()) return;//timeLimit execution

    if (size < 2) {
        return;
    }

    int sizeLeft = size / 2, sizeRight = size - sizeLeft;

    int *arrayPointerLeft = arrayPointer;
    int *arrayPointerRight = arrayPointer + sizeLeft;

    mergeSort(arrayPointerLeft, sizeLeft);
    mergeSort(arrayPointerRight, sizeRight);

    merge(arrayPointerLeft, arrayPointerRight, size, sizeLeft, sizeRight);
}
//</NLOGN mergeSort>


//<N countSort>
void countSort(int *arrayPointer, int size) {
    int max = findMaxInArray(arrayPointer, size);
    int *countArrayPointer = (int *)calloc((max + 1), sizeof(int));

    int i, j;
    for (i = 0; i < size; i++) {
        countArrayPointer[arrayPointer[i]]++;
    }

    int b = 0;
    for (i = 0; i <= max; i++) {
        for (j = 0; j < countArrayPointer[i]; j++) {
            arrayPointer[b] = i;
            b++;
        }
    }

    free(countArrayPointer);
}
//</N countSort>





void makeTests() {

    int tests[] = {5, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 10 * 1e6, 100 * 1e6};
    char *str[] = {"5", "10", "100", "1k", "10k", "100k", "1M", "10M", "100M"};
    intptr_t funcPointers[] = {&countSort, &quickSort, &mergeSort, &bubbleSort};

    printf("Prints n/a if function executes more than: %d seconds\n", timeNAlimit);
    printf("Each Function Runs: %d times (for calculating average exec time)\n\n", eachFuncRunCount);
    printf("%30s---time taken(sec)---\n\n", " ");
    printf("    size |         n(count)     nlogn(quick)     nlogn(merge)      n^2(bubble)\n");

    void (*sortFunction)(int*, int);

    int j, i, z;
    for (i = 0; i < sizeof(tests)/sizeof(int); i++) {
        int size = tests[i];
        printf("%8s |", str[i]);

        int *arrayPointer = (int *)malloc(size * sizeof(int));
        if (arrayPointer == NULL) {
            printf("malloc failed");
            return;
        }

        for (j = 0; j < sizeof(funcPointers)/sizeof(intptr_t); j++) {
            clock_t timeStart2 = 0;
            for (z = 0; z < eachFuncRunCount; z++) {
                fillRandomly(arrayPointer, size);
                sortFunction = funcPointers[j];
                timeStart = clock();//and for stopping long running function

                sortFunction(arrayPointer, size);

                timeStart2 += clock() - timeStart;
            }

            float timeSpentForAllAttemps = (float)timeStart2/CLOCKS_PER_SEC;
            float avgTime = timeSpentForAllAttemps/eachFuncRunCount;

            if (avgTime > timeNAlimit) {//not answered
                printf("%2sn/a (>%4d sec)", " ", timeNAlimit);
            } else {
                printf("%17f", avgTime);
            }
        }

        free(arrayPointer);
        printf("\n");
    }
}



int main() {
    srand(time(NULL));
    setbuf(stdout, NULL);

    makeTests();

    return 0;
}
