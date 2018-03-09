function Door(row) {
  this.row = row;
  this.opened = false;

  this.draw = function() {
    stroke(0);
    fill(255);
    if(!this.opened)
      rect(this.row * doorSize, height / 2, doorSize, 3);
    else
      rect(this.row * doorSize, height / 2, 3, -doorSize);
  }

  this.toggle = function() {
    this.opened = !this.opened;
  }
}
