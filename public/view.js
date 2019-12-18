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
}

function viewTick() {
	updateViewport();
	redraw();
}

function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	land.forEach(drawLand);
	for (const id in entities) {
		if (entities[id] !== undefined && withinViewport(entities[id].x, entities[id].y)) {
			if (entities[id].name == 'player' && entities[id].skin) {
				drawEntity(entities[id].skin, entities[id].x, entities[id].y);
			} else {
				drawEntity(art[entities[id].name], entities[id].x, entities[id].y);
			}
		}
	}
	
	drawCharacterUI();
}

function drawLand(block) {
	ctx.fillStyle = block.color;
	ctx.fillRect(block.x1 - viewX, block.y1 - viewY, block.width, block.height);
}

function drawEntity(entity, x, y) {
	drawStaticEntity(entity, x - viewX, y - viewY);
}

function drawStaticEntity(entity, x, y) {
	for (var i = 0; i < entity[0].length; i++) {
		for (var j = 0; j < entity[0][i].length; j++) {
			var character = entity[0][i][j];
			ctx.fillStyle = color_key[entity[1][i][j]];
			ctx.fillText(character, x + ctx.measureText(character).width*j, y + font_size*i + font_size);
		}
	}
}

function updateViewport() {
	newViewX = entities[playerId].x - (canvas.width / 2);
	newViewY = entities[playerId].y - (canvas.height / 2);
	if (bounds.left <= newViewX && newViewX <= bounds.right - canvas.width) {
		viewX = newViewX;
	}
	if (bounds.upper <= newViewY && newViewY <= bounds.lower - canvas.height) {
		viewY = newViewY;
	}
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

function withinViewport(x, y) {
	return viewX - 100 <= x && x <= viewX + canvas.width && viewY - 100 <= y && y <= viewY + canvas.height;
}

function drawUI() {
	drawCharacterUI();
}

function drawCharacterUI() {
	if ($('#character').is(':visible')) {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 30, 160, 150);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 30, 160, 150);
		drawStaticEntity(entities[playerId].skin, 60, 70);
		ctx.fillStyle = 'red';
		ctx.fillText('[<]', 20, 90);
		ctx.fillText('[>]', 100, 90);
	}
}

