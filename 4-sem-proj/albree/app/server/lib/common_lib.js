const
	path = require('path');

const packages = {
	require: function(module) {
		return require(path.join(DIRS.vendor, 'node_modules', module));
	},
	requireArray: function(arr) {
		const length = arr.length;
		for (var i = 0; i < length; i++) {
			this.require(arr[i])
		}	
	}
}

const configs = {
	globalConfigFile: path.join(DIRS.globalConfig, 'config.json'),
	requireGlobal: function() {
		return require(this.globalConfigFile);
	}
}

const utilits = {
	generateRandomString: function(len) {
		var str = "";
    	const
    		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
			pLen = possible.length;

    	for (var i = 0; i < len; i++) {
    		str += possible[Math.floor(Math.random() * pLen)];
    	}
    	
    	return str;
	}
}


exports.packages = packages;
exports.configs = configs;
exports.utilits = utilits;
