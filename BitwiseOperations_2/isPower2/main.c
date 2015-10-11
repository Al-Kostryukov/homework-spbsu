#include <stdio.h>
#include <stdlib.h>


int isPower2(int x) {
    return !(!x | x >> 31) & !(x & (x + ~0));//not zero & not negative & only one bit is 1//-2^31 is spec number
}


int main(){
    return 0;
}
