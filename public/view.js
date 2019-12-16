const font_size = 20;
var border_color = 0;
var border_colors = ['black', 'gray'];
var viewX = 0;
var viewY = 0;

const canvas = document.getElementById("main-canvas");

const ctx = canvas.getContext("2d");

setup();

function setup() {
	centerGui();
	canvas.color = 'blue';
	document.getElementById('chat').style.visibility = 'visible';
	var chatBox = document.getElementById('chat-box');
	chatBox.scrollTop = chatBox.scrollHeight;
}

function viewTick() {
	updateViewport();
	redraw();
}

function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#b3ffb3';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (const id in entities) {
		if (entities[id] !== undefined) {
			if (entities[id].name == 'player' && entities[id].skin) {
				drawEntity(entities[id].skin, entities[id].x, entities[id].y);
			} else {
				drawEntity(art[entities[id].name], entities[id].x, entities[id].y);
			}
		}
	}
}

function drawEntity(entity, x, y) {
	for (var i = 0; i < entity[0].length; i++) {
		for (var j = 0; j < entity[0][i].length; j++) {
			ctx.fillStyle = color_key[entity[1][i][j]];
			ctx.fillText(entity[0][i][j], x + (font_size / 1.8)*j - viewX, y + font_size*i - viewY + font_size);
		}
	}
}

function updateViewport() {
	viewX = entities[playerId].x - (canvas.width / 2);
	viewY = entities[playerId].y - (canvas.height / 2);
}

function centerGui() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.font = font_size + "px Consolas";
}

function chatBoxOutput(data) {
	var chatBox = document.getElementById('chat-box');
	chatBox.value += data;
	chatBox.scrollTop = chatBox.scrollHeight;
}



