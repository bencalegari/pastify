var request 	   = require('request');
var querystring    = require('querystring');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// sample api route
	app.get('/api/nerds', function(req, res) {
		// use mongoose to get all nerds in the database
		Nerd.find(function(err, nerds) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(nerds); // return all nerds in JSON format
		});
	});

	// route to handle creating (app.post)
	// route to handle delete (app.delete)

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/', function(req, res) {
		res.sendfile('./public/views/index.html');
	});

	app.get('/playlists', function(req, res) {
		res.sendfile('./public/views/index.html');
	});

	app.get('/callback', function(req, res) {			
		var code = req.query.code;
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: 'http://localhost:8000/callback',
				grant_type: 'authorization_code',
				client_id: process.env['SPOTIFY_CLIENT_ID'],
				client_secret: process.env['SPOTIFY_CLIENT_SECRET']
			},
			json: true
		};

		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				console.log('Authorized!');
				var access_token = body.access_token,
					refresh_token = body.refresh_token;

				// var options = {
				// 	url: 'https://api.spotify.com/v1/me',
				// 	headers: { 'Authorization': 'Bearer ' + access_token },
				// 	json: true
				// };

		        res.redirect('/playlists#' +
				        querystring.stringify({
				            access_token: access_token,
				            refresh_token: refresh_token
				        }));
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
	        };
		});

		// res.sendfile('./public/views/index.html')
	})
};
