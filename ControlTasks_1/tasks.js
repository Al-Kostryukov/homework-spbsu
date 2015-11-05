//3
function myPow(x, n){
	if(n < 0) return 1 / myPow(x, -n);
	
	if(n == 0) {
		return 1;
	} else if(n % 2 == 1){
		return myPow(x, n - 1) * x;
	} else{
		var p = myPow(x, n / 2);
		return p * p;
	}
}


//4
function countZerosInArray(arr){
	var count = 0;
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == 0) count++;
	}

	return count;
}


//5
function isArraySymmetrical(arr){
	var lastElementIndex = arr.length - 1,
		isSymmetrical = true;
	for(var i = 0; i < (arr.length - 1)/2; i++){
		if(arr[i] != arr[lastElementIndex - i]){
			isSymmetrical = false;
			break;
		}
	}

	return isSymmetrical;
}


//6
function isStringPalindrome(str){
	function removeSpaces(str){
		return str.replace(/\s+/g, '');
	}

	var str = removeSpaces(str).toLowerCase();


	var lastSymbolIndex = str.length - 1,
		isPalindrome = true;
	for(var i = 0; i < (str.length - 1)/2; i++){
		if(str[i] != str[lastSymbolIndex - i]){
			isPalindrome = false;
			break;
		}
	}

	return isPalindrome;
}


//7
function primes(n){
	var primes = [];

	for(var i = 2; i <= n; i++){
		isPrime = true;
		for(var j = 0; j < primes.length; j++){
			var prime = primes[j];
			if(prime * prime > i) break;
			if(i % prime == 0){
				isPrime = false;
				break;
			}
			
		}
		if(isPrime) primes.push(i);		
	}

	return primes.join(", ");
}


//10
function findString(str, substr){
	var count = 0,
		l = substr.length;

	for(var i = 0; i < str.length; i++){
		if(str.substr(i, l) == substr) count++;
	}
	return count;
}


//11
function fib(n){
	var arr = [1, 1],
		i = 2;


	while(i < n){
		arr[2] = arr[0] + arr[1];
		arr[0] = arr[1];
		arr[1] = arr[2];
		i++;
	}

	return arr[(n - 1) % 3];
}





//interact with console
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


doItAgain();

function doItAgain(){
	rl.question("Enter the name of the function with arguments, for example myPow(6, 10) \n", function(func) {

		try{
	  		var answer = eval(func); //This is VERY VERY BAD UNSAFE solution. But it is easier than parsing
		}catch(e){
			console.log("Something went wrong:(");
		}

		console.log(answer);

		doItAgain();
	});
}


