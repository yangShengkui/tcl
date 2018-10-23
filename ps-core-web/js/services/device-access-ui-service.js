define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('deviceAccessUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'deviceAccessUIService',
        factory = {};

      factory.getFlexemCloudConfAddr = function(externalDevId,url, callback) {
        serviceProxy.get(service, 'getFlexemCloudConfAddr', [externalDevId,url], callback);
      };
      return factory;
    }
  ]);
});
