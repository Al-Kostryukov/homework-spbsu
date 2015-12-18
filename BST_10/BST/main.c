#include <stdio.h>
#include <stdlib.h>

typedef struct sNode {
    int value;
    struct sNode* left;
    struct sNode* right;
} treeNode;


char isTreeEmpty(treeNode** ROOT) {
    if (*ROOT == NULL) {
        return 1;
    }

    return 0;
}


void addNumberToTree(treeNode** ROOT, int value) {//+
    treeNode* node = (treeNode*)calloc(1, sizeof(treeNode));
    if (node == NULL) {
        printf("calloc failed: tree node not created and number not added\n");
        return;
    }

    node->value = value;

    if (isTreeEmpty(ROOT)) {//means that there is no numbers in tree
        *ROOT = node;
        printf("number %d successfully added as ROOT\n", value);
        return;
    }

    treeNode* currentNode = *ROOT;
    while (1) {
        if (value < currentNode->value) {
            if (currentNode->left != NULL) {
                currentNode = currentNode->left;
            } else {
                currentNode->left = node;
                break;
            }
        } else {
            if (currentNode->right != NULL) {
                currentNode = currentNode->right;
            } else {
                currentNode->right = node;
                break;
            }
        }
    }

    printf("number %d successfully added\n", value);
}

void removeNumberFromTree(treeNode** ROOT, int value) {
    if (isTreeEmpty(ROOT)) {
        printf("Tree is empty\n");
        return;
    }

    treeNode* currentNode = *ROOT;
    treeNode** pointerToCurrentNode = ROOT;
    while (1) {
        if (value < currentNode->value) {
            if (currentNode->left != NULL) {
                pointerToCurrentNode = &(currentNode->left);
                currentNode = currentNode->left;
            } else {
                printf("Number not found in tree\n");
                return;
            }
        } else if (value > currentNode->value) {
            if (currentNode->right != NULL) {
                pointerToCurrentNode = &(currentNode->right);
                currentNode = currentNode->right;
            } else {
                printf("Number not found in tree\n");
                return;
            }
        } else {//number found
            if (currentNode->left == NULL) {//this includes case when currentNode->left == NULL && currentNode->right == NULL
                *pointerToCurrentNode = currentNode->right;
                free(currentNode);
                printf("Number %d successfully removed\n", value);
            } else if (currentNode->right == NULL) {
                *pointerToCurrentNode = currentNode->left;
                free(currentNode);
                printf("Number %d successfully removed\n", value);
            } else {//when left and right are NOT NULL
                //finding max in left subtree
                treeNode** pointerToMaxNode = &(currentNode->left);
                treeNode* maxNode = currentNode->left;
                while (maxNode->right != NULL) {
                    pointerToMaxNode = &(maxNode->right);
                    maxNode = maxNode->right;
                }

                *pointerToMaxNode = NULL; //setting NULL pointer in parent of maxNode

                maxNode->right = currentNode->right;
                maxNode->left = currentNode->left;

                free(currentNode);
                *pointerToCurrentNode = maxNode;//now instead of currentNode will be maxNode in left SUBTREE
                printf("Number %d successfully removed\n", value);
            }
            break;
        }
    }
}

void printInIncreasingOrder(treeNode** ROOT) {
    if (isTreeEmpty(ROOT)) {
        printf("Tree is empty\n");
        return;
    }
    _printInIncreasingOrder(*ROOT);
    printf("\n");
}

void _printInIncreasingOrder(treeNode* ROOT) {
    if (ROOT->left != NULL) {
        _printInIncreasingOrder(ROOT->left);
    }

    printf("%d ", ROOT->value);

    if (ROOT->right != NULL) {
        _printInIncreasingOrder(ROOT->right);
    }
}


void printInDecreasingOrder(treeNode** ROOT) {
    if (isTreeEmpty(ROOT)) {
        printf("Tree is empty\n");
        return;
    }
    _printInDecreasingOrder(*ROOT);
    printf("\n");
}

