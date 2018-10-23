define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('weatherService', ['serviceProxy', '$http',
    function(serviceProxy, $http) {
      var service = 'weatherService',
        factory = {};

      /*
       *  获取所有单位
       */
      factory.getWeatherByCity = function(city, callback) {
        serviceProxy.get(service, 'getWeatherByCity', [city], callback);
      };

      factory.getAddressPoint = function(address, callBack) {
        if(address) {
          jQuery.ajax({
            type: "GET",
            url: window.location.protocol + "//api.map.baidu.com/geocoder/v2/?address="+address+"&output=json&ak=eMekSXxqG1j2wLM57RFN61l8T6eB1EDx",
            dataType: "jsonp",
            jsoncallback: 'callBack',
            success: function(d) {
              if(d.status == 0) {
                if(callBack) {
                  callBack(d.result)
                }
              }
            },
            error: function(e) {
              console.log('ajax error');
            }
          });
        } else {
          if(callBack) {
            callBack(null)
          }
        }
      }
      return factory;
    }
  ]);
});