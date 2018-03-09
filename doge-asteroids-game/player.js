function Player() {
  this.x = width / 2;
  this.y = height - 60;
  this.xspeed = 8;
  this.size = 30;
  this.left = false;
  this.right = false;
  this.hp = 100;
  this.score = 0;
  this.dead = false;

  this.update = function() {
    if(this.left) {
      this.x -= this.xspeed;
    }else if(this.right) {
      this.x += this.xspeed;
    }

    if(this.x < 0) this.x = 0;
    if(this.x + this.size > width) this.x = width - this.size;

    var aRect = {
      left: this.x,
      right: this.x + this.size,
      top: this.y,
      bottom: this.y + this.size
    };
    for(var i = 0; i < asteroids.length; i++) {
      var bRect = {
        left: asteroids[i].x,
        right: asteroids[i].x + asteroids[i].size,
        top: asteroids[i].y,
        bottom: asteroids[i].y + asteroids[i].size
      };
      if(!asteroids[i].remove && intersects(aRect, bRect)) {
        asteroids[i].remove = true;
        this.hp -= 10;
        if(this.hp <= 0 && !this.dead) {
          this.hp = 0;
          this.dead = true;
          gameOver();
        }

        break;
      }
    }

    if(!this.dead)
      this.score++;
  }

  this.draw = function() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.size, this.size);

    fill(255);
    textSize(26);
    text("HP: " + floor(this.hp), 3, 26);
    text("Score: " + floor(this.score), 3, 52);
  }

  this.move = function(speed) {
    this.xspeed = speed;
  }
}
