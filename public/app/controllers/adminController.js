(function (){

	angular.module('timeManager')
	.controller('adminController', ['$scope', '$log', '$http', 
		function ($scope, $log, $http){

		$scope.users = [];

		$scope.addOrRemoveAdmin = function (uid, type){
			$http.put('/adminpermission/'+uid+'/'+type).success(function (data){
				$log.log(data);
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