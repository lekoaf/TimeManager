(function (){

	angular.module('timeManager')
	.controller('signupController', ['$scope', '$log', '$http', '$location',
		function ($scope, $log, $http){
		$scope.error = "";

		$scope.signupSubmit = function(user){
			$http.post('/signup', user).success(function (data){
				$log.log(data);
				$location.path('/today');
			}).error(function (data, status, header, config){
				$scope.error = data.error;
			});
		}
	}]);

})();