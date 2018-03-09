function Snake() {
	this.x = width / 2;
	this.y = height / 2;
	this.xspeed = 1;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];
	
	this.update = function() {
		if(this.total === this.tail.length) {
			for(var i = 0; i < this.tail.length-1; i++) {
				this.tail[i] = this.tail[i+1];
			}
		}
		this.tail[this.total-1] = createVector(this.x, this.y);
		
		this.x += this.xspeed * scl;
		this.y += this.yspeed * scl;
		
		if(this.x < 0 || this.y < 0 || this.x > width - 1 || this.y > height - 1)
			this.startOver();
	}
	
	this.show = function() {
		fill(255);
		
		for(var i = 0; i < this.tail.length; i++) {
			rect(this.tail[i].x, this.tail[i].y, scl, scl);
		}
		
		rect(this.x, this.y, scl, scl);
	}
	
	this.dir = function(x, y) {
		if(this.xspeed === 0 || x === 0)
			this.xspeed = x;
		if(this.yspeed === 0 || y === 0)
			this.yspeed = y;
	}
	
	this.eat = function(pos) {
		var d = dist(this.x, this.y, pos.x, pos.y);
		if(d < 1) {
			this.total++;
			return true;
		}else{
			return false;
		}
	}
	
	this.death = function() {
		for(var i = 0; i < this.tail.length; i++) {
			var pos = this.tail[i];
			var d = dist(this.x, this.y, pos.x, pos.y);
			if(d < 1) {
				this.startOver();
			}
		}
	}
	
	this.startOver = function() {
		console.log("Starting over");
		this.total = 0;
		this.tail = [];
		this.x = width / 2;
		this.y = height / 2;
	}
	
	
}