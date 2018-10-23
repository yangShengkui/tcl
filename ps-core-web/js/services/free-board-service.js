define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('freeboardservice', ['serviceProxy', 'serviceCenterService', '$route', 'userDomainService', 'viewFlexService', '$q', 'thridPartyApiService', 'resourceUIService', 'Info', 'growl', "userLoginUIService", 'projectUIService', 'customMethodService', 'ticketTaskService', 'alertService', 'SwSocket', 'kpiDataService', '$routeParams', 'commonMethodService',
    function(serviceProxy, serviceCenterService, route, userDomainService, viewFlexService, q, thridPartyApiService, resourceUIService, Info, growl, userLoginUIService, projectUIService, customMethodService, ticketTaskService, alertService, SwSocket, kpiDataService, routeParam, commonMethodService) {
      var service = {}, freeBoardValue;
      Object.prototype.traveseByChild = function(callback){
        callback(this, [this]);
        traverse(this.children);
        function traverse(data){
          for(var i in data)
          {
            callback(data[i], data);
            if(data[i].children)
            {
              traverse(data[i].children)
            }
          }
        }
      };
      service.InfoData = {
        load : function(path){
          var cur = this;
          cur.defer = function(callback){
            cur.back = callback;
          };
          Info.get(path, function(info) {
            cur.$extension(info);
            cur.defer = 'LOADED';
            if(typeof cur.back == 'function'){
              cur.back();
            }
          });
        },
        defer : 'WAIT',
      };
      Object.defineProperty(Object.prototype, "traveseByChild", {
        enumerable : false
      });
      service.replaceCiKpi = function(data, callback, template, rootTarget){
        var cur = this;
        var clone = data.$clone();
        var defers = [];
        clone.layout.traveseByChild(function(element){
          if(element.type == "injector"){
            element.children = [];
          }
        });
        clone.layout = data.layout.$remapByChild(function(element){
          var rs = new commonMethodService(element);
          rs.setRootTarget(rootTarget);
          return rs;
        });
        cur.$clone(clone);
        cur.layout.traveseByChild(function(element){
          var defer = q.defer();
          var renderAttr = function(){
            if(element.data){
              element.getCiKpi(function(ci, kpi){
                if(element.data){
                  element.data.resource = ci;
                  element.data.kpi = kpi;
                };
                defer.resolve("success");
              });
            } else {
              defer.resolve("success");
            };
          };
          if(element.source) {
            var source = element.source;
            if(source == "TOPO") {
              var viewId = 	element.viewId;
              $$.cacheAsyncData.call(viewFlexService.getViewById, [viewId], function(event){
                if(event.code == 0 && event.data != null){
                  var json = JSON.parse(event.data.content);
                  element.JSON = json;
                }
                renderAttr();
              });
            } else {
              renderAttr();
            }
          } else {
            renderAttr();
          }
          defers.push(defer.promise);
        });
        q.all(defers).then(function(){
          callback(cur);
        });
      };
      return service;
    }
  ]);
  services.factory('dataservice', ['serviceProxy', 'serviceCenterService', '$q', 'resourceUIService', 'Info',
    function(serviceProxy, serviceCenterService, q, resourceUIService, Info) {
      var service = {};
      return service;
    }
  ]);
});