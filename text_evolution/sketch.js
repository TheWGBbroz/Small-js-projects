// Setup instances
var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.!?, ";
var targetString = "To be or not to be.";

var strLen = targetString.length;
var instances = [];
var running = false;
var generation = 0;

var amount = 200;
var mutationChance = 0.02;
var parentAmount = 5;

var stateP, genP, avgfitP;

function setup() {
	noCanvas();

	// Create phrase input
	var phraseInput = createInput(targetString);

	// Create start button
	var button = createButton("Start!");

	// Create text amount input
	var amountP = createP("Text Amount  ");
	var amountIn = createInput("200");
	amountIn.parent(amountP);

	// Create mutation chance input
	var mutationChanceP = createP("Mutation Chance  ");
	var mutationChanceIn = createInput("0.02");
	mutationChanceIn.parent(mutationChanceP);

	// Create parent amount input
	var parentAmountP = createP("Parent Amount  ");
	var parentAmountIn = createInput("5");
	parentAmountIn.parent(parentAmountP);

	// Listen for mouse pressed in button
	button.mousePressed(function() {
		amount = parseInt(amountIn.value());
		mutationChance = parseFloat(mutationChanceIn.value());
		parentAmount = parseInt(parentAmountIn.value());
		start(phraseInput.value());
	});


	// Create texts
	stateP = createP("Press start to start");
	stateP.style("font-size", 32);

	genP = createP("");
	genP.style("font-size", 24);

	avgfitP = createP("");
	avgfitP.style("font-size", 24);

	// Limit framerate
	frameRate(20);
}

function start(string) {
	// Reset values
	running = true;
	generation = 0;
	stateP.html("Busy..");

	// Set string
	targetString = string;
	strLen = targetString.length;

	// Remove old instances
	for(var i = 0; i < instances.length; i++) {
		instances[i].text.remove();
		instances.splice(i, 1);
		i--;
	}

	// Add new instances
	for(var i = 0; i < amount; i++) {
		instances[i] = new Instance(randomString(strLen));
	}
}

function draw() {
	if(!running) return;

	// Calculate the fitness of all 'instnaces'
	for(var i = 0; i < instances.length; i++) {
		instances[i].calculateFitness();
	}

	// Get the top fitness instances of 'instances'
	var topInstances = getTopInstances(parentAmount, 0.20);
	if(topInstances.length == 0) topInstances = getTopInstances(parentAmount, 0);

	// Create a children array
	var children = [];

	// Breed 'amount' amount of children with the 'topInstances' parents and set them in the array
	for(var i = 0; i < instances.length; i++) {
		children.push(breed(topInstances));
		instances[i].setStr(children[i]);
	}

	// Check if a correct phrase has been breeded
	for(var i = 0; i < instances.length; i++) {
		if(instances[i].str == targetString) {
			running = false;
			stateP.html("Phrase has been found!");
			instances[i].text.style("font-size", 24);
			break;
		}
	}

	// Update the generation amount and print to screen
	generation++;
	genP.html("Generation " + generation);

	// Calculate and print the average fitness
	var avgFitness = 0;
	for(var i = 0; i < instances.length; i++) {
		avgFitness += instances[i].fitness * 100;
	}
	avgFitness = floor(avgFitness / instances.length);
	avgfitP.html("Average fitness: " + avgFitness + "%");
}

function breed(parents) {
	// Create a new string with the 'pickChar()' characters from the parents
	var newStr = "";
	for(var i = 0; i < strLen; i++) {
		newStr += pickChar(parents, i);
	}
	return newStr;
}

function pickChar(instances, charIndex) {
	// Get the instance with the correct char at 'charIndex'
	var instanceId = -1;
	for(var i = 0; i < instances.length; i++) {
		if(instances[i] && instances[i].str.charAt(charIndex) == targetString.charAt(charIndex))
			instanceId = i;
	}

	// If a correct char from the 'instances' has been found, set the chat to that
	var char = null;
	if(instances[instanceId])
		char = instances[instanceId].str.charAt(charIndex);

	// If no correct character has been found, get a character from a random parent
	if(!char) {
		instanceId = -1;
		while(!instances[instanceId]) instanceId = floor(random(instances.length));
		char = instances[instanceId].str.charAt(charIndex);
	}

	// If a mutation has happend, set 'char' to a random character
	if(random() < mutationChance) {
		char = randomString(1);
	}

	return char;
}

function getBestInstance(exclude) {
	// Get the best instance based on the fitness
	var topFitness = -1;
	var topInstance = null;
	for(var i = 0; i < instances.length; i++) {
		if(instances[i].fitness > topFitness) {
			if(exclude && exclude.indexOf(instances[i]) != -1) {
				continue;
			}
			topFitness = instances[i].fitness;
			topInstance = instances[i];
		}
	}

	return topInstance;
}

function getTopInstances(amount, minFitness) {
	// Get the top 'amount' Instance's from the array 'instances'
	var topInstances = [];
	for(var i = 0; i < amount; i++) {
		var ins = getBestInstance(topInstances);

		// Only add instance to top instances if it has a fitness of more than 10%
		if(ins && ins.fitness > minFitness)
			topInstances.push(ins);
	}
	return topInstances;
}

function randomString(len) {
	// Create a random string with the charset 'characters'
  var str = "";
  for(var i = 0; i < len; i++) {
    str += characters.charAt(floor(random(characters.length)));
  }
	return str;
}

function Instance(str) {
	// String and 'createP()' object
	this.str = str;
	this.text = createP(str);
	this.fitness = 0;

	this.text.style("font-size", 16);

	// Set the string to 'str'
	this.setStr = function(str) {
		this.str = str;
		this.text.html(str);
	}

	// Calculate the fitness
	this.calculateFitness = function() {
		var amountRight = 0;
		for(var i = 0; i < strLen; i++) {
			if(this.str.charAt(i) == targetString.charAt(i)) {
				amountRight++;
			}
		}

		this.fitness = map(amountRight, 0, strLen, 0, 1);
		return this.fitness;
	}
}
