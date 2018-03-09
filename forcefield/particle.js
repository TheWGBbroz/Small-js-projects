function Particle() {
	this.pos = createVector(random(width), random(height));
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxSpeed = 6;
	this.lastPos = this.pos.copy();
	
	this.rgb = createVector(random() >= 0.5 ? random(200, 255) : 0, random() >= 0.5 ? random(200, 255) : 0, random() >= 0.5 ? random(200, 255) : 0);
	
	this.update = function() {
		this.updatePrev();
		
		var x = floor(this.pos.x / scl);
		var y = floor(this.pos.y / scl);
		var index = x + y * cols;
		var force = flowfield[index];
		this.acc.add(force);
		
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
		
		if(this.pos.x > width) {
			this.pos.x = 0;
			this.updatePrev();
		}
		if(this.pos.x < 0) {
			this.pos.x = width;
			this.updatePrev();
		}
		if(this.pos.y > height) {
			this.pos.y = 0;
			this.updatePrev();
		}
		if(this.pos.y < 0) {
			this.pos.y = height;
			this.updatePrev();
		}
	}
	
	this.updatePrev = function() {
		this.lastPos = this.pos.copy();
	}
	
	this.draw = function() {
		if(rnbclr.elt.checked)
			stroke(this.rgb.x, this.rgb.y, this.rgb.z, alpha);
		else
			stroke(0, alpha);
		strokeWeight(1);
		line(this.pos.x, this.pos.y, this.lastPos.x, this.lastPos.y);
	}
}