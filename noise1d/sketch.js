var noiseX = 0;
var xoffslider;
var detailslider;

function setup() {
	createCanvas(640, 480);
	
	xoffslider = createSlider(0, 0.1, 0.02, 0.001);
	detailslider = createSlider(0, 24, 4, 0.1);
}

function draw() {
	background(51);
	
	noiseDetail(detailslider.value());
	
	noFill();
	stroke(255);
	
	var xoff = noiseX;
	beginShape();
	for(var x = 0; x < width; x++) {
		var y = map(noise(xoff), 0, 1, 0, width);
		
		vertex(x, y);
		
		xoff += xoffslider.value();
	}
	endShape();
	noiseX += 0.04;
}