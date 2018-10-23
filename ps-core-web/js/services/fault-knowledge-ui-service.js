//======================================   故障知识   ===========================================
define(['../services/services.js'], function (services) {
  'use strict';
  services.factory('faultKnowledgeUIService', ['serviceProxy',
    function (serviceProxy) {
      var service = 'faultKnowledgeUIService',
        factory = {};

      factory.getFaultKnowledgeByTicketNo = function (param, callback) {
        serviceProxy.get(service, 'getFaultKnowledgeByTicketNo', param, callback);
      };

      // 根据条件，查询故障知识
      factory.getFaultKnowledgesByCondition = function (param, callback) {
        serviceProxy.get(service, 'getFaultKnowledgesByCondition', param, callback);
      };

      //保存故障知识
      factory.saveFaultKnowledge = function (param, callback) {
        serviceProxy.get(service, 'saveFaultKnowledge', param, callback);
      };

      //删除故障知识
      factory.deleteFaultKnowledge = function (id, callback) {
        serviceProxy.get(service, 'deleteFaultKnowledge', id, callback);
      };

      //获取所有故障知识信息
      factory.getAllFaultKnowledges = function (callback) {
        serviceProxy.get(service, 'getAllFaultKnowledges', '', callback);
      };

      //根据故障编号查找故障信息
      factory.getByFaultNo = function (id, callback) {
        serviceProxy.get(service, 'getByFaultNo', id, callback);
      };

      /**
       * 根据工单编号，生成一条故障知识
       * @param ticketNo  工单号
       * @param callback  回调函数
       */
      factory.createFaultKnowledgeByTicketNo = function (ticketNo, callback) {
        serviceProxy.get(service, 'createFaultKnowledgeByTicketNo', ticketNo, callback);
      };

      return factory;
    }
  ]);

});
