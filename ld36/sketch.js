/*!
 * Licensed MIT
 * Copyright (c) 2016 Wouter Gritter
 */

window.onkeydown = function(e) {
  return !(e.keyCode == 32);
}

window.onwheel = function(e) {
  if(gameState == 4) {
    if(mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
      return false;
    }
  }
}

// 0 = Menu
// 1 = Credits
// 2 = How to play
// 3 = Game
// 4 = Level editor
// 5 = Game finish
var gameState = 0;
var images = [];
var mapObjectsJson;
var playerImages = [];

// Menu stuff
var men_playBtn, men_creditsBtn, men_htpBtn;
//

// Game stuff
var levels = [];
var currLevel = 0;
var originalWeight = 1;
//

// Level editor stuff
var le_mapObjects = [];
var le_player;
var le_help, le_jsonOutput;
var le_grid = 48;
var le_mapObjectName = "null";
var le_mapObjectIndex = 0;
var le_finish;
var le_finish_size = 64;
//

function loadImg(path, index, arr) {
	if(!arr) arr = images;
	arr[index] = createImage(1, 1);
	loadImage("res/" + path, function(img) {
		arr[index] = img;
	});
}

function setup() {
	var canvas = createCanvas(1100, 600);
	canvas.parent("canvas_");
  canvas.style("box-shadow", "10px 10px 10px #888");

	// Load stuff
	for(var i = 0; i < 11; i++) {
		loadImg("player/p1_walk" + (i+1) + ".png", i, playerImages);
	}

	loadImg("castleLeft.png",   0);
	loadImg("castleMid.png",    1);
	loadImg("castleRight.png",  2);
  loadImg("tv_overlay.png",   3);
  loadImg("blockerMad.png",   4);
  loadImg("box.png",          5);

	loadJSON("mapobjects.json", function(json) {
			mapObjectsJson = json.map_objects;

			loadJSON("levels.json", function(json) {
				var levelsJson = json.levels;
				for(var i = 0; i < levelsJson.length; i++) {
					levels[i] = new Level(levelsJson[i]);
				}
			});
	});
	//

	// Setup menu buttons
	men_playBtn = createButton("Play");
  men_playBtn.parent("canvas_");
  men_playBtn.class("btn");
	men_playBtn.style("font-size", "32");
	men_playBtn.style("padding", "4");
	men_playBtn.style("width", "88");
	men_playBtn.position((width / 2 - men_playBtn.width / 2) + canvas.position().x, 270 + canvas.position().y);
	men_playBtn.mousePressed(function() {
		currLevel = 0;
		for(var i = 0; i < levels.length; i++) {
			levels[i].reset();
		}
		setGameState(3);
	});

	men_creditsBtn = createButton("Credits");
  men_creditsBtn.parent("canvas_");
  men_creditsBtn.class("btn");
	men_creditsBtn.style("font-size", "32");
	men_creditsBtn.style("padding", "4");
	men_creditsBtn.style("width", "120");
	men_creditsBtn.position((width / 2 - men_creditsBtn.width / 2) + canvas.position().x, 330 + canvas.position().y);
	men_creditsBtn.mousePressed(function() {
		setGameState(1);
	});

	men_htpBtn = createButton("How to play");
  men_htpBtn.parent("canvas_");
  men_htpBtn.class("btn");
	men_htpBtn.style("font-size", "32");
	men_htpBtn.style("padding", "4");
	men_htpBtn.style("width", "188");
	men_htpBtn.position((width / 2 - men_htpBtn.width / 2) + canvas.position().x, 390 + canvas.position().y);
	men_htpBtn.mousePressed(function() {
		setGameState(2);
	});
	//

	le_help = createP("<br>" +
                    "P: Place the player at your mouse<br>" +
										"O: Place an object at your mouse<br>" +
										"R: Rotate an object 5 degrees<br>" +
										"K: Remove an object<br>" +
										"V & B: Select a map object<br>" +
										"F: Set the finish at your mouse<br>" +
										"ENTER: Output JSON of level<br>" +
										"Mouse wheel: Change the grid size<br>");
  le_help.parent("canvas_");
	le_help.hide();
	le_jsonOutput = createP("JSON Output: ");
  le_jsonOutput.parent("canvas_");
	le_jsonOutput.hide();
}

