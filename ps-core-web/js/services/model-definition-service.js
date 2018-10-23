define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('modelDefinitionService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'modelDefinitionService',
        factory = {};

      /*
       *  获取所有行业
       */
      factory.findAllIndustry = function(callback) {
        serviceProxy.get(service, 'findAllIndustry', [], callback);
      };
      return factory;
    }
  ]);
});