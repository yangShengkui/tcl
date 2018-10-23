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
              order: [[ 4, "desc" ]],
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columns: [{
                data: "label",
                title: "告警名称",
                width:"200px"
              }, {
                data: "thresholds",
                title: "告警规则"
              }, {
                data: "enabled",
                title: "启用",
                width: "30px"
              }, {
                data: "option",
                orderable: false,
                title: "操作",
                width: "100px"
              }, {
                data: "id",
                title: "",
                visible: false
              }],
              columnDefs: [{
                targets: 0,
                data: "label",
                render: function(data, type, full) {
                  // 返回自定义内容	
                  if (!full.instance) {
                    if (full.isEdit == 2 && type == "display")
                      return "<input style='width:100%' maxlength='100' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                    else
                      return escape(data);
                  }
                  return "";
                }
              }, {
                targets: 1,
                data: "thresholds",
                orderable: false,
                render: function(data, type, full) {
                  // 返回自定义内容
                  var str = "";
                  var threshold;
                  if (typeof data != "undefined" && data != null && data.length != 0) {
                    threshold = data[0];
                  }
                  if (full.isEdit == 2 && type == "display") {
                    if (threshold) {
                      if (threshold.nodeIds && threshold.nodeIdsforSelect == null) {
                        threshold.nodeIdsforSelect = [];
                        var nodeIdAry = threshold.nodeIds.split(",")
                        nodeIdAry.forEach(function(nodeId) {
                          threshold.nodeIdsforSelect.push('number:'+nodeId);
                        });
                        threshold.nodeIdsforSelect = threshold.nodeIdsforSelect.toString();
                      }
                      // 指标类型
                      str = '<select name="kpiCode-name" class="combobox form-control input-sm">' +
                        '<option value="NaN" selected disabled>指标类型...</option>';
                      for (var i in modelData.kpis) {
                        if (threshold.kpiCode == modelData.kpis[i]["id"]) {
                          str += '<option value="' + modelData.kpis[i]["id"] + '" selected>' + modelData.kpis[i]["label"] + '</option>';
                        } else {
                          str += '<option value="' + modelData.kpis[i]["id"] + '">' + modelData.kpis[i]["label"] + '</option>';
                        }
                      }
                      str += '</select>&nbsp;';
                      //计算条件
                      str += '<select name="condition-name" class="combobox form-control input-sm">' +
                        '<option value="NaN" selected disabled>计算条件...</option>';
                      for (var i in condition) {
                        if (threshold.condition == condition[i]["value"]) {
                          str += '<option value="' + condition[i]["value"] + '" selected>' + condition[i]["name"] + '</option>';
                        } else {
                          str += '<option value="' + condition[i]["value"] + '">' + condition[i]["name"] + '</option>';
                        }
                      }
                      str += '</select>&nbsp;';
                      //参考值
                      str += "<input name='refValue-name' class='form-control input-sm' type='text' value='" + escape(threshold.refValue) + "'>&nbsp;";
                      str += "<input class='form-control input-sm' type='text' style='display:none' value='" + threshold.id + "'/>";
                      //告警级别
                      str += '<select name="severity-name" class="combobox form-control input-sm">' +
                        '<option value="NaN" selected disabled>告警级别...</option>';
                      for (var i in severity) {
                        if (threshold.severity == severity[i]["value"]) {
                          str += '<option value="' + severity[i]["value"] + '" selected>' + severity[i]["name"] + '</option>';
                        } else {
                          str += '<option value="' + severity[i]["value"] + '">' + severity[i]["name"] + '</option>';
                        }
                      }
                      str += '</select>&nbsp;';
                      if ($scope.selectedDitem && $scope.selectedDitem.resources && $scope.selectedDitem.resources.length > 0)
                        str += "<select buttonclass='btn btn-default btn-sm' multiple='multiple' numberdisplayed='0' bootstrap-multiselect nonselectedtext='所有设备...' optionclass='disabled' ng-model='threshold.nodeIds"+new Date().getTime()+"' selectvalues='"+threshold.nodeIdsforSelect+"' ng-options='item.id as item.label for item in selectedDitem.resources'></select>";
                      else
                        str +="<select disabled='true' class='combobox form-control input-sm'><option value=''>无设备...</option></select>"
                    } else {
                      // 指标类型
                      str = '<select name="kpiCode-name" class="combobox form-control input-sm">' +
                        '<option value="NaN" selected disabled>指标类型...</option>';
                      for (var i in modelData.kpis) {
                        str += '<option value="' + modelData.kpis[i]["id"] + '">' + modelData.kpis[i]["label"] + '</option>';
                      }
                      str += '</select>&nbsp;';
                      //计算条件
                      str += '<select name="condition-name" class="combobox form-control input-sm">' +
                        '<option value="NaN" selected disabled>计算条件...</option>';
                      for (var i in condition) {
                        str += '<option value="' + condition[i]["value"] + '">' + condition[i]["name"] + '</option>';
                      }
                      str += '</select>&nbsp;';
                      //参考值
                      str += "<input name='refValue-name' class='form-control input-sm' type='text' value='' placeholder='参考值'>&nbsp;";
                      str += "<input class='form-control input-sm' type='text' style='display:none' value=''/>";
                      //告警级别
                      str += '<select name="severity-name" class="combobox form-control input-sm">' +
                        '<option value="NaN" selected disabled>告警级别...</option>';
                      for (var i in severity) {
                        str += '<option value="' + severity[i]["value"] + '">' + severity[i]["name"] + '</option>';
                      }
                      str += '</select>&nbsp;';
                      if ($scope.selectedDitem && $scope.selectedDitem.resources && $scope.selectedDitem.resources.length > 0)
                        str += "<select ng-disabled='!selectedDitem.resources || selectedDitem.resources.length == 0' buttonclass='btn btn-default btn-sm' multiple='multiple' numberdisplayed='0' bootstrap-multiselect nonselectedtext='所有设备...' optionclass='disabled' ng-model='threshold.nodeIds' selectvalues='' ng-options='item.id as item.label for item in selectedDitem.resources'></select>";
                      else
                        str +="<select disabled='true' class='combobox form-control input-sm'><option value=''>无设备...</option></select>"
                    }
                    return str;
                  } else if (threshold) {
                    if (threshold.nodeIds) {
                      var nodeName = [];
                      var nodeIdAry = threshold.nodeIds.split(",")
                      nodeIdAry.forEach(function(nodeId) {
                        for (var i in modelData.resources) {
                          if (nodeId == modelData.resources[i].id) {
                            nodeName.push(modelData.resources[i].label);
                            break;
                          }
                        }
                      });
                      nodeName = nodeName.toString();
                      if (nodeName) {
                        str = nodeName+"的";
                      }
                    }
                    for (var i in modelData.kpis) {
                      if (threshold.kpiCode == modelData.kpis[i]["id"]) {
                        str += modelData.kpis[i]["label"];
                        break;
                      }
                    }

                    for (var i in condition) {
                      if (threshold.condition == condition[i]["value"]) {
                        if (condition[i]["name"] == "表达式") {
                          str += "满足条件：";
                        } else {
                          str += condition[i]["name"];
                        }
                        break;
                      }
                    }

                    str += threshold.refValue + "时，进行";

                    for (var i in severity) {
                      if (threshold.severity == severity[i]["value"]) {
                        str += severity[i]["name"];
                        break;
                      }
                    }
                    
                    if (typeof(threshold.enabled) != "undefined") {
                      full["enabled"] = threshold.enabled;
                    }
                    str += "。<span class='text-right'><a id='instance-btn' href=''>点击添加阈值</a><span>"
                    return str;
                  } else {
                    //full["enabled"] = false;
                    return [];
                  }
                }
              }, {
                targets: 2,
                data: "enabled",
                orderable: false,
                render: function(data, type, full) {
                  var str = "<div class='text-center'>";
//                if (full.isEdit == 2 && full.isNew) data = true;
                  if (!data) {
                    str += "<a id='unable-btn' class='btn btn-social-icon btn-sm'><i class='fa fa-square-o'></i></a>";
//                  str += "<input type='checkbox' style='display:none'/>";
                  } else {
                    str += "<a id='enable-btn' class='btn btn-social-icon btn-sm'><i class='fa fa-check-square-o'></i></a>";
//                  str += "<input type='checkbox' checked='checked' style='display:none'/>";
                  }
                  str+="</div>";
                  return str;
                }
              }, {
                targets: 3,
                data: "option",
                render: function(data, type, full) {
                  // 返回自定义内容		
                  var str = "<div class='btn-group btn-group-sm'>";
                  if (full.canEdit) {
                    if (full.isEdit == 2) {
                      str += "<a id='save-btn' class='btn btn-default' ><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>"
                      if (full.isNew)
                        str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                      else
                        str += "<a id='cancel-btn' class='btn btn-default' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                    } else {
                      str += "<a id='edit-btn' class='btn btn-default' ><i class='fa fa-edit  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>"
                      str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                    }
//                } else {
//                  str += "<a id='del-btn' class='btn btn-default' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
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
            parentDom.html('<a ng-click="addModelSubItem()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加告警</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', '#instance-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var oldrows = table.rows()[0].length;
            $scope.doAction('alert-instance',row.data());
            if (table) {
              var pageInfo = table.page.info();
              var rows = table.rows();
              var newPage = 0;
              for (var i = 0;;i++) {
                if (rows[0][i] == oldrows) {
                  newPage = Math.floor(i/pageInfo.length);
                  break;
                }
              }
              if (newPage> 0) {
                table.page( newPage ).draw( 'page' );
              }
            }
          });

          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            if ($('#save-btn').attr('disabled')) return;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.data().isEdit == 2) {
              var tds = $(this).parents("tr").children();
              var checkPass = true;
              $.each(tds, function(i, val) {
                var jqob = $(val);
                if (i == 0 && !row.data().instance) {
                  var txt = jqob.children("input").val();
                  if (!txt || txt == "") {
                    $(val).addClass('danger');
                    checkPass = false;
                    row.data().isEdit = 2;
                    //row.cells().invalidate();
                    return false;
                  } else {
                    $(val).removeClass('danger');
                  }
                }
                if (i == 1) {
                  for (var j = 0; j < jqob.children("input, select").length; j++) {
                    if (j != 3 && j != 5) {
                      var txt = $(jqob.children("input,select")[j]).val();
                      if ((j != 1 && (!txt || txt == "NaN")) || (j == 1 && txt == "NaN")) {
                        $(jqob.children("input,select")[j]).css("background-color", "#f2dede");
                        checkPass = false;
                        row.data().isEdit = 2;
                        return false;
                      } else {
                        $(jqob.children("input,select")[j]).css("background-color", "#fffff");
                      }
                    }
                  }
                }
              });

              if (checkPass) {
                var thresholds = [];
                var obj = {};
                $.each(tds, function(i, val) {
                  var jqob = $(val);
                  if (i == 0) {
                    var txt = jqob.children("input").val();
                    row.data().name = txt;
                    row.data().label = txt;
                  }
                  if (i == 1) {
                    obj["kpiCode"] = $(jqob.children("input, select")[0]).val();
                    obj["condition"] = $(jqob.children("input, select")[1]).val();
                    obj["refValue"] = $(jqob.children("input, select")[2]).val();
                    obj["id"] = $(jqob.children("input, select")[3]).val();
                    obj["severity"] = $(jqob.children("input, select")[4]).val();
                    obj["nodeIds"] = [];
                    var nodeIds = $(jqob.children("input, select")[5]).val();
                    if (nodeIds && nodeIds.length > 0) {
                      nodeIds.forEach(function(item){
                        var ary = item.split(":");
                        obj["nodeIds"].push(ary[ary.length-1]);
                      });
                    }
                    obj["nodeIds"] = obj["nodeIds"].toString();
                  }
                  if (i == 2) {
                    if (jqob.find("#enable-btn").length == 0) {
                      obj["enabled"] = false;
                    } else {
                      obj["enabled"] = true;
                    }
                  }
                });
                thresholds.push(obj);
                row.data()["thresholds"] = thresholds;
//              $('#save-btn').attr("disabled", true);
//              if ($scope.hasOwnProperty("doSaveAction")) {
//                $('#save-btn').attr("disabled", true);
//                $scope.doSaveAction('alert-save', row.data(), function(returnObj) {
//                  if (returnObj == false) {
//                    row.data().isEdit = 2;
//                  } else {
//                    row.data().id = returnObj.id;
//                    row.data().isEdit = 0;
//                    row.data().isNew = false;
//                    row.cells().invalidate();
//                    isEditing = false;
//                  }
//                });
//              } else {
                  $scope.doAction("alert-save", row.data(), function(returnObj) {
                    if (returnObj == false) {
                      row.data().isEdit = 2;
                    } else {
                      row.data().id = returnObj.id;
                      row.data().isEdit = 0;
                      row.data().isNew = false;
                      row.cells().invalidate().draw(false);
                      isEditing = false;
                    }
                  });
//              }
              }
            }
          });

          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            //if (!isEditing) {
            isEditing = true;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 2;
            row.cells().invalidate().draw(false);
            //} else {
            //	$scope.doAction("thresholdMessage", "当前有修改中的指标，请先完成该操作");
            //}
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.preventDefault();
            var tds = $(this).parents("tr").children();
            //if (isEditing) {
            //	isEditing = false;
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            row.cells().invalidate().draw(false);
            $.each(tds, function(i, val) {
              $(val).removeClass('danger');
            });
            if (row.data().thresholds[0].id == 0) {
              $scope.doAction("alert-cancel", row.data(), function(flg) {
                if (flg)
                  row.remove().draw(false);
              });
            }
            //}
          });
          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isDel = true;
