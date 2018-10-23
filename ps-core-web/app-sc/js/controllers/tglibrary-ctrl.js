define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.initController("tglibraryPrevCtrl", tglibraryPrevCtrl);
  tglibraryPrevCtrl.$inject = ['$scope', '$q', 'serviceCenterService', '$route', 'userLoginUIService', '$location', 'viewFlexService', 'resourceUIService', '$timeout', '$window'];

  function tglibraryPrevCtrl(scope, q, serviceCenterService, route, userLoginUIService, location, viewFlexService, resourceUIService, timeout, window) {
    scope.$on('$locationChangeSuccess', function(event) {
      if (location.path() == "/servers") {
        userLoginUIService.changePos();
      }
    });
    var allMyViews, $deviceGroup, solutionId;
    if(userLoginUIService.user.appData) {
      solutionId = userLoginUIService.user.appData.solutionId;
    } else {
      scope.$on("loginStatusChanged", function() {
        solutionId = userLoginUIService.user.appData.solutionId;
      });
    }
    $deviceGroup = function(element) {
      var cur = this;
      for(var i in element) {
        cur[i] = element[i];
      }
    };
    $deviceGroup.prototype.edit = function() {
      var cur = this;
      var deviceGroupId = cur.id;
      location.path("tongji/edit/" + solutionId + "/" + deviceGroupId);
    };
    $deviceGroup.prototype.detail = function() {
      var cur = this;
      var deviceGroupId = cur.id;
      location.path("tongji/detail/" + deviceGroupId);
    };
    scope.addResource = function() {
      location.path("tongji/edit/" + solutionId);
    }
    $deviceGroup.prototype.remove = function() {
      var cur = this;
      var deviceGroupId = cur.id;
      var viewId = cur.view.viewId;
      viewFlexService.deleteViews([viewId], callback);

      function callback(event) {
        resourceUIService.deleteDeviceGroup(deviceGroupId, callback);

        function callback(event) {
          scope.deviceGroups = scope.deviceGroups.filter(function(element) {
            return element.id != deviceGroupId;
          });
        }
      }
    };
    serviceCenterService.views.getAll(false).then(success, error);

    function success(data) {
      allMyViews = data.filter(function(element) {
        return element.viewTitle == "tongji_deviceGroup"
      });
      var nodes = [];
      var kpis = [];
      for(var i in allMyViews) {
        (function(index, element) {
          var jsondata = {};
          var content = element.content;
          if(content.slice(0, 1) == "{" && content.slice(-1) == "}") {
            jsondata = JSON.parse(content);
            for(var i in jsondata.preview.list) {
              (function(index, element) {
                if(element.resource) {
                  if(nodes.indexOf(element.resource.id) == -1) {
                    nodes.push(element.resource.id);
                  }
                }

                if(element.kpi) {
                  if(nodes.indexOf(element.kpi.id) == -1) {
                    kpis.push(element.kpi.id);
                  }
                }
              })(i, jsondata.preview.list[i]);
            }
          }
          element.JSON = jsondata;
        })(i, allMyViews[i])
      }
      serviceCenterService.getValues(nodes, kpis).then(allValueLoaded, error);

      function allValueLoaded(data) {
        for(var i in allMyViews) {
          (function(index, element) {
            for(var j in element.JSON.preview.list) {
              (function(index, elem) {
                var find = data.find(function(el) {
                  if(elem.kpi && elem.resource) {
                    return el.kpiCode == elem.kpi.id && el.nodeId == elem.resource.id;
                  } else {
                    return false;
                  }
                });
                if(find) {
                  if(find.value) {
                    elem.value = find.value;
                  } else {
                    elem.value = '-';
                  }
                } else {
                  elem.value = '-';
                }
              })(j, element.JSON.preview.list[j])
            }
          })(i, allMyViews[i])
        }
        serviceCenterService.deviceGroups.getAll(false).then(success, error);
      }

      function success(data) {
        scope.deviceGroups = data.map(function(deviceGroup) {
          var result = {
            id: deviceGroup.id,
            label: deviceGroup.label,
            view: null
          }
          var find = allMyViews.find(function(view) {
            return view.JSON.deviceGroupId == result.id;
          });
          result.view = find;
          return new $deviceGroup(result);
        });
      }

      function error(err) {
        console.log(err);
      }
    }

    function error(err) {
      console.log(err);
    }
  }
  controllers.initController("tgedit", tgeditCtrl);
  tgeditCtrl.$inject = ['$scope', '$q', 'serviceCenterService', '$route', '$location', 'viewFlexService', 'resourceUIService', 'solutionUIService', '$window','userLoginUIService'];

  function tgeditCtrl(scope, q, serviceCenterService, route, location, viewFlexService, resourceUIService, solutionUIService, window,userLoginUIService) {
    scope.$on('$locationChangeSuccess', function(event) {
      if (location.path() == "/servers") {
        userLoginUIService.changePos();
      }
    });
    var currentDeviceGroup, currentView, handleView, $resource, $preview, $charts, $clone, $dragElement, solutionId, deviceGroupId, groupId, $model, mode, units;
    serviceCenterService.units.getAll().then(function(data) {
      units = data;
    });
    if(route.current) {
      if(route.current.$$route.originalPath.indexOf('modeledit') != -1) {
        scope.mode = 'editmodel'
      } else if(route.current.$$route.originalPath.indexOf('edit') != -1) {
        scope.mode = 'edit'
      }
      groupId = route.current.params.groupId;
      deviceGroupId = route.current.params.deviceGroupId;
      scope.solutionId = solutionId = route.current.params.solutionId;
      init();
    } else {
      scope.$on("locationChanged", function() {
        groupId = route.current.params.groupId;
        deviceGroupId = route.current.params.deviceGroupId;
        solutionId = route.current.params.solutionId;
        if(route.current.$$route.originalPath.indexOf('modeledit') != -1) {
          scope.mode = 'editmodel'
        } else if(route.current.$$route.originalPath.indexOf('edit') != -1) {
          scope.mode = 'edit'
        }
        init();
      });
    }
    scope.kpiChange = kpiChange;
    scope.alertOn = false;

    function kpiChange(target) {
      if(target.kpi != null) {
        if(typeof target.resource == "object" && target.resource != null) {
          serviceCenterService.getValues([target.resource.id], [target.kpi.id]).then(success, error);
        }
      }

      function success(data) {
        if(data.length > 0) {
          if(typeof target.setValue == "function") {
            target.setValue(parseInt(data[0].value));
          } else {
            target.value = parseInt(data[0].value);
          }
        } else {
          target.value = "-";
        }
      }

      function error(err) {

      }
    };
    $dragElement = function(data) {
      var cur = this;
      for(var i in data) {
        cur[i] = data[i];
      }
    };
    $dragElement.prototype.stopMove = function(ui) {
      var cur = this;
      var top = ui.offset.top - $(".drawingArea").offset().top;
      var left = ui.offset.left - $(".drawingArea").offset().left;
      cur.top = top;
      cur.topPortion = top / $(".drawingArea").height();
      cur.left = left;
      cur.leftPortion = left / $(".drawingArea").width();
    };
    $dragElement.prototype.stopResize = function(ui) {
      var cur = this;
      cur.width = $(ui.element).width();
      cur.widthPortion = cur.width / $(".drawingArea").width();
      cur.height = $(ui.element).height();
      cur.heightPortion = cur.height / $(".drawingArea").height();
    };
    $dragElement.prototype.remove = function() {
      var cur = this;
      scope.drawarea.list = scope.drawarea.list.filter(function(element) {
        return element !== cur
      });
    };
    $dragElement.prototype.focusOn = function() {
      var cur = this;
      scope.parametersEditor = cur;
    };
    scope.step = 0;
    scope.exit = function() {
      if (solutionId != "0") {
        window.location.href = "../app-ac/index.html#/myView";
      } else {
        userLoginUIService.changePos();
      }
    };
    scope.createNew = {
      type: 'bar',
      show: true,
      bar: {
        scale: true,
        width: 50,
        height: 131
      },
      switch: {
        scale: false,
        width: 100,
        height: 50,
        bgimageOpen: 'images/tongji/switch_green1.png',
        bgimageClose: 'images/tongji/switch_red1.png'
      },
      open: {
        scale: true,
        width: 80,
        height: 80
      },
      blink: {
        scale: false,
        width: 100,
        height: 100,
        bgimage: 'images/tongji/tank1_red.png'
      },
      resource: null,
      kpi: null
    };
    scope.ondrop = function(ui) {
      var top = ui.offset.top - $(".drawingArea").offset().top;
      var left = ui.offset.left - $(".drawingArea").offset().left;
      var result = new $dragElement({
        top: top,
        topPortion: top / $(".drawingArea").height(),
        left: left,
        leftPortion: left / $(".drawingArea").width(),
        type: scope.createNew.type,
        scale: scope.createNew[scope.createNew.type].scale,
        model: scope.createNew.model,
        modelObj: scope.createNew.modelObj,
        resource: scope.createNew.resource,
        resourceObj: scope.createNew.resourceObj,
        kpi: scope.createNew.kpi,
        show: scope.createNew.show,
        width: scope.createNew[scope.createNew.type].width,
        widthPortion: scope.createNew[scope.createNew.type].width / $(".drawingArea").width(),
        height: scope.createNew[scope.createNew.type].height,
        heightPortion: scope.createNew[scope.createNew.type].height / $(".drawingArea").height(),
        bgimageOpen: scope.createNew[scope.createNew.type].bgimageOpen,
        bgimageClose: scope.createNew[scope.createNew.type].bgimageClose,
        bgBlinkImage: scope.createNew[scope.createNew.type].bgimage,
        value: scope.createNew.value
      });
      result[result.type] = JSON.parse(JSON.stringify(scope.createNew[scope.createNew.type]));
      if(scope.drawarea.list) {
        scope.drawarea.list.push(result);
      } else {
        scope.drawarea.list = [result];
      }
    };
    scope.drawPos = function(element) {
      var result = {};
      result = {
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
        position: "absolute",
        transform: 'rotate(0deg)'
      };
      return result;
    };
    scope.calcuRotation = function(element) {
      var result = {
        'transform': 'rotate(-' + element.value + 'deg)',
        '-ms-transform': 'rotate(-' + element.value + 'deg)',
        '-moz-transform': 'rotate(-' + element.value + 'deg)',
        '-webkit-transform': 'rotate(-' + element.value + 'deg)',
        '-o-transform': 'rotate(-' + element.value + 'deg)'
      }
      return result;
    }
    scope.saveAndExit = function() {
      var result = {};
      result.preview = getData.call(scope.preview);
      result.drawarea = getDrawarea.call(scope.drawarea);
      result.charts = getData.call(scope.charts);
      handleView(result);

      function getData() {
        var cur = this;
        var result = {
          list: cur.list.map(function(element) {
            var result = {}
            result.label = element.label;
            result.type = element.type;
            if(element.model) {
              result.model = {
                id: element.model.id,
                label: element.model.label
              }
            }
            if(element.resource) {
              result.resource = {
                id: element.resource.id,
                label: element.resource.label
              }
            }
            if(element[element.type]) {
              result[result.type] = {
                id: element[element.type].id,
                label: element[element.type].label,
                unit: element[element.type].unit
              };
              if(element[element.type].icon) {
                result[result.type].icon = element[element.type].icon;
              }
            }
            return result;
          })
        };
        if(cur.title) {
          result.title = cur.title
        }
        return result;
      }

      function getDrawarea() {
        var result, cur = this;
        result = {
          list: cur.list.map(function(element) {
            var result = {};
            if(element.model) {
              result.model = {
                id: element.model.id,
                label: element.model.label
              }
            }
            if(element.resource) {
              result.resource = {
                id: element.resource.id,
                label: element.resource.label
              }
            }
            if(element.kpi) {
              result.kpi = {
                id: element.kpi.id,
                label: element.kpi.label
              };
            }
            result.show = element.show;
            result.scale = element.scale;
            result.type = element.type;
            result.width = element.width;
            result.widthPortion = element.widthPortion;
            result.height = element.height;
            result.heightPortion = element.heightPortion;
            result.top = element.top;
            result.topPortion = element.topPortion;
            result.left = element.left;
            result.leftPortion = element.leftPortion;
            if(element.bgimageOpen) {
              result.bgimageOpen = element.bgimageOpen;
            }
            if(element.bgimageClose) {
              result.bgimageClose = element.bgimageClose;
            }
            if(element.bgBlinkImage) {
              result.bgBlinkImage = element.bgBlinkImage;
            }
            return result;
          })
        };
        result.backgroundImage = cur.backgroundImage;
        return result;
      }
    };
    $clone = function(data) {
      var result = {};
      for(var i in data) {
        if(i != "$$hashKey" && data.hasOwnProperty(i)) {
          result[i] = data[i];
        }
      }
      return result;
    };
    //Object used
    $model = function(data) {
      var cur = this;
      for(var i in data) {
        if(i != "$$hashKey" && data.hasOwnProperty(i)) {
          if(typeof data[i] == 'object' && typeof data[i] != null) {
            cur[i] = JSON.parse(JSON.stringify(data[i]));
          } else {
            cur[i] = data[i];
          }
        }
      }
    };
    $model.prototype.onChange = function(target) {
      var cur = this;
      var modelId = cur.id;
      if(target != null) {
        target.model = $clone(cur);
      }
      if(cur.kpi == undefined) {
        serviceCenterService.kpis.getBymodelId(modelId).then(successKpi, errorKpi);
      } else {
        if(target != null) {
          target.model.kpi = cur.kpi;
        }
      }
      if(cur.attr == undefined) {
        serviceCenterService.attrs.getBymodelId(modelId).then(successAttr, errorAttr);
      } else {
        if(target != null) {
          target.model.attr = cur.attr;
        }
      }

      function successKpi(data) {
        cur.kpi = data.map(function(element) {
          return {
            id: element.id,
            label: element.label,
            icon: element.icon ? element.icon : 'ps-irrigation',
            unit: element.unit
          }
        });
        if(target != null) {
          target.model.kpi = cur.kpi;
        }
      }

      function errorKpi(err) {
        console.log(err);
      }

      function successAttr(data) {
        cur.attr = data.map(function(element) {
          return {
            id: element.id,
            label: element.label
          }
        });
        if(target != null) {
          target.model.attr = cur.attr;
        }
      }

      function errorAttr(err) {
        console.log(err);
      }
    };
    $resource = function(data) {
      var cur = this;
      cur.id = data.id;
      cur.label = data.label;
      cur.modelId = data.modelId;
    };
    $resource.prototype.onChange = function(target) {
      var cur = this;
      var modelId = cur.modelId;
      if(target != null) {
        target.resource = $clone(cur);
      }
      if(cur.kpi == undefined) {
        serviceCenterService.kpis.getBymodelId(modelId).then(successKpi, errorKpi);
      } else {
        if(target != null) {
          target.resource.kpi = cur.kpi;
        }
      }
      if(cur.attr == undefined) {
        serviceCenterService.attrs.getBymodelId(modelId).then(successAttr, errorAttr);
      } else {
        if(target != null) {
          target.resource.attr = cur.attr;
        }
      }

      function successKpi(data) {
        cur.kpi = data.map(function(element) {
          return {
            id: element.id,
            label: element.label,
            icon: element.icon ? element.icon : 'ps-irrigation',
            unit: element.unit
          }
        });
        if(target != null) {
          target.resource.kpi = cur.kpi;
        }
      }

      function errorKpi(err) {
        console.log(err);
      }

      function successAttr(data) {
        cur.attr = data.map(function(element) {
          return {
            id: element.id,
            label: element.label
          }
        });
        if(target != null) {
          target.resource.attr = cur.attr;
        }
      }

      function errorAttr(err) {
        console.log(err);
      }
    };
    $charts = function(data) {
      var cur = this;
      for(var i in data) {
        cur[i] = data[i];
      }
    };
    $charts.prototype.add = function() {
      var cur = this;
      var newItem = {
        kpi: null,
        model: null,
        resource: null,
        label: '',
        type: 'kpi'
      };
      cur.list = cur.list.concat([newItem]);
    };
    $charts.prototype.remove = function(item) {
      var cur = this;
      cur.list = cur.list.filter(function(element) {
        return element != item;
      });
    };
    $preview = function(data) {
      var cur = this;
      for(var i in data) {
        cur[i] = data[i];
      }
    };
    $preview.prototype.add = function() {
      var cur = this;
      var newItem = {
        kpi: null,
        model: null,
        resource: null,
        label: '',
        type: 'kpi'
      };
      cur.list = cur.list.concat([newItem]);
    };
    $preview.prototype.remove = function(item) {
      var cur = this;
      if(item.resource) {
        item.resource.used = false;
      }
      cur.list = cur.list.filter(function(element) {
        return element != item;
      });
    };
    //FUNCTIONS
    function init() {
      if(scope.mode == 'editmodel') {
        if(solutionId) {
          handleView = saveServiceViewContent;
          solutionUIService.getServiceViewContent(solutionId, groupId, 0, allViewLoaded);
        } else {
          if(deviceGroupId) {
            handleView = updateNewDeviceGroup;
            resourceUIService.getResourceById(deviceGroupId, resourceInfoLoaded);
          } else {
            handleView = saveNewDeviceGroup;
            createNew();
          }
        }
      } else if(scope.mode == 'edit') {
        if(deviceGroupId) {
          handleView = updateNewDeviceGroup;
          resourceUIService.getResourceById(deviceGroupId, resourceInfoLoaded);
        } else {
          handleView = saveNewDeviceGroup;
          viewFlexService.getServiceViewMap(function(event) {
            createNewByMap(event.data);
          });
          //createNew();
        }
      }

      function resourceInfoLoaded(event) {
        if(event.code == 0) {
          currentDeviceGroup = event.data;
        }
        serviceCenterService.views.getAll().then(function(data) {
          var views = data;
          for(var i in views) {
            if(views[i].viewTitle == 'tongji_deviceGroup') {
              var tg = JSON.parse(views[i].content);
              if(tg.deviceGroupId == deviceGroupId) {
                currentView = tg;
                currentView.viewId = views[i].viewId;
              }
              update(currentDeviceGroup);
            }
          }
        });
      }

      function allViewLoaded(event) {
        if(event.code == '0') {
          if(typeof event.data == 'string') {
            currentView = JSON.parse(event.data);
          }
        }
        if(solutionId) {
          if(currentView == undefined) {
            newSolution()
          } else {
            updateSolution(currentDeviceGroup);
          }
        } else {
          update(currentDeviceGroup);
        }
      }

      function saveNewDeviceGroup(data) {
        //console.log(data);
        //scope.deviceGroupModel = data;
        var deviceGroup = JSON.parse(JSON.stringify(scope.deviceGroupModel));
        deviceGroup.modelId = deviceGroup.id;
        delete deviceGroup.id;
        resourceUIService.saveDeviceGroup(deviceGroup, callback);

        function callback(event) {
          var newdeviceGroup = event.data;
          data.deviceGroupId = newdeviceGroup.id;
          var JSONstring = JSON.stringify(data);
          try {
            var param = {
              viewTitle: "tongji_deviceGroup",
              viewName: "tongji_deviceGroup",
              viewType: "tongji_deviceGroup",
              content: JSONstring
            }
            viewFlexService.addView(param, callback);
          } catch(err) {
            alert(err);
          }

          function callback(event) {
            console.log(event);
            location.path("tongji/prev");
          }
        }
      }

      function saveServiceViewContent(data) {
        var JSONstring = JSON.stringify(data);
        solutionUIService.saveServiceViewContent(solutionId, groupId, 0, JSONstring, function(event) {
          window.location.href = "../app-ac/index.html#/myView";
        });
      }

      function updateNewDeviceGroup(data) {
        var deviceGroup = JSON.parse(JSON.stringify(currentDeviceGroup));
        resourceUIService.saveDeviceGroup(deviceGroup, callback);

        function callback(event) {
          var newdeviceGroup = event.data;
          data.deviceGroupId = newdeviceGroup.id;
          var JSONstring = JSON.stringify(data);
          try {
            var param = {
              viewId: currentView.viewId,
              viewTitle: "tongji_deviceGroup",
              viewName: "tongji_deviceGroup",
              viewType: "tongji_deviceGroup",
              content: JSONstring
            }
            viewFlexService.updateView(param, callback);
          } catch(err) {
            alert(err);
          }

          function callback(event) {
            location.path("tongji/prev");
          }
        }
      }
    };

    function newSolution() {
      solutionUIService.getModelsByGroupId(solutionId, groupId, function(event) {
        if(event.code == '0') {
          scope.allModels = event.data.map(function(element) {
            return new $model(element);
          });
          scope.preview = new $preview({
            list: []
          });
          scope.drawarea = {
            list: [],
            backgroundImage: 'images/tongji/bg.png'
          };
          scope.charts = new $charts({
            list: []
          });
        }
      });
    }

    function updateSolution(currentDeviceGroup) {
      solutionUIService.getModelsByGroupId(solutionId, groupId, function(event) {
        if(event.code == '0') {
          scope.allModels = event.data.map(function(element) {
            return new $model(element);
          });
          scope.preview = new $preview(currentView.preview);
          scope.drawarea = currentView.drawarea;
          scope.drawarea.list = scope.drawarea.list.map(function(element) {
            return new $dragElement(element);
          });
          scope.charts = new $charts(currentView.charts);
          for(var i in scope.preview.list) {
            (function(index, elem) {
              handleModel.call(elem);
            })(i, scope.preview.list[i]);
          }
          for(var i in scope.drawarea.list) {
            (function(index, elem) {
              handleModel.call(elem);
            })(i, scope.drawarea.list[i]);
          }
          for(var i in scope.charts.list) {
            (function(index, elem) {
              handleModel.call(elem);
            })(i, scope.charts.list[i]);
          }
        }

        function handleModel() {
          var cur = this,
            model;
          if(cur.model) {
            model = scope.allModels.find(function(element) {
              return cur.model.id == element.id;
            });
          }
          cur.modelObj = model;
          if(model) {
            serviceCenterService.kpis.getBymodelId(model.id).then(successKpi, errorKpi);
          }

          function successKpi(data) {
            cur.model.kpi = data.map(function(element) {
              return {
                id: element.id,
                label: element.label,
                icon: element.icon ? element.icon : 'ps-irrigation',
                unit: element.unit
              }
            });
            cur.kpi = cur.model.kpi.find(function(k) {
              return k.id == cur.kpi.id;
            });
            kpiChange(cur);
          }

          function errorKpi(err) {
            console.log(err);
          }
        }
      });
    }

    function update(deviceGroup) {
      serviceCenterService.resources.getAll().then(success, error);

      function success(data) {
        scope.resources = data.map(function(element) {
          return new $resource(element);
        });
        serviceCenterService.deviceGroupModels.getAll().then(success, error);

        function success(data) {
          scope.deviceGroupModels = data;
          scope.deviceGroupModel = scope.deviceGroupModels.find(function(element) {
            return deviceGroup.modelId == element.id;
          });
          var preview = currentView.preview;
          var charts = currentView.charts;
          scope.preview = new $preview(preview);
          scope.drawarea = currentView.drawarea;
          scope.drawarea.list = scope.drawarea.list.map(function(element) {
            return new $dragElement(element);
          });
          scope.charts = new $charts(charts);
          for(var i in scope.preview.list) {
            (function(index, elem) {
              handleResource.call(elem);
            })(i, scope.preview.list[i]);
          }
          for(var i in scope.drawarea.list) {
            (function(index, elem) {
              handleResource.call(elem);
            })(i, scope.drawarea.list[i]);
          }
          for(var i in scope.charts.list) {
            (function(index, elem) {
              handleResource.call(elem);
            })(i, scope.charts.list[i]);
          }

          function handleResource() {
            var cur = this,
              resource;
            if(cur.resource) {
              resource = scope.resources.find(function(element) {
                return cur.resource.id == element.id;
              });
            }
            cur.resourceObj = resource;
            if(resource) {
              serviceCenterService.kpis.getBymodelId(resource.modelId).then(successKpi, errorKpi);
            }

            function successKpi(data) {
              cur.resource.kpi = data.map(function(element) {
                return {
                  id: element.id,
                  label: element.label,
                  icon: element.icon ? element.icon : 'ps-irrigation',
                  unit: element.unit
                }
              });
              cur.kpi = cur.resource.kpi.find(function(k) {
                return k.id == cur.kpi.id;
              });
              kpiChange(cur);
            }

            function errorKpi(err) {
              console.log(err);
            }
          }
        }

        function error(err) {
          console.log(err)
        }
      }

      function error(err) {
        console.log(err)
      }
    }

    function createNewByMap(dataMap) {
      var viewContent;
      serviceCenterService.deviceGroupModels.getAll().then(success, error);

      function success(data) {
        scope.deviceGroupModels = data;
        if(scope.deviceGroupModels instanceof Array ? scope.deviceGroupModels.length > 0 : false) {
          scope.deviceGroupModel = scope.deviceGroupModels[0];
          if(dataMap[scope.deviceGroupModel.id]) {
            viewContent = JSON.parse(dataMap[scope.deviceGroupModel.id]);
          }
        }
        serviceCenterService.resources.getAll().then(success, error);

        function success(data) {
          scope.resources = data.map(function(element) {
            return new $resource(element);
          });
          var preview = viewContent ? viewContent.preview : {
            list: []
          };
          var charts = viewContent ? viewContent.charts : {
            list: []
          };
          scope.preview = new $preview(preview);
          scope.drawarea = viewContent ? viewContent.drawarea : {
            list: [],
            backgroundImage: 'images/tongji/bg.png'
          };
          scope.drawarea.list = scope.drawarea.list.map(function(element) {
            return new $dragElement(element);
          });
          scope.charts = new $charts(charts);
          for(var i in scope.preview.list) {
            (function(index, elem) {
              handleResource.call(elem);
            })(i, scope.preview.list[i]);
          }
          for(var i in scope.drawarea.list) {
            (function(index, elem) {
              handleResource.call(elem);
            })(i, scope.drawarea.list[i]);
          }
          for(var i in scope.charts.list) {
            (function(index, elem) {
              handleResource.call(elem);
            })(i, scope.charts.list[i]);
          }

          function handleResource() {
            var cur = this,
              resource;
            if(cur.model) {
              resource = scope.resources.find(function(element) {
                return cur.model.id == element.modelId;
              });
            }
            if(resource) {
              cur.resource = {
                id: resource.id,
                label: resource.label
              };
              cur.resourceObj = resource;
              serviceCenterService.kpis.getBymodelId(resource.modelId).then(successKpi, errorKpi);
            }

            function successKpi(data) {
              if(cur.resource) {
                cur.resource.kpi = data.map(function(element) {
                  return {
                    id: element.id,
                    label: element.label,
                    icon: element.icon ? element.icon : 'ps-irrigation',
                    unit: element.unit
                  }
                });
                cur.kpi = cur.resource.kpi.find(function(k) {
                  return k.id == cur.kpi.id;
                });
              }
              kpiChange(cur);
            }

            function errorKpi(err) {
              console.log(err);
            }
          }
        }

        function error(err) {
          console.log(err)
        }
      }

      function error(err) {
        console.log(err)
      }
    }

    function createNew() {
      serviceCenterService.deviceGroupModels.getAll().then(success, error);

      function success(data) {
        scope.deviceGroupModels = data;
        if(scope.deviceGroupModels instanceof Array ? scope.deviceGroupModels.length > 0 : false) {
          scope.deviceGroupModel = scope.deviceGroupModels[0];
        }
        scope.preview = new $preview({
          list: []
        });
        scope.drawarea = {
          list: [],
          backgroundImage: 'images/tongji/bg.png'
        };
        scope.charts = new $charts({
          list: []
        });
        serviceCenterService.resources.getAll().then(success, error);

        function success(data) {
          scope.resources = data.map(function(element) {
            return new $resource(element);
          });
        }

        function error(err) {
          console.log(err)
        }
      }

      function error(err) {
        console.log(err)
      }
    }
  }
  controllers.initController("tglibraryCtrl", tglibraryCtrl);
  tglibraryCtrl.$inject = ['$scope', '$q', 'serviceCenterService', '$route', '$window', '$location', 'resourceUIService', "chartOptionService", "SwSocket", '$timeout', "solutionUIService","userLoginUIService"];

  function tglibraryCtrl(scope, q, serviceCenterService, route, window, location, resourceUIService, chartOptionService, SwSocket, timeout, solutionUIService,userLoginUIService) {
    scope.$on('$locationChangeSuccess', function(event) {
      if (location.path() == "/servers") {
        userLoginUIService.changePos();
      }
    });
    var deviceGroupId, currentDeviceGroup, currentView, blinks = [],
      showCam = false,
      uuid;
    scope.health = {};
    scope.wholeClick = function() {
      scope.panelShow = false;
    };
    scope.orderHandlerClick = function() {
      window.location.href = "../app-oc/index.html#/workorder";
    };
    scope.overviewClick = function() {
      window.location.href = "../app-oc/index.html#/dashboard";
    };
    scope.equipmentClick = function() {
      window.location.href = "../app-oc/index.html#/gateways2";
    };
    scope.malfunctionClick = function() {
      window.location.href = "../app-oc/index.html#/configAlert/0";
    };
    scope.chartClick = function() {
      window.location.href = "../app-oc/index.html#/designView";
    };
    scope.panelShow = false;
    scope.$on("$destroy", function() {
      SwSocket.unregister(uuid);
    });
    scope.panelClick = function() {
      scope.panelShow = !scope.panelShow
    };
    scope.ipcam = {

    };
    scope.camClick = function() {
      if(scope.ipcam.openCam) {
        scope.ipcam.openCam();
      }
      showCam = true;
    };
    scope.closeCam = function() {
      if(scope.ipcam.closeCam) {
        scope.ipcam.closeCam();
      }
      showCam = false;
    };
    scope.showCam = function() {
      return showCam;
    };
    scope.blinkClick = function() {
      scope.alertOn = !scope.alertOn;
      if(scope.alertOn) {
        for(var i in blinks) {
          blinks[i].startBlink();
        }
        scope.health.startBlink();
      } else {
        for(var i in blinks) {
          blinks[i].stopBlink();
        }
        scope.health.stopBlink();
      }
    }
    scope.drawPos = function(element) {
      var result = {};
      result = {
        top: (element.topPortion * 100) + "%",
        left: (element.leftPortion * 100) + "%",
        width: (element.widthPortion * 100) + "%",
        height: (element.heightPortion * 100) + "%",
        transform: 'rotate(0deg)',
        position: "absolute"
      };
      return result;
    };
    scope.calcuRotation = function(element) {
      var result = {
        'transform': 'rotate(-' + element.value + 'deg)',
        '-ms-transform': 'rotate(-' + element.value + 'deg)',
        '-moz-transform': 'rotate(-' + element.value + 'deg)',
        '-webkit-transform': 'rotate(-' + element.value + 'deg)',
        '-o-transform': 'rotate(-' + element.value + 'deg)'
      }
      return result;
    }
    if(route.current) {
      deviceGroupId = route.current.params.deviceGroupId;
      init(deviceGroupId);
    } else {
      scope.$on("locationChanged", function() {
        deviceGroupId = route.current.params.deviceGroupId;
        init(deviceGroupId);
      });
    }

    function init(deviceGroupId) {
      resourceUIService.getResourceById(deviceGroupId, resourceInfoLoaded);

    }

    function resourceInfoLoaded(event) {
      if(event.code == 0) {
        currentDeviceGroup = event.data;
      }
      serviceCenterService.views.getAll().then(allViewLoaded);
      //solutionUIService.getServiceViewContent(solutionId, groupId, allViewLoaded);
    }

    function allViewLoaded(data) {
      for(var i in data) {
        if(data[i].viewTitle == 'tongji_deviceGroup') {
          var dt = JSON.parse(data[i].content);
          if(dt.deviceGroupId == deviceGroupId) {
            currentView = dt;
            console.log(currentView);
          }
        }
      }

      scope.charts = currentView.charts;
      getAllValue();
    }

    function getAllValue() {
      var nodes = [],
        kpis = [],
        nodesSocket = [],
        kpisSocket = [],
        nodesCharts = [],
        kpisCharts = [];
      for(var i in currentView.drawarea.list) {
        (function(index, element) {
          if(element.type == 'switch') {
            element.onChange = function(value) {
              console.log("change", value);
            }
          }
          if(element.type == 'blink') {
            blinks.push(element);
          } else {
            if(typeof element.resource == 'object' && element.resource != null) {
              if(nodes.indexOf(element.resource.id) == -1) {
                nodes.push(element.resource.id);
              }
              if(element.type == "bar" && nodesSocket.indexOf(element.resource.id) == -1) {
                nodesSocket.push(element.resource.id);
              }
              if(element.type == "switch" && nodesSocket.indexOf(element.resource.id) == -1) {
                resourceUIService.getResourceById(element.resource.id, function(event) {
                  if(event.data) {
                    var modelId = event.data.modelId;
                    serviceCenterService.directives.getBymodelId(modelId).then(function success(event) {
                      try {
                        if(event instanceof Array) {
                          var comId = event[0].id;
                          var nodeId = element.resource.id;
                          element.sendDeviceDirective = function(value) {
                            resourceUIService.sendDeviceDirective(nodeId, comId, {
                              value: value
                            }, function(event) {});
                          }
                        } else {
                          throw event.message;
                        }
                      } catch(err) {
                        console.log(err);
                      }
                    });
                  }
                });
              }
              if(element.type == "open" && nodesSocket.indexOf(element.resource.id) == -1) {
                resourceUIService.getResourceById(element.resource.id, function(event) {
                  if(event.data) {
                    var modelId = event.data.modelId;
                    serviceCenterService.directives.getBymodelId(modelId).then(function success(event) {
                      try {
                        if(event instanceof Array && event[0] != undefined) {
                          var comId = event[0].id;
                          var nodeId = element.resource.id;
                          element.sendDeviceDirective = function(value) {
                            resourceUIService.sendDeviceDirective(nodeId, comId, {
                              value: value
                            }, function(event) {});
                          }
                        } else {
                          throw event.message;
                        }
                      } catch(err) {
                        console.log(err);
                      }
                    });
                  }
                });
              }
            }
            if(typeof element.kpi == 'object' && element.kpi != null) {
              if(kpis.indexOf(element.kpi.id) == -1) {
                kpis.push(element.kpi.id);
              }
              if(kpisSocket.indexOf(element.kpi.id) == -1) {
                kpisSocket.push(element.kpi.id);
              }
            }
          }
        })(i, currentView.drawarea.list[i])
      }
      for(var i in currentView.charts.list) {
        (function(index, element) {
          if(typeof element.resource == 'object' && element.resource != null) {
            if(nodesCharts.indexOf(element.resource.id) == -1) {
              nodesCharts.push(element.resource);
            }
            if(nodesSocket.indexOf(element.resource.id) == -1) {
              console.log("sw:node", element.resource.id);
              nodesSocket.push(element.resource.id);
            }
          }
          if(typeof element.kpi == 'object' && element.kpi != null) {
            if(nodesCharts.indexOf(element.kpi.id) == -1) {
              kpisCharts.push(element.kpi);
            }
            if(kpisSocket.indexOf(element.kpi.id) == -1) {
              console.log("sw:kpi", element.kpi.id);
              kpisSocket.push(element.kpi.id);
            }
          }
        })(i, currentView.charts.list[i])
      }
      webSocketOpen(nodesSocket, kpisSocket)
      serviceCenterService.getValues(nodes, kpis).then(allValueLoaded);
      serviceCenterService.getValuesListAndMergeByTime(nodesCharts, kpisCharts, 7 * 24 * 3600 * 1000, 100 * 1000).then(allValueListLoaded);
    }

    function webSocketOpen(nodes, kpis) {
      uuid = Math.uuid();
      var param = {
        ciid: nodes.toString(),
        kpi: kpis.toString()
      };
      timeout(function() {
        repeat();
      }, 2000);

      function repeat() {
        for(var i in currentView.charts.list) {
          var elem = currentView.charts.list[i];
          var finalValue = elem._option_.series[0].data[elem._option_.series[0].data.length - 1];
          var finalTime = elem._option_.xAxis.data[elem._option_.xAxis.data.length - 1];
          finalValue = parseInt(finalValue) + parseInt(parseInt((finalValue) * (Math.random() - .5) / 100));
          //console.log(finalValue, finalTime);
          currentView.charts.list[i].pushData(finalValue, parseInt(finalTime) + 100);
          timeout(function() {
            repeat();
          }, 25000);
        }
      }
      /*
      SwSocket.register(uuid, "register", function(event){
      	try{
      		if(event.data)
      		{
      			var kpiId = event.data.kpiCode;
      			var nodeId = event.data.nodeId;
      			var findDraw = currentView.drawarea.list.find(function(element){
      				if(typeof element.resource == 'object' && element.resource != null && typeof element.kpi == 'object' && element.kpi != null)
      				{
      					return element.resource.id == nodeId && element.kpi.id == kpiId
      				}
      				else
      				{
      					return false;
      				}
      			});
      			var findChart = currentView.charts.list.find(function(element){
      				if(typeof element.resource == 'object' && element.resource != null && typeof element.kpi == 'object' && element.kpi != null)
      				{
      					console.log("back:", element.resource.id, nodeId, element.kpi.id, kpiId);
      					return element.resource.id == nodeId && element.kpi.id == kpiId
      				}
      				else
      				{
      					return false;
      				}
      			});
      			if(findChart)
      			{
      				if(typeof findChart.pushData == 'function')
      				{
      					findChart.pushData(data.value);
      				}
      				else
      				{
      					console.log(findchart);
      				}
      			}
      			if(findDraw)
      			{
      				findDraw.value = data.value;
      			}
      		}
      		else
      		{
      			throw 'event is undefined!!'
      		}
      	}
      	catch(error){
      		console.log(error);
      	}
      });
      */
      SwSocket.send(uuid, "register", 'kpi', param);
    }

    function allValueLoaded(data) {
      for(var j in currentView.drawarea.list) {
        (function(index, elem) {
          pushValue.call(elem);
        })(j, currentView.drawarea.list[j])
      }
      start(currentView);

      function pushValue() {
        var cur = this;
        var find = data.find(function(el) {
          if(typeof cur.kpi == 'object' && cur.kpi != null && typeof cur.resource == 'object' && cur.resource != null) {
            return el.kpiCode == cur.kpi.id && el.nodeId == cur.resource.id;
          } else {
            return false;
          }
        });
        if(find) {
          if(find.value) {
            cur.value = find.value;
          } else {
            cur.value = '-';
          }
        } else {
          cur.value = '-';
        }
      }
    }

    function allValueListLoaded(data) {
      var colors = ["#d99a37", "#c25262", "#39a4d9", "#d97c39", "#4ccbb4"]
      for(var i in scope.charts.list) {
        (function(index, element) {
          if(typeof element.resource == "object" && element.resource != null && typeof element.kpi == "object" && element.kpi != null) {
            var find = data.legend.find(function(elem) {
              return elem.ci == element.resource.label && elem.kpi == element.kpi.label
            });
            var inx = data.legend.indexOf(find);
            if(data.$attr('series/' + index + "/data/length") == 0 || data.$attr('series/' + index + "/data/length") == undefined) {
              setOptions.call(element, {
                legend: ['设备－指标'],
                xAxis: (function() {
                  var xAxis = [];
                  var timeEnd = new Date().getTime();
                  for(var i = 0; i < 14; i++) {
                    xAxis.push(timeEnd - 3600 * 100);
                  }
                  xAxis.sort();
                  return xAxis;
                })(),
                series: (function() {
                  var series = [];
                  for(var i = 0; i < 14; i++) {
                    series.push(parseInt(Math.random() * 100));
                  }
                  return [{
                    name: {
                      ci: '设备',
                      kpi: '指标'
                    },
                    data: series
                  }]
                })()
              }, colors[index % 5], true);
            } else {
              setOptions.call(element, {
                legend: [data.legend[index]],
                xAxis: data.xAxis,
                series: [data.series[index]]
              }, colors[index % 5]);
            }
          }
        })(i, scope.charts.list[i])
      }
    }

    function setOptions(data, color, track) {
      var cur = this;
      if(track) {
        console.log("tracked", data);
      }
      var lineChart = new chartOptionService.linechart();
      lineChart.setTitle({
        show: false
      });
      lineChart.setGrid({
        top: "5%",
        left: "5%",
        width: "90%",
        height: "80%"
      });
      lineChart.setTimeformat("时分");
      lineChart.setxAxis({
        data: data.xAxis
      });
      data.series[0].$extension({
        itemStyle: {
          normal: {
            color: color
          }
        },
        lineStyle: {
          normal: {
            color: color
          }
        },
        areaStyle: {
          type: 'default',
          normal: {
            color: color
          }
        }
      });
      lineChart.setSeriesByCiKpi(data.series);
      if(typeof cur.setOption == 'function') {
        cur.setOption(lineChart.returnOption());
      }
    }

    function start(data) {
      scope.drawarea = data.drawarea;
    }
  }
});