define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function(directives, BootstrapDialog, datatables) {
    'use strict';
    //设备模板列表
    directives.initDirective('resourceListTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            $scope.$on("RESOURCE", function(event, args) {
              if(table) {
                table.destroy();
                domMain.empty();
              }
              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                select: $.ProudSmart.datatable.select,
                data: args.data,
                order: [
                  [5, "desc"]
                ],
                columns: [{
                  data: "label",
                  title: "模板名称"
                }, {
                  data: "desc",
                  title: "模板描述"
                }, {
                  data: "values.series",
                  title: "产品系列"
                }, {
                  data: "values.modelNo",
                  title: "设备型号"
                }, $.ProudSmart.datatable.optionCol3, {
                  data: "createTime",
                  title: "",
                  visible: false
                }],
                "columnDefs": [{
                  "targets": 1,
                  "data": "desc",
                  "render": function(data, type, full) {
                    return data;
                  }
                }, {
                  "targets": 2,
                  "data": "values.series",
                  "render": function(data, type, full) {
                    var str = full.values.series ? full.values.series : "";
                    return str;
                  }
                }, {
                  "targets": 3,
                  "data": "values.modelNo",
                  "render": function(data, type, full) {
                    var str = full.values.modelNo ? full.values.modelNo : "";
                    return str;
                  }
                }, {
                  "targets": 4,
                  "data": "option",
                  "render": function(data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group btn-group-sm'>";
                    if($scope.menuitems['A04_S01']) {
                      str += "<button id='edit-btn'  ng-click='addMod(" + full.id + ");'  class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 管理</span></button>";
                    }
                    if($scope.menuitems['A05_S01']) {
                      str += "<button id='del-btn'   class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                    }
                    if($scope.menuitems['A06_S01']) {
                      str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                      str += "<ul class='dropdown-menu' role='menu'>";
                      if($scope.menuitems['A06_S01']) {
                        str += "<li><a role='button' ng-click='modelViewEdit(" + full.id + ");' id='disable-btn'>设计仪表板</a></li>";
                      }
                      if($scope.menuitems['A12_S01']) {
                        str += "<li><a id='xml-btn' role='button' >导出SDK模板</a></li>";
                      }
                      str += "</ul>";
                    }
                    str += "</div>";
                    return str;
                  }
                }],
                rowCallback: function(nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                }
              });
            });
            domMain.on('click', '#xml-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              tr.addClass('selected');
              var row = table.row(tr);
              $scope.writeXml(row.data());
            });
            domMain.on('click', 'td', function(e) {
              e.preventDefault();
              $(domMain).find("tbody tr").removeClass("selected");
              var tr = $(this).closest('tr');
              tr.addClass('selected');
              var row = table.row(tr);
              $scope.selectTr = row.data().id;
              $scope.selectObj = row.data();
              $scope.$apply();
            });
            domMain.on('click', '#del-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              $scope.delMod(rowData, function(flg) {
                if(flg)
                  row.remove().draw(false);
              });
            });
          }
        ]
      };
    }]);
    directives.initDirective('kpiListTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            var itemAttrs;
            var groupInf;
            $scope.$on("KPI", function(event, args) {
              if(table) {
                table.destroy();
                domMain.empty();
              }
              isEditing = false;

              table = domMain.DataTable({
                dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                bAutoWidth: true,
                data: args,
                bProcessing: true,
                bPaginate: false,
                "bSort": false,
                "bInfo": false,
                //              "scrollY": 300,
                //              "scrollCollapse": true,
                columns: [{
                  data: "index",
                  title: "序号"
                }, {
                  data: "name",
                  title: "数据项"
                }, {
                  data: "label",
                  title: "名称"
                }, {
                  data: "unit",
                  title: "单位"
                }, {
                  data: "number",
                  title: "是否数值"
                }, {
                  data: "type",
                  title: "数据分类"
//              }, { //宝钢使用
//                data: "values",
//                title: "检测专业"
                }, {
                  data: "range",
                  title: "取值范围"
                }, {
                  data: "icon",
                  title: "图标"
                }, $.ProudSmart.datatable.optionCol2],
                columnDefs: [{
                  targets: 0,
                  data: "index",
                  render: function(data, type, full) {
                    if ($scope.isIndexEdit && type == "display")
                      return "<input style='width:40px' class='form-control input-sm index-edit-input' type='number' value='" + data + "'>";
                    else
                      return data;
                  }
                }, {
                  targets: 1,
                  data: "name",
                  render: function(data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 2,
                  data: "label",
                  render: function(data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 3,
                  data: "unit",
                  render: function(data, type, full) {
                    var str = '';
                    if($scope.myOptionDic[data]) {
                      str = $scope.myOptionDic[data];
                    }
                    return str;
                  }
                }, {
                  targets: 4,
                  data: "number",
                  render: function(data, type, full) {
                    var str = '';
                    if(data) {
                      str = '是';
                    } else {
                      str = '否';
                    }
                    return str;
                  }
                }, {
                  targets: 5,
                  data: "type",
                  render: function(data, type, full) {
                    var str = '';
                    if(data == 'kpi'){
                      str = '测点';
                    }else if(data == 'fault'){
                      str = '故障';
                    }
                    return str;
                  }
                }, {
                  targets: 6,
                  data: "range",
                  render: function(data, type, full) {
                    return escape(data);
                  }
//              }, { //宝钢使用
//                targets: 4,
//                data: "values",
//                render: function(data, type, full) {
//                  var str = "";
//                  if(data) {
//                    str = $scope.specialtyPropsDic[data.specialtyProp];
//                  }
//                  return str;
//                }
                }, {
                  targets: 7,
                  data: "icon",
                  render: function(data, type, full) {
                    var str = '';
                    if(data) {
                      str = '<div  class="btn btn-social-icon btn-bitbucket btn-sm"><i  class="' + data + '"></i>';
                    }
                    return str;
                  }
                }, {
                  targets: 8,
                  data: "option",
                  render: function(data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group btn-group-sm'>";
                    if($scope.menuitems['D04_A08']) {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></button>"
                    }
                    if($scope.menuitems['D03_A08']) {
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                    }
                    str += "</div>"
                    return str;
                  }
                }],
                rowCallback: function(nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                }
              })
            });

            $scope.$on("table-search-handle", function(event, args) {
              if(args.name == $attrs.name)
                table.search(args.value).draw();
            });

            domMain.on('click', '#edit-btn', function(e) {
              e.preventDefault();
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.addData('upd', row.data());

            });

            domMain.on('click', '#del-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              $scope.deleteAction("kpi", rowData, function(flg) {
                if(flg) {
                  row.remove().draw(false);
                }
              });
            });
            domMain.on('change', '.index-edit-input', function(e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data()["index"] = $(this).val();
            });
          }
        ]
      };
    }]);


    directives.initDirective('setTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            var itemAttrs;
            var groupInf;
            $scope.$on("SET", function(event, args) {
              if(table) {
                table.destroy();
                domMain.empty();
              }
              isEditing = false;

              table = domMain.DataTable({
                dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                bAutoWidth: true,
                data: args.data,
                bProcessing: true,
                bPaginate: false,
                "bSort": false,
                "bInfo": false,
                //              "scrollY": 300,
                //              "scrollCollapse": true,
                columns: [{
                  data: "name",
                  title: "数据项"
                }, {
                  data: "label",
                  title: "名称"
                }, {
                  data: "unit",
                  title: "单位"
                }, {
                  data: "number",
                  title: "是否数值"
                }, {
                  data: "type",
                  title: "数据分类"
//              }, { //宝钢使用
//                data: "values",
//                title: "检测专业"
                }, {
                  data: "range",
                  title: "取值范围"
                }
                  , {
                  data: "icon",
                  title: "图标"
                }
                  //, $.ProudSmart.datatable.optionCol2

                ],
                columnDefs: [{
                  targets: 0,
                  data: "name",
                  render: function(data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 1,
                  data: "label",
                  render: function(data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 2,
                  data: "unit",
                  render: function(data, type, full) {
                    var str = '';
                    if($scope.myOptionDic[data]) {
                      str = $scope.myOptionDic[data];
                    }
                    return str;
                  }
                }, {
                  targets: 3,
                  data: "number",
                  render: function(data, type, full) {
                    var str = '';
                    if(data) {
                      str = '是';
                    } else {
                      str = '否';
                    }
                    return str;
                  }
                }, {
                  targets: 4,
                  data: "type",
                  render: function(data, type, full) {
                    var str = '';
                    if(data == 'kpi'){
                      str = '测点';
                    }else if(data == 'fault'){
                      str = '故障';
                    }
                    return str;
                  }
//              }, { //宝钢使用
//                targets: 4,
//                data: "values",
//                render: function(data, type, full) {
//                  var str = "";
//                  if(data) {
//                    str = $scope.specialtyPropsDic[data.specialtyProp];
//                  }
//                  return str;
//                }
                }, {
                  targets: 6,
                  data: "icon",
                  render: function(data, type, full) {
                    var str = '';
                    if(data) {
                      str = '<div  class="btn btn-social-icon btn-bitbucket btn-sm"><i  class="' + data + '"></i>';
                    }
                    return str;
                  }
                }
                //  , {
                //  targets: 7,
                //  data: "option",
                //  render: function(data, type, full) {
                //    // 返回自定义内容
                //    var str = "<div class='btn-group btn-group-sm'>";
                //    if($scope.menuitems['D04_A08']) {
                //      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></button>"
                //    }
                //    if($scope.menuitems['D03_A08']) {
                //      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                //    }
                //    str += "</div>"
                //    return str;
                //  }
                //}

                ],
                rowCallback: function(nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                }
              })
            });

            $scope.$on("table-search-handle", function(event, args) {
              if(args.name == $attrs.name)
                table.search(args.value).draw();
            });

            domMain.on('click', '#edit-btn', function(e) {
              e.preventDefault();
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.addData('upd', row.data());

            });

            domMain.on('click', '#del-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              $scope.deleteAction("kpi", rowData, function(flg) {
                if(flg) {
                  row.remove().draw(false);
                }
              });
            });
          }
        ]
      };
    }]);

    directives.initDirective('gatherListTable', ['$timeout', '$compile', 'growl', function($timeout, $compile, growl) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            var itemAttrs;
            var groupInf;
            $scope.$on("GATHER", function(event, args) {
              if(table) {
                table.destroy();
                domMain.empty();
              }
              isEditing = false;

              table = domMain.DataTable({
                dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                bAutoWidth: true,
                data: args.data,
                bProcessing: true,
                bPaginate: false,
                "bSort": false,
                "bInfo": false,
                //              "scrollY": 300,
                //              "scrollCollapse": true,
                columns: [{
                  data: "taskCode",
                  title: "分组编码"
                }, {
                  data: "description",
                  title: "分组描述"
                }, {
                  data: "taskCycle",
                  title: "采集周期"
                }, {
                  data: "cycleUnit",
                  title: "采集单位"
                }
                  //, $.ProudSmart.datatable.optionCol2
                ],


                columnDefs: [{
                  targets: 0,
                  data: "taskCode",
                  render: function(data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 1,
                  data: "description",
                  render: function(data, type, full) {
                    return escape(data);
                  }
                }, {
                  targets: 2,
                  data: "taskCycle",
                  render: function(data, type, full) {
                    return escape(data);
                    //var str = '';
                    //if($scope.myOptionDic[data]) {
                    //  str = $scope.myOptionDic[data];
                    //}
                    //return str;
                  }
                }, {
                  targets: 3,
                  data: "cycleUnit",
                  render: function(data, type, full) {
                    return escape(data);
                    //var str = '';
                    //if(data) {
                    //  str = '是';
                    //} else {
                    //  str = '否';
                    //}
                    //return str;
                  }
                }
                //  , {
                //  targets: 4,
                //  data: "cycleUnit",
                //  render: function(data, type, full) {
                //    return escape(data);
                //    //var str = '';
                //    //if(data == 'kpi'){
                //    //  str = '测点';
                //    //}else if(data == 'fault'){
                //    //  str = '故障';
                //    //}
                //    //return str;
                //  }
                //},
                  //{
                  //targets: 6,
                  //data: "icon",
                  //render: function(data, type, full) {
                  //  var str = '';
                  //  if(data) {
                  //    str = '<div  class="btn btn-social-icon btn-bitbucket btn-sm"><i  class="' + data + '"></i>';
                  //  }
                  //  return str;
                //  targets: 5,
                //  data: "option",
                //  render: function(data, type, full) {
                //    // 返回自定义内容
                //    var str = "<div class='btn-group btn-group-sm'>";
                //    if($scope.menuitems['D04_A08']) {
                //      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>"
                //    }
                //    if($scope.menuitems['D03_A08']) {
                //      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                //    }
                //    str += "</div>"
                //    return str;
                //  }
                //
                //
                //},

                //  {
                //  targets: 7,
                //  data: "option",
                //  render: function(data, type, full) {
                //    // 返回自定义内容
                //    var str = "<div class='btn-group btn-group-sm'>";
                //    if($scope.menuitems['D04_A08']) {
                //      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>"
                //    }
                //    if($scope.menuitems['D03_A08']) {
                //      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>"
                //    }
                //    str += "</div>"
                //    return str;
                //  }
                //}

                ],
                rowCallback: function(nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                }
              })
            });


            $scope.$on("table-search-handle", function(event, args) {
              if(args.name == $attrs.name)
                table.search(args.value).draw();
            });

            domMain.on('click', '#edit-btn', function(e) {
              e.preventDefault();
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.addData('upd', row.data());

            });

            domMain.on('click', '#del-btn', function(e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              $scope.deleteAction("kpi", rowData, function(flg) {
                if(flg) {
                  row.remove().draw(false);
                }
              });
            });

          }
        ]
      };
    }]);

   //设备部位列表
   directives.initDirective('devicePartTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;
                $scope.$on(Event.DEVICPART, function(event, args) {
                    if (table) {
                        table.destroy();
                        domMain.empty();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        data: args.option[0],
                        columns: [{
                            data: "label",
                            title: "设备部件名称"
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            targets: 0,
                            data: "label",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if (full.isEdit == 2 || full.isEdit == 3)
                                    return "<input maxlength='20' style='width:160px' autocomplete='off' placeholder='请输入设备部件名称' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'label'>";
                                else {
                                    return escape(data);
                                }
                            }
                        },{
                            "targets": 1,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = '';
                                if(full.isEdit == 2 || full.isEdit == 3) {
                                    str += '<div class="btn-group btn-group-sm">' +
                                        '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>' +
                                        '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                                } else {
                                    str += '<div class="btn-group btn-group-sm">'+
                                        '<a id="edit-btn" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            $compile(nRow)($scope);
                        }
                    });
                });

                domMain.on('click', '#save-btn', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var checkPass = false;
                    var selectRow = null;
                    $.each(tr.children(), function(j, val1) {
                        var jqob1 = $(val1);
                        //把input变为字符串
                        if (!jqob1.has('button').length && jqob1.has('input').length) {
                            var txt = $.trim(jqob1.children("input").val());
                            if (!txt) { //没有值
                                growl.warning("设备部件名称不能为空");
                                checkPass = false;
                                return false
                            } else { //有值
                                if (j == 0) {
                                    if ($scope.partInListSaveDEV.length == 0) {
                                        $(val1).removeClass('danger');
                                        table.cell(jqob1).data(txt);
                                        checkPass = true;
                                    } else {
                                        console.log($scope.partInListSaveDEV);
                                        var checkflag=true;

                                            if( $scope.labelDEV == txt && row.data().isEdit == 2){
                                                // if (row.data().isEdit == 2) {
                                                    $(val1).removeClass('danger');
                                                    table.cell(jqob1).data(txt);
                                                // }
                                            }else {
                                                for (var i in $scope.partInListSaveDEV) {
                                                    if ($scope.partInListSaveDEV[i].label == txt) {
                                                        if (row.data().isEdit == 3 || row.data().isEdit == 2) {

                                                            growl.warning("设备部件名称需要填写唯一", {});
                                                            $(val1).addClass('danger');
                                                            checkPass = false;
                                                            checkflag = false;
                                                            return;

                                                        }
                                                    }
                                                }
                                            }
                                        if(checkflag){
                                            checkPass = true;
                                            $(val1).removeClass('danger');
                                            table.cell(jqob1).data(txt);

                                        }
                                    }
                                } else {
                                    $(val1).removeClass('danger');
                                    table.cell(jqob1).data(txt);
                                }
                            }
                        }
                    });
                    if (checkPass) {
                        $scope.doActionInsDEV('saveSpareIn', row.data(), function(returnObj) {
                            if (returnObj == false) {
                                row.data().isEdit = 2;
                            } else {
                                row.data().isEdit = 0;
                                row.data().id = returnObj.id;
                                row.cells().invalidate();
                                isEditing = false;
                            }
                        });
                    }
                });

                domMain.on('click', '#edit-btn', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if (!isEditing) {
                        isEditing = true;
                        row.data().isEdit = 2;
                        row.cells().invalidate();
                        $scope.labelDEV = row.data().label;
                        $compile(tr)($scope);
                    } else {
                        if (row.data().isEdit == 0) {
                            growl.warning("有正编辑的设备部位", {});
                            return;
                        }
                    }
                    if (row.data().id == 0) {
                        growl.warning("有正编辑的设备部位", {});
                        return;
                    }
                });

                domMain.on('click', '#cancel-btn', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    row.data()["isEdit"] = 0;
                    isEditing = false;
                    $scope.doActionInsDEV("cancel", row.data());
                });

            }]
        }
    }]);

   //备件使用部位列表
   directives.initDirective('sparePartsTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
          return {
              restrict: 'A',
              controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                  var domMain = $element;
                  var table;
                  var isEditing = false;
                  $scope.$on(Event.SPAREPARTS, function(event, args) {
                      if (table) {
                          table.destroy();
                          domMain.empty();
                      }
                      isEditing = false;
                      table = domMain.DataTable({
                          dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
                          language: $.ProudSmart.datatable.language,
                          data: args.option[0],
                          columns: [{
                              data: "label",
                              title: "使用部位名称"
                          }, $.ProudSmart.datatable.optionCol3],
                          columnDefs: [{
                              targets: 0,
                              data: "label",
                              render: function(data, type, full) {
                                  //返回自定义名字
                                  if (full.isEdit == 2 || full.isEdit == 3)
                                      return "<input maxlength='20' style='width:160px' autocomplete='off' placeholder='请输入备件使用部件名称' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'label'>";
                                  else {
                                      return escape(data);
                                  }
                              }
                          }, {
                              "targets": 1,
                              "data": "option",
                              "render": function(data, type, full) {
                                  // 返回自定义内容
                                  var str = '<div class="btn-group btn-group-sm" style="width: 160px;">';
                                  if (full.isEdit == 2 || full.isEdit == 3) {
                                      str += '<a id="save-btn" class="btn btn-primary btn-sm"><i class="fa fa-save  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">确定</span></a>' +
                                          '<a id="cancel-btn" class="btn btn-default btn-sm" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';

                                  } else {
                                      str += '<div class="btn-group btn-group-sm">'+
                                          '<a id="edit-btn" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                  }
                                  return str;
                              }
                          }],
                          rowCallback: function(nRow, aData, iDataIndex) {
                              $compile(nRow)($scope);
                          }
                      });
                  });

                  domMain.on('click', '#save-btn', function(e) {
                      e.stopPropagation();
                      var tr = $(this).closest('tr');
                      var row = table.row(tr);
                      var checkPass = false;
                      var selectRow = null;
                      $.each(tr.children(), function(j, val1) {
                          var jqob1 = $(val1);
                          //把input变为字符串
                          if (!jqob1.has('button').length && jqob1.has('input').length) {
                              var txt = $.trim(jqob1.children("input").val());
                              if (!txt) { //没有值
                                  growl.warning("使用部位名称不能为空");
                                  checkPass = false;
                                  return false
                              } else { //有值
                                  if (j == 0) {
                                      if ($scope.partInListSaveSPA.length == 0) {
                                          $(val1).removeClass('danger');
                                          table.cell(jqob1).data(txt);
                                          checkPass = true;
                                      } else {
                                          var checkflag=true;
                                          if( $scope.labelSPA == txt && row.data().isEdit == 2){
                                              $(val1).removeClass('danger');
                                              table.cell(jqob1).data(txt);
                                          }else{
                                              for (var i in $scope.partInListSaveSPA) {
                                                  if ($scope.partInListSaveSPA[i].label == txt) {
                                                      if ($scope.editStatus = 3 || row.data().isEdit == 2) {
                                                          growl.warning("使用部位名称需要填写唯一", {});
                                                          $(val1).addClass('danger');
                                                          checkPass = false;
                                                          checkflag = false;
                                                          return;
                                                      }
                                                  }
                                              }
                                          }
                                          if(checkflag){
                                              checkPass = true;
                                              $(val1).removeClass('danger');
                                              table.cell(jqob1).data(txt);

                                          }
                                      }
                                  } else {
                                      $(val1).removeClass('danger');
                                      table.cell(jqob1).data(txt);
                                  }
                              }
                          }
                      });
                      if (checkPass) {
                          $scope.doActionInsSPA('saveSpareIn', row.data(), function(returnObj) {
                              if (returnObj == false) {
                                  row.data().isEdit = 2;
                              } else {
                                  row.data().isEdit = 0;
                                  row.data().id = returnObj.id;
                                  row.cells().invalidate();
                                  isEditing = false;
                              }
                          });
                      }
                  });

                  domMain.on('click', '#edit-btn', function(e) {
                      e.preventDefault();
                      var tr = $(this).closest('tr');
                      var row = table.row(tr);
                      if (!isEditing) {
                          isEditing = true;
                          row.data().isEdit = 2;
                          row.cells().invalidate();
                          $scope.labelSPA = row.data().label;
                          $compile(tr)($scope);
                      } else {
                          if (row.data().isEdit == 0) {
                              growl.warning("有正编辑的备件使用部位", {});
                              return;
                          }
                      }
                      if (row.data().id == 0) {
                          growl.warning("有正编辑的备件使用部位", {});
                          return;
                      }
                  });

                  domMain.on('click', '#cancel-btn', function(e) {
                      e.stopPropagation();
                      isEditing = false;
                      var row = table.row('.shown');
                      if (row.data()) {
                          row.data()["isEdit"] = 0;
                          row.child.hide();
                          row.cells().invalidate();
                          $scope.doActionInsSPA('cancel', row.data());
                      } else {
                          var tr = $(this).closest('tr');
                          var row = table.row(tr);
                          row.data()["isEdit"] = 0;
                          row.child.hide();
                          $scope.doActionInsSPA('cancel', row.data());
                      }
                  });


              }]
          }
      }]);

   //设备备件列表
   directives.initDirective('sparePartTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
      return {
          restrict: 'A',
          controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
              var domMain = $element;
              var table;
              var isEditing = false;
              $scope.$on(Event.SPAREPART, function(event, args) {
                  if (table) {
                      table.destroy();
                      domMain.empty();
                  }
                  isEditing = false;
                  table = domMain.DataTable({
                      dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
                      language: $.ProudSmart.datatable.language,
                      data: args.option[0],
                      columns: [{
                          data: "name",
                          title: "备件编码"
                      }, {
                          data: "label",
                          title: "备件名称"
                      }, {
                          data: "model",
                          title: "备件类型"
                      }, {
                          data: "specification",
                          title: "规格型号"
                      }, {
                          data: "manufacturer",
                          title: "生产厂家"
                      }, {
                          data: "lifespan",
                          title: "使用寿命"
                      }, {
                          data: "startTime",
                          title: "开始使用时间"
                      },
                          {
                          data: "imageUrl",
                          title: "附件"
                      }],
                      columnDefs: [{
                          targets: 0,
                          data: "name",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 1,
                          data: "label",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 2,
                          data: "model",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 3,
                          data: "specification",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 4,
                          data: "manufacturer",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 5,
                          data: "lifespan",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 6,
                          data: "startTime",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      },{
                          targets: 7,
                          data: "imageUrl",
                          render: function(data, type, full) {
                              return escape(data);
                          }
                      }],
                      rowCallback: function(nRow, aData, iDataIndex) {
                          $compile(nRow)($scope);
                      }
                  });
              });

          }]
      }
  }]);

  })