//          if ($scope.hasOwnProperty("doDeleteAction")) {
//            $scope.doDeleteAction("alert-delete", row.data(), function(flg) {
//              if (flg)
//                row.remove().draw(false);
//            });
//          } else {
              $scope.doAction("alert-delete", row.data(), function(flg) {
                if (flg)
                  row.remove().draw(false);
              });
//          }
          });

          domMain.on('change', "[name=condition-name]", function(e) {
            e.stopPropagation();
            if ($(e.target).val() != null && $(e.target).val() != "") {
              var reg = /^[-]?([0]\.[0-9]+|[1-9]+[0-9]*\.?[0-9]+)?$/;
              if (!reg.test($($(e.target).siblings()[1]).val())) {
                $($(e.target).siblings()[1]).css("background-color", "#f2dede");
                $($(e.target).siblings()[1]).val("");
                $($(e.target).siblings()[1]).attr("placeholder", "请输入正确数字");
              }
            } else {
              $($(e.target).siblings()[1]).css("background-color", "white");
              $($(e.target).siblings()[1]).attr("placeholder", "参考值");
            }
          });

//        domMain.on('change', "[name=refValue-name]", function(e) {
//          e.stopPropagation();
//          if ($(e.target).val() != "") {
//            if (null != $($(e.target).siblings()[1]).val() && "" != $($(e.target).siblings()[1]).val()) {
//              var reg = /^[-]?([0]\.[0-9]+|[1-9]+[0-9]*\.?[0-9]+)?$/;
//              if (!reg.test($(e.target).val())) {
//                $(e.target).css("background-color", "#f2dede");
//                $(e.target).val("");
//                $(e.target).attr("placeholder", "请输入正确数字");
//              } else {
//                $(e.target).css("background-color", "white");
//              }
//            } else {
//              $(e.target).css("background-color", "white");
//            }
//          }
//        });

          domMain.on('click', '#unable-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (typeof row.data().thresholds != "undefined" && row.data().thresholds != null && row.data().thresholds.length != 0) {
              var td = $(this).closest('td');
              var str = "<div class='text-center'><a id='enable-btn' class='btn btn-social-icon btn-sm' data-toggle='tooltip' ><i class='fa fa-check-square-o'></i></a></div>";
//            str += "<input type='checkbox' checked='checked' style='display:none'/>";

              if (row.data().isEdit == 2) {
                td.html(str);
              } else {
                row.data()["enabled"] = true;
                row.data().thresholds[0]["enabled"] = true;
                (function(td, str) {
                  $scope.doAction("alert-enable", row.data(), function(returnObj) {
                    if (returnObj) {
                      td.html(str);
                    }
                  });
                })(td, str);
              }
            }
          });

          domMain.on('click', '#enable-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (typeof row.data().thresholds != "undefined" && row.data().thresholds != null && row.data().thresholds.length != 0) {
              var td = $(this).closest('td');
              var str = "<div class='text-center'><a id='unable-btn' class='btn btn-social-icon btn-sm'><i class='fa fa-square-o'></i></a></div>";
//            str += "<input type='checkbox' style='display:none'/>";

              if (row.data().isEdit == 2) {
                td.html(str);
              } else {
                row.data()["enabled"] = false;
                row.data().thresholds[0]["enabled"] = false;
                (function(td, str) {
                  $scope.doAction("alert-enable", row.data(), function(returnObj) {
                    if (returnObj) {
                      td.html(str);
                    }
                  });
                })(td, str);
              }
            }
          });
        }
      ]
    };
  }]);
});