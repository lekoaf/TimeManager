(function (){

	angular.module('timeManager')
	.controller('loginController', ['$scope', '$log', '$location', 'ajaxFactory', 
		function ($scope, $log, $location, ajaxFactory){
		$scope.loginSubmit = function(user){
			ajaxFactory.postLogin(user).success(function (data){
				$log.log(data);

				$scope.$emit('isadmin', data.isadmin);

				$location.path('/today');
			}).error(function (data, status, header, config){
				sweetAlert("Oops...", data.error, "error");
			});
		}
	}]);

})();