/**
 * Created by leonlin on 16/11/3.
 */
define(['toolkit/date-handler', 'toolkit/value-list-handler'], function(dateHandler, valueListHandler){
  return function(data, tools, callback) {
    var vlh = valueListHandler.init();
    var result, group, allTimes;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var series, startTime, endTime;
    var timeRange = [];
    var format = tools.format;
    var freq = tools.frequency;
    var freqObj = tools.freqObj;
    var timespan = tools.timespan;
    var aggregate_rule = tools.aggregate_rule;
    var autoFillBlank = tools.autoFillBlank;
    var simulateFn = tools.simulate;
    var getDay = function(date){
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var dat = date.getDate();
      console.log(year + "-" + month + "-" + dat);
      return new Date(year + "-" + month + "-" + dat).getTime();
    }
    var getTimestamp = function(){
      var xAxis = [];
      if(freq > 0) {
        for(var i = endTime; i > startTime; i -= freq) {
          xAxis.push(i);
        };
        xAxis.push(startTime);
        xAxis = xAxis.sort(function(a, b){
          return a - b;
        })
      } else {
        for(var i in result) {
          xAxis.push(result[i].time);
        }
      }
      if(xAxis.length == 0){
        xAxis.push("-");
      }
      return xAxis;
    };
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
        var str = date.FormatByString(format);
        return str;
      };
      if(freq > 0) {
        xAxis = vlh.getTimeRange().map(function(elem){
          return getDate(elem.getDate());
        });
      } else {
        for(var i in result) {
          xAxis.push(getDate(new Date(result[i].time)));
        }
      };
      if(xAxis.length == 0){
        xAxis.push("-");
      };
      return [xAxis];
    };
    var getSeries = function(formatter) {
      var rs = group.map(function(elem){
        var name;
        if(typeof formatter == 'function'){
          name = formatter({
            ci : elem.ci.label,
            kpi : elem.kpi.label
          })
        } else {
          name = elem.ci.label + "-" + elem.kpi.label
        }
        if(elem.data.length == 0){
          elem.data = [null];
        }
        return {
          name : name,
          data : elem.data
        };
      });
      return rs;
    }

    var init = function(data){
      var getValueList = function(element) {
        var nodeId = element.ci.id;
        var kpiCode = element.kpi.id;
        var filter = data.filter(function(elem){
          return nodeId == elem.nodeId && kpiCode == elem.kpiCode;
        })
        return filter;
      };
      group = regroup(nodesDes, kpisDes);
      endTime = dateHandler.init();
      startTime = dateHandler.init(endTime.getTimeStamp() - timespan);
      vlh.setTimeRange(startTime, endTime, freqObj);
      vlh.setAutoFillBlank(autoFillBlank);
      vlh.setAggregateRule(aggregate_rule);
      for(var i in group) {
        group[i].data = vlh.aggregateValues(getValueList(group[i]))
      };
      callback({
        rawData : data,
        getLegend : getLegend,
        timestamps : getTimestamp(),
        getResources : getResources,
        getKpis : getKpis,
        getDataMap : getDataMap,
        getxAxis : getxAxis,
        getSeries : getSeries
      });
    };
    //var dt = vlh.generateRandomValueList(nodesDes,kpisDes,'2017-10-18 16:00:00+0800', '2017-10-19 00:00:00+0800', 100, [0,100]);
    //init(dt);
    init(data);
  }
});
