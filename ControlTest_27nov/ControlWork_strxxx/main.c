#include <stdio.h>
#include <stdlib.h>


size_t my_strlen(char* src) {
    size_t i = 0;
    while (src[i]) {
        i++;
    }
    return i;
}

int my_strcmp(char *s1, char *s2) {
    int i = 0;
    while (s1[i] && s2[i]) {
        if(s1[i] > s2[i]) {
            return 1;
        } else if (s1[i] < s2[i]) {
            return -1;
        } else {
            i++;
        }
    }
    if (strlen(s1) > strlen(s2)) {
        return 1;
    } else if (strlen(s1) < strlen(s2)) {
        return -1;
    } else {
        return 0;
    }
}

void my_strcpy(char *dst, char *src) {
    int i = 0;
    while (src[i]) {
        dst[i] = src[i];
        i++;
    }
    dst[i] = 0;
}

void my_strcat(char *dst, char *src) {
    int start = my_strlen(dst);
    int i = 0;
    while (src[i]) {
        dst[start++] = src[i++];
    }
    dst[start] = 0;
}



int main() {
    char s1[] = "hello";
    char s2[] = "world";

    printf("length s1: %d\n", my_strlen(s1));
    printf("compare: %d\n", my_strcmp(s1, s2));

    my_strcpy(s1, s2);
    printf("copy: %s\n", s1);

    my_strcat(s1, s2);
    printf("concat: %s\n", s1);

    return 0;
}
