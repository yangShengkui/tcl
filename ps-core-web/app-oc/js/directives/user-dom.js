define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'], function (directives, BootstrapDialog, datatables) {
  'use strict';
  directives.initDirective('userTable', ['$timeout', '$compile', 'growl', function ($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT, function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              select: $.ProudSmart.datatable.select,
              order: [
                [7, "desc"]
              ],
              data: args.data,
              columns: [$.ProudSmart.datatable.selectCol, {
                title: "用户类型",
                data: "userTypeLabel"
              }, {
                title: "用户名称",
                data: "userName"
              }, {
                title: "登录账户（手机/邮箱）",
                data: "userEmail"
              }, {
                title: "办公电话",
                data: "officePhone"
              }, {
                title: "默认域",
                data: "domainPath"
              }, $.ProudSmart.datatable.optionCol3, {
                data: "createDate",
                title: "",
                visible: false
              }],
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
                "targets": 2,
                "data": "userName",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0 && type == "display") {
                    isEditing = true;
                    return "<input class='form-control col-xs-6' maxlength='20' placeholder='不能为空、空格，最多20个字符'  type='text'   style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  }else {
                    return escape(data);
                  }
                }
              }, {
                "targets": 3,
                "data": "userEmail",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit == 3 && type == "display")
                    return "<input class='form-control col-xs-6'  placeholder='输入手机号码、邮箱'  type='text'   style='width: 100%;border: 1px solid #F18282;' value='" + data + "'>";
                  else
                    return data;
                }
              }, {
                "targets": 4,
                "data": "officePhone",
                "render": function (data, type, full) {
                  var off = "";
                  if (data == null) {
                    off = "";
                  } else {
                    off = data;
                  }
                  if (full.isEdit > 0 && type == "display") {
                    if (data != "") {
                      return "<input class='form-control col-xs-6' placeholder='例如：010-68888888' style='width: 100%;' type='text'  value='" + off + "'>";
                    } else {
                      return "<input class='form-control col-xs-6' placeholder='例如：010-68888888' type='text'   style='width: 100%;'>";
                    }
                  } else {
                    return off;
                  }
                }
              }, {
                "targets": 5,
                "data": "domainPath",
                "render": function (data, type, full) {
                  if (full.isEdit > 0 && type == "display") {
                    return "<div class='dropdowntree select-sm' name='domainPath' key='domainPath' placeholder='请选择...' model='" + data + "' change='' options='domainListTree' mark='nodes' />";
                    ;
                  } else {
                    if ($scope.domainListDic[data] != undefined && $scope.domainListDic[data]) {
                      return $scope.domainListDic[data].name;
                    } else {
                      return "";
                    }
                  }
                }
              }, {
                "targets": 6,
                "data": "option",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if (full.isEdit == 2 || full.isEdit == 3) {
                    str += "<a id='save-btn' class='btn btn-default btn-sm'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                    str += "</div>";
                  } else {
                    if (full.userID == $scope.userManager.userID) {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                      str += "<button id='del-btn' class='btn btn-default' disabled  title='不能删除自己的账号'><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                      str += "<button type='button' disabled  title='不能操作自己的账号' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                      str += "<ul class='dropdown-menu' role='menu'>";
                      str += "</ul></div>";
                    } else {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                      str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                      str += "<ul class='dropdown-menu' role='menu'>";
                      str += "<li><a role='button' id='pwd-btn'>重置密码</a></li>";
                      str += "<li><a role='button' id='role-user'>角色分配</a></li>";
                      str += "<li><a role='button' id='domain-user'>域分配</a></li>";
                      str += "<li><a role='button' id='remark-edit'>备注</a></li>";
                      str += "</ul></div>";
                    }
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
          /* Formatting function for row details - modify as you need */
          function format(d) {
            if (d != undefined) {
              // `d` is the original data object for the row
              var returnStr;
              returnStr = '<table width="100%" class="table">' +
                '<tr>' +
                '<td>备注:</td>' +
                '<td><textarea  id="discription" class="col-sm-6" style="height:100px;resize: none;" name="discription" maxlength="100"  type="text" >' + d.discription + '</textarea></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="4"><div class="input-group">' +
                '<a id="remark-btn" class="btn btn-default btn-sm" style="margin-right: 15px;"><i class="fa fa-check"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                '<a id="remark-cancel" class="btn btn-default btn-sm"><i class="fa fa-close"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>' +
                '</tr>' +
                '</table>';
              return returnStr;
            }
          }

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
              ;
              table.rows().invalidate().draw(false);
            } else {
              var tableRows = table.rows({
                selected: true
              });
              for (var i = 0; i < tableRows.nodes().length; i++) {
                var row = table.row(tableRows.nodes()[i]);
                row.data().selected = false;
              }
              ;
              table.rows().deselect();
              table.rows().invalidate().draw(false);
            }
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
              $('#allselect-btn').attr('checked',false)
              $('#allselect-btn').prop('checked',false);
            } else if (tableRows.count() == table.rows()[0].length) {
              $('#allselect-btn').attr('checked',true)
              $('#allselect-btn').prop('checked',true);
            }
          });
          domMain.on('click', '#domain-user', function (e) {
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            //tr.addClass("selected");
            // location.href = '#/roleAllot/' + row.data().userID + '';
            $scope.dialog(row.data().userID );
          });
          domMain.on('click', '#remark-edit', function (e) {
            $scope.functionRoleName = "0";
            $scope.$apply();
            var tr = $(this).closest('tr');
            //tr.addClass('shown');
            var row = table.row(tr);
            row.child(format(row.data())).show();
          });
          domMain.on('click', '#role-user', function (e) {
            isEditing = false;
            $scope.functionRoleName = "0";
            $scope.$apply();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('roleUserRole', row.data());
          });
          domMain.on('click', '#remark-cancel', function (e) {
            var selectRow = table.row('.shown');
            if (selectRow) {
              selectRow.child.hide();
              selectRow.cells().invalidate();
            }
          });
          domMain.on('click', '#remark-btn', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var selectRow = table.row('.shown');
            selectRow.data()["discription"] = $("#discription").val();
            $scope.doAction('save', selectRow.data(), function (returnObj) {
              if (returnObj) {
                selectRow.child.hide();
                selectRow.cells().invalidate();
              }
            });
          });
          domMain.on('click', '#save-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            var selectRow = table.row('.shown');
            var domainSelect = $('div[name="domainPath"]').attr("model");
            // var domain = $('div[name="domainPath"]').attr("model");
            if (row.data().isEdit == 3) {
              $.each(tr.children(), function (j, val1) {
                var jqob1 = $(val1);
                //把input变为字符串
                if (!jqob1.has('button').length && jqob1.has('input').length) {
                  var txt = $.trim(jqob1.children("input").val());
                  if (txt && txt != "请选择...") {
                    if (j == 3) {
                      var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                      var reg1 = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                      if (!reg.test(txt)) {
                        if (!reg1.test(txt)) {
                          $(val1).addClass('danger');
                          checkPass = false
                          return false;
                        } else {
                          row.data()["userEmalStatus"] = "phone";
                        }
                      } else {
                        row.data()["userEmalStatus"] = "email";
                      }
                    }
                    if (j == 4) {
                      var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
                      if (!reg.test(txt)) {
                        $(val1).addClass('danger');
                        checkPass = false
                        return false;
                      }
                    }
                    $(val1).removeClass('danger');
                    table.cell(jqob1).data(txt); //修改DataTables对象的数据
                  } else {
                    if (j == 2 || j == 3) {
                      table.cell(jqob1).data(txt)
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                    if (j == 5) {
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                    if (j == 4) {
                      table.cell(jqob1).data("");
                    }
                  }
                }
              });
            } else if (row.data().isEdit == 2) {
              $.each(tr.children(), function (j, val1) {
                var jqob1 = $(val1);
                //把input变为字符串
                if (!jqob1.has('button').length && jqob1.has('input').length) {
                  var txt = $.trim(jqob1.children("input").val());
                  if (txt && txt != "请选择...") {
                    if (j == 3) {
                      var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
                      if (!reg.test(txt)) {
                        $(val1).addClass('danger');
                        checkPass = false
                        return false;
                      }
                    }
                    $(val1).removeClass('danger');
                    table.cell(jqob1).data(txt); //修改DataTables对象的数据
                  } else {
                    if (j == 1) {
                      table.cell(jqob1).data(txt)
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                  }
                }
              });
            }
            if (checkPass) {
              if (domainSelect == null || domainSelect == "" || domainSelect == undefined) {
                growl.warning("请选择域", {});
                return;
              }
              isEditing = false;
              var rowDate = row.data();
              if (rowDate.userType != 3) {
                row.data()["domainPath"] = domainSelect;
                row.data()["domainID"] = $scope.domainListDic[domainSelect].domainID;
              }
              $scope.doAction('save', row.data(), function (returnObj) {
                  if (returnObj) {
                    if (row.data().isEdit == 3) {
                      row.data().userID = returnObj.userID;
                    }
                    row.data().isEdit = 0;
                    row.data().selected = false;
                    row.cells().invalidate().draw(false);
                  }
                }
              );
            }
          });
          domMain.on('click', '#cancel-btn', function (e) {
            e.stopPropagation();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.data().userID) {
              row.data().isEdit = 0;
              row.cells().invalidate();
              isEditing = false;
            } else {
              isEditing = false;
              row.remove().draw(false);
            }
            // $scope.doAction('cancel');
          });
          domMain.on('click', '#edit-btn', function (e) {
            e.preventDefault();
            $scope.functionRoleName = "0";
            $scope.$apply();
            if (!isEditing) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 2;
              row.cells().invalidate();
              $compile(tr)($scope);
              isEditing = true;
            } else {
              growl.warning("当前有在编辑的用户，请先完成该操作", {});
            }
          });
          domMain.on('click', '#del-btn', function (e) {
            e.preventDefault();
            isEditing = false;
            $scope.functionRoleName = "0";
            $scope.$apply();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('delete', row.data(), function (returnObj) {
              if (returnObj) {
                row.remove().draw(false);
              }
            });
          });
          domMain.on('click', '#group-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('assignGroup', row.data());
          });
          domMain.on('click', '#pwd-btn', function (e) {
            e.preventDefault();
            $scope.functionRoleName = "0";
            $scope.$apply();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('resetPwd', row.data());
          });
          /**
           * 复选框删除
           */
          $scope.activeSelectedDel = function() {
            var tableRows = table.rows({
              selected: true
            });
            var selectedCount = tableRows.count();
            var nodes = tableRows.nodes();
            if(selectedCount == 0) {
              growl.warning("当前没有选中的用户", {});
              return;
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认删除您所选择的 ' + selectedCount + ' 条记录吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  var successCount = 0;
                  var errorCount = 0;
                  for(var i = 0; i < nodes.length; i++) {
                    var row = table.row(nodes[i]);
                    var rowData = row.data();
                    if ($scope.userManager.userID != rowData.userID) {
                      $scope.doActiveHanddler(rowData, function(status, node) {
                        if(status) {
                          table.row(node).remove().draw(false);
                          successCount++;
                        } else {
                          errorCount++;
                        }

                        if(selectedCount == (successCount + errorCount)) {
                          table.rows().deselect();
                          growl.success("成功删除用户" + successCount + "个,失败" + errorCount + "个", {});
                        }
                      }, nodes[i])
                    }else{
                      selectedCount = selectedCount - 1;
                    }
                  };

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
          /**
           * 复选框重置密码
           */
          $scope.activeSelectedDel = function() {
            var tableRows = table.rows({
              selected: true
            });
            var selectedCount = tableRows.count();
            var nodes = tableRows.nodes();
            if(selectedCount == 0) {
              growl.warning("当前没有选中的用户", {});
              return;
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认重置您所选择的 ' + selectedCount + ' 条记录吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  var successCount = 0;
                  var errorCount = 0;
                  for(var i = 0; i < nodes.length; i++) {
                    var row = table.row(nodes[i]);
                    var rowData = row.data();
                    if ($scope.userManager.userID != rowData.userID) {
                      $scope.doActivePwd(rowData, function(status, node) {
                        if(status) {
                          table.row(node).cells().invalidate().draw(false);
                          successCount++;
                        } else {
                          errorCount++;
                        }

                        if(selectedCount == (successCount + errorCount)) {
                          $(".itemCheckBox").each(function(){
                            $(this).attr("checked",false);
                          });
                          table.rows().deselect();
                          growl.success("成功重置用户密码" + successCount + "个,失败" + errorCount + "个", {});
                        }
                      }, nodes[i])
                    }else{
                      selectedCount = selectedCount - 1;
                      $(".itemCheckBox").each(function(){
                        $(this).attr("checked",false);
                      });
                      table.rows().deselect();
                    }
                  };

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
      ]
    };
  }]);
  directives.initDirective('contractTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_contract", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              rowCallback: function (nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columns: args.columns,
              columnDefs: args.columnDefs
            });
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a  class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建合同</span></a>');
            $compile(parentDom)($scope);
          });
        }
      ]
    };
  }]);
  directives.initDirective('maintainTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_maintain", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              rowCallback: function (nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columns: args.columns,
              columnDefs: args.columnDefs
            });
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a  class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建计划</span></a>');
            $compile(parentDom)($scope);
          });
        }
      ]
    };
  }]);
  directives.initDirective('loreTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_lore", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              rowCallback: function (nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columns: args.columns,
              columnDefs: args.columnDefs
            });
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a  class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建知识</span></a>');
            $compile(parentDom)($scope);
          });
        }
      ]
    };
  }]);
  directives.initDirective('superTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_super", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              columns: args.columns,
              columnDefs: args.columnDefs,
              data: args.data
            });
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          domMain.on('click', 'td', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var name = $(this).text();
            var row = table.row(tr);
            var rowData = row.data();
            if (name == " 切换登录") {
              $scope.loginin(rowData.userEmail);
            }
          });
        }
      ]
    };
  }]);
  directives.initDirective('currentTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.CURRENTINFOSINIT, function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              select: $.ProudSmart.datatable.select,
              order: [
                [4, "desc"]
              ],
              columns: [$.ProudSmart.datatable.selectCol,{
                title: "角色名称",
                data: "roleName"
              }, {
                title: "角色描述",
                data: "description"
              }, $.ProudSmart.datatable.optionCol3, {
                // data: "createDate",
                data: "roleID",
                title: "",
                visible: false
              }],
              columnDefs: [{
                orderable: false,
                targets: 0,
                render: function(data, type, full) {
                  if(type == "display") {
                    if(data) {
                      return '<input class="itemCheckBox" checked type="checkbox">';
                    } else {
                      return '<input class="itemCheckBox" type="checkbox">';
                    }
                  }
                  return ""
                }
              }, {
                "targets": 1,
                "data": "roleName",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0  && type == "display"){
                    return "<input class='form-control col-xs-6'   type='text'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  }else{
                    var name = data;
                    if($scope.userManager.userID == 1){
                      if(full.roleID == 100 ){
                        name ="A"+data;
                      }else if(full.roleID == 102){
                        name ="A"+data;
                      }else if(full.roleID == 101){
                        name ="B"+data;
                      }else if(full.roleID == 103){
                        name ="B"+data;
                      }
                    }
                    return escape(name);
                  }

                }
              }, {
                "targets": 2,
                "data": "description",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0  && type == "display")
                    return "<input class='form-control col-xs-6'  maxlength='100'  type='text'   style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 3,
                "data": "option",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit > 0) {
                    str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                    str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                    str += "</div>";
                  } else if (full.roleID == 100 || full.roleID == 102 || full.roleID == 1000 || full.roleID == 101 || full.roleID == 103|| full.roleID == 2000 || full.roleID == 2001) {
                    var functionLook = "查看功能";
                    if($scope.userManager.userID == 1){
                      functionLook = "功能分配";
                    }
                    str += "<button id='edit-btn' class='btn btn-primary' disabled><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' class='btn btn-default' disabled><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a role='button' id='user-allot'>用户分配</a></li>";
                    str += "<li><a role='button' id='fun-btn'>"+functionLook+"</a></li>";
                    str += "</ul></div>";
                  }else {
                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a role='button' id='fun-btn'>功能分配</a></li>";
                    str += "<li><a role='button' id='user-allot'>用户分配</a></li>";
                    str += "</ul></div>";
                  }
                  return str;
                }
              }],
              data: args.data,
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
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addUser()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建角色</span></a>');
            $compile(parentDom)($scope);
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
              ;
              table.rows().invalidate().draw(false);
            } else {
              var tableRows = table.rows({
                selected: true
              });
              for (var i = 0; i < tableRows.nodes().length; i++) {
                var row = table.row(tableRows.nodes()[i]);
                row.data().selected = false;
              }
              ;
              table.rows().deselect();
              table.rows().invalidate().draw(false);
            }
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
              $('#allselect-btn').attr('checked',false)
              $('#allselect-btn').prop('checked',false);
            } else if (tableRows.count() == table.rows()[0].length) {
              $('#allselect-btn').attr('checked',true)
              $('#allselect-btn').prop('checked',true);
            }
          });
          domMain.on('click', '#edit-save', function (e) {
            var tr = $(this).closest('tr');
            var selectRow = [];
            var ipts = tr.find('input');
            var checkPass = true;
            $.each($('.shown').children(), function (j, val1) {
              var jqob1 = $(val1);
              var txt = $.trim(jqob1.children("input").val());
              if (txt == "") {
                $(val1).addClass('danger');
                checkPass = false;
                return false;
              }
              $(val1).removeClass('danger');
            });
            $.each(ipts, function (i, val) {
              var txt = $.trim($(val).val());
              if (i == 0) {
                selectRow["roleName"] = txt;
              } else if (i == 1) {
                selectRow["description"] = txt;
              } else if (i == 2) {
                selectRow["roleID"] = txt;
              }
            });
            if (checkPass) {
              $scope.doAction('modifyRole', selectRow, function (returnObj) {
                if (returnObj) {
                  if (row.data().isEdit == 3) {
                    row.data().roleID = returnObj.roleID;
                  }
                  row.data().isEdit = 0;
                  row.cells().invalidate().draw(false);
                }
              });
            }
          });
          /*domMain.on('click', 'td', function (e) {
           e.preventDefault();
           var tr = $(this).closest('tr');
           tr.addClass('shown');
           });*/
          domMain.on('click', '#save-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            var selectRow = table.row('.shown');
            $.each(tr.children(), function (j, val1) {
              var jqob1 = $(val1);
              //把input变为字符串
              if (!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());
                if (txt && txt != "请选择...") {
                  //var reg = /^[\u4e00-\u9fa5a-zA-Z][u4e00-\u9fa5a-za-zA-Z0-9_]{1,30}$/;
                  //if (!reg.test(txt)) {
                  //    $(val1).addClass('danger');
                  //    checkPass = false
                  //    return false;
                  //}
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt);
                } else {
                  if (j == 0 || j == 1) {
                    table.cell(jqob1).data(txt)
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }
                }
              }
            });
            if (checkPass) {
              isEditing = false;
              $scope.doAction('addRole', row.data(), function (returnObj) {
                if (returnObj) {
                  if (row.data().isEdit == 3) {
                    row.data().roleID = returnObj.roleID;
                  }
                  row.data().isEdit = 0;
                  row.cells().invalidate().draw(false);
                }
              });
            }
          });
          domMain.on('click', '#cancel-btn', function (e) {
            //$(this).closest('tr').empty();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            isEditing = false;
            if (row.data().roleID) {
              row.cells().invalidate().draw(false);
            } else {
              row.remove().draw(false);
            }
            // $scope.doAction('cancel');
          });
          domMain.on('click', '#user-allot', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.dialogUser(row.data());
            // $scope.doAction('allotUserRole', row.data());
          });
          domMain.on('click', '#fun-btn', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            // $scope.doAction('funRole', row.data());
            $scope.dialogFun(row.data());
          });
          domMain.on('click', '#cancel-up', function (e) {
            isEditing = false;
            $scope.doAction('cancel');
          });
          domMain.on('click', '#del-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('deleteRole', row.data(), function (returnObj) {
              if (returnObj) {
                // row.cells().invalidate().draw(false);
                row.remove().draw(false);
              }
            });
          });
          domMain.on('click', '#edit-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 2;
            row.cells().invalidate();
          });
        }
      ]
    };
  }]);
  directives.initDirective('functionTable', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.FUNCTIONINFOSINIT, function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              columnDefs: args.columnDefs,
              scrollX: true
            });
          });
        }
      ]
    };
  }]);
  directives.initDirective('userRoleTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.CURRENTINFOSINIT + "_userRole", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              "scrollY": "300px",
              "scrollCollapse": true,
              "paging": false,
              "searching": false,
              "info": false,
              // language: $.ProudSmart.datatable.language,
              select: $.ProudSmart.datatable.select,
              order: [
                [3, "desc"]
              ],
              columns: [$.ProudSmart.datatable.selectCol,{
                title: "用户名称",
                data: "userName"
              }, {
                title: "登录账户（手机/邮箱）",
                data: "emailAddress"
              },{
                data: "createDate",
                title: "",
                visible: false
              }],
              columnDefs: [{
                orderable: false,
                targets: 0,
                render: function(data, type, full) {
                  if(type == "display") {
                    if(data) {
                      return '<input class="itemCheckBox" checked type="checkbox">';
                    } else {
                      return '<input class="itemCheckBox" type="checkbox">';
                    }
                  }
                  return ""
                }
              }],
              data: args.data,
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
        }
      ]
    };
  }]);
  directives.initDirective('roleUserTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.CURRENTINFOSINIT + "_roleUser", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: [{
                title: "选择",
                orderable: false,
                data: "option"
              }, {
                title: "角色名称",
                data: "roleName"
              }, {
                title: "角色描述",
                data: "description"
              }],
              columnDefs: [{
                targets: 0,
                data: "option",
                render: function (data, type, full) {
                  var str = '<input type="checkbox" style="width: 19px;height: 25px;" boxClass="icheckbox_minimal-blue" value="' + full.roleID + '"  name="oddBox" class="minimal" > ';
                  if (full.domainID == 1003) {
                    str = '<input type="checkbox" style="width: 19px;height: 25px;" boxClass="icheckbox_minimal-blue" value="' + full.roleID + '"  name="oddBox" class="minimal" checked=checked> ';
                  }
                  return str;
                }
              }, {
                targets: 1,
                data: "roleName",
                render: function (data, type, full) {
                  return escape(data);
                }
              }, {
                targets: 2,
                data: "description",
                render: function (data, type, full) {
                  return escape(data);
                }
              }]
            });
          });
          domMain.on('click', "td", function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if (rowData.domainID != 1003) {
              rowData.domainID = 1003;
            } else {
              rowData.domainID = 0;
            }
            row.cells().invalidate();
          })
        }
      ]
    };
  }]);
  directives.initDirective('enterpriseTable', ['$timeout', '$compile', 'growl', function ($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_enter", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              rowCallback: function (nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columnDefs: args.columnDefs
            });
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addEnterprise()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建企业</span></a>');
            $compile(parentDom)($scope);
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          function format(d) {
            if (d != undefined) {
              // `d` is the original data object for the row
              var returnStr = '<table width="100%" class="table">';
              returnStr += '<tr>';
              returnStr += '<td>上传logo:</td>';
              returnStr += '<td><input type="file" id="uploadImg" name="uploadImg" /></td>';
              returnStr += '</tr>';
              returnStr += '<tr>';
              returnStr += '<td>图片展示:</td>';
              returnStr += '<td><img id="imgLook" name="imgLook" width="200" height="50"  /><span style="color: red;">推荐尺寸200 x 50</span></td>';
              returnStr += '</tr>';
              returnStr += '<tr>';
              returnStr += '<td colspan="4"><div class="input-group">';
              returnStr += '<a id="logo-btn" class="btn btn-default btn-sm" style="margin-right: 15px;"><i class="fa fa-check hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>';
              returnStr += '<a id="cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>';
              returnStr += '</tr>';
              returnStr += '</table>';
              return returnStr;
            }
          }

          function formatEdit(d) {
            if (d != undefined) {
              // `d` is the original data object for the row
              var returnStr = '<table width="100%" class="table">';
              returnStr += '<tr>';
              returnStr += '<td><label class="control-label">企业版权名称:</label></td>';
              returnStr += '<td><input class="form-control col-xs-6 input-sm"  type="text" value="' + d.copyRight + '" id="enterpriseName" name="enterpriseName" /></td>';
              returnStr += '<td><label class="control-label">企业链接:</label></td>';
              returnStr += '<td><input class="form-control col-xs-6 input-sm"  type="text" value="' + d.websiteUrl + '" id="enterpriseUrl" name="enterpriseUrl" /></td>';
              returnStr += '<td style="text-align: center;"><div class="input-group">';
              returnStr += '<a id="update-btn" class="btn btn-default btn-sm" style="margin-right: 15px;"><i class="fa fa-check hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>';
              returnStr += '<a id="cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>';
              returnStr += '</tr>';
              returnStr += '</table>';
              return returnStr;
            }
          }
          function editEnterprise(d) {
            if (d != undefined) {
              var returnStr = '<table width="100%" class="table">';
              returnStr += '<tr>';
              returnStr += '<td><label class="control-label">企业名称:</label></td>';
              returnStr += '<td><input class="form-control col-xs-6 input-sm"  type="text"  ng-model="enterpriseObj.name" id="name" name="name" /></td>';
              returnStr += '<td><label class="control-label">试用结束时间:</label></td>';
              returnStr += '<td> <input type="text" class="form-control input-sm"  readonly="readonly" autocomplete="off" drops="down" ng-model="enterpriseObj.closingDate"  date-time-picker ></td>';
              returnStr += '<td style="text-align: center;"><div class="input-group">';
              returnStr += '<a id="edit-save-btn" class="btn btn-default btn-sm" style="margin-right: 15px;"><i class="fa fa-check hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>';
              returnStr += '<a id="cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>';
              returnStr += '</tr>';
              returnStr += '</table>';
              return returnStr;
            }
          }

          domMain.on('click', 'td', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var name = $(this).text();
            var row = table.row(tr);
            var rowData = row.data();
            if (name == " 切换登录") {
              $scope.loginin(rowData.userEmail);
            }
          });
          domMain.on('click', '#file-txt', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var test = row.data();
            $scope.enterId = test.enterpriseID;
            row.child(format(row.data())).show();
          });
          domMain.on('click', '#copy-right-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var test = row.data();
            $scope.enterId = test.enterpriseID;
            row.child(formatEdit(row.data())).show();
          });
          domMain.on('click', '#edit-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var test = row.data();
            if(test.closingDate){
              test.closingDate = new Date(test.closingDate).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            }
            $scope.enterpriseObj = jQuery.extend(true, {}, test);
            row.child(editEnterprise(row.data())).show();
            $compile(tr.next())($scope);
            // location.href = "#/addEnterprise/"+test.enterpriseID+"";
          });
          domMain.on('click', '#uploadImg', function (e) {
            e.preventDefault();
            $("#fileUp").trigger('click');
          });
          domMain.on('click', '#cancel-btn', function (e) {
            e.preventDefault();
            $scope.cancel();
          });
          domMain.on('click', '#block', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.blockClick(row.data());
          });
          domMain.on('click', '#logo-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var test = $scope.uploader.queue;
            for (var i in test) {
              test[i].upload()
            }
            //$scope.enterId = row.date().enterpriseID;
            // console.log("test=="+test);
          });
          domMain.on('click', '#update-btn', function (e) {
            e.preventDefault();
            var enterpriseName = $("#enterpriseName").val();
            var enterpriseUrl = $("#enterpriseUrl").val();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var enterId = $scope.enterId;
            $scope.editEnterprise(enterpriseName, enterpriseUrl, enterId);
          });
          domMain.on('click', '#edit-save-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var errorStatus = false;
            var newData = new Date($scope.enterpriseObj.closingDate).Format("yyyy-MM-dd");
            var ckTime = checkDate(newData);
            if($scope.enterpriseObj.closingDate && ckTime == false){
              growl.warning("您选择的试用结束时间小于当前时间",{})
              errorStatus = false;
            }else {
              errorStatus = true;
            }
            if($scope.enterpriseObj && errorStatus){
              $scope.modifyEnterpriseInfo($scope.enterpriseObj);
            }
          });
          domMain.on('click', '#role-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.roleEdit(row.data());
          });
          domMain.on('click', '#del-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.clearUserData(row.data());
          });
        }
      ]
    };
  }]);
  directives.initDirective('clientTable', ['$timeout', 'growl', '$compile', function($timeout, growl, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.CLIENTMANAGEINIT, function(event, args) {
            if (table) {
              table.destroy();
              domMain.empty(); //还真没有加这一句，添加查看都会出现位移情况
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [
                [7, "desc"]
              ],
              columns: args.columns,
              columnDefs: args.columnDefs
            });
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            // var parentDom = $(".special-btn").parent();
            // parentDom.html('<a ng-click="addUser()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建客户</span></a>');
            // $compile(parentDom)($scope);
          });

          domMain.on('click', '#edit-btn', function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.doAction('editClient', rowData);
            // var tds = $(this).parents("tbody").children();
            // $.each(tds, function(i, val) {
            //   var tr1 = $(val).closest('tr');
            //   var jqob1 = $(val);
            //   var row1 = table.row(tr1);
            //   if (row1.data() == undefined) {
            //     tds.eq(i).remove();
            //   }
            //   if (row1.data() != undefined && row1.data().isEdit == 3) {
            //     tds.eq(i).remove();
            //   } else {
            //     var ipts = tds.eq(i).find('input');
            //     $.each(ipts, function(j, valInp) {
            //       var txt = $(valInp).val();
            //       $(valInp).replaceWith(txt);
            //     });
            //     var button = "<li><a id='edit-btn' >编辑信息</a></li>";
            //     button += "<li><a id='del-btn'>删除用户</a></li>";
            //     var btnToggle = "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
            //       "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
            //       "<span class='caret'></span>" +
            //       "<span class='sr-only'>Toggle Dropdown</span>" +
            //       "</button>" +
            //       "<ul class='dropdown-menu' role='menu'>" +
            //       button +
            //       "</ul>";
            //     if (row1.data().isEdit == 2) {
            //       row1.data().isEdit = 0;
            //       tds.eq(i).find('.btn-group').html(btnToggle);
            //     }
            //   }
            // });
            // if (!isEditing) {
            //   isEditing = true;
            //   var tr = $(this).closest('tr');
            //   var row = table.row(tr);
            //   var row1 = row.data();
            //   row.data().isEdit = 2;
            //   row.invalidate().draw();
            // }
          });
          domMain.on('click', '#del-btn', function(e) {

            isEditing = false;
            // var tds = $(this).parents("tbody").children();
            // $.each(tds, function(i, val) {
            //   var tr1 = $(val).closest('tr');
            //   var row1 = table.row(tr1);
            //   if (row1.data() == undefined) {
            //     tds.eq(i).remove();
            //   }
            //   if (row1.data() != undefined) {
            //     var ipts = tds.eq(i).find('input');
            //     $.each(ipts, function(j, valInp) {
            //       var txt = $(valInp).val();
            //       $(valInp).replaceWith(txt);
            //     });
            //   }
            // });
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('delete', row.data(), function(flg) {
              if (flg == 0) {
                row.data().isEdit = 0;
                row.remove().draw(false);
              }
            });
          });

        }
      ]
    };
  }]);

  directives.initDirective('clientOtherTable', ['$timeout', 'growl', 'ngDialog', '$compile', function($timeout, growl, ngDialog, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          // var isEditing = false;
          $scope.$on(Event.CLIENTMANAGEINIT + '_Other', function(event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            // isEditing = false;
            table = domMain.DataTable({
              dom: '',
              language: $.ProudSmart.datatable.language,
              data: args,
              columns: [{
                title: "联系人",
                data: "contactName"
              }, {
                title: "联系人职务",
                data: "contactDuty"
              }, {
                title: "联系电话",
                data: "contactPhone"
              }, {
                title: "邮箱地址",
                data: "contactEmail"
              }, $.ProudSmart.datatable.optionCol2, {
                title: "",
                data: "createTime",
                visible: false
              }],
              columnDefs: [{
                "targets": 0,
                "data": "customerName",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0 && type == "display")
                    return "<input class='form-control col-xs-6' type='text'  maxlength='20'  style='text-indent: 0.5em;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 1,
                "data": "contactDuty",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0 && type == "display") {
                    var str = '<select class="bk-select bk-select-l2" style="border: solid 1px #d2d6de;height: 35px;text-indent: 0.5em;"><option value=""></option>';
                    for (var i in $scope.jobs) {
                      if ($scope.jobs[i].valueCode == data) {
                        str += '<option value="' + $scope.jobs[i].valueCode + '" selected="selected">' + $scope.jobs[i].label + '</option>';
                      }
                      str += '<option value="' + $scope.jobs[i].valueCode + '">' + $scope.jobs[i].label + '</option>';
                    }
                    str += '</select>';
                    return str;
                    // return "<input class='form-control col-xs-6' type='text'  maxlength='20'  style='width:100%;' value='" + escape(data) + "'>";
                  } else {
                    var item = "";
                    for (var i in $scope.jobs) {
                      if ($scope.jobs[i].valueCode == data) {
                        item = $scope.jobs[i]['label'];
                      }
                    }
                    return item;
                  }
                }
              }, {
                "targets": 2,
                "data": "contactPhone",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0 && type == "display")
                    return "<input class='form-control col-xs-6' type='text'  maxlength='20'  style='text-indent: 0.5em;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 3,
                "data": "contactEmail",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0 && type == "display")
                    return "<input class='form-control col-xs-6' type='email'  maxlength='320'  style='text-indent: 0.5em;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 4,
                "data": "option",
                "render": function(data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  if (full.isEdit == 2) {
                    str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                    str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                    str += "</div>";
                  } else {
                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";

                  }
                  return str;
                }
              }, {
                "targets": 5,
                "data": "createTime",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if (full.isEdit > 0 && type == "display")
                    return "<input class='form-control col-xs-6' type='email'  maxlength='320'  style='text-indent: 0.5em;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }]
            });
          });
          /**
           * 监听表格初始化后，添加按钮
           */

          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 3;
            $.extend($scope.inputItem.clientOther, row.data());
            $scope.mistakeMesg.email = false;
            $scope.mistakeMesg.phone = false;
            ngDialog.open({
              template: '../partials/dialogue/client_other_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
            // if (!isEditing) {
            //   isEditing = true;
            //   row.data().isEdit = 2;

            //   row.cells().invalidate();
            //   $compile(tr)($scope);
            // } else {
            //   if (row.data().isEdit == 0) {
            //     growl.warning("当前有正编辑的联系人", {});
            //     return;
            //   }
            // }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            // isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            $scope.inputFun.doActionOther('cancel', row.data());
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.inputFun.doActionOther('delete', row.data(), function(flg) {
              if (flg) {
                row.remove().draw(false);
              }
            });

          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var newDate = '';
            var checkPass = true;
            $.each(tr.children(), function(j, val1) {
              var jqob1 = $(val1);
              var txt2 = $.trim(jqob1.children("select").val());
              if (j == 1) {
                row.data()["contactDuty"] = txt2;
              }
              //把input变为字符串
              if (!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());
                if (j == 0) {
                  var reg = /^\s*$/g; //空为true
                  if (reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    row.data()["contactName"] = txt;
                    $(val1).removeClass('danger');
                    checkPass = true;
                  }
                }
                if (j == 2) {
                  var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                  if (!reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()["contactPhone"] = txt;
                    checkPass = true;
                  }
                }
                if (j == 3) {
                  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                  if (!reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()["contactEmail"] = txt;
                    checkPass = true;
                  }
                }
              }

            });
            if (checkPass) {
              $scope.inputFun.doActionOther('save', row.data(), function() {
                row.data().isEdit = 0;
                row.cells().invalidate().draw(false);
              });
            }
          });

        }
      ]
    }
  }]);

  directives.initDirective('dealerTable', ['$timeout', 'ngDialog', 'growl', '$compile', function($timeout, ngDialog, growl, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          $scope.$on(Event.CLIENTMANAGEINIT + '_dealer', function(event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [
                [7, "desc"]
              ],
              columns: args.columns,
              columnDefs: args.columnDefs
            });
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var newDate = '';
            var checkPass = true;
            $.each(tr.children(), function(j, val1) {
              var jqob1 = $(val1);
              var txt2 = $.trim(jqob1.children("select").val());
              if (j == 3) {
                row.data()["contactDuty"] = txt2;
              }
              //把input变为字符串
              if (!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());
                if (j == 0) {
                  var reg = /^\s*$/g; //空为true
                  if (reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    row.data()["domainPath"] = txt;
                    $(val1).removeClass('danger');
                    checkPass = true;
                  }
                }
                if (j == 4) {
                  var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                  if (!reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()["contactPhone"] = txt;
                    checkPass = true;
                  }
                }
                if (j == 5) {
                  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                  if (!reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()["contactEmail"] = txt;
                    checkPass = true;
                  }
                }
                table.cell(jqob1).data(txt);
              }
            });
            if (checkPass) {
              console.log(row.data());
              $scope.doDealerAction('save', row.data(), function(flg) {
                if (flg == 0) {
                  row.data().isEdit = 0;
                  // isEditing = false;
                  row.cells().invalidate().draw(false);
                } else {
                  row.data().isEdit = 2;
                }

              });

            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            // isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            // row.data().isEdit = 0;
            $scope.doDealerAction('cancel', row.data());
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 3;
            $.extend($scope.inputItem.dealer, row.data());
            ngDialog.open({
              template: '../partials/dialogue/dealer_info_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
            // row.cells().invalidate();
            // $compile(tr)($scope);
            // }
            // else {
            //   if (row.data().isEdit == 0) {
            //     growl.warning("当前有正编辑的经销商", {});
            //     return;
            //   }
            // }
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doDealerAction('delete', row.data(), function(returnObj) {
              if (returnObj != 0) {
                // row.data().isEdit = 2;
              } else {
                row.remove().draw(false);
              }
            });
          });

        }
      ]
    };
  }]);
  directives.initDirective('ckeditor', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      require: 'ngModel',
      controller: ["$scope", "$element", "$attrs", "userUIService", function ($scope, $element, $attrs, userUIService) {
        require(['ckeditor'], function (ckeditor) {
          var domMain = $element;
          var id = $(domMain).attr('id');
          var url = '' + userUIService.uploadFileUrl + '/api/rest/upload/userUIService/uploadFile';
          var editor = CKEDITOR.replace(id, {
            customConfig: '../../toolkit/ckeditor_config_standard.js', //自己配置的config
            extraPlugins: 'myplugin,colorbutton,colordialog,smiley,iframe,iframedialog,flash,find,font,preview,justify,pagebreak,placeholder,newpage,selectall,templates,forms,notificationaggregator,notification,filetools,uploadwidget,widget,showblocks,codesnippet',
            height: 500,
            filebrowserUploadUrl: url,
            filebrowserBrowseUrl: url,
            filebrowserImageBrowseUrl: url,
            filebrowserFlashBrowseUrl: url,
            filebrowserImageUploadUrl: url,
            filebrowserFlashUploadUrl: url,
            stylesSet: [{
              name: 'Narrow image',
              type: 'widget',
              widget: 'image',
              attributes: {
                'class': 'image-narrow'
              }
            }, {
              name: 'Wide image',
              type: 'widget',
              widget: 'image',
              attributes: {
                'class': 'image-wide'
              }
            }]
          });
          editor.on('fileUploadRequest', function (evt) {
            var xhr = evt.data.fileLoader.xhr;
            console.log("Hello world");
            console.log("读取Request");
            console.log("url" + evt.data.url);
            console.log("message" + evt.data.message);
            console.log("filename" + evt.data.filename);
            xhr.withCredentials = true;
          });
        })
      }]
    }
  }]);
  directives.initDirective('supplierTable', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.SUPPLIERMANAGEINIT, function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              columnDefs: args.columnDefs,
              scrollX: true
            });
          });
          /* Formatting function for row details - modify as you need */
          function format(d) {
            if (d != undefined) {
              // `d` is the original data object for the row
              var returnStr;
              returnStr = '<table width="100%" class="table">' +
                '<tr>' +
                '<td>备注:</td>' +
                '<td><textarea  id="discription" class="col-sm-6" style="height:100px;" name="discription" maxlength="100"  type="text" >' + d.discription + '</textarea></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="4"><div class="input-group">' +
                '<a id="remark-btn" class="btn btn-default btn-sm" style="margin-right: 15px;"><i class="fa fa-check hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                '<a id="cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>' +
                '</tr>' +
                '</table>';
              return returnStr;
            }
          }

          domMain.on('click', 'td', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (($(this).context.cellIndex == 5 && row.data().isEdit == 0)) {
              e.preventDefault();
              return;
            }
            if (row.child.isShown()) {} else {
              if (row.data() != undefined) {
                tr.addClass('shown');
              }
            }
            if (row.data() != undefined && row.data().isEdit == 1) {
              row.data().isEdit = 2;
              var tds = $(this).parents("tr").children();
              $.each(tds, function (i, val) {
                var jqob = $(val);
                if (i == 4) {
                  return true;
                }
                if (jqob.has('button').length) {
                  var put1 = $('<a id="save-btn" style="margin-right: 15px;" class="btn btn-default btn-sm"><i class="fa fa-check"></i><span class="hidden-xs ng-binding">保存</span></a><a  id="cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close"></i><span class="hidden-xs ng-binding">取消</span></a>');
                  jqob.html(put1);
                  return true;
                } //跳过第1项 序号,按钮
                var txt = jqob.text();
                if (i == 3 && txt == "") {
                  var put1 = $("<input class='form-control  col-xs-6' style='width:100%;'   maxlength='30'  type='text'  >");
                  put1.val(txt);
                  jqob.html(put1);
                  return true;
                }
                var put = $("<input class='form-control  col-xs-6' style='width:100%;border: 1px solid #F18282;'  maxlength='30'  type='text'  >");
                put.val(txt);
                jqob.html(put);
              });
            }
          });
          domMain.on('click', '#save-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            var selectRow = table.row('.shown');
            $.each($('.shown').children(), function (j, val1) {
              var jqob1 = $(val1);
              //把input变为字符串
              if (!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = jqob1.children("input").val();
                if (txt) {
                  if (j == 2) {
                    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    var reg1 = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                    if (!reg.test(txt)) {
                      if (!reg1.test(txt)) {
                        $(val1).addClass('danger');
                        checkPass = false
                        return false;
                      } else {
                        selectRow.data()["userEmalStatus"] = "phone";
                      }
                    } else {
                      selectRow.data()["userEmalStatus"] = "email";
                    }
                  }
                  $(val1).removeClass('danger');
                  //                                    jqob1.html(txt);
                  table.cell(jqob1).data(txt); //修改DataTables对象的数据
                } else {
                  if (j == 0 || j == 1) {
                    table.cell(jqob1).data(txt)
                    $(val1).addClass('danger');
                    checkPass = false;
                    return false;
                  }
                }
              }
            });
            var ipts = tr.parent().find('input');
            // $.each(ipts, function(i, val) {
            //   var txt = $(val).val();
            //   var attrname = $(val).attr('name');
            //   selectRow.data()[attrname] = txt;
            // });
            if (checkPass) {
              isEditing = false;
              $scope.doAction('save', selectRow.data());
            }
          });
          domMain.on('click', '#cancel-btn', function (e) {
            e.stopPropagation();
            isEditing = false;
            $scope.doAction('cancel');
          });
          domMain.on('click', '#edit-btn', function (e) {
            e.preventDefault();
            isEditing = false;
            var tds = $(this).parents("tbody").children();
            $.each(tds, function (i, val) {
              var tr1 = $(val).closest('tr');
              var row1 = table.row(tr1);
              if (row1.data() == undefined) {
                tds.eq(i).remove();
              }
              if (row1.data() != undefined && row1.data().isEdit == 3) {
                tds.eq(i).remove();
              } else {
                var ipts = tds.eq(i).find('input');
                $.each(ipts, function (j, valInp) {
                  var txt = $(valInp).val();
                  $(valInp).replaceWith(txt);
                });
              }
            });
            if (!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 1;
            }
          });
          domMain.on('click', '#del-btn', function (e) {
            e.preventDefault();
            isEditing = false;
            var tds = $(this).parents("tbody").children();
            $.each(tds, function (i, val) {
              var tr1 = $(val).closest('tr');
              var row1 = table.row(tr1);
              if (row1.data() == undefined) {
                tds.eq(i).remove();
              }
              if (row1.data() != undefined) {
                var ipts = tds.eq(i).find('input');
                $.each(ipts, function (j, valInp) {
                  var txt = $(valInp).val();
                  $(valInp).replaceWith(txt);
                });
              }
            });
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('delete', row.data());
          });
        }
      ]
    };
  }]);
  directives.initDirective('systemTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_system", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              "aaSorting": [
                [1, "desc"]
              ],
              columnDefs: args.columnDefs
            });
          });
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a href="#/mailedit" class="pull-right btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新增</span></a>');
            $compile(parentDom)($scope);
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          domMain.on('click', '#update-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            location.href = "#/mailedit/" + row.data().messageId + "";
          });
          domMain.on('click', '#delete-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.deleteMessage(row.data());
          });
          domMain.on('click', '#publish-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.publishMessage(row.data());
          });
          domMain.on('click', '#preview-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.preview(row.data());
          });
        }
      ]
    };
  }]);
});