void _printInDecreasingOrder(treeNode* ROOT) {
    if (ROOT->right != NULL) {
        _printInDecreasingOrder(ROOT->right);
    }

    printf("%d ", ROOT->value);

    if (ROOT->left != NULL) {
        _printInDecreasingOrder(ROOT->left);
    }
}


void printInFormat(treeNode** ROOT) {
    if (isTreeEmpty(ROOT)) {
        printf("Tree is empty, so: (null null null)\n");
        return;
    }
    _printInFormat(*ROOT);
    printf("\n");
}

void _printInFormat(treeNode* ROOT) {
    printf("(%d ", ROOT->value);

    if (ROOT->left != NULL) {
        _printInFormat(ROOT->left);
    } else {
        printf("null");
    }

    printf(" ");

    if (ROOT->right != NULL) {
        _printInFormat(ROOT->right);
    } else {
        printf("null");
    }

    printf(")");
}


char isNumberBelongToTree(treeNode** ROOT, int value) {//+
    if (isTreeEmpty(ROOT)) {
        return 0;
    }

    treeNode* currentNode = *ROOT;
    while (1) {
        if (value < currentNode->value) {
            if (currentNode->left != NULL) {
                currentNode = currentNode->left;
            } else {
                return 0;
            }
        } else if (value > currentNode->value) {
            if (currentNode->right != NULL) {
                currentNode = currentNode->right;
            } else {
                return 0;
            }
        } else {
            return 1;
        }
    }
}

treeNode* createTree() {
    treeNode* ROOT = NULL;
    return ROOT;
}

void removeTree(treeNode** ROOT) {
    if (isTreeEmpty(ROOT)) {
        printf("Tree is empty\n");
        return;
    }
    _removeTree(*ROOT);
    *ROOT = NULL;
    printf("Tree successfully removed\n");
}

void _removeTree(treeNode* ROOT) {
    if (ROOT->left != NULL) {
        _removeTree(ROOT->left);
    }

    if (ROOT->right != NULL) {
        _removeTree(ROOT->right);
    }

    free(ROOT);
}






void printHelp() {
    printf("\nHELP:\n");
    printf("Type 'q' for removing tree and exiting\n");
    printf("Type 'a' <number> for adding the number to tree\n");
    printf("Type 'i' <number> to check is number belong to tree\n");
    printf("Type 'r' <number> for removing number from tree\n");
    printf("Type 'u' for printing tree in increasing order\n");
    printf("Type 'd' for printing tree in decreasing order\n");
    printf("Type 'p' for printing tree in format (value leftSubtree rightSubtree)\n");
    printf("Type 'x' for removing tree\n");
}


void waitForEventsFromKeyboard(treeNode** ROOT) {
    printHelp();

    printf("\nWaiting for your commands...\n");
    char command;
    int value;
    while (1) {
        scanf("%c", &command);

        switch (command) {
            case 'q':
                removeTree(ROOT);
                printf("exiting...\n");
                exit(0);
                break;
            case 'a':
                scanf("%d", &value);
                addNumberToTree(ROOT, value);
                break;
            case 'i':
                scanf("%d", &value);
                char r = isNumberBelongToTree(ROOT, value);
                if (r) {
                    printf("There is such number in the tree\n");
                } else {
                    printf("There is NO such number in the tree\n");
                }
                break;
            case 'x':
                removeTree(ROOT);
                break;
            case 'r':
                scanf("%d", &value);
                removeNumberFromTree(ROOT, value);
                break;
            case 'u':
                if (isTreeEmpty(ROOT)) {
                    printf("Tree is empty\n");
                } else {
                    printInIncreasingOrder(ROOT);
                }
                break;
            case 'd':
                if (isTreeEmpty(ROOT)) {
                    printf("Tree is empty\n");
                } else {
                    printInDecreasingOrder(ROOT);
                }
                break;
            case 'p':
                printInFormat(ROOT);
                break;
        }
    }
}



int main() {
    treeNode* ROOT = createTree();
    waitForEventsFromKeyboard(&ROOT);

    return 0;
}
