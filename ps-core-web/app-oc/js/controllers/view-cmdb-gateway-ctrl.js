define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewCmdbGatewayCtrl', ['$scope','$controller', 'FileUploader', 'ngDialog', '$q', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService',
    'SwSocket', 'Info', 'viewFlexService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'customerUIService', 'projectUIService', 'deviceAccessUIService', 'configUIService',
    function($scope,$controller, FileUploader, ngDialog,$q, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService,
      SwSocket, Info, viewFlexService, unitService, growl, userDomainService, userEnterpriseService, customerUIService, projectUIService, deviceAccessUIService, configUIService) {
      console.info("切换到网关管理");
      $scope.activeMainTab = "网关视图";
      $scope.activeListTab = resourceUIService.activeListTab ? resourceUIService.activeListTab : "tab1";
      $scope.routePathNodes = {};
      $scope.selectedGateitem = null;
      $scope.gatewaysAry = [];

      $scope.domainListTree = [];
      $scope.domainListDic = {};
      $scope.querySuppliers = [];
      $scope.selLength = 10;
      $scope.gatewayactiveDevices = []; //启用设备
      $scope.selectUnComfirmedDevice;
      /* 以下是设备模板上传文档的设置 */
      $scope.serviceOrigin = configUIService.origin + '/api/rest/import/resourceUIService/importDevice';
      $scope.fileFormat = 'xls、xlsx';
      $scope.fileMaxSize = 10;
      $controller('AppUploadCtrl', {
        $scope: $scope,
        growl: growl,
        FileUploader: FileUploader
      });
      $scope.toggle = function toggle() {
        $('#fileName').click();
      }
      $scope.uploadExcel = function(config) {
        $scope.uploader.formData.push({
          config: 'deviceInfo'
        });
        $scope.uploader.uploadAll();
      };

      $scope.$on("uploadTemplate", function(event, args) {
        if(args.response.code == 0) {
          growl.success("设备导入成功", {});
        }
      });

      /**
       * excel 导出
       */

      $scope.exportModel = function() {
        var selList = $scope.selectedDevices;
        var devIdStr = "";
        for(var i in  selList){
          devIdStr += selList[i].id +",";
        }
        location.href = '' + configUIService.origin+ '/api/rest/export/resourceUIService/exportDevice/' + $routeParams.gatewayId + '.xlsx/' +  devIdStr + '/deviceInfo/';
      }
      $scope.uploader.onAfterAddingFile = function(fileItem) {
        if($scope.uploader.queue.length > $scope.queueLimit) {
          $scope.uploader.removeFromQueue(0);
        }
        $scope.uploadExcel();
      };
      var initstate = false;

      var info = Info.get("../localdb/icon.json", function(info) {
        $scope.iconList = info.qualityIcon;
        $scope.kpiIconList = info.kpiIcon;
      });

      var getIcon = function(random) {
        var icon;
        switch(true) {
          default: icon = "glyphicon glyphicon-hdd";
        }
        return icon;
      };

      var broadcastDevices = function() {
        $scope.$broadcast(Event.CMDBINFOSINIT + "GATEACTIVE", {
          data: $scope.gatewayactiveDevices
        });
      };

      /**
       * 启用设备跟未启用设备合在一起
       */
      var getDevices = function(gateway) {
        $scope.gatewayactiveDevices = [];
        if(gateway.devices) {
          $scope.gatewayactiveDevices = gateway.devices;
          broadcastDevices();
        } else {
          resourceUIService.getDevicesByCondition({
            gatewayId: gateway.id
          }, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.gatewayactiveDevices = returnObj.data;
              broadcastDevices();
            };
          });
        }
      };

      /**
       * 初始化网管上样式数据
       * obj 网关对象
       * idx 网关下标
       */
      var initGatewayAtts = function(obj, idx) {
        obj.selected = false; //datatable上使用
        obj.id = obj.id ? obj.id : 0;
        obj.customerId = obj.customerId ? obj.customerId : null;
        obj.projectId = obj.projectId ? obj.projectId : null;
        obj.name = obj.name ? obj.name : "";
        obj.externalGwId = obj.externalGwId ? obj.externalGwId : "";
        obj.accessName = obj.accessName ? obj.accessName : "";
        obj.accessPassword = obj.accessPassword ? obj.accessPassword : "";
        obj.protocolType = obj.protocolType ? obj.protocolType : "";
        obj.protocol = obj.protocol ? obj.protocol : "";
        obj.count = obj.count;
        obj.icon = getIcon(Math.random());
        obj.alertlv = obj.operationStatus == 4 ? "bg-red" : (obj.operationStatus == 3 ? "bg-orange" : (obj.operationStatus == 2 ? "bg-yellow" : "bg-green"));
        obj.isLoaded = 0;
        obj.label = obj.name;
        obj.onlineStatus = obj.onlineStatus ? obj.onlineStatus : '无数据';
        obj.managedStatus = obj.managedStatus ? obj.managedStatus : 'deactive';
        obj.activeTime = obj.activeTime ? (newDateJson(obj.activeTime).Format(GetDateCategoryStrByLabel(''))) : "";
        obj.expireTime = obj.expireTime ? (newDateJson(obj.expireTime).Format(GetDateCategoryStrByLabel(''))) : "";
        obj.validTime = "";
        if(obj.activeTime && obj.expireTime) {
          obj.validTime = "从" + obj.activeTime + "到" + obj.expireTime;
        }
        if($scope.choseGateWayTab == 2 && obj.values) {
          obj.enterpriseId = obj.values.enterpriseId;
          obj.productId = obj.values.productId;
        }
        obj.offlineAlert = obj.offlineAlert ? obj.offlineAlert : false;
        obj.timeOutCycle = obj.timeOutCycle ? obj.timeOutCycle : 3;
        obj.heartbeatTime = obj.heartbeatTime ? obj.heartbeatTime : 60;
        return obj;
      };

      /***
       * 初始化模型数据
       * @param ciName
       */
      var urmpTree = function(ciName) {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModelDic = {};
            var tree = returnObj.data;
            for(var i in tree) {
              var obj = tree[i];
              obj.text = obj.label;
              if(!$scope.routePathNodes[obj.parentModelId])
                $scope.routePathNodes[obj.parentModelId] = [];
              $scope.routePathNodes[obj.parentModelId].push(obj);
              if(!$scope.routePathNodes[obj.id])
                $scope.routePathNodes[obj.id] = [];
              var cmpObj = jQuery.extend(true, {}, obj);
              resourceUIService.rootModelDic[cmpObj.id] = cmpObj;
            }
            var addNodes = function(parentNode) {
              for(var modeid in $scope.routePathNodes) {
                if(modeid == parentNode.id) {
                  parentNode.nodes = $scope.routePathNodes[modeid]
                  for(var i in parentNode.nodes) {
                    addNodes(parentNode.nodes[i])
                  }
                  if(parentNode.nodes.length == 0) {
                    parentNode.nodes = null;
                  }
                }
              }
            }
            var initRoutePath = function(node, arr) {
              for(var i in node.nodes) {
                if($routeParams.modelId == node.nodes[i].id) {
                  arr.push(node);
                  break;
                } else {
                  initRoutePath(node.nodes[i], arr);
                }
              }
            }
            addNodes(resourceUIService.rootModel);
            for(var key in $scope.routePathNodes) {
              if(key != resourceUIService.rootModel.id && !resourceUIService.rootModelDic[key]) {
                for(var i in $scope.routePathNodes[key]) {
                  addNodes($scope.routePathNodes[key][i]);
                  if(!resourceUIService.rootModel.nodes)
                    resourceUIService.rootModel.nodes = [];
                  resourceUIService.rootModel.nodes.push($scope.routePathNodes[key][i])
                }
              }
            }
            resourceUIService.rootModelDic[resourceUIService.rootModel.id] = resourceUIService.rootModel;
            $scope.rootModel = resourceUIService.rootModel;
            $scope.rootModelDic = resourceUIService.rootModelDic;
          }
        });
      };

      /**
       * 更新网关上的设备值
       */
      var updateGateway = function(data) {
        for(var i in $scope.selectedGateitem.devices) {
          if($scope.selectedGateitem.devices[i].id == data.id) {
            $scope.selectedGateitem.devices[i] = data;
            break;
          }
        }
        $scope.gatewayactiveDevices = $scope.selectedGateitem.devices;
      }

      /**
       * 网关点击事件
       * @param item 网关点击对象
       */
      $scope.click = function(item) {
        if($scope.activeMainTab == "网关视图") {
          $scope.selectedGateitem = item;
          //					$scope.selectedGateitem.isVirtual = $scope.selectedGateitem.isVirtual ? 'true' : 'false';
          getDevices($scope.selectedGateitem);
          findUnComfirmedDevice($scope.selectedGateitem);
          $scope.protocolVersionChange();
        }
      };

      /**
       * 网关注销功能
       */
      $scope.delGateWay = function(select, callbackFun) {
        //增加判断哪一个tab页（设备类型视图，资源域视图，网关视图）
        if($scope.activeMainTab == "网关视图") {
          if(select.managedStatus == 'active') {
            growl.warning("启用状态的网关不能注销，请先停用该网关。", {});
            return;
          };
          //注销网关
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认注销【'+select.name+'】网关吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                if(select) {
                  resourceUIService.deleteGateway(select.id, function(returnObj) {
                    if(returnObj.code == 0) {
                      var arr = [];
                      for(var i in $scope.gatewaysAry) {
                        if($scope.gatewaysAry[i].id != select.id) {
                          arr.push($scope.gatewaysAry[i]);
                        }
                      }
                      $scope.gatewaysAry = arr;

                      if(callbackFun) {
                        callbackFun(select);
                      }
                      $scope.selectedHandler("gateway", true)
                      growl.success("注销网关成功", {});
                      broadcastGatewayAry(arr);
                    }
                  })
                }
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

      /**
       * 网关列表的按钮操作
       */
      $scope.gatewayHandler = function(action, gateWayId) {
        if(action == "add") {
          location.href = "#/gatewayInfo/0";
        } else if(action == "update") {
          location.href = "#/gatewayInfo/" + gateWayId;
        }
        resourceUIService.activeListTab = "";
      }

      /**
       * 新增网关
       * 老版本的方法
       */
      $scope.addModel = function() {
        //判断点击的是设备类型的添加按钮、资源域试图的添加按钮、网关试图的添加按钮
        if($scope.activeMainTab == "网关视图") {
          var arr = [];
          for(var i in $scope.gatewaysAry) {
            var obj = $scope.gatewaysAry[i];
            arr.push(obj);
            if(obj.id == 0) {
              growl.warning($.ProudSmart.message.saveVerify("网关"), {});
              return;
            }
          }
          $scope.activeListTab = resourceUIService.activeListTab = "tab1";
          $scope.selectedGateitem = initGatewayAtts({}, i);
          $scope.gatewaysAry = [$scope.selectedGateitem].concat(arr);
          arr = null;
          //新增网关，把该网关下面的未启用和启用设备列表清空
          //$scope.gatewayDevices = [];
          $scope.gatewayactiveDevices = [];
          //$scope.$broadcast(Event.CMDBINFOSINIT + "GATE", {
          //  data: $scope.gatewayDevices
          //});

        }
      };

      $scope.attrLabel = ""; //属性显示名称
      $scope.iconClick = function(type, indexId, thisId) {
        if($("#label" + indexId + "").val() != "图标") {
          $scope.attrLabel = $("#label" + indexId + "").val();
        }
        if(type == 'icon') {
          $("#label" + indexId + "").val("图标");
          $("#label" + indexId + "").attr("disabled", true);
          $scope.selectedDitem.attrs[indexId].label = "图标";
        } else {
          if($("#label" + indexId + "").val() == "图标") {
            $("#label" + indexId + "").val($scope.attrLabel);
          }
          $("#label" + indexId + "").attr("disabled", false);
        }
      };
      /**
       * 网关保存事件
       */
      $scope.saveModelSubItem = function(callbackFun) {
        //增加三种视图（设备类型，资源域，网关）的判断
        if($scope.activeMainTab == "网关视图") {
          if($scope.choseGateWayTab != 2) {
            if(!$scope.selectedGateitem.protocol) {
              growl.warning("请选接入协议", {});
              return;
            }
            if(!$scope.selectedGateitem.protocolVersion) {
              growl.warning("请选接入版本", {});
              return;
            }
          } else {
            if(!$scope.selectedGateitem.enterpriseId) {
              growl.warning("请选接入厂商", {});
              return;
            } else {
              if(!$scope.selectedGateitem.values) $scope.selectedGateitem.values = {};
              $scope.selectedGateitem.values.enterpriseId = $scope.selectedGateitem.enterpriseId;
            }
            if(!$scope.selectedGateitem.productId) {
              growl.warning("请选接入网关", {});
              return;
            } else {
              if(!$scope.selectedGateitem.values) $scope.selectedGateitem.values = {};
              $scope.selectedGateitem.values.productId = $scope.selectedGateitem.productId;
            }
          }

          if($scope.selectedGateitem.protocol == 'flexem' || $scope.selectedGateitem.protocol == 'webservice') {
            if(!$scope.selectedGateitem.accessAddress) {
              growl.warning("请输入接入地址", {});
              return;
            }
            if(!$scope.selectedGateitem.accessPassword) {
              growl.warning("请输入接入密码", {});
              return;
            }
          }
          if(!$scope.selectedGateitem.domain) {
            growl.warning("请选择管理域", {});
            return;
          }
          if(!$scope.selectedGateitem.customerId && $scope.baseConfig.customerConfig.check && $scope.baseConfig.customerConfig.display) {
            growl.warning("请选择" + (($scope.menuitems["S12"] && $scope.menuitems["S12"].label) ? $scope.menuitems["S12"].label : "客户") + "名称", {});
            return;
          }
          if(!$scope.selectedGateitem.projectId && $scope.baseConfig.projectConfig.check && $scope.baseConfig.projectConfig.display) {
            growl.warning("请选择" + (($scope.menuitems["S13"] && $scope.menuitems["S13"].label) ? $scope.menuitems["S13"].label : "项目") + "名称", {});
            return;
          }
          if(!$scope.selectedGateitem.domains && $scope.baseConfig.enterpriseConfig && $scope.baseConfig.enterpriseConfig.check) {
            growl.warning("请选择企业名称", {});
            return;
          }
          var regExp = /^[\u4e00-\u9fa5_a-zA-Z0-9][\u4e00-\u9fa5_a-zA-Z0-9._:-]{1,32}$/;
          var regExp1 = /^[\u4e00-\u9fa5_a-zA-Z][\u4e00-\u9fa5_a-zA-Z0-9._-]{1,32}$/;
          if($scope.selectedGateitem.externalGwId || $scope.selectedGateitem.name){
           /* if (!regExp.test($scope.selectedGateitem.externalGwId)) {
              growl.warning("网关标识输入格式不正确，请重新输入", {});
              return;
            }*/
            if (!regExp1.test($scope.selectedGateitem.name)) {
              growl.warning("网关名称输入格式不正确，请重新输入", {});
              return;
            }
          }

          if(!$scope.selectedGateitem.externalGwId) {
            growl.warning("请输入网关标识", {});
            return;
          }
          if(!$scope.selectedGateitem.name) {
            growl.warning("请输入网关名称", {});
            return;
          }

          if($scope.selectedGateitem.id == 0) {
            for(var i in $scope.gatewaysAry) {
              if($scope.gatewaysAry[i].id != 0 && $scope.gatewaysAry[i].externalGwId == $scope.selectedGateitem.externalGwId) {
                growl.warning("网关标识已经存在", {});
                return;
              }
            }
          }

          var saveGateway = function() {
            if($scope.selectedGateitem.id == 0) {
              resourceUIService.addGateway($scope.selectedGateitem, function(returnObj) {
                if(returnObj.code == 0) {
                  if(returnObj.data) {
                    $scope.selectedGateitem = initGatewayAtts(returnObj.data);
                  }
                  if(callbackFun) {
                    callbackFun(true);
                  } else {
                    growl.success("添加网关成功", {});
                    $location.url("/gatewayInfo/" + $scope.selectedGateitem.id);
                    $location.replace();
                  }
                }
              });
            } else {
              resourceUIService.updateGateway($scope.selectedGateitem, function(returnObj) {
                if(returnObj.code == 0) {
                  if(returnObj.data) {
                    $scope.selectedGateitem = initGatewayAtts(returnObj.data);
                  }
                  if(callbackFun) {
                    callbackFun();
                  } else {
                    growl.success("更新网关成功", {});
                  }
                }
              });
            }
          }
          saveGateway();
        }
      };

      /**
       * 给网关添加一个未启用设备，等同于网关自动发现（现在直接在已启用设备里面直接添加）
       */
      $scope.addIns = function() {
        var item = $scope.selectedGateitem;
        if(item) {
          if(item.id == 0) {
            growl.warning("当前网关没有保存，请先保存网关", {});
            return;
          }
          for(var i in $scope.gatewayactiveDevices) {
            var obj = $scope.gatewayactiveDevices[i];
            if(obj.id == 0) {
              growl.warning("当前有未添加到网关设备，请点击保存按钮", {});
              return;
            }
            if(obj.isEdit == 4) {
              growl.warning("当前有在编辑的网关设备，请点击保存按钮", {});
              return;
            }
          }
          var newObj = {
            gatewayId: item.id,
            label: '注册设备' + $scope.gatewayactiveDevices.length,
            id: 0,
            domainPath: '',
            domainId: '',
            modelId: '',
            externalDevId: '',
            managedStatus: 'deactive',
            onlineStatus: 'offline',
            operationStatus: 0,
            sn: '',
            gatewayDomainPath: item.domain,
            isEdit: 2,
            selected: false,
            createTime: new Date()
          }
          $scope.gatewayactiveDevices.unshift(newObj);
          $scope.$broadcast(Event.CMDBINFOSINIT + "GATEACTIVE", {
            data: $scope.gatewayactiveDevices
          });
        } else {
          growl.warning("请先添加一个网关", {});
        }
      };

      /**
       *新发现设备  datatable操作事件
       * @param type
       * @param select
       * @param callback
       */
      $scope.doActionUn = function(type, select, callback) {
        if(type == 'select') {
          $scope.selectUnComfirmedDevice = select;
          $scope.$apply();
        } else if(type == 'save') {
          $scope.selectUnComfirmedDevice = select;
          resourceUIService.selectUnComfirmedDevice = select; //存放到resourceUIservice上，全局使用
          resourceUIService.selectUnComfirmedDevice.from = "unReco";
          $scope.infoPageManage('UNDEVICE')
        } else if(type == 'delete') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关删除未识别设备吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteUnRecognizedDevice(select.id, function(returnObj) {
                  if(returnObj.code == 0) {

                    for(var i in $scope.unComfirmedDevice) {
                      if($scope.unComfirmedDevice[i].id == select.id) {
                        $scope.unComfirmedDevice.splice(i, 1);
                        break;
                      }
                    }
                    if(callback)
                      callback(true);
                    growl.success("注销成功", {});
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
      };

      /**
       * datatables内部操作处理
       * @param {Object} type
       * @param {Object} select
       */
      $scope.doAction = function(type, select, callback) {
        //增加三种视图（设备类型，资源域，网关）显示页的判断
        if($scope.activeMainTab == "网关视图") {
          if(type == 'gateSave') {
            if(!jQuery.trim(select.label)) {
              growl.warning("名称不能为空", {});
              return;
            }
            if(!jQuery.trim(select.externalDevId)) {
              growl.warning("设备地址不能为空", {});
              return;
            }
            if(!jQuery.trim(select.sn)) {
              growl.warning("序列号不能为空", {});
              return;
            }
            if(!jQuery.trim(select.modelId) || select.modelId == 0) {
              growl.warning("设备模板不能为空", {});
              return;
            }
            if(select.id > 0) {
              resourceUIService.savePhysicalDevice(select, function(returnObj) {
                if(returnObj.code == 0) {
                  updateGateway(returnObj.data);
                  callback(returnObj.data)
                  growl.success("保存成功", {});
                } else {
                  callback(false);
                }
              });
            } else {
              for(var i in $scope.gatewayactiveDevices) {
                if($scope.gatewayactiveDevices[i].id != 0 && select.externalDevId == $scope.gatewayactiveDevices[i].externalDevId) {
                  growl.warning("设备地址不能重复", {});
                  return;
                }
              }
              resourceUIService.registerDevice($scope.selectedGateitem.id, select, function(returnObj) {
                if(returnObj.code == 0) {
                  $scope.selectedGateitem.count++;
                  updateGateway(returnObj.data);
                  callback(returnObj.data);
                  growl.success("注册成功", {});
                } else {
                  callback(false);
                }
              });

            }
          } else if(type == 'deviceEdit') {
            location.href = "#/facility/DEVICE/" + $scope.selectedGateitem.id + "/" + select.id;
          } else if(type == 'deviceActive') {
            if($scope.selectedGateitem.managedStatus != 'active') {
              growl.warning("网关不是启用状态，无法启用设备!", {});
              return;
            }
            if(!jQuery.trim(select.label)) {
              growl.warning("名称不能为空", {});
              return;
            }
            if(!jQuery.trim(select.modelId) || select.modelId == 0) {
              growl.warning("设备模板不能为空", {});
              return;
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关启用 ' + escape(select.label) + ' 设备吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  resourceUIService.activateDevice(select.id, function(returnObj) {
                    if(returnObj.code == 0) {
                      for(var i in $scope.gatewayactiveDevices) {
                        if($scope.gatewayactiveDevices[i].id == select.id) {
                          $scope.gatewayactiveDevices[i].managedStatus = select.managedStatus;
                          break;
                        }
                      }
                      if(callback)
                        callback(true);
                      $scope.selectedHandler("device", true);
                      growl.success("启用成功", {});
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
          } else if(type == 'deviceDel') {
            if(select.id <= 0) {
              for(var i in $scope.gatewayactiveDevices) {
                if($scope.gatewayactiveDevices[i].id == select.id) {
                  $scope.gatewayactiveDevices.splice(i, 1);
                  callback(true);
                  break;
                }
              }
            } else {
              //增加注销确认步骤
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关注销 ' + escape(select.label) + ' 设备吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    var handler = function() {
                      for(var i in $scope.gatewayactiveDevices) {
                        if($scope.gatewayactiveDevices[i].id == select.id) {
                          $scope.gatewayactiveDevices.splice(i, 1);
                          break;
                        }
                      }
                      if(callback)
                        callback(true);
                      $scope.selectedHandler("device", true);
                      growl.success("注销成功", {});
                    }
                    if(select.id != 0) {
                      resourceUIService.unregisterDevice($scope.selectedGateitem.id, select.id, function(returnObj) {
                        if(returnObj.code == 0) {
                          handler();
                        }
                      });
                    } else {
                      handler();
                    }
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
          } else if(type == 'deviceDeActive') {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关停用 ' + escape(select.label) + ' 设备吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  resourceUIService.deactivateDevice(select.id, function(returnObj) {
                    if(returnObj.code == 0) {
                      for(var i in $scope.gatewayactiveDevices) {
                        if($scope.gatewayactiveDevices[i].id == select.id) {
                          $scope.gatewayactiveDevices[i].managedStatus = select.managedStatus;
                          break;
                        }
                      }
                      if(callback)
                        callback(true);
                      $scope.selectedHandler("device", true);
                      growl.success("停用成功", {});
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
        }
      };

      /**
       * 未启用设备启用事件
       * @param select
       * @param callback
       * @param node
       */
      $scope.doActiveHanddler = function(select, callback, node) {
        if($scope.selectedGateitem.managedStatus != 'active') {
          growl.warning("网关不是启用状态，无法启用设备!", {});
          return;
        }
        select.providerDomainPath = ($scope.querySuppliers != null && $scope.querySuppliers.length > 0) ? $scope.querySuppliers[0].domainPath : "";
        resourceUIService.activateDevice(select, function(returnObj) {
          if(returnObj.code == 0) {
            if(node) {
              callback(true, node);
            } else {
              callback(true);
              growl.success("启用成功", {});
              updateGateway(returnObj.data);
            }
          }
        });
      };

      $scope.infoPageManage = function(flg) {
        var handler = function(historychange) {
          $scope.changeManagedStatus($scope.selectedGateitem, function(returnObj) {
            $scope.selectedGateitem = returnObj;
            if(historychange)
              $location.url("/gatewayInfo/" + $scope.selectedGateitem.id);
            $location.replace();
          });
        }
        if(flg == '网关启用') {
          $scope.saveModelSubItem(function(historychange) {
            handler(historychange);
          })
        } else if(flg == '网关停用') {
          handler();
        } else if(flg == '设备停用') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '当前有 ' + $scope.activeDevices.length + ' 个设备启用状态，确认要停用吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                var activeDeviceIds = [];
                $scope.activeDevices.forEach(function(activeDevice) {
                  activeDeviceIds.push(activeDevice.id);
                });
                resourceUIService.deactivateDevices(activeDeviceIds, function(returnObj) {
                  if(returnObj.code == 0) {
                    for(var i in $scope.gatewayactiveDevices) {
                      returnObj.data.successObj.forEach(function(device) {
                        if($scope.gatewayactiveDevices[i].id == device.id) {
                          $scope.gatewayactiveDevices[i].managedStatus = device.managedStatus;
                          return true;
                        }
                      });
                      $scope.gatewayactiveDevices[i].selected = false;
                    }
                    $scope.selectedHandler("device", true);
                    broadcastDevices($scope.gatewayactiveDevices);
                    growl.success("停用成功" + returnObj.data.successObj.length + "个设备,失败" + returnObj.data.failObj.length + "个设备", {});
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
        } else if(flg == '设备启用') {
          if($scope.selectedGateitem.managedStatus != 'active') {
            growl.warning("网关不是启用状态，无法启用设备!", {});
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '当前有 ' + $scope.deactiveDevices.length + ' 个设备未启用状态，确认要启用吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                var deactiveDeviceIds = [];
                $scope.deactiveDevices.forEach(function(deactiveDevice) {
                  deactiveDeviceIds.push(deactiveDevice.id);
                });
                resourceUIService.activateDevices(deactiveDeviceIds, function(returnObj) {
                  if(returnObj.code == 0) {
                    for(var i in $scope.gatewayactiveDevices) {
                      returnObj.data.successObj.forEach(function(device) {
                        if($scope.gatewayactiveDevices[i].id == device.id) {
                          $scope.gatewayactiveDevices[i].managedStatus = device.managedStatus;
                          return true;
                        }
                      });
                      $scope.gatewayactiveDevices[i].selected = false;
                    }
                    $scope.selectedHandler("device", true);
                    broadcastDevices($scope.gatewayactiveDevices);
                    growl.success("启用成功" + returnObj.data.successObj.length + "个设备,失败" + returnObj.data.failObj.length + "个设备", {});
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
        } else if(flg == '设备注销') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '当前有 ' + $scope.deactiveDevices.length + ' 个设备未启用状态，确认要注销吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                var deactiveDeviceIds = [];
                $scope.deactiveDevices.forEach(function(deactiveDevice) {
                  deactiveDeviceIds.push(deactiveDevice.id);
                });
                resourceUIService.unregisterDevices($scope.selectedGateitem.id, deactiveDeviceIds, function(returnObj) {
                  if(returnObj.code == 0) {
                    returnObj.data.successObj.forEach(function(deviceid) {
                      for(var i in $scope.gatewayactiveDevices) {
                        if($scope.gatewayactiveDevices[i].id == deviceid) {
                          $scope.gatewayactiveDevices.splice(i, 1);
                          break;
                        }
                        $scope.gatewayactiveDevices[i].selected = false;
                      }
                    });
                    $scope.selectedHandler("device", true);
                    broadcastDevices($scope.gatewayactiveDevices);
                    growl.success("注销成功" + returnObj.data.successObj.length + "个设备,失败" + returnObj.data.failObj.length + "个设备", {});
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
        } else if(flg == 'DEVICE') {
          location.href = "#/facility/DEVICE/" + $scope.selectedGateitem.id + "/0"
        } else if(flg == 'UNDEVICE') {
          location.href = "#/facility/UNDEVICE/" + $scope.selectedGateitem.id + "/" + $scope.selectUnComfirmedDevice.id;
        } else if(flg == 'FBOX') {
          deviceAccessUIService.getFlexemCloudConfAddr($scope.selectedGateitem.externalGwId, location.href, function(returnObj) {
            if(returnObj.code == 0) {
              window.open(returnObj.data)
            }
          })
        }
      }

      /**
       * 启用、停用网关事件
       */
      $scope.changeManagedStatus = function(selectedGateitem, callbackFun) {
        if(selectedGateitem.managedStatus == 'active') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '停用网关的操作会使该网关下所有的设备一并停用，请确认要停用 ' + escape(selectedGateitem.name) + ' 网关吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                isChangeManagedStatus = true;
                resourceUIService.deactivateGateway(selectedGateitem.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    var obj = initGatewayAtts(returnObj.data);
                    for(var i in $scope.gatewaysAry) {
                      if($scope.gatewaysAry[i].id == obj.id) {
                        $scope.gatewaysAry[i].managedStatus = obj.managedStatus;
                        $scope.gatewaysAry[i].simulated = false;
                        break;
                      }
                    }
                    for(var i in selectedGateitem.devices) {
                      selectedGateitem.devices[i].managedStatus = "deactive";
                    }
                    if(callbackFun)
                      callbackFun(obj);
                    $scope.selectedHandler("gateway", true);
                    growl.success("停用成功", {});
                  }
                  isChangeManagedStatus = false;
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
        } else {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认启用 ' + escape(selectedGateitem.name) + ' 网关吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                isChangeManagedStatus = true;
                resourceUIService.activateGateway(selectedGateitem.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    var obj = initGatewayAtts(returnObj.data);
                    for(var i in $scope.gatewaysAry) {
                      if($scope.gatewaysAry[i].id == obj.id) {
                        $scope.gatewaysAry[i].managedStatus = obj.managedStatus;
                        $scope.gatewaysAry[i].simulated = false;
                        break;
                      }
                    }
                    if(callbackFun)
                      callbackFun(obj);
                    $scope.selectedHandler("gateway", true);
                    growl.success("启用成功", {});
                  }
                  isChangeManagedStatus = false;
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
      }

      /**
       * 下发网关配置
       */
      $scope.sendGatewayConfig = function (gateway) {
        resourceUIService.sendGatewayConfig(gateway.id, function (ret) {
          if(ret.code == 0) {
            growl.success('下发网关配置成功。');
          }
        });
      };

      /**
       * 更改网关的归属
       *
       */
      $scope.modifyAscrip = function (rowData,callback) {
        resourceUIService.updateGateway(rowData, function (returnObj) {
          if (returnObj.code == 0) {
            var obj = initGatewayAtts(returnObj.data);
            for(var i in $scope.gatewaysAry) {
              if($scope.gatewaysAry[i].id == obj.id) {
                $scope.gatewaysAry[i].projectId = obj.projectId;
                break;
              }
            }
            broadcastGatewayAry($scope.gatewaysAry);
            callback(returnObj.data);
          }
        });
      }

      /**
       * 获得所有域
       */
      $scope.domainTreeQuery = function(reflash) {
        var handler = function(data) {
          $scope.domainListDic = data.domainListDic;
          $scope.domainListTree = data.domainListTree;
          if(reflash)
            growl.success("操作成功！");
        }
        if($scope.baseConfig && $scope.baseConfig.extendDomain && false) { //网关不使用
          resourceUIService.getExtendDomainsByFilter({}, handler);
        } else {
          userDomainService.queryDomainTree(userLoginUIService.user.userID, handler);
        }
      };

      var isChangeManagedStatus = false;
      var broadcastGatewayAry = function(gatewaysAry) {
        getResourceBaseState(gatewaysAry, function() {
          if(isChangeManagedStatus) return; //状态切换时不发送消息
          $scope.$broadcast(Event.CMDBINFOSINIT + "GATES", {
            data: gatewaysAry
          });
        });
      };

      /**
       * 查询所有网关并且初始化设备数据
       *
       */
      $scope.queryDitem = {
        statelabel: "", //查询条件显示
        state: 0, //查询条件
        name: null,
        customerId: null,
        projectId: null,
        domain: null,
        managedStatus: null,
        externalGwId: null
      };

      /**
       * 查询网关 
       */
      $scope.goSearch = function() {
        $scope.activeGateways = [];
        $scope.deactiveGateways = [];
        $scope.queryDitem.name = $scope.queryDitem.state == 0 ? $scope.queryDitem.name : null;
        $scope.queryDitem.externalGwId = $scope.queryDitem.state == 1 ? $scope.queryDitem.externalGwId : null;
        $scope.queryDitem.customerId = $scope.queryDitem.state == 2 ? $scope.queryDitem.customerId : null;
        $scope.queryDitem.projectId = $scope.queryDitem.state == 3 ? $scope.queryDitem.projectId : null;
        $scope.queryDitem.managedStatus = $scope.queryDitem.state == 4 ? $scope.queryDitem.managedStatus : null;
        $scope.queryDitem.domain = $scope.queryDitem.state == 5 ? $scope.queryDitem.domain : null;
        gateWayTree();
      };

      var gateWayTree = function() {
        if($routeParams.gatewayId) {
          if($routeParams.gatewayId == 0) {
            $scope.selectedGateitem = initGatewayAtts($scope.defaultGatewayType);
            tabHandler();
            $scope.queryenterprise({
              'data': ''
            });
          } else {
            resourceUIService.getGatewayById($routeParams.gatewayId, function(returnObj) {
              if(returnObj.code == 0) {
                $scope.queryenterprise({
                  'data': returnObj.data.domianPath
                });
                $scope.selectedGateitem = initGatewayAtts(returnObj.data);
                if($scope.activeListTab == 'gateway2') {
                  gatewayEchars();
                } else {
                  tabHandler();
                }
              }
            });
          }
        } else {
          resourceUIService.getAllGatewaysByCondition($scope.queryDitem, function(returnObj) {
            $scope.gatewaysAry = [];
            $scope.gatewaysIdAry = []; //存储所有网关的id，便于批量查询
            $scope.gatewaysObj = {}; //根据网关id创建一个对象，主要用来存储网关上的设备
            if(returnObj.code == 0) {
              for(var i in returnObj.data) {
                $scope.gatewaysAry.push(initGatewayAtts(returnObj.data[i], i));
                $scope.gatewaysIdAry.push(returnObj.data[i].id);
                returnObj.data[i]["devices"] = [];
                $scope.gatewaysObj[returnObj.data[i].id] = returnObj.data[i];
              }
              broadcastGatewayAry($scope.gatewaysAry);
              $scope.activeListTab = 'tab1'; //网关初始化默认显示网关信息
              tabHandler();
            }
          });
        }
      };

      /**
       * 获得供应商
       */
      var querySupplier = function() {
        userEnterpriseService.querySupplier(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.querySuppliers = returnObj.data;
          }
        });
      };

      /**
       * 获得客户列表
       */
      $scope.customersList;
      $scope.customersDic = {};
      $scope.queryCustomer = function(reflash) {
        var defer = $q.defer();
        customerUIService.findCustomersByCondition({}, function(returnObj) {
          $scope.customersDic = returnObj.customerDic;
          returnObj.data.forEach(function(item) {
            item.text = item.customerName;
          })
          $scope.customersList = returnObj.data;
          defer.resolve("success");
          if(reflash)
            growl.success("操作成功！");
        });
        deferList.push(defer.promise);
      };

      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function(reflash) {
        var defer = $q.defer();
        projectUIService.findProjectsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            defer.resolve("success");
            if(reflash)
              growl.success("操作成功！");
          }
        });
        deferList.push(defer.promise);
      };

      /**
       * 查询企业
       */
      $scope.enterpriseList;
      $scope.enterpriseDic = {};
      $scope.queryenterprise = function(path) {
        if(!$scope.menuitems['S34']) {
          return;
        }
        var param = {
          "domainPath": path.data,
          "modelId": 303,
          "layer": 2
        };
        resourceUIService.getDomainsByFilter(param, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.enterpriseDic[item.id] = item;
              item.text = item.label;
            })
            $scope.enterpriseList = returnObj.data;
          }
        });
      };

      $scope.protocols = [];
      $scope.protocolVersions = [];
      $scope.collectionTemplateDic = [];

      /**
       * 获得所有的协议
       */
      var getAllCollectionPlugins = function(callbackFun) {
        resourceUIService.getAllCollectionPlugins(function(returnObj) {
          var protocolDic = {};
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              if(!protocolDic[item.protocol]) {
                protocolDic[item.protocol] = item;
                $scope.protocols.push(item);
              }
              $scope.collectionTemplateDic[item.protocol + item.protocolVersion] = item.collectionTemplates;
            });
            $scope.protocolVersions = returnObj.data;
          }
          if(callbackFun) callbackFun();
        });
      };
      $scope.unComfirmedDevice = "";
      var findUnComfirmedDevice = function(selectedGateitem) {
        resourceUIService.findUnRecognizedDevice(selectedGateitem.id, function(res) {
          if(res.code == "0") {
            $scope.unComfirmedDevice = res.data;
            $scope.$broadcast(Event.CMDBINFOSINIT + "not", {
              data: res.data
            });
          }
        });
      };

      /**
       * 多选的数据处理
       */
      $scope.activeGateways = [];
      $scope.deactiveGateways = [];
      $scope.activeDevices = [];
      $scope.deactiveDevices = [];
      $scope.selectedDevices = [];
      $scope.selectedHandler = function(flg, noapply) {
        if(flg == "gateway") {
          var activeGateways = [];
          var deactiveGateways = [];
          $scope.gatewaysAry.forEach(function(gateway) {
            if(gateway.selected) {
              if(gateway.managedStatus == "active") {
                activeGateways.push(gateway);
              } else {
                deactiveGateways.push(gateway);
              }
            }
          });
          $scope.activeGateways = activeGateways;
          $scope.deactiveGateways = deactiveGateways;
          if(!noapply)
            $scope.$apply();
        } else if(flg == "device") {
          var activeDevices = [];
          var deactiveDevices = [];
          var selectedDevices = [];
          $scope.gatewayactiveDevices.forEach(function(device) {
            if(device.selected) {
              selectedDevices.push(device);
              if(device.managedStatus == "active") {
                activeDevices.push(device);
              } else {
                deactiveDevices.push(device);
              }
            }
          });
          $scope.activeDevices = activeDevices;
          $scope.deactiveDevices = deactiveDevices;
          $scope.selectedDevices = selectedDevices;
          if(!noapply)
            $scope.$apply();
        }
      };
      $scope.customerDomain = function(selCustomer){
        if(selCustomer){
          $scope.selectedGateitem.domain = $scope.customersDic[selCustomer].domainPath;
        }
      }
      $scope.changeDomain = function(domain){
        if($scope.selectedGateitem.customerId){
          var domainSel = $scope.customersDic[$scope.selectedGateitem.customerId].domainPath;
          if(domain != domainSel){
            $scope.selectedGateitem.customerId = "";
            $scope.selectedGateitem.projectId = "";
          }
        }
      }
      /**
       * 启用所选
       */
      $scope.gatesActive = function() {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.deactiveGateways.length + ' 个网关未启用状态，确认要启用吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var deactiveGateIds = [];
              $scope.deactiveGateways.forEach(function(deactiveGate) {
                deactiveGateIds.push(deactiveGate.id);
              });
              resourceUIService.activateGateways(deactiveGateIds, function(returnObj) {
                if(returnObj.code == 0) {
                  for(var i in $scope.gatewaysAry) {
                    returnObj.data.successObj.forEach(function(gate) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry[i].managedStatus = gate.managedStatus;
                        $scope.gatewaysAry[i].simulated = false;
                        return true;
                      }
                    });
                    $scope.gatewaysAry[i].selected = false;
                  }
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("启用成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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
      };

      /**
       * 
       */
      $scope.gatesSimulate = function() {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.activeGateways.length + ' 个网关启用状态。确认要进行数据仿真吗？注意：停用网关即可关闭仿真。',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var activeGateIds = [];
              $scope.activeGateways.forEach(function(activeGate) {
                activeGateIds.push(activeGate.id);
              });
              resourceUIService.activateSimulatedGateways(activeGateIds, function(returnObj) {
                if(returnObj.code == 0) {
                  for(var i in $scope.gatewaysAry) {
                    returnObj.data.successObj.forEach(function(gate) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry[i].simulated = gate.simulated;
                        return true;
                      }
                    });
                    $scope.gatewaysAry[i].selected = false;
                  }
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("仿真成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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

      /**
       * 停用所选
       */
      $scope.gatesDeactive = function() {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.activeGateways.length + ' 个网关启用状态，停用网关的操作会使该网关下所有的设备一并停用。确认要停用吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var activeGateIds = [];
              $scope.activeGateways.forEach(function(activeGate) {
                activeGateIds.push(activeGate.id);
              });
              resourceUIService.deactivateGateways(activeGateIds, function(returnObj) {
                if(returnObj.code == 0) {
                  for(var i in $scope.gatewaysAry) {
                    returnObj.data.successObj.forEach(function(gate) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry[i].managedStatus = gate.managedStatus;
                        return true;
                      }
                    });
                    $scope.gatewaysAry[i].selected = false;
                  }
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("停用成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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
      };

      /**
       * 注销所选
       */
      $scope.gatesDelete = function() {
        //注销网关
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.deactiveGateways.length + ' 个网关未启用状态，确认要注销吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var deactiveGateways = [];
              $scope.deactiveGateways.forEach(function(deactiveGateway) {
                deactiveGateways.push(deactiveGateway.id);
              });
              resourceUIService.deleteGateways(deactiveGateways, function(returnObj) {
                if(returnObj.code == 0) {
                  returnObj.data.successObj.forEach(function(gate) {
                    for(var i in $scope.gatewaysAry) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry.splice(i, 1);
                        break;
                      }
                      $scope.gatewaysAry[i].selected = false;
                    }
                  });
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("注销成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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
      };

      /**
       * 启用所选设备
       */
      $scope.devicesActive = function() {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.deactiveGateways.length + ' 个网关未启用状态，确认要启用吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var deactiveGateIds = [];
              $scope.deactiveGateways.forEach(function(deactiveGate) {
                deactiveGateIds.push(deactiveGate.id);
              });
              resourceUIService.activateGateways(deactiveGateIds, function(returnObj) {
                if(returnObj.code == 0) {
                  for(var i in $scope.gatewaysAry) {
                    returnObj.data.successObj.forEach(function(gate) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry[i].managedStatus = gate.managedStatus;
                        $scope.gatewaysAry[i].simulated = false;
                        return true;
                      }
                    });
                    $scope.gatewaysAry[i].selected = false;
                  }
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("启用成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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
      };

      /**
       * 停用所选
       */
      $scope.devicesDeactive = function() {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.activeGateways.length + ' 个网关启用状态，停用网关的操作会使该网关下所有的设备一并停用。确认要停用吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var activeGateIds = [];
              $scope.activeGateways.forEach(function(activeGate) {
                activeGateIds.push(activeGate.id);
              });
              resourceUIService.deactivateGateways(activeGateIds, function(returnObj) {
                if(returnObj.code == 0) {
                  for(var i in $scope.gatewaysAry) {
                    returnObj.data.successObj.forEach(function(gate) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry[i].managedStatus = gate.managedStatus;
                        $scope.gatewaysAry[i].simulated = false;
                        return true;
                      }
                    });
                    $scope.gatewaysAry[i].selected = false;
                  }
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("停用成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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
      };

      /**
       * 注销所选
       */
      $scope.devicesDelete = function() {
        //注销网关
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '当前有 ' + $scope.deactiveGateways.length + ' 个网关未启用状态，确认要注销吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var deactiveGateways = [];
              $scope.deactiveGateways.forEach(function(deactiveGateway) {
                deactiveGateways.push(deactiveGateway.id);
              });
              resourceUIService.deleteGateways(deactiveGateways, function(returnObj) {
                if(returnObj.code == 0) {
                  returnObj.data.successObj.forEach(function(gate) {
                    for(var i in $scope.gatewaysAry) {
                      if($scope.gatewaysAry[i].id == gate.id) {
                        $scope.gatewaysAry.splice(i, 1);
                        break;
                      }
                      $scope.gatewaysAry[i].selected = false;
                    }
                  });
                  $scope.selectedHandler("gateway", true);
                  broadcastGatewayAry($scope.gatewaysAry);
                  growl.success("注销成功" + returnObj.data.successObj.length + "个网关,失败" + returnObj.data.failObj.length + "个网关", {});
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
      };
      var getResourceBaseState = function(gatewaysAry, callbackFun) {
        var gatewaryIds = [];
        var gatewaryDic = {};
        gatewaysAry.forEach(function(gatewary) {
          gatewaryIds.push(gatewary.id);
          gatewaryDic[gatewary.id] = gatewary;
        })
        var stateCallback = function(evendata) {
          gatewaysAry.forEach(function(gatewary) {
            if(gatewary.id == evendata.data.nodeId) {
              gatewary.onlineStatus = evendata.data.value == 0 ? "离线" : "在线";
              return false;
            }
          })
          callbackFun(gatewaysAry);
        };
        kpiDataService.getRealTimeKpiData(gatewaryIds, [999998], function(returnObj) {
          if(returnObj.code == 0) {
            for(var i in returnObj.data) {
              gatewaysAry.forEach(function(gatewary) {
                if(gatewary.id == returnObj.data[i].nodeId) {
                  gatewary.onlineStatus = returnObj.data[i].value == 0 ? "离线" : "在线";
                }
              });
            }
            callbackFun(gatewaysAry);
          }
        }, true);
        //监听websocket
        if("WebSocket" in window) {
          var param = {
            ciid: gatewaryIds.toString(),
            kpi: '999998'
          };
          var operation = "register";
          //注册WebSocket
          SwSocket.register(uuid, operation, stateCallback);

          //webSocket发送请求
          SwSocket.send(uuid, operation, 'kpi', param);
        }
      };

      //注销scope时注销方法heartBeat，回调函数callback  
      $scope.$on("$destroy", function() {
        if(uuid)
          SwSocket.unregister(uuid);
      });

      /**
       * tab页的事件监听
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
            $scope.activeListTab = resourceUIService.activeListTab = aname;
            $scope.$apply();
            tabHandler();
          }
        });
      }
      /**
       * 网关拓扑图展会数据获取
       */
      var gatewayEchars = function() {
        for(var j in $scope.gatewaysAry) {
          if($scope.gatewaysObj[$scope.gatewaysAry[j].id]) {
            $scope.gatewaysObj[$scope.gatewaysAry[j].id].devices = [];
          }
        }
        resourceUIService.getDevicesByCondition({
          "gatewayIds": $scope.gatewaysIdAry
        }, function(returnObj) {
          if(returnObj.code == 0) {
            var arr = returnObj.data;
            for(var i in arr) {
              if($scope.gatewaysObj[arr[i].gatewayId]) {
                $scope.gatewaysObj[arr[i].gatewayId].devices.push(arr[i]);
              }
            }
            $scope.$broadcast(Event.ECHARTINFOSINIT + "_graph", {
              optionData: $scope.gatewaysAry,
              optionObj: $scope.gatewaysObj
            });

          }
        });
        $timeout(function() {
          $('.chart').resize()
        }, 300);
      };

      var tabHandler = function() {
        if($scope.activeListTab == "tab2") {
          getDevices($scope.selectedGateitem);
        } else if($scope.activeListTab == "tab3") {
          findUnComfirmedDevice($scope.selectedGateitem);
        } else if($scope.activeListTab == "gateway2") {
          gatewayEchars();
        }
      };

      /**
       * 初始化处理
       */
      var deferList = [];
      var uuid;
      var init = function() {
        if(initstate) return;
        uuid = Math.uuid();
        initstate = true;
        initEvent();
        querySupplier();
        $scope.queryCustomer();
        $scope.queryProject();

        // 获得根模型

        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModel = returnObj.data;
            urmpTree();
          }
        });
        var defer = $q.defer();
        $scope.gatewayConfig = {};
        $scope.defaultGatewayType = {};
        getAllCollectionPlugins(function() {
          configUIService.getConfigsByGroupName("DefaultGateWayType", function(returnObj) {
            if(returnObj.code == 0 && returnObj.data.length > 0) {
              $scope.gatewayConfig = returnObj.data[0];
              $scope.defaultGatewayType = JSON.parse(returnObj.data[0].value);
              $scope.choseGateWayTab = $scope.defaultGatewayType.type;
              var gatewayEnterpriseDic = {};
              $scope.baseConfig.gatewayManufacturer.forEach(function(item) {
                if($scope.defaultGatewayType.enterpriseIds && $scope.defaultGatewayType.enterpriseIds.search(item.id) > -1) {
                  gatewayEnterpriseDic[item.id] = item;
                  gatewayEnterpriseDic[item.id].selectCount = 0;
                  item.selected = true;
                } else {
                  item.selected = false;
                }
              })
              $scope.baseConfig.gatewayModel.forEach(function(item) {
                if($scope.defaultGatewayType.productIds && $scope.defaultGatewayType.productIds.search(item.id) > -1) {
                  gatewayEnterpriseDic[item.manufacturerId].selectCount += 1;
                  item.selected = true;
                } else {
                  item.selected = false;
                }
              })
              $scope.protocols.forEach(function(item) {
                if($scope.defaultGatewayType.protocols && $scope.defaultGatewayType.protocols.search(item.protocol) > -1) {
                  item.selected = true;
                } else {
                  item.selected = false;
                }
              })
              if($scope.defaultGatewayType.display) {

                $scope.gatewayModal = true;
              }
            }
            defer.resolve("success");
          });
        });

        deferList.push(defer.promise);

        $q.all(deferList).then(function() {
          gateWayTree();
          $scope.domainTreeQuery();
        });
      };

      $scope.gateWayProtocolFilter = function(item) {
        if(!$scope.defaultGatewayType || !$scope.defaultGatewayType.protocols) return true;
        return $scope.defaultGatewayType.protocols.search(item.protocol) > -1;
      };
      $scope.gateWayEnterPriseFilter = function(item) {
        if(!$scope.selectedGateitem || !$scope.defaultGatewayType || !$scope.defaultGatewayType.enterpriseIds) return true;
        return $scope.defaultGatewayType.enterpriseIds.search(item.id) > -1;
      };
      $scope.gateWayProductFilter = function(item) {
        if(!$scope.selectedGateitem || !$scope.defaultGatewayType || !$scope.defaultGatewayType.productIds) return true;
        return $scope.selectedGateitem.enterpriseId == item.manufacturerId && $scope.defaultGatewayType.productIds.search(item.id) > -1;
      };

      $scope.productChange = function() {
        $scope.baseConfig.gatewayModel.forEach(function(item) {
          if(item.id == $scope.selectedGateitem.productId) {
            $scope.selectedGateitem.protocol = item.protocol;
            $scope.selectedGateitem.protocolVersion = item.protocolVersion;
          }
        })
      };

      /**
       * 默认网关过滤类型
       */
      $scope.choseGateWayTab;
      $scope.choseGateWayTabHandler = function(flg) {
        $scope.choseGateWayTab = flg;
      };

      /**
       * 网关厂商选择
       */
      $scope.selectedEnterPrise = {};
      $scope.gatewayEnterpriseChose = function(enterPrise) {
        $scope.selectedEnterPrise[enterPrise.index] = enterPrise;
        enterPrise.showProduct = !enterPrise.showProduct;
        $scope.baseConfig.gatewayManufacturer.forEach(function(item) {
          if(item.id != enterPrise.id) {
            item.showProduct = false;
          }
        })
      };

      /**
       * 网关产品选择
       */
      $scope.gatewayProductChose = function(product) {
        product.selected = !product.selected;
        $scope.baseConfig.gatewayManufacturer.forEach(function(item) {
          if(item.id == product.manufacturerId) {
            if(product.selected)
              item.selectCount ? item.selectCount += 1 : item.selectCount = 1;
            else
              item.selectCount ? item.selectCount -= 1 : item.selectCount = 0;
            if(item.selectCount > 0) {
              item.selected = true;
            } else {
              item.selected = false;
            }
          }
        })
      };

      $scope.closeGateWayModal = function() {
        $scope.gatewayModal = false;
      }

      /**
       * 提交网关的配置
       */
      $scope.applyGateWayConfig = function() {
        if($scope.gatewayConfig.value != undefined){
          var updateConfig = JSON.parse($scope.gatewayConfig.value);
          updateConfig.type = $scope.choseGateWayTab;
          updateConfig.display = $scope.defaultGatewayType.display;
          if(updateConfig.type != 2) { //协议模式
            updateConfig.protocols = "";
            $scope.protocols.forEach(function(item) {
              if(item.selected)
                updateConfig.protocols += item.protocol + ",";
            })
          } else {
            updateConfig.enterpriseIds = "";
            updateConfig.productIds = "";
            $scope.baseConfig.gatewayModel.forEach(function(item) {
              if(item.selected) {
                updateConfig.enterpriseIds += item.manufacturerId + ",";
                updateConfig.productIds += item.id + ",";
              }
            })
          }
          $scope.defaultGatewayType.enterpriseIds = updateConfig.enterpriseIds;
          $scope.defaultGatewayType.productIds = updateConfig.productIds;
          $scope.defaultGatewayType.protocols = updateConfig.protocols;
          $scope.gatewayConfig.value = JSON.stringify(updateConfig);
          configUIService.saveConfig($scope.gatewayConfig, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.gatewayModal = false;
            }
          })
        }else{
          growl.warning("请检查一下您的全局配置是否配了网关类型默认设置",{});
        }

      };
      /**
       * 日志WebSocket回调方法
       */
      var logCallback = function(call){
        var msg = call.data.message +" \n "+$scope.logObj.message;
        $scope.logObj.message = msg;
        $scope.$apply();
      }
      var displayLogService = function () {
         var paramLog = [$scope.logObj.push ==="false" ? false : true,$scope.logObj.generate ==="false" ? false : true,$scope.logObj.gateway.externalGwId,$scope.logObj.level];
         resourceUIService.displayGatewayLog(paramLog, function(returnObj) {
          if(returnObj.code == 0){
            $scope.$broadcast("device_log", returnObj.data);
          }
        });
      }
      $scope.logUUid = "";
      /**
       * 网关日志点击事件处理方法
       */
      $scope.logDoAction = function (status) {
        if(status == 'start'){
          $scope.logObj.push = "true";
          $scope.logObj.generate = "true";
          displayLogService();
          $scope.logUUid = Math.uuid();
          //监听websocket
          if("WebSocket" in window) {
            var operation = "register";
            //注册WebSocket
            SwSocket.register($scope.logUUid, operation, logCallback);
            //webSocket发送请求
            SwSocket.send($scope.logUUid, operation, 'g_log', {});
            growl.info("日志开始推送了，稍等一下",{});
          }
        }else  if(status == 'end'){
          $scope.logObj.push = "false";
          $scope.logObj.generate = "false";
          displayLogService();
          SwSocket.unregister($scope.logUUid);
          $scope.logUUid = "";
        }else  if(status == 'download'){
          window.open ('' + configUIService.origin + '/gatewayLog/'+$scope.logObj.gateway.id+'.log')
        }
      }
      $scope.logDialog= function (obj) {
        // obj["saveLog"] = false;
        $scope.logObj = {"push":"true","generate":"true","level":"DEBUG","message":"","gateway":obj};
        ngDialog.open({
          template: '../partials/dialogue/collect_log.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      }
      /**
       * 标准的登录状态判定
       * 登陆后执行初始化init方法
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