function draw() {
	background(51);
	if(gameState == 0) {
		noStroke();
		fill(255);

		textSize(64);
		textAlign(CENTER);
		text("Ludum Dare 36", width * 0.5, 120);

		textSize(16);
		textAlign(LEFT);
		text("Made by TheWGBbroz (@TheWGBbroz)", 48, height - 36);
	}else if(gameState == 1) {
		noStroke();
		fill(255);

		textSize(64);
		textAlign(CENTER);
		text("Credits", width * 0.5, 120);

		textSize(32);
		textAlign(CENTER);
		text(	"This game has been made for Ludum Dare 36 by TheWGBbroz\n" +
					"This is the first time I'm in Ludum Dare\n" +
					"You can follow me on twitter: @TheWGBbroz\n" +
					"My website is www.thewgbbroz.nl\n\n" +
					"Recent project I am working on: www.digitate.net\n\n" +
					"I hope you like the game!"
					, width * 0.5, 190);

		textSize(18);
		text("Press ESCAPE to return back to menu.", width * 0.5, height - 70);

		textSize(16);
		textAlign(LEFT);
		text("Made by TheWGBbroz (@TheWGBbroz)", 48, height - 36);
	}else if(gameState == 2) {
		textSize(64);
		textAlign(CENTER);
		text("How to play", width * 0.5, 120);

		textSize(32);
		textAlign(CENTER);
		text(	"Control your player with A, D, and SPACE.\n" +
          "Avoid getting killed, and get to the other side of each room!\n"
					, width * 0.5, 190);

		textSize(18);
		text("Press ESCAPE to return back to menu.", width * 0.5, height - 70);

		textSize(16);
		textAlign(LEFT);
		text("Made by TheWGBbroz (@TheWGBbroz)", 48, height - 36);
	}else if(gameState == 3) {
		if(levels[currLevel]) {
			levels[currLevel].update();
			levels[currLevel].render();
		}

		loadPixels();
		var weight = 100;//floor(map(currLevel, 0, levels.length, 0, 100));
		var i, ii, iii, a, r, g, b, gray;
		for(var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) {
				i = 4 * (x + y * width);
				ii = i + 1;
				iii = i + 2;
				a = weight + 1;

				r = pixels[i  ];
				g = pixels[ii ];
				b = pixels[iii];
				gray = (r + g + b) / 3;
				pixels[i  ] = (gray + weight * pixels[i  ]) / a;
				pixels[ii ] = (gray + weight * pixels[ii ]) / a;
				pixels[iii] = (gray + weight * pixels[iii]) / a;

			}
		}
		updatePixels();

		levels[currLevel].renderNonGray();
	}else if(gameState == 4) {
		if(le_grid > 1) {
			stroke(0);
			strokeWeight(1);
			for(var x = 0; x < width; x += le_grid) {
				line(x, 0, x, height);

				for(var y = 0; y < height; y += le_grid) {
					line(0, y, width, y);
				}
			}
		}

		for(var i = 0; i < le_mapObjects.length; i++) {
			le_mapObjects[i].render();
			if(le_mapObjects[i].hasCollision) {
				noFill();
				stroke(255, 0, 0);
				strokeWeight(2);
				var colBox = le_mapObjects[i].getCollisionBox();
				rect(colBox.x, colBox.y, colBox.w, colBox.h);
			}
		}

		if(le_player)
			le_player.render();

		if(le_finish) {
			fill(0, 0, 255);
			noStroke();
			rect(le_finish.x, le_finish.y, le_finish_size, le_finish_size);
		}

		textAlign(RIGHT);
		textSize(16);
		noStroke();
		fill(255);
		text("Grid size: " + le_grid, width - 40, height - 35);
		text("Selected map object: " + le_mapObjectName, width - 40, height - 55);
	}else if(gameState == 5) {
    fill(255);
    noStroke();

		textSize(64);
		textAlign(CENTER);
		text("Thanks for playing!", width * 0.5, 120);

    textSize(32);
    textAlign(CENTER);
    text(	"Return to menu by clicking any key!"
          , width * 0.5, 190);
	}

  image(images[3], 0, 0, width, height);
}

function nextLevel() {
  currLevel++;
  if(!levels[currLevel]) {
    currLevel = 0;
    setGameState(5);
  }
}

