var Trend, Line, lineFunction;
var lineData = [50, 10, 37, 40, 24, 31, 9, 49, 8, 26];
 
function Init(){
//	Connection.connect();
	var parts = window.location.search.substr(1).split("&");
	var $_GET = {};
	for (var i = 0; i < parts.length; i++) {
		var temp = parts[i].split("=");
		$_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
	}
	sta = false, stb = false, stc = false;
	spin = [ 1.,  1.,  1.,  0.,  1.,  0.,  1.,  0.,  0.,  0.,  0.,  1.,  0.,
        1.,  0.,  1.,  1.,  0.,  0.,  1.,  0.,  1.,  0.,  0.,  0.,  1.,
        0.,  0.,  0.,  1.,  1.,  1.,  1.,  0.,  1.,  0.,  0.,  0.,  0.,
        0.,  1.,  0.,  0.,  0.,  1.,  0.,  0.,  0.,  1.,  1.,  0.,  0.,
        1.,  0.,  1.,  1.,  1.,  0.,  0.,  1.,  0.,  0.,  0.,  1.,  1.,
        0.,  1.,  1.,  0.,  0.,  1.,  0.,  1.,  0.,  0.,  1.,  1.,  1.,
        0.,  1.,  0.,  1.,  0.,  1.,  1.,  1.,  1.,  0.,  0.,  0.,  1.,
			 1.,  0.,  0.,  0.,  0.,  1.,  0.,  1.,  0.];
	
	position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0];

	// Connection.send("g");
	op = "n";
	oldvalue = [];
	value = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
			 200, 200, 200, 200, 200, 200, 200, 200, 200];
	
	money = 1.0e5;
	
	var width = 500,
		height = 500,
		cellSize = 50;
	var upPanel = d3.select("body").append("div")
	 	.style("height", 40+"px");

	upPanel.selectAll("button")
		.data(["connect", "disconnect"])
		.enter()
		.append("button")
		.on("click", function(d){switch(d){ case "connect":
											console.log('connect button clicked.');
											Connection.connect();
											break;
//											d3.event.preventDefault();
											case "disconnect":
											Connection.disconnect();
											break;
//											d3.event.preventDefault();
										  };
								})
		.attr("id", function(d){return d;})
		.text(function(d){return d;});
	// .attr("disabled", function(d){switch(d){case "connect": return "false";
		// 										case "disconnect": return "true";
		// 									   };
		// 							 })
		
	strategy_select = upPanel.append("select")
		.attr("name", "strategy")
		.on("change", change);
	//	.attr("class", "stg");

	
	options = strategy_select.selectAll("option")
		.data(["Select Strategy", "A", "B", "No"])
		.enter()
		.append("option")
		.attr("value", function(){})
		.text(function(d){return d;});

	var groupsell = upPanel.append("button")
		.on("click", sell_all)
		.text("ZERO");
	
	// $('.stg').fancySelect();
	var teamtext = d3.select("body")
		.append("h1")
		.attr("class", "fontawesome-user")
		.attr("align", "center")
		.text($_GET["team"]);
	clearText = d3.select("body")
		.append("h1")
		.attr("align", "center")
		.text("Total: "+money);
		
	
	moneytext = d3.select("body")
		.append("h1")
		.attr("align", "center")
		// .attr("transform", "translate(0, 0)")
		.text("Money: "+money);

	svg1 = d3.select("body").selectAll("svg")
		.data("S")
		.enter().append("svg")
		.attr("width", width+150)
		.attr("height", height+50)
		.attr("class", "RdYlGn")
		.append("g")
		.attr("transform", "translate(50, 50)");

	div = d3.select("body").append("div").attr("class","tooltip").style("display", "none");
	spins = svg1.selectAll(".spin")
		.data(d3.range(0,100))
		.enter().append("rect")
		.on("mouseleave", function(d){div.style("display", "none");})
		.on("mouseenter", function(d){//exaggerate(d);
			// showinfo(d, d3.mouse(this));
			div.style("display", "inline");
			showinfo(d, [d%10*(cellSize)+5, Math.floor(d/10)*(cellSize)+30] );
		})
		.on("click", function(d){purchase(d);})
		.on("contextmenu", function(d){sell(d);	d3.event.preventDefault();})
		.attr("class", "spin")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("x", function(d){return d%10*cellSize;})
		.attr("y", function(d){return Math.floor(d/10)*cellSize;});
	
	spins.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "spin q" + spin[d]; });

	svg2 = d3.select("body")
		.append("svg")
		.attr("width", width+150)
		.attr("height", height+50)
		.attr("class", "BW")
		.append("g")
		.attr("transform", "translate(50, 50)");

	
	posis = svg2.selectAll(".posi")
		.data(d3.range(0,100))
		.enter().append("rect")
		.attr("class", "posi")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("x", function(d){return d%10*cellSize;})
		.attr("y", function(d){return Math.floor(d/10)*cellSize;})
		.on("mouseleave",  function(d){showTrend(d, [1000, 1000]);})
		.on("mouseenter", function(d){
			var y = Math.floor(d/10)*(cellSize)+50;
			if(y > 430)y -= 120;
			showTrend(d, [d%10*(cellSize)+50, y]);
			})
		.on("click", function(d){purchase(d);})
		.on("contextmenu", function(d){sell(d);	d3.event.preventDefault();})
		.on("mousewheel", function(d){Wheel(d);	d3.event.preventDefault();});
		// .on("mouseenter", function(d){svg2
		// 							  .append("line")
		// 							  .attr("stroke-width", "5")
		// 							  .attr("x1", d%10*cellSize.toString())
		// 							  .attr("y1", Math.floor(d/10)*cellSize.toString())
		// 							  .attr("x2", (d%10*cellSize+500).toString())
		// 							  .attr("y2", (Math.floor(d/10)*cellSize+500).toString());
		// 							 });
	posis.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "posi t" + position[d]; });
	
	Trend = svg2.append("rect")
				.attr("stroke", "black")
				.attr("width", 100)
				.attr("height", 100)
				.attr("transform", "translate(1000, 1000)");
	Line = svg2.append("path")
				.attr("stroke", "blue")
				.attr("stroke-width", 2)
				.attr("fill", "none");

	d3.select(self.frameElement).style("height", "2910px");
}

