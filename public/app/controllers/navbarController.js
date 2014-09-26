(function (){

	angular.module('timeManager')
	.controller('navbarController', ['$scope', '$location', function ($scope, $location){
		$scope.isActive = function (viewLocation) { 
	        return viewLocation === $location.path();
	    };
	}]);

})();