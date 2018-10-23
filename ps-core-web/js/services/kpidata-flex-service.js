define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('kpiDataService', ['serviceProxy',
    function(serviceProxy) {
      var service = {};
      var base = "kpiDataFlexService";
      var include = [
        "arisingTime",
        "granularityUnit",
        "instance",
        "kpiCode",
        "modelId",
        "nodeId",
        "value"
        
      ];
      var includeFields = "includeFields=" + include.toString();
      /**
       * 获得当前KPI数据，适用于一个数据展示的组件，如饼图、仪表盘、节点告警状态等。
       * @param {Array} nodeIds 设备IDs
       * @param {Array} kpiCodes KPIIDs
       * @param {Function} callBack 回调方法
       * @param {Boolean} includeInstance 是否能够查询实例，999999状态专用
       */
      service.getRealTimeKpiData = function(nodeIds, kpiCodes, callBack, includeInstance,extendstr) {
        if (!extendstr) {
          extendstr = includeFields;
        }
        var kpiQueryModel = {
          isRealTimeData: true,
          timePeriod: 0,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes,
          includeInstance: includeInstance
        };
        var p = ["kpi", kpiQueryModel];
        serviceProxy.get(base, "getKpiValueList", p, callBack,null,extendstr);
      };

      service.queryDeviceData = function(kpiQueryModel, callBack,extendstr) {
        if (!extendstr) {
          extendstr = includeFields;
        }
        var p = ["kpi", kpiQueryModel];
        serviceProxy.get(base, "getKpiValueList", p, callBack, null,extendstr);
      };

      service.getRealTimeKpiDataWithKpiInfo = function(nodeIds, kpiCodes, callBack) {
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
        var p = ["kpi", kpiQueryModel];
        serviceProxy.get(base, "getKpiHierarchyValueList", p, callBack);
      };

      service.getKpiHierarchyValueList = function(p, callBack) {
        serviceProxy.get(base, "getKpiHierarchyValueList", p, callBack);
      };
      service.exportKpiValueList = function(kpiQueryObj, callBack) {
        serviceProxy.get(base, "exportKpiValueList", kpiQueryObj, callBack);
      };

      service.getValueList = function(param, callBack,extendstr) {
        if (!extendstr) {
          extendstr = includeFields;
        }
        serviceProxy.get(base, "getKpiValueList", param, function(returnObj) {
          callBack(returnObj);
        },null,extendstr);
      };

      service.getKpiValList = function(param, callBack,extendstr) {
        if (!extendstr) {
          extendstr = includeFields;
        }
        var kpiQueryModel = ({
          category: "time",
          isRealTimeData: true,
          timePeriod: 0,
          nodeIds: [],
          kpiCodes: [],
          startTime: null,
          endTime: null,
          timeRange: "",
          statisticType: "psiot",
          condList: []
        }).$extension(param);
        serviceProxy.get(base, "getKpiValueList", ["kpi", kpiQueryModel], function(returnObj) {
          callBack(returnObj);
        },null,extendstr);
      };

      service.getKpiValueList = function(p, callBack,extendstr) {
        if (!extendstr) {
          extendstr = includeFields;
        }
        var handlerObj = {
          code: 0,
          data: {
            recordList: []
          },
          source: null,
          nodesDic: {},
          kpisDic: {},
          kpisNDic: {},
          insDic: {}
        };
        var mergeKpiValue = function(kpiObj, config) {
          var datavalue = handlerObj.data.recordList[handlerObj.data.recordList.length - 1];
          var arisingMS = newDateJson(kpiObj.arisingTime).getTime();
          if(datavalue.milliseconds == 0) {
            datavalue.milliseconds = arisingMS;
            datavalue.arisingTime = kpiObj.arisingTime;
            datavalue.time = kpiObj.arisingTime;
          }
          if((arisingMS < (datavalue.milliseconds + config.kpisDic.minTimespan))) {

            if(kpiObj.instance) {
              handlerObj.insDic[kpiObj.instance] = kpiObj.instance;
              datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode + "?" + kpiObj.instance] = kpiObj.value;
            } else {
              datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode] = kpiObj.value;
            }
          } else {
            var obj = {
              milliseconds: arisingMS,
              arisingTime: kpiObj.arisingTime,
              time: kpiObj.arisingTime,
            };
            if(kpiObj.instance) {
              handlerObj.insDic[kpiObj.instance] = kpiObj.instance;
              obj[kpiObj.nodeId + "?" + kpiObj.kpiCode + "?" + kpiObj.instance] = kpiObj.value;
            } else {
              obj[kpiObj.nodeId + "?" + kpiObj.kpiCode] = kpiObj.value;
            }
            handlerObj.data.recordList.push(obj);
          }
        };
        serviceProxy.get(base, "getKpiValueList", p, function(returnObj) {
          if(returnObj.code == 0) {
            handlerObj.source = returnObj.data;
            var config = p[1];
            if(returnObj.data.length > 0) {
              if(config.timePeriod > 0) {
                var startTime = newDateJson(returnObj.data[0].arisingTime).getTime();
                var endTime = newDateJson(returnObj.data[returnObj.data.length - 1].arisingTime).getTime();
                var timespan = config.kpisDic.minTimespan;
                var timeDiff = endTime - startTime
              }
            }
            for(var i in returnObj.data) {
              var kpiObj = returnObj.data[i];
              handlerObj.nodesDic[kpiObj.nodeId] = config.nodesDic[kpiObj.nodeId].label;
              handlerObj.kpisDic[kpiObj.kpiCode] = config.kpisDic[kpiObj.kpiCode].label;
              handlerObj.kpisNDic[config.kpisDic[kpiObj.kpiCode].name] = kpiObj.kpiCode;
              if(handlerObj.data.recordList.length == 0) {
                handlerObj.data.recordList.push({
                  milliseconds: 0
                });
              }
              if(config.timePeriod == 0) {
                var datavalue = handlerObj.data.recordList[0];
                /*
                if (kpiObj.instance) {
                  handlerObj.insDic[kpiObj.instance] = kpiObj.instance;
                  datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode + "?" + kpiObj.instance] = kpiObj.value;
                } else {
                  datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode] = kpiObj.value;
                }
                */
                datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode] = kpiObj.value;
                datavalue.arisingTime = kpiObj.arisingTime;
                datavalue.time = kpiObj.arisingTime;
              } else {
                mergeKpiValue(kpiObj, config);
              }
            }
          }
          /*
          if (handlerObj.data.recordList.length > 1) {
            handlerObj.data.recordList.splice(handlerObj.data.recordList.length - 1, 1);
          }
          */
          callBack(handlerObj);
        },null,extendstr);
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
        var kpiName2Code = {};
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
      service.mergeKpiHandler = function(kpiObj, config, handlerObj) {
        var datavalue = handlerObj.data.recordList[handlerObj.data.recordList.length - 1];
        var arisingMS = newDateJson(kpiObj.arisingTime).getTime();

        if((arisingMS < (datavalue.milliseconds + config.kpisDic.minTimespan))) {

          if(kpiObj.instance) {
            handlerObj.insDic[kpiObj.instance] = kpiObj.instance;
            datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode + "?" + kpiObj.instance] = kpiObj.value;
          } else {
            datavalue[kpiObj.nodeId + "?" + kpiObj.kpiCode] = kpiObj.value;
          }
        } else {
          var obj = {
            milliseconds: arisingMS,
            arisingTime: kpiObj.arisingTime,
            time: kpiObj.arisingTime,
          };
          if(kpiObj.instance) {
            handlerObj.insDic[kpiObj.instance] = kpiObj.instance;
            obj[kpiObj.nodeId + "?" + kpiObj.kpiCode + "?" + kpiObj.instance] = kpiObj.value;
          } else {
            obj[kpiObj.nodeId + "?" + kpiObj.kpiCode] = kpiObj.value;
          }
          handlerObj.data.recordList.push(obj);
        }
        return handlerObj;
      };
      return service;
    }
  ]);
});