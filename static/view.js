const font_size = 20;
const canvas_width = 700;
const canvas_height = 600;
var border_color = 0;
var border_colors = ['black', 'gray'];
var viewX = 0;
var viewY = 0;

const canvas = document.getElementById("main-canvas");

const ctx = canvas.getContext("2d");

setup();

function setup() {
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	canvas.color = 'blue';
	ctx.font = font_size + "px Consolas";
	var chatBox = document.getElementById('chat-box');
	chatBox.scrollTop = chatBox.scrollHeight;
}

function viewTick() {
	updateViewport();
	shiftBorder();
	redraw();
}

function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#b3ffb3';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (const id in entities) {
		if (entities[id] !== undefined) {
			drawEntity(art[entities[id].name], entities[id].x, entities[id].y);
		}
	}
}

function drawEntity(entity, x, y) {
	for (var i = 0; i < entity[0].length; i++) {
		for (var j = 0; j < entity[0][i].length; j++) {
			ctx.fillStyle = color_key[entity[1][i][j]];
			ctx.fillText(entity[0][i][j], x + (font_size / 1.8)*j - viewX, y + font_size*i - viewY);
		}
	}
}

function shiftBorder() {
	border_color = (border_color + 1) % border_colors.length;
	canvas.style.border = '1px solid ' + border_colors[border_color];
}

function updateViewport() {
	viewX = entities[playerId].x - (canvas_width / 2);
	viewY = entities[playerId].y - (canvas_height / 2);
}



