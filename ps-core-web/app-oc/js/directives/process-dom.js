define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'], function (directives, BootstrapDialog, datatables) {
  'use strict';
  directives.initDirective('processDesignDom', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on("PROCESS", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [[2, "desc"]],
              columns: [{
                data: "name",
                title: "流程名称"
              }, {
                data: "desc",
                title: "描述"
              }, {
                data: "createTime",
                title: "创建时间"
              }, {
                data: "updateTime",
                title: "更新时间"
              }, {
                data: "pulishTime",
                title: "最新发布时间"
              }, {
                data: "version",
                title: "最新版本号"
              }, {
                data: "versionCount",
                title: "历史版本数量"
              },$.ProudSmart.datatable.optionCol3],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function(data, type, full) {
                  // 返回自定义内容
                  if((full.isEdit == 2 || full.isEdit == 3) && type == "display")
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
                targets: 3,
                data: "updateTime",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                  return str;
                }
              }, {
                targets: 4,
                data: "pulishTime",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                  return str;
                }
              }, {
                targets: 5,
                data: "version",
                render: function(data, type, full) {
                  return data;
                }
              }, {
                targets: 1,
                data: "desc",
                render: function(data, type, full) {
                  // 返回自定义内容
                  if((full.isEdit == 2 || full.isEdit == 3) && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              },  {
                targets: 6,
                data: "versionCount",
                render: function(data, type, full) {
                  return escape(data);
                }
              }, {
                targets: 7,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit == 2 || full.isEdit == 3) {
                    str += "<button id='save-btn'  class='btn btn-primary' ><i class='fa fa-check hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                    str += "<button id='cancel-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                  }else{
                    if ($scope.menuitems['A01_S19']) {
                      str += "<button id='design-btn'  class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 设计</span></button>";
                    }
                    if ($scope.menuitems['A06_S19']) {
                      str += "<button id='edit-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    }
                    if ($scope.menuitems['A01_S19'] || $scope.menuitems['A08_S19'] || $scope.menuitems['A03_S19']) {
                      str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    }
                    str += "<ul class='dropdown-menu' role='menu'>";
                    if ($scope.menuitems['A07_S19']) {
                      str += "<li><a role='button'  id='del-btn'>删除</a></li>";
                    }
                    if($scope.menuitems['A08_S19']) {
                      str += "<li><a role='button'  id='release-btn'>发布</a></li>";
                    }
                    // if($scope.menuitems['A08_S19']) {
                      str += "<li><a role='button'  id='copy-btn'>复制</a></li>";
                    // }
                    if ($scope.menuitems['A03_S19']) {
                      str += "<li><a role='button'  id='history-btn'>历史版本</a></li>";
                    }
                    str += "</ul>";
                  }
                  str += "</div>";
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
            parentDom.html('<a ng-click="addViews()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建流程</span></a>');
            $compile(parentDom)($scope);
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          domMain.on('click', '#view-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var viewInfo = row.data();
            location.href = "../app-flowsheet/index.html#/displayView/" + viewInfo.id;
          });
          domMain.on('click', '#design-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var viewInfo = row.data();
            location.href = "../app-flowsheet/index.html#/flow/" + viewInfo.id;
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
            $scope.addViews(row.data());
            /*if(!isEditing) {
              isEditing = true;
              row.data().isEdit = 2;
              row.cells().invalidate();
            }*/
          });
          domMain.on('click', '#save-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if(rowData.isEdit == 2 || rowData.isEdit == 3 ) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if(i == 0) {
                  if(jqob.children("input").length > 0) {
                    var txt = jqob.children("input").val();
                    if(!txt) {
                      growl.warning("视图名称不能空");
                      checkPass = false;
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
            if(checkPass){
              $scope.doAction("view-save", rowData, function(flg) {
                if(flg) {
                  isEditing = false;
                  row.data().isEdit = 0;
                  row.cells().invalidate();
                }
              });

            }
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
          domMain.on('click', '#release-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("release", rowData);
          });
          domMain.on('click', '#history-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("history", rowData);
          });
        }
      ]
    };
  }]);
  directives.initDirective('processHistory', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on("PROCESS"+"history", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [[2, "desc"]],
              columns: [{
                data: "name",
                title: "视图名称"
              }, {
                data: "desc",
                title: "描述"
              }, {
                data: "createTime",
                title: "发布时间"
              },{
                data: "version",
                title: "版本号"
              },{
                data: "option",
                orderable: false,
                title: "操作",
                width: "120px",
                visible: $scope.selectedDitem && $scope.selectedDitem.canEdit
              }],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function(data, type, full) {
                  // 返回自定义内容
                  if((full.isEdit == 2 || full.isEdit == 3) && type == "display")
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
              },{
                targets: 3,
                data: "version",
                render: function(data, type, full) {
                  return data;
                }
              }, {
                targets: 1,
                data: "desc",
                render: function(data, type, full) {
                  // 返回自定义内容
                  if((full.isEdit == 2 || full.isEdit == 3) && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              },{
                targets: 4,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if ($scope.menuitems['A09_S19']) {
                    str += "<button id='look-btn'  class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                  }
                  if ($scope.menuitems['A10_S19']) {
                    str += "<button id='del-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                  str += "</div>";
                  return str;
                }
              }]
            })
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("history-delete", rowData);
          });
          domMain.on('click', '#look-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            location.href = "../app-flowsheet/index.html#/historyView/" + rowData.id
          });
        }
      ]
    };
  }]);
  directives.initDirective('processReleaseDom', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on("PROCESS-RELEASE", function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              columns: [{
                data: "name",
                title: "流程名称"
              }, {
                data: "desc",
                title: "描述"
              }, {
                data: "createTime",
                title: "创建时间"
              },  {
                data: "version",
                title: "版本号"
              }, {
                data: "option",
                orderable: false,
                title: "操作",
                width: "120px",
                visible: $scope.selectedDitem && $scope.selectedDitem.canEdit
              }],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function(data, type, full) {
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
                data: "desc",
                render: function(data, type, full) {
                    return escape(data);
                }
              }, {
                targets: 4,
                data: "option",
                render: function(data, type, full) {
                  var str;
                    str = '<div class="btn-group  btn-group-sm">' +
                      '<a id="del-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';

                  return str;
                }
              }]
            })
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








