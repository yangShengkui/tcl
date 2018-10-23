define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.controller('bridgeWarningCtrl', bridgeWarningCtrl);
  bridgeWarningCtrl.$inject = ["$scope", "$timeout", "$location"];
  function bridgeWarningCtrl(scope, timeout, location) {
    var rs = [];
    function setValue()
    {
      return {
        status : parseInt(Math.random() * 4),
        ciname : "ESB172.16.2.3:LOG_esb_processor_error.log",
        appname : "业务应用 6",
        level : parseInt(Math.random() * 4) + 1,
        message : "ESB172.16.2.3:LOG_esb_proc...",
        warningTime : "04-29 14:02:35",
        receiveTime : "04-29 14:02:35",
        num : 1,
        system : "oms",
        subWarning : null,
        handler : "",
        update : 0,
        workOrder : "",
        workOrderStatus : ""
      }
    }
    for(var i=0; i < 14; i++)
    {
      rs.push(setValue(i))
    }
    scope.warninglist = rs;
    scope.backBtnClick = function(){
      location.path("bridge");
    }
  }
});