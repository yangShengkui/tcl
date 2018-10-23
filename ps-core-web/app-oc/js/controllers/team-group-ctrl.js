define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
    'use strict';
    controllers.initController('teamGroupCtrl', ['$scope', 'solutionUIService', 'userInitService', 'ngDialog', 'kpiDataService', 'viewFlexService', 'resourceUIService', 'userDomainService', '$location', '$routeParams', '$timeout', 'userEnterpriseService', 'userLoginUIService', 'Info', 'growl', 'maintenanceUIService',
        function($scope, solutionUIService, userInitService, ngDialog, kpiDataService, viewFlexService, resourceUIService, userDomainService, $location, $routeParams, $timeout, userEnterpriseService, userLoginUIService, Info, growl, maintenanceUIService) {
            $scope.activeListTab = "tab3";
            $scope.queryGroupList = [];
            $scope.selectedGroup = "";
            $scope.formReg = { 'name': '', 'workArea': '' };
            $scope.teamGroupList = {};
            $scope.userGridData = {};
            $scope.groupsAry = [];
            $scope.selectedTeamDevices = [];
            $scope.relatedDeviceList = []; //用于存储关联班组的设备id组
            $scope.teamTypes = [
                { "teamType": "巡检组", "typeName": "巡检组" },
                { "teamType": "保安组", "typeName": "保安组" }
            ];

            $scope.domainListDic = {};
            $scope.domainListTree = null;
            $scope.routePathNodes = {};
            $scope.rootModel = [];
            $scope.rootModelDic = {};
            $scope.selectedDeviceIds = []; //所选的多个设备

            function initDeviceHistory() {
                $scope.selectedAlertitem = { // 根据域和模板选择设备
                    'domain': '', //域
                    'nodeType': '', //模板
                    'id': '' //设备id
                };
            }

            $scope.selectedDitem = { //所选域或模板下的所有设备
                'label': [],
                'types': []
            };
            $scope.selectedDeviceList = []; //选择关联好的多个设备


            //获取所有班组
            maintenanceUIService.getAllTeams(function(returnObj) {
                if (returnObj.code == 0) {
                    $scope.queryGroupList = returnObj.data;
                    $scope.selectedGroup = returnObj.data[0];
                }
            });

            $scope.addTeamGroup = function() {
                //if ($scope.activeListTab == 'tab3') {
                var arr = [];
                for (var i in $scope.queryGroupList) {
                    var obj = $scope.queryGroupList[i];
                    arr.push(obj);
                    if (obj.id == 0) {
                        growl.warning("当前有未保存班组", {});
                        return;
                    }
                }
                $scope.activeListTab = 'tab3';
                var doAdd = function(newModelName) {
                    var newModel = {};
                    newModel.name = newModelName; //班组名称
                    newModel.id = 0;
                    newModel.workArea = ''; //工作区域
                    newModel.remark = ''; //备注
                    newModel.teamType = ''; //班组类型
                    $scope.queryGroupList.unshift(newModel);
                    $scope.selectedGroup = newModel;
                };
                doAdd('');
                //} else {
                //  growl.warning("请切换到用户组信息再进行新增操作", {});
                //}
            };

            $scope.delTeamGroup = function() {
                if ($scope.selectedGroup.id != 0) {
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        //size:BootstrapDialog.SIZE_WIDE,
                        message: '确认删除 ' + $scope.selectedGroup.name + ' 吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                if ($scope.selectedGroup) {
                                    maintenanceUIService.deleteTeamById($scope.selectedGroup.id, function(returnObj) {
                                        if (returnObj.code == 0) {
                                            var arr = [];
                                            for (var i in $scope.queryGroupList) {
                                                if ($scope.selectedGroup.id != $scope.queryGroupList[i].id) {
                                                    arr.push($scope.queryGroupList[i]);
                                                }
                                            }
                                            $scope.queryGroupList = arr;
                                            growl.success("删除班组成功", {});
                                            if (arr.length > 0)
                                                $scope.groupClick($scope.queryGroupList[0]);
                                            else
                                                $scope.selectedGroup = null;
                                        } else {
                                            growl.error("删除班组失败", {});
                                        }

                                    })
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
                } else {
                    var arr = [];
                    for (var i in $scope.queryGroupList) {
                        if ($scope.selectedGroup.id != $scope.queryGroupList[i].id) {
                            arr.push($scope.queryGroupList[i]);
                        }
                    }
                    $scope.queryGroupList = arr;
                    $scope.selectedGroup = $scope.queryGroupList[0];
                    growl.success("删除班组成功", {});
                    return;
                }
            }

            $scope.saveTeamGroup = function() {
                var selectedTeam = {};
                if ($scope.formReg.name == 0) {
                    if ($scope.selectedGroup.name == "") {
                        growl.info("请先填写班组名称", {});
                        $scope.formReg["name"] = "1000";
                        return;
                    }

                    //如果id等于0 进行新增操作否则进行修改操作
                    if ($scope.selectedGroup.id == 0) {
                        for (var i in $scope.queryGroupList) {
                            if ($scope.selectedGroup.name == $scope.queryGroupList[i].name && $scope.queryGroupList[i].id != 0) {
                                growl.warning("您输入的班组名称已存在，请重新输入", {});
                                return;
                            }
                        }
                        var param = {
                            'name': $.trim($scope.selectedGroup.name),
                            'workArea': $.trim($scope.selectedGroup.workArea),
                            'teamType': $scope.selectedGroup.teamType,
                            'remark': $.trim($scope.selectedGroup.remark)
                        };

                        maintenanceUIService.addTeam(param, function(returnObj) {
                            if (returnObj.code == 0) {
                                selectedTeam = returnObj.data;
                                var arr = [];
                                for (var i in $scope.queryGroupList) {
                                    if ($scope.queryGroupList[i].id == 0) {
                                        arr.push(returnObj.data);
                                        continue;
                                    } else {
                                        arr.push($scope.queryGroupList[i]);
                                    }
                                }

                                $scope.queryGroupList = arr;
                                $scope.groupClick(returnObj.data);
                                $scope.selectedGroup = returnObj.data;
                                growl.success("新增班组成功", {});
                            } else {
                                growl.success("新增班组失败", {});
                            }
                        })

                    } else {

                        for (var i in $scope.queryGroupList) {
                            if ($scope.queryGroupList[i].id != $scope.selectedGroup.id && $scope.selectedGroup.name == $scope.queryGroupList[i].name) {
                                growl.warning("当前有重复班组名称，请修改", {});
                                return;
                            }
                        }
                        if ($scope.selectedGroup.name == "") {
                            $scope.formReg["name"] = "1000";
                            return;
                        }
                        var param = {
                            "domainPath": $scope.selectedGroup.domainPath,
                            "id": $scope.selectedGroup.id,
                            'name': $.trim($scope.selectedGroup.name),
                            'workArea': $.trim($scope.selectedGroup.workArea),
                            'teamType': $scope.selectedGroup.teamType,
                            'remark': $.trim($scope.selectedGroup.remark)
                        };
                        maintenanceUIService.updateTeam(param, function(returnObj) {
                            if (returnObj.code == 0) {
                                var arr = [];
                                for (var i in $scope.queryGroupList) {
                                    if ($scope.queryGroupList[i].id == $scope.selectedGroup.id) {
                                        arr.push(returnObj.data);
                                        continue;
                                    } else {
                                        arr.push($scope.queryGroupList[i]);
                                    }
                                }
                                $scope.queryGroupList = arr;
                                $scope.selectedGroup = returnObj.data;
                                growl.success("修改班组成功", {});
                            } else {
                                growl.success("修改班组失败", {});
                            }
                        })

                    }
                } else {

                }

            };

            $scope.groupClick = function(group) {
                $scope.selectedGroup = group;
                initDeviceHistory();
                initLinkUsers($scope.selectedGroup.id);
                getAllDevices($scope.selectedGroup.id);

            };

            $scope.$watch("selectedGroup.name", function(newValue, oldValue) {
                $scope.formReg["name"] = "0";
                //var reg = /^[\u4e00-\u9fa5a-zA-Z][u4e00-\u9fa5a-za-zA-Z0-9_]{0,40}$/;
                if ($scope.selectedGroup != undefined) {
                    var newName = $.trim(newValue);
                    if (newName != "" && newName != null) {
                        //if (!reg.test(newValue)) {
                        //    $scope.formReg["name"] = "1000";
                        //} else {
                        //    $scope.formReg["name"] = "0";
                        //}
                    } else {
                        $scope.formReg["name"] = "0";
                    }
                }
            });
            $scope.$watch("selectedGroup.workArea", function(newValue, oldValue) {
                $scope.formReg["desc"] = "0";
                //var reg = /^[u4e00-\u9fa5a-za-zA-Z0-9][u4e00-\u9fa5a-za-zA-Z0-9]{0,100}$/;
                if ($scope.selectedGroup != undefined) {
                    var newName = $.trim(newValue);
                    if (newName != "" && newName != null) {
                        //if (!reg.test(newValue)) {
                        //    $scope.formReg["desc"] = "1001";
                        //} else {
                        //    $scope.formReg["desc"] = "0";
                        //}
                    } else {
                        $scope.formReg["desc"] = "0";
                    }
                }

            });



            //=========================   关联用户  ===================================

            //根据班组Id获取对应用户信息
            function initLinkUsers(teamId) {
                // var teamId = $scope.selectedGroup.id;
                maintenanceUIService.getUsersByTeamId(teamId, function(returnObj) {
                    if (returnObj.code == 0) {
                        for (var i in returnObj.data) {
                            var obj = returnObj.data[i];
                            // obj.isEdit = 0;
                            if (obj.emailAddress == null || obj.emailAddress == "") {
                                obj["userEmail"] = obj.mobilePhone;
                            } else {
                                obj["userEmail"] = obj.emailAddress;
                            }
                        }
                        $scope.teamGroupList = returnObj.data;
                        $scope.$broadcast(Event.TEAM2USERINIT, {
                            "option": [$scope.teamGroupList]
                        });
                    }
                })
            }


            //添加用户关联班组
            $scope.addGroupUser = function() {
                if ($scope.selectedGroup == undefined) {
                    growl.warning("请选择班组，再进行以下操作", {});
                    return;
                }
                if ($scope.selectedGroup.id == 0) {
                    growl.warning("请先保存新添加的班组，再进行以下操作", {});
                    return;
                }

                var newObj = {
                    userName: '选择用户',
                    emailAddress: '',
                    mobilePhone: '',
                    officePhone: '',
                    id: 0,
                    // domainId: '',
                    userEmail: '',
                    domainPath: '',
                    isEdit: 2,
                    userType: 2,
                    userTypeLabel: "普通用户",
                    jobTitle: "",
                    discription: "",
                    edit: "",
                    userID: null
                }

                if ($scope.teamGroupList.length > 0) {
                    if ($scope.teamGroupList.length != $scope.enterpriseUser.length) {
                        for (var i in $scope.teamGroupList) {
                            if ($scope.teamGroupList[i].userID == null) {
                                growl.warning("请先保存用户再进行添加", {});
                                $scope.$broadcast(Event.TEAM2USERINIT, {
                                    "option": [$scope.teamGroupList]
                                });
                                return;
                            } else {
                                $scope.teamGroupList.unshift(newObj);
                                $scope.$broadcast(Event.TEAM2USERINIT, {
                                    "option": [$scope.teamGroupList]
                                });
                                return;
                            }
                        }
                    } else {
                        growl.warning("您已经没有用户可以添加", {});
                        return;
                    }
                } else {
                    $scope.teamGroupList.unshift(newObj);
                    $scope.$broadcast(Event.TEAM2USERINIT, {
                        "option": [$scope.teamGroupList]
                    });
                    return;
                }
            }

            /*
             *dataTable 统一处理方式（用户）
             */
            $scope.doActions = function(type, select) {
                if (type == "saveTeam") {
                    if (select != "" && select != null) {
                        var param = {
                            "userId": select,
                            "teamId": $scope.selectedGroup.id
                        };
                        maintenanceUIService.addUserToTeam(param, function(returnObj) {
                            if (returnObj.code == 0) {
                                growl.success("添加用户到班组成功", {});
                                initLinkUsers($scope.selectedGroup.id);
                            } else {
                                growl.warning("用户已经存在该班组中，添加失败", {});
                                return;
                            }
                        });
                    } else {
                        growl.warning("请选择用户", {});
                        return;
                    }
                } else if (type == "removeUser") {
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        //size:BootstrapDialog.SIZE_WIDE,
                        message: '确认将用户 "' + select.userName + '"移出" ' + $scope.selectedGroup.name + '" 吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                var parameter = [select.userID, $scope.selectedGroup.id];
                                maintenanceUIService.deleteUserToTeamByUserIdAndTeamId(parameter, function(returnObj) {
                                    if (returnObj.code == 0) {
                                        growl.success("用户组移出用户成功", {});
                                        initLinkUsers($scope.selectedGroup.id);
                                    } else {
                                        growl.warning("该用户移出失败", {});
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
                } else if (type == "cancel") {
                    growl.success("已取消添加班组用户", {});
                    initLinkUsers($scope.selectedGroup.id);
                }
            }


            //获取用户
            var userListInit = function() {
                userEnterpriseService.queryEnterpriseUser(function(returnObj) {
                    if (returnObj.code == 0) {
                        $scope.enterpriseUser = returnObj.data;
                        initLinkUsers($scope.selectedGroup.id);
                    }
                })
            };



            // =========================  设备信息  =============================

            //添加设备
            $scope.addDevices = function() {
                if (!$scope.selectedAlertitem.nodeType) {
                    $scope.selectedDitem.label = [];
                }
                ngDialog.open({
                    template: 'templateId',
                    className: 'ngdialog-theme-plain',
                    scope: $scope
                });
            }


            //通过域获取设备
            // $scope.getDevices = function() {
            //     var domainPath = $scope.selectedAlertitem.domain;
            //     resourceUIService.getDevicesByDomainPath(domainPath, function(returnObj) {
            //         if (returnObj.code == 0) {
            //             $scope.selectedDitem.label = returnObj.data;
            //         }
            //     })
            // }

            //获取设备模板
            function getDeviceTypes() {
                solutionUIService.getGroupModels(function(returnObj) {
                    if (returnObj.code == 0) {
                        $scope.selectedDitem.types = returnObj.data;
                    }
                })
            }

            //根据设备模板选择设备
            $scope.getDeviceType = function(id) {
                if (id == null || id == undefined || id == '') {
                    return;
                }
                $scope.selectedDitem.label = [];
                resourceUIService.getResourceByModelId(id, function(returnObj) {
                    if (returnObj.code == 0) {
                        var array = [];
                        for (var i in returnObj.data) {
                            var index = -1;
                            if ($scope.selectedTeamDevices.legnth == 0) {
                                $scope.selectedDitem.label = returnObj.data;
                            } else {
                                for (var j in $scope.selectedTeamDevices) {
                                    if (returnObj.data[i].id == $scope.selectedTeamDevices[j].id) {
                                        index = j;
                                    }
                                }
                                if (index == -1) {
                                    $scope.selectedDitem.label.push(returnObj.data[i]);
                                }
                            }
                        }

                        if ($scope.selectedDitem.label.length == 0) {
                            growl.warning("此模板下已没有可添加设备", {});
                        }

                    }
                })
            }

            $scope.saveDevices = function() {
                if ($scope.relatedDeviceList.length == 0) {
                    growl.warning("请先选择设备模板", {});
                    return;
                }
                var param = {
                    "teamId": $scope.selectedGroup.id,
                    "deviceIds": $scope.relatedDeviceList
                };

                maintenanceUIService.addDevicesToTeam(param, function(returnObj) {
                    if (returnObj.code == 0) {
                        growl.success("添加设备到班组成功", {});
                        getAllDevices($scope.selectedGroup.id);
                        $scope.selectedAlertitem.nodeType = '';
                        $scope.selectedAlertitem.id = '';
                        ngDialog.close();
                    }
                });
            }

            //点击多个设备关联，获取设备Id组信息
            $scope.selectedDevices = function(item) {
                // var arr = []; //用来存储设备，去重
                if ($scope.selectedTeamDevices == '' || $scope.selectedTeamDevices == undefined) {
                    $scope.relatedDeviceList = item;
                } else {
                    $scope.relatedDeviceList = [];
                    for (var i in $scope.selectedTeamDevices) {
                        for (var j in item) {
                            if (item[j] != $scope.selectedTeamDevices[i].id) {
                                $scope.relatedDeviceList.push(item[j]);
                                // growl.warning("该设备已添加", {});
                            }
                        }
                    }
                }

            };

            //根据班组获取对应设备信息
            function getAllDevices(teamId) {
                // var teamId = $scope.selectedGroup.id;
                maintenanceUIService.getDevicesByTeamId(teamId, function(returnObj) {
                    if (returnObj.code == 0) {
                        $scope.selectedTeamDevices = returnObj.data;
                        // var arr = [];
                        // for (var i in returnObj.data) {
                        //     arr[i] = returnObj.data[i].resource;
                        //     arr[i].device2TeamId = returnObj.data[i].deviceToTeamId;
                        // }
                        $scope.$broadcast(Event.TEAM2DEVICEINIT, {
                            "data": [$scope.selectedTeamDevices]
                        });
                    }
                })
            }


            //删除关联设备
            $scope.doAction = function(type, select) {
                if (type == "removeDevice") {
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        //size:BootstrapDialog.SIZE_WIDE,
                        message: '确认将设备 "' + select.label + '"移出" ' + $scope.selectedGroup.name + '" 吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                var parameter = [select.id, $scope.selectedGroup.id];
                                maintenanceUIService.deleteDeviceToTeamByDeviceIdAndTeamId(parameter, function(returnObj) {
                                    if (returnObj.code == 0) {
                                        growl.success("班组移出设备成功", {});
                                        getAllDevices($scope.selectedGroup.id);
                                    } else {
                                        growl.warning("该设备移出失败", {});
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





            /**
             * 初始化切换事件
             *
             */
            var initEvent = function() {
                $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                    var aname = $(e.target).attr("name");
                    var targetText = $(e.target).text();
                    $scope.activeListTab = aname;
                    $scope.$apply();
                    if (aname == "tab4") {
                        if ($scope.selectedGroup != undefined) {
                            if ($scope.selectedGroup.id != undefined) {
                                if ($scope.selectedGroup.id == 0) {
                                    return;
                                }
                                userListInit();
                            } else {
                                growl.warning("请先添加班组再进行切换", {});
                                $scope.teamGroupList = null;
                                return;
                            }
                        }
                    }
                    if (aname == "tab5") {
                        if ($scope.selectedGroup != undefined) {
                            if ($scope.selectedGroup.id != undefined) {
                                if ($scope.selectedGroup.id == 0) {
                                    return;
                                }
                                getAllDevices($scope.selectedGroup.id);

                            } else {
                                growl.warning("请先添加班组再进行切换", {});
                                $scope.teamGroupList = null;
                                return;
                            }
                        }
                    }
                });
            };


            if (!userLoginUIService.user.isAuthenticated) {
                $scope.$on('loginStatusChanged', function(evt, d) {
                    if (userLoginUIService.user.isAuthenticated) {
                        initEvent();
                        getDeviceTypes();
                        initDeviceHistory();
                        // userListInit();
                    }
                });
            } else {
                initEvent();
                getDeviceTypes();
                initDeviceHistory();
                // userListInit();
            }
        }
    ]);

    controllers.initController('sparePartCtrl', ['$scope', 'userInitService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userEnterpriseService', 'userLoginUIService', 'Info', 'growl',
        function($scope, userInitService, ngDialog, $location, $routeParams, $timeout, userEnterpriseService, userLoginUIService, Info, growl) {
            // $scope.spareData = {
            //     "label": '测试',
            //     "type": '备件'
            // };

            // var path = "../../localdb/demo_sparepart.json";
            // Info.get(path, function(info) {
            //     alert(3);
            //     console.log(info.data);
            // });

            // demo
            $scope.demo_sparepart = [{
                "label": "备件1",
                "coding": 1234577899,
                "type": "备件型号1",
                "currentNumber": 43,
                "minimum": 21
            }, {
                "label": "备件2",
                "coding": 123457334459,
                "type": "备件型号2",
                "currentNumber": 73,
                "minimum": 32
            }, {
                "label": "备件3",
                "coding": 1234577439,
                "type": "备件型号3",
                "currentNumber": 443,
                "minimum": 23
            }, {
                "label": "备件4",
                "coding": 123434549,
                "type": "备件型号4",
                "currentNumber": 993,
                "minimum": 22
            }, {
                "label": "备件5",
                "coding": 12345222299,
                "type": "备件型号5",
                "currentNumber": 433,
                "minimum": 28
            }];

            // end demo


            function spareData() {

                $scope.$broadcast(Event.STOREINIT, {
                    "option": [$scope.demo_sparepart]
                });
            }

            var initEvent = function() {
                $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                    var aname = $(e.target).attr("name");
                    if (aname == "store") {
                        spareData();
                        // $scope.addUserName = "新建用户";
                        $scope.$broadcast(Event.STOREINIT, {
                            "option": [$scope.demo_sparepart]
                        });
                    } else if (aname == "stats") {
                        spareData();
                        // $scope.addUserName = "新建角色";
                        $scope.$broadcast(Event.STATSINIT, {
                            "option": [$scope.demo_sparepart]
                        });
                    }
                    $scope.$apply();
                });
            };

            $timeout(domReady);

            function domReady() {
                spareData();
            }
            initEvent();

        }
    ]);

});
