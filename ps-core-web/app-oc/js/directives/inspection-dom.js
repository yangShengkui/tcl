define(['directives/directives', 'datatables.buttons.html5', 'bootstrap-daterangepicker','jszip'],
  function(directives, datatables, daterangepicker,jszip) {
    'use strict';
    directives.initDirective('inspectionRecordsTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;

            $scope.$on(Event.INSPECTIONRECORDS, function(event, args) {
              if(table) {
                table.destroy();
              }

              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.option[0],
                order: [
                  [0, "asc"]
                ],
                columns: [{
                  data: "teamName",
                  title: "巡检班组"
                }, {
                  data: "userName",
                  title: "巡检人"
                }, {
                  data: "inspectionDate",
                  title: "巡检日期"
                }, {
                  data: "deviceName",
                  title: "设备名称"
                }, {
                  data: "deviceStatus",
                  title: "设备状态"
                }, {
                  data: "inspectionContext",
                  title: "巡检内容"
                }, {
                  data: "imageUrl",
                  title: "图片"
                }],
                columnDefs: [{
                  targets: 2,
                  data: "inspectionDate",
                  render: function(data, type, full) {
                    // 返回自定义内容    
                    var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                    return str;
                  }
                }]
                // , {
                //   targets: 6,
                //   data: "imageUrl",
                //   render: function(data, type, full) {
                //     // 返回自定义内容   
                //     var str = '<a target="blank" href= "' + $.trim((data)) + '" ><img style="width:70px;height:70px;" src = "' + $.trim((data)) + '" alt=""/>';
                //     return str;

                //   }
                // }

              });

              function format(d) {
                var returnStr;
                returnStr = '<table width="100%" class="table table-inner">';
                for(var i in d) {
                  returnStr += '<tr role="row">';
                  if(i == 'imageUrl') {
                    returnStr += '<td style="width:19%;">图片:</td>';
                    returnStr += '<td><div style="width: 90%;height:auto;">';
                    $.each(d.imageUrl, function(key, value) {
                      returnStr += '<a target="blank" href= "http://192.168.1.114' + $.trim((value)) + '" ><img style="width:70px;height:70px; margin-right:5px;" src = "' + $.trim((value)) + '" alt=""/>';
                    })
                    returnStr += '</div></td>';
                  }
                  returnStr += '</tr>';
                }
                returnStr += '</table>';
              }
              domMain.on('init.dt', function() {
                var parentDom = $(".special-btn").parent();
                $compile(parentDom)($scope);
              });
              domMain.on('click', 'td', function(e) {
                e.preventDefault();
                var tr = $(this).closest('tr');
                var row = table.row(tr);
                var rowData = row.data();
                if(rowData) {
                  if(row.child.isShown()) { //之前展开
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                  } else { //之前关闭，则需要展开
                    // Open this row
                    row.child.show();
                    // row.child(format(rowData)).show();
                  }
                }
              });

            });
          }
        ]
      };
    }]);

    directives.initDirective('inspectionStandardTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            var itemAttrs;
            $scope.$on(Event.INSPECTIONSTANDARD, function(event, args) {
              if(table) {
                table.destroy();
              }
              // isEditing = false;
              // itemAttrs = args.option[1];
              table = domMain.DataTable({
                dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.option[0],
                order: [
                  [0, "asc"]
                ],
                columns: [{
                  data: "modelId",
                  title: "设备模板"
                }, {
                  data: "spotCheckCategory",
                  title: "维保类型"
                }, {
                  data: "item",
                  title: "项目名称",
                  visible: $scope.baseConfig.projectConfig.display
                }, {
                  data: "serialNum",
                  title: "序号"
                }, {
                  data: "spotCheckMethod",
                  title: "方法"
                }, {
                  data: "spotCheckTool",
                  title: "工具"
                }, $.ProudSmart.datatable.optionCol2],
                columnDefs: [{
                  targets: 0,
                  data: "modelId",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    var str = "";
                    var allModelsList = $scope.allModels;
                    for(var i in allModelsList) {
                      if(allModelsList[i].id == data) {
                        str = allModelsList[i].label;
                        break;
                      }
                    }
                    return str;
                  }
                }, {
                  targets: 6,
                  data: "option",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group btn-group-sm'>";
                    if ($scope.menuitems['A02_S49']) {
                      str += "<button id='update-btn'   class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    }
                    if ($scope.menuitems['A03_S49']) {
                      str += "<button id='delete-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    }
                    return str;
                  }
                }],
                rowCallback: function(nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                }
              });
            });

            /**
             * 监听表格初始化后，添加按钮
             */

            domMain.on('click', 'td', function(e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              var name = $(this).text();
            });

            domMain.on('click', '#update-btn', function(e) {
              e.stopPropagation();
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();

              $scope.updateParam = {
                "item": rowData.item,
                "standardContext": rowData.standardContext,
                "spotCheckMethod": rowData.spotCheckMethod,
                "spotCheckTool": rowData.spotCheckTool,
                "spotCheckCategory": rowData.spotCheckCategory,
                "position": rowData.position,
                "modelId": rowData.modelId,
                "serialNum": rowData.serialNum,
                "id": rowData.id,
                "domainPath": rowData.damainPath
              };
              $scope.addInspection(rowData);
              /* var innerString =
                 '<div class="tab-content">' +
                 '<form role="form" class="form-horizontal tab-pane active" name="myForm" style="font-size: 14px">' +
                 '<div class="box-body">' +
                 '<div class="form-group col-sm-12">' +
                 '<div class="col-sm-4">' +

                 '<label><span class="text-danger">*</span>巡检项目：</label>' +
                 '<input autocomplete="off" class="form-control" type="text" style="width: 100%;" ng-model="updateParam.item" value="{{updateParam.item}}" />' +

                 '</div>' +
                 '<div class="col-sm-4">' +

                 '<label><span class="text-danger">*</span>巡检部位：</label>' +
                 '<input autocomplete="off" class="form-control" type="text" style="width: 100%;" ng-model="updateParam.position" value="{{updateParam.position}}" />' +

                 '</div>' +
                 '<div class="col-sm-4">' +

                 '<label><span class="text-danger">*</span>设备模板：</label>' +
                 '<select id="selectedAlertType" class="form-control" style="width: 100%;" ng-model="updateParam.modelId" ng-options="value.id as value.label for value in allModels">' +
                 '<option value="">请选择...</option>' +
                 '</select>' +
                 '</div>' +

                 '</div>' +
                 '<div class="form-group col-sm-12 margin-top-15">' +
                 '<div class="col-sm-4">' +

                 '<label><span class="text-danger">*</span>点检方法：</label>' +
                 '<input autocomplete="off" class="form-control" type="text" style="width: 100%;" ng-model="updateParam.spotCheckMethod" value="{{updateParam.spotCheckMethod}}" />' +

                 '</div>' +
                 '<div class="col-sm-4">' +

                 '<label><span class="text-danger">*</span>点检工具：</label>' +
                 '<input autocomplete="off" class="form-control" type="text" style="width: 100%;" ng-model="updateParam.spotCheckTool" value="{{updateParam.spotCheckTool}}" />' +

                 '</div>' +
                 '<div class="col-sm-4">' +

                 '<label><span class="text-danger">*</span>点检类别：</label>' +
                 '<input autocomplete="off" class="form-control" type="text" style="width: 100%;" ng-model="updateParam.spotCheckCategory" value="{{updateParam.spotCheckCategory}}" />' +

                 '</div>' +
                 ' </div>' +
                 '<div class="form-group col-sm-12 margin-top-15">' +
                 '<label class="col-sm-4"><span class="text-danger">*</span>巡检内容：</label>' +
                 '<div class="col-sm-12">' +
                 '<textarea id="discription" class="form-control" style="width: 100%; height: 100px; resize: none;" ng-model="updateParam.standardContext" value="{{updateParam.standardContext}} class="form-control ng-pristine ng-valid ng-empty ng-valid-maxlength ng-touched" style="height: 100px; resize: none;" name="discription" maxlength="500" type="text" placeholder="最多可输入500字"></textarea>' +

                 '</div>' +
                 '</div>' +
                 '<div class="form-group col-sm-12 margin-top-15">' +

                 '<div class="align-center">' +
                 '<a id="save-btn" style="margin-right: 15px;" class="btn btn-default btn-sm">' +
                 '<i ng-if="!saveloading" class="fa fa-save"></i>' +
                 '<i ng-if="saveloading" class="fa fa-spinner fa-spin fa-fw"></i>' +
                 '<span class="hidden-xs ng-binding"> 保存</span></a>' +
                 '<a id="cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close"></i><span class="hidden-xs ng-binding"> 取消</span></a>' +
                 '</div>' +

                 '</div>' +
                 '</div>' +
                 '</form>' +

                 '</div>';*/

              /*row.child(innerString).show();
              tr.addClass('shown');
              tr.next().addClass('bg-f5f5f5');
              $compile(tr)($scope);
              $compile(tr.next())($scope);
              $scope.doAction('update', row.data());*/
            });
            domMain.on('click', '#delete-btn', function(e) {
              e.stopPropagation();
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.doAction('delete', row.data());
            });
            domMain.on('click', '#save-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              tr.removeClass('shown');
              console.log(row.data());
              $scope.doAction('save-btn', row.data());
            });
            domMain.on('click', "#cancel-btn", function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              tr.css("display", "none");
              $scope.doAction('cancel-btn', row.data());
            });

          }
        ]
      };
    }]);

    directives.initDirective('deviceDataTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            window.JSZip = jszip;
            $scope.$on(Event.DEVICEDATAINIT, function(event, args) {
              if(table) {
                table.destroy();
                domMain.empty();
              }

              table = domMain.DataTable({
                dom: args.option[0] && args.option[0].length > 0 ? '<"row"<"col-sm-6 margin-bottom-10">>' + $.ProudSmart.datatable.footerdom : '', //'<"pull-right margin-bottom-10" B >'
                columnDefs: [{
                  targets: 3,
                  data: "arisingTime",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                    return str;
                  }
                }],
                language: $.ProudSmart.datatable.language,
                data: args.option[0],
                order: [
                  [3, "desc"]
                ],
                columns: [{
                  data: "deviceName",
                  title: "名称"
                }, {
                  data: "instance",
                  title: "实例"
                }, {
                  data: "kpiName",
                  title: "测点名称"
                }, {
                  data: "arisingTime",
                  title: "上报时间"
                }, {
                  data: "kpiValue",
                  orderable: false,
                  title: "指标值"
                }]
              });
              if(args.option[0] && args.option[0].length > 0) {
                new $.fn.dataTable.Buttons(table, {
                  buttons: [
                    {
                      extend: 'excel',
                      title:$scope.selectedItem.modelId?$scope.rootModelDic[$scope.selectedItem.modelId].label:'查询结果',
                      text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>'
                    }
                  ]
                });
                table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
              }

              /**
               * 监听表格初始化后，添加按钮
               */

              domMain.on('click', 'td', function(e) {
                var tr = $(this).closest('tr');
                var row = table.row(tr);
                var rowData = row.data();
                var name = $(this).text();
              });

              domMain.on('click', "#cancel-btn", function(e) {
                e.preventDefault();
                var tr = $(this).closest('tr');
                var row = table.row(tr);
                var rowData = row.data();
                tr.css("display", "none");
                $scope.doAction('cancel-btn', row.data());
              });
              $(".buttons-excel").on("click",function (e) {
                growl.info("数据正在导出中，请稍后……",{})
              });
            });
          }
        ]
      };
    }]);
  });