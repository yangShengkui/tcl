define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'], function (directives, BootstrapDialog, datatables) {
  'use strict';
  directives.initDirective('maintenanceTaskDom', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on("MAINTENANCE", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              select: $.ProudSmart.datatable.select,
              order: [
                [11, "desc"]
              ],
              columns: [$.ProudSmart.datatable.selectCol,{
                data: "name",
                title: "计划名称"
              }, {
                data: "ticketCategoryId",
                title: "维保类型"
              },  {
                data: "customerId",
                visible: $scope.baseConfig.customerConfig.display,
                title: "客户"
              }, {
                data: "projectId",
                title: "项目",
                visible: $scope.baseConfig.projectConfig.display
              }, {
                data: "deviceId",
                title: "维保设备"
              }, {
                data: "nextExecutionTime",
                title: "下次执行时间"
              }, {
                data: "nextExecutioner",
                title: "下次执行人"
              },{
                data: "operationStatus",
                title: "运行状态"
              },{
                data: "taskStatus",
                title: "计划状态"
              },$.ProudSmart.datatable.optionCol3, {
                data: "createTime",
                title: "",
                visible: false
              }],
              columnDefs: [{
                "targets": 0,
                orderable: false,
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if (type == "display") {
                    if (data) {
                      return '<input class="itemCheckBox" checked type="checkbox">';
                    } else {
                      return '<input class="itemCheckBox" type="checkbox">';
                    }
                  }
                  return "";
                }
              },{
                "targets": 2,
                "data": "ticketCategoryId",
                "render": function(data, type, full) {
                  if($scope.processTypeDic && $scope.processTypeDic[data]) {
                    return $scope.processTypeDic[data].name;
                  }
                  return "";
                }
              }, {
                "targets": 3,
                "data": "customerId",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if($scope.customersDic && $scope.customersDic[data]) {
                    return $scope.customersDic[data].customerName;
                  }
                  return "";
                }
              },{
                "targets": 4,
                "data": "projectId",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if($scope.projectsDic && $scope.projectsDic[data]) {
                    return $scope.projectsDic[data].projectName;
                  }
                  return "";
                }
              },{
                "targets": 5,
                "data": "deviceId",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if($scope.devicesListDic && $scope.devicesListDic[data]) {
                    return $scope.devicesListDic[data].label;
                  }
                  return "";
                }
              },{
                "targets": 6,
                "data": "nextExecutionTime",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = $filter('date')(data, 'yyyy-MM-dd');
                  return str;
                }
              },{
                "targets": 7,
                "data": "executioner",
                "render": function(data, type, full) {
                  if($scope.enterpriseListDic && $scope.enterpriseListDic[data]) {
                    return $scope.enterpriseListDic[data].userName;
                  }
                  return "";
                }
              },{
                "targets": 8,
                "data": "operationStatus",
                "render": function(data, type, full) {
                  var str = '';
                  if (data == 0) {
                    str += '未到期';
                  } else if (data == 1) {
                    str += '待分配';
                  } else if (data == 2) {
                    str += '已分配';
                  } else if (data == 3) {
                    str += '待执行';
                  } else if (data == 4) {
                    str += '已完成';
                  }

                  return str;
                }
              },{
                "targets": 9,
                "data": "taskStatus",
                "render": function(data, type, full) {
                  var str = '';
                  if (data == 0) {
                    str += '启用';
                  } else if (data == 1) {
                    str += '停用';
                  }
                  return str;
                }
              },{
                targets: 10,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";

                  if ($scope.menuitems['A05_S47']) {
                    str += "<button id='edit-btn'  class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if (full.taskStatus == 1) {
                    if ($scope.menuitems['A06_S47']) {
                      str += "<button id='del-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    }
                  } else {
                    if ($scope.menuitems['A06_S47']) {
                      str += "<button  disabled class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    }
                  }
                  if ($scope.menuitems['A04_S47'] || $scope.menuitems['A03_S47'] || $scope.menuitems['A01_S47']) {
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  }

                  str += "<ul class='dropdown-menu' role='menu'>";
                  if ($scope.menuitems['A01_S47']) {
                    str += "<li><a role='button' href='#/calendarData/"+full.id+"/"+full.nextExecutioner+"' id='design-btn'>指派</a></li>";
                  }
                  if (full.taskStatus == 0) {
                    if ($scope.menuitems['A04_S47']) {
                      str += "<li><a role='button'  id='disable-btn'>停用</a></li>";
                    }
                  } else if (full.taskStatus == 1) {
                    if ($scope.menuitems['A03_S47']) {
                      str += "<li><a role='button'  id='disable-btn'>启用</a></li>";
                    }
                  }
                  str += "</ul></div>";
                  return str;
                }
              }],
              rowCallback: function(nRow, aData, iDataIndex) {
                if (aData.selected) {
                  $(nRow).addClass("selected")
                } else {
                  $(nRow).removeClass("selected")
                }
                $compile(nRow)($scope);
              }
            });
          });
          domMain.on('change', '#allselect-btn', function(e) {
            e.stopPropagation();
            if(e.target.checked) {
              table.rows().select();
              var tableRows = table.rows({
                selected: true
              });
              for(var i = 0; i < tableRows.nodes().length; i++) {
                var row = table.row(tableRows.nodes()[i]);
                row.data().selected = true;
              };
              table.rows().invalidate().draw(false);
            } else {
              var tableRows = table.rows({
                selected: true
              });
              for(var i = 0; i < tableRows.nodes().length; i++) {
                var row = table.row(tableRows.nodes()[i]);
                row.data().selected = false;
              };
              table.rows().deselect();
              table.rows().invalidate().draw(false);
            }
            $scope.selectedHandler();
          });

          domMain.on('change', '.itemCheckBox', function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(e.target.checked) {
              row.data().selected = true;
            } else {
              row.data().selected = false;
            }
            var tableRows = table.rows({
              selected: true
            });
            if (tableRows.count() != table.rows()[0].length) {
              $('#allselect-btn').attr('checked',false)
              $('#allselect-btn').prop('checked',false);
            } else if (tableRows.count() == table.rows()[0].length) {
              $('#allselect-btn').attr('checked',true)
              $('#allselect-btn').prop('checked',true);
            }
            $scope.selectedHandler();
          });
          //批量删除
          $scope.selectedDelete = function() {
            var tableRows = table.rows({
              selected: true
            });
            var selectedCount = tableRows.count();
            var nodes = tableRows.nodes();
            if (selectedCount == 0) {
              growl.warning("当前没有选中", {});
              return;
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认删除这 ' + selectedCount + ' 条记录吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  var selArr = [];
                  for(var i = 0; i < nodes.length; i++) {
                    var row = table.row(nodes[i]);
                    var rowData = row.data();
                    selArr.push(rowData.id);
                  };
                  if(selArr.length == nodes.length){
                    $scope.doAction("delete2", selArr);
                  }
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  dialogRef.close();
                }
              }]
            });
          };
          //批量停用启用
          $scope.selectedStatus = function(status) {
            var tableRows = table.rows({
              selected: true
            });
            var selectedCount = tableRows.count();
            var nodes = tableRows.nodes();
            if (selectedCount == 0) {
              growl.warning("当前没有选中", {});
              return;
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '确认您所选择的 ' + selectedCount + ' 条记录吗？',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  var successCount = 0;
                  var errorCount = 0;
                  for(var i = 0; i < nodes.length; i++) {
                    var row = table.row(nodes[i]);
                    var rowData = row.data();
                    if(rowData.managedStatus == 'deactive') {
                      $scope.doActiveHanddler(rowData, function(status, node) {
                        if(status) {
                          table.row(node).data().managedStatus = "active";
                          table.row(node).cells().invalidate().draw(false);
                          successCount++;
                        } else {
                          errorCount++;
                        }
                        if(selectedCount == (successCount + errorCount)) {
                          table.rows().deselect();
                          growl.success("成功启用设备" + successCount + "台,失败" + errorCount + "台", {});
                        }
                      }, nodes[i])
                    }
                  };
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  dialogRef.close();
                }
              }]
            });
          };

          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.addMain(row.data());

          });
          domMain.on('click', '#disable-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var d = row.data();
            if(d.taskStatus == 0){
              $scope.statusSave([row.data().id],1,function (res) {
                if(res){
                  row.data().taskStatus = 1;
                  row.cells().invalidate().draw(false);
                }
              });
            }else{
              $scope.statusSave([row.data().id],0,function (res) {
                if(res){
                  row.data().taskStatus = 0;
                  row.cells().invalidate().draw(false);
                }
              });
            }
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
            $scope.doAction("delete", rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    };
  }]);

  directives.initDirective('maintenanceRecordDom', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on("RECORD", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [
                [8, "desc"]
              ],
              columns: [{
                data: "taskName",
                title: "任务名称"
              }, {
                data: "type",
                title: "维保类型"
              },  {
                data: "serverType",
                title: "服务类别"
              }, {
                data: "modelName",
                title: "设备模板"
              }, {
                data: "deviceId",
                title: "设备名称"
              }, {
                data: "maintenanceTime",
                title: "维保时间"
              }, {
                data: "executioner",
                title: "执行人"
              },$.ProudSmart.datatable.optionCol1, {
                data: "createTime",
                title: "",
                visible: false
              }],
              columnDefs: [{
                targets: 1,
                data: "type",
                render: function(data, type, full) {
                  if($scope.processTypeDic && $scope.processTypeDic[data]) {
                    return $scope.processTypeDic[data].name;
                  }
                  return "";
                }
              },{
                targets: 2,
                data: "serverType",
                render: function (data, type, full) {
                  var str = "";
                  if (data == "0") {
                    str = "保内";
                  }else if(data == "1"){
                    str = "保外";
                  }
                  return str;
                }
              },{
                targets: 3,
                data: "modelName",
                render: function (data, type, full) {
                  var str = "";
                  if ($scope.rootModelDic[data] != undefined) {
                    if (data != "" && data != undefined) {
                      str = $scope.rootModelDic[data].label;
                    }
                  }
                  return data;
                }
              },{
                targets: 4,
                data: "deviceId",
                render: function(data, type, full) {
                  if($scope.devicesListDic && $scope.devicesListDic[data]) {
                    return $scope.devicesListDic[data].label;
                  }
                  return "";
                }
              },{
                targets: 5,
                data: "maintenanceTime",
                render: function(data, type, full) {
                  return $filter('date')(data, 'yyyy-MM-dd');
                }
              },{
                targets: 6,
                data: "executioner",
                render: function(data, type, full) {
                  if($scope.enterpriseListDic && $scope.enterpriseListDic[data]) {
                    return $scope.enterpriseListDic[data].userName;
                  }
                  return "";
                }
              },{
                targets: 7,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group btn-group-sm'>";
                  if ($scope.menuitems['A01_S48']) {
                    str += "<button id='look-btn'  class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                  }
                  return str;
                }
              }]
            });
          });

          domMain.on('click', '#look-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            // location.href = '../app-oc/index.html#/orderdetail/' + rowData.ticketNo + '/task/message';
            location.href = '../app-oc/index.html#/conditionDetail/' + rowData.id + '';
          });
        }
      ]
    };
  }]);

  directives.initDirective('calendarData', ["$timeout", "$parse", 'growl', function ($timeout, $parse, growl) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        require(['fullcalendar'], function (calendar) {
          var value = attrs['value'];
          var tmp = 1;
          var init = function (selectData) {
            element.fullCalendar({
              header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
              },
              height: "auto",
              buttonText: {
                today: '今天',
                month: '月',
                week: '周',
                day: '天'
              },
              timeFormat: 'H:mm:ss',
              monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
              dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
              editable: true,
              events:selectData,
              droppable: true, // this allows things to be dropped onto the calendar !!!
              //日程点击：添加日程
              dayClick: function (date, allDay, jsEvent, view) {
                // var startTime= (new Date(date._d)).getTime();
                // var time= (new Date()).getTime();
                var newData= date._d.Format("yyyy-MM-dd");
                var ckTime = checkDate(newData);
                if(ckTime == false){
                  growl.warning("您选择的时间小于当前时间",{})
                  return;
                }
                if(scope.executioner == '' || scope.executioner == null){
                  growl.warning("请选择任务执行人",{})
                  return;
                }
                var d = date._d.Format("yyyy-MM-dd");
                var selectArray = function (maxValue) {
                  var timeArr = '';
                  for(var i=0;i<maxValue;i++){
                    timeArr += '<option value="'+i+'">'+i+'</option>';
                  }
                  return timeArr ;
                }

                var dataCheck = function (endDate,startDate) {
                  var date1 = new Date(Date.parse(startDate.replace("-", "/")));
                  var date2 = new Date(Date.parse(endDate.replace("-", "/")));
                  return date1 < date2;
                }
                var hourselect = selectArray(24);
                var minuteselect = selectArray(60);
                var secondselect = selectArray(60);
                BootstrapDialog.show({
                  title: '提示',
                  closable: false,
                  //size:BootstrapDialog.SIZE_WIDE,
                  message: '确认要选择'+d+' <select id="hourselect">'+hourselect+'</select>:<select id="minuteselect">'+minuteselect+'</select>:<select id="secondselect">'+secondselect+'</select>执行吗？',
                  buttons: [{
                    label: '确定',
                    cssClass: 'btn-success',
                    action: function(dialogRef) {
                      if(scope.selectList.length > 0){
                        var data = scope.selectList;
                        var dataStr = d+' '+$('#hourselect').val()+':'+$('#minuteselect').val()+':'+$('#secondselect').val()+''
                        var newData = new Date(dataStr).Format("yyyy-MM-dd hh:mm:ss");
                        var currentDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
                        var ckTime = dataCheck(newData,currentDate);
                        if(ckTime == false){
                          growl.warning("您选择的时间小于当前时间",{})
                          return;
                        }
                        data[0].nextExecutionTime = new Date(dataStr);
                        data[0].nextExecutioner = scope.executioner;
                        scope.update(data,function (res) {
                          if(res){
                            growl.success("保存成功", {});
                            window.history.back();
                          }
                        });
                      }
                      dialogRef.close();
                    }
                  }, {
                    label: '取消',
                    action: function(dialogRef) {
                      dialogRef.close();
                    }
                  }]
                });
              }
            });
          }
          scope.$watch(attrs.ngModel, function (n, o, s) {
            var fullData = [];
            tmp++;
            if (n.length > 0) {
              scope.$evalAsync(function () {
                for (var j in n) {
                  var obj = {};
                  obj["title"] = n[j].name;
                  if(n[j].nextExecutionTime){
                    obj["start"] = useMomentFormat(n[j].nextExecutionTime, "yyyy-MM-dd hh:mm:ss");
                  }
                  if (n[j].operationStatus == 0) {//未到期
                    obj["backgroundColor"] = "#3c8dbc";
                    obj["borderColor"] = "#3c8dbc";
                  } else if (n[j].operationStatus == 1) {//待分配
                    obj["backgroundColor"] = "#f39c12";
                    obj["borderColor"] = "#f39c12";
                  } else if (n[j].operationStatus == 2) {//已分配
                    obj["backgroundColor"] = "#00c0ef";
                    obj["borderColor"] = "#00c0ef";
                  } else if (n[j].operationStatus == 3) {//待执行
                    obj["backgroundColor"] = "#dd4b39";
                    obj["borderColor"] = "#dd4b39";
                  }
                 /* else if (n[j].operationStatus == 4) {//已完成
                    obj["backgroundColor"] = "#00a65a";
                    obj["borderColor"] = "#00a65a";
                  }*/
                 if(n[j].operationStatus != 4){
                   fullData.push(obj);
                 }
                }
                if(tmp == 2){
                  init(fullData);
                }else{
                  element.fullCalendar('removeEvents');
                  for(var b in fullData){
                    element.fullCalendar('renderEvent',fullData[b], true);
                  }
                  element.fullCalendar('unselect');
                }
              });
            }else{
              if(tmp == 2){
                init(fullData);
              }else{
                element.fullCalendar('removeEvents');
              }
              /* var obj = {};
               obj["title"] = "测试333";
               var newDate = new Date();
               obj["start"] = newDate.Format("yyyy-MM-dd");
               fullData.push(obj);
               element.fullCalendar('renderEvent', {
               id: "88888888",
               title: "999999",
               start: newDate
               }, true);
               element.fullCalendar('unselect');*/
            }
          });
        });
      }
    };
  }]);
});








