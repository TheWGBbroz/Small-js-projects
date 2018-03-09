// Load requirements
var Express = require("express");
var SocketIO = require("socket.io");

// Setup socket.io server
var port = 2100;
var app = Express();
var server = app.listen(port);
var io = SocketIO(server);

// Game vars
var gameSize = 10000;
var totalPlanets = 6;

var players = [];
var planets = [];
var bullets = [];
//

// Next planet ID
var nextPlanetId = 0;

// Create planets
for(var i = 0; i < 100; i++) {
  planets.push(new Planet());
}

// Start update thread
setInterval(function() {
  // Update players
  for(var i = 0; i < players.length; i++) {
    players[i].update();

    var plUpdate = {
      id: players[i].id,
      x: players[i].x,
      y: players[i].y,
      dir: players[i].dir,
      skinid: players[i].skinid,
      hp: players[i].hp,
      name: players[i].name,
      speed: players[i].speed
    };
    for(var j = 0; j < players.length; j++) {
      if(players[j] == players[i]) continue;
      // Check if the player can be seen by players[i]
      if(distSq(players[j].x, players[j].y, players[i].x, players[i].y) < pl_vision * pl_vision) {
        players[j].socket.emit("player", plUpdate);
      }
    }
  }

  // Update bullets
  for(var i = 0; i < bullets.length; i++) {
    bullets[i].update();
    if(bullets[i].remove) {
      bullets.splice(i, 1);
      i--;
    }
  }
}, 1000 / 20);

// Start leaderboard update thread
setInterval(updateLeaderboard, 1500);

// Listen for socket.io connections
io.sockets.on("connection", function(socket) {
  console.log("New connection: " + socket.id + " (" + socket.handshake.address + ")");

  // Create new player obj
  var player = new Player(socket);
  players.push(player);

  // Send initial data to client
  socket.emit("init", {
    gameSize: gameSize,
    vision: pl_vision,
    clientId: player.id,
    x: player.x,
    y: player.y,
    dir: player.dir,
    pl_size: pl_size,
    pl_maxhp: pl_maxhp,
    pl_maxSpeed: pl_maxSpeed,
    bl_speed: bl_speed * (20 / 60)
  });

  // Send all planets to client
  for(var i = 0; i < planets.length; i++) {
    socket.emit("planet", {
      x: planets[i].x,
      y: planets[i].y,
      size: planets[i].size,
      id: planets[i].id,
      imageid: planets[i].imageid,
      maxHp: planets[i].maxHp,
      hp: planets[i].hp
    });
  }

  // Listen for initial data received from client
  socket.on("init", function(data) {
    player.skinid = data.skinid;
    player.name = data.name;

    if(player.name.length > 20) player.name = player.name.substr(0, 20);
    if(player.name == undefined || player.name == "") player.name = "No Name";
  });

  // Listen when client updates and broadcast update to other clients
  socket.on("update", function(data) {
    // Apply user input
    player.isLeft = data.isLeft || false;
    player.isRight = data.isRight || false;
    player.isMoving = data.isMoving || false;
    player.isShooting = data.isShooting || false;

    // Send new position to client
    socket.emit("update", {
      newX: player.x,
      newY: player.y,
      newDir: player.dir,
      newHp: player.hp,
      newPoints: player.points,
      newSpeed: player.speed
    });
  });

  // Listen for disconnect and remove player
  socket.on("disconnect", function() {
    io.sockets.emit("player", {
      id: player.id,
      remove: true
    });

    console.log("Disconnected: " + socket.id);

    players.splice(players.indexOf(player), 1);
  });
});

// Server fully started
console.log("Server started at *:" + port);

// Update leaderboard
function updateLeaderboard() {
  // Sort all players by their points
  var sortedPlayers = players.slice();
  sortedPlayers.sort(function(a, b) {return b.points - a.points});

  // Create an array of objects of the top 10 players
  var topPlayers = [];
  for(var i = 0; i < 10; i++) {
    var name = undefined;
    var points = undefined;
    if(sortedPlayers[i]) {
      name = sortedPlayers[i].name;
      points = sortedPlayers[i].points;
    }

    topPlayers[i] = {
      name: name,
      points: points
    }
  }

  // Send the top 10 players to all the clients
  io.sockets.emit("leaderboard_update", topPlayers);
}

