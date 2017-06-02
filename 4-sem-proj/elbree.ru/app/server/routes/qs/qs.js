const
	path = require('path');

const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

const
	express = common_lib.packages.require('express');

const
  QsController = require(path.join(DIRS.controllers, 'qs.js'));

const
  qsRouter = express.Router();


const isSignedIn = function(req, res, next) {
	if (req.isSignedIn) {
		next();
	} else {
		res.redirect('/sign-in');
	}
}



qsRouter
  .get('/', QsController.qs.get)

qsRouter
	.get('/add', isSignedIn, function(req, res){
		res.render('qs/add.pug');
	})
	.post('/add', isSignedIn, QsController.add.post);




qsRouter
	.get('/:id', QsController.qOne.get);

qsRouter
	.post('/:id/add-answer', isSignedIn, QsController.qOne.addAnswer);

qsRouter
	.get('/hashtags/:hashtag', QsController.hashtags.get);

module.exports = qsRouter;
