define([
	'angular',
	'angular-route',
	'angular-resource',
	'angular-animate',
	'angular-growl',
	'ng-dialog',
	'./controllers/index',
	'./directives/index',
	'./filters/index',
	'./services/index',
	'./values/index',
	'ps-components'
], function(angular) {
	'use strict';
	return angular.module('app', [
		'controllers',
		'directives',
		'filters',
		'services',
		'values',
		'angular-growl',
		'ngDialog',
		'ngAnimate',
		'ngRoute',
		'psComponents'
	]);
});