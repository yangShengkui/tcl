define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';

  // ==========================================    备件信息    ===================================
  controllers.initController('sparePartInfoCtrl', ['$scope','$q', 'FileUploader','ngDialog', '$location', '$routeParams', '$timeout', 'sparePartUIService', 'userEnterpriseService', 'userLoginUIService','ticketTaskService','customerUIService','projectUIService','resourceUIService','dictionaryService','Info', 'growl',
    function($scope,q,  FileUploader,ngDialog, $location, $routeParams, $timeout, sparePartUIService, userEnterpriseService, userLoginUIService,ticketTaskService,customerUIService,projectUIService,resourceUIService,dictionaryService, Info, growl) {
      $scope.selecteditem = true; //是否有已选中的备件信息
      $scope.spareInfoList = []; //存储备件信息列表，用于添加
        $scope.spareStockList=[];
      $scope.allSpareInfos = []; //用来存储备件信息列表
      $scope.editStatus = 3; //3为新增，2为修改
      $scope.ifRouteParams = 0; //是否是跳转，如果是跳转隐藏添加按钮
      $scope.queryState = $routeParams.queryState || 1; //用于tab切换

        $scope.customerName="";
        $scope.deviceName="";
        $scope.routePathNodes = {};
        $scope.stockOrderWrap={
            category:"",
            sparePartNumber:0,
            modifyTime:"",
            sparePartId:"",
            desc:""
        };
        //模糊查询出入库明细参数
        $scope.stockQueryDataItem={
            sparePartId:"",
                category:"",
                startTime:"",
                endTime:""
        }

        $scope.id="";
        $scope.sparePartDetail = null; //用于tab切换
        var type = $routeParams.type;

       // $scope.docError.name = "";
      //  $scope.docError.conter = "";
        $scope.file={};
        $scope.uploadParam = {
            "modelId": "",
            "name": "",
            "type": "",
            "url": "",
            "description": "",
            "postfix": "",
            "size": ""
        };

        //查询设备的条件
        $scope.queryDitem = {
            domainPath: "",
           /* sn: "",*/
            customerId: "",//厂部
            deviceModelId:[],
            modelId:"",//设备类型
            valueCode: "",//备件类型
            label:""//
        };
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


        /* * * * * * * * * * * * * * * * * *  以下上传功能模块 * * * * * * * * * * * * * * * * * */
        $scope.enterpriseObj = {};
        $scope.enterId = "";
        var uploader = $scope.uploader = new FileUploader({
            url:'' + sparePartUIService.uploadFileUrl +'/api/rest/upload/sparePartUIService/uploadSparePartImage',
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

       /* //模糊查询
        var getSpareInfoListByCondition=function (item) {

           sparePartUIService.findSparePartsByCondition($scope.queryDitem,function (returnObj) {
               
           });

        }*/
        /*    备件编码-name
                 备件名称-label
                 厂部-customerId
                 使用设备类型-deviceModelId
                 备件类型-model
                 规格型号-specification
                 生产厂家-manufacturer
                 参考使用寿命-lifespan
                 实际库存-stockNumber
                 安全库存-lowerLimit (数量下限)
                 附件-未添加(图片)

                */

        //设备部位名称   （最好还是把所有都查询查来，然后在表格每条记录都单独匹配，如果不这样做每条都发网路请求去查询很麻烦，而且目前好像还不行，表格的渲染方式比较特别）
        $scope.devicePartLabel="";
        $scope.getDevicePartLabel=function(deviceModelId){
            resourceUIService.getDevicePartById(deviceModelId,function(returnObj){
                if(returnObj.code==0){
                    if(returnObj.data){
                        $scope.devicePartLabel=returnObj.data.label;
                    }

                }
            });
        }


        //excel 导出
        $scope.exportStockOrderItems = function() {
            location.href = '' + sparePartUIService.uploadFileUrl + '/api/rest/export/sparePartUIService/exportStockOrderItems/' + $scope.id + '.xlsx/' + $scope.id + '/stockOrderItem/';
        }


      var getSpareInfoList = function(item) {
        var newObjAry = [];
        for (var i in item) {
          var obj = item[i];
          var newObj = jQuery.extend(true, {}, obj);
          newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
          newObj.id = obj.id;
          newObj.name = obj.name;
          newObj.label = obj.label;
          newObj.customerId=obj.customerId;
          newObj.deviceModelId=obj.deviceModelId;
          newObj.model=obj.model;
            newObj.specification=obj.specification;
            newObj.manufacturer=obj.manufacturer;
            newObj.lifespan=obj.lifespan;
            newObj.stockNumber=obj.stockNumber;
            newObj.lowerLimit=obj.lowerLimit;
            newObj.fujian=obj.fujian;



          /*newObj.unit = obj.unit;
          newObj.desc = obj.desc;
          newObj.originalNumber = obj.originalNumber;
          newObj.upperLimit = obj.upperLimit;
          newObj.lowerLimit = obj.lowerLimit;*/
          newObjAry.push(newObj);
        }
        $scope.$broadcast(Event.SPAREINFOINIT, {
          "option": [newObjAry]
        });
      }
        /**
         * 初始化设备管理
         */
        var promises = []; //已加载列表
        var defers = []; //延期列表
        //等待加载队列：域、网关、项目、客户和模型
        for(var i = 0; i < 5; i++) {
            defers.push(q.defer());
        }
        $scope.facilityList = {}; //设备的列表

        $scope.modelListSelect={}; //模型的列表
        /**
         * 获得客户列表
         */
        $scope.customersList={};
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
       /* $scope.modelIdChange = function() {
            $scope.modelIdAttrs();
            modelKpi();
            modelConfig();
            taskInit();
            docInit();
        }*/
        /**
         * 查询项目
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

       /* $scope.modelListSelect;*/

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
// 初始化模型
        resourceUIService.getRootModel(function(returnObj) {
            if(returnObj.code == 0) {
                resourceUIService.rootModel = returnObj.data;
                $scope.modelList();
            }
        });


        $scope.sparepartListSelect;
        dictionaryService.getDictValues(["sparePartModel"],function(event){
            if(event.code == 0) {

                $scope.sparepartListSelect=event.data;;
            }
        });
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

                        queryAttrList.push(jQuery.extend(false, {}, attr))

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





       // $scope.queryModelChange();




        /*//搜索条件
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
            } else if(type == "DEVICE") {
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
            if($scope.queryDitem.domainPath) {
                $scope.queryDitemList["domains"] = $scope.queryDitem.domainPath;
            }
            if($scope.queryDitem.customerId) {
                $scope.queryDitemList["customerId"] = $scope.queryDitem.customerId;
            }
            if($scope.queryDitem.projectId) {
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
*/

        //清除
        $scope.goClear = function() {
            $scope.queryDitem = {
                /*domainPath: "",
                sn: "",*/
                customerId: "",//厂部
                deviceModelId:[],
                modelId:"",//设备类型
                valueCode: "",//备件类型
                label:""//
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




        //模糊查询备件信息
        $scope.goSearch = function () {
            var serarch = {};

            if($scope.queryDitem.customerId){
                serarch["customerId"] = $scope.queryDitem.customerId;
            };
            if($scope.queryDitem.label){
                serarch["label"] = $scope.queryDitem.label;
            };
            if($scope.queryDitem.deviceModelId.length!=0){

                serarch["deviceModelId"] = [$scope.queryDitem.deviceModelId];
            };
            if($scope.queryDitem.modelId){
                serarch["modelId"] = $scope.queryDitem.modelId;
            };
            if($scope.queryDitem.valueCode){
                serarch["model"]=$scope.queryDitem.valueCode;
            }
            queryData(serarch);
        };

        /**
         *  查询列表
         */
        var queryData = function(queryObj) {
            // $scope.loaderValue = "";
            sparePartUIService.findSparePartsByCondition(queryObj, function(resultObj) {
                if(resultObj.code == 0) {
                    $scope.spareInfoList = resultObj.data;
                    $scope.$broadcast(Event.SPAREINFOINIT, {
                        'option': [$scope.spareInfoList]
                    });
                }
            });
        };
        /**
         * 新增备件对象初始化
         */
        $scope.initAddList = function(){
            $scope.sparepartAddData = {
               "name":"", //    备件编码-name
                "label":"",//备件名称-label
                "customerId":"",//厂部-customerId
                "deviceModelId":[],// 使用设备类型-deviceModelId
                "model":"",  //备件类型-model
                "specification":"",  //规格型号-specification
                "manufacturer":"",  //生产厂家-manufacturer
                "lifespan":"",  //参考使用寿命-lifespan
                "stockNumber":"",  //实际库存-stockNumber
                "lowerLimit":"", // 安全库存-lowerLimit (数量下限)
                "fujian":"" // 附件-未添加(图片)
            };
            $scope.formAryList = [];

            $scope.id=null;//备件id

            $scope.presentDate="";
        }
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
           queryCustomer();// 给$scope.customersList赋值
            $scope.workOrderType = $scope.myDicts['ticketCategory'];
            ngDialog.open({
                template: '../partials/dialogue/add_sparepart.html',
                scope: $scope,
                className: 'ngdialog-theme-plain'
            });
        };

        //保存备件信息
        $scope.saveSparePart=function(obj){


            var test = $scope.uploader.queue;
            for (var i in test) {
                test[i].upload()
            }
            if(test.length==0){


            var param = {};
            if(obj){//代表添加
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
                    "imageUrl":$scope.sparepartAddData.imageUrl, // 附件-未添加(图片)
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
                    "imageUrl":$scope.sparepartAddData.imageUrl, // 附件-未添加(图片)
                    //"id":$scope.sparepartAddData.id
                    "values":{deviceype:"海天注塑机"},
                    "upperLimit": "1000000",
                    "originalNumber":"5",
                    "unit": "个"



                };

            }

            $scope.$broadcast("UploadFile1");
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
            }


        }
        //编辑备件信息
        //添加备件信息
        $scope.editSpareInfo = function(obj){
            if(obj){
                $scope.sparepartAddData = obj;
                $scope.sparepartAddData.id = obj.id
              //  $scope.process();
            }else{
                $scope.initAddList();
            }
            //需要向窗口携带的参数
            queryCustomer();// 给$scope.customersList赋值
            $scope.workOrderType = $scope.myDicts['ticketCategory'];
            ngDialog.open({
                template: '../partials/dialogue/add_sparepart.html',
                scope: $scope,
                className: 'ngdialog-theme-plain'
            });
        };

      //调整备件库存信息
        $scope.adjustSpareInfoStock = function(obj){
            $scope.initAddList();
              $scope.stockOrderWrap.sparePartId=obj.id;

              var date=new Date();
            var str = useMomentFormat(date, "YYYY.MM.DD");
              $scope.stockOrderWrap.presentDate=str;

            ngDialog.open({
                template: '../partials/dialogue/stock_adjust.html',
                scope: $scope,
                className: 'ngdialog-theme-plain'
            });
        };

         //保存调整的库存
        $scope.saveStock=function(obj){
            if ($scope.commitloading) {
                growl.warning("请等待，正在保存库存", {});

                return;
            }

           // $scope.commitloading = true;

            var param={
                category:$scope.stockOrderWrap.category,
                sparePartNumber:$scope.stockOrderWrap.sparePartNumber,
                modifyTime:$scope.stockOrderWrap.modifyTime,
                sparePartId:$scope.stockOrderWrap.sparePartId,
                desc:$scope.stockOrderWrap.desc
            }


          sparePartUIService.saveStockOrderWrap(param,function(returnData){
              if(returnData.code==0){
                growl.success("保存成功");
                  ngDialog.close();
                  getAllSpareParts();
                return;
              }
          })

        }

      //库存出入库明细列表
        $scope.getStockInOutDetail=function(id){
          //根据备件id查询出入库明细   obj就是dataList参数

           /* //模糊查询出入库明细
            $scope.gosearchStock=function(sparePartId){
                var param=[sparePartId,$scope.stockQueryDataItem.category,$scope.stockQueryDataItem.startTime,$scope.stockQueryDataItem.endTime];
                sparePartUIService.getStockOrderItemsBySparePartId(param,function(returnObj){

                })
            }*/
            var param=[id,$scope.stockQueryDataItem.category,$scope.stockQueryDataItem.startTime,$scope.stockQueryDataItem.endTime];

            sparePartUIService.getStockOrderItemsBySparePartId(param,function(returnData){

                if(returnData.code==0){

                    var newObjAry = [];
                    for(var j=0;j<returnData.data.length;j++){


                    var obj=returnData.data[j];

                        var newObj = jQuery.extend(true, {}, obj);
                        newObj.id = obj.id;
                        newObj.modifyTime = obj.modifyTime;
                        newObj.sparePartNumber = obj.sparePartNumber;
                        newObj.desc=obj.desc;
                        newObj.handlerPerson=obj.handlerPerson;
                        /*newObj.unit = obj.unit;
                        newObj.desc = obj.desc;
                        newObj.originalNumber = obj.originalNumber;
                        newObj.upperLimit = obj.upperLimit;
                        newObj.lowerLimit = obj.lowerLimit;*/
                        newObjAry.push(newObj);
                    }
                    }
                    $scope.$broadcast("STOCKINFOINIT", {
                        "option": [newObjAry]
                    });


               }

           );

            //location.href = "#/sparepartInfo/" + id + "";

            $location.path("sparepartInfo/"+id+"/2");
        };


      /*$scope.addSpareInfo = function() {
        $scope.editStatus = 3;
        for (var i in $scope.spareInfoList) {
          if ($scope.spareInfoList[i].id == 0 || $scope.spareInfoList[i].isEdit == 2) {
            growl.warning("已存在正在编辑的备件信息", {});
            return;
          }
        }
        var newObj = {
          "name": "",
          "unit": "",
          "model": "",
          "label": "",
          "desc": "",
          "originalNumber": "",
          "upperLimit": "",
          "lowerLimit": "",
          'id': 0,
          'isEdit': 2
        };
        $scope.spareInfoList.push(newObj);
        getSpareInfoList($scope.spareInfoList);
      }
      */
      $scope.doActionInfo = function(type, select, callback) {
        if (type == "savespareInfo") {
          if (select != "" && select != null) {
            var param = {};
            //说明是修改项目
            if (select.id > 0) {
              param = {
                "name": select.name,
                "unit": select.unit,
                "model": select.model,
                "label": select.label,
                "desc": select.desc,
                "originalNumber": select.originalNumber,
                "upperLimit": select.upperLimit,
                "lowerLimit": select.lowerLimit,
                "id": select.id,
                "values": select.values
              };
            } else {
              param = {
                "name": select.name,
                "unit": select.unit,
                "model": select.model,
                "label": select.label,
                "desc": select.desc,
                "originalNumber": select.originalNumber,
                "upperLimit": select.upperLimit,
                "lowerLimit": select.lowerLimit,
                "values": select.values
              };
            }
            sparePartUIService.saveSparePart(param, function(returnObj) {
              if (returnObj.code == 0) {
                if (select.id > 0) {
                  growl.success("已成功修改此备件信息", {});
                } else {
                  growl.success("已成功添加备件信息", {});
                }
                getAllSpareParts();
                return;
              }
            })
          } else {
            growl.warning("请填写完整备件信息", {});
            return;
          }
        } else if (type == "deletespareInfo") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除此备件信息吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                sparePartUIService.deleteSparePart(select.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("成功删除此备件信息", {});
                    getAllSpareParts();
                    return;
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
        } else if (type == "cancel") {
          getAllSpareParts();
        } else if (type == "showStockOrder") {
          $scope.SpareName = select.name;
          getStockOrderBySpareId(select.id);
        }
      }

      //根据备件Id获取备件信息
      var getSparePartById = function(id) {
        if (!id) {
          growl.info("此备件信息不存在", {});
          return;
        }
        sparePartUIService.getSparePartById(id, function(returnObj) {
          if (returnObj.code == 0) {
            var arr = [];
            if (isArray(returnObj.data)) {
              arr = returnObj.data;
            } else {
              if (returnObj.data == null) {
                arr = [];
              } else {
                  $scope.sparePartDetail=returnObj.data;
                  $scope.customerName;
                  $scope.deviceName="";
                  for(var i=0;i<$scope.sparePartDetail.deviceModelId.length;i++){


                  for(var j=0;j<$scope.modelListSelect.length;j++){
                      if($scope.sparePartDetail.deviceModelId[i]==$scope.modelListSelect[j].id){
                          $scope.deviceName=$scope.deviceName+","+$scope.modelListSelect[j].label;
                          break;
                      }
                  }
                  }
                  $scope.deviceName=$scope.deviceName.substring(1,$scope.deviceName.length-1);
                  var imageUrl=$scope.sparePartDetail.imageUrl;
                    $scope.sparePartDetail.imageUrl=$scope.sparePartDetail.label+imageUrl.substring(imageUrl.lastIndexOf("."));

                  for(var i=0;i<$scope.customersList.length;i++){
                      if($scope.sparePartDetail.customerId==$scope.customersList[i].id){
                          $scope.customerName=$scope.customersList[i].customerName;
                      }
                  }

                arr.push(returnObj.data);
              }
            }
            /*$timeout(function() {
              $scope.$broadcast(Event.SPAREINFOINIT, {
                "option": [arr]
              });
            })*/
          }
        })
      };

      //根据备件Id获取条目信息
      var getStockOrderBySpareId = function(id) {
        sparePartUIService.getStockOrderItemsBySparePartId(id, function(returnObj) {
          if (returnObj.code == 0) {
              $scope.id=id;
            var arr = [];
            for (var i in returnObj.data) {
              var obj = {};
              obj.handlerPerson = returnObj.data[i].stockOder.handlerPerson; //处理人
              obj.name = returnObj.data[i].stockOder.name; //库单编号
              obj.createTime = returnObj.data[i].stockOder.createTime; //创建时间
              obj.category = returnObj.data[i].stockOder.category; // 出入库
              obj.sparePartNumber = returnObj.data[i].sparePartNumber; //备件数量
              arr.push(obj);
            }
            $timeout(function() {
              $scope.$broadcast(Event.SPAREINFOINIT + "record", {
                "option": [arr]
              });
            })
          }
        })
      };

      //获取所有备件信息
      var getAllSpareParts = function() {

        sparePartUIService.getAllSpareParts(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.allSpareInfos = returnObj.data;
            $scope.spareInfoList = [];
            $scope.spareInfos = [];
            for (var i in returnObj.data) {
              var obj = returnObj.data[i];
              obj.isEdit = 0;
              $scope.spareInfoList.push(obj);
            }
            $scope.$broadcast(Event.SPAREINFOINIT, {
              "option": [$scope.spareInfoList]
            });
          }
        })
      };

      //根据条件获取备件信息
      var getSpares = function() {
        if ($routeParams.spareinfoId) {
          $scope.ifRouteParams = 2010; //隐藏添加按钮
          getSparePartById($routeParams.spareinfoId);
        } else {
          getAllSpareParts();
        }
      };


      //查询库存明细
        var goSearchStock=function(id){
            $scope.id=id;
            $scope.getStockInOutDetail(id);
        }

      $scope.getEvent = function() {

          //下拉框数据加载
            //厂部
          // 查询客户
          queryCustomer();

          //初始化项目
          $scope.queryProject();
            //使用设备类型
          $scope.modelList();
          //备件类型


        if ($scope.queryState == 1) {
          getSpares();
        } else if ($scope.queryState == 2) {
            //goSearchStock("395819227430000");
            goSearchStock($routeParams.spareinfoId);
         /* $timeout(function() {
            $scope.$broadcast(Event.STOCKINFOINIT);
          })*/
        } else if ($scope.queryState == 3) {
          $timeout(function() {
            $scope.$broadcast('spareOut');
          })
        }
      };

      

      /**
       * 监听登录状态
       */
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            $scope.getEvent();
          }
        });
      } else {
        $scope.getEvent();
      }
    }
  ]);


  //=========================备件出入库明细======================================
    controllers.initController('sparePartInOutDetailCtrl', ['$scope', 'ngDialog', '$location', '$routeParams', '$timeout', 'sparePartUIService', 'userEnterpriseService', 'userLoginUIService','customerUIService','projectUIService','resourceUIService','dictionaryService','Info', 'growl',
        function($scope, ngDialog, $location, $routeParams, $timeout, sparePartUIService, userEnterpriseService, userLoginUIService,customerUIService,projectUIService,resourceUIService,dictionaryService, Info, growl) {
            $scope.queryState=2;

        }
        ]);



  // ==========================================    备件入库    ===================================
  controllers.initController('spareInPartCtrl', ['$scope', 'ngDialog', '$location', '$routeParams', '$timeout', 'sparePartUIService', 'userEnterpriseService', 'userLoginUIService', 'Info', 'growl',
    function($scope, ngDialog, $location, $routeParams, $timeout, sparePartUIService, userEnterpriseService, userLoginUIService, Info, growl) {
      $scope.selecteditem = true; //是否有已选中的入库单
      $scope.spareInLists = []; //存储入库单列表，用于添加
      $scope.$parent.selectedSparecalInList = []; //存储入库中条目，用于添加
      $scope.$parent.ifSubmitIn = 0;
      $scope.selectedConItem = {}; //选择到的入库单与设备关联
      $scope.createTime = '';
      $scope.$parent.selected = {
        'sparePartId': '', //所选备件Id
        'stockOrderId': '' //所选库单Id
      };
      $scope.relatedDeviceList = []; //用于存储关联班组的设备id组
      $scope.$on('spareIn', function() {
        initIn();
      });

      var getcontectList = function(item) {
        var newObjAry = [];
        for (var i in item) {
          var obj = item[i];
          var newObj = jQuery.extend(true, {}, obj);
          newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
          newObj.id = obj.id;
          newObj.name = obj.name;
          newObj.handlerPerson = obj.handlerPerson;
          newObj.createTime = obj.createTime;
          newObj.desc = obj.desc;
          newObjAry.unshift(newObj);
        }
        $scope.$broadcast(Event.SPAREININIT, {
          "option": [newObjAry]
        });
      };

      var getSpareCalList = function(item) {
        var newObjAry = [];
        for (var i in item) {
          var obj = item[i];
          var newObj = jQuery.extend(true, {}, obj);
          newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
          newObj.id = obj.id;
          newObj.sparePartName = obj.sparePartName;
          newObj.handlerPerson = obj.handlerPerson;
          newObj.desc = obj.desc;
          newObjAry.unshift(newObj);
        }
        $scope.$parent.$broadcast(Event.INSPARECLAUSESINIT, {
          "option": [newObjAry]
        });
      };

      //添加入库单
      $scope.addspareIn = function() {
        for (var i in $scope.spareInLists) {
          if ($scope.spareInLists[i].id == 0) {
            growl.warning("已存在正在编辑的入库单", {});
            return;
          }
        }
        var newObj = {
          'name': '',
          'handlerPerson': '',
          'createTime': '',
          'desc': '',
          'id': 0,
          'isEdit': 2
        };
        $scope.spareInLists.unshift(newObj);
        getcontectList($scope.spareInLists);
      }

      $scope.doActionIns = function(type, select, callback) {
        if (type == "cancel") {
          getInStockOrders();
          // for (var i = $scope.spareInLists.length - 1; i > -1; i--) {
          //   if ($scope.spareInLists[i].id == 0) {
          //     $scope.spareInLists.splice(i, 1);
          //   } else {
          //     $scope.spareInLists[i]["isEdit"] = 0;
          //   }
          // }
          // $scope.$broadcast(Event.SPAREININIT, {
          //   "option": [$scope.spareInLists]
          // });
        } else if (type == "saveSpareIn") {
          for (var i = $scope.spareInLists.length - 1; i > -1; i--) {
            if ($scope.spareInLists[i].id == 0) {
              $scope.spareInLists.splice(i, 1);
            } else {
              $scope.spareInLists[i]["isEdit"] = 0;
            }
          }
          if (select != "" && select != null) {
            var param = {};
            //说明是修改项目
            if (select.id > 0) {
              param = {
                'name': select.name,
                'handlerPerson': select.handlerPerson,
                'createTime': select.createTime,
                'desc': select.desc,
                "id": select.id
              };
            } else {
              param = {
                'name': select.name,
                'handlerPerson': select.handlerPerson,
                'createTime': select.createTime,
                'desc': select.desc
              };
            }
            sparePartUIService.saveInStockOrder(param, function(returnObj) {
              if (returnObj.code == 0) {
                callback(returnObj.data);
                if (select.id > 0) {
                  growl.success("已成功保存入库单", {});
                  var k = -1;
                  for (var i in $scope.spareInLists) {
                    if ($scope.spareInLists[i].id == select.id) {
                      k = select.id;
                      $scope.spareInLists[i] = jQuery.extend(true, {}, returnObj.data);
                      break;
                    }
                  }
                  if (k == -1) {
                    $scope.spareInLists.push(returnObj.data);
                  }
                }

              }
            })
          }
        } else if (type == "deleteSpareIn") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除此入库单吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                sparePartUIService.deleteStockOrder(select.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("成功删除此入库单", {});
                  }
                  getInStockOrders();
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
        } else if (type == "showSpareList") {
          $scope.$parent.selSpareName = select.name;
          getStockOrderItemsById(select.id);
          $scope.$parent.selected.stockOrderId = select.id; //所选库单id
          if (select.commit) {
            $scope.$parent.ifSubmitIn = 2010;
          } else {
            $scope.$parent.ifSubmitIn = 0;
          }
        }
      }

      $scope.$parent.doActionIn = function(type, select, callback) {
        if (type == "saveSpareInCaluses") {
          if (select != "" && select != null) {
            var param = {};
            //说明是修改项目
            if (select.id > 0) {
              param = {
                'sparePartId': select.sparePartId, //备件Id
                'stockOrderId': $scope.$parent.selected.stockOrderId, //库单Id
                'sparePartNumber': select.sparePartNumber, //备件数量
                'desc': select.desc,
                "id": select.id
              };
            } else {
              param = {
                'sparePartId': select.sparePartId,
                'stockOrderId': $scope.$parent.selected.stockOrderId,
                'sparePartNumber': select.sparePartNumber,
                'desc': select.desc
              };
            }

            sparePartUIService.saveStockOrderItem(param, function(returnObj) {
              if (returnObj.code == 0) {
                if (select.id > 0) {
                  growl.success("已成功修改此库单条目", {});
                } else {
                  growl.success("已成功添加入库单条目", {});
                }

                getStockOrderItemsById($scope.$parent.selected.stockOrderId);
                return;
              }
            });
          }
        } else if (type == "cancel") {
          for (var i = $scope.$parent.selectedSparecalInList.length - 1; i > -1; i--) {
            if ($scope.$parent.selectedSparecalInList[i].id == 0) {
              $scope.$parent.selectedSparecalInList.splice(i, 1);
            } else {
              $scope.$parent.selectedSparecalInList[i]["isEdit"] = 0;
            }
          }
          $scope.$parent.$broadcast(Event.INSPARECLAUSESINIT, {
            "option": [$scope.$parent.selectedSparecalInList]
          });
        } else if (type == "deleteStockOrderItem") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除此条目吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                sparePartUIService.deleteStockOrderItem(select.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("成功删除此条目", {});
                    getStockOrderItemsById($scope.$parent.selected.stockOrderId);
                    return;
                  } else {
                    growl.warning("删除此条目失败", {});
                    return;
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

      //添加条目
      $scope.$parent.addInSpareClauseItem = function() {
        for (var i in $scope.$parent.selectedSparecalInList) {
          if ($scope.$parent.selectedSparecalInList[i].id == 0) {
            growl.warning("已存在正在编辑的条目", {});
            return;
          }
        }
        var newObj = {
          'sparePartName': '',
          'sparePartNumber': '',
          'desc': '',
          'id': 0,
          'isEdit': 2
        };
        $scope.$parent.selectedSparecalInList.push(newObj);
        getSpareCalList($scope.$parent.selectedSparecalInList);
      };

      //提交库单
      $scope.submitInCaluses = function() {
        var selectedId = $scope.$parent.selected.stockOrderId;
        if (selectedId) {
          var arr = [selectedId, true];
          sparePartUIService.commitStockOrder(arr, function(returnObj) {
            if (returnObj.code == 0) {
              growl.success("已成功提交此入库单", {});
              getInStockOrders();
              $scope.$parent.ifSubmitIn = 2010;

            } else if (returnObj.code == 20622) {
              getInStockOrders();
            }

          })
        }
      }

      //根据库单id获取相关条目
      function getStockOrderItemsById(id) {
        sparePartUIService.getStockOrderItemsById(id, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.$parent.selectedSparecalInList = returnObj.data;
            $timeout(function() {
              $scope.$parent.$broadcast(Event.INSPARECLAUSESINIT, {
                "option": [returnObj.data]
              });
            })

          }
        })
      }

      //获取所有备件
      var getAllSpareParts = function() {
        sparePartUIService.getAllSpareParts(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.spareInfos = returnObj.data;
          }
        })
      };

      //获取所有入库单
      var getInStockOrders = function(flg) {
        if (!$routeParams.spareInId) {
          sparePartUIService.getAllInStockOrders(function(returnObj) {
            if (returnObj.code == 0) {
              $scope.spareInLists = returnObj.data;
              for (var i in returnObj.data) {
                $scope.spareInLists[i].isEdit = 0;
              }
              $timeout(function() {
                $scope.$parent.$broadcast(Event.SPAREININIT, {
                  "option": [$scope.spareInLists]
                });
              })

            }
          })
        } else {
          sparePartUIService.getInStockOrdersByhandlerId($routeParams.spareInId, function(returnObj) {
            if (returnObj.code == 0) {
              $scope.spareInLists = returnObj.data;
              for (var i in returnObj.data) {
                $scope.spareInLists[i].isEdit = 0;
              }
              $timeout(function() {
                $scope.$parent.$broadcast(Event.SPAREININIT, {
                  "option": [$scope.spareInLists]
                });
              })
            }
          })
        }

      };

      function initIn() {
        getAllSpareParts();
        getInStockOrders();
      };

    }
  ]);

  // ==========================================    备件出库    ===================================
  controllers.initController('spareOutPartCtrl', ['$scope', 'ngDialog', '$location', '$routeParams', '$timeout', 'sparePartUIService', 'userEnterpriseService', 'userLoginUIService', 'Info', 'growl',
    function($scope, ngDialog, $location, $routeParams, $timeout, sparePartUIService, userEnterpriseService, userLoginUIService, Info, growl) {
      $scope.selecteditem = true; //是否有已选中的出库单
      $scope.spareOutLists = []; //存储出库单列表，用于添加
      $scope.$parent.selectedSparecalOutList = []; //存储出库中条目，用于添加

      $scope.$parent.ifSubmitOut = 0;
      $scope.selectedConItem = {}; //选择到的出库单与条目关联
      $scope.$parent.selected = {
        'sparePartId': '', //所选备件Id
        'stockOrderId': '' //所选库单Id
      };
      $scope.$on('spareOut', function() {
        initOut();
      });

      var getcontectList = function(item) {
        var newObjAry = [];
        for (var i in item) {
          var obj = item[i];
          var newObj = jQuery.extend(true, {}, obj);
          newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
          newObj.id = obj.id;
          newObj.name = obj.name;
          newObj.handlerPerson = obj.handlerPerson;
          newObj.createTime = obj.createTime;
          newObj.desc = obj.desc;
          newObjAry.push(newObj);
        }
        $scope.$parent.$broadcast(Event.SPAREOUTINIT, {
          "option": [newObjAry]
        });
      };

      var getSpareCalList = function(item) {
        var newObjAry = [];
        for (var i in item) {
          var obj = item[i];
          var newObj = jQuery.extend(true, {}, obj);
          newObj.isEdit = newObj.isEdit ? newObj.isEdit : 0;
          newObj.id = obj.id;
          newObj.sparePartName = obj.sparePartName;
          newObj.handlerPerson = obj.handlerPerson;
          newObj.desc = obj.desc;
          newObjAry.push(newObj);
        }
        $scope.$parent.$broadcast(Event.OUTSPARECLAUSESINIT, {
          "option": [newObjAry]
        });
      };

      //添加出库单
      $scope.addspareOut = function() {
        for (var i in $scope.spareOutLists) {
          if ($scope.spareOutLists[i].id == 0) {
            growl.warning("已存在正在编辑的出库单", {});
            return;
          }
        }
        var newObj = {
          'name': '',
          'handlerPerson': '',
          'createTime': '',
          'desc': '',
          'id': 0,
          'isEdit': 2
        };
        $scope.spareOutLists.push(newObj);
        getcontectList($scope.spareOutLists);
      }

      $scope.doAction = function(type, select, callback) {
        if (type == "cancel") {
          getOutStockOrders();
        } else if (type == "saveSpareOut") {
          for (var i = $scope.spareOutLists.length - 1; i > -1; i--) {
            if ($scope.spareOutLists[i].id == 0) {
              $scope.spareOutLists.splice(i, 1);
            } else {
              $scope.spareOutLists[i]["isEdit"] = 0;
            }
          }
          if (select != "" && select != null) {
            var param = {};
            //说明是修改项目
            if (select.id > 0) {
              param = {
                'name': select.name,
                'handlerPerson': select.handlerPerson,
                'createTime': select.createTime,
                'desc': select.desc,
                "id": select.id
              };
            } else {
              param = {
                'name': select.name,
                'handlerPerson': select.handlerPerson,
                'createTime': select.createTime,
                'desc': select.desc
              };
            }
            sparePartUIService.saveOutStockOrder(param, function(returnObj) {
              if (returnObj.code == 0) {
                callback(returnObj.data);
                if (select.id > 0) {
                  growl.success("已成功保存出库单", {});
                  var k = -1;
                  for (var i in $scope.spareOutLists) {
                    if ($scope.spareOutLists[i].id == select.id) {
                      k = select.id;
                      $scope.spareOutLists[i] = jQuery.extend(true, {}, returnObj.data);
                      break;
                    }
                  }
                  if (k == -1) {
                    $scope.spareOutLists.push(returnObj.data);
                  }
                }

              }
            })
          }
        } else if (type == "deleteSpareOut") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除此出库单吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                sparePartUIService.deleteStockOrder(select.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("成功删除此出库单", {});
                  }
                  getOutStockOrders();
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
        } else if (type == "showSpareList") {
          $scope.$parent.selSpareName = select.name;
          getStockOrderItemsById(select.id);
          $scope.$parent.selected.stockOrderId = select.id; //所选库单id
          if (select.commit) {
            $scope.$parent.ifSubmitOut = 2010;
          } else {
            $scope.$parent.ifSubmitOut = 0;
          }
        }
      }

      $scope.$parent.doActionOut = function(type, select, callback) {
        if (type == "saveSpareOutCaluses") {
          if (select != "" && select != null) {
            var param = {};
            //说明是修改项目
            if (select.id > 0) {
              param = {
                'sparePartId': select.sparePartId, //备件Id
                'stockOrderId': $scope.$parent.selected.stockOrderId, //库单Id
                'sparePartNumber': select.sparePartNumber, //备件数量
                'desc': select.desc,
                "id": select.id
              };
            } else {
              param = {
                'sparePartId': select.sparePartId,
                'stockOrderId': $scope.$parent.selected.stockOrderId,
                'sparePartNumber': select.sparePartNumber,
                'desc': select.desc
              };
            }

            sparePartUIService.saveStockOrderItem(param, function(returnObj) {
              if (returnObj.code == 0) {
                if (select.id > 0) {
                  growl.success("已成功修改此库单条目", {});
                } else {
                  growl.success("已成功添加库单条目", {});
                }
                getStockOrderItemsById($scope.$parent.selected.stockOrderId);
                return;
              }
            });
          }
        } else if (type == "cancel") {
          for (var i = $scope.$parent.selectedSparecalOutList.length - 1; i > -1; i--) {
            if ($scope.$parent.selectedSparecalOutList[i].id == 0) {
              $scope.$parent.selectedSparecalOutList.splice(i, 1);
            } else {
              $scope.$parent.selectedSparecalOutList[i]["isEdit"] = 0;
            }
          }
          $scope.$parent.$broadcast(Event.OUTSPARECLAUSESINIT, {
            "option": [$scope.$parent.selectedSparecalOutList]
          });
        } else if (type == "deleteStockOrderItem") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除此条目吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                sparePartUIService.deleteStockOrderItem(select.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    growl.success("成功删除此条目", {});
                    getStockOrderItemsById($scope.$parent.selected.stockOrderId);

                    return;
                  } else {
                    growl.warning("删除此条目失败", {});
                    return;
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

      //添加条目
      $scope.$parent.addOutSpareClauseItem = function() {
        for (var i in $scope.$parent.selectedSparecalOutList) {
          if ($scope.$parent.selectedSparecalOutList[i].id == 0) {
            growl.warning("已存在正在编辑的条目", {});
            return;
          }
        }
        var newObj = {
          'sparePartName': '',
          'sparePartNumber': '',
          'desc': '',
          'id': 0,
          'isEdit': 2
        };
        $scope.$parent.selectedSparecalOutList.push(newObj);
        getSpareCalList($scope.$parent.selectedSparecalOutList);
      }

      //根据出库单id获取相关条目
      function getStockOrderItemsById(id) {
        sparePartUIService.getStockOrderItemsById(id, function(returnObj) {
          if (returnObj.code == 0) {
            $scope.$parent.selectedSparecalOutList = returnObj.data;
            $timeout(function() {
              $scope.$parent.$broadcast(Event.OUTSPARECLAUSESINIT, {
                "option": [returnObj.data]
              });
            })

          }
        })
      }

      //提交函数
      function submitFun(arr) {
        sparePartUIService.commitStockOrder(arr, function(returnObj) {
          if (returnObj.code == 0) {
            if (returnObj.data.length > 0) {
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                message: '此库单显示备件不足,仍确定提交此库单吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    var arrObj = [arr[0], false];
                    submitFun(arrObj);
                    getOutStockOrders();
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
              growl.success("已成功提交此出库单", {});
              getOutStockOrders();
            }
          }
        })
      }

      //提交库单
      $scope.submitOutCaluses = function() {
        var selectedId = $scope.$parent.selected.stockOrderId;
        if (selectedId) {
          var arr = [selectedId, true];
          submitFun(arr);
        }
      }

      //获取所有备件
      var getAllSpareParts = function() {
        sparePartUIService.getAllSpareParts(function(returnObj) {
          if (returnObj.code == 0) {
            $scope.spareInfos = returnObj.data;
          }
        })
      };
      //获取所有出库单
      var getOutStockOrders = function() {
        if (!$routeParams.spareInId) {
          sparePartUIService.getAllOutStockOrders(function(returnObj) {
            if (returnObj.code == 0) {
              $scope.spareOutLists = returnObj.data;
              for (var i in returnObj.data) {
                $scope.spareOutLists[i].isEdit = 0;
              }

              $timeout(function() {
                $scope.$parent.$broadcast(Event.SPAREOUTINIT, {
                  "option": [$scope.spareOutLists]
                });
              })
            }
          })
        } else {
          sparePartUIService.getOutStockOrdersByhandlerId($routeParams.spareInId, function(returnObj) {
            if (returnObj.code == 0) {
              $scope.spareOutLists = returnObj.data;
              for (var i in returnObj.data) {
                $scope.spareOutLists[i].isEdit = 0;
              }

              $timeout(function() {
                $scope.$parent.$broadcast(Event.SPAREOUTINIT, {
                  "option": [$scope.spareOutLists]
                });
              })
            }
          })
        }
      }

      function initOut() {
        getAllSpareParts();
        getOutStockOrders();
      };

    }
  ]);


});
