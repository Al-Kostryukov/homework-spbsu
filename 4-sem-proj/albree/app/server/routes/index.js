module.exports = function(app){
	require('./sign-in-sign-up.js')(app);
	require('./qs.js')(app);

	



	app.get('/', function(req, res){
	  res.redirect(301, '/qs');
	});
}
