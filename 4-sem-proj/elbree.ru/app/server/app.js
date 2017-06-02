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
	middleware:   path.join(__dirname, 'middleware'),
	globalConfig: path.join(__dirname, '../../config')
}


//libs/configs
const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
	config = common_lib.configs.requireGlobal();

//vendor
const
	express =        common_lib.packages.require('express'),
	bodyParser =     common_lib.packages.require('body-parser'),
	nodemailer =     common_lib.packages.require('nodemailer'),
	pug =            common_lib.packages.require('pug'),
	mongoose =       common_lib.packages.require('mongoose'),
	passport =       common_lib.packages.require('passport'),
	expressSession = common_lib.packages.require('express-session'),
	redisStore =     common_lib.packages.require('connect-redis')(expressSession);


const app = express();


//setting up middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//passport middleware
require(path.join(DIRS.middleware, 'auth/passport-init.js'));

app.use(expressSession({
  store: new redisStore({
    url: config.redisStore.url
  }),
	name: 'sid',
  secret: config.redisStore.secret,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
	if (req.user) {
		res.locals.user = req.user;
		res.locals.isSignedIn = true;
		req.isSignedIn = true;
	} else {
		res.locals.isSignedIn = false;
		req.isSignedIn = false;
	}
	next();
})

app.set('view engine', 'pug');
app.set('views', DIRS.views);




/**
  *  Setting up Routes
  *
**/

const Router = require(path.join(DIRS.routes, 'routes.js'));
app.use('/', Router);



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




/**
  *  Setting up MongoDB and Mongoose; Starting to listen.
  *
**/

mongoose.Promise = global.Promise;

mongoose.connect(config.db.mongodbUrl)
  .then(
    () => {
      console.log('Connected to MongoDB; Database: elbreeDb');
    },
    (error) => {
			console.log(error);
      throw {
        myType: 'mongodbConnectionFailed',
        message: 'Error: Mongodb/Mongoose Connection Failed'
      }
    })
  .then(() => {
  	const
  		hostname = '127.0.0.1',
  		port = process.argv[2];

  	var server = app.listen(port, hostname, function() {
  		console.log(`Server running at http://${hostname}:${port}/`)
  	})
  })
  .catch((error) => {
    if (!error.myType) {
      error.myType = 'unknownError';
      error.message = 'Unknown Error';
    }

    switch (error.myType) {
      case 'mongodbConnectionFailed':
      case 'redisConnectionFailed':
      case 'unknownError':
        console.log(error.message);
        break;
    }
  });
