const
	path = require('path');

//only one global var. Because i really hate relative paths to main directories.
global.DIRS = {
	lib:          path.join(__dirname, 'lib'),
	views:        path.join(__dirname, 'views'),
	models:       path.join(__dirname, 'models'),
	controllers:  path.join(__dirname, 'controllers'),
	routes:       path.join(__dirname, 'routes'),
	vendor:       path.join(__dirname, 'vendor'),
	globalConfig: path.join(__dirname, '../../config')
}



const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
	config = common_lib.configs.requireGlobal();

const
	express = common_lib.packages.require('express'),
	bodyParser = common_lib.packages.require('body-parser'),
	nodemailer = common_lib.packages.require('nodemailer'),
	jade = common_lib.packages.require('jade'),
	mongoose = common_lib.packages.require('mongoose');


var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'jade');
app.set('views', DIRS.views);




/** 
  *  Setting up Routes
  *  [they recursevely will mount controllers and so on...]
  *
**/ 

require(DIRS.routes)(app);




/** 
  *  Setting up Email transporter
  *
**/ 

// create reusable transporter object using the default SMTP transport
const smtpConfig = {
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: config.mail.noreply.email,
        pass: config.mail.noreply.password
    }
};

app.locals.transporter = nodemailer.createTransport(smtpConfig);



mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/albreeDb', function(err) {
	if (err) {
		console.log('Mongoose connect failed\n', err);
		return;
	}

	console.log("Connected to MongoDB; Database: albreeDb");

	const
		hostname = '127.0.0.1',
		port = process.argv[2];

	var server = app.listen(port, hostname, function() {
		console.log(`Server running at http://${hostname}:${port}/`)	
	});	
});