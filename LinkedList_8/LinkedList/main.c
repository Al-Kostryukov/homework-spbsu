#include <stdio.h>
#include <stdlib.h>

typedef struct sNode {
    struct sNode* next;
    int value;
} ListNode;


ListNode* createLinkedList() {
    ListNode* HeadNode = (ListNode*) calloc(1, sizeof(ListNode));
    if (HeadNode != NULL) {
        printf("Linked list created [adress of HEAD: %p]\n", HeadNode);
        return HeadNode;
    } else {
        printf("calloc failed: Linked list not created\n");
        return NULL;
    }
}

//<optional>
void fillLinkedList(ListNode* linkedList, int upTo) {
    int i;
    for (i = 0; i <= upTo; i++) {
        addNumberToLinkedList(linkedList, i);
    }

    printf("Linked List filled up to %d\n", upTo);
}
//</optional>


void removeLinkedList(ListNode* linkedList) {
    if (linkedList == NULL) return;

    ListNode* nextNode;
    ListNode* currentNode = linkedList;

    while (currentNode->next != NULL) { //in cycle removing all nodes from HEAD to n-1
        nextNode = currentNode->next;
        free(currentNode);
        currentNode = nextNode;
    }
    free(currentNode);//removing last element

    printf("Linked List removed\n");
}


void addNumberToLinkedList(ListNode* linkedList, int number) {
    ListNode* currentNode = linkedList;

    ListNode* newNode = (ListNode*) calloc(1, sizeof(ListNode));
    if (newNode == NULL) {
        printf("calloc failed: Number not added\n");
        return;
    }
/* inserting to the end O(n)
    while (currentNode->next != NULL) {
        currentNode = currentNode->next;
    }

    currentNode->next = newNode;
    newNode->value = number;
*/
//inserting to the begining O(1)
    newNode->next = currentNode->next;
    currentNode->next = newNode;
    newNode->value = number;

    printf("number %d added\n", number);
}

void removeNumberFromLinkedList(ListNode* linkedList, int number) {
    ListNode* previousNode;
    ListNode* currentNode = linkedList;

    while (currentNode->next != NULL) {
        previousNode = currentNode;
        currentNode = currentNode->next;
        if (currentNode->value == number) {
            previousNode->next = currentNode->next;
            free(currentNode);
            printf("number %d removed\n", number);
            return;
        }
    }
    printf("number %d not found, that's why not removed\n", number);
}

void printLinkedList(ListNode* linkedList) {
    ListNode* currentNode = linkedList;

    //here can be checking for hasCycle

    if (currentNode->next == NULL) {
        printf("Linked list is empty");
    } else {
        printf("Linked list: [head]");

        while (currentNode->next != NULL) {
            currentNode = currentNode->next;
            printf("-->%d", currentNode->value);
        }
    }
    printf("\n");
}


//<cycles>
void createCycleInLinkedList(ListNode* linkedList) {
    ListNode* currentNode1 = linkedList;
    ListNode* currentNode2 = linkedList;

    int count = 0;
    while (currentNode1->next != NULL) {
        currentNode1 = currentNode1->next;
        count++;
    }

    int randomNodeNumber = rand() % count + 1;//choosing node to create a cycle

    int i = 0;
    while (i < randomNodeNumber) {
        currentNode2 = currentNode2->next;
        i++;
    }

    currentNode1->next = currentNode2;

    printf("Cycle created\n");
}

int hasCycle(ListNode* linkedList) {
    if (linkedList == NULL) return;
    if (linkedList->next == NULL) return 0;

    ListNode* fastNode = linkedList->next;
    ListNode* slowNode = linkedList;

    int i = 0;
    while (fastNode->next != NULL && slowNode->next != NULL) {
        fastNode = fastNode->next;

        if (i % 2) {
            slowNode = slowNode->next;//slowNode steps each second time
        }
        i++;

        if (fastNode == slowNode) {
            return 1;
        }
    }

    return 0;
}

void checkForCycleInLinkedList(ListNode* linkedList) {
    if (hasCycle(linkedList)) {
        printf("Linked list has a cycle\n");
    } else {
        printf("Linked list has no cycles\n");
    }
}
//</cycles>



void printHelp() {
    printf("\nHELP:\n");
    printf("Type 'q' for removing linked list and quit\n");
    printf("Type 'a' <number> for adding a number\n");
    printf("Type 'r' <number> for removing a number\n");
    printf("Type 'p' for printing a linked list\n");
    printf("Type 'y' for adding a cycyle\n");
    printf("Type 'c' for checking for a cycle\n");
    printf("[optional] Type 'f' <number> for filling a linked list up to the number\n");
}

void waitForEventsFromKeyboard(ListNode* linkedList) {
    printHelp();

    printf("\nWaiting for your commands...\n");
    char command;
    int number;
    while (1) {
        scanf("%c", &command);

        switch (command) {
            case 'q':
                removeLinkedList(linkedList);
                printf("exiting...\n");
                exit(0);
                break;
            case 'a':
                scanf("%d", &number);
                addNumberToLinkedList(linkedList, number);
                break;
            case 'r':
                scanf("%d", &number);
                removeNumberFromLinkedList(linkedList, number);
                break;
            case 'p':
                printLinkedList(linkedList);
                break;
            case 'y':
                createCycleInLinkedList(linkedList);
                break;
            case 'c':
                checkForCycleInLinkedList(linkedList);
                break;
            //optional
            case 'f':
                scanf("%d", &number);
                fillLinkedList(linkedList, number);
                break;
        }
    }
}

int main() {
    ListNode* linkedList = createLinkedList();
    waitForEventsFromKeyboard(linkedList);

    return 0;
}
