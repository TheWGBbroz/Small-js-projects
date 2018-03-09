
// Game state
var LOADING = 0;
var MENU = 1;
var GAME = 2;
var gameState = MENU;

// Game values
var player;
var players = [];
var planets = [];
var bullets = [];
var particles = [];
var camera = {x: 0, y: 0};
var gameSize = 10000;
var vision = 5000;
var socket;
var serverIp = "cloud.thewgbbroz.nl:2100";
var points = 0;
var leaderboard;

// Menu values
var playBtn;
var nameInp;
var tips = ["Hide behind planets for cover!", "Kill players to get the most points!"];
var currTip;

// Player values
var isLeft = false;
var isRight = false;
var isMoving = false;
var isShooting = false;

// Resources
var loadedRes = 0;
var totalRes = 0;
var totalPlanets = 6;
var totalSkins = 4;
var images = [];
var planetImages = [];
var skinImages = [];


// Load an image
function loadImg(name, index, array) {
	array = array || images;
	totalRes++;

	loadImage("res/" + name + ".png", function(img) {
		array[index] = img;
		loadedRes++;
		if(loadedRes >= totalRes) {
			initMenu();
		}
	});
}

function setup() {
	// Setup canvas
	createCanvas(windowWidth, windowHeight);

	// Load resources
	loadImg("player", 0);
	loadImg("bullet", 1);
	loadImg("background", 2);
	loadImg("pointer", 3);

	for(var i = 0; i < totalPlanets; i++) {
		loadImg("planets/planet" + i, i, planetImages);
	}
	for(var i = 0; i < totalSkins; i++) {
		loadImg("skins/skin" + i, i, skinImages);
		loadImg("skins/laser" + i, i + totalSkins, skinImages);
	}
	//
}

function draw() {
	// Clear background
	background(51);

	if(gameState == LOADING) {
		// If loading, display Loading text and return
		fill(255);
		noStroke();
		textSize(64);
		textAlign(CENTER);
		text("Loading...", width * 0.5, height * 0.5);

		return;
	}else if(gameState == MENU) {
		// Draw Nickname text
		fill(0);
		noStroke();
		textAlign(CENTER);
		textSize(26);
		text("Nickname:", width * 0.5, height * 0.4 - 40);

		// Draw How To Play
		textSize(22);
		text(	"Use A and D to rotate, W to move forewards\n" +
					"and SPACE to shoot.\n" + 
					"You can get some points by destroying planets,\n" +
					"but you get the most points for killing players."
					, width * 0.5, height * 0.7);

		// Draw tip
		if(currTip) {
			textAlign(LEFT);
			textSize(22);
			text("Tip: " + currTip, 10, height - 20);
		}

		// Draw credits
		textAlign(LEFT);
		textSize(20);
		text("Developed by @TheWGBbroz", 8, 30);
	}else if(gameState == GAME) {
		// Display background image
		backgroundImage(images[2], -camera.x, -camera.y);

		// Update player and camera
		player.update();
		updateCamera();

		// Draw player
		player.draw();

		// Update, draw and remove online players when needed
		for(var i = 0; i < players.length; i++) {
			players[i].update();
			players[i].draw();
			if(now() - players[i].lastUpdate > 1000) {
				players.splice(i, 1);
				i--;
			}
		}

		// Update, draw and remove bullets when needed
		for(var i = 0; i < bullets.length; i++) {
			bullets[i].update();
			bullets[i].draw();
			if(bullets[i].remove) {
				bullets.splice(i, 1);
				i--;
			}
		}

		// Draw and remove planets when needed
		for(var i = 0; i < planets.length; i++) {
			planets[i].draw();
			if(planets[i].remove) {
				planets.splice(i, 1);
				i--;
			}
		}

		// Update, draw and remove particles when needed
		noStroke();
		for(var i = 0; i < particles.length; i++) {
			particles[i].update();
			particles[i].draw();
			if(particles[i].remove) {
				particles.splice(i, 1);
				i--;
			}
		}

		// Add particles to world
		if(random() < 0.1) {
			particles.push(new Particle(random(-100, width + 100) + camera.x, random(-100, height + 100) + camera.y, 2, 0.06));
		}

		// Draw points to screen
		fill(255);
		noStroke();
		textSize(24);
		textAlign(LEFT);
		text("Points: " + points, 17, height - 20);

		// Draw leaderboard
		leaderboard.draw();

		// Draw arrow to the nearest player
		if(players.length > 0) {
			// Calculate nearest player
			var nearestDst = gameSize * gameSize;
			var nearestPl = players[0];
			for(var i = 0; i < players.length; i++) {
				var dst = distSq(player.x.position, player.y.position, players[i].x.position, players[i].y.position);
				if(dst < nearestDst) {
					nearestDst = dst;
					nearestPl = players[i];
				}
			}
			nearestDst = sqrt(nearestDst);

			// Draw arrow to nearest player
			var rad = atan2(nearestPl.y.position - player.y.position, nearestPl.x.position - player.x.position);
			var radius = map(nearestDst, 0, vision, 100, 240);
			var x = width / 2 + cos(rad) * radius;
			var y = height / 2 + sin(rad) * radius;

			tint(255, map(nearestDst, 0, vision, 180, 0));
			stroke(255);
			strokeWeight(3);
			push();
				translate(x, y);
				rotate(rad + radians(135));
				image(images[3], 0, 0);
			pop();
		}
	}
}

