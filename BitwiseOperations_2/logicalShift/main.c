#include <stdio.h>
#include <stdlib.h>


int logicalShift(int x, int n) {
    const int mask = ~(~0 << (32 + (~n + 1)));
    return x >> n & mask;
}



int main(){
    return 0;
}
