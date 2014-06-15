var steps = [];

var width = ($( window ).width())/2;


jsPlumbMgr = {
	'cons' : new Array(),
	'clear' : function(){
		_.each(this.cons, function(d,i){
			jsPlumb.detach(d);
		});
		this.cons = new Array();
	},
	'set' : function(s){
		this.cons.push(s);
	}
}

function anchor(o){
	this.elements = o;
	this.draw = function(){
		conn = jsPlumb.connect(
				{ 
				  	source: $("#" + this.elements.from), 
				  	target: $("#" + this.elements.to), 
				  	anchors:this.elements.direction,
				}, tc.straightLine
			);
		jsPlumbMgr.set(conn)
	};
}


/*
var cache = {
	'list' : new list()
}
*/

function list(o){
	this.sim = o;
	this.html = '';
	this.draw = function(){
		var mainIndex = simWatchMgr.currIndex;
		temp = {
			'index' : mainIndex,
			'self' : this,
		}
		_.each(this.sim.data, function(d,i){
			var divName = "name_" + this.index + "_" + this.self.sim.row + "_" + (this.self.sim.col  + i);
      $('#' + divName).html(d);
		}, temp)

    if( temp.self.sim.data.length == 1){
        var divName = "name_"+ mainIndex +"_" + this.sim.row + "_" + this.sim.col;
        $('#' + divName).addClass("red") ;
      }

	};
}



steps[steps.length] = {
	'arr' : [
		new list({
			'data' : [7,2,1,6,8,5,3,4],
			'row' : 3,
			'col' : 1,
			'orientation' : 'horizontal',
		}),
	],
	'left' : 'We will sort this array using quicksort.',
};


steps[steps.length] = {
  'question' : "But we have sorted only one element?",

};


steps[steps.length] = {
  'answer' : "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." + 
              "To sort rest of elements we will use divde and conquer using recursion. Lets see how." ,
};



steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [7,2,1,6,8,5,3,4],
      'row' : 1,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['<b>to</b>'],
      'row' : 4,
      'col' : 4,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : [2,1,3,4,8,5,7,6],
      'row' : 7,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new anchor({'from': "name_1_1_8", 'to': 'name_1_7_4', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_2_5_1", 'to': 'name_2_3_1', 'direction' : ["Top", "Bottom"]}),

  ],
  'left' : 'Quicksort uses a following technique to sort the array: <br>' + 
      '1) Pick up an element and find the right position of this element in the array. ' + 
      'We call this element pivot. Generally we pick the last element in the array. In this case its 4.<br>' + 
      '2) While finding the right position of pivot(4) also move other elements in such a ' + 
      'that elements smaller then pivot are on one side of pivot and elements ' + 
      'bigger then pivot are on other side.<br>' + 
      'So assuming we have found the right place of pivot 4.' + 
      'the resulting array would look like.<b> Elements left of pivot are less then 4 and elements right of 4 are greater then 4.</b>' + 
      '<br> Also see that elements left and right of pivot are not sorted.',
}



steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [7,2,1,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=0'],
      'row' : 5,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=0'],
      'row' : 4,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    //new anchor({'from': "name_2_1_1", 'to': 'name_2_3_1', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_2_5_1", 'to': 'name_2_3_1', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' : 'To find the right position of pivot we will use following variables:<br>' + 
      '1) p -- initially set to 0<br>' + 
      '2) i -- intially set to 0.<br>' + 
      'Then will perform following steps<br>' + 
      '<div class="prettyPrint">while i < 7 : /* Move i from beginning of array till end - 1*/<br>' + 
      '&nbsp;&nbsp;&nbsp;&nbsp;if arr[i] < pivot: <br>' + 
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swap arr[i] with arr[p]<br>' + 
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;increment p<br></div>' + 
      'Effectively at each step we try to move the elements less then pivot towards left of array.',
};


steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [7,2,1,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=0'],
      'row' : 5,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=0'],
      'row' : 4,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    //new anchor({'from': "name_3_1_1", 'to': 'name_3_3_1', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_3_5_1", 'to': 'name_3_3_1', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' : 'So when i = 0 <br>' + 
      'arr[0] = 7 which is greater the pivot(4) we increment the value of i',
};

steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [7,2,1,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=0'],
      'row' : 5,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=1'],
      'row' : 4,
      'col' : 2,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : [2,7,1,6,8,5,3,4],
      'row' : 7,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=1'],
      'row' : 9,
      'col' : 2,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=1'],
      'row' : 8,
      'col' : 2,
      'orientation' : 'horizontal',
    }),
    new anchor({'from': "name_4_3_2", 'to': 'name_4_7_1', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_4_5_2", 'to': 'name_4_3_2', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' :'So when i = 1 <br>' + 
      'arr[1] = 2 which is less then pivot(4) so:<br>' + 
      'swap arr[1] with arr[p] (interchange 2 with 7)<br>' + 
      'increment p to 1' ,
};

steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [2,7,1,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=1'],
      'row' : 5,
      'col' : 2,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=2'],
      'row' : 4,
      'col' : 3,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : [2,1,7,6,8,5,3,4],
      'row' : 7,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=2'],
      'row' : 9,
      'col' : 3,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=2'],
      'row' : 8,
      'col' : 3,
      'orientation' : 'horizontal',
    }),
    new anchor({'from': "name_5_3_3", 'to': 'name_5_7_2', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_4_5_2", 'to': 'name_4_3_2', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' :'So when i = 2 <br>' + 
      'arr[2] = 1 which is less then pivot(4) so:<br>' + 
      'swap arr[1] with arr[p] (interchange 1 with 7)<br>' + 
      'increment p to 2' ,
};


steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [2,1,7,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=2'],
      'row' : 5,
      'col' : 3,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=3'],
      'row' : 4,
      'col' : 4,
      'orientation' : 'horizontal',
    }),
    //new anchor({'from': "name_4_1_1", 'to': 'name_4_3_1', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_4_5_2", 'to': 'name_4_3_2', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' :'So when i = 3 <br>' + 
      'arr[3] = 6 which is greater then pivot(4) so do nothing' ,
};

steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [2,1,7,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=2'],
      'row' : 5,
      'col' : 3,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=4'],
      'row' : 4,
      'col' : 5,
      'orientation' : 'horizontal',
    }),
    //new anchor({'from': "name_4_1_1", 'to': 'name_4_3_1', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_4_5_2", 'to': 'name_4_3_2', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' :'So when i = 4 <br>' + 
      'arr[4] = 8 which is greater then pivot(4) so do nothing<br>' + 
      'when i = 4 <br>' + 
      'arr[5] = 5 which is greater then pivot(4) so do nothing<br>',
};

steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [2,1,7,6,8,5,3,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=2'],
      'row' : 5,
      'col' : 3,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=6'],
      'row' : 4,
      'col' : 7,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : [2,1,3,6,8,5,7,4],
      'row' : 7,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=3'],
      'row' : 9,
      'col' : 4,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=6'],
      'row' : 8,
      'col' : 7,
      'orientation' : 'horizontal',
    }),
    new anchor({'from': "name_8_3_7", 'to': 'name_8_7_3', 'direction' : ["Bottom", "Top"]}),
    //new anchor({'from': "name_4_5_2", 'to': 'name_4_3_2', 'direction' : ["Top", "Bottom"]}),
  ],
  'left' :'So when i = 6 <br>' + 
      'arr[6] = 3 which is less then pivot(4) so:<br>' + 
      'swap arr[1] with arr[p] (interchange 3 with 7)<br>' + 
      'increment p to 3' ,
};

steps[steps.length] = {
  'arr' : [
    new list({
      'data' : [2,1,3,6,8,5,7,4],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['p=3'],
      'row' : 5,
      'col' : 4,
      'orientation' : 'horizontal',
    }),
    new list({
      'data' : ['i=6'],
      'row' : 4,
      'col' : 7,
      'orientation' : 'horizontal',
    }),

    new list({
      'data' : [2,1,3,4,8,5,7,6],
      'row' : 3,
      'col' : 1,
      'orientation' : 'horizontal',
    }),
    new anchor({'from': "name_9_3_8", 'to': 'name_9_3_4', 'direction' : ["Top", "Top"]}),
  ],
  'left' :'Since i has reached till end, we swap the pivot element with <br>' + 
      'with element at p. So interchange 4 with 6.<br> At this point we have :<br>'  + 
      '1) positioned 4 at right place.<br' + 
      '2) elements less then 4 are at left of the 4<br>' + 
      '3) elements greater then 4 are at right of the 4<br>' , 
};


