define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('resourceFileUIService', ['serviceProxy',
    function(serviceProxy) {
      var factory = {};
      var service = "resourceFileUIService";
      /**
       * 上传文件
       */
      factory.uploadResourceFile = function(id, callBack) {
         serviceProxy.get(service, "uploadResourceFile", [id], callBack);
      };
      return factory;
    }
  ]);
});
