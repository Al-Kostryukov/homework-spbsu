#include <stdio.h>
#include <stdlib.h>


#define MAX_LEN 100

void removeLetter() {
    char str[255] = {0};
    char letter;
    printf("input string and letter: ");
    scanf("%s %c", &str, &letter);
    printf("string without letter: ");

    int i = 0;
    while(str[i]) {
        if (str[i] != letter) {
            printf("%c", str[i]);
        }
        i++;
    }
}


int compareNums(char* num1, char* num2) {
    int i = MAX_LEN;
    while(i > 0) {
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


void printComment() {
    FILE *f = fopen("input.txt", "r");
    if (f == NULL) {
        printf("file not opened");
        return;
    }

    char cPrev, cCur;

    cCur = 0;
    do {
        cPrev = cCur;
        cCur = fgetc(f);
    } while (!(cPrev == '/' && cCur == '/'));


    char result = fgetc(f);
    while (result != '\n' && result != EOF) {
        printf("%c", result);
        result = fgetc(f);
    }


    fclose(f);
}



int main() {
    printComment();
    return 0;
}
