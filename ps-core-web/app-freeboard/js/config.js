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
					.when('/service/view/:flag/:viewId?', {
						templateUrl : "partials/freeboard.html",
						controller : "freeBoardCtrl"
					})
					.when('/freeboard/solution/:flag/:solutionId/:serviceViewId', {
						templateUrl : "partials/freeboard.html",
						controller : "freeBoardCtrl"
					})
					.when('/freeboard/view/:flag/:viewId?/:saveToManagement?', {
						templateUrl : "partials/freeboard.html",
						controller : "freeBoardCtrl"
					})
          .when('/template/:type/:flag/:params', {
            templateUrl : "partials/freeboard.html",
            controller : "freeBoardCtrl"
          })
          .when('/specialist/:flag/:kqiModelId', {
            templateUrl : "partials/freeboard.html",
            controller : "freeBoardCtrl"
          })
					.when('/editor/solution/:flag/:solutionId/:groupId/:modelId', {
						templateUrl : "partials/freeboard.html",
						controller : "freeBoardCtrl"
					})
					.when('/editor/view/:flag/:viewId?/:saveToManagement?', {
						templateUrl : "partials/freeboard.html",
						controller : "freeBoardCtrl"
					})
					/**.otherwise({
						redirectTo : "/freeboard/view/home"
					});*/
				growlProvider.globalTimeToLive({
					success: 3000,
					error: 5000,
					warning: 5000,
					info: 5000
				});
				$httpProvider.defaults.withCredentials = true;
			}])
	}
)