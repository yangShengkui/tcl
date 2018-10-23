define(['../services/services.js'], function (services) {
  'use strict';
  services.factory('etlUIService', ['serviceProxy',
    function (serviceProxy) {
      var service = 'etlUIService',
        factory = {};

      factory.executeJob = function (etlId, param, callback) {
        serviceProxy.get(service, 'executeJob', [etlId, param], callback);
      };

      return factory;
    }
  ]);

});
