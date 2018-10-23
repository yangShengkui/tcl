define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('viewFlexService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'viewFlexService',
        factory = {};

      /*
       *获取第三方的所有视图
       */
      factory.getThirdPartyViews = function(callback) {
        serviceProxy.get(service, 'getThirdPartyViews', [], callback);
      };

      /*
       *获取当前我的所有视图
       */
      factory.getAllMyViews = function(callback) {
        serviceProxy.get(service, 'getAllMyViews', null, callback);
      };

      /*
       *通过ID获取自定义视图
       */
      factory.getMyViewEntry = function(viewId, callback) {
        serviceProxy.get(service, 'getMyViewEntry', viewId, callback);
      };

      /*
       *通过ID获取视图
       */
      factory.getViewById = function(viewId, callback) {
        serviceProxy.get(service, 'getViewById', viewId, callback);
      };

      /*
       *获取视图发布时同时需要发布的模型
       */
      factory.getPublishModelByView = function(viewInfo, callback) {
        serviceProxy.get(service, 'getPublishModelByView', viewInfo, callback);
      };

      /*
       *发布视图
       */
      factory.publishView = function(viewInfo, callback) {
        serviceProxy.get(service, 'publishView', viewInfo, callback);
      };

      factory.getManageDashboard = function(callback) {
        serviceProxy.get(service, 'getManageDashboard', [], callback);
      };

      factory.saveManageDashboard = function(viewInfo, callback) {
        serviceProxy.get(service, 'saveManageDashboard', viewInfo, callback);
      };

      factory.getModelDashboard = function(modelId, callback) {
        serviceProxy.get(service, 'getModelDashboard', [modelId], callback);
      };

			factory.getServiceViewByModelId = function(modelId, callback) {
				serviceProxy.get(service, 'getServiceViewByModelId', [modelId], callback);
			};

      /*
       *视图购买
       */
      factory.buyView = function(viewInfo, callback) {
        serviceProxy.get(service, 'buyView', viewInfo, callback);
      };

      /*
       *更新视图
       */
      factory.updateView = function(viewInfo, callback) {
        serviceProxy.get(service, 'updateView', viewInfo, callback);
      };

			/*
			 *获取当前服务视图
			 */
			factory.getServiceViewMap = function(callback){
				serviceProxy.get(service, 'getServiceViewMap', [], callback);
			};

      /*
       *删除视图
       */
      factory.deleteView = function(id, callback) {
        serviceProxy.get(service, 'deleteView', id, callback);
      };
      factory.deleteViews = function(ids, callback) {
        serviceProxy.get(service, 'deleteViews', [ids], callback);
      };
      factory.getDefaultView = function(modelId, callback) {
        var modelId = parseInt(modelId);
        serviceProxy.get(service, 'getDefaultView', [modelId], callback);
      };
      /**
       * 添加视图
       */
      factory.addView = function(viewInfo, callback) {
        serviceProxy.get(service, 'addView', viewInfo, callback);
      };

      factory.releaseViews = function(viewIds, callback){
        serviceProxy.get(service, 'releaseViews', [viewIds], callback);
      }
      factory.releaseView = function(viewIds, callback){
        serviceProxy.get(service, 'releaseView', [viewIds], callback);
      }

      factory.getManagedViewsByType = function(viewType, domainPath, callback){
        serviceProxy.get(service, 'getManagedViewsByType', [domainPath, viewType], callback);
      };

      factory.getViewsByOnlyRole = function(viewType, callback){
        serviceProxy.get(service, 'getViewsByOnlyRole', [viewType], callback);
      };

      factory.getManagedViewsByTypeAndRole = function(viewType, callback){
        var code = 0;
        if(viewType == "dashboard"){
          code = 21;
        }  else if(viewType == "configAlert"){
          code = 23;
        } else if(viewType == "designView"){
          code = 24;
        } else if(viewType == "configure"){
          code = 25;
        }
        serviceProxy.get(service, 'getManagedViewsByTypeAndRole', [code], callback);
      };
      factory.getViewsOnlyPublishedByTypeAndDomainPath = function(viewType, domainPath, callback){
        serviceProxy.get(service, 'getViewsOnlyPublishedByTypeAndDomainPath', [domainPath, viewType], callback);
      };

      return factory;
    }
  ]);
});