define(
	[
		"angular",
		"angular-route",
		"angular-resource",
		"angular-animate",
    	'angular-file-upload',
		"angular-growl",
		"angular-style",
		"angular-popup",
		"angular-dialogue",
 		"ng-dialog",
        "ngPstree",
        'ps-components'
  ],
  function(angular) {
    'use strict';
    var services = angular.module('myapp', ['ngAnimate', 'ngResource', 'ngRoute', 'controllers', 'directives', 'services', 'filters', 'values', 'angular-growl', 'angularFileUpload', 'ngAngularStyle', 'ngAngularPopup', 'ngAngularDialogue', 'ngDialog', 'psComponents', 'ngPstree']);
    return services;
  }
)