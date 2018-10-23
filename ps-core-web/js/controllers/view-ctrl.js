
define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'viewFlexService',
    'kpiDataService', 'resourceUIService', 'growl', 'userLoginUIService', 'userDomainService', '$document', 'userEnterpriseService', 'projectUIService',
      'customerUIService',"ngDialog", 'userRoleUIService','dictionaryService','linebodyUIService',
    function($scope, $location, $routeParams, $timeout, viewFlexService, kpiDataService, resourceUIService, growl, userLoginUIService, userDomainService, $document, userEnterpriseService, projectUIService
        ,customerUIService,ngDialog,userRoleUIService,dictionaryService,linebodyUIService) {
      var status = [];
      $scope.editVisible = false; //是否展示告警视图编辑框
      $scope.alertAry = [];
      $scope.domainListDic = {}; //域字典
      $scope.domainListTree = null; //树形域
      $scope.selectedAlertitem = {}; //选中的告警视图
      $scope.selectedDesignitem = null; //选中的性能视图
      $scope.cilistByModelId = []; //通过模型ID获得视图支持的设备列表
      $scope.routePathNodes = {};
      $scope.ifSolutionStatus = true;
      $scope.editState = false; //这在编辑的告警组状态，true正在编辑，不可以点击其他的告警组
      $scope.selectedCis = []; //选中的设备ID
      $scope.alertViewList = []; //通过接口查询视图
      $scope.selectedDitem = {};
      $scope.handlerUserList=[];//处理人列表
      $scope.selLength = 10;
      $scope.allDictList=[];//所有字典列表 页面中再用type 过滤
      $scope.selectAlertList = {
        selList: [],
        search: false,
        searchStatus: false
      };
      var alertId = $routeParams.alertId;
      var alertType = $routeParams.type;
      if($routeParams.status) {
        status = $routeParams.status.split(",");
      }
        $scope.closeAlarmData={};//关闭报警data wjd
      //查询字段
      var initHistory = function() {
        $scope.selectedDitem.label = [];
        if($scope.selectedAlertitem == undefined) {
          $scope.selectedAlertitem = {};
        }
        $scope.selectedAlertitem.domain = '';//厂部
        $scope.selectedAlertitem.plant = '';//车间
        $scope.selectedAlertitem.line = '';//线体
        $scope.selectedAlertitem.owner = '';//第一责任人
        $scope.selectedAlertitem.claimBy = '';//处理人
        $scope.selectedAlertitem.timeoutType = '';//是否超时
        $scope.selectedAlertitem.originType = '';//报警来源
        $scope.selectedAlertitem.states = '';//报警状态
        $scope.selectedAlertitem.nodeType = '';
        $scope.selectedAlertitem.nodeIds = '';//设备名称
        $scope.selectedAlertitem.alertCodes = '';
        $scope.selectedAlertitem.createTimeFrom = '';
        $scope.selectedAlertitem.createTimeTo = '';
        $scope.selectedAlertitem.pageSize = '';
        $scope.selectedAlertitem.messageFilter = '';
        $scope.selectedAlertitem.timeType = '1';
        $scope.selectedAlertitem.disposeType='';//处理类型
        // $scope.selectedAlertitem.severities = ['1', '2', '3'];


        if(status.length > 0 || alertId > 0 || alertId) {
          $scope.searchAlert();
        }

        $scope.shyj = '';
      };
      var severityAry = ["1", "2", "3", "4"];
      var stateAry = ["0", "5", "10", "20"];

      $scope.goBack = function() {
        // if($scope.selectAlertList.search == true) {
        //   $scope.selectAlertList.search = false;
        //   $scope.$broadcast(Event.ALERTINFOSINIT + "_view", {
        //     "option": []
        //   });
        // } else {
          $scope.selectAlertList.search = true;
          //initHistory();
        // }
      }

      //查询告警
      $scope.searchAlert = function() {

        var getSeverities = "";
        var getStates = "";

        var param = {};
        param = {
          'domain': $scope.selectedAlertitem.domain,
          'plant': $scope.selectedAlertitem.plant,
          'line': $scope.selectedAlertitem.line,
          'owner': $scope.selectedAlertitem.owner,//第一责任人
          'claimBy': $scope.selectedAlertitem.claimBy?$scope.selectedAlertitem.claimBy.join(","):'',//处理人
          'timeoutType': $scope.selectedAlertitem.timeoutType,
            'disposeType':$scope.selectedAlertitem.disposeType?$scope.selectedAlertitem.disposeType.join(","):'',//处理类型
          'originType': $scope.selectedAlertitem.originType?$scope.selectedAlertitem.originType.join(","):'',//报警来源
          'states': $scope.selectedAlertitem.states ? $scope.selectedAlertitem.states.join(",") : '',//报警状态
          'nodeType': $scope.selectedAlertitem.nodeType,
          'alertCodes': $scope.selectedAlertitem.alertCodes,
          'pageSize': $scope.selectedAlertitem.pageSize || 1000,
          'messageFilter': $scope.selectedAlertitem.messageFilter,
          'severities': $scope.selectedAlertitem.severities ? $scope.selectedAlertitem.severities.join(",") : ''//报警级别
        };
        if($scope.selectedAlertitem.timeType == "1") {
          param['firstTimeFrom'] = $scope.selectedAlertitem.createTimeFrom;
          param['firstTimeTo'] = $scope.selectedAlertitem.createTimeTo;
        } else if($scope.selectedAlertitem.timeType == "2") {
          param['lastTimeFrom'] = $scope.selectedAlertitem.createTimeFrom;
          param['lastTimeTo'] = $scope.selectedAlertitem.createTimeTo;
        } else if($scope.selectedAlertitem.timeType == "3") {
          param['closeTimeFrom'] = $scope.selectedAlertitem.createTimeFrom;
          param['closeTimeTo'] = $scope.selectedAlertitem.createTimeTo;
        }
        if(alertId > 0 && alertType == 'node') {
          param['nodeIds'] = parseInt(alertId);
          allDevice();
        } else {
          param['nodeIds'] = $scope.selectedAlertitem.nodeIds;
        }
        $timeout(function() {
          //可以通过告警id跟设备id查询
          if(alertId > 0 && alertType == 'alert') {
            param["alertId"] = alertId;
            alertId = null;
            $scope.$broadcast("searchAlertView", {
              "option": param
            });
          } else if(alertId > 0 && alertType == 'node') {
            param["nodeIds"] = parseInt(alertId);
            alertId = null;
            $scope.selectedAlertitem["nodeIds"] = parseInt(alertId);
            $scope.$broadcast("searchAlertView", {
              "option": param
            });
          } else if((alertId > 0 || alertId) && alertType == 'alert2domain') {
            var p = {
              'projectName': alertId
            };
            alertId = null;
            projectUIService.findProjectsByCondition(p, function(returnObj) {
              if(returnObj.code == 0) {
                param.states = "0,5,10";
                param.domain = returnObj.data[0].domainPath + returnObj.data[0].customerId + "/" + returnObj.data[0].id + "/";
                $scope.selectedAlertitem.domain = param.domain;
                $scope.$broadcast("searchAlertView", {
                  "option": param
                });
              }
            })
          } else {
            $scope.$broadcast("searchAlertView", {
              "option": param
            });
          }
        });
      };
        initHistory();
      $scope.faultList = [];
      $scope.alertDefinition = function(alertId, modelId, callback) {
        resourceUIService.getAlertDefinitionByAlertCode(alertId, modelId, function(res) {
          if(res.code == 0) {
            var dataList = res.data;
            $scope.faultList = [];
            if(res.data && dataList.alertType == "FAULT") {
              $scope.faultList.push(res.data);
            }
            if(callback) {
              callback();
            }
            return;
          }
        });
      }
      var selectedModelId = '';

      function getDeviceData(id, callbackfun) {
        resourceUIService.getResourceById(id, function(returnObj) {
          if(returnObj.code == 0 && returnObj.data) {
            $scope.selectedResource = returnObj.data;
            selectedModelId = returnObj.data.modelId;
            $scope.selectedAlertitem.nodeIds = returnObj.data.id;
            if(callbackfun) {
              callbackfun();
            }
          }
        })
      }

      //查询数据清零
      $scope.clearSearchAlert = function() {
        if($routeParams.nodeId == 0) {
          initHistory();
          $scope.selectedDitem.label = [];
        }
        else {
          $scope.selectedDitem.label = [];
          $scope.selectedAlertitem.domain = '';
          $scope.selectedAlertitem.nodeType = '';
          $scope.selectedAlertitem.nodeIds = '';
          $scope.selectedAlertitem.alertCodes = '';
          $scope.selectedAlertitem.createTimeFrom = '';
          $scope.selectedAlertitem.createTimeTo = '';
          $scope.selectedAlertitem.pageSize = '';
          $scope.selectedAlertitem.messageFilter = '';
          $scope.selectedAlertitem.timeType = '1';
          $scope.selectedAlertitem.states = [];
          $scope.selectedAlertitem.severities = [];
        };
      };

      var initSearchAlerts = function() {
        if($routeParams.nodeId) {
          getDeviceData($routeParams.nodeId, function() {
            $scope.selectedAlertitem.nodeType = $scope.selectedResource.modelId;
            $scope.selectedAlertitem.domain = $scope.selectedResource.domainPath;
            $scope.getAlertTypeByDeviceType(selectedModelId);
            $scope.searchAlert();
          });
        }
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
       * 获取设备视图
       *
       */
      var managedViews = function() {
        viewFlexService.getManagedViewsByTypeAndRole("configAlert", function(data) {
          if(data.code == 0) {
            var v = data.data;
            var viewList = [];
            for(var i = 0; i < v.length; i++) {
              var view = v[i];
              if(view) {
                var obj = {
                  "title": view.viewTitle.split("?")[0],
                  "url": "#/" + view.viewType + "/" + view.viewId,
                  "viewId": view.viewId,
                  "view": view,
                  "icon": "fa fa-warning"
                };
              }
              if(obj.title == "全部告警") {
                $scope.alertViewList.splice(0, 0, obj);
              } else {
                $scope.alertViewList.push(obj);
              }
            }
            init();
          }
        });
      }

      /**
       * 设备模板名称汉化
       * @param ciName
       */
      var urmpTree = function(ciName) {
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

      /**
       * 获取树形资源域
       */
      $scope.renderChartDom = function(data) {
        if(data) {
          var height = $document.find(".item_tr").width() * data.width / 100 * data.widthheightPortion;
          return {
            position: 'relative',
            float: 'left',
            width: data.width + "%",
            height: height
          }
        }
      };

      //资源域
      var getEnterpriseDomain = function() {
        //查询用户域
        userEnterpriseService.queryEnterpriseDomain(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.enterpriseDomain = returnObj.data;
          }
        });
      }

      /**
       * 初始化告警组图标
       * @param {Object} random
       */
      var getIcon = function(random) {
        var icon = "fa fa-warning";
        return icon;
      }

      /**
       * 告警组切换
       * 说明：除了切换时使用，在告警组新增、更新、删除等操作时调用
       * @param {Object} item
       */
      var severityAry = ["1", "2", "3", "4"];
      var stateAry = ["0", "5", "10", "20"];
      $scope.alertViewClick = function(item) {
        $scope.selectAlertList.search = false;
        if(item == undefined || item.length <= 0) {
          return;
        }
        if($scope.editState) {
          growl.warning('当前有正在编辑的告警组', {});
          return;
        }
        $scope.commitItem = item;
        $scope.viewId = item.viewId;
        if(typeof(item.view.content) == "string") {
          item.view.content = JSON.parse(item.view.content);
          if(!item.view.content.domainPath) {
            item.view.content.domainPath = item.view.content.domain;
          }
          //初始化checkbox    告警状态  0,5,10,20
          var ary = item.view.content.states.split(",")
          for(var i in stateAry) {
            item["state" + stateAry[i]] = false;
            for(var j in ary) {
              if(stateAry[i] == ary[j]) {
                item["state" + stateAry[i]] = true;
                ary.splice(j, 1);
                break;
              }
            }
          }
          //告警级别
          for(var i in severityAry) {
            item["severity" + severityAry[i]] = item.view.content.severities.indexOf(severityAry[i]) > -1 ? true : false;
          }
        }
        $scope.selectedAlertitem = item;
        $scope.cilistByModelId = [];
        if(!$scope.selectedAlertitem.resources) {
          if($scope.selectedAlertitem.view.resourceDesc) {
            var model = JSON.parse($scope.selectedAlertitem.view.resourceDesc);
            for(var i in model) {
              var modelId = model[0].modelId;
              resourceUIService.getResourceByModelId(modelId, function(returnObj) {
                if(returnObj.code == 0) {
                  returnObj.data.forEach(function(item) {
                    item.text = item.label;
                  })
                  $scope.cilistByModelId = returnObj.data;
                  $scope.selectedAlertitem.resources = returnObj.data;
                }
              });
            }
          } else {
            $scope.cilistByModelId = [];
          }
        } else {
          $scope.cilistByModelId = $scope.selectedAlertitem.resources;
        }

        //更新domain name
        if(!$scope.selectedAlertitem.alerts) {
          //点击更新告警类型
          if($scope.selectedAlertitem.view.content && typeof($scope.selectedAlertitem.view.content.nodeType) != "undefined")
            $scope.getAlertTypeByDeviceType($scope.selectedAlertitem.view.content.nodeType);
        } else {
          $scope.selectedDitem.alerts = $scope.selectedAlertitem.alerts;
        }
        if(item.viewId != 0) {
          $timeout(function() {
            $scope.$broadcast("alertViewClick", {
              "option": item
            });
          });
        }
      };

      /**
       * 新增告警视图的数据结构
       */
      var initAlertData = function() {
        var obj = {};
        obj.id = 0;
        obj.domainId = 0;
        obj.domainPath = "";
        obj.domainName = "";
        obj.description = "";
        obj.count = 0;
        var random = Math.random();
        obj.icon = getIcon(random);
        obj.alertlv = random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
        obj.isLoaded = 0;
        obj.type = 1;
        obj.name = "";
        obj.title = "";
        obj.label = obj.name;
        obj.view = {
          "viewId": "",
          "viewName": "",
          "viewTitle": "",
          "viewType": "configAlert",
          "protectLevel": "",
          "content": {
            "nodeType": "", //$("#selectedDeviceType").val().replace("number:","");    //节点类型 设备类型
            "domain": "", //$("#selectedDomainPath").val(); //域路径 资源域
            "domainLabel": "", //前端使用属性，后端不保存
            "severities": "", //告警级别过滤
            "states": "", //告警状态
            "pageSize": "1000", //一次查询返回的告警数
            "nodeIds": "", //节点过滤列表（不做）
            "alertCodes": "", //$("#selectedAlertType").val(),    //告警类型过滤
            "messageFilter": "" //关键字
          },
          "creator": "",
          "updator": "",
          "createTime": "",
          "updateTime": "",
          "description": "",
          "domainPath": "",
          "domainId": "",
          "resourceDesc": "",
          "statusType": "",
          "originalViewId": "",
          "modelPath": ""
        };
        obj.state0 = true;
        obj.state5 = true;
        obj.state10 = true;
        obj.state20 = true;
        obj.severity1 = true;
        obj.severity2 = true;
        obj.severity3 = true;
        obj.severity4 = true;
        return obj;
      };

      /**
       * 清空告警视图下方数据
       */
      function clearViewInfoData() {
        //新建告警视图，下方查询结果清空
        var columsData = [];
        var columnDefs = [];
        var columns = [$.ProudSmart.datatable.selectCol, {
          "data": "title",
          "title": "告警名称"
        }, {
          "data": "message",
          "title": "告警消息"
        }, {
          "data": "severity",
          "title": "告警级别"
        }, {
          "data": "state",
          "title": "状态"
        }, {
          "data": "arisingTime",
          "title": "最近告警时间"
        }, $.ProudSmart.datatable.optionCol3];
        $scope.$broadcast(Event.ALERTINFOSINIT, {
          "option": [columsData, columns, columnDefs]
        });

      }

      /**
       * 新增告警组
       */
      $scope.addAlertView = function() {
        $scope.editState = true;
        var handler = function() {
          for(var i in $scope.alertViewList) {
            if($scope.alertViewList[i].view.viewId == "") {
              growl.warning("当前有正在编辑的告警组，不能再添加告警组", {});
              return;
            }
          }
          $scope.alertViewList.push(initAlertData());
          $scope.selectedAlertitem = $scope.alertViewList[$scope.alertViewList.length - 1];
          $scope.editVisible = true;

          //新建告警视图，清空该告警下方的数据
          clearViewInfoData();

        }
        handler();
      };

      $scope.editAlertView = function() {
        $scope.editState = !$scope.editState;
        $scope.editVisible = !$scope.editVisible;
        if(!$scope.editVisible) return;
      };

      /**
       * 切换告警视图内容的CI，类似过滤操作
       * @param {Object} item
       */
      $scope.changeAlertCI = function(item) {
        //alertViewClick($scope.selectedAlertitem.view,item.id);
        var alertitem = {
          viewId: null,
          nodeId: item.id
        };
        $scope.$broadcast("alertViewClick", {
          "option": alertitem
        });
      };

      /**
       * 删除一个告警组
       */
      $scope.delAlertView = function() {
        if($scope.selectedAlertitem) {
          if($scope.editState) {
            growl.warning('当前有正在编辑的告警组', {});
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认要删除 “' + escape($scope.selectedAlertitem.title) + '” 告警组',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                //正在添加的告警视图删除操作，前端删除即可
                $scope.$apply();
                if($scope.selectedAlertitem.view.viewId == "") {
                  //growl.success("取消新建告警视图",{});
                  $scope.selectedAlertitem = false;
                  $scope.editVisible = false;
                  dialogRef.close();

                  for(var i in $scope.alertViewList) {
                    if($scope.alertViewList[i].view.viewId == "") {
                      $scope.alertViewList.splice(i, 1);
                      break;
                    }
                  }
                } else {
                  viewFlexService.deleteViews([$scope.selectedAlertitem.viewId], function(resultObj) {
                    if(resultObj.code == 0) {
                      for(var i in $scope.alertViewList) {
                        if($scope.alertViewList[i].view.viewId == $scope.selectedAlertitem.viewId) {
                          $scope.alertViewList.splice(i, 1);
                          break;
                        }
                      }
                      $scope.editVisible = false;

                      growl.success("删除告警组成功", {});
                      if($scope.alertViewList.length == 0) {
                        $scope.selectedAlertitem = null;
                      } else {
                        $scope.alertViewClick($scope.alertViewList[$scope.alertViewList.length - 1]);
                      }
                      return;
                    }
                  });
                  dialogRef.close();
                }
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        }
      };

      /**
       * 保存告警视图
       */
      $scope.saveAlertView = function() {
        $scope.editState = false;
        if(typeof($scope.selectedAlertitem.title) == "undefined") {
          return;
        }
        if(typeof($scope.selectedAlertitem.view.content.pageSize) == "undefined") {
          return;
        }
        if(!$scope.selectedAlertitem.title) {
          growl.warning("名称不能为空", {});
          return;
        }
        var getSeverities = "";
        var getStates = "";

        for(var i in severityAry) {
          if($scope.selectedAlertitem["severity" + severityAry[i]] == true) {
            getSeverities += severityAry[i] + ',';
          }
        }
        if(getSeverities.length != 0) {
          getSeverities = getSeverities.substring(0, getSeverities.length - 1);
        }

        for(var i in stateAry) {
          if($scope.selectedAlertitem["state" + stateAry[i]] == true) {
            getStates += stateAry[i] + ',';
          }
        }
        if(getStates.length != 0) {
          getStates = getStates.substring(0, getStates.length - 1);
        }

        //测试告警类型
        var selectedAlertCode = document.getElementById("selectedAlertType");
        var selIndex = selectedAlertCode.selectedIndex;
        var alertVal = selectedAlertCode.options[selIndex].value;
        var alertText = selectedAlertCode.options[selIndex].text;

        var viewInfo = {};
        viewInfo.viewId = $scope.selectedAlertitem.view.viewId ? $scope.selectedAlertitem.viewId : "";
        viewInfo.viewName = $scope.selectedAlertitem.title;
        viewInfo.viewTitle = viewInfo.viewName;
        viewInfo.viewType = "configAlert";
        viewInfo.protectLevel = $scope.selectedAlertitem.view.protectLevel ? $scope.selectedAlertitem.view.protectLevel : "";
        viewInfo.content = {
          "nodeType": $scope.selectedAlertitem.view.content.nodeType, //$("#selectedDeviceType").val().replace("number:","");    //节点类型 设备类型
          "domain": $scope.selectedAlertitem.view.content.domain, //域路径 资源域 $scope.selectedAlertitem.view.content.domain,
          "severities": $scope.selectedAlertitem.severities ? $scope.selectedAlertitem.severities.join(",") : '', //告警级别过滤
          "states": $scope.selectedAlertitem.states ? $scope.selectedAlertitem.states.join(",") : '', //告警状态
          "pageSize": $("#alertCount").val(), //一次查询返回的告警数
          "alertCodes": $scope.selectedAlertitem.view.content.alertCodes, //告警类型过滤
          "messageFilter": $scope.selectedAlertitem.view.content.messageFilter //关键字
        };
        viewInfo.creator = $scope.selectedAlertitem.view.creator ? $scope.selectedAlertitem.view.creator : "";
        viewInfo.updator = $scope.selectedAlertitem.view.updator ? $scope.selectedAlertitem.view.updator : "";
        viewInfo.createTime = $scope.selectedAlertitem.view.createTime ? $scope.selectedAlertitem.view.createTime : "";
        viewInfo.updateTime = $scope.selectedAlertitem.view.updateTime ? $scope.selectedAlertitem.view.updateTime : "";
        viewInfo.description = $scope.selectedAlertitem.view.description ? $scope.selectedAlertitem.view.description : "";
        viewInfo.domainPath = $scope.selectedAlertitem.view.domainPath ? $scope.selectedAlertitem.view.domainPath : "";
        viewInfo.domainId = $scope.selectedAlertitem.view.domainId ? $scope.selectedAlertitem.view.domainId : "";
        viewInfo.resourceDesc = $scope.selectedAlertitem.view.resourceDesc ? $scope.selectedAlertitem.view.resourceDesc : "";
        viewInfo.statusType = $scope.selectedAlertitem.view.statusType ? $scope.selectedAlertitem.view.statusType : "";
        viewInfo.originalViewId = $scope.selectedAlertitem.view.originalViewId ? $scope.selectedAlertitem.view.originalViewId : "";
        viewInfo.modelPath = $scope.selectedAlertitem.view.modelPath ? $scope.selectedAlertitem.view.modelPath : "";

        viewInfo.content = JSON.stringify(viewInfo.content);

        if($scope.selectedAlertitem.view.viewId == "") {
          //新建告警视图
          viewFlexService.addView(viewInfo, function(resultObj) {
            if(resultObj.code == 0) {
              //刷新重新遍历所有的告警视图
              growl.success("新建告警组成功", {});
              $scope.editVisible = false;
              $scope.selectedAlertitem.view = resultObj.data;
              $scope.selectedAlertitem.viewId = resultObj.data.viewId;
              $scope.alertViewClick($scope.selectedAlertitem);
              return true;
            } else {
              growl.warning("新建告警组失败", {});
              $scope.editVisible = true;
              return false;
            }
          });
        } else {
          viewFlexService.updateView(viewInfo, function(resultObj) {
            if(resultObj.code == 0) {
              growl.success("修改告警组成功", {});
              $scope.editVisible = false;
              $scope.selectedAlertitem.view = resultObj.data;
              $scope.selectedAlertitem.alerts = null;
              $scope.selectedAlertitem.resources = null;
              for(var i in $scope.alertViewList) {
                if($scope.alertViewList[i].view.viewId == resultObj.data.viewId) {
                  $scope.alertViewList[i] = $scope.selectedAlertitem;
                  break;
                }
              }
              $scope.alertViewClick($scope.selectedAlertitem);
              return;
            } else {
              growl.warning("修改告警组失败", {});
              $scope.editVisible = true;
              return;
            }
          })
        }
      }

      /**
       * 取消修改告警组
       */
      $scope.cancelAlertView = function() {
        $scope.editState = false;
        if($scope.selectedAlertitem.view.viewId == "") {
          for(var i in $scope.alertViewList) {
            if($scope.alertViewList[i].view.viewId == "") {
              $scope.alertViewList.splice(i, 1); //删除新建的告警组
              //选中上一个告警组
              if($scope.alertViewList.length > 0) {
                $scope.alertViewClick($scope.alertViewList[i - 1]);
              }
              break;
            }
          }
        }
        $scope.editVisible = !$scope.editVisible;
        if(!$scope.editVisible) return;
      };

      $scope.format = function(content) {
        if(typeof(content) == "string") {
          return JSON.parse(content);
        } else {
          return;
        }
      }
      var editChartView = function(v, nodeIds) {
        if(!v.content)
          return;
        var content;
        if(v.content.charAt(0) == "<") {
          content = jQuery.xml2json(v.content);
          if(content.hasOwnProperty("SubViews") == null || content.SubViews.hasOwnProperty("chart") == null) {
            return;
          }
          var chartObj = content.SubViews.chart;
          var arr = [];
          var groupObj = {};
          if(chartObj.hasOwnProperty("length")) {
            for(var j in chartObj) {
              if(chartObj[j].type == "LineChart" || chartObj[j].type == "PieChart" || chartObj[j].type == "GaugeChart") {
                if(nodeId) {
                  for(var i in chartObj[j].dataSource.filters.filter) {
                    var filterObj = chartObj[j].dataSource.filters.filter[i];
                    if(filterObj.type == "ci") {
                      filterObj.nodeIds = nodeIds.toString();
                    }
                  }

                }
                var titleObj = kpiDataService.getChartProperty(chartObj[j], "title");
                var titleAry = titleObj.value.split("::");
                if(titleAry.length > 1) {
                  if(groupObj[titleAry[0]]) {
                    var subObj = groupObj[titleAry[0]];
                    subObj["children"].push(chartObj[j]);
                    if(subObj["length"] == subObj["children"].length) {
                      arr.push(groupObj[titleAry[0]]);
                    }
                  } else {
                    var subObj = {};
                    subObj["length"] = titleAry[1];
                    subObj["type"] = chartObj[j].type;
                    subObj["isGroup"] = true;
                    subObj["children"] = [];
                    subObj["children"].push(chartObj[j]);
                    groupObj[titleAry[0]] = subObj;
                    if(subObj["length"] == subObj["children"].length) {
                      arr.push(groupObj[titleAry[0]]);
                    }
                  }
                } else {
                  arr.push(chartObj[j]);
                }
              }
            }

          } else {
            if(nodeId) {
              for(var i in chartObj.dataSource.filters.filter) {
                var filterObj = chartObj.dataSource.filters.filter[i];
                if(filterObj.type == "ci") {
                  filterObj.nodeIds = nodeIds.toString();
                }
              }

            }
            if(chartObj.type == "LineChart" || chartObj.type == "PieChart" || chartObj.type == "GaugeChart") {
              arr.push(chartObj);
            }
          }
          $scope.chartsItems = arr;
        } else {
          var s = v.content;
          content = JSON.parse(s);
          if(nodeIds && nodeIds.length > 0) {
            for(var i in content.elements) {
              content.elements[i].nodes = nodeIds;
            }
          }
          for(var i in content.elements) {
            var cols = 12;
            if(!content.elements[i].layout) {
              content.elements[i].layout = {
                row: i,
                col: 0,
                width: 100,
                widthheightPortion: .4,
                style: "height:500px",
                class: "col-lg-12"
              }
            } else {
              if(content.elements[i].height_absolute)
                content.elements[i].layout.style = {
                  height: content.elements[i].height_absolute + "px"
                };
              else
                content.elements[i].layout.style = {
                  height: "400px"
                };
              var col = Math.round(content.elements[i].layout.width * 12 * 0.01);
              content.elements[i].layout.class = "col-lg-" + col;
            }
          }
          $scope.chartsItems = content.elements;
        }
      };

      $scope.chartViewClick = function(item) {
        $scope.selectedCis = [];
        $scope.selectedDesignitem = item;
        $scope.cilistByModelId = [];
        kpiDataService.cilistByModelId = [];
        if(!$scope.selectedDesignitem.resources) {
          var model = JSON.parse($scope.selectedDesignitem.view.resourceDesc);
          for(var i in model) {
            var modelId = model[0].modelId;
            resourceUIService.getResourceByModelId(modelId, function(returnObj) {
              if(returnObj.code == 0) {
                returnObj.data.forEach(function(item) {
                  item.text = item.label;
                })
                $scope.selectedDesignitem.resources = returnObj.data;
                $scope.cilistByModelId = returnObj.data;
                kpiDataService.cilistByModelId = returnObj.data;
                editChartView($scope.selectedDesignitem.view, null);
              }
            });
          }
        } else {
          $scope.cilistByModelId = $scope.selectedDesignitem.resources;
          kpiDataService.cilistByModelId = $scope.selectedDesignitem.resources;
          editChartView($scope.selectedDesignitem.view, null);
        }
      };
      $scope.changeChartsCI = function(item) {
        editChartView($scope.selectedDesignitem.view, $scope.selectedCis);
      };
      $scope.addDesignView = function() {
        window.open("../app-editor/index.html#/echart");
      };
      $scope.editDesignView = function() {
        if($scope.selectedDesignitem) {
          if($scope.selectedDesignitem.view.content.charAt(0) == "<") {
            window.open("../iot-web/simpleView.html?viewId=" + $scope.selectedDesignitem.viewId);
          } else {
            window.open("../app-editor/index.html#/echart/" + $scope.selectedDesignitem.viewId);
          }
        }
      };
      $scope.delDesignView = function() {
        if($scope.selectedDesignitem) {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '是否要删除' + escape($scope.selectedDesignitem.title) + '视图',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                viewFlexService.deleteViews([$scope.selectedDesignitem.viewId], function(resultObj) {
                  if(resultObj.code == 0) {
                    growl.success("删除视图成功", {});
                    for(var i in $scope.designView) {
                      if($scope.designView[i].viewId == $scope.selectedDesignitem.viewId) {
                        $scope.selectedDesignitem = null;
                        $scope.designView.splice(i, 1);
                        $scope.chartsItems = null;
                        break;
                      }
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
      };

      /**
       * 通过设备类型获取告警类型,及告警设备名称
       */
      $scope.getAlertTypeByDeviceType = function() {
        var modelID = $scope.selectedAlertitem.nodeType;
        if(modelID == undefined || modelID == null || modelID == "") {
          $scope.selectedAlertitem.alerts = [];
          return;
        } else {
          getResourceAlerts(modelID);
          getResourceAlertsLabel(modelID);
          getResourceByModelId(modelID);
        }
      }

      function getResourceAlerts(modelID) {
        resourceUIService.findAlertDefinitions({}, function(returnObj) {
          if(returnObj.code == 0) {
            if($scope.selectedDitem.alerts == undefined) {
              $scope.selectedDitem["alerts"] = returnObj.data;
            } else {
              $scope.selectedDitem.alerts = returnObj.data;
              $scope.selectedAlertitem.alerts = returnObj.data;
            }
          };
        });
      }

      function getResourceAlertsLabel(modelID) {
        var obj = {
          "modelId": modelID
        };
        if($scope.selectedAlertitem.domain) {
          obj["domains"] = $scope.selectedAlertitem.domain;
        }

        resourceUIService.getDevicesByCondition(obj, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectedDitem.label = returnObj.data;
          }
        })
      }

      //通过设备跳转过来默认查询所有的设备
      function allDevice() {
        resourceUIService.getDevicesByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectedDitem.label = returnObj.data;
            alertId = 0;
          }
        })
      }
      var getResourceByModelId = function(modelID) {
        resourceUIService.getResourceByModelId(modelID, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.resources = returnObj.data;
          }
        })
      }
        /**
         * 获得厂部列表 wjd
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
         * 查询车间列表 wjd
         */
        $scope.projectsDic = {};
        var queryProject = function() {
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
        /**
         * 查询线体列表 wjd todo  后台service 还没有 20180912
         */
        //查询所有线体列表
        $scope.linebodyListAll=[];
        var queryLinebodyList = function(){
            linebodyUIService.findLinebodyByCondition({},function(returnObj){
                if(returnObj.code == 0) {
                    $scope.linebodyListAll = returnObj.data;
                    //defers[4].resolve("success");
                }
            })
        }
        /*
        厂部列表onchange wjd
         */
        $scope.projectsCustomerList = [];
        $scope.customerChange = function() {
            if($scope.selectedAlertitem.domain){
                $scope.projectsCustomerList = $scope.projectsListAll;
                $scope.projectsList = $scope.projectsListAll;
            }else{
                $scope.projectsCustomerList = [];
                $scope.projectsList = [];
            }
            //如果设备模板、项目、客户都没有选择，那么按照域查询指标
            //if (!$scope.selectedDitem.modelId && !$scope.selectedItem.projectId)
            // getKpisBymodelId(301);
        }
        /*
    车间列表onchange wjd
  */
        $scope.lineBodyList = [];
        $scope.projectChange = function() {
            if($scope.selectedAlertitem.plant){
                //$scope.projectsCustomerList = $scope.projectsListAll;
                $scope.lineBodyList = $scope.linebodyListAll;
            }else{
                //$scope.projectsCustomerList = [];
                $scope.lineBodyList = [];
            }
            //如果设备模板、项目、客户都没有选择，那么按照域查询指标
            //if (!$scope.selectedDitem.modelId && !$scope.selectedItem.projectId)
            // getKpisBymodelId(301);
        }
        //通过角色id查用户
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
                            $scope.handlerUserList = $scope.uniqueJsonArray(res.data.concat(res2.data),'userID');
                        }
                    });
                }
            });

        };
        //查询所有字典列表
        var initDictList = function () {
            dictionaryService.getAllDicts( function (res) {
                if (res.code == 0) {
                    $scope.allDictList = res.data;
                }
            });

        };
      var init = function() {
        //这里是处理从dashboard点击待处理告警的故障查询页面
        if($location.path() == "/configAlertByStatus") {
          var item = "0,5";
          $timeout(function() {
            $scope.$broadcast("alertViewClick", {
              "option": "",
              "states": item
            });
          })
        } else {
          resourceUIService.rootModel = null;
          if(!resourceUIService.rootModel) {
            resourceUIService.getRootModel(function(returnObj) {
              if(returnObj.code == 0) {
                resourceUIService.rootModel = returnObj.data;
                urmpTree();
                domainTreeQuery();
              }
            });
          } else {
            $scope.rootModel = resourceUIService.rootModel;
            $scope.rootModelDic = resourceUIService.rootModelDic;
            domainTreeQuery();
          }
          if($location.path().indexOf("configAlert") > 0) {
            getResourceAlerts();
              queryCustomer();//查询厂部列表 wjd
              queryProject();//查询所有车间 wjd
              queryLinebodyList();//查询所有线体
              allDevice();//wjd
              roleIdUserList();//查询报警相关角色处理人员列表
              initDictList();//初始化所有字典
              if(!$routeParams.hasOwnProperty("viewId") && !$routeParams.hasOwnProperty("nodeId")) {
              if($scope.alertViewList.length > 0 && $scope.alertViewList != undefined) {
                for(var i in $scope.alertViewList) {
                  $scope.alertViewClick($scope.alertViewList[i])
                  break;
                }
              } else {
                $timeout(function() {
                  $scope.$broadcast(Event.ALERTINFOSINIT + "_view", {
                    "option": []
                  });
                });
              }
            }
            if(status.length > 0 || alertId > 0 || alertId) {
              initHistory();
              $scope.selectAlertList.search = true;
            }
          } else {
            initHistory();
            if(!$routeParams.hasOwnProperty("viewId") && !$routeParams.hasOwnProperty("nodeId")) {
              for(var i in $scope.designView) {
                $scope.chartViewClick($scope.designView[i])
                break;
              }
              return;
            }
            if($routeParams.viewId) {
              for(var i in viewFlexService.viewList) {
                var v = viewFlexService.viewList[i];
                if(v.viewId == $routeParams.viewId) {
                  if(v.viewType == "designView") {
                    editChartView(v, $routeParams["nodeId"]);
                  }
                  break;
                }
              }
            }
          }
        }
      }

      if(userLoginUIService.user.isAuthenticated && viewFlexService.viewLoadFinished) {
        managedViews();
      } else {
        $scope.$on('viewLoadFinished', function(event, msg) {
          managedViews();
        });
      }
    }
  ]);
});
