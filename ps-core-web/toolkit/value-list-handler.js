/**
 * 数据聚合器
 */
define(['toolkit/date-handler'], function(dateHandler){
  var valuelistHandler = {};
  valuelistHandler.init = function(valueList){
    var valueList = [], startTime, endTime, freqObj, autoFillBlank = true, aggregate_rule = 0, timeRange = [];
    var randomValue = function(range){
      var min = range[0];
      var max = range[1];
      return (min + Math.random() * (max-min)).toFixed(2);
    };
    function ValuelistHandler(vlist){
      valueList = vlist;
    };
    ValuelistHandler.prototype.setTimeRange = function(st, et, freq){
      startTime = st;
      endTime = et;
      freqObj = freq;
      var inx = 0;
      if (!freqObj) return
      if(freqObj.unit == "month"){
        startTime = dateHandler.init(startTime.trimmToMonth());
        endTime =  dateHandler.init(endTime.trimmToMonth());
        while(startTime.before(endTime)){
          timeRange.push(startTime);
          startTime = startTime.addMonth(freqObj.value);
          inx++;
          if(inx > 5000){
            break;
          }
        };
      } else if(freqObj.unit == "day"){
        startTime = dateHandler.init(startTime.trimmToDate());
        endTime =  dateHandler.init(endTime.trimmToDate());
        while(startTime.before(endTime)){
          timeRange.push(startTime);
          startTime = startTime.addDay(freqObj.value);
          inx++;
          if(inx > 5000){
            break;
          }
        };
      } else if(freqObj.unit == "hour"){
        startTime = dateHandler.init(startTime.trimmToHour());
        endTime =  dateHandler.init(endTime.trimmToHour());
        while(startTime.before(endTime)){
          timeRange.push(startTime);
          startTime = startTime.addHour(freqObj.value);
          inx++;
          if(inx > 5000){
            break;
          }
        };
      } else if(freqObj.unit == "minute"){
        startTime = dateHandler.init(startTime.trimmToMinute());
        endTime =  dateHandler.init(endTime.trimmToMinute());
        while(startTime.before(endTime)){
          timeRange.push(startTime);
          startTime = startTime.addMinute(freqObj.value);
          inx++;
          if(inx > 5000){
            break;
          }
        };
      } else if(freqObj.unit == "second"){
        startTime = dateHandler.init(startTime.trimmToSecond());
        endTime =  dateHandler.init(endTime.trimmToSecond());
        while(startTime.before(endTime)){
          timeRange.push(startTime);
          startTime = startTime.addSecond(freqObj.value);
          inx++;
          if(inx > 5000){
            break;
          }
        };
      };
      if(inx > 5000){
        throw new Error("采样周期过大或采样频率过密，请适当调整周期频率到合理范围");
      }
    };
    ValuelistHandler.prototype.setAutoFillBlank = function(autofb){
      autoFillBlank = autofb;
    };
    ValuelistHandler.prototype.setAggregateRule = function(ar){
      aggregate_rule = ar;
    };
    ValuelistHandler.prototype.getTimeRange = function(){
      return timeRange;
    };
    ValuelistHandler.prototype.aggregateValues = function(valueList){
      rs = [];
      var getValueWithin = function(st, et){
        var findWithIn = valueList.filter(function(elem){
          var timeStamp = new Date(elem.arisingTime).getTime();
          var rs;
          if(et){
            rs = timeStamp >= st.getTimeStamp() && timeStamp < et.getTimeStamp();
          } else {
            rs = timeStamp >= st.getTimeStamp();
          };
          return rs;
        });
        var sum = 0;
        for(var i in findWithIn){
          sum += findWithIn[i].value;
        }
        var aggr;
        if(findWithIn.length > 0){
          if(aggregate_rule == 0){
            aggr = findWithIn[0].value;
          } else if(aggregate_rule == 1){
            aggr = findWithIn[findWithIn.length - 1].value;
          } else if(aggregate_rule == 2){
            aggr = sum / findWithIn.length;
          }
        } else {
          aggr = "-"
        };
        return aggr;
      };
      var splitByTime = function() {
        var inx = 0;
        var repeat = function(inx){
          if(timeRange[inx]){
            rs.push(getValueWithin(timeRange[inx], timeRange[inx+1]));
            repeat(inx + 1);
          }
        };
        repeat(inx);
        var fillBlank = function(rs){
          var result = [];
          for(var i in rs){
            result[i] = rs[i];
          }
          var loopNoEmptyItem = function(i){
            var length = 0;
            var start = parseFloat(rs[i]);
            var end, step;
            for(var j = i + 1; j < rs.length; j++){
              if(rs[j] != "-"){
                end = parseFloat(rs[j]);
                break;
              } else {
                length++;
              }
            };
            if(end){
              step = (end - start) / (length + 1);
              var inx = 1;
              for(var j = i + 1; j < i + length + 1; j++){
                result[j] = parseFloat((start + step * inx).toFixed(2));
                inx++;
              }
            }
          }
          for(var i = 0; i<rs.length; i++){
            if(rs[i] != "-"){
              loopNoEmptyItem(i)
            }
          }
          return result;
        };
        if(autoFillBlank){
          rs = fillBlank(rs);
        };
      };
      splitByTime();
      return rs;
    };
    ValuelistHandler.prototype.generateRandomValueList = function(nodeIds, kpiIds, startTime, endTime, number, rng){
      var rs = [];
      var range = rng || [0,100];
      var timeRange = [];
      var st = dateHandler.init(startTime);
      var et = dateHandler.init(endTime);
      var step = et.minus(st) / number;
      while(st.before(et)){
        timeRange.push(st.clone());
        st.addTimeStamp(step)
      };
      var loopNodeKpi = function(node, kpi){
        Array.prototype.push.apply(rs,timeRange.map(function(date){
          var val = randomValue(range);
          return {
            "agentId": "0",
            "aggregatePeriod":null,
            "aggregateStatus":null,
            "aggregateType": null,
            "arisingTime": date.getDateString(),
            "compressCount": 0,
            "computeTaskId": 0,
            "dataSerialNumber": 0,
            "dataTime": null,
            "insertTime": date.getDateString(),
            "kpiCode": typeof kpi == "object" ? kpi.id : kpi,
            "nodeId" : typeof node == "object" ? node.id : node,
            "notes" : null,
            "numberValue": parseFloat(val),
            "quality": 0,
            "resourceId": 0,
            "stringValue": null,
            "value": parseFloat(val),
            "valueStr": val + ""
          };
        }));
      }
      for(var i in nodeIds){
        for(var j in kpiIds){
          loopNodeKpi(nodeIds[i], kpiIds[j]);
        }
      };
      return rs;
    };
    var rs = new ValuelistHandler(valueList);
    return rs;
  };
  return valuelistHandler;
});
