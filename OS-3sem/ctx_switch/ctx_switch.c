#define _GNU_SOURCE
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <stdio.h>
#include <signal.h>
#include <sys/time.h>
#include <sched.h>
#include <ucontext.h>
#include <sys/ucontext.h>

#define SYSCALL_SIG SIGUSR1

typedef void (*fn_t)(void);
void syscall(long arg1, long arg2, long arg3);

/// TASK 1: get argument out of mcontext
long get_1st_arg(mcontext_t *mctx) {
	//x86_64
	int shift = -8;
	char *char_pointer = *(char **)((char *)mctx->gregs[REG_RBP] + shift);
	return (long)char_pointer;
}
/// TASK end

/// TASK 2: implement schedule, should switch execution to another task and back on request
#define ANOTHER_STACK_SIZE 1e6

struct task {
	ucontext_t *uctx;
	unsigned char state; //0: initialised, 1: started/executing, 2:exited
	fn_t start_fn; 
};

struct task task_pool[2];
struct task *g_cur_task;

void task_init(struct task *tsk, fn_t start_fn) {
	tsk->state = 0;
	tsk->start_fn = start_fn;
}

void task_start(struct task *tsk) {
	tsk->state = 1;
	tsk->start_fn();
}

unsigned char all_tasks_exited() {
	for (int i = 0; i < sizeof(task_pool) / sizeof(*task_pool); ++i) {
		if (task_pool[i].state != 2) {
			return 0;
		}
	}

	return 1;
}

void schedule(ucontext_t *uctx, mcontext_t *mctx) {
	if (all_tasks_exited()) {
		printf("%s: there are no tasks to switch. Exiting...\n", __func__);
		exit(0);
	}

	struct task *next_task = g_cur_task == task_pool ? &task_pool[1] : task_pool;
	printf("%s: switching %p -> %p\n", __func__, g_cur_task, next_task);

	//1 variant	
	g_cur_task->uctx = uctx;
	//

	//2 variant, works too, but needs smarter logic with malloc/free	
	//g_cur_task->uctx = (ucontext_t *)malloc(sizeof(ucontext_t));
	//memcpy(g_cur_task->uctx, uctx, sizeof(ucontext_t));
	//

	if (next_task->state == 0) {// if there is no context for next task		
		next_task->uctx = (ucontext_t *)malloc(sizeof(ucontext_t));
		
		getcontext(next_task->uctx);

		next_task->uctx->uc_stack.ss_sp = (char *)malloc(ANOTHER_STACK_SIZE);;
		next_task->uctx->uc_stack.ss_size = ANOTHER_STACK_SIZE;
		next_task->uctx->uc_link = g_cur_task->uctx;
	    
		makecontext(next_task->uctx, (fn_t)task_start, 1, next_task);

		g_cur_task = next_task;
		setcontext(next_task->uctx);
	} else if (next_task->state == 1) {
		g_cur_task = next_task;
		setcontext(next_task->uctx);
	}
}

void task_exit(void) {
	g_cur_task->state = 2;
	printf("%s: task will never be continued\n", __func__);
	syscall((long) "task_exit", 0, 0);
}

/// TASK end

void syscall_handler(int signal, siginfo_t *info, void *ctx) {
	ucontext_t *uctx = (ucontext_t *) ctx;
	mcontext_t *mctx = &uctx->uc_mcontext;
	printf("%s: request for print \"%s\"\n", __func__, (const char *) get_1st_arg(mctx));
	schedule(uctx, mctx);
}

void syscall(long arg1, long arg2, long arg3) {
	raise(SYSCALL_SIG);
}
void deep_syscall2(long arg1, long arg2, long arg3) {
	syscall(arg1, arg2, arg3);
}
void deep_syscall1(long arg1, long arg2, long arg3) {
	deep_syscall2(arg1, arg2, arg3);
}
void deep_syscall(long arg1, long arg2, long arg3) {
	deep_syscall1(arg1, arg2, arg3);
}

#define APP_GEN(_name, _first, _second) \
	void _name(void) { \
		printf("%s: going to do 1st syscall\n", __func__); \
		deep_syscall((long) _first, 0, 0); \
		printf("%s: out of syscall, going to do 2nd syscall\n", __func__); \
		deep_syscall((long) _second, 0, 0); \
		printf("%s: out of second syscall, going to exit\n", __func__); \
		task_exit(); \
	}

APP_GEN(app1, "hello1", "world1");
APP_GEN(app2, "hello2", "world2");

void sched_add(fn_t fn) {
	struct task *tsk = NULL;

	for (int i = 0; i < sizeof(task_pool) / sizeof(*task_pool); ++i) {
		if (!task_pool[i].start_fn) {
			tsk = &task_pool[i];
			break;
		}
	}
	
	assert(tsk);
	task_init(tsk, fn);
}

void sched_process(void) {
	g_cur_task = task_pool;
	task_start(g_cur_task);
}

int main(int argc, char *argv[]) {

	struct sigaction sa = {
		.sa_sigaction = syscall_handler,
	};

	sigemptyset(&sa.sa_mask);

	//added by Alexey
	sa.sa_flags = 0;
	sa.sa_flags = sa.sa_flags | SA_NODEFER;	//for cathing signals when [we already cathed one and in the state of executing signal_handler]
	//

	sigaction(SYSCALL_SIG, &sa, NULL);

	sched_add(app1);
	sched_add(app2);

	sched_process();

	return 0;
}