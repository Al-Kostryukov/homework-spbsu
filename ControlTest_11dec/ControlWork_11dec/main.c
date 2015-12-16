#include <stdio.h>
#include <stdlib.h>


#define MAX_LEN 100

void removeLetter() {
    char str[255];
    char letter;
    printf("input string and letter: ");
    scanf("%s %c", str, &letter);
    printf("string without letter: ");

    int i = 0;
    while(str[i]) {
        if (str[i] != letter) {
            printf("%c", str[i]);
        }
        i++;
    }
}


char compare(char* num1, char* num2) {
    int j;
    for (j = strlen(num1); j < MAX_LEN; j++) {
        num1[j] = '0';//clear garbage
    }
    for (j = strlen(num2); j < MAX_LEN; j++) {
        num2[j] = '0';//clear garbage
    }

    int i = MAX_LEN - 1;

    while(i >= 0) {
        if (num1[i] == num2[i]) {
            i--;
        } else if (num1[i] > num2[i]) {
            return 1;
        } else {
            return -1;
        }
    }

    return 0;
}


void printComments() {
    FILE *f = fopen("input.txt", "r");
    if (f == NULL) {
        printf("file not opened");
        return;
    }

    char cPrev, cCur;
    cCur = fgetc(f);
    while (cCur != EOF) {
        cPrev = cCur;
        cCur = fgetc(f);
        if (cPrev == '/' && cCur == '/') {
            printf("//");
            cCur = fgetc(f);
            while (cCur != '\n' && cCur != EOF) {
                printf("%c", cCur);
                cCur = fgetc(f);
            }
            printf("\n");
        }
    }

    fclose(f);
}



int main() {
    char num1[MAX_LEN] = "101", num2[MAX_LEN] = "100001";
    printf("%d\n", compare(num1, num2));

    printComments();
    return 0;
}
