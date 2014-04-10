tc = {}

var NewSlideOption = function(name){
	this.name = name;
	this.setNewSlideName = function(){
		tc.UIManager.AddNewSlide(this.name);
	}
}


tc.codeOptions = function(n,d){
	this.name = n,
	this.data = d
}


tc.vm = {
	newSlideOptions : ko.observableArray([
		new NewSlideOption("Text Slide"),
		new NewSlideOption("Code Slide"),
		new NewSlideOption("Image Slide"),
		new NewSlideOption("Result Slide")
	]),
	
	slides :  ko.observableArray(),
	currentSlide : ko.observable(),
	
	showTemplate : function(s){
		if( this.currentSlide() ){
			var t = this.currentSlide().data.TYPE
			arr = new String(s).split("|");
			for(var i = 0; i < arr.length; i++){
				if (arr[i] == t )
					return  true;
			}
		}
		return false
	},
	
	watch : ko.observable(),
	showWatchTemplate : function(s){
		if ( tc.vm.watch() ){
			return "codeWatch";
		}
		else{
			return "howToCodewatch";
		}
	},
	
	watchImage : ko.observable(),
	showImageWatchTemplate : function(){
		if ( tc.vm.watchImage() ){
			return "imageWatch";
		}
		else{
			return "howToImagewatch";
		}
	},
	
	codeSlides : function(){
		ret = ko.observableArray();
		ko.utils.arrayForEach(this.slides(), function(s) {
			if( s.data.TYPE == "CODE" ){
				if ( s == tc.vm.currentSlide())
				{
				
				}
				else{
					t = new tc.codeOptions(s.data.name(),s.data)
					ret.push(t)
				}
			}
		});
		
		return ret
	},
	
	codeSlideForTemplate : ko.observable(),
	
	imageSlides : function(){
		ret = ko.observableArray();
		ko.utils.arrayForEach(this.slides(), function(s) {
			if( s.data.TYPE == "IMAGE" ){
				if ( s == tc.vm.currentSlide())
				{
				
				}
				else{
					t = new tc.codeOptions(s.data.name(),s.data)
					ret.push(t)
				}
			}
		});
		
		return ret
	},
	
	imageSlideForTemplate : ko.observable(),
};

tc.vm.codeSlideForTemplate.subscribe(function(newValue) {
    if(newValue){
		tc.vm.currentSlide().setText( newValue.data.text);
	}
	
});

tc.vm.imageSlideForTemplate.subscribe(function(newValue) {
    if(newValue){
		tc.vm.currentSlide().data.src( newValue.data.src());
	}
	
});


