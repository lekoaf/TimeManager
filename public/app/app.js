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
			.otherwise({redirectTo: '/'});
	});

})();