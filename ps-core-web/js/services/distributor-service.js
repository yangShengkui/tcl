//======================================   经销商信息   ===========================================
define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('distributorUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'distributorUIService',
        factory = {};

      //添加经销商信息
      factory.addDistributor = function(param, callback) {
        serviceProxy.get(service, 'addDistributor', param, callback);
      };

      //更新经销商信息
      factory.updateDistributor = function(param, callback) {
        serviceProxy.get(service, 'updateDistributor', param, callback);
      };

      //删除经销商信息
      factory.deleteDistributorById = function(id, callback) {
        serviceProxy.get(service, 'deleteDistributorById', id, callback);
      };

      //查找信息
      factory.findDistributorsByCondition = function(param, callback) {
        serviceProxy.get(service, 'findDistributorsByCondition', param, callback);
      };


      return factory;
    }
  ]);

});
