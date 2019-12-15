const font_size = 20;
var border_color = 0;
var border_colors = ['black', 'gray'];

const canvas = document.getElementById("main-canvas");

const ctx = canvas.getContext("2d");

setup();

function setup() {
	canvas.width = 700;
	canvas.height = 600;
	canvas.color = 'blue';
	ctx.font = font_size + "px Consolas";
}

function viewTick() {
	shiftBorder();
	redraw();
}

function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#b3ffb3';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < entities.length; i++) {
		if (entities[i] !== undefined) {
			drawEntity(art[entities[i].name], entities[i].x, entities[i].y);
		}
	}
}

function drawEntity(entity, x, y) {
	for (var i = 0; i < entity[0].length; i++) {
		for (var j = 0; j < entity[0][i].length; j++) {
			ctx.fillStyle = color_key[entity[1][i][j]];
			ctx.fillText(entity[0][i][j], x + (font_size / 1.8)*j, y + font_size*i);
		}
	}
}

function shiftBorder() {
	border_color = (border_color + 1) % border_colors.length;
	canvas.style.border = '1px solid ' + border_colors[border_color];
}