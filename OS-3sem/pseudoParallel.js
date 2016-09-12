let sheduler = {
	tasks: [],

	run: function() {
		while (this.tasks.length) {
			for (let i = 0; i < this.tasks.length; i++) {
				this.tasks[i].tick();

				if (this.tasks[i].isDone) {
					this.tasks.splice(i, 1); //removing task from tasks array
					i--;
				}
			}
		}		
	}

}



/*
 * Task constructor
 *
*/

let Task = function(opts) {
	this.functions = opts.functions;
	this.curFunction = 0;
	this.isDone = false;
}

Task.prototype = {
	tick: function() {
		this.functions[this.curFunction]();
		this.curFunction++;

		if (this.functions.length == this.curFunction) {
			this.isDone = true;
		}	
	}
}



let sleep = function(ms) {
	ms += new Date().getTime();
	while (new Date() < ms) {}
} 




let task1 = new Task({
	functions: [
		() => {
			console.log('hello [from task1]');
			sleep(2000)
		},
		() => {
			console.log('world [from task1]');
		}
	]
})

let task2 = new Task({
	functions: [
		() => {
			console.log('hello [from task2]');
			sleep(2000)
		},
		() => {
			console.log('world [from task2]');
			sleep(2000)
		},
		() => {
			console.log('world2 [from task2]');
		}
	]
})


let task3 = new Task({
	functions: [
		() => {
			console.log("I'm task3! What I'm doing here?");
			sleep(5000)
		}
	]
})




sheduler.tasks.push(task1, task2, task3);
sheduler.run();