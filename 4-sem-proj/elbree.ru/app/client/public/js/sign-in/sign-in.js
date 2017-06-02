Vue.component('form-error', {
  template: '<div v-show="message.length" v-html="message" class="form-error"></div>',
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
  el: '#form',
  data: {
    email: '',
    password: '',
    alreadySent: false,
    preloader: null
  },
  mounted: function() {
    this.preloader = new Preloader({
      appendTo: this.$el,
      size: 35,
      hide: true,
      styles: {
        margin: '14px'
      }
    });

    var _this = this;
    setTimeout(function() {
      _this.$refs.email.focus();
    }, 300)
  },
  methods: {
    preloaderButtonToggle: function(b) {
      var _this = this;
      if (b) {
        $(this.$refs.buttonsContainer).fadeOut(100, function() {
          _this.preloader.instance.fadeIn(100);
        })
      } else {
        this.preloader.instance.fadeOut(100, function() {
          $(_this.$refs.buttonsContainer).fadeIn(100);
        })
      }
    },
    onSubmit: function() {
      var _this = this;

      if (this.email.length && this.password.length && !this.alreadySent) {
        this.alreadySent = true;

        this.preloaderButtonToggle(true);

        $.post('/sign-in', {
          email: this.email,
          password: this.password,
        })
        .done(function(res) {
          if (res.status) {
            _this.alreadySent = false;
            window.location = "/qs";
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

      return false;
    }
  }
})
