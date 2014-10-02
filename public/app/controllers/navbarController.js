(function (){

	angular.module('timeManager')
	.controller('navbarController', ['$scope', '$location', '$log', 'appSettings', 
		function ($scope, $location, $log, appSettings){
		$scope.appSettings = appSettings;

		$scope.isadmin = false;

		$scope.$on('isadmin', function (e, isadmin){
			$scope.isadmin = isadmin;
		});

		$scope.isActive = function (viewLocation) {
	        return viewLocation === $location.path();
	    };

	    $scope.isLoggedinFn = function (){
	    	return ($location.path() === '/' || $location.path() === '/signup') ? false : true;
	    }
	}]);
})();