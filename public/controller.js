const move_keys = ['KeyW', 'KeyS', 'KeyA', 'KeyD'];

var keys_pressed = [];
var chatSelected = false;

window.onkeydown = keyPressed;
window.onkeyup = keyReleased;
window.onmousedown = mouseDown;
window.onblur = windowBlur;

function keyPressed(e) {
	if ((keys_pressed.length == 0 || keys_pressed[0] != e.code) && move_keys.includes(e.code)) {
		keys_pressed.unshift(e.code);
		checkMoves();
	}
	
	if (e.code == 'Enter') {
		var chat = document.getElementById('chat-input');
		if (chatSelected) {
			chat.blur();
			sendChat(chat.value);
			chat.value = '';
		} else {
			chat.focus();
		}
	} else if (e.shiftKey && e.key != 'Shift') {
		art.player[0][0] = art.player[0][0][0] + e.key[0] + art.player[0][0][2];
		updateSkin(art.player);
	}
}

function keyReleased(e) {
	keys_pressed = keys_pressed.filter((k) => k != e.code);
	if (keys_pressed.length > 0) {
		checkMoves();
	} else {
		clearMove();
	}
}

function checkMoves() {
	if (!chatSelected) {
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
	}
}

function mouseDown(e) {
	var adjX = e.clientX + viewX;
	var adjY = e.clientY + viewY;
	if (e.button == 0) {
		if (e.shiftKey) {
			createEntity('grass', adjX, adjY);
		} else {
			for (const id in entities) {
				if (entities[id] !== undefined && entityClicked(entities[id], adjX, adjY)) {
					deleteEntity(id);
				}
			}
		}
	}
}

function toggleChat() {
	var chat = document.getElementById('chat');
	if (chat.style.visibility == 'visible') {
		chat.style.visibility = 'hidden';
	} else {
		chat.style.visibility = 'visible';
	}
}

function chatFocused() {
	chatSelected = true;
	clearMove();
}

function chatBlurred() {
	chatSelected = false;
}

function entityClicked(entity, mouseX, mouseY) {
	return clickInPlayerRange(100, mouseX, mouseY) && Math.abs(entity.x - mouseX) < 15 && Math.abs(entity.y - mouseY) < 15;
}

function clickInPlayerRange(range, mouseX, mouseY) {
	return entities[playerId].x - range <= mouseX && mouseX <= entities[playerId].x + range && entities[playerId].y - range <= mouseY && mouseY <= entities[playerId].y + range;
}

function windowBlur() {
	console.log('blurred');
	keys_pressed = [];
	clearMove();
}









