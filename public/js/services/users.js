app.service('userService', [])
	.factory('Users', function($http) {
		return {
			get : function(username) {
				return $http.get('/api/users/' + username);
			},
			create : function(userData) {
				return $http.post('/api/users', userData);
			}
		}
	});