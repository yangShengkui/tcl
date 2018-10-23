define(
	[
		"angular",
		"angular-route",
		"angular-resource",
		"angular-animate",
		"angular-growl",
		"angular-style",
		"angular-popup",
	],function(angular){
		'use strict';
		var services = angular.module('myapp', ['ngAnimate', 'ngResource', 'ngRoute', 'controllers', 'directives', 'services', 'filters', 'values', 'angular-growl']);
		return services;
	}
)