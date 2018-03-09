var inc = 0.1;
var scl = 20;
var cols;
var rows;
var mag = 1.5;
var pointerspeed = 0.0003;
var alpha = 5;

var zoff = 0;

var fr;
var ufr = 0;

var particles = [];
var flowfield;

var clrbg, rnbclr, magin, msin, swpnts, spnts, pntss, pain, alin, rsp;

function setup() {
	createCanvas(640, 480);
	
	cols = floor(width / scl);
	rows = floor(height / scl);
	
	fr = createP("fps: " + floor(frameRate()));
	
	flowfield = new Array(cols * rows);
	
	createP("Clear background");
	clrbg = createCheckbox();
	
	createP("Rainbow colors");
	rnbclr = createCheckbox();
	
	createP("Show pointers");
	swpnts = createCheckbox();
	
	createP("Static pointers");
	spnts = createCheckbox();
	
	createP("Magnitude");
	magin = createInput("1.5");
	magin.changed(newMaxMag);
	newMaxMag();
	
	createP("Max speed");
	msin = createInput("6");
	msin.changed(newMaxSpeed);
	newMaxSpeed();
	
	createP("Pointer speed");
	pntss = createInput("3");
	pntss.changed(newPointerSpeed);
	newPointerSpeed();
	
	createP("Particle amount");
	pain = createInput("800");
	pain.changed(newParticleAmount);
	
	createP("Particle alpha");
	alin = createInput("5");
	alin.changed(newAlpha);
	newAlpha();
	
	createP("Reset particles");
	rsp = createButton("Reset particles");
	rsp.mousePressed(resetParticles);
	
	for(var i = 0; i < 800; i++) {
		particles[i] = new Particle();
	}
}

function newMaxSpeed() {
	var ms = parseFloat(msin.value());
	for(var i = 0; i < particles.length; i++) {
		particles[i].maxSpeed = ms;
	}
}

function newMaxMag() {
	mag = parseFloat(magin.value());
}

function newPointerSpeed() {
	var s = parseFloat(pntss.value());
	pointerspeed = s / 10000;
}

function newParticleAmount() {
	var amount = parseInt(pain.value());
	var diff = amount - particles.length;
	if(diff > 0) {
		// Add particles
		for(var i = 0; i < diff; i++) {
			particles.push(new Particle());
		}
	}else if(diff < 0) {
		// Remove particles
		diff = -diff;
		particles.splice(0, diff);
	}
}

function newAlpha() {
	var a = parseFloat(alin.value());
	if(a < 0) a = 0;
	if(a > 255) a = 255;
	alpha = a;
}

function resetParticles() {
	var amount = particles.length;
	particles = [];
	for(var i = 0; i < amount; i++) {
		particles[i] = new Particle();
	}
}

function draw() {
	if(clrbg.elt.checked)
		background(255);
	
	stroke(0, 50);
	strokeWeight(2);
	var yoff = 0;
	for(var y = 0; y < rows; y++) {
		var xoff = 0;
		
		for(var x = 0; x < cols; x++) {
			var index = (x + y * cols);
			var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
			xoff += inc;
			
			var v = p5.Vector.fromAngle(angle);
			v.setMag(mag);
			flowfield[index] = v;
			
			if(swpnts.elt.checked) {
				clrbg.elt.checked = true;
				push();
				  translate(x * scl, y * scl);
				  rotate(v.heading());
				  line(0, 0, scl, 0);
				pop();
			}

		}
		
		yoff += inc;
		
		if(!spnts.elt.checked)
			zoff += pointerspeed;
	}
	strokeWeight(1);
	
	for(var i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();
	}
	
	
	ufr++;
	ufr %= 60;
	if(ufr == 0)
		fr.html("fps: " + floor(frameRate()));
}

function createCheckbox() {
	var checkbox = createInput();
	checkbox.attribute("type", "checkbox");
	return checkbox;
}