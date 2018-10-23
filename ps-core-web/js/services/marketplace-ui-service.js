define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('marketplaceUIService', ['serviceProxy',
    function(serviceProxy) {
      var placeServiceName = 'marketplaceUIService',
        service = {};
      /**
       * 获取所有应用数据
       */
      service.getAllAppDatas = function(callBack) {
        serviceProxy.get(placeServiceName, "getAllAppDatas", [], callBack);
      };
      
      /**
       * 发布数据
       *
       */
      service.publish = function(appData, callBack) {
        serviceProxy.get(placeServiceName, "publish", appData, callBack);
      };
      
      /**
       * 购买数据
       */
      service.buy = function(appId, callBack) {
        serviceProxy.get(placeServiceName, "buy", appId, callBack);
      };
      
      /**
       * 获取有效的标准解决方案
       */
      service.getActivedStandardAppDatas = function(callBack) {
        serviceProxy.get(placeServiceName, "getActivedStandardAppDatas", [], callBack);
      };

      service.getMyAppDatas = function(callBack) {
        serviceProxy.get(placeServiceName, "getMyAppDatas", [], callBack);
      };
      return service;
    }
  ]);
});