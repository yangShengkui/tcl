/**
 * Created by leonlin on 16/11/3.
 */
define(['simulate'], function(simulate){
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instance = tools.instance;
    var simulateFn = tools.simulate;
    //var data = simulate("ci", nodesDes, kpisDes, instance, simulateFn);
    var regroup = function(ci, kpi) {
      var rs = [];
      var loop = function(kpi){
        var rs = {
          kpi : kpi,
          children : []
        };
        var findValue = function(ci, kpi) {
          var find = data.find(function(elem){
            return elem.kpiCode == kpi.id && elem.nodeId == ci.id;
          });
          if(find){
            return find.value;
          } else {
            return "-"
          }
        };
        var loop = function(ci){
          return {
            ci : ci,
            value : findValue(ci, kpi)
          };
        };
        for(var i in ci) {
          rs.children.push(loop(ci[i]))
        }
        return rs;
      }
      for(var i in kpi) {
        rs.push(loop(kpi[i]))
      }
      return rs;
    };
    var group = regroup(nodesDes, kpisDes);
    var getSeries = function(formatter){
      var rs = [];
      var loop = function(gr){
        var rs = {
          name : gr.kpi.label,
          data : []
        };
        var loop = function(item){
          var name;
          if(typeof formatter == "function"){
            name = formatter({
              ci : item.ci.label,
              kpi : gr.kpi.label,
              value : item.value
            })
          } else {
            name = gr.kpi.label + "-" + item.ci.label;
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
              ci : item.ci.label,
              kpi : gr.kpi.label,
              value : item.value
            })
          } else {
            name = gr.kpi.label + "-" + item.ci.label;
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
