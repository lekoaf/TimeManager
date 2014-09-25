(function(){

	var app = angular.module('timeManager', ['ngRoute', 'ngAnimate']);

	app.config(function ($routeProvider){
		$routeProvider
			.when('/', {
				controller: 'loginController',
				templateUrl: 'app/views/login.html'
			})
			.when('/signup', {
				controller: 'signupController',
				templateUrl: 'app/views/signup.html'
			})
			.when('/today', {
				controller: 'todayController',
				templateUrl: 'app/views/today.html'
			})
			.when('/month/:m', {
				controller: 'monthController',
				templateUrl: 'app/views/month.html'
			}).
			when('/settings', {
				controller: 'settingsController',
				templateUrl: 'app/views/settings.html'
			})
			.when('/excel', {
				controller: 'excelController',
				templateUrl: 'app/views/excel.html'
			})
			.when('/admin', {
				controller: 'adminController',
				templateUrl: 'app/views/admin.html'
			})
			.otherwise({redirectTo: '/'});
	});

})();