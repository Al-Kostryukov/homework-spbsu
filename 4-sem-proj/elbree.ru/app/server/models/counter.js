const
  path = require('path');

const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js')),
  mongoose = common_lib.packages.require('mongoose');




const countersSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true
    },
    seq: {
      type: Number,
      default: 0
    }
});

const Counter = mongoose.model('Counter', countersSchema);

module.exports = Counter;