function keyPressed() {
	if(keyCode == ESCAPE || gameState == 5) {
		setGameState(0);
		return;
	}

	if(gameState == 3) {
		if(key == "A") {
			levels[currLevel].player.left = true;
		}else if(key == "D") {
			levels[currLevel].player.right = true;
		}else if(key == " ") {
			levels[currLevel].player.jump();
		}

		if(levels[currLevel].player.dead) {
			levels[currLevel].reset();
		}
	}else if(gameState == 4) {
		if(key == "P") {
			var x = floor(mouseX / le_grid) * le_grid;
			var y = floor(mouseY / le_grid) * le_grid;

			le_player = new Player(x, y);
		}else if(key == "O") {
			var objJson = mapObjectsJson[le_mapObjectIndex];

			var x = floor(mouseX / le_grid) * le_grid;
			var y = floor(mouseY / le_grid) * le_grid;

			le_mapObjects.push(new MapObject(objJson, x, y, 0));
		}else if(key == "R") {
			for(var i = 0; i < le_mapObjects.length; i++) {
				if(rectContains(le_mapObjects[i].getCollisionBox(), mouseX, mouseY)) {
					le_mapObjects[i].rot += radians(5);
					break;
				}
			}
		}else if(key == "K") {
			for(var i = 0; i < le_mapObjects.length; i++) {
				if(rectContains(le_mapObjects[i].getCollisionBox(), mouseX, mouseY)) {
					le_mapObjects.splice(i, 1);
					break;
				}
			}
		}else if(key == "V") {
			if(!mapObjectsJson[le_mapObjectIndex - 1]) return;
			le_mapObjectIndex--;
			le_mapObjectName = mapObjectsJson[le_mapObjectIndex].name;
		}else if(key == "B") {
			if(!mapObjectsJson[le_mapObjectIndex + 1]) return;
			le_mapObjectIndex++;
			le_mapObjectName = mapObjectsJson[le_mapObjectIndex].name;
		}else if(key == "F") {
			var x = floor(mouseX / le_grid) * le_grid;
			var y = floor(mouseY / le_grid) * le_grid;

			le_finish = createVector(mouseX, mouseY);
		}




		else if(keyCode == ENTER) {
			if(!le_player || !le_finish) return;

			var levelJson = {
				player: {
					x: le_player.x,
					y: le_player.y,
					img: le_player.img
				},
				finish: {
					x: le_finish.x,
					y: le_finish.y,
					w: le_finish_size,
					h: le_finish_size
				},
				objects: []
			}
			for(var i = 0; i < le_mapObjects.length; i++) {
				levelJson.objects.push({
					name: le_mapObjects[i].name,
					x: le_mapObjects[i].x,
					y: le_mapObjects[i].y,
					rot: le_mapObjects[i].rot
				});
			}

			le_jsonOutput.html("JSON Output: " + JSON.stringify(levelJson));
		}
	}
}

function mousePressed() {
	if(gameState == 3) {
		if(levels[currLevel].player.dead) {
			levels[currLevel].reset();
		}
	}
}

function mouseDragged() {
  if(gameState == 4) {
    for(var i = 0; i < le_mapObjects.length; i++) {
      if(rectContains(le_mapObjects[i].getCollisionBox(), mouseX + le_mapObjects[i].width / 2, mouseY + le_mapObjects[i].height / 2)) {
        le_mapObjects[i].x = mouseX;
        le_mapObjects[i].y = mouseY;
        break;
      }
    }
  }
}

function keyReleased() {
	if(gameState == 3) {
		if(key == "A") {
			levels[currLevel].player.left = false;
		}else if(key == "D") {
			levels[currLevel].player.right = false;
		}
	}
}

function mouseWheel(event) {
  if(mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
    if(gameState == 4) {
      if(event.delta > 0) {
        le_grid--;
        if(le_grid < 1) le_grid = 1;
      }else{
        le_grid++;
      }
      return true;
    }
  }
}

function setGameState(state) {
	var oldState = gameState;
	gameState = state;

	if(oldState == 0) {
		men_playBtn.hide();
		men_creditsBtn.hide();
		men_htpBtn.hide();
	}
	if(state == 0) {
		men_playBtn.show();
		men_creditsBtn.show();
		men_htpBtn.show();
	}

	if(oldState == 4) {
		le_help.hide();
		le_jsonOutput.hide();
	}
	if(state == 4) {
		le_help.show();
		le_jsonOutput.show();
	}
}

function rectCollision(a, b) {
	return (a.x <= b.x + b.w &&
					b.x <= a.x + a.w &&
					a.y <= b.y + b.h &&
					b.y <= a.y + a.h);
}

function rectContains(rect, x, y) {
	return (x > rect.x &&
					x < rect.x + rect.w &&
					y > rect.y &&
					y < rect.y + rect.h);
}

function createRect(x, y, w, h) {
	return {
		x: x,
		y: y,
		w: w,
		h: h
	}
}

function clamp(val, min, max) {
	if(val < min) val = min;
	if(val > max) val = max;
	return val;
}

function distSq(x1, y1, x2, y2) {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}
