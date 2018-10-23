define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.registerController('Dashboard_ver3Ctrl', Dashboard_ver3Ctrl);
  Dashboard_ver3Ctrl.$inject = ["$scope", "$rootScope", "viewFlexService", "resourceUIService", "$timeout", "$window", "Info", "freeboardservice", 'growl', '$routeParams', 'freeboardBaseService', 'userLoginUIService', 'roleViewService'];

  function Dashboard_ver3Ctrl(scope, rootScope, viewFlexService, resourceUIService, timeout, window, Info, freeboardservice, growl, routeParams, freeboardBaseService, userLoginUIService, roleViewService) {
    var allViews, currentView, viewTitle = routeParams.page ? routeParams.page : 'index',
      pa = routeParams.parameter;
    scope.signClick = function() {
      window.location.href = "../app-freeboard/index.html#/service/view/scenter" + (currentView ? '/' + currentView.viewId : '');
    };

    scope.naviClick = function(link, param) {
      $('#free-board').trigger('naviClick');
      window.location.href = "../app-oc/index.html#/dashboard/" + link + "/" + encodeURIComponent(JSON.stringify(param));
      //在使用bmap时，切换首页有可能会卡死，重新加载页面
      if (link == "index") {
        window.location.reload();
      }
    };

    scope.bgColorFn = function(bgColor) {
      return {
        "background-color": (bgColor ? bgColor : "#eee")
      }
    };
    var ready = function(resView) {
      if(resView.code == 0) {
        var serviceViewId = resView.data.viewId;
        scope.instance = {};
        var getViewById_back = function(event) {
          if(event.code == 0 && event.data != null) {
            var input;
            var content = event.data.content;
            var dt = JSON.parse(content);
            if(typeof dt.setting == "string") {
              dt.setting = JSON.parse(dt.setting)
            }
            scope.setting = dt.setting;
            if(dt.setting) {
              scope.bgColor = dt.setting.color;
            }
            if(dt.hasOwnProperty("groups")) {
              var vt, vt_arr = viewTitle.split("|"),
                va_arr;
              if(pa) {
                va_arr = JSON.parse(pa);
              } else {
                va_arr = [];
              }
              if(vt_arr.length > 0) {
                vt = vt_arr[vt_arr.length - 1];
              } else {
                vt = viewTitle;
                vt_arr = [viewTitle];
              }
              var base = '',
                rs = [];
              var loop = function(inx, elem) {
                var find = dt["groups"].find(function(element) {
                  return elem == element.path;
                });
                if(find) {
                  base = (base == "") ? elem : (base + "|" + elem);
                  var param = va_arr[inx],
                    tabLabel;
                  if(typeof param == "object" && param != null) {
                    tabLabel = param.tabLabel;
                  }
                  rs.push({
                    label: tabLabel ? tabLabel : find.label,
                    link: base,
                    param: va_arr.slice(0, parseInt(inx) + 1)
                  })
                };
              };
              for(var i in vt_arr) {
                loop(i, vt_arr[i])
              };
              scope.navigation = rs;
              if(vt == "panel") {
                var getLastElement = function(arr) {
                  return arr[arr.length - 1];
                };
                var parameter = getLastElement(JSON.parse(routeParams.parameter));
                var modelId = parameter.modelId;
                var resourceId = parameter.resourceId;
                scope.navigation = scope.navigation.concat({
                  label: parameter.tabLabel ? parameter.tabLabel : "设备仪表板",
                  link: base + "|panel"
                });
                var allAvaliableViews, defaultViews, template;
                var getManagedViewsByType_back = function(event) {
                  if(event.code == 0) {
                    allAvaliableViews = event.data;
                    var getDefaultView_back = function(event) {
                      if(event.code == "0") {
                        defaultViews = event.data;
                        var templateDefault = defaultViews.find(function(elem) {
                          if(elem.template) {
                            if(elem.template.resourceId == modelId) {
                              return true;
                            } else {
                              return false;
                            }
                          } else {
                            return false;
                          }
                        });
                        var templateExtent = allAvaliableViews.find(function(elem) {
                          var viewId = elem.viewId;
                          if(elem.template) {
                            if(elem.template.resourceId == modelId) {
                              var findRoleRes = function(elem) {
                                return elem.resId == viewId && elem.resType == 21;
                              };
                              var authorized = userLoginUIService.user.roleResList.some(findRoleRes);
                              return authorized;
                            } else {
                              return false;
                            }
                          } else {
                            return false;
                          }
                        });
                        if(templateExtent) {
                          template = templateExtent;
                        } else if(templateDefault) {
                          template = templateDefault;
                        }
                        if(template) {
                          var getViewById_back = function(event) {
                            var model, resource, content;
                            if(event.code == "0") {
                              var content = event.data.content;
                              var getModel_back = function(event) {
                                if(event.code == "0") {
                                  model = event.data[0];
                                }
                                var getResource_back = function(event) {
                                  if(event.code == "0") {
                                    resource = event.data;
                                    if(content != null) {
                                      var clone = JSON.parse(content);
                                      var input = {
                                        layout: clone.data ? clone.data : clone.layout,
                                        setting: clone.setting
                                      };
                                      delete clone.data;
                                      var editData = new freeboardservice.replaceCiKpi(input, function() {
                                        timeout(function() {
                                          scope.instance.setMode(true);
                                          scope.instance.renderLayout(editData);
                                        });
                                      }, {
                                        model: model,
                                        resource: resource
                                      }, clone);
                                    }
                                  }
                                };
                                if(resourceId) {
                                  resourceUIService.getResourceById(resourceId, getResource_back);
                                } else {
                                  var getResources_back = function(event) {
                                    if(event.code == 0) {
                                      scope.resources = event.data;
                                      scope.resource = scope.resources[0];
                                      scope.itemchange = function(event) {
                                        var id = event.id.split("number:")[1];
                                        var find = scope.resources.find(function(elem) {
                                          return elem.id == id;
                                        });
                                        if(find) {
                                          getResource_back({
                                            code: 0,
                                            data: find
                                          })
                                        }
                                      };
                                      getResource_back({
                                        code: 0,
                                        data: scope.resources[0]
                                      })
                                    };
                                  };
                                  resourceUIService.getResources(getResources_back);
                                };
                              };
                              resourceUIService.getModelByIds([modelId], getModel_back);
                            }
                          };
                          viewFlexService.getViewById(template.viewId, getViewById_back);
                        } else {
                          scope.error = "没有找到相应的设备仪表板视图，点击<a href='#/views/dashboard' style='cursor:pointer; text-decoration: underline;'>Dashboard管理</a>创建设备仪表板";
                        }
                      } else {
                        scope.error = "视图列表为空，请联系系统管理员";
                      }
                    };
                    viewFlexService.getDefaultView(modelId, getDefaultView_back);

                  } else {
                    scope.error = "获取视图列表发生错误，请联系系统管理员";
                  }
                };
                viewFlexService.getManagedViewsByTypeAndRole('dashboard', getManagedViewsByType_back);
              } else {
                //var parameter = JSON.parse($routeParams.parameter);
                var find = dt["groups"].find(function(element) {
                  return vt == element.path;
                });
                scope.tabIndex = find ? dt['groups'].indexOf(find) : 0;
                scope.tabs = dt.groups;
                input = {
                  layout: dt.groups[scope.tabIndex].layout,
                  setting: dt.setting
                };
                var editData = new freeboardservice.replaceCiKpi(input, function() {
                  timeout(function() {
                    scope.instance.setMode(true);
                    scope.instance.renderLayout(editData);
                  });
                }, null, dt);
              }
            } else if(dt.hasOwnProperty("data")) {
              scope.navigation = [{
                label: '运营首页'
              }];
              input = {
                layout: dt.data,
                setting: dt.setting
              };
              var editData = new freeboardservice.replaceCiKpi(input, function() {
                timeout(function() {
                  scope.instance.setMode(true);
                  scope.instance.renderLayout(editData);
                });
              }, null, dt);
            } else if(dt.hasOwnProperty("layout")) {
              scope.navigation = [{
                label: '运营首页'
              }];
              input = {
                layout: dt.layout,
                setting: dt.setting
              };
              var editData = new freeboardservice.replaceCiKpi(input, function() {
                timeout(function() {
                  scope.instance.setMode(true);
                  scope.instance.renderLayout(editData);
                });
              }, null, dt);
            };
          } else {
            scope.error = "此用户无配置首页视图" + (event.message ? "," + event.message : "");
          };
        };
        viewFlexService.getViewById(serviceViewId, getViewById_back);
      } else {
        scope.error = resView.message;
      }
      scope.selectEditDataGroup = function(tab) {
        scope.tabIndex = tab.id;
        var input = {
          layout: tab.layout,
          setting: scope.editData.setting
        };
        scope.editData = new freeboardservice.replaceCiKpi(input, function() {
          timeout(function() {
            scope.editData.renderBoard(true, true);
          });
        });
      }
    };

    /*
     * getViewByFunctionName替换为getViewByFunctionCode
     * M01在不同的解决方案中名称不一样
     */
    roleViewService.getViewByFunctionCode("M01", ready);
    scope.toolbars = [{
        id: "1",
        name: "工具1"
      },
      {
        id: "2",
        name: "工具2"
      },
      {
        id: "3",
        name: "工具3"
      },
      {
        id: "4",
        name: "工具4"
      },
      {
        id: "5",
        name: "工具5"
      }
    ];
  }
});