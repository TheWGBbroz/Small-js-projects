<!DOCTYPE html>
<html>
<head>
	<title> Music Interface </title> <!-- Title -->

	<link type="text/css" rel="stylesheet" href="css/bootstrap.min.css"> <!-- Bootstrap CSS (Minfied) -->
	<link type="text/css" rel="stylesheet" href="css/font-awesome.min.css"> <!-- Bootstrap CSS (Minfied) -->
	<link type="text/css" rel="stylesheet" href="css/animate.min.css"> <!-- animate.css (Minfied) -->
	<link type="text/css" rel="stylesheet" href="css/custom.css"> <!-- custom.css (Unminfied) -->

	<script src="js/jquery.min.js"></script> <!-- JQuery (Minified) -->
	<script src="js/bootstrap.min.js"></script> <!-- Bootstrap JS (Minified) -->
	<script src="js/html5slider.js"></script> <!-- HTML5 Slider (Minified) -->
	<script src="js/player.js"></script> <!-- Player script -->

	<script>

	</script>
</head>
<nav class="navbar navbar-default navbar-fixed-top">
	<div class="container-fluid">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">Music Interface</a>
		</div>
	</div>
</nav>
<body>
	<div class="nav-con-space"></div>
	<div class="container">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Music player</h3>
			</div>
			<div class="panel-body">

				<audio id="audio" src="assets/audio/song1.mp3"></audio> <!-- Audio player -->

				<a class="btn btn-default" href="javascript:play()"><span class="fa fa-play"></span></a> <!-- Play button -->
				<a class="btn btn-default" href="javascript:pause()"><span class="fa fa-pause"></span></a> <!-- Pause button -->
				<p id="time">0:00</p>

				<div class="progress progress-striped active" style="width: 1108px;">
					<div class="progress-bar" role="progressbar" style="width: 0px" id="progress_curr">
					</div>
				</div>

			</div>
		</div>
	</div>
</body>
</html>