define(['controllers/controllers', 'bootstrap-dialog', 'bootstrap-multiselect'], function (controllers, BootstrapDialog, bootstrapMultiselect) {
  'use strict';
  controllers.initController('WorkOrderProcedureCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'viewFlexService',
    'kpiDataService', 'resourceUIService', 'growl', 'userLoginUIService', 'processService', 'userEnterpriseService', 'Info', '$route',
    function ($scope, $location, $routeParams, $timeout, viewFlexService, kpiDataService, resourceUIService, growl, userLoginUIService, processService, userEnterpriseService, Info, $route) {
      console.log('进入工单流程Copy');
      $scope.isEditing = false;
      $scope.procedureData = [];
      $scope.taskConfs = [];
      var previousTab;
      var procedureModel;
      var procedureStepBk;
      var info = Info.get("localdb/procedure.json", function (info) {
        $scope.procedureStep = info.procedureStep; //5步工单枚举
        $scope.workOrderType = $scope.myDicts['ticketCategory']; //工单分类枚举
        procedureModel = info.procedureStepBk;
        $scope.procedureModel = info.procedureStep;
      });
      /**
       * 五步流程数据默认名字
       * @return {[type]} [description]
       */
      $scope.initProcedureStep = function () {
        var procedureStepBk = [{
          "id": 4011,
          "dictCode": "systemProcessTemplate",
          "valueCode": "oneStep",
          "label": "一步工单",
          "name": "流程任务1",
          "param": 1
        }, {
          "id": 4012,
          "dictCode": "systemProcessTemplate",
          "valueCode": "twoStep",
          "label": "二步工单",
          "name": "流程任务2",
          "param": 2
        }, {
          "id": 4013,
          "dictCode": "systemProcessTemplate",
          "valueCode": "threeStep",
          "label": "三步工单",
          "name": "流程任务3",
          "param": 3
        }, {
          "id": 4014,
          "dictCode": "systemProcessTemplate",
          "valueCode": "fourStep",
          "label": "四步工单",
          "name": "流程任务4",
          "param": 4
        }, {
          "id": 4015,
          "dictCode": "systemProcessTemplate",
          "valueCode": "fiveStep",
          "label": "五步工单",
          "name": "流程任务5",
          "param": 5
        }];
        $scope.procedureModel = procedureStepBk;
      }
      $scope.stepNumber = [{
        "name": "a",
        "value": 1
      }, {
        "name": "b",
        "value": null
      }, {
        "name": "c",
        "value": null
      }, {
        "name": "d",
        "value": null
      }, {
        "name": "e",
        "value": null
      },];
      //点击编辑工单流程
      $scope.initStepData = function (length) {
        for (var i = 0; i < length; i++) {
          $scope.stepNumber[i].value = i + 1;
        }
      }
      $scope.procedureItem = {
        "label": "",
        "category": "",
        "desc": "",
        "id": "",
        "domainPath": "",
        "processTemplateKey": ""
      }
      $scope.taskConfsObj = {
        "name": "",
        "userType": "user",
        "providerId": null,
        "userIds": null,
        "userGroupIds": null,
        "sendEmail": true,
        "sendSms": true,
        "sendPsMessage": false
      }
      //工单流程任务的前后步
      $scope.operation = {
        "prev": null,
        "now": 0
      }
      /**
       * 获取用户
       */
      function getUser() {
        userEnterpriseService.queryEnterpriseUser(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              $scope.userData = returnObj.data;
            } else {
              $scope.userData = [];
            }
          }
        })
      }

      /**
       * 获取用户组
       */
      function getUserGroup() {
        userEnterpriseService.queryEnterpriseGroup(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              $scope.groupData = returnObj.data;
            } else {
              $scope.groupData = [];
            }
          }
        })
      }

      /**
       * 获取设备供应商
       */
      function getSupplier() {
        userEnterpriseService.querySupplier(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length != 0) {
              $scope.providerData = returnObj.data;
            } else {
              $scope.providerData = [];
            }
          }
        })
      }

      /**
       * multi-select全选到右侧
       */
      $scope.selectAll2Right = function () {
        var length;
        var taskConfsObj = $scope.taskConfsObj;
        if (taskConfsObj.userType == 'user') {
          var arr = [];
          if ($scope.userData != []) {
            for (var i in $scope.userData) {
              arr.push(String($scope.userData[i].userID));
            }
          }
          taskConfsObj.userIds = arr;
          $scope.taskConfsObj.userIds = arr;
          length = taskConfsObj.userIds.length;
        } else if (taskConfsObj.userType == 'group') {
          var arr = [];
          if ($scope.groupData != []) {
            for (var i in $scope.groupData) {
              arr.push(String($scope.groupData[i].groupID));
            }
          }
          taskConfsObj.userGroupIds = arr;
          $scope.taskConfsObj.userGroupIds = arr;
          length = taskConfsObj.userGroupIds.length;
        } else if (taskConfsObj.userType == 'provider') {
          var providerId;
          if ($scope.providerData != []) {
            providerId = $scope.providerData;
          }
          $scope.taskConfsObj.providerId = providerId
          length = taskConfsObj.providerId.length;
        }
        if (length >= 0) {
          $('.my-select-' + $scope.taskConfsObj.userType).multiSelect('select_all');
        }
      }
      /**
       * 全选到左侧
       *
       */
      $scope.selectAll2Left = function () {
        $('.my-select-' + $scope.taskConfsObj.userType).multiSelect('deselect_all');
      }
      /**
       * 新建工单流程
       */
      $scope.addProcedure = function () {
        if ($scope.isEditing == false) {
          $scope.isEditing = true;
          $scope.operation.prev = 0;
          $scope.operation.now = 0;
          //将所有相关数据清空
          $scope.taskConfs = [];
          $scope.initProcedureStep();
          $scope.currentEditIndex = 1;
          $scope.stepNumber = [{
            "name": "a",
            "value": 1
          }, {
            "name": "b",
            "value": null
          }, {
            "name": "c",
            "value": null
          }, {
            "name": "d",
            "value": null
          }, {
            "name": "e",
            "value": null
          },];
          //流程名称类型描述数据清空
          $scope.procedureItem = {
            "label": "",
            "category": "",
            "desc": ""
          }
          //正在操作的流程任务清空
          $scope.taskConfsObj = {
            "name": "",
            "userType": "user",
            "providerId": null,
            "userIds": null,
            "userGroupIds": null,
            "sendEmail": true,
            "sendSms": true,
            "sendPsMessage": false
          }
          var newObj = {
            id: '',
            label: "",
            domainPath: '',
            category: '',
            processTemplateKey: '',
            desc: "",
            taskConfs: [],
            isEditing: true,
            isEdit: 1
          }; //isEdit 1-新建 2-编辑
          $scope.procedureData.unshift(newObj);
          $scope.$broadcast(Event.WORKORDERTYPEINIT, $scope.procedureData);
        } else {
          growl.warning("当前有正在编辑的工单流程", {});
        }
      }
      // $scope.$watch('taskConfsObj.userType', function(newValue, oldValue) {
      //     console.log("监听用户单选按钮");
      //     console.log(newValue);
      //     $scope.userType = newValue;
      //     $scope.initDefaultSelect()
      //     if (newValue == 'user') {
      //       $scope.taskConfsObj.userIds = $scope.taskConfsObj.userIds ? $scope.taskConfsObj.userIds : [];
      //       $scope.taskConfsObj.userGroupIds = null;
      //       $scope.taskConfsObj.providerId = null;
      //       $scope.taskConfsObj.userType = 'user';
      //     } else if (newValue == 'group') {
      //       $scope.taskConfsObj.userIds = null;
      //       $scope.taskConfsObj.userGroupIds = $scope.taskConfsObj.userGroupIds ? $scope.taskConfsObj.userGroupIds : [];
      //       $scope.taskConfsObj.providerId = null;
      //       $scope.taskConfsObj.userType = 'group';
      //     } else if (newValue == 'provider') {
      //       $scope.taskConfsObj.userIds = null;
      //       $scope.taskConfsObj.userGroupIds = null;
      //       $scope.taskConfsObj.providerId = $scope.taskConfsObj.providerId ? $scope.taskConfsObj.providerId : null;
      //       $scope.taskConfsObj.userType = 'provider';
      //     }
      //     console.log("userType : " + $scope.taskConfsObj.userType);
      //   });
      $scope.initDefaultSelect = function () {
        $('.my-select-user').multiSelect('deselect_all');
        $('.my-select-group').multiSelect('deselect_all');
        $('.my-select-provider').multiSelect('deselect_all');
        return false;
      }
      /**
       * 添加工单流程任务
       */
      $scope.addStep = function () {
        var arr = [];
        if ($scope.taskConfsObj.userType == 'user') {
          arr = $scope.taskConfsObj.userIds;
        } else if ($scope.taskConfsObj.userType == 'group') {
          arr = $scope.taskConfsObj.userGroupIds;
        } else if ($scope.taskConfsObj.userType == 'provider') {
          arr = $scope.taskConfsObj.providerId;
        }
        if (arr != null && arr.length != 0) {
          if ($scope.stepNumber[4].value == 5) {
            growl.warning("最多只能添加5个工单流程任务", {});
            return;
          } else {
            for (var i in $scope.stepNumber) {
              if ($scope.stepNumber[i].value == null) {
                $scope.stepNumber[i].value = parseInt(i) + 1;
                $scope.currentEditIndex = parseInt(i);
                $scope.saveTaskConfs($scope.currentEditIndex);
                $scope.taskConfsObj.userIds = [];
                $scope.initDefaultSelect();
                $(".nav-tabs-custom>ul li").removeClass('active');
                $(".nav-tabs-custom>ul li").eq($scope.currentEditIndex - 1).addClass('active');
                //              $scope.changeMultiSelect();
                return;
              }
            }
          }
        } else {
          growl.warning("请选择任务处理人", {});
          return;
        }
      }
      /**
       * 删除工单流程任务
       */
      $scope.deleteStep = function () {
        for (var i in $scope.stepNumber) {
          if (4 - i == 0) {
            growl.warning("至少要有一个流程任务", {});
          } else {
            $scope.initDefaultSelect();
            if ($scope.stepNumber[4 - i].value != null) {
              $scope.stepNumber[4 - i].value = null;
              $(".nav-tabs-custom>ul li").removeClass('active');
              $(".nav-tabs-custom>ul li").eq($scope.currentEditIndex).addClass('active');
              var taskConfs = $scope.taskConfs;
              taskConfs.splice($scope.currentEditIndex - 1, 1);
              $scope.taskConfs = taskConfs;
              for (var i in taskConfs) {
                $scope.procedureModel[i].name = taskConfs[i].name;
              }
              $scope.operation.now = $scope.taskConfs.length - 1;
              $scope.taskConfsObj = $scope.taskConfs[$scope.operation.now];
              $scope.currentEditIndex = $scope.operation.now + 1;
              $(".nav-tabs-custom ul li").removeClass('active');
              $(".nav-tabs-custom ul li").eq($scope.operation.now).addClass('active');
              if ($scope.taskConfsObj.userType == 'user' && $scope.taskConfsObj.userIds) {
                $scope.initSelectUser($scope.taskConfsObj.userIds);
              } else if ($scope.taskConfsObj.userType == 'group' && $scope.taskConfsObj.userGroupIds) {
                $scope.initSelectGroup($scope.taskConfsObj.userGroupIds);
              }
              return;
            }
          }
        }
      }
      /**
       * 保存工单流程任务
       */
      $scope.currentEditIndex = 1;
      $scope.operation.prev = 0;
      $scope.operation.now = 0;
      $scope.saveTaskConfs = function (index) {
        $scope.operation.prev = $scope.operation.now;
        $scope.operation.now = index;
        var taskConfs = $scope.taskConfs;
        var obj = $scope.taskConfsObj;
        obj.name = $scope.procedureModel[$scope.operation.prev].name;
        taskConfs[$scope.operation.prev] = obj;
        $scope.taskConfs = taskConfs;
        //更新当前步骤数据
        if ($scope.taskConfs[index]) {
          $scope.taskConfsObj = $scope.taskConfs[index];
          $scope.userType = $scope.taskConfsObj.userType;
          if ($scope.taskConfsObj.userType == 'user') {
            var arr = [];
            for (var i in $scope.taskConfsObj.userIds) {
              if (typeof($scope.taskConfsObj.userIds[i]) != 'string') {
                arr[i] = $scope.taskConfsObj.userIds[i].toString();
              } else {
                arr[i] = $scope.taskConfsObj.userIds[i]
              }
            }
            $scope.initDefaultSelect();
            $scope.initSelectUser(arr);
          } else if ($scope.taskConfsObj.userType == 'group') {
            var arr = [];
            for (var i in $scope.taskConfsObj.userGroupIds) {
              if (typeof($scope.taskConfsObj.userGroupIds[i]) != 'string') {
                arr[i] = $scope.taskConfsObj.userGroupIds[i].toString();
              } else {
                arr[i] = $scope.taskConfsObj.userGroupIds[i]
              }
            }
            $scope.initDefaultSelect();
            $scope.initSelectGroup(arr);
          } else if ($scope.taskConfsObj.userType == 'provider') {
            var arr = $scope.taskConfsObj.providerId.toString();
            $scope.initSelectProvider(arr);
          }
        } else {
          $scope.taskConfsObj = {
            "name": "",
            "userType": "user",
            "providerId": null,
            "userIds": null,
            "userGroupIds": null,
            "sendEmail": true,
            "sendSms": true,
            "sendPsMessage": false
          };
        }
        $scope.currentEditIndex = index + 1;
      }
      /**
       * 保存工单流程
       */
      $scope.saveProcedure = function () {
        var userids = $scope.taskConfsObj.userIds;
        var usergroupids = $scope.taskConfsObj.userGroupIds;
        var providerid = $scope.taskConfsObj.providerId;
        if ($scope.procedureItem.label == "" || $scope.procedureItem.label == null || $scope.procedureItem.label == undefined) {
          growl.warning("请填写流程名称", {});
          return;
        } else if ($scope.procedureItem.category == null || $scope.procedureItem.category == "") {
          growl.warning("请选择工单类型", {});
          return;
        }
        if ($scope.taskConfsObj.userType == 'user') {
          if (userids == null || userids.length == 0) {
            growl.warning("请选择任务处理人", {});
            return;
          }
        } else if ($scope.taskConfsObj.userType == 'group') {
          if (usergroupids == null || usergroupids.length == 0) {
            growl.warning("请选择任务处理人", {});
            return;
          }
        }
        if ($scope.procedureModel[$scope.operation.now].name == "" || $scope.procedureModel[$scope.operation.now].name == null) {
          growl.warning("请填写流程任务名称", {});
          return;
        }
        //保存最近一次的工单流程编辑数据
        $scope.saveTaskConfs($scope.operation.now);
        $scope.taskConfs.name = $scope.procedureItem.label;
        var taskConfs = $scope.taskConfs;
        var processDefinition = $scope.procedureItem;
        processDefinition.taskConfs = taskConfs;
        for (var i in processDefinition.taskConfs) {
          if (!processDefinition.taskConfs[i]) {
            delete processDefinition.taskConfs[i]
          }
        }
        processService.saveProcessDefinition(processDefinition, function (returnObj) {
          if (returnObj.code == 0) {
            if (processDefinition.id) {
              growl.success("修改工单流程成功", {});
            } else {
              growl.success("新建工单流程成功", {});
            }
            $scope.isEditing = false;
            initProcessDefinitions();
            $scope.taskConfs = []; //清空数据
            $scope.operation.prev = 0;
            $scope.operation.now = 0;
          }
        });
      }
      /**
       * 处理Table数据
       */
      $scope.doAction = function (type, select) {
        if (type == 'save') {
        } else if (type == 'editError') {
          growl.warning(select, {});
          return;
        } else if (type == 'delete') {
          if ($scope.isEditing == true) {
            $scope.isEditing == false;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除工单流程 ' + select.label + ' 吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                var id = select.id;
                processService.deleteProcessDefinitionById(id, function (returnObj) {
                  if (returnObj.code == 0) {
                    //删除后刷新局部
                    initProcessDefinitions();
                    $scope.initProcedureStep();
                    $scope.isEditing = false;
                    $scope.procedureModel = procedureStepBk;
                    growl.success("删除工单流程成功", {});
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (type == 'cancel') {
          $scope.isEditing = false;
          initProcessDefinitions();
          growl.success(select, {});
          $scope.operation.prev = 0;
          $scope.operation.now = 0;
          $scope.isEditing = false;
        }
      }
      //监测Tab页的变换
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        $scope.activeTab = $(e.target).text();
        // 获取前一个激活的标签页的名称
        previousTab = $(e.relatedTarget).text();
      });
      /**
       * 初始化工单类型定义
       */
      function initProcessDefinitions() {
        processService.getProcessDefinitions(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.length != 0) {
              $scope.procedureData = returnObj.data;
            } else {
              $scope.procedureData = [];
            }
            $scope.$broadcast(Event.WORKORDERTYPEINIT, $scope.procedureData);
          }
        })
      };
      function init() {
        if (!userLoginUIService.user.isAuthenticated) {
          $scope.$on('loginStatusChanged', function (evt, d) {
            if (userLoginUIService.user.isAuthenticated) {
              getSupplier();
              getUserGroup();
              getUser();
              initProcessDefinitions();
            }
          });
        } else {
          getSupplier();
          getUserGroup();
          getUser();
          initProcessDefinitions();
        }
      }

      init();
    }
  ]);
  controllers.initController('workFlowCtrl', ['$scope', '$q', 'ticketCategoryService', '$location', 'workflowService', '$timeout', 'userRoleUIService',
    'kpiDataService', 'resourceUIService', 'growl', 'userLoginUIService', 'processService', 'userEnterpriseService', 'Info', 'reportFlexService',
    function ($scope, q, ticketCategoryService, $location, workflowService, $timeout, userRoleUIService, kpiDataService, resourceUIService, growl, userLoginUIService, processService, userEnterpriseService, Info, reportFlexService) {
      $scope.workOrderType = "";
      $scope.flows = "";
      var uuid = Math.uuid();
      //一些下拉框的model值选择
      $scope.flowList = {
        "workflowId": "",
        "category": "",
        "userSelect": "",
        "roleSelect": "",
        "expressionSelect": "",
        "userType": "",
        "taskId": "",
        "assignedUser": "",
        "reportTemplateId": "",
        "roleUser": [],
        "allUser": {},
        "groupUser": {},
        "taskArry": {}
      };
      $scope.handerConfsData = {};
      var defers = [];
      for (var i = 0; i < 1; i++) {
        defers.push(q.defer());
      }
      $scope.configureFlow = [];
      $scope.flowListDic = {};
      var updateView = function (param,fun) {
        var handerConfsList = [];
        var handerConfs = $scope.handerConfsData;
        for(var i in handerConfs){
         /* if(handerConfs[i].userType == "role"){
            if($scope.flowList.roleUser <= 0){
              growl.warning("您的'"+handerConfs[i].taskName+"'任务下面角色没有用户请去用户管理分配",{});
              return;
            }
          }else if(handerConfs[i].userType == "groupUser"){
            if($scope.flowList.roleUser <= 0){
              growl.warning("您的'"+handerConfs[i].taskName+"'任务下面用户组没有用户请去用户组管理分配",{});
              return;
            }
          }*/
          handerConfsList.push(handerConfs[i]);
        }
        param.handerConfs = handerConfsList;
        if(param.isEdit == 3){
          param.id = 0;
        }
        ticketCategoryService.saveTicketCategory(param, function (returnObj) {
          if (returnObj.code == 0) {
            if (param.isEdit == 3) {
              for (var i in $scope.configureFlow) {
                if ($scope.configureFlow[i].isEdit == 3) {

                  $scope.configureFlow[i].isEdit = 0;
                  $scope.configureFlow[i] = returnObj.data;
                  break;
                }
              }
            } else {
              for (var i = $scope.configureFlow.length - 1; i > -1; i--) {
                if ($scope.configureFlow[i].id == returnObj.data.id) {
                  $scope.configureFlow[i] = returnObj.data;
                }
              }
            }
            $scope.$broadcast('WORKFLOW', $scope.configureFlow);
            if(param.id > 0){
              growl.success("编辑成功");
            }else{
              growl.success("添加成功");
            }
          }
        });
      }
      //通过角色id查用户
      $scope.roleIdUser = function () {
        var roleId = $scope.handerConfsData[$scope.flowList.taskId].roleIds;
        var rList = [{"roleID": "" + roleId + ""}];
        userRoleUIService.getAssociateRole2User(rList, function (res) {
          if (res.code == 0) {
            $scope.flowList.roleUser = res.data;
          }
        });
      };
      //获取当前用户下面的所有用户
      $scope.allUser = function(){
        userEnterpriseService.queryEnterpriseUser(function (res) {
          if (res.code == 0) {
            for(var i in res.data){
              $scope.flowList.allUser[res.data[i].userID] = res.data[i];
            }
          }
        });
      };
      //获取用户组用户
      $scope.allGroupUser = function(){
        var groupId = $scope.handerConfsData[$scope.flowList.taskId].userGroupIds;
        userEnterpriseService.queryGroupUser(groupId,function (res) {
          if (res.code == 0) {
            $scope.flowList.groupUser = res.data;
          }
        });
      }
      $scope.addViews = function () {
        var newObj = {
          id: uuid,
          workflowId: "",
          name: "",
          desc: "",
          category: "",
          createTime:new Date(),
          //handerConfs:"",
          isEdit: 3
        }
        $scope.flowList.category = "";
        $scope.flowList.workflowId = "";
        for (var i in $scope.configureFlow) {
          if ($scope.configureFlow[i].id == null || $scope.configureFlow[i].isEdit > 1) {
            growl.warning("当前有未保存的数据，请先保存",{})
            return;
          }
        }
        $scope.configureFlow.push(newObj);
        $scope.$broadcast('WORKFLOW', $scope.configureFlow);
      }
      $scope.doAction = function (flg, rowData, fun) {
        if (flg == "attr-delete") {
          //删除
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除流程关联吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                ticketCategoryService.deleteTicketCategoryById([rowData.id], function (returnObj) {
                  if (returnObj.code == 0) {
                    for (var i = 0; i < $scope.configureFlow.length; i++) {
                      if ($scope.configureFlow[i].id == rowData.id) {
                        $scope.configureFlow.splice(i, 1);
                        break;
                      }
                    }
                    if (fun) {
                      fun(true);
                    }
                    growl.success("流程关联删除成功",{});
                  }
                });
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (flg == "view-save") {
          updateView(rowData,fun);
        } else if (flg == "cancel") {
          ticketCategoryService.getTicketCategorys(function (returnObj) {
            if (returnObj.code == 0) {
              $scope.configureFlow = returnObj.data;
              $scope.$broadcast('WORKFLOW', $scope.configureFlow);
            }
          });
        }
      };
      $scope.tabStatus = function(type,handerConfsData){
        if(handerConfsData){
          $scope.handerConfsData = handerConfsData;
          if (type == "role") {
            $scope.roleIdUser();
          }else if(type == "user"){
            var userAssigned = $scope.handerConfsData[$scope.flowList.taskId].userIds;
            $scope.flowList.assignedUser = $scope.flowList.allUser[userAssigned].userName;
          }else if(type == "group"){
            $scope.allGroupUser();
          }else if(type == "expression"){
            var userExpressionOfCategory = $scope.handerConfsData[$scope.flowList.taskId].userExpressionOfCategory;
            if(userExpressionOfCategory == "" || userExpressionOfCategory == null ){
              $scope.handerConfsData[$scope.flowList.taskId].userExpressionOfCategory = $scope.handerConfsData[$scope.flowList.taskId].userExpression;
            }
          }
        }
      }
      $scope.initEvent = function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var userType = $(e.target).attr("userType");
          var taskId = $(e.target).attr("taskId");
          $scope.flowList.userType = userType;
          $scope.flowList.taskId = taskId;
          $scope.tabStatus(userType,$scope.handerConfsData);
          $scope.$apply();
        });
      };
      $scope.reportTemplates = [];
      $scope.reportTemplatesDic = {};
      var reportInit = function () {
        var obj = {};
        obj["domainPath"] = userLoginUIService.user.domainPath;
        reportFlexService.getReportTemplatesByCondition(obj, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              item.domainPath = item.domain;
              item.fileName = item.tplFileName ? item.tplFileName : item.zipFileName;
              $scope.reportTemplatesDic[item.id] = item;
            });
            $scope.reportTemplates = returnObj.data;
          }
        });
      }
      function initViews() {
        //查询所有已经发布的流程
        workflowService.getWorkflows(function (returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data && returnObj.data != undefined) {
              for (var i in  returnObj.data) {
                $scope.flowListDic[returnObj.data[i].id] = returnObj.data[i];
              }
            }
            $scope.flows = returnObj.data;
            defers[0].resolve("success");
          }
        });
        reportInit();
        Info.get("localdb/procedure.json", function (info) {
          $scope.workOrderType = $scope.myDicts['ticketCategory']; //工单分类枚举
        });
      }
      
      var promises = [];
      for (var i in defers) {
        promises.push(defers[i].promise);
      }
      q.all(promises).then(function (data) {
        console.log("all loaded");
        //查询所有分类跟流程关联的数据
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.configureFlow = returnObj.data;
            $scope.$broadcast('WORKFLOW', $scope.configureFlow);
          }
        });
        $scope.allUser();
      });
      initViews();
    }
  ]);
});