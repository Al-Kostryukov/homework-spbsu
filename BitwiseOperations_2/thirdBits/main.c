#include <stdio.h>
#include <stdlib.h>
int thirdBits(void) {
    const int firstMask = 36;
    const int secondMask = (firstMask << 6 | firstMask);
    return (secondMask << 12 | secondMask) << 6 | firstMask;
}


int main(){
    return 0;
}
