var keys_pressed = [];

window.addEventListener('keydown', keyPressed);
window.addEventListener('keyup', keyReleased);

setInterval(checkMoves, 2);

function keyPressed(e) {
	keys_pressed.unshift(e.code);
}

function keyReleased(e) {
	keys_pressed = keys_pressed.filter((k) => k != e.code);
}

function checkMoves() {
	if (keys_pressed.length > 0) {
		switch (keys_pressed[0]) {
			case 'KeyW':
				moveUp();
				break;
			case 'KeyS':
				moveDown();
				break;
			case 'KeyA':
				moveLeft();
				break;
			case 'KeyD':
				moveRight();
				break;
		}
	} else {
		clearMove();
	}
}









