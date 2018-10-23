define(
	[
		"angular",
		"angular-route",
		"angular-resource",
		"angular-animate",
		'angular-growl',
        'ps-components'
	],function(angular){
		'use strict';
		var services = angular.module('myapp', ['ngAnimate', 'ngResource', 'ngRoute', 'controllers', 'directives', 'services', 'filters', 'values', 'angular-growl', 'psComponents']);
		return services;
	}
)