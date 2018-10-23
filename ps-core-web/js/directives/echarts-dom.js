define(['directives/directives', 'echarts', 'macarons'], function (directives, echarts, macarons) {
  'use strict';
  directives.initDirective('echarts3Dom', ['$timeout', function ($timeout) {
    return {
      restrict: 'AE',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var myChart;
          var domMain = $element[0];
          var curTheme = 'macarons';
          var option = "";

          function initEcharts() {
            myChart = echarts.init(domMain, curTheme);
            myChart.setOption(option);
            $(window).resize(function () {
              myChart.resize();
            });
          }

          /**
           * 监听Echart数据初始化
           */
          $scope.$on(Event.ECHARTINFOSINIT, function (event, args) {
            if (!$attrs.name || args.name == $attrs.name) {
              option = args.option;
              initEcharts();
            }
          });
          /**
           * 监听Echart数据变化
           */
          $scope.$on('OptionStatusChange', function (event, args) {
            if (!$attrs.name || args.name == $attrs.name) {
              option = args.option;
              myChart.setOption(option);
            }
          });

          function eConsole(param) {
            var mes = '【' + param.type + '】';
            //              if (typeof param.seriesIndex != 'undefined') {
            //                  mes += '  seriesIndex : ' + param.seriesIndex;
            //                  mes += '  dataIndex : ' + param.dataIndex;
            //              }
            //              if (param.type == 'hover') {
            //                  document.getElementById('hover-console').innerHTML = 'Event Console : ' + mes;
            //              }
            //              else {
            //                  document.getElementById('console').innerHTML = mes;
            //              }
            //              console.log(param);
          }

          function initEvent() {
            var ecConfig = require('echarts/config');
            /*
             // -------全局通用
             REFRESH: 'refresh',
             RESTORE: 'restore',
             RESIZE: 'resize',
             CLICK: 'click',
             DBLCLICK: 'dblclick',
             HOVER: 'hover',
             MOUSEOUT: 'mouseout',
             // -------业务交互逻辑
             DATA_CHANGED: 'dataChanged',
             DATA_ZOOM: 'dataZoom',
             DATA_RANGE: 'dataRange',
             DATA_RANGE_HOVERLINK: 'dataRangeHoverLink',
             LEGEND_SELECTED: 'legendSelected',
             LEGEND_HOVERLINK: 'legendHoverLink',
             MAP_SELECTED: 'mapSelected',
             PIE_SELECTED: 'pieSelected',
             MAGIC_TYPE_CHANGED: 'magicTypeChanged',
             DATA_VIEW_CHANGED: 'dataViewChanged',
             TIMELINE_CHANGED: 'timelineChanged',
             MAP_ROAM: 'mapRoam',
             */
            myChart.on(ecConfig.EVENT.CLICK, eConsole);
            //            myChart.on(ecConfig.EVENT.DBLCLICK, eConsole);
            //myChart.on(ecConfig.EVENT.HOVER, eConsole);
            //            myChart.on(ecConfig.EVENT.DATA_ZOOM, eConsole);
            //            myChart.on(ecConfig.EVENT.LEGEND_SELECTED, eConsole);
            //            myChart.on(ecConfig.EVENT.MAGIC_TYPE_CHANGED, eConsole);
            //            myChart.on(ecConfig.EVENT.DATA_VIEW_CHANGED, eConsole);
            //myChart.on(ecConfig.EVENT.PIE_SELECTED, eConsole);
          }
        }
      ]
    }
  }]);

  directives.initDirective('echarts2Dom', ['$timeout', function ($timeout) {
    return {
      restrict: 'AE',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var option;
          var maxZoom = 15;
          $scope.$on(Event.ECHARTMAPINFOSINIT, function (event, args) {
            option = args.option;
            if (args.maxZoom)
              maxZoom = args.maxZoom
          });
          require(['bmap', 'baiduMap'], function (bmap) {
            var myChart;
            var domMain = $element[0];

            function initEcharts() {
              myChart = echarts.init(domMain);
              myChart.setOption(option);
              $(window).resize(function () {
                myChart.resize();
              });

              myChart.on('bmapRoam', function (payload) {
                myChart._model.eachComponent('bmap', function (bMapModel) {
                  var bmap = bMapModel.getBMap();
                  var center = bmap.getCenter();
                  var zoom = bmap.getZoom();
                });
              });
            }

            if (option) {
              initEcharts();
            } else {
              $scope.$on(Event.ECHARTMAPINFOSINIT, function (event, args) {
                option = args.option;
                if (args.maxZoom)
                  maxZoom = args.maxZoom
                initEcharts();
              });
            }
            $scope.$on(Event.ECHARTMAPINFOSCHANGE, function (event, args) {
              option = args.option;
              //          BMapExt.setOption(option, true)
              //refresh();
            });
          })
        }
      ]
    }
  }]);
  /*
  *网关导向图
  */
  directives.initDirective('echarts2GexfDom', ['$timeout', function ($timeout) {
    return {
      restrict: 'AE',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var myChart;
          var domMain = $element[0];
          var option = "";
          var optionData = "";
          var optionObj = "";

          /**
           * 监听Echart数据初始化
           */
          $scope.$on(Event.ECHARTINFOSINIT + "_graph", function (event, args) {
            optionData = args.optionData;
            optionObj = args.optionObj;
          });
          require(['bmap'], function (bmap) {
            function initEcharts() {
              myChart = echarts.init(domMain);
              var arrList = [];
              var gateways = [];
              var gatewaysLink = [];
              var categories = [];
              for (var i in optionData) {
                var obj = {
                  "id": optionData[i].id,
                  "name": optionData[i].name,
                  "symbolSize": i,//用来存放设备数
                  "attributes": {
                    "modularity_class": parseInt(i)
                  }
                };
                gateways.push(obj);
                if (optionObj[optionData[i].id].devices.length > 0) {
                  var devicesArr = optionObj[optionData[i].id].devices;
                  for (var j in devicesArr) {
                    //用来存放链接关系
                    var devicesObj = {
                      "id": "" + devicesArr[j].id + "",
                      "name": null,
                      "source": "" + devicesArr[j].id + "",//子id对应data的id
                      "target": "" + optionData[i].id + "",//父id
                      "lineStyle": {
                        "normal": {}
                      }
                    };
                    var obj2 = {
                      "id": devicesArr[j].id,
                      "name": devicesArr[j].label,
                      "symbolSize": "9",//用来存放设备数
                      "attributes": {
                        "modularity_class": parseInt(i)
                      }
                    };

                    gateways.push(obj2);
                    gatewaysLink.push(devicesObj);
                  }

                }
                categories[i] = {
                  name: '' + optionData[i].name + ''
                };
              }
              gateways.forEach(function (node) {
                node.itemStyle = null;
                node.symbolSize = 10;
                node.value = "tesr4";
                node.category = node.attributes.modularity_class;
                // Use random x, y
                node.x = node.y = null;
                node.draggable = true;
              });
              if (gateways.length > 0) {
                option = {
                  title: {
                    text: '',
                    subtext: '默认布局',
                    bottom: '5px',
                    right: '10px'
                  },
                  tooltip: {"formatter": "{a}"},
                  legend: [{
                    // selectedMode: 'single',
                    data: categories.map(function (item) {
                      return item.name;
                    })
                  }],
                  animation: false,
                  series: [
                    {
                      name: '',
                      type: 'graph',
                      layout: 'force',
                      data: gateways,
                      links: gatewaysLink,
                      categories: categories,
                      roam: true,
                      label: {
                        normal: {
                          position: 'right'
                        }
                      },
                      force: {
                        repulsion: 100
                      }
                    }
                  ]
                };
                myChart.setOption(option);
                $(window).resize(function () {
                  myChart.resize();
                });
              } else {
                var img = $("<img style='width: 100%;height: 100px;position: absolute;top: 35%;' src='../images/noData.svg'/>");
                var text = $("<h4>暂无数据</h4>");
                text.css({
                  width: '100%',
                  textAlign: 'center',
                  position: "absolute",
                  top: "50%",
                  fontWeight: "400",
                  color: '#bdbdbd'
                });
                $('.chart').append(img)
                $('.chart').append(text)
              }
            }
            if (optionData) {
              initEcharts();
            } else {
              $scope.$on(Event.ECHARTINFOSINIT + "_graph", function (event, args) {
                optionData = args.optionData;
                optionObj = args.optionObj;
                initEcharts();
              });
            }
            $scope.$on(Event.ECHARTINFOSINIT + "_graph", function (event, args) {
              optionData = args.optionData;
              optionObj = args.optionObj;
            });
          })
        }
      ]
    }
  }]);
});