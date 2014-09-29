(function (){
	angular.module('timeManager')
	.controller('excelController', ['$scope', '$http', '$log', '$window', 
		function ($scope, $http, $log, $window){
		$scope.getExcelReport = function (report){
			$log.log(report);

			$window.location.href = '/excel/'+report.type+'/'+report.period;
		};
	}]);
})();