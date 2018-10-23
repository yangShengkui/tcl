define(['directives/directives'], function (directives) {
    'use strict';

    directives.directive('approveTable', function ($timeout, $compile) {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs',
                function ($scope, $element, $attrs) {
                    var domMain = $element;
                    var table;

                    $scope.$on(Event.APPROVEINIT, function (event, args) {
                        if (table) {
                            table.destroy();
                        }

                        table = domMain.DataTable({
                            dom: '<"row"<"col-sm-12"<"special-btn">><"col-sm-12">><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
                            language: directives.datatable.language,
                            data: args.data,
                            columns: args.columns,
                            rowCallback: function (nRow, aData, iDataIndex) {
                                $compile(nRow)($scope);
                            },
                            "aaSorting": [
                                [0, "desc"]
                            ],
                            columnDefs: args.columnDefs
                        });
                    });
                    /**
                     * 监听表格初始化后，添加按钮
                     */
                    domMain.on('init.dt', function () {
                        var parentDom = $(".special-btn").parent();
                        parentDom.html('<a ng-click="addProve()" class="pull-right btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 新增</span></a>');
                        $compile(parentDom)($scope);
                    });
                    domMain.on('click', '#save-btn', function (e) {
                        e.stopPropagation();
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        var checkPass = true;
                        var protocol=$("#protocols").find("option:selected").val();
                        var version=$("#version").find("option:selected").val();
                        if(protocol != '请选择...' && protocol != ''){
                            row.data()["protocol"]=protocol;
                            $("#protocols").parent("td").removeClass('danger');
                        }else{
                            $("#protocols").parent("td").addClass('danger');
                            checkPass = false
                            return false;
                        }
                        if(version != '请选择...' && version != ''){
                            row.data()["protocolVersion"]=version;
                            $("#version").parent("td").removeClass('danger');
                        }else{
                            $("#version").parent("td").addClass('danger');
                            return false;
                        }
                        $.each(tr.children(), function (j, val1) {
                            var jqob1 = $(val1);

                            //把input变为字符串
                            if (!jqob1.has('button').length && jqob1.has('input').length) {
                                var txt = $.trim(jqob1.children("input").val());

                                if (txt) {

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
                                    if (j == 2 ||  j == 3 ) {
                                        table.cell(jqob1).data(txt)
                                        $(val1).addClass('danger');
                                        checkPass = false
                                        return false;
                                    }

                                }
                            }
                        });
                        if (checkPass) {
                            $scope.doAction('save', row.data());
                        }
                    });
                    domMain.on("click", '#protocols', function (e) {
                        var tr = $(this).closest('tr');
                        var name = $("#protocols  option:selected").val();
                        var count = $("#version option").length;
                        var versions = $scope.protocolVersions;
                        if(name != ''){
                            $("#version").html("");
                            for (var i in versions) {
                                if (versions[i].protocol == name) {
                                    $("#version").append('<option  value="' + versions[i].protocolVersion + '" selected = "selected" >' + versions[i].protocolVersion + '</option>');
                                }
                            }
                        }else{
                            $("#version").html("");
                            $("#version").append('<option  value="" selected = "selected" >请选择...</option>');

                        }
                    });
                    domMain.on('click', '#cancel-btn', function (e) {
                        e.stopPropagation();
                        $scope.doAction('cancel');
                    });
                    domMain.on('click', '#edit-btn', function (e) {
                        e.preventDefault();
                        var isEditing = false;
                        var tds = $(this).parents("tbody").children();


                        if (!isEditing) {
                            isEditing = true;
                            var tr = $(this).closest('tr');

                            var row = table.row(tr);
                            var row1 = row.data();
                            row.data().isEdit = 2;
                            row.cells().invalidate();
                        }
                    });

                    domMain.on('click', '#del-btn', function (e) {
                        e.preventDefault();
                        var tds = $(this).parents("tbody").children();
                        $.each(tds, function (i, val) {
                            var tr1 = $(val).closest('tr');
                            var row1 = table.row(tr1);
                            if (row1.data() == undefined) {
                                tds.eq(i).remove();
                            }
                            if (row1.data() != undefined) {
                                var ipts = tds.eq(i).find('input');
                                $.each(ipts, function (j, valInp) {
                                    var txt = $(valInp).val();
                                    $(valInp).replaceWith(txt);
                                });
                            }

                        });
                        var tr = $(this).closest('tr');

                        var row = table.row(tr);

            $scope.doAction('delete', row.data());
          });
        }
      ]
    };
  });

  directives.directive('recordTable', function ($timeout,$compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;
          var isEditing = false;
          $scope.$on(Event.USERINFOSINIT + "_record", function (event, args) {
            if (table) {
              table.destroy();
            }
            isEditing = false;
            table = domMain.DataTable({
              dom: '<"row"<"col-sm-6"<"special-btn">><"col-sm-6"f>><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              columns: args.columns,
              "aaSorting": [ [5, "asc"] ],
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

          domMain.on('click', "#price-btn", function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            location.href = '#/renew/' + rowData.orderNo + '';
          });
        }
      ]
    };
  });
  directives.directive('messageTable', function ($timeout, $compile) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;

          $scope.$on(Event.USERCENTERINIT + '_msg', function (event, args) {
            if (table) {
              table.destroy();
            }

            table = domMain.DataTable({
              dom: '<"row"<"col-sm-12"<"special-btn">><"col-sm-12">><"row"<"clo-sm-12">>t<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>>',
              language: directives.datatable.language,
              data: args.data,
              columns: args.columns,
              rowCallback: function (nRow, aData, iDataIndex) {
                $compile(nRow)($scope);
              },
              columnDefs: args.columnDefs
            });
          });
          domMain.on('click', "th:eq(0)", function (e) {
            var msgStatus = $("input[name='allClick']").is(':checked');
            $("input[name='msgClick']").prop("checked", msgStatus);
          });
          domMain.on('click', "#msgClick", function (e) {
            //var ck=$(this).is(':checked')
            var ck2=$("input[name='allClick']").is(':checked');
            var o=document.getElementsByName("msgClick");
            var count=0;
            var num=0;
            for(var i=0;i<o.length;i++)
            {
              if(o[i].checked==true)
              {
                count++;
              }
              if(o[i].checked==false)
              {
                num++;
              }
            }
            if(count==o.length)
            {
              //o[0].checked=true;
              console.log("true==");
              $("input[name='allClick']").prop("checked",true);
            }
            if(num>0)
            {
              if(ck2==true)
              {
                //o[0].checked=false;
                console.log("false==");
                $("input[name='allClick']").attr("checked", false);
              }
            }
          });
          domMain.on('click', "td:nth-child(2)", function (e) {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            if($scope.readMsgStatus != "/read") {
              $scope.statusUpdate(rowData);
            }
            //orderdetail/2016062914233500001/manage/doing
          });
          domMain.on('click', "td:nth-child(1)", function (e) {
            if($scope.readMsgStatus == "/read"){
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
