/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var allInstance = [];
    var regroup = function(ci, kpi) {
      var rs = [];
      var loop = function(item){
        if(allInstance.indexOf(item.instance) == -1){
          allInstance.push(item.instance);
        }
      };
      for(var i in data){
        loop(data[i])
      }
      var loop = function(ci){
        var rs = {
          ci : ci,
          children : []
        };
        var findValues = function(ci, kpi) {
          var rs = []
          for(var i in allInstance){
            var find = data.find(function(elem){
              return elem.kpiCode == kpi.id && elem.nodeId == ci.id && elem.instance == allInstance[i];
            });
            if(find){
              rs.push(find.value);
            } else {
              rs.push("-");
            }
          }
          return rs;
        };
        var loop = function(kpi){
          return {
            kpi : kpi,
            data : findValues(ci, kpi)
          };
        };
        for(var i in kpi) {
          rs.children.push(loop(kpi[i]))
        }
        return rs;
      }
      for(var i in ci) {
        rs.push(loop(ci[i]))
      }
      return rs;
    };
    var group = regroup(nodesDes, kpisDes);
    var getxAxis = function(formatter){
      var rs = [allInstance];
      return rs;
    }
    var getSeries = function(formatter){
      var rs = [];
      var loop = function(gr){
        var loop = function(item){
          var obj = {
            name : gr.ci.label + "-" + item.kpi.label,
            data : item.data
          };
          rs.push(obj);
        };
        for(var i in gr.children){
          loop(gr.children[i]);
        }
      };
      for(var i in group){
        loop(group[i])
      }
      return rs;
    };
    var getLegend = function(formatter) {
      var rs = [];
      var loop = function(gr){
        var loop = function(item){
          var name;
          if(typeof formatter == "function"){
            name = formatter({
              ci : gr.ci.label,
              kpi : item.kpi.label,
              value : item.value
            })
          } else {
            name = gr.ci.label + "-" + item.kpi.label;
          }
          return name;
        };
        for(var i in gr.children){
          rs.push(loop(gr.children[i]));
        }
      };
      for(var i in group){
        loop(group[i]);
      }
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
