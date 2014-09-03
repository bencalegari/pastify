var request 	   	= require('request');
var querystring    	= require('querystring');
var passport 		= require('passport');
var User 			= require('./models/user')


module.exports = function(app) {

	// server routes ===========================================================
	app.get('/api/users/:username', function(req, res) {
		User.findOne({
			spotify_username: req.params.username 
		}, function(err, user) {
			if (err)
				res.send(err);
			res.json(user);
		});
	});

	app.post('/api/users/', function(req, res) {
		User.create({
			name: req.body.somethin,
			spotify_username: req.body.username,
			access_token: req.user.access_token,
			refresh_token: req.user.refresh_token
		}, function(err, user) {
			if (err)
				res.send(err)
			res.status(200).send({message: 'User saved.'});
		});
	});

	// route to handle delete (app.delete)

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/', function(req, res) {
		res.sendfile('./public/views/index.html');
	});

	app.get('/playlists/:username', function(req, res) {
		res.sendfile('./public/views/index.html');
	});

	app.get('/login', 
		passport.authenticate('spotify', {scope: ['user-read-private', 'playlist-modify-private']}),
  		function(req, res){
	});

	app.get('/callback',	
		passport.authenticate('spotify', { failureRedirect: '/login' }),
	  	function(req, res) {
		  	var username = req.user.profile.username
		  	
		  	// If the user exists, find them and redirect to their page. 
		  	User.find({ username: username }, function(err, user) {
				if (!err && user.length > 0) {
					// Refresh access token.
					User.update({username: username}, {callback_token: newToken});
					res.redirect('/' + user.username)
				} else if (err) {
					res.send(err);
				} else {
					// If not, create the user.
					User.create({
				  		name: req.user.profile.displayName,
						spotify_username: username,
						access_token: req.user.accessToken,
						refresh_token: req.user.refreshToken
					}, function(err, user) {
						if (err)
							res.send(err)
						User.findOne({ spotify_username: user.spotify_username}, function(err, new_user){
							if (err) {
								res.send("Whoops! Can't find that user. Look: " + err);
							} else {
								res.redirect('/playlists/' + new_user.spotify_username)	
							}
						})
					})
				}
			});
		}
	);
};
