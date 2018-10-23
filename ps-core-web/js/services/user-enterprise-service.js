define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('userEnterpriseService', ['serviceProxy',
    function(serviceProxy) {
      var serviceNm = 'userEnterpriseService',
        service = {};
      /**
       * 查看企业用户
       */
      service.queryEnterpriseUser = function(callBack) {
        serviceProxy.get(serviceNm, "queryEnterpriseUser", null, callBack);
      };
      /**
       * 修改企业图片链接
       * 企业ID
       * 图片路径
       */
      service.modifyLogo = function(enterprise,imgSrc,callBack) {
        serviceProxy.get(serviceNm, "modifyLogo", [enterprise,imgSrc], callBack);
      };
      /**
       * 修改企业客户状态
       * enterpriseID 企业ID
       */
      service.modifyStatusCustomer = function(enterpriseID,callBack) {
        serviceProxy.get(serviceNm, "modifyStatusCustomer", enterpriseID, callBack);
      };
      /**
       * ID查看客户
       * enterpriseID 客户ID
       */
      service.queryCustomerById = function(enterpriseID,callBack) {
        serviceProxy.get(serviceNm, "queryCustomerById", enterpriseID, callBack);
      };
      /**
       * 企业ID查询企业详情
       * enterpriseID 企业ID
       */
      service.findEnterpriseById = function(enterpriseID,callBack) {
        serviceProxy.get(serviceNm, "findEnterpriseById", enterpriseID, callBack);
      };
      /**
       * 修改企业角色
       * enterpriseID 客户ID
       */
      service.modifyDefaultRole = function(enterpriseID,defaultRole,callBack) {
        serviceProxy.get(serviceNm, "modifyDefaultRole", [enterpriseID,defaultRole], callBack);
      };
      /**
       * 修改企业状态
       * enterpriseID 企业ID
       */
      service.modifyEnterpriseStatus = function(enterpriseID,callBack) {
        serviceProxy.get(serviceNm, "modifyEnterpriseStatus", enterpriseID, callBack);
      };
      /**
       * 查看所有企业用户
       */
      service.queryAllEnterprise = function(callBack) {
        serviceProxy.get(serviceNm, "queryAllEnterprise", null, callBack);
      };

      /**
       * 查看企业角色
       */
      service.queryEnterpriseRole = function(callBack) {
        serviceProxy.get(serviceNm, "queryEnterpriseRole", null, callBack);
      };

      /**
       * 查看企业域
       */
      service.queryEnterpriseDomain = function(callBack) {
        serviceProxy.get(serviceNm, "queryEnterpriseDomain", null, callBack);
      };
      /**
       * 查看企业域
       */
      service.findEnterpriseDomain = function(callBack) {
        serviceProxy.get(serviceNm, "findEnterpriseDomain", null, callBack);
      };

      /**
       * 查看企业信息
       */
      service.queryEnterprise = function(callBack) {
        serviceProxy.get(serviceNm, "queryEnterprise", null, callBack);
      };
      /**
       * 修改企业角色
       */
      service.modifyEnterpriseRole = function(userID, callBack) {
        serviceProxy.get(serviceNm, "modifyEnterpriseRole", userID, callBack);
      };
      /**
       * 修改企业基本信息
       */
      service.modifyEnterpriseInfo = function(userID, callBack) {
        serviceProxy.get(serviceNm, "modifyEnterpriseInfo", userID, callBack);
      };
      /**
       * 修改企业域
       */
      service.modifyEnterpriseDomain = function(domain, callBack) {
        serviceProxy.get(serviceNm, "modifyEnterpriseDomain", domain, callBack);
      };
      /**
       * 查看企业所有用户组
       */
      service.queryEnterpriseGroup = function(callBack) {
        serviceProxy.get(serviceNm, "queryEnterpriseGroup", [], callBack);
      };
      /**
       * 移除用户组用户   
       * groupID  用户组ID
       */
      service.deleteUser2UserGroup = function(groupID, userIDs, callBack) {
        serviceProxy.get(serviceNm, "deleteUser2UserGroup", [groupID, userIDs], callBack);
      };
      /**
       * 给用户组添加用户   
       * groupID  用户组ID
       * userIDs  用户ID
       * enterpriseID  企业ID
       */
      service.addUser2UserGroup = function(groupID, enterpriseID, userIDs, callBack) {
        serviceProxy.get(serviceNm, "addUser2UserGroup", [groupID, enterpriseID, userIDs], callBack);
      };
      /**
       * 修改企业copyRight
       * enterpriseName  用户组ID
       * enterpriseUrl  用户ID
       * enterpriseId  企业ID
       */
      service.modifyCopyRight = function(enterpriseName, enterpriseUrl, enterpriseId, callBack) {
        serviceProxy.get(serviceNm, "modifyCopyRight", [enterpriseName, enterpriseUrl, enterpriseId], callBack);
      };
      /**
       * 删除用户组 
       * groupID  用户组ID
       */
      service.deleteGroup = function(groupID, callBack) {
        serviceProxy.get(serviceNm, "deleteGroup", groupID, callBack);
      };
      /**
       * 修改用户组信息
       * group  用户组信息
       */
      service.modifyGroupInfo = function(group, callBack) {
        serviceProxy.get(serviceNm, "modifyGroupInfo", group, callBack);
      };
      /**
       * admin修改企业信息
       * group  用户组信息
       */
      service.adminModifyEnterprise = function(group, callBack) {
        serviceProxy.get(serviceNm, "adminModifyEnterprise", group, callBack);
      };
      /**
       * 添加用户组
       * group  用户组信息
       */
      service.addGroup = function(group, callBack) {
        serviceProxy.get(serviceNm, "addGroup", group, callBack);
      };
      /**
       * 用户组Id查看信息
       * groupID  用户组ID
       */
      service.queryGroup = function(groupID, callBack) {
        serviceProxy.get(serviceNm, "queryGroup", groupID, callBack);
      };
      /**
       * 查看用户组用户
       * groupID  用户组ID
       */
      service.queryGroupUser = function(groupID, callBack) {
        serviceProxy.get(serviceNm, "queryGroupUser", groupID, callBack);
      };
      /**
       * 查看客户
       * 
       */
      service.queryCustomer = function(callBack) {
        serviceProxy.get(serviceNm, "queryCustomer", [], callBack);
      };
      /**
       * 查看设备提供商
       * 
       */
      service.querySupplier = function(callBack) {
        serviceProxy.get(serviceNm, "querySupplier", [], callBack);
      };
      /**
       * 修改客户信息
       * 
       */
      service.modifyCustomer = function(customer, callBack) {
        serviceProxy.get(serviceNm, "modifyCustomer", customer, callBack);
      };
      /**
       * 删除客户
       * 
       */
      service.deleteCustomer = function(customerId, callBack) {
        serviceProxy.get(serviceNm, "deleteCustomer", customerId, callBack);
      };
      return service;
    }
  ]);
});