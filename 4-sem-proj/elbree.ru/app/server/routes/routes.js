const
	path = require('path');

const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

const
	express = common_lib.packages.require('express');


const
  Router = express.Router(),
  signInRouter = require('./sign-in/sign-in.js'),
  signUpRouter = require('./sign-up/sign-up.js'),
  qsRouter = require('./qs/qs.js');



const isSignedIn = function(req, res, next) {
	if (req.isSignedIn) {
		res.redirect('/');
	} else {
		next();
	}
}


Router.use('/sign-in', isSignedIn, signInRouter);
Router.use('/sign-up', isSignedIn, signUpRouter);
Router.use('/qs', qsRouter);

Router
	.get('/sign-out', function(req, res) {
		if (req.isSignedIn) {
			req.logout();
			req.session.destroy(function(error) {
				if (error) {
					console.log(error);
				} else {
					res.redirect('back');
				}
			});
		} else {
			res.redirect('back');
		}
	})

Router
  .get('/', function(req, res){
    res.redirect(301, '/qs');
  });

module.exports = Router;
