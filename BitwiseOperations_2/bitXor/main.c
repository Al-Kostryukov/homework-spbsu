#include <stdio.h>
#include <stdlib.h>

int bitXor(int x, int y){
    return ~(x & y) & ~(~x & ~y);
}



int main(){
    return 0;
}
