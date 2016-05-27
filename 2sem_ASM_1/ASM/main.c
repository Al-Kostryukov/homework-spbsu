#include <stdio.h>
#include <stdlib.h>


#include <string.h>
#include "hashtable.h"


#define MAX 262144
#define MAX_INSTR 10000

typedef struct {
    int* contents;
    int maxSize;
    int top;
} stack_t;

void stackInit(stack_t* stackP, int maxSize) {
    int *newContents;

    newContents = (int*) malloc(sizeof(int) * maxSize);
    if (newContents == NULL) {
        printf("Not enougn memory to initialize stack.\n");
        exit(1);
    }

    stackP->contents = newContents;
    stackP->maxSize = maxSize;
    stackP->top = -1;
}

void stackDestroy(stack_t* stackP) {
    free(stackP->contents);
    stackP->contents = NULL;
    stackP->maxSize = 0;
    stackP->top = -1;  // empty
}

void stackPush(stack_t* stackP, int element) {
    if (stackIsFull(stackP)) {
        printf("Pushing error: stack is full.\n");
        exit(1);
    }

    stackP->contents[++stackP->top] = element;
}

int stackTop(stack_t* stackP) {
    if (stackIsEmpty(stackP)) {
        printf("Can't stack top of empty stack");
        exit(1);
    }

    return stackP->contents[stackP->top];
}

int stackPop(stack_t* stackP) {
    if (stackIsEmpty(stackP)) {
        printf("Poping error: stack is empty.\n");
        exit(1);
    }

    return stackP->contents[stackP->top--];
}

int stackIsEmpty(stack_t* stackP) {
    return stackP->top < 0;
}

int stackIsFull(stack_t* stackP) {
    return stackP->top >= stackP->maxSize - 1;
}
//\stack




typedef enum {
    SKIP = 0,
    LD = 1,
    ST,
    LDC,
    ADD,
    SUB,
    CMP,
    JMP,
    BR,
    RET
} instr_type;

typedef struct {
    instr_type type;
    int arg;
    char* label;
} instr_t;


int* memory;
stack_t* st;
tHashTableObject labels;
instr_t* program;

void _ld(int addr) {
    int val = memory[addr];
    stackPush(st, val);
}

void _st(int addr) {
    int val = stackPop(st);
    memory[addr] = val;
}

void _ldc(int num) {
    stackPush(st, num);
}

void _add() {
    int arg1 = stackPop(st), arg2 = stackPop(st);
    int res = arg1 + arg2;
    stackPush(st, res);
}

void _sub() {
    int arg1 = stackPop(st), arg2 = stackPop(st);
    int res = arg1 - arg2;
    stackPush(st, res);
}

void _cmp() {
    int arg1 = stackPop(st), arg2 = stackPop(st);
    int res;
    if (arg1 > arg2)
        res = 1;
    else if (arg2 > arg1)
        res = -1;
    else
        res = 0;
    stackPush(st, res);
}





int main() {
    char* fname = "2.asm";


    memory = (int*) malloc(sizeof(int) * MAX);
    if (memory == NULL) {
        printf("memory allocation failed\n");
        exit(1);
    }
    st = (stack_t*) malloc(sizeof(stack_t));
    if (st == NULL) {
        printf("stack_t pointer allocation failed\n");
        exit(1);
    }
    stackInit(st, MAX);
    labels = createHashTable(MAX_INSTR, currentHashFunction);
    program = (instr_t*) malloc(sizeof(instr_t) * MAX_INSTR);

    if (program == NULL) {
        printf("program malloc failed");
        exit(1);
    }

    FILE* inp = fopen(fname, "r");
    if (inp == NULL) {
        printf("could not open file\n");
        exit(1);
    }
    char* line = (char*) malloc(500 * sizeof(char));
    if (line == NULL) {
        printf("line malloc file\n");
        exit(1);
    }
    size_t len = 0;
    size_t read;
    int num = 0;
    while (fgets(line, 500, inp) != NULL) {
        char* cut = strchr(line, ';');
        if (cut != NULL) *cut = '\0';
        char* m = strchr(line, ':');
        char* cur_label = 0;
        char* cur_instr = (char*) malloc(sizeof(char) * MAX_INSTR);
        char* cur_arg = (char*) malloc(sizeof(char) * MAX_INSTR);
        if (cur_instr == NULL || cur_arg == NULL)
            printf("allocation for buffer failed\n");
        if (m == NULL)
            cur_label = 0;
        else {
            cur_label = line;
            cur_label[m - line] = '\0';
            setValueByKey(labels, cur_label, num);
            line = m + 1;
        }
        sscanf(line, "%s %s\n", cur_instr, cur_arg);

        if (!strcmp(cur_instr, "ld")) {
            program[num].type = LD;
            program[num].arg = atoi(cur_arg);
        } else if (!strcmp(cur_instr, "st")) {
            program[num].type = ST;
            program[num].arg = atoi(cur_arg);
        } else if (!strcmp(cur_instr, "ldc")) {
            program[num].type = LDC;
            program[num].arg = atoi(cur_arg);
        } else if (!strcmp(cur_instr, "add")) {
            program[num].type = ADD;
        } else if (!strcmp(cur_instr, "sub")) {
            program[num].type = SUB;
        } else if (!strcmp(cur_instr, "cmp")) {
            program[num].type = CMP;
        } else if (!strcmp(cur_instr, "jmp") || !strcmp(cur_instr, "br")) {
            program[num].type = (!strcmp(cur_instr, "jmp") ? JMP : BR);
            program[num].label = (char*) malloc(sizeof(char) * (strlen(cur_arg) + 1));
            if (program[num].label == NULL) {
                printf("allocation error\n");
                exit(1);
            }
            strcpy(program[num].label, cur_arg);
        } else if (!strcmp(cur_instr, "ret")) {
            program[num].type = RET;
        } else {
            int i = 0;
            for (i = 0; i < strlen(cur_instr); i++) {
                if (!isspace(cur_instr[i])) {
                    printf("unrecognized command: %s\n", cur_instr);
                    exit(1);
                }
            }
            program[num].type = SKIP;
        }
        num++;
    }
    fclose(inp);

    int i;
    for (i = 0; i < num; i++) {
        if (program[i].type == JMP || program[i].type == BR) {
            program[i].arg = getValueByKey(labels, program[i].label);
            free(program[i].label);
        }
    }


    int ip = 0x0;
    while(1) {
        switch (program[ip].type) {
        case SKIP:
            break;
        case LD:
            _ld(program[ip].arg);
            break;
        case ST:
            _st(program[ip].arg);
            break;
        case LDC:
            _ldc(program[ip].arg);
            break;
        case ADD:
            _add();
            break;
        case SUB:
            _sub();
            break;
        case CMP:
            _cmp();
            break;
        case JMP:
            ip = (int) program[ip].arg - 1;
            break;
        case BR:
            if (stackTop(st))
                ip = (int) program[ip].arg - 1;
            break;
        case RET:
            printf("Program has finished\nStack: ");
            while (!stackIsEmpty(st))
                printf("%d ", stackPop(st));
            printf("\n");
            exit(0);
            break;
        default:
            printf("Unknown error\n");
            exit(1);
            break;
        }
        ip++;
    }


    free(line);
    free(program);
    removeHashTable(labels);
    stackDestroy(st);
    free(memory);
    return 0;
}


