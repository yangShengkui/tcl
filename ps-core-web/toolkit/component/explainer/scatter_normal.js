/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var series, startTime, endTime;
    var format = tools.format;
    var freq = tools.frequency;
    var getLegend = function(formatter) {
      return group.map(function(elem){
        var name;
        if(typeof formatter == 'function'){
          name = formatter({
            ci : elem.ci.label,
            kpi : elem.kpi.label
          })
        } else {
          name = elem.ci.label + "-" + elem.kpi.label
        }
        return name;
      });
    };
    var regroup = function(ci, kpi) {
      var rs = [];
      for(var i in ci) {
        for(var j in kpi) {
          rs.push({
            ci : ci[i],
            kpi : kpi[j]
          })
        }
      }
      return rs;
    };
    var getResources = function() {
      return nodesDes.map(function(element){
        return element.label;
      });
    };
    var getKpis = function() {
      return kpisDes.map(function(element){
        return element.label;
      });
    };
    var getDataMap = function() {
      return group;
    };
    var getxAxis = function() {
      var xAxis = [];
      var getDate = function(date){
        return $formatDate(date, format);
      };
      if(freq > 0) {
        for(var i = startTime; i < endTime; i += freq) {
          xAxis.push(getDate(new Date(i)));
        }
      } else {
        for(var i in result) {
          xAxis.push(getDate(new Date(result[i].time)));
        }
      }
      if(xAxis.length == 0){
        xAxis.push("-");
      }
      return [xAxis];
    };
    var getSeries = function(formatter) {
      var rs = [];
      for(var i in nodesDes){
        var filter = group.filter(function(elem){
          return elem.ci.label == nodesDes[i].label;
        });
        var arr = [];
        for(var k in filter[0].data){
          var innerArr = [];
          for(var j in filter){
            innerArr.push(filter[j].data[k]);
          }
          arr.push(innerArr);
        }
        console.log(arr);
        rs[i] = {
          name : nodesDes[i].label,
          data : arr
        }
      };
      return rs;
    }
    var group = regroup(nodesDes, kpisDes);
    var result = data.map(function(element){
      var timeStamp = new Date(element.arisingTime).getTime();
      return {
        kpiCode : element.kpiCode,
        nodeId : element.nodeId,
        time : element.arisingTime,
        timeStamp : timeStamp,
        value : element.value,
        picked : false
      }
    });
    var allTimes = result.map(function(elem){
      return elem.timeStamp;
    });
    startTime = Math.min.apply(null,allTimes);
    endTime = Math.max.apply(null,allTimes);
    var getValueList = function(element) {
      var nodeId = element.ci.id;
      var kpiCode = element.kpi.id;
      var filter = result.filter(function(elem){
        return nodeId == elem.nodeId && kpiCode == elem.kpiCode;
      })
      return filter;
    };
    var splitData = function(data){
      var rs = [];
      var compare = function(time) {
        var condition = function(timestamp) {
          var rs =  timestamp >= time && timestamp < (time + freq);
          return rs;
        };
        for(var i in data) {
          if(condition(data[i].timeStamp)) {
            return data[i].value;
          }
        };
        return "-";
      };
      var splitByTime = function() {
        for(var i = startTime; i <= endTime; i += freq){
          rs.push(compare(i))
        }
      };
      var getAllData = function() {
        for(var i in data) {
          rs.push(data[i].value);
        }
      };
      if(freq > 0) {
        splitByTime();
      } else {
        getAllData();
      }
      return rs;
    };
    for(var i in group) {
      group[i].data = splitData(getValueList(group[i]));
    };
    callback({
      rawData : data,
      getLegend : getLegend,
      getResources : getResources,
      getKpis : getKpis,
      getDataMap : getDataMap,
      getxAxis : getxAxis,
      getSeries : getSeries
    });
  }
});
