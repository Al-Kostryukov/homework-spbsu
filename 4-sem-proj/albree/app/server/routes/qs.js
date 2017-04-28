module.exports = function(app) {
	app.get('/qs', function(req, res){
        res.render('qs.jade', {
        	staticResources: [],
        	metaPaga: {
        		keywords: 'kfkf',
        		description: 'xzczx'
        	},
            title: 'Qs',
        });
    });

    app.get('/qs/add', function(req, res){
        res.render('q-add.jade', {
        	staticResources: [],
        	metaPaga: {
        		keywords: 'kfkf',
        		description: 'gddg'
        	},
            title: 'Add',

        });
    });

    app.get('/qs/:id([0-9]+)', function(req, res){
        res.render('q-one.jade', {
        	staticResources: [],
        	metaPaga: {
        		keywords: 'kfkf',
        		description: 'sgsdg'
        	},
            title: 'Q',
        });
    });
}
