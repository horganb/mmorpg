// constants

const port = process.env.PORT || 300;
const tick_speed = 170;

// globals

var entities = {};
var nextId = 0;

// dependencies

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// setup

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', port);
app.use(express.static(__dirname + '/public'));

// start server
server.listen(port, function() {
  console.log('Starting server on port ' + port);
  generateWorld();
});

// player connection handler
io.on('connection', function(socket) {
	var id = nextId;
	playerConnect(socket, id);
	socket.on('player-move', (data) => playerMove(data, id));
	socket.on('chat', (data) => playerChat(data, id));
	socket.on('delete-entity', (data) => deleteEntity(data, id));
	socket.on('create-entity', (data) => createEntity(data, id));
	socket.on('disconnect', (reason) => playerDisconnect(id));
});

// set loop
setInterval(function() {
	moveStuff();
	io.sockets.emit('update', entities);
}, tick_speed);

// reset handler
app.get('/reset', resetWorld);

// helpers

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
	io.sockets.emit('player-connect', id);
}

function playerDisconnect(id) {
	console.log('player ' + id + ' disconnected.');
	delete entities[id];
	io.sockets.emit('player-disconnect', id);
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
	if (message == '/reset') {
		resetWorld();
	} else {
		io.sockets.emit('chat', {
			message: message, 
			id: id
		});
	}
}

function deleteEntity(itemId, playerId) {
	delete entities[itemId];
}

function createEntity(entity, playerId) {
	entities[nextId] = entity;
	nextId++;
}

function resetWorld() {
	var newEntities = {};
	for (const id in entities) {
		if (entities[id].name == 'player') {
			newEntities[id] = entities[id];
		}
	}
	entities = newEntities;
	var temp = nextId;
	nextId = 0;
	generateWorld();
	nextId = temp;
	console.log('World reset.');
}







