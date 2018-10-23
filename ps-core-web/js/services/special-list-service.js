define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('specialListService', ['serviceProxy',
    function(serviceProxy) {
      var service = function(fn){
        return [{
          id : 0,
          value : "专家模型",
          fn : fn
        },{
          id : 1,
          value : "模型工厂",
          fn : fn
        }]
      };
      return service;
    }
  ]);
});