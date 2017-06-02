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
  el: '#form-q-add-answer',
  data: {
    text: '',
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

        $.post('/qs/' + window.qId + '/add-answer', {
          text: this.text,
        })
        .done(function(res) {
          if (res.status) {
            _this.alreadySent = false;
            _this.$refs.formError.message = "";
            $(_this.$el).hide();
            $(_this.$el).after(res.data);
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
