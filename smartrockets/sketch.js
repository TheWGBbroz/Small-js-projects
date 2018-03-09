
var rockets = [];
var matingpool = [];
var obstacles = [];

var lifespan = 120;
var lifespanP;
var amountFinishedP;
var count = 0;
var mutationRate = 0.0006;

var target;
var targetSize = 15;

var loopsPerFrame = 1;

function setup() {
	var canvas = createCanvas(640, 480);
	canvas.parent("canvas_div");

	target = createVector(width / 2, 50);

	var popsize = 50;
	for(var i = 0; i < popsize; i++) {
		rockets[i] = new Rocket();
	}

	lifespanP = createP("");
	amountFinishedP = createP("");

	var fastButton = createButton("Speed up");
	var isFast = false;
	fastButton.mousePressed(function() {
		if(!isFast) {
			loopsPerFrame = 330;
			fastButton.html("Slow down");
		}else{
			loopsPerFrame = 1;
			fastButton.html("Speed up");
		}
		isFast = !isFast;
	});
}

function draw() {
	background(51);

	for(var k = 0; k < loopsPerFrame; k++) {
		count++;
		if(count > lifespan) {
			count = 0;

			var amountFinished = 0;
			for(var i = 0; i < rockets.length; i++) {
				if(rockets[i].finished) {
					amountFinished++;
				}
			}
			amountFinishedP.html("Amount finished: " + amountFinished);

			evaluate();
			selection();
		}
		lifespanP.html(count);

		for(var i = 0; i < rockets.length; i++) {
			rockets[i].update();
		}

	}

	for(var i = 0; i < rockets.length; i++) {
		rockets[i].draw();
	}

	fill(255);
	ellipse(target.x, target.y, targetSize * 2, targetSize * 2);

	for(var i = 0; i < obstacles.length; i++) {
		obstacles[i].draw();
	}
}

function mousePressed() {
	if(randomBoolean()) {
		obstacles.push(new RectObstacle(mouseX, mouseY, random(10, 30), random(10, 30)));
	}else{
		obstacles.push(new EllipseObstacle(mouseX, mouseY, random(8, 35)));
	}
}

function evaluate() {
	var maxfit = 0;
	for(var i = 0; i < rockets.length; i++) {
		var d = dist(rockets[i].pos.x, rockets[i].pos.y, target.x, target.y);
		d = clamp(d, 0, width);
		rockets[i].fitness = width - d;
		if(rockets[i].finished) {
			rockets[i].fitness += (lifespan - rockets[i].finishTime) * 4;
		}else if(rockets[i].crashed) {
			rockets[i].fitness -= 300;
		}

		if(rockets[i].fitness > maxfit) {
			maxfit = rockets[i].fitness;
		}
	}
	if(maxfit <= 0) maxfit = 0.001;


	matingpool = [];
	for(var i = 0; i < rockets.length; i++) {
		rockets[i].fitness /= maxfit;

		var n = rockets[i].fitness * 10;
		for(var j = 0; j < n; j++) {
			matingpool.push(rockets[i]);
		}
	}
}

function selection() {
	var newrockets = [];
	for(var i = 0; i < rockets.length; i++) {
		var parentA = matingpool[floor(random(matingpool.length))].dna;
		var parentB = matingpool[floor(random(matingpool.length))].dna;

		var child = parentA.crossover(parentB);
		newrockets[i] = new Rocket(child);
	}

	rockets = newrockets;
}


function RectObstacle(x, y, w, h) {
	this.x = x - w * 0.5;
	this.y = y - h * 0.5;
	this.w = w;
	this.h = h;

	this.draw = function() {
		rectMode(CORNER);
		fill(255, 150);
		rect(this.x, this.y, this.w, this.h);
	}

	this.collision = function(ox, oy) {
		return ox > this.x && oy > this.y && ox < this.x + this.w && oy < this.y + this.h;
	}
}

function EllipseObstacle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;

	this.draw = function() {
		fill(255, 150);
		ellipse(this.x, this.y, this.r * 2, this.r * 2);
	}

	this.collision = function(ox, oy) {
		return distSq(this.x, this.y, ox, oy) < this.r * this.r;
	}
}

function DNA(genes) {
	if(genes) {
		this.genes = genes;
	}else{
		this.genes = [];
		for(var i = 0; i < lifespan; i++) {
			this.genes[i] = randomGene();
		}
	}

	this.mutate = function() {
		for(var i = 0; i < this.genes.length; i++) {
			if(random() < mutationRate) {
				this.genes[i - 1] = randomGene();
				this.genes[i + 0] = randomGene();
				this.genes[i + 1] = randomGene();
			}
		}
	}

	this.crossover = function(other) {
		var mid = random(lifespan);
		var newgenes = [];
		for(var i = 0; i < lifespan; i++) {
			if(randomBoolean()) {
				newgenes[i] = this.genes[i];
			}else{
				newgenes[i] = other.genes[i];
			}
		}

		var newdna = new DNA(newgenes);
		newdna.mutate();
		return newdna;
	}
}

function Rocket(dna) {
	this.pos = createVector(width / 2, height - 30);
	this.vel = createVector(0, -1);
	this.acc = createVector();
	this.dna = dna || new DNA();
	this.fitness = 0;
	this.finished = false;
	this.finishTime = 0;
	this.crashed = false;

	this.update = function() {
		if(!this.finished && !this.crashed) {
			this.acc.add(this.dna.genes[count]);

			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);

			this.checkCollision();
		}

		var d = distSq(this.pos.x, this.pos.y, target.x, target.y);
		if(d < targetSize * targetSize) {
			this.finished = true;
			this.finishTime = count;
		}
	}

	this.draw = function() {
		fill(255, 150);
		rectMode(CENTER);
		push();
			translate(this.pos.x, this.pos.y);
			rotate(this.vel.heading());
			rect(0, 0, 30, 5);
		pop();
	}

	this.checkCollision = function() {
		var col = false;

		if(this.pos.x < 0 || this.pos.y < 0 || this.pos.x > width || this.pos.y > height) col = true;

		for(var i = 0; i < obstacles.length; i++) {
			if(obstacles[i].collision(this.pos.x, this.pos.y)) {
				col = true;
				break;
			}
		}

		if(col) {
			this.crashed = true;
		}
	}
}

function clamp(val, min, max) {
	if(val < min) val = min;
	if(val > max) val = max;
	return val;
}

function distSq(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function randomGene() {
	var gene = p5.Vector.random2D();
	gene.mult(0.6);
	return gene;
}

function randomBoolean() {
	return random() < 0.5;
}
