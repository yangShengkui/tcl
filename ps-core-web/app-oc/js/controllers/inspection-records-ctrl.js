define(['controllers/controllers', 'bootstrap-dialog', 'echarts'], function(controllers, BootstrapDialog, echarts) {
  'use strict';
  controllers.initController('inspectionRecordsCtrl', ['$scope', 'userInitService', '$location', '$routeParams', '$timeout', 'maintenanceUIService', 'userLoginUIService', 'Info', 'growl', 'userEnterpriseService',
    function($scope, userInitService, $location, $routeParams, $timeout, maintenanceUIService, userLoginUIService, Info, growl, userEnterpriseService) {
      //设备类型
      $scope.teamTypes = [
        { "teamType": "polling", "typeName": "巡检组" },
        { "teamType": "security", "typeName": "保安组" }
      ];

      $scope.ifTables = true;

      //查询及展示数据字段
      function initHistory() {
        $scope.inspectionRecords = {
          'teamId': '',
          'userId': '',
          'startDate': '',
          'endDate': ''
        };
      }

      $scope.allTeams = null;
      $scope.usersByTeam = null;

      //获取所有班组名称（班组名称）
      function getAllTeams() {
        maintenanceUIService.getAllTeams(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.allTeams = returnObj.data;
          }
        })
      }

      //获取班组名称Id对应下的所有用户（巡检人）
      function getUsersByTeam(teamId) {
        if(teamId == '' || teamId == undefined) {
          $scope.inspectionRecords.userId = '';
          return;
        } else {
          var id = teamId;
          maintenanceUIService.getUsersByTeamId(id, function(returnObj) {
            if(returnObj.code == 0) {
              // var arr = [];
              // for (var i in returnObj.data) {
              //     arr[i] = returnObj.data[i].user;
              // }
              $scope.usersByTeam = returnObj.data;
            }
          })
        }

      }

      $scope.selectedTeam = function(id) {
        getUsersByTeam(id);
      }

      //查询
      $scope.saveRecords = function() {
        $scope.ifTables = true;
        var arr = [];
        for(var i in $scope.inspectionRecords) {
          arr.push($scope.inspectionRecords[i]);
        }
        maintenanceUIService.getInspectionRecordsByCondition(arr, function(returnObj) {
          if(returnObj.code == 0) {
            for(var i in returnObj.data) {
              if(returnObj.data[i].imgUrl) {
                // var imageUrl = "/upload/20161118101131538.png;/upload/20161118101131538.png;/upload/20161118101131538.png";
                returnObj.data[i].imgUrl = returnObj.data[i].imgUrl.split(';');
              }
            }
            $timeout(function() {
              $scope.$broadcast(Event.INSPECTIONRECORDS, {
                "option": [returnObj.data]
              });
            })
          }
        })
      };

      //取消
      $scope.cancelRecords = function() {
        initHistory();
        $scope.ifTables = false;
      }

      var init = function() {
        initHistory();
        getAllTeams();
      }
      
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);

  /**
   * 设备数据查询
   * Issue：PROMETHEUS-496、PROMETHEUS-585
   * 说明：测点导出时能够保存状态
   */
  controllers.initController('queryDeviceDataCtrl', ['$scope', 'ngDialog', 'userInitService', 'unitService', 'userDomainService', 'resourceUIService', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'Info', 'growl', 'customerUIService', 'projectUIService', 'userUIService','configUIService',
    function($scope, ngDialog, userInitService, unitService, userDomainService, resourceUIService, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, Info, growl, customerUIService, projectUIService,userUIService,configUIService) {
      $scope.domainListDic = {}; //域字典
      $scope.domainListTree = {};
      $scope.rootModel = {};
      $scope.selectedItem = {};
      $scope.rootModelDic = {};
      //    $scope.routePaths = [];
      $scope.routePathNodes = {};
      $scope.selectedDitem = {
        'devices': [] //用于在视图中展示设备信息
      };
      $scope.copy = {
        'devicesData': [], //存储设备模板或者设备域过滤出来的所有设备
        'nodeIds': []
      };

      $scope.kpiQueryModelObj = '';
      $scope.showDeviceData = [];
      $scope.queryState = false;
      $scope.ifTables = true;
      $scope.tableDataLoading = false;
      $scope.times = null;
      $scope.timePeriod = "10";
      var path = "../localdb/info.json";
      var colorArray = [];
      Info.get(path, function(info) {
        colorArray = info.emcsAlertColor;
        $scope.times = info.emcsSetTime;
      });
      //定义EChart option
      var getOption = function(chartData) {
        var option = {
          title: {
            text: chartData.title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            right:"5%"
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: chartData.xData
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: chartData.title,
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: { normal: {} },
            data: chartData.series.data
          }]
        };
        return option;
      };
      
      $scope.expObj = {};
      $scope.kPIsExportOrder;
      
      /**
       * PROMETHEUS-585 初始化时查询是否有保存在全局配置里的设置，并且恢复
       */
      var queryExpInitObj = function () {
        $scope.kPIsExportOrder = configUIService.kPIsExportOrder;
        if (!$scope.kPIsExportOrder) {
          configUIService.getConfigsByGroupName("KPIsExportOrder",function(returnObj){
            if (returnObj.code == 0 && returnObj.data.length > 0) {
              if (returnObj.data[0].value) {
                returnObj.data[0].value = JSON.parse(returnObj.data[0].value);
              }
              $scope.kPIsExportOrder = returnObj.data[0];
              configUIService.kPIsExportOrder = returnObj.data[0];
            }
          });
        } else {
          if (Object.prototype.toString.call($scope.kPIsExportOrder.value) !== "[object Object]") {
            $scope.kPIsExportOrder.value = JSON.parse($scope.kPIsExportOrder.value);
          }
        }
        $scope.expObj = {"packNumber":1,"packType":"天","censusNumber":1,"censusType":"分钟"};
        $scope.expObj.paramkpis = [];
        if ($scope.selectedItem.kpiCodes) {
          var i = 0;
          $scope.selectedItem.kpiCodes.forEach(function(kpiCode) {
            if($scope.selectedDitem.kpisObj[kpiCode] != undefined){
              var kpiObj = jQuery.extend(true, {}, $scope.selectedDitem.kpisObj[kpiCode]);
              kpiObj.index = ($scope.kPIsExportOrder && $scope.kPIsExportOrder.value[kpiObj.id])?$scope.kPIsExportOrder.value[kpiObj.id]:kpiObj.serial;
              $scope.expObj.paramkpis.push(kpiObj);
              i++;
            }
          })
        }
        $scope.expObj.paramkpis.sort(function (a, b) {
          return parseInt(a.index) - parseInt(b.index);
        });
      }
      
      /**
       * 根据开始时间跟结束时间段算天，小时，分钟，秒钟
       * @param type  提示字段的类型
       * @param start  开始时间
       * @param end    结束时间
       * @param val    传填写好的值
       * @param status  例如：天，小时，分钟，秒钟
       */
      var timePeriod = function (type, start, end, val, status) {
        var startGetTime = new Date($scope.selectedItem.startTime).getTime();
        var endGetTime = new Date($scope.selectedItem.endTime).getTime();
        var time = endGetTime - startGetTime;
        var days = 0;
        var str = true;
        if (status == '小时') {
          if (val > 0) {
            days = parseInt(time / (1000 * 60 * 60));
            if(val > days){
              str = "您选择的"+type+""+status+"大于时间范围，最大值不能超过"+days+""+status+"";
            }
          }
        } else if (status == '天') {
          if (val > 0) {
            days = parseInt(time / (1000 * 60 * 60 * 24));
            if(val > days){
              str = "您选择的"+type+""+status+"大于时间范围，最大值不能超过"+days+""+status+"";
            }
          }
        } else if (status == '分钟') {
          if (val > 0) {
            days = parseInt(time / (1000 * 60));
            if(val > days){
              str = "您选择的"+type+""+status+"大于时间范围，最大值不能超过"+days+""+status+"";
            }
          }
        } else if (status == '秒钟') {
          if (val > 0) {
            days = parseInt(time / 1000);
            if(val > days){
              str = "您选择的"+type+""+status+"大于时间范围，最大值不能超过"+days+""+status+"";
            }
          }
        }
        return str;
      }
      var msecConvert = function (count,type) {
        var time = "";
        if(type == '小时'){
          if(count > 0){
            time = count*(1000*60*60);
          }
        }else if(type == '天'){
          if(count > 0){
            time = count*(24*60*60*1000);
          }
        }else if(type == '分钟'){
          if(count > 0){
            time = count*(1000*60);
          }
        }else if(type == '秒钟'){
          if(count > 0){
            time = count*1000;
          }
        }
        return time;
      }
      $scope.exportKpi = function () {
        if ($scope.expObj.packNumber && $scope.expObj.packType) {
          var retStatus = timePeriod("打包时间",$scope.selectedItem.startTime,$scope.selectedItem.endTime,$scope.expObj.packNumber,$scope.expObj.packType);
          if(retStatus != true){
            growl.warning(retStatus,{});
            return;
          }
        }
        if ($scope.expObj.censusNumber && $scope.expObj.censusType) {
          var retStatus = timePeriod("统计周期",$scope.selectedItem.startTime,$scope.selectedItem.endTime,$scope.expObj.censusNumber,$scope.expObj.censusType);
          if(retStatus != true){
            growl.warning(retStatus,{});
            return;
          }
        }
        $scope.closeDialog();
        $scope.loadingShow = true;
        
        // PROMETHEUS-496 导出时对数据进行排序
        $scope.expObj.paramkpis.sort(function (a, b) {
          return parseInt(a.index) - parseInt(b.index);
        });
        var kpiCodes = [];
        $scope.expObj.paramkpis.forEach(function(kpi){
          kpiCodes.push(kpi.id);
          if ($scope.kPIsExportOrder)
            $scope.kPIsExportOrder.value[kpi.id] = kpi.index;
        })
        
        // PROMETHEUS-585 导出时临时一次，不保存
        if ($scope.kPIsExportOrder && false) {
           var saveConfig = $.extend(true, {}, $scope.kPIsExportOrder);
          saveConfig.value = JSON.stringify(saveConfig.value);
          configUIService.saveConfig(saveConfig, function(returnObj) {
            if(returnObj.code == 0) {
              configUIService.kPIsExportOrder = $scope.kPIsExportOrder;
            }
          })
        }

        var packMis = 0;
        var censusMis = 0;
        var queryObj = {
          isRealTimeData: false,
          startTime: new Date($scope.selectedItem.startTime),
          endTime: new Date($scope.selectedItem.endTime),
          // timePeriod: endTime - startTime,
          nodeIds: $scope.selectedItem.nodeIds,
          kpiCodes: kpiCodes
        };
        if ($scope.expObj.packNumber > 0 && $scope.expObj.packType) {
          packMis = msecConvert($scope.expObj.packNumber, $scope.expObj.packType);
        }else{
          growl.warning("打包时间不能填0哦！",{});
          return;
        }
        if ($scope.expObj.censusNumber > 0 && $scope.expObj.censusType) {
          censusMis = msecConvert($scope.expObj.censusNumber, $scope.expObj.censusType);
        }else{
          growl.warning("统计周期不能填0哦！",{});
          return;
        }
        kpiDataService.exportKpiValueList(["kpi", queryObj, censusMis, packMis,false], function (res) {
          $scope.loadingShow = false;
          if (res.code == 0) {
            console.log("JSON.straing" + res.data);
            var msgDetail = res.data;
            if(msgDetail.indexOf('download') > 0 ){
              window.location.href = userUIService.uploadFileUrl + "/" + msgDetail;
            }else {
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                message: res.data,
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    $scope.loadingShow = true;
                    kpiDataService.exportKpiValueList(["kpi", queryObj, censusMis, packMis,true], function (returnObj) {
                      if(returnObj.code == 0) {
                        $scope.loadingShow = false;
                        if(returnObj.data.indexOf('/') > 0 ){
                          window.location.href = userUIService.uploadFileUrl + "/" + returnObj.data;
                        }else {
                          growl.info("操作异常请联系管理员");
                        }
                      }
                    });
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function(dialogRef) {
                    dialogRef.close();
                  }
                }]
              });
            }
          }
        });
      }
      //查询及展示数据字段
      function initHistory() {
        queryExpInitObj();
        $scope.selectedItem = {
          "domain": "",
          "modelId": null,
          "nodeIds": [], //设备id的数组
          "nodeId": '', //所选单个设备Id
          "kpiCodes": [], //
          "kpiId": "",
          "startTime": "",
          "endTime": "",
          "customerId": "",
          "projectId": "",
          "time": null
        };
        $scope.selectedDitem.devices = [];
        $scope.selectedDitem.kpis = [];
        $scope.selectedDitem.nodeIds = [];
        $scope.selectedDitem.kpiCodes = [];
        if($scope.clearSelectTime) {
          $scope.clearSelectTime();
        }
      }
      $scope.exportClick = function () {
        var startTime = new Date($scope.selectedItem.endTime).Format("yyyy-MM-dd");
        var time = new Date($scope.selectedItem.startTime).Format("yyyy-MM-dd");
        var sp1 = startTime.split('-');
        var sp2 = time.split('-');
        if ((parseInt(sp1[0]) < parseInt(sp2[0])) || (parseInt(sp1[1]) < parseInt(sp2[1])) || (parseInt(sp1[1]) == parseInt(sp2[1]) && parseInt(sp1[2]) < parseInt(sp2[2]))) {
          growl.warning("您选择的开始时间小于结束时间",{});
          return;
        }
        queryExpInitObj();
        ngDialog.open({
          template: '../partials/dialogue/query_device.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      }
      /**
       * 格式化时间格式(YYYY-MM-Day HH:MM:SS)
       */
      var formatDate = function(datestr) {
        // datestr = $filter('date')(datestr, 'yyyy-MM-dd HH:mm:ss');
        datestr = new Date(datestr).Format("yyyy-MM-dd hh:mm:ss");
        return datestr;
      };
      /**
       * 格式化返回历史数据
       * @param data
       */
      function formatData(data) {
        //chart图数据
        var chartData = {
          "title":"",
          "xData": [],
          "series": {
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
        var chartDataDir = {};
        $scope.selectedItem.kpiCodes.forEach(function(kpiCode) {
          if($scope.selectedDitem.kpisObj[kpiCode] != undefined){
            chartData.title = $scope.selectedDitem.kpisObj[kpiCode].name;
            chartDataDir[kpiCode] = jQuery.extend(true, {}, chartData);
          }
        })

        data.forEach(function(e) {
          chartDataDir[e.kpiCode].title = e.kpiName;
          chartDataDir[e.kpiCode].xData.push(formatDate(e.arisingTime));
          chartDataDir[e.kpiCode].series.data.push(e.value);
          //Table表格数据
          tableData.data.push({
            "name": formatDate(e.arisingTime),
            "value": e.value
          });
        });
        
        $scope.selectedItem.kpiCodes.forEach(function(kpiCode) {
          $scope.$broadcast(Event.ECHARTINFOSINIT, {
            name: kpiCode,
            option: getOption(chartDataDir[kpiCode])
          });
        });

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
        }];
      };
      
      //格式化单位
      (function() {
        unitService.getAllUnits(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.formatUnits = returnObj.data;
          }
        });
      })();

      //设备模板选择获取设备和kpi指标
      $scope.getDeviceByDeviceType = function(modelId) {
        $scope.selectedItem.kpiId = "";
        $scope.selectedItem.nodeId = ""; //清空选中的设备
        if(modelId) {
          $scope.queryState = true;
          getResourceDevices(modelId);
          getKpisBymodelId(modelId);
        } else {
          $scope.queryState = false;
        }
      };
      $scope.projectsCustomerList = [];
      $scope.customerChange = function() {
        if($scope.selectedItem.customerId){
          $scope.projectsCustomerList = $scope.projectsListAll;
          $scope.projectsList = $scope.projectsListAll;
        }else{
          $scope.projectsCustomerList = [];
          $scope.projectsList = [];
        }
        //如果设备模板、项目、客户都没有选择，那么按照域查询指标
        if (!$scope.selectedDitem.modelId && !$scope.selectedItem.projectId)
          getKpisBymodelId(301);
      }
      $scope.projectChange = function() {
        //如果设备模板、项目、客户都没有选择，那么按照域查询指标
        if (!$scope.selectedDitem.modelId)
          getKpisBymodelId(302);
      }
      //根据域和设备模板过滤设备
      $scope.getDevices = function(domainPath) {
        if(domainPath) {
          var arrIds = [];
          for(var i in $scope.selectedDitem.devices) {
            if($scope.selectedDitem.devices[i].domainPath.indexOf(domainPath) > -1) {
              arrIds.push($scope.selectedDitem.devices[i].id);
              $scope.selectedDitem.devices[i].visible = true;
            } else {
              $scope.selectedDitem.devices[i].visible = false;
            }
          }
          $scope.selectedItem.nodeIds = arrIds;
          $scope.selectedDitem.nodeIds = arrIds;
          //如果设备模板、项目、客户都没有选择，那么按照域查询指标
          //这里有一个bug，如果两次以上选中一个模板时，测点显示就不对了
          if (!$scope.selectedItem.modelId && !$scope.selectedItem.projectId && !$scope.selectedItem.customerId)
            getKpisBymodelId(300);
        }
      }

      //根据域和设备筛选出的设备进行二次选择
      $scope.getselectedDevice = function(p) {
        if(p) {
          $scope.selectedItem.nodeIds = [];
          $scope.selectedItem.nodeIds.push(p);
        } else if(p == null) {
          $scope.selectedItem.nodeIds = $scope.selectedDitem.nodeIds;
        }
      };

      //根据选取的kpi过滤设备
      $scope.getKpi = function(kpiId) {
        if(kpiId && kpiId.length > 0) { //这里有一个bug，kpiId长度是0的时候，也是需要进行初始化设置
          $scope.selectedItem.kpiCodes = [];
          $scope.selectedItem.kpiCodes = kpiId;
        } else {
          $scope.selectedItem.kpiCodes = $scope.selectedDitem.kpiCodes;
        }
      }

      function querydeviceData(kpiQueryModel,searchTypeName) {
        var value = "";
        $scope.tableDataLoading = true;
        $scope.kpiQueryModelObj = kpiQueryModel;
        kpiDataService.queryDeviceData(kpiQueryModel, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.tableDataLoading = false;
            for(var i in returnObj.data) {
              $scope.showDeviceData[i] = returnObj.data[i];
              $scope.showDeviceData[i].deviceName = searchTypeName;
              if(returnObj.data[i].instance == null || returnObj.data[i].instance == "null") {
                $scope.showDeviceData[i].instance = "";
              }

              for(var k in $scope.selectedDitem.devices) {
                if(returnObj.data[i].nodeId == $scope.selectedDitem.devices[k].id) {
                  $scope.showDeviceData[i].deviceName = $scope.selectedDitem.devices[k].label;
                }
              }
              for(var j in $scope.selectedDitem.kpis) {
                if(returnObj.data[i].kpiCode == $scope.selectedDitem.kpis[j].id) {
                  $scope.showDeviceData[i].kpiName = $scope.selectedDitem.kpis[j].label;
                  value = formatKpiValue($scope.selectedDitem.kpis[j].range, returnObj.data[i].value);
                  $scope.showDeviceData[i].kpiValue = value + $scope.selectedDitem.kpis[j].unit;
                }
              }
            }

            $timeout(function() {
              //初始化图表数据
              $scope.tableData = {
                "name": "",
                "unit": "",
                "data": []
              };

              //历史数据table数据的展示
              if($scope.showDeviceData.length != 0) {
                formatData($scope.showDeviceData);
              }
              $scope.$broadcast(Event.DEVICEDATAINIT, {
                "option": [$scope.showDeviceData]
              });
            })
          }
        })
      };

      $scope.clearSearch = function (sel) {
        if(sel == "domain"){
          $scope.selectedItem.customerId = '';
          $scope.selectedItem.projectId = '';
          $scope.selectedItem.modelId = '';
          $scope.selectedItem.nodeId = '';
          $scope.selectedDitem.devices = [];
        }else if(sel == "customers"){
          $scope.selectedItem.projectId = '';
          $scope.selectedItem.modelId = '';
          $scope.selectedItem.nodeId = '';
          $scope.selectedDitem.devices = [];
        }else if(sel == "project"){
          $scope.selectedItem.modelId = '';
          $scope.selectedItem.nodeId = '';
          $scope.selectedDitem.devices = [];
        }
      }

      //查询
      $scope.searchData = function() {
        var attrSearchCount = ($scope.baseConfig && $scope.baseConfig.attrSearchCount) ? $scope.baseConfig.attrSearchCount : 99999;
//      if(!$scope.selectedItem.modelId || $scope.selectedItem.modelId == undefined) {
//        growl.info("请选择设备模板再进行查询", {});
//        $scope.queryState = false;
//        return;
//      }
        if(!$scope.selectedItem.kpiCodes && $scope.selectedItem.kpiCodes.length == 0) {
          growl.info("测点数量不能为空", {});
          $scope.queryState = false;
          return;
        }
        if($scope.selectedItem.kpiId && $scope.selectedItem.kpiId.length > attrSearchCount) {
          growl.info("测点数量最多不超过"+attrSearchCount+"个", {});
          $scope.queryState = false;
          return;
        }
        $scope.ifTables = true;
        $scope.showDeviceData = [];
        var kpiQueryModel = {};
        var nowTime = new Date().getTime();
        var searchNodeIds = [];
        var searchTypeName = "";
        if ($scope.selectedItem.nodeIds && $scope.selectedItem.nodeIds.length > 0) { //如果有设备
          searchNodeIds = $scope.selectedItem.nodeIds;
        } else if ($scope.selectedItem.projectId) { //如果项目
          searchNodeIds = [$scope.selectedItem.projectId];
          searchTypeName = $scope.projectsDic[$scope.selectedItem.projectId].projectName;
        } else if ($scope.selectedItem.customerId) { //如果客户
          searchNodeIds = [$scope.selectedItem.customerId];
          searchTypeName = $scope.customersDic[$scope.selectedItem.customerId].customerName;
        } else if ($scope.selectedItem.domain) { //如果域
          var domainInfo = $scope.domainListDic[$scope.selectedItem.domain];
          searchNodeIds = [domainInfo.id];
          searchTypeName = domainInfo.label;
        }
        //angel
        var kpiCodes = $scope.selectedItem.kpiCodes.map(function (kc) {
          return kc * 1;
        });
        //angel
        if($scope.selectedItem.startTime && $scope.selectedItem.endTime) {

          kpiQueryModel = {
            isRealTimeData: false,
            startTime: new Date($scope.selectedItem.startTime),
            endTime: new Date($scope.selectedItem.endTime),
            // timePeriod: endTime - startTime,
            nodeIds: searchNodeIds,
            kpiCodes: kpiCodes,
            includeInstance: true
          };
          querydeviceData(kpiQueryModel,searchTypeName);
        } else {
          kpiQueryModel = {
            isRealTimeData: true,
            nodeIds: searchNodeIds,
            kpiCodes: kpiCodes,
            includeInstance: true
          };
          querydeviceData(kpiQueryModel,searchTypeName);
        }
      };

      //取消
      $scope.cancelRecords = function() {
        initHistory();
        $scope.queryState = false;
        $scope.projectsList = [];
      };

      //通过设备模板获取设备
      function getResourceDevices(modelID) {
        $scope.selectedItem.nodeIds = [];
        $scope.selectedDitem.devices = [];
        resourceUIService.getDevicesByCondition({ "modelId": modelID }, function(returnObj) {
          if(returnObj.code == 0) {
            var arr = [];
            for(var i in returnObj.data) {
              arr.push(returnObj.data[i].id);
              returnObj.data[i].visible = true;
            }
            $scope.selectedItem.nodeIds = arr;
            $scope.selectedDitem.nodeIds = arr;
            $scope.selectedDitem.devices = returnObj.data;
            if($scope.selectedItem.domain)
              $scope.getDevices($scope.selectedItem.domain);
          }
        })
      };

      //根据用户Id查用户域
      var domainTreeQuery = function() {
        var domainCallback =  function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
        };
        if (!$scope.menuitems["isloaded"]) {
          var menuitemsWatch = $scope.$watch('menuitems', function(o, n) {
            if ($scope.menuitems["isloaded"]) {
              if ($scope.baseConfig.extendDomain) {
                resourceUIService.getExtendDomainsByFilter({},domainCallback);
              } else {
                userDomainService.queryDomainTree(userLoginUIService.user.userID, domainCallback);
              }
              menuitemsWatch();
            }
          },true)
        } else if ($scope.baseConfig.extendDomain) {
          resourceUIService.getExtendDomainsByFilter({},domainCallback);
        } else {
          userDomainService.queryDomainTree(userLoginUIService.user.userID, domainCallback);
        }
      };

      //设备模板目录树拼接
      function handler(returnObj) {
        if(returnObj.code == 0) {
          resourceUIService.rootModelDic = {};
          for(var i in returnObj.data) {
            var obj = returnObj.data[i];
            if(!$scope.routePathNodes[obj.parentModelId])
              $scope.routePathNodes[obj.parentModelId] = [];
            $scope.routePathNodes[obj.parentModelId].push(obj);
            if(!$scope.routePathNodes[obj.id])
              $scope.routePathNodes[obj.id] = [];
            resourceUIService.rootModelDic[obj.id] = obj;
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
                if(node.id != arr[0].id)
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
                $scope.routePathNodes[key][i].parentModelId = resourceUIService.rootModel.id;
                resourceUIService.rootModel.nodes.push($scope.routePathNodes[key][i])
              }
            }
          }
          resourceUIService.rootModelDic[resourceUIService.rootModel.id] = resourceUIService.rootModel;
          $scope.rootModelDic = resourceUIService.rootModelDic;
          $scope.rootModel = resourceUIService.rootModel;
        }
      };

      //查询所有的设备模板
      var modelList = function() {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.modelListSelect = returnObj.data;
            handler(returnObj);
          }
        })
      };

      // 通过设备模板获取kpi指标
      function getKpisBymodelId(modelID) {
        $scope.selectedItem.kpiCodes = [];
        $scope.selectedDitem.kpis = [];
        $scope.selectedDitem.kpisObj = {};
        if (!$scope.rootModelDic[modelID]) $scope.rootModelDic[modelID] = {};
        if(!$scope.rootModelDic[modelID]["kpiloaded"]) {
          resourceUIService.getDataItemsByModelId(modelID, function(returnObj) {
            if(returnObj.code == 0) {
              var regExp = /\{|\[.*\}|\]/;
              var kpiCodes = [];
              for(var i in returnObj.data) {
                kpiCodes.push(returnObj.data[i].id);
                $scope.selectedDitem.kpisObj[returnObj.data[i].id] = returnObj.data[i];
                //格式化kpi单位
                $scope.formatUnits.forEach(function(e) {
                  if(e.unitCode == returnObj.data[i].unit) {
                    returnObj.data[i].unit = e.unitName;
                  }
                })
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
              $scope.rootModelDic[modelID]["kpiloaded"] = true;
              $scope.rootModelDic[modelID].kpis = returnObj.data;
              $scope.selectedDitem.kpis = returnObj.data;
              $scope.rootModelDic[modelID].kpiCodes = kpiCodes;
              $scope.selectedDitem.kpiCodes = kpiCodes;
              $scope.selectedItem.kpiCodes = kpiCodes;
            }
          })
        } else {
          $scope.selectedDitem.kpis = $scope.rootModelDic[modelID].kpis;
          $scope.selectedDitem.kpiCodes = $scope.rootModelDic[modelID].kpiCodes;
          $scope.selectedItem.kpiCodes = $scope.rootModelDic[modelID].kpiCodes;
          for(var j in $scope.rootModelDic[modelID].kpis){
            $scope.selectedDitem.kpisObj[$scope.rootModelDic[modelID].kpis[j].id] = $scope.rootModelDic[modelID].kpis[j];
          }
        }
      };
      /**
       * 获得客户列表
       */
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function() {
        customerUIService.findCustomersByCondition({}, function(returnObj) {
          $scope.customersDic = returnObj.customerDic;
          returnObj.data.forEach(function(item) {
            item.text = item.customerName;
          })
          var obj = {"text":"请选择","value":"-1"};
          returnObj.data.unshift(obj);
          $scope.customersList = returnObj.data;
        })
      };
      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsListAll;
      $scope.projectsDic = {};
      $scope.queryProject = function() {
        projectUIService.findProjectsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            });
            var obj = {"text":"请选择","value":"-1"};
            returnObj.data.unshift(obj);
            $scope.projectsListAll = returnObj.data;
          }
        })
      };
      $scope.activeListTab = "tab1";
      var initEvent = function() {
        var attrSearchCount = ($scope.baseConfig && $scope.baseConfig.attrSearchCount) ? $scope.baseConfig.attrSearchCount : 99999;
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          var aname = $(e.target).attr("name");
          var targetText = $(e.target).text();
          if (aname) {
            $scope.activeListTab = aname;
            if(aname == 'tab2'){
              if($scope.selectedItem.nodeId == '' || $scope.selectedItem.nodeId ==null) {
                growl.info("请选择一个设备",{});
              } else if ($scope.selectedItem.kpiId.length <= 0 ) {
                growl.info("请选择一个测点",{});
              } else if ($scope.selectedItem.kpiId.length > attrSearchCount) {
                growl.info("测点最多不超过"+attrSearchCount+"个",{});
              }
            }
            $scope.$apply();
            $timeout(function() {
              $('.chart').resize()
            },300);
            
          }
        });
      };
      var init = function() {
        initEvent();
        initHistory();
        initKpiData();
        domainTreeQuery();
        queryCustomer();
        $scope.queryProject();
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModel = returnObj.data;
            modelList();
          }
        });
        $timeout(function() {
          $scope.$broadcast(Event.DEVICEDATAINIT, {
            "option": []
          });
        })
      }

      /**
       * 标准初始化，在用户登录后执行
       */
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);

  //设备数据统计
  controllers.initController('statisticsDeviceDataCtrl', ['$scope', '$filter', 'userInitService', 'unitService', 'userDomainService', 'resourceUIService', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'Info', 'growl',
    function($scope, $filter, userInitService, unitService, userDomainService, resourceUIService, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, Info, growl) {
      $scope.domainListDic = {}; //域字典
      $scope.domainListTree = {};
      $scope.rootModel = {};
      $scope.rootModelDic = {};
      $scope.routePathNodes = {};
      $scope.modelListSelect; //模型的列表
      $scope.chartData = { //图表
        "xData": [],
        "series": {
          "name": "",
          "type": "line",
          "data": []
        }
      };
      var target = echarts.init($("#linedataview")[0]);
      $scope.selectedDitem = {
        'label': [], //用于在视图中展示设备信息
        'kpisObj':{}
      };

      $scope.statiMethod = [{
        smId: "max",
        smName: "最大值"
      }, {
        smId: "min",
        smName: "最小值"
      }, {
        smId: "avg",
        smName: "平均值"
      }, {
        smId: "sum",
        smName: "求和"
      }];

      $scope.copy = {
        'devicesData': [], //存储设备模板或者设备域过滤出来的所有设备
        'nodeIds': []
      };
      $scope.showDeviceData = [];
      // $scope.shyj = 1;
      $scope.ifTables = false;
      $scope.history = '';

      //查询及展示数据字段
      function initHistory() {
        $scope.selectedItem = {
          "nodeType": "",
          "domain": "",
          "nodeIds": [], //设备id的数组
          "kpiCodes": [], //
          "kpiId": "",
          "statisticType": '', //统计方式
          "statisticTimeType": '', //统计粒度
          "startTime": "",
          "endTime": "",
          "kpilabel": ""
        };
        $scope.selectedDitem.label = [];
        $scope.selectedDitem.kpis = [];
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
      };

      //格式化单位
      (function() {
        unitService.getAllUnits(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.formatUnits = returnObj.data;
          }
        });
      })();

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
          // toolbox: {
          //   feature: {
          //     dataView: {},
          //     saveAsImage: {
          //       type: 'png'
          //     }
          //   }
          // },
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

      //格式化设备数据
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
        data.forEach(function(e) {
          if($scope.selectedItem.statisticTimeType == "hour") {
            chartData.xData.push($filter('date')(new Date(e.timeflag), 'yyyy-MM-dd HH:mm:ss'));
          } else if($scope.selectedItem.statisticTimeType == "day") {
            chartData.xData.push($filter('date')(new Date(e.timeflag), 'yyyy-MM-dd'));

          }
          chartData.series.data.push(e.value);
          var rangeObj = null;
          $scope.selectedDitem.kpis.forEach(function(f) {
            if(f.id == e.kpiCode) {
              chartData.series.name = f.label;
              if(f.rangeObj)
                rangeObj = f.rangeObj;
            }
          });
        });

        target.setOption(getOption(chartData));
        //监听浏览器变化
        $timeout(function() {
          window.onresize = function() {
            target.resize();
          }
        });

        //聚合Chart数据
        $scope.chartData = chartData;
      };

      //设备模板选择获取设备和kpi指标
      $scope.getDeviceByDeviceType = function(modelId) {
        getResourceDeviceLabel(modelId);
        getKpisBymodelId(modelId);

      }

      //根据域和设备模板过滤设备
      $scope.getDevices = function(domainPath) {
        var arrIds = []; //存储筛选出来的设备Id
        var arr = []; //存储筛选出来的设备信息
        for(var i in $scope.copy.devicesData) {
          if($scope.copy.devicesData[i].domainPath.indexOf(domainPath) > -1) {
            arrIds.push($scope.copy.devicesData[i].id);
            arr.push($scope.copy.devicesData[i]);
          }
        }
        $scope.selectedItem.nodeIds = arrIds;
        $scope.copy.nodeIds = arrIds;
        $scope.selectedDitem.label = arr;
      }

      //根据域和设备筛选出的设备进行二次选择
      $scope.getselectedDevice = function(p) {
        if(p) {
          $scope.selectedItem.nodeIds = [];
          $scope.selectedItem.nodeIds.push(p);
        } else if(p == null) {
          $scope.selectedItem.nodeIds = [];
        }
      }

      //根据选取的kpi过滤设备
      $scope.getKpi = function(kpiId) {
        $scope.kpiId = kpiId;
        if(kpiId == null) {
          $scope.selectedItem.kpilabel = '';
        } else {
          for(var i in $scope.selectedDitem.kpis) {
            if($scope.selectedDitem.kpis[i].id == kpiId) {
              $scope.selectedItem.kpilabel = $scope.selectedDitem.kpis[i].label;
              break;
            }
          }
        }

      }

      //查询函数
      function querydeviceData(kpiQueryModel) {
        var value = "";
        kpiDataService.queryDeviceData(kpiQueryModel, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.ifTables = true;
            if(jQuery("#devicecollapse").find(".fa.fa-plus").length > 0) {
              jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
            }
            formatData(returnObj.data);

          }
        })
      }

      //查询
      $scope.searchData = function() {
        $scope.showDeviceData = [];
        $scope.selectedItem.kpiCodes = [];
        var kpiQueryModel = {};
        var nowTime = new Date().getTime();
        var startTime = new Date($scope.selectedItem.startTime).getTime();
        var endTime = new Date($scope.selectedItem.endTime).getTime();
        if($scope.selectedItem.nodeType == "" || $scope.selectedItem.nodeType == undefined) {
          growl.info("请选择设备模板再进行查询", {});
          $scope.ifTables = false;
          return;
        }
        if($scope.kpiId == '' || $scope.kpiId == undefined || $scope.kpiId == null || $scope.selectedItem.nodeIds.length == 0) {
          growl.info("请选择完整必选项", {});
          $scope.ifTables = false;
          return;
        } else {
          $scope.selectedItem.kpiCodes.push($scope.kpiId);
        }

        if(!$scope.selectedItem.endTime || !$scope.selectedItem.startTime || !$scope.selectedItem.statisticType || !$scope.selectedItem.statisticTimeType) {
          growl.info("请选择完整必选项", {});
          $scope.ifTables = false;
          return;
        }

        if($scope.selectedItem.startTime && $scope.selectedItem.endTime) {
          if(endTime - startTime > 2592000000) {
            growl.info('时间选择范围请控制在30天之内', {});
            $scope.ifTables = false;
            return;
          }
          if(endTime - startTime < 0) {
            growl.info('请正确输入时间范围', {});
            $scope.ifTables = false;
            return;
          }
          kpiQueryModel = {
            isRealTimeData: false,
            startTime: $scope.selectedItem.startTime,
            endTime: $scope.selectedItem.endTime,
            // timePeriod: endTime - startTime,
            nodeIds: $scope.selectedItem.nodeIds,
            kpiCodes: $scope.selectedItem.kpiCodes,
            statisticTimeType: $scope.selectedItem.statisticTimeType,
            includeInstance: true,
            statisticType: $scope.selectedItem.statisticType
          };
          querydeviceData(kpiQueryModel);
        }
      };

      //取消
      $scope.cancelRecords = function() {
        initHistory();
        $scope.ifTables = false;
      }

      //通过设备模板获取设备
      function getResourceDeviceLabel(modelID) {
        $scope.selectedItem.domain = '';
        $scope.selectedItem.nodeIds = [];
        $scope.selectedDitem.label = [];
        resourceUIService.getDevicesByCondition({ "modelId": modelID }, function(returnObj) {
          if(returnObj.code == 0) {
            var arr = [];
            $scope.selectedDitem.label = returnObj.data;
            $scope.copy.devicesData = returnObj.data;
            for(var i in returnObj.data) {
              arr.push(returnObj.data[i].id);
            }
            $scope.copy.nodeIds = arr;
          }
        })
      }

      //通过设备模板获取kpi指标
      function getKpisBymodelId(modelID) {
        $scope.selectedItem.kpiCodes = [];
        resourceUIService.getDataItemsByModelId(modelID, function(returnObj) {
          if(returnObj.code == 0) {
            var regExp = /\{|\[.*\}|\]/;
            for(var i in returnObj.data) {
              //格式化kpi单位
              $scope.formatUnits.forEach(function(e) {
                if(e.unitCode == returnObj.data[i].unit) {
                  returnObj.data[i].unit = e.unitName;
                }
              })
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
            $scope.selectedDitem.kpis = returnObj.data;
          }
        })
      }

      /**
       * 获取设备类型
       *
       */
      function domainTreeQuery() {
        var initTreeview = function(obj) {
          if(obj.domains) {
            obj.nodes = [];
            for(var i in obj.domains) {
              obj.nodes.push(initTreeview(obj.domains[i]));
            }
            obj.tags = [obj.nodes.length]
          }
          if(obj.belong == 1) {
            obj.state = {
              checked: true
            }
          } else {
            obj.state = {
              checked: false
            }
          }
          obj.text = obj.name;
          obj.icon = "ion ion-ios-color-filter";
          $scope.domainListDic[obj.domainPath] = obj;
          if(obj.domainID)
            $scope.domainListDic[obj.domainID] = obj;
          else
            $scope.domainListDic[0] = obj;
          return obj;
        }
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          var dom = [];
          var newObj = {
            parentID: "",
            domainPath: "",
            name: "",
            description: "",
            domains: data.data
          }
          dom.push(newObj);
          var menu_list = initTreeview(dom[0]);
          $scope.domainListTree = menu_list.nodes;
          // initSearchAlerts();
        });
      }
      /**
       * 设备模板名称汉化
       * @param ciName
       */
      function urmpTree(ciName) {
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
            $scope.rootModel = resourceUIService.rootModel;
            $scope.rootModelDic = resourceUIService.rootModelDic;
          }
        });
      };

      if(!resourceUIService.rootModel) {
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModel = returnObj.data;
            domainTreeQuery();
          }
        });
      } else {
        $scope.rootModel = resourceUIService.rootModel;
        urmpTree();
        domainTreeQuery();
      }

      var init = function() {
        initHistory();
      }
      
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
});