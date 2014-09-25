(function (){

	var ctrl = angular.module('timeManager');

	ctrl.controller('settingsController', ['$scope', '$log', '$http', 
		function ($scope, $log, $http){
		$scope.settings = {};

		$scope.setSettings = function (settings){
			$http.put('/settings', settings).success(function (data){
				
				$log.log(data);

			}).error(function (data, status, header, config){

				$log.log(data);

			});
		}

		var getSettings = function (){
			$http.get('/settings').success(function (data){

				$scope.settings = data;

			}).error(function (data, status, header, config){

				$log.log(data);

			});
		}

		getSettings();

	}]);
})();