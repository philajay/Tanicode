tc.offset = null;
tc.tcEditor = {
	
	init : function(){
		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/html");
		//editor.setReadOnly(true);
		this.aceEditor = editor;
		/*
		var editor1 = ace.edit("overlay_editor");
		editor1.setTheme("ace/theme/monokai");
		editor1.getSession().setMode("ace/mode/html");
		editor1.setReadOnly(true);
		this.aceOverlayEditor = editor1;
		*/
	},
	
	setValue : function(s){
		this.aceEditor.setValue(s);
	},
	
	getValue : function(){
		return this.aceEditor.getValue();
	},
	
	resetLang : function(s){

	},
}


tc.Slide = function(data){
	this.data = data;
	tc.vm.slides.push(this);
	this.index = 0
	
	this.syncUI = function(){
		tc.vm.currentSlide( this )
		tc.UIManager.imageWatchDiv.hide();
		if(this.data.TYPE != "IMAGE")
			{
				//tc.tcEditor.resetLang(this.data.TYPE);
				tc.tcEditor.setValue(this.data.text)
				
				if(this.data.TYPE == "CODE"){
					if ( this.data.watches.length > 0){ 
						w = this.data.watches[this.index];
						this.showCodeWatch(w)
					}
				}
			}
		else{
				tc.offset = $('#board').offset();
				if ( this.data.watches.length > 0){
					w = this.data.watches[this.index];
					this.showImageWatch(w)
				}
		}
	};
	
	this.showCodeWatch = function(w){
		n = w.lineNumber + 1
		tc.tcEditor.aceEditor.gotoLine(n)
		tc.tcEditor.aceEditor.scrollToLine(n - 1, true);
		tc.vm.watch(w)
	};
	
	this.showImageWatch = function(w){
		
		xoffset = parseInt(w.rect.x.replace('px', ''), 10)
		xoffset = xoffset + tc.offset.left
		x = xoffset + 'px'
		yoffset = parseInt(w.rect.y.replace('px', ''), 10)
		yoffset = yoffset + tc.offset.top
		y = yoffset + 'px'
		
		tc.UIManager.imageWatchDiv.css({
			"left": x,
			"top": y,
			"width": w.rect.width,
			"height": w.rect.height,
		});	
		tc.UIManager.imageWatchDiv.show();
		tc.vm.watchImage(w);
	};

	this.next = function(){
		if(this.data.TYPE == "TEXT"){
			return null;
		}
		temp = this.index + 1
		if(temp >= this.data.watches.length)
			return null;
		this.index++
		w = this.data.watches[this.index];
		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}
		
		return {}
	}
	
	this.previous = function(){
		if(this.data.TYPE == "TEXT"){
			return null;
		}
		temp = this.index - 1
		if(temp < 0 )
			return null;
		this.index--
		w = this.data.watches[this.index];
		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}
		return {}
	}
	
	this.show = function(){
		
	};
	
	this.syncData = function(){
	};

	this.hide = function(){
		if(this.data.TYPE == "CODE"){
			tc.vm.watch(null)
		}
		if(this.data.TYPE == "IMAGE"){
			tc.vm.watchImage(null)
		}

	};
	
	this.changeSlide = function(){
		tc.UIManager.changeTextSlide(this)
	};
	
}

tc.UIManager = {
	currentSlide : null,
	that : this,
	index : 0,
	imageWatchDiv : null,
	init : function(t){
		//this.bindTemplateVisible();
		elem = document.createElement('div');
		this.imageWatchDiv = $(elem)
		this.imageWatchDiv = $(elem).css({border:'1px solid black'});
		this.imageWatchDiv.css({
				"z-index": 100002,
				"position": "absolute",
				"left": 0,
				"top": 0,
				"width": 0,
				"height": 0,
			  "opacity" : .5,
			});	
		this.imageWatchDiv.css({ border: '1px solid red', background: 'orange', padding: '0.5em' })
		document.body.appendChild(elem);
		this.imageWatchDiv.hide();
		tc.tcEditor.init();
		this.changeTextSlide(t);
	},
	changeTextSlide : function(t){
		this.currentSlide = t;
		this.currentSlide.syncUI();
		this.currentSlide.show();
	},
	
	next : function(){
		o = this.currentSlide.next();
		if ( o ) {
			return
		}
		temp = this.index + 1
		if( temp >= tc.vm.slides().length ){
			return
		}
		this.index++;
		tc.UIManager.changeTextSlide(tc.vm.slides()[this.index])
	},
	
	previous : function(){
		o = this.currentSlide.previous();
		if ( o ) {
			return
		}
		temp = this.index - 1
		if( temp < 0  ){
			return
		}
		this.index--;
		tc.UIManager.changeTextSlide(tc.vm.slides()[this.index])
	},}

$( document ).ready(function(){
	MAX_PARTIAL_LENGTH = 30;
	rawData = $.parseJSON(window.slidesJSON);
	for(var i = 0; i <rawData.length; i++){
		o = rawData[i].data;
		slide = new tc.Slide(o);
	}
	tc.OverlayInit.init();
	tc.UIManager.init(tc.vm.slides()[0])
	ko.applyBindings(tc.vm);
	$('#scrollbar1').tinyscrollbar();
	$('#overlay').show();
});

tc.OverlayInit = {
	init : function(){
		h = $( window ).height();
		h = h - 46 - 46 - 10;
		h = h + 'px'
		$('#editor').css('height', h);
		$('#overlay_watch').css('height', h);
	}
	
}