function Wheel(d){
	var delta = window.event.wheelDelta;
	if(delta > 0)purchase(d);
	else{sell(d);}
}

function sell_all(){
	for(i=0;i<100;i++){
		while(position[i]>0)
			sell(i);
	}
}
// function exaggerate(data){
// 	posis.selectAll(d)
// 		.filter(); //TODO
// }

function change(){
	var selectIndex = strategy_select.property('selectedIndex'),
		data = options[0][selectIndex].__data__;
	console.log("you selected "+data);
	switch(data){
	case "A":
		sta = true;
		stb = false;
		break;
	case "B":
		sta = false;
		stb = true;
		break;
	case "No":
	 	sta = false;
	 	stb = false;
		break;
	}
}

function showinfo(data, position){
	div.transition()        
		.duration(200)      
		.style("opacity", .9)
		.style("left", d3.event.pageX + "px")     
		.style("top", d3.event.pageY + "px")
		.text(value[data])
		.attr("pointer-events", "none");
		
	// var lineData = [500, 100, 370, 400, 240, 310, 90, 490, 80, 260]
	// for (i=0;i<oldvalue.length;i++)
	// 	lineData.push(oldvalue[i][data]);
	
	// var lineFunction = d3.svg.line()
    //     .x(function(d, i) { return  70 * i; })
    //     .y(function(d) { return d; })
    //     .interpolate("linear");

	// var box = div.insert("svg");
	// 	.attr("width", "300")
	// 	.attr("height", "100");
	//	.style("fill", "#FFFFFF");
		// .attr("transform", "translate(" + position + ")");
	
	// box.insert("path")
	// 	   .attr("transform", "translate(" + position + ")")
    //     .attr("d", lineFunction(lineData))
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 2)
    //     .attr("fill", "none");
	//	   .style("fill", "#FFFFFF")

	// svg1.append("text")
	// 	.attr("class", "body")
	// 	.attr("transform", "translate(" + position + ")")
	// 	.text(value[data])
	// 	.attr("pointer-events", "none")
	// 	.transition()
	// 	.duration(500)
	// 	.style("font-size", "x-large")
	// 	.remove();
}
function UD(){
	lineData.shift();
	lineData.push(Math.floor((Math.random() * 50) + 1));
	
	Line.attr("d", lineFunction(lineData));
}
function showTrend(d, pos){
	Trend.attr("transform", "translate(" + pos + ")")
		
	lineFunction = d3.svg.line()
                          .x(function(d, i) { return pos[0] + 10 * i + 5; })
                          .y(function(d) { return pos[1] + 2 * d; })
                          .interpolate("linear");

	Line.attr("d", lineFunction(lineData));
}
setInterval(UD, 1000);
function purchase(data){
	if (money >= value[data]){
		Connection.send("p"+data+"v"+value[data]);

	}
}

function op_purchase(data){
	money -= value[data];
	position[data] += 1;
	moneytext.text("Money: "+money);
	if (money<5000){
		moneytext.transition().style("color","red");
	}

	posis.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "posi t" + position[d]; });
	op = "n";

}

function sell(data){
	if (position[data] > 0){
		Connection.send("s"+data+"v"+value[data]);
		money += value[data]
		position[data] -= 1;
		moneytext.text("Money: "+money);
		if (money>5000){
			moneytext.transition().style("color","#606468");
		}
		posis.filter(function(d) { return d+1; })
			.attr("class", function(d) { return "posi t" + position[d]; });
	}
	
}

function dotproduct(a,b) {
	var n = 0, lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += eval(a[i]) * eval(b[i]);
	return n;
 }
function Change(data_s, data_v){
	spin = data_s.split("");
	value = data_v.split(",");
	oldvalue.push(value);
	if(oldvalue.length>10){
		oldvalue.shift();
	}
	for (var i = 0; i < 100; i++){
		value[i] = eval(value[i]);
		//value[i] += eval(spin[i])*20-10;
		if(value[i]<1)
			value[i]=1;
		if (sta){
			if (spin[i] == '1'){
				sell(i);
			}
			if (spin[i] == '0'){
				purchase(i);
			}
		}
		if (stb){
			if (spin[i]=='1'){
				purchase(i);
			}
			if (spin[i]=='0'){
				sell(i);
			}
		}
	}
	clearText.text("Total: "+ (dotproduct(value, position) + money));
	posis.filter(function(d) { return d+1; })
			.attr("class", function(d) { return "posi t" + position[d]; });

	var svg = d3.select("body").selectAll("svg")
	spins.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "spin q" + spin[d]; });
		


}
