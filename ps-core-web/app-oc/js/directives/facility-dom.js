define(['directives/directives', 'bootstrap-dialog', 'datatables.buttons.html5', 'jszip', 'datatables.net-select'], function(directives, BootstrapDialog, datatables, jszip) {
  'use strict';
  directives.initDirective('facilityInfoTable', ['$timeout', '$compile', '$filter', 'growl', 'weatherService', 'actionService', function($timeout, $compile, $filter, growl, weatherService, actionService) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          window.JSZip = jszip;
          $scope.$on(Event.CMDBINFOSINIT + "_facility", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            var defaultColumns = [];
            var defaultcolumnDefs = [];
            var exportOptionsCol = [];
            if($scope.baseConfig.customerConfig.display && !$scope.userInfo.subDomain) {
              defaultColumns.push({
                data: "customerId",
                title: ($scope.menuitems["S12"] && $scope.menuitems["S12"].label)?$scope.menuitems["S12"].label:"客户",
                orderable: false
              });
              defaultcolumnDefs.push({
                targets: defaultColumns.length - 1,
                data: "customerId",
                render: function(data, type, full) {
                  var str = "";
                  if(data != 0 && data != "" && data != null) {
                    var customers = $scope.customersList;
                    for(var i in customers) {
                      if(customers[i].id == data) {
                        str = customers[i].text;
                        break;
                      }
                    }
                  }
                  return str;
                }
              })
            };
            if($scope.baseConfig.projectConfig.display) {
              defaultColumns.push({
                data: "projectId",
                orderable: false,
                title: ($scope.menuitems["S13"] && $scope.menuitems["S13"].label)?$scope.menuitems["S13"].label:"项目"
              });
              defaultcolumnDefs.push({
                targets: defaultColumns.length - 1,
                data: "projectId",
                render: function(data, type, full) {
                  var str = "";
                  if(data != 0 && data != "" && data != null) {
                    var projects = $scope.projectsList;
                    for(var i in projects) {
                      if(projects[i].id == data) {
                        str = projects[i].text;
                        break;
                      }
                    }
                  }
                  return str;
                }
              });
            }

            defaultColumns.push({
              data: "modelId",
              orderable: false,
              title: "设备模板"
            });
            defaultcolumnDefs.push({
              targets: defaultColumns.length - 1,
              data: "modelId",
              render: function(data, type, full) {
                var str = "";
                if(data != "" && data != undefined) {
                  if($scope.rootModelDic[data] != undefined) {
                    str = $scope.rootModelDic[data].label;
                  }
                  if($scope.menuitems['A01_S02']) {
                    str = "<a href='#/lookModel/" + data + "'>" + str + "</a>";
                  }
                }
                return str;
              }
            });

            defaultColumns.push({
              data: "label",
              orderable: false,
              title: "设备名称"
            });
            defaultcolumnDefs.push({
              targets: defaultColumns.length - 1,
              data: "label",
              render: function(data, type, full) {
                var str = '';
                if($scope.menuitems['A05_S02']) {
                  str = "<a href='#/facility_detail/DETAIL/" + full.gatewayId + "/" + full.id + "'>" + data + "</a>";
                } else {
                  str = data;
                }
                return str;
              }
            });
            defaultColumns.push({
              data: "sn",
              orderable: false,
              title: "设备序列号"
            });
            defaultcolumnDefs.push({
              targets: defaultColumns.length - 1,
              data: "sn",
              render: function(data, type, full) {
                return escape(data);
              }
            });
            defaultColumns.push({
              data: "onlineStatus",
              orderable: false,
              title: "在线状态"
            });
            defaultcolumnDefs.push({
              targets: defaultColumns.length - 1,
              data: "onlineStatus",
              render: function(data, type, full) {
                var severityStr = "无数据";
                var severityBg = "bg-gray";
                if (full.alertSwitchOn === false) {
                  severityStr = "检修";
                  severityBg = "label-danger";
                } else {
                  if(data == 0) {
                    severityStr = "离线";
                    severityBg = "label-warning";
                  } else if(data == 1) {
                    severityStr = "在线";
                    severityBg = "label-primary";
                  }
                }
                return "<span class='label " + severityBg + "'  style='color: #ffffff !important;'>" + severityStr + "</span>";
              }
            });
            defaultColumns.push({
              data: "severity",
              orderable: false,
              title: "故障状态"
            });
            defaultcolumnDefs.push({
              targets: defaultColumns.length - 1,
              data: "severity",
              render: function(data, type, full) {
                var severityStr = "无数据";
                var severityBg = "bg-gray";
                if(data == 4) {
                  severityStr = "严重";
                  severityBg = "bg-alarm-critical";
                } else if(data == 3) {
                  severityStr = "重要";
                  severityBg = "bg-alarm-major";
                } else if(data == 2) {
                  severityStr = "次要";
                  severityBg = "bg-alarm-minor";
                } else if(data == 1) {
                  severityStr = "警告";
                  severityBg = "bg-alarm-warning";
                } else if(data < 1) {
                  severityStr = "正常";
                  severityBg = "progress-bar-success";
                }
                return "<span class='label " + severityBg + "' style='color: #ffffff !important;'>" + severityStr + "</span>";
              }
            });
            defaultColumns.push({
              data: "domainPath",
              orderable: false,
              title: "管理域"
            });
            defaultcolumnDefs.push({
              targets: defaultColumns.length - 1,
              data: "domainPath",
              render: function(data, type, full) {
                var str = "";
                if($scope.domainListDic[data] != undefined && $scope.domainListDic[data]) {
                  str = $scope.domainListDic[data].name;
                }
                return str;
              }
            });
            var calculateDic = null;
            if($scope.queryKeyValue) {
              $scope.queryKeyValue.forEach(function(querykey) {
                if (querykey.dataType == 'numberic' && querykey.values && querykey.values.calculate == "1") {
                  if (!calculateDic) calculateDic ={}
                  calculateDic[defaultColumns.length] = querykey;
                  calculateDic[defaultColumns.length].total = 0;
                }
                defaultColumns.push({
                  data: "values."+querykey.name+"",
                  title: querykey.label
                });
                defaultcolumnDefs.push({
                  "targets": defaultColumns.length - 1,
                  //                "data": querykey.name,
                  "render": function(data, type, full) {
                    var str = '';
                    if(full.values[querykey.name]) {
                      if(querykey.dataType == 'datetime') {
                        str = $filter('date')(full.values[querykey.name], 'yyyy-MM-dd HH:mm:ss');
                      } else if(querykey.dataType == 'date') {
                        str = $filter('date')(full.values[querykey.name], 'yyyy-MM-dd');
                      } else {
                        str = full.values[querykey.name];
                      }
                    }
                    return str;
                  }
                })
              })
            }
            defaultColumns.push($.ProudSmart.datatable.optionCol2);
            defaultcolumnDefs.push({
              "targets": defaultColumns.length - 1,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                if($scope.menuitems['A05_S02']) {
                  str += "<button id='edit-btn'   class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                }
                if($scope.menuitems['A06_S02'] || $scope.menuitems['A03_S02'] || $scope.menuitems['A04_S02'] || $scope.menuitems['A02_S02']){
                  str += "<button type='button'  class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                }
                str += "<ul class='dropdown-menu' role='menu'>";
                if($scope.menuitems['A06_S02']) {
                  str += "<li><a role='button' href='#/facility_panel/[{\"modelId\":" + full.modelId + ",\"resourceId\":" + full.id + "}]'>仪表板</a></li>";
                }
                if($scope.menuitems['A03_S02']) {
                  str += "<li><a role='button' href='#/emcsView/" + full.id + "/true'>数据监测</a></li>";
                }
                if($scope.menuitems['A02_S02']) {
                  str += "<li><a role='button' href='#/configAlert/" + full.id + "/node'>告警查看</a></li>";
                }
                if($scope.menuitems['A04_S02']) {
                  str += "<li><a role='button' href='#/alertRules/" + full.id + "'>告警规则</a></li>";
                }
                if($scope.menuitems['A09_S02']) {
                  str += "<li><a role='button' href='#/faultKnowledge'>故障知识</a></li>";
                }
                if($scope.menuitems['A10_S02']) {
                  str += "<li><a role='button' href='#/inspectionStandard'>维保标准</a></li>";
                }
                if($scope.menuitems['A11_S02']) {
                  str += "<li><a id='repair-btn' role='button'>检修状态</a></li>";
                }
                if($scope.menuitems['A12_S02']) {
                  str += "<li><a id='look-btn' role='button' href='#/deviceLog/" + full.id + "'> 历史日志</a></li>";
                }
                str += "<li><a id='look-btn' role='button' href='#/facility_archives/" + full.id + "'> 设备档案</a></li>";
                str += actionService.addmenu("facility", full);
                // str += "<li><a role='button'  href='#/facility_detail/DEPLOY/"+full.gatewayId+"/"+full.id+"'>存储配置</a></li>";
                str += "</ul></div>";
                return str;
              }
            });
            defaultColumns.push({
              data: "createTime",
              orderable: false,
              visible: false
            });
            //设置可以打印的下标
            for(var i = 0; i < defaultColumns.length - 2; i++)
              exportOptionsCol.push(i)
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6 margin-bottom-10">>' + $.ProudSmart.datatable.footerdom,
              language: $.ProudSmart.datatable.language,
              processing: true,
              serverSide: true,
              // scrollX:true,
              aaSorting: [
                [defaultColumns.length - 1, "desc"]
              ],
              ajax: $scope.pipeline(),
              columns: defaultColumns,
              columnDefs: defaultcolumnDefs,
              "pageLength": $scope.selLength,
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              drawCallback: function(settings) {
                var api = this.api();
                var intVal = function(i) {
                  return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                    i : 0;
                };
                
                if(api.data().length > 0) {
                  var footerHtml = "";
                  
                  for (var index in  calculateDic) {
                    calculateDic[index].total = 0;
                  }
                  
                  // Total over this page
                  if (calculateDic) {
                    footerHtml = "<span class='pull-right'><b>统计数据:</b>";
                    api.data().each( function (d) {
                      for (var index in  calculateDic) {
                        var cdata = d.values[calculateDic[index].name];
                        calculateDic[index].total += intVal(cdata);
                      }
                    })
                    for (var index in  calculateDic) {
                      var points=calculateDic[index].total.toString().split(".");
                      if (points.length > 1) {
                        if (points[1].length>4) {
                          footerHtml += "【"+calculateDic[index].label+":"+calculateDic[index].total.toFixed(4)+"】";
                        } else {
                          footerHtml += "【"+calculateDic[index].label+":"+calculateDic[index].total+"】";
                        }
                      } else {
                        footerHtml += "【"+calculateDic[index].label+":"+calculateDic[index].total+"】";
                      }
                    }
                    footerHtml += "</span>";
                  }

                  $(".footerdom").show();
                  $(".dataTables_wrapper .col-sm-6").show();
                  $(".dataTables_wrapper .col-sm-6").empty();
                  if(settings._buttons != undefined) {
                    settings._buttons = "";
                  }
                  new $.fn.dataTable.Buttons(table, {
                    buttons: [{
                      extend: 'excel',
                      title: '设备信息导出',
                      text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                      exportOptions: {
                        columns: exportOptionsCol
                      }
                    }]
                  });
                  table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
                  if (footerHtml)
                    $(".dataTables_wrapper .col-sm-6").append(footerHtml);
//              } else {
//                $(".footerdom").hide();
//                $(".dataTables_wrapper .col-sm-6").hide()
                }
              }
            });
            domMain.on('click', '#edit-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.look(row.data());
            });
            domMain.on('click', '#repair-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.repair(row.data(),function(item){
                row.data().alertSwitchOn = item.alertSwitchOn;
                row.cells().invalidate();
              });
            });
            domMain.on( 'length.dt', function (e, settings, len ) {
              $scope.selLength = len;
            } );
            $scope.fnData = function (data) {
              table.settings()[0].ajax.data = $scope.socketList;
              table.ajax.reload();
            }
          });
        }
      ]
    };
  }]);
  directives.initDirective('gatewayAccessTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.UNITTYPEINIT + "_gateway", function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              rowCallback: function(nRow, aData, iDataIndex) {
                console.log(nRow);
                $compile(nRow)($scope);
              },
              columns: [{
                title: "测点",
                data: "label"
              }, {
                title: "远程设备地址",
                data: "deviceAddress"
              }, {
                title: "寄存器类型",
                data: "registerType"
              }, {
                title: "开始位置",
                data: "startPoint"
              }, {
                title: "长度",
                data: "length"
              }, {
                title: "字节顺序",
                data: "byteOrder"
              }, {
                title: "读表达式",
                data: "readExpression"
              }, {
                title: "写表达式",
                data: "writeExpression"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "label",
                "render": function(data, type, full) {
                  return data;
                }
              }, {
                "targets": 1,
                "data": 'deviceAddress',
                "render": function(data, type, full) {
                  return "<input class='form-control col-xs-6' id='deviceAddress'  name='deviceAddress'  type='text'  maxlength='20'  style='width: 100%;' >";
                }
              }, {
                "targets": 2,
                "data": 'registerType',
                "render": function(data, type, full) {
                  var registerTypeList = [{
                    "id": "1",
                    "name": "读写线圈"
                  }, {
                    "id": "2",
                    "name": "只读寄存器"
                  }, {
                    "id": "3",
                    "name": "读写寄存器"
                  }];
                  var put = "<select id='registerType' name='registerType'  class='combobox form-control input-sm'>";
                  put += '<option value="">请选择...</option>';
                  for(var i in registerTypeList) {
                    put += '<option value="' + registerTypeList[i].id + '">' + registerTypeList[i].name + '</option>';
                  }
                  put += '</select>';
                  return put;
                }
              }, {
                "targets": 3,
                "data": 'startPoint',
                "render": function(data, type, full) {
                  return "<input class='form-control col-xs-6' id='startPoint'  name='startPoint'  type='text'  maxlength='20'   style='width: 100%;'  >";
                }
              }, {
                "targets": 4,
                "data": 'length',
                "render": function(data, type, full) {
                  return "<input class='form-control col-xs-6' id='length'  name='length'  type='text'  maxlength='20'   style='width: 100%;' >";
                }
              }, {
                "targets": 5,
                "data": 'byteOrder',
                "render": function(data, type, full) {
                  var modbusByteOrders = [{
                    l: "大端",
                    v: "BE"
                  }, {
                    l: "小端",
                    v: "LE"
                  }, {
                    l: "高字节大端",
                    v: "HLWBE"
                  }, {
                    l: "高字节小端",
                    v: "HLWBE"
                  }, {
                    l: "低字节大端",
                    v: "LHWLE"
                  }, {
                    l: "低字节小端",
                    v: "LHWLE"
                  }];
                  var put = "<select id='byteOrder' name='byteOrder'  class='combobox form-control input-sm'>";
                  put += '<option value="">请选择...</option>';
                  for(var i in modbusByteOrders) {
                    put += '<option value="' + modbusByteOrders[i].v + '">' + modbusByteOrders[i].l + '</option>';
                  }
                  put += '</select>';
                  return put;
                }
              }, {
                "targets": 6,
                "data": 'readExpression',
                "render": function(data, type, full) {
                  return "<input class='form-control col-xs-6' id='readExpression'  name='readExpression'  type='text'  maxlength='20'  style='width: 100%;'   >";
                }
              }, {
                "targets": 7,
                "data": 'writeExpression',
                "render": function(data, type, full) {
                  return "<input class='form-control col-xs-6' id='writeExpression'  name='writeExpression'  type='text'  maxlength='20'   style='width: 100%;'  >";
                }
              }]
            });
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate();
          });
        }
      ]
    }
  }]);
  directives.initDirective('pointAccessTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.UNITTYPEINIT + "_pointAccess", function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              select: $.ProudSmart.datatable.select,
              data: args.data,
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columns: [{
                title: "测点",
                data: "label"
              }, {
                title: "网关",
                data: "unit"
              }, {
                title: "传感器",
                data: "unitId"
              }, {
                title: "数据项",
                data: "isKpi"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "label",
                "render": function(data, type, full) {
                  return data;
                }
              }, {
                "targets": 1,
                "data": 'unit',
                "render": function(data, type, full) {
                  var allGateways = $scope.access.allGateways;
                  var put = "<select id='gateways' name='gateways' class='combobox form-control input-sm'>";
                  put += '<option value="">请选择...</option>';
                  for(var i in allGateways) {
                    put += '<option value="' + allGateways[i].id + '">' + allGateways[i].name + '</option>';
                    $scope.physical(allGateways[i].id, 0);
                  }
                  put += '</select>';
                  return put;
                }
              }, {
                "targets": 2,
                "data": 'unitId',
                "render": function(data, type, full) {
                  var put = "<select id='physical" + full.id + "' name='physical" + full.id + "' class='combobox form-control input-sm'>";
                  put += '<option value="">请选择...</option>';
                  put += '</select>';
                  return put;
                }
              }, {
                "targets": 3,
                "data": 'isKpi',
                "render": function(data, type, full) {
                  var allDataItems = $scope.access.allDataItems;
                  var put = "<select id='registerType' name='registerType' class='combobox form-control input-sm'>";
                  put += '<option value="">请选择...</option>';
                  for(var i in allDataItems) {
                    put += '<option value="' + allDataItems[i].id + '">' + allDataItems[i].label + '</option>';
                  }
                  put += '</select>';
                  return put;
                }
              }]
            });
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var f = $scope.faultSave;
            if(f != null && f != "") {
              row.data()["fault"] = $("#fault").val();
              $scope.doAction('saveFault', row.data());
            } else {
              growl.warning("请选择故障", {});
            }
          });
          domMain.on('change', '#gateways', function(e) {
            e.stopPropagation();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var gatewaysVal = $(this).val();
            if(gatewaysVal != "") {
              $scope.physical(gatewaysVal, row.data().id)
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate();
          });
        }
      ]
    }
  }]);
});