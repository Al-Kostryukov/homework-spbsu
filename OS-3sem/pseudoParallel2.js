/*
 * You can run it: node pseudoParallel2.js
 * [if nodejs installed]
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
			this.policy(this.tasks);
			this.removeDoneTasks();
		};
	},
	removeTask: function(id) {
		for (let i = 0; i < this.tasks.length; i++) {			
			if (this.tasks[i].id == id) {
				this.tasks.splice(i, 1); //removing task from tasks array
				i--;
			}
		}
	},
	removeDoneTasks: function() {
		for (let i = 0; i < this.tasks.length; i++) {			
			if (this.tasks[i].state == 'Done') {
				this.removeTask(this.tasks[i].id);
				i--;
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

		return tasks;
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
	}
}

Policy.prototype = {
	cycle: function(tasks) {
		for (let i = 0; i < tasks.length; i++) {	
			tasks[i].execute();
		}
	},
	timePriority: function(tasks) {
		//not implemented
	},
	guaranteed: function(tasks) {
		//not implemented.
	},
	priority: function(tasks) {
		//sort tasks by priority, then execute
	}
}






/*
 * Task constructor
 *
*/

let Task = function(opts) {
	this.func = opts.func;
	this.state = 'Created'; //I know useing strings is bad, but
	this.priority = opts.priority || 1; //for future priority function priority 
}

Task.prototype = {
	execute: function() {
		this.state = 'Executing';
		this.func();
		this.state = 'Done';
	}
}






/*
 * Our tasks
 *
*/

function asyncBlockingOperaton(func, callback) {
	console.log("asyncBlockingOperaton. It will be executed later, on next loop tick");
	sheduler.addTasks(
		new Task({
			func: function() {
				func();
				callback();
			}
		})
	)
}

function blockingOperaton(func, callback) {
	console.log("blockingOperaton. It will be executed NOW. So you need to wait :(");
	func();
	callback();
}

let task1 = new Task({
	func: () => {
		console.log('hello [from task1]');
		asyncBlockingOperaton(function() {
			sleep(5000)
		}, function() {
			console.log('world [from task1]');
		});
	}
})

let task2 = new Task({
	func: () => {
		console.log('hello [from task2]');
		sleep(2000);
		console.log('world [from task2]');
	}
})


let task3 = new Task({
	func: () => {
		console.log('hello [from task3]');
		blockingOperaton(function() {
			sleep(5000)
		}, function() {
			console.log('world [from task3]');
		});
	}
})




/*
 * OK, let's go
 *
*/

let sheduler = new Sheduler({
	policyType: 'cycle'
});

sheduler.addTasks([task1, task2, task3]);
sheduler.run();