function pickPosition(objSize) {
  var tries = 0;
  var x = -1;
  var y = -1;
  while(tries < 1000) {
    x = Math.random() * gameSize - gameSize * 0.5;
    y = Math.random() * gameSize - gameSize * 0.5;

    var foundCol = false;
    if(!foundCol) {
      for(var i = 0; i < planets.length; i++) {
        if(planets[i].collision(x, y, objSize)) {
          foundCol = true;
          break;
        }
      }
    }
    if(!foundCol) {
      for(var i = 0; i < players.length; i++) {
        if(players[i].collision(x, y, objSize)) {
          foundCol = true;
          break;
        }
      }
    }
    if(!foundCol)
      break;
  }
  return { x: x, y: y };
}

// Player default variables
var pl_dirSpeedAdd = 1.8;
var pl_maxDirSpeed = 6;
var pl_speedAdd = 2;
var pl_maxSpeed = 30;
var pl_size = 85;
var pl_vision = 5000;
var pl_shootWait = 3;
var pl_maxhp = 100;
var pl_playerKillPoints = 10;
var pl_planetKillPoints = 2;
function Player(socket) {
  var pos = pickPosition(pl_size);
  this.x = pos.x;
  this.y = pos.y;

  this.socket = socket;
  this.id = this.socket.id;
  this.isLeft = false;
  this.isRight = false;
  this.isMoving = false;
  this.isShooting = false;
  this.shootDelay = 0;
  this.dir = Math.random() * 360;
  this.dirSpeed = 0;
  this.speed = 0;
  this.skinid = 0;
  this.hp = pl_maxhp;
  this.points = 0;
  this.name = "No Name";

  this.update = function() {
    // Calculete direction
    if(this.isLeft) {
      this.dirSpeed -= pl_dirSpeedAdd;
    }else if(this.isRight) {
      this.dirSpeed += pl_dirSpeedAdd;
    }else{
      if(this.dirSpeed > 0) this.dirSpeed -= pl_dirSpeedAdd;
      if(this.dirSpeed < 0) this.dirSpeed += pl_dirSpeedAdd;
      if(this.dirSpeed > -1 && this.dirSpeed < 1) this.dirSpeed = 0;
    }
    this.dirSpeed = clamp(this.dirSpeed, -pl_maxDirSpeed, pl_maxDirSpeed);

    // Apply direction
    this.dir += this.dirSpeed;


    // Calculate speed
    if(this.isMoving) {
      this.speed += pl_speedAdd;
    }else{
      this.speed -= pl_speedAdd;
    }
    this.speed = clamp(this.speed, 0, pl_maxSpeed);

    // Store new X and Y in vars
    var rad = radians(this.dir % 360);
    var newX = this.x + Math.cos(rad) * -this.speed;
    var newY = this.y + Math.sin(rad) * -this.speed;

    // Check for collision
    var collisionX = false;
    var collisionY = false;
    if(!collisionX && !collisionY) {
      for(var i = 0; i < planets.length; i++) {
        if(!collisionX && planets[i].collision(newX, this.y, pl_size))
          collisionX = true;
        if(!collisionY && planets[i].collision(this.x, newY, pl_size))
          collisionY = true;
      }
    }
    if(!collisionX && !collisionY) {
      for(var i = 0; i < players.length; i++) {
        if(players[i] == this) continue;
        if(!collisionX && players[i].collision(newX, this.y, pl_size))
          collisionX = true;
        if(!collisionY && players[i].collision(this.x, newY, pl_size))
          collisionY = true;
      }
    }
    if(!collisionX) {
      if(newX < gameSize * -0.5 || newX > gameSize * 0.5) collisionX = true;
    }
    if(!collisionY) {
      if(newY < gameSize * -0.5 || newY > gameSize * 0.5) collisionY = true;
    }


    // If no collision, apply previously stored X and Y positions
    if(!collisionX)
      this.x = newX;
    if(!collisionY)
      this.y = newY;

    // Shoot if shooting
    this.shootDelay--;
    if(this.isShooting && this.shootDelay <= 0) {
      this.shootDelay = pl_shootWait;
      this.shoot();
    }
  }

  this.shoot = function() {
    // Send 'shooting' to all clients
    var shootObj = {
      playerId: this.id
    };
    for(var i = 0; i < players.length; i++) {
      if(distSq(players[i].x, players[i].y, this.x, this.y) < pl_vision * pl_vision || players[i] == this) {
        players[i].socket.emit("shoot", shootObj);
      }
    }

    // Add bullet to array
    var b = new Bullet(this.x, this.y, this.dir, this);
    bullets.push(b);
  }

  // Check if player collides with an object
  this.collision = function(x, y, objSize) {
    objSize = objSize || 0;
    var sizeSq = (pl_size + objSize) * 0.5;
    sizeSq = sizeSq * sizeSq;
    return distSq(this.x, this.y, x, y) < sizeSq;
  }

  // On bullet hit
  this.bulletHit = function(bullet) {
    this.hp -= bl_damage;
    if(this.hp <= 0)
      bullet.owner.points += pl_playerKillPoints;
    if(this.hp <= 0) {
      this.socket.disconnect();
    }
  }
}

