var ballX;
var ballY;
var ballSpeedX;
var ballSpeedY;

var player1Y;
var player2Y;
var playerXoff;
var playerWidth;
var playerHeight;
var player1Up;
var player1Down;
var player2Up;
var player2Down;
var playerSpeed;
var player1Score;
var player2Score;

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("canvas");

	textAlign(CENTER);

	ballX = width / 2;
	ballY = height / 2;
	ballSpeedX = 6;
	ballSpeedY = 6;
	player1Y = height / 2;
	player2Y = height / 2;
	playerXoff = 50;
	playerWidth = 10;
	playerHeight = 80;
	player1Up = false;
 	player1Down = false;
 	player2Up = false;
 	player2Down = false;
	playerSpeed = 6;
	player1Score = 0;
	player2Score = 0;

	if(randomBoolean()){
		ballSpeedX *= -1;
	}
	if(randomBoolean()){
		ballSpeedY *= -1;
	}
}

function draw() {
	background(51);
	ellipse(ballX, ballY, 20, 20);
	rect(playerXoff, player1Y, playerWidth, playerHeight);
	rect(width - playerXoff, player2Y, playerWidth, playerHeight);
	for(var y = 0; y < height; y += 20){
		rect(width / 2, y, 5, 10);
	}
	fill(255);
	noStroke();
	textSize(64);
	text(player1Score, 300, 100);
	text(player2Score, width - 300, 100);

	if(ballX < 10){
		player2Score++;
		ballSpeedX = ballSpeedX * -1;
		reset();
	}
	if(ballX > width - 10){
		player1Score++;
		ballSpeedX = ballSpeedX * -1;
		reset();
	}
	if(ballY < 10 || ballY > height - 10) {
		ballSpeedY = ballSpeedY * -1;
	}
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	if(player1Up) {
		player1Y -= playerSpeed;
	} else if(player1Down) {
		player1Y += playerSpeed;
	}
	if(player2Up) {
		player2Y -= playerSpeed;
	} else if(player2Down) {
		player2Y += playerSpeed;
	}

	if((ballX - 10 < playerXoff && ballY > player1Y && ballY < player1Y + playerHeight) || (ballX + 10 > width -playerXoff && ballY > player2Y && ballY < player2Y + playerHeight)) {
		ballSpeedX *= -1;
	}

	if(player1Y < 0) {
		player1Y = 0;
	}
	if(player1Y > height - playerHeight) {
		player1Y = height - playerHeight;
	}
	if(player2Y < 0) {
		player2Y = 0;
	}
	if(player2Y > height - playerHeight) {
		player2Y = height - playerHeight;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	ballX = width / 2;
	ballY = height / 2;
}

function keyPressed() {
	if(key == 'W') {
		player1Up = true;
	}
	if(key == 'S') {
		player1Down = true;
	}
	if(keyCode == UP_ARROW) {
		player2Up = true;
	}
	if(keyCode == DOWN_ARROW) {
		player2Down = true;
	}
}

function keyReleased() {
	if(key == 'W') {
		player1Up = false;
	}
	if(key == 'S') {
		player1Down = false;
	}
	if(keyCode == UP_ARROW) {
		player2Up = false;
	}
	if(keyCode == DOWN_ARROW) {
		player2Down = false;
	}
}

function randomBoolean(){
	return random() > 0.5;
}

function reset() {
	ballX = width / 2;
	ballY = height / 2;
	player1Y = height / 2;
	player2Y = height / 2;

	if(randomBoolean()){
		ballSpeedX *= -1;
	}
	if(randomBoolean()){
		ballSpeedY *= -1;
	}
}
