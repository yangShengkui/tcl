define(['directives/directives','datatables.net','datatables.net-bs'], function(directives,datatables) {
  'use strict';
  directives.initDirective('userGroupTable', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.USERGROUPINIT, function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              "order": [[0, "desc"]],
              columns: [{
                title: "用户名称",
                data: "userName"
              }, {
                title: "手机/邮箱",
                data: "userEmail"
              }, {
                title: "办公电话",
                data: "officePhone"
              }, {
                title: "操作",
                orderable:false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "userName",
                "render": function(data, type, full) {
                  //返回自定义名字
                  if (full.isEdit == 2 && type == "display") {
                    var str = '<select id="userDomainName" name="userName" class="combobox form-control input-sm">' +
                        '<option value="">请选择用户</option>';
                    var argData = args.data;
                    var enterpriseData = $scope.enterpriseUser;

                    for (var i = 0; i < enterpriseData.length; i++) {
                      var index = -1;
                      for (var j = 0; j < argData.length; ++j) {
                        if (argData[j].userID == enterpriseData[i].userID) {
                          index = j;
                        }
                      }
                      if (index == -1) {
                        str += '<option value="' + enterpriseData[i].userID + '">' + enterpriseData[i].userName + '</option>';
                      }
                    }
                    str += '</select>';
                    return str;
                  } else {
                    return data;
                  }
                }
              }, {
                "targets": 3,
                "data": "option",
                "render": function (data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  if (full.isEdit == 2) {
                    str += "<a id='save-btn'  class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 保存</span></a>"
                    str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                  } else {
                    str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 移出</span></a>"
                  }
                  str += "</div>"
                  return str;
                }
              }]
            });
          });

          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addGroupUser()"  ng-disabled="!selectedGroup" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加用户组用户</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', 'td', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();

            if (rowData) {
              if (($(this).context.cellIndex == 4 && rowData.isEdit == 0)) {
                return;
              }
              if (rowData.isEdit == 1) {
              }
            }
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var selectRow = table.row('.shown');
            var selVal = $("#userDomainName").val();
            $scope.doAction('saveUser', selVal);
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var selectRow = table.row('.shown');

            $scope.doAction('cancel');
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('removeUser', row.data());
          });

          domMain.on('click', '#changeDomain-btn', function(e) {
            e.preventDefault();
            isEditing = false;
            if (!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');

              var row = table.row(tr);

              row.data().isEdit = 1;
            }
          });

          domMain.on('click', '#removeDomain-btn', function(e) {
            //e.preventDefault();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var selectRow = table.row('.shown');

            $scope.doAction('removeDomain', row.data());
          })

        }
      ]
    }
  }])
});