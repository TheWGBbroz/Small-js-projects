
// Variables
var bg, dustFar, dustNear, scanlines;
var noiseX = 0;
var nameText;
var findmeText;
var padding = 200;
var totalBgs = 5;
var currBg = 0;
var bgCache = [];

// Media
var images = [];
var totalMedia = 0;
var loadedMedia = 0;
var loading = true;

// Loads an image to the images array
function loadImg(filename, index) {
	if(!images[index])
		images[index] = createImage(1, 1);

	loading = true;
	totalMedia++;
	loadImage("assets/" + filename, function(img) {
		images[index] = img;
		loadedMedia++;
		if(loadedMedia >= totalMedia) {
			loading = false;
		}
	});
}

function setup() {
	// Create canvas
	createCanvas(windowWidth, windowHeight);

	// Load assets
	currBg = floor(random(totalBgs));
	loadImg("bg/bg" + currBg + ".jpg", 0);
	loadImg("dust-far.jpg", 1);
	loadImg("dust-near.jpg", 2);
	loadImg("scanlines.png", 3);
	loadImg("vignette.png", 4);

	// Set the noise detail to 2
	noiseDetail(2);

	// Create the Typing objects
	// new Typing(TEXT, TYPE_SPEED, SHOW_UNDERSCORE, HIDE_TIMER);
	nameText = new Typing("TheWGBbroz", 6, true, 0);
	findmeText = new Typing("You can find me here:\nTwitter: @TheWGBbroz", 3, false, 30 * 1.7);

	// Set the framerate to 30
	frameRate(30);
}

function draw() {
	// Clear screen
	background(51);

	// Calculate dx and dy
	var dx = map(noise(noiseX), 0, 1, -80, 80) - padding;
	var dy = map(noise(noiseX + 200), 0, 1, -80, 80) - padding;
	noiseX += 0.01;

	var w = width + padding * 2;
	var h = height + padding * 2;


	// Background image
	image(images[0], dx * 0.2, dy * 0.2, w, h);

	// Dust
	tint(255, 40);
	image(images[1], dx * 0.8, dy * 0.8, w, h);
	image(images[2], dx * 1.2, dy * 1.2, w, h);

	// Lines
	tint(255, 80);
	image(images[3], dx * 0.3, dy * 0.3, w, h);

	// Texts
	tint(255, 255);
	fill(215);
	stroke(0);

	// Name text
	strokeWeight(3);
	textSize(96);
	push();
		translate(width / 2, 340);
		nameText.draw();
	pop();

	// Findme text
	strokeWeight(2);
	textSize(36);
	push();
		translate(width / 2, 440);
		findmeText.draw();
	pop();

	if(loading) {
		textSize(20);
		fill(180);
		stroke(0);
		strokeWeight(2);
		textAlign(LEFT);
		text("Loading..", 10, height - 20);
	}

	// Vignette
	tint(255, 140);
	image(images[4], 0, 0, width, height);
}

// Set a new background
function randomBackground() {
	var oldBg = currBg;

	// Store old background in cache if it has been correctly loaded
	if(images[0] && images[0].width != 1 && images[0].height != -1)
		bgCache[oldBg] = images[0];

	// Find random background
	while(currBg == oldBg) currBg = floor(random(totalBgs));

	// If new random backgorund has already been stored in the cache, get the one from the cache
	if(bgCache[currBg]) {
		images[0] = bgCache[currBg];
	}
	// Otherwise load the image
	else{
		loadImg("bg/bg" + currBg + ".jpg", 0);
	}
}

// Mouse pressed event
function mousePressed() {
	if(mouseButton == "center")
		randomBackground();
}

// Window resized event
function windowResized() {
	// Resize canvas when window resized
	resizeCanvas(windowWidth, windowHeight);
}

// Typing object
function Typing(txt, typeSpeed, showUnderscore, hideTimer) {
	this.finalText = txt;
	this.txt = "";

	this.typeSpeed = typeSpeed;
	this.timer = 0;

	var underscoreSpeed = 40;
	this.underscoreTimer = 0;
	this.showUnderscore = showUnderscore;

	this.hideTimer = hideTimer;

	this.draw = function() {
		// Return if should hide
		if(this.hideTimer > 0) {
			this.hideTimer--;
			return;
		}

		// Add a next character to the text if needed
		this.timer--;
		if(this.timer <= 0) {
			this.timer = this.typeSpeed + floor(random(-1, 1));
			this.txt += this.finalText.charAt(this.txt.length);
		}

		// Draw the text
		textAlign(CENTER);
		text(this.txt, 0, 0);

		// Show underscore
		if(this.showUnderscore) {
			// Blink underscore
			this.underscoreTimer--;
			if(this.underscoreTimer < underscoreSpeed * 0.5) {
				if(this.underscoreTimer <= 0) this.underscoreTimer = underscoreSpeed;

				// Draw underscore
				textAlign(LEFT);
				text("_", textWidth(this.txt) * 0.5, 0);
			}
		}
	}
}
