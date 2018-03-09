var player;
var asteroids = [];

var plSpeed = 8;
var isGameOver = false;
var isBegin = true;
var gameOverData;
var playerName = null;

function setup() {
	createCanvas(700, 480);

	player = new Player();
}

function draw() {
	background(51);

	if(isBegin) {
		textAlign(CENTER);

		fill(255);
		textSize(84);
		text("Asteroids", width / 2, height / 2);

		fill(120);
		textSize(32);
		text("Dodge the asteroids", width / 2, height / 2 + 36);

		fill(88);
		textSize(26);
		text("Click to start", width / 2, height / 2 + 72);
		return;
	}

	if(random() < 0.1) {
		asteroids.push(new Asteroid());
	}

	for(var i = 0; i < asteroids.length; i++) {
		asteroids[i].update();
		asteroids[i].draw();

		if(asteroids[i].remove) {
			asteroids.splice(i, 1);
			i--;
		}
	}

	player.update();
	player.draw();

	if(isGameOver) {
		textAlign(CENTER);

		fill(255);
		textSize(64);
		text("Game Over", width / 2, height / 2 - 42);

		fill(200);
		textSize(38);
		text("Score: " + player.score, width / 2, height / 2);

		fill(200);
		textSize(28);
		if(gameOverData.isWorldRecord) {
			text("New world record!", width / 2, height / 2 + 28);
		}else{
			text("World record: " + gameOverData.worldRecord_score, width / 2, height / 2 + 28);
		}

		fill(200);
		textSize(28);
		text("World record holder: " + gameOverData.worldRecord_name, width / 2, height / 2 + 58);

		fill(140);
		textSize(22);
		text("Click to restart", width / 2, height / 2 + 105);

		noLoop();
	}
}

function gameOver() {
	if(!playerName) {
		playerName = prompt("Please enter your username:", "Player");
	}

	httpGet("record.php?score=" + player.score + "&name=" + playerName, "json", function(data) {
		gameOverData = data;
		isGameOver = true;
	});
}

function mousePressed() {
	if(isBegin) {
		isBegin = false;
	}

	if(isGameOver) {
		isGameOver = false;
		reset();
		loop();
	}
}

function reset() {
	asteroids = [];
	player = new Player();
}

function keyPressed() {
	if(key == 'A' || keyCode == LEFT_ARROW) {
		player.left = true;
	}else if(key == 'D' || keyCode == RIGHT_ARROW) {
		player.right = true;
	}
}

function keyReleased() {
	if(key == 'A' || keyCode == LEFT_ARROW) {
		player.left = false;
	}else if(key == 'D' || keyCode == RIGHT_ARROW) {
		player.right = false;
	}
}

function intersects(a, b) {
	return (a.left <= b.right &&
					b.left <= a.right &&
					a.top  <= b.bottom &&
					b.top  <= a.bottom);
}
