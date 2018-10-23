define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function (directives, BootstrapDialog, datatables) {
    'use strict';
    directives.initDirective('notConfirmedTable', ['$timeout', '$compile', 'growl', function ($timeout, $compile, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            $scope.$on(Event.CMDBINFOSINIT + "not", function (event, args) {
              if (table) {
                table.destroy();
                domMain.empty();
              }
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.data,
                select: $.ProudSmart.datatable.singleSelect,
                order: [
                  [4, "desc"]
                ],
                columns: [{
                  data: "label",
                  title: "设备名称"
                }, {
                  data: "externalDevId",
                  title: "设备地址"
                }, {
                  data: "sn",
                  title: "设备序列号"
                }, $.ProudSmart.datatable.optionCol2, {
                  data: "createTime",
                  title: "",
                  visible: false
                }],
                rowCallback: function (nRow, aData, iDataIndex) {
                },
                columnDefs: [{
                  targets: 0,
                  data: "label",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    return escape(data);
                  }
                }, {
                  targets: 1,
                  data: "externalDevId",
                  render: function (data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 2,
                  data: "sn",
                  render: function (data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 3,
                  data: "option",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group btn-group-sm'>";
                    str += "<button id='play-btn' class='btn btn-primary' ><i class='fa fa-play hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 识别</span></button>";
                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    str += "</div>"
                    return str;
                  }
                }]
              });
              //单选模式下的监听变化
              table.on('select', function (e, dt, type, indexes) {
                if (type === 'row') {
                  var data = table.rows(indexes).data()[0];
                  $scope.doActionUn('select', data); // 具体的业务处理逻辑，调用外部controller内的方法
                }
              });
            });
            /**
             * 监听表格初始化后，添加按钮
             */
            domMain.on('init.dt', function () {

            });
            $scope.$on("table-search-handle", function (event, args) {
              if (args.name == $attrs.name)
                table.search(args.value).draw();
            });
            domMain.on('click', '#play-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.doActionUn('save', row.data());
            });

            domMain.on('click', '#del-btn', function (e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.doActionUn("delete", row.data(), function (flg) {
                if (flg)
                  row.remove().draw(false);
              });
            });
          }
        ]
      };
    }]);

    directives.initDirective('cmdb3Table', ['$timeout', '$compile', 'growl', function ($timeout, $compile, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;

            var isEditing = false;
            $scope.$on(Event.CMDBINFOSINIT + "GATEACTIVE", function (event, args) {
              if (table) {
                table.destroy();
                domMain.empty();
              }
              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                select: $.ProudSmart.datatable.select,
                data: args.data,
                order: [
                  [7, "desc"]
                ],
                columns: [$.ProudSmart.datatable.selectCol, {
                  data: "label",
                  title: "设备名称"
                }, {
                  data: "externalDevId",
                  title: "设备地址"
                }, {
                  data: "managedStatus",
                  title: "管理状态"
                }, {
                  data: "modelId",
                  title: "设备模板"
                }, {
                  data: "sn",
                  title: "设备序列号"
                }, $.ProudSmart.datatable.optionCol3, {
                  data: "createTime",
                  title: "",
                  visible: false
                }],
                rowCallback: function (nRow, aData, iDataIndex) {
                  if (aData.selected) {
                    $(nRow).addClass("selected")
                  } else {
                    $(nRow).removeClass("selected")
                  }
                  $compile(nRow)($scope);
                },
                columnDefs: [{
                  orderable: false,
                  targets: 0,
                  render: function (data, type, full) {
                    if (type == "display") {
                      if (data) {
                        return '<input class="itemCheckBox" checked type="checkbox">';
                      } else {
                        return '<input class="itemCheckBox" type="checkbox">';
                      }
                    }
                    return ""
                  }
                }, {
                  targets: 1,
                  data: "label",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit > 0 && type == "display") {
                      isEditing = true;
                      return "<input class='form-control input-sm'  type='text' value='" + (data ? escape(data) : '') + "'>";
                    } else {
                      return escape(data);
                    }

                  }
                }, {
                  targets: 2,
                  data: "externalDevId",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                      return "<input class='form-control input-sm'  type='text' value='" + data + "'>";
                    else
                      return escape(data);
                  }
                }, {
                  targets: 3,
                  data: "managedStatus",
                  render: function (data, type, full) {
                    return data == "deactive" ? '未启用' : '已启用';
                  }
                }, {
                  targets: 4,
                  data: "modelId",
                  render: function (data, type, full) {
                    var str = "";
                    if (data != null && data != "" && $scope.rootModelDic) {
                      var selectModel = $scope.rootModelDic[data];
                      if (selectModel)
                        str = selectModel.label;
                      else
                        str = "默认模板类型"
                    }
                    if (full.isEdit > 0 && type == "display") {
                      return "<div class='dropdowntree select-sm' placeholder='请选择...' model='" + data + "'  change='' options='rootModel' mark='nodes' />";
                    } else {
                      return str;
                    }
                  }
                }, {
                  targets: 5,
                  data: "sn",
                  render: function (data, type, full) {
                    if (full.isEdit == 2 && type == "display")
                      return "<input id='sn' name='sn' maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                    else
                      return escape(data);
                  }
                }, {
                  targets: 6,
                  data: "option",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group btn-group-sm'>";
                    if (full.isEdit > 0) {
                      str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                      str += "</div>";
                    } else {
                      if ($scope.menuitems['D10_S03']) {
                        str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 管理</span></button>";
                      }
                      if (full.managedStatus != 'deactive') {
                        if ($scope.menuitems['D07_S03']) {
                          str += "<button id='disable-btn' class='btn btn-default' ><i class='fa fa-stop hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 停用</span></button>";
                        }
                        if ($scope.menuitems['D08_S03']) {
                          str += "<button id='del-btn' class='btn btn-default' disabled><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 注销</span></button>";
                        }
                      } else {
                        if ($scope.menuitems['D06_S03']) {
                          str += "<button id='enable-btn' class='btn btn-default' ><i class='fa fa-play hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 启用</span></button>";
                        }
                        if ($scope.menuitems['D08_S03']) {
                          str += "<button id='del-btn' class='btn btn-default'><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 注销</span></button>";
                        }
                      }
                      str += "</div>";
                    }
                    return str;
                  }
                }]
              });
            });

            /**
             * 监听表格初始化后，添加按钮
             */
            domMain.on('init.dt', function () {
              var parentDom = $(".special-btn").parent();
              var extendBtn =
                '<div class="btn-group btn-group-sm">' +
                '<a ng-click="addIns()" class="btn btn-default"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加设备</span></a>' +
                '<a ng-click="activeSelectedIns()" class="btn btn-default"><i class="fa fa-play"></i><span class="hidden-xs"> 启用所选设备</span></a>' +
                '<a ng-click="activeAllIns()" class="btn btn-default"><i class="fa fa-forward"></i><span class="hidden-xs"> 启用全部设备</span></a>' +
                '</div>';
              parentDom.html(extendBtn);
              $compile(parentDom)($scope);
            });
            $scope.$on("table-search-handle", function (event, args) {
              if (args.name == $attrs.name)
                table.search(args.value).draw();
            });
            domMain.on('change', '#allselect-btn', function (e) {
              e.stopPropagation();
              if (e.target.checked) {
                table.rows().select();
                var tableRows = table.rows({
                  selected: true
                });
                for (var i = 0; i < tableRows.nodes().length; i++) {
                  var row = table.row(tableRows.nodes()[i]);
                  row.data().selected = true;
                }
                table.rows().invalidate().draw(false);
              } else {
                var tableRows = table.rows({
                  selected: true
                });
                for (var i = 0; i < tableRows.nodes().length; i++) {
                  var row = table.row(tableRows.nodes()[i]);
                  row.data().selected = false;
                }
                table.rows().deselect();
                table.rows().invalidate().draw(false);
              }
              $scope.selectedHandler("device");
            });
            domMain.on('change', '.itemCheckBox', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              if (e.target.checked) {
                row.data().selected = true;
              } else {
                row.data().selected = false;
              }
              var tableRows = table.rows({
                selected: true
              });
              if (tableRows.count() != table.rows()[0].length) {
                $('#allselect-btn').attr('checked', false)
                $('#allselect-btn').prop('checked', false);
              } else if (tableRows.count() == table.rows()[0].length) {
                $('#allselect-btn').attr('checked', true)
                $('#allselect-btn').prop('checked', true);
              }
              $scope.selectedHandler("device");
            });

            domMain.on('click', '#disable-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.doAction("deviceDeActive", row.data(), function (flg) {
                if (flg) {
                  row.data().managedStatus = "deactive";
                  row.cells().invalidate().draw(false);
                }
              });
            });

            domMain.on('click', '#enable-btn', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.doAction("deviceActive", row.data(), function (flg) {
                if (flg) {
                  row.data().managedStatus = "active";
                  row.cells().invalidate().draw(false);
                }
              });
            });

            domMain.on('click', '#save-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var modelSelect = $('div[name="modelId"]').attr("model");
              row.data()['modelId'] = modelSelect;
              var labelinput = $(tr).find('input[name="label"]');
              row.data()['label'] = $(labelinput).val();
              if (row.data().isEdit == 2 && row.data().id == 0) {
                var domainSelect = $('div[name="domainPath"]').attr("model");
                row.data()['domainPath'] = domainSelect;
                var externalDevIdinput = $(tr).find('input[name="externalDevId"]');
                var sn = $(tr).find('input[name="sn"]');
                row.data()['externalDevId'] = $(externalDevIdinput).val();
                row.data()['sn'] = $(sn).val();
                $scope.doAction('gateSave', row.data(), function (returnObj) {
                  if (returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().isEdit = 0;
                    row.data().id = returnObj.id;
                    row.data().managedStatus = "deactive";
                    row.data().onlineStatus = returnObj.onlineStatus;
                    row.cells().invalidate().draw(false);
                  }
                });
              } else {
                if (row.data().isEdit == 4) {
                  $scope.doAction('gateSave', row.data(), function (returnObj) {
                    if (returnObj == false) {
                      row.data().isEdit = 4;
                    } else {
                      row.data().isEdit = 0;
                      isEditing = false;
                      row.cells().invalidate().draw(false);
                    }
                  });
                }
              }
            });

            domMain.on('click', '#del-btn', function (e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              if (row.data().isEdit == 4) {
                row.data().isEdit = 0;
                row.cells().invalidate();
                isEditing = false;
              } else {
                $scope.doAction("deviceDel", row.data(), function (flg) {
                  if (flg) {
                    isEditing = false;
                    row.remove().draw(false);
                  }
                });
              }
            });

            domMain.on('click', '#edit-btn', function (e) {
              e.preventDefault();
              if (!isEditing) {
                var tr = $(this).closest('tr');
                var row = table.row(tr);
                $scope.doAction("deviceEdit", row.data());
              }
            });

            $scope.activeAllIns = function () {
              var tableRows = table.rows();
              var selectedCount = 0;
              var nodes = tableRows.nodes();
              for (var i = 0; i < nodes.length; i++) {
                var row = table.row(nodes[i]);
                var rowData = row.data();
                if (rowData.managedStatus == 'deactive') {
                  selectedCount++;
                }
              }
              if(selectedCount == 0) {
                growl.warning("当前没有未启用设备", {});
                return;
              }
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关启用全部设备吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function (dialogRef) {
                    var successCount = 0;
                    var errorCount = 0;
                    for (var i = 0; i < nodes.length; i++) {
                      var row = table.row(nodes[i]);
                      var rowData = row.data();
                      if (rowData.managedStatus == 'deactive') {
                        $scope.doActiveHanddler(rowData, function (status, node) {
                          if (status) {
                            table.row(node).data().managedStatus = "active";
                            table.row(node).cells().invalidate().draw(false);
                            successCount++;
                          } else {
                            errorCount++;
                          }
                          if (selectedCount == (successCount + errorCount)) {
                            table.rows().deselect();
                            growl.success("成功启用设备" + successCount + "台,失败" + errorCount + "台", {});
                          }
                        }, nodes[i])
                      }
                    }
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function (dialogRef) {
                    dialogRef.close();
                  }
                }]
              });
            };

            $scope.activeSelectedIns = function () {
              var tableRows = table.rows({
                selected: true
              });
              var selectedCount = tableRows.count();
              var nodes = tableRows.nodes();
              if (selectedCount == 0) {
                growl.warning("当前没有选中的设备", {});
                return;
              }
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关启用 ' + selectedCount + ' 台设备吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function (dialogRef) {
                    var successCount = 0;
                    var errorCount = 0;
                    for (var i = 0; i < nodes.length; i++) {
                      var row = table.row(nodes[i]);
                      var rowData = row.data();
                      $scope.doActiveHanddler(rowData, function (status, node) {
                        if (status) {
                          table.row(node).data().managedStatus = "active";
                          table.row(node).cells().invalidate().draw(false);
                          successCount++;
                        } else {
                          errorCount++;
                        }
                        if (selectedCount == (successCount + errorCount)) {
                          table.rows().deselect();
                          growl.success("成功启用设备" + successCount + "台,失败" + errorCount + "台", {});
                        }
                      }, nodes[i])
                    }
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function (dialogRef) {
                    dialogRef.close();
                  }
                }]
              });
            };
          }
        ]
      };
    }]);

    directives.initDirective('gatewayTable', ['$timeout', '$compile', 'growl', 'ngDialog', function ($timeout, $compile, growl, ngDialog) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            $scope.$on(Event.CMDBINFOSINIT + "GATES", function (event, args) {
              if (table) {
                table.destroy();
                domMain.empty();
              }
              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                select: $.ProudSmart.datatable.select,
                data: args.data,
                "pageLength": $scope.selLength,
                order: [
                  [8, "desc"]
                ],
                columns: [$.ProudSmart.datatable.selectCol, {
                  data: "name",
                  title: "网关名称"
                }, {
                  data: "externalGwId",
                  title: "网关标识"
                }, {
                  data: "managedStatus",
                  title: "管理状态"
                }, {
                  data: "onlineStatus",
                  title: "在线状态"
                }, {
                  data: "customerId",
                  title: (($scope.menuitems["S12"] && $scope.menuitems["S12"].label) ? $scope.menuitems["S12"].label : "客户") + "名称",
                  visible: $scope.baseConfig.customerConfig.display
                }, {
                  data: "projectId",
                  title: (($scope.menuitems["S13"] && $scope.menuitems["S13"].label) ? $scope.menuitems["S13"].label : "项目") + "名称",
                  visible: $scope.baseConfig.projectConfig.display
                },
                  $.ProudSmart.datatable.optionCol3, {
                    data: "createTime",
                    title: "",
                    visible: false
                  }
                ],
                columnDefs: [{
                  orderable: false,
                  targets: 0,
                  render: function (data, type, full) {
                    if (type == "display") {
                      if (data) {
                        return '<input class="itemCheckBox" checked type="checkbox">';
                      } else {
                        return '<input class="itemCheckBox" type="checkbox">';
                      }
                    }
                    return ""
                  }
                }, {
                  targets: 1,
                  data: "name",
                  render: function (data, type, full) {
                    if (full.isEdit > 0 && type == "display") {
                      isEditing = true;
                      return "<input class='form-control input-sm'  type='text' value='" + (data ? escape(data) : '') + "'>";
                    } else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 2,
                  data: "externalGwId",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                      return "<input class='form-control input-sm'  type='text' value='" + (data ? escape(data) : '') + "'>";
                    else
                      return escape(data);
                  }
                }, {
                  targets: 3,
                  data: "managedStatus",
                  render: function (data, type, full) {
                    return data == "deactive" ? '未启用' : '已启用';
                  }
                }, {
                  "targets": 4,
                  "data": "onlineStatus",
                  "render": function (data, type, full) {
                    if (full.simulated && full.managedStatus == "active")
                      return "<span class='label label-primary'>模拟中</span>";
                    // 返回自定义内容
                    return "<span class='label " + (data == "在线" ? "label-primary" : (data == "离线" ? "label-warning" : "label-default")) + "'>" + data + "</span>";
                  }
                }, {
                  targets: 5,
                  data: "customerId",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    if ($scope.customersDic && $scope.customersDic[data]) {
                      return $scope.customersDic[data].customerName;
                    }
                    return "";
                  }
                }, {
                  targets: 6,
                  data: "projectId",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    if ($scope.projectsDic && $scope.projectsDic[data]) {
                      return $scope.projectsDic[data].projectName;
                    }
                    return "";
                  }
                }, {
                  "targets": 7,
                  "data": "option",
                  "render": function (data, type, full) {
                    // 返回自定义内容
                    if (type != "display") return "";
                    var str = "<div class='btn-group btn-group-sm'>";
                    if (full.isEdit > 0) {
                      str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                      str += "</div>";
                    } else {
                      if ($scope.menuitems['A10_S03']) {
                        str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 管理</span></button>";
                      }
                      if (full.managedStatus == 'active') {
                        if ($scope.menuitems['A06_S03']) {
                          str += "<button id='disable-btn' class='btn btn-default' ><i class='fa fa-stop hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 停用</span></button>";
                        }
                        // if ($scope.menuitems['A07_S03']) {
                        //   str += "<button id='del-btn' class='btn btn-default' disabled><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 注销</span></button>";
                        // }
                      } else {
                        if ($scope.menuitems['A05_S03']) {
                          str += "<button id='enable-btn' class='btn btn-default' ><i class='fa fa-play hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 启用</span></button>";
                        }
                      }
                      if ($scope.menuitems['A11_S03'] || $scope.menuitems['A12_S03']) {
                        str += "<button type='button'  class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                      }
                      str += "<ul class='dropdown-menu' role='menu'>";

                      if ($scope.menuitems['A07_S03'] && full.managedStatus != 'active') {
                        // str += "<button id='del-btn' class='btn btn-default'><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 注销</span></button>";
                        str += "<li><a id='del-btn' role='button' > 注销</a></li>";
                      }
                      if ($scope.menuitems['A11_S03']) {
                        str += "<li><a id='collect-btn' role='button' > 采集日志</a></li>";
                      }
                      if ($scope.menuitems['A12_S03']) {
                        str += "<li><a id='look-btn' role='button' href='#/deviceLog/" + full.id + "'> 历史日志</a></li>";
                        str += "<li><a id='send-config-btn' role='button'> 下发配置</a></li>";
                        str += "<li><a id='add-manageName-btn' role='button'>更改归属</a></li>";

                      }


                      str += "</ul></div>";
                    }
                    return str;
                  }
                }],
                rowCallback: function (nRow, aData, iDataIndex) {
                  if (aData.selected) {
                    $(nRow).addClass("selected")
                  } else {
                    $(nRow).removeClass("selected")
                  }
                  $compile(nRow)($scope);
                }
              });
            });

            /**
             * 监听表格初始化后，添加按钮
             */
            domMain.on('init.dt', function () {

            });
            domMain.on('length.dt', function (e, settings, len) {
              $scope.selLength = len;
            });
            //多选模式下存在，控制全选按钮的状态
            domMain.on('change', '#allselect-btn', function (e) {
              e.stopPropagation();
              if (e.target.checked) {
                table.rows().select();
                var tableRows = table.rows({
                  selected: true
                });
                for (var i = 0; i < tableRows.nodes().length; i++) {
                  var row = table.row(tableRows.nodes()[i]);
                  row.data().selected = true;
                }
                table.rows().invalidate().draw(false);
              } else {
                var tableRows = table.rows({
                  selected: true
                });
                for (var i = 0; i < tableRows.nodes().length; i++) {
                  var row = table.row(tableRows.nodes()[i]);
                  row.data().selected = false;
                }
                table.rows().deselect();
                table.rows().invalidate().draw(false);
              }
              $scope.selectedHandler("gateway"); //具体的业务处理，各个功能不同
            });

            domMain.on('click', '#collect-btn', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.logDialog(row.data());
            });
            //添加管理域弹出框
            domMain.on('click', '#add-manageName-btn', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.rowData = row.data();
              $scope.originalData = row.data().domain?$scope.domainListDic[row.data().domain].name+"/":""+
                row.data().customerId?$scope.customersDic[row.data().customerId].customerName +"/":"" +
                row.data().projectId?$scope.projectsDic[row.data().projectId].projectName:"";
              ngDialog.open({
                template: '../partials/dialogue/add_ascription.html',
                scope: $scope,
                className: 'ngdialog-theme-plain'
              });
            });

            $scope.queryDitem = {
              domainPath: "",
              customerId: "",
              projectId: "",
            };

            $scope.modifyAscription = function () {
              $scope.rowData.domain = $scope.queryDitem.domainPath;
              $scope.rowData.customerId = $scope.queryDitem.customerId;
              $scope.rowData.projectId = $scope.queryDitem.projectId;
              $scope.modifyAscrip($scope.rowData,function (data) {
                if(data){
                  growl.success('更改网关归属成功');
                  ngDialog.close()
                }
              });

            }


            domMain.on('change', '.itemCheckBox', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              if (e.target.checked) {
                row.data().selected = true;
              } else {
                row.data().selected = false;
              }
              var tableRows = table.rows({
                selected: true
              });
              if (tableRows.count() != table.rows()[0].length) {
                $('#allselect-btn').attr('checked', false)
                $('#allselect-btn').prop('checked', false);
              } else if (tableRows.count() == table.rows()[0].length) {
                $('#allselect-btn').attr('checked', true)
                $('#allselect-btn').prop('checked', true);
              }
              $scope.selectedHandler("gateway"); //具体的业务处理，各个功能不同
            });

            domMain.on('click', '#disable-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.changeManagedStatus(row.data(), function (flg) {
                if (flg) {
                  row.data().managedStatus = "deactive";
                  row.cells().invalidate().draw(false);
                }
              });
            });

            domMain.on('click', '#send-config-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.sendGatewayConfig(row.data());
            });

            domMain.on('click', '#enable-btn', function(e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.changeManagedStatus(row.data(), function (flg) {
                if (flg) {
                  row.data().managedStatus = "active";
                  row.data().simulated = false;
                  row.cells().invalidate().draw(false);
                }
              });
            });

            domMain.on('click', '#save-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var modelSelect = $('div[name="modelId"]').attr("model");
              row.data()['modelId'] = modelSelect;
              var labelinput = $(tr).find('input[name="label"]');
              row.data()['label'] = $(labelinput).val();
              if (row.data().isEdit == 2 && row.data().id == 0) {
                var domainSelect = $('div[name="domainPath"]').attr("model");
                row.data()['domainPath'] = domainSelect;
                var externalDevIdinput = $(tr).find('input[name="externalDevId"]');
                var sn = $(tr).find('input[name="sn"]');
                row.data()['externalDevId'] = $(externalDevIdinput).val();
                row.data()['sn'] = $(sn).val();
                $scope.doAction('gateSave', row.data(), function (returnObj) {
                  if (returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().isEdit = 0;
                    row.data().id = returnObj.id;
                    row.data().managedStatus = "deactive";
                    row.data().onlineStatus = returnObj.onlineStatus;
                    row.data().simulated = false;
                    row.cells().invalidate().draw(false);
                  }
                });
              } else {
                if (row.data().isEdit == 4) {
                  $scope.doAction('gateSave', row.data(), function (returnObj) {
                    if (returnObj == false) {
                      row.data().isEdit = 4;
                    } else {
                      row.data().isEdit = 0;
                      isEditing = false;
                      row.cells().invalidate().draw(false);
                    }
                  });
                }
              }
            });

            domMain.on('click', '#del-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              if (row.data().isEdit == 4) {
                row.data().isEdit = 0;
                row.cells().invalidate();
                isEditing = false;
              } else {
                $scope.delGateWay(row.data(), function (flg) {
                  if (flg) {
                    isEditing = false;
                    row.remove().draw(false);
                  }
                });
              }
            });
            domMain.on('click', '#edit-btn', function (e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.gatewayHandler('update', row.data().id)
            });
            $scope.activeAllIns = function () {
              var tableRows = table.rows();
              var selectedCount = 0;
              var nodes = tableRows.nodes();
              for (var i = 0; i < nodes.length; i++) {
                var row = table.row(nodes[i]);
                var rowData = row.data();
                if (rowData.managedStatus == 'deactive') {
                  selectedCount++;
                }
              }
              if(selectedCount == 0) {
                growl.warning("当前没有未启用设备", {});
                return;
              }
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关启用全部设备吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function (dialogRef) {
                    var successCount = 0;
                    var errorCount = 0;
                    for (var i = 0; i < nodes.length; i++) {
                      var row = table.row(nodes[i]);
                      var rowData = row.data();
                      if (rowData.managedStatus == 'deactive') {
                        $scope.doActiveHanddler(rowData, function (status, node) {
                          if (status) {
                            table.row(node).data().managedStatus = "active";
                            table.row(node).cells().invalidate().draw(false);
                            successCount++;
                          } else {
                            errorCount++;
                          }
                          if (selectedCount == (successCount + errorCount)) {
                            table.rows().deselect();
                            growl.success("成功启用设备" + successCount + "台,失败" + errorCount + "台", {});
                          }
                        }, nodes[i])
                      }
                    }
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function (dialogRef) {
                    dialogRef.close();
                  }
                }]
              });
            };

            $scope.activeSelectedIns = function () {
              var tableRows = table.rows({
                selected: true
              });
              var selectedCount = tableRows.count();
              var nodes = tableRows.nodes();
              if (selectedCount == 0) {
                growl.warning("当前没有选中的设备", {});
                return;
              }
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '确认从 ' + escape($scope.selectedGateitem.name) + ' 网关启用 ' + selectedCount + ' 台设备吗？',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function (dialogRef) {
                    var successCount = 0;
                    var errorCount = 0;
                    for (var i = 0; i < nodes.length; i++) {
                      var row = table.row(nodes[i]);
                      var rowData = row.data();
                      $scope.doActiveHanddler(rowData, function (status, node) {
                        if (status) {
                          table.row(node).data().managedStatus = "active";
                          table.row(node).cells().invalidate().draw(false);
                          successCount++;
                        } else {
                          errorCount++;
                        }
                        if (selectedCount == (successCount + errorCount)) {
                          table.rows().deselect();
                          growl.success("成功启用设备" + successCount + "台,失败" + errorCount + "台", {});
                        }
                      }, nodes[i])
                    }
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function (dialogRef) {
                    dialogRef.close();
                  }
                }]
              });
            };
          }
        ]
      };
    }]);
  }
)