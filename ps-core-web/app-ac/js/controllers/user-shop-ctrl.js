define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.controller('userShopCtrl', ['$scope', '$location', 'Info', 'userLoginUIService', 'unitService',
    'dictionaryService', 'resourceUIService', 'modelDefinitionService', 'growl','configUIService',
    function($scope, $location, Info, userLoginUIService, unitService, dictionaryService, resourceUIService, 
      modelDefinitionService,growl,configUIService) {
      $scope.treeviewIndex = "";
      $scope.oldTreeviewIndex = "";
      
      $scope.currentMenuCode = null; //当前的菜单编码
      $scope.firstMenuCode = null; //第一层的菜单编码
      
      $scope.localMenuCode = "F01"; //判断使用哪一个服务中心，用来替代localIndex
      $scope.showMenu = false;
      $scope.menuitems = {};
      // 路由跳转成功后触发
      $scope.$on('$routeChangeSuccess', function() {
        userLoginUIService.rootHandler($scope,$location);
      });
      
      $scope.shopLoginStatus = "";
      var info = Info.get("localdb/info.json", function(info) {
        $scope.menu = info.menu;
        $scope.feature = info.uniqueList;

      });
      $scope.myOptionDic = {};

      function initUnit() {
        unitService.getAllUnits(function(returnObj) {
          if(returnObj.code == 0) {
            unitService.units = returnObj.data;
            $scope.myOptions = returnObj.data;
            for(var i in $scope.myOptions) {
              $scope.myOptionDic[$scope.myOptions[i].unitCode] = $scope.myOptions[i].unitName;
              if($scope.myOptions[i].unitCode == "NA" || $scope.myOptions[i].unitCode == "Number")
                $scope.myOptionDic[$scope.myOptions[i].unitCode] = "";
            }
            unitService.unitDics = $scope.myOptionDic;
          }
        });
        dictionaryService.getAllDicts(function(returnObj) {
          if(returnObj.code == 0) {
            dictionaryService.dicts = returnObj.data;
            $scope.myDicts = returnObj.data;
            var dic = {};
            for(var i in returnObj.data) {
              var obj = returnObj.data[i];
              if(dic[obj.dictCode]) {
                dic[obj.dictCode].push(obj);
              } else {
                dic[obj.dictCode] = [];
                dic[obj.dictCode].push(obj);
              }
            }
            for(var items in dic) {
              $scope.myDicts[items] = dic[items];
            }
          }
        });
        if(!resourceUIService.hasOwnProperty("provinces")) {
          resourceUIService.getSimpleDistricts(function(returnObj) {
            if(returnObj.code == 0) {
              resourceUIService.provinces = returnObj.data;
              $scope.provinces = returnObj.data;
            }
          });
        }
      }

      $scope.menusFilter = function(item) {
        return item.functionCode.charAt(0) === "S";
      };
      
      $scope.gotoHomePage = function() {
        if(userLoginUIService.user.enterprise.logoStatus != '0') {
          location.href = "http://www.proudsmart.com";
        }
      };
      
      $scope.logout = function() {
        userLoginUIService.logout();
        //location.href ="login.html";
      };
      
      var initConfigManager = function(callbackFun) {
        configUIService.getConfigsByGroupName("EnterpriseConfig",function(returnObj){
          if (returnObj.code == 0) {
            if (returnObj.data && returnObj.data.length > 0) {
              returnObj.data.forEach(function(item) {
                try {
                  if ($scope.baseConfig) {
                    $scope.baseConfig = jQuery.extend(true, $scope.baseConfig, JSON.parse(item.value));
                  } else {
                    $scope.baseConfig = JSON.parse(item.value);
                  }
                  if ($scope.baseConfig) { //拥有企业设置
                    if ($scope.baseConfig.title) 
                      $("title").html($scope.baseConfig.title);
                    else
                      $("title").html("");
                    if ($scope.baseConfig.shortcut) 
                      $("link[rel='shortcut icon']").attr("href","../"+$scope.baseConfig.shortcut+"?"+new Date().getTime());
                    else 
                      $("link[rel='shortcut icon']").attr("href", "../../login/images/shortcut_null.png"+"?"+new Date().getTime());
                  }
                } catch (e) {
                }
              });
            } else {
              $("title").html("");
              $("link[rel='shortcut icon']").attr("href", "../../login/images/shortcut_null.png"+"?"+new Date().getTime());
            }
            callbackFun();
          }
        });
      };
      
      var findAllIndustry = function() {
        modelDefinitionService.findAllIndustry(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.industries = returnObj.data;
          }
        });
      }
      
      $scope.$on('loginStatusChanged', function(evt, d) {
        if(userLoginUIService.user.isAuthenticated) {
          $scope.shopLoginStatus = "login";
          $scope.userInfo = userLoginUIService.user;
          $scope.lastLoginTime = newDateJson(userLoginUIService.user.lastLoginTime).Format(GetDateCategoryStrByLabel());
          initConfigManager(function(){
            userLoginUIService.initMenus($scope, $location);
          })
          initUnit();
          findAllIndustry();
        } else {
          $scope.shopLoginStatus = "loginOut"
        }
      });
    }
  ]);
});