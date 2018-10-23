define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('kqiManagerUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "kqiManageUIService";

      service.getKqiCalcRules = function(callback){
        serviceProxy.get(base, 'getKqiCalcRules', [], callback);
      };

      service.addKqiCalcRule = function(param, callback){
        serviceProxy.get(base, 'addKqiCalcRule', [param], callback);
      };

      service.updateKqiCalcRule = function(param, callback){
        serviceProxy.get(base, 'updateKqiCalcRule', [param], callback);
      };

      service.deleteKqiCalcRule = function(id, callback){
        serviceProxy.get(base, 'deleteKqiCalcRule', [id], callback);
      };

      service.saveKqiModel = function(param, callback){
        serviceProxy.get(base, 'saveExpertDataModel', [param], callback);
      };

      service.getAllExpertDataModels = function(callback){
        serviceProxy.get(base, 'getAllExpertDataModels', [], callback);
      };

      service.getKqiModels = service.getExpertDataModels = function(callback){
        serviceProxy.get(base, 'getExpertDataModels', [], callback);
      };

      service.applyExpertDataModel = function(id, callback){
        serviceProxy.get(base, 'applyExpertDataModel', [id], callback);
      };

      service.deleteKqiModel = function(id, callback){
        serviceProxy.get(base, 'deleteExpertDataModel', [id], callback);
      };

      service.getKqiModelById = function(id, callback){
        serviceProxy.get(base, 'getExpertDataModelById', [id], callback);
      };

      return service;
    }
  ]);
});