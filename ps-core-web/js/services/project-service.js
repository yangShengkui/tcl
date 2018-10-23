define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('projectUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'projectUIService',
        factory = {};

      //==========================   项目管理   ===============================================  
      //新加项目
      factory.addProject = function(param, callback) {
        serviceProxy.get(service, 'addProject', param, callback);
      };

      //添加项目文档
      factory.uploadProjectFile = function(projectId,callback) {
          serviceProxy.get(service, 'uploadProjectFile', projectId, callback);
      };

      //查询项目文档列表
      factory.getUploadProjectFileList = function(param, callback) {
          serviceProxy.get(service, 'getUploadProjectFileList', param, callback);
      };

     //删除项目文档
     factory.deleteProjectFile = function(param, callback) {
         serviceProxy.get(service, 'deleteProjectFile', param, callback);
     };

      //更新项目
      factory.updateProject = function(param, callback) {
        serviceProxy.get(service, 'updateProject', param, callback);
      };

      //删除项目
      factory.deleteProjectById = function(id, callback) {
        serviceProxy.get(service, 'deleteProjectById', id, callback);
      };

      //查询项目信息
      factory.findProjectsByCondition = function(param, callback) {
        serviceProxy.get(service, 'findProjectsByCondition', param, callback);
      };

      //根据项目Id获取项目信息
      factory.findProjectById = function(id, callback) {
        serviceProxy.get(service, 'findProjectById', id, callback);
      };

      return factory;
    }
  ]);

});
