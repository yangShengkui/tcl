define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('workflowDefinitionService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'workflowDefinitionService',
        factory = {};

      /*
       *  保存工作流定义
       */
      factory.saveWorkflowDefinition = function(WorkflowDefinition,callback) {
        serviceProxy.get(service, 'saveWorkflowDefinition', WorkflowDefinition, callback);
      };
      /*
       *  查询工作流定义
       */
      factory.getWorkflowDefinitions = function(callback) {
        serviceProxy.get(service, 'getWorkflowDefinitions', [], callback);
      };
      /*
       *  更新工作流定义
       */
      factory.updateWorkflowDefinition = function(workId,str,callback) {
        serviceProxy.get(service, 'updateWorkflowDefinition', [workId,str], callback);
      };
      /*
       *  通过ID获取工作流定义
       */
      factory.getWorkflowDefinitionById = function(workId,callback) {
        serviceProxy.get(service, 'getWorkflowDefinitionById', workId, callback);
      };
      /*
       *  删除工作流定义
       */
      factory.deleteWorkflowDefinitionById = function(workId,callback) {
        serviceProxy.get(service, 'deleteWorkflowDefinitionById', workId, callback);
      };
      /*
       *  发布工作流设计
       */
      factory.publishWorkflow = function(workId,callback) {
        serviceProxy.get(service, 'publishWorkflow', workId, callback);
      };
      /*
       * 复制工作流设计
       */
      factory.copyWorkflowDefinition = function(workflowDefinitionId,name,desc,callback) {
        serviceProxy.get(service, 'copyWorkflowDefinition', [workflowDefinitionId,name,desc], callback);
      };

      return factory;
    }
  ]);

});