define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function(directives, BootstrapDialog, datatables) {
  'use strict';
  directives.initDirective('workFlowDom', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'EA',
      scope: true,
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on('WORKFLOW', function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            table = domMain.DataTable({
              dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args,
              order: [
                [6, "desc"]
              ],
              columns: [{
                data: "name",
                title: "名称"
              }, {
                data: "desc",
                title: "描述"
              }, {
                data: "category",
                title: "工单分类"
              }, {
                data: "workflowId",
                title: "关联流程"
              }, {
                data: "reportTemplateId",
                title: "关联报表"
              }, $.ProudSmart.datatable.optionCol2, {
                data: "createTime",
                visible: false
              }],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function (data, type, full) {
                  // 返回自定义内容
                  if ((full.isEdit == 2 || full.isEdit == 3) && type == "display")
                    return "<input style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>"
                  else
                    return escape(data);
                }
              }, {
                targets: 1,
                data: "desc",
                render: function (data, type, full) {
                  // 返回自定义内容
                  if ((full.isEdit == 2 || full.isEdit == 3) && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 2,
                data: "category",
                render: function (data, type, full) {
                  var str = '';
                  if ((full.isEdit == 2 || full.isEdit == 3) && type == "display") {
                     str = '<div class="full-width padding-right-30">' +
                      '<select id="category"   name="category" class="form-control input-sm full-width" ng-model="flowList.category"  ng-options="item.valueCode as item.label  for item in workOrderType">>' +
                      '<option value="">选择分类</option>' +
                      '</select>' +
                      '</div>';
                    return str;
                  } else {
                    for(var i in $scope.workOrderType){
                      if($scope.workOrderType[i].valueCode == data){
                        str = $scope.workOrderType[i].label;
                        break;
                      }
                    }
                    return str;
                  }
                }
              }, {
                targets: 3,
                data: "workflowId",
                orderable: false,
                render: function (data, type, full) {
                  var str = "";
                  if (full.isEdit == 3  && type == "display") {
                    str += '<div class="full-width padding-right-30">' +
                      '<select  id="flowId"   name="flowId"  class="form-control input-sm" ng-model="flowList.workflowId" ' +
                      ' ng-options="item.id as item.name + &apos;:&apos; + item.version  for item in flows" select2>' +
                      '<option  value="">选择流程</option>' +
                      '</select>' +
                      '</div>';
                  } else if(full.isEdit == 2  && type == "display"){
                      str += '<div class="full-width padding-right-30">' +
                        '<select  id="flowId"   name="flowId" disabled  class="form-control input-sm" ng-model="flowList.workflowId" ' +
                        ' ng-options="item.id as item.name + &apos;:&apos; + item.version  for item in flows">' +
                        '<option  value="">选择流程</option>' +
                        '</select>' +
                        '</div>';
                  }else {
                    if (data) {
                      if ($scope.flowListDic && $scope.flowListDic[data] != undefined) {
                        str = $scope.flowListDic[data].name + ":" + $scope.flowListDic[data].version;
                      }
                    }
                  }
                  return str;
                }
              }, {
                targets: 4,
                data: "reportTemplateId",
                orderable: false,
                render: function (data, type, full) {
                  var str = "";
                  if (full.isEdit == 3  && type == "display") {
                    str += '<div class="full-width padding-right-30">' +
                      '<select  id="reportTemplateId"   name="reportTemplateId"  class="form-control input-sm" ng-model="flowList.reportTemplateId" ' +
                      ' ng-options="item.id as item.name  for item in reportTemplates" select2>' +
                      '<option  value="">选择流程</option>' +
                      '</select>' +
                      '</div>';
                  } else if(full.isEdit == 2  && type == "display"){
                    str += '<div class="full-width padding-right-30">' +
                      '<select  id="reportTemplateId"   name="reportTemplateId" disabled  class="form-control input-sm" ng-model="flowList.reportTemplateId" ' +
                      ' ng-options="item.id as item.name   for item in reportTemplateId">' +
                      '<option  value="">选择流程</option>' +
                      '</select>' +
                      '</div>';
                  }else {
                    if (data) {
                      if ($scope.reportTemplatesDic && $scope.reportTemplatesDic[data] != undefined) {
                        str = $scope.reportTemplatesDic[data].name ;
                      }
                    }
                  }
                  return str;
                }
              }, {
                targets: 5,
                data: "option",
                render: function (data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit == 2 || full.isEdit == 3){
                    str += "<button id='save-btn'   class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                    str += "<button id='cancel-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";

                  }else{
                    if ($scope.menuitems['A02_S20']) {
                      str += "<button id='edit-btn'  ng-click='addMod("+full.id+");'  class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    }
                    if ($scope.menuitems['A03_S20']) {
                      str += "<button id='del-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    }
                  }
                   str += "</div>";
                  return str;
                }
              }],
              rowCallback: function (nRow, aData, iDataIndex) {
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
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addViews()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建关联流程</span></a>');
            $compile(parentDom)($scope);
          });
          function format(d, renovateList) {
            if (d != undefined) {
              var returnStr = "";
              returnStr += '<div class="nav-tabs-custom">';
              returnStr += '<ul class="nav nav-tabs pull-left">';
              for (var i in renovateList) {
                if (i == 0) {
                  $scope.flowList.userType = renovateList[i].userType;
                  $scope.flowList.taskId = renovateList[i].taskId;
                  $scope.tabStatus(renovateList[i].userType,$scope.handerConfsData);
                  returnStr += '<li class="active"><a data-toggle="tab"  userType="' + renovateList[i].userType + '"  taskId="' + renovateList[i].taskId + '">' + renovateList[i].taskName + '</a></li>';
                } else {
                  returnStr += '<li><a userType="' + renovateList[i].userType + '"   taskId="' + renovateList[i].taskId + '" data-toggle="tab">' + renovateList[i].taskName + '</a></li>';
                }
              }
              returnStr += '</ul>';
              returnStr += '<div class="tab-content  col-md-12">';
              returnStr += '<form  class="form-horizontal tab-pane active" role="form" >';
              returnStr += '<div class="table-responsive">';
              returnStr += '<div class="col-md-6" ng-show="flowList.userType == \'role\'">';
              returnStr += '<label class="col-sm-3 control-label">请选择用户：</label>';
              returnStr += '<div class="no-padding-lr" >';
              returnStr += '<select  id="userRole" name="userRole"  multiple="multiple"  numberdisplayed="1"  class="form-control input-sm" bootstrap-multiselect  nonselectedtext="所有用户" ng-options="item.userID as item.userName for item in flowList.roleUser"  ng-model="handerConfsData[flowList.taskId].userIdsOfRole">';
              returnStr += '</select>';
              returnStr += '<label style="color: #f56e00;" class="form-control no-border no-margin padding-left-20 light-label bg-transparent">(如果没有选用户默认所有用户)</label>';
              returnStr += '</div>';
              returnStr += '</div>';
              returnStr += '<div  class="col-md-6" ng-show="flowList.userType == \'expression\'">';
              returnStr += '<label class="col-sm-3 control-label">请输入表达式：</label>';
              returnStr += '<div class=" col-sm-9 no-padding-lr" >';
              returnStr += '<input maxlength="50" style="width: 80%;"  ng-model="handerConfsData[flowList.taskId].userExpressionOfCategory" class="form-control input-sm" type="text" >';
              returnStr += '</div>';
              returnStr += '</div>';
              returnStr += '<div  class="col-md-6" ng-show="flowList.userType == \'user\'">';
              returnStr += '<label class="col-sm-3 control-label">已分配的用户：</label>';
              returnStr += '<div class="col-sm-9 no-padding-lr" >';
              returnStr += '<input maxlength="50" style="width: 80%;"  class="form-control input-sm" type="text" ng-model="flowList.assignedUser" disabled>';
              returnStr += '</div>';
              returnStr += '</div>';
              returnStr += '<div  class="col-md-6" ng-show="flowList.userType == \'group\'">';
              returnStr += '<label class="col-sm-3 control-label">请选择用户：</label>';
              returnStr += '<div class="no-padding-lr" >';
              returnStr += '<select  id="userRole" name="userRole"  multiple="multiple"  numberdisplayed="1"  class="form-control input-sm" bootstrap-multiselect  nonselectedtext="所有用户" ng-options="item.userID as item.userName for item in flowList.groupUser "  ng-model="handerConfsData[flowList.taskId].userIdsOfRole">';
              returnStr += '</select>';
              returnStr += '<label style="color: #f56e00;" class="form-control no-border no-margin padding-left-20 light-label bg-transparent">(如果没有选用户默认所有用户)</label>';
              returnStr += '</div>';
              returnStr += '</div>';
              returnStr += '</div>';
              returnStr += '</form>';
              returnStr += '</div>';
              returnStr += '</div>';
            }
            return returnStr;
          }
          
          domMain.on('click', 'td', function (e) {
            return;
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if (rowData) {
              if ($(this).context.cellIndex == 0 ||$(this).context.cellIndex == 1 ||$(this).context.cellIndex == 2 || $(this).context.cellIndex == 4) {
                return;
              }
              if (row.child.isShown()) {
                if (row.data().isEdit != 2 && row.data().isEdit != 3 || $scope.flowList.workflowId == "" || $scope.flowList.workflowId == null) {
                  row.child.hide();
                  tr.removeClass('shown');
                }else{
                  if (row.data().isEdit == 2 || row.data().isEdit == 3) {
                    if($scope.flowList.workflowId){
                      var flowList = $scope.flowListDic[$scope.flowList.workflowId];
                      if (flowList != undefined && flowList.handerConfs) {
                        var handerList = flowList.handerConfs;
                        var renovateList = [];
                        for (var i in handerList) {
                          //if (handerList[i].userType == "role" || handerList[i].userType == "expression") {
                          renovateList.push(handerList[i]);
                          $scope.handerConfsData[handerList[i].taskId] = handerList[i];
                          //}
                        }
                        if (renovateList.length > 0) {
                          //row.child(format(row.data())).show();
                          row.child(format(row.data(), renovateList)).show();
                          $compile(tr.next())($scope);
                          $scope.initEvent();
                          tr.addClass('shown');
                        }
                      }
                    }
                  } else {
                    row.child.hide();
                    tr.removeClass('shown');
                  }
                }
              }else{
                if (row.data().isEdit == 2 || row.data().isEdit == 3) {
                  if($scope.flowList.workflowId){
                    var flowList = $scope.flowListDic[$scope.flowList.workflowId];
                    if (flowList != undefined && flowList.handerConfs) {
                      var handerList = flowList.handerConfs;
                      var renovateList = [];
                      $scope.handerConfsData = {};
                      for (var i in handerList) {
                        //if (handerList[i].userType == "role" || handerList[i].userType == "expression") {
                          renovateList.push(handerList[i]);
                          $scope.handerConfsData[handerList[i].taskId] = handerList[i];
                        //}
                      }
                      if (renovateList.length > 0) {
                        //row.child(format(row.data())).show();
                        row.child(format(row.data(), renovateList)).show();
                        $compile(tr.next())($scope);
                        $scope.initEvent();
                        tr.addClass('shown');
                      }
                    }
                  }
                } else {
                  row.child.hide();
                  tr.removeClass('shown');
                }
              }
            }
          });
          domMain.on('click', '#view-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var viewInfo = row.data();
            location.href = "../app-flowsheet/index.html#/displayView/" + viewInfo.id
          });
          domMain.on('click', '#design-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.sx();
          });
          domMain.on('click', '#copy-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.doAction("view-copy", rowData);
          });
          domMain.on('click', '#edit-btn', function (e) {
            e.preventDefault();
            if (isEditing) {
              growl.warning("当前有为保存的数据，请先保存",{});
              return;
            }
            isEditing = true;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            row.data().isEdit = 2;
            $scope.flowList.category = row.data().category;
            $scope.flowList.workflowId = row.data().workflowId;
            $scope.handerConfsData = {};
            if (rowData != undefined && rowData.handerConfs) {
              var handerList = rowData.handerConfs;
              var renovateList = [];
              for (var i in handerList) {
                  renovateList.push(handerList[i]);
                  $scope.handerConfsData[handerList[i].taskId] = handerList[i];
              }
              if (renovateList.length > 0) {
                row.child(format(row.data(), renovateList)).show();
                $scope.initEvent();
              }
            }
            row.invalidate();
            $compile(tr)($scope);
            $compile(tr.next())($scope);
          });
          domMain.on('click', '#save-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if (rowData.isEdit == 2 || rowData.isEdit == 3) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function (i, val) {
                var jqob = $(val);
                if (i == 0) {
                  if (jqob.children("input").length > 0) {
                    var txt = jqob.children("input").val();
                    if (!txt) {
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
            };

            if (checkPass) {
              if ($scope.flowList.category == '' || $scope.flowList.category == null) {
              growl.warning("请选择工单分类", {});
              checkPass = false;
              return
            };
              if ($scope.flowList.workflowId == '' || $scope.flowList.workflowId == null) {
                growl.warning("请选择关联流程", {});
                checkPass = false;
                return
              };
              row.data()["reportTemplateId"] = $scope.flowList.reportTemplateId;
              row.data()["workflowId"] = $scope.flowList.workflowId;
              row.data()["category"] = $scope.flowList.category;
              isEditing = false;
              $scope.doAction("view-save", rowData, function (flg) {
                if (flg) {
                  isEditing = false;
                  row.data().isEdit = 0;
                  row.cells().invalidate();
                }
              });
            }
          });
          domMain.on('click', '#cancel-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            isEditing = false;
            $scope.doAction("cancel", rowData);
          });
          domMain.on('click', '#del-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("attr-delete", rowData, function (flg) {
              if (flg)
                row.remove().draw(false);
            });
          });
          domMain.on('click', '#release-btn', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("release", rowData);
          });
//        $('#flowId').change(function(){ 
          domMain.on('change', '#flowId', function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var flowList = $scope.flowListDic[$scope.flowList.workflowId];
            if (flowList != undefined && flowList.handerConfs) {
              var handerList = flowList.handerConfs;
              var renovateList = [];
              for (var i in handerList) {
                renovateList.push(handerList[i]);
                $scope.handerConfsData[handerList[i].taskId] = handerList[i];
              }
              if (renovateList.length > 0) {
                row.child(format(row.data(), renovateList)).show();
                $compile(tr.next())($scope);
                $scope.initEvent();
              }
            }
          });
        }
      ]
    };
  }]);
})
