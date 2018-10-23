define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ConfigManagerCtrl', ['$scope', "$http", "ngDialog", '$controller', 'configUIService', 'userLoginUIService', 'growl', 'FileUploader',
    function($scope, $http, ngDialog, $controller,configUIService, userLoginUIService, growl, FileUploader) {
      $scope.serviceOrigin = configUIService.origin + '/api/rest/uploadConfig/configUIService/uploadConfigFile';
      $controller('AppUploadCtrl',{$scope: $scope ,growl:growl,FileUploader:FileUploader});
      
      $scope.uploadImage = function(config) {
        if($scope.uploader.queue.length == 0) {
          $scope.$broadcast("uploadTemplate", {
            state: true,
            response: null
          });
          return;
        }
        $scope.uploader.formData = [];
        $scope.uploader.formData.push({
          value: $scope.configGroupsDic[config.groupName].value,
          id: config.id
        });
        $scope.uploader.uploadAll();
      };
      $scope.uploader.onAfterAddingFile = function (fileItem) {
        // var picPath = getPath(fileItem._file);
        $scope.newconfig.value = "file";
        $scope.newconfig["fileSelect"] = true;
        console.info("fileItemonAfterAddingFileonAfterAddingFile",fileItem);
      };
      $scope.clearUpload = function () {
        $scope.uploader.clearQueue();
      }
      
      $scope.activeListTab = "instance";
      if($scope.menuitems['A05_S23']){
        $scope.activeListTab = "instance";
      } else if($scope.menuitems['A04_S23']){
        $scope.activeListTab = "group";
      }
      $scope.configTypes = [{
        label: "默认",
        value: "string",
        option: ""
      }, {
        label: "文件",
        value: "file",
        option: ""
      }];

      $scope.configIns = [];
      $scope.configGroupsDic = {};
      $scope.configGroups = [];

      $scope.addConfigGroup = function() {
        var newConfigGroup = {
          type: "string",
          name: "",
          value: "",
          domainPath: "",
          id: Number.MAX_VALUE,
          label: "",
          isEdit: 2
        }
        for(var i in $scope.configGroups){
          if($scope.configGroups[i].isEdit > 0){
            growl.warning("当前有未保存的配置组，请先完成该操作",{});
            return;
          }
        }
        $scope.configGroups.push(newConfigGroup);
        $scope.$broadcast(Event.CONFIGGROUPINIT, $scope.configGroups);
      };

      $scope.addConfig = function(sel) {
        // var isEditing = false;
        // $scope.configIns.forEach(function(config) {
        //   if(config.isEdit > 0) {
        //     isEditing = true;
        //     return false;
        //   }
        // })
        // if(isEditing) {
        //   growl.warning("当前有未保存的配置项，请先完成该操作", {});
        //   return;
        // }
        if(sel != undefined){
          configUIService.getConfigById(sel.id, function(resultObj) {
            if(resultObj.code == 0){
              $scope.newconfig = resultObj.data;
              $scope.newconfig["fileType"] = "uploader";

              ngDialog.open({
                template: '../partials/dialogue/config_detail.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
              });
            }
          });
        }else{
          $scope.newconfig = {
            key: "",
            value: "",
            groupName: "",
            keyDesc: "",
            invalid: false,
            canDelete: true,
            domainPath: "",
            id: 0,
            label: "",
            groupInf: "",
            fileType: "uploader",
            fileSelect : false,
            isEdit: 3
          };
          ngDialog.open({
            template: '../partials/dialogue/config_detail.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        }
        // $scope.configIns.push(newconfig);
        // $scope.$broadcast(Event.CONFIGINSINIT, $scope.configIns);
      }
      $scope.typeChange =  function () {
           if($scope.newconfig.groupName){
             if($scope.newconfig.id <= 0 && $scope.configGroupsDic[$scope.newconfig.groupName].type != 'file'){
               $scope.newconfig.value = "";
             }else {
               $scope.newconfig.value = "";
               $scope.newconfig["fileSelect"] = false;
               $scope.clearUpload();
             }
           }
      }
      $scope.doAction = function(type, select, callback) {
        if(type == 'configGroupSave') {
          // BootstrapDialog.show({
          //   title: '提示',
          //   closable: false,
          //   //size:BootstrapDialog.SIZE_WIDE,
          //   message: '是否要保存配置组:' + escape(select.label) + '',
          //   buttons: [{
          //     label: '确定',
          //     cssClass: 'btn-success',
          //     action: function(dialogRef) {
                if(select.id == Number.MAX_VALUE) select.id = 0;
                configUIService.saveConfigGroup(select, function(resultObj) {
                  if(resultObj.code == 0) {
                    $scope.configGroupsDic[resultObj.data.name] = resultObj.data;
                    $scope.configGroupsDic[resultObj.data.id] = resultObj.data;
                    callback(resultObj.data);
                    growl.success("配置组保存成功", {});
                  }
                });
          //       dialogRef.close();
          //     }
          //   }, {
          //     label: '取消',
          //     action: function(dialogRef) {
          //       callback(false);
          //       dialogRef.close();
          //     }
          //   }]
          // });
        } else if(type == 'configGroupDelete') {
          if(select.id == Number.MAX_VALUE) {
            callback(true);
            for(var i in $scope.configGroups) {
              if($scope.configGroups[i].id == Number.MAX_VALUE) {
                $scope.configGroups.splice(i, 1);
              }
            }
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '是否要删除配置组:' + escape(select.label) + '',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                configUIService.deleteConfigGroup(select.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    for(var i in $scope.configGroups) {
                      if($scope.configGroups[i].id == select.id) {
                        $scope.configGroups.splice(i, 1);
                      }
                    }
                    callback(true);
                    growl.success("配置组删除成功", {});
                  }
                });
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                callback(false);
                dialogRef.close();
              }
            }]
          });
        } else if(type == 'configSave') {
          if($scope.configGroupsDic[select.groupName].type == "file" && $scope.newconfig.fileSelect == false){
              growl.warning("请上传图片",{});
              return;
          }
          // BootstrapDialog.show({
          //   title: '提示',
          //   closable: false,
          //   //size:BootstrapDialog.SIZE_WIDE,
          //   message: '是否要保存配置项:' + escape(select.label) + '',
          //   buttons: [{
          //     label: '确定',
          //     cssClass: 'btn-success',
          //     action: function(dialogRef) {
                if(select.id == Number.MAX_VALUE) select.id = 0;
                if ($scope.configGroupsDic[select.groupName].type == "file") {
                  var listener = $scope.$on("uploadTemplate", function(event, args) {
                    listener();
                    listener = null;
                    if(args.state) {
                      if(args.response) {
                        select.value = args.response.data;
                      }
                      saveHandler(select,callback,true);
                    }
                  });
                  if (select.id == 0) {
                    saveHandler(select,function(returnObj) {
                      select.id = returnObj.id;
                      $scope.uploadImage(returnObj);
                    });
                  } else {
                    $scope.uploadImage(select);
                  }
                } else {
                  saveHandler(select,callback,true);
                }
          //       dialogRef.close();
          //     }
          //   }, {
          //     label: '取消',
          //     action: function(dialogRef) {
          //       callback(false);
          //       dialogRef.close();
          //     }
          //   }]
          // });
        } else if(type == 'configDelete') {
          if(select.id == Number.MAX_VALUE) {
            callback(true);
            for(var i in $scope.configIns) {
              if($scope.configIns[i].id == Number.MAX_VALUE) {
                $scope.configIns.splice(i, 1);
              }
            }
            $scope.uploader.removeFromQueue(0);
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '是否要删除配置项:' + escape(select.label) + '',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                configUIService.deleteConfig(select.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    callback(true);
                    for(var i in $scope.configIns) {
                      if($scope.configIns[i].id == select.id) {
                        $scope.configIns.splice(i, 1);
                      }
                    }
                    growl.success("配置项删除成功", {});
                  }
                });
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                callback(false);
                dialogRef.close();
              }
            }]
          });
        }
      };
      var saveHandler = function(select,callback,isshow) {
        configUIService.saveConfig(select, function(resultObj) {
          if(resultObj.code == 0) {
            if (callback){
              callback(resultObj.data);
            }
            if (isshow){
              growl.success("配置项保存成功", {});
              if(select.id == 0){
                select.id = resultObj.data.id;
                $scope.configIns.push(resultObj.data);
                $scope.$broadcast(Event.CONFIGINSINIT, $scope.configIns);
                $scope.closeDialog();
              }else{
                for (var prop in $scope.configIns) {
                  if($scope.configIns[prop].id == select.id){
                    $scope.configIns[prop] = resultObj.data;
                    break;
                  }
                }
                $scope.$broadcast(Event.CONFIGINSINIT, $scope.configIns);
                $scope.closeDialog();
                getConfigs();
              }
            }
          }
        });
      };
      /**
       * 初始化切换事件
       *
       */
      var initEvent = function() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.activeListTab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if(aname) {
            $scope.activeListTab = aname;
            $scope.$apply();
            if($scope.activeListTab == "group") {
              $scope.$broadcast(Event.CONFIGGROUPINIT, $scope.configGroups);
            } else {
              $scope.$broadcast(Event.CONFIGINSINIT, $scope.configIns);
            }
          }
        });
      };
      var include = [
        "canDelete",
        "conditionField",
        "createTime",
        "domainPath",
        "groupName",
        "id",
        "invalid",
        "key",
        "keyDesc",
        "label",
        "modifyTime",
        "orCondition",
        "userId"
      ];
      var includeFields = "includeFields=" + include.toString();
      var getConfigs = function() {
        configUIService.getAllConfigs(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.configIns = returnObj.data;
            $scope.$broadcast(Event.CONFIGINSINIT, $scope.configIns);
          }
        },includeFields);
      }

      //初始化
      var init = function() {
        configUIService.getAllConfigGroups(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.configGroupsDic[item.name] = item;
              $scope.configGroupsDic[item.id] = item;
            });
            $scope.configGroups = returnObj.data;
            if($scope.activeListTab == "group") {
              $scope.$broadcast(Event.CONFIGGROUPINIT, $scope.configGroups);
            }
            getConfigs();
          }
        });
      }

      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            initEvent();
            init();
          }
        });
      } else {
        initEvent();
        init();
      }
    }
  ]);
});