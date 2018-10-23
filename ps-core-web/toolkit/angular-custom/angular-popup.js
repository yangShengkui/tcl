(function(window, angular, undefined) {
  'use strict';
  var runFun = function() {
    var fun;
    var params = [];
    for(var i in arguments) {
      if(i == 0) {
        fun = arguments[i]
      } else {
        params.push(arguments[i])
      }
    }
    if(typeof fun == 'function') {
      fun.apply(window, params);
    }
  };
  var setAttr = function(target, attr, value) {
    for(var i in target) {
      target[i].$attr(attr, value);
    }
  };
  var objToValue = function(data) {
    for(var i in data) {
      data[i] = data[i].value;
    }
    return data;
  };
  var objectToArray = function(data, addName) {
    var rs = [];
    for(var i in data) {
      (function(attr, elem) {
        var find = addName ? (addName.indexOf(attr) == -1) : true;
        if(find) {
          var insert = elem.$clone();
          insert.$name = attr;
          rs.push(insert);
        }
      })(i, data[i]);
    }
    return rs;
  };
  var objectToArrayObj = function(data, addName) {
    var rs = [];
    for(var i in data) {
      (function(attr, elem) {
        rs.push(traverse(attr, elem));
      })(i, data[i]);
    }

    function traverse(attr, data) {
      var clone = data ? data.$clone() : {};
      var find = addName ? (addName.indexOf(attr) == -1) : true;
      if(angular.isArray(data)) {
        var rs = {
          $name: attr,
          folder: (function() {
            var arr = [];
            for(var i in data) {
              arr.push(traverse(attr, data[i]));
            }
            return arr;
          })()
        };
        return rs;
      } else {
        clone.$name = attr;
        if(find) {
          return clone;
        }
      }
    }
    return rs;
  }
  var arrayToObject = function(array) {
    var rs = {}
    for(var i in array) {
      (function(index, elem) {
        rs[elem.$name] = elem;
        delete rs[elem.$name].$name
      })(i, array[i].$clone());
    }
    return rs;
  };
  var getHtml = function(element) {
    return $("<div></div>").append(element).html();
  };
  var angularPopupDirective = ["$timeout", "popup", "angular-style", "keySet", 'growl', '$rootScope', function(timeout, popup, angularStyle, keySet, growl, rootScope) {
    return {
      restrict: "A",
      priority: 600,
      templateUrl: "../partials/popup.html",
      link: function(scope, element, attr) {
        function panelopen() {
          scope.show = true;
          runFun(popup['onPanelOpen'])
        }

        function panelCancel() {
          scope.show = false;
          runFun(popup['onPanelClose'])
        }

        function panelSubmit() {
          scope.show = false;
          popup.checkDataValiad(function(info) {
            if(info == "success") {
              runFun(popup['onPanelSubmit'], {
                index: popup.getIndex(),
                parameters: popup.getParameters(),
                style: popup.getStyle(),
                echart: popup.getEchart(),
                data: popup.getSource(),
                advance: popup.getAdvance()
              });
            } else {
              growl.error(info);
            }
          });
        }
        scope.show = false;
        scope.$panelCancel = panelCancel;
        scope.$panelSubmit = panelSubmit;
        scope.selectedView = {
          items: [],
          item: null,
        }
        scope.initViewItems = function() {
          if (scope.selectedView.items.length > 0) return;
          var ad = popup.getAdvance();
          if (ad.data.condition)
            scope.selectedView.items = JSONparse(ad.data.condition);
          else 
            scope.selectedView.items = [];
        }
        scope.saveViewItems = function() {
          scope.selectedView.items.sort(function(a, b) {
            return parseInt(a.index) - parseInt(b.index);
          });
          var tabs = [];
          scope.selectedView.items.forEach(function(view) {
            tabs.push({
              id: view.index,
              index: view.index,
              label: view.label,
              name: view.label,
              viewTitle: view.viewTitle,
              default: view.viewTitle,
              viewId: view.viewId,
              show: view.show
            })
          })
          var advance = popup.content[popup.content.length-1];
          advance.content.condition = tabs;
          advance.list.forEach(function(attrItem) {
            if (attrItem.$name == "condition") {
              attrItem.value = tabs;
            }
          });
        }

        scope.addViewItem = function() {
          if(scope.selectedView.item) {
            var find = scope.selectedView.items.filter(function(item) {
              if(item.viewId == scope.selectedView.item.viewId) return true
            })
            if(find.length == 0) {
              var addItem = jQuery.extend({}, scope.selectedView.item, true);
              addItem.index = scope.selectedView.items.length;
              scope.selectedView.items.push(addItem)
            }
          }
        }
        scope.deleteViewItem = function(delId) {
          for(var i = scope.selectedView.items.length - 1; i > -1; i--) {
            if(scope.selectedView.items[i].viewId == delId) {
              scope.selectedView.items.splice(i, 1);
              break;
            }
          }
        }

        popup.open = panelopen;
        keySet.onCommandKeyWith('enter', function() {
          panelSubmit();
        });
        scope.popup = popup;
      }
    }
  }];
  var exampleDirective = ["$timeout", function(timeout) {
    return {
      scope: {
        "template": "=",
        "element": "="
      },
      restrict: "A",
      link: function(scope, element, attr) {
        timeout(domReady);
        scope.$root.$$childHead.initViewItems();
        function domReady() {
          var label = scope.template.label ? $("<div>" + scope.template.label + "</div>") : null;
          var wrap = $($("<table style='width:100%;height:100%;'><tr><td style='vertical-align: middle;'></td></tr></table>"));
          var dom = $(scope.element);
          dom.removeAttr("css");
          var renderCss = function(style) {
            dom.css(style);
            dom.css("height", "50px");
          };
          var renderText = function(style) {
            dom.text("文字样例");
            dom.css(style);
          };
          var renderImage = function(url) {
            dom.css({
              "background-size": "contain",
              "background-position": "center",
              "background-repeat": "none",
              "width": "100%",
              "height": "100%",
              "background-image": "url(" + url + ")"
            });
          };
          wrap.css({
            width: "100%",
            height: "80px",
            position: "relative",
            overflow: "hidden"
          });
          if(scope.template.type == 'css') {
            renderCss(scope.template['style']);
          } else if(scope.template.type == 'image') {
            renderImage(scope.template['url']);
          } else if(scope.template.type == 'text') {
            renderText(scope.template['style']);
          }
          wrap.find('td').append(dom);
          if(label != null) {
            element.append(label);
          }
          element.append(wrap);
        }
      }
    }
  }];
  var autocompleteDirective = ["$timeout", function(timeout) {
    return {
      scope: {
        ngModel: "=",
        "source": "=",
      },
      restrict: "A",
      link: function(scope, element, attr) {
        var inputBox = $("<input class='form-control'/>");
        timeout(domReady);

        function domReady() {
          element.append(inputBox);
          inputBox.autocomplete({
            select: function(event, ui) {
              scope.$apply(function() {
                var name = ui.item.value;
                var find = scope.source.find(function(elem) {
                  return elem.label == name.split("(")[0];
                });
                scope.ngModel = find.$name;
              });
            }
          });
          scope.$watch("ngModel", function(n, o, s) {
            if(n == undefined) {
              inputBox.val("");
            }
          });
          scope.$watch("source", function(n, o, s) {
            if(n) {
              var sourceFn = function(request, responce) {
                var input = request.term;
                var src = n.map(function(element) {
                  return element.label + "(" + element.$name + ")";
                }).filter(function(element) {
                  return input == "___ALL___" ? true : element.indexOf(input) != -1;
                });
                responce(src)
              };
              inputBox.autocomplete("option", "source", sourceFn)
            }
          });
          inputBox.on("click", function(event) {
            var key = $(this).val() != "" ? $(this).val() : "___ALL___";
            inputBox.autocomplete("search", key);
          })
        }
      }
    }
  }];
  var angularPopupProvider = function() {
    var self = this;
    this.$get = ["angular-style", "kqiManagerUIService", "serviceCenterService", "dictionaryService", "resourceUIService", "dialogue", "configUIService", "$timeout", "keySet", "growl", function(angularStyle, kqiManagerUIService, serviceCenterService, dictionaryService, resourceUIService, dialogue, configUIService, timeout, keySet, growl) {
      var rs = {},
        rootModel;
      var dirty = false;
      var originalSource = {};
      var originalEchart = {};
      var originalParameter = {};
      var originalStyle = {};
      var originalAdvance = {};
      self['style'] = angularStyle.getStyle();
      self['echart'] = angularStyle.getEchart();
      self['parameters'] = angularStyle.getParameters();
      self['source'] = angularStyle.getSource();
      self['advance'] = angularStyle.getAdvance();
      //self['getChanged'] = angularStyle.getChanged();
      function on(event, callback) {
        rs[event] = callback;
      }

      function combination(all) {
        return {
          getUsed: function(input) {
            var clone = input.$clone();
            if(typeof all == 'object' && all != null) {
              for(var i in clone) {
                (function(attr, val) {
                  if(all.hasOwnProperty(attr)) {
                    if(typeof all[attr] == "object" && all[attr] != null) {
                      clone[attr] = all[attr];
                      clone[attr].value = val;
                    }
                  } else {
                    delete clone[attr];
                  }
                })(i, clone[i])
              }
            }
            return clone;
          },
          getUsedAll: function(input) {
            var clone;
            if(typeof all == 'object' && all != null) {
              clone = all.$clone();
              var traverse = function(attr, val) {
                for(var i in val) {
                  (function(at, v) {
                    var attribute = attr ? attr + "/" + at : at;
                    if(typeof v == "object" && at != 'data' && !(v instanceof Array)) {
                      traverse(attribute, v);
                    } else {
                      if(typeof clone[attribute] == 'object') {
                        clone[attribute].value = v;
                      }
                    }
                  })(i, val[i]);
                }
              };
              traverse(undefined, input);
            }
            return clone;
          },
          getNoused: function(input) {
            var clone;
            if(typeof all == 'object' && all != null) {
              clone = all.$clone();
              for(var i in input) {
                (function(attr, val) {
                  delete clone[attr];
                })(i, input[i])
              }
            }
            return clone;
          },
          getAll: function() {
            return all.$clone();
          },
          getcss: function(attr) {
            return all[attr];
          }
        }
      }

      function setContent(data, element, index, title, url, type) {
        rs.domHtml = getHtml(element);

        function hideall(array) {
          for(var i in array) {
            array[i].show = false;
          }
        };
        keySet.onCommandKeyWith('e', function(event) {
          var find = rs.content.find(function(elem) {
            return elem.$name == "advance";
          });
          if(find) {
            self['index'] = rs.content.indexOf(find);
            console.log(find.list);
            var fd = find.list.find(function(elem) {
              return elem.$name == "expression";
            });
            rs.selected = find;
            timeout(function() {
              fd.open();
            });
          };
        });
        rs.content = data.map(function(element) {
          var clone = element.$clone();
          clone.click = function() {
            self['index'] = rs.content.indexOf(this);
            rs.selected = clone;
          };
          if(element.$name == 'style') {
            style(clone);
          } else if(element.$name == 'parameters') {
            parameters(clone);
          } else if(element.$name == 'template') {
            template();
          } else if(element.$name == 'echart') {
            echart(clone);
          } else if(element.$name == 'source') {
            source(clone);
          } else if(element.$name == 'advance') {
            advance(clone);
          }

          function source(clone, bool) {
            if(bool != false) {
              originalSource = clone.content.$clone();
              originalSource.resource = originalSource.resource || [];
              originalSource.kpi = originalSource.kpi || [];
            };
            clone.preview = {};
            var combo = self[clone.$name];
            for(var i in clone.content) {
              (function(attr) {
                if(combo[attr]) {
                  var val = clone.content[attr];
                  clone.content[attr] = combo[attr];
                  clone.content[attr].value = val;
                }
              })(i);
            };
            serviceCenterService.rootDomain.get().then(getRootCi);

            function getRootCi(rootCi) {
              var success = function(models) {
                var getKpiByModelId = function(data) {
                  var kpiMap = function(elem) {
                    return elem;
                  };
                  var rs = [];
                  clone.kpis = data.map(kpiMap);
                  var loop = function(inx, kpis) {
                    if(typeof kpis[inx] != "object") {
                      var find = clone.kpis.find(function(elem) {
                        return elem.id == kpis[inx];
                      })
                      if(find) {
                        rs.push(find)
                      }
                    } else {
                      rs.push(kpis[inx]);
                    }
                  }
                  for(var i in clone.content.kpi) {
                    loop(i, clone.content.kpi)
                  }
                  clone.content.kpi = rs;
                };
                var getResourceByModelId = function(data) {
                  var resourceMap = function(elem) {
                    return elem;
                  };
                  var rs = [];
                  clone.resources = data.map(resourceMap);
                  var loop = function(inx, resources) {
                    if(typeof resources[inx] != "object") {
                      var find = clone.resources.find(function(elem) {
                        return elem.id == resources[inx];
                      })
                      if(find) {
                        rs.push(find)
                      }
                    } else {
                      rs.push(resources[inx]);
                    }
                  }
                  for(var i in clone.content.resource) {
                    loop(i, clone.content.resource)
                  }
                  clone.content.resource = rs;
                };
                var modelMap = function(element) {
                  clone.content.modelTypeOnChange = function(id) {
                    if(id != 0) {
                      resourceUIService.getDataItemsByModelId(id, function(event) {
                        if(event.code == 0) {
                          getKpiByModelId(event.data);
                        }
                      });
                      serviceCenterService.kpis.getBymodelId(id).then(getKpiByModelId);
                      if(window["model_" + id]) {
                        getResourceByModelId(window["model_" + id]);
                      } else {
                        resourceUIService.getResourceByModelId([id], function(event) {
                          if(event.code == 0) {
                            window["model_" + id] = event.data;
                            getResourceByModelId(event.data);
                          }
                        });
                      };
                      /** serviceCenterService.resources.getBymodelId(this.id).then(getResourceByModelId); */
                      clone.content.resource = [];
                      clone.content.kpi = [];
                    } else {
                      clone.content.model = clone.models[0];
                      clone.content.model.onChange();
                    }
                  };
                  clone.modelTypes = [{
                      id: 0,
                      label: "模版"
                    }, {
                      id: 300,
                      label: "管理域"
                    }, {
                      id: 301,
                      label: "客户"
                    }, {
                      id: 302,
                      label: "项目"
                    }
                    // ,{
                    //   id : 303,
                    //   label : "企业"
                    // }
                  ];
                  clone.resfilltypes = [{
                    id: "manual",
                    label: "指定"
                  }, {
                    id: "parameter",
                    label: "传递参数"
                  }];
                  clone.aggregate_rules = [{
                    id: 0,
                    label: "取区间末位"
                  }, {
                    id: 1,
                    label: "取区间首位"
                  }, {
                    id: 2,
                    label: "取区平均值"
                  }];
                  element.onChange = function() {
                    resourceUIService.getDataItemsByModelId(this.id, function(event) {
                      if(event.code == 0) {
                        getKpiByModelId(event.data);
                      }
                    });
                    serviceCenterService.kpis.getBymodelId(this.id).then(getKpiByModelId);
                    var cur = this;
                    if(window["model_" + cur.id]) {
                      getResourceByModelId(window["model_" + cur.id]);
                    } else {
                      resourceUIService.getResourceByModelId([this.id], function(event) {
                        if(event.code == 0) {
                          window["model_" + cur.id] = event.data;
                          getResourceByModelId(event.data);
                        }
                      });
                    };
                    /** serviceCenterService.resources.getBymodelId(this.id).then(getResourceByModelId); */
                    clone.content.resource = [];
                    clone.content.kpi = [];
                  };
                  return element;
                };
                var init = function(id) {
                  var getAggregate_period_back = function(data) {
                    var a = [{
                      label: "无",
                      valueCode: null
                    }];
                    clone.granularityUnits = a.concat(data);

                  };
                  var getAggregate_type_back = function(data) {
                    //console.log(data);
                    clone.aggregate_types = data;
                  };
                  var getAggregate_instance_back = function(data) {
                    clone.aggregate_instances = data;
                  };
                  resourceUIService.getDataItemsByModelId(id, function(event) {
                    if(event.code == 0) {
                      getKpiByModelId(event.data);
                    }
                  });
                  resourceUIService.getResourceByModelId(id, function(event) {
                    if(event.code == 0) {
                      getResourceByModelId(event.data);
                    }
                  });
                  //serviceCenterService.resources.getBymodelId(id).then(getResourceByModelId);
                  dictionaryService.getDictValues("KqiGranularityUnit", function(event) {
                    if(event.code == 0) {
                      getAggregate_period_back(event.data.filter(function(elem) {
                        return elem.label == "月" || elem.label == "季度" || elem.label == "年";
                      }));
                    }
                  });
                  dictionaryService.getDictValues("aggregateType", function(event) {
                    if(event.code == 0) {
                      getAggregate_type_back(event.data);
                    }
                  });
                  getAggregate_instance_back([{
                    'label': '不使用',
                    'id': 0
                  }, {
                    'label': '行业',
                    'id': 1
                  }, {
                    'label': '区域',
                    'id': 2
                  }, {
                    'label': '能源',
                    'id': 3
                  }, {
                    'label': '行业简称',
                    'id': 4
                  }]);
                };
                clone.models = (models).map(modelMap);
                clone.content.model = clone.models.find(function(elem) {
                  if(clone.content.model) {
                    return elem.id == clone.content.model.id;
                  } else {
                    return false;
                  }
                });
                var getKqiModels = function(data) {
                  clone.kqiModels = data;
                  clone.content.kqiModel = clone.kqiModels.find(function(elem) {
                    if(clone.content.kqiModel) {
                      return elem.id == clone.content.kqiModel.id;
                    } else {
                      return false;
                    }
                  });
                }
                kqiManagerUIService.getKqiModels(function(event) {
                  if(event.code == 0) {
                    getKqiModels(event.data);
                  }
                })
                if(clone.content.modelType == 0) {
                  if(clone.content.model) {
                    init(clone.content.model.id);
                  } else {
                    clone.content.model = clone.models[0];
                  }
                } else {
                  var modelId = clone.content.modelType;
                  init(modelId);
                }

              };
              var getRootModel = function(event) {
                //rootModel = event.data[0];
                serviceCenterService.models.getAll().then(success)
              };
              resourceUIService.getModelByIds([rootCi.modelId], getRootModel)
            };
            clone.renderData = function() {
              for(var i in clone.content.bind) {
                if(clone.content.hasOwnProperty(i)) {
                  clone.content[i].value = clone.content.bind[i];
                }
              }
              clone.content.legend.render(clone.content.legend.value);
              clone.content.xAxis.render(clone.content.xAxis.value);
              clone.content.yAxis.render(clone.content.yAxis.value);
              clone.content.series.render(clone.content.series.value);
            };
          }

          function echart(clone, bool) {
            if(bool != false) {
              originalEchart = clone.content.$clone();
            };
            var getSelectStyle = function(name) {
              var rs = self[clone.$name].$attr(name);
              if(rs == undefined) {
                //console.log(name, self[clone.$name]);
              }
              return rs;
            };
            var getStyle = function(attr, data) {
              var combo, temp;
              var style = getSelectStyle(attr);
              if(style != undefined) {
                temp = getSelectStyle(attr)['content'];
                combo = combination(temp);
                return combo.getUsedAll(data);
              } else {
                return undefined;
              }
            };
            var getAllStyle = function(attr) {
              var combo, temp;
              temp = getSelectStyle(attr)['content'];
              combo = combination(temp);
              return combo.getAll();
            };
            var loop = function(attr, val) {
              var regroup = function(attr, data) {
                if(angular.isArray(data)) {
                  var result = [];
                  var loop = function(item) {
                    var style;
                    if(attr == "series" || attr == "visualMap") {
                      var style = getStyle(attr + "/options/" + item.type, item);
                    } else {
                      var style = getStyle(attr + "/options/" + attr, item);
                    }
                    if(style) {
                      result.push(style);
                    }
                  };
                  for(var i in data) {
                    loop(data[i])
                  }
                  return result;
                } else {
                  return getStyle(attr, data);
                }
              }
              clone.content[attr] = regroup(attr, val);
            };
            for(var i in clone.content) {
              loop(i, clone.content[i]);
            };
            clone.list = objectToArrayObj(clone.content, false);
            traverseByChild(clone.list, function(index, elem, parent) {
              var name = elem.$name;
              var style = getSelectStyle(name);
              if(style) {
                return createArr(style, elem, parent);
              }
            });

            function createArr(style, elem, parent) {
              var result = {},
                add;
              var click = function() {
                self['subIndex'] = clone.list.indexOf(this);
                clone.selected = result;
              };
              var deleteFn = function() {
                parent.$remove(function(index, element) {
                  return result == element;
                });
              };
              var select = function() {
                result.visible = !result.visible;
              };
              if(elem.$name == "series" || elem.$name == "visualMap") {
                add = function(type) {
                  var st = getAllStyle(result.$name + "/options/" + type, data[i]);
                  result.children.push(createArr(style, st, result.children));
                };
              } else {
                add = function() {
                  var st, type;
                  if(result.$name == 'series' || elem.$name == "visualMap") {
                    var lastElement = result.children[result.children.length - 1];
                    type = lastElement.children.find(function(elem) {
                      return elem.$name == "type"
                    }).value;
                  } else {
                    type = result.$name;
                  }
                  st = getAllStyle(result.$name + "/options/" + type, data[i]);
                  result.children.push(createArr(style, st, result.children));
                };
              }
              result = {
                add: add,
                click: click,
                delete: deleteFn,
                select: select,
                arraylike: elem.folder != undefined,
                $name: style.$name,
                label: style.label,
                visible: false,
              };
              if(elem.folder == undefined) {
                result.children = objectToArray(elem, ['$name']);
              } else {
                result.children = elem.folder;
              }
              return result;
            }

            function traverseByChild(data, callback) {
              traverse(data);

              function traverse(data) {
                for(var i in data) {
                  if(data[i].folder) {
                    traverse(data[i].folder)
                  }
                  data[i] = callback(i, data[i], data);
                }
              }
            }
            if(index) {
              if(index.length > 1) {
                var subInx = index[1];
                subInx = subInx > clone.list.length ? 0 : subInx;
              } else {
                subInx = 0;
              }
            } else {
              subInx = 0
            }
            clone.selected = clone.list[subInx];
          }

          function template() {
            if(clone.content) {
              clone.list = clone.content.map(function(elem) {
                var st = elem.style;
                var ec = elem.echart;
                var adv = elem.advance;
                var param = elem.parameters;
                delete elem.chosen;
                elem.choseTemplate = function() {
                  dirty = true;
                  for(var i in clone.content) {
                    delete clone.content[i].chosen
                  };
                  elem.chosen = true;
                  if(st) {
                    var styleGroup = rs.content.find(function(elem) {
                      return elem.$name == 'style';
                    });
                    styleGroup.content = st;
                    style(styleGroup, false);
                  }
                  if(ec) {
                    var echartGroup = rs.content.find(function(elem) {
                      return elem.$name == 'echart';
                    });
                    echartGroup.content = ec;
                    echart(echartGroup, false);
                  }
                  if(adv) {
                    var advGroup = rs.content.find(function(elem) {
                      return elem.$name == 'advance';
                    });
                    advGroup.content = adv;
                    advance(advGroup, false);
                  }
                  if(param) {
                    var paramGroup = rs.content.find(function(elem) {
                      return elem.$name == 'parameters';
                    });
                    paramGroup.content = param;
                    parameters(paramGroup, false);
                  }
                };
                return elem;
              });
            }
          }

          function parameters(clone, bool) {
            if(bool != false) {
              originalParameter = clone.content.$clone();
            }
            var getParameters = function(name) {
              var rs = self[clone.$name].$attr(name);
              return rs;
            };
            var combo = combination(self[clone.$name]);
            var renderSub = function(element) {
              element.change = function() {
                console.log("----change----!!");
                dirty = true;
              };
              var run = function() {
                var addEvent = function(elem) {
                  if(element.select == elem.value) {
                    element.selectItem = elem;
                  };
                  elem.click = function() {
                    console.log("----click----!!");
                    element.select = elem.value;
                    element.selectItem = elem;
                  };
                  elem.change = function() {
                    console.log("----change----!!");
                  };
                };
                if(element.options) {
                  for(var i in element.options) {
                    addEvent(element.options[i]);
                  }
                }
              };
              if(element.$name == "fileInput") {
                element.on = function(eventName, callback) {
                  if(!element.$EVENTS) {
                    element.$EVENTS = {};
                  }
                  element.$EVENTS[eventName] = callback;
                };
                element.trigger = function(eventName, data) {
                  element.$EVENTS[eventName](data);
                }
                element.on("imageFileUploaded", function(data) {
                  console.log("ddd", data);
                })
              }
              if(element.$name == "imgSrc") {
                configUIService.getConfigsByGroupName("dashboardImage", function(event) {
                  if(event.code == "0") {
                    Array.prototype.push.apply(element.options, event.data);
                    run();
                  }
                });
              } else {
                run();
              };
              return element;
            };
            clone.list = objectToArray(combo.getUsed(clone.content)).map(function(elem) {
              return renderSub(elem);
            });
            console.log("list", clone.list);
          }

          function style(clone, bool) {
            if(bool != false) {
              originalStyle = clone.content.$clone();
            }
            var combo = combination(self[clone.$name]);
            clone.addVal = function(name) {
              var item = clone.rest.find(function(el) {
                return el.$name == name
              });
              dirty = true;
              if(item) {
                var attr = item.$name;
                var value = item.value;
                rs.inputvalue = undefined;
                rs.inputname = undefined;
                var obj = arrayToObject(clone.list);
                obj[attr] = combo.getcss(attr);
                obj[attr].value = value;
                clone.content = objToValue(obj);
                renderlist();
              }
            };
            renderlist();

            function renderlist() {
              clone.format = {
                'label': function(elem) {
                  return elem.label;
                },
                'value': '$name'
              };
              clone.list = objectToArray(combo.getUsed(clone.content)).map(function(elem) {
                var name = elem.$name;
                elem.change = function() {
                  dirty = true;
                  console.log("----change-----");
                }
                elem.delete = function() {
                  var obj = arrayToObject(clone.list);
                  delete obj[name];
                  clone.content = objToValue(obj);
                  renderlist();
                };
                return elem;
              });
              if(typeof combo.getNoused == 'function') {
                clone.rest = objectToArray(combo.getNoused(clone.content));
              } else {
                clone.rest = [];
              }
            }
          };

          function advance(clone, bool) {
            if(bool != false) {
              originalAdvance = clone.content.$clone();
            }
            var combo = combination(self[clone.$name]);
            var renderSub = function(element) {
              var addEvent = function(elem) {
                if(element.select == elem.value) {
                  element.selectItem = elem;
                }
                elem.click = function() {
                  console.log("----click----!!");
                  element.select = elem.value;
                  element.selectItem = elem;
                }
                elem.change = function() {
                  console.log("change");
                }
              };
              if(element.options) {
                for(var i in element.options) {
                  addEvent(element.options[i]);
                }
              }
              element.change = function() {
                console.log("---change---");
              }
              return element;
            };
            
            clone.list = objectToArray(combo.getUsed(clone.content)).map(function(elem) {
              return renderSub(elem);
            });
          }
          return clone;
        });
        rs.selected = rs.content[index ? index[0] : 0];
        rs.toHelpDoc = function() {
          console.log("toHelpDoc", url);
          url = url || "../app-free-style/index.html#/help";
          window.open(url, "blank");
        };
        rs.label = title;
        rs.type = type;
      };

      function checkDataValiad(callback) {
        var source = arrayToObject(this.content).$attr('source/content');
        if(source) {
          $$.loadExternalJs(['toolkit/date-handler', 'toolkit/value-list-handler'], function(dateHandler, valueListHandler) {
            console.log("required!!")
            var getTime = function(time) {
              if(time) {
                switch(time.unit) {
                  case "second":
                    return time.value * 1000;
                    break;
                  case "minute":
                    return time.value * 60 * 1000;
                    break;
                  case "hour":
                    return time.value * 60 * 60 * 1000;
                    break;
                  case "day":
                    return time.value * 24 * 60 * 60 * 1000;
                    break;
                  case "month":
                    return time.value * 30 * 24 * 60 * 60 * 1000;
                    break;
                  default:
                    return time.value;
                    break;
                }
              } else {
                return 0;
              }
            };
            
            var frequency = source.frequency;
            var timespan = source.timespan;
            if(timespan) {
              var endTime = dateHandler.init();
              var startTime = dateHandler.init(endTime.getTimeStamp() - getTime(timespan));
              var vlh = valueListHandler.init();
              try {
                vlh.setTimeRange(startTime, endTime, frequency);
                callback("success");
              } catch(e) {
                callback(e.message)
              };
            } else {
              callback("success");
            }
          }, function(error) {
            console.log(error);
          });
        } else {
          callback("success");
        };
      };

      function getSource() {
        var source = arrayToObject(this.content).$attr('source/content');
        if(source) {
          source.legend = source.legend ? source.$attr("legend/value") : undefined;
          source.xAxis = source.xAxis ? source.$attr("xAxis/value") : undefined;
          source.series = source.series ? source.$attr("series/value") : undefined;
          source.kpi = source.kpi || [];
          source.resource = source.resource || [];
          var rs = {
            applied: source.applied,
            dataToX: source.dataToX,
            text: source.text,
            model: source.model,
            kpi: source.kpi,
            modelType: source.modelType,
            resfilltype: source.resfilltype,
            resource: source.resource,
            kqiModel: source.kqiModel,
            timespan: source.timespan,
            format: source.format,
            multipleCi: source.multipleCi,
            multipleKpi: source.multipleKpi,
            frequency: source.frequency,
            aggregate_type: source.aggregate_type,
            granularityUnit: source.granularityUnit,
            aggregate_instance: source.aggregate_instance,
            aggregate_rule: source.aggregate_rule,
            autoFillBlank: source.autoFillBlank,
            condition: source.condition,
            legend: source.legend,
            xAxis: source.xAxis,
            xAxisType: source.xAxisType ? source.xAxisType : undefined,
            yAxis: source.yAxis ? source.yAxis : undefined,
            yAxisType: source.yAxisType ? source.yAxisType : undefined,
            series: source.series
          };
          for(var i in rs) {
            if(rs[i] == undefined) {
              delete rs[i];
            }
          };
          return {
            isDiff: JSON.stringify(source) != JSON.stringify(originalSource),
            data: rs
          }
        } else {
          return {
            isDiff: false,
            data: null
          };
        }
      }

      function getStyle() {
        var style = objToValue(arrayToObject(arrayToObject(this.content).$attr('style/list')));
        return {
          isDiff: JSON.stringify(style) != JSON.stringify(originalStyle),
          data: style
        };
      };

      function getParameters() {
        var parameter = objToValue(arrayToObject(arrayToObject(this.content).$attr('parameters/list')));
        return {
          isDiff: JSON.stringify(parameter) != JSON.stringify(originalParameter),
          data: parameter
        };
      };

      function getAdvance() {
        var advance = objToValue(arrayToObject(arrayToObject(this.content).$attr('advance/list')));
        return {
          isDiff: JSON.stringify(advance) != JSON.stringify(originalAdvance),
          data: advance
        };
      };

      function getEchart() {
        var echartStyle = arrayToObject(this.content).$attr('echart/list');
        var treeToObject = function(data) {
          var rs = {};
          var echartStyle = self['echart'];
          traverseChild(rs, data);

          function traverseChild(target, data) {
            for(var i in data) {
              var name = data[i].$name;
              if(data[i].arraylike) {
                if(data[i].hasOwnProperty("children")) {
                  target[name] = [];
                  for(var j in data[i].children) {
                    (function(index, elem) {
                      var obj = {};
                      var styleVal, type;
                      if(name == 'series' || name == 'visualMap') {
                        var type = elem.children.find(function(elem) {
                          return elem.$name == 'type'
                        }).value;
                        styleVal = echartStyle[name]['options'][type];
                        target[name].push(obj);
                        series(obj, elem.children, styleVal);
                      } else {
                        type = name;
                        styleVal = echartStyle[name]['options'][type];
                        target[name].push(obj);
                        each(obj, elem.children, styleVal);
                      }
                    })(j, data[i].children[j]);
                  }
                }
              } else {
                if(data[i].hasOwnProperty("children")) {
                  var styleVal = echartStyle[name];
                  target[name] = {};
                  each(target[name], data[i].children, styleVal)
                }
              }
            }
          }

          function each(target, data, compare) {
            for(var i in data) {
              (function(index, elem) {
                var name = elem.$name;
                if(elem.value != compare['content'][name].value) {
                  target.$attr(name, elem.value);
                }
              })(i, data[i])
            }
          }

          function series(target, data, compare) {
            for(var i in data) {
              (function(index, elem) {
                var name = elem.$name;
                if(elem.value != compare['content'][name].value || name == "type") {
                  target.$attr(name, elem.value);
                }
              })(i, data[i])
            }
          }
          return rs;
        };
        var treeObj = treeToObject(echartStyle);
        return {
          isDiff: JSON.stringify(treeObj) != JSON.stringify(originalEchart),
          data: treeObj
        };
      };

      function getIndex() {
        return [self["index"] ? self["index"] : 0, self["subIndex"] ? self["subIndex"] : 0];
      };
      rs = {
        content: {},
        on: on,
        getIndex: getIndex,
        getStyle: getStyle,
        getEchart: getEchart,
        setContent: setContent,
        getParameters: getParameters,
        getSource: getSource,
        checkDataValiad: checkDataValiad,
        getAdvance: getAdvance,
        submitPanel: function(callback) {
          var cur = this;
          cur.checkDataValiad(function(info) {
            if(info == "success") {
              callback({
                index: cur.getIndex(),
                parameters: cur.getParameters(),
                style: cur.getStyle(),
                echart: cur.getEchart(),
                data: cur.getSource(),
                advance: cur.getAdvance()
              });
            } else {
              growl.error(info);
              callback(null);
            }
          });
        }
      };
      return rs;
    }];
  };
  angular.module("ngAngularPopup", [])
    .directive("example", exampleDirective)
    .directive("autocompletecustom", autocompleteDirective)
    .directive("popup", angularPopupDirective)
    .provider("popup", angularPopupProvider)
})(window, angular);