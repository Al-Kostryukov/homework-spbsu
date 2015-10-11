#include <stdio.h>
#include <stdlib.h>

int EndianCheck(){
    union Check{
        int x;
        char bytes[sizeof(int)];
    } c;

    c.x = 1;


    return c.bytes[0];//if 1 then Little Endian, Big Endian otherwise

}


int main(){
    return 0;
}
