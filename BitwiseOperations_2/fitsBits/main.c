#include <stdio.h>
#include <stdlib.h>

int fitsBits(int x, int n){
    int shift = (x >> (n + ~0)) + 1;//if 000000...01 or 000000...00 then fits
    const int mask = ~0 << 1;//1111111...10
    return !(shift & mask);
}



int main(){
    return 0;
}
