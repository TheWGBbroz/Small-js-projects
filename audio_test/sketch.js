
var rows, cols;
var scl = 20;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);

	rows = width / scl;
	cols = height / scl;
}

function draw() {
	translate(width * -0.5, height * -0.5);
	background(0);

	stroke(255);
	noFill();
	torus(80, 20, 64, 64);
	for(var x = 0; x < rows; x++) {
		for(var y = 0; y < cols; y++) {
			push();
				translate(x * scl, y * scl);
				plane(scl);
			pop();
		}
	}
}
