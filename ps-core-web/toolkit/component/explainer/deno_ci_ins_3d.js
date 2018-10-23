/**
 * Created by leonlin on 16/11/3.
 */
define(["simulate"], function(simulate){
  return function(data, tools, callback) {
    var Info = tools.Info;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instance = tools.instance;
    var simulateFn = tools.simulate;
    var aggregate_type = tools.aggregate_type;
    var services = {};
    services.dictionaryService = tools.dictionaryService;
    var result = [];
    var simulateBack = function(data){
      services.dictionaryService.getDictValues("aggregateType", function(event){
        if(event.code == 0) {
          var aggregate_type_arr = event.data.filter(function (elem) {
            return aggregate_type.indexOf(elem.valueCode) != -1;
          });
          var getIns = function (inx) {
            var rs = data.reduce(function (a, b) {
              var ins1 = b.instance.split(",")[inx];
              if(a.indexOf(ins1) == -1){
                a.push(ins1);
              }
              return a;
            }, []);
            return rs;
          };
          var getSeriesTemp = function(){
            var rs = aggregate_type_arr.map(function(elem){
              return {
                name : elem.label,
                type : 'bar'
              }
            });
            return rs;
          };
          var baseOption = {
            timeline: {
              axisType: 'category',
              autoPlay: false,
              playInterval: 1000,
              data: getIns(1).map(function(elem){
                return {
                  value : elem,
                  symbolSize : 7
                }
              }),
              label : {
                formatter : function(s){
                  return s;
                }
              }
            },
            title: {

            },
            tooltip: {},
            legend: {
              x: 'right',
              data: aggregate_type_arr.map(function(elem){
                return elem.label;
              }),
              selected: {
                'GDP': false, '金融': false, '房地产': false
              }
            },
            calculable : true,
            grid: {
              top: 80,
              bottom: 100
            },
            xAxis: [
              {
                'type':'category',
                'axisLabel':{'interval':0},
                'data':getIns(0),
                'splitLine': {show: false}
              }
            ],
            yAxis: [
              {
                name: '消耗量(吨)',
                type: 'value'
              },{
                name: '折标量(吨标准煤)',
                type: 'value'
              }
            ],
            series: getSeriesTemp()
          }
          var options = [];
          var loop = function(insName2){
            var option = {
              series : []
            };
            var ins1 = getIns();
            var pushData = function(aggrName){
              var arr = [];
              var ins2 = getIns(0);
              var loopIns = function(insName1){
                var find = data.find(function(elem){
                  return elem.instance == (insName1 + "," + insName2) && elem.aggregateType == aggrName.valueCode;
                });
                return {
                  name : insName2,
                  value : find ? find.value : "-"
                };
              };
              for(var i in ins2){
                arr.push(loopIns(ins2[i]))
              }
              var obj = {
                data : arr
              }
              return obj;
            };
            for(var i in aggregate_type_arr){
              option.series.push(pushData(aggregate_type_arr[i]));
            }
            return option;
          };
          var ins1 = getIns(1);
          for(var i in ins1){
            options.push(loop(ins1[i]));
          }
          var result = {
            baseOption : baseOption,
            options : options,
          };
          var getOption = function(){
            return result;
          };
          callback({
            getOption : getOption
          });
        }
      });
    };
    simulateBack(data);
    //simulate("ci_3d", nodesDes, kpisDes, instance, simulateFn, services, simulateBack);
  }
});