function initMenu() {
	// Disconnect socket if was connected
	if(socket) socket.disconnect();

	// Create name input
	if(!nameInp) {
		nameInp = createInput("");
		nameInp.style("border", "none");
		nameInp.style("background-color", "transparent");
		nameInp.style("width", "200");
		nameInp.style("height", "52");
		nameInp.style("font-size", "26");
		nameInp.style("padding-left", "10");
		nameInp.style("padding-right", "10");
		nameInp.style("backgroundImage", "url('res/nameinp.png')");
	}else{
		nameInp.show();
	}

	// Create play button
	if(!playBtn) {
		playBtn = createButton("Play");
		playBtn.style("border", "none");
		playBtn.style("background-color", "transparent");
		playBtn.style("width", "100");
		playBtn.style("height", "52");
		playBtn.style("font-size", "24");
		playBtn.style("backgroundImage", "url('res/playbtn.png')");
		playBtn.mousePressed(function() {
			initGame();
		});
	}else{
		playBtn.show();
	}

	// Simulate windowResized
	windowResized();

	// Pick a random tip
	currTip = tips[floor(random(tips.length))];

	// Set game state to MENU
	gameState = MENU;
}

function initGame() {
	// Hide name input and play button
	nameInp.hide();
	playBtn.hide();

	// Reset input
	isLeft = false;
	isRight = false;
	isMoving = false;
	isShooting = false;

	// Setup game variables
	player = new Player();
	leaderboard = new Leaderboard();

	// Connect to server
	var oldInterval = -1;
	socket = io.connect(serverIp);
	socket.on("connect", function() {

		// Initial data received from server
		socket.on("init", function(data) {
			gameSize = data.gameSize;
			vision = data.vision;
			player.id = data.clientId;
			player.x = new SmoothMovement(data.x);
			player.y  = new SmoothMovement(data.y);
			player.dir = new SmoothMovement(data.dir);
			pl_size = data.pl_size;
			pl_maxhp = data.pl_maxhp;
			pl_maxSpeed = data.pl_maxSpeed;
			bl_speed = data.bl_speed;
		});

		// Planet to add to the planet array
		socket.on("planet", function(data) {
			if(data.remove) {
				// Find and explode planet
				for(var i = 0; i < planets.length; i++) {
					if(planets[i].id == data.id) {
						planets[i].explode();
						break;
					}
				}
			}else if(data.changehp) {
				// Find and apply new HP to planet
				for(var i = 0; i < planets.length; i++) {
					if(planets[i].id == data.id) {
						planets[i].hp = data.newHp;
						if(planets[i].hp < 0) planets[i].hp = 0;
						break;
					}
				}
			}else{
				// Add new planet
				planets.push(new Planet(data.x, data.y, data.size, data.id, data.imageid, data.maxHp, data.hp));
			}
		});

		// Update self
		socket.on("update", function(data) {
			player.x.target = data.newX;
			player.y.target = data.newY;
			player.dir.target = data.newDir;
			player.hp = data.newHp;
			points = data.newPoints;
			player.speed = data.newSpeed;

			if(player.hp < 0) player.hp = 0;
		});

		// Update/Add other player
		socket.on("player", function(data) {
			if(data.remove) {
				for(var i = 0; i < players.length; i++) {
					if(players[i].id == data.id) {
						players.splice(i, 1);
						i--;
						break;
					}
				}
			}else{
				if(data.id == player.id) return;
				var pl = null;
				for(var i = 0; i < players.length; i++) {
					if(players[i].id == data.id) {
						pl = players[i];
						break;
					}
				}
				if(pl == null) {
					pl = new Player(data.x, data.y, data.dir);
					pl.id = data.id;
					pl.skinid = data.skinid;
					pl.name = data.name;
					players.push(pl);
				};
				pl.lastUpdate = now();
				pl.x.target = data.x;
				pl.y.target = data.y;
				pl.dir.target = data.dir;
				pl.hp = data.hp;
				pl.speed = data.speed;

				if(pl.hp < 0) pl.hp = 0;
			}
		});

		// Spawn a bullet for a player who shooted
		socket.on("shoot", function(data) {
			// Find the player with ID data.id
			var pl = null;
			if(data.playerId == player.id) {
				pl = player;
			}else{
				for(var i = 0; i < players.length; i++) {
					if(players[i].id == data.playerId) {
						pl = players[i];
						break;
					}
				}
			}

			// Spawn a bullet if a player could be found
			if(pl == null) return;

			var off = getRotatedOffsets(pl.dir.position, -50, 0);
			var b = new Bullet(pl.x.target + off.x, pl.y.target + off.y, pl.dir.target, pl.skinid, pl);
			bullets.push(b);
		});

		// Leaderboard update
		socket.on("leaderboard_update", function(data) {
			leaderboard.updatePositions(data);
		});

		// On disconnect
		socket.on("disconnect", function() {
			// Reset all game variables
			players = [];
			planets = [];
			bullets = [];
			particles = [];

			// Stop old update thread
			if(oldInterval != -1) {
				clearInterval(oldInterval);
			}

			// Go to menu
			initMenu();
		});


		// Remove old update interval if created
		if(oldInterval != -1)
			clearInterval(oldInterval);

		// Send initial data to server
		socket.emit("init", {
			skinid: player.skinid,
			name: nameInp.value()
		});

		// Update client information 20 times per second
		oldInterval = setInterval(function() {
			socket.emit("update", {
				isLeft: isLeft,
				isRight: isRight,
				isMoving: isMoving,
				isShooting: isShooting
			});
		}, 1000 / 20);
	});

	// Set game state to GAME
	gameState = GAME;
}

