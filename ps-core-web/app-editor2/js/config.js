define(
	[
		"app",
	],
	function(app){
		app.config([
			'$routeProvider',
			'growlProvider',
			function(routeProvider, growlProvider){
				routeProvider
					.when('/editor/solution/:solutionId/:groupId/:modelId', {
						templateUrl : "partials/graphEditor.html",
						controller : "graphEditorCtrl"
					})
					.when('/editor/view/:viewId?/:saveToManagement?', {
						templateUrl : "partials/graphEditor.html",
						controller : "graphEditorCtrl"
					})
					.otherwise({
						redirectTo : "/editor/view"
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