define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.controller('userMangerCtrl', ['$scope', '$location', 'Info', 'configUIService','userLoginUIService', 'viewFlexService','growl',
    function($scope, $location, Info, configUIService, userLoginUIService,viewFlexService,growl) {
      var dialogInstance;
      $scope.treeviewIndex = '/personal';
//    $scope.powers = {};
      $scope.treeviewIndex = "";
      $scope.oldTreeviewIndex = "";

      $scope.currentMenuCode = null; //当前的菜单编码
      $scope.firstMenuCode = null; //第一层的菜单编码

      $scope.localMenuCode = "F01"; //判断使用哪一个服务中心，用来替代localIndex
      $scope.showMenu = false;
      $scope.menuitems = {};

      $scope.$on('$routeChangeSuccess', function() {
        userLoginUIService.rootHandler($scope, $location);
      });
      var showLogin = function() {
        // location.href = "login.html";
        return;
        dialogInstance = BootstrapDialog.show({
          title: '欢迎来到普奥的世界',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);

            return $message;
          },
          data: {
            'pageToLoad': 'login.html'
          },
          buttons: [{
            label: '登录',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var userInput = document.getElementById('username');
              var psdInput = document.getElementById('password');
              userLoginUIService.login(userInput.value, psdInput.value);
            }
          }, {
            label: '退出',
            action: function(dialogRef) {
              dialogRef.close();
              location.href = "index.html"
            }
          }]
        });
      }
      var info = Info.get("localdb/info.json", function(info) {
        $scope.messages = info.messages;
//      $scope.tasks = info.tasks;
//      $scope.alerts = info.alerts;
//      $scope.menuitems = info.menuitems;
        $scope.alertView = [];
        $scope.designView = [];
      });
      $scope.gotoHomePage = function() {
        if(userLoginUIService.user.enterprise.logoStatus != '0') {
          location.href = "http://www.proudsmart.com";
        }
      }
      $scope.gotoAppPage = function() {
        location.href = "#dashboard2";
      }
      $scope.showMenu = false;
      $scope.showMenuFun = function() {
        $scope.showMenu = !$scope.showMenu;
      };
      $scope.logout = function() {
        userLoginUIService.logout();
      };
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
      $scope.onViewLoad = function() {
        console.log('view changed');
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
      function initUserObjects() {
        // initUnit();
        // initViews();
        // initRootDomain();
        // initCount();
//      initPower();
        initConfigManager(function(){
          userLoginUIService.initMenus($scope, $location);
        })
      };
      $scope.$on('loginStatusChanged', function(evt, d) {

        if(userLoginUIService.user.isAuthenticated) {
          if(dialogInstance) {
            dialogInstance.close();
          }
          $scope.userInfo = userLoginUIService.user;
          $scope.lastLoginTime = newDateJson(userLoginUIService.user.lastLoginTime).Format(GetDateCategoryStrByLabel());
          initUserObjects();
        } else {
          $scope.userInfo = {};
          $scope.lastLoginTime = "";
          showLogin();
        }
      });

      function initViews() {
        $scope.alertView = [];
        $scope.designView = [];
        viewFlexService.getAllMyViews(function(returnObj) {
          if(returnObj.code == 0) {
            var v = returnObj.data;
            var viewList = [];
            for(var i = 0; i < v.length; i++) {
              var view = v[i];
              if(view) {
                viewList.push(view);
                var description = {};
                if(view.description) {
                  description = JSON.parse(view.description);
                }

                if(view.viewType == "designView") {

                  var viewmenus = {
                    "title": view.viewTitle.split("?")[0],
                    "url": "#/" + view.viewType + "/" + view.viewId,
                    "viewId": view.viewId,
                    "view": view,
                    "status": description['status'],
                    "statusBg": description["status"] == 1 ? 'bg-red' : (description["status"] == 2 ? 'bg-green' : ''),
                    "statusLab": description["status"] == 1 ? '授权' : (description["status"] == 2 ? '购买' : ''),
                    "icon": "fa fa-area-chart"
                  };
                  $scope.designView.push(viewmenus);
                } else
                if(view.viewType == "configAlert") {

                  var viewmenus = {
                    "title": view.viewTitle.split("?")[0],
                    "url": "#/" + view.viewType + "/" + view.viewId,
                    "viewId": view.viewId,
                    "view": view,
                    "status": description["status"],
                    "statusBg": description["status"] == 1 ? 'bg-red' : (description["status"] == 2 ? 'bg-green' : ''),
                    "statusLab": description["status"] == 1 ? '授权' : (description["status"] == 2 ? '购买' : ''),

                    "icon": "fa fa-warning"
                  };
                  $scope.alertView.push(viewmenus);
                }
              }
            }
            viewFlexService.viewLoadFinished = true;
            viewFlexService.viewList = viewList;
            $scope.viewList = viewList;
            $scope.$broadcast('viewLoadFinished');
          }
        });
      }
    }
  ]);
});