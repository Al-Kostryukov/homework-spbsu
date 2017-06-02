const
  path = require('path');

//libs/configs
const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

//vendor
const
  mongoose = common_lib.packages.require('mongoose'),
  bcrypt = common_lib.packages.require('bcrypt');

//models
const
  Counter = require(path.join(DIRS.models, 'counter.js'));



const userSchema = new mongoose.Schema({
  _id: Number,
  nickname: String,
  email: String,
  password: String,
  emailVerified: Boolean,
  points: {
    type: Number,
    default: 100
  }
});


userSchema.pre('save', function(next) {
    var doc = this;
    Counter.findByIdAndUpdate({_id: 'userId'}, {$inc: { seq: 1} }, function(error, counter) {
        if (error) {
          return next(error);
        }

        doc._id = counter.seq;
        next();
    });
});


/* later - maybe, but now hashing implemented inside signup post controller. Need time.
Plus some problems with error handling inside pre middleware in mongoose
userSchema.pre('save', function(next) {
    var doc = this;
    bcrypt.hash(doc.password, 12, function(error, hash) {
        if (error) {
            reject({
                myType: 'bcryptHashError',
                message: ''
            })
        } else {
            resolve(hash);
        }
    });
});
*/


userSchema.methods.comaparePassword = function(tryPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(tryPassword, this.password, function(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result)
      }
    })
  })
}



const User = mongoose.model('User', userSchema);

module.exports = User;
