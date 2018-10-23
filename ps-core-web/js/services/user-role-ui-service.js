define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('userRoleUIService', ['serviceProxy',
    function(serviceProxy) {
      var roleService = 'userRoleUIService',
        factory = {};
        
      /*
       *  添加一个新的角色
       *  roleName 角色名称
       *  description 角色描述
       *  domainID 域id
       *  domainPath 域路径
       */
      factory.addRole = function(roleList, callback) {
        serviceProxy.get(roleService, 'addRole', roleList, callback);
      };

      /*
       *  删除一个角色
       * roleId  角色id
       */
      factory.deleteRole = function(roleId, callback) {
        serviceProxy.get(roleService, 'deleteRole', roleId, callback);
      };

      /*
       *  修改角色
       * roleId 角色id
       * roleName 角色名称
       *  description 角色描述
       */
      factory.modifyRole = function(roleList, callback) {
        serviceProxy.get(roleService, 'modifyRole', roleList, callback);
      };

      /*
       *  查询单个角色关联的所有用户
       *  roleId  角色id
       */
      factory.getAssociateRole2User = function(roleId, callback) {
        serviceProxy.get(roleService, 'getAssociateRole2User', roleId, callback);
      };

      /*
       *  已经存在的角色添加给一个用户
       *  userId 用户ID
       * roleId  角色id
       */
      factory.addRole2User = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'addRole2User', [userId, roleId], callback);
      };
      factory.appendRole = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'appendRole', [userId, roleId], callback);
      };
      factory.removeRole = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'removeRole', [userId, roleId], callback);
      };

      /*
       *  给角色添加用户
       *  userId 用户ID
       * roleId  角色id
       */
      factory.addRole2User = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'addRole2User', [userId, roleId], callback);
      };

      /*
       *  给用户添加角色
       *  userId  用户ID
       * roleId  角色id
       */
      factory.addUser2Role = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'addUser2Role', [userId, roleId], callback);
      };
      factory.appendUser = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'appendUser', [userId, roleId], callback);
      };
      factory.removeUser = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'removeUser', [userId, roleId], callback);
      };
      
      /*
       *  删除用户的一个角色
       *  userId 用户ID
       * roleId  角色id
       */
      factory.deleteRole2User = function(userId, roleId, callback) {
        serviceProxy.get(roleService, 'deleteRole2User', [userId, roleId], callback);
      };
      
      /*
       *  查询用户下关联的角色
       *  userId 用户ID
       */
      factory.queryRoleByUser = function(userId, callback) {
        serviceProxy.get(roleService, 'queryRoleByUser', userId, callback);
      };

      /**
       *  查询角色关联视图
       *  userId 用户ID
       */
      factory.findRoleRes = function(param, callback){
        serviceProxy.get(roleService, 'findRoleRes', param, callback);
      };
      
      /**
       *  通过视图IDs查询角色
       */
      factory.findRoleResByResIds = function(param, callback){
        serviceProxy.get(roleService, 'findRoleResByResIds', param, callback);
      };
      
      /**
       *  删除角色关联视图
       *  userId 用户ID
       */
      factory.deleteRoleRes = function(roleRes, callback){
        serviceProxy.get(roleService, 'deleteRoleRes', [roleRes], callback);
      };

      /**
       *  设置DASHBOARD视图
       *  userId 用户ID
       */
      factory.addRoleView = function(roleViews, callback){
        serviceProxy.get(roleService, 'addRoleView', [roleViews], callback);
      };

      /**
       *  清除DASHBOARD视图
       *  userId 用户ID
       */
      factory.deleteRoleView = function(roleViews, callback){
        serviceProxy.get(roleService, 'deleteRoleView', [roleViews], callback);
      };

      /**
       *  清除DASHBOARD视图
       *  userId 用户ID
       */
      factory.findRoleViews = function(roleView, callback){
        serviceProxy.get(roleService, 'findRoleViews', roleView, callback);
      };
      return factory;
    }
  ]);

});