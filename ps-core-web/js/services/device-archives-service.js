//======================================   设备档案信息   ===========================================
define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('deviceArchivesService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'deviceArchivesService',
        factory = {};

        //添加设备档案
        factory.addDeviceArchives = function (param, callback) {
            serviceProxy.get(service, 'addDeviceArchives', param, callback);
        };

        //获取设备档案
        factory.getDeviceArchivesByCondition = function (deviceId, callback) {
            serviceProxy.get(service, 'getDeviceArchivesByCondition', deviceId, callback);
        };

      return factory;
    }
  ]);
});
