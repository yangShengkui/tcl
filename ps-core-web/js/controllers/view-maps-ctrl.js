define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.controller('ViewMapsCtrl', ['$scope', 'kpiDataService', 'SwSocket', 'Info', 'alertService', 'userLoginUIService', 'resourceUIService',
    function($scope, kpiDataService, SwSocket, Info, alertService, userLoginUIService, resourceUIService) {
      var baseoption;

      var dashboardOption = {
        backgroundColor: '#404a59',
        title: {
          text: '',
          subtext: '',
          sublink: '',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter:function(obj) {
            return obj.seriesName+':'+obj.value[2]; 
          }
        },
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: []
          }
        },
        series: [{
          name: '运行设备数',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: [],
          symbolSize: function(val) {
            if (val)
              return val[2]>20?20:(val[2]<10?10:val[2]);
            else
              return 0;
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ffffff'
            }
          }
        }, {
          name: '运行设备数',
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: [],
          symbolSize: function(val) {
            if (val)
              return val[2]>20?20:(val[2]<10?10:val[2]);
            else
              return 0;
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#e1cd0a',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        }]
      };

      var init = function() {
        resourceUIService.statDeviceByStandardAddress(function(returnObj) {
          var citys = {
//          "北京市": 0
          };
          if (returnObj.code == 0) {
            for (var city in returnObj.data) {
              if (city) {
                var arr = city.split(",");
                if (arr[0].indexOf("市") > -1) {
                  if (citys[arr[0]])
                    citys[arr[0]] = citys[arr[0]] + returnObj.data[city];
                  else
                    citys[arr[0]] = returnObj.data[city];
                } else if (arr.length > 1) {
                  citys[arr[1]] = returnObj.data[city];
                }
              } else {
//              citys["北京市"] = citys["北京市"] + returnObj.data[""]
              }
            }
            for (var city in citys) {
              var obj = {};
              obj.name = city;
              obj.value = baseoption.geoCoord[city];
              if (obj.value) {
                obj.value.push(citys[city]);
              }
              dashboardOption.series[0].data.push(obj);
              var topcount = 5;
              if (baseoption.topCount) topcount = baseoption.topCount;
              if (dashboardOption.series[0].data.length <= topcount) {
                dashboardOption.series[1].data.push(obj);
              }
            }
            $scope.$broadcast(Event.ECHARTMAPINFOSINIT, {
              "option": dashboardOption,
            });
          }
        });
      }
     
      var info = Info.get("../localdb/echarts-map.json", function(info) {
        baseoption = info;
        dashboardOption.bmap.mapStyle.styleJson = baseoption.styleJson_dark;

        init();
      });
    }
  ]);
});