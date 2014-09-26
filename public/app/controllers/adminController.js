(function (){

	angular.module('timeManager')
	.controller('adminController', ['$scope', '$log', '$http', 
		function ($scope, $log, $http){

		$scope.users = [];
		$scope.sortBy = '-statistics.lastlogin';

		$scope.doSort = function (propName){
			$scope.sortBy = propName;
	        $scope.reverse = !$scope.reverse;
		};

		$scope.toggleAdmin = function (user){
			
			var type = 'mk';
			
			if (user.isadmin){
				type = 'rm';
			}

			$http.put('/adminpermission/'+user._id+'/'+type).success(function (data){
				$log.log(data);
				getUsers();
			}).error(function (data, status, header, config){
				$log.log(data);
			});
		};
		
		var getUsers = function (){
			$http.get('/adminusers').success(function (users){
				$log.log(users);
				$scope.users = users;
			}).error(function (data, status, header, config){
				$log.log(data);
			});
		};

		getUsers();

	}]);

})();