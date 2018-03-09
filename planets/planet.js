// Planet client values
var pln_hpBarCooldown = 60 * 3;

function Planet(x, y, size, id, imageid, maxHp, hp) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.id = id;
  this.imageid = imageid;
  this.maxHp = maxHp;
  this.hp = hp;
  this.remove = false;
  this.hpBarCooldown = 0;

  this.draw = function() {
    // Count down hpBarCooldown
    if(this.hpBarCooldown > 0) this.hpBarCooldown--;

    // Draw planet on screen
    if(isOnScreen(this.x, this.y, this.size)) {
      var x = this.x - camera.x;
      var y = this.y - camera.y
      // Draw planet image
      image(planetImages[this.imageid], x - this.size * 0.5, y - this.size * 0.5, this.size, this.size);

      // Draw HP bar
      if(this.hpBarCooldown > 0) {
        var hpx = x - 30;
        var hpy = y - this.size * 0.5 - 20;

        stroke(0);
        fill(0);
        rect(hpx, hpy, 60, 10);

        fill(map(this.hp, 0, this.maxHp, 255, 0), map(this.hp, 0, this.maxHp, 0, 255), 0);
        rect(hpx, hpy, map(this.hp, 0, this.maxHp, 0, 60), 10);
      }
    }
  }

  this.explode = function() {
    // Calculate particle values
    var size = map(this.size, 150, 270, 6, 9);
    var mxspeed = map(this.size, 150, 270, 9, 20);
    var amount = map(this.size, 150, 270, 180, 300);

    // Spawn 'amount' amount of particles
    for(var i = 0; i < amount; i++) {
      particles.push(new Particle(this.x, this.y, random(7, mxspeed), random(0.02, 0.11), size));
    }

    // Remove this planet
    this.remove = true;
  }

  // Check collision of an object with the planet
  this.collision = function(x, y, objSize) {
    objSize = objSize || 0;
    var sizeSq = (this.size + objSize) * 0.5;
    sizeSq = sizeSq * sizeSq;
    return distSq(this.x, this.y, x, y) < sizeSq;
  }

  // Show hp bar
  this.showHpBar = function() {
    this.hpBarCooldown = pln_hpBarCooldown;
  }
}
