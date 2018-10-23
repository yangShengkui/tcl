define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('directiveStrategyUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'directiveStrategyUIService',
        factory = {};

      //==========================   指令策略管理   ===============================================  
      //新加
      factory.addDirectiveStrategys = function(param, callback) {
        serviceProxy.get(service, 'addDirectiveStrategys', param, callback);
      };

      //删除
      factory.deleteDirectiveStrategy = function(id, callback) {
        serviceProxy.get(service, 'deleteDirectiveStrategy', id, callback);
      };

      //更新
      factory.updateDirectiveStrategys = function(param, callback) {
        serviceProxy.get(service, 'updateDirectiveStrategys', param, callback);
      };

      //查询
      factory.getDirectiveStrategys = function(callback) {
        serviceProxy.get(service, 'getDirectiveStrategys', [], callback);
      };

      //执行历史记录
      factory.getDirectiveStrategyHistory = function(param, callback) {
        serviceProxy.get(service, 'getDirectiveStrategyHistory', param, callback)
      };

      return factory;
    }
  ]);

});
