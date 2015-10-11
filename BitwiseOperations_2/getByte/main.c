#include <stdio.h>
#include <stdlib.h>


int getByte(int x, int n) {
    const int mask = 0xff;
    return x >> (n << 3) & mask;
}


int main(){
    return 0;
}