steps[steps.length] = {
	'code' : "Huyyah",
	'left' :'a = [7,2,1,6,8,5,3,4] \n' + 
			'i = 0\n'  + 
      'length = len(a)\n'  + 
      'pivot = a[length - 1]\n'  + 
			'for p in range(i , length - 1):\n' + 
			'  if a[p] < pivot:\n' + 
			'    a[p], a[i] = a[i], a[p]\n' + 
      '    i += 1\n' + 
      'a[pos], a[right] = a[right], a[pos]',
    'watches' : [{
          'lineno' : 0,
          'append' : 1,
          'prepend' : 'Declare array to sort',
        }
      ],
};




/*
steps[steps.length] = {
  'answer' : "Fear not. To sort rest of the elements we will use recursion.",
};
*/

simWatchMgr = {
	'currIndex' : 0,
	'first' : function(){
		this.jumpTo(0);
	},
	'jumpTo' : function(i){

    
    /*if( i == 2 ){
      trans.scaleDown({to: "toc > ul", elem: "main_ui", show: "toc"});
      return;
    }
    if( i == 3 ){
      trans.scaleUp({to: "toc > ul", elem: "main_ui", show: "toc"});
      return;
    }*/
    
		this.currIndex = i;
		
		//jsPlumbMgr.clear();
		$('#sim_watch').empty();
    if( steps[i].answer ){
        var html =   '<div class="stepContainer">'
                + '<div class="row"><div class="col-md-12">' 
                + '<div class = "col-sm-10"><div> <div class="triangle-isosceles right">'+ steps[i].answer + '</div></div></div>' 
                + '<div class = "col-sm-2"><img src="/static/images/tuts/tanituts.jpeg" /></div>'
                + '</div></div></div>';
          $("#main_ui").prepend(html);
        //window.setTimeout(this.populateCells, 10)

    }
		else if( steps[i].question ){
        var html =   '<div class="stepContainer">'
                + '<div class="row"><div class="col-md-12">' 
                + '<div class = "col-sm-2"><img src="/static/images/tuts/you.jpeg" /></div>'
                +  '<div class = "col-sm-10"><p class="thoughtLeft">'+ steps[i].question + '</p></div>' 
                + '</div></div></div>';
          $("#main_ui").prepend(html);
        //window.setTimeout(this.populateCells, 10)

    }
    else if(steps[i].code){
			id = "editor_" + i;
			var left = steps[i].left;
			var html =   '<div class="stepContainer">'
	        			+ '<div class="section"><div id="' + id +'" class="editor">'
	            		+ left 
                  + '</div><div class="player"> '
                  + '<a  href="#"><span class="glyphicon glyphicon-arrow-left"></span>Previous</a>'
                  + '<a class="player_element1" href="#" >Next<span class="glyphicon glyphicon-arrow-right" ></span></a>'
                  + '</div></div>' 
						+ '<div class="section">Use the previous and next anchors of code player to understand the code in details.'
	        			+ '</div></div>';
	         $("#main_ui").prepend(html);
	        window.setTimeout(this.initEditor, 10)
		}
		else
		{
			var l = steps[i].arr;
			var left = steps[i].left;
			var right = tenHTML;
			right = right.replace(/{id}/g, "name_" + this.currIndex)
			var html =   '<div class="stepContainer stepContainer_th">'
	        			+ '<div class="section triangle-isosceles right">'
	            		+ left 
						+ '</div><div class="section" id="right_section_' + this.currIndex + '">'
	        			+ right;
	        			+ '</div></div>';
	        $("#main_ui").prepend(html);
	        window.setTimeout(this.populateCells, 10)
			//$("#simTmpl").tmpl( {'left': left, 'right' : right} ).appendTo( "#main_ui" );*/
		}
	},
	'initEditor' : function(){
		i = simWatchMgr.currIndex;
		name = "editor_" + i
		var editor = ace.edit(name);
		editor.setReadOnly(true);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/python");

    var editor = $($(".stepContainer")[0]).find(".editor");
    var p = $($(".stepContainer")[0]).find(".player");
    var ew = editor.width()/2;
    var pw = p.width()/2;
    var marginLeft = ew - pw;
    p.css("margin-left", marginLeft + "px");
    var index = -1;
    var anchors = p.children();
    var arr = steps[i].watches;
    var elem = $($($(".stepContainer")[0]).find(".section")[1]);//$('#right_section_' + i);
    var player = new codePlayer(elem, arr);
    $(anchors[0]).on('click', function(){
        player.previous();
    });
    $(anchors[1]).on('click', function(){
        player.next();
    })

	},

	'populateCells' : function(){
		i = simWatchMgr.currIndex;

		var l = steps[i].arr;
		_.each(l, function(d,i){
			d.draw();
		}, this)
		jsPlumb.repaintEverything();
    $($(".stepContainer")[0]).toggleClass("stepContainer-change")

		/*name = "name_" + i + "_2_2"
		svg = new SVGContainer(name);
		svg.init();
    */
		/*
		_.each(svgArrs, function(d,i){
			d.position();
		})

		svgArrs.push(svg);
		*/
		//$("html, body").animate({ scrollTop: 0 }, 0);
		/*
			name = "name_" + i + "_2_2"
			var elem = $("#" + name);
			var offset = elem.offset();
			var position = elem.position();
			var html = "<svg id='svg' style='z-index:100;top:" + offset.top + "px;left:" + offset.left + "px' height='30' width='200'>";
			//var html = "<svg id='svg' style='z-index:100;top:" + position.top + "px;left:" + position.left + "px' height='30' width='200'>";
			html += '<text x="0" y="15" fill="red">I love SVG!</text></svg>'
			$("#main_ui").append(html);
		*/


	},
}

