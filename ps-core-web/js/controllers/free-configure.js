define(['controllers/controllers', 'bootstrap-dialog',  'rappid-joint', 'Array'], function(controllers, BootstrapDialog, joint) {
  'use strict';
  controllers.controller('viewEmbedCtrl', ['$scope', '$routeParams', 'Info', '$rootScope', 'viewFlexService',
    'resourceUIService', 'kpiDataService', 'SwSocket', 'growl', '$location', '$timeout', '$window', "freeboardservice",'freeboardBaseService',
    function($scope, routeParams, Info, rootScope, viewFlexService, resourceUIService, kpiDataService, SwSocket,
             growl, loc, timeout, window, freeboardservice,freeboardBaseService) {
      $scope.dataView = {};
      $scope.initView = function(){
        viewFlexService.getViewById(72886717020000, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.dataView = returnObj;
            $scope.$broadcast("viewRapp", returnObj.data);
          }
        })
      }
      $scope.initView();
    }
  ]);
});