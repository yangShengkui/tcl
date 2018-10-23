define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.initController('ConfigureChartsCtrl', ['$scope', '$rootScope', '$timeout', 'kpiDataService', 'SwSocket', 'Info', 'resourceUIService', 'viewFlexService', '$q','$controller', 'freeboardservice',
    function($scope, rootScope, $timeout, kpiDataService, SwSocket, Info, resourceUIService, viewFlexService, q,$controller, freeboardservice) {
      console.info("ConfigureChartsCtrl被触发");
      //console.log($scope);

      if($scope.$parent.view && $scope.$parent.view.echartViewId) {
        var viewIdAry = $scope.$parent.view.echartViewId.split(":");
        if(viewIdAry.length == 2) {
          var nodeIdsAry = [];
          if(jQuery.isArray($scope.$parent.view.nodeIds)) {
            $scope.$parent.view.nodeIds.forEach(function(item) {
              if (typeof(item) != "number") {
                var ary = item.split(":");
                nodeIdsAry.push(Number(ary[ary.length - 1]));
              } else {
                nodeIdsAry.push(item);
              }
            });
          }
          viewFlexService.getViewById(viewIdAry[viewIdAry.length - 1], function(returnObj) {
            if(returnObj.code == 0) {
              var content;
              if(returnObj.data.content)
                content = JSON.parse(returnObj.data.content);
              if(nodeIdsAry.length > 0) {
                for(var i in content.elements) {
                  content.elements[i].nodes = nodeIdsAry;
                }
              }
              if(content.elements){
                $scope.echartItem = content.elements[0];
              } else {
                $scope.$parent.$parent.instance = {};
                console.log($scope.$parent.view.size);
                var size = $scope.$parent.view.size;
                $("#free-board").css("width", size.width);
                $("#free-board").css("left", size.x);
                $("#free-board").css("top", size.y);
                var editData = new freeboardservice.replaceCiKpi(content, function(){
                  $timeout(function(){
                    console.log($scope.$parent.$parent.instance);
                    $scope.$parent.$parent.instance.setMode(true);
                    $scope.$parent.$parent.instance.renderLayout(editData);
                  });
                });
              };
              $controller('ViewChartsCtrl',{$scope: $scope ,$timeout:$timeout, kpiDataService:kpiDataService, SwSocket:SwSocket, Info:Info, resourceUIService:resourceUIService, $q:q});
            }
          })
        }
      }
    }
  ]);
});