const
	path = require('path');

//libs/configs
const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

//vendor
const
	express =  common_lib.packages.require('express');

//controllers
const
  UserController = require(path.join(DIRS.controllers, 'user.js'));

const
  signInRouter = express.Router();


signInRouter
  .get('/', function(req, res) {
    res.render('sign-in/sign-in.pug');
  })
  .post('/', UserController.signIn.post);


signInRouter
  .get('/restore', function(req, res) {
    res.render('sign-in/sign-in-restore.pug');
  })
  .post('/restore', UserController.signIn.restorePassword.post)
  .get('/restore/:code', UserController.signIn.restorePassword.code);


module.exports = signInRouter;
