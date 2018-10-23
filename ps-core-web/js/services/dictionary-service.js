define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('dictionaryService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'dictionaryService',
        factory = {};

      /*
       *  获取所有枚举
       */
      factory.getAllDicts = function(callback) {
        serviceProxy.get(service, 'getAllDicts', null, callback);
      };

      /*
       *  通过字典编码获取数据字典项
       */
      factory.getDictValues = function(dictCode, callback) {
        serviceProxy.get(service, 'getDictValues', dictCode, callback);
      };
      return factory;
    }
  ]);

});