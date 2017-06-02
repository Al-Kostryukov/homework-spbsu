const
	path = require('path');

const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

const
	express = common_lib.packages.require('express');

const
  UserController = require(path.join(DIRS.controllers, 'user.js'));

const
  signUpRouter = express.Router();


signUpRouter
  .get('/', function(req, res) {
    res.render('sign-up/sign-up.pug');
  })
  .post('/', UserController.signUp.post);


signUpRouter
  .get('/verify-email/:code', UserController.signUp.verifyEmailCode)
	.get('/verify-email-ok', function(req, res) {
		res.redirect(301, '/sign-in')
	});



module.exports = signUpRouter;
