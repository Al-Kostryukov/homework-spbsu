const
  path = require('path');

const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
  mongoose = common_lib.packages.require('mongoose');




const restorePasswordSchema = new mongoose.Schema({
    _id: Number,
    code: String, 
    time: {
      type: Date,
      default: Date.now
    }
});

const RestorePassword = mongoose.model('restore-password', restorePasswordSchema);

module.exports = RestorePassword;