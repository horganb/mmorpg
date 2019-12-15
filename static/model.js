var socket = io();
var entities = {};
var playerId = -1;

socket.on('init', (data) => {
	playerId = data;
	document.getElementById('chat-box').innerHTML = '<span color="red">Welcome, Player ' + playerId + '!</span>';
});

socket.on('chat', (data) => {
	console.log(data.message);
	document.getElementById('chat-box').innerHTML += '\n' + 'Player ' + data.id + ': ' + data.message;
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

