define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
    'use strict';
    controllers.controller('approveCtrl', ['$scope', 'userLoginUIService', 'resourceUIService', 'userEnterpriseService', 'userUIService', 'growl',
        function ($scope, userLoginUIService, resourceUIService, userEnterpriseService, userUIService, growl) {

            $scope.protocols = [];
            $scope.protocolVersions = [];

            //用户认证
            $scope.approveGridData = {
                columns: [{
                    title: "接入协议",
                    data: "protocol"
                }, {
                    title: "协议版本",
                    data: "protocolVersion"
                }, {
                    title: "用户名称",
                    data: "accessName"
                }, {
                    title: "密码",
                    data: "accessPassword"

                }, {
                    title: "操作",
                    orderable:false,
                    data: "option"

                }],
                columnDefs: [{
                    "targets": 0,
                    "data": "protocol",
                    "render": function (data, type, full) {

                        var str = "";
                        // 返回自定义内容
                        if (full.isEdit > 0){

                            str += '<select style="border: 1px solid #F18282;" name="protocols" id="protocols" class="combobox form-control protocols">';


                            str += '<option value="">请选择...</option>';
                            for (var i in $scope.protocols) {
                                if ($scope.protocols[i].protocol == data) {
                                    str += '<option  value="' + $scope.protocols[i].protocol + '" selected = "selected" >' + $scope.protocols[i].protocol + '</option>';
                                } else {
                                    str += '<option  value="' + $scope.protocols[i].protocol + '">' + $scope.protocols[i].protocol + '</option>';
                                }
                                // }
                            }
                            str += '</select>';
                        } else {
                            str += data;

                        }
                        return str;
                    }
                }, {
                    "targets": 1,
                    "data": "protocolVersion",
                    "render": function (data, type, full) {

                        var str = "";
                        // 返回自定义内容
                        if (full.isEdit > 0){

                            str += '<select style="border: 1px solid #F18282;" name="version" id="version" class="combobox form-control protocols">';


                            str += '<option value="">请选择...</option>';
                            if(full.protocol != "" && full.protocol != null){

                                for (var i in $scope.protocolVersions) {
                                    if($scope.protocolVersions[i].protocol == full.protocol){
                                        if ($scope.protocolVersions[i].protocolVersion == data) {
                                            str += '<option  value="' + $scope.protocolVersions[i].protocolVersion + '" selected = "selected" >' + $scope.protocolVersions[i].protocolVersion + '</option>';
                                        } else {
                                            str += '<option  value="' + $scope.protocolVersions[i].protocolVersion + '">' + $scope.protocolVersions[i].protocolVersion + '</option>';
                                        }
                                    }
                                }
                            }
                            str += '</select>';
                        } else {
                            str += data;

                        }
                        return str;
                    }
                }, {
                    "targets": 2,
                    "data": "accessName",
                    "render": function (data, type, full) {
                        // 返回自定义内容
                        if (full.isEdit > 0)
                            return "<input class='form-control col-xs-6' placeholder='不能为空、空格，最多20个字符' type='text'   maxlength='20' style='border: 1px solid #F18282;width:100%;' value='" + escape(data) + "'>";
                        else
                            return escape(data);
                    }
                }, {
                    "targets": 3,
                    "data": "accessPassword",
                    "render": function (data, type, full) {
                        // 返回自定义内容
                        if (full.isEdit > 0)
                            return "<input class='form-control col-xs-6' placeholder='不能为空、空格，最多20个字符' maxlength='20'  style='border: 1px solid #F18282;width:100%;' type='text'  value='" + escape(data) + "'>";
                        else
                            return "*********";
                    }
                }, {
                    "targets": 4,
                    "data": "option",
                    "render": function (data, type, full) {
                        if (full.isEdit > 0) {
                            return "<a id='save-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'>  <i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i> <span class='hidden-xs'> 保存</span></a><a id='cancel-btn' class='btn btn-default btn-sm' > <i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span>  </a>";

                        } else {
                            return "<a id='edit-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'>  <i class='fa fa-edit  hidden-lg hidden-md hidden-sm'></i> <span class='hidden-xs'> 编辑</span></a><a id='del-btn' class='btn btn-default btn-sm' > <i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span>  </a>";
                        }
                    }
                }]
            }
            var getAllCollectionPlugins = function() {
                resourceUIService.getAllCollectionPlugins(function(returnObj) {
                    var protocolDic = {};
                    if (returnObj.code == 0) {
                        returnObj.data.forEach(function(item){
                            if (!protocolDic[item.protocol]) {
                                protocolDic[item.protocol] = item;
                                $scope.protocols.push(item);
                            }
                        });
                        $scope.protocolVersions = returnObj.data;
                    }
                });
            }
            //添加操作
            $scope.addProve = function () {
                // userCancel();
                var newObj = {
                    protocol: "",
                    protocolVersion: "",
                    accessName: "",
                    accessPassword: "",
                    domainPath: "",
                    id: null,
                    isEdit: 3
                }
                for (var i in $scope.approveGridData.data) {
                    if ($scope.approveGridData.data[i].id == null) {
                        $scope.approveGridData.data[i] = newObj;
                        $scope.$broadcast(Event.APPROVEINIT, $scope.approveGridData);
                        return;
                    }
                }
                $scope.approveGridData.data.unshift(newObj);
                //$scope.approveGridData.data.push(newObj);

                $scope.$broadcast(Event.APPROVEINIT, $scope.approveGridData);
            }
            $scope.doAction = function(type, select) {
                if (type == "save") {
                    if (select.id == null) {
                        resourceUIService.addEnterpriseAccessAccount(select,function (resultObj) {
                            if (resultObj.code == 0) {
                                for (var i in  $scope.approveGridData.data) {
                                    if($scope.approveGridData.data[i] == null){

                                        $scope.approveGridData.data[i] = resultObj.data;
                                        $scope.approveGridData.data[i].isEdit = 0;
                                        break;
                                    }
                                }
                                $scope.getDBdata();
                                growl.success("新增认证用户成功", {});
                            }
                        });
                    }else{
                        resourceUIService.updateEnterpriseAccessAccount(select,function (resultObj) {
                            if (resultObj.code == 0) {
                                for (var i in  $scope.approveGridData.data) {
                                    if(select.id == $scope.approveGridData.data[i].id){

                                        $scope.approveGridData.data[i] = resultObj.data;
                                        $scope.approveGridData.data[i].isEdit = 0;
                                        break;
                                    }
                                }
                                //$scope.approveGridData.data = $scope.approveGridData;
                                $scope.$broadcast(Event.APPROVEINIT, $scope.approveGridData);
                                growl.success("修改认证用户成功", {});
                            }
                        });
                    }
                }else if(type == "delete"){
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        //size:BootstrapDialog.SIZE_WIDE,
                        message: '确认要删除该认证用户',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                resourceUIService.deleteEnterpriseAccessAccount(select.id, function(resultObj) {
                                    if (resultObj.code == 0) {
                                        growl.warning("删除认证用户成功!", {});
                                        $scope.getDBdata({});
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
                }else if(type == "cancel"){
                    $scope.getDBdata();
                }
            }
            //用户管理数据初始化
            $scope.getDBdata = function () {
                //查询用户企业域下的接入用户
                resourceUIService.getEnterpriseAccessAccounts(function (resultObj) {
                    if (resultObj.code == 0) {
                        $scope.approveGridData.data = resultObj.data;
                        $scope.$broadcast(Event.APPROVEINIT, $scope.approveGridData);
                    }
                });


            }
            //判断用户是否存在
            if (!userLoginUIService.user.isAuthenticated) {
                $scope.$on('loginStatusChanged', function (evt, d) {
                    if (userLoginUIService.user.isAuthenticated) {
                        $scope.getDBdata();
                        getAllCollectionPlugins();
                    }
                });
            } else {
                $scope.getDBdata();
                getAllCollectionPlugins();
            }


        }
    ]);

});