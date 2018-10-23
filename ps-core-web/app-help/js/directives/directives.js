define(['angular'], function(angular) {
	'use strict';
	var directives = angular.module('directives', []);
	directives.initDirective = directives.directive;
	return directives;
});