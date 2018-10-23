define(['controllers/controllers', 'Array'], function(controllers) {
	'use strict';
	controllers.registerController('viewPreviewCtrl', viewPreviewCtrl);
  viewPreviewCtrl.$inject = ["$scope", "$rootScope", "viewFlexService", "$timeout", "$window", "Info", "freeboardservice",'growl', '$routeParams','freeboardBaseService'];
	function viewPreviewCtrl(scope, rootScope, viewFlexService, timeout, window, Info, freeboardservice,growl,routeParams, freeboardBaseService){
    var viewId = routeParams.viewId;
    viewFlexService.getViewById(viewId, function(event){
      scope.instance = {};
      if(event.code == "0"){
        var content = event.data.content, dt;
        if(content != null){
          var clone = JSON.parse(content);
          var input = {
            layout : clone.data ? clone.data : clone.layout,
            setting : clone.setting
          }
          delete clone.data;
          var editData = new freeboardservice.replaceCiKpi(input, function(){
            timeout(function(){
              scope.instance.setMode(true);
              scope.instance.renderLayout(editData);
            });
          });
        }
      }
    })
	}
});