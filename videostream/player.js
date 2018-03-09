var video;
var videoHeight;

function setup() {
  var canvas = createCanvas(960, 540); // 960, 540
  canvas.parent("video_player");

  video = createVideo("video.mp4");
  video.hide();

  videoHeight = width * video.height / video.width;

  var ppSize = 32;
  playPause = {
    isPaused: false,
    width: ppSize,
    height: ppSize,
    x: 20,
    y: height - 10 - ppSize,
    pauseImg: loadImage("res/pause.png"),
    playImg: loadImage("res/play.png")
  };

  if(!playPause.isPaused) video.loop();
}

function draw() {
  background(0);

  image(video, 0, height / 2 - videoHeight / 2, width, videoHeight);

  noStroke();
  fill(51, 200);
  rect(0, height, width, -50);

  var img = playPause.isPaused ? playPause.playImg : playPause.pauseImg;
  image(img, playPause.x, playPause.y, playPause.width, playPause.height);
}

function keyPressed() {
  if(key == ' ') {
    ppClicked();
  }
}

function ppClicked() {
  playPause.isPaused = !playPause.isPaused;
  if(playPause.isPaused) {
    video.pause();
  }else{
    video.loop();
  }
}
