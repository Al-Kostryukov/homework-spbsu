  // register
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

var tooltipsOptions = {
  error: {
    animation: 'grow',
    theme: 'tooltipster-punk',
    side: 'left',
    contentAsHTML: true,
    trigger: 'custom',
    trackOrigin: true,
    trackerInterval: 200
  },
  help: {
    multiple: true,
    animation: 'grow',
    theme: 'tooltipster-light',
    trigger: 'custom',
    side: 'right',
    contentAsHTML: true,
    trackOrigin: true,
    trackerInterval: 200
  },
  green: {
    multiple: true,
    animation: 'grow',
    theme: ['tooltipster-light', 'tooltipster-green'],
    trigger: 'custom',
    side: 'right',
    contentAsHTML: true,
    trackOrigin: true,
    trackerInterval: 200
  }
}

Vue.component('nickname-input', {
  template: "<input v-model=nickname type='text' @focus=onFocus @blur=onBlur :placeholder=placeholder :title=title>",
  data: function() {
    return {
      helpTooltipHTML: 'Длина от 2 до 40 символов. <br><br> Например, <b>nicolas</b> или <br><b>photo-master</b>',
      title: 'Длина от 2 до 40 символов. Например, nicolas или photo-master',
      placeholder: 'Придумай никнейм',
      nickname: ''
    }
  },
  methods: {
    initTooltips: function() {
      $(this.$el).tooltipster(tooltipsOptions.error)
      $(this.$el).tooltipster(tooltipsOptions.help);
      $(this.$el).tooltipster(tooltipsOptions.green);

      var instances = $.tooltipster.instances(this.$el);
      this.tooltips = {
        error: instances[0],
        help: instances[1],
        green: instances[2]
      }
    },
    onFocus: function() {
      this.tooltips.error.hide();
      this.tooltips.green.hide();
      this.tooltips.help.content(this.helpTooltipHTML).open();
    },
    onBlur: function() {
      this.tooltips.help.hide();

      var isValid = this.isValid(this.nickname);
      if (!isValid[0]) {
        this.tooltips.error.content(isValid[1]).open();
        return;
      }

      if (this.doesExistAlready(this.nickname)) {
        var text = "Пользователь с таким никнеймом<br>уже зарегистрирован. <br> Придумай другой никнейм.";
        this.tooltips.error.content(text).open();
      } else {
        var text = "Отличный никнейм!";
        this.tooltips.green.content(text).open();
      }
    },
    isValid: function(val) {
      if (/^\s+|\s+$/.test(val)) {
        return [false, "Не используй пробелы в начале<br>или в конце строки!"];
      } else if (val.length == 0) {
        return [false, "Придумай никнейм!"];
      } else if (val.length < 2) {
        return [false, "Длина никнейма<br>должна быть от 2 символов!"];
      } else if (val.length > 40) {
        return [false, "Длина никнейма<br>должна быть до 40 символов!"];
      } else {
        return [true, null];
      }
    },
    doesExistAlready: function() {
      return false;
    },
    readyToSubmit: function() {
      this.tooltips.help.hide();

      var isValid = this.isValid(this.nickname);
      if (!isValid[0]) {
        this.tooltips.error.content(isValid[1]).open();
        return false;
      }

      return true;
    },
    get: function() {
      return [this.readyToSubmit(), this.nickname]
    },
    hideAllTooltips: function() {
      this.tooltips.error.hide();
      this.tooltips.green.hide();
      this.tooltips.help.hide();
    }
  },
  mounted: function() {
    this.initTooltips();
  },
})


Vue.component('email-input', {
  template: "<input v-model=email type='text' @focus=onFocus @blur=onBlur :placeholder=placeholder :title=title>",
  data: function() {
    return {
      helpTooltipHTML: 'Например, <b>petr@yandex.ru</b>',
      title: 'Например, petr@yandex.ru',
      placeholder: 'Введи свой email',
      email: '',
    }
  },
  methods: {
    initTooltips: function() {
      $(this.$el).tooltipster(tooltipsOptions.error)
      $(this.$el).tooltipster(tooltipsOptions.help);
      $(this.$el).tooltipster(tooltipsOptions.green);

      var instances = $.tooltipster.instances(this.$el);
      this.tooltips = {
        error: instances[0],
        help: instances[1],
        green: instances[2]
      }
    },
    onFocus: function() {
      this.tooltips.error.hide();
      this.tooltips.green.hide();
      this.tooltips.help.content(this.helpTooltipHTML).open();
    },
    onBlur: function() {
      this.tooltips.help.hide();

      var isValid = this.isValid(this.email);
      if (!isValid[0]) {
        this.tooltips.error.content(isValid[1]).open();
        return;
      }

      if (this.doesExistAlready(this.email)) {
        var text = "Пользователь с таким email уже зарегистрирован!";
        this.tooltips.error.content(text).open();
      } else {
        var text = "ОК!";
        this.tooltips.green.content(text).open();
      }
    },
    isValid: function(val) {
      var re = /\S+@\S+\.\S+/;

      if (/^\s+|\s+$/.test(val)) {
        return [false, "Без пробелов в начале и в конце строки!"];
      } else if (val.length == 0 || !re.test(val)) {
        return [false, "Нужно ввести свой email!"];
      } else {
        return [true, null];
      }
    },
    doesExistAlready: function() {
      return false
    },
    readyToSubmit: function() {
      this.tooltips.help.hide();

      var isValid = this.isValid(this.email);
      if (!isValid[0]) {
        this.tooltips.error.content(isValid[1]).open();
        return false;
      }

      return true;
    },
    get: function() {
      return [this.readyToSubmit(), this.email]
    },
    hideAllTooltips: function() {
      this.tooltips.error.hide();
      this.tooltips.green.hide();
      this.tooltips.help.hide();
    }
  },
  mounted: function() {
    this.initTooltips();
  },
})

