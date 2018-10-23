define(['controllers/controllers'], function(controllers) {
  'use strict';
  //根据接口调用自定义视图获取
  //用户登录userLoginUIService
  controllers.initController('loginCtr', ['$scope', '$rootScope', 'Info', 'userLoginUIService',
    function($scope, $rootScope, Info, userLoginUIService) {
      $scope.user = {
        username: "",
        password: ""
      };
      $scope.errorMsg = "";
      $scope.slide = "1";
      $scope.$watch("user.username", function(newValue, oldValue) {
        $scope.errorStatus = 0;
      });
      $scope.$watch("user.password", function(newValue, oldValue) {
        $scope.errorStatus = 0;
      });
      $scope.loginClick = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 || keycode == undefined) {

          if ($scope.user.username == "") {
            $scope.errorStatus = 1;
            $scope.errorMsg = "登录名不能为空";
            return;
          }
          if ($scope.user.password == "") {
            $scope.errorStatus = 2;
            $scope.errorMsg = "密码不能为空";
            return;
          }
          console.log($scope.user.username);
          if ($scope.user.username != "" && $scope.user.password != "") {
            // if ($("#checkServe").attr("checked") == "checked") {
            userLoginUIService.login($scope.user.username, $scope.user.password);
            // } else {
            //     $scope.errorMsg = "请勾选《普奥云网站服务协议》";
            // }
          } else {
            $scope.errorMsg = "请输入用户名或密码";
            $scope.errorStatus = 1;
          }
        }

      }
      $scope.checkClick = function() {
        if ($("#checkServe").attr("checked") == "checked") {
          $("#checkServe").show();
          $("#checkName").hide();
          $("#checkServe").attr("checked", false)
        } else {
          $("#checkServe").hide();
          $("#checkName").show();
          $("#checkServe").attr("checked", true)
        }
      }
      $scope.homeClick = function() {
        window.open("http://www.proudsmart.com");
      }
      $rootScope.indexShow = false;
      $rootScope.personalShow = true;
      var redirectHandler = function() {
        var industry = userLoginUIService.user.industry
        if (!industry || industry == 0) {
          if (!userLoginUIService.user.appData) {
            if (userLoginUIService.user.loginTimes == 0) {
              window.location.href = "../app-uc/password.html";
            } else {
              window.location.href = "apps.html";
            }
          } else {
            if (userLoginUIService.user.loginTimes == 0) {
              window.location.href = "../app-uc/password.html";
            } else {
              window.location.href = "app/index.html";
            }
          }
        } else {
          if (userLoginUIService.user.loginTimes == 0) {
            window.location.href = "../app-uc/password.html";
          } else {
            window.location.href = "app/index.html";
          }
        }
      };

      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            
              $rootScope.staffName = userLoginUIService.user.userName;
              $scope.userInfo = userLoginUIService.user;
              redirectHandler();
          } else {
            $scope.errorMsg = userLoginUIService.result.message;
            $scope.errorStatus = 1;
          }
        });
      } else {
        redirectHandler();
      }
    }

  ]);
});