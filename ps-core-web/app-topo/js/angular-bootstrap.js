define(['angular', 'domReady', 'app'], function(angular, domReady) {
	require(['config', 'controllers', 'services', 'directives', 'filters'], function(){
		require(['domReady!'], function(document) {
			angular.bootstrap(document, ['myapp']);
		});
	});
});