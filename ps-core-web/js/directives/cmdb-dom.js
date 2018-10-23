define(['directives/directives','datatables.net','datatables.net-bs','bootstrap-daterangepicker'], function(directives,datatables,daterangepicker) {
  'use strict';
  directives.initDirective('cmdbTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.CMDBINFOSINIT, function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            itemAttrs = args.option[1];
            table = domMain.DataTable({
              order: [
                [0, "desc"]
              ],
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.option[0],
              columns: [{
                data: "createTime",
                title: "上线时间"
              }, {
                data: "externalDevId",
                title: "设备地址"
              }, {
                data: "label",
                title: "名称"
              }, {
                data: "onlineStatus",
                title: "在线状态"
              }, {
                data: "health",
                title: "健康度"
              }, {
                data: "option",
                orderable: false,
                title: "操作"
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
              }, {
                targets: 2,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit == 2 && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 3,
                data: "onlineStatus",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  return "<span class='label " + (data == 'online' ? "label-primary" : "label-warning") + "'>" + (data == 'online' ? "在线" : "离线") + "</span>";
                }
              }, {
                targets: 4,
                data: "health",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  return "<div class='progress progress-xs progress-striped active'><div class='progress-bar " + (data > 90 ? "progress-bar-success" : (data > 79 ? "progress-bar-warning" : (data > 59 ? "progress-bar-minor" : (data > 39 ? "progress-bar-major" : "progress-bar-red")))) + "' style='width:" + data + "%'></div></div>";
                }
              }, {
                targets: 5,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var str = "";
                  if(full.isEdit == 2) {
                    str = '<div class="btn-group  btn-group-sm">' +
                      '<a id="save-btn" class="btn btn-default" ><i class="fa fa-check  hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                      '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';

                  } else {

                    str = "<div class='btn-group  table-option-group btn-group-sm'>" +
                      "<button type='button' class='btn btn-default'>操作</button>" +
                      "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>" +
                      "<span class='caret'></span>" +
                      "<span class='sr-only'>Toggle Dropdown</span>" +
                      "</button>" +
                      "<ul class='dropdown-menu' role='menu'>" +
                      "<li><a href='#/configAlert/" + full.id + "/node'>告警</a></li>" +
                      //"<li><a href='#/emcsView/" + full.viewId + "/" + full.id + "'>性能</a></li>" +
                      "<li><a href='#/emcsView/" + full.id + "'>性能</a></li>" +
                                            // "<li><a href='#/timeline/" + full.id + "'>大事件</a></li>" +
                      "<li><a href='#/directiveview/" + full.data.modelId + "/" + full.id + "'>发送指令</a></li>" +
                      // "<li><a href='#/force/" + full.id + "'>关系图</a></li>" +
                      "<li><a href id='export-btn'>导出模板</a></li>" +
                      "<li><a href id='edit-btn'>编辑</a></li>" +
                      "</ul>" +
                      "</div>"
                  }
                  return str;
                }
              }],
              rowCallback: function(nRow, aData, iDataIndex) {
                if(aData.selected) {
                  nRow.className = "success";
                }
                $compile(nRow)($scope);
              }
            });
          });
          /* Formatting function for row details - modify as you need */
          function format(d) {
            // `d` is the original data object for the row
            var returnStr;
            if(d.isEdit > 0) {
              returnStr = '<table width="100%" class="table table-inner">';
              for(var i in itemAttrs) {
                var attr = itemAttrs[i];
                returnStr += '<tr role="row">' +
                  '<td class="col-xs-3">' + attr.label + ':</td>';
                if(attr.dataType == "numberic") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="number" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '"></td>';
                } else if(attr.dataType == "icon") {
                  var addsIcon = "";
                  if(d.values.hasOwnProperty(attr.name)) {
                    addsIcon = d.values[attr.name];
                  }
                  returnStr += '<td><div name="' + attr.name + '" datatype="' + attr.dataType + '" class="col-sm-12 no-padding iconSelect">' +
                    '<select class="combobox form-control input-sm iconShow">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.iconList) {
                    if($scope.iconList[i].icon == addsIcon) {
                      returnStr += '<option selected="true" value="' + $scope.iconList[i].icon + '">' + $scope.iconList[i].title + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.iconList[i].icon + '">' + $scope.iconList[i].title + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '</div></td>';
                } else if(attr.dataType == "standardAddress") {
                  var adds = [];
                  if(d.values.hasOwnProperty(attr.name)) {
                    adds = d.values[attr.name].split(",");
                  }
                  returnStr += '<td><div name="' + attr.name + '" datatype="' + attr.dataType + '" class="col-sm-12 no-padding selectList">' +
                    '<select class="combobox form-control input-sm province">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.provinces) {
                    if(adds.length > 0 && $scope.provinces[i].label == adds[0]) {
                      $scope.citys = $scope.provinces[i].children;
                      returnStr += '<option selected="true" value="' + $scope.provinces[i].id + '">' + $scope.provinces[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.provinces[i].id + '">' + $scope.provinces[i].label + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '<select class="combobox form-control input-sm city ' + (adds.length > 1 ? '' : 'ng-hide') + '">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.citys) {
                    if(adds.length > 1 && $scope.citys[i].label == adds[1]) {
                      $scope.districts = $scope.citys[i].children;
                      returnStr += '<option selected="true" value="' + $scope.citys[i].id + '">' + $scope.citys[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.citys[i].id + '">' + $scope.citys[i].label + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '<select class="combobox form-control input-sm district ' + (adds.length > 2 ? '' : 'ng-hide') + '">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.districts) {
                    if(adds.length == 3 && $scope.districts[i].label == adds[2]) {
                      returnStr += '<option selected="true" value="' + $scope.districts[i].id + '">' + $scope.districts[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.districts[i].id + '">' + $scope.districts[i].label + '</option>';
                    }
                  }
                  returnStr += '</select>';
                  returnStr += '</div></td>';
                } else if(attr.dataType == "datetime") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd HH:mm:ss') : '') + '"></td>';
                } else if(attr.dataType == "date") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd') : '') + '"></td>';
                } else {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '"></td>';
                }
                returnStr += '</tr>';
              }
              returnStr += '<tr>' +
                '<td><div class="btn-group btn-group-sm">' +
                '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                '<a id="cancel-btn" class="btn btn-default"><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>' +
                '</tr>' +
                '</table>';
            } else {
              returnStr = '<table width="100%" class="table table-inner">';
              for(var i in itemAttrs) {
                var attr = itemAttrs[i];
                returnStr += '<tr role="row">' +
                  '<td class="col-xs-3">' + attr.label + ':</td>';
                if(attr.dataType == "datetime") {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd hh:mm:ss') : '') + '</td>';
                } else if(attr.dataType == "date") {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd') : '') + '</td>';
                } else {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '</td>';
                }
                returnStr += '</tr>';
              }
              returnStr += '</table>';
            }
            return returnStr;
          }

          domMain.on('click', 'td', function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if(rowData) {
              if(($(this).context.cellIndex == 5 && row.data().isEdit == 0)) {
                return;
              }
              if(row.child.isShown()) {
                // This row is already open - close it
                if(row.data().isEdit == 0) {
                  row.child.hide();
                  tr.removeClass('shown');
                } else if(row.data().isEdit == 2 || row.data().isEdit == 3) {
                  row.child(format(row.data())).show();
                  tr.addClass('shown');
                }
              } else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
              }

              if(row.data().isEdit == 2) {
                $(".selectList").each(function() {
                  var temp_html;
                  var oProvince = $(this).find(".province");
                  var oCity = $(this).find(".city");
                  var oDistrict = $(this).find(".district");

                  //赋值市
                  var city = function() {
                    temp_html = '<option value="">请选择...</option>';
                    var n = oProvince.get(0).selectedIndex;
                    if(n == 0) {
                      oCity.addClass("ng-hide");
                    } else {
                      $scope.citys = $scope.provinces[n - 1].children;
                      oCity.removeClass("ng-hide");
                      $.each($scope.citys, function(i, city) {
                        temp_html += "<option value='" + city.id + "'>" + city.label + "</option>";
                      });
                      oCity.html(temp_html);
                      district();
                    }

                  };
                  //赋值县
                  var district = function() {
                    temp_html = '<option value="">请选择...</option>';
                    var n = oCity.get(0).selectedIndex;
                    if(n == 0) {
                      oDistrict.addClass("ng-hide");
                    } else {
                      $scope.districts = $scope.citys[n - 1].children;
                      oDistrict.removeClass("ng-hide");
                      $.each($scope.districts, function(i, district) {
                        temp_html += "<option value='" + district.id + "'>" + district.label + "</option>";
                      });
                      oDistrict.html(temp_html);
                    };
                  };
                  //选择省改变市
                  oProvince.change(function() {
                    city();
                  });
                  //选择市改变县
                  oCity.change(function() {
                    district();
                  });
                });
              }
            } else {
              e.stopPropagation();
              e.preventDefault();
              var ipts = $(this).find('input');
              $.each(ipts, function(i, val) {
                if($(val).attr("datatype") == 'datetime') {
                  $(val).daterangepicker({
                      singleDatePicker: true,
                      showDropdowns: true,
                      timePicker: true,
                      minDate: '2000-01-01 00:00:00',
                      maxDate: '2025-12-31 23:59:59',
                      locale: {
                        format: "YYYY-MM-DD HH:mm:ss",
                        applyLabel: "确定",
                        cancelLabel: "取消",
                        daysOfWeek: [
                          "日",
                          "一",
                          "二",
                          "三",
                          "四",
                          "五",
                          "六"
                        ],
                        monthNames: [
                          "一月",
                          "二月",
                          "三月",
                          "四月",
                          "五月",
                          "六月",
                          "七月",
                          "八月",
                          "九月",
                          "十月",
                          "十一月",
                          "十二月"
                        ],
                        firstDay: 1
                      }

                    },
                    function(start, end, label) {

                    });

                  $(val).attr("datatype", "");
                  $(val).click();
                } else if($(val).attr("datatype") == 'date') {
                  $(val).daterangepicker({
                      singleDatePicker: true,
                      showDropdowns: true,
                      timePicker: false,
                      minDate: '2000-01-01',
                      maxDate: '2025-12-31',
                      locale: {
                        format: "YYYY-MM-DD",
                        applyLabel: "确定",
                        cancelLabel: "取消",
                        daysOfWeek: [
                          "日",
                          "一",
                          "二",
                          "三",
                          "四",
                          "五",
                          "六"
                        ],
                        monthNames: [
                          "一月",
                          "二月",
                          "三月",
                          "四月",
                          "五月",
                          "六月",
                          "七月",
                          "八月",
                          "九月",
                          "十月",
                          "十一月",
                          "十二月"
                        ],
                        firstDay: 1
                      }

                    },
                    function(start, end, label) {});

                  $(val).attr("datatype", "");
                  $(val).click();
                }
              });
            }
          });
          domMain.on('click', '#export-btn', function(e) {
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('export', row.data());
          })
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var checkPass = true;
            var selectRow = null;
            for(var i in table.rows('.shown').data()) {
              if(table.rows('.shown').data()[i].isEdit == 2)
                selectRow = table.rows('.shown').data()[i];
            }
            $.each($('.shown').children(), function(j, val1) {
              var jqob1 = $(val1);

              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = jqob1.children("input").val();

                if(txt) {
                  $(val1).removeClass('danger');
                  //									jqob1.html(txt);
                  table.cell(jqob1).data(txt); //修改DataTables对象的数据
                } else {
                  if(j == 1 || j == 2) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }
                }
              }
            });
            var ipts = tr.parent().find('input');
            $.each(ipts, function(i, val) {
              var txt = $(val).val();
              var attrname = $(val).attr('name');
              selectRow.values[attrname] = txt;
            });
            $(".iconSelect").each(function() {
              var iconList = $(this).find(".iconShow");
              var id = $(iconList).val();
              var attrname = $(this).attr('name');
              selectRow.values[attrname] = id;
            });
            $(".selectList").each(function() {
              var oProvince = $(this).find(".province");
              var oCity = $(this).find(".city");
              var oDistrict = $(this).find(".district");
              var id = $(oDistrict).val();
              if(!id) {
                id = $(oCity).val();
              }
              if(!id) {
                id = $(oProvince).val();
              }
              var attrname = $(this).attr('name');
              selectRow.values[attrname] = id;
            });
            if(checkPass) {
              selectRow.isEdit = 0;
              $scope.doAction('save', selectRow);
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var row = table.row('.shown');
            if (row) {
              row.data().isEdit = 0;
              row.child.hide();
              row.cells().invalidate();
            }
          });

          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);
            if(!isEditing) {
              isEditing = true;
              row.data().isEdit = 2;
              row.cells().invalidate();
            } else {
              if(row.data().isEdit == 0)
                $scope.doAction('eidterror')
            }
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('delete', row.data());
          });
          domMain.on('click', '#change-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('change', row.data());
          });
          domMain.on('click', '#dir-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('directive', row.data());
          });
        }
      ]
    };
  }]);
  directives.initDirective('shadowsTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.CMDBINFOSINIT + "_shadows", function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              order: [
                [0, "desc"]
              ],
              dom: '<"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.option,
              columns: [{
                data: "physicalDeviceDomain",
                title: "客户名称"
              }, {
                data: "label",
                title: "设备名称"
              }, {
                data: "externalDevId",
                title: "设备地址"
              }, {
                data: "createTime",
                title: "上线时间"
              }, {
                data: "onlineStatus",
                title: "在线状态"
              }, {
                data: "modelId",
                title: "设备模板"
              }, {
                data: "domainPath",
                title: "所属域"
              }, {
                data: "health",
                title: "健康度"
              }, {
                data: "option",
                orderable: false,
                title: "操作"
              }],
              columnDefs: [{
                targets: 3,
                data: "createTime",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  var str = "<date-label value=" + data + " format='yyyy-MM-dd HH:mm:ss'>";
                  return str;
                }
              }, {
                targets: 4,
                data: "onlineStatus",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  return "<span class='label " + (data == 'online' ? "label-primary" : "label-warning") + "'>" + (data == 'online' ? "在线" : "离线") + "</span>";
                }
              }, {
                targets: 7,
                data: "health",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  return "<div class='progress progress-xs progress-striped active'><div class='progress-bar " + (data > 90 ? "progress-bar-success" : (data > 79 ? "progress-bar-warning" : (data > 59 ? "progress-bar-minor" : (data > 39 ? "progress-bar-major" : "progress-bar-red")))) + "' style='width:" + data + "%'></div></div>";
                }
              }, {
                targets: 0,
                data: "physicalDeviceDomain",
                render: function(data, type, full) {
                  var str = "";
                  $scope.userGridData.forEach(function(user) {
                    if(user.domainPath == data) {
                      str = user.customerName;
                    }
                  })
                  return str;
                }
              }, {
                targets: 6,
                data: "domainPath",
                render: function(data, type, full) {
                  var str = "";
                  if(full.isEdit == 2 && type == "display") {
                    if(data != null && data != "" && $scope.domainListDic) {
                      var selectDomain = $scope.domainListDic[data].name;
                      if(selectDomain)
                        str += '<input name="domainPath" domain-Picker class="form-control domainClass" type="text" value="' + selectDomain + '" gatewayDomainPath="' + full.gatewayDomainPath + '" domainPath="' + data + '" model="">';
                    }
                    if(!str) {
                      str += "<input  name='domainPath'  domain-Picker class='form-control domainClass' type='text' gatewayDomainPath='" + full.gatewayDomainPath + "' domainPath='' value='请选择...'>"
                    }
                  } else {
                    str += $scope.domainListDic[data].name;
                  }

                  return str;
                }
              }, {
                targets: 5,
                data: "modelId",
                render: function(data, type, full) {
                  var str = "";
                  if(full.isEdit == 2 && type == "display") {
                    if(data != null && data != "" && $scope.rootModelDic) {
                      var selectModel = $scope.rootModelDic[data];
                      if(selectModel)
                        str += '<input name="modelId" model-Picker class="form-control domainClass" type="text" value="' + selectModel.label + '" modelId="' + data + '" model="">';
                    }
                    if(!str) {
                      str += "<input  name='modelId'  model-Picker class='form-control domainClass' type='text' modelId='' value='请选择...'>"
                    }
                  } else {
                    if($scope.rootModelDic && $scope.rootModelDic[data])
                      str += $scope.rootModelDic[data].name;
                    else
                      str += "无法识别模型"
                  }
                  return str;
                }
              }, {

                targets: 8,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  return "<div class='btn-group table-option-group'>" +
                    "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                    "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                    "<span class='caret'></span>" +
                    "<span class='sr-only'>Toggle Dropdown</span>" +
                    "</button>" +
                    "<ul class='dropdown-menu' role='menu'>" +
                    "<li><a href='#/configAlert/" + full.id + "/node'>告警</a></li>" +
                    //"<li><a href='#/emcsView/" + full.viewId + "/" + full.id + "'>性能</a></li>" +
                    "<li><a href='#/emcsView/" + full.id + "'>性能</a></li>" +
                                        // "<li><a href='#/timeline/" + full.id + "'>大事件</a></li>" +
                    "</ul>" +
                    "</div>"
                }
              }],
              rowCallback: function(nRow, aData, iDataIndex) {
                if(aData.selected) {
                  nRow.className = "success";
                }
                $compile(nRow)($scope);
              }
            });
          });
          /* Formatting function for row details - modify as you need */
          function format(d) {
            // `d` is the original data object for the row
            var returnStr;
            if(d.isEdit > 0) {
              returnStr = '<table width="100%" class="table table-inner">';
              for(var i in itemAttrs) {
                var attr = itemAttrs[i];
                returnStr += '<tr role="row">' +
                  '<td>' + attr.label + ':</td>';
                if(attr.dataType == "numberic") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="number" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '"></td>';
                } else if(attr.dataType == "icon") {
                  var addsIcon = "";
                  if(d.values.hasOwnProperty(attr.name)) {
                    addsIcon = d.values[attr.name];
                  }
                  returnStr += '<td><div name="' + attr.name + '" datatype="' + attr.dataType + '" class="col-sm-12 no-padding iconSelect">' +
                    '<select class="combobox form-control input-sm iconShow">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.iconList) {
                    if($scope.iconList[i].icon == addsIcon) {
                      returnStr += '<option selected="true" value="' + $scope.iconList[i].icon + '">' + $scope.iconList[i].title + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.iconList[i].icon + '">' + $scope.iconList[i].title + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '</div></td>';
                } else if(attr.dataType == "standardAddress") {
                  var adds = [];
                  if(d.values.hasOwnProperty(attr.name)) {
                    adds = d.values[attr.name].split(",");
                  }
                  returnStr += '<td><div name="' + attr.name + '" datatype="' + attr.dataType + '" class="col-sm-12 no-padding selectList">' +
                    '<select class="combobox form-control input-sm province">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.provinces) {
                    if(adds.length > 0 && $scope.provinces[i].label == adds[0]) {
                      $scope.citys = $scope.provinces[i].children;
                      returnStr += '<option selected="true" value="' + $scope.provinces[i].id + '">' + $scope.provinces[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.provinces[i].id + '">' + $scope.provinces[i].label + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '<select class="combobox form-control input-sm city ' + (adds.length > 1 ? '' : 'ng-hide') + '">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.citys) {
                    if(adds.length > 1 && $scope.citys[i].label == adds[1]) {
                      $scope.districts = $scope.citys[i].children;
                      returnStr += '<option selected="true" value="' + $scope.citys[i].id + '">' + $scope.citys[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.citys[i].id + '">' + $scope.citys[i].label + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '<select class="combobox form-control input-sm district ' + (adds.length > 2 ? '' : 'ng-hide') + '">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.districts) {
                    if(adds.length == 3 && $scope.districts[i].label == adds[2]) {
                      returnStr += '<option selected="true" value="' + $scope.districts[i].id + '">' + $scope.districts[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.districts[i].id + '">' + $scope.districts[i].label + '</option>';
                    }
                  }
                  returnStr += '</select>';
                  returnStr += '</div></td>';
                } else if(attr.dataType == "datetime") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd HH:mm:ss') : '') + '"></td>';
                } else if(attr.dataType == "date") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd') : '') + '"></td>';
                } else {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '"></td>';
                }
                returnStr += '</tr>';
              }
              returnStr += '<tr>' +
                '<td><div class="btn-group btn-group-sm">' +
                '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>' +
                '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>' +
                '</tr>' +
                '</table>';
            } else {
              returnStr = '<table width="100%" class="table table-inner">';
              for(var i in itemAttrs) {
                var attr = itemAttrs[i];
                returnStr += '<tr role="row">' +
                  '<td>' + attr.label + ':</td>';
                if(attr.dataType == "datetime") {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd hh:mm:ss') : '') + '</td>';
                } else if(attr.dataType == "date") {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd') : '') + '</td>';
                } else {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '</td>';
                }
                returnStr += '</tr>';
              }
              returnStr += '</table>';
            }
            return returnStr;
          }

          domMain.on('click', 'td', function(e) {});
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var checkPass = true;
            var selectRow = null;
            for(var i in table.rows('.shown').data()) {
              if(table.rows('.shown').data()[i].isEdit == 2)
                selectRow = table.rows('.shown').data()[i];
            }
            $.each($('.shown').children(), function(j, val1) {
              var jqob1 = $(val1);

              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = jqob1.children("input").val();

                if(txt) {
                  $(val1).removeClass('danger');
                  //                  jqob1.html(txt);
                  table.cell(jqob1).data(txt); //修改DataTables对象的数据
                } else {
                  if(j == 1) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }
                }
              }
            });
            var ipts = tr.parent().find('input');
            $.each(ipts, function(i, val) {
              var txt = $(val).val();
              var attrname = $(val).attr('name');
              selectRow.values[attrname] = txt;
            });
            $(".iconSelect").each(function() {
              var iconList = $(this).find(".iconShow");
              var id = $(iconList).val();
              var attrname = $(this).attr('name');
              selectRow.values[attrname] = id;
            });
            $(".selectList").each(function() {
              var oProvince = $(this).find(".province");
              var oCity = $(this).find(".city");
              var oDistrict = $(this).find(".district");
              var id = $(oDistrict).val();
              if(!id) {
                id = $(oCity).val();
              }
              if(!id) {
                id = $(oProvince).val();
              }
              var attrname = $(this).attr('name');
              selectRow.values[attrname] = id;
            });
            if(checkPass) {
              selectRow.isEdit = 0;
              $scope.doAction('save', selectRow);
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var row = table.row('.shown');
            if (row) {
              row.data().isEdit = 0;
              row.child.hide();
              row.cells().invalidate();
            }
          });

          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);
            if(!isEditing) {
              isEditing = true;
              row.data().isEdit = 1;
            } else {
              if(row.data().isEdit == 0)
                $scope.doAction('eidterror')
            }
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('delete', row.data());
          });
          domMain.on('click', '#change-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('change', row.data());
          });
          domMain.on('click', '#dir-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('directive', row.data());
          });
        }
      ]
    };
  }]);
  directives.initDirective('cmdbGroupTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter,growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.CMDBINFOSINIT, function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            itemAttrs = args.option[1];
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.option[0],
              order: [[4, "asc"]],
              columns: [{
                data: "label",
                title: "名称"
              }, {
                data: "onlineStatus",
                title: "在线状态"
              }, {
                data: "health",
                title: "健康度"
              }, {
                data: "domainPath",
                title: "资源域"
              }, {
                data: "id",
                title: "编码",
                visible: true
              }, {
                data: "option",
                orderable: false,
                title: "操作"
              }],
              columnDefs: [{
                targets: 0,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if(full.isEdit == 2 && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 1,
                data: "onlineStatus",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  return "<span class='label " + (data == 'online' ? "label-primary" : "label-warning") + "'>" + (data == 'online' ? "在线" : "离线") + "</span>";
                }
              }, {
                targets: 2,
                data: "health",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  return "<div class='progress progress-xs progress-striped active'><div class='progress-bar " + (data > 90 ? "progress-bar-success" : (data > 79 ? "progress-bar-warning" : (data > 59 ? "progress-bar-minor" : (data > 39 ? "progress-bar-major" : "progress-bar-red")))) + "' style='width:" + data + "%'></div></div>";
                }
              }, {
                "targets": 3,
                "data": "domainPath",
                "render": function(data, type, full) {
                  var str = "";
                  var selectDomain = $scope.domainListDic[data].name;
                  if (full.isEdit == 2 && type == "display") {
                    str += "<input name='domainPath' domain-Picker class='form-control input-sm' type='text' value='" + selectDomain + "' domainPath='" + data + "'>";
                    if (!str) {
                      str += "<input name='domainPath'  domain-Picker class='form-control input-sm' type='text' domainPath='' value='请选择...'>"
                    }
                  } else {
                    str += selectDomain;
                  }
                  return str;
                }
              }, {
                targets: 5,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  var str = "";
                  if(full.isEdit == 2) {
                    str = '<div class="btn-group  btn-group-sm">' +
                      '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                      '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';

                  } else {

                    str = "<div class='btn-group  table-option-group btn-group-sm'>" +
                      "<button type='button' class='btn btn-default'>操作</button>" +
                      "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>" +
                      "<span class='caret'></span>" +
                      "<span class='sr-only'>Toggle Dropdown</span>" +
                      "</button>" +
                      "<ul class='dropdown-menu' role='menu'>" +
                      "<li><a href='#/configAlert/" + full.id + "/node'>告警</a></li>" +
                      //"<li><a href='#/emcsView/" + full.viewId + "/" + full.id + "'>性能</a></li>" +
                      "<li><a href='#/emcsView/" + full.id + "'>性能</a></li>" +
                      //                    "<li><a href='#/timeline/" + full.id + "'>大事件</a></li>" +
                      //                    "<li><a href='#/directiveview/" + full.data.modelId + "/" + full.id + "'>发送指令</a></li>" +
                      // "<li><a href='#/force/" + full.id + "'>关系图</a></li>" +
                      //                    "<li><a href id='export-btn'>导出模板</a></li>" +
                      "<li><a href id='edit-btn'>编辑</a></li>" +
                      "<li><a href id='del-btn'>删除</a></li>" +
                      "</ul>" +
                      "</div>"
                  }
                  return str;
                }
              }],
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              }
            });
          });
          /* Formatting function for row details - modify as you need */
          function format(d) {
            // `d` is the original data object for the row
            var returnStr;
            if(d.isEdit > 0) {
              returnStr = '<table width="100%" class="table table-inner">';
              for(var i in itemAttrs) {
                var attr = itemAttrs[i];
                returnStr += '<tr role="row">' +
                  '<td class="col-xs-3">' + attr.label + ':</td>';
                if(attr.dataType == "numberic") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="number" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '"></td>';
                } else if(attr.dataType == "icon") {
                  var addsIcon = "";
                  if(d.values.hasOwnProperty(attr.name)) {
                    addsIcon = d.values[attr.name];
                  }
                  returnStr += '<td><div name="' + attr.name + '" datatype="' + attr.dataType + '" class="col-sm-12 no-padding iconSelect">' +
                    '<select class="combobox form-control input-sm iconShow">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.iconList) {
                    if($scope.iconList[i].icon == addsIcon) {
                      returnStr += '<option selected="true" value="' + $scope.iconList[i].icon + '">' + $scope.iconList[i].title + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.iconList[i].icon + '">' + $scope.iconList[i].title + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '</div></td>';
                } else if(attr.dataType == "standardAddress") {
                  var adds = [];
                  if(d.values.hasOwnProperty(attr.name)) {
                    adds = d.values[attr.name].split(",");
                  }
                  returnStr += '<td><div name="' + attr.name + '" datatype="' + attr.dataType + '" class="col-sm-12 no-padding selectList">' +
                    '<select class="combobox form-control input-sm province">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.provinces) {
                    if(adds.length > 0 && $scope.provinces[i].label == adds[0]) {
                      $scope.citys = $scope.provinces[i].children;
                      returnStr += '<option selected="true" value="' + $scope.provinces[i].id + '">' + $scope.provinces[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.provinces[i].id + '">' + $scope.provinces[i].label + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '<select class="combobox form-control input-sm city ' + (adds.length > 1 ? '' : 'ng-hide') + '">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.citys) {
                    if(adds.length > 1 && $scope.citys[i].label == adds[1]) {
                      $scope.districts = $scope.citys[i].children;
                      returnStr += '<option selected="true" value="' + $scope.citys[i].id + '">' + $scope.citys[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.citys[i].id + '">' + $scope.citys[i].label + '</option>';
                    }

                  }
                  returnStr += '</select>';
                  returnStr += '<select class="combobox form-control input-sm district ' + (adds.length > 2 ? '' : 'ng-hide') + '">' +
                    '<option value="">请选择...</option>';
                  for(var i in $scope.districts) {
                    if(adds.length == 3 && $scope.districts[i].label == adds[2]) {
                      returnStr += '<option selected="true" value="' + $scope.districts[i].id + '">' + $scope.districts[i].label + '</option>';
                    } else {
                      returnStr += '<option value="' + $scope.districts[i].id + '">' + $scope.districts[i].label + '</option>';
                    }
                  }
                  returnStr += '</select>';
                  returnStr += '</div></td>';
                } else if(attr.dataType == "datetime") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd HH:mm:ss') : '') + '"></td>';
                } else if(attr.dataType == "date") {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd') : '') + '"></td>';
                } else {
                  returnStr += '<td><input datatype="' + attr.dataType + '" class="form-control input-sm" type="text" name="' + attr.name + '" value="' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '"></td>';
                }
                returnStr += '</tr>';
              }
              returnStr += '<tr>' +
                '<td><div class="btn-group btn-group-sm">' +
                '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>' +
                '</tr>' +
                '</table>';
            } else {
              returnStr = '<table width="100%" class="table table-inner">';
              for(var i in itemAttrs) {
                var attr = itemAttrs[i];
                returnStr += '<tr role="row">' +
                  '<td class="col-xs-3">' + attr.label + ':</td>';
                if(attr.dataType == "datetime") {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd hh:mm:ss') : '') + '</td>';
                } else if(attr.dataType == "date") {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? $filter('date')(d.values[attr.name], 'yyyy-MM-dd') : '') + '</td>';
                } else {
                  returnStr += '<td>' + (d.values.hasOwnProperty(attr.name) ? d.values[attr.name] : '') + '</td>';
                }
                returnStr += '</tr>';
              }
              returnStr += '</table>';
            }
            return returnStr;
          }
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addIns()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加设备组</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', 'td', function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if(rowData) {
              if($(this).context.cellIndex == 5 && row.data().isEdit == 0) {
                return;
              }
              if(row.child.isShown()) {
                // This row is already open - close it
                if(row.data().isEdit == 0) {
                  row.child.hide();
                  tr.removeClass('shown');
                } else if(row.data().isEdit == 2 || row.data().isEdit == 3) {
                  row.child(format(row.data())).show();
                  tr.addClass('shown');
                }
              } else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
              }

              if(row.data().isEdit == 2) {
                $(".selectList").each(function() {
                  var temp_html;
                  var oProvince = $(this).find(".province");
                  var oCity = $(this).find(".city");
                  var oDistrict = $(this).find(".district");

                  //赋值市
                  var city = function() {
                    temp_html = '<option value="">请选择...</option>';
                    var n = oProvince.get(0).selectedIndex;
                    if(n == 0) {
                      oCity.addClass("ng-hide");
                    } else {
                      $scope.citys = $scope.provinces[n - 1].children;
                      oCity.removeClass("ng-hide");
                      $.each($scope.citys, function(i, city) {
                        temp_html += "<option value='" + city.id + "'>" + city.label + "</option>";
                      });
                      oCity.html(temp_html);
                      district();
                    }

                  };
                  //赋值县
                  var district = function() {
                    temp_html = '<option value="">请选择...</option>';
                    var n = oCity.get(0).selectedIndex;
                    if(n == 0) {
                      oDistrict.addClass("ng-hide");
                    } else {
                      $scope.districts = $scope.citys[n - 1].children;
                      oDistrict.removeClass("ng-hide");
                      $.each($scope.districts, function(i, district) {
                        temp_html += "<option value='" + district.id + "'>" + district.label + "</option>";
                      });
                      oDistrict.html(temp_html);
                    };
                  };
                  //选择省改变市
                  oProvince.change(function() {
                    city();
                  });
                  //选择市改变县
                  oCity.change(function() {
                    district();
                  });
                });
              }
            } else {
              e.stopPropagation();
              e.preventDefault();
              var ipts = $(this).find('input');
              $.each(ipts, function(i, val) {
                if($(val).attr("datatype") == 'datetime') {
                  $(val).daterangepicker({
                      singleDatePicker: true,
                      showDropdowns: true,
                      timePicker: true,
                      minDate: '2000-01-01 00:00:00',
                      maxDate: '2025-12-31 23:59:59',
                      locale: {
                        format: "YYYY-MM-DD HH:mm:ss",
                        applyLabel: "确定",
                        cancelLabel: "取消",
                        daysOfWeek: [
                          "日",
                          "一",
                          "二",
                          "三",
                          "四",
                          "五",
                          "六"
                        ],
                        monthNames: [
                          "一月",
                          "二月",
                          "三月",
                          "四月",
                          "五月",
                          "六月",
                          "七月",
                          "八月",
                          "九月",
                          "十月",
                          "十一月",
                          "十二月"
                        ],
                        firstDay: 1
                      }

                    },
                    function(start, end, label) {

                    });

                  $(val).attr("datatype", "");
                  $(val).click();
                } else if($(val).attr("datatype") == 'date') {
                  $(val).daterangepicker({
                      singleDatePicker: true,
                      showDropdowns: true,
                      timePicker: false,
                      minDate: '2000-01-01',
                      maxDate: '2025-12-31',
                      locale: {
                        format: "YYYY-MM-DD HH:mm:ss",
                        applyLabel: "确定",
                        cancelLabel: "取消",
                        daysOfWeek: [
                          "日",
                          "一",
                          "二",
                          "三",
                          "四",
                          "五",
                          "六"
                        ],
                        monthNames: [
                          "一月",
                          "二月",
                          "三月",
                          "四月",
                          "五月",
                          "六月",
                          "七月",
                          "八月",
                          "九月",
                          "十月",
                          "十一月",
                          "十二月"
                        ],
                        firstDay: 1
                      }

                    },
                    function(start, end, label) {});

                  $(val).attr("datatype", "");
                  $(val).click();
                }
              });
            }
          });
          domMain.on('click', '#export-btn', function(e) {
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('export', row.data());
          })
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            if ($('save-btn').attr('disabled')) return;
            var tr = $(this).closest('tr');
            var checkPass = true;
            var selectRow = null;
            var domainSelect;
            for(var i in table.rows('.shown').data()) {
              if(table.rows('.shown').data()[i].isEdit == 2)
                selectRow = table.rows('.shown').data()[i];
            }
            $.each($('.shown').children(), function(j, val1) {
              var jqob1 = $(val1);
              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                if (j != 0 && j != 3) return;
                var txt = jqob1.children("input").val();
                
                if (j == 3) {
                  txt = jqob1.children("input").attr("domainPath");
                  domainSelect = txt;
                }
                if(txt) {
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt); //修改DataTables对象的数据
                  $(tr).removeClass('danger');
                  checkPass = true;
                } else {
                  $(val1).addClass('danger');
                  checkPass = false
                  if (j == 0)
                    growl.warning('请输入名称',{})
                  if (j == 3)
                    growl.warning('请选择一个设备域',{})
                }
              }
            });
            if (!selectRow) {
              var row = table.row(tr);
              selectRow = row.data();
              var domainSelect = $(tr).find('input[name="domainPath"]').attr("domainPath");
              var domainSelectName = $(tr).find('input[name="domainPath"]').val();
              if (!domainSelect) {
                $(tr).addClass('danger');
                checkPass = false;
                growl.warning('请选择一个设备域',{})
                return;
              } else {
                $(tr).removeClass('danger');
                checkPass = true;
              }
            }
            if (checkPass) {
              var ipts = tr.parent().find('input');
              $.each(ipts, function(i, val) {
                var txt = $(val).val();
                var attrname = $(val).attr('name');
                selectRow.values[attrname] = txt;
              });
              $(".iconSelect").each(function() {
                var iconList = $(this).find(".iconShow");
                var id = $(iconList).val();
                var attrname = $(this).attr('name');
                selectRow.values[attrname] = id;
              });
              $(".selectList").each(function() {
                var oProvince = $(this).find(".province");
                var oCity = $(this).find(".city");
                var oDistrict = $(this).find(".district");
                var id = $(oDistrict).val();
                if(!id) {
                  id = $(oCity).val();
                }
                if(!id) {
                  id = $(oProvince).val();
                }
                var attrname = $(this).attr('name');
                selectRow.values[attrname] = id;
              });
            }
            
            if(checkPass) {
              $('save-btn').attr('disabled',true);
//            if (selectRow.id != 0 && selectRow['domainPath'] != domainSelect) {
//              selectRow['domainPath'] = domainSelect;
//              $scope.doAction('saveChangedDomain', selectRow, function(flg) {
//                if (flg) {
//                  isEditing = false;
//                  selectRow.isEdit = 0;
//                  $scope.doAction('save', selectRow);
//                }
//              });
//            } else {
//              selectRow['domainPath'] = domainSelect;
                $scope.doAction('save', selectRow);
//            }
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            isEditing = false;
            var row = table.row('.shown');
            if (row.data()) {
              row.data().isEdit = 0;
              row.child.hide();
              row.cells().invalidate();
              $scope.doAction('cancel', row.data());
            } else {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 0;
              row.child.hide();
              row.cells().invalidate();
              $scope.doAction('cancel', row.data());
            }
//          var tr = $(this).closest('tr');
//          var row = table.row(tr);
//          isEditing = false;
//          $scope.doAction('cancel', row.data());
          });

          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);
            if(!isEditing) {
              isEditing = true;
              row.data().isEdit = 2;
              row.cells().invalidate();
              $compile(tr)($scope);
            } else {
              if(row.data().isEdit == 0)
                $scope.doAction('eidterror')
            }
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('delete', row.data());
          });
          domMain.on('click', '#change-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('change', row.data());
          });
          domMain.on('click', '#dir-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('directive', row.data());
          });
        }
      ]
    };
  }]);
});