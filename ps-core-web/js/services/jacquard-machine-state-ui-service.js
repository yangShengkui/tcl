//======================================   提花机报表   ===========================================
define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('jacquardMachineStateUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'jacquardMachineStateUIService',
        factory = {};

      // 根据客户编号查询当天的生产情况(可使用的客户编号有：12345，abcde)
      factory.getCurrentDateStateByCustomerId = function(id, callback) {
        serviceProxy.get(service, 'getCurrentDateStateByCustomerId', id, callback);
      };

      //根据花样名称查询当天的生产情况(可使用的花样名称有：7nmcid，6nmcid)
      factory.getCurrentDateStateByfigureName = function(id, callback) {
        serviceProxy.get(service, 'getCurrentDateStateByfigureName', id, callback);
      };

      //查询各提花机的开机时长（包含：当日开机时长，本周开机时长，本月开机时长，本月开机率）及汇总信息
      factory.getRunTimeStat = function(callback) {
        serviceProxy.get(service, 'getRunTimeStat', '', callback);
      };

      //查询各提花机的当天产量信息及汇总
      factory.getCurrentDateState = function(callback) {
        serviceProxy.get(service, 'getCurrentDateState', '', callback);
      };
      return factory;
    }
  ]);

});
