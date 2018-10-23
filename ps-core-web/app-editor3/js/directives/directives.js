define(['angular'], function(angular) {
	'use strict';
	var directives = angular.module('directives', []);
	directives.config([
    '$compileProvider',
    function($compileProvider) {
      directives.registerDirective = $compileProvider.directive;
    }
  ]);
  directives.initDirective = function(directiveName, options) {
    var attrs = [];
    var fun = null;
    if(jQuery.isArray(options)) {
      attrs = options.slice(0, options.length - 1)
      fun = options[options.length - 1]
    } else {
      fun = options;
    }
    if(directives.registerDirective){
      directives.registerDirective(directiveName, fun);
    };
    if (attrs.length > 0)
      fun.$inject = attrs;
  }
  return directives;
});