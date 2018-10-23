define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('reportFlexService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'reportUIService',
        factory = {origin:serviceProxy.origin};

      /*
       *获取第三方的所有视图
       */
      factory.getThirdPartyViews = function(callback) {
        serviceProxy.get(service, 'getThirdPartyViews', [], callback);
      };
      
      factory.addReportTemplate = function(template, callback) {
        serviceProxy.get(service, 'addReportTemplate', template, callback);
      };
      factory.deleteReportTemplate = function(templateId, callback) {
        serviceProxy.get(service, 'deleteReportTemplate', [templateId], callback);
      };
      
      factory.getReportTemplateMeta = function(fileName, callback) {
        serviceProxy.get(service, 'getReportTemplateMeta', fileName, callback);
      };
      
      factory.updateReportTemplate = function(template, callback) {
        serviceProxy.get(service, 'updateReportTemplate', template, callback);
      };
      
      factory.getReportPdf = function(templateId,params,selectCoulums, callback) {
        serviceProxy.get(service, 'getReportPdf', [templateId,params,selectCoulums], callback);
      };
      
      factory.getReportHTML = function(templateId,params,selectCoulums, callback) {
        serviceProxy.get(service, 'getReportHTML', [templateId,params,selectCoulums], callback);
      };
      
      factory.getReportXls = function(templateId,params,selectCoulums, callback) {
        serviceProxy.get(service, 'getReportXls', [templateId,params,selectCoulums], callback);
      };
      
      factory.getReportPpt = function(templateId,params,selectCoulums, callback) {
        serviceProxy.get(service, 'getReportPpt', [templateId,params,selectCoulums], callback);
      };
      
      factory.getReportWord = function(templateId,params,selectCoulums, callback) {
        serviceProxy.get(service, 'getReportWord', [templateId,params,selectCoulums], callback);
      };
      /**
       * 报表模板
       * @param {Object} callback
       */
      factory.getReportTemplates = function(callback) {
        serviceProxy.get(service, 'getReportTemplates', null, callback);
      };
      
      factory.getParamShowList = function(callback) {
        serviceProxy.get(service, 'getParamShowList', null, callback);
      };
      factory.getSendPeriod = function(callback) {
        serviceProxy.get(service, 'getSendPeriod', null, callback);
      };
      factory.getReportBuildPolicyList = function(callback) {
        serviceProxy.get(service, 'getReportBuildPolicyList', null, callback);
      };
      factory.getReportBuildPolicyListAll = function(callback) {
        serviceProxy.get(service, 'getReportBuildPolicyListAll', null, callback);
      };
      factory.getReportBuildPolicyListByCondition = function(params,callback) {
        serviceProxy.get(service, 'getReportBuildPolicyListByCondition', params, callback);
      };
      factory.addReportBuildPolicy = function(params,callback) {
        serviceProxy.get(service, 'addReportBuildPolicy', params, callback);
      };
      factory.updateReportBuildPolicy = function(params,callback) {
        serviceProxy.get(service, 'updateReportBuildPolicy', params, callback);
      };
      factory.deleteReportBuildPolicy = function(policyId,callback) {
        serviceProxy.get(service, 'deleteReportBuildPolicy', [policyId], callback);
      };
      /**
       * 根据指定的查询条件查询到的报表模板
       * @param {Object} params
       * @param {Object} callback
       */
      factory.getReportTemplatesByCondition = function(params,callback) {
        serviceProxy.get(service, 'getReportTemplatesByCondition', params, callback);
      };
      return factory;
    }
  ]);
});