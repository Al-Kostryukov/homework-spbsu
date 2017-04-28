const
  path = require('path');

const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
  mongoose = common_lib.packages.require('mongoose');


const
  Counter = require(path.join(DIRS.models, 'counter.js'));




const userSchema = new mongoose.Schema({
  _id: Number,
  nickname: String,
  email: String,
  password: String,
  emailVerified: Boolean
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


const User = mongoose.model('User', userSchema);

module.exports = User;