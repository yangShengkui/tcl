define(
	[
		"angular",
		"angular-route",
		"angular-resource",
		"angular-animate",
		"angular-growl",
		"angular-style",
		"angular-popup",
		"angular-file-upload",
		"angular-dialogue",
    	"ng-dialog",
    	'angular-file-upload',
        'ps-components'
	], function (angular) {
    'use strict';
    var services = angular.module('myapp', ['ngAnimate', 'ngResource', 'ngRoute', 'controllers', 'directives', 'services', 'filters', 'values', 'angular-growl', 'ngAngularStyle', 'ngAngularPopup',
      'angularFileUpload', 'ngAngularDialogue', 'ngDialog', 'psComponents']);
    return services;
  }
);