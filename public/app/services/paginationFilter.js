(function (){
	angular.module('timeManager').filter('paginationFilter', function() {
	return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);
		};
	});
})();