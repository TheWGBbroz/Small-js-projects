var s;
var scl = 20;

var food;

function setup() {
	createCanvas(600, 600);
	s = new Snake();
	frameRate(10);
	pickFoodLocation();
}

function draw() {
	background(54);
	
	fill(255, 0, 100);
	rect(food.x, food.y, scl, scl);
	
	
	if(s.eat(food)) {
		pickFoodLocation();
	}
	s.death();
	s.update();
	s.show();
}

function keyPressed() {
	if(keyCode === UP_ARROW) {
		s.dir(0, -1);
	}else if(keyCode === DOWN_ARROW) {
		s.dir(0, 1);
	}else if(keyCode === RIGHT_ARROW) {
		s.dir(1, 0);
	}else if(keyCode === LEFT_ARROW) {
		s.dir(-1, 0);
	}
	
	if(key == ' ') {
		s.total++;
	}
}

function pickFoodLocation() {
	var rows = floor(width/scl);
	var cols = floor(height/scl);
	food = createVector(floor(random(rows)), floor(random(cols)));
	food.mult(scl);
}