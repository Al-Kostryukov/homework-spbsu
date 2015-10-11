#include <stdio.h>
#include <stdlib.h>

int conditional(int x, int y, int z){
    int a = (x | (~x + 1)) >> 31; //111111...111 if x<>0  , 0000000...000 if x=0
    return (a & y) | (~a & z);
}




int main(){
    return 0;
}
