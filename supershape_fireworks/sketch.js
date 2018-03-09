var fireworks = [];

var slider_n1, slider_n2, slider_n3, slider_m, slider_a, slider_b, slider_explodeAmount, slider_spawnChance, cb_randomSupershape;

function setup() {
	createCanvas(600, 400);
	stroke(255);
	strokeWeight(4);

	createP("&nbsp;n1");
	slider_n1 = createSlider(0, 10, 1, 0.01);

	createP("&nbsp;n2");
	slider_n2 = createSlider(0, 10, 1, 0.01);

	createP("&nbsp;n3");
	slider_n3 = createSlider(0, 10, 1, 0.01);

	createP("&nbsp;m");
	slider_m  = createSlider(0, 10, 1, 0.01);

	createP("&nbsp;a");
	slider_a  = createSlider(0, 10, 1, 0.01);

	createP("&nbsp;b");
	slider_b  = createSlider(0, 10, 1, 0.01);

	createP("&nbsp;Explode particle amount");
	slider_explodeAmount = createSlider(1, 800, 100, 1);

	createP("&nbsp;Firework spawn chance");
	slider_spawnChance = createSlider(0, 1, 0.05, 0.0001);

	createP("&nbsp;Random supershape values");
	cb_randomSupershape = createCheckbox();

	fireworks.push(new Firework());
}

function draw() {
	background(51, 75);

	if(random() < slider_spawnChance.value())
		fireworks.push(new Firework());

	for(var i = 0; i < fireworks.length; i++) {
		fireworks[i].update();
		fireworks[i].draw();

		if(fireworks[i].shouldRemove()) {
			fireworks.splice(i, 1);
			i--;
		}
	}
}


function getFWVel(angle) {
	if(cb_randomSupershape.elt.checked) {
		return supershape(angle, random(0, 3), random(0, 3), random(0, 3), random(0, 3), 1, 1);
	}else{
		return supershape(angle, slider_n1.value(), slider_n2.value(), slider_n3.value(), slider_m.value(), slider_a.value(), slider_b.value());
	}
}

function sgn(val) {
	if(val > 0) return 1;
	if(val < 0) return -1;
	return 0;
}

function superellipse(angle, n, a, b) {
	angle = angle || random(360);
	n = n || 1;
	a = a || 1;
	b = b || 1;

	var na = 2 / n;
	var x = pow(abs(cos(angle)), na) * a * sgn(cos(angle));
	var y = pow(abs(sin(angle)), na) * b * sgn(sin(angle));

	return createVector(x, y);
}

function supershape(angle, n1, n2, n3, m, a, b) {
	angle = angle || random(360);
	n1 = n1 || 1;
	n2 = n2 || 1;
	n3 = n3 || 1;
	m  = m  || 1;
	a  = a  || 1;
	b  = b  || 1;

	var part1 = pow(abs((1 / a) * cos(angle * m / 4)), n2);
	var part2 = pow(abs((1 / b) * sin(angle * m / 4)), n3);
	var part3 = sqrt(part1 + part2) * n1;

	var r = part3 == 0 ? 0 : (1 / part3);

	var x = r * cos(angle);
	var y = r * sin(angle);

	return createVector(x, y);
}

function createCheckbox() {
	var checkbox = createInput();
	checkbox.attribute("type", "checkbox");
	return checkbox;
}
