(function (){

	var injections = ['$scope', '$log', '$http', '$location'];
	
	var signupController = function ($scope, $log, $http, $location){
		$scope.error = "";

		$scope.signupSubmit = function(user){
			$http.post('/signup', user).success(function (data){
				$log.log(data);
				$location.path('/today');
			}).error(function (data, status, header, config){
				$scope.error = data.error;
			});
		}
	};

	signupController.$inject = injections;
	angular.module('timeManager').controller('signupController', signupController);

})();