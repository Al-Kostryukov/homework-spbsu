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



const questionSchema = new mongoose.Schema({
  _id: Number,
  text: String,
  author: {
    type: Number,
    ref: 'User'
  },
  hashtagsIds: [Number],
  timeAdded: {
    type: Date,
    default: Date.now
  },
  answers: [{
    author: {
      type: Number,
      ref: 'User'
    },
    timeAdded: Date,
    text: String
  }],
  points: Number,
  pointsLeft: Number
});


questionSchema.pre('save', function(next) {
    var doc = this;
    Counter.findByIdAndUpdate({_id: 'questionId'}, {$inc: { seq: 1} }, function(error, counter) {
        if (error) {
          return next(error);
        }

        doc._id = counter.seq;
        next();
    });
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
