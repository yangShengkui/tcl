define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('unitService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'unitService',
        factory = {};
        
      /*
       *  获取所有单位
       */
      factory.getAllUnits = function(callback) {
        serviceProxy.get(service, 'getAllUnits', null, callback);
      };

      return factory;
    }
  ]);

});