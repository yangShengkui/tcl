define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('Info', ['$http',
    function($http) {
      var service = {};
      service.get = function(filePath, callBack) {
        if (service[filePath]) {
          callBack(service[filePath]);
          return;
        }
        $http.get(filePath)
          .then(function(response) {
            service[filePath] = response.data;
            callBack(response.data);
          })
          .catch(function(data) {
            callBack(null);
            console.log("无法取得该配置文件")
          })
      };
      return service;
    }
  ]);
});