// Planet constructor
function Planet() {
  this.size = Math.random() * 120 + 150;
  var pos = pickPosition(this.size);
  this.x = pos.x;
  this.y = pos.y;
  this.maxHp = map(this.size, 150, 270, 100, 200);
  this.hp = this.maxHp;
  this.imageid = Math.floor(Math.random() * totalPlanets);
  this.id = nextPlanetId++;

  // Send planet object to all clients
  io.sockets.emit("planet", {
    x: this.x,
    y: this.y,
    size: this.size,
    id: this.id,
    imageid: this.imageid,
    maxHp: this.maxHp,
    hp: this.hp
  });

  // Check if planet collides with an object
  this.collision = function(x, y, objSize) {
    objSize = objSize || 0;
    var sizeSq = (this.size + objSize) * 0.5;
    sizeSq = sizeSq * sizeSq;
    return distSq(this.x, this.y, x, y) < sizeSq;
  }

  // Bullet hit
  this.bulletHit = function(bullet) {
    this.hp -= bl_damage;
    if(this.hp < bl_damage) this.hp = 0;
    if(this.hp <= 0) {
      // Add points to killer;
      bullet.owner.points += pl_planetKillPoints;

      // Remove planet and update clients
      io.sockets.emit("planet", {
        id: this.id,
        remove: true
      });
      planets.splice(planets.indexOf(this), 1);

      // Spawn new planet
      planets.push(new Planet());
    }

    io.sockets.emit("planet", {
      id: this.id,
      changehp: true,
      newHp: this.hp
    });
  }
}

// Bullet default values
var bl_speed = 75;
var bl_damage = 10;
function Bullet(x, y, dir, owner) {
  this.x = x;
  this.y = y;
  this.owner = owner;
  this.ownerid = this.owner.id;
  this.dirRad = radians((dir + 180) % 360);
  this.lifetime = 0;
  this.remove = false;

  this.update = function() {
    // Update lifetime
    this.lifetime++;

    // Update position
    this.x += Math.cos(this.dirRad) * bl_speed;
    this.y += Math.sin(this.dirRad) * bl_speed;

    // Check for collision
    // Player collision
    var collision = false;
    if(!collision) {
      for(var i = 0; i < players.length; i++) {
        if(players[i].id != this.ownerid && players[i].collision(this.x, this.y)) {
          collision = true;
          players[i].bulletHit(this);
          break;
        }
      }
    }
    // Planet collision
    if(!collision) {
      for(var i = 0; i < planets.length; i++) {
        if(planets[i].collision(this.x, this.y)) {
          collision = true;
          planets[i].bulletHit(this);
          break;
        }
      }
    }

    // Remove bullet if collision detected
    if(collision) this.remove = true;

    // Check if should be removed
    if(this.lifetime > 20 * 5) {
      this.remove = true;
    }
  }
}

// Clamp a value
function clamp(val, min, max) {
  if(val < min) val = min;
  if(val > max) val = max;
  return val;
}

// Degrees to radians
function radians(deg) {
  return deg * (Math.PI / 180);
}

// Radians to degrees
function degrees(rad) {
  return rad * (180 / Math.PI);
}

// DistanceSquared function
function distSq(x1, y1, x2, y2) {
  var a = x1 - x2;
  a = a * a;
  var b = y1 - y2;
  b = b * b;
  return a + b;
}

// Map function
function map(n, start1, stop1, start2, stop2) {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
