define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('roleViewService', ['serviceProxy', 'userLoginUIService', '$rootScope',
    function(serviceProxy, userLoginUIService, rootScope) {
      var factory = {};
      var getView = function(type, val, callback) {
        var ready = function() {
          var createlist = function(tree) {
            var rs = [];
            var traverse = function(data) {
              rs.push(data);
              if(data.hasOwnProperty("function")) {
                for(var i in data.function) {
                  traverse(data.function[i]);
                }
              }
            };
            traverse(tree);
            return rs;
          };
          var functionlists = createlist(userLoginUIService.user);
          var find = functionlists.find(function(elem) {
            return elem[type] == val;
          });
          if(find) {
            var ViewCode = find.functionCode;
            var roleViewList = userLoginUIService.user.roleViewList;
            var viewResArr = roleViewList.filter(function(elem) {
              return elem.functionCode == ViewCode;
            });
            if(viewResArr.length > 0) {
              var getResourseView = function(array) {
                var rs = array.sort(function(a, b) {
                  if(a.roleId.length < b.roleId.length) {
                    return 0;
                  } else {
                    return 1;
                  }
                });
                /** 如果用户自定义视图获取自定义视图*/
                if(rs.length > 0) {
                  return rs[0];
                } else {
                  return null;
                };
              };
              var viewRes = getResourseView(viewResArr);
              if(viewRes) {
                callback({
                  code: 0,
                  data: viewRes,
                  message: null
                });
              } else {
                callback({
                  code: 1001,
                  data: null,
                  message: "没找到对应的服务视图。"
                });
              }
            } else {
              callback({
                code: 1001,
                data: null,
                message: "此用户角色并没有配置相应的" + name + "视图，请联系系统管理员。"
              })
            };
          } else {
            throw new Error("内部错误：找不到对应'" + name + "'的功能码")
          }
        };
        if(userLoginUIService.user.isAuthenticated) {
          ready();
        } else {
          rootScope.$on("loginStatusChanged", ready);
        }
      };
      factory.getViewByFunctionCode = function(fnCode, callback) {
        getView("functionCode", fnCode, callback);
      };
      factory.getViewByFunctionName = function(name, callback) {
        getView("name", name, callback);
      };
      return factory;
    }
  ]);
});