/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var par = "../localdb/echarts-map.json";
    tools.Info.get(par, function(geo){
      var series = [{
        data : []
      },{
        data : []
      }];
      var getSeries = function(){
        return series;
      };
      var geoCoord = geo.geoCoord;
      var citys = {
        "北京市": 0
      };
      for (var city in data) {
        if (city) {
          var arr = city.split(",");
          if (arr[0].indexOf("市") > -1) {
            if (citys[arr[0]])
              citys[arr[0]] = citys[arr[0]] + data[city];
            else
              citys[arr[0]] = data[city];
          } else if (arr.length > 1) {
            citys[arr[1]] = data[city];
          }
        } else {
          citys["北京市"] = citys["北京市"] + data[""]
        }
      }
      for (var city in citys) {
        var obj = {};
        obj.name = city;
        obj.value = geoCoord[city];
        if (obj.value) {
          obj.value.push(citys[city]);
        }
        series[0].data.push(obj);
        if (series[0].data.length < 5) {
          series[1].data.push(obj);
        }
      }
      callback({
        getSeries : getSeries,
        data : {
          series : getSeries()
        }
      });
    });
  }
});
