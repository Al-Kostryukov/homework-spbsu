#include <stdio.h>
#include <stdlib.h>

#define MAX_LEN 255

void addStringToHashTable(HashTableType HashTable, char *str) {
    if (isKeyExist(HashTable, str)) {
        setValueByKey(HashTable, str, getValueByKey(HashTable, str) + 1);//setValueByKey(HashTable, key, newValue)
    } else {
        insert(HashTable, str, 1);//insert(HashTable, newKey, value)
    }
}


int main() {
    HashTableType HashTable = createHashTable();

    int n;
    printf("Input count of strings: ");
    scanf("%d", &n);

    char str[MAX_LEN] = {0};

    int i;
    for (i = 0; i < n; i++) {
        scanf("%s", str);
        addStringToHashTable(HashTable, str);
    }

    printKeyAndValue(HashTable);

    return 0;
}
