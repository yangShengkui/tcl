/**
 * Created by whui on 2018/2/5.
 */
define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('deviceResumeUIService', ['serviceProxy',
    function(serviceProxy) {
      var placeServiceName = 'deviceResumeUIService',
        service = {};
      /**
       * 获取故障信息
       */
      service.getDeviceFaultInfoList = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "getDeviceFaultInfoList", [obj], callBack);
      };
      /**
       * 保存故障信息
       */
      service.saveDeviceFaultInfo = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "saveDeviceFaultInfo", [obj], callBack);
      };
      /**
       * 删除故障信息
       */
      service.deleteDeviceFaultInfoById = function(id,callBack) {
        serviceProxy.get(placeServiceName, "deleteDeviceFaultInfoById",id, callBack);
      };


      /**
       * 获取故障手顺书故障信息
       */
      service.getDeviceFaultBookList = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "getDeviceFaultBookList", obj, callBack);
      };
      /**
       * 保存故障手顺书故障信息
       */
      service.saveDeviceFaultBook = function(obj,callBack) {
        serviceProxy.get(placeServiceName, "saveDeviceFaultBook", [obj], callBack);
      };
      /**
       * 删除故障手顺书故障信息
       */
      service.deleteDeviceFaultBookById = function(id,callBack) {
        serviceProxy.get(placeServiceName, "deleteDeviceFaultBookById",id, callBack);
      };

      return service;
    }
  ]);
});
