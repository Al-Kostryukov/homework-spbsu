#include <stdio.h>
#include <stdlib.h>

#define MAX_LEN 255

void findAndPrint() {
    int stringsCount;
    printf("Input count of strings: ");
    scanf("%d", &stringsCount);

    char xorResult[MAX_LEN] = {0};
    char string[MAX_LEN];

    int i;
    for (i = 0; i < stringsCount; i++) {
        printf("input string #%d ", i + 1);

        scanf("%s", string);

        int j;
        for (j = 0; j < strlen(string); j++) {
            xorResult[j] ^= string[j];
        }
    }

    printf("%s", xorResult);
}


int main() {
    findAndPrint();
    return 0;
}
