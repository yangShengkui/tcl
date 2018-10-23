define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ReportTreeCtrl', ['$scope', '$location', 'unitService', '$routeParams', 'jacquardMachineStateUIService', 'kpiDataService', 'resourceUIService', '$timeout', 'userLoginUIService', 'Info', 'userEnterpriseService', 'growl',
    function($scope, $location, unitService, $routeParams, jacquardMachineStateUIService, kpiDataService, resourceUIService, $timeout, userLoginUIService, Info, userEnterpriseService, growl) {
      $scope.nodeList = {};
      var modId = "285937244977380";
      var newData = {};
      var nodeIds = [];
      $scope.reportList = [];
      $scope.searchName = "";
      $scope.searchShow = "yes";
      $scope.showTab = "";
      $scope.showMainTab = "start";
      $scope.filterSum = 0;
      $scope.objSize = 0;
      var type = $routeParams.type;
      var value = $routeParams.value;
      // var byModelId = function() {
      //   //企业B获取资源模型定义
      //   var loadindex = 0;
      //   resourceUIService.getModels(function(returnObj) {
      //     if (returnObj.code == 0 && returnObj.data[0].parentModelId) {
      //       for (var i in returnObj.data) {
      //         if (returnObj.data[i].parentModelId != 9) {
      //           //通过模型Id获取多个设备
      //           resourceUIService.getResourceByModelId(returnObj.data[i].id, function(returnObj1) {
      //             if (returnObj1.code == 0) {
      //               $scope.objSize += returnObj1.data.length;
      //               for (var j in returnObj1.data) {
      //                 nodeIds.push(returnObj1.data[j].id);
      //               }
      //               loadindex++;
      //               if (loadindex == returnObj.data.length) {
      //                 kpiValues();
      //               }
      //             };
      //           });
      //         }
      //       }
      //     };
      //   });
      // }
      $scope.search = function(seek, showTab, callback) {
          if (seek != "" && seek != null) {
            $scope.searchName = seek;
            $scope.showTab = showTab;
            if (showTab == 1000) {
              getCurrentDateStateByCustomerId(seek);
              // if ($scope.reportList[j].clientNum == seek) {
              //   $scope.filterSum = $scope.filterSum + 1;
              // }
            } else {
              getCurrentDateStateByfigureName(seek);
              // if ($scope.reportList[j].designName == seek) {
              //   $scope.filterSum = $scope.filterSum + 1;
              // }
            }
            // $scope.$apply();
          } else {
            $scope.showTab = "0";
            // $scope.$apply();
          }
        }
        // var kpiValues = function() {
        //   var nowDate = new Date();
        //   var day = nowDate.getDate();
        //   var dayofweek = nowDate.getDay() == 0 ? 7 : nowDate.getDay();
        //   var mon = nowDate.getMonth();
        //   day += getWeekStartDate(nowDate, dayofweek);
        //   var kpiQueryModel = {
        //     category: "time",
        //     isRealTimeData: true,
        //     timePeriod: day * 24 * 60 * 60 * 1000,
        //     nodeIds: nodeIds,
        //     kpiCodes: [3234],
        //     mon: mon,
        //     day: day,
        //     dayofweek: dayofweek,
        //     time: nowDate
        //   }
        //   resourceUIService.getResourceByIds(nodeIds, function(returnObj) {
        //     kpiQueryModel.nodesDic = returnObj;
        //     if (kpiQueryModel.kpisDic) {
        //       handlerFun(["kpi", kpiQueryModel]);
        //     }

      //   });
      //   resourceUIService.getKpisByKpiIds([3234, 3207, 3209, 3215, 3227, 3228, 3229, 3230], function(returnObj) {
      //     kpiQueryModel.kpisDic = returnObj;
      //     if (kpiQueryModel.nodesDic) {
      //       handlerFun(["kpi", kpiQueryModel]);
      //     }
      //   });
      // }
      // var getPreDaykpiValues = function(kpiQueryModel, modelDic) {
      //   kpiQueryModel.kpiCodes = [3207, 3209, 3215, 3227, 3228, 3229, 3230];
      //   kpiQueryModel.timePeriod = 0;
      //   var sumMon = 0;
      //   var sumWeek = 0;
      //   var sumDay = 0;
      //   var sumHour = 0;
      //   var sumDesign = 0;
      //   var sumGrand = 0;
      //   var sumSurp = 0;
      //   kpiDataService.getKpiValueList(["kpi", kpiQueryModel], function(returnObj) {
      //     for (var j in modelDic) {
      //       modelDic[j].designName = "";
      //       modelDic[j].dayYield = 0;
      //       modelDic[j].designMiss = 0;
      //       modelDic[j].grandYield = 0;
      //       modelDic[j].surpHours = 0;
      //       modelDic[j].clientNum = 0;
      //       modelDic[j].dayDuration = 0;
      //       if (returnObj.data.recordList.length > 0) {
      //         returnObj.data.recordList.forEach(function(record) {
      //           modelDic[j].dayDuration = record[j + '?3229'] ? record[j + '?3229'] : 0;
      //           modelDic[j].monthDuration += modelDic[j].dayDuration;
      //           modelDic[j].weekDuration += modelDic[j].dayDuration;
      //           sumDay += modelDic[j].dayDuration;
      //           modelDic[j].designName = record[j + '?3215'] ? record[j + '?3215'] : '';
      //           modelDic[j].dayYield = record[j + '?3207'] ? record[j + '?3207'] : 0;
      //           modelDic[j].designMiss = record[j + '?3209'] ? record[j + '?3209'] : 0;
      //           modelDic[j].grandYield = record[j + '?3227'] ? record[j + '?3227'] : 0;
      //           modelDic[j].surpHours = record[j + '?3228'] ? record[j + '?3228'] : 0;
      //           modelDic[j].clientNum = record[j + '?3230'] ? record[j + '?3230'] : 0;
      //         })
      //       }
      //       sumHour += modelDic[j].dayYield;
      //       sumMon = sumMon + (modelDic[j].monthDuration ? modelDic[j].monthDuration : 0);
      //       sumWeek = sumWeek + (modelDic[j].weekDuration ? modelDic[j].weekDuration : 0);
      //       sumDesign += modelDic[j].designMiss;
      //       sumGrand += modelDic[j].grandYield;
      //       sumSurp += modelDic[j].surpHours;
      //       modelDic[j].monthHUT = (modelDic[j].monthDuration / (kpiQueryModel.day * 24) * 100).toFixed(2);
      //       modelDic[j].monthDuration = modelDic[j].monthDuration.toFixed(2);
      //       modelDic[j].weekDuration = modelDic[j].weekDuration.toFixed(2);
      //       $scope.reportList.push(modelDic[j]);
      //     }
      //     $scope.daySum = parseFloat(sumHour).toFixed(2);
      //     $scope.designSum = parseFloat(sumDesign).toFixed(2);
      //     $scope.grandSum = parseFloat(sumGrand).toFixed(2);
      //     $scope.surpSum = parseFloat(sumSurp).toFixed(2);
      //     $scope.startHUTSum = $scope.reportList.length > 0 ? ((sumMon / ($scope.reportList.length * kpiQueryModel.day * 24)) * 100).toFixed(2) : 0;
      //     $scope.startMonthSum = parseFloat(sumMon).toFixed(2);
      //     $scope.startWeekSum = parseFloat(sumWeek).toFixed(2);
      //     $scope.startSum = parseFloat(sumDay).toFixed(2);
      //     $scope.durationGridData.data = $scope.reportList;
      //     $scope.yieldGridData.data = $scope.reportList;
      if (type && value) {
        if (type == 1000) {
          getCurrentDateStateByCustomerId(value);
        } else {
          getCurrentDateStateByfigureName(value);
        }
      }
      //     // $scope.$broadcast(Event.REPORTTREEINIT + "_yield", $scope.yieldGridData);
      //   });
      // }
      // var handlerFun = function(p) {
      //   $scope.daySum = 0;
      //   $scope.designSum = 0;
      //   $scope.grandSum = 0;
      //   $scope.surpSum = 0;
      //   $scope.startSum = 0;
      //   $scope.startWeekSum = 0;
      //   $scope.startMonthSum = 0;
      //   $scope.startHUTSum = 0;
      //   $scope.unitDics = unitService.unitDics;
      //   kpiDataService.getKpiValueList(p, function(returnObj) {
      //     if (returnObj.code == 0) {
      //       var modelDic = {};
      //       for (var key in p[1].nodesDic) {
      //         if (!modelDic[key]) {
      //           modelDic[key] = { reportName: p[1].nodesDic[key].label, monthDuration: 0, weekDuration: 0 };
      //         }
      //       }
      //       returnObj.data.recordList.forEach(function(record) {
      //         for (var key in returnObj.nodesDic) {
      //           var recordTime = newDateJson(record.time);
      //           if (recordTime.getMonth() == p[1].mon) {
      //             modelDic[key].monthDuration += record[key + "?3234"] ? Number(record[key + "?3234"]) : 0;
      //           }

      //           if (weekCheck(recordTime, p[1].time)) {
      //             modelDic[key].weekDuration += record[key + "?3234"] ? Number(record[key + "?3234"]) : 0;
      //           }

      //         }
      //       });
      //       getPreDaykpiValues(p[1], modelDic)
      //     }
      //   });
      // }
      // var getWeekStartDate = function(nowDate, dayofweek) { //获得本周的开端日期
      //   var plus = 0;
      //   var weekStartDate = new Date(nowDate.getYear(), nowDate.getMonth(), nowDate.getDate() - dayofweek + 1);
      //   if (weekStartDate.getMonth() == nowDate.getMonth()) {
      //     plus = 0
      //   } else {
      //     var oldday = weekStartDate.getDate();
      //     weekStartDate.setDate(1);
      //     weekStartDate.setMonth(weekStartDate.getMonth() + 1);
      //     plus = new Date(weekStartDate.getTime() - 1000 * 60 * 60 * 24).getDate() - oldday + 1;
      //   }
      //   return plus;
      // }
      // var weekCheck = function(old, now) {
      //   var now_time = now.getTime();
      //   var old_time = old.getTime();
      //   var now_day = now.getDay() == 0 ? 7 : now.getDay();
      //   var old_day = old.getDay() == 0 ? 7 : old.getDay();
      //   if (now_time >= old_time + 7 * 60 * 60 * 24 * 1000 || old_time >= now_time + 7 * 60 * 60 * 24 * 1000) {
      //     return false;
      //   } else if (old.getDate() == now.getDate() || old.getDate() > now.getDate && old_day > new_day || old.getDate() < now.getDate && old_day < new_day) {

      //     return true;
      //   }
      //   return false;
      // }
      $scope.closeTable = function() {
        $scope.showTab = "0";
      }
      $scope.durationGridData = {
        columns: [{
          title: "机台编号",
          data: " externalDevId"
        }, {
          title: "当日产量(米)",
          data: "figure_day_output"
        }, {
          title: "花样名称",
          data: "figure_name"
        }, {
          title: "生产任务(米)",
          data: "tasks_number"
        }, {
          title: "累计产量(米)",
          data: "number_produced"
        }, {
          title: "剩余小时(小时)",
          data: "how_long_to_finish"
        }, {
          title: "客户编号",
          data: "customer_id"
        }],
        columnDefs: [{
          targets: 0,
          render: function(data, type, row) {
            return escape(row.externalDevId);
          }
        }, {
          targets: 2,
          render: function(data, type, row) {
            if (row.figure_name == null || row.figure_name == undefined) {
              row.figure_name = '';
              return row.figure_name;
            } else {
              return '<a id="designname" style="cursor:pointer">' + row.figure_name + '</a>';
            }
          }
        }, {
          targets: 6,
          render: function(data, type, row) {
            if (row.customer_id == null || row.customer_id == undefined) {
              row.customer_id = '';
              return row.customer_id;
            } else {
              return '<a id="clientnum" style="cursor:pointer">' + row.customer_id + '</a>';
            }
          }
        }]
      }
      $scope.yieldGridData = {
        columns: [{
          title: "机台编号",
          data: " externalDevId"
        }, {
          title: "当日开机时长",
          data: "dayRunTime"
        }, {
          title: "本周时长",
          data: " weekRunTime"
        }, {
          title: "本月开机时长",
          data: "monthRunTime"
        }, {
          title: "本月开机率(%)",
          data: "monthBootRate"
        }],
        columnDefs: [{
          targets: 0,
          render: function(data, type, row) {
            return escape(row.externalDevId);
          }
        }, {
          targets: 2,
          render: function(data, type, row) {
            return escape(row.weekRunTime);
          }
        }]
      }

      //================================================   start  提花机  ====================================================================



      function getRunTimeStat() {
        $scope.yieldGridData.datalist = [];
        jacquardMachineStateUIService.getRunTimeStat(function(returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data == null || returnObj.data.length == 0) {
              $scope.yieldGridData.totaldata = [];
              $scope.yieldGridData.datalist = [];
            } else {
              $scope.yieldGridData.totaldata = returnObj.data[returnObj.data.length - 1];
              for (var i = 0; i < (returnObj.data.length - 1); i++) {
                $scope.yieldGridData.datalist.push(returnObj.data[i]);
              }
            }
            $timeout(function() {
              $scope.$broadcast(Event.REPORTTREEINIT + "_yield2", $scope.yieldGridData);
            })
          }
        })
      }

      function getCurrentDateState() {
        $scope.durationGridData.datalist = [];
        jacquardMachineStateUIService.getCurrentDateState(function(returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data == null || returnObj.data.length == 0) {
              $scope.durationGridData.totaldata = [];
              $scope.durationGridData.datalist = [];
            } else {
              $scope.durationGridData.totaldata = returnObj.data[returnObj.data.length - 1];
              for (var i = 0; i < (returnObj.data.length - 1); i++) {
                var date = returnObj.data[i].how_long_to_finish;
                returnObj.data[i].how_long_to_finish = parseInt(date / 3600) + '小时' + parseInt(parseInt(date % 3600) / 60) + '分钟';
                $scope.durationGridData.datalist.push(returnObj.data[i]);
              }
            }

            $timeout(function() {
              console.log($scope.durationGridData);
              $scope.$broadcast(Event.REPORTTREEINIT + "_duration", $scope.durationGridData);
            })
          }
        })
      }

      $scope.report2customer = [];
      $scope.report2figure = [];

      function getCurrentDateStateByCustomerId(customerId) {
        jacquardMachineStateUIService.getCurrentDateStateByCustomerId(customerId, function(returnObj) {
          if (returnObj.code == 0) {
            for (var i = 0; i < returnObj.data.length; i++) {
              var date = returnObj.data[i].how_long_to_finish;
              returnObj.data[i].how_long_to_finish = parseInt(date / 3600) + '小时' + parseInt(parseInt(date % 3600) / 60) + '分钟';
              $scope.report2customer.push(returnObj.data[i]);
            }
          }
        })
      }

      function getCurrentDateStateByfigureName(figureName) {
        jacquardMachineStateUIService.getCurrentDateStateByfigureName(figureName, function(returnObj) {
          if (returnObj.code == 0) {
            for (var i = 0; i < returnObj.data.length; i++) {
              var date = returnObj.data[i].how_long_to_finish;
              returnObj.data[i].how_long_to_finish = parseInt(date / 3600) + '小时' + parseInt(parseInt(date % 3600) / 60) + '分钟';
              $scope.report2figure.push(returnObj.data[i]);
            }
          }
        })
      }


      //================================================   end  提花机  ====================================================================

      var init = function() {
        getRunTimeStat();
        initEvent();
      }
      var initEvent = function() {
          $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            $scope.showTab = "0";
            var aname = $(e.target).attr("name");
            $scope.showMainTab = aname;
            if (aname == 'start') {
              getRunTimeStat();
            } else if (aname == 'day') {
              getCurrentDateState();
            }

            // $scope.$broadcast(Event.REPORTTREEINIT + "_duration", $scope.durationGridData);
            // $scope.$apply();
          });

        }
        //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
            if (type && value) {
              $scope.showTab = type;
              $scope.searchName = value;
              $scope.searchShow = "";
            }
          }
        });
      } else {
        init();
        if (type && value) {
          $scope.showTab = type;
          $scope.searchName = value;
          $scope.searchShow = "";
        }
      }
    }
  ]);
  controllers.initController('reportLookCtrl', ['$scope', '$location', 'ngDialog', 'unitService', '$routeParams', 'reportUIService', 'kpiDataService', 'resourceUIService', '$timeout', 'userLoginUIService', 'Info', 'userUIService', 'growl',
    function($scope, $location, ngDialog, unitService, $routeParams, reportUIService, kpiDataService, resourceUIService, $timeout, userLoginUIService, Info, userUIService, growl) {
      $scope.queryParam = {"reportName":"","startTime":"","endTime":""};
      $scope.url = userUIService.uploadFileUrl;
      $scope.goClear = function () {
        $scope.queryParam.reportName = "";
        $scope.queryParam.startTime = "";
        $scope.queryParam.endTime = "";
      }
      $scope.goSearch =  function () {
        reportUIService.getReportInfo($scope.queryParam,function (res) {
        if(res.code == 0){
          $scope.$broadcast("reportLook", res.data);
        }
      });
    }
      //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            $scope.goSearch();
          }
        });
      } else {
        $scope.goSearch();
      }
    }
  ]);
  controllers.initController('reportRuleCtrl', ['$scope', '$location','ngDialog', 'unitService', '$routeParams', 'jacquardMachineStateUIService', 'kpiDataService', 'resourceUIService', '$timeout', 'userLoginUIService', 'Info', 'userEnterpriseService', 'growl',
    function($scope, $location,ngDialog, unitService, $routeParams, jacquardMachineStateUIService, kpiDataService, resourceUIService, $timeout, userLoginUIService, Info, userEnterpriseService, growl) {
      /**
       * 查询所有报表规则并且初始化数据
       *
       */
      $scope.queryDitem = {
        statelabel: "", //查询条件显示
        state: 0, //查询条件
        name: "",
        emailTemplate: 0,
        templateId: null,
        templateName: null,
        receiverType: null,
        receiverId: null
      };
      /**
       * 查询报表规则
       */
      $scope.goSearch = function() {
        $scope.queryDitem.name = $scope.queryDitem.state == 0 ? $scope.queryDitem.name : null;
        $scope.queryDitem.emailTemplate = $scope.queryDitem.state == 1 ? $scope.queryDitem.emailTemplate : null;
        $scope.queryDitem.templateId = $scope.queryDitem.state == 2 ? $scope.queryDitem.templateId : null;
      };
      var init =  function () {
        userEnterpriseService.queryEnterpriseUser(function (res) {
          if(res.code == 0){
            $scope.$broadcast("reportRule", res.data);
          }
        });
      }

      $scope.dialog = function (){
        ngDialog.open({
          template: '../partials/dialogue/add_report_rule.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };
      //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
});
