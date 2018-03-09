var Nexus = {};

(function() {
	Nexus.getUrlParams = function() {
		var queryStr = {};
		var query = window.location.search.substring(1);
		if(query.length == 0) return queryStr;
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (typeof queryStr[pair[0]] === "undefined") {
				queryStr[pair[0]] = decodeURIComponent(pair[1]);
			} else if (typeof queryStr[pair[0]] === "string") {
				var arr = [ queryStr[pair[0]],decodeURIComponent(pair[1]) ];
				queryStr[pair[0]] = arr;
			} else {
				queryStr[pair[0]].push(decodeURIComponent(pair[1]));
			}
		} 
		return queryStr;
	}
})();