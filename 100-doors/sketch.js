var doors = [];
var timesToggled = 0;
var doorSize = 9;

function setup() {
  createCanvas(doorSize * (100 + 2), 130);

  for(var i = 0; i < 100; i++) {
    doors[i] = new Door(i + 1);
  }
}

function draw() {
  background(51);

  for(var i = 0; i < doors.length; i++) {
    doors[i].draw();
  }
}

function mousePressed() {
  toggleAll();
}

function keyPressed() {
  if(key == ' ') {
    for(var i = 0; i < 100; i++)
      toggleAll();
  }

  if(key == 'R') {
    for(var i = 0; i < doors.length; i++) {
      doors[i].opened = false;
    }
    timesToggled = 0;
  }
}

function toggleAll() {
  timesToggled++;

  for(var i = 0; i < doors.length; i++) {
    if((i + 1) % timesToggled == 0) {
      doors[i].toggle();
    }
  }
}
