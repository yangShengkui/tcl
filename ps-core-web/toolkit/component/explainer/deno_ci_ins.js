/**
 * Created by leonlin on 16/11/3.
 */
define(["simulate"], function(simulate){
  return function(data, tools, callback) {
    var Info = tools.Info;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instances = data.reduce(function(a,b){
      if(a.indexOf(b.instance) == -1){
        a.push(b.instance);
      }
      return a;
    },[]);
    var simulateFn = tools.simulate;
    var getInfo_back = function(){
      var result = [];
      //var data = simulate("ci", nodesDes, kpisDes, instance, simulateFn);
      var xAxis = [];
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
        return xAxis
      };
      var getxAxis = function(){
        return instances;
      };
      var getSeries = function(){
        return result.map(function(item){
          var obj = {};
          obj.name = item.name.kpi;
          obj.data = item.value.map(function(itm){
            return {
              name : itm.instance,
              value : itm.value
            };
          });
          return obj;
        });
      };
      var loopNodeDes = function(node){
        var loopKpisDes = function(kpi){
          var obj = {
            name :{
              ci : node.label,
              kpi : kpi.label
            },
            value : xAxis.map(function(elem){
              var find = data.find(function(el){
                return elem == el.instance && el.kpiCode == kpi.id && el.nodeId == node.id;
              });
              return find;
            })
          };
          result.push(obj);
        };
        for(var i in kpisDes){
          loopKpisDes(kpisDes[i])
        }
      };
      for(var i in nodesDes){
        loopNodeDes(nodesDes[i])
      };
      callback({
        getLegend : getLegend,
        getxAxis : getxAxis,
        getSeries : getSeries
      });
    };
    Info.get("../localdb/simulate.json", getInfo_back);
  }
});
