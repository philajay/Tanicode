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



// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
        else {
            //alert("couldnt work")
        }
    }
});



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


