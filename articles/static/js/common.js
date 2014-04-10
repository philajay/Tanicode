tc = {}

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


MAX_PARTIAL_LENGTH = 20
ko.bindingHandlers.partialText = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		elem = $(element);
		s = new String(ko.utils.unwrapObservable(valueAccessor()));
		if(s.length > MAX_PARTIAL_LENGTH ){
			s = s.substring(0,MAX_PARTIAL_LENGTH - 3) + '...';
		}
		elem.html(s)
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    		elem = $(element);
		s = new String(ko.utils.unwrapObservable(valueAccessor()));
		if(s.length > MAX_PARTIAL_LENGTH ){
			s = s.substring(0,MAX_PARTIAL_LENGTH - 3) + '...';
		}
		elem.html(s)
    }
};

ko.bindingHandlers.forEachIndex = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		elem = $(element);
		s = parseInt(ko.utils.unwrapObservable(valueAccessor()), 10) + 1;
		elem.html(s + "&nbsp;&nbsp;")
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		elem = $(element);
		s = parseInt(ko.utils.unwrapObservable(valueAccessor()), 10) + 1;
		elem.html(s + "&nbsp;&nbsp;")
    }
};

ko.bindingHandlers.imgSrc = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		elem = $(element);
		val = ko.utils.unwrapObservable(valueAccessor())
		if( val ){
			elem.attr('src', val);
		}
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		elem = $(element);
		val = ko.utils.unwrapObservable(valueAccessor())
		if( val ){
			elem.attr('src', val);
		}
    }
};

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}


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


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}