var nnet;

var trainIn;
var trainOut;

var showI = 0;
var cycling = true;
var learning = true;

function setup() {
	//randomSeed(10);

	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER);
	textSize(20);

	nnet = new NNet(3);

	/*
	nnet.layerCount    = 3;
	nnet.inputNeurons  = 2;
	nnet.outputNeurons = 2;
	nnet.hiddenNeurons = 5; // Per layer

	nnet.update();
	*/

	nnet.setLayer(0, new Layer(0, 2, sigmoid));
	nnet.setLayer(1, new Layer(1, 4, sigmoid));
	nnet.setLayer(2, new Layer(2, 1, rectifyLinearUnit));
	nnet.connectLayers();

	nnet.initRandomNeurons();

	trainIn  = [[1, 0], [0, 1], [1, 1]];
	trainOut = [[1],    [1],    [0]   ];
}

function draw() {
	if(learning) {
		var step = random(0, 0.5);
		for(var i = 0; i < 500; i++) {
			//for(var j = 0; j < trainIn.length; j++) {
			//	nnet.train(trainIn[j], trainOut[j], step);
			//}
			var j = floor(random(trainIn.length));
			nnet.train(trainIn[j], trainOut[j], step);
		}

		if(frameCount % 60 == 0) {
			var avgError = 0;
			var avgDevide = 0;
			for(var i = 0; i < trainIn.length; i++) {
				nnet.setInput(trainIn[i]);
				nnet.calculate();
				avgError += nnet.calculateError(trainOut[i]);
				avgDevide++;
			}
			avgError /= avgDevide;

			console.log("Error: " + avgError);
		}
	}
	
	if(frameCount % 60 == 0) {
		if(cycling) {
			showI++;
			if(showI > trainIn.length - 1)
				showI = 0;
		}
	}

	nnet.setInput(trainIn[showI]);
	nnet.calculate();

	background(51);

	var highestNeuronCount = 1;
	for(var i = 0; i < nnet.layers.length; i++) {
		if(nnet.layers[i].neurons.length > highestNeuronCount) {
			highestNeuronCount = nnet.layers[i].neurons.length;
		}
	}

	var apartX = (width - 100 * 2) / nnet.layers.length;
	var apartY = (height - 50 * 2) / highestNeuronCount;

	for(var i = 0; i < nnet.layers.length; i++) {
		for(var j = 0; j < nnet.layers[i].neurons.length; j++) {
			var x = i * apartX + 100;
			var y = j * apartY + 50;

			var hovering = dist(mouseX, mouseY, x, y) < 50 / 2;

			fill(255);
			stroke(0);

			if(hovering) {
				fill(255, 0, 0);
			}

			var neuron = nnet.layers[i].neurons[j];
			ellipse(x, y, 50, 50);

			for(var k = 0; k < neuron.connectedTo.length; k++) {
				var connected = neuron.connectedTo[k];

				// Connected x & y
				var cx = connected.layerIndex * apartX + 100;
				var cy = k * apartY + 50;

				if(hovering)
					stroke(0, 0, 255, 100);
				else
					stroke(0, 100);

				strokeWeight(clamp(map(abs(neuron.weights[k]), 0, 1, 1, 5), 0, 10));
				line(x, y, cx, cy);

				if(hovering) {
					// Line center x & y
					var lcx = (x + cx) / 2;
					var lcy = (y + cy) / 2;

					fill(255);
					stroke(0, 0);
					text(nfc(neuron.weights[k], 2, 2), lcx, lcy);
				}
			}
			strokeWeight(1);

			fill(0);
			stroke(0, 0);
			text(nfc(neuron.value, 2, 2), x, y);
		}
	}
}

function clamp(val, min, max) {
	if(val < min) return min;
	if(val > max) return max;
	return val;
}

function sigmoid(n) {
	return 2 / (1 + Math.exp(-2 * n)) - 1;
}

function rectifyLinearUnit(n) {
	return clamp(n, 0, 1);
}

function keyPressed() {
	if(key == ' ') {
		cycling = !cycling;
	}else if(key == 'P') {
		learning = !learning;
	}
}


