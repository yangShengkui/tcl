define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewEmcsCtrl', ['$scope', '$filter', '$location', '$routeParams', '$timeout', 'viewFlexService',
    'kpiDataService', 'resourceUIService', 'growl', 'userLoginUIService', 'userDomainService', '$route', 'SwSocket', 'Info', 'unitService',
    function($scope, $filter, $location, $routeParams, $timeout, viewFlexService, kpiDataService, resourceUIService, growl, userLoginUIService, userDomainService, route, SwSocket, Info, unitService) {
      console.log("进入设备监控视图");
      $scope.deviceView = null;
      $scope.selectedDevicetitem;
      $scope.kpis = [];
      $scope.timePeriod = "10";
      $scope.domainListDic = {};
      $scope.kpiSearch = "";
      $scope.domainsAry = [];
      $scope.defaultDomain = [];
      $scope.tableDataLoading = false;
      $scope.chartData = null; //Chart图数据
      $scope.tableData = {}; //Table表格数据
      $scope.uuid = Math.uuid(); //kpi指标值uuid
      $scope.erroruuid = Math.uuid(); //设备故障的uuid
      $scope.domainStates = false; //控制显示隐藏域
      $scope.gateData = []; //网关
      $scope.selectedRadioId = null; //選中的kpi指標
      $scope.queryDitem = {}; //查询条件
      $scope.kpiDef = {}; //KPI定义
      $scope.deviceswitchflg = 0; //设备默认显示列表
      $scope.kpiswitchflg = 0; //KPI默认显示列表
      $scope.openOrClose = 0; //WS默认关闭
      //    var target = echarts.init($("#linedataview")[0]);
      var colorArray;
      $scope.times = null;

      $scope.hideBtn = "";
      if($routeParams.show == "false"){
          $scope.hideBtn = false;
      }else{
          $scope.hideBtn = true ;
      }

      var path = "../localdb/info.json";
      Info.get(path, function(info) {
        colorArray = info.emcsAlertColorDic;
        $scope.times = info.emcsSetTime;
      });

      var kpiQueryModel = {
        "statisticType": "",
        "category": "time", //ci 是实时最新当前数据，time 是当前获取到的数据
        "nodeIds": [], //设备 ID  List
        "kpiCodes": [], //KPI ID  List
        "isRealTimeData": true, //是否是实时数据
        "timePeriod": "", //获取数据时间周期
        "startTime": "", //获取数据开始时间
        "endTime": "", //获取数据结束时间
        "timeRange": "", //暂时没用
        "queryInstances": null
      };

      //初始化所有的数据
      function initAllData(s) {
        if(s == 'a') {
          $scope.deviceView = [];
          $scope.kpis = [];
          $scope.selectedKpi = null;
          $scope.selectedDevicetitem = null;
          $scope.deviceView = null;
          if(jQuery("#devicecollapse").find(".fa.fa-plus").length == 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
          }
          $scope.kpis = null;
          if(jQuery("#kpicollapse").find(".fa.fa-plus").length == 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#kpicollapse"));
          }
          if(jQuery("#viewcollapse").find(".fa.fa-plus").length == 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewcollapse"));
          }
        } else if(s == 'b') {
          $scope.kpis = [];
          $scope.selectedKpi = null;
        }
        initHistory();
        $scope.timePeriod = "10";
        $scope.tableData = {
          "name": "",
          "unit": "",
          "data": []
        };
      };

      /**
       * 根据输入的时间获取实时的历史数据
       */
      $scope.getRealTimeHistoryData = function() {
        getData();
      };

      /**
       * 获取历史数据
       */
      var getData = function() {
        if(!$scope.selectedDevicetitem) return;
        var id = $scope.selectedDevicetitem.id;
        kpiQueryModel.nodeIds = [id];
        kpiQueryModel.kpiCodes = $scope.kpiData.idArray;
        kpiQueryModel.category = "time";
        kpiQueryModel.timePeriod = resourceUIService.getMSvalue(0, $scope.selectedKpi) * $scope.timePeriod;
        //      if ( kpiQueryModel.timePeriod / resourceUIService.getMSvalue(0,$scope.selectedKpi) > 5000) {
        //        growl.warning("非常抱歉，您当前获得的数据条数过大，为了能够获得最佳显示效果，请选择更小的条数。",{});
        //        return;
        //      }
        var p = ["kpi", kpiQueryModel];

        //新接口
        $scope.tableDataLoading = true;
        kpiDataService.getValueList(p, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.tableDataLoading = false;
            //初始化图表数据
            initHistory();
            $scope.tableData = {
              "name": "",
              "unit": "",
              "data": []
            };
            $scope.chartData = {
              "xData": [],
              "series": {
                "name": "",
                "type": "line",
                "data": []
              }
            };
            //历史数据table数据的展示
            if(returnObj.data.length != 0) {
              formatData(returnObj.data);
            }
          }
        });
      };

        

      /**
       * 处理单选按钮选中事件
       * @param kpi
       */
      $scope.selectedRadio = function(kpi) {
        if(jQuery("#viewcollapse").find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewcollapse"));
        }
        setTimeout(function() {
          $('.content-wrapper').scrollTop(1000000)
        }, 500);
        $scope.selectedKpi = kpi;
        $scope.selectedRadioId = parseInt(kpi.id);
        $scope.kpiData.idArray = [$scope.selectedRadioId];

        //获取数据
        getData();
      };

      //定义EChart option
      var getOption = function(chartData) {
        return {
          title: {
            text: '',
            subtext: '',
            x: 'center',
            y: 'top'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              params = params[0];

              var date = params.name;
              var value = params.value || params.value == 0 ? params.value : '';
              var name = chartData.series.name ? chartData.series.name : '';
              return date ? date + '<br>' + name + ' : ' + value : '没有数据';
            }
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: chartData.xData //[]
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: chartData.series //{name:'',type:'',data:[]}
        };
      };

      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        datestr = $filter('date')(datestr, 'yyyy-MM-dd HH:mm:ss');
        return datestr;
      };

      /**
       * 格式化返回历史数据
       * @param data
       */
      function formatData(data) {
        //chart图数据
        var chartData = {
          "xData": [],
          "series": {
            "name": "",
            "type": "line",
            "data": []
          }
        };
        //表格数据
        var tableData = {
          "name": "",
          "unit": "",
          "data": []
        };

        //处理图表数据，遍历出xData,series.data
        data.forEach(function(e) {
          chartData.xData.push(formatDate(e.arisingTime));
          chartData.series.data.push(e.value);
          var rangeObj = null;
          $scope.kpis.forEach(function(f) {
            if(f.id == e.kpiCode) {
              chartData.series.name = f.label;
              tableData.name = f.label;
              tableData.unit = f.unit;
              if(f.rangeObj)
                rangeObj = f.rangeObj;
            }
          });
          //Table表格数据
          tableData.data.push({
            "name": formatDate(e.arisingTime),
            "value": e.value
          });
        });
        $scope.$broadcast('OptionStatusChange', {
          option: getOption(chartData)
        });
        //      target.setOption(getOption(chartData));

        //聚合Chart数据
        $scope.chartData = chartData;
        //聚合Table表格展示的数据
        tableData.data.reverse();
        $scope.tableData = tableData;
      }

      /**
       * 格式化kpi值
       * @param r = range
       * @param v = value
       */
      function formatKpiValue(r, v) {
        if(r == null || r == undefined || r == '') {
          return v;
        }

        if(r.indexOf('{') > -1 && r.indexOf(':') > -1) { //说明返回的是json格式
          try {
            r = JSON.parse(r);
            v = r[v];
          } catch(e) {
            console.log("返回值不是标准对象，在转换JSON时报错: " + e);
          }
        }
        return v;
      }

      function isJson(r) {
        var regExp = /\{|\[.*\}|\]/;
        var find = regExp.test(r);
        return find;
      }

      /**
       * 获取当前的kpi数据值
       * @param kpi
       */
      function getCurrentKpiData(kpi) {
        $scope.kpis = $scope.kpiDef[$scope.selectedDevicetitem.modelId];
        var id = $scope.selectedDevicetitem.id;
        var uuid = $scope.uuid;
        var callback = function(evendata) {
          for(var i in $scope.kpis) {
            if($scope.kpis[i].id == evendata.data.kpiCode) {
              $scope.$apply(function() {
                //实时更新KPI值
                $scope.kpis[i].value = formatKpiValue($scope.kpis[i].range, evendata.data.value);
                $scope.kpis[i].time = formatDate(evendata.data.arisingTime)
                //根据选中的KPI，如果没有数据，则初始化name，unit
                if($scope.kpiData.idArray.length != 0 && $scope.chartData.series.name == "" && $scope.selectedRadioId == evendata.data.kpiCode) {
                  $scope.chartData.series.name = $scope.kpis[i].label;
                  $scope.tableData.name = $scope.kpis[i].label;
                  $scope.tableData.unit = $scope.kpis[i].unit;
                }
              });
            }
          }

          //实时更新选中的KPI的图表
          if($scope.kpiData.idArray.length != 0 && $scope.kpiData.idArray[0] == evendata.data.kpiCode) {
            //chart展示
            $scope.chartData.xData.push(formatDate(evendata.data.arisingTime));
            $scope.chartData.series.data.push(evendata.data.value);
            $scope.$broadcast('OptionStatusChange', {
              option: getOption({
                "xData": $scope.chartData.xData,
                "series": $scope.chartData.series
              })
            });
            //          target.setOption(getOption({
            //            "xData": $scope.chartData.xData,
            //            "series": $scope.chartData.series
            //          }));

            //table表格展示
            var obj = {
              "name": formatDate(evendata.data.arisingTime),
              "value": evendata.data.value
            };
            $scope.$apply(function() {
              $scope.tableData.data.unshift(obj);
            });
          }
        };

        var kpiIds = [];
        $scope.kpis.forEach(function(e) {
          e.value = "";
          e.valueStr = "";
          kpiIds.push(e.id);
        });

        kpiQueryModel.nodeIds = [id];
        kpiQueryModel.kpiCodes = kpiIds;
        kpiQueryModel.category = "ci";
        kpiQueryModel.timePeriod = '0';
        kpiQueryModel.includeInstance = true;
        var p = ["kpi", kpiQueryModel];
        kpiDataService.getValueList(p, kpiDataCallback);

        function kpiDataCallback(returnObj) {
          if(0 == returnObj.code) {
            var data = returnObj.data;
            data.forEach(function(e) {
              for(var i in $scope.kpis) {
                if(e.kpiCode == $scope.kpis[i].id) {
                  if($scope.kpis[i].rangeObj)
                    $scope.kpis[i].value = $scope.kpis[i].rangeObj[e.value];
                  else
                    $scope.kpis[i].value = e.value;
                  $scope.kpis[i].time = formatDate(e.arisingTime)
                }
              }
            });
            if("WebSocket" in window) {
              var param = {
                ciid: p[1].nodeIds.toString(),
                kpi: p[1].kpiCodes.toString()
              };
              var operation = "register";
              if($scope.openOrClose == 1){
                  //注册WebSocket
                  SwSocket.register(uuid, operation, callback);

                  //webSocket发送请求
                  SwSocket.send(uuid, operation, 'kpi', param);
              }else{
                      SwSocket.unregister(uuid);
              }
            } else {
              growl.warning("您的浏览器不支持WebSocket.", {});
            }
          }
        };

        /**
         * 注销scope时注销方法heartBeat，回调函数callback
         */
        $scope.$on("$destroy", function() {
          console.log("on-destroy, uuid" + uuid);
          SwSocket.unregister(uuid);
        });
      };

      /**
       * 监听设备故障返回值数据处理
       */
      function errorCallback(eventData) {
        if(eventData.data.instance) return;
        for(var i in $scope.deviceView) {
          if(eventData.data.nodeId == $scope.deviceView[i].id) {
            if(colorArray[eventData.data.value] != undefined) {
              $scope.deviceView[i].color = colorArray[eventData.data.value].color;
            }
            $scope.deviceView[i].alertCode = eventData.data.value;
            break;
          } else if(eventData.data.value <= 0 && eventData.data.nodeId == $scope.deviceView[i].id) {
            delete $scope.deviceView[i].color;
            delete $scope.deviceView[i].alertCode;
            break;
          }
        }
        $scope.$apply();
      };

      /**
       * 获取设备的异常
       * @param deviceview
       */
      $scope.getDeviceError = function(deviceview) {
        var nodeIds = [];
        var uuid = $scope.erroruuid;
        $scope.deviceView.forEach(function(e) {
          nodeIds.push(e.id);
          e.alertCode = 10; //设置默认故障状态如果等于10就是默认无数据状态
        });
        kpiQueryModel.timePeriod = 0;
        kpiQueryModel.category = "ci";
        kpiQueryModel.nodeIds = nodeIds;
        kpiQueryModel.kpiCodes = [999999];
        kpiQueryModel.includeInstance = true;
        var p = ["kpi", kpiQueryModel];

        kpiDataService.getValueList(p, function(returnObj) {
          if(0 == returnObj.code) {
            var errorData = returnObj.data;
            errorData.forEach(function(e) {
              for(var i in $scope.deviceView) {
                if($scope.deviceView[i].id == e.nodeId) {
                  if(colorArray[e.value] != undefined) {
                    $scope.deviceView[i].color = colorArray[e.value].color;
                  }
                  $scope.deviceView[i].alertCode = e.value;
                  break;
                }
              }
            });

            //监听websocket
            if("WebSocket" in window) {
              var param = {
                ciid: nodeIds.toString(),
                kpi: '999999'
              };
              var operation = "register";
              if($scope.openOrClose == 1){
                  //注册WebSocket
                  SwSocket.register(uuid, operation, errorCallback);

                  //webSocket发送请求
                  SwSocket.send(uuid, operation, 'kpi', param);
              }else{
                  SwSocket.unregister(uuid);
              }
            } else {
              growl.warning("您的浏览器还不支持WebSocket", {});
            }

          }
        });

        /**
         * 注销scope时注销方法heartBeat，回调函数callback
         */
        $scope.$on("$destroy", function() {
          SwSocket.unregister(uuid);
        });
      };

      /**
       * gotoDeviceView 跳转设备视图
       */
      $scope.gotoDeviceView = function(item) {
        location.href = "#/configAlert/" + item.id + "/node";
      };

      /**
       * 获取icon
       * @param random
       * @returns 
       */
      var getIcon = function(random) {
        var icon;
        switch(true) {
          default: icon = "ion ion-ios-color-filter";
        }
        return icon;
      };

      /**
       * 扩展域的信息
       * @param {Object} obj
       * @param {Object} idx
       */
      var initDomainAtts = function(obj, idx) {
        obj.id = obj.id ? obj.id : 0;
        obj.domainID = obj.domainID ? obj.domainID : 0;
        obj.domainPath = obj.domainPath ? obj.domainPath : "";
        obj.domainName = obj.domainName ? obj.domainName : "";
        obj.description = obj.description ? obj.description : "";
        obj.count = 0;
        var random = Math.random();
        //      obj.icon = getIcon(random);
        obj.alertlv = "bg-green"; //random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
        obj.isLoaded = 0;
        obj.type = 1;
        obj.label = obj.name ? obj.name : "";
        obj.createTime = obj.createTime ? formatDate(obj.createTime) : "";
        return obj;
      };

      var getResourcehandler = function() {
        getCurrentKpiData($scope.selectedDevicetitem);
        initHistory();
        $scope.tableData = null;
      }

      /**
       * 查询设备列表 
       */
      $scope.goSearch = function() {
        initAllData("a");
        var queryDitem = jQuery.extend({}, $scope.queryDitem, true);
        queryDitem.domains = queryDitem.domainPath;
        queryDitem.domainPath = "";
        resourceUIService.getDevicesByCondition(queryDitem, function(returnObj) {
          if(jQuery("#devicecollapse").find(".fa.fa-plus").length > 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
          }
          if(returnObj.data) {
            if(returnObj.data.length > 10) {
              $scope.deviceswitchflg = 0;
            }
            returnObj.data.forEach(function(ci) {
              ci.icon = resourceUIService.rootModelDic[ci.modelId].icon;
            });

            $scope.deviceView = returnObj.data;

            SwSocket.unregister($scope.erroruuid); //注销错误信息的websocket

            //获取设备异常的信息
            $scope.getDeviceError($scope.deviceView);
          }
        })
      };

      /** 
       * 清空搜索条件
       */
      $scope.goClear = function() {
        $scope.queryDitem = {
          customerId: "", //  客户ID
          projectId: "", //项目ID
          domainPath: "", //域路径
          modelId: "", //型号
          sn: "", //序列号
          label: "", //序列号
          gatewayId: ""
        };

        initAllData("a");
      };

      /**
       * 查看CI的KPI值
       * @param {Object} item
       */
      $scope.getKPIs = function(item) {
        if($scope.deviceView.length > 10) {
          if(jQuery("#devicecollapse").find(".fa.fa-plus").length == 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
          }
        }

        if(jQuery("#kpicollapse").find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#kpicollapse"));
        }
        //格式化相关数据
        $scope.selectedRadioId = null; //选中kpi指标清空
        $scope.kpiData.idArray = []; //清空选中的历史kpi id
        initAllData('b'); //清空相关数据

        //注销websocket
        if('WebSocket' in window) {
          SwSocket.unregister($scope.uuid);
        }

        $scope.selectedDevicetitem = JSON.parse(JSON.stringify(item));
        var modelID = item.modelId;
        getKpisByModelId(modelID, function() {
          getCurrentKpiData($scope.selectedDevicetitem);
        });
      };

      /**
       * 通过设备ID查询设备
       * @param {Object} id
       */
      var getResourceById = function(id) {
        resourceUIService.getResourceById(id, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectedDevicetitem = returnObj.data;
            $scope.deviceView = [returnObj.data];
            var modelId = returnObj.data.modelId;
            if(modelId) {
              $scope.getDeviceError($scope.deviceView);
              getKpisByModelId(modelId, getResourcehandler);
            }
          }
        });
      };

      /**
       * 通过模型ID查询KPI定义
       * @param {Object} modelId
       * @param {Object} callbackfun
       */
      var getKpisByModelId = function(modelId, callbackfun) {
        if($scope.kpiDef[$scope.selectedDevicetitem.modelId]) {
          if(callbackfun) {
            callbackfun();
          }
        } else {
          resourceUIService.getDataItemsByModelId(modelId, function(returnObj) {
            if(returnObj.code == 0) {
              initAllData('b'); //清空相关数据

              var regExp = /\{|\[.*\}|\]/;

              //格式化kpi单位
              for(var i in returnObj.data) {
                returnObj.data[i].unit = $scope.myOptionDic[returnObj.data[i].unit];

                if(returnObj.data[i].range) {

                  var find = regExp.test(returnObj.data[i].range);
                  var rangeObj = [];
                  if(find) {
                    try {
                      rangeObj = find ? JSON.parse(returnObj.data[i].range) : [];
                    } catch(e) {

                    }
                  }
                  returnObj.data[i].rangeAry = rangeObj;
                  if(rangeObj instanceof Array) {
                    returnObj.data[i].rangeAry = rangeObj;
                    if(rangeObj.length == 2) {
                      returnObj.data[i].min = rangeObj[0];
                      returnObj.data[i].max = rangeObj[1];
                    }
                  } else if(rangeObj instanceof Object) {
                    returnObj.data[i].rangeObj = rangeObj;
                  }
                }
              }
              $scope.kpiDef[$scope.selectedDevicetitem.modelId] = returnObj.data;
              if(callbackfun) {
                callbackfun();
              }
            }
          })
        }
      };

      /**
       * 域返回值处理函数
       * @param data
       */
      function domainCallback(data) {
        $scope.domainListTree = data.domainListTree;
        $scope.domainListDic = data.domainListDic;
        $scope.selectedParentitem = null;
        //      for(var i in data.data) {
        //        if(!data.data[i]) {
        //          continue;
        //        } else {
        //          initDomainAtts(data.data[i]);
        //        }
        //        $scope.domainsAry.push(userDomainService.initTreeview(data.data[i], $scope.domainListDic));
        //      }
        //      $scope.defaultDomain = $scope.domainsAry;
      };

      /**
       * 模型数据处理
       * @param {Object} ciName
       */
      var handler = function(ciName) {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModelDic = {};
            var tree = returnObj.data;
            for(var i in tree) {
              var obj = tree[i];
              obj.text = obj.label;
              if(!$scope.routePathNodes[obj.parentModelId])
                $scope.routePathNodes[obj.parentModelId] = [];
              $scope.routePathNodes[obj.parentModelId].push(obj);
              if(!$scope.routePathNodes[obj.id])
                $scope.routePathNodes[obj.id] = [];
              var cmpObj = jQuery.extend(true, {}, obj);
              resourceUIService.rootModelDic[cmpObj.id] = cmpObj;
            }
            var addNodes = function(parentNode) {
              for(var modeid in $scope.routePathNodes) {
                if(modeid == parentNode.id) {
                  parentNode.nodes = $scope.routePathNodes[modeid]
                  for(var i in parentNode.nodes) {
                    addNodes(parentNode.nodes[i])
                  }
                  if(parentNode.nodes.length == 0) {
                    parentNode.nodes = null;
                  }
                }
              }
            }
            var initRoutePath = function(node, arr) {
              for(var i in node.nodes) {
                if($routeParams.modelId == node.nodes[i].id) {
                  arr.push(node);
                  break;
                } else {
                  initRoutePath(node.nodes[i], arr);
                }
              }
            }
            addNodes(resourceUIService.rootModel);
            for(var key in $scope.routePathNodes) {
              if(key != resourceUIService.rootModel.id && !resourceUIService.rootModelDic[key]) {
                for(var i in $scope.routePathNodes[key]) {
                  addNodes($scope.routePathNodes[key][i]);
                  if(!resourceUIService.rootModel.nodes)
                    resourceUIService.rootModel.nodes = [];
                  resourceUIService.rootModel.nodes.push($scope.routePathNodes[key][i])
                }
              }
            }
            resourceUIService.rootModelDic[resourceUIService.rootModel.id] = resourceUIService.rootModel;
            $scope.rootModel = resourceUIService.rootModel.nodes;
            $scope.rootModelDic = resourceUIService.rootModelDic;
          }
        });
      };

      /**
       * 根据获取的域以及获取所有的网关，筛选出该域的网关
       */
      function getAllGateways() {
        resourceUIService.getAllGateways(function(data) {
          if(0 == data.code) {
            $scope.gateData = data.data;
          }
        })
      };

      /**
       * 初始化，页面入口
       */
      var init = function() {

        /* 获得根模型的定义 */
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModel = returnObj.data;
            $scope.routePathNodes = {};
            handler(returnObj);
          }
        });
        getAllGateways();
        if(!$scope.menuitems["isloaded"]) {
          var menuitemsWatch = $scope.$watch('menuitems', function(o, n) {
            if($scope.menuitems["isloaded"]) {
              if($scope.baseConfig.extendDomain) {
                resourceUIService.getExtendDomainsByFilter({}, domainCallback);
              } else {
                userDomainService.queryDomainTree(userLoginUIService.user.userID, domainCallback);
              }
              menuitemsWatch();
            }
          }, true)
        } else if($scope.baseConfig.extendDomain) {
          resourceUIService.getExtendDomainsByFilter({}, domainCallback);
        } else {
          userDomainService.queryDomainTree(userLoginUIService.user.userID, domainCallback);
        }

        if($routeParams.hasOwnProperty('id')) {
          if($routeParams.id) {
            $scope.searchMode = true;
            getResourceById($routeParams.id);
          }
        } else {
          /* 让下一层收缩 */
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#kpicollapse"));
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#viewcollapse"));
        }

        $scope.$on("switchChange", function(e, param) {
          $scope.$apply(function() {　　
            if(param.id == "deviceswitch") {
              if(jQuery("#devicecollapse").find(".fa.fa-plus").length > 0) {
                jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
              }
              $scope.deviceswitchflg = param.itemDirValues; //设备默认显示按钮
            } else if(param.id == "kpiswitch") {
              if(jQuery("#kpicollapse").find(".fa.fa-plus").length > 0) {
                jQuery.AdminLTE.boxWidget.collapse(jQuery("#kpicollapse"));
              }
              $scope.kpiswitchflg = param.itemDirValues; //KPI默认显示按钮

            }else if(param.id == "openOrClose"){
                $scope.openOrClose = param.itemDirValues;
                if($scope.openOrClose == 0){
                    if('WebSocket' in window) {
                        SwSocket.unregister($scope.uuid);
                    }
                }
            }
          });
        })
      };

      /**
       * 指标参数
       */
      var initKpiData = function() {
        $scope.kpiData = {
          "idArray": [],
          "unitArray": [],
          "labelArray": [],
          "granularityArray": [],
          "granularityUnitArray": []
        };
        var xData = [];
        var series = [{
          "data": [],
          "name": "",
          "type": "line"
        }];
        // 初始化echart组件
        $timeout(function() {
          $scope.$broadcast(Event.ECHARTINFOSINIT, {
            "option": getOption({
              "xData": xData,
              "series": series
            })
          });
        });
      };

      /**
       * 初始化历史数据，无数据时的历史数据展示
       */
      var initHistory = function() {
        var xData = [];
        var series = [{
          "data": [],
          "name": "",
          "type": "line"
        }];
        var nulloption = getOption({
          "xData": xData,
          "series": series
        });
        $scope.$broadcast('OptionStatusChange', {
          option: nulloption
        });
      };

      /**
       * 获得KPI单位的设置
       */
      var getUnit = function() {
        if(!unitService.units) {
          unitService.getAllUnits(function(returnObj) {
            if(returnObj.code == 0) {
              unitService.units = returnObj.data;
              $scope.myOptions = returnObj.data;
              unitService.unitDics = {};
              for(var i in $scope.myOptions) {
                unitService.unitDics[$scope.myOptions[i].unitCode] = $scope.myOptions[i].unitName;
                if($scope.myOptions[i].unitCode == "NA" || $scope.myOptions[i].unitCode == "Number")
                  unitService.unitDics[$scope.myOptions[i].unitCode] = "";
              }
              $scope.myOptionDic = unitService.unitDics;
            }
          });
        } else {
          $scope.myOptions = unitService.units;
          $scope.myOptionDic = unitService.unitDics;
        }
      };

      //登录状态判定
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
            getUnit();
            initKpiData();
          }
        });
      } else {
        init();
        getUnit();
        initKpiData();
      }
    }
  ]);
});