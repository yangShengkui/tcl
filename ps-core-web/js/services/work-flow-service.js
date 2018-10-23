define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('workflowService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'workflowService',
        factory = {};

      /*
       *  查询某个流程定义所有已发布的流程
       */
      factory.getWorkflowByWorkflowDefinitionId = function(workFlowId,callback) {
        serviceProxy.get(service, 'getWorkflowByWorkflowDefinitionId', workFlowId, callback);
      };
      /*
       *  查询某个流程定义所有已发布的流程
       */
      factory.getWorkflowById = function(workFlowId,callback) {
        serviceProxy.get(service, 'getWorkflowById', workFlowId, callback);
      };
      /*
       *  查询工作流管理
       */
      factory.getWorkflows = function(callback) {
        serviceProxy.get(service, 'getWorkflows', [], callback);
      };
      /*
       *  删除流程历史版本
       */
      factory.deleteWorkflowById = function(workFlowId,callback) {
        serviceProxy.get(service, 'deleteWorkflowById', workFlowId, callback);
      };
      /*
       *  通过ID获取工作流管理
       */
      factory.getWorkflowById = function(id,callback) {
        serviceProxy.get(service, 'getWorkflowById', id, callback);
      };
      /*
       *  删除工作流管理
       */
      factory.deleteWorkflowById = function(id,callback) {
        serviceProxy.get(service, 'deleteWorkflowById',id, callback);
      };

      return factory;
    }
  ]);

});