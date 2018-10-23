define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('customMethodService', ['serviceProxy', 'dictionaryService', 'resourceUIService', '$http',
    function(serviceProxy, dictionaryService, resourceUIService, http) {
      /**
       * 保存配置组
       */
      var service = {};
      var PROJECTTYPES = [{"id":5701,"dictCode":"projectType","valueCode":"1","label":"污水处理"},
        {"id":5702,"dictCode":"projectType","valueCode":"2","label":"二次供水"},
        {"id":5703,"dictCode":"projectType","valueCode":"3","label":"中央空调"},
        {"id":5704,"dictCode":"projectType","valueCode":"4","label":"制氧系统"},
        {"id":5705,"dictCode":"projectType","valueCode":"5","label":"锅炉系统"},
        {"id":5706,"dictCode":"projectType","valueCode":"6","label":"电梯监控"}]
      service.getAllPeriod = function(callback) {
        dictionaryService.getDictValues("KqiGranularityUnit", function(event){
          if(event.code == 0){
            event.data = event.data.filter(function(elem){
              return elem.label == "月" || elem.label == "季度" || elem.label == "年";
            });
            callback(event);
          }
        });
      };
      service.random = function(range){
        var min = range[0];
        var delta = range[1] - range[0];
        var ran = Math.round(Math.random() * delta);
        return min + ran;
      };
      service.http = function(url, callback){
        http.get(url).then(callback);
      };
      service.getProjectsType = function(callback, domains) {
        var param = {
          modelIds : [302]
        };
        if(domains){
          domains = domains.replace(/\|/g, "/");
          param.domains = domains
        };
        resourceUIService.getDomainsByFilter(param, function(event){
          var rs = [];
          if(event.code == 0){
            var projects = event.data;
            rs = PROJECTTYPES.filter(function(elem){
              var some = projects.some(function(proj){
                return proj.values.projectType == elem.valueCode;
              });
              return some;
            });
          }
          callback({
            code : 0,
            data : rs
          })
        });
      };
      service.getProTypeByTypeId = function(id, callback){
        service.getProjectsType(function(ptypes){
          var find = ptypes.data.find(function(elem){
            return elem.id == id;
          });
          callback({
            code : 0,
            data : find ? find : ptypes.data[0]
          })
        });

      };
      service.getSimulateList = function(param, callback){
        var rs = [];
        var size = param.size;
        var formatter = param.formatter;
        var loop = function(index){
          var obj = {};
          var loopFormatter = function(item){
            var attr = item.label;
            obj[attr] = item.value(index, service);
          };
          for(var i in formatter){
            loopFormatter(formatter[i]);
          }
          return obj;
        };
        for(var i=0; i<size -1; i++){
          rs.push(loop(i));
        };
        callback(rs);
      };
      return service;
    }
  ]);
});