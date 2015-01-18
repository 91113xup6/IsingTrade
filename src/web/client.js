$(function () {
	var $log = $('#log');
	var log = function (message) {
		if (console && console.log) {
			console.log(message);
		}
		$log.append($('<li></li>').text(message))
	}
	var State = {
		isConnected: false,
		connected: function () {
			this.isConnected = true;
			$('#connect').attr('disabled', true);
			$('#disconnect').attr('disabled', false);
			$('#send').attr('disabled', false);
			$('#status').html("Connected");
			
		},
		
		disconnected: function () {
			this.isConnected = false;
			$('#connect').attr('disabled', false);
			$('#disconnect').attr('disabled', true);
			$('#send').attr('disabled', true);
			$('#status').html("Disconnected");
		}
	};

	var Connection = {
		socket: null,
		connect: function () {
			var socket = this.socket = new SockJS(location.protocol + '//' + location.host + '/');
			socket.onopen = function () {
				log('Connection opened');
				log('Sending: echo');
				socket.send("echo");
				State.connected();
			};
			socket.onmessage = function (e) {
				log('Recieved: ' + e.data);
			//	log(e.data);
				Change (e.data);
			}
			socket.onclose = function () {
				log('Connection closed');
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
            log("Sending: " + message)
            this.socket.send(message);
        }
	}
	var $message = $('#message')
	$('#send-form').submit(function (e) {
        Connection.send($message.val());
        e.preventDefault();
    });

    $('#connect').click(function (e) {
        Connection.connect();
        e.preventDefault();
    });

    $('#disconnect').click(function (e) {
        Connection.disconnect();
        e.preventDefault();
    });
});

function Init(){
	

	spin = [ 1.,  1.,  1.,  0.,  1.,  0.,  1.,  0.,  0.,  0.,  0.,  1.,  0.,
        1.,  0.,  1.,  1.,  0.,  0.,  1.,  0.,  1.,  0.,  0.,  0.,  1.,
        0.,  0.,  0.,  1.,  1.,  1.,  1.,  0.,  1.,  0.,  0.,  0.,  0.,
        0.,  1.,  0.,  0.,  0.,  1.,  0.,  0.,  0.,  1.,  1.,  0.,  0.,
        1.,  0.,  1.,  1.,  1.,  0.,  0.,  1.,  0.,  0.,  0.,  1.,  1.,
        0.,  1.,  1.,  0.,  0.,  1.,  0.,  1.,  0.,  0.,  1.,  1.,  1.,
        0.,  1.,  0.,  1.,  0.,  1.,  1.,  1.,  1.,  0.,  0.,  0.,  1.,
        1.,  0.,  0.,  0.,  0.,  1.,  0.,  1.,  0.];
	var position = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0]
	;
	value = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
       200, 200, 200, 200, 200, 200, 200, 200, 200]
	;
	var money = 10000;
	
	var width = 500,
		height = 500,
		cellSize = 50; // cell size

	var dialog1 = d3.select("body")
		.append("p")
		.attr("align", "center")
		// .attr("transform", "translate(0, 0)")
		.text("Money: "+money);

	var svg1 = d3.select("body").selectAll("svg")
		.data("S")
		.enter().append("svg")
		.attr("width", width+50)
		.attr("height", height)
		.attr("class", "RdYlGn")
		.append("g")
		.attr("transform", "translate(50, 0)")
		

	spins = svg1.selectAll(".spin")
		.data(d3.range(0,100))
		.enter().append("rect")
		.on("mouseenter", function(d){showinfo(d, d3.mouse(this));})
		.attr("class", "spin")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("x", function(d){return d%10*cellSize;})
		.attr("y", function(d){return Math.floor(d/10)*cellSize;});
		
	function showinfo(data, position){
//		return function (){
//			console.log(d3.mouse(this));
		svg1.append("text")
			.attr("class", "body")
			.attr("transform", "translate(" + position + ")")
			.text(value[data])
			.transition()
			.duration(1500)
			.style("opacity", 0)
			.remove();
		d3.event.preventDefault();
//		};
	}
	
	spins.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "spin q" + spin[d]; });
	
	var svg2 = d3.select("body")
		.append("svg")
		.attr("width", width+150)
		.attr("height", height)
		.attr("class", "BW")
		.append("g")
		.attr("transform", "translate(150, 0)");
		
	function purchase(data){
		if (position[data] < 9){
			money -= value[data+1];
			position[data] += 1;
			dialog1.text("Money: "+money);
			posis.filter(function(d) { return d+1; })
				.attr("class", function(d) { return "posi t" + position[d]; });
		}	
	}

	function sell(data){
		d3.event.preventDefault();
		if (position[data] > 0){
			money += value[data+1]
			position[data] -= 1;
			dialog1.text("Money: "+money);
			posis.filter(function(d) { return d+1; })
				.attr("class", function(d) { return "posi t" + position[d]; });
		}
	}
	
	var posis = svg2.selectAll(".posi")
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


function Change(data, rect){
	spin = data.split("");
	for (var i = 0; i < 100; i++)
		value[i] += eval(spin[i])*10;
	var svg = d3.select("body").selectAll("svg")
	spins.filter(function(d) { return d+1; })
		.attr("class", function(d) { return "spin q" + spin[d]; })

}
