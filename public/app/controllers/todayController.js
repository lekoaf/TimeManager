(function (){

	var ctrl = angular.module('timeManager');

	ctrl.controller('todaycController', ['$scope', '$log', '$http', 
		function ($scope, $log, $http){
		$scope.total = {};

		$scope.calculateToday = function (time){
			$log.log(time);

			var inh = parseFloat(time.inh);
		    var inm = parseFloat(time.inm);
		    var lunch = parseFloat(time.lunch);
		    var uth = parseFloat(time.uth);
		    var utm = parseFloat(time.utm);

			var tot = (uth + (utm / 60)) - (inh + (inm / 60)) - (lunch / 60);
    		tot = tot.toFixed(2);
			
			$log.log(tot);

			var today = {
	            inh: inh,
	            inm: inm,
	            lunch: lunch,
	            outh: uth,
	            outm: utm,
	            tot: tot
	        };

	        $http.post('/today', today).success(function (data){
	        	checkToday();
	        }).error(function (data, status, header, config){
	        	$log.log(data);
	        });
		};

		var checkToday = function (){
			$http.get('/checktoday').success(function (data){
				$log.log(data);
				$scope.total = data.tot;
			}).error(function (data, status, header, config){
				$log.log(data);
			});
		};
		checkToday();
	}]);
})();