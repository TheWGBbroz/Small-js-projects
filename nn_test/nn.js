class NeuralNetwork {
	constructor(networkConfig) {
		this.layers = new Array(networkConfig.length);
		for(var i = 0; i < networkConfig.length; i++) {
			var connectionsPerNeuron = 0;
			if(i > 0) connectionsPerNeuron = this.layers[i - 1].neurons.length;

			var neuronValFunc = networkConfig[i].initialNeuronValue;
			if(!neuronValFunc) neuronValFunc = _randomNeuronValue;

			var neuronActivationFunc = networkConfig[i].neuronActivation;
			if(!neuronActivationFunc) neuronActivationFunc = _sigmoid();

			this.layers[i] = new Layer(networkConfig[i].amount, connectionsPerNeuron, neuronValFunc, neuronActivationFunc);
		}
	}
}

class Layer {
	constructor(neuronAmount, connectionsPerNeuron, neuronValFunc, neuronActivationFunc) {
		this.neurons = new Array(neuronAmount);
		for(var i = 0; i < neuronAmount; i++) {
			this.neurons[i] = new Neuron(connectionsPerNeuron, neuronValFunc, neuronActivationFunc);
		}
	}
}

class Neuron {
	constructor(connections, neuronValFunc, neuronActivationFunc) {
		this.weights = new Array(connections);
		this.neuronActivationFunc = neuronActivationFunc;

		for(var i = 0; i < connections; i++) {
			this.weights[i] = neuronValFunc();
		}
	}

	guess(inputs) {
		if(inputs.length != this.weights.length)
			throw new Error("inputs.length must be the same as the connection amount!");

		var sum = 0;
		for(var i = 0; i < inputs.length; i++) {
			sum += inputs[i] * this.weights[i];
		}

		return neuronActivationFunc(sum);
	}
}

function _randomNeuronValue() {
	return Math.random();
}

function _sigmoid(n) {
	return 1 / (1 + Math.pow(Math.E, -n));
}
