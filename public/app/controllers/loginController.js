(function (){

	angular.module('timeManager')
	.controller('loginController', ['$scope', '$log', '$location', 'ajaxFactory', 'appSettings', 
		function ($scope, $log, $location, ajaxFactory, appSettings){
		$scope.error = "";

		$scope.loginSubmit = function(user){

			ajaxFactory.postLogin(user).success(function (data){
				$log.log(data);
				appSettings.isadmin = data.isadmin;
				$location.path('/today');
			}).error(function (data, status, header, config){
				$scope.error = data.error;
			});
		}
	}]);

})();