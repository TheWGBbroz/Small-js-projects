var data = [];

const SUNRISE_THRESHOLD = 270;
const SUNSET_THRESHOLD = 270;

function setup() {
	createCanvas(1000, 480);
	loadData();

	setInterval(() => {
		loadData();
	}, 1 * 1000);
}

function draw() {
	background(230);

	stroke(0);

	var closest;
	var closestDist = width * width;

	var closestEI;
	var closestEIDist = width * width;

	for(var i = 1; i < data.length; i++) {
		line(data[i].x, data[i].y, data[i - 1].x, data[i - 1].y);

		if(data[i].color) {
			fill(data[i].color);
			ellipse(data[i].x, data[i].y, 10, 10);
		}

		var dst = dist(mouseX, mouseY, data[i].x, data[i].y);
		if(dst < closestDist) {
			closest = data[i];
			closestDist = dst;
		}

		if(data[i].extraInfo && dst < closestEIDist) {
			closestEI = data[i];
			closestEIDist = dst;
		}
	}

	if(closestDist < 20) {
		fill(255, 0, 0);
		ellipse(closest.x, closest.y, 8, 8);

		var date = formatDate(new Date(closest.date));
		
		fill(0, 100);
		rect(closest.x, closest.y, -200, -70);

		fill(0);
		stroke(0, 0);
		textSize(16);

		text("Brightness: " + Math.round(closest.brightness), closest.x - 195, closest.y - 50);
		text("Date: " + date, closest.x - 195, closest.y - 30);

		if(closestEIDist < 10)
			text(closestEI.extraInfo, closest.x - 195, closest.y - 10);
	}
}

function loadData() {
	loadJSON("http://192.168.2.13:3003/lastmonth", d => {
		data = [];

		var low = 1000000;
		var high = -1000000;
		for(var i = 0; i < d.length; i++) {
			if(d[i] < low) low = d[i];
			if(d[i] > high) high = d[i];
		}

		var time = new Date().getTime();

		for(var i = 0; i < d.length; i++) {
			var bright = d[i];
			var clr = false;
			var extraInfo = false;

			if(i > 0) {
				var last = d[i - 1];
				if(last < SUNRISE_THRESHOLD && bright >= SUNRISE_THRESHOLD) {
					clr = color(100, 100, 200);
					extraInfo = "Sunrise";
				}else if(last > SUNSET_THRESHOLD && bright <= SUNSET_THRESHOLD) {
					clr = color(200, 100, 100);
					extraInfo = "Sunset";
				}else if(bright == low) {
					extraInfo = "All time low";
				}else if(bright == high) {
					extraInfo = "All time high";
				}
			}

			data.push({
				brightness: bright,
				x: i * (width / d.length),
				y: height - (bright - low) * (height / (high - low)),
				date: time - ((d.length - i) * 60 * 1000), // Server records data every minute
				color: clr,
				extraInfo: extraInfo
			});
		}
	});
}

function formatDate(d) {
	var hours = d.getHours().toString();
	if(hours.length == 1) hours = "0" + hours;

	var minutes = d.getMinutes().toString();
	if(minutes.length == 1) minutes = "0" + minutes;

	return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + hours + ":" + minutes;
}