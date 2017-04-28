const
	path = require('path');
    
const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
	jade = common_lib.packages.require('jade'),
    bcrypt = common_lib.packages.require('bcrypt');

const
    User = require(path.join(DIRS.models, 'user.js')),
    EmailVerification = require(path.join(DIRS.models, 'email-verification.js'));



const sendMailVerify = function(transporter, opts) {
    const 
        link = 'http://albree.ru/verify-email/' + opts.code;

    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: '"albree.ru" <no-reply@albree.ru>',
            to: opts.email,
            subject: 'Пожалуйста, подтвердите ваш email для albree.ru',
            text: 
                'Чтобы подтвердить email, перейдите по ссылке или скопируйте ее в адресную строку браузера: '
                + link + '. Если Вы не регистрировались на albree.ru, \
                то просто проигнорируйте это письмо.',
            html:
                jade.renderFile(
                    path.join(DIRS.views, 'sign-in-sign-up', 'verifying-email-letter.jade'),
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



const insertEmailVerificationDoc = function(opts) {
    const
        emailVerification = new EmailVerification({
            _id: opts._id,
            code: opts.code
        })

    return new Promise((resolve, reject) => {
        emailVerification
            .save()
            .then(() => {
                resolve(opts)
            })
            .catch((error) => {
                throw {
                    myType: 'insertEmailVerificationFailed',
                    message: 'Что-то пошло не так...'
                }
            })
    });
}

const bcryptPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, function(error, hash) {
            if (error) {
                throw {
                    myType: 'bcryptHashError',
                    messageDev: 'Bcrypt error',
                    message: 'Что-то пошло не так...'
                }
            } else {
                resolve(hash);
            }
        });
    })
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


const validateForm = function(fields) {
    const vs = {
        validateNickname: function(val) {
            if (/^\s+|\s+$/.test(val)) {
                return [false, "Не используйте пробелы в начале<br>и в конце строки!"];
            } else if (val.length == 0) {
                return [false, "Введите никнейм!"];
            } else if (val.length > 40) {
                return [false, "Длина никнейма должна быть меньше 40 символов!"];
            } else {
                return [true, null];
            }          
        },
        validateEmail: function(val) {
            const
                re = /\S+@\S+\.\S+/;

            if (/^\s+|\s+$/.test(val)) {
                return [false, "Пробелы в начале и в конце запрещены!"];
            } else if (val.length == 0 || !re.test(val)) {
                return [false, "Введите Email!"];
            } else {
                return [true, null];
            }
        },
        validatePassword: function(val) {
            const
                re = /^[A-Za-z0-9\{\}\[\]\$\-\^]+$/;

            if (val.length == 0) {
                return [false, "Введите пароль!"];
            } else if (val.length < 10 || val.length > 30) {
                return [false, "Пароль должен иметь длину <br><b>от 10 до 30 символов</b>!"];
            } else if (!re.test(val)) {
                return [false, "Разрешены буквы латинского алфавита <br> <b>A-Z</b>, <b>a-z</b>, цифры <b>0-9</b>, символы <b>{</b>, <b>}</b>, <b>[</b>, <b>]</b>, <b>$</b>, <b>-</b>, <b>^</b>!"];
            } else {
                return [true, null];
            }          
        },
        validatePasswordRepeat: function(password, passwordRepeat) {
            if (password != passwordRepeat) {
                return [false, "Пароли не совпадают!"];
            } else {
                return [true, null];
            }
        }
    }

    const v = [
            vs.validateNickname(fields.nickname),
            vs.validateEmail(fields.email),
            vs.validatePassword(fields.password),
            vs.validatePasswordRepeat(fields.password, fields.passwordRepeat)
        ];

    var result = [],
        status = true;

    for (let val of v) {
        if (!val[0]) {
            status = false;
            result.push(val[1])
        }
    }

    return [status, result];
}


exports.signUpPost = function(req, res) {
	var app = req.app;

	const
		nickname = req.body.nickname,
		email = req.body.email,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

    const validation = validateForm({ nickname, email, password, passwordRepeat })

    if(!validation[0]) {
        res.send([false, validation[1]])
        return;
    }
    

    User
        .findOne({ email }).exec()
        .then((doc) => {
            if (!doc) {
                return bcryptPassword(password);
            } else {
                if (doc.emailVerified) {
                    throw {
                        myType: 'emailAlreadyExists1',
                        message: 'Пользователь с таким email уже существует!'
                    }
                } else {
                    throw {
                        myType: 'emailAlreadyExists2',
                        message: 'Пользователь с таким email уже существует!\
                            <br> Загляните в свою почту, чтобы верифицировать email.'
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
                _id: user._id 
            }
        })
        .then(insertEmailVerificationDoc)
        .then((opts) => {
            opts.email = email;
            return sendMailVerify(app.locals.transporter, opts);
        })
        .then(() => {
            res.send([true, {
                verifyingBlockHtml: 
                    jade.renderFile(
                        path.join(DIRS.views, 'sign-in-sign-up', 'verifying-block-html.jade'),
                        { nickname, email, mailButton: getMailButton(email) }
                    )
            }]);
        })
        .catch((error) => {
            if (!error.myType) {
                res.send([false, "Возникла ошибка. Попробуйте позже..."])
                console.log("signUpPost: Error")
            } else {
                switch (error.myType) {
                    case 'emailAlreadyExists1':
                    case 'emailAlreadyExists2':
                    case 'emailNotSent':
                    case 'insertEmailVerificationFailed':
                        res.send([false, error.message]);
                        break;
                    default:
                        res.send([false, 'Что-то поло не так... Возможно, Вам стоит попробовать позже.']);
                        break;
                }
                
            }
        })


    

}




exports.verifyEmailCode = function(req, res) {
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
