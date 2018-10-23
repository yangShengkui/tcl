define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function (directives, BootstrapDialog, datatables) {
    /**
     * 表格指令
     */
    directives.initDirective('workOrderRecord', ['$timeout', '$compile', 'growl','ngDialog', 'ticketTaskService', function ($timeout, $compile, growl,ngDialog, ticketTaskService) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            // 获取表格元素
            var domMain = $element;
            var table;
            var state = "";

            // 表格选择行数
            $scope.selectedCount = 0;

            $scope.$on(Event.WORKORDERRECORDINIT, function (event, args) {
              if (table) {
                table.destroy();
                domMain.empty();
              }
              state = args.state;
              // 添加check选择
              args.columns.unshift($.ProudSmart.datatable.selectCol);
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                select: $.ProudSmart.datatable.select,
                data: args.data,
                columns: args.columns,
                // "order": [6, "desc"],
                columnDefs: args.columnDefs,
                rowCallback: function (nRow, aData, iDataIndex) {
                  if (aData.selected) {
                    $(nRow).addClass("selected")
                  } else {
                    $(nRow).removeClass("selected")
                  }
                  $compile(nRow)($scope);
                }
              });
            });

            // 单选事件
            domMain.on('change', '.itemCheckBox', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var abledIndex = 0;
              var unabledIndex = 0;
              var tableRows = table.rows({
                selected: true
              });
              if (e.target.checked) {
                row.data().selected = true;
                $scope.selectedCount++;
              } else {
                row.data().selected = false;
                $scope.selectedCount--;
              }
              if (tableRows.count() != table.rows()[0].length) {
                $('#allselect-btn').attr('checked', false)
                $('#allselect-btn').prop('checked', false);
              } else if (tableRows.count() == table.rows()[0].length) {
                $('#allselect-btn').attr('checked', true)
                $('#allselect-btn').prop('checked', true);
              }
              $scope.$apply();
            });
            // 全选事件
            domMain.on('change', '#allselect-btn', function (e) {
              e.stopPropagation();
              var abledIndex = 0;
              var unabledIndex = 0;
              if (e.target.checked) {
                table.rows().select();
                var tableRows = table.rows({
                  selected: true
                });
                for (var i = 0; i < tableRows.nodes().length; i++) {
                  var row = table.row(tableRows.nodes()[i]);
                  row.data().selected = true;
                  if (row.data().enabled) { //启用
                    abledIndex++;
                  } else { //停用
                    unabledIndex++;
                  }
                };
                if (abledIndex == tableRows.count()) {
                  $scope.unabled = true;
                  $scope.selectedCount = 0;
                } else if (unabledIndex == tableRows.count()) {
                  $scope.abled = true;
                } else {
                  $scope.unabled = true;
                  $scope.abled = true;
                  $scope.selectedCount = 0;
                }
                table.rows().invalidate().draw(false);
                $scope.$apply();

              } else {
                var tableRows = table.rows({
                  selected: true
                });
                for (var i = 0; i < tableRows.nodes().length; i++) {
                  var row = table.row(tableRows.nodes()[i]);
                  row.data().selected = false;
                };
                table.rows().deselect();
                table.rows().invalidate().draw(false);
                $scope.abled = false;
                $scope.unabled = false;
                $scope.selectedCount = 0;
                $scope.$apply();

              }
            });

            domMain.on('click', '#process', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();
              // location.href = "../app-flowsheet/index.html#/processView/" + dataList.id
              location.href = "#/workOrderTimeLine/" + dataList.ticketNo + "";
            });
            domMain.on('click', '#history', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();

            });

            // 录入实绩
            // domMain.on('click', '#add-form-edit', function (e) {
            //   e.stopPropagation();
            //   e.preventDefault();
            //   var tr = $(this).closest('tr');
            //   var row = table.row(tr);
            //   var rowData = row.data();

            //   // $scope.updateParam = {
            //   //   "item": rowData.item,
            //   //   "standardContext": rowData.standardContext,
            //   //   "spotCheckMethod": rowData.spotCheckMethod,
            //   //   "spotCheckTool": rowData.spotCheckTool,
            //   //   "spotCheckCategory": rowData.spotCheckCategory,
            //   //   "position": rowData.position,
            //   //   "modelId": rowData.modelId,
            //   //   "serialNum": rowData.serialNum,
            //   //   "id": rowData.id,
            //   //   "domainPath": rowData.damainPath
            //   // };
            //   $scope.EntryForm(rowData);
            // });
            // 接单
            domMain.on('click', '#execute', function (e) {
              debugger
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();
              var name = $(this).text();
              if (($scope.menuitems['A03_S08'] || $scope.menuitems['A02_S09'])) {
                $scope.herfList(name, dataList, '');
              }
            });

            /**
             * 接单
             */
            domMain.on('click', '#receipt', function(){
              debugger
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              console.log("接单", rowData);
              
              // 判断是否逾期, 逾期无法接单
              var receiptData = rowData;
              receiptData.taskStatus = 200;
              receiptData.values= {
                chose: "接单",
                reason: "",
                remark: "",
              }
              ticketTaskService.doTask(receiptData, function (returnObj) {
                if (returnObj.code == 0) {
                  growl.success("接单成功", {});
                  $scope.closeDialog();
                  // 获取已激活的标签页的名称
                  var state = null;
                  if ($scope.activeListTab == 'tab1') {
                    state = 10;
                  } else if ($scope.activeListTab == 'tab2') {
                    state = 100;
                  } else if ($scope.activeListTab == 'tab3') {
                    state = 200;
                  }
                  $scope.getRecordData(state);
                } else {                
                  growl.warning("接单失败", {});
                }
              })

            })

            /**
             * 单条任务关闭
             */
            domMain.on('click', '#taskClose', function(e) {
              // 判断状态是不是逾期

              // 取得ID
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              console.log("任务关闭", rowData);
              
              var selectArr = JSON.parse(rowData.attributeDefinitions[1].selectValue);
              
              rowData.values = {
                chose: "任务关闭",
                reason: "",
                remark: ""
              }
              $scope.taskCloseData = {
                dropDownList: selectArr,
                selectData: rowData,           // 关闭任务原因备注
              }
              ngDialog.open({
                template: '../partials/dialogue/task_close_dialog.html', // 点检
                scope: $scope,
                className: 'ngdialog-theme-close'
              });

            })  

            // 维修完工
            domMain.on('click', "#repairSuccess", function(e){
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              var ajaxData = rowData;
              ajaxData.taskStatus = 200;
              ajaxData.values = {};
              ajaxData.values[rowData.attributeDefinitions[0].label] = '维修完工';
              ticketTaskService.doTask(ajaxData, function (returnObj) {
                if (returnObj.code == 0) {
                  growl.success("处理成功", {});
                  $scope.closeDialog();
                  // 获取已激活的标签页的名称
                  var state = null;
                  if ($scope.activeListTab == 'tab1') {
                    state = 10;
                  } else if ($scope.activeListTab == 'tab2') {
                    state = 100;
                  } else if ($scope.activeListTab == 'tab3') {
                    state = 200;
                  }
                  $scope.getRecordData(state);
                } else {                
                  growl.warning("处理失败", {});
                }
              })
            })

            // 快速处理完工
            domMain.on('click', '#quickSuccess', function(e) {
              // 判断状态是不是逾期

              // 取得ID
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();

              var ajaxData = rowData;
              ajaxData.taskStatus = 200;
              ajaxData.values = {};
              ajaxData.values[rowData.attributeDefinitions[0].label] = '快速处理完工';
              ticketTaskService.doTask(ajaxData, function (returnObj) {
                if (returnObj.code == 0) {
                  growl.success("处理成功", {});
                  $scope.closeDialog();
                  // 获取已激活的标签页的名称
                  var state = null;
                  if ($scope.activeListTab == 'tab1') {
                    state = 10;
                  } else if ($scope.activeListTab == 'tab2') {
                    state = 100;
                  } else if ($scope.activeListTab == 'tab3') {
                    state = 200;
                  }
                  $scope.getRecordData(state);
                } else {                
                  growl.warning("处理失败", {});
                }
              })
              console.log(ajaxData);
            }) 

            // 录入实绩
            domMain.on('click', '#RecordPerformance', function(e) {
              // 判断状态是不是逾期
              console.log("进入");
              // 取得ID
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              if(rowData.variables.startDate){
                var strDate = newDateJson(rowData.variables.startDate).Format(GetDateCategoryStrByLabel());
                rowData.variables.startDate = strDate.split(' ')[0];
              }
              if($(this).attr("recordtype")) {
                $scope.EntryForm($(this).attr("recordtype"), rowData);
              }

            }) 
            /**
             * 获得选中得数据
             */
            $scope.getSelectData = function () {
              var tableRows = table.rows({
                selected: true
              });
              var selectedCount = tableRows.count();
              var nodes = tableRows.nodes();
              if (selectedCount == 0) {
                growl.warning("当前没有选中", {});
                return;
              }
              var successCount = 0; // 成功得数量
              var errorCount = 0;   // 失败得数量
              var selectIdsArr = [];// id数组
              var ifGo = false;     // 
              // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
              for (var i = 0; i < nodes.length; i++) {
                var row = table.row(nodes[i]);
                var rowData = row.data();
                if (rowData.id > 0 && !rowData.enabled) {
                  selectIdsArr.push(rowData);
                  successCount++;
                } else {
                  errorCount++;
                }
                if (selectedCount == (successCount + errorCount)) {
                  ifGo = true;
                  // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
                }
              };
              return selectIdsArr;
            }

            

            /**
             * 临时维修on监听
             */
            $scope.$on(Event.WORKORDERRECORDINIT + "_temporaryRepair", function (event, args) {
              var data = $scope.getSelectData();
              console.log(data);
            })

            /*   domMain.on('click', 'td', function(e) {
                 e.preventDefault();
                 var name = $(this).text();
                 var tr = $(this).closest('tr');
                 var row = table.row(tr);
                 var dataList = row.data();
                 var sear='执行历史';
                  if(($scope.menuitems['A03_S08'] || $scope.menuitems['A02_S09']) && name.indexOf(sear) == -1){
                   $scope.herfList(name, dataList, state);
                  }
               });*/
          }
        ]
      }
    }]);

    directives.initDirective('historyTable', ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            // $scope.$on(Event.CMDBINFOSINIT+"_shadows", function(event, args) {
            $scope.$on(Event.WORKORDERRECORDINIT + "_history", function (event, args) {
              if (table) {
                table.destroy();
              }
              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.data,
                columns: args.columns,
                columnDefs: args.columnDefs
              });
            });
          }
        ]
      };
    }]);

    directives.initDirective('partTable', ['$compile', function ($compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var type = $attrs.type;
          var table;
          $scope.$on("WorkOrderSelectPart", function (event, args) {
            if ($attrs.name && $attrs.name == args.name) {
              initTable(args);
            }
          });

          function initTable(args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            var name = args.name;
            var option = {
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data
            };
            switch (name) {
              case 'page':
                option.columns = [{
                  title: "配件名称",
                  data: "label",
                  orderable: false
                }, {
                  title: "配件编码",
                  data: "code",
                  orderable: false
                }, {
                  title: "数量",
                  data: "count",
                  orderable: false
                }];
                if (type != 'order') {
                  option.columns.push({
                    title: "操作",
                    data: "operate",
                    orderable: false
                  });
                }
                option.columnDefs = [{
                  "targets": 0,
                  "data": "label"
                }, {
                  "targets": 1,
                  "data": "code"
                }, {
                  "targets": 2,
                  "data": "count"
                }];
                if (type != 'order') {
                  option.columnDefs.push({
                    "targets": 3,
                    "data": "operate",
                    render: function () {
                      var str = '<div class="btn-group">';
                      str += '<button id="del-btn" type="button" class="btn btn-default btn-sm" ' + (!$scope.myObj.ticketStatus || $scope.detail.taskStatus == 200 ? ' disabled ' : '') + '>' +
                        '<i class="fa fa-times hidden-lg hidden-md hidden-sm"></i>' +
                        '<span class="hidden-xs"> 删除</span></a>';
                      str += '</div>';
                      return str;
                    }
                  });
                }
                break;
              case 'dialog':
                option.order = [[1, "asc"]];
                option.columns = [{
                  title: "配件名称",
                  data: "label"
                }, {
                  title: "配件编码",
                  data: "code"
                }, {
                  title: "库存数量",
                  data: "inventory"
                }, {
                  title: "数量",
                  data: "count"
                }];
                option.columnDefs = [{
                  "targets": 0,
                  "data": "label"
                }, {
                  "targets": 1,
                  "data": "code"
                }, {
                  "targets": 2,
                  "data": "inventory"
                }, {
                  "targets": 3,
                  "data": "count",
                  render: function (value) {
                    var str = '<input type="text" value="' + (value || 0) + '" />';
                    return str;
                  }
                }];
                break;
            }
            table = domMain.DataTable(option);
          }

          domMain.on('change', 'input', function (e) {
            e.stopPropagation();
            var $input = $(this);
            var tr = $input.closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.partList.forEach(function (item) {
              if (item.id == rowData.id && item.code == rowData.code) {
                item.count = $input.val();
              }
            });
            $scope.$apply();
          });

          /*domMain.on('click', 'tr', function (e) {
            var $tr = $(this);
            if ($tr.find('th').length > 0) {
              return;
            }
            var tableRows = table.rows();
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              var $row = $(tableRows.nodes()[i]);
              $row.removeClass("selected");
              row.data().selected = false;
              if ($row[0] === $tr[0]) {
                $row.addClass("selected");
                row.data().selected = true;
              }
              $scope.$apply()
            }

          });*/

          domMain.on('click', '#del-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.deleteSelectPart(rowData, function () {
              row.remove().draw();
            });
          });

        }]
      };
    }]);

    directives.initDirective('faultKnowledgeTable', ['$timeout', '$compile', '$filter', function ($timeout, $compile, $filter) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;

          $scope.$on(Event.FAULTKNOWLEDGEINIT, function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }

            $scope.selectedFaultKnowledge = null;

            table = domMain.DataTable({
              dom: args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [
                [0, "asc"]
              ],
              columns: [{
                data: "faultNo",
                title: "故障编号"
              }, {
                data: "label",
                title: "故障名称"
              }, {
                data: "category",
                title: "故障类别"
              }, {
                data: "desc",
                title: "关联设备"
              }],
              columnDefs: [{
                targets: 0,
                data: "faultNo"
              }, {
                targets: 1,
                data: "label"
              }, {
                targets: 2,
                data: "category"
              }, {
                targets: 3,
                data: "desc"
              }]
            });
          });

          function format(d) {
            var returnStr;
            returnStr = '<table width="100%" class="table table-inner">';
            for (var i in d) {
              returnStr += '<tr role="row">';
              if (i == 'phenomenon') {
                returnStr += '<td style="width:19%;">故障现象:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.phenomenon + '</div></td>';
              } else if (i == 'cause') {
                returnStr += '<td style="width:19%;">产生原因:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.cause + '</div></td>';
              } else if (i == 'processingMethod') {
                returnStr += '<td style="width:19%;">处理方法:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.processingMethod + '</div></td>';
              }
              returnStr += '</tr>';
            }
            returnStr += '</table>';
            return returnStr;
          }

          domMain.on('click', 'td', function (e) {
            e.preventDefault();
            var checkbox = $(this).find('input[type=checkbox]');
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            var tableData = table.data();
            var trs = tableData.rows().nodes();

            for (var i = 0; i < tableData.length; i++) {
              tableData[i].selected = false;
            }
            for (var i = 0; i < trs.length; i++) {
              $(trs[i]).removeClass('selected');
            }
            rowData.selected = true;
            tr.addClass('selected');

            $scope.$apply(function () {
              $scope.selectedFaultKnowledge = rowData;
            });

            if (rowData) {
              if (row.child.isShown()) { //之前展开
                row.child.hide();
                tr.removeClass('shown');
              } else { //之前关闭，则需要展开
                // Open this row
                var data = row.data();
                row.child(format(rowData)).show();
                tr.addClass('shown');
              }
            }
          });
        }]
      }
    }])

    // 处理任务---关联备件
    directives.initDirective('majorDeviceTable', ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;

            $scope.$on(Event.WORKORDERRECORDINIT + "_deviceTask", function (event, args) {
              if (table) {
                table.destroy();
              }

              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.data,
                rowCallback: function (nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                },
                columns: [{
                  title: "备件编号",
                  data: "name",
                  orderable: false
                }, {
                  title: "备件名称",
                  data: "label",
                  orderable: false
                }, {
                  title: "数量",
                  data: "stockNumber",
                  orderable: false
                }, {
                  title: "操作",
                  visible: $scope.detail.taskStatus != 200,
                  data: "option",
                  orderable: false
                }],
                columnDefs: [{
                  "targets": 0,
                  "data": "name",
                  "render": function (data, type, full) {
                    // 返回自定义内容
                    var str = "";
                    if (full.isEdit == 3 && type == "display") {
                      str += '<select id="allSpare" name="allSpare" class="combobox form-control input-sm" ng-model="definitions.selectList" ng-change="saveAttachment(definitions.selectList);" ng-options="pro as pro.name for  pro in selectList.allSpareParts">';
                      str += '<option value="">请选择...</option>';
                      str += '</select>';
                    } else {
                      str = "<a href='#sparepartInfo/" + full.id + "'>" + data + "</a>";
                    }
                    return str;
                  }
                }, {
                  "targets": 1,
                  "data": "label",
                  "render": function (data, type, full) {
                    return data;
                  }
                }, {
                  "targets": 2,
                  "data": "stockNumber",
                  "render": function (data, type, full) {
                    if (full.isEdit > 0 && type == "display") {
                      return data;
                    } else {
                      if ($scope.detail.taskStatus != 200) {
                        if ($scope.sparePartsArray[full.id] != undefined) {
                          return "<input class='form-control col-xs-6'  name='" + full.id + "' id='stockName'  type='text'  maxlength='20'  value='" + full.editNumber + "'  style='border: 1px solid #F18282;width: 100%;' placeholder='当前库存数量：" + $scope.sparePartsArray[full.id].stockNumber + "'>";
                        } else {
                          return "<input class='form-control col-xs-6'  name='" + full.id + "' id='stockName' type='text'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' placeholder='当前库存数量：" + data + "'>";
                        }
                      } else {
                        return data;
                      }
                    }
                  }
                }, {
                  "targets": 3,
                  "data": "option",
                  "render": function (data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group ' >";
                    //if (full.isEdit == 3) {
                    //  str += "<a id='save-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    //  str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                    //} else {
                    if ($scope.detail.taskStatus != 200 && full.isEdit != 3) {
                      str += "<a id='del-btn' ng-show='detail.taskStatus != 200' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                    }
                    //}
                    str += "</div>";
                    return str;
                  }
                }]
              });
            });
            ///**
            // * 监听表格初始化后，添加按钮
            // */
            //domMain.on('init.dt', function () {
            //  var parentDom = $(".special-btn").parent();
            //  parentDom.html('<a ng-click="addAttachment()" ng-show="detail.taskStatus != 200 && selectList.ticketStatus != false " class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 选择备件</span></a>');
            //  $compile(parentDom)($scope);
            //});
            /**
             * 监听表格初始化后，添加按钮
             */
            domMain.on('init.dt', function () {
              /*  var parentDom = $(".special-btn").parent();
                //          parentDom.html('<a ng-click="addFault()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加故障</span></a>');
                if($scope.detail.taskStatus != 200 && $scope.selectList.ticketStatus != false ){
                  parentDom.html('<select class="form-control" style="min-width:200px" selectdata="allSpareParts" itemchange="saveAttachment" select2></select>');
                }
                $compile(parentDom)($scope);*/
            });
            domMain.on('click', '#save-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              var divs2 = $scope.selectList.allSpareParts;

              var put = $("#allSpare option:selected").val();
              if (put == "" && put == null) {
                return;
              } else {
                for (var i in divs2) {
                  if (divs2[i].id == put) {
                    $scope.saveAttachment(divs2[i]);
                    break;
                  }

                }
              }
            });

            domMain.on('click', '#cancel-btn', function (e) {
              e.stopPropagation();
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.cancelAttach(row.data());
            });
            domMain.on('click', '#del-btn', function (e) {
              e.stopPropagation();
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.cancelAttach(row.data());
            });


          }
        ]
      }
    }]);

    // 弹窗-点检任务-表格
    directives.initDirective('addTaskPlanTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function ($timeout, ngDialog, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          $scope.$on(Event.ALERTRULESINIT + "_checkPlanTask", function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            console.log("点检表格数据", args);
            table = domMain.DataTable({
              // dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
              dom: '',
              language: $.ProudSmart.datatable.language,
              // select: $.ProudSmart.datatable.select,
              data: args.option,
              order: [
                [7, "desc"]
              ],
              columns: [
                {
                  data: "itemId",
                  title: "项次",
                  width: "5%"
                }, {
                  data: "equipmentName",
                  title: "设备",
                  width: "15%"
                }, {
                  data: "checkMessage",
                  title: "点检内容",
                  width: "10%"
                }, {
                  data: "checkStandard",
                  title: "点检标准",
                  width: "10%"
                }, {
                  data: "checkTool",
                  title: "点检工具",
                  width: "10%"
                }, {
                  data: "checkMethod",
                  title: "点检方法",
                  width: "10%"
                }, {
                  data: "checkResult",
                  title: "点检结果",
                  width: "10%"
                }, {
                  data: "causeDescription",
                  title: "原因描述",
                  width: "20%"
                }, {
                  data: "enclosure",
                  title: "附件",
                  width: "10%",
                }
              ],
              columnDefs: [
                {
                  targets: 0,
                  data: "itemId",
                  render: function (data, type, full) {
                    return data
                  }
                }, {
                  targets: 1,
                  data: "equipmentId",
                  render: function (data, type, full) {
                    return data;
                  }
                }, {
                  targets: 2,
                  data: "checkMessage",
                  render: function (data, type, full) {
                    return data;
                  }
                }, {
                  targets: 3,
                  data: "checkStandard",
                  render: function (data, type, full) {
                    return data;
                  }
                }, {
                  targets: 4,
                  data: "checkTool",
                  render: function (data, type, full) {
                    return data;
                  }
                }, {
                  targets: 5,
                  data: "checkMethod",
                  render: function (data, type, full) {
                    return data;
                  }
                }, {
                  targets: 6,
                  data: "checkResult",
                  render: function (data, type, full) {
                    // return '<input type="text" >'
                    return '<select style="width:80%" class="form-control input-sm ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"  valueAttr="checkResult" \
                              <option value="">请选择</option>\
                              <option value=1>注意</option>\
                              <option value=2>警告</option>\
                              <option value=3>危险</option>\
                              <option value=0>正常</option>\
                            </select>';
                     // 1  注意   2  警告   3  危险    0  正常
                  }
                }, {
                  targets: 7,
                  data: "causeDescription",
                  render: function (data, type, full, meta) {
                    // ng-model='ModelShowData.variables["+ meta.row +"].causeDescription'\
                    // console.log(data, type, full, meta);
                    return "<input maxlength='200' valueAttr='causeDescription' style='width:80%;' autocomplete='off' \
                    placeholder='请输入原因描述' class='form-control input-sm' \
                    ng-model='ModelShowData.variables.pointCheckLists["+ meta.row +"].causeDescription'\
                    type='text' name = 'unit'>";
                    
                  }
                },{
                  targets: 8,
                  data: "enclosure",
                  render: function(){
                    // onclick="$('#fileName').click()"
                  var str =  '<div class="col-sm-4 padding-left-5" style="width:100%;">\
                              <input id="fileName" style="display:none" class="form-control" type="file" nv-file-select="" \
                                  uploader="uploader" multiple >\
                              <input type="text" style="width: 80% !important;" readonly="readonly" class="form-control dialog-inp-text  input-sm" title="dfsfsa" \
                                ng-model="sparepartAddData.imageUrl" required="required">\
                              <span id="fileClick" style="position: absolute;top: 50%;right: 15%;transform: translateY(-50%);"><i class="proudsmart ps-add"></i></span>\
                            <span ng-show="docError.name == "error"" style="font-size: 12px;"  ng-bind="docError.conter" class="help-block text-danger text-muted" ng-cloak></span> \
                            </div>'
                         
                          return str;
                  }
                }
              ],
              rowCallback: function (nRow, aData, iDataIndex) {
                
              }
            });
          });

          console.log($scope,"asdasdasdad");
          domMain.on('click', '#fileClick', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();

            $(this).parent().find('input').eq(0).click();
          });
          

          

        }]
      }
    }]);

    // 弹窗-日常保养任务-表格
    directives.initDirective('addTaskDailyCheckTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function ($timeout, ngDialog, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          $scope.$on(Event.ALERTRULESINIT + "_dailyCheckTask", function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            console.log("日常保养表格数据", args);
            table = domMain.DataTable({
              dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              // select: $.ProudSmart.datatable.select,
              data: args.option[0],
              order: [
                [7, "desc"]
              ],
              // $.ProudSmart.datatable.selectCol,
              columns: [
                {
                  data: "itemId",
                  title: "项次",
                  width: "5%"
                }, {
                  data: "equipmentId",
                  title: "保养内容",
                  width: "20%"
                }, {
                  data: "checkMessage",
                  title: "保养标准",
                  width: "20%"
                }, {
                  data: "checkStandard",
                  title: "保养工具",
                  width: "10%"
                }, {
                  data: "checkTool",
                  title: "检查方法",
                  width: "10%"
                }, {
                  data: "checkMethod",
                  title: "保养结果",
                  width: "10%"
                }, {
                  data: "checkMethod",
                  title: "原因描述",
                  width: "15%"
                }, {
                  data: "risingTime",
                  title: "附件",
                  width: "10%",
                }
              ],
              columnDefs: [
                {
                  targets: 0,
                  data: "itemId",
                  render: function (data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 1,
                  data: "equipmentId",
                  render: function (data, type, full) {
                    var str = "";
                    if (full.isEdit == 2 && type == "display") {
                      str = '<select style="width:80%" class="form-control input-sm ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"  ng-model="addItemNumListsCreate.equipmentId"  ng-options="value.id as value.label for value in EquipmentList" selectdata="EquipmentList"></select>';
                      return str;
                    } else {
                      for (var i in $scope.EquipmentList) {
                        if ($scope.EquipmentList[i].id == data) {
                          str = $scope.EquipmentList[i].label;
                        }
                      }
                      return str;
                    }
                  }
                }, {
                  targets: 2,
                  data: "checkMessage",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display") {
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    } else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 3,
                  data: "checkStandard",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 4,
                  data: "checkTool",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 5,
                  data: "checkMethod",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 6,
                  data: "",
                  render: function (data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 7,
                  data: "option",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    var str = '';
                    return str;
                  }
                }
              ],
              rowCallback: function (nRow, aData, iDataIndex) {
                // if (aData.selected) {
                //   $(nRow).addClass("selected")
                // } else {
                //   $(nRow).removeClass("selected")
                // }
                // $compile(nRow)($scope);
              }
            });
          });

          

        }]
      }
    }]);

    // 弹窗-保养大修任务-表格
    directives.initDirective('addTaskBigDailyCheckTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function ($timeout, ngDialog, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          $scope.$on(Event.ALERTRULESINIT + "_bigdailyCheckTask", function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            console.log("保养大修任务", args);
            table = domMain.DataTable({
              dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              // select: $.ProudSmart.datatable.select,
              data: args.option[0],
              order: [
                [7, "desc"]
              ],
              // $.ProudSmart.datatable.selectCol,
              columns: [
                {
                  data: "itemId",
                  title: "项次",
                  width: "5%"
                }, {
                  data: "equipmentId",
                  title: "保养内容",
                  width: "20%"
                }, {
                  data: "checkMessage",
                  title: "保养标准",
                  width: "20%"
                }, {
                  data: "checkStandard",
                  title: "保养工具",
                  width: "10%"
                }, {
                  data: "checkTool",
                  title: "检查方法",
                  width: "10%"
                }, {
                  data: "checkMethod",
                  title: "保养结果",
                  width: "10%"
                }, {
                  data: "checkMethod",
                  title: "原因描述",
                  width: "15%"
                }, {
                  data: "risingTime",
                  title: "附件",
                  width: "10%",
                }
              ],
              columnDefs: [
                {
                  targets: 0,
                  data: "itemId",
                  render: function (data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 1,
                  data: "equipmentId",
                  render: function (data, type, full) {
                    var str = "";
                    if (full.isEdit == 2 && type == "display") {
                      str = '<select style="width:80%" class="form-control input-sm ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"  ng-model="addItemNumListsCreate.equipmentId"  ng-options="value.id as value.label for value in EquipmentList" selectdata="EquipmentList"></select>';
                      return str;
                    } else {
                      for (var i in $scope.EquipmentList) {
                        if ($scope.EquipmentList[i].id == data) {
                          str = $scope.EquipmentList[i].label;
                        }
                      }
                      return str;
                    }
                  }
                }, {
                  targets: 2,
                  data: "checkMessage",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display") {
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    } else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 3,
                  data: "checkStandard",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 4,
                  data: "checkTool",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 5,
                  data: "checkMethod",
                  render: function (data, type, full) {
                    //返回自定义名字
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    else {
                      return escape(data);
                    }
                  }
                }, {
                  targets: 6,
                  data: "",
                  render: function (data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 7,
                  data: "option",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    var str = '';
                    return str;
                  }
                }
              ],
              rowCallback: function (nRow, aData, iDataIndex) {
                // if (aData.selected) {
                //   $(nRow).addClass("selected")
                // } else {
                //   $(nRow).removeClass("selected")
                // }
                // $compile(nRow)($scope);
              }
            });
          });
        }]
      }
    }]);

    // 弹窗-备件模块指令
    directives.initDirective('dialogSparePart', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function ($timeout, ngDialog, $compile, $filter, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          console.log($element,'element');
          var domMain = $element;
          var table;
          $scope.$on(Event.ALERTRULESINIT + "_sparePartModule", function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            console.log("备件模块", args);
            table = domMain.DataTable({
              dom: args.option && args.option.length >= 1 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              // select: $.ProudSmart.datatable.select,
              data: args.option,
              order: [
                [7, "desc"]
              ],
              // $.ProudSmart.datatable.selectCol,
              columns: [
                {
                  data: "model",
                  title: "备件类型",
                  width: "5%"
                }, {
                  data: "label",
                  title: "备件名称",
                  width: "20%"
                }, {
                  data: "name",
                  title: "备件编码",
                  width: "20%"
                }, {
                  data: "specification",
                  title: "规格型号",
                  width: "10%"
                }, {
                  data: "manufacturer",
                  title: "生产厂家",
                  width: "10%"
                }, {
                  data: "usePosition",
                  title: "使用部位",
                  width: "10%"
                }, {
                  data: "stockNumber",
                  title: "实际库存",
                  width: "15%"
                }, {
                  data: "useNumber",
                  title: "使用数量",
                  width: "10%",
                }, {
                  data: "",
                  title: "操作",
                  width: "10%",
                }
              ],
              columnDefs: [
                {
                  targets: 0,
                  data: "model",
                  render: function (data, type, full) {
                    return '<select class="form-control"  style="padding:0;"  \
                                ng-model="queryDitem.valueCode" \
                                ng-options="value.valueCode as value.label for value in sparepartListSelect" \
                                selectdata="sparepartListSelect">\
                              <option value="">请选择</option>\
                            </select>';
                  }
                }, {
                  targets: 1,
                  data: "label",
                  render: function (data, type, full) {
                    return '<select class="form-control"  style="padding:0;"  \
                              ng-model="queryDitem.valueCode" \
                              ng-options="value.valueCode as value.label for value in sparepartListSelect" \
                              selectdata="sparepartListSelect">\
                            <option value="">请选择</option>\
                          </select>';
                    // var str = "";
                    // if (full.isEdit == 2 && type == "display") {
                    //   str = '<select style="width:80%" class="form-control input-sm ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"  ng-model="addItemNumListsCreate.equipmentId"  ng-options="value.id as value.label for value in EquipmentList" selectdata="EquipmentList"></select>';
                    //   return str;
                    // } else {
                    //   for (var i in $scope.EquipmentList) {
                    //     if ($scope.EquipmentList[i].id == data) {
                    //       str = $scope.EquipmentList[i].label;
                    //     }
                    //   }
                    //   return str;
                    // }
                  }
                }, {
                  targets: 2,
                  data: "name",
                  render: function (data, type, full) {
                    return '<select  class="form-control" style="padding:0;"  \
                                ng-model="queryDitem.valueCode" \
                                ng-options="value.valueCode as value.label for value in sparepartListSelect" \
                                selectdata="sparepartListSelect">\
                              <option value="">请选择</option>\
                            </select>';
                    // //返回自定义名字
                    // if (full.isEdit == 2 && type == "display") {
                    //   return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    // } else {
                    //   return escape(data);
                    // }
                  }
                }, {
                  targets: 3,
                  data: "specification",
                  render: function (data, type, full) {
                    // 规则型号
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入备件单位' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'unit'>";
                    else {
                      return escape(data);
                    }
                    // if (full.isEdit == 2 && type == "display")
                    //   return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    // else {
                    //   return escape(data);
                    // }
                  }
                }, {
                  // 生产厂家
                  targets: 4,
                  data: "manufacturer",
                  render: function (data, type, full) {
                    if (full.isEdit == 2 && type == "display")
                      return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入备件单位' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'unit'>";
                    else {
                      return escape(data);
                    }
                    // //返回自定义名字
                    // if (full.isEdit == 2 && type == "display")
                    //   return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                    // else {
                    //   return escape(data);
                    // }
                  }
                }, {
                  targets: 5,
                  data: "usePosition",
                  render: function (data, type, full) {
                    return '<select  class="form-control" style="padding:0;"  \
                              ng-model="queryDitem.valueCode" \
                              ng-options="value.valueCode as value.label for value in sparepartListSelect" \
                              selectdata="sparepartListSelect">\
                            <option value="">请选择</option>\
                          </select>';
                  }
                }, {
                  targets: 6,
                  data: "stockNumber",
                  render: function (data, type, full) {
                    return "<input maxlength='200' style='width:80%' autocomplete='off' placeholder='请输入备件单位' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'unit'>";
                   
                  }
                }, {
                  targets: 7,
                  data: "useNumber",
                  render: function (data, type, full) {
                    return "<input maxlength='200' style='width:80%' autocomplete='off' placeholder='请输入备件单位' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'unit'>";
                   
                  }
                }, {
                  targets: 8,
                  data: "",
                  render: function (data, type, full) {
                    // 返回自定义内容
                    var str = '<button id="deleteRow" class="btn btn-primary">删除</button>';
                    return str;
                  }
                }
              ],
              rowCallback: function (nRow, aData, iDataIndex) {
                // if (aData.selected) {
                //   $(nRow).addClass("selected")
                // } else {
                //   $(nRow).removeClass("selected")
                // }
                // $compile(nRow)($scope);
              }
            });
            domMain.on('click', '#deleteRow', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              console.log(row[0][0]);
              var dataList = row.data();
              console.log(dataList, $scope);
              
              // $scope.$parent.sparePartData.splice(row[0][0], 1);
              $scope.$emit(Event.ALERTRULESINIT + "_deleteRowSpart", row[0][0])
            });
          });
        }]
      }
    }])


  });
