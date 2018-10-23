define(['../services/services.js'], function (services) {
  'use strict';
  services.factory('userIdentifyService', ['serviceProxy',
    function (serviceProxy) {
      var userServiceName = 'userIdentifyService',
        loginService = 'userLoginUIService',
        service = {};
      /**
       * 邮件校验
       * emailCode  邮箱验证码
       */
      service.identifyEmail = function (emailCode, callBack) {
        serviceProxy.get(userServiceName, "identifyEmail", emailCode, callBack);
      };
      /**
       * 展会登录接口
       */
      service.weChatLogin = function (phoneNum, solution, callBack) {
        serviceProxy.get(loginService, "weChatLogin", [phoneNum, solution], callBack);
      };
      /**
       * 展会登录接口
       */
      service.querySolution = function (callBack) {
        serviceProxy.get(loginService, "querySolution", [], callBack);
      };
      /**
       * 发短信修改密码
       * emailCode  邮箱验证码
       */
      service.sendPasswordSMS = function (emailCode, callBack) {
        serviceProxy.get(userServiceName, "sendPasswordSMS", emailCode, callBack);
      };
      /**
       * 短信校验
       * emailCode  短信验证码
       */
      service.identifySMS = function (emailCode, callBack) {
        serviceProxy.get(userServiceName, "identifySMS", emailCode, callBack);
      };
      /**
       *忘记密码修改密码
       * emailAddress  用户邮箱
       * newPassword  新密码
       * hideValidate  隐藏验证码
       */
      service.forgetPassword = function (emailAddress, hideValidate, newPassword, callBack) {
        serviceProxy.get(userServiceName, "forgetPassword", [emailAddress, hideValidate, newPassword], callBack);
      };
      /**
       * 发重置密码邮件
       * emailName  邮箱
       */
      service.sendEmailPassword = function (emailName, callBack) {
        serviceProxy.get(userServiceName, "sendEmailPassword", emailName, callBack);
      };
      /**
       * 邮件验证码校验
       * emailCheck  邮箱验证码
       */
      service.emailCheckPassword = function (emailCheck, callBack) {
        serviceProxy.get(userServiceName, "emailCheckPassword", emailCheck, callBack);
      };
      /**
       * 生成验证码
       */
      service.getIdentify = function (callBack) {
        serviceProxy.get(userServiceName, "getIdentify", [], callBack);
      };
      /**
       * 校验邮箱是否存在
       * emailExist  邮箱验证码
       */
      service.repeatEmail = function (emailExist, callBack) {
        serviceProxy.get(userServiceName, "repeatEmail", emailExist, callBack);
      };
      /**
       * 发邮件
       * emailName  邮箱
       * regionName   国家/地区
       */
      service.sendEmail = function (emailName, regionName, callBack) {
        serviceProxy.get(userServiceName, "sendEmail", [emailName, regionName], callBack);
      };
      /**
       * 验证码校验
       * identifyName  验证码
       */
      service.identifyNum = function (identifyName, callBack) {
        serviceProxy.get(userServiceName, "identifyNum", identifyName, callBack);
      };
      /**
       * 根据手机号发送验证码
       * phoneNumber  手机号码
       */
      service.sendSMS = function (phoneNumber, callBack) {
        serviceProxy.get(userServiceName, "sendSMS", phoneNumber, callBack);
      };
      /**
       * 根据手机号发送验证码
       * phoneNumber  手机号码
       */
      service.identifyPasswordSMS = function (phoneCode, callBack) {
        serviceProxy.get(userServiceName, "identifyPasswordSMS", phoneCode, callBack);
      };
      return service;
    }
  ]);
});