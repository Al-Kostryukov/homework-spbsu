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
		template: '<div class="spinner">\
  					<div class="bounce1"></div>\
  					<div class="bounce2"></div>\
  					<div class="bounce3"></div>\
				   </div>',
		appendTo: null,
		childrenHeight: 15,
		childrenWidth: 15,
		clearParent: false,
		saveWidth: false,
		saveHeight: false,
		hide: false

	};

	this.opts = $.extend(true, defaultOpts, opts);
	
	this.instance = $(this.opts.template);
	this.instance.children('div').css({
		backgroundColor: this.opts.color,
		height: this.opts.childrenHeight,
		width: this.opts.childrenWidth,
	})

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