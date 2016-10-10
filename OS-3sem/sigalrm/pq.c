// That code was found on the endless expanses of the Internet. I've modified it a little bit.

#include <stdio.h>
#include <stdlib.h>
#include "pq.h"
 
void pq_push(pq_t *h, long int priority, void *data) {
    if (h->len + 1 >= h->size) {
        h->size = h->size ? h->size * 2 : 4;
        h->nodes = (node_t *)realloc(h->nodes, h->size * sizeof (node_t));
        if (h->nodes == NULL) {
            printf("Not enough memory for operation!\n");
            exit(EXIT_FAILURE);
        }
    }
    int i = h->len + 1;
    int j = i / 2;
    while (i > 1 && h->nodes[j].priority > priority) {
        h->nodes[i] = h->nodes[j];
        i = j;
        j = j / 2;
    }
    h->nodes[i].priority = priority;
    h->nodes[i].data = data;
    h->len++;
}
 
void *pq_pop(pq_t *h) {
    int i, j, k;
    if (!h->len) {
        return NULL;
    }
    char *data = h->nodes[1].data;
    h->nodes[1] = h->nodes[h->len];
    h->len--;
    i = 1;
    while (1) {
        k = i;
        j = 2 * i;
        if (j <= h->len && h->nodes[j].priority < h->nodes[k].priority) {
            k = j;
        }
        if (j + 1 <= h->len && h->nodes[j + 1].priority < h->nodes[k].priority) {
            k = j + 1;
        }
        if (k == i) {
            break;
        }
        h->nodes[i] = h->nodes[k];
        i = k;
    }
    h->nodes[i] = h->nodes[h->len + 1];
    return data;
}

void *pq_show_next(pq_t *h) {
    if (!h->len) {
        return NULL;
    }
    return h->nodes[1].data;
}

pq_t* pq_create() {
    pq_t *h = (pq_t *)calloc(1, sizeof (pq_t));
    if (h == NULL) {
        printf("Not enough memory for pq creation!\n");
        exit(EXIT_FAILURE);
    }
    return h;
}