// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var nextPlayer = 1000;

const port = process.env.PORT || 300;

app.set('port', port);

// routing
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/reset', function(request, response) {
	entities = [];
	generateWorld();
	console.log('World reset.');
});


// start server
server.listen(port, function() {
  console.log('Starting server on port ' + port);
  generateWorld();
});

var entities = [];

var players = [];

// Add the WebSocket handlers
io.on('connection', function(socket) {
	var id = nextPlayer;
	playerConnect(socket, id);
	socket.on('player-move', (data) => playerMove(data, id));
	socket.on('disconnect', (reason) => playerDisconnect(id));
});

setInterval(function() {
	movePlayers();
	moveBob();
	io.sockets.emit('update', {
		entities: players.concat(entities)
	});
}, 200);

function playerConnect(socket, id) {
	console.log('player ' + id + ' connected!');
	var playerX = 500;
	var playerY = 500;
	players.push(
	{
		name: 'player',
		id: id,
		x: playerX,
		y: playerY,
		nextX: playerX,
		nextY: playerY
	});
	socket.emit('init', id);
	nextPlayer++;
}

function playerDisconnect(id) {
	console.log('player ' + id + ' disconnected.');
	var index = 0;
	while (players[index].id != id) {
		index++;
	}
	for (var i = index; i < players.length - 1; i++) {
		players[i] = players[i + 1];
	}
	players.pop();
}

function playerMove(data, id) {
	var index = 0;
	while (players[index].id != id) {
		index++;
	}
	if (players[index]) {
		players[index].nextX = players[index].x + data.x;
		players[index].nextY = players[index].y + data.y;
	}
}

function movePlayers() {
	players.forEach((p) => {
		p.x = p.nextX;
		p.y = p.nextY;
	});
}

function moveBob() {
	for(var i = 0; i < entities.length; i++) {
		if (entities[i].name == 'bob') {
			var x_y = randomNum(0, 1);
			var i_d = randomNum(-1, 1);
			if (x_y == 0) {
				entities[i].x += i_d * 5;
			} else {
				entities[i].y += i_d * 5;
			}
		}
	}
}

function generateWorld() {
	var bobs = randomNum(3, 6);
	for (var i = 0; i < bobs; i++) {
		var x = randomNum(50, 550);
		var y = randomNum(50, 550);
		entities.push({
			name: 'bob',
			x: x,
			y: y
		});
	}
	var puds = randomNum(0, 2);
	for (var i = 0; i < puds; i++) {
		var x = randomNum(50, 550);
		var y = randomNum(50, 550);
		entities.push({
			name: 'puddle',
			x: x,
			y: y
		});
	}
}

function randomNum(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}





