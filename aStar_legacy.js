if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

class aStar{
	constructor(startPos,endPos,wallPos)
	{
		this.startPos=startPos;
		this.endPos=endPos; 
		this.wallPos=wallPos;
		this.closedList = [];
		this.successorList = [];
		this.f=[]; //variable for storing the f = g + h
		this.parents=[];
		this.closedparents=[];
		this.g=0;
	}

	search(){
		var path = [];
		console.log(this.endPos);
		path.push(this.endPos);
		this.closedList.push(this.startPos); //push the minimum 
		var current = [];
		var i = this.closedList.length - 1;
		while(this.closedList[this.closedList.length - 1][0]!=this.endPos[0] || this.closedList[this.closedList.length - 1][1]!=this.endPos[1]) //while the current is not equal to the goal
		{
			 current = this.closedList[this.closedList.length-1]; //which is last pushed in the list
			 this.successor(current);
		}
		//console.log(path);
		//console.log(this.closedparents);
		this.parentOf(this.endPos,path);
		//console.log(path);
		return path;
	} 
	
	parentOf(end,path){
		while(!path[path.length-1].equals(this.startPos)){
		var i = this.arrayIndexOf(this.closedList,end);
		//console.log(i);
		//console.log(this.closedparents[i]);
		path.push(this.closedparents[i-1]);
		this.parentOf(this.closedparents[i-1],path);
		}
	}

	successor(current){
		//console.log(current);
		var x = current[0];//x-cordinate
		var y = current[1];//y-cordinate
		var max_x = 9;
		var max_y = 9;
		var flag = -1;
		var block = 0;
		var successor_flag = 0;
		var g = 0;

		for(var dx = (x > 0 ? -1 : 0); dx<=(x < max_x ? 1 : 0); ++dx){
			for(var dy = (y > 0 ? -1 : 0); dy<=(y < max_y ? 1 : 0); ++dy){
				if((dx!=0 || dy!=0) && (dx!=1 || dy!=-1) && (dx!=-1 || dy!=1) && (dx!=1 || dy!=1) && (dx!=-1 || dy!=-1)) 
				{
					successor_flag = this.arrayIndexOf(this.successorList,[x+dx,y+dy]); 
					flag = this.arrayIndexOf(this.closedList,[x+dx,y+dy]);
					block = this.arrayIndexOf(this.wallPos,[x+dx,y+dy]);
					if(this.gdistance(this.startPos,[x+dx,y+dy])<this.gdistance(this.startPos,[x,y])){
						g = this.gdistance(this.startPos,[x,y])+1;
					}
					else{
						g = this.gdistance(this.startPos,[x+dx,y+dy]);
					}
					
					if(block == -1 && successor_flag == -1 && flag == -1){
						var f1 = g+this.Heuristic([x+dx,y+dy],this.endPos);
						this.f.push(f1);
						console.log(g,[x+dx,y+dy]);
						this.successorList.push([x+dx,y+dy]);
						this.parents.push([x,y]);
					}
					
				}
			}
		}
		//console.log(this.closedList);

		if(this.successorList.length==0)
		{
			alert("Path doesn't exist!");
		}
		var minF = math.min(this.f); //min of f []
		var i = this.f.indexOf(minF); //=1

		///console.log(this.successorList);

		var minChildX = this.successorList[i][0]; //just the successor and not the corresponding f value
		var minChildY = this.successorList[i][1];
		var minChild = [minChildX,minChildY];
		var parentX = this.parents[i][0];
		var parentY = this.parents[i][1];
		var parent = [parentX,parentY];
		
		this.successorList.splice(i, 1); //remove successor from openList
		this.parents.splice(i,1);
		this.f.splice(i, 1); 
		
		this.closedList.push(minChild);
		this.closedparents.push(parent);
		return [this.closedList,this.closedparents];
	}

	Heuristic(current, endPosition){
		/*Manhattan Distance*/
		return math.abs(current[0]-endPosition[0])+math.abs(current[1]-endPosition[1]);
	}

	gdistance(startPosition, current){
		return math.abs(current[0] - startPosition[0])+math.abs(current[1]- startPosition[1])+1;
	}

	arrayIndexOf(arr,element){
		//console.log(arr);
		for(var i = 0; i < arr.length; i++) {
		   if(arr[i].equals(element)) {
		     return i;
		   }
		}
		
	   	return -1;
	}

}
var canvas = document.getElementById("canvas");
	var context= canvas.getContext("2d");

var pixelClass = 1; //for determining which color
var pixelColor = "#0000ff"; //by default blue for start position
var startPos = [];
var endPos = [];
var wallPos = [];
//define array


canvas.addEventListener('click', function(e){
		var rect = canvas.getBoundingClientRect();

		var x = (Math.floor(e.offsetX/50)*50)/50; 
		var y = (Math.floor(e.offsetY/50)*50)/50;
		//var s = [x,y];
		

		context.fillStyle = pixelColor;
		context.fillRect(Math.floor(e.offsetX/50)*50, Math.floor(e.offsetY/50)*50, 50, 50);
		//new array push elements
		if(pixelClass==1)
			startPos.push(x,y);
		if(pixelClass==2)
			endPos.push(x,y);
		if(pixelClass==3)
			wallPos.push([x,y]);
		}, true);
	
		function searchPath(){
			if(startPos.length==0 || endPos.length==0){
				alert("Please select a starting position or goal position");
				refreshCanvas();
			}
			if(startPos.length>2 || endPos.length>2){
				alert("Only one start and goal position is allowed");
				refreshCanvas();
			}	
			astar = new aStar(startPos,endPos,wallPos);
			var ans = astar.search();
			console.log(ans);
			var cell,x,y;
			context.moveTo((endPos[0]*50)+25,(endPos[1]*50)+25);
			for(var j = 0; j < ans.length; j++)
			{
				cell = ans[j];
				x = (cell[0]*50)+25;
				y = (cell[1]*50)+25;
				context.lineTo(x,y);
				
			}
			context.moveTo((startPos[0]*50)+25,(startPos[1]*50)+20);
			context.stroke();
		 }

		function drawGrid(){
			context.beginPath();
			context.fillStyle = "white";
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			for (var row = 0; row < 10; row++) 
			{
			   for (var column = 0; column < 10; column++) 
				{
				    var x = column * 50;
				    var y = row * 50;
				    context.rect(x, y, 50, 50);
			        context.fill();
			        context.stroke();
			    }
			}
   			context.closePath();
			}

		drawGrid();
			