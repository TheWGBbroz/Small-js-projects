$(document).ready(function() {
	var input = $("#input");
	var output = $("#output");

	input.on("input", function() {
		var text = input.val();
		var bigLetters = "";

		for(var i = 0; i < text.length; i++) {
			var ch = text.charAt(i);
			var s;
			if((ch >= 'a' && ch <= 'z') || (ch >= 'A' & ch <= 'Z'))
				s = ":regional_indicator_" + ch + ":";
			else
				s = ch;

			bigLetters += s + " ";
		}

		output.html(bigLetters);
	});
});