(function (){

	angular.module('timeManager')
	.controller('monthController', ['$scope', '$log', '$routeParams', 'ajaxFactory', 
		function ($scope, $log, $routeParams, ajaxFactory){
		$scope.itemsPerPage = 16;
		$scope.currentPage = 0;
		$scope.sortBy = '-date';
		$scope.month = [];
		$scope.total = 0;

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

		$scope.range = function() {
			var rangeSize = 5;
			var ret = [];
			var start;
			start = $scope.currentPage;

			if ( start > $scope.pageCount()-rangeSize ) {
				start = $scope.pageCount()-rangeSize+1;
			}
			
			for (var i = start; i < start + rangeSize; i++) {
				if (i >= 0){
					ret.push(i);
				}
			}
			return ret;
		};
		
		$scope.prevPage = function() {
			if ($scope.currentPage > 0) {
				$scope.currentPage--;
			}
		};

		$scope.prevPageDisabled = function() {
			return $scope.currentPage === 0 ? "disabled" : "";
		};

		$scope.pageCount = function() {
			return Math.ceil($scope.month.length/$scope.itemsPerPage)-1;
		};

		$scope.nextPage = function() {
			if ($scope.currentPage < $scope.pageCount()) {
				$scope.currentPage++;
			}
		};

		$scope.nextPageDisabled = function() {
			return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
		};

		$scope.setPage = function(n) {
			$scope.currentPage = n;
		};

		ajaxFactory.getGetMonth($routeParams.m).success(function (data){
			$log.log(data);
			convertTimes(data);
		}).error(function (data, status, header, config){
			$log.log(data);
		});
	}]);
})();