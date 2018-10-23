define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function(directives, BootstrapDialog, datatables) {
  'use strict';
  directives.initDirective('workOrderTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          $scope.$on(Event.WORKORDERINIT, function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            var state = args.state;//工单的具体类型（执行中，已完成，全部，未发布）
//          if ($scope.activeListTab == '100') {
//            args.columnDefs[args.columnDefs.length-1].width = '200px';
//          } else {
//            args.columnDefs[args.columnDefs.length-1].width = '150px';
//          }
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [[ 1, "desc" ]],
              columns: [
                {
                  "data": "devicePosition",
                  "title": "设备位置"
                }, {
                  "data": "deviceName",
                  "title": "设备名称"
                }, {
                  "data": "deviceCode",
                  "title": "设备编码"
                }, {
                  "data": "title",
                  "title": "工单名称"
                }, {
                  "data": "message",
                  "title": "来源"
                }, {
                  "data": "personLiable",
                  "title": "第一责任人"
                }, {
                  "data": "commitTime",
                  "title": "工单产生时间"
                }, 
                {
                  "data": "currentTaskStatus",
                  // "visible": $scope.activeListTab != 100,
                  "title": "工单状态"
                },
                 {
                  "data": "creatorName",
                  "title": "处理人"
                },
                {
                  "data": "overtimeStatus",
                  "title": "是否超时"
                },
                 {
                  "data": "option",
                  "title": "操作",
                  "orderable":false,
                  "width": '150px'
                }
              ],
              rowCallback: function (nRow, aData, iDataIndex) {
                // $compile(nRow)($scope);
              },
              columnDefs: args.columnDefs
            });
          });

          domMain.on('click', '#revoke', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.cancelTicket(rowData.ticketNo);
          });
          domMain.on('click', '#history', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            location.href = "#/workOrderTimeLine/"+rowData.ticketNo+"";
          });
          domMain.on('click', '#del-btn', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
               $scope.delTicket(rowData.ticketNo);
          });

          domMain.on('click', '#knowledge', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.createKnowledge(rowData);
          });


          //domMain.on('click', 'td', function (e) {
          //  e.preventDefault();
          //  var tr = $(this).closest('tr');
          //  var row = table.row(tr);
          //  var rowData = row.data();
          //  var name = $(this).text();
          //var sear = "撤销";
          //if (rowData.status == 10) {
          //  if (name == "删除") {
          //    $scope.delTicket(rowData.ticketNo);
          //  } else {
          //    $scope.addOrderShow = true;
          //    $scope.orderData = rowData;
          //    $scope.$apply();
          //  }
          //} else {
          //这个是点击工单管理的时候跳转事件，暂时不让跳任务详情页，是否可以只让看进度就行
          //if(name.indexOf(sear) == -1){
          //  location.href = "index.html#/orderdetail/" + rowData.ticketNo + "/manage" + "/"+state;
          //}
          //}
          //})
        }
      ]
    };
  }]);
  directives.initDirective('orderPublishTable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          $scope.$on(Event.WORKORDERINIT + "_order", function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              columnDefs: args.columnDefs,
              rowCallback: function (nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              }
            });

          });
          function format(d) {
            $scope.orderAddData.title = d.title;
            $scope.orderAddData.priorityCode = d.priorityCode;
            $scope.orderAddData.category = d.category;
            $scope.orderAddData.message = d.message;
            $scope.orderAddData.ticketNo = d.ticketNo;
            $scope.orderAddData.deviceId = d.deviceId;
          $scope.getOrderProcedure();
//          var allDevices =  $scope.initData.devicesAll;
//          for(var i in allDevices){
//            if(allDevices[i].id == d.deviceId){
//              $scope.orderAddData.deviceId = allDevices[i];
//              $scope.findFault();
//              break;
//            }
//          }
            $scope.orderAddData.faultId = d.faultId;
            for(var j in $scope.processType){
              if($scope.processType[j].id == d.ticketCategoryId){
                $scope.orderAddData.ticketCategoryId = $scope.processType[j].workflowId+":"+$scope.processType[j].id;
                break;
              }
            }
            var returnStr;
            returnStr = '<div class="tab-content">' +
              '<form class="form-horizontal tab-pane active full-width" >' +
              '<div class="box-body">' +
              '<div class="form-group full-width">' +
              '<label for="" class="control-label col-sm-2  pull-left padding-left-20">工单名称：</label>' +
              '<div class="col-sm-4">' +
              '<input type="text" class="form-control full-width" ng-model="orderAddData.title">' +
              '</div>' +

                  '<label for="" class="col-sm-2 control-label">紧急度：</label>' +
                  '<div class="col-sm-4">' +
                  '<select name="" id="orderPriorityCode" class="form-control full-width" ng-model="orderAddData.priorityCode" ng-options="x.value as x.name for x in priorityData">' +
                  '<option value="">请选择...</option>' +
                  '</select>' +
                  '</div>' +
                  '</div>' +

                  '<div class="form-group full-width margin-top-15">' +
                  '<label class="pull-left col-sm-2  padding-left-20 control-label" for="ds_name">工单类型：</label>' +
                  '<div class="col-sm-4">' +
                  '<select name="" id="orderCategory" ng-model="orderAddData.category" ng-change="getOrderProcedure()" ng-options="x.valueCode as x.label for x in workOrderType" class="form-control full-width"><option value="">请选择...</option></select>' +
                  '</div>' +
                  '<label class="col-sm-2 control-label" for="ds_username">工单流程：</label>' +
                  '<div class="col-sm-4">' +
                  '<select class="form-control full-width" ng-model="orderAddData.ticketCategoryId" ng-options="x.workflowId +&#39;:&#39;+ x.id  as x.name for x in processType">' +
                  '<option value="">请选择</option>' +
                  '</select>' +
                  '</div>' +
                  '</div>' +
                  '<div class="form-group full-width margin-top-15">' +
                  '<label class="pull-left col-sm-2  padding-left-20 control-label" for="ds_name">设备：</label>' +
                  '<div class="col-sm-4">' +
                  '<select class="form-control select2 full-width" ng-model="orderAddData.deviceId" selectdata="devicesAll" itemchange="findFault" select2></select>' +
                  //'<select name="" id="orderCategory" ng-model="orderAddData.deviceId" ng-change="getOrderProcedure()" ng-options="x  as x.label for x in initData.devicesAll" class="form-control full-width"><option value="">请选择...</option></select>' +
                  '</div>' +
                  '<label class="col-sm-2 control-label" for="ds_username">故障码：</label>' +
                  '<div class="col-sm-4">' +
                  '<select class="form-control full-width" ng-model="orderAddData.faultId" ng-options="x.id  as x.faultNo for x in initData.faultList">' +
                  '<option value="">请选择</option>' +
                  '</select>' +
                  '</div>' +
                  '</div>' +
                  '<div class="form-group full-width margin-top-15">' +
                  '<label for="disabledSelect"  class="pull-left col-sm-2  padding-left-20 control-label">工单内容：</label>' +
                  '<div class="col-sm-9">' +
                  '<textarea  id="discription" ng-model="orderAddData.message" class="col-md-12 form-control full-width"  style="height:100px;resize: none;" name="discription" maxlength="500"  type="text" placeholder="最多可输入500字"></textarea>' +
                  '</div>' +
                  '</div>' +

                  '<div class="form-group col-sm-12 margin-top-15">' +
                  '<div class="col-sm-12 auto-margin none-float">' +
                  '<div class="col-sm-12 align-center">' +
                  '<a id="submit-btn" class="btn btn-default btn-sm bg-write"><i ng-if="commitloading" class="fa fa-spinner fa-spin fa-fw"></i><i ng-if="!commitloading" class="fa fa-upload "></i><span class="hidden-xs ng-binding"> 发布</span></a>' +
                  '<a id="cancel-btn" class="btn btn-default btn-sm bg-write margin-left-5"><i class="fa fa-times "></i><span class="hidden-xs ng-binding"> 取消</span></a>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +

              '</div>' +
              '</div>' +
              '</form>' +
              '</div>';
            return returnStr;
          }

          domMain.on('click', '#del-btn', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.delTicket(rowData.ticketNo);
          });
          domMain.on('click', '#release-btn', function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.addWorkOrder(rowData);
          });
          domMain.on('click', '#submit-btn', function(e) {
            e.preventDefault();
            console.log("提交");
            var tr = $(this).closest('tr').parent();
            var row = table.row(tr);
            $scope.isEditing = false;
            tr.removeClass('shown');
            $scope.uploadOrder();
          });
          domMain.on('click', "#cancel-btn", function(e) {
            e.preventDefault();
            var tr = $("#newtr").closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            tr.css("display", "none");
            $scope.cancelOrderNo();
          })
        }
      ]
    };
  }]);
});