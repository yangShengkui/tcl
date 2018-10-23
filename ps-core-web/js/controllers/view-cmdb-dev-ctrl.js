define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewCmdbDevCtrl', ['$scope', '$q', 'FileUploader', '$controller', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'customerProjectUIService', 'sparePartUIService',
    'SwSocket', 'Info', 'viewFlexService', 'userUIService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'faultKnowledgeUIService', '$timeout', '$route', 'configUIService',
    function($scope, q, FileUploader, $controller, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService, customerProjectUIService, sparePartUIService,
      SwSocket, Info, viewFlexService, userUIService, unitService, growl, userDomainService, userEnterpriseService, faultKnowledgeUIService, timeout, route, configUIService) {
      /* 以下是设备模板上传文档的设置 */
      $scope.serviceOrigin = userUIService.uploadFileUrl + '/api/rest/import/resourceUIService/importModel';
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
          config: 'deviceModel'
        });
        $scope.uploader.uploadAll();
        // growl.info("模板导入处理中,请耐心等待...", {});
        $scope.loadingShow = true;
      };

      $scope.$on("uploadTemplate", function(event, args) {
        if(args.response.code == 0) {
          growl.success("模板导入成功", {});
          $scope.loadingShow = false;
          queryData({});
        } else {
          $scope.loadingShow = false;
        }
      });

      $scope.uploader.onAfterAddingFile = function(fileItem) {
        if($scope.uploader.queue.length > $scope.queueLimit) {
          $scope.uploader.removeFromQueue(0);
        }
        $scope.uploadExcel();
      };
      $scope.selectObj = '';

      //xml 导出
      $scope.writeXml = function(obj) {
        location.href = '' + userUIService.uploadFileUrl + '/api/rest/download/resourceUIService/getDeviceModel/' + encodeURI(encodeURI(obj.label)) + '.xml/' + obj.id + '/';
      }

      $scope.queryDitem = {};
      $scope.modelAry = [];
      $scope.loaderValue = "";
      $scope.modelType = "";
      $scope.selectTr = "0";
      var modelId = $routeParams.modelId;
      var promises = []; //已加载列表
      var defers = []; //延期列表
      for(var i = 0; i < 1; i++) {
        defers.push(q.defer());
      }

      //设计仪表板处理事件
      $scope.modelViewEdit = function(modelId) {
        var params = {
          modelId: modelId
        }
        window.open("../app-freeboard/index.html#/template/model/dashboard/" + JSON.stringify(params), "blank");
      };

      //excel 导出
      $scope.exportModel = function() {
        location.href = '' + userUIService.uploadFileUrl + '/api/rest/export/resourceUIService/exportModel/' + $scope.selectObj.id + '.xlsx/' + $scope.selectObj.id + '/deviceModel/';
      }

      //模板复制
      $scope.copyModel = function(sel) {
        if($scope.selectTr && $scope.selectTr != 0) {
          $scope.selectTr = 0;
          growl.info("复制模板处理中,请耐心等待...", {});
          resourceUIService.copyModelDefinition(sel, function(res) {
            if(res.code == 0) {
              $scope.modelAry.push(res.data);
              growl.success("复制模板成功", {});
              $scope.$broadcast("RESOURCE", {
                data: $scope.modelAry
              });
            }
          });
        } else {
          growl.warning("请选择一个模板", {})
        }
      };

      //查询条件事件
      $scope.goSearch = function() {
        var v = {};
        if($scope.queryDitem.state > 0) {
          v[$scope.queryDitem.attributeName] = $scope.loaderValue;
          queryData(v);
        } else if(modelId) {
          v['id'] = modelId;
          queryData(v);
        } else {
          v['label'] = $scope.loaderValue;
          queryData(v);
        }
      };

      //删除设备模板
      $scope.delMod = function(data, callback) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '确认删除设备模板吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              if(data.id > 0) {
                resourceUIService.deleteModel(data.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    callback(true);
                    growl.success("删除成功");
                    var del = $scope.modelAry;
                    for(var i in del) {
                      if(del[i].id == data.id) {
                        $scope.modelAry.splice(i, 1);
                      }
                    }

                    $scope.selectTr = "0";
                  }
                });
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
      }

      //添加事件
      $scope.addMod = function(status) {
        if(status == 0) {
          window.location.href = "#/editModel/" + status + "";
        } else if(status > 0) {
          window.location.href = "#/editModel/" + status + "";
        } else {
          growl.warning('操作异常');
        }
      };

      //查询模型列表
      var queryData = function(queryObj) {
        // $scope.loaderValue = "";
        resourceUIService.getModelsByCondition(queryObj, function(resultObj) {
          if(resultObj.code == 0) {
            $scope.modelAry = resultObj.data;
            if(modelId && resultObj.data.length > 0) {
              $scope.queryDitem.state = 4;
              $scope.queryDitem.statelabel = '模板名称';
              $scope.queryDitem.attributeName = 'label'
              $scope.loaderValue = resultObj.data[0].label;
              modelId = '';
            }
            $scope.$broadcast("RESOURCE", {
              data: $scope.modelAry
            });
          }
        });
      };

      /**
       * 查询模型下面的种类
       * 暂时不知道还有没有用zhangafa
       */
      var modelTypeList = function() {
        //如果service上没有模板的类型，则重新加载
        if(!resourceUIService.modelType) {
          resourceUIService.getAllModelType(function(returnObj) {
            if(returnObj.code == 0) {
              resourceUIService.modelType = jQuery.extend({}, returnObj.data, true);
              $scope.modelType = returnObj.data;
              defers[0].resolve("success");
            };
          });
        } else {
          $scope.modelType = jQuery.extend({}, resourceUIService.modelType, true);
          defers[0].resolve("success");
        }
      };

      //初始化
      var init = function() {
        modelTypeList();
        for(var i in defers) {
          promises.push(defers[i].promise);
        }
        //所有延迟加载完成后操作
        q.all(promises).then(function(data) {
          $scope.goSearch();
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

  controllers.initController('EditModelCtrl', ['$scope', '$q', 'ngDialog', 'FileUploader', '$controller', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'customerProjectUIService', 'sparePartUIService',
    'SwSocket', 'Info', 'viewFlexService', 'userUIService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'faultKnowledgeUIService', '$timeout', '$rootScope', 'configUIService',
    function($scope, q, ngDialog, FileUploader, $controller, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService, customerProjectUIService, sparePartUIService,
      SwSocket, Info, viewFlexService, userUIService, unitService, growl, userDomainService, userEnterpriseService, faultKnowledgeUIService, timeout, $rootScope, configUIService) {
      $scope.tab = "tab1";
      $scope.modelId = $routeParams.id;
      $scope.DEVICE = 'DEVICE';
      $scope.SPAREPART = 'SPAREPART';
      $scope.editStatus = 3; //3为新增，2为修改
      $scope.isLoading = false; //标记是否可以保存
      $scope.selectedDitem = {
        "id": 0,
        "label": "",
        "modelNo": "",
        "desc": "",
        "series": ""
      }; //初始添加模型
      $scope.model = {};
      $scope.attrType = []; //属性分类
      $scope.attrList = []; //属性分类
      $scope.addAttributeType = "attr"; //用来区分是添加属性还是分类
      $scope.operateType = ""; //记录操作的状态
      $scope.attrTab = "default";
      $scope.attrTypeSort = 0;
      $scope.protocols = [];
      $scope.deleteAttrs = [];
      $scope.resolutionObj = {};
      $scope.protocolStorage = {};
      $scope.docError = {
        "name": "",
        "conter": ""
      };
      $scope.partInListDEV = []; //存储部件使用列表，用于添加
      $scope.partInListSPA = []; //存储备件使用部位列表，用于添加
      $scope.partInListSaveDEV = []; //存储部件信息列表
      $scope.partInListSaveSPA = []; ///存储备件信息列表
      var promises = []; //已加载列表
      var defers = []; //延期列表
      for(var i = 0; i < 5; i++) {
        defers.push(q.defer());
      };
      
      //初始化tab页的切换
      var initEvent = function() {
        $('#deploy a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          if($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.tab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");

          if( aname == 'tab4'){
              getDevicePartsByDeviceModelIdAndDevicePartTypeDEV();
          }
          if(aname == 'tab5'){
              getDevicePartsByDeviceModelIdAndDevicePartTypeSPA();
          }
          if(aname == 'tab6'){
              getSparePartByModelId();
          }
          // if(aname == 'tab2' && $scope.model.kpi.length > 0) {
          //   for(var idx = 0; idx < $scope.model.kpi.length; idx++) {
          //     $scope.model.kpi[idx]["index"] = $scope.model.kpi[idx]["serial"]
          //   }
          //   // 如果有特殊配置时，覆盖模板的设置
          //   if($scope.kPIsExportOrder) {
          //     for(var idx = 0; idx < $scope.model.kpi.length; idx++) {
          //       if($scope.kPIsExportOrder.value[$scope.model.kpi[idx].id]) {
          //         $scope.model.kpi[idx]["index"] = $scope.kPIsExportOrder.value[$scope.model.kpi[idx].id];
          //       }
          //     }
          //   }
          //   $scope.model.kpi.sort(function(a, b) {
          //     return Number(a.index) - Number(b.index);
          //   })
          //   timeout(function() {
          //     $scope.$broadcast("KPI", $scope.model.kpi);
          //   });
          // }

          if(aname) {
            $scope.tab = aname;
            $scope.$apply();
          }
        });
      };
      $scope.attrClick = function(t) {
        if(t.name) {
          $scope.attrTab = t.name;
          $scope.attrTypeSort = t.attrTypeSort;
        }
      };
      var cityInit = function() {
        $scope.cityChang = {
          "province": "",
          "city": "",
          "district": ""
        };
      }
      
      /**
       * 添加属性
       * type type分类   attr 属性
       * stataus  add 新增 up 修改
       * obj  修改选择的值
       */
      $scope.attribute = function(type, status, obj) {
        $scope.addAttributeType = type;
        $scope.attrError.name = "";
        $scope.attrError.prompt = "";
        cityInit();
        if(type == "attr" && status == "add") {
          $scope.addAttributeObj = {
            "id": 0,
            "label": "",
            "name": "",
            "modelId": $scope.modelId,
            "attrType": $scope.attrTab,
            "attrTypeSort": $scope.attrTypeSort,
            "uid": 0,
            "sourceValue": "",
            "canEdit": true,
            "dataType": "",
            "delId": Math.uuid(),
            "isEdit": 3,
            "taizhang":"",
            "values": {}
          };
        } else if(type == "attr" && status == "up") {
          if(obj.dataType == 'standardAddress' && obj.sourceValue) {
            var splitStr = obj.sourceValue.split(',');
            if(splitStr[0] && splitStr[0] != undefined) {
              $scope.cityChang.province = splitStr[0];
            }
            if(splitStr[1] && splitStr[1] != undefined) {
              $scope.cityChang.city = splitStr[0] + "," + splitStr[1];
            }
            if(splitStr[2] && splitStr[2] != undefined) {
              $scope.cityChang.district = splitStr[0] + "," + splitStr[1] + "," + splitStr[2];
            }
          }
          $scope.addAttributeObj = jQuery.extend(true, {}, obj);
          $scope.addAttributeObj["isEdit"] = 2;
        } else if(type == "type" && status == "up") {
          $scope.addAttributeObj = {
            "attrTypeName": obj.name,
            "updateTypeName": obj.name,
            "attrTypeSort": obj.attrTypeSort,
            "id": obj.id,
            "isEdit": 2
          };
        } else if(type == "type" && status == "add") {
          $scope.addAttributeObj = {
            "attrTypeName": "",
            "updateTypeName": "",
            "attrTypeSort": $scope.attrType.length,
            "isEdit": 3
          };
        }
        ngDialog.open({
          template: '../partials/dialogue/add_attribute.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };

      //添加数据项
      var initKpiData = function(target, source) {
        target.index = source.index == undefined ? $scope.model.kpi.length : source.index
        target.label = source.label;
        target.name = source.name;
        target.unit = source.unit;
        target.number = source.number ? source.number : '';
        target.type = source.type ? source.type : 'kpi';
        target.range = source.range;
        target.icon = source.icon;
        target.compress = source.compress ? source.compress : false;
        target.compressTime = source.compressTime ? source.compressTime : 0;
        target.deadZone = source.deadZone ? source.deadZone : false;
        target.deadZoneRange = source.deadZoneRange ? source.deadZoneRange : 0;
        target.interval = source.interval ? source.interval : false;
        target.intervalTime = source.intervalTime ? source.intervalTime : 0;
        return target;
      }
      
      $scope.addDefaultData = function(status, sel) {
        $scope.isLoading = false;
        $scope.select2Kpi = null;
        if(status == "add") {
          $scope.addDataObj = initKpiData({
            type: 'kpi'
          }, {});
          $scope.addDataObj["id"] = 0;
          $scope.addDataObj["uid"] = 0;
        } else {
          $scope.addDataObj = jQuery.extend(true, {}, sel);
        }
        $scope.operateType = "data";
        ngDialog.open({
          template: '../partials/dialogue/add_defaultdata.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };

      //修改编码
      $scope.isIndexEdit = false;
      $scope.editIndexs = function() {
        if(!$scope.isIndexEdit) {
          $scope.isIndexEdit = true;
          $scope.$broadcast("KPI", $scope.model.kpi);
        } else {
          $scope.isIndexEdit = false;
          if($scope.kPIsExportOrder) {
            $scope.model.kpi.forEach(function(kpi) {
              $scope.kPIsExportOrder.value[kpi.id] = kpi.index;
            })
          }
          $scope.model.kpi.sort(function(a, b) {
            return Number(a.index) - Number(b.index);
          })
          $scope.$broadcast("KPI", $scope.model.kpi);
          if($scope.kPIsExportOrder) {
            var saveConfig = $.extend(true, {}, $scope.kPIsExportOrder);
            saveConfig.value = JSON.stringify(saveConfig.value);
            configUIService.saveConfig(saveConfig, function(returnObj) {
              if(returnObj.code == 0) {
                configUIService.kPIsExportOrder = $scope.kPIsExportOrder;
                growl.success("编号全局配置成功",{})
              }
            })
          } else {
            $scope.saveDefaultKpis(2);
          }
        }
      }
      $scope.addData = function(status, sel) {
        $scope.isLoading = false;
        $scope.select2Kpi = null;
        if(status == "add") {
          $scope.addDataObj = initKpiData({}, {});
          $scope.addDataObj["id"] = 0;
          $scope.addDataObj["uid"] = 0;
        } else {
          $scope.addDataObj = jQuery.extend(true, {}, sel);
        }
        $scope.operateType = "data";
        ngDialog.open({
          template: '../partials/dialogue/add_data.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };
      $scope.saveDefaultKpis = function(flg) {
        var kpis = [];
        if(flg == 0) { //给空的数据项赋值
          $scope.model.kpi.forEach(function(kpi) {
            if(!kpi.compress && !kpi.interval) {
              kpi.compress = $scope.addDataObj.compress;
              kpi.compressTime = $scope.addDataObj.compressTime;
              kpi.deadZone = $scope.addDataObj.deadZone;
              kpi.deadZoneRange = $scope.addDataObj.deadZoneRange;
              kpi.interval = $scope.addDataObj.interval;
              kpi.intervalTime = $scope.addDataObj.intervalTime;
              kpis.push(kpi)
            }
          })
        } else if(flg == 1) { //覆盖所有的数据项
          $scope.model.kpi.forEach(function(kpi) {
            kpi.compress = $scope.addDataObj.compress;
            kpi.compressTime = $scope.addDataObj.compressTime;
            kpi.deadZone = $scope.addDataObj.deadZone;
            kpi.deadZoneRange = $scope.addDataObj.deadZoneRange;
            kpi.interval = $scope.addDataObj.interval;
            kpi.intervalTime = $scope.addDataObj.intervalTime;
            kpis.push(kpi)
          })
        } else {
          $scope.model.kpi.forEach(function(kpi) {
            if (kpi.index) kpi.serial = Number(kpi.index);
            kpis.push(kpi)
          })
        }

        if(kpis.length > 0) {
          resourceUIService.saveKpis($scope.modelId, kpis, function(returnObj) {
            if(returnObj.code == 0) {
              if(returnObj.data) {
                timeout(function() {
                  $scope.$broadcast("KPI", $scope.model.kpi);
                });
                growl.success("成功应用", {});
              }
              $scope.closeDialog();
            }
          });
        } else {
          growl.info("当前没有可以应用的数据项");
          $scope.closeDialog();
        }
      }

      $scope.saveKpis = function(sheetObjs) {
        if(sheetObjs) {
          var kpis = [];
          var unknows = [];
          for(var key in sheetObjs) {
            for(var i in sheetObjs[key]) {
              if(i > 0) {
                var kpi = initKpiData({
                  "id": 0,
                  "uid": 0
                }, sheetObjs[key][i]);
                if(!kpi.label || !kpi.name || !kpi.unit || !kpi.number || !kpi.type) {
                  unknows.push(kpi)
                } else {
                  kpis.push(kpi);
                }
              }
            }
          }

          if(kpis.length > 0) {
            growl.info("识别" + (kpis.length + unknows.length) + "条数据，成功" + kpis.length + "条，失败" + unknows.length + "条，开始导入识别成功数据！");
            resourceUIService.saveKpis($scope.modelId, kpis, function(returnObj) {
              if(returnObj.code == 0) {
                if(returnObj.data) {
                  returnObj.data.successObj.forEach(function(obj) {
                    $scope.model['kpi'].push(obj);
                  });
                  timeout(function() {
                    $scope.$broadcast("KPI", $scope.model.kpi);
                  });
                  growl.success("成功导入" + returnObj.data.successObj.length + "条,失败" + returnObj.data.failObj.length + "条", {});
                } else {
                  growl.warning("该导入数据出现问题，请刷新页面，查看是否导入成功");
                }
              } else {

              }
            });
          } else {
            growl.warning("该导入数据无法识别");
          }
        }
      };
      $scope.checkChang = function() {
        if($scope.addDataObj.interval) {
          $scope.addDataObj.intervalTime = 1;
        } else {
          $scope.addDataObj.intervalTime = 0;
        }
        if($scope.addDataObj.compress == false) {
          $scope.addDataObj.deadZoneRange = 0;
          $scope.addDataObj.compressTime = 0;
        }
      }
      $scope.saveKpi = function() {
        $scope.isLoading = true;
        var kpiList = $scope.model['kpi'];
        $scope.addDataObj.serial = $scope.addDataObj.index;
        $scope.addDataObj.id = $scope.addDataObj.tempId?$scope.addDataObj.tempId:$scope.addDataObj.id
        resourceUIService.saveKpi($scope.modelId, $scope.addDataObj, function(resultObj) {
          $scope.isLoading = false;
          if(resultObj.code == 0) {
            if($scope.addDataObj.id <= 0 || $scope.addDataObj.uid <= 0) {
              $scope.addDataObj.id = resultObj.data.id;
              $scope.addDataObj.uid = resultObj.data.uid;
              $scope.model['kpi'].push($scope.addDataObj);
            } else {
              for(var i in $scope.model['kpi']) {
                if($scope.model['kpi'][i].id == resultObj.data.id) {
                  $scope.model['kpi'][i] = resultObj.data;
                  $scope.model['kpi'][i].index = $scope.addDataObj.index;
                  break;
                }
              }
            }
            if($rootScope.rootModelsDic) {
              var kpiDef = resourceUIService.getKpiRangeAndUnit($scope.myOptionDic, resultObj.data);
              if(!$rootScope.rootModelsDic[$scope.modelId]) {
                $rootScope.rootModelsDic[$scope.modelId] = {};
              }
              if(!$rootScope.rootModelsDic[$scope.modelId]["kpiDic"]) {
                $rootScope.rootModelsDic[$scope.modelId]["kpiDic"] = {};
              }
              $rootScope.rootModelsDic[$scope.modelId].kpiDic[kpiDef.id] = kpiDef;
            }
            $scope.tableSearchValue = "";
            growl.success("保存成功", {});
            timeout(function() {
              $scope.$broadcast("KPI", $scope.model.kpi);
            });
            $scope.closeDialog();
          }
        });
      };
      $scope.select2Kpi = {};
      $scope.selectChange = function(sel) {
        if(sel) {
          $scope.addDataObj.label = sel.label;
          $scope.addDataObj.name = sel.name;
          $scope.addDataObj.unit = sel.unit;
          $scope.addDataObj.number = sel.number ? sel.number : '';
          $scope.addDataObj.type = sel.type ? sel.type : 'kpi';
          $scope.addDataObj.range = sel.range;
          $scope.addDataObj.icon = sel.icon;
          $scope.addDataObj.id = sel.id;
          $scope.addDataObj.values = sel.values;
          // $scope.addDataObj = jQuery.extend(true, {}, sel);
        }
      };

      //添加解析协议
      $scope.addProtocol = function(status, sel) {
        $scope.errorPoint = {
          content: ""
        };
        $scope.operateType = "protocol";
        if(status != 'add') {
          $scope.protocolObj = jQuery.extend(true, {}, sel);
          $scope.analysisChange();
        } else {
          $scope.protocolObj = {
            id: 0,
            modelId: $scope.modelId
          };
        }
        $scope.expandObj = {};
        $scope.initData();
        ngDialog.open({
          template: '../partials/dialogue/add_protocol.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };

      $scope.saveProtocol = function() {
        for(var i = $scope.protocolObj.accessConfigs.length - 1; i > -1; i--) {
          if(!$scope.protocolObj.accessConfigs[i].kpiId) {
            $scope.protocolObj.accessConfigs[i].kpiId = $scope.protocolObj.accessConfigs[i].uid ? $scope.protocolObj.accessConfigs[i].uid : $scope.protocolObj.accessConfigs[i].id;
          }
        }
        resourceUIService.saveModelConfig($scope.protocolObj, function(resultObj) {
          if(resultObj.code == 0) {
            if($scope.protocolObj.id <= 0) {
              $scope.model['config'].push(resultObj.data);
            } else {
              for(var i in $scope.model['config']) {
                if($scope.model['config'][i].id == resultObj.data.id) {
                  $scope.model['config'][i] = resultObj.data;
                  break;
                }
              }
            }
            growl.success("保存成功", {});
            $scope.closeDialog();
          }
        });
      };

      //创建采集组
      $scope.addCollection = function(status, sel) {
        $scope.directivesObj = null;
        if(status == "add") {
          $scope.taskObj = {
            taskCode: "",
            description: "",
            taskCycle: "",
            cycleUnit: "",
            kpiDefinitionIds: [],
            isEdit: 3,
            id: 0
          }
        } else {
          $scope.taskObj = jQuery.extend(true, {}, sel);
        }
        ngDialog.open({
          template: '../partials/dialogue/add_collection.html',
          scope: $scope,
          controller: "addCollectionCtrl",
          className: 'ngdialog-theme-plain'
        });
      };

      //创建指令
      $scope.addDirectives = function(status, sel) {
        $scope.taskObj = null;
        if(status == 'add') {
          $scope.directivesObj = {
            isEdit: 3,
            name: "",
            description: "",
            commandCode: "",
            kpiDefinitionIds: [],
            commandType: "",
            values: {},
            id: 0
          }
        } else {
          $scope.directivesObj = jQuery.extend(true, {}, sel);
        }
        ngDialog.open({
          template: '../partials/dialogue/add_directives.html',
          scope: $scope,
          controller: "addCollectionCtrl",
          className: 'ngdialog-theme-plain'
        });
      };

      //创建文档
      $scope.addDoc = function() {
        $scope.docUrl = 'api/rest/upload/resourceUIService/uploadModelFile';
        $scope.fileType = $scope.$parent.baseConfig.modelUploadConfig ? $scope.$parent.baseConfig.modelUploadConfig.fileType : "";
        $scope.docError.name = "";
        $scope.docError.conter = "";
        $scope.uploadParam = {
          "modelId": "",
          "name": "",
          "type": "",
          "url": "",
          "description": "",
          "postfix": "",
          "size": ""
        };
        ngDialog.open({
          template: '../partials/dialogue/add_doc.html',
          scope: $scope,
          controller: "addDocCtrl",
          className: 'ngdialog-theme-plain'
        });
      };
      
      //模型Id查模型详情
      var modeIdQueryDetails = function() {
        resourceUIService.getModelByIds([$scope.modelId], function(resObj) {
          if(resObj.code == 0) {
            $scope.selectedDitem = resObj.data[0];
            sparePart();
            defers[0].resolve("success");
          }
        });
      };

      //模型Id查属性列表
      var modeIdAttrs = function() {
        resourceUIService.getAttrsByModelId($scope.modelId, function(resObj) {
          if(resObj.code == 0) {
            $scope.model["attrs"] = resObj.data;

            // 更新模板上的属性
            if($rootScope.rootModelsDic) {
              if(!$rootScope.rootModelsDic[$scope.modelId]) {
                $rootScope.rootModelsDic[$scope.modelId] = {};
              }
              $rootScope.rootModelsDic[$scope.modelId]["attrs"] = resObj.data;
            }
            var attrTypeList = resObj.data;
            var arr = [];
            var defaultArr = [];
            for(var i in attrTypeList) {
              var obj = attrTypeList[i];
              var attr = {
                "name": "",
                "id": "",
                "attrTypeSort": "",
                "arr": []
              };
              var newObj = -1;
              if(obj.attrType == "default" && defaultArr.length > 0) {
                newObj = i;
                defaultArr[0].arr.push(obj);
              } else {
                for(var j in arr) {
                  if(arr[j].name == obj.attrType) {
                    newObj = j;
                    arr[j].arr.push(obj);
                    break;
                  }
                }
              }
              if(newObj == -1) {
                attr.name = obj.attrType;
                attr.id = obj.id;
                attr.arr.push(obj);
                if(obj.attrType == "default") {
                  attr.attrTypeSort = 0;
                  defaultArr.push(attr);
                } else {
                  attr.attrTypeSort = obj.attrTypeSort;
                  arr.push(attr);
                }
              }
            }
            var attrTypeAry = defaultArr.concat(arr);
            attrTypeAry.sort(doubleCompare(["attrTypeSort", ""], ""))
            $scope.attrType = attrTypeAry;
            defers[1].resolve("success");
          }
        });
      };

      /**
       * 获得模型下的指令
       * @param {Object} model
       */
      var getResourceDirectives = function() {
        resourceUIService.getDirectivesByModelIdNotByRole($scope.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.sort(doubleCompare(["values", "index"], "desc"));
            $scope.model["directives"] = returnObj.data;
            defers[2].resolve("success");
          };
        });
      };

      /**
       * 获得模型下的文档
       * @param {Object} model
       */
      var docInit = function() {
        resourceUIService.getUploadModelFileList($scope.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            var docList = [];
            if(returnObj.data.length > 0) {
              for(var i in returnObj.data) {
                var name = escape(decodeURIComponent(returnObj.data[i].name));
                returnObj.data[i].name = name;
                var description = escape(decodeURIComponent(returnObj.data[i].description));
                returnObj.data[i].description = description;
                docList.push(returnObj.data[i]);
              }
            }
            $scope.model["docData"] = docList;
          }
        });
      };

      //根据设备模板ID 请求设备部件列表
        var getDevicePartsByDeviceModelIdAndDevicePartTypeDEV = function() {
            resourceUIService.getDevicePartsByDeviceModelIdAndDevicePartType($scope.modelId, $scope.DEVICE, function(returnObj) {
                if (returnObj.code == 0) {
                    var arr = [];
                    $scope.partInListDEV = [];
                    $scope.partInListSaveDEV = returnObj.data;
                    for (var i in returnObj.data) {
                        var obj = returnObj.data[i];
                        obj.isEdit = 0;
                        $scope.partInListDEV.push(obj);
                    }
                    $scope.$broadcast(Event.DEVICPART, {
                        "option": [$scope.partInListDEV]
                    });
                }
            })
        };

      //添加 & 编辑部件
      var getDevicPartListDEV = function(item) {
          var newObjAry = [];
          for (var i in item) {
              var obj = item[i];
              var newObj = jQuery.extend(true, {}, obj);
              newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
              newObj.label = obj.label;
              newObj.id = obj.id;
              newObj.deviceModelId = obj.deviceModelId;
              newObj.devicePartType = obj.devicePartType;
              newObjAry.push(newObj);
          }
          $scope.$broadcast(Event.DEVICPART, {
              "option": [newObjAry]
          });
      }

        $scope.addDevicePartDEV = function() {
            for (var i in $scope.partInListDEV) {
                if ($scope.partInListDEV[i].id == 0 || $scope.partInListDEV[i].isEdit == 3) {
                    growl.warning("已存在正在编辑的设备部件", {});
                    return;
                }
            }
            var newObj = {
                "label": "",
                'isEdit': 3
            };

            $scope.partInListDEV.push(newObj);
            getDevicPartListDEV($scope.partInListDEV);
        }

      $scope.doActionInsDEV = function(type, select, callback) {
            if (type == "cancel") {
                getDevicePartsByDeviceModelIdAndDevicePartTypeDEV();
                $scope.isEditing = false;
            } else if (type == "saveSpareIn") {
                for (var i = $scope.partInListDEV.length - 1; i > -1; i--) {
                    if ($scope.partInListDEV[i].id == 0) {
                        $scope.partInListDEV.splice(i, 1);
                    } else {
                        $scope.partInListDEV[i]["isEdit"] = 0;
                    }
                }
                if (select != "" && select != null) {
                    var param = {};
                    //说明是修改项目
                    if (select.id > 0) {
                        param = {
                            'label': select.label,
                            'devicePartType': 'DEVICE',
                            'deviceModelId': $scope.modelId,
                            "id": select.id
                        };
                    } else {
                        param = {
                            'label': select.label,
                            'devicePartType': 'DEVICE',
                            'deviceModelId': $scope.modelId,
                            "id": select.id
                        };
                    }
                    resourceUIService.saveDevicePart(param, function(returnObj) {
                        if (returnObj.code == 0) {
                            callback(returnObj.data);
                            if (select.id > 0) {
                                growl.success("已成功保存设备部位", {});
                            }
                        getDevicePartsByDeviceModelIdAndDevicePartTypeDEV();
                        return;
                        }
                    })
                }
            }
        }

      //根据设备模板ID 请求备件使用列表
        var getDevicePartsByDeviceModelIdAndDevicePartTypeSPA = function() {
            resourceUIService.getDevicePartsByDeviceModelIdAndDevicePartType($scope.modelId, $scope.SPAREPART, function(returnObj) {
                if (returnObj.code == 0) {
                    var arr = [];
                    $scope.partInListSaveSPA = returnObj.data;
                    $scope.partInListSPA = [];
                    for (var i in returnObj.data) {
                        var obj = returnObj.data[i];
                        obj.isEdit = 0;
                        $scope.partInListSPA.push(obj);
                    }
                    $scope.$broadcast(Event.SPAREPARTS, {
                        "option": [$scope.partInListSPA]
                    });
                }
            })
        };

        //添加 & 编辑备件使用部位
        var getDevicPartListSPA = function(item) {
            var newObjAry = [];
            for (var i in item) {
                var obj = item[i];
                var newObj = jQuery.extend(true, {}, obj);
                newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
                newObj.label = obj.label;
                newObj.id = obj.id;
                newObj.deviceModelId = obj.deviceModelId;
                newObj.devicePartType = obj.devicePartType;
                newObjAry.push(newObj);
            }
            $scope.$broadcast(Event.SPAREPARTS, {
                "option": [newObjAry]
            });
        }

        $scope.addDevicePartSPA = function() {
            for(var i in $scope.partInListSPA) {
                if ($scope.partInListSPA[i].id == 0 || $scope.partInListSPA[i].isEdit == 3) {
                    growl.warning("已存在正在编辑的备件使用部位", {});
                    return;
                }
            }
            var newObj = {
                "label": "",
                'isEdit': 3
            };
            $scope.partInListSPA.push(newObj);
            getDevicPartListSPA($scope.partInListSPA);
        }

        $scope.doActionInsSPA = function(type, select, callback) {
            if (type == "cancel") {
                getDevicePartsByDeviceModelIdAndDevicePartTypeSPA();
            } else if (type == "saveSpareIn") {
                for (var i = $scope.partInListSPA.length - 1; i > -1; i--) {
                    if ($scope.partInListSPA[i].id == 0) {
                        $scope.partInListSPA.splice(i, 1);
                    } else {
                        $scope.partInListSPA[i]["isEdit"] = 0;
                    }
                }
                if (select != "" && select != null) {
                    var param = {};
                    //说明是修改项目
                    if (select.id > 0) {
                        param = {
                            'label': select.label,
                            'devicePartType': 'SPAREPART',
                            'deviceModelId': $scope.modelId,
                            "id": select.id
                        };
                    } else {
                        param = {
                            'label': select.label,
                            'devicePartType': 'SPAREPART',
                            'deviceModelId': $scope.modelId,
                            "id": select.id
                        };
                    }
                    resourceUIService.saveDevicePart(param, function(returnObj) {
                        if (returnObj.code == 0) {
                            callback(returnObj.data);
                            if (select.id > 0) {
                                growl.success("已成功保存设备部位", {});
                            }
                            getDevicePartsByDeviceModelIdAndDevicePartTypeSPA();
                            return;
                        }
                    })
                }
            }
        }


      //根据设备模板ID 请求备件列表
      var getSparePartByModelId = function() {
          sparePartUIService.getSparePartByModelId($scope.modelId,function(returnObj) {
              if (returnObj.code == 0) {
                  var arr = [];
                  for (var i in returnObj.data) {
                      var obj = {};
                      obj.name = returnObj.data[i].name; //备件编码
                      obj.label = returnObj.data[i].label; //备件名称
                      obj.model = returnObj.data[i].model; //备件类型
                      obj.specification = returnObj.data[i].specification; //规格型号
                      obj.manufacturer = returnObj.data[i].manufacturer; //生产厂家
                      obj.lifespan = returnObj.data[i].lifespan; //使用寿命
                      obj.startTime = returnObj.data[i].startTime; //开始使用时间
                      obj.imageUrl = returnObj.data[i].imageUrl; //附件
                      arr.push(obj);
                  }
                  $timeout(function() {
                      $scope.$broadcast(Event.SPAREPART, {
                          "option": [arr]
                      });
                  })
              }
          })
      };

      $scope.downClick = function(qualifiedName) {
        var url = userUIService.uploadFileUrl + qualifiedName;
        window.open(url);
      };
      
      $scope.modelType = [];
      $scope.modelTypeObj = {};

      /**
       * 获取设备模板种类
       * 这个方法类似于modelTypeList
       */
      $scope.getAllModelType = function() {
        //如果service上没有模板的类型，则重新加载
        if(!resourceUIService.modelType) {
          resourceUIService.getAllModelType(function(returnObj) {
            if(returnObj.code == 0) {
              resourceUIService.modelType = jQuery.extend({}, returnObj.data, true);
              $scope.modelType = returnObj.data;
              $scope.model["modelType"] = returnObj.data;
              for(var i in returnObj.data) {
                $scope.modelTypeObj["" + returnObj.data[i].valueCode + ""] = returnObj.data[i];
              }
            };
          });
        } else {
          $scope.modelType = jQuery.extend({}, resourceUIService.modelType, true);
          $scope.model["modelType"] = $scope.modelType;
          for(var i in $scope.modelType) {
            $scope.modelTypeObj["" + $scope.modelType[i].valueCode + ""] = $scope.modelType[i];
          }
        }
      };

      var attributeDispose = function(mod, modAttr) {
        if(modAttr.length > 0) {
          resourceUIService.saveAttrs(modAttr, function(resultObj) {
            if(resultObj.code == 0) {
              // PROMETHEUS-644
              if($scope.selectedDitem.id == 0) {
                $location.url("/editModel/" + mod.id);
                $location.replace();
              } else {
                modeIdAttrs();
              }
            }
          });
        }
      }
      
      //保存属性
      var saveAttribute = function(mod) {
        var attrObj = $scope.attrType;
        var modAttr = [];
        for(var i in attrObj) {
          if(attrObj[i].arr.length > 0) {
            var saveArr = attrObj[i].arr;
            for(var j in saveArr) {
              if(saveArr[j].isEdit > 0) {
                if(saveArr[j].isEdit == 3) {
                  saveArr[j].id = 0;
                }
                saveArr[j].modelId = mod.id;
                saveArr[j].attrType = attrObj[i].name;
                saveArr[j].isEdit = "0";
                modAttr.push(saveArr[j]);
              }
            }
          }
        }
        attributeDispose(mod, modAttr);
      };

      //删除功能的action
      $scope.deleteAction = function(type, sel, callback) {
        if(type == "attr") {
          if(sel.isEdit == 3) {
            var del = $scope.attrType;
            for(var i in del) {
              if(del[i].name == $scope.attrTab) {
                var tabArr = del[i].arr;
                for(var j in tabArr) {
                  if(tabArr[j].delId == sel.delId) {
                    tabArr.splice(j, 1);
                    break;
                  }
                }
              }
            }
            var arr = $scope.model["attrs"];
            for(var n in arr) {
              if(arr[n].delId == sel.delId) {
                arr.splice(n, 1);
                break;
              }
            }
          } else {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认删除属性吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  var del = $scope.attrType;
                  for(var i in del) {
                    if(del[i].name == $scope.attrTab) {
                      var tabArr = del[i].arr;
                      for(var j in tabArr) {
                        if(tabArr[j].id == sel.id) {
                          $scope.deleteAttrs.push(tabArr[j].uid);
                          tabArr.splice(j, 1);
                          break;
                        }
                      }
                    }
                  }
                  var arr = $scope.model["attrs"];
                  if(sel.uid > 0) {
                    for(var n in arr) {
                      if(arr[n].uid == sel.uid) {
                        arr.splice(n, 1);
                        break;
                      }
                    }
                  }
                  growl.success("删除成功", {});
                  growl.info("请点击“保存模板”按钮，以便对修改的内容进行保存！", {});
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
        } else if(type == "kpi") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除数据项吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteKpi($scope.modelId, sel.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    for(var i in $scope.model['kpi']) {
                      if(sel.id == $scope.model['kpi'][i].id) {
                        $scope.model['kpi'].splice(i, 1);
                        break;
                      }
                    }
                    callback(true);
                    growl.success("删除成功", {});
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
        } else if(type == "dir") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除指令吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteDirective($scope.modelId, sel.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    for(var i in $scope.model['directives']) {
                      if(sel.id == $scope.model['directives'][i].id) {
                        $scope.model['directives'].splice(i, 1);
                        break;
                      }
                    }
                    growl.success("删除成功", {});
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
        } else if(type == "protocol") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除协议吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteModelConfig(sel.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    for(var i in $scope.model['config']) {
                      if(sel.id == $scope.model['config'][i].id) {
                        $scope.model['config'].splice(i, 1);
                        break;
                      }
                    }
                    growl.success("删除成功", {});
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
        } else if(type == "task") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除数据项吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteCollectionTaskDefinitionByModelId($scope.modelId, sel.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    for(var i in $scope.model['taskData']) {
                      if(sel.id == $scope.model['taskData'][i].id) {
                        $scope.model['taskData'].splice(i, 1);
                        break;
                      }
                    }
                    growl.success("删除成功", {});
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
        } else if(type == "doc") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除文档吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteModelFile(sel, function(resultObj) {
                  if(resultObj.code == 0) {
                    for(var i in $scope.model['docData']) {
                      if(sel.id == $scope.model['docData'][i].id) {
                        $scope.model['docData'].splice(i, 1);
                        break;
                      }
                    }
                    growl.success("删除成功", {});
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
        } else if(type == "assortment") {
          var cutName = sel.name;
          var selList = $scope.attrType;
          if(sel.arr.length > 0) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '"' + cutName + '" 分类下面有子属性确认删除吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  for(var i in selList) {
                    if(selList[i].name == cutName) {
                      var arrList = selList[i].arr;
                      for(var k in arrList) {
                        if(arrList[k].id > 0) {
                          $scope.deleteAttrs.push(arrList[k].uid);
                        }
                      }
                      $scope.attrType.splice(i, 1);
                      break;
                    }
                  }

                  $scope.attrTab = "default";
                  $scope.attrTypeSort = 0;
                  growl.success("删除成功", {});
                  growl.info("请点击“保存模板”按钮，以便对修改的内容进行保存！", {});
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
            for(var i in selList) {
              if(selList[i].name == cutName) {
                $scope.attrType.splice(i, 1);
                break;
              }
            }
            /** BUG:PROMETHEUS-643 */
            $scope.attrTab = "default";
            $scope.attrTypeSort = 0;
          }
        }
      };
      $scope.UploadFile = function() {
        var docList = $scope.model['docData'];
        for(var i in docList) {
          if(docList[i].name == $scope.uploadParam.name) {
            $scope.docError.name = 'name';
            $scope.docError.conter = "文档名称已存在";
            return;
          }
        }
        $scope.formObj = {
          "modelId": $scope.modelId,
          "name": encodeURIComponent($scope.uploadParam.name),
          "description": encodeURIComponent($scope.uploadParam.description)
        };
        $scope.$broadcast("UploadFile1");
      };
      $scope.successDoc = function(obj) {
        var name = escape(decodeURIComponent(obj.name));
        obj.name = name;
        obj.description = escape(decodeURIComponent(obj.description));
        $scope.model["docData"].push(obj);
      }

      var saveModelOption = function() {
        var sel = [];
        if($scope.selSpareParts.length > 0){
          for(var i in $scope.selSpareParts){
            sel.push($scope.selSpareParts[i].id);
          }
        }
        if($scope.modelId > 0) {
          $scope.selectedDitem.sparePartIds = sel;
          resourceUIService.updateModel($scope.selectedDitem, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("保存成功", {});
              saveAttribute(returnObj.data);
              deleteAttrsAction();
            }
          });
        } else {
          $scope.selectedDitem["sparePartIds"] = sel;
          resourceUIService.addModel($scope.selectedDitem, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("保存成功", {});
              saveAttribute(returnObj.data);
            }
          });
        }
      };
      
      //删除属性
      var deleteAttrsAction = function() {
        if($scope.deleteAttrs.length > 0) {
          resourceUIService.deleteAttrs($scope.deleteAttrs, function(resultObj) {
            if(resultObj.code == 0) {
              $scope.deleteAttrs = [];
            }
          });
        }
      };

      //备模板保存按钮事件
      $scope.saveModel = function() {
        if($.trim($scope.selectedDitem.label) == "" || $scope.selectedDitem.label == null) {
          growl.warning("模板名称不能为空", {});
          return;
        }
        for(var j in $scope.attrType) {
          if($scope.attrType[j].arr.length <= 0) {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '存在没有配置属性信息的属性分类，空的属性分类系统将不会保存，确认保存吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  saveModelOption();
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  dialogRef.close();
                }
              }]
            });
            return;
          }
        }

        saveModelOption();
      };

      /**
       * 获得模型下的任务
       * @param {Object} model
       */
      var taskInit = function() {
        resourceUIService.findCollectionTaskDefinitionByModelId($scope.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.model["taskData"] = returnObj.data;
          }

        });
      };

      /**
       * 模型上的协议
       */
      var modelConfig = function() {
        resourceUIService.getModelConfigByModelId($scope.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            if(returnObj.data) {
              var configList = returnObj.data;
              $scope.model['config'] = returnObj.data;
            } else {
              $scope.model['config'] = [];
            }
          }
        });
      };
      
      /**
       * 模型上的数据项
       */
      var modelKpi = function() {
        resourceUIService.getDataItemsByModelId($scope.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            //去掉KQI
            var tempkpis = [];
            for(var i in returnObj.data) {
              var kpiDef = returnObj.data[i];
              if(kpiDef.type) {
                tempkpis.push(kpiDef)
              }
            }
            $scope.model["kpi"] = tempkpis;
            defers[3].resolve("success");
          };
        });
      };

      /**
       * 查询模型下面的默认属性
       */
      var defaultAttrs = function() {
        resourceUIService.getdefaultAttrs(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.model["attrs"] = returnObj.data;
            var arr = [];
            var attrType = returnObj.data;
            for(var i in attrType) {
              var obj = attrType[i];
              var attr = {
                "name": "",
                "id": "",
                "arr": []
              };
              var newObj = -1;
              for(var j in arr) {
                if(arr[j].name == obj.attrType) {
                  newObj = j;
                  obj["isEdit"] = 2;
                  obj["uid"] = 0;
                  arr[j].arr.push(obj);
                  break;
                }
              }
              if(newObj == -1) {
                attr.name = obj.attrType;
                obj["isEdit"] = 2;
                obj["uid"] = 0;
                attr.arr.push(obj);
                arr.push(attr);
              }
            }
            $scope.attrType = arr;
          }
        });
      };
      
      $scope.dataTypeObj = {};

      $scope.resolutionProtocol = function(protocol, callback) {
        if($scope.resolutionObj[protocol] != "" && $scope.resolutionObj[protocol] != undefined) {
          return;
        } else {
          resourceUIService.getAllResolutionProtocol(protocol, function(resultObj) {
            if(resultObj.code == 0) {
              $scope.resolutionObj[protocol] = resultObj.data
              if(callback) {
                callback();
              }
              return;
            }
          });
        }
      };
      
      /**弹出操作事件 start**/
      $scope.attrError = {
        "name": "",
        "prompt": ""
      }; //属性异常处理
      
      //保存分类
      $scope.saveType = function() {
        var typeName = $scope.addAttributeObj.attrTypeName;
        var updateTypeName = $scope.addAttributeObj.updateTypeName;
        var isEdit = $scope.addAttributeObj.isEdit;
        var id = $scope.addAttributeObj.id;
        var attrTypeSort = $scope.addAttributeObj.attrTypeSort;
        var typeList = $scope.attrType;
        $scope.attrTab = typeName;
        $scope.attrTypeSort = attrTypeSort;
        if(typeName == 'default' || typeName == '基础属性') {
          $scope.attrError.name = "type";
          $scope.attrError.prompt = "系统分类不能创建";
          return;
        }
        //新增
        if(isEdit == 3) {
          var addType = {
            "name": "",
            "id": "",
            "attrTypeSort": "",
            "arr": []
          };
          for(var i in typeList) {
            if(typeList[i].name == typeName) {
              $scope.attrError.name = "type";
              $scope.attrError.prompt = "分类名称已存在";
              return;
            }
          }
          addType.name = typeName;
          addType.attrTypeSort = attrTypeSort;
          addType.id = "" + Math.uuid() + "";
          $scope.attrType.push(addType);
        } else if(isEdit == 2) {
          for(var i in typeList) {
            if(typeList[i].id != id && typeList[i].name == typeName) {
              $scope.attrError.name = "type";
              $scope.attrError.prompt = "分类名称已存在";
              return;
            }
          }

          for(var n in typeList) {
            if(typeList[n].name == updateTypeName) {
              typeList[n].name = typeName;
              var selArr = typeList[n].arr;
              if(selArr.length > 0) {
                for(var j in selArr) {
                  if(selArr[j].id > 0) {
                    selArr[j]["attrType"] = typeName;
                    selArr[j]["attrTypeSort"] = attrTypeSort;
                    selArr[j]["isEdit"] = 2;
                  }
                }
                break;
              } else {
                typeList[n].attrType = typeName;
                typeList[n].attrTypeSort = attrTypeSort;
                typeList[n].isEdit = 2;
              }
            }
          }
        }

        growl.info("请点击“保存模板”按钮，以便对修改的内容进行保存！", {});
        $scope.closeDialog();
      };

      //保存属性
      $scope.saveAttrs = function() {
        if($.trim($scope.addAttributeObj.name) == "" || $scope.addAttributeObj.name == null) {
          $scope.attrError.name = "name";
          $scope.attrError.prompt = "属性名称不能为空";
          return;
        }
        if($.trim($scope.addAttributeObj.label) == "" || $scope.addAttributeObj.label == null) {
          $scope.attrError.name = "label";
          $scope.attrError.prompt = "显示名称不能为空";
          return;
        }
        var arrType = $scope.model["attrs"];

        for(var j in arrType) {
          if($scope.addAttributeObj.id > 0) {
            if(arrType[j].id != $scope.addAttributeObj.id && arrType[j].name == $scope.addAttributeObj.name) {
              growl.warning("属性名称已存在", {});
              return;
            } else if(arrType[j].id != $scope.addAttributeObj.id && arrType[j].label == $scope.addAttributeObj.label) {
              growl.warning("显示名称已存在", {});
              return;
            }
            if(arrType[j].id == $scope.addAttributeObj.id) {
              arrType[j] = $scope.addAttributeObj;
              break;
            }
          } else {
            if(arrType[j].delId != $scope.addAttributeObj.delId && arrType[j].name == $scope.addAttributeObj.name) {
              growl.warning("属性名称已存在", {});
              return;
            } else if(arrType[j].delId != $scope.addAttributeObj.delId && arrType[j].label == $scope.addAttributeObj.label) {
              growl.warning("显示名称已存在", {});
              return;
            }
            if(arrType[j].delId == $scope.addAttributeObj.delId) {
              arrType[j] = $scope.addAttributeObj;
              break;
            }
          }
        }

        if($scope.addAttributeObj.dataType == 'standardAddress') {
          $scope.addAttributeObj.sourceValue = "";
          if($scope.cityChang.district) {
            $scope.addAttributeObj.sourceValue = $scope.cityChang.district;
          } else if($scope.cityChang.city) {
            $scope.addAttributeObj.sourceValue = $scope.cityChang.city;
          } else {
            $scope.addAttributeObj.sourceValue = $scope.cityChang.province;
          }
        }

        if($scope.addAttributeObj.isEdit == 3) {
          // $scope.attrType[$scope.addAttributeObj.attrType].push($scope.addAttributeObj);
          var sArr = $scope.attrType;
          for(var n in sArr) {
            if(sArr[n].name == $scope.addAttributeObj.attrType) {
              sArr[n].arr.push($scope.addAttributeObj);
              $scope.model["attrs"].push($scope.addAttributeObj);
              break;
            }
          }
        } else {
          var sArr = $scope.attrType;
          for(var i in sArr) {
            if(sArr[i].name == $scope.addAttributeObj.attrType) {
              var editArr = sArr[i].arr;
              for(var j in editArr) {
                if(editArr[j].id == $scope.addAttributeObj.id) {
                  editArr[j] = $scope.addAttributeObj;
                  break
                }
              }
            }
          }
        }

          // $scope.selected = [];
          // $scope.selectedTags = [];
          //
          // var updateSelected = function(action,id,name){
          //     if(action == 'add' && $scope.selected.indexOf(id) == -1){
          //         $scope.selected.push(id);
          //         $scope.selectedTags.push(name);
          //     }
          //     if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
          //         var idx = $scope.selected.indexOf(id);
          //         $scope.selected.splice(idx,1);
          //         $scope.selectedTags.splice(idx,1);
          //     }
          // }
          //
          // $scope.updateSelection = function($event, id){
          //     var checkbox = $event.target;
          //     var action = (checkbox.checked?'add':'remove');
          //     updateSelected(action,id,checkbox.name);
          // }
          //
          // $scope.isSelected = function(id){
          //     return $scope.selected.indexOf(id)>=0;
          // }

        growl.info("请点击“保存模板”按钮，以便对修改的内容进行保存！", {});
        $scope.closeDialog();
      };

      var getWayKpiInit = function(devkpi, base) {
        devkpi["kpiId"] = devkpi.uid ? devkpi.uid : devkpi.id;
        devkpi["kpiName"] = devkpi.name;
        devkpi["dataTypeId"] = base.dataTypeId; //数据类型
        devkpi["registers"] = base.registers;
        devkpi["config"] = base.config;
        devkpi["readExpression"] = base.readExpression;
        devkpi["writeExpression"] = base.writeExpression;
        devkpi["serialNumStatus"] = false;
        devkpi["config"]["startPoint"] = base.startPoint; //起始地址
        devkpi["config"]["length"] = base.length; //字节长度
        devkpi["config"]["mainAddr"] = base.mainAddr; //主地址
        devkpi["config"]["subAddr"] = base.subAddr; //子地址
        devkpi["config"]["bdAddr"] = base.bdAddr; //BD地址
        devkpi["config"]["scale"] = base.scale; //浮点类型
        devkpi["config"]["option"] = false;
      };
      $scope.regsKpiList = {};
      //ng-repeat 通过filter精确匹配
      $scope.func = function(e) {
        return e.name == $scope.attrTab;
      }
      
      /**
       * 根据数据类型过滤寄存器
       * @param size 字节长度
       * @param kpiId  数据项id
       */
      $scope.dataByte = function(kpi) {
        var arr = ["单精度浮点", "双精度浮点", "ubytef", "bytef", "ushortf", "shortf", "uintf", "intf", "ulongf", "longf"];
        var serialNumStatus = false;

        var dataType = $scope.allDataTypes;
        var dataObj = {};
        for(var i in dataType) {
          if(dataType[i].id == kpi.dataTypeId) {
            dataObj = dataType[i];
            break;
          }
        }
        if($.inArray(dataObj.name, arr) != -1) {
          serialNumStatus = true;
        }
        if($scope.expandObj[kpi.kpiId]) {
          $scope.expandObj[kpi.kpiId].serialNumStatus = serialNumStatus;
        } else {
          kpi.serialNumStatus = serialNumStatus;
          $scope.expandObj[kpi.kpiId] = kpi;
        }
        if($scope.protocolObj.accessProtocol == 'flexem' && $scope.protocolObj.analysisProtocol) {
          var resolution = function(arr, kpi) {
            var resolutionProtocol = $scope.resolutionProtocolDic[$scope.protocolObj.analysisProtocol].regs;
            var protocolList = [];
            for(var j in resolutionProtocol) {
              if($.inArray(resolutionProtocol[j].extAttributes.ioWidth, arr) >= 0) {
                protocolList.push(resolutionProtocol[j]);
              }
            }
            $scope.regsKpiList[kpi.kpiId] = protocolList;
          };
          kpi.kpiRegisters = [];

          switch(dataObj.byteSize) {
            case 1:
              resolution([0], kpi);
              break;
            case 2:
              resolution([2], kpi);
              break;
            case 4:
              resolution([2, 4], kpi);
              break;
            case 8:
              resolution([2, 4, 8], kpi);
              break;
            default:
              $scope.regsKpiList[kpi.kpiId] = [];
          }

        }
      };
      
      $scope.reg = function(kpi, config) {
        if($scope.protocolObj.resolutionProtocol) {
          $scope.protocolObj.resolutionProtocol.regs.forEach(function(regSelect) {
            if(kpi.registers == regSelect.label) {
              kpi.kpiRegisters = regSelect.attributes;
              return true;
            }
          })
        }
      };
      
      $scope.analysisChange = function() {
        if($scope.protocolObj.id <= 0) {
          $scope.errorPoint = {};
          var configList = $scope.model['config'];
          for(var i in configList) {
            if($scope.protocolObj.analysisProtocol && (configList[i].accessProtocol == $scope.protocolObj.accessProtocol && configList[i].analysisProtocol == $scope.protocolObj.analysisProtocol)) {
              $scope.errorPoint.name = 'analysisProtocol';
              $scope.errorPoint.content = '解析协议已存在';
              // $scope.protocolObj.accessConfigs = [];
              return;
            }
          }
        }
      };
      
      //高级选项切换
      $scope.expandObj = {};
      $scope.optionExpand = function(kpi) {
        if($scope.expandObj[kpi.kpiId]) {
          if($scope.expandObj[kpi.kpiId].option == true) {
            $scope.expandObj[kpi.kpiId].option = false;
          } else {
            $scope.expandObj[kpi.kpiId].option = true;
          }
          return;
        } else {
          kpi.option = true;
          $scope.expandObj[kpi.kpiId] = kpi;
        }
      };
      
      //初始化数据项
      $scope.initData = function() {
        var modelKpis = $scope.model['kpi'];
        var gatList = [];
        modelKpis.forEach(function(modelkpi) {
          var devkpi = jQuery.extend(true, {}, modelkpi);
          if($scope.protocolObj.accessConfigs) {
            var oldKpi = false; //初始化过的数据

            $scope.protocolObj.accessConfigs.forEach(function(configkpi) {
              if(devkpi.uid == configkpi.kpiId) {
                oldKpi = true;
                configkpi.kpiName = devkpi.name;
                if($scope.protocolObj.id <= 0) {
                  configkpi.dataTypeId = '';
                  configkpi.registers = '';
                  configkpi.option = false;
                  configkpi.kpiRegisters = [];
                } else {
                  if($scope.protocolObj.accessProtocol == 'modbus') {
                    configkpi.registers = parseInt(configkpi.registers);
                  }

                  if(configkpi.config && configkpi.config.scale != undefined) {
                    if(configkpi.config.scale != undefined) {
                      configkpi.config.scale = parseInt(configkpi.config.scale);
                    }
                  }
                }
                gatList.push(configkpi);
                return true;
              }
            });
            if(!oldKpi) {
              getWayKpiInit(devkpi, {
                config: {}
              });
              gatList.push(devkpi);
            }
          } else {
            getWayKpiInit(devkpi, {
              config: {}
            });
            gatList.push(devkpi);
          }
        });
        $scope.protocolObj.accessConfigs = gatList;
      }
      /**弹出操作事件 end**/
     
      //查询解析协议
      var getAllResolutionProtocols = function() {
        if(!resourceUIService.resolutionProtocols) {
          resourceUIService.getAllResolutionProtocol("", function(resultObj) {
            if(resultObj.code == 0) {
              $scope.resolutionProtocolDic = {};
              resultObj.data.forEach(function(item) {
                $scope.resolutionProtocolDic[item.label] = item;
              })
              $scope.resolutionProtocols = resultObj.data;
              resourceUIService.resolutionProtocols = $scope.resolutionProtocols;
              resourceUIService.resolutionProtocolDic = $scope.resolutionProtocolDic;
            }
          });
        } else {
          $scope.resolutionProtocols = resourceUIService.resolutionProtocols;
          $scope.resolutionProtocolDic = resourceUIService.resolutionProtocolDic;
        }
      };
      
      //获得所有的接入协议
      var getAllCollectionPlugins = function() {
        if(!resourceUIService.protocolVersions) {
          resourceUIService.getAllCollectionPlugins(function(returnObj) {
            var protocolDic = {};
            if(returnObj.code == 0) {
              returnObj.data.forEach(function(item) {
                if(!protocolDic[item.protocol]) {
                  protocolDic[item.protocol] = item;
                  $scope.protocols.push(item);
                }
              });
              $scope.protocolVersions = returnObj.data;
              resourceUIService.protocols = $scope.protocols;
              resourceUIService.protocolVersions = $scope.protocolVersions;
            }
          });
        } else {
          $scope.protocols = resourceUIService.protocols;
          $scope.protocolVersions = resourceUIService.protocolVersions;
        }
      };
      
      // 处理数据的类型
      var dataTypeInit = function() {
        var dataTypehander = function() {
          var dataTypeList = $scope.myDicts['DataType'];
          var propsList = $scope.myDicts['specialtyProps'];
          for(var i in dataTypeList) {
            $scope.dataTypeObj[dataTypeList[i].valueCode] = dataTypeList[i];
          }
          if(propsList && propsList.length > 0) {
            //通过后端字典获取
            var specialtyProps = [];
            var specialtyPropsDic = {};
            for(var i in propsList) {
              specialtyProps.push({
                value: propsList[i].valueCode,
                label: propsList[i].label
              });
              specialtyPropsDic[propsList[i].valueCode] = propsList[i].label;
            }
            $scope.specialtyProps = specialtyProps;
            $scope.specialtyPropsDic = specialtyPropsDic;
          }
        }
        if($scope.myDicts) {
          dataTypehander();
        } else {
          var myDictsWatch = $scope.$watch("myDicts", function(n, o) {
            if(n) {
              myDictsWatch();
              dataTypehander();
            }
          })
        }
      };

      // 获得KPI导出的顺序
      var queryExpInitObj = function() {
        $scope.kPIsExportOrder = configUIService.kPIsExportOrder;
        if(!$scope.kPIsExportOrder) {
          configUIService.getConfigsByGroupName("KPIsExportOrder", function(returnObj) {
            if(returnObj.code == 0 && returnObj.data.length > 0) {
              if(returnObj.data[0].value) {
                returnObj.data[0].value = JSON.parse(returnObj.data[0].value);
              }
              $scope.kPIsExportOrder = returnObj.data[0];
              configUIService.kPIsExportOrder = returnObj.data[0];
            }
            defers[4].resolve("success");
          });
        } else {
          if(Object.prototype.toString.call($scope.kPIsExportOrder.value) !== "[object Object]") {
            $scope.kPIsExportOrder.value = JSON.parse($scope.kPIsExportOrder.value);
          }
          defers[4].resolve("success");
        }
      };
      //获得系统内置的KPI定义
      function initDefaultKpis() {
        resourceUIService.getKpiTypeByFilter({}, function(returnObj) {
          if(returnObj.code == 0) {
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              obj.text = obj.label;
              newObj.push(obj);
            });
            $scope.defaultKpiList = newObj;
          }
        });
      };
      //获取所有备件
      $scope.sparePartsArray = {};
      $scope.allSpareParts = [];
      $scope.selSpareParts = [];
      $scope.selSparePartsModel = "";
      var sparePart = function () {
        sparePartUIService.getAllSpareParts(function (data) {
          if (data.code == 0) {
            var newObj = [];
            data.data.forEach(function (obj) {
              obj.text = obj.name;
              $scope.sparePartsArray[obj.id] = obj;
              newObj.push(obj);
            });
            $scope.allSpareParts = newObj;
            if($scope.modelId > 0) {
              var selectedDitem = $scope.selectedDitem;
              if (selectedDitem && selectedDitem.sparePartIds && selectedDitem.sparePartIds.length > 0) {
                var sparePartArr = selectedDitem.sparePartIds;
                for (var j in sparePartArr) {
                  if ($scope.sparePartsArray[sparePartArr[j]]) {
                    $scope.allSpareParts.splice(jQuery.inArray($scope.sparePartsArray[sparePartArr[j]],$scope.allSpareParts),1);
                    $scope.selSpareParts.push($scope.sparePartsArray[sparePartArr[j]]);
                  }
                }
              }
            }
          }
        });
      }
      $scope.sparePartsAction = function (select , type) {
        if(type == "add"){
          for(var i in $scope.allSpareParts) {
            if($scope.allSpareParts[i].id == $scope.selSparePartsModel) {
              $scope.selSpareParts.push($scope.allSpareParts[i]);
              $scope.allSpareParts.splice(i, 1);
              break;
            }
          }
        }else if(type == "del"){
          for(var i in $scope.selSpareParts) {
            if($scope.selSpareParts[i].id == select.id) {
              $scope.selSparePartsModel = select.id;
              $scope.allSpareParts.push($scope.selSpareParts[i]);
              $scope.selSpareParts.splice(i, 1);
              break;
            }
          }
        }
      }
      //查询所有的设备模板
      var modelList = function() {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.modelListSelect = returnObj.data;
          }
        })
      };

      // 初始化
      var init = function() {
        modelList();
        initDefaultKpis();
        queryExpInitObj();
        dataTypeInit();
        getAllCollectionPlugins();
        getAllResolutionProtocols();
        $scope.getAllModelType();
        //如果这个模板Id大于0，那么就编辑，否则就是新建
        if($scope.modelId > 0) {
          modeIdQueryDetails();
          modeIdAttrs();
          modelKpi();
          modelConfig();
          taskInit();
          docInit();
          getResourceDirectives();
        } else {
          defaultAttrs();
          sparePart();
        }

        for(var i in defers) {
          promises.push(defers[i].promise);
        }
        
        //所有延迟加载完成后操作
        q.all(promises).then(function(data) {
          initEvent();
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

  controllers.initController('addCollectionCtrl', ['$scope', '$rootScope', 'ngDialog', 'FileUploader', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'customerProjectUIService', 'sparePartUIService',
    'SwSocket', 'Info', 'viewFlexService', 'userUIService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'faultKnowledgeUIService', 'solutionUIService', '$route',
    function($scope, $rootScope, ngDialog, FileUploader, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService, customerProjectUIService, sparePartUIService,
      SwSocket, Info, viewFlexService, userUIService, unitService, growl, userDomainService, userEnterpriseService, faultKnowledgeUIService, solutionUIService, route) {
      $scope.selectData = {
        "optional": "",
        "noOptional": ""
      };
      $scope.dirError = {
        "name": "",
        "txt": ""
      };
      var kpiDir = jQuery.extend(true, [], $scope.model['kpi']);
      $scope.selectValueLeft = [];
      $scope.selectValueRight = [];
      var dirKpiList = [];
      if($scope.directivesObj && $scope.directivesObj.id > 0) {
        dirKpiList = $scope.directivesObj.kpiDefinitionIds;
      } else if($scope.taskObj && $scope.taskObj.id > 0) {
        dirKpiList = $scope.taskObj.kpiDefinitionIds;
      }
      if(dirKpiList.length > 0) {
        for(var j = 0; j < dirKpiList.length; j++) {
          var index = -1;
          for(var i = 0; i < kpiDir.length; i++) {
            if(kpiDir[i].uid == dirKpiList[j]) {
              index = i;
              break;
            }
          }
          if(index > -1) {
            $scope.selectValueRight.push(kpiDir.splice(index, 1)[0]);
          }
        }
        $scope.selectValueLeft = kpiDir;
      } else {
        $scope.selectValueLeft = kpiDir;
      }

      var updateTask = function(obj) {
        resourceUIService.saveCollectionTaskDefinitionByModelId($scope.modelId, [obj], function(res) {
          if(res.code == "0") {
            if($scope.taskObj.id > 0) {
              for(var i in $scope.model['taskData']) {
                if($scope.model['taskData'][i].id == res.data[0].id) {
                  $scope.model['taskData'][i] = res.data[0];
                  break;
                }
              }
              growl.success("修改成功", {});
            }
          }
          $scope.closeDialog();
        });
      };
      $scope.clearError = function() {
        $scope.dirError.name = "";
        $scope.dirError.txt = "";
      }
      $scope.saveCollection = function() {
        var direct = $scope.model['taskData'];
        for(var d in direct) {
          if(direct[d].taskCode == $scope.taskObj.taskCode && $scope.taskObj.id != direct[d].id) {
            /* $scope.dirError.name = "taskCode";
             $scope.dirError.txt = "分组编码不能重复";*/
            growl.warning("分组编码不能重复", {});
            return;
          }
        }
        if($scope.taskObj.id > 0) {
          if($scope.selectValueRight.length > 0) {
            var list = [];
            $("#valueRight option").each(function() {
              var val = $(this).val(); //获取单个value
              // list.push(val.split(":")[1]);
              list.push(val);
            });
            $scope.taskObj.kpiDefinitionIds = list;
            updateTask($scope.taskObj);
          }
        } else {
          resourceUIService.addCollectionTaskDefinitionByModelId($scope.modelId, $scope.taskObj, function(res) {
            if(res.code == "0") {
              growl.success("保存成功", {});
              $scope.model['taskData'].push(res.data);
              if($scope.selectValueRight.length > 0) {
                var list = [];
                $("#valueRight option").each(function() {
                  var val = $(this).val(); //获取单个value
                  list.push(val);
                });
                res.data.kpiDefinitionIds = list;
                updateTask(res.data);
              }
              $scope.closeDialog();
            }
          });
        }
      };

      $scope.saveDirectives = function() {
        var direct = $scope.model['directives'];
        for(var d in direct) {
          if(direct[d].commandCode == $scope.directivesObj.commandCode && $scope.directivesObj.id != direct[d].id) {
            /*  $scope.dirError.name = "commandCode";
             $scope.dirError.txt = "指令编码不能重复";*/
            growl.warning("指令编码不能重复", {});
            return;
          }
          if(direct[d].name == $scope.directivesObj.name && $scope.directivesObj.id != direct[d].id) {
            /*$scope.dirError.name = "name";
            $scope.dirError.txt = "指令名称不能重复"*/
            growl.warning("指令名称不能重复", {});
            return;
          }
        }
        var list = [];
        if($scope.selectValueRight.length > 0) {
          $("#valueRight option").each(function() {
            var val = $(this).val(); //获取单个value
            // list.push(val.split(":")[1]);
            list.push(val);
          });
        }
        $scope.directivesObj.kpiDefinitionIds = list;
        resourceUIService.saveDirective($scope.modelId, $scope.directivesObj, function(res) {
          if(res.code == "0") {
            growl.success("保存成功", {});
            if($scope.directivesObj.id <= 0) {
              $scope.model['directives'].push(res.data);
            } else {
              for(var i in $scope.model['directives']) {
                if($scope.model['directives'][i].id == res.data.id) {
                  $scope.model['directives'][i] = res.data;
                  break;
                }
              }
            }
            $scope.model['directives'].sort(doubleCompare(["values", "index"], "desc"));

            //更新模板上的指令
            if($rootScope.rootModelsDic) {
              if(!$rootScope.rootModelsDic[$scope.modelId]) $rootScope.rootModelsDic[$scope.modelId] = {};
              $rootScope.rootModelsDic[$scope.modelId]["directives"] = $scope.model['directives'];
            }

            $scope.isLoading = true;
            $scope.closeDialog();
          }
        });
      };

      $scope.selectRight = function() {
        if($scope.selectData.optional && $scope.selectData.optional.length > 0) {
          var opt = $scope.selectData.optional;
          var sel = $scope.selectValueLeft;
          for(var j in opt) {
            for(var i in sel) {
              if(opt[j] == sel[i].id) {
                $scope.selectValueRight.push(sel[i]);
                $scope.selectValueLeft.splice(i, 1);
                break;
              }
            }
          }
        }
      };

      $scope.selectLeft = function() {
        if($scope.selectData.noOptional && $scope.selectData.noOptional.length > 0) {
          var sel = $scope.selectValueRight;
          var opt = $scope.selectData.noOptional;
          for(var j in opt) {
            for(var i in sel) {
              if(opt[j] == sel[i].uid) {
                $scope.selectValueLeft.push(sel[i]);
                $scope.selectValueRight.splice(i, 1);
                break;
              }
            }
          }
        }
      };

      //右边向上按钮
      $scope.leftUp = function() {
        var index = $('#valueRight option').index($('#valueRight option:selected:first'));
        var $recent = $('#valueRight option:eq(' + (index - 1) + ')');
        if(index > 0) {
          var $options = $('#valueRight option:selected').remove();
          setTimeout(function() {
            $recent.before($options)
          }, 10);
        }
      };

      //右边向下按钮
      $scope.leftDown = function() {
        var index = $('#valueRight option').index($('#valueRight option:selected:last'));
        var len = $('#valueRight option').length - 1;
        var $recent = $('#valueRight option:eq(' + (index + 1) + ')');
        if(index < len) {
          var $options = $('#valueRight option:selected').remove();
          setTimeout(function() {
            $recent.after($options)
          }, 10);
        }
      };
    }
  ]);
  
  controllers.initController('addDocCtrl', ['$scope', 'FileUploader', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'sparePartUIService',
    'SwSocket', 'Info', 'viewFlexService', 'userUIService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'solutionUIService', '$route',
    function($scope, FileUploader, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService, sparePartUIService,
      SwSocket, Info, viewFlexService, userUIService, unitService, growl, userDomainService, userEnterpriseService, solutionUIService, route) {

      /* * * * * * * * * * * * * * * * * *  以下上传功能模块 * * * * * * * * * * * * * * * * * */
      var uploader = $scope.uploader = new FileUploader({
        // url: '' + userUIService.uploadFileUrl + '/api/rest/upload/resourceUIService/uploadModelFile',
        url: '' + userUIService.uploadFileUrl + '/' + $scope.docUrl + '',
        withCredentials: true, // 跨域
        queueLimit: 1, //文件个数
        removeAfterUpload: false //上传后删除文件
      });
      uploader.filters.push({
        name: 'fileFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
          var nameAry = item.name.split(".");
          var type = nameAry[nameAry.length - 1];
          var fileSize = $scope.$parent.$parent.baseConfig.modelUploadConfig ? ($scope.$parent.$parent.baseConfig.modelUploadConfig.fileSize ? $scope.$parent.$parent.baseConfig.modelUploadConfig.fileSize : 5) : 5;
          if((item.size / 1024) > fileSize * 1024) {
            $scope.docError.name = 'error';
            $scope.docError.conter = "您选择的文件大于" + fileSize + "M，请重新选择";
            return false;
          } else {
            $scope.docError.name = '';
            $scope.docError.conter = "";
          }

          $scope.uploadParam.url = item.name;

          return true;
        }
      });
      uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem.name);
      };
      uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        uploader.clearQueue();
        uploader.destroy();
        $scope.uploadParam.url = item.name;
        console.info('onWhenAddingFileFailed', item.name);
      };
      uploader.onBeforeUploadItem = function(item) {
        Array.prototype.push.apply(item.formData, uploader.formData);
        console.info('onBeforeUploadItem', item);
      };
      $scope.clearItems = function() { //重新选择文件时，清空队列，达到覆盖文件的效果
        uploader.clearQueue();
      }
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(response.code == 0) {
          uploader.clearQueue();
          uploader.destroy();

          $scope.successDoc(response.data);
          uploader.formData = [];
          growl.success("上传文件成功", {});
          $scope.isLoading = false;
          $scope.closeDialog();
        } else {
          growl.error(response.message, {});
          $scope.isLoading = false;
        }
      };
      $scope.nameChange = function() {
        $scope.docError.name = '';
        $scope.docError.conter = "";
      }
      uploader.onErrorItem = function(fileItem, response, status, headers) {
        growl.warning("上传文件失败", {});
        $scope.isLoading = false;
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      $scope.$on("UploadFile1", function(event, args) {
        if(!uploader.queue || uploader.queue.length == 0) {
          // growl.warning("请选择一个文件", {});
          $scope.docError.name = 'error';
          $scope.docError.conter = "请选择一个文件";
          return;
        }
        $scope.isLoading = true;
        uploader.formData.push($scope.formObj);
        uploader.uploadAll();
      });
    }
  ]);
});