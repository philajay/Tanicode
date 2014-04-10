tc.board = {
	offset : null,

	box : null,
	initialized : false,
	init : function(){
		if(this.initialized )
			return
		
		this.initialized = true;
		
		this.offset = $('#board').offset();
		
		$('#board').drag('start',function(e,d) {
			event = e
			opos = [event.pageX, event.pageY];
			
			elem = document.createElement('div');
			
			tc.board.box = $(elem).css({border:'1px solid black'});
				
				
			tc.board.box.css({
				"z-index": 100,
				"position": "absolute",
				"left": event.clientX,
				"top": event.clientY,
				"width": 0,
				"height": 0,
			  "opacity" : .5,
			});	
			
			document.body.appendChild(elem);
		})

		$('#board').drag('drag',function(e,d) {
			event = e
			var x1 = opos[0], y1 = opos[1], x2 = event.pageX, y2 = event.pageY;
				if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
				if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
				tc.board.box.css({left: x1, top: y1, width: x2-x1, height: y2-y1});
		})


		$('#board').drag('end',function(e,d) {
			tc.board.offset = $('#board').offset();
			tc.board.box.css({ border: '1px solid white', background: 'orange', padding: '0.5em' })
			tc.UIManager.currentSlide.data.addWatch(tc.board.box);
		})
	}
}




tc.tcEditor = {
	
	init : function(){
		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/html");
		this.aceEditor = editor;
		this.aceEditor.on("guttermousedown",this.setWatch);
		this.aceEditor.on("change",this.documentChanged);
	},
	
	resetWatches : function(arr){
		tc.tcEditor.aceEditor.session.setBreakpoints(arr);
	},
	
	documentChanged : function(event){
		
		if(tc.UIManager.currentSlide.data.TYPE != 'CODE'){
			return;
		}
		
		editor = tc.tcEditor.aceEditor;
		var delta = event.data;
		var range = delta.range;
		var len, firstRow, f1;

		if (delta.action == "insertText") {
			len = range.end.row - range.start.row;
			firstRow = range.start.column == 0? range.start.row: range.start.row + 1;
		} else if (delta.action == "insertLines") {
			len = range.end.row - range.start.row;
			firstRow = range.start.row;
		} else if (delta.action == "removeText") {
			len = range.start.row - range.end.row;
			firstRow = range.start.row;
		} else if (delta.action == "removeLines") {
			len = range.start.row - range.end.row;
			firstRow = range.start.row;
		}
		
		var breakpoints = editor.session.getBreakpoints();
		var newBreakpoints = [];
		
		var changed = false;
		if (len > 0) {
			for( var index in breakpoints ) {
				var idx = parseInt(index);
				var n = idx;
				if( idx < firstRow ) {
					newBreakpoints.push(idx);
				}
				else {
					changed = true;
					newBreakpoints.push(idx+len);
					tc.UIManager.currentSlide.data.resetWatch({old:idx, new:idx+len});
				}
			}
		} else if (len < 0) {
			for( var index in breakpoints ) {
				var idx = parseInt(index);
				n = idx;
				if( idx < firstRow ) {
					newBreakpoints.push(idx);
				}
				else if( (index < firstRow-len) && !newBreakpoints[firstRow]) {
					newBreakpoints.push(firstRow);
					n = firstRow
					changed = true;
				}
				else {
					newBreakpoints.push(len+idx);
					n = len+idx
					changed = true;
				}
				
				tc.UIManager.currentSlide.data.resetWatch({old:idx, new:n});
			}
		}
		
		if( changed ) editor.session.setBreakpoints(newBreakpoints);
	},
	
	setWatch : function(e){
		if(tc.UIManager.currentSlide.data.TYPE != 'CODE'){
			return;
		}

		editor = tc.tcEditor.aceEditor;
		var target = e.domEvent.target; 
		if (target.className.indexOf("ace_gutter-cell") == -1) 
			return; 
		if (!editor.isFocused()) 
			return; 
		if (e.clientX > 25 + target.getBoundingClientRect().left) 
			return; 

		var row = e.getDocumentPosition().row 
		e.editor.session.setBreakpoint(row);
		tc.UIManager.currentSlide.data.addWatch(row);
		e.stop() 
	},
	
	redraw : function(){
		this.aceEditor.resize() 
		this.aceEditor.renderer.updateFull() 
	},
	
	setValue : function(s){
		this.aceEditor.setValue(s);
	},
	
	getValue : function(){
		return this.aceEditor.getValue();
	},
	
	resetLang : function(s){
		/*if( s == "TEXT" ){
			this.aceEditor.getSession().setMode("ace/mode/html");
		}
		else if( s== "CODE" ){
			this.aceEditor.getSession().setMode("ace/mode/javascript");
		}*/
	},
	
	clearAllWatches : function(){
		tc.tcEditor.aceEditor.session.setBreakpoints(new Array());
	}
}


