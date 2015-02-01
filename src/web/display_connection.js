$(function () {
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
			// d3.selectAll("#connect").attr("disabled", true);
			// d3.selectAll("#disconnect").attr("disabled", false);
			// $('#connect').attr('disabled', true);
			// $('#disconnect').attr('disabled', false);
			// $('#send').attr('disabled', false);
			// $('#status').html("Connected");
			
		},
		
		disconnected: function () {
			this.isConnected = false;
			// d3.selectAll("#connect").attr("disabled", false);
			// d3.selectAll("#disconnect").attr("disabled", true);
			// $('#connect').attr('disabled', false);
			// $('#disconnect').attr('disabled', true);
			// $('#send').attr('disabled', true);
			// $('#status').html("Disconnected");
		}
	};

	Connection = {
		socket: null,
		connect: function () {
			console.log('in connect function.');
			var socket = this.socket = new SockJS(location.protocol + '//' + location.host + '/');
			console.log(socket);
			socket.onopen = function () {
				console.log('Connection opened');
				console.log('Sending: echo');
				socket.send("echo");
				socket.send("disp");
				State.connected();
			};
			socket.onmessage = function (e) {
				console.log('Recieved: ' + e.data);
				// log(e.data);
				// Change(e.data);
				if(e.data[0] == 'm'){
					tmp = e.data.substr(1).split(',');
					money = [eval(tmp[0]), eval(tmp[1])];
					moneytext0.text(money[0]);
					moneytext1.text(money[1]);
				} else{
					Change(e.data.substring(0, 100), e.data.substring(100) );
				}
			}
			socket.onclose = function () {
				console.log('Connection closed');
				//socket.send("ddis");
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
            console.log("Sending: " + message)
            this.socket.send(message);
        }
	};
	//	var $message = $('#message');
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
	// Connection.connect();
});


