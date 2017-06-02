const
	path = require('path');

//libs/configs
const
	common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

//vendor
const
  passport = common_lib.packages.require('passport')
  LocalStrategy = common_lib.packages.require('passport-local').Strategy;

//models
const
  User = require(path.join(DIRS.models, 'user.js'));


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email }, function (error, user) {
      if (error) {
        return done(error);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }


      return user.comaparePassword(password)
        .then((result) => {
          if (!result) {
            return done(null, false, { message: 'Incorrect password.' });
          } else {
            return done(null, user);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    });
  }
));



passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
