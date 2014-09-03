app.service('spotifyService', function($resource, $http, $q) {
	var service = {}

	service.getPlaylists = function(username, access_token) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: 'https://api.spotify.com/v1/' + username + '/playlists',
			params: 'json=true',
			data: {},
			headers: { 'Authorization': 'Bearer ' + access_token }
		}).then(function(response) {
			deferred.resolve(response.data);
			debugger;
		}, function(err) {
			deferred.reject(err);
		});
		return deferred.promise
	}
	
	return service;


});