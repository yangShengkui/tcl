/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var series = [{
      name : "highlight",
      data : []
    },{
      name : "level0",
      data : []
    },{
      name : "level1",
      data : [],
      searchable : true
    }];
    var getLegend = function(){
      return ["highlight","level0", "level1"];
    };
    var getSeries = function(){
      return series;
    };
    var ary300 = [];
    var ary301 = [];
    var ary302 = [];
    var loop = function(item){
      if (!item.values || !item.values.longitude) return;
      var obj = {};
      obj.label = item.label;
      obj.name = item.values.standardAddress;
      obj.value = [item.values.longitude, item.values.latitude]
      obj.tools = tools;
      if (item.modelId == 300) {
        obj.id = item.id;
        obj.did = item.id;
        ary300.push(obj);
      } else if(item.modelId == 301){
        obj.id = item.id;
        obj.cid = item.id;
        ary301.push(obj);
      } else if(item.modelId == 302){
        obj.id = item.id;
        obj.pid = item.pid;
        ary302.push(obj);
      };
    };
    for (var i in data) {
      loop(data[i]);
    }

    if (ary302.length > 0) {
      series[2].data = ary302;
    } else if (ary301.length > 0) {
      series[2].data = ary301;
    } else {
      series[2].data = ary300;
    }

    if (ary300.length > 0) {
      series[1].data = ary300;
    } else if (ary301.length > 0) {
      series[1].data = ary301;
    } else {
      series[1].data = ary302;
    }

    callback({
      getLegend : getLegend,
      getSeries : getSeries,
      data : {
        series : getSeries()
      }
    });
  }
});
