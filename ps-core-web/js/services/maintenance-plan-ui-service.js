define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('maintenancePlanService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'maintenancePlanService',
        factory = {};


      //==========================   保养计划   ===============================================


      //获取所有保养计划列表
      factory.getAllMaintenancePlanList = function(callback) {
          serviceProxy.get(service, 'getAllMaintenancePlanList', '', callback);
      };


      //添加保养计划列表
      factory.addMaintenancePlan = function(param, callback) {
          serviceProxy.get(service, 'addMaintenancePlan', param, callback);
      };

      //删除保养计划列表
      factory.detelMaintenancePlan = function(id, callback) {
          serviceProxy.get(service, 'detelMaintenancePlan', id, callback);
      };

      //更新保养计划列表
      factory.updateMaintenancePlan = function(param, callback) {
          serviceProxy.get(service, 'updateMaintenancePlan', param, callback);
      };


      //批量停用保养计划列表
      factory.unEnablePlan = function(param, callback) {
          serviceProxy.get(service, 'unEnablePlan', param, callback);
      };


      //批量启用保养计划列表
      factory.enablePlan = function(param, callback) {
          serviceProxy.get(service, 'enablePlan', param, callback);
      };

      //模糊查询保养计划列表
      factory.getAllMaintenancePlanListByCondition = function(param,callback) {
          serviceProxy.get(service,'getAllMaintenancePlanListByCondition',param,callback);
      };







      //保存出库单
      factory.saveOutStockOrder = function(param, callback) {
        serviceProxy.get(service, 'saveOutStockOrder', param, callback);
      };


      //根据库单id获取条目
      factory.getStockOrderItemsById = function(id, callback) {
        serviceProxy.get(service, 'getStockOrderItemsByStockOrderId', id, callback);
      };


      return factory;
    }
  ]);
});
