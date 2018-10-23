define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';

  // /workorderrecord 对应的controller
  controllers.initController('WorkOrderRecordCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'growl', 'userLoginUIService', 'userEnterpriseService', 'Info', '$route', 'ticketTaskService', 'ticketCategoryService', 'projectUIService', 'customerUIService', 'linebodyUIService', 'ngDialog', 'resourceUIService', 'userDomainService','userRoleUIService', 'userUIService',
    function ($scope, $rootScope, $location, $routeParams, $timeout, growl, userLoginUIService, userEnterpriseService, Info, $route, ticketTaskService, ticketCategoryService, projectUIService, customerUIService, linebodyUIService, ngDialog, resourceUIService, userDomainService, userRoleUIService, userUIService  ) {
      console.clear();
      // 工单流程定义
      $scope.processType = {};
      // 激活的tab
      $scope.activeListTab = "tab1";
      // 搜索
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
        nodeIds:'', // 名称
        taskSource: '',  // 任务来源
        firstPerson: '', // 第一责任人
        handlePerson:'', // 处理人
        isOverTime:'',  // 是否超时
        startTime: '',
        endTime: '',
      };

      $scope.ModelShowData = {};
      // 备件数组
      $scope.sparePartData = [
        {
          // 备件类型	备件名称	备件编码	规格型号	生产厂家	使用部位	实际库存	使用数量
        
          
          // "customerId": $scope.sparepartAddData.customerId,          //厂部-customerId
          // "deviceModelId": $scope.sparepartAddData.deviceModelId,    // 使用设备类型-deviceModelId
          "model": "123",                    // 备件类型-model
          "label": "123",                    // 备件名称-label
          "name": "123",                     // 备件编码-name
          "specification": "123",            // 规格型号-specification
          "manufacturer": "123",             // 生产厂家-manufacturer
          "usePosition" :"放到",              // 使用部位
          // "lifespan": $scope.sparepartAddData.lifespan,              //参考使用寿命-lifespan
          "stockNumber": "如1上的v",        //实际库存-stockNumber
          "useNumber": "而七分"
          // "lowerLimit": $scope.sparepartAddData.lowerLimit,          // 安全库存-lowerLimit (数量下限)
          // "imageUrl": response.data.file,                            // 附件-未添加(图片)
          //"id":$scope.sparepartAddData.id
          // "values": { deviceype: "海天注塑机" },
          // "upperLimit": "1000000",
          // "originalNumber": "5",
          // "unit": "个"
        }
    ];

      /**
       * 获取工单流程定义
       */
      function getProcessDefinitions() {
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType[returnObj.data[i].workflowId] = returnObj.data[i];
            }
          }
          console.log("工单流程定义", $scope.processType);
        });
      };

      //格式化时间
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      }
      $scope.herfList = function (name, data, state) {//state == 是工单任务的三种状态（待处理，处理中，已完成）
        $rootScope.dataList = data;
        if (data != undefined && data.ticketNo != null) {
          if (data.templateURL != "" && data.templateURL != undefined && data.templateURL != null) {
            var url = $.trim(data.templateURL);// + "/" + data.id;
            var fullUrl = url.split('?');
            if (fullUrl[1]) {
              url = fullUrl[0] + "/" + data.id + '?' + fullUrl[1];
            } else {
              url = $.trim(data.templateURL) + "/" + data.id;
            }
            location.href = url;
          } else {
            location.href = "index.html#/orderdetail/" + data.id + "/task";
          }
          //location.href = "index.html#/orderdetail/" + data.id + "/task"+"/"+state;
          //location.href = "../app-flowsheet/index.html#/processView/" + data.id ;
        }
      };
      /**
       * 获取任务数量
       */
      $scope.getRecordCount = function () {
        ticketTaskService.getTicketTasksByStatus(10, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.ordercount.notdeal = returnObj.data.length;
          }
        });
        ticketTaskService.getTicketTasksByStatus(100, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.ordercount.dealing = returnObj.data.length;
          }
        });
        ticketTaskService.getTicketTasksByStatus(200, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.ordercount.done = returnObj.data.length;
          }
        });
      };
      /**
       * 获取工单任务数据
       * @param {Number} status 10-待处理 100-处理中 200-已完成
       */
      $scope.getRecordData = function (status) {
        ticketTaskService.getTicketTasksByStatus(status, function (returnObj) {
          if (returnObj.code == 0) {
            var state = null;
            if (status == 10) {
              $scope.ordercount.notdeal = returnObj.data.length;
              state = "notdeal";//待处理
            } else if (status == 100) {
              $scope.ordercount.dealing = returnObj.data.length;
              state = "dealing";//处理中
            } else if (status == 200) {
              $scope.ordercount.done = returnObj.data.length;
              state = "done";//已完成
            }
            // statusTab(status);
            $scope.recordData = {
              "columns": [
                {
                  "data": "devicePosition",
                  "title": "设备位置"
                }, {
                  "data": "deviceName",
                  "title": "设备名称"
                }, {
                  "data": "deviceCode",
                  "title": "设备编码"
                }, {
                  "data": "ticketTitle",
                  "title": "任务名称"
                }, {
                  "data": "desc",
                  "title": "任务来源"
                }, {
                  "data": "personLiable",
                  "title": "第一责任人"
                },  {
                  "data": "handlerName",
                  "title": "处理人"
                },{
                  "data": "sendTime",
                  "title": "任务产生时间"
                }, {
                  "data": "senderName",
                  "title": "任务状态"
                }, {
                  "data": "overtimeStatus",
                  "title": "是否超时"
                },{
                  "data": "option",
                  "orderable": false,
                  "width": "280px",
                  "visible": $scope.menuitems['A01_S08'] != undefined,
                  "title": "操作"
                }],
              "columnDefs": [
                {
                  // checkbox
                  "targets": 0,
                  "orderable": false,
                  "render": function (data, type, full) {
                    // 返回自定义内容
                    if (type == "display") {
                      if (data) {
                        return '<input class="itemCheckBox" checked type="checkbox">';
                      } else {
                        return '<input class="itemCheckBox" type="checkbox">';
                      }
                    }
                    return "";
                  }
                },
                {
                  // 设备位置
                  "targets": 1,
                  "data": "devicePosition",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                }, {
                  // 设备名称
                  "targets": 2,
                  "data": "deviceName",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                }, {
                  // 设备编码
                  "targets": 3,
                  "data": "deviceCode",
                  "render": function (data, type, full) {
                    // var str = "";
                    // if ($scope.processType && $scope.processType[data] != undefined) {
                    //   str = $scope.processType[data].name;
                    // }
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                }, {
                  // 任务名称
                  "targets": 4,
                  "data": "ticketTitle",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                }, {
                  // 任务来源
                  "targets": 5,
                  "data": "desc",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                }, {
                  // 第一责任人
                  "targets": 6,
                  "data": "senderName",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                }, 
                {
                  // 处理人
                  "targets": 7,
                  "data": "handlerName",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + data + "</span>";
                  }
                },{
                  // 任务产生时间
                  "targets": 8,
                  "data": "sendTime",
                  "render": function (data, type, full) {
                    return "<span style='cursor:pointer;'>" + useMomentFormat(data, "yyyy-MM-dd hh:mm:ss") + "</span>";
                  }
                }, {
                  // 任务状态
                  "targets": 9,
                  "data": "finishedTime",
                  "render": function (data, type, full) {
                    var str = "";
                    switch (full.taskStatus) {
                      default: str = '无数据';
                      case 10: str = '待处理'; break;
                      case 100: str = '处理中'; break;
                      case 200: str = '已完成'; break;
                    }
                    return "<span style='cursor:pointer;'>" + str + "</span>";
                  }
                }, {
                  // 是否超时
                  "targets": 10,
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
                },{
                  "targets": 11,
                  "data": "option",
                  "render": function (data, type, full) {
                    var str = '';
                    var strName = "接单";
                    if (full.taskStatus == 200) {
                      strName = "查看";
                    }
                    str += '<div class="btn-group btn-group-sm">'

                    if(full.attributeDefinitions && full.taskStatus !== 200) {
                      for(var i = 0; i < full.attributeDefinitions.length; i++) {
                        // i = 0 处理按钮显示操作
                        if (i === 0) {
                          // console.log(full.attributeDefinitions[0]);
                          // console.log(full);
                          var attrselectList = JSON.parse(full.attributeDefinitions[0].selectValue);
                          for(var j = 0; j < attrselectList.length; j++){
                            str += createButton(attrselectList[j].label);
                          }
                        }
                      }
                    }
                    if(full.taskConfigName === '录入实绩') {
                      // ng-click=EntryForm("'+ full.desc + '")
                     str +=  '<button id="RecordPerformance" recordType="'+ full.desc +'" type="button"  class="ng-scope btn btn-primary btn-sm" style="margin:2px;">\
                              <span class="ng-binding">录入实绩</span>\
                            </button>';
                    }
                   
                    
                   
                    // str += "<button id='execute' class='btn btn-primary' style='cursor: pointer;' >\
                    //           <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //           <span class='hidden-xs'>接单</span>\
                    //         </button>";
                    // if ($scope.activeListTab === 'tab1')
                    //   str += "<button id='receipt' class='btn btn-primary' style='cursor: pointer;' >\
                    //             <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //             <span class='hidden-xs'>接单</span>\
                    //           </button>\
                    //           <button id='taskClose' class='btn btn-default' style='cursor: pointer;' >\
                    //             <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //             <span class='hidden-xs'>任务关闭</span>\
                    //           </button>";
                    // if ($scope.activeListTab === 'tab2')
                    //   str += "<button id='process' class='btn btn-default' style='cursor: pointer;' >\
                    //             <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //             <span class='hidden-xs'>录入实绩</span>\
                    //           </button>\
                    //           <button id='process' class='btn btn-default' style='cursor: pointer;' >\
                    //             <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //             <span class='hidden-xs'>审核</span>\
                    //           </button>\
                    //           <button id='process' class='btn btn-default' style='cursor: pointer;' >\
                    //             <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //             <span class='hidden-xs'>维修完工</span>\
                    //           </button>\
                    //           <button id='process' class='btn btn-default' style='cursor: pointer;' >\
                    //           <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //           <span class='hidden-xs'>快速完工</span>\
                    //         </button>";
                    // if ($scope.activeListTab === 'tab3')
                    //   str += "<button id='add-form-edit' class='btn btn-default' style='cursor: pointer;' >\
                    //         <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    //         <span class='hidden-xs'>详情</span>\
                    //       </button>";
                    if ($scope.menuitems['S08']) {
                      str += "<button id='process' class='btn btn-default' style='cursor: pointer;' ><i class='fa fa-close hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>过程跟踪</span></button>";
                    }

                    // 暂时添加执行
                    str += "<button style='display:none;' id='execute' class='btn btn-primary' style='cursor: pointer;' ><i class='fa fa-close hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>" + '执行' + "</span></button>";

                    str += '</div>'
                    return str;
                  }
                }],
              data: [],
              state: null
            }
            var list = [];
            for (var i in returnObj.data) {
              // ?疑问bid 和 allocated分别事那种类型的
              if (returnObj.data[i].variables.theTicketType != 'bid' && returnObj.data[i].variables.theTicketType != 'allocated') {
                list.push(returnObj.data[i]);
              }
            }
            $scope.recordData.data = list;
            $scope.recordData.state = state;
            $scope.$broadcast(Event.WORKORDERRECORDINIT, $scope.recordData);
          }
        });
      }

      var createButton = function (name) {
        if (name === '接单') {
          return "<button id='receipt' class='btn btn-primary' style='cursor: pointer;' >\
                    <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    <span class='hidden-xs'>接单</span>\
                  </button>";
        } else if (name === '任务关闭') {
          return "<button id='taskClose' class='btn btn-default' style='cursor: pointer;' >\
                    <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    <span class='hidden-xs'>任务关闭</span>\
                  </button>"
        } else if(name === "快速处理完工") {
          return "<button id='quickSuccess' class='btn btn-default' style='cursor: pointer;' >\
                    <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                    <span class='hidden-xs'>快速处理完工</span>\
                  </button>";
        } else if(name === "维修完工") {
          return "<button id='repairSuccess' class='btn btn-default' style='cursor: pointer;' >\
                  <i class='fa fa-close hidden-lg hidden-md hidden-sm'></i>\
                  <span class='hidden-xs'>维修完工</span>\
                </button>";
        } else if(name === "审核"){
          return '<button type="button" ng-click="EntryForm(1)" class="ng-scope btn btn-primary btn-sm" style="margin:2px;">\
                    <span class="ng-binding">审核</span>\
                  </button>';
        } else{
          return '';
        }
      }
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
            // 获取已激活的标签页的名称
            $scope.activeTab = $(e.target).text();
            var state = null;
            if (aname == 'tab1') {
              state = 10;
            } else if (aname == 'tab2') {
              state = 100;
            } else if (aname == 'tab3') {
              state = 200;
            }
            $scope.getRecordData(state);
          }
        });
      }

      /**
       * 初始化多选功能按钮菜单点击事件
       */
      var initBtnEvent = function () {
        $scope.temporaryRepair = function () {
          console.log("临时维修");
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_temporaryRepair", {});
        }
  
        $scope.orderTaking = function () {
          console.log("接单");
        }
  
        $scope.taskClose = function () {
          console.log("任务关闭");
        }
  
        $scope.fastFinished = function () {
          console.log("快速完工");
        }
  
        $scope.repairFinished = function () {
          console.log("维修完工");
        }
      }
      
      /**
       * 处理下拉选择的事件
       */
      var handleSelectList = function (){
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
        queryNameSelect();
        domainTreeQuery(); // 第一责任人
        roleIdUserList(); // 处理人
      }

      //初始化数据
      function init() {
        // 初始化标签页点击事件
        initEvent();
        // 获取工单流程定义
        getProcessDefinitions();
        // 初始化多选按钮点击事件
        initBtnEvent();
        // 初始化下拉选
        handleSelectList();
        // 获取3个分类下工单的条目数
        $scope.getRecordCount();
        // 获取筛选数据

        // 如果url有state
        if ($routeParams && $routeParams.state) {
          var id = null;
          var state = null;
          switch ($routeParams.state) {
            case 'notdeal': id = 0; state = 10; break;
            case 'dealing': id = 1; state = 100; break;
            case 'done': id = 2; state = 200; break;
          }
          $("#myTab li:eq(" + id + ") a").tab('show');
          $scope.getRecordData(state);
        } else {
          $scope.getRecordData(10);
          // $scope.getRecordData(100);
          // $scope.getRecordData(200);
        }
      }


      /**
       * 搜索功能
       */
      $scope.searchData = function () {
        console.log("搜索");
        console.log($scope.selectedAlertitem);
        // service.exportTicketTaskExcel
      }

      $scope.exportExcel = function () {
        console.log();
        var selectedAlertitem = $scope.selectedAlertitem;
        ticketTaskService.exportTicketTaskExcel(selectedAlertitem == undefined ? {} : selectedAlertitem, function (returnObj) {//[exportParam]
          if (returnObj.code == 0) {
            // $scope.loadingShow = false;
            if (returnObj.data.indexOf('/') > -1) {
              window.location.href = userUIService.uploadFileUrl + returnObj.data;
            } else {
              growl.info("操作异常请联系管理员");
            }
          }
        });
      }
      /**
       * 清除搜索
       */
      $scope.clearSearch = function (attr) {
        if (attr) {
          $scope.selectedAlertitem[attr] = '';
        } else {
          for (var item in $scope.selectedAlertitem) {
            $scope.selectedAlertitem[item] = '';
          }
        }
        // $scope.queryDitem = {
        //   /*domainPath: "",
        //   sn: "",*/
        //   customerId: "",//厂部
        //   deviceModelId: [],
        //   modelId: "",//设备类型
        //   valueCode: "",//备件类型
        //   label: ""//
        // };
        // $scope.queryKeyValue = [];
        // for (var o in $scope.queryKeyValue) {
        //   if ($scope.queryKeyValue[o].dataType == 'datetime' || $scope.queryKeyValue[o].dataType == 'date') {
        //     $scope.queryKeyValue[o].startTime = '';
        //     $scope.queryKeyValue[o].endTime = '';
        //   } else if ($scope.queryKeyValue[o].dataType == 'numberic') {
        //     $scope.queryKeyValue[o].startNumberic = '';
        //     $scope.queryKeyValue[o].endNumberic = '';
        //   } else {
        //     $scope.queryKeyValue[o].value = '';
        //   }
        // }
        // $scope.queryModelChange();
      }

      /**
       * 弹窗中关闭单条任务
       */
      $scope.closeSingleTask = function(){
        var ajaxData = $scope.taskCloseData.selectData;
        if(!ajaxData.values.reason || !ajaxData.values.remark ) {
          growl.warning("请填写完整后提交", {});
        } else {
          ajaxData.taskStatus = 200;
          ticketTaskService.doTask(ajaxData, function (returnObj) {
            // $scope.customersDic = returnObj.customerDic;
            console.log(returnObj);
            if (returnObj.code == 0) {
              growl.success("任务关闭成功", {});
              $scope.closeDialog();
              // 获取已激活的标签页的名称
              var state = null;
              if ($scope.activeListTab == 'tab1') {
                state = 10;
              } else if ($scope.activeListTab == 'tab2') {
                state = 100;
              } else if ($scope.activeListTab == 'tab3') {
                state = 200;
              }
              $scope.getRecordData(state);
            } else {                
              growl.warning("任务关闭失败", {});
            }
          })
        }
      }

      /**
       * 编辑
       * @param type 录入实际的类型,
       */
      $scope.EntryForm = function(type, data) {
        // 点检计划任务弹窗
        $scope.ModelShowData = data;
        if(type === '点检计划'){
          ngDialog.open({
            template: '../partials/dialogue/add_task_checkPlan.html', // 点检
            scope: $scope,
            className: 'ngdialog-theme-plain',
            onOpenCallback: function () {
              $timeout(function () {
                $scope.$broadcast(Event.ALERTRULESINIT + "_checkPlanTask", {
                  'option': data.variables.pointCheckLists
                });
              }, 0)
            }
          });
        } else if(type === '报警维修') {
          $scope.ModelShowData.variables = Object.assign($scope.ModelShowData.variables,{
            devicePart: '',
            problemCategory: '',
            failure: '',
            failureAnalysis: '',
            maintenanceMeasures: '',
            improvementMeasures : '',
            factStartTime : '',
            factEndTime: '',
            dominantMan: '',
            auxiliaryMan: '',
            cliamBy : ''
          })
          console.log($scope.ModelShowData);
          // 维修实绩
          ngDialog.open({
            template: '../partials/dialogue/add_task_repair.html', // 维修实绩
            scope: $scope,
            className: 'ngdialog-theme-plain'
          }); 
          
        } else if ( type === 2 ) {
          // 日常保养任务
          ngDialog.open({
            template: '../partials/dialogue/add_task_dailyCheck.html', // 维修实绩
            scope: $scope,
            className: 'ngdialog-theme-plain',
            onOpenCallback: function () {
              $timeout(function(){
                $scope.$broadcast(Event.ALERTRULESINIT + "_dailyCheckTask", {
                  'option': [{a:1, b:1, c:3}]
                });
              }, 0)
            }
          })
        } else if ( type === 3) {
          ngDialog.open({
            template: '../partials/dialogue/add_task_bigCheck.html',
            scope: $scope,
            className: 'ngdialog-theme-plain',
            onOpenCallback: function () {
              $timeout(function(){
                $scope.$broadcast(Event.ALERTRULESINIT + "_bigdailyCheckTask", {
                  // sparePartData
                  'option': $scope.sparePartData
                });
              }, 0)
            }
          })
        }
      
      };


      /**
       * 保存点检录入实绩
       */
      $scope.saveCheckPlan = function(){
        //项次
        // var itemids = $("#addCheckNumberTable").find("tr").length - 1;
        // if (itemids < 10) {
        //   itemids = "0" + itemids;
        // } else {
        //   itemids = itemids;
        // }

        // 
        $("table[add-task-plan-table] tbody tr").each(function (index, item) {
          $(item).find('td').each(function (indexx, itemm) {
            if ($(itemm).children().attr('valueattr')) {
              $scope.ModelShowData.variables.pointCheckLists[index][$(itemm).children().attr('valueattr')] = $(itemm).children().val();
            }
          })
        })

        delete $scope.ModelShowData.variables.reason;
        delete $scope.ModelShowData.variables.remark;
        delete $scope.ModelShowData.variables.chose;
        ticketTaskService.updateTicketTask($scope.ModelShowData, function (returnObj) {
          console.log(returnObj);
          if (returnObj.code == 0) {
            growl.success("录入成功", {});
            $scope.closeDialog();
            // 获取已激活的标签页的名称
            var state = null;
            if ($scope.activeListTab == 'tab1') {
              state = 10;
            } else if ($scope.activeListTab == 'tab2') {
              state = 100;
            } else if ($scope.activeListTab == 'tab3') {
              state = 200;
            }
            $scope.getRecordData(state);
          } else {                
            growl.warning("录入失败", {});
          }
        })

        console.log($scope.ModelShowData);
        console.log("保存点检");
      }

      /**
       * 保存维修录入实绩
       */
      $scope.saveInspection = function (){
        console.log("保存维修录入实绩", $scope.ModelShowData);
        $scope.ModelShowData.taskStatus = 200;
        ticketTaskService.doTask($scope.ModelShowData, function (returnObj) {
          if (returnObj.code == 0) {
            growl.success("录入实绩成功", {});
            var state = null;
            if ($scope.activeListTab == 'tab1') {
              state = 10;
            } else if ($scope.activeListTab == 'tab2') {
              state = 100;
            } else if ($scope.activeListTab == 'tab3') {
              state = 200;
            }
            $scope.closeDialog();
            $scope.getRecordData(state);
          } else {
            growl.warning("失败", {});
          }
        });
      }

      /**
       * 添加备件 
       */
      $scope.AddsparePart = function () {
        console.log("添加备件");
        // $scope.sparePartData
        var param =  {
          "model": "123",                    // 备件类型-model
          "label": "123",                    // 备件名称-label
          "name": "123",                     // 备件编码-name
          "specification": "123",            // 规格型号-specification
          "manufacturer": "123",             // 生产厂家-manufacturer
          "usePosition" :"放到",              // 使用部位
          "stockNumber": "如1上的v",        //实际库存-stockNumber
          "useNumber": "而七分"
        }
        $scope.sparePartData.push(param);
        $scope.$broadcast(Event.ALERTRULESINIT + "_sparePartModule", {
          // sparePartData
          'option': $scope.sparePartData
        });
      }

      // $scope.$on(Event.ALERTRULESINIT + "_deleteRowSpart", function (evt, d) {
      //   console.log(evt, d);
      //   $scope.sparePartData.splice(d, 1);
      //   $scope.$broadcast(Event.ALERTRULESINIT + "_sparePartModule", {
      //     'option': $scope.sparePartData
      //   });
      // });
      init();
    }
  ]);
  /**
   * 工单详情，同时也可以直接处理任务，如果不是模板任务的时候
   */
  controllers.initController('orderDetailCtrl', ['$scope', '$q', '$controller', '$rootScope', '$location', '$routeParams', '$timeout', 'growl', 'resourceUIService', 'workflowService', 'faultKnowledgeUIService', 'userEnterpriseService', 'Info', '$route', 'ticketTaskService', 'ticketCategoryService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'userUIService', 'FileUploader', 'configUIService', 'sparePartUIService',
    function ($scope, $q, $controller, $rootScope, $location, $routeParams, $timeout, growl, resourceUIService, workflowService, faultKnowledgeUIService, userEnterpriseService, Info, $route, ticketTaskService, ticketCategoryService, userLoginUIService, customerUIService, projectUIService, userUIService, FileUploader, configUIService, sparePartUIService) {
      var id = $routeParams.id;
      var uploader = $scope.uploader = new FileUploader({
        url: '' + userUIService.uploadFileUrl + '/api/rest/upload/resourceFileUIService/uploadResourceFile',
        withCredentials: true, // 跨域
        queueLimit: 10, //文件个数
        removeAfterUpload: false //上传后删除文件
      });
      uploader.filters.push({
        name: 'fileFilter',
        fn: function (item, options) {
          $scope.uploadParam.names.push({
            fileName: item.name
          });
          $scope.uploadParam.name += item.name + ',';
          return true;
        }
      });
      uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        uploader.clearQueue();
        uploader.destroy();
        $scope.uploadParam.names = [];
        $scope.uploadParam.name = '';
        console.info('onWhenAddingFileFailed', item.name);
      };
      uploader.onBeforeUploadItem = function (item) {
        Array.prototype.push.apply(item.formData, uploader.formData);
        console.info('onBeforeUploadItem', item);
      };
      uploader.onCompleteAll = function (fileItem, response, status, header) {
        console.info('onCompleteAll');
        var arr = [];
        $scope.uploadParam.names.forEach(function (n) {
          var ary = n.serverFileName.split('/');
          arr.push(ary[ary.length - 1]);
        });
        $scope.uploadParam.name = arr.join(',');
        $scope.$apply();
        save($scope.saveStatus);
      };
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', response.data.qualifiedName);
        $scope.uploadParam.names.forEach(function (name) {
          if (name.fileName == fileItem.file.name) {
            name.serverFileName = response.data.qualifiedName;
          }
        });
        $scope.uploadFilePath += response.data.qualifiedName + ',';
      };
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        growl.warning("上传文件失败", {});
      };
      $scope.uploadParam = {
        "name": '',
        names: [],
        label: ''
      };
      $scope.removeSelectedFile = function (fileName) {
        uploader.queue.forEach(function (qu, ind) {
          if (qu.file.name == fileName) {
            uploader.queue.splice(ind, 1);
          }
        });
        $scope.uploadParam.names.forEach(function (n, ind) {
          if (n.fileName == fileName) {
            $scope.uploadParam.names.splice(ind, 1)
          }
        });

        var arr = [];
        $scope.uploadParam.names.forEach(function (n) {
          if (n.serverFileName) {
            var ary = n.serverFileName.split('/');
            arr.push(ary[ary.length - 1]);
          } else {
            arr.push(n.fileName);
          }
        });
        $scope.uploadParam.name = arr.join(',');
      }
      $scope.saveStatus;
      $scope.workType = $routeParams.workType;
      $scope.state = $routeParams.state;
      $scope.orderType = "";
      $scope.priorityCode = "";
      $scope.processType = [];
      $scope.workList = "";
      $scope.tasksList = "";
      $scope.historyData = "";
      $scope.process = "";
      $scope.processTime = "";
      $scope.myObj = {};
      $scope.myObjTop = {};
      $scope.historyData = {
        columns: [{
          title: "处理人",
          data: "handlerName"
        }, {
          title: "处理时间",
          data: "finishedTime"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "finishedTime",
          "render": function (data, type, full) {
            var str = "";
            if (data) {
              str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
            }
            // 返回自定义内容
            return str;
          }
        }]
      };
      $scope.devicesAll = "";
      $scope.allFault = "";
      $scope.findFault = function () {
        resourceUIService.findFaultKnowledgeByModelId($scope.orderAddData.deviceId.modelId, function (res) {
          if (res.code == 0) {
            $scope.initData.faultList = res.data;
          }
        });
      };
      $scope.major = { "spareIds": "" };
      $scope.sparePartsArray = {};
      $scope.allSpareParts = [];
      $scope.sparePartsInitList = {};
      var querySpareParts = function (modelId) {
        $scope.sparePartsInitList.data = [];
        //查询所有备件
        sparePartUIService.getSparePartByModelId(modelId, function (data) {
          if (data.code == 0) {
            var newObj = [];
            if (data.data) {
              data.data.forEach(function (obj) {
                obj.text = obj.name;
                $scope.sparePartsArray[obj.id] = obj;
                newObj.push(obj);
              });
            }
            $scope.allSpareParts = newObj;
          }
        });
      };
      $scope.selectList = {};
      $scope.addAttachment = function () {
        var newObj = {
          name: "",
          label: "",
          stockNumber: "",
          isEdit: 3,
          id: null
        }
        var addList = []
        for (var n in $scope.selectList.allSparePartsList) {
          var index = -1;
          for (var j in $scope.sparePartsInitList.data) {
            if ($scope.selectList.allSparePartsList[n].id == $scope.sparePartsInitList.data[j].id) {
              index = j
            }
          }
          if (index == -1) {
            addList.push($scope.selectList.allSparePartsList[n]);
          }
        }
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[i].id == null) {
            growl.warning("当前有未保存的备件", {})
            return;
          }
        }
        $scope.sparePartsInitList.data.unshift(newObj);
        //$scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
        $scope.definitions.selectList = "";
      };
      $scope.historyGo = function () {
        var state = $routeParams.state;
        location.href = "index.html#/workorderrecord";
      };
      $scope.saveAttachment = function (selectStatus) {
        var tmp = -1;
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.major.spareIds == $scope.sparePartsInitList.data[i].id) {
            growl.warning("该备件已经使用", {});
            tmp = $scope.major.spareIds;
            break;
          }
        }
        if (tmp == -1) {
          if (!$scope.sparePartsInitList.data) $scope.sparePartsInitList.data = [];
          $scope.sparePartsArray[$scope.major.spareIds]["edit"] = 7;
          $scope.sparePartsArray[$scope.major.spareIds].editNumber = "";
          $scope.sparePartsInitList.data.unshift($scope.sparePartsArray[$scope.major.spareIds]);
          $scope.major.spareIds = "";
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
        }
      };
      $scope.formAryList = [];
      $scope.definitions = {};
      $scope.startList = "";
      var workFlowValue = function (flowId, value) {
        workflowService.getWorkflowById(flowId, function (returnObj) {
          if (returnObj.code == 0) {
            var resAry = returnObj.data.startAttributeDefinitions;
            var vList = [];
            for (var i in resAry) {
              var typePro = {};
              typePro["label"] = resAry[i].label;
              typePro["name"] = resAry[i].name;
              typePro["dataType"] = resAry[i].dataType;
              typePro["value"] = value[resAry[i].label];
              vList.push(typePro);
            }
            $scope.startList = vList;
            console.log("startvalue======" + JSON.stringify(vList));
          }
        })
      }
      var orderTicket = function (id, processDefinitionId, taskObj) {
        //根据工单Id获取工单详情
        ticketTaskService.getTicket(id, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.commitTime = formatDate(returnObj.data.commitTime);
            returnObj.data.finishedTime = formatDate(returnObj.data.finishedTime);
            $scope.workList = returnObj.data;
            if ($scope.workType == 'task') {
              if ($scope.workList.finishedTime == null || $scope.workList.finishedTime == '') {
                $scope.processTime = "0";
              }
              if (returnObj.data.values != null && returnObj.data.values != "") {
                workFlowValue(processDefinitionId, returnObj.data.values);
              }
            }
            if (taskObj != undefined) {
              $scope.workList["taskConfigName"] = taskObj.taskConfigName;
            }
            //通过工单号,获取任务
            ticketTaskService.getTicketTasks(id, function (returnObj1) {
              if (returnObj1.code == 0) {
                var searchList = [];
                for (var i in returnObj1.data) {
                  if (returnObj1.data[i].taskStatus == 200 || returnObj1.data[i].taskStatus == 100) {
                    searchList.push(returnObj1.data[i]);
                  }
                }
                $scope.historyData.data = searchList;
                $scope.$broadcast(Event.WORKORDERRECORDINIT + "_history", $scope.historyData);
                $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
              }
            });
          }
        });
      }
      $scope.cancelAttach = function (data) {
        for (var j in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[j].isEdit == 3 && data.isEdit == 3) {
            $scope.sparePartsInitList.data.splice(j, 1);
          } else if ($scope.sparePartsInitList.data[j].id == data.id) {
            $scope.sparePartsInitList.data.splice(j, 1);
          }
        }
        $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
      }
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      }
      $scope.save = function (status) {
        $scope.saveStatus = status;
        if ($scope.uploadParam.name) {
          $scope.uploader.formData.push({
            resourceId: 100,
            type: encodeURIComponent('ticket')
          });
          $scope.uploader.uploadAll();
        } else {
          save(status);
        }
      };
      var save = function (status) {
        $scope.detail.taskStatus = status;
        if ($scope.sparePartsInitList.data && $scope.sparePartsInitList.data.length > 0) {
          var table = $('table[name="major"]').DataTable();
          var data = table.$('input').serializeArray();
          var spareList = $scope.sparePartsInitList.data;
          var valueList = [];
          for (var i in data) {
            for (var j in spareList) {
              if (data[i].name == spareList[j].id) {
                if (data[i].value) {
                  spareList[j].stockNumber = data[i].value;
                  valueList.push(spareList[j]);
                } else {
                  growl.warning("您有备件数量没有输入,请输入之后再保存", {});
                  return;
                }
              }
            }
          }
          $scope.definitions["stockOrderItemList"] = valueList;
        }
        if ($scope.uploadParam.name) {
          var arr = [];
          $scope.uploadParam.names.forEach(function (n) {
            arr.push(n.serverFileName);
          });
          $scope.definitions[$scope.uploadParam.label] = arr.join(',');
        }
        $scope.detail["values"] = $scope.definitions;
        if ($scope.myObj.ticketStatus) {
          ticketTaskService.doTask($scope.detail, function (returnObj) {
            if (returnObj.code == 0) {
              if (status == 100) {
                growl.success("工单已确认", {});
              } else if (status == 200) {
                growl.success("工单已完成", {});
                $scope.historyGo();
              }
            } else {
              growl.warning("工单操作失败", {});
            }
          });
        } else {
          growl.warning("已经有其他人在处理此工单");
        }
      };
      $scope.objStr = function (str) {
        try {
          var jsonStr = $.parseJSON(str)
          return jsonStr;
        } catch (err) {
          return [];
        }
      }
      var process = function getProcessType() {
        if ($scope.workType == 'task') {
          var promises = [];
          promises.push(getTicketTaskById(id));
          promises.push(isMyTicketTask(id));
          $q.all(promises).then(function (ret) {
            var taskObj = ret[0];
            $scope.detail = taskObj.data;
            var statList = taskObj.data.values;
            if (taskObj.data.variables.modelID != undefined) {
              querySpareParts(taskObj.data.variables.modelID);
            }
            if (taskObj.data && taskObj.data.attributeDefinitions != "" && taskObj.data.attributeDefinitions != null) {
              var resAry = taskObj.data.attributeDefinitions;
              resAry = resAry.sort(function (a, b) {
                return a.reorder - b.reorder;
              });
              for (var i in resAry) {
                var typePro = {};
                if (resAry[i].dataType == 'select' && resAry[i]['dynamicValue']) {
                  resAry[i].selectValue = resAry[i]['dynamicValue'];
                }
                $.each(resAry[i], function (name, value) {
                  typePro[name] = value;
                  if (value && name == "selectValue") {
                    if (typeof value == 'string') {
                      typePro[name] = $scope.objStr(value);
                    } else {
                      typePro[name] = value;
                    }
                  } else {
                    typePro[name] = value;
                  }
                });
                if (taskObj.data.taskStatus == "200" || taskObj.data.taskStatus == "100") {
                  var statList = taskObj.data.values;
                  $scope.definitions[resAry[i].label] = statList[resAry[i].label];
                  if (resAry[i].dataType == 'uploader') {
                    $scope.uploadParam.names = [];
                    $scope.uploadParam.name = '';
                    $scope.uploadFilePath = statList[resAry[i].label];
                    $scope.uploadParam.label = resAry[i].label;
                    statList[resAry[i].label].split(',').forEach(function (path) {
                      path = $.trim(path);
                      if (path) {
                        $scope.uploadParam.names.push({
                          serverFileName: path
                        });
                      }
                    });
                    var arr = [];
                    $scope.uploadParam.names.forEach(function (n) {
                      var ary = n.serverFileName.split('/');
                      arr.push(ary[ary.length - 1]);
                    });
                    $scope.uploadParam.name = arr.join(',');
                  }
                } else {
                  $scope.definitions[resAry[i].label] = "";
                  if (resAry[i].dataType == 'uploader') {
                    $scope.uploadParam.label = resAry[i].label;
                  }
                }
                $scope.formAryList.push(typePro);
              }
              console.info("formAryList====", $scope.formAryList);
              if (taskObj.data.values && taskObj.data.values.stockOrderItemList != undefined
                && taskObj.data.values.stockOrderItemList != null
                && taskObj.data.values.stockOrderItemList != "") {
                var orderList = taskObj.data.values.stockOrderItemList;
                for (var j in orderList) {
                  orderList[j].editNumber = orderList[j].stockNumber;
                  if ($scope.sparePartsArray[orderList[j].id] != undefined) {
                    $scope.sparePartsArray[orderList[j].id].editNumber = orderList[j].stockNumber;
                  }
                }
                $scope.sparePartsInitList.data = taskObj.data.values.stockOrderItemList;
              }
              orderTicket(taskObj.data.ticketNo, taskObj.data.processDefinitionId, taskObj.data);
            } else {
              orderTicket(taskObj.data.ticketNo, taskObj.data.processDefinitionId);
            }
          });
        } else if ($scope.workType == 'order') {
          orderTicket(id, 0);
        }
      };
      var getTicketTaskById = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.getTicketTaskById(ticketTaskId, function (taskObj) {
          if (taskObj.code == 0) {
            defer.resolve(taskObj);
          }
        });
        return defer.promise;
      };
      var isMyTicketTask = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.isMyTicketTask(ticketTaskId, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.myObj["ticketStatus"] = ticketStatus.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 获得客户列表
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        var defer = $q.defer();
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.customersDic = returnObj.customerDic;
            returnObj.data.forEach(function (item) {
              item.text = item.customerName;
            });
            $scope.customersList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 查询项目
      $scope.projectsList;
      $scope.projectsDic = {};
      var queryProject = function () {
        var defer = $q.defer();
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 查询企业下面的用户
      $scope.userList;
      $scope.userDic = {};
      var userByCondition = function () {
        var defer = $q.defer();
        userUIService.queryUserByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.userDic[item.userID] = item;
            })
            $scope.userList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      //获取所有设备
      $scope.devicesList = [];
      $scope.devicesDic = {};
      var queryDevices = function () {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 从 info.json 中获取工单分类和紧急度
      var getInfo = function () {
        var defer = $q.defer();
        Info.get("../localdb/info.json", function (info) {
          $scope.orderType = $scope.myDicts['ticketCategory'];//工单分类
          $scope.priorityCodeList = info.priorityData;//紧急度
          defer.resolve();
        });
        return defer.promise;
      };

      // 获取工单流程
      var getTicketCategorys = function () {
        var defer = $q.defer();
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType = returnObj.data;
            }
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 页面初始化执行的方法
      var init = function () {
        var promises = [];
        promises.push(queryCustomer());
        promises.push(queryDevices());
        promises.push(queryProject());
        promises.push(userByCondition());
        promises.push(getTicketCategorys());
        promises.push(getInfo());
        $q.all(promises).then(function () {
          var UA = navigator.userAgent.toLowerCase();
          if (UA.indexOf("webkit") < 0) {
            $scope.browserClass = "wrong";
            $scope.myObj = { "display": "inline-flex" };
            $scope.myObjTop = { "margin-top": "6px" };
          }
          process();
        });
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
  //从模板地址进来的地址
  controllers.initController('processDetailCtrl', ['$scope', '$rootScope', 'FileUploader', '$location', '$controller', '$routeParams', '$timeout', 'userUIService', 'sparePartUIService', 'growl', 'workflowService', 'userEnterpriseService', 'Info', '$route', 'projectUIService', 'ticketTaskService', 'maintenanceUIService',
    function ($scope, $rootScope, FileUploader, $location, $controller, $routeParams, $timeout, userUIService, sparePartUIService, growl, workflowService, userEnterpriseService, Info, $route, projectUIService, ticketTaskService, maintenanceUIService) {
      $scope.status = $routeParams.status;//获取跳转过来的任务状态
      var id = $routeParams.id;//获取跳转过来的任务id
      $scope.workType = $routeParams.workType;
      $scope.sparePartsArray = {};
      $scope.devicesList = [];
      $scope.imgList = [];
      $scope.selectMajor = '';
      $scope.taskList = {
        "ticketNo": "",
        "ticketTitle": "",
        "ticketCommitTime": "",
        "ticketCreatorName": "",
        "customerName": "",
        "projectName": "",
        "projectID": "",
        "modelName": "",
        "modelID": "",
        "deviceSn": "",
        "faultNo": "",
        "faultPhenomenon": ""
      };
      $scope.selectList = {};
      $scope.urlService = userUIService.uploadFileUrl;
      $scope.definitions = { "faultPhenomenon": "", "stockOrderItemList": "", "ticketTaskDesc": "" };
      $scope.addAttachment = function () {
        var newObj = {
          name: "",
          label: "",
          stockNumber: "",
          isEdit: 3,
          id: null
        }
        var addList = []
        for (var n in $scope.selectList.allSparePartsList) {
          var index = -1;
          for (var j in $scope.sparePartsInitList.data) {
            if ($scope.selectList.allSparePartsList[n].id == $scope.sparePartsInitList.data[j].id) {
              index = j
            }
          }
          if (index == -1) {
            addList.push($scope.selectList.allSparePartsList[n]);
          }
        }
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[i].id == null) {
            growl.warning("当前有未保存的备件", {})
            return;
          }
        }
        $scope.sparePartsInitList.data.unshift(newObj);
        //$scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
        $scope.definitions.selectList = "";
      }
      $scope.sparePartsInitList = {};
      $scope.serviceOrigin = userUIService.uploadFileUrl + '/api/rest/upload/maintenanceUIService/uploadTaskImage';
      $controller('AppUploadCtrl', { $scope: $scope, growl: growl, FileUploader: FileUploader });
      $scope.toggle = function toggle() {
        $('#nv-file-select').click();
      }
      $scope.uploadExcel = function (config) {
        /*  $scope.uploader.formData = [];
          $scope.uploader.formData.push({
            config: 'deviceModel'
          });*/
        $scope.uploader.uploadAll();
      };
      $scope.$on("uploadTemplate", function (event, args) {
        if (args.response.code == 0) {
          growl.success("上传成功", {})
          $scope.imgList.push(args.response.data.file);
          $scope.$apply();
        }
      });
      $scope.uploader.onAfterAddingFile = function (fileItem) {
        if ($scope.uploader.queue.length > $scope.queueLimit) {
          $scope.uploader.removeFromQueue(0);
        }
        $scope.uploadExcel();
      };
      $scope.saveAttachment = function (selectStatus) {
        var tmp = -1;
        // if (selectStatus.id == -1) return;
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.selectMajor == $scope.sparePartsInitList.data[i].id) {
            growl.warning("该备件已经使用", {});
            tmp = $scope.selectMajor;
            break;
          }
        }
        if (tmp == -1) {
          if (!$scope.sparePartsInitList.data) $scope.sparePartsInitList.data = [];
          $scope.sparePartsArray[$scope.selectMajor]["edit"] = 7;
          // $scope.sparePartsArray[$scope.selectMajor] = selectStatus;
          $scope.sparePartsArray[$scope.selectMajor].editNumber = "";
          $scope.sparePartsInitList.data.unshift($scope.sparePartsArray[$scope.selectMajor]);
          $scope.selectMajor = "";
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);

        }
        //if($scope.sparePartsArray[selectStatus.id]){
        //
        //}
      };
      $scope.cancelAttach = function (data) {
        for (var j in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[j].isEdit == 3 && data.isEdit == 3) {
            $scope.sparePartsInitList.data.splice(j, 1);
          } else if ($scope.sparePartsInitList.data[j].id == data.id) {
            $scope.sparePartsInitList.data.splice(j, 1);
          }
        }
        $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
      }
      $scope.processTask = function (status) {
        var table = $('table[name="major"]').DataTable();
        var data = table.$('input').serializeArray();
        var spareList = $scope.sparePartsInitList.data;
        var valueList = [];
        var statusSel = $scope.detail.taskStatus;
        for (var i in data) {
          for (var j in spareList) {
            if (data[i].name == spareList[j].id) {
              if (data[i].value) {
                spareList[j].stockNumber = data[i].value;
                valueList.push(spareList[j]);
              } else {
                growl.warning("您有备件数量没有输入,请输入之后再保存", {});
                return;
              }
            }
          }
        }
        $scope.definitions.stockOrderItemList = valueList;
        $scope.detail["values"] = $scope.definitions;
        $scope.detail["maintenanceContent"] = $scope.devicesList;//	维保内容
        $scope.detail["images"] = $scope.imgList;//图片
        $scope.detail.taskStatus = status;
        if ($scope.selectList.ticketStatus) {
          ticketTaskService.doTask($scope.detail, function (returnObj) {
            if (returnObj.code == 0) {
              if (status == 200) {
                growl.success("处理任务成功", {});
                location.href = "index.html#/workorderrecord";
              } else {
                growl.success("任务已确认", {});
              }
            } else {
              $scope.detail.taskStatus = statusSel;
            }
          });
        }
      }
      var querySpareParts = function (modelId) {
        $scope.sparePartsInitList.data = [];
        //查询所有备件
        sparePartUIService.getSparePartByModelId(modelId, function (data) {
          if (data.code == 0) {
            var newObj = [];
            newObj.push({
              text: '请选择',
              label: '请选择',
              id: -1
            });
            if (data.data) {
              data.data.forEach(function (obj) {
                obj.text = obj.name;
                $scope.sparePartsArray[obj.id] = obj;
                newObj.push(obj);
              });
            }
            $scope.allSpareParts = newObj;
          }
        });
      }
      var ticketDetail = function () {
        //通过任务id查任务详情
        ticketTaskService.getTicketTaskById(id, function (taskObj) {
          debugger
          if (taskObj.code == 0) {
            if ($scope.status == 'spare' && taskObj.data.variables.modelID != undefined) {
              querySpareParts(taskObj.data.variables.modelID);
            }
            if (taskObj.data.deviceId) {
              if (taskObj.data.maintenanceContent && taskObj.data.maintenanceContent.length > 0) {
                $scope.devicesList = taskObj.data.maintenanceContent;
              } else {
                itemsByDevice(taskObj.data.deviceId);
              }
            }
            $scope.detail = taskObj.data;
            $scope.taskList.ticketNo = taskObj.data.ticketNo;
            $scope.taskList.ticketTitle = taskObj.data.ticketTitle;
            if (taskObj.data.variables != "" && taskObj.data.variables != null) {
              $scope.taskList.ticketCommitTime = newDateJson(taskObj.data.variables.ticketCommitTime).Format(GetDateCategoryStrByLabel());
              $scope.taskList.projectId = taskObj.data.variables.device.projectId;
            }
            $scope.taskList.ticketCreatorName = taskObj.data.variables.ticketCreatorName;
            $scope.taskList.modelName = taskObj.data.variables.modelName;
            $scope.taskList.modelID = taskObj.data.variables.modelID;
            //if(taskObj.data.variables.customer != "" && taskObj.data.variables.customer != ""){
            $scope.taskList.customerID = taskObj.data.variables.customerID;
            $scope.taskList.customerName = taskObj.data.variables.customerName;
            //}
            /* if (taskObj.data.variables.project != "" && taskObj.data.variables.project != null) {
               $scope.taskList.projectName = taskObj.data.variables.project.label;
               $scope.taskList.projectID = taskObj.data.variables.project.id;
             }*/
            $scope.taskList.faultNo = taskObj.data.variables.faultNo;
            $scope.taskList.deviceSn = taskObj.data.variables.deviceSn;
            $scope.taskList.faultPhenomenon = taskObj.data.variables.faultPhenomenon;
            if (taskObj.data.images) {
              $scope.imgList = taskObj.data.images;
            }
            if (taskObj.data.values != null && taskObj.data.values != "") {
              $scope.definitions.ticketTaskDesc = taskObj.data.values.ticketTaskDesc;
              if (taskObj.data.values.stockOrderItemList != null && taskObj.data.values.stockOrderItemList != "") {
                $scope.sparePartsInitList.data = taskObj.data.values.stockOrderItemList;
                var orderList = taskObj.data.values.stockOrderItemList;
                for (var j in orderList) {
                  if ($scope.sparePartsArray[orderList[j].id] != undefined) {
                    $scope.sparePartsArray[orderList[j].id].editNumber = orderList[j].stockNumber;
                  }
                }
                //$scope.$broadcast(Event.WORKORDERRECORDINIT+"_deviceTask", $scope.sparePartsInitList);
              }
            }
            $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
          }
        });
      };
      var itemsByDevice = function (deviceId) {
        maintenanceUIService.getInspectionItemsByDeviceId(deviceId, function (res) {
          if (res.code == 0) {
            res.data.forEach(function (obj) {
              obj["status"] = "0";
            });
            $scope.devicesList = res.data;
          }
        });
      }
      var init = function () {
        ticketTaskService.isMyTicketTask(id, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.selectList["ticketStatus"] = ticketStatus.data;
          }
        });
        ticketDetail();
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
            init();
          }
        })
      };
      $scope.queryProject();
    }
  ]);
  //工单任务历史记录
  controllers.initController('workTimeLineCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'ticketLogService', 'growl', 'workflowService', 'userEnterpriseService', 'Info', '$route', 'ticketTaskService', 'processService',
    function ($scope, $rootScope, $location, $routeParams, $timeout, ticketLogService, growl, workflowService, userEnterpriseService, Info, $route, ticketTaskService, processService) {
      var id = $routeParams.id;//获取跳转过来的任务id
      $scope.historyList = null;
      $scope.workOrderId = id;
      $scope.workOrderDetail = null;
      $scope.hrefList = function (url, id) {
        var fullUrl = url.split('?');
        if (fullUrl[1]) {
          url = fullUrl[0] + "/" + id + '?' + fullUrl[1];
        }
        location.href = url;
      };
      if (id != '' && id != null) {
        ticketTaskService.getTicket(id, function (resData) {
          debugger
          if (resData.code == 0) {
            $scope.workOrderDetail = resData.data;
          }
        });
        ticketLogService.getByTicketNo(id, function (res) {
          if (res.code == 0) {
            $scope.historyList = res.data;
          }
        });
      }
    }
  ]);

  controllers.initController('WorkOrderRecordSelectPartCtrl', ['$scope', 'ngDialog', '$q', '$routeParams', 'faultKnowledgeUIService', 'growl', 'resourceUIService', 'Info', 'ticketTaskService', 'ticketCategoryService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'userUIService', 'etlUIService',
    function ($scope, ngDialog, $q, $routeParams, faultKnowledgeUIService, growl, resourceUIService, Info, ticketTaskService, ticketCategoryService, userLoginUIService, customerUIService, projectUIService, userUIService, etlUIService) {
      var id = $routeParams.id;
      var queryPartEtlId = $routeParams.queryPartEtlId;
      var createOrderEtlId = $routeParams.createOrderEtlId;
      var queryCustomerEtlId = $routeParams.queryCustomerEtlId;
      $scope.allCustomers = [];
      $scope.queryItem = {};
      $scope.myObj = {};
      $scope.myObjTop = {};
      $scope.partList = [];
      $scope.historyData = {
        columns: [{
          title: "处理人",
          data: "handlerName"
        }, {
          title: "处理时间",
          data: "finishedTime"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "finishedTime",
          "render": function (data, type, full) {
            var str = "";
            if (data) {
              str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
            }
            return str;
          }
        }]
      };
      $scope.selectedPart = [];
      $scope.partId = '';
      $scope.dialogObj = {};
      $scope.beforeTaskStatus = '';
      $scope.save = function (status) {
        $scope.detail["values"] = {
          parts: $scope.selectedPart
        };
        $scope.detail.taskStatus = status;
        if (status == 200) {
          var str = '';
          str += '将生成一个订单，订单内容如下:\n';
          $scope.selectedPart.forEach(function (item) {
            str += item.label + '(配件编码:' + item.code + ')    数量：' + item.count + '个\n';
          });
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: str,
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                dialogRef.close();
                var param = {
                  partJson: []
                };
                $scope.selectedPart.forEach(function (item) {
                  var obj = {};
                  obj.id = item.id;
                  obj.count = Number(item.count);
                  obj.code = item.code;
                  param.partJson.push(obj);
                });
                var customerInfos = $scope.customer.split('||');
                param.customerName = customerInfos[0];
                param.customerCode = customerInfos[1];
                param.customerDept = customerInfos[2];
                param.ticketNo = $scope.detail.ticketNo;
                makeOrder(param).then(function (data) {
                  $scope.detail.values.orderId = data;
                  return doTask($scope.detail);
                }).then(function () {
                  $scope.beforeTaskStatus = 200;
                  growl.success("工单已完成", {});
                  window.history.back();
                });
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                $scope.detail.taskStatus = $scope.beforeTaskStatus;
                $scope.$apply()
                dialogRef.close();
              }
            }]
          });
        } else if (status == 100) {
          doTask($scope.detail).then(function () {
            $scope.beforeTaskStatus = 100;
            growl.success("工单已确认", {});
          });
        }
      };
      $scope.searchKnowledge = function () {
        $scope.queryItem = {
          ticketCategoryId: $scope.workList.ticketCategoryId
        };
        ngDialog.open({
          template: 'partials/workorder_record_search_knowledge.html',
          scope: $scope,
          className: 'ngdialog-theme-plain',
          name: 'searchKnowledge'
        });
      };
      $scope.goClear = function () {
        $scope.queryItem = {
          ticketCategoryId: $scope.workList.ticketCategoryId
        };
      };
      $scope.goSearch = function () {
        searchFaultKnowledge($scope.queryItem).then(function (data) {
          $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
            data: data
          });
        });
      };
      var searchFaultKnowledge = function (queryObj) {
        var defer = $q.defer();
        faultKnowledgeUIService.getFaultKnowledgesByCondition(queryObj, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      $scope.searchPart = function () {
        ngDialog.open({
          template: 'partials/workorder_record_part_search.html',
          scope: $scope,
          className: 'ngdialog-theme-plain',
          name: 'searchPart'
        });
      };
      $scope.canSearchPart = function () {
        return !!$scope.partCode;
      };
      $scope.confirmSelectPart = function () {
        var selectedParts = $scope.partList.filter(function (part) {
          return Number(part.count) > 0;
        });
        $scope.selectedPart.forEach(function (item) {
          selectedParts.forEach(function (part) {
            if (item.id == part.id && item.code == part.code) {
              item.count = part.count;
            }
          });
        });
        var newParts = [];
        selectedParts.forEach(function (part) {
          var flag = false;
          $scope.selectedPart.forEach(function (item) {
            if (item.id == part.id && item.code == part.code) {
              flag = true;
            }
          });
          if (!flag) {
            newParts.push(part);
          }
        });
        $scope.selectedPart = $scope.selectedPart.concat(newParts);
        $scope.$broadcast('WorkOrderSelectPart', {
          data: $scope.selectedPart,
          name: 'page'
        });
        $scope.closeDialog();
        $scope.partCode = null;
      };
      $scope.deleteSelectPart = function (rowData, callback) {
        var index = $scope.selectedPart.indexOf(rowData);
        $scope.selectedPart.splice(index, 1);
        $scope.$apply();
        callback();
      };
      $scope.confirmSelectFaultKnowledge = function (faultKnowledge) {
        var selectedParts = faultKnowledge.values.parts || [];
        $scope.selectedPart = selectedParts;
        $scope.$broadcast('WorkOrderSelectPart', {
          data: $scope.selectedPart,
          name: 'page'
        });
        $scope.closeDialog();
      };
      // 创建订单
      var makeOrder = function (param) {
        var defer = $q.defer();
        etlUIService.executeJob(createOrderEtlId, param, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data)
          }
        });
        return defer.promise;
      };
      var queryCustomerByEtl = function (param) {
        var defer = $q.defer();
        etlUIService.executeJob(queryCustomerEtlId, param, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data)
          }
        });
        return defer.promise;
      };
      // 执行任务
      var doTask = function (task) {
        var defer = $q.defer();
        ticketTaskService.doTask(task, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          } else {
            $scope.detail.taskStatus = $scope.beforeTaskStatus;
          }
        });
        return defer.promise;
      };
      // 查询配件
      var findParts = function (partCode) {
        var defer = $q.defer();
        $scope.partList = [];
        $scope.dialogObj = {};
        etlUIService.executeJob(queryPartEtlId, {
          part: partCode
        }, function (ret) {
          $scope.partList = JSON.parse(ret.data);
          $scope.partList.forEach(function (item) {
            $scope.selectedPart.forEach(function (part) {
              if (item.id == part.id && item.code == part.code) {
                item.count = part.count;
              }
            });
            item.inventory = 100;
          });
          defer.resolve();
        });
        return defer.promise;
      };
      //根据工单Id获取工单详情
      var orderTicket = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicket(ticketNo, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      //获取执行历史数据
      var getHistoryData = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicketTasks(ticketNo, function (ret) {
          if (ret.code == 0) {
            var searchList = [];
            for (var i in ret.data) {
              if (ret.data[i].taskStatus == 200 || ret.data[i].taskStatus == 100) {
                searchList.push(ret.data[i]);
              }
            }
            $scope.historyData.data = searchList;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      //根据id获取工单任务详情
      var getTicketTaskById = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.getTicketTaskById(ticketTaskId, function (taskObj) {
          if (taskObj.code == 0) {
            if (taskObj.data.values && taskObj.data.values.parts) {
              $scope.selectedPart = taskObj.data.values.parts;
            }
            defer.resolve(taskObj);
          }
        });
        return defer.promise;
      };
      var isMyTicketTask = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.isMyTicketTask(ticketTaskId, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.myObj["ticketStatus"] = ticketStatus.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var process = function getProcessType() {
        var promises = [];
        promises.push(getTicketTaskById(id));
        promises.push(isMyTicketTask(id));
        $q.all(promises).then(function (ret) {
          var taskObj = ret[0];
          $scope.detail = taskObj.data;
          $scope.beforeTaskStatus = $scope.detail.taskStatus;
          $scope.$broadcast('WorkOrderSelectPart', {
            data: $scope.selectedPart,
            name: 'page'
          });
          var defers = [];
          defers.push(getHistoryData(taskObj.data.ticketNo));
          defers.push(orderTicket(taskObj.data.ticketNo));
          return $q.all(defers);
        }).then(function (ret) {
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_history", $scope.historyData);
          var workList = ret[1];
          workList.commitTime = formatDate(workList.commitTime);
          workList.finishedTime = formatDate(workList.finishedTime);
          $scope.workList = workList;
        });
      };
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      };
      // 获得客户列表
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        var defer = $q.defer();
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.customersDic = returnObj.customerDic;
            returnObj.data.forEach(function (item) {
              item.text = item.customerName;
            });
            $scope.customersList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 查询项目
      $scope.projectsList;
      $scope.projectsDic = {};
      var queryProject = function () {
        var defer = $q.defer();
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 查询企业下面的用户
      $scope.userList;
      $scope.userDic = {};
      var userByCondition = function () {
        var defer = $q.defer();
        userUIService.queryUserByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.userDic[item.userID] = item;
            })
            $scope.userList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      //获取所有设备
      $scope.devicesList = [];
      $scope.devicesDic = {};
      var queryDevices = function () {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 从 info.json 中获取工单分类和紧急度
      var getInfo = function () {
        var defer = $q.defer();
        Info.get("../localdb/info.json", function (info) {
          $scope.orderType = $scope.myDicts['ticketCategory'];//工单分类
          $scope.priorityCodeList = info.priorityData;//紧急度
          defer.resolve();
        });
        return defer.promise;
      };
      // 获取工单流程
      var getTicketCategorys = function () {
        var defer = $q.defer();
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType = returnObj.data;
            }
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 获取设备模板
      $scope.deviceModelList = [];
      var getDeviceModel = function () {
        var defer = $q.defer();
        resourceUIService.getModelsByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.deviceModelList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var init = function () {
        var promises = [];
        promises.push(queryCustomer());
        promises.push(queryDevices());
        promises.push(queryProject());
        promises.push(userByCondition());
        promises.push(getTicketCategorys());
        promises.push(getInfo());
        promises.push(getDeviceModel());

        $q.all(promises).then(function () {
          queryCustomerByEtl({}).then(function (data) {
            $scope.allCustomers = JSON.parse(data);
          });
          var UA = navigator.userAgent.toLowerCase();
          if (UA.indexOf("webkit") < 0) {
            $scope.browserClass = "wrong";
            $scope.myObj = { "display": "inline-flex" };
            $scope.myObjTop = { "margin-top": "6px" };
          }
          process();
        });
      };

      $scope.$on('ngDialog.opened', function (e, data) {
        if (data && data.name === 'searchPart') {
          findParts($scope.partCode).then(function () {
            $scope.$broadcast('WorkOrderSelectPart', {
              data: $scope.partList,
              name: 'dialog'
            });
          });
        }
        if (data && data.name === 'searchKnowledge') {
          $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
            data: []
          });
        }
      });

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

  controllers.initController('WorkOrderRecordPartOrderCtrl', ['$scope', 'ngDialog', '$q', '$routeParams', 'growl', 'resourceUIService', 'Info', 'ticketTaskService', 'ticketCategoryService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'userUIService', 'etlUIService',
    function ($scope, ngDialog, $q, $routeParams, growl, resourceUIService, Info, ticketTaskService, ticketCategoryService, userLoginUIService, customerUIService, projectUIService, userUIService, etlUIService) {
      var id = $routeParams.id;
      var etlId = $routeParams.etlId;
      $scope.myObj = {};
      $scope.myObjTop = {};
      $scope.partList = [];
      $scope.historyData = {
        columns: [{
          title: "处理人",
          data: "handlerName"
        }, {
          title: "处理时间",
          data: "finishedTime"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "finishedTime",
          "render": function (data, type, full) {
            var str = "";
            if (data) {
              str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
            }
            return str;
          }
        }]
      };
      $scope.selectedPart = [];
      $scope.partId = '';
      $scope.save = function (status) {
        $scope.detail.taskStatus = status;
        $scope.detail.values = $scope.detail.values || {};
        $scope.detail.values.orderStatus = $scope.workList.orderDetail.status;
        doTask($scope.detail).then(function () {
          if (status == 100) {
            growl.success("工单已确认", {});
          } else if (status == 200) {
            growl.success("工单已完成", {});
            window.history.back();
          }
        });
      };
      var getOrderStatus = function (orderId) {
        var defer = $q.defer();
        etlUIService.executeJob(etlId, {
          orderId: orderId
        }, function (ret) {
          if (ret.code == 0) {
            $scope.workList.orderDetail = ret.data;
          }
          defer.resolve();
        });
        return defer.promise;
      };
      // 执行任务
      var doTask = function (task) {
        var defer = $q.defer();
        ticketTaskService.doTask(task, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          } else {
            $scope.detail.taskStatus = 10;
          }
        });
        return defer.promise;
      };
      //根据工单Id获取工单详情
      var orderTicket = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicket(ticketNo, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      //获取执行历史数据
      var getHistoryData = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicketTasks(ticketNo, function (ret) {
          if (ret.code == 0) {
            var searchList = [];
            for (var i in ret.data) {
              if (ret.data[i].taskStatus == 200 || ret.data[i].taskStatus == 100) {
                searchList.push(ret.data[i]);
              }
            }
            $scope.historyData.data = searchList;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      //根据id获取工单任务详情
      var getTicketTaskById = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.getTicketTaskById(ticketTaskId, function (taskObj) {
          if (taskObj.code == 0) {
            if (taskObj.data.values && taskObj.data.values.parts) {
              $scope.selectedPart = taskObj.data.values.parts;
            }
            defer.resolve(taskObj);
          }
        });
        return defer.promise;
      };
      // 判断是否是当前用户的任务
      var isMyTicketTask = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.isMyTicketTask(ticketTaskId, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.myObj["ticketStatus"] = ticketStatus.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var process = function getProcessType() {
        var promises = [];
        promises.push(getTicketTaskById(id));
        promises.push(isMyTicketTask(id));
        $q.all(promises).then(function (ret) {
          var taskObj = ret[0];
          $scope.detail = taskObj.data;
          var defers = [];
          defers.push(getHistoryData(taskObj.data.ticketNo));
          defers.push(orderTicket(taskObj.data.ticketNo));
          return $q.all(defers);
        }).then(function (ret) {
          var ticket = ret[1];
          ticket.commitTime = formatDate(ticket.commitTime);
          ticket.finishedTime = formatDate(ticket.finishedTime);
          $scope.workList = ticket;

          $scope.selectedPart = ticket.values.parts;

          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_history", $scope.historyData);
          $scope.$broadcast('WorkOrderSelectPart', {
            data: $scope.selectedPart,
            name: 'page'
          });

          getOrderStatus(ticket.values.orderId);

        });
      };
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      };

      //获取所有设备
      $scope.devicesList = [];
      $scope.devicesDic = {};
      var queryDevices = function () {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 从 info.json 中获取工单分类和紧急度
      var getInfo = function () {
        var defer = $q.defer();
        Info.get("../localdb/info.json", function (info) {
          $scope.orderType = $scope.myDicts['ticketCategory'];//工单分类
          $scope.priorityCodeList = info.priorityData;//紧急度
          defer.resolve();
        });
        return defer.promise;
      };
      // 获取工单流程
      var getTicketCategorys = function () {
        var defer = $q.defer();
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType = returnObj.data;
            }
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var init = function () {
        var promises = [];
        promises.push(queryDevices());
        promises.push(getTicketCategorys());
        promises.push(getInfo());
        $q.all(promises).then(function () {
          var UA = navigator.userAgent.toLowerCase();
          if (UA.indexOf("webkit") < 0) {
            $scope.browserClass = "wrong";
            $scope.myObj = { "display": "inline-flex" };
            $scope.myObjTop = { "margin-top": "6px" };
          }
          process();
        });
      };

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
