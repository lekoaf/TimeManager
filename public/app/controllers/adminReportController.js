(function (){

	angular.module('timeManager')
	.controller('adminReportController', ['$scope', '$log', '$http', '$routeParams', 
		function ($scope, $log, $http, $routeParams){
		$scope.sortBy = '-date';
		$scope.month = [];
		$scope.total = 0;
		$scope.reportName = "";
		$scope.theDate = new Date();

		$scope.doSort = function(propName) {
           $scope.sortBy = propName;
           $scope.reverse = !$scope.reverse;
        };

		var convertTimes = function (d){
		    for (var i = 0; i < d.length; i++){
		        if (d[i].inm == 0){
		            d[i].inm = '00';
		        }
		        if (d[i].outm == 0){
		            d[i].outm = '00';
		        }
		        if  (d[i].inh.length == 1){
		            d[i].inh = '0'+d[i].inh;
		        }
		        if  (d[i].outh.length == 1){
		            d[i].outh = '0'+d[i].outh;
		        }
		        
		        d[i].tot = parseFloat(d[i].tot).toFixed(2);

		        $scope.total += parseFloat(d[i].tot);

		        $scope.month.push(d[i]);
		    }
		}

		$http.get('/adminreport/' + $routeParams.uid).success(function (data){
			$log.log(data);
			convertTimes(data.tidtabell);

			if (data.user.fname && data.user.lname){
				$scope.reportName = data.user.fname + ' ' + data.user.lname;
			}
			else{
				$scope.reportName = data.user.email;
			}

		}).error(function (data, status, header, config){
			$scope.error = data.error;
		});
	}]);
})();