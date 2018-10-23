/**
 * Created by leonlin on 16/11/3.
 */
define(["simulate"], function(simulate){
  return function(data, tools, callback) {
    var Info = tools.Info;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instance = tools.instance;
    var simulateFn = tools.simulate;
    var services = {};
    services.dictionaryService = tools.dictionaryService;
    var getInfo_back = function(){
      var result = [];
      var insort = [];
      var simulateBack = function(data){
        var xAxis = [], instances1 = [], instances2 = [];
        var loop = function(item){
          if(xAxis.indexOf(item.instance) == -1){
            xAxis.push(item.instance);
          };
        };
        for(var i in data){
          loop(data[i])
        };
        xAxis = xAxis.sort();
        var getLegend = function(){
          return instances1;
        };
        var getxAxis = function(){
          return [insort];
        };
        var getSeries = function(){
          var rs = result.map(function(item){
            var obj = {};
            obj.total = item.total;
            obj.name = item.name.ins1;
            var n = 0;
            obj.data = item.value.map(function(itm){
              return {
                name : itm.ins2 ? itm.ins2 : "",
                value : itm.value ? itm.value : 0
              }
            });
            return obj;
          });
          return rs;
        };
        var loopNodeDes = function(node){
          var loopKpisDes = function(kpi){
            var loop = function(item){
              var ins1, ins2;
              if(item.instance){
                ins1 = item.instance.split(",")[0];
                ins2 = item.instance.split(",")[1];
                if(instances1.indexOf(ins1) == -1){
                  instances1.push(ins1);
                }
                if(instances2.indexOf(ins2) == -1){
                  instances2.push(ins2);
                }
              }
              if(ins2){
                var find = result.find(function(elem){
                  return elem.name.ci == node.label && elem.name.kpi == kpi.label && elem.name.ins1 == ins1;
                });
                if(find){
                  item.ins2 = ins2 ? ins2 : "企业";
                  var some = find.value.find(function(ele){
                    if(ele){
                      return ele.instance == item.instance;
                    } else {
                      return false;
                    };
                  });
                  var inx = instances2.indexOf(ins2);
                  if(!some){
                    if(inx == 10){

                    }
                    find.value[inx] = item;
                  };
                } else {
                  var obj = {
                    name :{
                      ci : node.label,
                      kpi : kpi.label,
                      ins1 : ins1
                    },
                    value : [],
                    total : 0
                  };
                  var inx = instances2.indexOf(ins2);
                  item.ins2 = ins2;
                  obj.value[inx] = item;
                  result.push(obj);
                }
              };
            };
            for(var i in data){
              loop(data[i])
            };
          };
          for(var i in kpisDes){
            loopKpisDes(kpisDes[i])
          }
        };
        for(var i in nodesDes){
          loopNodeDes(nodesDes[i])
        };
        for(var i in result){
          for(var j=0; j<instances2.length; j++){
            if(result[i].value[j] == undefined){
              result[i].value[j] = {
              };
            }
          }
        }
        for(var i in result[0].value){
          var rs = 0
          for(var j in result){
            if(result[j].value[i]){
              if(result[j].value[i].value){
                rs += result[j].value[i].value;
              }
            }
          };
          for(var j in result){
            if(result[j].value[i]){
              result[j].value[i].total = rs;
            };
          };
        };
        for(var i in result){
          result[i].value = result[i].value.sort(function(a,b){
            return a.total - b.total;
          });
        }
        for(var i in result){
          for(var j=0; j<instances2.length; j++){
            if(insort[j] == undefined){
              if(j == 3){
                console.log(result[i].value[j]);
              }
              if(result[i].value[j].ins2 != undefined){
                insort[j] = result[i].value[j].ins2;
              }
            };
          }
        }
        callback({
          getLegend : getLegend,
          getxAxis : getxAxis,
          getSeries : getSeries
        });
      };
      simulateBack(data);
      //simulate("ci_2d", nodesDes, kpisDes, instance, simulateFn, services, simulateBack);
    };
    Info.get("../localdb/simulate.json", getInfo_back);
  }
});
