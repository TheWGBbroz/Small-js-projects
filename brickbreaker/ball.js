var bl_sy = bl_spawn_yoff - bl_radius;

function Ball(x, y, xvel, yvel) {
	this.x = x;
	this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.dead = false;
	this.ydeadinterval = 20;
	
	this.update = function() {
		var velSwap = -1; // -1 = NONE  0 = X  1 = Y
		
		if(this.x < bl_radius || this.x > width - bl_radius) {
			velSwap = 0;
		}else if(this.y < bl_radius) {
			velSwap = 1;
		}
		
		if(this.ydeadinterval > 0) this.ydeadinterval--;
		
		if(this.y >= height && this.ydeadinterval == 0) {
			if(ball_orgin == null) ball_orgin = this.x;
			this.dead = true;
		}
		
		if(!(this.x > 0 && this.x < width && this.y > 0)) {
			this.dead = true;
		}
		
		
		for(var i = 0; i < bricks.length; i++) {
			var bx = bricks[i].getX();
			var by = bricks[i].getY();
			
			if(this.x > bx - bl_radius && this.x < bx + br_w + bl_radius && this.y > by - bl_radius && this.y < by + br_h + bl_radius) {
				// Is in brick
				var cx = bx + br_w / 2;
				var cy = by + br_h / 2;
				var xdis = this.x - cx; // xdis < 0 == left
				var ydis = this.y - cy; // ydis < 0 == up
				var left = xdis < 0;
				var up = ydis < 0;
				
				if(xdis < 0) xdis = -xdis;
				if(ydis < 0) ydis = -ydis;
				
				xdis = map(xdis, 0, br_w / 2, 0, 1);
				ydis = map(ydis, 0, br_h / 2, 0, 1);
				
				if(xdis > ydis) {
					// Collision is LEFT or RIGHT
					velSwap = 0;
				}else{
					// Collision is UP or DOWN
					velSwap = 1;
				}
				
				
				bricks[i].level--;
				if(bricks[i].level <= 0) {
					bricks[i].remove();
				}
			}
		}
		
		if(velSwap == 0)
			this.xvel = -this.xvel;
		else if(velSwap == 1)
			this.yvel = -this.yvel;
		
		this.x += this.xvel;
		this.y += this.yvel;
	}
	
	this.draw = function() {
		fill(bl_color);
		ellipse(this.x, this.y, bl_radius, bl_radius);
	}
}