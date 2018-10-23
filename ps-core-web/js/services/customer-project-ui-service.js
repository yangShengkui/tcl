define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('customerProjectUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'customerProjectUIService',
        factory = {};

      //==========================   项目管理   ===============================================  
      //保存项目
      factory.saveProject = function(param, callback) {
        serviceProxy.get(service, 'saveProject', param, callback);
      };

      //删除项目
      factory.deleteProjectById = function(id, callback) {
        serviceProxy.get(service, 'deleteProjectById', id, callback);
      };

      //获取所有项目信息
      factory.getAllProjects = function(callback) {
        serviceProxy.get(service, 'getAllProjects', '', callback);
      };

      //根据项目Id获取关联的设备
      factory.getContractTermsToDevicesByProjectId = function(id, callback) {
        serviceProxy.get(service, 'getContractTermsToDevicesByProjectId', id, callback);
      };

      //根据项目Id获取合同信息
      factory.getContractTermsByProjectId = function(id, callback) {
        serviceProxy.get(service, 'getContractTermsByProjectId', id, callback);
      };

      //查询项目获取信息
      factory.findProjects = function(param, callback) {
        serviceProxy.get(service, 'findProjects', param, callback);
      };

      //根据项目Id获取项目信息
      factory.getProjectById = function(id, callback) {
        serviceProxy.get(service, 'getProjectById', id, callback);
      };


      //==========================    合同条款管理   ===================================          

      //保存合同条款
      factory.saveContractTerms = function(param, callback) {
        serviceProxy.get(service, 'saveContractTerms', param, callback);
      };

      //删除合同条款
      factory.deleteContractTerms = function(id, callback) {
        serviceProxy.get(service, 'deleteContractTerms', id, callback);
      };

      //获取所有合同条款
      factory.getAllContractTerms = function(callback) {
        serviceProxy.get(service, 'getAllContractTerms', '', callback);
      };

      //根据合同条款Id获取设备
      factory.getByContractTermsId = function(id, callback) {
        serviceProxy.get(service, 'getByContractTermsId', id, callback);
      };

      //保存设备与合同条款的关联
      factory.saveContractTermsToDevice = function(param, callback) {
        serviceProxy.get(service, 'saveContractTermsToDeviceList', param, callback);
      };

      //删除设备与合同条款的关联
      factory.deleteContractTermsToDevice = function(id, callback) {
        serviceProxy.get(service, 'deleteContractTermsToDevice', id, callback);
      };

      //查询合同条款获取信息
      factory.findContractTerms = function(param, callback) {
        serviceProxy.get(service, 'findContractTerms', param, callback);
      };

      return factory;
    }
  ]);

});
