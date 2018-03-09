// Player server values
var pl_size = 1;
var pl_maxhp = 1;
var pl_maxSpeed = 1;

// Player client values
var pl_hpBarCooldown = 60 * 3;

function Player(x, y, dir) {
  this.x = new SmoothMovement(x || 0);
  this.y = new SmoothMovement(y || 0);
  this.dir = new SmoothMovement(dir || 0);
  this.skinid = floor(random(totalSkins)); // TODO: Change to user input
  this.id = null;
  this.hp = pl_maxhp;
  this.hpBarCooldown = 0;
  this.name = "No Name";
  this.speed = 0;
  this.smokeTimer = 0;

  this.draw = function() {
    // Draw player to screen
    if(isOnScreen(this.x.position, this.y.position, pl_size)) {
      var x = this.x.position - camera.x;
      var y = this.y.position - camera.y;
      // Draw player
      push();
        translate(x, y);
        rotate(radians(this.dir.position));
        image(skinImages[this.skinid], skinImages[this.skinid].width * -0.5, skinImages[this.skinid].height * -0.5, skinImages[this.skinid].width, skinImages[this.skinid].height);
      pop();

      // Draw hp bar
      if(this == player || this.hpBarCooldown > 0) {
        if(this.hpBarCooldown > 0)
          this.hpBarCooldown--;
        var hpx = x - 30;
        var hpy = y - pl_size * 0.5 - (this == player ? 20 : 40);

        stroke(0);
        fill(0);
        rect(hpx, hpy, 60, 10);

        fill(map(this.hp, 0, pl_maxhp, 255, 0), map(this.hp, 0, pl_maxhp, 0, 255), 0);
        rect(hpx, hpy, map(this.hp, 0, pl_maxhp, 0, 60), 10);
      }

      // Draw name
      if(this != player) {
        noStroke();
        fill(0);
        textAlign(CENTER);
        textSize(19);
        text(this.name, x, y - pl_size * 0.5 - 10);
      }
    }
  }

  this.update = function() {
    // Update SmoothMovement objects
    this.dir.update();
    this.x.update();
    this.y.update();

    // Spawn smoke particles
    this.smokeTimer++;
    if(this.smokeTimer > map(this.speed, 0, pl_maxSpeed, 9, 1)) {
      this.smokeParticles();
      this.smokeTimer = 0;
    }
  }

  // Check collision of an object with the player
  this.collision = function(x, y, objSize) {
    objSize = objSize || 0;
    var sizeSq = (pl_size + objSize) * 0.5;
    sizeSq = sizeSq * sizeSq;
    return distSq(this.x.position, this.y.position, x, y) < sizeSq;
  }

  // Show hp bar
  this.showHpBar = function() {
    this.hpBarCooldown = pl_hpBarCooldown;
  }

  // Spawn smoke particles
  this.smokeParticles = function() {
    var off = getRotatedOffsets(this.dir.position, 37, 0);
    for(var i = 0; i < 2; i++) {
      particles.push(new Particle(this.x.position + off.x, this.y.position + off.y, random(2, 4), random(0.1, 0.2)));
    }
  }
}
