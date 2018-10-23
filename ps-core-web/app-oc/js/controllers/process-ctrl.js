define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('processViewsCtrl', ['$scope','ngDialog', 'workflowService', 'userLoginUIService', 'workflowDefinitionService', 'viewFlexService', '$timeout', 'growl',
    function ($scope,ngDialog, workflowService, userLoginUIService, workflowDefinitionService, viewFlexService, $timeout, growl) {
      $scope.historyVersion = "";
      $scope.selectHistory = "";
      $scope.historyList = "";
      var createView = function (param) {
        workflowDefinitionService.saveWorkflowDefinition(param, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.configureView.push(returnObj.data);
            $scope.$broadcast('PROCESS', {
              "data": $scope.configureView
            });
            growl.success("保存成功");
          }
        });
      }
      var updateView = function (param) {
        workflowDefinitionService.saveWorkflowDefinition(param, function (returnObj) {
          if (returnObj.code == 0) {
            growl.success("保存成功");
            if(param.id == null){
              location.href = "../app-flowsheet/index.html#/flow/" + returnObj.data.id;
            }else{
              initViews();
              $scope.closeDialog();
            }
          }
        });
      }

      var initObj = function () {
        $scope.addObj = {
          id: null,
          domainPath: "",
          name: "",
          desc: "",
          viewContent: "",
          isEdit: 0,
          createTime: "",
          updateTime: ""
        };
      }
      $scope.releaseObj = {"name":"","version":"","desc":"","workflowDefinitionId":""};
      $scope.addViews = function (data) {
        if(data){
          $scope.addObj = data;
        }else {
          initObj();
        }
        ngDialog.open({
          template: '../partials/dialogue/add_flow.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };
      $scope.saveFlow = function() {
        updateView($scope.addObj);
      };
      $scope.saveRelease = function() {
        workflowDefinitionService.publishWorkflow($scope.releaseObj, function (returnObj) {
          if (returnObj.code == 0) {
            growl.success("流程视图发布成功", {});
            initViews();
            $scope.closeDialog();
          }
        });
      };
      $scope.doAction = function (flg, rowData, fun) {
        if (flg == "attr-delete") {
          workflowService.getWorkflowByWorkflowDefinitionId(rowData.id, function (obj) {
            if(obj.code == 0){
              if(obj.data.length > 0){
                growl.warning("这个流程设计下面有历史版本，请先删除",{});
                return;
              }
              //删除
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '确认删除该流程视图吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function (dialogRef) {
                    workflowDefinitionService.deleteWorkflowDefinitionById([rowData.id], function (returnObj) {
                      if (returnObj.code == 0) {
                        for (var i = 0; i < $scope.configureView.length; i++) {
                          if ($scope.configureView[i].id == rowData.id) {
                            $scope.configureView.splice(i, 1);
                            break;
                          }
                        }
                        if (fun) {
                          fun(true);
                        }
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

          });
        } else if (flg == "view-copy") {
          var copyView = jQuery.extend(true, {}, rowData);
          var workflowDefinitionId = copyView.id;
          var name = copyView.name + "_复制";
          var desc = copyView.desc;
          workflowDefinitionService.copyWorkflowDefinition(workflowDefinitionId,name,desc,function (res) {
            if(res.code == 0){
              console.info("workflowDefinitionService==",res);
              initViews();
              growl.success("流程复制成功",{});
            }
          });
        } else if (flg == "view-save") {
          updateView(rowData);
        } else if (flg == "release") {
          var version = 0;
          if(rowData.version == "" || rowData.version == null){
            version = 1;
          }else{
            version = rowData.version;
          }
          $scope.releaseObj.version = version;
          $scope.releaseObj.workflowDefinitionId = rowData.id;
          $scope.releaseObj.name = rowData.name;
          $scope.releaseObj.desc = rowData.desc;
          ngDialog.open({
            template: '../partials/dialogue/flow_release.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        }else if(flg == 'history'){
          if(jQuery("#processcollapse").find(".fa.fa-plus").length == 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#processcollapse"));
          };
          workflowService.getWorkflowByWorkflowDefinitionId(rowData.id,function(res){
            if(res.code == 0){
              $scope.historyList=res.data;
              $scope.$broadcast("PROCESS"+"history", {
                "data": res.data
              });
            }
          });
          $scope.selectHistory = rowData;
          $scope.historyVersion = "version";
          //$scope.$apply();
        }else if(flg == 'history-delete'){
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认要删除流程历史版本？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                workflowService.deleteWorkflowById(rowData.id,function(res){
                  if(res.code == 0){
                    for (var j in $scope.historyList) {
                      if ($scope.historyList[j].id == rowData.id) {
                        $scope.historyList.splice(j, 1);
                      }
                    }
                    $scope.$broadcast("PROCESS"+"history", {
                      "data": $scope.historyList
                    });
                    growl.success("流程历史版本删除成功",{});
                    initViews();
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

        }
      };
      $scope.closeTable = function () {
        if(jQuery("#processcollapse").find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#processcollapse"));
        }
        $scope.historyVersion = "";
      };
      $scope.configureView = [];
      function initViews() {
        workflowDefinitionService.getWorkflowDefinitions(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.configureView = returnObj.data;
            $scope.$broadcast('PROCESS', {
              "data": $scope.configureView
            });
          }
        });
      }

      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            initViews();
          } else {
            $scope.errorMsg = userLoginUIService.result.message;
            $scope.errorStatus = 1;
          }
        });
      } else {
        initViews();
      }
    }
  ]);
  controllers.initController('processReleaseCtrl', ['$scope', 'workflowService', 'viewFlexService', '$timeout', 'growl',
    function ($scope, workflowService, viewFlexService, $timeout, growl) {
      $scope.doAction = function (flg, rowData, fun) {
        if (flg == "attr-delete") {
          //删除
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除该流程视图吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                workflowService.deleteWorkflowById([rowData.id], function (returnObj) {
                  if (returnObj.code == 0) {
                    for (var i = 0; i < $scope.configureView.length; i++) {
                      if ($scope.configureView[i].id == rowData.id) {
                        $scope.configureView.splice(i, 1);
                        break;
                      }
                    }
                    if (fun) {
                      fun(true);
                    }
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
      }
      $scope.configureView = [];
      function initViews() {
        workflowService.getWorkflows(function (returnObj) {
          if (returnObj.code == 0) {
            $scope.configureView = returnObj.data;
            $scope.$broadcast('PROCESS-RELEASE', {
              "data": $scope.configureView
            });
          }
        });
      }

      initViews();
    }
  ]);
});
