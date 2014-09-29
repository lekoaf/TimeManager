(function (){

	angular.module('timeManager')
	.controller('loginController', ['$scope', '$log', '$location', 'ajaxFactory', 
		function ($scope, $log, $location, ajaxFactory){
		$scope.error = "";

		$scope.loginSubmit = function(user){

			ajaxFactory.postLogin(user).success(function (data){
				$log.log(data);
				$location.path('/today');
			}).error(function (data, status, header, config){
				$scope.error = data.error;
			});
		}
	}]);

})();