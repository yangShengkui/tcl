/**
 * Created by leonlin on 16/11/3.
 */
define([], function() {
  return function(data) {
    var elemData = data;
    if(elemData == undefined) {
      throw new Error("当前组态无法获得视图相关信息");
    }
    var self = elemData.element;
    var viewFlexService = elemData.viewFlexService;
    var userLoginUIService = elemData.userLoginUIService;
    var resourceUIService = elemData.resourceUIService;
    var serviceCenterService = elemData.serviceCenterService;
    var kpiDataService = elemData.kpiDataService;
    var element = elemData.element;
    var global = elemData.global;
    var SwSocket = elemData.SwSocket;
    var scope = elemData.scope;
    var q = elemData.q;
    var traverseRow = elemData.traverseRow;
    var traverseCol = elemData.traverseCol;
    var timeout = elemData.timeout;
    var route = elemData.route;
    var previewMode = elemData.previewMode;
    var viewId = self.viewId;
    var commonMethod = element.constructor;
    var json = element.JSON;
    var uuid = Math.uuid();
    var all_resources = [];
    var all_kpis = [];
    var parentheight, parentwidth;
    var max_height, max_width;
    var taDom;
    var svgId = "svg_" + uuid;
    var openAngles = {};
    var persentage = 0;
    var events = {};
    var expression;
    
    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        expression = fnResult;
      } else {
        console.log(funRes.message);
      }
    });
    //组件最外层的DIV，仪表板设置的CSS样式作用在这个层上
    var topo = $("<div></div>");
    topo.css("position", "relative");
    var displayModeLink = {
      "arrowheadMarkup": "<g></g>",
      "toolMarkup": "<g></g>",
      "vertexMarkup": "<g></g>"
    };
    if(typeof element.setSelfDom == "function") {
      element.setSelfDom(topo);
    }
    
    element.$on = function(eventName, callback) {
      events[eventName] = callback;
    };
    element.off("$loadCiKpiComplete");
    element.off("$renderGraphComplete");
    self.error = function(str) {
      topo.children().remove();
      var warning = $("<p>" + str + "</p>");
      warning.css({
        "font-size": "12px",
        "min-height": "300px",
        "text-align": "center",
        "line-height": "300px"
      });
      topo.append(warning);
    };
    self.setResources = function(resources) {
      self.composoryRes = resources;
      Object.defineProperty(self, "composoryRes", {
        enumerable: false
      });
    };
    function directive(cell){
      var context = {};
      var position = cell.position, div;
      var directiveIds = cell.directiveIds.map(function(e){
        return typeof e == "number" && e || parseInt(e.split("number:")[1]);
      });
      var modelId = cell.modelId && cell.modelId.split("number:")[1];
      var nodeId = cell.modelId && cell.nodeId.split("number:")[1];
      if (modelId) {
        var getDirectivesByModelId = function () {
          return new Promise(function (resolve) {
            resourceUIService.getDirectivesByModelId(modelId, function (d) {
              resolve(d.data);
            });
          });
        };
        var getKpisByModelId = function () {
          return new Promise(function (resolve) {
            resourceUIService.getKpisByModelId(modelId, function (d) {
              resolve(d.data);
            });
          });
        };
        Promise.all([getDirectivesByModelId(), getKpisByModelId()]).then(function (ret) {
          var directives = ret[0];
          var kpis = ret[1];
          directives = directives.filter(function (d) {
            return directiveIds.indexOf(d.id) != -1;
          });
          directives.forEach(function (directive) {
            kpis.forEach(function (kpi) {
              if (kpi.id == directive.kpiDefinitionIds[0]) {
                directive.kpiLabel = kpi.name;
              }
            });
            var wrap = $("<div></div>");
            var label = $("<label></label>");
            var input = $("<input />");
            var btn = $("<button></button>");
            var timesInput = $("<input />");
            var timesLabel = $("<label></label>");
            label.css("margin", "5px");
            input.css("margin", "5px");
            timesInput.css("margin", "5px");
            timesInput.css("width", "30px");
            timesInput.val(1);
            btn.text("发送")
            timesLabel.text("次");
            label.text(directive.name);
            wrap.append(label);
            wrap.append(input);
            wrap.append(btn);
            wrap.append(timesInput);
            wrap.append(timesLabel);
            div.append(wrap);
            btn.on("click", function (e) {
              var times = timesInput.val();
              times = Number(times);
              var params = {}
              params[directive.kpiLabel] = input.val();
              close();
              for (var j = 0; j < times; j++) {
                element.sendDirective(parseInt(nodeId), directive.id, params, function (e) {
                  console.log(e);
                });
              }
            })
          });
        });
      }
      var p = persentage || 1;
      div = $("<div></div>");
      div.css("position", "absolute");
      div.css("top", cell.position.y / p + "px");
      div.css("left", (cell.position.x < 300 ? (100 + cell.position.x) : (cell.position.x - 280)) / p + "px");
      div.css("border", "1px solid #ddd");
      div.css("z-index", 199);
      div.css("padding", "10px");
      div.css("background-color", "#eee");
      setTimeout(function(){
        div.on("click", function(e){
          e.stopPropagation();
        })
        $('body').on("click.directive", close);
      })
      topo.append(div);
      function close(e){
        div.children().remove();
        div.remove();
        $('body').off("click.directive");
      };
      return context;
    }
    self.createDeviceDropList = function(data, pos, config) {
      var p = persentage || 1;
      var hitArea = $("<div></div>");
      var titleArea = $("<div></div>");
      var popup = $("<div></div>");
      var config = config || {};
      var clickFn = config.$attr("click");
      var titleClickFn = config.$attr("titleClick");
      $("#devicelistscroll").remove();
      hitArea.attr("id", "devicelistscroll");
      titleArea.css("width", "100%");
      titleArea.css("height", "50px");
      hitArea.css("position", "absolute");
      hitArea.css("z-index", 199);
      popup.css("padding", "2px");
      popup.css("background-color", "#1e415d");
      popup.css("border", "1px solid #000");
      popup.css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,.5)");
      popup.css("max-height", "150px");
      popup.css("overflow-x", "hidden");
      popup.css("overflow-y", "auto");
      hitArea.css("cursor", "pointer");
      hitArea.css("top", (pos.y / p - (config.y || 30)) + "px");
      hitArea.css("left", (pos.x / p - (config.x || 50)) + "px");
      hitArea.css("background-color", "rgba(0,0,0,0)");
      hitArea.on("mouseleave", function(event) {
        $("#devicelistscroll").remove();
      });
      titleArea.on("click", function(event) {
        titleClickFn();
      });
      var createDom = function(item) {
        var wrap = $("<div></div>");
        var label = $("<span></span>");
        var status = $("<div></div>");
        wrap.attr("id", "wrap");
        status.css("margin-right", "5px");
        status.css("width", "10px");
        status.css("height", "10px");
        status.css("border-radius", "50%");
        status.css("background-color", self.getAlertColor(item.status));
        status.css("display", "inline-block");
        wrap.css("padding", "5px 15px");
        label.text(item.label);
        label.css("padding-right", "10px");
        wrap.append(status);
        wrap.append(label);
        wrap.on("mouseenter", function(event) {
          hitArea.find("#wrap").css("background-color", "rgba(0,0,0,0)");
          wrap.css("background-color", "rgba(0,0,0,.3)");
        });
        wrap.on("mouseleave", function(event) {
          wrap.css("background-color", "rgba(0,0,0,0)");
        });
        wrap.on("click", function(event) {
          clickFn(item);
        });
        item.$on("statusChanged", function(node) {
          status.css("background-color", self.getAlertColor(item.status));
        });
        return wrap;
      };
      for(var i in data) {
        popup.append(createDom(data[i]));
      }
      hitArea.append(titleArea);
      hitArea.append(popup);
      topo.prepend(hitArea);
    };
    //150 - 235
    self.createAttrDisp = function(t, data, pos, callback, planeMode) {
      var popup, body, title, wrap;

      function attrDisp() {
        popup = $("<div></div>");
        body = $("<div></div>");
        title = $("<div></div>");
        wrap = $("<table></table>");
        popup.css("position", "absolute");
        popup.css("padding", "2px");
        popup.css("background-color", "rgba(30,65,93,.9)");
        popup.css("border", "1px solid #000");
        popup.css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,.5)");
        popup.css("z-index", 99);
        if(planeMode) {
          body.css("max-height", "300px");
          body.css("min-width", "380px");
        } else {
          data.sort(function(a, b) {
            var la = a.label;
            var lb = b.label;
            if(la == "速度有效值") {
              return -1;
            }
            if(lb == "速度有效值") {
              return 1;
            }
            if(la == "冲击平均值") {
              return -1;
            }
            if(lb == "冲击平均值") {
              return 1;
            }
            if(la > lb) {
              return 1;
            } else {
              return -1;
            }
          });
          body.css("max-height", "50px");
        }
        body.css("overflow-y", "auto");
        body.css("overflow", "auto");
        title.css("text-align", "center");
        title.css("font-weight", "bold");
        title.css("padding", "3px");
        title.css("color", "#fff");
        title.css("background-color", "#295375");
        title.text(t);
        //      popup.css("top", pos.y / persentage + "px");
        //      popup.css("left", pos.x / persentage + "px");
        popup.css("top", pos.y + "px");
        popup.css("left", pos.x + "px");
        popup.append(title);
        var createDom = function(item) {
          var tr = $("<tr></tr>");
          var td1 = $("<td></td>");
          var td2 = $("<td></td>");
          var td3 = $("<td></td>");
          var td4 = $("<td></td>");
          var time = useMomentFormat(item.arisingTime, "yyyy-MM-dd hh:mm:ss");
          td1.css("padding", "5px 6px 1px 6px");
          td2.css("padding", "5px 6px 1px 6px");
          td3.css("padding", "5px 6px 1px 6px");
          td4.css("padding", "5px 6px 1px 6px");
          td1.css("vertical-align", "middle");
          td2.css("vertical-align", "middle");
          td3.css("vertical-align", "middle");
          td4.css("vertical-align", "middle");
          var label = $("<span></span>");
          var button = $('<button id="button" rel="popover" ></button>');
          if(!planeMode) {
            button.popover({
                placement: "right",
                trigger: "manual",
                title: "上报时间",
                container: "body",
                content: function() {
                  return time;
                },
              }).on("mouseenter", mouseenter)
              .on("mouseleave", mouseleave);
            label.text(item.label);
            td1.append(label);
          } else {
            var span1 = $("<span>" + item.devName + "</span>");
            var span2 = $("<span>" + item.message + "</span>");
            var span3 = $("<span>" + useMomentFormat(item.arisingTime, "yyyy-MM-dd hh:mm:ss") + "</span>");
            span1.css("white-space", "normal");
            span2.css("white-space", "normal");
            span3.css("white-space", "normal");
            span1.css("display", "inline-block");
            span2.css("display", "inline-block");
            span3.css("display", "inline-block");
            span1.css("max-width", "100px");
            span2.css("max-width", "220px");
            td1.append(span1);
            td3.append(span2);
            td4.append(span3);
          }
          if(item.valueStr) {
            button.text(item.valueStr);
          } else if(item.value != "-") {
            button.text(self.toFix(item.value, 2));
          } else {
            button.text("-");
          }

          function mouseenter() {
            if(t) {
              $(this).popover("show");
            }
          }

          function mouseleave() {
            $(this).popover("hide");
          }

          //button.popover("hide");

          label.css("color", "#aaa");
          label.css("padding-right", "10px");

          item.updateValue = function(value, unit) {
            //console.log(t, this);
            var val = value != "-" ? self.toFix(value, 2) : "-";
            if(unit != "NA" && unit) {
              val += unit;
            }
            button.text(val);
            this.value = value;
          };
          item.updateStatus = function(value) {
            this.status = value;
            button.css("background-color", self.getAlertColor(value));
          };
          item.updateTime = function(t) {
            if(t) {
              time = useMomentFormat(t, "yyyy-MM-dd hh:mm:ss");
              //button.popover("show");
            }
          };
          button.css("min-width", "50px");
          button.css("text-align", "center");
          button.css("line-height", "12px");
          button.css("border", 0);
          button.css("color", "#fff");
          button.css("border-radius", "10px");
          button.css("background-color", self.getAlertColor(item.status));
          button.on("click", function(event) {
            $(this).popover("destroy");
            if(callback) {
              callback(item);
            }
          });
          if(item.label) {
            tr.append(td1);
          }
          if(planeMode) {
            tr.append(td3);
            tr.append(td4);
          }
          tr.append(td2);
          td2.append(button);
          return tr;
        };
        for(var i in data) {
          wrap.append(createDom(data[i]));
        }
        body.append(wrap);
        popup.append(body);
        topo.append(popup);
      }

      attrDisp.prototype.destroy = function() {
        popup.remove();
      };
      attrDisp.prototype.getData = function() {
        return data;
      };
      return new attrDisp();
    };
    var itemins;
    self.createCurrentStatus = function(txt, pos, status) {
      var wrap = $("<div></div>");
      var title = $("<div></div>");
      var addOn = $("<div></div>");
      var circle = $("<div></div>");
      var ins;

      function wholeClick() {
        $("body").off("click");
        ins.destroy();
        if(itemins) {
          itemins.destroy();
        }
      }

      function clickFn(event) {
        var p = persentage || 1;
        var data = self.getValue("device/alerts");
        if(ins) {
          ins.destroy();
        }
        $("body").off("click");
        if(data.length > 0) {
          ins = self.createAttrDisp("告警信息", data, {
            x: pos.x / p - 200,
            y: pos.y / p + 15
          }, function(item) {

            var nodeId = item.nodeId;
            var resource;
            var ROLE = self.getValue("global/ROLE");
            self.getDomainAreaLineTree_alertStatus(function(domaintree) {
              domaintree.traverse(function(node) {
                if(node.id == nodeId) {
                  self.setValue("global/resource", node);
                  self.setValue("global/instance", item.instance);
                  self.setValue("global/alertTime", item.arisingTime);
                  if(ROLE == 0) {
                    self.navigateTo("index", {
                      main: 3,
                      backHistory: 1
                    }, "self");
                  } else if(ROLE == 1) {
                    self.navigateTo("index", {
                      main: 2,
                      backHistory: 1
                    }, "self");
                  } else if(ROLE == 2) {
                    self.navigateTo("index", {
                      main: 2,
                      backHistory: 1
                    }, "self");
                  } else if(ROLE == 3) {
                    self.navigateTo("index", {
                      main: 2,
                      backHistory: 1
                    }, "self");
                  } else if(ROLE == 4) {
                    self.navigateTo("index", {
                      main: 3,
                      backHistory: 1
                    }, "self");
                  } else {
                    self.growl("此角色无法显示特征曲线");
                  }
                }
              });
            });
          }, true);
          setTimeout(function() {
            $("body").on("click", wholeClick);
          });
        } else {
          self.growl("暂无未处理的告警信息！");
        }
      }

      function currentStatus() {
        wrap.css("position", "absolute");
        var p = persentage || 1;
        wrap.css("cursor", "pointer");
        wrap.css("top", pos.y / p + "px");
        wrap.css("left", pos.x / p + "px");
        title.text(txt);
        title.css("padding-right", "6px");
        title.css("font-weight", "bold");
        title.css("line-height", "14px");
        title.css("display", "inline-block");
        title.css("color", "#fff");
        addOn.css("display", "inline-block");
        circle.css("display", "block");
        circle.css("position", "absolute");
        circle.css("top", "1px");
        circle.css("width", "14px");
        circle.css("height", "14px");
        circle.css("border-radius", "50%");
        circle.css("background-color", self.getAlertColor(status));
        circle.css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,1)");
        if(status > 0) {
          title.css("text-decoration", "underline");
          wrap.off("click");
          wrap.on("click", clickFn);
        }
        addOn.append(circle);
        wrap.append(title);
        wrap.append(addOn);
        topo.append(wrap);
      }

      currentStatus.prototype.setAlarmStatus = function(status) {
        circle.css("background-color", self.getAlertColor(status));
        if(status > 0) {
          title.css("text-decoration", "underline");
          wrap.off("click");
          wrap.on("click", clickFn);
        }
      };
      return new currentStatus();
    };

    self.createCurrentStatusByItem = function(id, pos) {
      function wholeClick() {
        $("body").off("click");
        if(itemins)
          itemins.destroy();
      }

      function clickFn(event) {
        var p = persentage || 1;
        var data = self.getValue("device/alerts");
        if(itemins) {
          itemins.destroy();
        }
        data = data.filter(function(elm) {
          return elm.nodeId == id;
        });
        $("body").off("click");
        if(data.length > 0) {
          itemins = self.createAttrDisp("告警信息", data, {
            x: pos.x / p,
            y: pos.y / p
          }, function(item) {

            var nodeId = item.nodeId;
            var resource;
            var ROLE = self.getValue("global/ROLE");
            self.getDomainAreaLineTree_alertStatus(function(domaintree) {
              domaintree.traverse(function(node) {
                if(node.id == nodeId) {
                  self.setValue("global/resource", node);
                  self.setValue("global/instance", item.instance);
                  self.setValue("global/alertTime", item.arisingTime);
                  if(ROLE == 1) {
                    self.navigateTo("index", {
                      main: 2,
                      backHistory: 1
                    }, "self");
                  } else if(ROLE == 2) {
                    self.navigateTo("index", {
                      main: 2,
                      backHistory: 1
                    }, "self");
                  } else if(ROLE == 3) {
                    self.navigateTo("index", {
                      main: 2,
                      backHistory: 1
                    }, "self");
                  } else {
                    self.growl("此角色无法显示特征曲线");
                  }
                }
              });
            });
          }, true);
          setTimeout(function() {
            $("body").on("click", wholeClick);
          });
        } else {
          self.growl("此设备暂无未处理的告警信息！");
        }
      }

      clickFn();
    };
    
    self.createMarker = function(title, callback) {
      $$.loadExternalJs(["toolkit/configure/marker"], function(threeDbar) {
        var ins = threeDbar.init(svgId, {
          title: title
        });
        callback(ins);
      });
    };
    
    self.createAlarm = function(title, callback) {
      $$.loadExternalJs(["toolkit/configure/alarm"], function(threeDbar) {
        var ins = threeDbar.init(svgId, {
          title: title
        });
        callback(ins);
      });
    };
    
    self.createAlarmSmall = function(title, callback) {
      $$.loadExternalJs(['toolkit/configure/alarm'], function(threeDbar) {
        var ins = threeDbar.init(svgId, {
          title: title,
          smallMode: true
        });
        callback(ins);
      })
    };
    
    self.create3Dbar = function(title, callback) {
      $$.loadExternalJs(['toolkit/configure/3dbarchart'], function(threeDbar) {
        var ins = threeDbar.init(svgId, {
          title: title
        });
        //ins.setPos(cell.position());
        //ins.setValue(0);
        callback(ins);
      });
    };

    //获得缩放的点位
    self.getPersentageSite = function(position) {
      var p = persentage || 1;
      var tempPosition = {
        x: 0,
        y: 0
      };
      tempPosition.x = position.x / p;
      tempPosition.y = position.y / p;
      return tempPosition;
    }

    self.render = function(inputJson) {
      var run = function(json) {
        if(typeof json == "object" && json != null) {
          var callback = function(joint) {
            timeout(function() {
              var cellsDic = {}; //拓扑节点集合的定义
              var linksDic = {}; //线条字典
              var linkAnHandler = function(cell) {
                var dr = cell.get("attrs")[".connection"]["stroke-dasharray"];
                var linkAn = cell.get("linkAn");
                var cellDom = jQuery("[model-id=" + cell.id + "]").find(".connection")[0];
                var oldClass = cellDom.getAttribute("class");
                oldClass = oldClass.replace(' runslow', '');
                oldClass = oldClass.replace(' runnormal', '');
                oldClass = oldClass.replace(' runfast', '')
                if(dr && dr != "0") {
                  if(linkAn == "慢速") {
                    oldClass = oldClass + ' runslow';
                  } else if(linkAn == "普通") {
                    oldClass = oldClass + ' runnormal';
                  } else if(linkAn == "快速") {
                    oldClass = oldClass + ' runfast';
                  }
                }
                cellDom.setAttribute("class", oldClass);
              }
              
              var openCellTools = function(cellView) {
                if(previewMode) {
                  var cell = cellView.model || cellView,
                    modelId, nodeId, subViewId, kpiId;
                  var strModelId = cell.get("modelId");
                  var strNodeId = cell.get("nodeId");
                  var strsubViewId = cell.get("subViewId");
                  var strKpiId = cell.get("kpiId");
                  var text = cell.attr("text");
                  var getNumber = function(str) {
                    var numRegExp = /number\:(.*)/;
                    if(typeof str == "string") {
                      var exp = numRegExp.exec(str);
                      if(exp) {
                        return exp[1];
                      }
                    }
                    return undefined;
                  };
                  modelId = getNumber(strModelId);
                  nodeId = getNumber(strNodeId);
                  kpiId = getNumber(strKpiId);
                  subViewId = getNumber(strsubViewId);
                  if(cell.get("valueConfig")) {
                    var isSend = false; //是否发送过
                    var dirModel = resourceUIService.rootModelsDic[modelId];
                    if(cell.get("valueConfig") && dirModel) {
                      cell.get("valueConfig").forEach(function(valueLvevel) {
                        if(valueLvevel.stateDisplay && valueLvevel.valueDirective && valueLvevel.valueDirectiveAttr) {
                          isSend = true;
                          dirModel.directives.forEach(function(dirObj) {
                            if(valueLvevel.valueDirective == dirObj.id) {
                              dirObj.value = valueLvevel.valueDirectiveAttr;
                              self.sendItemDir(dirObj, nodeId);
                            }
                          });

                        }
                      });
                      if(!isSend && cell.get("valueConfig")[0].valueDirective && cell.get("valueConfig")[0].valueDirectiveAttr) {
                        dirModel.directives.forEach(function(dirObj) {
                          if(cell.get("valueConfig")[0].valueDirective == dirObj.id) {
                            dirObj.value = cell.get("valueConfig")[0].valueDirectiveAttr;
                            self.sendItemDir(dirObj, nodeId);
                          }
                        });
                      }
                    }
                    return;
                  }
                  if(typeof clickEvent == "function") {
                    clickEvent({
                      cellView: cell,
                      ui: {
                        modelId: modelId,
                        resourceId: nodeId,
                        kpiId: kpiId,
                        subViewId: subViewId
                      },
                      target: self,
                      self: self,
                      global: global,
                      tools: elemData
                    });
                  }
                }
              };
              
              //线条渲染方法
              var PatternLinkView = joint.dia.LinkView.extend({
                //渲染的模板
                patternMarkup: [
                  '<pattern id="pattern-<%= id %>" patternUnits="userSpaceOnUse">',
                  '<image xlink:href=""/>',
                  '</pattern>'
                ].join(''),
                initialize: function() {
                  joint.dia.LinkView.prototype.initialize.apply(this, arguments);
                  _.bindAll(this, 'fillWithPattern');
                },
                render: function() {
                  // 调用父节点的render方法
                  joint.dia.LinkView.prototype.render.apply(this, arguments);
                  // 建立监听
                  this.listenTo(this.model, 'change:pattern change:patternColor', this.update);
                  return this;
                },
                remove: function() {
                  // 确保我们停止了正在进行的模式更新。
                  joint.util.cancelFrame(this.frameId);
                  joint.dia.LinkView.prototype.remove.apply(this, arguments);
                  this.clearPattern();
                },
                clearPattern: function() {
                  if(this.pattern) {
                    // 从DOM中删除模式。
                    this.pattern.remove();
                    this.pattern = null;
                  }
                },
                update: function() {
                  joint.dia.LinkView.prototype.update.apply(this, arguments);

                  if(this.model && !this.model.get("pattern")) {
                    return this;
                  }

                  this.clearPattern();
                  // 确保pattern不存在
                  if(!this.pattern) {
                    // 创建模式和图像元素。
                    this.pattern = joint.V(_.template(this.patternMarkup)({
                      id: this.id
                    }));

                    // 缓存图像元素以便更快地访问。
                    this.patternImage = this.pattern.findOne('image');

                    // 将模式附加到pager的defs中。
                    joint.V(this.paper.svg).defs().append(this.pattern);

                    // 通知 '.connection' 路径使用pattern渲染
                    var connection = joint.V(this.el).findOne('.connection').attr({
                      stroke: 'url(#pattern-' + this.id + ')'
                    });

                    // 缓存原来的stroke-width
                    this.strokeWidth = connection.attr('stroke-width') || 1;
                  }

                  // 确保我们停止了正在进行的模式更新。
                  joint.util.cancelFrame(this.frameId);

                  this.frameId = joint.util.nextFrame(this.fillWithPattern);

                  return this;
                },
                fillWithPattern: function() {
                  var strokeWidth = this.strokeWidth;
                  // we get the bounding box of the linkView without the transformations
                  // and expand it to all 4 sides by the stroke width
                  // (making sure there is always enough room for drawing,
                  // even if the bounding box was tiny.
                  // Note that the bounding box doesn't include the stroke.)
                  var bbox = joint.g.rect(joint.V(this.el).bbox(true)).moveAndExpand({
                    x: -strokeWidth,
                    y: -strokeWidth,
                    width: 2 * strokeWidth,
                    height: 2 * strokeWidth
                  });

                  // create an array of all points the link goes through
                  // (route doesn't contain the connection points)
                  var points = [].concat(this.sourcePoint, this.route, this.targetPoint);

                  // transform all points to the links coordinate system
                  points = _.map(points, function(point) {
                    return joint.g.point(point.x - bbox.x, point.y - bbox.y);
                  });

                  // create a canvas of the size same as the link bounding box
                  var canvas = document.createElement('canvas');
                  canvas.width = bbox.width;
                  canvas.height = bbox.height;
                  var ctx = canvas.getContext('2d');
                  ctx.lineWidth = strokeWidth;
                  ctx.lineJoin = "round"; //lineJoin 属性设置或返回所创建边角的类型，当两条线交汇时。bevel/round/miter。
                  ctx.lineCap = "round"; //lineCap 属性设置或返回线条末端线帽的样式。butt/round/square

                  // iterate over the points and execute the drawing function
                  // for each segment
                  for(var i = 0, pointsCount = points.length - 1; i < pointsCount; i++) {
                    ctx.save();
                    var gradientPoints = this.gradientPoints(points[i], points[i + 1], strokeWidth);
                    var gradient = ctx.createLinearGradient.apply(ctx, gradientPoints);

                    this.drawPattern.call(this, ctx, points[i], points[i + 1], strokeWidth, gradient);

                    ctx.restore();
                  }

                  // generate data URI from the canvas
                  var dataUri = canvas.toDataURL('image/png');

                  // update the pattern image and the dimensions
                  this.pattern.attr(bbox);
                  this.patternImage.attr({
                    width: bbox.width,
                    height: bbox.height,
                    'xlink:href': dataUri
                  });
                },
                // finds a gradient with perpendicular direction to a link segment
                gradientPoints: function(from, to, width) {
                  var angle = joint.g.toRad(from.theta(to) - 90);
                  var center = joint.g.line(from, to).midpoint();
                  var start = joint.g.point.fromPolar(width / 2, angle, center);
                  var end = joint.g.point.fromPolar(width / 2, Math.PI + angle, center);
                  return [start.x, start.y, end.x, end.y];
                },
                // A drawing function executed for all links segments.
                drawPattern: function(ctx, from, to, width, gradient) {
                  var innerWidth = width - 4;
                  var outerWidth = width;
                  var buttFrom = joint.g.point(from).move(to, -outerWidth / 2);
                  var buttTo = joint.g.point(to).move(from, -outerWidth / 2);

                  /*
                  ctx.beginPath();
                  ctx.lineWidth = outerWidth;
                  ctx.strokeStyle = 'rgba(0,0,0,0.6)';

                  ctx.moveTo(from.x, from.y);
                  ctx.lineTo(to.x, to.y);
                  ctx.stroke();
                  ctx.closePath();
                  */

                  var lineColor = "blue";
                  if(this.model.get("attrs") && this.model.get("attrs")[".connection"]) {
                    lineColor = this.model.get("attrs")[".connection"]["stroke"] ? this.model.get("attrs")[".connection"]["stroke"] : lineColor;
                  }
                  var patternColor = "#ffffff";
                  if(this.model.get("patternColor")) {
                    patternColor = this.model.get("patternColor");
                  }
                  gradient.addColorStop(0.000, lineColor);
                  gradient.addColorStop(0.500, patternColor);
                  gradient.addColorStop(1.000, lineColor);

                  ctx.beginPath();
                  ctx.lineWidth = innerWidth;
                  ctx.strokeStyle = gradient;
                  ctx.moveTo(from.x, from.y);

                  ctx.lineTo(to.x, to.y);
                  ctx.stroke();
                  ctx.closePath();
                }
              });
              var repeat = function(target) {
                target.attr("circle/opacity", 1);
                target.attr("circle/r", 1);
                target.transition("attrs/circle/r", 30, {
                  delay: 0,
                  duration: 1000,
                  timingFunction: function(t) {
                    return t * t;
                  },
                  valueFunction: function(a, b) {
                    return function(t) {
                      return a + (b - a) * t;
                    };
                  }
                });
                target.transition("attrs/circle/opacity", 0, {
                  delay: 0,
                  duration: 1000,
                  timingFunction: function(t) {
                    return t * t;
                  },
                  valueFunction: function(a, b) {
                    return function(t) {
                      return a + (b - a) * t;
                    };
                  }
                });
                timeout(function() {
                  repeat(target);
                }, 1600);
              };
              
              /* 以下是DIV在盒子中的处理 */
              parentheight = topo.parent().height();
              parentwidth = topo.parent().width();
              var domwidth = topo.width();
              
              //从json中获得比例
              var oldwidth = json.width;
              var oldheight = json.height;
              var portion = oldwidth / oldheight;
              //如果仪表板中没有设置高度，那么按照DIV的宽度，等比设置
              if(!element.style.height) {
                topo.css("height", domwidth / portion + "px");
              }

              var domheight = topo.height();
              
              var graph = new joint.dia.Graph;
              var config = json.$clone();
              // config.el = topo; 使用paperScroller
              config.model = graph;
              config.interactive = false;
              config.perpendicularLinks = true;
              config.gridSize = 0;
              config.markAvailable = true;
              config.linkConnectionPoint = joint.util.shapePerimeterConnectionPoint;
              config.defaultLink = new joint.dia.Link({
                attrs: {
                  ".marker-source": {
                    d: "M 10 0 L 0 5 L 10 10 z",
                    transform: "scale(0.001)"
                  },
                  ".marker-target": {
                    d: "M 10 0 L 0 5 L 10 10 z"
                  },
                  ".connection": {
                    stroke: "black"
                  }
                }
              });
              config.linkView = PatternLinkView;
              delete config.cells;
              
              var scale = 1, translate = "0,0",ys = 0;
              
              if(oldwidth / oldheight < domwidth / domheight) {
                scale = domheight / oldheight;
//              config.width = domheight * portion;
//              config.height = domheight;
                ys = (domwidth - config.width) / 2;
                persentage = oldheight / domheight;
              } else {
                scale = domwidth / oldwidth;
//              config.width = domwidth;
//              config.height = domwidth / portion;
                persentage = oldwidth / domwidth;
              }
              config.width = oldwidth;
              config.height = oldheight;
              topo.children().remove();
//            topo.css("width", config.width);
//            topo.css("height", config.height);
              
              // 创建一个wrap层，放置组态内容
              var wrap = $("<div></div>");
              topo.append(wrap);
              
              if(config.width > 0 && config.height > 0) {
                json.cells.forEach(function(cl){
                  if(cl.type == "basic.Image") {
                    cl.attrs.image.width = cl.size.width
                    cl.attrs.image.height = cl.size.height
                  }
                })
                var paper = new joint.dia.Paper(config);
                var paperScroller = new joint.ui.PaperScroller({
                  el: wrap,
                  paper: paper,
                  autoResizePaper: false,
                  padding: 0
                });
                graph.fromJSON(json);
                //如果有背景就设置
                if($$.isString(json.bgimage)) {
                  paper.$el.css('background-image', 'url("' + json.bgimage + '")'); 
                  paper.$el.css("background-size", "contain");
                  paper.$el.css("background-repeat", "no-repeat");
                  paper.$el.css('background-position', "top");
                }
                paper.$el.css("background-color",json.bgcolor);
                paperScroller.zoom(scale - 1, {
                  max: 4
                });
                paper.$el.css('margin-right', 0);
                paper.$el.attr('id', svgId);
                paperScroller.scroll(0, 0);
                paperScroller.$el.css('padding-left', "0");
                paperScroller.$el.css('padding-top', "0");
                paperScroller.$el.css("overflow", "hidden");
                // 获取所有的cell遍历，判断其cursor属性
                // 根据此属性的不同，鼠标悬浮时显示小手或者默认
                graph.getCells().forEach(function (cell) {
                  var modelId = cell.get('id');
                  var cursorStr = cell.get('cursor');
                  var cursor = '';
                  if (cursorStr) {
                    var cursorAry = cursorStr.split(':');
                    if (cursorAry.length > 0 && cursorAry[cursorAry.length - 1] != '?') {
                      cursor = cursorAry[cursorAry.length - 1];
                    }
                  }
                  var $_cell_el = paper.$el.find('g[model-id="'+modelId+'"]');
                  if (cursor) {
                    $_cell_el.get(0).style = 'cursor: ' + cursor + '!important';
                  }
                });

                if(events["$renderGraphComplete"]) {
                  events["$renderGraphComplete"](graph.getCells());
                }
                element.trigger("$renderGraphComplete", graph.getCells());
                paper.on("element:pointerup", function(cellView) {
                  if(cellView.model instanceof joint.dia.Element) {
                    openCellTools(cellView);
                  }
                });
                paper.on('cell:pointerup', function(cellView, evt) {
                  if(cellView.model instanceof joint.dia.Link) {
                    openCellTools(cellView);
                  }
                  if(cellView.model.attributes.extend == "directive") {
                    directive(cellView.model.attributes);
                  }
                });
                /* 线条上的事件用cell:pointerup
                paper.on('link:options', function(evt, cellView, x, y) {
                  openCellTools(cellView);
                });
                */
               /*
                if($$.isString(json.bgimage)) {
                  topo.find("svg").css("background-image", "url(" + json.bgimage + ")");
                }
                topo.find("svg").css("background-size", "contain");
                topo.find("svg").css("background-repeat", "no-repeat");
                topo.find("svg").css("background-position", "center center");
                topo.find("svg").attr("id", svgId);
                topo.find(".viewport").attr("transform", "scale(" + scale + ")");
                topo.find(".chart.Plot").css("display", "none");
                */
                
                var defers = [],
                  nodes = [],
                  kpis = [];
                var pages = [];
                if(elemData.routeParam.page) {
                  pages = elemData.routeParam.page.split("|");
                }
                var distype = self.getParameter("type");
                var currentPath = pages[pages.length - 1];
                var mleft = element.style.margin;
                try {
                  if(mleft) {
                    mleft = parseInt(mleft.split("px")[0]);
                  }
                } catch(e) {
                  console.log(e);
                } finally {}
                var loop = function(cell) {
                  var defer = q.defer();
                  var elementId = cell.id;
                  var elDom = graph.getCell(elementId);
                  var cellType = cell.type;
                  var nodeStr = elDom.get("nodeId"),
                    nodeId;
                  var kpiStr = elDom.get("kpiId"),
                    kpiId;
                  var findNumber = /^number\:(.*)/;
                  var extend = elDom.get("extend");
                  if(extend == "angle") {
                    elDom.attr("text/style/display", "none");
                    elDom.attr("rect/style/display", "none");
                    $$.loadExternalJs(["toolkit/configure/openAngle"], function(openAngle) {
                      var ins = openAngle.init(svgId);
                      openAngles[cell.id] = ins;
                      ins.setPos(cell.position);
                      ins.setValue(0);
                    });
                  } else if(extend == "directive") {
                    //elDom.attr("text/style/display", "none");
                    //elDom.attr("rect/style/opacity", 0);
                  }
                  if(currentPath != "panel" && distype != "panel") {
                    if(nodeStr != "?") {
                      nodeId = $$.runRegExp(nodeStr, findNumber, 1);
                    }
                    if(nodeId) {
                      nodeId = parseInt(nodeId);
                    }
                    if(nodes.indexOf(nodeId) == -1 && nodeId) {
                      nodes.push((nodeId));
                    }
                  } else if(self.composoryRes) {
                    nodeId = self.composoryRes.id;
                    if(nodes.indexOf(self.composoryRes.id) == -1) {
                      nodes.push(self.composoryRes.id);
                    }
                  } else {
                    nodeId = self.getParameter("resourceId");
                    if(nodes.indexOf(nodeId) == -1) {
                      nodes.push(nodeId);
                    }
                  }
                  if(kpiStr != "?") {
                    kpiId = $$.runRegExp(kpiStr, findNumber, 1);
                  }
                  if(kpiId && kpiId != "null") {
                    kpiId = parseInt(kpiId);
                  }
                  if(kpis.indexOf(kpiId) == -1 && nodeId && kpiId != "null" && kpiId) {
                    kpis.push((kpiId));
                  }
                  if(cellType == "chart.Plot") {
                    var position = cell.position;
                    var size = cell.size;
                    var findNumber = /^number\:(.*)/;
                    var viewId = $$.runRegExp(cell.echartViewId, findNumber, 1);
                    self.getViewById(viewId, function(view) {
                      if(view) {
                        var chartWrap = $("<div></div>");
                        chartWrap.css("width", size.width * scale + "px");
                        chartWrap.css("height", "auto");
                        chartWrap.css("top", position.y * scale + "px");
                        chartWrap.css("left", (position.x * scale + ys + 5) + "px");
                        chartWrap.css("position", "absolute");
                        chartWrap.css("background-color", "#eee");
                        chartWrap.css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,.2)");
                        chartWrap.css("border-radius", "2px");
                        wrap.prepend(chartWrap);
                        var json = JSON.parse(view.content);
                        json.layout = json.layout.$remapByChild(function(element) {
                          var rs = new commonMethod(element);
                          return rs;
                        });
                        var layout = json.layout;
                        element.children = layout.children;
                        element.traverse(function(elem) {});
                        if(cell.nodeIds) {
                          cell.nodeIds.$remove(function(index, element) {
                            return element == 0;
                          });
                          if(cell.nodeIds.length > 0) {
                            var callback = function(event) {
                              if(event) {
                                var resource = event[cell.nodeIds[0]];
                                if(resource) {
                                  var success = function(data) {
                                    layout.traveseByChild(function(elem) {
                                      if(elem.type == "echart") {
                                        elem.data.resource = [resource];
                                        var kpis = elem.data.kpi;
                                        elem.data.kpi = data.filter(function(elm) {
                                          return kpis.indexOf(elm.id) != -1;
                                        });
                                      }
                                    });
                                    traverseRow(chartWrap, layout.children, true);
                                  };
                                  serviceCenterService.kpis.getBymodelId(resource.modelId).then(success);
                                }
                              }
                            };
                            var strToNumer = function(arr) {
                              for(var i in arr) {
                                if(typeof arr[i] == "string") {
                                  if(arr[i].indexOf("number:") != -1) {
                                    var numStr = arr[i].split("number:")[1];
                                    arr[i] = parseInt(numStr);
                                  }
                                }
                              }
                              return arr;
                            };
                            resourceUIService.getResourceByIds(strToNumer(cell.nodeIds), callback);
                          } else {
                            traverseRow(chartWrap, layout.children, true);
                          }
                        } else {
                          traverseRow(chartWrap, layout.children, true);
                        }
                      }
                    });
                    defer.resolve("success");
                  } else {
                    if(cell.type == "link") {
                      jQuery.extend(cell, displayModeLink);
                      cell.attrs[".connection-wrap"] = {
                        display: "none"
                      };
                      linksDic[cell.id] = cell;
                      if (cell.source && cell.source.id) {
                        linksDic["source:"+cell.source.id] = cell;
                      }
                      if (cell.target && cell.target.id) {
                        linksDic["target:"+cell.target.id] = cell;
                      }
                      linkAnHandler(elDom);
                    }
                    if(elDom.attributes.nodeId) {
                      //                    elDom.attr('circle/opacity', 0); 这个是为什么要设置为0呢？zhangfa12月15日取消
                      if(nodeId) {
                        var callback = function(event) {
                          if(event) {
                            var resource = event[nodeId];
                            cell.resourceObj = resource;
                            elDom.resourceObj = resource;
                            //console.log("resourceObj=====", event, resource);
                            all_resources.push(cell.resourceObj);
                            if(resource) {
                              if(extend == "alert") {
                                elDom.kpiObj = cell.kpiObj = {
                                  id: 999999
                                };
                                defer.resolve("success");
                              } else if(kpiId != undefined && kpiId != "0" && kpiId != null) {
                                var success = function(data) {
                                  elDom.kpiObj = cell.kpiObj = data.find(function(elem) {
                                    return elem.id == kpiId;
                                  });
                                  all_kpis.push(cell.kpiObj);
                                  defer.resolve("success");
                                };
                                serviceCenterService.kpis.getBymodelId(resource.modelId).then(success);
                              } else {
                                defer.resolve("success");
                              }
                            } else {
                              defer.resolve("success");
                            }
                          } else {
                            defer.resolve("success");
                          }
                        };
                        resourceUIService.getResourceByIds([nodeId], callback);
                      } else {
                        defer.resolve("success");
                      }
                    } else {
                      defer.resolve("success");
                    }
                  }
                  return defer.promise;
                };
                for(var i in json.cells) {
                  defers.push(loop(json.cells[i]));
                }
                var defer1 = q.defer();
                defers.push(defer1.promise);
                if (scope.$$childHead.rootModelsDic && scope.$$childHead.rootModelsDic["kpiDefloaded"]) {
                  defer1.resolve("success");
                } else {
                  scope.$$childHead.$on('kpiDefLoadFinished',function(e) {
                    defer1.resolve("success");
                  })
                }
                
                q.all(defers).then(function() {
                  var getData_success = function(data) {
                    var loop = function(cell, find, findState) {
                      var elementId = cell.id;
                      var elDom = graph.getCell(elementId);
                      if(cell.resourceObj) {
                        var findNumber = /^number\:(.*)/;
                        if(currentPath != "panel" && distype != "panel") {
                          var nodeStr = elDom.get("nodeId"),
                            nodeId;
                          nodeId = $$.runRegExp(nodeStr, findNumber, 1);
                        } else if(self.composoryRes) {
                          var nodeId = self.composoryRes.id;
                        } else {
                          var nodeId = self.getParameter("resourceId");
                        }
                        var kpiId = cell.$attr("kpiObj/id");
                        if(find || findState) {
                          var createData = function(find) {
                            var setLevel = function(cell, value) {
                              var range = cell.attributes.range;
                              if(range) {
                                range = eval(range);
                              }
                              var persent = (value - range[0]) / (range[1] - range[0]);
                              cell.prop("attrs/text/text", "");
                              cell.transition("attrs/rect", {
                                "transform": "translate(0,0)",
                                "height": 60 * persent
                              }, {
                                delay: 0,
                                duration: 1000,
                                valueFunction: function(start, end) {
                                  return function(time) {
                                    var height = start["height"] + (end["height"] - start["height"]) * time;
                                    var all = 0;
                                    return {
                                      "transform": "translate(0," + (60 - height) + ")",
                                      "height": height,
                                    };
                                  };
                                }
                              });
                            };
                            var setOpenAngle = function(cell, value, element) {
                              var range = cell.attributes.range;
                              var id = cell.id;
                              openAngles[id].setValue(value);
                            };
                            
                            var pathAnimate = function(cell,value,type,kpiRange) {
                              if (!kpiRange) kpiRange = [0,1];
                              var p = (value-kpiRange[0])/(kpiRange[1] - kpiRange[0]);
                              if (p < 0) p = -p;
                              if (p > 1) p = 1;
                              if (!cell.linkDomBox) {
                                var pathlink = linksDic["source:"+cell.id]; //渲染的link
                                if (!pathlink) pathlink = linksDic["target:"+cell.id];
                                if (!pathlink) return;
                                cell.linkDom = jQuery("[model-id=" + pathlink.id + "]")[0] //定义的link
                                cell.linkDomBox = cell.linkDom.getBoundingClientRect();
                              }
                              var movetox = -1;
                              var movetoy = -1;
                              if (type == "number:1") { //X轴正方向
                                if (cell.offsetx == undefined) {
                                  cell.offsetx = cell.get("position").x;
                                }
                                movetox = cell.offsetx + cell.linkDomBox.width*p/scale;
                              } else if (type == "number:2") { //x轴负方向
                                if (cell.offsetx == undefined) {
                                  cell.offsetx = cell.get("position").x;
                                }
                                movetox = cell.offsetx - cell.linkDomBox.width*p/scale;
                              } else if (type == "number:3") { //y轴正方向
                                if (cell.offsety == undefined) {
                                  cell.offsety = cell.get("position").y;
                                }
                                movetoy = cell.offsety + cell.linkDomBox.height*p/scale;
                              } else if (type == "number:4") { //y轴负方向
                                if (cell.offsety == undefined) {
                                  cell.offsety = cell.get("position").y;
                                }
                                movetoy = cell.offsety - cell.linkDomBox.height*p/scale;
                              } else if (type == "number:5") {
                                var connection = cell.linkDom.firstChild;
                                var cellDom = jQuery("[model-id=" + cell.id + "]")[0]
                                var attrs = { 
                                  'xlink:href': '#' + cellDom.firstChild.attributes["id"].value,
                                  path:connection.attributes["d"].value,
                                  dur: '5s', 
                                  begin : "1s",
                                  rotate:"auto"
                                };
                                var animateMotion = joint.V('animateMotion', attrs);
                                cellDom.firstChild.append(animateMotion.node);
                              }
                              if (movetox > -1) {
                                cell.transition('position/x', movetox, {
                                  delay: 100,
                                  duration: 1000,
                                  timingFunction: joint.util.timing.inout,
                                  valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
                                });
                              }
                              if (movetoy > -1) {
                                cell.transition('position/y', movetoy, {
                                  delay: 100,
                                  duration: 1000,
                                  timingFunction: joint.util.timing.inout,
                                  valueFunction: function(a, b) { return function(t) { return a + (b - a) * t }}
                                });
                              }
                            }
      
                            var fillColor = function(cell, type, color, state, color2) {
                              var stateId = cell.get("stateId");
                              if(stateId) {
                                if(state < 1) state = 0;
                                cell.state = state;
                                var colorAry = [color, "#25bce7", "#e1cd0a", "#ed9700", "#e7675d"];
                                var colorAry2 = [color2, "#25bce7", "#e1cd0a", "#ed9700", "#e7675d"];
                                if(stateId == "number:1" || stateId == "number:3") {
                                  if(type && colorAry[state]) {
                                    cell.transition("attrs/" + type + "/fill", colorAry[state], {
                                      delay: 300,
                                      duration: 500,
                                      valueFunction: joint.util.interpolate.hexColor
                                    });
                                  }
                                }
                                if((stateId == "number:2" || stateId == "number:3") && colorAry2[state]) {
                                  cell.transition("attrs/text/fill", colorAry2[state], {
                                    delay: 300,
                                    duration: 500,
                                    valueFunction: joint.util.interpolate.hexColor
                                  });
                                }
                              }
                            };
                            var breathFlash = function(cell, type, color, state, opacityState) {
                              var stateId = cell.get("stateId");
                              var flash = function(el) {
                                var defaultOpacity = opacityState ? 1 : el.opacity;
                                el.transition("attrs/" + type + "/opacity", defaultOpacity, {
                                  delay: 0,
                                  duration: 3000,
                                  timingFunction: joint.util.timing.inout,
                                  valueFunction: function(a, b) {
                                    return function(t) {
                                      var o = a + b * (defaultOpacity - Math.abs(defaultOpacity - 2 * defaultOpacity * t));
                                      return Number(o.toFixed(2));
                                    };
                                  }
                                });
                              };

                              if(stateId) {
                                if(state < 0) state = 0;
                                var colorAry = [color, "#25bce7", "#e1cd0a", "#ed9700", "#e7675d"];
                                if(stateId == "number:2") {
                                  type = "text";
                                }
                                if(type) {
                                  if(!cell.opacity) {
                                    cell.opacity = jQuery.isNumeric(cell.prop("attrs/" + type + "/opacity")) ? cell.prop("attrs/" + type + "/opacity") : 1;
                                  }
                                  cell.state = state;
                                  cell.prop("attrs/" + type + "/opacity", 0.1);
                                  cell.prop("attrs/" + type + "/fill", colorAry[state]);
                                  if(cell.state > 0) {
                                    if(_.contains(cell.getTransitions(), "attrs/" + type + "/opacity")) return;
                                    cell.on("transition:end", function(el, path) {
                                      if(el.state > 0) {
                                        flash(el);
                                      } else {
                                        el.off("transition:end");
                                        el.prop("attrs/" + type + "/opacity", el.opacity);
                                      }
                                    });
                                    flash(cell);
                                  } else {
                                    cell.prop("attrs/" + type + "/opacity", cell.opacity);
                                  }
                                }
                              }
                            };
                            var bubbleFlash = function(cell, type, color, state, opacityState) {
                              var stateId = cell.get("stateId");
                              var flash = function() {
                                cell.prop("attrs/" + type + "/r", 0);
                                cell.prop("attrs/" + type + "/opacity", opacityState ? 1 : cell.opacity);
                                cell.transition("attrs/" + type, {
                                  "r": cell.r,
                                  "opacity": 0
                                }, {
                                  delay: 0,
                                  duration: 1500,
                                  valueFunction: function(start, end) {
                                    return function(time) {
                                      return {
                                        "r": start["r"] + (end["r"] - start["r"]) * time,
                                        "opacity": start["opacity"] - (start["opacity"]) * time
                                      };
                                    };
                                  }
                                });
                              };
                              if(stateId) {
                                if(state < 0) state = 0;
                                var colorAry = [color, "#25bce7", "#e1cd0a", "#ed9700", "#e7675d"];
                                if(stateId == "number:2") {
                                  type = "text";
                                }
                                if(type) {
                                  if(!cell.opacity) {
                                    cell.opacity = jQuery.isNumeric(cell.prop("attrs/" + type + "/opacity")) ? cell.prop("attrs/" + type + "/opacity") : 1;
                                    cell.r = cell.prop("attrs/" + type + "/r");
                                    cell.prop("attrs/" + type + "/opacity", opacityState ? 1 : cell.opacity);
                                  }
                                  cell.state = state;
                                  cell.prop("attrs/" + type + "/fill", colorAry[state]);
                                  if(cell.state > 0) {
                                    if(_.contains(cell.getTransitions(), "attrs/" + type)) return;
                                    cell.on("transition:end", function(el) {
                                      if(el.state > 0) {
                                        flash();
                                      } else {
                                        cell.prop("attrs/" + type + "/opacity", cell.opacity);
                                        cell.prop("attrs/" + type + "/r", cell.r);
                                      }
                                    });
                                    flash();
                                  } else {
                                    cell.prop("attrs/" + type + "/opacity", cell.opacity);
                                    cell.prop("attrs/" + type + "/r", cell.r);
                                  }
                                }
                              }
                            };
                            var changeIconAndText = function(cell, state, type) {
                              if(!type) type = "alertConfig";
                              if(type == "alertConfig") {
                                var alertIcon = cell.get("alertIcon");
                                if(alertIcon) {
                                  if(state < 1) state = 0;
                                  var alertConfig = cell.get(type);
                                  alertConfig.forEach(function(item) {
                                    if(item.id == state) {
                                      if(item.alertText)
                                        cell.prop("attrs/text/text", item.alertText);
                                      if(item.alertIcon)
                                        cell.prop("attrs/image/xlink:href", item.alertIcon);
                                    }
                                  });
                                }
                              } else if(type == "valueConfig") {
                                var valueConfig = cell.get(type);
                                valueConfig.forEach(function(item) {
                                  item.stateDisplay = false;
                                  if(item.valueText == state) {
                                    item.stateDisplay = true;
                                    if(item.valueText)
                                      cell.prop("attrs/text/text", item.valueText);
                                    if(item.valueIcon)
                                      cell.prop("attrs/image/xlink:href", item.valueIcon);
                                  }
                                });
                              }
                            };
                            var getFill = function(obj) {
                              var rs = {};
                              for(var i in obj) {
                                rs = obj[i];
                                break;
                              }
                              return rs.fill;
                            };
                            var getType = function(type) {
                              if(type == "basic.Rect") {
                                return "rect";
                              } else if(type == "basic.Circle") {
                                return "circle";
                              }
                            };
                            var getTextFill = function(obj) {
                              return obj["text"]["fill"];
                            };
                            var getAllUnit_success = function(data) {
                              var extend = elDom.get("extend");
                              if(extend == "alert" && findState) {
                                changeIconAndText(elDom, findState.value);
                              } else if(extend == "value" && find) {
                                changeIconAndText(elDom, find.value, "valueConfig");
                                 var rangeObj;
                                 var rangeAry;
                                 if(elDom.resourceObj.modelId) {
                                   rangeObj = resourceUIService.$attr("rootModelsDic/" + elDom.resourceObj.modelId + "/kpiDic/" + find.kpiCode + "/rangeObj");
                                   rangeAry = resourceUIService.$attr("rootModelsDic/" + elDom.resourceObj.modelId + "/kpiDic/" + find.kpiCode + "/rangeAry");
                                   find.valueStr = (rangeObj && rangeObj[find.value]) ? rangeObj[find.value] : find.value;
                                   if(elDom.attributes["animateType"] && elDom.attributes["animateType"] != "number:0") 
                                     pathAnimate(elDom, find.value, elDom.attributes["animateType"],rangeAry)
                                 }
                              } else if(extend == "level" && find) {
                                setLevel(elDom, find.value);
                              } else if(extend == "angle" && find) {
                                setOpenAngle(elDom, find.value, cell);
                              } else {
                                if(findState) {
                                  var stateType = cell["stateType"];
                                  if(stateType == "number:1") {
                                    breathFlash(elDom, getType(cell["type"]), getFill(cell["attrs"]), findState.value, false);
                                  } else if(stateType == "number:2") {
                                    bubbleFlash(elDom, getType(cell["type"]), getFill(cell["attrs"]), findState.value, false);
                                  } else if(stateType == "number:3") {
                                    breathFlash(elDom, getType(cell["type"]), getFill(cell["attrs"]), findState.value, true);
                                  } else if(stateType == "number:4") {
                                    bubbleFlash(elDom, getType(cell["type"]), getFill(cell["attrs"]), findState.value, true);
                                  } else {
                                    fillColor(elDom, getType(cell["type"]), getFill(cell["attrs"]), findState.value, getTextFill(cell["attrs"]));
                                  }
                                }
                                if(find) {
                                  var allUnits = data;
                                  var unit = allUnits.find(function(elem) {
                                    if(cell.kpiObj)
                                      return elem.unitCode == cell.kpiObj.unit;
                                    else
                                      return "";
                                  });
                                  var unitType = false;
                                  if(elDom.get("unitType")) {
                                    unitType = elDom.get("unitType").split("number:")[1] == 1;
                                  }
                                  var rangeObj;
                                  var rangeAry;
                                  if(cell.resourceObj.modelId) {
                                    rangeObj = resourceUIService.$attr("rootModelsDic/" + cell.resourceObj.modelId + "/kpiDic/" + find.kpiCode + "/rangeObj");
                                    rangeAry = resourceUIService.$attr("rootModelsDic/" + cell.resourceObj.modelId + "/kpiDic/" + find.kpiCode + "/rangeAry");
                                    find.valueStr = (rangeObj && rangeObj[find.value]) ? rangeObj[find.value] : find.value;

                                    if(cell.attributes["animateType"] && cell.attributes["animateType"] != "number:0") 
                                      pathAnimate(cell, find.value, cell.attributes["animateType"],rangeAry)
                                  }

                                  if(unit && unitType) {
                                    elDom.prop("attrs/text/text", find.valueStr + "" + unit.unitName);
                                  } else {
                                    elDom.prop("attrs/text/text", find.valueStr);
                                  }
                                  // var y = elDom.attributes.position.y;
                                  // elDom.prop("position/y", y);
                                }
                              }
                            };
                            var error = function(err) {
                              elDom.prop("attrs/text/text", find.value);
                            };
                            serviceCenterService.units.getAll().then(getAllUnit_success, error);
                          };
                          createData(find);
                        }
                      }
                    };
                    data.forEach(function(returnData) {
                      if(returnData.kpiCode == 999999) { //节点告警状态处理
                        if(cellsDic[returnData.nodeId]) { //已经存在的节点
                          cellsDic[returnData.nodeId].forEach(function(cell) {
                            if(cell.state != returnData.value) {
                              var showEffect = true;
                              if(cell["kpiId"] && cell["kpiId"] != "number:0") {
                                if(returnData.instance) {
                                  if("number:" + returnData.instance != cell["kpiId"]) {
                                    showEffect = false;
                                  }
                                } else {
                                  showEffect = false;
                                }
                              } else {
                                if(returnData.instance) {
                                  showEffect = false;
                                }
                              }
                              if(!showEffect) return;
                              loop(cell, null, returnData);
                            }
                          });
                        } else {
                          json.cells.forEach(function(cell) {
                            if(cell["nodeId"]) {
                              var nodeIdAry = cell["nodeId"].split(":");
                              if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] == returnData.nodeId) {
                                if(!cellsDic[returnData.nodeId]) cellsDic[returnData.nodeId] = [];
                                cellsDic[returnData.nodeId].push(cell);
                                var showEffect = true;
                                if(cell["kpiId"] && cell["kpiId"] != "number:0") {
                                  if(returnData.instance) {
                                    if("number:" + returnData.instance != cell["kpiId"]) {
                                      showEffect = false;
                                    }
                                  } else {
                                    showEffect = false;
                                  }
                                } else {
                                  if(returnData.instance) {
                                    showEffect = false;
                                  }
                                }
                                if(!showEffect) return;
                                loop(cell, null, returnData);
                              }
                            }
                          });
                        }
                      } else {
                        if(cellsDic[returnData.nodeId + "_" + returnData.kpiCode]) {
                          cellsDic[returnData.nodeId + "_" + returnData.kpiCode].forEach(function(cellObj) {
                            loop(cellObj, returnData, null);
                          });
                        } else {
                          graph.getCells().forEach(function(cell) {
                            /** 考虑的组态内变量被负值的情况用cell.resourceObj.id来判断*/
                            if(cell.$attr("resourceObj/id") == returnData.nodeId) {
                              if(cell["kpiId"] || cell.$attr("kpiObj/id")) {
                                if(cell["kpiId"]) {
                                  var kpiIdAry = cell["kpiId"].split(":");
                                }
                                if(cell.$attr("kpiObj/id")) {
                                  var kpiIdAry = [cell.$attr("kpiObj/id")];
                                }
                                if(kpiIdAry.length > 0 && kpiIdAry[kpiIdAry.length - 1] == returnData.kpiCode) {
                                  if(cellsDic[returnData.nodeId + "_" + returnData.kpiCode] == undefined) {
                                    cellsDic[returnData.nodeId + "_" + returnData.kpiCode] = [];
                                  }
                                  cellsDic[returnData.nodeId + "_" + returnData.kpiCode].push(cell);
                                  loop(cell, returnData, null);
                                }
                              }
                            }
                            /**
                            if(cell["nodeId"]) {
                              var nodeIdAry = cell["nodeId"].split(":");
                              console.log(cell.resourceObj.id == returnData.nodeId);
                              if(nodeIdAry.length > 0 && nodeIdAry[nodeIdAry.length - 1] == returnData.nodeId) {
                                if(!cellsDic[returnData.nodeId + "_" + returnData.kpiCode]) cellsDic[returnData.nodeId + "_" + returnData.kpiCode] = [];
                                if(cell["kpiId"]) {
                                  var kpiIdAry = cell["kpiId"].split(":");
                                  if(kpiIdAry.length > 0 && kpiIdAry[kpiIdAry.length - 1] == returnData.kpiCode) {
                                    cellsDic[returnData.nodeId + "_" + returnData.kpiCode].push(cell);
                                    console.log("loop");
                                    loop(cell, returnData, null);
                                  }
                                }
                              }
                            }*/
                          });
                        }
                      }
                    });
                  };
                  //获得设备的告警状态，包括实例
                  kpiDataService.getRealTimeKpiData(nodes, [999999], function(returnObj) {
                    if(returnObj.code == 0) {
                      getData_success(returnObj.data);
                    }
                  }, true);
                  //获得设备的数据
                  kpiDataService.getRealTimeKpiData(nodes, kpis, function(returnObj) {
                    if(returnObj.code == 0) {
                      getData_success(returnObj.data);

                      setTimeout(function() {
                        startSocket()
                      },2000)
                    }
                  });

                  function startSocket() {
                    //加入节点告警状态
                    kpis.push(999999);
                    var paramSocket = {
                      ciid: nodes.toString(),
                      kpi: kpis.toString()
                    };
                    var operation = "register";
                    SwSocket.register(uuid, operation, function(event) {
                      var dis = $(topo[0].parentNode).css('display');
                      if (dis != "none") {
                        getData_success([event.data]);
                      }
                    });
                    SwSocket.send(uuid, operation, "kpi", paramSocket);
                  }

                  if(events["$loadCiKpiComplete"]) {
                    events["$loadCiKpiComplete"](graph.getCells());
                  }
                  element.trigger("$loadCiKpiComplete", graph.getCells());
                });
                $("g.marker-vertices").attr("display", "none");
                $("g.marker-arrowheads").attr("display", "none");
                $("g.link-tools").attr("display", "none");
                /**
                 * PROMETHEUS-586
                 * 注销scope时注销方法heartBeat，回调函数callback
                 */
                $("#free-board").on("naviClick", function() {
                  console.log("on-destroy");
                  SwSocket.unregister(uuid);
                });
              }
            });
          };
          $$.loadExternalJs(["rappid-joint", "lodash", "backbone"], callback);
        } else {
          var warning = $("<p>视图不存在!</p>");
          warning.css({
            "min-height": "300px",
            "text-align": "center",
            "line-height": "300px"
          });
          topo.append(warning);
        }
      };
      if(inputJson) {
        json = inputJson;
        run(json);
      } else {
        self.getViewById(viewId, function(view) {
          json = JSON.parse(view.content);
          run(json);
        });
      }
    };
    
    delete element.self;
    topo.css("width", "100%");
    topo.css("background-position", "top");
    topo.css("background-size", "contain");
    expression = expression ? expression : {};
    var initEvent = expression.$attr("on/init");
    var clickEvent = expression.$attr("on/click");
    var wholeClickEvent = expression.$attr("on/wholeClick");
    if(element.style) {
      topo.css(element.style);
    }
    if(typeof initEvent == "function") {
      try {
        initEvent({
          target: self,
          self: self,
          global: global,
          tools: elemData
        });
      } catch(e) {
        console.log(e);
      }
    } else {
      self.render(json);
    }
    topo.on("click", function(event) {
      if(typeof wholeClickEvent == "function") {
        try {
          wholeClickEvent({
            target: self,
            global: global
          });
        } catch(e) {
          console.log(e);
        }
      }
    });
    return topo;
  };
});