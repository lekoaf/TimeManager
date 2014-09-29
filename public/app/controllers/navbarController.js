(function (){

	angular.module('timeManager')
	.controller('navbarController', ['$scope', '$location', '$log', 'appSettings', 
		function ($scope, $location, $log, appSettings){
		$scope.appSettings = appSettings;

		$scope.isActive = function (viewLocation) {
	        return viewLocation === $location.path();
	    };

	    $scope.isLoggedinFn = function (){
	    	return ($location.path() === '/' || $location.path() === '/signup') ? false : true;
	    }
	}]);
})();