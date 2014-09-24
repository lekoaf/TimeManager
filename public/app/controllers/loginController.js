(function (){

	var loginController = function ($scope, $log, $http, $location){
		$scope.error = "";

		$scope.loginSubmit = function(user){
			$http.post('/login', user).success(function (data){
				$log.log(data);
				$location.path('/today');
			}).error(function (data, status, header, config){
				$scope.error = data.error;
			});
		}
	};

	loginController.$inject = ['$scope', '$log', '$http', '$location'];
	angular.module('timeManager').controller('loginController', loginController);

})();