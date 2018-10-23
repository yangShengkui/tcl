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
      var rs = instance.map(function(elem){
        return elem.label;
      });
      console.log(rs);
      return rs;
    };
    var getxAxis = function(){
      var rs = xAxis.map(function(id){
        var find = instance.find(function(ins){
          return ins.id == id;
        });
        if(find){
          return find.label;
        } else {
          return "-";
        }
      });
      return [rs];
    };
    var getSeries = function(){
      if(result.length == 0){
        console.log(nodesDes, kpisDes, instance);
      };
      var rs = result.map(function(item){
        var clone = item.$clone();
        clone.name = clone.name;
        clone.data = clone.data.map(function(itm){
          return itm;
        });
        return clone;
      });
      console.log(rs);
      return rs;
    };
    var loopNodeDes = function(node){
      var loopInstance = function(ins){
        var rs = [];
        var loopKpiDes = function(kpi){
          var find = data.find(function(el){
            return ins.id == el.instance.id && el.kpiCode == kpi.id && el.nodeId == node.id;
          });
          if(find){
            return find.value;
          } else {
            return 0;
          }
        };
        for(var i in kpisDes){
          rs.push(loopKpiDes(kpisDes[i]));
        };
        var obj = {
          name : ins.label,
          data : [rs]
        };
        result.push(obj);
      };
      for(var i in instance){
        loopInstance(instance[i])
      }
      console.log(result);
    };
    for(var i in nodesDes){
      loopNodeDes(nodesDes[i])
    };
    callback({
      result : result,
      getLegend : getLegend,
      getxAxis : getxAxis,
      getSeries : getSeries
    });
  }
});
