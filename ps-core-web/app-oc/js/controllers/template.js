define(['controllers/controllers'], function (controllers) {
  'use strict';
  angular.module("controller").controller("testCtrl")
  controllers.initController('testCtrl', ['$scope',
    function (scope) {
      scope.a = 123;
    }
  ]);
});