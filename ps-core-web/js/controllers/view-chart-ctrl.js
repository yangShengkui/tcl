define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.initController('ViewChartsCtrl', ['$scope', '$timeout', 'kpiDataService', 'SwSocket', 'Info', 'resourceUIService', '$q',
    function($scope, $timeout, kpiDataService, SwSocket, Info, resourceUIService, q) {
      console.info("ViewChartsCtrl被触发");
      var baseoption;
      var info = Info.get("../localdb/echarts-chart.json", function(info) {
        baseoption = info.option;
      });
      var uuid;
      var item;
      var kpiCodes = [];
      var kpiName2Code = {}; //kpi名称和编码对应
      var timePeriod = 0; //取值时间长度
      var nodeIds = []; //CI编码数组
      var category; //time或者实例模式
      var formatStr; //时间格式化
      var graphLineColors; //轴的颜色
      var addDatas = [];
      var option;
      var deflen = 0;
      var kpiReturnObj;
      var kpiQueryModel;
      var seriesMaxLen = 0;
      var callback = function(evendata) {
        if (evendata.data.instance) return;
        var index = getChartindexById(evendata.data.nodeId,evendata.data.kpiCode);
        if(index > -1) {
          if (seriesMaxLen == 0) seriesMaxLen = kpiReturnObj.data.recordList.length;
          kpiReturnObj = kpiDataService.mergeKpiHandler(evendata.data,kpiQueryModel,kpiReturnObj);
          var newData = kpiReturnObj.data.recordList[kpiReturnObj.data.recordList.length-1];
          if (kpiReturnObj.data.recordList.length == seriesMaxLen) { //更新不增加
            option.series.forEach(function(series) {
              series.data.pop();
              series.data.push(newData[series.filedName]);
            });
          } else { //跟新增加
            seriesMaxLen++;
            if(option.xAxis) {
              var xaxis = option.xAxis[0];
              if(xaxis.data.length >= deflen) {
                xaxis.data.shift();
              }
              xaxis.data.push(newDateJson(newData.arisingTime).Format(GetDateCategoryStrByLabel(formatStr.value)));
            }
            option.series.forEach(function(series) {
              if(series.data.length >= deflen) {
                series.data.shift();
              }
              series.data.push(newData[series.filedName]);
            })
          }
          $scope.$broadcast('OptionStatusChange', {
            "name":$scope.$parent.view?$scope.$parent.view.echartViewId:null,
            "option": option
          });
        }
      };
      
      var getChartindexById = function(ciid,kpiid) {
        for(var i = 0; i < option.series.length; i++) {
          if (option.series[i].filedName == ciid+"?"+kpiid)
            return i;
        }
        return 0;
      }
      
      var GasFunction = function(value) {
        switch (value) {
          case 0:
            return 'H';
          case 50:
            return '温度';
          case 100:
            return 'C';
        }
      }
      
      var WaterFunction = function(value) {
        switch (value) {
          case 0:
            return 'H';
          case 50:
            return '能耗';
          case 100:
            return 'C';
        }
      }
      var getResourceKpis = function(model, callback) {
          resourceUIService.getKpisByModelId(model.id, function(returnObj) {
            if (returnObj.code == 0) {
              model.kpis = returnObj.data;
              var regExp = /\{|\[.*\}|\]/;
              for (var i in model.kpis) {
                if (model.kpis[i].range) {

                  var find = regExp.test(model.kpis[i].range);
                  var rangeObj = [];
                  if (find) {
                    try {
                      rangeObj = find ? JSON.parse(model.kpis[i].range) : [];
                    } catch (e) {

                  }
                }
                model.kpis[i].rangeAry = rangeObj;
                if(rangeObj instanceof Array) {
                  model.kpis[i].rangeAry = rangeObj;
                  if(rangeObj.length == 2) {
                    model.kpis[i].min = rangeObj[0];
                    model.kpis[i].max = rangeObj[1];
                  }
                } else if(rangeObj instanceof Object) {
                  model.kpis[i].rangeObj = rangeObj;
                }
              }
              if(model.kpis[i].displayParam) {
                var find = regExp.test(model.kpis[i].displayParam);
                var displayParamObj = {};
                if(find) {
                  displayParamObj = JSON.parse(model.kpis[i].displayParam);
                }
                model.kpis[i].displayParamObj = displayParamObj;
              }
              resourceUIService.kpisDic[model.id + "??" + model.kpis[i].id] = model.kpis[i];
              resourceUIService.kpisDic[model.kpis[i].id] = model.kpis[i];
            }
            if(callback) {
              callback(model);
            }
          };
        });
      };

      /**
       * 初始化
       * @param 是否重载 reload
       */
      var init = function(reload) {
        if (!reload)
          uuid = Math.uuid();
        var isOld = true; //是否为V1版本视图
        var defaultChart = false; //默认Chart不做任何处理
        var theme = item.theme ? item.theme : 'macarons';
        if (item.hasOwnProperty("option")) {
          if (item.hasOwnProperty('timespan')) {
            kpiCodes = item.kpis;

            var extendFlg = true;
            for (var j in item.nodes) {
              for (var i in kpiDataService.cilistByModelId) {
                if (item.nodes[j] == kpiDataService.cilistByModelId[i].id) {
                  extendFlg = false;
                  break;
                }
              }
              if (extendFlg && kpiDataService.cilistByModelId && kpiDataService.cilistByModelId.length > 0) {
                for (var i = 0; i < item.nodes.length; i++) {
                  if (kpiDataService.cilistByModelId[i]) {
                    if (item.modelId == kpiDataService.cilistByModelId[i].modelId) {
                      nodeIds.push(kpiDataService.cilistByModelId[i].id);
                    } else {
                      nodeIds = item.nodes;
                    }
                  } else {
                    nodeIds = item.nodes;
                  }
                }
              } else {
                nodeIds = item.nodes;
              }
              break;
            }
            timePeriod = item.timespan;
            if (item.type == "line" || item.type == "bar") {
              category = "time";
            } else if (item.type == "pie" || item.type == 'gauge') {
              category = "time";
              timePeriod = 0;
            }
            formatStr = {};
            formatStr.value = '';
            if (item.formatStr)
              formatStr.value = item.formatStr;
          } else {
            defaultChart = true;
          }

          isOld = false;
        } else {
          if (item.hasOwnProperty("isGroup") && item["isGroup"]) {
            for (var i in item.children) {
              var subItem = item.children[i];
              kpiCodes.push.apply(kpiCodes, kpiDataService.getKpisInfo(subItem)[0]);
              if (i == 0) {
                category = subItem.dataSource.filters.category;
                var arr = kpiDataService.getNodesInfo(subItem);
                nodeIds = arr[0];
                timePeriod = arr[1];
              }
            }
          } else {
            formatStr = kpiDataService.getChartProperty(item, "categoryAxisFormatStr");
            category = item.dataSource.filters.category;
            if (item.type == "LineChart")
              graphLineColors = kpiDataService.getChartProperty(item, "graphLineColors").value.split(",");
            var arr = kpiDataService.getKpisInfo(item);
            kpiCodes = arr[0];
            kpiName2Code = arr[1];
            var arr = kpiDataService.getNodesInfo(item);
            nodeIds = arr[0];
            timePeriod = arr[1];
          }
        }

        if (defaultChart) {
          $timeout(function() {
            $scope.$broadcast(Event.ECHARTINFOSINIT, {
              "theme": theme,
              "option": item.option
            });
          });
          return;
        }

        kpiQueryModel = {
          category: category,
          isRealTimeData: true,
          timePeriod: timePeriod,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes,
          kpisDic: {
            minTimespan: 0
          }
        };
        var p = ["kpi", kpiQueryModel];
        kpiReturnObj = null;
        var hierarchyValueHandler = function(returnObj) {
          if(returnObj.code == 0) {
            var xAxisObj;
            kpiReturnObj = returnObj;
            if (isOld) {
              option = jQuery.extend(true, {}, baseoption);
              option.legend.data = [];
              option.xAxis = [];
              option.series = [];
              if (item.hasOwnProperty("isGroup") && item["isGroup"]) {
                option.title.text = "";
                option.title.subtext = "";
                if (item.type == "PieChart") {
                  option.tooltip = info.pieOption.tooltip;
                  option.toolbox = info.pieOption.toolbox;
                  info.pieOption.series = [];
                } else if (item.type == "GaugeChart") {
                  option.tooltip = info.gaugeOption.tooltip;
                  info.gaugeOption.series = [];
                }
              } else {
                //设置title
                var titleObj = kpiDataService.getChartProperty(item, "title");
                option.title.text = titleObj.value;
                option.title.subtext = "";
                if (item.type == "PieChart") {
                  option.tooltip = info.pieOption.tooltip;
                  option.toolbox = info.pieOption.toolbox;
                  info.pieOption.series[0].data = [];
                } else if (item.type == "GaugeChart") {
                  option.tooltip = info.gaugeOption.tooltip;
                  info.gaugeOption.series[0].data = [];
                }
              }
            } else {
              baseoption = item.option;
              option = jQuery.extend(true, {}, baseoption);
              if (option.legend)
                option.legend.data = [];
              option.xAxis = [];
              option.series = [];
            }
            for (var i in kpiQueryModel.nodeIds) {
              var node = kpiQueryModel.nodesDic[kpiQueryModel.nodeIds[i]];

              for (var j in kpiQueryModel.kpiCodes) {
                var kpi = kpiQueryModel.kpisDic[kpiQueryModel.kpiCodes[j]];
                if (option.legend) {
                  if (node && kpi && node.hasOwnProperty("label") && kpi.hasOwnProperty("label")) {
                    option.legend.data.push(node.label + ":" + kpi.label);
                  } else {
                    continue;
                  }
                }

                if (item.type == "pie" || item.type == 'gauge') {
                  if (option.series.length == 0) {
                    option.series.push(jQuery.extend(true, {}, baseoption.series[0]));
                    option.series[0].data = [];
                  }
                  var pieObj = {};
                  pieObj.name = node.label + ":" + kpi.label;
                  pieObj.filedName = kpiQueryModel.nodeIds[i] + "?" + kpiQueryModel.kpiCodes[j];
                  pieObj.value;
                  option.series[0].data.push(pieObj);
                } else
                if (item.type == "GaugeChart") {
                  info.gaugeOption.series[0].name = filedNameAry[0];
                  var gaugeObj = {};
                  gaugeObj.name = node.label + ":" + kpi.label;
                  gaugeObj.filedName = kpiQueryModel.nodeIds[i] + "?" + kpiQueryModel.kpiCodes[j];
                  gaugeObj.value = "";
                  info.gaugeOption.series[0].data.push(gaugeObj);
                } else
                if (item.type == "line" || item.type == "bar") {
                  var seriesObj;
                  for (var m in baseoption.series) {
                    seriesObj = jQuery.extend(true, {}, baseoption.series[m]);
                    if (seriesObj.name.indexOf(kpi.label) > -1) {
                      break;
                    }
                  }
                  if (seriesObj) {
                    seriesObj.data = [];
                    seriesObj.name = node.label + ":" + kpi.label;
                    seriesObj.filedName = kpiQueryModel.nodeIds[i] + "?" + kpiQueryModel.kpiCodes[j];
                    option.series.push(seriesObj);
                  }
                }
              }
            }
            if (item.type == "LineChart" || item.type == "line" || item.type == "bar") {
              xAxisObj = jQuery.extend(true, {}, baseoption.xAxis[0]);
              xAxisObj.data = [];
            }

            for(var i in kpiReturnObj.data.recordList) {
              var kpirecord = kpiReturnObj.data.recordList[i];
              if (item.hasOwnProperty("isGroup") && item["isGroup"]) {
                if (item.type == "GaugeChart") {
                  for (var j in info.gaugeOption.series) {
                    var seriesObj = info.gaugeOption.series[j];
                    seriesObj.data[0].value = kpirecord[seriesObj.data[0].filedName];
                  }
                }

              } else {
                if (item.type == "PieChart") {

                  for (var j in info.pieOption.series[0].data) {
                    var seriesObj = info.pieOption.series[0].data[j];
                    seriesObj.value = kpirecord[seriesObj.filedName];
                  }
                } else
                if (item.type == "pie" || item.type == 'gauge') {

                  for (var j in option.series[0].data) {
                    var seriesObj = option.series[0].data[j];
                    seriesObj.value = kpirecord[seriesObj.filedName];
                  }
                } else
                if (item.type == "GaugeChart") {
                  for (var j in info.gaugeOption.series[0].data) {
                    var seriesObj = info.gaugeOption.series[0].data[j];
                    seriesObj.value = kpirecord[seriesObj.filedName];
                  }
                } else
                if (item.type == "LineChart" || item.type == "line" || item.type == "bar") {
                  for (var j in option.series) {
                    var seriesObj = option.series[j];
                    seriesObj.data.push(kpirecord[seriesObj.filedName]);
                    if (j == 0) {
                      var xaxis = kpirecord[kpiQueryModel.category]
                      if (category == "time") {
                        xaxis = newDateJson(xaxis).Format(GetDateCategoryStrByLabel(formatStr.value));
                      }
                      xAxisObj.data.push(xaxis);
                    }
                  }
                }
              }
            }
            if (item.type == "GaugeChart") {
              for (var i in info.gaugeOption.series) {
                var seriesObj = info.gaugeOption.series[i];
                option.series.push(seriesObj);
              }
            } else if (item.type == "pie" || item.type == 'gauge') {
              //							option=baseoption;
            } else if (item.type == "PieChart") {
              seriesObj = jQuery.extend(true, {}, info.pieOption.series[0]);
              option.series.push(seriesObj);

            } else if (item.type == "LineChart" || item.type == "line" || item.type == "bar") {
              option.xAxis.push(xAxisObj);
            }
            if (option.series == null || option.series[0] == null || option.series[0].data.length == 0) {
              return;
            }
            $scope.$broadcast(Event.ECHARTINFOSINIT, {
              "name":$scope.$parent.view?$scope.$parent.view.echartViewId:null,
              "theme": theme,
              "option": option
            });
            console.info("在Controller中获得echarts的option");

            var param = {
              ciid: nodeIds.toString(),
              kpi: kpiCodes.toString()
            };
            if (!reload) {
              var operation = "register";
              //考虑极端情况，一个页面有多个模块监听同一个方法  
              //但展示在页面的数据需对接收的实时监听的数据做不同处理 
              SwSocket.register(uuid, operation, callback);

              //websocket发送请求
              SwSocket.send(uuid, operation, 'kpi', param);
            }

          }

        }
        var handlerFun = function(p) {
          //				kpiDataService.getKpiHierarchyValueList(p, function(returnObj) {
          kpiDataService.getKpiValueList(p, function(returnObj) {
            if(baseoption) {
              hierarchyValueHandler(returnObj);
            } else {
              $timeout(function() {
                hierarchyValueHandler(returnObj);
              });
            }
          });
        };
        /*
        resourceUIService.getResourceByIds(nodeIds,function(returnObj){
        	kpiQueryModel.nodesDic = returnObj;
        	if (kpiQueryModel.kpisDic) {
        		handlerFun(["kpi", kpiQueryModel]);
        	}
        		
        });
        resourceUIService.getKpisByKpiIds(kpiCodes,function(returnObj){
        	kpiQueryModel.kpisDic = returnObj;
        	if (kpiQueryModel.nodesDic) {
        		handlerFun(["kpi", kpiQueryModel]);
        	}
        });
        */
        resourceUIService.getResourceByIds(nodeIds, function(returnObj) {
          kpiQueryModel.nodesDic = returnObj;
          for (var key in kpiQueryModel.nodesDic) {
            getResourceKpis({
              id: kpiQueryModel.nodesDic[key].modelId
            }, function(model) {
              var minTimespan = -1;
              kpiCodes.forEach(function(kpiid) {
                var kpiDef = resourceUIService.kpisDic[kpiid];
                if(kpiDef) {
                  kpiQueryModel.kpisDic[kpiid] = kpiDef;
                  if(minTimespan == -1) {
                    minTimespan = resourceUIService.getMSvalue(0, kpiDef);
                    deflen = Math.ceil(kpiQueryModel.timePeriod / minTimespan);
                  }
                }
              })
              if(minTimespan > -1) {
                kpiQueryModel.kpisDic.minTimespan = minTimespan;
                handlerFun(["kpi", kpiQueryModel]);
              }
            })
          }
        });
      }
      
      item = $scope.echartItem?$scope.echartItem:($scope.$parent.item?$scope.$parent.item:null);
      if (item) {
        init();
      }

      /**
       * 更换CI时重新加载
       */
      $scope.$on("itemChanger", function(event, changerItem) {
        if (changerItem.id == item.id) {
          item = changerItem;
          init(true);
        }
      });

      /**
       * 注销scope时注销方法heartBeat，回调函数callback  
       */
      $scope.$on("$destroy", function() {
        console.log("on-destroy");
        SwSocket.unregister(uuid);
      });
    }
  ]);
});