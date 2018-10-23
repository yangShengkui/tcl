/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var recordlist = data.recordList;
    var getLegend = function() {
      if(recordlist){
        var legend = recordlist.map(function(elem){
          return elem.category;
        });
        return legend;
      } else {
        return [];
      }
    };
    var getSeries = function() {
      var rs = [{
        name : "设备告警",
        data : []
      }];
      if(recordlist){
        rs[0].data = recordlist.map(function(elem){
          return {
            name : elem["category"],
            value : elem["alert_code_count"]
          };
        });
        return rs;
      }else{
        return [{
          name : "设备告警",
          data : [{
            "name" : "设备告警",
            "value" : 0
          }]
        }];
      }
    };
    var result = {
      rawData : data,
      data : {
        legend : getLegend(),
        series : getSeries()
      },
      getLegend : getLegend,
      getSeries : getSeries
    };
    callback(result);
  }
});
