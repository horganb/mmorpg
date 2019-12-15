var socket = io();
var entities = {};
var playerId = -1;

socket.on('init', (data) => {
	playerId = data;
	document.getElementById('chat-box').innerHTML = 'Welcome, Player ' + playerId + '!';
});

socket.on('chat', (data) => {
	document.getElementById('chat-box').innerHTML += '\n' + 'Player ' + data.id + ': ' + data.message;
});

socket.on('player-connect', (data) => {
	document.getElementById('chat-box').innerHTML += '\n' + 'Player ' + data + ' has joined.';
});

socket.on('player-disconnect', (data) => {
	document.getElementById('chat-box').innerHTML += '\n' + 'Player ' + data + ' has left.';
});

socket.on('update', (data) => {
	entities = data;
	viewTick();
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

function sendChat(message) {
	socket.emit('chat', message);
}

