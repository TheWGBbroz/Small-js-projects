var circle = false;
var grootte = 50;

var maxgrootte = 2125;

function setup() {
  createCanvas(windowWidth, windowHeight);
  button = createButton('Play');
  button.position(windowWidth / 2 - 150, windowHeight / 2 - 50);
  button.mousePressed(clicked);
  button.size(300, 100);
}

function draw() {
  background(51);
  if(circle && grootte <= maxgrootte) {
    noStroke();
    fill(18, 191, 206);
    ellipse(windowWidth / 2, windowHeight / 2, grootte, grootte);
    grootte += 60;
    button.hide();
  }else if(grootte >= maxgrootte) {
    background(18, 191, 206);
  }
}

function clicked() {
  circle = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}