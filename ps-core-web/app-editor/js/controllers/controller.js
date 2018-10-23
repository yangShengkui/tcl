define(
  [
    "app",
    "dom",
    "codeMirrorEditor",
    "profile",
    "commonlib"
  ],
  function(app, dom, codeMirror, profile, commonlib) {
    app.controller("loginController", ["$scope", "$rootScope", "loginManagement", function(scope, rootScope, lm) {
      rootScope.loading = undefined;
      //http://123.56.150.95:48080/app/index_machine.html#/machine
      scope.loginList = [{
        "name": "18701650256",
        "password": "@WSX3edc"
      }, {
        "name": "15652797278",
        "password": "@WSX3edc"
      }, {
        "name": "zhaoyanping@proudsmart.com",
        "password": "@WSX3edc"
      }, {
        "name": "standard",
        "password": "abc123"
      }, {
        "name": "394160008@qq.com",
        "password": "@WSX3edc"
      }, {
        "name": "zhangjiang79@qq.com",
        "password": "1q2w3e4r"
      }, {
        "name": "adomain@test.com",
        "password": "1q2w3e4r"
      }, {
        "name": "1203538033@qq.com",
        "password": "lin664181"
      }, {
        "name": "18611560122",
        "password": "abc123"
      }];
      scope.sitem = scope.loginList[0];
      scope.login = function(item) {
        lm.login(item);
      }
    }]);
    app.controller("mainController", [
      "$scope", "$rootScope", "$window", "$timeout", "styleList", "timeformatList", "toolBarList", "optionType", "loginManagement", "dataManagement", "userInfo", "units", "viewFlexService", "solutionUIService", "$window", "resourceUIService",
      function(scope, rootScope, window, timeout, styleList, timeformatList, toolBarList, optionType, lm, dm, userInfo, units, viewFlexService, solutionUIService, window, resourceUIService) {
        var currentTarget;
        var viewId;
        var themeChangesUnbind;
        var optionChangesUnbind;
        var codesourceChangesUnbind;
        rootScope.loading = false;
        scope.callbackmsg = "获取资源列表";
        scope.toolbarDetail = '';
        scope.modelShow = '';
        scope.mainTitle = '';
        scope.subTitle = '';
        scope.oldNodeId = undefined;
        scope.oldUnit = undefined;
        scope.selectData = [];
        scope.chartTab = "MAIN";
        scope.callbackmsg = false;
        scope.dirty = false;
        scope.select = false;
        scope.psetting = false;
        scope.newopen = false;
        scope.codeView = false;
        scope.errorMsg = errorMsg;
        scope.toolBarList = toolBarList;
        scope.optionEdit = optionType;
        scope.subList = optionType[0].sub;
        scope.content = optionType[0].sub[0].content;
        scope.timeformat = timeformatList[0];
        scope.timeformatList = timeformatList;
        scope.styleList = styleList;
        scope.settingClick = settingClick;
        scope.submitDataChange = submitDataChange;
        scope.cancelDataChange = cancelDataChange;
        scope.toolbarClick = toolbarClick;
        scope.chartPop_click = chartPop_click;
        scope.clickMainTitle = clickMainTitle;
        scope.clickSubTitle = clickSubTitle;
        scope.testClick = testClick;
        scope.subresourceClick = subresourceClick;
        scope.filterByType = filterByType;
        scope.back = back;
        scope.resourceClick = resourceClick;
        scope.modelClick = modelClick;
        scope.kpiClick = kpiClick;
        scope.kpiClickByModel = kpiClickByModel;
        scope.checkSelected = checkSelected;
        scope.applyChart = applyChart_btn_click;
        scope.selectNum = selectNum;
        scope.tabClick = tabClick;
        scope.newProfile = newProfile;
        scope.themeClick = themeClick;
        scope.returnBtnClick = returnBtnClick;
        scope.renderToolbarIcon = renderToolbarIcon;
        scope.renderToolbarIcon_class = renderToolbarIcon_class;
        scope.toolDetailClick = toolDetailClick;
        scope.docClick = docClick;
        scope.newfile = newfile;
        scope.openfile = openfile;
        scope.newFileclose = newFileclose;
        scope.openTo = openTo;
        scope.pageCloseBtn = pageCloseBtn;
        scope.psetting_close_click = psetting_close_click;
        scope.applyPage = applyPage;
        scope.previewClick = previewClick;
        scope.domPos = domPos;
        scope.previewClose = previewClose;
        scope.resourceClass = resourceClass;
        scope.substep = 0;
        scope.datasettingClick = datasettingClick;
        scope.checkTab = checkTab;
        scope.checkKpiTab = checkKpiTab;
        scope.kpiClassFun = kpiClassFun;
        scope.checkEnabled = checkEnabled;
        scope.refreshGraph = refreshGraph;
        scope.dropdownChange = dropdownChange;
        scope.modelKeyword = {};
        /* before 2016.3.15
         rootScope.$on("modelAndResourceComplete", modelAndResourseComplete_callback);
         */
        dm.getAllModels().then(function success(event) {
          modelAndResourseComplete_callback(event);
        }, function error(error) {
          console.log(error);
        });
        scope.$watch("msg", msgWatcher);
        scope.$watch("dataType", dataTypeWatcher);
        timeout(onDomReady);
        //dm.init();
        function checkTab(resources, dataType, oldNodeId) {
          if(typeof dataType == 'object' && dataType != null) {
            var res = oldNodeId ? 1 : 0;
            var nodeNum = res + (function(data) {
              var num = 0;
              for(var i in data) {
                if(data[i].checked) {
                  num++;
                }
              }
              return num;
            })(resources);
            if(dataType.limit) {
              if(dataType.limit.ci) {
                return nodeNum != dataType.limit.ci;
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        }

        function checkKpiTab(kpis, dataType) {
          if(typeof dataType == 'object' && dataType != null) {
            var kpiNum = (function(data) {
              var num = 0;
              for(var i in data) {
                if(data[i].checked) {
                  num++;
                }
              }
              return num;
            })(kpis);
            if(dataType.limit) {
              if(dataType.limit.kpi) {
                return kpiNum != dataType.limit.kpi;
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        }

        function dropdownChange(value) {
          scope.modelPanelData.children.each(function(model) {
            if(model.resources) {
              model.resources.each(function(element) {
                element.checked = false;
              });
            }
            model.kpis.each(function(element) {
              element.checked = false;
            });
          });
          scope.modelSelect = value;
          scope.oldUnit = undefined;
        }

        function refreshGraph() {
          var modelId, kpis, nodes;
          if(scope.solutionId) {
            modelId = scope.modelSelect.id;
            kpis = scope.modelSelect.kpis.getData().filter(function(element) {
              return element.checked;
            });
          } else {
            nodes = scope.modelSelect.resources.getData().filter(function(element) {
              return element.checked;
            });
            if(nodes.length > 0) {
              modelId = nodes[0].modelId;
            }
            kpis = scope.modelSelect.kpis.getData().filter(function(elem) {
              return elem.checked;
            });
          }
          var result = {
            formatStr: scope.timeformat.formatStr,
            format: scope.timeformat.value,
            category: scope.category,
            dataType: scope.dataType,
            modelId: modelId,
            timespan: parseInt(scope.timespan),
            _option_: JSON.parse(JSON.stringify(scope.baseOption)),
            data: {
              nodes: nodes,
              kpis: kpis
            }
          };
          if(nodes == undefined || nodes.length == 0) {
            delete result.data.nodes;
          }
          applyChart_run(result);
        }

        function checkEnabled(subres, dataType) {
          var kpi_compo, ci_compo, kpiSelected = 0,
            ciSelected = 0;
          if(dataType) {
            if(dataType.limit) {
              kpi_compo = dataType.limit.kpi;
              ci_compo = dataType.limit.ci;
            }
          }
          for(var i in scope.resources) {
            (function(resource) {
              for(var i in resource.kpis) {
                (function(kpi) {
                  if(kpi.checked) {
                    kpiSelected++;
                  }
                })(resource.kpis[i]);
              }
            })(scope.resources[i])
          };
          if(kpiSelected > 0) {
            ciSelected++;
          } else {
            return true;
          }
          for(var j in subres) {
            (function(res) {
              if(res.checked) {
                ciSelected++;
              }
            })(subres[j])
          }
          if(kpi_compo) {
            if(kpiSelected != kpi_compo) {
              return true;
            };
          }
          if(ci_compo) {
            if(ciSelected != ci_compo) {
              return true;
            }
          }
          return false;
        }

        function datasettingClick() {
          scope.substep = scope.substep == 0 ? 1 : 0;
        }

        function domPos(width, widthheightPortion) {
          console.log(width, widthheightPortion)
          return {
            width: width + "%",
            height: (1200 * width / 100) * widthheightPortion + "px"
          }
        }

        function dataTypeWatcher(newVal, oldVal, scope) {
          if(newVal) {
            var result = [];
            for(var i in newVal.category) {
              var name
              if(i == 'time') {
                name = '时间';
              } else if(i == 'ci') {
                name = '设备';
              } else {
                name = i;
              }
              result.push({
                name: name,
                value: i
              });
            }
            scope.timeCat = result;
          }
        }

        function resourceClass(res, resource) {
          var str = '';
          var id = res.id;
          if(scope.resourceSelect) {
            if(id == scope.resourceSelect.id) {
              str += "current "
            }
          }
          var find = (function(data) {
            for(var i in data) {
              if(data[i].checked) {
                return true;
              }
            }
            return false;
          })(res.kpis);
          if(find) {
            str += "active ";
          }
          return str;
        }

        function kpiClassFun(kpi, unit, kpis, dataType) {
          if(dataType != null) {
            if(dataType.limit) {
              var kpiMax = dataType.limit.kpi ? dataType.limit.kpi : Infinity;
            } else {
              var kpiMax = Infinity;
            }
          } else {
            var kpiMax = Infinity;
          }
          var kpiNum = (function(data) {
            var num = 0;
            for(var i in data) {
              if(data[i].checked) {
                num++;
              }
            }
            return num;
          })(kpis);
          if(kpi.checked) {
            return ""
          }
          if(kpiNum >= kpiMax) {
            return "disabled";
          }
          if((unit ? kpi.unit != unit : false)) {
            return "disabled";
          }
          return "";
        }

        function previewClick() {
          var result = [];
          var data = dom.saveData();
          for(var i in data.data) {
            var row = data.data[i].layout.row;
            var col = data.data[i].layout.col;
            if(!result[row]) {
              result[row] = {};
              result[row].children = [];
            }
            result[row].children[col] = data.data[i]
          }
          scope.domData = result;
          dom.disableScroll();
          dom.renderPreview(result);
        }

        function previewClose() {
          scope.domData = undefined;
          dom.enableScroll();
        }

        function resourceChanged_callback(target, event) {
          currentTarget = target;
          var mid = target.modelId;
          var resourceId = $(event.target).val();
          var findKpis = scope.modelSelect.kpis.getData().filter(function(element) {
            return element.checked;
          });
          var findNodes = scope.resources.filter(function(element) {
            return element.id == resourceId;
          });
          applyChart_run({
            formatStr: scope.timeformat.formatStr,
            format: scope.timeformat.value,
            category: scope.category,
            dataType: scope.dataType,
            modelId: mid,
            timespan: parseInt(scope.timespan),
            _option_: currentTarget.baseOption,
            data: {
              nodes: findNodes,
              kpis: findKpis
            }
          });
        }

        function onDomReady() {
          dom.fn(toolBarList);
          dom.on("optionUpdated", editBtnClick_callback);
          dom.on("resBtn_click", dataBtnClick_callback);
          dom.on("codeBtn_click", codeBtn_click_callback);
          dom.on("saveImage", saveImage_callback);
          dom.on("resourceChanged", resourceChanged_callback);
          profile.on("chartChanged", chartChanged_callback);
          profile.on("onError", onError_callback);
          scope.userInfo = userInfo.getUserInfo();

          function onError_callback(event) {
            scope.$apply(applied);

            function applied() {
              scope.msg = {
                title: event.errorMsg,
                content: event.error.message,
                btnlist: [{
                  text: "关闭",
                  fn: function() {
                    scope.msg = undefined;
                  }
                }]
              };
            }
          }

          function chartChanged_callback(event) {
            scope.dirty = true;
          }

          function saveImage_callback(target, config) {
            scope.$apply(applied);

            function applied() {
              scope.msg = {
                title: "是否保存此视图",
                content: "点击确认，则在新页面开启图片，之后请用右键另存为保存图片。点击取消，放弃保存。",
                btnlist: [{
                  text: "取消",
                  fn: cancelDataFn
                }, {
                  text: "保存",
                  fn: saveDataFn
                }]
              }

              function cancelDataFn() {
                scope.msg = undefined;
              }

              function saveDataFn() {
                scope.msg = undefined;
                timeout(timeoutFn, 1000);
                var saveOption = target.option.toolbox.feature.saveAsImage;
                var imgType = saveOption.type || 'png';
                if(imgType != 'png' && imgType != 'jpeg') {
                  imgType = 'png';
                }
                var image;
                if(!target.myChart.isConnected()) {
                  image = target.zr.toDataURL('image/' + imgType, target.option.backgroundColor && target.option.backgroundColor.replace(' ', '') === 'rgba(0,0,0,0)' ? '#fff' : target.option.backgroundColor);
                } else {
                  image = target.myChart.getConnectedDataURL(imgType);
                }
                dom.openImage(image);

                function timeoutFn() {
                  scope.callbackmsg = "视图保存成功";
                  timeout(timeoutFn, 1000);

                  function timeoutFn() {
                    scope.callbackmsg = "";
                  }
                }
              }
            }
          }

          function dataBtnClick_callback(event) {
            scope.$apply(applyFinished);

            function applyFinished() {
              scope.option = undefined;
              var timespan = event.timespan;
              var stepToStr;
              var nodes = event.nodes;
              var kpis = event.kpis;
              var modelId = event.modelId;
              var result = [];
              stepToStr = "MODEL";
              scope.baseOption = event.baseOption;
              scope.type = event.type;
              scope.theme = event.theme;
              scope.step = "";
              scope.substep = 0;
              scope.timespan = timespan ? timespan : 360;
              scope.category = event.category;
              scope.dataType = event.dataType;
              scope.step = stepToStr;
              scope.oldNodeId = nodes ? nodes[0] : undefined;
              scope.oldUnit = undefined;
              if(scope.solutionId) {
                if(scope.smodelId != 0) {
                  scope.modelSelect = {
                    id: scope.smodelId
                  };
                  resourceUIService.getKpisByModelId(scope.smodelId, function(event) {
                    if(event.code == '0') {
                      scope.modelSelect.kpis = new commonlib.ArrayHandler(event.data);
                      scope.modelSelect.kpis.each(function(element) {
                        var find;
                        if(kpis instanceof Array) {
                          find = kpis.some(function(elem) {
                            return elem == element.id
                          });
                        }
                        if(find) {
                          element.checked = true;
                        } else {
                          element.checked = false;
                        }
                      });
                    }
                  });
                } else if(scope.groupId != 0) {
                  scope.modelSelect = {
                    id: scope.groupId
                  };
                  resourceUIService.getKpisByModelId(scope.groupId, function(event) {
                    if(event.code == '0') {
                      scope.modelSelect.kpis = new commonlib.ArrayHandler(event.data);
                      scope.modelSelect.kpis.each(function(element) {
                        var find = kpis.some(function(elem) {
                          return elem == element.id
                        });
                        if(find) {
                          element.checked = true;
                        } else {
                          element.checked = false;
                        }
                      });
                    }
                  });
                }
              } else if(nodes instanceof Array && nodes.length > 0) {
                scope.modelSelect = scope.modelPanelData.children.getData().find(function(element) {
                  return element.id == modelId;
                });
                scope.modelKeyword.setCurrentSelect(scope.modelSelect);
                scope.modelSelect = scope.modelSelect ? scope.modelSelect : scope.modelPanelData.children.first();
                scope.modelSelect.resources.each(function(element) {
                  element.checked = false;
                });
                scope.modelSelect.kpis.each(function(element) {
                  element.checked = false;
                });
                var findNodes = scope.modelSelect.resources.getData().filter(function(element) {
                  return nodes.indexOf(element.id) != -1;
                });
                var findKpis = scope.modelSelect.kpis.getData().filter(function(element) {
                  return kpis.indexOf(element.id) != -1;
                });
                console.log(findNodes, findKpis);
                for(var i in findNodes) {
                  findNodes[i].checked = true;
                }
                for(var j in findKpis) {
                  findKpis[j].checked = true;
                }
                /*
                for(var i in scope.modelSelect.kpis){
                	var nodeId = scope.resources[i].id;
                	if((modelId == scope.resources[i].modelId)&&(nodeId != nodes[0])){
                		var clone = JSON.parse(JSON.stringify(scope.resources[i]));
                		var find = (function(id, nodes){
                			for(var i in nodes){
                				if(id == nodes[i]){
                					return true;
                				}
                			}
                			return false;
                		})(scope.resources[i].id, nodes);
                		if(find){
                			clone.checked = true;
                		}
                		else
                		{
                			clone.checked = false;
                		}
                		result.push(clone);
                	}
                	if(nodeId == nodes[0]){
                		scope.resourceSelect = scope.resources[i];
                	}
                	for(var j in scope.resources[i].kpis){
                		if(nodeId == nodes[0]){
                			var find = (function(id, kpis){
                				for(var i in kpis){
                					if(id == kpis[i]){
                						return true;
                					}
                				}
                				return false;
                			})(scope.resources[i].kpis[j].id, kpis);
                			scope.resources[i].kpis[j].checked = find;
                			if(find)
                			{
                				scope.oldUnit = scope.resources[i].kpis[j].unit;
                			}

                		}
                		else
                		{
                			scope.resources[i].kpis[j].checked = false;
                		}
                	}
                }
                var find = (function(data){
                	for(var i in data){
                		for(var j in data[i].kpis){
                			if(data[i].kpis[j].checked){
                				return data[i];
                			}
                		}
                	}
                	return undefined;
                })(scope.resources);
                 */
                if(findKpis.length > 0) {
                  scope.oldUnit = scope.oldUnit ? scope.oldUnit : findKpis[0].unit;
                  //scope.oldNodeId = find.id;
                  /*
                  var result = [];
                  for(var i in scope.resources)
                  {
                  	if((scope.resources[i].modelId == find.modelId)&&(scope.resources[i].id != find.id)){
                  		result.push(JSON.parse(JSON.stringify(scope.resources[i])))
                  	}
                  }
                  scope.sub_resources = scope.sub_resources ? scope.sub_resources : result;
                  console.log(scope.sub_resources);
                  */
                } else {
                  scope.oldUnit = undefined;
                  /*
                  scope.oldNodeId = undefined;
                  scope.sub_resources = undefined;
                  */
                }
              } else if(modelId != undefined && modelId != null && modelId != "") {
                if(kpis instanceof Array && kpis.length > 0) {
                  var kpiId = kpis[0];
                  scope.oldUnit = kpis[0];
                } else {
                  delete scope.oldUnit;
                }
                scope.modelSelect = scope.modelPanelData.children.getData().find(function(element) {
                  return element.id == modelId;
                });
                scope.modelSelect.kpis.each(function(element) {
                  var find = kpis.some(function(ele) {
                    return ele == element.id;
                  });
                  if(find) {
                    element.checked = true;
                  } else {
                    element.checked = false;
                  }
                });
              } else {
                if(scope.solutionId) {
                  scope.modelSelect = undefined;
                  for(var i in scope.modelPanelData.children.getData()) {
                    (function(index, elem) {
                      elem.kpis.each(function(inner) {
                        inner.checked = false;
                      });
                    })(i, scope.modelPanelData.children.getData()[i]);
                  }
                } else {
                  scope.modelSelect = scope.modelPanelData.children.first();
                  if(scope.modelSelect.resources) {
                    scope.modelSelect.resources.each(function(element) {
                      element.checked = false;
                    });
                  }
                  scope.modelSelect.kpis.each(function(element) {
                    element.checked = false;
                  });
                }
              }
              scope.sub_resources = result.length > 0 ? result : undefined;
              applylistView();
              currentTarget = event.target;
              scope.type = event.type;
              scope.datasource = event.option;
            }
          }

          function editBtnClick_callback(event) {
            scope.$apply(applyFinished);

            function applyFinished() {
              if(themeChangesUnbind) {
                themeChangesUnbind();
              };
              if(optionChangesUnbind) {
                optionChangesUnbind();
              };
              currentTarget = event.target;
              scope.option = JSON.parse(JSON.stringify(event.option));
              scope.type = event.type;
              scope.theme = event.theme;
            }

            themeChangesUnbind = scope.$watch("theme", themeChanges, true);
            optionChangesUnbind = scope.$watch("option", optionChanges, true);
          }

          function codeBtn_click_callback(event) {
            scope.$apply(applyFinished);

            function applyFinished() {
              if(codesourceChangesUnbind) {
                codesourceChangesUnbind();
              }
              dom.disableScroll();
              scope.codeView = true;
              scope.theme = event.theme;
              currentTarget = event.target;
              scope.codeSource = JSON.parse(JSON.stringify(event.option));
              codeMirror.setValue(scope.codeSource);
            }
            codesourceChangesUnbind = scope.$watch("codeSource", codesourceChanges, true);
          }
        }

        function psetting_close_click() {
          scope.psetting = false;
        }

        function pageCloseBtn() {
          scope.psetting = false;
        }

        function settingClick() {
          dom.pagesetting();
          scope.psetting = true;
        }

        function applyPage() {
          scope.psetting = false;
          dom.applyPage();
        }

        function newfile() {
          lm.newProf();
        }

        function submitDataChange() {
          var value = JSON.parse(codeMirror.getValue());
          dom.enableScroll();
          scope.codeSource = value;
          scope.codeView = false;
        }

        function docClick() {
          scope.newopen = false;
        }

        function cancelDataChange() {
          dom.enableScroll();
          scope.codeView = false;
        }

        function openfile() {
          scope.newopen = false;
          scope.select = true;
        }

        function newFileclose() {
          scope.select = false;
        }

        function savefile() {
          var dataPass = dom.saveData();
          if(scope.solutionId) {
            dataPass.solutionId = scope.solutionId;
            dataPass.groupId = scope.groupId;
            dataPass.smodelId = scope.smodelId;
          }
          if(dataPass.errorMsg) {
            scope.msg = {
              title: "未绑定数据",
              content: "有视图未绑定数据",
              btnlist: [{
                text: "关闭",
                fn: cancelDataFn
              }]
            };

            function cancelDataFn() {
              scope.msg = "";
              dom.setFocus();
            }
          } else {
            var find = (function(data) {
              var title = data.title;
              for(var i in scope.allMyView) {
                if((title == scope.allMyView[i].viewTitle) && (viewId != scope.allMyView[i].viewId)) {
                  return true;
                }
              }
              return false;
            })(dataPass);
            if(find) {
              scope.msg = {
                title: "视图重名",
                content: "当前视图名称已被占用，请修改",
                btnlist: [{
                  text: "关闭",
                  fn: cancelDataFn
                }]
              };

              function cancelDataFn() {
                scope.msg = "";
                dom.setFocus();
              }
            } else {
              scope.saveloading = true;
              if(viewId == undefined) {
                dm.saveData(dataPass, saveData_callback);
              } else {
                dm.updateView(viewId, dataPass, updateView_callback);
              }

              function saveData_callback(event) {
                if(event.code == 0) {
                  timeout(function() {
                    scope.saveloading = false;
                    scope.callbackmsg = "数据保存成功";
                    scope.dirty = false;
                    timeout(function() {
                      scope.callbackmsg = undefined;
                    }, 1000);
                  }, 1000);
                  viewId = event.data.viewId;
                } else if(event.code == 10020) {
                  alert("需要用户登录才能使用");
                  window.location.href = event.data;
                } else {
                  timeout(timeoutFn, 1000);

                  function timeoutFn() {
                    scope.saveloading = false;
                    scope.callbackmsg = event.message;
                    timeout(timeoutFinished, 1000);

                    function timeoutFinished() {
                      scope.callbackmsg = undefined;
                    }
                  }
                }
              }

              function updateView_callback(event) {
                if(event.code == 0) {
                  viewId = event.data.viewId;
                  timeout(function() {
                    scope.saveloading = false;
                    scope.callbackmsg = "数据更新成功"
                    scope.dirty = false;
                    timeout(function() {
                      scope.callbackmsg = undefined;
                    }, 1000);
                  }, 1000);
                } else if(event.code == 10020) {
                  alert("需要用户登录才能使用");
                  window.location.href = event.data;
                } else {
                  timeout(function() {
                    scope.saveloading = false;
                    scope.callbackmsg = event.message;
                    timeout(function() {
                      scope.callbackmsg = undefined;
                    }, 1000);
                  }, 1000);
                }
              }
            }
          }
        }

        function saveSolution() {
          var dataPass = dom.saveData();
          var content = {
            title: "title",
            elements: dataPass.data
          };
          /*
          if(scope.solutionId)
          {
          	dataPass.solutionId = scope.solutionId;
          	dataPass.groupId = scope.groupId;
          	dataPass.smodelId = scope.smodelId;
          }
          */
          //var modelId = dataPass.data[0].modelId;
          solutionUIService.saveModelDashboardViewContent(scope.solutionId, scope.groupId, scope.smodelId, JSON.stringify(content), function(event) {
            console.log(event);
            window.location.href = "../app-ac/index.html#/myView";
          });
          console.log(dataPass);
        }

        function modelAndResourseComplete_callback(mrdata) {
          console.log("modelAndResourseComplete_callback", mrdata);
          scope.callbackmsg = undefined;
          scope.solutionId = mrdata.solutionId;
          scope.groupId = mrdata.groupId;
          scope.smodelId = mrdata.smodelId;
          scope.allMyView = mrdata.views;
          if(mrdata.viewId) {
            viewId = parseInt(mrdata.viewId);
            var findView = scope.allMyView.find(function(element) {
              return element.viewId == viewId;
            });
            if(findView) {
              findView.JSON = JSON.parse(findView.content);
              console.log(findView);
            }
          }

          if(scope.solutionId) {
            scope.savefile = saveSolution;
          } else {
            scope.savefile = savefile;
          }
          scope.modelPanelData = (function(data) {
            var result = {
                label: '企业',
                children: data
              }
              /* before 2016.3.15
               var result = [{id:'', label : '所有模型'}];
               for(var i in data){
               if(data[i].resources ? data[i].resources.length > 0 : false){
               result.push(data[i]);
               }
               }*/
            return result;
          })(mrdata.modelStructure.root);
          scope.resources = (function(data) {
            var result = [];
            mrdata.modelStructure.traverse.each(function(ms) {
              var modelId = ms.id;
              var modleLabel = ms.label;
              var kpis = ms.kpis;
              if(ms.resources) {
                ms.resources.each(function(resource) {
                  resource.modelId = modelId;
                  resource.modelLabel = modleLabel;
                  resource.kpis = JSON.parse(JSON.stringify(kpis.getData()));
                  result.push(resource);
                });
              }
            });
            /* before 2016.3.15
             for(var i in data){
             for(var j in data[i].resources){
             var clone = data[i].resources[j];
             clone.modelId = data[i].id;
             clone.modelLabel = data[i].label;
             clone.kpis = JSON.parse(JSON.stringify(data[i].kpis));
             result.push(data[i].resources[j]);
             }
             }
             }*/
            return result;
          })(mrdata.modelStructure);
          scope.modelShow = "";
          scope.timespan = (scope.modelShow ? ((scope.modelShow.timespan != undefined) ? scope.modelShow.timespan : 3600 * 24 * 30) : 3600 * 24 * 30) / 60 / 1000;
          var lb = [];
          var newProfLabel = (function(obj) {
            for(var i in obj) {
              var title = obj[i].viewTitle;
              var find = title.indexOf("新建运营分析视图");
              if(find != -1) {
                var appendix = title.split("新建运营分析视图")[1];
                var fd = appendix.indexOf("(");
                if(fd != -1) {
                  var inx = parseInt(appendix.split("(")[1].split(")")[0]);
                  lb.push(inx);
                } else {
                  lb.push(0)
                }
              }
            }
            lb = lb.sort();
            if(lb.length > 0) {
              return "新建运营分析视图(" + (lb[lb.length - 1] + 1) + ")";
            } else {
              return "新建运营分析视图";
            }
          })(scope.allMyView);
          if(scope.solutionId) {
            solutionUIService.getModelDashboardViewContent(scope.solutionId, scope.groupId, scope.smodelId, function(event) {
              console.log(event);
              var result = [];
              if(event.data != null) {
                var views = JSON.parse(event.data);
                console.log(views);
                for(var i in views.elements) {
                  var row = views.elements[i].layout ? views.elements[i].layout.row : (i + 1);
                  var col = views.elements[i].layout ? views.elements[i].layout.col : 1;
                  if(!result[row]) {
                    result[row] = {};
                    result[row].children = [];
                  }
                  result[row].children[col] = views.elements[i];
                }
                dom.renderGraphList(views.elements.title, result, function(target) {
                  console.log(target);
                  target.startloading();
                  var nodeslist;
                  var option = target.option;
                  var dataType = target.dataType;
                  var category = target.category;
                  var format = timeformatList.find(function(element) {
                    return element.formatStr == target.formatStr;
                  });
                  var timespan = target.timespan;
                  var modelId = scope.smodelId == 0 ? scope.groupId : scope.smodelId;
                  var model = scope.modelPanelData.children.find("id", modelId);
                  if(model == undefined) {
                    model = {
                      id: modelId
                    };
                    resourceUIService.getKpisByModelId(modelId, function(event) {
                      if(event.code == 0) {
                        console.log(event);
                      }
                    })
                  } else {
                    modelloaded();
                  }

                  function modelloaded() {
                    if(model.resources) {
                      nodeslist = model.resources.getData().filter(function(element) {
                        if(target.nodes instanceof Array) {
                          return target.nodes.indexOf(element.id) != -1;
                        } else {
                          return false;
                        }
                      });
                    }
                    var kpislist = model.kpis.getData().filter(function(element) {
                      if(target.kpis) {
                        return target.kpis.indexOf(element.id) != -1;
                      } else {
                        return false;
                      }
                    });
                    if(nodeslist) {
                      if(!nodeslist instanceof Array || nodeslist.length == 0) {
                        nodeslist = undefined;
                      }
                    }
                    dm.getOptionData(dataType, category, format ? format.value : 'hh:mm', option, nodeslist, kpislist, timespan * 60 * 1000, getOptionData_callback);

                    function getOptionData_callback(event, data) {
                      target.stoploading();
                      renderDataTarget(event.option, target, data);
                    }
                  }

                });
              } else {

              }
            })
          } else {
            if(mrdata.viewList != undefined) {
              var result = [];
              var data = mrdata.viewList;
              for(var k in mrdata.viewList) {
                console.log(mrdata.viewList[k]);
              }
              for(var i in data) {
                var row = data[i].layout ? data[i].layout.row : (i + 1);
                var col = data[i].layout ? data[i].layout.col : 1;
                if(!result[row]) {
                  result[row] = {};
                  result[row].children = [];
                }
                result[row].children[col] = data[i]
              }
              dom.renderGraphList(mrdata.viewTitle, result, function(target) {
                console.log(target);
                target.startloading();
                var option = target.option;
                var nodeslist = [];
                var dataType = target.dataType;
                var category = target.category;
                var format = timeformatList.find(function(element) {
                  return element.formatStr == target.formatStr;
                });
                var timespan = target.timespan;
                var modelId = target.modelId;
                var model = scope.modelPanelData.children.find("id", modelId);
                if(model == undefined) {
                  model = {
                    id: modelId
                  };
                  resourceUIService.getResourceByModelId(modelId, function(event) {
                    if(event.code == 0) {
                      resourceUIService.getKpisByModelId(modelId, function(event) {
                        if(event.code == 0) {
                          console.log(event);
                          model.kpis = new commonlib.ArrayHandler(event.data);
                          modelloaded();
                        }
                      })
                      console.log(event);
                      model.resources = new commonlib.ArrayHandler(event.data);
                    }
                  })
                } else {
                  modelloaded();
                }

                function modelloaded() {
                  if(model.resources) {
                    nodeslist = model.resources.getData().filter(function(element) {
                      if(target.nodes instanceof Array) {
                        return target.nodes.indexOf(element.id) != -1;
                      } else {
                        return false;
                      }
                    });
                  }
                  var kpislist = model.kpis.getData().filter(function(element) {
                    return target.kpis.indexOf(element.id) != -1;
                  });
                  if(nodeslist.length == 0) {
                    if(model.resources) {
                      var first = model.resources.first();
                      if(first) {
                        nodeslist = [model.resources.first()];
                      } else {
                        nodeslist = undefined;
                      }

                    } else {
                      nodeslist = undefined;
                    }
                  }
                  dm.getOptionData(dataType, category, format.value, option, nodeslist, kpislist, timespan * 60 * 1000, getOptionData_callback);

                  function getOptionData_callback(event, data) {
                    target.stoploading();
                    renderDataTarget(event.option, target, data);
                  }
                }
              });
              //add new
            } else {
              dom.addNewLabel(newProfLabel)
            };
          }

        }

        function themeClick(value) {
          if(value != "customer") {
            scope.theme = value;
          } else {
            //scope.theme = "default";
            scope.chartTab = "DETAIL";
          }
        }

        function returnBtnClick() {
          scope.chartTab = "MAIN";
        }

        function openTo(viewId) {
          lm.openProf(viewId);
          scope.select = false;
        }

        function newProfile() {
          //lm.newProf();
          scope.newopen = !scope.newopen;
        }

        function tabClick(value) {
          scope.substep = value;
        }

        function selectNum(model, substep) {
          var inx = 0;
          if(model) {
            if(substep == 0) {
              for(var i in model.resources) {
                if(model.resources[i].checked == true) {
                  inx++;
                }
              }
            } else if(substep == 1) {
              for(var i in model.kpis) {
                if(model.kpis[i].checked == true) {
                  inx++;
                }
              }
            }
          }
          return inx;
        }

        function msgWatcher(newVal, oldVal, scope) {
          if(newVal) {
            dom.disableBodyScroll();
          } else {
            dom.enableBodyScroll();
          }
        }

        function applylistView() {
          scope.selectData = [];
          var modelShow = scope.modelShow;
          for(var i in modelShow.resources) {
            for(var j in modelShow.kpis) {
              if(modelShow.resources[i].checked && modelShow.kpis[j].checked) {
                var name = modelShow.resources[i].label + "(" + modelShow.kpis[j].label + ")";
                if(name.length > 6) {
                  name = name.slice(0, 4) + "..."
                }
                var inx = 1;
                while(findSame(name)) {
                  var first = name.slice(-3, -2);
                  var end = name.slice(-1);
                  if((first == "(") && (end == ")")) {
                    var str = name.slice(0, -3);
                    str += "(" + inx + ")";
                    name = str;
                  } else {
                    name += "(" + inx + ")";
                  }
                  inx++;
                }

                function findSame(name) {
                  var find = (function(obj) {
                    for(var i in obj) {
                      if(obj[i].value == name) {
                        return true;
                      }
                    }
                    return false;
                  })(scope.selectData);
                  return find;
                }
                scope.selectData.push({
                  nodeId: modelShow.resources[i].id,
                  name: modelShow.kpis[j].name,
                  kpiId: modelShow.kpis[j].id,
                  value: name
                })
              }
            }
          }
          scope.mainTitle = scope.modelShow.label;
          switch(scope.type) {
            case "line":
              scope.subTitle = "线状视图";
              break;
            case "bar":
              scope.subTitle = "柱状视图";
              break;
            case "pie":
              scope.subTitle = "饼状视图";
              break;
            case "gauge":
              scope.subTitle = "告警视图";
              break;
          }
        }

        function applyChart_btn_click(resources) {
          var nodes = [];
          var kpis = [];
          var modelId;
          for(var i in resources) {
            var find = false;
            for(var j in resources[i].kpis) {
              if(resources[i].kpis[j].checked) {
                find = true;
                modelId = resources[i].modelId;
                kpis.push({
                  id: resources[i].kpis[j].id,
                  name: resources[i].kpis[j].name,
                  label: resources[i].kpis[j].label,
                  units: resources[i].kpis[j].unit,
                });
              }
            }
            if(find) {
              nodes.push({
                modelId: resources[i].modelId,
                id: resources[i].id,
                label: resources[i].label
              });
            }
          }
          for(var i in scope.sub_resources) {
            if(scope.sub_resources[i].checked) {
              nodes.push({
                modelId: scope.sub_resources[i].modelId,
                id: scope.sub_resources[i].id,
                label: scope.sub_resources[i].label
              });
            }
          }
          applyChart_run({
            formatStr: scope.timeformat.formatStr,
            format: scope.timeformat.value,
            category: scope.category,
            dataType: scope.dataType,
            modelId: modelId,
            timespan: parseInt(scope.timespan),
            _option_: JSON.parse(JSON.stringify(scope.baseOption)),
            data: {
              nodes: nodes,
              kpis: kpis
            }
          });
        }

        function applyChart_run(event) {
          var nodeslist = event.data.nodes;
          if(nodeslist) {
            if(!nodeslist instanceof Array || nodeslist.length == 0) {
              nodeslist = undefined;
            }
          }
          var kpislist = event.data.kpis;
          var formatStr = event.formatStr;
          var format = event.format;
          var category = event.category;
          var modelId = event.modelId;
          var timespan = event.timespan;
          var dataType = event.dataType;
          var option = event._option_;
          //var oldSeries = JSON.parse(JSON.stringify(scope.datasource.series[0]));
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
          var findresources = scope.resources.filter(function(elem) {
            return elem.modelId == modelId;
          });
          currentTarget.setNodeKpiList({
            formatStr: formatStr,
            category: category,
            modelId: modelId,
            nodes: nodes,
            kpis: kpis,
            resources: findresources,
            timespan: timespan
          });
          currentTarget.startloading();
          dm.getOptionData(dataType, category, format, option, nodeslist, kpislist, timespan * 60 * 1000, getOptionData_callback);

          function getOptionData_callback(event) {
            currentTarget.stoploading();
            renderDataChanges(event.option);
          }
        };

        function errorMsg(modelShow, dataType) {
          var ci;
          var kpi;
          var text1 = '';
          var text2 = '';
          if(dataType ? dataType.limit : false) {
            ci = dataType.limit.ci;
            kpi = dataType.limit.kpi;
          }
          modelnum = (function(obj) {
            var inx = 0;
            if(obj) {
              for(var i in obj.resources) {
                if(obj.resources[i].checked == true) {
                  inx++;
                }
              }
            }
            return inx;
          })(modelShow);
          kpinum = (function(obj) {
            var inx = 0
            if(obj) {
              for(var i in obj.kpis) {
                if(obj.kpis[i].checked == true) {
                  inx++;
                }
              }
            }
            return inx;
          })(modelShow);
          if(modelnum > 0) {
            if(ci) {
              text1 = ci == modelnum ? '' : ' [ 此视图需要' + ci + '个设备 ] '
            }
          } else {
            text1 = ' [ 设备不能为空 ] '
          }
          if(kpinum > 0) {
            if(ci) {
              text2 = ci == kpinum ? '' : ' [ 此视图需要' + ci + '个指标 ] '
            }
          } else {
            text2 = ' [ 指标不能为空 ] '
          }
          if(text1 != '' && text2 != '') {
            return text1 + "," + text2;
          } else if(text1 == '' && text2 != '') {
            return text2;
          } else if(text1 != '' && text2 == '') {
            return text1;
          } else {
            return '';
          }
        }

        function checkSelected(modelShow, dataType) {
          var ci;
          var kpi;
          if(dataType ? dataType.limit : false) {
            ci = dataType.limit.ci;
            kpi = dataType.limit.kpi;
          }
          modelnum = (function(obj) {
            var inx = 0;
            if(obj) {
              for(var i in obj.resources) {
                if(obj.resources[i].checked == true) {
                  inx++;
                }
              }
            }
            return inx;
          })(modelShow);
          kpinum = (function(obj) {
            var inx = 0
            if(obj) {
              for(var i in obj.kpis) {
                if(obj.kpis[i].checked == true) {
                  inx++;
                }
              }
            }
            return inx;
          })(modelShow);
          var ciok;
          var kpiok;
          if(ci) {
            if(modelnum == ci) {
              ciok = true;
            } else {
              ciok = false;
            }
          } else {
            ciok = true;
          }
          if(kpi) {
            if(kpinum == kpi) {
              kpiok = true;
            } else {
              kpiok = false;
            }
          } else {
            kpiok = true;
          }
          return !(ciok && kpiok && (modelnum > 0) && (kpinum > 0));
        }

        function kpiClick(kpi, onlyDifferentKpi, model) {
          if(onlyDifferentKpi == true) {
            if(scope.oldUnit ? scope.oldUnit == kpi.unit : true) {
              kpi.checked = !kpi.checked;
              scope.oldUnit = kpi.unit;
            } else {
              scope.callbackmsg = "请选择相同单位数据";
              timeout(function() {
                scope.callbackmsg = undefined;
              }, 1000);
            }
            var find = (function(data) {
              for(var i in data) {
                for(var j in data[i].kpis) {
                  if(data[i].kpis[j].checked) {
                    return data[i];
                  }
                }
              }
              return undefined;
            })(scope.resources);
            if(find) {
              scope.oldUnit = scope.oldUnit ? scope.oldUnit : kpi.unit;
              scope.oldNodeId = find.nodeId;
            } else {
              scope.oldUnit = undefined;
              scope.oldNodeId = undefined;
            }
            applylistView();
          } else {
            if(scope.oldUnit ? scope.oldUnit == kpi.unit : true) {
              kpi.checked = !kpi.checked;
              scope.oldUnit = kpi.unit;
            } else {
              scope.callbackmsg = "单位不同，原先选择将被重置。"
              scope.modelSelect.kpis.each(function(element) {
                if(kpi != element) {
                  element.checked = false;
                } else {
                  element.checked = true;
                  scope.oldUnit = element.unit;
                }
              });

              timeout(function() {
                scope.callbackmsg = undefined;
              }, 1000);
            }
            applylistView();
            nodes = scope.modelSelect.resources.getData().filter(function(elem) {
              return elem.checked;
            });
            var findChecked = scope.modelSelect.kpis.getData().filter(function(elem) {
              return elem.checked;
            });
            if(nodes.length > 0 && findChecked.length > 0) {
              applyChart_run({
                formatStr: scope.timeformat.formatStr,
                format: scope.timeformat.value,
                category: scope.category,
                dataType: scope.dataType,
                modelId: scope.modelSelect.id,
                timespan: parseInt(scope.timespan),
                _option_: JSON.parse(JSON.stringify(scope.baseOption)),
                data: {
                  nodes: nodes,
                  kpis: findChecked
                }
              });
            }
          }
        }

        function kpiClickByModel(kpi, onlyDifferentKpi, model) {
          if(onlyDifferentKpi == true) {
            if(scope.oldUnit ? scope.oldUnit == kpi.unit : true) {
              kpi.checked = !kpi.checked;
            } else {
              scope.callbackmsg = "请选择相同单位数据";
              timeout(function() {
                scope.callbackmsg = undefined;
              }, 1000);
            }
            var find = (function(data) {
              for(var i in data) {
                for(var j in data[i].kpis) {
                  if(data[i].kpis[j].checked) {
                    return data[i];
                  }
                }
              }
              return undefined;
            })(scope.resources);
            if(find) {
              scope.oldUnit = scope.oldUnit ? scope.oldUnit : kpi.unit;
              scope.oldNodeId = find.nodeId;
            } else {
              scope.oldUnit = undefined;
              scope.oldNodeId = undefined;
            }
            applylistView();
          } else {
            /*
             if(scope.oldUnit == undefined){
             scope.callbackmsg = "其它指标只能选择与此单位相同者"
             timeout(function(){
             scope.callbackmsg = undefined;
             },3000);
             }
             */
            if(scope.oldUnit ? scope.oldUnit == kpi.unit : true) {
              kpi.checked = !kpi.checked;
              scope.oldUnit = kpi.unit;
            } else {
              scope.oldUnit = kpi.unit;
              scope.callbackmsg = "单位不同，已勾选项将被清除。"
              timeout(function() {
                scope.callbackmsg = undefined;
              }, 1000);
              for(var i in scope.modelSelect.kpis.getData()) {
                (function(index, element) {
                  if(element.id == kpi.id) {
                    element.checked = true;
                    scope.oldUnit = kpi.unit;
                  } else {
                    element.checked = false;
                  }
                })(i, scope.modelSelect.kpis.getData()[i])
              }
            }
            applylistView();
          }
          var findChecked = scope.modelSelect.kpis.getData().filter(function(elem) {
            return elem.checked;
          });
          if(findChecked.length > 0) {
            applyChart_run({
              formatStr: scope.timeformat.formatStr,
              format: scope.timeformat.value,
              category: scope.category,
              dataType: scope.dataType,
              modelId: model.id,
              timespan: parseInt(scope.timespan),
              _option_: JSON.parse(JSON.stringify(scope.baseOption)),
              data: {
                kpis: findChecked
              }
            });
          }
        }
        /*
        function modelClick(model){
        	scope.modelShow = model == scope.modelShow ? "" : model;
        	scope.step = "NODE";
        }
        */
        function modelClick(model) {
          scope.modelSelect = model;
          var findKpis = scope.modelSelect.kpis.getData().filter(function(element) {
            return element.checked;
          });
          if(findKpis.length > 0) {
            applyChart_run({
              formatStr: scope.timeformat.formatStr,
              format: scope.timeformat.value,
              category: scope.category,
              dataType: scope.dataType,
              modelId: model.id,
              timespan: parseInt(scope.timespan),
              _option_: JSON.parse(JSON.stringify(scope.baseOption)),
              data: {
                kpis: findKpis
              }
            });
          }
        }

        function resourceClick(resource) {
          //scope.resourceSelect = resource;
          if(resource.checked) {
            resource.checked = false;
          } else {
            resource.checked = true;
          }
          var nodes = scope.modelSelect.resources.getData().filter(function(elem) {
            return elem.checked;
          });
          var findChecked = scope.modelSelect.kpis.getData().filter(function(elem) {
            return elem.checked;
          });
          if(nodes.length > 0 && findChecked.length > 0) {
            applyChart_run({
              formatStr: scope.timeformat.formatStr,
              format: scope.timeformat.value,
              category: scope.category,
              dataType: scope.dataType,
              modelId: scope.modelSelect.id,
              timespan: parseInt(scope.timespan),
              _option_: JSON.parse(JSON.stringify(scope.baseOption)),
              data: {
                nodes: nodes,
                kpis: findChecked
              }
            });
          }
          applylistView();
        }

        function subresourceClick(sub_res) {
          sub_res.checked = sub_res.checked ? !sub_res.checked : true;
        }

        function back() {
          if(scope.dirty) {
            var dataPass = dom.saveData();
            dom.disableScroll();
            scope.msg = {
              title: "当前视图尚未保存",
              content: "是否不保存，直接退出！",
              btnlist: [{
                text: "取消",
                fn: cancelDataFn
              }, {
                text: "保存退出",
                fn: saveDataFn
              }, {
                text: "直接退出",
                fn: function() {
                  if(scope.solutionId) {
                    window.location.href = "../app-ac/index.html#/myView";
                  } else {
                    lm.back();
                  }
                  scope.msg = '';
                }
              }]
            };

            function cancelDataFn() {
              scope.msg = undefined;
            };

            function saveDataFn() {
              scope.msg = {
                loading: "数据保存中请稍后"
              };
              timeout(timeoutFn, 1000);

              function timeoutFn() {
                if(scope.solutionId) {
                  saveSolution();
                } else if(viewId == undefined) {
                  dm.saveData(dataPass, saveData_callback);
                } else {
                  dm.updateView(viewId, dataPass, updateView_callback);
                }

                function saveData_callback(event) {
                  scope.msg = undefined;
                  lm.back()
                }

                function updateView_callback(event) {
                  scope.msg = undefined;
                  lm.back()
                }
              }
            }
          } else {
            if(scope.solutionId) {
              window.location.href = "../app-ac/index.html#/myView";
            } else {
              lm.back();
            }
          }
        }

        function filterByType(item) {
          if(scope.type) {
            return item.display.indexOf(scope.type) != -1
          } else {
            return true;
          }
        }

        function testClick() {
          scope.option.title.text = "asdasd";
        }

        function clickSubTitle(subtitle) {
          scope.subTitle = subtitle.id;
          scope.content = subtitle.content;
        }

        function clickMainTitle(mainTitle) {
          scope.mainTitle = mainTitle.id;
          scope.subList = mainTitle.sub;
          scope.subTitle = 0;
          scope.content = scope.subList[0].content;
        }

        function optionChanges(newVal, oldVal, scope) {
          if(currentTarget && newVal) {
            var tmp = JSON.parse(JSON.stringify(newVal));
            if(tmp.legend) {
              if(tmp.legend.show == 'false') {
                delete tmp.legend
              }
            }
            currentTarget.changeOption(tmp, scope.theme, true);
          }
        }

        function renderDataTarget(option, target, data) {
          if(option.legend) {
            if(option.legend.show == 'false') {
              delete option.legend
            }
          }
          target.changeOption(option, scope.theme, true, data);
        }

        function renderDataChanges(option) {

          if(option.legend) {
            if(option.legend.show == 'false') {
              delete option.legend
            }
          }
          currentTarget.changeOption(option, scope.theme, true);
        }

        function codesourceChanges(newVal, oldVal, scope) {
          if(currentTarget && newVal) {
            var tmp = JSON.parse(JSON.stringify(newVal));
            if(tmp.legend) {
              if(tmp.legend.show == 'false') {
                delete tmp.legend
              }
            }
            currentTarget.changeOption(tmp, scope.theme, true);
          }
        }

        function themeChanges(newVal, oldVal, scope) {
          if(currentTarget && newVal) {
            currentTarget.changeTheme(newVal, scope.option);
          }
        }

        function renderToolbarIcon(image) {
          var style = {};
          style["background-image"] = "url(images/icons/" + image + ".svg)";
          return style;
        }

        function renderToolbarIcon_class(image) {
          var style = {};
          style["background-image"] = "url(images/icons/" + image + ".svg)";
          return style;
        }

        function toolbarClick(toolbar) {
          scope.toolbarDetail = toolbar;
        }

        function chartPop_click() {
          scope.toolbarDetail = '';
        }

        function toolDetailClick(type, option, dataType) {
          dom.createChart(type, option, dataType);
          scope.toolbarDetail = '';
        }
      }
    ]);
    app.controller("prevController", ["$scope", "$rootScope", "$route", function(scope, rootScope, route) {
      var result = [];
      var data = JSON.parse(route.current.pathParams.viewData);
      for(var i in data.data) {
        var row = data.data[i].layout.row;
        var col = data.data[i].layout.col;
        if(!result[row]) {
          result[row] = {};
          result[row].children = [];
        }
        result[row].children[col] = data.data[i]
      }
      scope.domData = result;
      scope.calculatePos = calculatePos;

      function calculatePos(width, wh) {
        return({
          width: width + "%",
          height: "100px"
        });
      }
      console.log(result);
    }]);
  }
);