Vue.component('form-error', {
  template: '<div v-show="message.length" v-html="message" class="q-add-error"></div>',
  data: function() {
    return {
      message: ''
    }
  },
  methods: {
    setMessage: function(message) {
      this.message = message;
      $(this.$el)
        .fadeIn(250)
        .fadeOut(250)
        .fadeIn(250)
        .fadeOut(250)
        .fadeIn(150);
    },
    hide: function() {
      this.message = '';
    }
  }
})



var form = new Vue({
  el: '#form-q-add',
  data: {
    text: '',
    points: 10
  },
  mounted: function() {
    this.preloader = new Preloader({
      appendTo: this.$el,
      size: 39,
      hide: true,
    });

    var _this = this;
    setTimeout(function() {
      _this.$refs.text.focus();
    }, 200)

    new Powerange(this.$refs.range, {
      klass: 'q-add-p-range',
      start: 10,
      min: 0,
      max: parseInt($(this.$refs.range).attr('max-points'))
    });
  },
  methods: {
    preloaderButtonToggle: function(b) {
      var _this = this;
      if (b) {
        $(this.$refs.submitButton).fadeOut(100, function() {
          _this.preloader.instance.fadeIn(100);
        })
      } else {
        this.preloader.instance.fadeOut(100, function() {
          $(_this.$refs.submitButton).fadeIn(100);
        })
      }
    },
    onSubmit: function() {
      var _this = this;

      if (this.text.length && !this.alreadySent) {
        this.alreadySent = true;

        this.preloaderButtonToggle(true);

        $.post('/qs/add', {
          text: this.text,
          points: this.points,
        })
        .done(function(res) {
          if (res.status) {
            _this.alreadySent = false;
            window.location = res.data.location;
          } else {
            setTimeout(function() {
              _this.alreadySent = false;
              _this.preloaderButtonToggle(false);
              _this.$refs.formError.setMessage(res.data);
            }, 250)
          }
        })
        .fail(function() {
          setTimeout(function() {
            _this.alreadySent = false;
            _this.preloaderButtonToggle(false);
            _this.$refs.formError.message = "Что-то пошло не так... Возможно, стоит попробовать позже."
          }, 250)
        })
      }
    }
  }
})
