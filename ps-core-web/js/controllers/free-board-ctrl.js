define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.controller('freeBoardCtrl', ['$scope', '$rootScope', '$route', 'serviceProxy', '$routeParams', '$timeout', 'thridPartyApiService', 'userDomainService', 'kqiManagerUIService', 'userLoginUIService', 'dictionaryService', 'configUIService', 'kpiDataService', 'resourceUIService', 'SwSocket', 'Info', 'viewFlexService', 'growl', '$q', '$window', '$location', 'solutionUIService', 'serviceCenterService', 'chartOptionService', 'toolBarList', 'toolbarListService', 'popup', 'angular-style', 'ticketTaskService', 'alertService', 'freeboardBaseService', 'projectUIService', 'customMethodService', 'ngDialog', 'commonMethodService', 'keySet',
    function(scope, rootScope, route, serviceProxy, routeParams, timeout, thridPartyApiService, userDomainService, kqiManagerUIService, userLoginUIService, dictionaryService, configUIService, kpiDataService, resourceUIService, SwSocket, Info, viewFlexService, growl, q, window, location, solutionUIService, serviceCenterService, chartOptionService, toolBarList, toolbarListService, popup, angularStyle, ticketTaskService, alertService, freeboardBaseService, projectUIService, customMethodService, ngDialog, commonMethodService, keySet) {
      var currentView, loadedView, rootCi, status, allViews, allGraphViews, saveToManagement, titleComposory,
        CHARTDATA = {},
        groupModels, globalModel;
      var dashboardTemplate;
      var target = $("#free-board-area");
      var JSONparse = function(str) {
        var json;
        try {
          json = JSON.parse(str);
        } catch(e) {
          json = {};
        } finally {
          return json;
        }
      };
      var getTitle = function(str) {
        switch(str) {
          case "service":
            return "服务视图管理";
          case "editor":
            return "分析视图编辑器";
          default:
            return "仪表板编辑器";
        }
      };
      scope.cachedBackwardJSON = [];
      scope.cachedForwardJSON = [];
      scope.instance = freeboardBaseService(target);
      scope.toolbarListMap = toolbarListService;
      scope.tempResClick = function(resource) {
        var params = JSON.stringify({
          modelId: resource.modelId,
          resourceId: resource.id
        });
        window.open("index.html#/template/device/dashboard/" + params, "_self");
      };
      scope.JSONParse = function(str) {
        if(typeof str == "object") {
          return str;
        } else if(typeof str == "string") {
          return JSON.parse(str);
        } else {
          return {};
        }
      };
      scope.backTemp = function() {
        var params = JSON.stringify({
          modelId: scope.tempResource.modelId
        });
        window.open("index.html#/template/model/dashboard/" + params, "_self");
      };
      scope.$on("$routeChangeSuccess", function() {
        rootScope.viewmode = route.current.$$route.originalPath.split("/")[1];
        scope.viewtype = route.current.$$route.originalPath.split("/")[2];
        rootScope.editorTitle = getTitle(rootScope.viewmode);
        if(rootScope.viewmode == 'editor') {
          var callbackFun;
          CHARTDATA.defer = function(callback) {
            callbackFun = callback;
          };
          Info.get('../localdb/editor.json', function(info) {
            CHARTDATA = info;
            if($$.isFunction(callbackFun)) {
              callbackFun();
            }
          });
        }
      });
      scope.$on("viewChanged", function(event) {
        if(!scope.cachedBackwardJSON) {
          scope.cachedBackwardJSON = [];
        }
        scope.cachedBackwardJSON.push(scope.editData.$clone());
        if(scope.cachedBackwardJSON.length > 5) {
          scope.cachedBackwardJSON.shift();
        }
        //growl.success("view changed!!");
      });
      rootScope.backward = function() {
        console.log("backbackback");
        if(scope.cachedBackwardJSON.length > 0) {
          scope.cachedForwardJSON.push(scope.editData.$clone());
          if(scope.cachedForwardJSON.length > 5) {
            scope.cachedForwardJSON.shift();
          }
          var last = scope.cachedBackwardJSON[scope.cachedBackwardJSON.length - 1];
          scope.editData = last;
          scope.cachedBackwardJSON.pop();
          renderDataFn(false);
        }
      };
      rootScope.forward = function() {
        if(scope.cachedForwardJSON.length > 0) {
          scope.cachedBackwardJSON.push(scope.editData.$clone());
          if(scope.cachedBackwardJSON.length > 5) {
            scope.cachedBackwardJSON.shift();
          }
          var last = scope.cachedForwardJSON[scope.cachedForwardJSON.length - 1];
          scope.editData = last;
          scope.cachedForwardJSON.pop();
          renderDataFn(false);
        }
      };
      var modelId, projectId, resourceId;
      var kqiModelId = routeParams.kqiModelId;
      var solutionId = routeParams.solutionId;
      var serviceViewId = routeParams.serviceViewId;
      var flag = routeParams.flag;
      var viewId = routeParams.viewId;
      scope.templateType = routeParams.type;
      var tempParams = routeParams.params;
      if(tempParams) {
        tempParams = decodeURIComponent(tempParams);
        tempParams = JSON.parse(tempParams);
        modelId = tempParams.modelId;
        projectId = tempParams.projectId;
        resourceId = tempParams.resourceId;
      }
      if(modelId) {
        resourceUIService.getResourceByModelId(modelId, function(event) {
          if(event.code == 0) {
            scope.resources = event.data;
          }
        });
      }
      if(resourceId) {
        resourceUIService.getResourceById(resourceId, function(event) {
          if(event.code == 0) {
            scope.tempResource = event.data;
          }
        });
      }
      var path = "../localdb/freeboard.json";
      var exit = function() {
        window.open("", "_self").close();
        /**
                 if(flag == 'home') {
          window.location.href = "../app-oc/index.html#/dashboard";
        } else if(flag == 'facility') {
          window.location.href = "../app-oc/index.html#/facility";
        } else if(flag == 'resource_type') {
          window.location.href = "../app-oc/index.html#/resource_type";
        } else if(flag == 'editor') {
          window.location.href = "../app-oc/index.html#/views/designView";
        } else if(flag == 'dashboard') {
          window.location.href = "../app-oc/index.html#/views/dashboard";
        } else if(flag == 'solutionView') {
          window.location.href = "../app-ac/index.html#/myView";
        } else if(flag == 'scenter') {
          window.location.href = "../app-sc/index_freeboard.html#/freeboard/index";
        } else if(flag == 'servicelist') {
          window.location.href = "../app-oc/index.html#/service/management/service";
        } else if(flag == 'kqiModel') {
          window.location.href = "../app-oc/index.html#/specialist/input/" + kqiModelId + "/3";
        } else if(flag == 'freestyle') {
          window.location.href = "../app-free-style/index.html";
        } else {
          window.location.href = "../app-oc/index.html#/resource_type";
        }*/
      };
      rootScope.dirty = (viewId == undefined && modelId == undefined && projectId == undefined && resourceId == undefined);
      loadedView = {
        layout: {
          id: $randomString(32),
          type: 'column',
          children: [],
          col: 12
        },
        setting: {
          "showNavi": false,
          "style": {
            "padding": "5px"
          }
        }
      };
      var reconstruct = function(target, callback) {
        target.traveseByChild(function(element) {
          if(element.onChange) {
            element.onChange = eval(element.onChange)
          }
          if(element.type == "map") {
            element.source = "BMAP";
          }
          if(element.type == "mapchart") {
            element.source = "MAP";
          }
          if(element.source) {
            var source = element.source;
            if(typeof source == "object") {
              source = element.source = "LISTTABLE";
            }
            var sourceMode = freeBoardValue[source].$clone();
            var loop = function(attr, val) {
              var sample = ["data", "parameters", "advance"];
              if(sample.indexOf(attr) != -1) {
                var loop = function(at, val) {
                  if(element.$attr(attr + "/" + at) == undefined) {
                    element.$attr(attr + "/" + at, val);
                  }
                };
                for(var i in val) {
                  loop(i, val[i])
                }
              } else {
                if(element.$attr(attr) == undefined) {
                  element.$attr(attr, val)
                }
              }
            };
            for(var i in sourceMode) {
              loop(i, sourceMode[i])
            }
            if(element.source == "TOPO") {
              var viewId = element.viewId;
              viewFlexService.getViewById(viewId, function(event) {
                if(event.code == 0 && event.data) {
                  var json = JSON.parse(event.data.content);
                  element.JSON = json;
                }
              })
            }
          }
          element.id = $randomString(32);
        });
        replaceCiKpi.call(target, function() {
          timeout(function() {
            if(typeof callback == "function") {
              callback()
            } else {
              renderDataFn();
            }
          })
        });
      };

      function toolbar(data) {
        this.$clone(data);
      }

      toolbar.prototype.click = function() {
        scope.toolbarDetail = this.$clone();
        scope.toolbarDetail.sub = scope.toolbarDetail.sub.map(function(element) {
          return new subtoolbar(element);
        })
      };

      function subtoolbar(data) {
        this.$clone(data);
      }

      subtoolbar.prototype.click = function() {
        var cur = this;
        var source = this.source;
        var json = window.freeBoardValue[source];
        var templateInx = this.template;
        var getTemplate = function(inx) {
          return json.template[inx];
        };
        var setTemplate = function(template) {
          json.echart = template.echart;
          json.style = template.style;
        };
        var seleteTemplate = getTemplate(templateInx);
        setTemplate(seleteTemplate);
        json.id = $randomString(32);
        scope.toolbarDetail = undefined;
        var source = json.source;
        if(source) {
          json.label = window.freeBoardValue[source].label;
        }
        var rs = remapData(json);
        scope.$broadcast("viewChanged");
        curLayout().layout.children.push(rs);
        renderDataFn(false);
        rootScope.dirty = true;
      };
      saveToManagement = routeParams.saveToManagement;

      function initData() {
        this.traverse(function(attr, element) {
          if(element.hasOwnProperty("__onChange__")) {
            element.onChange = eval(element["__onChange__"]);
            element.oldValue = element.value;
          }
        });
      }

      function renderDataFn(bool) {
        if(scope.tabIndex == undefined) {
          scope.instance.setMode(bool);
          scope.instance.setButtonDisable();
          scope.instance.renderLayout(scope.editData);
          //scope.editData.renderBoard(bool);
        } else {
          var clone = {
            layout: scope.editData.groups[scope.tabIndex].layout,
            setting: scope.editData.setting
          };
          scope.instance.setMode(bool);
          scope.instance.setButtonDisable();
          scope.instance.renderLayout(clone);
          //clone.renderBoard(bool);
        }
      }

      function anchorChange() {
        var value = this.value,
          oldValue = this.oldValue;
        curLayout().layout.traveseByChild(function(element) {
          if(element.$attr("attributes/linkData/value") == oldValue) {
            element.$attr("attributes/linkData/value", value)
          }
        });
      }

      function setting(data) {
        this.$clone(data);
      }

      setting.prototype.close = function() {
        if(scope.firstCreate == true) {
          exit();
        } else {
          delete scope.setting;
        }
      };
      setting.prototype.save = function() {
        rootScope.dirty = true;
        var json = JSONparse(scope.setting.data);
        json.theme = scope.setting.theme;
        scope.editData.setting = JSON.stringify(json, null, 2);
        scope.firstCreate = false;
        delete scope.setting;
        if(scope.editData.groups == undefined) {
          var target = scope.editData.layout;
          replaceCiKpi.call(target, function() {
            timeout(function() {
              if(scope.mode == 'EDIT') {
                renderDataFn();
              } else {
                renderDataFn(true)
              }
            });
          });
        } else {
          var loop = function(index, item) {
            var target = item.layout,
              callback;
            if(index == scope.tabIndex) {
              callback = function() {
                timeout(function() {
                  if(scope.mode == 'EDIT') {
                    renderDataFn();
                  } else {
                    renderDataFn(true)
                  }
                })
              }
            } else {
              callback = function() {};
            }
            replaceCiKpi.call(target, callback);
          };
          for(var i in scope.editData.groups) {
            loop(i, scope.editData.groups[i]);
          }
        }
      };
      groupModels = [];
      Info.get(path, function(info) {
        window.freeBoardValue = info.freeBoardValue;
        var inx = 0;
        window.template = info.templates.map(function(element) {
          element.id = inx;
          inx++;
          return element;
        });
        initData.call(freeBoardValue);
        rootScope.settingDashboard = function() {
          if(scope.editData.setting == undefined) {
            scope.editData.setting = {
              padding: 15,
            }
          }
          console.log(scope.editData.setting);
          scope.setting = new setting({
            theme: JSONparse(scope.editData.setting).theme || "default",
            data: scope.editData.setting
          });
        };
        rootScope.previewDashboard = function() {
          if(viewId) {
            window.open("../app-free-style/index.html#/" + viewId, "_blank");
          } else {
            growl.warning("保存之后才可以预览！您可以进入预览模式预览！", {});
          }
        };
        rootScope.helpFun = function() {
          window.open("../app-free-style/index.html#/help", "_blank");
        };
        if(rootScope.viewmode == 'editor') {
          scope.toolBarList = toolBarList.map(function(element) {
            return new toolbar(element);
          });
        }
        scope.titleComposory = true;
        if(solutionId && serviceViewId) {
          scope.titleComposory = false;
          solutionUIService.getManageViewContent(solutionId, function(event) {
            if(event.code == "0") {

            }
          });
        } else {
          var types = ["dashboard", "designView", "configure"];
          var typeVars = ["dashboardViews", "designView", "configure"];
          var start = 0;
          var finished = function() {
            if(rootScope.viewmode == 'freeboard' || rootScope.viewmode == 'template') {
              allGraphViews = scope.dashboardViews;
            } else if(rootScope.viewmode == 'editor' || rootScope.viewmode == 'specialist') {
              allGraphViews = scope.designView
            }
            allViews = allGraphViews.filter(function(view) {
              return view.viewId != viewId
            });
            /**
                         window.specialistView = allGraphViews.filter(function(element){
                var fd = false;
                if(element.template){
                  fd = element.template.resourceType == "kqiModel";
                }
                return fd;
              });*/
            window.specialistView = [];

            kqiManagerUIService.getKqiModels(function(event) {
              if(event.code == 0) {
                window.specialistView = event.data.filter(function(elem) {
                  var some = allGraphViews.some(function(view) {
                    var fd = false;
                    if(view.template) {
                      if(view.template.resourceType == "kqiModel") {
                        fd = view.template.resourceId == elem.id;
                      }
                    }
                    return fd;
                  });
                  return some;
                }).map(function(elem) {
                  var find = allGraphViews.find(function(view) {
                    var fd = false;
                    if(view.template) {
                      if(view.template.resourceType == "kqiModel") {
                        fd = view.template.resourceId == elem.id;
                      }
                    }
                    return fd;
                  });
                  elem.url = JSON.parse(elem.viewContent).thumb;
                  elem.viewId = find.viewId;
                  return elem;
                })
              }
            });
            /**
                         for(var i in window.specialistView){
                var kqiModelId = window.specialistView[i].template.resourceId;
                (function(inx, tg){
                  kqiManagerUIService.getKqiModelById(kqiModelId, function(event){
                    if(event.code == "0"){
                      if(event.data){
                        var json = JSON.parse(event.data.viewContent);
                        window.specialistView[inx].label = event.data.label;
                        window.specialistView[inx].url = json.thumb;
                      } else {
                        console.log(tg);
                        window.specialistView.$remove(function(idex, elem){
                          return tg == elem;
                        })
                      };
                    }
                  })
                })(i, window.specialistView[i]);
              };*/
            var contiFn = function() {
              scope.globalModel = {
                open: false,
                click: function() {
                  var self = this;
                  this.open = !this.open;
                  var click = function(event) {
                    scope.$apply(function() {
                      self.open = false;
                    })
                  };
                  $("body").on("click.whole", click)
                },
                subclick: function(model) {
                  this.open = !this.open;
                  this.model = model;
                }
              };
              init(function() {
                if(solutionId && serviceViewId) {
                  scope.titleComposory = false;
                  solutionUIService.getManageViewContent(solutionId, getDashboardSolution);
                } else {
                  if(scope.viewmode == "template") {
                    callback();
                    if(currentView) {
                      scope.viewId = currentView.viewId;
                    }
                  } else if(scope.viewmode == "specialist") {
                    callback();
                    if(currentView) {
                      scope.viewId = currentView.viewId;
                    }
                  } else {
                    if(viewId) {
                      scope.viewId = viewId;
                      callback();
                    } else {
                      callbackTopo();
                    }
                  }
                }
              });
            };
            var find;
            var viewFound = function(find) {
              if(find) {
                viewFlexService.getViewById(find.viewId, function(event) {
                  if(event.code == 0) {
                    currentView = event.data;
                    contiFn();
                  }
                });
              } else {
                contiFn();
              }
            };
            configUIService.getConfigsByGroupName("Dashboard_template", function(event) {
              if(event.code) {
                dashboardTemplate = event.data;
                if(scope.viewmode == "template") {
                  viewFlexService.getDefaultView(modelId, function(event) {
                    if(event.code == 0) {
                      var allDefaultViews = event.data;
                      find = allDefaultViews.find(function(elem) {
                        if(elem.template) {
                          if(elem.template.keyValue == "default") {
                            if(scope.templateType == "model") {
                              return elem.template.resourceId == modelId;
                            } else if(scope.templateType == "project") {
                              return elem.template.resourceId == projectId;
                            } else if(scope.templateType == "device") {
                              return elem.template.resourceId == resourceId;
                            } else {
                              return false;
                            }
                          } else {
                            return false;
                          }
                        } else {
                          return false;
                        }
                      });
                      viewFound(find);
                    }
                  })
                } else if(scope.viewmode == "specialist") {
                  find = allGraphViews.find(function(element) {
                    var fd = false;
                    if(element.template) {
                      if(element.template.resourceType == "kqiModel") {
                        fd = element.template.resourceId == kqiModelId;
                      }
                    }
                    return fd;
                  });
                  viewFound(find);
                } else {
                  find = allGraphViews.find(function(element) {
                    return element.viewId == viewId;
                  });
                  viewFound(find);
                }
              }
            });
          };
          var loop = function(inx) {
            if(inx < types.length) {
              var viewtype = types[inx];
              viewFlexService.getManagedViewsByTypeAndRole(viewtype, function(event) {
                if(event.code == 0) {
                  scope[typeVars[inx]] = event.data;
                }
                loop(inx + 1);
              });
            } else {
              finished();
            }
          };
          loop(start);
        }

        function callback() {
          var topo = scope.configure.map(function(element) {
            return {
              label: element.viewTitle,
              type: "topo",
              render: "text",
              viewId: element.viewId,
              $CLASS: "item"
            }
          });
          var dview = scope.dashboardViews.map(function(element) {
            return {
              label: element.viewTitle,
              type: "dashboard",
              render: "text",
              viewId: element.viewId,
              $CLASS: "item"
            }
          });
          var desview = scope.designView.map(function(element) {
            return {
              label: element.viewTitle,
              type: "designView",
              render: "text",
              viewId: element.viewId,
              $CLASS: "item"
            }
          });
          var map = dashboardTemplate.map(function(elem) {
            var json = JSON.parse(elem.value);
            var type = "template_" + elem.id;
            json.type = type;
            json.label = elem.label;
            json.$CLASS = "item";
            json.render = "edit";
            //toolbarListService[1].sub.push(json)
            return json;
          });
          Array.prototype.push.apply(scope.toolbarListMap[1].sub, map);
          scope.toolbarListMap[2].sub[0].sub = dview;
          scope.toolbarListMap[2].sub[0].sub = dview;
          scope.toolbarListMap[2].sub[1].sub = topo;
          scope.toolbarListMap[2].sub[2].sub = desview;
          scope.toolbarListMap = renderToolbar(scope.toolbarListMap);
          if(currentView) {
            scope.viewTitle = currentView.viewTitle;
            rootScope.editorSubTitle = "[" + scope.viewTitle + "]";
            scope.description = currentView.description;
            scope.titleChange();
            // if (viewId) {
            //   rootScope.dirty = true;
            // } else {
            //   rootScope.dirty = false;
            // }
            getDashboard();
          } else {
            rootScope.editorSubTitle = "[新建视图]"
          }
        }

        function callbackTopo() {
          scope.viewTitle = '';
          scope.titleChange();
          /**
                     scope.dashboardViews = allGraphViews.filter(function(element){
              if(element.viewType == "dashboard")
              {
                var dt = JSON.parse(element.content);
                element.JSON = dt;
              }
              return element.viewType == "dashboard";
            });
                     scope.configure = allGraphViews.filter(function(element){
              if(element.viewType == "configure")
              {
                var dt = JSON.parse(element.content);
                element.JSON = dt;
              }
              return element.viewType == "configure";
            });
                     */
          var topo = scope.configure.map(function(element) {
            return {
              label: element.viewTitle,
              type: "topo",
              render: "text",
              viewId: element.viewId,
              $CLASS: "item"
            }
          });
          var dview = scope.dashboardViews.map(function(element) {
            return {
              label: element.viewTitle,
              type: "dashboard",
              render: "text",
              viewId: element.viewId,
              $CLASS: "item"
            }
          });
          var desview = scope.designView.map(function(element) {
            return {
              label: element.viewTitle,
              type: "designView",
              render: "text",
              viewId: element.viewId,
              $CLASS: "item"
            }
          });
          var map = dashboardTemplate.map(function(elem) {
            var json = JSON.parse(elem.value);
            var type = "template_" + elem.id;
            json.type = type;
            json.label = elem.label;
            json.$CLASS = "item";
            json.render = "text";
            //toolbarListService[1].sub.push(json)
            return json;
          });
          scope.toolbarListMap[2].sub[0].sub = dview;
          scope.toolbarListMap[2].sub[1].sub = topo;
          scope.toolbarListMap[2].sub[2].sub = desview;
          scope.toolbarListMap = renderToolbar(scope.toolbarListMap);
        }
      });
      /**
             serviceCenterService.groupModels.getAll().then(function success(data) {
        groupModels = data.map(function (element) {
        return {
          value: element.id,
          label: element.label
        }
      });
      }, function error(data){

      });*/

      function folder() {}
      folder.prototype.click = function() {
        var tmp = this.fold;
        for(var i in this.parent) {
          this.parent[i].fold = true;
        }
        this.fold = !tmp;
      };
      folder.prototype.fold = true;

      function item() {}
      item.prototype.click = function() {
        var tmp = this.show;
        if(this.render != "text" || this.message) {
          for(var i in this.parent) {
            this.parent[i].show = false;
          }
          this.show = !tmp;
        }
      };
      item.prototype.show = false;
      scope.removeConfigClick = function(item) {
        console.log(item);
        var id = item.type.split("template_")[1];
        var inx = scope.toolbarListMap[1].sub.indexOf(item);
        scope.toolbarListMap[1].sub.splice(inx, 1);
        configUIService.deleteConfig(id, function(event) {
          if(event.code == 0) {

          }
        })
      };

      function renderToolbar(data) {
        var rs;
        if(typeof data == 'object' && data != null) {
          rs = new data.constructor();
        } else {
          rs = data;
        }
        traverse(rs, data);

        function traverse(target, data) {
          for(var i in data) {
            if(typeof data[i] == 'object' && data[i] != null) {
              var constructor;
              if(data[i].hasOwnProperty('$CLASS')) {
                constructor = eval(data[i].$CLASS);
              } else {
                constructor = data[i].constructor;
              }
              target[i] = new constructor();
              target[i].parent = target;
              Object.defineProperty(target[i], "parent", {
                enumerable: false
              });
              traverse(target[i], data[i]);
            } else {
              if(i != '$CLASS') {
                target[i] = data[i];
              }
            }
          }
        }

        return rs;
      }

      function linkOnchange() {
        this.parent.color.value = "#3c8dbc";
      }

      function remapData(data) {
        return data.$remapByChild(function(element) {
          var source = element.source;
          if(source) {
            if(window.freeBoardValue[source]) {
              element.label = window.freeBoardValue[source].label;
            } else {
              throw new Error(source + "组件不存在")
            }

          }
          var rs = new commonMethodService(element);
          rs.setRootTarget(scope.editData);
          return rs;
        });
      }

      function getDashboard() {
        if(currentView != undefined) {
          var clone, setting, dt = JSON.parse(currentView.content);
          if(currentView.viewType == 'dashboard' || currentView.viewType == 'designView' || currentView.viewType == 'serviceView') {
            setting = dt.setting;
            if(dt.groups == undefined) {
              clone = remapData(dt.data || dt.layout);
              scope.editData = {
                layout: clone,
                setting: setting
              };
            } else {
              scope.editData = dt.$clone();
              for(var i in scope.editData.groups) {
                scope.editData.groups[i].layout = remapData(scope.editData.groups[i].layout);
              }
              scope.tabIndex = 0;
            }
          } else {
            if(dt.rows) {
              if(dt.rows.length == 3) {
                clone = remapData(machineDashboard.data.$clone());
                setting = machineDashboard.setting.$clone();
              } else {
                clone = remapData(standardDashboard.data.$clone());
                setting = standardDashboard.setting.$clone();
              }
            } else {
              clone = remapData(standardDashboard.data.$clone());
              setting = standardDashboard.setting.$clone();
              scope.editData = {
                layout: clone,
                setting: setting
              };
            }
          }
        } else {
          clone = remapData(standardDashboard.data.$clone());
          setting = standardDashboard.setting.$clone();
          scope.editData = {
            layout: clone,
            setting: setting
          };
        }
        loadedView = scope.editData.$clone();
        if(scope.tabIndex == undefined) {
          reconstruct(scope.editData.layout);
        } else {
          var defers = [];
          for(var i in scope.editData.groups) {
            var wait = function(index, tg) {
              var df = q.defer();
              reconstruct(tg.layout, function() {
                df.resolve("success")
              });
              return df.promise;
            };
            defers.push(wait(i, scope.editData.groups[i]));
          }
          q.all(defers).then(function() {
            renderDataFn();
          })
        }
      }

      function getDashboardSolution(event) {
        if(event.code) {
          if(event.data != null) {
            var clone, dt = JSON.parse(event.data);
            if(dt.version == 'V_2') {
              currentView = event.data;
              clone = dt;
            } else {
              if(serviceViewId == 201) {
                clone = machineDashboard.$clone();
              } else {
                clone = standardDashboard.$clone();
              }
            }
          } else {
            if(serviceViewId == 201) {
              clone = machineDashboard.$clone();
            } else {
              clone = standardDashboard.$clone();
            }
          }
          scope.editData = {
            layout: clone.data,
            setting: clone.setting
          };
          loadedView = {
            layout: clone.data,
            setting: clone.setting
          }.$clone();
          var catchBind = {};
          var target = curLayout().layout;
          reconstruct(target);
        }
      }

      Array.prototype.remove = function(elem) {
        var find = false;
        for(var i in this) {
          if(this[i] == elem) {
            find = true;
          }
          if(find) {
            if(i < this.length - 1) {
              this[i] = this[parseInt(i) + 1]
            } else {
              delete this[i]
            }
          }
        }
        if(find) {
          this.length--;
        }
      };
      Object.defineProperty(Array.prototype, "remove", {
        enumerable: false
      });

      function modelSelector(data) {
        if(typeof data == 'object' && data != null) {
          this.$clone(data);
        }
      }
      modelSelector.prototype.change = function() {
        var modelId = this.id;
        var defer = q.defer();
        var defera = q.defer();
        var deferb = q.defer();
        scope.unitFilter = "";
        scope.unitFilterDisabled = false;
        serviceCenterService.kpis.getBymodelId(modelId).then(function success(data) {
          scope.kpis = data.map(function(elem) {
            if(typeof elem.unit == 'string' && elem.unit != '') {
              /** 此处一定要获取KPI列表的CLON，因为如果是获取原始列表，修改之后对象的值也会跟着修改 */
              return elem.$clone();
            } else {
              elem.unit = '无';
              return elem.$clone();
            }
          });
          scope.kpiUnits = scope.kpis.reduce(function(prev, next) {
            var some = prev.some(function(elem) {
              return elem.value == next.unit;
            });
            if(!some) {
              prev.push({
                label: next.unit,
                value: next.unit
              })
            }
            return prev;
          }, [{
            label: 'all',
            value: ''
          }]);
          defera.resolve("success");
        }, function error(err) {
          if(err == 'data back is empty!!!') {
            growl.warning("您通过模型ID[", modelId, "]并为获取任何kpi信息！");
          }
        });
        console.log("你正在通过 [", modelId, "]模型ID获取设备列表！");
        serviceCenterService.resources.getBymodelId(modelId).then(function success(data) {
          scope.resources = data.map(function(element) {
            return element.$clone();
          });
          deferb.resolve("success");
        }, function error(err) {
          if(err == 'data back is empty!!!') {
            growl.warning("您通过模型ID[", modelId, "]并为获取任何设备信息！");
          }
        });
        q.all([defera.promise, deferb.promise]).then(function(event) {
          defer.resolve("success");
        });
        return defer.promise;
      };
      scope.unitFilter = "";
      scope.unitFilterDisabled = false;
      scope.onTabClick = onTabClick;

      function onTabClick(event, ui, target, parent) {
        scope.dialog = {
          title: {
            label: "标签信息"
          },
          input: [{
            "label": "修改标签名称",
            "value": target.tabName,
            "composory": true,
            "data": "tabName",
            "type": "input",
            maxlength: 32,
            "events": {
              "change": function(item) {

              }
            }
          }, {
            "label": "设为启始标签",
            "value": target.default,
            "composory": false,
            "data": "default",
            "type": "checkbox",
            "maxlength": 32,
            "onChange": function(item) {
              if(item.value == false) {
                item.value = true;
              }
            }
          }],
          fnlist: [{
            label: "确定",
            icon: "btn btn-primary",
            fn: function() {
              rootScope.dirty = true;
              scope.$broadcast("viewChanged");
              var dft = scope.dialog.input[1].value;
              if(dft == true) {
                for(var i in parent.children) {
                  parent.children[i].default = false;
                }
                var inx = parent.children.indexOf(target);
                parent.tabInx = inx;
              }
              target.tabName = scope.dialog.input[0].value;
              target.default = dft;
              timeout(function() {
                renderDataFn();
              });
              ngDialog.close();
            }
          }, {
            label: '取消',
            icon: "btn btn-default",
            fn: function() {
              ngDialog.close();
            }
          }]
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      }
      rootScope.clearDashboard = function() {
        rootScope.dirty = true;
        scope.$broadcast("viewChanged");
        delete scope.tabIndex;
        scope.editData = {
          layout: {
            id: $randomString(32),
            type: 'column',
            children: [],
            col: 12
          },
          setting: {
            "showNavi": false,
            "style": {
              "padding": "5px"
            }
          }
        };
        timeout(function() {
          renderDataFn();
        });
      };
      rootScope.resetDashboard = function() {
        rootScope.dirty = true;
        scope.$broadcast("viewChanged");
        scope.editData = loadedView.$clone();
        var target = curLayout().layout;
        reconstruct(target);
        timeout(function() {
          if(status == "PREV") {
            renderDataFn(true);
            //scope.editData.renderBoard(true);
          } else {
            renderDataFn();
            //scope.editData.renderBoard();
          }
        });
      };
      rootScope.panelCancel = panelCancel;

      function panelCancel() {
        scope.unitFilter = "";
        scope.unitFilterDisabled = false;
        scope.dataPanel = undefined;
        scope.editPanel = undefined;
        scope.resources = undefined;
        scope.kpis = undefined;
      }

      scope.switchToData = function() {
        var temp = scope.editPanel;
        scope.editPanel = undefined;
        timeout(function() {
          dataPanelShow(temp);
        }, 400);
        rootScope.panelClose = panelCloseData;

        function panelCloseData() {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
          var temp = scope.dataPanel;
          delete scope.dataPanel;
          scope.selectData.$extension(temp);
          //scope.editData.renderBoard();
          renderDataFn();
          timeout(function() {
            var rs = [{
                label: '不使用链接',
                value: 'none'
              }],
              rsTarget = [];
            scope.editPanel = scope.selectData.$clone();
            var filter = scope.resources.filter(function(element) {
              return element.checked == true;
            });
            scope.editPanel.data.resource = filter;
            if(scope.editPanel.data.resource && scope.editPanel.data.kpi) {
              for(var i in scope.editPanel.attributes) {
                if(scope.editPanel.attributes[i].data) {
                  if(scope.editPanel.attributes[i].data.value == 'none') {
                    scope.editPanel.attributes[i].data.value = scope.editPanel.attributes[i].data.option[1].value;
                  }
                }
              }
              if(scope.editPanel.valueGroup) {
                scope.editPanel.valueGroup.data.value = "value";
              }
            } else {
              for(var i in scope.editPanel.attributes) {
                if(scope.editPanel.attributes[i].data) {
                  if(scope.editPanel.attributes[i].data.value != 'none') {
                    scope.editPanel.attributes[i].data.value = 'none';
                  }
                }
              }
              if(scope.editPanel.valueGroup) {
                scope.editPanel.valueGroup.data.value = "custom";
              }
            }
            rootScope.panelClose = function() {
              scope.selectData.$extension(scope.editPanel);
              curLayout().layout.traveseByChild(function(element) {
                if(element.$attr("attributes/anchor/applied") == true) {
                  var val = element.$attr("attributes/anchor/value");
                  if(typeof val == 'string' && val != '') {
                    rs.push({
                      label: element.$attr("attributes/anchor/value"),
                      value: element.$attr("attributes/anchor/value")
                    });
                    rsTarget[element.$attr("attributes/anchor/value")] = element.data;
                  }
                }
              });
              curLayout().layout.traveseByChild(function(element) {
                var link = element.$attr("attributes/linkData/value");
                if(link != 'none' && link != undefined) {
                  element.data = rsTarget[link];
                  if(element.$attr("data/resource") && element.$attr("data/kpi")) {
                    for(var i in element.attributes) {
                      if(element.attributes[i].data) {
                        if(element.attributes[i].data.value == 'none') {
                          element.attributes[i].data.value = element.attributes[i].data.option[1].value;
                        }
                      }
                    }
                    if(element.valueGroup) {
                      element.valueGroup.data.value = "value";
                    }
                  } else {
                    for(var i in element.attributes) {
                      if(element.attributes[i].data) {
                        if(element.attributes[i].data.value != 'none') {
                          element.attributes[i].data.value = 'none';
                        }

                      }
                    }
                    if(element.valueGroup) {
                      element.valueGroup.data.value = "custom";
                    }
                  }
                  element.data = rsTarget[link];
                }
              });
              scope.anchors = rs;
              renderDataFn();
              //scope.editData.renderBoard();
              scope.unitFilter = "";
              scope.unitFilterDisabled = false;
              scope.dataPanel = undefined;
              scope.editPanel = undefined;
              scope.resources = undefined;
              scope.kpis = undefined;
            };
          }, 400);
        }
      };

      function dataPanelShow(temp) {
        scope.dataPanel = temp.$clone();
        scope.dataPanel.data.model = scope.allModels.find(function(element) {
          return element.id == scope.dataPanel.data.model.id;
        });
        scope.dataPanel.data.model.change().then(function success() {
          for(var i in scope.resources) {
            var some = false;
            if(scope.dataPanel.data.resource) {
              some = scope.dataPanel.data.resource.some(function(elem) {
                return scope.resources[i].id == elem.id;
              });
            }
            scope.resources[i].checked = some;
          }
          for(var i in scope.kpis) {
            var find;
            if(scope.dataPanel.data.kpi) {
              find = scope.dataPanel.data.kpi.find(function(elem) {
                return scope.kpis[i].id == elem.id;
              });
            }
            if(find) {
              scope.unitFilter = find.unit;
              scope.unitFilterDisabled = true;
            }
            scope.kpis[i].checked = (find != undefined);
          }
        });
      }
      scope.switchToEdit = function() {
        var temp = scope.dataPanel;
        scope.dataPanel = undefined;
        timeout(function() {
          scope.editPanel = temp;
        }, 400);
      };
      scope.groupAdd = function(list) {
        var clone = list[0].$clone();
        var value = [];
        for(var i in clone.attributes.value.value.split(",")) {
          value.push(parseInt(Math.random() * 100))
        }
        clone.attributes.value.value = value.toString();
        list.push(clone);
        for(var i in list) {
          delete list[i]['$$hashKey'];
          list[i].id = i;
        }
      };
      scope.groupRemove = function(target, list) {
        if(list.length > 1) {
          list.$remove(function(index, element) {
            return target.id == element.id;
          });
          for(var i in list) {
            list[i].id = i;
          }
        }
      };
      scope.dataTypeChange = function(data, editPanel) {
        if(data.value != "none") {
          if(editPanel.data.resource == undefined || editPanel.data.kpi == undefined) {
            var temp = scope.editPanel;
            scope.editPanel = undefined;
            timeout(function() {
              dataPanelShow(temp);
            }, 400);
            rootScope.panelClose = panelCloseData;
          }
        }

        function panelCloseData() {
          if(scope.dataPanel.data.resource && scope.dataPanel.data.kpi) {
            var temp = scope.dataPanel;
            scope.selectData.$clone(temp);
            scope.dataPanel = undefined;
            renderDataFn();
            //scope.editData.renderBoard();
            timeout(function() {
              rootScope.panelClose = function() {
                scope.editPanel.$clone(scope.selectData);
                scope.unitFilter = "";
                scope.unitFilterDisabled = false;
                scope.dataPanel = undefined;
                scope.editPanel = undefined;
                scope.resources = undefined;
                scope.kpis = undefined;
              };
            }, 400);
          } else {
            data.value = "none";
          }
          scope.unitFilter = "";
          scope.unitFilterDisabled = false;
          scope.dataPanel = undefined;
          scope.editPanel = undefined;
          scope.resources = undefined;
          scope.kpis = undefined;
        }
      };
      rootScope.exitDashboard = function() {
        if(rootScope.dirty) {
          var fnlist = [{
            label: '不保存',
            icon: 'btn btn-default pull-left',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function() {
              exit();
            }
          }, {
            label: '取消',
            icon: 'btn btn-cancel',
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function() {
              scope.dialogBox = undefined;
            }
          }, {
            label: '保存',
            icon: 'btn btn-success',
            disabled: scope.inputCheck.correct != true,
            style: {
              width: '50%',
              'border-radius': 0,
              'font-size': '18px',
              'font-weight': 'bold',
              'padding': 10
            },
            fn: function() {
              rootScope.saveDashboard(exit);
            }
          }];
          scope.dialogBox = {
            title: {
              label: '退出编辑器'
            },
            description: {
              label: '尚有未保存的修改，是否保存？'
            },
            fnlist: fnlist
          };
        } else {
          exit();
        }
      };
      scope.titleChange = function() {
        if(allViews) {
          rootScope.inputCheck = check();
        } else {
          viewFlexService.getAllMyViews(function(event) {
            if(event.code == '0') {
              if(rootScope.viewmode == 'freeboard') {
                allViews = event.data.filter(function(element) {
                  return element.viewType == "dashboard" && element.viewId != viewId;
                });
                for(var i in allViews) {
                  var dt = JSON.parse(allViews[i].content);
                  allViews[i].JSON = dt;
                }
              } else {
                allViews = event.data.filter(function(element) {
                  return element.viewType == "designView" && element.viewId != viewId;
                });
                for(var i in allViews) {
                  var dt = JSON.parse(allViews[i].content);
                  allViews[i].JSON = dt;
                }
              }
              rootScope.inputCheck = check();
            }
          });
        }

        function check() {
          var find = allViews.filter(function(element) {
            var rs;
            if(currentView) {
              rs = element.viewTitle == scope.viewTitle && element.viewTitle != currentView.viewTitle;
            } else {
              rs = element.viewTitle == scope.viewTitle;
            }
            return rs;
          });
          var num = $$.switchToNumber(scope['viewTitle'].length);
          if(scope.titleComposory) {
            if(num == 0) {
              return {
                correct: false,
                icon: 'glyphicon-warning-sign',
                msg: '不可为空',
                style: {
                  color: 'red'
                }
              }
            } else if(num > 32) {
              return {
                correct: false,
                icon: 'glyphicon-remove',
                msg: '不可超过32字符',
                style: {
                  color: 'red'
                }
              }
            } else if(find.length > 0) {
              return {
                correct: false,
                icon: 'glyphicon-remove',
                msg: '错误 : 该视图名已被占用',
                style: {
                  color: 'red'
                }
              }
            } else {
              return {
                correct: true,
                icon: 'glyphicon-ok',
                msg: '正确',
                style: {
                  color: 'green'
                }
              }
            }
          } else {
            return {
              correct: true,
              icon: 'glyphicon-ok',
              msg: '正确',
              style: {
                color: 'green'
              }
            }
          }
        }
      };

      function refineDataStructure() {
        this.traveseByChild(function(element) {
          delete element.id;
          if(element.$$hashKey) {
            delete element.$$hashKey;
          }
          if(element.JSON) {
            delete element.JSON;
          }
          if(element.type == "injector") {
            element.children = [];
          }
          if(element.hasOwnProperty("tabInx")) {
            delete element.tabInx;
          }
          if(element.hasOwnProperty("template")) {
            delete element.template;
          }
          if(element.hasOwnProperty("$index")) {
            delete element.$index;
          }
          if(element.hasOwnProperty("id")) {
            delete element.id;
          }
          if(element.data) {
            if(element.data.model) {
              if(typeof element.data.model == "object") {
                element.data.model = {
                  id: element.data.model.id
                };
              }
            }
            if(element.data.legend) {
              if(typeof element.data.legend.manual == "function") {
                element.data.legend.manual = "(" + element.data.legend.manual.toString() + ")";
              }
              if(typeof element.data.legend.bind == "function") {
                element.data.legend.bind = "(" + element.data.bind.manual.toString() + ")";
              }
            }
            if(element.data.xAxis) {
              if(typeof element.data.xAxis.manual == "function") {
                element.data.xAxis.manual = "(" + element.data.xAxis.manual.toString() + ")";
              }
              if(typeof element.data.xAxis.bind == "function") {
                element.data.xAxis.bind = "(" + element.data.xAxis.bind.toString() + ")";
              }
            }
            if(element.data.series) {
              if(typeof element.data.series.manual == "function") {
                element.data.series.manual = "(" + element.data.series.manual.toString() + ")";
              }
              if(typeof element.data.series.bind == "function") {
                element.data.series.bind = "(" + element.data.series.bind.toString() + ")";
              }
            }
            if(element.data.resource) {
              element.data.resource = element.data.resource.map(function(elem) {
                if($$.noEmptyObject(elem) && $$.noEmptyObject(rootCi)) {
                  if(elem.id == rootCi.id) {
                    return "rootCi";
                  } else {
                    return elem.id;
                  }
                } else {
                  return elem;
                }
              })
            }
            if(element.data.kpi) {
              element.data.kpi = element.data.kpi.map(function(elem) {
                if($$.noEmptyObject(elem)) {
                  return elem.id;
                } else {
                  return elem;
                }
              })
            }
            if(element.data.kqiModel) {
              if(typeof element.data.kqiModel == "object") {
                element.data.kqiModel = {
                  id: element.data.kqiModel.id
                }
              }
            }
          }
          if(element.attributes) {
            for(var i in element.attributes) {
              var reset = {
                value: element.attributes[i].value
              };
              if(element.attributes[i].applied != undefined) {
                reset.applied = element.attributes[i].applied;
              }
              if(element.attributes[i].data) {
                reset.$extension({
                  data: {
                    value: element.attributes[i].data.value
                  }
                })
              }
              element.attributes[i] = reset;
            }
          }
        });
      }
      rootScope.saveAsServiceView = function(callback) {
        rootScope.dirty = false;
        if(!scope.titleComposory || typeof scope.viewTitle == 'string' && scope.viewTitle != '') {
          if(scope.tabIndex == undefined) {
            var savedata = scope.editData.$clone();
            refineDataStructure.call(savedata.layout);
            var content = {
              version: 'V_2',
              layout: savedata.layout,
              setting: savedata.setting
            };
          } else {
            var savedata = scope.editData.$clone();
            for(var i in savedata.groups) {
              refineDataStructure.call(savedata.groups[i].layout);
              var content = {
                version: 'V_2',
                groups: savedata.groups,
                setting: savedata.setting
              };
            }
          }
          //console.log(JSON.stringify(content, null, 2));
          var param = {
            viewTitle: scope.viewTitle.length > 30 ? scope.viewTitle.slice(0, 30) : scope.viewTitle,
            content: JSON.stringify(content)
          };
          param.$extension({
            viewName: 'serviceView',
            viewType: 'serviceView'
          });
          viewFlexService.addView(param, function(event) {
            if(event.code == 0) {
              growl.success("服务视图另存成功", {});
              location.path(rootScope.viewmode + "/" + scope.viewtype + "/" + flag + "/" + event.data.viewId);
              scope.viewId = event.data.viewId;
              if(callback) {
                callback();
              }
            }
          });
        } else {
          growl.error("视图名不能为空！", {});
        }
      };
      rootScope.saveDashboard = function(callback) {
        rootScope.dirty = false;
        if(!scope.titleComposory || typeof scope.viewTitle == 'string' && scope.viewTitle != '') {
          if(scope.tabIndex == undefined) {
            var savedata = scope.editData.$clone();
            loadedView = scope.editData.$clone();
            refineDataStructure.call(savedata.layout);
            //refineDataStructure.call(loadedView);
            var content = {
              version: 'V_2',
              layout: savedata.layout,
              setting: savedata.setting
            };
          } else {
            var savedata = scope.editData.$clone();
            for(var i in savedata.groups) {
              refineDataStructure.call(savedata.groups[i].layout);
              var content = {
                version: 'V_2',
                groups: savedata.groups,
                setting: savedata.setting
              };
            }
          }
          if(solutionId && serviceViewId) {
            if(scope.viewmode == 'freeboard') {
              solutionUIService.saveManageViewContent(solutionId, JSON.stringify(content), function(event) {
                if(event.code == 0) {
                  if(scope.viewmode == "freeboard") {
                    growl.success("解决方案仪表板视图修改成功", {});
                  } else {
                    growl.success("解决方案分析视图修改成功", {});
                  }
                  if(callback) {
                    callback();
                  }
                } else {
                  if(scope.viewmode == "freeboard") {
                    growl.success("解决方案仪表板视图修改失败", {});
                  } else {
                    growl.success("解决方案分析视图修改失败", {});
                  }
                }
              });
            } else {
              solutionUIService.saveModelDashboardViewContent(solutionId, groupId, modelId, JSON.stringify(content), function(event) {
                if(event.code == 0) {
                  if(scope.viewmode == "freeboard") {
                    growl.success("解决方案仪表板视图修改成功", {});
                  } else {
                    growl.success("解决方案分析视图修改成功", {});
                  }
                  if(callback) {
                    callback();
                  }
                } else {
                  if(scope.viewmode == "freeboard") {
                    growl.success("解决方案仪表板视图修改失败", {});
                  } else {
                    growl.success("解决方案分析视图修改失败", {});
                  }
                }
              });
            }
          } else {
            /**
                         if (!content.groups) {
              if (content.layout.children.length == 0) {
                growl.error("视图内容为空!!!");
                throw new Error("视图内容为空!!!");
              }
            };*/
            console.log(content);
            loadedView = content;
            var param = {
              viewTitle: scope.viewTitle.length > 32 ? scope.viewTitle.slice(0, 32) : scope.viewTitle,
              description: scope.description,
              content: JSON.stringify(content)
            };
            if(scope.viewmode == 'freeboard') {
              param.$extension({
                viewName: 'dashboard',
                viewType: 'dashboard'
              });
              param.template = null;
              if(scope.globalModel.enable) {
                if(scope.globalModel.model) {
                  param.template = {
                    resourceId: scope.globalModel.model.id,
                    resourceType: 'device'
                  }
                }
              }
            } else if(scope.viewmode == 'editor') {
              param.$extension({
                viewName: 'designView',
                viewType: 'designView'
              });
            } else if(scope.viewmode == 'service') {
              param.$extension({
                viewName: 'serviceView',
                viewType: 'serviceView'
              });
            } else if(scope.viewmode == 'template') {
              param.$extension({
                viewName: 'dashboard',
                viewType: 'dashboard'
              });
              if(scope.globalModel.enable) {
                if(scope.globalModel.model) {
                  param.template = {
                    resourceId: scope.globalModel.model.id,
                    resourceType: 'device',
                    keyValue: 'default'
                  }
                }
              }
            } else if(scope.viewmode == 'specialist') {
              param.$extension({
                viewName: 'designView',
                viewType: 'designView'
              });
              param.template = {
                resourceId: kqiModelId,
                resourceType: 'kqiModel'
              }
            }
            if(scope.viewId) {
              param.viewId = scope.viewId;
              viewFlexService.updateView(param, function(event) {
                if(event.code == 0) {
                  if(saveToManagement == 1) {
                    content.viewId = scope.viewId;
                    saveManagement(content, callback)
                  } else {
                    if(scope.viewmode == "freeboard") {
                      growl.success("仪表板视图修改成功", {});
                    } else if(scope.viewmode == 'editor') {
                      growl.success("分析视图修改成功", {});
                    } else if(scope.viewmode == 'service') {
                      growl.success("服务视图修改成功", {});
                    } else if(scope.viewmode == 'template') {
                      growl.success("仪表板视图修改成功", {});
                    } else if(scope.viewmode == 'specialist') {
                      growl.success("专家模版视图修改成功", {});
                    }
                    if(callback) {
                      callback();
                    }
                  }
                }
              });
            } else {
              viewFlexService.addView(param, function(event) {
                if(event.code == 0) {
                  if(scope.viewmode == "freeboard") {
                    growl.success("仪表板视图创建成功", {});
                  } else if(scope.viewmode == 'editor') {
                    growl.success("分析视图创建成功", {});
                  } else if(scope.viewmode == 'service') {
                    growl.success("服务视图创建成功", {});
                  } else if(scope.viewmode == 'template') {
                    growl.success("仪表板视图创建成功", {});
                  } else if(scope.viewmode == 'specialist') {
                    growl.success("专家模版视图创建成功", {});
                  }
                  if(rootScope.viewmode == "template") {
                    viewFlexService.releaseViews([event.data.viewId], function(event) {
                      if(event.code == 0) {
                        location.path(rootScope.viewmode + "/model/" + flag + "/" + encodeURIComponent(JSON.stringify({
                          modelId: modelId
                        })));
                      }
                    });
                  } else if(rootScope.viewmode == "specialist") {
                    viewFlexService.releaseViews([event.data.viewId], function(event) {
                      if(event.code == 0) {
                        location.path(rootScope.viewmode + "/" + flag + "/" + kqiModelId);
                      }
                    });
                  } else {
                    location.path(rootScope.viewmode + "/" + scope.viewtype + "/" + flag + "/" + event.data.viewId);
                  }
                  scope.viewId = event.data.viewId;
                  if(callback) {
                    callback();
                  }
                }
              })
            }
          }
        } else {
          growl.error("视图名不能为空！", {});
        }
      };
      rootScope.ModelKpiSelector = function() {
        window.open("../app-free-style/index.html#/kpiselector", "_blank");
      };
      keySet.onCommandKeyWith('s', function() {
        rootScope.saveDashboard();
      });
      keySet.onCommandKeyWith('z', function() {
        rootScope.backward();
      });
      keySet.onCommandKeyWith('y', function() {
        rootScope.forward();
      });
      keySet.onCommandKeyWith('p', function() {
        rootScope.previewDashboard();
      });
      keySet.onCommandKeyWith('h', function() {
        rootScope.helpFun();
      });
      keySet.onCommandKeyWith('u', function() {
        scope.openTemplate();
      });
      keySet.onCommandKeyWith('i', function() {
        scope.inputJSON();
      });
      keySet.onCommandKeyWith('k', function() {
        scope.ModelKpiSelector();
      });

      function saveManagement(content, callback) {
        var param2 = {
          viewTitle: 'dashboard',
          viewName: 'dashboard',
          viewType: "dashboard",
          content: JSON.stringify(content)
        };
        viewFlexService.saveManageDashboard(param2, function(event) {
          if(event.code == 0) {
            growl.success("仪表板视图修改成功", {});
            if(callback) {
              callback();
            }
          } else {
            growl.error("运营首页修改失败", {});
            getViews();
          }
        });
      }
      scope.themes = [{
        id: "none",
        label: "默认主题"
      }, {
        id: "default",
        label: "系统主题"
      }, {
        id: "Cyborg",
        label: "黑色主题"
      }, {
        id: "Slate",
        label: "深蓝主题"
      }, {
        id: "Solar",
        label: "海洋主题"
      }, {
        id: "Darkly",
        label: "Darkly"
      }, {
        id: "steel",
        label: "钢铁行业"
      }];
      scope.kpiChange = function(kpi) {
        if(scope.dataPanel.data.maxKpi == 1) {
          for(var i in scope.kpis) {
            if(scope.kpis[i].id != kpi.id) {
              scope.kpis[i].checked = false;
            } else {
              scope.kpis[i].checked = !scope.kpis[i].checked;
            }
          }
        } else {
          kpi.checked = !kpi.checked;
        }
        var filter = scope.kpis.filter(function(element) {
          return element.checked == true;
        });
        if(filter.length > 0) {
          scope.unitFilter = filter[0].unit;
          scope.unitFilterDisabled = true;
          scope.dataPanel.data.kpi = filter;
        } else {
          scope.unitFilter = "";
          scope.unitFilterDisabled = false;
          scope.dataPanel.data.kpi = undefined;
        }
      };
      scope.resourceChange = function(resource) {
        var filter = scope.resources.filter(function(element) {
          return !element.checked == true;
        });
        if(filter.length > 0) {
          scope.dataPanel.data.resource = filter;
        } else {
          delete scope.dataPanel.data.resource;
        }
        resource.checked = !resource.checked;
      };

      function init(callback) {
        var run = function() {
          var res = [],
            allmodel = [];
          for(var i = 0; i < 80; i++) {
            var a = Math.round(Math.random() * 100);
            var b = Math.round(Math.random() * 1000) / 100;
            res.push([a, b])
          }
          serviceCenterService.rootDomain.get().then(function success(data) {
            if(data) {
              rootCi = data;
            }
            var model = [data.modelId];
            resourceUIService.getModelByIds(model, function(event) {
              var rootModel = event.data[0];
              //allmodel.push(rootModel);
              getAllModels();
            }, function(err) {
              if(err.message == 'databack is undefined !!') {
                growl.error("输入的模型ID获取不到模型信息。", {});
              }
              getAllModels();
            });
          }, function(err) {
            if(err.message == 'databack is undefined !!') {
              growl.error("根设备不存在", {});
            }
            rootCi = null;
            getAllModels();
          });

          function getAllModels() {
            var run = function() {
              serviceCenterService.models.getAll().then(function success(data) {
                Array.prototype.push.apply(allmodel, data);
                scope.allModels = allmodel.map(function(element) {
                  return new modelSelector(element);
                });
                var defaultModel, open = false;
                if(scope.viewmode == "template") {
                  defaultModel = scope.allModels.find(function(elem) {
                    return elem.id == modelId;
                  });
                  open = defaultModel ? true : false;
                } else {
                  if(currentView) {
                    if(currentView.hasOwnProperty("template")) {
                      defaultModel = scope.allModels.find(function(elem) {
                        return elem.id == currentView.$attr("template/resourceId");
                      });
                      open = defaultModel ? true : false;
                    }
                  }
                }
                scope.globalModel.model = defaultModel;
                scope.globalModel.enable = open;
                var getToolbarList = function() {
                  freeBoardValue.TEXT.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.DATALIST.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.LINECHART.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.RADARCHART.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.BARCHART.$extension({
                    attributes: {
                      modelGroup: {
                        applied: false,
                        default: '不采用设备组',
                        label: '设备组',
                        value: groupModels[0] ? groupModels[0].value : '',
                        type: 'select',
                        option: groupModels
                      }
                    },
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.GAUGECHART.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.PIECHART.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.SCATTERCHART.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  freeBoardValue.BARCHART.$extension({
                    data: {
                      modelType: 300,
                      resfilltype: "parameter",
                      modelDisable: (rootScope.viewmode == 'freeboard')
                    }
                  });
                  scope.tools = {
                    grid: freeBoardValue.ROW,
                    datalist_wrap: {
                      "label": "控制板2",
                      "type": "box",
                      "class": "box box-info",
                      "source": "BOX",
                      "parameters": {
                        "title": "数据列表"
                      },
                      "style": {
                        "font-size": "12px",
                        "font-weight": "bold",
                        "text-align": "left",
                        "margin": "5px"
                      },
                      children: [{
                        type: 'box-body',
                        children: [{
                          type: 'column',
                          col: 12,
                          children: [freeBoardValue.DATALIST.$clone()]
                        }],
                        class: 'box-body'
                      }, {
                        type: 'box-footer',
                        children: [{
                          type: 'column',
                          col: 12,
                          children: []
                        }],
                        class: 'box-footer'
                      }]
                    },
                    totalItemTemp: {
                      label: '控制器1',
                      type: 'row',
                      children: [{
                        type: 'column',
                        col: 3,
                        children: [freeBoardValue.TOTALITEM.$clone().$extension({
                          attributes: {
                            title: {
                              data: {
                                value: 'value'
                              }
                            },
                            subtitle: {
                              data: {
                                value: 'kpi'
                              }
                            },
                            "unit": {
                              "value": "个",
                              "data": {
                                "value": "none"
                              }
                            },
                            "icon": {
                              "value": {
                                "perfix": "fa",
                                "css": "fa-connectdevelop",
                                "id": "0"
                              }
                            },
                            color: {
                              value: "#25bce7"
                            }
                          },
                          data: {
                            modelType: 300,
                            resfilltype: "parameter",
                            kpi: [3001]
                          }
                        })]
                      }, {
                        type: 'column',
                        col: 3,
                        children: [freeBoardValue.TOTALITEM.$clone().$extension({
                          attributes: {
                            title: {
                              data: {
                                value: 'value'
                              }
                            },
                            subtitle: {
                              data: {
                                value: 'kpi'
                              }
                            },
                            "unit": {
                              "value": "个",
                              "data": {
                                "value": "none"
                              }
                            },
                            "icon": {
                              "value": {
                                "perfix": "fa",
                                "css": "fa-edit",
                                "id": "2"
                              }
                            },
                            color: {
                              value: "#00b9b2"
                            }
                          },
                          data: {
                            modelType: 300,
                            resfilltype: "parameter",
                            kpi: [3002]
                          }
                        })]
                      }, {
                        type: 'column',
                        col: 3,
                        children: [freeBoardValue.TOTALITEM.$clone().$extension({
                          attributes: {
                            title: {
                              data: {
                                value: 'value'
                              }
                            },
                            subtitle: {
                              data: {
                                value: 'kpi'
                              }
                            },
                            "unit": {
                              "label": "单位",
                              "data": {
                                "value": "none"
                              }
                            },
                            "icon": {
                              "label": "图标",
                              "value": {
                                "perfix": "fa",
                                "css": "fa-warning",
                                "id": "1"
                              }
                            },
                            color: {
                              value: "#e7675d"
                            }
                          },
                          data: {
                            modelType: 300,
                            resfilltype: "parameter",
                            kpi: [3003]
                          }
                        })]
                      }, {
                        type: 'column',
                        col: 3,
                        children: [freeBoardValue.TOTALITEM.$clone().$extension({
                          attributes: {
                            title: {
                              data: {
                                value: 'value'
                              }
                            },
                            subtitle: {
                              data: {
                                value: 'kpi'
                              }
                            },
                            "icon": {
                              "value": {
                                "perfix": "fa",
                                "css": "fa-user",
                                "id": "4"
                              }
                            },
                            "unit": {
                              "value": "条",
                              "data": {
                                "value": "none"
                              }
                            },
                            color: {
                              value: "#ebae0b"
                            }
                          },
                          data: {
                            modelType: 300,
                            resfilltype: "parameter",
                            kpi: [3004]
                          }
                        })]
                      }],
                    },
                    totalItem: freeBoardValue.TOTALITEM.$clone().$extension({
                      data: {
                        modelType: 300,
                        resfilltype: "parameter"
                      }
                    }),
                    downtab: freeBoardValue.DOWNTAB.$clone().$extension({
                      data: {
                        modelType: 300,
                        resfilltype: "parameter"
                      }
                    }),
                    mapchartTemp: {
                      "label": "控制板2",
                      "type": "box",
                      "class": "box box-info",
                      "source": "BOX",
                      "parameters": {
                        "title": "标题文字"
                      },
                      "style": {
                        "font-size": "12px",
                        "font-weight": "bold",
                        "text-align": "left",
                        "margin": "5px"
                      },
                      children: [{
                        type: 'box-body',
                        children: [{
                          type: 'column',
                          col: 8,
                          children: [freeBoardValue.BMAP.$clone().$extension({
                            style: {
                              "height": "452px"
                            }
                          })]
                        }, {
                          type: 'column',
                          col: 4,
                          children: [{
                            "label": "控制板1",
                            "type": "block",
                            "source": "BLOCK",
                            "style": {
                              "margin": "0 5px 0 0",
                              "border": "1px solid rgba(147,196,129,1)",
                              "background-color": "rgba(0,185,178,1)"
                            },
                            children: [{
                              type: 'column',
                              col: 12,
                              children: [freeBoardValue.SPARKLINE.$clone().$extension({
                                style: {
                                  height: "150px"
                                },
                                data: {
                                  modelType: 300,
                                  resfilltype: "parameter",
                                  kpi: [3005]
                                }
                              }), freeBoardValue.SPARKLINE.$clone().$extension({
                                style: {
                                  height: "150px"
                                },
                                data: {
                                  modelType: 300,
                                  resfilltype: "parameter",
                                  kpi: [3012]
                                }
                              }), freeBoardValue.SPARKLINE.$clone().$extension({
                                style: {
                                  height: "150px"
                                },
                                data: {
                                  modelType: 300,
                                  resfilltype: "parameter",
                                  kpi: [100005]
                                }
                              })]
                            }]
                          }]
                        }],
                        class: 'box-body'
                      }, {
                        type: 'box-footer',
                        children: [{
                          type: 'row',
                          children: []
                        }],
                        class: 'box-footer'
                      }]
                    },
                    mapchartLinkTemp: {
                      "label": "控制板2",
                      "type": "box",
                      "class": "box box-info",
                      "source": "BOX",
                      "parameters": {
                        "title": "标题文字"
                      },
                      "style": {
                        "font-size": "12px",
                        "font-weight": "bold",
                        "text-align": "left",
                        "margin": "5px"
                      },
                      attributes: {
                        "text": {
                          "label": "标题文字",
                          "value": "设备分布",
                          "type": "standardInput"
                        },
                        "color": {
                          "label": "颜色",
                          "value": "#333",
                          "type": "colorPicker"
                        },
                        "fontSize": {
                          "label": "字体大小",
                          "value": 18,
                          "type": "slider"
                        },
                        "position": {
                          "label": "对齐",
                          "value": "left",
                          "type": "select",
                          "option": [{
                            "label": "左对齐",
                            "value": "left"
                          }, {
                            "label": "中间对齐",
                            "value": "center"
                          }]
                        },
                        "weight": {
                          "label": "粗细",
                          "value": "bold",
                          "type": "select",
                          "option": [{
                            "label": "正常",
                            "value": "normal"
                          }, {
                            "label": "粗体",
                            "value": "bold"
                          }]
                        }
                      },
                      children: [{
                        type: 'box-body',
                        children: [{
                          type: 'column',
                          col: 7,
                          children: [{
                            type: 'mapchart',
                            data: {
                              bindTo: "mapChartBindLink"
                            },
                            children: []
                          }]
                        }, {
                          type: 'column',
                          col: 5,
                          children: [{
                            type: 'list',
                            attributes: {
                              fun: {
                                value: "ticketService.getTicketsByStatus"
                              }
                            },
                            data: {
                              bindTo: "mapChartBindLink"
                            },
                          }]
                        }],
                        class: 'box-body'
                      }, {
                        type: 'box-footer',
                        children: [{
                          type: 'row',
                          children: []
                        }],
                        class: 'box-footer'
                      }]
                    },
                    piechartTemp: {
                      "label": "控制板2",
                      "type": "box",
                      "class": "box box-info",
                      "source": "BOX",
                      "parameters": {
                        "title": "标题文字"
                      },
                      "style": {
                        "font-size": "12px",
                        "font-weight": "bold",
                        "text-align": "left",
                        "margin": "5px"
                      },
                      children: [{
                        type: 'box-body',
                        children: [{
                          type: 'column',
                          col: 12,
                          children: [freeBoardValue.PIECHART.$clone().$extension({
                            attributes: {
                              title: {
                                value: ""
                              },
                              subtitle: {
                                value: ""
                              },
                              dataType: {
                                value: 'alert'
                              },
                              value: {
                                data: {
                                  value: 'value'
                                }
                              },
                              legend: {
                                data: {
                                  value: 'value'
                                }
                              }
                            }
                          })]
                        }],
                        class: 'box-body'
                      }, {
                        type: 'box-footer',
                        children: [{
                          type: 'column',
                          col: 12,
                          children: [{
                            type: 'alertcount',
                            children: []
                          }]
                        }],
                        class: 'box-footer'
                      }]
                    },
                    warningMapTemp: {
                      "label": "控制板2",
                      "type": "box",
                      "class": "box box-info",
                      "source": "BOX",
                      "parameters": {
                        "title": "最近一周告警情况"
                      },
                      "style": {
                        "font-size": "12px",
                        "font-weight": "bold",
                        "text-align": "left",
                        "margin": "5px"
                      },
                      "children": [{
                          "type": "box-body",
                          "children": [{
                              "type": "column",
                              "col": 8,
                              "children": [{
                                "label": "线图",
                                "type": "echart",
                                "source": "LINECHART",
                                "help": "../app-free-style/index.html#/help/index%7Cechart/%5B%220%22,%7B%7D%5D",
                                "data": {
                                  "applied": false,
                                  "resource": [],
                                  "modelDisable": true,
                                  "modelType": 300,
                                  "resfilltype": "parameter",
                                  "timespan": {
                                    "value": 24,
                                    "unit": "hour"
                                  },
                                  "frequency": {
                                    "value": 30,
                                    "unit": "minute"
                                  },
                                  "aggregate_rule": 0,
                                  "aggregate_instance": [],
                                  "aggregate_period": 15,
                                  "aggregate_type": [
                                    1
                                  ],
                                  "autoFillBlank": true,
                                  "format": "年月日",
                                  "grid": [{}],
                                  "legend": {
                                    "manual": [
                                      "第一组",
                                      "第二组",
                                      "第三组"
                                    ],
                                    "bind": "(function (source){\n  var formatter=function(elem){\n    return elem.kpi\n   }\n  return source.time.getSeries(formatter);\n})"
                                  },
                                  "xAxisType": "category",
                                  "xAxis": {
                                    "manual": [
                                      [
                                        "第一个数据",
                                        "第二个数据",
                                        "第三个数据",
                                        "第四个数据",
                                        "第五个数据",
                                        "第六个数据"
                                      ]
                                    ],
                                    "bind": "(function (source){\n  var formatter=function(elem){\n    return elem.kpi\n   }\n  return source.time.getxAxis(formatter);\n})"
                                  },
                                  "yAxisType": "value",
                                  "yAxis": {
                                    "manual": [
                                      [
                                        "第一个数据",
                                        "第二个数据",
                                        "第三个数据",
                                        "第四个数据",
                                        "第五个数据",
                                        "第六个数据"
                                      ]
                                    ],
                                    "bind": "(function (source){\n  var formatter=function(elem){\n    return elem.kpi\n   }\n  return source.time.getxAxis(formatter);\n})"
                                  },
                                  "series": {
                                    "manual": [{
                                        "name": "第一组",
                                        "data": [
                                          120,
                                          85,
                                          64,
                                          130,
                                          152,
                                          87
                                        ]
                                      },
                                      {
                                        "name": "第二组",
                                        "data": [
                                          88,
                                          120,
                                          180,
                                          78,
                                          232,
                                          140
                                        ]
                                      },
                                      {
                                        "name": "第三组",
                                        "data": [
                                          50,
                                          80,
                                          140,
                                          60,
                                          70,
                                          90
                                        ]
                                      }
                                    ],
                                    "bind": "(function (source){\n   var formatter=function(elem){\n    return elem.kpi\n   }\n  return source.time.getSeries(formatter);\n})"
                                  },
                                  "kpi": [
                                    3006,
                                    3007,
                                    3008,
                                    3009
                                  ]
                                },
                                "advance": {
                                  "variable": "",
                                  "getfunction": "kpiDataService.getValueList",
                                  "category": "time",
                                  "custom_category": "",
                                  "condition": [
                                    "kpi",
                                    "{object:kpiQueryModel}"
                                  ],
                                  "expression": {}
                                },
                                "parameters": {
                                  "title": "主标题",
                                  "subtitle": "附标题"
                                },
                                "style": {
                                  "margin": "auto",
                                  "width": "100%",
                                  "height": "300px"
                                },
                                "echart": {
                                  "general": {},
                                  "title": {
                                    "padding": 30,
                                    "text": "草莓大棚温度变化",
                                    "textStyle": {
                                      "fontWeight": "bold",
                                      "fontSize": 16
                                    }
                                  },
                                  "toolbox": {},
                                  "tooltip": {
                                    "trigger": "axis"
                                  },
                                  "legend": {
                                    "data": [
                                      "数据1",
                                      "数据2",
                                      "数据3"
                                    ]
                                  },
                                  "grid": [{}],
                                  "xAxis": [{
                                    "type": "category",
                                    "boundaryGap": false,
                                    "axisLine": {
                                      "lineStyle": {
                                        "color": "#b0b0b0",
                                        "width": 1
                                      }
                                    },
                                    "splitLine": {
                                      "lineStyle": {
                                        "color": "rgb(239, 239, 239)",
                                        "width": 1
                                      }
                                    }
                                  }],
                                  "yAxis": [{
                                    "show": true,
                                    "max": "auto",
                                    "min": "auto",
                                    "type": "value",
                                    "boundaryGap": false,
                                    "axisLine": {
                                      "lineStyle": {
                                        "color": "#b0b0b0",
                                        "width": 1
                                      }
                                    },
                                    "splitLine": {
                                      "lineStyle": {
                                        "color": "rgb(239, 239, 239)",
                                        "width": 1
                                      }
                                    },
                                    "axisLabel": {
                                      "show": true,
                                      "textStyle": {}
                                    },
                                    "axisTick": {
                                      "show": true,
                                      "lineStyle": {}
                                    }
                                  }],
                                  "series": [{
                                      "name": "数据1",
                                      "type": "line",
                                      "markPoint": {
                                        "data": [{
                                            "name": "最大值",
                                            "type": "max"
                                          },
                                          {
                                            "name": "最小值",
                                            "type": "min"
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      "name": "数据2",
                                      "type": "line",
                                      "markPoint": {
                                        "data": [{
                                            "name": "最大值",
                                            "type": "max"
                                          },
                                          {
                                            "name": "最小值",
                                            "type": "min"
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      "name": "数据3",
                                      "type": "line",
                                      "markPoint": {
                                        "data": [{
                                            "name": "最大值",
                                            "type": "max"
                                          },
                                          {
                                            "name": "最小值",
                                            "type": "min"
                                          }
                                        ]
                                      }
                                    }
                                  ],
                                  "visualMap": []
                                },
                                "template": [{
                                    "label": "基础线图",
                                    "type": "image",
                                    "url": "images/line/line1.png",
                                    "style": {
                                      "margin": "auto",
                                      "width": "100%",
                                      "height": "300px"
                                    },
                                    "echart": {
                                      "general": {},
                                      "title": {
                                        "padding": 30,
                                        "text": "草莓大棚温度变化",
                                        "textStyle": {
                                          "fontWeight": "bold",
                                          "fontSize": 16
                                        }
                                      },
                                      "toolbox": {},
                                      "legend": {
                                        "data": [
                                          "数据1",
                                          "数据2",
                                          "数据3"
                                        ]
                                      },
                                      "grid": [{}],
                                      "tooltip": {
                                        "trigger": "axis"
                                      },
                                      "xAxis": [{
                                        "type": "category",
                                        "boundaryGap": false,
                                        "axisLine": {
                                          "lineStyle": {
                                            "color": "#b0b0b0",
                                            "width": 1
                                          }
                                        },
                                        "splitLine": {
                                          "lineStyle": {
                                            "color": "rgb(239, 239, 239)",
                                            "width": 1
                                          }
                                        }
                                      }],
                                      "yAxis": [{
                                        "show": true,
                                        "max": "auto",
                                        "min": "auto",
                                        "type": "value",
                                        "boundaryGap": false,
                                        "axisLine": {
                                          "lineStyle": {
                                            "color": "#b0b0b0",
                                            "width": 1
                                          }
                                        },
                                        "splitLine": {
                                          "lineStyle": {
                                            "color": "rgb(239, 239, 239)",
                                            "width": 1
                                          }
                                        },
                                        "axisLabel": {
                                          "show": true,
                                          "textStyle": {}
                                        },
                                        "axisTick": {
                                          "show": true,
                                          "lineStyle": {}
                                        }
                                      }],
                                      "series": [{
                                          "name": "数据1",
                                          "type": "line",
                                          "markPoint": {
                                            "data": [{
                                                "name": "最大值",
                                                "type": "max"
                                              },
                                              {
                                                "name": "最小值",
                                                "type": "min"
                                              }
                                            ]
                                          }
                                        },
                                        {
                                          "name": "数据2",
                                          "type": "line",
                                          "markPoint": {
                                            "data": [{
                                                "name": "最大值",
                                                "type": "max"
                                              },
                                              {
                                                "name": "最小值",
                                                "type": "min"
                                              }
                                            ]
                                          }
                                        },
                                        {
                                          "name": "数据3",
                                          "type": "line",
                                          "markPoint": {
                                            "data": [{
                                                "name": "最大值",
                                                "type": "max"
                                              },
                                              {
                                                "name": "最小值",
                                                "type": "min"
                                              }
                                            ]
                                          }
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "label": "堆积线图",
                                    "type": "image",
                                    "url": "images/line/line2.png",
                                    "style": {
                                      "margin": "auto",
                                      "width": "100%",
                                      "height": "300px"
                                    },
                                    "echart": {
                                      "general": {},
                                      "title": {},
                                      "legend": {
                                        "data": [
                                          "数据1",
                                          "数据2",
                                          "数据3"
                                        ]
                                      },
                                      "grid": [{}],
                                      "xAxis": [{
                                        "boundaryGap": false,
                                        "type": "category"
                                      }],
                                      "yAxis": [{
                                        "type": "value"
                                      }],
                                      "series": [{
                                          "stack": "总量",
                                          "name": "数据1",
                                          "type": "line"
                                        },
                                        {
                                          "stack": "总量",
                                          "name": "数据2",
                                          "type": "line"
                                        }
                                      ],
                                      "toolbox": {},
                                      "tooltip": {}
                                    }
                                  },
                                  {
                                    "label": "对数轴",
                                    "type": "image",
                                    "url": "images/line/line3.png",
                                    "style": {
                                      "margin": "auto",
                                      "width": "100%",
                                      "height": "300px"
                                    },
                                    "echart": {
                                      "general": {},
                                      "title": {},
                                      "legend": {
                                        "data": [
                                          "数据1",
                                          "数据2",
                                          "数据3"
                                        ]
                                      },
                                      "grid": [{}],
                                      "xAxis": [{
                                        "boundaryGap": false,
                                        "type": "category"
                                      }],
                                      "yAxis": [{
                                        "type": "log"
                                      }],
                                      "series": [{
                                          "name": "数据1",
                                          "type": "line"
                                        },
                                        {
                                          "name": "数据2",
                                          "type": "line"
                                        },
                                        {
                                          "name": "数据3",
                                          "type": "line"
                                        }
                                      ],
                                      "toolbox": {},
                                      "tooltip": {}
                                    }
                                  },
                                  {
                                    "label": "面积线图",
                                    "type": "image",
                                    "url": "images/line/line4.png",
                                    "style": {
                                      "margin": "auto",
                                      "width": "100%",
                                      "height": "300px"
                                    },
                                    "echart": {
                                      "general": {},
                                      "title": {
                                        "padding": 30,
                                        "text": "草莓大棚温度变化",
                                        "textStyle": {
                                          "fontWeight": "bold",
                                          "fontSize": 16
                                        }
                                      },
                                      "toolbox": {},
                                      "tooltip": {
                                        "trigger": "axis"
                                      },
                                      "legend": {
                                        "data": [
                                          "数据1",
                                          "数据2",
                                          "数据3"
                                        ]
                                      },
                                      "xAxis": [{
                                        "type": "category",
                                        "boundaryGap": false,
                                        "axisLine": {
                                          "lineStyle": {
                                            "color": "#b0b0b0",
                                            "width": 1
                                          }
                                        },
                                        "splitLine": {
                                          "lineStyle": {
                                            "color": "rgb(239, 239, 239)",
                                            "width": 1
                                          }
                                        }
                                      }],
                                      "yAxis": [{
                                        "show": true,
                                        "max": "auto",
                                        "min": "auto",
                                        "type": "value",
                                        "boundaryGap": false,
                                        "axisLine": {
                                          "lineStyle": {
                                            "color": "#b0b0b0",
                                            "width": 1
                                          }
                                        },
                                        "splitLine": {
                                          "lineStyle": {
                                            "color": "rgb(239, 239, 239)",
                                            "width": 1
                                          }
                                        },
                                        "axisLabel": {
                                          "show": true,
                                          "textStyle": {}
                                        },
                                        "axisTick": {
                                          "show": true,
                                          "lineStyle": {}
                                        }
                                      }],
                                      "series": [{
                                          "name": "数据1",
                                          "type": "line",
                                          "areaStyle": {
                                            "normal": {
                                              "show": true
                                            }
                                          }
                                        },
                                        {
                                          "name": "数据2",
                                          "type": "line",
                                          "areaStyle": {
                                            "normal": {
                                              "show": true
                                            }
                                          }
                                        },
                                        {
                                          "name": "数据3",
                                          "type": "line",
                                          "areaStyle": {
                                            "normal": {
                                              "show": true
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "label": "面堆积线图",
                                    "type": "image",
                                    "url": "images/line/line5.png",
                                    "style": {
                                      "margin": "auto",
                                      "width": "100%",
                                      "height": "300px"
                                    },
                                    "echart": {
                                      "general": {},
                                      "title": {
                                        "padding": 30,
                                        "text": "草莓大棚温度变化",
                                        "textStyle": {
                                          "fontWeight": "bold",
                                          "fontSize": 16
                                        }
                                      },
                                      "toolbox": {},
                                      "tooltip": {
                                        "trigger": "axis"
                                      },
                                      "legend": {
                                        "data": [
                                          "数据1",
                                          "数据2",
                                          "数据3"
                                        ]
                                      },
                                      "grid": [{}],
                                      "xAxis": [{
                                        "type": "category",
                                        "boundaryGap": false,
                                        "axisLine": {
                                          "lineStyle": {
                                            "color": "#b0b0b0",
                                            "width": 1
                                          }
                                        },
                                        "splitLine": {
                                          "lineStyle": {
                                            "color": "rgb(239, 239, 239)",
                                            "width": 1
                                          }
                                        }
                                      }],
                                      "yAxis": [{
                                        "show": true,
                                        "max": "auto",
                                        "min": "auto",
                                        "type": "value",
                                        "boundaryGap": false,
                                        "axisLine": {
                                          "lineStyle": {
                                            "color": "#b0b0b0",
                                            "width": 1
                                          }
                                        },
                                        "splitLine": {
                                          "lineStyle": {
                                            "color": "rgb(239, 239, 239)",
                                            "width": 1
                                          }
                                        },
                                        "axisLabel": {
                                          "show": true,
                                          "textStyle": {}
                                        },
                                        "axisTick": {
                                          "show": true,
                                          "lineStyle": {}
                                        }
                                      }],
                                      "series": [{
                                          "stack": "总量",
                                          "name": "数据1",
                                          "type": "line",
                                          "areaStyle": {
                                            "normal": {
                                              "show": true
                                            }
                                          }
                                        },
                                        {
                                          "stack": "总量",
                                          "name": "数据2",
                                          "type": "line",
                                          "areaStyle": {
                                            "normal": {
                                              "show": true
                                            }
                                          }
                                        },
                                        {
                                          "stack": "总量",
                                          "name": "数据3",
                                          "type": "line",
                                          "areaStyle": {
                                            "normal": {
                                              "show": true
                                            }
                                          }
                                        }
                                      ]
                                    }
                                  },
                                  {
                                    "label": "双坐标轴图",
                                    "type": "image",
                                    "url": "images/line/line6.png",
                                    "style": {
                                      "margin": "auto",
                                      "width": "100%",
                                      "height": "600px"
                                    },
                                    "echart": {
                                      "general": {},
                                      "title": {
                                        "padding": 30,
                                        "text": "草莓大棚温度变化",
                                        "textStyle": {
                                          "fontWeight": "bold",
                                          "fontSize": 16
                                        }
                                      },
                                      "legend": {
                                        "data": [
                                          "数据1",
                                          "数据2",
                                          "数据3"
                                        ]
                                      },
                                      "grid": [{
                                          "left": 50,
                                          "right": 50,
                                          "height": "35%"
                                        },
                                        {
                                          "left": 50,
                                          "right": 50,
                                          "top": "55%",
                                          "height": "35%"
                                        }
                                      ],
                                      "toolbox": {},
                                      "tooltip": {
                                        "trigger": "axis"
                                      },
                                      "xAxis": [{
                                          "type": "category",
                                          "boundaryGap": false
                                        },
                                        {
                                          "gridIndex": 1,
                                          "type": "category",
                                          "boundaryGap": false,
                                          "position": "top"
                                        }
                                      ],
                                      "yAxis": [{
                                          "name": "流量(m^3/s)",
                                          "type": "value"
                                        },
                                        {
                                          "gridIndex": 1,
                                          "name": "降雨量(mm)",
                                          "type": "value",
                                          "inverse": true
                                        }
                                      ],
                                      "series": [{
                                          "name": "数据1",
                                          "type": "line",
                                          "symbolSize": 16
                                        },
                                        {
                                          "name": "数据2",
                                          "type": "line",
                                          "xAxisIndex": 1,
                                          "yAxisIndex": 1,
                                          "symbolSize": 16
                                        },
                                        {
                                          "name": "数据3",
                                          "type": "line",
                                          "xAxisIndex": 1,
                                          "yAxisIndex": 1,
                                          "symbolSize": 16
                                        }
                                      ]
                                    }
                                  }
                                ],
                                "id": "6HymH6eC2aQ5PPdBwDPaFYPxWSmibC5B",
                                "resource_time": {}
                              }],
                              "id": "R47z77CYWWP5HHQn6pMADQdhW7kJDb3c"
                            },
                            {
                              "type": "column",
                              "col": 4,
                              "children": [{
                                "type": "row",
                                "children": [{
                                  "type": "column",
                                  "col": 12,
                                  "children": [{
                                      "label": "文字",
                                      "type": "text",
                                      "source": "TEXT",
                                      "help": "http://localhost/app-free-style/index.html#/help/index%7Ctext/%5B%220%22,%7B%7D%5D",
                                      "data": {
                                        "applied": false,
                                        "multipleCi": false,
                                        "multipleKpi": false,
                                        "resource": [],
                                        "modelType": 300,
                                        "resfilltype": "parameter",
                                        "series": {
                                          "manual": "处理情况",
                                          "bind": "(function (source){\n  return source.getSeries();\n})"
                                        },
                                        "modelDisable": true
                                      },
                                      "style": {
                                        "margin": "5px auto",
                                        "padding": "0",
                                        "font-size": "12px",
                                        "font-weight": "bold",
                                        "border-width": "0px",
                                        "text-align": "center"
                                      },
                                      "advance": {
                                        "getfunction": "kpiDataService.getValueList",
                                        "category": "ci",
                                        "condition": [
                                          "kpi",
                                          "{object:kpiQueryModel}"
                                        ],
                                        "expression": "expression = {\n    on : {\n        init : function(event){\n            var target = event.target;\n            target.setText(\"新建文字\")\n        }\n    }\n}"
                                      },
                                      "template": [{
                                          "type": "text",
                                          "style": {
                                            "margin": "auto",
                                            "padding": "0",
                                            "font-size": "10px",
                                            "font-weight": "bold",
                                            "color": "#333"
                                          }
                                        },
                                        {
                                          "type": "text",
                                          "style": {
                                            "margin": "auto",
                                            "padding": "0",
                                            "font-size": "16px",
                                            "font-weight": "bold",
                                            "color": "#666",
                                            "text-align": "center"
                                          }
                                        },
                                        {
                                          "type": "text",
                                          "style": {
                                            "width": "60px",
                                            "height": "60px",
                                            "margin": "auto",
                                            "padding": "0",
                                            "font-size": "12px",
                                            "line-height": "60px",
                                            "font-weight": "bold",
                                            "color": "#fff",
                                            "text-align": "center",
                                            "border-radius": "50%",
                                            "background-color": "#3c8dbc"
                                          }
                                        },
                                        {
                                          "type": "text",
                                          "style": {
                                            "width": "140px",
                                            "height": "60px",
                                            "margin": "auto",
                                            "padding": "0",
                                            "font-size": "12px",
                                            "line-height": "60px",
                                            "font-weight": "bold",
                                            "color": "#fff",
                                            "text-align": "center",
                                            "border-radius": "4px",
                                            "background-color": "#3c8dbc"
                                          }
                                        },
                                        {
                                          "type": "text",
                                          "style": {
                                            "width": "140px",
                                            "height": "60px",
                                            "margin": "auto",
                                            "padding": "0",
                                            "font-size": "12px",
                                            "line-height": "60px",
                                            "font-weight": "bold",
                                            "color": "#444",
                                            "text-align": "center",
                                            "border-radius": "4px",
                                            "background-color": "#eee"
                                          }
                                        },
                                        {
                                          "type": "text",
                                          "style": {
                                            "margin": "auto",
                                            "padding": "5px",
                                            "font-size": "18px",
                                            "font-weight": "bold",
                                            "color": "#444",
                                            "text-align": "center",
                                            "border-radius": "0px",
                                            "background-color": "#eee"
                                          }
                                        }
                                      ],
                                      "id": "FzNAswf4ZrJnTjWDz8QdhXTwYQWxMXAs"
                                    },
                                    {
                                      "label": "百分比状态条",
                                      "type": "progress",
                                      "source": "PROGRESS",
                                      "advance": {
                                        "getfunction": "kpiDataService.getValueList",
                                        "category": "ci",
                                        "condition": [
                                          "kpi",
                                          "{object:kpiQueryModel}"
                                        ],
                                        "expression": ""
                                      },
                                      "data": {
                                        "applied": false,
                                        "multipleCi": false,
                                        "multipleKpi": false,
                                        "resource": [],
                                        "modelDisable": true,
                                        "modelType": 300,
                                        "resfilltype": "parameter",
                                        "series": {
                                          "manual": [{
                                            "data": [{
                                              "name": "指标",
                                              "value": 90
                                            }]
                                          }],
                                          "bind": "(function (source){\n  var formatter=function(elem){\n    return elem.kpi\n   }\n  return source.ci.getSeries(formatter);\n})"
                                        },
                                        "kpi": [
                                          100002
                                        ]
                                      },
                                      "id": "RPEr8iAt3SByJwwXFRnczbSkFHR83zYW"
                                    },
                                    {
                                      "label": "百分比状态条",
                                      "type": "progress",
                                      "source": "PROGRESS",
                                      "advance": {
                                        "getfunction": "kpiDataService.getValueList",
                                        "category": "ci",
                                        "condition": [
                                          "kpi",
                                          "{object:kpiQueryModel}"
                                        ],
                                        "expression": ""
                                      },
                                      "data": {
                                        "applied": false,
                                        "multipleCi": false,
                                        "multipleKpi": false,
                                        "resource": [],
                                        "modelDisable": true,
                                        "modelType": 300,
                                        "resfilltype": "parameter",
                                        "series": {
                                          "manual": [{
                                            "data": [{
                                              "name": "指标",
                                              "value": 90
                                            }]
                                          }],
                                          "bind": "(function (source){\n  var formatter=function(elem){\n    return elem.kpi\n   }\n  return source.ci.getSeries(formatter);\n})"
                                        },
                                        "kpi": [
                                          100004
                                        ]
                                      },
                                      "id": "5wnnSPf7yYmDN3yBGpyZrGTYkW4nXDcT"
                                    }
                                  ],
                                  "id": "srEECX5j4pJEeijNPk88f27YZwp7Tt7w"
                                }],
                                "id": "MrNYhzNNyHGQHe5KwwiziDYHGPWdTmZy",
                                "source": "ROW"
                              }],
                              "id": "3YWchjGDckGzeF5s3Mk86n4CKj64WeJt"
                            }
                          ],
                          "class": "box-body",
                          "id": "zP3MPNW2ai5b7bbr5mKYfSm6szFCXrcD"
                        },
                        {
                          "type": "box-footer",
                          "children": [{
                              "type": "column",
                              "col": 3,
                              "children": [{
                                "type": "row",
                                "children": [{
                                  "type": "column",
                                  "col": 12,
                                  "children": [{
                                    "label": "环比标签",
                                    "type": "downTab",
                                    "source": "DOWNTAB",
                                    "data": {
                                      "applied": false,
                                      "multipleCi": false,
                                      "multipleKpi": false,
                                      "resource": [],
                                      "modelDisable": true,
                                      "modelType": 300,
                                      "resfilltype": "parameter",
                                      "series": {
                                        "manual": [{
                                          "name": "指标",
                                          "data": [
                                            60,
                                            70,
                                            80,
                                            90,
                                            100
                                          ]
                                        }],
                                        "bind": "(function (source){\n  return source.time.getSeries();\n})"
                                      }
                                    },
                                    "id": "mBFpBH7p4JCSQyk6H2CtnSTPykzTenr5"
                                  }],
                                  "id": "hp3WaMD2kGhcM2mhD4EbnkSKjYs7wKY5"
                                }],
                                "id": "kbJHZJD4YP7CQSDEcDCfQA7eDmzf6DAa",
                                "source": "ROW"
                              }],
                              "id": "Ka5YZdRA3483d4BMXzWm3CihefnNBKSA"
                            },
                            {
                              "type": "column",
                              "col": 3,
                              "children": [{
                                "type": "row",
                                "children": [{
                                  "type": "column",
                                  "col": 12,
                                  "children": [{
                                    "label": "环比标签",
                                    "type": "downTab",
                                    "source": "DOWNTAB",
                                    "data": {
                                      "applied": false,
                                      "kpi": [],
                                      "modelType": 300,
                                      "resfilltype": "parameter",
                                      "resource": [],
                                      "multipleCi": false,
                                      "multipleKpi": false,
                                      "series": {
                                        "manual": "[\n  {\n    \"name\": \"指标\",\n    \"data\": [\n      60,\n      70,\n      80,\n      120,\n      100\n    ]\n  }\n]",
                                        "bind": "(function (source){\n  return source.time.getSeries();\n})"
                                      }
                                    },
                                    "id": "XxiSTfPFmtpFBRhSKCjpJErXtnWRMHFn",
                                    "$index": [
                                      0,
                                      0
                                    ]
                                  }],
                                  "id": "dcNQsbxxN5dsmxCWmTNMMYNbTFQyxBXz"
                                }],
                                "id": "K7rQRk3AWdmyh2j53YbbZK8GyJs2rn3t",
                                "source": "ROW"
                              }],
                              "id": "nEY7NzkpYHYC6Pni2mBHjkCbYMaGDExn"
                            },
                            {
                              "type": "column",
                              "col": 3,
                              "children": [{
                                "type": "row",
                                "children": [{
                                  "type": "column",
                                  "col": 12,
                                  "children": [{
                                    "label": "环比标签",
                                    "type": "downTab",
                                    "source": "DOWNTAB",
                                    "data": {
                                      "applied": false,
                                      "multipleCi": false,
                                      "multipleKpi": false,
                                      "resource": [],
                                      "modelDisable": true,
                                      "modelType": 300,
                                      "resfilltype": "parameter",
                                      "series": {
                                        "manual": [{
                                          "name": "指标",
                                          "data": [
                                            60,
                                            70,
                                            80,
                                            90,
                                            100
                                          ]
                                        }],
                                        "bind": "(function (source){\n  return source.time.getSeries();\n})"
                                      }
                                    },
                                    "id": "k8rPPWfmtGdcz5Ntffe8fXsMApxkzePE"
                                  }],
                                  "id": "WGQkZKY82WZKhyXZZNPAjh2P6p8ekhir"
                                }],
                                "id": "Ajc67sHcmPtAfMCFSkk5DnnT7FxbGn68",
                                "source": "ROW"
                              }],
                              "id": "myKtr6ftX4x5ytbkKkw3ieXxQyfPi45C"
                            },
                            {
                              "type": "column",
                              "col": 3,
                              "children": [{
                                "type": "row",
                                "children": [{
                                  "type": "column",
                                  "col": 12,
                                  "children": [{
                                    "label": "环比标签",
                                    "type": "downTab",
                                    "source": "DOWNTAB",
                                    "data": {
                                      "applied": false,
                                      "kpi": [],
                                      "modelType": 300,
                                      "resfilltype": "parameter",
                                      "resource": [],
                                      "multipleCi": false,
                                      "multipleKpi": false,
                                      "series": {
                                        "manual": "[\n  {\n    \"name\": \"指标\",\n    \"data\": [\n      120,\n      70,\n      80,\n      90,\n      100\n    ]\n  }\n]",
                                        "bind": "(function (source){\n  return source.time.getSeries();\n})"
                                      }
                                    },
                                    "id": "x5wdhitTAcyTw2RfMz3yGp2WsxSfAkMB",
                                    "$index": [
                                      0,
                                      0
                                    ]
                                  }],
                                  "id": "ycGwrJfnXDkKwX4c4AF4ERmyxxspYfeh"
                                }],
                                "id": "dmjDRfHy2wtjPAFkcbzwZybinf5Sk6Mt",
                                "source": "ROW"
                              }],
                              "id": "dniekBCcRpT73p54b3axmD7p68cpTw6f"
                            }
                          ],
                          "class": "box-footer",
                          "id": "GJGepfSKasQBzGPeDWK7erbFPyedK7i2"
                        }
                      ],
                      "url": "images/map/map1.png",
                      "id": "DXnDspipMN7c247NrrWfhEHT3aiZ44RN"
                    },
                    /**
                                         resourcelist: {
                      type: 'resourcelist',
                      attributes: {
                        fun: {
                          value: "serviceCenterService.resources.getAll"
                        }
                      }
                    },
                                         svg_pie: {
                      type: 'svg_pie',
                    },*/
                    kpilist: freeBoardValue.KPILIST.$clone().$extension({
                      data: {
                        modelType: 300,
                        resfilltype: "parameter"
                      }
                    })
                    /**,
                                                             dashboardView: {
                                          type: 'dashboard'
                                        },
                                                             mapchart: {
                                          type: 'mapchart'
                                        },
                                                             map1chart: {
                                          type: 'map1chart'
                                        },
                                                             map2chart: {
                                          type: 'map2chart'
                                        },
                                                             scatter2chart: {
                                          type: 'scatter2chart'
                                        },
                                                             scatter3chart: {
                                          type: 'scatter3chart'
                                        },
                                                             relationchart: {
                                          type: "relationchart"
                                        },
                                                             relation1chart: {
                                          type: "relation1chart"
                                        },
                                                             parallelschart: {
                                          type: 'parallelschart'
                                        },
                                                             parallels1chart: {
                                          type: 'parallels1chart'
                                        },
                                                             parallels2chart: {
                                          type: 'parallels2chart'
                                        },
                                                             projecttopo: freeBoardValue.PROJECTTOP.$clone()*/
                  };
                  for(var i in freeBoardValue) {
                    var type = i.toLowerCase();
                    if(type) {
                      if(!scope.tools[type]) {
                        scope.tools[type] = freeBoardValue[i].$clone();
                      }
                    }
                  }
                  for(var i in dashboardTemplate) {
                    var json = JSON.parse(dashboardTemplate[i].value);
                    //json.type = dashboardTemplate[i].name;
                    scope.tools["template_" + dashboardTemplate[i].id] = json;
                  }
                  for(var i in scope.tools) {
                    replaceCiKpi.call(scope.tools[i]);
                  }
                  /**
                                     for(var k in scope.toolbarListMap) {
                    for(var j in scope.toolbarListMap[k].sub) {
                      (function(elem){
                        if(elem.render=="render") {
                          var item = remapData({
                            layout : {
                              id: $randomString(32),
                              type: 'column',
                              children: [scope.tools[elem.type]],
                              col: 12
                            }
                          });
                          var ins = freeboardBaseService($("#prev_" + elem.type));
                          ins.setMode(true);
                          ins.renderLayout(item);
                          item.renderBoardToTarget($("#prev_" + elem.type), true);
                        }
                      })(scope.toolbarListMap[k].sub[j])
                    }
                  }
                                     */
                  if(typeof callback == 'function') {
                    callback();
                  }
                };
                if(!currentView) {
                  if(scope.viewmode == "freeboard") {
                    scope.firstCreate = true;
                    scope.template = [{
                      id: -1,
                      title: "空白视图"
                    }].concat(window.template);
                  } else if(scope.viewmode == "editor") {
                    scope.firstCreate = true;
                    scope.specialist = [{
                      id: -1,
                      label: "空白视图"
                    }].concat(window.specialistView);
                  } else {
                    scope.setting = new setting({
                      theme: JSONparse(scope.editData.setting).theme || "default",
                      data: scope.editData.setting
                    });
                  }
                }
                getToolbarList();
              }, function error(err) {
                growl.error("获取不到模型列表。", {});
              });
            };
            if(rootScope.viewmode == 'editor') {
              if($$.isFunction(CHARTDATA.defer)) {
                CHARTDATA.defer(function() {
                  var scatterOp = scope.toolBarList[5].sub[0].option;
                  freeBoardValue.SCATTERCHART.$extension(CHARTDATA[scatterOp]);
                  run()
                })
              } else {
                var scatterOp = scope.toolBarList[5].sub[0].option;
                freeBoardValue.SCATTERCHART.$extension(CHARTDATA[scatterOp]);
                run()
              }
            } else {
              run();
            }
            renderDataFn();
            //scope.editData.renderBoard();
          }
        };
        run();
      }

      function replaceCiKpi(callback) {
        if(typeof callback == "function") {
          callback();
        }
        /**
                 var cur = this;
                 var defers = [];
                 cur.traveseByChild(function(element){
          var defer = q.defer();
          if(element.getCiKpi){
            element.getCiKpi(function(ci, kpi){
              if(element.data){
                element.data.resource = ci;
                element.data.kpi = kpi;
              };
              defer.resolve("success");
            });
          } else {
            defer.resolve("success");
          };
          defers.push(defer.promise);
        });
                 q.all(defers).then(function(){
          if(typeof callback == "function"){
            callback(cur);
          };
        });
                 */
        /**
                 var defers = [];
                 var cur = this;
                 this.traveseByChild(function(element){
          var resourceArr = [];
          var finished, def = q.defer();
          defers.push(def.promise);
          (function(def){
            if(element.data) {
              element.data.defer = function(callback){
                finished = callback;
              };
              if(scope.globalModel.enable){
                var model = scope.globalModel.model;
                element.data.model = new modelSelector(model);
                getcikpi(model.id);
              } else {
                if(typeof element.data.model != 'object') {
                  if(element.data.model) {
                    var modelId = element.data.model.id;
                    resourceUIService.getModelByIds([modelId], function(event){
                      if(event.code == '0') {
                        element.data.model = new modelSelector(event.data[0]);
                        getcikpi(modelId);
                      }
                    });
                  } else {
                    def.resolve("success");
                  }
                } else if(element.data.model != undefined) {
                  var modelId = element.data.model.id;
                  if(modelId) {
                    getcikpi(modelId);
                  } else {
                    def.resolve("success");
                  }
                }
              }

            } else {
              def.resolve("success");
            }
            function getcikpi(modelId){
              serviceCenterService.resources.getBymodelId(modelId).then(function success(data){
                if($.isArray(element.data.resource)) {
                  for(var i in element.data.resource) {
                    if(element.data.resource[i] == 'rootCi') {
                      if($$.noEmptyObject(rootCi)) {
                        element.data.resource[i] = rootCi;
                      }
                    } else if(typeof element.data.resource[i] != 'object') {
                      var resourceId = element.data.resource[i];
                      element.data.resource[i] = data.find(function(elem){
                        return resourceId == elem.id;
                      });
                    }
                  }
                };
                serviceCenterService.kpis.getBymodelId(modelId).then(function success(data){
                  var ckpi = []
                  if($.isArray(element.data.kpi)) {
                    for(var i in element.data.kpi) {
                      if(typeof element.data.kpi[i] != 'object'){
                        var kpiId = element.data.kpi[i];
                      } else if(typeof element.data.kpi[i] == 'object'){
                        var kpiId = element.data.kpi[i].id;
                      }
                      var find =  data.find(function(elem){
                        return kpiId == elem.id;
                      });
                      if(find) {
                        ckpi.push(find)
                        //element.data.kpi[i] = find;
                      }
                    }
                    if(ckpi.length > 0) {
                      element.data.kpi = ckpi;
                    } else {
                      delete element.data.kpi;
                      for(var i in element.attributes)
                      {
                        if(element.attributes[i].data)
                        {
                          element.attributes[i].data.value = "none";
                        }
                      }
                    }
                  }
                  delete element.data.defer;
                  if(typeof finished == 'function')
                  {
                    finished("success!!");
                  }
                  def.resolve("success");
                });
              });
            }
          })(def);
        })
                 q.all(defers).then(function success(data){
          if(typeof callback == 'function')
          {
            callback();
          }
        });
                 */
      }

      scope.mode = "EDIT";
      scope.tabClick = function(mode) {
        if(mode) {
          scope.mode = mode;
          if(mode == "EDIT") {
            $(".free-board-left").removeClass("free-board-fold");
            $(".free-board-right").removeClass("free-board-full");
            timeout(function() {
              var target = $(".previewarea");
              target.removeClass("previewarea");
              target.addClass("drawarea");
              renderDataFn();
              status = "EDIT";
            }, 300)
          } else if(mode == "PREV") {
            $(".free-board-left").addClass("free-board-fold");
            $(".free-board-right").addClass("free-board-full");
            timeout(function() {
              var target = $(".drawarea");
              target.addClass("previewarea");
              target.removeClass("drawarea");
              renderDataFn(true);
              status = "PREV";
            }, 300);
          }
        } else {
          var savedata = scope.editData.$clone();
          if(savedata.groups) {
            for(var i in savedata.groups) {
              refineDataStructure.call(savedata.groups[i].layout);
            }
          } else {
            refineDataStructure.call(savedata.layout);
          }
          var popup = new commonMethodService();
          popup.createSystemPopupByJsonName('copyCode', {
            title: "页面代码",
            width: "80%"
          }, {
            message: "页面代码请点击复制，拷贝代码到剪切板",
            code: savedata
          });
        }
      };
      scope.editData = {
        layout: {
          id: $randomString(32),
          type: 'column',
          children: [],
          col: 12
        },
        setting: {
          "showNavi": false,
          "style": {
            "padding": "15px"
          }
        }
      };
      scope.cols = [{
        inx: 0,
        value: 12
      }];
      scope.drop = {};
      scope.colstyles = [{
        label: '自定义',
        value: []
      }, {
        label: '100%',
        value: [12]
      }, {
        label: '50% - 50%',
        value: [6, 6]
      }, {
        label: '66% - 33%',
        value: [8, 4]
      }, {
        label: '33% - 66%',
        value: [4, 8]
      }, {
        label: '33% - 33% - 33%',
        value: [4, 4, 4]
      }, {
        label: '25% - 25% - 25% - 25%',
        value: [3, 3, 3, 3]
      }];
      scope.gridSelector = {};
      scope.colChange = function(col) {
        scope.gridSelector.setValue(col);
      };
      scope.testFn = function() {
        scope.colstyle = scope.colstyles[0];
        scope.mm = 2;
      };
      scope.toolbarClick = function(toolbar) {
        if(scope.currentSelect == toolbar.id) {
          scope.currentSelect = undefined;
        } else {
          scope.currentSelect = toolbar.id;
        }
      };
      scope.showInstruction = function(item) {
        var temp;
        temp = item.show;
        if(item.show == undefined) {
          item.show = false;
        }
        for(var i in scope.toolbarListMap) {
          for(var j in scope.toolbarListMap[i].sub) {
            scope.toolbarListMap[i].sub[j].show = false;
          }
        }
        item.show = !temp;
      };
      scope.currentSelect = undefined;
      scope.colstyle = scope.colstyles[1];
      scope.onChange = function(cols, reset) {
        scope.tools.grid.children = cols.map(function(element) {
          var result = {
            type: 'column',
            children: [],
            col: element
          };
          return result
        });
        if(reset) {
          scope.colstyle = scope.colstyles[0];
        }
      };
      scope.onDelete = function(event) {
        var targetId = $(event.target).attr("id");
        var getElem, getParent;
        rootScope.dirty = true;
        scope.$broadcast("viewChanged");
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            getElem = element;
            getParent = parent;
          }
        });
        var find = getParent.find(function(elem) {
          return elem == getElem;
        });
        if(find) {
          getParent.remove(find);
        }
        renderDataFn();
      };
      scope.onCut = function(event) {
        var targetId = $(event.target).attr("id");
        var getElem, getParent;
        rootScope.dirty = true;
        scope.$broadcast("viewChanged");
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            getElem = element;
            getParent = parent;
          }
        });
        scope.clipBoard = getElem;
        /**
                 $$.loadExternalJs(['jquery-session'], function(){
            $.session.set("clipBoard", JSON.stringify(getElem))
         });*/
        var find = getParent.find(function(elem) {
          return elem == getElem;
        });
        if(find) {
          getParent.remove(find);
        }
        renderDataFn();
      };
      scope.onCopy = function(event) {
        var targetId = event.id;
        var find;
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            find = element;
          }
        });
        if(find) {
          scope.clipBoard = find.$clone().$extension({
            id: $randomString(32)
          });
        }
      };
      scope.onInsert = function(id) {
        var targetId = id;
        var getElem, getParent;
        scope.$apply(function() {
          rootScope.dirty = true;
        });
        scope.$broadcast("viewChanged");
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            getElem = element;
            getParent = parent;
          }
        });
        var inx = 0;
        for(var k in getParent) {
          if(getParent[k].id == getElem.id) {
            inx = k;
            break;
          }
        }
        if(scope.clipBoard) {
          var clone = scope.clipBoard.$clone();
          clone.id = $randomString(32);
          clone.traveseByChild(function(element) {
            if(element.id) {
              element.id = $randomString(32);
            }
          });
          if(inx != -1) {
            getParent.insertBefore(inx, clone);
          }
          renderDataFn();
        }
      };
      var body = $(['body']);
      scope.importGraphToFunc = function() {
        var popup = new commonMethodService();
        popup.createSystemPopupByJsonName('importCodeTemplate', {
          title: "导入JSON",
          width: "80%",
          on: {
            submit: function(obj) {
              var code = obj.code;
              var run = function(json) {
                var clone = json.$clone();
                var param = {
                  label: obj.title,
                  groupName: "Dashboard_template",
                  value: JSON.stringify(clone)
                };
                //json.type = param.name;
                var find = scope.toolbarListMap.find(function(elem) {
                  return elem.label == "功能模块"
                });

                //json.type = param.name;
                //toolbarListService[1]['sub'].push(json);
                //json.label = obj.title;

                configUIService.saveConfig(param, function(event) {
                  if(event.code == 0) {
                    var data = event.data;
                    var id = data.id;
                    var it = new item();
                    Object.defineProperty(it, "parent", {
                      enumerable: false,
                      value: find.sub
                    });
                    it.label = obj.title;
                    it.type = 'template _' + id;
                    it.$CLASS = "item";
                    it.render = "edit";
                    find.sub.push(it);
                    scope.tools['template _' + id] = clone;
                  }
                })
              };
              run(JSON.parse(code));
            }
          }
        }, {
          message: "页面代码请点击复制，拷贝代码到剪切板"
        });
      };
      scope.onInsertJSON = function(id) {
        var targetId = id;
        var getElem, getParent;
        scope.$apply(function() {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
          var popup = new commonMethodService();
          popup.createSystemPopupByJsonName('importCode', {
            title: "导入JSON",
            width: "80%",
            on: {
              submit: function(str) {
                var run = function(obj) {
                  curLayout().layout.traveseByChild(function(element, parent) {
                    if(element.id == targetId) {
                      getElem = element;
                      getParent = parent;
                    }
                  });
                  var inx = 0;
                  for(var k in getParent) {
                    if(getParent[k].id == getElem.id) {
                      inx = k;
                      break;
                    }
                  }
                  if(obj) {
                    var clone = remapData(obj);
                    clone.id = $randomString(32);
                    clone.traveseByChild(function(element) {
                      if(element.id) {
                        element.id = $randomString(32);
                      }
                    });
                    if(inx != -1) {
                      getParent.insertBefore(inx, clone);
                    }
                    renderDataFn();
                  }
                };
                run(JSON.parse(str));
              }
            }
          }, {
            message: "页面代码请点击复制，拷贝代码到剪切板"
          });
        });
      };
      scope.onPasteJSON = function(id) {
        var targetId = id;
        var getElem, getParent;
        scope.$apply(function() {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
          var popup = new commonMethodService();
          popup.createSystemPopupByJsonName('importCode', {
            title: "导入JSON",
            width: "80%",
            on: {
              submit: function(str) {
                var run = function(obj) {
                  curLayout().layout.traveseByChild(function(element, parent) {
                    if(element.id == targetId) {
                      getElem = element;
                    }
                  });
                  if(obj) {
                    var clone = remapData(obj);
                    clone.id = $randomString(32);
                    clone.traveseByChild(function(element) {
                      if(element.id) {
                        element.id = $randomString(32);
                      }
                    });
                    getElem.children.push(clone);
                    renderDataFn();
                  }
                };
                run(JSON.parse(str));
              }
            }
          }, {
            message: "页面代码请点击复制，拷贝代码到剪切板"
          });
        });
      };
      scope.onPaste = function(id) {
        var targetId = id;
        var getElem, getParent;
        scope.$apply(function() {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
        });
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            getElem = element;
          }
        });
        var clone = scope.clipBoard.$clone();
        clone.traveseByChild(function(element) {
          if(element.id) {
            element.id = $randomString(32);
          }
        });
        clone.id = $randomString(32);
        getElem.children.push(clone);
        renderDataFn();
      };
      scope.onDataChange = function(event, ui) {
        var getElem, getParent;
        var targetId = $(event.target).attr("id");
        for(var i in scope.resources) {
          scope.resources[i].checked = false;
        }
        for(var i in scope.kpis) {
          scope.kpis[i].checked = false;
        }
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            getElem = element;
            getParent = parent;
          }
        });
        rootScope.panelClose = panelCloseData;

        function panelCloseData() {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
          var filter = scope.resources.filter(function(element) {
            return element.checked == true;
          });
          scope.dataPanel.data.resource = filter;
          if(scope.dataPanel.data.resource && scope.dataPanel.data.kpi) {
            for(var i in scope.dataPanel.attributes) {
              if(scope.dataPanel.attributes[i].data) {
                if(scope.dataPanel.attributes[i].data.value == 'none') {
                  scope.dataPanel.attributes[i].data.value = scope.dataPanel.attributes[i].data.option[1].value;
                }
              }
            }
            if(scope.dataPanel.valueGroup) {
              scope.dataPanel.valueGroup.data.value = "value";
            }
          } else {
            for(var i in scope.dataPanel.attributes) {
              if(scope.dataPanel.attributes[i].data) {
                if(scope.dataPanel.attributes[i].data.value != 'none') {
                  scope.dataPanel.attributes[i].data.value = 'none';
                }
              }
            }
            if(scope.dataPanel.valueGroup) {
              scope.dataPanel.valueGroup.data.value = "custom";
            }
          }
          scope.selectData.$extension(scope.dataPanel);
          renderDataFn();
          scope.unitFilter = "";
          scope.unitFilterDisabled = false;
          scope.dataPanel = undefined;
          scope.editPanel = undefined;
          scope.resources = undefined;
          scope.kpis = undefined;
        }

        scope.selectData = getElem;
        dataPanelShow(getElem);
      };
      scope.selectTemp = function(temp) {
        scope.ctemp = temp;
      };
      scope.selectSpec = function(temp) {
        scope.cspec = temp;
      };
      scope.applySpecTemp = function() {
        if(scope.firstCreate) {
          scope.setting = new setting({
            theme: JSONparse(scope.editData.setting).theme || "default",
            data: scope.editData.setting
          });
        }
        if(scope.cspec.id != -1) {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
          var catchBind = {};
          var viewId = scope.cspec.viewId;
          viewFlexService.getViewById(viewId, function(event) {
            if(event.code == "0") {
              var content = JSON.parse(event.data.content);
              scope.editData = {
                layout: remapData(content.layout),
                setting: content.setting
              };
              var target = curLayout().layout;
              reconstruct(target);
            }
          })
        }
        scope.specialist = undefined;
        scope.cspec = undefined;
      };
      scope.applyTemp = function() {
        if(scope.firstCreate) {
          scope.setting = new setting({
            theme: JSONparse(scope.editData.setting).theme || "default",
            data: scope.editData.setting
          });
        }
        if(scope.ctemp.id != -1) {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
          var catchBind = {};
          var tpath = scope.ctemp.name;
          var path = "../../localdb/echartTemplate/" + scope.ctemp.json;
          var run = function(template) {
            if(template.groups == undefined) {
              delete scope.tabIndex;
              scope.editData = {
                layout: remapData(template.$clone().layout),
                setting: template.$clone().setting
              };
            } else {
              for(var i in template.groups) {
                template.groups[i].layout = remapData(template.groups[i].layout);
              }
              //console.log("temptemp", scope.editData);
              scope.editData = template;
              scope.tabIndex = 0;
            }
            var target = curLayout().layout;
            reconstruct(target);
          };
          if(window[tpath]) {
            run(window[tpath]);
          } else {
            Info.get(path, function(template) {
              window[tpath] = template;
              run(window[tpath]);
            });
          }
        }
        scope.template = undefined;
        scope.ctemp = undefined;
      };
      scope.openTemplate = function() {
        scope.template = window.template;
      };
      scope.openSpecialist = function() {
        scope.specialist = window.specialistView;
      };
      scope.templateClose = function() {
        if(scope.firstCreate) {
          scope.setting = new setting({
            theme: JSONparse(scope.editData.setting).theme || "default",
            data: scope.editData.setting
          });
        }
        scope.template = undefined;
        scope.ctemp = undefined;
      };
      scope.specialistClose = function() {
        if(scope.firstCreate) {
          scope.setting = new setting({
            theme: JSONparse(scope.editData.setting).theme || "default",
            data: scope.editData.setting
          });
        }
        scope.specialist = undefined;
        scope.cspec = undefined;
      };
      scope.inputJSON = function() {
        var popup = new commonMethodService();
        popup.createSystemPopupByJsonName('importCode', {
          title: "导入JSON",
          width: "80%",
          on: {
            submit: function(str) {
              var run = function(template) {
                if(template.groups == undefined) {
                  delete scope.tabIndex;
                  scope.editData = {
                    layout: remapData(template.$clone().layout),
                    setting: template.$clone().setting
                  };
                } else {
                  for(var i in template.groups) {
                    template.groups[i].layout = remapData(template.groups[i].layout);
                  }
                  scope.editData = template;
                  scope.tabIndex = 0;
                }
                var target = curLayout().layout;
                reconstruct(target);
                scope.template = undefined;
                scope.ctemp = undefined;
              };
              run(JSON.parse(str));
            }
          }
        }, {
          message: "页面代码请点击复制，拷贝代码到剪切板"
        });
      };
      scope.jsonClose = function() {
        scope.JsonInput = false;
        scope.JsonData = undefined;
      };
      scope.anchors = [{
        label: '不使用链接',
        value: 'none'
      }];
      scope.onSetting = function(event, ui) {
        var getElem, getParent;
        var targetId = $(event.target).attr("id");
        curLayout().layout.traveseByChild(function(element, parent) {
          if(element.id == targetId) {
            getElem = element;
            getParent = parent;
          }
        });
        var content = [];
        var pushData = function() {
          for(var i in arguments) {
            if(arguments[i].content) {
              this.push(arguments[i]);
            }
          }
        };
        var getType = function(source) {
          switch(source) {
            case "LINECHART":
              return "line";
              break;
            case "BARCHART":
              return "bar";
              break;
            case "GAUGECHART":
              return "gauge";
              break;
            case "PIECHART":
              return "pie";
              break;
            case "GAUGECHART":
              return "gauge";
              break;
            case "MAPCHARTDIST":
            case "SCATTERCHART":
            case "MAP":
              return "scatter";
              break;
            default:
              return "line";
              break;
          }
        };
        pushData.apply(content, [{
          $name: "template",
          label: "模板",
          content: getElem.template
        }, {
          $name: "parameters",
          label: "基本属性",
          content: getElem.parameters
        }, {
          $name: "source",
          label: "数据",
          content: getElem.data
        }, {
          $name: "style",
          label: "css样式",
          content: getElem.style
        }, {
          $name: "echart",
          label: "图表样式",
          defaulttype: getType(getElem.source),
          content: getElem.echart
        }, {
          $name: "advance",
          label: "高级设置",
          content: getElem.advance
        }]);
        popup.setContent(content, ui.element, getElem.$index, getElem.label, getElem.help, getElem.type);
        popup.open();
        popup.on("onPanelOpen", function() {

        });

        function extend(target, data) {
          var isDiff = false;
          for(var i in data) {
            if(data[i].isDiff == true) {
              isDiff = true;
              target[i] = data[i].data;
            }
          }
          return isDiff;
        }

        keySet.onCommandKeyWith('s', function() {
          popup.submitPanel(function(event) {
            if(event) {
              getElem.$index = event.index;
              //console.log("ooo", getElem);
              var dif = extend(getElem, event);
              if(dif) {
                rootScope.dirty = true;
                scope.$broadcast("viewChanged");
                timeout(function() {
                  renderDataFn();
                });
              }
              rootScope.saveDashboard();
            }
          });
        });
        popup.on("onPanelSubmit", function(event) {
          getElem.$index = event.index;
          var dif = extend(getElem, event);
          if(dif) {
            rootScope.dirty = true;
            scope.$broadcast("viewChanged");
            timeout(function() {
              renderDataFn();
            });
            keySet.onCommandKeyWith('s', function() {
              rootScope.saveDashboard();
            });
          }
        });
      };
      scope.onDrop = function(event, ui, before) {
        var JSONstring;
        var targetId = $(event.target).attr("id");
        var dragId = ui.draggable.attr("id");
        var viewId = ui.draggable.attr("viewId");
        rootScope.$apply(function() {
          rootScope.dirty = true;
          scope.$broadcast("viewChanged");
        });
        if(viewId) {
          if(dragId == 'add_topo') {
            JSONstring = scope.configure.find(function(elem) {
              return elem.viewId == viewId;
            });
          } else if(dragId == 'add_dashboard') {
            JSONstring = scope.dashboardViews.find(function(elem) {
              return elem.viewId == viewId;
            });
          } else if(dragId == 'add_designView') {
            JSONstring = scope.designView.find(function(elem) {
              return elem.viewId == viewId;
            });
          }
        }
        if(targetId != dragId) {
          if(dragId.indexOf("add_") == -1) {
            var getElem, getParent, clone = {};
            curLayout().layout.traveseByChild(function(element, parent) {
              if(element.id == dragId) {
                getElem = element;
                getParent = parent;
              }
            });
            clone = getElem.$clone();
            var find = getParent.find(function(elem) {
              return elem == getElem;
            });
            if(find) {
              getParent.remove(find);
            }
            var find, targetParent;
            curLayout().layout.traveseByChild(function(element, parent) {
              if(element.id == targetId) {
                find = element;
                targetParent = parent;
              }
            });
            if(before) {
              var inx = targetParent.indexOf(find);
              if(inx != -1) {
                targetParent.insertBefore(inx, clone);
              }
            } else {
              find.children.push(clone);
            }
            renderDataFn();
          } else {
            var find, pare, children, row;
            dragId = dragId.split("add_")[1];
            dragId = dragId.toLowerCase();
            var children = [];
            if (dragId == 'dashboard' || dragId == 'designview') {
              row = {};
            } else if(scope.tools.$clone()[dragId]) {
              row = remapData(scope.tools.$clone()[dragId])
            } else if(scope.tools.$clone()[dragId + 'chart']) {
              row = remapData(scope.tools.$clone()[dragId + 'chart']);
            } else {
              throw new Error("找不到视图!")
            }
            if(kqiModelId) {
              row.parameters.title = "专家曲线";
              row.parameters.subtitle = "专家曲线";
              row.data.kqiModel = {
                id: kqiModelId
              }
            }
            var run = function() {
              replaceCiKpi.call(row);
              curLayout().layout.traveseByChild(function(element, parent) {
                if(element.id == targetId) {
                  find = element;
                  pare = parent;
                }
              });
              if(before) {
                var inx = pare.indexOf(find);
                pare.insertBefore(inx, row);
              } else {
                find.children.push(row);
              }
              row.traveseByChild(function(element) {
                element.id = $randomString(32);
                element.traverse(function(attr, el) {
                  if(el.onChange) {
                    el.onChange = eval(el.onChange)
                  }
                });
              });
              curLayout().traverse(function(attr, elem) {
                var catchBind = {};
                if(elem.data) {
                  if(elem.data.bindTo) {
                    if(catchBind[elem.data.bindTo]) {
                      elem.data = catchBind[elem.data.bindTo];
                    } else {
                      catchBind[elem.data.bindTo] = elem.data;
                    }
                  }
                }
              });
              renderDataFn();
            };
            if(JSONstring) {
              row.viewId = parseInt(viewId);
              viewFlexService.getViewById(viewId, function (event) {
                if (JSON.parse(event.data.content)) {
                  if (dragId == 'dashboard' || dragId == 'designview') {
                    var dt = JSON.parse(event.data.content);
                    if(dt.hasOwnProperty('groups')) {
                      row = {
                        id: $randomString(),
                        type: "tab",
                        children: []
                      };
                      for(var i in dt.groups) {
                        row.children.push({
                          id: $randomString(),
                          "tabName": dt.groups[i].label,
                          "tabId": i,
                          "type": "tabItem",
                          children: dt.groups[i].layout.children
                        })
                      }
                    } else if(dt.hasOwnProperty('data')) {
                      dt.data = dt.data.$remapByChild(function(element) {
                        var source = element.source;
                        var rs = new commonMethodService(element);
                        rs.setRootTarget(scope.editData);
                        return rs;
                      });
                      row = {
                        id: $randomString(),
                        type: "row",
                        children: [dt.data]
                      }
                    } else if(dt.hasOwnProperty('layout')) {
                      dt.layout = dt.layout.$remapByChild(function(element) {
                        var source = element.source;
                        var rs = new commonMethodService(element);
                        rs.setRootTarget(scope.editData);
                        return rs;
                      });
                      row = {
                        id: $randomString(),
                        type: "row",
                        children: [dt.layout]
                      }
                    }
                  } else {
                    row.JSON = JSON.parse(event.data.content);
                  }
                } else {
                  row.JSON = {};
                }
                run();
              });
            } else {
              run();
            }
          }
        }
      };

      function curLayout() {
        var rs;
        if(scope.editData.groups == undefined) {
          return scope.editData;
        } else {
          if(scope.tabIndex == undefined) {
            scope.tabIndex = 0;
          }
          var rs = {
            layout: scope.editData.groups[scope.tabIndex].layout,
            setting: scope.editData.setting
          };
          return rs;
        }
      }

      scope.addEditDataGroup = function() {
        rootScope.dirty = true;
        scope.$broadcast("viewChanged");
        if(scope.editData.groups == undefined) {
          var clone = scope.editData.$clone();
          scope.editData = {
            groups: [{
              id: 0,
              label: '导航页',
              path: 'page0',
              layout: clone.layout
            }],
            setting: clone.setting
          };
          scope.tabIndex = 0;
        } else {
          scope.editData.groups.push({
            label: '导航页',
            path: 'page' + (scope.editData.groups.length),
            layout: {
              id: $randomString(32),
              type: 'column',
              children: [],
              col: 12
            }
          });
          for(var i in scope.editData.groups) {
            scope.editData.groups[i].id = i;
          }
          scope.tabIndex = scope.editData.groups.length - 1;
        }
        if(scope.mode == 'EDIT') {
          renderDataFn();
        } else {
          renderDataFn(true)
        }
      };
      scope.removeEditDataGroup = function(tab) {
        rootScope.dirty = true;
        scope.$broadcast("viewChanged");
        scope.editData.groups = scope.editData.groups.filter(function(elem) {
          return tab.id != elem.id;
        });
        if(scope.editData.groups.length == 1) {
          scope.editData = {
            layout: scope.editData.groups[0].layout,
            setting: scope.editData.setting
          };
          scope.tabIndex = undefined;
        } else {
          scope.tabIndex = 0;
        }
        if(scope.mode == 'EDIT') {
          renderDataFn();
        } else {
          renderDataFn(true)
        }
      };
      scope.renameEditDataGroup = function(tab) {
        var find = scope.editData.groups.find(function(elem) {
          return elem.id == tab.id;
        });
        var fnlist = [{
          label: '确定',
          icon: 'btn btn-success',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            rootScope.dirty = true;
            scope.$broadcast("viewChanged");
            find.label = scope.dialogBox.input[0].value;
            find.path = scope.dialogBox.input[1].value;
            scope.dialogBox = undefined;
          }
        }, {
          label: '取消',
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            scope.dialogBox = undefined;
          }
        }];
        scope.dialogBox = {
          title: {
            label: '设置导航信息'
          },
          input: [{
            value: find.label,
            label: '导航页名称',
            placeholder: '修改导航名称'
          }, {
            value: find.path,
            label: '导航路径',
            placeholder: '修改导航路径'
          }],
          fnlist: fnlist
        };
      };
      scope.selectEditDataGroup = function(inx) {
        scope.tabIndex = inx;
        if(scope.mode == 'EDIT') {
          renderDataFn();
        } else {
          renderDataFn(true)
        }
      }
    }
  ]);
});