define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('psMessageService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'psMessageService',
        factory = {};

      /*
       *  消息条数
       */
      factory.queryMessageNum = function(callback) {
        serviceProxy.get(service, 'queryMessageNum',[], callback);
      };
      
      /*
       *  查询一个用户的消息
       */
      factory.queryMessageByUserID = function(callback) {
        serviceProxy.get(service, 'queryMessageByUserID',[], callback);
      };
      
      /*
       *  查询公告消息
       */
      factory.queryAllMessage = function(callback) {
        serviceProxy.get(service, 'queryAllMessage',[], callback);
      };
      
      /*
       *  查询一个用户的一种类型消息
       *  messageType  消息类型
       */
      factory.queryMessageByTypeAndUserID = function(messageType,callback) {
        serviceProxy.get(service, 'queryMessageByTypeAndUserID', messageType, callback);
      };
      
      /*
       *  查询一个用户的一种状态消息
       *  messageStatus  消息类型
       */
      factory.queryMessageByStatusAndUserID = function(messageStatus,callback) {
        serviceProxy.get(service, 'queryMessageByStatusAndUserID', messageStatus, callback);
      };
      
      /*
       *  查询一个用户的一种状态消息
       *  messageStatus  消息类型
       */
      factory.queryMessageByStatusAndUserIDWithPage = function(params,callback) {
        serviceProxy.get(service, 'queryMessageByStatusAndUserIDWithPage', params, callback);
      };
      
      /*
       *  查询消息
       *  messageId  消息ID
       */
      factory.queryMessageByID = function(messageId,callback) {
        serviceProxy.get(service, 'queryMessageByID', messageId, callback);
      };
      
      /*
       *  修改消息状态
       *  messageId  消息ID
       */
      factory.modifyMsgStatus = function(messageId,callback) {
        serviceProxy.get(service, 'modifyMsgStatus', [messageId], callback);
      };
      
      /*
       *  删除消息关联
       *  messageId  消息ID
       */
      factory.deleteMessageUser = function(messageId,callback) {
        serviceProxy.get(service, 'deleteMessageUser', [messageId], callback);
      };
      
      /*
       *  删除草稿消息关联
       *  messageId  消息ID
       */
      factory.deleteMessage = function(messageId,callback) {
        serviceProxy.get(service, 'deleteMessage', messageId, callback);
      };
      
      /*
       *  查询消息
       *  messageId  消息ID
       */
      factory.queryMessageInfo = function(messageId,callback) {
        serviceProxy.get(service, 'queryMessageInfo', [messageId], callback);
      };
      
      /*
       *  发送站内消息给所有人
       *  messageTitle  消息标题
       *  messageContent  消息内容
       */
      factory.sendMessageToAll = function(messageTitle,callback) {
        serviceProxy.get(service, 'sendMessageToAll', [messageTitle], callback);
      };
      
      /*
       *  添加草稿消息
       *  message集合
       */
      factory.addMessage = function(message,callback) {
        serviceProxy.get(service, 'addMessage', message, callback);
      };
      
      /*
       *修改草稿接口
       *  message集合
       */
      factory.modifyMessage = function(message,callback) {
        serviceProxy.get(service, 'modifyMessage', message, callback);
      };

      return factory;
    }
  ]);

});