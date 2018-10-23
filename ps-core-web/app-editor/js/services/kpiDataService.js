define(['app'], function(services) {
  'use strict';
  services.factory('kpiDataService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "kpiDataFlexService";
      service.getRealTimeKpiData = function(nodeIds, kpiCodes, callBack, error) {
        var kpiQueryModel = {
          isRealTimeData: true,
          timePeriod: 0,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes
        };
        var p = ["psiot", kpiQueryModel];
        serviceProxy.get(base, "getKpiValueList", p, callBack, error);
      };
      service.getRealTimeKpiDataWithKpiInfo = function(nodeIds, kpiCodes, callBack, error) {
        var kpiQueryModel = {
          category: "ci",
          isRealTimeData: true,
          timePeriod: 0,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes,
          startTime: null,
          endTime: null,
          timeRange: "",
          statisticType: "psiot",
          condList: []
        };
        var p = ["psiot", kpiQueryModel];
        serviceProxy.get(base, "getKpiHierarchyValueList", p, callBack, error);
      };
      service.getKpiHierarchyValueList = function(p, callBack, error) {
        serviceProxy.get(base, "getKpiHierarchyValueList", p, callBack, error);
      };
      service.getChartProperty = function(item, key) {
        for(var i in item.properties.item) {
          var pt = item.properties.item[i];
          if(pt.name == key) {
            return pt;
          }
        }
      };
      service.getKpisInfo = function(item) {
        var kpiCodes = [];
        var kpiName2Code = [];
        var displayKpi = item.dataSource.displayKpiSet.displayKpi;
        if(jQuery.isArray(displayKpi)) {
          for(var i in displayKpi) {
            var subDisplayKpi = displayKpi[i];
            kpiCodes.push(Number(subDisplayKpi.code));
            kpiName2Code[subDisplayKpi.code] = subDisplayKpi.name;
          }
        } else {
          kpiCodes.push(Number(displayKpi.code));
          kpiName2Code[displayKpi.code] = displayKpi.name;
        }
        return [kpiCodes, kpiName2Code];
      };
      service.getNodesInfo = function(item) {
        var timePeriod;
        var nodeIds = [];
        for(var i in item.dataSource.filters.filter) {
          var filterObj = item.dataSource.filters.filter[i];
          if(filterObj.type == "ci") {
            var tmpNodeIds = filterObj.nodeIds.split(',');
            for(var j in tmpNodeIds) {
              nodeIds.push(Number(tmpNodeIds[j]));
            }
          } else if(filterObj.type == "time") {
            timePeriod = Number(filterObj.timePeriod) * 60 * 1000;
          }
        }
        return [nodeIds, timePeriod]
      };
      service.saveData = function(data, callback, error) {
        var title = data.title;
        var data = {
          title: "title",
          elements: data.data
        };
        var p = [{
          viewTitle: title,
          viewName: title,
          viewType: "designView",
          content: JSON.stringify(data)
        }];
        console.log(p);
        serviceProxy.get("viewFlexService", "addView", p, callback, error);
      };
      service.getviews = function(callback, error) {
        serviceProxy.get("viewFlexService", "getAllMyViews", [], callback, error);
      };
      service.getViewById = function(id, callback, error) {
        serviceProxy.get("viewFlexService", "getViewById", [id], callback, error);
      };
      service.getAllUnits = function(callback, error) {
        serviceProxy.get("unitService", "getAllUnits", [], callback, error);
      };
      service.updateView = function(viewId, data, callback, error) {
        var title = data.title;
        var data = {
          title: "title",
          elements: data.data
        };
        var p = [{
          viewId: viewId,
          originalViewId: 0,
          viewTitle: title,
          viewName: title,
          viewType: "designView",
          content: JSON.stringify(data)
        }];
        console.log(p);
        serviceProxy.get("viewFlexService", "updateView", p, callback, error);
      };
      service.getViewById = function(viewId, callback, error) {
        var param = [parseInt(viewId)];
        serviceProxy.get("viewFlexService", "getViewById", param, callback, error);
      };
      return service;
    }
  ]);
});