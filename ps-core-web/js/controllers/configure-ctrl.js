define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //根据接口调用自定义视图获取
  controllers.controller('ConfigureCtrl', ['$scope', '$q',  '$location', 'userLoginUIService', 'viewFlexService', 'unitService', 'configUIService', 'projectUIService', 'customerUIService',
    'resourceUIService', '$rootScope', 'growl',  '$controller', 'SwSocket', 'kpiDataService', 'userDomainService', 'solutionUIService',
    function($scope, $q, $location, userLoginUIService, viewFlexService, unitService, configUIService, projectUIService, customerUIService,
      resourceUIService,  $rootScope, growl, $controller, SwSocket, kpiDataService, userDomainService, solutionUIService) {
      if(location.hash == "" || location.hash.search("#/index") > -1) {
        location.href = "../app-oc/index.html#/configureview";
        return;
      }
      $scope.errorMsg = "";

      $scope.slide = "1";
      $scope.treeAry = [];
      $scope.configureView = []; //组态视图集合
      $scope.echartView = []; //组态视图集合
      $scope.configViewBg = []; //组态自定义背景集合
      $scope.configCustoms = []; //组态自定义组件集合
      $scope.configCommons = []; //组态自定义组件集合
      $scope.myOptions;
      $scope.treeviewIndex = "";
      $scope.oldTreeviewIndex = "";
      $scope.defaultRoute = "../app-oc/index.html#/configureview";
      $scope.currentMenuCode = null; //当前的菜单编码
      $scope.firstMenuCode = null; //第一层的菜单编码
      $scope.localMenuCode = "F01"; //判断使用哪一个服务中心，用来替代localIndex
      $scope.showMenu = false;
      $rootScope.menuitems = $scope.menuitems = {};
      $rootScope.rootModelsDic = {}; // 全局的设备模板字典
      // 路由跳转成功后触发
      $scope.$on('$routeChangeSuccess', function() {
        userLoginUIService.rootHandler($scope, $location);
      });

      $scope.alertLevels = [{
        label: '正常',
        id: 0
      }, {
        label: '警告',
        id: 1
      }, {
        label: '次要',
        id: 2
      }, {
        label: '重要',
        id: 3
      }, {
        label: '严重',
        id: 4
      }];

      $scope.stateDisplayModel = [{
        label: '不显示',
        id: 0,
        type: 'basic.Text,basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon,basic.Image'
      }, {
        label: '仅背景',
        id: 1,
        type: 'basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon'
      }, {
        label: '仅文字',
        id: 2,
        type: 'basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon,basic.Image'
      }, {
        label: '全显示',
        id: 3,
        type: 'basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon'
      }];
      $scope.cursorModel = [{
        label: '默认',
        id: 'default'
      }, {
        label: '手形',
        id: 'pointer'
      }];

      $scope.animateTypeModel = [{
        label: '无',
        id: 0
      }, {
        label: '按X轴正方向运动',
        id: 1
      }, {
        label: '按X轴负方向运动',
        id: 2
      }, {
        label: '按Y轴正方向运动',
        id: 3
      }, {
        label: '按Y轴负方向运动',
        id: 4
      }, {
        label: '按路径运动',
        id: 5
      }]
      $scope.stateTypeModel = [{
        label: '默认',
        id: 0,
        type: 'basic.Text,basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon,basic.Image'
      }, {
        label: '呼吸灯',
        id: 1,
        type: 'basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon,basic.Image'
      }, {
        label: '气泡',
        id: 2,
        type: 'basic.Circle'
      }, {
        label: '呼吸灯(忽略透明)',
        id: 3,
        type: 'basic.Rect,basic.Circle,basic.Rhombus,basic.Path,basic.Polygon,basic.Image'
      }, {
        label: '气泡(忽略透明)',
        id: 4,
        type: 'basic.Circle'
      }];

      $scope.selectTypes = [{
        label: '按域选择',
        id: 0
      }, {
        label: '按设备类型选择',
        id: 1
      }];
      $scope.unitTypes = [{
        label: '不显示',
        id: 0
      }, {
        label: '显示',
        id: 1
      }];

      $scope.homeClick = function(flg) {
        if(flg == 1) {
          // window.open("http://www.proudsmart.com");
          location.href = "../app-oc/index.html#/dashboard";
        } else {
          if($rootScope.dirty == true) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '视图尚未保存，要在退出前保存吗？',
              buttons: [{
                label: '保存退出',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  $rootScope.save4Json(function(status) {
                    dialogRef.close();
                    location.href = "../app-oc/index.html#/views/configure";
                  });
                }
              }, {
                label: '退出',
                action: function(dialogRef) {
                  location.href = "../app-oc/index.html#/views/configure";
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  dialogRef.close();
                }
              }]
            });
          } else {
            location.href = "../app-oc/index.html#/views/configure";
          };
        }
      }
      $rootScope.indexShow = false;
      $rootScope.personalShow = true;
      $scope.routePathNodes = {};
      var getResources = function(model, callback) {
        if(model.type == "Device") {
          resourceUIService.getManagedDevicesByModelId(model.id, function(returnObj) {
            if(returnObj.code == 0) {
              model.resources = [{
                id: 0,
                label: "无"
              }].concat(returnObj.data);
              if(callback) {
                callback();
              }
            };
          });
        } else {
          resourceUIService.getResourceByModelId(model.id, function(returnObj) {
            if(returnObj.code == 0) {
              model.resources = [{
                id: 0,
                label: "无"
              }].concat(returnObj.data);

              if(callback) {
                callback();
              }
            };
          });
        }
      }
      var getResourceAttrs = function(model, callback) {
        resourceUIService.getAttrsByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.attrs = returnObj.data;
            model.isLoaded = model.isLoaded + 1;
            if(callback) {
              callback();
            }
          };
        });
      }

      //加了一个项目绑定功能 tangyaqin 
      var getResourceKpis = function(model) {
        resourceUIService.getDataItemsByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.kpis = [{
              id: 0,
              label: "无"
            }].concat(returnObj.data);
          }
        });
      }

      /**
       * 获得模型下的指令
       * @param {Object} model
       */
      var getResourceDirectives = function(model) {
        resourceUIService.getDirectivesByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model["directives"] = returnObj.data;
          };
        });
      };

      var getCustomers = function(model) {
        customerUIService.findCustomersByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            var tmpObj = {};
            returnObj.data.forEach(function(p) {
              p.label = p.customerName;
              tmpObj[p.id] = p;
            })
            model.customersDic = tmpObj;
            model.customers = [{
              id: 0,
              label: "无"
            }].concat(returnObj.data);
          }
        });
      }

      var getProjects = function(model) {
        projectUIService.findProjectsByCondition({}, function(projectObj) {
          if(projectObj.code == 0) {
            var proObj = {};
            projectObj.data.forEach(function(p) {
              p.label = p.projectName;
              proObj[p.id] = p;
            })
            model.projectDic = proObj;
            model.project = [{
              id: 0,
              label: "无"
            }].concat(projectObj.data);
          }
        });
      }
      var initModelAtts = function(obj, idx) {
        obj.count = 0;
        var random = Math.random();
        obj.icon = obj.icon ? obj.icon : 'fa fa-building-o';
        obj.alertlv = "bg-green"; //random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
        obj.isLoaded = 0;
        obj.type = 0;
        obj.text = obj.label;
        obj.name = obj.label;
        getResources(obj);
        if(obj.id == 301) {
          getCustomers(obj);
        }
        if(obj.id == 302) {
          getProjects(obj);
        }
        //      getResourceAttrs(obj);
        //      getResourceKpis(obj);
        //      getResourceDirectives(obj);
        return obj;
      }
      var urmpTree = function(ciName) {
        var handler = function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModelDic = {};
            var tree = returnObj.data;
            for(var i in tree) {
              var obj = tree[i];
              if(!$scope.routePathNodes[obj.parentModelId])
                $scope.routePathNodes[obj.parentModelId] = [];
              $scope.routePathNodes[obj.parentModelId].push(obj);
              if(!$scope.routePathNodes[obj.id])
                $scope.routePathNodes[obj.id] = [];
              resourceUIService.rootModelDic[obj.id] = obj;
              initModelAtts(obj);
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
            $scope.rootModelDic = resourceUIService.rootModelDic;
            $scope.rootModel = resourceUIService.rootModel;
            $scope.treeAry = [{
              id: 0,
              label: "请选择"
            }].concat(tree);

            $scope.typeAry = [{
              id: 0,
              label: "普通"
            }, {
              id: 1,
              label: "模板"
            }]

            if($scope.menuitems['S13']) {
              $scope.typeAry.push({
                id: 2,
                label: ($scope.menuitems['S13'] && $scope.menuitems['S13'].label ? $scope.menuitems['S13'].label : '项目')
              })
            }
            if($scope.menuitems['S12']) {
              $scope.typeAry.push({
                id: 3,
                label: ($scope.menuitems['S12'] && $scope.menuitems['S12'].label ? $scope.menuitems['S12'].label : '客户')
              })
            }
          }
        };
        solutionUIService.getGroupModels(function(returnGroup) {
          if(returnGroup.code == 0) {
            for(var k in $rootScope.rootModelsDic) {
              if($rootScope.rootModelsDic[k].model) {
                for(var kpi in $rootScope.rootModelsDic[k].kpiDic) {
                  if(!$rootScope.rootModelsDic[k].model.kpis) $rootScope.rootModelsDic[k].model.kpis = [];
                  $rootScope.rootModelsDic[k].model.kpis.push($rootScope.rootModelsDic[k].kpiDic[kpi])
                }
                $rootScope.rootModelsDic[k].model.directives = $rootScope.rootModelsDic[k].directives
                returnGroup.data.push($rootScope.rootModelsDic[k].model)
              }
            }
            returnGroup.data.sort(function(a, b) {
              return Number(b.id) - Number(a.id);
            })
            handler(returnGroup);
          }
        });
      };

      function initViews() {
        $scope.configureView = [{
          viewId: 0,
          viewTitle: '不可下钻'
        }, {
          viewId: 1,
          viewTitle: '可下钻，无子视图'
        }];
        $scope.echartView = [{
          viewId: 0,
          viewTitle: '无'
        }];
        $scope.dashboardView = [];
        $rootScope.selectDashboard = null;
        viewFlexService.getAllMyViews(function(returnObj) {
          if(returnObj.code == 0) {
            var dashboardView = [];
            returnObj.data.forEach(function(item) {
              if(item.viewType == "configure" || item.viewType == "dashboard") {
                $scope.configureView.push(item);
              }
              if(item.viewType == "designView") {
                $scope.echartView.push(item);
              }
              //只有是仪表板，且没有template，且已发布的才可以
              if(item.viewType == "dashboard" && !item.template && item.releaseStatus == "1") {
                item.icon = "proudsmart ps-yunyingshouye";
                item.show = true;
                dashboardView.push(item);
              }
            })
            if($scope.menuitems["A03_S21"])
              dashboardView.push({
                viewTitle: "添加自定义工作台",
                viewId: 0,
                icon: "fa fa-plus-square"
              });
            $scope.dashboardView = dashboardView;
            $scope.$broadcast('RAPPIDVIEWS', {
              "data": $scope.configureView
            });
          }
        });
      }

      $scope.sidebarMenuClick = function(item, flg) {
        if($rootScope.selectDashboard && $rootScope.selectDashboard.viewId == item.viewId && item.viewId != 0) return;
        if(item.viewId == 0) {
          window.open("../app-freeboard/index.html#/freeboard/view/dashboard", "_blank");
        } else {
          if(flg) {
            window.open("../app-freeboard/index.html#/freeboard/view/dashboard/" + item.viewId + "/0", "_blank");
          } else {
            $scope.$broadcast('CHANGEDASHBOARDVIEWS', {
              "data": item
            });
          }
        }
      }

      $scope.logout = function() {
        userLoginUIService.logout();
      };

      $scope.domains = [];
      var getbreak = function(lv) {
        var breaks = "";
        for(var i = 0; i < lv; i++) {
          breaks += "*";
        }
        return breaks;
      }
      var foreachdomains = function(domains, lv, domainsAry) {
        domains.forEach(function(domain) {
          domain.text = getbreak(lv) + domain.text;
          domainsAry.push(domain);
          if(domain.nodes) {
            foreachdomains(domain.nodes, lv + 2, domainsAry);
          }
        })
      }

      var domainTreeQuery = function() {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          var domainsAry = [{
            domainPath: "",
            text: "无"
          }];
          foreachdomains($scope.domainListTree, 0, domainsAry);
          $scope.domains = domainsAry;
        });
      };

      function initUnit(callbackFun, defereds) {
        var defered = $q.defer();
        defereds.push(defered.promise);
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
            defered.resolve('success');
            if(callbackFun)
              callbackFun();
          }
        });
      }

      var initRootModel = function() {
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.name = returnObj.data.label;
            returnObj.data.text = returnObj.data.label;
            resourceUIService.rootModel = returnObj.data;
            $scope.selectedParentitem = returnObj.data;
          }
        });
      }
      var initConfigManager = function(callbackFun, defereds) {
        var defered = $q.defer();
        defereds.push(defered.promise);
        configUIService.getConfigsByGroupName("EnterpriseConfig", function(returnObj) {
          if(returnObj.code == 0) {
            if(returnObj.data && returnObj.data.length > 0) {
              returnObj.data.forEach(function(item) {
                try {
                  if($scope.baseConfig) {
                    $scope.baseConfig = jQuery.extend(true, $scope.baseConfig, JSON.parse(item.value));
                  } else {
                    $scope.baseConfig = JSON.parse(item.value);
                  }
                  if($scope.baseConfig) { //拥有企业设置
                    if($scope.baseConfig.title)
                      $("title").html($scope.baseConfig.title);
                    else
                      $("title").html("");
                    if($scope.baseConfig.shortcut)
                      $("link[rel='shortcut icon']").attr("href", $scope.baseConfig.shortcut + "?" + new Date().getTime());
                    else
                      $("link[rel='shortcut icon']").attr("href", "../login/images/shortcut_null.png" + "?" + new Date().getTime());
                  }
                } catch(e) {}
              });
            } else {
              $("title").html("");
              $("link[rel='shortcut icon']").attr("href", "../login/images/shortcut_null.png" + "?" + new Date().getTime());
            }
            callbackFun();
          }
          defered.resolve('success');
        });
        var defered1 = $q.defer();
        defereds.push(defered1.promise);
        configUIService.getConfigsByGroupName("ConfigurationViewBG", function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.configViewBg.push({
                label: item.label,
                url: item.value
              })
            });
          }
          defered1.resolve('success');
        });
        var defered2 = $q.defer();
        defereds.push(defered2.promise);
        configUIService.getConfigsByGroupName("ConfigurationCustom", function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              try {
                var coustom = JSON.parse(item.value);
                coustom.attrs.text.text = item.label;
                $scope.configCustoms.push(coustom)
              } catch(e) {}
            });
            defered2.resolve('success');
          }
        });
        var defered3 = $q.defer();
        defereds.push(defered3.promise);
        configUIService.getConfigsByGroupName("ConfigurationCommon", function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              var keyDesc;
              item.keyDesc = item.keyDesc || "";
              var s = item.keyDesc.search("{");
              var e = item.keyDesc.search("}");
              if(s == 0 && e == item.keyDesc.length - 1) {
                keyDesc = JSON.parse(item.keyDesc);
                keyDesc.width = keyDesc.width ? keyDesc.width : 128;
                keyDesc.height = keyDesc.height ? keyDesc.height : 128;
              }
              var base = {
                "type": "basic.Image",
                "size": {
                  "width": 60,
                  "height": 60
                },
                "attrs": {
                  "image": {
                    "width": keyDesc ? keyDesc.width : 128,
                    "height": keyDesc ? keyDesc.height : 128,
                    "xlink:href": item.value
                  },
                  "text": {
                    "text": item.label,
                    "font-size": 12,
                    "stroke": "#000000",
                    "display": "block",
                    "stroke-width": 0,
                    "fill": "#000000",
                    "ref-dy": 10,
                    "font-family": "Microsoft YaHei"
                  }
                }
              }
              $scope.configCommons.push(base);
            });
            defered3.resolve('success');
          }
        });
      }

      /**
       * 获得基本的模型定义，包括：
       * 测点定义
       * 指令定义
       * 属性定义
       */
      function initRootModels() {
        var subdefer1 = $q.defer();
        var subdefer2 = $q.defer();
        var subDefereds = [subdefer1.promise, subdefer2.promise];
        $q.all(subDefereds).then(function() {
          urmpTree();
        })

        resourceUIService.rootModelsDic = $rootScope.rootModelsDic;
        resourceUIService.getModelsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.push({
              id: 0
            });
            returnObj.data.push({
              id: 300,
              label: "管理域类型"
            });
            if($scope.baseConfig && $scope.baseConfig.customerConfig && $scope.baseConfig.customerConfig.display) {
              returnObj.data.push({
                id: 301,
                label: ($scope.menuitems['S12'] && $scope.menuitems['S12'].label ? $scope.menuitems['S12'].label : '客户') + "域类型"
              });
            };
            if($scope.baseConfig && $scope.baseConfig.projectConfig && $scope.baseConfig.projectConfig.display) {
              returnObj.data.push({
                id: 302,
                label: ($scope.menuitems['S13'] && $scope.menuitems['S13'].label ? $scope.menuitems['S13'].label : '项目') + "域类型"
              });
            };
            returnObj.data.forEach(function(model) {
              if(!$rootScope.rootModelsDic[model.id]) $rootScope.rootModelsDic[model.id] = {};
              $rootScope.rootModelsDic[model.id].model = model;
            })

            //-1表示查询所有的模版上的KPI
            var include = [
              "domainPath",
              "granularity",
              "granularityUnit",
              "icon",
              "id",
              "label",
              "modelId",
              "modelIdList",
              "name",
              "range",
              "unit",
              "uid",
              "type"
            ];
            var includeFields = "includeFields=" + include.toString();
            resourceUIService.getDataItemsByModelId(-1, function(subReturnObj) {
              if(subReturnObj.code == 0) {
                subReturnObj.data.forEach(function(kpiDef) {
                  if(!$rootScope.rootModelsDic[kpiDef.modelId]) return;
                  if(!$rootScope.rootModelsDic[kpiDef.modelId].kpiDic) $rootScope.rootModelsDic[kpiDef.modelId].kpiDic = {};
                  if(!$rootScope.rootModelsDic[kpiDef.modelId].kpiNameDic) $rootScope.rootModelsDic[kpiDef.modelId].kpiNameDic = {};
                  if(!$rootScope.rootModelsDic[kpiDef.modelId].kpiLabelDic) $rootScope.rootModelsDic[kpiDef.modelId].kpiLabelDic = {};
                  if($scope.myOptionDic[kpiDef.unit])
                    kpiDef.unitLabel = $scope.myOptionDic[kpiDef.unit];
                  var regExp = /\{|\[.*\}|\]/;
                  if(kpiDef.range) {
                    var find = regExp.test(kpiDef.range);
                    var rangeObj = [];
                    if(find) {
                      try {
                        rangeObj = find ? JSON.parse(kpiDef.range) : [];
                      } catch(e) {}
                    }
                    kpiDef.rangeAry = rangeObj;
                    if(rangeObj instanceof Array) {
                      kpiDef.rangeAry = rangeObj;
                      if(rangeObj.length == 2) {
                        kpiDef.min = rangeObj[0];
                        kpiDef.max = rangeObj[1];
                      }
                    } else if(rangeObj instanceof Object) {
                      kpiDef.rangeObj = rangeObj;
                    }
                  }
                  $rootScope.rootModelsDic[kpiDef.modelId].kpiDic[kpiDef.id] = kpiDef;
                  $rootScope.rootModelsDic[kpiDef.modelId].kpiNameDic[kpiDef.name] = kpiDef;
                  $rootScope.rootModelsDic[kpiDef.modelId].kpiLabelDic[kpiDef.label] = kpiDef;
                })

                if($rootScope.rootModelsDic[0] && $rootScope.rootModelsDic[0].kpiDic) {
                  for(var k in $rootScope.rootModelsDic[0].kpiDic) {
                    var kpi = $rootScope.rootModelsDic[0].kpiDic[k];
                    if(kpi.modelIdList.indexOf(300) > -1) {
                      if(!$rootScope.rootModelsDic[300].kpiDic) $rootScope.rootModelsDic[300].kpiDic = {}
                      $rootScope.rootModelsDic[300].kpiDic[kpi.id] = kpi;
                    }
                    if(kpi.modelIdList.indexOf(301) > -1) {
                      if($rootScope.rootModelsDic[301]) {
                        if(!$rootScope.rootModelsDic[301].kpiDic) $rootScope.rootModelsDic[301].kpiDic = {}
                        $rootScope.rootModelsDic[301].kpiDic[kpi.id] = kpi;
                      }
                    }
                    if(kpi.modelIdList.indexOf(302) > -1) {
                      if($rootScope.rootModelsDic[302]) {
                        if(!$rootScope.rootModelsDic[302].kpiDic) $rootScope.rootModelsDic[302].kpiDic = {}
                        $rootScope.rootModelsDic[302].kpiDic[kpi.id] = kpi;
                      }
                    }
                  }
                }
                delete $rootScope.rootModelsDic[0];

                //添加在线状态
                for(var k in $rootScope.rootModelsDic) {
                  if($rootScope.rootModelsDic[k].kpiDic) {
                    $rootScope.rootModelsDic[k].kpiDic[999998] = {
                      id: 999998,
                      label: '在线状态',
                      uid: 999998
                    }
                  }
                }

                $rootScope.rootModelsDic["kpiDefloaded"] = true;
                //通知监听的地方，模板上的定义已经加载完成
                $scope.$broadcast('kpiDefLoadFinished');
              }
              subdefer1.resolve("success");
            }, includeFields)

            //-1表示获得所有模板的指令
            resourceUIService.getDirectivesByModelId(-1, function(subReturnObj) {
              if(subReturnObj.code == 0) {
                subReturnObj.data.forEach(function(dirDef) {
                  if(!$rootScope.rootModelsDic[dirDef.modelId]) return;
                  if(!$rootScope.rootModelsDic[dirDef.modelId].directives) $rootScope.rootModelsDic[dirDef.modelId].directives = [];
                  $rootScope.rootModelsDic[dirDef.modelId].directives.push(dirDef);
                })
              }
              subdefer2.resolve("success");
            });
          }
        })
      }

      var initUserObjects = function() {
        var defereds = [];

        initConfigManager(function() {
          userLoginUIService.initMenus($scope, $location);
        }, defereds);
        initUnit(function() {}, defereds);
        var deferred = $q.defer();
        defereds.push(deferred.promise)
        $scope.$watch("menuitems.isloaded", function(n, o) {
          //菜单加载完毕
          if(n) {
            deferred.resolve("success")
          }
        })
        $q.all(defereds).then(function(result) {
          initRootModels()
          initViews()
        })
        initRootModel();
        domainTreeQuery();
      }

      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            $scope.userInfo = userLoginUIService.user;
            $scope.lastLoginTime = newDateJson(userLoginUIService.user.lastLoginTime).Format(GetDateCategoryStrByLabel());
            if(userLoginUIService.user.enterprise)
              $scope.enterpriseType = userLoginUIService.user.enterprise.enterpriseType;
            $rootScope.staffName = userLoginUIService.user.userName;
            initUserObjects();
          } else {
            $scope.errorMsg = userLoginUIService.result.message;
            $scope.errorStatus = 1;
          }
        });
      } else {
        initUserObjects();
      }
    }
  ]);
});