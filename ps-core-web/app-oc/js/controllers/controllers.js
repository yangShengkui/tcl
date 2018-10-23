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
    controllers.registerController(controllerName, fun);
    if (attrs.length > 0)
      fun.$inject = attrs;
  }
  return controllers;
});