$(document).ready(function() {
	console.log("Ready");
	setGPIO("192.168.2.16:4343", 0, 1);
});

function setGPIO(address, pin, status) {
	var url = "http://" + address + "/setpin/" + pin + "/" + status;

	$.ajax({
		url: url,
		success: function(data) {
			console.log(data);
		}
	});
}
