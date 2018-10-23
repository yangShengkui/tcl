/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return {
    init : function(options){
      var result = [];
      var timeStampToStr = function(timeStamp){
        var nDate = new Date(timeStamp - 8 * 3600 * 1000);
        var year = nDate.getFullYear();
        var month = nDate.getMonth() + 1;
        var dat = nDate.getDate();
        var hour = nDate.getHours();
        var min = nDate.getMinutes();
        var sec = nDate.getSeconds();
        if(month < 10){
          month = "0" + month;
        }
        if(dat < 10){
          dat = "0" + dat;
        }
        if(hour < 10){
          hour = "0" + hour;
        }
        if(min < 10){
          min = "0" + min;
        }
        if(sec < 10){
          sec = "0" + sec;
        };
        return year + "-" + month + "-" + dat + "T" + hour + ":" + min + ":" + sec + ".000+0000";
      };
      var simulate = function(options){
        var startTime = options.startTime.getTime();
        var period = options.period;
        var frequency = options.frequency;
        var nodesDes = options.nodesDes;
        var kpisDes = options.kpisDes;
        var range = options.range;
        var getData = function(curTime){
          if(curTime - startTime < period){
            var loopNodes = function(node){
              var loopKpis = function(inx, kpi){
                var calcRandom = function(range){
                  if(range){
                    var max = range[1];
                    var min = range[0];
                    var ran = (max - min);
                    return Math.round((min + Math.random() * ran) * 10) / 10;
                  } else {
                    return Math.round(Math.random() * 100);
                  }
                };
                var val = calcRandom(range);
                var sampleData = {
                  "agentId": "0",
                  "aggregatePeriod":null,
                  "aggregateStatus":null,
                  "aggregateType": null,
                  "arisingTime": timeStampToStr(curTime),
                  "compressCount": 0,
                  "computeTaskId": 0,
                  "dataSerialNumber": 0,
                  "dataTime": null,
                  "insertTime": timeStampToStr(curTime),
                  "kpiCode": kpi.id,
                  "nodeId" : node.id,
                  "notes" : null,
                  "numberValue": val,
                  "quality": 0,
                  "resourceId": 0,
                  "stringValue": null,
                  "value": val,
                  "valueStr": val + ""
                };
                result.push(sampleData);
              };
              for(var i in kpisDes){
                loopKpis(i, kpisDes[i])
              }
              if(typeof callback == "function"){
                callback(result);
              }
            };
            for(var i in nodesDes){
              loopNodes(nodesDes[i])
            }
            getData(curTime + frequency);
          }
        };
        getData(startTime);
        return result;
      };
      return new simulate(options)
    }
  }/**
  return function(type, nodesDes, kpisDes, simulateFn, callback) {
    var result = [];
    var date = new Date();
    var timeStamp = date.getTime();
    var renderData = function(index){
      var startTime = simulateFn.startTime.getTime();
      var period = simulateFn.period;
      var frequency = simulateFn.frequency;
      var range = simulateFn.range;
      var getData = function(curTime){
        if(curTime - startTime < period){
          var loopNodes = function(node){
            var loopKpis = function(inx, kpi){
              var calcRandom = function(range){
                if(range){
                  var max = range[1];
                  var min = range[0];
                  var ran = (max - min);
                  return Math.round((min + Math.random() * ran) * 10) / 10;
                } else {
                  return Math.round(Math.random() * 100);
                }
              };
              var val = calcRandom(range);
              var sampleData = {
                "agentId": "0",
                "aggregatePeriod":null,
                "aggregateStatus":null,
                "aggregateType": null,
                "arisingTime": timeStampToStr(curTime),
                "compressCount": 0,
                "computeTaskId": 0,
                "dataSerialNumber": 0,
                "dataTime": null,
                "insertTime": timeStampToStr(curTime),
                "kpiCode": kpi.id,
                "nodeId" : node.id,
                "notes" : null,
                "numberValue": val,
                "quality": 0,
                "resourceId": 0,
                "stringValue": null,
                "value": val,
                "valueStr": val + ""
              };
              result.push(sampleData);
            };
            for(var i in kpisDes){
              loopKpis(i, kpisDes[i])
            }
            if(typeof callback == "function"){
              callback(result);
            }
          };
          for(var i in nodesDes){
            loopNodes(nodesDes[i])
          }
          getData(curTime + frequency);
        }
      };
      getData(startTime);
    };
    var renderData2D = function(){
      var dictionaryService = services.dictionaryService;
      var loadArray = ["energyType", "industryShortType"];
      var nextStep = function(){
        var loopNodes = function(node){
          var loopKpis = function(inx, kpi){
            var loopInstance = function(ins1){
              var loopInstance2 = function(ins2){
                var range;
                if(ranges){
                  range = ranges[inx];
                }
                var calcRandom = function(range){
                  if(range){
                    var max = range[1];
                    var min = range[0];
                    var ran = (max - min);
                    return Math.round((min + Math.random() * ran) * 10) / 10;
                  } else {
                    return Math.round(Math.random() * 100);
                  }
                };
                var val = calcRandom(range);
                var newTime = timeStamp;
                var sampleData = {
                  "agentId": "0",
                  "aggregatePeriod":null,
                  "aggregateStatus":null,
                  "aggregateType": null,
                  "arisingTime": timeStampToStr(newTime),
                  "compressCount": 0,
                  "computeTaskId": 0,
                  "dataSerialNumber": 0,
                  "dataTime": null,
                  "insertTime": timeStampToStr(newTime),
                  "kpiCode": kpi.id,
                  "nodeId" : node.id,
                  "notes" : null,
                  "numberValue": val,
                  "instance":ins1.label + "," + ins2.label,
                  "quality": 0,
                  "resourceId": 0,
                  "stringValue": null,
                  "value": val,
                  "valueStr": val + ""
                };
                result.push(sampleData);
              };
              for(var i in loadArray[1].data){
                loopInstance2(loadArray[1].data[i]);
              }
            };
            for(var i in loadArray[0].data){
              loopInstance(loadArray[0].data[i]);
            }
          };
          for(var i in kpisDes){
            loopKpis(i, kpisDes[i])
          }
        };
        for(var i in nodesDes){
          loopNodes(nodesDes[i])
        };
        if(typeof callback == "function"){
          callback(result);
        }
      };
      var loop = function(inx, loadType){
        var getEnergyType = function(event){
          var checkFinished = function(){
            var every = loadArray.every(function(elem){
              return typeof elem == "object"
            });
            if(every){
              nextStep();
            }
          };
          if(event.code == 0){
            var rs = [];
            var loop = function(el){
              var some = rs.some(function(itm){
                return itm.label == el.label;
              });
              if(!some){
                rs.push(el)
              }
            }
            for(var i in event.data){
              loop(event.data[i]);
            }
            loadArray[inx] = {
              path : loadType,
              status : "finished",
              data : rs
            };
            checkFinished();
          }
        };
        dictionaryService.getDictValues(loadType, getEnergyType);
      };
      for(var i in loadArray){
        loop(i, loadArray[i])
      }
    };
    var renderData3D = function(){
      var aggr_type;
      var dictionaryService = services.dictionaryService;
      var loadArray = ["energyType", "industryShortType"];
      var nextStep = function(){
        var loopNodes = function(node){
          var loopKpis = function(inx, kpi){
            var loopAggrType = function(atype){
              var loopInstance = function(ins1){
                var loopInstance2 = function(ins2){
                  var range;
                  if(ranges){
                    range = ranges[inx];
                  }
                  var calcRandom = function(range){
                    if(range){
                      var max = range[1];
                      var min = range[0];
                      var ran = (max - min);
                      return Math.round((min + Math.random() * ran) * 10) / 10;
                    } else {
                      return Math.round(Math.random() * 100);
                    }
                  };
                  var val = calcRandom(range);
                  var newTime = timeStamp;
                  var sampleData = {
                    "agentId": "0",
                    "aggregatePeriod":null,
                    "aggregateStatus":null,
                    "aggregateType": atype.valueCode,
                    "arisingTime": timeStampToStr(newTime),
                    "compressCount": 0,
                    "computeTaskId": 0,
                    "dataSerialNumber": 0,
                    "dataTime": null,
                    "insertTime": timeStampToStr(newTime),
                    "kpiCode": kpi.id,
                    "nodeId" : node.id,
                    "notes" : null,
                    "numberValue": val,
                    "instance":ins2.label + "," + ins1.label,
                    "quality": 0,
                    "resourceId": 0,
                    "stringValue": null,
                    "value": val,
                    "valueStr": val + ""
                  };
                  result.push(sampleData);
                };
                for(var i in loadArray[1].data){
                  loopInstance2(loadArray[1].data[i]);
                }
              };
              for(var i in loadArray[0].data){
                loopInstance(loadArray[0].data[i]);
              }
            };
            for(var i in aggr_type){
              loopAggrType(aggr_type[i])
            };
          };
          for(var i in kpisDes){
            loopKpis(i, kpisDes[i])
          }
        };
        for(var i in nodesDes){
          loopNodes(nodesDes[i])
        };
        if(typeof callback == "function"){
          callback(result);
        }
      };
      var loop = function(inx, loadType){
        var getEnergyType = function(event){
          var checkFinished = function(){
            var every = loadArray.every(function(elem){
              return typeof elem == "object"
            });
            if(every){
              nextStep();
            }
          };
          if(event.code == 0){
            var rs = [];
            var loop = function(el){
              var some = rs.some(function(itm){
                return itm.label == el.label;
              });
              if(!some){
                rs.push(el)
              }
            }
            for(var i in event.data){
              loop(event.data[i]);
            }
            loadArray[inx] = {
              path : loadType,
              status : "finished",
              data : rs
            };
            checkFinished();
          }
        };
        dictionaryService.getDictValues(loadType, getEnergyType);
      };
      for(var i in loadArray){
        loop(i, loadArray[i])
      }


      dictionaryService.getDictValues("aggregateType", function(event){
        if(event.code == 0){
          aggr_type = event.data.slice(0,2);
        }
      });
    };
    if(type == "time"){
      renderData();
    } else if(type == "ci"){
      renderData(0);
    } else if(type == "ci_2d"){
      renderData2D();
    } else if(type == "ci_3d"){
      renderData3D();
    };
    return result;
  }*/
});