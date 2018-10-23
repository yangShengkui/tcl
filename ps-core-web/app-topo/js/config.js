define(
	[
		"angular",
	], 
	function(angular){
		var module = angular.module("myapp");
		module.config([
			'$routeProvider', 
		function(routeProvider){
			routeProvider
				.when('/', {
					templateUrl : "partial/login.html",
					controller : "loginController",
					resolve : {
						successLogin : function(loginManagement){
							return loginManagement.loginChecking_login();
						}
					}
				})
				.when('/topology/:mode/:flag/:solutionId/:id?', {
					templateUrl : "partial/topology.html",
					controller : "mainController",
					resolve : {
						successLogin : function(loginManagement){
							return loginManagement.loginChecking_others();
						}
					}
				})
				.when('/toposhow', {
					templateUrl : "partial/toposhow.html",
					controller : "toposhowController",
					resolve : {
						successLogin : function(loginManagement){
							return loginManagement.loginChecking_others();
						}
					}
				})
		}]);
		module.config(["$httpProvider", function($httpProvider) {
			$httpProvider.defaults.withCredentials = true;
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}]);
	}
)