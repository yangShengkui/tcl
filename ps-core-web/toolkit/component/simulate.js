/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(type, nodesDes, kpisDes, instances, ranges, svs, callback) {
    var result = [];
    var date = new Date();
    var services = svs ? svs : {};
    var timeStamp = date.getTime();
    var timeStampToStr = function(timeStamp){
      var nDate = new Date(timeStamp);
      var year = nDate.getFullYear();
      var month = nDate.getMonth();
      var dt = nDate.getDate();
      return year + "-" + month + "-" + dt;
    };
    var renderData = function(index){
      var loopNodes = function(node){
        var loopKpis = function(inx, kpi){
          var renderData = function(instance){
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
            var newTime = timeStamp + index * 30 * 24 * 3600 * 1000;
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
              "quality": 0,
              "resourceId": 0,
              "stringValue": null,
              "value": val,
              "valueStr": val + ""
            };
            if(instance){
              sampleData.instance = instance;
            }
            result.push(sampleData);
          };
          var loopInstances = function(instance){
            renderData(instance);
          };
          if(instances){
            for(var i in instances){
              loopInstances(instances[i])
            }
          } else {
            renderData();
          }
        };
        for(var i in kpisDes){
          loopKpis(i, kpisDes[i])
        }
      };
      for(var i in nodesDes){
        loopNodes(nodesDes[i])
      }
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
      for(var i = 0; i < 8; i++){
        renderData(i)
      }
    } else if(type == "ci"){
      renderData(0);
    } else if(type == "ci_2d"){
      renderData2D();
    } else if(type == "ci_3d"){
      renderData3D();
    };
    return result;
  }
});