const
	path = require('path');
    
const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
	jade = common_lib.packages.require('jade'),
    bcrypt = common_lib.packages.require('bcrypt');

const
    User = require(path.join(DIRS.models, 'user.js')),
    EmailVerification = require(path.join(DIRS.models, 'email-verification.js')),
    RestorePassword = require(path.join(DIRS.models, 'restore-password.js'));



const sendMailRestore = function(transporter, opts) {
    const 
        link = 'http://albree.ru/sign-in/restore/' + opts.code;

    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: '"albree.ru" <no-reply@albree.ru>',
            to: opts.email,
            subject: 'Восстановление пароля на albree.ru',
            text: 
                'Чтобы восстановить пароль, перейдите по ссылке или скопируйте ее в адресную строку браузера: '
                + link + '. Если Вы не регистрировались на albree.ru, \
                то просто проигнорируйте это письмо.',
            html:
                jade.renderFile(
                    path.join(DIRS.views, 'sign-in-sign-up', 'restore-password-letter.jade'),
                    { link }
                )
        };
        
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                throw {
                    myType: 'emailNotSent',
                    message: 'Что-то пошло не так...'
                }
            } else {
                resolve(info);
            }
            
        });
        
    })
}



const bcryptCompare = function(password, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(error, res) {
            if (error) {
                throw {
                    myType: 'bcryptHashError',
                    message: 'Что-то пошло не так...'
                }
            } else if (!res) {
                throw {
                    myType: 'passwordsNotMatch',
                    message: 'Пароли не совпадают!'
                }
            } else {
                resolve(user)
            }
        });
    })
}



const insertRestorePasswordDoc = function(opts) {
    const
        restorePassword = new RestorePassword({
            _id: opts._id,
            code: opts.code
        })

    return new Promise((resolve, rejected) => {
        restorePassword
            .save()
            .then(() => {
                resolve(opts)
            })
            .catch((error) => {
                throw {
                    myType: 'insertRestorePasswordFailed',
                    message: 'Что-то пошло не так...'
                }
            })
    });
}



const getMailButton = function(email) {
    const
        domain = email.split('@')[1];

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

//dooooo
exports.signInPost = function(req, res) {
	var app = req.app;

	const
		email = req.body.email,
		password = req.body.password;


    User
        .findOne({ email }).exec()
        .then((user) => {
            if (!user) {
                throw {
                    myType: 'userNotFound',
                    message: 'Пользователь с таким email не найден!'
                }
            } else {
                return user;                
            }            
        })
        .then((user) => {
            if (!user.emailVerified) {
                throw {
                    myType: 'emailNotVerified',
                    message: 'Email не верифицирован. Пожалуйста, зайдите в вашу почту, чтобы верифицировать Ваш email!'
                }
            } else {
                return user;
            }
        })
        .then((user) => {
            return bcryptCompare(password, user);
        })
        .catch((error) => {
            if (!error.myType) {
                res.send([false, "Возникла ошибка. Попробуйте позже..."])
                console.log("signUpPost: Error")
            } else {
                switch (error.myType) {
                    case 'userNotFound':
                    case 'emailNotVerified':
                        res.send([false, error.message]);
                        break;
                }
                
            }
        })


    

}



//dooooo
exports.restorePasswordCode = function(req, res) {
	const
		code = req.params.code;

    EmailVerification
        .findOne({ code }).exec()
        .then((doc) => {
            if (doc) {
                return new Promise((resolve, rejected) => {
                    EmailVerification.remove({_id: doc._id}, (error) => {
                        if (error) {
                            throw {
                                myType: 'cantRemoveDoc',
                                message: 'Не можем удалить запись...'
                            }
                        } else {
                            resolve(doc._id)
                        }
                    });
                })
            } else {
                throw {
                    myType: 'noSuchDoc',
                    message: 'Ссылка недействительна...'
                }
            }                        
        })
        .then((_id) => {
            return User.findByIdAndUpdate(_id, {$set: { emailVerified: true }}).exec(); 
        })
        .then(() => {
            res.redirect('/profile');
        })
        .catch((error) => {
            if (!error.myType) {
                res.send([false, "Возникла ошибка. Попробуйте позже..."])
                console.log("verifyEmailCode: Something went wrong!");
            } else {
                switch (error.myType) {
                    case 'noSuchDoc':
                    case 'cantRemoveDoc':
                        res.send([false, error.message]);
                        break;
                }
                
            }
        })
}




//dooooo
exports.restorePasswordPost = function(req, res) {
    const
        code = req.params.code;

    RestorePassword
        .findOne({ code }).exec()
        .then((doc) => {
            if (doc) {
                return new Promise((resolve, rejected) => {
                    RestorePassword.remove({_id: doc._id}, (error) => {
                        if (error) {
                            throw {
                                myType: 'cantRemoveDoc',
                                messageDev: 'Не можем удалить запись...',
                                message: 'Что-то пошло не так...'
                            }
                        } else {
                            resolve(doc._id)
                        }
                    });
                })
            } else {
                throw {
                    myType: 'noSuchDoc',
                    message: 'Ссылка недействительна...'
                }
            }                        
        })
        .then((_id) => {
            return User.findByIdAndUpdate(_id, {$set: { emailVerified: true }}).exec(); 
        })
        .then(() => {
            res.redirect('/profile');
        })
        .catch((error) => {
            if (!error.myType) {
                res.send([false, "Возникла ошибка. Попробуйте позже..."])
                console.log("verifyEmailCode: Something went wrong!");
            } else {
                switch (error.myType) {
                    case 'noSuchDoc':
                    case 'cantRemoveDoc':
                        res.send([false, error.message]);
                        break;
                }
                
            }
        })
}