define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('thridPartyApiService', ['serviceProxy', '$http',
    function(serviceProxy, $http) {
      var service = 'thridPartyApiService',
        factory = {};

      /*
       *  获取AIS系统船只
       *  根据船舶ID获得船舶信息（单船）
       */
      factory.getSignalShipInfo = function(param, callback) {
        serviceProxy.get(service, 'getSignalShipInfo', [param], callback);
      };
      /**
       * 根据船舶ID获得船舶轨迹信息，时间为秒不是毫秒
       * @param shipId:船舶ID,begintTime:开始时间戳,endTime:结束时间戳
       */
      factory.getShipTrack = function(shipId,begintTime,endTime,callback) {
        serviceProxy.get(service, 'getShipTrack',[shipId,begintTime,endTime], callback);
      };
      /**
       * 船舶搜索
       * @param 参数(kerword:搜索的关键字，船舶的名字,ID等)
       */
      factory.searchShip = function(kerword,callback) {
        serviceProxy.get(service, 'searchShip',[kerword], callback);
      };
      /**
       * 船舶搜索
       * @param 参数(kerword:搜索的关键字，船舶的名字,ID等)
       */
      factory.searchShip = function(kerword,callback) {
        serviceProxy.get(service, 'searchShip',[kerword], callback);
      };
      /**
       * 多船信息查询
       * @param 参数(shipIds:多个ID以','间隔)
       */
      factory.getManyShipInfo = function(shipIds,callback) {
        serviceProxy.get(service, 'getManyShipInfo',[shipIds], callback);
      };
      /**
       * 区域船舶查询
       * @param 参数(xy:经纬度，经纬度逗号分隔，多个经纬度间'-'分隔)
       */
      factory.getAreaShip = function(xy,callback) {
        serviceProxy.get(service, 'getAreaShip',[xy], callback);
      };
      /**
       * 船舶靠港记录查询
       * @param 参数(callType:根据哪种id查询记录参考值有【mmsi、imo、shipname、callsign】,shipId：船舶信息值，begintTime:开始时间戳,endTime:结束时间戳)
       */
      factory.getPortOfCallByShip = function(callType,shipId,begintTime,endTime,callback) {
        serviceProxy.get(service, 'getPortOfCallByShip',[callType,shipId,begintTime,endTime], callback);
      };
      /**
       * 港口挂靠历史
       * @param 参数(callType:根据哪种id查询记录参考值有【portid、portcode】,portInfo:港口信息，begintTime:开始时间戳,endTime:结束时间戳)
       */
      factory.getPortOfCallByShip = function(callType,portInfo,begintTime,endTime,callback) {
        serviceProxy.get(service, 'getPortOfCallByShip',[callType,shipId,begintTime,endTime], callback);
      };
      /**
       * 船舶挂靠指定港口信息
       * @param 参数(callType:根据哪种id查询记录参考值有【mmsi、imo、shipname、callsign】,shipId：船舶信息值，portInfo：港口ID，多个id以','间隔，begintTime:开始时间戳,endTime:结束时间戳)
       */
      factory.getPortOfCallByShipPort = function(callType,shipId,portInfo,begintTime,endTime,callback) {
        serviceProxy.get(service, 'getPortOfCallByShipPort',[callType,shipId,portInfo,begintTime,endTime], callback);
      };
      /**
       * 船舶挂靠当前状态
       * @param 参数(callType:根据哪种id查询参考值有【mmsi、imo、shipname、callsign】,shipId：船舶信息值)
       */
      factory.getShipStatus = function(callType,shipId,callback) {
        serviceProxy.get(service, 'getShipStatus',[callType,shipId], callback);
      };
      /**
       * 船舶档案查询
       * @param 参数(callType:根据哪种id查询参考值有【mmsi、imo、shipname、callsign】,shipId：船舶信息值)
       */
      factory.searchShipParticular = function(callType,shipId,callback) {
        serviceProxy.get(service, 'searchShipParticular',[callType,shipId], callback);
      };
      return factory;
    }
  ]);
});