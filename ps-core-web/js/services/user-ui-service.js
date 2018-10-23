define(['../services/services.js'], function (services) {
  'use strict';
  services.factory('userUIService', ['serviceProxy',
    function (serviceProxy) {
      var userServiceName = 'userUIService',
        service = {};

      /**
       * 查询用户基本信息
       */
      service.queryUser = function (userID, callBack) {
        serviceProxy.get(userServiceName, "queryUser", userID, callBack);
      };

      service.clearUserData = function (userID, callBack) {
        serviceProxy.get(userServiceName, "clearUserData", userID, callBack);
      };

      service.queryUserByCondition = function (userID, callBack) {
        serviceProxy.get(userServiceName, "queryUserByCondition", userID, callBack);
      };

      /**
       * 修改用户基本信息
       */
      service.modifyUser = function (userInfo, callBack) {
        serviceProxy.get(userServiceName, "modifyUser", userInfo, callBack);
      };
      /**
       * 检查手机号是否唯一
       */
      service.checkMobilePhone = function (phone, callBack) {
        serviceProxy.get(userServiceName, "checkMobilePhone", phone, callBack);
      };
      /**
       * 检查登录名是否唯一
       */
      service.checkLoginName = function (loginName, callBack) {
        serviceProxy.get(userServiceName, "checkLoginName", loginName, callBack);
      };

      /**
       * 删除用户
       */
      service.deleteUser = function (userID, callBack) {
        serviceProxy.get(userServiceName, "deleteUser", userID, callBack);
      };

      /**
       * 个人用户注册
       */
      service.individualUserRegister = function (userInfo, enterprise, callBack) {
        serviceProxy.get(userServiceName, "individualUserRegister", [enterprise, userInfo], callBack);
      };

      /**
       * 企业管理员注册
       */
      service.enterpriseManager = function (userInfo, enterprise, callBack) {
        serviceProxy.get(userServiceName, "enterpriseManagerRegister", [userInfo, enterprise], callBack);
      };

      /**
       * 企业普通注册
       */
      service.enterpriseUserRegister = function (userInfo, domians, roles, callBack) {
        serviceProxy.get(userServiceName, "enterpriseUserRegister", [userInfo, domians, roles], callBack);
      };

      /**
       * 重置密码
       */
      service.sendModifyPassword = function (mail, callBack) {
        serviceProxy.get(userServiceName, "sendModifyPassword", mail, callBack);
      };

      /**
       * 重置密码 手机号码
       */
      service.sendSMSPassword = function (mail, callBack) {
        serviceProxy.get(userServiceName, "sendSMSPassword", mail, callBack);
      };

      /**
       * 企业个人用户注册
       *User 个人用户
       *Enterprise  企业信息
       */
      service.enterpriseIndividualRegister = function (user, callBack) {
        serviceProxy.get(userServiceName, "enterpriseIndividualRegister", user, callBack);
      };

      /**
       *
       */
      service.querAllUserInfo = function (callBack) {
        serviceProxy.get(userServiceName, "querAllUserInfo", [], callBack);
      };

      /**
       * 启用用户
       */
      service.enableUsers = function (users, callBack) {
        serviceProxy.get(userServiceName, "enableUsers", [users], callBack);
      };
      /**
       * 停用用户
       */
      service.disableUsers = function (users, callBack) {
        serviceProxy.get(userServiceName, "disableUsers", [users], callBack);
      };

      //查询用户
      service.findUserByUserType = function (callback) {
        serviceProxy.get(userServiceName, 'findUserByUserType', [], callback);
      };

      //查询当前域下的设备
      service.queryUserDeviceByDeviceDomains = function (userId, domains, callback) {
        serviceProxy.get(userServiceName, 'queryUserDeviceByDeviceDomains', [userId, domains], callback);
      }

      service.uploadFileUrl = serviceProxy.origin;

      return service;
    }
  ]);
});