
tc = tc || {}

tc.straightLine = {				
				connector:[ "StateMachine"],
				paintStyle:{lineWidth:3,strokeStyle:"darkblue"},
				hoverPaintStyle:{strokeStyle:"darkblue"},
				endpoint:"Blank",
				/*curviness:"60",*/
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
			};

tc.curvedLine = {				
				connector:[ "StateMachine", { curviness:15 }],
				paintStyle:{lineWidth:3,strokeStyle:"darkblue"},
				hoverPaintStyle:{strokeStyle:"darkblue"},
				endpoint:"Blank",
				/*curviness:"60",*/
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
			};


$( document ).ready(function(){
	simWatchMgr.first();
});


var tempIndex = 0;
function previous(){
	tempIndex--;
	simWatchMgr.previous();
}

function next(){
	tempIndex++;
	simWatchMgr.jumpTo(tempIndex);
	
}

(function(){
	var tableTag = '<table border="1px" class="fixed">'; 
	var colWidth = '20px'
	var tableHTMLGenerator = function(r){
		this.rows = r;
		this.cols = 10;
		this.getTenByTenHTML = function(){
			return tableTag + this.getTableHTML(10) + "</table>"
		};
		this.getTenByTwentyHTML = function(){
			return tableTag + this.getTableHTML(20) + "</table>"
		};
		this.getTableHTML = function(rows){
			rowsHTML = '';
			for(var r = 0; r < rows; r++){
				rowsHTML += "<tr>"
				for(var c = 0; c < this.cols; c++){
					//rowsHTML += "<td width='" + colWidth + "'><div id='{id}_" + r + "_" + c + "'></div></td>"
					rowsHTML += "<td><div id='{id}_" + r + "_" + c + "'></div></td>"
				}
				rowsHTML += "</tr>"
			}

			return rowsHTML;
		};
	}

	var o = new tableHTMLGenerator();
	window.tenHTML = o.getTenByTenHTML();
	window.getTwentyHTML = o.getTenByTwentyHTML();

})();
