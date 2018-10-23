define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('WorkOrderCtrl', ['$scope', '$q', 'ngDialog', 'resourceUIService', 'workflowService', 'ticketCategoryService', 'alertService', 'SwSocket', 'Info', 'userLoginUIService', 'growl', '$routeParams', 'processService', 'ticketTaskService', 'ticketService', 'customerUIService', 'projectUIService', 'faultKnowledgeUIService', 'linebodyUIService', 'userRoleUIService', 'userDomainService',
    function ($scope, $q, ngDialog, resourceUIService, workflowService, ticketCategoryService, alertService, SwSocket, Info, userLoginUIService, growl, $routeParams, processService, ticketTaskService, ticketService, customerUIService, projectUIService, faultKnowledgeUIService, linebodyUIService, userRoleUIService, userDomainService) {
      var previousTab; //前一个激活的标签tab名称
      $scope.editVisible = false;
      $scope.addOrderShow = false;
      $scope.processType = [];
      $scope.activeTab = "执行中";
      var type = $routeParams.type;
      var id = $routeParams.id;
      $scope.activeListTab = 100;//默认展示执行中
      $scope.formAryList = [];
      $scope.faultKnowledge = {};
      $scope.severiesList = [{
        "severNo": 1,
        "severName": "警告"
      }, {
        "severNo": 2,
        "severName": "次要"
      }, {
        "severNo": 3,
        "severName": "重要"
      }, {
        "severNo": 4,
        "severName": "严重"
      }];

      // 以下为搜索用到得数据
      $scope.selectAlertList = {
        selList: [],
        search: false,       //是否搜索状态
        searchStatus: false
      };

      //工单计数
      $scope.ordercount = {
        "notdeal": 0, // 待处理
        "dealing": 0, // 处理中
        "done": 0     // 已完成
      }

      // 任务来源列表
      $scope.taskSourceList = [
        { id: 1, label: '任务来源1' },
        { id: 2, label: '任务来源2' },
        { id: 3, label: '任务来源3' }
      ];

      // 第一责任人列表
      $scope.firstPersonList = [
        { id: 1, label: '责任人1' },
        { id: 2, label: '责任人2' },
        { id: 3, label: '责任人3' }
      ]

      // 处理人列表
      $scope.handlePersonList = [
        { id: 1, label: '处理人1' },
        { id: 2, label: '处理人2' },
      ];

      // 是否超时
      $scope.isOverTimeList = [
        { id: 1, label: '是' },
        { id: 2, label: '否' },
      ];

      // 筛选数据
      $scope.selectedAlertitem = {
        domain: '', // 厂部
        plant: '',  // 车间
        line: '',   // 线体
        taskSource: '',  // 任务来源
        firstPerson: '', // 第一责任人
        handlePerson: '', // 处理人
        isOverTime: '',  // 是否超时
        startTime: '',
        endTime: '',
      };
      // 搜索数据end

      /**
       * 处理下拉选择的事件
       */
      var handleSelectList = function () {
         // 处理人
         var roleIdUserList = function () {
          var roleId = 355707278930670;//设备保全人员
          var roleId2 = 355707278930671;//生产工艺调试人员
          var rList = [{"roleID": "" + roleId + ""}];
          var rList2 = [{"roleID": "" + roleId2 + ""}];

          userRoleUIService.getAssociateRole2User(rList, function (res) {
            if (res.code == 0) {
              // $scope.handlerUserList = res.data;
              userRoleUIService.getAssociateRole2User(rList2, function (res2) {
                if (res.code == 0) {
                    $scope.handlePersonList = $scope.uniqueJsonArray(res.data.concat(res2.data),'userID');
                }
              });
            }
          });
        };
        /**
         * 获取设备类型
         *
         */
        var domainTreeQuery = function() {
          var domainCallback = function(data) {
            $scope.domainListDic = data.domainListDic;
            $scope.domainListTree = data.domainListTree;
            if($routeParams.nodeId) {
              initSearchAlerts();
            }
          };
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
        }
        /**
         * 名称下拉选
         */
        $scope.nameDropDownList = [];   // 厂部下拉选择数据
        var queryNameSelect = function () {
          resourceUIService.getDevicesByCondition({}, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.nameDropDownList = returnObj.data;
            }
          })
        }
       
        /**
         * 获得厂部列表 
         */
        $scope.customersList = [];   // 厂部下拉选择数据
        // $scope.customersDic = {};    // 厂部所有数据 {id1:{},id2:{}}
        var queryCustomer = function () {
          customerUIService.findCustomersByCondition({}, function (returnObj) {
            // $scope.customersDic = returnObj.customerDic;
            returnObj.data.forEach(function (item) {
              item.text = item.customerName;
            })
            returnObj.data.unshift({ "text": "请选择", "value": "-1" });
            $scope.customersList = returnObj.data;
          })
        };
        /**
         * 查询车间列表 
         */
        $scope.projectsList = []      // 车间下拉选择数据
        $scope.projectsListAll = [];  // 车间所有数据
        $scope.projectsDic = {};      // 车间数据 {id1:{},id2:{}}
        var queryProject = function () {
          projectUIService.findProjectsByCondition({}, function (returnObj) {
            if (returnObj.code == 0) {
              returnObj.data.forEach(function (item) {
                $scope.projectsDic[item.id] = item;
                item.text = item.projectName;
              });
              var obj = { "text": "请选择", "value": "-1" };
              returnObj.data.unshift(obj);
              $scope.projectsListAll = returnObj.data;

            }
          })
        };

        /**
         * 查询线体列表  
         */
        //查询所有线体列表
        $scope.linebodyListAll = [];  // 线体所有数据
        var queryLinebodyList = function () {
          linebodyUIService.findLinebodyByCondition({}, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.linebodyListAll = returnObj.data;
            }
          })
        }

        /**
         * 厂部列表onchange
         */
        $scope.projectsCustomerList = [];
        $scope.customerChange = function () {
          if ($scope.selectedAlertitem.domain) {
            $scope.projectsCustomerList = $scope.projectsListAll;
            $scope.projectsList = $scope.projectsListAll;
          } else {
            $scope.projectsCustomerList = [];
            $scope.projectsList = [];
          }
          //如果设备模板、项目、客户都没有选择，那么按照域查询指标
          //if (!$scope.selectedDitem.modelId && !$scope.selectedItem.projectId)
          // getKpisBymodelId(301);
        }
        /**
         * 车间列表onchange
         */
        $scope.lineBodyList = [];
        $scope.projectChange = function () {
          if ($scope.selectedAlertitem.plant) {
            //$scope.projectsCustomerList = $scope.projectsListAll;
            $scope.lineBodyList = $scope.linebodyListAll;
          } else {
            //$scope.projectsCustomerList = [];
            $scope.lineBodyList = [];
          }
          //如果设备模板、项目、客户都没有选择，那么按照域查询指标
          //if (!$scope.selectedDitem.modelId && !$scope.selectedItem.projectId)
          // getKpisBymodelId(301);
        }
        queryCustomer();//查询厂部列表 wjd
        queryProject();//查询所有车间 wjd
        queryLinebodyList();//查询所有线体
        roleIdUserList();
        domainTreeQuery();
      }


      /**
       * 新增工单对象初始化
       */
      $scope.initAddList = function () {
        $scope.orderAddData = {
          "title": "",
          "priorityCode": "",
          "ticketNo": '',
          "category": "",
          "ticketCategoryId": "",
          "values": "",
          "deviceId": "",
          "faultId": "",
          "message": ""
        };
        $scope.formAryList = [];
      }
      var info = Info.get("../localdb/info.json", function (info) {
        $scope.priorityData = info.priorityData;
        $scope.statusData = info.statusData;
      });
      $scope.definitions = {};
      $scope.selectItem = "";
      /**
       * 字符串转换对象
       * @param str
       * @returns {*}
       */
      $scope.objStr = function (str) {
        try {
          var jsonStr = $.parseJSON(str)
          return jsonStr;
        } catch (err) {
          return [];
        }
      }
      //根据流程查开始节点属性
      $scope.process = function () {
        if ($scope.orderAddData.ticketCategoryId != "" && $scope.orderAddData.ticketCategoryId != undefined && $scope.orderAddData.ticketCategoryId != null) {
          var spl = $scope.orderAddData.ticketCategoryId;
          workflowService.getWorkflowById($scope.processTypeDataDic[spl].workflowId, function (res) {
            if (res.code == 0) {
              $scope.selectItem = res.data;
              var resAry = res.data.startAttributeDefinitions;
              $scope.formAryList = []
              for (var i in resAry) {
                var typePro = {};
                $.each(resAry[i], function (name, value) {
                  typePro[name] = value;
                  if (value && name == "selectValue") {
                    typePro[name] = $scope.objStr(value);
                  } else {
                    typePro[name] = value;
                  }
                })

                $scope.definitions[resAry[i].label] = $scope.orderAddData.values[resAry[i].label];
                $scope.formAryList.push(typePro);
              }
            }
          });
        } else {
          $scope.formAryList = [];
        }

      };
      $scope.initData = { "devicesAll": "", "faultList": "" };
      $scope.processTypeDataDic = {};
      //根据工单分类初始化工单流程
      var getProcedure = function () {
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.processTypeData = returnObj.data;//展示table数据的工单流程
            returnObj.data.forEach(function (obj) {
              $scope.processTypeDataDic[obj.id] = obj;
            });

            if ($routeParams && $routeParams.state) {//从工单详情返回到工单管理页面
              var activeTab = "";
              var id = null;
              switch ($routeParams.state) {
                case 'doing':
                  activeTab = "执行中";
                  id = 0;
                  break;
                case 'did':
                  activeTab = "已完成";
                  id = 1;
                  break;
                case 'all':
                  activeTab = "全部工单";
                  id = 2;
                  break;
                case 'undo':
                  activeTab = "未发布";
                  id = 3;
                  break;
              }
              $("#myTab li:eq(" + id + ") a").tab('show');
              // changeWorkOrderItem(activeTab);
              getOrderData(activeTab);
            } else {
              getOrderData($scope.activeListTab);
            }
          }
        });

      }
      $scope.findFault = function () {
        if ($scope.devicesDic[$scope.orderAddData.deviceId]) {
          resourceUIService.findFaultKnowledgeByModelId($scope.devicesDic[$scope.orderAddData.deviceId].modelId, function (res) {
            if (res.code == 0) {
              $scope.initData.faultList = res.data;
            }
          });
        }
      };
      var searchList = function (obj) {
        ticketTaskService.findTickets(obj, function (returnObj) {
          if (returnObj.code == 0) {
            var status = $scope.seleStatus;
            var state = "";
            var count = returnObj.data.length;
            if (status == 100) {
              $scope.orderCount.doing = count;
              state = "doing";//执行中
              $scope.workOrderData["tab"] = true;
            } else if (status == 10) {
              $scope.orderCount.unpush = count;
              state = "undo";//未发布
              $scope.workOrderData["tab"] = false;
            } else if (status == 200) {
              $scope.orderCount.done = count;
              state = "did";//已完成
              $scope.workOrderData["tab"] = false;
            }
            $scope.workOrderData.data = returnObj.data;
            $scope.orderGirtData.data = returnObj.data;
            $scope.workOrderData.state = state;
            if (status == 10) {
              $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
            } else {
              $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
            }
          }
        });
      }

      //查询条件事件
      $scope.goSearch = function () {
        var v = {};
        v["title"] = $scope.loaderValue;
        v["status"] = $scope.seleStatus;
        searchList(v);
      };

      //未发布工单查询刷新
      $scope.wordCancel = function () {
        $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
      }
      //根据工单分类初始化工单流程
      $scope.getOrderProcedure = function () {
        //通过传值方式获取流程分类
        var processTypeList = $scope.processTypeData;
        var processType = []
        for (var i in processTypeList) {
          if (processTypeList[i].category == $scope.orderAddData.category) {
            processType.push(processTypeList[i]);
          }
        }
        $scope.processType = processType;
      }
      /**
       * 新建工单
       */
      $scope.addWorkOrder = function (obj) {
        if (obj) {
          $scope.orderAddData = obj;
          $scope.orderAddData.ticketCategoryId = obj.ticketCategoryId;
          $scope.process();
        } else {
          $scope.initAddList();
        }

        $scope.workOrderType = $scope.myDicts['ticketCategory'];
        ngDialog.open({
          template: '../partials/dialogue/add_workorder.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };
      /**
       * 获取各工单count(执行中，未发布，已完成)
       */
      function getDoingOrderCount() {
        var status = 100;
        if (type == "gateway") {
          ticketTaskService.getTicketsByStatusAndDeviceId(100, id, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.orderCount.doing = returnObj.data.length;
            }
          })
        } else {
          var obj = { "status": status };
          ticketTaskService.findTickets(obj, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.orderCount.doing = returnObj.data.length;
            }
          })
        }
      }

      function getUnpushOrderCount() {
        var status = 10;
        if (type == "gateway") {
          ticketTaskService.getTicketsByStatusAndDeviceId(100, id, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.orderCount.doing = returnObj.data.length;
            }
          })
        } else {
          var obj = { "status": status };
          ticketTaskService.findTickets(obj, function (returnObj) {
            if (returnObj.code == 0) {
              //            $scope.orderCount.unpush = returnObj.data.length;
            }
          })
        }
      }

      function getDoneOrderCount() {
        var status = 200;
        if (type == "gateway") {
          ticketTaskService.getTicketsByStatusAndDeviceId(100, id, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.orderCount.doing = returnObj.data.length;
            }
          })
        } else {
          var obj = { "status": status };
          ticketTaskService.findTickets(obj, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.orderCount.done = returnObj.data.length;
            }
          })
        }
      }

      function getAllOrderCount() {
        if (type == "gateway") {
          ticketTaskService.getTicketsByDeviceId(id, function (res) {
            if (res.code == 0) {
              $scope.orderCount.all = res.data.length;
            }
          });
        } else {
          ticketTaskService.getAllTickets(function (returnObj) {
            if (returnObj.code == 0) {
              $scope.orderCount.all = returnObj.data.length;
            }
          });
        }
      }

      /**
       * 获取工单数据(执行中，未发布，已完成)
       */
      function getOrderData(status) {
        if (type == "gateway") {
          ticketTaskService.getTicketsByStatusAndDeviceId(status, id, function (returnObj) {
            if (returnObj.code == 0) {
              var state = "";
              $scope.workOrderData.data = returnObj.data;
              $scope.orderGirtData.data = returnObj.data;
              // $scope.workOrderData.state = state;
              if (status == 10) {
                $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
              } else {
                $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
              }
            }
          });
        } else {
          var obj = { "status": status };
          ticketTaskService.findTickets(obj, function (returnObj) {
            if (returnObj.code == 0) {
              //$scope.orderData = returnObj.data;
              $scope.workOrderData.data = returnObj.data;
              $scope.orderGirtData.data = returnObj.data;
              // $scope.workOrderData.state = state;
              if (status == "10") {
                $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
              } else {
                $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
              }
            }
          });
        }
      }

      /**
       * 获取所有工单数据
       */
      function getAllOrderData() {
        if (type == "gateway") {
          ticketTaskService.getTicketsByDeviceId(id, function (res) {
            if (res.code == 0) {
              $scope.orderCount.all = res.data.length;
            }
          });
        } else {
          ticketTaskService.getAllTickets(function (returnObj) {
            if (returnObj.code == 0) {
              $scope.workOrderData.data = returnObj.data;
              $scope.orderCount.all = returnObj.data.length;
              $scope.workOrderData.state = 'all';//全部
              $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
            }
          });
        }
      }

      /**
       * 发起工单必输项验证
       * @param o
       */
      var requiredFiledValidation = function (o) {
        var m = null;
        if (!o.title || o.title == "") {
          m = '工单名称不能为空';
        } else if (!String(o.priorityCode) || String(o.priorityCode) == "") {
          m = '紧急度不能为空';
        } else
          if (!o.category || o.category == "") {
            m = '工单类型不能为空';
          } else if (!o.ticketCategoryId || o.ticketCategoryId == "") {
            m = '工单流程不能为空';
          } else if (!o.deviceId || o.deviceId == "" || o.deviceId == "-1") {
            m = '设备不能为空';
          }
          else if (!o.message || o.message == "") {
            m = '工单内容不能为空';
          }
        return m;
      };
      /**
       * 保存工单
       */
      $scope.saveOrder = function () {
        //校验必输项
        /* var rv = requiredFiledValidation($scope.orderAddData);
         if (rv != null) {
           growl.warning(rv, {});
           return;
         }*/
        if ($scope.commitloading) {
          growl.warning("请等待，正在保存工单", {});
          return;
        }
        $scope.commitloading = true;
        $scope.orderAddData.values = $scope.definitions;
        $scope.orderAddData.deviceId = $scope.orderAddData.deviceId;
        var ticket = $scope.orderAddData;
        ticketTaskService.saveTicket(ticket, function (returnObj) {
          $scope.commitloading = false;
          if (returnObj.code == 0) {
            growl.success("保存工单成功", {});
            $scope.closeDialog();
            $scope.initAddList();
            $scope.activeListTab = 10;
            getOrderData(10);
          }
        });
      };
      /**
       * 取消工单
       */
      $scope.cancelOrder = function () {
        $scope.addOrderShow = false;
        growl.info("取消发布工单成功", {});
        $scope.initAddList();
      };

      /**
       * 发布工单
       */
      $scope.uploadOrder = function () {
        if ($scope.commitloading) {
          growl.warning("请等待，正在发布工单");
          return;
        }
        $scope.commitloading = true;
        $scope.orderAddData.values = $scope.definitions;
        $scope.orderAddData.deviceId = $scope.orderAddData.deviceId;
        $scope.orderAddData.values["modelID"] = $scope.devicesDic[$scope.orderAddData.deviceId].modelId;
        var ticket = $scope.orderAddData;
        ticketTaskService.commitTicket(ticket, function (returnObj) {
          $scope.commitloading = false;
          if (returnObj.code == 0) {
            //$scope.$apply();
            growl.success("发布工单成功", {});
            $scope.closeDialog();
            $scope.addOrderShow = false;
            $scope.formAryList = [];
            if ($scope.orderAddData.status == 10) {
              var dataList = $scope.orderGirtData.data;
              for (var j in dataList) {
                if (dataList[j].ticketCategoryId == returnObj.data.ticketCategoryId) {
                  $scope.orderGirtData.data.splice(j, 1);
                  break;
                }
              }
              $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
            }
            $scope.activeListTab = 100;
            $scope.initAddList();
            getOrderData(100);
            //跳转到执行中
            // if ($scope.activeTab.indexOf("执行中") > -1) {
            //   changeWorkOrderItem($scope.activeTab);
            // } else {
            //   $('#myTab li:eq(0) a').tab('show');
            // }
          } else {
            $scope.commitloading = false;
            $scope.orderAddData.ticketCategoryId = "";
          }
        });
      };
      $scope.createKnowledge = function (ticket) {
        createKnowledge(ticket.ticketNo).then(function (data) {
          $scope.faultKnowledge = data;
          //growl.success("生成故障知识成功。")
          ngDialog.open({
            template: '../app-oc/partials/fault-knowledge-dialog.html',
            scope: $scope,
            className: 'ngdialog-theme-plain'
          });
        });
      };
      var createKnowledge = function (ticketNo) {
        var defer = $q.defer();
        faultKnowledgeUIService.getFaultKnowledgeByTicketNo(ticketNo, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      $scope.saveFaultKnowledge = function () {
        saveFaultKnowledge($scope.faultKnowledge).then(function (data) {
          growl.success("生成故障知识成功。")
          $scope.closeDialog();
        });
      };
      var saveFaultKnowledge = function (faultKnowledge) {
        var defer = $q.defer();
        faultKnowledgeUIService.saveFaultKnowledge(faultKnowledge, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      //格式化时间
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      };
      //标准时间转换2017-07-17T03:10:38.931+0000
      var chGMT = function (dateStr) {
        return useMomentFormat(dateStr, "yyyy-MM-dd hh:mm:ss");
      }
      $scope.workOrderData = {
        "columnDefs": [
          {
            // 设备位置
            "targets": 0,
            "data": "devicePosition",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data + "</span>";
            }
          }, {
            // 设备名称
            "targets": 1,
            "data": "deviceName",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data + "</span>";
            }
          }, {
            // 设备编码
            "targets": 2,
            "data": "deviceCode",
            "render": function (data, type, full) {
              // var str = "";
              // if ($scope.processType && $scope.processType[data] != undefined) {
              //   str = $scope.processType[data].name;
              // }
              return "<span style='cursor:pointer;'>" + data + "</span>";
            }
          }, {
            // 工单名称
            "targets": 3,
            "data": "currentTaskName",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data + "</span>";
            }
          }, {
            // 来源
            "targets": 4,
            "data": "message",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data + "</span>";
            }
          }, {
            // 第一责任人
            "targets": 5,
            "data": "personLiable",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data + "</span>";
            }
          }, {
            // 工单产生时间
            "targets": 6,
            "data": "commitTime",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data  + "</span>";
              // return "<span style='cursor:pointer;'>" + useMomentFormat(data, "yyyy-MM-dd hh:mm:ss")  + "</span>";
            }
          }, 
          {
            // 工单状态
            "targets": 7,
            "data": "currentTaskStatus",
            "render": function (data, type, full) {
              var str = "";
              switch (full.currentTaskStatus) {
                default: str = '无数据';
                case 10: str = '待处理'; break;
                case 100: str = '处理中'; break;
                case 200: str = '已完成'; break;
              }
              return "<span style='cursor:pointer;'>" + str + "</span>";
              // return "<span style='cursor:pointer;'>" + useMomentFormat(data, "yyyy-MM-dd hh:mm:ss")  + "</span>";
            }
          }, 
          {
            // 处理人
            "targets": 8,
            "data": "creatorName",
            "render": function (data, type, full) {
              return "<span style='cursor:pointer;'>" + data  + "</span>";
              // return "<span style='cursor:pointer;'>" + useMomentFormat(data, "yyyy-MM-dd hh:mm:ss")  + "</span>";
            }
          }, 
          {
              // 是否超时
              "targets": 9,
              "data": "overtimeStatus",
              "render": function (data, type, full) {
                // 返回自定义内容
                var severityStr = "正常";
                var severityBg = "alerts-warning";
                if (data == 1) {
                  severityStr = "超时";
                  severityBg = "alerts-major";
                } else if (data == 2) {
                  severityStr = "逾期";
                  severityBg = "alerts-minor";
                } 
                return "<span class='label " + severityBg + "'>" + severityStr + "</span>";
              }
            },
             {
              "targets": 10,
              "data": "option",
              "render": function (data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                if ($scope.menuitems['A01_S09']) {
                  str += "<button id='history' class='btn btn-primary' ><i class='fa fa-edit hidden-lg '></i><span class='hidden-md hidden-sm hidden-xs'> 过程跟踪</span></button>";
                }
                if ($scope.activeListTab == 200 && $scope.menuitems['A05_S09']) {
                  str += "<button id='knowledge' class='btn btn-default' ><i class='fa fa-edit hidden-lg '></i><span class='hidden-md hidden-sm hidden-xs'> 生成知识</span></button>";
                }
                if ($scope.activeTab == null || $scope.activeListTab == 100 && $scope.menuitems['A06_S09']) {
                  str += "<button id='revoke' class='btn btn-default' ><i class='fa fa-trash hidden-lg '></i><span class='hidden-md hidden-sm hidden-xs'> 撤销</span></button>";
                }
                str += "</div>";
                return str;
              }
            }
          
          
          
          // {
          //   "targets": 1,
          //   "data": "devicePosition",
          //   "render": function (data, type, full) {
          //     return "<a href='index.html#/orderdetail/" + full.ticketNo + "/order" + "'>" + data + "</a>";
          //   }
          // }, {
          //   "targets": 2,
          //   "data": "deviceName",
          //   "render": function (data, type, full) {
          //     //返回自定义内容
          //     var str = "";
          //     for (var i in $scope.processTypeData) {
          //       if ($scope.processTypeData[i].id == data) {
          //         str = $scope.processTypeData[i].name;
          //       }
          //     }
          //     return str;
          //   }
          // }, {
          //   "targets": 3,
          //   "data": "status",
          //   "render": function (data, type, full) {
          //     // 返回自定义内容
          //     var str = "";
          //     var strIcon = "";
          //     if (data == 10) {
          //       str = "未发布";
          //       strIcon = "label-primary";
          //     } else if (data == 100) {
          //       str = "处理中";
          //       strIcon = "label-warning";
          //     } else if (data == 200) {
          //       str = "已完成";
          //       strIcon = "label-info";
          //     } else if (data == 150) {
          //       str = "已撤销";
          //       strIcon = "label-info";
          //     }
          //     return "<span class='label " + strIcon + "'>" + str + "</span>";
          //   }
          // }, {
          //   "targets": 6,
          //   "data": "",
          //   "render": function (data, type, full) {
          //     //  返回自定义内容
          //     return chGMT(data);
          //   }
          // }, {
          //   "targets": 7,
          //   "data": "",
          //   "render": function (data, type, full) {
          //     //  返回自定义内容
          //     return chGMT(data);
          //   }
          // }, {
          //   "targets": 9,
          //   "data": "option",
          //   "render": function (data, type, full) {
          //     // 返回自定义内容
          //     var str = "<div class='btn-group btn-group-sm'>";
          //     if ($scope.menuitems['A01_S09']) {
          //       str += "<button id='history' class='btn btn-primary' ><i class='fa fa-edit hidden-lg '></i><span class='hidden-md hidden-sm hidden-xs'> 过程跟踪</span></button>";
          //     }
          //     if ($scope.activeListTab == 200 && $scope.menuitems['A05_S09']) {
          //       str += "<button id='knowledge' class='btn btn-default' ><i class='fa fa-edit hidden-lg '></i><span class='hidden-md hidden-sm hidden-xs'> 生成知识</span></button>";
          //     }
          //     if ($scope.activeTab == null || $scope.activeListTab == 100 && $scope.menuitems['A06_S09']) {
          //       str += "<button id='revoke' class='btn btn-default' ><i class='fa fa-trash hidden-lg '></i><span class='hidden-md hidden-sm hidden-xs'> 撤销</span></button>";
          //     }
          //     str += "</div>";
          //     return str;
          //   }
          // }
        ]
      };
      $scope.orderGirtData = {
        "columns": [{
          "data": "title",
          "title": "工单名称"
        }, {
          "data": "ticketCategoryId",
          "title": "工单流程"
        }, {
          "data": "status",
          "title": "工单状态"
        }, $.ProudSmart.datatable.optionCol2],
        "columnDefs": [{
          "targets": 0,
          "data": "title",
          "render": function (data, type, full) {
            return "<span style='cursor: pointer;'>" + data + "</span>";
          }
        }, {
          "targets": 1,
          "data": "ticketCategoryId",
          "render": function (data, type, full) {
            var str = "";
            for (var i in $scope.processTypeData) {
              if ($scope.processTypeData[i].id == data) {
                str = $scope.processTypeData[i].name;
              }
            }
            return "<span style='cursor: pointer;'>" + str + "</span>";
          }
        }, {
          "targets": 2,
          "data": "status",
          "render": function (data, type, full) {
            return "<span style='cursor: pointer;' class='label " + (data == 10 ? "label-primary" : (data == 100 ? "label-warning" : "label-info")) + "'>" + (data == 10 ? "未发布" : (data == 100 ? "处理中" : "已完成")) + "</span>";
          }
        }, {
          "targets": 3,
          "data": "option",
          "render": function (data, type, full) {  // 返回自定义内容
            var str = "<div class='btn-group btn-group-sm'>";
            if ($scope.menuitems['A07_S09']) {
              str += "<button id='release-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 发布</span></button>";
            }
            if ($scope.menuitems['A08_S09']) {
              str += "<button id='del-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
            }
            str += "</div>";
            return str;
          }
        }]
      };
      /**
       * 撤销工单
       * @param ticketNo
       */
      $scope.cancelTicket = function (ticketNo) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认要撤销该工单？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function (dialogRef) {
              dialogRef.close();
              ticketTaskService.cancelTicket(ticketNo, function (resultObj) {
                if (resultObj.code == 0) {
                  growl.success("撤销工单成功!", {});
                  //changeWorkOrderItem("执行中");
                  if (type == "gateway") {
                    ticketTaskService.getTicketsByStatusAndDeviceId(100, id, function (returnObj) {
                      if (returnObj.code == 0) {
                        $scope.workOrderData.data = returnObj.data;
                        $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
                      }
                    });
                  } else {
                    getOrderData($scope.activeListTab);
                    // var obj = {"status":100};
                    // ticketTaskService.findTickets(obj, function (returnObj) {
                    //   $scope.workOrderData.data = returnObj.data;
                    //   $scope.orderCount.doing = returnObj.data.length;
                    //   $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
                    // });
                  }
                  // $scope.$broadcast(Event.WORKORDERINIT+"_order", $scope.orderGirtData);
                }
              });
            }
          }, {
            label: '取消',
            action: function (dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
      $scope.delTicket = function (ticketNo) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '是否要删除该工单',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function (dialogRef) {
              ticketService.deleteTicket(ticketNo, function (resultObj) {
                if (resultObj.code == 0) {
                  growl.success("删除工单成功!", {});
                  if (type == "gateway") {
                    ticketTaskService.getTicketsByStatusAndDeviceId(10, id, function (returnObj) {
                      if (returnObj.code == 0) {
                        $scope.workOrderData.data = returnObj.data;
                        $scope.orderCount.doing = returnObj.data.length;
                        $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
                      }
                    });
                  } else {
                    var obj = { "status": 10 };
                    ticketTaskService.findTickets(obj, function (returnObj) {
                      $scope.orderGirtData.data = returnObj.data;
                      //                    $scope.orderCount.unpush = returnObj.data.length;
                      $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
                    });
                    // $scope.$broadcast(Event.WORKORDERINIT+"_order", $scope.orderGirtData);
                  }
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
      }
      $scope.cancelOrderNo = function () {
        if (type == "gateway") {
          ticketTaskService.getTicketsByStatusAndDeviceId(10, id, function (returnObj) {
            if (returnObj.code == 0) {
              $scope.workOrderData.data = returnObj.data;
              $scope.orderCount.doing = returnObj.data.length;
              $scope.$broadcast(Event.WORKORDERINIT, $scope.workOrderData);
            }
          });
        } else {
          var obj = { "status": 10 };
          ticketTaskService.findTickets(obj, function (returnObj) {
            $scope.orderGirtData.data = returnObj.data;
            //          $scope.orderCount.unpush = returnObj.data.length; 
            $scope.$broadcast(Event.WORKORDERINIT + "_order", $scope.orderGirtData);
          });
        }
      };
      /**
       * tab页的事件监听
       */
      var initEvent = function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.activeListTab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.activeListTab = aname;
            $scope.$apply();
            $scope.initAddList();
            // 获取已激活的标签页的名称
            // $scope.activeTab = $(e.target).text();
            // 获取前一个激活的标签页的名称
            // previousTab = $(e.relatedTarget).text();
            // $scope.addOrderShow = false;
            // changeWorkOrderItem($scope.activeTab);
            getOrderData(aname);
          }
        });
      }

      /**
       * 获得客户列表
       */
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          $scope.customersDic = returnObj.customerDic;
          returnObj.data.forEach(function (item) {
            item.text = item.customerName;
          })
          $scope.customersList = returnObj.data;
        })
      };
      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function () {
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
          }
        })
      };

      //获取所有设备
      $scope.devicesList;
      $scope.devicesDic = {};
      $scope.queryDevices = function () {
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
          }
        });
      }


      /**
      * 搜索功能
      */
      $scope.searchData = function () {
        console.log("搜索");
        console.log($scope.selectedAlertitem);
      }



      //初始化工单管理
      function init() {
        getProcedure();
        initEvent();
        handleSelectList();
        $scope.initAddList();

        // 查询客户
        queryCustomer();
        $scope.queryDevices();
        //初始化项目
        $scope.queryProject();
      }
      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
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
