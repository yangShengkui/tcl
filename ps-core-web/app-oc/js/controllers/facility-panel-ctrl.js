define(['controllers/controllers', 'bootstrap-dialog', 'Array'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('FacilityPanelCtrl', ['$scope', '$q', '$timeout', '$routeParams', 'growl', 'userUIService', 'userEnterpriseService', 'kpiDataService', 'resourceUIService', 'Info',
    'viewFlexService', 'userDomainService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'ngDialog', 'deviceAccessUIService', 'freeboardservice', 'roleViewService',
    function(scope, q, timeout, $routeParams, growl, userUIService, userEnterpriseService, kpiDataService, resourceUIService, Info,
      viewFlexService, userDomainService, userLoginUIService, customerUIService, projectUIService, ngDialog, deviceAccessUIService, freeboardservice, roleViewService) {
      var str = decodeURIComponent($routeParams.parameter);
      var parameter = JSON.parse(decodeURIComponent($routeParams.parameter));
      var modelId = parameter[0].modelId;
      var resourceId = parameter[0].resourceId;
      if(modelId){
        scope.instance = {};
        var getManagedViewsByType_back = function(event){
          var allAvaliableViews, defaultDviews;
          if(event.code == 0){
            allAvaliableViews = event.data;
            var getDefaultView_back = function(event){
              if(event.code == 0){
                defaultDviews = event.data;
                if(event.data instanceof Array){
                  var template;
                  var templateDefault = defaultDviews.find(function(elem){
                    if(elem.template){
                      if(elem.template.resourceId == modelId){
                        return true;
                      } else {
                        return false;
                      }
                    } else {
                      return false;
                    }
                  });
                  var templateExtent = allAvaliableViews.find(function(elem){
                    var viewId = elem.viewId;
                    if(elem.template){
                      if(elem.template.resourceId == modelId){
                        var findRoleRes = function(elem){
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
                  if(templateExtent){
                    template = templateExtent;
                  } else if(templateDefault){
                    template = templateDefault;
                  }
                  if(template){
                    var getViewById_back = function(event){
                      var model, resource, content;
                      if(event.code == "0"){
                        var content = event.data.content;
                        var getModel_back = function(event){
                          if(event.code == "0"){
                            model = event.data[0];
                          }
                          var getResource_back = function(event){
                            if(event.code == "0"){
                              resource = event.data;
                              if(content != null){
                                var clone = JSON.parse(content);
                                if(clone.hasOwnProperty('groups')){

                                } else {
                                  var input = {
                                    layout : clone.data ? clone.data : clone.layout,
                                    setting : clone.setting
                                  };
                                };
                                delete clone.data;
                                var editData = new freeboardservice.replaceCiKpi(input, function(){
                                  timeout(function(){
                                    scope.instance.setMode(true);
                                    scope.instance.renderLayout(editData);
                                  });
                                }, {
                                  model : model,
                                  resource : resource
                                });
                              }
                            }
                          };
                          if(resourceId){
                            resourceUIService.getResourceById(resourceId, getResource_back);
                          } else {
                            var getResources_back = function(event){
                              if(event.code == 0){
                                scope.resources = event.data;
                                /** console.log(scope.resources); */
                                scope.resource = scope.resources[0];
                                scope.itemchange = function(event){
                                  var id = event.id.split("number:")[1];
                                  var find = scope.resources.find(function(elem){
                                    return elem.id == id;
                                  });
                                  if(find){
                                    getResource_back({
                                      code : 0,
                                      data : find
                                    })
                                  }
                                };
                                getResource_back({
                                  code : 0,
                                  data : scope.resources[0]
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
                    //http://180.76.147.159/app-freeboard/index.html#/template/model/dashboard/%7B%22modelId%22:506095638486376%7D
                    var str = JSON.stringify({modelId : modelId})
                    scope.error = "没有找到相应的设备仪表板视图，点击<a href='../app-freeboard/index.html#/template/model/dashboard/" + encodeURIComponent(str) + "' style='cursor:pointer; text-decoration: underline;'>创建设备仪表板</a>";
                  }
                } else {
                  scope.error = "视图列表为空，请联系系统管理员";
                }
              } else {
                scope.error = "获取视图列表发生错误，请联系系统管理员";
              }
            }
            viewFlexService.getDefaultView(modelId, getDefaultView_back);
          }
        };
        viewFlexService.getManagedViewsByTypeAndRole('dashboard', getManagedViewsByType_back)
      } else {
        scope.error = "传入的设备模型，或者设备参数错误。请退出重新选择。";
      };
    }
  ]);
});