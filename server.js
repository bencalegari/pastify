// modules =================================================
var express        	= require('express');
var app            	= express();
var mongoose       	= require('mongoose');
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var DotEnv 		   	= require('dotenv-node');
var passport		= require('passport');

// configuration ===========================================
	
// config files
new DotEnv();
var db = require('./config/db');

var port = process.env.PORT || 8000; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// passport setup ==================================================
var SpotifyStrategy = require('passport-spotify/lib/passport-spotify/index').Strategy;
var appKey = process.env['SPOTIFY_CLIENT_ID'];
var appSecret = process.env['SPOTIFY_CLIENT_SECRET'];

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: 'http://localhost:8000/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      var spotifyPayload = {
        profile: profile,
        accessToken: accessToken,
        refreshToken: refreshToken
      }
      return done(null, spotifyPayload);
    });
  }));
app.use(passport.initialize());
app.use(passport.session());

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
app.listen(port);										// startup our app at http://localhost:8080
console.log("It's goin down on port " + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app