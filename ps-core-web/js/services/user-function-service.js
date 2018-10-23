define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('userFunctionService', ['serviceProxy',
    function(serviceProxy) {
      var functionService = 'userFunctionService',
        factory = {};

      /*
       *  将一个功能添加给一个角色
       * roleId  角色id
       * List<functionCode>  功能编码
       */
      factory.addFunction2Role = function(roleId, functinList, callback) {
        serviceProxy.get(functionService, 'addFunction2Role', [roleId, functinList], callback);
      };
      
      /*
       *  给一个功能添加一个方法
       * functionCode  用户编码
       * methodName  方法名
       */
      factory.addMethod2Function = function(functionCode, methodName, callback) {
        serviceProxy.get(functionService, 'addMethod2Function', [functionCode, methodName], callback);
      };
      
      /*
       * 删除角色的一个功能
       * roleID  角色id
       * functionCode  用户编码
       */
      factory.deleteFunction2Role = function(roleId, functinList, callback) {
        serviceProxy.get(functionService, 'deleteFunction2Role', [roleId, functinList], callback);
      };
      
      /*
       * 修改功能的各项信息
       * list  集合
       */
      factory.modifyFunction = function(updateFunction, callback) {
        serviceProxy.get(functionService, 'modifyFunction', updateFunction, callback);
      };

      /*
       * 查询一个角色的所有功能     
       * roleID  角色id
       */
      factory.queryFunction2Role = function(roleID, callback) {
        serviceProxy.get(functionService, 'queryFunction2Role', roleID, callback);
      };
      /*
       *直接查询所有功能信息
       * 
       */
      factory.queryAllFunction = function(callback) {
        serviceProxy.get(functionService, 'queryAllFunction', [], callback);
      };
      /*
       *功能编码父节点查询子节点
       * functionCode 功能码
       */
      factory.queryFunctionByParentCode = function(functionCode, callback) {
        serviceProxy.get(functionService, 'queryFunctionByParentCode', functionCode, callback);
      };
      /*
       *用户下所有功能信息
       * userID  用户Id
       */
      factory.queryAllFunctionByUser = function(userID, roleID, callback) {
        serviceProxy.get(functionService, 'queryAllFunctionByUser', [userID, roleID], callback);
      };

      return factory;
    }
  ]);
});