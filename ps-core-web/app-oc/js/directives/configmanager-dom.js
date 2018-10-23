define(['directives/directives', 'datatables.net', 'datatables.net-bs'], function(directives, datatables) {
  'use strict';
  directives.initDirective('configGroupTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;

          $scope.$on(Event.CONFIGGROUPINIT, function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty()
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args,
              order: [
                [5, "desc"]
              ],
              columns: [{
                data: "name",
                title: "配置组名称"
              }, {
                data: "label",
                title: "配置组显示名"
              }, {
                data: "type",
                title: "配置组类型"
              }, {
                data: "value",
                title: "配置组值"
              }, $.ProudSmart.datatable.optionCol2, {
                data: "id",
                visible: false
              }],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if((full.isEdit == 2 || full.isEdit == 3)  && type == "display")
                    return "<input maxlength='50' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 1,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if((full.isEdit == 2 || full.isEdit == 3)  && type == "display")
                    return "<input maxlength='50' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 2,
                data: "type",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if((full.isEdit == 2 || full.isEdit == 3)  && type == "display") {
                    var put = "<select class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for(var i in $scope.configTypes) {
                      if($scope.configTypes[i].value == data) {
                        put += '<option selected="true" value="' + $scope.configTypes[i].value + '">' + $scope.configTypes[i].label + '</option>';
                      } else {
                        put += '<option value="' + $scope.configTypes[i].value + '">' + $scope.configTypes[i].label + '</option>';
                      }
                    }
                    put += '</select>';
                    return put;
                  }
                  for(var i in $scope.configTypes) {
                    if($scope.configTypes[i].value == data) {
                      return $scope.configTypes[i].label;
                    }
                  }
                  return data;
                }
              }, {
                targets: 3,
                data: "value",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if((full.isEdit == 2 || full.isEdit == 3) && type == "display")
                    return "<input maxlength='100' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 4,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit == 2 || full.isEdit == 3) {
                    str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>"
                    if(full.isNew){
                      if ($scope.menuitems['D03_A04_S23']) {
                        str += "<button id='del-btn' class='btn btn-primary' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                      }
                    } else{
                      str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>"
                    }
                  } else {
                    if ($scope.menuitems['D02_A04_S23']) {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></button>"
                    }
                    if ($scope.menuitems['D03_A04_S23']) {
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                    }
                  }
                  str += "</div>"
                  return str;
                }
              }]
            })
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addConfigGroup()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建配置组</span></a>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(row.data().isEdit == 2 || row.data().isEdit == 3) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if(i == 0 || i == 1) {
                  if(jqob.children("input").length > 0) {
                    var txt = jqob.children("input").val();
                    if(!txt) {
                      $(val).addClass('danger');
                      checkPass = false;
                      row.data().isEdit = 2;
                      row.cells().invalidate();
                      growl.warning("该字段不能为空", {})
                      return false
                    } else {
                      $(val).removeClass('danger');
                    }
                  }
                }
                if(i == 2) {
                  var txt = $(val).children("select").val();
                  table.cell(jqob).data(txt); //修改DataTables对象的数据
                  return true;
                }
                if(i < 4) {
                  var txt = jqob.children("input").val();
                  table.cell(jqob).data(txt); //修改DataTables对象的数据
                }
              });
              var list = $scope.configGroups;
              for(var i in list){
                if(list[i].name == row.data().name && list[i].isEdit != 2 && list[i].isEdit != 3 ){
                  checkPass = false;
                  growl.warning("配置组名称不能重复", {})
                  return false
                }
              }
              if(checkPass) {
                $scope.doAction("configGroupSave", row.data(), function(returnObj) {
                  if(returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().id = returnObj.id;
                    row.data().isEdit = 0;
                    row.cells().invalidate();
                    isEditing = false;
                  }
                });
              }
            }
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            if(!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 3;
              row.cells().invalidate();
            } else {
              growl.warning("当前有修改中的配置组，请先完成该操作", {});
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(isEditing) {
              isEditing = false;
              row.data().isEdit = 0;
              row.cells().invalidate();
            } else {
              var rowData = row.data();
              $scope.doAction("configGroupDelete", rowData, function(flg) {
                if(flg)
                  row.remove().draw(false);
              });
            }
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("configGroupDelete", rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    };
  }]);
  directives.initDirective('configInsTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          var groupInf;
          $scope.$on(Event.CONFIGINSINIT, function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args,
              order: [
                [4, "desc"]
              ],
              columns: [{
                data: "groupName",
                title: "配置组显示名"
              }, {
                data: "label",
                title: "配置项名"
              },
              //   {
              //   data: "value",
              //   title: "配置项值"
              // },
                {
                data: "keyDesc",
                title: "描述",
                width:"200px"
              },$.ProudSmart.datatable.optionCol2, {
                data: "id",
                visible: false
              }],
              columnDefs: [{
                targets: 0,
                data: "groupName",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit > 0 && type == "display") {
                    var put = "<select id='group-select' class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for(var i in $scope.configGroups) {
                      if($scope.configGroups[i].name == data) {
                        put += '<option selected="true" value="' + $scope.configGroups[i].name + '">' + $scope.configGroups[i].label + '</option>';
                      } else {
                        put += '<option value="' + $scope.configGroups[i].name + '">' + $scope.configGroups[i].label + '</option>';
                      }
                    }
                    put += '</select>';
                    return put;
                  }
                  for(var i in $scope.configGroups) {
                    if($scope.configGroups[i].name == data) {
                      return $scope.configGroups[i].label;
                    }
                  }
                  return data;
                }
              }, {
                targets: 1,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit > 0 && type == "display")
                    return "<input maxlength='50' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              },
