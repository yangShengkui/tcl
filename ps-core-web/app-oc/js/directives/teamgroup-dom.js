define(['directives/directives', 'datatables.net','datatables.net-bs'], function(directives, datatables) {
    'use strict';
    directives.initDirective('team2userTable', function($timeout, $compile) {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs',
                function($scope, $element, $attrs) {
                    var domMain = $element;
                    var table;
                    var isEditing = false;

                    $scope.$on(Event.TEAM2USERINIT, function(event, args) {
                        if (table) {
                            table.destroy();
                        }

                        isEditing = false;
                        table = domMain.DataTable({
                            dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
                            language: directives.datatable.language,
                            data: args.option[0],
                            "order": [
                                [4, "asc"]
                            ],
                            columns: [{
                                title: "用户名称",
                                data: "userName"
                            }, {
                                title: "手机/邮箱",
                                data: "userEmail"
                            }, {
                                title: "办公电话",
                                data: "officePhone"
                            }, {
                                title: "操作",
                                orderable: false,
                                data: "option"
                            }, {
                                title: "",
                                data: "userID",
                                visible: false
                            }],
                            columnDefs: [{
                                "targets": 0,
                                "data": "userName",
                                "render": function(data, type, full) {
                                    //返回自定义名字
                                    if (full.isEdit == 2 && type == "display") {
                                        var str = '<select id="userDomainName" name="userName" class="combobox form-control">' +
                                            '<option value="">请选择用户</option>';
                                        var argData = args.option[0];
                                        var enterpriseData = $scope.enterpriseUser;

                                        for (var i = 0; i < enterpriseData.length; i++) {
                                            var index = -1;
                                            for (var j = 0; j < argData.length; ++j) {
                                                if (argData[j].userID == enterpriseData[i].userID) {
                                                    index = j;
                                                }
                                            }
                                            if (index == -1) {
                                                str += '<option value="' + enterpriseData[i].userID + '">' + enterpriseData[i].userName + '</option>';
                                            }
                                        }
                                        str += '</select>';
                                        return str;
                                    } else {
                                        return data;
                                    }
                                }
                            }, {
                                "targets": 3,
                                "data": "option",
                                "render": function(data, type, full) {
                                    var str = "<div class='input-group'>";
                                    if (full.isEdit == 2) {
                                        str += "<a id='save-btn'  class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 保存</span></a>"
                                        str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                                    } else {
                                        str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 移出</span></a>"
                                    }
                                    str += "</div>"
                                    return str;
                                }
                            }]
                        });
                    });

                    /**
                     * 监听表格初始化后，添加按钮
                     */
                    domMain.on('init.dt', function() {
                        var parentDom = $(".special-btn").parent();
                        parentDom.html('<a ng-click="addGroupUser()"  ng-disabled="!selectedGroup" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加班组用户</span></a>');
                        $compile(parentDom)($scope);
                    });
                    domMain.on('click', 'td', function(e) {
                        e.preventDefault();
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        var rowData = row.data();

                        if (rowData) {
                            if (($(this).context.cellIndex == 4 && rowData.isEdit == 0)) {
                                return;
                            }
                            if (rowData.isEdit == 1) {}
                        }
                    });

                    domMain.on('click', '#save-btn', function(e) {
                        e.stopPropagation();
                        var tr = $(this).closest('tr');
                        var selectRow = table.row('.shown');
                        var selVal = $("#userDomainName").val();
                        $scope.doActions('saveTeam', selVal);

                    });

                    domMain.on('click', '#cancel-btn', function(e) {
                        e.stopPropagation();
                        isEditing = false;
                        var selectRow = table.row('.shown');

                        $scope.doActions('cancel');
                    });

                    domMain.on('click', '#del-btn', function(e) {
                        e.preventDefault();
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        $scope.doActions('removeUser', row.data());
                    });

                    domMain.on('click', '#changeDomain-btn', function(e) {
                        e.preventDefault();
                        isEditing = false;
                        if (!isEditing) {
                            isEditing = true;
                            var tr = $(this).closest('tr');

                            var row = table.row(tr);

                            row.data().isEdit = 1;
                        }
                    });

                    domMain.on('click', '#removeDomain-btn', function(e) {
                        //e.preventDefault();
                        isEditing = false;
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        var selectRow = table.row('.shown');

                        $scope.doActions('removeDomain', row.data());
                    })

                }
            ]
        }
    })

    directives.initDirective('team2deviceTable', function($timeout, $compile, $filter) {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;

                $scope.$on(Event.TEAM2DEVICEINIT, function(event, args) {
                    if (table) {
                        table.destroy();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
                        language: directives.datatable.language,
                        data: args.data[0],
                        order: [
                            [0, "desc"]
                        ],
                        columns: [{
                                data: "label",
                                title: "名称"
                            }
                            // , {
                            //     data: "externalDevId",
                            //     title: "设备地址"
                            // }
                            , {
                                data: "createTime",
                                title: "上线时间"
                            },
                            //  {
                            //     data: "onlineStatus",
                            //     title: "在线状态"
                            // }, {
                            //     data: "health",
                            //     title: "健康度"
                            // },
                            {
                                data: "option",
                                orderable: false,
                                title: "操作"
                            }
                        ],
                        columnDefs: [{
                                targets: 1,
                                data: "createTime",
                                render: function(data, type, full) {
                                    // 返回自定义内容    
                                    var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                                    //var str = "<date-label value=" + data + " format='yyyy-MM-dd HH:mm:ss'>";
                                    return str;
                                }
                            }, {
                                targets: 0,
                                data: "label",
                                render: function(data, type, full) {
                                    // 返回自定义内容    
                                    if (full.isEdit == 2 && type == "display")
                                        return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                                    else
                                        return escape(data);
                                }
                            },
                            //  {
                            //     targets: 3,
                            //     data: "onlineStatus",
                            //     render: function(data, type, full) {
                            //         // 返回自定义内容    
                            //         return "<span class='label " + (data == 'online' ? "label-primary" : "label-warning") + "'>" + (data == 'online' ? "在线" : "离线") + "</span>";
                            //     }
                            // }, {
                            //     targets: 4,
                            //     data: "health",
                            //     render: function(data, type, full) {
                            //         // 返回自定义内容    
                            //         return "<div class='progress progress-xs progress-striped active'><div class='progress-bar " + (data > 90 ? "progress-bar-success" : (data > 79 ? "progress-bar-warning" : (data > 59 ? "progress-bar-minor" : (data > 39 ? "progress-bar-major" : "progress-bar-red")))) + "' style='width:" + data + "%'></div></div>";
                            //     }
                            // },
                            {
                                "targets": 2,
                                "data": "option",
                                "render": function(data, type, full) {
                                    var str = "<div class='input-group'>";
                                    if (full.isEdit == 2) {
                                        str += "<a id='save-btn'  class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 保存</span></a>"
                                        str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                                    } else {
                                        str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 移出</span></a>"
                                    }
                                    str += "</div>"
                                    return str;
                                }
                            }
                        ]
                    });
                });

                /**
                 * 监听表格初始化后，添加按钮
                 */
                domMain.on('init.dt', function() {
                    var parentDom = $(".special-btn").parent();
                    parentDom.html('<a ng-click="addDevices()"  ng-disabled="!selectedGroup" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加设备</span></a>');
                    $compile(parentDom)($scope);
                });
                domMain.on('click', 'td', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var rowData = row.data();

                    // if (rowData) {
                    //     if (($(this).context.cellIndex == 4 && rowData.isEdit == 0)) {
                    //         return;
                    //     }
                    //     if (rowData.isEdit == 1) {}
                    // }
                });

                domMain.on('click', '#save-btn', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var selectRow = table.row('.shown');
                    var selVal = $("#userDomainName").val();
                    $scope.doAction('saveTeam', selVal);
                });

                domMain.on('click', '#cancel-btn', function(e) {
                    e.stopPropagation();
                    isEditing = false;
                    var selectRow = table.row('.shown');

                    $scope.doAction('cancel');
                });

                domMain.on('click', '#del-btn', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    $scope.doAction('removeDevice', row.data());
                });

                domMain.on('click', '#changeDomain-btn', function(e) {
                    e.preventDefault();
                    isEditing = false;
                    if (!isEditing) {
                        isEditing = true;
                        var tr = $(this).closest('tr');

                        var row = table.row(tr);

                        row.data().isEdit = 1;
                    }
                });

                domMain.on('click', '#removeDomain-btn', function(e) {
                    //e.preventDefault();
                    isEditing = false;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var selectRow = table.row('.shown');

                    $scope.doAction('removeDomain', row.data());
                })

            }]
        }
    })

});
