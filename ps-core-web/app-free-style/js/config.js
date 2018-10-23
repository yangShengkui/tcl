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
				$locationProvider.hashPrefix(''); //Ag1.6版本默认路由为!
				app.registerController = $controllerProvider.register;
				app.registerDirective = $compileProvider.directive;
				app.registerFilter = $filterProvider.register;
				app.registerFactory = $provide.factory;
				app.registerService = $provide.service;
				$routeProvider
					.when('/:viewId/:page?/:parameter?', {
						templateUrl : "partials/free-style.html",
						controller : "freeStyleCtrl"
					})
				growlProvider.globalTimeToLive({
					success: 3000,
					error: 5000,
					warning: 5000,
					info: 5000
				});
			}])
	}
)