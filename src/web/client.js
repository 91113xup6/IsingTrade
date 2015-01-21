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
	
	value = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
			 200, 200, 200, 200, 200, 200, 200, 200, 200];
	
	money = 100000;
	
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
		.text("all out");
	
	// $('.stg').fancySelect();
	var teamtext = d3.select("body")
		.append("h1")
		.attr("class", "fontawesome-user")
		.attr("align", "center")
		.text($_GET["team"]);

	
	moneytext = d3.select("body")
		.append("h1")
		.attr("align", "center")
		// .attr("transform", "translate(0, 0)")
		.text("Money: "+money);

	svg1 = d3.select("body").selectAll("svg")
		.data("S")
		.enter().append("svg")
		.attr("width", width+50)
		.attr("height", height+50)
		.attr("class", "RdYlGn")
		.append("g")
		.attr("transform", "translate(50, 50)");

	spins = svg1.selectAll(".spin")
		.data(d3.range(0,100))
		.enter().append("rect")
		.on("mouseenter", function(d){/*exaggerate(d);*/
			// showinfo(d, d3.mouse(this));
			showinfo(d, [d%10*(cellSize), Math.floor(d/10)*(cellSize)+30] );
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
		.attr("transform", "translate(150, 50)");
	
	posis = svg2.selectAll(".posi")
		.data(d3.range(0,100))
		.enter().append("rect")
		.attr("class", "posi")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("x", function(d){return d%10*cellSize;})
		.attr("y", function(d){return Math.floor(d/10)*cellSize;})
		.on("click", function(d){purchase(d);})
		.on("contextmenu", function(d){sell(d);	d3.event.preventDefault();});
	
	posis.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "posi t" + position[d]; });
	
	d3.select(self.frameElement).style("height", "2910px");

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
	svg1.append("text")
		.attr("class", "body")
		.attr("transform", "translate(" + position + ")")
		.text(value[data])
		.attr("pointer-events", "none")
		.transition()
		.duration(1500)
		.style("font-size", "xx-large")
		.remove()
}

function purchase(data){
	if (position[data] < 9 && money>=value[data+1]){
		money -= value[data+1];
		position[data] += 1;
		moneytext.text("Money: "+money);
		posis.filter(function(d) { return d+1; })
			.attr("class", function(d) { return "posi t" + position[d]; });
	}	
}

function sell(data){

	if (position[data] > 0){
		money += value[data+1]
		position[data] -= 1;
		moneytext.text("Money: "+money);
		posis.filter(function(d) { return d+1; })
			.attr("class", function(d) { return "posi t" + position[d]; });
	}
}


function Change(data, rect){

	spin = data.split("");
	for (var i = 0; i < 100; i++){
		value[i] += eval(spin[i])*20-10;
		if(value[i]<0)
			value[i]=0;
		if (sta){
			if (position[i]>0 && spin[i] == '1'){
				sell(i);
			}
			if (spin[i] == '0'){
				if(money>value[i])
					purchase(i);
			}
		}
		if (stb){
			if (spin[i]=='1'){
				if(money>value[i])
					purchase(i);
			}
			if (spin[i]=='0'){
				if(position[i] > 0)
					sell(i);
			}
		}
	}
	posis.filter(function(d) { return d+1; })
			.attr("class", function(d) { return "posi t" + position[d]; });

	var svg = d3.select("body").selectAll("svg")
	spins.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "spin q" + spin[d]; })


}
