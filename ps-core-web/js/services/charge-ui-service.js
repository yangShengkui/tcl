define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('chargeUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'chargeUIService',
        factory = {};

      /*
       *  提交订单
       *  order
       */
      factory.saveOrder = function(order,callback) {
        serviceProxy.get(service, 'saveOrder',order, callback);
      };
      /*
       *  根据订单号获取订单
       *  orderNo 订单号
       */
      factory.getOrderByOrderNo = function(orderNo,callback) {
        serviceProxy.get(service, 'getOrderByOrderNo',orderNo, callback);
      };
      /*
       *  根据优惠码获取优惠券
       *  code 优惠码
       */
      factory.getCouponByPromoCode = function(code,callback) {
        serviceProxy.get(service, 'getCouponByPromoCode',code, callback);
      };
      /*
       *获取当前用户购买的服务
       */
      factory.getCurrentUserProduct = function(callback) {
        serviceProxy.get(service, 'getCurrentUserProduct',[], callback);
      };
      /*
       *获取当前用户的激费记录
       */
      factory.getCurrentUserOrder = function(callback) {
        serviceProxy.get(service, 'getCurrentUserOrder',[], callback);
      };
      /*
       *获取所有价格定义
       */
      factory.getAllPrice = function(callback) {
        serviceProxy.get(service, 'getAllPrice',[],callback);
      };
      return factory;
    }
  ]);

});