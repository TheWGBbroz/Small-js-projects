var slider;

function setup() {
	createCanvas(640, 480);
	pixelDensity(1);

	slider = createSlider(0, 0.2, 0.01, 0.001);
}

function draw() {
	var inc = slider.value();

	loadPixels();

	var yoff = 0;
	for(var y = 0; y < height; y++) {
		var xoff = 0;

		for(var x = 0; x < width; x++) {
			var index = (x + y * width) * 4;
			var r = noise(xoff, yoff) * 255;
			//var g = noise(xoff + 10000, yoff + 10000) * 255;
			//var b = noise(xoff + 1000000, yoff + 1000000) * 255;

			pixels[index + 0] = r;
			pixels[index + 1] = r;
			pixels[index + 2] = r;
			pixels[index + 3] = 255;

			xoff += inc;
		}

		yoff += inc;
	}

	updatePixels();
}
