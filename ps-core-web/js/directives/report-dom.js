define(['directives/directives', 'datatables.net', 'datatables.net-bs'], function(directives, datatables) {
  'use strict';
  directives.initDirective('durationTable', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          // $scope.$on(Event.CMDBINFOSINIT+"_shadows", function(event, args) {
          $scope.$on(Event.REPORTTREEINIT + "_duration", function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6">><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              data: args.datalist,
              columns: args.columns,
              columnDefs: args.columnDefs,
              scrollX: true
            });
          });
          domMain.on('click', '#designname', function(e) {
            e.stopPropagation();
            var name = $(this).text();
            $scope.search(name, "1001");
          });
          domMain.on('click', '#clientnum', function(e) {
            e.stopPropagation();
            var name = $(this).text();
            $scope.search(name, "1000");
          });
        }
      ]
    };
  }]);
  directives.initDirective('reportLookTable', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          // $scope.$on(Event.CMDBINFOSINIT+"_shadows", function(event, args) {
          $scope.$on("reportLook", function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args,
              columns: [{
                title: "报表名称",
                data: "reportName"
              }, {
                title: "生成时间",
                data: "insertTime"
              }, {
                title: "报表格式",
                data: "fileType"
              }, $.ProudSmart.datatable.optionCol2],
              columnDefs: [{
                "targets": 1,
                "data": "insertTime",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  var str = "";
                  if(data){
                    str = useMomentFormat(data,"yyyy-MM-dd hh:mm:ss");
                  }
                  return str;
                }
              },{
                "targets": 3,
                "data": "option",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                    // str += "<a id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>";
                    str += "<a id='download-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 下载</span></a>";
                    str += "</div>";

                  return str;
                }
              }]
            });
          });
          domMain.on('click', '#del-btn', function(e) {
            e.stopPropagation();
            var name = $(this).text();
            $scope.search(name, "1001");
          });
          domMain.on('click', '#download-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowDate = row.data();
            /*var url = ""+$scope.url+"/"+rowDate.url+"";
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);*/
            window.open(""+$scope.url+"/api/rest/downloadReport/reportUIService/download?reportName="+rowDate.reportName+"&reportFileName="+rowDate.reportFileName+"");
          });
        }
      ]
    };
  }]);
  directives.initDirective('reportRuleTable', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          // $scope.$on(Event.CMDBINFOSINIT+"_shadows", function(event, args) {
          $scope.$on("reportRule", function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args,
              columns: [{
                title: "规则名称",
                data: "userName"
              }, {
                title: "邮件模板",
                data: "userName"
              }, {
                title: "报表名称",
                data: "userName"
              }, {
                title: "接收人",
                data: "userName"
              },{
                title: "启用状态",
                data: "userName"
              }, $.ProudSmart.datatable.optionCol3],
              columnDefs: [{
                "targets": 5,
                "data": "option",
                "render": function (data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                    str += "<a id='edit-btn' class='btn btn-default btn-sm'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></a>";
                    str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                    str += "</div>";

                  return str;
                }
              }]
            });
          });
          domMain.on('click', '#del-btn', function(e) {
            e.stopPropagation();
            var name = $(this).text();
            $scope.search(name, "1001");
          });
        }
      ]
    };
  }]);
  
  directives.initDirective('yieldTable', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          // $scope.$on(Event.CMDBINFOSINIT+"_shadows", function(event, args) {
          $scope.$on(Event.REPORTTREEINIT + "_yield2", function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6">><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              data: args.datalist,
              columns: args.columns,
              columnDefs: args.columnDefs,
              scrollX: true
            });
          });
        }
      ]
    };
  }]);
});