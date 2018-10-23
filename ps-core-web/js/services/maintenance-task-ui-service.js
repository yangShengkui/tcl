define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('maintenanceTaskUIService', ['serviceProxy',
    function(serviceProxy) {
      var placeServiceName = 'maintenanceTaskUIService',
        recordServiceName = 'maintenanceRecordService',
        service = {};
      /**
       * 获取维保任务
       */
      service.getTaskByCondition = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "getTaskByCondition", [obj], callBack);
      };
      /**
       * 获取维保记录
       */
      service.getRecordByCondition = function(obj,callBack) {
        serviceProxy.get(recordServiceName, "getRecordByCondition", [obj], callBack);
      };
      /**
       * 保存维保记录备注
       */
      service.saveMaintenanceRecord = function(obj,callBack) {
        serviceProxy.get(recordServiceName, "saveMaintenanceRecord", [obj], callBack);
      };
      /**
       * 新增维保任务
       */
      service.addMaintenanceTask = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "addMaintenanceTask", obj, callBack);
      };
      /**
       * 更新维保计划
       */
      service.updateMaintenanceTask = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "updateMaintenanceTask", obj, callBack);
      };
      /**
       * 删除维保计划
       */
      service.deleteMaintenanceTask = function(id,callBack) {
        serviceProxy.get(placeServiceName, "deleteMaintenanceTask", id, callBack);
      };
      /**
       * 删除维保计划
       */
      service.deleteTask = function(id,callBack) {
        serviceProxy.get(placeServiceName, "deleteTask", id, callBack);
      };
      /**
       * 批量停用启用
       */
      service.modifyStatus = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "modifyStatus", obj, callBack);
      };
      
      service.getTaskBySimpleConditionAndPage = function(condition,pageRequest,callBack) {
        serviceProxy.get(placeServiceName, "getTaskBySimpleConditionAndPage", [condition,pageRequest], callBack);
      };
      /**
       * 查询标准
       * @param {Object} obj
       * @param {Object} callBack
       */
      service.getTaskByCondition = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "getTaskByCondition", obj, callBack);
      };
      
      /**
       * 保存点检标准
       * @param {Object} obj
       * @param {Object} callBack
       */
      service.addPointCheckStanard = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "addPointCheckStanard", obj, callBack);
      };
      
      /**
       * 删除点检标准。删除精密检测计划
       * @param {Object} obj
       * @param {Object} callBack
       */
      service.deleteTask = function(id,callBack) {
        serviceProxy.get(placeServiceName, "deleteTask", [id], callBack);
      };
      
      /**
       * 保存检修标准
       * @param {Object} obj
       * @param {Object} callBack
       */
      service.addMaintainStandardTask = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "addMaintainStandardTask", obj, callBack);
      };
      
      /**
       * 删除检修标准
       * @param {Object} id
       * @param {Object} callBack
       */
      service.deleteMaintainStandardTask = function(id,callBack) {
        serviceProxy.get(placeServiceName, "deleteMaintainStandardTask", [id], callBack);
      };
      
      /**
       * 保存精密检测计划
       * @param {Object} obj
       * @param {Object} callBack
       */
      service.addOfflineStandard = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "addOfflineStandard", obj, callBack);
      };
      
      service.addPreparedMaintainTrust = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "addPreparedMaintainTrust", obj, callBack);
      };
      return service;
    }
  ]);
});