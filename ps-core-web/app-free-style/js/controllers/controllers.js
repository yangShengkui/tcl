define(['angular'], function(angular) {
	'use strict';
	var controllers = angular.module('controllers', []);
	controllers.config([
		'$controllerProvider',
		function($controllerProvider) {
			controllers.registerController = $controllerProvider.register;
		}
	]);
	controllers.initController = function(controllerName, options) {
		var attrs = [];
		var fun = null;
		if(jQuery.isArray(options)) {
			attrs = options.slice(0, options.length - 1)
			fun = options[options.length - 1]
		} else {
			fun = options;
		}
		if(controllers.registerController)
		{
			/**适用于异步加载情况*/
			controllers.registerController(controllerName, fun);
			if (attrs.length > 0)
				fun.$inject = attrs;
		}
		else
		{
			/**适用于同步加载情况*/
			controllers.controller(controllerName, fun)
		}
	}
	return controllers;
});