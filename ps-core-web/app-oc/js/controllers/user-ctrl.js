define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('UserListCtrl', ['$scope','ngDialog', 'userInitService', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function ($scope,ngDialog, userInitService, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      $scope.userSearch = {};
      $scope.domainListTree = [];
      $scope.domainUser = "";
      $scope.domainListDic = {};
      $scope.tab = "user";//默认显示用户管理
      $scope.userManager = userLoginUIService.user;
      $scope.queryDitem = {"state":""};
      var initEvent = function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var aname = $(e.target).attr("name");
          if (aname == "user") {
            $scope.addUserName = "新建用户";
            $scope.$broadcast(Event.USERINFOSINIT, $scope.userGridData);
          } else if (aname == "role") {
            $scope.addUserName = "新建角色";
            $scope.$broadcast(Event.CURRENTINFOSINIT, $scope.currentGridData);
          }
          $scope.tab = aname;
          $scope.$apply();
        });
      }
      $scope.associateUserList = "";
      $scope.functionRoleName = "";
      $scope.functionData = "";
      $scope.roleId = "";
      $scope.roleArr = {
        "roleName": "",
        "description": "",
        "domainID": "",
        "domainPath": "",
        "roleID": ""
      }
      //初始化查询条件的域选择
      var domainTreeQuery = function () {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function (data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          $scope.getDBdata({});
        });
      };
      $scope.dialog = function (userID) {
        $scope.treeUserId = userID ;
        ngDialog.open({
          template: 'partials/roleAllot.html',
          showClose: false,
          controller: 'RoleAllotCtrl',
          bodyClassName:"bg-transparent",
          width: "600px",
          scope: $scope,
          closeByDocument: false,
          appendClassName: "ngdialog-updata-bg",
          className: 'ngdialog-theme-plain'
        });
      };
      $scope.dialogFun = function (role) {
        $scope.roleFunction = role;
        $scope.functionRoleName = "1010";
        ngDialog.open({
          template: 'partials/functionAllot.html',
          showClose: false,
          controller: 'FunctionAllotCtrl',
          width: "600px",
          scope: $scope,
          closeByDocument: false,
          appendClassName: "ngdialog-updata-bg",
          className: 'ngdialog-theme-plain'
        });
      };
      $scope.dialogUser = function (role) {
        $scope.roleUser = role;
        ngDialog.open({
          template: 'partials/userAllot.html',
          showClose: false,
          controller: 'userAllotCtrl',
          width: "600px",
          scope: $scope,
          closeByDocument: false,
          appendClassName: "ngdialog-updata-bg",
          className: 'ngdialog-theme-plain'
        });
      };
      $scope.functionGridData = {
        columns: [{
          title: "操作",
          orderable: false,
          data: "option"
        }, {
          title: "名称",
          data: "name"
        }, {
          title: "描述",
          data: "description"
        }],
        columnDefs: [{
          "targets": 0,
          "data": "option",
          "render": function (data, type, full) {
            // 返回自定义内容
            return '<i class="fa fa-plus-circle" id="circle-1" style="color:#1bb6e1;"></i>'
          }
        }]
      }
      $scope.domainGridData = {
        columns: [{
          title: "",
          orderable:false,
          data: "option"
        }, {
          title: "名称",
          data: "name"
        }, {
          title: "描述",
          data: "description"
        }],
        columnDefs: [{
          "targets": 0,
          "data": "option",
          "render": function (data, type, full) {
            // 返回自定义内容
            return '<i class="fa fa-plus-circle" id="circle-1" style="color:#1bb6e1;"></i>'
          }
        }]
      }
      //用户管理
      $scope.userGridData = {};
      //角色管理
      $scope.currentGridData = {};
      $scope.userRoleOdd = function () {
        var userStatus = $scope.functionRoleName;
        if (userStatus == "001") {
          $scope.userInfoId = [];
          var userRole = $scope.currentGridData.data;
          for (var i in userRole) {
            if (userRole[i].domainID == 1003) {
              $scope.userInfoId.push(userRole[i].roleID);
            }
          }
          userRoleUIService.addRole2User($scope.roleId, $scope.userInfoId, function (resultObj) {
            if (resultObj.code == 0) {
              growl.success("角色分配成功", {});
              $scope.functionRoleName = "0";
            } else {
              growl.warning("角色分配失败!", {});
            }
          });
        } else if (userStatus == "002") {
          $scope.userInfoId = [];
          var userRole = $scope.userGridData.data;
          for (var i in userRole) {
            if (userRole[i].check == 1001) {
              $scope.userInfoId.push(userRole[i].userID);
            }
          }
          userRoleUIService.addUser2Role($scope.userInfoId, $scope.roleId, function (resultObj) {
            if (resultObj.code == 0) {
              growl.success("用户分配成功", {});
              $scope.functionRoleName = "";
            } else {
              growl.warning("用户分配失败!", {});
            }
          });
        } else if (userStatus == "003") {
          // var userRoleId = "";
          $scope.userInfo = [];
          for (var p in $scope.domainGridData.baseNode) {
            if ($scope.domainGridData.baseNode[p]) {
              for (var d in $scope.domainGridData.baseList) {
                if (p == $scope.domainGridData.baseList[d].domainID) {
                  $scope.userInfo.push($scope.domainGridData.baseList[d]);
                }
              }
            }
          }
          userDomainService.addDomain2User($scope.userInfo, $scope.roleId, function (resultObj) {
            if (resultObj.code == 0) {
              growl.success("域分配成功", {});
              $scope.functionRoleName = "";
            } else {
              growl.warning("域分配失败!", {});
            }
          });
        } else if (userStatus == "1010") {
          $scope.userInfo = [];
          var treeObj = $.fn.zTree.getZTreeObj("roleTree");
          var nodes = treeObj.getCheckedNodes(true);
          if (nodes) {
            for (var p in nodes) {
              $scope.userInfo.push(nodes[p].functionCode);
            }
            userFunctionService.addFunction2Role($scope.roleFunction.roleID, $scope.userInfo, function (resultObj) {
              if (resultObj.code == 0) {
                growl.success("功能分配成功", {});
                $scope.functionRoleName = "";
                $scope.closeDialog();
              } else {
                growl.warning("功能分配失败!", {});
                $scope.closeDialog();
              }
            });
          }
        }
      };
      //这个是有弹出框的保存操作
      $scope.allClick = function () {
        var userStatus = $scope.functionRoleName;
        if (userStatus == "002") {
          if ($("input[name='allBox_002']").is(':checked')) {
            angular.forEach($scope.associateUserList, function (value, key) {
              if (value.manageCheck != 2001) {
                value.isEdit = "1001";
              }
            });
          } else {
            angular.forEach($scope.associateUserList, function (value, key) {
              if (value.manageCheck != 2001) {
                value.isEdit = "";
              }
            });
          }
        } else if (userStatus == "001") {
          if ($("input[name='allBox_001']").is(':checked')) {
            angular.forEach($scope.userAllRoleList, function (value, key) {
              value.domainID = "1003";
            });
          } else {
            angular.forEach($scope.userAllRoleList, function (value, key) {
              if (value.roleID != 102) {
                value.domainID = "";
              }
            });
          }
        }
      };
      //给角色添加用户
      $scope.functionOdd = function () {
        var userRoleId = "";
        $scope.userInfo = [];
        $("input[name='allFun']").each(function () {
          if ($(this).is(':checked')) {
            userRoleId += $(this).val() + ",";
            $scope.userInfo.push($(this).val());
          }
        });
        userRoleUIService.addUser2Role($scope.userInfo, $scope.roleId, function (resultObj) {
          if (resultObj.code == 0) {
            growl.success("角色分配成功", {});
            $scope.functionRoleName = "";
          } else {
            growl.warning("角色分配失败!", {});
          }
        });
      };

      //添加用户操作
      $scope.addUser = function(){
        ngDialog.open({
          template: 'addUser',
          showClose: false,
          width: "600px",
          scope: $scope,
          appendClassName: "ngdialog-updata-bg",
          className: 'ngdialog-theme-plain'
        });
      }
      $scope.closeTable = function () {
        $scope.functionRoleName = "0";
      }
      $scope.doActiveHanddler = function(select, callback,status) {
        userInitService.deleteInitUser(select.userID, function (resultObj) {
          if(resultObj.code == 0) {
            if(status == "del"){
              growl.warning("删除用户成功!", {});
              callback(true);
            }else{
              callback(true);
            }
          }
        });
      };
      $scope.doActivePwd = function(select, callback,status) {
        if (select.emailAddress == "" || select.emailAddress == null) {
          userUIService.sendSMSPassword(select.mobilePhone, function (resultObj) {
            if (resultObj.code == 0) {
              if(status == "pwd"){
                growl.warning("重置密码成功,请查收", {});
                callback(true);
              }else{
                callback(true);
              }
            }
          });
        } else {
          userUIService.sendModifyPassword(select.emailAddress, function (resultObj) {
            if (resultObj.code == 0) {
              if(status == "pwd"){
                growl.warning("重置密码成功,请查收", {});
                callback(true);
              }else{
                callback(true);
              }
            }
          });
        }
      };
      $scope.doAction = function (type, select,callback) {
        if (type == "save") {
          if (select.userID == null) {
            if (select.userType == 3 || select.userType == 2) {
              var selectDomain = "";
              for (var b in $scope.domainUser) {
                if (select.domainPath == $scope.domainUser[b].domainPath) {
                  selectDomain = $scope.domainUser[b];
                  break;
                }
              }
              if (select.userEmalStatus == "email") {
                select.emailAddress = select.userEmail;
                select.mobilePhone = "";
              } else if (select.userEmalStatus == "phone") {
                select.mobilePhone = select.userEmail;
                select.emailAddress = "";
              }
              select.userName = $.trim(select.userName);
              userUIService.enterpriseUserRegister(select, $scope.domainListDic[selectDomain.domainID], [], function (returnObj) {
                if (returnObj.code == 0) {
                  for (var i in $scope.userGridData.data) {
                    if ($scope.userGridData.data[i].userID == null) {
                      $scope.userGridData.data[i] = returnObj.data;
                      if (returnObj.data.userType == 3)
                        $scope.userGridData.data[i].userTypeLabel = "管理员";
                      else if (returnObj.data.userType == 2)
                        $scope.userGridData.data[i].userTypeLabel = "普通用户";
                      else if (returnObj.data.userType == 4)
                        $scope.userGridData.data[i].userTypeLabel = "终端用户";
                      $scope.userGridData.data[i].isEdit = 0;
                      if ($scope.userGridData.data[i].emailAddress == null || $scope.userGridData.data[i].emailAddress == "") {
                        $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].mobilePhone;
                      } else {
                        $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].emailAddress;
                      }
                      break;
                    }
                    if ($scope.userGridData.data[i].emailAddress == null || $scope.userGridData.data[i].emailAddress == "") {
                      $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].mobilePhone;
                    } else {
                      $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].emailAddress;
                    }
                  }
                  $scope.userGridData.addData = 'marking';

                  callback(returnObj.data);
                  growl.success("新增用户成功", {});
                } else {
                  callback(false);
                }
              });
            } else if (select.userType == 4) {
              if (select.userEmalStatus == "email") {
                select.emailAddress = select.userEmail;
                select.mobilePhone = "";
              } else if (select.userEmalStatus == "phone") {
                select.mobilePhone = select.userEmail;
                select.emailAddress = "";
              }
              userUIService.enterpriseIndividualRegister(select, userLoginUIService.user.enterprise, function (returnObj) {
                if (returnObj.code == 0) {
                  for (var i in $scope.userGridData.data) {
                    if ($scope.userGridData.data[i].userID == null) {
                      $scope.userGridData.data[i] = returnObj.data;
                      if (returnObj.data.userType == 2)
                        $scope.userGridData.data[i].userTypeLabel = "管理员";
                      else if (returnObj.data.userType == 3)
                        $scope.userGridData.data[i].userTypeLabel = "普通用户";
                      else if (returnObj.data.userType == 4)
                        $scope.userGridData.data[i].userTypeLabel = "终端用户";
                      $scope.userGridData.data[i].isEdit = 0;
                      if ($scope.userGridData.data[i].emailAddress == null || $scope.userGridData.data[i].emailAddress == "") {
                        $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].mobilePhone;
                      } else {
                        $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].emailAddress;
                      }
                      break;
                    }
                  }
                  $scope.userGridData.addData = 'marking';
                  growl.success("新增用户成功", {});
                  callback(returnObj.data);
                }else{
                  callback(false);
                }
              });
            }
          } else if (select.userID) {
            select.userName = $.trim(select.userName);
            userUIService.modifyUser(select, function (resultObj) {
              if (resultObj.code == 0) {
                for (var i in $scope.userGridData.data) {
                  if (select.userID == $scope.userGridData.data[i].userID) {
                    $scope.userGridData.data[i] = resultObj.data;
                    // $scope.userGridData.data[i].userTypeLabel = resultObj.data.userType == 2 ? "普通用户" : "管理员";
                    if ($scope.userGridData.data[i].userType == 3)
                      $scope.userGridData.data[i].userTypeLabel = "管理员";
                    else if ($scope.userGridData.data[i].userType == 2)
                      $scope.userGridData.data[i].userTypeLabel = "普通用户";
                    else if ($scope.userGridData.data[i].userType == 4)
                      $scope.userGridData.data[i].userTypeLabel = "终端用户";
                    $scope.userGridData.data[i].isEdit = 0;
                    if ($scope.userGridData.data[i].emailAddress == null || $scope.userGridData.data[i].emailAddress == "") {
                      $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].mobilePhone;
                    } else {
                      $scope.userGridData.data[i]["userEmail"] = $scope.userGridData.data[i].emailAddress;
                    }
                    break;
                  }
                }
                growl.success("修改用户成功", {});

                callback(true);
              }else {
                callback(false);
              }
            });
          }
        } else if (type == "delete") {
          if (userLoginUIService.user.userID == select.userID) {
            growl.warning("不能操作自己账号!", {});
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认要删除该用户',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                $scope.doActiveHanddler(select, callback,"del");
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (type == "modifyRole") {
          $scope.roleArr.roleName = stripscript(select.roleName);
          $scope.roleArr.description = stripscript(select.description);
          $scope.roleArr.roleID = select.roleID;
          userRoleUIService.modifyRole($scope.roleArr, function (data) {
            if (data.code == 0) {
              for (var i in $scope.currentGridData.data) {
                $scope.currentGridData.data[i]["isEdit"] = 0;
                if ($scope.currentGridData.data[i].roleID == select.roleID)
                  $scope.currentGridData.data[i] = data.data;
              }
              growl.success("修改角色成功", {});
              callback(true);
            } else {
              growl.warning("修改角色失败!", {});
            }
          });
        } else if (type == "resetPwd") {
          if (userLoginUIService.user.userID == select.userID) {
            growl.warning("不能重置自己密码!", {});
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '是否要重置该用户密码',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                $scope.doActivePwd(select, callback,"pwd");
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (type == "addRole") {
          if (select.roleID == null) {
            for (var j in $scope.currentGridData.data) {
              if ($scope.currentGridData.data[j].roleID != null && $scope.currentGridData.data[j].roleName == select.roleName) {
                growl.warning("角色名称已存在!", {});
                return;
              }
            }
            $scope.roleArr.domainID = userLoginUIService.user.domainID;
            $scope.roleArr.domainPath = userLoginUIService.user.domainPath;
            $scope.roleArr.roleName = $.trim(select.roleName);
            $scope.roleArr.description = $.trim(select.description);
            userRoleUIService.addRole($scope.roleArr, function (data) {
              if (data.code == 0) {
                for (var i in $scope.currentGridData.data) {
                  if ($scope.currentGridData.data[i].roleId == null) {
                    $scope.currentGridData.data[i] = data.data;
                    break;
                  }
                }
                growl.success("新增角色成功", {});
                callback(data.data);
              } else {
                callback(false);
              }
            });
          } else {
            for (var j in $scope.currentGridData.data) {
              if ($scope.currentGridData.data[j].roleID != select.roleID && $scope.currentGridData.data[j].roleName == select.roleName) {
                growl.warning("角色名称已存在!", {});
                return;
              }
            }
            $scope.roleArr.roleID = select.roleID;
            $scope.roleArr.roleName = $.trim(select.roleName);
            $scope.roleArr.description = $.trim(select.description);
            userRoleUIService.modifyRole($scope.roleArr, function (data) {
              if (data.code == 0) {
                for (var i in $scope.currentGridData.data) {
                  if ($scope.currentGridData.data[i].roleID == select.roleID)
                    $scope.currentGridData.data[i] = data.data;
                }
                callback(true);
                growl.success("修改角色成功", {});
              }else {
                callback(false);
              }
            });
          }
        } else if (type == "allotUserRole") {//给用户分配角色列表
          // if (select.roleID != 102) {
          userRoleUIService.getAssociateRole2User({
            "roleID": select.roleID
          }, function (data) {
            if (data.code == 0) {
              $scope.functionRoleName = "002";
              $scope.roleId = select.roleID;
              for (var i in $scope.userGridData.data) {
                $scope.userGridData.data[i]["check"] = "";
                if ($scope.userGridData.data[i].userID == null) {
                  $scope.userGridData.data.splice(i, 1);
                }
                for (var j in data.data) {
                  if ($scope.userGridData.data[i].userID == data.data[j].userID) {
                    $scope.userGridData.data[i].check = 1001;
                  }
                }
                $scope.$broadcast(Event.CURRENTINFOSINIT + "_userRole", $scope.userGridData);
              }
            }
          })
        } else if (type == "domainUserRole") {
          if (userLoginUIService.user.userID == select.userID) {
            growl.warning("不能操作自己账号!", {});
            return;
          }
          $scope.roleId = select.userID;
          $scope.functionRoleName = "003";
          var test1 = [];
          var initTreeview = function (obj, baseNode) {
            if (obj.domains) {
              obj.nodes = [];
              for (var i in obj.domains) {
                obj.nodes.push(initTreeview(obj.domains[i], baseNode));
              }
              obj.tags = [obj.nodes.length]
            }
            if (obj.belong == 1) {
              if (obj.domainPath == select.domainPath) {
                obj.state = {
                  disabled: true,
                  expanded: true,
                  checked: true
                }
              } else {
                obj.state = {
                  expanded: true,
                  checked: true
                }
              }
              baseNode[obj.domainID] = true;
            } else {
              obj.state = {
                expanded: true,
                checked: false
              }
              baseNode[obj.domainID] = false;
            }
            // obj.text = obj.name;
            obj.text = obj.name;
            if (obj.name != "") {
              test1.push(obj);
            }
            return obj;
          }
          userDomainService.queryDomainTreeByUser(select.userID, function (data) {
            if (data.code == 0) {
              var baseNode = {};
              var newObj = {
                parentID: "",
                domainPath: "",
                name: "",
                description: "",
                domains: data.data
              }
              $scope.functionData = newObj;
              var menu_list = initTreeview(newObj, baseNode);
              $scope.domainGridData.data = newObj.domains;
              $scope.domainGridData.treeData = menu_list.nodes;
              $scope.domainGridData.baseNode = baseNode;
              $scope.domainGridData.baseList = test1;
              $scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainGridData);
            }
          })
          $("html,body").animate({scrollTop: 1000}, 500);
        } else if (type == "roleUserRole") {
          if (userLoginUIService.user.userID == select.userID) {
            growl.warning("不能操作自己账号!", {});
            return;
          }
          userRoleUIService.queryRoleByUser(select.userID, function (data) {
            if (data.code == 0) {
              $scope.functionRoleName = "001";
              $scope.roleId = select.userID;
              for (var i in $scope.currentGridData.data) {
                $scope.currentGridData.data[i].domainID = "";
                for (var j in data.data) {
                  if ($scope.currentGridData.data[i].roleID == data.data[j].roleID) {
                    $scope.currentGridData.data[i].domainID = 1003;
                  }
                }
                //$scope.userAllRoleList = $scope.currentGridData.data;
                $scope.$broadcast(Event.CURRENTINFOSINIT + "_roleUser", $scope.currentGridData);
              }
              $("html,body").animate({scrollTop: 1000}, 500);
            }
          })
        } else if (type == "funRole") {
          // if (select.roleID != 100 && select.roleID != 102) {
          $scope.roleId = select.roleID;
          $scope.treeData = [];
          $scope.functionRoleName = "1010";
          var initTreeview = function (obj, baseNode) {
            if (obj.function) {
              obj.nodes = [];
              for (var i in obj.function) {
                obj.nodes.push(initTreeview(obj.function[i], baseNode));
              }
            }
            obj.id = obj.functionCode;
            obj.pId = obj.parentCode;
            obj.open = true;
            if (obj.belong == 1) {
              obj.checked = true;
            }
            if (obj.name) {

              $scope.treeData.push(obj);
              // $scope.treeDataList.push(obj);
              //arr.push(obj)
            }
            return obj;
          }
          if ((userLoginUIService.user.userID != 1) && (select.roleID == 100 || select.roleID == 102 || select.roleID == 1000 || select.roleID == 101 || select.roleID == 103)) {
            $scope.functionGridData.statusCheck =false;//控制保存按钮显示不显示
            userFunctionService.queryFunction2Role(select.roleID, function (data) {
              if (data.code == 0 && data.data.length > 0) {
                  var newObj = {
                    parentID: "",
                    domainPath: "",
                    name: "",
                    description: "",
                    function: data.data
                  }
                  var baseNode = {};
                  var menu_list = initTreeview(newObj, baseNode);
                  var setting = {
                    view: {
                      showIcon: false
                    },
                    data: {
                      simpleData: {
                        enable: true
                      }
                    }
                  };
                  $scope.functionGridData.data = $scope.treeData;
                  $scope.functionGridData.setting = setting;
                  $scope.$broadcast(Event.FUNCTIONINFOSINIT+"_ztree", $scope.functionGridData);
                  $("html,body").animate({scrollTop: 1000}, 500);
              }
            })
          }else{
            $scope.functionGridData.statusCheck =true;//控制保存按钮显示不显示
            userFunctionService.queryAllFunctionByUser(userLoginUIService.user.userID, select.roleID, function (data) {
              if (data.code == 0 && data.data.length > 0) {
                var newObj = {
                  parentID: "",
                  domainPath: "",
                  name: "",
                  description: "",
                  function: data.data
                }
                $scope.functionData = newObj;
                var baseNode = {};
                var menu_list = initTreeview(newObj, baseNode);
                var setting = {
                  view: {
                    showIcon: false
                  },
                  check: {
                    enable: true
                  },
                  data: {
                    simpleData: {
                      enable: true
                    }
                  }
                };
                $scope.functionGridData.data = $scope.treeData;
                $scope.functionGridData.setting = setting;
                $scope.$broadcast(Event.FUNCTIONINFOSINIT+"_ztree", $scope.functionGridData);
                $("html,body").animate({scrollTop: 1000}, 500);
              }
            })
          }
        } else if (type == "deleteRole") {
          if (select.roleID == 102 || select.roleID == 100 || select.roleID == 101 || select.roleID == 2000 || select.roleID == 2001) {
            growl.warning("此角色不能删除!", {});
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认要删除该角色？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                $scope.delectRole = {
                  "roleID": select.roleID
                };
                userRoleUIService.deleteRole($scope.delectRole, function (data) {
                  if (data.code == 0) {
                    growl.warning("删除角色成功", {});
                    $scope.functionRoleName = "0";
                    callback(true);
                  } else {
                    growl.warning("删除角色失败", {});
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                dialogRef.close();
              }
            }]
          });
        }
      }

      //数据初始化
      $scope.getDBdata = function () {
        //查询用户域
        // userEnterpriseService.queryEnterpriseDomain(function (returnObj) {
        //   if (returnObj.code == 0) {
        //     $scope.enterpriseDomain = returnObj.data;
            //当前域下用户
            userEnterpriseService.queryEnterpriseUser(function (resultObj) {
              if (resultObj.code == 0) {
                for (var i in resultObj.data) {
                  var obj = resultObj.data[i];
                  obj.isEdit = 0;
                  // obj.userTypeLabel = obj.userType == 2 ? "普通用户" : "管理员";
                  if (obj.userType == 3)
                    obj.userTypeLabel = "管理员";
                  else if (obj.userType == 2)
                    obj.userTypeLabel = "普通用户";
                  else if (obj.userType == 4)
                    obj.userTypeLabel = "终端用户";
                  if (obj.emailAddress == null || obj.emailAddress == "") {
                    obj["userEmail"] = obj.mobilePhone;
                  } else {
                    obj["userEmail"] = obj.emailAddress;
                  }
                }
                $scope.userGridData.data = resultObj.data;
                $scope.$broadcast(Event.USERINFOSINIT, $scope.userGridData);
              }
            });
        //   }
        // });
        //查询企业角色
        userEnterpriseService.queryEnterpriseRole(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              if (!returnObj.data[i] || returnObj.data[i] == '' || returnObj.data[i] == null) {
                returnObj.data.splice(i, 1);
              }
            }
            $scope.currentGridData.data = returnObj.data;
            // $scope.$broadcast(Event.CURRENTINFOSINIT, $scope.currentGridData);
          }
        });
        userDomainService.queryDomainByUser(userLoginUIService.user.userID, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.domainUser = returnObj.data;
          }
        });
      }
      //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            initEvent();
            domainTreeQuery();
          }
        });
      } else {
        initEvent();
        domainTreeQuery();
      }
    }
  ]);
  controllers.initController('FunctionAllotCtrl', ['$scope', '$rootScope','ngDialog', '$routeParams', 'userInitService', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService',
    function ($scope,$rootScope,ngDialog,$routeParams, userInitService, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService) {
      console.log("treeUserId==="+$scope.roleFunction);
      $scope.role = $scope.roleFunction;
      var select = $scope.roleFunction;
      $scope.treeData = [];

      if($scope.role){
        var initTreeview = function (obj, baseNode) {
          if (obj.function) {
            obj.nodes = [];
            for (var i in obj.function) {
              obj.nodes.push(initTreeview(obj.function[i], baseNode));
            }
          }
          obj.id = obj.functionCode;
          obj.pId = obj.parentCode;
          // obj.open = true;
          if (obj.belong == 1) {
            obj.checked = true;
          }
          if (obj.name) {

            $scope.treeData.push(obj);
            // $scope.treeDataList.push(obj);
            //arr.push(obj)
          }
          return obj;
        }
        if ((userLoginUIService.user.userID != 1) && (select.roleID == 100 || select.roleID == 102 || select.roleID == 1000 || select.roleID == 101 || select.roleID == 103)) {
          $scope.functionGridData.statusCheck =false;//控制保存按钮显示不显示
          userFunctionService.queryFunction2Role(select.roleID, function (data) {
            if (data.code == 0 && data.data.length > 0) {
              var newObj = {
                parentID: "",
                domainPath: "",
                name: "",
                description: "",
                function: data.data
              }
              var baseNode = {};
              var menu_list = initTreeview(newObj, baseNode);
              var setting = {
                view: {
                  showIcon: false
                },
                data: {
                  simpleData: {
                    enable: true
                  }
                }
              };
              $scope.functionGridData.data = $scope.treeData;
              $scope.functionGridData.setting = setting;
              $scope.$broadcast(Event.FUNCTIONINFOSINIT+"_ztree", $scope.functionGridData);
            }
          })
        }else{
          $scope.functionGridData.statusCheck =true;//控制保存按钮显示不显示
          userFunctionService.queryAllFunctionByUser(userLoginUIService.user.userID, select.roleID, function (data) {
            if (data.code == 0 && data.data.length > 0) {
              var newObj = {
                parentID: "",
                domainPath: "",
                name: "",
                description: "",
                function: data.data
              }
              $scope.functionData = newObj;
              var baseNode = {};
              var menu_list = initTreeview(newObj, baseNode);
              var setting = {
                view: {
                  showIcon: false
                },
                check: {
                  enable: true
                },
                data: {
                  simpleData: {
                    enable: true
                  }
                }
              };
              $scope.functionGridData.data = $scope.treeData;
              $scope.functionGridData.setting = setting;
              $scope.$broadcast(Event.FUNCTIONINFOSINIT+"_ztree", $scope.functionGridData);
            }
          })
        }
      }
    }
  ]);
  controllers.initController('RoleAllotCtrl', ['$scope', '$rootScope','ngDialog', '$routeParams', 'userInitService', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function ($scope,$rootScope,ngDialog,$routeParams, userInitService, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {

      console.log("treeUserId==="+$scope.treeUserId);
      var id = $scope.treeUserId;
      $scope.userObj = {};
      $scope.domainGridData = {
        columns: [{
          title: "",
          orderable: false,
          data: "option"
        }, {
          title: "名称",
          data: "name"
        }, {
          title: "描述",
          data: "description"
        }],
        columnDefs: [{
          "targets": 0,
          "data": "option",
          "render": function (data, type, full) {
            // 返回自定义内容
            return '<i class="fa fa-plus-circle" id="circle-1" style="color:#1bb6e1;"></i>'
          }
        }]
      }
      if(id){
        userUIService.queryUser(id,function (res) {
          if(res.code == 0){
            $scope.userObj = res.data;
            domainInit();
          }
        });
      }
      var domainInit =  function () {
        if(id){
          var test1 = [];
          var initTreeview = function (obj, baseNode) {
            if (obj.domains) {
              obj.nodes = [];
              for (var i in obj.domains) {
                obj.nodes.push(initTreeview(obj.domains[i], baseNode));
              }
              obj.tags = [obj.nodes.length]
            }
            if (obj.belong == 1) {
              if (obj.domainPath == $scope.userObj.domainPath) {
                obj.state = {
                  disabled: true,
                  expanded: true,
                  checked: true
                }
              } else {
              obj.state = {
                expanded: true,
                checked: true
              }
              }
              baseNode[obj.domainID] = true;
            } else {
              obj.state = {
                expanded: true,
                checked: false
              }
              baseNode[obj.domainID] = false;
            }
            // obj.text = obj.name;
            obj.text = obj.name;
            if (obj.name != "") {
              test1.push(obj);
            }
            return obj;
          }
          userDomainService.queryDomainTreeByUser(id, function (data) {
            if (data.code == 0) {
              var baseNode = {};
              var newObj = {
                parentID: "",
                domainPath: "",
                name: "",
                description: "",
                domains: data.data
              }
              $scope.functionData = newObj;
              var menu_list = initTreeview(newObj, baseNode);
              $scope.domainGridData.data = newObj.domains;
              $scope.domainGridData.treeData = menu_list.nodes;
              $scope.domainGridData.baseNode = baseNode;
              // $scope.domainGridData.baseList = test1;
              $scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainGridData);
            }
          })
        }
      }
    }
  ]);
  controllers.initController('userAllotCtrl', ['$scope', '$rootScope','ngDialog', '$routeParams', 'userInitService', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService',
    function ($scope,$rootScope,ngDialog,$routeParams, userInitService, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService) {
      var select = $scope.roleUser;
     /* if(select){
        roleUser();
      }*/
      // var roleUser = function () {
        userRoleUIService.getAssociateRole2User({
          "roleID": select.roleID
        }, function (data) {
          if (data.code == 0) {
            $scope.roleId = select.roleID;
            for (var i in $scope.userGridData.data) {
              $scope.userGridData.data[i]["check"] = "";
              if ($scope.userGridData.data[i].userID == null) {
                $scope.userGridData.data.splice(i, 1);
              }
              for (var j in data.data) {
                if ($scope.userGridData.data[i].userID == data.data[j].userID) {
                  $scope.userGridData.data[i].check = 1001;
                }
              }
            }
            $scope.$broadcast(Event.CURRENTINFOSINIT + "_userRole", $scope.userGridData);
          }
      // }
      })
    }
  ]);
  controllers.initController('SuperListCtrl', ['$scope', 'userLoginUIService', 'userEnterpriseService', 'userUIService','configUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService','resourceUIService',
    function ($scope, userLoginUIService, userEnterpriseService, userUIService, configUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService,resourceUIService) {

      $scope.userTypeAry = {};
      $scope.configGroupsDic = {};
      //用户管理
      $scope.userGridData = {
        columns: [{
          title: "企业名称",
          data: "enterpriseName"
        }, {
          title: "用户编码",
          data: "userID"
        }, {
          title: "用户类型",
          data: "userTypeLabel"
        }, {
          title: "用户名称",
          data: "userName"
        }, {
          title: "登录名",
          data: "loginName"
        }, {
          title: "登录账户（手机/邮箱）",
          data: "userEmail"
        }, {
          title: "办公电话",
          data: "officePhone"
        }, $.ProudSmart.datatable.optionCol3],
        columnDefs: [{
          "targets": 7,
          "data": "option",
          "render": function (data, type, full) {
            // 返回自定义内容
            return "<a id='save-btn' class='btn btn-default btn-sm' ><span class='hidden-xs'> 切换登录</span></a>"
          }
        }]
      }
      $scope.loginin = function (loginId) {
        userLoginUIService.loginin(loginId, function (returnObj) {
          if (returnObj.code == 0) {
            location.href = "";
            //location.href = location.origin;
          }
        });
      }
      
      var getDBdata = function () {
        //查询用户域
        var domainHandler = function (returnObj) {
          if (returnObj.code == 0) {
            $scope.enterpriseDomain = returnObj.data;
          }
        };
        if (!$scope.menuitems["isloaded"]) {
          var menuitemsWatch = $scope.$watch('menuitems', function(o, n) {
            if ($scope.menuitems["isloaded"]) {
              if ($scope.baseConfig.extendDomain) {
                resourceUIService.getDomainsByFilter({},domainHandler);
              } else {
                userEnterpriseService.findEnterpriseDomain(domainHandler);
              }
              menuitemsWatch();
            }
          },true)
        } else if ($scope.baseConfig.extendDomain) {
          resourceUIService.getDomainsByFilter({},domainHandler);
        } else {
          userEnterpriseService.findEnterpriseDomain(domainHandler);
        }

        //当前域下用户
        userUIService.querAllUserInfo(function (resultObj) {
          if (resultObj.code == 0) {
            for (var i in resultObj.data) {
              var obj = resultObj.data[i];
              obj.isEdit = 0;
              if($scope.userTypeAry && $scope.userTypeAry[obj.userType] != undefined){
                obj.userTypeLabel = $scope.userTypeAry[obj.userType].label;
              }else{
                if (obj.userType == 3){
                  obj.userTypeLabel = "管理员";
                }else if (obj.userType == 2){
                  obj.userTypeLabel = "普通用户";
                }else if (obj.userType == 4){
                  obj.userTypeLabel = "终端用户";
                }else if (obj.userType == 300){
                  obj.userTypeLabel = "企业";
                }else if (obj.userType == 301){
                  obj.userTypeLabel = "客户";
                }else if (obj.userType == 302){
                  obj.userTypeLabel = "项目";
                }else if (obj.userType == 10){
                  obj.userTypeLabel = "企业管理员";
                }else{
                  obj.userTypeLabel = "未知";
                }
              }

              if (obj.emailAddress == null || obj.emailAddress == "") {
                obj["userEmail"] = obj.mobilePhone;
              } else {
                obj["userEmail"] = obj.emailAddress;
              }
              if (obj.enterprise) {
                // for (var l in obj.enterprise) {
                  obj["enterpriseName"] = obj.enterprise.name;
                // }
              } else {
                obj["enterpriseName"] = "";
              }
            }
            $scope.userGridData.data = resultObj.data;
            $scope.$broadcast(Event.USERINFOSINIT + "_super", $scope.userGridData);
          }
        });
      };
      //获取所有的全局配置
      var configList = function() {
        configUIService.getAllConfigs(function(returnObj){
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.configGroupsDic[item.groupName] = item;
            });
            $scope.configGroups = returnObj.data;
            if(returnObj.data.length > 0 && $scope.configGroupsDic["UserType"] != undefined && $scope.configGroupsDic["UserType"].value){
              var userType = eval("(" + $scope.configGroupsDic["UserType"].value + ")");
              userType.forEach(function(user) {
                $scope.userTypeAry[user.typeCode] = user;
              });
            }
            getDBdata();
          }
        });
      };
      //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            configList();
          }
        });
      } else {
        configList();
      }
    }
  ]);
  controllers.initController('addEnterpriseCtrl', ['$scope', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'solutionUIService', 'userFunctionService', 'userDomainService', 'resourceUIService',
    function ($scope, userLoginUIService, userEnterpriseService, userUIService, growl, solutionUIService, userFunctionService, userDomainService, resourceUIService) {
      $scope.parObj = {
        "userName": "",
        "loginName": "",
        "password": "",
        "mobilePhone": "",
        "emailAddress": "",
        "isDemo": "1",
        "industry": 444774823897601
      };
      $scope.enterpriseObj = {"name": "", "contactEmail": "", "province": "", "closingDate": "", "city": ""};
      $scope.provinces = "";
      $scope.districts = "";
      $scope.citys = "";
      $scope.configPwd = "";
      $scope.emailOnly = "";
      $scope.$watch("configPwd", function (newValue, oldValue) {
        if (newValue != $scope.parObj.password) {
          $scope.emailOnly = 4;
        } else {
          $scope.emailOnly = 0;
        }
      });
      $scope.$watch("parObj.password", function (newValue, oldValue) {
        $scope.emailOnly = 0;
      });
      var pro = function () {
        resourceUIService.getSimpleDistricts(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.provinces = returnObj.data;
            for (var i in $scope.provinces) {
              if ($scope.provinces[i].label == $scope.enterpriseObj.province) {
                if ($scope.enterpriseObj.province == '北京市' || $scope.enterpriseObj.province == '天津市' || $scope.enterpriseObj.province == '上海市' || $scope.enterpriseObj.province == '重庆市') {
                  var pro = $scope.provinces[i].children;
                  for (var n in pro) {
                    if (pro[n].label == $scope.enterpriseObj.province) {
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
              if ($scope.citys[j].label == $scope.enterpriseObj.city) {
                $scope.districts = $scope.citys[j].children;
              }
            }
          }
        });
      };
      var init = function () {
        pro();
        solutionUIService.getSolutions(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.activeedAppDatas = returnObj.data;
          }
        })
      }
      $scope.proChang = function () {
        pro();
      }
      init();
      var saveDB = function () {
        userUIService.individualUserRegister($scope.enterpriseObj, $scope.parObj, function (vv) {
          if (vv.code == 0) {
            growl.success("新建企业账号成功",{});
            location.href = "#/enterpriseMaintain";
          }
        });
      }
      $scope.savaEnterprise = function () {
        console.log("enterpriseObj++" + JSON.stringify($scope.enterpriseObj) + "parObj==" + JSON.stringify($scope.parObj));
        if ($scope.enterpriseObj.name == "" || $scope.enterpriseObj.name == null || typeof($scope.enterpriseObj.name) == "undefined") {
          growl.warning("企业名称不能为空", {});
          return;
        }
        if ($scope.enterpriseObj.province == "" || $scope.enterpriseObj.province == null || typeof($scope.enterpriseObj.province) == "undefined") {
          growl.warning("企业所在地省份不能为空", {});
          return;
        }
        if ($scope.enterpriseObj.city == "" || $scope.enterpriseObj.city == null || typeof($scope.enterpriseObj.city) == "undefined") {
          growl.warning("企业所在地城市不能为空", {});
          return;
        }
        if ($scope.parObj.userName == "" || $scope.parObj.userName == null || typeof($scope.parObj.userName) == "undefined") {
          growl.warning("申请人姓名不能为空", {});
          return;
        }
        if ($scope.parObj.mobilePhone == "" || $scope.parObj.mobilePhone == null || typeof($scope.parObj.mobilePhone) == "undefined") {
          growl.warning("申请人电话不能为空", {});
          return;
        }
        if ($scope.parObj.emailAddress == "" || $scope.parObj.emailAddress == null || typeof($scope.parObj.emailAddress) == "undefined") {
          growl.warning("申请人邮箱不能为空或者格式不对请检查", {});
          return;
        }
        if ($scope.parObj.industry == "" || $scope.parObj.industry == null || typeof($scope.parObj.industry) == "undefined") {
          growl.warning("应用方案不能为空", {});
          return;
        }
        if ($scope.parObj.loginName == "" || $scope.parObj.loginName == null || typeof($scope.parObj.loginName) == "undefined") {
          growl.warning("登录名不能为空", {});
          return;
        }
        if ($scope.parObj.password == "" || $scope.parObj.password == null || typeof($scope.parObj.password) == "undefined") {
          growl.warning("密码不能为空", {});
          return;
        }
        if ($scope.parObj.password == "" || $scope.parObj.password == null || typeof($scope.parObj.password) == "undefined") {
          $scope.emailOnly = "1002";
          return;
        }
        if ($scope.configPwd == "" || $scope.configPwd == null || typeof($scope.configPwd) == "undefined") {
          $scope.emailOnly = "1001";
          return;
        }
        if ($scope.configPwd != $scope.parObj.password) {
          $scope.emailOnly = "4";
          return;
        }
        var newData = new Date($scope.enterpriseObj.closingDate).Format("yyyy-MM-dd");
        var ckTime = checkDate(newData);
        if(ckTime == false){
          growl.warning("您选择的试用结束时间小于当前时间",{})
          return;
        }
        saveDB();
        //校验手机号码是否存在
        //userUIService.checkMobilePhone($scope.parObj.mobilePhone, function(data) {
        //  if (data.code == 0 && data.data == false) {
        //    return;
        //  }
        //})
      }
    }
  ]);
  controllers.initController('EnterpriseListCtrl', ['$scope', '$routeParams','FileUploader', 'ngDialog', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService',
    function ($scope,$routeParams, FileUploader, ngDialog, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService) {
    $scope.enterpriseObj = {};
    $scope.enterId = "";
      var uploader = $scope.uploader = new FileUploader({
        url: '' + userUIService.uploadFileUrl + '/api/rest/upload/userUIService/uploadFile'
      });
      var TEXT = {
        "SUBMIT": "确定",
        "CANCEL": "取消"
      };
      uploader.filters.push({
        name: 'customFilter',
        fn: function (item, options) {
          return this.queue.length < 10;
        }
      });
      // CALLBACKS
      uploader.onWhenAddingFileFailed = function (item, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function (fileItem) {
        var picPath = getPath(fileItem._file);
        $("#imgLook").attr('src', picPath);
      };
      uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
      };
      uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        if (response.code == 0) {
          userEnterpriseService.modifyLogo($scope.enterId, response.data, function (returnObj) {
            if (returnObj.code == 0) {
              getDBdata();
              growl.success("上传图片成功", {});
            }
          });
        }
      };
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
      };
      uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
      };
      var controller = $scope.controller = {
        isImage: function (item) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      };
      //用户管理
      $scope.userGridData = {
        columns: [{
          title: "企业ID",
          data: "enterpriseID"
        }, {
          title: "企业名称",
          data: "name"
        }, {
          title: "域路径",
          data: "domainPath"
        }, {
          title: "企业类型",
          data: "enterpriseTypeName"
        }, {
          title: "logo地址",
          data: "enterpriseLogo"
        }, {
          title: "状态",
          data: "enterpriseStatus"
        }, {
          title: "创建时间",
          data: "createTime"
        }, {
          title: "失效时间",
          data: "closingDate"
        }, {
          title: "操作",
          orderable: false,
          data: "option"
        }],
        columnDefs: [{
          "targets": 5,
          "data": "enterpriseStatus",
          "render": function (data, type, full) {
            var stat = "";
            if (full.enterpriseStatus == '0') {
              stat =  "<span class='label alerts-info'>启用</span>";
            } else {
              stat =  "<span class='label alerts-critical'>停用</span>";
            }
            return stat;
          }
        }, {
          targets: 6,
          data: "createTime",
          render: function(data, type, full) {
            // 返回自定义内容    
            var str = '';
            if (data) {
              str = useMomentFormat(data,'yyyy-MM-dd')
            }
            return str;
          }
        }, {
          targets: 7,
          data: "closingDate",
          render: function(data, type, full) {
            // 返回自定义内容    
            var str = '';
            if (data) {
              str = useMomentFormat(data,'yyyy-MM-dd')
            }
            return str;
          }
        }, {
          "targets": 8,
          "data": "option",
          "render": function (data, type, full) {
            var str = '';
            var stat1 = '';
            if (full.enterpriseStatus == '0') {
              stat1 = '停用';
            } else {
              stat1 = '启用';
            }
            str += "<div class='btn-group table-option-group' >" +
              "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
              "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
              "<span class='caret'></span>" +
              "<span class='sr-only'>Toggle Dropdown</span>" +
              "</button>" +
              "<ul class='dropdown-menu' role='menu'>" +
              "<li><a style='cursor: pointer;' id='file-txt'>上传logo文件</a></li>" +
              "<li><a style='cursor: pointer;' id='block' >" + stat1 + "</a></li>" +
              "<li><a style='cursor: pointer;' id='edit-btn'>编辑</a></li>" +	      
              "<li><a style='cursor: pointer;' id='copy-right-btn'>修改版权</a></li>" +
              "<li><a style='cursor: pointer;' id='role-btn'>角色分配</a></li>" +
              "<li><a style='cursor: pointer;' id='del-btn'>删除企业</a></li>" +
              "</ul>" +
              "</div>";
            return str;
          }
        }]
      };
      $scope.clearUserData = function (enterpriseObj) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '是否要删除企业的数据？注意，删除后不可恢复。',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function (dialogRef) {
              userUIService.clearUserData(enterpriseObj.userID, function (returnObj) {
                if (returnObj.code == 0) {
                  growl.success("企业数据删除成功",{});
                  getDBdata();
                }
              });
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function (dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
      $scope.roleEdit = function (enterprise) {
        var defRole = enterprise.defaultRole;
        var role = [];
        if(defRole){
          var sel = defRole.split(',');
          for(var i in $scope.roleList){
            var tmp = -1;
            for(var j in sel){
              if($scope.roleList[i].roleID == sel[j]){
                tmp = j;
              }
            }
            if(tmp != -1){
              $scope.roleList[i].applied = true;
            }

            if(enterprise.enterpriseType == 0 && $scope.roleList[i].roleID != 101 && $scope.roleList[i].roleID != 103){
              role.push($scope.roleList[i]);
            }else if(enterprise.enterpriseType == 1  && $scope.roleList[i].roleID != 100 && $scope.roleList[i].roleID != 102){
              role.push($scope.roleList[i]);
            }
          }
        }else{
          for(var i in $scope.roleList){
            if(enterprise.enterpriseType == 0 && $scope.roleList[i].roleID != 101 && $scope.roleList[i].roleID != 103){
              role.push($scope.roleList[i]);
            }else if(enterprise.enterpriseType == 1  && $scope.roleList[i].roleID != 100 && $scope.roleList[i].roleID != 102){
              role.push($scope.roleList[i]);
            }
          }
        }
        $scope.dialog = {
          title: "角色分配",
          titles: ['未分配角色', '已分配角色'],
          mark: "roleName",
          characters: role,
          button: [{
            label: TEXT.SUBMIT,
            icon: "btn btn-primary",
            fn: function() {
              var inx = 0;
              var rls = $scope.roleList.filter(function(elem) {
                return elem.applied == true;
              }).map(function(elem) {
                return elem.roleID;
              });
              userEnterpriseService.modifyDefaultRole(enterprise.enterpriseID, rls,function (res) {
                if(res.code == 0){
                  growl.success("角色分配成功",{});
                  ngDialog.close();
                  for(var i in $scope.userGridData.data) {
                    if($scope.userGridData.data[i].enterpriseID == res.data.enterpriseID) {
                      if (res.data.enterpriseType == 0){
                        res.data["enterpriseTypeName"] = "A企业";
                      }else if (res.data.enterpriseType == 1){
                        res.data["enterpriseTypeName"] = "B企业";
                      }
                      $scope.userGridData.data[i] = res.data;
                      break;
                    }
                  }
                  $scope.$broadcast(Event.USERINFOSINIT + "_enter", $scope.userGridData);

                }
              });
            }
          }, {
            label: TEXT.CANCEL,
            icon: "btn btn-default",
            fn: function() {
              ngDialog.close();
            }
          }]
        };
        ngDialog.open({
          template: '../partials/dialogue/character_assign_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };
      $scope.addEnterprise = function () {
        location.href = "#/addEnterprise";
      };
      $scope.modifyEnterpriseInfo = function (obj) {
        userEnterpriseService.adminModifyEnterprise(obj, function (resultObj) {
          if (resultObj.code == 0) {
            growl.success("修改企业信息成功", {});
            getDBdata();
          }
        })
      }
      $scope.editEnterprise = function (enterpriseName, enterpriseUrl, enterpriseID) {
        userEnterpriseService.modifyCopyRight(enterpriseName, enterpriseUrl, enterpriseID, function (resultObj) {
          if (resultObj.code == 0) {
            growl.success("修改企业信息成功", {});
            getDBdata();
          }
        })
      };
      $scope.blockClick = function (select) {
        var stat = '';
        if (select.enterpriseStatus == '0') {
          stat = '停用';
        } else {
          stat = '启用';
        }
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '是否要' + stat + '该企业',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function (dialogRef) {
              userEnterpriseService.modifyEnterpriseStatus(select.enterpriseID, function (resultObj) {
                if (resultObj.code == 0) {
                  growl.warning("" + stat + "企业成功!", {});
                  getDBdata();
                }
              });
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function (dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
      $scope.loginin = function (loginId) {
        userLoginUIService.loginin(loginId, function (returnObj) {
          if (returnObj.code == 0) {
            location.href = location.origin;
          }
        });
      }
      $scope.cancel = function () {
        $scope.$broadcast(Event.USERINFOSINIT + "_enter", $scope.userGridData);
      }
      $scope.roleList = [];
      var getDBdata = function () {
        //查询用户域
        userEnterpriseService.queryAllEnterprise(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              returnObj.data[i]["enterpriseTypeName"] = "";
              if (returnObj.data[i].enterpriseType == 0)
                returnObj.data[i].enterpriseTypeName = "A企业";
              else if (returnObj.data[i].enterpriseType == 1)
                returnObj.data[i].enterpriseTypeName = "B企业";
            }
            $scope.userGridData.data = returnObj.data;
            $scope.$broadcast(Event.USERINFOSINIT + "_enter", $scope.userGridData);
          }
        });
        //查询用户角色
        userEnterpriseService.queryEnterpriseRole(function (returnObj) {
          if (returnObj.code == 0) {
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              if (obj.roleID == 100 || obj.roleID == 102) {
                obj.roleName = obj.roleName + "A";
              } else if (obj.roleID == 101 || obj.roleID == 103) {
                obj.roleName = obj.roleName + "B";
              }
              newObj.push(obj);
            });

            $scope.roleList = newObj;
          }
        });
      }
      //判断用户是否存在
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            getDBdata();
          }
        });
      } else {
        getDBdata();
      }
      var getPath = function (file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      }
    }
  ]);
});