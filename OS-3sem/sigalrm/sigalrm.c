#include <stdlib.h>
#include <stdio.h>
#include <signal.h>
#include <sys/time.h>
#include <sched.h>

static int g_is_done;
int timer_getcounter() {
	struct itimerval cur_it;
	getitimer(ITIMER_REAL, &cur_it);
	return cur_it.it_value.tv_usec;
}

void timer_handler(void);

void signal_handler(int signal, siginfo_t *info, void *ctx) {
	printf("%s: in\n", __func__);
// CHECK begin
	timer_handler();
// CHECK begin
	printf("%s: out\n", __func__);
}





// TODO start

#include "pq.h" //priority queue

struct timeval time_from_start = {
	.tv_sec = 0,
	.tv_usec = 0
};

typedef struct {
	long int interval_sec;
	long int expires_in_sec;
	void(*handler)(void);
} my_timer;

pq_t* PQ;

void timer_add_new(int sec, void(*soft_hnd)(void)) {
	my_timer* new_timer = (my_timer*)malloc(sizeof(my_timer));
	new_timer->interval_sec = sec;
	new_timer->expires_in_sec = sec;
	new_timer->handler = soft_hnd;

	pq_push(PQ, sec, new_timer);
}

void timer_handler(void) {
	time_from_start.tv_sec++;

	my_timer* next_timer = pq_show_next(PQ);

	if (next_timer != NULL) {
		next_timer->expires_in_sec--;
	
		if (next_timer->expires_in_sec <= 0) {
			while ((next_timer = pq_pop(PQ)) != NULL) {
				next_timer->handler();

				next_timer->expires_in_sec = time_from_start.tv_sec + next_timer->interval_sec;
				pq_push(PQ, next_timer->expires_in_sec, next_timer);

				my_timer* next_next_timer = pq_show_next(PQ);
				if (next_next_timer != NULL) {
					next_next_timer->expires_in_sec -= time_from_start.tv_sec;

					if (next_next_timer->expires_in_sec > 0) {
						break;
					}
				}
			}
		}
	}	
}

int timer_init(int sec, void(*soft_hnd)(void)) {
	timer_add_new(sec, soft_hnd);
	return 0;
}

int timer_gettime() {
	return 1e6 * (time_from_start.tv_sec + 1) - timer_getcounter();
}

// TODO end








void hnd3(void) {
	printf("%s: called every 3 secs\n", __func__);
}

void hnd5(void) {
	printf("%s: called every 5 secs\n", __func__);
}

int main(int argc, char *argv[]) {

	PQ = pq_create();

	struct sigaction sa = {
		.sa_sigaction = signal_handler,
	};
	sigemptyset(&sa.sa_mask);
	sigaction(SIGALRM, &sa, NULL);


	timer_init(3, hnd3);
	timer_init(5, hnd5);

	const struct itimerval setup_it = {
		.it_interval = { 1 /*sec*/, 0 /*usec*/},
		.it_value    = { 1 /*sec*/, 0 /*usec*/},
	};
	setitimer(ITIMER_REAL, &setup_it, NULL);

	int count = 0;
	while (!g_is_done) {
		if (!count--) {
			printf("cur_it = %d\n", timer_gettime());
			count = 1000000;
		}
		
		sched_yield();
	}
	return 0;
}