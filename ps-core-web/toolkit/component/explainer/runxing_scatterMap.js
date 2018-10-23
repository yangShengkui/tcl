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
        name : "highlight",
        data : []
      },{
        name : "level0",
        searchable : true,
        data : []
      }];
      var getSeries = function(){
        return series;
      };
      var getLegend = function(){
        return [];
      };
      var geoCoord = geo.geoCoord;
      var loop = function(item){
        var obj = {}, obj2 = {};
        var city;
        if(item.values.standardAddress){
          city = item.values.standardAddress.split(",")[1];
        };
        if(city){
          var find = series[0].data.find(function(elem){
            return elem.name == city;
          });
          var doms = item.domains;
          doms = doms.replace(/\//g,"|");
          if(!find){
            obj.id = item.id;
            obj.domains = doms;
            obj.label = item.label;
            obj.name = city;
            obj.value = geoCoord[city];
            if(obj.value == undefined){
              obj.value = [item.values.longitude, item.values.latitude];
            };
            series[1].data.push(obj);
            //series[0].data.push(obj);
          };
        }
      };
      for (var i in data) {
        loop(data[i]);
      }
      callback({
        getLegend : getLegend,
        getSeries : getSeries,
        data : {
          series : getSeries()
        }
      });
    })
  }
});
