var bg, water1;
var w_xoff = 0;

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("canvas");

	bg = loadImage("bg.jpg");
	water1 = loadImage("water1.png");

	noiseDetail(1);
}

var lastMouseX = -1;
var lastMouseY = -1;
var maddX = 0
var maddY = 0;
function draw() {
	w_xoff += 0.008;

	if(lastMouseX != -1 && lastMouseY != -1) {
		var mdiffX = mouseX - lastMouseX;
		var mdiffY = mouseY - lastMouseY;
		maddX += mdiffX * -0.1;
		maddY += mdiffY * -0.1;
	}

	if(maddX > 0) {
		maddX -= 0.01;
	}else if(maddX < 0) {
		maddX += 0.01;
	}

	if(maddY > 0) {
		maddY -= 0.01;
	}else if(maddY < 0) {
		maddY += 0.01;
	}

	var waterX = map(noise(w_xoff      ), 0, 1, -40, 40) + maddX * 0.1;
	var waterY = map(noise(w_xoff + 100), 0, 1, -40, 40) + maddY * 0.13;

	image(bg, 0, 0, windowWidth, windowHeight);

	strokeWeight(2);
	noFill();
	stroke(51, 175);
	for(var y = 0; y < height; y += 4) {
		line(0, y, width, y);
	}

	image(water1, waterX, waterY, windowWidth, windowHeight);

	lastMouseX = mouseX;
	lastMouseY = mouseY;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
