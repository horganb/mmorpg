var socket = io();
var entities = [];
var id = -1;

socket.on('init', function(data) {
	console.log('I am player ' + data);
	id = data;
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
	viewTick();
});

