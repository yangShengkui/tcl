define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('maintenanceUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'maintenanceUIService',
        factory = {};
      //添加工组
      factory.addTeam = function(param, callback) {
        serviceProxy.get(service, 'addTeam', param, callback);
      };

      //修改更正工组信息
      factory.updateTeam = function(param, callback) {
        serviceProxy.get(service, 'updateTeam', param, callback);
      };
      //修改更正工组信息
      factory.getInspectionItemsByCondition = function(param, callback) {
        serviceProxy.get(service, 'getInspectionItemsByCondition', param, callback);
      };
      //根据设备查维保
      factory.getInspectionItemsByDeviceId = function(deviceId, callback) {
        serviceProxy.get(service, 'getInspectionItemsByDeviceId', deviceId, callback);
      };

      //删除工组
      factory.deleteTeamById = function(id, callback) {
        serviceProxy.get(service, 'deleteTeamById', id, callback);
      };

      //获取所有工组信息
      factory.getAllTeams = function(callback) {
        serviceProxy.get(service, 'getAllTeams', '', callback);
      };

      //新增关联工组与人员关系
      factory.addUserToTeam = function(param, callback) {
        serviceProxy.get(service, 'addUserToTeam', param, callback);
      };

      //解绑工组与人员关系
      factory.deleteUserToTeamByUserIdAndTeamId = function(param, callback) {
        serviceProxy.get(service, 'deleteUserToTeamByUserIdAndTeamId', param, callback);
      };

      //根据班组Id获取对应用户信息
      factory.getUsersByTeamId = function(id, callback) {
        serviceProxy.get(service, 'getUsersByTeamId', id, callback);
      };

      //根据班组Id添加设备
      factory.addDevicesToTeam = function(param, callback) {
        serviceProxy.get(service, 'addDevicesToTeam', param, callback);
      };

      //根据班组Id获取对应设备
      factory.getDevicesByTeamId = function(id, callback) {
        serviceProxy.get(service, 'getDevicesByTeamId', id, callback);
      };

      //删除关联设备
      factory.deleteDeviceToTeamByDeviceIdAndTeamId = function(param, callback) {
        serviceProxy.get(service, 'deleteDeviceToTeamByDeviceIdAndTeamId', param, callback);
      };


      //根据条件筛选巡检记录
      factory.getInspectionRecordsByCondition = function(param, callback) {
        serviceProxy.get(service, 'getInspectionRecordsByCondition', param, callback);
      };

      //添加巡检标准信息
      factory.addInspectionItem = function(param, callback) {
        serviceProxy.get(service, 'addInspectionItem', param, callback);
      }

      //修改巡检标准信息
      factory.updateInspectionItem = function(param, callback) {
        serviceProxy.get(service, 'updateInspectionItem', param, callback);
      }

      //根据id获取巡检标准
      factory.getInspectionItemById = function(id, callback) {
        serviceProxy.get(service, 'getInspectionItemById', id, callback);
      };

      //根据id删除巡检标准
      factory.deleteInspectionItemById = function(id, callback) {
        serviceProxy.get(service, 'deleteInspectionItemById', id, callback);
      };

      //获取所有巡检标准
      factory.getAllInspectionItems = function(callback) {
        serviceProxy.get(service, 'getAllInspectionItems', '', callback);
      };

      return factory;
    }
  ]);

});
