#include <stdio.h>
#include <stdlib.h>

int logicalShift(int x, int n){
	const int mask = ~(1 << 31) >> n;
	return (x >> n) & ((mask << 1) + 1);
}



int main(){
    return 0;
}
