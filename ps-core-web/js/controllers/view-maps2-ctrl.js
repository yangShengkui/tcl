define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.initController('ViewMaps2Ctrl', ['$scope', 'kpiDataService', 'SwSocket', 'Info', 'alertService',
    function($scope, kpiDataService, SwSocket, Info, alertService) {
      console.info("切换布局地图");
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
          formatter: function(obj) {
            return obj.seriesName + ':' + obj.value[2];
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
          name: '告警数',
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
             color: function(val) {
                if (val)
                  return val.value[2]>0?'#d73925':'#e08e0b';
                else
                  return '#e08e0b';
              },
              shadowBlur: 10,
              shadowColor: '#333'
            }
          }
        }]
      };
      var info = Info.get("../localdb/echarts-map.json", function(info) {
        dashboardOption.bmap.mapStyle.styleJson = info.styleJson_blue;
      });
      $scope.$on(Event.CMDBINFOS4MAPINIT, function(event, args) {
        var params = {};
        params.nodeIds = [];
        params.groupKey = 'nodeId';
        dashboardOption.series[0].data = [];
        for (var i in args.option[0]) {
          var obj = args.option[0][i];
          if (obj.values.hasOwnProperty("longitude")) {
            params.nodeIds.push(obj.id);
            var addObj = {
              name: obj.label,
              id: obj.id,
              value: [obj.values.longitude, obj.values.latitude,0]
            };
            dashboardOption.series[0].data.push(addObj);
          }
        }
        params.nodeIds = params.nodeIds.toString();
        //				params.nodeIds="";
        params.states = "0";
        alertService.countFromCache(params, function(returnObj) {
          if (returnObj.code == 0) {
            for (var i in dashboardOption.series[0].data) {
              var obj = dashboardOption.series[0].data[i];
              if (returnObj.data.groupCountMap[obj.id]) {
                obj.value[2] = returnObj.data.groupCountMap[obj.id].total;
              }
            }
            $scope.$broadcast(Event.ECHARTMAPINFOSINIT, {
              "option": dashboardOption
            });
          }
        });
      });
    }
  ]);
  controllers.initController('ViewMaps3Ctrl', ['$scope', '$attrs', '$parse', 'kpiDataService', 'SwSocket', 'Info', 'alertService',
    function($scope, $attrs, $parse, kpiDataService, SwSocket, Info, alertService) {
      console.info("切换布局地图");
      var ngModelGetter = $parse($attrs['ngModel']);
      var zoom = 18;
      if ($attrs['zoom']) {
        zoom = $attrs['zoom'];
      }
      var startPoint = {
        x: 104.114129,
        y: 37.550339
      };
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
          formatter: function(obj) {
            return obj.seriesName;
          }
        },
        bmap: {
          center: [startPoint.x, startPoint.y],
          zoom: zoom,
          roam: true,
          mapStyle: {
            styleJson: []
          }
        },
        series: [{
          name: '位置',
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
              color: '#ff0000',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          }
        }]
      };
      var info = Info.get("../localdb/echarts-map.json", function(info) {
        dashboardOption.bmap.mapStyle.styleJson = info.styleJson_blue;
      });
      $scope.$watch($attrs.ngModel, function(newValue) {
        $scope.init(newValue)
      });
      $scope.init = function(obj) {

        if (obj.values.hasOwnProperty("longitude")) {
          var addObj = {
            name: obj.label,
            id: obj.id,
            value: [obj.values.longitude, obj.values.latitude, 0]
          };
          startPoint.x = obj.values.longitude;
          startPoint.y = obj.values.latitude;
          dashboardOption.bmap.center = [startPoint.x, startPoint.y];
          dashboardOption.series[0].data.push(addObj);
        }

        $scope.$broadcast(Event.ECHARTMAPINFOSINIT, {
          "option": dashboardOption
        });
      };
    }
  ]);

});