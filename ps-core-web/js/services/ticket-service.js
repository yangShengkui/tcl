define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('ticketService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "ticketService";

      /**
       * 获取所有工单
       * @param callback
       */
      service.getAllTickets = function(callback) {
        serviceProxy.get(base, "getAllTickets", [], callback);
      };

      /**
       * 提交工单
       * @param ticket
       * @param callback
       */
      service.commitTicket = function(ticket, callback) {
        serviceProxy.get(base, "commitTicket", ticket, callback);
      };

      /**
       * 通过工单号获取工单
       * @param ticketNo
       * @param callback
       */
      service.getTicket = function(ticketNo, callback) {
        serviceProxy.get(base, "getTicket", ticketNo, callback);
      };
      /**
       * 通过任务ID获取任务详情
       * @param ticketNo
       */
      service.getTicketTaskById = function(ticketNo, callback) {
        serviceProxy.get(base, "getTicketTaskById", ticketNo, callback);
      };
      
      /**
       * 通过工单号,获取任务
       * @param ticketNo
       * @param callback
       */
      service.getTicketTasks = function(ticketNo, callback) {
        serviceProxy.get(base, "getTicketTasks", ticketNo, callback);
      };

      /**
       * 告警转工单
       * @param alertId
       * @param ticket
       * @param callback
       */
      service.alertToTicket = function(alertId, ticket, callback) {
        serviceProxy.get(base, "alertToTicket", alertId, ticket, callback);
      };

      /**
       * 保存工单
       * @param ticket
       * @param callback
       */
      service.saveTicket = function(ticket, callback) {
        serviceProxy.get(base, "saveTicket", ticket, callback);
      };

      /**
       * 删除工单
       * @param ticketId
       * @param callback
       */
      service.deleteTicket = function(ticketId, callback) {
        serviceProxy.get(base, "deleteTicket", ticketId, callback);
      };

      /**
       * 执行工单任务
       * @param ticketId
       * @param followup
       * @param callback
       */
      service.doTask = function(ticketTask, callback) {
        serviceProxy.get(base, "doTask", ticketTask, callback);
      };

      /**
       * 获取工单 10-未发布 100-执行中 200-已完成
       * @param status
       * @param callback
       */
      service.getTicketsByStatus = function(status, callback) {
        serviceProxy.get("ticketTaskService", "getTicketsByStatus", status, callback);
      };

      /**
       * 获取工单任务 0-待处理 100-处理中 200-已完成
       * @param  status
       * @param  callback
       */
      service.getTicketTasksByStatus = function(status, callback) {
        serviceProxy.get(base, "getTicketTasksByStatus", status, callback);
      };
      return service;
    }
  ]);
});