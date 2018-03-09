var intervalId = 0;

function updateAudio() {
	var el = document.getElementsByTagName("audio")[0];
	var newWidth = Math.floor(el.currentTime / el.duration * 1108);
	document.getElementById("progress_curr").style.width = newWidth.toString() + "px";
	
	var mins = Math.floor(el.currentTime / 60);
	var secs = Math.floor(el.currentTime % 60);
	if(secs < 10) secs = "0" + secs;
	document.getElementById("time").innerHTML = mins + ":" + secs;
}

function play() {
	document.getElementById('audio').play();
	intervalId = setInterval(updateAudio, 100);
}

function pause() {
	document.getElementById('audio').pause();
	clearInterval(intervalId);
}