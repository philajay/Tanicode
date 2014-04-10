
tc.PUBSUB_NAME_WATCH = "PUBSUB_NAME_WATCH";
tc.NameWatchSubscriber = function(msg, data){
    $('#htmlWatch').html(data.text);
}
var token = PubSub.subscribe( tc.PUBSUB_NAME_WATCH, tc.NameWatchSubscriber );

tc.createJSTree = function(msg, data){
    $('#tc_tree_container').show();
    $('#toc >ul >li').html(tc.articleDetails.name());
    tc.initJSTree();
}

tc.handleMenuClick = function(data){
    var inst = $.jstree.reference(data.reference),
	obj = inst.get_node(data.reference);
	action = data.item.label;
	if( action == "Create Text Slide" || action == "Create Code Slide" || action == "Create Image Slide"){
    	inst.create_node(obj, {}, "last", function (new_node) {
    	            new_node['data'] = {
    	                'enum' : action,
    	            };
	    			setTimeout(function () { inst.edit(new_node); },0);
	    });
	}
	else if(action == "Rename Slide"){
        inst.edit(obj);
	}
	else if(action == "Delete Slide"){
		if(inst.is_selected(obj)) {
			inst.delete_node(inst.get_selected());
		}
		else {
			inst.delete_node(obj);
		}
	}
}

tc.initJSTree = function(){
    $('#toc').jstree({
  "core" : {
    "check_callback" : true,
    },
  "types" : {
    "#" : {
      "max_depth" : 2, 
      "valid_children" : ["root"]
    },
  },
  "plugins" : [
    "contextmenu", "dnd"
  ],
    "contextmenu": {
        "items": function ($node) {
            return {
                "Create_Text_Slide": {
                    "label": "Create Text Slide",
                    "action": function (data) {
                        tc.handleMenuClick(data);
                    }
                },
                "Create_Code_Slide": {
                    "label": "Create Code Slide",
                    "action": function (data) {
                        tc.handleMenuClick(data);
                     }
                },
                "Create_Image_Slide": {
                    "label": "Create Image Slide",
                    "action": function (data) {
                        tc.handleMenuClick(data);
                        }
                },
                "Rename": {
                    "label": "Rename Slide",
                    "separator_before": true,
                    "action": function (data) {
                        tc.handleMenuClick(data);
                    }
                },
                "Delete": {
                    "label": "Delete Slide",
                    "separator_before": true,
                     "action": function (data) {
                        tc.handleMenuClick(data);
                    }
                }
            };
        }
    }
});
}

$('#toc').bind('create_node.jstree', function (e, data) {
    action = data.node.data.enum;
    tc.UIManager.addNewSlide(action);
    data.node.data['uid'] = tc.UIManager.newSlide.data.uid;
});

$('#toc').bind('select_node.jstree', function (e, data) {
  console.log( data.node.data.uid );
});


tc.onNameNextClick = function(){
    if(tc.articleDetails.name() == ''){
        alert('Name cannot be empty');
        return false;
    }
    tc.koModel.treeInitialized(true);
}

/*
Map the ui element to the events which would publish 
the messsage for pub/sub.
*/
tc.ui_elements_object_mapping = function(s,a){
    this.srcId = s;
    this.events = a;
    this.getDataForEvent = function(e){
        for(var i = 0; i < this.events.length; i++){
            if(this.events[i].event == e )
                return this.events[i];
        }
        
        return null;
    }
}
/*
Dictionary to keep the mapping of the UI elements
which will automatically :
a) bind the event handling using jquery
b) hook up the machnism for publishing the events 
*/
tc.src_dict = {
    dict : {},
    addMapping : function(s,e){
        this.dict[s] = e;
    },
    getMapping : function(s){
        return this.dict[s]
    },
};


