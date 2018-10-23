define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('userGroupCtrl', ['$scope', 'userInitService', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl', 'userEnterpriseService',
    function($scope, userInitService, $location, $routeParams, $timeout, userLoginUIService, Info, growl, userEnterpriseService) {
      $scope.activeListTab = "tab3";
      $scope.queryGroupList = "";
      $scope.selectedGroup = "";
      $scope.formReg = {
        'name': '',
        'desc': ''
      };
      $scope.userGroupList = {};
      $scope.userGridData = {};
      $scope.groupsAry = [];
      userEnterpriseService.queryEnterpriseGroup(function(resultObj) {
        if(resultObj.code == 0) {
          $scope.queryGroupList = resultObj.data;
          $scope.selectedGroup = resultObj.data[0];
        }
      })

      $scope.addGroup = function() {
        //if ($scope.activeListTab == 'tab3') {
        var arr = [];
        for(var i in $scope.queryGroupList) {
          var obj = $scope.queryGroupList[i];
          arr.push(obj);
          if(obj.groupID == 0) {
            growl.warning("当前有未保存用户组", {});
            return;
          }
        }
        $scope.activeListTab = 'tab3';
        var doAdd = function(newModelName) {
          var newModel = {};
          newModel.groupName = newModelName;
          newModel.groupID = 0;
          newModel.description = '';
          newModel.enterpriseID = userLoginUIService.user.enterpriseID;
          userGroupQuery(newModel.groupID);
          $scope.queryGroupList.unshift(newModel);
          $scope.selectedGroup = newModel;
        };
        doAdd('');
        //} else {
        //  growl.warning("请切换到用户组信息再进行新增操作", {});
        //}
      }

      $scope.delGroup = function() {
        if($scope.selectedGroup.groupID != 0) {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除 ' + $scope.selectedGroup.groupName + ' 吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                if($scope.selectedGroup) {
                  userInitService.deleteGroup($scope.selectedGroup.groupID, function(resultObj) {
                    if(resultObj.code == 0) {
                      var arr = [];
                      for(var i in $scope.queryGroupList) {
                        if($scope.selectedGroup.groupID != $scope.queryGroupList[i].groupID) {
                          arr.push($scope.queryGroupList[i]);
                        }
                      }
                      $scope.queryGroupList = arr;
                      growl.success("删除用户组成功", {});
                      if(arr.length > 0)
                        $scope.groupClick($scope.queryGroupList[0]);
                      else
                        $scope.selectedGroup = null;
                    } else {
                      growl.success("删除用户组失败", {});
                    }

                  })
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
        } else {
          var arr = [];
          for(var i in $scope.queryGroupList) {
            if($scope.selectedGroup.groupID != $scope.queryGroupList[i].groupID) {
              arr.push($scope.queryGroupList[i]);
            }
          }
          $scope.queryGroupList = arr;
          $scope.selectedGroup = $scope.queryGroupList[0];
          growl.success("删除用户组成功", {});
          return;
        }
      }

      /*
       *dataTable 统一处理方式
       */
      $scope.doAction = function(type, select) {
        if(type == "saveUser") {
          if(select != "" && select != null) {

            userEnterpriseService.addUser2UserGroup($scope.selectedGroup.groupID, userLoginUIService.user.enterpriseID, [select], function(resultObj) {
              if(resultObj.code == 0) {
                growl.success("添加用户到用户组成功", {});
                userGroupQuery($scope.selectedGroup.groupID);
              } else {
                growl.warning("用户已经存在该用户组中，添加失败", {});
                return;
              }
            });
          } else {
            growl.warning("请选择用户", {});
            return;
          }
        } else if(type == "removeUser") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认将用户 "' + select.userName + '"移出" ' + $scope.selectedGroup.groupName + '" 用户组吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {

                userEnterpriseService.deleteUser2UserGroup($scope.selectedGroup.groupID, [select.userID], function(resultObj) {
                  if(resultObj.code == 0) {
                    growl.success("用户组移出用户成功", {});
                    userGroupQuery($scope.selectedGroup.groupID);
                  } else {
                    growl.warning("该用户移出失败", {});
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
        } else if(type == "cancel") {
          growl.success("已取消添加用户组用户", {});
          userGroupQuery($scope.selectedGroup.groupID);
        }
      }

      $scope.saveUserGrop = function() {
        if($scope.formReg.name == 0 && $scope.formReg.desc == 0) {
          if($scope.selectedGroup.groupName == "") {
            $scope.formReg["name"] = "1000";
            return;
          }
          //if($scope.selectedGroup.description == ""){
          //    $scope.formReg["desc"] = "1001";
          //    return;
          //}
          //如果groupId等于0 进行新增操作否则进行修改操作
          if($scope.selectedGroup.groupID == 0) {
            for(var i in $scope.queryGroupList) {
              if($scope.selectedGroup.groupName == $scope.queryGroupList[i].groupName && $scope.queryGroupList[i].groupID != 0) {
                growl.warning("您输入的用户组名称已存在，请重新输入", {});
                return;
              }
            }
            $scope.selectedGroup.groupName = $.trim($scope.selectedGroup.groupName);
            $scope.selectedGroup.description = $.trim($scope.selectedGroup.description);
            userEnterpriseService.addGroup($scope.selectedGroup, function(resultObj) {
              if(resultObj.code == 0) {
                var arr = [];
                for(var i in $scope.queryGroupList) {
                  if($scope.queryGroupList[i].groupID == 0) {
                    arr.push(resultObj.data);
                    continue;
                  } else {
                    arr.push($scope.queryGroupList[i]);
                  }
                }
                $scope.queryGroupList = arr;
                $scope.groupClick(resultObj.data);
                $scope.selectedGroup = resultObj.data;
                growl.success("新增用户组成功", {});
              } else {
                growl.success("新增用户组失败", {});
              }
            })

          } else {
            for(var i in $scope.queryGroupList) {
              if($scope.queryGroupList[i].groupID != $scope.selectedGroup.groupID && $scope.selectedGroup.groupName == $scope.queryGroupList[i].groupName) {
                growl.warning("当前有重复用户组名称，请修改", {});
                return;
              }
            }
            if($scope.selectedGroup.groupName == "") {
              $scope.formReg["name"] = "1000";
              return;
            }
            $scope.selectedGroup.groupName = $.trim($scope.selectedGroup.groupName);
            $scope.selectedGroup.description = $.trim($scope.selectedGroup.description);
            userEnterpriseService.modifyGroupInfo($scope.selectedGroup, function(resultObj) {
              if(resultObj.code == 0) {
                var arr = [];
                for(var i in $scope.queryGroupList) {
                  if($scope.queryGroupList[i].groupID == $scope.selectedGroup.groupID) {
                    arr.push(resultObj.data);
                    continue;
                  } else {
                    arr.push($scope.queryGroupList[i]);
                  }
                }
                $scope.queryGroupList = arr;
                $scope.selectedGroup = resultObj.data;
                growl.success("修改用户组成功", {});
              } else {
                growl.success("修改用户组失败", {});
              }
            })

          }
        }

      }

      $scope.groupClick = function(group) {
        $scope.selectedGroup = group;
        userGroupQuery(group.groupID);
      }
      $scope.$watch("selectedGroup.groupName", function(newValue, oldValue) {
        $scope.formReg["name"] = "0";
        //var reg = /^[\u4e00-\u9fa5a-zA-Z][u4e00-\u9fa5a-za-zA-Z0-9_]{0,40}$/;
        if($scope.selectedGroup != undefined) {
          var newName = $.trim(newValue);
          if(newName != "" && newName != null) {
            //if (!reg.test(newValue)) {
            //    $scope.formReg["name"] = "1000";
            //} else {
            //    $scope.formReg["name"] = "0";
            //}
          } else {
            $scope.formReg["name"] = "0";
          }
        }
      });
      $scope.$watch("selectedGroup.description", function(newValue, oldValue) {
        $scope.formReg["desc"] = "0";
        //var reg = /^[u4e00-\u9fa5a-za-zA-Z0-9][u4e00-\u9fa5a-za-zA-Z0-9]{0,100}$/;
        if($scope.selectedGroup != undefined) {
          var newName = $.trim(newValue);
          if(newName != "" && newName != null) {
            //if (!reg.test(newValue)) {
            //    $scope.formReg["desc"] = "1001";
            //} else {
            //    $scope.formReg["desc"] = "0";
            //}
          } else {
            $scope.formReg["desc"] = "0";
          }
        }

      });
      $scope.addGroupUser = function() {
        if($scope.selectedGroup == undefined) {
          // growl.warning("请选择用户组，再 进行以下操作", {});
          return;
        }
        if($scope.selectedGroup.groupID == 0) {
          growl.warning("请先保存新添加的用户组，再进行以下操作", {});
          return;
        }
        var newObj = {
          userName: '选择用户',
          emailAddress: '',
          mobilePhone: '',
          officePhone: '',
          groupID: 0,
          domainId: '',
          userEmail: '',
          domainPath: '',
          isEdit: 2,
          userType: 2,
          userTypeLabel: "普通用户",
          jobTitle: "",
          discription: "",
          edit: "",
          userID: null
        }
        if($scope.userGroupList.data.length > 0) {
          if($scope.userGroupList.data.length != $scope.enterpriseUser.length) {
            for(var i in $scope.userGroupList.data) {
              if($scope.userGroupList.data[i].userID == null) {
                growl.warning("请先保存用户再进行添加", {});
                $scope.$broadcast(Event.USERGROUPINIT, $scope.userGroupList);
                return;
              } else {
                $scope.userGroupList.data.unshift(newObj);
                $scope.$broadcast(Event.USERGROUPINIT, $scope.userGroupList);
                return;
              }
            }
          } else {
            growl.warning("您已经没有用户可以添加", {});
            return;
          }
        } else {
          $scope.userGroupList.data.unshift(newObj);
          $scope.$broadcast(Event.USERGROUPINIT, $scope.userGroupList);
          return;
        }
      }

      /**
       * 初始化切换事件
       *
       */
      var initEvent = function() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          var aname = $(e.target).attr("name");
          var targetText = $(e.target).text();
          $scope.activeListTab = aname;
          $scope.$apply();
          if(aname == "tab4") {
            if($scope.selectedGroup != undefined) {
              if($scope.selectedGroup.groupID != undefined) {
                if($scope.selectedGroup.groupID == 0) {
                  return;
                }
                userGroupQuery($scope.selectedGroup.groupID);
              } else {
                growl.warning("请先添加用户组再进行切换", {});
                $scope.userGroupList.data = null;
                return;
              }
            }
          }
        });
      };

      /*
       *用户组Id查询用户信息
       *
       */
      var userGroupQuery = function(groupId) {
        userEnterpriseService.queryGroupUser(groupId, function(resultObj) {
          if(resultObj.code == 0) {
            for(var i in resultObj.data) {
              var obj = resultObj.data[i];
              obj.isEdit = 0;
              if(obj.emailAddress == null || obj.emailAddress == "") {
                obj["userEmail"] = obj.mobilePhone;
              } else {
                obj["userEmail"] = obj.emailAddress;
              }
            }
            $scope.userGroupList.data = resultObj.data;
            $scope.$broadcast(Event.USERGROUPINIT, $scope.userGroupList);
          } else {
            growl.warning("查询用户信息失败", {})
            return;
          }
        })
      }
      var userListInit = function() {
        //获取用户
        userEnterpriseService.queryEnterpriseUser(function(resultObj) {
          if(resultObj.code == 0) {
            $scope.enterpriseUser = resultObj.data;
          }
        });
      }
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            initEvent();
            userListInit();
          }
        });
      } else {
        initEvent();
        userListInit();
      }
    }
  ]);
});