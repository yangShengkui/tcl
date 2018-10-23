define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('inspectionStandardCtrl', ['$scope','ngDialog', 'solutionUIService', 'userInitService', 'resourceUIService', '$location', '$routeParams', '$timeout', 'maintenanceUIService', 'userLoginUIService', 'Info', 'growl', 'userEnterpriseService',
    function($scope,ngDialog, solutionUIService, userInitService, resourceUIService, $location, $routeParams, $timeout, maintenanceUIService, userLoginUIService, Info, growl, userEnterpriseService) {

      var columnsData = [];
      $scope.ifAddInspection = false; //默认不出现添加巡检标准项
      $scope.routePathNodes = {};
      $scope.InsStandardItem = {}; //添加巡检标准的返回项
      $scope.queryDitem = {};
      $scope.loaderValue = "";
      //巡检标准变量定义

      function initHistory() {
        $scope.inspectStandard = {
          "position": "", //巡检部位
          "item": "", //巡检项目
          "standardContext": "", //巡检内容
          "spotCheckMethod": "", //点检方法
          "spotCheckTool": "", //点检工具
          "serialNum": "", //序号
          "spotCheckCategory": "", //点检类别
          "modelId": null //设备模板Id
        };
      }

      //获取设备模板
      function getAllModels(callbackFun) {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.allModels = returnObj.data;
            if (callbackFun) {
              callbackFun();
            }
          }
        });
      };

      //获取所有巡检标准
      function getAllStandards(obj) {
        maintenanceUIService.getInspectionItemsByCondition(obj,function(returnObj) {
          if(returnObj.code == 0) {
            columnsData = returnObj.data;
            columnsData.sort(function(a,b) {  
              return b.id - a.id;  
            });  
            $timeout(function() {
              $scope.$broadcast(Event.INSPECTIONSTANDARD, {
                "option": [columnsData]
              });
            })

          }
        })
      };

      //查询条件事件
      $scope.goSearch = function() {
        var v = {};
        if($scope.queryDitem.state > 0) {
          v[$scope.queryDitem.attributeName] = $scope.loaderValue;
          getAllStandards(v);
        } else if(modelId){
          v['id'] = modelId;
          getAllStandards(v);
        } else {
          v['spotCheckCategory'] = $scope.loaderValue;
          getAllStandards(v);
        }
      };
      //添加巡检标准
      $scope.addInspection = function(obj) {
        if(obj == 0){
          initHistory();
        }else{
          $scope.inspectStandard = obj;
        }
        $scope.ifAddInspection = true;
        ngDialog.open({
          template: '../partials/dialogue/add_inspection.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };

      //取消巡检标准
      $scope.cancelInspection = function() {
        $scope.ifAddInspection = false;
        growl.info("取消添加巡检标准", {});
      };

      //保存添加信息
      $scope.saveInspection = function() {
        var param = {
          "position": $scope.inspectStandard.position, //巡检部位
          "item": $scope.inspectStandard.item, //巡检项目
          "standardContext": $scope.inspectStandard.standardContext, //巡检内容
          "spotCheckMethod": $scope.inspectStandard.spotCheckMethod, //点检方法
          "spotCheckTool": $scope.inspectStandard.spotCheckTool, //点检工具
          "spotCheckCategory": $scope.inspectStandard.spotCheckCategory, //点检类别
          "serialNum": $scope.inspectStandard.serialNum, //序号
          "modelId": $scope.inspectStandard.modelId //设备模板Id
        };

        //校验必输项
       /* var rv = requiredFiledValidation(param);
        if(rv != null) {
          growl.warning(rv, {});
          return;
        }*/
       if($scope.inspectStandard.id > 0){
         maintenanceUIService.updateInspectionItem($scope.inspectStandard, function(returnObj) {
           if(returnObj.code == 0) {
             $scope.closeDialog();
             growl.success("维保标准修改成功", {});
             getAllStandards({});
           }
         });
       }else{
         maintenanceUIService.addInspectionItem(param, function(returnObj) {
           if(returnObj.code == 0) {
             $scope.closeDialog();
             $scope.InsStandardItem = returnObj.data;
             growl.success("添加维保标准成功", {});
             $scope.ifAddInspection = false;
             getAllStandards({});
           }
         });
       }

      };

      /**
       * 修改巡检必输项验证
       * @param o
       */
      var requiredFiledValidation = function(o) {
        var m = null;
        if(!o.item || o.item == "") {
          m = '巡检项目名称不能为空';
        } else if(!o.modelId || o.modelId == "") {
          m = '设备模板不能为空';
        } else if(!o.standardContext || o.standardContext == "") {
          m = '巡检内容不能为空';
        } else if(!o.spotCheckMethod || o.spotCheckMethod == "") {
          m = '点检方法不能为空';
        } else if(!o.spotCheckTool || o.spotCheckTool == "") {
          m = '点检工具不能为空';
        } else if(!o.spotCheckCategory || o.spotCheckCategory == "") {
          m = '点检类别不能为空';
        } else if(!o.position || o.position == "") {
          m = '点检部位不能为空';
        }
        return m;
      };

      //option操作
      $scope.doAction = function(type, select) {
        console.log(select);
        if(type == "update") {
          $scope.selected = {
            "id": select.id,
            "domainPath": select.domainPath
          };
        } else if(type == "save-btn") {
          var param = {
            "id": $scope.selected.id,
            "item": $scope.updateParam.item,
            "standardContext": $scope.updateParam.standardContext,
            "spotCheckMethod": $scope.updateParam.spotCheckMethod,
            "spotCheckTool": $scope.updateParam.spotCheckTool,
            "spotCheckCategory": $scope.updateParam.spotCheckCategory,
            "position": $scope.updateParam.position,
            "modelId": $scope.updateParam.modelId,
            "domainPath": $scope.selected.domainPath,
          };

          //校验必输项
          var rv = requiredFiledValidation(param);
          if(rv != null) {
            growl.warning(rv, {});
            return;
          }

          maintenanceUIService.updateInspectionItem(param, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("维保标准修改成功", {});
              getAllStandards({});
            }
          });
        } else if(type == "cancel-btn") {
          growl.info("取消修改维保标准", {});
          $scope.ifAddInspection = false;
        } else if(type == "delete") {

          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除 ' + select.item + ' 吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {

                maintenanceUIService.deleteInspectionItemById(select.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    growl.success("成功删除维保标准", {});
                    getAllStandards({});

                  }

                })
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
      }

      var init = function() {
        getAllModels(function() {
          getAllStandards({});
        });
        initHistory();
      }
      
      /**
       * 监听登录状态
       */
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }

    }
  ]);
});