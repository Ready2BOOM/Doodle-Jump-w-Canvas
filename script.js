const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
	x: canvas.width / 2 - 10,
	y: canvas.height - 2,
	width: 20,
	height: 25,
	dy: 0,
	dx: 0,
};

let cameraY = 0;

const platforms = [];
const numOfPlatforms = 7;
const platformHeight = 10;
const platformWidth = 40;

let leftPressed = false;
let rightPressed = false;

let score = 0;

function createPlatforms() {
	platforms.push({ x: canvas.width / 2 - platformWidth / 2, y: canvas.height - platformHeight });
	for (let i = 1; i < numOfPlatforms; i++) {
		platforms.push({
			x: Math.random() * (canvas.width - platformWidth),
			y: canvas.height / numOfPlatforms * i,
		});
	}
}

function drawPlayer() {
	ctx.fillStyle = '#c0c0c4';
	ctx.fillRect(player.x, player.y - cameraY, player.width, player.height);
}

function drawPlatforms() {
	ctx.fillStyle = '#8B4513';
	platforms.forEach((platform) => {
		ctx.fillRect(platform.x, platform.y - cameraY, platformWidth, platformHeight);
	});
}

function updatePlayer() {
	player.dy += 0.55;
	player.y += player.dy;

	if (leftPressed) {
		player.dx = -3.5;
	} else if (rightPressed) {
		player.dx = 3.5;
	} else {
		player.dx *= 0.6;
	}

	player.x += player.dx;

	if (player.y < cameraY + canvas.height / 4) {
		cameraY = player.y - canvas.height / 4;
	}

	if (player.y + player.height > canvas.height) {
		alert(`GAME OVER! Your score: ${Math.floor(score)}`);
		restartGame();
	}

	platforms.forEach((platform) => {
		if (
			player.x + player.width > platform.x &&
			player.x < platform.x + platformWidth &&
			player.y + player.height >= platform.y &&
			player.y + player.height <= platform.y + platformHeight &&
			player.dy > 0
		) {
			player.dy = -15;
			score += 1;
			document.getElementById('score').innerText = Math.floor(score);
		}
	});

	if (player.x < -player.width) {
		player.x = canvas.width;
	} else if (player.x > canvas.width) {
		player.x = -player.width;
	}
}

function handleInput() {
	document.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') {
			leftPressed = true;
		}
		if (event.key === 'ArrowRight') {
			rightPressed = true;
		}
	});

	document.addEventListener('keyup', (event) => {
		if (event.key === 'ArrowLeft') {
			leftPressed = false;
		}
		if (event.key === 'ArrowRight') {
			rightPressed = false;
		}
	});
}

function updatePlatforms() {
	platforms.forEach((platform) => {
		platform.y += 0.05;
		if (platform.y > canvas.height + cameraY) {
			platform.y = cameraY;
			platform.x = Math.random() * (canvas.width - platformWidth);
		}
	});
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPlayer();
	drawPlatforms();
	updatePlayer();
	updatePlatforms();
	requestAnimationFrame(gameLoop);
}

function restartGame() {
	player.x = canvas.width / 2 - 10;
	player.y = canvas.height - 100;
	player.dy = 0;
	player.dx = 0;
	cameraY = 0;
	score = 0;
	platforms.length = 0;
	createPlatforms();
}

createPlatforms();
handleInput();
gameLoop();
