define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.initController('dashboardmanageCtrl', ['$scope', '$q', '$rootScope', '$location', '$routeParams', '$timeout', 'userRoleUIService', 'resourceUIService', 'userLoginUIService', 'Info', 'growl', 'userEnterpriseService', 'viewFlexService', 'userDomainService', "$window", "freeboardservice", 'dialogue', "ngDialog",
    function(scope, q, rootScope, $location, $routeParams, timeout, userRoleUIService, resourceUIService, userLoginUIService, Info, growl, userEnterpriseService, viewFlexService, userDomainService, window, freeboardservice, dialogue, ngDialog) {
      var type, serviceView, charRoot, views, domainlist, domaintree, enterpriseUsers, widget, config, allRoles;
      var treeData;
      var TEXT = {
        "SUBMIT": "确定",
        "CANCEL": "取消"
      };
      var viewType = $routeParams.viewType;
      scope.viewId = $routeParams.viewId;
      var createTree = function(data, hierarchy) {
        var self = this;
        var all = {
          viewId: 0,
          viewTitle: "根层级",
          children: []
        };
        var root = {
          children: [all]
        };
        var loop = function(elem) {
          elem.viewHierarchy = elem.viewHierarchy ? elem.viewHierarchy : 0;
          var addTo = function() {};
          var checkSelfViewId = function() {
            if(self) {
              return elem.viewId != self.viewId;
            } else {
              return true;
            }
          };
          if(checkSelfViewId()) {
            addTo = function(target) {
              elem.parent = target;
              Object.defineProperty(elem, "parent", {
                enumerable: false
              });
              if(!target.children) {
                target.children = [];
              }
              target.children.push(elem);
            }
          } else {
            addTo = function(target) {
              elem.parent = target;
              Object.defineProperty(elem, "parent", {
                enumerable: false
              });
              if(!target._children) {
                target._children = [];
              }
              target._children.push(elem);
            };
          }
          var find = data.find(function(el) {
            return el.viewId == elem.viewHierarchy;
          });
          if(find) {
            elem.parent = find;
            addTo(find);
          } else {
            addTo(all);
          }
        };
        for(var i in data) {
          delete data[i].children;
          delete data[i]._children;
        }
        for(var i in data) {
          loop(data[i])
        }
        return root;
      };
      var createlist = function(tree) {
        var rs = [];
        var traverse = function(data) {
          rs.push(data);
          if(data.hasOwnProperty("domainInfos")) {
            for(var i in data.domainInfos) {
              traverse(data.domainInfos[i]);
            }
          }
        };
        traverse(tree);
        return rs;
      }
      var editAlertView = function(view) {
        var namelist = views.filter(function(elem) {
          if(view) {
            return elem.viewTitle != view.viewTitle;
          } else {
            return true;
          }
        }).map(function(elem) {
          return elem.viewTitle;
        });
        var newTitle = $$.duplicateName("创建告警组", namelist);
        var run = function(domainlist, rootModel) {
          var stateToArr = function(target, data) {
            if(data) {
              var arr = data.split(",");
              var loop = function(elem) {
                elem.value = arr.indexOf(elem.replacer + "") > -1;
              };
              for(var i in target) {
                loop(target[i]);
              }
            }
            return target;
          };
          var getData = function(data) {
            var param = {};
            var loop = function(index, elem) {
              var type = elem.type;
              var value;
              if(type == "checkbox") {
                value = [];
                for(var i in elem.options) {
                  if(elem.options[i].value) {
                    value.push(elem.options[i].replacer);
                  }
                }
                value = value.toString();
              } else {
                value = elem.value;
              }
              param.$attr(elem.data, value);
            };
            for(var i in data) {
              loop(i, data[i]);
            }
            param.content = JSON.stringify(param.content);
            return param;
          };
          var alertOption = [{
            label: "新产生",
            replacer: 0
          }, {
            label: "已确认",
            replacer: 5
          }, {
            label: "处理中",
            replacer: 10
          }, {
            label: "已解决",
            replacer: 20
          }];
          var severities = [{
            label: "警告",
            replacer: 1,
            value: false
          }, {
            label: "次要",
            replacer: 2,
            value: false
          }, {
            label: "重要",
            replacer: 3,
            value: false
          }, {
            label: "严重",
            replacer: 4,
            value: false
          }];
          var getViewById_back = function(event) {
            if(event.code == "0") {
              var dt, domainPath = null;
              if(event.data) {
                if(event.data.content != null) {
                  dt = JSON.parse(event.data.content);
                } else {
                  dt = {};
                }
                domainPath = event.data.domainPath
              }
              console.log(view)
              scope.dialog = {
                title: charRoot + "信息",
                input: [{
                  "label": "告警视图名称",
                  "value": view ? view.viewTitle : newTitle,
                  "data": "viewTitle",
                  "type": "input",
                  "maxlength": 32,
                  "composory": true,
                  "events": {
                    "change": function(item) {
                      if(namelist.indexOf(item.value) != -1) {
                        item.error = "告警视图以存在，请更换视图名称";
                        scope.dialog.input[0].right = false;
                      } else if(item.value == "") {
                        item.error = "视图名称不可为空";
                        scope.dialog.input[0].right = false;
                      } else {
                        item.error = undefined;
                        scope.dialog.input[0].right = true;
                      }
                    }
                  }
                }, {
                  "label": "管理域",
                  "value": domainPath,
                  "data": "domainPath",
                  "type": "tree",
                  "key": "domainPath",
                  "mark": "domainInfos",
                  "options": domaintree,
                  "composory": true,
                  "disabled": view != undefined,
                  "right": domainPath ? true : false,
                  "fontsize": "12px",
                  "width": "200px",
                  "events": {
                    "change": function(item) {
                      if(item) {
                        scope.dialog.input[1].right = true;
                      };
                    }
                  }
                }, {
                  "label": "设备模板",
                  "value": view ? dt.modelIds : null,
                  "data": "content/modelIds",
                  "type": "multiple",
                  "options": rootModel,
                  "fontsize": "12px",
                  "width": "200px"
                }, {
                  "value": view ? dt.pageSize : 1000,
                  "label": "取得告警数量",
                  "data": "content/pageSize",
                  "type": "number",
                  "maxlength": 99999999,
                  "minlength": 0,
                  "events": {
                    "change": function(item) {
                      var regExp = /^[0-9]*$/;
                      if(item.value) {
                        var test = regExp.test(item.value);
                        if(item.value.toString().length > 8) {
                          item.error = "长度不能大于8位数";
                          scope.dialog.input[3].right = false;
                        } else {
                          if(test) {
                            item.error = undefined;
                            scope.dialog.input[3].right = true;
                          } else {
                            item.error = "请输入整数";
                            scope.dialog.input[3].right = false;
                          }

                        }
                      }
                    }
                  }
                }, {
                  "label": "内容关键词",
                  "value": view ? dt.messageFilter : "",
                  "data": "content/messageFilter",
                  "maxlength": 32,
                  "type": "input"
                }, {
                  "label": "告警状态",
                  "data": "content/states",
                  "type": "checkbox",
                  "options": stateToArr(alertOption, view ? dt.states : "")
                }, {
                  "label": "告警级别",
                  "data": "content/severities",
                  "type": "checkbox",
                  "options": stateToArr(severities, view ? dt.severities : "")
                }, {
                  "label": "视图描述",
                  "value": view ? view.description : null,
                  "data": "description",
                  "type": "textarea",
                  "maxlength": 200,
                  "composory": false,
                  "width": "200px"
                }],
                button: [{
                  label: TEXT.SUBMIT,
                  icon: "btn btn-primary",
                  disabledFn: function() {
                    return scope.dialog.input.some(function(elem) {
                      return elem.right == false;
                    });
                  },
                  fn: function() {
                    ngDialog.close();
                    var param = getData(scope.dialog.input);
                    var fn;
                    param.viewType = viewType;
                    if(view) {
                      param.viewId = view.viewId;
                      fn = viewFlexService.updateView;
                    } else {
                      fn = viewFlexService.addView;
                    }
                    fn(param, function(event) {
                      if(event.code == "0") {
                        var newView = event.data;
                        if(view) {
                          view.viewTitle = event.data.viewTitle;
                          view.content = event.data.content;
                          view.createTime = event.data.createTime;
                          view.updateTime = event.data.updateTime;
                          view.description = event.data.description;
                          view.creatorName = event.data.creatorName;
                          growl.success("告警视图修改成功", {});
                        } else {
                          //views[views.length - 1].insertAfter(event.data);
                          var arr = event.data.domainPath.split("/");
                          var domainID, deferred = q.defer();
                          if(arr.length > 2) {
                            domainID = arr[arr.length - 2];
                          };
                          if(!scope[domainID]) {
                            scope[domainID] = deferred.promise;
                            userDomainService.queryDomainInfo(domainID, function(event) {
                              if(event.code == "0") {
                                scope[domainID] = event.data;
                                newView.domainObj = scope[domainID];
                                views.pushbefore(newView);
                                growl.success("创建告警视图成功", {});
                              }
                            })
                          } else {
                            if(scope[domainID].hasOwnProperty("$$state")) {
                              scope[domainID].then(function() {
                                newView.domainObj = scope[domainID];
                                views.pushbefore(newView);
                                growl.success("创建告警视图成功", {});
                              });
                            } else {
                              newView.domainObj = scope[domainID];
                              views.pushbefore(newView);
                              growl.success("创建告警视图成功", {});
                            }
                          };
                        };
                      }
                    })
                  }
                }, {
                  label: TEXT.CANCEL,
                  icon: "btn btn-default",
                  fn: function() {
                    ngDialog.close();
                  }
                }]
              };
            }
          };
          if(view) {
            viewFlexService.getViewById(view.viewId, getViewById_back)
          } else {
            getViewById_back({
              code: 0,
              data: null
            })
          };
          ngDialog.open({
            template: '../partials/dialogue/config_alert_dia.html',
            className: 'ngdialog-theme-plain',
            scope: scope
          })
        };
        var checkAllLoaded = function() {
          if(window['domainlist'] == undefined) {
            userDomainService.queryDomainTree(userLoginUIService.user.userID, function(event) {
              if(event.code == 0) {
                window['domainlist'] = event.data;
                checkAllLoaded();
              }
            })
          } else if(window['rootModel'] == undefined) {
            var getRootModel_back = function(event) {
              if(event.code == 0) {
                /** window['rootModel'] = [event.data] */

                window['rootModel'] = [];
                var getModels_back = function(event) {
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
        ngDialog.close();
      };
      var dashboard_run = function(callback) {
        /**
        var path = "../localdb/freeboard.json";
        var standardDashboard, machineDashboard;
        var Info_back = function(info){
          standardDashboard = info.standardDashboard;
          machineDashboard = info.machineDashboard;
          var getManageDashboard_back = function(event){
            if(event.code == 0) {
              if(event.data != null) {
                if(typeof event.data.content) {
                  var dat = JSON.parse(event.data.content);
                  var dashboardView = event.data;
                  dashboardView.JSON = dat;
                  if(event.data.viewType == "dashboard") {
                    if(checkVersion(dat) == "version1_machine") {
                      scope.maindashboard = machineDashboard;
                    } else if(checkVersion(dat) == "version1_standard") {
                      scope.maindashboard = standardDashboard;
                    } else {
                      scope.maindashboard = dashboardView.JSON;
                    }
                  } else {
                    scope.maindashboard = standardDashboard;
                  }
                }
              } else {
                scope.maindashboard = standardDashboard;
              }
              callback();
            }
          };
          viewFlexService.getManageDashboard(getManageDashboard_back)
        };
        Info.get(path, Info_back);
         */
        callback();
      };
      var configure_run = function(callback) {
        callback();
      };
      var configAlert_run = function(callback) {
        callback();
      };
      var designView_run = function(callback) {
        callback();
      };
      var deleteGroup_common = function(event) {
        var self = event;
        var filter = event.filter(function(elem) {
          return elem.creator == userLoginUIService.user.userID;
        });
        var viewIds = filter.map(function(elem) {
          return elem.viewId
        });
        var viewTitles = filter.map(function(elem) {
          return elem.viewTitle;
        });
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-success',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
            viewFlexService.deleteViews(viewIds, function(event) {
              if(event.code == 0) {
                var success = event.$attr("data/successObj");
                var fail = event.$attr("data/failObj");
                growl.success(charRoot + "删除成功" + success.length + "个,失败" + (self.length - success.length) + "个", {});
                var loop = function(itm) {
                  if(success.indexOf(itm.viewId) != -1) {
                    itm.remove()
                  }
                };
                for(var i in self) {
                  loop(self[i]);
                };
              }
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
          }
        }];
        scope.dialog = {
          title: {
            label: '提示'
          },
          description: {
            label: '确认要删除此' + charRoot + '吗？'
          },
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia_prompt.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      };
      var deleteGroup_configure = function(event) {
        var self = event;
        var viewIds = event.map(function(elem) {
          return elem.viewId
        });
        var viewTitles = event.map(function(elem) {
          return elem.viewTitle;
        });
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-success',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
            viewFlexService.deleteViews(viewIds, function(event) {
              if(event.code == 0) {
                var success = event.$attr("data/successObj");
                var fail = event.$attr("data/failObj");
                growl.success(charRoot + "删除成功" + success.length + "个,失败" + fail.length + "个", {});
                var loop = function(view) {
                  var lp = function(viewId) {
                    if(view.viewHierarchy == viewId) {
                      view.viewHierarchy = 0;
                      viewFlexService.updateView(view, function(event) {
                        growl.success(charRoot + " [ " + event.data.viewTitle + " ] 的父节点被放回根节点。", {});
                      });
                    }
                  }
                  for(var i in success) {
                    lp(success[i])
                  }
                };
                for(var i in views) {
                  loop(views[i])
                }
                createTree(views);
                // growl.success(charRoot + "删除成功", {});
                var loopCur = function(itm) {
                  if(success.indexOf(itm.viewId) != -1) {
                    itm.remove()
                  }
                };
                for(var i in self) {
                  loopCur(self[i]);
                };
              }
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
          }
        }];
        scope.dialog = {
          title: {
            label: '提示'
          },
          description: {
            label: '该视图下的子节点将会被移动到根节点下，确认删除？'
          },
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia_prompt.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      };
      var duplicateClick = function(event) {
        var self = event;
        var duplicateNameBase = event.viewTitle;
        var content = event.content;
        var namelist = views.map(function(elem) {
          return elem.viewTitle;
        });
        var duplicateName = $$.duplicateName(duplicateNameBase, namelist);
        var fnlist = [{
          label: '创建',
          icon: 'btn btn-primary',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function(event) {
            var viewTitle = event.input[0].value
            var viewId = self.viewId;
            var getViewById_back = function(event) {
              if(event.code == 0) {
                var param = event.data;
                param.viewTitle = viewTitle;
                delete param.viewId;
                delete param.updateTime;
                viewFlexService.addView(param, function(event) {
                  if(event.code == 0) {
                    growl.success("复制视图成功", {});
                    var item = event.data;
                    var getDomainId = function(domainPath) {
                      var arr = domainPath.split("/");
                      if(arr.length > 2) {
                        return arr[arr.length - 2];
                      }
                    };
                    var domainID = getDomainId(item.domainPath);
                    var finished = function() {
                      if(item.template) {
                        if(item.template.resourceType == "project") {
                          if(item.template.projectId) {
                            if(scope["allprojects"]) {
                              item.templateStr = scope["allprojects"][item.template.projectId].label;
                            }
                          }
                        }
                      } else {
                        item.templateStr = "普通";
                      }
                      item.domainObj = scope[domainID];
                      self.insertAfter(item);
                      createTree(views);
                      ngDialog.close();
                    };
                    if(scope[domainID]) {
                      finished();
                    } else {
                      userDomainService.queryDomainInfo(domainID, function(event) {
                        if(event.code == "0") {
                          finished();
                        }
                      });
                    };
                  }
                })
              } else {
                growl.error(event.message);
              }
            };
            var error = function(err) {
              growl.error(err);
            };
            viewFlexService.getViewById(viewId, getViewById_back, error)
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
            ngDialog.close();
          }
        }];
        scope.dialog = {
          title: {
            label: '复制视图'
          },
          input: [{
            value: duplicateName,
            label: '新视图名称',
            placeholder: '新视图名称',
            maxlength: 32,
            onChange: function(event) {
              var value = this.value;
              var find = views.find(function(element) {
                return element.viewTitle == value;
              });
              if(find) {
                event.error = "此视图名已被占用，请更换.";
                fnlist[0].disabled = true;
              } else {
                if(value == "") {
                  event.error = "视图名称不可为空.";
                  fnlist[0].disabled = true;
                } else {
                  event.error = null;
                  fnlist[0].disabled = false;
                }
              }
            }
          }],
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      };
      var releaseView = function(viewTitles, viewIds, releasedIds, callback) {
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-success',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            dialogue.close();
            viewFlexService.releaseViews(viewIds, function(event) {
              if(event.code == 0) {
                if(viewIds.length == 1) {
                  growl.success("发布" + charRoot + "成功", {});
                } else {
                  growl.success("发布" + charRoot + ",成功" + event.data.successObj.length + "个,失败" + event.data.failObj.length + "个", {});
                }
                callback(event.data.successObj);
              }
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            dialogue.close();
          }
        }];
        dialogue.open({
          title: {
            label: '提示'
          },
          description: {
            label: '确认要发布' + charRoot + '吗？'
          },
          fnlist: fnlist
        });
      };
      var releaseGroup = function(event) {
        var self = event;
        var viewIds = event.filter(function(elem) {
          return elem.releaseStatus == 0;
        }).map(function(elem) {
          return elem.viewId;
        });
        var releasedIds = event.filter(function(elem) {
          return elem.releaseStatus == 1;
        }).map(function(elem) {
          return elem.viewId;
        });
        var viewTitles = event.map(function(elem) {
          return elem.viewTitle;
        });
        releaseView(viewTitles, viewIds, releasedIds, function(data) {
          for(var i in self) {
            self[i].releaseStatus = 1;
          }
          views.removeAllChecked();
          //console.log("viewTitle", data);
        });
      };
      var releaseClick = function(event) {
        var self = event;
        var viewId = event.viewId;
        var viewTitle = event.viewTitle;
        releaseView([viewTitle], [viewId], event.viewType, function(data) {
          //console.log("viewTitle", data);
          self.releaseStatus = 1;
        });
      };
      var addNew_config = function(event) {
        location.href = "../app-configure/index.html#/configure/" + 0;
      };
      var configure_edit = function(event) {
        var self = event;
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-primary',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function(event) {
            var viewHierarchy = event.input[1].value;
            var description = event.input[2].value;
            description = description ? description : "";
            var param = {
              viewType: "configure",
              viewId: self.viewId,
              viewTitle: event.input[0].value,
              viewHierarchy: viewHierarchy,
              description: description
            };
            viewFlexService.updateView(param, function(event) {
              if(event.code == 0) {
                growl.success("组态视图修改成功", {});
                ngDialog.close();
                self.viewTitle = event.data.viewTitle;
                self.description = event.data.description;
                self.viewHierarchy = viewHierarchy;
                self.createTime = event.data.createTime;
                self.updateTime = event.data.updateTime;
                createTree(views);
              }
            })
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
          }
        }];
        var viewHierarchy = event.viewHierarchy ? event.viewHierarchy : 0;
        var available = createTree.call(self, views, self.viewHierarchy);
        scope.dialog = {
          title: {
            label: charRoot + '信息'
          },
          input: [{
            value: event.viewTitle,
            composory: true,
            type: "input",
            label: '组态视图名称',
            placeholder: '组态视图名称',
            maxlength: 32,
            onChange: function(event) {
              var value = this.value;
              var find = views.find(function(element) {
                return element.viewTitle == value && element.viewTitle != event.viewTitle;
              });
              if(find) {
                event.error = "此视图名已被占用，请更换.";
                fnlist[0].disabled = true;
              } else {
                if(value == "") {
                  event.error = "视图名称不可为空.";
                  fnlist[0].disabled = true;
                } else {
                  event.error = null;
                  fnlist[0].disabled = false;
                }
              }
            }
          }, {
            value: viewHierarchy,
            type: "tree",
            lb: "viewTitle",
            fontsize: "12px",
            width: "200px",
            key: "viewId",
            mark: "children",
            composory: false,
            label: '选择父级视图',
            placeholder: '层级结构，例如 0/1',
            options: available
          }, {
            value: event.description,
            type: "textarea",
            maxlength: 200,
            composory: false,
            label: '描述信息',
            placeholder: '描述信息'
          }],
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      };
      var sethomeClick = function(event, source) {
        var self = event;
        scope.maindashboard = event;
        var content = JSON.parse(event.content);
        var viewTitle = event.viewTitle;
        content.viewId = event.viewId;
        var param = {
          viewTitle: 'dashboard',
          viewName: 'dashboard',
          viewType: "dashboard",
          content: JSON.stringify(content)
        };
        viewFlexService.saveManageDashboard(param, function(event) {
          if(event.code == 0) {
            if(event.data != null) {
              growl.success("设定[" + viewTitle + "]为运营首页", {});
              scope.maindashboard = JSON.parse(event.data.content);
              for(var i in source) {
                source[i].homeview = false;
              }
              self.homeview = true;
            } else {
              growl.error("错误:运营首页保存失败", {});
            }
          } else {
            growl.error("错误:" + event.message, {});
          }
        });
      };
      var deleteClickCommon = function(event) {
        var self = event;
        var viewId = event.viewId;
        var viewTitle = event.viewTitle;
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-success',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
            viewFlexService.deleteView(viewId, function(event) {
              if(event.code == 0) {
                growl.success(charRoot + "删除成功", {});
                self.remove();
              }
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
          }
        }];
        scope.dialog = {
          title: {
            label: '提示'
          },
          description: {
            label: '确认要删除' + charRoot + '吗？'
          },
          fnlist: fnlist
        };
        ngDialog.open({
          template: '../partials/dialogue/common_dia_prompt.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      };
      var deleteClickConfigure = function(event) {
        var self = event;
        var viewId = event.viewId;
        var viewTitle = event.viewTitle;
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-primary',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            dialogue.close();
            viewFlexService.deleteView([viewId], function(event) {
              if(event.code == 0) {
                var loop = function(view) {
                  if(view.viewHierarchy == viewId) {
                    view.viewHierarchy = 0;
                    viewFlexService.updateView(view, function(event) {
                      growl.success(charRoot + " [ " + event.data.viewTitle + " ] 的父节点被放回根节点。", {});
                    });
                  }
                };
                for(var i in views) {
                  loop(views[i])
                }
                createTree(views);
                growl.success(charRoot + "删除成功", {});
                self.remove();
              }
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            dialogue.close();
          }
        }];
        dialogue.open({
          title: {
            label: '提示'
          },
          description: {
            label: '该视图下的子节点将会被移动到根节点下，确认删除？'
          },
          fnlist: fnlist
        });
      };
      var editViewInfo = function(event) {
        var self = event;
        var fnlist = [{
          label: TEXT.SUBMIT,
          icon: 'btn btn-primary',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          disabledFn: function() {
            return this.disabled;
          },
          fn: function(event) {
            ngDialog.close();
            var view = self.$clone();
            view.viewTitle = scope.dialog.input[0].value;
            view.description = scope.dialog.input[1].value;
            viewFlexService.updateView(view, function(event) {
              if(event.code == "0") {
                self.viewTitle = event.data.viewTitle;
                self.description = event.data.description;
                self.updateTime = event.data.updateTime;
                growl.success(charRoot + "修改成功");
              }
            });
          }
        }, {
          label: TEXT.CANCEL,
          icon: 'btn btn-default',
          style: {
            width: '50%',
            'border-radius': 0,
            'font-size': '18px',
            'font-weight': 'bold',
            'padding': 10
          },
          fn: function() {
            ngDialog.close();
          }
        }];
        scope.dialog = {
          title: {
            label: charRoot + '信息'
          },
          input: [{
            value: event.viewTitle,
            composory: true,
            type: "input",
            label: charRoot + '名称',
            placeholder: charRoot + '名称',
            maxlength: 32,
            onChange: function(event) {
              var value = this.value;
              var namelist = views.filter(function(elem) {
                return elem.viewId != self.viewId
              }).map(function(elem) {
                return elem.viewTitle;
              });
              if(namelist.indexOf(value) != -1) {
                event.error = "此视图名已被占用，请更换.";
                fnlist[0].disabled = true;
              } else {
                if(value == "") {
                  event.error = "视图名称不可为空.";
                  fnlist[0].disabled = true;
                } else {
                  event.error = null;
                  fnlist[0].disabled = false;
                }
              }
            }
          }, {
            value: event.description,
            type: "textarea",
            maxlength: 200,
            composory: false,
            label: '描述信息',
            placeholder: '新视图名称'
          }],
          fnlist: fnlist
        }
        ngDialog.open({
          template: '../partials/dialogue/common_dia.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        })
      };
      var viewConfigAlert = function(view) {
        var run = function() {
          if(view) {
            var stateToArr = function(target, data) {
              var arr = data.split(",");
              var loop = function(elem) {
                elem.value = arr.indexOf(elem.replacer + "") > -1;
              };
              for(var i in target) {
                loop(target[i]);
              }
              return target;
            };
            var getData = function(data) {
              var param = {};
              var loop = function(index, elem) {
                var type = elem.type;
                var value;
                if(type == "checkbox") {
                  value = [];
                  for(var i in elem.options) {
                    if(elem.options[i].value) {
                      value.push(elem.options[i].replacer);
                    }
                  }
                  value = value.toString();
                } else {
                  value = elem.value;
                }
                param.$attr(elem.data, value);
              };
              for(var i in data) {
                loop(i, data[i]);
              }
              param.content = JSON.stringify(param.content);
              return param;
            };
            var alertOption = [{
              label: "新产生",
              replacer: 0
            }, {
              label: "已确认",
              replacer: 5
            }, {
              label: "处理中",
              replacer: 10
            }, {
              label: "已解决",
              replacer: 20
            }];
            var severities = [{
              label: "警告",
              replacer: 1,
              value: false
            }, {
              label: "次要",
              replacer: 2,
              value: false
            }, {
              label: "重要",
              replacer: 3,
              value: false
            }, {
              label: "严重",
              replacer: 4,
              value: false
            }];
            var getViewById_back = function(event) {
              if(event.code == "0") {
                var dt = JSON.parse(event.data.content);
                scope.dialog = {
                  title: charRoot + "信息",
                  input: [{
                    "label": "告警组名称",
                    "value": view ? view.viewTitle : newTitle,
                    "data": "viewTitle",
                    "type": "text"
                  }, {
                    "label": "视图描述",
                    "value": view ? view.description : "",
                    "data": "viewTitle",
                    "type": "text"
                  }, {
                    "label": "管理域",
                    "value": view ? dt.domain : null,
                    "data": "content/domain",
                    "type": "text",
                    "format": function(value) {
                      var find = domainlist.find(function(elem) {
                        return elem.domainPath == view.domainPath;
                      });
                      return find ? find.name : "-";
                    }
                  }, {
                    "label": "设备模板",
                    "value": view ? dt.modelIds : null,
                    "data": "content/modelIds",
                    "type": "text",
                    "format": function(value) {
                      var filter = rootModel.filter(function(elem) {
                        return dt.modelIds.indexOf(elem.id) != -1;
                      }).map(function(elem) {
                        return elem.label;
                      });
                      return filter.toString();
                    }
                  }, {
                    "value": view ? dt.pageSize : 1000,
                    "label": "取得告警数量",
                    "data": "content/pageSize",
                    "type": "number"
                  }, {
                    "label": "内容关键词",
                    "value": view ? dt.messageFilter : "",
                    "data": "content/messageFilter",
                    "type": "text",
                    "format": function(value) {
                      return value ? value : "-";
                    }
                  }, {
                    "label": "告警状态",
                    "value": stateToArr(alertOption, view ? dt.states : ""),
                    "data": "content/states",
                    "type": "text",
                    "format": function() {
                      var str = this.value.filter(function(elem) {
                        return elem.value == true;
                      }).map(function(elem) {
                        return elem.label;
                      });
                      return str.length > 0 ? str.toString() : "-";
                    }
                  }, {
                    "label": "告警级别",
                    "value": stateToArr(severities, view ? dt.severities : ""),
                    "data": "content/severities",
                    "type": "text",
                    "format": function() {
                      var str = this.value.filter(function(elem) {
                        return elem.value == true;
                      }).map(function(elem) {
                        return elem.label;
                      });
                      return str.length > 0 ? str.toString() : "-";
                    }
                  }],
                  button: [{
                    label: "返回",
                    icon: "btn btn-primary",
                    fn: function() {
                      ngDialog.close();
                    }
                  }]
                };
              }
            }
            viewFlexService.getViewById(view.viewId, getViewById_back)
          }
        };
        var checkAllLoaded = function() {
          if(window['domainlist'] == undefined) {
            userDomainService.queryDomainTree(userLoginUIService.user.userID, function(event) {
              if(event.code == 0) {
                window['domainlist'] = event.data;
                checkAllLoaded();
              }
            })
          } else if(window['rootModel'] == undefined) {
            var getRootModel_back = function(event) {
              if(event.code == 0) {
                /** window['rootModel'] = [event.data]*/

                window['rootModel'] = [];
                var getModels_back = function(event) {
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
          template: '../partials/dialogue/config_alert_dia.html',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      }
      var add3DNewClick = (function(viewType) {
        if(viewType == 'configure') {
          return function() {
            window.open("../app-editor3/index.html#/configure/0", "_blank");
          }
        }
      })(viewType);
      var addNewClick = (function(viewType) {
        if(viewType == 'dashboard') {
          return function() {
            window.open("../app-freeboard/index.html#/freeboard/view/dashboard", "_blank");
          }
        } else if(viewType == 'configAlert') {
          return function() {
            editAlertView();
          };
        } else if(viewType == 'configure') {
          return addNew_config;
        } else if(viewType == 'designView') {
          return function() {
            window.open("../app-freeboard/index.html#/editor/view/editor", "_blank");
          }
        }
      })(viewType);
      var deleteClick = (function(viewType) {
        if(viewType == 'dashboard') {
          return deleteClickCommon;
        } else if(viewType == 'configAlert') {
          return deleteClickCommon;
        } else if(viewType == 'configure') {
          return deleteClickConfigure
        } else if(viewType == 'designView') {
          return deleteClickCommon;
        }
      })(viewType);
      var designClick = (function(viewType) {
        if(viewType == 'dashboard') {
          return function(event) {
            var template = event.template;
            var gotoDashboard = function() {
              window.open("../app-freeboard/index.html#/freeboard/view/dashboard/" + event.viewId + "/0", "_blank");
              /**
              if(event.viewId == scope.maindashboard.viewId) {
                window.location.href = "../app-freeboard/index.html#/freeboard/view/dashboard/" + event.viewId + "/1";
              } else {

              }
               */
            };
            var gotoTemplate = function(modelId) {
              var params = {
                modelId: modelId
              }
              window.open("../app-freeboard/index.html#/template/model/dashboard/" + JSON.stringify(params), "_blank");
            }
            if(template) {
              if(template.keyValue == "default") {
                gotoTemplate(template.resourceId);
              } else {
                gotoDashboard();
              }
            } else {
              gotoDashboard();
            }
            //window.location.href = "../app-freeboard/index.html#/freeboard/view/dashboard/" + event.viewId + "/0";
            /**
            if(event.viewId == scope.maindashboard.viewId) {
              window.location.href = "../app-freeboard/index.html#/freeboard/view/dashboard/" + event.viewId + "/1";
            } else {
              window.location.href = "../app-freeboard/index.html#/freeboard/view/dashboard/" + event.viewId + "/0";
            }
             */
          }
        } else if(viewType == 'configAlert') {
          return editAlertView;
        } else if(viewType == 'configure') {
          return function(event) {
            if (event.description.search("3D") == -1) {
              window.open("../app-configure/index.html#/configure/" + event.viewId, "_blank");
            } else {
              window.open("../app-editor3/index.html#/configure/" + event.viewId, "_blank");
            }
          }
        } else if(viewType == 'designView') {
          return function(event) {
            window.open("../app-freeboard/index.html#/editor/view/editor/" + event.viewId, "_blank");
          }
        }
      })(viewType);
      var editClick = (function(viewType) {
        if(viewType == 'dashboard') {
          return editViewInfo;
        } else if(viewType == 'configAlert') {
          return editAlertView;
        } else if(viewType == 'configure') {
          return configure_edit
        } else if(viewType == 'designView') {
          return editViewInfo;
        }
      })(viewType);
      var viewClick = (function(viewType) {
        if(viewType == 'dashboard') {
          return function(event) {
            window.open("../app-free-style/index.html#/" + event.viewId);
          }
        } else if(viewType == 'configure') {
          return function(event) {
            var param = [{
              viewId: event.viewId
            }];
            window.open('../app-free-style/index.html#/topoview/index/' + encodeURIComponent(JSON.stringify(param)), '_blank');
          };
        } else if(viewType == 'designView') {
          return function(event) {
            window.open("../app-free-style/index.html#/" + event.viewId);
          }
        } else if(viewType == 'configAlert') {
          return viewConfigAlert;
        }
      })(viewType);
      var deleteGroup = (function(viewType) {
        if(viewType == 'configure') {
          return deleteGroup_configure;
        } else {
          return deleteGroup_common;
        }
      })(viewType);
      var _CONFIG_ = {
        dashboard: {
          label: "仪表板视图",
          viewType: "dashboard",
          charRoot: "仪表板视图",
          header: ['CREAT', 'RELEASE', 'DELETE'],
          columnDefs: ['VIEWTITLE', 'OWNER', 'RESTYPE', 'RELEASESTATUS', 'TEMPLATE', 'CREATETIME', 'UPDATETIME', 'DOMAIN', 'OPTIONS'],
          buttons: ['BTN_DESIGN', 'BTN_EDIT', 'BTN_DELETE', 'BTN_DUPLICATE', 'BTN_RELEASE', 'BTN_VIEW'],
          active: viewType == 'dashboard',
          run: dashboard_run
        },
        configure: {
          label: "组态视图",
          charRoot: "组态视图",
          viewType: "configure",
          header: ['CREAT','CREAT3D', 'RELEASE', 'DELETE'],
          columnDefs: ['VIEWTITLE', 'DESCRIPTION', 'OWNER', 'RESTYPE', 'RELEASESTATUS', 'HIERARCHY', 'CREATETIME', 'UPDATETIME', 'DOMAIN', 'OPTIONS'],
          buttons: ['BTN_DESIGN', 'BTN_EDIT', 'BTN_DELETE', 'BTN_DUPLICATE', 'BTN_RELEASE', 'BTN_VIEW'],
          active: viewType == 'configure',
          run: configure_run
        },
        designView: {
          label: "分析视图",
          charRoot: "分析视图",
          viewType: "designView",
          active: viewType == 'designView',
          header: ['CREAT', 'RELEASE', 'DELETE'],
          columnDefs: ['VIEWTITLE', 'DESCRIPTION', 'OWNER', 'RELEASESTATUS', 'CREATETIME', 'UPDATETIME', 'DOMAIN', 'OPTIONS'],
          buttons: ['BTN_DESIGN', 'BTN_EDIT', 'BTN_DELETE', 'BTN_DUPLICATE', 'BTN_RELEASE', 'BTN_VIEW'],
          run: designView_run
        },
        configAlert: {
          label: "告警视图",
          charRoot: "告警视图",
          viewType: "configAlert",
          header: ['CREAT', 'RELEASE', 'DELETE'],
          columnDefs: ['VIEWTITLE', 'DESCRIPTION', 'OWNER', 'RELEASESTATUS', 'CREATETIME', 'UPDATETIME', 'DOMAIN', 'OPTIONS'],
          buttons: ['BTN_DESIGN', 'BTN_DELETE', 'BTN_DUPLICATE', 'BTN_RELEASE'],
          active: viewType == 'configAlert',
          run: configAlert_run
        }
      };
      var previewGraph = function(viewId) {
        //window.open("../app-free-style/index.html#/" + viewId);
        /**
        scope.instance = {};
        viewFlexService.getViewById(viewId, function(event){
          if(event.code == "0"){
            var content = event.data.content, dt;
            if(content != null){
              var clone = JSON.parse(content);
              scope.bgColor = clone.$attr("setting/color");
              var input = {
                layout : clone.data ? clone.data : clone.layout,
                setting : clone.setting
              };
              delete clone.data;
              if(input.layout){
                var editData = new freeboardservice.replaceCiKpi(input, function(){
                  timeout(function(){
                    scope.instance.setMode(true);
                    scope.instance.renderLayout(editData);
                  });
                });
              } else {
                scope.error = "此视图为多页面视图，不支持预览模式"
              };
            }
          }
        })
         */
      };
      scope.nav = _CONFIG_;
      if(scope.viewId) {
        previewGraph(scope.viewId);
      } else {
        charRoot = _CONFIG_[viewType].charRoot;
        scope.navClick = function(key) {
          $location.path("views/" + key);
        };
        var complete = function() {
          var getManagedViewsByType_back = function(event) {
            var viewType = config.viewType;
            var defers = [];
            var dataTable = {};
            var projectIds = [];
            var allviews = event.data;
            if(event.code == 0) {
              /* 老版本处理
              var loop = function(elem){
                var defer = q.defer();
                if(viewType == "configure"){
                  if(elem.template){
                    if(elem.template.resourceType == "project"){
                      projectIds.push(elem.template.resourceId);
                    }
                  }
                };
                var viewId = elem.viewId;
                if(elem.template){
                  elem.keyValue = elem.template.keyValue;
                }
                userRoleUIService.findRoleRes({
                  resId : viewId
                }, function(event){
                  if(event.code == 0){
                    var roleRes = event.data.map(function(el){
                      return el.roleId;
                    });
                    if(roleRes.length > 0){
                      elem.bindRoles = allRoles.filter(function(elem){
                        return roleRes.indexOf(elem.roleID) != -1;
                      }).map(function(elem){
                        return elem.roleName
                      }).toString();
                    }
                    defer.resolve("success")
                  }
                });
                return defer.promise;
              };
              for(var i in allviews){
                defers.push(loop(allviews[i]));
              }
              */

              var defer = q.defer();
              defers.push(defer.promise);
              var ids = [];
              for(var i in allviews) {
                var elem = allviews[i];
                if(viewType == "configure") {
                  if(elem.template) {
                    if(elem.template.resourceType == "project") {
                      projectIds.push(elem.template.resourceId);
                    }
                  }
                };
                var viewId = elem.viewId;
                if(elem.template) {
                  elem.keyValue = elem.template.keyValue;
                }
                ids.push(elem.viewId);
              }
              if(ids.length > 0) {
                userRoleUIService.findRoleResByResIds([ids], function(returnObj) {
                  if(returnObj.code == 0) {
                    allviews.forEach(function(view) {
                      var flt = returnObj.data.filter(function(elem) {
                        return elem.resId == view.viewId
                      })
                      if(!flt) flt = [];
                      var bindRoles = [];
                      flt.forEach(function(eventData) {
                        if(eventData.roleId) {
                          bindRoles.push(allRoles.filter(function(elem) {
                            if(elem){
                              return(eventData.roleId + "").indexOf(elem.roleID) != -1;
                            }
                          }).map(function(elem) {
                            return elem.roleName
                          }))
                        }
                      })
                      view.bindRoles = bindRoles.toString();
                    })
                    defer.resolve("success")
                  }
                });
              } else {
                defer.resolve("success")
              }

              q.all(defers).then(function(event) {
                var run = function(projects) {
                  scope["allprojects"] = projects;
                  var loopView = function(view) {
                    if(view.template) {
                      if(view.template.resourceType == "device") {
                        resourceUIService.getModelByIds([view.template.resourceId], function(data) {
                          view.templateStr = "模版 : 已删除";
                          if(data.data) {
                            if(data.data[0]) {
                              view.templateStr = "模版 : " + (data.data ? data.data[0].label : "-");
                            }
                          }

                        });
                      } else if(view.template.resourceType == "project") {
                        if(projects) {
                          var find = projects[view.template.resourceId];
                          if(find) {
                            view.templateStr = "项目 : " + find.label;
                          }
                        }
                      } else {
                        view.templateStr = "普通"
                      };
                    } else {
                      view.templateStr = "普通"
                    };
                  }
                  for(var i in allviews) {
                    loopView(allviews[i])
                  }
                  views = allviews;
                  dataTable.source = allviews;
                  dataTable.rowclass = function(row) {
                    if(row.creator != userLoginUIService.user.userID) {
                      return "self";
                    }
                  };
                  window.header = [], window.columnDefs = [], window.buttons = [];
                  var loop = function(attr) {
                    var arr = config[attr];
                    var loop = function(at) {
                      window[attr].push(widget[at]);
                    };
                    for(var i in arr) {
                      loop(arr[i])
                    }
                  };
                  var arr = ['header', 'columnDefs', 'buttons']
                  for(var i in arr) {
                    loop(arr[i])
                  };
                  widget.OPTIONS.modes.default.options = window['buttons'];
                  dataTable.header = window['header'];
                  dataTable.columnDefs = window['columnDefs'];
                  for(var i in widget.columnDefs) {
                    init(widget.columnDefs[i])
                  };
                  scope.dataTable = dataTable;
                  var getAllDomainName = function(views) {
                    var defers = [];
                    var loop = function(item) {
                      var deferred = q.defer(),
                        attributesLoadDefer = [];
                      var arr = item.domainPath.split("/");
                      var domainID;
                      if(arr.length > 2) {
                        domainID = arr[arr.length - 2];
                      };
                      var loadResource = function() {
                        var deferred = q.defer();
                        if(item.template) {
                          var modelId = item.template.resourceId;
                          if(!scope['model_' + modelId]) {
                            $$.cacheAsyncData.call(resourceUIService.getModelByIds, [
                              [modelId]
                            ], function(event) {
                              if(event && event.code == 0) {
                                scope['model_' + modelId] = event.data[0];
                                item.modelObj = scope['model_' + modelId];
                              }
                              deferred.resolve("success");
                            });
                          } else {
                            if(scope['model_' + modelId].hasOwnProperty("$$state")) {
                              scope['model_' + modelId].then(function() {
                                item.modelObj = scope['model_' + modelId];
                                deferred.resolve("success");
                              });
                            } else {
                              item.modelObj = scope['model_' + modelId];
                              deferred.resolve("success");
                            }
                          }
                        } else {
                          deferred.resolve("success")
                        }
                        return deferred.promise;
                      };
                      var loadDomain = function() {
                        var deferred = q.defer();
                        if(!scope[domainID]) {
                          scope[domainID] = deferred.promise;
                          userDomainService.queryDomainInfo(domainID, function(event) {
                            if(event.code == "0") {
                              scope[domainID] = event.data;
                              item.domainObj = scope[domainID];
                            }
                            deferred.resolve("success");
                          })
                        } else {
                          if(scope[domainID].hasOwnProperty("$$state")) {
                            scope[domainID].then(function() {
                              item.domainObj = scope[domainID];
                              deferred.resolve("success");
                            });
                          } else {
                            item.domainObj = scope[domainID];
                            deferred.resolve("success");
                          }
                        };
                        return deferred.promise;
                      };
                      attributesLoadDefer.push(loadResource(), loadDomain())
                      q.all(attributesLoadDefer).then(function(event) {
                        deferred.resolve("success");
                      });
                      return deferred.promise;
                    };
                    for(var i in views) {
                      defers.push(loop(views[i]));
                    }
                    return defers;
                  };
                  q.all(getAllDomainName(views)).then(function() {

                  });
                };
                if(projectIds.length > 0) {
                  resourceUIService.getResourceByIds(projectIds, function(event) {
                    if(event) {
                      run(event);
                    }
                  });
                } else {
                  run();
                };
              })
            } else {
              growl.error(event.message);
              views = []
            }
          };
          //viewFlexService.getManagedViewsByType(viewType, userLoginUIService.user.domainPath, getManagedViewsByType_back);
          viewFlexService.getManagedViewsByTypeAndRole(viewType, getManagedViewsByType_back);
          /** viewFlexService.getAllMyViews(getAllMyViews_back) */
        };
        var checkPowerCss = function(flg) {
          var css = "";
          if(flg == "CREAT") {
            if(charRoot == "告警视图" && !scope.menuitems["A1_S77"]) {
              css = "ng-hide";
            }
            if(charRoot == "组态视图" && !scope.menuitems["A03_S22"]) {
              css = "ng-hide";
            }
            if(charRoot == "分析视图" && !scope.menuitems["A02_S78"]) {
              css = "ng-hide";
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A04_S21"]) {
              css = "ng-hide";
            }
          } if(flg == "CREAT3D") {
            if(charRoot == "组态视图" && !scope.menuitems["A03_S22"]) {
              css = "ng-hide";
            }
          } else if(flg == "RELEASE") {
            if(charRoot == "告警视图" && !scope.menuitems["A2_S77"]) {
              css = "ng-hide";
            }
            if(charRoot == "组态视图" && !scope.menuitems["A04_S22"]) {
              css = "ng-hide";
            }
            if(charRoot == "分析视图" && !scope.menuitems["A03_S78"]) {
              css = "ng-hide";
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A04_S21"]) {
              css = "ng-hide";
            }
          } else if(flg == "DELETE") {
            if(charRoot == "告警视图" && !scope.menuitems["A3_S77"]) {
              css = "ng-hide";
            }
            if(charRoot == "组态视图" && !scope.menuitems["A05_S22"]) {
              css = "ng-hide";
            }
            if(charRoot == "分析视图" && !scope.menuitems["A04_S78"]) {
              css = "ng-hide";
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A05_S21"]) {
              css = "ng-hide";
            }
          }
          return css;
        };
        var checkPowerVisible = function(flg) {
          var bol = true;
          if(flg == "BTN_DESIGN") {
            if(charRoot == "分析视图" && !scope.menuitems["A05_S78"]) {
              bol = false;
            }
            if(charRoot == "组态视图" && !scope.menuitems["A01_S22"]) {
              bol = false;
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A01_S21"]) {
              bol = false;
            }
            if(charRoot == "告警视图" && !scope.menuitems["A4_S77"]) {
              bol = false;
            }
          } else if(flg == "BTN_DELETE") {
            if(charRoot == "告警视图" && !scope.menuitems["A3_S77"]) {
              bol = false;
            }
            if(charRoot == "组态视图" && !scope.menuitems["A05_S22"]) {
              bol = false;
            }
            if(charRoot == "分析视图" && !scope.menuitems["A04_S78"]) {
              bol = false;
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A05_S21"]) {
              bol = false;
            }
          } else if(flg == "BTN_EDIT") {
            if(charRoot == "告警视图" && !scope.menuitems["A4_S77"]) {
              bol = false;
            }
            if(charRoot == "分析视图" && !scope.menuitems["A01_S78"]) {
              bol = false;
            }
            if(charRoot == "组态视图" && !scope.menuitems["A06_S22"]) {
              bol = false;
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A06_S21"]) {
              bol = false;
            }
          } else if(flg == "BTN_DUPLICATE") {
            if(charRoot == "告警视图" && !scope.menuitems["A5_S77"]) {
              bol = false;
            }
            if(charRoot == "组态视图" && !scope.menuitems["A07_S22"]) {
              bol = false;
            }
            if(charRoot == "分析视图" && !scope.menuitems["A06_S78"]) {
              bol = false;
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A07_S21"]) {
              bol = false;
            }
          } else if(flg == "BTN_RELEASE") {
            if(charRoot == "告警视图" && !scope.menuitems["A2_S77"]) {
              bol = false;
            }
            if(charRoot == "组态视图" && !scope.menuitems["A04_S22"]) {
              bol = false;
            }
            if(charRoot == "分析视图" && !scope.menuitems["A03_S78"]) {
              bol = false;
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A04_S21"]) {
              bol = false;
            }
          } else if(flg == "BTN_VIEW") {
            if(charRoot == "告警视图") {
              bol = false;
            }
            if(charRoot == "组态视图" && !scope.menuitems["A08_S22"]) {
              bol = false;
            }
            if(charRoot == "分析视图" && !scope.menuitems["A07_S78"]) {
              bol = false;
            }
            if(charRoot == "仪表板视图" && !scope.menuitems["A08_S21"]) {
              bol = false;
            }
          }
          return bol;
          //return false;
        };
        var queryDomainTree_back = function(event) {
          if(event.code == "0") {
            domainlist = createlist(event.data[0]);
            domaintree = {
              domainInfos: event.data
            };
            widget = {
              CREAT: {
                label: "创建" + charRoot,
                icon: "fa fa-plus",
                type: "button",
                class: "btn btn-primary btn-sm " + checkPowerCss("CREAT"),
                style: {
                  margin: "2px"
                },
                events: {
                  click: addNewClick
                }
              },
              CREAT3D: {
                label: "创建3D" + charRoot,
                icon: "fa fa-plus",
                type: "button",
                class: "btn btn-primary btn-sm " + checkPowerCss("CREAT3D"),
                style: {
                  margin: "2px"
                },
                events: {
                  click: add3DNewClick
                }
              },
              DESIGNVIEW: {
                label: "管理性能视图",
                icon: "glyphicon glyphicon-new-window",
                type: "button",
                class: "btn btn-default btn-sm",
                style: {
                  margin: "2px"
                },
                events: {
                  click: function() {
                    location.href = "#/designView2";
                  }
                }
              },
              RELEASE: {
                label: "发布",
                icon: "glyphicon glyphicon-new-window",
                type: "button",
                class: "btn btn-default btn-sm " + checkPowerCss("RELEASE"),
                disabled: function(event) {
                  if(event) {
                    var some = event.some(function(elem) {
                      return elem.selected == true && elem.releaseStatus != true;
                    });
                    return !some;
                  } else {
                    return true;
                  }
                },
                style: {
                  margin: "2px"
                },
                events: {
                  click: releaseGroup
                }
              },
              DELETE: {
                label: "删除",
                icon: "fa fa-minus",
                type: "button",
                disabled: function(event) {
                  if(event) {
                    var some = event.some(function(elem) {
                      return elem.selected == true;
                    });
                    return !some;
                  } else {
                    return true;
                  }
                },
                class: "btn btn-default btn-sm " + checkPowerCss("DELETE"),
                style: {
                  margin: "2px"
                },
                events: {
                  click: deleteGroup
                }
              },
              TEMPLATE: {
                label: "默认仪表板",
                data: "keyValue",
                type: "text",
                filterable: false,
                sortable: true,
                format: function(value, row) {
                  if(value == "default") {
                    return "是";
                  } else {
                    return "否";
                  }
                },
                modes: {
                  default: {
                    type: "text",
                  }
                }
              },
              SETHOME: {
                label: "首页设置",
                data: "homeview",
                type: "sethome",
                filterable: false,
                sortable: false,
                width: 30,
                events: {
                  click: sethomeClick
                }
              },
              VIEWTITLE: {
                label: "视图名称",
                data: "viewTitle",
                type: "text",
                filterable: true,
                sortable: true,
                modes: {
                  default: {
                    type: "text",
                  }
                }
              },
              HIERARCHY: {
                label: "视图层级",
                data: "viewHierarchy",
                type: "text",
                filterable: false,
                sortable: true,
                modes: {
                  default: {
                    type: "text",
                  }
                },
                format: function(value, row) {
                  if(treeData == undefined) {
                    treeData = createTree(views)
                  }
                  var rs = '';
                  var parent = row.parent;
                  while(parent) {
                    if(parent.viewId != 0) {
                      rs = parent.viewTitle + "/" + rs;
                    }
                    parent = parent.parent;
                  }
                  rs = "/" + rs;
                  return rs;
                }
              },
              RESTYPE: {
                label: "视图类型",
                data: "templateStr",
                type: "text",
                modes: {
                  default: {
                    type: "text",
                  }
                },
                filterable: false,
                sortable: true
              },
              DESCRIPTION: {
                label: "视图描述",
                data: "description",
                type: "text",
                modes: {
                  default: {
                    type: "text",
                  }
                },
                format: function(str) {
                  if(str == null) {
                    return '-';
                  } else {
                    return str;
                  }
                },
                filterable: false,
                sortable: true
              },
              OWNER: {
                label: "绑定角色",
                data: "bindRoles",
                type: "select",
                options: allRoles,
                filterFormat: {
                  label: "roleName",
                  value: "roleName"
                },
                modes: {
                  default: {
                    type: "text",
                  }
                },
                filterable: true,
                sortable: false
              },
              RELEASESTATUS: {
                label: "发布状态",
                data: "releaseStatus",
                type: "text",
                modes: {
                  default: {
                    type: "text",
                  }
                },
                format: function(str) {
                  if(str == null) {
                    return '未发布';
                  } else if(str == 0) {
                    return '未发布';
                  } else if(str == 1) {
                    return '已发布';
                  } else {
                    return '-';
                  }
                },
                filterable: false,
                sortable: true
              },
              CREATETIME: {
                label: "创建时间",
                data: "createTime",
                type: "date",
                format: "yy-mm-dd hh:nn:ss",
                filterable: false,
                sortable: true,
                modes: {
                  default: {
                    type: "date",
                  }
                }
              },
              UPDATETIME: {
                label: "更新时间",
                data: "updateTime",
                type: "date",
                format: "yy-mm-dd hh:nn:ss",
                filterable: false,
                sortable: true,
                modes: {
                  default: {
                    type: "date",
                  }
                }
              },
              DOMAIN: {
                label: "管理域",
                type: "tree",
                sortable: true,
                filterable: true,
                data: "domainPath",
                key: "id",
                mark: "domainInfos",
                options: domaintree,
                format: function(value, row) {
                  if(row.domainObj) {
                    return row.domainObj.label;
                  } else {
                    return "-";
                  };
                },
                modes: {
                  default: {
                    type: "text",
                  }
                }
              },
              OPTIONS: {
                label: "操作",
                width: 141,
                type: "buttonGroup",
                filterable: false,
                sortable: false,
                modes: {
                  default: {
                    options: []
                  }
                }
              },
              BTN_DESIGN: {
                label: viewType == 'configAlert' ? "编辑" : "设计",
                disabled: function(event) {
                  return !checkPowerVisible("BTN_DESIGN");
                },
                type: "button",
                class: "btn btn-primary",
                events: {
                  click: designClick
                }
              },
              BTN_EDIT: {
                label: "编辑",
                type: "button",
                class: "btn btn-default",
                disabled: function(event) {
                  return !checkPowerVisible("BTN_EDIT");
                },
                events: {
                  click: editClick
                }
              },
              BTN_DELETE: {
                label: "删除",
                type: "button",
                visible: function(event) {
                  return checkPowerVisible("BTN_DELETE");
                },
                events: {
                  click: deleteClick
                }
              },
              BTN_VIEW: {
                label: "预览",
                type: "button",
                visible: function(event) {
                  return checkPowerVisible("BTN_VIEW");
                },
                events: {
                  click: viewClick
                }
              },
              BTN_DUPLICATE: {
                label: "复制",
                type: "button",
                visible: function(event) {
                  return checkPowerVisible("BTN_DUPLICATE");
                },
                events: {
                  click: duplicateClick
                }
              },
              BTN_RELEASE: {
                label: "发布",
                type: "button",
                visible: function(event) {
                  return checkPowerVisible("BTN_RELEASE") && event.releaseStatus != true;
                },
                events: {
                  click: releaseClick
                }
              },
              BTN_HOME: {
                label: "设为首页",
                type: "button",
                visible: function(event) {
                  return !event.homeview;
                },
                events: {
                  click: sethomeClick
                }
              }
            };
            config = _CONFIG_[viewType];
            var queryEnterpriseUser_back = function(event) {
              if(event.code == 0) {
                enterpriseUsers = event.data;
                config.run(complete);
              }
            };
            userEnterpriseService.queryEnterpriseUser(queryEnterpriseUser_back);
          }
        };
        timeout(function() {
          var queryEnterpriseRole_back = function(event) {
            if(event.code == 0) {
              allRoles = event.data;
              userDomainService.queryDomainTree(userLoginUIService.user.userID, queryDomainTree_back);
            }
          };
          userEnterpriseService.queryEnterpriseRole(queryEnterpriseRole_back);
        }, 1000);
      }
      scope.bgColorFn = function(bgColor) {
        return {
          "background-color": (bgColor ? bgColor : "#eee")
        };
      };

      function checkVersion(data) {
        var version = "version2";
        var mode = "standard"
        data.traverse(function(attr, element) {
          for(var i in element) {
            if(i == "rows") {
              version = "version1"
            }
            if(element.kpi == 3236) {
              mode = "machine"
            }
          }
        });
        return version + "_" + mode;
      }
    }
  ]);
});