(function (){

	angular.module('timeManager')
	.controller('navbarController', ['$scope', '$location', '$log', 
		function ($scope, $location, $log){

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
	}]);
})();