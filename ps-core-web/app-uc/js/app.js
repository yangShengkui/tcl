define([
	'angular',
	'angular-route',
	'angular-resource',
	'angular-animate',
	'angular-growl',
	'./controllers/index',
	'./directives/index',
	'./filters/index',
	'./services/index',
    'ps-components'
], function(angular) {
	'use strict';
	return angular.module('app', [
		'controllers',
		'directives',
		'filters',
		'services',
		'angular-growl',
		'ngAnimate',
		'ngRoute',
        'psComponents'
	]);
});