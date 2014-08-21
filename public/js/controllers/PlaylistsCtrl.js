app.controller('PlaylistController', function($scope, $location, username, Users) {
	var access_token;
	var refresh_token;
	Users.get(username)
		.success(function(user) {
			$scope.user = user
			access_token = user.access_token
			refresh_token = user.refresh_token
			console.log($scope.user)
		})
		// .failure(function(err) {
		// 	$scope.errors = "Can't find that user! Error: " + err
		// })
});