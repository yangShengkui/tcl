define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'], function(directives, BootstrapDialog, datatables) {
  'use strict';

  //======================================    告警规则     ===========================================
  directives.initDirective('alertRulesTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ALERTRULESINIT + "_rules", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [8, "desc"]
            ],
            columns: [$.ProudSmart.datatable.selectCol, {
              data: "title",
              title: "规则名称"
            }, {
              data: "domain",
              title: "管理域"
            }, {
              data: "modelId",
              title: "资源类型"
            }, {
              data: "condition",
              title: "规则条件"
            }, {
              data: "alertCode",
              title: "告警类别"
            }, {
              data: "severity",
              title: "告警级别"
            }, {
              data: "enabled",
              title: "启用",
              visible: $scope.menuitems['A13_S45'] ? true : false,
              orderable: false
            }, {
              data: "risingTime",
              title: "",
              visible: false
            }, $.ProudSmart.datatable.optionCol3],
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
              targets: 1,
              data: "title",
              render: function(data, type, full) {
                var returnDate = '';
                var data = escape(data);
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display") {
                  var str = ' <select style="width:100%;" ng-model="selEditInfo.customerId" class="form-control select2" selectdata="CustomerList" select2></select>';
                } else {

                }
                return data;
              }
            }, {
              targets: 3,
              data: "modelId",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else {
                  var str = "";
                  if(data) {
                    for(var i in $scope.allModelLists) {
                      if($scope.allModelLists[i].id == data) {
                        str = $scope.allModelLists[i].label;
                      }
                    }
                    
                    if (!str) str = "【未知类型】";

                    if(full.nodeIds) {
                      var nodeName = [];
                      var nodeIdAry = full.nodeIds.split(",")
                      nodeIdAry.forEach(function(nodeId) {
                        for(var i in $scope.allDeveicesList) {
                          if(nodeId == $scope.allDeveicesList[i].id) {
                            nodeName.push($scope.allDeveicesList[i].label);
                            break;
                          }
                        }
                        for (var i in $scope.projectList) {
                          if(nodeId == $scope.projectList[i].id) {
                            nodeName.push($scope.projectList[i].projectName);
                            break;
                          }
                        }
                        if($scope.customerDic[nodeId]) {
                          nodeName.push($scope.customerDic[nodeId].text);
                        }
                        if($scope.domainListDic[nodeId]) {
                          nodeName.push($scope.domainListDic[nodeId].label);
                        }
                      });
                      
                      str = "在"+str+"的<b>["+nodeName.toString()+"]</b>有效";
                    }
                  }
                  return str;
                }
              }
            }, {
              targets: 2,
              data: "domain",
              render: function(data, type, full) {
                var str = "无权限查看";
                if(data && $scope.domainListDic[data]) {
                  str = $scope.domainListDic[data].label;
                }
                return str;
              }
            }, {
              targets: 4,
              data: "condition",
              render: function(data, type, full) {
                var str = "";
                var unitStr = '';
                if (full.kpiCodes && full.kpiCodes.length == 1) {
                  full.kpiCode = full.kpiCodes[0];
                  if ($scope.kpiLists[full.kpiCode]) {
                    str += $scope.kpiLists[full.kpiCode].label;
                  } else if (!$scope.kpiLists[full.kpiCode]) {
                    str += "无kpi指标";
                  }
                  if($scope.kpiLists && $scope.kpiLists[full.kpiCode] && $scope.kpiLists[full.kpiCode]['unit']) {
                    var unit = $scope.kpiLists[full.kpiCode]['unit'];
                    unitStr = $scope.myOptionDic ? $scope.myOptionDic[unit] : "";
                  }
                } else if (full.kpiCodes && full.kpiCodes.length == 2) {
                  var kpiLabels = [];
                  full.kpiCodes.forEach(function (kc) {
                    if ($scope.kpiLists[kc]) {
                      kpiLabels.push($scope.kpiLists[kc].label);
                      if($scope.kpiLists && $scope.kpiLists[kc] && $scope.kpiLists[kc]['unit']) {
                        var unit = $scope.kpiLists[kc]['unit'];
                        unitStr = $scope.myOptionDic ? $scope.myOptionDic[unit] : "";
                      }
                    }
                  });
                  str += kpiLabels.join(',');
                } else if (full.kpiCodes && full.kpiCodes.length > 2) {
                  var kpiLabels = [];
                  full.kpiCodes.forEach(function (kc, index) {
                    if ($scope.kpiLists[kc] && kpiLabels.length < 2) {
                      kpiLabels.push($scope.kpiLists[kc].label);
                      if($scope.kpiLists && $scope.kpiLists[kc] && $scope.kpiLists[kc]['unit']) {
                        var unit = $scope.kpiLists[kc]['unit'];
                        unitStr = $scope.myOptionDic ? $scope.myOptionDic[unit] : "";
                      }
                    }
                  });
                  str += kpiLabels.join(',') + '...';
                }

                //kpi值
                /*if(full.kpiCode && $scope.kpiLists[full.kpiCode]) {
                  str += $scope.kpiLists[full.kpiCode].label;
                } else if(full.kpiCode && !$scope.kpiLists[full.kpiCode]) {
                  str += "无kpi指标";
                }*/

                //条件
                for(var i in $scope.condition) {
                  if(full.condition == $scope.condition[i]["value"]) {
                    if($scope.condition[i]["name"] == "表达式") {
                      str += "满足条件：";
                    } else {
                      str += $scope.condition[i]["name"];
                    }
                    break;
                  }
                }
                str += full.refValue;
                /*if($scope.kpiLists && $scope.kpiLists[full.kpiCode] && $scope.kpiLists[full.kpiCode]['unit']) {
                  var unit = $scope.kpiLists[full.kpiCode]['unit'];
                  str += $scope.myOptionDic ? $scope.myOptionDic[unit] : "";
                } else {
                  str += "";
                }*/
                str += unitStr;
                return str;
              }
            }, {
              targets: 5,
              data: "alertCode",
              render: function(data, type, full) {
                var str = "";
                if(data) {
                  for(var i in $scope.alertClassifyLists) {
                    if($scope.alertClassifyLists[i].id == data) {
                      str = $scope.alertClassifyLists[i].label;
                    }
                  }
                }
                return str;
              }
            }, {
              targets: 6,
              data: "severity",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else {
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
              targets: 7,
              data: "enabled",
              visible: $scope.menuitems['A13_S45'] ? true : false,
              render: function(data, type, full) {
                if(type == "display") {
                  if(data) {
                    return '<input class="enabledCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="enabledCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              "targets": 9,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                if(full.enabled == true) {
                  if($scope.menuitems['A05_S45']) {
                    str += "<button id='edit-btn' class='btn btn-primary' disabled='true' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if($scope.menuitems['A04_S45']) {
                    str += "<button id='del-btn' class='btn btn-default'  disabled='true'><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                } else {
                  if($scope.menuitems['A05_S45']) {
                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if($scope.menuitems['A04_S45']) {
                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                }

                if($scope.menuitems['A03_S45'] || $scope.menuitems['A06_S45'] || $scope.menuitems['A12_S45']) {
                  str += "<button type='button'  class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                }
                str += "<ul class='dropdown-menu' role='menu'>";
                if($scope.menuitems['A12_S45']) {
                  str += "<li><a role='button' id='view-btn'>查看详情</a></li>";
                }
                if($scope.menuitems['A06_S45']) {
                  str += "<li><a role='button' id='copy-btn'>复制规则</a></li>";
                }
                if($scope.menuitems['A03_S45']) {
                  str += "<li><a role='button' id='inform-btn'>告警通知</a></li>";
                }
                str += "</ul></div>";
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              if(aData.selected) {
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
        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if(row.data()['nodeIds']) {
            location.href = "index.html#/alertRules/special/" + $.trim(row.data().id) + "/edit";
          } else {
            location.href = "index.html#/alertRules/global/" + $.trim(row.data().id) + "/edit";
          }
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deleteAlertRules', [row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              row.remove().draw(false);
              growl.success("删除成功", {});
            }
          }, true);
        });

        domMain.on('click', '#inform-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          location.href = "index.html#/alertInforms/" + $.trim(rowData.id);
        });

        domMain.on('click', '#view-btn', function(e) {
          // e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          if(row.data()['nodeIds']) {
            location.href = "index.html#/alertRules/special/" + $.trim(row.data().id) + "/view";
          } else {
            location.href = "index.html#/alertRules/global/" + $.trim(row.data().id) + "/view";
          }
        });

        domMain.on('click', '#copy-btn', function(e) {
          // e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          $scope.doAction('copy', row.data(), function(returnObj) {
            if(returnObj.code == 0) {
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
          });
        });

        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          var abledIndex = 0;
          var unabledIndex = 0;
          if(e.target.checked) {
            table.rows().select();
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = true;
              if(row.data().enabled) { //启用
                abledIndex++;
              } else { //停用
                unabledIndex++;
              }
            };
            if(abledIndex == tableRows.count()) {
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else if(unabledIndex == tableRows.count()) {
              $scope.abled = true;
            } else {
              $scope.unabled = true;
              $scope.abled = true;
              $scope.selectedCount = 0;
            }
            table.rows().invalidate().draw(false);
            $scope.$apply();

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
            $scope.abled = false;
            $scope.unabled = false;
            $scope.selectedCount = 0;
            $scope.$apply();

          }
        });

        domMain.on('change', '.itemCheckBox', function(e) {
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var abledIndex = 0;
          var unabledIndex = 0;
          var tableRows = table.rows({
            selected: true
          });
          if(e.target.checked) {
            row.data().selected = true;
            if(row.data().enabled) { //启用
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else {
              $scope.abled = true;
            }
          } else {
            row.data().selected = false;
            var rows = table.rows();
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              if(row.data().enabled) { //启用
                abledIndex++;
              } else { //停用
                unabledIndex++;
              }
            };
            if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
              $scope.abled = false;
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
              $scope.abled = true;
              $scope.unabled = false;
            }
          }
          if(tableRows.count() != table.rows()[0].length) {
            $('#allselect-btn').attr('checked', false)
            $('#allselect-btn').prop('checked', false);
          } else if(tableRows.count() == table.rows()[0].length) {
            $('#allselect-btn').attr('checked', true)
            $('#allselect-btn').prop('checked', true);
          }
          $scope.$apply();
        });

        domMain.on('change', '.enabledCheckBox', function(e) {
          var self = this;
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var param = [];
          if(e.target.checked) {
            row.data().enabled = true;
            param = [
              [row.data().id], true
            ];
          } else {
            row.data().enabled = false;
            param = [
              [row.data().id], false
            ];
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
              $(".itemCheckBox").each(function() {
                $(this).attr("checked", false);
              });
              $("#allselect-btn").attr("checked", false);
              table.rows().deselect();
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

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的告警规则项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false;
          // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0 && !rowData.enabled) {
              AlertIdsArr.push(rowData.id);
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
            $scope.doAction("deleteAlertRules", AlertIdsArr, function(returnObj) {
              if(returnObj.code == 0) {
                var failObjTotal = returnObj.data.failObj.length;
                var successObjTotal = returnObj.data.successObj.length;
                growl.success("成功删除" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  if(!row.data().enabled) {
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

        //多项启用
        $scope.selectedEnable = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的告警规则项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false; //这是之前前端判断失败成功个数的标志
          // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            // AlertIdsArr.push(rowData.id);
            if(!rowData.enabled) {
              AlertIdsArr.push(rowData.id);
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
            $scope.doAction("AlertEnable", [AlertIdsArr, true], function(returnObj) {
              if(returnObj.code == 0) {
                var failObjTotal = returnObj.data.failObj.length;
                var successObjTotal = returnObj.data.successObj.length;
                growl.success("成功启用" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  var rowData = row.data();
                  rowData.enabled = true;
                  rowData.selected = false;
                  row.cells().invalidate().draw(false);
                  // var checkedBoxcells = nodes[i].cells;
                  // var selectcheckBox = nodes[i].cells[checkedBoxcells.length - 2];
                  // // $(selectcheckBox.children).attr("checked", "checked");
                  // $(selectcheckBox.children).prop("checked", true);
                }
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

        //多项停用
        $scope.selectedUnable = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的告警规则项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false; //这是之前前端判断失败成功个数的标志
          // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            // AlertIdsArr.push(rowData.id);
            if(rowData.enabled) {
              AlertIdsArr.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
            }
          };
          if(ifGo) {
            $scope.doAction("AlertEnable", [AlertIdsArr, false], function(returnObj) {
              if(returnObj.code == 0) {
                var failObjTotal = returnObj.data.failObj.length;
                var successObjTotal = returnObj.data.successObj.length;
                growl.success("成功停用" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  var rowData = row.data();
                  rowData.enabled = false;
                  rowData.selected = false;
                  row.cells().invalidate().draw(false);
                  /*var checkedBoxcells = nodes[i].cells;
                  var selectcheckBox = nodes[i].cells[checkedBoxcells.length - 2];
                  $(selectcheckBox.children).removeAttr("checked");*/
                }

                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
                // $(".itemCheckBox").each(function() {
                //   $(this).attr("checked", false);
                // });
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

  //======================================    告警类别     ===========================================
  directives.initDirective('alertClassifyTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ALERTRULESINIT + "_classify", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          // isEditing = false;
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [4, "desc"]
            ],
            columns: [$.ProudSmart.datatable.selectCol, {
              data: "label",
              title: "类别名称"
            }, {
              data: "name",
              title: "告警码"
            }, {
              data: "description",
              title: "类别描述"
            }, {
              data: "risingTime",
              title: "",
              visible: false
            }, $.ProudSmart.datatable.optionCol3],
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
              targets: 1,
              data: "label",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 2,
              data: "name",
              render: function(data, type, full) {
                if(data) {
                  var Category = $scope.Category;
                  for(var i in $scope.Category) {
                    if(Category[i].index == data) {
                      return Category[i].label;
                    }
                  }
                }
                return escape(data);
              }
            }, {
              targets: 3,
              data: "description",
              render: function(data, type, full) {
                // 返回自定义内容    
                if(full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                else {
                  return escape(data);
                }
              }
            }, {
              "targets": 5,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                if(full.isEdit == 2) {
                  str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                  str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                  str += "</div>";
                } else {
                  if($scope.menuitems['D03_A02_S45']) {
                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if($scope.menuitems['D02_A02_S45']) {
                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
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
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
          if(tableRows.count() != table.rows()[0].length) {
            $('#allselect-btn').attr('checked', false)
            $('#allselect-btn').prop('checked', false);
          } else if(tableRows.count() == table.rows()[0].length) {
            $('#allselect-btn').attr('checked', true)
            $('#allselect-btn').prop('checked', true);
          }
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);

          $.extend($scope.alertClassifyInfo, row.data());
          ngDialog.open({
            template: '../partials/dialogue/alert_classification_dia.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          });

        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doAction('deleteAlertClassify', [row.data().id], function(returnObj) {
            if(returnObj == 0) {
              row.remove().draw(false);
            }
          });
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的告警类别项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              AlertIdsArr.push(rowData.id);
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
            $scope.doAction("deleteAlertClassify", AlertIdsArr, function(returnObj) {
              if(returnObj == 0) {
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

  //======================================    数据项     ===========================================
  directives.initDirective('kpiTypeTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_kpitype", function(event, args) {
                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }

                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [4, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
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
                        }, {
                            data: "range",
                            title: "取值范围"
                        }, {
                            data: "icon",
                            title: "图标"
                        }, $.ProudSmart.datatable.optionCol3],
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
                            targets: 1,
                            data: "name",
                            render: function(data, type, full) {
                                // 返回自定义内容
                                if(full.isEdit == 2 && type == "display")
                                    return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 2,
                            data: "label",
                            render: function(data, type, full) {
                                if(data) {
                                    var Category = $scope.Category;
                                    for(var i in $scope.Category) {
                                        if(Category[i].index == data) {
                                            return Category[i].label;
                                        }
                                    }
                                }
                                return escape(data);
                            }
                        }, {
                            targets: 3,
                            data: "unit",
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
                            data: "number",
                            render: function(data, type, full) {
                                // 返回自定义内容
                                if(full.isEdit == 2 && type == "display")
                                    return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                                else {
                                  if(data){
                                    return "是";
                                  }else {
                                    return "否";
                                  }
                                    // return escape(data);
                                }
                            }
                        }, {
                            targets: 5,
                            data: "type",
                            render: function(data, type, full) {
                                // 返回自定义内容
                                if(full.isEdit == 2 && type == "display")
                                    return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                                else {
                                    var str = '';
                                    if(data == 'kpi'){
                                        str = '测点';
                                    }else if(data == 'fault'){
                                        str = '故障';
                                    }
                                    return str;
                                }
                            }
                        },{
                            targets: 6,
                            data: "range",
                            render: function(data, type, full) {
                                // 返回自定义内容
                                if(full.isEdit == 2 && type == "display")
                                    return "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                                else {
                                    return escape(data);
                                }
                            }
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
                            },{
                            "targets": 8,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = "<div class='btn-group btn-group-sm'>";
                                if(full.isEdit == 2) {
                                    str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                                    str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                                    str += "</div>";
                                } else {
                                    if($scope.menuitems['D03_A02_S45']) {
                                        str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                                    }
                                    if($scope.menuitems['D02_A02_S45']) {
                                        str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
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
                    $scope.selectedCount = tableRows.count();
                    $scope.$apply();
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                });

                domMain.on('click', '#edit-btn', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);

                    $.extend($scope.kpiTypeInfo, row.data());
                    ngDialog.open({
                        template: '../partials/dialogue/kpi_type_dia.html',
                        className: 'ngdialog-theme-plain',
                        scope: $scope
                    });

                });

                domMain.on('click', '#del-btn', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    $scope.doAction('deleteAlertClassify', [row.data().id], function(returnObj) {
                        if(returnObj == 0) {
                            row.remove().draw(false);
                        }
                    });
                });

                //多项删除
                $scope.selectedDelete = function() {
                    var tableRows = table.rows({
                        selected: true
                    });
                    var selectedCount = tableRows.count();
                    var nodes = tableRows.nodes();
                    if(selectedCount == 0) {
                        growl.warning("当前没有选中的告警类别项", {});
                        return;
                    }
                    var successCount = 0;
                    var errorCount = 0;
                    var AlertIdsArr = [];
                    var ifGo = false;
                    for(var i = 0; i < nodes.length; i++) {
                        var row = table.row(nodes[i]);
                        var rowData = row.data();
                        if(rowData.id > 0) {
                            AlertIdsArr.push(rowData.id);
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
                        $scope.doAction("deleteAlertClassify", AlertIdsArr, function(returnObj) {
                            if(returnObj == 0) {
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


    //======================================    告警通知     ===========================================
  directives.initDirective('alertInformTable', ['$timeout', 'resourceUIService', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, resourceUIService, ngDialog, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ALERTRULESINIT + "_informs", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [5, "desc"]
            ],
            columns: [{
              data: "selected",
              title: "是否启用"
            }, {
              data: "ruleName",
              title: "通知名称"
            }, {
              data: "personType",
              title: "人员类型"
            }, {
              data: "noticeRole",
              title: "通知角色"
            }, {
              data: "templates",
              title: "通知方式"
            }, {
              data: "risingTime",
              title: "",
              visible: false
            }, $.ProudSmart.datatable.optionCol3],
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
              targets: 1,
              data: "ruleName",
              render: function(data, type, full) {
                return escape(data);
              }
            }, {
              targets: 2,
              data: "personType",
              render: function(data, type, full) {
                if(data) {
                  for(var i in $scope.notificationType) {
                    if($scope.notificationType[i].valueCode == data) {
                      return $scope.notificationType[i].label;
                    }
                  }
                } else {
                  return "-";
                }
              }
            }, {
              targets: 3,
              data: "noticeRole",
              render: function(data, type, full) {
                var str = '-';
                if(data) {
                  for(var i in $scope.allRoles) {
                    if($scope.allRoles[i].roleID == data) {
                      str = $scope.allRoles[i].roleName;
                      break;
                    }
                  }
                }
                return str;
              }
            }, {
              targets: 4,
              data: "templates",
              render: function(data, type, full) {
                // 返回自定义内容 
                var str = "",
                  notificationDic = {};
                $scope.notificationList.forEach(function(item) {
                  notificationDic[item.valueCode] = item;
                });
                if(full.templates) {
                  str = full.templates.map(function(item) {
                    return notificationDic[item.noticeWay] == undefined ? '': notificationDic[item.noticeWay].label;
                  }).join(' ,');
                }

                // if (full.isEdit == 2 && type == "display")
                //   str = "<input style='width:100%' class='form-control input-sm' autocomplete='off' type='text' value='" + escape(data) + "'>";
                // else {
                //   var notificationTypeDic = {};
                //   var notificationDic = {};
                //   $scope.notificationType.forEach(function(item) {
                //     notificationTypeDic[item.valueCode] = item;
                //   });
                //   $scope.notificationList.forEach(function(item) {
                //     notificationDic[item.valueCode] = item;
                //   });
                //   str = notificationDic[full.templates.noticeWay].label + "通知" + notificationTypeDic[full.personType].label;
                // }
                return str;
              }
            }, {
              "targets": 6,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                if(full.isEdit == 2) {
                  str += "<button id='save-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></button>";
                  str += "<button id='cancel-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></button>";
                  str += "</div>";
                } else {
                  str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  // str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  // str += "<ul class='dropdown-menu' role='menu'>";
                  // str += "<li><a role='button' id='devicelist-btn'>启用</a></li>";
                  // str += "<li><a role='button' id='devicelist-btn'>通知</a></li>";
                  // str += "</ul></div>";
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
            $scope.doAction("enabled",row.data())
          } else {
            row.data().selected = false;
            $scope.doAction("disabled",row.data())
          }
          var tableRows = table.rows({
            selected: true
          });
          $scope.selectedCount = tableRows.count();
          $scope.$apply();
          if(tableRows.count() != table.rows()[0].length) {
            $('#allselect-btn').attr('checked', false)
            $('#allselect-btn').prop('checked', false);
          } else if(tableRows.count() == table.rows()[0].length) {
            $('#allselect-btn').attr('checked', true)
            $('#allselect-btn').prop('checked', true);
          }
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          console.log(row.data().templates);

          var callbackFun = function(data) {
            $.extend($scope.alertInformsInfo, data);
            for(var i in data.templates) {
              if(typeof(data.templates[i]) == 'boolean') {
                delete data.templates[i];
              }
            }
            $scope.templates.forEach(function(list) { //设置不同人员类型的，为选中状态
              if(list.personType != data.personType) {
                list.state = true;
                list.contact = "";
              } else if(list.personType == data.personType) { //只判断相同人员类型的状态
                var userObj = data.templates;
                userObj.forEach(function(item) {
                  if(!userObj[list.noticeWay]) {
                    if(list.noticeWay == item.noticeWay && !userObj[list.noticeWay]) {
                      if(!userObj[item.noticeWay]) {
                        userObj[list.noticeWay] = true;
                        list.state = true;
                        list.contact = item.contact;
                      }
                    } else {
                      // if (!userObj[item.noticeWay]) {
                      userObj[list.noticeWay] = false;
                      list.state = false;
                      list.contact = "";
                      // }
                    }
                  }
                })
              }
            });
            ngDialog.open({
              template: '../partials/dialogue/alert_inform_dia.html',
              className: 'ngdialog-theme-plain',
              scope: $scope
            });
          };
          resourceUIService.findNoticeRuleById([row.data().id], function(returnObj) {
            if(returnObj.code == 0) {
              returnObj.data.ruleTempName = row.data().ruleTempName;
              callbackFun(returnObj.data);
            }
          })
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          //        $scope.doAction('deleteAlertForm', [row.data().id], function(returnObj) { 老版本删除的参数是ID
          $scope.doAction('deleteAlertForm', row.data(), function(returnObj) {
            if(returnObj == 0) {
              row.remove().draw(false);
            }
          });
        });

        //多项删除
        $scope.selectedDelete = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的告警通知项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false;
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            if(rowData.id > 0) {
              AlertIdsArr.push(rowData.id);
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
            $scope.doAction("deleteAlertForm", AlertIdsArr, function(returnObj) {
              if(returnObj == 0) {
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
});