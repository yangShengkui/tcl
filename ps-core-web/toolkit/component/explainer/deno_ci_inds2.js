/**
 * Created by leonlin on 16/11/3.
 */
define(['simulate'], function(simulate) {
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instance = tools.instance;
    var simulateFn = tools.simulate;
    //var data = simulate("ci", nodesDes, kpisDes, instance, simulateFn);
    var regroup = function(ci, kpi) {
      var rs = [];
      var loop = function(kpi) {
        var rs = {
          kpi: kpi,
          children: []
        };

        var instanceDic = {};
        for (var ciKey in ci) { //nodeIds
          for (var key in data) { //数据
            if ((data[key].nodeId == ci[ciKey].id) && !instanceDic[data[key].instance]) {
              instanceDic[data[key].instance] = [data[key].instance, ci[ciKey]]; //0 实例；1 node节点
            }
          }
        };
        var findValue = function(ci, kpi) {
          var find = data.find(function(elem) {
            return elem.kpiCode == kpi.id && elem.instance == ci[0] && elem.nodeId == ci[1].id;
          });
          if (find) {
            return find.value;
          } else {
            return "-"
          }
        };
        var loop = function(ci) {
          return {
            ci: ci[1],
            instance: ci[0],
            value: findValue(ci, kpi)
          };
        };

        for (var instance in instanceDic) { //ci为node节点          
          rs.children.push(loop(instanceDic[instance]));
        }
        return rs;
      }
      for (var i in kpi) {
        rs.push(loop(kpi[i]))
      }
      return rs;
    };
    var group = regroup(nodesDes, kpisDes);
    var getSeries = function(formatter) {
      var rs = [];
      var loop = function(gr) {
        var rs = {
          name: gr.kpi.label,
          data: []
        };
        var loop = function(item) {
          var name;
          if (typeof formatter == "function") {
            name = formatter({
              ci: item.ci.label + '-' + item.instance,
              kpi: gr.kpi.label,
              value: item.value
            })
          } else {
            name = gr.kpi.label + "-" + item.ci.label + '-' + item.instance;
          }
          return {
            name: name,
            value: item.value
          }
        };
        for (var i in gr.children) {
          rs.data.push(loop(gr.children[i]));
        }
        return rs;
      };
      for (var i in group) {
        rs.push(loop(group[i]))
      }
      console.log(rs);
      return rs;
    };
    var getLegend = function(formatter) {
      var rs = [];
      var loop = function(gr) {
        var loop = function(item) {
          var name;
          if (typeof formatter == "function") {
            name = formatter({
              ci: item.ci.label + "-" + item.instance,
              kpi: gr.kpi.label,
              value: item.value
            })
          } else {
            name = gr.kpi.label + "-" + item.ci.label + "-" + item.instance;
          }
          return name;
        };
        for (var i in gr.children) {
          rs.push(loop(gr.children[i]));
        }
      };
      for (var i in group) {
        loop(group[i]);
      }
      console.log(rs);
      return rs;
    };
    var rs = {
      getSeries: getSeries,
      getLegend: getLegend,
      data: {
        nodes: nodesDes,
        kpis: kpisDes,
        legend: getLegend(),
        series: getSeries()
      }
    };
    callback(rs);
  }
});