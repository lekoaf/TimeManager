(function (){

	angular.module('timeManager').factory('ajaxFactory', ['$http', function ($http){
		var factory = {};

		factory.postLogin = function (user){
			return $http.post('/login', user);
		};

		factory.postSignup = function (user){
			return $http.post('/signup', user);
		};

		factory.postToday = function(today){
			return $http.post('/today', today);
		};

		factory.getCheckToday = function() {
			return $http.get('/checktoday');
		};

		factory.getGetMonth = function(month){
			return $http.get('/getmonth/'+month);
		};

		factory.putSettings = function(settings){
			return  $http.put('/settings', settings);
		};

		factory.getSettings = function(){
			return $http.get('/settings');
		};

		factory.putAdminPermission = function(uid, type){
			return $http.put('/adminpermission/'+uid+'/'+type);
		};

		factory.getAdminUsers = function(){
			return $http.get('/adminusers');
		};

		factory.getAdminReport = function(uid){
			return $http.get('/adminreport/'+uid);
		}

		return factory;
	}]);

})();