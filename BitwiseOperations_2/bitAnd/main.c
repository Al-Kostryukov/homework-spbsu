#include <stdio.h>
#include <stdlib.h>

int bitAnd(int x, int y){
    return ~(~x | ~y);
}


int main(){
    return 0;
}
