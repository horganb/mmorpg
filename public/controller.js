var keys_pressed = [];
var chatSelected = false;

window.onkeydown = keyPressed;
window.onkeyup = keyReleased;
window.onmousedown = mouseDown;

setInterval(checkMoves, 2);

function keyPressed(e) {
	keys_pressed.unshift(e.code);
	
	if (e.code == 'Enter') {
		var chat = document.getElementById('chat-input');
		if (chatSelected) {
			chat.blur();
			sendChat(chat.value);
			chat.value = '';
		} else {
			chat.focus();
		}
	}
}

function keyReleased(e) {
	keys_pressed = keys_pressed.filter((k) => k != e.code);
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

function checkMoves() {
	if (keys_pressed.length > 0 && !chatSelected) {
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









