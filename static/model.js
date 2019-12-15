//var charLoc = [10, 20];
//var player = -1;
var socket = io();
var entities = [];

socket.on('init', function(data) {
	//charLoc = [data.x, data.y];
	//player = data;
	console.log('I am player ' + data);
});

function moveUp() {
	socket.emit('player-move', { 
		x: 0,
		y: -20
	});
}

function moveDown() {
	socket.emit('player-move', {
		x: 0,
		y: 20
	});
}

function moveLeft() {
	socket.emit('player-move', { 
		x: -20, 
		y: 0
	});
}

function moveRight() {
	socket.emit('player-move', { 
		x: 20, 
		y: 0
	});
}

function clearMove() {
	socket.emit('player-move', {
		x: 0,
		y: 0
	});
}

socket.on('update', function(data) {
	entities = data.entities;
	//charLoc = [entities[player].x, entities[player].y];
	viewTick();
});

