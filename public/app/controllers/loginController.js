(function (){

	angular.module('timeManager')
	.controller('loginController', ['$scope', '$log', '$http', '$location', 
		function ($scope, $log, $http, $location){
		$scope.error = "";

		$scope.loginSubmit = function(user){
			$http.post('/login', user).success(function (data){
				$log.log(data);
				$location.path('/today');
			}).error(function (data, status, header, config){
				$scope.error = data.error;
			});
		}
	}]);

})();