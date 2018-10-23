define(['directives/directives','datatables.net','datatables.net-bs'], function(directives,datatables) {
  'use strict';
  directives.initDirective('rappidViewsDom', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on("RAPPIDVIEWS", function(event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              order: [ 2, "desc" ],
              columns: [{
                data: "viewTitle",
                title: "视图名称"
              }, {
                data: "navigate",
                title: "导航级别"
              }, {
                data: "createTime",
                title: "创建时间"
              }, {
                data: "option",
                orderable: false,
                title: "操作",
                width: "120px",
                visible: $scope.selectedDitem && $scope.selectedDitem.canEdit
              }],
              columnDefs: [{
                targets: 0,
                data: "viewTitle",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit == 2 && type == "display")
                    return "<input style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>"
                  else
                    return escape(data);
                }
              }, {
                targets: 2,
                data: "createTime",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                  return str;
                }
              }, {
                targets: 1,
                data: "navigate",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit == 2 && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 3,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  //                var str = "<div class='input-group btn-group-sm'>";
                  //                str += "<a id='view-btn' class='btn btn-default' ><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></a>"
                  //                str += "<a id='edit-btn' class='btn btn-default' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>"
                  //                str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                  //                str += "</div>"
                  //                return str;
                  var str;
                  if(full.isEdit == 2) {
                    str = '<div class="btn-group  btn-group-sm">' +
                      '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                      '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';

                  } else {
                    str = "<div class='btn-group  table-option-group btn-group-sm'>" +
                      "<button type='button' class='btn btn-default'>操作</button>" +
                      "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>" +
                      "<span class='caret'></span>" +
                      "<span class='sr-only'>Toggle Dropdown</span>" +
                      "</button>" +
                      "<ul class='dropdown-menu' role='menu'>" +
                      "<li><a href id='edit-btn'>编辑</a></li>" +
                      "<li><a href id='view-btn'>查看</a></li>" +
                      "<li><a href id='design-btn'>设计</a></li>" +
                      "<li><a href id='copy-btn'>复制</a></li>" +
                      "<li><a href id='del-btn'>删除</a></li>" +
                      "</ul>" +
                      "</div>";
                  }
                  return str;
                }
              }]
            })
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<div class="btn-group btn-group-sm"><a ng-click="addViews()" class="btn btn-default"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建视图</span></a><a ng-click="managePerforms()" class="btn btn-default"><i class="fa fa-edit"></i><span class="hidden-xs"> 管理性能视图</span></a></div>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#view-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var viewInfo = row.data();
            location.href = "../app-configure/index.html#/display/" + viewInfo.viewId
          });
          domMain.on('click', '#design-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var viewInfo = row.data();
            location.href = "../app-configure/index.html#/configure/"
          });
          domMain.on('click', '#copy-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.doAction("view-copy", rowData);
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(!isEditing) {
              isEditing = true;
              row.data().isEdit = 2;
              row.cells().invalidate();
            }
          });
          domMain.on('click', '#save-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if(rowData.isEdit == 2) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if(i == 0) {
                  if(jqob.children("input").length > 0) {
                    var txt = jqob.children("input").val();
                    if(!txt) {
                      growl.warning("视图名称不能空");
                      return false
                    }
                  }
                }
                if (i == 0 || i == 1) {
                  var txt = jqob.children("input").val();
                  jqob.html(txt);
                  table.cell(jqob).data(txt); //修改DataTables对象的数据
                }
              });
            }
            $scope.doAction("view-save", rowData, function(flg) {
              if(flg) {
                isEditing = false;
                row.data().isEdit = 0;
                row.cells().invalidate();
              }
            });
          })
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            isEditing = false;
            row.data().isEdit = 0;
            row.cells().invalidate();
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("attr-delete", rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    };
  }]);
});