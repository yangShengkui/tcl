define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.initController('ExpertCurveCtrl', ['$scope','$rootScope', '$route','resourceUIService', 'kpiDataService', 'SwSocket', 'Info', 'userLoginUIService', 'growl', '$routeParams',
    function($scope,$rootScope,route, resourceUIService, kpiDataService, SwSocket, Info, userLoginUIService, growl, $routeParams) {
      console.info("映泰专家曲线");
      var nodeId;
      if(route.current){
        nodeId = route.current.params.nodeId;
        init();
      }
      else
      {
        $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);
      }
      function locationChangeSuccess(event) {
        if(route.current){
          nodeId = route.current.params.nodeId;
          init();
        }
      }
      $scope.expertCurveHeader = [];
      $scope.MyceliaData = [];

      var info = Info.get("localdb/expertcurve.json", function(info) {
        $scope.expertCurveHeader = info.expertCurveHeader;
        $scope.MyceliaData = info.MyceliaData;
      });

      //获取映泰模型
      function getModel() {
        resourceUIService.getResourceById(nodeId, function(returnObj){
          if (returnObj.code == 0) {
            var modelId = returnObj.data.modelId;
            $scope.nodeIds = [nodeId];
            getKpiData(modelId);
          }
        });
        /*
        resourceUIService.getDevices(function(returnObj) {
          if (returnObj.code == 0) {
            console.log("1Step");
            var modelId = returnObj.data[0].modelId;
            $scope.nodeIds = [returnObj.data[0].id];
            //获取KPI数据
            getKpiData(modelId);
          }
        });
        */
      }

      /**
       * 获取KPI数据
       * 
       */
      var getKpiData = function(modelId) {
        resourceUIService.getKpisByModelId(modelId, function(returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              if (returnObj.data[i].label == "土壤湿度") {
                //土壤湿度
                $scope.soilTemKpi = returnObj.data[i];
                getKpiValueList(4, returnObj.data[i].id);
              } else if (returnObj.data[i].label == "土壤温度") {
                //土壤温度
                $scope.soilTemKpi = returnObj.data[i];
                getKpiValueList(3, returnObj.data[i].id);
              } else if (returnObj.data[i].label == "空气湿度") {
                //湿度
                $scope.airHumKpi = returnObj.data[i];
                getKpiValueList(2, returnObj.data[i].id);
              } else if (returnObj.data[i].label == "空气温度") {
                //温度
                $scope.airTemKpi = returnObj.data[i];
                // $scope.kpiIdArr = [returnObj.data[i].id];
                getKpiValueList(1, returnObj.data[i].id);
              }
            }
          }
        })
      }

      //格式化时间
      var formatDate = function(str) {
        if (str) {
          str = new Date(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      }

      function getKpiValueList(type, kpi) {
        var kpiQueryModel = {
          "statisticType": "",
          "category": "time", //ci 是实时最新当前数据，time 是当前获取到的数据
          "nodeIds": $scope.nodeIds, //设备 ID  List
          "kpiCodes": [kpi], //KPI ID  List
          "isRealTimeData": true, //是否是实时数据
          "timePeriod": 10800000, //获取数据时间周期(3小时)
          "startTime": "", //获取数据开始时间
          "endTime": "", //获取数据结束时间
          "timeRange": "", //暂时没用
          "queryInstances": null
        }

        var p = ["kpi", kpiQueryModel];
        kpiDataService.getKpiHierarchyValueList(p, function(returnObj) {
          if (returnObj.code == 0) {

            var xData = [];
            var yData = [];
            var optionName;
            var referDataTop = [];
            var referDataBottom = [];
            $.each(returnObj.data.fieldLabels, function(arr, value) {
              optionName = value;
            });
            for (var i in returnObj.data.recordList) {
              $.each(returnObj.data.recordList[i], function(arr, value) {
                if (arr != 'category') {
                  yData.push(value);
                } else {
                  xData.push(formatDate(value));
                }
              })
            }
            if (type == 1) { //空气温度
            	for(var m=0;m<yData.length;m++){
            		referDataTop.push(30);
            	}
            	for(var n=0;n<yData.length;n++){
            		referDataBottom.push(20);
            	}
            	console.log();
              var option = getOption(optionName, xData, yData,referDataTop,referDataBottom);
              require(['echarts'], function(echart) {
                var target1 = echart.init($("#airTem")[0]);
                target1.setOption(option);
              })
            } else if (type == 2) { //空气湿度
            	for(var m=0;m<xData.length;m++){
            		referDataTop.push(70);
            	}
            	for(var n=0;n<xData.length;n++){
            		referDataBottom.push(60);
            	}
              var option = getOption(optionName, xData, yData,referDataTop,referDataBottom);
              require(['echarts'], function(echart) {
                var target1 = echart.init($("#airHum")[0]);
                target1.setOption(option);
              })
            } else if (type == 3) { //土壤温度
            	for(var m=0;m<xData.length;m++){
            		referDataTop.push(25);
            	}
            	for(var n=0;n<xData.length;n++){
            		referDataBottom.push(21);
            	}
              var option = getOption(optionName, xData, yData,referDataTop,referDataBottom);
              require(['echarts'], function(echart) {
                var target1 = echart.init($("#soilTem")[0]);
                target1.setOption(option);
              })
            } else if (type == 4) { //土壤湿度
            	for(var m=0;m<xData.length;m++){
            		referDataTop.push(60);
            	}
            	for(var n=0;n<xData.length;n++){
            		referDataBottom.push(50);
            	}
              var option = getOption(optionName, xData, yData,referDataTop,referDataBottom);
              require(['echarts'], function(echart) {
                var target1 = echart.init($("#soilHum")[0]);
                target1.setOption(option);
              })
            }
          }
        });
      }


      /**
       * echarts3 option
       * 
       */
      function getOption(optionName, xData, yData,referDataTop,referDataBottom) {
        var option = {
          title: {
            text: optionName,
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [optionName]
          },
          toolbox: {
            show: true,
            feature: {
              // dataView: { readOnly: false },
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          series: [{
            name: optionName,
            type: 'line',
            data: yData
            // markPoint: {
            //   data: [
            //     { type: 'max', name: '最大值' }
            //   ]
            // },
            // markLine: {
            //   data: [
            //     { type: 'max', name: '最大标准值' },
            //     { type: 'min', name: '最小标准值' }
            //   ]
            // }
          },
          {
            name:'参照曲线上',
            type:'line',
            lineStyle:{
            	normal:{color:'#3C8DBC'},
            },
            data:referDataTop
        },
        {
            name:'参照曲线下',
            type:'line',
            lineStyle:{
            	normal:{color:'#3C8DBC'},
            },
            data:referDataBottom
        }]
        };
        return option;
      }
      
      require.config({
        paths: {
          echarts: '//cdn.bootcss.com/echarts/3.0.0/echarts'
        }
      });

      function init() {
        getModel();
      }
    }
  ]);
});
