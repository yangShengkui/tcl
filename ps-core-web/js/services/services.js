(function(global, factory){
  if(typeof define == "function"){
    define(['angular', "../../../js/services/service_factory"], factory);
  } else {
    var angular = {
      module : function(){}
    }
    if(typeof module == "object"){
      if(module.exports){
        module.exports = factory(angular, require(['./service_factory.js']));
      }
    } else {
      if (global == window) {
        window.$services = factory(angular, {});
      }
    }
  }
})(this, function(angular, factory){
  'use strict';
  var injectParams = ['$http', '$rootScope', '$location', '$q', 'growl'],
    allrequests = [],
    services = angular.module('services', ['ngResource']);
  function authFactory($http, $rootScope, $location, $q, growl) {
    var params = getUrlParams();
    var token = params["token"];
    var version = params["version"] ? params["version"] : "V2";
    factory.version = version;
    if (window.location.host && window.location.host.search('localhost') == -1 && window.location.host.search('127.0.0.1') == -1 && window.location.host.search('192.168.199.223') == -1) {
      factory.host = window.location.host;
      if (window.location.origin != undefined) {
        factory.origin = window.location.origin;
      } else {
        factory.origin = "https://" + window.location.host;
      }
      if (window.location.protocol == "https:") {
        factory.protocol = "wss:";
      } else {
        factory.protocol = "ws:";
      }
    }
    /** 应用webpack-dev-server启动服务器暂定8080端口，代理解决开发时跨域问题 */
    var serviceBase = (function(loc){
      var host = loc.host;
      function isLocalHost(host){
        var localhostLike = new RegExp("localhost", "g");
        return localhostLike.test(host);
      }
      if(isLocalHost(host) && window.location.port == "63342"){
        return factory.origin + "/";
      } else {
        return loc.origin + "/";
      }
    })(window.location);
    /** 应用webpack-dev-server启动服务器暂定8080端口，代理解决开发时跨域问题 */
    factory.get = function (service, method, param, callBack, err, extendstr) {
      var cancel = $q.defer();
      if (typeof callBack != "function") {
        console.log(service, method, callBack);
      }
      if (!angular.isString(param)) {
        param = angular.copy(param);
        param = JSON.stringify(param);
      }
      var route = (function(s){
        if(s == "nodejsapi"){
          return "api/node"
        } else if(service.indexOf("/") > -1){
          return "api/rest/";
        } else {
          return "api/rest/post/"
        }
      })(service);
      service = service == "nodejsapi" ? "" : service;
      var url = serviceBase + route + service + "/" + method+(extendstr?("?"+extendstr):"");
      //var url = "/api/rest/post/" + service + "/" + method+(extendstr?("?"+extendstr):"");
      if (token != null) {
        url += "?token=" + token;
      }
      var config = {
        timeout : cancel.promise
      }
      var callToken = $http.post(url, param, config);
      function emptyCall(){
        return null;
      }
      callToken.success && callToken.success(success) || callToken.then(success);
      function success(e) {
        e = e.status == 200 ? e.data : e;
        callToken.kill = emptyCall;
        if (callBack != null) {
          if (e.code == 0) {
            callBack(e);
          }
          else {
            if (e.message.search("需要用户登录才能使用") > -1) {
              var dt = e.data;
              dt = ( dt[0] == "/" ) && dt.slice(1) || dt;
              location.href = "../" + dt;
              callBack({
                code: 0,
                data: {}
              });
            } else if (e.code > 9999) {
              growl.info(e.message, {});
              callBack(e);
            } else {
              console.error(url, "方法调用发生错误");
              console.error("参数：", JSON.stringify(param, null, 2));
              console.error("错误编码" + e.code + ":" + e.message)
              growl.error("错误编码" + e.code + ":" + e.message, {});
              callBack(e);
            }
          }
        }
      };
      callToken.error && callToken.error(error) || callToken.catch(error);
      function error(data) {
        var err = "";
        if (status == -1)
          err = "(HTTP status:" + status + ")服务器连接已中断，请刷新页面";
        else
          err = "网络链接异常，请刷新页面";
        callToken.kill == emptyCall && growl.error(err, {});
        callToken.kill = emptyCall;
      };
      callToken.kill = function(){
        console.log("kill!!");
        cancel.resolve("kill");
        var inx = allrequests.indexOf(this);
        allrequests.splice(inx, 1);
      }
      allrequests.push(callToken)
      return callToken;
    };
    var d = new Date();
    var gmtMilliseconds = d.getTimezoneOffset() * 60 * 1000;
    factory.removeAllRequest = function(){
        console.log("allrequests", allrequests);
        for(var i in allrequests){
          allrequests[i].kill();
        }
    }
    function convertDateToString(input) {
      // Ignore things that aren't objects.
      if (typeof input !== "object") return input;
      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;
        var value = input[key];
        if (angular.isDate(value)) {
          value.setMilliseconds(value.getMilliseconds() - gmtMilliseconds);
          input[key] = value.toJSON();
        } else if (typeof value === "object") {
          convertDateToString(value);
        }
      }
    }
    function getUrlParams() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }
    return factory;
  };
  authFactory.$inject = injectParams;
  services.factory('serviceProxy', authFactory);
  return services;
});
