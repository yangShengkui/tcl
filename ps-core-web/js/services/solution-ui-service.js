define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('solutionUIService', ['serviceProxy',
    function(serviceProxy) {

      var service = {};
      var resourceUIName = "solutionUIService";
  
      /**
       * 查询解决方案
       * @param {Object} callback
       */
      service.getSolutions = function(callback) {
        serviceProxy.get(resourceUIName, 'getSolutions',[], callback);
      };
      
      /**
       * 解决方案的接口
       * @param {Object} callback
       */
      service.getSolutionsByStatus = function(status,callback) {
        serviceProxy.get(resourceUIName, 'getSolutionsByStatus',[status], callback);
      };
      
      /**
       * 保存解决方案
       * @param {Object} solution
       * @param {Object} callback
       */
      service.saveSolution = function(solution, callback) {
        serviceProxy.get(resourceUIName, 'saveSolution',solution, callback);
      };
      
      /**
       *  删除解决方案
       * @param {Long} solutionid
       * @param {Object} callback
       */
      service.deleteSolution = function(solutionid, callback) {
        serviceProxy.get(resourceUIName, 'deleteSolution',solutionid, callback);
      };
      
      /**
       * 通过解决方案获取设备组模型
       * @param {Object} solutionid
       * @param {Object} callback
       */
      service.getGroupModelsBySolutionId = function(solutionid, callback) {
        serviceProxy.get(resourceUIName, 'getGroupModelsBySolutionId',solutionid, callback);
      };
      
      /**
       * 通过解决方案获取设备模型
       * @param {Object} solutionid
       * @param {Object} callback
       */
      service.getDeviceModelsBySolutionId = function(solutionid, callback) {
        serviceProxy.get(resourceUIName, 'getDeviceModelsBySolutionId',solutionid, callback);
      };
      
      /**
       * 增加设备组模型
       * @param {Object} groupModel
       * @param {Object} callback
       */
      service.saveGroupModel = function(solutionId,groupModel, callback) {
        var newObject = jQuery.extend({}, groupModel);
        newObject.kpis = null;
        newObject.alerts = null;
        newObject.directives = null;
        newObject.attrs = null;
        serviceProxy.get(resourceUIName, 'saveGroupModel',[solutionId,newObject], callback);
      };
      
      /**
       * 通过设备组获取设备模型
       * @param {Object} groupModelId
       * @param {Object} callback
       */
      service.getModelsByGroupId = function(solutionId,groupModelId, callback) {
        serviceProxy.get(resourceUIName, 'getModelsByGroupId',[solutionId,groupModelId], callback);
      };
      
      /**
       * 关联模型和解决方案
       * @param {Object} modelId
       * @param {Object} solutionId
       * @param {Object} callback
       */
      service.linkModelToSolution = function(solutionId,modelId,callback) {
        serviceProxy.get(resourceUIName, 'linkModelToSolution',[solutionId,modelId], callback);
      };
      
      /**
       * 删除关联
       * @param {Object} solutionId
       * @param {Object} modelId
       * @param {Object} callback
       */
      service.deleteModelFromSolution = function(solutionId,modelId,callback) {
        serviceProxy.get(resourceUIName, 'deleteModelFromSolution',[solutionId,modelId], callback);
      };
      
      /**
       * 关联模型和设备组
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} callback
       */
      service.linkModelToGroupModel = function(solutionId,groupId, modelId,callback) {
        serviceProxy.get(resourceUIName, 'linkModelToGroupModel',[solutionId,groupId,modelId], callback);
      };
      
      /**
       * 删除关联
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} callback
       */
      service.deleteModelFromGroupModel = function(solutionId,groupId, modelId,callback) {
        serviceProxy.get(resourceUIName, 'deleteModelFromGroupModel',[solutionId,groupId,modelId], callback);
      };
      
      /**
       * 通过解决方案和模型获取阈值定义
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} callback
       */
      service.getThresholdsBySolution = function(solutionId, groupId,modelId,callback) {
        serviceProxy.get(resourceUIName, 'getThresholdsBySolution',[solutionId,groupId,modelId], callback);
      };
      
      /**
       * 保存阈值
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} alertInfo
       * @param {Object} callback
       */
      service.saveThresholdBySolution = function(solutionId, groupId,modelId,alertInfo,callback) {
        serviceProxy.get(resourceUIName, 'saveThresholdBySolution',[solutionId,groupId,modelId,alertInfo], callback);
      };
      
      /**
       * 删除阈值
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} alertId
       * @param {Object} callback
       */
      service.deleteThresholdBySolution = function(solutionId, groupId,modelId,alertId,callback) {
        serviceProxy.get(resourceUIName, 'deleteThresholdBySolution',[solutionId,groupId,modelId,alertId], callback);
      };
      
			/**
			 * 通过解决方案和设备组保存DASHBOARD视图
			 * @param {Object} solutionId
			 * @param {Object} groupId
			 * @param {Object} modelId
			 * @param function(){} callback
			 */
			service.saveModelDashboardViewContent = function(solutionId,gourpId,modelId,content,callback) {
				serviceProxy.get(resourceUIName, 'saveModelDashboardViewContent',[solutionId,gourpId,modelId,content], callback);
			};

			/**
			 * 保存运营dashboard
			 * @param {Object} solutionId
			 * @param {Object} callback
			 */
			service.saveManageDashboard = function(solutionId, content, callback) {
				serviceProxy.get(resourceUIName, 'saveManageDashboard',[solutionId, content], callback);
			};

			/**
			 * 获取运营dashboard
			 * @param {Object} solutionId
			 * @param {Object} callback
			 */
			service.getManageDashboard = function(solutionId,callback) {
        serviceProxy.get(resourceUIName, 'getManageDashboard',[solutionId], callback);
      };

			/**
			 * 通过解决方案和设备组保存服务中心视图
			 * @param {Object} solutionId
			 * @param {Object} groupId
			 * @param function(){} callback
			 */

			service.saveServiceViewContent = function(solutionId, groupId, modelId, content, callback) {
				serviceProxy.get(resourceUIName, 'saveServiceViewContent',[solutionId,groupId,modelId,content], callback);
			};
			/*
			service.saveServiceViewContent = function(solutionId, groupId, content, callback) {
				serviceProxy.get(resourceUIName, 'saveServiceViewContent',[solutionId, groupId, content], callback);
			};
			 */
			/**
			 * 通过解决方案和设备组保存服务中心视图
			 * @param {Object} solutionId
			 * @param {Object} groupId
			 * @param function(){} callback
			 */

			service.getServiceViewContent = function(solutionId, groupId,modelId, callback) {
				serviceProxy.get(resourceUIName, 'getServiceViewContent',[solutionId,groupId,modelId], callback);
			};
			/*
			service.getServiceViewContent = function(solutionId, groupId, callback) {
				serviceProxy.get(resourceUIName, 'getServiceViewContent',[solutionId,groupId], callback);
			};
			 */
			/**
			 * 通过解决方案保存DASHBOARD视图
			 * @param {Object} solutionId
			 * @param String viewcontent
			 * @param function(){} callback
			 */

			service.saveManageViewContent = function(solutionId, viewcontent, callback) {
				serviceProxy.get(resourceUIName, 'saveManageViewContent',[solutionId,viewcontent], callback);
			};

			/**
			 * 通过解决方案获取DASHBOARD视图
			 * @param {Object} solutionId
			 * @param function(){} callback
			 */

			service.getManageViewContent = function(solutionId, callback) {
				serviceProxy.get(resourceUIName, 'getManageViewContent',[solutionId], callback);
			};
      
      /**
       * 通过解决方案和模型获取kqi计算
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} callback
       */

      service.getKqiCalcRulesBySolution = function(solutionId, groupId, modelId, callback) {
        serviceProxy.get(resourceUIName, 'getKqiCalcRulesBySolution',[solutionId,groupId,modelId], callback);
      };
      
      /**
       * 保存KQI规则
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} content
       * @param {Object} callback
       */
      service.saveKqiCalcRuleBySolution = function(solutionId, groupId, modelId,content, callback) {
        serviceProxy.get(resourceUIName, 'saveKqiCalcRuleBySolution',[solutionId,groupId,modelId,content], callback);
      };
      
      /**
       * 获取性能分析视图
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} callback
       */

      service.getModelDashboardViewContent = function(solutionId, groupId, modelId, callback) {
        serviceProxy.get(resourceUIName, 'getModelDashboardViewContent',[solutionId,groupId,modelId], callback);
      };
      
      /**
       * 保存性能分析视图
       * @param {Object} solutionId
       * @param {Object} groupId
       * @param {Object} modelId
       * @param {Object} callback
       */
      service.saveModelDashboardViewContent = function(solutionId, groupId, modelId,content, callback) {
        serviceProxy.get(resourceUIName, 'saveModelDashboardViewContent',[solutionId,groupId,modelId,content], callback);
      };
      
      /**
       * 购买解决方案
       * @param {Object} solutionId
       * @param {Object} callback
       */
      service.buySolution = function(solutionId, callback) {
        serviceProxy.get(resourceUIName, 'buySolution',[solutionId], callback);
      };
      
      service.getGroupModels = function(callback) {
        serviceProxy.get(resourceUIName, 'getGroupModels',[], callback);
      };
      
      return service;
    }
  ]);
});