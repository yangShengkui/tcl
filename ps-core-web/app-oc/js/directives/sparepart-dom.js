define(['directives/directives', 'datatables.net', 'datatables.net-bs'], function(directives, datatables) {
  'use strict';

  //======================================      备件信息   ===========================================
  directives.initDirective('spareInfoTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        var ifShow = false; //false为关闭，true为点击列表才为true
        var ifClose = false; //初始状态为false可关闭，当点击展开时ifClose为true，只有关闭按钮后才回到初始状态
        // var editStatus = 3; //为3是为新加状态，为2是编辑状态
        var ifFirst = 0; //默认是0，第一次点击是1，在编辑状态下随意点击是2，isEdit=0时，回到初始值0
        $scope.$on(Event.SPAREINFOINIT, function(event, args) {
          if (ifShow) {
            ifShow = false;
          }
          if (ifClose) {
            ifClose = false;
          }
          if (table) {
            table.destroy();
          }
          isEditing = false;
        /*    备件编码-name
            备件名称-label
            厂部-customerId
            使用设备类型-deviceModelId
            备件类型-model
            规格型号-specification
            生产厂家-manufacturer
            参考使用寿命-lifespan
            实际库存-stockNumber
            安全库存-lowerLimit (数量下限)
            附件-未添加(图片)

            备件单位-unit
            数据上限-upperLimit
            原始数量-originalNumber*/
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "name"]
            ],
            columns: [{
              data: "name",
              title: "备件编号"
            }, {
              data: "label",
              title: "备件名称"
            },{
                data: "customerId",
                title: "厂部"
            },{
                data: "deviceModelId",
                title: "使用设备类型"
            },{
                data: "model",

                title: "备件类型"
            },{
              data: "specification",
              title: "规格型号"
            }, {
                data: "manufacturer",
                title: "生产厂家"
            }, {
                    data: "lifespan",
                    title: "参考使用寿命"
                },{
                data: "stockNumber",
                title: "实际库存"
            },{
                data: "lowerLimit",
                title: "安全库存"
            },{
                data: "imageUrl",
                title: "附件"
            },
                $.ProudSmart.datatable.optionCol3, {
              data: "id",
              title: "",
              visible: false
            }],
            columnDefs: [{
              targets: 0,
              data: "name",
              render: function(data, type, full) {
                //返回自定义名字
                if (full.isEdit == 2 && $scope.editStatus == 3 && type == "display")
                  return "<input maxlength='20' style='width:100%' autofocus='autofocus' autocomplete='off' placeholder='请输入备件编号' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'name'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 1,
              data: "label",
              render: function(data, type, full) {
                //返回自定义名字
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' style='width:100%' autocomplete='off' placeholder='请输入备件名称' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'label'>";
                else {
                  return escape(data);
                }
              }
            }, {
                targets: 2,
                data: "customerId",
                render: function(data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                        return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入备件型号' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'model'>";
                    else {
                        for(var i=0;i<$scope.customersList.length;i++){
                          if(full.customerId==$scope.customersList[i].id){
                              data=$scope.customersList[i].customerName;
                          }
                        }
                        return escape(data);
                    }
                }
            },  {
                targets: 3,
                data: "deviceModelId",
                render: function(data, type, full) {
                    // 返回自定义内容
                    if (full.isEdit == 2 && type == "display")
                        return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入备件型号' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'model'>";
                    else {
                        var str="";
                        if(data){

                            for(var i=0;i<data.length;i++){

                                for(var j=0;j<$scope.modelListSelect.length;j++){
                                    if(data[i]==$scope.modelListSelect[j].id){
                                        str=str+","+$scope.modelListSelect[j].label;
                                        break;
                                    }
                                }


                            }
                            str=str.substring(1,str.length-1);
                           // return escape(str);
                        }else{
                            for(var j=0;j<$scope.modelListSelect.length;j++){
                                if(data==$scope.modelListSelect[j].id){
                                    str=str+","+$scope.modelListSelect[j].label;
                                    break;
                                }
                            }
                           // return escape(str);
                        }
                        return escape(str);

                    }
                }
            },{
              targets: 4,
              data: "model",
              render: function(data, type, full) {
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入备件型号' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'model'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 5,
              data: "specification",
              render: function(data, type, full) {
                // 返回自定义内容  
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入备件单位' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'unit'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 6,
              data: "manufacturer",
              render: function(data, type, full) {
                // 返回自定义内容  
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='200' style='width:100%' readonly='readonly' class='form-control input-sm' type='text' value='" + escape(data) + "' name = 'stockNumber'>";
                else {
                  return escape(data);
                }
              }
            }, {
              targets: 7,
              data: "lifespan",
              render: function(data, type, full) {
                // 返回自定义内容  
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入关联设备模板' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'values.devicesType'>";
                else {
                  return escape(data);
                }
              }
            },


                {
                    targets: 8,
                    data: "stockNumber",
                    render: function(data, type, full) {
                        // 返回自定义内容
                        if (full.isEdit == 2 && type == "display")
                            return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入关联设备模板' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'values.devicesType'>";
                        else {
                            return escape(data);
                        }
                    }
                },



                {
                    targets: 9,
                    data: "lowerLimit",
                    render: function(data, type, full) {
                        // 返回自定义内容
                        if (full.isEdit == 2 && type == "display")
                            return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入关联设备模板' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'values.devicesType'>";
                        else {
                            return escape(data);
                        }
                    }
                },
                {
                    targets: 10,
                    data: "imageUrl",
                    render: function(data, type, full) {
                        var imageUrl="";
                        // 返回自定义内容
                        if (full.isEdit == 2 && type == "display")
                            return "<input maxlength='200' style='width:100%' autocomplete='off' placeholder='请输入关联设备模板' class='form-control input-sm' type='text' value='" + escape(data) + "'  name = 'values.devicesType'>";
                        else {
                           //
                            if(data){
                                imageUrl=data.substring(data.lastIndexOf("."));
                                return '<span ><a href="'+data+'" style="width:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+(full.label+imageUrl)+'</a></span>';
                            }else{
                                return escape(data);
                            }

                        }
                    }
                },
                {
              "targets": 11,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = '<div class="btn-group btn-group-sm" style="width: 160px;">';
                if (full.isEdit == 2) {
                  str += '<a id="save-btn" class="btn btn-primary btn-sm"><i class="fa fa-save  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>' +
                    '<a id="cancel-btn" class="btn btn-default btn-sm" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';

                } else if ($scope.ifRouteParams == 2010) {
                  str += "<div class='btn-group table-option-group'>" +
                    "<button type='button' class='btn btn-sm' style='cursor:text;'>操作</button>" +
                    "<button type='button' class='btn btn-sm dropdown-toggle' style='cursor:text;'>" +
                    "<span class='caret'></span>" +
                    "<span class='sr-only'>Toggle Dropdown</span>" +
                    "</button>" +
                    "</div>";
                } else {
                  /*if ($scope.menuitems['A02_S11']) {
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if ($scope.menuitems['A03_S11']) {
                    str += "<button id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                  if ($scope.menuitems['A04_S11']) {
                    str += "<button id='showStockOrder-btn' class='btn btn-default btn-sm' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 备件记录</span></button>";
                  }
                  str += "</div>";*/


                   // var str = "<div class='btn-group btn-group-sm'>";
                    //str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                    //str += "<button id='del-btn' class='btn btn-default btn-sm'><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></button>";
                    str += "<button id='sparepartDetail' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>详情</span></button>";
                    str += "<button  type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                    str += "<ul class='dropdown-menu' role='menu'>";
                    str += "<li><a  href='#' id='adjustStock'>库存调整</a></li>";
                    str += "<li><a  href='#'  id='stockInOutDetail'>出入明细</a></li>";
                    str += "<li><a  href='#' id='edit-btn'>编辑</a></li>";
                    str += "<li><a  href='#' id='del-btn'>删除</a></li>";
                    str += "</ul></div>";
                    return str;

                  // str = "<div class='btn-group table-option-group'>" +
                  //   "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                  //   "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                  //   "<span class='caret'></span>" +
                  //   "<span class='sr-only'>Toggle Dropdown</span>" +
                  //   "</button>" +
                  //   "<ul class='dropdown-menu' role='menu'>";
                  // str += "<li><a href='' id='edit-btn'>编辑</a></li>";
                  // str += "<li><a href='' id='del-btn'>删除</a></li>";
                  // str += "<li><a href='' id='showStockOrder-btn'>备件记录</a></li>";
                  // // str += "<li><a href='' id='spareIn-btn'>入库</a></li>";
                  // // str += "<li><a href='' id='spareOut-btn'>出库</a></li>";
                  // str += "</ul>";
                  // str += "</div>";
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
          if (d && d.isEdit == 2) {
            returnStr = '<table width="100%" class="table table-inner">' +
              '<tr role="row">' +
              '<td style="width:19%;">原始数量:</td>' +
              '<td><input datatype="' + d.originalNumber + '" type="number" autocomplete="off" placeholder="请输入1~9999999999的整数" style="width:75%;" class="form-control input-sm" name="originalNumber" value="' + (d.originalNumber) + '"></td>' +
              '</tr>' +
              '<tr role="row">' +
              '<td style="width:19%;">数量上限:</td>' +
              '<td><input datatype="' + d.upperLimit + '" type="number" autocomplete="off" placeholder="请输入1~9999999999的整数" style="width:75%;"  class="form-control input-sm" name="upperLimit" value="' + (d.upperLimit) + '"></td>' +
              '</tr>' +
              '<tr role="row">' +
              '<td style="width:19%;">数量下限:</td>' +
              '<td><input datatype="' + d.lowerLimit + '" type="number" autocomplete="off" placeholder="请输入小于数量上限的正整数" style="width:75%;" class="form-control input-sm" name="lowerLimit" value="' + (d.lowerLimit) + '"></td>' +
              '</tr>' +
              '<tr role="row">' +
              '<td style="width:19%;">备注:</td>' +
              '<td><input datatype="' + d.desc + '"style="width:75%;" autocomplete="off" placeholder="请输入备注" class="form-control input-sm" name="desc" value="' + (d.desc) + '"></td>' +
              '</tr>' +
              '</table>';
          } else if (d && d.isEdit == 0) {
            returnStr = '<table width="100%" class="table table-inner">';
            for (var i in d) {
              returnStr += '<tr role="row">';
              if (i == 'upperLimit') {
                returnStr += '<td style="width:19%;">数量上限:</td>';
                returnStr += '<td>' + d.upperLimit + '</td>';
              } else if (i == 'lowerLimit') {
                returnStr += '<td style="width:19%;">数量下限:</td>';
                returnStr += '<td>' + d.lowerLimit + '</td>';
              } else if (i == 'desc') {
                returnStr += '<td style="width:19%;">备注:</td>';
                returnStr += '<td>' + d.desc + '</td>';
              }
              returnStr += '</tr>';
            }
            returnStr += '</table>';
          } else if (d == "" || d == null || d == undefined) {
            returnStr = '<div class="box record-box">' +
              '<div class="box-body table-responsive">' +
              // '<label>备件编号：{{SpareName}}</label>' +
              '<div class="pull-right">' +
              '<a id="close-table" class="btn btn-default btn-sm">' +
              '<i class="fa fa-times"></i><span class="hidden-xs">关闭</span>' +
              '</a>' +
              '</div>' +
              '<table width="100%" class="table" spare-record-table></table>' +
              '</div>' +
              '</div>';
          }
          return returnStr;
        };
        $scope.$on("table-search-handle", function(event, args) {
          if (args.name == $attrs.name)
            table.search( args.value ).draw();
        });
        /**
         * 监听表格初始化后，添加按钮
         */
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addSpareInfo()" ng-disabled="!selecteditem" ng-hide="ifRouteParams==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加备件</span></a>');
          // $compile(parentDom)($scope);
        });
        /*
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          if (($(this).context.cellIndex == 5 && row.data().isEdit == 0)) {
            return;
          }
          if (rowData) {
            if (row.child.isShown()) { //之前展开
              // This row is already open - close it
              if (row.data().isEdit == 0 && (!ifShow)) { //如果是展示，直接合上
                row.child.hide();
                tr.removeClass('shown');
              } else if (row.data().isEdit == 0 && ifShow) {
                // if ($('.record-box').hasClass('shown')) {
                //   row.child.hide();
                // }
                return;
              } else if (row.data().isEdit == 2) { //如果是编辑，则仍是展开状态
                if (!tr.hasClass('shown')) {
                  tr.addClass('shown');
                  row.child(format(row.data())).show();
                  $compile(tr.next())($scope);
                  $scope.doActionInfo('showStockOrder', rowData);
                }
              } else if (ifShow) {
                row.child(format()).show();
                $compile(tr.next())($scope);
                $scope.doActionInfo('showStockOrder', rowData);
              }
            } else { //之前关闭，则需要展开
              // Open this row
              var data = row.data();
              if (row.data().isEdit == 2) {
                if (!tr.hasClass('shown')) {
                  row.child(format(rowData)).show();
                  tr.addClass('shown');
                }
              }
              if (ifShow && (!ifClose)) {
                row.child(format()).show();
                $compile(tr.next())($scope);
                $scope.doActionInfo('showStockOrder', rowData);
              } else {
                if ($('.record-box').hasClass('shown')) {
                  row.child.hide();
                  return;
                } else {
                  row.child(format(data)).show();
                }
              }
            }
          }

        });
        */
        domMain.on('click','#sparepartDetail',function (e) {
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var dataList = row.data();

            location.href = "#/sparepartInfo/" + dataList.id + "";
        });

        //库存调整
          domMain.on('click','#adjustStock',function (e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();
              $scope.adjustSpareInfoStock(dataList);

          });

          //出入库明细
          domMain.on('click','#stockInOutDetail',function (e) {
              e.preventDefault();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();
              $scope.getStockInOutDetail(dataList.id);
          });

          //
        domMain.on('click', '#showStockOrder-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
          if (ifShow) {
            growl.info("请先关闭之前备件记录再打开", {});
            return;
          }
          if (ifClose) { //之前关闭按钮未关闭，则直接返回，不许再展开
            return;
          }
          ifShow = true;
          ifClose = true;
          row.child(format()).show();
          tr.addClass('bg-f5f5f5');
          tr.next().addClass('bg-f5f5f5');
          tr.addClass('shown');
          $('.record-box').addClass('shown');
          $compile(tr)($scope);
          $compile(tr.next())($scope);
          $scope.doActionInfo('showStockOrder', rowData);
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          $scope.editStatus = 2;
          var tr = $(this).closest('tr');
          var row = table.row(tr);
           var dataList = row.data();
            $scope.editSpareInfo(dataList);
        });

        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var tds = $(this).parents("tr").children();
          var checkPass = true;
          var selectRow = null;
          var upperData = -1; //上限
          var lowerData = -1; //下限
          var oriNumber = -1; //原始值
          var stockNumber = -1; //库存值
          for (var i in row.data()) {
            if (i == 'isEdit' && row.data()[i] == 2) {
              selectRow = row.data();
            }
          }
          $.each(tds, function(j, val1) {
            var jqob1 = $(val1);
            //把input变为字符串
            if (!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input").val());
              if (!txt) { //没有值
                if (j != 4) { //且不是第四项
                  $(val1).addClass('danger');
                  checkPass = false;
                  return false;
                }
              } else { //有值
                if (j == 0) {
                  if ($scope.allSpareInfos.length == 0) {
                    $(val1).removeClass('danger');
                    table.cell(jqob1).data(txt);
                  } else {
                    for (var i in $scope.allSpareInfos) {
                      if ($scope.allSpareInfos[i].name == txt) {
                        if ($scope.editStatus == 3) {
                          growl.warning("备件编号需要填写唯一", {});
                          $(val1).addClass('danger');
                          checkPass = false;
                          return;
                        }
                      } else {
                        $(val1).removeClass('danger');
                        table.cell(jqob1).data(txt);
                      }
                    }
                  }
                } else {
                  $(val1).removeClass('danger');
                  table.cell(jqob1).data(txt);
                }
              }
            }
          });
          if (!selectRow) {
            growl.warning("请填写完整备件信息", {});
            return;
          }
          var ipts = tr.parent().find('input');
          $.each(ipts, function(i, val) {
            var txt = $(val).val();
            var attrname = $(val).attr('name');
            if (attrname == "stockNumber") {
              stockNumber = parseInt(txt);
            } else if (attrname == "upperLimit") {
              if (parseInt(txt) < 0 || txt == "") {
                $(val).css({ "border-width": "3px", "border-color": "#f2dede" });
                checkPass = false;
                return;
              } else {
                upperData = parseInt(txt);
                selectRow[attrname] = txt;
              }
            } else if (attrname == "lowerLimit") {
              if (parseInt(txt) < 0 || txt == "") {
                $(val).css({ "border-width": "3px", "border-color": "#f2dede" });
                checkPass = false;
                return;
              } else {
                lowerData = parseInt(txt);
                selectRow[attrname] = txt;
                if (lowerData > upperData) {
                  growl.warning("请正确输入上下限范围", {});
                  checkPass = false;
                  return;
                } else if (oriNumber > 9999999999 || lowerData > 9999999999 || upperData > 9999999999) {
                  growl.warning("请输入的数量范围控制在0~9999999999之内", {});
                  checkPass = false;
                  return;
                } else {
                  selectRow[attrname] = txt;
                }
              }
            } else if (attrname == "name") {
              if (!txt) {
                checkPass = false;
                return;
              } else { //有值
                if ($scope.allSpareInfos.length == 0) {
                  selectRow[attrname] = txt;
                } else {
                  for (var i in $scope.allSpareInfos) {
                    if ($scope.allSpareInfos[i].name == txt) { //如果值重复
                      checkPass = false;
                      return false;
                    } else {
                      selectRow[attrname] = txt;
                    }
                  }
                }
              }
            } else if (attrname == "originalNumber") {
              if (parseInt(txt) < 0 || txt == "" || txt == undefined) {
                $(val).css({ "border-width": "3px", "border-color": "#f2dede" });
                checkPass = false;
                return;
              } else {
                oriNumber = parseInt(txt);
                selectRow[attrname] = txt;
              }

            } else {
              selectRow[attrname] = txt;
            }

          });

          if (checkPass && upperData >= oriNumber >= lowerData >= 0) {
            selectRow.isEdit = 0;
            $scope.editStatus = 3;
            isEditing = false;
            $scope.doActionInfo('savespareInfo', selectRow, function(flg) {
              if (flg) { //真为成功保存
                row.cells().invalidate().draw();
                row.child.hide();
              } else { //假为保存失败
                return;
                // row.remove().draw(false);
              }
            });

          }
        });

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          isEditing = false;
          var row = table.row('.shown');
          if (row.data()) {
            row.data().isEdit = 0;
            row.child.hide();
            row.cells().invalidate();
            $scope.doActionInfo('cancel', row.data());
          } else {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data().isEdit = 0;
            // row.child.hide();
            // row.cells().invalidate();
            $scope.doActionInfo('cancel', row.data());
          }
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doActionInfo('deletespareInfo', row.data());
        });

        domMain.on('click', '#close-table', function(e) {
          e.stopPropagation();
          ifShow = false;
          ifClose = false;
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doActionInfo('cancel', row.data());
        });
      }]
    }
  }]);


  //======================================出入库明细=========================

    directives.initDirective('stockInfoTable',['$timeout', '$compile', '$filter','resourceUIService', function($timeout, $compile, $filter,resourceUIService){

        return{
            restrict:'A',
            controller:['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                var domMain = $element;
                var table;
               // $scope.queryState=2;
                $scope.$on("STOCKINFOINIT", function(event, args) {
                    if (table) {
                        table.destroy();
                    }
                  $scope.queryState=2;//在此处更新不会被覆盖

                    table = domMain.DataTable({
                        dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        data: args.option[0],
                        searching: false,
                        order: [
                            [0, "asc"]
                        ],
                        columns: [

                            {
                                data: "createTime",
                                title: "操作时间"
                            }, {
                            data: "category",
                            title: "操作类型"
                        }, {
                            data: "sparePartNumber",
                            title: "数量"
                        },{
                                data: "deviceModelId",
                                title: "应用设备"
                            }  , {
                            data: "deviceCode",
                            title: "设备编码"
                        },  {
                                data: "devicePartId",
                                title: "备件使用部位"
                            },{
                                data: "taskId",
                                title: "任务名称"
                            }, {
                                data: "desc",
                                title: "备注"
                            } ,{
                            data: "handlerPerson",
                            title: "处理人"
                        }],
                        columnDefs: [{
                            targets: 0,
                            data: "modifyTime",
                            render: function(data, type, full) {
                                // 返回自定义内容
                                var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                                return str;
                            }
                        }, {
                            targets: 1,
                            data: "category",
                            render: function(data, type, full) {
                                var newData = "";
                                // 返回自定义内容
                                if (full.stockOrder.category == "InStock") {
                                    newData = "入库";
                                } else if (full.stockOrder.category == "OutStock") {
                                    newData = "出库";
                                }
                                return newData;
                            }
                        },{
                            targets:2,
                            data: "sparePartNumber",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        },{
                            targets: 3,
                            data: "deviceModelId",
                            render: function(data, type, full) {
                                var str="";

                                    for(var j=0;j<$scope.modelListSelect.length;j++){
                                        if(data==$scope.modelListSelect[j].id){
                                            str=$scope.modelListSelect[j].label;
                                            break;
                                        }
                                    }

                                return escape(str);
                            }
                        },{
                            targets: 4,
                            data: "deviceCode",
                            render: function(data, type, full) {
                                return escape(data);
                            }
                        },{
                            targets: 5,
                            data: "devicePartId",
                            render: function(data, type, full) {
                                /*if(data){
                                   // $scope.getDevicePartLabel(data);
                                    var devicePartLabel="";
                                    resourceUIService.getDevicePartById(data,function(returnObj){
                                        if(returnObj.code==0){
                                            if(returnObj.data){
                                                devicePartLabel=returnObj.data.label;
                                            }

                                        }
                                    });
                                    return escape(devicePartLabel);

                                }*/
                                return escape(data);
                            }
                        },{
                            targets:6,
                            data: "taskId",
                            render: function(data, type, full) {
                               return escape(data);
                            }
                        },{
                            targets: 7,
                            data: "desc",
                            render: function(data, type, full) {
                              return escape(data);
                            }
                        },{
                            targets: 8,
                            data: "handlerPerson",
                            render: function(data, type, full) {
                                return escape(full.stockOrder.handlerPerson);
                            }
                        }]
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
                    // var parentDom = $(".special-btn").parent();
                    // parentDom.html('<a ng-click="addSpareInfo()" ng-disabled="!selecteditem" ng-hide="ifRouteParams==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加备件</span></a>');
                    // $compile(parentDom)($scope);
                });
            }]
        }
        }
    ])

  //======================================      备件记录   ===========================================
  directives.initDirective('spareRecordTable', ['$timeout', '$compile', '$filter', function($timeout, $compile, $filter) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        $scope.$on(Event.SPAREINFOINIT + "record", function(event, args) {
          if (table) {
            table.destroy();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            searching: false,
            order: [
              [0, "category"]
            ],
            columns: [{
              data: "category",
              title: "出入库"
            }, {
              data: "sparePartNumber",
              title: "备件数量"
            }, {
              data: "name",
              title: "库单编号"
            }, {
              data: "handlerPerson",
              title: "处理人"
            }, {
              data: "createTime",
              title: "创建时间"
            }],
            columnDefs: [{
              targets: 0,
              data: "category",
              render: function(data, type, full) {
                var newData = "";
                // 返回自定义内容
                if (data == "InStock") {
                  newData = "入库";
                } else if (data == "OutStock") {
                  newData = "出库";
                }
                return newData;
              }
            }, {
              targets: 4,
              data: "createTime",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                return str;
              }
            }]
          });
        });
      }]
    }
  }]);

  //======================================    备件入库    ===================================================
 /* directives.initDirective('spareInTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        var ifShow = false;
        $scope.$on(Event.SPAREININIT, function(event, args) {
          if (ifShow) {
            ifShow = false;
          }
          if (table) {
            table.destroy();
          }
          isEditing = false;
          var itemAttrs = args.option[1];
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "asc"]
            ],
            columns: [{
              data: "name",
              title: "库单编号"
            }, {
              data: "desc",
              title: "库单说明"
            }, {
              data: "handlerPerson",
              title: "处理人"
            }, {
              data: "createTime",
              title: "入库时间"
            }, $.ProudSmart.datatable.optionCol3, {
              data: "id",
              title: "",
              visible: false
            }],
            columnDefs: [{
              targets: 0,
              data: "name",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' placeholder='请输入库单编号' name='name' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              targets: 2,
              data: "handlerPerson",
              render: function(data, type, full) {

                // 返回自定义内容
                if (full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' placeholder='请输入处理人' name='handlerPerson' type='text' value='" + escape(data) + "'>";
                else

                  return escape(full.stockOder.handlerPerson);
              }
            }, {
              targets: 3,
              data: "createTime",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = '';
                if (full.isEdit > 0)
                  return '<input style="width:100%" type="text" class="form-control input-sm" readonly drops="down"  timepicker="true" value="' + $filter("date")(data, "yyyy-MM-dd HH:mm:ss") + '" autocomplete="off"  date-time-picker >';
                else
                  str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                return str;
              }
            }, {
              targets: 1,
              data: "desc",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' placeholder='请输入库单说明' name='desc' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              "targets": 4,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = '<div class="btn-group btn-group-sm">';
                if (full.isEdit == 2) {
                  str += '<a id="save-btn" class="btn btn-primary btn-sm"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>' +
                    '<a id="cancel-btn" class="btn btn-default btn-sm" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a>';
                } else if ($scope.ifRouteParams == 2010) {
                  str += "<div class='btn-group table-option-group'>" +
                    "<button type='button' class='btn btn-sm' style='cursor:text;'>操作</button>" +
                    "<button type='button' class='btn btn-sm dropdown-toggle' style='cursor:text;'>" +
                    "<span class='caret'></span>" +
                    "<span class='sr-only'>Toggle Dropdown</span>" +
                    "</button>" ;
                } else {
                  if ($scope.menuitems['D02_A05_S11']) {
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if ($scope.menuitems['D03_A05_S11']) {
                    str += "<button id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                  if ($scope.menuitems['D04_A05_S11']) {
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  }
                  str += "<ul class='dropdown-menu' role='menu'>";
                  if ($scope.menuitems['D04_A05_S11']) {
                    str += "<li><a role='button'  id='sparelist-btn'>备件条目</a></li>";
                  }
                  str += "</ul>";
                  // str = "<div class='btn-group table-option-group'>" +
                  //   "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                  //   "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                  //   "<span class='caret'></span>" +
                  //   "<span class='sr-only'>Toggle Dropdown</span>" +
                  //   "</button>" +
                  //   "<ul class='dropdown-menu' role='menu'>";

                  // str += "<li><a href='' id='edit-btn'>编辑</a></li>";
                  // str += "<li><a href='' id='del-btn'>删除</a></li>";
                  // str += "<li><a href='' id='sparelist-btn'>备件条目</a></li>";
                  // str += "</ul>";
                  // str += "</div>";
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

        function format() {
          var innerString = '<div class="box">' +
            '<div class="box-body table-responsive">' +
            '<a ng-click="addInSpareClauseItem()" ng-hide="ifSubmitIn==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加条目</span></a>' +
            '<div class="text-center pull-right">' +
            '<a class="btn btn-default btn-sm" ng-hide="ifSubmitIn==2010" ng-click="submitInCaluses();">' +
            '<i class="fa fa-save"><span class="hidden-xs">提交</span></i>' +
            '</a>' +
            '<a id="close-table" class="btn btn-default btn-sm">' +
            '<i class="fa fa-times"></i><span class="hidden-xs">关闭</span>' +
            '</a>' +
            '</div>' +
            '<table width="100%" class="table" inspare-clauses-table></table>' +
            '</div>' +
            '</div>';
          return innerString;
        }
        $scope.$on("table-search-handle", function(event, args) {
          if (args.name == $attrs.name)
            table.search( args.value ).draw();
        });
        /!**
         * 监听表格初始化后，添加按钮
         *!/
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addspareIn()"  ng-disabled="!selecteditem" ng-hide="ifRouteParams==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加入库信息</span></a>');
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
          if (!isEditing) {
            isEditing = true;
            row.data().isEdit = 2;
            row.cells().invalidate();
            $compile(tr)($scope);
          } else {
            if (row.data().isEdit == 0) {
              growl.warning("有正编辑的入库信息", {});
              return;
            }
          }
          if (row.data().id == 0) {
            growl.warning("有正编辑的入库信息", {});
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
          $.each(tr.children(), function(j, val1) {
            var jqob1 = $(val1);
            //把input变为字符串
            if (!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input").val());
              var attrname = $.trim(jqob1.children("input").attr('name'));
              if (txt) {
                if (j == 1 || j == 2 || j == 0) {
                  if (txt.length > 30) {
                    growl.warning("请输入少于30个字", {});
                    $(val1).addClass('danger');
                    checkPass = false;
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()[attrname] = txt;
                  }
                } else if (j == 3) {
                  var startval = Date.parse(txt);
                  startDate = new Date(startval);
                  row.data()["createTime"] = startDate;
                  $(val1).removeClass('danger');
                } else {
                  $(val1).removeClass('danger');
                  row.data()["createTime"] = txt;
                }

              } else {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              }
            }
          });
          if (checkPass) {
            $scope.doActionIns('saveSpareIn', row.data(), function(returnObj) {
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

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          isEditing = false;
          var row = table.row('.shown');
          if (row.data()) {
            row.data()["isEdit"] = 0;
            row.child.hide();
            row.cells().invalidate();
            $scope.doActionIns('cancel', row.data());
          } else {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            row.data()["isEdit"] = 0;
            row.child.hide();
            $scope.doActionIns('cancel', row.data());
          }
        });

        domMain.on('click', '#del-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.doActionIns('deleteSpareIn', row.data());
        });

        domMain.on('click', '#sparelist-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (ifShow) {
            growl.info("请先关闭之前备件条目再打开", {});
            return;
          }
          ifShow = true;
          row.child(format()).show();
          tr.addClass('shown');
          tr.addClass('bg-f5f5f5');
          tr.next().addClass('bg-f5f5f5');
          $compile(tr)($scope);
          $compile(tr.next())($scope);
          $scope.doActionIns('showSpareList', row.data());
        });

        domMain.on('click', '#close-table', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          ifShow = false;
          $scope.doActionIns('cancel', row.data());
        });
      }]
    }
  }]);*/

  //======================================    入库条目信息   =================================================

 /* directives.initDirective('inspareClausesTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        $scope.$on(Event.INSPARECLAUSESINIT, function(event, args) {
          if (table) {
            table.destroy();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "asc"]
            ],
            columns: [{
              data: "sparePartName",
              title: "备件编号"
            }, {
              data: "sparePartNumber",
              title: "备件数量"
            }, {
              data: "desc",
              title: "备注"
            }, $.ProudSmart.datatable.optionCol2],
            columnDefs: [{
              targets: 0,
              data: "sparePartName",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display") {
                  var str = '<select id="sparePartName" name="sparePartName" style="width:100%" class="combobox form-control">' +
                    '<option value="">请选择备件</option>';
                  var argData = args.option[0];
                  var spareInfos = $scope.spareInfos;
                  for (var i = 0; i < spareInfos.length; i++) {
                    if (spareInfos[i].name == data) {
                      str += '<option selected="true" value="' + spareInfos[i].id + '">' + spareInfos[i].name + '</option>';
                    } else {
                      str += '<option value="' + spareInfos[i].id + '">' + spareInfos[i].name + '</option>';
                    }
                  }
                  str += '</select>';
                  return str;
                } else {

                  return escape(data);

                }
              }
            }, {
              targets: 1,
              data: "sparePartNumber",
              render: function(data, type, full) {
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' name='sparePartNumber' autocomplete='off' style='width:100%' placeholder='请输入1~9999999999的整数' class='form-control input-sm' type='number' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              targets: 2,
              data: "desc",
              render: function(data, type, full) {
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' name='desc' autocomplete='off' style='width:100%' class='form-control input-sm' type='text' placeholder='请输入备注' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              "targets": 3,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='input-group'>";
                if (full.isEdit == 2) {
                  str += "<a id='save-btn'  class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 保存</span></a>"
                  str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                } else {
                  if ($scope.$parent.ifSubmitIn == 2010) {
                    str += "<button  class='btn' style='cursor:text;'><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>已提交</span></button>"
                  } else {
                    str += "<a id='edit-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 修改</span></a>"
                    str += "<a id='delStock-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></a>"
                  }

                }
                str += "</div>"
                return str;
              }
            }]
          });
        });

        /!**
         * 监听表格初始化后，添加按钮
         *!/
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addInSpareClauseItem()" ng-hide="ifSubmitIn==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加条目</span></a>');
          // $compile(parentDom)($scope);
        });
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
        });

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          isEditing = false;
          var selectRow = table.row('.shown');
          $scope.$parent.doActionIn('cancel');
        });

        domMain.on('click', '#delStock-btn', function(e) {
          e.preventDefault();
          isEditing = false;
          var selectRow = table.row('.shown');
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.$parent.doActionIn('deleteStockOrderItem', row.data());
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (!isEditing) {
            isEditing = true;
            row.data().isEdit = 2;
            row.cells().invalidate();
            $compile(tr)($scope);
          } else {
            if (row.data().isEdit == 0) {
              growl.warning("有正编辑的库单条目", {});
              return;
            }
          }
          if (row.data().id == 0) {
            growl.warning("有正编辑的库单条目", {});
            return;
          }
        });

        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var checkPass = true;
          var selectRow = null;
          var selVal = $("#sparePartName").val();

          $.each(tr.children(), function(j, val1) {
            var jqob1 = $(val1);
            if (j == 0) {
              if (!selVal) {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else {
                $(val1).removeClass('danger');
                row.data()["sparePartId"] = selVal;
              }
            }

            //把input变为字符串
            if (!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input").val());
              var attrname = $.trim(jqob1.children("input").attr('name'));
              if (txt) {
                if (j == 1) {
                  var reg = /^[1-9]\d{0,9}$/;
                  if (!reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false;
                    growl.warning("请输入1~9999999999的整数", {});
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()[attrname] = txt;

                  }
                } else {
                  $(val1).removeClass('danger');
                  row.data()[attrname] = txt;
                }

              } else {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              }
            }
          });
          if (checkPass) {
            row.data().isEdit = 0;
            isEditing = false;
            $scope.$parent.doActionIn('saveSpareInCaluses', row.data());
          }
        });

      }]
    }
  }])*/


  //======================================    出库条目信息   =================================================

 /* directives.initDirective('outspareClausesTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        $scope.$on(Event.OUTSPARECLAUSESINIT, function(event, args) {
          if (table) {
            table.destroy();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [0, "asc"]
            ],
            columns: [{
              data: "sparePartName",
              title: "备件编号"
            }, {
              data: "sparePartNumber",
              title: "备件数量"
            }, {
              data: "desc",
              title: "备注"
            }, $.ProudSmart.datatable.optionCol2],
            columnDefs: [{
              targets: 0,
              data: "sparePartName",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display") {
                  var str = '<select id="sparePartName" name="sparePartName" style="width:100%" class="combobox form-control">' +
                    '<option value="">请选择备件</option>';
                  var argData = args.option[0];
                  var spareInfos = $scope.spareInfos;
                  for (var i = 0; i < spareInfos.length; i++) {

                    if (spareInfos[i].name == data) {
                      str += '<option selected="true" value="' + spareInfos[i].id + '">' + spareInfos[i].name + '</option>';
                    } else {
                      str += '<option value="' + spareInfos[i].id + '">' + spareInfos[i].name + '</option>';
                    }
                  }
                  str += '</select>';
                  return str;
                } else {

                  return escape(data);

                }
              }
            }, {
              targets: 1,
              data: "sparePartNumber",
              render: function(data, type, full) {
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' name='sparePartNumber' autocomplete='off' placeholder='请输入1~9999999999的整数' style='width:100%' class='form-control input-sm' type='number' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              targets: 2,
              data: "desc",
              render: function(data, type, full) {
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input maxlength='20' name='desc' placeholder='请输入备注' autocomplete='off' style='width:100%' class='form-control input-sm' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              "targets": 3,
              "data": "option",
              "render": function(data, type, full) {
                var str = "<div class='input-group'>";
                if (full.isEdit == 2) {
                  str += "<a id='save-btn'  class='btn btn-default btn-sm' ><i class='fa fa-save hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 保存</span></a>"
                  str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 取消</span></a>"
                } else {
                  if ($scope.$parent.ifSubmitOut == 2010) {
                    str += "<button  class='btn' style='cursor:text;'><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>已提交</span></button>"
                  } else {
                    str += "<a id='edit-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>修改</span></a>"
                    str += "<a id='delStock-btn' class='btn btn-default btn-sm' ><i class='fa fa-minus hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>删除</span></a>"
                  }

                }
                str += "</div>";
                return str;
              }
            }]
          });
        });

        /!**s
         * 监听表格初始化后，添加按钮
         *!/
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addOutSpareClauseItem()" ng-hide="ifSubmitOut==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加条目</span></a>');
          // $compile(parentDom)($scope);
        });
        /!*
        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();

        });

        domMain.on('click', '#cancel-btn', function(e) {
          e.stopPropagation();
          isEditing = false;
          var selectRow = table.row('.shown');
          $scope.$parent.doActionOut('cancel');
        });

        domMain.on('click', '#delStock-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          $scope.$parent.doActionOut('deleteStockOrderItem', row.data());
        });

        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (!isEditing) {
            isEditing = true;
            row.data().isEdit = 2;
            row.cells().invalidate();
            $compile(tr)($scope);
          } else {
            if (row.data().isEdit == 0) {
              growl.warning("有正编辑的条目信息", {});
              return;
            }

          }
          if (row.data().id == 0) {
            growl.warning("有正编辑的条目信息", {});
            return;
          }
        });
        *!/
/!*
        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var checkPass = true;
          var selectRow = null;
          var selVal = $("#sparePartName").val();

          $.each(tr.children(), function(j, val1) {
            var jqob1 = $(val1);
            if (j == 0) {
              if (!selVal) {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              } else {
                $(val1).removeClass('danger');
                row.data()["sparePartId"] = selVal;
              }
            }

            //把input变为字符串
            if (!jqob1.has('button').length && jqob1.has('input').length) {

              var txt = $.trim(jqob1.children("input").val());
              var attrname = $.trim(jqob1.children("input").attr('name'));
              if (txt) {
                if (j == 1) {
                  var reg = /^[1-9]\d{0,9}$/;
                  if (!reg.test(txt)) {
                    $(val1).addClass('danger');
                    checkPass = false;
                    growl.warning("请输入1~9999999999的整数", {});
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()[attrname] = txt;

                  }
                } else {
                  $(val1).removeClass('danger');
                  row.data()[attrname] = txt;
                }

              } else {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              }
            }
          });
          if (checkPass) {
            row.data().isEdit = 0;
            isEditing = false;
            $scope.$parent.doActionOut('saveSpareOutCaluses', row.data());
          }
        });
*!/
      }]
    }
  }])*/


  //======================================    备件出库    ===================================================
  /*directives.initDirective('spareOutTable', ['$timeout', '$compile', '$filter', 'growl', function($timeout, $compile, $filter, growl) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var isEditing = false;
        var ifShow = false;
        $scope.$on(Event.SPAREOUTINIT, function(event, args) {
          if (ifShow) {
            ifShow = false;
          }
          if (table) {
            table.destroy();
          }
          isEditing = false;
          table = domMain.DataTable({
            dom: args.option[0] && args.option[0].length > 0 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            data: args.option[0],
            order: [
              [5, "asc"]
            ],
            columns: [{
              data: "name",
              title: "库单编号"
            }, {
              data: "desc",
              title: "库单说明"
            }, {
              data: "handlerPerson",
              title: "处理人"
            }, {
              data: "createTime",
              title: "出库时间"
            }, $.ProudSmart.datatable.optionCol3, {
              data: "id",
              title: "",
              visible: false
            }],
            columnDefs: [{
              targets: 0,
              data: "name",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' placeholder='请输入库单编号' name='name' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              targets: 2,
              data: "handlerPerson",
              render: function(data, type, full) {
                var returnProjectDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' autocomplete='off' placeholder='请输入处理人' name='handlerPerson' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              targets: 3,
              data: "createTime",
              render: function(data, type, full) {
                // 返回自定义内容    
                var str = '';
                if (full.isEdit > 0)
                  return '<input style="width:100%" type="text" class="form-control input-sm" readonly drops="down"  timepicker="true" value="' + $filter("date")(data, "yyyy-MM-dd HH:mm:ss") + '" autocomplete="off"  date-time-picker >';
                else
                  str = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                return str;
              }
            }, {
              targets: 1,
              data: "desc",
              render: function(data, type, full) {
                var returnDate = '';
                // 返回自定义内容    
                if (full.isEdit == 2 && type == "display")
                  return "<input style='width:100%' class='form-control input-sm' placeholder='请输入库单说明' name='desc' type='text' value='" + escape(data) + "'>";
                else
                  return escape(data);
              }
            }, {
              "targets": 4,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = '<div class="btn-group btn-group-sm">';
                if (full.isEdit == 2) {
                  str += '<a id="save-btn" class="btn btn-primary btn-sm"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">保存</span></a>' +
                    '<a id="cancel-btn" class="btn btn-default btn-sm" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a>';

                } else if ($scope.ifRouteParams == 2010) {
                  str += "<div class='btn-group table-option-group'>" +
                    "<button type='button' class='btn btn-sm' style='cursor:text;'>操作</button>" +
                    "<button type='button' class='btn btn-sm dropdown-toggle' style='cursor:text;'>" +
                    "<span class='caret'></span>" +
                    "<span class='sr-only'>Toggle Dropdown</span>" +
                    "</button>";
                } else {
                  if ($scope.menuitems['D02_A06_S11']) {
                    str += "<button id='edit-btn' class='btn btn-primary btn-sm' ><i class='fa fa-edit hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if ($scope.menuitems['D03_A06_S11']) {
                    str += "<button id='del-btn' class='btn btn-default btn-sm' ><i class='fa fa-trash hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                  if ($scope.menuitems['D04_A06_S11']) {
                    str += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> 更多<span class='caret'></span></button>";
                  }
                  str += "<ul class='dropdown-menu' role='menu'>";
                  if ($scope.menuitems['D04_A06_S11']) {
                    str += "<li><a role='button'  id='sparelist-btn'>备件条目</a></li>";
                  }
                  str += "</ul>";
                  // str = "<div class='btn-group table-option-group'>" +
                  //   "<button type='button' class='btn btn-default btn-sm'>操作</button>" +
                  //   "<button type='button' class='btn btn-default btn-sm dropdown-toggle' data-toggle='dropdown'>" +
                  //   "<span class='caret'></span>" +
                  //   "<span class='sr-only'>Toggle Dropdown</span>" +
                  //   "</button>" +
                  //   "<ul class='dropdown-menu' role='menu'>";

                  // str += "<li><a href='' id='edit-btn'>编辑</a></li>";
                  // str += "<li><a href='' id='del-btn'>删除</a></li>";
                  // str += "<li><a href='' id='sparelist-btn'>备件条目</a></li>";
                  // str += "</ul>";
                  // str += "</div>";

                }

                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              $compile(nRow)($scope);
            }
          });
        });
        
        $scope.$on("table-search-handle", function(event, args) {
          if (args.name == $attrs.name)
            table.search( args.value ).draw();
        });
        
        /!**
         * 监听表格初始化后，添加按钮
         *!/
        domMain.on('init.dt', function() {
          // var parentDom = $(".special-btn").parent();
          // parentDom.html('<a ng-click="addspareOut()"  ng-disabled="!selecteditem" ng-hide="ifRouteParams==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加出库信息</span></a>');
          // $compile(parentDom)($scope);
        });

        domMain.on('click', 'td', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var rowData = row.data();
        });
/!*
        domMain.on('click', '#edit-btn', function(e) {
          e.preventDefault();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          if (!isEditing) {
            isEditing = true;
            row.data().isEdit = 2;
            row.cells().invalidate();
            $compile(tr)($scope);
          } else {
            if (row.data().isEdit == 0) {
              growl.warning("有正编辑的出库信息", {});
              return;
            }

          }
          if (row.data().id == 0) {
            growl.warning("有正编辑的出库信息", {});
            return;
          }
        });
*!/
        domMain.on('click', '#save-btn', function(e) {
          e.stopPropagation();
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var startDate = '';
          var endDate = '';
          var checkPass = true;
          var selectRow = null;
          $.each(tr.children(), function(j, val1) {
            var jqob1 = $(val1);
            //把input变为字符串
            if (!jqob1.has('button').length && jqob1.has('input').length) {
              var txt = $.trim(jqob1.children("input").val());
              var attrname = $.trim(jqob1.children("input").attr('name'));
              if (txt) {
                if (j == 1 || j == 2 || j == 0) {
                  if (txt.length > 30) {
                    growl.warning("请输入少于30个字", {});
                    $(val1).addClass('danger');
                    checkPass = false;
                    return false;
                  } else {
                    $(val1).removeClass('danger');
                    row.data()[attrname] = txt;
                  }
                } else if (j == 3) {
                  var startval = Date.parse(txt);
                  startDate = new Date(startval);
                  row.data()["createTime"] = startDate;
                  $(val1).removeClass('danger');
                } else {
                  $(val1).removeClass('danger');
                  row.data()["createTime"] = txt;
                }

              } else {
                $(val1).addClass('danger');
                checkPass = false
                return false;
              }
            }
          });

          if (checkPass) {
            $scope.doAction('saveSpareOut', row.data(), function(returnObj) {
              if (returnObj == false) {
                row.data().isEdit = 2;
              } else {
                isEditing = false;
                row.data().isEdit = 0;
                row.data().id = returnObj.id;
                row.cells().invalidate();
              }
            });
          }
        });
          /!*
                  domMain.on('click', '#cancel-btn', function(e) {
                    e.stopPropagation();
                    isEditing = false;
                    var row = table.row('.shown');
                    if (row.data()) {
                      row.data()["isEdit"] = 0;
                      row.child.hide();
                      row.cells().invalidate();
                      $scope.doAction('cancel', row.data());
                    } else {
                      var tr = $(this).closest('tr');
                      var row = table.row(tr);
                      row.data()["isEdit"] = 0;
                      row.child.hide();
                      row.cells().invalidate();
                      $scope.doAction('cancel', row.data());
                    }
                  });

                            domMain.on('click', '#del-btn', function(e) {
                              e.preventDefault();
                              var tr = $(this).closest('tr');
                              var row = table.row(tr);
                              $scope.doAction('deleteSpareOut', row.data());
                            });

                            domMain.on('click', '#sparelist-btn', function(e) {
                              e.preventDefault();
                              var tr = $(this).closest('tr');
                              var row = table.row(tr);
                              if (ifShow) {
                                growl.info("请先关闭之前备件条目再打开", {});
                                return;
                              }
                              ifShow = true;
                              var innerString = '<div class="box">' +
                                '<div class="box-body table-responsive">' +
                                '<a ng-click="addOutSpareClauseItem()" ng-hide="ifSubmitOut==2010" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加条目</span></a>' +
                                '<div class="pull-right">' +
                                '<a id="submit-btn" class="btn btn-default btn-sm" ng-hide="ifSubmitOut==2010" ng-click="submitOutCaluses();">' +
                                '<i class="fa fa-save"><span class="hidden-xs">提交</span></i>' +
                                '</a>' +
                                '<a id="close-table" class="btn btn-default btn-sm">' +
                                '<i class="fa fa-times"></i><span class="hidden-xs">关闭</span>' +
                                '</a>' +
                                '</div>' +
                                '<table width="100%" class="table" outspare-clauses-table></table>' +
                                '</div>' +
                                '</div>';
                              row.child(innerString).show();
                              tr.addClass('shown');
                              tr.addClass('bg-f5f5f5');
                              tr.next().addClass('bg-f5f5f5');
                              $compile(tr)($scope);
                              $compile(tr.next())($scope);
                              $scope.doAction('showSpareList', row.data());
                            })

                            domMain.on('click', '#close-table', function(e) {
                              e.preventDefault();
                              var tr = $(this).closest('tr');
                              var row = table.row(tr);
                              ifShow = false;
                              $scope.doAction('cancel', row.data());
                            });
                            *!/
      }]
    }
  }]);*/

});