tc.TextSlide = function(){
	this.TYPE = "TEXT",
	this.name = ko.observable('New Text Slide');
	this.text = '';
}


tc.ImageSlide = function(){
	this.TYPE = "IMAGE",
	this.name = ko.observable('New image Slide');
	this.src = ko.observable();;
	this.watches = new Array();
	this.addWatch = function(div){
		rect = tc.UIManager.currentSlide.data.getRectFromDiv(div)
		w = this.getWatch(div).w;
		if(  w == null ){
			w = new tc.ImageWatch();
			w.rect = {x: rect.x , y:rect.y , width: rect.width, height: rect.height};
			w.setDiv( div );
			this.watches.push(w);
		}
		tc.vm.watchImage(w);

	};
	this.getRectFromDiv = function(div){
		o = { x : div.css('left'), y : div.css('top'), width : div.css('width'), height : div.css('height') }
		xoffset = parseInt(o.x.replace('px', ''), 10)
		xoffset = xoffset - tc.board.offset.left
		o.x = xoffset + 'px'
		yoffset = parseInt(o.y.replace('px', ''), 10)
		yoffset = yoffset - tc.board.offset.top
		o.y = yoffset + 'px'

		return o
	};
	this.getWatch = function(div){
		rect = tc.UIManager.currentSlide.data.getRectFromDiv(div)
		o = null;
		var i =0; 
		for(;i < this.watches.length; i++){
			if(this.watches[i].rect.x == rect.x &&  
				this.watches[i].rect.y == rect.y &&
				this.watches[i].rect.width == rect.width &&
				this.watches[i].rect.height == rect.height 
			
			){
				o = this.watches[i];
			}
		}
		
		return { w : o }
	};
	this.deleteWatch = function(w){
		var i =0; 
		for(;i < this.watches.length; i++){
			if(this.watches[i] == w)
			{
				this.watches[i].getDiv().hide();
				break;
			}
		}
		
		this.watches.splice(i, 1)
		tc.vm.watchImage(null);
	};
	
	this.clearAllWatches = function(){
		var i =0; 
		for(;i < this.watches.length; i++){
			this.watches[i].getDiv().hide();
		}
	}
}

var divDict = {
}

tc.ImageWatch = function(){
	this.rect = {};
	this.div = null;
	this.guid = null;
	this.getDiv = function(){
		return divDict[this.guid];
	};
	this.text = ko.observable('Explain code here');
	this.setDiv = function(d){
		//this.div = d;
		this.guid = guid()
		divDict[this.guid] = d
		d.data("watch", this);
		d.on('click' , function(){
			d = $(this)
			a = d.data('watch')
			tc.vm.watchImage(a);
		});
	}
	this.delete = function(){
		tc.UIManager.currentSlide.data.deleteWatch(this);
	}
}


tc.CodeSlide = function(){
	this.TYPE = "CODE",
	this.name = ko.observable('New Code Slide');
	this.text = '';
	this.watches = new Array();
	this.addWatch = function(lineNumber){
		w = this.getWatch(lineNumber).w;
		if(  w == null ){
			w = new tc.CodeWatch();
			w.lineNumber = lineNumber;
			this.watches.push(w);
		}
		tc.tcEditor.aceEditor.gotoLine(w.lineNumber + 1)
		tc.vm.watch(w);

	};
	this.getWatch = function(l){
		b = false;
		o = null;
		var i =0; 
		for(;i < this.watches.length; i++){
			if(this.watches[i].lineNumber == l ){
				b =  true;
				o = this.watches[i];
			}
		}
		
		return { w : o }
	};
	this.deleteWatch = function(w){
		var i =0; 
		for(;i < this.watches.length; i++){
			if(this.watches[i].lineNumber == w.lineNumber ){
				break;
			}
		}
		
		this.watches.splice(i, 1)
		
		arr = new Array();
		var i =0; 
		for(;i < this.watches.length; i++){
			arr.push( this.watches[i].lineNumber )
		}
		
		tc.tcEditor.resetWatches(arr);
		tc.vm.watch(null);
	}
	
	this.resetWatch = function(o){
		d = this.getWatch(o.old)
		d.w.lineNumber = o.new;
	}
}

tc.CodeWatch = function(){
	this.lineNumber = 0;
	this.text = ko.observable('Explain code here');
	this.delete = function(){
		tc.UIManager.currentSlide.data.deleteWatch(this);
	}
}

