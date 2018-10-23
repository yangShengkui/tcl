define(
	[
		"app",
	],
	function(app){
		app.config([
			'$routeProvider',
			'$locationProvider',
			'$controllerProvider',
			'$compileProvider',
			'$filterProvider',
			'$provide',
			"$httpProvider",
			'growlProvider',
			function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, growlProvider){
				app.registerController = $controllerProvider.register;
				app.registerDirective = $compileProvider.directive;
				app.registerFilter = $filterProvider.register;
				app.registerFactory = $provide.factory;
				app.registerService = $provide.service;
				$routeProvider
					.when('/bridge', {
						templateUrl : "partials/bridge.html",
						controller : "bridgeViewCtrl"
					})
					.when('/bridge/detail', {
						templateUrl : "partials/bridge-detail.html",
						controller : "bridgeDetailCtrl"
					})
					.when('/bridge/warning', {
						templateUrl : "partials/bridge-warning.html",
						controller : "bridgeWarningCtrl"
					})
					.otherwise({
						redirectTo : "/bridge"
					});
				growlProvider.globalTimeToLive({
					success: 3000,
					error: 5000,
					warning: 5000,
					info: 5000
				});
			}])
	}
)