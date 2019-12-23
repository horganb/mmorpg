const move_keys = [87, 83, 65, 68];

var keys_pressed = [];
var chatSelected = false;

window.onkeydown = keyPressed;
window.onkeyup = keyReleased;
window.onmousedown = mouseDown;
window.onblur = windowBlur;

window.focus();

$(document).ready(function(){
	$('.side-menu').hide();
	$('.right-menu').hide();
	//toggleUI('chat');
	$('button').click(function() {
		$(this).blur();
	});
	$('.game-menu').children().click(function() {
		toggleUI($(this).attr('data-menu'));
	});
	$('.account-menu').children().click(function() {
		toggleAccountUI($(this).attr('data-menu'));
	});
	$('input').focus(function() {
		clearMove();
	});
	$('#create-button').click(function() {
		handleCreateAccount($('#create-user').val(), $('#create-password').val(), $('#create-conf-password').val());
		$(this).blur();
	});
	$('#login-button').click(function() {
		handleLogin($('#login-user').val(), $('#login-password').val());
		$(this).blur();
	});
	//document.getElementById('audio-1').play();
	
});


function keyPressed(e) {
	if (e.keyCode == 13) {
		if ($('#chat').is(':visible')) {
			var chat = document.getElementById('chat-input');
			if ($('#chat-input').is(':focus')) {
				chat.blur();
				if (chat.value != '') {
					sendChat(chat.value);
				}
				chat.value = '';
			} else {
				chat.focus();
			}
		} else if ($('#create-conf-password').is(':focus')) {
			handleCreateAccount($('#create-user').val(), $('#create-password').val(), $('#create-conf-password').val());
			$('#create-conf-password').blur();
		} else if ($('#login-password').is(':focus')) {
			handleLogin($('#login-user').val(), $('#login-password').val());
			$('#login-password').blur();
		}
	}
	
	if ($('input').is(':focus')) {
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
		$('.side-menu').hide();
	} else if (e.keyCode == 37 && $('#character').is(':visible')) {
		if (playerHead == 0) {
			playerHead = heads.length;
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
	if (!$('input').is(':focus')) {
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
	$('#audio-2')[0].currentTime = 0;
	$('#audio-2')[0].play();
	var el = $('#' + ui);
	if (el.is(':visible')) {
		el.toggle();
	} else {
		$('.side-menu').hide();
		el.toggle();
	}
}

function toggleAccountUI(ui) {
	var el = $('#' + ui);
	if (el.is(':visible')) {
		el.toggle();
	} else {
		$('.right-menu').hide();
		el.toggle();
	}
}

function handleCreateAccount(user, pass, confPass) {
	if (user.length == 0 || pass.length == 0) {
		$('#create-error').html('You must enter a username and password.');
	} else if (pass != confPass) {
		$('#create-error').html('Passwords do not match.');
	} else {
		$('#create-error').html('');
		createAccount(user, pass);
		//console.log('c okay');
	}
}

function handleLogin(user, pass) {
	if (user.length == 0 || pass.length == 0) {
		$('#login-error').html('You must enter a username and password.');
	} else {
		$('#login-error').html('');
		login(user, pass);
		//console.log('l okay');
	}
}