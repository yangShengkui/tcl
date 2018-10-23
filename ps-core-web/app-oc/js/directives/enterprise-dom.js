define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'jszip', 'datatables.net-bs', 'datatables.net-select',
  'datatables.net-buttons-bs', 'datatables.buttons.html5',
], function(directives, BootstrapDialog, datatables, jszip) {
  'use strict';

  //======================================    企业信息    ===========================================
  directives.initDirective('enterpriseInfoTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        $scope.$on(Event.ENTERPRISEINIT + "_info", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [
            // $.ProudSmart.datatable.selectCol,
            {
              data: "name",
              title: "企业名称"
            }, {
              data: "industryType",
              title: "行业类型"
            }, {
              data: "address",
              title: "所在区域"
            }, {
              data: "statisticsType",
              title: "统计周期类型"
            }, {
              data: "createTime",
              title: "",
              visible: false
            },
            $.ProudSmart.datatable.optionCol3
          ];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + $.ProudSmart.datatable.footerdom,
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            processing: true,
            serverSide: true,
            ordering: true,
            aaSorting: [
              [4, "desc"]
            ],
            ajax: $scope.pipeline(),
            columns: columns,
            columnDefs: [
              // {
              //   "targets": 0,
              //   "orderable": false,
              //   "render": function(data, type, full) {
              //     // 返回自定义内容
              //     if (type == "display") {
              //       if (data) {
              //         return '<input class="itemCheckBox" checked type="checkbox">';
              //       } else {
              //         return '<input class="itemCheckBox" type="checkbox">';
              //       }
              //     }
              //     return "";
              //   }
              // },
              {
                "targets": 0,
                "data": "name",
                "render": function(data, type, full) {
                  return escape(data);
                }
              }, {
                "targets": 1,
                "data": "industryType",
                "render": function(data, type, full) {
                  var item = "";
                  var industryType = $scope.industryList;
                  for(var i in industryType) {
                    if(industryType[i].valueCode == data) {
                      item = industryType[i]['text'];
                      return item;
                    }
                  }
                  if(!item) {
                    return '-';
                  }

                }
              }, {
                "targets": 2,
                "data": "address",
                "render": function(data, type, full) {
                  if(full.province && full.city && full.county) {
                    return full.county;
                  } else if(full.province && full.city && !full.county) {
                    return full.city;
                  } else {
                    return full.province;
                  }

                }
              }, {
                "targets": 3,
                "data": "statisticsType",
                "render": function(data, type, full) {
                  var item = "";
                  var periodList = $scope.dialog.list.periodList;
                  for(var i in periodList) {
                    if(periodList[i].id == data) {
                      item = periodList[i]['label'];
                      break;
                    }
                  }
                  return item;
                }
              }, {
                "targets": 5,
                "data": "option",
                "render": function(data, type, full) {
                  var str = "<div class='btn-group btn-group-sm'>";
                  str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                  str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  str += "<ul class='dropdown-menu' role='menu'>";
                  str += "<li><a  href='#/energyStructureInfo/" + full.id + "'>能耗结构</a></li>";
                  str += "<li><a  href='#/productInfo/" + full.id + "'>产品结构</a></li>";
                  str += "<li><a  href='#/basicBusinessInfo/" + full.id + "'>企业基本信息</a></li>";
                  str += "<li><a  href='#/EnterpriseOperateInfo/" + full.id + "'>企业经营信息</a></li>";
                  str += "</ul></div>";
                  return str;

                }
              }
            ],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            },
            drawCallback: function(settings) {
              var api = this.api();

              if(api.data().length > 0) {
                var footerHtml = "";
                var arrLength = [];
                for(var i = 0; i < columns.length - 1; i++) {
                  arrLength.push(i);
                }
                new $.fn.dataTable.Buttons(table, {
                  buttons: [{
                    extend: 'excel',
                    title: '企业信息导出',
                    text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                    exportOptions: {
                      columns: arrLength
                    }
                  }]
                });
                table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
                if(footerHtml)
                  $(".dataTables_wrapper .col-sm-6").append(footerHtml);
              } else {
                $(".footerdom").hide();
                $(".dataTables_wrapper .col-sm-6").hide()
              }
            }
          });

        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.dialog.event.provinceClick(row.data().province);
          $scope.dialog.event.cityClick(row.data().city);
          $.extend($scope.dialog.input, row.data());
          ngDialog.open({
            template: '../partials/dialogue/enterprise_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              row.remove().draw(false);
            }
          });
        });

        domMain.on('click', '#inform-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          location.href = "index.html#/alertInforms/" + $.trim(rowData.id);
        });

        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          if(e.target.checked) {
            table.rows().select();
            table.rows().invalidate().draw(false);
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              console.log($($(tableRows.nodes()[i]).children()[0]).prop("checked", true));
              row.data().selected = true;
              $($(tableRows.nodes()[i]).children()[0]).prop("checked", true);
              // $($(tableRows.nodes()[i]).children()[0]).prop("checked", true);
              // $(tableRows.nodes()[i].children[0]).prop("checked", true);
            };

          } else {
            table.rows().invalidate().draw(false);
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = false;
            };
            table.rows().deselect();
          }

          $scope.selectedCount = tableRows.count();
          $scope.$apply();
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
          if(tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的企业信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if(ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if(returnObj.code == 0) {
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================    产品信息    ===========================================
  directives.initDirective('productInfoTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        window.JSZip = jszip;
        $scope.$on(Event.ENTERPRISEINIT + "_product", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [$.ProudSmart.datatable.selectCol, {
            data: "enterpriseId",
            title: "企业名称",
            visible: $scope.ifShowEnter
          }, {
            data: "name",
            title: "产品名称"
          }, {
            data: "desc",
            title: "产品描述"
          }, {
            data: "unit",
            title: "产品单位"
          }, {
            data: "createTime",
            title: "创建时间",
            visible: false
          }, $.ProudSmart.datatable.optionCol3];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [4, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "orderable": false,
              "render": function(data, type, full) {
                // 返回自定义内容
                if(type == "display") {
                  if(data) {
                    return '<input class="itemCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              "targets": 1,
              "data": "enterpriseId",
              "render": function(data, type, full) {
                var ary = $scope.enterpriseList.filter(function(item) {
                  return item.id == data;
                });
                return(ary && ary.length >= 1 && ary[0].name) ? ary[0].name : '-';
              }
            }, {
              "targets": 2,
              "data": "name",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 3,
              "data": "desc",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 4,
              "data": "unit",
              "render": function(data, type, full) {
                return data ? data : '无';
                // if (data && $scope.unitDics[data]) {
                //   return $scope.unitDics[data];
                // } else {
                //   return escape(data);
                // }
              }
            }, {
              "targets": 6,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                str += "<ul class='dropdown-menu' role='menu'>";
                str += "<li><a  href='#/productStructureInfo/" + full.id + "'>工艺流程</a></li>";
                str += "</ul></div>";
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
          var arrLength = [];
          for(var i = 1; i < columns.length - 1; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                  extend: 'excel',
                  title: '产品结构导出',
                  text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                  exportOptions: {
                    columns: arrLength
                  }
                }

              ]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }
        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $.extend($scope.dialog.input, row.data());
          ngDialog.open({
            template: '../partials/dialogue/product_info_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              row.remove().draw(false);
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
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
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
            $scope.selectedCount = 0;
            $scope.$apply();
            table.rows().invalidate().draw(false);
          }

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
          if(tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的产品信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if(ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if(returnObj.code == 0) {
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if(!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);
  //自己产品中使用
  directives.initDirective('productListTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        window.JSZip = jszip;
        $scope.$on(Event.ENTERPRISEINIT + "_productList", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [$.ProudSmart.datatable.selectCol, {
            data: "name",
            title: "产品名称"
          }, {
            data: "desc",
            title: "产品描述"
          }, {
            data: "unit",
            title: "产品单位"
          }, {
            data: "createTime",
            title: "创建时间",
            visible: false
          }, $.ProudSmart.datatable.optionCol3];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [4, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "orderable": false,
              "render": function(data, type, full) {
                // 返回自定义内容
                if(type == "display") {
                  if(data) {
                    return '<input class="itemCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              "targets": 1,
              "data": "name",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 2,
              "data": "desc",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 3,
              "data": "unit",
              "render": function(data, type, full) {
                return data ? data : '无';
                // if (data && $scope.unitDics[data]) {
                //   return $scope.unitDics[data];
                // } else {
                //   return escape(data);
                // }
              }
            }, {
              "targets": 4,
              "data": "createTime",
              "render": function(data, type, full) {

                var str = "";
                if(data) {
                  str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
                }
                return str;
              }
            }, {
              "targets": 5,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                str += "</div>";
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
          var arrLength = [];
          for(var i = 1; i < columns.length - 1; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                  extend: 'excel',
                  title: '产品结构导出',
                  text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                  exportOptions: {
                    columns: arrLength
                  }
                }

              ]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }
        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $.extend($scope.dialog.input, row.data());
          ngDialog.open({
            template: '../partials/dialogue/product_info_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              row.remove().draw(false);
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
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
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
            $scope.selectedCount = 0;
            $scope.$apply();
            table.rows().invalidate().draw(false);
          }

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
          if(tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的产品信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if(ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if(returnObj.code == 0) {
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if(!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================    产品结构设置    ===========================================
  directives.initDirective('productStructrueTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        $scope.$on(Event.ENTERPRISEINIT + "_structrue", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [$.ProudSmart.datatable.selectCol, {
            data: "energyConsumeNodeName",
            title: "能耗节点"
          }, {
            data: "occupyPrcent",
            title: "所用时间（分钟）"
          }, {
            data: "createTime",
            title: "",
            visible: false
          }, $.ProudSmart.datatable.optionCol3];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [3, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "orderable": false,
              "render": function(data, type, full) {
                // 返回自定义内容
                if(type == "display") {
                  if(data) {
                    return '<input class="itemCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              "targets": 1,
              "data": "energyConsumeNodeName",
              "render": function(data, type, full) {
                return full.energyConsumeNodeName ? full.energyConsumeNodeName : '无';
                // if (data && $scope.energyListDic[data]) {
                //   return $scope.energyListDic[data].label;
                // } else {
                //   return "无";
                // }
              }
            }, {
              "targets": 2,
              "data": "occupyPrcent",
              "render": function(data, type, full) {
                return data;
              }
            }, {
              "targets": 4,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                // str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                // str += "<ul class='dropdown-menu' role='menu'>";
                // str += "<li><a  href='#/productStructureInfo/" + full.id + "'>结构设置</a></li>";
                // str += "</ul></div>";
                str += "</div>";
                return str;

              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
          var arrLength = [];
          for(var i = 0; i < columns.length - 1; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                extend: 'excel',
                title: '工艺流程信息导出',
                text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                exportOptions: {
                  columns: arrLength
                }
              }]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }

        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $.extend($scope.dialog.input, row.data());
          ngDialog.open({
            template: '../partials/dialogue/product_structrue_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              row.remove().draw(false);
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
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
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
            $scope.selectedCount = 0;
            $scope.$apply();
            table.rows().invalidate().draw(false);
          }

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
          if(tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的企业信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if(ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if(returnObj.code == 0) {
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  row.remove().draw(false);
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if(!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================    企业经营信息    ===========================================
  directives.initDirective('enterpriseOperateTable', ['$timeout', 'ngDialog', '$compile', 'userLoginUIService', '$filter', 'growl', function($timeout, ngDialog, $compile, userLoginUIService, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        $scope.$on(Event.ENTERPRISEINIT + "_operate", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var columns = [$.ProudSmart.datatable.selectCol, {
            data: "statisticsPeriod",
            title: "统计周期"
          }, {
            data: "productionValue",
            title: "产值（万元）"
          }, {
            data: "additionalValue",
            title: "附加值（万元）"
          }, {
            data: "createTime",
            title: "创建时间",
          }, {
            data: "modifyTime",
            title: "更新时间"
          }, {
            data: "commitStatus",
            title: "状态"
          }, $.ProudSmart.datatable.optionCol3];
          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [4, "desc"]
            ],
            columns: columns,
            columnDefs: [{
              "targets": 0,
              "orderable": false,
              "render": function(data, type, full) {
                // 返回自定义内容
                if(type == "display") {
                  if(data) {
                    return '<input class="itemCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              "targets": 1,
              "data": "statisticsPeriod",
              "render": function(data, type, full) {
                var ary = new Date(data).Format("yyyy-M").split('-');
                if($scope.dialog.statisticsType == 'YEAR') {
                  return ary[0] + '年';
                } else if($scope.dialog.statisticsType == 'QUARTER') {
                  var quarter = '';
                  $scope.dialog.select.statisticsQuarter.forEach(function(item) {
                    if(item.id == ary[1]) {
                      quarter = item.text;
                    }
                  })
                  return ary[0] + '年 ' + quarter;
                } else if($scope.dialog.statisticsType == 'MONTH') {
                  return ary[0] + '年' + ary[1] + '月';
                }
                if(!$scope.dialog.statisticsType || !data) {
                  return "-";
                }
              }
            }, {
              "targets": 2,
              "data": "productionValue",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 3,
              "data": "additionalValue",
              "render": function(data, type, full) {
                return escape(data);
              }
            }, {
              "targets": 4,
              "data": "createTime",
              "render": function(data, type, full) {
                var str = '';
                str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                return str;
              }
            }, {
              "targets": 5,
              "data": "modifyTime",
              "render": function(data, type, full) {
                var str = '';
                str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                return str;
              }
            }, {
              "targets": 6,
              "data": "commitStatus",
              "render": function(data, type, full) {
                var severityStr = "";
                var severityBg = "";
                if(userLoginUIService.user.userType == 100) { //政府
                  if(data == 'pass') {
                    severityStr = "已审核"
                    severityBg = "label-success";
                  } else {
                    severityStr = "未审核"
                    severityBg = "label-default";
                  }
                } else {
                  if(data == 'yes' || data == 'pass') {
                    severityStr = "已提交"
                    severityBg = "label-success";
                  } else {
                    severityStr = "未提交"
                    severityBg = "label-default";
                  }
                }
                return "<span class='label " + severityBg + "'>" + severityStr + "</span>";
              }
            }, {
              "targets": 7,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                if(userLoginUIService.user.userType == 100) { //政府
                  if(full.commitStatus == 'pass') {
                    str += "<button id='edit-btn' disabled='true' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' disabled='true' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a role='button' id='view-btn'>查看详情</a></li>";
                  } else {
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a role='button' id='commit-btn'>审核</a></li>";
                    str += "<li><a role='button' id='view-btn'>查看详情</a></li>";
                  }
                } else {
                  if(full.commitStatus == 'yes' || full.commitStatus == 'pass') {
                    str += "<button id='edit-btn' disabled='true' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' disabled='true' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a role='button' id='view-btn'>查看详情</a></li>";
                  } else {
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a role='button' id='commit-btn'>提交</a></li>";
                    str += "<li><a role='button' id='view-btn'>查看详情</a></li>";
                  }
                }
                str += "</ul></div>";
                return str;

              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
          var arrLength = [];
          for(var i = 0; i < columns.length - 1; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                extend: 'excel',
                title: '企业经营信息导出',
                text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                exportOptions: {
                  columns: arrLength
                }
              }]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }

        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('edit', row.data(), function(returnObj) {
            return;
          });
        });

        domMain.on('click', '#view-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('view', row.data(), function(returnObj) {
            return;
          });
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('delete', [row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              growl.success("企业信息删除成功", {});
              row.remove().draw(false);
            }
          });
        });

        domMain.on('click', '#commit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('commit', row.data().id, function(returnObj) {
            if(returnObj.code == 0) {
              row.data().commitStatus = returnObj.data.commitStatus;
              table.rows().invalidate().draw(false);
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
            $scope.selectedCount = tableRows.count();
            $scope.$apply();
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
            $scope.selectedCount = 0;
            $scope.$apply();
          }
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
          if(tableRows.count() == 0) {
            $('#allselect-btn').attr("checked", false);
          }
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的企业信息", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var enterpriseIdAry = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              enterpriseIdAry.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if(ifGo) {
            $scope.doAction("delete", enterpriseIdAry, function(returnObj) {
              if(returnObj.code == 0) {
                var failObjTotal = returnObj.data.failObj.length;
                var successObjTotal = returnObj.data.successObj.length;
                growl.success("成功删除" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  if(row.data().commitStatus == 'yes') {
                    break;
                  } else {
                    row.remove().draw(false);
                  }
                }
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if(!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]
    }
  }]);

  //======================================   发布管理   ===========================================
  directives.initDirective('publishInfoTable', ['$timeout', 'ngDialog', '$compile', 'userLoginUIService', '$filter', 'growl', function($timeout, ngDialog, $compile, userLoginUIService, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        // window.pdfmake = pdfmake;
        $scope.$on(Event.ENTERPRISEINIT + "_publish", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          };
          var columns = [{
            data: "enterpriseId",
            title: "企业名称",
            visible: !$scope.ifEnterprise,
          }, {
            data: "reducePeriod",
            title: "节能周期"
          }, {
            data: "lastReducePeriodData",
            title: "上周期能耗数据（单位：吨标煤）"
          }, {
            data: "thisReduceIndicator",
            title: "本周期节能指标"
          }, {
            data: "thisExpectPeriodData",
            title: "本周期预期能耗数据（单位：吨标煤）"
          }];
          var columnDefs = [{
            "targets": 0,
            "render": function(data, type, full) {
              var str = '-';
              if(escape(data) && $scope.EnterprisesDic[data]) {
                str = $scope.EnterprisesDic[data].label;
              }
              return str;
            }
          }, {
            "targets": 1,
            "render": function(data, type, full) {
              return data ? data : '-';
            }
          }, {
            "targets": 2,
            "render": function(data, type, full) {
              return data ? data : '-';
            }
          }, {
            "targets": 3,
            "render": function(data, type, full) {
              return data ? data + '%' : '-';
            }
          }, {
            "targets": 4,
            "render": function(data, type, full) {
              return data ? data : '-';
            }
          }];
          if(!$scope.ifEnterprise) {
            columns.push($.ProudSmart.datatable.optionCol3);
            columnDefs.push({
              "targets": 5,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='btn-group btn-group-sm'>";
                if(full.lastCompleteStatus == 'yes') {
                  str += "<button id='complete-btn' disabled='true' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>已完成</span></button>";
                } else {
                  str += "<button id='complete-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>未完成</span></button>";
                }
                str += "</div>";
                return str;
              }
            })
          } else {
            columns.splice(5, 1);
            columnDefs.splice(5, 1);
          }
          table = domMain.DataTable({
            // dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "desc"]
            ],
            columns: columns,
            columnDefs: columnDefs,
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });

          var arrLength = [];
          for(var i = 0; i < columns.length; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                  extend: 'excel',
                  title: '节能指标导出',
                  text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                  exportOptions: {
                    columns: arrLength
                  }
                }
                //, {
                //extend: 'pdfFlash',
                // download: 'open',
                // title: '打印节能指标',
                // text: '<i class="fa fa-download"></i><span class="hidden-xs"> 打印节能指标</span>'
                // }
              ]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }

          domMain.on('click', '#complete-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('complete', row.data().id, function(returnObj) {
              if(returnObj.code == 0) {
                growl.success("节能周期已完成", {});
                row.data().lastCompleteStatus = returnObj.data.lastCompleteStatus;
                table.rows().invalidate().draw(false);
              }
            });
          });
        });

      }]
    }
  }]);

  //======================================    预测   ===========================================
  directives.initDirective('forecastInfoTable', ['$timeout', 'ngDialog', '$compile', 'userLoginUIService', '$filter', 'growl', function($timeout, ngDialog, $compile, userLoginUIService, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ENTERPRISEINIT + "_forecast", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          };
          var columns = [{
            data: "enterpriseId",
            title: "企业名称",
            visible: !$scope.ifEnterprise,
          }, {
            data: "forecastPeriod",
            title: "预测周期"
          }, {
            data: "allEnergyForecastData",
            title: "综合能耗预测值（单位：吨标煤）"
          }, $.ProudSmart.datatable.optionCol3];
          var columnDefs = [{
            "targets": 0,
            "render": function(data, type, full) {
              var str = '-';
              if(escape(data) && $scope.EnterprisesDic[data]) {
                str = $scope.EnterprisesDic[data].label;
              }
              return str;
            }
          }, {
            "targets": 1,
            "render": function(data, type, full) {
              return data ? data : '-';
            }
          }, {
            "targets": 2,
            "render": function(data, type, full) {
              return data ? data : '-';
            }
          }, {
            "targets": 3,
            "data": "option",
            "render": function(data, type, full) {
              var str = "<div class='btn-group btn-group-sm'>";
              str += "<button id='view-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>查看</span></button>";
              str += "</div>";
              return str;
            }
          }];

          table = domMain.DataTable({
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "desc"]
            ],
            columns: columns,
            columnDefs: columnDefs,
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
          var arrLength = [];
          for(var i = 0; i < columns.length - 1; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[0].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                extend: 'excel',
                title: '预测结果导出',
                text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                exportOptions: {
                  columns: arrLength
                }
              }]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }

          domMain.on('click', '#view-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('view', row.data(), function(returnObj) {
              return;
            });
          });
        });

      }]
    }
  }]);

  //======================================   企业间设备潜力点   ===========================================
  directives.initDirective('potentialDataTable', ['$timeout', 'ngDialog', '$compile', 'userLoginUIService', '$filter', 'growl', function($timeout, ngDialog, $compile, userLoginUIService, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        // window.pdfmake = pdfmake;
        $scope.$on(Event.ENTERPRISEINIT + "_potential_data", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          };
          var columns = args.option[0];
          var columnDefs = args.option[1];
          table = domMain.DataTable({
            // dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            data: args.option[2],
            order: [
              [0, "desc"]
            ],
            columns: columns,
            columnDefs: columnDefs,
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });

          var arrLength = [];
          for(var i = 0; i < columns.length; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[2].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                  extend: 'excel',
                  title: '设备潜力点分析导出',
                  text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                  exportOptions: {
                    columns: arrLength
                  }
                }

              ]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }
        });

      }]
    }
  }]);

  //======================================   企业内设备潜力点   ===========================================
  directives.initDirective('potentialDeviceTable', ['$timeout', 'ngDialog', '$compile', 'userLoginUIService', '$filter', 'growl', function($timeout, ngDialog, $compile, userLoginUIService, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        window.JSZip = jszip;
        // window.pdfmake = pdfmake;
        $scope.$on(Event.ENTERPRISEINIT + "_potential_device", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          };
          var columns = args.option[0];
          var columnDefs = args.option[1];
          table = domMain.DataTable({
            // dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            dom: '<"row"<"col-sm-6 margin-bottom-10">>' + (args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : ''),
            language: $.ProudSmart.datatable.language,
            data: args.option[2],
            order: [
              [0, "desc"]
            ],
            columns: columns,
            columnDefs: columnDefs,
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });

          var arrLength = [];
          for(var i = 0; i < columns.length; i++) {
            arrLength.push(i);
          }
          if(args.option && args.option[2].length >= 1) {
            new $.fn.dataTable.Buttons(table, {
              buttons: [{
                  extend: 'excel',
                  title: '设备潜力点分析导出',
                  text: '<i class="fa fa-download"></i><span class="hidden-xs"> 导出查询结果</span>',
                  exportOptions: {
                    columns: arrLength
                  }
                }

              ]
            });
            table.buttons().container().appendTo('.dataTables_wrapper .col-sm-6 ');
          }
        });

      }]
    }
  }]);

});