define(['controllers/controllers', 'bootstrap-dialog', 'bootstrap-multiselect'], function (controllers, BootstrapDialog, bootstrapMultiselect) {
  'use strict';
  controllers.initController('maintenanceCtrl', ['$scope', '$q', 'ngDialog', '$location', '$routeParams', '$timeout','maintenanceTaskUIService','customerUIService','projectUIService',
    'kpiDataService', 'resourceUIService', 'growl', 'userLoginUIService', 'ticketCategoryService', 'userEnterpriseService', 'Info', '$route',
    function ($scope, q, ngDialog, $location, $routeParams, $timeout,maintenanceTaskUIService,customerUIService,projectUIService, kpiDataService, resourceUIService, growl, userLoginUIService, ticketCategoryService, userEnterpriseService, Info, $route) {
      $scope.queryDitem = {};
      $scope.objMain = {};

      $scope.isLoading = false;
      var mainId = $routeParams.id;
      var promises = []; //已加载列表
      var defers = []; //延期列表
      for(var i = 0; i < 5; i++) {
        defers.push(q.defer());
      };
      $scope.cycleChang = function () {
        if($scope.objMain.executionCycle == 'disposable'){
          $scope.objMain.cycleNum = 1;
        }else{
          $scope.objMain.cycleNum = '';
        }
      }
      var initObj = function () {
        $scope.objMain = {"id":0,"name":"","customerId":null,"projectId":null,"deviceId":null,"executionCycle":"","remindDays":"","firstExecutionTime":"","executioner":"","ticketCategoryId":""};
      }
      //获取工单流程
      $scope.processTypeDic = {};
      var getProcedure = function() {
        ticketCategoryService.getTicketCategorys(function(returnObj) {
          if (returnObj.code == 0) {
            var arr1 = [];
            for (var i in returnObj.data) {
              if (returnObj.data[i].category == 40) { //维保工单
                arr1.push(returnObj.data[i]);
              }
            }
            arr1.forEach(function(item) {
              $scope.processTypeDic[item.id] = item;
              item.text = item.name;
            })
            $scope.processType = arr1;
            defers[0].resolve("success");
          }
        })
      };
      $scope.selectTaskList = [];
      $scope.selectStatusList = {"startList":[],"disableList":[]};
      $scope.selectedHandler = function () {
        var activeAlert = [];
        $scope.selectStatusList.startList = [];
        $scope.selectStatusList.disableList = [];
        // console.log(JSON.stringify(columsData));
        $scope.taskList.forEach(function(obj) {
          if(obj.selected) {
            activeAlert.push(obj);
            if(obj.taskStatus == 0){
              $scope.selectStatusList.startList.push(obj);
            }else if(obj.taskStatus == 1){
              $scope.selectStatusList.disableList.push(obj);
            }
          }
        });
        $scope.selectTaskList = activeAlert;
        $scope.$apply();
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
          $scope.customersList = returnObj.data;
          defers[1].resolve("success");
        })
      };
      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      var queryProject = function() {
        projectUIService.findProjectsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            defers[2].resolve("success");
          }
        })
      };
      /**
       * 查询设备
       */
      $scope.devicesList;
      $scope.devicesListDic = {};
      var queryDevices = function() {
        resourceUIService.getDevicesByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.devicesListDic[item.id] = item;
              item.text = item.label;
            })
            $scope.devicesList = returnObj.data;
            defers[3].resolve("success");
          }
        })
      };
      /**
       * 查询用户
       */
      $scope.enterpriseList;
      $scope.enterpriseListDic = {};
      var queryEnterprise = function() {
        userEnterpriseService.queryEnterpriseUser(function(returnObj) {
          if(returnObj.code == 0) {
            var arr = [];
            returnObj.data.forEach(function(item) {
              $scope.enterpriseListDic[item.userID] = item;
              item.text = item.userName;
              if(item.status == 0){
                arr.push(item);
              }
            })
            $scope.enterpriseList = arr;
            defers[4].resolve("success");
          }
        })
      };
      $scope.addMain = function (v) {
        if(v.id > 0){
          var str = '';
          if (v.operationStatus == 0) {
            str += '未到期';
          } else if (v.operationStatus == 1) {
            str += '待分配';
          } else if (v.operationStatus == 2) {
            str += '已分配';
          } else if (v.operationStatus == 3) {
            str += '待执行';
          } else if (v.operationStatus == 4) {
            str += '已完成';
          }

          v["operationName"] =str;
          $scope.objMain =  jQuery.extend(true, {}, v);
        }else{
          initObj();
        }
        ngDialog.open({
          template: '../partials/dialogue/add_maintenance.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      }
      /**
       *  查询列表
       */
      var queryData = function(queryObj) {
        // $scope.loaderValue = "";
        maintenanceTaskUIService.getTaskByCondition(queryObj, function(resultObj) {
          if(resultObj.code == 0) {
            $scope.taskList = resultObj.data;
            $scope.$broadcast("MAINTENANCE", {
              data: $scope.taskList
            });
          }
        });
      };
      var dataCheck = function (startDate,endDate) {
        var date1 = new Date(Date.parse(endDate.replace("-", "/")));
        var date2 = new Date(Date.parse(startDate.replace("-", "/")));
        return date1 < date2;
      }
      $scope.doAction = function(type, select, callback) {
        if(type == "save"){
          if(!$scope.objMain.customerId && $scope.baseConfig.customerConfig.display && $scope.baseConfig.customerConfig.check) {
            growl.warning("请选择客户", {});
            return;
          }
          if(!$scope.objMain.projectId && $scope.baseConfig.projectConfig.display && $scope.baseConfig.projectConfig.check) {
            var str = $scope.menuitems['S13'].label?$scope.menuitems['S13'].label:'项目';
            growl.warning("请选择"+str+"", {});
            return;
          }
          if($scope.objMain.id > 0){
            var newData = new Date($scope.objMain.nextExecutionTime).Format("yyyy-MM-dd hh:mm:ss");
            var currentDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var ckTime = dataCheck(newData,currentDate);
            if(ckTime == false){
              growl.warning("您选择的时间小于当前时间",{})
              return;
            }
            for(var i in $scope.taskList) {
              if($scope.taskList[i].id != 0 && ($scope.objMain.id != $scope.taskList[i].id  && $scope.objMain.name == $scope.taskList[i].name)) {
                growl.warning("计划名称不能重复", {});
                return;
              }
            }
            $scope.isLoading =true;
            maintenanceTaskUIService.updateMaintenanceTask($scope.objMain, function(returnObj) {
              $scope.isLoading =false;
              if(returnObj.code == 0) {
                growl.success("保存成功", {});
                for(var j in $scope.taskList) {
                  if($scope.taskList[j].id == $scope.objMain.id) {
                    $scope.taskList[j] = returnObj.data;
                    break;
                  }
                }
                $scope.$broadcast("MAINTENANCE", {
                  data: $scope.taskList
                });
                $scope.closeDialog();
              }
            });
          }else{
            var newData = new Date($scope.objMain.firstExecutionTime).Format("yyyy-MM-dd");
            var ckTime = checkDate(newData);
            if(ckTime == false){
              growl.warning("您选择的时间小于当前时间",{})
              return;
            }
            for(var i in $scope.taskList) {
              if($scope.taskList[i].id != 0 && $scope.objMain.name == $scope.taskList[i].name) {
                growl.warning("计划名称不能重复", {});
                return;
              }
            }
            $scope.isLoading =true;
            maintenanceTaskUIService.addMaintenanceTask($scope.objMain, function(returnObj) {
              $scope.isLoading =false;
              if(returnObj.code == 0) {
                growl.success("保存成功", {});
                $scope.taskList.push(returnObj.data);
                $scope.$broadcast("MAINTENANCE", {
                  data: $scope.taskList
                });
                $scope.closeDialog();

              }
            });
          }
        }else if(type == "delete"){
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认要删除维保计划吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                maintenanceTaskUIService.deleteTask(select.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    growl.success("删除成功", {});
                    callback(true);
                   /* if(resultObj.data.failObj.length > 0){
                      growl.warning("该维保计划已产生工单，不可删除！", {});
                      callback(false);
                    };
                    if(resultObj.data.successObj.length > 0){
                      growl.success("删除成功", {});
                      callback(true);
                    }*/
                    for(var j in $scope.taskList) {
                      if($scope.taskList[j].id == select.id) {
                        $scope.taskList.splice(j, 1);
                      }
                    }
                    // $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
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
        }else if(type == "delete2"){
          maintenanceTaskUIService.deleteMaintenanceTask([select], function (returnObj) {
            if (returnObj.code == 0) {
              var successObj = returnObj.data.successObj;
              for (var i = 0; i < $scope.taskList.length; i++) {
                for (var j = 0; j < successObj.length; j++) {
                  if ($scope.taskList[i].id == successObj[j]) {
                    $scope.taskList.splice(i, 1);
                    i--;
                    break;
                  }
                }
              }
              $scope.$broadcast("MAINTENANCE", {
                data: $scope.taskList
              });
              growl.success("成功确认" + returnObj.data.successObj.length + "个,失败" + returnObj.data.failObj.length + "个", {});
            } else {
              growl.success("成功确认" + returnObj.data.successObj.length + "个,失败" + returnObj.data.failObj.length + "个", {});
            }
          });
        }
      }
      $scope.modifyStatus = function(status){
        var selTask = [];
        for(var b in $scope.selectTaskList){
          if($scope.selectTaskList[b].taskStatus != status){
            selTask.push($scope.selectTaskList[b].id);
          }
        }

        var str = '';
        if (status == 0) {
          str += '启用';
        } else if (status == 1) {
          str += '停用';
        }
        if(selTask.length > 0){
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认'+str+'这' + selTask.length + '个计划吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                maintenanceTaskUIService.modifyStatus([selTask,status], function(returnObj) {
                  if(returnObj.code == 0) {
                    for(var i in $scope.taskList) {
                      returnObj.data.successObj.forEach(function(gate){
                        if($scope.taskList[i].id == gate) {
                          $scope.taskList[i].taskStatus = status;;
                          return true;
                        }
                      });
                      $scope.taskList[i].selected = false;
                    }
                    $scope.selectTaskList = [];
                    $scope.selectStatusList.disableList = [];
                    $scope.selectStatusList.startList = [];
                    // $scope.selectedHandler();
                    $scope.$broadcast("MAINTENANCE", {
                      data: $scope.taskList
                    });
                    growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
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
        }else {
          growl.warning("没有要"+str+"的维保计划",{})
        }
      }
    //查询条件事件
      $scope.goSearch = function(search) {
        var v = {};
        if($scope.queryDitem.state > 0) {
          v[$scope.queryDitem.attributeName] = $scope.loaderValue;
          queryData(v);
        } else {
          if(search == "s"){
            v['name'] = $scope.loaderValue;
          }

          if(mainId && $scope.queryDitem.state == undefined){
            v["id"] = mainId;
          }
          queryData(v);
        }
      };
      
      $scope.statusSave = function (obj,status,callback) {
        var str = '';
        if (status == 0) {
          str += '启用';
        } else if (status == 1) {
          str += '停用';
        }
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '确认'+ str + '这个计划吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              maintenanceTaskUIService.modifyStatus([obj,status], function(returnObj) {
                if(returnObj.code == 0) {
                  for(var i in $scope.taskList) {
                    returnObj.data.successObj.forEach(function(gate){
                      if($scope.taskList[i].id == gate) {
                        $scope.taskList[i].taskStatus = status;;
                        return true;
                      }
                    });
                  }
                  callback(true);
                  growl.success("操作成功", {});
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
      /**
       * 初始化
       */
      var init = function () {
        queryCustomer();
        getProcedure();
        queryProject();
        queryEnterprise();
        queryDevices();
        for(var i in defers) {
          promises.push(defers[i].promise);
        }
        //所有延迟加载完成后操作
        q.all(promises).then(function(data) {
          $scope.goSearch();
        });
      }
    /**
       * 标准的登录状态判定
       * 登陆后执行初始化init方法
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
  controllers.initController('maintenanceCalendarCtrl', ['$scope', '$q', 'ngDialog', '$location', '$routeParams', '$timeout','maintenanceTaskUIService','customerUIService','projectUIService',
    'kpiDataService', 'resourceUIService', 'growl', 'userLoginUIService', 'ticketCategoryService', 'userEnterpriseService', 'Info', '$route',
    function ($scope, q, ngDialog, $location, $routeParams, $timeout,maintenanceTaskUIService,customerUIService,projectUIService, kpiDataService, resourceUIService, growl, userLoginUIService, ticketCategoryService, userEnterpriseService, Info, $route) {
      $scope.executioner = '';
      var id = $routeParams.id;
      var person = $routeParams.person;
      $scope.taskList = [];
      $scope.selectList = [];
      /**
       * 查询用户
       */
      $scope.enterpriseList;
      $scope.enterpriseListDic = {};
      var queryEnterprise = function() {
        userEnterpriseService.queryEnterpriseUser(function(returnObj) {
          if(returnObj.code == 0) {
            var arr = [];
            returnObj.data.forEach(function(item) {
              $scope.enterpriseListDic[item.userID] = item;
              item.text = item.userName;
              if(item.status == 0){
                arr.push(item);
              }
            })
            $scope.enterpriseList = arr;
            if(person > 0){
              $scope.executioner = parseInt(person);
              queryData({"nextExecutioner":$scope.executioner},"execut");
            }else{
              queryData({"id":id},"init");
            }
          }
        })
      };

      $scope.serarchObj = {"nextExecutioner":"","nextExecutionTime":""};
      $scope.update = function (data,callback) {
        maintenanceTaskUIService.updateMaintenanceTask(data, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.taskList = returnObj.data;
            callback(true);
          }
        });
      }
      $scope.changeUser = function () {
        var t = {"nextExecutioner":$scope.executioner};
        if($scope.executioner){
          maintenanceTaskUIService.getTaskByCondition(t, function(resultObj) {
            if(resultObj.code == 0) {
              $scope.taskList = resultObj.data;
            }
          });
        }else{
          $scope.taskList = [];
        }
      }
      var queryData = function(queryObj,queryStatus){
        maintenanceTaskUIService.getTaskByCondition(queryObj, function(resultObj) {
          if(resultObj.code == 0) {
            if(queryStatus == 'init'){
              $scope.selectList = resultObj.data;
              $scope.taskList = resultObj.data;
            }else if(queryStatus == "execut"){
              $scope.taskList = resultObj.data;
              resultObj.data.forEach(function(item) {
               if(item.nextExecutioner == $scope.executioner){
                 $scope.selectList = [item];
               }
              });

            }else{
              $scope.taskList = resultObj.data;
            }
          }
        });
      };
      /**
       * 标准的登录状态判定
       * 登陆后执行初始化init方法
       */
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            queryEnterprise();
          }
        });
      } else {
        queryEnterprise();
      }
    }
  ]);
  controllers.initController('recordConditionCtrl', ['$scope', '$q', 'ngDialog', '$location', '$routeParams', '$timeout','maintenanceTaskUIService','customerUIService','projectUIService',
    'kpiDataService', 'resourceUIService', 'growl', 'userUIService', 'userLoginUIService', 'ticketCategoryService', 'userEnterpriseService', 'ticketTaskService', '$route',
    function ($scope, q, ngDialog, $location, $routeParams, $timeout,maintenanceTaskUIService,customerUIService,projectUIService, kpiDataService, resourceUIService, growl, userUIService, userLoginUIService, ticketCategoryService, userEnterpriseService, ticketTaskService, $route) {
      var promises = []; //已加载列表
      var defers = []; //延期列表
      var conditionId = $routeParams.id;
      $scope.templateAddress = "";
      $scope.urlService = userUIService.uploadFileUrl;
      $scope.detail = {"taskStatus":0};
      $scope.querySearch = {"modelId":"","type":"","deviceName":"","serverType":""};
      $scope.routePathNodes = {}; //模型树形字典
      for(var i = 0; i < 4; i++) {
        defers.push(q.defer());
      };
      $scope.modelListSelect; //模型的
      //查询该用户的所有模型
      $scope.modelList = function() {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.modelListSelect = returnObj.data;
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
            $scope.rootModel = resourceUIService.rootModel;
            $scope.rootModelDic = resourceUIService.rootModelDic;
            defers[0].resolve("success");
          }
        });
      };
      /**
       * 查询设备
       */
      $scope.devicesList;
      $scope.devicesListDic = {};
      var queryDevices = function() {
        resourceUIService.getDevicesByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.devicesListDic[item.id] = item;
              item.text = item.label;
            })
            $scope.devicesList = returnObj.data;
            defers[2].resolve("success");
          }
        })
      };
      $scope.saveCondition = function () {
        maintenanceTaskUIService.saveMaintenanceRecord($scope.recordList,function (res) {
          if(res.code == 0){
            growl.success("保存成功",{});
          }
        });
      }
      var ticketTask = function (taskId) {
        if(taskId && taskId != undefined){
          ticketTaskService.getTicketTaskById(taskId,function (resultObj) {
            if(resultObj.code == 0){
              $scope.detail.taskStatus = resultObj.data.taskStatus;
              $scope.sparePartsInitList = resultObj.data.values.stockOrderItemList;
              // $scope.$broadcast(Event.WORKORDERRECORDINIT+"_deviceTask", $scope.sparePartsInitList);
              $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", {
                "data": $scope.sparePartsInitList
              });
            }
          });
        }
      }
      /**
       *  查询列表
       */
      var queryData = function(queryObj) {
        // $scope.loaderValue = "";
        maintenanceTaskUIService.getRecordByCondition(queryObj, function(resultObj) {
          if(resultObj.code == 0) {
            if(conditionId){
              $scope.recordList = resultObj.data[0];
              if($scope.recordList.templateURL){
                var sp = $scope.recordList.templateURL.split('/');
                $scope.templateAddress = sp[sp.length-1];
              }
              if($scope.templateAddress == 'spare'){
                ticketTask(resultObj.data[0].ticketTaskId);
              }

            }else{
              $scope.recordList = resultObj.data;
              $scope.$broadcast("RECORD", {
                data: $scope.recordList
              });
            }
          }
        });
      };
      /**
       * 查询用户
       */
      $scope.enterpriseList;
      $scope.enterpriseListDic = {};
      var queryEnterprise = function() {
        userEnterpriseService.queryEnterpriseUser(function(returnObj) {
          if(returnObj.code == 0) {
            var arr = [];
            returnObj.data.forEach(function(item) {
              $scope.enterpriseListDic[item.userID] = item;
              item.text = item.userName;
              if(arr.status == 0){
                arr.push(item);
              }
            })
            $scope.enterpriseList = arr;
            defers[3].resolve("success");
          }
        })
      };
      //获取工单流程
      $scope.processTypeDic = {};
      var getProcedure = function() {
        ticketCategoryService.getTicketCategorys(function(returnObj) {
          if (returnObj.code == 0) {
            var arr1 = [];
            for (var i in returnObj.data) {
              if (returnObj.data[i].category == 40) { //维保工单
                arr1.push(returnObj.data[i]);
              }
            }
            arr1.forEach(function(item) {
              $scope.processTypeDic[item.id] = item;
              item.text = item.name;
            })
            $scope.processType = arr1;
            defers[1].resolve("success");
          }
        })
      };
      $scope.goSearch = function () {
        var serarch = {};
        if($scope.querySearch.modelId){
          serarch["modelId"] = $scope.querySearch.modelId;
        };
        if($scope.querySearch.type){
          serarch["type"] = $scope.querySearch.type;
        };
        if($scope.querySearch.deviceName){
          serarch["deviceName"] = $scope.querySearch.deviceName;
        };
        if($scope.querySearch.serviceType){
          serarch["serverType"] = $scope.querySearch.serviceType;
        }
        queryData(serarch);
      };
      $scope.goClear = function () {
        $scope.querySearch = {"modelId":"","type":"","deviceName":"","serviceType":""};
      };
      var init = function () {
        $scope.modelList();
        getProcedure();
        queryDevices();
        queryEnterprise();
        for(var i in defers) {
          promises.push(defers[i].promise);
        }
        //所有延迟加载完成后操作
        q.all(promises).then(function(data) {
          if(conditionId){
            queryData({"id":conditionId});
          }else{
            queryData({});
          }
        });
      }
      /**
       * 标准的登录状态判定
       * 登陆后执行初始化init方法
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
});