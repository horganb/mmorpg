// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var nextId = 0;

const port = process.env.PORT || 300;

const tick_speed = 170;

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

var entities = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
	var id = nextId;
	playerConnect(socket, id);
	socket.on('player-move', (data) => playerMove(data, id));
	socket.on('chat', (data) => playerChat(data, id));
	socket.on('disconnect', (reason) => playerDisconnect(id));
});

setInterval(function() {
	moveStuff();
	io.sockets.emit('update', entities);
}, tick_speed);

function playerConnect(socket, id) {
	console.log('player ' + id + ' connected!');
	var playerX = 0;
	var playerY = 0;
	entities[id] = {
		name: 'player',
		id: id,
		x: playerX,
		y: playerY,
		nextX: playerX,
		nextY: playerY
	}
	socket.emit('init', id);
	nextId++;
}

function playerDisconnect(id) {
	console.log('player ' + id + ' disconnected.');
	delete entities[id];
}

function playerMove(data, id) {
	if (entities[id] && entities[id].name == 'player') {
		entities[id].nextX = entities[id].x + data.x;
		entities[id].nextY = entities[id].y + data.y;
	}
}

function moveStuff() {
	for (const id in entities) {
		if (entities[id].name == 'bob') {
			var x_y = randomNum(0, 1);
			var i_d = randomNum(-1, 1);
			if (x_y == 0) {
				entities[id].x += i_d * 5;
			} else {
				entities[id].y += i_d * 5;
			}
		} else if (entities[id].name == 'player') {
			entities[id].x = entities[id].nextX;
			entities[id].y = entities[id].nextY;
		}
	}
}

function generateWorld() {
	var bobs = randomNum(6, 12);
	for (var i = 0; i < bobs; i++) {
		var x = randomNum(-1000, 1000);
		var y = randomNum(-1000, 1000);
		entities[nextId] = {
			name: 'bob',
			x: x,
			y: y
		}
		nextId++;
	}
	var puds = randomNum(0, 5);
	for (var i = 0; i < puds; i++) {
		var x = randomNum(-1000, 1000);
		var y = randomNum(-1000, 1000);
		entities[nextId] = {
			name: 'puddle',
			x: x,
			y: y
		}
		nextId++;
	}
	var grass = randomNum(800, 1000);
	for (var i = 0; i < grass; i++) {
		var x = randomNum(-1000, 1000);
		var y = randomNum(-1000, 1000);
		entities[nextId] = {
			name: 'grass',
			x: x,
			y: y
		}
		nextId++;
	}
}

function randomNum(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

function playerChat(message, id) {
	io.sockets.emit('chat', {
		message: message, 
		id: id
	});
}





