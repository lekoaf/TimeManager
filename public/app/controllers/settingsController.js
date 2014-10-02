(function (){

	angular.module('timeManager')
	.controller('settingsController', ['$scope', '$log', 'ajaxFactory', 
		function ($scope, $log, ajaxFactory){
		$scope.settings = {};

		$scope.setSettings = function (settings){
			ajaxFactory.putSettings(settings).success(function (data){
				sweetAlert("Excellent!", "Thanks for providing info.", "success");
			}).error(function (data, status, header, config){
				sweetAlert("Oops...", data.error, "error");
			});
		}

		var getSettings = function (){
			ajaxFactory.getSettings().success(function (data){
				$scope.settings = data;
				$log.log(data);
			}).error(function (data, status, header, config){
				$log.log(data);
			});
		}

		getSettings();
	}]);
})();