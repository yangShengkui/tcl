define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('DeviceFacilityCtrl', ['$scope', '$q', '$routeParams', 'growl','$location', 'userUIService', 'userEnterpriseService', 'kpiDataService', 'resourceUIService', 'Info',
    'viewFlexService', 'userDomainService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'ngDialog', 'deviceAccessUIService', 'SwSocket','dictionaryService', 'FileUploader',
      'linebodyUIService',
    function($scope, q, $routeParams, growl,$location, userUIService, userEnterpriseService, kpiDataService, resourceUIService, Info,
      viewFlexService, userDomainService, userLoginUIService, customerUIService, projectUIService, ngDialog, deviceAccessUIService, SwSocket,dictionaryService, FileUploader,linebodyUIService) {
      $scope.routePathNodes = {}; //模型树形字典
      var type = $routeParams.type;
      var gatewayId = $routeParams.gatewayid;
      $scope.selLength = 10;
      $scope.isFacilityBook = 0;//是否是设备台账
        $scope.buttons = function(exportOptionsCol){

            return [{
            extend: 'excel',
            title: '设备信息导出',
            text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
            exportOptions: {
                columns: exportOptionsCol
            }
        }, {
            text: '添加设备',
            extend: "addnew",

        }]
        };

        if($location.path() == "/facility/facilitybook") {
            $scope.isFacilityBook = 1;
            $scope.buttons = function(exportOptionsCol){
               return [{
                    extend: 'excel',
                    title: '设备信息导出',
                    text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                    exportOptions: {
                        columns: exportOptionsCol
                    }
                }];
            }
        }
      var uuid;
      //查询设备的条件
      $scope.queryDitem = {
        domainPath: "",
        sn: "",
        customerId: "",
        projectId: "",
        modelId: "",
          productionLineId:""//线体id
      };
      $scope.docError = {
        "name": "",
        "conter": ""
      };
      $scope.selectDevice; //被选中的设备

      $scope.gatewayPhysical = {}; //物理网关字典
      $scope.queryAttrList = []; //属性查询
      $scope.queryAttrObj = {}; //属性查询obj
      $scope.queryKeyValue = []; //属性key value
      $scope.selQueryAttr = {
        "attr": ""
      };
      $scope.seniorQuery = false;
      $scope.userGridData = { //不知道是否可删，在facility-dom中使用
        "list": "",
        "arrData": {},
        "enterpriseDomain": {}
      };
      $scope.downClick = function(qualifiedName) {
        var url = userUIService.uploadFileUrl + qualifiedName;
        window.open(url);
      };

      /** 
       * A02_S02是设备查看、A03_S02是测点查看、A04_S02是告警查看 所以下面的可能是没有用的 zhangafa 2017-6-1
      $scope.menu = $scope.menuitems['A02_S02']; //控制列表上的客户一栏显示还是不显示
      $scope.menuContract = $scope.menuitems['A03_S02']; //相关合同条款
      $scope.menuProject = $scope.menuitems['A04_S02']; //相关项目
      */
      $scope.facilityList = {}; //设备的列表

      $scope.modelListSelect; //模型的列表

      //接入配置操作
      $scope.access = {
        "status": "0",
        "allGateways": "",
        "accessMode": "",
        "accessGwId": "",
        "accessProtocol": "",
        "allDevices": "",
        "accessConfig": ""
      };

      // 初始化图片
      var info = Info.get("../localdb/icon.json", function(info) {
        $scope.iconList = info.qualityIcon;
        $scope.kpiIconList = info.kpiIcon;
      });

      // 监听接入网关的变化
      $scope.$watch("access.accessGwId", function(newValue, oldValue) {
        if(newValue != "") {
          $scope.access.accessProtocol = newValue.protocol;
        } else {
          $scope.access.accessProtocol = "";
        }
      });
      $scope.UploadFile = function() {
        var docList = $scope.selectDevice.deviceDocData;
        for(var i in docList) {
          if(docList[i].name == $scope.uploadParam.name) {
            $scope.docError.name = 'name';
            $scope.docError.conter = "文档名称已存在";
            return;
          }
        }
        $scope.formObj = {
          "deviceId": $scope.selectDevice.id,
          "name": encodeURIComponent($scope.uploadParam.name),
          "description": encodeURIComponent($scope.uploadParam.description)
        };
        $scope.$broadcast("UploadFile1");
      };
      $scope.successDoc = function(obj) {
        var name = escape(decodeURIComponent(obj.name));
        obj.name = name;
        obj.description = escape(decodeURIComponent(obj.description));
        if($scope.selectDevice.deviceDocData && $scope.selectDevice.deviceDocData != undefined) {
          $scope.selectDevice.deviceDocData.push(obj);
        } else {
          var arr = [];
          arr.push(obj);
          $scope.selectDevice.deviceDocData = arr;
        }
      }
      //根据用户Id查用户域
      var domainTreeQuery = function() {
        var handler = function(data) {
          if(data.code == 0) {
            var domainList = data.data;
            $scope.domainListTree = domainList;
            $scope.domainListDic = data.domainListDic;
            defers[1].resolve("success");
          };
        };
        if($scope.baseConfig && $scope.baseConfig.extendDomain) {
          resourceUIService.getExtendDomainsByFilter({}, handler);
        } else {
          userDomainService.queryDomainTree(userLoginUIService.user.userID, handler);
        }
      };

      //查询该用户的所有模型
      $scope.modelList = function(reflash) {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.modelListSelect = returnObj.data;
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
            if(reflash)
              growl.success("操作成功！");
            else
              defers[2].resolve("success");
          }
        });
      };
      var saveCheck = function(select) {

        // if(!jQuery.trim(select.projectId)) {
        //   growl.warning("车间名称不能为空", {});
        //   return false;
        // }
        if(!jQuery.trim(select.modelId)) {
          growl.warning("设备模板不能为空", {});
          return false;
        }
        if(!jQuery.trim(select.sn)) {
          growl.warning("设备编码不能为空", {});
          return false;
        }
        if(!jQuery.trim(select.label)) {
          growl.warning("设备名称不能为空", {});
          return false;
        }
        //var protocol = $scope.gatewayPhysical[select.gatewayId].protocol;

        /* 把模版默认值放到设备属性上 */
        if(!select.values) select.values = {};
        $scope.attrType.forEach(function(attrgroup) {
          attrgroup.arr.forEach(function(attr) {
            if(!select.values[attr.name] && attr.sourceValue) {
              if(attr.dataType == "numberic") {
                select.values[attr.name] = Number(attr.sourceValue);
              } else if(attr.dataType == "string") {
                select.values[attr.name] = attr.sourceValue;
              }

            }
          })
        })
        return true;
      }
      $scope.saveResource = function(callback) {
        if(!saveCheck($scope.selectDevice)) return;
        $scope.selectDevice.isLoading = true;
        if($scope.selectDevice.accessMode == 'multiple') {
          $scope.selectDevice.physicalConfig.analysisConfigs.connectPointId = '';
          $scope.selectDevice.physicalConfig.stationNo = 0;
          $scope.selectDevice.physicalConfig.analysisProtocol = '';
          $scope.selectDevice.externalDevId = 0;
        }
        if ($scope.baseConfig && $scope.baseConfig.projectConfig && $scope.baseConfig.projectConfig.devEnabled) {
          $scope.selectDevice.domains = $scope.selectDevice.gateInfo.domains.search($scope.selectDevice.projectId) > -1 ? $scope.selectDevice.gateInfo.domains : $scope.selectDevice.gateInfo.domains+$scope.selectDevice.projectId +"/";
        }
        $scope.selectDevice.domains = $scope.selectDevice.extendDomains ? $scope.selectDevice.extendDomains : $scope.selectDevice.domains;
        //getAddressPoint($scope.selectDevice, function() {
          if($scope.selectDevice.id == 0) {
            resourceUIService.addResource($scope.selectDevice, function(returnObj) {
              $scope.selectDevice.isLoading = false;
              if(returnObj.code == 0) {
                $scope.selectDevice.id = returnObj.data.id;
                $scope.selectDevice.domains = returnObj.data.domains;
                $scope.selectDevice.managedStatus = returnObj.data.managedStatus;
                $scope.selectDevice.values = returnObj.data.values;
                if(callback) {
                  callback()
                } else {
                  growl.success("保存成功", {});
                }
              }
            });
          } else {
            resourceUIService.updateDevice($scope.selectDevice, function(returnObj) {
              $scope.selectDevice.isLoading = false;
              if(returnObj.code == 0) {
                $scope.selectDevice.managedStatus = returnObj.data.managedStatus;
                $scope.selectDevice.values = returnObj.data.values;
                if(callback) {
                  callback()
                } else {
                  growl.success("保存成功", {});
                }
              }
            });
          }
        //})

      };
        /**
         * 新增备件对象初始化
         */
        $scope.initAddList = function(){
            $scope.sparepartAddData = {

                "model":"",  //备件类型-model
                "label":"",//备件名称-label
                "name":"", //    备件编码-name
                "specification":"",  //规格型号-specification
                "manufacturer":"",  //生产厂家-manufacturer
                "usePart":"",//使用部位
                "fujian":"", // 附件-未添加(图片)

                "customerId":"",//厂部-customerId
                "deviceModelId":[],// 使用设备类型-deviceModelId



                "lifespan":""  //参考使用寿命-lifespan


            };
            $scope.formAryList = [];

            $scope.id=null;//备件id

            $scope.presentDate="";
        }
        /* * * * * * * * * * * * * * * * * *  以下上传功能模块 * * * * * * * * * * * * * * * * * */
        $scope.enterpriseObj = {};
        $scope.enterId = "";
        var uploader = $scope.uploader = new FileUploader({
            url:'' + userUIService.uploadFileUrl +'/api/rest/upload/sparePartUIService/uploadSparePartImage',
            withCredentials: true // 跨域
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
            $scope.sparepartAddData.imageUrl=fileItem.file.name;
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
        $scope.clearItems = function() { //重新选择文件时，清空队列，达到覆盖文件的效果
            uploader.clearQueue();
        }
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.code == 0) {
                var param = {};
                if($scope.sparepartAddData.id){//代表添加
                    param = {
                        "name":$scope.sparepartAddData.name, //    备件编码-name
                        "label":$scope.sparepartAddData.label,//备件名称-label
                        "customerId":$scope.sparepartAddData.customerId,//厂部-customerId
                        "deviceModelId":$scope.sparepartAddData.deviceModelId,// 使用设备类型-deviceModelId
                        "model":$scope.sparepartAddData.model,  //备件类型-model
                        "specification":$scope.sparepartAddData.specification,  //规格型号-specification
                        "manufacturer":$scope.sparepartAddData.manufacturer,  //生产厂家-manufacturer
                        "lifespan":$scope.sparepartAddData.lifespan,  //参考使用寿命-lifespan
                        "stockNumber":$scope.sparepartAddData.stockNumber,  //实际库存-stockNumber
                        "lowerLimit":$scope.sparepartAddData.lowerLimit, // 安全库存-lowerLimit (数量下限)
                        "imageUrl":response.data.file, // 附件-未添加(图片)
                        "id":$scope.sparepartAddData.id,
                        "values":{deviceype:"海天注塑机"},
                        "upperLimit": "1000000",
                        "originalNumber":"5",
                        "unit": "个"
                    };
                }else{



                    param = {
                        "name":$scope.sparepartAddData.name, //    备件编码-name
                        "label":$scope.sparepartAddData.label,//备件名称-label
                        "customerId":$scope.sparepartAddData.customerId,//厂部-customerId
                        "deviceModelId":$scope.sparepartAddData.deviceModelId,// 使用设备类型-deviceModelId
                        "model":$scope.sparepartAddData.model,  //备件类型-model
                        "specification":$scope.sparepartAddData.specification,  //规格型号-specification
                        "manufacturer":$scope.sparepartAddData.manufacturer,  //生产厂家-manufacturer
                        "lifespan":$scope.sparepartAddData.lifespan,  //参考使用寿命-lifespan
                        "stockNumber":$scope.sparepartAddData.stockNumber,  //实际库存-stockNumber
                        "lowerLimit":$scope.sparepartAddData.lowerLimit, // 安全库存-lowerLimit (数量下限)
                        "imageUrl":response.data.file, // 附件-未添加(图片)
                        //"id":$scope.sparepartAddData.id
                        "values":{deviceype:"海天注塑机"},
                        "upperLimit": "1000000",
                        "originalNumber":"5",
                        "unit": "个"



                    };

                }

                // $scope.$broadcast("UploadFile1");
                if(param.id){



                    sparePartUIService.updateSparePart(param,function (returnObj) {
                        if(returnObj.code==0){
                            growl.success("已成功修改此备件信息", {});

                            ngDialog.close();
                            getAllSpareParts();
                            return;
                        }
                    });
                }else{
                    sparePartUIService.saveSparePart(param, function(returnObj) {
                        if (returnObj.code == 0) {
                            //if (select.id > 0) {
                            //   growl.success("已成功修改此备件信息", {});
                            //} else {
                            growl.success("已成功添加备件信息", {});
                            // }*/
                            ngDialog.close();
                            getAllSpareParts();
                            return;
                        }
                    })


                }
                uploader.clearQueue();//清空队列
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
        //添加备件信息
        $scope.addSpareInfo = function(obj){
            if(obj){
                $scope.sparepartAddData = obj;
                $scope.sparepartAddData.id = obj.id
                //  $scope.process();
            }else{
                $scope.initAddList();
            }
            //需要向窗口携带的参数
            querySparepartList();// 获取备件类型字典列表
            $scope.workOrderType = $scope.myDicts['ticketCategory'];
            ngDialog.open({
                template: '../partials/dialogue/add_devicesparepart.html',
                scope: $scope,
                className: 'ngdialog-theme-plain'
            });
        };
      $scope.attrDist = {};
      $scope.dictInit = function(attr) {
        if($scope.attrDist[attr.name]) {
          return;
        } else {
          try {
            var str = attr.sourceValue;
            var str1 = eval("(" + str + ")");
            $scope.attrDist[attr.name] = str1;
          } catch(e) {
            $scope.attrDist[attr.name] = str1;
          }
        }
      }
      /**
       * datatables内部操作处理
       * @param {Object} type
       * @param {Object} select
       */
      $scope.doAction = function(type, select, callback) {
        if(type == "save") {
          select.isEdit = 0;
          if(select.id == 0) {
            resourceUIService.addResource(select, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("保存成功", {});
                for(var j in $scope.facilityList.data) {
                  if($scope.facilityList.data[j].id == 0) {
                    $scope.facilityList.data[j] = returnObj.data;
                  }
                }
                $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
              }
            });
          } else if(select.id > 0) {
            resourceUIService.updateDevice(select, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("保存成功", {});
                for(var j in $scope.facilityList.data) {
                  if($scope.facilityList.data[j].id == returnObj.data.id) {
                    $scope.facilityList.data[j] = returnObj.data;
                  }
                }
                $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
              }
            });
          }
        } else if(type == "delete") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '是否要删除设备:' + escape(select.label) + '',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                resourceUIService.deleteResource(select.id, function(resultObj) {
                  if(resultObj.code == 0) {
                    growl.success("删除设备成功", {});
                    for(var j in $scope.facilityList.data) {
                      if($scope.facilityList.data[j].id == select.id) {
                        $scope.facilityList.data.splice(j, 1);
                      }
                    }
                    $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
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
        } else if(type == "cancelFacility") {
          for(var i in $scope.facilityList.data) {
            if($scope.facilityList.data[i].isEdit == 3) {
              $scope.facilityList.data.splice(i, 1);
            } else if($scope.facilityList.data[i].isEdit == 2 && $scope.facilityList.data[i].id == select.id) {
              select.isEdit = 0;
              $scope.facilityList.data[i] = select;
            }
          }
          $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
        } else if(type == "export") {
          location.href = '' + userUIService.uploadFileUrl + '/api/rest/download/resourceUIService/exportKpiDataTemplate/data.txt/' + select.id + '/';
        }
      };
      $scope.goBack = function() {
        if($scope.seniorQuery == true) {
          $scope.seniorQuery = false;
          $scope.queryKeyValue = [];
          $scope.queryModelChange();
        } else {
          $scope.seniorQuery = true;
        }
      }
      /**
       * 获取所有属性
       */
      var allAttrs = function() {
        resourceUIService.getAllAttrs(function(res) {
          if(res.code == 0) {
            var arr = res.data;
            var new_arr = [];
            for(var i = 0; i < arr.length; i++) {
              var items = arr[i];
              if(items.values.sensitive == '1' && !$scope.menuitems['A08_S02']) continue; //敏感且没有权限则退出
              var tmp = -1;
              if(items.label) {
                for(var j in new_arr) {
                  if(items.label == new_arr[j].label) {
                    tmp = j;
                  }
                }
                if(tmp == -1 && $scope.queryAttrObj[items.uid] == undefined) {
                  items["value"] = '';
                  items["endTime"] = '';
                  items["startdate"] = '';
                  items["endNumberic"] = '';
                  items["startNumberic"] = '';
                  new_arr.push(items);

                  $scope.queryAttrObj[items.uid] = items;
                }
              }
            }
            $scope.queryAttrList = new_arr;
          }
        });
      };

      /**
       * 模板变化时，高级查询的属性变化为该模型的。
       * 数据来源于初始化时的模型属性取得
       * 如果模板ID不存在，则恢复为默认的全量属性
       * create by afa
       */
      $scope.queryModelChange = function() {
        if(resourceUIService.rootModelsDic[$scope.queryDitem.modelId]) {
          var queryAttrList = []
          resourceUIService.rootModelsDic[$scope.queryDitem.modelId].attrs.forEach(function(attr) {
            if(attr.values.sensitive != '1' || $scope.menuitems['A08_S02']) {
              queryAttrList.push(jQuery.extend(false, {}, attr))
            }
          })
          $scope.queryAttrList = queryAttrList;
        } else {
          var attrs = [];
          for(var key in $scope.queryAttrObj) {
            attrs.push($scope.queryAttrObj[key])
          }
          $scope.queryAttrList = attrs;
        }
        $scope.queryKeyValue = [];
      }

      /**
       * 属性下拉选择
       */
      $scope.attrChang = function() {
        var attrSearchCount = $scope.baseConfig.attrSearchCount ? $scope.baseConfig.attrSearchCount : 6;
        if($scope.queryKeyValue.length < attrSearchCount) {
          for(var b in $scope.queryAttrList) {
            if($scope.queryAttrList[b].uid == $scope.selQueryAttr.attr) {
              $scope.queryKeyValue.push($scope.queryAttrList[b]);
              $scope.queryAttrList.splice(b, 1);
              break;
            }
          }
        } else if($scope.queryKeyValue.length >= attrSearchCount) {
          growl.warning("最多只能选择" + attrSearchCount + "个属性", {});
          $scope.selQueryAttr.attr = "";
        }
      }
      $scope.removeAttr = function(id) {
        for(var b in $scope.queryKeyValue) {
          if($scope.queryKeyValue[b].id == id) {
            $scope.queryAttrList.push($scope.queryKeyValue[b]);
            $scope.queryKeyValue[b].endTime = '';
            $scope.queryKeyValue[b].value = '';
            $scope.queryKeyValue[b].startdate = '';
            $scope.queryKeyValue[b].endNumberic = '';
            $scope.queryKeyValue[b].startNumberic = '';
            $scope.queryKeyValue.splice(b, 1);
            break;
          }
        }
      }
      $scope.devicesChange = function(configId, devices, item, changeFlg) {
        var dev;
        var getKpisByModelId = function() {
          if(!$scope.rootModelDic[dev.modelId].kpisfinish) {
            resourceUIService.getKpisByModelId(dev.modelId, function(res) {
              if(res.code == 0) {
                $scope.rootModelDic[dev.modelId].kpisfinish = true
                $scope.rootModelDic[dev.modelId].kpis = res.data;
                item.sourceModelId = dev.modelId;
              }
            });
          } else {
            item.sourceModelId = dev.modelId;
          }
        };

        if(configId && devices) {
          devices.forEach(function(device) {
            if(configId == device.id) {
              dev = device;
              return false;
            }
          });
        }
        if(dev) {
          getKpisByModelId();
        } else {
          if(!configId) return;
          resourceUIService.getPhysicalDeviceById(configId, function(returnObj) {
            if(returnObj.code == 0) {
              dev = returnObj.data;
              getKpisByModelId();
            }
          });
        }
      };

      var getDevices = function(gateway) {
        resourceUIService.getPhysicalDevicesByGatewayId(gateway.id, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              item.text = item.label;
            });
            gateway.devices = returnObj.data;
          };
        });
      };

      $scope.physical = function(gatewayId, item, changeFlg) {
        // 网关数据没有加载成功时处理
        if(!$scope.gatewayPhysical[gatewayId]) {
          if(gatewayId) {
            resourceUIService.getPhysicalDevicesByGatewayId(gatewayId, function(res) {
              if(res.code == 0) {
                $scope.gatewayPhysical[gatewayId] = res.data;
                getDevices($scope.gatewayPhysical[gatewayId]);
              }
            });
          }
        } else if(!$scope.gatewayPhysical[gatewayId].devices) {
          getDevices($scope.gatewayPhysical[gatewayId]);
        }
        if(changeFlg) {
          item.physicalDeviceId = "";
          item.sourceId = "";
        }
      };

      $scope.optionStatus = {
        "search": "",
        "deploy": "",
        "selectDevice": ""
      };
      $scope.attrTypeList = [];
      $scope.modelIdAttrs = function() {
        if(!$scope.selectDevice.modelId) return;
        resourceUIService.getAttrsByModelId($scope.selectDevice.modelId, function(resObj) {
          if(resObj.code == 0) {
            $scope.attrTypeList = resObj.data;
            var attrTypeList = resObj.data;
            var arr = [];
            var defaultArr = [];
            if(!$scope.selectDevice.values) $scope.selectDevice.values = {}; //如果没有values属性，那么就初始化
            for(var i in attrTypeList) {
              var obj = attrTypeList[i];
              var attr = {
                "name": "",
                "id": "",
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
              //有设备有设置数据时或者没有模板默认值时，继续循环
              if($scope.selectDevice.values[attrTypeList[i].name] || !attrTypeList[i].sourceValue) continue;
              //标准地址有默认数据
              if(attrTypeList[i].dataType == 'standardAddress') {
                var splitStr = attrTypeList[i].sourceValue.split(',');
                $scope.selectDevice.values[attrTypeList[i].name] = attrTypeList[i].sourceValue;
                if(splitStr[0] && splitStr[0] != undefined) {
                  $scope.selectDevice.values[attrTypeList[i].name + 'province'] = splitStr[0];
                }
                if(splitStr[1] && splitStr[1] != undefined) {
                  $scope.selectDevice.values[attrTypeList[i].name + 'city'] = splitStr[0] + "," + splitStr[1];
                }
                if(splitStr[2] && splitStr[2] != undefined) {
                  $scope.selectDevice.values[attrTypeList[i].name + 'district'] = splitStr[0] + "," + splitStr[1] + "," + splitStr[2];
                }
              } else if(attrTypeList[i].dataType != 'dict') { //不是自动类型的时候
                $scope.selectDevice.values[attrTypeList[i].name] = attrTypeList[i].sourceValue;
              }
            }
            $scope.selectDevice.attrType = defaultArr.concat(arr);
            $scope.selectDevice.attrType.sort(doubleCompare(["attrTypeSort", ""], ""))
            $scope.attrType = $scope.selectDevice.attrType;
          }
        });
      };
      $scope.modelType = [];
      $scope.modelTypeObj = {};
      /**
       * 获取设备种类
       */
      $scope.getAllModelType = function() {
        resourceUIService.getAllModelType(function(res) {
          if(res.code == 0) {
            $scope.modelType = res.data;
            for(var i in res.data) {
              $scope.modelTypeObj["" + res.data[i].valueCode + ""] = res.data[i];
            }
          }
        });
      }
      /**
       * 模型上的数据项
       */
      var modelKpi = function() {
        if(!$scope.selectDevice.modelId) return;
        resourceUIService.getDataItemsByModelId($scope.selectDevice.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectDevice.kpi = returnObj.data;
          }
        });
      };

      /**
       * 模型上的协议
       */
      var modelConfig = function() {
        if(!$scope.selectDevice.modelId) return;
        resourceUIService.getModelConfigByModelId($scope.selectDevice.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectDevice.config = returnObj.data;
          }
        });
      };

      /**
       * 获得模型下的任务
       * @param {Object} model
       */
      var taskInit = function() {
        if(!$scope.selectDevice.modelId) return;
        resourceUIService.findCollectionTaskDefinitionByModelId($scope.selectDevice.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectDevice.taskData = returnObj.data;
            if($scope.selectDevice.physicalConfig.taskConfigs){
              $scope.selectDevice.physicalConfig.taskConfigs.forEach(function(mytask) {
                $scope.selectDevice.taskData.forEach(function(task) {
                  if(task.taskCode == mytask.taskCode) {
                    task.cycleUnit = mytask.cycleUnit;
                    task.taskCycle = mytask.taskCycle;
                  }
                });
              });
            }
          }
        });
      };

      /**
       * 获得模型下的文档
       * @param {Object} model
       */
      var docInit = function() {
        if(!$scope.selectDevice.modelId) return;
        resourceUIService.getUploadModelFileList($scope.selectDevice.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            var docList = [];
            if(returnObj.data.length > 0) {
              for(var i in returnObj.data) {
                var name = escape(decodeURIComponent(returnObj.data[i].name));
                var description = escape(decodeURIComponent(returnObj.data[i].description));
                returnObj.data[i].name = name;
                returnObj.data[i].description = description;
                docList.push(returnObj.data[i]);
              }
            }
            $scope.selectDevice.docData = docList;
          }
        });
      };
      /**
       * 创建文档
       */
      $scope.addDoc = function() {
        $scope.docUrl = 'api/rest/upload/resourceUIService/uploadDeviceFile';
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
      /**
       * 获得设备下的文档
       * @param {Object} deviceId
       */
      var deviceDocInit = function() {
        if(!$scope.selectDevice.id) return;
        resourceUIService.getUploadDeviceFileList($scope.selectDevice.id, function(returnObj) {
          if(returnObj.code == 0) {
            var docList1 = [];
            if(returnObj.data.length > 0) {
              for(var i in returnObj.data) {
                var name = escape(decodeURIComponent(returnObj.data[i].name));
                var description = escape(decodeURIComponent(returnObj.data[i].description));
                returnObj.data[i].name = name;
                returnObj.data[i].description = description;
                docList1.push(returnObj.data[i]);
              }
            }
            $scope.selectDevice.deviceDocData = docList1;
          }
        });
      };

      /**
       * 获得客户的扩展域
       */
      var getExtendDomains = function(domains) {
        //全局配置中有扩展域则加载
        if($scope.baseConfig && $scope.baseConfig.extendDomain && ($scope.baseConfig.extendDomain == true || $scope.baseConfig.extendDomain == "true")) {
          var params = {
            domains: domains
          }
          resourceUIService.getExtendDomainsByFilter(params, function(returnObj) {
            if(returnObj.code != 0) return;
            $scope.subDomainListTree = returnObj.domainListTree;
            $scope.subDomainListDic = returnObj.domainListDic;
          });
        }

      }
      /**
       * 获得所有的协议
       */
      var getAllCollectionPlugins = function() {
        $scope.protocols = [];
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
          }
        });
      };

      /**
       * 查询解析协议
       */
      var getAllResolutionProtocols = function() {
        resourceUIService.getAllResolutionProtocol("", function(resultObj) {
          if(resultObj.code == 0) {
            $scope.resolutionProtocolDic = {};
            resultObj.data.forEach(function(item) {
              $scope.resolutionProtocolDic[item.label] = item;
            })
            $scope.resolutionProtocols = resultObj.data;
          }
        });
      };

      $scope.connectPointsInit = function(reload) {
        var gateInfo = $scope.gatewayPhysical[$scope.selectDevice.gatewayId];
        if(gateInfo.protocol == "flexem") {
          $scope.connectPointsDic = {};
          if(reload) {
            growl.info("网关连接点刷新请求中，请稍后...", {});
            $scope.selectDevice.isLoading = true;
            resourceUIService.loadConnectionPoint(gateInfo.externalGwId, function(returnObj) {
              $scope.selectDevice.isLoading = false;
              if(returnObj.code == 0) {
                returnObj.data.forEach(function(connectPoint) {
                  $scope.connectPointsDic[connectPoint.id] = connectPoint;
                })
                $scope.connectPoints = returnObj.data;
                growl.success("刷新成功", {});
              } else {
                growl.error("刷新失败，请再试！", {});
              }
            });
          } else {
            resourceUIService.getConnectionPoint(gateInfo.externalGwId, function(returnObj) {
              if(returnObj.code == 0) {
                returnObj.data.forEach(function(connectPoint) {
                  $scope.connectPointsDic[connectPoint.id] = connectPoint;
                })
                $scope.connectPoints = returnObj.data;
              }
            });
          }
        }
      };

      $scope.accessMode = function() {
        if($scope.selectDevice.accessMode == 'multiple') {
          $scope.showProtocol();
        }
      }
      var deviceHandler = function(device, gatewayId) {
        var gateInfo = $scope.gatewayPhysical[gatewayId];
        if(gateInfo) {
          device.gatewayId = gateInfo.id;
          device.projectId = device.projectId?device.projectId:gateInfo.projectId;
          device.domainPath = gateInfo.domain;
          device.customerId = gateInfo.customerId;
          device.gateInfo = gateInfo;
          device.physicalConfig.accessProtocol = gateInfo.protocol;
          device.physicalConfig.analysisProtocol = device.physicalConfig.analysisProtocol ? device.physicalConfig.analysisProtocol : null;
          device["accessMode"] = "single";
          $scope.selectDevice = device;
          $scope.selectDevice.attrType = $scope.selectDevice.attrType ? $scope.selectDevice.attrType : {
            "default": []
          }
          if(device.id > 0 && gateInfo.protocol == 'flexem' && (device.physicalConfig.analysisConfigs.connectPointId == undefined || device.physicalConfig.analysisConfigs.connectPointId == '')) {
            device["accessMode"] = "multiple";
          }
          $scope.connectPointsInit();
          $scope.modelIdAttrs();
          modelKpi();
          modelConfig();
          //taskInit();
          docInit();
          deviceDocInit();
          getExtendDomains(gateInfo.domains);
        } else {
          growl.warning("网关不存在，联系管理员!", {});
          window.location.href = "#/facility";
        }
      };

      $scope.infoPageManage = function(type) {
        if(type == 'FBOX') {
          var gateInfo = $scope.gatewayPhysical[$scope.selectDevice.gatewayId]
          deviceAccessUIService.getFlexemCloudConfAddr(gateInfo.externalGwId, location.href, function(returnObj) {
            if(returnObj.code == 0) {
              window.open(returnObj.data)
            }
          })
        } else if(type == '设备启用') {
          if($scope.selectDevice.gateInfo.managedStatus != 'active') {
            growl.warning("网关不是启用状态，无法启用设备!", {});
            return;
          }
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认启用 ' + escape($scope.selectDevice.label) + ' 设备吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                $scope.selectDevice.isLoading = true;
                $scope.saveResource(function() {
                  resourceUIService.activateDevice($scope.selectDevice.id, function(returnObj) {
                    $scope.selectDevice.isLoading = false;
                    if(returnObj.code == 0) {
                      $scope.selectDevice.managedStatus = returnObj.data.managedStatus;
                      growl.success("启用成功", {});
                    }
                  });
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
        } else if(type == '设备停用') {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认停用 ' + escape($scope.selectDevice.label) + ' 设备吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                $scope.selectDevice.isLoading = true;
                resourceUIService.deactivateDevice($scope.selectDevice.id, function(returnObj) {
                  $scope.selectDevice.isLoading = false;
                  if(returnObj.code == 0) {
                    $scope.selectDevice.managedStatus = returnObj.data.managedStatus;
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
        } else if(type == "管理当前网关") {
          location.href = "#/gatewayInfo/" + $scope.selectDevice.gatewayId;
          resourceUIService.activeListTab = "";
        } else if(type == "管理当前模板") {
          if(!$scope.selectDevice.modelId || $scope.selectDevice.modelId == 0) {
            growl.warning("请选择一个模板")
            return;
          }
          location.href = "#/editModel/" + $scope.selectDevice.modelId;
        }
      };

      /**
       * 添加数据项
       */
      $scope.showData = function(sel) {
        $scope.addDataObj = jQuery.extend(true, {}, sel);
        $scope.addDataObj.deviceMode = true;
        if($scope.selectDevice.managedStatus == 'active') {
          $scope.addDataObj.displayMode = true;
        } else {
          $scope.addDataObj.displayMode = false;
        }
        if($scope.selectDevice.physicalConfig.storageConfigs &&
          $scope.selectDevice.physicalConfig.storageConfigs.length > 0) {
          $scope.selectDevice.physicalConfig.storageConfigs.forEach(function(kpi) {
            if(kpi.uid == $scope.addDataObj.uid) {
              $scope.addDataObj.compress = kpi.compress;
              $scope.addDataObj.compressTime = kpi.compressTime;
              $scope.addDataObj.deadZone = kpi.deadZone;
              $scope.addDataObj.deadZoneRange = kpi.deadZoneRange;
              $scope.addDataObj.interval = kpi.interval;
              $scope.addDataObj.intervalTime = kpi.intervalTime;
            }
          });
        }
        ngDialog.open({
          template: '../partials/dialogue/add_data.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };
      $scope.saveKpi = function() {
        if(!$scope.selectDevice.physicalConfig.storageConfigs) $scope.selectDevice.physicalConfig.storageConfigs = [];
        var kpi = {};
        kpi.uid = $scope.addDataObj.uid;
        kpi.compress = $scope.addDataObj.compress;
        kpi.compressTime = $scope.addDataObj.compressTime;
        kpi.deadZone = $scope.addDataObj.deadZone;
        kpi.deadZoneRange = $scope.addDataObj.deadZoneRange;
        kpi.interval = $scope.addDataObj.interval;
        kpi.intervalTime = $scope.addDataObj.intervalTime;

        for(var i in $scope.selectDevice.physicalConfig.storageConfigs) {
          var oldkpi = $scope.selectDevice.physicalConfig.storageConfigs[i];
          if(oldkpi.uid == kpi.uid) {
            $scope.selectDevice.physicalConfig.storageConfigs.splice(i, 1);
            break;
          }
        };
        $scope.selectDevice.physicalConfig.storageConfigs.push(kpi);
        growl.info("请点击保存按钮，并重新启用设备", {});
        $scope.closeDialog();
      };

      /**
       * 展示采集组
       */
      $scope.showCollection = function(sel) {
        $scope.taskObj = jQuery.extend(true, {}, sel);
        $scope.taskObj.deviceMode = true;
        if($scope.selectDevice.managedStatus == 'active') {
          $scope.taskObj.displayMode = true;
        } else {
          $scope.taskObj.displayMode = false;
        }
        var kpiDir = jQuery.extend(true, [], $scope.selectDevice.kpi);
        $scope.selectValueLeft = [];
        $scope.selectValueRight = [];
        var dirKpiList = $scope.taskObj.kpiDefinitionIds;
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
        if($scope.selectDevice.physicalConfig.taskConfigs.length > 0) { //有设备上的设置
          $scope.selectDevice.physicalConfig.taskConfigs.forEach(function(task) {
            if(task.id == $scope.taskObj.id) {
              $scope.taskObj.cycleUnit = task.cycleUnit;
              $scope.taskObj.taskCycle = task.taskCycle;
            };
          });
        }
        ngDialog.open({
          template: '../partials/dialogue/add_collection.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };

      $scope.saveCollection = function() {
        if(!$scope.selectDevice.physicalConfig.taskConfigs) $scope.selectDevice.physicalConfig.taskConfigs = [];
        if($scope.selectDevice.physicalConfig.taskConfigs.length > 0) { //有设备上的设置
          $scope.selectDevice.physicalConfig.taskConfigs.forEach(function(task) {
            if(task.taskCode == $scope.taskObj.taskCode) {
              task.cycleUnit = $scope.taskObj.cycleUnit;
              task.taskCycle = $scope.taskObj.taskCycle;
            };
          });
        } else {
          var newTask = {
            taskCode: $scope.taskObj.id,
            cycleUnit: $scope.taskObj.cycleUnit,
            taskCycle: $scope.taskObj.taskCycle
          };
          $scope.selectDevice.physicalConfig.taskConfigs.push(newTask);
        }
        for(var i in $scope.selectDevice.taskData) {
          if($scope.selectDevice.taskData[i].taskCode == $scope.taskObj.taskCode) {
            $scope.selectDevice.taskData[i].cycleUnit = $scope.taskObj.cycleUnit;
            $scope.selectDevice.taskData[i].taskCycle = $scope.taskObj.taskCycle;
          }
        }
        growl.info("请点击保存按钮，并重新启用设备", {});
        $scope.closeDialog();
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
      $scope.regsKpiList = {};

      /**
       * 根据数据类型过滤寄存器
       * @param size 字节长度
       * @param kpiId  数据项id
       */
      $scope.dataByte = function(kpi) {
        var resolution = function(arr, kpi) {
          var resolutionProtocol = "";
          if($scope.protocolObj.accessProtocol != 'flexem') {
            return;
          }
          if($scope.protocolObj.accessProtocol == 'flexem' && $scope.selectDevice.accessMode == 'multiple' && kpi.analysisConfigs && kpi.analysisConfigs.connectPointId) {
            var connLabel = $scope.connectPointsDic[kpi.analysisConfigs.connectPointId].resolutionProtocolName;
            if($scope.resolutionProtocolDic[connLabel] != undefined) {
              resolutionProtocol = $scope.resolutionProtocolDic[connLabel].regs;
            }
          } else if($scope.protocolObj.resolutionProtocol) {
            resolutionProtocol = $scope.protocolObj.resolutionProtocol.regs;
          }
          if(resolutionProtocol) {
            var protocolList = [];
            for(var j in resolutionProtocol) {
              if($.inArray(resolutionProtocol[j].extAttributes.ioWidth, arr) >= 0) {
                protocolList.push(resolutionProtocol[j]);
              }
            }
            $scope.regsKpiList[kpi.kpiId] = protocolList;
          }
        };
        var dataType = $scope.allDataTypes;
        var dataObj = {};
        for(var i in dataType) {
          if(dataType[i].id == kpi.dataTypeId) {
            dataObj = dataType[i];
            break;
          }
        }
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
        };
      };
      $scope.saveProtocol = function() {
        $scope.selectDevice.physicalConfig.accessConfigs = $scope.protocolObj.accessConfigs;
        $scope.closeDialog();
        growl.info("请点击保存按钮，并重新启用设备", {});
      };

      $scope.showProtocol = function() {
        if(!$scope.selectDevice.physicalConfig.analysisProtocol && $scope.selectDevice.accessMode == 'single') {
          growl.warning("请选择一个解析协议", {});
          return;
        }
        $scope.protocolObj = null;
        if($scope.selectDevice.physicalConfig.accessConfigs.length == 0) { //没有设备上的设置，查找模板的
          if($scope.selectDevice.config) { //模板上有设置
            $scope.selectDevice.config.forEach(function(config) {
              if(config.accessProtocol == $scope.selectDevice.physicalConfig.accessProtocol &&
                config.analysisProtocol == $scope.selectDevice.physicalConfig.analysisProtocol) {

                for(var j in config.accessConfigs) {
                  if(config.accessProtocol == 'modbus' && config.accessConfigs[j].registers) {
                    config.accessConfigs[j].registers = parseInt(config.accessConfigs[j].registers);
                  }
                  if(config.analysisConfigs == undefined && config.accessProtocol == 'flexem') {
                    config.accessConfigs[j]["analysisConfigs"] = {};
                    config.accessConfigs[j]["analysisConfigs"]["connectPointId"] = '';
                    config.accessConfigs[j]["analysisConfigs"]["stationNo"] = 1;
                    config.accessConfigs[j]["analysisConfigs"]["externalDevId"] = '';
                  }
                }
                $scope.protocolObj = jQuery.extend(true, {}, config);
                if(config.accessProtocol == "baogang") {
                  var connectPoints = [];
                  $scope.selectDevice.attrType.forEach(function(attrgroup) {
                    attrgroup.arr.forEach(function(attr) {
                      if(attr.name == "MeasurePointLocate" && attr.sourceValue) {
                        var a1 = attr.sourceValue.split(",");
                        for(var i in a1) {
                          var a2 = a1[i].split(":");
                          connectPoints.push({
                            id: a2[0],
                            label: a2[1]
                          });
                        }
                      }
                    })
                  })
                  $scope.connectPoints = connectPoints;
                }

              };
            });
          }
        } else {
          if($scope.selectDevice.physicalConfig.accessProtocol == 'modbus') {
            var phyArr = $scope.selectDevice.physicalConfig.accessConfigs;
            for(var j in phyArr) {
              if(phyArr[j].registers) {
                phyArr[j].registers = parseInt(phyArr[j].registers);
              }
            }
          }
          $scope.protocolObj = jQuery.extend(true, {}, $scope.selectDevice.physicalConfig);
          $scope.protocolObj.id = Number.MAX_VALUE;
          if($scope.protocolObj.accessProtocol == "baogang") {
            var connectPoints = [];
            $scope.selectDevice.attrType.forEach(function(attrgroup) {
              attrgroup.arr.forEach(function(attr) {
                if(attr.name == "MeasurePointLocate" && attr.sourceValue) {
                  var a1 = attr.sourceValue.split(",");
                  for(var i in a1) {
                    var a2 = a1[i].split(":");
                    connectPoints.push({
                      id: a2[0],
                      label: a2[1]
                    });
                  }
                }
              })
            })
            $scope.connectPoints = connectPoints;
          }
        }
        if(!$scope.protocolObj) {
          $scope.protocolObj = {
            id: Number.MAX_VALUE,
            accessProtocol: $scope.gatewayPhysical[parseInt(gatewayId)].protocol,
            analysisProtocol: $scope.selectDevice.physicalConfig.analysisProtocol
          };
        }
        $scope.analysisChange();
        ngDialog.open({
          template: '../partials/dialogue/gateways_protocol.html',
          scope: $scope,
          className: 'ngdialog-theme-plain'
        });
      };
      $scope.measurePointLocateChange = function(kpi,type) {
        if(kpi.instance){
          var instance = kpi.instance;
          kpi.instance = "";
          var newKpi = $.extend(true, {}, kpi);
          delete newKpi.$$hashKey;
          var tmp = -1;
          var index = 0;
          var searchList = [];
          var points = $scope.connectPoints;
          var list = [];
          for (var i = $scope.protocolObj.accessConfigs.length-1;i > -1 ;i--) {
            if(type != "delete" && $scope.protocolObj.accessConfigs[i].kpiId == newKpi.kpiId && $scope.protocolObj.accessConfigs[i].instance == instance){
              tmp = i;
              growl.warning("这个数据项检测点位已存在",{});
              break;
            }
            if($scope.protocolObj.accessConfigs[i].kpiId == newKpi.kpiId){
              searchList.push($scope.protocolObj.accessConfigs[i]);
              index = i;
            }
          }
          if(tmp < 0){
            kpi.instance = instance;
            // $scope.protocolObj.accessConfigs.splice(tmp+1,0,newKpi);index
            for(var i in points ){
              var t = -1;
              for(var b in searchList){
                if(points[i].id == searchList[b].instance){
                  t = i;
                  break;
                }
              }
              if(t < 0){
                list.push(points[i]);
              }
            }
            // $scope.connectObj[kpi.kpiId]=list;
            if(type == "delete"){
              if(searchList.length > 1){
                $scope.protocolObj.accessConfigs.splice(index, 1);
              }else{
                kpi.instance = "";
                growl.warning("最后一个不让删除",{});
              }
            }else{
              if(list.length > 0 && searchList.length < points.length){
                $scope.protocolObj.accessConfigs.splice(index,0,newKpi);
                // $scope.protocolObj.accessConfigs.push(newKpi);
              }
            }
          }
        }
      };
      //     高级选项切换
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

      $scope.analysisChange = function() {
        $scope.protocolObj.resolutionProtocol = $scope.resolutionProtocolDic[$scope.protocolObj.analysisProtocol];
        var modelKpis = $scope.selectDevice.kpi;
        var gatList = [];
        modelKpis.forEach(function(modelkpi) {
          var devkpi = jQuery.extend(true, {}, modelkpi);
          if($scope.protocolObj.accessConfigs) {
            var oldKpi = false; //初始化过的数据
            $scope.protocolObj.accessConfigs.forEach(function(configkpi) {
              if(devkpi.uid == configkpi.kpiId) {
                oldKpi = true;
                if(configkpi.analysisConfigs == null) {
                  configkpi.analysisConfigs = {};
                  if($scope.protocolObj.accessProtocol == 'flexem') {
                    configkpi["analysisConfigs"]["connectPointId"] = $scope.selectDevice.physicalConfig.analysisConfigs.connectPointId;
                    configkpi["analysisConfigs"]["stationNo"] = parseInt($scope.selectDevice.physicalConfig.stationNo);
                    configkpi["analysisConfigs"]["externalDevId"] = $scope.selectDevice.externalDevId;
                  }
                }
                configkpi.dataItemId = devkpi.id;
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
      };
      $scope.downClick = function(qualifiedName) {
        var url = userUIService.uploadFileUrl + qualifiedName;
        window.open(url);
      };
      $scope.deleteDeviceDoc = function(deviceDoc) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          message: '确认删除文档吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              resourceUIService.deleteDeviceFile(deviceDoc, function(resultObj) {
                if(resultObj.code == 0) {
                  for(var i in $scope.selectDevice.deviceDocData) {
                    if(deviceDoc.id == $scope.selectDevice.deviceDocData[i].id) {
                      $scope.selectDevice.deviceDocData.splice(i, 1);
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
      };
      /**
       * 查询设备上kpi 在线状态、故障状态
       * @param ids 设备id
       * @param selectedInstances  设备数组
       */
      var getSearchResourceState = function(ids, selectedInstances, callback) {
        kpiDataService.getRealTimeKpiData(ids, [999999, 999998], function(returnObj) {
          if(returnObj.code == 0) {
            for(var j in selectedInstances) {
              for(var i in returnObj.data) {
                if(returnObj.data[i].nodeId == selectedInstances[j].id) {
                  if(returnObj.data[i].kpiCode == '999998') {
                    selectedInstances[j].onlineStatus = returnObj.data[i].value;
                  }
                  if(returnObj.data[i].kpiCode == '999999') {
                    selectedInstances[j].severity = returnObj.data[i].value;
                  }
                }
              }
            }
          }
          if(callback) {
            callback(selectedInstances);
          }
          // $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
        },true);
      }
      $scope.pipeline = function(opts) {
        // Configuration options
        var conf = $.extend({
          pages: 1, // number of pages to cache
          url: '', // script url
          data: null, // function or object with parameters to send to the server
          // matching how `ajax.data` works in DataTables
          method: 'POST' // Ajax HTTP method
        }, opts);

        // Private variables for storing the cache
        var cacheLower = -1;
        var cacheUpper = null;
        var cacheLastRequest = null;
        var cacheLastJson = null;

        return function(request, drawCallback, settings) {
          var ajax = false;
          var requestStart = request.start;
          var drawStart = request.start;
          var requestLength = request.length;
          var requestEnd = requestStart + requestLength;
          var sort = request.columns[request.order[0].column].data; //排序列的字段
          var sortType = request.order[0].dir; //排序的方式
          if(settings.clearCache) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
          } else if(cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
          } else if(JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
            JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
            JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
          ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
          }

          // Store the request for checking next time around
          cacheLastRequest = $.extend(true, {}, request);

          if(ajax) {
            // Need data from the server
            if(requestStart < cacheLower) {
              requestStart = requestStart - (requestLength * (conf.pages - 1));

              if(requestStart < 0) {
                requestStart = 0;
              }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength * conf.pages;

            // Provide the same `data` options as DataTables.
            if($.isFunction(conf.data)) {
              // As a function it is executed with the data object as an arg
              // for manipulation. If an object is returned, it is used as the
              // data object to submit
              var d = conf.data(request);
              if(d) {
                $.extend(request, d);
              }
            } else if($.isPlainObject(conf.data)) {
              // As an object, the data given extends the default
              $.extend(request, conf.data);
            }
            var pageRequest = {
              start: request.start,
              length: request.length,
              sort: sort,
              sortType: sortType,
              statCount: request.draw == 1
            }

            $scope.getDevicesByPage($scope.queryDitemList, pageRequest, function(returnObj, total) {
              var json = {};
              json.data = returnObj;
              json.draw = request.draw; // Update the echo for each response
              json.recordsTotal = total != undefined ? (total == -1 ? cacheLastJson.recordsTotal : total) : returnObj.length;
              json.recordsFiltered = json.recordsTotal;
              cacheLastJson = $.extend(true, {}, json);
              if(cacheLower != drawStart) {
                json.data.splice(0, drawStart - cacheLower);
              }
              if(requestLength >= -1) {
                json.data.splice(requestLength, json.data.length);
              }

              drawCallback(json);
            });
          } else {
            if($scope.socketList.length > 0) {
              cacheLastJson.data = $scope.socketList;
            }
            var json = $.extend(true, {}, cacheLastJson);
            json.draw = request.draw; // Update the echo for each response
            json.data.splice(0, requestStart - cacheLower);
            json.data.splice(requestLength, json.data.length);
            drawCallback(json);
          }
        }
      };
      $scope.socketList = [];
      var stateCallback = function(evendata) {
        var list = $scope.facilityResourceState;
        list.forEach(function(facility) {
          if(facility.id == evendata.data.nodeId) {
            // facility.onlineStatus = evendata.data.value == 0 ? "离线" : "在线";
            facility.onlineStatus = evendata.data.value;
            return false;
          }
        })
        $scope.socketList = list;
        $scope.fnData(evendata.data);
      }
      $scope.getDevicesByPage = function(queryItem, pageRequest, callback) {
        resourceUIService.getDevicesByConditionWithPage(queryItem, pageRequest, function(returnObj) {
          if(returnObj.code == 0) {
            var ids = [];
            for(var i in returnObj.data.data) {
              ids.push(returnObj.data.data[i].id);
            }
            $scope.facilityList = returnObj.data.data;
            getSearchResourceState(ids, returnObj.data.data, function(data) {
              if(callback) {
                $scope.facilityResourceState = data;
                callback(data, returnObj.data.total);
                //监听websocket
                if("WebSocket" in window) {
                  var param = {
                    ciid: ids.toString(),
                    kpi: '999998'
                  };
                  var operation = "register";
                  //注册WebSocket
                  SwSocket.register(uuid, operation, stateCallback);

                  //webSocket发送请求
                  SwSocket.send(uuid, operation, 'kpi', param);
                }
              }
            });

          }
        })
      }
      //搜索条件
      $scope.goSearch = function() {
        $scope.queryDitemList = {};
        // 根据客户查设备，通过路由进来的时候进行校验
        var id = $routeParams.id;
        $scope.chooseType = type;
        var physicalConfig = {
          //是否自动激活
          autoActive: null,
          modelConfig: {},
          //站号
          stationNo: 1,
          //解析配置
          analysisConfigs: {},
          //采集组频率
          taskConfigs: [],
          //解析协议
          analysisProtocol: null,
          accessConfigs: [],
          storageConfigs: []
        };
        if(type == "customer" && id) {
          type = '';
          var cId = parseInt(id);
          var cList = $scope.customersList;
          for(var i in cList) {
            if(cList[i].id == cId) {
              $scope.queryDitem["domainPath"] = cList[i].domainPath;
              $scope.queryDitemList["customerId"] = cId;
              $scope.queryDitem["customerId"] = cId;
              break;
            }
          }
        } else if(type == "domain" && id) {
          type = '';
          $scope.queryDitemList["domainPath"] = id;
          $scope.queryDitem["domainPath"] = id;
        } else if(type == "sn" && id) {
          type = '';
          $scope.queryDitemList["sn"] = id;
          $scope.queryDitem["sn"] = id;
        } else if(type == "model" && id) {
          type = '';
          $scope.queryDitemList["modelId"] = id;
          $scope.queryDitem["modelId"] = id;
        } else if(type == "project" && id) {
          type = '';
          var pId = parseInt(id);
          var pList = $scope.projectsList;
          for(var i in pList) {
            if(pList[i].id == pId) {
              $scope.queryDitem["domainPath"] = pList[i].domainPath;
              $scope.queryDitemList["projectId"] = pId;
              $scope.queryDitem["customerId"] = pList[i].customerId;
              $scope.queryDitem["projectId"] = pId;
              break;
            }
          }
        }else if(type == "linebody" && id) {//TODO............如果根据线体查设备 参数待定
            type = '';
            var pId = parseInt(id);
            var pList = $scope.linebodyList;
            for(var i in pList) {
                if(pList[i].id == pId) {
                    $scope.queryDitem["domainPath"] = pList[i].domainPath;
                    $scope.queryDitemList["projectId"] = pId;
                    $scope.queryDitem["customerId"] = pList[i].customerId;
                    $scope.queryDitem["projectId"] = pList[i].projectId;
                    $scope.queryDitem["productionLineId"]=pId;
                    break;
                }
            }
        }
        else if(type == "DEVICE") {
          $scope.queryDitemList["gatewayId"] = gatewayId;
          $scope.queryDitemList["resourceId"] = id;
        } else if(type == "DETAIL" || type == "DEPLOY" || type == "DEVICESEARCH") {
          $scope.queryDitemList["resourceId"] = id;
        } else if(type == "UNDEVICE") { //未识别设备，特殊除处理
          if(resourceUIService.selectUnComfirmedDevice && resourceUIService.selectUnComfirmedDevice.id == id) {
            if(!resourceUIService.selectUnComfirmedDevice.physicalConfig) {
              resourceUIService.selectUnComfirmedDevice.physicalConfig = jQuery.extend(true, {}, physicalConfig);
            }
            deviceHandler(resourceUIService.selectUnComfirmedDevice, gatewayId);
          } else {
            deviceHandler({
              id: 0,
              physicalConfig: jQuery.extend(true, {}, physicalConfig)
            }, gatewayId);
          }
          return;
        }
        $scope.access.status = '';
        if($scope.queryDitem.modelId) {
          $scope.queryDitemList["modelId"] = $scope.queryDitem.modelId;
        }
        if($scope.queryDitem.customerId) {//厂部
          $scope.queryDitemList["customerId"] = $scope.queryDitem.customerId;
        }
        if($scope.queryDitem.productionLineId) {//线体
          $scope.queryDitemList["productionLineId"] = $scope.queryDitem.productionLineId;
        }
        if($scope.queryDitem.projectId) {//车间
          $scope.queryDitemList["projectId"] = $scope.queryDitem.projectId;
        }
        if($scope.queryDitem.sn) {
          $scope.queryDitemList["orCondition"] = $scope.queryDitem.sn;
          $scope.queryDitemList["conditionField"] = ["sn", "label"];
        }
        if($scope.seniorQuery) {
          var objQuery = {};
          for(var o in $scope.queryKeyValue) {
            if($scope.queryKeyValue[o].dataType == 'datetime' || $scope.queryKeyValue[o].dataType == 'date') {
              objQuery[$scope.queryKeyValue[o].name] = [$scope.queryKeyValue[o].startTime, $scope.queryKeyValue[o].endTime];
            } else if($scope.queryKeyValue[o].dataType == 'numberic') {
              objQuery[$scope.queryKeyValue[o].name] = [$scope.queryKeyValue[o].startNumberic, $scope.queryKeyValue[o].endNumberic];
            } else {
              objQuery[$scope.queryKeyValue[o].name] = $scope.queryKeyValue[o].value;
            }
          }
          $scope.queryDitemList["values"] = objQuery;
        }
        if(type == "DEVICE" || type == "DETAIL" || type == "DEPLOY") {
          resourceUIService.getDevicesByCondition($scope.queryDitemList, function(res) {
            if(res.code == 0) {
              deviceHandler(res.data.length > 0 ? res.data[0] : {
                id: 0,
                from: 'gateway',
                physicalConfig: jQuery.extend(true, {}, physicalConfig)
              }, gatewayId);
            }
          });
        } else {
          $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", {
            "option": []
          });
        }
      };
      //清空搜索条件
      $scope.goClear = function() {
        $scope.queryDitem = {
          domainPath: "",
          sn: "",
          customerId: "",
          projectId: "",
          modelId: ""
        };
        // $scope.queryKeyValue = [];
        for(var o in $scope.queryKeyValue) {
          if($scope.queryKeyValue[o].dataType == 'datetime' || $scope.queryKeyValue[o].dataType == 'date') {
            $scope.queryKeyValue[o].startTime = '';
            $scope.queryKeyValue[o].endTime = '';
          } else if($scope.queryKeyValue[o].dataType == 'numberic') {
            $scope.queryKeyValue[o].startNumberic = '';
            $scope.queryKeyValue[o].endNumberic = '';
          } else {
            $scope.queryKeyValue[o].value = '';
          }
        }
        $scope.queryModelChange();
      };
        //添加设备
        $scope.addDevice = function(status) {
            try{
                window.location.href = "#/prod_device_property/" + status + "";
            }catch (e) {
                growl.warning('操作异常');
            }
        };
      $scope.addDirectives = function() {
        var newObj = {
          customerId: '',
          projectId: '',
          sn: '',
          label: '',
          domainSelect: '',
          domainPath: '',
          physicalDeviceDomain: '',
          id: 0,
          isEdit: 3
        }
        if($scope.facilityList.data == undefined) {
          $scope.facilityList["data"] = [newObj];
        } else {
          $scope.facilityList.data.unshift(newObj);
        }
        $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
      };

      $scope.connectChange = function() {
        if($scope.selectDevice.config) { //模板上有设置
          var temp = -1;
          var protocolName = $scope.connectPointsDic[$scope.protocolObj.connectGateways].resolutionProtocolName;
          $scope.selectDevice.config.forEach(function(config) {
            if(config.accessProtocol == $scope.protocolObj.accessProtocol &&
              config.analysisProtocol == protocolName) {
              temp = 1;
              for(var j in config.accessConfigs) {
                config.accessConfigs[j]["analysisConfigs"] = {};
                config.accessConfigs[j]["analysisConfigs"]["connectPointId"] = $scope.protocolObj.connectGateways;
                config.accessConfigs[j]["analysisConfigs"]["stationNo"] = 1;
                config.accessConfigs[j]["analysisConfigs"]["externalDevId"] = '';
              }
              $scope.protocolObj.accessConfigs = config.accessConfigs;
            }
          });
          if(temp == -1) {
            var kpiArr = $scope.protocolObj.accessConfigs;
            for(var i in kpiArr) {
              kpiArr[i].analysisConfigs.connectPointId = $scope.protocolObj.connectGateways;
              kpiArr[i].analysisConfigs.stationNo = 1;
              kpiArr[i].analysisConfigs.externalDevId = '';
              kpiArr[i].readExpression = '';
              kpiArr[i].registers = '';
              kpiArr[i].writeExpression = '';
              kpiArr[i].dataTypeId = '';
              kpiArr[i].config = {};
            }
          }
        } else {
          var kpiArr = $scope.protocolObj.accessConfigs;
          if($scope.protocolObj.connectGateways) {
            $scope.protocolObj.analysisProtocol = $scope.connectPointsDic[$scope.protocolObj.connectGateways].resolutionProtocolName;
            for(var i in kpiArr) {
              kpiArr[i].analysisConfigs.connectPointId = $scope.protocolObj.connectGateways;
            }
          }
        }
      }
      //通过模型查测点
      $scope.gatewayDate = {};
      var getWayKpiInit = function(devkpi, base) {
        devkpi["kpiId"] = devkpi.uid;
        devkpi["kpiName"] = devkpi.label;
        devkpi["deviceAddress"] = base.config.deviceAddress;
        devkpi["registerType"] = base.config.registerType;
        devkpi["startPoint"] = base.config.startPoint;
        devkpi["length"] = base.config.length;
        devkpi["byteOrder"] = base.config.byteOrder;
        devkpi["readExpression"] = base.readExpression;
        devkpi["writeExpression"] = base.writeExpression;
        devkpi["dataItemId"] = devkpi.id;
        if(devkpi.analysisConfigs == undefined && $scope.protocolObj.accessProtocol == 'flexem') {
          devkpi["analysisConfigs"] = {};
          devkpi["analysisConfigs"]["connectPointId"] = '';
          devkpi["analysisConfigs"]["stationNo"] = 1;
          devkpi["analysisConfigs"]["externalDevId"] = '';
        }
      }
      var gatewayHandler = function(dev, modelKpis) {
        resourceUIService.getPhysicalDeviceById(dev.physicalDeviceId, function(phyDev) {
          if(phyDev.code == 0) {
            if(phyDev.data) {
              $scope.access.accessGwId = $scope.gatewayPhysical[phyDev.data.gatewayId];
            }
            var gatList = [];
            var accessList = phyDev.data ? phyDev.data.accessConfigs : null;
            modelKpis.forEach(function(modelkpi) {
              var devkpi = jQuery.extend(true, {}, modelkpi);
              if(accessList) {
                accessList.forEach(function(configkpi) {
                  if(devkpi.id == configkpi.kpiId) {
                    getWayKpiInit(devkpi, configkpi);
                    return true;
                  }
                });
                gatList.push(devkpi);
              } else {
                getWayKpiInit(devkpi, {
                  config: {}
                });
                gatList.push(devkpi);
              }
            });
            $scope.gatewayDate.data = gatList;
          }
        });
      }
      var pointKpiInit = function(devkpi, base) {
        devkpi["gatewayId"] = base.gatewayId;
        devkpi["resourceId"] = base.resourceId;
        devkpi["sourceId"] = base.sourceId;
        devkpi["physicalDeviceId"] = base.physicalDeviceId;
      };

      var pointHandler = function(dev, modelKpis) {
        resourceUIService.findResourceAccesses(dev.id, function(phyDev) {
          if(phyDev.code == 0) {
            var pointData = phyDev.data;
            var gatList2 = [];
            modelKpis.forEach(function(modelkpi) {
              var devkpi = jQuery.extend(true, {}, modelkpi);
              if(pointData) {
                pointData.forEach(function(configkpi) {
                  if(devkpi.uid == configkpi.kpiId) {
                    pointKpiInit(devkpi, configkpi);
                    return true;
                  }
                });
                gatList2.push(devkpi);
              } else {
                pointKpiInit(devkpi, {
                  config: {}
                });
                gatList2.push(devkpi);
              }
            });
            $scope.kpisList.data = gatList2;
          }
        });
      }
      $scope.kpisList = function(dev) {
        if(jQuery("#devicecollapse").find(".fa.fa-plus").length == 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
        }
        $scope.access.accessGwId = "";
        $scope.access.accessProtocol = "";
        dev.accessMode = dev.accessMode ? dev.accessMode : "gateway"
        $scope.access.accessMode = dev.accessMode;
        if(!$scope.rootModelDic[dev.modelId].kpisfinish) {
          resourceUIService.getKpisByModelId(dev.modelId, function(res) {
            if(res.code == 0) {
              $scope.rootModelDic[dev.modelId].kpisfinish = true
              $scope.rootModelDic[dev.modelId].kpis = res.data;
              if(dev.accessMode == "gateway") {
                gatewayHandler(dev, $scope.rootModelDic[dev.modelId].kpis);
              } else if(dev.accessMode == "point") {
                pointHandler(dev, $scope.rootModelDic[dev.modelId].kpis);
              }
            }
          });
        } else {
          if(dev.accessMode == "gateway") {
            gatewayHandler(dev, $scope.rootModelDic[dev.modelId].kpis);
          } else if(dev.accessMode == "point") {
            pointHandler(dev, $scope.rootModelDic[dev.modelId].kpis);
          }
        }

        $scope.access.status = "access";
        $scope.optionStatus.selectDevice = dev;

        //      setTimeout(function() {
        //        $('.content-wrapper').scrollTop(1000000)
        //      }, 200);
      };

      $scope.accessModeChange = function() {
        var dev = $scope.optionStatus.selectDevice;
        dev.accessMode = $scope.access.accessMode;
        if(dev.accessMode == "gateway") {
          gatewayHandler(dev, $scope.rootModelDic[dev.modelId].kpis);
        } else if(dev.accessMode == "point") {
          pointHandler(dev, $scope.rootModelDic[dev.modelId].kpis);
        }
      };

      $scope.closeTable = function() {
        if(jQuery("#devicecollapse").find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
        }
        $scope.access.status = "";
      };
      $scope.listSaveValue = {
        "deviceAddress": "",
        "registerType": "",
        "startPoint": "",
        "length": "",
        "byteOrder": "",
        "expression": "",
      };
      //更新列表中修改的数据
      var updateData = function(deviceInfo) {
        for(var j in $scope.facilityList.data) {
          if($scope.facilityList.data[j].id == deviceInfo.id) {
            $scope.facilityList.data[j] = deviceInfo;
          }
        }
        $scope.$broadcast(Event.CMDBINFOSINIT + "_facility", $scope.facilityList);
      }
      $scope.saveTable = function() {
        if($scope.selectDevice) {
          if(jQuery("#devicecollapse").find(".fa.fa-plus").length > 0) {
            jQuery.AdminLTE.boxWidget.collapse(jQuery("#devicecollapse"));
          }
          if($scope.access.accessMode == 'gateway') {
            $scope.selectDevice.gatewayId = $scope.access.accessGwId.id;
            $scope.selectDevice.accessMode = $scope.access.accessMode;
            if($scope.gatewayDate.data == "" || $scope.gatewayDate.data == null || $scope.gatewayDate.data == undefined) {
              growl.warning("当前设备下的模型没测点，请先配置测点……", {});
              return;
            }
            var listAry = [];
            //获取所有测点配置的网关数据
            var table = $scope.gatewayDate.data;
            for(var i in table) {
              //初始化kpi的初始数据
              var ary = {
                "kpiId": "",
                "kpiName": "",
                "readExpression": "",
                "writeExpression": "",
                "config": {}
              };
              ary.kpiId = table[i].id;
              ary.kpiName = table[i].label;
              ary.readExpression = table[i].readExpression;
              ary.writeExpression = table[i].writeExpression;
              //配置kpi的配置项
              ary.config["byteOrder"] = table[i].byteOrder;
              ary.config["registerType"] = table[i].registerType;
              ary.config["startPoint"] = table[i].startPoint;
              ary.config["length"] = table[i].length;
              ary.config["deviceAddress"] = table[i].deviceAddress;
              listAry.push(ary);
            }

            if($scope.selectDevice.gatewayId == undefined) {
              $scope.selectDevice.gatewayId = 0;
            }
            //先把对应的网关跟接入方式保存到设备上
            resourceUIService.updateDevice($scope.selectDevice, function(returnObj) {
              if(returnObj.code == 0) {
                //根据设备上的物理id物理设备详情
                resourceUIService.getPhysicalDeviceById(returnObj.data.physicalDeviceId, function(res) {
                  if(res.code == 0 && res.data) {
                    res.data.gatewayId = $scope.access.accessGwId.id;
                    res.data.accessConfigs = listAry;
                    console.log("listAry====" + JSON.stringify(res.data));
                    //保存物理设备属性
                    resourceUIService.savePhysicalDevice(res.data, function(resData) {
                      if(resData.code == 0) {
                        growl.success("接入配置保存成功", {});
                        $scope.access.status = "";
                        updateData(returnObj.data);
                      }
                    });
                  } else {
                    growl.warning("您的物理设备数据有问题，请联系技术人员", {});
                  }
                })
              }
            })
          } else if($scope.access.accessMode == 'point') {
            if($scope.kpisList.data == "" || $scope.kpisList.data == null || $scope.kpisList.data == undefined) {
              growl.warning("当前设备下的模型没测点，请先配置测点……", {});
              return;
            }
            var table = $scope.kpisList.data;
            var gatewayList = [];
            for(var j in table) {
              var list = {
                "gatewayId": "",
                "resourceId": "",
                "physicalDeviceId": "",
                "sourceId": "",
                "kpiId": ""
              };
              list.gatewayId = table[j].gatewayId;
              list.resourceId = $scope.selectDevice.id;
              list.physicalDeviceId = table[j].physicalDeviceId;
              list.sourceId = table[j].sourceId;
              list.kpiId = table[j].uid;
              gatewayList.push(list);
            }
            $scope.selectDevice.accessMode = "point";
            //先修改设备
            resourceUIService.updateDevice($scope.selectDevice, function(returnObj) {
              if(returnObj.code == 0) {
                resourceUIService.addResourceAccesses([gatewayList], function(addData) {
                  if(addData.code == 0) {
                    growl.success("接入配置成功", {});
                    $scope.access.status = "";
                    updateData(returnObj.data);
                  }
                });
              }
            })
          }
        } else {
          growl.warning("您现在没有设备", {});
        }
      };

      /**
       * 
       */
      //模型Id查属性列表
      $scope.currentTab = 'default';
      $scope.isAttr = true;
      $scope.attrClick = function(tab, isAttr) {
        $scope.currentTab = tab;
        $scope.isAttr = isAttr;
      };
      /**
       * 获得客户列表
       */
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function() {
        customerUIService.findCustomersByCondition({}, function(returnObj) {
          $scope.customersDic = returnObj.customerDic;
          returnObj.data.forEach(function(item) {
            item.text = item.customerName;
          })
          $scope.customersList = returnObj.data;
          defers[0].resolve("success");
        })
      };
        /**
         * 获得备件类型字典列表
         */
        $scope.sparepartListSelect;
        $scope.customersDic = {};
        var querySparepartList = function() {

            dictionaryService.getDictValues(["sparePartModel"],function(event){
                if(event.code == 0) {

                    $scope.sparepartListSelect=event.data;;
                }
            });
        };
      $scope.modelIdChange = function() {
        $scope.modelIdAttrs();
        modelKpi();
        modelConfig();
       // taskInit(); 暂时不需要
        docInit();
      }
      /**
       * 查询车间
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function(reflash) {
        projectUIService.findProjectsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            if(reflash)
              growl.success("操作成功！");
            else
              defers[4].resolve("success");
          }
        })
      };

      //查询所有线体列表
        $scope.linebodyList;
        $scope.queryLinebodyList = function(){
            linebodyUIService.findLinebodyByCondition({},function(returnObj){
                if(returnObj.code == 0) {
                    $scope.linebodyList = returnObj.data;
                   defers[4].resolve("success");
                }
            })
        }
      $scope.getAllgateWays = function(reflash) {
        //获取所有网关
        resourceUIService.getAllGateways(function(resultObj) {
          if(resultObj.code == 0) {
            var gatewayList = [];
            for(var i in resultObj.data) {
              gatewayList.push(resultObj.data[i]);
            }
            $scope.access.allGateways = gatewayList;
            $scope.access.allGateways.forEach(function(gateway) {
              $scope.gatewayPhysical[gateway.id] = gateway;
            })
            if(reflash)
              growl.success("操作成功！");
            else
              defers[3].resolve("success");
          }
        });
      }
      
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
      
      /**
       * 初始化设备管理
       */
      var promises = []; //已加载列表
      var defers = []; //延期列表
      //等待加载队列：域、网关、项目、客户和模型
      for(var i = 0; i < 5; i++) {
        defers.push(q.defer());
      }

      var initList = function() {
        initDefaultKpis();
        uuid = Math.uuid();
        // $scope.getAllModelType(); 没有需求要求从后台取得模版类型
        for(var i in defers) {
          promises.push(defers[i].promise);
        }

        //所有延迟加载完成后操作
        q.all(promises).then(function(data) {
          $scope.goSearch();
        });

        // 查询厂部列表
        queryCustomer();

        //查询车间列表
        $scope.queryProject();
        //查询所有线体列表
        $scope.queryLinebodyList();
        //初始化所有属性
        if($scope.menuitems["isloaded"]) {
          if($scope.menuitems['A07_S02'])
            allAttrs();
          // 初始化域目录树
          domainTreeQuery();
        } else {
          var menuitemsWatch = $scope.$watch("menuitems", function(n) {
            if($scope.menuitems["isloaded"]) {
              if($scope.menuitems['A07_S02'])
                allAttrs();
              // 初始化域目录树
              domainTreeQuery();
              menuitemsWatch();
            }
          }, true)
        }

        // 初始化模型
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModel = returnObj.data;
            $scope.modelList();
          }
        });
        //查看设备详情
        $scope.look = function(select) {
          window.location.href = '#/facility_detail/DETAIL/' + select.gatewayId + '/' + select.id + '';
        };
        //设备检修
        $scope.repair = function(select,callbackFn) {
          if (select.alertSwitchOn === true) {
            select.alertSwitchOn = false
          } else {
            select.alertSwitchOn = true
          }
          resourceUIService.setDeviceAlertSwitchStatus(select.id,select.alertSwitchOn, function(returnObj) {
            if (returnObj.code == 0) {
              growl.success("检修状态变更成功",{})
              if (callbackFn) {
                callbackFn(select);
              }
            }
          });
        };
        $scope.getAllgateWays();

        resourceUIService.getAllDataItems(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.access["allDataItems"] = returnObj.data;
          }
        });

        getAllCollectionPlugins();
        getAllResolutionProtocols();
      };

      var getAddressPoint = function(inputObj, callbackFun) {
        inputObj.values.standardAddressdetail = inputObj.values.standardAddressdetail ? inputObj.values.standardAddressdetail : '';
        if(inputObj.values.standardAddress && (!inputObj.values.latitude || !inputObj.values.longitude || inputObj.values.latitude == "null" || inputObj.values.longitude == "null")) {
          userLoginUIService.getAddressPoint(inputObj.values.standardAddress.split(",").join("") + inputObj.values.standardAddressdetail, function(address) {
            if(address) {
              inputObj.values.latitude = address.location.lat;
              inputObj.values.longitude = address.location.lng;
            }

            if(callbackFun) {
              callbackFun(inputObj);
            }
          })
        } else {
          if(callbackFun) {
            callbackFun(inputObj);
          }
        }
      }

      /**
       * 监听登录状态
       */
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            initList();
          }
        });
      } else {
        initList();
      }
    }
  ]);

    /**
     * 设备档案
     */
  controllers.initController('DeviceArchivesCtrl', ['$scope', '$location', 'deviceArchivesService', '$routeParams', 'ngDialog', '$filter', 'growl', '$timeout',
    function($scope, $location, deviceArchivesService, $routeParams, ngDialog, $filter, growl, $timeout) {
     var deviceId = $routeParams.deviceId;
      getArchives(getRes);
      $scope.navigators = [{
          label: "设备档案",
          active: true
      }];
      function getArchives(callback) {
          deviceArchivesService.getDeviceArchivesByCondition(deviceId, function (e) {
              (e.code == "0" && callback) && callback(e.data);
          });
      }
      function getRes(items) {
          $scope.source = {
              showIndex: true,
              showSelector: false,
              data: items,
              body: {
                  operateTime: {
                      label: "时间",
                      bind: function (row) {
                          return $filter('date')(row.operateTime, 'yyyy-MM-dd HH:mm:ss');
                      },
                      sort: function (row) {
                          return new (row.operateTime).getTime();
                      }
                  },
                  operator: {
                      label: "操作人",
                      bind: function (row) {
                          var oper = row.operator;
                          if (oper == null || oper == "") {
                              return " ";
                          } else {
                              return oper;
                          }
                      }
                 },
                  smallArchivesType: {
                      label: "档案类型",
                      bind: function (row) {
                          var sm = row.smallArchivesType;
                          if (sm == null || sm == "") {
                              return " ";
                          } else {
                              return sm;
                          }
                      }
                  },
                  notes: {
                      label: "备注",
                      sortable:false,
                      bind: function (row) {
                        var no =  row.notes;
                        if(no == null || no == ""){
                          return " ";
                        }else{
                          return no;
                        }
                      }
                  }
              }
          }
      }
    }
  ]);
});