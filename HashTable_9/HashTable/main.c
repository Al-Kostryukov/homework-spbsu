#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

typedef struct sNode {
    struct sNode* next;
    char* key;
    int value;
} listNode;

typedef int (*tHashFunction)(char*, int);

typedef struct sHashTable {
    listNode* HashTable;//HEAD of linkedList, not POINTER TO HEAD
    int size;
    tHashFunction hashFunction;
} tHashTableObject;





int isKeyExist(tHashTableObject HashTableObject, char* key) {
    int keyHash = HashTableObject.hashFunction(key, HashTableObject.size);
    listNode* headNode = &(HashTableObject.HashTable[keyHash]);//POINTER TO HEAD of linked list

    listNode* currentNode = headNode;
    while(currentNode->next != NULL) {
        currentNode = currentNode->next;
        if (strcmp(currentNode->key, key) == 0) {
            return 1;
        }
    }

    return 0;
}

void setValueByKey(tHashTableObject HashTableObject, char* key, int value) {
    int keyHash = HashTableObject.hashFunction(key, HashTableObject.size);
    listNode* headNode = &(HashTableObject.HashTable[keyHash]);//POINTER TO HEAD of linked list

    listNode* currentNode = headNode;
    while(currentNode->next != NULL) {
        currentNode = currentNode->next;
        if (strcmp(currentNode->key, key) == 0) {
            printf("value for key {%s} successfully changed: from {%d} to {%d}\n", key, currentNode->value, value);
            currentNode->value = value;
            return;
        }
    }

    listNode* newNode = (listNode*)calloc(1, sizeof(listNode));
    if (newNode == NULL) {
        printf("calloc failed: new key is not inserted\n");
        return;
    }

    currentNode->next = newNode;
    newNode->key = (char*)malloc((strlen(key) + 1) * sizeof(char));
    if (newNode->key == NULL) {
        printf("malloc failed: new key is not inserted\n");
        return;
    }
    strcpy(newNode->key, key);
    newNode->value = value;

    printf("value successfully setted: {key: %s, value: %d} is in head#%d now\n", key, value, keyHash);
}

int getValueByKey(tHashTableObject HashTableObject, char* key) {
    int keyHash = HashTableObject.hashFunction(key, HashTableObject.size);
    listNode* headNode = &(HashTableObject.HashTable[keyHash]);//POINTER TO HEAD of linked list

    listNode* currentNode = headNode;
    while(currentNode->next != NULL) {
        currentNode = currentNode->next;
        if (strcmp(currentNode->key, key) == 0) {
            return currentNode->value;
        }
    }

    return NULL;//here should be another data type because NULL == 0, but C doesn't have
}

void removeNodeByKey(tHashTableObject HashTableObject, char* key) {
    int keyHash = HashTableObject.hashFunction(key, HashTableObject.size);
    listNode* headNode = &(HashTableObject.HashTable[keyHash]);//POINTER TO HEAD of linked list

    listNode* currentNode = headNode;
    listNode* previousNode;
    while(currentNode->next != NULL) {
        previousNode = currentNode;
        currentNode = currentNode->next;
        if (strcmp(currentNode->key, key) == 0) {
            previousNode->next = currentNode->next;
            free(currentNode->key);
            int value = currentNode->value;
            free(currentNode);
            printf("Node {key: %s, value: %d} successfully removed\n", key, value);
            return;
        }
    }
    printf("key is not exist, so that's why Node not removed\n");
}

tHashTableObject createHashTable(int hashTableSize, tHashFunction hashFunction) {
    tHashTableObject HashTableObject;

    HashTableObject.HashTable = (listNode*)calloc(hashTableSize, sizeof(listNode));
    if (HashTableObject.HashTable == NULL) {
        printf("calloc failed: hash table not created\n");
        return;
    }
    HashTableObject.size = hashTableSize;
    HashTableObject.hashFunction = hashFunction;


    printf("Hash Table with size {%d} successfully created\n", hashTableSize);

    return HashTableObject;
}

void removeHashTable(tHashTableObject HashTableObject) {
    int i;
    for(i = 0; i < HashTableObject.size; i++) {
        listNode* headNode = &(HashTableObject.HashTable[i]);//Pointer to HEAD of linked List
        listNode* currentNode = headNode->next;
        if (currentNode == NULL) {
            continue;//chain is empty, only head is alive
        }
        listNode* nextNode;
        while (currentNode->next != NULL) {
            nextNode = currentNode->next;
            free(currentNode->key);
            free(currentNode);
            currentNode = nextNode;
        }
        free(currentNode);
    }

    free(HashTableObject.HashTable);//free array of heads

    printf("Hash Table successfully removed\n");
}

void printHashTable(tHashTableObject HashTableObject) {
    int i;
    for(i = 0; i < HashTableObject.size; i++) {
        printf("[head#%3d]", i);

        listNode* headNode = &(HashTableObject.HashTable[i]);//Pointer to HEAD of linked List
        listNode* currentNode = headNode;
        while (currentNode->next != NULL) {
            currentNode = currentNode->next;
            printf("-->{key: %s, value: %d}", currentNode->key, currentNode->value);
        }
        printf("\n");
    }
}


