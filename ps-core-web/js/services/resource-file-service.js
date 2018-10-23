define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('resourceFileService', ['serviceProxy',
    function(serviceProxy) {

      var service = {
        code: 0,
        nodesDic: {},
        kpisDic: {},
        activeListTab:"" //存储当天tab页的信息
      };
      var resourceFileService = "resourceFileService";

      /**
       * 获得根的模型
       */
      service.uploadResourceFile = function(callBack) {
        serviceProxy.get(resourceFileService, "uploadResourceFile", [], callBack);
      };
      return service;
    }
  ]);
});
