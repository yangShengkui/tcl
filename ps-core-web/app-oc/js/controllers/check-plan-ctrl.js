define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //点检计划
  controllers.initController('checkPlanCtrl', ['$scope','checkingPlanService','linebodyUIService', 'resourceUIService', '$q', 'customerUIService', 'projectUIService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
    function($scope,checkingPlanService,linebodyUIService, resourceUIService, $q, customerUIService, projectUIService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {

      $scope.checkPlanLists = []; //点检计划列表列表
      $scope.planStatus = true;//停用、启用
      $scope.showView = false;
      $scope.addcheckPlan = {};
      $scope.addcheckPlan.canEdit = true;
      $scope.addItemNumLists = []; //存储已有项次列表，
      $scope.addItemNumListsCreate = []; //存储新增项次列表，用于添加
      $scope.addItemStatus = 2;//2添加,3查看
      $scope.selectTaskList = [];//保存启用停用



        /**
         * 对象初始化
         */

        function initAddList() {

            //点检计划
            $scope.checkplanAddData = {
                "createUserId":"",
                "createUserName":"",
                "updateUserName":"",
                "createTime":"",
                "address":"",
                "domainPath":"",//数据域
                "planNumber": "",//点检计划编号
                "projectName": "",//点检项目名称
                "checkAreaId": "",//点检区域id
                "periodicUnitName": "",//周期单位名称
                "periodicInterval": "",//周期间隔
                "startDate": "",//开始日期
                "startTime": "",//开始时间
                "planStatus": true,//是否启用，默认关闭状态
                "pointCheckLists": [],//点检项次
            };

            //查询
            $scope.queryDitem = {

                "factoryId":"",//厂站id
                "workshopId":"",//车间id
                "checkAreaId": "",//线体id
                "projectName": "",//点检计划名称

            };


        }

        //清空搜索条件
        $scope.goClear = function() {
            $scope.queryDitem = {
                factoryId: "",
                workshopId: "",
                checkAreaId: "",
                projectName: "",

            };
        };


        //tab切换
        $scope.queryState = 1;
        $scope.planListInfo = function() {

            if($scope.queryState == 1){
                location.href = "#/prod_checkPlan";

            }else if($scope.queryState == 2){
                location.href = "#/prod_maintainPlan";
            }
        };


      /**
       * 查询厂部
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
          })
      };

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

              }
          })
      };



        /**
         * 查询线体
         */
        $scope.LineBodyList=[];
        $scope.queryLineBody = function(reflash) {
            linebodyUIService.findLinebodyByCondition({}, function(returnObj) {
                if(returnObj.code == 0) {

                    var newVar = [];
                    var newObj = newVar;
                    returnObj.data.forEach(function(item) {

                        item.name = item.productionLineName;
                        item.id = item.id;
                        newObj.push(item);

                    })
                    $scope.LineBodyList = newObj;
                    if(reflash)
                        growl.success("操作成功！");

                }
            })
        };


        /**
         * 查询设备
         */

        $scope.EquipmentList;
        $scope.queryEquipment = function(reflash) {
            resourceUIService.getDevicesByCondition({}, function(returnObj) {
                if(returnObj.code == 0) {

                    $scope.EquipmentList = returnObj.data;
                    if(reflash)
                        growl.success("操作成功！");

                }
            })
        };



        //模糊查询点检计划
        $scope.goSearch = function () {
            var serarch = {};

            if($scope.queryDitem.customerId){
                serarch["factoryId"] = $scope.queryDitem.customerId;
            };
            if($scope.queryDitem.projectId){
                serarch["workshopId"] = $scope.queryDitem.projectId;
            };
            if($scope.queryDitem.checkAreaId){
                serarch["checkAreaId"] = $scope.queryDitem.checkAreaId;
            };
            if($scope.queryDitem.projectName){
                serarch["projectName"] = $scope.queryDitem.projectName;
            };
            queryData(serarch);
        };

        /**
         *  查询列表
         */
        var queryData = function(queryObj) {
            checkingPlanService.getAllCheckingListByCondition(queryObj, function(resultObj) {
                if(resultObj.code == 0) {


                    $scope.spareInfoList = [];
                    for (var i in resultObj.data) {
                        var obj = resultObj.data[i];
                        obj.isEdit = 0;

                        if(resultObj.data[i].planStatus == 0){
                            obj.planStatus = true;
                        }else{
                            obj.planStatus = false;
                        }
                        $scope.spareInfoList.push(obj);

                    }

                    $scope.spareInfoList = resultObj.data;
                    $scope.$broadcast(Event.ALERTRULESINIT + "_check", {
                        'option': [$scope.spareInfoList]
                    });
                }
            });
        };




        //添加点检计划、修改
        $scope.addCheckPlan = function(obj){


            if(obj == 0){

                //添加点检计划
                initAddList();
                $scope.addItemNumListsCreate = [];//清空项次数据
                $scope.addcheckPlan.canEdit = true;
                $scope.addItemStatus = 2;

                ngDialog.open({
                    template: '../partials/dialogue/add_check_plan.html',
                    scope: $scope,
                    className: 'ngdialog-theme-plain',
                    onOpenCallback: function () {
                        $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                            'option': [[]]
                        });
                    }
                });


            }else{

                //编辑点检计划

                $scope.addItemStatus = 3;
                $scope.checkplanAddData = obj;
                $scope.checkplanAddData.id = obj.id;

                ngDialog.open({
                    template: '../partials/dialogue/add_check_plan.html',
                    scope: $scope,
                    className: 'ngdialog-theme-plain',
                    onOpenCallback: function () {
                        $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                            'option': [$scope.checkplanAddData.pointCheckLists]
                        });
                    }
                });

            }

        };



        //保存点检计划
        $scope.saveCheckPlan=function(obj){

            if( $scope.checkplanAddData.planStatus == true){
                $scope.checkplanAddData.planStatus = 0;
            }else if($scope.checkplanAddData.planStatus == false){
                $scope.checkplanAddData.planStatus = 1;
            }

            if($scope.checkplanAddData.id > 0){



                //日期格式转化
                if(typeof $scope.checkplanAddData.startDate == "string"){
                    $scope.checkplanAddData.startDate = $scope.checkplanAddData.startDate.substring(0,10);
                }else if(typeof $scope.checkplanAddData.startDate == "object"){
                    $scope.checkplanAddData.startDate = $scope.checkplanAddData.startDate.Format("yyyy-MM-dd");
                }

                //修改点检计划
                var param = {

                    "createTime":$scope.checkplanAddData.createTime,
                    "createUserId":$scope.checkplanAddData.createUserId,
                    "createUserName":$scope.checkplanAddData.createUserName,
                    "updateUserName":$scope.checkplanAddData.updateUserName,
                    "domainPath": $scope.checkplanAddData.domainPath,//数据域
                    "planNumber": $scope.checkplanAddData.planNumber,//点检计划编号
                    "projectName": $scope.checkplanAddData.projectName,//点检计划名称
                    "checkAreaId": $scope.checkplanAddData.checkAreaId,//点检区域id
                    "periodicUnitName": $scope.checkplanAddData.periodicUnitName,//周期单位名称
                    "periodicInterval": $scope.checkplanAddData.periodicInterval,//周期间隔
                    "startDate": $scope.checkplanAddData.startDate,//开始日期
                    "startTime": $scope.checkplanAddData.startTime, //开始时间
                    "planStatus": $scope.checkplanAddData.planStatus,//是否启用
                    "id": $scope.checkplanAddData.id,
                    "pointCheckLists": $scope.checkplanAddData.pointCheckLists,//点检项次
                    "address":$scope.checkplanAddData.address
                };
                checkingPlanService.updateCheckingPlan(param, function(returnObj) {
                    if(returnObj.code == 0) {
                        $scope.closeDialog();
                        growl.success("点检计划修改成功", {});

                        getAllCheckPlan({});

                    }
                });
            }else{

                if($scope.checkplanAddData.planNumber == "" || $scope.checkplanAddData.projectName == "" || $scope.checkplanAddData.checkAreaId == "" || $scope.checkplanAddData.periodicUnitName == "" || $scope.checkplanAddData.periodicInterval == "" || $scope.checkplanAddData.startDate == "" || $scope.checkplanAddData.startTime == ""){
                    growl.warning("必填项未填", {});
                }else{
                    //新增点检计划
                    var param = {
                        "domainPath": $scope.checkplanAddData.domainPath,//数据域
                        "planNumber": $scope.checkplanAddData.planNumber,//点检计划编号
                        "projectName": $scope.checkplanAddData.projectName,//点检计划名称
                        "checkAreaId": $scope.checkplanAddData.checkAreaId,//点检区域id
                        "periodicUnitName": $scope.checkplanAddData.periodicUnitName,//周期单位名称
                        "periodicInterval": $scope.checkplanAddData.periodicInterval,//周期间隔
                        "startDate": $scope.checkplanAddData.startDate.Format("yyyy-MM-dd"),//开始日期
                        "startTime": $scope.checkplanAddData.startTime, //开始时间
                        "planStatus": $scope.checkplanAddData.planStatus,//是否启用
                        "pointCheckLists": $scope.addItemNumListsCreate//点检项次
                    };
                    checkingPlanService.addCheckingPlan(param, function(returnObj) {
                        if(returnObj.code == 0) {
                            $scope.closeDialog();
                            $scope.InsStandardItem = returnObj.data;
                            growl.success("添加点检计划成功", {});

                            getAllCheckPlan({});
                        }
                    });
                }

            }

        };


        //启用、停用
        $scope.checkPlanStatus = function(status){


            var selTask = [];
            for(var b in $scope.selectTaskList){
                if($scope.selectTaskList[b].taskStatus != status){
                    selTask.push($scope.selectTaskList[b].id);
                }
            }
            var str = '';
            if (status == 0 && selTask.length > 0) {

                str += '启用';
                BootstrapDialog.show({
                    title: '提示',
                    closable: false,
                    message: '确认'+str+'这' + selTask.length + '个计划吗？',
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn-success',
                        action: function(dialogRef) {
                            checkingPlanService.enablePlan([selTask], function(returnObj) {
                                if(returnObj.code == 0) {

                                    getAllCheckPlan({});
                                    growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
                                    $scope.selectTaskList = [];//清除
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

            } else if (status == 1 && selTask.length > 0) {

                str += '停用';
                BootstrapDialog.show({
                    title: '提示',
                    closable: false,
                    message: '确认'+str+'这' + selTask.length + '个计划吗？',
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn-success',
                        action: function(dialogRef) {
                            checkingPlanService.unEnablePlan([selTask], function(returnObj) {
                                if(returnObj.code == 0) {
                                    getAllCheckPlan({});
                                    growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
                                    $scope.selectTaskList = [];//清除
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

            }else {
                if(status == 0){
                    str += '启用';
                }else{
                    str += '停用';
                }
                growl.warning("没有要"+str+"的检点计划",{})
            }
        }


        var getaddCheckNumberList = function (item) {
            $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                "option": [item]
            });
        }


        //新增项次
        $scope.addCheckNumber = function() {


            //超出添加滚动条
            var hei = $("#checkPlanModel").height();
            if(hei > 560){
                $("#checkPlanModel").css({"height":"580px","overflow":"auto","overflow-x":"hidden"})
            }

            //添加点检计划新增项次
            if($scope.addItemStatus == 2){


                $scope.addItemNumListsCreate.equipmentId = "";//新增点检计划状态下新增项次

                if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {
                    jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
                }
                for(var i in $scope.addItemNumListsCreate) {
                    if($scope.addItemNumListsCreate[i].id == 0 && $scope.addItemNumListsCreate[i].isEdit == 2) { //新加跳转第一项
                        $scope.selCustomor = {"id":""}; //在table中的数据清空
                        $scope.selTableProjectId = ''; //在table中的数据清空
                        getaddCheckNumberList($scope.addItemNumListsCreate);

                        return;
                    } else if($scope.addItemNumListsCreate[i].id != 0 && $scope.addItemNumListsCreate[i].isEdit == 2) { //编辑原地不动
                        growl.warning("已存在正在编辑的新增项次", {});
                        return;
                    }
                }
                var newObj = {
                    'itemId': "" ,//项次
                    'equipmentId': "",//设备id
                    'checkMessage':  "",//点检内容
                    'checkStandard': "" ,//点检标准
                    'checkTool': "",//点检工具
                    'checkMethod': "",//点检方法
                    'isEdit':"2"//操作input条件
                };
                $scope.addItemNumListsCreate.push(newObj);
                getaddCheckNumberList($scope.addItemNumListsCreate);
            }else if($scope.addItemStatus == 3) {


                $scope.checkplanAddData.pointCheckLists.equipmentId = "";//新增点检计划状态下新增项次
                $scope.addItemNumListsCreate.equipmentId = "";//新增点检计划状态下新增项次
                //编辑点检计划新增项次
                if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {

                    jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
                }
                for(var i in $scope.checkplanAddData.pointCheckLists) {

                    if($scope.checkplanAddData.pointCheckLists[i].itemId == 0 && $scope.checkplanAddData.pointCheckLists[i].isEdit == 2) { //新加跳转第一项

                        $scope.selCustomor = {"id":""}; //在table中的数据清空
                        $scope.selTableProjectId = ''; //在table中的数据清空
                        getaddCheckNumberList($scope.checkplanAddData.pointCheckLists);

                        $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                            "option": [$scope.checkplanAddData.pointCheckLists]
                        });

                        return;
                    } else if($scope.checkplanAddData.pointCheckLists[i].itemId != 0 && $scope.checkplanAddData.pointCheckLists[i].isEdit == 2) { //编辑原地不动
                        growl.warning("已存在正在编辑的新增项次", {});
                        return;
                    }
                }
                var newObj = {
                    'itemId': "" ,//项次
                    'equipmentId': "",//设备名称
                    'checkMessage':  "",//点检内容
                    'checkStandard': "" ,//点检标准
                    'checkTool': "",//点检工具
                    'checkMethod': "",//点检方法
                    'isEdit':"2"//操作input条件
                };

                $scope.checkplanAddData.pointCheckLists.push(newObj);
                getaddCheckNumberList($scope.checkplanAddData.pointCheckLists);
            }

        };


        //获取所有点检计划
        var getAllCheckPlan = function() {
            checkingPlanService.getAllCheckingList(function(returnObj) {
                if (returnObj.code == 0) {

                    $scope.checkplanAddData.pointCheckLists = [];//清空列表
                    $scope.addItemNumListsCreate = [];//清空列表
                    $scope.checkPlanLists = [];//清空列表
                    for (var i in returnObj.data) {
                        var obj = returnObj.data[i];
                        obj.isEdit = 0;

                        if(returnObj.data[i].planStatus == 0){
                            obj.planStatus = true;
                        }else{
                            obj.planStatus = false;
                        }
                        $scope.checkPlanLists.push(obj);

                    }

                    $scope.$broadcast(Event.ALERTRULESINIT + "_check", {
                        "option": [$scope.checkPlanLists]
                    });

                }
            })
        };




        /**
         * 处理点检项次table
         */
        $scope.doAction = function(type, select, callback) {

            //查看点击计划
            if(type == "viewCheckPlan"){


                $scope.addcheckPlan.canEdit = false;
                ngDialog.open({
                    template: '../partials/dialogue/add_check_plan.html',
                    scope: $scope,
                    className: 'ngdialog-theme-plain'
                });
                //新增点检项次模拟数据
                $timeout(function() {
                    $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                        'option': [$scope.addItemNumLists]
                    });
                },50)

             //删除点检计划
            }else if(type == "delectCheckPlan"){
                BootstrapDialog.show({
                    title: '提示',
                    closable: false,
                    message: '确认删除此条点检计划吗？',
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn-success',
                        action: function(dialogRef) {

                            checkingPlanService.detelCheckingPlan(select.id, function(returnObj) {
                                if(returnObj.code == 0) {
                                    growl.success("成功删除点检计划", {});
                                    getAllCheckPlan({});
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

            //取消新增项次
            }else if(type == "cancelCheckNumber" ) {
                for(var i = $scope.addItemNumListsCreate.length - 1; i > -1; i--) {
                    if($scope.addItemNumListsCreate[i].itemId == 0) {
                        $scope.addItemNumListsCreate.splice(i, 1);
                    } else {
                        $scope.addItemNumListsCreate[i]["isEdit"] = 0;
                    }
                }
                $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                    "option": [$scope.addItemNumListsCreate]
                });

                //编辑状态下取消新增项次
                if($scope.addItemStatus == 3){

                    for(var i = $scope.checkplanAddData.pointCheckLists.length - 1; i > -1; i--) {
                        if($scope.checkplanAddData.pointCheckLists[i].itemId == 0) {
                            $scope.checkplanAddData.pointCheckLists.splice(i, 1);
                        } else {
                            $scope.checkplanAddData.pointCheckLists[i]["isEdit"] = 0;
                        }
                    }
                    $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                        "option": [$scope.checkplanAddData.pointCheckLists]
                    });
                }

            //保存新增项次
            } else if(type == "saveCheckNumber") {


                //编辑状态下保存新增项次
                if(select != "" && select != null) {
                    callback(select);
                    return;
                }
                $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                    "option": [$scope.checkplanAddData.pointCheckLists]
                });


            //删除新增项次
            } else if(type == "deleteCheckNumber") {

                //添加状态下删除新增项次
                if($scope.addItemStatus == 2){
                    filterBlankOrDelete($scope.addItemNumListsCreate, select.itemId);
                    $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                        "option": [$scope.addItemNumListsCreate]
                    });

                //编辑状态下删除新增项次
                }else if($scope.addItemStatus == 3) {
                    filterBlankOrDelete($scope.checkplanAddData.pointCheckLists, select.itemId);
                    $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                        "option": [$scope.checkplanAddData.pointCheckLists]
                    });
                }

            }
        };


        //状态启用停用
        $scope.doStatus = function (type, date, boolean) {
            if(type == "AlertEnable" && boolean == false) {
                checkingPlanService.unEnablePlan(date, function(returnObj) {
                    if(returnObj.code == 0) {
                        growl.success("停用成功", {});
                        getAllCheckPlan({});
                    }

                });
            }else if(type == "AlertEnable" && boolean == true) {
                checkingPlanService.enablePlan(date, function(returnObj) {
                    if(returnObj.code == 0) {
                        growl.success("启用成功", {});
                        getAllCheckPlan({});
                    }

                });
            }
        }



        //过滤由于添加信息后未删除的空项 || 删除与id相同的项
        function filterBlankOrDelete(obj, id) {
            for(var i in obj) {
                if(id) {
                    if(obj[i].itemId == id) {
                        obj.splice(i, 1);
                    }
                } else {
                    if(obj[i].id == 0) {
                        obj.splice(i, 1);
                    }
                }
            }
        };



      function init() {
        initAddList();//初始化列表项
        queryCustomer();//初始化厂部
        $scope.queryProject();//初始化车间
        $scope.queryLineBody();//初始化线体
        $scope.queryEquipment();//初始化设备
        getAllCheckPlan();//初始化表格

      };

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


  //保养计划
  controllers.initController('maintenancePlanCtrl', ['$scope','maintenancePlanService','linebodyUIService', 'resourceUIService', '$q', 'customerUIService', 'projectUIService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
        function($scope,maintenancePlanService,linebodyUIService, resourceUIService, $q, customerUIService, projectUIService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {

            $scope.maintenancePlanLists = []; //保养计划列表列表
            $scope.planStatus = true;//停用、启用
            $scope.showView = false;
            $scope.maintenanceTypeShow = 1;//1日常保养2保养大修
            $scope.addmaintenancePlan = {};
            $scope.addmaintenancePlan.canEdit = true;//查看情况下不能点击
            $scope.addmaintenancePlan.canClick = true;//保养类型是否能点击
            $scope.addItemNumLists = []; //存储已有项次列表，
            $scope.addItemNumListsCreate = []; //存储新增项次列表，用于添加
            $scope.addItemStatus = 2;//2添加,3查看
            $scope.selectTaskList = [];//保存启用停用



            /**
             * 对象初始化
             */

            function initAddList() {

                //保养计划
                $scope.maintenanceplanAddData = {
                    "createUserId":"",
                    "createUserName":"",
                    "updateUserName":"",
                    "createTime":"",
                    "address":"",
                    "domainPath":"",//数据域
                    "maintenancePlanNumber": "",//保养计划编号
                    "maintainProjectName": "",//保养项目名称
                    "deviceId": "",//保养设备id
                    "deviceName":"",//保养设备名称
                    "periodicUnitName": "",//周期单位名称
                    "periodicInterval": "",//周期间隔
                    "startDate": "",//开始日期
                    "startTime": "",//开始时间
                    "maintenanceUnitId": "",//保养类型id
                    "maintenanceName":"",//保养类型名称
                    "planStatus": true,//是否启用，默认关闭状态
                    "maintenanceTerms": [],//保养项次
                };

                //查询
                $scope.queryDitem = {

                    "factoryId":"",//厂站id
                    "workshopId":"",//车间id
                    "checkAreaId": "",//线体id
                    "maintainProjectName": "",//保养计划名称

                };

                //保养类型
                $scope.maintenanceTypeObj = [
                        {"label":"日常保养","value":"1","id":1},
                        {"label":"保养大修","value":"2","id":2}
                    ];

                var maintenanceTypeArray = [];
                $scope.maintenanceTypeObj.forEach(function(item) {
                    item.id = item.id;
                    maintenanceTypeArray.push(item);
                })
                $scope.maintenanceTypeList = maintenanceTypeArray;

            }

            //清空搜索条件
            $scope.goClear = function() {
                $scope.queryDitem = {
                    factoryId: "",
                    workshopId: "",
                    checkAreaId: "",
                    maintainProjectName: "",

                };
            };


            //tab切换
            $scope.queryState = 2;
            $scope.planListInfo = function() {

                if($scope.queryState == 1){
                    location.href = "#/prod_checkPlan";

                }else if($scope.queryState == 2){
                    location.href = "#/prod_maintainPlan";
                }
            };


            /**
             * 查询厂部
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
                })
            };

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

                    }
                })
            };



            /**
             * 查询线体
             */
            $scope.LineBodyList=[];
            $scope.queryLineBody = function(reflash) {
                linebodyUIService.findLinebodyByCondition({}, function(returnObj) {
                    if(returnObj.code == 0) {

                        var newVar = [];
                        var newObj = newVar;
                        returnObj.data.forEach(function(item) {

                            item.name = item.productionLineName;
                            item.id = item.id;
                            newObj.push(item);

                        })
                        $scope.LineBodyList = newObj;
                        if(reflash)
                            growl.success("操作成功！");

                    }
                })
            };


            /**
             * 查询设备
             */

            $scope.EquipmentList;
            $scope.queryEquipment = function(reflash) {
                resourceUIService.getDevicesByCondition({}, function(returnObj) {
                    if(returnObj.code == 0) {

                        var newObj = [];
                        returnObj.data.forEach(function(item) {

                            item.id = item.id;
                            newObj.push(item);
                        })
                        $scope.EquipmentList = newObj;

                        if(reflash)
                            growl.success("操作成功！");

                    }
                })
            };



            //模糊查询保养计划
            $scope.goSearch = function () {
                var serarch = {};

                if($scope.queryDitem.customerId){
                    serarch["factoryId"] = $scope.queryDitem.customerId;
                };
                if($scope.queryDitem.projectId){
                    serarch["workshopId"] = $scope.queryDitem.projectId;
                };
                if($scope.queryDitem.checkAreaId){
                    serarch["checkAreaId"] = $scope.queryDitem.checkAreaId;
                };
                if($scope.queryDitem.maintainProjectName){
                    serarch["maintainProjectName"] = $scope.queryDitem.maintainProjectName;
                };
                queryData(serarch);
            };

            /**
             *  查询列表
             */
            var queryData = function(queryObj) {
                maintenancePlanService.getAllMaintenancePlanListByCondition(queryObj, function(resultObj) {
                    if(resultObj.code == 0) {

                        $scope.spareInfoList = [];
                        for (var i in resultObj.data) {
                            var obj = resultObj.data[i];
                            obj.isEdit = 0;

                            if(resultObj.data[i].planStatus == 0){
                                obj.planStatus = true;
                            }else{
                                obj.planStatus = false;
                            }
                            $scope.spareInfoList.push(obj);

                        }

                        $scope.$broadcast(Event.ALERTRULESINIT + "_maintenance", {
                            'option': [$scope.spareInfoList]
                        });
                    }
                });
            };




            //添加保养计划、修改
            $scope.addMaintenancePlan = function(obj,StatusType){


                if(obj == 0){

                    //添加保养计划
                    initAddList();
                    $scope.addItemNumListsCreate = [];//清空项次数据
                    $scope.addmaintenancePlan.canEdit = true;
                    $scope.addmaintenancePlan.canClick = true;
                    $scope.addItemStatus = 2;

                    ngDialog.open({
                        template: '../partials/dialogue/add_maintain_plan.html',
                        scope: $scope,
                        className: 'ngdialog-theme-plain',
                        onOpenCallback: function () {
                            $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                                'option': [[]]
                            });
                            $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                                'option': [[]]
                            });
                        }
                    });

                }else{

                    if(obj.maintenanceUnitId == 1){
                        $scope.maintenanceTypeShow = 1;
                    }else if(obj.maintenanceUnitId == 2){
                        $scope.maintenanceTypeShow = 2;
                    }
                    //编辑保养计划
                    $scope.addItemStatus = 3;
                    $scope.maintenanceplanAddData = obj;
                    if(StatusType == 1){//查看
                        $scope.addmaintenancePlan.canEdit = false;
                        $scope.addmaintenancePlan.canClick = false;
                    }else if(StatusType == 2){//编辑
                        $scope.addmaintenancePlan.canEdit = true;
                        $scope.addmaintenancePlan.canClick = false;
                    }
                    ngDialog.open({
                        template: '../partials/dialogue/add_maintain_plan.html',
                        scope: $scope,
                        className: 'ngdialog-theme-plain',
                        onOpenCallback: function () {
                            if($scope.maintenanceplanAddData.maintenanceUnitId == 1){
                                $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {//日常保养
                                    'option': [$scope.maintenanceplanAddData.maintenanceTerms]
                                });
                            }else if($scope.maintenanceplanAddData.maintenanceUnitId == 2){
                                $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {//保养大修
                                    'option': [$scope.maintenanceplanAddData.maintenanceTerms]
                                });
                            }

                        }
                    });

                }

            };




            //保养类型
            $scope.maintenanceType = function () {
                if($scope.maintenanceplanAddData.maintenanceUnitId == 1){
                    $scope.maintenanceplanAddData.maintenanceName = "日常保养";
                    $scope.maintenanceTypeShow = 1;
                }else if($scope.maintenanceplanAddData.maintenanceUnitId == 2) {
                    $scope.maintenanceTypeShow = 2;
                    $scope.maintenanceplanAddData.maintenanceName = "保养大修";

                }
            }



            //保存保养计划
            $scope.saveMaintenancePlan=function(obj){

                //是否启用
                if( $scope.maintenanceplanAddData.planStatus == true){
                    $scope.maintenanceplanAddData.planStatus = 0;
                }else if($scope.maintenanceplanAddData.planStatus == false){
                    $scope.maintenanceplanAddData.planStatus = 1;
                }


                if($scope.maintenanceplanAddData.id > 0){


                    //日期格式转化
                    if(typeof $scope.maintenanceplanAddData.startDate == "string"){
                        $scope.maintenanceplanAddData.startDate = $scope.maintenanceplanAddData.startDate.substring(0,10);
                    }else if(typeof $scope.maintenanceplanAddData.startDate == "object"){
                        $scope.maintenanceplanAddData.startDate = $scope.maintenanceplanAddData.startDate.Format("yyyy-MM-dd");
                    }

                    //修改保养计划
                    var param = {
                        "createTime":$scope.maintenanceplanAddData.createTime,
                        "createUserId":$scope.maintenanceplanAddData.createUserId,
                        "createUserName":$scope.maintenanceplanAddData.createUserName,
                        "updateUserName":$scope.maintenanceplanAddData.updateUserName,
                        "domainPath": $scope.maintenanceplanAddData.domainPath,//数据域
                        "maintenancePlanNumber": $scope.maintenanceplanAddData.maintenancePlanNumber,//保养计划编号
                        "maintainProjectName": $scope.maintenanceplanAddData.maintainProjectName,//保养计划名称
                        "deviceId": Number($scope.maintenanceplanAddData.deviceId),//保养设备id
                        "deviceName": $scope.maintenanceplanAddData.deviceName,//保养设备名称
                        "periodicUnitName": $scope.maintenanceplanAddData.periodicUnitName,//周期单位名称
                        "periodicInterval": $scope.maintenanceplanAddData.periodicInterval,//周期间隔
                        "startDate": $scope.maintenanceplanAddData.startDate,//开始日期
                        "startTime": $scope.maintenanceplanAddData.startTime, //开始时间
                        "maintenanceUnitId": $scope.maintenanceplanAddData.maintenanceUnitId, //保养类型id
                        "maintenanceName": $scope.maintenanceplanAddData.maintenanceName, //保养类型名称
                        "planStatus": $scope.maintenanceplanAddData.planStatus,//是否启用
                        "id": $scope.maintenanceplanAddData.id,
                        "maintenanceTerms": $scope.maintenanceplanAddData.maintenanceTerms,//保养项次
                        "address":$scope.maintenanceplanAddData.address
                    };
                    maintenancePlanService.updateMaintenancePlan(param, function(returnObj) {
                        if(returnObj.code == 0) {
                            $scope.closeDialog();
                            growl.success("保养计划修改成功", {});

                            getAllMaintenancePlan({});

                        }
                    });
                }else{
                    if($scope.maintenanceplanAddData.maintenancePlanNumber == "" || $scope.maintenanceplanAddData.maintainProjectName == "" || $scope.maintenanceplanAddData.deviceId == "" || $scope.maintenanceplanAddData.periodicUnitName == ""|| $scope.maintenanceplanAddData.periodicInterval == "" || $scope.maintenanceplanAddData.startDate == "" || $scope.maintenanceplanAddData.maintenanceUnitId == ""){
                        growl.warning("必填项未填", {});
                    }else{
                        //新增保养计划
                        var param = {
                            "domainPath": "",//数据域
                            "maintenancePlanNumber": $scope.maintenanceplanAddData.maintenancePlanNumber,//保养计划编号
                            "maintainProjectName": $scope.maintenanceplanAddData.maintainProjectName,//保养计划名称
                            "deviceId": $scope.maintenanceplanAddData.deviceId,//保养设备id
                            "deviceName": $scope.maintenanceplanAddData.deviceName,//保养设备名称
                            "periodicUnitName": $scope.maintenanceplanAddData.periodicUnitName,//周期单位名称
                            "periodicInterval": $scope.maintenanceplanAddData.periodicInterval,//周期间隔
                            "startDate": $scope.maintenanceplanAddData.startDate.Format("yyyy-MM-dd"),//开始日期
                            "startTime": $scope.maintenanceplanAddData.startTime, //开始时间
                            "maintenanceUnitId": $scope.maintenanceplanAddData.maintenanceUnitId, //保养类型
                            "maintenanceName": $scope.maintenanceplanAddData.maintenanceName,//保养类型名称
                            "planStatus": $scope.maintenanceplanAddData.planStatus,//是否启用
                            "maintenanceTerms": $scope.addItemNumListsCreate//点检项次
                        };
                        maintenancePlanService.addMaintenancePlan(param, function(returnObj) {
                            if(returnObj.code == 0) {
                                $scope.closeDialog();
                                $scope.InsStandardItem = returnObj.data;
                                growl.success("添加保养计划成功", {});

                                getAllMaintenancePlan({});
                            }
                        });
                    }

                }
            };


            //启用、停用
            $scope.maintenancePlanStatus = function(status){


                var selTask = [];
                for(var b in $scope.selectTaskList){
                    if($scope.selectTaskList[b].taskStatus != status){
                        selTask.push($scope.selectTaskList[b].id);
                    }
                }
                var str = '';
                if (status == 0 && selTask.length > 0) {

                    str += '启用';
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        message: '确认'+str+'这' + selTask.length + '个计划吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                maintenancePlanService.enablePlan([selTask], function(returnObj) {
                                    if(returnObj.code == 0) {

                                        getAllMaintenancePlan({});
                                        growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
                                        $scope.selectTaskList = [];//清除
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

                } else if (status == 1 && selTask.length > 0) {

                    str += '停用';
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        message: '确认'+str+'这' + selTask.length + '个计划吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                maintenancePlanService.unEnablePlan([selTask], function(returnObj) {
                                    if(returnObj.code == 0) {
                                        getAllMaintenancePlan({});
                                        growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
                                        $scope.selectTaskList = [];//清除
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

                }else {

                    if(status == 0){
                        str += '启用';
                    }else{
                        str += '停用';
                    }
                    growl.warning("没有要"+str+"的保养计划",{})
                }
            }


            var getaddCheckNumberList = function (item) {

                if($scope.maintenanceTypeShow == 1){
                    $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                        "option": [item]
                    });
                }else if($scope.maintenanceTypeShow == 2){
                    $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                        "option": [item]
                    });
                }
            }


            //新增项次
            $scope.addMaintenanceNumber = function() {

                //超出添加滚动条
                var hei = $("#maintenancePlanModel").height();
                if(hei > 560){
                    $("#maintenancePlanModel").css({"height":"580px","overflow":"auto","overflow-x":"hidden"})
                }

                //添加保养计划新增项次
                if($scope.addItemStatus == 2){


                    if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {
                        jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
                    }
                    for(var i in $scope.addItemNumListsCreate) {
                        if($scope.addItemNumListsCreate[i].itemId == 0 && $scope.addItemNumListsCreate[i].isEdit == 2) { //新加跳转第一项
                            $scope.selCustomor = {"id":""}; //在table中的数据清空
                            $scope.selTableProjectId = ''; //在table中的数据清空
                            getaddCheckNumberList($scope.addItemNumListsCreate);

                            return;
                        } else if($scope.addItemNumListsCreate[i].itemId != 0 && $scope.addItemNumListsCreate[i].isEdit == 2) { //编辑原地不动
                            growl.warning("已存在正在编辑的新增项次", {});
                            return;
                        }
                    }

                    //日常保养
                    if($scope.maintenanceTypeShow == 1){

                        var newObj = {
                            'itemId': "" ,//项次
                            'maintenance': "",//保养内容
                            'maintenanceStandard':  "",//保养标准
                            'maintenanceTool': "" ,//保养工具
                            'inspectionMode': "",//检查方法
                            'isEdit':"2"//操作input条件
                        };

                    //保养大修
                    }else if($scope.maintenanceTypeShow == 2) {

                        var newObj = {
                            'itemId': "" ,//项次
                            'maintenancePeoject': "",//保养项目
                            'maintenance':  "",//保养内容
                            'maintenanceTool': "" ,//保养工具
                            'isEdit':"2"//操作input条件
                        };

                    }
                    $scope.addItemNumListsCreate.push(newObj);
                    getaddCheckNumberList($scope.addItemNumListsCreate);
                }else if($scope.addItemStatus == 3) {


                    //编辑保养计划新增项次
                    if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {

                        jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
                    }
                    for(var i in $scope.maintenanceplanAddData.maintenanceTerms) {

                        if($scope.maintenanceplanAddData.maintenanceTerms[i].itemId == 0 && $scope.maintenanceplanAddData.maintenanceTerms[i].isEdit == 2) { //新加跳转第一项

                            $scope.selCustomor = {"id":""}; //在table中的数据清空
                            $scope.selTableProjectId = ''; //在table中的数据清空
                            getaddCheckNumberList($scope.maintenanceplanAddData.maintenanceTerms);

                            $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                                "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                            });

                            return;
                        } else if($scope.maintenanceplanAddData.maintenanceTerms[i].itemId != 0 && $scope.maintenanceplanAddData.maintenanceTerms[i].isEdit == 2) { //编辑原地不动
                            growl.warning("已存在正在编辑的新增项次", {});
                            return;
                        }
                    }
                    //日常保养
                    if($scope.maintenanceTypeShow == 1){
                        var newObj = {
                            'itemId': "" ,//项次
                            'maintenance': "",//保养内容
                            'maintenanceStandard':  "",//保养标准
                            'maintenanceTool': "" ,//保养工具
                            'inspectionMode': "",//检查方法
                            'isEdit':"2"//操作input条件
                        };

                        //保养大修
                    }else if($scope.maintenanceTypeShow == 2) {
                        var newObj = {
                            'itemId': "" ,//项次
                            'maintenancePeoject': "",//保养项目
                            'maintenance':  "",//保养内容
                            'maintenanceTool': "" ,//保养工具
                            'isEdit':"2"//操作input条件
                        };
                    }

                    $scope.maintenanceplanAddData.maintenanceTerms.push(newObj);
                    getaddCheckNumberList($scope.maintenanceplanAddData.maintenanceTerms);
                }

            };


            //获取所有保养计划
            var getAllMaintenancePlan = function() {
                maintenancePlanService.getAllMaintenancePlanList(function(returnObj) {
                    if (returnObj.code == 0) {

                        $scope.maintenanceplanAddData.maintenanceTerms = [];//清空列表
                        $scope.addItemNumListsCreate = [];//清空列表
                        $scope.maintenancePlanLists = [];//清空列表

                        for (var i in returnObj.data) {
                            var obj = returnObj.data[i];
                            obj.isEdit = 0;


                            if(returnObj.data[i].planStatus == 0){
                                obj.planStatus = true;
                            }else{
                                obj.planStatus = false;
                            }
                            $scope.maintenancePlanLists.push(obj);

                        }

                        $scope.$broadcast(Event.ALERTRULESINIT + "_maintenance", {
                            "option": [$scope.maintenancePlanLists]
                        });

                    }
                })
            };




            /**
             * 处理保养项次table
             */
            $scope.doAction = function(type, select, callback) {

                //查看保养计划
                if(type == "viewCheckPlan"){


                    ngDialog.open({
                        template: '../partials/dialogue/add_maintain_plan.html',
                        scope: $scope,
                        className: 'ngdialog-theme-plain',
                        onOpenCallback: function () {
                            $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                                'option': [$scope.addItemNumLists]
                            });
                            $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                                'option': [$scope.addItemNumLists]
                            });
                        }
                    });


                    //删除保养计划
                }else if(type == "delectCheckPlan"){
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        message: '确认删除此条保养计划吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {

                                maintenancePlanService.detelMaintenancePlan(select.id, function(returnObj) {
                                    if(returnObj.code == 0) {
                                        growl.success("成功删除保养计划", {});
                                        getAllMaintenancePlan({});
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

                    //取消新增项次
                }else if(type == "cancelCheckNumber" ) {
                    for(var i = $scope.addItemNumListsCreate.length - 1; i > -1; i--) {
                        if($scope.addItemNumListsCreate[i].itemId == 0) {
                            $scope.addItemNumListsCreate.splice(i, 1);
                        } else {
                            $scope.addItemNumListsCreate[i]["isEdit"] = 0;
                        }
                    }
                    if($scope.maintenanceTypeShow == 1){
                        $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                            "option": [$scope.addItemNumListsCreate]
                        });
                    }else if($scope.maintenanceTypeShow == 2){
                        $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                            "option": [$scope.addItemNumListsCreate]
                        });
                    }


                    //编辑状态下取消新增项次
                    if($scope.addItemStatus == 3){

                        for(var i = $scope.maintenanceplanAddData.maintenanceTerms.length - 1; i > -1; i--) {
                            if($scope.maintenanceplanAddData.maintenanceTerms[i].itemId == 0) {
                                $scope.maintenanceplanAddData.maintenanceTerms.splice(i, 1);
                            } else {
                                $scope.maintenanceplanAddData.maintenanceTerms[i]["isEdit"] = 0;
                            }
                        }


                        if($scope.maintenanceTypeShow == 1){
                            $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                                "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                            });
                        }else if($scope.maintenanceTypeShow == 2){
                            $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                                "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                            });
                        }

                    }

                    //保存新增项次
                } else if(type == "saveCheckNumber") {


                    //编辑状态下保存新增项次
                    if(select != "" && select != null) {
                        callback(select);
                        return;
                    }

                    if($scope.maintenanceTypeShow == 1){
                        $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                            "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                        });
                    }else if($scope.maintenanceTypeShow == 2){
                        $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                            "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                        });
                    }


                    //删除新增项次
                } else if(type == "deleteCheckNumber") {

                    //添加状态下删除新增项次
                    if($scope.addItemStatus == 2){
                        filterBlankOrDelete($scope.addItemNumListsCreate, select.itemId);
                        if($scope.maintenanceTypeShow == 1){
                            $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                                "option": [$scope.addItemNumListsCreate]
                            });
                        }else if($scope.maintenanceTypeShow == 2){
                            $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                                "option": [$scope.addItemNumListsCreate]
                            });
                        }


                        //编辑状态下删除新增项次
                    }else if($scope.addItemStatus == 3) {
                        filterBlankOrDelete($scope.maintenanceplanAddData.maintenanceTerms, select.itemId);
                        if($scope.maintenanceTypeShow == 1){
                            $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                                "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                            });
                        }else if($scope.maintenanceTypeShow == 2){
                            $scope.$broadcast(Event.ALERTRULESINIT + "_pairItem", {
                                "option": [$scope.maintenanceplanAddData.maintenanceTerms]
                            });
                        }

                    }

                }
            };


            //状态启用停用
            $scope.doStatus = function (type, date, boolean) {
                if(type == "AlertEnable" && boolean == false) {
                    maintenancePlanService.unEnablePlan(date, function(returnObj) {
                        if(returnObj.code == 0) {
                            growl.success("停用成功", {});
                            getAllMaintenancePlan({});
                        }

                    });
                }else if(type == "AlertEnable" && boolean == true) {
                    maintenancePlanService.enablePlan(date, function(returnObj) {
                        if(returnObj.code == 0) {
                            growl.success("启用成功", {});
                            getAllMaintenancePlan({});
                        }

                    });
                }
            }



            //过滤由于添加信息后未删除的空项 || 删除与id相同的项
            function filterBlankOrDelete(obj, id) {
                for(var i in obj) {
                    if(id) {
                        if(obj[i].itemId == id) {
                            obj.splice(i, 1);
                        }
                    } else {
                        if(obj[i].id == 0) {
                            obj.splice(i, 1);
                        }
                    }
                }
            };



            function init() {
                initAddList();//初始化列表项
                queryCustomer();//初始化厂部
                $scope.queryProject();//初始化车间
                $scope.queryLineBody();//初始化线体
                $scope.queryEquipment();//初始化设备
                getAllMaintenancePlan();//初始化表格

            };

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