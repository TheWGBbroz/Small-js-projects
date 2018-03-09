function Brick(row, col, level) {
	this.row = row;
	this.col = col;
	this.level = level;
	
	this.draw = function() {
		noStroke();
		
		var x = this.getX();
		var y = this.getY();
		
		var gr = map(this.level, 0, level_round, 140, 8);
		strokeWeight(2);
		stroke(51);
		fill(255, gr, 0, 255);
		rect(x, y, br_w, br_h);
		
		strokeWeight(1);
		noStroke();
		fill(255, 200);
		textAlign(CENTER);
		textSize(17);
		text(this.level, x + br_w / 2, y + br_h / 2 + 5);
	}
	
	this.remove = function() {
		bricks.splice(bricks.indexOf(this), 1);
	}
	
	this.getX = function() {
		return this.row * br_w + br_xoff;
	}
	
	this.getY = function() {
		return this.col * br_h + br_yoff; 
	}
}