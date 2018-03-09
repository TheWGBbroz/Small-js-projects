var words = ["about", "after", "again", "below", "could", "every", "first", "found", "great", "house", "large", "learn", "never", "other", "place", "plant", "point", "right", "small", "sound", "spell", "still", "study", "their", "there", "these", "thing", "think", "three", "water", "where", "which", "world", "would", "write"];

var letters = ["", "", "", "", ""];

var outputEl;

function setup() {
	noLoop();

	outputEl = select("#output");

	updateOutput();
}

function draw() {

}

function keyReleased() {
	updateLetters();
}

function updateLetters() {
	for(var i = 0; i < 5; i++) {
		var el = select("#letter-" + (i + 1));
		var letter = el.elt.value;

		letters[i] = letter;
	}

	console.log("New letters: " + letters + ". Updating output");

	updateOutput();
}

function updateOutput() {
	var matching = [];

	for(var i = 0; i < words.length; i++) {
		var word = words[i];

		var isMatching = true;
		for(var j = 0; j < letters.length; j++) {
			var l = letters[j];

			var lContainsLetter = false;
			for(var k = 0; k < l.length; k++) {
				if(word.charAt(j) == l.charAt(k)) {
					lContainsLetter = true;
				}
			}

			if(!(l.length == 0 || lContainsLetter)) {
				isMatching = false;
				break;
			}
		}

		if(isMatching) {
			matching.push(word);
		}
	}

	console.log("Matching: " + matching);

	var str = "Matching: ";
	for(var i = 0; i < matching.length; i++) {
		str += matching[i];
		if(i != matching.length - 1) {
			str += ", ";
		}
	}

	outputEl.html(str);
}