
var maxSpeed = 10;
var mutationRate = 0.01;
var cloneRate = 0.004;
var foodRate = 0.2;
var poisonRate = 0.1;
var genes = 3;

var vehicles = [];

var food = [];
var poison = [];

var popId = 0;

var numAliveDom, avgDnaDom, timestepDom, resetPopDom, popIdDom;

function setup() {
	createCanvas(640, 480);

	newPopulation();

	numAliveDom = createP();
	avgDnaDom = createP();
	popIdDom = createP();
	timestepDom = createSlider(1, 100, 1, 1);
	createP("");
	resetPopDom = createButton("Reset population");

	resetPopDom.mousePressed(function() {
		newPopulation();
	});
}

function draw() {
	background(51);

	var numVehicles, avgDnaNums;

	for(var k = 0; k < timestepDom.value(); k++) {
		numVehicles = 0;
		avgDnaNums = [];
		for(var i = 0; i < genes; i++)
			avgDnaNums[i] = 0;

		for(var i = 0; i < vehicles.length; i++) {
			vehicles[i].update();

			if(vehicles[i].health <= 0) {
				// Vehicle died
				vehicles.splice(i--, 1);
				continue;
			}

			if(random() < cloneRate) {
				vehicles[i].clone();
			}

			numVehicles++;
			for(var j = 0; j < vehicles[i].dna.length; j++) {
				avgDnaNums[j] += vehicles[i].dna[j];
			}
		}

		if(vehicles.length == 0) {
			// All vehicles died out
			newPopulation();
		}

		if(random() < foodRate)
			food.push({x:random(width), y:random(height)});

		if(random() < poisonRate)
			poison.push({x:random(width), y:random(height)});
	}

	for(var i = 0; i < vehicles.length; i++) {
		vehicles[i].draw();
	}

	fill(0, 255, 0);
	for(var i = 0; i < food.length; i++) {
		ellipse(food[i].x, food[i].y, 5, 5);
	}

	fill(255, 0, 0);
	for(var i = 0; i < poison.length; i++) {
		ellipse(poison[i].x, poison[i].y, 5, 5);
	}

	var avgDnaTxt = "";
	for(var i = 0; i < genes; i++) {
		avgDnaNums[i] /= numVehicles;

		avgDnaTxt += "Avg. gene #" + i + ": " + avgDnaNums[i] + "<br>";
	}
	avgDnaDom.html(avgDnaTxt);

	numAliveDom.html("Number of vehicles alive: " + vehicles.length);

	popIdDom.html("Population ID: #" + popId);
}

function Vehicle(x, y, dna) {
	this.pos = {x:x||0, y:y||0};
	this.vel = {x:0, y:0};
	this.acc = {x:0, y:0};

	this.dna = dna || [];
	for(var i = 0; i < genes; i++) {
		if(!this.dna[i])
			this.dna[i] = random();
	}

	this.mass = map(this.dna[0], 0, 1, 0.5, 3);
	this.health = 1;

	this.cloneTimer = 60 * 3;
	if(!dna)
		this.cloneTimer = 0;
}

function newPopulation() {
	vehicles = [];
	for(var i = 0; i < 10; i++) {
		vehicles.push(new Vehicle(random(width), random(height)));
	}

	food = [];
	poison = [];

	for(var i = 0; i < 200 * foodRate; i++) {
		food.push({x:random(width), y:random(height)});
	}

	for(var i = 0; i < 200 * poisonRate; i++) {
		poison.push({x:random(width), y:random(height)});
	}

	popId++;
}

function distSq(x1, y1, x2, y2) {
	return pow(x1 - x2, 2) + pow(y1 - y2, 2);
}

Vehicle.prototype.update = function() {
	if(this.cloneTimer > 0)
		this.cloneTimer--;

	// Behaviour
	this.eat(food, 0.3, map(this.dna[1], 0, 1, -0.03, 0.03));
	this.eat(poison, -0.3, map(this.dna[2], 0, 1, -0.03, 0.03));

	this.health -= 0.005;

	// Physics
	this.vel.x += this.acc.x;
	this.vel.y += this.acc.y;
	this.vel.x *= 0.95;
	this.vel.y *= 0.95;

	if(this.vel.x > maxSpeed) this.vel.x = maxSpeed;
	else if(this.vel.x < -maxSpeed) this.vel.x = -maxSpeed;
	if(this.vel.y > maxSpeed) this.vel.y = maxSpeed;
	else if(this.vel.y < -maxSpeed) this.vel.y = -maxSpeed;

	this.acc.x = this.acc.y = 0;

	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
}

Vehicle.prototype.eat = function(list, healthEffect, attraction) {
	var closestDist = Infinity;
	var closest;

	for(var i = 0; i < list.length; i++) {
		var d = distSq(this.pos.x, this.pos.y, list[i].x, list[i].y);
		if(d < closestDist) {
			closestDist = d;
			closest = list[i];
		}
	}

	if(closest) {
		this.seek(closest.x, closest.y, attraction);

		if(closestDist < 10 * 10) {
			list.splice(list.indexOf(closest), 1);
			this.health += healthEffect;
		}
	}
}

Vehicle.prototype.clone = function() {
	if(this.cloneTimer > 0)
		return;

	var dna = [];
	for(var i = 0; i < this.dna.length; i++) {
		dna[i] = this.dna[i];
		if(random() < mutationRate) {
			dna[i] += random(-0.4, 0.4);
			if(dna[i] > 1) dna[i] = 1;
			if(dna[i] < 0) dna[i] = 0;
		}
	}
	vehicles.push(new Vehicle(this.pos.x, this.pos.y, dna));
}

Vehicle.prototype.draw = function() {
	fill(map(this.health, 0, 1, 255, 0), map(this.health, 0, 1, 0, 255), 0, 120);
	ellipse(this.pos.x, this.pos.y, 16 * this.mass, 16 * this.mass);
}

Vehicle.prototype.applyForce = function(fx, fy) {
	this.acc.x += fx / this.mass;
	this.acc.y += fy / this.mass;
}

Vehicle.prototype.seek = function(x, y, attraction) {
	if(!attraction) attraction = 0.1;
	this.applyForce((x - this.pos.x) * attraction, (y - this.pos.y) * attraction);
}