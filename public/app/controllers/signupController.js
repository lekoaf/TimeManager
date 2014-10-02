(function (){
	angular.module('timeManager')
	.controller('signupController', ['$scope', '$log', '$location', 'ajaxFactory',
		function ($scope, $log, $location, ajaxFactory){
		$scope.signupSubmit = function(user){
			ajaxFactory.postSignup(user).success(function (data){
				$log.log(data);
				$location.path('/today');
			}).error(function (data, status, header, config){
				sweetAlert("Oops...", data.error, "error");
			});
		}
	}]);
})();