function NNet() {
	this.layers = [];

	this.setLayer = function(i, layer) {
		this.layers[i] = layer;
	}

	this.connectLayers = function() {
		for(var i = 0; i < this.layers.length - 1; i++) {
			var l0 = this.layers[i];
			var l1 = this.layers[i + 1];

			for(var j = 0; j < l0.neurons.length; j++) {
				for(var k = 0; k < l1.neurons.length; k++) {
					l0.neurons[j].connectedTo.push(l1.neurons[k]);
				}
			}
		}
	}

	this.initRandomNeurons = function() {
		for(var i = 0; i < this.layers.length; i++) {
			for(var j = 0; j < this.layers[i].neurons.length; j++) {
				this.layers[i].neurons[j].value = random(-1, 1);
				for(var k = 0; k < this.layers[i].neurons[j].connectedTo.length; k++) {
					this.layers[i].neurons[j].weights[k] = random(-1, 1);
				}
			}
		}
	}

	this.initZeroNeurons = function() {
		for(var i = 0; i < this.layers.length; i++) {
			for(var j = 0; j < this.layers[i].neurons.length; j++) {
				this.layers[i].neurons[j].value = 0;
				for(var k = 0; k < this.layers[i].neurons[j].connectedTo.length; k++) {
					this.layers[i].neurons[j].weights[k] = 0;
				}
			}
		}
	}

	this.setInput = function(input) {
		for(var i = 0; i < this.layers[0].neurons.length; i++) {
			this.layers[0].neurons[i].value = input[i] || 0;
		}
	}

	this.calculate = function() {
		// Reset every layer's neuron's value's to 0 (except the input layer)
		for(var i = 1; i < this.layers.length; i++) {
			for(var j = 0; j < this.layers[i].neurons.length; j++) {
				this.layers[i].neurons[j].value = 0;
			}
		}

		// Calculate network
		for(var i = 0; i < this.layers.length; i++) {
			var layer = this.layers[i];
			for(var j = 0; j < layer.neurons.length; j++) {
				var neuron = layer.neurons[j];
				for(var k = 0; k < neuron.connectedTo.length; k++) {
					var connected = neuron.connectedTo[k];
					var weight = neuron.weights[k];

					//connected.value += neuron.value * weight;
					connected.value = layer.func(connected.value + neuron.value * weight);
				}
			}
		}
	}

	this.train = function(input, desiredOutput, step) {
		if(!step) step = 0.2;

		this.setInput(input);
		this.calculate();

		var beginError = this.calculateError(desiredOutput);

		var affect = abs(beginError) * step;

		// Change the weights
		for(var i = 0; i < this.layers.length; i++) {
			for(var j = 0; j < this.layers[i].neurons.length; j++) {
				var neuron = this.layers[i].neurons[j];

				for(var k = 0; k < neuron.weights.length; k++) {
					var orWeight = neuron.weights[k];

					var errors = [];

					neuron.weights[k] = orWeight + affect;
					this.calculate();
					errors[0] = abs(this.calculateError(desiredOutput));
					
					neuron.weights[k] = orWeight - affect;
					this.calculate();
					errors[1] = abs(this.calculateError(desiredOutput));
					
					neuron.weights[k] = orWeight;
					this.calculate();
					errors[2] = abs(this.calculateError(desiredOutput));


					var lowestIndex = -1;
					var lowest = Infinity;
					for(var l = 0; l < errors.length; l++) {
						if(errors[l] <= lowest) {
							lowest = errors[l];
							lowestIndex = l;
						}
					}

					if(lowestIndex == 0) {
						// + is the best
						neuron.weights[k] = orWeight + affect;
					}else if(lowestIndex == 1) {
						// - is the best
						neuron.weights[k] = orWeight - affect;
					}else if(lowestIndex == 2) {
						// Keeping it the same is the best
						neuron.weights[k] = orWeight;
					}
				}
			}
		}
	}

	this.calculateError = function(desiredOutput) {
		var outputLayer = this.layers[this.layers.length - 1];
		var error = 0;
		for(var i = 0; i < outputLayer.neurons.length; i++) {
			var val = outputLayer.neurons[i].value;
			error += desiredOutput[i] - val;
		}
		return error / outputLayer.neurons.length;
	}
}

function Layer(layerIndex, neurons, func) {
	this.layerIndex = layerIndex;
	this.neurons = [];
	this.func = func || sigmoid;

	for(var i = 0; i < neurons; i++) {
		this.neurons[i] = new Neuron(this.layerIndex);
	}
}

function Neuron(layerIndex, layer) {
	this.value = 0;
	this.layerIndex = layerIndex;
	this.connectedTo = [];
	this.weights = [];
}