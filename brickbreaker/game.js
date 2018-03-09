
var bricks = [];
var balls = [];

var br_w = 40;
var br_h = 25;
var br_xoff = 10;
var br_yoff = 10;
var br_rows = 16;
var br_maxcol = 12;

var bl_radius = 12;
var bl_speed = 9;
var bl_spawn_yoff = 70;
var bl_wait_amount = 10;
var bl_shoot_wait = 2;
var bl_color;

var level_round = 1;
var score = 0;
var ball_amount = 1;
var ball_shoot_wait = 0;
var ball_shoot_amount = 0;
var ball_shoot_fromx = 0;
var ball_shoot_target;
var playing = false;
var ball_orgin = null;

function setup() {
	createCanvas(br_rows * br_w + br_xoff * 2, 480);
	
	bl_color = color(0, 191, 255);
	
	resetLevel();
	nextRound();
}

function draw() {
	background(51);
	
	if(!playing) {
		if(ball_orgin == null) ball_orgin = width / 2;
		
		var x = ball_orgin;
		var y = height - bl_spawn_yoff;
		
		var rad = atan2(mouseY - y, mouseX - x);
		
		var xx = x;
		var yy = y;
		var c = cos(rad);
		var s = sin(rad);
		stroke(255);
		for(var i = 0; i < 30; i++) {
			line(xx, yy, xx + c * 10, yy + s * 10);
			xx += c * 20;
			yy += s * 20;
		}
	}
	
	if(ball_orgin != null) {
		noStroke();
		fill(bl_color);
		ellipse(ball_orgin, height - bl_spawn_yoff, bl_radius, bl_radius);
	}
	
	for(var i = 0; i < bricks.length; i++) {
		bricks[i].draw();
	}
	
	for(var i = 0; i < balls.length; i++) {
		balls[i].update();
		balls[i].draw();
		if(balls[i].dead) {
			balls.splice(i, 1);
		}
	}
	
	
	if(ball_shoot_amount > 0) {
		ball_shoot_wait--;
		if(ball_shoot_wait <= 0) {
			ball_shoot_wait = bl_shoot_wait;
			ball_shoot_amount--;
			spawnBall();
		}
	}
	
	var lastPlaying = playing;
	playing = balls.length != 0;
	if(lastPlaying && !playing) {
		nextRound();
	}
}

function mousePressed() {
	if(!playing) {
		ball_shoot_fromx = ball_orgin;
		ball_orgin = null;
		playing = true;
		ball_shoot_amount = level_round; //ball_amount;
		ball_shoot_wait = 0;
		ball_shoot_target = createVector(mouseX, mouseY);
	}
}

function spawnBall() {
	var x = ball_shoot_fromx;
	var y = height - bl_spawn_yoff;
	var rad = atan2(ball_shoot_target.y - y, ball_shoot_target.x - x);
	var xvel = cos(rad) * bl_speed;
	var yvel = sin(rad) * bl_speed;
	balls.push(new Ball(x, y, xvel, yvel));
}

function spawnBrick() {
	var row = floor(random(br_rows));
	
	bricks.push(new Brick(row, 0, level_round));
}

function nextRound() {
	for(var i = 0; i < bricks.length; i++) {
		bricks[i].col++;
		if(bricks[i].col > br_maxcol) {
			resetLevel();
		}
	}
	
	var maxAmount = map(level_round, 1, 15, 1, br_rows - 9);
	var spawnAmount = random(maxAmount);
	
	for(var i = 0; i < spawnAmount; i++) {
		spawnBrick();
	}
	
	level_round++;
	score++;
}

function resetLevel() {
	bricks = [];
	balls = [];
	level_round = 1;
	score = 0;
}