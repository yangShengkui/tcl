define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //合同条款管理
  controllers.initController('contractTermsCtrl', ['$scope', 'userEnterpriseService', 'customerUIService', 'userDomainService', 'customerProjectUIService', 'ngDialog', '$location', '$routeParams', '$timeout', 'resourceUIService', 'userLoginUIService', 'Info', 'growl',
    function($scope, userEnterpriseService, customerUIService,userDomainService, customerProjectUIService, ngDialog, $location, $routeParams, $timeout, resourceUIService, userLoginUIService, Info, growl) {
      $scope.selecteditem = true; //是否有已选中的合同条款
      $scope.contectLists = []; //存储合同条款列表，用于添加
      $scope.ifTables = true;
      $scope.shy = true;
      $scope.shy1 = false;
      $scope.ifAdd = 0; //链接跳转不允许添加
      $scope.routePaths = [];
      $scope.routePathNodes = {};
      $scope.queryDitem = null; //选择设备项
      $scope.selectedDitem = {
        "types": [], //存储所有设备模板
        "label": [], //存储所有设备
        "customerList": [], //客户展示信息
        "projectLists": [] //项目级联信息
      };

      // $scope.ifShowSelectDevice = false;
      // $scope.selectedConItem = {}; //选择到的合同条款与设备关联
      $scope.selected = { //根据模板选取的所有设备组，用于存储
        'modelId': '',
        'id': '',
        'deviceId': []
      };
      $scope.relatedDeviceList = []; //用于存储关联班组的设备id组
      // $scope.editData = 3; //3为新增，2为修改
      $scope.ifshowTable = true;
      $scope.customor = {"id":""}; //绑定图表中选中的客户Id，用于过滤项目
      $scope.selTableProject = []; //在table中选择客户所对应的项目列表
      $scope.selTableProjectId = ''; //在table中选择项目的id
      //查询及展示数据字段
      function initHistory() {
        $scope.conItem = {
          'customerId': '', //客户Id
          'projectId': '', //项目Id
          'label': '' //合同条款名称
        };
        $scope.selectedDitem.projectLists = [];
      };

      //清空查询设备数据
      $scope.clearSearchDevices = function() {
        $scope.queryDitem = {
          custermerId: $scope.selected.customerId,
          domainPath: null,
          sn: null,
          modelId: null
        };
        $scope.ifshow = 0;
      };

      var getcontectList = function(item) {
        $scope.$broadcast(Event.CONTECTITEMSINIT, {
          "option": [item]
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

      //添加合同条款
      $scope.addcontectitem = function() {
        $scope.selCustomor = '';
        $scope.selTableProjectId = '';
        if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {
          jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
        }
        for(var i in $scope.contectLists) {
          if($scope.contectLists[i].id == 0 && $scope.contectLists[i].isEdit == 2) { //新加跳转第一项
            $scope.selCustomor = {"id":""}; //在table中的数据清空
            $scope.selTableProjectId = ''; //在table中的数据清空
            getcontectList($scope.contectLists);
            return;
          } else if($scope.contectLists[i].id != 0 && $scope.contectLists[i].isEdit == 2) { //编辑原地不动
            growl.warning("已存在正在编辑的合同条款", {});
            return;
          }
        }
        var newObj = {
          'customerId': '',
          'projectId': '',
          'projectName': '',
          'customerName': '',
          'label': '',
          'takeEffectTime': '',
          'loseEfficacyTime': '',
          'createTime': new Date(),
          'id': 0,
          'isEdit': 2
        };
        $scope.customor.id = '';
        $scope.selTableProjectId = '';
        $scope.selTableProject = '';
        $scope.contectLists.unshift(newObj);
        getcontectList($scope.contectLists);
      }

      $scope.doAction = function(type, select, callback) {
        if(type == "cancel") {
          for(var i = $scope.contectLists.length - 1; i > -1; i--) {
            if($scope.contectLists[i].id == 0) {
              $scope.contectLists.splice(i, 1);
            } else {
              $scope.contectLists[i]["isEdit"] = 0;
            }
          }
          $scope.$broadcast(Event.CONTECTITEMSINIT, {
            "option": [$scope.contectLists]
          });
        } else if(type == "saveContracts") {
          if(select != "" && select != null) {
            customerProjectUIService.saveContractTerms(select, function(returnObj) {
              if(returnObj.code == 0) {
                callback(returnObj.data);
                growl.success("已成功保存合同条款", {});
                return;
              }
            })
          }
        } else if(type == "deleteContract") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确定删除此合同条款吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                customerProjectUIService.deleteContractTerms(select.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    callback(returnObj.code);
                    growl.success("成功删除此合同条款", {});
                    filterBlankOrDelete($scope.contectLists, select.id);
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
        } else if(type == "showDeviceList") {
          $scope.selProName = select.label;
          $scope.ifShowSelectDevice = "1010";
          getByContractTermsId(select.id);
          $scope.selected = select;
          $scope.selected.id = select.id; //所选合同管理id
          $scope.selected["devicesId"] = ""; //所选合同管理id
        }
      };

      //通过合同Id链接项目
      $scope.linkProject = function(id) {
        location.href = "index.html#/projectManagement///" + id;
      };

      //移除设备
      $scope.doActionss = function(type, select, callback) {
        if(type == 'removeDevice') {
          for(var i in $scope.selectedContactDevices){
            if($scope.selectedContactDevices[i].id == select.id){
              $scope.facilitySelList.push($scope.selectedContactDevices[i]);
              $scope.selectedContactDevices.splice(i, 1);
              break;
            }
          }
          growl.warning("记得点击保存按钮，要不然不会生效哦！", {});
          return true;
          /*BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确定移出此设备吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                customerProjectUIService.deleteContractTermsToDevice(select.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    growl.success("成功移出此合同条款与设备的关联", {});
                    getByContractTermsId($scope.selected.id);
                    return;
                  } else {
                    growl.warning("失败移出合同条款与设备的关联", {});
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
          });*/

        }
      };

      //合同管理关联设备，添加设备
      $scope.addDevicesToItem = function() {
        var newDevices = [{"modelId":0,"label":'',"sn":'',"isEdit":3}];
        $scope.$broadcast(Event.SELDEVICEINIT, {
          "option": [newDevices]
        });
        console.dir($scope.selectedContactDevices);
        /*if(!$scope.selected.modelId) {
          $scope.selectedDitem.label = [];
        }
        $scope.relatedDeviceList = [];
        ngDialog.open({
          template: 'templateDevice',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
        $scope.queryDitem.custermerId = $scope.selected.customerId;*/
      };

      $scope.selectedContactDevices = [];
      $scope.selectedContactObj = {};
      $scope.contactList = [];
      //根据合同条款id获取相关设备
      function getByContractTermsId(id) {
        customerProjectUIService.getByContractTermsId(id, function(returnObj) {
          if(returnObj.code == 0) {
            var selected = returnObj.data;
            $scope.contactList = returnObj.data;
            $scope.selectedContactDevices = [];
            $scope.selectedContactObj = {};
            for(var i in selected){
              $scope.selectedContactDevices.push($scope.facilitySelObj[selected[i].deviceId] );
              $scope.selectedContactObj[selected[i].deviceId] = selected[i];
            }
            var facilitySelList = [];
            for(var j in $scope.facilityList){
              if(!$scope.selectedContactObj[$scope.facilityList[j].id]){
                facilitySelList.push($scope.facilityList[j])
              }
            }
            $scope.facilitySelList = facilitySelList;
            $timeout(function() {
              $scope.$broadcast(Event.SELDEVICEINIT, {
                "option": [ $scope.selectedContactDevices]
              });
            })
          }
        })
      };

      //=========================   start devices   ========================

      //根据用户Id查用户域
      var domainTreeQuery = function() {
        userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
          $scope.domainListTree = data.domainListTree;
          $scope.domainListDic = data.domainListDic;
        });
      };

      //设备模板目录树拼接
      function handler(returnObj) {
        if(returnObj.code == 0) {
          resourceUIService.rootModelDic = {};
          for(var i in returnObj.data) {
            var obj = returnObj.data[i];
            if(!$scope.routePathNodes[obj.parentModelId])
              $scope.routePathNodes[obj.parentModelId] = [];
            $scope.routePathNodes[obj.parentModelId].push(obj);
            if(!$scope.routePathNodes[obj.id])
              $scope.routePathNodes[obj.id] = [];
            resourceUIService.rootModelDic[obj.id] = obj;
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
                if(node.id != arr[0].id)
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
                $scope.routePathNodes[key][i].parentModelId = resourceUIService.rootModel.id;
                resourceUIService.rootModel.nodes.push($scope.routePathNodes[key][i])
              }
            }
          }
          resourceUIService.rootModelDic[resourceUIService.rootModel.id] = resourceUIService.rootModel;
          $scope.rootModelDic = resourceUIService.rootModelDic;
          $scope.rootModel = resourceUIService.rootModel;
          if($routeParams.modelId) {
            if($scope.routePathNodes[$routeParams.modelId]) {
              initRoutePath(resourceUIService.rootModel, $scope.routePaths);
              var parentNode = $scope.routePaths[$scope.routePaths.length - 1];
              for(var i in parentNode.nodes) {
                if($routeParams.modelId == parentNode.nodes[i].id) {
                  $scope.treeAry = parentNode.nodes;
                  break;
                }
              }
            } else {
              $scope.treeAry = resourceUIService.rootModel.nodes;
            }
          } else {
            $scope.treeAry = resourceUIService.rootModel.nodes;
          }
        }
      };

      $scope.modelListSelect = "";
      //查询所有的设备模板
      var modelList = function() {
        resourceUIService.getModels(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.modelListSelect = returnObj.data;
            handler(returnObj);
          }

        })
      };

      $scope.devicesContractList = [];
      $scope.changeDevices = function () {
        var devicesId = $scope.selected.devicesId;
        for(var b in $scope.facilitySelList) {
          if($scope.facilitySelList[b].id == devicesId) {
            $scope.selectedContactDevices.push($scope.facilitySelList[b]);
            $scope.facilitySelList.splice(b, 1);
            break;
          }
        }
        // $scope.selectedContactDevices = returnObj.data;
          $scope.$broadcast(Event.SELDEVICEINIT, {
            "option": [$scope.selectedContactDevices]
          });
        growl.warning("记得点击保存按钮，要不然不会生效哦！", {});
      }
      
      var romverDevice = function () {
        var contact = $scope.contactList;//获取已经存在的所有设备
        var dev = $scope.selectedContactDevices;//现在保存的
        var arr = [];
        for( var i in  contact){
          var tmp = -1;
          var obj = {};
          for( var j in dev ){
            if(contact[i].deviceId != dev[j].id && $scope.selectedContactObj[dev[j].id]){
              tmp = j;
              break;
            }
          }
          if(tmp != -1){
            arr.push(contact[i]);
          }
        }
        console.dir(arr);
        if($scope.selectedContactDevices.length <= 0 && contact.length > 0){
          arr = contact;
        }
        if(arr.length > 0){
          for(var k in arr){
             customerProjectUIService.deleteContractTermsToDevice(arr[k].id, function(returnObj) {
             if(returnObj.code == 0) {
             console.log("成功移出此合同条款与设备的关联");
             }
             })
          }
        }
      }
      //点击选择设备之后保存设备
      $scope.saveselDevices = function() {
        $scope.selDevices = [];
        var dev = $scope.selectedContactDevices;
        for(var j in dev){
          if($scope.selectedContactObj[dev[j].id] == undefined){
            $scope.selDevices.push(dev[j].id);
          }
        }
        var arr = [];
        arr = [$scope.selected.id, $scope.selDevices];
        if($scope.selDevices.length > 0){
          customerProjectUIService.saveContractTermsToDevice(arr, function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("添加设备到合同条款成功", {});
              romverDevice();
              // getByContractTermsId($scope.selected.id);
              // $scope.facilitySelList = [];
              // ngDialog.close();
            }
          })
        }else{
          // growl.warning("您没有新添加的设备，赶紧加一个新设备吧！", {});
          romverDevice();
        }
      };


      //搜索设备
      $scope.facilityList = [];
      $scope.facilitySelList = [];
      $scope.facilitySelObj = {};
      $scope.searchDevices = function() {
        // $scope.ifshow = 1001;
       /* if(!$scope.queryDitem) {
          $scope.queryDitem = {
            custermerId: null,
            domainPath: null,
            sn: null,
            modelId: null
          };
        }*/
        $scope.facilitySelObj = {};
        resourceUIService.getDevicesByCondition({}, function(res) {
          if(res.code == 0) {
            $scope.facilityList = res.data;
//          $scope.facilitySelList = res.data;
            for(var i in res.data){
              $scope.facilitySelObj[res.data[i].id] = res.data[i];
            }
           /* for(var i in faciList) {
              var index = -1;
              faciList[i]["check"] = "";
              for(var j in $scope.selectedContactDevices) {
                if($scope.selectedContactDevices[j].deviceId == faciList[i].id) {
                  index = j;
                }
              }
              if(index == -1) {
                $scope.facilityList.push(faciList[i]);
              }
            }*/

            // $scope.$broadcast(Event.SELDEVICEINIT + "_faciDivice", $scope.facilityList);
          }
        });
      };

      //=========================   end devices   ========================

      //获取客户
      (function() {
        customerUIService.findCustomersByCondition({},function(returnObj) {
          if(returnObj.code == 0) {
            var newObj = [];
            $scope.customersObj = {};
            returnObj.data.forEach(function(obj) {
              $scope.customersObj[obj.id] = obj;
              obj.text = obj.customerName;
              obj.id = obj.id;
              newObj.push(obj);
            });
            $scope.CustomerList = newObj;
            $scope.selectedDitem.customerList = returnObj.data;
          }
        });
      })();

      $scope.projectObj = {};
      //获取所有项目
      function getAllProjects() {
        customerProjectUIService.getAllProjects(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.projectLists = returnObj.data;
            returnObj.data.forEach(function(item) {
              $scope.projectObj[item.id] = item;
            });
          }
        })
      };

      //通过客户过滤项目
      $scope.getselectedProject = function(customerId) {
        $scope.selectedDitem.projectLists = [];
        var arr = [];
        if(!customerId) {
          return;
        } else {
          for(var i in $scope.projectLists) {
            var projectObj = $scope.projectLists[i];
            if(projectObj.customerId == customerId) {
              arr.push(projectObj);
            }
          }
          if(!$scope.conItem.customerId) {
            return arr;
          } else {
            $scope.selectedDitem.projectLists = arr;
          }
        }
      };

      $scope.alertFunCustom = function() {
        var name = '';
        var id = $scope.customor.id;
        $scope.selTableProject = $scope.getselectedProject(id);
        for(var k in $scope.CustomerList) {
          if($scope.CustomerList[k].customerID == id) {
            name = $scope.CustomerList[k].customerName;
          }
        }
        for(var i in $scope.contectLists) {
          if($scope.contectLists[i].isEdit == 2) {
            $scope.contectLists[i].customerName = name;
            $scope.contectLists[i].customerId = parseInt(id);
            break;
          }
        }
      };

      $scope.alertFunProId = function(id) {
        var proname = '';
        for(var i in $scope.selTableProject) {
          if($scope.selTableProject[i].id == id) {
            proname = $scope.selTableProject[i].label;
          }
        }
        for(var j in $scope.contectLists) {
          if($scope.contectLists[j].isEdit == 2) {
            $scope.contectLists[j].projectName = proname;
            $scope.contectLists[j].projectId = id;
            break;
          }
        }
      };

      $scope.cancelData = function() {
        if($routeParams.customerId || $routeParams.deviceId || $routeParams.contractId) {
          return;
        } else {
          initHistory();
          // $scope.ifshowTable = false;
        }
      };

      // 清空其他选择项
      $scope.getChange = function() {
        if($scope.queryState == 1) {
          $scope.conItem.projectId = "";
          $scope.conItem.label = "";
        } else if($scope.queryState == 2) {
          $scope.conItem.customerId = "";
          $scope.conItem.label = "";
        } else if($scope.queryState == 3) {
          $scope.conItem.projectId = "";
          $scope.conItem.customerId = "";
        }
      }

      //查询合同条款
      $scope.searchData = function() {
        $scope.ifshowTable = true;
        var param = {
          'customerId': "" ? "" : ($routeParams.customerId ? $routeParams.customerId : $scope.conItem.customerId),
          'label': $scope.conItem.label ? $scope.conItem.label : "",
          'deviceId': "" ? "" : ($routeParams.deviceId ? $routeParams.deviceId : $scope.conItem.deviceId),
          'projectId': "" ? "" : ($routeParams.contractId ? $routeParams.contractId : $scope.conItem.projectId),
          'size': 5000
        };
        customerProjectUIService.findContractTerms(param, function(returnObj) {
          if(returnObj.code == 0) {
            if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {
              jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
            }
            for(var i in returnObj.data) {
              returnObj.data[i].isEdit = 0;
            }
            $scope.contectLists = returnObj.data;
            $timeout(function() {
              $scope.$broadcast(Event.CONTECTITEMSINIT, {
                "option": [returnObj.data]
              });
            })
          }
        })
      };

      var init = function() {
        initHistory();
        // customerListInit();
        getAllProjects();
        domainTreeQuery();
        $scope.clearSearchDevices();
        resourceUIService.getRootModel(function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModel = returnObj.data;
            $scope.routePaths.push(returnObj.data);
            modelList();
          }
        });
        $scope.searchDevices();
        if($routeParams.customerId || $routeParams.deviceId || $routeParams.contractId) {
          $scope.ifAdd = 2010;
          $scope.searchData();
        } else {
          $scope.ifAdd = 0;
          $scope.searchData();
          $timeout(function() {
            $scope.$broadcast(Event.CONTECTITEMSINIT, {
              "option": []
            });
          })
        }
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

  //项目管理
  controllers.initController('projectManagementCtrl', ['$scope', 'resourceUIService', 'customerProjectUIService', 'distributorUIService', 'userDomainService', 'projectUIService', 'ngDialog', '$location', '$routeParams', '$timeout', 'customerUIService', 'userLoginUIService', 'Info', 'growl',
    function($scope, resourceUIService, customerProjectUIService, distributorUIService, userDomainService, projectUIService, ngDialog, $location, $routeParams, $timeout, customerUIService, userLoginUIService, Info, growl) {
      var routeParamsObj = null;
      $scope.provinces = $scope.$parent.provinces;
      $scope.cityDics = $scope.$parent.cityDics;
      $scope.districtDics = $scope.$parent.districtDics;
      $scope.projectItem = {
        "orCondition": "",
        "id": "",
        "customerId": 0, //客户id
        "domainPath": "", //客户归属
        "distributorId": 0, //经销商id
        "projectName": "" //项目名称
      };
      //查询/展示字段
      function initHistory() {
        $scope.projectInfo = {
          "id": 0,
          "province": "",
          "city": "",
          "county": "",
          "values": {},
          "projectAddress": "", //项目地址
          "customerId": "", //客户id
          "installDate": "", //安装日期
          "domainPath": null, //客户归属
          "debugFinishDate": "", //调试完成日期
          "distributorId": "", //经销商id
          "projectName": "", //项目名称
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

      $scope.selectedProject = true; //是否有已选中的项目
      $scope.projectLists = []; //存储项目，用于添加
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
        $scope.projectInfo.county = "";
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
        $scope.$broadcast(Event.PROJECTMANAGEINIT, {
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

      //添加项目
      $scope.addproject = function() {
        $scope.provinces = $scope.$parent.provinces;
        $scope.cityDics = $scope.$parent.cityDics;
        $scope.districtDics = $scope.$parent.districtDics;
        initHistory();
        // if ($routeParams.customerId) {
        //   $scope.projectInfo.domainPath = $scope.customerDic[$routeParams.customerId].domainPath;
        //   $scope.projectInfo.customerId = parseInt($routeParams.customerId);
        // } else if ($routeParams.distributorId) {
        //   $scope.projectInfo.distributorId = parseInt($routeParams.distributorId);
        // }
        ngDialog.open({
          template: '../partials/dialogue/project_management_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
      };

      $scope.saveData = function() {
        var projectInfo = $scope.projectInfo;
        projectInfo.qualityCloseDate = new Date(projectInfo.qualityCloseDate);
        projectInfo.debugFinishDate = new Date(projectInfo.debugFinishDate);
        projectInfo.installDate = new Date(projectInfo.installDate);
        projectInfo.values.standardAddress = projectInfo.county ? projectInfo.county : (projectInfo.city ? projectInfo.city : (projectInfo.province));
        if(projectInfo.debugFinishDate < projectInfo.installDate) {
          growl.warning("调试完成时间需大于项目安装时间", {});
          return;
        }
        if(projectInfo.qualityCloseDate < projectInfo.installDate) {
          growl.warning("质保截止时间需大于项目安装时间", {});
          return;
        }
        if(projectInfo.qualityCloseDate < projectInfo.debugFinishDate) {
          growl.warning("质保截止时间需大于调试完成时间", {});
          return;
        }
        if(projectInfo.projectAddress == undefined) {
            growl.warning("详细地址输入格式不正确，请重新输入", {});
            return;
        }
        if(projectInfo.id > 0) {
          getAddressPoint(projectInfo, function(projectInfo) {
            projectUIService.updateProject(projectInfo, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("项目信息修改完成", {});
                var projectLists = $scope.projectLists;
                for(var i in projectLists) {
                  if(projectLists[i].id == projectInfo.id) {
                    $.extend(projectLists[i], projectInfo);
                    break;
                  }
                }
                $timeout(function() {
                  getprojectList($scope.projectLists)
                });
                ngDialog.close();
              }
            })
          })
        } else if(projectInfo.id == 0) {
          getAddressPoint(projectInfo, function(projectInfo) {
            projectUIService.addProject(projectInfo, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("项目信息创建成功", {});
                // returnObj.data.isEdit = 0;
                $scope.projectLists.push(returnObj.data);
                $timeout(function() {
                  getprojectList($scope.projectLists)
                })
                ngDialog.close();
              }
            })
          })
        }
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
                growl.success("项目信息修改完成", {});
              }
            })
          }
        } else if(type == "deleteProject") {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: '确认删除该项目记录？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                projectUIService.deleteProjectById(select.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    callback(returnObj.code);
                    growl.success("项目信息已删除", {});
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

      //获取客户
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
        if($scope.projectInfo.debugFinishDate) {
          var date = new Date($scope.projectInfo.debugFinishDate);
          var qualityCloseDate = date.setFullYear(date.getFullYear() + 1);
          var newDate = new Date(qualityCloseDate).Format("yyyy-MM-dd");
          $scope.projectInfo.qualityCloseDate = newDate;
        }
      };

      // 清空其他选择项
      $scope.getChange = function() {
        $scope.projectItem.orCondition = !$scope.queryState ? $scope.projectItem.orCondition : null;
        $scope.projectItem.projectName = $scope.queryState == 1 ? $scope.projectItem.projectName : null;
        $scope.projectItem.customerId = $scope.queryState == 2 ? $scope.projectItem.customerId : null;
        $scope.projectItem.distributorId = $scope.queryState == 3 ? $scope.projectItem.distributorId : null;
        $scope.projectItem.domainPath = $scope.queryState == 4 ? $scope.projectItem.domainPath : null;

      };

      $scope.searchData = function() {
        var param = {
          "orCondition": "" ? "" : $scope.projectItem.orCondition,
          'customerId': "" ? "" : ($scope.projectItem.customerId ? $scope.projectItem.customerId : $routeParams.customerId),
          'domainPath': "" ? "" : $scope.projectItem.domainPath,
          'distributorId': "" ? "" : ($scope.projectItem.distributorId ? $scope.projectItem.distributorId : $routeParams.distributorId),
          'id': "" ? "" : (parseInt($routeParams.projectId) ? parseInt($routeParams.projectId) : $scope.projectItem.id),
          'projectName': "" ? "" : $scope.projectItem.projectName
        };

        projectUIService.findProjectsByCondition(param, function(returnObj) {
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

  //项目文档
  controllers.initController('projectManagementTemplateCtrl', ['$scope', '$q', 'ngDialog', 'FileUploader', '$controller', '$location', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService', 'customerProjectUIService', 'sparePartUIService',
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
              $scope.docUrl = 'api/rest/upload/projectUIService/uploadProjectFile';
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
           * 获得项目文档列表
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
          var uploader = $scope.uploader = new FileUploader({
              // url: '' + userUIService.uploadFileUrl + '/api/rest/upload/projectUIService/uploadModelFile',
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
              if(!uploader.queue || uploader.queue.length == 0) {
                  // growl.warning("请选择一个文件", {});
                  $scope.docError.name = 'error';
                  $scope.docError.conter = "请选择一个文件";
                  return;
              }
              $scope.isLoading = true;
              uploader.formData.push($scope.formObj);
              uploader.uploadAll();
          }
      }
  ]);
})
