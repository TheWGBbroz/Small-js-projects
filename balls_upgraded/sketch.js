var balls = [];

var randomly = false;

function setup() {
	createCanvas(640, 480);

	balls.push({ x:width/2, y:height/2, radius:50 });

	drawAllBalls();
}

function draw() {
	/*background(255);

	fill(0);
	stroke(100, 0);
	for(var i = 0; i < balls.length; i++) {
		ellipse(balls[i].x, balls[i].y, balls[i].radius * 2, balls[i].radius * 2);
	}*/

	if(!randomly) {
		var elapsed = addBall();
		console.log("Elapsed " + elapsed + "ms");
		if(elapsed > 1500) {
			randomly = true;
			console.log("Switching over to random");
		}
	}else{
		addBallRandomly();
	}

	var newBall = balls[balls.length - 1];

	fill(0);
	stroke(100, 0);
	ellipse(newBall.x, newBall.y, newBall.radius * 2, newBall.radius * 2);
}

function drawAllBalls() {
	background(255);

	fill(0);
	stroke(100, 0);
	for(var i = 0; i < balls.length; i++) {
		ellipse(balls[i].x, balls[i].y, balls[i].radius * 2, balls[i].radius * 2);
	}
}

function mousePressed() {
	//addBall();
}

function addBall() {
	var start = timeMS();

	var largestRadius = -1;
	var largestPos;

	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			var maxRadius = calculateLargestRadius(x, y);
			if(maxRadius > largestRadius) {
				largestRadius = maxRadius;
				largestPos = {x:x, y:y};
			}
		}
	}

	var ball = {
		x: largestPos.x,
		y: largestPos.y,
		radius: largestRadius
	};

	balls.push(ball);

	return timeMS() - start;
}

function addBallRandomly() {
	var x, y;
	do{
		x = floor(random(width));
		y = floor(random(height));
	}while(isInBall(x, y));

	var ball = {
		x: x,
		y: y,
		radius: calculateLargestRadius(x, y)
	};

	balls.push(ball);
}

function isInBall(posX, posY) {
	for(var i = 0; i < balls.length; i++) {
		var dstSq = distSq(posX, posY, balls[i].x, balls[i].y);
		if(dstSq < pow(balls[i].radius, 2))
			return true;
	}

	return false;
}

function calculateLargestRadius(posX, posY) {
	var nearestDist = width;

	for(var i = 0; i < balls.length; i++) {
		var dst = dist(posX, posY, balls[i].x, balls[i].y);
		dst -= balls[i].radius;
		if(dst < nearestDist) {
			nearestDist = dst;
		}
	}

	return nearestDist;
}

function distSq(x1, y1, x2, y2) {
	return pow(x1 - x2, 2) + pow(y1 - y2, 2);
}

function timeMS() {
	return new Date().getTime();
}