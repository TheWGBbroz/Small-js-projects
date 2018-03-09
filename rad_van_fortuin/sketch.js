const SMOOTHNESS = 3;
const RADIUS = 450;
const TEXT_SIZE = 48;

const WINNINGS = [
	"Anarchie",
	"Het einde",
	"Hogeland", 
	"Ambtenarij",
	"Jaloezie",
	"Liefde",
	"Angst",
	"Verlangen",
	"Natuur",
	"Hoop",
	"Doorpakken",
	"Pijn",
	"Anders",
	"Beving"
];

const START_VEL = 28;
const START_LERP = 0.002;
const END_LERP = 0.04;

var angle = 0;
var vel = 0;
var spinning = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);

	angle = random(360);
}

function draw() {
	background(0);

	
	push();
	translate(width / 2, height / 2);
	rotate(angle);

	var degreeStep = 360 / WINNINGS.length;
	var smoothStep = degreeStep / SMOOTHNESS;

	for(var i = 0; i < WINNINGS.length; i++) {
		colorMode(HSB);
		fill(i * degreeStep, 255, 255);
		noStroke();

		beginShape();
		vertex(0, 0);
		var gamma = degreeStep * i;
		vertex(cos() * RADIUS, sin(gamma) * RADIUS);

		for(var j = 0; j < SMOOTHNESS; j++) {
			var alpha = degreeStep * i + smoothStep * j;
			vertex(cos(alpha) * RADIUS, sin(alpha) * RADIUS);
		}

		var eta = degreeStep * (i + 1);
		vertex(cos(eta) * RADIUS, sin(eta) * RADIUS);
		endShape(CLOSE);
		colorMode(RGB);

		push();
		fill(0);
		textAlign(CENTER, CENTER);
		textSize(TEXT_SIZE);
		stroke(0);
		strokeWeight(1);

		var beta = degreeStep * i + degreeStep / 2;
		var rad = RADIUS * 0.6;
		translate(cos(beta) * rad, sin(beta) * rad);
		rotate(beta);

		text(WINNINGS[i], 0, 0);
		pop();
	}

	stroke(0);
	for(var i = 0; i < WINNINGS.length; i++) {
		line(0, 0, cos(degreeStep * i) * RADIUS, sin(degreeStep * i) * RADIUS);
	}

	pop();

	noFill();
	stroke(0);
	strokeWeight(2);
	ellipse(width / 2, height / 2, RADIUS * 2, RADIUS * 2);
	strokeWeight(1);

	fill(180);
	triangle(width / 2 + RADIUS - 30, height / 2,
			width / 2 + RADIUS - 30 + 60, height / 2 - 30,
			width / 2 + RADIUS - 30 + 60, height / 2 + 30);


	angle += vel;
	vel = lerp(vel, 0, map(vel, START_VEL, 0, START_LERP, END_LERP));
	if(vel > 0 && vel < 0.1) {
		vel = 0;

		spinEnded();
	}

	angle %= 360;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function spin() {
	if(spinning) {
		console.log("Already spinning!");
		return;
	}

	vel = START_VEL - random(0, 8);
	spinning = true;
}

function spinEnded() {
	spinning = false;
	console.log("Spin ended");
}

function mousePressed() {
	if(mouseButton == "left") {
		spin();
	}
}

function keyPressed() {
	if(key == ' ') {
		spin();
	}
}
