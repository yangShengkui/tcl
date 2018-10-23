define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('productUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'productUIService',
        factory = {};
      //==========================   产品信息管理   ===============================================
      //新加产品信息
      factory.addProduct = function(param, callback) {
        serviceProxy.get(service, 'addProduct', param, callback);
      };

      //批量删除产品信息
      factory.deleteProduct = function(idAry, callback) {
        serviceProxy.get(service, 'deleteProduct', idAry, callback);
      };

      //更新修改产品信息
      factory.updateProduct = function(param, callback) {
        serviceProxy.get(service, 'updateProduct', param, callback);
      };

      //查询产品信息信息
      factory.findProducts = function(param, callback) {
        serviceProxy.get(service, 'findProducts', param, function(returnObj) {
          if (returnObj.code == 0) {
            var enterpriseDic = {};
            for (var i in returnObj.data) {
              enterpriseDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            returnObj.enterpriseDic = enterpriseDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      //通过企业id查产品信息
      factory.findProductsByEnterpriseId = function(id, callback) {
        serviceProxy.get(service, 'findProductsByEnterpriseId', id, callback);
      };


      return factory;
    }
  ]);

});
