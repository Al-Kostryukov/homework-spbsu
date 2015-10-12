#include <stdio.h>
#include <stdlib.h>




int addOK(int x, int y){
    int sum = x + y;
    int signx = x >> 31;
    int signy = y >> 31;
    int signsum = sum >> 31;
    return !((signx ^ signsum) & (signy ^ signsum));
}



int main(){
    return 0;
}
