define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('userInitService', ['serviceProxy',
    function(serviceProxy) {
      var userServiceName = 'userRoleUIService',//后端userInitService已不存在由userRoleUIService替代
        service = {};

      /**
       * 删除用户
       * userId  邮箱验证码
       */
      service.deleteInitUser = function(userId, callBack) {
        serviceProxy.get(userServiceName, "deleteInitUser", userId, callBack);
      };
      
      /**
       * 删除用户组
       * groupID  用户组ID
       */
      service.deleteGroup = function(groupId, callBack) {
        serviceProxy.get(userServiceName, "deleteGroup", groupId, callBack);
      };

      /**
       *  增加角色关联视图
       *  userId 用户ID
       */
      service.addRoleRes = function(roleID, resType, resIds, callback){
        serviceProxy.get(userServiceName, 'addRoleRes', [roleID, resType, resIds], callback);
      };
      
      /**
       * 给用户的所在企业添加解决方案
       * @param {Object} user 不用
       * @param {Object} solutionId
       * @param {Object} callback
       */
      service.applySolution = function(user, solutionId, callback){
        serviceProxy.get("applySolutionUIService", 'applySolution', [solutionId], callback);
      };
      
      return service;
    }
  ]);
});