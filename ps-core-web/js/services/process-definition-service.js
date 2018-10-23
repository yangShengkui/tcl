define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('processService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "processDefinitionService";
      /**
       * 查询流程定义
       * @param callback
       */
      service.getProcessDefinitions = function(callback) {
        serviceProxy.get(base, "getProcessDefinitions", [], callback);
      };
      /**
       * 保存流程定义
       * @param processDefinition
       * @param callback
       */
      service.saveProcessDefinition = function(processDefinition, callback) {
        serviceProxy.get(base, "saveProcessDefinition", processDefinition, callback);
      };
      /**
       * 通过ID获取流程定义
       * @param id
       * @param callback
       */
      service.getProcessDefinitionById = function(id, callback) {
        serviceProxy.get(base, "getProcessDefinitionById", id, callback);
      };
      /**
       * 删除流程定义
       * @param id
       * @param callback
       */
      service.deleteProcessDefinitionById = function(id, callback) {
        serviceProxy.get(base, "deleteProcessDefinitionById", id, callback);
      };

      return service;
    }
  ]);
});