var lastSec = -1;
var ms = 0;

function setup() {
	createCanvas(400, 400);
}

function draw() {
	background(51);

	if(second() != lastSec) {
		ms = 0;
	}

	var sec = second() + ms / 1000;
	var edge = floor(map(sec, 0, 60, 0, 4));
	var forward = map(sec % 15, 0, 15, 0, width);
	
	ellipse(forward, height / 2, 20, 20);

	lastSec = second();

	ms += 1000 / frameRate();
}