define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewTimeLineCtrl', ['$scope', '$routeParams', 'resourceUIService', 'alertService', 'SwSocket', 'Info', 'dataMiningService',
    function($scope, $routeParams, resourceUIService, alertService, SwSocket, Info, dataMiningService) {
      console.info("切换到大事件");
      $scope.videoUrl = "images/timeline/V51124-174029.mp4";
      var paramId = "";
      var historyData = [];
      paramId = $routeParams.ciid;
      //for (var i in resourceUIService.selectedInstances) {
      //  var page = resourceUIService.selectedInstances[i];
      //  if (page.id == $routeParams.ciid) {
      //    paramId = page.id;
      //    break;
      //  }
      //}
      if(paramId != "") {
        paramId = 232077572007405;
        dataMiningService.getDeviceHistory(paramId, function(result) {
          if(result.code == "0") {
            historyData = result.data;
            $scope.$broadcast("deviceHistoryInit", historyData);
          }
        });
      }
    }
  ]);
});