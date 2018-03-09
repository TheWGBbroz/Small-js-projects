function Particle(pos, vel, gravity) {
  var r = false;
  var g = false;
  var b = false;
  while((!r && !g && !b) || (r && g && b)) {
    r = random() < 0.25;
    g = random() < 0.25;
    b = random() < 0.25;
  }

  this.pos = pos || createVector(0, 0);
  this.vel = vel || createVector(0, 0);
  this.acc = createVector(0, 0);
  this.r = r ? random(180, 240) : 0;
  this.g = g ? random(180, 240) : 0;
  this.b = b ? random(180, 240) : 0;
  this.a = 255;
  this.gravity = gravity || createVector(0, 0.2);

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() {
    this.applyForce(this.gravity);

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.draw = function() {
    stroke(this.r, this.g, this.b, this.a);
    point(this.pos.x, this.pos.y);
  }
}
