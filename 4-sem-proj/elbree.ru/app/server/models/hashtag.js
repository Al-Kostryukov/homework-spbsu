const
  path = require('path');

//libs/configs
const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

//vendor
const
  mongoose = common_lib.packages.require('mongoose');

//models
const
  Counter = require(path.join(DIRS.models, 'counter.js'));



const hashtagSchema = new mongoose.Schema({
  _id: Number,
  beautyForm: {
    type: String,
    default: ''
  },
  hashtag: String,
  mentionsCount: {
    type: Number,
    default: 1
  }
});


hashtagSchema.pre('save', function(next) {
    var doc = this;
    Counter.findByIdAndUpdate({_id: 'hashtagId'}, {$inc: { seq: 1} }, function(error, counter) {
        if (error) {
          return next(error);
        }

        doc._id = counter.seq;
        next();
    });
});



const Hashtag = mongoose.model('Hashtag', hashtagSchema);

module.exports = Hashtag;
