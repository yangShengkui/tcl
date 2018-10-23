define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('ticketCategoryService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'ticketCategoryService',
        factory = {};

      /*
       *  查询工单分类
       */
      factory.getTicketCategorys = function(callback) {
        serviceProxy.get(service, 'getTicketCategorys', [], callback);
      };
      /*
       *  保存工单分类
       */
      factory.saveTicketCategory = function(category,callback) {
        serviceProxy.get(service, 'saveTicketCategory', [category], callback);
      };
      /*
       *  通过ID获取工单分类
       */
      factory.getTicketCategoryById = function(categoryId,callback) {
        serviceProxy.get(service, 'getTicketCategoryById', [categoryId], callback);
      };
      /*
       *  删除工单分类
       */
      factory.deleteTicketCategoryById = function(categoryId,callback) {
        serviceProxy.get(service, 'deleteTicketCategoryById', categoryId, callback);
      };

      return factory;
    }
  ]);

});