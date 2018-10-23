define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';


  //线体管理
  controllers.initController('lineBodyCtrl', ['$scope', 'resourceUIService', 'customerProjectUIService', 'distributorUIService', 'userDomainService', 'projectUIService', 'ngDialog', '$location', '$routeParams', '$timeout', 'customerUIService', 'userLoginUIService', 'Info', 'growl',
      'FileUploader','userUIService','linebodyUIService',
    function($scope, resourceUIService, customerProjectUIService, distributorUIService, userDomainService, projectUIService, ngDialog, $location, $routeParams, $timeout, customerUIService, userLoginUIService, Info, growl,
             FileUploader,userUIService,linebodyUIService) {
      var routeParamsObj = null;
      $scope.provinces = $scope.$parent.provinces;
      $scope.cityDics = $scope.$parent.cityDics;
      $scope.districtDics = $scope.$parent.districtDics;

      $scope.projectItem = {//按条件查询线体
        "orCondition": "",
        "id": "",
        "customerId": 0, //客户id
        "domainPath": "", //客户归属
        "distributorId": 0, //经销商id
        "productionLineName": "" //线体名称
      };
      //查询/展示字段
      function initHistory() {
        $scope.linebodyInfo = {
          "id": 0,
          "province": "",
          "city": "",
          "county": "",
          "values": {},
          "projectAddress": "", //线体地址
          "customerId": "", //客户id
            "projectId":"",//车间id
          "installDate": "", //安装日期
          "domainPath": null, //客户归属
          "debugFinishDate": "", //调试完成日期
          "distributorId": "", //经销商id
          "productionLineName": "", //线体名称
            "productionDescription":"",//线体生产说明
          "qualityCloseDate": "", //质保截止日期
          "risingTime": new Date()
        };
        $scope.selEditInfo = {
          "domainPath": "", //客户归属
          "customerId": "", //客户id
          "distributorId": "", //经销商id
        }
      };
      $scope.show = { //判断显示隐藏
        customer: true,
        distributor: true
      };
      if($routeParams.customerId || $routeParams.distributorId || $routeParams.projectId) {
        $scope.ifShowSelect = false;
      } else {
        $scope.ifShowSelect = true;
      }

      if($routeParams.customerId) {
        $scope.show.customer = false;
        $scope.show.distributor = true;
        $scope.projectItem.customerId = parseInt($routeParams.customerId);
        $scope.queryLabel = '客户名称';
        $scope.queryState = 2;
      } else if($routeParams.distributorId) {
        $scope.show.distributor = false;
        $scope.show.customer = true;
        $scope.projectItem.distributorId = parseInt($routeParams.distributorId);
        $scope.queryLabel = '经销商名称';
        $scope.queryState = 3;
      }

      $scope.selectedProject = true; //是否有已选中的线体
      $scope.projectLists = []; //存储线体，用于添加
      $scope.ifshowTable = false; //false 为关闭table，true为显示
      $scope.selCustomer = ''; //选中的客户id
      $scope.customerDic = {}; // 客户
      $scope.distributorDic = {}; //经销商
      var showIndex = 0; //确定执行时间

      //弹出框的关闭事件
      $scope.closeDialog = function() {
        ngDialog.close();
      };

      $scope.cancelData = function() {
        if($routeParams.customerId || $routeParams.deviceId || $routeParams.projectId) {
          return;
        } else {
          initHistory();
        }
      };

      $scope.closeTable = function() {
        $scope.ifShowSelectDevice = 0;
      };

      $scope.provinceClick = function(provinceId) {
        $scope.linebodyInfo.county = "";
        if($scope.cityDics[provinceId]) {
          $scope.cityList = $scope.cityDics[provinceId];
        }
      };

      $scope.cityClick = function(cityId) {
        if($scope.districtDics[cityId]) {
          $scope.districtList = $scope.districtDics[cityId];
        }
      };

      var getprojectList = function(item) {
        $scope.$broadcast(Event.LINEBODYMANAGEINIT, {
          "option": [item,$scope.extendTableColumns]
        });
      };

      //过滤由于添加信息后未删除的空项 || 删除与id相同的项
      function filterBlankOrDelete(obj, id) {
        for(var i in obj) {
          if(id) {
            if(obj[i].id == id) {
              obj.splice(i, 1);
            }
          } else {
            if(obj[i].id == 0) {
              obj.splice(i, 1);
            }
          }
        }
      };

      //添加线体
      $scope.addproject = function() {
        $scope.provinces = $scope.$parent.provinces;
        $scope.cityDics = $scope.$parent.cityDics;
        $scope.districtDics = $scope.$parent.districtDics;
        initHistory();
        // if ($routeParams.customerId) {
        //   $scope.linebodyInfo.domainPath = $scope.customerDic[$routeParams.customerId].domainPath;
        //   $scope.linebodyInfo.customerId = parseInt($routeParams.customerId);
        // } else if ($routeParams.distributorId) {
        //   $scope.linebodyInfo.distributorId = parseInt($routeParams.distributorId);
        // }
        ngDialog.open({
          template: '../partials/dialogue/add_linebody.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };
  //保存线体
      $scope.saveData = function() {
        var linebodyInfo = $scope.linebodyInfo;
        linebodyInfo.qualityCloseDate = new Date(linebodyInfo.qualityCloseDate);
        linebodyInfo.debugFinishDate = new Date(linebodyInfo.debugFinishDate);
        linebodyInfo.installDate = new Date(linebodyInfo.installDate);
        if(linebodyInfo.debugFinishDate < linebodyInfo.installDate) {
          growl.warning("调试完成时间需大于线体安装时间", {});
          return;
        }
        if(linebodyInfo.qualityCloseDate < linebodyInfo.installDate) {
          growl.warning("质保截止时间需大于线体安装时间", {});
          return;
        }
        if(linebodyInfo.qualityCloseDate < linebodyInfo.debugFinishDate) {
          growl.warning("质保截止时间需大于调试完成时间", {});
          return;
        }
          $scope.uploader.uploadAll();

      };

      $scope.doAction = function(type, select, callback) {
        if(type == "cancel") {
          for(var i = $scope.projectLists.length - 1; i > -1; i--) {
            if($scope.projectLists[i].id == 0) {
              $scope.projectLists.splice(i, 1);
            }

          }
          getprojectList($scope.projectLists)
        } else if(type == "saveProject") {
          //        filterBlankOrDelete($scope.projectLists);
          if(select != "" && select != null) {
            projectUIService.updateProject(select, function(returnObj) {
              callback(returnObj);
              if(returnObj.code == 0) {
                growl.success("线体信息修改完成", {});
              }
            })
          }
        } else if(type == "deleteLinebody") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该线体记录？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                linebodyUIService.deleteById(select.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    callback(returnObj.code);
                    growl.success("线体信息已删除", {});
                    filterBlankOrDelete($scope.projectLists, select.id);
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
        } else if(type == "deviceProject") {
          $scope.ifShowSelectDevice = 1001;
          $scope.selProName = select.label;
          // getDevicesByProjectId(select.id);
        }
      };

      //获取厂部
      function customerListInit() {
        customerUIService.findCustomersByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            showIndex++;
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              obj.text = obj.customerName;
              obj.id = obj.id;
              newObj.push(obj);
            });
            $scope.CustomerList = newObj;
            $scope.customerDic = returnObj.customerDic;
            if(showIndex == 3) {
              $scope.searchData();
            }
          }
        });
      };
        //获取所有车间列表
        function workshopListInit() {
            projectUIService.findProjectsByCondition({}, function(returnObj) {
                if(returnObj.code == 0) {
                    showIndex++;
                    var newObj = [];
                    returnObj.data.forEach(function(obj) {
                        obj.text = obj.label;
                        obj.id = obj.id;
                        newObj.push(obj);
                    });
                    $scope.WorkshopList = newObj;
                   // $scope.customerDic = returnObj.customerDic;
                    if(showIndex == 3) {
                        $scope.searchData();
                    }
                }
            });
        };
      //获取经销商
      function distributorListInit() {
        distributorUIService.findDistributorsByCondition({}, function(returnObj) {
          if(returnObj.code == 0) {
            var newObj = [];
            returnObj.data.forEach(function(obj) {
              $scope.distributorDic[obj.id] = obj;
              obj.text = obj.distributorName;
              obj.id = obj.id;
              newObj.push(obj);
            })
            $scope.distributorList = newObj;
//          $scope.distributorList = newObj.concat({
//            text: '无',
//            id: -1
//          });
          }
        })
      };

      $scope.modelListSelect = [];
      //查询所有的设备模板
      var modelList = function() {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.modelListSelect = returnObj.data;
          }
        })
      }

      $scope.alertFun = function(time) {
        if($scope.linebodyInfo.debugFinishDate) {
          var date = new Date($scope.linebodyInfo.debugFinishDate);
          var qualityCloseDate = date.setFullYear(date.getFullYear() + 1);
          var newDate = new Date(qualityCloseDate).Format("yyyy-MM-dd");
          $scope.linebodyInfo.qualityCloseDate = newDate;
        }
      };

      // 清空其他选择项
      $scope.getChange = function() {
        $scope.projectItem.orCondition = !$scope.queryState ? $scope.projectItem.orCondition : null;
        $scope.projectItem.productionLineName = $scope.queryState == 1 ? $scope.projectItem.productionLineName : null;
        $scope.projectItem.customerId = $scope.queryState == 2 ? $scope.projectItem.customerId : null;
        $scope.projectItem.distributorId = $scope.queryState == 3 ? $scope.projectItem.distributorId : null;
        $scope.projectItem.domainPath = $scope.queryState == 4 ? $scope.projectItem.domainPath : null;

      };

      $scope.searchData = function() {
        var param = {
          "orCondition": $scope.projectItem.orCondition==''||$scope.projectItem.orCondition==null?$scope.projectItem.productionLineName:$scope.projectItem.orCondition,
          'customerId': "" ? "" : ($scope.projectItem.customerId ? $scope.projectItem.customerId : $routeParams.customerId),
          'domainPath': "" ? "" : $scope.projectItem.domainPath,
          'distributorId': "" ? "" : ($scope.projectItem.distributorId ? $scope.projectItem.distributorId : $routeParams.distributorId),
          'id': "" ? "" : (parseInt($routeParams.projectId) ? parseInt($routeParams.projectId) : $scope.projectItem.id),
          'productionLineName': "" ? "" : $scope.projectItem.productionLineName
        };

        linebodyUIService.findLinebodyByCondition(param, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.projectLists = returnObj.data;
            $timeout(function() {
              getprojectList($scope.projectLists)
            });
          }
        })

      };

      //根据用户Id查用户域
      var domainTreeQuery = function() {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          showIndex++;
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
          if(showIndex == 3) {
            $scope.searchData();
          }
        });
      };
      $scope.extendTableColumns = [];
      var getExtendContent = function() {
        if (!$scope.menuitems["isloaded"]) {
          var menuitemsWatch = $scope.$watch('menuitems', function(o, n) {
            if ($scope.menuitems["isloaded"]) {
              if ($scope.baseConfig && $scope.baseConfig.projectConfig && $scope.baseConfig.projectConfig.extendModelGroupId) {
                resourceUIService.getAttrsByModelId($scope.baseConfig.projectConfig.extendModelGroupId,function(returnObj) {
                  if (returnObj.code == 0)
                    $scope.extendTableColumns = returnObj.data;
                  showIndex ++
                  if(showIndex == 3) {
                    $scope.searchData();
                  }
                })
              } else {
                showIndex ++
                if(showIndex == 3) {
                  $scope.searchData();
                }
              }
              menuitemsWatch();
            }
          },true)
        } else {
          if ($scope.baseConfig && $scope.baseConfig.projectConfig && $scope.baseConfig.projectConfig.extendModelGroupId) {
            resourceUIService.getAttrsByModelId($scope.baseConfig.projectConfig.extendModelGroupId,function(returnObj) {
              if (returnObj.code == 0)
                $scope.extendTableColumns = returnObj.data;
              showIndex ++
              if(showIndex == 3) {
                $scope.searchData();
              }
            })
          } else {
            showIndex ++
            if(showIndex == 3) {
              $scope.searchData();
            }
          }
        }
      }
      var init = function() {
        initHistory();
        distributorListInit();
        modelList();
        customerListInit();
        workshopListInit();//车间列表初始化
        domainTreeQuery();
        getExtendContent();
      };

      var getAddressPoint = function(inputObj, callbackFun) {
        inputObj.values.latitude = "";
        inputObj.values.longitude = "";
        userLoginUIService.getAddressPoint(inputObj.values.standardAddress.split(",").join("") + inputObj.projectAddress, function(address) {
          inputObj.values.latitude = address.location.lat.toFixed(6);
          inputObj.values.longitude = address.location.lng.toFixed(6);
          if(callbackFun) {
            callbackFun(inputObj);
          }
        })
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
        /* * * * * * * * * * * * * * * * * *  以下上传功能模块 * * * * * * * * * * * * * * * * * */
        $scope.enterpriseObj = {};
        $scope.enterId = "";
        $scope.docUrl = 'api/rest/upload/productionLineUIService/uploadProductionLineDesc';

        var uploader = $scope.uploader = new FileUploader({
            // url:'' + sparePartUIService.uploadFileUrl +'/api/rest/upload/sparePartUIService/uploadSparePartImage',
            url: '' + userUIService.uploadFileUrl + '/' + $scope.docUrl + '',

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
            $scope.linebodyInfo.productionDescription=fileItem.file.name;
            $scope.linebodyDescDisplay = fileItem.file.name;
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
                $scope.linebodyInfo.productionDescription = $scope.linebodyDescDisplay+"&"+response.data.file;
                var linebodyInfo = $scope.linebodyInfo;
                if(linebodyInfo.id > 0) {
                    //getAddressPoint(linebodyInfo, function(linebodyInfo) {//不需要获取地址信息
                    linebodyUIService.update(linebodyInfo, function(returnObj) {
                        if(returnObj.code == 0) {
                            growl.success("线体信息修改完成", {});
                            var projectLists = $scope.projectLists;
                            for(var i in projectLists) {
                                if(projectLists[i].id == linebodyInfo.id) {
                                    $.extend(projectLists[i], linebodyInfo);
                                    break;
                                }
                            }
                            $timeout(function() {
                                getprojectList($scope.projectLists)
                            });
                            ngDialog.close();
                        }
                    })
                    // })
                } else if(linebodyInfo.id == 0) {
                    //getAddressPoint(linebodyInfo, function(linebodyInfo) {//不需要获取地址信息
                    linebodyUIService.addLinebody(linebodyInfo, function(returnObj) {
                        if(returnObj.code == 0) {
                            growl.success("线体信息创建成功", {});
                            // returnObj.data.isEdit = 0;
                            $scope.projectLists.push(returnObj.data);
                            $timeout(function() {
                                getprojectList($scope.projectLists)
                            })
                            ngDialog.close();
                        }
                    })
                    // })
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
    }

  ]);

  //故障知识
  controllers.initController('faultKnowledgeCtrl', ['$scope', 'faultKnowledgeUIService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userEnterpriseService', 'userLoginUIService', 'Info', 'growl',
    function($scope, faultKnowledgeUIService, ngDialog, $location, $routeParams, $timeout, userEnterpriseService, userLoginUIService, Info, growl) {
      $scope.selecteditem = true; //是否有已选中的故障知识
      $scope.faultKnowledgeLists = []; //存储故障知识列表，用于添加
      $scope.ifRouteParams = 0; //是否是跳转，如果是跳转隐藏添加按钮
      $scope.severiesList = [{
        "severNo": 1,
        "severName": "警告"
      }, {
        "severNo": 2,
        "severName": "次要"
      }, {
        "severNo": 3,
        "severName": "重要"
      }, {
        "severNo": 4,
        "severName": "严重"
      }];
      $scope.selSeverity = ""; //选择到的严重级别
      $scope.alertFun = function(number) {
        for(var i in $scope.faultKnowledgeLists) {
          if($scope.faultKnowledgeLists[i].isEdit == 2) {
            $scope.faultKnowledgeLists[i].severity = number;
          }
        }
      }
      var getfaultKnowledgeList = function(item) {
        $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
          "option": [item]
        });
      }

      //过滤由于添加信息后未删除的空项 || 删除与id相同的项
      function filterBlankOrDelete(obj, id) {
        for(var i in obj) {
          if(id) {
            if(obj[i].id == id) {
              obj.splice(i, 1);
            }
          } else {
            if(obj[i].id == 0) {
              obj.splice(i, 1);
            }
          }
        }
      };

      //添加故障知识
      $scope.addFaultKnowledge = function() {
        $scope.selSeverity = "";
        for(var i in $scope.faultKnowledgeLists) {
          if($scope.faultKnowledgeLists[i].id == 0 && $scope.faultKnowledgeLists[i].isEdit == 2) { //新加跳转第一项
            getfaultKnowledgeList($scope.faultKnowledgeLists);
            return;
          } else if($scope.faultKnowledgeLists[i].id != 0 && $scope.faultKnowledgeLists[i].isEdit == 2) { //编辑原地不动
            growl.warning("目前已存在正在编辑的故障知识", {});
            return;
          }
        }
        var newObj = {
          "faultNo": "",
          "category": "",
          "label": "",
          "desc": "",
          "phenomenon": "",
          "cause": "",
          "processingMethod": "",
          "severity": 0,
          'id': 0,
          'isEdit': 2
        };
        $scope.faultKnowledgeLists.push(newObj);
        getfaultKnowledgeList($scope.faultKnowledgeLists);
      }

      $scope.doAction = function(type, select, callback) {
        if(type == "savefaultKnowledge") {
          if(select != "" && select != null) {
            faultKnowledgeUIService.saveFaultKnowledge(select, function(returnObj) {
              if(returnObj.code == 0) {
                callback(returnObj.data);
                growl.success("已成功保存故障知识", {});
              }
            })
          }
        } else if(type == "deletefaultKnowledge") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确定删除此故障知识吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                faultKnowledgeUIService.deleteFaultKnowledge(select.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    callback(returnObj.code);
                    growl.success("成功删除此故障知识", {});
                    filterBlankOrDelete($scope.faultKnowledgeLists, select.id);
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
        } else if(type == "cancel") {
          for(var i = $scope.faultKnowledgeLists.length - 1; i > -1; i--) {
            if($scope.faultKnowledgeLists[i].id == 0) {
              $scope.faultKnowledgeLists.splice(i, 1);
            } else {
              $scope.faultKnowledgeLists[i]["isEdit"] = 0;
            }
          }
          $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
            "option": [$scope.faultKnowledgeLists]
          });
        }
      }

      //获取故障知识
      function getfaultKnowledges(id) {
        if(!id) { //获取所有
          faultKnowledgeUIService.getAllFaultKnowledges(function(returnObj) {
            if(returnObj.code == 0) {
              $scope.faultKnowledgeLists = [];
              for(var i in returnObj.data) {
                var obj = returnObj.data[i];
                obj.isEdit = 0;
                $scope.faultKnowledgeLists.push(obj);
              }
              $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
                "option": [$scope.faultKnowledgeLists]
              });
            }
          })

        } else {
          faultKnowledgeUIService.getByFaultNo(id, function(returnObj) {
            if(returnObj.code == 0) {
              $scope.faultKnowledgeLists = [];
              if(isArray(returnObj.data)) {
                $scope.faultKnowledgeLists = returnObj.data;
              } else {
                $scope.faultKnowledgeLists.push(returnObj.data);
              }
              $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
                "option": [$scope.faultKnowledgeLists]
              });
            }
          })
        }
      }

      if($routeParams.faultNo) {
        $scope.ifRouteParams = 2011;
        getfaultKnowledges($routeParams.faultNo);
      } else {
        getfaultKnowledges();
      }
    }
  ]);

  //线体文档
  controllers.initController('projectManagementTemplateCtrl22', ['$scope', '$q', 'ngDialog', 'FileUploader', '$controller', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'customerProjectUIService', 'sparePartUIService',
      'SwSocket', 'Info', 'viewFlexService', 'userUIService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'faultKnowledgeUIService', '$timeout', '$rootScope', 'configUIService','projectUIService',
      function($scope, q, ngDialog, FileUploader, $controller, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService, customerProjectUIService, sparePartUIService,
               SwSocket, Info, viewFlexService, userUIService, unitService, growl, userDomainService, userEnterpriseService, faultKnowledgeUIService, timeout, $rootScope, configUIService,projectUIService) {
          $scope.projectId = $routeParams.projectId;
          $scope.model = {};
          $scope.docError = {
              "name": "",
              "conter": ""
          };
          //添加文档
          $scope.addDoc = function() {
              $scope.fileType = $scope.$parent.baseConfig.modelUploadConfig ? $scope.$parent.baseConfig.modelUploadConfig.fileType : "";
              $scope.docError.name = "";
              $scope.docError.conter = "";
              $scope.uploadParam = {
                  "projectId": "",
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
           * 获得线体文档列表
           * @param {Object} project
           */
          var docInit = function() {
              projectUIService.getUploadProjectFileList($scope.projectId, function(returnObj) {
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

          $scope.successDoc = function(obj) {
              var name = escape(decodeURIComponent(obj.name));
              obj.name = name;
              obj.description = escape(decodeURIComponent(obj.description));
              $scope.model["docData"].push(obj);
          }

          //下载
          $scope.downClick = function(qualifiedName) {
              var url = userUIService.uploadFileUrl + qualifiedName;
              window.open(url);
          };

          //删除功能的action
          $scope.deleteAction = function(sel){
              BootstrapDialog.show({
                  title: '提示',
                  closable: false,
                  message: '确认删除文档吗？',
                  buttons: [{
                      label: '确定',
                      cssClass: 'btn-success',
                      action: function(dialogRef) {
                          projectUIService.deleteProjectFile(sel, function(resultObj) {
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
          }
          //初始化
          docInit();
      }
  ]);

  //上传文件
  controllers.initController('addDocCtrl', ['$scope', 'FileUploader', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'sparePartUIService',
      'SwSocket', 'Info', 'viewFlexService', 'userUIService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', 'solutionUIService', '$route','projectUIService',
      function($scope, FileUploader, $location, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService, sparePartUIService,
               SwSocket, Info, viewFlexService, userUIService, unitService, growl, userDomainService, userEnterpriseService, solutionUIService, route,projectUIService) {

          /* * * * * * * * * * * * * * * * * *  以下上传功能模块 * * * * * * * * * * * * * * * * * */
          $scope.uploader = new FileUploader({
              // url: '' + userUIService.uploadFileUrl + '/api/rest/upload/projectUIService/uploadModelFile',
              url: '' + userUIService.uploadFileUrl + '/' + $scope.docUrl + '',
              withCredentials: true, // 跨域
              queueLimit: 1, //文件个数
              removeAfterUpload: false //上传后删除文件
          });
          $scope.uploader.filters.push({
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
          $scope.uploader.onAfterAddingFile = function(fileItem) {
              // console.info('onAfterAddingFile', fileItem.name);
          };
          $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
              $scope.uploader.clearQueue();
              $scope.uploader.destroy();
              $scope.uploadParam.url = item.name;
              console.info('onWhenAddingFileFailed', item.name);
          };
          $scope.uploader.onBeforeUploadItem = function(item) {
              Array.prototype.push.apply(item.formData, uploader.formData);
              console.info('onBeforeUploadItem', item);
          };
          $scope.clearItems = function() { //重新选择文件时，清空队列，达到覆盖文件的效果
              $scope.uploader.clearQueue();
          }
          $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
              if(response.code == 0) {
                  $scope.uploader.clearItems();
                  $scope.uploader.destroy();

                  $scope.successDoc(response.data);
                  $scope.uploader.formData = [];
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
          $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
              growl.warning("上传文件失败", {});
              $scope.isLoading = false;
              console.info('onErrorItem', fileItem, response, status, headers);
          };

          $scope.UploadFile = function () {
              var docList = $scope.model['docData'];
              for(var i in docList) {
                  if(docList[i].name == $scope.uploadParam.name) {
                      $scope.docError.name = 'name';
                      $scope.docError.conter = "文档名称已存在";
                      return;
                  }
              }
              $scope.formObj = {
                  "projectId": $scope.projectId,
                  "name": encodeURIComponent($scope.uploadParam.name),
                  "description": encodeURIComponent($scope.uploadParam.description)
              };
              if(!$scope.uploader.queue || $scope.uploader.queue.length == 0) {
                  // growl.warning("请选择一个文件", {});
                  $scope.docError.name = 'error';
                  $scope.docError.conter = "请选择一个文件";
                  return;
              }
              $scope.isLoading = true;
              $scope.uploader.formData.push($scope.formObj);
              $scope.uploader.uploadAll();
          }
      }
  ]);
})
