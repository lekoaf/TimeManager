(function (){

	angular.module('timeManager')
	.controller('navbarController', ['$scope', '$location', '$log', 
		function ($scope, $location, $log){

		$scope.isActive = function (viewLocation) {
	        return viewLocation === $location.path();
	    };

	    $scope.isLoggedinFn = function (){
	    	return ($location.path() === '/' || $location.path() === '/signup') ? false : true;
	    }
	}]);
})();