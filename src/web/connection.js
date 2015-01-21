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
				State.connected();
			};
			socket.onmessage = function (e) {
				console.log('Recieved: ' + e.data);
				// log(e.data);
				Change (e.data);
			}
			socket.onclose = function () {
				console.log('Connection closed');
				// socket.send("DISCONNECT");
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


