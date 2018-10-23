define(['directives/directives', 'datatables.net', 'datatables.net-bs'], function(directives, datatables) {
  'use strict';

  //======================================    合同条款管理    ===================================================

  directives.initDirective('contractTermsTable', ['$timeout', '$compile', '$filter', 'userEnterpriseService', 'growl', function($timeout, $compile, $filter, userEnterpriseService, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        var ifShow = false;
        $scope.$on(Event.CONTECTITEMSINIT, function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          if(ifShow) {
            ifShow = false;
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            ordering: false,
            order: [
              [7, "desc"]
            ],
            columns: [{
              data: "customerId",
              title: "客户名称"
            }, {
              data: "projectId",
              title: "项目名称"
            }, {
              data: "label",
              title: "合同条款名称"
            }, {
              data: "takeEffectTime",
              title: "生效日期"
            }, {
              data: "loseEfficacyTime",
              title: "失效日期"
            }, $.ProudSmart.datatable.optionCol3, {
              data: "id",
              visible: false,
              title: ""
            }, {
              data: "createTime",
              visible: false,
              title: ""
            }],
            columnDefs: [{
              targets: 0,
              data: "customerId",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if(full.isEdit == 2 && full.id == 0 && type == "display") {
                  var str = ' <select style="width:100%;"  ng-model="customor.id" class="form-control select2" selectdata="CustomerList"  ng-options="value.id as value.customerName for value in CustomerList"  ng-change="alertFunCustom()"  select2></select>';
                  // var str = '<select ng-model="selCustomor" id="userDomainName" name="customerName" style="width:100%" class="combobox form-control" ng-change="alertFun(selCustomor)" ng-options="item.customerID as item.customerName for item in CustomerList"><option value="">请选择客户</option><select>'
                  return str;
                } else {
                  if($scope.customersObj && $scope.customersObj[data]){
                    returnDate = $scope.customersObj[data].customerName;
                  }
                  return escape(returnDate);
                }
              }
            }, {
              targets: 1,
              data: "projectId",
              render: function(data, type, full) {
                var returnProjectDate = '';
                var put = '';
                // 返回自定义内容  
                if(full.isEdit == 2 && type == "display") {
                  // put = "<select class='combobox form-control input-sm'>";
                  // put += '<option value="">请选择...</option>';
                  // for (var i in $scope.selTableProject) {
                  //   if ($scope.selTableProject[i].label == data) {
                  //     put += '<option selected="true" value="' + $scope.selTableProject[i].id + '">' + $scope.selTableProject[i].label + '</option>';
                  //   } else {
                  //     put += '<option value="' + $scope.selTableProject[i].id + '">' + $scope.selTableProject[i].label + '</option>';
                  //   }
                  // }
                  // put += '</select>';
                  var str = '<select ng-model="selTableProjectId" ng-change="alertFunProId(selTableProjectId)" id="projectlists" name="projectId" style="width:100%" class="combobox form-control" ng-options="item.id as item.projectName for item in selTableProject"><option value="">请选择项目</option><option selected="selected">' + full.projectName + '</option><select>'
                  return str;
                } else {
                  var newDate = "";

                    if($scope.projectObj[data] != undefined) {
                      newDate = '<a href="index.html#/projectManagement/' + $scope.projectObj[data].id + ' " ng-click="linkProject(' + $scope.projectObj[data].id + ')">' + escape($scope.projectObj[data].projectName) + '</a>';
                    }
                  return newDate;
                }
              }
            }, {
              targets: 2,
              data: "label",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control ' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              targets: 3,
              data: "takeEffectTime",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = '';
                if(full.isEdit > 0)
                  return "<input style='width:100%' autocomplete='off' class='form-control ' type='text' readonly='readonly' value='" + $filter('date')(data, 'yyyy-MM-dd') + "' drops='down' date-time-picker>";
                else
                  str = $filter('date')(data, 'yyyy-MM-dd');
                return str;
              }
            }, {
              targets: 4,
              data: "loseEfficacyTime",
              render: function(data, type, full) {
                // 返回自定义内容  
                var str = '';
                if(full.isEdit > 0)
                  return "<input style='width:100%' autocomplete='off' class='form-control ' type='text' readonly='readonly' drops='down' value='" + $filter('date')(data, 'yyyy-MM-dd') + "' date-time-picker>";
                else
                  str = $filter('date')(data, 'yyyy-MM-dd');
                return str;
              }
            }, {
              "targets": 5,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容

                var str = "<div class='btn-group btn-group-sm'>";
                if(full.isEdit > 0) {
                  str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                  str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                  str += "</div>";
                } else {
                  if ($scope.menuitems['A02_S14']) {
                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if ($scope.menuitems['A03_S14']) {
                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                  if ($scope.menuitems['A05_S14']) {
                    str += "<button id='devicelist-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 设备</span></button>";
                  }
                  str += "</div>";
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
        domMain.on('init.dt', function() {
          // var parentDom = $(".specialss-btn").parent();
          // parentDom.html('<a ng-click="addcontectitem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加合同条款</span></a>');
          //parentDom.html('<select class="form-control select2" selectdata="CustomerList" itemchange="addcontecthandler" select2></select>');
          // $compile(parentDom)($scope);
        });

        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if(!isEditing) {
            isEditing = true;
            row.data().isEdit = 2;
            $scope.selTableProject = $scope.getselectedProject(row.data().customerId);
            // $scope.alertFun(row.data().customerId);
            $scope.selTableProjectId = row.data().projectId;
            row.cells().invalidate().draw(false);
          } else {
            if(row.data().isEdit == 0) {
              growl.warning("当前有正编辑的合同条款", {});
              return;
            }
          }
          if(row.data().id == 0) {
            growl.warning("当前有正编辑的合同条款", {});
            return;
          }
        });

        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var startDate = '';
          var endDate = '';
          var checkPass = true;
          var selectRow = null;
          var selproName = '';
          var takeEffectTime = '';
          var loseEfficacyTime = '';
          $.each(tr.children(), function(j, val1) {
            var jqob1 = $(val1);
            if(j == 0) {
              if(!row.data().customerId) { //无值
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else { //有值
                $(val1).removeClass('danger');
              }
            }
            if(j == 1) {
              if(!row.data().projectId) {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else {
                $(val1).removeClass('danger');
              }
            }
            //把input变为字符串
            if(!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input").val());
              if(txt) {
                if(j == 2) {
                  table.cell(jqob1).data(txt);
                  row.data()["label"] = txt;
                }
                if(j == 3) {
                  var startval = Date.parse(txt);
                  startDate = new Date(startval);
                  takeEffectTime = startDate;
                  // table.cell(jqob1).data(startDate);
                }
                if(j == 4) {
                  var val = Date.parse(txt);
                  endDate = new Date(val);
                  if(endDate <= startDate) {
                    growl.warning("请选择大于生效日期的日期点", {});
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }
                  loseEfficacyTime = endDate;
                  // table.cell(jqob1).data(endDate);
                }
                $(val1).removeClass('danger');
              } else {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              }
            }
          });
          if(checkPass) {
            row.data()["takeEffectTime"] = takeEffectTime;
            row.data()["loseEfficacyTime"] = loseEfficacyTime;
            $scope.doAction('saveContracts', row.data(), function(returnObj) {
              if(!returnObj) {
                row.data().isEdit = 2;
              } else {
                row.data().isEdit = 0;
                row.data().id = returnObj.id;
                isEditing = false;
                row.cells().invalidate().draw(false);
              }
            });
          }
        });

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          isEditing = false;
          var row = table.row('.shown');
          if(row.data()) {
            row.data()["isEdit"] = 0;
            ifShow = false;
            $scope.selCustomor = '';
            $scope.doAction('cancel', row.data());
          } else {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data()["isEdit"] = 0;
            ifShow = false;
            $scope.selCustomor = '';
            $scope.doAction('cancel', row.data());
          }
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deleteContract', row.data(), function(returnObj) {
            if(returnObj != 0) {
              row.data().isEdit = 2;
              ifShow = false;
            } else {
              row.data().isEdit = 0;
              row.remove().draw(false);
            }
          });
        });

        domMain.on('click', '#devicelist-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if(ifShow) {
            growl.info("请先关闭之前设备列表再打开", {});
            return;
          }
          ifShow = true;
          var innerString = '<div class="box">' +
            '<div class="box-body table-responsive">' +
            // '<a ng-click="addDevicesToItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加设备</span></a>' +
            '<div class="margin-bottom-10"><select style="width:20%;" ng-model="selected.devicesId"  ng-change="changeDevices();" class="form-control select2" ng-options="value.id as value.label for value in facilitySelList" selectdata="facilitySelList" select2></select>' +
            ' <div class="pull-right">' +
            '<a id="savesel-table" ng-click="saveselDevices()" class="btn btn-primary btn-sm margin-right-5">' +
            '<i class="fa fa-save"></i><span class="hidden-xs"> 保存</span>' +
            '</a>' +
            '<a id="close-table" class="btn btn-default btn-sm">' +
            '<i class="fa fa-times"></i><span class="hidden-xs"> 关闭</span>' +
            '</a>' +
            '</div> </div>' +
            '<table width="100%" class="table" device-list-table></table>' +
            '</div>' +
            '</div>';
          row.child(innerString).show();
          tr.addClass('shown');
          tr.addClass('bg-f5f5f5');
          tr.next().addClass('bg-f5f5f5');
          $compile(tr)($scope);
          $compile(tr.next())($scope);
          $scope.doAction('showDeviceList', row.data());
        })

        domMain.on('click', '#close-table', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          ifShow = false;
          $scope.doAction('cancel', row.data());
        });

      }]
    }
  }])

  //======================================      项目管理   ===========================================
  directives.initDirective('projectManageTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.PROJECTMANAGEINIT, function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          var defaultColumns = [{
            data: "domainPath",
            title: (($scope.menuitems['S12'] && $scope.menuitems['S12'].label) ? $scope.menuitems['S12'].label : "客户") + "归属"
          }, {
            data: "customerId",
            title: (($scope.menuitems['S12'] && $scope.menuitems['S12'].label) ? $scope.menuitems['S12'].label : "客户") + "名称"
          }, {
            data: "projectName",
            title: (($scope.menuitems['S13'] && $scope.menuitems['S13'].label) ? $scope.menuitems['S13'].label : "项目") + "名称"
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
              data: "projectAddress",
              title: (($scope.menuitems['S13'] && $scope.menuitems['S13'].label) ? $scope.menuitems['S13'].label : "项目")+"地址",
              "render": function(data, type, full, meta) {
                var addr = data;
                if(full.values != null && full.values != undefined && full.values.standardAddress != null && full.values.standardAddress != undefined) {
                  addr = full.values.standardAddress.split(",").join("") + " " + data;
                }

                return addr;
              }
            }, {
              data: "installDate",
              title: (($scope.menuitems['S13'] && $scope.menuitems['S13'].label) ? $scope.menuitems['S13'].label : "项目")+"安装时间"
            }, {
              data: "debugFinishDate",
              title: "调试完成时间"
            }, {
              data: "qualityCloseDate",
              title: "质保截止时间"
            }];
            if ($scope.menuitems['S46']) {
              defaultCol.push({
                data: "distributorId",
                title: "经销商名称"
              })
            }
            defaultColumns = defaultColumns.concat(defaultCol);
            var defaultColDef = [{
              targets: 3,
              data: "projectAddress",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 4,
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
              targets: 5,
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
              targets: 6,
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
                    str += "<li><a href='#/facility/project/" + full.id + "'>设备信息</a></li>";
                  }
                  if($scope.menuitems['A01_S13']) {
                    str += "<li><a href='#/projectDocumentation/" + full.id + "'>项目文档</a></li></ul>";
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

          $.extend($scope.projectInfo, row.data());
          ngDialog.open({
            template: '../partials/dialogue/project_management_dia.html',
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

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deleteProject', row.data(), function(returnObj) {
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

  //======================================     合同条款过滤设备 ==========================================
  directives.initDirective('faciDeviceTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;

        $scope.$on(Event.SELDEVICEINIT + "_faciDivice", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args && args.length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args,
            order: [
              [1, "desc"]
            ],
            columns: [$.ProudSmart.datatable.selectCol, {
              data: "custermerId",
              title: "客户"
            }, {
              data: "modelId",
              title: "型号"
            }, {
              data: "label",
              title: "名称"
            }, {
              data: "sn",
              title: "序列号"
            }],
            columnDefs: [{
              orderable: false,
              targets: 0,
              render: function(data, type, full) {
                if(type == "display") {
                  if(full.check == 1001) {
                    return '<input class="itemCheckBox" checked type="checkbox" >';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox" ng-checked="full.check == 1001">';
                  }
                }
                return "";
                // var str = '<input type="checkbox" style="width: 19px;height: 25px;" boxClass="icheckbox_minimal-blue" value="' + full.userID + '" ng-disabled="full.manageCheck == 2001" name="oddBox" class="minimal" ng-checked="full.check == 1001"> ';
                // if (full.check == 1001) {
                //   str = '<input type="checkbox" style="width: 19px;height: 25px;" boxClass="icheckbox_minimal-blue" value="' + full.userID + '" ng-disabled="full.manageCheck == 2001" name="oddBox" class="minimal" checked=checked> ';

                // }
                // return str;
              }
            }, {
              targets: 1,
              data: "customerId",
              render: function(data, type, full) {
                var returnData = '';
                for(var i in $scope.CustomerList) {
                  if($scope.CustomerList[i].customerID == data) {
                    returnData = $scope.CustomerList[i].customerName;
                  }
                }
                return returnData;
              }
            }, {
              targets: 2,
              data: "modelId",
              render: function(data, type, full) {
                var returnType = '';
                for(var i in $scope.modelListSelect) {
                  var obj = $scope.modelListSelect[i];
                  if(obj.id == data) {
                    return returnType = obj.label;
                  }
                }
                return returnType;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              if(aData.check) {
                $(nRow).addClass("selected")
              } else {
                $(nRow).removeClass("selected")
              }
              $compile(nRow)($scope);
            }
          });
        });

        //全选
        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          if(e.target.checked) {
            // table.rows().select();
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().check = 1001;
            };
            table.rows().invalidate().draw(false);
          } else {
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().check = 0;
            };
            // table.rows().deselect();
            table.rows().invalidate().draw(false);
          }
        })

        domMain.on('click', "td", function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          if(rowData.check != 1001) {
            rowData.check = 1001;
          } else {
            rowData.check = 0;
          }
          row.cells().invalidate();

        })

      }]
    }
  }])

  //======================================      合同条款设备   ============================================

  directives.initDirective('deviceListTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;

        $scope.$on(Event.SELDEVICEINIT, function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            // select: $.ProudSmart.datatable.select,
            data: args.option[0],
            // searching: false,
            // order: [
            //   [0, "desc"]
            // ],
            columns: [{
                data: "modelId",
                title: "设备模板"
              }, {
                data: "label",
                title: "设备名称"
              }, {
                data: "sn",
                title: "设备序列号"
              },$.ProudSmart.datatable.optionCol1
            ],
            columnDefs: [{
              targets: 0,
              width:'20%',
              data: "modelId",
              render: function(data, type, full) {
                // 返回自定义内容    
                var returnType = '';
                if(full.isEdit == 3){
                  returnType = '<select style="width:100%;" ng-model="selected.devicesId"  class="form-control select2" ng-options="value.id as value.label for value in facilitySelList" selectdata="facilitySelList" select2></select>';
                }else{
                  for(var i in $scope.modelListSelect) {
                    var obj = $scope.modelListSelect[i];
                    if(obj.id == data) {
                      returnType = obj.label;
                      break;
                    }
                  }
                }
                return returnType;
              }
            }, {
              targets: 1,
              data: "label",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              "targets": 3,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='input-group'>";
                if(full.isEdit == 2 || full.isEdit == 3) {
                  str += "<a id='save-btn'  class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 保存</span></a>"
                  str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                } else {
                  str += "<a id='delDevice-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 移出</span></a>"
                }
                str += "</div>"
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
            if(aData.check) {
              $(nRow).addClass("selected")
            } else {
              $(nRow).removeClass("selected")
            }
            $compile(nRow)($scope);
          }
          });
        });

        /**
         * 监听表格初始化后，添加按钮
         */
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addDevicesToItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加设备</span></a>');
          // $compile(parentDom)($scope);
        });
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();

        });

        domMain.on('click', '#delDevice-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doActionss('removeDevice', row.data());
          row.remove().draw(false);
        });

      }]
    }
  }])

  //======================================      项目设备   ============================================

  directives.initDirective('deviceProjectTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;

        $scope.$on(Event.PRODEVICEINIT, function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "desc"]
            ],
            columns: [{
              data: "modelId",
              title: "设备模板"
            }, {
              data: "deviceName",
              title: "设备名称"
            }, {
              data: "serialNo",
              title: "设备序列号"
            }],
            columnDefs: [

              {
                targets: 0,
                data: "modelId",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  var returnType = '';
                  for(var i in $scope.modelListSelect) {
                    var obj = $scope.modelListSelect[i];
                    if(obj.id == data) {
                      return returnType = obj.label;
                    }
                  }
                  return returnType;
                }
              }

            ]
          });
        });

      }]
    }
  }])

  //======================================      故障知识   ===========================================
  directives.initDirective('faultKnowledgeTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        $scope.$on(Event.FAULTKNOWLEDGEINIT, function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option && args.option.length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
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
              }, {
                data: "severity",
                title: "严重级别",
                width: "15%"
              },
              $.ProudSmart.datatable.optionCol2, {
                data: "id",
                title: "",
                visible: false
              }
            ],
            columnDefs: [{
              targets: 0,
              data: "faultNo",
              render: function(data, type, full) {
                //返回自定义名字
                if(full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' style='width:100%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'faultNo'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 1,
              data: "label",
              render: function(data, type, full) {
                //返回自定义名字
                if(full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' style='width:100%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'label'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 2,
              data: "category",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input maxlength='50' style='width:100%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'category'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 3,
              data: "desc",
              render: function(data, type, full) {
                // 返回自定义内容  
                if(full.isEdit == 2 && type == "display")
                  return "<input maxlength='50' style='width:100%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'desc'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 4,
              data: "severity",
              render: function(data, type, full) {
                // 返回自定义内容   
                if(full.isEdit == 2 && type == "display") {
                  var str = '<select ng-model="selSeverity" ng-change="alertFun(selSeverity)" id="severity" name="severity" style="width:100%" class="combobox form-control" ng-options="item.severNo as item.severName for item in severiesList"><option value="">请选择...</option><select>';
                  return str;
                } else {
                  var severityStr = "无数据";
                  var severityBg = "alerts-warning";
                  if(data == 4) {
                    severityStr = "严重";
                    severityBg = "alerts-critical";
                  } else if(data == 3) {
                    severityStr = "重要";
                    severityBg = "alerts-major";
                  } else if(data == 2) {
                    severityStr = "次要";
                    severityBg = "alerts-minor";
                  } else if(data == 1) {
                    severityStr = "警告";
                    severityBg = "alerts-warning";
                  }
                  return "<span class='label " + severityBg + "'>" + severityStr + "</span>";
                }
              }
            }, {
              "targets": 5,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = '';
                if(full.isEdit == 2) {
                  str += '<div class="btn-group btn-group-sm">' +
                    '<a id="save-btn" class="btn btn-default"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>' +
                    '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                } else {
                  str += '<div class="btn-group btn-group-sm">';
                  if ($scope.menuitems['A02_S10']) {
                    str += '<a id="edit-btn" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                  }
                  if ($scope.menuitems['A03_S10']) {
                    str += '<a id="del-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';
                  }
                 }
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
        });

        function format(d) {
          var returnStr;
          if(d.isEdit > 0) {
            returnStr = '<table width="100%" class="table table-inner">';
            for(var i in d) {
              returnStr += '<tr role="row">';
              if(i == 'phenomenon') {
                returnStr += '<td style="width:19%;">故障现象:</td>';
                returnStr += '<td><textarea rows="7" cols="20" autocomplete="off" datatype="' + d.phenomenon + '" style="width:75%;resize: none;" class="form-control input-sm" name="phenomenon" value="' + (d.phenomenon) + '">' + (d.phenomenon) + '</textarea></td>';
              } else if(i == 'cause') {
                returnStr += '<td style="width:19%;">产生原因:</td>';
                returnStr += '<td><textarea rows="7" cols="20" autocomplete="off" datatype="' + d.cause + '" style="width:75%;resize: none;" class="form-control input-sm" name="cause" value="' + (d.cause) + '">' + (d.cause) + '</textarea></td>';
              } else if(i == 'processingMethod') {
                returnStr += '<td style="width:19%;">处理方法:</td>';
                returnStr += '<td><textarea rows="7" cols="20" autocomplete="off" datatype="' + d.processingMethod + '" style="width:75%;resize: none;" class="form-control input-sm" name="processingMethod" value="' + (d.processingMethod) + '">' + (d.processingMethod) + '</textarea></td>';
              }
              returnStr += '</tr>';
            }
            returnStr += '</table>';
          } else {
            returnStr = '<table width="100%" class="table table-inner">';
            for(var i in d) {
              returnStr += '<tr role="row">';
              if(i == 'phenomenon') {
                returnStr += '<td style="width:19%;">故障现象:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.phenomenon + '</div></td>';
              } else if(i == 'cause') {
                returnStr += '<td style="width:19%;">产生原因:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.cause + '</div></td>';
              } else if(i == 'processingMethod') {
                returnStr += '<td style="width:19%;">处理方法:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.processingMethod + '</div></td>';
              }
              returnStr += '</tr>';
            }
            returnStr += '</table>';
          }

          return returnStr;
        }

        $scope.$on("table-search-handle", function(event, args) {
          if (args.name == $attrs.name)
            table.search( args.value ).draw();
        });
        
        /**
         * 监听表格初始化后，添加按钮
         */
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addFaultKnowledge()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加故障知识</span></a>');
          // $compile(parentDom)($scope);
        });
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if(($(this).context.cellIndex == 5 && row.data().isEdit == 0)) {
            return;
          }

          var rowData = row.data();
          if(rowData) {
            if(row.child.isShown()) { //之前展开
              // This row is already open - close it
              if(row.data().isEdit == 0 || row.data().isEdit == undefined) { //如果是展示，直接合上
                row.child.hide();
                tr.removeClass('shown');
              } else if(row.data().isEdit == 2) { //如果是编辑，则仍是展开状态
                if(!tr.hasClass('shown')) {
                  row.child(format(rowData)).show();
                  tr.addClass('shown');
                }
              }
            } else { //之前关闭，则需要展开
              // Open this row
              var data = row.data();
              if(data.isEdit == 0 || data.isEdit == undefined) {
                row.child(format(data)).show();
              } else if(data.isEdit == 2) {
                if(!tr.hasClass('shown')) {
                  row.child(format(rowData)).show();
                  tr.addClass('shown');
                }
              }

            }
          }
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if(!isEditing) {
            isEditing = true;
            row.data().isEdit = 2;
            $scope.selSeverity = row.data().severity;
            // row.cells().invalidate().draw(false); //第二页编辑在第一页显示
            row.cells().invalidate();
            $compile(tr)($scope); //会重复执行两遍
          } else {
            if(row.data().isEdit == 0) {
              growl.warning("当前有正编辑的故障知识", {});
              return;
            }
          }
        });

        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var tds = $(this).parents("tr").children();
          var checkPass = true;
          var selectRow = null;
          for(var i in row.data()) {
            if(i == 'isEdit' && row.data()[i] == 2) {
              selectRow = row.data();
            }
          }
          $.each(tds, function(j, val1) {
            var jqob1 = $(val1);
            //把input变为字符串
            if(j == 4) {
              if(!selectRow.severity) {
                $(val1).addClass('danger');
                isEditing = true;
                return false;
              } else {
                isEditing = false;
                $(val1).removeClass('danger');
              }
            }
            if(!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input,textarea").val());
              if(txt) {
                $(val1).removeClass('danger');
                isEditing = false;
                table.cell(jqob1).data(txt);
              } else {
                $(val1).addClass('danger');
                isEditing = true;
                return false;
              }
            }
          });

          if(!selectRow) {
            growl.warning("请填写完整故障知识", {});
            return;
          }
          var ipts = tr.parent().find('.input-sm');
          if(isEditing == false){
            $.each(ipts, function(i, val) {
              var txt = $(val).val();
              var attrname = $(val).attr('name');
              if(txt.length > 3000) {
                growl.warning("您输的字符超限，请控制在3000字符以内", {});
                isEditing = true;
                return false; //跳出循环
              }else{
                selectRow[attrname] = txt;
                isEditing = false;
              }
            });
          }

          // var txts = tr.parent().find('textarea');
          // $.each(txts, function(i, val) {
          //     var txt = $(val).val();
          //     var attrname = $(val).attr('name');
          //     selectRow[0][attrname] = txt;
          //     if (txt.length > 70) {
          //         growl.warning("您输的字符超限，请控制在70字以内", {});
          //         checkPass = false;
          //         return;
          //     }
          // });

          if(isEditing == false) {
            $scope.doAction('savefaultKnowledge', selectRow, function(returnObj) {
              if(!returnObj) {
                selectRow.isEdit = 2;
                selectRow.id = 0;
              } else {
                selectRow.isEdit = 0;
                selectRow.id = returnObj.id;
                isEditing = false;
                tr.removeClass('shown');
                row.cells().invalidate().draw(false);
                row.child.hide();
              }
            });
          }
        });

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          isEditing = false;
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

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deletefaultKnowledge', row.data(), function(returnObj) {
            if(returnObj != 0) {
              selectRow.isEdit = 2;
            } else {
              row.remove().draw(false);
            }
          });
        });

      }]
    }
  }])
});