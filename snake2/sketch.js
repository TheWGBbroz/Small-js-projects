const TILE_SIZE = 24;
const SIZE = 20;

var snake;
var apple;

var scoreSpan;

function setup() {
	var canvas = createCanvas(SIZE * TILE_SIZE + 1, SIZE * TILE_SIZE + 1);
	canvas.parent("#canvas-holder");

	scoreSpan = select("#score");

	resetGame();
}

function draw() {
	background(50);

	snake.update(apples);
	snake.draw();

	apple.draw();
}

function keyPressed() {
	snake.keyPressed(key, keyCode);
}

function mousePressed() {
	//snake.tailLength++;
}

function gameOver() {
	console.log("Game over");
	resetGame();
}

function resetGame() {
	snake = new Snake(floor(SIZE / 2), floor(SIZE / 2));
	apples = [];

	respawnApple();
	updateScore();
}

function respawnApple() {
	var row, col;
	do{
		row = floor(random(SIZE));
		col = floor(random(SIZE));
	}while(isOccupied(row, col));

	apple = new Apple(row, col);
}

function isOccupied(row, col) {
	for(var i = 0; i < snake.tail.length; i++) {
		if(snake.tail[i].row == row && snake.tail[i].col == col)
			return true;
	}

	if(apple && apple.row == row && apple.col == col)
		return true;

	return false;
}

function updateScore() {
	scoreSpan.html(snake.tailLength);
}

class Snake {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.dr = 1;
		this.dc = 0;
		this.tail = [];
		this.tailLength = 3;
		this.disableInput = false;
	}

	update(apples) {
		if(frameCount % floor(60 / 6) == 0) {
			this.row += this.dr;
			this.col += this.dc;

			this.tail.push({ row:this.row, col:this.col });

			if(this.tail.length > this.tailLength)
				this.tail.splice(0, 1);

			if(this.checkCollision()) {
				gameOver();
				return;
			}

			if(apple.row == this.row && apple.col == this.col) {
				respawnApple();
				this.tailLength++;
				updateScore();

				return;
			}

			this.disableInput = false;
		}
	}

	draw() {
		fill(255);
		//rect(this.row * TILE_SIZE, this.col * TILE_SIZE, TILE_SIZE, TILE_SIZE);

		for(var i = 0; i < this.tail.length; i++) {
			rect(this.tail[i].row * TILE_SIZE, this.tail[i].col * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}
	}

	checkCollision() {
		if(this.row < 0 || this.row >= SIZE || this.col < 0 || this.col >= SIZE)
			return true;

		for(var i = 0; i < this.tail.length - 1; i++) {
			if(this.tail[i].row == this.row && this.tail[i].col == this.col)
				return true;
		}

		return false;
	}

	keyPressed(key, keyCode) {
		if(this.disableInput) return;

		if(keyCode == LEFT_ARROW && this.dr != 1 && !this.disableInput) {
			this.dr = -1;
			this.dc = 0;
			this.disableInput = true;
		}else if(keyCode == RIGHT_ARROW && this.dr != -1 && !this.disableInput) {
			this.dr = 1;
			this.dc = 0;
			this.disableInput = true;
		}else if(keyCode == UP_ARROW && this.dc != 1 && !this.disableInput) {
			this.dr = 0;
			this.dc = -1;
			this.disableInput = true;
		}else if(keyCode == DOWN_ARROW && this.dc != -1 && !this.disableInput) {
			this.dr = 0;
			this.dc = 1;
			this.disableInput = true;
		}
	}
}

class Apple {
	constructor(row, col) {
		if(row === undefined) row = floor(random(SIZE));
		if(col === undefined) col = floor(random(SIZE));

		this.row = row;
		this.col = col;
	}

	draw() {
		fill(255, 0, 0);
		rect(this.row * TILE_SIZE, this.col * TILE_SIZE, TILE_SIZE, TILE_SIZE);
	}
}
