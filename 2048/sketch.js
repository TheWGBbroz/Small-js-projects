const TILE_SIZE = 48;
const SIZE = 8;

var LEFT, RIGHT, UP, DOWN;

var board;
var positionChanges = [];

function setup() {
	LEFT = LEFT_ARROW;
	RIGHT = RIGHT_ARROW;
	UP = UP_ARROW;
	DOWN = DOWN_ARROW;

	createCanvas(SIZE * TILE_SIZE, SIZE * TILE_SIZE);

	board = new Array(SIZE);
	for(var r = 0; r < SIZE; r++) {
		board[r] = new Array(SIZE);
		for(var c = 0; c < SIZE; c++) {
			board[r][c] = new Cell(r, c);
		}
	}
}

function addRandom() {
	var options = [];
	for(var r = 0; r < SIZE; r++) {
		for(var c = 0; c < SIZE; c++) {
			if(board[r][c].value == 0) {
				options.push(board[r][c]);
			}
		}
	}

	if(options.length == 0) {
		gameOver();
		return;
	}

	random(options).value = random() < 0.5 ? 2 : 4;
}

function gameOver() {
	console.log("Game over");
	noLoop();
}

// Slides to the LEFT
function slide(original) {
	var row = new Array(original.length);
	row[row.length - 1] = original[original.length - 1];

	for(var i = 0; i < row.length; i++) {
		var val = 0;
		for(var j = 0; j < original.length; j++) {
			if(original[j]) {
				val = original[j];
				original[j] = 0;
				break;
			}
		}

		row[i] = val;
	}

	for(var i = 0; i < row.length; i++) {
		original[i] = row[i];
	}

	return original;
}

// Combines to the LEFT
function combine(row) {
	if(row[0] == row[1]) {
		row[0] = row[0] + row[1];
		row[1] = 0;
	}else if(row[1] == row[2]) {
		row[1] = row[1] + row[2];
		row[2] = 0;
	}

	if(row[2] == row[3]) {
		row[2] = row[2] + row[3];
		row[3] = 0;
	}

	return row;
}

// Slides and combines to the LEFT
function operate(row) {
	slide(row);
	combine(row);
	slide(row);

	return row;
}

function slideBoard(dir) {
	var prevBoard = new Array(SIZE);
	for(var r = 0; r < SIZE; r++) {
		prevBoard[r] = new Array(SIZE);
		for(var c = 0; c < SIZE; c++) {
			prevBoard[r][c] = {
				value: board[r][c].value,
				clr: board[r][c].clr
			};
		}
	}

	var reverse;
	if(dir == LEFT) {
		slideBoardSimple(false, false);
		reverse = true;
	}else if(dir == RIGHT) {
		slideBoardSimple(false, true);
		reverse = false;
	}else if(dir == UP) {
		slideBoardSimple(true, false);
		reverse = true;
	}else if(dir == DOWN) {
		slideBoardSimple(true, true);
		reverse = false;
	}

	//reverse = !reverse;

	var movements = [];

	for(var r = 0; r < SIZE; r++) {
		for(var c = 0; c < SIZE; c++) {
			var prev = prevBoard[r][c];
			var curr = board[r][c];

			if(curr.value != prev.value) {
				//console.log("Cell moved away from (" + r + ", " + c + ")");

				var from = {row:r, col:c};
				var to = false;

				for(var delta = 0; delta < SIZE; delta++) {
					var d = reverse ? SIZE - delta - 1 : delta;
					
					var newR = r;
					var newC = c;

					if(dir == LEFT) newR -= d;
					else if(dir == RIGHT) newR += d;
					else if(dir == UP) newC -= d;
					else if(dir == DOWN) newC += d;

					if(newR < 0 || newR >= SIZE || newC < 0 || newC >= SIZE)
						continue;

					if(board[newR][newC].value != 0) {
						to = {row:newR, col:newC};
						break;
					}
				}

				if(to) {
					movements.push({
						from: from,
						to: to,

						lerpedX: r * TILE_SIZE,
						lerpedY: c * TILE_SIZE,
						targetX: to.row * TILE_SIZE,
						targetY: to.col * TILE_SIZE,

						lerpedClr: prev.clr,
						targetClr: curr.clr
					});
				}
			}
		}
	}

	return movements;
}

// Rotate  - Whether or not to perform a right angle rotation to the board (Rotating 90 degrees)
// Reverse - Whether or not to reverse each row (Rotating 180 degrees)
function slideBoardSimple(rotate, reverse) {
	for(var i = 0; i < SIZE; i++) {
		var row = new Array(SIZE);

		for(var j = 0; j < row.length; j++) {
			var x = rotate ? i : j;
			var y = rotate ? j : i;
			row[j] = board[x][y].value;
		}

		// Reverse if needed
		if(reverse) row.reverse();

		operate(row);
		
		// Reverse back if previously reversed
		if(reverse) row.reverse();

		for(var j = 0; j < row.length; j++) {
			var x = rotate ? i : j;
			var y = rotate ? j : i;
			board[x][y].value = row[j];
			board[x][y].updateColor();
		}
	}
}

function getPositionChange(fromRow, fromCol) {
	if(!positionChanges) return false;

	for(var i = 0; i < positionChanges.length; i++) {
		if(positionChanges[i].from.row == fromRow && positionChanges[i].from.col == fromCol) {
			return positionChanges[i].to;
		}
	}

	return false;
}

function draw() {
	background(255);

	for(var i = 0; i < positionChanges.length; i++) {
		var change = positionChanges[i];
		change.lerpedX = lerp(change.lerpedX, change.targetX, 0.1);
		change.lerpedY = lerp(change.lerpedY, change.targetY, 0.1);
		change.lerpedClr = lerpColor(change.lerpedClr, change.targetClr, 0.5);

		if(abs(change.targetX - change.lerpedX) < 1 && abs(change.targetY - change.lerpedY) < 1) {
			positionChanges.splice(i--, 1);
			continue;
		}

		noStroke();
		fill(change.targetClr);
		rect(change.lerpedX, change.lerpedY, TILE_SIZE, TILE_SIZE);
	}

	for(var r = 0; r < SIZE; r++) {
		for(var c = 0; c < SIZE; c++) {
			board[r][c].draw();
		}
	}
}

function keyPressed() {
	if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
		// LEFT, RIGHT, UP and DOWN are the same as the X_ARROW variables
		positionChanges = slideBoard(keyCode);

		addRandom();
	}
}

class Cell {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.x = this.row * TILE_SIZE;
		this.y = this.col * TILE_SIZE;
		this.value = 0;
		
		this.updateColor();
	}

	draw(x, y) {
		if(this.value == 0) return;

		if(x === undefined) x = this.x;
		if(y === undefined) y = this.y;

		fill(this.clr);
		rect(x, y, TILE_SIZE, TILE_SIZE);

		fill(0);
		textSize(32);
		textAlign(CENTER, CENTER);
		text(this.value, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
	}

	updateColor() {
		this.clr = color(map(this.value, 0, 64, 200, 255), map(this.value, 0, 64, 50, 255), map(this.value, 0, 64, 50, 255));
	}
}