var mongoose = require('mongoose');

module.exports = mongoose.model( 'User', {
	name: String,
	spotify_username: String,
	playlists: [{
		name: String,
		url: String
	}],
	access_token: String,
	refresh_token: String
});