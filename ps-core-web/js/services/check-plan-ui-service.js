define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('checkingPlanService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'checkingPlanService',
        factory = {};


      //==========================   点检计划   ===============================================


      //获取所有点检计划列表addCheckingPlan
      factory.getAllCheckingList = function(callback) {
          serviceProxy.get(service, 'getAllCheckingList', '', callback);
      };


      //添加点检计划列表
      factory.addCheckingPlan = function(param, callback) {
          serviceProxy.get(service, 'addCheckingPlan', param, callback);
      };

      //删除点检计划列表
      factory.detelCheckingPlan = function(id, callback) {
          serviceProxy.get(service, 'detelCheckingPlan', id, callback);
      };

      //更新点检计划列表
      factory.updateCheckingPlan = function(param, callback) {
          serviceProxy.get(service, 'updateCheckingPlan', param, callback);
      };


      //批量停用点检计划列表
      factory.unEnablePlan = function(param, callback) {
          serviceProxy.get(service, 'unEnablePlan', param, callback);
      };


      //批量启用点检计划列表
      factory.enablePlan = function(param, callback) {
          serviceProxy.get(service, 'enablePlan', param, callback);
      };

      //模糊查询点检计划列表
      factory.getAllCheckingListByCondition = function(param,callback) {
          serviceProxy.get(service,'getAllCheckingListByCondition',param,callback);
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
