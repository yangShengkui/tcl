define(['directives/directives', 'datatables.net','datatables.net-bs', 'bootstrap-daterangepicker'], function(directives, datatables, daterangepicker) {
  'use strict';
  directives.initDirective('reportTemplateTable', ['$timeout', '$compile', '$filter', 'growl', 'weatherService', function($timeout, $compile, $filter, growl, weatherService) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.REPORTMODULE + "_template", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;
            table = domMain.DataTable({
              order: [
                [5, "desc"]
              ],
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.special2dom : '<"margin-bottom-5"<"special-btn">>',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: [{
                data: "domainPath",
                title: "管理域"
              },{
                data: "name",
                className: "td-word",
                title: "模板名称"
              }, {
                data: "title",
                className: "td-word",
                title: "模板标题"
              }, {
                data: "catalogId",
                title: "模板分类"
              }, {
                data: "dataSourceId",
                title: "数据源名称"
//            }, {
//              data: "domainPath",
//              title: "所属域"
              }, {
                data: "insertTime",
                title: "创建时间"
              }, {
                data: "fileName",
                width:'260px',
                title: "模板文件"
              }, {
                data: "option",
                orderable: false,
                width:'120px',
                title: "操作"
              }],
              columnDefs: [{
                targets: 0,
                data: "domainPath",
                render: function(data, type, full) {
                  if (type != "display") return "";
                  var str = "";
                  if (type == "display") {
                    if (full.isEdit > 0) {
                      str = '<div  class="dropdowntree" placeholder="请选择..." ng-model="selectedTemplate.domainPath" change="" key="domainPath" options="domainListTree" mark="nodes"/>';
                    } else {
                      if (data && $scope.domainListDic[data] != undefined && $scope.domainListDic[data]) {
                        str = $scope.domainListDic[data].label;
                      }
                    }
                  }
                  return str;
                }
              },{
                targets: 1,
                data: "name",
                render: function(data, type, full) {
                  if(full.isEdit > 0  && type == "display")
                    return "<input maxlength='80' ng-model='selectedTemplate.name' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 2,
                data: "title",
                render: function(data, type, full) {
                  if(full.isEdit > 0)
                    return "<input maxlength='80' ng-model='selectedTemplate.title' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                  else
                    return escape(data);
                }
              }, {
                targets: 3,
                data: "catalogId",
                render: function(data, type, full) {
                  if(full.isEdit > 0) {
                    return '<select style="width:100%" ng-model="selectedTemplate.catalogId" class="combobox form-control input-sm" ng-options="item.id as item.name for item in catalogs"><select>';
                  } else {
                    var str = "";
                    if($scope.catalogsDic[data] && $scope.catalogsDic[data].name != undefined){
                      str = $scope.catalogsDic[data].name;
                    }
                    return str;
                  }
                }
              }, {
                targets: 4,
                data: "dataSourceId",
                render: function(data, type, full) {
                  if(full.isEdit > 0) {
                    return '<select style="width:100%" ng-model="selectedTemplate.dataSourceId" class="combobox form-control input-sm" ng-options="item.id as item.name for item in dataSources"><select>';
                  } else {
                    var str = "";
                    if($scope.dataSourcesDic[data] && $scope.dataSourcesDic[data] != undefined ){
                      str = $scope.dataSourcesDic[data].name;
                    }
                    return str;
                  }
                }
              }, {
//              targets: 4,
//              data: "domainPath",
//              render: function(data, type, full) {
//                if(full.isEdit > 0) {
//                  return "<div class='dropdowntree select-sm' name='domainPath' key='domainPath' placeholder='请选择...' model='" + data + "' change='' options='domainListTree' mark='nodes' />";;
//                } else {
//                  if($scope.domainListDic[data] != undefined && $scope.domainListDic[data]){
//                    return $scope.domainListDic[data].label;
//                  }else{
//                    return "";
//                  }
//                }
//              }
//            }, {
                targets: 6,
                data: "fileName",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  if ((full.isEdit == 3 || full.isEdit == 2) && type == "display") {
//                  var str = '<input class="form-control input-sm" type="file" nv-file-select uploader="uploader"/>'
//                  str += '<button style="position: absolute" type="button" class="btn btn-success btn-sm" ng-click="uploadImage('+full.id+')" ng-disabled="!uploader.getNotUploadedItems().length">'
//                  str += '<span class="glyphicon glyphicon-upload"></span></button>'
//                  str += '</form>'
                    return "<uploader-div/>";
                  } else {
                    return data;
                  }
                }
              }, {
                targets: 5,
                data: "insertTime",
                render: function(data, type, full) {
                  return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                }
              }, {
                targets: 7,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var str = "";
                  if(full.isEdit > 0) {
                    str = '<div class="btn-group  btn-group-sm">' +
                      '<a id="save-btn" class="btn btn-default" ><i class="fa fa-check  hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">保存</span></a>' +
                      '<a id="cancel-btn" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                  } else {
                    str += "<div class='btn-group  table-option-group btn-group-sm'>" ;
                    str += "<button type='button' class='btn btn-default'>操作</button>" ;;
                    str +=  "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>" ;
                    str +=  "<span class='caret'></span>" ;
                    str +=  "<span class='sr-only'>Toggle Dropdown</span>" ;
                    str +=  "</button>";
                    str +=  "<ul class='dropdown-menu' role='menu'>";
                    if(full.existBuildPolicy == 0){
                      str += "<li ><a href id='edit-btn'>编辑</a></li>" ;
                    }
                    str +=   "<li><a href id='params-btn'>参数</a></li>";
                    str +=  "<li><a href id='del-btn'>删除</a></li>";
                    str +=  "</ul>";
                    str +=  "</div>";
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
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addtemplate()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加模板</span></a>'+
            '<a ng-click="openDataSource()" class="btn btn-default btn-sm"><i class="fa fa-edit"></i><span class="hidden-xs"> 管理数据源</span></a>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var checkPass = true;
            var selectRow = null;
            var row = table.row(tr);
            var rowData = row.data();
            var domainSelect = $('div[name="domainPath"]').attr("model");
            if(!jQuery.trim($scope.selectedTemplate.domainPath)) {
              growl.warning("请选择管理域", {});
              return;
            }
            if(!jQuery.trim($scope.selectedTemplate.name)) {
              growl.warning("请输入模板名称", {});
              return;
            }
            if(!jQuery.trim($scope.selectedTemplate.title)) {
              growl.warning("请输入模板标题", {});
              return;
            }
            if(!$scope.selectedTemplate.catalogId) {
              growl.warning("请选择模板分类", {});
              return;
            }
            if(!$scope.selectedTemplate.dataSourceId) {
              growl.warning("请选择数据源", {});
              return;
            }

            if(!$scope.selectedTemplate.tplFileName && !$scope.selectedTemplate.zipFileName){
              growl.warning("请选择模板文件", {});
              return;
            }
//          if (!domainSelect) {
//            growl.warning("请选择数据域", {});
//            return;
//          }
            var obj =  $scope.reportTemplates;
            for(var i in obj){
              if (obj[i].id != $scope.selectedTemplate.id && obj[i].name == jQuery.trim($scope.selectedTemplate.name)) {
                growl.warning("模板名称已存在!", {});
                return;
              }
            }
            if(rowData.isEdit > 0) {
              rowData.name = $scope.selectedTemplate.name;
              rowData.title = $scope.selectedTemplate.title;
              rowData.catalogId = $scope.selectedTemplate.catalogId;
              rowData.catalogName = $scope.catalogsDic[rowData.catalogId].catalogName;
              rowData.dataSourceId = $scope.selectedTemplate.dataSourceId;
              rowData.dataSourceName = $scope.dataSourcesDic[rowData.dataSourceId].dataSourceName;
//            rowData.domain = domainSelect;
//            rowData.domainPath = domainSelect;
              rowData.tplFileName = $scope.selectedTemplate.tplFileName;
              rowData.zipFileName = $scope.selectedTemplate.zipFileName;
              rowData.domainPath = $scope.selectedTemplate.domainPath;
              $scope.doAction('saveTemplate', rowData,function(returnObj) {
                if (returnObj) {
                  rowData.isEdit = 0;
                  // if(rowData.id == 0){
                    rowData.id = returnObj.id;
                    rowData.reportParamXML = returnObj.reportParamXML;
                    rowData.reportParams = returnObj.reportParams;
                  // }
                  if($scope.selectedTemplate){
                    rowData.fileName = $scope.selectedTemplate.tplFileName ? $scope.selectedTemplate.tplFileName : $scope.selectedTemplate.zipFileName;
                    rowData.tplFileName = $scope.selectedTemplate.tplFileName ? $scope.selectedTemplate.tplFileName : $scope.selectedTemplate.zipFileName;
                  }
                  $scope.selectedTemplate = null;
                  row.cells().invalidate();
                }
              });
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            $scope.selectedTemplate = null;
            isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(row.data().isEdit == 2){
              row.data().isEdit = 0;
              row.cells().invalidate();
            }else {
              var tmp =  $scope.reportTemplates;
              for(var i in tmp){
               if(tmp[i].id == 0){
                 $scope.reportTemplates.splice(i, 1);
                 break;
               }
              }
              row.data().isEdit = 0;
              row.remove().draw(false);
            }
            $scope.clearUploader();
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var obj =  $scope.reportTemplates;
            for(var i in obj){
              if (obj[i].isEdit > 0) {
                growl.warning("当前有未保存的数据", {});
                return;
              }
            }
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            isEditing = true;
            row.data().isEdit = 2;
            $scope.selectedTemplate = jQuery.extend(true, {}, row.data());
            row.cells().invalidate();
            $compile(tr)($scope);
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('deleteTemplate', row.data(),function(flg){
              if (flg) {
                row.remove().draw(false);
              }
            });
          });
          domMain.on('click', '#params-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('paramsHandler', row.data());
          });
          domMain.on('click', '#pdf-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('pdfTemplate', row.data());
          });
        }
      ]
    };
  }]);
  directives.initDirective('reportPolicyTable', ['$timeout', '$compile', '$filter', 'growl', 'weatherService', function($timeout, $compile, $filter, growl, weatherService) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var itemAttrs;
          $scope.$on(Event.REPORTMODULE + "_policy", function(event, args) {
            if(table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              order: [
                [7, "desc"]
              ],
	      //如果没有数据的时候special-btn会为空
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.special2dom : '<"margin-bottom-5"<"special-btn">>',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: [{
                data: "domainPath",
                title: "管理域"
              }, {
                data: "tplName",
                title: "报表模板"
              }, {
                data: "periodTypeValue",
                title: "生成周期"
              }, {
                data: "cronExp",
                title: "触发时间"
              }, {
                data: "reportFileTypeList",
                title: "生成格式"
              }, {
                data: "enabled",
                title: "是否启用"
              }, $.ProudSmart.datatable.optionCol2,{
                data: "updateTime",
                title: "",
                visible: false
              }],
              columnDefs: [{
                targets: 0,
                data: "domainPath",
                render: function(data, type, full) {
                  var str = "";
                  if (data && $scope.domainListDic[data] != undefined && $scope.domainListDic[data]) {
                    str = $scope.domainListDic[data].label;
                  }
                  return str;
                }
              },{
                targets: 1,
                data: "tplName",
                render: function(data, type, full) {
                  return escape(data);
                }
              }, {
                targets: 2,
                data: "periodTypeValue",
                render: function(data, type, full) {
                  var str = "";
                  if ($scope.periodListObj[data] && $scope.periodListObj[data].label != undefined) {
                    str = $scope.periodListObj[data].label;
                  }
                  return str;
                }
              }, {
                targets: 3,
                data: "cronExp",
                render: function(data, type, full) {
                  return data;
                }
              }, {
                targets: 4,
                data: "reportFileTypeList",
                render: function(data, type, full) {
                  return data;
                }
              }, {
                targets: 5,
                data: "enabled",
                render: function(data, type, full) {
                  if(type == "display") {
                    if(data == 1) {
                      return '<input class="enabledCheckBox" checked type="checkbox">';
                    } else {
                      return '<input class="enabledCheckBox" type="checkbox">';
                    }
                  }
                  return "";
                }
              }, {
                targets: 6,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容    
                  var str = "<div class='btn-group btn-group-sm'>";
                  str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  str += "</div>"
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
          domMain.on('init.dt', function () {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="policyhandler()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加策略</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var data = jQuery.extend(true, {}, row.data());
            $scope.doAction('editpolicy',data,function(flg){
              if (flg) {
                row.remove().draw(false);
              }
            });
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('deletepolicy', row.data(),function(flg){
              if (flg) {
                row.remove().draw(false);
              }
            });
          });
          domMain.on('change', '.enabledCheckBox', function(e) {
            var self = this;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var param = row.data();
            if(e.target.checked) {
              row.data().enabled = true;
              param.enabled = 1;
            } else {
              row.data().enabled = false;
              param.enabled = 0;
            }
            $scope.doAction("AlertEnable", param, function(returnObj) {
              if(returnObj.code == 0) {
                table.rows().invalidate().draw(false);
                if(!e.target.checked) {
                  $(self).prop("checked", false);
                  growl.success("停用成功", {});
                } else {
                  $(self).attr("checked", true);
                  growl.success("启用成功", {});
                }
              } else if(!returnObj) {
                if(!e.target.checked) {
                  row.data().enabled = true;
                  $(self).prop("checked", true);
                } else {
                  row.data().enabled = false;
                  $(self).attr("checked", false);
                }
              }
            }, true);
          });
        }
      ]
    };
  }]);
});