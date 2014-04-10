/* ========================================================================
 * Bootstrap: scrollspy.js v3.1.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function tScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)
	this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, tScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null
	
    this.refresh()
    this.process()
  }

  tScrollSpy.DEFAULTS = {
    offset: 10
  }

  

  tScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $temp = $.map(
    	self.options.args.arr, function (a) {
        //var $el   = $(a)
        var href  = a[self.options.args.field];
        var $href = /^#./.test(href) && $(href)
        return ($href
          && $href.length
          && $href.is(':visible')
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href, a ]]) || null
      }
    ).sort(function (a, b) { return a[0] - b[0] })
    
    var $targets = [];
    for(var i = 0; i < $temp.length; i = i + 1){
    	var v = $temp[i];
        self.offsets.push(v[0])
        self.targets.push(v[2])
    }
  }

  tScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  tScrollSpy.prototype.activate = function (target) {
	//alert(target)
	var isDirty = false;
	if( !this.activeTarget ){
		this.activeTarget = target;
		isDirty = true;
	}
	else if( this.activeTarget != target){
		this.activeTarget = target;
		isDirty = true;
	}
	else{
	
	}
	if( isDirty && this.options.callback ){
		this.options.callback(target);
	}
	if( isDirty ){
		console.log(this.activeTarget.href)
	}
    //active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.tscrollspy

  $.fn.tscrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new tScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tscrollspy.Constructor = tScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.tscrollspy.noConflict = function () {
    $.fn.tscrollspy = old
    return this
  }


/*
  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })
*/
}(jQuery);