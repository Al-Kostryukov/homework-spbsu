const
  path = require('path');

const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
  mongoose = common_lib.packages.require('mongoose');




const emailVerificationSchema = new mongoose.Schema({
    _id: Number,
    code: String, 
    time: {
      type: Date,
      default: Date.now
    }
});

const EmailVerification = mongoose.model('email-verification', emailVerificationSchema);

module.exports = EmailVerification;