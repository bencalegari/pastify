angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/views/home.html',
			controller: 'MainController'
		})
		.when('/playlists/:username', {
			templateUrl: '/views/playlists.html',
			controller: 'PlaylistController',
			resolve: {
				username: function($route) {
					return $route.current.params.username;
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		})
	$locationProvider.html5Mode(true);
}]);