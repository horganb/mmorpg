const move_keys = [87, 83, 65, 68];

var keys_pressed = [];
var chatSelected = false;

window.onkeydown = keyPressed;
window.onkeyup = keyReleased;
window.onmousedown = mouseDown;
window.onblur = windowBlur;

window.focus();

$('.side-menu').hide();
toggleUI('chat');

const buttonMap = {
	'toggle-chat' : 'chat',
	'toggle-inventory' : 'inventory',
	'toggle-character' : 'character'
}

$(document).ready(function(){
	$('button').click(function() {
		$(this).blur(); 
		toggleUI(buttonMap[$(this).attr('id')]);
	});
});


function keyPressed(e) {
	if (e.keyCode == 13 && $('#chat').is(':visible')) {
		var chat = document.getElementById('chat-input');
		if (chatSelected) {
			chat.blur();
			sendChat(chat.value);
			chat.value = '';
		} else {
			chat.focus();
		}
	}
	
	if (chatSelected) {
		return;
	}
	
	if ((keys_pressed.length == 0 || keys_pressed[0] != e.keyCode) && move_keys.includes(e.keyCode)) {
		keys_pressed.unshift(e.keyCode);
		checkMoves();
	} else if (e.keyCode == 67) {
		toggleUI('chat');
	} else if (e.keyCode == 73) {
		toggleUI('inventory');
	} else if (e.keyCode == 80) {
		toggleUI('character');
	} else if (e.keyCode == 27) {
		hideAll();
	} else if (e.keyCode == 37 && $('#character').is(':visible')) {
		if (playerHead == 0) {
			playerHead = heads.length - 1;
		}
		playerHead = (playerHead - 1) % heads.length;
		changeHead(heads[playerHead]);
	} else if (e.keyCode == 39 && $('#character').is(':visible')) {
		playerHead = (playerHead + 1) % heads.length;
		changeHead(heads[playerHead]);
	}
}

function keyReleased(e) {
	keys_pressed = keys_pressed.filter((k) => k != e.keyCode);
	if (keys_pressed.length > 0) {
		checkMoves();
	} else {
		clearMove();
	}
}

function checkMoves() {
	if (!chatSelected) {
		switch (keys_pressed[0]) {
			case 87:
				moveUp();
				break;
			case 83:
				moveDown();
				break;
			case 65:
				moveLeft();
				break;
			case 68:
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
	keys_pressed = [];
	clearMove();
}

function toggleUI(ui) {
	var el = $('#' + ui);
	if (el.is(':visible')) {
		el.toggle();
	} else {
		$('.side-menu').hide();
		el.toggle();
		drawUI();
	}
}









