Array.prototype.last = function() {
	return this[this.length - 1];
}

String.prototype.trim = function() {
	return $.trim(this);
}

Array.prototype.each = function(fn) {
	$.each(this, fn);
}


var Preloader = function(opts) {
	var defaultOpts = {
		color: '#fff',
		size: 50,
		color: 'blue',
		appendTo: null,
		clearParent: false,
		saveWidth: false,
		saveHeight: false,
		hide: false,
		styles: {}
	};

	var opts = this.opts = $.extend(true, defaultOpts, opts);

	if (opts.size < 55) {
		opts.width = 70;
	} else if (opts.size < 101) {
		opts.width = 120;
	} else {
		opts.width = 200;
	}

	opts.template = '<img class="preloader-img"\
										src="/public/img/loading-gifs/'+opts.width+'_'+opts.width+'_'+opts.color+'.gif">';


	this.instance = $(this.opts.template);
	this.instance.css({width: opts.size, height: opts.size});
	this.instance.css(opts.styles);

	this.opts.appendTo = $(this.opts.appendTo);

	if (this.opts.saveWidth) {
		this.opts.appendTo.width(this.opts.appendTo.width())
	}

	if (this.opts.saveHeight) {
		this.opts.appendTo.height(this.opts.appendTo.height())
	}

	if (this.opts.hide) {
		this.instance.hide()
	}

	if (this.opts.clearParent) {
		this.opts.appendTo.empty();
	}

	if (this.opts.appendTo) {
		this.instance.appendTo(this.opts.appendTo);
	}


}

/*
Preloader.prototype = {
	hide: function() {
		this.instance.fadeOut();
	},
	show: function() {
		this.instance.fadeIn();
	}
}*/
