define(['controllers/controllers'], function(controllers) {
  'use strict';
  //根据接口调用自定义视图获取
  //用户登录userLoginUIService
  controllers.controller('flowConfigureCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'growl', 'userEnterpriseService', 'userLoginUIService', 'resourceUIService', 'viewFlexService','userDomainService','solutionUIService','unitService', '$location',
    function($scope, $rootScope, $location, $timeout, growl, userEnterpriseService, userLoginUIService, resourceUIService, viewFlexService,userDomainService,solutionUIService,unitService,loc) {

      $scope.errorMsg = "";
      $scope.slide = "1";
//    $scope.powers = {};
      $scope.treeAry = [];
      $scope.configureView = []; //组态视图集合
      $scope.echartView = []; //组态视图集合
      $scope.myOptions;

      $scope.handleUser = "";
      $scope.userList = "";
      $scope.defaultRoute = "../app-oc/index.html#/processdesign";
      $scope.treeviewIndex = "";
      $scope.oldTreeviewIndex = "";
      
      $scope.currentMenuCode = null; //当前的菜单编码
      $scope.firstMenuCode = null; //第一层的菜单编码
      
      $scope.localMenuCode = "F01"; //判断使用哪一个服务中心，用来替代localIndex
      $scope.showMenu = false;
      $scope.menuitems = {};
      // 路由跳转成功后触发
      $scope.$on('$routeChangeSuccess', function() {
        userLoginUIService.rootHandler($scope, $location);
      });
//    var setPower = function(pow, len) {
//      pow = pow.substring(0, len);
//      $scope.powers[pow] = true;
//      if(len > 5) {
//        setPower(pow, len - 2);
//      }
//    }
//    var initPower = function() {
//      for(var i in userLoginUIService.user.functionCodeSet) {
//        var funCode = userLoginUIService.user.functionCodeSet[i];
//        $scope.powers[funCode] = true;
//        if(funCode.length > 5) {
//          setPower(funCode, funCode.length - 2);
//        }
//      }
//    }
      $scope.menusFilter = function (item) {
        return item.functionCode.charAt(0) === "S";
      };
      $scope.homeClick = function() {
        window.open("http://www.proudsmart.com");
      }
      $scope.backClick = function() {
        if (location.hash.search("#/displayView") > -1 || location.hash.search("#/flow") > -1) {
          location.href = "../app-oc/index.html#/processdesign";
        }else if(location.hash.search("#/processView") > -1 ){
          location.href = "../app-oc/index.html#/workorderrecord";
        }
      }
      $rootScope.indexShow = false;
      $rootScope.personalShow = true;

      $scope.routePathNodes = {};
      var getResources = function(model, callback) {
        if (model.type == "Device") {
          resourceUIService.getManagedDevicesByModelId(model.id, function(returnObj) {
            if(returnObj.code == 0) {
              var resources = returnObj.data;
              model.resources = resources;
              model.resources.push({
                id: 0,
                label: "无"
              });
              if(callback) {
                callback();
              }
            };
          });
        } else {
          resourceUIService.getResourceByModelId(model.id, function(returnObj) {
            if(returnObj.code == 0) {
              var resources = returnObj.data;
              model.resources = resources;
              model.resources.push({
                id: 0,
                label: "无"
              });
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
      var getResourceKpis = function(model) {
        resourceUIService.getKpisByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.kpis = returnObj.data;
            model.kpis.push({
              id: 0,
              label: "无"
            });
          };
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
        getResourceAttrs(obj);
        getResourceKpis(obj);
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
            $scope.treeAry = tree;
          }
        }

        solutionUIService.getGroupModels(function(returnGroup) {
          if(returnGroup.code == 0 ) {
            resourceUIService.getModels(function(returnObj) {
              returnObj.data = returnObj.data.concat(returnGroup.data)
              handler(returnObj);
            });
          }
        });
      };

      function initViews() {
        $scope.configureView = [{
          viewId: 0,
          viewTitle: '无'
        }];
        $scope.echartView = [{
          viewId: 0,
          viewTitle: '无'
        }];
        viewFlexService.getAllMyViews(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              if(item.viewType == "configure") {
                $scope.configureView.push(item);
              }
              if(item.viewType == "designView") {
                $scope.echartView.push(item);
              }
            })
            $scope.$broadcast('RAPPIDVIEWS', {
              "data": $scope.configureView
            });
          }
        });
      }

      $scope.logout = function() {
        userLoginUIService.logout();
      };
      $scope.domains = [];
      var getbreak = function(lv) {
        var breaks = "";
        for (var i = 0 ;i<lv;i++) {
          breaks+="*";
        }
        return breaks;
      }
      var foreachdomains = function(domains,lv,domainsAry) {
        domains.forEach(function(domain) {
          domain.text = getbreak(lv)+domain.text;
          domainsAry.push(domain);
          if (domain.nodes) {
            foreachdomains(domain.nodes,lv+2,domainsAry);
          }
        })
      }
      var domainTreeQuery = function() {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          var domainsAry = [{domainPath:"",text:"无"}];
          foreachdomains($scope.domainListTree,0,domainsAry);
          $scope.domains = domainsAry;
        });
      };
      function initUnit() {
        unitService.getAllUnits(function(returnObj) {
          if (returnObj.code == 0) {
            unitService.units = returnObj.data;
            $scope.myOptions = returnObj.data;
            unitService.unitDics = {};
            for (var i in $scope.myOptions) {
              unitService.unitDics[$scope.myOptions[i].unitCode] = $scope.myOptions[i].unitName;
              if ($scope.myOptions[i].unitCode == "NA" ||$scope.myOptions[i].unitCode == "Number" )
                unitService.unitDics[$scope.myOptions[i].unitCode] = "";
            }
            $scope.myOptionDic = unitService.unitDics;
          }
        });
      }
      var initstate = false;
      var init = function() {
        if(initstate) return;
        initstate = true;
        domainTreeQuery();
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.name = returnObj.data.label;
            returnObj.data.text = returnObj.data.label;
            resourceUIService.rootModel = returnObj.data;
            $scope.selectedParentitem = returnObj.data;
            urmpTree();
          }
        });
      }
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {

            $rootScope.staffName = userLoginUIService.user.userName;
            $scope.userInfo = userLoginUIService.user;
            initUnit();
            init();
//          initPower();
            initViews();
            userLoginUIService.initMenus($scope, $location);
          } else {
            $scope.errorMsg = userLoginUIService.result.message;
            $scope.errorStatus = 1;
          }
        });
      } else {
        initUnit();
        init();
//      initPower();
        initViews();
        userLoginUIService.initMenus($scope, $location);
      }
    }
  ]);
});