Vue.component('password-input', {
  template: "<div>\
              <input v-model=password type='password' @focus=onFocus @blur=onBlur :placeholder=placeholder :title=title ref=password>\
              <i @mousedown=showPassword :class='{ \"password-showed\": isShowed }' class='fa fa-eye password-eye' aria-hidden='true' ref=eye></i>\
            </div>",
  data: function() {
    return {
      helpTooltipHTML: 'Длина пароля должна быть <br> <b>от 10 до 30 символов</b>. <br><br> Разрешены буквы латинского алфавита <br> <b>A-Z, a-z</b>, цифры <b>0-9</b>, <br> символы <b>{, }, [, ], $, -, ^</b>',
      title: 'Длина пароля должна быть от 10 до 30 символов. Разрешены буквы латинского алфавита A-Z, a-z, цифры 0-9,символы {, }, [, ], $, -, ^',
      placeholder: 'Придумай пароль',
      isShowed: false,
      password: ''
    }
  },
  methods: {
    showPassword: function(event) {
      this.isShowed = !this.isShowed;
      this.$refs.password.setAttribute('type', this.isShowed ? 'text' : 'password');
      event.preventDefault();
    },
    initTooltips: function() {
      var el = this.$refs.password;

      $(el).tooltipster(tooltipsOptions.error)
      $(el).tooltipster(tooltipsOptions.help);
      $(el).tooltipster(tooltipsOptions.green);

      var instances = $.tooltipster.instances(el);
      this.tooltips = {
        error: instances[0],
        help: instances[1],
        green: instances[2]
      }
    },
    onFocus: function() {
      this.tooltips.error.hide();
      this.tooltips.green.hide();
      this.tooltips.help.content(this.helpTooltipHTML).open();
    },
    onBlur: function() {
      this.tooltips.help.hide();

      var isValid = this.isValid(this.password);
      if (!isValid[0]) {
        this.tooltips.error.content(isValid[1]).open();
      } else {
        var text = "Хороший пароль!";
        this.tooltips.green.content(text).open();
      }
    },
    isValid: function(val) {
      var re = /^[A-Za-z0-9\{\}\[\]\$\-\^]+$/;

      if (val.length == 0) {
        return [false, "Нужно придумать пароль!"];
      } else if (val.length < 10 || val.length > 30) {
        return [false, "Пароль должен иметь длину<br><b>от 10 до 30 символов</b>!"];
      } else if (!re.test(val)) {
        return [false, "Разрешены буквы латинского алфавита<br> <b>A-Z</b>, <b>a-z</b>, цифры <b>0-9</b>, символы <b>{</b>, <b>}</b>, <b>[</b>, <b>]</b>, <b>$</b>, <b>-</b>, <b>^</b>!"];
      } else {
        return [true, null];
      }
    },
    readyToSubmit: function() {
      this.tooltips.help.hide();

      var isValid = this.isValid(this.password);
      if (!isValid[0]) {
        this.tooltips.error.content(isValid[1]).open();
        return false;
      }

      return true;
    },
    get: function() {
      return [this.readyToSubmit(), this.password]
    },
    hideAllTooltips: function() {
      this.tooltips.error.hide();
      this.tooltips.green.hide();
      this.tooltips.help.hide();
    }
  },
  mounted: function() {
    this.initTooltips();
  },
})




var form = new Vue({
  el: '#form',
  data: {
    alreadySent: false,
    preloader: null
  },
  mounted: function() {
    this.preloader = new Preloader({
      appendTo: this.$el,
      size: 30,
      hide: true
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
      var nickname = this.$refs.nickname.get(),
          email = this.$refs.email.get(),
          password = this.$refs.password.get(),
          _this = this;

      if (nickname[0] && email[0] && password[0] && !this.alreadySent) {
        this.alreadySent = true;

        this.preloaderButtonToggle(true);

        $.post('/sign-up', {
          nickname: nickname[1],
          email: email[1],
          password: password[1],
        })
        .done(function(res) {
          if (res.status) {
            _this.alreadySent = false; //unnecesary
            _this.timeToVerify(res.data);
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

    },
    timeToVerify: function(data) {
      this.$refs.nickname.hideAllTooltips();
      this.$refs.email.hideAllTooltips();
      this.$refs.password.hideAllTooltips();

      $(this.$el).fadeOut(350, function() {
        verifyingBlock.go(data);
      });
    }
  }
})


var verifyingBlock = new Vue({
  el: '#verifying-block',
  data: {
    html: ''
  },
  methods: {
    go: function(data) {
      this.html = data.verifyingBlockHtml;
    }
  }
})
