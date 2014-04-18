tc.articleDetails = {
    'TYPE' : 'METADATA',
    'name' : ko.observable(''),
    'tags' : ko.observable(''),
    'zist' : ko.observable(''),
    'initialSeed' : 0,
    'syncUI' : function(){},
    'show' : function(){
        setTimeOut(
            function(){
                $('#name').focus();
            },
            1000
        );
    },
    'syncData' : function(){},
    'hide' : function(){},
    'setText' : function(text){},
    'changeSlide' : function(){
		tc.UIManager.changeSlide(tc.koModel.articleDetails)
	},
	'showNextButton' : ko.observable(true),
	'initFromJSON' : function(j){
		tc.articleDetails.name(j.name);
		tc.articleDetails.tags(j.tags);
		tc.articleDetails.zist(j.zist);

		tc.articleDetails.initialSeed = j.initialSeed;
	}
}

tc.articleDetailsHolder = {
	data : null,
}

tc.koModel = {
    articleDetails : tc.articleDetails,
	previewCurrentSlide : ko.observable(),
	

	previewWatch : ko.observable(),
	showPreviewTemplate : function(s){
	    return this.showTemplateInternal( tc.koModel.previewCurrentSlide() ,s)
	},
	
	showTemplateInternal : function(slide, s){
		if( slide ){
			var t = slide.data.TYPE
			arr = new String(s).split("|");
			for(var i = 0; i < arr.length; i++){
				if (arr[i] == t )
					return  true;
			}
		}
		return false
	},
	
	showPreviewWatchTemplate : function(){
        if( tc.koModel.previewWatch()){
            return true;
        }
        return false;
	},

	
}

//articleMetaData
//slidesMetaData
//firstSlide

$( document ).ready(function(){
	window.sj = $.parseJSON(metaData)
	artDetailsData = $.parseJSON( sj['articleMetaData'] );
	//window.slides =  sj['slidesMetaData'] ;
	window.slides =  $.parseJSON($.parseJSON( window.savedSlides ));
	//window.firstSlide = sj['firstSlide'] ;
	tc.articleDetails.initFromJSON(artDetailsData);
	tc.koModel.previewSlides = ko.observableArray();
	tc.articleDetailsHolder.data = tc.articleDetails;
	tc.koModel.articleDetails = tc.articleDetailsHolder;
	//tc.koModel.articleDetails  = new tcp.Slide(tc.articleDetails);
    ko.applyBindings(tc.koModel);
    tc.preview();
})


tc.preview = function(){
   //tcp.previewData['slidesJSON'] =  ko.toJSON(tc.koModel.slides);
   tc.overlayInitArticle();
   $('#jstreejstreeHolder').css('height', $('#editor').css('height'));
}


tc.overlayInitArticle = function(){
	dataSlides = []

	_.each(window.slides, function(elem, i){
			o =  elem.data;
			//o = o.data;
			tcp.UIManager.idToIndexMap[o.uid] = i;
			slide = new tcp.Slide(o);
			dataSlides.push(slide);

			var elemStr = '<li><a href="#">'+ (i + 1) + '  ' + slide.data.name +'</a></li>'
			$('#pv_dd').append(elemStr)

		}
	);
	//tc.koModel.previewSlides()[0].data = firstSlide;

	tcp.UIManager.index = 0;
	tcp.InitUI.init();
	tcp.UIManager.init(tc.koModel.previewSlides()[0]);
	$('#pv_dd > li' ).each(function(index){
	$(this).find('a').each( function(index2){
			
			$(this).on('click', function(){
				tcp.UIManager.moveTo(index)
			});
		});
	});
	$('#overlay').show();	


	//tcp.previewTree.init(dataSlides);
	//tcp.jstree.init();
	//ko.applyBindings(tcp.vm);
}



/*
function async (fn) {
    setTimeout(fn, 20);
}

function sometimeWhen (test ,then) {
    async(function () {
        if ( test() ) {
            then();
        } else {
            async(arguments.callee);
        }
    });
}

function initAndSometimeWhen(init, test, then){
	if( !test() ){
		init();
	};
	sometimeWhen(test, then);
}*/