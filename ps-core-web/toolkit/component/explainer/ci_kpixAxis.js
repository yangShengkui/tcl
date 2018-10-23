/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    console.log(data);
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var regroup = function(ci, kpi) {
      var rs = [];
      var loop = function(ci){
        var obj = {
          name : ci.label,
          data : []
        };
        var loop = function(kpi){
          var find = data.find(function(elem){
            return elem.kpiCode == kpi.id && elem.nodeId == ci.id;
          });
          return find ? find.value : "-";
        };
        for(var i in kpi) {
          obj.data.push(loop(kpi[i]))
        }
        return obj;
      }
      for(var i in ci) {
        rs.push(loop(ci[i]))
      };
      return rs;
    };
    var group = regroup(nodesDes, kpisDes);
    var getxAxis = function(formatter){
      var rs = [kpisDes.map(function(elem){
        return elem.label;
      })];
      return rs;
    }
    var getSeries = function(formatter){
      var rs = [];
      var loop = function(gr){
        var obj = {
          name : gr.name,
          data : gr.data
        };
        rs.push(obj);
      };
      for(var i in group){
        loop(group[i])
      }
      console.log(rs);
      return rs;
    };
    var getLegend = function(formatter) {
      var rs = kpisDes.map(function(elem){
        return elem.label;
      });
      return rs;
    };
    var rs = {
      getSeries : getSeries,
      getxAxis : getxAxis,
      getLegend : getLegend,
      data : {
        nodes : nodesDes,
        kpis : kpisDes,
        legend : getLegend(),
        series : getSeries()
      }
    };
    callback(rs);
  }
});
