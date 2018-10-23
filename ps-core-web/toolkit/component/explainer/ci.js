/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var regroup = function(ci, kpi) {
      var rs = [];
      var loop = function(ci){
        var rs = {
          ci : ci,
          children : []
        };
        var findValue = function(ci, kpi) {
          var find = data.find(function(elem){
            return elem.kpiCode == kpi.id && elem.nodeId == ci.id;
          });
          if(find){
            return find.value ? find.value : 0;
          } else {
            return "-"
          }
        };
        var loop = function(kpi){
          return {
            kpi : kpi,
            value : findValue(ci, kpi)
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
    var getSeries = function(formatter){
      var rs = [];
      var loop = function(gr){
        var rs = {
          name : gr.ci.label,
          data : []
        };
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
          return {
            name : name,
            value: item.value
          }
        };
        for(var i in gr.children){
          rs.data.push(loop(gr.children[i]));
        }
        return rs;
      };
      for(var i in group){
        rs.push(loop(group[i]))
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
