define(['directives/directives', 'datatables.net', 'datatables.net-bs'], function(directives, datatables) {
  'use strict';

  //======================================      线体管理管理   ===========================================
  directives.initDirective('linebodyManageTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl','userUIService', function($timeout, ngDialog, $compile, $filter, growl,userUIService) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.linebodyDescDisplay='';
        $scope.$on(Event.LINEBODYMANAGEINIT, function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var defaultColumns = [{
            data: "domainPath",
            title: "工厂归属"
          }, {
            data: "customerId",
            title: "工厂名称"
          }, {
            data: "projectName",
            title: "车间名称"
          },{
              data: "productionLineName",
              title: "线体名称"
          }];

          var defaultcolumnDefs = [{
            targets: 0,
            data: "domainPath",
            render: function(data, type, full) {
              var data = escape(data);
              var str = "";
              if(full.isEdit == 2 && type == "display") {
                return '<div class="dropdowntree select-sm" ng-model="selEditInfo.domainPath" change="" key="domainPath" options="domainListTree" mark="nodes" />';
              } else {
                if(data && $scope.domainListDic[data]) {
                  return $scope.domainListDic[data].label;
                } else {
                  return "无";
                }
              }
            }
          }, {
            targets: 1,
            data: "customerId",
            render: function(data, type, full) {
              var returnDate = '';
              var data = escape(data);
              // 返回自定义内容    
              if(full.isEdit == 2 && type == "display") {
                var str = ' <select style="width:100%;" ng-model="selEditInfo.customerId" class="form-control select2" selectdata="CustomerList" select2></select>';
                // var str = '<select ng-model="selCustomor" id="userDomainName" name="customerName" style="width:100%" class="combobox form-control" ng-change="alertFun(selCustomor)" ng-options="item.customerID as item.customerName for item in CustomerList"><option value="">请选择客户</option><select>'
                return str;
              } else {
                if(data && $scope.customerDic[data]) {
                  return $scope.customerDic[data]['customerName'];
                } else {
                  return "";
                }
              }
            }
          }, {
            targets: 2,
            data: "projectName",
            render: function(data, type, full) {
              // 返回自定义内容    
              if(full.isEdit == 2 && type == "display")
                return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
              else {
                return escape(data);
              }
            }
          }];
          //如果有一条属性也能够显示
          if(args.option.length > 1 && args.option[1].length > 0) {
            args.option[1].forEach(function(querykey) {
              defaultColumns.push({
                data: querykey.name,
                title: querykey.label
              });
              defaultcolumnDefs.push({
                "targets": defaultColumns.length - 1,
                "data":querykey.name,
                "render": function(data, type, full) {
                  var str = "";
                  if (full.values && full.values[querykey.name])
                   str = full.values[querykey.name];
                  return str;
                }
              })
            })
          } else {
            var defaultCol = [{
              data: "productionDescription",
              title: "线体生产说明",
              "render": function(data, type, full, meta) {
                // var addr = data;
                // if(full.values != null && full.values != undefined && full.values.standardAddress != null && full.values.standardAddress != undefined) {
                //   addr = full.values.standardAddress.split(",").join("") + " " + data;
                // }

                //return "<a ng-click='downClick('"+addr+"')>"+addr+"</a>";
                  var filename = data.split('&')[0];
                  var downloadname = data.split('&').length>1?data.split('&')[1]:data;
                  return "<a href='"+ userUIService.uploadFileUrl+"/"+ downloadname + "'>" + filename + "</a>";


              }
            }, {
              data: "installDate",
              title: "线体安装时间"
            }, {
              data: "debugFinishDate",
              title: "调试完成时间"
            }, {
              data: "qualityCloseDate",
              title: "质保截止时间"
            }];
            // if ($scope.menuitems['S46']) {
            //   defaultCol.push({
            //     data: "distributorId",
            //     title: "经销商名称"
            //   })
            // }
            defaultColumns = defaultColumns.concat(defaultCol);
            var defaultColDef = [{
              targets: 3,
              data: "productionDescription",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 5,
              data: "installDate",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = '';
                if(full.isEdit > 0)
                  return "<input style='width:100%' autocomplete='off' class='form-control input-sm' type='text' readonly='readonly' value='" + $filter('date')(data, 'yyyy-MM-dd') + "' date-time-picker>";
                else
                  str = $filter('date')(data, 'yyyy-MM-dd');
                return str;
              }
            }, {
              targets: 6,
              data: "debugFinishDate",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = '';
                if(full.isEdit > 0)
                  return "<input style='width:100%' autocomplete='off' class='form-control input-sm' type='text' readonly='readonly' value='" + $filter('date')(data, 'yyyy-MM-dd') + "' date-time-picker>";
                else {
                  if(data) {
                    str = $filter('date')(data, 'yyyy-MM-dd');
                  }
                  return str;
                }

              }
            }, {
              targets: 7,
              data: "qualityCloseDate",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = '';
                if(full.isEdit > 0)
                  return "<input style='width:100%' autocomplete='off' class='form-control input-sm' type='text' readonly='readonly' value='" + $filter('date')(data, 'yyyy-MM-dd') + "' date-time-picker>";
                else
                  str = $filter('date')(data, 'yyyy-MM-dd');
                return str;
              }
            }]
            if ($scope.menuitems['S46']) {
              defaultColDef.push({
                targets: 7,
                data: "distributorId",
                render: function(data, type, full) {
                  // var data = escape(data);
                  var str = '';
                  // 返回自定义内容    
                  if(full.isEdit == 2 && type == "display") {
                    var str = ' <select style="width:100%;" ng-model="selEditInfo.distributorId"  class="form-control select2" selectdata="distributorList" select2></select>';
                    return str;
                  } else {
                    if(data && $scope.distributorDic[data]) {
                      return $scope.distributorDic[data].distributorName;
                    } else {
                      if(data == -1){
                        str = '无';
                      }
                      return str;
                    }
    
                  }
                }
              })
            }
            defaultcolumnDefs = defaultcolumnDefs.concat(defaultColDef)
          }
          defaultColumns.push({
            data: "risingTime",
            title: "",
            visible: false
          })
          defaultColumns.push($.ProudSmart.datatable.optionCol3);
          defaultcolumnDefs.push({
            "targets": defaultColumns.length-1,
            "data": "option",
            "render": function(data, type, full) {
              // 返回自定义内容
              var str = "<div class='btn-group btn-group-sm'>";
              if(full.isEdit == 2) {
                str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                str += "</div>";
              } else {
                if($scope.menuitems['A03_S13']) {
                  str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                }
                if($scope.menuitems['A04_S13']) {
                  str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                }
                if($scope.menuitems['A01_S13']) {
                  str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  str += "<ul class='dropdown-menu' role='menu'>";
                  if($scope.menuitems['A01_S13']) {
                    str += "<li><a href='#/facility/linebody/" + full.id + "'>设备信息</a></li>";
                  }

                }
                str += "</div>";
              }
              return str;
            }
          })
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [defaultColumns.length - 2, "desc"]
            ],
            columns: defaultColumns,
            columnDefs: defaultcolumnDefs,
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
        });

        /**
         * 监听表格初始化后，添加按钮
         */
        domMain.on('init.dt', function() {
          var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addproject()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加项目</span></a>');
          $compile(parentDom)($scope);
        });
        // domMain.on('click', 'td', function(e) {
        //   e.preventDefault();
        //   var tr = $(this).closest('tr');
        //   var row = table.row(tr);
        //   var rowData = row.data();
        // }); 取消了点击事件

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          // if (!isEditing) {
          // isEditing = true;
          // row.data().isEdit = 2;
          row.data().installDate = $filter('date')(row.data().installDate, 'yyyy-MM-dd');
          row.data().debugFinishDate = $filter('date')(row.data().debugFinishDate, 'yyyy-MM-dd');
          row.data().qualityCloseDate = $filter('date')(row.data().qualityCloseDate, 'yyyy-MM-dd');
          if(row.data().values.standardAddress) {
            $scope.provinces = $scope.$parent.provinces;
            $scope.cityDics = $scope.$parent.cityDics;
            $scope.districtDics = $scope.$parent.districtDics;
            var arr = row.data().values.standardAddress.split(",");
            row.data().province = arr[0];
            if(arr[1]) {
              row.data().city = arr[0] + "," + arr[1];
            }
            if(arr[2]) {
              row.data().county = row.data().values.standardAddress;
            }
            //          if (arr[1]) {
            //            row.data().city = $scope.cityDics[arr[0]].find(function(item) {
            //              return arr[1] == item.label;
            //            }).id;
            //          }
            //          if (arr[2]) {
            //            row.data().county = $scope.districtDics[row.data().city].find(function(item) {
            //              return arr[2] == item.label;
            //            }).id;
            //          }
            //          $scope.cityList = $scope.cityDics[arr[0]];
            //          $scope.districtList = $scope.districtDics[row.data().city];
          } else {
            row.data().province = "";
            row.data().city = "";
            row.data().county = "";
          };

          $.extend($scope.linebodyInfo, row.data());
            $scope.linebodyDescDisplay = $scope.linebodyInfo.productionDescription.split("&")[0];
              ngDialog.open({
                template: '../partials/dialogue/linebody_dia.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
              });
          // $scope.selEditInfo = {
          //   "domainPath": row.data().domainPath, //客户归属
          //   "customerId": row.data().customerId, //客户id
          //   "distributorId": row.data().distributorId, //经销商id
          // }
          // row.cells().invalidate();
          // $compile(tr)($scope);
          // }
          // else {
          //   if (row.data().isEdit == 0) {
          //     growl.warning("当前有正编辑的项目", {});
          //     return;
          //   }
          // }
        });

        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var newDate = '';
          var checkPass = true;
          $.each(tr.children(), function(j, val1) {
            var jqob1 = $(val1);
            if(j == 0) {
              if(!$scope.selEditInfo.domainPath) {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else {
                $(val1).removeClass('danger');
                row.data()["domainPath"] = $scope.selEditInfo.domainPath;
              }
            }
            if(j == 1) {
              if(!$scope.selEditInfo.customerId) {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else {
                $(val1).removeClass('danger');
                row.data()["customerId"] = $scope.selEditInfo.customerId;
              }
            }
            if(j == 3) {
              if(!$scope.selEditInfo.distributorId) {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else {
                $(val1).removeClass('danger');
                row.data()["distributorId"] = $scope.selEditInfo.distributorId;
              }
            }
            //把input变为字符串
            if(!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input").val());
              if(txt) {
                if(j == 2) {
                  var reg = /^\s*$/g; //空为true
                  if(reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    row.data()["projectName"] = txt;
                    checkPass = true;
                  }
                }
                if(j == 4) {
                  var reg = /^\s*$/g; //空为true
                  if(reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  } else {
                    row.data()["projectAddress"] = txt;
                    checkPass = true;
                  }
                }
                if(j == 5 || j == 6 || j == 7) {
                  var val = Date.parse(txt);
                  newDate = new Date(val);
                  // row.data()["installDate"] = newDate;
                  table.cell(jqob1).data(newDate); //修改DataTables对象的数据
                }
                $(val1).removeClass('danger');
                table.cell(jqob1).data(txt); //修改DataTables对象的数据
              } else {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              }
            }
          });
          if(checkPass) {
            $scope.doAction('saveProject', row.data(), function(returnObj) {
              if(returnObj.code != 0) {
                row.data().isEdit = 2;
                row.data().id = 0;
              } else {
                row.data().isEdit = 0;
                row.data().id = returnObj.data.id;
                // isEditing = false;
                row.cells().invalidate().draw(false);
                $compile(tr)($scope);
              }
            });
          }

        });

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          // isEditing = false;
          var row = table.row('.shown');
          if(row.data()) {
            row.data().isEdit = 0;
            // row.child.hide();
            // row.cells().invalidate();
            $scope.doAction('cancel', row.data());
          } else {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            // row.child.hide();
            // row.cells().invalidate();
            $scope.doAction('cancel', row.data());
          }

        });
          domMain.on('click', '#cancel-btn', function(e) {
              e.stopPropagation();
              // isEditing = false;
              var row = table.row('.shown');
              if(row.data()) {
                  row.data().isEdit = 0;
                  // row.child.hide();
                  // row.cells().invalidate();
                  $scope.doAction('cancel', row.data());
              } else {
                  var tr = $(this).closest('tr');
                  var row = table.row(tr);
                  row.data().isEdit = 0;
                  // row.child.hide();
                  // row.cells().invalidate();
                  $scope.doAction('cancel', row.data());
              }

          });
          $scope.toggle = function(){
            $('#nv-file-select').click();
          }
        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deleteLinebody', row.data(), function(returnObj) {
            if(returnObj != 0) {
              // row.data().isEdit = 2
            } else {
              row.remove().draw(false);
            }
          });

        });

        // domMain.on('click', '#pro-btn', function(e) {
        //   e.preventDefault();
        //   var tr = $(this).closest('tr');
        //   var row = table.row(tr);
        //   var rowData = row.data();
        //   location.href = "index.html#/contractTerms///" + rowData.id;
        // });

        // domMain.on('click', '#devicelist-btn', function(e) {
        //   e.preventDefault();
        //   var tr = $(this).closest('tr');
        //   var row = table.row(tr);
        //   if (ifShow) {
        //     growl.info("请先关闭之前设备列表再打开", {});
        //     return;
        //   }
        //   ifShow = true;
        //   var innerString = '';
        //   innerString = '<div class="box">' +
        //     '<div class="box-body table-responsive">' +
        //     '<div class="pull-right">' +
        //     '<a id="close-table" class="btn btn-default btn-sm">' +
        //     '<i class="fa fa-times"></i><span class="hidden-xs">关闭</span>' +
        //     '</a>' +
        //     '</div>' +
        //     '<table width="100%" class="table" device-project-table></table>' +
        //     '</div>' +
        //     '</div>';

        //   row.child(innerString).show();
        //   tr.addClass('shown');
        //   tr.addClass('selected');
        //   tr.next().addClass('bg-f5f5f5');
        //   $compile(tr)($scope);
        //   $compile(tr.next())($scope);
        //   $scope.doAction('deviceProject', row.data());
        // });

        // domMain.on('click', '#close-table', function(e) {
        //   e.preventDefault();
        //   var tr = $(this).closest('tr');
        //   var row = table.row(tr);
        //   ifShow = false;
        //   $scope.doAction('cancel', row.data());
        // });

      }]
    }
  }]);

});