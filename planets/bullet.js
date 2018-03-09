// Bullet server values
var bl_speed = 0;

function Bullet(x, y, dir, imageid, owner) {
  this.x = x;
  this.y = y;
  this.dirRad = radians((dir + 180) % 360);
  this.lifetime = 0;
  this.imageid = imageid;
  this.owner = owner;
  this.ownerid = this.owner.id;
  this.remove = false;

  this.draw = function() {
    // Draw bullet to screen
    if(isOnScreen(this.x, this.y)) {
      push();
        translate(this.x - camera.x, this.y - camera.y);
        rotate(this.dirRad);
        image(skinImages[totalSkins + this.imageid], skinImages[totalSkins + this.imageid].width * -0.5, skinImages[totalSkins + this.imageid].height * -0.5, skinImages[totalSkins + this.imageid].width, skinImages[totalSkins + this.imageid].height);
      pop();
    }
  }

  this.update = function() {
    // Update lifetime
    this.lifetime++;

    // Update position
    this.x += cos(this.dirRad) * bl_speed;
    this.y += sin(this.dirRad) * bl_speed;

    // Check for collision
    var collision = false;
    if(!collision) {
      if(player.id != this.ownerid && player.collision(this.x, this.y)) {
        collision = true;
        owner.showHpBar();
      }
    }
    if(!collision) {
      for(var i = 0; i < players.length; i++) {
        if(players[i].id != this.ownerid && players[i].collision(this.x, this.y)) {
          collision = true;
          players[i].showHpBar();
          break;
        }
      }
    }
    if(!collision) {
      for(var i = 0; i < planets.length; i++) {
        if(planets[i].collision(this.x, this.y)) {
          collision = true;
          planets[i].showHpBar();
          break;
        }
      }
    }

    // If collision, spawn particles and remove bullet
    if(collision && !this.remove) {
      for(var j = 0; j < 50; j++) {
        particles.push(new Particle(this.x, this.y, random(3, 6), random(0.1, 0.2)));
      }

      this.remove = true;
    }

    // Check if this bullet should be removed or not
    if(this.lifetime > 60 * 5) {
      this.remove = true;
    }
  }
}
