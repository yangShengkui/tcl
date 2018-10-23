define(['controllers/controllers'], function (controllers) {
  'use strict';
  //根据接口调用自定义视图获取
  //用户登录userLoginUIService
  controllers.initController('loginCtr', ['$scope', '$rootScope', 'Info', 'userLoginUIService',
    function ($scope, $rootScope, Info, userLoginUIService) {
      $scope.user = {
        username: "",
        password: ""
      };
      $scope.errorMsg = "";
      $scope.slide = "1";
      $scope.$watch("user.username", function (newValue, oldValue) {
        $scope.errorStatus = 0;
      });
      $scope.$watch("user.password", function (newValue, oldValue) {
        $scope.errorStatus = 0;
      });
      $scope.loginClick = function (e) {
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
      $scope.checkClick = function () {
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
      $scope.homeClick = function () {
        window.open("http://www.proudsmart.com");
      }
      $rootScope.indexShow = false;
      $rootScope.personalShow = true;
      var redirectHandler = function () {
        var industry = userLoginUIService.user.industry
        if (!industry || industry == 0) {
          if (!userLoginUIService.user.appData) {
            if (userLoginUIService.user.loginTimes == 0) {
              window.location.href = "../password.html";
            } else {
              window.location.href = "apps.html";
            }
          } else {
            if (userLoginUIService.user.loginTimes == 0) {
              window.location.href = "../password.html";
            } else {
              window.location.href = "app/index.html";
            }
          }
        } else {
          if (userLoginUIService.user.loginTimes == 0) {
            window.location.href = "../password.html";
          } else {
            window.location.href = "app/index.html";
          }
        }
      };
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
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
  //个人中心编辑
  controllers.initController('personalController', ['$scope', 'userEnterpriseService', 'growl', 'Info', 'userLoginUIService', '$rootScope', 'userIdentifyService', 'modelDefinitionService', 'resourceUIService', 'userUIService','configUIService',
    function ($scope, userEnterpriseService, growl, Info, userLoginUIService, $rootScope, userIdentifyService, modelDefinitionService, resourceUIService, userUIService, configUIService) {
      $scope.userEdit = "";
      $scope.provinces = "";
      $scope.districts = "";
      $scope.citys = "";
      $scope.loginname = "";
      $scope.selectLoginName = "";
      var pro = function () {
        resourceUIService.getSimpleDistricts(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.provinces = returnObj.data;
            for (var i in $scope.provinces) {
              if ($scope.provinces[i].label == $scope.userEdit.enterprise.province) {
                if ($scope.userEdit.enterprise.province == '北京市' || $scope.userEdit.enterprise.province == '天津市' || $scope.userEdit.enterprise.province == '上海市' || $scope.userEdit.enterprise.province == '重庆市') {
                  var pro = $scope.provinces[i].children;
                  for (var n in pro) {
                    if (pro[n].label == $scope.userEdit.enterprise.province) {
                      $scope.citys = pro[n].children;
                    }
                  }
                } else {
                  $scope.citys = $scope.provinces[i].children;
                }
                $scope.districts = [];
              }
            }
            for (var j in $scope.citys) {
              if ($scope.citys[j].label == $scope.userEdit.enterprise.city) {
                $scope.districts = $scope.citys[j].children;
              }
            }
          }
        });
      }
      $scope.configGroupsDic = {};
      $scope.configGroups = [];
      $scope.userTypeAry = {};
      var configList = function() {
        configUIService.getAllConfigs(function(returnObj){
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.configGroupsDic[item.groupName] = item;
            });
            $scope.configGroups = returnObj.data;
            if(returnObj.data && $scope.configGroupsDic["UserType"] != undefined){
              var userType = eval("(" + $scope.configGroupsDic["UserType"].value + ")");
              userType.forEach(function(user) {
                $scope.userTypeAry[user.typeCode] = user;
              });
            }

          }
        });
      };

      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            $rootScope.staffName = userLoginUIService.user.userName;
            $scope.userInfo = jQuery.extend(true, {}, userLoginUIService.user);
            $scope.userEdit = jQuery.extend(true, {}, userLoginUIService.user);
            $scope.selectLoginName = userLoginUIService.user.loginName;
            configList();
            pro();
          }
          /*else {
            window.location.href = "login.html";
          }*/
        });
      } else {
        $rootScope.staffName = userLoginUIService.user.userName;
        $scope.userInfo = jQuery.extend(true, {}, userLoginUIService.user);
        $scope.userEdit = jQuery.extend(true, {}, userLoginUIService.user);
        $scope.selectLoginName = userLoginUIService.user.loginName;
        configList();
        pro();
      }
      $scope.proChang = function () {
        pro();
      }
      $scope.$watch("loginname", function () {
        $scope.loginname = "";
      });
      $scope.userEdit = jQuery.extend(true, {}, userLoginUIService.user);
      $scope.editData = {};
      modelDefinitionService.findAllIndustry(function (industry) {
        var arr = industry.data;
        var arr1 = industry.data;
        var newData = [];
        console.log(JSON.stringify(newData));
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr1.length; j++) {
            if (arr[i].id == arr1[j].parentModelId) {
              newData.push(arr1[j]);
            }
          }
        }
        $scope.belongList = newData;
      });
      var info = Info.get("localdb/info.json", function (info) {
        $scope.provinceList = info.cityList;
        $scope.durationArr = info.durationList;
        $scope.scaleArr = info.scaleList;
      });
      //编辑点击事件
      $scope.editClick = function () {
        $scope.editData["officePhone"] = $scope.userEdit.officePhone;
        $scope.editData["userID"] = $scope.userEdit.userID;
        $scope.editData["userName"] = $scope.userEdit.userName;
        $scope.editData["loginName"] = $scope.selectLoginName;
        if (typeof($scope.userEdit.officePhone) == "undefined") {
          growl.warning("联系电话格式不对，请重新输入", {});
          return;
        }
        if ($scope.userEdit.userName == '') {
          growl.warning("显示名称不能为空", {})
          return;
        }
        if ($scope.selectLoginName == '' || $scope.selectLoginName == null || $scope.selectLoginName == undefined) {
          growl.warning("登录名不能为空", {})
          return;
        }
        if (($scope.selectLoginName != '' && $scope.selectLoginName != null) && ($scope.selectLoginName != $scope.userInfo.loginName)) {
          userUIService.checkLoginName($scope.selectLoginName, function(res) {
            if (res.code == 0) {
              if (res.data == false) {
                $scope.loginname = 'error';
                growl.warning("该登录名已存在，请修改！", {})
                return;
              }else{
                personSave($scope.editData);
              }
            }
          });
        }else {
          personSave($scope.editData);
        }
      };
      var personSave = function (editData) {
        userUIService.modifyUser(editData, function (userData) {
          if (userData.code == 0) {
            $scope.userInfo.loginName = $scope.selectLoginName;
            growl.success("保存成功", {});
          } else {
            growl.error("保存失败", {});
          }
        });
      }
      //企业修改点击事件
      $scope.editEnterpriseEClick = function () {
        var entArr = {};
        entArr["enterpriseSize"] = $scope.userEdit.enterprise.enterpriseSize;
        entArr["duration"] = $scope.userEdit.enterprise.duration;
        entArr["name"] = $scope.userEdit.enterprise.name;
        entArr["enterpriseID"] = $scope.userEdit.enterpriseID;
        entArr["province"] = $scope.userEdit.enterprise.province;
        entArr["city"] = $scope.userEdit.enterprise.city;
        entArr["district"] = $scope.userEdit.enterprise.district;
        entArr["address"] = $scope.userEdit.enterprise.address;
        entArr["website"] = $scope.userEdit.enterprise.website;
        entArr["contact"] = $scope.userEdit.enterprise.contact;
        entArr["contactEmail"] = $scope.userEdit.enterprise.contactEmail ? $scope.userEdit.enterprise.contactEmail : "";
        entArr["contactPhone"] = $scope.userEdit.enterprise.contactPhone ? $scope.userEdit.enterprise.contactPhone : "";
        console.log("Arr---" + JSON.stringify(entArr));
        userEnterpriseService.modifyEnterpriseInfo(entArr, function (userData) {
          if (userData.code == 0) {
            userLoginUIService.user.enterprise = userData.data;
            growl.success("保存成功", {});
          } else {
            growl.error("保存失败", {});
          }
        });
      };
      $rootScope.indexShow = false;
      $rootScope.personalShow = true;
    }
  ]);
});