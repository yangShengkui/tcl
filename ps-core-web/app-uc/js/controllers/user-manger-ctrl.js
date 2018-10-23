define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';

  controllers.controller('userMangerCtrl', ['$scope', '$location', 'Info', 'userLoginUIService', '$route', 'growl','configUIService',
    function($scope, $location, Info, userLoginUIService, route, growl,configUIService) {
      var dialogInstance;
      $scope.treeviewIndex = "";
      $scope.oldTreeviewIndex = "";

      $scope.currentMenuCode = null; //当前的菜单编码
      $scope.firstMenuCode = null; //第一层的菜单编码

      $scope.localMenuCode = "F01"; //判断使用哪一个服务中心，用来替代localIndex
      $scope.showMenu = false;
      $scope.menuitems = {};
      $scope.publicTableSearch = function(tabelname,value) {
        $scope.$broadcast('table-search-handle', {name:tabelname,value:value});
      };
      // 路由跳转成功后触发
      $scope.$on('$routeChangeSuccess', function() {
        userLoginUIService.rootHandler($scope, $location);
        if(route.current.params.mode == 'detail') {
          $scope.detailshow = true;
        } else {
          $scope.detailshow = false;
        }
      });

      /**
       * 判断未登录后如何处理
       * localmodel＝true 本地测试使用
       */
      var showLogin = function() {
        if(!localmodel) {
          return;
        }
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
            'pageToLoad': 'partials/login.html'
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
              location.href = "../index.html"
            }
          }]
        });
      };
      $scope.gotoHomePage = function() {
        if(userLoginUIService.user.enterprise.logoStatus != '0') {
          location.href = "http://www.proudsmart.com";
        }
      };

      $scope.gotoAppPage = function() {
        location.href = "index.html";
      };

      $scope.showMenuFun = function() {
        $scope.showMenu = !$scope.showMenu;
      };

      $scope.logout = function() {
        userLoginUIService.logout();
      };

      $scope.onViewLoad = function() {
        console.log('view changed');
      };
