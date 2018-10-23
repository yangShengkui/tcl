define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.initController('configAlertDialog', ['$scope', function(scope){

  }]);
  controllers.initController('configAlertCtrl', ['$scope', '$q', 'viewFlexService','$timeout','growl', 'dialogue', 'ngDialog', 'userDomainService', 'userLoginUIService', 'resourceUIService',
    function($scope, q, viewFlexService,$timeout,growl,dialogue, ngDialog, userDomainService, userLoginUIService, resourceUIService) {
      function initViews() {
        var getAllMyViews_callback = function(returnObj){
          if (returnObj.code == 0) {
            /**
            var del = returnObj.data.filter(function(elem){
              return elem.viewType == null;
            }).map(function(elem){
              return elem.viewId;
            });
            viewFlexService.deleteViews(del, function(event){
              console.log(event);
            });
             */
            var configAlerts = returnObj.data.filter(function(elem){
              return elem.viewType == "configAlert";
            });
            var editAlertView = function(view){
              var namelist = configAlerts.filter(function(elem){
                if(view){
                  return elem.viewTitle !=  view.viewTitle;
                } else {
                  return true;
                }
              }).map(function(elem){
                return elem.viewTitle;
              });
              var newTitle = $$.duplicateName("新建告警组", namelist);
              var run = function(domainlist, rootModel){
                if(view){
                  var dt = JSON.parse(view.content);
                }
                var stateToArr = function(target, data){
                  var arr = data.split(",");
                  var loop = function(elem){
                    elem.value = arr.indexOf(elem.replacer + "") > -1;
                  };
                  for(var i in target){
                    loop(target[i]);
                  }
                  return target;
                };
                var getData = function(data){
                  var param = {};
                  var loop = function(index, elem){
                    var type = elem.type;
                    var value;
                    if(type == "checkbox"){
                      value = [];
                      for(var i in elem.options){
                        if(elem.options[i].value){
                          value.push(elem.options[i].replacer);
                        }
                      }
                      value = value.toString();
                    } else {
                      value = elem.value;
                    }
                    param.$attr(elem.data, value);
                  };
                  for(var i in data){
                    loop(i, data[i]);
                  }
                  param.content = JSON.stringify(param.content);
                  return param;
                };
                var alertOption = [{
                  label : "新产生",
                  replacer : 0
                },{
                  label : "已确认",
                  replacer : 5
                },{
                  label : "处理中",
                  replacer : 10
                },{
                  label : "已解决",
                  replacer : 20
                }];
                var severities = [{
                  label : "警告",
                  replacer : 1,
                  value : false
                },{
                  label : "次要",
                  replacer : 2,
                  value : false
                },{
                  label : "重要",
                  replacer : 3,
                  value : false
                },{
                  label : "严重",
                  replacer : 4,
                  value : false
                }];
                $scope.dialog = {
                  input : [{
                    "label" : "告警组名称",
                    "value" : view ? view.viewTitle : newTitle,
                    "data" : "viewTitle",
                    "type" : "input",
                    "composory" : true,
                    "events" : {
                      "change" : function(item){
                        if(namelist.indexOf(item.value) != -1){
                          item.error = "告警视图以存在，请更换视图名称";
                          $scope.dialog.button[0].disabled = true;
                        } else if(item.value == ""){
                          item.error = "告警视图名称不可为空";
                          $scope.dialog.button[0].disabled = true;
                        } else {
                          item.error = undefined;
                          $scope.dialog.button[0].disabled = false;
                        }
                      }
                    }
                  },{
                    "label" : "资源域",
                    "value" : view ? dt.domain : null,
                    "data" : "content/domain",
                    "type" : "tree",
                    "key" : "domainPath",
                    "mark" : "domain",
                    "options" : domainlist,
                    "fontsize" : "12px",
                    "width" : "200px"
                  },{
                    "label" : "设备模板",
                    "value" : view ? dt.nodeType : null,
                    "data" : "content/nodeType",
                    "type" : "tree",
                    "key" : "id",
                    "mark" : "nodes",
                    "options" : rootModel,
                    "fontsize" : "12px",
                    "width" : "200px"
                  },{
                    "value" : view ? dt.pageSize : 1000,
                    "label" : "取得告警数量",
                    "data" : "content/pageSize",
                    "type" : "input",
                    "events" : {
                      "change" : function(item){
                        var regExp = /\d.*/;
                        var test = regExp.test(item.value)
                        if(test){
                          item.error = undefined;
                          $scope.dialog.button[0].disabled = false;
                        } else {
                          item.error = "请输入数字";
                          $scope.dialog.button[0].disabled = true;
                        }
                      }
                    }
                  },{
                    "label" : "内容关键词",
                    "value" : view ? dt.messageFilter : "",
                    "data" : "content/messageFilter",
                    "type" : "input"
                  },{
                    "label" : "告警状态",
                    "data" : "content/states",
                    "type" : "checkbox",
                    "options" : stateToArr(alertOption, view ? dt.states : "")
                  },{
                    "label" : "告警级别",
                    "data" : "content/severities",
                    "type" : "checkbox",
                    "options" : stateToArr(severities, view ? dt.severities : "")
                  }],
                  button : [{
                    label : view ? "编辑" : "创建",
                    icon : "btn btn-primary",
                    fn : function(){
                      ngDialog.close();
                      var param = getData($scope.dialog.input);
                      var fn;
                      param.viewType = "configAlert"
                      if(view){
                        param.viewId = view.viewId;
                        fn = viewFlexService.updateView;
                      } else {
                        fn = viewFlexService.addView;
                      }
                      fn(param, function(event){
                        if(event.code == "0"){
                          if(view){
                            view.viewTitle = event.data.viewTitle;
                            view.content = event.data.content;
                            growl.success("告警视图 [ " + event.data.viewTitle + " ] 修改成功", {});
                          } else {
                            $scope.viewlist.source.push(event.data);
                            growl.success("创建告警视图成功", {});
                          };
                        }
                      })
                    }
                  },{
                    label : "取消",
                    icon : "btn btn-default",
                    fn : function(){
                      ngDialog.close();
                    }
                  }]
                };
                console.log($scope.dialog);
              };
              var checkAllLoaded = function(){
                if(window['domainlist'] == undefined){
                  userDomainService.queryDomainTree(userLoginUIService.user.userID, function(event){
                    if(event.code == 0){
                      window['domainlist'] = event.data;
                      checkAllLoaded();
                    }
                  })
                } else if(window['rootModel'] == undefined){
                  var getRootModel_back = function(event){
                    if(event.code == 0){
                      window['rootModel'] = [event.data];
                      var getModels_back = function(event){
                        Array.prototype.push.apply(window['rootModel'], event.data);
                        checkAllLoaded();
                      };
                      resourceUIService.getModels(getModels_back);
                    }
                  };
                  resourceUIService.getRootModel(getRootModel_back)
                } else {
                  run(window['domainlist'], window['rootModel']);
                }
              };
              checkAllLoaded();
              ngDialog.open({
                template: '../partials/config-alert-dialog.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
              })
            };
            var addNewClick = function(event){
              editAlertView();
            };
            var designClick = function(event, source){
              editAlertView(event, source)
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
                      growl.success("告警视图 [ " + viewTitles.toString() + " ] 删除成功", {});
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
                  label : '删除告警视图'
                },
                description : {
                  label : '确认要删除告警视图   [ ' + viewTitles.toString() + ' ]  吗？'
                },
                fnlist : fnlist
              });
              console.log(viewIds)
            };
            var viewClick = function(event){
              location.href = "../app-configure/index.html#/display/" + event.viewId;
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
                      growl.success("告警视图 [ " + viewTitle + " ] 删除成功", {});
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
                  label : '删除告警视图'
                },
                description : {
                  label : '确认要删除告警视图   [ ' + viewTitle + ' ]  吗？'
                },
                fnlist : fnlist
              });
            };
            var duplicateClick = function(event){
              var self = event;
              var namelist = $scope.viewlist.source.map(function(elem){
                return elem.viewTitle;
              })
              var duplicateName = $$.duplicateName(event.viewTitle, namelist);
              var content = event.content;
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
                      growl.success("复制告警视图[" + event.data.viewTitle + "]成功", {});
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
            $scope.viewlist = {
              source : configAlerts,
              header : [{
                label : "新建告警视图",
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
                icon : "fa fa-minus",
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
                  label : "编辑",
                  type : "button",
                  class : "btn btn-primary",
                  events : {
                    click : designClick
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