(function (){
    l = new Array();
    l.push({
        event : 'focus',
        data : {
            pubId : 'name_focus',
            data : {
                text : 'Name of the article.'     
            },
        } ,       
    });
    e = new tc.ui_elements_object_mapping('name',l);
    
    tc.src_dict.addMapping('name', e);

    l = new Array();
    l.push(    {
        event : 'focus',
        data : {
            pubId : 'tags_focus',
            data : {
                text : 'tags to identify this article with.'     
            },
        } ,       
        }
    );
    e = new tc.ui_elements_object_mapping('tags',l);
    
    tc.src_dict.addMapping('tags', e);
    

    l = new Array();
    l.push(    {
        event : 'focus',
        data : {
            pubId : 'zist_focus',
            data : {
                text : 'Zist of the article. Google will index your page using article name, tags and text of the zist. So please prepare your zist very carefully.'     
            },
            } ,       
        }
    );
    e = new tc.ui_elements_object_mapping('zist',l);
    
    tc.src_dict.addMapping('zist', e);

})();


tc.simplePublisher = function(id,t){
    o = tc.src_dict.getMapping(id);
    d = o.getDataForEvent(t)
    PubSub.publish( tc.PUBSUB_NAME_WATCH, d.data.data );
    //console.log(d.data.data.text);
}

tc.attachNameUIHandlers = function(){
    for( uicntrl in tc.src_dict.dict){
        e = tc.src_dict.dict[uicntrl]
        ctrl = $('#' + e.srcId )
        for(var i = 0; i < e.events.length; i++){
            var o = e.events[i];
            ctrl.on(o.event, function(e){
                elem = e.target.id;
                t = e.type;
                tc.simplePublisher(elem,t);
            });
        }
    }
}





tc.adjustUI = {
    editorHeight : '',
    adjustHeight : function(){
        h = $( window ).height();
		h = h - 46 - 46 - 10;
		h1 = h + 'px'
        //$('#editor').css('height', h1);
        tc.adjustUI.editorHeight = h1;
        $('.tc_adjust_ui').css('height', h1);
    },
}


tc.articleDetails = {
    'TYPE' : 'METADATA',
    'name' : ko.observable(''),
    'tags' : ko.observable(''),
    'zist' : ko.observable(''),
}

tc.selectOptions = function(n,d){
	this.name = n,
	this.data = d
}


tc.koModel = {
    articleDetails : tc.articleDetails,
    treeInitialized : ko.observable(false),
    slides :  ko.observableArray(),
	currentSlide : ko.observable(),
	
	templateData : function(){
        t = tc.koModel.currentSlide();
        /*if( t.TYPE ){
            return tc.koModel.articleDetails;
        }*/
        
        return {'model': tc.koModel, 'slide': t};
	},
	
	templateAfterRender : function(){
        t = tc.koModel.currentSlide();
        
        if( t.TYPE ){
            tc.attachNameUIHandlers();
        }
        else {
            tc.UIManager.onInitSlide();
        }
        
	},

    codeSlides : function(){
		ret = ko.observableArray();
		ko.utils.arrayForEach(tc.koModel.slides(), function(s) {
			if( s.data.TYPE == "CODE" ){
				if ( s == tc.koModel.currentSlide())
				{
				
				}
				else{
					t = new tc.selectOptions(s.data.name(),s.data)
					ret.push(t)
				}
			}
		});
		
		return ret
	},
	
	codeSlideForTemplate : ko.observable(),
}

tc.koModel.currentTemplate = function(){
    
    t = tc.koModel.currentSlide();
    if( t.TYPE ){
        return 'metaData';
    }
    
    if (t.data.TYPE == 'TEXT' ){
        return 'text';
    }
    if (t.data.TYPE == 'CODE' ){
        return 'code';
    }
    if (t.data.TYPE == 'IMAGE' ){
        return 'image';
    }
}.bind(tc.koModel);

tc.koModel.treeInitialized.subscribe(function(newValue) {
    if(newValue){
		tc.createJSTree();
	}
	
});



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







