define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('CmdbSolutionCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'resourceUIService',
    'SwSocket', 'Info', 'growl', '$route', 'ngDialog', 'viewFlexService', 'solutionUIService',
    function($scope, $rootScope, $location, $routeParams, $timeout, userLoginUIService, resourceUIService,
      SwSocket, Info, growl, route, ngDialog, viewFlexService, solutionUIService) {
      console.info("切换到资源管理-设备相关管理");
      $scope.routePaths = [];
      $scope.routePathNodes = {};
      $scope.selectedDitem = null;
      $scope.queryDitem = null;
      $scope.domainListDic = {};
      $scope.userGridData;
      $scope.visible = false;
      $scope.treeAry = [];
      $scope.activeMainTab = "设备类型视图";
      if(route.current) {
        $scope.activeTab = route.current.params.activeTab ? route.current.params.activeTab : ($scope.treeviewIndex == "/modelsGroup" ? '设备组模板信息' : '模板信息');
      } else {
        scope.$on("locationChanged", function() {
          $scope.activeTab = route.current.params.activeTab ? route.current.params.activeTab : ($scope.treeviewIndex == "/modelsGroup" ? '设备组模板信息' : '模板信息');
        });
      }
      //$scope.activeTab = '模板信息';
      $scope.previousMainTab;
      $scope.activeListTab = "tab1";
      var initstate = false;
      var columns = [];
      var columsData = [];
      var activeTab;
      var previousTab;
      var previousDomainID;
      var previousDomainPath;
      var info = Info.get("../localdb/icon.json", function(info) {
        $scope.iconList = info.qualityIcon;
        $scope.kpiIconList = info.kpiIcon;
      });
      var callback = function(evendata) {
        console.log("callback:", evendata);
        var addDatas = [];
        $scope.$broadcast('OptionStatusChange', {
          "data": addDatas
        });
      };
      var getViewId = function(pName) {
        for(var i in viewFlexService.viewList) {
          var v = viewFlexService.viewList[i];
          if(v.viewType == 'designView' && pName.search(v.viewTitle) > -1) {
            return v.viewId;
          }
        }
        return 0;
      };
      var getColumns = function(ary) {
        for(var i in ary) {
          var col = ary[i];
          if(col.visible == true || col.visible == "true") {
            var colobj = new Object();
            colobj.data = col.dataField;
            colobj.title = col.headerText;
            columns.push(colobj);
          }
        }
      }
      var formatDate = function(str) {
        if(str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      }
      var getIcon = function(random) {
        var icon;
        switch(true) {
          case random > 0.9:
            icon = "fa fa-hospital-o";
            break;
          case random > 0.8:
            icon = "fa fa-truck";
            break;
          case random > 0.7:
            icon = "fa fa-tv";
            break;
          case random > 0.6:
            icon = "fa fa-users";
            break;
          case random > 0.5:
            icon = "fa fa-bolt";
            break;
          case random > 0.4:
            icon = "fa fa-bank";
            break;
          default:
            icon = "fa fa-plus";
        }
        return icon;
      };

      var getIds = function(model) {
        var solutionId = 0;
        var groupId = 0;
        var modelId = 0;
        if($scope.selectedSolution && $scope.selectedSolution.id) {
          solutionId = $scope.selectedSolution.id;
        }
        if($scope.selectedGroupitem && $scope.selectedGroupitem.id) {
          groupId = $scope.selectedGroupitem.id;
        } else {
          if(model.category == "DeviceGroup") {
            groupId = model.id;
          }
        }
        if(model.category != "DeviceGroup") {
          modelId = model.id;
        }
        return {
          solutionId: solutionId,
          groupId: groupId,
          modelId: modelId
        };
      };

      var initDateRanger = function() {
        return;
        $('input[name="daterange"]').daterangepicker({
          timePicker: true,
          timePicker24Hour: true,
          autoUpdateInput: true,
          opens: "left",
          locale: {
            format: 'YYYY/MM/DD HH:mm:ss'
          }
        });
      }

      var getResourceAttrs = function(model, callback) {
        resourceUIService.getAttrsByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.attrs = returnObj.data;
            model.isLoaded = model.isLoaded + 1;
            if(callback) {
              callback();
            }
          };
        });
      }

      var getResourceKpis = function(model) {
        resourceUIService.getKpisByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.kpis = returnObj.data;
          };
        });
      }

      //注释
      var getResourceAlertsAndThresholds = function(model) {
        var ids = getIds(model);
        solutionUIService.getThresholdsBySolution(ids.solutionId, ids.groupId, ids.modelId, function(returnObj) {
          if(returnObj.code == 0) {
            model.alerts = returnObj.data;
          };
        });
      }


      var getGatherList = function(model){
        resourceUIService.findCollectionTaskDefinitionByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.gather = returnObj.data;
          };
        });
      }

      var getResourceDirectives = function(model) {
        model.directives = [];
        resourceUIService.getDirectivesByModelId(model.id, function(returnObj) {
          if(returnObj.code == 0) {
            model.directives = returnObj.data;
          };
        });
      }
      var initModelAtts = function(obj, idx) {
        obj.count = 0;
        var random = Math.random();
        obj.icon = obj.icon ? obj.icon : 'fa fa-building-o';
        obj.alertlv = "bg-green"; //random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
        obj.isLoaded = 0;
        obj.type = 0;
        obj.text = obj.label;
        obj.name = obj.label;
        if(obj.category == "DeviceGroup")
          obj.canEdit = obj.canEdit;
        else
          obj.canEdit = false;
        if(idx != false) {
          getResourceAttrs(obj);
          getResourceKpis(obj);
          getResourceAlertsAndThresholds(obj);
          getResourceDirectives(obj);
          getGatherList(obj);
        }
        return obj;
      }

      var urmpTree = function(ciName) {
        var handler = function(returnObj) {
          if(returnObj.code == 0) {
            resourceUIService.rootModelDic = {};
            $scope.modelListSelect = returnObj.data;
            var tree = returnObj.data;
            for(var i in tree) {
              var obj = initModelAtts(tree[i], false);
              if(!$scope.routePathNodes[obj.parentModelId])
                $scope.routePathNodes[obj.parentModelId] = [];
              $scope.routePathNodes[obj.parentModelId].push(obj);
              if(!$scope.routePathNodes[obj.id])
                $scope.routePathNodes[obj.id] = [];
              resourceUIService.rootModelDic[obj.id] = obj;
            }
            var addNodes = function(parentNode) {
              for(var modeid in $scope.routePathNodes) {
                if(modeid == parentNode.id) {
                  parentNode.nodes = $scope.routePathNodes[modeid]
                  for(var i in parentNode.nodes) {
                    addNodes(parentNode.nodes[i])
                  }
                  if(parentNode.nodes.length == 0) {
                    parentNode.nodes = null;
                  }
                }
              }
            }
            addNodes(resourceUIService.rootModel);
            for(var key in $scope.routePathNodes) {
              if(key != resourceUIService.rootModel.id && !resourceUIService.rootModelDic[key]) {
                for(var i in $scope.routePathNodes[key]) {
                  addNodes($scope.routePathNodes[key][i]);
                  if(!resourceUIService.rootModel.nodes)
                    resourceUIService.rootModel.nodes = [];
                  resourceUIService.rootModel.nodes.push($scope.routePathNodes[key][i])
                }
              }
            }
            resourceUIService.rootModelDic[resourceUIService.rootModel.id] = resourceUIService.rootModel;
            $scope.rootModelDic = resourceUIService.rootModelDic;
            $scope.rootModel = resourceUIService.rootModel;
          }
        }
        resourceUIService.getModels(function(returnObj) {
          handler(returnObj);
        });
      };
      var reLoader = function() {
        $scope.selectedDitem.isLoaded = 1;
      };

      /**
       * 在设备类型模式下切换属性/指标/告警/指令
       */



      var changeDItem = function() {
        var obj = {
          attrs: [],
          kpis: [],
          directives: [],
          alerts: [],
          gather:[]
        };

        if($scope.selectedDitem && $scope.selectedDitem.id != 0) {
          obj = $scope.selectedDitem;
          //console.log(obj);
        }


        if($scope.activeTab == null || $scope.activeTab == "属性") {
          $scope.$broadcast(Event.ATTREDITINIT, {
            "data": obj.attrs

          });
        }



        else if($scope.activeTab == "数据项") {
          //$scope.$broadcast(Event.KPIEDITINIT, {
          $scope.$broadcast("SET", {
            "data": obj.kpis

          });
        }

        else if($scope.activeTab == "采集组") {
          //$scope.$broadcast(Event.ALERTEDITINIT, {
          $scope.$broadcast("GATHER", {
            "data": obj.gather
          });
        }



        else if($scope.activeTab == "指令") {
          $scope.$broadcast(Event.DIRECTIVESINIT, {
            "data": obj.directives
          });
        }
      };



      $scope.click = function(item) {
        $scope.selectedDirective = null;
        if($scope.activeMainTab == "设备类型视图") {
          if($scope.selectedDitem && $scope.selectedDitem.id == item.id) return;
          for(var i in $scope.routePaths) {
            if($scope.selectedDitem && $scope.routePaths[i].id == $scope.selectedDitem.id) {
              $scope.routePaths.splice(i, 1);
            }
          }
          $scope.selectedDitem = item;
          $scope.routePaths.push(item);
          $scope.visible = true;

          changeDItem();
          $scope.activeListTab = "tab1";
        }
      }

      $scope.dbClick = function(item) {
        $scope.selectedDirective = null;
        if($scope.activeMainTab == "设备类型视图") {
          for(var i in $scope.routePaths) {
            if($scope.selectedDitem && $scope.routePaths[i].id == $scope.selectedDitem.id) {
              $scope.routePaths.splice(i, 1);
            }
          }
          $scope.selectedDitem = item;
          $scope.routePaths.push(item);
          $scope.visible = true;
          $scope.activeListTab = "tab1";
          $scope.showChildren(item);
        }
      };

      $scope.addModel = function() {
        if(!$scope.selectedSolution) {
          growl.warning("请选择一个解决方案", {});
          return;
        }
        var parentModel = $scope.selectedSolution;
        var arr = [];
        for(var i in $scope.treeAry) {
          var obj = $scope.treeAry[i];
          arr.push(obj);
          if(obj.id == 0) {
            growl.warning("当前有未保存设备模板", {});
            return;
          }
        }
        var doAdd = function(newModelName) {
          var newModel = {};
          newModel.label = newModelName;
          newModel.id = 0;
          newModel.count = 0;
          newModel.icon = 'fa fa-building-o';
          newModel.isLoaded = 0;
          newModel.resources = [];
          newModel.solutionId = parentModel.id;
          newModel.canEdit = true;
          //          arr.push(newModel);
          arr.unshift(newModel);
          parentModel.nodes = arr;
          $scope.treeAry = parentModel.nodes;
          $scope.click(newModel);
        };
        doAdd('新建' + parentModel.label + '的设备组')
      }
      $scope.delModel = function() {
        if($scope.selectedDitem.id == 0) {
          var arr = [];
          for(var i in $scope.treeAry) {
            if($scope.treeAry[i].id == 0) {
              continue;
            } else {
              arr.push($scope.treeAry[i]);
            }
          }
          $scope.selectedSolution.nodes = arr;
          $scope.treeAry = $scope.selectedSolution.nodes;
          if($scope.treeAry.length > 0)
            $scope.click($scope.treeAry[0]);
          else
            $scope.selectedDitem = null;

          growl.success("删除设备模板成功", {});

        } else {

          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认删除 ' + escape($scope.selectedDitem.label) + ' 模板吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                //判断：若该设备类型关联1个或多个设备，不能删除
                if($scope.selectedDitem) {
                  solutionUIService.deleteModelFromSolution($scope.selectedSolution.id, $scope.selectedDitem.id, function(returnObj) {
                    if(returnObj.code == 0) {
                      var arr = [];
                      for(var i in $scope.treeAry) {
                        if($scope.treeAry[i].id != $scope.selectedDitem.id) {
                          arr.push($scope.treeAry[i]);
                        }
                      }
                      $scope.treeAry = arr;
                      $scope.selectedSolution.nodes = arr;
                      if($scope.treeAry.length > 0) {
                        $scope.click($scope.treeAry[0]);
                      } else {
                        $scope.routePaths[$scope.routePaths.length - 1] = {
                          name: "",
                          parentModelId: $scope.selectedSolution
                        };
                        $scope.selectedSolution.nodes = null;
                        $scope.selectedDitem = null;
                      }
                      changeDItem();
                      growl.success("删除设备模板成功")
                    }
                  });
                }
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        }
      }

      $scope.updateModel = function() {
        var handlerData = function(returnObj) {
          if(returnObj.code == 0) {
            for(var i in $scope.treeAry) {
              if($scope.treeAry[i].id == $scope.selectedDitem.id) {
                $scope.treeAry[i].label = returnObj.data.label;
                $scope.treeAry[i].icon = returnObj.data.icon;
                $scope.selectedDitem.label = returnObj.data.label;
                $scope.selectedDitem.icon = returnObj.data.icon;
              }
            }
            growl.success("修改成功", {});
          }
        }
        if($scope.selectedDitem) {
          var obj = {};
          obj.id = $scope.selectedDitem.id;
          obj.label = $scope.selectedDitem.label;
          obj.icon = $scope.selectedDitem.icon;
          if($scope.treeviewIndex == "/models") {
            resourceUIService.updateModel(obj, function(returnObj) {
              handlerData(returnObj);
            });
          } else {
            solutionUIService.saveGroupModel($scope.selectedDitem.solutionId, $scope.selectedDitem, function(returnObj) {
              handlerData(returnObj);
            });
          }
        }
      }
      $scope.modelViewEdit = function() {
        window.location.href = '../app-sc/index_machine.html#/machine/edit/' + $scope.selectedDitem.dashboardViewId + "/" + $scope.selectedDitem.id;
      };
      $scope.createServiceView = function() {
        console.log($scope.selectedSolution);
        var serviceViewId = $scope.selectedSolution.serviceViewId;
        var ids = getIds($scope.selectedDitem);
        switch(serviceViewId) {
          case 200:
            growl.warning("通用服务模板无需设计", {});
            break;
          case 201:
            window.location.href = '../app-sc/index_machine.html#/machine/edit/' + ids.solutionId + "/" + ids.modelId;
            break;
          case 202:
            if(ids.groupId && ids.groupId != 0) {
              window.location.href = '../app-topo/index.html#/topology/deviceGroupModel/0/' + ids.solutionId + "/" + ids.groupId;
            } else {
              window.location.href = '../app-topo/index.html#/topology/deviceModel/0/' + ids.solutionId + "/" + ids.modelId;
            }
            break;
          case 203:
            window.location.href = '../app-sc/index_tongji.html#/tongji/modeledit/' + ids.solutionId + "/" + ids.groupId;
            break;
          default:
            break;
        }
      };
      $scope.saveModelSubItem = function() {
        for(var i in $scope.treeAry) {
          if($scope.selectedDitem.label == $scope.treeAry[i].label && $scope.selectedDitem.id != $scope.treeAry[i].id) {
            growl.warning("当前有重复设备模板名称，请修改", {});
            return;
          }
        }
        if($scope.selectedDitem.id == 0) {
          if($scope.treeviewIndex == "/models") {
            resourceUIService.addModel($scope.selectedDitem, function(returnObj) {
              if(returnObj.code == 0) {
                var arr = [];
                var obj = initModelAtts(returnObj.data, true);
                for(var i in $scope.selectedSolution.nodes) {
                  if($scope.selectedSolution.nodes[i].id == 0) {
                    arr.push(obj);
                    continue;
                  } else {
                    arr.push($scope.selectedSolution.nodes[i]);
                  }
                }
                $scope.selectedSolution.nodes = arr;
                $scope.treeAry = arr;
                $scope.click(obj);
                growl.success("新建设备模板成功", {});
              }
            });

          } else {
            solutionUIService.saveGroupModel($scope.selectedDitem.solutionId, $scope.selectedDitem, function(returnObj) {
              if(returnObj.code == 0) {
                var arr = [];
                var obj = initModelAtts(returnObj.data, true);
                for(var i in $scope.selectedSolution.nodes) {
                  if($scope.selectedSolution.nodes[i].id == 0) {
                    arr.push(obj);
                    continue;
                  } else {
                    arr.push($scope.selectedSolution.nodes[i]);
                  }
                }
                $scope.selectedSolution.nodes = arr;
                $scope.treeAry = arr;
                $scope.click(obj);
                growl.success("新建设备组模板成功", {});
              }
            });

          }

        } else {
          $scope.updateModel($scope.selectedDitem);
        }
      }

      $scope.kpichangehandler = function(e) {
        if(e.id == -1) return;
        $scope.newKpi = {
          isEdit: 2,
          canEdit: true,
          label: "",
          name: "",
          unit: "",
          range: "",
          number: "",
          granularity: "",
          granularityUnit: "",
          option: "",
          id: 0,
          uid: 0,
          isNew: true
        }
        if(e.id != 0) {
          $scope.newKpi.id = e.id;
          $scope.newKpi.label = e.label;
          $scope.newKpi.name = e.name;
          $scope.newKpi.unit = e.unit;
          $scope.newKpi.number = e.number;
          $scope.newKpi.range = e.range;
          $scope.newKpi.icon = e.icon;
          $scope.newKpi.granularity = e.granularity;
          $scope.newKpi.granularityUnit = e.granularityUnit;
        }
        $scope.addModelSubItem();
        $scope.select2init();
      }


      $scope.addModelSubItem = function() {
        if(!$scope.selectedDitem || $scope.selectedDitem.id == 0) {
          growl.warning("当前设备模板没有保存，无法添加", {});
          return;
        };

        if($scope.activeTab == null || $scope.activeTab == "属性") {
          if(!$scope.selectedDitem.attrs) $scope.selectedDitem.attrs = [];
          for(var i = $scope.selectedDitem.attrs.length - 1; i > -1; i--) {
            if($scope.selectedDitem.attrs[i].isNew) {
              if(!$scope.selectedDitem.attrs[i].isDel) {
                growl.warning("当前有未保存属性", {});
                return;
              } else {
                $scope.selectedDitem.attrs.splice(i, 1);
              }

            }
          }
          var newAttr = {
            isEdit: 2,
            canEdit: true,
            label: "",
            name: "",
            dataType: 0,
            id: Math.uuid(),
            isNew: true
          }
          $scope.selectedDitem.attrs.push(newAttr);
          $scope.$broadcast(Event.ATTREDITINIT, {
            //"data": $scope.selectedDitem.attrs
            "data": $scope.selectedDitem.attrs
          });
        }


        else if($scope.activeTab == "数据项") {
          if(!$scope.selectedDitem.kpis) $scope.selectedDitem.kpis = [];


          for(var i = $scope.selectedDitem.kpis.length - 1; i > -1; i--) {


            if($scope.newKpi.id == $scope.selectedDitem.kpis[i].id) {
              growl.warning("该数据项在设备模板中已经使用", {});
              return;
            }

            if($scope.selectedDitem.kpis[i].isNew) {
              if(!$scope.selectedDitem.kpis[i].isDel) {
                growl.warning("当前有未保存数据项", {});
                return;
              } else {
                $scope.selectedDitem.kpis.splice(i, 1);
              }
            }


          }
          $scope.selectedDitem.kpis.push($scope.newKpi);
          //$scope.$broadcast(Event.KPIEDITINIT, {
          $scope.$broadcast("KPI", {
            "data": $scope.selectedDitem.kpis
          });
        }


        else if($scope.activeTab == "采集组") {
          if(!$scope.selectedDitem.alerts) $scope.selectedDitem.alerts = [];
          for(var i = $scope.selectedDitem.alerts.length - 1; i > -1; i--) {
            if($scope.selectedDitem.alerts[i].isNew) {
              if(!$scope.selectedDitem.alerts[i].isDel) {
                growl.warning("当前有未保存告警", {});
                return;
              } else {
                $scope.selectedDitem.alerts.splice(i, 1);
              }

            }
          }
          var newAlert = {
            isEdit: 2,
            canEdit: true,
            label: "",
            name: "",
            description: "",
            option: "",
            id: Math.uuid(),
            isNew: true
          }
          $scope.selectedDitem.alerts.push(newAlert);
          $scope.$broadcast(Event.ALERTEDITINIT, {
            "data": $scope.selectedDitem
          });
        }




        else if($scope.activeTab == "指令") {
          if(!$scope.selectedDitem.directives) $scope.selectedDitem.directives = [];
          for(var i = $scope.selectedDitem.directives.length - 1; i > -1; i--) {
            if($scope.selectedDitem.directives[i].isNew) {
              if(!$scope.selectedDitem.directives[i].isDel) {
                growl.warning("当前有未保存指令", {});
                return;
              } else {
                $scope.selectedDitem.directives.splice(i, 1);
              }

            }
          }
          var newDir = {
            isEdit: 2,
            canEdit: true,
            label: "",
            name: "",
            description: "",
            option: "",
            expression: "",
            protocolType: "",
            id: 0,
            isNew: true
          }
          $scope.selectedDitem.directives.push(newDir);
          $scope.$broadcast(Event.DIRECTIVESINIT, {
            "data": $scope.selectedDitem.directives
          });
        }
      }


      $scope.attrLabel = ""; //属性显示名称
      $scope.iconClick = function(type, indexId, thisId) {
        if($("#label" + indexId + "").val() != "图标") {
          $scope.attrLabel = $("#label" + indexId + "").val();
        }
        if(type == 'icon') {
          $("#label" + indexId + "").val("图标");
          $("#label" + indexId + "").attr("disabled", true);
          $scope.selectedDitem.attrs[indexId].label = "图标";
        } else {
          if($("#label" + indexId + "").val() == "图标") {
            $("#label" + indexId + "").val($scope.attrLabel);
          }
          $("#label" + indexId + "").attr("disabled", false);
        }

      }

      /**
       * datatables内部操作处理
       * @param {Object} type
       * @param {Object} select
       */
      $scope.doAction = function(type, select, callback) {
        //增加三种视图（设备类型，资源域，网关）显示页的判断
        if($scope.activeMainTab == "设备类型视图") {
          if(type == "save") {
            select.isEdit = 0;
            if(select.id == 0) {
              var addData = {};
              addData.label = select.label;
              addData.id = select.id;
              addData.values = select.values;
              addData.modelId = $scope.selectedDitem.id;
              resourceUIService.addResource(addData, function(returnObj) {
                if(returnObj.code == 0) {
                  reLoader();
                  growl.success("保存成功", {});
                }
              });
            } else if(select.id > 0) {
              var updataData = select.data;
              updataData.label = select.label;
              updataData.id = select.id;
              updataData.values = select.values;
              resourceUIService.updateDevice(updataData, function(returnObj) {
                if(returnObj.code == 0) {
                  reLoader();
                  growl.success("保存成功", {});
                }
              });
            }
          } else if(type == "cancel") {
            for(var i in resourceUIService.selectedInstances) {
              resourceUIService.selectedInstances[i]["isEdit"] = 0;
            }
            $scope.$broadcast(Event.CMDBINFOSINIT, {
              "option": [resourceUIService.selectedInstances, $scope.selectedDitem.attrs]
            });
          } else if(type == "delete") {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '是否要删除设备:' + escape(select.label) + '',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  resourceUIService.deleteResource(select.id, function(resultObj) {
                    if(resultObj.code == 0) {
                      reLoader();
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
          } else if(type == "change") {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '是否要改变设备状态为:' + (select.state == 1 ? '离线' : '在线') + '',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  for(var i in resourceUIService.selectedInstances) {
                    if(resourceUIService.selectedInstances[i].id == select.id) {
                      if(select.state == 1) {
                        resourceUIService.selectedInstances[i].state = 0;
                      } else {
                        resourceUIService.selectedInstances[i].state = 1;
                      }
                    }
                  }
                  $scope.$broadcast(Event.CMDBINFOSINIT, {
                    "option": [resourceUIService.selectedInstances, resourceUIService.selectedAttrs]
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
          } else if(type == "eidterror") {
            growl.warning("当前有正在编辑的设备", {});
          } else if(type == "directive") {
            location.href = '#directiveview/' + select.data.modelId + '/' + select.id;
          } else if(type == "message") {

          } else if(type == 'thresholdMessage') {
            growl.warning(select, {});
          } else if(type == 'kpi-delete') {
            if(select.isNew) {
              for(var i in $scope.selectedDitem.kpis) {
                if(select.id == $scope.selectedDitem.kpis[i].id) {
                  $scope.selectedDitem.kpis.splice(i, 1);
                  callback(true);
                  break;
                }
              }
            } else {
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '是否要删除设备数据项:' + escape(select.name) + '',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    resourceUIService.deleteKpi($scope.selectedDitem.id, select.id, function(resultObj) {
                      if(resultObj.code == 0) {
                        for(var i in $scope.selectedDitem.kpis) {
                          if(select.id == $scope.selectedDitem.kpis[i].id) {
                            $scope.selectedDitem.kpis.splice(i, 1);
                            callback(true);
                            break;
                          }
                        }
                        growl.success("数据项删除成功", {});
                      }
                    });
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function(dialogRef) {
                    callback(false);
                    dialogRef.close();
                  }
                }]
              });
            }
          } else if(type == 'kpi-save') {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '是否要保存设备数据项:' + escape(select.name) + '',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  resourceUIService.saveKpi($scope.selectedDitem.id, select, function(resultObj) {
                    if(resultObj.code == 0) {
                      callback(resultObj.data);
                      growl.success("数据项保存成功", {});
                    }
                  });
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  callback(false);
                  dialogRef.close();
                }
              }]
            });
          } else if(type == 'attr-delete') {
            if(select.isNew) {
              for(var i in $scope.selectedDitem.attrs) {
                if(select.id == $scope.selectedDitem.attrs[i].id) {
                  $scope.selectedDitem.attrs.splice(i, 1);
                  callback(true);
                  break;
                }
              }
            } else {
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '是否要删除设备属性:' + escape(select.name) + '',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    resourceUIService.deleteAttr($scope.selectedDitem.id, select.id, function(resultObj) {
                      if(resultObj.code == 0) {
                        for(var i in $scope.selectedDitem.attrs) {
                          if(select.id == $scope.selectedDitem.attrs[i].id) {
                            $scope.selectedDitem.attrs.splice(i, 1);
                            callback(true);
                            break;
                          }
                        }
                        growl.success("属性删除成功", {});
                      }
                    });
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function(dialogRef) {
                    callback(false);
                    dialogRef.close();
                  }
                }]
              });
            }
          } else if(type == 'attr-save') {
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '是否要保存设备属性:' + escape(select.name) + '',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  if(select.isNew)
                    select.id = 0;
                  select.modelId = $scope.selectedDitem.id;
                  resourceUIService.saveAttr($scope.selectedDitem.id, select, function(resultObj) {
                    if(resultObj.code == 0) {
                      callback(resultObj.data);
                      growl.success("属性保存成功", {});
                    }
                  });
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  callback(false);
                  dialogRef.close();
                }
              }]
            });
          } else if(type == 'directive-delete') {
            if(select.isNew) {
              for(var i in $scope.selectedDitem.directives) {
                if(select.id == $scope.selectedDitem.directives[i].id) {
                  $scope.selectedDitem.directives.splice(i, 1);
                  callback(true);
                  break;
                }
              }
            } else {
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '是否要删除设备数据项:' + escape(select.label) + '',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    resourceUIService.deleteDirective($scope.selectedDitem.id, select.id, function(resultObj) {
                      if(resultObj.code == 0) {
                        for(var i in $scope.selectedDitem.directives) {
                          if(select.id == $scope.selectedDitem.directives[i].id) {
                            $scope.selectedDitem.directives.splice(i, 1);
                            callback(true);
                            break;
                          }
                        }
                        growl.success("数据项删除成功", {});
                      }
                    });
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function(dialogRef) {
                    callback(false);
                    dialogRef.close();
                  }
                }]
              });
            }
          } else if(type == 'directive-save') {
            if(!callback) { //参数关联修改后自动保存
              resourceUIService.saveDirective($scope.selectedDitem.id, select, function(resultObj) {
                if(resultObj.code == 0) {
                  $scope.selectedDirective = null;
                  for(var i in $scope.selectedDitem.directives) {
                    if(select.id == $scope.selectedDitem.directives[i].id) {
                      $scope.selectedDitem.directives[i].params = select.params;
                      break;
                    }
                  }
                }
              });
              return;
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              //size:BootstrapDialog.SIZE_WIDE,
              message: '是否要保存设备数据项:' + escape(select.label) + '',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  if(select.isNew)
                    select.id = 0;
                  if($scope.selectedDirective)
                    select.params = $scope.selectedDirective.params;
                  resourceUIService.saveDirective($scope.selectedDitem.id, select, function(resultObj) {
                    if(resultObj.code == 0) {

                      callback(resultObj.data);
                      growl.success("数据项保存成功", {});
                    }
                  });
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  callback(false);
                  dialogRef.close();
                }
              }]
            });
          } else if(type == "directive-params") {
            resourceUIService.checkDirectiveParam(select, function(returnObj) {
              if(returnObj.code == 0) {
                if(returnObj.data.params.length > 0) {
                  $scope.selectedDirective = returnObj.data;
                } else {
                  growl.info("当前表达式无法解析出参数", {});
                }
              }
            });
          } else if(type == 'alert-delete') {
            if(select.isNew) {
              for(var i in $scope.selectedDitem.alerts) {
                if(select.id == $scope.selectedDitem.alerts[i].id) {
                  $scope.selectedDitem.alerts.splice(i, 1);
                  callback(true);
                  break;
                }
              }
            } else {
              BootstrapDialog.show({
                title: '提示',
                closable: false,
                //size:BootstrapDialog.SIZE_WIDE,
                message: '是否要删除设备采集组:' + escape(select.label) + '',
                buttons: [{
                  label: '确定',
                  cssClass: 'btn-success',
                  action: function(dialogRef) {
                    var ids = getIds($scope.selectedDitem);
                    solutionUIService.deleteThresholdBySolution(ids.solutionId, ids.groupId, ids.modelId, select.id, function(resultObj) {
                      if(resultObj.code == 0) {
                        for(var i in $scope.selectedDitem.alerts) {
                          if(select.id == $scope.selectedDitem.alerts[i].id) {
                            $scope.selectedDitem.alerts.splice(i, 1);
                            callback(true);
                            break;
                          }
                        }
                        growl.success("采集组删除成功", {});
                      }
                    });
                    dialogRef.close();
                  }
                }, {
                  label: '取消',
                  action: function(dialogRef) {
                    callback(false);
                    dialogRef.close();
                  }
                }]
              });
            }
          } else if(type == 'alert-save') {
            if(select.isEdit == 2 && select.isNew) select.id = 0;
            var ids = getIds($scope.selectedDitem);
            solutionUIService.saveThresholdBySolution(ids.solutionId, ids.groupId, ids.modelId, select, function(resultObj) {
              if(resultObj.code == 0) {
                callback(resultObj.data);
                growl.success("设备组保存成功", {});
              }
            });
          } else if(type == 'alert-enable') {
            var enabled = "停用";
            if(select.thresholds[0]["enabled"]) {
              enabled = "启用";
            }
            BootstrapDialog.show({
              title: '提示',
              closable: false,
              message: '确认要' + enabled + '设备采集组:' + escape(select.label) + '?',
              buttons: [{
                label: '确定',
                cssClass: 'btn-success',
                action: function(dialogRef) {
                  resourceUIService.saveThresholdsByAlert($scope.selectedDitem.id, select, function(resultObj) {
                    if(resultObj.code == 0) {
                      callback(resultObj.data);
                      growl.success("采集组已" + enabled, {});
                    }
                  });
                  dialogRef.close();
                }
              }, {
                label: '取消',
                action: function(dialogRef) {
                  callback(false);
                  dialogRef.close();
                }
              }]
            });
          }
        }
      };

      var changeDomainItem = function() {
        if($scope.activeMainTab == "设备类型视图") {
          $scope.activeTab = '属性';
          $scope.activeListTab = "tab1";
          urmpTree();
        }
        $scope.$apply();
      };
      var changeTabItem = function() {
        $scope.$apply();
        if($scope.activeListTab == "tab2") {
          $timeout(function() {
            $scope.$broadcast(Event.CMDBINFOS4MAPINIT, {
              "option": [resourceUIService.selectedInstances, resourceUIService.selectedAttrs]
            });
          });
        }
      };

      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $scope.selectedDirective = null;
        var aname = $(e.target).attr("name");
        var targetText = $(e.target).text();
        if(!aname) {
          if(targetText.search("视图") > -1) {
            // 获取已激活主页的名称
            $scope.activeMainTab = $.trim($(e.target).text());
            // 获取前一个激活的主页的名称
            $scope.previousMainTab = $(e.relatedTarget).text();

            changeDomainItem();
          } else {
            // 获取已激活的标签页的名称
            $scope.activeTab = $.trim($(e.target).text());
            // 获取前一个激活的标签页的名称
            previousTab = $.trim($(e.relatedTarget).text());
            changeDItem();
          }
        } else {
          $scope.activeListTab = aname;
          changeTabItem();
        }

      });

      var initEvent = function() {
        //		   		$('a[data-toggle="tab"]').off('shown.bs.tab');
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          $scope.selectedDirective = null;
          var aname = $(e.target).attr("name");
          var targetText = $(e.target).text();
          if(!aname) {
            if(targetText.search("视图") > -1) {
              // 获取已激活主页的名称
              $scope.activeMainTab = $.trim($(e.target).text());
              // 获取前一个激活的主页的名称
              $scope.previousMainTab = $(e.relatedTarget).text();

              changeDomainItem();
            } else {
              // 获取已激活的标签页的名称
              $scope.activeTab = $.trim($(e.target).text());
              // 获取前一个激活的标签页的名称
              previousTab = $.trim($(e.relatedTarget).text());
              changeDItem();
            }
          } else {
            $scope.activeListTab = aname;
            changeTabItem();
          }

        });
      };

      $scope.gotoPath = function(item) {
        if(item.nodes == $scope.treeAry) return;
        var newAry = [];
        for(var i in $scope.routePaths) {
          if($scope.routePaths[i].id == item.id) {
            newAry.push($scope.routePaths[i]);
            break;
          }
          newAry.push($scope.routePaths[i]);
        }
        $scope.routePaths = newAry;
        $scope.showChildren(item);
      };
      /**
       * 显示父节点
       * @param {Object} item
       */
      $scope.gotoParentPath = function(item) {
        var parent = $scope.rootModelDic[item.parentModelId];
        if(!parent) {
          parent = $scope.rootModel;
        }
        var newAry = [];
        for(var i in $scope.routePaths) {
          if($scope.routePaths[i].id == parent.id) {
            newAry.push($scope.routePaths[i]);
            break;
          }
          newAry.push($scope.routePaths[i]);
        }
        $scope.routePaths = newAry;
        $scope.treeAry = parent.nodes;
        $scope.selectedSolution = parent;
        $scope.click($scope.treeAry[0]);
      };
      /**
       * 显示兄弟节点
       * @param {Object} item
       */
      $scope.gotoBrotherPath = function(item) {
        if(item.nodes == $scope.treeAry) return;
        var newAry = [];
        for(var i in $scope.routePaths) {
          if($scope.routePaths[i].parentModelId == item.parentModelId) {
            newAry.push(item);
            break;
          }
          newAry.push($scope.routePaths[i]);
        }
        $scope.routePaths = newAry;
        $scope.showChildren(item);
      }
      $scope.showChildren = function(item) {
        if(item.id == 0) {
          growl.warning("但前设备模板没有保存，无法进行该操作", {});
          return;
        }
        if(item.nodes && item.nodes.length > 0) {
          $scope.selectedSolution = item;
          $scope.selectedDitem = null;
          $scope.treeAry = item.nodes;
          $scope.click($scope.treeAry[0]);
        } else {
          if($location.path() == "/resource_type" && $scope.enterpriseType == 0) {
            $scope.selectedSolution = item;
            $scope.selectedDitem = null;
            changeDItem();
            $scope.treeAry = [];
            $scope.routePaths.push({
              name: "",
              parentModelId: $scope.selectedSolution.id
            });
          }
        }
      };
      $scope.directiveBack = function() {
        $scope.doAction("directive-save", $scope.selectedDirective);
      }

      $scope.saveThresholds = function(modelData, alertCode, thresholds) {
        resourceUIService.saveThresholds(thresholds, function(returnObj) {
          if(returnObj.code == 0) {
            growl.success("阈值设置保存成功", {});
            var hasThreshold = false;
            for(var i = 0; i < modelData.thresholds.length; i++) {
              if(modelData.thresholds[i].alertCode == alertCode) {
                modelData.thresholds[i].thresholdsData = returnObj.data;
                hasThreshold = true;
                break;
              }
            }
            if(!hasThreshold) {
              modelData.thresholds.push({
                "alertCode": alertCode,
                "thresholdsData": returnObj.data
              });
            }
          }
        });
      };

      //用户管理数据初始化
      var getDBdata = function() {
        //客户管理
        userEnterpriseService.queryCustomer(function(resultObj) {
          if(resultObj.code == 0) {
            for(var i in resultObj.data) {
              var obj = resultObj.data[i];
              obj.isEdit = 0;
              if(obj.customerEmail == null || obj.customerEmail == "") {
                obj["customerEmail"] = obj.customerPhone;
              } else {
                obj["customerEmail"] = obj.customerEmail;
              }
            }
            $scope.userGridData = resultObj.data;
          }
        });
      }
      var getSearchResourceState = function(ids, selectedInstances) {
        kpiDataService.getRealTimeKpiData(ids, [999999], function(returnObj) {
          if(returnObj.code == 0) {
            for(var i in returnObj.data) {
              for(var j in selectedInstances) {
                if(returnObj.data[i].nodeId == selectedInstances[j].id) {
                  selectedInstances[j].health = 100 - (returnObj.data[i].value * 20)
                }
              }
            }
          }
          $scope.$broadcast(Event.CMDBINFOSINIT + "_shadows", {
            "option": selectedInstances
          });

        });
      }
      $scope.goSearch = function() {
        //      resourceUIService.getDeviceShadowsByFilter($scope.queryDitem,function(returnObj){
        if(!$scope.queryDitem) {
          $scope.queryDitem = {
            domainPath: null,
            modelId: 0
          };
        }
        resourceUIService.getCustomerDeviceByFilter($scope.queryDitem, function(returnObj) {
          if(returnObj.code == 0) {
            var nodeIds = [];
            for(var i in returnObj.data) {
              var newObj = returnObj.data[i];
              newObj.option = "";
              newObj.state = 1;
              newObj.onlineStatus = newObj.onlineStatus ? newObj.onlineStatus : 'online';
              newObj.alertlv = Math.floor(Math.random() * 4);
              newObj.externalDevId = newObj.externalDevId ? newObj.externalDevId : "";
              newObj.data = newObj;
              newObj.health = 100;
              newObj.isEdit = 0;
              newObj.selected = false;
              nodeIds.push(newObj.id);
            }
            getSearchResourceState(nodeIds, returnObj.data);
            $scope.$broadcast(Event.CMDBINFOSINIT + "_shadows", {
              "option": returnObj.data
            });
          }
        });
      };
      $scope.goClear = function() {
        $scope.queryDitem = {
          domainPath: null,
          modelId: 0
        };
      }

      $scope.placeList = [];
      $scope.selectedSolution = {};
      var dialog;
      $scope.deviceModel = 0;
      $scope.changeModel = function(n) {
        $scope.deviceModel = n;
      }
      $scope.gotoResourceType = function() {
        dialog.close();
        location.href = "../app-oc/index.html#/resource_type";
      }
      $scope.closeDialog = function() {
        $scope.deviceModel = 0;
      }
      $scope.confirm = function() {
        if(!$scope.deviceModel > 0) {
          growl.warning("请选择一个设备模板", {})
          return;
        }
        for(var i in $scope.treeAry) {
          if($scope.deviceModel == $scope.treeAry[i].id) {
            growl.warning("当前已经关联该设备模板，请重新选择", {});
            return;
          }
        }
        var handlerData = function(obj) {
          if(!$scope.treeAry) $scope.treeAry = [];
          initModelAtts(obj);
          $scope.treeAry.push(obj);
          $scope.click(obj);
          $scope.deviceModel = 0;
        }
        if($scope.selectedSolution.managedByGroup == 0) {
          solutionUIService.linkModelToSolution($scope.selectedSolution.id, $scope.deviceModel, function(returnObj) {
            if(returnObj.code == 0) {
              handlerData(returnObj.data)
            }
          });
        } else {
          solutionUIService.linkModelToGroupModel($scope.selectedSolution.id, $scope.selectedGroupitem.id, $scope.deviceModel, function(returnObj) {
            if(returnObj.code == 0) {
              handlerData(returnObj.data);
            }
          });
        }
        dialog.close();
      }
      $scope.deleteDeviceModel = function() {
        var handlerData = function(obj) {
          for(var i in $scope.treeAry) {
            if($scope.treeAry[i].id == obj.id) {
              $scope.treeAry.splice(i, 1);
              break;
            }
          }
          if($scope.treeAry.length > 0) {
            $scope.click($scope.treeAry[0]);
          } else {
            $scope.selectedDitem = null;
          }
        }
        var permission = function() {
          if($scope.selectedSolution.managedByGroup == 0) {
            solutionUIService.deleteModelFromSolution($scope.selectedSolution.id, $scope.selectedDitem.id, function(returnObj) {
              if(returnObj.code == 0) {
                handlerData(returnObj.data)
              }
            });
          } else {
            solutionUIService.deleteModelFromGroupModel($scope.selectedSolution.id, $scope.selectedGroupitem.id, $scope.selectedDitem.id, function(returnObj) {
              if(returnObj.code == 0) {
                handlerData(returnObj.data);
              }
            });
          }
        }

        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认解除 ' + escape($scope.selectedDitem.label) + ' 模板吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              permission();
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
      $scope.addDeviceModel = function() {
        dialog = ngDialog.open({
          template: 'partials/device-info.html',
          //        className: 'ngdialog-theme-plain ',
          scope: $scope
        });
      }
      $scope.linkDevices = function() {
        $rootScope.selectedGroupitem = $scope.selectedDitem;
        $rootScope.groupModels = $scope.treeAry;
        location.href = "#/models"
      };

      var changehanderdata = function(nodes) {
        for(var i in nodes) {
          initModelAtts(nodes[i]);
          if(i == 0)
            $scope.click(nodes[0]);
        }
        $scope.treeAry = nodes;
      }
      var getModelsByGroupId = function(callbackfun) {
        solutionUIService.getModelsByGroupId($scope.selectedSolution.id, $scope.selectedGroupitem.id, function(returnObj) {
          if(returnObj.code == 0) {
            callbackfun(returnObj.data);
          }
        });
      }
      var getGroupModelsBySolutionId = function(callbackfun) {
        solutionUIService.getGroupModelsBySolutionId($scope.selectedSolution.id, function(returnObj) {
          if(returnObj.code == 0) {
            callbackfun(returnObj.data);
          }
        });
      }
      var getDeviceModelsBySolutionId = function(callbackfun) {
        solutionUIService.getDeviceModelsBySolutionId($scope.selectedSolution.id, function(returnObj) {
          if(returnObj.code == 0) {
            callbackfun(returnObj.data);
          }
        });
      }
      $scope.solutionChange = function(auto) {
        $rootScope.selectedSolution = $scope.selectedSolution;
        if($scope.treeviewIndex == "/models") { //在设备模板界面
          if($scope.selectedSolution.managedByGroup == 1) { //当前为设备组模式
            if(auto && $rootScope.groupModels) { //有group
              $scope.selectedGroupitem = $rootScope.selectedGroupitem;
              $scope.groupModels = $rootScope.groupModels;
            } else {
              $rootScope.groupModels = null;
              getGroupModelsBySolutionId(function(returnVal) {
                $scope.groupModels = returnVal
              });
            }
          } else { //当前为设备模式
            getDeviceModelsBySolutionId(changehanderdata);
          }
        } else if($scope.treeviewIndex == "/modelsGroup") { //在设备组模板界面
          if($scope.selectedSolution.managedByGroup == 1) {
            $rootScope.selectedGroupitem = null;
            $rootScope.groupModels = null;
            getGroupModelsBySolutionId(changehanderdata);
          } else {
            growl.warning("该解决方案的类型为[设备]',无法使用[关联设备组]菜单")
            location.href = "#/models"; //跳转到设备组处理
          }
        }
      };
      $scope.groupChange = function(auto) {
        if($scope.treeviewIndex == "/models") { //在设备模板界面
          if($scope.selectedSolution.managedByGroup == 1) { //当前为设备组模式
            if(auto && $rootScope.selectedGroupitem) { //有group
              $scope.selectedGroupitem = $rootScope.selectedGroupitem;
            }
          }
          if($scope.selectedGroupitem) {
            getModelsByGroupId(changehanderdata);
          } else {
            $scope.treeAry = null;
            $scope.selectedDitem = null;
          }
        }
      };
      var getSolutions = function() {
        solutionUIService.getSolutionsByStatus(10,function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.placeList.push(item);
            });
            $rootScope.placeList = $scope.placeList;
          }
        })
      };

      var getSolutionsModelsGroup = function() {
        if($rootScope.placeList && $rootScope.placeList.length > 0) {
          $scope.placeList = $rootScope.placeList;
        } else {
          getSolutions();
        }
        if($rootScope.selectedGroupitem) {
          $scope.groupModels = $rootScope.groupModels;
        }
        if($rootScope.selectedSolution) {
          $scope.selectedSolution = $rootScope.selectedSolution;
          $scope.solutionChange(true);
          $scope.groupChange(true);
        } else {
          location.href = "#/myView";
        }
      };
      $scope.designDashboardView = function() {
        var ids = getIds($scope.selectedDitem);
        window.open("../app-editor2/index.html#/editor/solution/" + ids.solutionId + "/" + ids.groupId + "/" + ids.modelId);
      };

      var init = function() {
        if(initstate) return;
        $scope.domainPath = userLoginUIService.user.domainPath;
        initstate = true;
        resourceUIService.rootModel = null;

        if(resourceUIService.rootModel == null) {
          resourceUIService.getRootModel(function(returnObj) {
            if(returnObj.code == 0) {
              returnObj.data.name = returnObj.data.label;
              returnObj.data.text = returnObj.data.label;
              resourceUIService.rootModel = returnObj.data;
              urmpTree();
              getSolutionsModelsGroup();
            }
          });
        } else {
          $scope.rootModelDic = resourceUIService.rootModelDic;
          $scope.rootModel = resourceUIService.rootModel;
          getSolutionsModelsGroup();
        }

        resourceUIService.getKpiTypeByFilter({}, function(returnObj) {
          if(returnObj.code == 0) {

            var newObj = [];
            newObj.push({
              text: '请选择',
              label: '请选择',
              id: -1
            });
            newObj.push({
              text: '手动添加指标',
              label: '手动添加指标',
              id: 0
            });
            returnObj.data.forEach(function(obj) {
              obj.text = obj.label;
              newObj.push(obj);
            });

            $scope.kpiList = newObj;
          }
        });
        initEvent();

      }
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
});