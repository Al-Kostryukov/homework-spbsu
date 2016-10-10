typedef struct {
    long int priority;
    void *data;
} node_t;
 
typedef struct {
    node_t *nodes;
    int len;
    int size;
} pq_t;

 
void pq_push(pq_t *h, long int priority, void *data);
void *pq_pop(pq_t *h);
void *pq_show_next(pq_t *h);
pq_t* pq_create();