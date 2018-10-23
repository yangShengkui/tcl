define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('linebodyUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'productionLineUIService',
        factory = {};

      //==========================   项目管理   ===============================================  
      //新加项目
      factory.addLinebody = function(param, callback) {
        serviceProxy.get(service, 'add', param, callback);
      };
        //删除线体
        factory.deleteById = function(param, callback) {
            serviceProxy.get(service, 'deleteById', param, callback);
        };
        //查询线体信息
        factory.findLinebodyByCondition = function(param, callback) {
            serviceProxy.get(service, 'findByCondition', param, callback);
        };
        //更新线体信息
        factory.update = function(param, callback) {
            serviceProxy.get(service, 'update', param, callback);
        };
        //上传线体说明文件
        factory.uploadDescriptionFile = function(param, callback) {
            serviceProxy.get(service, 'uploadProductionLineDesc', param, callback);
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