tc.tcEditor = function(type, div, theme, mode){
    this.initialized = false;
    this.div = div;
    this.type = type;
    this.theme = theme;
    this.mode = mode;
	this.init = function(){
        if( this.initialized ){
            return;
        }
		var editor = ace.edit(this.div);
		//editor.setTheme("ace/theme/monokai");
		editor.setTheme(this.theme);
		//editor.getSession().setMode("ace/mode/html");
		editor.getSession().setMode(this.mode);
		this.aceEditor = editor;
        if( this.type == "CODE" ){
		    this.aceEditor.on("guttermousedown",this.setWatch);
    		this.aceEditor.on("change",this.documentChanged);
		}
		else if(this.type == "TEXT"){
		    editor.container.style.fontFamily = "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace";
		    editor.setShowPrintMargin(false);
            editor.setBehavioursEnabled(false);
            editor.renderer.setShowGutter(false);
            editor.session.setUseWrapMode(true);
		}
		this.initialized = true;
	},
	
	this.resetWatches = function(arr){
		tc.tcEditor.aceEditor.session.setBreakpoints(arr);
	};
	
	this.documentChanged = function(event){
		if(this.type != 'CODE'){
			return;
		}
		
		editor = tc.codeEditor.aceEditor;
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
					//tc.UIManager.currentSlide.data.resetWatch({old:idx, new:idx+len});
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
				
				//tc.UIManager.currentSlide.data.resetWatch({old:idx, new:n});
			}
		}
		
		if( changed ) editor.session.setBreakpoints(newBreakpoints);
	};
	
	this.setWatch = function(e){
		if(tc.UIManager.currentSlide.data.TYPE != 'CODE'){
			return;
		}

		editor = tc.codeEditor.aceEditor;
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
	};
	
	this.redraw = function(){
		this.aceEditor.resize() 
		this.aceEditor.renderer.updateFull() 
	};
	
	this.setValue = function(s){
		this.aceEditor.setValue(s);
	};
	
	this.getValue = function(){
		return this.aceEditor.getValue();
	};
	
	this.resetLang = function(s){
		/*if( s == "TEXT" ){
			this.aceEditor.getSession().setMode("ace/mode/html");
		}
		else if( s== "CODE" ){
			this.aceEditor.getSession().setMode("ace/mode/javascript");
		}*/
	};
	
	this.clearAllWatches = function(){
		tc.tcEditor.aceEditor.session.setBreakpoints(new Array());
	};
}

tc.baseSlide = function(){
    this.syncUI = function(){};
    this.show = function(){};
    this.syncData = function(){};
    this.hide = function(){};
    this.setText = function(){};
}


tc.textEditor = new tc.tcEditor('TEXT', 'text_editor', "ace/theme/monokai", "ace/mode/html");
tc.TextSlide = function(){
	this.TYPE = "TEXT",
	this.name = ko.observable('New Text Slide');
	this.text = '';
}
tc.TextSlide.prototype = new tc.baseSlide();
tc.TextSlide.prototype.constructor = tc.TextSlide;

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
tc.ImageSlide.prototype = new tc.baseSlide();
tc.ImageSlide.prototype.constructor = tc.ImageSlide;


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

tc.codeEditor = new tc.tcEditor('CODE', 'code_editor', "ace/theme/monokai", "ace/mode/python");
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
tc.CodeSlide.prototype = new tc.baseSlide();
tc.CodeSlide.prototype.constructor = tc.CodeSlide;

tc.CodeWatch = function(){
	this.lineNumber = 0;
	this.text = ko.observable('Explain code here');
	this.delete = function(){
		tc.UIManager.currentSlide.data.deleteWatch(this);
	}
}

function getUniqueId(initialSeed){
    var id = 0;
    if( initialSeed ){
        id = initialSeed;
    }
    id++;
    return function(){
        return id++;
    } 
}

tc.getUID = getUniqueId();


