function setup() {
	noCanvas();

	loadStrings("sampletext.txt", function(data) {
		var uncompressed = join(data, "\n");
		createP("Uncompressed length: " + uncompressed.length);

		var compressed = compress(uncompressed);
		createP("Compressed length: " + compressed.length);
    createP("Compressed:<br>" + compressed);

		var decompressed = decompress(compressed);
		createP("Decompressed length: " + decompressed.length);
		createP("Decompressed:<br>" + decompressed);
	});
}

function decompress(compressed) {
	var decompressed = "";

  var started = false;
  var temp_between = "";
  for(var i = 0; i < compressed.length; i++) {
    var c = compressed.charAt(i);
    if(!started) {
      if(c === "<") {
        started = true;
      }else{
        decompressed += c;
      }
    }else{
      if(c === ">") {
        started = false;
        var splitted = temp_between.split(",");
        var pos = parseInt(splitted[0]);
        var len = parseInt(splitted[1]);
        temp_between = "";
        decompressed += compressed.substr(pos, len);
      }else{
        temp_between += c;
      }
    }
  }

	return decompressed;
}

function compress(uncompressed) {
	var compressed = "";

	var words = [];
  var currWord = "";
  for(var i = 0; i < uncompressed.length; i++) {
    var c = uncompressed.charAt(i);
    if(c === "<" || c === ">") continue;

    if(c === " ") {
      compressed += " ";
      var sameWord = undefined;
      for(var j = 0; j < words.length; j++) {
        if(words[j].word == currWord) {
          sameWord = words[j];
          break;
        }
      }
      if(sameWord === undefined) {
        if(currWord.length > 4) {
          words.push({
            word: currWord,
            pos: i - currWord.length
          });
        }
        compressed += currWord;
      }else{
        //compressed += "<" + String.fromCharCode(sameWord.pos) + String.fromCharCode(sameWord.word.length) + ">";
        //compressed += "<" + String.valueOf(sameWord.pos) + "," + String.valueOf(sameWord.word.length) + ">";
        console.log("<" + sameWord.pos + "," + sameWord.word.length + ">");
        compressed += "<" + sameWord.pos + "," + sameWord.word.length + ">";
      }
      currWord = "";
    }else{
      currWord += c;
    }
  }

	return compressed;
}
