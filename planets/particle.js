function Particle(x, y, speed, speedMin, size) {
  this.x = x;
  this.y = y;
  this.dir = random(360);
  this.speed = speed || 5;
  this.maxSpeed = this.speed;
  this.speedMin = speedMin || 0.5;
  this.size = size || 8;
  this.remove = false;

  if(this.speedMin <= 0) this.speedMin = 0.001;

  this.draw = function() {
    // Draw particle to screen
    if(isOnScreen(this.x, this.y)) {
      fill(170, map(this.speed, 0, this.maxSpeed, 0, 140));
      rect(this.x - camera.x, this.y - camera.y, this.size, this.size);
    }
  }

  this.update = function() {
    // Update position
    var rad = radians(this.dir);
    this.x += cos(rad) * this.speed;
    this.y += sin(rad) * this.speed;

    // Update speed
    this.speed -= this.speedMin;
    if(this.speed < 0) this.speed = 0;

    // Check if this particle should be removed
    if(this.speed <= 0) {
      this.remove = true;
    }
  }
}
