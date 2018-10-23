define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.initController('RappidViewsCtrl', ['$scope','viewFlexService','$timeout','growl', 'dialogue',
    function($scope, viewFlexService,$timeout,growl,dialogue) {
      /**
      var createView = function(param, callback) {
        viewFlexService.addView(param, function(returnObj) {
          if(returnObj.code == 0) {
            callback(returnObj.data);
            growl.success("保存成功");
          }
        });
      };
      var updateView = function(param) {
        viewFlexService.updateView(param, function(returnObj) {
          if(returnObj.code == 0) {
            for (var i = $scope.configureView.length-1;i>-1;i--) {
              if ($scope.configureView[i].viewId == returnObj.data.viewId) {
                $scope.configureView[i] = returnObj.data;
              }
            }
            $scope.$broadcast('RAPPIDVIEWS', {
              "data": $scope.configureView
            });
            growl.success("保存成功");
          }
        });
      }
      $scope.addViews = function() {
        BootstrapDialog.show({
          title: '新建组态视图',
          closable: false,
          message: $('<input name="viewname" class="form-control" placeholder="输入视图的名称..."></input>'),
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var viewNm = $("input[name='viewname']").val();
              if (viewNm) {
                var param = {
                  viewTitle: viewNm,
                  viewName: viewNm,
                  viewType: "configure"
                }
                createView(param);
                dialogRef.close();
              }
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      };
       */
      /**
      $scope.managePerforms = function() {
        location.href = "#/designView2";
      };
      $scope.doAction = function(flg, rowData,fun) {
        if (flg == "attr-delete") {
          BootstrapDialog.show({
            title: '删除组态视图',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除该视图吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                viewFlexService.deleteViews([rowData.viewId],function(returnObj){
                  if (returnObj.code == 0) {
                    for (var i = 0 ;i< $scope.configureView.length;i++) {
                      if ($scope.configureView[i].viewId == rowData.viewId) {
                        $scope.configureView.splice(i,1);
                        break;
                      }
                    }
                    if (fun) {
                      fun(true);
                    }
                  }
                });
                
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else if (flg == "view-copy") {
          var copyView = jQuery.extend(true,{},rowData);
          copyView.viewTitle = copyView.viewTitle+"复制";
          copyView.viewName = copyView.viewTitle;
          copyView.viewId = 0;
          createView(copyView);
        } else if (flg == "view-save") {
          updateView(rowData);
        }
      }
       */
      /** $scope.configureView = []; */
      function initViews() {
        var getAllMyViews_callback = function(returnObj){
          if (returnObj.code == 0) {
            var configureViews = returnObj.data.filter(function(elem){
              return elem.viewType == "configure";
            });
            var addNewClick = function(){
              var self = event;
              var newGraph = "新建组态视图";
              var rs = newGraph;
              var find = $scope.viewlist.source.some(function(element){
                return newGraph == element.viewTitle
              });
              if(find) {
                var inx = 1
                while(find){
                  rs = newGraph + inx;
                  inx++;
                  find = $scope.viewlist.source.some(function(element){
                    return rs == element.viewTitle
                  });
                }
              }
              var fnlist = [{
                label : '创建组态视图',
                icon : 'btn btn-success',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(event){
                  var param = {
                    viewType : "configure",
                    viewTitle : event.input[0].value,
                    viewHierarchy : event.input[1].value,
                    description : event.input[2].value
                  };
                  viewFlexService.addView(param, function(event){
                    if(event.code == 0){
                      growl.success("复制组态视图[" + event.data.viewTitle + "]成功", {});
                      dialogue.close();
                      location.href = "../app-configure/index.html#/configure/" + event.data.viewId;
                    }
                  })
                }
              },{
                label : '取消',
                icon : 'btn btn-default',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                }
              }];
              dialogue.open({
                title : {
                  label : '新建组态视图'
                },
                input : [{
                  value : rs,
                  composory : true,
                  type : "input",
                  label : '组态视图名称',
                  placeholder : '组态视图名称',
                  onChange : function(event){
                    var value = this.value;
                    var find = $scope.viewlist.source.find(function(element){
                      return element.viewTitle == value;
                    });
                    if(find){
                      event.error = "此视图名已被占用，请更换.";
                      fnlist[0].disabled = true;
                    } else {
                      if(value == ""){
                        event.error = "视图名不可为空.";
                        fnlist[0].disabled = true;
                      } else {
                        event.error = null;
                        fnlist[0].disabled = false;
                      }
                    }
                  }
                },{
                  value : "",
                  type : "input",
                  composory : false,
                  label : '视图层级',
                  placeholder : '层级结构，例如 0/1'
                },{
                  value : "描述信息",
                  type : "textarea",
                  composory : false,
                  label : '描述信息',
                  placeholder : '新视图名称'
                }],
                fnlist : fnlist
              });
            };
            var removeGraph = function(event){
              var self = event;
              var viewIds = event.map(function(elem){
                return elem.viewId
              });
              var viewTitles = event.map(function(elem){
                return elem.viewTitle;
              });
              var fnlist = [{
                label : '是',
                icon : 'btn btn-success',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                  viewFlexService.deleteViews(viewIds, function(event){
                    if(event.code == 0){
                      growl.success("组态视图 [ " + viewTitles.toString() + " ] 删除成功", {});
                      for(var i in self){
                        self[i].remove();
                      };
                    }
                  });
                }
              },{
                label : '否',
                icon : 'btn btn-default',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                }
              }];
              dialogue.open({
                title : {
                  label : '删除组态视图'
                },
                description : {
                  label : '确认要删除组态视图   [ ' + viewTitles.toString() + ' ]  吗？'
                },
                fnlist : fnlist
              });
              console.log(viewIds)
            };
            var designClick = function(event){
              location.href = "../app-configure/index.html#/configure/" + event.viewId;
            };
            var viewClick = function(event){
              location.href = "../app-configure/index.html#/display/" + event.viewId;
            };
            var editClick = function(event){
              var self = event;
              var fnlist = [{
                label : '编辑组态视图',
                icon : 'btn btn-success',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(event){
                  var param = {
                    viewType : "configure",
                    viewId : self.viewId,
                    viewTitle : event.input[0].value,
                    viewHierarchy : event.input[1].value,
                    description : event.input[2].value
                  };
                  console.log(param)
                  viewFlexService.updateView(param, function(event){
                    console.log(event);
                    if(event.code == 0){
                      growl.success("更新组态视图[" + event.data.viewTitle + "]成功", {});
                      dialogue.close();
                      self.description = event.date.description;
                      self.hierarchy = event.date.hierarchy;
                    }
                  })
                }
              },{
                label : '取消',
                icon : 'btn btn-default',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                }
              }];
              dialogue.open({
                title : {
                  label : '编辑视图信息'
                },
                input : [{
                  value : event.viewTitle,
                  composory : true,
                  type : "input",
                  label : '组态视图名称',
                  placeholder : '组态视图名称',
                  onChange : function(event){
                    var value = this.value;
                    var find = $scope.viewlist.source.find(function(element){
                      return element.viewTitle == value && element.viewTitle != event.viewTitle;
                    });
                    if(find){
                      event.error = "名已被占用，请更换.";
                      fnlist[0].disabled = true;
                    } else {
                      if(value == ""){
                        event.error = "视图名不可为空.";
                        fnlist[0].disabled = true;
                      } else {
                        event.error = null;
                        fnlist[0].disabled = false;
                      }
                    }
                  }
                },{
                  value : event.viewHierarchy,
                  type : "input",
                  composory : false,
                  label : '视图层级',
                  placeholder : '层级结构，例如 0/1'
                },{
                  value : event.description,
                  type : "textarea",
                  composory : false,
                  label : '描述信息',
                  placeholder : '新视图名称'
                }],
                fnlist : fnlist
              });
            };
            var deleteClick = function(event){
              var self = event;
              var viewId = event.viewId;
              var viewTitle = event.viewTitle;
              var fnlist = [{
                label : '是',
                icon : 'btn btn-success',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                  viewFlexService.deleteViews([viewId], function(event){
                    if(event.code == 0){
                      growl.success("组态视图 [ " + viewTitle + " ] 删除成功", {});
                      self.remove();
                      //getViews();
                    }
                  });
                }
              },{
                label : '否',
                icon : 'btn btn-default',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                }
              }];
              dialogue.open({
                title : {
                  label : '删除组态视图'
                },
                description : {
                  label : '确认要删除组态视图   [ ' + viewTitle + ' ]  吗？'
                },
                fnlist : fnlist
              });
            };
            var duplicateClick = function(event){
              var self = event;
              console.log("duplicateClick");
              var duplicateNameBase = event.viewTitle + "_复制";
              var duplicateName = duplicateNameBase;
              var content = event.content;
              var find = $scope.viewlist.source.some(function(element){
                return duplicateName == element.viewTitle
              });
              if(find) {
                var inx = 1
                while(find){
                  duplicateName = duplicateNameBase + inx;
                  inx++;
                  find =  $scope.viewlist.source.some(function(element){
                    return duplicateName == element.viewTitle
                  });
                }
              }
              var fnlist = [{
                label : '创建',
                icon : 'btn btn-success',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(event){
                  console.log(event.input)
                  var param = {
                    viewType : "configure",
                    viewTitle : event.input[0].value,
                    content : content
                  };
                  viewFlexService.addView(param, function(event){
                    if(event.code == 0){
                      growl.success("复制组态视图[" + event.data.viewTitle + "]成功", {});
                      dialogue.close();
                      self.insertAfter(event.data);
                    }
                  })
                }
              },{
                label : '取消',
                icon : 'btn btn-default',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                }
              }];
              dialogue.open({
                title : {
                  label : '复制视图'
                },
                input : [{
                  value : duplicateName,
                  composory : true,
                  label : '新视图名称',
                  placeholder : '新视图名称',
                  onChange : function(event){
                    var value = this.value;
                    var find = $scope.viewlist.source.find(function(element){
                      return element.viewTitle == value;
                    });
                    if(find){
                      event.error = "此视图名已被占用，请更换.";
                      fnlist[0].disabled = true;
                    } else {
                      if(value == ""){
                        event.error = "视图名不可为空.";
                        fnlist[0].disabled = true;
                      } else {
                        event.error = null;
                        fnlist[0].disabled = false;
                      }
                    }
                  }
                }],
                fnlist : fnlist
              });
            };
            /**
            var exportClick = function(){
              console.log("exportClick");
            };
            var releaseView = function(viewTitles, viewIds, callback){
              var fnlist = [{
                label : '是',
                icon : 'btn btn-success',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                  viewFlexService.releaseView(viewIds, function(event){
                    if(event.code == 0){
                      growl.success("发布 [ " + viewTitle + " ] 视图成功", {});
                      callback(event.data);
                    }
                  });
                }
              },{
                label : '否',
                icon : 'btn btn-default',
                style : {
                  width : '50%',
                  'border-radius' : 0,
                  'font-size' : '18px',
                  'font-weight' : 'bold',
                  'padding' : 10
                },
                fn : function(){
                  dialogue.close();
                }
              }];
              dialogue.open({
                title : {
                  label : '发布Dashboard视图'
                },
                description : {
                  label : '确认要发布DASHBOARD视图   [ ' + viewTitles.toString() + ' ]  吗？'
                },
                fnlist : fnlist
              });
            }
            var releaseGroup = function(event){
              var viewIds = event.map(function(elem){
                return elem.viewId
              });
              var viewTitles = event.map(function(elem){
                return elem.viewTitle;
              });
              releaseView(viewTitles, viewIds, function(data){
                console.log("viewTitle", data);
              });
            }
            var releaseClick = function(event){
              var viewId = event.viewId;
              var viewTitle = event.viewTitle;
              releaseView([viewTitle], [viewId], function(data){
                console.log("viewTitle", data);
              });
            };
             var dumy = (function(){
              var rs = [];
              for(var i = 0; i < 153; i++){
                rs.push({
                  viewTitle : "视图名称" + i,
                  createTime : "时间" + i
                })
              }
              return rs;
            })();
             */
            $scope.viewlist = {
              source : configureViews,
              header : [{
                label : "新建组态视图",
                icon : "fa fa-plus",
                type : "button",
                class : "btn btn-primary btn-sm",
                style : {
                  margin : "2px"
                },
                events : {
                  click : addNewClick
                }
              },{
                label : "删除",
                icon : "fa fa-plus",
                type : "button",
                visible : function(event){
                  var some = event.some(function(elem){
                    return elem.selected == true;
                  });
                  return !some;
                },
                class : "btn btn-default btn-sm",
                style : {
                  margin : "2px"
                },
                events : {
                  click : removeGraph
                }
              }],
              columnDefs : [{
                label : "视图名称",
                data : "viewTitle",
                type : "text",
                filterable : true,
                sortable : true
              },{
                label : "视图层级",
                data : "viewHierarchy",
                type : "text",
                filterable : true,
                sortable : true
              },{
                label : "视图描述",
                data : "description",
                type : "text",
                format : function(str){
                  if(str == null){
                    return '-';
                  } else {
                    return str;
                  }
                },
                filterable : true,
                sortable : true
              },{
                label : "创建时间",
                data : "createTime",
                type : "date",
                format : "yy-mm-dd, hh:nn:ss",
                filterable : false,
                sortable : true
              },{
                label : "更新时间",
                data : "updateTime",
                type : "date",
                format : "yy-mm-dd, hh:nn:ss",
                filterable : false,
                sortable : true
              },{
                label : "操作",
                width : 141,
                type : "buttonGroup",
                filterable : false,
                sortable : false,
                options : [{
                  label : "设计",
                  type : "button",
                  class : "btn btn-primary",
                  events : {
                    click : designClick
                  }
                },{
                  label : "查看",
                  type : "button",
                  events : {
                    click : viewClick
                  }
                },{
                  label : "编辑",
                  type : "button",
                  events : {
                    click : editClick
                  }
                },{
                  label : "删除",
                  type : "button",
                  events : {
                    click : deleteClick
                  }
                },{
                  label : "复制",
                  type : "button",
                  events : {
                    click : duplicateClick
                  }
                }]
              }]
            };
            /**
             $scope.$broadcast('RAPPIDVIEWS', {
              "data": $scope.configureView
            });
             */
          }
        }
        viewFlexService.getAllMyViews(getAllMyViews_callback);
      }
      initViews();

    }
  ]);
});