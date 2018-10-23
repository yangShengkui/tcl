define(['directives/directives', 'datatables.buttons.html5', 'jszip', 'datatables.net-select'], function (directives, datatables, jszip) {
  'use strict';

  directives.initDirective('directiveSendTable', ['growl', '$compile', function (growl, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        $scope.$on('DIRECTIVE_SEND_TABLE_INIT', function (event, args) {

          args.data.forEach(function (item) {
            item.paramMap = item.paramMap || {};
          });

          if (table) {
            table.destroy();
            domMain.empty();
          }

          isEditing = false;
          table = domMain.DataTable({
            dom: args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.data,
            order: [
              [0, "asc"]
            ],
            columns: [{
              data: "name",
              title: "指令名称"
            }, {
              data: "paramMap",
              title: "指令参数",
              width: '60%'
            }, {
              data: 'ope',
              title: '操作',
              width: '150px'
            }],
            columnDefs: [{
              targets: 0,
              data: "name"
            }, {
              targets: 1,
              data: "paramMap",
              render: function (data) {
                if (Object.keys(data).length < 1) {
                  return '';
                }
                return JSON.stringify(data);
              }
            }, {
              "targets": 2,
              "data": "ope",
              "render": function (data, type, full) {
                var str = '';
                str += '<div class="btn-group btn-group-sm">';
                if (full.isEditing) {
                  str += '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>';
                  str += '<a id="cancel-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">取消</span></a>';
                } else {
                  str += '<a id="edit-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑参数</span></a>';
                  str += '<a id="send-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">发送指令</span></a>';
                }
                str += '</div>'
                return str;
              }
            }]
          });
        });

        function format(d) {
          var returnStr;
          returnStr = '<table width="100%" class="table table-inner">';
          d.params.forEach(function (param) {
            param.values = typeof param.values === 'object' ? '' : param.values;
            returnStr += '<tr role="row">';
            returnStr += '<td style="width:20%;">' + param.label + ':</td>';

            if (d.isEditing) {
              var rangeStr = $scope.kpis[param.id].range;
              if (rangeStr && rangeStr.charAt(0) === '{') {
                var range = JSON.parse(rangeStr);
                returnStr += '<td style="width:80%;">';
                returnStr += '<select style="width:20%;" class="form-control input-sm" name="' + param.label + '">';
                returnStr += '<option value="">请选择...</option>'
                for (var key in range) {
                  if (param.values == key) {
                    returnStr += '<option value="' + key + '" selected>' + range[key] + '</option>';
                  } else {
                    returnStr += '<option value="' + key + '">' + range[key] + '</option>';
                  }
                }
                returnStr += '</select></td>';
              } else {
                returnStr += '<td><input style="width:20%;" class="form-control input-sm" name="' + param.label + '" value="' + param.values + '"></td>';
              }
            } else {
              returnStr += '<td>' + param.values + '</td>';
            }
            returnStr += '</tr>';
          });
          returnStr += '</table>';
          return returnStr;
        }

        /*domMain.on('click', 'td', function (e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if ($(this).context.cellIndex == 3 || isEditing) {
            return;
          }
          var rowData = row.data();
          if (rowData) {
            if (row.child.isShown()) { //之前展开
              row.child.hide();
              tr.removeClass('shown');
            } else { //之前关闭，则需要展开
              row.child(format(rowData)).show();
              tr.addClass('shown');
            }
          }
        });*/

        domMain.on('click', '#edit-btn', function (e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (!isEditing) {
            isEditing = true;
            var rowData = row.data();
            rowData.isEditing = true;
            row.child(format(rowData)).show();
            tr.addClass('shown');
            row.cells().invalidate();
            $compile(tr)($scope);
          } else {
            growl.warning("当前有正在编辑的指令参数", {});
            return;
          }
        });

        domMain.on('click', '#save-btn', function (e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          isEditing = false;
          var rowData = row.data();
          var ipts = tr.parent().find('.input-sm');
          var obj = {};
          $.each(ipts, function (i, el) {
            var txt = $(el).val();
            var attrname = $(el).attr('name');
            rowData.params.forEach(function (param) {
              if (param.label == attrname) {
                if ($.trim(txt)) {
                  param.values = txt;
                  obj[param.label] = txt;
                }
              }
            });
          });
          rowData.isEditing = false;
          row.child.hide();
          tr.removeClass('shown');
          rowData.paramMap = obj;
          row.cells().invalidate();
          $compile(tr)($scope);
        });

        domMain.on('click', '#cancel-btn', function (e) {
          e.stopPropagation();
          isEditing = false;
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          isEditing = false;
          rowData.isEditing = false;
          row.child.hide();
          tr.removeClass('shown');
          row.cells().invalidate();
          $compile(tr)($scope);
        });

        domMain.on('click', '#send-btn', function (e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          if (!isEditing) {
            $scope.sendDirective(rowData);
          } else {
            growl.warning("当前有正在编辑的指令参数", {});
            return;
          }
        });
      }]
    }
  }])

});