function StreamGames(apiKey) {
  this.apiKey = apiKey;

  this.setApiKey = function(apiKey) {
    this.apiKey = apiKey;
  }

  this.getLiveStatus = function(user, callback) {
    sg_get("http://streamgames.co.uk/api/v1/livestatus/?apikey=" + this.apiKey + "&data=" + user, callback);
  }

  this.getUserInfo = function(user, callback) {
    sg_get("http://streamgames.co.uk/api/v1/userinfo/?apikey=" + this.apiKey + "&data=" + user, callback);
  }

  this.isLive = function(user) {
    return sg_getSync("http://streamgames.co.uk/api/v1/livestatus/?apikey=" + this.apiKey + "&data=" + user).livestatus == 1;
  }

  this.getTitle = function(user) {
    return sg_getSync("http://streamgames.co.uk/api/v1/userinfo/?apikey=" + this.apiKey + "&data=" + user).streamtitle;
  }

  this.getGame = function(user) {
    return sg_getSync("http://streamgames.co.uk/api/v1/userinfo/?apikey=" + this.apiKey + "&data=" + user).streamgame;
  }

  this.getViewers = function(user) {
    return sg_getSync("http://streamgames.co.uk/api/v1/userinfo/?apikey=" + this.apiKey + "&data=" + user).viewers;
  }

  this.getWarnings = function(user) {
    return sg_getSync("http://streamgames.co.uk/api/v1/userinfo/?apikey=" + this.apiKey + "&data=" + user).warnings;
  }


  this.createStream = function(type, data, callback) {
    var instance = this;

    if(type == "livestatus") {
      var wasLive = instance.isLive(data.user);
      setInterval(function() {
        var isLive = instance.isLive(data.user);
        if(!wasLive && isLive) {
          // User has gone online

          callback({live: true});
        }else if(wasLive && !isLive) {
          // User has gone offline

          callback({live: false});
        }
        wasLive = isLive;
      }, 1000);
    }else{
      console.log("Wrong stream type!");
    }
  }

  this.getChannelLink = function(user) {
    return "http://streamgames.co.uk/view.php?channel=" + user;
  }
}

function sg_get(url, callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      var res = JSON.parse(req.responseText);
      if(callback) {
        callback(res);
      }
    }
  }
  req.open("GET", url, true);
  req.send();
}

function sg_getSync(url) {
  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);
  return JSON.parse(req.responseText);
}
