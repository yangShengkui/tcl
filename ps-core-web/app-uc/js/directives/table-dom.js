define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function(directives, BootstrapDialog, datatables) {
    'use strict';
  directives.directive('approveTable', function($timeout, $compile, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;

          $scope.$on(Event.APPROVEINIT, function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }

            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              rowCallback: function(nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              "aaSorting": [
                [0, "desc"]
              ],
              columnDefs: args.columnDefs
            });
          });
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });
          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a ng-click="addProve()" class="pull-right btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新增</span></a>');
            $compile(parentDom)($scope);
          });
          domMain.on('click', '#save-btn', function(e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var checkPass = true;
            var protocol = $("#protocols").find("option:selected").val();
            var version = $("#version").find("option:selected").val();
            if(protocol != '请选择...' && protocol != '') {
              row.data()["protocol"] = protocol;
              $("#protocols").parent("td").removeClass('danger');
            } else {
              $("#protocols").parent("td").addClass('danger');
              checkPass = false
              return false;
            }
            if(version != '请选择...' && version != '') {
              row.data()["protocolVersion"] = version;
              $("#version").parent("td").removeClass('danger');
            } else {
              $("#version").parent("td").addClass('danger');
              return false;
            }
            $.each(tr.children(), function(j, val1) {
              var jqob1 = $(val1);

              //把input变为字符串
              if(!jqob1.has('button').length && jqob1.has('input').length) {
                var txt = $.trim(jqob1.children("input").val());

                if(txt) {

                  //if (j == 2) {
                  //
                  //    var reg = /^[\u4e00-\u9fa5a-zA-Z][u4e00-\u9fa5a-za-zA-Z0-9_]{1,30}$/;
                  //    if (!reg.test(txt)) {
                  //        $(val1).addClass('danger');
                  //        checkPass = false
                  //        return false;
                  //    }
                  //}
                  //if (j == 3) {
                  //
                  //    var reg = /^[a-za-zA-Z0-9_]{1,30}$/;
                  //    if (!reg.test(txt)) {
                  //        $(val1).addClass('danger');
                  //        checkPass = false
                  //        return false;
                  //    }
                  //}
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt); //修改DataTables对象的数据
                } else {
                  if(j == 2 || j == 3) {
                    table.cell(jqob1).data(txt)
                    $(val1).addClass('danger');
                    checkPass = false
                    return false;
                  }

                }
              }
            });
            if(checkPass) {
              $scope.doAction('save', row.data());
            }
          });
          domMain.on("click", '#protocols', function(e) {
            var tr = $(this).closest('tr');
            var name = $("#protocols  option:selected").val();
            var count = $("#version option").length;
            var versions = $scope.protocolVersions;
            if(name != '') {
              $("#version").html("");
              for(var i in versions) {
                if(versions[i].protocol == name) {
                  $("#version").append('<option  value="' + versions[i].protocolVersion + '" selected = "selected" >' + versions[i].protocolVersion + '</option>');
                }
              }
            } else {
              $("#version").html("");
              $("#version").append('<option  value="" selected = "selected" >请选择...</option>');

            }
          });
          domMain.on('click', '#cancel-btn', function(e) {
            e.stopPropagation();
            $scope.doAction('cancel');
          });
          domMain.on('click', '#edit-btn', function(e) {
            e.preventDefault();
            var isEditing = false;
            var tds = $(this).parents("tbody").children();

            if(!isEditing) {
              for(var j in $scope.approveGridData.data){
                if($scope.approveGridData.data[j].isEdit == 2 || $scope.approveGridData.data[j].isEdit == 3){
                  growl.warning("请保存后再操作！",{});
                  return;
                }
              }
              isEditing = true;
              var tr = $(this).closest('tr');

              var row = table.row(tr);
              var row1 = row.data();
              row.data().isEdit = 2;
              row.cells().invalidate();
            }
          });

          domMain.on('click', '#del-btn', function(e) {
            e.preventDefault();
            var tr = $(this).closest('tr');

            var row = table.row(tr);

            $scope.doAction('delete', row.data());
          });
        }
      ]
    };
  });

  directives.directive('recordTable', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_record", function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              columns: args.columns,
              "aaSorting": [
                [5, "asc"]
              ],
              columnDefs: args.columnDefs
            });
          });

          /**
           * 监听表格初始化后，添加按钮
           */
          domMain.on('init.dt', function() {
            var parentDom = $(".special-btn").parent();
            parentDom.html('<a  href="#/renew" class="btn btn-default btn-sm"><i  style="float: left;margin-top: 4px;margin-right: 3px;" class="proudsmart ps-renewal"></i><span class="hidden-xs"> 缴费</span></a>');
            $compile(parentDom)($scope);
          });

          domMain.on('click', "#price-btn", function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            location.href = '#/renew/' + rowData.orderNo + '';
          });
        }
      ]
    };
  });
  directives.directive('messageTable', function($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var domMain = $element;
          var table;

          $scope.$on(Event.USERCENTERINIT + '_msg', function(event, args) {
            if(table) {
              table.destroy();
              domMain.empty();
            }

            table = domMain.DataTable({
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              select: $.ProudSmart.datatable.select,
              order: [
                [2, "desc"]
              ],
              data: args.data,
              columns: args.columns,
              columnDefs: args.columnDefs,
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
          $scope.$on("table-search-handle", function(event, args) {
            if (args.name == $attrs.name)
              table.search( args.value ).draw();
          });

          function format(d) {
            var returnStr ="";
            returnStr +="<div>"+ d.message.content+"</div>"
            return returnStr;
          };
          domMain.on('change', '#allselect-btn', function(e) {
            e.stopPropagation();
            if(e.target.checked) {
              table.rows().select();
              var tableRows = table.rows({
                selected: true
              });
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
            if (tableRows.count() != table.rows()[0].length) {
              $('#allselect-btn').attr('checked',false)
              $('#allselect-btn').prop('checked',false);
            } else if (tableRows.count() == table.rows()[0].length) {
              $('#allselect-btn').attr('checked',true)
              $('#allselect-btn').prop('checked',true);
            }
          });
          domMain.on('click', "th:eq(0)", function(e) {
            var msgStatus = $("input[name='allClick']").is(':checked');
            $("input[name='msgClick']").prop("checked", msgStatus);
          });
          domMain.on('click', "#msgClick", function(e) {
            //var ck=$(this).is(':checked')
            var ck2 = $("input[name='allClick']").is(':checked');
            var o = document.getElementsByName("msgClick");
            var count = 0;
            var num = 0;
            for(var i = 0; i < o.length; i++) {
              if(o[i].checked == true) {
                count++;
              }
              if(o[i].checked == false) {
                num++;
              }
            }
            if(count == o.length) {
              //o[0].checked=true;
              console.log("true==");
              $("input[name='allClick']").prop("checked", true);
            }
            if(num > 0) {
              if(ck2 == true) {
                //o[0].checked=false;
                console.log("false==");
                $("input[name='allClick']").attr("checked", false);
              }
            }
          });
          domMain.on('click', "td:nth-child(2)", function(e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if($scope.readMsgStatus != "/read" && rowData.message.msgType != "ticket_service_message") {
              $scope.statusUpdate(rowData);
            }
            if( rowData.message.msgType == "ticket_service_message"){
              if(rowData.status == 0){
                $scope.statusUpdate(rowData);
              }
              if(row.child.isShown()) {
                  row.child.hide();
                  tr.removeClass('shown');
              } else {
                row.child(format(row.data())).show();
              }
            }
            //orderdetail/2016062914233500001/manage/doing
          });
          domMain.on('click', "td:nth-child(1)", function(e) {
            if($scope.readMsgStatus == "/read") {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              $scope.statusUpdate(rowData);
            }
            //orderdetail/2016062914233500001/manage/doing
          });

        }
      ]
    };
  });
});