tc.Slide = function(data){
	this.data = data;
	tc.vm.slides.push(this);
	tc.vm.currentSlide( this )
	this.setText = function(text){
		this.data.text = text;
		tc.tcEditor.setValue(this.data.text)
	};
	//Set the text into editor
	this.syncUI = function(){
		tc.vm.currentSlide( this )
		if(this.data.TYPE != "IMAGE")
		{
			tc.tcEditor.resetLang(this.data.TYPE);
			
			tc.tcEditor.setValue(this.data.text)
			
			if(this.data.TYPE == "CODE"){
				if ( this.data.watches.length > 0){ 
					var arr = new Array();
					for(var i = 0; i < this.data.watches.length; i++){
						arr[i] = this.data.watches[i].lineNumber;
					}
					tc.tcEditor.resetWatches(arr);
					w = this.data.watches[0];
					tc.tcEditor.aceEditor.gotoLine(w.lineNumber + 1)
					tc.vm.watch(w)
				}
			}
		}
		else{
			tc.board.init();
			if ( this.data.watches.length > 0){ 
				for(var i = 0; i < this.data.watches.length; i++){
					this.data.watches[i].getDiv().show();
				}
			}
		}
	};
	
	this.show = function(){
	};
	
	this.syncData = function(){
		if(this.data.TYPE != "IMAGE"){
			this.data.text = tc.tcEditor.getValue();
		}
		
		if(this.data.TYPE == "CODE"){
			tc.tcEditor.clearAllWatches();
		}
		if(this.data.TYPE == "IMAGE"){
			this.data.clearAllWatches();
		}
	};
	this.hide = function(){
		if(this.data.TYPE == "CODE"){
			tc.vm.watch(null)
		}
		if(this.data.TYPE == "IMAGE"){
			tc.vm.watchImage(null)
		}

	};
	
	
	this.deleteSlide = function(){
		tc.vm.slides.remove(this);
		if( tc.vm.slides().length > 0 ){
			tc.UIManager.changeTextSlide(tc.vm.slides()[0])
		}
		else{
			tc.vm.currentSlide( null )
		}
		$('#scrollbar1').tinyscrollbar_update();
	};
	
	this.changeSlide = function(){
		tc.UIManager.changeTextSlide(this)
	};
	
	this.addCodeWatch = function(){
		
	}
}

tc.UIManager = {
	currentSlide : null,
	that : this,
	init : function(t){
		tc.tcEditor.init();
		this.changeTextSlide(t);
		//this.bindTemplateVisible();
		},
	changeTextSlide : function(t){
		if ( this.currentSlide ){
			this.currentSlide.syncData()
			this.currentSlide.hide()
		}
		if(t){
			this.currentSlide = t;
		}
		/*else{
			this.currentSlide = new tc.Slide(new tc.TextSlide());
		}*/
		this.currentSlide.syncUI();
		this.currentSlide.show();
	},
	
	
	
	AddNewSlide : function(s){
		if( s == "Text Slide" ){
			this.changeTextSlide(new tc.Slide(new tc.TextSlide()));
		}
		else if( s == "Code Slide" ){
			this.changeTextSlide(new tc.Slide(new tc.CodeSlide()));
		}
		else if( s == "Image Slide" ){
			this.changeTextSlide(new tc.Slide(new tc.ImageSlide()));
		}
		else if( s == "Result Slide" ){
			s = new tc.ImageSlide();
			s["isResultSlide"] = true;
			this.changeTextSlide(new tc.Slide(s));
		}		
		$('#scrollbar1').tinyscrollbar_update();
	},
}

function createUploader(){            
	var uploader = new qq.FileUploader({
		element: document.getElementById('file-uploader'),
		action: 'ajaxupload',
		debug: true,
		onComplete: function( id, fileName, responseJSON ) {
			url = "/static/images/" + responseJSON.success
			tc.UIManager.currentSlide.data.src(url)
		},
		onAllComplete: function( uploads ) {
		// uploads is an array of maps
		// the maps look like this: { file: FileObject, response: JSONServerResponse }
		//alert( "All complete!" ) ;
		}
	});           
}

$( document ).ready(function(){
	temp = new tc.Slide(new tc.TextSlide());
	ko.applyBindings(tc.vm)
	tc.UIManager.init(temp);
	$('#scrollbar1').tinyscrollbar();
	createUploader()
});

	
function saveSlides(){
	$.ajax({
	  type: "POST",
	  url: "saveSlides",
	  data: {slides: ko.toJSON(tc.vm.slides)},
	  success: function(result){
			alert(result)
	  },
	});
	
	return false;
}