const font_size = 20;
var border_color = 0;
var border_colors = ['black', 'gray'];
var viewX = 0;
var viewY = 0;

const canvas = document.getElementById("main-canvas");
const frontCanvas = document.getElementById("front-canvas");

const ctx = canvas.getContext("2d");
const fctx = frontCanvas.getContext("2d");

$(document).ready(function(){
	// position top-left menu
	var curPos = 0;
	$('.game-menu').children().each(function() {
		$(this).css("left", curPos);
		curPos += parseInt($(this).css('width'), 10);
	});
	// position top-right menu
	curPos = 0;
	$($('.account-menu').children().get().reverse()).each(function() {
		$(this).css("right", curPos);
		curPos += parseInt($(this).css('width'), 10);
	});
});

setup();

// set GUI loop
setInterval(guiTick, 5);

function setup() {
	centerGui();
}

function viewTick() {
	updateViewport();
	redraw();
}

function guiTick() {
	fctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
	drawCharacterUI();
}

function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	land.forEach(drawLand);
	for (const id in entities) {
		if (entities[id] !== undefined && withinViewport(entities[id].x, entities[id].y)) {
			if (entities[id].name == 'player' && entities[id].skin) {
				drawEntity(entities[id].skin, entities[id].x, entities[id].y, ctx);
			} else {
				drawEntity(art[entities[id].name], entities[id].x, entities[id].y, ctx);
			}
		}
	}
	drawCharacterUI();

}

function drawLand(block) {
	ctx.fillStyle = block.color;
	ctx.fillRect(block.x1 - viewX, block.y1 - viewY, block.width, block.height);
}

function drawEntity(entity, x, y, context) {
	drawStaticEntity(entity, x - viewX, y - viewY, context);
}

function drawStaticEntity(entity, x, y, context) {
	for (var i = 0; i < entity[0].length; i++) {
		for (var j = 0; j < entity[0][i].length; j++) {
			var character = entity[0][i][j];
			context.fillStyle = color_key[entity[1][i][j]];
			context.fillText(character, x + context.measureText(character).width*j, y + font_size*i + font_size);
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
	$('#main-area').children().attr("width", window.innerWidth);
	$('#main-area').children().attr("height", window.innerHeight);
	ctx.font = font_size + "px Consolas";
	fctx.font = font_size + "px Consolas";
}

function chatBoxOutput(data) {
	var chatBox = document.getElementById('chat-box');
	chatBox.value += data + '\n';
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
		fctx.fillStyle = 'white';
		fctx.fillRect(0, 30, 160, 150);
		fctx.strokeStyle = 'black';
		fctx.lineWidth = 2;
		fctx.strokeRect(0, 30, 160, 150);
		drawStaticEntity(art.player, 60, 70, fctx);
		fctx.fillStyle = 'red';
		fctx.fillText('[<]', 20, 90);
		fctx.fillText('[>]', 100, 90);
	}
}

