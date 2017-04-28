const
    path = require('path');

const
    signUp = require(path.join(DIRS.controllers, 'sign-in-sign-up', 'sign-up.js')),
    signIn = require(path.join(DIRS.controllers, 'sign-in-sign-up', 'sign-in.js'));


module.exports = function(app) {

/**
  * SIGN UP
  * SIGN UP
  *
**/
    app.get('/sign-up', function(req, res) {
        res.render('sign-in-sign-up/sign-up.jade', {
        	staticResources: [],
        	metaPaga: {
        		keywords: '',
        		description: ''
        	},
            title: 'Регистрация | albree',

        });
    });

    app.post('/sign-up', signUp.signUpPost);
    app.get('/verify-email/:code', signUp.verifyEmailCode)


/**
  * SIGN IN
  * SIGN IN
  *
**/
    app.get('/sign-in/restore', function(req, res) {
        res.render('sign-in-sign-up/sign-in-restore.jade', {
            staticResources: [],
            metaPaga: {
                keywords: '',
                description: ''
            },
            title: 'Восстановление пароля | albree',
        });
    })



    app.get('/sign-in', function(req, res) {
        res.render('sign-in-sign-up/sign-in.jade', {
            staticResources: [],
            metaPaga: {
                keywords: 'Вход',
                description: 'Вход в albree.'
            },
            title: 'Вход | albree',

        });
    });


    app.post('/sign-in', signIn.signInPost);

    app.post('/sign-in/restore', signIn.restorePasswordPost)
    app.get('/sign-in/restore/:code', signIn.restorePasswordCode);
}
