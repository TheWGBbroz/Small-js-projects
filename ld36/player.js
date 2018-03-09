
var pl_speed = 6;
var pl_jumpspeed = 4;
var pl_gravity = 18;
function Player(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.imgFrame = 0;

  this.flipped = false;
  this.left = false;
  this.right = false;
  this.jumping = false;

  this.xspeed = 0;
  this.yspeed = 0;
  this.onGround = false;

  this.dead = false;

  this.update = function() {
    if(this.left || this.right) {
      if(frameCount % 2 == 0) {
        this.imgFrame++;
        if(this.imgFrame > 10) this.imgFrame = 0;
      }
    }else
      this.imgFrame = 0;

    if(this.left) {
      this.xspeed = lerp(this.xspeed, -pl_speed, 0.4);
      this.flipped = true;
    }else if(this.right) {
      this.xspeed = lerp(this.xspeed,  pl_speed, 0.4);
      this.flipped = false;
    }else{
      this.xspeed = lerp(this.xspeed, 0, 0.4);
    }

    if(this.jumping) {
      this.yspeed -= pl_jumpspeed;
      if(this.yspeed < -pl_jumpspeed * 5) this.jumping = false;
    }
    if(!this.jumping) this.yspeed = lerp(this.yspeed, pl_gravity, 0.1);

    var newx = this.x + this.xspeed;
    var newy = this.y + this.yspeed;

    var collX = false;
    var collY = false;

    if(newx < 0 || newx + playerImages[this.imgFrame].width > width) collX = true;
    if(newy < 0 || newy + playerImages[this.imgFrame].height > height) collY = true;

    var objects = levels[currLevel].mapObjects;
    for(var i = 0; i < objects.length; i++) {
      if(rectCollision(objects[i].getCollisionBox(), this.getCollisionBox(newx, this.y))) {
        if(objects[i].hasCollision)
          collX = true;
        if(objects[i].deadly)
          this.dead = true;
      }
      if(rectCollision(objects[i].getCollisionBox(), this.getCollisionBox(this.x, newy))) {
        if(objects[i].hasCollision)
          collY = true;
        if(objects[i].deadly)
          this.dead = true;
      }
    }

    this.onGround = collY && this.yspeed >= 0;
    if(!this.onGround) this.imgFrame = 2;

    if(!collX)
      this.x = newx;
    if(!collY)
      this.y = newy;
  }

  this.render = function() {
    var img = playerImages[this.imgFrame];
    if(this.flipped) {
      push();
        translate(this.x + img.width, this.y);
        scale(-1, 1);
        image(img, 0, 0);
      pop();
    }else
      image(img, this.x, this.y);
  }

  this.jump = function() {
    if(this.onGround)
      this.jumping = true;
  }

  this.getCollisionBox = function(x, y) {
    var x = x || this.x;
    var y = y || this.y;
    return createRect(x, y, playerImages[this.imgFrame].width, playerImages[this.imgFrame].height);
  }
}
