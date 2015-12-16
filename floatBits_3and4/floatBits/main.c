#include <stdio.h>
#include <stdlib.h>


struct floatObject{
    int sign, exp, mant;
};


void printFloat(struct floatObject floatObject){
    int sign = floatObject.sign,
        exp = floatObject.exp,
        mant = floatObject.mant;

    if(exp == 0xff){
        if(mant){
            printf("NaN\n");
        } else{
            printf(sign ? "-Inf\n" : "+Inf\n");
        }
    } else{
        if (exp == 0x00) {//see also https://en.wikipedia.org/wiki/Single-precision_floating-point_format#Exponent_encoding
            printf("%5d %25c %d\n", sign, ' ', -126);
            printf("(-1)×0.");
        } else {
            printf("%5d %25c %d\n", sign, ' ', exp - 127);
            printf("(-1)×1.");
        }

        int i;
        for(i = 22; i >= 0; i--){
            printf("%d", (mant >> i) & 1);
        }

        printf("×2\n");
    }
}



struct floatObject floatBits1(float f){
    union {
        float f;
        int i;
    } helpUnion;

    helpUnion.f = f;

    int i = helpUnion.i;

    struct floatObject floatObject = {
        .sign = (i >> 31) & 1,
        .exp = (i >> 23) & 0xff,
        .mant = i & 0x7fffff,
    };

    printFloat(floatObject);
}



struct floatObject floatBits2(float f){
    union {
        float f;
        struct{
            unsigned int mant: 23, exp: 8, sign: 1;
        } bitField;
    } helpUnion;

    helpUnion.f = f;

    struct floatObject floatObject = {
        .sign = helpUnion.bitField.sign,
        .exp = helpUnion.bitField.exp,
        .mant = helpUnion.bitField.mant
    };

    printFloat(floatObject);
}



struct floatObject floatBits3(float f){
    int *pointer = (int*)(&f);

    struct floatObject floatObject = {
        .sign = (*pointer >> 31) & 1,
        .exp = (*pointer >> 23) & 0xff,
        .mant = *pointer & 0x7fffff,
    };

    printFloat(floatObject);
}



int main(){
    float f, f1, f2;
    printf("Enter the float1 and float2\n");
    scanf("%f %f", &f1, &f2);

    f = f1/f2;
    printf("f = %f\n", f);
    //run functions
    floatBits1(f);
    floatBits2(f);
    floatBits3(f);

    return 0;
}

