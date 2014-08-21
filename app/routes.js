var request 	   	= require('request');
var querystring    	= require('querystring');
var passport 		= require('passport');
var User 			= require('./models/user')


module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// sample api route
	app.get('/api/users/:username', function(req, res) {
		// use mongoose to get all nerds in the database
		User.find({
			username: req.params.username 
		}, function(err, user) {
			if (err)
				res.send(err);
			res.json(user);
		});
	});

	// route to handle creating (app.post)
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


		

				// var options = {
				// 	url: 'https://api.spotify.com/v1/me',
				// 	headers: { 'Authorization': 'Bearer ' + access_token },
				// 	json: true
				// };

		        // res.redirect('/playlists?' +
				      //   querystring.stringify({
				      //       access_token: access_token,
				      //       refresh_token: refresh_token
				      //   }));
		        // request.get(options, function(error, response, body) {
		        // 	if (!error && response.statusCode === 200) {
		        // 		console.log('Getting Playlist...');
		        // 		var user_id = body.id.toLowerCase();         
			       //      var options = {
			       //      	url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
			       //          headers: {
			       //              'Authorization': 'Bearer ' + access_token
			       //          },
			       //          json: true
			       //      }
			       //      request.get(options, function(error, response, body) {
			       //          if (!error && response.statusCode === 200) {
			       //          	console.log(body.items);
			       //          }
			       //      });	
		        // 	}
		        // });
	        // };
		// });

		// res.sendfile('./public/views/index.html')
	// })
};
