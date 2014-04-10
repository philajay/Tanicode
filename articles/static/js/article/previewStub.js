tcp.Slide.prototype.lazyLoad = function(o){
	if( this['loaded']){
		return
	}
	this['loaded'] = true
	$.ajax({
		  type: "POST",
		  url: "GetSlide",
		  data: {data: this.uid},
		  success: function(result){
					
		  },
		});
}