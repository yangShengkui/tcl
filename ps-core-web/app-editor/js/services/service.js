define(
  ["app", "optionDataHandler", "commonlib"],
  function(service, optionDataHandler, lib) {
    service.run(["dataManagement", "$rootScope", "$location", "$route", "kpiDataService", function(dm, rootScope, loc, route, kpi) {
      rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

      function locationChangeSuccess(event) {
        var viewId = route.current.params.viewId;
        var solutionId = route.current.params.solutionId;
        var groupId = route.current.params.groupId;
        var modelId = route.current.params.modelId;
        var pathName = loc.path().split("/")[1];
        if(viewId) {
          kpi.getViewById(viewId, function(event) {
            if(event.code == "10022") {
              alert("您所登录的用户，无权访问该视图");
              setTimeout(function() {
                window.open("../../app-oc/index.html#/designView/detail", "_self");
              }, 1000);
            } else {
              dm.locationChanges(viewId);
            }
          });
        } else {
          dm.locationChanges(viewId, solutionId, groupId, modelId);
        }
        echartVersion = pathName == "echart";
      }
    }]);
    service.factory("echartVer", function() {
      var factory = {};
      var versionStr = '';
      factory.setVersionString = setVersionString;
      factory.getVersionString = getVersionString;

      function setVersionString(string) {
        versionStr = string;
      }

      function getVersionString() {
        return versionStr;
      }
      return factory;
    });
    service.factory("userInfo", function() {
      var factory = {};
      var user = '';
      factory.setUserInfo = setUserInfo;
      factory.getUserInfo = getUserInfo;

      function setUserInfo(data) {
        user = data;
      }

      function getUserInfo() {
        return user;
      }
      return factory;
    });
    service.factory("units", ["kpiDataService", "$q", function(kpiDataService, q) {
      var factory = {};
      var defer = new q.defer();
      factory.getUnits = getUnits;

      function getUnits() {
        return defer.promise;
      }
      kpiDataService.getAllUnits(function(event) {
        defer.resolve(event);
      });
      return factory;
    }]);
    service.factory("loginManagement", ["$rootScope", "authService", "$q", "$location", "$window", "echartVer", "$route", "userInfo", function(rootScope, authService, q, loc, window, echartVer, route, userInfo) {
      var factory = {};
      var _HOST_ = loc.$$host;
      var _PORT_ = loc.$$port;
      var pathName = loc.path().split("/")[1];
      factory.login = login;
      factory.logout = logout;
      factory.back = back;
      factory.newProf = newProf;
      factory.openProf = openProf;
      factory.loginChecking_login = loginChecking_login;
      factory.loginChecking_others = loginChecking_others;

      function login(item) {
        var name = item.name;
        var password = item.password;
        authService.login(name, password, login_callback, onError);

        function onError(e) {}
      }

      function logout() {
        authService.logout(logout_callback);
      }

      function loginChecking_login() {
        var defer = q.defer();
        authService.getCurrentUser(checkLoginStatus, onError);

        function onError(e) {}

        function checkLoginStatus(data) {
          if(data.code == "0") {
            if(data.data) {
              userInfo.setUserInfo(data.data);
              loc.path("echart");
            } else {
              window.open("../../login.html", "_self");
            }
          } else if(data.code == "10022") {
            alert("您所登录的用户，无权访问该视图");
            setTimeout(function() {
              window.open("../../app-oc/index.html#/designView/detail", "_self");
            }, 1000);
          }
        }
        rootScope.loading = "没有登录";
        return defer.promise;
      }

      function loginChecking_others() {
        var defer = q.defer();
        echartVer.setVersionString(pathName == "echart" ? "echart_v3" : "echart_v3");
        authService.getCurrentUser(checkLoginStatus);

        function checkLoginStatus(data) {
          if(data.data) {
            userInfo.setUserInfo(data.data);
            defer.resolve({
              status: "logined",
              data: data.data
            });
          } else {
            window.open("../../login.html", "_self");
          }
        }
        rootScope.loading = "载入设计器";
        return defer.promise;
      }

      function login_callback(data) {
        if(data.data) {
          loc.path("/echart")
        }
      }

      function newProf() {
        if(loc.path() == "/echart") {
          window.open("index.html#/new/echart", "_self");
        } else {
          window.open("index.html#/echart", "_self");
        }
      }

      function openProf(viewId) {
        window.open("index.html#/echart/" + viewId, "_self");
      }

      function back() {
        window.open("../app-oc/index.html#/designView2", "_self");
      }

      function logout_callback(data) {
        window.open("../../login.html", "_self");
      }
      return factory;
    }])
    service.factory("dataManagement", ["$rootScope", 'solutionUIService', 'resourceUIService', "authService", "graphservice", "kpiDataService", "$routeParams", "$q", "$location", "echartVer", "$timeout", "units",
      function(rootScope, solutionUIService, resourceUIService, authService, graphservice, kpi, rp, q, loc, echartVer, $timeout, units) {
        var factory = {},
          solutionId, groupId, smodelId;
        var viewId;
        var unitslist;
        var pathName = loc.path().split("/")[1];
        var deferred = q.defer();
        echartVer.setVersionString(pathName == "echart" ? "echart_v3" : "echart_v3");
        factory.saveData = saveData;
        factory.updateView = updateView;
        factory.getKpiValueList = getKpiValueList;
        factory.locationChanges = locationChanges;
        factory.getOptionData = getOptionData;
        factory.getAllModels = getAllModels;
        units.getUnits().then(function success(event) {
          unitslist = event.data;
        }, function error() {

        });

        function getAllModels() {
          return deferred.promise;
        }

        function getOptionData(dataType, category, formatStr, option, nodeslist, kpislist, timespan, callback) {
          var cat = category == "time" ? "time" : "ci";
          var dType = dataType;
          var op = option;
          getKpiValueList(category, nodeslist, kpislist, timespan, getKpiValueList_callback)

          function getKpiValueList_callback(event) {
            if(event.status == 'success') {
              var result = optionDataHandler(dType.type, dType.category[category], formatStr, event, op, unitslist);
            } else {
              var result = "获取数据错误"
            }
            callback(result, event.data);
          }
        }

        function locationChanges(vid, sid, gid, mid) {
          $timeout(function() {
            solutionId = sid;
            groupId = gid;
            viewId = vid;
            smodelId = mid;
            defer_a = q.defer();
            defer_b = q.defer();
            if(mid != 0 && mid != undefined) {
              resourceUIService.getModelByIds([mid], getModel_callback);
            } else if(gid != 0 && gid != undefined) {
              resourceUIService.getModelByIds([gid], getModel_callback);
            } else {
              graphservice.getModels(getModel_callback);
            }
            graphservice.getResources(getResources_callback);
            q.all([defer_a.promise, defer_b.promise])
              .then(modelAndResourceComplete, error);

            function getModel_callback(event) {
              var models = new lib.ArrayHandler(event.data);
              var defers = [];
              var promise = [];
              var i;
              for(i in models.data) {
                defers[i] = q.defer();
                (function(modelId, index) {
                  graphservice.getKpisByModelId(modelId, function(data) {
                    models.data[index].kpis = new lib.ArrayHandler(data.data);
                    defers[index].resolve(data);
                  })
                })(models.data[i].id, i);
              };
              for(var k in defers) {
                promise.push(defers[k].promise)
              }
              q.all(promise).then(function success(data) {
                var root = new lib.ArrayHandler([]);
                var modelshandler = new lib.ArrayHandler(models.data);
                modelshandler.each(function(model) {
                  var parentModelId = model.parentModelId;
                  if(parentModelId) {
                    var findmodel = modelshandler.find("id", parentModelId);
                    if(findmodel) {
                      if(findmodel.children) {
                        findmodel.children.push(model);
                      } else {
                        findmodel.children = new lib.ArrayHandler([model]);
                      }
                    } else {
                      root.push(model);
                    }
                  } else {
                    root.push(model);
                  }
                });
                defer_a.resolve({
                  root: root,
                  traverse: models
                });
                /* before 2016.3.15
                defer_a.resolve(models);
                */
              }, function error(data) {

              });
            }

            function getResources_callback(data) {
              console.log("get all resources", data)
              defer_b.resolve(data);
            }
          });
        };

        function modelAndResourceComplete(data) {
          kpi.getviews(function(event) {
            var views = event.data;
            getviews_callback(data, views);
          });
        }

        function getviews_callback(data, views) {
          var viewList = [];
          var models = data[0];
          /* before 2016.3.15
          var models = data[0].data;
          */
          var resources = new lib.ArrayHandler(data[1].data);
          models.traverse.each(function(model) {
            modelId = model.id;
            var findResource = resources.findAll("modelId", modelId);
            if(findResource) {
              model.resources = new lib.ArrayHandler(findResource);
            }
          });
          /* before 2016.3.15
          var models = (function(md, resources){
          	for(var i in md)
          	{
          		var mid = md[i].id;
          		var find = (function(mid){
          			var rs = [];
          			for(var j in resources){
          				if(resources[j].modelId == mid)
          				{
          					rs.push({
          						createTime : resources[j].createTime,
          						id : resources[j].id,
          						label : resources[j].label,
          					});
          				}
          			}
          			return rs;
          		})(mid);
          		if(find.length)
          		{
          			md[i].resources = find;
          		}
          	}
          	return md;
          })(data[0].data, data[1].data);
          var rs = models ? models : {};
          */
          for(var i in views) {
            if(views[i]) {
              if(views[i].viewType == "designView") {
                viewList.push(views[i]);
              }
            }
          }
          if(viewId == undefined) {
            /* before 2016.3.15
            var rs = {
            	views : viewList,
            	modelStructure : JSON.parse(JSON.stringify(rs))
            };
            */
            var rs = {
              solutionId: solutionId,
              groupId: groupId,
              smodelId: smodelId,
              views: viewList,
              modelStructure: models
            };
            console.log("modelAndResourceComplete", rs);
            /* before 2016.3.15
            rootScope.$broadcast("modelAndResourceComplete", rs);
             */
            deferred.resolve(rs);
          } else {
            /* before 2016.3.15
            getViewGraph(viewId, JSON.parse(JSON.stringify(rs)), viewList);
             */
            getViewGraph(viewId, models, viewList);
          }
        }

        function getViewGraph(viewId, models, views) {
          kpi.getViewById(viewId, getViewById_callback);

          function getViewById_callback(data) {
            var content = JSON.parse(data.data.content).elements;
            var lack = [];
            for(var i in content) {
              var find = models.traverse.find("id", content[i].modelId);
              if(!find) {
                if(content[i].modelId) {
                  if(lack.indexOf(content[i].modelId) == -1) {
                    lack.push(content[i].modelId);
                  }
                }
              }
            }
            console.log(lack);
            if(lack.length == 0) {
              deferred.resolve({
                viewId: viewId,
                views: views,
                viewTitle: data.data.viewTitle,
                modelStructure: models,
                viewList: content
              });
            } else {
              resourceUIService.getModelByIds(lack, function(event) {
                if(event.code) {
                  console.log(event.data);
                  var model = event.data[0];
                  resourceUIService.getResourceByModelId(model.id, function(event) {
                    model.resources = new lib.ArrayHandler(event.data);
                    resourceUIService.getKpisByModelId(model.id, function(event) {
                      model.kpis = new lib.ArrayHandler(event.data);
                      models.root.push(model);
                      console.log(models.root.getData());
                      deferred.resolve({
                        viewId: viewId,
                        views: views,
                        viewTitle: data.data.viewTitle,
                        modelStructure: models,
                        viewList: content
                      });
                    });
                  });
                }
              })
            }
            /* before 2016.3.15
            rootScope.$broadcast("modelAndResourceComplete", {
            	viewId : viewId,
            	views : views,
            	viewTitle : data.data.viewTitle,
            	modelStructure : models,
            	viewList : content
            });
             */
          }
        }

        function getKpiValueList(category, nodeslist, kpislist, timespan, callback) {
          if(nodeslist instanceof Array) {

          }
          var nodes = (function(obj) {
            var rs = [];
            for(var i in obj) {
              rs.push(obj[i].id);
            }
            return rs;
          })(nodeslist);
          var kpis = (function(obj) {
            var rs = [];
            for(var i in obj) {
              rs.push(obj[i].id);
            }
            return rs;
          })(kpislist);
          if(category == 'time') {
            var kpiQueryModel = {
              category: category,
              isRealTimeData: true,
              timePeriod: timespan,
              nodeIds: nodes,
              kpiCodes: kpis
            };
          } else if(category == 'ci') {
            var kpiQueryModel = {
              category: category,
              isRealTimeData: true,
              nodeIds: nodes,
              kpiCodes: kpis
            };
          }

          var param = ["kpi", kpiQueryModel];
          kpi.getKpiHierarchyValueList(param, getKpiHierarchyValueList_callback);

          function getKpiHierarchyValueList_callback(event) {
            if(event.code == "0") {
              var result;
              if(category == "time") {
                result = rearrangeTimeRecordList(event.data.recordList);
              } else if(category == "ci") {
                result = rearrangeCiRecordList(event.data.recordList);
              }
              callback({
                status: 'success',
                kpis: kpis,
                nodes: nodes,
                category: category,
                data: result
              });
            } else {
              callback({
                status: 'failure'
              });
            }
          };

          function rearrangeCiRecordList(obj) {
            var result = [];
            for(var i in nodeslist) {
              for(var j in kpislist) {
                result.push({
                  cilabel: nodeslist[i].label,
                  kpilabel: kpislist[j].label,
                  nodeLabel: nodeslist[i].label,
                  label: nodeslist[i].label + "-" + kpislist[j].label,
                  name: kpislist[j].name,
                  nodeId: nodeslist[i].nodeId,
                  kpiId: kpislist[j].kpiId,
                  unit: kpislist[j].units
                })
              }
            }
            for(var i in obj) {
              var item = obj[i];
              var name = item.category;
              for(var l in item) {
                if(l != "category") {
                  var kpiname = l;
                  var value = item[l];
                  for(var m in result) {
                    var labelComb = result[m].nodeLabel;
                    if((labelComb == name) && (kpiname == result[m].name)) {
                      result[m].value = value;
                    }
                  }
                }
              }
            }
            return result;
          };

          function rearrangeTimeRecordList(obj) {
            var result = [];
            var instance = {};
            if(obj.length > 0) {
              for(var k in obj) {
                var item = obj[k];
                for(var l in item) {
                  if(l != "category") {
                    var nodeId = l.split("-")[0];
                    var param2 = l.split("-")[1];
                    var param3 = l.split("-")[2];
                    if(param3) {
                      var name = param3;
                      var ins = param2;
                      if(!instance[nodeId]) {
                        instance[nodeId] = [];
                      }
                      var find = (function(data, value) {
                        for(var i in data) {
                          if(value == data[i]) {
                            return true;
                          }
                        }
                        return false;
                      })(instance[nodeId], ins);
                      if(!find) {
                        instance[nodeId].push(ins);
                      }

                    }

                  }
                }
              }
            }
            if(nodeslist) {
              for(var i in nodeslist) {
                for(var j in kpislist) {
                  if(instance[nodeslist[i].id]) {
                    console.log(instance[nodeslist[i].id]);
                    for(var k in instance[nodeslist[i].id]) {
                      result.push({
                        cilabel: nodeslist[i].label,
                        kpilabel: kpislist[j].label,
                        label: nodeslist[i].label + "-" + instance[nodeslist[i].nodeId][k] + "-" + kpislist[j].label,
                        name: kpislist[j].name,
                        nodeId: nodeslist[i].id,
                        instance: instance[nodeslist[i].id][k],
                        kpiId: kpislist[j].id,
                        unit: kpislist[j].unit,
                        data: []
                      })
                    }
                  } else {
                    result.push({
                      cilabel: nodeslist[i].label,
                      kpilabel: kpislist[j].label,
                      label: nodeslist[i].label + "-" + kpislist[j].label,
                      name: kpislist[j].name,
                      nodeId: nodeslist[i].id,
                      kpiId: kpislist[j].id,
                      unit: kpislist[j].unit,
                      data: []
                    });
                  }

                }
              }
            } else {
              for(var i in kpislist) {
                result.push({
                  cilabel: '模拟数据',
                  kpilabel: kpislist[i].label,
                  label: kpislist[i].label + "(模拟数据)",
                  name: kpislist[i].name,
                  nodeId: 0,
                  kpiId: kpislist[i].id,
                  unit: kpislist[i].unit,
                  data: []
                });
              }
            }
            if(nodeslist) {
              for(var k in obj) {
                var item = obj[k];
                var timeText = item.category;
                var td = timeData(timeText);
                for(var l in item) {
                  if(l != "category") {
                    var nodeId = l.split("-")[0];
                    var param2 = l.split("-")[1];
                    var param3 = l.split("-")[2];
                    var ins;
                    var name;
                    if(param3) {
                      name = param3;
                      ins = param2;

                    } else {
                      name = param2;
                    }
                    var value = item[l];
                    for(var m in result) {
                      if((result[m].nodeId == nodeId) && (result[m].name == name) && (result[m].instance == ins)) {
                        result[m].data.push({
                          value: value,
                          time: td.time,
                          timestamp: td.timestamp
                        })
                      }
                    }
                  }
                }
              }
            } else {
              var timeEnd = new Date().getTime();
              var unitTime = parseInt(timespan / 10);
              var timeStart = timeEnd - timespan;
              var k = [];
              if(unitTime != 0) {
                for(var i = timeStart; i <= timeEnd; i += unitTime) {
                  if(result[0]) {
                    result[0].data.push({
                      value: parseInt(Math.random() * 100),
                      time: timeData(i).time,
                      timestamp: i
                    })
                  }
                }
              }
            }

            function timeData(label) {
              var date = new Date(label)
              var time;
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDate();
              var hour = date.getHours();
              var min = date.getMinutes();
              time = year + "/" + month + "/" + day + " " + hour + ":" + min;
              timestamp = Date.parse(new Date(time));
              return {
                time: time,
                timestamp: date.getTime()
              };
            }
            return result;
          }
        }

        function saveData(data, callback) {
          kpi.saveData(data, callback);
        }

        function updateView(viewId, data, callback) {
          kpi.updateView(viewId, data, callback);
        }

        function error(data) {

        }
        return factory;
      }
    ]);
  }
);