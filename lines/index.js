var img;

function preload() {
	img = loadImage("img.jpg");
}

function setup() {
	createCanvas(640, 480);

	img.loadPixels();
	image(img, 0, 0);
	background(255, 255, 255, 220);

	image(img, img.width, 0);
}

function draw() {
	for(var j = 0; j < 2; j++) {
		var exclude = [];

		for(var i = 0; i < 10; i++) {
			var p1 = {
				x: floor(random(img.width)),
				y: floor(random(img.height))
			};

			var p2 = getClosestPoint(img, p1, exclude);

			exclude.push(p1);
			exclude.push(p2);
		}

		var p1 = random(exclude);
		var p2 = random(exclude);

		var clr1 = getColor(img, p1.x, p1.y);
		var clr2 = getColor(img, p2.x, p2.y);

		var clr = {
			r: (clr1.r + clr2.r) / 2,
			g: (clr1.g + clr2.g) / 2,
			b: (clr1.b + clr2.b) / 2
		}

		stroke(clr.r, clr.g, clr.b, 100);
		line(p1.x, p1.y, p2.x, p2.y);
	}
}

function getClosestPoint(img, point, exclude) {
	if(!exclude) exclude = [];
	var color = getColor(img, point.x, point.y);

	var closestDist = Infinity;
	var closest = {x:0, y:0};

	for(var y = 0; y < img.height; y++) {
		for(var x = 0; x < img.width; x++) {
			if(point.x == x && point.y == y) {
				continue;
			}

			var doesExclude = false;
			for(var i = 0; i < exclude.length; i++) {
				if(exclude[i].x == x && exclude[i].y == y) {
					doesExclude = true;
					break;
				}
			}
			if(doesExclude) {
				continue;
			}

			var clr = getColor(img, x, y);
			var cdst = colorDistSq(color, clr);
			if(cdst < closestDist) {
				closestDist = cdst;
				closest = {x:x, y:y};
			}
		}
	}

	return closest;
}

function getColor(img, x, y) {
	var i = (x + y * img.width) * 4;
	return {
		r: img.pixels[i + 0],
		g: img.pixels[i + 1],
		b: img.pixels[i + 2]
	};
}

function colorDist(c1, c2) {
	return dist(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
}

function colorDistSq(c1, c2) {
	return (c1.r - c2.r) * (c1.r - c2.r) + (c1.g - c2.g) * (c1.g - c2.g) + (c1.b - c2.b) * (c1.b - c2.b);
}