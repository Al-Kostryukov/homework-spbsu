const
	path = require('path');

//libs/configs
const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

//vendor
const
	pug = common_lib.packages.require('pug'),
	bcrypt = common_lib.packages.require('bcrypt'),
	passport = common_lib.packages.require('passport');

//models
const
  User = require(path.join(DIRS.models, 'user.js')),
  EmailVerification = require(path.join(DIRS.models, 'email-verification.js'));



UserController = {
	signIn: {
	  post: function (req, res, next) {
			passport.authenticate('local', function(error, user, info) {
        if (error) {
          res.json({status: false, data: 'Что-то пошло не так... Возможно, стоит попробовать позже.'})
          return
        }
        // User does not exist
        if (!user) {
          res.json({status: false, data: 'Неправильный email или пароль!'});
          return
        }

				req.logIn(user, function(error) {
          if (error) {
						res.json({status: false, data: 'Что-то пошло не так... Возможно, стоит попробовать позже.'})
						return
          }

					res.json({status: true, data: {}});
          return
        });
    	})(req, res, next);
		},
	  restorePassword: {
	    post: function(req, res) {

	    },
	    code: function(req, res) {

	    }
	  }
	},
	validation: {
		signUpFrom: function(fields) {
			return [true, {
				nickname: [true, null],
				email: [true, null],
				password: [true, null]
			}]
		},
		nickname: function(nickname) {

		},
		email: function(email) {

		},
		password: function() {

		}
	},
	signUp: {
	  post: function(req, res) {
			var app = req.app;

			const
				nickname = req.body.nickname,
				email = req.body.email,
				password = req.body.password;

	    const
				validation = UserController.validation.signUpFrom({ nickname, email, password });

	    if (!validation[0]) {
	        res.json({status: false, data: validation[1]})
	        return;
	    }

	    User
        .find({ $or: [{ email }, { nickname }] }).exec()
        .then((docs) => {
        	if (!docs.length) {
            return new Promise((resolve, reject) => {
			        bcrypt.hash(password, 12, function(error, hash) {
			            if (error) {
			                reject({
			                    myType: 'bcryptHashError',
			                    message: ''
			                })
			            } else {
			                resolve(hash);
			            }
			        });
				    })
          } else {
						let errors = new Set();
						for (doc of docs) {
							if (doc.email === email) {
								if (doc.emailVerified) {
	              	errors.add('emailAlreadyExists1');
	              } else {
									errors.add('emailAlreadyExists2');
	              }
							} else if (doc.nickname === nickname) {
								errors.add('nicknameAlreadyExists');
							}
						}

						if (errors.has('emailAlreadyExists1')) {
							if (errors.has('nicknameAlreadyExists')) {
								throw {
									myType: 'emailAlreadyExists1_nicknameAlreadyExists',
									message: 'Пользователь с таким email уже зарегистрирован.<br>Пользователь с таким никнеймом уже зарегистрирован.'
								}
							} else {
								throw {
									myType: 'emailAlreadyExists1',
									message: 'Пользователь с таким email уже зарегистрирован.'
								}
							}
						} else if (errors.has('emailAlreadyExists2')) {
							throw {
								myType: 'emailAlreadyExists2',
								message: 'Ты уже зарегистрирован :)<br>Изменить никнейм/пароль можно будет в профиле.<br>А сейчас загляни в свою почту, мы отправили письмо с инструкцией, как подтвердить email.'
							}
						} else if (errors.has('nicknameAlreadyExists')) {
							throw {
								myType: 'nicknameAlreadyExists',
								message: 'Пользователь с таким никнеймом уже зарегистрирован.'
							}
						}
          }
        })
        .then((hashedPassword) => {
          const user = new User({
            nickname,
            email,
            password: hashedPassword,
            emailVerified: false
          })

          return user.save();
        })
        .then((user) => {
          return {
            code: user._id + common_lib.utilits.generateRandomString(12),
            userId: user._id
          }
        })
        .then((opts) => {
					const emailVerification = new EmailVerification({
            userId: opts.userId,
            code: opts.code,
						email: email
		      })

			    return new Promise((resolve, reject) => {
		        emailVerification
	            .save()
	            .then(() => {
                resolve(opts)
	            })
	            .catch((error) => {
                reject({
                  myType: 'insertEmailVerifFailed',
                  message: ''
                })
	            })
			    });
				})
        .then((opts) => {
					const link = 'http://localhost/sign-up/verify-email/' + opts.code;

			    return new Promise((resolve, reject) => {
		        const mailOptions = {
	            from: '"elbree.ru" <no-reply@albree.ru>',
	            to: email,
	            subject: 'Подтверди свой email для elbree.ru',
	            text:
	                'Чтобы подтвердить email, перейди по ссылке или скопируй ее в адресную строку браузера: '
	                + link + '. Если Вы не регистрировались на elbree.ru, \
	                то просто проигнорируйте это письмо.',
	            html:
	                pug.renderFile(
	                    path.join(DIRS.views, 'sign-up', 'email-letters', 'verifying-email-letter.pug'),
	                    { link }
	                )
		        };

		        // send mail with defined transport object
		        app.locals.transporter.sendMail(mailOptions, function(error, info) {
	            if (error) {
                reject({
                  myType: 'emailNotSent',
                  message: 'Не удалось отправить письмо для подтверждения email. Проверьте правильность email или попробуйте позже.'
              	})
	            } else {
                resolve(info); //not needed
	            }
		        });
			  	})
        })
        .then(() => {
					const getMailButton = function(email) {
				    const domain = email.split('@')[1];

				    if (['ya.ru', 'yandex.ru'].indexOf(domain) != -1) {
				      return [true, 'Перейти в Яндекс.Почту', 'https://mail.yandex.ru/'];
				    } else if (['gmail.com'].indexOf(domain) != -1) {
				      return [true, 'Перейти в Gmail', 'https://mail.google.com/'];
				    } else if (['mail.ru'].indexOf(domain) != -1) {
				      return [true, 'Перейти в Почту Mail.Ru', 'https://e.mail.ru/'];
				    } else if (['rambler.ru'].indexOf(domain) != -1) {
				      return [true, 'Перейти в Рамблер/почту', 'https://mail.rambler.ru/'];
				    }

				    return [false, null, null];
					}

          res.json({
						status: true,
						data: {
	            verifyingBlockHtml: pug.renderFile(path.join(DIRS.views, 'sign-up', 'verify-email-block-after-form.pug'),
	              { nickname, email, mailButton: getMailButton(email) })
          	}
					});
        })
        .catch((error) => {
					if (!error.myType) {
			      error.myType = 'unknownError';
			      error.message = 'Что-то пошло не так... Возможно, стоит попробовать позже.';
			    }

	        switch (error.myType) {
	            case 'emailAlreadyExists1':
	            case 'emailAlreadyExists2':
							case 'emailAlreadyExists1_nicknameAlreadyExists':
							case 'nicknameAlreadyExists':
							case 'insertEmailVerifFailed':
	            case 'emailNotSent':
							case 'unknownError':
                res.json({status: false, data: error.message});
                break;
	        }
        })
	  },
	  verifyEmailCode: function(req, res) {
			const	code = req.params.code;

	    EmailVerification
        .findOne({ code }).exec()
        .then((doc) => {
          if (doc) {
            return new Promise((resolve, reject) => {
              EmailVerification.remove({_id: doc._id}, (error) => {
                if (error) {
                  reject({
                    myType: 'cantRemoveEmailVerifDoc',
                    messageDev: 'Не можем удалить запись...',
										message: 'У нас неполадки на сервере. Пожалуйста, попробуй позже...'
                  })
                } else {
                  resolve(doc.userId)
                }
              });
            })
          } else {
            throw {
              myType: 'noSuchEmailVerifDoc',
              message: 'Ссылка недействительна...'
            }
          }
        })
        .then((userId) => {
          return User.findByIdAndUpdate(userId, {$set: { emailVerified: true }}).exec();
        })
        .then((doc) => {
          res.render('sign-up/verify-email-ok.pug', {
						nickname: doc.nickname
					})
        })
				.catch((error) => {
					if (!error.myType) {
			      error.myType = 'unknownError';
			      error.message = 'Что-то пошло не так... Возможно, стоит попробовать позже.';
			    }

	        switch (error.myType) {
							case 'cantRemoveEmailVerifDoc':
	            case 'noSuchEmailVerifDoc':
							case 'unknownError':
							res.render('sign-up/verify-email-fail.pug', {
								message: error.message
							})
                break;
	        }
        })
		}
	}
}


module.exports = UserController;
