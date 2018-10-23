define(['directives/directives', 'datatables.net'], function(directives, datatables) {
  'use strict';
  //设备模板---故障列表
  directives.initDirective('faultTable', ['$timeout', '$compile', 'growl',function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.UNITTYPEINIT + "_fault", function(event, args) {
            if(table) {
              table.destroy();
            }

            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columns: [{
                title: "故障编码",
                data: "faultNo"
              }, {
                title: "故障分类",
                data: "category"
              }, {
                title: "故障名称",
                data: "label"
              }, {
                title: "操作",
                orderable: false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "faultNo",
                "render": function(data, type, full) {
                  //                if (full.isEdit == 2) {
                  //                  var str = ' <select id="fault" name="fault" ng-model="faultSave" class="form-control select2" selectdata="faultList"   placeholder="请选择"  select2></select>';
                  //                  return str;
                  //                } else {
                  return "<a href='#faultKnowledge/" + data + "'>" + data + "</a>";
                  //                }
                }
              }, {
                "targets": 1,
                "data": 'category',
                "render": function(data, type, full) {
                  if(data == null) {
                    return "";
                  } else {
                    return data;
                  }
                }
              }, {
                "targets": 2,
                "data": 'label',
                "render": function(data, type, full) {
                  if(data == null) {
                    return "";
                  } else {
                    return data;
                  }
                }
              }, {
                "targets": 3,
                "data": "option",
                "render": function(data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit == 2) {
                    str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>";
                  } else {
                    str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>";
                  }
                  str += "</div>";
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
            //          parentDom.html('<a ng-click="addFault()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加故障</span></a>');
            parentDom.html('<select class="form-control" style="min-width:200px" selectdata="faultList" itemchange="addFault" select2></select>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');

            var row = table.row(tr);
            var f = $scope.faultSave;
            if(f != null && f != "" && f != "-1") {
              row.data()["fault"] = f;
              $scope.doActionFault('saveFault', row.data(), function(returnObj) {
                row.data().isEdit = 0;
                row.cells().invalidate();
                isEditing = false;
              });
            } else {
              growl.warning("请选择故障", {});
            }

          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionFault('faultDelete', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(isEditing) {
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 0;
              row.cells().invalidate();
            }
          });
        }
      ]
    }
  }]);
  
  //设备模板---技术参数列表
  directives.initDirective('technicalTable',['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.UNITTYPEINIT + "_technical", function(event, args) {
            if(table) {
              table.destroy();
            }

            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              //"order": [0, "desc"],
              columns: [{
                title: "项目",
                data: "project"
              }, {
                title: "参数",
                data: "parameter"
              }, {
                title: "备注",
                data: "remark"
              }, {
                title: "操作",
                orderable: false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "project",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'   type='text'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 1,
                "data": 'parameter',
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'   type='text'  maxlength='100'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 2,
                "data": 'remark',
                "render": function(data, type, full) {
                  // 返回自定义内容
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'   type='text'  maxlength='20'  style='width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 3,
                "data": "option",
                "render": function(data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit > 0) {
                    str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    if (full.id)
                      str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>";
                    else
                      str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>";
                  } else {
                    str += "<a id='update-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>";
                    str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>";
                  }
                  str += "</div>";
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
            parentDom.html('<a ng-click="addTechnical()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加技术参数</span></a>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            //var pro = $("#project  option:selected").val();
            //if(pro == null && pro == ""){
            //  growl.warning("请选择项目",{});
            //  return;
            //}
            $.each(tr.children(), function(j, val1) {
              var jqob1 = $(val1);

              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());

                if(txt && txt != "请选择...") {
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt);
                } else {
                  if(j == 0 || j == 1) {

                    table.cell(jqob1).data(txt)
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }

                }
              }
            });
            if(checkPass) {
              //row.data()["project"] = pro;
              $scope.doActionTechnical('save', row.data(), function(returnObj) {
                if(returnObj) {
                  row.data().id = returnObj.id;
                  row.data().isEdit = 0;
                  row.cells().invalidate();
                  isEditing = false;
                }
              });
            }
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate();
          });

          domMain.on('click', '#update-btn', function(e) {
            isEditing = true;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 2;
            row.invalidate().columns.adjust().draw(false, true);
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionTechnical('delete', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    }
  }]);
  
  //设备模板---主要部件
  directives.initDirective('majorTable', ['$timeout', '$compile', 'growl',function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.UNITTYPEINIT + "_major", function(event, args) {
            if(table) {
              table.destroy();
            }

            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              //"order": [0, "desc"],
              columns: [{
                title: "部件名称",
                data: "name"
              }, {
                title: "规格",
                data: "specification"
              }, {
                title: "数量",
                data: "num"
              }, {
                title: "备注",
                data: "remark"
              }, {
                title: "操作",
                orderable: false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "name",
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'  placeholder='请输入部件名称'  type='text'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 1,
                "data": 'specification',
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'  placeholder='请输入规格'  type='text'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 2,
                "data": 'num',
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'  placeholder='数量只能输入数字' type='number'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' value='" + data + "'>";
                  else
                    return data;
                }
              }, {
                "targets": 3,
                "data": 'remark',
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'   placeholder='请输入备注' type='text'  maxlength='20'  style='width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 4,
                "data": "option",
                "render": function(data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  if(full.isEdit > 0) {
                    str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    if (full.id) {
                      str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>";
                    } else {
                      str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>";
                    }
                    
                  } else {
                    str += "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                      "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                      "<span class='caret'></span>" +
                      "<span class='sr-only'>Toggle Dropdown</span>" +
                      "</button>" +
                      "<ul class='dropdown-menu' role='menu'>" +
                      "<li><a  href='javascript:(0);' id='update-btn'>修改</a></li>" +
                      "<li><a  href='' id='del-btn'>删除</a></li>" +
                      "<li><a  href='' id='spare-btn'>关联备件</a></li>" +
                      "</ul>"
                  }
                  str += "</div>";
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
            parentDom.html('<a ng-click="addMajor()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加主要部件</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            $.each(tr.children(), function(j, val1) {
              var jqob1 = $(val1);

              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());

                if(txt && txt != "请选择...") {
                  var reg = /^[1-9][0-9]*$/;
                  if(j == 2) {
                    if(!reg.test(txt)) {
                      growl.warning("数量不能为负数!", {});
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                  }
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt);
                } else {
                  if(j == 0 || j == 1 || j == 2) {

                    table.cell(jqob1).data(txt)
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }
                }
              }
            });
            if(checkPass) {
              $scope.doActionMajor('save', row.data(), function(returnObj) {
                if(row.data().isEdit != 2){
                  row.data().id  = returnObj.id;
                }
                row.data().isEdit = 0;
                row.cells().invalidate();
                isEditing = false;
              });
            }
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate();
          });

          domMain.on('click', '#update-btn', function(e) {
            isEditing = true;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 2;
            row.cells().invalidate();
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionMajor('delete', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
          domMain.on('click', '#spare-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(tr.hasClass('time-color')) {
              tr.removeClass('time-color');
            } else {
              table.$('tr.time-color').removeClass('time-color');
              tr.addClass('time-color');
            }
            $scope.devicePointInit(row.data(), "spare");
          });
        }
      ]
    }
  }]);
  
  //设备模板---任务列表
  directives.initDirective('taskModelTable', ['$timeout', '$compile', 'growl',function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.UNITTYPEINIT + "_task", function(event, args) {
            if(table) {
              table.destroy();
            }

            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              //"order": [0, "desc"],
              columns: [{
                title: "任务名称",
                data: "name"
              }, {
                title: "任务编码",
                data: "taskCode"
              }, {
                title: "任务周期(秒)",
                data: "taskTime"
              }, {
                title: "操作",
                orderable: false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "name",
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'   type='text'  maxlength='20' placeholder='输入任务名称'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 1,
                "data": 'taskCode',
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'  type='number' size='4'  min='1'  max='10000' placeholder='只能输入1~4位数字' style='border: 1px solid #F18282;width: 100%;' value='" + data + "'>";
                  else
                    return data;
                }
              }, {
                "targets": 2,
                "data": 'taskTime',
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6'   type='number'  max ='5' placeholder='输入任务周期(秒)'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                "targets": 3,
                "data": "option",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group table-option-group' >";
                  if(full.isEdit == 2 || full.isEdit == 3) {
                    str += "<a id='save-btn' class='btn btn-default btn-sm'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    if (full.id) {
                      str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                    } else {
                      str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                    }
                    
                  } else {
                    str += "<div class='btn-group table-option-group'>" +
                      "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                      "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                      "<span class='caret'></span>" +
                      "<span class='sr-only'>Toggle Dropdown</span>" +
                      "</button>" +
                      "<ul class='dropdown-menu' role='menu'>" +
                      "<li><a id='edit-btn' >修改</a></li>" +
                      "<li><a href id='del-btn' >删除</a></li>" +
                      "<li><a href id='point-btn' >设置测点</a></li>" +
                      "</ul>" +
                      "</div>";
                  }
                  str += "</div>";
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
            parentDom.html('<a ng-click="addTask()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加任务</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            $.each(tr.children(), function(j, val1) {
              var jqob1 = $(val1);

              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());

                if(txt && txt != "请选择...") {
                  var reg = /^[0-9]*$/;
                  if(j == 1) {
                    if(!reg.test(txt)) {
                      growl.warning("任务编码不能为负数!", {});
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                    if(txt.length > 4) {
                      growl.warning("您输入任务编码超过了4位数字!", {});
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                  }
                  if(j == 2) {
                    if(txt == 0){
                      growl.warning("任务周期必须大于0的整数!", {});
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                    if(!reg.test(txt)) {
                      growl.warning("任务周期不能为负数!", {});
                      $(val1).addClass('danger');
                      checkPass = false
                      return false;
                    }
                  }
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt);
                } else {
                  if(j == 0 || j == 1 || j == 2) {
                    table.cell(jqob1).data(txt)
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }
                }
              }
            });
            if(checkPass) {
              $scope.doActionTask('save', row.data(),function(returnObj) {
                row.data().id = returnObj.id;
                row.data().isEdit = 0;
                row.cells().invalidate();
                isEditing = false;
              });
            }
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate();
          });

          domMain.on('click', '#edit-btn', function(e) {
            isEditing = true;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 2;
            row.cells().invalidate();
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionTask('delete', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
          domMain.on('click', '#point-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(tr.hasClass('time-color')) {
              tr.removeClass('time-color');
            } else {
              table.$('tr.time-color').removeClass('time-color');
              tr.addClass('time-color');
            }
            $scope.devicePointInit(row.data(), "task");
          });

        }
      ]
    }
  }]);
  
  directives.initDirective('documentTable', ['$timeout', '$compile', 'growl',function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;

          $scope.$on(Event.UNITTYPEINIT + "_document", function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;

            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              columns: [{
                title: "文档名称",
                data: "name"
              }, {
                title: "文档路径",
                data: "qualifiedName"
              }, {
                title: "操作",
                orderable: false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "name",
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input class='form-control col-xs-6' id='docName' name='docName'  type='text'  maxlength='80' placeholder='请输入文档名称'  style='border: 1px solid #F18282;width: 100%;' value='" + escape(decodeURIComponent(data)) + "'>";
                  else
                    return escape(decodeURIComponent(data));
                }
              }, {
                "targets": 1,
                "data": "qualifiedName",
                "render": function(data, type, full) {
                  if(full.isEdit > 0)
                    return '<input type="file" nv-file-select uploader="uploader"/>';
                  else
                    return escape(data);
                }
              }, {
                "targets": 2,
                "data": "option",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group table-option-group' >";
                  if(full.isEdit == 3) {
                    str += "<button id='save-btn' class='btn btn-default btn-sm'  ng-disabled='uploader.queue.length == 0'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 上传</span></button>";
                    if (full.id) {
                      str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                    } else {
                      str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                    }
                  } else {
                    str += "<a id='dow-btn' class='btn btn-default btn-sm'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 下载</span></a>";
                    str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                  }
                  str += "</div>";
                  return str;
                }
              }],
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              }
            })
          });

          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addDocument()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新建文档</span></a>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var param = $("#docName").val();
            if(param != null && param != "") {
              //$scope.uploadParam.modelId = $scope.selectedDitem.id;
              //$scope.uploadParam.name = param;
              $scope.UploadFile(param, $scope.selectedDitem.id,function(flg){
                if (flg) {
                  row.data().isEdit = 0;
                  row.data().name = flg.name;
                  row.data().qualifiedName = flg.qualifiedName;
                  row.data().id = flg.id;
                  row.cells().invalidate();
                  isEditing = false;
                }
              });
            } else {
              growl.warning("文档名称不能为空", {});
            }
          });
          domMain.on('click', '#uploadImg', function(e) {
            e.preventDefault();
            $("#fileUp").trigger('click');
          });
          
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate();
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionDocument('delete', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });

          domMain.on('click', '#dow-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var url = $scope.dowLoadUrl + row.data().qualifiedName;
            //          location.href = '' + url + '';
            window.open(url);
          });
        }
      ]
    };
  }]);
  
  //设备模板---设置测点
  directives.initDirective('directivesPointTable', ['$timeout', '$compile',function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.DIRECTIVESINIT + "_point", function(event, args) {
            if(table) {
              table.destroy();
            }

            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              ordering:false,
              columns: [{
                title: "测点名称",
                data: "label"
              }, {
                title: "数据类型",
                data: "dataTypeId"
              }, {
                title: "操作",
                data: "option"
              }],
              columnDefs: [{
                "targets": 0,
                "data": "name",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "";
                  if(full.isEdit == 3) {
                    var divs2 = $scope.initListDate.kpiList;
                    var put = "<select id='selKpi' name='selKpi' class='combobox form-control input-sm'>";
                    put += '<option value="">请选择...</option>';
                    for(var i in divs2) {
                      put += '<option value="' + divs2[i].id + '">' + divs2[i].label + '</option>';
                    }
                    put += '</select>';
                    str = put;
                  } else {
                    str = data;
                  }
                  return str;
                }
              }, {
                "targets": 1,
                "data": "dataTypeId",
                "render": function(data, type, full) {
                  var dateType = $scope.initListDate.allDataTypes;
                  var str = "";
                  if(data != "" && data != null) {
                    for(var j in dateType) {
                      if(dateType[j].id == data) {
                        str = dateType[j].name;
                        break;
                      }
                    }
                  }

                  return str;
                }
              }, {
                "targets": 2,
                "data": "option",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group ' >";
                  if(full.isEdit == 3) {
                    str += "<a id='save-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                  } else {
                    str += "<a id='move-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 上移</span></a>";
                    str += "<a id='down-btn' class='btn btn-default btn-sm'  style='margin-right: 10px;'><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 下移</span></a>";
                    str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                  }
                  str += "</div>";
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
            parentDom.html('<a ng-click="addStation()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 选择测点</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', '#move-btn', function(e) {
            var index = table.row($(this).parents('tr')).index();
            var $tr = $(this).parents("tr");
            if($tr.index() != 0) {
              var data = table.data();
              table.clear();
              data.splice((index - 1), 0, data.splice(index,1)[0]);
              table.rows.add(data).draw();
            }
          });
          domMain.on('click', '#down-btn', function(e) {
            var index = table.row($(this).parents('tr')).index();
            var $tr = $(this).parents("tr");
            var len = $(".down-btn").length;
            if($tr.index() != len - 1) {
              var data = table.data();
              table.clear();
              data.splice((index + 1), 0, data.splice(index,1)[0]);
              table.rows.add(data).draw();
            }
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            var divs2 = $scope.selectedDitem.kpis;

            var put = $("#selKpi option:selected").val();
            if(put == "" && put == null) {
              return;
            } else {
              for(var i in divs2) {
                if(divs2[i].id == put) {
                  $scope.doActionStation('save', divs2[i]);
                  break;
                }
              }
            }
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            //e.preventDefault();
            //if(isEditing) {
            //  isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
            //  row.data().isEdit = 0;
            //  row.cells().invalidate();
            //}
            //$scope.doActionStation('removeDomain', rowData, function(flg) {
            //  if(flg)
                row.remove().draw(false);
            //});
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionStation('removeDomain', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    }
  }]);
  
  //设备模板---关联备件
  directives.initDirective('majorAttachmentTable', ['$timeout', '$compile',function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;

          $scope.$on(Event.DIRECTIVESINIT + "_attachment", function(event, args) {
            if(table) {
              table.destroy();
            }

            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              "order": [0, "asc"],
              columns: [{
                title: "",
                data: "id",
                visible: false
              }, {
                title: "备件编号",
                data: "name"
              }, {
                title: "备件名称",
                data: "label"
              }, {
                title: "当前数量",
                data: "stockNumber"
              }, {
                title: "操作",
                orderable: false,
                data: "option"
              }],
              columnDefs: [{
                "targets": 1,
                "data": "name",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "";
                  if(full.isEdit == 3) {
                    var projectData = $scope.initListDate.allSpareParts;
                    str += '<select id="allSpare" name="allSpare" class="combobox form-control input-sm">';
                    str += '<option value="">请选择...</option>';
                    for(var i in projectData) {
                      str += "<option value='" + projectData[i].id + "' >" + projectData[i].label + "</option>";
                    }
                    str += '</select>';
                  } else {
                    str = "<a href='#sparepartInfo/" + full.id + "'>" + data + "</a>";
                  }
                  return str;
                }
              }, {
                "targets": 2,
                "data": "label",
                "render": function(data, type, full) {
                  return data;
                }
              }, {
                "targets": 3,
                "data": "stockNumber",
                "render": function(data, type, full) {
                  return data;
                }
              }, {
                "targets": 4,
                "data": "option",
                "render": function(data, type, full) {
                  // 返回自定义内容
                  var str = "<div class='btn-group ' >";
                  if(full.isEdit == 3) {
                    str += "<a id='save-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                  } else {
                    str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                  }
                  str += "</div>";
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
            parentDom.html('<a ng-click="addAttachment()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 选择备件</span></a>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            var divs2 = $scope.initListDate.allSpareParts;

            var put = $("#allSpare option:selected").val();
            if(put == "" && put == null) {
              return;
            } else {
              for(var i in divs2) {
                if(divs2[i].id == put) {
                  $scope.doActionStation('save', divs2[i]);
                  break;
                }

              }
            }
          });

          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            //if(isEditing) {
            //  isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
            //  row.data().isEdit = 0;
            //  row.cells().invalidate();
            //}
            row.remove().draw(false);
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            var rowData = row.data();
            $scope.doActionStation('delAttachment', rowData, function(flg) {
              if(flg)
                row.remove().draw(false);
            });
          });
        }
      ]
    }
  }]);
});