const
  path = require('path');

//libs/configs
const
  common_lib = require(path.join(DIRS.lib, 'common_lib.js'));

//vendor
  const
  pug = common_lib.packages.require('pug'),
  Hashids = common_lib.packages.require('hashids');

//models
const
  User = require(path.join(DIRS.models, 'user.js')),
  Question = require(path.join(DIRS.models, 'question.js')),
  Hashtag = require(path.join(DIRS.models, 'hashtag.js'));


const hashid = new Hashids('hash-salt');


class Answer {
  constructor(opts) {
    this.text = opts.text;
    this.author = opts.author;
    this.timeAdded = new Date();
  }
}


QsController = {
  qs: {
    get: function(req, res) {
      let hashtagRegex = /#(\[[^\]]+\]|[^\r\n\t\f #]+)/g;
      Question.find().populate('author', 'nickname').sort({_id: -1})
      .then((qs_) => {
        qs = qs_.map(function(q) {
          q._idEncoded = hashid.encode(q._id);
          q.pointsGive = Math.ceil(q.pointsLeft/2);
          q.textReplaced = q.text.replace(hashtagRegex, "<span class='q-hashtag' href='/qs/hashtags/$1'>#$1</span>");
          return q
        })

        return Hashtag.find().sort({mentionsCount: -1}).limit(13)
        .then((hashtags) => {
          res.render('qs/qs.pug', {
            qs,
            hashtags
          });
        })
      })
    }
  },
  qOne: {
    get: function(req, res) {
      let qId = hashid.decode(req.params.id)[0];
      Question.findOne({_id: qId}).populate('author answers.author', 'nickname')
      .then((q) => {
        let answeredAlready = false

        if (req.isSignedIn) {
          for (answer of q.answers) {
            if (answer.author._id == req.user._id) {
              answeredAlready = true;
            }
          }
        }

        let hashtagRegex = /#(\[[^\]]+\]|[^\r\n\t\f #]+)/g;
        q.textReplaced = q.text.replace(hashtagRegex, "<a class='q-hashtag' href='/qs/hashtags/$1'>#$1</a>");

        q.pointsGive = Math.ceil(q.pointsLeft/2);
        res.render('qs/q-one.pug', {
          q,
          idEncoded: req.params.id,
          answeredAlready
        });
      })
    },
    addAnswer: function(req, res) {
      let qId = hashid.decode(req.params.id)[0];
      let answer = new Answer({
        text: req.body.text,
        author: req.user._id
      });

      Question.findByIdAndUpdate(
        qId,
        {$push: {answers: answer}}
        )
      .then(() => {
        res.json({status: true, data: "<h3>"+req.user.nickname+": "+answer.text+"</h3>"})
      })
      .catch(() => {
        res.json({status: false, data: "Что-то пошло не так... Возможно, стоит попробовать позже."})
      })
    }
  },
  hashtags: {
    get: function(req, res) {
      let hashtagRegex = /#(\[[^\]]+\]|[^\r\n\t\f #]+)/g;
      Hashtag.findOne({hashtag: req.params.hashtag.toLowerCase()}, '_id')
      .then((doc) => {
        Question.find({hashtagsIds: doc._id}).populate('author', 'nickname').sort({_id: -1})
        .then((qs_) => {
          qs = qs_.map(function(q) {
            q._idEncoded = hashid.encode(q._id);
            q.pointsGive = Math.ceil(q.pointsLeft/2);
            q.textReplaced = q.text.replace(hashtagRegex, "<span class='q-hashtag' href='/qs/hashtags/$1'>#$1</span>");
            return q
          })

          res.render('qs/hashtag-search.pug', {
            qs,
            hashtag: req.params.hashtag
          });

        })
      })
    }
  },
  add: {
    post: function(req, res) {
      const
      text = req.body.text,
      points = req.body.points;

      //hashtags
      let hashtagRegex = /#(\[[^\]]+\]|[^\r\n\t\f #]+)/g,
      hashtags = text.match(hashtagRegex);
      _hashtags = []
      if (hashtags === null) {
        hashtags = [];
      } else {
        _hashtags = hashtags.map(function(hashtag) {
          return hashtag.toLowerCase().substring(1);
        })
      }


      if (req.user.points < points) {
        res.json({status: false, data: "Недостаточно баллов..."});
      } else {
        req.user.points -= points;
        User
        .findByIdAndUpdate(req.user._id, {$set: { points: req.user.points }}).exec()
        .then(() => {
          return Hashtag.find({
            hashtag: {$in: _hashtags}
          }, 'hashtag');
        })
        .then((hashtagsExistWithIds) => {
          let hashtagsExist = hashtagsExistWithIds.map(function(o) {
            return o.hashtag;
          })

          let hashtagsExistIds = hashtagsExistWithIds.map(function(o) {
            return o._id;
          })

          return Hashtag.update({
            _id: {$in: hashtagsExistIds}
          }, {
            $inc: {mentionsCount: 1}
          }, {
            multi: true
          })
          .then(() => {
            let hashtagsNotExist = _hashtags.filter(function(i) {
              return hashtagsExist.indexOf(i) < 0;
            });

            let promisify = function(hashtag) {
              let h = new Hashtag({
                hashtag: hashtag
              });

              return h.save();
            }

            let promises = hashtagsNotExist.map(promisify);

            return Promise.all(promises)
            .then((hashtagsAdded) => {

              let hashtagsNotExistIds = hashtagsAdded.map(function(o) {
                return o._id;
              })

              hashtagsIds = hashtagsExistIds.concat(hashtagsNotExistIds);

              const q = new Question({
                text,
                points,
                pointsLeft: points,
                author: req.user._id,
                hashtagsIds
              })

              return q.save();
            })
          })
        })
        .then((q) => {
          res.json({
            status: true,
            data: {
              location: "/qs/" + hashid.encode(q._id)
            }
          });
        })
        .catch(() => {
          res.json({status: false, data: "Что-то пошло не так... Возможно, стоит попробовать позже."});
        })
      }
    }
  }
}


module.exports = QsController;
