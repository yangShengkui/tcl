define(['directives/directives','datatables.net','datatables.net-bs'], function(directives,datatables) {
  'use strict';
  directives.initDirective('attrseditTable', ['$timeout','$compile',function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.ATTREDITINIT, function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              scrollX: true,
              columns: [{
                data: "name",
                title: "属性名称"
              }, {
                data: "label",
                title: "显示名称"
              }, {
                data: "dataType",
                title: "数据类型"
              }, {
                data: "option",
                orderable: false,
                title: "操作",
                width: "100px",
                visible: $scope.selectedDitem && $scope.selectedDitem.canEdit
              }],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display")
                    if (full.dataType != "icon")
                      return "<input style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                    else
                      return "<input style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "' disabled>";
                  else
                    return escape(data);
                }
              }, {
                targets: 1,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display")
                    if (full.dataType != "icon")
                      return "<input style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                    else
                      return "<input disabled style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 2,
                data: "dataType",
                render: function(data, type, full) {
                  if (!$scope.myDicts) return data;
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display") {
                    var put = "<select id='dtSelect' class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for (var i in $scope.myDicts['DataType']) {
                      if ($scope.myDicts['DataType'][i].valueCode == data) {
                        put += '<option selected="true" value="' + $scope.myDicts['DataType'][i].valueCode + '">' + $scope.myDicts['DataType'][i].label + '</option>';
                      } else {
                        put += '<option value="' + $scope.myDicts['DataType'][i].valueCode + '">' + $scope.myDicts['DataType'][i].label + '</option>';
                      }

                    }
                    put += '</select>';
                    return put;
                  }
                  for (var i in $scope.myDicts['DataType']) {
                    if ($scope.myDicts['DataType'][i].valueCode == data) {
                      return $scope.myDicts['DataType'][i].label;
                    }
                  }
                  return data;
                }
              }, {
                targets: 3,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var str = "<div class='btn-group btn-group-sm'>";
                  if (full.canEdit) {
                    if (full.isEdit == 2) {
                      str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                      if (full.isNew)
                        str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                      else
                        str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                    } else {
                      str += "<a id='edit-btn' class='btn btn-default' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>"
                      str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                    }
//                } else {
//                  str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                  }
                  str += "</div>"
                  return str;
                }
              }]
            })
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            if ($scope.selectedDitem && $scope.selectedDitem.canEdit) {
              var parentDom = $(".special-btn").parent();
              parentDom.html('<a ng-click="addModelSubItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加属性</span></a>');
              $compile(parentDom)($scope);
            }
          });

          domMain.on('change', "#dtSelect", function() {
            var value = $(this).children('option:selected').val(); //这就是selected的值 
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (value == "icon") {
              row.data().label = "图标";
              row.data().name = "icon";
              row.data().dataType = "icon";
              row.cells().invalidate();
            } else {
              var tds = $(this).parents("tr").children();
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if (i == 1) {
                  row.data().label = jqob.children("input").val();
                }
                if (i == 0) {
                  row.data().name = jqob.children("input").val();
                }
              });
              row.data().dataType = value;
              row.cells().invalidate();
            }
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.data().isEdit == 2) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if (i == 0 || i == 1) {
                  var txt = jqob.children("input").val();
                  if (!txt) {
                    $(val).addClass('danger');
                    checkPass = false;
                    row.data().isEdit = 2;
                    row.cells().invalidate();
                    return false
                  } else {
                    $(val).removeClass('danger');
                  }
                }
                if (i == 2) {
                  var txt = $(val).children("select").val();
                  if (txt) {
                    jqob.html(txt);
                    table.cell(jqob).data(txt); //修改DataTables对象的数据
                    $(val).removeClass('danger');
                    return true;
                  } else {
                    checkPass = false;
                    $(val).addClass('danger');
                    return false
                  }
                }
                if (i == 3) {
                  row.cell(jqob).invalidate();
                  return true;
                }
                var txt = jqob.children("input").val();
                jqob.html(txt);
                table.cell(jqob).data(txt); //修改DataTables对象的数据
              });
              if (checkPass) {
                $scope.doAction("attr-save", row.data(), function(returnObj) {
                  if (returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().id = returnObj.id;
                    row.data().isEdit = 0;
                    row.data().isNew = false;
                    row.cells().invalidate();
                    isEditing = false;
                  }
                });
              }
            }
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            if (!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 2;
              row.cells().invalidate();
            } else {
              $scope.doAction("thresholdMessage", "当前有修改中的属性，请先完成该操作");
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            if (isEditing) {
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 0;
              row.cells().invalidate();
            }
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("attr-delete", rowData, function(flg) {
              if (flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    };
  }]);
});