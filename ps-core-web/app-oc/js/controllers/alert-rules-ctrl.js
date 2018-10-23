define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //告警规则
  controllers.initController('alertRulesCtrl', ['$scope', 'resourceUIService', '$q', 'dictionaryService', 'unitService', 'customerUIService', 'projectUIService', 'userDomainService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
    function($scope, resourceUIService, $q, dictionaryService, unitService, customerUIService, projectUIService, userDomainService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {
      var deferList = []; //用于执行顺序
      var selkpisByDomainsinit = false;
      $scope.routePathNodes = {}; //设备型号初始对象
      $scope.alertRulesLists = []; //告警规则列表
      $scope.modelLists = []; //kpi指标
      $scope.showType = $routeParams.type; //global，special
      $scope.mistakeMesg = {}; //用于验证用

      $scope.selectedCount = 0;
      $scope.abled = false;
      $scope.unabled = false;

      //获取所有设备型号，和设备型号里面的所有故障和测点的kpi指标
      $scope.kpiLists = {};
      $scope.kpiListsDic = {};
      //通过故障或告警不同状态，用设备模板id调用接口
      $scope.kpisLists = [];

      $scope.Category = [{
        index: "",
        label: "全部"
      }, {
        index: "FAULT",
        label: "故障"
      }, {
        index: "ALERT",
        label: "测点"
      }];

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

      $scope.condition = [{
        'name': '大于',
        'value': 'value>refValue'
      }, {
        'name': '大于等于',
        'value': 'value>=refValue'
      }, {
        'name': '等于',
        'value': 'value==refValue'
      }, {
        'name': '小于',
        'value': 'value<refValue'
      }, {
        'name': '小于等于',
        'value': 'value<=refValue'
      }, {
        'name': '表达式',
        'value': ''
      }];

      //添加告警规则
      $scope.addAlertRules = function(type) {
        initHistory();
        if(type == 'global') {
          location.href = "#/alertRules/global/0/edit";
        } else if(type == 'special') {
          location.href = "#/alertRules/special/0/edit";
        }
      };

      //保存
      $scope.saveData = function() {
        var alertRulesInfo = $.extend({}, $scope.alertRulesInfo, true);
        if(!alertRulesInfo.title) {
          growl.warning("请输入规则名称", {});
          return;
        }
        if(!alertRulesInfo.domain) {
          growl.warning("请选择管理域", {});
          return;
        }

        if(!alertRulesInfo.modelId && $scope.showType == 'global') {
          growl.warning("请选择资源类型", {});
          return;
        }

        if(alertRulesInfo.kpiCodes.length < 1) {
          growl.warning("请选择数据项", {});
          return;
        }
        if(!alertRulesInfo.refValue) {
          growl.warning("请填写阈值", {});
          return;
        }
        if(!alertRulesInfo.alertCode) {
          growl.warning("请选择告警类别", {});
          return;
        }
        if(!alertRulesInfo.severity) {
          growl.warning("请选择告警级别", {});
          return;
        }

        if($scope.showType != 'global') { //实例时特殊处理
          var modelID = alertRulesInfo.modelId;
          if((!modelID || modelID == 300) && alertRulesInfo.domain) { //如何选中了管理域
            alertRulesInfo.modelId = 300;
            var domainAry = alertRulesInfo.domain.split("/");
            alertRulesInfo.nodeIds = domainAry[domainAry.length - 2];
          }
          if((!modelID || modelID == 301) && alertRulesInfo.customerId) { //如何选中了客户，则为客户域，覆盖管理域
            alertRulesInfo.modelId = 301;
            alertRulesInfo.nodeIds = alertRulesInfo.customerId
          }
          if((!modelID || modelID == 302) && alertRulesInfo.projectId) { //如何选中了项目，则为项目域，覆盖客户域
            alertRulesInfo.modelId = 302;
            alertRulesInfo.nodeIds = alertRulesInfo.projectId
          }
        }

        var updataFun = function() {
          resourceUIService.updateKpiThreshold(alertRulesInfo, function(returnObj) {
            if(returnObj.code == 0) {
              if($routeParams.rulesId > 0) {
                if(alertRulesInfo.modelId == 300 || alertRulesInfo.modelId == 301 || alertRulesInfo.modelId == 302) {
                  alertRulesInfo.nodeIds = "";
                }
              }
              $scope.alertRulesInfo = alertRulesInfo;
              growl.success("告警规则信息修改完成", {});
              var alertRulesLists = $scope.alertRulesLists;
              for(var i in alertRulesLists) {
                if(alertRulesLists[i].id == alertRulesInfo.id) {
                  $.extend(alertRulesLists[i], alertRulesInfo);
                  break;
                }
              }
              $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_rules", {
                  "option": [$scope.alertRulesLists]
                });
              });
            }
          })
        }
        var addFun = function() {
          resourceUIService.addKpiThreshold(alertRulesInfo, function(returnObj) {
            if(returnObj.code == 0) {
              alertRulesInfo = returnObj.data;
              if($routeParams.rulesId > 0) {
                if(alertRulesInfo.modelId == 300 || alertRulesInfo.modelId == 301 || alertRulesInfo.modelId == 302) {
                  alertRulesInfo.nodeIds = "";
                }
              }
              $scope.alertRulesInfo.id = alertRulesInfo.id;
              $scope.alertRulesLists.push(alertRulesInfo);
              $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_rules", {
                  "option": [$scope.alertRulesLists]
                });
              })
              growl.success("告警规则信息添加成功", {});
            }
          });
        }
        if(alertRulesInfo.id > 0) {
          updataFun(alertRulesInfo);
        } else if(alertRulesInfo.id == 0) {
          addFun(alertRulesInfo);
        }
      };

      //删除,启用
      $scope.doAction = function(type, select, callback, ifOnly) {
        if(type == "deleteAlertRules") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: ifOnly ? '确认要删除此告警规则吗？' : '当前有 ' + select.length + '个告警规则可删除，确认要删除吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteKpiThresholds([select], function(returnObj) {
                  callback(returnObj);
                  if(returnObj.code == 0) {
                    var alertRulesLists = $scope.alertRulesLists;
                    for(var i in select) {
                      for(var j in alertRulesLists) {
                        if(alertRulesLists[j].id == select[i]) {
                          alertRulesLists.splice(j, 1);
                        }
                      }
                    }
                    $scope.selectedCount = 0;
                    $scope.abled = false;
                    $scope.unabled = false;
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                callback(false);
                dialogRef.close();
                $scope.selectedCount = 0;
                $scope.abled = false;
                $scope.unabled = false;
                $scope.$apply();
              }
            }]
          });
        } else if(type == "AlertEnable") {
          var enabled = select[1];
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: enabled ? (ifOnly ? '确认要启用此告警规则吗？' : '当前有 ' + select[0].length + '个告警规则未启用，确认要启用吗？') : (ifOnly ? '确认要停用此告警规则吗？' : '当前有 ' + select[0].length + '个告警规则未停用，确认要停用吗？'),
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.enabledKpiThresholds(select, function(returnObj) {
                  callback(returnObj);
                  if(returnObj.code == 0) {
                    if(enabled) {
                      $scope.abled = false;
                      $scope.unabled = false;
                    } else {
                      $scope.abled = false;
                      $scope.unabled = false;
                    }
                    $scope.selectedCount = 0;
                    return;
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                callback(false);
                $scope.selectedCount = 0;
                $scope.abled = false;
                $scope.unabled = false;
                $scope.$apply();
                dialogRef.close();
              }
            }]
          });
        } else if(type == "copy") {
          resourceUIService.copyKpiThresholdById([select.id], function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("告警规则信息复制成功", {});
              $scope.alertRulesLists.push(returnObj.data);
              $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_rules", {
                  "option": [$scope.alertRulesLists]
                });
              })
              callback(returnObj);
            }
          })
        }
      };

      //全局设备型号过滤数据项
      $scope.selectModel = function() {
        //      if($scope.alertRulesInfo.classify) { //数据分类
        $scope.queryKpis($scope.alertRulesInfo.classify);
        //      }
      };

      //实例设备过滤数据项
      $scope.selkpisByDevice = function(item) {
        var id = item.id.replace(/[^0-9]+/g, "").split("").join("");
        for(var i in $scope.allDeveicesList) {
          if($.trim(id) == $scope.allDeveicesList[i].id) {
            $scope._modelId = $scope.allDeveicesList[i].modelId;
            $scope.alertRulesInfo.modelId = $scope.allDeveicesList[i].modelId;
            break;
          }
        }
        $scope.queryKpis($scope.alertRulesInfo.classify);
      };

      $scope.selkpisByDomains = function() {
        if($scope.showType != 'global' && $scope.alertRulesInfo.domain && selkpisByDomainsinit) { //如何选中了管理域
          $scope.alertRulesInfo.modelId = "300";
          $scope.alertRulesInfo.customerId = "";
          $scope.alertRulesInfo.projectId = "";
          $scope.alertRulesInfo.classify = "";
          $scope.alertRulesInfo.nodeIds = "";
          $scope.queryKpis("");
        }
        selkpisByDomainsinit = true;
      }
      $scope.selkpisByCustomer = function() {
        if($scope.alertRulesInfo.customerId) { //如何选中了客户，则为客户域，覆盖管理域
          $scope.alertRulesInfo.modelId = "301";
          $scope.alertRulesInfo.projectId = "";
          $scope.alertRulesInfo.classify = "";
          $scope.alertRulesInfo.nodeIds = "";
          $scope.queryKpis("");
        }
      }
      $scope.selkpisByProject = function() {
        if($scope.alertRulesInfo.projectId) { //如何选中了项目，则为项目域，覆盖客户域
          $scope.alertRulesInfo.modelId = "302";
          $scope.alertRulesInfo.classify = "";
          $scope.alertRulesInfo.nodeIds = "";
          $scope.queryKpis("");
        }
      }

      $scope.queryKpis = function(alertCode) {
        /** 以下是老版本的处理方法，并不好用
         * 1、每次都重新查询没有必要，因为对于模板的KPI和KQI都存在kpiLists中
         * 2、域（包括客户、项目）的KQI可以取得后存在kpiLists中
        var modelID = $scope.alertRulesInfo.modelId ? $scope.alertRulesInfo.modelId : ($scope._modelId ? $scope._modelId : "");
        if (alertCode == "ALERT" && modelID) {
          resourceUIService.getKpisByModelId(modelID, function(returnObj) {
            if (returnObj.code == 0) {
              returnObj.data.forEach(function(item) {
                item.text = item.label;
              })
              $scope.kpisLists = returnObj.data;
            }
          })
        } else if (alertCode == "FAULT" && modelID) {
          resourceUIService.getFaultsByModelId(modelID, function(returnObj) {
            if (returnObj.code == 0) {
              returnObj.data.forEach(function(item) {
                item.text = item.label;
              })
              $scope.kpisLists = returnObj.data;
            }
          })
        }
        */
        var modelID = $scope.alertRulesInfo.modelId;
        var temLists = [];
        if($scope.kpiListsDic && $scope.kpiListsDic[modelID]) {
          for(var i in $scope.kpiListsDic[modelID]) {
            var kpi = $scope.kpiListsDic[modelID][i];
            if(kpi.type == "fault" && alertCode == "FAULT") {
              temLists.push(kpi);
            } else if(kpi.type == "kpi" && alertCode == "ALERT") {
              temLists.push(kpi);
            } else if(alertCode != "FAULT" && alertCode != "ALERT") {
              temLists.push(kpi);
            }
          }
          $scope.kpisLists = temLists;
          $timeout(function() {
            $scope.$apply();
          })
        }
      };

      //触发条件不改变阈值时触发验证
      $scope.changeVal = function() {
        if($scope.alertRulesInfo.refValue) {
          $scope.alertRulesInfo.refValue = "";
          $scope.mistakeMesg.number = false;
          // $scope.verifyFun($scope.alertRulesInfo.refValue, 'number');
        }
      };

      //验证阈值
      $scope.verifyFun = function(value, type) {
        var reg, r;
        if(type == "phone") {
          var isMob = /^((1[34578]\d{9})|(0\d{2,4}\-\d{7,8})|\d{8})$/;
          r = isMob.test(value);
          if(!r) {
            $scope.mistakeMesg.phone = true;
          } else {
            $scope.mistakeMesg.phone = false;
          }
        } else if(type == "email") {
          reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
          r = reg.test(value);
          if(!r) {
            $scope.mistakeMesg.email = true;
          } else {
            $scope.mistakeMesg.email = false;
          }
        } else if(type == "number" && $scope.alertRulesInfo.condition) {
          reg = /^[+-]?([1-9][0-9]*|0)(\.[0-9]+)?%?$/; //全体实数
          r = reg.test(value);
          if(!r) { //不为数字
            $scope.mistakeMesg.number = true;
          } else {
            $scope.mistakeMesg.number = false;
          }
        } else if(type == "number" && !$scope.alertRulesInfo.condition) { //输入表达式
          if($.trim(value).length == 0) {
            $scope.mistakeMesg.number = true;
          } else {
            $scope.mistakeMesg.number = false;
          }
        }
      };

      //获取全部告警分类
      $scope.allAlertClassify = function(reflash) {
        var defer = $q.defer();
        resourceUIService.findAlertDefinitions({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              if(item.name) {
                item.text = item.label + "（" + item.name + "）";
              } else {
                item.text = item.label;
              }
            })
            $scope.alertClassifyLists = [{
              id: 0,
              text: "请选择..."
            }].concat(returnObj.data);
          }
          if(reflash) {
            growl.success("操作成功!");
          } else {
            defer.resolve("success");
          }
        })
        if(!reflash)
          deferList.push(defer.promise);
      };

      // 清空其他选择项
      $scope.getChange = function() {
        if($scope.queryState == 1) {
          $scope.selectedItem.modelId = "";
          $scope.selectedItem.nodeIds = "";
          $scope.selectedItem.domain = "";
        } else if($scope.queryState == 2) {
          $scope.selectedItem.domain = "";
          $scope.selectedItem.nodeIds = "";
          $scope.selectedItem.title = "";
        } else if($scope.queryState == 3) {
          $scope.selectedItem.domain = "";
          $scope.selectedItem.modelId = "";
          $scope.selectedItem.title = "";
        } else if($scope.queryState == 4) {
          $scope.selectedItem.title = "";
          $scope.selectedItem.modelId = "";
          $scope.selectedItem.nodeIds = "";
        }
      };

      $scope.searchData = function() {
        var param = {
          'nodeIds': "" ? "" : ($routeParams.nodeId ? $routeParams.nodeId : $scope.selectedItem.nodeIds),
          'alertCode': "" ? "" : ($routeParams.alertCode ? $routeParams.alertCode : $scope.selectedItem.alertCode),
          'modelId': "" ? "" : $scope.selectedItem.modelId,
          'domain': $scope.selectedItem.domain ? $scope.selectedItem.domain : "",
          'id': "" ? "" : ($routeParams.rulesId ? $routeParams.rulesId : $scope.selectedItem.id),
          'title': "" ? "" : $scope.selectedItem.title
        };

        resourceUIService.findKpiThresholds(param, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function (alertRule) {
              alertRule.kpiCodes = alertRule.kpiCodes || [alertRule.kpiCode];
            });
            if($routeParams.rulesId > 0) {
              returnObj.data[0].nodeIds = parseInt(returnObj.data[0].nodeIds);
              if(returnObj.data[0].modelId == 300 || returnObj.data[0].modelId == 301 || returnObj.data[0].modelId == 302) {
                returnObj.data[0].nodeIds = "";
              }
              $scope.alertRulesInfo = returnObj.data[0];
              // $scope.alertRulesInfo.nodeIds = ""; //设备清空，否则在编辑状态没有可选设备，仍可以保存成功
              $scope.queryKpis($scope.alertRulesInfo.classify);
              return;
            }
            $scope.alertRulesLists = returnObj.data;
            $timeout(function() {
              $scope.$broadcast(Event.ALERTRULESINIT + "_rules", {
                "option": [$scope.alertRulesLists]
              });
            })
          }
        });
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
      function modelList() {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            handler(returnObj);
          }
        })
      };

      

      //获取全部项目
      (function() {
        var defer = $q.defer();
        projectUIService.findProjectsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              obj.text = obj.projectName;
              obj.id = obj.id;
              newObj.push(obj);
            });
            $scope.projectList = newObj;
            defer.resolve('asdasd');
          }
        })
        deferList.push(defer.promise);
      })();

      //获取全部客户
      (function() {
        var defer = $q.defer();
        customerUIService.findCustomersByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              obj.text = obj.customerName;
              obj.id = obj.id;
              newObj.push(obj);
            });
            $scope.CustomerList = newObj;
            $scope.customerDic = returnObj.customerDic;
          }
          defer.resolve('asdasd');
        });
        deferList.push(defer.promise);
      })();
      
      function modelLists() {
        $scope.kpiLists = {};
        var defer = $q.defer();
        function kpilistHandler() {
          var newObjs = [];
          for (var key in resourceUIService.rootModelsDic) {
            var keyItem = resourceUIService.rootModelsDic[key];
            if (keyItem && keyItem.model) {
              newObjs.push(keyItem.model)
              var modelKpiDef = resourceUIService.rootModelsDic[keyItem.model.id].kpiDic;
              if (modelKpiDef) {
                for (var k in modelKpiDef) {
                  modelKpiDef[k].text = modelKpiDef[k].label;
                  $scope.kpiLists[modelKpiDef[k].id] = modelKpiDef[k];
                }
                $scope.kpiListsDic[keyItem.model.id] = modelKpiDef;
              }
            }
          }
          newObjs.map(function(item) {
            item.text = item.label
          })
          $scope.allModelLists = newObjs;
          defer.resolve("success");
        }

        if (resourceUIService.rootModelsDic && resourceUIService.rootModelsDic["kpiDefloaded"]) {
          kpilistHandler()
        } else {
          $scope.$on('kpiDefLoadFinished',function(e) {
            kpilistHandler()
          })
        }
        deferList.push(defer.promise);
      };

      //根据用户Id查用户域
      function domainTreeQuery() {
        var defer = $q.defer();
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          defer.resolve("success");
        });
        deferList.push(defer.promise);
      };
      
      //获取所有设备
      function queryAllDevicesList() {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              obj.text = obj.label;
              obj.id = obj.id;
              newObj.push(obj);
            });
            $scope.allDeveicesList = newObj;
          }
          defer.resolve("success");
        })
        deferList.push(defer.promise);
      };
      
      //查询/展示字段
      function initHistory() {
        $scope.selectedItem = {
          "title": "",
          "modelId": "",
          "nodeIds": "",
          "domain": ""
        };
        $scope.alertRulesInfo = {
          "id": 0,
          "title": "", //规则名称
          "kpiCodes": [], //指标
          "desc": "", //规则描述
          "enabled": false,
          "condition": "", //阈值条件
          "refValue": "", //阈值
          "severity": "", //告警级别
          "modelId": "", //设备型号
          "alertCode": "", //告警类别
          "ruleType": "", //告警规则类型
          "domain": "", //域
          "nodeIds": "", //设备实例id
          "customerId": "", //客户id
          "projectId": "", //项目id
          "classify": "", //数据分类,
          "risingTime": new Date()
        };
      };

      function init() {
        initHistory();
        queryAllDevicesList();
        domainTreeQuery();
        modelLists();
        
        $scope.allAlertClassify();
        $q.all(deferList).then(function() {
          $scope.searchData();
        });
        if($routeParams.viewType == "edit") { //新增，查看可编辑
          $scope.showView = true;
        } else {
          $scope.showView = false; //不可查看
        }
      };
      
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

  //告警分类
  controllers.initController('alertClassifyCtrl', ['$scope', 'resourceUIService', 'userDomainService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
    function($scope, resourceUIService, userDomainService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {
      $scope.alertClassifyLists = []; //告警分类列表
      $scope.mistakeMesg = {}; //错误提示
      $scope.selectedCount = 0;
      //查询/展示字段
      function initHistory() {
        $scope.selectedItem = {
          "orCondition": "",
          "label": "", //告警分类名称
          "name": "", //告警类别
          "description": "" //说明
        };
        $scope.alertClassifyInfo = {
          "id": 0,
          "label": "", //告警分类名称
          "name": "", //告警
          "description": "", //说明
          "risingTime": new Date()
        };
      };

      //弹出框的关闭事件
      $scope.closeDialog = function() {
        ngDialog.close();
      };

      //添加告警分类
      $scope.addalertClassify = function() {
        initHistory();
        ngDialog.open({
          template: '../partials/dialogue/alert_classification_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };

      //保存
      $scope.saveData = function() {
        var alertClassifyInfo = $scope.alertClassifyInfo;
        if(alertClassifyInfo.id > 0) {
          resourceUIService.updateAlertDefinition(alertClassifyInfo, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("告警类别修改完成", {});
              var alertClassifyLists = $scope.alertClassifyLists;
              for(var i in alertClassifyLists) {
                if(alertClassifyLists[i].id == alertClassifyInfo.id) {
                  $.extend(alertClassifyLists[i], alertClassifyInfo);
                  break;
                }
              }
              $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_classify", {
                  "option": [$scope.alertClassifyLists]
                });
              })
              ngDialog.close();
            }
          })
        } else if(alertClassifyInfo.id == 0) {
          resourceUIService.addAlertDefinition(alertClassifyInfo, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("告警类别添加成功", {});
              $scope.alertClassifyLists.push(returnObj.data);
              $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_classify", {
                  "option": [$scope.alertClassifyLists]
                });
              })
              ngDialog.close();
            }
          })
        }
      };

      $scope.doAction = function(type, select, callback) {
        if(type == "deleteAlertClassify") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除已选中告警类别记录？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteAlertDefinition([select], function(returnObj) {
                  callback(returnObj.code);
                  if(returnObj.code == 0) {
                    var alertClassifyLists = $scope.alertClassifyLists;
                    for(var i in select) {
                      for(var j in alertClassifyLists) {
                        if(alertClassifyLists[j].id == select[i]) {
                          alertClassifyLists.splice(j, 1);
                        }
                      }
                    }
                    $scope.selectedCount = 0;
                    growl.success("告警类别记录已删除", {});
                    return;
                  }
                })
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

      // 清空其他选择项
      $scope.getChange = function() {
        $scope.selectedItem.orCondition = !$scope.queryState ? $scope.selectedItem.orCondition : null;
        $scope.selectedItem.label = $scope.queryState == 1 ? $scope.selectedItem.label : null;
        $scope.selectedItem.name = $scope.queryState == 2 ? $scope.selectedItem.name : null;
        $scope.selectedItem.description = $scope.queryState == 3 ? $scope.selectedItem.description : null;
      };

      //验证长度
      $scope.verifyFun = function(value, type) {
        var reg, r;
        if(type == "length") {
          reg = /^(?!.{33}|^\s*$)/; //不能超32个字符且不为空
          r = reg.test(value);
          if(!r) {
            $scope.mistakeMesg.length = true;
          } else {
            $scope.mistakeMesg.length = false;
          }
        }
      };

      //查询
      $scope.searchData = function() {
        var param = {
          "id": "" ? "" : ($routeParams.id ? $routeParams.id : $scope.selectedItem.id),
          "orCondition": "" ? "" : $scope.selectedItem.orCondition,
          "name": "" ? "" : $scope.selectedItem.name,
          "description": $scope.selectedItem.description ? $scope.selectedItem.description : "",
          "label": "" ? "" : $scope.selectedItem.label
        };

        resourceUIService.findAlertDefinitions(param, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.alertClassifyLists = returnObj.data;
            $timeout(function() {
              $scope.$broadcast(Event.ALERTRULESINIT + "_classify", {
                "option": [$scope.alertClassifyLists]
              });
            })
          }
        });

      };

      var init = function() {
        initHistory();
        $scope.searchData();
      };

      /**
       * 监听登录状态
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

  //数据项
  controllers.initController('kpiTypeCtrl', ['$scope', 'resourceUIService', 'userDomainService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
      function($scope, resourceUIService, userDomainService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {
          $scope.kpiTypeLists = []; //告警分类列表
          $scope.mistakeMesg = {}; //错误提示
          $scope.selectedCount = 0;
          //查询/展示字段
          function initHistory() {
              $scope.selectedItem = {
                  "orCondition": "",
                  "label": "", //告警分类名称
                  "name": "", //告警类别
                  "description": "" //说明
              };
              $scope.kpiTypeInfo = {
                  "id": 0,
                  "label": "", //数据项名称
                  "name": "", //数据项name
                  "unit": "", //数据项单位
                  "number" : "",//是否数值
                  "type" : "",//数据分类
                  "range" : "", //取值范围
                  "icon" : "", //数据项图标
              };
          };

          //弹出框的关闭事件
          $scope.closeDialog = function() {
              ngDialog.close();
          };

          //添加告警分类
          $scope.addkpiType = function() {
              initHistory();
              ngDialog.open({
                  template: '../partials/dialogue/kpi_type_dia.html',
                  className: 'ngdialog-theme-plain',
                  scope: $scope
              });
          };

          //保存
          $scope.saveKpiType = function() {
            // debugger
              var kpiTypeInfo = $scope.kpiTypeInfo;
              if(kpiTypeInfo.id > 0) {
                  resourceUIService.saveKpiType(kpiTypeInfo, function(returnObj) {
                      if(returnObj.code == 0) {
                          growl.success("数据项修改完成", {});
                          var kpiTypeLists = $scope.kpiTypeLists;
                          for(var i in kpiTypeLists) {
                              if(kpiTypeLists[i].id == kpiTypeInfo.id) {
                                  $.extend(kpiTypeLists[i], kpiTypeInfo);
                                  break;
                              }
                          }
                          $timeout(function() {
                              $scope.$broadcast(Event.ALERTRULESINIT + "_kpitype", {
                                  "option": [$scope.kpiTypeLists]
                              });
                          })
                          ngDialog.close();
                      }
                  })
              } else if(kpiTypeInfo.id == 0) {
                  resourceUIService.saveKpiType(kpiTypeInfo, function(returnObj) {
                      if(returnObj.code == 0) {
                          growl.success("数据项添加成功", {});
                          $scope.kpiTypeLists.push(returnObj.data);
                          $timeout(function() {
                              $scope.$broadcast(Event.ALERTRULESINIT + "_kpitype", {
                                  "option": [$scope.kpiTypeLists]
                              });
                          })
                          ngDialog.close();
                      }
                  })
              }
          };

          //删除
          $scope.doAction = function(type, select, callback) {
              if(type == "deleteAlertClassify") {
                  BootstrapDialog.show({
                      title: '提示',
                      closable: false,
                      message: '确认删除已选中数据项？',
                      buttons: [{
                          label: '确定',
                          cssClass: 'btn-success',
                          action: function(dialogRef) {
                              resourceUIService.deleteKpiTypeByIds([select], function(returnObj) {
                                  callback(returnObj.code);
                                  if(returnObj.code == 0) {
                                      var kpiTypeLists = $scope.kpiTypeLists;
                                      for(var i in select) {
                                          for(var j in kpiTypeLists) {
                                              if(kpiTypeLists[j].id == select[i]) {
                                                  kpiTypeLists.splice(j, 1);
                                              }
                                          }
                                      }
                                      $scope.selectedCount = 0;
                                      growl.success("数据项记录已删除", {});
                                      return;
                                  }
                              })
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

          // 清空其他选择项
          $scope.getChange = function() {
              $scope.selectedItem.orCondition = !$scope.queryState ? $scope.selectedItem.orCondition : null;
              $scope.selectedItem.label = $scope.queryState == 1 ? $scope.selectedItem.label : null;
              $scope.selectedItem.name = $scope.queryState == 2 ? $scope.selectedItem.name : null;
              $scope.selectedItem.description = $scope.queryState == 3 ? $scope.selectedItem.description : null;
          };

          //验证长度
          $scope.verifyFun = function(value, type) {
              var reg, r;
              if(type == "length") {
                  reg = /^(?!.{33}|^\s*$)/; //不能超32个字符且不为空
                  r = reg.test(value);
                  if(!r) {
                      $scope.mistakeMesg.length = true;
                  } else {
                      $scope.mistakeMesg.length = false;
                  }
              }
          };

          //查询
          $scope.searchData = function() {
              var param = {
                  // "id": "" ? "" : ($routeParams.id ? $routeParams.id : $scope.selectedItem.id),
                  // "orCondition": "" ? "" : $scope.selectedItem.orCondition,
                  // "name": "" ? "" : $scope.selectedItem.name,
                  // "description": $scope.selectedItem.description ? $scope.selectedItem.description : "",
                  "label": "" ? "" : $scope.selectedItem.label
              };

              resourceUIService.getKpiTypeByFilter(param, function(returnObj) {
                // debugger
                  if(returnObj.code == 0) {
                      $scope.kpiTypeLists = returnObj.data;
                      $timeout(function() {
                          $scope.$broadcast(Event.ALERTRULESINIT + "_kpitype", {
                              "option": [$scope.kpiTypeLists]
                          });
                      })
                  }
              });

          };

          var init = function() {
              initHistory();
              $scope.searchData();
          };

          /**
           * 监听登录状态
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

  //告警通知规则
  controllers.initController('alertInformCtrl', ['$scope', 'resourceUIService', '$q', 'dictionaryService', 'userEnterpriseService', 'userDomainService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
    function($scope, resourceUIService, $q, dictionaryService, userEnterpriseService, userDomainService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {
      $scope.routePathNodes = {};
      $scope.alertInformLists = [];
      $scope.allModelLists = []; // 模板
      $scope.selectedCount = 0;
      var deferList = [];
      var rootInformId = $routeParams.alertInformsId; //跳转过来的id
      $scope.mistakeMesg = { //验证错误信息提示
        email: false,
        phone: false
      };

      //查询/展示字段
      function initHistory() {
        $scope.selectedItem = {
          "label": "", //告警分类名称
          "modelId": "", //设备型号
          "name": "" //分类编码
        };
        $scope.alertInformsInfo = {
          "id": 0,
          "kpiThresholdId": rootInformId,
          "ruleName": "", //告警通知规则名称
          "personType": "", //通知人员类型
          "noticeRole": "", //通知角色
          templates: [{
            "noticeWay": "", //通知方式
            "noticeRole": "", //角色
            "noticeTemplate": "", //通知模板
            "contact": "" //联系方式
          }],
          "risingTime": new Date()
        };
      };

      var initData = function() {
        //人员
        $scope.notificationType = $scope.myDicts['noticePersonType'];
        //通知方式
        $scope.notificationList = $scope.myDicts['noticeWay'];

        //所有通知列表
        $scope.templates = [];
        $scope.notificationType.forEach(function(item) {
          $scope.notificationList.forEach(function(list) {
            var templatesDic = {
              personType: item.valueCode,
              personTypeLabel: item.label,
              noticeWay: list.valueCode,
              noticeWayLabel: list.label,
              state: true,
              noticeRole: "", //角色
              noticeTemplate: "", //通知模板
              contact: "" //联系方式
            };
            if (item.valueCode == "outSystem") {
              if (list.valueCode == 'sms' || list.valueCode == 'email') {
                $scope.templates.push(templatesDic);
              }
            } else {
              $scope.templates.push(templatesDic);
            }
          });
        });
      };

      //弹出框的关闭事件
      $scope.closeDialog = function() {
        ngDialog.close();
      };

      //添加告警通知
      $scope.addalertInforms = function() {
        initHistory();
        $scope.templates.forEach(function(item) {
          item.state = true;
          item.contact = "";
        });
        // $scope.notifications = [];
        // $scope.queryTemplLists = [];
        ngDialog.open({
          template: '../partials/dialogue/alert_inform_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };

      //保存
      $scope.saveData = function() {
        var alertInformsInfo = $scope.alertInformsInfo;
        var templParams = $scope.templates.filter(function(item) {
          return item.state == true && item.personType == alertInformsInfo.personType;
        });
        alertInformsInfo.templates = templParams;
        if(templParams.length == 0 && alertInformsInfo.personType == 'outSystem') {
          growl.warning("请手机号或邮箱选其一进行填写", {});
          return;
        }
        if(alertInformsInfo.personType == 'outSystem') {
          for(var key in templParams) {
            if(templParams[key].contact == "") {
              growl.warning("请输入完成" + templParams[key].noticeWayLabel + "信息");
              return;
            }
          }
        }

        if($scope.mistakeMesg.phone && alertInformsInfo.personType == 'outSystem') {
          growl.warning("请正确输入手机号", {});
          return;
        }
        if($scope.mistakeMesg.email && alertInformsInfo.personType == 'outSystem') {
          growl.warning("请输入正确的邮箱地址", {});
          return;
        }
        if((alertInformsInfo.noticeRole == 0 || alertInformsInfo.noticeRole == "") && alertInformsInfo.personType == 'inSystem') {
          growl.warning("请选择通知角色", {});
          return;
        }
        var ruleTempName = getRuleTempName(alertInformsInfo);

        if(alertInformsInfo.id > 0) {
          if($scope.alertInformDic[ruleTempName]) {
            var find = $scope.alertInformDic[ruleTempName].find(function(elem) {
              return elem.id == alertInformsInfo.id;
            });
            if(!find) {
              growl.warning("该通知信息已经有类似的，请选中【" + $scope.alertInformDic[ruleTempName][0].ruleName + "】", {});
              return;
            }
          }

          var updatedDeferList = [];
          $scope.alertInformDic[alertInformsInfo.ruleTempName].forEach(function(item) {
            var defer = $q.defer();
            item.ruleName = alertInformsInfo.ruleName;
            item.noticeRole = alertInformsInfo.noticeRole;
            item.templates = alertInformsInfo.templates;
            item.personType = alertInformsInfo.personType;
            resourceUIService.updateNoticeRule(item, function(returnObj) {
              if(returnObj.code == 0) {
                defer.resolve("success");
              }
            })
            updatedDeferList.push(defer.promise)
          })
          $q.all(updatedDeferList).then(function() {
            growl.success("告警通知信息修改完成", {});
            var alertInformLists = $scope.alertInformLists;
            for(var i in alertInformLists) {
              if(alertInformLists[i].id == alertInformsInfo.id) {
                $.extend(alertInformLists[i], alertInformsInfo);
                break;
              }
            }
            $timeout(function() {
              $scope.$broadcast(Event.ALERTRULESINIT + "_informs", {
                "option": [$scope.alertInformLists]
              });
            });
            ngDialog.close();
          });
        } else if(alertInformsInfo.id == 0) {
          if($scope.alertInformDic[ruleTempName]) {
            growl.warning("该通知信息已经有类似的，请选中【" + $scope.alertInformDic[ruleTempName][0].ruleName + "】", {});
            return;
          }
          resourceUIService.addNoticeRule(alertInformsInfo, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("告警通知信息添加成功", {});
              var newItem = returnObj.data;
              newItem.ruleTempName = ruleTempName;
              newItem.kpiThresholdIds = [rootInformId];
              newItem.selected = true;
              $scope.alertInformLists.push(newItem);
              $scope.alertInformDic[ruleTempName] = [newItem]
              $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_informs", {
                  "option": [$scope.alertInformLists]
                });
              })
              ngDialog.close();
            }
          })
        }
      };

      //动作
      $scope.doAction = function(type, select, callback) {
        if(type == "deleteAlertForm") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '如删除该告警通知记录，则基于该通知的告警规则都会失效，确认要删除么？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                var delIds = [];
                //查找字典下该规则的通知
                $scope.alertInformDic[select.ruleTempName].forEach(function(delitem) {
                  delIds.push(delitem.id);
                })
                resourceUIService.deleteNoticeRule([delIds], function(returnObj) {
                  if(returnObj.code == 0) {
                    callback(returnObj.code);
                    for(var i in $scope.alertInformLists) {
                      if($scope.alertInformLists[i].id == select.id) {
                        $scope.alertInformLists.splice(i, 1);
                      }
                    }
                    delete $scope.alertInformDic[select.ruleTempName];
                    $scope.selectedCount = 0;
                    growl.success("告警通知信息已删除", {});
                    return;
                  } else {
                    callback(returnObj.code);
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if(type == "enabled") {
          var alertInformsInfo = jQuery.extend(true, {}, select);
          alertInformsInfo.id = 0;
          alertInformsInfo.kpiThresholdId = rootInformId;
          resourceUIService.addNoticeRule(alertInformsInfo, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("告警通知信息启用成功", {});
              var newItem = returnObj.data;
              newItem.ruleTempName = select.ruleTempName;
              select.kpiThresholdIds.push(rootInformId);
              $scope.alertInformDic[select.ruleTempName] = [newItem]
            }
          })
        } else if(type == "disabled") {
          var choseItem = null;
          for(var i = $scope.alertInformDic[select.ruleTempName].length - 1; i > -1; i--) {
            if($scope.alertInformDic[select.ruleTempName][i].kpiThresholdId == rootInformId) {
              choseItem = $scope.alertInformDic[select.ruleTempName][i];
              $scope.alertInformDic[select.ruleTempName].splice(i, 1);
            }
          }
          if($scope.alertInformDic[select.ruleTempName].length > 0) {
            resourceUIService.deleteNoticeRule([
              [choseItem.id]
            ], function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("告警通知信息停用成功", {});
              }
            })
          } else {
            choseItem.kpiThresholdId = 0;
            resourceUIService.updateNoticeRule(choseItem, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("告警通知信息停用成功", {});
              }
            })
          }
        }
      };

      //角色转换
      $scope.changeRole = function(type) {
        if(type == 'outSystem') {
          $scope.alertInformsInfo.noticeRole = "";
        }
      }

      //验证
      $scope.alertFun = function(obj) {
        if(obj.state) { //如果跟踪为真，则用户点击为不选中
          obj.state = false;
          obj.contact = "";
        } else {
          obj.state = true;
        }
      };

      //验证信息
      $scope.verifyFun = function(value, type) {
        var reg, r;
        if(type == "sms") {
          if(!value) {
            $scope.mistakeMesg.phone = false;
            return;
          }
          var isMob = /^((1[34578]\d{9})|(0\d{2,4}\-\d{7,8})|\d{8})$/;
          r = isMob.test(value);
          if(!r) {
            $scope.mistakeMesg.phone = true;
          } else {
            $scope.mistakeMesg.phone = false;
          }
        } else if(type == "email") {
          if(!value) {
            $scope.mistakeMesg.email = false;
            return;
          }
          reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
          r = reg.test(value);
          if(!r) {
            $scope.mistakeMesg.email = true;
          } else {
            $scope.mistakeMesg.email = false;
          }
        }
      };

      //通过type过滤通知方式
      $scope.queryType = function(type) {
        $scope.alertInformsInfo.resourceType = "";
        $scope.notifications = [];
        for(var i in $scope.notificationList) {
          var code = $scope.notificationList[i].valueCode;
          if(code == "sysmessage" && type == "outSystem") {
            continue;
          }
          $scope.notifications.push($scope.notificationList[i]);
        };

        if($scope.alertInformsInfo.noticeWay) {
          $scope.queryMesg($scope.alertInformsInfo.noticeWay);
        }

      };

      //通过通知方式过滤消息模板
      $scope.queryMesg = function(id) {
        $scope.alertInformsInfo.resourceType = "";
        $scope.queryTemplLists = []; //内容通知模板
        //手机通知系统外
        templLists.forEach(function(item) {
          if(item.noticeWay == id && item.personType == $scope.alertInformsInfo.personType) {
            $scope.queryTemplLists.push(item);
          }
        });
        if($scope.alertInformsInfo.noticeWay == 'sms') {
          $scope.verifyFun($scope.alertInformsInfo.contact, 'phone');
        } else if($scope.alertInformsInfo.noticeWay == 'email')
          $scope.verifyFun($scope.alertInformsInfo.contact, 'email');
      };

      //查看所有内容模板
      var templLists = [];
      var queryAllTempl = function() {
        var defer = $q.defer();
        resourceUIService.findTemplateByCondition('alert', function(returnObj) {
          if(returnObj.code == 0) {
            templLists = returnObj.data;
            $scope.templLists = returnObj.data;
            $scope.templates.forEach(function(list) {
              templLists.forEach(function(item) {
                if(list.noticeWay == item.noticeWay && list.personType == item.personType) {
                  list.noticeTemplate = item.id;
                  list.noticeTemplateDesc = item.desc;
                }
              });
            })
          }
          defer.resolve("success");
        })
        deferList.push(defer.promise);
      };

      //查看企业下所有角色列表
      var queryAllRoles = function() {
        var defer = $q.defer();
        userEnterpriseService.queryEnterpriseRole(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              //角色列表可能有null，过滤掉
             if(item){
                 item.id = item.roleID;
                 item.text = item.roleName;
             }
            })
            $scope.allRoles = returnObj.data ? returnObj.data : [];
          }
          defer.resolve("success");
        })
        deferList.push(defer.promise);
      };

      // 清空其他选择项
      $scope.getChange = function() {
        if($scope.queryState == 1) {
          $scope.selectedItem.modelId = "";
          $scope.selectedItem.name = "";
        } else if($scope.queryState == 2) {
          $scope.selectedItem.label = "";
          $scope.selectedItem.name = "";
        } else if($scope.queryState == 3) {
          $scope.selectedItem.label = "";
          $scope.selectedItem.modelId = "";
        }
      };

      $scope.searchData = function() {
        var param = {
          //        'kpiThresholdId': rootInformId,
          'ruleName': "" ? "" : $scope.selectedItem.ruleName, //告警通知名称
          'personType': $scope.selectedItem.personType ? $scope.selectedItem.personType : "", //通知人员类型
          'noticeWay': "" ? "" : $scope.selectedItem.noticeWay ? $scope.selectedItem.noticeWay : "" //通知方式
        };
        resourceUIService.findNoticeRules(param, function(returnObj) {
          if(returnObj.code == 0) {
            //          $scope.alertInformLists = returnObj.data;
            $scope.alertInformDic = {};
            var alertInformLists = [];
            returnObj.data.forEach(function(item) {
              if(!item.kpiThresholdIds || (item.kpiThresholdId && item.kpiThresholdIds.length == 0)) { //老通知规则
                var ruleTempName = getRuleTempName(item);
                if(!$scope.alertInformDic[ruleTempName]) $scope.alertInformDic[ruleTempName] = [];
                $scope.alertInformDic[ruleTempName].push(item);
              } else { //新版本的ifttt没有做完，暂时使用老版本
                var ruleTempName = getRuleTempName(item);
                if(!$scope.alertInformDic[ruleTempName]) $scope.alertInformDic[ruleTempName] = [];
                $scope.alertInformDic[ruleTempName].push(item);
              }
            })
            for(var key in $scope.alertInformDic) {
              var newItem = null;
              $scope.alertInformDic[key].forEach(function(item) {
                if(!newItem) {
                  newItem = jQuery.extend(true, {}, item);
                  newItem.ruleTempName = key;
                  newItem.kpiThresholdIds = []
                }
                if(item.kpiThresholdId == rootInformId)
                  newItem.selected = true;
                newItem.kpiThresholdIds.push(item.kpiThresholdId);
              })
              alertInformLists.push(newItem);
            }
            $scope.alertInformLists = alertInformLists;
            $timeout(function() {
              $scope.$broadcast(Event.ALERTRULESINIT + "_informs", {
                "option": [$scope.alertInformLists]
              });
            })
          }
        })
      };
      var getRuleTempName = function(item) {
        //处理通知模板
        var templates = "";
        if(item.templates) {
          item.templates.forEach(function(template) {
            templates += template.noticeWay + template.contact + "|";
          })
        }

        //如果通知规则一样则认为是同一个规则
        var ruleTempName = "noticeRole:" + item.noticeRole + "&personType:" + item.personType + "&templates:" + templates;
        return ruleTempName;
      }
      var init = function() {
        var inithandler = function() {
          initData();
          initHistory();
          queryAllRoles();
          queryAllTempl();
          $q.all(deferList).then(function() {
            $scope.searchData();
          });
        }
        if(!$scope.myDicts) {
          $scope.$watch("myDicts", function(n, o) {
            if(n) {
              inithandler();
            }
          });
        } else {
          inithandler();
        }
      };

      /**
       * 监听登录状态
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