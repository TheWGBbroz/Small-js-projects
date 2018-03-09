var sg = new StreamGames("YOUR API KEY");

sg.getLiveStatus("TheWGBbroz", function(data) {
  // data.username = Requested username.
  // data.livestatus = 1 if the user is live and 0 if the user is not live.
});

sg.getUserInfo("TheWGBbroz", function(data) {
  // data.username = Requested username.
  // data.livestatus = 1 if the user is live and 0 if the user is not live.
  // data.streamtitle = The title of the user's stream.
  // data.streamgame = The game the user is streaming.
  // data.viewers = The number of viewers the user's stream has.
  // data.warnings = The number of warnings the user has.
  // data.colour = The color of the user.
});

// Returns whether or not the user is live.
sg.isLive("TheWGBbroz");

// Returns the user's stream title.
sg.getTitle("TheWGBbroz");

// Returns the user's stream game.
sg.getGame("TheWGBbroz");

// Returns the number of viewers the user's stream has.
sg.getViewers("TheWGBbroz");

// Returns the number of warnings the user has.
sg.getWarnings("TheWGBbroz");


// Creates a stream you can listen to.
// Available stream types are:

// "livestatus", gets called when a user's live status has changed.
// Example:
//  {
//    live: true
//  }
sg.createStream("livestatus", {user: "TheWGBbroz"}, function(data) {
  
});
