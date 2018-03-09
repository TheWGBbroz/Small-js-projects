var circles = [];
var bg;
var timer = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	bg = color(51);

	noStroke();
}

function draw() {
	background(bg);

	timer++;
	if(timer % 3 == 0) {
		circles.push({
			x: cos(timer * 0.05) * 70 + width / 2,
			y: sin(timer * 0.05) * 70 + height / 2,
			size: 10,
			col: color(random(255), random(255), random(255))
		});
	}

	for(var i = 0; i < circles.length; i++) {
		fill(circles[i].col);
		ellipse(circles[i].x, circles[i].y, circles[i].size, circles[i].size);
		circles[i].size += 12;
		if(circles[i].size > (width + height) * 2) {
			bg = circles[i].col;
			circles.splice(i, 1);
			i--;
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
