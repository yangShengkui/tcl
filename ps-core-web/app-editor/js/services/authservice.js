define(['app'], function(services) {
	'use strict';
	services.factory('authService', ['$http', '$rootScope', 'serviceProxy',
		function($http, $rootScope, serviceProxy) {
			var loginService = serviceProxy.version == 'V1' ? 'userFlexService' : 'userLoginUIService';
			var factory = {
				loginPath: '/login',
				user: {
					isAuthenticated: false,
					roles: null
				},
				viewLoadFinished: false,
				viewlist: []
			};
			factory.getCurrentUser = function(callback, error) {
				serviceProxy.get(loginService, 'getCurrentUser', null, function(result) {
					if(callback)
					{
						callback(result);
					}
					if (result != null && result != "") {
						factory.user = result;
						factory.user.isAuthenticated = true;
						changeAuth(true);
					} else {
						changeAuth(false);
					}
				}, error);
			};
			factory.login = function(account, password, callback, error) {
				serviceProxy.get(loginService, 'login', [account, password], function(result) {
					if (result != null) {
						factory.user = result;
						factory.user.isAuthenticated = true;
						changeAuth(true);
					}
					callback(result);
				}, error);
			};
			factory.logout = function(callback, error) {
				serviceProxy.get(loginService, 'logout', null, function(result) {
					factory.user = {};
					factory.user.isAuthenticated = false;
					changeAuth(false);
					callback(result);
				}, error);
				/*
				var deferred = $http.post(loginService + 'api/rest/post' + '/logout');
				return deferred.then(
					function(results) {
						var loggedIn = !results.data.status;
						changeAuth(loggedIn);
						callback(result);
						return loggedIn;
					});
				*/
			};
			factory.redirectToLogin = function() {
				$rootScope.$broadcast('redirectToLogin', null);
			};
			function changeAuth(loggedIn) {
				factory.user.isAuthenticated = loggedIn;
				$rootScope.$broadcast('loginStatusChanged', loggedIn);
			}
			//factory.getCurrentUser();
			return factory;
		}
	]);
});