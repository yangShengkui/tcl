define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'], function(directives, BootstrapDialog, datatables) {
  'use strict';

  //======================================    点检计划     ===========================================
  directives.initDirective('checkPlanTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ALERTRULESINIT + "_check", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [10, "desc"]
            ],
            columns: [$.ProudSmart.datatable.selectCol, {
              data: "address",
              title: "点检区域"
            }, {
              data: "projectName",
              title: "点检计划名称"
            }, {
              data: "planNumber",
              title: "点检计划编号"
            }, {
              data: "periodicUnitName",
              title: "周期单位"
            }, {
              data: "periodicInterval",
              title: "周期间隔"
            }, {
              data: "startDate",
              title: "开始日期"
            }, {
              data: "startTime",
              title: "开始时间"
            }, {
              data: "createUserName",
              title: "制定人"
            }, {
              data: "planStatus",
              title: "启用",
              visible: $scope.planStatus ? true : false,
              orderable: false
            }, {
              data: "risingTime",
              title: "操作",
              visible: false
            }, $.ProudSmart.datatable.optionCol3],
            columnDefs: [{
              "targets": 0,
              "orderable": false,
              "render": function(data, type, full) {
                // 返回自定义内容
                if(type == "display") {
                  if(data) {
                    return '<input class="itemCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              targets: 1,
              data: "address",
              render: function(data, type, full) {
                  return escape(data);
              }
            }, {
                targets: 2,
                data: "projectName",
                render: function(data, type, full) {
                    return escape(data);
                }
            }, {
                targets: 3,
                data: "planNumber",
                render: function(data, type, full) {
                    return escape(data);
                }
            }, {
              targets: 4,
              data: "periodicUnitName",
              render: function(data, type, full) {

                  var str = "";
                  if(data){
                      if(data == "year"){
                          str = "年";
                      }else if(data == "month") {
                          str = "月";
                      }else if(data == "week") {
                          str = "周";
                      }else if(data == "day"){
                          str = "日"
                      }else if(data == "disposable"){
                          str = "一次"
                      }else if(data == "quarter") {
                          str = "季度"
                      }
                  }
                  return str;
                }
            }, {
              targets: 5,
              data: "periodicInterval",
              render: function(data, type, full) {

                  return escape(data);
              }
            }, {
              targets: 6,
              data: "startDate",
              render: function(data, type, full) {

                  var str = "";
                  str = $filter('date')(data, 'yyyy-MM-dd');
                  return str;
              }
            }, {
              targets: 7,
              data: "startTime",
              render: function(data, type, full) {
                  return escape(data);
              }
            }, {
              targets: 8,
              data: "createUserName",
              render: function(data, type, full) {
                  return escape(data);
                }
            }, {
              targets: 9,
              data: "planStatus",
              visible: $scope.planStatus ? true : false,
              render: function(data, type, full) {
                if(type == "display") {
                  if(data) {
                    return '<input class="enabledCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="enabledCheckBox" type="checkbox" >';
                  }
                }
                return "";
              }
            }, {
                targets: 10,
                data: "",
                render: function(data, type, full) {

                    return escape(data);
                }
            }, {
              "targets": 11,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                  if($scope.menuitems['A06_S45']) {
                      str += "<button id='view-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                  }

                  if($scope.menuitems['A05_S45']) {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if($scope.menuitems['A04_S45']) {
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              if(aData.selected) {
                $(nRow).addClass("selected")
              } else {
                $(nRow).removeClass("selected")
              }
              $compile(nRow)($scope);
            }
          });
        });

        /**
         * 查看
         */
        domMain.on('click', '#view-btn', function(e) {

            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.addcheckPlan.canEdit = false;
            $scope.addCheckPlan(rowData);
        });


      /**
       * 编辑
       */
        domMain.on('click', '#edit-btn', function(e) {

            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.addcheckPlan.canEdit = true;
            $scope.addCheckPlan(rowData);
        });

        domMain.on('click', '#del-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('delectCheckPlan', row.data());
        });

      /**
       * 勾选操作
       */
        domMain.on('change', '#allselect-btn', function(e) {

          e.stopPropagation();
          var abledIndex = 0;
          var unabledIndex = 0;
          if(e.target.checked) {
            table.rows().select();
            var tableRows = table.rows({
              selected: true
            });

            //所有的id
            $scope.selectTaskList = [];
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = true;

                $scope.selectTaskList.push({
                  id:row.data().id
              });

              if(row.data().enabled) { //启用
                abledIndex++;
              } else { //停用
                unabledIndex++;
              }
            };

            if(abledIndex == tableRows.count()) {
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else if(unabledIndex == tableRows.count()) {
              $scope.abled = true;
            } else {
              $scope.unabled = true;
              $scope.abled = true;
              $scope.selectedCount = 0;
            }
            table.rows().invalidate().draw(false);
            $scope.$apply();

          } else {
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = false;

                $scope.selectTaskList = [];

            };
            table.rows().deselect();
            table.rows().invalidate().draw(false);
            $scope.abled = false;
            $scope.unabled = false;
            $scope.selectedCount = 0;
            $scope.$apply();
          }


        });

        //所有勾选的id

        domMain.on('change', '.itemCheckBox', function(e) {

          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if(e.target.checked) {
            row.data().selected = true;
              $scope.selectTaskList.push({
                  id:row.data().id
              });

          } else {
              for(var i in $scope.selectTaskList) {
                  if($scope.selectTaskList[i].id == row.data().id) {
                      $scope.selectTaskList.splice(i, 1);
                  }
              }
            row.data().selected = false;
          }

          $scope.$apply();
        });

        domMain.on('change', '.enabledCheckBox', function(e) {

          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var param = [];
          if(e.target.checked) {
            row.data().planStatus = true;
            param = [[row.data().id]];
            $scope.doStatus("AlertEnable", param,row.data().planStatus);
          } else {
            row.data().planStatus = false;
            param = [[row.data().id]];
            $scope.doStatus("AlertEnable", param,row.data().planStatus);
          }

        });

      }]

    }

  }]);



  //======================================    新增点检计划项次    ===================================================
  directives.initDirective('addItemTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_item", function(event, args) {

                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [7, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "itemId",
                            title: "项次",
                            width: "5%"
                        }, {
                            data: "equipmentId",
                            title: "设备",
                            width: "10%"
                        }, {
                            data: "checkMessage",
                            title: "点检内容",
                            width: "10%"
                        }, {
                            data: "checkStandard",
                            title: "点检标准",
                            width: "30%"
                        }, {
                            data: "checkTool",
                            title: "点检工具",
                            width: "10%"
                        }, {
                            data: "checkMethod",
                            title: "点检方法",
                            width: "10%"
                        }, {
                            data: "risingTime",
                            title: "操作",
                            width: "10%",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "itemId",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            targets: 2,
                            data: "equipmentId",
                            render: function(data, type, full) {

                                var str = "";
                                if(full.isEdit ==2 && type == "display"){

                                    str = '<select style="width:80%" class="form-control input-sm ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"  ng-model="addItemNumListsCreate.equipmentId"  ng-options="value.id as value.label for value in EquipmentList" selectdata="EquipmentList"></select>';
                                    return str;
                                }else{

                                    for(var i in $scope.EquipmentList){
                                        if($scope.EquipmentList[i].id == data){
                                            str = $scope.EquipmentList[i].label;
                                        }
                                    }
                                    return str;
                                }
                            }
                        }, {
                            targets: 3,
                            data: "checkMessage",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display") {
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                }else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 4,
                            data: "checkStandard",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 5,
                            data: "checkTool",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 6,
                            data: "checkMethod",
                            render: function(data, type, full) {

                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 7,
                            data: "",
                            render: function(data, type, full) {
                               return escape(data);
                            }
                        }, {
                            "targets": 8,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = '';
                                if(full.isEdit == 2) {
                                    str += '<div class="btn-group btn-group-sm">' +
                                        '<a id="save-button" class="btn btn-primary" ng-disabled="addcheckPlan.canEdit == false"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">确定</span></a>' +
                                        '<a id="cancel-button" class="btn btn-default" ng-disabled="addcheckPlan.canEdit == false"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                                } else {
                                    str += '<div class="btn-group btn-group-sm">';
                                    if ($scope.menuitems['A02_S10']) {
                                        str += '<a id="edit-button" class="btn btn-primary" ng-disabled="addcheckPlan.canEdit == false"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                    }
                                    if ($scope.menuitems['A03_S10']) {
                                        str += '<a id="delect-button" class="btn btn-default" ng-disabled="addcheckPlan.canEdit == false"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';
                                    }
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });



                /**
                 * 保存新增项次
                 */
                domMain.on('click', '#save-button', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var checkPass = true;

                    //项次
                    var itemids = $("#addCheckNumberTable").find("tr").length-1;
                    if (itemids<10) {
                        itemids = "0" +itemids;
                    }else{
                        itemids = itemids;
                    }


                    $.each(tr.children(), function(j, val1) {
                        var jqob1 = $(val1);

                        //把input变为字符串
                        if(!jqob1.has('button').length && jqob1.has('input').length) {
                            var txt = $.trim(jqob1.children("input").val());
                            if(txt) {

                                if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5 || j == 6){

                                    var txt = jqob1.children("input").val();
                                    jqob1.html(txt);
                                    table.cell(jqob1).data(txt); //修改DataTables对象的数据
                                }

                                $(val1).removeClass('danger');
                            } else {
                                $(val1).addClass('danger');
                                checkPass = false;
                                return false;
                            }
                        }
                    });
                    if(checkPass) {

                        row.data().itemId = itemids;
                        row.data().equipmentId = $scope.addItemNumListsCreate.equipmentId;
                        $scope.doAction('saveCheckNumber', row.data(), function(returnObj) {

                            if(returnObj) {
                                row.data().isEdit = 0;
                                isEditing = false;
                                row.data().itemId = itemids;

                                row.data().equipmentId = $scope.addItemNumListsCreate.equipmentId;
                                row.cells().invalidate().draw(false);
                            }else{
                                row.data().isEdit = 2;
                            }
                        });
                    }
                });

                domMain.on('click', '#edit-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if(!isEditing) {
                        isEditing = true;
                        row.data().isEdit = 2;

                        row.cells().invalidate().draw(false);
                    } else {
                        if(row.data().isEdit == 0) {
                            growl.warning("当前有正编辑的点检项次", {});
                            return;
                        }
                    }
                    if(row.data().id == 0) {
                        growl.warning("当前有正编辑的点检项次", {});
                        return;
                    }

                    $scope.addItemNumListsCreate.equipmentId = row.data().equipmentId;
                    //$scope.doAction('editCheckNumber', row.data());
                });

                domMain.on('click', '#cancel-button', function(e) {

                    e.stopPropagation();
                    isEditing = false;
                    var row = table.row('.shown');
                    if(row.data()) {
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    } else {
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    }

                });

                domMain.on('click', '#delect-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);

                    $scope.doAction('deleteCheckNumber', row.data());
                    $scope.isEdit = 0;
                    row.remove().draw(false);
                });


                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {
                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;
                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();

                    }
                });

                domMain.on('change', '.itemCheckBox', function(e) {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    var tableRows = table.rows({
                        selected: true
                    });
                    if(e.target.checked) {
                        row.data().selected = true;
                        if(row.data().enabled) { //启用
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else {
                            $scope.abled = true;
                        }
                    } else {
                        row.data().selected = false;
                        var rows = table.rows();
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
                            $scope.abled = false;
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
                            $scope.abled = true;
                            $scope.unabled = false;
                        }
                    }
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {
                    var self = this;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().enabled = true;
                        param = [
                            [row.data().id], true
                        ];
                    } else {
                        row.data().enabled = false;
                        param = [
                            [row.data().id], false
                        ];
                    }
                    $scope.doAction("AlertEnable", param, function(returnObj) {
                        if(returnObj.code == 0) {
                            table.rows().invalidate().draw(false);
                            if(!e.target.checked) {
                                $(self).prop("checked", false);
                                growl.success("停用成功", {});
                            } else {
                                $(self).attr("checked", true);
                                growl.success("启用成功", {});
                            }
                            $(".itemCheckBox").each(function() {
                                $(this).attr("checked", false);
                            });
                            $("#allselect-btn").attr("checked", false);
                            table.rows().deselect();
                        } else if(!returnObj) {
                            if(!e.target.checked) {
                                row.data().enabled = true;
                                $(self).prop("checked", true);
                            } else {
                                row.data().enabled = false;
                                $(self).attr("checked", false);
                            }
                        }
                    }, true);
                });



            }]

        }

    }]);



  //======================================    保养计划     ===========================================
  directives.initDirective('maintenancePlanTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_maintenance", function(event, args) {
                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [13, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "address",
                            title: "设备位置"
                        }, {
                            data: "deviceName",
                            title: "设备名称"
                        }, {
                            data: "deviceCode",
                            title: "设备编码"
                        }, {
                            data: "maintainProjectName",
                            title: "保养计划名称"
                        }, {
                            data: "maintenancePlanNumber",
                            title: "保养计划编号"
                        }, {
                            data: "maintenanceName",
                            title: "保养类型"
                        }, {
                            data: "periodicUnitName",
                            title: "周期单位"
                        }, {
                            data: "periodicInterval",
                            title: "周期间隔"
                        }, {
                            data: "startDate",
                            title: "开始日期"
                        }, {
                            data: "startTime",
                            title: "开始时间"
                        }, {
                            data: "createUserName",
                            title: "制定人"
                        }, {
                            data: "planStatus",
                            title: "启用",
                            visible: $scope.planStatus ? true : false,
                            orderable: false
                        }, {
                            data: "risingTime",
                            title: "操作",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "address",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 2,
                            data: "deviceName",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 3,
                            data: "deviceCode",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 4,
                            data: "maintainProjectName",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 5,
                            data: "maintenancePlanNumber",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 6,
                            data: "maintenanceName",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 7,
                            data: "periodicUnitName",
                            render: function(data, type, full) {

                                var str = "";
                                if(data){
                                    if(data == "year"){
                                        str = "年";
                                    }else if(data == "month") {
                                        str = "月";
                                    }else if(data == "week") {
                                        str = "周";
                                    }else if(data == "day"){
                                        str = "日"
                                    }else if(data == "disposable"){
                                        str = "一次"
                                    }else if(data == "quarter") {
                                        str = "季度"
                                    }
                                }
                                return str;
                            }
                        }, {
                            targets: 8,
                            data: "periodicInterval",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            targets: 9,
                            data: "startDate",
                            render: function(data, type, full) {

                                var str = "";
                                str = $filter('date')(data, 'yyyy-MM-dd');
                                return str;
                            }
                        }, {
                            targets: 10,
                            data: "startTime",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 11,
                            data: "createUserName",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            targets: 12,
                            data: "planStatus",
                            visible: $scope.planStatus ? true : false,
                            render: function(data, type, full) {
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="enabledCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="enabledCheckBox" type="checkbox" >';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 13,
                            data: "",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            "targets": 14,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = "<div class='btn-group btn-group-sm'>";
                                if($scope.menuitems['A06_S45']) {
                                    str += "<button id='view-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                                }

                                if($scope.menuitems['A05_S45']) {
                                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                                }
                                if($scope.menuitems['A04_S45']) {
                                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });

                /**
                 * 查看
                 */
                domMain.on('click', '#view-btn', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var rowData = row.data();
                    $scope.addMaintenancePlan(rowData,1);
                });


                /**
                 * 编辑
                 */
                domMain.on('click', '#edit-btn', function(e) {

                    e.stopPropagation();
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var rowData = row.data();
                    $scope.addMaintenancePlan(rowData,2);
                });

                domMain.on('click', '#del-btn', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    $scope.doAction('delectCheckPlan', row.data());
                });

                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {

                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });

                        //所有的id
                        $scope.selectTaskList = [];
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;

                            $scope.selectTaskList.push({
                                id:row.data().id
                            });

                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };

                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;

                            $scope.selectTaskList = [];

                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();
                    }


                });

                //所有勾选的id

                domMain.on('change', '.itemCheckBox', function(e) {

                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if(e.target.checked) {
                        row.data().selected = true;
                        $scope.selectTaskList.push({
                            id:row.data().id
                        });

                    } else {
                        for(var i in $scope.selectTaskList) {
                            if($scope.selectTaskList[i].id == row.data().id) {
                                $scope.selectTaskList.splice(i, 1);
                            }
                        }
                        row.data().selected = false;
                    }

                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {

                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().planStatus = true;
                        param = [[row.data().id]];
                        $scope.doStatus("AlertEnable", param,row.data().planStatus);
                    } else {
                        row.data().planStatus = false;
                        param = [[row.data().id]];
                        $scope.doStatus("AlertEnable", param,row.data().planStatus);
                    }

                });

            }]

        }

    }]);



  //======================================    新增日常保养项次    ===================================================
  directives.initDirective('addDailyMaintenanceTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_maintainItem", function(event, args) {

                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [6, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "itemId",
                            title: "项次",
                            width: "5%"
                        }, {
                            data: "maintenance",
                            title: "保养内容",
                            width: "20%"
                        }, {
                            data: "maintenanceStandard",
                            title: "保养标准",
                            width: "35%"
                        }, {
                            data: "maintenanceTool",
                            title: "保养工具",
                            width: "10%"
                        }, {
                            data: "inspectionMode",
                            title: "检查方法",
                            width: "10%"
                        }, {
                            data: "risingTime",
                            title: "操作",
                            width: "10%",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "itemId",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            targets: 2,
                            data: "maintenance",
                            render: function(data, type, full) {

                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display") {
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                }else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 3,
                            data: "maintenanceStandard",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display") {
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                }else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 4,
                            data: "maintenanceTool",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 5,
                            data: "inspectionMode",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 6,
                            data: "",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            "targets": 7,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = '';
                                if(full.isEdit == 2) {
                                    str += '<div class="btn-group btn-group-sm">' +
                                        '<a id="save-button" class="btn btn-primary" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">确定</span></a>' +
                                        '<a id="cancel-button" class="btn btn-default" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                                } else {
                                    str += '<div class="btn-group btn-group-sm">';
                                    if ($scope.menuitems['A02_S10']) {
                                        str += '<a id="edit-button" class="btn btn-primary" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                    }
                                    if ($scope.menuitems['A03_S10']) {
                                        str += '<a id="delect-button" class="btn btn-default" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';
                                    }
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });



                /**
                 * 保存新增项次
                 */
                domMain.on('click', '#save-button', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var checkPass = true;

                    //项次
                    var itemids = $("#addDailyMaintenanceTable").find("tr").length-1;
                    if (itemids<10) {
                        itemids = "0" +itemids;
                    }else{
                        itemids = itemids;
                    }


                    $.each(tr.children(), function(j, val1) {
                        var jqob1 = $(val1);

                        //把input变为字符串
                        if(!jqob1.has('button').length && jqob1.has('input').length) {
                            var txt = $.trim(jqob1.children("input").val());
                            if(txt) {

                                if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5 || j == 6){

                                    var txt = jqob1.children("input").val();
                                    jqob1.html(txt);
                                    table.cell(jqob1).data(txt); //修改DataTables对象的数据
                                }

                                $(val1).removeClass('danger');
                            } else {
                                $(val1).addClass('danger');
                                checkPass = false;
                                return false;
                            }
                        }
                    });
                    if(checkPass) {

                        row.data().itemId = itemids;
                        $scope.doAction('saveCheckNumber', row.data(), function(returnObj) {

                            if(returnObj) {
                                row.data().isEdit = 0;
                                isEditing = false;
                                row.data().itemId = itemids;
                                row.cells().invalidate().draw(false);
                            }else{
                                row.data().isEdit = 2;
                            }
                        });
                    }

                });

                domMain.on('click', '#edit-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if(!isEditing) {
                        isEditing = true;
                        row.data().isEdit = 2;

                        row.cells().invalidate().draw(false);
                    } else {
                        if(row.data().isEdit == 0) {
                            growl.warning("当前有正编辑的点检项次", {});
                            return;
                        }
                    }
                    if(row.data().id == 0) {
                        growl.warning("当前有正编辑的点检项次", {});
                        return;
                    }


                });

                domMain.on('click', '#cancel-button', function(e) {

                    e.stopPropagation();
                    isEditing = false;
                    var row = table.row('.shown');
                    if(row.data()) {
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    } else {
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    }

                });

                domMain.on('click', '#delect-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);

                    $scope.doAction('deleteCheckNumber', row.data());
                    $scope.isEdit = 0;
                    row.remove().draw(false);
                });


                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {
                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;
                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();

                    }
                });

                domMain.on('change', '.itemCheckBox', function(e) {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    var tableRows = table.rows({
                        selected: true
                    });
                    if(e.target.checked) {
                        row.data().selected = true;
                        if(row.data().enabled) { //启用
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else {
                            $scope.abled = true;
                        }
                    } else {
                        row.data().selected = false;
                        var rows = table.rows();
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
                            $scope.abled = false;
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
                            $scope.abled = true;
                            $scope.unabled = false;
                        }
                    }
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {
                    var self = this;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().enabled = true;
                        param = [
                            [row.data().id], true
                        ];
                    } else {
                        row.data().enabled = false;
                        param = [
                            [row.data().id], false
                        ];
                    }
                    $scope.doAction("AlertEnable", param, function(returnObj) {
                        if(returnObj.code == 0) {
                            table.rows().invalidate().draw(false);
                            if(!e.target.checked) {
                                $(self).prop("checked", false);
                                growl.success("停用成功", {});
                            } else {
                                $(self).attr("checked", true);
                                growl.success("启用成功", {});
                            }
                            $(".itemCheckBox").each(function() {
                                $(this).attr("checked", false);
                            });
                            $("#allselect-btn").attr("checked", false);
                            table.rows().deselect();
                        } else if(!returnObj) {
                            if(!e.target.checked) {
                                row.data().enabled = true;
                                $(self).prop("checked", true);
                            } else {
                                row.data().enabled = false;
                                $(self).attr("checked", false);
                            }
                        }
                    }, true);
                });


            }]

        }

    }]);


  //======================================    新增保养大修项次    ===================================================
  directives.initDirective('addMaintenanceRepairTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_pairItem", function(event, args) {

                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [5, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "itemId",
                            title: "项次",
                            width: "5%"
                        }, {
                            data: "maintenancePeoject",
                            title: "保养项目",
                            width: "20%"
                        }, {
                            data: "maintenance",
                            title: "保养内容",
                            width: "35%"
                        }, {
                            data: "maintenanceTool",
                            title: "保养工具",
                            width: "10%"
                        }, {
                            data: "risingTime",
                            title: "操作",
                            width: "10%",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "itemId",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            targets: 2,
                            data: "maintenancePeoject",
                            render: function(data, type, full) {

                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display") {
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                }else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 3,
                            data: "maintenance",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display") {
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                }else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 4,
                            data: "maintenanceTool",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 5,
                            data: "",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        }, {
                            "targets": 6,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = '';
                                if(full.isEdit == 2) {
                                    str += '<div class="btn-group btn-group-sm">' +
                                        '<a id="save-button" class="btn btn-primary" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">确定</span></a>' +
                                        '<a id="cancel-button" class="btn btn-default" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                                } else {
                                    str += '<div class="btn-group btn-group-sm">';
                                    if ($scope.menuitems['A02_S10']) {
                                        str += '<a id="edit-button" class="btn btn-primary" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                    }
                                    if ($scope.menuitems['A03_S10']) {
                                        str += '<a id="delect-button" class="btn btn-default" ng-disabled="addmaintenancePlan.canEdit == false"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';
                                    }
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });



                /**
                 * 保存新增项次
                 */
                domMain.on('click', '#save-button', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var checkPass = true;

                    //项次
                    var itemids = $("#addMaintenanceRepairTable").find("tr").length-1;
                    if (itemids<10) {
                        itemids = "0" +itemids;
                    }else{
                        itemids = itemids;
                    }


                    $.each(tr.children(), function(j, val1) {
                        var jqob1 = $(val1);

                        //把input变为字符串
                        if(!jqob1.has('button').length && jqob1.has('input').length) {
                            var txt = $.trim(jqob1.children("input").val());
                            if(txt) {

                                if(j == 1 || j == 2 || j == 3 || j == 4 || j == 5 ){

                                    var txt = jqob1.children("input").val();
                                    jqob1.html(txt);
                                    table.cell(jqob1).data(txt); //修改DataTables对象的数据
                                }

                                $(val1).removeClass('danger');
                            } else {
                                $(val1).addClass('danger');
                                checkPass = false;
                                return false;
                            }
                        }
                    });
                    if(checkPass) {

                        row.data().itemId = itemids;
                        $scope.doAction('saveCheckNumber', row.data(), function(returnObj) {

                            if(returnObj) {
                                row.data().isEdit = 0;
                                isEditing = false;
                                row.data().itemId = itemids;
                                row.cells().invalidate().draw(false);
                            }else{
                                row.data().isEdit = 2;
                            }
                        });
                    }
                });

                domMain.on('click', '#edit-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if(!isEditing) {
                        isEditing = true;
                        row.data().isEdit = 2;

                        row.cells().invalidate().draw(false);
                    } else {
                        if(row.data().isEdit == 0) {
                            growl.warning("当前有正编辑的保养项次", {});
                            return;
                        }
                    }
                    if(row.data().id == 0) {
                        growl.warning("当前有正编辑的保养项次", {});
                        return;
                    }


                });

                domMain.on('click', '#cancel-button', function(e) {

                    e.stopPropagation();
                    isEditing = false;
                    var row = table.row('.shown');
                    if(row.data()) {
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    } else {
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    }

                });

                domMain.on('click', '#delect-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);

                    $scope.doAction('deleteCheckNumber', row.data());
                    $scope.isEdit = 0;
                    row.remove().draw(false);
                });


                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {
                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;
                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();

                    }
                });

                domMain.on('change', '.itemCheckBox', function(e) {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    var tableRows = table.rows({
                        selected: true
                    });
                    if(e.target.checked) {
                        row.data().selected = true;
                        if(row.data().enabled) { //启用
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else {
                            $scope.abled = true;
                        }
                    } else {
                        row.data().selected = false;
                        var rows = table.rows();
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
                            $scope.abled = false;
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
                            $scope.abled = true;
                            $scope.unabled = false;
                        }
                    }
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {
                    var self = this;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().enabled = true;
                        param = [
                            [row.data().id], true
                        ];
                    } else {
                        row.data().enabled = false;
                        param = [
                            [row.data().id], false
                        ];
                    }
                    $scope.doAction("AlertEnable", param, function(returnObj) {
                        if(returnObj.code == 0) {
                            table.rows().invalidate().draw(false);
                            if(!e.target.checked) {
                                $(self).prop("checked", false);
                                growl.success("停用成功", {});
                            } else {
                                $(self).attr("checked", true);
                                growl.success("启用成功", {});
                            }
                            $(".itemCheckBox").each(function() {
                                $(this).attr("checked", false);
                            });
                            $("#allselect-btn").attr("checked", false);
                            table.rows().deselect();
                        } else if(!returnObj) {
                            if(!e.target.checked) {
                                row.data().enabled = true;
                                $(self).prop("checked", true);
                            } else {
                                row.data().enabled = false;
                                $(self).attr("checked", false);
                            }
                        }
                    }, true);
                });



            }]

        }

    }]);

});



