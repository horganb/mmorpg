var keys_pressed = [];
var chatSelected = false;

window.addEventListener('keydown', keyPressed);
window.addEventListener('keyup', keyReleased);

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









