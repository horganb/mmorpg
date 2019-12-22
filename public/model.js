const move_speed = 20;

var socket = io();
var entities = {};
var playerId = -1;
var land = [];
var drawDate = new Date();
var serverDate = new Date();
var drawPing = drawDate.getTime();
var serverPing = drawDate.getTime();
var bounds;
var playerHead = 0;

var lifeEssence = 0;
var gold = 0;

socket.on('init', (data) => {
	playerId = data[0];
	bounds = data[1];
	chatBoxOutput('Welcome, Player ' + playerId + '!');
	sendSkin();
	updateInventory();
});

socket.on('map', (data) => {
	land = data;
});

socket.on('chat', (data) => {
	chatBoxOutput(data.id + ': ' + data.message);
});

socket.on('player-connect', (data) => {
	chatBoxOutput('Player ' + data + ' has joined.');
});

socket.on('player-disconnect', (data) => {
	chatBoxOutput(data + ' has left.');
});

socket.on('load', (data) => {
	playerHead = heads.indexOf(data.data.skin[0][0][1]);
	changeHead(heads[playerHead]);
	lifeEssence = data.lifeEssence;
	gold = data.gold;
	updateInventory();
});

socket.on('logged-in', (data) => {
	$('.account-menu').hide();
	$('.right-menu').hide();
});

socket.on('username-taken', (data) => {
	$('#create-error').html('Username unavailable.');
});

socket.on('login-not-found', (data) => {
	$('#login-error').html('Username or password incorrect.');
});


socket.on('update', (data) => {
	for (const id in data[0]) {
		entities[id] = data[0][id];
	}
	data[1].forEach((id) => {delete entities[id];});
	//drawDate = new Date();
	//drawPing = drawDate.getTime();
	viewTick();
	//drawDate = new Date();
	//console.log('draw: ' + (drawDate.getTime() - drawPing));
});

socket.on('reset', (data) => {
	entities = data;
	viewTick();
});

function moveUp() {
	socket.emit('player-move', {
		x: 0,
		y: -move_speed
	});
}

function moveDown() {
	socket.emit('player-move', {
		x: 0,
		y: move_speed
	});
}

function moveLeft() {
	socket.emit('player-move', { 
		x: -move_speed, 
		y: 0
	});
}

function moveRight() {
	socket.emit('player-move', {
		x: move_speed, 
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
		lifeEssence++;
		updateInventory();
		socket.emit('delete-entity', id);
		socket.emit('update', {lifeEssence: lifeEssence});
	}
}

function createEntity(name, x, y) {
	if (lifeEssence > 0) {
		lifeEssence--;
		updateInventory();
		socket.emit('create-entity', {name: name, x: x, y: y});
	}
}

function updateInventory() {
	document.getElementById('inventory').value = 'Gold: ' + gold + '\nLife Essence: ' + lifeEssence;
}

function changeHead(head) {
	art.player[0][0] = art.player[0][0][0] + head + art.player[0][0][2];
	sendSkin();
}

function sendSkin() {
	socket.emit('update-skin', art.player);
}

function createAccount(user, pass) {
	socket.emit('create-account', getAccountInfo(user, pass));
}

function login(user, pass) {
	socket.emit('login', getAccountInfo(user, pass));
}

function getAccountInfo(user, pass) {
	return {
		username: user,
		password: pass,
		lifeEssence: lifeEssence,
		gold: gold,
		data: entities[playerId]
	};
}

