/*
 * You can run it: node pseudoParallel2.js
 * [if nodejs v>=6.0.0 installed]
*/

/*
 * Helpful functions
 *
*/

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function sleep(ms) {
	ms += new Date().getTime();
	while (new Date() < ms) {}
} 



/*
 * Main part
 *
*/


/*
 * Sheduler constructor
 *
*/

let Sheduler = function(opts) {
	this.tasks = [];
	this.curTaskId = 0;
	this.policyType = opts.policyType;
	this.policy = new Policy(this.policyType);
}

Sheduler.prototype = {
	addTasks: function(newTasks) {
		this.assignIdsToTasks(newTasks);

		if (isArray(newTasks)) {
			this.tasks = this.tasks.concat(newTasks);
		} else {
			//newTasks is one task here
			this.tasks.push(newTasks);
		}		
	},
	run: function() {
		while (this.tasks.length) {
			let task = this.policy(this.tasks); //this.policy(tasks) returns most preferred for current policy task to execute

			task.execute();
			
			if (task.state == 'Done') {
				this.removeTask(task.id);
			}
		}
	},
	removeTask: function(id) {
		for (let i = 0; i < this.tasks.length; i++) {			
			if (this.tasks[i].id == id) {
				this.tasks.splice(i, 1); //removing task from tasks array
				return;
			}
		}
	},
	getNextTaskId: function() {
		return ++this.curTaskId;
	},
	assignIdsToTasks: function(tasks) {
		if (isArray(tasks)) {
			for (let i = 0; i < tasks.length; i++) {
				tasks[i].id = this.getNextTaskId();
			}
		} else {
			//tasks is one task here
			tasks.id = this.getNextTaskId();
		}
	}
}




/*
 * Policy constructor
 * 
*/

let Policy = function(type) {
	switch(type) {
		case 'cycle':
			return this.cycle;
			break;
		case 'timePriority':
			return this.timePriority;
			break;
		case 'guaranteed':
			return this.guaranteed;
			break;
		case 'priority':
			return this.priority;
			break;
	}
}

Policy.prototype = {
	cycle: function(tasks) {
		return tasks[0];
	},
	timePriority: function(tasks) {
		//not implemented
	},
	guaranteed: function(tasks) {
		//not implemented.
	},
	priority: function(tasks) {
		let maxPriority = tasks[0].priority,
			task_i = 0;
		
		for (let i = 1; i < tasks.length; i++) {	
			if (tasks[i].priority > maxPriority) {
				maxPriority = tasks[i].priority,
				task_i = i;
			}
		}

		return tasks[task_i];	
	}
}






/*
 * Task constructor
 *
*/

let Task = function(opts) {
	this.func = opts.func;
	this.state = 'Created';
	this.priority = opts.priority || 1; //task executes first if it has HIGHER priority (&& policyType == 'priority')
}

Task.prototype = {
	execute: function() {
		if (this.state != 'Done') {
			this.state = 'Executing';
			this.func();
			this.state = 'Done';
		}
	}
}












/*
 * OK, let's go
 *
*/



function asyncOperaton(func, callback) {
	console.log("asyncOperaton. It will be executed later, after executing all existing tasks at the moment");
	curSheduler.addTasks(
		new Task({
			func: function() {
				func();
				callback();
			}
		})
	);
}


function asyncOperatonWithHighPriority(func, callback) {
	console.log("asyncOperatonWithHighPriority. It will be executed now");
	curSheduler.addTasks(
		new Task({
			func: function() {
				func();
				callback();
			},
			priority: 50
		})
	);
}

function syncOperaton(func, callback) {
	console.log("syncOperaton. It will be executed NOW. So you need to wait :(");
	func();
	callback();
}


/*
 * 1'st sheduler
 *
*/

console.log("SHEDULER 1");

/*
 * Our tasks
 *
*/


let task1 = new Task({
	func: () => {
		console.log('hello [from task1]');
		asyncOperaton(function() {
			sleep(10000)
		}, function() {
			console.log('world [from task1]');
		});
	}
})

let task2 = new Task({
	func: () => {
		console.log('hello [from task2]');
		sleep(10000);
		console.log('world [from task2]');
	}
})

let task3 = new Task({
	func: () => {
		console.log('hello [from task3]');
		syncOperaton(function() {
			sleep(10000)
		}, function() {
			console.log('world [from task3]');
		});
	}
})


let sheduler1 = new Sheduler({
	policyType: 'cycle'
});

let curSheduler = sheduler1;

sheduler1.addTasks([task1, task2, task3]);
sheduler1.run();




/*
 * 2'nd sheduler
 *
*/

console.log("\nSHEDULER 2");

/*
 * Our tasks
 *
*/

let task4 = new Task({
	func: () => {
		console.log('hello [from task4]');
		asyncOperaton(function() {
			sleep(10000)
		}, function() {
			console.log('world [from task4]');
		});
	},
	priority: 5
})

let task5 = new Task({
	func: () => {
		console.log('hello [from task5]');
		sleep(10000);
		console.log('world [from task5]');
	},
	priority: 10
})

let task6 = new Task({
	func: () => {
		console.log('hello [from task6]');
		syncOperaton(function() {
			sleep(10000)
		}, function() {
			console.log('world [from task6]');
		});
	},
	priority: 15
})

let task7 = new Task({
	func: () => {
		console.log('hello [from task7]');
		asyncOperatonWithHighPriority(function() {
			sleep(10000)
		}, function() {
			console.log('world [from task7]');
		});
	},
	priority: 12
})

let sheduler2 = new Sheduler({
	policyType: 'priority'
});

curSheduler = sheduler2; 

sheduler2.addTasks([task4, task5, task6, task7]);
sheduler2.run();