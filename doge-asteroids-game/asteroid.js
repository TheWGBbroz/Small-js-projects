function Asteroid() {
  this.x = random(width);
  this.y = -50;
  this.z = random(0, 800);
  this.yspeed = map(this.z, 0, 800, 8, 15);
  this.size = map(this.z, 0, 800, 18, 40);

  this.gray = random(20, 100);
  this.remove = false;

  this.update = function() {
    this.y += this.yspeed;

    if(this.y > height) {
      this.remove = true;
    }
  }

  this.draw = function() {
    fill(this.gray);
    rect(this.x, this.y, this.size, this.size);
  }
}
