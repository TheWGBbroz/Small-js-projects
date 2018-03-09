var sponge;
var subSponges = [];

function setup() {
  createCanvas(600, 600);
  sponge = new Sponge(0, 0, width, height);
  subSponges[0] = sponge;
}

function draw() {
  background(255);

  stroke(51);
  fill(0);
  sponge.draw();
}

function mousePressed() {
  var newSponges = [];

  for(var i = 0; i < subSponges.length; i++) {
    subSponges[i].split();
    for(var j = 0; j < subSponges[i].children.length; j++) {
      newSponges.push(subSponges[i].children[j]);
    }
  }

  for(var i = 0; i < newSponges.length; i++) {
    subSponges.push(newSponges[i]);
  }
}
