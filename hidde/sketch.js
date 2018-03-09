var x = 0;
var y = 0;
var mp = false;

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("canvas");
	background(51);
}

function draw() {
	if(mp) {
		var mx = mouseX - 40;
		var my = mouseY - 40;
		var ang = atan2(my - y, mx - x);
		x += cos(ang) * 10;
		y += sin(ang) * 10;
	}

	rect(x, y, 80, 80);
}


function mousePressed() {
	mp = true;
}

function mouseReleased() {
	mp = false;
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	background(51);
}
