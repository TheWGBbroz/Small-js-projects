function Firework() {
  this.firework = new Particle(createVector(random(width), height), createVector(0, random(-12, -8)));
  this.exploded = false;
  this.particles = [];

  this.update = function() {
    if(!this.exploded) {
      this.firework.update();

      if(this.firework.vel.y >= 0) {
        this.explode();
      }
    }

    for(var i = 0; i < this.particles.length; i++) {
      this.particles[i].vel.mult(0.98);
      this.particles[i].update();

      this.particles[i].a -= 5;

      if(this.particles[i].a <= 0 || this.particles[i].pos.y > height || this.particles[i].pos.x < 0 || this.particles[i].pos.x > width) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  this.draw = function() {
    if(!this.exploded)
      this.firework.draw();

    for(var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
    }
  }

  this.explode = function() {
    this.exploded = true;

    for(var i = 0; i < slider_explodeAmount.value(); i++) {
      var vel = getFWVel(random(360));

      var p = new Particle(this.firework.pos.copy(), vel, vel.copy().mult(0.01));
      this.particles.push(p);
    }
  }

  this.shouldRemove = function() {
    return this.exploded && this.particles.length == 0;
  }
}
