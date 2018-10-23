/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var result, group, allTimes;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var series, startTime, endTime;
    var format = tools.format;
    var freq = tools.frequency;
    var aggregate_rule = tools.aggregate_rule;
    var autoFillBlank = tools.autoFillBlank;
    var simulateFn = tools.simulate;
    var resetTime = function(time,freq){
        var date = new Date(time);
        date.setMilliseconds(0);
        if(freq >= 60000) {
          date.setSeconds(0);
          if(freq >= 3600000) {
            date.setMinutes(0); 
            if(freq >= 86400000){
              date.setHours(0); 
            }
          }
        }
        return date.getTime();
    };
    var getTimestamp = function(){
      var xAxis = [];
      if(freq > 0) {
        /*var t8 = 28800000;
        startTime= t8;
        endTime+= t8;*/
        var st = startTime%freq == 0 ? startTime : parseInt(startTime/freq) * freq;
        var et = endTime%freq == 0 ? endTime : (parseInt(endTime/freq)) * freq;
        st = resetTime(startTime,freq);
        et = resetTime(endTime,freq);
        for(var i = et; i > st; i -= freq) {
          xAxis.push(i);
        };
        xAxis.push(st);
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
        var times = getTimestamp();
        xAxis = times.map(function(elem){
          return getDate(new Date(elem));
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
      var compare = function(inx, time) {
        var arr = [];
        var condition = function(timestamp, item) {
          if(timestamp >= time && timestamp < (time + freq)){
            arr.push(item.value);
          };
        };
        for(var i in data) {
          condition(data[i].timeStamp, data[i]);
        };
        if(aggregate_rule == 0){
          if(arr.length > 0){
            //console.log("a", new Date(time));
            rs.push(arr[arr.length - 1]);
          } else {
            //console.log("b", new Date(time));
            if(autoFillBlank){
              if(rs[rs.length - 1] != undefined){
                rs.push(rs[rs.length - 1]);
              } else {
                rs.push("-");
              }
            } else {
              rs.push("-");
            }
          };
        } else if(aggregate_rule == 1){
          if(arr.length > 0){
            rs.push(arr[0]);
          } else {
            if(autoFillBlank){
              if(rs[rs.length - 1] != undefined){
                rs.push(rs[rs.length - 1]);
              } else {
                rs.push("-");
              }
            } else {
              rs.push("-");
            }
          };
        } else if(aggregate_rule == 2){
          if(arr.length > 0){
            var sum = 0;
            for(var j in arr){
              sum += arr[j];
            }
            rs.push( (sum/arr.length).toFixed(2) );
          } else {
            if(autoFillBlank){
              if(rs[rs.length - 1 != undefined]){
                rs.push(rs[rs.length - 1]);
              } else {
                rs.push("-");
              }
            } else {
              rs.push("-");
            }
          };
        }
      };
      var splitByTime = function() {
        var  times = getTimestamp();
        for(var i in times){
          compare(i, times[i])
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
      };
      return rs;
    };
    var init = function(data){
      group = regroup(nodesDes, kpisDes);
      result = data.map(function(element){
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
      allTimes = result.map(function(elem){
        return elem.timeStamp;
      });
      startTime = Math.min.apply(null,allTimes);
      endTime = Math.max.apply(null,allTimes);
      for(var i in group) {
        group[i].data = splitData(getValueList(group[i]));
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
    if(simulateFn){
      require(['simulate_time'], function(simulate){
        init(simulate("time", nodesDes, kpisDes, simulateFn));
      })
    } else {
      init(data);
    }
  }
});
