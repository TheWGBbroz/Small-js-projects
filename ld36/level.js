
/*

Example JSON:
{
  objects: [
    {
      name: "obj_name",   // Object name
      x: 32,              // Object X position
      y: 32               // Object Y position
    }
  ]
  finish: {
    x: 200,
    y: 200,
    w: 32,
    h: 32
  }
}

*/

function Level(json) {
  this.mapObjects = [];
  for(var i = 0; i < json.objects.length; i++) {
    var objName = json.objects[i].name;
    var x = json.objects[i].x;
    var y = json.objects[i].y;
    var objJson = null;
    for(var j = 0; j < mapObjectsJson.length; j++) {
      if(mapObjectsJson[j].name == objName) {
        objJson = mapObjectsJson[j];
        break;
      }
    }
    if(objJson == null) {
      console.log("Could not find any mapobject with name " + objName + "!");
      continue;
    }

    var mapObject = new MapObject(objJson, x, y);
    this.mapObjects.push(mapObject);
  }
  this.player = new Player(json.player.x, json.player.y);
  this.finish = createRect(json.finish.x, json.finish.y, json.finish.w, json.finish.h);

  this.deadOverlay = 0;
  this.fadeIn = 255;

  this.render = function() {
    for(var i = 0; i < this.mapObjects.length; i++) {
      this.mapObjects[i].render();
    }
    this.player.render();
  }

  this.renderNonGray = function() {
    if(this.deadOverlay > 0) {
      background(255, 0, 0, this.deadOverlay);

      textAlign(CENTER);
      noStroke();

      fill(255, clamp(map(this.deadOverlay, 0, 175, -100, 255), 0, 255));
      textSize(96);
      text("You died!", width * 0.5, 235);

      fill(255, clamp(map(this.deadOverlay, 0, 175, -200, 255), 0, 255));
      textSize(32);
      text("Click anywhere or press any button to respawn.", width * 0.5, 320);
    }

    if(this.fadeIn > 0) {
      background(0, this.fadeIn);
      this.fadeIn -= 4;
    }
  }

  this.update = function() {
    if(!this.player.dead) {
      for(var i = 0; i < this.mapObjects.length; i++) {
        this.mapObjects[i].update();
      }

      this.player.update();
      if(rectCollision(this.player.getCollisionBox(), this.finish)) {
        nextLevel();
      }
    }

    if(this.player.dead) this.deadOverlay += 2;
    if(this.deadOverlay > 175) this.deadOverlay = 175;
  }

  this.reset = function() {
    this.player = new Player(json.player.x, json.player.y)
    this.deadOverlay = 0;
    this.fadeIn = 255;
    for(var i = 0; i < this.mapObjects.length; i++) {
      if(this.mapObjects[i].ai != -1) {
        this.mapObjects[i].x = this.mapObjects[i].orginX;
        this.mapObjects[i].y = this.mapObjects[i].orginY;
      }
    }
  }
}
