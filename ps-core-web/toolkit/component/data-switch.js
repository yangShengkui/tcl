/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(element) {
    if(element.type == "text"){
      if(element.hasOwnProperty("attributes")){
        element.$attr("advance/category", "ci");
        element.$attr("advance/condition", ["kpi", "{object:kpiQueryModel}"]);
        element.$attr("data/applied", false);
        //element.$attr("data/applied", element.$attr("attributes/text/data/value")!="none");
        element.$attr("data/text/manual", element.$attr("attributes/text/value"))
        element.$attr("data/text/bind", "(function (source){\n  return source.getSeries();\n})");
        if(element.$attr("attributes/bgcolor/value")){
          element.$attr("style/background-color", element.$attr("attributes/bgcolor/value"));
        }
        if(element.$attr("attributes/bordercolor/value")){
          element.$attr("style/border-color", element.$attr("attributes/bordercolor/value"));
        }
        if(element.$attr("attributes/borderradius/value")){
          element.$attr("style/border-radius", element.$attr("attributes/borderradius/value") + "%");
        }
        if(element.$attr("attributes/borderwidth/applied")){
          element.$attr("style/border-width", element.$attr("attributes/borderwidth/value") + "px");
        }else{
          element.$attr("style/border-width", "0px");
        }
        element.$attr("style/margin", "5px auto");
        if(element.$attr("attributes/borderwidth/value")){
          element.$attr("style/border-style", "solid");
        }
        if(element.$attr("attributes/color/value")){
          element.$attr("style/color", element.$attr("attributes/color/value"));
        }
        if(element.$attr("attributes/fontSize/value")){
          element.$attr("style/font-size", element.$attr("attributes/fontSize/value") + "px");
        }
        if(element.$attr("attributes/height/applied")){
          element.$attr("style/height", element.$attr("attributes/height/value") + "px");
        }
        if(element.$attr("attributes/width/applied")){
          element.$attr("style/width", element.$attr("attributes/width/value") + "px");
        }
        if(element.$attr("attributes/lineheight/value")){
          element.$attr("style/line-height", element.$attr("attributes/lineheight/value") + "px");
        }
        if(element.$attr("attributes/position/value")){
          element.$attr("style/text-align", element.$attr("attributes/position/value"));
        }
      }
    }
    else if(element.type == "linechart") {
      element.type = "echart";
      if(element.hasOwnProperty("attributes")) {
        element.$attr("data/applied", element.$attr("valueGroup/data/value") == "value");
        element.$attr("data/category", ["time"]);
        element.$attr("data/timespan/value", element.$attr("attributes/timespan/value"));
        element.$attr("data/timespan/unit", "hour");
        element.$attr("data/frequency/value", element.$attr("attributes/minTimespan/value"));
        element.$attr("data/frequency/unit", "second");
        element.$attr("data/xAxis/manual", [element.$attr("attributes/xAxis/value").split(",")]);
        element.$attr("echart/yAxis/0/max", element.$attr("attrbutes/max/value"));
        element.$attr("echart/yAxis/0/min", element.$attr("attrbutes/min/value"));
        if(element.$attr("valueGroup/custom/0/attributes/fillType/value") == "area") {
          element.$attr("echart/series/0/areaStyle/normal/color", element.$attr("valueGroup/custom/0/attributes/color/value"));
        }
        if(element.$attr("valueGroup/custom/0/attributes/marker/value") == "none") {
          element.$attr("echart/series/0/markPoint", null);
        }
        if(element.$attr("attributes/title/applied") == false) {
          element.$attr("parameters/title", "");
        }
        if(element.$attr("attributes/subtitle/applied") == false) {
          element.$attr("parameters/subtitle", "");
        }
        element.$attr("advance/category", "time");
        element.$attr("advance/condition", ["kpi", "{object:kpiQueryModel}"]);
        element.$attr("echart/series/0/lineStyle/normal/color", element.$attr("valueGroup/custom/0/attributes/color/value"));
        if(element.data.applied == false){
          element.$attr("data/series", {});
          element.$attr("style/height", "400px");
          element.$attr("echart/series/0/markPoint", {});
          element.$attr("echart/series/1/markPoint", {});
        }
        var loop = function(index, item){
          var boundaryGap = element.$attr("attributes/boundaryGap/value");
          element.$attr("echart/xAxis/0/boundaryGap", boundaryGap);
          if(item.$attr("attributes/fillType/value") == "area"){
            if(item.$attr("attributes/color/value") != ""){
              element.$attr("echart/series/" + index + "/lineStyle/normal/color",  item.$attr("attributes/color/value"));
              element.$attr("echart/series/" + index + "/areaStyle/normal/color",  item.$attr("attributes/color/value"));
            }
          } else if(item.$attr("attributes/fillType/value") == "line"){
            if(item.$attr("attributes/color/value") != ""){
              element.$attr("echart/series/" + index + "/lineStyle/normal/color",  item.$attr("attributes/color/value"));
            }
            element.$attr("echart/series/" + index + "/type", item.$attr("attributes/showType/value"));
            element.$attr("data/series/manual/" + index + "/name", item.$attr("attributes/legend/value"));
            element.$attr("data/series/manual/" + index + "/data", item.$attr("attributes/value/value").split(","));
          }
        };
        for(var i in element.valueGroup.custom){
          loop(i, element.valueGroup.custom[i])
        }
        delete element.attributes;
        delete element.valueGroup;
      }
    }
    else if(element.type == "barchart") {
      element.type = "echart";
      if(element.hasOwnProperty("attributes")) {
        element.$attr("data/applied", element.$attr("valueGroup/data/value") == "value");
        element.$attr("data/category", ["time"]);
        element.$attr("data/timespan/value", element.$attr("attributes/timespan/value"));
        element.$attr("data/timespan/unit", "hour");
        element.$attr("data/frequency/value", element.$attr("attributes/minTimespan/value"));
        element.$attr("data/frequency/unit", "second");
        element.$attr("data/xAxis/manual", [element.$attr("attributes/xAxis/value").split(",")]);
        element.echart.yAxis[0].max = element.$attr("attrbutes/max/value");
        element.echart.yAxis[0].min = element.$attr("attrbutes/min/value");
        if(element.$attr("attributes/title/applied") == false) {
          element.$attr("parameters/title", "");
        }
        if(element.$attr("attributes/subtitle/applied") == false) {
          element.$attr("parameters/subtitle", "");
        }
        element.$attr("advance/category", "time");
        element.$attr("advance/condition", ["kpi", "{object:kpiQueryModel}"]);
        //element.echart.series[0].$attr("lineStyle/normal/color", element.valueGroup.custom[0].$attr("attributes/color/value"));
        if(element.data.applied == false){
          element.$attr("data/series", {});
          element.$attr("style/height", "400px");
          element.$attr("echart/series/0/markPoint", {});
          element.$attr("echart/series/1/markPoint", {});
        }
        var val = [{
          "name" : "设备",
          "data" : typeof element.$attr("attributes/value/value") == "object" ? element.$attr("attributes/value/value").split(",") : []
        }];
        element.$attr("data/series/manual", val);
        delete element.attributes;
        delete element.valueGroup;
      }
    }
    else if(element.type == "piechart") {
      element.type = "echart";
      if(element.hasOwnProperty("attributes")) {
        element.data.category = ["ci"];
        if(element.$attr("attributes/dataType/value") == "alert") {
          element.data.applied = true;
          element.$attr("advance/condition", { kpiCodes : ["alert_code_count"]});
          element.$attr("advance/getfunction", "kpiDataService.getKpiHierarchyValueList");
          element.$attr("advance/category", "alert");
          element.$attr("data/series/bind", "(function (source){\n  return source.alert.getSeries();\n})");
          element.$attr("data/legend/bind", "(function (source){\n  return source.alert.getLegend();\n})");
          element.$attr("advance/condition", ["alert", {category:"ci",
            isRealTimeData:true,
            kpiCodes:["alert_code_count"],
            timePeriod:0}]);
          element.echart.series[0].radius = [0, "65%"];
          element.echart.series[0].center = ["50%", "50%"];
          delete element.attributes;
        } else {
          var series = element.$attr("attributes/value/value").split(",");
          var legend = element.$attr("attributes/legend/value").split(",");
          element.data.applied = false;
          element.$attr("data/series", {});
          element.$attr("data/legend/manual", legend);
          element.$attr("data/series/manual/0/data", series.map(function(elem){
            var inx = series.indexOf(elem);
            return {
              name : legend[inx],
              value : elem
            }
          }));
          element.echart.series[0].radius = [0, "65%"];
          element.echart.series[0].center = ["50%", "50%"];
        }
      }
    }
    else if(element.type == "gaugechart") {
      element.type = "echart";
      if(element.hasOwnProperty("attributes")) {
        element.data.category = ["ci"];
        if(element.$attr("attributes/dataType/value") == "alert") {
          element.data.applied = true;
          element.$attr("advance/condition", { kpiCodes : ["alert_code_count"]});
          element.$attr("advance/getfunction", "kpiDataService.getKpiHierarchyValueList");
          element.$attr("advance/category", "alert");
          element.$attr("data/series/bind", "(function (source){\n  return source.alert.getSeries();\n})");
          element.$attr("data/legend/bind", "(function (source){\n  return source.alert.getLegend();\n})");
          element.$attr("advance/condition", ["alert", {category:"ci",
            isRealTimeData:true,
            kpiCodes:["alert_code_count"],
            timePeriod:0}]);
          delete element.attributes;
        } else {
          var series = element.$attr("attributes/value/value").split(",");
          var legend = element.$attr("attributes/legend/value").split(",");
          element.data.applied = false;
          element.$attr("data/series", {});
          element.$attr("data/legend/manual", legend);
          element.$attr("data/series/manual/0/data", series.map(function(elem){
            var inx = series.indexOf(elem);
            return {
              name : legend[inx],
              value : elem
            }
          }));
          element.echart.series[0].radius = [0, "65%"];
          element.echart.series[0].center = ["50%", "50%"];
        }
        delete element.attributes;
        delete element.valueGroup;
      }
    }
    else if(element.type == "featurechart") {
      element.$attr("parameters/type", 1);
      element.$attr("style", {
        "height" : "400px"
      })
    }
    else if(element.type == "scatterchart") {
      element.type = "echart";
      if(element.hasOwnProperty("attributes")) {
        element.$attr("data/applied", false);
        var valueGroup = element.$attr("valueGroup/custom");
        element.$attr("data/series/manual", []);
        var loop = function(index, item){
          var values = JSON.parse("[" + item.$attr("attributes/value/value") + "]");
          var legend = [item.$attr("attributes/legend/value")];
          element.$attr("data/legend/manual", legend);
          element.$attr("data/series/manual/" + index, {
            name : legend[0],
            data : values
          });
        };
        for(var i in valueGroup){
          loop(i, valueGroup[i])
        };
        element.$attr("parameters/title", "");
        element.$attr("parameters/subtitle", "");
        element.$attr("style/height", "400px");
        element.$attr("echart/series/0/markPoint", {});
        element.$attr("echart/title", "");
        element.$attr("echart/series/0/symbolSize", "function(value){\n return value[1] * 2 > 20 ? 20 : value[1] * 2;\n}");
        element.$attr("echart/series/0/markLine/lineStyle/normal/width", 2);
        element.$attr("echart/series/0/markLine/lineStyle/normal/color", "#000");
        element.$attr("echart/series/0/markLine/lineStyle/normal/type", "solid");
        element.$attr("echart/series/0/markLine/data", [{
          name: '中心线',
          type: 'average'
        },{
          xAxis: 50
        }]);
      }
    }
    else if(element.type == "downTab") {
      if(element.hasOwnProperty("attributes")) {
        element.$attr("data/series/manual", [{
          "data" : [{
            "name" : element.$attr("attributes/subtitle/value"),
            "value" : element.$attr("attributes/title/value")
          }]
        }]);
        element.$attr("advance/category", "ci");
      }
    }
    else if(element.type == "map") {
      element.type = "echart";
      element.category = ["scatter"];
      element.applied = true;
      element.$attr("advance/category", "scatter");
      element.$attr("advance/condition", null);
      element.$attr("data/applied", true);
      element.$attr("data/series/bind", "(function (source){\n  return source.scatter.getSeries();\n})");
      element.$attr("echart/series/0/label/normal/formatter", "(function(value){\n return 'asd'; \n})");
      element.$attr("echart/series/0/symbolSize", "(function(value){\n var val = 10 + value[2];\n return val > 30 ? 30 : val;\n})");
    }
    else if(element.type == "mapchart") {
      element.type = "echart";
      element.$attr("style/height", "400px");
      element.$attr("data/applied", false);
      element.$attr("echart/general/backgroundColor", "#eee");
      element.$attr("echart/geo/itemStyle/normal/color", "#d8b8a6");
      element.$attr("echart/geo/itemStyle/normal/borderColor", "#a37f6b");
    }
    else if(element.type == "mapchartDist") {
      var manualFun = function(){
        var mydata = [{"address":"巢湖电厂","lat":31.608733,"lng":117.88049,"devCount":5, "warnning": 0},
          {"address":"海门发电公司","lat":31.956039,"lng":121.31247,"devCount":1, "warnning": 0, "src" : "../images/ksb/LUV.jpg"},
          {"address":"华能北京热电厂","lat":39.929986,"lng":116.395645,"devCount":3, "warnning": 0, "src" : "../images/ksb/NLT.jpg"},
          {"address":"华能东方电厂","lat":18.998161,"lng":108.85101,"devCount":12, "warnning": 0, "src" : "../images/ksb/SQ.jpg"},
          {"address":"华能福州电厂","lat":26.047125,"lng":119.330221,"devCount":7, "warnning": 3, "src" : "../images/ksb/SEZ.jpg"},
          {"address":"华能金陵电厂","lat":39.925237,"lng":116.420509,"devCount":1, "warnning": 0, "src" : "../images/ksb/SQ.jpg"},
          {"address":"华能洛阳热电","lat":34.657368,"lng":112.447525,"devCount":1, "warnning": 0, "src" : "../images/ksb/HG.jpg"},
          {"address":"华能南京热电有限公司","lat":32.057236,"lng":118.778074,"devCount":4, "warnning": 3, "src" : "../images/ksb/NLT.jpg"},
          {"address":"华能瑞金电厂","lat":25.921831,"lng":115.985867,"devCount":2, "warnning": 2, "src" : "../images/ksb/LUV.jpg"},
          {"address":"华能上安电厂","lat":39.763206,"lng":115.839295,"devCount":2, "warnning": 0, "src" : "../images/ksb/SEZ.jpg"},
          {"address":"华能太仓电厂","lat":31.571904,"lng":121.158978,"devCount":3, "warnning": 0, "src" : "../images/ksb/SQ.jpg"},
          {"address":"华能营口电厂","lat":40.668651,"lng":122.233391,"devCount":4, "warnning": 0, "src" : "../images/ksb/NLT.jpg"},
          {"address":"华能岳阳电厂","lat":29.441833,"lng":113.167978,"devCount":1, "warnning": 0, "src" : "../images/ksb/LUV.jpg"},
          {"address":"淮阴电厂","lat":33.664059,"lng":118.935664,"devCount":1, "warnning": 0, "src" : "../images/ksb/SQ.jpg"},
          {"address":"金陵燃机","lat":39.925237,"lng":116.420509,"devCount":7, "warnning": 0, "src" : "../images/ksb/SEZ.jpg"},
          {"address":"渑池热电","lat":34.839691,"lng":111.802535,"devCount":1, "warnning": 0, "src" : "../images/ksb/HG.jpg"},
          {"address":"汕头电厂","lat":23.383908,"lng":116.72865,"devCount":1, "warnning": 0, "src" : "../images/ksb/SQ.jpg"},
          {"address":"杨柳青电厂","lat":39.144457,"lng":117.013943,"devCount":1, "warnning": 0, "src" : "../images/ksb/LUV.jpg"},
          {"address":"榆社电厂","lat":37.14005,"lng":112.954181,"devCount":1, "warnning": 0, "src" : "../images/ksb/HG.jpg"},
          {"address":"玉环电厂","lat":28.179738,"lng":121.284426,"devCount":2, "warnning": 3, "src" : "../images/ksb/LUV.jpg"},
          {"address":"长兴电厂","lat":30.983353,"lng":119.81942,"devCount":1, "warnning": 1, "src" : "../images/ksb/SQ.jpg"},
          {"address":"中原燃机","lat":34.779474,"lng":113.557281,"devCount":2, "warnning": 0, "src" : "../images/ksb/HG.jpg"}];
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            res.push({
              name: data[i].address,
              value: [data[i].lng, data[i].lat, data[i]['devCount']],
              warning : data[i].warnning,
              src : data[i].src
            });
          }
          return res;
        };
        return [{
          name : '电厂概况',
          data : convertData(mydata)
        }]
      }
      element.type = "echart";
      element.source = "BMAP";
      element.$attr("style/height", "800px");
      element.$attr("data/applied", false);
      element.$attr("data/series/manual", manualFun.toString());
    }
    else if(element.type == "totalItem") {
      if(element.hasOwnProperty("attributes")) {
        if(element.$attr("attributes/color/value")) {
          element.$attr("style/background-color", element.$attr("attributes/color/value"))
        }
        if(element.$attr("attributes/icon/value")) {
          element.$attr("parameters/icon", element.$attr("attributes/icon/value"))
        }
        if(element.$attr("attributes/link/value")) {
          element.$attr("parameters/link", element.$attr("attributes/link/value"))
        }
        element.$attr("data/series/manual", [{
          "data" : [{
            "name" : element.$attr("attributes/subtitle/value"),
            "unit" : element.$attr("attributes/unit/value"),
            "value" : element.$attr("attributes/title/value")
          }]
        }]);
        element.$attr("advance/category", "ci");
        element.$attr("advance/condition", ["kpi", "{object:kpiQueryModel}"]);
        if(element.$attr("attributes/title/data/value") == "value"){
          element.data.applied = true;
        }
      }
    }
    else if(element.type == "box"){
      if(element.hasOwnProperty("attributes")) {
        element.$attr("parameters/title", element.$attr("attributes/text/value"));
      }
    }
    else if(element.type == "progress"){
      if(element.hasOwnProperty("attributes")) {
        element.$attr("advance/category", "ci");
        element.$attr("advance/condition", ["kpi", "{object:kpiQueryModel}"]);
        if(element.$attr("attributes/value/data/value") == "value"){
          element.data.applied = true;
        }
        element.$attr("data/series/manual", [{
          data: [{
            name : element.$attr("attributes/description/value"),
            value : element.$attr("attributes/value/value")
          }]
        }]);
      }
    }
    else if(element.type == "block"){
      if(element.hasOwnProperty("attributes")) {
        element.$attr("style/background-color", element.$attr("attributes/bgcolor/value"));
        element.$attr("style/border-color", element.$attr("attributes/bordercolor/value"));
        element.$attr("style/border-width", element.$attr("attributes/borderwidth/value"));
        element.$attr("style/margin", 0);
      }
    }
    else if(element.type == "sparkline"){
      if(element.hasOwnProperty("attributes")) {
        element.$attr("data/applied", true);
        element.data.timespan.value =  7;
        element.data.timespan.unit = "day";
        element.data.frequency.value = 1;
        element.data.frequency.unit = "day";
        element.$attr("advance/category", "time");
        element.$attr("advance/condition", ["kpi", "{object:kpiQueryModel}"]);
      }
    }
    else if(element.type == "list"){
      element.type = "list";
      element.source = "LIST";
    }
    else if(element.type == "warning"){
      element.source = "WARNING";
    }
    else if(element.type == "resourcelist"){
      element.type = "listTable";
      element.source = "LISTTABLE";
      if(element.$attr("advance/getfunction") == undefined){
        element.$attr("advance/getfunction", "serviceCenterService.resources.getAll")
      }
      if(element.$attr("advance/expression") == undefined){
        var data = [{
          name : "设备名",
          value : "{item:label}",
          type : "text"
        },{
          name : "流量",
          value : "{random:(0,100)} + 'm³ /s'",
          type : "text"
        },{
          name : "进水压力",
          value : "{random:(0,100)} + 'Pa'",
          type : "text"
        },{
          name : "出水压力",
          value : "{random:(0,100)} + 'Pa'",
          type : "text"
        },{
          name : "温度",
          value : "{random:(0,100)} + '℃'",
          type : "text"
        },{
          name : "创建日期",
          value : "{item:createTime}",
          type : "date"
        },{
          name : "健康度",
          value : "{random:(0,100)}",
          type : "progress"
        },{
          name : "当前状态",
          value : "{item:managedStatus}",
          type : "status"
        }];
        var click = function(event){
          console.log(event);
        }
        var rs = {
          "on" : {
            "click" : click.toString()
          },
          "format" : data
        }
        element.$attr("advance/expression", JSON.stringify(rs, null, 2));
      }
    }
    else if(element.type == "echart"){
      if(element.$attr("data/series/manual") == undefined){
        element.$attr("data/series/manual", []);
      }
    }
    else if(element.type == "row"){
      if(!element.hasOwnProperty("source")){
        element.$attr("source", "ROW");
      }
    }
    else if(element.type == "image"){
      if(element.$attr("advance/expression") == undefined){
        element.$attr("advance/expression", {});
      }
    }
    else if(element.type == "datalist"){
      //console.log(element);
      /*
      if(element.$attr("data/applied") == undefined){
        element.$attr("data/applied", false)
      }
      if(element.$attr("data/series/manual") == undefined){
        element.$attr("data/series/manual", []);
      }
      if(element.$attr("data/legend/manual") == undefined){
        element.$attr("data/legend/manual", []);
      }
      if(element.$attr("data/xAxis/manual") == undefined){
        element.$attr("data/legend/manual", []);
      }
      */
    }
    else if(element.type == "topo" || element.type == "topo3d"){
      if(element.hasOwnProperty("advance") && element.$attr("advance/expression")){
       $$.runExpression(element.$attr("advance/expression"), function(funRes) {
          if(funRes.code == "0") {
            var fnResult = funRes.data;
            expression = fnResult ? fnResult : {};
            if (expression.displayModel == "3d") {
              element.type = "topo3d";
            } else {
              if (element.JSON && element.JSON["metadata"]) {
                element.type = "topo3d";
              }
            }
          } else {
            if (element.JSON && element.JSON["metadata"]) {
              element.type = "topo3d";
            }
          }
        });
      } else {
        if (element.JSON && element.JSON["metadata"]) {
          element.type = "topo3d";
        }
      }
    }
    delete element.attributes;
    delete element.valueGroup;
    return element;
  }
});