function codePlayer(elem , watches){
  this.index = -1;
  this.watches = watches;
  this.elem = elem;
  this.next = function(){
      this.index++;
      if( this.index < this.watches.length){
        this.html();
      }
  };
  this.previous = function(){
      this.index--;
      if( this.index >= 0){
        this.html();
      }
  };

  this.html = function(){
    h = ''
    if( watches[this.index].prepend ){
        h = watches[this.index].prepend + '<br>';
    }
    if( watches[this.index].append ){
        i = watches[this.index].append - 1
        h += $('#right_section_' + i).html();
    }
    elem.html( h )
 };
}

var svgArrs = [];

function SVGContainer(id){
	this.elem = $("#" + id);
	this.init = function(){
		this.draw();
	};
	this.draw = function(){
		var position = this.elem.position();
		var html = "<svg id='svg_" + id + "' style='position:absolute;z-index:100;top:" + position.top + "px;left:" + position.left + "px' height='30' width='200'>";
		//var html = "<svg id='svg' style='z-index:100;top:" + position.top + "px;left:" + position.left + "px' height='30' width='200'>";
		html += '<text x="0" y="15" fill="red">I love SVG!</text></svg>'
		//$("#main_ui").append(html);
		$($($('.stepContainer')[0]).find('.section')[1]).append(html)

	}
	this.position = function(){
		var position = this.elem.position();
		svg = $("#svg_" + id);
		svg.attr("left", position.left + 'px');
		svg.attr("top", position.top + 'px');
		
	}
}





trans = {
  toc : null,
  height: null,
  width: null,
  'scaleDown' : function(anim ){
      var o = $('#' + anim.to);
      var w = o.width();
      var l = o.offset().left;
      var t = o.offset().top;
      var elem = $("#" + anim.elem)
      this.toc = elem.html();
      this.height = $(document).height();
      this.width = elem.width();
      elem.transition({ x: l }, 500,'ease', function(){
          elem.animate({ width: w }, 600, "linear", function(){
              
              html = '<div class="triangle-isosceles bottom">Huyyah</div>'
              elem.html(html);
              //$("#main_ui").addClass('transit-box');
              elem.animate({height: 50 }, 600, "linear", function(){
                  elem.transition({y: t - 70 }, 1500,'ease', function(){
                    $('#' + anim.show).animate({opacity: 1 }, 300, "linear", function(){
                      elem.animate({opacity: 0 }, 300, "linear");
                    });
                  });            
                }
            );
          });
      });
  },

  'scaleUp' : function(anim){
      var o = $('#' + anim.to);
      var elem = $("#" + anim.elem)
      elem.animate({opacity: 1 }, 300, "linear", function(){
          $('#' + anim.show).animate({opacity: 0 }, 300, "linear", function(){
              elem.transition({y: 0 }, 1500,'ease', function(){
                  elem.html(trans.toc);
                  /**/
                  elem.animate({width: trans.width }, 600, "linear", function(){
                         elem.animate({height: trans.height }, 600, "linear", function(){
                                elem.transition({ x: 0 }, 500,'ease', function(){
                                  try{
                                           
                                  }catch(e){alert(e)}
                                });

                          });
                  });
              });
          });
      })
  },
}