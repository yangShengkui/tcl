/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    console.log(data);
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var kpiDataService = tools.kpiDataService;
    var resourceUIService = tools.resourceUIService;
    var series = [{
      name : "highlight",
      data : []
    },{
      name : "正常",
      data : []
    },{
      name : "机组状态",
      data : []
    },{
      name : "警告告警",
      data : []
    },{
      name : "主要告警",
      data : []
    },{
      name : "重要告警",
      data : []
    },{
      name : "离线设备",
      data : []
    },{
      name : "select",
      data : []
    }];
    var getLegend = function(){
      return ['正常','机组状态','警告告警','主要告警','重要告警','离线设备'];
    };
    var getKpiValue = function(nodes, kpis, callback){
      var kpiQueryModel = {
        category: "ci",
        isRealTimeData: true,
        nodeIds: nodes,
        kpiCodes: kpis,
        startTime: null,
        endTime: null,
        timeRange: "",
        statisticType: "psiot",
        includeInstance : true,
        condList: []
      };
      kpiDataService.getValueList(["kpi", kpiQueryModel], callback);
    };
    var getSeries = function(){
      return series;
    };
    var resources = [];
    var modelIds = [];
    var deviceStatusKpi = [];
    var loop = function(item){
      resources.push(item.id);
      if(modelIds.indexOf(item.modelId) == -1){
        modelIds.push(item.modelId);
      }
    };
    var j= 0;
    var finished = function(){
      var kpis = [999998, 999999].concat(deviceStatusKpi.map(function(elem){
        return elem.id;
      }));
      getKpiValue(resources, kpis, function(event){
        if(event.code == 0){
          var loop = function(item){
            var obj = {};
            var online = event.data.find(function(el){
              return el.nodeId == item.id && el.kpiCode == "999998";
            });
            var status = event.data.find(function(el){
              return el.nodeId == item.id && el.kpiCode == "999999";
            });
            var deviceStatus = event.data.find(function(el){
              return el.nodeId == item.id && deviceStatusKpi.some(function(ele){
                return ele.id == el.kpiCode;
              });
            });
            if(item.values.standardAddress){
              obj.name = item.values.standardAddress;
              obj.label = item.label;
              obj.value = [item.values.longitude, item.values.latitude];
              obj.id = item.id;
              obj.status = status ? status.value : 0;
              obj.online = online ? online.value : 0;
              obj.deviceStatus = deviceStatus ? deviceStatus.value : 0;
              if(obj.label.indexOf("铅山温氏") != -1 || obj.label.indexOf("永丰温氏") != -1){
                console.log(obj);
              }
              if(obj.online == 0){
                //series[2].data.push(obj);
                series[6].data.push(obj);
              } else {
                if(obj.deviceStatus == 0){
                  series[1].data.push(obj);
                } else {
                  if(obj.status < 1){
                    series[2].data.push(obj);
                  } else if(obj.status < 2){
                    series[3].data.push(obj);
                  } else if(obj.status < 3){
                    series[4].data.push(obj);
                  } else if(obj.status < 4){
                    series[5].data.push(obj);
                  };
                }
                //series[1].data.push(obj);
                //series[2].data.push(obj);
              }
            }
          };
          for(var i in data){
            loop(data[i])
          }
          callback({
            getLegend : getLegend,
            getSeries : getSeries,
            data : {
              series : getSeries()
            }
          });
        }
      });
    };
    var repeat = function(inx){
      var modelId = modelIds[inx];
      if(modelId){
        resourceUIService.getKpisByModelId(modelId, function(event){
          if(event.code == 0){
            var find =  event.data.find(function(elem){
              return elem.label == "Device_Status";
            });
            if(find){
              deviceStatusKpi.push(find);
            }
            inx++;
            repeat(inx);
          };
        });
      } else {
        finished();
      }
    };
    for (var i in data) {
      loop(data[i]);
    };
    repeat(j);
  }
});
