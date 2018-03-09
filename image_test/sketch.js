var originalImg;

function preload() {
	originalImg = loadImage("image.jpg");
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	processImg();
	noLoop();
}

function processImg() {
	var processed = process(originalImg);
	image(processed, 0, 0, width, height);
}

function keyPressed() {
	processImg();
}

function mousePressed() {
	processImg();
}

function process(img) {
	var w = img.width;
	var h = img.height;
	var newImg = createImage(w, h);

	var order = [floor(random(3)), floor(random(3)), floor(random(3))];

	img.loadPixels();
	newImg.loadPixels();
	for(var x = 0; x < w; x++) {
		for(var y = 0; y < h; y++) {
			var i = (y * w + x) * 4;
			newImg.pixels[i + 3] = img.pixels[i + 3];
			var oldR = img.pixels[i + 0];
			var oldG = img.pixels[i + 1];
			var oldB = img.pixels[i + 2];

			newImg.pixels[i + order[0]] = oldR;
			newImg.pixels[i + order[1]] = oldG;
			newImg.pixels[i + order[2]] = oldB;
		}
	}
	newImg.updatePixels();

	return newImg;
}
