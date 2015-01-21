function Init(){
//	Connection.connect();
	var parts = window.location.search.substr(1).split("&");
	var $_GET = {};
	for (var i = 0; i < parts.length; i++) {
		var temp = parts[i].split("=");
		$_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
	}

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
	
	money = 10000;
	
	var width = 500,
		height = 500,
		cellSize = 50;
	var upPanel = d3.select("body").append("div")
	 	.style("height", 40+"px");

	upPanel.selectAll("button")
		.data(["connect", "disconnect"])
		.enter()
		.append("button")
		.on("click", function(d){switch(d){ case "connect":console.log("connect");
											case "disconnect":Connection.disconnect();
										  };
								})
		.attr("id", function(d){return d;})
		.text(function(d){return d;});
	// .attr("disabled", function(d){switch(d){case "connect": return "false";
		// 										case "disconnect": return "true";
		// 									   };
		// 							 })
		
	var strategy_select = upPanel.append("select")
		.attr("name", "strategy");
	//	.attr("class", "stg");

	
	strategy_select.selectAll("option")
		.data(["Select Strategy", "A", "B", "C"])
		.enter()
		.append("option")
		.attr("value", function(){})
		.text(function(d){return d;});
	
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
		.attr("width", width+150)
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
		.on("click", function(d){purchase(d);})
		.on("contextmenu", function(d){sell(d);});
	
	posis.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "posi t" + position[d]; });
	
	d3.select(self.frameElement).style("height", "2910px");

}

// function exaggerate(data){
// 	posis.selectAll(d)
// 		.filter(); //TODO
// }

function showinfo(data, position){
	svg1.append("text")
		.attr("class", "body")
		.attr("transform", "translate(" + position + ")")
		.text(value[data])
		.transition()
		.duration(1500)
		.style("font-size", "xx-large")
		.remove();
	d3.event.preventDefault();
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
	d3.event.preventDefault();
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
	for (var i = 0; i < 100; i++)
		value[i] += eval(spin[i])*20-10;
	var svg = d3.select("body").selectAll("svg")
	spins.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "spin q" + spin[d]; })

}

//$(function () {
	// var $log = $('#log');
	// var log = function (message) {
	// 	if (console && console.log) {
	// 		console.log(message);
	// 	}
	// 	$log.append($('<li></li>').text(message))
	// }
	var State = {
		isConnected: false,
		connected: function () {
			this.isConnected = true;
			d3.selectAll("#connect").attr("disabled", true);
			d3.selectAll("#disconnect").attr("disabled", false);
			// $('#connect').attr('disabled', true);
			// $('#disconnect').attr('disabled', false);
			// $('#send').attr('disabled', false);
			// $('#status').html("Connected");
			
		},
		
		disconnected: function () {
			this.isConnected = false;
			d3.selectAll("#connect").attr("disabled", false);
			d3.selectAll("#disconnect").attr("disabled", true);
			// $('#connect').attr('disabled', false);
			// $('#disconnect').attr('disabled', true);
			// $('#send').attr('disabled', true);
			// $('#status').html("Disconnected");
		}
	};

	var Connection = {
		socket: null,
		connect: function () {
			var socket = this.socket = new SockJS(location.protocol + '//' + location.host + '/');
			socket.onopen = function () {
				// log('Connection opened');
				// log('Sending: echo');
				socket.send("echo");
				State.connected();
			};
			socket.onmessage = function (e) {
				// log('Recieved: ' + e.data);
				// log(e.data);
				Change (e.data);
			}
			socket.onclose = function () {
				// log('Connection closed');
				State.disconnected();
			}
		},
		disconnect: function () {
			if (this.socket) {
				this.socket.close()
				this.socket = null;
			}
		},
		send: function (message) {
            // log("Sending: " + message)
            this.socket.send(message);
        }
	};
		var $message = $('#message');
	// $('#send-form').submit(function (e) {
    //     Connection.send($message.val());
    //     e.preventDefault();
    // });

    // $('#connect').click(function (e) {
    //     Connection.connect();
    //     e.preventDefault();
    // });

    // $('#disconnect').click(function (e) {
    //     Connection.disconnect();
    //     e.preventDefault();
    // });

	// $('#sta').click(function(e){
	// 	Strategy('a');
	// });
//	});
