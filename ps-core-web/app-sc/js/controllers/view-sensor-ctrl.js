define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('ViewSensorCtrl', ['$scope', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService',
    'SwSocket', 'Info', 'viewFlexService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', '$window', '$q','$location',
    function($scope, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService,
      SwSocket, Info, viewFlexService, unitService, growl, userDomainService, userEnterpriseService, window, q,$location) {
      console.info("切换到传感器管理");
      $scope.$on('$locationChangeSuccess', function(event) {
        if ($location.path() == "/servers") {
          userLoginUIService.changePos();
        }
      });
      var uuids = {},
        mode = 'device';
      $scope.groupModel = false;
      $scope.resourceTree = [];
      $scope.modelIds;
      $scope.alertsDic = {};
      $scope.viewDics = {};
      $scope.selectView = undefined;
      $scope.displayState = false;
      $scope.serviceViews = {};
      $scope.cam = Object.create({
        showCam: function() {
          var cur = this;
          if (cur.openCam) {
            cur.openCam();
          }
          cur.show = true;
        },
        hideCam: function() {
          var cur = this;
          if (cur.closeCam) {
            cur.closeCam();
          }
          cur.show = false;
        }
      })
      $scope.changeDispaly = function() {
        $scope.displayState = !$scope.displayState;
      }
      $scope.showGis = function() {
        $scope.mapShow = !$scope.mapShow
      }
      $scope.backMainPage = function() {
        $scope.selectView = undefined;
      }
      $scope.viewEdit = function(item, flg) {
        if ($scope.groupModel) {
          location.href = "../app-topo/index.html#topology/deviceGroup/" + flg + "/" + userLoginUIService.user.appData.solutionId + "/" + item.id;
        } else {
          location.href = "../app-topo/index.html#topology/device/" + flg + "/" + userLoginUIService.user.appData.solutionId + "/" + item.id;
        }
      };
      $scope.viewDelete = function(item) {
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认删除 ' + item.label + ' 吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              if ($scope.groupModel) {
                var clearDisplay = function() {
                  dialogRef.close();
                  delete $scope.viewDics[item.label];
                  for (var i in $scope.resourceTree) {
                    if ($scope.resourceTree[i].id == item.id) {
                      $scope.resourceTree.splice(i, 1);
                      SwSocket.unregister(item.uuid);
                      delete uuids[item.uuid];
                    }
                  }
                }
                resourceUIService.deleteDeviceGroup(item.id, function(event) {
                  if ($scope.viewDics[item.label]) {
                    viewFlexService.deleteViews([$scope.viewDics[item.label].viewId], function(resultObj) {
                      if (resultObj.code == 0) {
                        clearDisplay();
                        growl.success("关联视图清空", {});
                      }
                    });
                  } else {
                    clearDisplay();
                  }
                });
                /*
                var deleteView = function() {
                  if ($scope.viewDics[item.label]) {
                    viewFlexService.deleteViews([$scope.viewDics[item.label].viewId], function(resultObj) {
                      if (resultObj.code == 0) {
                        clearDisplay();
                        growl.success("关联视图清空", {});
                      }
                    });
                  } else {
                    clearDisplay();
                  }
                }
                var deleteDevice = function() {
                  resourceUIService.unregisterDevice(item.gatewayId, item.id, function(returnObj) {
                    if (returnObj.code == 0) {
                      deleteView();
                      growl.success("关联对象已删除", {});
                    }
                  });
                }
                resourceUIService.deactivateDevice(item.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    deleteDevice();
                    growl.success("关联对象已停用", {});
                  }
                });
                */
              } else {
                var clearDisplay = function() {
                  dialogRef.close();
                  delete $scope.viewDics[item.label];
                  for (var i in $scope.resourceTree) {
                    if ($scope.resourceTree[i].label == item.label) {
                      $scope.resourceTree.splice(i, 1);
                      SwSocket.unregister(item.uuid);
                      delete uuids[item.uuid];
                    }
                  }
                }
                var deleteView = function() {
                  if ($scope.viewDics[item.label]) {
                    viewFlexService.deleteViews([$scope.viewDics[item.label].viewId], function(resultObj) {
                      if (resultObj.code == 0) {
                        clearDisplay();
                        growl.success("关联视图清空", {});
                      }
                    });
                  } else {
                    clearDisplay();
                  }
                }
                var deleteDevice = function() {
                  resourceUIService.deleteDevice(item.id, function(returnObj) {
                    if (returnObj.code == 0) {
                      deleteView();
                      growl.success("关联对象已删除", {});
                    }
                  });
                }
                resourceUIService.deactivateDevice(item.id, function(returnObj) {
                  if (returnObj.code == 0) {
                    deleteDevice();
                    growl.success("关联对象已停用", {});
                  }
                });
              }
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
      $scope.popClose = function() {
        $scope.selectedElement = undefined;
      }
      $scope.elePos = function(top, left) {
        if ($(window).width() <= 1365) {
          top = 720 * (top / 960);
          left = 405 * (left / 540);
        } else if ($(window).width() <= 1599) {
          top = 840 * (top / 960);
          left = 472 * (left / 540);
        } else if ($(window).width() <= 1919) {
          top = 1054 * (top / 960);
          left = 596 * (left / 540);
        } else {
          top = 1280 * (top / 960);
          left = 720 * (left / 540);
        }
        return {
          top: top + "px",
          left: left + "px"
        }
      }
      $scope.getBgImg = function() {
        var path = "../images/topo/";
        var img = "topo_bg.png";
        $scope.selectView.content.bgImgId
          //      if ($scope.selectView.content.path) {
          //        img = $scope.selectView.content.path
          //      }
        if ($scope.selectView.content.bgImgId) {
          var bgs = $scope.selectView.content.bgImgId.split("/")
          img = bgs[bgs.length - 1];
        }

        return {
          "background-image": 'url(' + path + img + ')'
        }
      }
      $scope.elemCLick = function(elem) {
        $scope.selectedElement = elem;
      }

      $scope.addResource = function() {
        location.href = "../app-topo/index.html#/topology/deviceGroup/0/" + userLoginUIService.user.appData.solutionId;
      }
      $scope.addGateway = function() {
        location.href = "#gateway";
      }
      $scope.viewDetail = function(item) {
        var find;
        if ($scope.groupModel) {
          find = $scope.viewDics[item.id];
        } else {
          find = $scope.viewDics[item.label]
        }
        if (find && find.viewId && find.viewId > 0) {
          var model = item.values["model"] ? item.values["model"] : "草莓";
          $scope.news = $scope.info[model];
          $scope.reports = $scope.info[model + "_记录"];
          $scope.selectView = find;
          $scope.selectItem = item;
          $scope.selectViewElems = [];
          if ($scope.groupModel) {
            for (var i in $scope.selectView.JSON.elements) {
              var kpielement = $scope.selectView.JSON.elements[i];
              kpielement.id = $scope.selectView.JSON.elements[i].resource.id;
              kpielement.modelId = kpielement.resourceDes.modelId;
              if ($scope.selectView.JSON.elements[i].kpi.displayParamObj) {
                kpielement.chartinterval = $scope.selectView.JSON.elements[i].kpi.displayParamObj["chartInterval"]; 
              }
              kpielement.min = $scope.selectView.JSON.elements[i].kpi["min"];
              kpielement.max = $scope.selectView.JSON.elements[i].kpi["max"];

              if (!kpielement.directive && kpielement.kpi) {
                for (var j in $scope.modelIds[$scope.selectItem.modelId].directives) {
                  if (kpielement.kpi.name == $scope.modelIds[$scope.selectItem.modelId].directives[j].label) {
                    kpielement.directive = $scope.modelIds[$scope.selectItem.modelId].directives[j];
                    break;
                  }
                }
              }
              $scope.selectViewElems.push(kpielement);
            }
          } else {
            for (var i in $scope.selectView.content.elements) {
              var kpielement = $scope.selectView.content.elements[i];
              kpielement.modelId = item.modelId;
              if ($scope.selectView.content.elements[i].kpi.displayParamObj) {
                kpielement.chartinterval = $scope.selectView.content.elements[i].kpi.displayParamObj["chartInterval"];
              }
							if($scope.selectView.JSON)
							{
								kpielement.min = $scope.selectView.JSON.elements[i].kpi["min"];
								kpielement.max = $scope.selectView.JSON.elements[i].kpi["max"];
							}
              else
							{
								kpielement.min = $scope.selectView.content.elements[i].kpi["min"];
								kpielement.max = $scope.selectView.content.elements[i].kpi["max"];
							}

              if (!kpielement.directive && kpielement.kpi) {
                for (var j in $scope.modelIds[$scope.selectItem.modelId].directives) {
                  if (kpielement.kpi.name == $scope.modelIds[$scope.selectItem.modelId].directives[j].label) {
                    kpielement.directive = $scope.modelIds[$scope.selectItem.modelId].directives[j];
                    break;
                  }
                }
              }
              $scope.selectViewElems.push(kpielement);
            }
          }
          var returnObj = {
            times: [],
            data: []
          };
          var now = new Date();
          var avgprice = 0;
          for (var i = 6; i > -1; i--) {
            var date = new Date(now.getTime() - i * 24 * 3600 * 1000);
            returnObj.times.push(date.getDate() + "日");
            var price = Math.floor(10 + Math.random() * 10);
            returnObj.data.push(price);
            avgprice += price;
          }
          $scope.selectItem.avgprice = (avgprice / 7).toFixed(2);
          initPriceChart(returnObj)
        } else {
          growl.warning("当前没有详细内容可以查看,请点击编辑进行编辑", {});
        }
      }
      var getStateStyle = function(state) {
        var str;
        switch (state) {
          case -1:
            str = "btn-ps-unknow";
            break;
          case 0:
            str = "btn-ps-normal";
            break;
          default:
            str = "btn-ps-critical";
        }
        return str;
      }
      var handlerRealTimeValue = function(evendata) {
        var node = uuids[evendata.uuid][0];
        var handlerKpis = uuids[evendata.uuid][1];
        var arisingTime = evendata.data.arisingTime;
        for (var i in handlerKpis) {
          if (evendata.data.nodeId == handlerKpis[i].id && evendata.data.kpiCode == handlerKpis[i].kpiCode) {
            if (evendata.data.instance && evendata.data.instance != handlerKpis[i].instance) {
              continue;
            }
            handlerKpis[i].kpiValue = evendata.data.value;
            handlerKpis[i].value = (handlerKpis[i].kpi && handlerKpis[i].kpi.rangeObj != null) ? handlerKpis[i].kpi.rangeObj[handlerKpis[i].kpiValue] : handlerKpis[i].kpiValue;
            handlerKpis[i].state = 0;
            handlerKpis[i].stateStyle = getStateStyle(handlerKpis[i].state);
          }
        }
        $scope.$broadcast("kpiSlickValue", {
          id: node.id,
          value: handlerKpis
        });
        getResourceAlert(node, handlerKpis, true);
      }
      var getRealTimeValue = function(node, config, handlerKpis) {
        var param = {
          ciid: config.nodeIds.toString(),
          kpi: config.kpiCodes.toString()
        };
        var uuid = Math.uuid();
        node.uuid = uuid;
        uuids[uuid] = [node, handlerKpis];
        var operation = "register";
        //考虑极端情况，一个页面有多个模块监听同一个方法  
        //但展示在页面的数据需对接收的实时监听的数据做不同处理 
        SwSocket.register(uuid, operation, handlerRealTimeValue);

        //websocket发送请求
        SwSocket.send(uuid, operation, 'kpi', param);
      }
      var getResourceAlert = function(node, handlerKpis, reload) {
        var nodeArr = [];
        if ($scope.groupModel) {
          for (var i in node.JSON.elements) {
            (function(elem) {
              nodeArr.push(elem.resource.id);
            })(node.JSON.elements[i])
          }
          var info = {
            nodeIds: nodeArr.toString(),
            states: '0,5,10'
          };
        } else {
          var info = {
            nodeIds: node.id,
            states: '0,5,10'
          };
        }
        alertService.queryFromCache(info, function(returnObj) {
          if (returnObj.code == 0) {
            var nodeAlerts = [];
            for (var i in returnObj.data) {
              var hasAlert = false;
              for (var j in handlerKpis) {
                if (returnObj.data[i].nodeId == handlerKpis[j].id && returnObj.data[i].kpiCode == handlerKpis[j].kpiCode) {
                  if (returnObj.data[i].instance && returnObj.data[i].instance != handlerKpis[j].instance) {
                    continue;
                  }
                  handlerKpis[j].state = returnObj.data[i].severity;
                  handlerKpis[j].stateStyle = getStateStyle(handlerKpis[j].state);
                  hasAlert = true;
                }
              }
              if (hasAlert) {
                returnObj.data[i].time = newDateJson(returnObj.data[i].receiveTime).Format("yyyy-MM-dd hh:mm:ss");
                var stateStyle = "";
                switch (returnObj.data[i].severity) {
                  case 4:
                    stateStyle = "text-red";
                    break;
                  case 3:
                    stateStyle = "text-orange";
                  case 2:
                    stateStyle = "text-orange";
                    break;
                  default:
                    stateStyle = "text-yellow";
                }
                returnObj.data[i].stateStyle = stateStyle;
                nodeAlerts.push(returnObj.data[i]);
              }
            }

            if (nodeAlerts.length > 0)
              node.stateStyle = "box-danger";
            else
              node.stateStyle = "box-success";
            $scope.alertsDic[info.nodeIds] = nodeAlerts;

            if ($scope.groupModel) {
              node.kpis = handlerKpis;
              node.alerts = nodeAlerts;
            } else {
              node.kpis = handlerKpis;
              node.alerts = nodeAlerts;
            };
            if (reload) {
              $scope.$broadcast("kpiSlickValue", {
                id: node.id,
                value: handlerKpis
              });
            }
          }
        });
      }
      var getResourceKpiState = function(node, nodeKpis) {
        //if (!$scope.viewDics[node.label]) return;
        var nodeIds, kpiCodes = [],
          nodeArr = [];
        var elements;
        if ($scope.groupModel) {
          elements = $scope.viewDics[node.id].content.elements;
        } else {
          if ($scope.viewDics[node.label]) {
            elements = $scope.viewDics[node.label].content.elements;
          } else {
            var tmpView = {content:{elements:[],nodeId:node.id}}
            nodeKpis.forEach(function(kpi) {
              var tmpkpi = {kpi:{id:kpi.id,label:kpi.label,nodeId:node.id},resource:{id:node.id,label:node.label}}
              tmpView.content.elements.push(tmpkpi);
            });
            $scope.viewDics[node.label] = tmpView;
            elements = tmpView.content.elements;
          }
          
        }
        if ($scope.groupModel) {
          nodeKpis = []
          for (var j in elements) {
            var el = elements[j];
            nodeKpis = nodeKpis.concat($scope.modelIds[el.resourceDes.modelId].kpis);
          }
        }
				var clone = [];
				/*-------------------remove those whose kpi is not avaliable------------------*/
				elements = elements.filter(function(elem){
					var find = nodeKpis.find(function (element) {
						if (elem.kpi) {
							return element.id == elem.kpi.id
						}
						else {
							return false
						}
					});
					if(find)
					{
						return true;
					}
					else
					{
						return false;
					}
				});
				/* -------------------------------------------------------------------------- */
        for (var i in elements) {
          var ci = elements[i].resource.id;
          nodeArr.push(ci);
          if (nodeArr.indexOf(ci) == -1) {
            nodeArr.push(ci);
          }
          var newKpi = elements[i];
          if (newKpi.instance) {
            newKpi.title = newKpi.instance;
            delete newKpi.instance;
          }
          for (var j in nodeKpis) {
            if ((newKpi.kpi.id && nodeKpis[j].id == newKpi.kpi.id) || (newKpi.kpi && nodeKpis[j].id == newKpi.kpi.id)) {
              newKpi.kpiCode = nodeKpis[j].id;
              kpiCodes.push(nodeKpis[j].id)
              newKpi.label = newKpi.title ? newKpi.title : nodeKpis[j].label;
              newKpi.icon = nodeKpis[j].icon;
              newKpi.unit = (unitService.unitDics != null && unitService.unitDics[nodeKpis[j].unit] != 'Amount') ? unitService.unitDics[nodeKpis[j].unit] : '';
              newKpi.state = -1;
              newKpi.stateStyle = getStateStyle(newKpi.state);
              if ($scope.groupModel) {
                newKpi.id = ci;
                if (newKpi.instance)
                  newKpi.valueName = ci + "?" + nodeKpis[j].id;
                else
                  newKpi.valueName = ci + "?" + nodeKpis[j].id;
              } else {
                newKpi.id = node.id;
                if (newKpi.instance)
                  newKpi.valueName = node.id + "?" + nodeKpis[j].id;
                else
                  newKpi.valueName = node.id + "?" + nodeKpis[j].id;
              };

              newKpi.kpiValue = 0;
              newKpi.kpi.name = nodeKpis[j].name;
              if (nodeKpis[j].rangeObj) {
                newKpi.kpi.rangeObj = nodeKpis[j].rangeObj;
                newKpi.value = nodeKpis[j].rangeObj[newKpi.kpiValue];
              }
              if (nodeKpis[j].displayParamObj) {
                newKpi.kpi.displayParamObj = nodeKpis[j].displayParamObj;
              }
              newKpi.kpi.min = nodeKpis[j].min;
              newKpi.kpi.max = nodeKpis[j].max;
            }
          }
        }
        if ($scope.groupModel) {
          nodeIds = nodeArr;
        } else {
          nodeIds = [node.id];
        };
        var kpiQueryModel = {
          category: "time",
          isRealTimeData: true,
          timePeriod: 0,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes
        };
        var handlerFun = function(p) {
          kpiDataService.getKpiValueList(p, function(returnObj) {
            if (returnObj.code == 0) {
              var config = p[1];
              for (var i in elements) {
                var newKpi = elements[i];
                newKpi.kpiValue = "NA";
                newKpi.value = "NA";
                for (var j in returnObj.data.recordList) {
                  if (returnObj.data.recordList[j][newKpi.valueName] == null) {
                  }
                  if (returnObj.data.recordList[j][newKpi.valueName] != null) {
                    newKpi.kpiValue = returnObj.data.recordList[j][newKpi.valueName];
                    newKpi.value = (newKpi.kpi && newKpi.kpi.rangeObj != null) ? newKpi.kpi.rangeObj[newKpi.kpiValue] : newKpi.kpiValue;
                    newKpi.state = 0;
                    newKpi.stateStyle = getStateStyle(newKpi.state);
                  }
                }
              }
              getRealTimeValue(node, config, elements);
              getResourceAlert(node, elements, false);
            }
          });
        }

        resourceUIService.getResourceByIds(nodeIds, function(returnObj) {
          var model, kpis;
          kpiQueryModel.nodesDic = returnObj;
          kpiQueryModel.kpisDic = {};
          for (var i in returnObj) {
            model = $scope.modelIds[returnObj[i].modelId];
            kpis = model.kpis;
            for (var j in kpiCodes) {
              var kpiId = kpiCodes[j];
              var find = kpis.find(function(el) {
                return el.id == kpiId;
              });
              if (find) {
                kpiQueryModel.kpisDic[find.id] = find;
              }
            }
            handlerFun(["kpi", kpiQueryModel]);
          }
        });
        /* June 4th 2016, removed By Leon, coz method getKpisBykpiIds is not avaliable anymore!
        resourceUIService.getKpisByKpiIds(kpiCodes, function(returnObj) {
          kpiQueryModel.kpisDic = returnObj;
          if (kpiQueryModel.nodesDic) {
            handlerFun(["kpi", kpiQueryModel]);
          }
        });
        */
      }
      var getAllKpis = function(callback) {
        var deferers = [];
        for (var i in $scope.modelIds) {
          var defer = q.defer();
          (function(model, defer) {
            getResourceKpis(model, function(returnObj) {
              defer.resolve("success");
            });
            getResourceAlertsConfig(model);
          })($scope.modelIds[i], defer);
          deferers.push(defer.promise);
        }
        q.all(deferers).then(function success() {
          callback();
        });
      };
      var resourceKpisHandler = function(model) {
        if ($scope.groupModel) {
          for (var i in $scope.resourceTree) {
            (function(resourceGroup) {
              if (resourceGroup.modelId == model.id) {
                getResourceKpiState(resourceGroup, model.kpis);
              }
              /*
              for(var i in resourceGroup.JSON.elements){

                (function(elem){
                  if (elem.resourceDes.modelId == model.id) {
                    getResourceKpiState(elem.resourceDes, model.kpis, resourceGroup);
                  }
                })(resourceGroup.JSON.elements[i])
              }
               */
            })($scope.resourceTree[i])
          }
        } else {
          for (var i in $scope.resourceTree) {
            if ($scope.resourceTree[i].modelId == model.id) {
              getResourceKpiState($scope.resourceTree[i], model.kpis);
            }
          }
        }
      }
      var getResourceKpis = function(model, callback) {
        resourceUIService.getKpisByModelId(model.id, function(returnObj) {
          if (returnObj.code == 0) {
            model.kpis = returnObj.data;
            var regExp = /\{|\[.*\}|\]/;
            for (var i in model.kpis) {
              if (model.kpis[i].range) {

                var find = regExp.test(model.kpis[i].range);
                var rangeObj = [];
                if (find) {
                  try {
                    rangeObj = find ? JSON.parse(model.kpis[i].range) : [];
                  } catch (e) {

                  }
                }
                model.kpis[i].rangeAry = rangeObj;
                if (rangeObj instanceof Array) {
                  model.kpis[i].rangeAry = rangeObj;
                  if (rangeObj.length == 2) {
                    model.kpis[i].min = rangeObj[0];
                    model.kpis[i].max = rangeObj[1];
                  }
                } else if (rangeObj instanceof Object) {
                  model.kpis[i].rangeObj = rangeObj;
                }
              }
              if (model.kpis[i].displayParam) {
                var find = regExp.test(model.kpis[i].displayParam);
                var displayParamObj = {};
                if (find) {
                  displayParamObj = JSON.parse(model.kpis[i].displayParam);
                }
                model.kpis[i].displayParamObj = displayParamObj;
              }
              resourceUIService.kpisDic[model.id+"??"+model.kpis[i].id] = model.kpis[i];
              resourceUIService.kpisDic[model.kpis[i].id] = model.kpis[i];
            }
            if (callback) {
              callback(model);
            }
          };
        });
      }

      var getResourceAlertsConfig = function(model) {
        resourceUIService.getAlertsByModelId(model.id, function(returnObj) {
          if (returnObj.code == 0) {
            model.alertsConfig = returnObj.data;
          };
        });
      }

      /**
       * 获得该用户所有的模型资源
       * @param {Object} ciName
       */
      var getAllResource = function(ciName) {
        $scope.modelIds = {};
        
        if ($scope.groupModel) {
          resourceUIService.getDeviceGroupModels(function(returnObj) {
						for(var i in returnObj.data){
							$scope.modelIds[returnObj.data[i].id] = {
								id: returnObj.data[i].id,
								viewId: returnObj.data[i].viewId,
								model: returnObj.data[i],
								directives: null
							};
						}
            resourceUIService.getModels(modelsCallback);
          });
        } else {
          resourceUIService.getModels(modelsCallback);
        }

        function modelsCallback(returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              for (var j in viewFlexService.viewList) {
                if (returnObj.data[i].category != 'Sensor') {
                  if (returnObj.data[i].label == viewFlexService.viewList[j].viewTitle) {
                    if (viewFlexService.viewList[j].viewType == 'designView') {
                      returnObj.data[i].viewId = viewFlexService.viewList[j].viewId;
                    }
                    break;
                  }
                }
              }
              $scope.modelIds[returnObj.data[i].id] = {
                id: returnObj.data[i].id,
                viewId: returnObj.data[i].viewId,
                model: returnObj.data[i],
                directives: null
              };
            }
          }
          getMyResouces();
        }
        /**
         * 获得该用户的设备资源
         */
        var resourceGroup = []
        var getMyResouces = function() {
          if ($scope.groupModel) {
            resourceUIService.getDeviceGroups(function(returnObj) {
              if (returnObj.code == 0) {
                resourceGroup = returnObj.data;
              }
              resourceUIService.getResources(deviceGroupCallback);
            });
          } else {
            viewFlexService.getServiceViewMap(function(returnObj){
              if (returnObj.code == 0) {
                $scope.serviceViews = returnObj.data?returnObj.data:{};
              }
              resourceUIService.getResources(resourcesCallback);
            })
          }

          function deviceGroupCallback(returnObj) {
            var resources;
            if (returnObj.code == 0) {
              resources = returnObj.data;
              for (var i in viewFlexService.viewList) {
                (function(view) {
                  var regExp = /\{.*}/;
                  var pass = regExp.test(view.content);
                  var dt = pass ? JSON.parse(view.content) : undefined;
                  if (dt) {
                    if (dt.elements instanceof Array) {
                      dt.elements = dt.elements.sort(function(prev, next) {
                        if (prev.kpi && next.kpi) {
                          if (prev.kpi.id > next.kpi.id) {
                            return 1;
                          } else {
                            return -1;
                          }
                        } else {
                          return 1;
                        }
                      });
                    }
                    view.JSON = dt;
                  }
                })(viewFlexService.viewList[i])
              }
              for (var i in resourceGroup) {
                (function(rg) {
                  var find = viewFlexService.viewList.find(function(view) {
                    if (view.JSON) {
                      return view.JSON.nodeId == rg.id;
                    } else {
                      return false
                    }
                  });
                  console.log(find);
                  if (find) {
                    $scope.viewDics[rg.id] = find;
                    //$scope.viewDics[rg.id].content = find.JSON;
                    rg.JSON = find.JSON;
                    var clone = JSON.parse(JSON.stringify(rg.JSON.elements));
                    for (var j in clone) {
                      var rid = clone[j].resource.id;
                      var fd = resources.find(function(elem) {
                        if (elem.id == rid) {
                          //$scope.viewDics[returnObj.elem.label] = view;
                          $scope.viewDics[elem.label] = {};
                          $scope.viewDics[elem.label].content = rg.JSON;
                        }
                        //console.log(elem.id, rid, rg.JSON.elements[j].resource.label, rg.JSON.elements[j]);
                        return elem.id == rid;
                      });
                      if (fd) {
                        clone[j].resourceDes = fd;
                      } else {
                        clone[j].removed = true;
                      }
                    }
                    console.log(clone);
                    rg.JSON.elements = clone.filter(function(elem) {
                      return elem.removed != true;
                    });
                    $scope.viewDics[rg.id].content = rg.JSON;
                  }
                })(resourceGroup[i])
              }
              console.log(resourceGroup);
              $scope.resourceTree = resourceGroup.map(function(element) {
                var result = JSON.parse(JSON.stringify(element));
                result.kpis = [];
                result.alerts = [];
                result.viewId = null;
                if (result.values.hasOwnProperty("standardAddress")) {
                  var arr = result.values.standardAddress.split(",");
                  if (arr.length == 1) {
                    if (arr[0]) {
                      result.city = arr[0];
                    } else {
                      result.city = '北京';
                    }
                  } else {
                    if (arr[0].indexOf("市") > -1)
                      result.city = arr[0];
                    else
                      result.city = arr[1];
                  }

                } else {
                  result.city = '北京';
                }
                if (result.values.hasOwnProperty("introduce")) {
                  result.introduce = result.values.introduce;
                }
                if (result.values.hasOwnProperty("installationPosition")) {
                  result.installationPosition = result.values.installationPosition;
                }
                if (result.values.hasOwnProperty("specialty")) {
                  result.specialty = result.values.specialty;
                }
                result.stateStyle = "box-default";
                return result;
              });
              getAllKpis(function() {
                for (var i in $scope.modelIds) {
                  resourceKpisHandler($scope.modelIds[i]);
                }
              })
            }
          }

          function resourcesCallback(returnObj) {
            if (returnObj.code == 0) {
              var resourceAry = [];
              for (var i in returnObj.data) {
                if (returnObj.data[i].category == 'Sensor') continue;
                if (!$scope.modelIds[returnObj.data[i].modelId]) continue;
                if (returnObj.data[i].label == null || returnObj.data[i].label.indexOf('农业大棚模拟') > -1) continue;
                if ($scope.modelIds[returnObj.data[i].modelId].directives == null) {
                  getResourceDirectives($scope.modelIds[returnObj.data[i].modelId]);
                }
                returnObj.data[i].kpis = [];
                returnObj.data[i].alerts = [];
                returnObj.data[i].viewId = $scope.modelIds[returnObj.data[i].modelId].viewId;
                if (returnObj.data[i].values.hasOwnProperty("standardAddress")) {
                  var arr = returnObj.data[i].values.standardAddress.split(",");
                  if (arr.length == 1) {
                    if (arr[0]) {
                      returnObj.data[i].city = arr[0];
                    } else {
                      returnObj.data[i].city = '北京';
                    }
                  } else {
                    if (arr[0].indexOf("市") > -1)
                      returnObj.data[i].city = arr[0];
                    else
                      returnObj.data[i].city = arr[1];
                  }

                } else {
                  returnObj.data[i].city = '北京';
                }
                if (returnObj.data[i].values.hasOwnProperty("introduce")) {
                  returnObj.data[i].introduce = returnObj.data[i].values.introduce;
                }
                if (returnObj.data[i].values.hasOwnProperty("installationPosition")) {
                  returnObj.data[i].installationPosition = returnObj.data[i].values.installationPosition;
                }
                if (returnObj.data[i].values.hasOwnProperty("specialty")) {
                  returnObj.data[i].specialty = returnObj.data[i].values.specialty;
                }
                returnObj.data[i].stateStyle = "box-default";
                $scope.viewDics[returnObj.data[i].label] = $scope.serviceViews[returnObj.data[i].modelId];
                for (var j in viewFlexService.viewList) {
                  (function(index, view) {
                    var dt, content = view.content;
                    if (typeof content == 'string') {
                      dt = JSON.parse(content);
                    } else if (typeof content == 'object') {
                      dt = content;
                    }
                    if (dt ? dt.nodeId == returnObj.data[i].id : false) {
                      $scope.viewDics[returnObj.data[i].label] = view;
                      $scope.viewDics[returnObj.data[i].label].content = dt;
                      returnObj.data[i].title = dt.label;
                    }
                  })(j, viewFlexService.viewList[j])
                }
                resourceAry.push(returnObj.data[i]);
              }
              $scope.resourceTree = resourceAry;
              if ($routeParams.level) {
                for (var i in $scope.resourceTree) {
                  if ($scope.resourceTree[i].id == $routeParams.nodeId) {
                    $scope.viewDetail($scope.resourceTree[i]);
                  }
                }
              }
              for (var modelId in $scope.modelIds) {
                //获得该模型的KPI定义
                getResourceKpis($scope.modelIds[modelId], resourceKpisHandler);
                //获得该模型的告警定义
                getResourceAlertsConfig($scope.modelIds[modelId]);
              }
            }
          };
        };
      };
      $scope.getHierarchyValue = function(nodeIds, kpiCodes, instances, callback) {
        var kpiDef = resourceUIService.kpisDic[kpiCodes[0]];
        var timePeriod = resourceUIService.getMSvalue(0, kpiDef);
        var kpiQueryModel = {
          category: "time",
          isRealTimeData: true,
          timePeriod: 1000*60*60*12,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes,
          kpisDic:{minTimespan:timePeriod}
        };
        /*
        var kpiQueryModel = {
          category: "time",
          isRealTimeData: true,
          timePeriod: timePeriod * 10,
          nodeIds: nodeIds,
          kpiCodes: kpiCodes,
          queryInstances: instances.toString()
        };
        */
        var handlerFun = function(p) {
          kpiDataService.getKpiValueList(p, function(returnObj) {
            if (returnObj.code == 0) {
              var config = p[1];
              var valueName = config.nodeIds[0] + "?" + config.kpiCodes[0];
              if (config.queryInstances) {
                valueName += "?" + config.queryInstances;
              }
              var returnItem = {
                data: [],
                times: []
              };
              for (var i in returnObj.data.recordList) {
                returnItem.data.push(returnObj.data.recordList[i][valueName]);
                var time;
                if (kpiDef.granularityUnit == "SECOND")
                  time = newDateJson(returnObj.data.recordList[i].arisingTime).Format("hh:mm:ss")
                else
                  time = newDateJson(returnObj.data.recordList[i].arisingTime).Format("hh:mm")
                returnItem.times.push(time);
              }
              callback(returnItem);
            }
          });
        };
        resourceUIService.getResourceByIds(nodeIds, function(returnObj) {
          var model, kpis;
          kpiQueryModel.nodesDic = returnObj;
          kpiQueryModel.kpisDic[kpiDef.id] = kpiDef;
//        for (var i in returnObj) {
//          model = $scope.modelIds[returnObj[i].modelId];
//          kpis = model.kpis;
//          for (var j in kpiCodes) {
//            var kpiId = kpiCodes[j];
//            var find = kpis.find(function(el) {
//              return el.id == kpiId;
//            });
//            if (find) {
//              kpiQueryModel.kpisDic = find;
//            }
//          }
//        }
          handlerFun(["kpi", kpiQueryModel]);
        });
        /* June 4th 2016, removed By Leon, coz method getKpisBykpiIds is not avaliable anymore!
        resourceUIService.getResourceByIds(nodeIds, function(returnObj) {
          kpiQueryModel.nodesDic = returnObj;
          if (kpiQueryModel.kpisDic) {
            handlerFun(["kpi", kpiQueryModel]);
          }

        });
        resourceUIService.getKpisByKpiIds(kpiCodes, function(returnObj) {
          kpiQueryModel.kpisDic = returnObj;
          if (kpiQueryModel.nodesDic) {
            handlerFun(["kpi", kpiQueryModel]);
          }
        });
        */
      }

      var initPriceChart = function(returnObj) {
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            x: 35,
            y: 30,
            x2: 40,
            y2: 30
          },
          toolbox: {
            show: false,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: returnObj.times,
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            }
          }],
          series: [{
            name: '每公斤',
            type: 'line',
            data: returnObj.data,
            markPoint: {
              textStyle: {
                fontSize: 10
              },
              data: [{
                symbolSize: 10,
                type: 'max',
                name: '最大值'
              }, {
                symbolSize: 10,
                type: 'min',
                name: '最小值'
              }],
            }
          }]
        };
        $timeout(function() {
          $scope.$broadcast(Event.ECHARTINFOSINIT, {
            "name": "priceMain",
            "option": option
          });
        });
      }
      var getResourceDirectives = function(model) {
        model.directives = [];
        resourceUIService.getDirectivesByModelId(model.id, function(returnObj) {
          if (returnObj.code == 0) {
            model.directives = returnObj.data;
          };
        });
      }
      var directiveHandler = function() {
        var sendDeviceDirective = function(param) {
          param.nodeId = $scope.selectItem.id;
          param.itemDirValues = {
            value: param.itemDirValues
          }
          resourceUIService.sendDeviceDirective(param.nodeId, Number(param.id), param.itemDirValues, function(returnObj) {
            if (returnObj.code == 0) {
              growl.success("指令发送成功", {});
            }
          });
        }
        $scope.$on("switchChange", function(e, param) {
          sendDeviceDirective(param)
        })
      }
      var getNews = function() {
        var info = Info.get("localdb/news.json", function(info) {
          $scope.info = info;
        });
      };
      var init = function() {
        if (viewFlexService.viewLoadFinished && userLoginUIService.user.isAuthenticated) {
          //202表示大棚服务中心框架，managedByGroups==1表示设备组
					if(userLoginUIService.user.appData.serviceViewTemplate == 202)
					{
						if(userLoginUIService.user.appData.managedByGroup == 0)
						{
							$scope.groupModel = false;
						}
						else
						{
							$scope.groupModel = true;
						}
					}
					else
					{
						$scope.groupModel = true;
					}
          $scope.serviceViewId = userLoginUIService.user.appData.serviceViewTemplate;
          $scope.camDisp = userLoginUIService.user.appData.serviceViewTemplate == 204;
          getNews();
          getAllResource();
          directiveHandler();
        }
      }
      $scope.$on('viewLoadFinished', function() {
        init();
      });
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }

      /**
       * 注销scope时注销方法heartBeat，回调函数callback  
       */
      $scope.$on("$destroy", function() {
        for (var uuid in uuids)
          SwSocket.unregister(uuid);
      });
    }
  ]);
});