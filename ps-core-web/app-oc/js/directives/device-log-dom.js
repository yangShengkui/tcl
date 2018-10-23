define(['directives/directives', 'bootstrap-dialog', 'datatables.buttons.html5', 'jszip', 'datatables.net-select'], function(directives, BootstrapDialog, datatables, jszip) {
  'use strict';
  directives.initDirective('deviceLogTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on("device_log", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + $.ProudSmart.datatable.footerdom,
            language: $.ProudSmart.datatable.language,
            processing: true,
            serverSide: true,
            orderable: false,
            ajax: $scope.pipeline(),
            columns: [{
              data: "createTime",
              title: "时间"
            }, {
              data: "type",
              title: "类型"
            }, {
              data: "desc",
              title: "描述"
            }, {
              data: "gatewayAddress",
              title: "网关地址"
            }],
            columnDefs: [{
              targets: 0,
              data: "createTime",
              render: function(data, type, full) {
                // 返回自定义内容
                var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                //                var str = "<date-label value=" + data + " format='yyyy-MM-dd HH:mm:ss'>";
                return str;
              }
            },{
              targets: 1,
              data: "type",
              orderable: false,
              render: function(data, type, full) {
                var str = "";
                if(data == 'data_status_log'){
                  str = "状态日志";
                }
                return str;
              }
            },{
              targets: 2,
              data: "desc",
              orderable: false,
              render: function(data, type, full) {
                return data;
              }
            },{
              targets: 3,
              data: "gatewayAddress",
              orderable: false,
              render: function(data, type, full) {
                return data;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {

              $compile(nRow)($scope);
            },
            drawCallback: function(settings) {
              var api = this.api();
              if(api.data().length > 0) {
                $(".footerdom").show();
//                $(".dataTables_wrapper .dataTables_filter").show();
                $(".dataTables_wrapper .dataTables_filter").empty();
              } else {
                $(".footerdom").hide();
                $(".dataTables_wrapper .row").hide()
                $(".dataTables_wrapper .dataTables_filter").empty();
              }
              $('#allselect-btn').attr('checked', false)
              $('#allselect-btn').prop('checked', false);
            }
          });
        });
      }]
    }
  }]);

});