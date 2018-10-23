define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('customerUIService', ['serviceProxy',
    function(serviceProxy) {
      var service = 'customerUIService',
        factory = {};

      //==========================   客户管理   ===============================================  
      //新加客户信息
      factory.addCustomer = function(param, callback) {
        serviceProxy.get(service, 'addCustomer', param, callback);
      };

      //删除客户
      factory.deleteCustomerById = function(id, callback) {
        serviceProxy.get(service, 'deleteCustomerById', id, callback);
      };

      //更新修改客户
      factory.updateCustomer = function(param, callback) {
        serviceProxy.get(service, 'updateCustomer', param, callback);
      };

      //查询客户信息
      factory.findCustomersByCondition = function(param, callback) {
        serviceProxy.get(service, 'findCustomersByCondition', param, function(returnObj) {
          if (returnObj.code == 0) {
            var customerDic = {};
            for (var i in returnObj.data) {
              customerDic[returnObj.data[i]['id']] = returnObj.data[i];
            }
            // returnObj.data.each(function(index, obj) {
            //   customerDic[obj.id] = obj;
            // })
            returnObj.customerDic = customerDic;
            if (callback) {
              callback(returnObj);
            }
          }
        });
      };

      factory.verifyFun = function(value, type, mesg, callback) {
        var reg, r;
        if (type == "phone") {
          reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
          r = reg.test(value);
          if (!r) {
            mesg = true;
            return true;
          } else {
            mesg = false;
            return false;
          }
        } else if (type == "email") {
          reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
          r = reg.test(value);
          if (!r) {
            mesg = true;
            return true;
          } else {
            mesg = false;
            return false;
          }
        }
        if (callback) {
          callback();
        }
      };

      return factory;
    }
  ]);

});