//    $scope.powers = {};
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
//    };

      $scope.menusFilter = function(item) {
        return item.functionCode.charAt(0) === "S";
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
        initConfigManager(function(){
          userLoginUIService.initMenus($scope, $location);
        })
//      initPower();
      };
      // 监听用户登录状态
      $scope.$on('loginStatusChanged', function(evt, d) {
        if(userLoginUIService.user.isAuthenticated) {
          if(dialogInstance) {
            dialogInstance.close();
          }
          $scope.userInfo = userLoginUIService.user;
          // $scope.lastLoginTime = useMomentFormat(userLoginUIService.user.lastLoginTime, "yyyy-MM-dd hh:mm:ss");
          if(userLoginUIService.user.enterprise)
            $scope.enterpriseType = userLoginUIService.user.enterprise.enterpriseType;
          initUserObjects();
        } else {
          $scope.userInfo = {};
          $scope.lastLoginTime = "";
          showLogin();
        }
      });
    }
  ]);
  //忘记密码
  controllers.controller("forgetCtrl", ['$scope', 'userIdentifyService','Info', 'userUIService', '$interval', 'growl', function($scope, userIdentifyService,Info, userUIService, $interval, growl) {
    $scope.forgetClick = "1";
    $scope.emailOnly = "";
    $scope.passwordConfig
    //通过json获取忘记密码配置
    var info = Info.get("localdb/password.json", function(info) {
      $scope.passwordConfig = info.passwordConfig;
    });
    $scope.forgetList = {
      'emailAddress': '',
      'verify': '',
      "verifyEmail": '',
      'newPwd': '',
      'confimPwd': ''
    };
    $scope.hideValidate = "";
    $scope.phoneEmail = "";
    $scope.verify = "";
    $scope.statusCheck = "";
    $scope.verifySuccess = "0";
    $scope.$watch("forgetList.confimPwd", function(newValue, oldValue) {
      if(newValue != $scope.forgetList.newPwd) {
        $scope.emailOnly = 4;
      } else {
        $scope.emailOnly = 0;
      }
    });
    $scope.$watch("forgetList.newPwd", function(newValue, oldValue) {
      if(newValue == undefined) {
        $scope.emailOnly = 333;
      } else {
        $scope.emailOnly = 0;
      }
    });
    $scope.$watch("forgetList.verify", function(newValue, oldValue) {
      $scope.emailOnly = 0;
    });
    $scope.$watch("forgetList.verifyEmail", function(newValue, oldValue) {
      $scope.emailOnly = 0;
    });
    //生成验证码
    userIdentifyService.getIdentify(function(identifyData) {
      if(identifyData.code == 0) {
        $scope.imgCode = identifyData.data;
      }
    });
    $scope.codeCheck = function() {
      var val = $scope.forgetList.verify;
      var valLength = val.length;
      if(valLength == 5) {
        //验证码校验
        userIdentifyService.identifyNum(val, function(res) {
          if(res.code == 0 && res.data == true) {
            $scope.verify = 'success';
            $scope.emailOnly = "0";
            $scope.verifySuccess = "1";
          } else {
            $scope.emailOnly = 2;
            $scope.verify = "error";
            $scope.verifySuccess = "0";
            userIdentifyService.getIdentify(function(identifyData) {
              if(identifyData.code == 0) {
                $scope.imgCode = identifyData.data;
              }
            });
          }
        });
      } else {
        $scope.emailOnly = 2;
        $scope.verifySuccess = "0";
        $scope.verify = "error";
      }
    }
    $scope.modeCheck = function() {
      var val = $scope.forgetList.emailAddress;
      if(val.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
        //校验邮箱是否存在
        userIdentifyService.repeatEmail($scope.forgetList.emailAddress, function(emailExist) {
          $scope.statusCheck = "email";
          if(emailExist.code == 0 && emailExist.data == false) {
            $scope.phoneEmail = "";
          } else {
            $scope.phoneEmail = 1001;
            $scope.emailOnly = 1;
          }
        })
      } else if(val.match(/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8]))\d{8}$/)) {
        //校验手机号码是否存在
        userUIService.checkMobilePhone($scope.forgetList.emailAddress, function(data) {
          $scope.statusCheck = "phone";
          if(data.code == 0 && data.data == true) {
            $scope.emailOnly = 1;
            $scope.phoneEmail = 1002;
          } else {
            $scope.phoneEmail = "";
          }
        })
      } else if(val == '') {
        $scope.emailOnly = 11;
        // $scope.phoneEmail="";
        $scope.statusCheck = '';
        $scope.phoneEmail = "";
      } else {
        $scope.emailOnly = '111';
        $scope.statusCheck = '';
        $scope.phoneEmail = "";
      }
    }
    $scope.blindClick = function() {
      //生成验证码
      $scope.imgCode = null;
      userIdentifyService.getIdentify(function(identifyData) {
        if(identifyData.code == 0) {
          $scope.imgCode = identifyData.data;
        }
      });
    }
    $scope.t = 60;
    var interval;
    $scope.$watch("forgetList.emailAddress", function(newValue, oldValue) {
      $scope.emailOnly = "0";
    });
    $scope.emailSend = function() {
        if($scope.forgetList.emailAddress == "") {
          $scope.emailOnly = 11;
          return;
        }
        if($scope.statusCheck == '') {
          $scope.emailOnly = '111';
          return;
        }
        if($scope.phoneEmail == 1002 || $scope.phoneEmail == 1001) {
          $scope.emailOnly = '1';
          return;
        }
        if($scope.forgetList.verify == "") {
          $scope.emailOnly = '200';
          return;
        }
        if($scope.verify == "error") {
          $scope.emailOnly = '2';
          return;
        }
        if($("#charge").text() == "获取验证码") {
          $("#charge").attr({
            "disabled": "disabled"
          });
          if($scope.statusCheck == "phone") {
            //手机发重置密码邮件
            userIdentifyService.sendPasswordSMS($scope.forgetList.emailAddress, function(address) {
              if(address.code == 0 && address.data == true) {
                $scope.time = 60;
                $interval.cancel();
                interval = $interval(function() {
                  $scope.time--;
                  if($scope.time == 0) {
                    $("#charge").removeAttr("disabled");
                    $("#charge").text("获取验证码");
                    $scope.time = 60;
                    $interval.cancel(interval);
                    //$scope.emailSend = false;
                  } else {
                    $("#charge").text("" + $scope.time + "秒后，重新获取验证码");
                  }
                }, 1000);
              } else if(address.code == 10008) {
                $scope.emailOnly = "1";
              }
            });
          } else if($scope.statusCheck == "email") {
            //发重置密码邮件
            userIdentifyService.sendEmailPassword($scope.forgetList.emailAddress, function(address) {
              if(address.code == 0 && address.data == true) {
                $scope.time = 60;
                $interval.cancel();
                interval = $interval(function() {
                  $scope.time--;
                  if($scope.time == 0) {
                    $("#charge").text("获取验证码");
                    $("#charge").removeAttr("disabled");
                    $scope.time = 60;
                    $interval.cancel(interval);
                    //$scope.emailSend = false;
                  } else {
                    $("#charge").text("" + $scope.time + "秒后，重新获取验证码");
                  }
                }, 1000);
              }
            });
          }
        }
      }
      //runTiming();
    $scope.forgetAjax = function() {
      if($scope.forgetList.newPwd == "") {
        $scope.emailOnly = 311;
        return;
      }
      if($scope.forgetList.newPwd == undefined) {
        return;
      }
      if($scope.forgetList.confimPwd == "") {
        $scope.emailOnly = 312;
        return;
      }
      if($scope.forgetList.confimPwd == undefined) {
        return;
      }
      if($scope.emailOnly == 4) {
        return;
      }
      if($scope.forgetList.newPwd != $scope.forgetList.confimPwd) {
        $scope.emailOnly = 4;
        return;
      }
      userIdentifyService.forgetPassword($scope.forgetList.emailAddress, $scope.hideValidate, $scope.forgetList.newPwd, function(emailExist) {
        console.log("忘记密码保存--" + JSON.stringify(emailExist));
        if(emailExist.code == 0 && emailExist.data == true) {
          $scope.forgetClick = "4";
          $("#barvader").css("width", "100%");
          $(".steps >ol >li:eq(2)").addClass("active");
          secTip();
        }
      });
    }
    var seed = 5; //60秒
    var tip = function() {
      seed--;
      if(seed > 0) {
        $("#sec").text(seed);
        secTip();
      } else {
        window.location.href = "../#/index";
      }
    }
    var secTip = function() {
      setTimeout(tip, 1000);
    }
    $scope.forgetStep = function(forNumber) {
      if(forNumber == 2) {
        if($scope.forgetList.emailAddress == "") {
          $scope.emailOnly = 11;
          return;
        }
        if($scope.statusCheck == '') {
          $scope.emailOnly = '111';
          return;
        }
        if($scope.phoneEmail == 1002 || $scope.phoneEmail == 1001) {
          $scope.emailOnly = '1';
          return;
        }
        if($scope.forgetList.verify == "") {
          $scope.emailOnly = '200';
          return;
        }
        if($scope.verify == "error") {
          $scope.emailOnly = '2';
          return;
        }
        if($scope.forgetList.verifyEmail != undefined && $scope.forgetList.verifyEmail != "") {
          if($scope.statusCheck == 'phone') {
            userIdentifyService.identifyPasswordSMS($scope.forgetList.verifyEmail, function(codeData) {
              if(codeData.code == 0) {
                $scope.hideValidate = codeData.data;
                $(".steps >ol >li:eq(1)").addClass("active");
                $("#barvader").css("width", "50%");
                $scope.forgetClick = "2";
              } else {
                $scope.emailOnly = 3;
              }
            })
          } else if($scope.statusCheck == 'email') {
            userIdentifyService.emailCheckPassword($scope.forgetList.verifyEmail, function(checkName) {
              if(checkName.code == 0) {
                $scope.hideValidate = checkName.data;
                $scope.forgetClick = forNumber;
                $(".steps >ol >li:eq(1)").addClass("active");
                $("#barvader").css("width", "50%");
                $scope.forgetClick = "2";
              } else {
                $scope.emailOnly = 3;
              }
            });
          }
        } else {
          $scope.emailOnly = 30001;
        }
      } else if(forNumber == 3) {
        userLoginUIService.emailCheckPassword($scope.forgetList.verifyEmail, function(checkName) {
          if(checkName.code == 0) {
            $scope.hideValidate = checkName.data;
            $scope.forgetClick = forNumber;
            $(".mod-sub-nav > li").removeClass("list2-active");
            $(".mod-sub-nav > li:eq(2)").addClass("list3-active");
          } else {
            $scope.emailOnly = 3;
          }
        });
      }
    };
  }]);
  //初始化密码
  controllers.controller('passwordController', ['$scope', '$rootScope', 'userLoginUIService', 'userIdentifyService', 'growl',
    function($scope, $rootScope, userLoginUIService, userIdentifyService, growl) {
      $scope.passwordEdit = userLoginUIService.user;
      $scope.pwdList = {
        "emailAddress": "",
        "newPwd": "",
        "configPwd": "",
        "regPwd": ""
      };
      $scope.imgCode = "";
      $scope.confirmShow = "0";
      $scope.codeMessage = "";
      $scope.emailAddress = "";
      $scope.identifyName = "";
      $scope.configError = "";
      $scope.userId = "";
      $scope.enterprise = {};
      $scope.logoImg = '';
      $scope.websiteUrl = '';
      $scope.$on('loginStatusChanged', function(evt, d) {
        if(userLoginUIService.user.isAuthenticated) {
          $scope.userId = userLoginUIService.user.userID;
          $scope.enterprise = userLoginUIService.user.enterprise;
          if($scope.enterprise.enterpriseLogo.indexOf("http") < 0){
            $scope.logoImg = 'images/logo.svg';
          }else{
            $scope.logoImg = $scope.enterprise.enterpriseLogo;
          }
          if($scope.enterprise.websiteUrl == ''|| $scope.enterprise.websiteUrl == null){
            $scope.websiteUrl = 'http://www.proudsmart.com/';
          }else{
            $scope.websiteUrl = $scope.enterprise.websiteUrl;
          }
          if(userLoginUIService.user.emailAddress) {
            $scope.emailAddress = userLoginUIService.user.emailAddress;
          } else if(userLoginUIService.user.mobilePhone) {
            $scope.emailAddress = userLoginUIService.user.mobilePhone;
          }
        }
      });
      //生成验证码
      userIdentifyService.getIdentify(function(identifyData) {
        if(identifyData.code == 0) {
          $scope.imgCode = identifyData.data;
        }
      });
      //更新验证码
      $scope.blindClick = function() {
        $scope.imgCode = null;
        userIdentifyService.getIdentify(function(identifyData) {
          if(identifyData.code == 0) {
            $scope.imgCode = identifyData.data;
          }
        });
      }
      $scope.$watch("pwdList.regPwd", function(newValue, oldValue) {
        if(newValue != $scope.pwdList.newPwd) {
          $scope.confirmShow = 1;
        } else {
          $scope.confirmShow = 0;
        }
      });
      $scope.$watch("identifyName", function(newValue, oldValue) {
        $scope.confirmShow = 0;
      });
      $scope.$watch("pwdList.newPwd", function(newValue, oldValue) {
        if(newValue != '') {

          //if (newValue == $scope.pwdList.configPwd) {
          //  $scope.configError = 2022;
          //} else {
          //  $scope.configError = 0;
          //}
        }
      });
      $scope.$watch("pwdList.configPwd", function(newValue, oldValue) {
        $scope.confirmShow = 0;
      });
      var currentUrl = document.location.href;
      var currentPage = currentUrl.split("/")[5];
      // if(currentPage == "personal") {
      //   userLoginUIService.logout();
      // }
      $scope.initPwd = function() {
        if($scope.emailAddress != "") {
          if($scope.pwdList.configPwd == "") {
            $scope.confirmShow = 1010;
            return;
          }
          if($scope.pwdList.newPwd == "") {
            $scope.confirmShow = 1011;
            return;
          }
          if($scope.pwdList.regPwd == "") {
            $scope.confirmShow = 1016;
            return;
          }
          if($scope.identifyName == "") {
            $scope.confirmShow = 1017;
            return;
          }
          if($scope.configError == 2022) {
            return;
          }
          //验证码校验
          userIdentifyService.identifyNum($scope.identifyName, function(res) {
            if(res.code == 0 && res.data == true) {
              // $scope.pwdList.emailAddress=userLoginUIService.user.emailAddress;
              if($scope.pwdList.regPwd == $scope.pwdList.newPwd) {
                if($scope.userId == "" || $scope.userId == null) {
                  $scope.userId = userLoginUIService.user.userID;
                }
                userLoginUIService.modifyPassword($scope.userId, $scope.pwdList.configPwd, $scope.pwdList.newPwd, function(initDate) {
                  if(initDate.code == 0 && initDate.data == true) {
                    BootstrapDialog.show({
                      title: '提示',
                      message: '修改密码成功,请重新登录',
                      closable: false,
                      buttons: [{
                        label: '确定',
                        action: function(dialogRef) {
                          userLoginUIService.logout();
                          dialogRef.close();
                        }
                      }]
                    });
                  } else if(initDate.data == false) {
                    $scope.confirmShow = "2011";
                    $scope.blindClick();
                    return;
                  } else {
                    $scope.confirmShow = "10010";
                    $scope.blindClick();
                    $scope.codeMessage = initDate.message;
                    //$scope.codeMessage = '旧密码输入错误';
                  }
                  console.log("initDate-----" + JSON.stringify(initDate));
                });
              } else {
                $scope.confirmShow = 1;
              }
            } else {
              $scope.confirmShow = 3;
            }
          })
        } else {
          growl.warning("您的账号没有邮箱或者手机号码，不能修改密码", {});
          return;
          //window.location.href = "login.html";
        }
      };
      $scope.tuichu = function() {
        userLoginUIService.logout(function(res) {
          if(res.code == 0) {
            window.location.href = "../#/index";
          }
        });
      }
    }
  ]);
  //修改密码
  controllers.controller('forgetPwdController', ['$scope', '$rootScope', 'userLoginUIService', 'userIdentifyService', 'growl',
    function($scope, $rootScope, userLoginUIService, userIdentifyService, growl) {
      $scope.passwordEdit = userLoginUIService.user;
      $scope.pwdList = {
        "emailAddress": "",
        "newPwd": "",
        "configPwd": "",
        "regPwd": ""
      };
      $scope.imgCode = "";
      $scope.confirmShow = "0";
      $scope.codeMessage = "";
      $scope.emailAddress = "";
      $scope.identifyName = "";
      $scope.configError = "";
      $scope.userId = "";
      if(userLoginUIService.user.emailAddress) {
        $scope.emailAddress = userLoginUIService.user.emailAddress;
      } else if(userLoginUIService.user.mobilePhone) {
        $scope.emailAddress = userLoginUIService.user.mobilePhone;
      }
      //生成验证码
      userIdentifyService.getIdentify(function(identifyData) {
        if(identifyData.code == 0) {
          $scope.imgCode = identifyData.data;
        }
      });
      //更新验证码
      $scope.blindClick = function() {
        $scope.imgCode = null;
        userIdentifyService.getIdentify(function(identifyData) {
          if(identifyData.code == 0) {
            $scope.imgCode = identifyData.data;
          }
        });
      }
      $scope.$watch("pwdList.regPwd", function(newValue, oldValue) {
        if(newValue != $scope.pwdList.newPwd) {
          $scope.confirmShow = 1;
        } else {
          $scope.confirmShow = 0;
        }
      });
      $scope.$watch("identifyName", function(newValue, oldValue) {
        $scope.confirmShow = 0;
      });
      $scope.$watch("pwdList.newPwd", function(newValue, oldValue) {
        if(newValue != '') {

          //if (newValue == $scope.pwdList.configPwd) {
          //  $scope.configError = 2022;
          //} else {
          //  $scope.configError = 0;
          //}
        }
      });
      $scope.$watch("pwdList.configPwd", function(newValue, oldValue) {
        $scope.confirmShow = 0;
      });
      var currentUrl = document.location.href;
      var currentPage = currentUrl.split("/")[5];
      // if(currentPage == "personal") {
      //   userLoginUIService.logout();
      // }
      $scope.updatePassWord = function() {
        if($scope.emailAddress != "") {
          if($scope.pwdList.configPwd == "") {
            growl.warning("旧密码不能为空",{});
            return;
          }
          if($scope.pwdList.newPwd == "") {
            growl.warning("新密码不能为空",{});
            return;
          }
          if($scope.pwdList.regPwd == "") {
            growl.warning("确认密码不能为空",{});
            return;
          }
          if($scope.identifyName == "") {
            growl.warning("验证码不能为空",{});
            return;
          }
          if($scope.configError == 2022) {
            return;
          }
          //验证码校验
          userIdentifyService.identifyNum($scope.identifyName, function(res) {
            if(res.code == 0 && res.data == true) {
              // $scope.pwdList.emailAddress=userLoginUIService.user.emailAddress;
              if($scope.pwdList.regPwd == $scope.pwdList.newPwd) {
                if($scope.userId == "" || $scope.userId == null) {
                  $scope.userId = userLoginUIService.user.userID;
                }
                userLoginUIService.modifyPassword($scope.userId, $scope.pwdList.configPwd, $scope.pwdList.newPwd, function(initDate) {
                  if(initDate.code == 0 && initDate.data == true) {
                    BootstrapDialog.show({
                      title: '提示',
                      message: '修改密码成功,请重新登录',
                      closable: false,
                      buttons: [{
                        label: '确定',
                        action: function(dialogRef) {
                          userLoginUIService.logout();
                          dialogRef.close();
                        }
                      }]
                    });
                  } else if(initDate.data == false) {
                    $scope.confirmShow = "2011";
                    $scope.blindClick();
                    return;
                  } else {
                    $scope.confirmShow = "10010";
                    $scope.blindClick();
                    $scope.codeMessage = initDate.message;
                    //$scope.codeMessage = '旧密码输入错误';
                  }
                  console.log("initDate-----" + JSON.stringify(initDate));
                });
              } else {
                $scope.confirmShow = 1;
              }
            } else {
              $scope.confirmShow = 3;
            }
          })
        } else {
          growl.warning("您的账号没有邮箱或者手机号码，不能修改密码", {});
          return;
          //window.location.href = "login.html";
        }
      };
      $scope.tuichu = function() {
        userLoginUIService.logout(function(res) {
          if(res.code == 0) {
            window.location.href = "../#/index";
          }
        });
      }
    }
  ]);
  //展会登录页面
  controllers.controller('loginController', ['$scope', "$http", '$rootScope', 'Info', 'userIdentifyService', '$interval',
    function($scope, $http, $rootScope, Info, userIdentifyService, $interval) {
      $scope.mobile = ""; //手机号码
      $scope.codeError = ""; //错误提示标志
      $scope.verify = ""; //验证码输入
      $scope.industry = ""; //解决方案
      $scope.industryList = ""; //解决方案集合
      //通过json获取解决方案
      var info = Info.get("localdb/info.json", function(info) {
        $scope.provinceList = info.industry;
      });
      var url = window.location.origin;
      if(url.search('localhost') > -1 || url.search('127.0.0.1') > -1) {
        url = "http://192.168.1.121"
      }
      userIdentifyService.querySolution(function(res) {
        if(res.code == 0) {
          $scope.industryList = res.data;
        }
      });
      $scope.$watch("mobile", function(newValue, oldValue) {
        $scope.codeError = "0";
      });
      $scope.$watch("verify", function(newValue, oldValue) {
        $scope.codeError = "0";
      });
      $scope.$watch("industry", function(newValue, oldValue) {
        $scope.codeError = "0";
      });
      $scope.loginSave = function() {
        if($scope.mobile == "" && $scope.mobile == null && typeof($scope.mobile) == "undefined") {
          $scope.codeError = "1003";
          return;
        }
        if($scope.verify == "" && $scope.verify == null && typeof($scope.verify) == "undefined") {
          $scope.codeError = "1004";
          return;
        }
        if($scope.industry == "" && $scope.industry == null && typeof($scope.industry) == "undefined") {
          $scope.codeError = "1005";
          return;
        }
        userIdentifyService.identifySMS($scope.verify, function(res) {
          if(res.code == 0 && res.data == true) {
            userIdentifyService.weChatLogin($scope.mobile, $scope.industry, function(obj) {
              if(obj.code == 0) {
                window.location.href = "../app-oc/index.html#/dashboard";
              }
            });
          } else {
            $scope.codeError = "2001";
          }
        });
      }
      var interval;
      $scope.codeClick = function() {
        if($scope.mobile == "" && $scope.mobile == null && typeof($scope.mobile) == "undefined") {
          $scope.codeError = "1003";
          return;
        }
        if($("#charge").text() == "发送验证码") {
          $("#charge").attr({
            "disabled": "disabled"
          });
          //手机发重置密码邮件
          userIdentifyService.sendSMS($scope.mobile, function(address) {
            if(address.code == 0 && address.data == true) {
              $scope.time = 60;
              $interval.cancel();
              interval = $interval(function() {
                $scope.time--;
                if($scope.time == 0) {
                  $("#charge").removeAttr("disabled");
                  $("#charge").text("发送验证码");
                  $scope.time = 60;
                  $interval.cancel(interval);
                } else {
                  $("#charge").text("" + $scope.time + "秒后，重新获取验证码");
                }
              }, 1000);
            }
          });
        }
      }
    }
  ]);

  //用户注册
  controllers.controller('registerCtrl', ['$scope', '$rootScope', 'Info', 'userUIService', 'modelDefinitionService', 'userIdentifyService', '$interval',
    function ($scope, $rootScope, Info, userUIService, modelDefinitionService, userIdentifyService, $interval) {
      $scope.regShow = "1";
      $scope.confirmPassword = "";
      $scope.confirmShow = "false";
      $scope.statusShow = "1";
      $scope.emailOnly = "0";
      $scope.imgCode = "";
      $scope.identifyName = "";
      $scope.safeMsg = false;
      $scope.phoneEmail = "1001";
      $scope.editData = {};
      $scope.formData = {
        'emailAddress': '',
        'password': '',
        'roleID': '1',
        'mobilePhone': '',
        'userName': '',
        'countryRegion': '中国大陆',
        'address': '',
        'industry': '',
        'city': '北京',
        'province': '北京',
        'business': '',
        'mail_num': ''
      };
      $scope.enterpriseManager = {
        "name": ""
      };
      $scope.show = false;
      var urlCode = location.href.split("?");
      var info = Info.get("localdb/info.json", function (info) {
        $scope.areaList = info.areaList;
        $scope.provinceList = info.cityList;
      });
      // $scope.$on('loginStatusChanged', function(evt, d) {
      //     if (userLoginUIService.user.isAuthenticated) {
      //         $rootScope.staffName = userLoginUIService.user.userName;
      //         $scope.userInfo = userLoginUIService.user;
      //     }
      // });
      //生成验证码
      userIdentifyService.getIdentify(function (e) {
        if (e.code == 0) {
          $scope.imgCode = e.data;
        }
      });
      modelDefinitionService.findAllIndustry(function (industry) {
        var arr = industry.data;
        var arr1 = industry.data;
        var newData = [];
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr1.length; j++) {
            if (arr[i].id == arr1[j].parentModelId) {
              newData.push(arr1[j]);
            }
          }
        }
        $scope.belongList = newData;
      });
      $scope.blindClick = function () {
        //生成验证码
        userIdentifyService.getIdentify(function (e) {
          if (e.code == 0) {
            $scope.imgCode = e.data;
          }
        });
      }
      $scope.$watch("formData.emailAddress", function (newValue, oldValue) {
        $scope.emailOnly = "0";
      });
      $scope.$watch("identifyName", function (newValue, oldValue) {
        $scope.emailOnly = "0";
      });
      $scope.$watch("formData.industry", function (newValue, oldValue) {
        $scope.emailOnly = "0";
      });
      $scope.$watch("formData.password", function (newValue, oldValue) {
        $scope.emailOnly = "0";
      });
      $scope.$watch("formData.mobilePhone", function (newValue, oldValue) {
        $scope.emailOnly = "0";
      });
      $scope.$watch("formData.userName", function (newValue, oldValue) {
        $scope.emailOnly = "0";
      });
      $scope.$watch("confirmPassword", function (newValue, oldValue) {
        $scope.emailOnly = "0";
        if (newValue != $scope.formData.password) {
          $scope.confirmShow = 1;
        } else {
          $scope.confirmShow = 0;
        }
      });
      $scope.onMouseOver = function (actor, event) {
        $scope.show = true;
      }
      $scope.renewal = function () {
        //$scope.regShow="1";
        window.location.reload(); //刷新当前页面.
      }
      $scope.statusClick = function (statusId) {
        if (statusId == 1) {
          $scope.statusShow = 1;
        } else if (statusId == 2) {
          $scope.statusShow = 2;
        }
      }
      var interval;
      $scope.noEmail = function () {
        console.log("username==" + $("#emailBtn").text());
        if ($("#emailBtn").text() == "重新发送邮件") {
          userIdentifyService.sendEmail($scope.formData.emailAddress, $scope.formData.password, function (address) {
            if (address.code == 0 && address.data == true) {
              $scope.time = 60;
              $interval.cancel();
              interval = $interval(function () {
                $scope.time--;
                if ($scope.time == 0) {
                  $("#emailBtn").text("重新发送邮件");
                  $scope.time = 60;
                  $interval.cancel(interval);
                } else {
                  $("#emailBtn").text("" + $scope.time + "秒后，重新获取");
                }
              }, 1000);
            }
            $scope.regShow = 2;
          });
        }
      }
      $scope.phoneCode = function () {
        if ($scope.formData.emailAddress == "") {
          $scope.emailOnly = 11;
          return;
        }
        if ($scope.statusCheck == '') {
          $scope.emailOnly = '1003';
          return;
        }
        if ($scope.formData.password == "") {
          $scope.emailOnly = 'pass10';
          return;
        }
        if ($scope.formData.password == undefined) {
          return;
        }
        if ($("#phoneCode").text() == "发送验证码") {
          $("#phoneCode").attr({
            "disabled": "disabled"
          });
          userIdentifyService.sendSMS($scope.formData.emailAddress, function (codeData) {
            if (codeData.code == 0 && codeData.data == true) {
              $scope.timeCode = 60;
              $interval.cancel();
              interval = $interval(function () {
                $scope.timeCode--;
                if ($scope.timeCode == 0) {
                  $("#phoneCode").text("发送验证码");
                  $("#phoneCode").removeAttr("disabled");
                  $scope.timeCode = 60;
                  $interval.cancel(interval);
                  //$scope.emailSend = false;
                } else {
                  $("#phoneCode").text("" + $scope.timeCode + "秒后，重新获取");
                }
              }, 1000);
            } else {
              if (codeData.code == 10017) {
                $scope.emailOnly = 1;
                $("#phoneCode").removeAttr("disabled");
              }
            }
          });
        }
      }
      var seed = 5; //60秒
      var tip = function () {
        seed--;
        if (seed > 0) {
          $("#sec").text(seed);
          secTip();
        } else {
          window.location.href = "index.html";
        }
      }
      var secTip = function () {
        setTimeout(tip, 1000);
      }
      //注册只支持企业用户注册
      $scope.phoneSumbit = function () {
        if ($scope.formData.userName == "") {
          $scope.emailOnly = "01012";
          return;
        }
        if ($scope.formData.userName == undefined) {
          return;
        }
        if ($scope.statusCheck == "phone") {
          $scope.formData1 = {
            'password': $scope.formData.password,
            'mobilePhone': $scope.formData.emailAddress,
            'userName': $scope.formData.userName,
            'countryRegion': '中国大陆',
            'address': $scope.formData.address,
            'city': '北京',
            'business': $scope.formData.business,
            'province': '北京',
          };
          $scope.editData["name"] = $scope.formData.business;
          $scope.editData["address"] = $scope.formData.address;
          $scope.editData["contactPhone"] = $scope.formData.emailAddress;
        } else {
          $scope.formData1 = {
            'password': $scope.formData.password,
            'emailAddress': $scope.formData.emailAddress,
            'userName': $scope.formData.userName,
            'countryRegion': '中国大陆',
            'address': $scope.formData.address,
            'city': '北京',
            'business': $scope.formData.business,
            'province': '北京',
          };
          $scope.editData["name"] = $scope.formData.business;
          $scope.editData["address"] = $scope.formData.address;
          $scope.editData["contactEmail"] = $scope.formData.emailAddress;
        }
        userUIService.individualUserRegister($scope.editData, $scope.formData1, function (vv) {
          if (vv.code == 0) {
            $scope.regShow = "4";
            if ($scope.statusCheck == "phone") {
              $scope.$on('loginStatusChanged', function (evt, d) {
                if (userLoginUIService.user.isAuthenticated) {
                  $rootScope.staffName = userLoginUIService.user.userName;
                  $scope.userInfo = userLoginUIService.user;
                  console.log("注册用户登录成功");
                } else {
                  console.log("注册失败,原因" + vv.message + "");
                  window.location.href = "login.html";
                }
              });
              // userLoginUIService.login($scope.formData.emailAddress, $scope.formData.password);
            }
            // setTimeout(function () {
            // window.location.href="app/index.html";
            // }, 5000);
            secTip();
            $("#barvader").css("width", "100%");
            $(".steps >ol >li:eq(2)").addClass("active");
          } else {
            if (vv.code == -3) {
              $scope.emailOnly = "2";
            } else {
              console.log("注册失败,原因" + vv.message + "");
              // window.location.href="login.html";
            }
          }
        });
      }
      $scope.emailHref = function (hrefName) {
        var emailSpile = hrefName.split("@")[1].split(".")[0];
        window.open("http://mail." + emailSpile + ".com/");
      }
      $scope.passCheck = function (eve) {
        var val = '' + eve.currentTarget.value + '';
        if (val == '') {
          $scope.emailOnly = "pass10";
        } else {
          if (!val.match(/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/)) {
            $scope.emailOnly = "pass11";
          }
        }
        //  if(!val.match(/^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/)){
        //    $scope.emailOnly ="pass11";
        //  }else if(){
        //    $scope.emailOnly ="pass10";
        // }
      }
      $scope.identCheck = function (eve) {
        var val = '' + eve.currentTarget.value + '';
        if (val == '') {
          $scope.emailOnly = "30001";
        }
      }
      $scope.userCheck = function (eve) {
        var val = '' + eve.currentTarget.value + '';
        if (val == '') {
          $scope.emailOnly = "01012";
        }
      }
      $scope.modeCheck = function () {
        var val = $scope.formData.emailAddress;
        if (val.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
          $scope.phoneEmail = 1002;
          $scope.statusCheck = "email";
        } else if (val.match(/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8]))\d{8}$/)) {
          $scope.phoneEmail = 1001;
          $scope.statusCheck = "phone";
        } else if (val == '') {
          $scope.emailOnly = 11;
          // $scope.phoneEmail="";
          $scope.statusCheck = '';
          // $("#phone").addClass("error-boder");
        } else {
          $scope.emailOnly = '1003';
          $scope.statusCheck = '';
          // $("#phone").addClass("error-boder");
        }
      }
      $scope.checkClick = function () {
        $scope.emailOnly = "0";
        if ($("#regCheck").attr("checked") == "checked") {
          $("#regCheck").attr("checked", false)
        } else {
          $("#regCheck").attr("checked", true)
        }
      }
      $scope.nextStep = function (regId) {
        if ($scope.formData.emailAddress == "") {
          $scope.emailOnly = 11;
          return;
        }
        if ($scope.formData.password == "") {
          $scope.emailOnly = 'pass10';
          return;
        }
        if ($scope.identifyName == "") {
          $scope.emailOnly = '30001';
          return;
        }
        if (regId == 2) {
          console.log("regCheck----" + $("#regCheck").attr("checked"));
          if ($("#regCheck").attr("checked") == "checked") {
            if ($scope.statusCheck == "phone") {
              //校验手机号码是否存在
              userUIService.checkMobilePhone($scope.formData.emailAddress, function (data) {
                if (data.code == 0 && data.data == true) {
                  userIdentifyService.identifySMS($scope.identifyName, function (codeData) {
                    if (codeData.code == 0 && codeData.data == true) {
                      $scope.regShow = '20000';
                      $("#barvader").css("width", "50%");
                      $(".steps >ol >li:eq(1)").addClass("active");
                    } else {
                      $scope.emailOnly = 2;
                    }
                  })
                } else {
                  $scope.emailOnly = 1;
                }
              })
            } else if ($scope.statusCheck == "email") {
              //校验邮箱是否存在
              userIdentifyService.repeatEmail($scope.formData.emailAddress, function (emailExist) {
                if (emailExist.code == 0 && emailExist.data == true) {
                  //验证码校验
                  userIdentifyService.identifyNum($scope.identifyName, function (res) {
                    if (res.code == 0 && res.data == true) {
                      userIdentifyService.sendEmail($scope.formData.emailAddress, $scope.formData.password, function (address) {
                        $scope.regShow = regId;
                        console.log("发送邮件返回值---" + JSON.stringify(address));
                      });
                    } else {
                      $scope.emailOnly = 2;
                      //生成验证码
                      userIdentifyService.getIdentify(function (e) {
                        if (e.code == 0) {
                          $scope.imgCode = e.data;
                        }
                      });
                    }
                  });
                } else {
                  $scope.emailOnly = 1;
                }
              });
            }
          } else {
            $scope.emailOnly = 2099;
          }
        }
      }
      if (urlCode[1] != undefined) {
        var statusCode = urlCode[1];
        console.log("code---" + urlCode[1]);
        userIdentifyService.identifyEmail(statusCode.split("=")[1], function (identifyData) {
          if (identifyData.code == 0) {
            userIdentifyService.repeatEmail(identifyData.data.emailAddress, function (emailExist) {
              console.log("emailExist---" + JSON.stringify(emailExist));
              if (emailExist.code == 0 && emailExist.data == false) {
                //window.location.href="index.html#/index";
                $scope.regShow = 6
                $(".steps").hide();
              } else {
                console.log("countryRegion--" + identifyData.data.countryRegion);
                $scope.formData.emailAddress = identifyData.data.emailAddress;
                $scope.formData.password = identifyData.data.countryRegion;
                $(".steps >ol >li:eq(1)").addClass("active");
                $("#barvader").css("width", "50%");
                $scope.regShow = '20000';
              }
            })
          } else {
            $scope.regShow = 5;
          }
        });
      }
    }
  ]);
});