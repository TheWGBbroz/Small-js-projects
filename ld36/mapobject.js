/* Example json

{
  name: "obj_name"    // Object name
  img: 2,             // Image ID
  width: 32,          // Optional
  height: 32,         // Optional
  hasCollision: true  // Object has collision or not
}

*/

function MapObject(json, x, y, rot) {
  this.x = x || 0;
  this.y = y || 0;
  this.rot = rot || 0;
  this.rot = radians(this.rot);
  this.name = json.name;
  this.img = json.img;
  this.animation = json.animation || false;
  this.width  = this.animation ? images[this.img[0]].width : images[this.img].width;
  this.height = this.animation ? images[this.img[0]].height : images[this.img].height;
  this.hasCollision = json.hasCollision;
  this.imgFrame = 0;
  this.animationWait = json.animationWait || 2;
  this.deadly = json.deadly || false;
  this.flipped = false;

  // ONLY AI
  this.ai = -1;
  if(json.ai != undefined) this.ai = json.ai;
  if(this.ai != -1) {
    this.orginX = this.x;
    this.orginY = this.y;
    this.left = false;
    this.right = false;
    this.jumping = false;
    this.xspeed = 0;
    this.yspeed = 0;
    this.aiSpeed = json.ai_speed || 6;
    this.aiJumpSpeed = json.ai_jumpspeed || 4;
    this.aiGravity = json.ai_gravity || 18;
    this.dead = false;
    this.onGround = false;

    if(this.ai == 1) {
      this.left = true;
    }
  }

  this.render = function() {
    var img = this.img;
    if(this.animation) img = img[this.imgFrame];
    img = images[img];

    if(this.width <= 1)
      this.width = img.width;
    if(this.height <= 1)
      this.height = img.height;

    push();
      translate(this.flipped ? this.x + this.width : this.x, this.y);
      if(this.flipped) scale(-1, 1);
      rotate(this.rot);
      image(img, 0, 0, this.width, this.height);
    pop();
  }

  this.update = function() {
    if(this.animation) {
      if(frameCount % this.animationWait == 0) {
        this.imgFrame++;
        if(this.imgFrame >= this.img.length) this.imgFrame = 0;
      }
    }

    if(this.ai != -1) {
      var level = levels[currLevel];
      // Move object
      if(this.left) {
        this.xspeed = lerp(this.xspeed, -this.aiSpeed, 0.4);
        this.flipped = true;
      }else if(this.right) {
        this.xspeed = lerp(this.xspeed,  this.aiSpeed, 0.4);
        this.flipped = false;
      }else{
        this.xspeed = lerp(this.xspeed, 0, 0.4);
      }

      if(this.jumping) {
        this.yspeed -= this.aiJumpSpeed;
        if(this.yspeed < -this.aiJumpSpeed * 5) this.jumping = false;
      }
      if(!this.jumping) this.yspeed = lerp(this.yspeed, this.aiGravity, 0.1);

      var newx = this.x + this.xspeed;
      var newy = this.y + this.yspeed;

      var collX = false;
      var collY = false;

      if(newx < 0 || newx + this.width > width) collX = true;
      if(newy < 0 || newy + this.height > height) collY = true;

      var objects = levels[currLevel].mapObjects;
      for(var i = 0; i < objects.length; i++) {
        if(objects[i] == this) continue;

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

      if(!collX)
        this.x = newx;
      if(!collY)
        this.y = newy;

      if(this.ai == 0) {
        // Basic player follow
        var playerDist = distSq(this.x, this.y, level.player.x, level.player.y);
        if(playerDist > 120 * 120) {
          if(level.player.x < this.x) {
            this.left  = true;
            this.right = false;
          }else{
            this.right = true;
            this.left  = false;
          }
        }else{
          if(this.y - level.player.y > 18) {
            this.jump();
          }
        }

        if(collX) this.jump();
      }else if(this.ai == 1) {
        // Basic move AI
        if(collX && this.left) {
          this.right = true;
          this.left = false;
        }else if(collX && this.right) {
          this.left = true;
          this.right = false;
        }
      }
    }
  }

  this.jump = function() {
    if(this.onGround) {
      this.jumping = true;
    }
  }

  this.getCollisionBox = function(x, y) {
    x = x || this.x;
    y = y || this.y;
    return createRect(x, y, this.width, this.height);
  }
}
