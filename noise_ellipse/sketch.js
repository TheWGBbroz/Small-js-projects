var xoff = 0;

function setup() {
	createCanvas(640, 480);
	noiseDetail(3);
}

function draw() {
	background(51);
	
	var x = map(noise(xoff), 0, 1, 0, width);
	var y = map(noise(xoff + 10000), 0, 1, 0, width);
	var d = map(noise(xoff + 100), 0, 1, 16, 64);
	
	fill(255);
	ellipse(x, y, d, d);
	
	xoff += 0.01;
}