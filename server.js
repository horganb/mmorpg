// constants

const port = process.env.PORT || 300;
const tick_speed = 120;

// globals

var entities = {};
var movableEntities = {};
var updatedEntities = {};
var deletedEntities = [];
var land = [];
var nextId = 0;
var bounds = {left: -8000, right: 8000, upper: -8000, lower: 8000};

var serverDate = new Date();
var serverPing = serverDate.getTime();

var db;

// dependencies

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const worldGen = require('./public/world_generator');

// setup

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const MongoClient = require('mongodb').MongoClient;
const mongo_url = process.env.MONGODB_URI || "mongodb://localhost:27017/";

app.set('port', port);
app.use(express.static(__dirname + '/public'));

// start server
server.listen(port, function() {
  console.log('Starting server on port ' + port);
  generateWorld();
});

// connect database
MongoClient.connect(mongo_url, function(err, client) {
  if (err) throw err;
  console.log('Connected to database: ' + mongo_url);
  db = client.db();
});

// player connection handler
io.on('connection', function(socket) {
	var id = nextId;
	var userEntry = {};
	
	playerConnect(socket, id);
	
	socket.on('player-move', (data) => playerMove(data, id));
	socket.on('chat', (data) => playerChat(data, userEntry.username || ('Player ' + id), id));
	socket.on('delete-entity', (data) => deleteEntity(data, id));
	socket.on('create-entity', (data) => createEntity(data, id));
	socket.on('update-skin', (data) => updateSkin(data, id));
	socket.on('disconnect', (reason) => playerDisconnect(id, userEntry));
	socket.on('create-account', (data) => createAccount(data, id, socket, userEntry));
	socket.on('login', (data) => login(data, id, socket, userEntry));
	socket.on('update', (data) => updateEntry(data, id, socket, userEntry));
});

// set loop
setInterval(function() {
	//serverDate = new Date();
	//serverPing = serverDate.getTime();
	
	moveStuff();
	io.sockets.emit('update', [updatedEntities, deletedEntities]);
	updatedEntities = {};
	deletedEntities = [];	
	
	//serverDate = new Date();
	//console.log('server: ' + (serverDate.getTime() - serverPing));
}, tick_speed);

// reset handler
app.get('/reset', resetWorld);

// helpers

function playerConnect(socket, id) {
	console.log('player ' + id + ' connected!');
	var playerX = 0;
	var playerY = 0;
	var person = {
		name: 'player',
		idd: id,
		x: playerX,
		y: playerY,
		nextX: 0,
		nextY: 0
	}
	entities[id] = person;
	movableEntities[id] = person;
	updatedEntities[id] = entities[id];
	socket.emit('init', [id, bounds]);
	socket.emit('map', land);
	socket.emit('reset', entities);
	nextId++;
	io.sockets.emit('player-connect', id);
}

function playerDisconnect(id, userEntry) {
	if (userEntry.username) {
		var query = {username: userEntry.username};
		var newValues = { $set: userEntry };
		db.collection("players").updateOne(query, newValues, function(err, res) {
			if (err) throw err;
		});		
	}
	console.log('player ' + id + ' disconnected.');
	deletedEntities.push(id);
	delete entities[id];
	delete movableEntities[id];
	io.sockets.emit('player-disconnect', (userEntry.username || ('Player ' + id)));
}

function playerMove(data, id) {
	if (entities[id] && entities[id].name == 'player') {
		entities[id].nextX = data.x;
		entities[id].nextY = data.y;
	}
}

function moveStuff() {
	for (const id in movableEntities) {
		if (entities[id].name == 'bob') {
			var x_y = randomNum(0, 1);
			var i_d = randomNum(-1, 1);
			if (x_y == 0) {
				moveEntity(entities[id], i_d * 5, 0)
			} else {
				moveEntity(entities[id], 0, i_d * 5);
			}
			updatedEntities[id] = entities[id];
		} else if (entities[id].name == 'player') {
			moveEntity(entities[id], entities[id].nextX, entities[id].nextY);
			if (entities[id].nextX != 0 || entities[id].nextY != 0) {
				updatedEntities[id] = entities[id];
			}
		}
	}
}

function generateWorld() {
	nextId = worldGen.generateWorld(nextId, entities, movableEntities, land);
}

function randomNum(min, max) {
	return worldGen.randomNum(min, max);
}

function playerChat(message, user, id) {
	if (message == '/reset') {
		resetWorld();
	} else {
		io.sockets.emit('chat', {
			message: message,
			id: user
		});
	}
}

function deleteEntity(itemId, playerId) {
	deletedEntities.push(itemId);
	delete entities[itemId];
	delete movableEntities[itemId];
}

function createEntity(entity, playerId) {
	entities[nextId] = entity;
	updatedEntities[nextId] = entities[nextId];
	nextId++;
}

function resetWorld() {
	var newEntities = {};
	var theId;
	for (const id in entities) {
		if (entities[id].name == 'player') {
			theId = id;
			newEntities[id] = entities[id];
		}
	}
	entities = newEntities;
	movableEntities = newEntities;
	land = [];
	generateWorld();
	io.sockets.emit('reset', entities);
	io.sockets.emit('map', land);
	console.log('World reset.');
}

function updateSkin(skin, playerId) {
	entities[playerId].skin = skin;
	updatedEntities[playerId] = entities[playerId];
}

function moveEntity(ent, moveX, moveY) {
	if (ent.y + moveY > bounds.upper && ent.y + moveY < bounds.lower) {
		ent.y += moveY;
	}
	if (ent.x + moveX > bounds.left && ent.x + moveX < bounds.right) {
		ent.x += moveX;
	}
}

function createAccount(data, id, socket, userEntry) {
	var query = { username: data.username };
	db.collection("players").findOne(query, function(err, result) {
		if (err) throw err;
		if (result) {
			socket.emit('username-taken', data.user);
		} else {
			for (const prop in data) {
				userEntry[prop] = data[prop]
			}
			db.collection("players").insertOne(userEntry, function(err, res) {
				if (err) throw err;
				socket.emit('logged-in', data.username);
				console.log('User ' + data.username + ' created!');
			});
		}
	});
}

function login(data, id, socket, userEntry) {
	var query = { username: data.username, password: data.password };
	db.collection("players").findOne(query, function(err, result) {
		if (err) throw err;
		if (result) {
			console.log('User ' + data.username + ' logged in!');
			for (const prop in result) {
				userEntry[prop] = result[prop]
			}
			var res = result.data;
			entities[id] = res;
			movableEntities[id] = res;
			updatedEntities[id] = res;
			socket.emit('load', result);
			socket.emit('logged-in', data.username);
		} else {
			socket.emit('login-not-found', data.username);
		}
	});
}

function updateEntry(data, id, socket, userEntry) {
	if (userEntry.username) {
		Object.assign(userEntry, data);
	}
}







