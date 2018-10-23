define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('dataMiningService', ['serviceProxy',
    function(serviceProxy) {
      'use strict';
      var service = {};
      var serviceName = "dataMiningService";
      
      /**
       * 获得设备大事件列表
       */
      service.getDeviceHistory = function(deviceId, callBack) {
        serviceProxy.get(serviceName, "getDeviceHistory", deviceId, callBack);
      };

      service.getFileUrl = function(deviceId, callBack) {
        serviceProxy.get(serviceName, "getDeviceHistory", deviceId, callBack);
      };

      return service;
    }
  ]);
});