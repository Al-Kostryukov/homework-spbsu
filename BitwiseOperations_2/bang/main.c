#include <stdio.h>
#include <stdlib.h>


int bang(int x){
    return ((x | (~x + 1)) >> 31) + 1; // or ((x>>31)|((~x+1)>>31))&1^1;
}




int main(){
    return 0;
}