// Update the camera's position
function updateCamera() {
	camera.x = player.x.position - width * 0.5;
	camera.y = player.y.position - height * 0.5;
}

// Draws the background with and X and Y offset
function backgroundImage(img, xoff, yoff) {
	// Calculate rows and cols
	var rows = floor(width / img.width);
	var cols = floor(height / img.height);
	xoff %= img.width;
	yoff %= img.height;

	// Draw images to screen
	for(var i = -1; i < rows + 2; i++) {
		for(var j = -1; j < cols + 2; j++) {
			image(img, i * img.width + xoff, j * img.height + yoff);
		}
	}
}

function keyPressed() {
	if(gameState == GAME) {
		// Change player movement when pressing keys
		if(key == 'A' || keyCode == LEFT_ARROW) {
			isLeft = true;
		}else if(key == 'D' || keyCode == RIGHT_ARROW) {
			isRight = true;
		}else if(key == 'W' || keyCode == UP_ARROW) {
			isMoving = true;
		}else if(key == ' ') {
			isShooting = true;
		}else if(keyCode == ESCAPE) {
			initMenu();
		}
	}else if(gameState == MENU) {
		if(keyCode == ENTER) {
			initGame();
		}
	}
}

function keyReleased() {
	if(gameState == GAME) {
		// Change player movement when releasing keys
		if(key == 'A' || keyCode == LEFT_ARROW) {
			isLeft = false;
		}else if(key == 'D' || keyCode == RIGHT_ARROW) {
			isRight = false;
		}else if(key == 'W' || keyCode == UP_ARROW) {
			isMoving = false;
		}else if(key == ' ') {
			isShooting = false;
		}
	}
}

// Resize canvas when window resizes
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if(nameInp)
		nameInp.position(width * 0.5 - nameInp.width * 0.5, height * 0.4 - nameInp.height * 0.5);
	if(playBtn)
		playBtn.position(width * 0.5 - playBtn.width * 0.5, height * 0.55 - playBtn.height * 0.5);
}

// Clamp a value
function clamp(val, min, max) {
	if(val < min) val = min;
	if(val > max) val = max;
	return val;
}

// DistanceSquared function
function distSq(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

// Check if a point with a size is on the screen or not
function isOnScreen(x, y, size) {
	return true;
	x = x - camera.x;
	y = y - camera.y;
	size = size || 0;

	return x > -size && y > -size && x < width + size && y < height + size;
}

// Calculate rotated offsets
function getRotatedOffsets(rot, xoff, yoff) {
	var rad = radians(rot);

	var x = xoff * cos(rad) - yoff * sin(rad);
	var y = xoff * sin(rad) + yoff * cos(rad);

	return createVector(x, y);
}

// Get the current time in milliseconds
function now() {
	return new Date().getTime();
}
