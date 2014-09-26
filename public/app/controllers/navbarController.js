(function (){

	angular.module('timeManager')
	.controller('navbarController', ['$scope', '$location', '$http', '$log', 
		function ($scope, $location, $http, $log){

		// $scope.isadmin = false;

		$scope.isActive = function (viewLocation) {
	        return viewLocation === $location.path();
	    };

	    $scope.isLoggedinFn = function (){

	    	return ($location.path() === '/' || $location.path() === '/signup') ? false : true;

	    	if ($location.path() === '/' || $location.path() === '/signup'){
	    		return false;
	    	}
	    	else{
	    		return true;	
	    	}
	    }

	    var isAdmin = function (){
	    	$log.log("Hej hopp");
	    	// $http.get('/checkUser').success(function (user){
    		// 	$scope.isadmin = user.isadmin;
    		// }).error(function (data, status, header, config){
    		// 	$log.log(data);
    		// });

   			//  $http.get('/checktoday').success(function (data){
			// 	$log.log(data);
			// 	$scope.total = data.tot;
			// }).error(function (data, status, header, config){
			// 	$log.log(data);
			// });
	    }

	}]);

})();