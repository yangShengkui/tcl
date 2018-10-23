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
    /** registerDirective is available only after angular.module("directive") finish initializing, when registerDirection method is loaded*/
    if(directives.registerDirective)
    {
      /** registerDirective mehod is avaliable  */
      directives.registerDirective(directiveName, fun);
    }
    else
    {
      /** registerDirective mehod is not avaliable and not in need, so use directive method to inject a function into angular.module('directive')  */
      directives.directive(directiveName, fun);
    }
    /** inject function that depended by the directive created.*/
    if (attrs.length > 0)
      fun.$inject = attrs;
  }
  return directives;
});