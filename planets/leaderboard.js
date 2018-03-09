function Leaderboard() {
  this.names = [];
  this.points = [];

  this.draw = function() {
    var off = 15;
    var w = 230;
    var h = 280;
    var x = width - w - off;
    var y = off;

    // Draw rectangle
    stroke(0, 215);
    strokeWeight(2);
    fill(51, 215);
    rect(x, y, w, h);

    // Draw "Leaderboard" text
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(22);
    text("Leaderboard", x + w * 0.5, y + 24);

    // Draw player names
    textAlign(LEFT);
    textSize(18);
    var str = "";
    for(var i = 0; i < 10; i++) {
      var name = this.names[i];
      if(name == null) name = "";
      str += (i+1) + ".  " + name + "\n";
    }
    text(str, x + off, y + 50);

    // Draw points
    textAlign(RIGHT);
    textSize(18);
    str = "";
    for(var i = 0; i < 10; i++) {
      var points = this.points[i];
      if(points == null) points = "";
      str += points + "\n";
    }
    text(str, x + w - off, y + 50);
  }

  this.updatePositions = function(data) {
    for(var i = 0; i < 10; i++) {
      this.names[i] = data[i].name;
      this.points[i] = data[i].points;
    }
  }
}
