const timeAlive = 10;
const targetPoint = {x:600, y:240, r:20};
const perGeneration = 100;
const geneAmount = timeAlive * 60 * 2;

let rockets = [];
let obstacles = [];
let time = 0;

let speed = 1;
let mutationChance = 0.01;

let speedSlider, mutationSlider;

let avgRocket;

function setup() {
	let canvas = createCanvas(640, 480);
	canvas.parent("#canvas-holder")

	speedSlider = createSlider(0, 100, 1, 1);
	speedSlider.parent("#speed-slider-holder");

	mutationSlider = createSlider(0, 1, 0.01, 0.001);
	mutationSlider.parent("#mutation-slide-holder");

	// Generate a random generation
	randomGeneration();

	for(let i = 0; i < 5; i++) {
		obstacles.push({
			x: random(50, width),
			y: random(height),
			r: random(40, 150)
		});
	}
}

function draw() {
	speed = speedSlider.value();
	mutationChance = mutationSlider.value();

	background(51);

	fill(255, 255, 255);
	for(let i = 0; i < rockets.length; i++) {
		rockets[i].render();
	}
	fill(50, 255, 50);
	avgRocket.render();

	fill(255, 0, 255);
	for(let i = 0; i < obstacles.length; i++) {
		let o = obstacles[i];
		ellipse(o.x, o.y, o.r, o.r);
	}

	fill(255, 50, 50);
	ellipse(targetPoint.x, targetPoint.y, targetPoint.r, targetPoint.r);


	for(let j = 0; j < speed; j++) {
		for(let i = 0; i < rockets.length; i++) {
			rockets[i].update();
		}
		avgRocket.update();


		time++;
		if(time >= timeAlive * 60) {
			// Time's up.
			let rocketsFinished = 0;
			let rocketsStuck = 0;
			for(let k = 0; k < rockets.length; k++) {
				let r = rockets[k];
				if(r.finished)
					rocketsFinished++;
				else if(r.stuck)
					rocketsStuck++;
			}

			console.log("Rockets finished: " + rocketsFinished);
			console.log("Rockets stuck: " + rocketsStuck);

			breedGeneration();
		}
	}
}

function randomGeneration() {
	time = 0;

	for(let i = 0; i < perGeneration; i++)
		rockets[i] = new Rocket();

	updateAvgRocket();
}

function breedGeneration() {
	time = 0;

	// Let rockets live based on their fitness and a bit of randomness
	let lowFit = Infinity;
	let highFit = -Infinity;

	for(let i = 0; i < rockets.length; i++) {
		let fit = rockets[i].calculateFitness();
		if(fit < lowFit)
			lowFit = fit;
		if(fit > highFit)
			highFit = fit;
	}

	let alive = [];

	for(let i = 0; i < rockets.length; i++) {
		let r = rockets[i];
		let dieChance = map(r.calculateFitness(), lowFit, highFit, 1, 0);
		
		let lived = false;
		
		if(random() > dieChance) {
			// Live!
			alive.push(r);
			lived = true;
		}

		//console.log("Rocket with fitness " + r.calculateFitness() + " has " + floor(dieChance * 100) + "% chance of dying. Lived: " + lived);
	}

	if(alive.length == 0) {
		console.log("No alive rockets! Setting every rocket to be alive.");
		for(let i = 0; i < rockets.length; i++)
			alive.push(rockets[i]);
	}

	rockets = [];
	for(let i = 0; i < perGeneration; i++) {
		// Make new 'baby' rockets

		let parent = random(alive);
		let genes = mutate(parent.genes);	
		rockets.push(new Rocket(genes));
	}

	updateAvgRocket();
}

function updateAvgRocket() {
	let avgGenes = [];

	for(let i = 0; i < geneAmount; i++) {
		let avg = 0;
		for(let j = 0; j < rockets.length; j++) {
			avg += rockets[j].genes[i];
		}

		avg /= rockets.length;
		avgGenes[i] = avg;
	}

	avgRocket = new Rocket(avgGenes);
}

function mutate(genes) {
	let newGenes = [];

	for(let i = 0; i < genes.length; i++) {
		if(random() < mutationChance) {
			// Mutate!
			newGenes[i] = random();
		}else{
			// Don't mutate.
			newGenes[i] = genes[i];
		}
	}

	return newGenes;
}

function distSq(x1, y1, x2, y2) {
	return pow(x1 - x2, 2) + pow(y1 - y2, 2);
}

function Rocket(genes) {
	this.pos = {x:50, y:height/2};
	this.vel = {x:0, y:0};
	this.acc = {x:0, y:0};

	this.genes = genes;
	this.itt = 0;

	this.stuck = false;
	this.finished = false;

	if(!this.genes) {
		this.genes = [];
		for(let i = 0; i < geneAmount; i++) {
			this.genes[i] = random();
		}
	}

	this.update = function() {
		// Don't update if stuck
		if(this.stuck || this.finished || this.itt >= this.genes.length)
			return;

		// Update the acceleration
		this.acc.x += (this.genes[this.itt++] * 2 - 1);
		this.acc.y += (this.genes[this.itt++] * 2 - 1);



		// Update physics
		this.vel.x += this.acc.x;
		this.vel.y += this.acc.y;

		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;

		this.acc.x = this.acc.y = 0;

		this.vel.x *= 0.9;
		this.vel.y *= 0.9;

		// Check if rocket is stuck
		if(this.pos.x < 0 || this.pos.y < 0 || this.pos.x >= width || this.pos.y >= height)
			this.stuck = true;

		for(let i = 0; i < obstacles.length; i++) {
			let o = obstacles[i];
			if(distSq(this.pos.x, this.pos.y, o.x, o.y) < pow(o.r / 2, 2)) {
				this.stuck = true;
				break;
			}
		}

		// Check if rocket is finished
		if(distSq(this.pos.x, this.pos.y, targetPoint.x, targetPoint.y) < pow(targetPoint.r / 2, 2))
			this.finished = true;
	}

	this.render = function() {
		ellipse(this.pos.x, this.pos.y, 10, 10);
	}

	this.calculateFitness = function() {
		if(this.finished)
			return 1;

		let fit = 1 / dist(this.pos.x, this.pos.y, targetPoint.x, targetPoint.y);

		if(this.stuck)
			fit *= 0.2;

		return fit;
	}
}