define(['controllers/controllers', 'Array'], function (controllers) {
  'use strict';
  controllers.initController('permissionCtrl', ['$scope', '$q', '$routeParams', '$location', 'serviceCenterService', 'ngDialog', 'userInitService', 'userLoginUIService', 'userEnterpriseService', 'userUIService', 'growl', 'userRoleUIService', 'userFunctionService', 'userDomainService', 'marketplaceUIService', 'viewFlexService', 'dictionaryService',
    function (scope, q, routeParams, location, serviceCenterService, ngDialog, userInitService, userLoginUIService, userEnterpriseService, userUIService, growl, userRoleUIService, userFunctionService, userDomainService, marketplaceUIService, viewFlexService, dictionaryService) {
      scope.panel = routeParams.panel;
      var roleID = routeParams.roleID;
      scope.navigateTo = function(panel){
        location.path("usermanager/permission/" + panel + "/" + roleID);
      };
      var TEXT = {
        "SUBMIT" : "确定",
        "CANCEL" : "取消"
      };
      var queryRoleName = function() {
        userEnterpriseService.queryEnterpriseRole(function(returnObj) {
          if (returnObj.code == 0) {
            scope.roleName = returnObj.data.find(function(item) {
              return item.roleID == roleID;
            }).roleName;
          }
        })
      }();
      var initMenuPremission = function() {
        scope.saveMenuPremission = function() {
          var nodes = scope.functionTree
            .getCheckNode()
            .map(function(elem){
              return elem.functionCode;
            });
          var param = [];
          for(var i in nodes){
            if(nodes[i]){
              param.push(nodes[i])
            }
          }
          userFunctionService.addFunction2Role(roleID, param, function (resultObj) {
            if (resultObj.code == 0) {
              growl.success("功能分配成功", {});
            } else {
              growl.warning("功能分配失败!", {});
            }
          });
        };
        var queryAllFunctionByUser_back = function(event){
          if(event.code == 0){
            var traverse = function(data){
              var find = 0;
              var getFunction = function(item){
                if(item.belong == 1){
                  find = 1;
                }
                for(var i in item.function){
                  getFunction(item.function[i])
                }
              };
              for(var i in data){
                getFunction(data[i])
              }
              return find;
            };
            var some = traverse(event.data);
            scope.functionTree = {
              name : '全部',
              belong : some,
              function : event.data
            };
          }
        };
        userFunctionService.queryAllFunctionByUser(userLoginUIService.user.userID, roleID, queryAllFunctionByUser_back);
      }
      var initViewPremission = function(){
        /** var allViews = []; */
        var getAllModels = function(allModels){
          var roleRes = [];
          var getAllDicts_callback = function(event){
            var commandType = event.data;
            if(event.code == 0){
              var params = {
                roleId : roleID
              };
              var findRoleViews_callback = function(event){
                if(event.code == 0){
                  var roleViews = event.data;
                  var findRoleRes_callback = function(event){
                    if(event.code == 0){
                      var defers = [];
                      roleRes = event.data;
                      var variables = {
                        dashboard : {
                          viewType : 'dashboard'
                        },
                        template : {
                          viewType : 'dashboard'
                        },
                        configAlert : {
                          viewType : 'configAlert'
                        },
                        designView : {
                          viewType : 'designView'
                        },
                        configure : {
                          viewType : 'configure'
                        },
                        reportTemplate : {
                          viewType : 'reportTemplate'
                        }
                      };
                      var getViewDefer = function(attr, variable){
                        var defer = q.defer();
                        var viewType = variable.viewType;
                        var getViewsOnlyPublishedByTypeAndDomainPath_back = function(event){
                          var all = [];
                          if(event.code == 0){
                            if(event.data){
                              var inx = 0;
                              all = event.data.$clone().filter(function(elem){
                                if(elem.releaseStatus == '1'){
                                  var template;
                                  inx++;
                                  if(elem.hasOwnProperty("template")){
                                    template = elem.template
                                  };
                                  if(attr == 'dashboard'){
                                    if(template){
                                      return template.resourceId == 0
                                    } else {
                                      return true;
                                    }
                                  } else if(attr == 'template'){
                                    if(template){
                                      return template.resourceId != 0 && template.keyValue != "default";
                                    } else {
                                      return false;
                                    }
                                  } else {
                                    return elem.viewType == viewType;
                                  }
                                } else {
                                  return false;
                                }
                              });
                            }
                          } else {
                            growl.error(event.message);
                          }
                          variable.all = all;
                          variable.applied = all.filter(function(elem){
                            var viewId = elem.viewId;
                            var some = roleRes.find(function(el){
                              return el.resId == viewId;
                            });
                            return some;
                          });
                          variable.avaliable = all.filter(function(elem){
                            var viewId = elem.viewId;
                            var some = roleRes.find(function(el){
                              return el.resId == viewId;
                            });
                            return !some;
                          });
                          defer.resolve("success");
                        };
                        viewFlexService.getViewsOnlyPublishedByTypeAndDomainPath(viewType, userLoginUIService.user.domainPath, getViewsOnlyPublishedByTypeAndDomainPath_back);
                        return defer.promise;
                      };
                      for(var i in variables){
                        defers.push(getViewDefer(i, variables[i]));
                      }
                      var success = function(){
                        var setDashboard = function(object){
                          object.source.forEach(function(elem){
                            var loop = function(command){
                              var find = roleViews.find(function(el){
                                return el.functionCode == command.valueCode;
                              });
                              if(find){
                                if(elem.viewId == find.viewId){
                                  elem[command.valueCode] = true;
                                }
                              }
                            };
                            for(var i in commandType){
                              loop(commandType[i]);
                            }
                            elem.selected = true;
                          });
                          var saveClick = function(source){
                            var resAddIds = source.filter(function(elem){
                              var some = roleRes.find(function(el){
                                return el.resId == elem.viewId;
                              });
                              return !some;
                            }).map(function(elem){
                              return elem.viewId;
                            });
                            var resDeleteIds = roleRes.filter(function(role){
                              var some = source.some(function(el){
                                return role.resId == el.viewId;
                              });
                              return !some && role.resType == 21;
                            });
                            var deleteRoleRes = function(){
                              var roleDeleted = function(){
                                var deleteFunctionParam = [];
                                var loop = function(command){
                                  var find = roleViews.find(function(elem){
                                    return elem.functionCode == command.valueCode;
                                  });
                                  if(find){
                                    deleteFunctionParam.push(find);
                                  }
                                };
                                for(var i in commandType){
                                  loop(commandType[i])
                                };
                                var deleteRoleView_back = function(event){
                                  if(event.code == 0){
                                    var deleteRV = function(rv){
                                      roleViews.$remove(function(index, element){
                                        return element.viewId == rv.viewId;
                                      });
                                    };
                                    for(var i in deleteFunctionParam){
                                      deleteRV(deleteFunctionParam[i])
                                    };
                                    var addFunctionParam = [];
                                    var loop = function(command){
                                      var find = source.find(function(elem){
                                        return elem[command.valueCode] == true;
                                      });
                                      if(find){
                                        addFunctionParam.push({
                                          roleId : roleID,
                                          viewId : find.viewId,
                                          functionCode : command.valueCode
                                        });
                                      }
                                    };
                                    for(var i in commandType){
                                      loop(commandType[i]);
                                    };
                                    var showMsg = function() {
                                      growl.success("仪表板视图授权成功");
                                      if (resAddIds.length > 0 || resDeleteIds.length > 0 || deleteFunctionParam.length > 0 || addFunctionParam.length > 0) {
                                        /** growl.success("仪表板视图授权成功"); */
                                      } else {
                                        /** growl.success("仪表板视图授权成功"); */
                                      }
                                    };
                                    var addRoleView_callback = function(event){
                                      if(event.code == "0"){
                                        Array.prototype.push.apply(roleViews, event.data);
                                        showMsg();
                                      }
                                    };
                                    if(addFunctionParam.length > 0){
                                      userRoleUIService.addRoleView(addFunctionParam, addRoleView_callback)
                                    } else {
                                      showMsg();
                                    }
                                  }
                                };
                                if(deleteFunctionParam.length > 0){
                                  userRoleUIService.deleteRoleView(deleteFunctionParam, deleteRoleView_back);
                                } else {
                                  deleteRoleView_back({code : 0, data : null})
                                }
                              };
                              var deleteRoleRes_callback = function(event){
                                if(event.code == 0){
                                  for(var i in resDeleteIds){
                                    roleRes.$remove(function(index, elem){
                                      return elem.resId == resDeleteIds[i].resId;
                                    })
                                  }
                                  roleDeleted();
                                }
                              };
                              if(resDeleteIds.length > 0){
                                userRoleUIService.deleteRoleRes(resDeleteIds, deleteRoleRes_callback);
                              } else {
                                roleDeleted();
                              };
                            };
                            if(resAddIds.length > 0){
                              var addRoleRes_callback = function(event){
                                if(event.code == 0){
                                  Array.prototype.push.apply(roleRes, event.data)
                                  deleteRoleRes();
                                }
                              };
                              userInitService.addRoleRes(roleID, 21, resAddIds, addRoleRes_callback);
                            } else {
                              deleteRoleRes();
                            }
                          };
                          var buttons = commandType.map(function(elem){
                            var setClick = function(row){
                              var cache = row[elem.valueCode];
                              var find = object.sourceAll.find(function(el){
                                return el[elem.valueCode] == true;
                              });
                              if(find){
                                find[elem.valueCode] = false;
                              }
                              row[elem.valueCode] = cache ? false : true;
                            };
                            return {
                              label : elem.label,
                              type : "button",
                              disabled : function(row){
                                return row.selected != true;
                              },
                              class : function(row){
                                if(row[elem.valueCode]){
                                  return 'btn btn-success';
                                } else {
                                  return 'btn btn-default';
                                }
                              },
                              events : {
                                click : setClick
                              }
                            }
                          });
                          return {
                            title : "仪表板视图",
                            source : {
                              source : object.sourceAll,
                              showheader : true,
                              showSelector : true,
                              miniSize : true,
                              page : true,
                              header : [{
                                icon : "glyphicon glyphicon-floppy-save",
                                class : "btn btn-primary btn-sm",
                                label : "保存",
                                style : {
                                  margin : "2px"
                                },
                                events : {
                                  click : saveClick
                                },
                                type : "button",
                              }],
                              events : {
                                click : function(row){
                                  if(row.selected != true){
                                    var loop = function(command){
                                      row[command.valueCode] = false;
                                    };
                                    for(var i in commandType){
                                      loop(commandType[i])
                                    }

                                  }
                                }
                              },
                              columnDefs : [{
                                label : "视图名称",
                                editable : false,
                                sortable : true,
                                filterable : true,
                                data : "viewTitle",
                                type : "text",
                                modes : {
                                  default : {
                                    type : "text",
                                  }
                                }
                              },{
                                label : "视图描述",
                                editable : false,
                                sortable : true,
                                filterable : true,
                                data : "description",
                                type : "text",
                                modes : {
                                  default : {
                                    type : "text",
                                  }
                                }
                              },{
                                label : "应用于",
                                type : "buttonGroup",
                                filterable : false,
                                sortable : false,
                                width : "141px",
                                modes : {
                                  default : {
                                    options : buttons
                                  }
                                }
                              }]
                            }
                          }
                        };
                        var setTemplate = function(object){
                          var dispart;
                          for(var i in object.source){
                            if(object.source[i].template){
                              object.source[i].resourceId = object.source[i].template.resourceId;
                            }
                          };
                          var resType = object.resType;
                          if(object.title == "设备视图"){
                            dispart = {
                              label : "设备模板",
                              editable : false,
                              sortable : true,
                              filterable : true,
                              data : "resourceId",
                              format : function(value){
                                var find = allModels.find(function(elem){
                                  return elem.id == value;
                                });
                                if(find){
                                  return find.label;
                                } else {
                                  return "-";
                                }
                              },
                              filterFormat : {
                                label : "label",
                                value : "id"
                              },
                              type : "select",
                              options : allModels,
                              modes : {
                                default : {
                                  type : "text",
                                }
                              }
                            }
                          } else {
                            dispart = {
                              label : "视图描述",
                              editable : false,
                              sortable : true,
                              filterable : true,
                              data : "description",
                              type : "text",
                              modes : {
                                default : {
                                  type : "text",
                                }
                              }
                            }
                          }
                          var addNewClick = function(row){
                            var submitClick = function(){
                              var source = object.sourceAva.filter(function(elem){
                                return elem.selected == true;
                              });
                              Array.prototype.push.apply(object.source, source);
                              var resIds = source.map(function(elem){
                                elem.selected = false;
                                return elem.viewId;
                              });
                              var addRoleRes_callback = function(event){
                                if(event.code == 0){
                                  var loop = function(item){
                                    item.disabled = false;
                                    object.sourceAva.$remove(function(index, elem){
                                      return elem == item;
                                    });
                                  };
                                  for(var i in source){
                                    loop(source[i]);
                                  }
                                  ngDialog.close();
                                  growl.success(object.title + "添加成功")
                                }
                              };
                              userInitService.addRoleRes(roleID, resType, resIds, addRoleRes_callback);
                            };
                            var fnlist = [{
                              label : TEXT.SUBMIT,
                              icon : 'btn btn-primary',
                              style : {
                                width : '50%',
                                'border-radius' : 0,
                                'font-size' : '18px',
                                'font-weight' : 'bold',
                                'padding' : 10
                              },
                              fn : submitClick
                            },{
                              label : TEXT.CANCEL,
                              icon : 'btn btn-default',
                              style : {
                                width : '50%',
                                'border-radius' : 0,
                                'font-size' : '18px',
                                'font-weight' : 'bold',
                                'padding' : 10
                              },
                              fn : function(){
                                ngDialog.close();
                              }
                            }];
                            var datatablesource = {
                              source : object.sourceAva,
                              miniSize : true,
                              pageResize : false,
                              header : [],
                              rowclass : function(row){
                                var inUse = object.sourceAva.filter(function(elem){
                                  return elem.selected == true && elem != row;
                                }).concat(object.source);
                                var some = inUse.some(function(elem){
                                  if(elem.template && row.template){
                                    if(row.template.resourceType == "device"){
                                      return row.template.resourceId == elem.template.resourceId
                                    } else {
                                      return false;
                                    }
                                  } else {
                                    return false;
                                  }
                                });
                                row.disabled = some;
                                return some ? "disabled" : "";
                              },
                              columnDefs : [{
                                label : "视图名称",
                                editable : false,
                                sortable : true,
                                filterable : true,
                                data : "viewTitle",
                                type : "text",
                                modes : {
                                  default : {
                                    type : "text",
                                  }
                                }
                              },dispart]
                            };
                            scope.dialog = {
                              title : "添加" + object.title,
                              datatablesource : datatablesource,
                              button : fnlist
                            };
                            ngDialog.open({
                              template: '../partials/dialogue/data_table_dia.html',
                              className: 'ngdialog-theme-plain',
                              scope: scope
                            })
                          };
                          var deleteClick = function(source){
                            var fnlist = [{
                              label : TEXT.SUBMIT,
                              icon : 'btn btn-success',
                              style : {
                                width : '50%',
                                'border-radius' : 0,
                                'font-size' : '18px',
                                'font-weight' : 'bold',
                                'padding' : 10
                              },
                              fn : function(){
                                ngDialog.close();
                                var roleRes = source.map(function(elem){
                                  return {
                                    roleId : roleID,
                                    resType : resType,
                                    resId : elem.viewId
                                  };
                                });
                                var deleteRoleRes_callback = function(event){
                                  if(event.code == "0"){
                                    for(var i in source){
                                      if(typeof object.sourceAva.pushbefore == "function"){
                                        object.sourceAva.pushbefore(source[i]);
                                      } else {
                                        object.sourceAva.unshift(source[i])
                                      }
                                      source[i].selected = false;
                                      /**
                                       for(var j in object.source){
                                      if(object.source[j] == source[i]){
                                        object.source[j].remove();
                                      }
                                    }
                                       */
                                      object.source.$remove(function(index, elem){
                                        return source[i] == elem;
                                      })
                                      object.source.removeAllChecked();
                                    };
                                    growl.success(object.title + "使用权限删除成功")
                                  }
                                };
                                userRoleUIService.deleteRoleRes(roleRes, deleteRoleRes_callback);
                              }
                            },{
                              label : TEXT.CANCEL,
                              icon : 'btn btn-default',
                              style : {
                                width : '50%',
                                'border-radius' : 0,
                                'font-size' : '18px',
                                'font-weight' : 'bold',
                                'padding' : 10
                              },
                              fn : function(){
                                ngDialog.close();
                              }
                            }];
                            scope.dialog = {
                              title : {
                                label : '提示'
                              },
                              description : {
                                label : '确认要删除此用户使用这些' + object.title + '的权限吗？'
                              },
                              fnlist : fnlist
                            };
                            ngDialog.open({
                              template: '../partials/dialogue/common_dia_prompt.html',
                              className: 'ngdialog-theme-plain',
                              scope: scope
                            });
                          };
                          return {
                            title : object.title,
                            source : {
                              source : object.source,
                              showheader : true,
                              header : [{
                                icon : "fa fa-plus",
                                class : "btn btn-primary btn-sm",
                                label : "添加",
                                style : {
                                  margin : "2px"
                                },
                                mark : "viewTitle",
                                id : "viewId",
                                type : "button",
                                events : {
                                  click : addNewClick
                                }
                              },{
                                icon : "fa fa-minus",
                                class : "btn btn-default btn-sm",
                                label : "删除",
                                style : {
                                  margin : "2px"
                                },
                                disabled : function(source){
                                  return !source.some(function(elem){
                                    return elem.selected
                                  })
                                },
                                events : {
                                  click : deleteClick
                                },
                                type : "button"
                              }],
                              columnDefs : [{
                                label : "视图名称",
                                editable : false,
                                sortable : true,
                                filterable : true,
                                data : "viewTitle",
                                type : "text",
                                modes : {
                                  default : {
                                    type : "text",
                                  }
                                }
                              },dispart]
                            }
                          };
                        };

                        var DASHBOARD_VIEW = setDashboard({
                          title : "仪表板视图",
                          sourceAll : variables.dashboard.all,
                          source : variables.dashboard.applied,
                          resType : 21,
                          sourceAva : variables.dashboard.avaliable
                        });
                        var MODEL_VIEW = setTemplate({
                          title : "设备视图",
                          source : variables.template.applied,
                          resType : 21,
                          sourceAva : variables.template.avaliable
                        });
                        var CONFIGALERT = setTemplate({
                          title : "告警视图",
                          resType : 23,
                          source : variables.configAlert.applied,
                          sourceAva : variables.configAlert.avaliable
                        });
                        var DESIGNVIEW = setTemplate({
                          title : "分析视图",
                          resType : 24,
                          source : variables.designView.applied,
                          sourceAva : variables.designView.avaliable
                        });
                        var CONFIGURE = setTemplate({
                          title : "组态视图",
                          resType : 25,
                          source : variables.configure.applied,
                          sourceAva : variables.configure.avaliable
                        });
                        var reportTemplate = setTemplate({
                          title : "报表视图",
                          resType : 26,
                          source : variables.reportTemplate.applied,
                          sourceAva : variables.reportTemplate.avaliable
                        });
                        scope.views = [DASHBOARD_VIEW, MODEL_VIEW, CONFIGALERT, DESIGNVIEW, CONFIGURE,reportTemplate];
                      };
                      q.all(defers).then(success);
                    }
                  };
                  userRoleUIService.findRoleRes(params, findRoleRes_callback);
                }
              };
              userRoleUIService.findRoleViews(params, findRoleViews_callback);
            }
          };
          dictionaryService.getDictValues(['functionCode'],getAllDicts_callback);
        };
        serviceCenterService.models.getAll().then(getAllModels);

        /**
        var getAllViews_callback = function(event){
          if(event.code == 0){
            allViews = event.data;
          }
        };
        viewFlexService.getAllMyViews(getAllViews_callback);
         */
      };
      var initEquipmentPremission = function(){
        var params = {
          roleId : roleID
        };
        var getAllDicts_callback = function(event){
          if(event.code == 0) {
            var dics = event.data;
            var findRoleRes_callback = function(event){
              if(event.code == 0){
                var roleRes = event.data.filter(function(elem){
                  return elem.resType == 30;
                });
                var loop = function(dic){
                  var find = roleRes.find(function(elem){
                    return elem.resId == dic.valueCode;
                  })
                  if(find){
                    dic.selected = true;
                  }
                }
                for(var i in dics){
                  loop(dics[i])
                }
                var saveClick = function(source){
                  var addIds = source.filter(function(el){
                    var some = roleRes.some(function(roler){
                      return roler.resId == el.valueCode;
                    });
                    return !some;
                  }).map(function(elem){
                    return elem.valueCode;
                  });
                  var removeIds = roleRes.filter(function(el){
                    var some = source.some(function(sou){
                      return sou.valueCode == el.resId
                    });
                    return !some;
                  }).map(function(elem){
                    return {
                      roleId : roleID,
                      resId : elem.resId
                    }
                  });
                  var success = function(){
                    growl.success("修改设备控制功能成功。");
                  }
                  var addRoleSuccess = function(){
                    if(removeIds.length > 0){
                      userRoleUIService.deleteRoleRes(removeIds, function(event){
                        success()
                      })
                    } else {
                      success();
                    };
                  };
                  if(addIds.length > 0){
                    userInitService.addRoleRes(roleID, 30, addIds, function(event){
                      addRoleSuccess();
                    });
                  } else {
                    addRoleSuccess()
                  }
                };
                scope.equipments = {
                  title : "设备控制",
                  source : dics,
                  showheader : true,
                  showSelector : true,
                  page : true,
                  header : [{
                    icon : "glyphicon glyphicon-floppy-save",
                    class : "btn btn-primary btn-sm",
                    label : "保存",
                    style : {
                      margin : "2px"
                    },
                    events : {
                      click : saveClick
                    },
                    type : "button",
                  }],
                  columnDefs : [{
                    label : "指令类型",
                    editable : false,
                    sortable : true,
                    filterable : true,
                    data : "label",
                    type : "text",
                    modes : {
                      default : {
                        type : "text",
                      }
                    }
                  }]
                };
              }
            };
            userRoleUIService.findRoleRes(params, findRoleRes_callback);
          }
        };
        dictionaryService.getDictValues(['commandType'],getAllDicts_callback);
      };
      /**
       * 标准的登录状态判定
       * 登陆后执行初始化init方法
       */
      if(!userLoginUIService.user.isAuthenticated) {
        scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            if(scope.panel == 'menus'){
              initMenuPremission()
            } else if(scope.panel == 'view'){
              initViewPremission();
            } else if(scope.panel == 'equipment'){
              initEquipmentPremission();
            };
          }
        });
      } else {
        if(scope.panel == 'menus'){
          initMenuPremission()
        } else if(scope.panel == 'view'){
          initViewPremission();
        } else if(scope.panel == 'equipment'){
          initEquipmentPremission();
        };
      }

    }
  ]);
});