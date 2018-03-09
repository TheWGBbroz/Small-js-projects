function Sponge(x, y, scl) {
  this.x = x;
  this.y = y;
  this.scl = scl;
  this.children = [];
  this.hasSplit = false;

  this.draw = function() {
    if(!this.hasSplit) {
      rect(this.x, this.y, this.scl, this.scl);
    }else{
      for(var i = 0; i < this.children.length; i++) {
        this.children[i].draw();
      }
    }
  }

  this.split = function() {
    if(!this.hasSplit) {
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          if(i == 1 && j == 1) continue;

          var newScl = this.scl / 3;
          var s = new Sponge(this.x + i * newScl, this.y + j * newScl, newScl);
          this.children.push(s);
        }
      }
      this.hasSplit = true;
    }
  }
}
