define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('alertService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "alertQueryFlexService";
      service.queryByView = function(viewEntryId, userId, callBack) {
        serviceProxy.get(base, "queryByView", [viewEntryId, userId], callBack);
      };
      service.queryFromCache = function(alertInfo, callBack) {
        serviceProxy.get(base, "queryFromCache", [alertInfo, null], callBack);
      };
      service.queryFromDb = function(alertInfo, callBack) {
        serviceProxy.get(base, "queryFromDb", [alertInfo, null], callBack);
      };
      service.countFromDb = function(alertInfo, callBack) {
        serviceProxy.get(base, "countFromDb", alertInfo, callBack);
      };
      service.countFromCache = function(params, callBack) {
         serviceProxy.get(base, "countFromCache", [params], callBack);
      };
      service.getAlertByPage = function(serarch,page,callBack) {
        serviceProxy.get(base, "getAlertByPage", [serarch,page], callBack);
      };

      return service;
        }
    ]);
});
