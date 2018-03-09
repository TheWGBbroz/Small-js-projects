var occurrences = {
	Red: [
		["C"],
		["B"],
		["A"],
		["A", "C"],
		["B"],
		["A", "C"],
		["A", "B", "C"],
		["A", "B"],
		["B"]
	],
	Blue: [
		["B"],
		["A", "C"],
		["B"],
		["A"],
		["B"],
		["B", "C"],
		["C"],
		["A", "C"],
		["A"]
	],
	Black: [
		["A", "B", "C"],
		["A", "C"],
		["B"],
		["A", "C"],
		["B"],
		["B", "C"],
		["A", "B"],
		["C"],
		["C"]
	]
};

var currOccurrences;

var redRad, blueRad, blackRad;
var cutText;

function setup() {
	noLoop();

	redRad = select("#color-red");
	blueRad = select("#color-blue");
	blackRad = select("#color-black");

	redRad.mousePressed(function() {
		//console.log(blueRad);
		blueRad.elt.checked = false;
		blackRad.elt.checked = false;
	});

	blueRad.mousePressed(function() {
		//console.log(blueRad);
		redRad.elt.checked = false;
		blackRad.elt.checked = false;
	});

	blackRad.mousePressed(function() {
		//console.log(blueRad);
		redRad.elt.checked = false;
		blueRad.elt.checked = false;
	});

	select("#enter").mousePressed(function() {
		enter();
	});

	select("#reset").mousePressed(function() {
		reset();
	});

	cutText = select("#cut-text");

	reset();
}

function draw() {

}

function keyPressed() {
	if(key == '1' || key == '2' || key == '3') {
		redRad.elt.checked = false;
		blueRad.elt.checked = false;
		blackRad.elt.checked = false;

		if(key == '1') {
			redRad.elt.checked = true;
		}else if(key == '2') {
			blueRad.elt.checked = true;
		}else if(key == '3') {
			blackRad.elt.checked = true;
		}

		enter();
	}
}

function updateText(sel) {
	var cut = occurrences[sel][currOccurrences[sel] - 1];
	console.log("Cut " + cut);

	var str = "Cut ";
	for(var i = 0; i < cut.length; i++) {
		str += cut[i];
		if(i != cut.length - 1) {
			str += ", ";
		}
	}

	cutText.html(str);

	redRad.elt.checked = false;
	blueRad.elt.checked = false;
	blackRad.elt.checked = false;
}

function reset() {
	currOccurrences = {
		Red: 0,
		Blue: 0,
		Black: 0
	};

	cutText.html("");

	redRad.elt.checked = false;
	blueRad.elt.checked = false;
	blackRad.elt.checked = false;
}

function enter() {
	var sel;
	if(redRad.elt.checked) {
		sel = "Red";
	}else if(blueRad.elt.checked) {
		sel = "Blue";
	}else if(blackRad.elt.checked) {
		sel = "Black";
	}else{
		console.log("No radio checked!");
		return;
	}

	console.log("Selected " + sel);

	currOccurrences[sel]++;
	updateText(sel);
}