tc.Slide = function(data){
	this.data = data;
	this.data['uid'] = tc.getUID();
	//tc.vm.slides.push(this);
	//tc.vm.currentSlide( this )
	this.setText = function(text){
		//this.data.text = text;
		//tc.tcEditor.setValue(this.data.text)
	};
	//Set the text into editor
	this.syncUI = function(){
		tc.vm.currentSlide( this )
		/*if(this.data.TYPE != "IMAGE")
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
		}*/
		this.data.syncUI();
	};
	
	this.show = function(){
	};
	
	this.syncData = function(){
		/*
		if(this.data.TYPE != "IMAGE"){
			this.data.text = tc.tcEditor.getValue();
		}
		
		if(this.data.TYPE == "CODE"){
			tc.tcEditor.clearAllWatches();
		}
		if(this.data.TYPE == "IMAGE"){
			this.data.clearAllWatches();
		}*/
		this.data.syncData();
	};
	this.hide = function(){
        /*
		if(this.data.TYPE == "CODE"){
			tc.vm.watch(null)
		}
		if(this.data.TYPE == "IMAGE"){
			tc.vm.watchImage(null)
		}
        */
        this.data.hide();
	};
	
	
	this.deleteSlide = function(){
		tc.vm.slides.remove(this);
		if( tc.vm.slides().length > 0 ){
			tc.UIManager.changeSlide(tc.vm.slides()[0])
		}
		else{
			tc.vm.currentSlide( null )
		}
		$('#scrollbar1').tinyscrollbar_update();
	};
	
	this.changeSlide = function(){
		tc.UIManager.changeSlide(this)
	};
	
	this.addCodeWatch = function(){
		
	}
}

tc.UIManager = {
	currentSlide : null,
	that : this,
	newSlide : null,
	init : function(t){
		this.setAndChangeSlide(t);
		},
	changeSlide : function(){
		if ( this.currentSlide ){
			this.currentSlide.syncData()
			this.currentSlide.hide()
		}
		this.currentSlide = this.newSlide;
		tc.koModel.currentSlide(this.currentSlide)
	},
	afterRender : function(){
		this.currentSlide.syncUI();
		this.currentSlide.show();
	},
	setAndChangeSlide : function(s){
	    this.newSlide = s;
	    this.changeSlide();
	},
    addNewSlide : function(s){
        if( s == "Create Text Slide" ){
			tc.UIManager.newSlide = new tc.Slide(new tc.TextSlide());
		}
		else if( s == "Create Code Slide" ){
			tc.UIManager.newSlide = new tc.Slide(new tc.CodeSlide());
		}
		else if( s == "Create Image Slide" ){
			tc.UIManager.newSlide = new tc.Slide(new tc.ImageSlide());
		}
		tc.koModel.slides.push(tc.UIManager.newSlide);
        tc.UIManager.changeSlide();
    },	
    
    onInitSlide : function(){
        if( this.currentSlide.data.TYPE == "CODE" ){
            if( tc.createCodeEditor == null ){
                tc.createCodeEditor = createCodeEditor();
            }
            tc.createCodeEditor();
        }
        else if( this.currentSlide.data.TYPE == "TEXT" ){
            if( tc.createTextEditor == null ){
                tc.createTextEditor = createTextEditor();
            }
            tc.createTextEditor();
        }
        
    },
}

function createCodeEditor(){
    init = false;
    $('#code_editor').css('height',tc.adjustUI.editorHeight)
    return function(){
        tc.codeEditor.init();
        
    }
};

tc.createCodeEditor = null;


function createTextEditor(){
    init = false;
    $('#text_editor').css('height',tc.adjustUI.editorHeight)
    return function(){
        tc.textEditor.init();
        
    }
};

tc.createTextEditor = null;
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

/*
$( document ).ready(function(){
	temp = new tc.Slide(new tc.TextSlide());
	ko.applyBindings(tc.vm)
	tc.UIManager.init(temp);
	$('#scrollbar1').tinyscrollbar();
	createUploader()
});
*/
	
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


$( document ).ready(function(){
    tc.adjustUI.adjustHeight();
    //tc.attachNameUIHandlers();
    //tc.tcEditor.init();
    tc.koModel.currentSlide(tc.articleDetails);
    ko.applyBindings(tc.koModel);

})

/*
1) on create of the node create a slide.
2) slide relationship with the node of the tree.
3) the UI synchronization with the slide change





function saveTree(){
    jstree =ko.toJSON($('#toc').jstree('get_json', $('#toc'), -1));
    $.ajax({
	  type: "POST",
	  url: "saveTree",
	  data: {js: jstree},
	  success: function(result){
			alert(result)
	  },
	});
	
	return false;

}
*/