define(['directives/directives'], function(directives) {
  'use strict';
  directives.initDirective('kpieditTable', ['$timeout', '$compile',function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs','growl',
        function($scope, $element, $attrs,growl) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          
          $scope.$on(Event.KPIEDITINIT, function(event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              order: [[ 9, "asc" ]],
              columns: [{
                data: "name",
                title: "名称"
              }, {
                data: "label",
                title: "显示名称"
              }, {
                data: "unit",
                title: "单位"
              }, {
                data: "range",
                title: "取值范围"
              }, {
                data: "number",
                title: "是否数值"
              }, {
                data: "granularity",
                title: "采集频率"
              }, {
                data: "granularityUnit",
                title: "采集频率单位"
              }, {
                data: "icon",
                title: "图标"
              }, {
                data: "option",
                orderable: false,
                title: "操作",
                width: "100px"
              }, {
                data: "uid",
                visible: false
              }],
              columnDefs: [{
                targets: 0,
                data: "name",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if ((full.isEdit == 2 && full.id == 0) && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 1,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display")
                    return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 2,
                data: "unit",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display") {
                    var put = "<select class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for (var i in $scope.myOptions) {
                      if ($scope.myOptions[i].unitCode == data) {
                        put += '<option selected="true" value="' + $scope.myOptions[i].unitCode + '">' + $scope.myOptions[i].unitName + '</option>';
                      } else {
                        put += '<option value="' + $scope.myOptions[i].unitCode + '">' + $scope.myOptions[i].unitName + '</option>';
                      }

                    }
                    put += '</select>';
                    return put;
                  }
                  for (var i in $scope.myOptions) {
                    if ($scope.myOptions[i].unitCode == data) {
                      return $scope.myOptions[i].unitName;
                    }
                  }
                  return data;
                }
              }, {
                targets: 3,
                data: "range",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display")
                    return "<input maxlength='100' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 4,
                data: "number",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var put;
                  if (full.isEdit == 2 && type == "display") {
                    put = "<select class='combobox form-control input-sm'>";
                    if (data== true ||data=='true') {
                      put += "<option value='true' selected>是</option>";
                      put += "<option value='false'>否</option>";
                    } else {
                      put += "<option value='true'>是</option>";
                      put += "<option value='false' selected>否</option>";
                    }

                    put += "</select>";
                    return put;
                  }
                  if (data == true || data=='true') {
                    put = '是'
                  } else {
                    put = '否';
                  }
                  return put;
                }
              }, {
                targets: 5,
                data: "granularity",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display")
                    return "<input style='width:100%' class='form-control input-sm' type='number' value='" + data + "'>";
                  else
                    return data;
                }
              }, {
                targets: 6,
                data: "granularityUnit",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  if (full.isEdit == 2 && type == "display") {
                    var put = "<select class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for (var i in $scope.myDicts["KqiGranularityUnit"]) {
                      if ($scope.myDicts["KqiGranularityUnit"][i].valueCode == data) {
                        put += '<option selected="true" value="' + $scope.myDicts["KqiGranularityUnit"][i].valueCode + '">' + $scope.myDicts["KqiGranularityUnit"][i].label + '</option>';
                      } else {
                        put += '<option value="' + $scope.myDicts["KqiGranularityUnit"][i].valueCode + '">' + $scope.myDicts["KqiGranularityUnit"][i].label + '</option>';
                      }
                    }
                    put += '</select>';
                    return put;
                  }
                  var str = "";
                  for (var i in $scope.myDicts["KqiGranularityUnit"]) {
                    if ($scope.myDicts["KqiGranularityUnit"][i].valueCode == data) {
                      str = $scope.myDicts["KqiGranularityUnit"][i].label;
                      break;
                    }
                  }
                  return str;
                }
              }, {
                targets: 7,
                data: "icon",
                render: function(data, type, full) {
                  // 返回自定义内容	
                  var put = "";
                  if (full.isEdit == 2 && type == "display") {
                    put = "<select class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for (var i in $scope.kpiIconList) {
                      if ($scope.kpiIconList[i].icon == data) {
                        put += '<option selected="true" value="' + $scope.kpiIconList[i].icon + '">' + $scope.kpiIconList[i].title + '</option>';
                      } else {
                        put += '<option value="' + $scope.kpiIconList[i].icon + '">' + $scope.kpiIconList[i].title + '</option>';
                      }
                    }
                    put += '</select>';
                  } else {
                    if (data)
                      put = '<div class="btn btn-social-icon btn-bitbucket btn-sm" ><i class="' + data + '"></i></div>';
                  }
                  return put;
                }
              }, {
                targets: 8,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var str = "<div class='btn-group btn-group-sm'>";
                  if (full.isEdit == 2) {
                    str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                    if (full.isNew)
                      str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                    else
                      str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                  } else {
                    //str += "<a id='edit-btn' class='btn btn-default' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>"
                    //str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                    str += "<div class='btn-group table-option-group'>" +
                      "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                      "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                      "<span class='caret'></span>" +
                      "<span class='sr-only'>Toggle Dropdown</span>" +
                      "</button>" +
                      "<ul class='dropdown-menu' role='menu'>" +
                      "<li><a href='javascript:void(0);' id='edit-btn' >修改</a></li>" +
                      "<li><a href='javascript:void(0);' id='del-btn' >删除</a></li>" +
                      "<li><a href='javascript:void(0);' id='data-btn' >接入数据定义</a></li>" +
                      "</ul>" +
                      "</div>";
                  }
                  str += "</div>"
                  return str;
                }
              }]
            })
          });
          function format(d) {
            var dateItem = $scope.initListDate.allDataItems;
            var dateType = $scope.initListDate.allDataTypes;
            var optStr = "";
            var optStr2 = "";
            var dId = d.dataItemId;
            var dtId = d.dataTypeId;
            if(d.instance == undefined){
              var instanceData = 0;
            }else{
              var instanceData = d.instance;
            }
            for(var i in dateItem){
              if(dateItem[i].id == dId){
                optStr += "<option value='"+dateItem[i].id+"' selected>"+dateItem[i].label+"</option>";
              }else{
                optStr += "<option value='"+dateItem[i].id+"'>"+dateItem[i].label+"</option>";
              }
            }
            for(var j in dateType){
              if(dateType[j].id == dtId){
                optStr2 += "<option value='"+dateType[j].id+"' selected>"+dateType[j].name+"</option>";
              }else{
                optStr2 += "<option value='"+dateType[j].id+"'>"+dateType[j].name+"</option>";
              }
            }

            if(d != undefined) {
              // `d` is the original data object for the row
              var returnStr;

              returnStr = '<table width="60%"  class="table table-hover">' +

                '<tr>' +
                '<td >数据编码:</td>' +
                '<td><select id="dataCode" name="dataCode" class="combobox form-control input-sm"><option>请选择</option>'+optStr+'</select></td>' +
                '<td >数据类型:</td>' +
                '<td ><select id="dataType" name="dataType" class="combobox form-control input-sm"><option>请选择</option>'+optStr2+'</select></td>' +
                '</tr>' +
                '<tr>' +
                '<td>实例编号:</td>' +
                '<td  ><input id="instance" name="instance" class="form-control input-sm" type="text"   value="'+instanceData+'"/></td>' +
                '</tr>' +
                '<tr>' +
                '<td ><div class="input-group">' +
                '<a id="data-save-btn" class="btn btn-default btn-sm" style="margin-right: 15px;"><i class="fa fa-check"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                '<a id="data-cancel-btn" class="btn btn-default btn-sm"><i class="fa fa-close"></i><span class="hidden-xs ng-binding">取消</span></a></div></td>' +
                '</tr>' +
                '</table>';

              return returnStr;
            }

          }
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            if ($scope.selectedDitem) {
              var parentDom = $(".special-btn").parent();
              //parentDom.html('<a ng-click="addModelSubItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加指标</span></a>');
              parentDom.html('<select class="form-control" style="min-width:200px" selectdata="kpiList" itemchange="kpichangehandler" select2></select>');
              $compile(parentDom)($scope);
            }
          });
          domMain.on('click', '#data-btn', function(e) {
            e.stopPropagation();
            var selStatus = table.$('tr.shown');
            if(selStatus.length < 1){
              var tr = $(this).closest('tr');
              tr.addClass('shown');
              var row = table.row(tr);
              $(".open>.dropdown-menu").css("display","none");
              row.child(format(row.data())).show();
            }else{
              growl.warning("您正在操作，请先保存或者取消再进行此操作",{});
            }
          });
          domMain.on('click', '#data-save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var selectRow = table.row('.shown');
            var sel = selectRow.data();
            if($("#instance").val().length > 4){
              growl.warning("您输入的实例编号过长，最多只能输入4位",{});
              return;
            }
            if($("#dataCode").val() == "请选择"){
              growl.warning("数据编码是必填项，请选择",{});
              return;
            }
            if($("#dataType").val() == "请选择"){
              growl.warning("数据类型是必填项，请选择",{});
              return;
            }
            selectRow.data()["dataItemId"] = $("#dataCode").val();
            selectRow.data()["dataTypeId"] = $("#dataType").val();
            selectRow.data()["instance"] = $("#instance").val();
            $scope.doAction("kpi-data-save", sel, function(returnObj) {
              if (returnObj == false) {
                row.data().isEdit = 2;
              } else {
                selectRow.data().id = returnObj.id;
                selectRow.data().uid = returnObj.uid;
                selectRow.data().isEdit = 0;
                selectRow.data().isNew = false;
                isEditing = false;
                $scope.doAction('data-cancel');
              }
            });
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.data().isEdit == 2) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if (i == 0 || i == 1) {
                  if (jqob.children("input").length > 0) {
                    var txt = jqob.children("input").val();
                    if (!jQuery.trim(txt)) {
                      $(val).addClass('danger');
                      checkPass = false;
                      row.data().isEdit = 2;
                      // row.cells().invalidate();//会更新已经输入的值
                      growl.warning("该字段不能为空!",{})
                      return false
                    } else {
                      $(val).removeClass('danger');
                    }
                  }
                }
                if (i == 2) {
                  var txt = $(val).children("select").val();
                  if (!txt) {
                    $(val).addClass('danger');
                    row.data().isEdit = 2;
                    // row.cells().invalidate();//会更新已经输入的值
                    checkPass = false;
                    growl.warning("请选择一个单位!",{})
                    return false
                  } else {
                    $(val).removeClass('danger');
                  }
                  jqob.html(txt);
                  table.cell(jqob).data(txt); //修改DataTables对象的数据
                  return true;
                }
                if (i == 4 || i == 6 || i == 7) {
                  var txt = $(val).children("select").val();
                  jqob.html(txt);
                  table.cell(jqob).data(txt); //修改DataTables对象的数据
                  return true;
                }
                if (i == 8) {
                  row.cell(jqob).invalidate();
                  return true;
                }
                var txt = jqob.children("input").val();
                jqob.html(txt);
                table.cell(jqob).data(txt); //修改DataTables对象的数据
              });
              if (checkPass) {
                tr.removeClass('shown');
                $scope.doAction("kpi-save", row.data(), function(returnObj) {
                  if (returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().id = returnObj.id;
                    row.data().uid = returnObj.uid;
                    row.data().isEdit = 0;
                    row.data().isNew = false;
                    row.cells().invalidate();
                    isEditing = false;
                  }
                });
              }
            }
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var selStatus = table.$('tr.shown');
            if(selStatus.length < 1){
              if (!isEditing) {
                isEditing = true;
                var tr = $(this).closest('tr');
                tr.addClass('shown');
                var row = table.row(tr);
                row.data().isEdit = 2;
                row.cells().invalidate();
              } else {
                $scope.doAction("thresholdMessage", "当前有修改中的指标，请先完成该操作");
              }
            }else{
              growl.warning("您正在操作，请先保存或者取消再进行此操作",{});
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            if (isEditing) {
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 0;
              tr.removeClass('shown');
              row.cells().invalidate();
            }
          });
          domMain.on('click', '#data-cancel-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.invalidate().draw();
            tr.removeClass('shown');
            $scope.doAction('data-cancel');
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doAction("kpi-delete", rowData, function(flg) {
              if (flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    };
  }]);
});