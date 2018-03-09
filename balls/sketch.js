
var circles = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	for(var j = 0; j < 5; j++) {
		var tries = 0;
		while(tries++ < 1000) {
			var circle = {
				x: random(width),
				y: random(height),
				r: random(12, 48),
				col: color(random(255), random(255), random(255))
			}

			var collision = false;
			for(var i = 0; i < circles.length; i++) {
				var dst = dist(circle.x, circle.y, circles[i].x, circles[i].y);
				if(dst < circle.r + circles[i].r) {
					collision = true;
					break;
				}
			}

			if(!collision) {
				circles.push(circle);
				found = true;
				break;
			}
		}
	}

	noStroke();
	for(var i = 0; i < circles.length; i++) {
		fill(circles[i].col);
		ellipse(circles[i].x, circles[i].y, circles[i].r * 2, circles[i].r * 2);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
