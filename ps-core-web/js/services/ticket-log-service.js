define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('ticketLogService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "ticketLogService";

      /**
       * 查询工单日志
       * @param 工单id
       */
      service.getByTicketNo = function(id,callback) {
        serviceProxy.get(base, "getByTicketNo", id, callback);
      };
      /**
       * 查询工单流程节点的执行状态
       * @param 工单id
       */
      service.getHistoricActivityInstance = function(id,callback) {
        serviceProxy.get(base, "getHistoricActivityInstance", id, callback);
      };
      return service;
    }
  ]);
});