app.controller('MainController', function($scope) {
	function toQueryString(obj) {
	    var parts = [];
	    for (var i in obj) {
	        if (obj.hasOwnProperty(i)) {
	            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
	        }
	    }
	    return parts.join("&");
	}

	$scope.login = function(){
	   var params = {
	        client_id: '8d29ee41c7b740ce83fe35d6ded4ea83',
	        redirect_uri: 'http://localhost:8000/callback',
	        scope: 'user-read-private playlist-read-private',
	        response_type: 'code'
	    };
	    
	    window.location = "https://accounts.spotify.com/authorize?" + toQueryString(params);
	}
});