void getStatisticsOfHashTable(tHashTableObject HashTableObject) {
    int i, length;
    int countOfElements = 0;
    int maxChainLength = 0;
    int minChainLength = 0;
    int countOfNotZeroChains = 0;
    for(i = 0; i < HashTableObject.size; i++) {
        listNode* headNode = &(HashTableObject.HashTable[i]);//Pointer to HEAD of linked List
        listNode* currentNode = headNode;
        length = 0;
        while (currentNode->next != NULL) {
            currentNode = currentNode->next;
            length++;
        }
        countOfElements += length;

        if (!minChainLength) minChainLength = length;

        if (length && length < minChainLength) {
            minChainLength = length;
        }

        if (length > maxChainLength) {
            maxChainLength = length;
        }

        if (length) countOfNotZeroChains++;
    }

    printf("Count of elements: %d\n", countOfElements);
    printf("Count of not zero chains: %d\n", countOfNotZeroChains);
    printf("Min length of not zero chain: %d\n", minChainLength);
    printf("Max length of chain: %d\n", maxChainLength);
    if (countOfNotZeroChains) {
        printf("Average length of not zero chain: %f\n", (float)countOfElements/countOfNotZeroChains);
    } else {
        printf("Average length of not zero chain: 0\n");
    }
}




//<hash functions>
unsigned int hashFunctionConst(char* str, int max) {
    return 10;
}

unsigned int hashFunctionSymbolsCodes(char* str, int max) {
    int i = 0;
    unsigned int sum = 0;
    while(str[i]) {
        sum += str[i++];
    }

    return sum % max;
}

unsigned int HashFAQ6(char* str, int max) {
	unsigned int hash = 0;

	for (; *str; str++)
	{
		hash += (unsigned char)(*str);
		hash += (hash << 10);
		hash ^= (hash >> 6);
	}
	hash += (hash << 3);
	hash ^= (hash >> 11);
	hash += (hash << 15);

	return hash % max;
}

tHashFunction currentHashFunction = &hashFunctionConst;
//</hash functions>











//<BOOK WORDS>
char checkSymbol(char c) {
    if ('A' <= c && c <= 'Z' || 'a' <= c && c <= 'z' || '0' <= c && c <= '9') {
        return 1;
    }

    return 0;
}

void countSimilarWordsInBook(tHashTableObject HashTableObject, char* fileName) {
    FILE* filePointer = fopen(fileName, "r");
    if (filePointer == NULL) {
        printf("some error with fopen");
        return;
    }

    char word[100];
    char clearedWord[100];
    char c;

    clock_t timeStart = clock();

    do {
        c = fscanf(filePointer, "%s", word);
        if (c != 1 && c != EOF) {
            printf("some error while reading from file\n");
            break;
        }

        if (c == EOF) {
            break;
        }
        //clearing word from unnecessary symbols and do lowercase
        int i, len = strlen(word);
        for (i = 0; i < len; i++) {
            if (checkSymbol(word[i])) {
                clearedWord[i] = tolower(word[i]);
            }
        }
        clearedWord[i] = 0;

        setValueByKey(HashTableObject, clearedWord, getValueByKey(HashTableObject, clearedWord) + 1);

    } while (1);

    fclose(filePointer);

    printf("Words in book successfully counted.\nTime spent: %f\n", (clock() - timeStart)/(float)CLOCKS_PER_SEC);
    getStatisticsOfHashTable(HashTableObject);
}

//</BOOK WORDS>













void printHelp() {
    printf("\nHELP:\n");
    printf("Type 'q' for removing Hash Table and exiting\n");
    printf("Type 's' <key> <value> for setting the value by key\n");
    printf("Type 'g' <key> for getting a value by key\n");
    printf("Type 'r' <key> for removing an element by Key\n");
    printf("Type 'p' for printing the Hash Table\n");
    printf("Type 'n' <size> for removing current Hash Table and creating new one\n");
    printf("Type 't' for printing statistics of Hash Table\n");
    printf("Type 'c' <fileName> for counting similar words in book with fileName\n");
}


void waitForEventsFromKeyboard(tHashTableObject HashTableObject) {
    printHelp();

    printf("\nWaiting for your commands...\n");
    char command;
    int value;
    char key[100];
    while (1) {
        scanf("%c", &command);

        switch (command) {
            case 'q':
                removeHashTable(HashTableObject);
                printf("exiting...\n");
                exit(0);
                break;
            case 's':
                scanf("%s %d", &key, &value);
                setValueByKey(HashTableObject, key, value);
                break;
            case 'g':
                scanf("%s", &key);
                if (!isKeyExist(HashTableObject, key)) {
                    printf("No such key in Hash Table\n");
                } else {
                    int result = getValueByKey(HashTableObject, key);
                    printf("value: %d\n", result);
                }
                break;
            case 'p':
                printHashTable(HashTableObject);
                break;
            case 't':
                getStatisticsOfHashTable(HashTableObject);
                break;
            case 'r':
                scanf("%s", &key);
                removeNodeByKey(HashTableObject, key);
                break;
            case 'n':
                removeHashTable(HashTableObject);
                scanf("%d", &value);
                HashTableObject = createHashTable(value, currentHashFunction);
                break;
            case 'c':
                scanf("%s", &key);
                countSimilarWordsInBook(HashTableObject, key);
                break;
        }
    }
}


int main() {
    tHashTableObject HashTableObject = createHashTable(100000, currentHashFunction);
    waitForEventsFromKeyboard(HashTableObject);
    return 0;
}