//                 {
//                 targets: 2,
//                 data: "value",
//                 render: function(data, type, full) {
//                   // 返回自定义内容
//                   if(full.isEdit > 0 && type == "display") {
//                     groupInf = null;
//                     for(var i in $scope.configGroups) {
//                       if($scope.configGroups[i].name == full.groupName) {
//                         groupInf = $scope.configGroups[i]
//                       }
//                     }
//                     if(groupInf && groupInf.type == "file") {
// //                    return '<input class="form-control input-sm" type="file" nv-file-select uploader="uploader"/>';
//                       return '<uploader-div/>';
//                     } else {
//                       return "<input style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
//                     }
//                   } else {
//                     // return "<div style='width:400px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;' data-toggle='tooltip' title='"+escape(data)+"'>"+escape(data)+"</div>";
//                    return "<div  style='width:400px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;'>"+escape(data)+"</div>";
//                   }
//                 }
//               },
                {
                targets: 2,
                data: "keyDesc",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit > 0 && type == "display")
                    return "<input maxlength='100' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 3,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit > 0) {
                    str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>"
                    // if(full.id == Number.MAX_VALUE) {
                    //   isEditing = true;
                    //   if ($scope.menuitems['A03_S23']) {
                    //     str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                    //   }
                    //  } else {
                      str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>"
                    // }
                  } else {
                    if ($scope.menuitems['A02_S23']) {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></button>"
                    }
                    if ($scope.menuitems['A03_S23']) {
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                    }
                  }
                  str += "</div>"
                  return str;
                }
              }],
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              }
            })
          });
          
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addConfig()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建配置项</span></a>');
            $compile(parentDom)($scope);
          });
          
          domMain.on('change', '#group-select', function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var selectVal = $(this).val();
            row.data().groupName = selectVal;
            row.cells().invalidate();
            $compile(tr)($scope);
          });
          
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(row.data().isEdit == 2 || row.data().isEdit == 3) {
            /** if(row.data().isEdit == 2) { */
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if(i == 0) {
                  var txt = $(val).children("select").val();
                  if (!txt) {
                    growl.warning("请选择配置组显示名", {});
                    checkPass = false;
                    return false;
                  }
                } else if (i == 1) {
                  if(jqob.children("input").length > 0) {
                    var txt = jqob.children("input").val();
                    if(!$.trim(txt)) {
                      growl.warning("请输入配置项名", {});
                      checkPass = false;
                      return false;
                    } else {
                      row.data().label = txt;
                    }
                  }
                } else if(i == 2) {
                    var txt = jqob.children("input").val();
                      if(groupInf && groupInf.type == "file") {
                        var djob = jqob.children("div");
                        var dval= djob.children("input").val();
                      if(!dval && !row.data().value) {
                        growl.warning("请选择一个上传文件作为配置项值", {});
                        checkPass = false;
                        return false;
                      }
                    } else {
                      if(!txt) {
                        growl.warning("请输入配置项值", {});
                        checkPass = false;
                        return false;
                      } else {
                        table.cell(jqob).data(txt);
                      }
                    }
                } else if(i < 4) {
                  var txt = jqob.children("input").val();
                  table.cell(jqob).data(txt); //修改DataTables对象的数据
                }
              });

              if(checkPass) {
                $scope.doAction("configSave", row.data(), function(returnObj) {
                  if(returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().id = returnObj.id;
                    row.data().isEdit = 0;
                    row.cells().invalidate().draw();;
                    isEditing = false;
                  }
                });
              }
            }
          });
          
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            // if(!isEditing) {
            //   isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 2;
              // row.cells().invalidate();
              // $compile(tr)($scope);
              $scope.addConfig(row.data());
            // } else {
            //   growl.warning("当前有未保存的配置项，请先完成该操作", {});
            // }
          });
          
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            isEditing = false;
            //清理上传文件缓存数据
            if(groupInf && groupInf.type == "file") {
              $scope.clearUpload();
            }
            if(row.data().isEdit == 3){
              for(var i in $scope.configIns){
                if($scope.configIns[i].isEdit == 3){
                  $scope.configIns.splice(i, 1);
                }
              }
              row.data().isEdit = 0;
              row.remove().draw(false);
            }else{
              row.data().isEdit = 0;
              row.cells().invalidate();
            }
          });
          
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            rowData.isDel = true;
            $scope.doAction("configDelete", rowData, function(flg) {
              if(flg) {
                isEditing = false;
                row.remove().draw(false);
              }
            });
          });
        }
      ]
    };
  }]);
});