#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

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

tHashFunction currentHashFunction = &HashFAQ6;
//</hash functions>


