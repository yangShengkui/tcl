define(['directives/directives'], function(directives) {
  'use strict';
  directives.initDirective('directiveTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.DIRECTIVESINIT, function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              //scrollX: true,
              columns: [{
                data: "name",
                title: "指令名称"
              }, {
                data: "commandCode",
                title: "指令编码"
              }, {
                data: "description",
                title: "描述"
              }, {
                data: "option",
                title: "操作",
                //width: "140px",
                orderable: false//去掉操作项排序功能
                //visible: $scope.selectedDitem && $scope.selectedDitem.canEdit
              }],
              columnDefs: [{
                  targets: 0,
                  data: "name",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                      return "<input class='form-control input-sm' style='border: 1px solid #F18282;width: 100%;' type='text'  value='" + data + "'>";
                    else
                      return data;
                  }
                }, {
                  targets: 1,
                  data: "commandCode",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                      return "<input class='form-control input-sm' style='border: 1px solid #F18282;width: 100%;' type='number'  value='" + data + "'>";
                    else
                      return data;
                  }

                }, {
                  targets: 2,
                  data: "description",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                      return "<input class='form-control input-sm'  type='text' value='" + (data ? data : '') + "'>";
                    else
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
                        str += "<a id='save-btn' class='btn btn-default btn-sm' ><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                        if (full.isNew)
                          str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                        else
                          str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                      } else {
                        str += "<div class='btn-group table-option-group' >" +
                          "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                          "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                          "<span class='caret'></span>" +
                          "<span class='sr-only'>Toggle Dropdown</span>" +
                          "</button>" +
                          "<ul class='dropdown-menu' role='menu'>" +
                          "<li><a  href='' id='edit-btn'>修改</a></li>" +
                          //"<li><a  href='' id='params-btn'>解析</a></li>" +
                          "<li><a  href='' id='del-btn'>删除</a></li>" +
                          "<li><a  href='' id='point-btn'>设置测点</a></li>" +
                          "</ul>" +
                          "</div>";
                      }
//                  } else {
//                    str += "<a id='params-btn' class='btn btn-default btn-sm'><i class='fa fa-link hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 解析</span></a>"
//                    str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
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
            if ($scope.selectedDitem && $scope.selectedDitem.canEdit) {
              var parentDom = $(".special-btn").parent();
              parentDom.html('<a ng-click="addModelSubItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加指令</span></a>');
              $compile(parentDom)($scope);
            }
          });

          domMain.on('click', '#point-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if ( tr.hasClass('time-color') ) {
              tr.removeClass('time-color');
            } else {
              table.$('tr.time-color').removeClass('time-color');
              tr.addClass('time-color');
            }
            $scope.devicePointInit(row.data(),"point");
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
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
                    if(i == 1){
                      if(txt.length>4)
                      {
                        growl.warning("您输入任务编码超过了4位数字!",{});
                        $(val).addClass('danger');
                        checkPass = false
                        return false;
                      }
                    }
                    $(val).removeClass('danger');
                  }
                }
                //if (i == 1) {
                //  var txt = $(val).children("select").val();
                //  jqob.html(txt);
                //  table.cell(jqob).data(txt); //修改DataTables对象的数据
                //  return true;
                //}

                if (i == 3) {
                  row.cell(jqob).invalidate();
                  return true;
                }
                var txt = jqob.children("input").val();
                jqob.html(txt);
                table.cell(jqob).data(txt); //修改DataTables对象的数据

              });
              if (checkPass) {
                $scope.doAction("directive-save", row.data(), function(returnObj) {
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
              $scope.doAction("thresholdMessage", "当前有修改中的指令，请先完成该操作");
            }
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("directive-delete", rowData, function(flg) {
              if (flg)
                row.remove().draw(false);
            });
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
          domMain.on('click', '#params-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.data().isEdit == 2) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if (i == 2) {
                  var txt = jqob.children("input").val();
                  if (!txt) {
                    $(val).addClass('danger');
                    checkPass = false;
                    return false
                  } else {
                    $(val).removeClass('danger');
                  }
                  if (checkPass) {
                    var txt = jqob.children("input").val();
                    table.cell(jqob).data(txt); //修改DataTables对象的数据
                    $scope.doAction("directive-params", row.data());
                  }
                }
              });
            } else {
              $scope.doAction("directive-params", row.data());
            }
          });
        }
      ]
    };
  }]);
});