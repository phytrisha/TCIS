var server	= require('http').Server();
var io		= require('socket.io')(server);

server.listen(8080);

io.on('connection', function (socket) {
	socket.on('time', function (data) {
		console.log(data)
		socket.broadcast.emit('time', data);
	});
});
