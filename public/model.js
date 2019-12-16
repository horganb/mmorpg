var socket = io();
var entities = {};
var playerId = -1;
var land = [];
var date = new Date();
var ping = date.getTime();

socket.on('init', (data) => {
	playerId = data;
	chatBoxOutput('Welcome, Player ' + playerId + '!');
	updateSkin(art.player);
});

socket.on('map', (data) => {
	land = data;
});

socket.on('chat', (data) => {
	chatBoxOutput('\n' + 'Player ' + data.id + ': ' + data.message);
});

socket.on('player-connect', (data) => {
	chatBoxOutput('\n' + 'Player ' + data + ' has joined.');
});

socket.on('player-disconnect', (data) => {
	chatBoxOutput('\n' + 'Player ' + data + ' has left.');
});

socket.on('update', (data) => {
	for (const id in data[0]) {
		entities[id] = data[0][id];
	}
	data[1].forEach((id) => {delete entities[id];});
	//date = new Date();
	//ping = date.getTime();
	viewTick();
	//date = new Date();
	//console.log('draw: ' + (date.getTime() - ping));
	
	// MAKE DRAWING MORE EFFICIENT
});

socket.on('reset', (data) => {
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

function deleteEntity(id) {
	if (entities[id].name == 'grass') {
		socket.emit('delete-entity', id);
	}
}

function createEntity(name, x, y) {
	socket.emit('create-entity', {name: name, x: x, y: y});
}

function updateSkin(skin) {
	socket.emit('update-skin', skin);
}

