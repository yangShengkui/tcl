define(['directives/directives'], function(directives) {
  'use strict';
  directives.initDirective('aeditTable', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          var isFromEdit = false;
          var hasThresholdOpen = false;
          var modelData;
          var thresholdTable;
          var alertId = "";
          var itemAttrs;
          $scope.$on(Event.ALERTEDITINIT, function(event, args) {
            if (table) {
              table.destroy();
            }
            hasThresholdOpen = false;
            modelData = args.data;
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: $.ProudSmart.datatable.language,
              data: modelData.alerts,
              columns: [{
                data: "name",
                title: "告警名称"
              }, {
                data: "label",
                title: "显示名称"
              }, {
                data: "description",
                title: "描述"
              }, {
                data: "option",
                orderable: false,
                title: "操作"
              }],
              columnDefs: [{
                  targets: 0,
                  data: "name",
                  render: function(data, type, full) {
                    // 返回自定义内容		
                    if (full.isEdit == 2 && type == "display")
                      return "<input style='width:100%' class='form-control' type='text' value='" + data + "'>";
                    else
                      return data;
                  }
                }, {
                  targets: 1,
                  data: "name",
                  render: function(data, type, full) {
                    // 返回自定义内容		
                    if (full.isEdit == 2 && type == "display")
                      return "<input style='width:100%'  class='form-control' type='text' value='" + data + "'>";
                    else
                      return data;
                  }
                }, {
                  targets: 2,
                  data: "name",
                  render: function(data, type, full) {
                    // 返回自定义内容		
                    if (full.isEdit == 2 && type == "display")
                      return "<input style='width:100%'   class='form-control' type='text' value='" + data + "'>";
                    else
                      return data;
                  }
                }, {
                  targets: 3,
                  data: "option",
                  render: function(data, type, full) {
                    // 返回自定义内容		
                    var str = "<div class='input-group'>";
                    if (full.canEdit) {
                      if (full.isEdit == 2) {
                        str += "<a id='save-btn' class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                        if (full.isNew)
                          str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                        else
                          str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                      } else {
                        str += "<a id='edit-btn' class='btn btn-default btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>"
                        str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                      }
                    } else {
                      str += "<a id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                    }
                    if (!full.isNew) {
                      str += "<a id='threshold-btn' class='btn btn-default btn-sm'><i class='fa fa-gear hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 阈值</span></a>"
                    }
                    str += "</div>"
                    return str;
                  }
                }
              ]
            });
          });

          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            if ($scope.selectedDitem && $scope.selectedDitem.canEdit) {
              var parentDom = $(".special-btn").parent();
              parentDom.html('<a ng-click="addModelSubItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加告警</span></a>');
              $compile(parentDom)($scope);
            }
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
                  var txt = jqob.children("input").val();
                  if (!txt) {
                    $(val).addClass('danger');
                    checkPass = false;
                    row.data().isEdit = 2;
                    row.cells().invalidate();
                    return false
                  } else {
                    $(val).removeClass('danger');
                  }
                }
                if (i == 3) {
                  row.cell(jqob).invalidate();
                  return true;
                }
                var txt = jqob.children("input").val();
                jqob.html(txt);
                table.cell(jqob).data(txt); //修改DataTables对象的数据

              });
              if (checkPass) {
                $scope.doAction("alert-save", row.data(), function(returnObj) {
                  if (returnObj == false) {
                    row.data().isEdit = 2;
                  } else {
                    row.data().id = returnObj.id;
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
            if (table.row(tr).data().isEdit == 3) {
              $scope.doAction("thresholdMessage", "当前有正在设置的阈值！");
              isFromEdit = true;
              return;
            }
            if (!isEditing) {
              isEditing = true;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 2;
              row.cells().invalidate();
            } else {
              $scope.doAction("thresholdMessage", "当前有修改中的指标，请先完成该操作");
            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            if (isEditing) {
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              row.data().isEdit = 0;
              row.cells().invalidate();
            }
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            if (table.row(tr).data().isEdit == 3) {
              $scope.doAction("thresholdMessage", "请先关闭阈值设置！");
              isFromEdit = true;
              return;
            }
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
            $scope.doAction("kpi-delete", rowData, function(flg) {
              if (flg)
                row.remove().draw(false);
            });
          });
          domMain.on('click', '#threshold-btn', function(e) {
            e.preventDefault();
            if ((typeof table.row(tr).data().isEdit != "undefined") && table.row(tr).data().isEdit == 2) {
              $scope.doAction("thresholdMessage", "请先完成告警编辑！");
              return;
            }
            if (!isEditing) {
              isEditing = false;
              isFromEdit = false;
              var tr = $(this).closest('tr');

              var row = table.row(tr);
              row.data().isEdit = 3;
            }
          });

          function format(d) {
            if (d != undefined) {
              var returnStr;
              if (d.hasOwnProperty("isEdit") && d.isEdit > 0) {
                returnStr = '<table id="threshold-table" width="780px"></table>' + '<div style="width:100%;text-align:left">' + '<button id="addThreshold" type="button" class="btn btn-default">&nbsp;&nbsp;添加&nbsp;&nbsp;</button>&nbsp;&nbsp;&nbsp;&nbsp;' + '<button id="saveThreshold" type="button" class="btn btn-primary">&nbsp;&nbsp;保存&nbsp;&nbsp;</button></div>';
              } else {

              }

              return returnStr;
            }
          }

          domMain.on('click', '#threshold-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();

            if (rowData) {
              if (rowData.isEdit == 3 && !isFromEdit) {
                if (row.child.isShown()) {
                  row.child.hide();
                  tr.removeClass('shown');
                  rowData.isEdit = 0;
                  hasThresholdOpen = false;
                } else if (!hasThresholdOpen) {
                  var severity = [{
                    'name': '警告告警',
                    'value': '1'
                  }, {
                    'name': '次要告警',
                    'value': '2'
                  }, {
                    'name': '重要告警',
                    'value': '3'
                  }, {
                    'name': '严重告警',
                    'value': '4'
                  }];
                  var condition = [{
                    'name': '大于',
                    'value': 'value>refValue'
                  }, {
                    'name': '大于等于',
                    'value': 'value>=refValue'
                  }, {
                    'name': '等于',
                    'value': 'value==refValue'
                  }, {
                    'name': '小于',
                    'value': 'value<refValue'
                  }, {
                    'name': '小于等于',
                    'value': 'value<=refValue'
                  }, {
                    'name': '表达式',
                    'value': ''
                  }];
                  alertId = rowData.id;
                  var thresholdData = [];
                  for (var i = 0; i < modelData.thresholds.length; i++) {
                    if (modelData.thresholds[i].alertCode == alertId) {
                      thresholdData = modelData.thresholds[i].thresholdsData;
                      break;
                    }
                  }
                  row.child(format(rowData)).show();
                  tr.addClass('shown');
                  thresholdTable = $("#threshold-table").DataTable({
                    "language": {
                      "lengthMenu": "显示 _MENU_ 项结果",
                      "zeroRecords": "没有匹配结果",
                      "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                      "infoEmpty": "显示第 0 至 0 项结果，共 0 项",
                      "infoFiltered": "(由 _MAX_ 项结果过滤)",
                      "loadingRecords": "载入中...",
                      "processing": "处理中...",
                      "search": "搜索:",
                      "paginate": {
                        "first": "首页",
                        "last": "末页",
                        "next": "下页",
                        "previous": "上页"
                      }
                    },
                    paging: false,
                    info: false,
                    ordering: false,
                    footer: false,
                    searching: false,
                    data: thresholdData,
                    //data: [{"kpiCode":"0","condition":">","refValue":0,"severity":"1","enable":0,"id":0}],
                    "fnDrawCallback": function(oSettings) {
                      $(oSettings.nTHead).hide();
                    },
                    columns: [{
                      data: "kpiCode",
                      title: "指标类型"
                    }, {
                      data: "condition",
                      title: "阈值条件"
                    }, {
                      data: "refValue",
                      title: "阈值"
                    }, {
                      data: "severity",
                      title: "告警级别"
                    }, {
                      data: "enable",
                      title: "启用"
                    }, {
                      data: "id",
                      title: "删除"
                    }],
                    "columnDefs": [{
                      "targets": 0,
                      "data": "kpiCode",
                      "render": function(data, type, full, meta) {
                        var str = "";
                        if (typeof data != "undefined") {
                          str = '<select id="kpiCode" name="kpiCode-name" class="combobox form-control">' +
                            '<option value="" selected disabled>KPI类型...</option>';
                          for (var i in modelData.kpis) {
                            if (data == modelData.kpis[i]["id"]) {
                              str += '<option value="' + modelData.kpis[i]["id"] + '" selected>' + modelData.kpis[i]["label"] + '</option>';
                            } else {
                              str += '<option value="' + modelData.kpis[i]["id"] + '">' + modelData.kpis[i]["label"] + '</option>';
                            }
                          }
                        } else {
                          str = '<select id="kpiCode" name="kpiCode-name" class="combobox form-control">' +
                            '<option value="" selected disabled>指标类型...</option>';
                          for (var i in modelData.kpis) {
                            str += '<option value="' + modelData.kpis[i]["id"] + '">' + modelData.kpis[i]["label"] + '</option>';
                          }
                        }
                        str += '</select>&nbsp;&nbsp;&nbsp;&nbsp;';
                        return str;
                      }
                    }, {
                      "targets": 1,
                      "data": "condition",
                      "render": function(data, type, full) {
                        var str = "";
                        if (typeof data != "undefined") {
                          str = '<select id="condition" name="condition-name" class="combobox form-control">' +
                            '<option value="" selected disabled>计算条件...</option>';
                          for (var i in condition) {
                            if (data == condition[i]["value"]) {
                              str += '<option value="' + condition[i]["value"] + '" selected>' + condition[i]["name"] + '</option>';
                            } else {
                              str += '<option value="' + condition[i]["value"] + '">' + condition[i]["name"] + '</option>';
                            }
                          }
                          str += '</select>&nbsp;&nbsp;&nbsp;&nbsp;';
                        } else {
                          str = '<select id="condition" name="condition-name" class="combobox form-control">' +
                            '<option value="" selected disabled>计算条件...</option>';
                          for (var i in condition) {
                            str += '<option value="' + condition[i]["value"] + '">' + condition[i]["name"] + '</option>';
                          }
                          str += '</select>&nbsp;&nbsp;&nbsp;&nbsp;';
                        }
                        return str;
                      }
                    }, {
                      "targets": 2,
                      "data": "refValue",
                      "render": function(data, type, full) {
                        var src = "";
                        /*阈值表达式需要输入大于号或小于号,此处不做HTML验证*/
                        if (typeof data == "undefined") {
                          src = "<input id ='refValue' name='refValue-name' class='form-control' type='text' value='' placeholder='参考值'>&nbsp;&nbsp;&nbsp;&nbsp;";
                        } else {
                          src = "<input id ='refValue' name='refValue-name' onkeyup='validatorNUM(this)' class='form-control' type='text' value='" + data + "'>&nbsp;&nbsp;&nbsp;&nbsp;";
                          //src = '<input ng-pattern="/^[0-9]{0,10}$/" class="form-control" type="text" id="refValue" name="refValue-name" value="'+ data +'" />&nbsp;&nbsp;&nbsp;&nbsp;'+
                          //	'<span style="color:red" ng-show="alerts-form.refValue-name.$dirty && alerts-form.refValue-name.$invalid">'+
                          //	'<span ng-show="alerts-form.refValue-name.$dirty && alerts-form.refValue-name.$invalid">仅限数字</span></span>';
                        }

                        return src;
                      }
                    }, {
                      "targets": 3,
                      "data": "severity",
                      "render": function(data, type, full) {
                        var str = "";
                        if (typeof data == "undefined") {
                          str = '<select id="severity" name="severity-name" class="combobox form-control">' +
                            '<option value="" selected disabled>告警级别...</option>';
                          for (var i in severity) {
                            str += '<option value="' + severity[i]["value"] + '">' + severity[i]["name"] + '</option>';
                          }
                          str += '</select>&nbsp;&nbsp;&nbsp;&nbsp;';
                        } else {
                          str = '<select id="severity" name="severity-name" class="combobox form-control">' +
                            '<option value="" selected disabled>告警级别...</option>';
                          for (var i in severity) {
                            if (data == severity[i]["value"]) {
                              str += '<option value="' + severity[i]["value"] + '" selected>' + severity[i]["name"] + '</option>';
                            } else {
                              str += '<option value="' + severity[i]["value"] + '">' + severity[i]["name"] + '</option>';
                            }
                          }
                          str += '</select>&nbsp;&nbsp;&nbsp;&nbsp;';
                        }

                        return str;
                      }
                    }, {
                      "targets": 4,
                      "data": "enable",
                      "render": function(data, type, full) {
                        if (typeof data == "undefined") {
                          data = 1;
                        }
                        var str = "<label>启用:&nbsp;&nbsp;</label>";
                        if (data == 0) {
                          str += "<a id='unable-btn' class='btn btn-social-icon' data-toggle='tooltip' ><i class='fa fa-square-o'></i></a>";
                          str += "<input type='checkbox' id='tEnable' style='display:none'/>";
                        } else {
                          str += "<a id='enable-btn' class='btn btn-social-icon' data-toggle='tooltip' ><i class='fa fa-check-square-o'></i></a>";
                          str += "<input type='checkbox' id='tEnable' checked='checked' style='display:none'/>";
                        }

                        return str;
                      }
                    }, {
                      "targets": 5,
                      "data": "id",
                      "render": function(data, type, full) {
                        var str = "<a id='delete-btn' class='btn btn-social-icon' data-toggle='tooltip' ><i class='fa fa-trash-o'></i></a>";
                        if (typeof data != "undefined") {
                          str += "<input  id='tid' type='text' style='display:none' value='" + data + "'/>";
                        } else {
                          str += "<input  id='tid' type='text' style='display:none' value=''/>";
                        }
                        return str;
                      }
                    }]
                  });
                  if (modelData.thresholds.length == 0) {
                    thresholdTable.row.add([]).draw(false);
                  }
                  rowData.isEdit = 3;
                  hasThresholdOpen = true;
                }
              }
            }
          });
          domMain.on('click', '#addThreshold', function(e) {
            e.stopPropagation();
            thresholdTable.row.add([]).draw(false);
          });

          domMain.on('click', '#saveThreshold', function(e) {
            e.stopPropagation();
            var checkPass = true;
            for (var i = 0; i < thresholdTable.$("input, select").length; i++) {
              if ($(thresholdTable.$("input, select")[i]).val() == null || $(thresholdTable.$("input, select")[i]).val() == "") {
                if (thresholdTable.$("input, select")[i].id == "tid") {
                  break;
                }
                if (thresholdTable.$("input, select")[i].id == "condition" && $(thresholdTable.$("input, select")[i]).val() == "") {
                  break;
                }
                $(thresholdTable.$("input, select")[i]).css("background-color", "#f2dede");
                $scope.doAction("thresholdMessage", "当前有未填写阈值");
                checkPass = false;
                break;
              }
            }
            if (checkPass) {
              var thresholds = [];
              thresholds[0] = modelData.id;
              thresholds[1] = alertId;
              thresholds[2] = [];
              var obj = {};
              for (var i = 0; i <= thresholdTable.$("input, select").length; i++) {
                if (thresholdTable.$("input, select").length == 0) {
                  break;
                }
                if (i != 0 && i % 6 == 0) {
                  thresholds[2].push(obj);
                  obj = {};
                  if (i == thresholdTable.$("input, select").length) break;
                }
                if (thresholdTable.$("input, select")[i].id == "kpiCode") {
                  obj.kpiCode = $(thresholdTable.$("input, select")[i]).val();
                }
                if (thresholdTable.$("input, select")[i].id == "condition") {
                  obj.condition = $(thresholdTable.$("input, select")[i]).val();
                }
                if (thresholdTable.$("input, select")[i].id == "refValue") {
                  obj.refValue = $(thresholdTable.$("input, select")[i]).val();
                }
                if (thresholdTable.$("input, select")[i].id == "severity") {
                  obj.severity = $(thresholdTable.$("input, select")[i]).val();
                }
                if (thresholdTable.$("input, select")[i].id == "tEnable") {
                  if (typeof $(thresholdTable.$("input, select")[4]).attr("checked") == "undefined") {
                    obj.enable = 0;
                  } else {
                    obj.enable = 1;
                  }
                }
                if (thresholdTable.$("input, select")[i].id == "tid") {
                  if ($(thresholdTable.$("input, select")[i]).val() == "") {
                    obj.id = 0;
                  } else {
                    obj.id = $(thresholdTable.$("input, select")[i]).val();
                  }
                }

              }
              $scope.saveThresholds(modelData, alertId, thresholds);
            }
          });

          domMain.on('change', "#threshold-table select", function(e) {
            e.stopPropagation();
            if ($(e.target).val() != null) {
              $(e.target).css("background-color", "white");
            }
          });

          domMain.on('change', "#condition", function(e) {
            e.stopPropagation();
            if ($(e.target).val() != null && $(e.target).val() != "") {
              var reg = /^\d*$/;
              if (!reg.test($($(e.target).parent().siblings()[1]).children().val())) {
                $($(e.target).parent().siblings()[1]).children().css("background-color", "#f2dede");
                $($(e.target).parent().siblings()[1]).children().val("");
                $($(e.target).parent().siblings()[1]).children().attr("placeholder", "请输入正确数字");
              }
            } else {
              $($(e.target).parent().siblings()[1]).children().css("background-color", "white");
              $($(e.target).parent().siblings()[1]).children().attr("placeholder", "参考值");
            }
          });

          domMain.on('change', "#threshold-table input", function(e) {
            e.stopPropagation();
            if ($(e.target).val() != "") {
              $(e.target).css("background-color", "white");
            }

          });
          domMain.on('change', "#refValue", function(e) {
            e.stopPropagation();
            if ($(e.target).val() != "") {
              if (null != $($(e.target).parent().siblings()[1]).children().val() && "" != $($(e.target).parent().siblings()[1]).children().val()) {
                var reg = /^\d*$/;
                if (!reg.test($(e.target).val())) {
                  $(e.target).css("background-color", "#f2dede");
                  $(e.target).val("");
                  $(e.target).attr("placeholder", "请输入正确数字");
                } else {
                  $(e.target).css("background-color", "white");
                }
              } else {
                $(e.target).css("background-color", "white");
              }
            }
          });

          domMain.on('click', '#unable-btn', function(e) {
            e.stopPropagation();
            var td = $(this).closest('td');
            var str = "<label>启用:&nbsp;&nbsp;</label>";
            str += "<a id='enable-btn' class='btn btn-social-icon' data-toggle='tooltip' ><i class='fa fa-check-square-o'></i></a>";
            str += "<input type='checkbox' id='tEnable' checked='checked' style='display:none'/>";
            td.html(str);
          });

          domMain.on('click', '#enable-btn', function(e) {
            e.stopPropagation();
            var td = $(this).closest('td');
            var str = "<label>启用:&nbsp;&nbsp;</label>";
            str += "<a id='unable-btn' class='btn btn-social-icon' data-toggle='tooltip' ><i class='fa fa-square-o'></i></a>";
            str += "<input type='checkbox' id='tEnable' style='display:none'/>";
            td.html(str);
          });

          domMain.on('click', '#delete-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = thresholdTable.row(tr);
            row.remove().draw(false);
          });
        }
      ]
    };
  }]);
});