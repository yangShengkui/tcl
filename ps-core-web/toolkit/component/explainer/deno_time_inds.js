/**
 * Created by leonlin on 16/11/3.
 */
define(["simulate"], function(simulate) {
  return function(data, tools, callback) {
    var Info = tools.Info;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instance = tools.instance;
    var simulateFn = tools.simulate;
    var format = tools.format;
    var result = [];
    //var data = simulate("time", nodesDes, kpisDes, instance, simulateFn);
    data = data.map(function(elem) {
      var dt = new Date(elem.arisingTime);
      var year = dt.getFullYear();
      var month = dt.getMonth();
      elem.allMonth = year * 12 + month;
      return elem;
    });
    var xAxis = [];
    var loop = function(item) {
      if (xAxis.indexOf(item.allMonth) == -1) {
        xAxis.push(item.allMonth);
      };
    };
    for (var i in data) {
      loop(data[i])
    };
    xAxis = xAxis.sort();
    var getLegend = function() {
      return nodesDes.map(function(elem) {
        return elem.label;
      })
    };
    var getxAxis = function() {
      var rs = xAxis.map(function(elem) {
        var str = (elem / 12) + "-" + (elem % 12 + 1);
        var time = new Date(parseInt(elem / 12) + "-" + (elem % 12 + 1));
        return time.FormatByString(format);
      });
      return [rs];
    };
    var getSeries = function() {
      var data = result.map(function(item) {
        var clone = item.$clone();
        clone.name = clone.name.ci;
        clone.data = clone.value.map(function(itm) {
          return itm.value;
        });
        return clone;
      });
      if (data.length == 0) {
        data = [{
          name: '',
          data: ''
        }]
      }
      return data;
    };
    var loopNodeDes = function(kpi) {
      var loopKpisDes = function(node) {
        var obj = {
          name: {
            ci: node.label,
            kpi: kpi.label
          },
          value: xAxis.map(function(elem) {
            var find = data.find(function(el) {
              return elem == el.allMonth && el.kpiCode == kpi.id && el.nodeId == node.id;
            });
            return find;
          })
        };
        result.push(obj);
      };
      for (var i in nodesDes) {
        loopKpisDes(nodesDes[i])
      }
    };
    for (var i in kpisDes) {
      loopNodeDes(kpisDes[i]);
    };
    callback({
      result: result,
      getLegend: getLegend,
      getxAxis: getxAxis,
      getSeries: getSeries
    });
  }
});