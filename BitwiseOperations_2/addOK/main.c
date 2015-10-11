#include <stdio.h>
#include <stdlib.h>




int addOK(int x, int y){
    int sum = x + y;
    int signx = x >> 31;
    int signy = y >> 31;
    int signsum = sum >> 31;
    //return (~(signx^signy)+1)|(!(signx^signsum));
    //if signx!=signy then ok, return 1.
    //if signx!=signsum (and signy!=signsum) (складывали числа одного знака, а получили сумму другого знака) then return 0

    //maybe another solution (unites both 'if') is !((signx^signsum)&(signy^signsum))
    return !((signx ^ signsum) & (signy ^ signsum));
}



int main(){
    return 0;
}
