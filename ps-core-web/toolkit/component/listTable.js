/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(commonMethod) {
  return function(data) {
    var alertView;
    var elemData = data;
    var element = data.element;
    var SwSocket = data.SwSocket;
    var previewMode = data.previewMode;
    var alertService = data.alertService;
    var timeout = data.timeout;
    var serviceCenterService = data.serviceCenterService;
    var resourceUIService = data.resourceUIService;
    var ticketTaskService = data.ticketTaskService;
    var projectUIService = data.projectUIService;
    var kpiDataService = data.kpiDataService;
    var window = data.window;
    var fun = element.advance.getfunction;
    var $controller = data.route.current.$$route.controller;
    var global = data.global;
    var condition;
    element.getParameter = function(str) {
      if(elemData.routeParam.parameter) {
        var all = JSON.parse(elemData.routeParam.parameter);
        var param = all[all.length - 1];
        return param.$attr(str);
      } else {
        return null;
      }
    };
    Object.defineProperty(element, "dataSource", {
      enumerable : false
    });
    $$.runExpression(element.advance.condition, function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        if(typeof fnResult == 'function') {
          condition = fnResult(data);
        } else {
          if(Array.isArray(fnResult)) {
            for(key in fnResult[0]) {
              var fnResultAry = fnResult[0][key].split("::");
              if(fnResultAry.length > 1) {
                fnResult[0][key] = eval(fnResultAry[0]).apply(null, [fnResultAry[1]]);
              }
            }
          }
          condition = fnResult;
        }
        condition = condition ? condition : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    element.getWarningsByProjectId = function(projectId, callback) {
      resourceUIService.getResourceById(projectId, function(event) {
        if(event.code == 0) {
          var project = event.data;
          var domains = project.domains;
          alertService.queryFromDb({ domain: domains }, function(event) {
            if(event.code == 0) {
              callback(event.data);
            }
          })
        }
      })
    };

    element.getDirectivesByTypeAndRole = function(viewType, resourceType, resourceId, callback) {
      var ids = {};
      element.getManagedViewsByTypeAndRole(viewType, resourceType, resourceId, function(view) {
        var json = JSON.parse(view.content);
        json.cells.forEach(function(cell) {
          if(cell.directiveIds) {
            cell.directiveIds.forEach(function(dirctiveId) {
              if(typeof dirctiveId == "string")
                ids[dirctiveId.split(":")[1]] = true;
              else
                ids[dirctiveId] = true;
            })
          }
        });
        element.getDirectivesByModelId(resourceId, function(event) {
          var resources = [];
          event.forEach(function(dir) {
            if(ids[dir.id]) resources.push(dir);

          })
          resources.sort(doubleCompare(["values","index"],"desc"));
          callback(resources);
        });
      });
    };

    element.getResourcesByProjectId = function(projectId, callback) {
      resourceUIService.getDevicesByCondition({ projectId: projectId }, function(event) {
        if(event.code == 0) {
          callback(event.data);
        }
      })
    };

    element.getDirectivesByModelId = function(modelId, callback) {
      resourceUIService.getDirectivesByModelId(modelId, function(event) {
        if(event.code == 0) {
          callback(event.data);
        }
      })
    };

    var innerContent = $("<table></table>").addClass("table table-hover");
    /**
     * how to set up a expression.
     * expression = {
     *  on : {
     *    click : function(row){
     *    }
     *  },
     *  format : [
     *    {
     *      label : "label",
     *      value : "{item:label}"
     *      type : "text",
     *      on : {
     *        click : function(item){
     *
     *        }
     *      }
     *    }
     *  ]
     * }
     **/
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        if(typeof fnResult == 'function') {
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    var emptyMsg = expression.emptyMsg;
    var header = $('<thead></thead>');
    var tbody = $("<tbody></tbody>");
    var tr = $("<tr></tr>");
    var q = data.q;
    var getValue = function(val) {
      return "item." + val;
    };
    var getRandom = function(val) {
      var regExp = /\((\d+),(d+\))/;
      var min = $$.runRegExp(val, regExp, 1);
      var max = $$.runRegExp(val, regExp, 2);
      return parseInt(Math.random() * 100) + "";
    };
    var getAlertView = function(val) {
      var defer = q.defer();
      var viewLoaded = function(data) {
        alertView = data.find(function(element) {
          return element.viewType == 'configAlert';
        });
        defer.resolve("alertView." + val);
      };
      serviceCenterService.views.getAll().then(viewLoaded);
      return defer.promise;
    };
    var regExps = [{
      regExp: /\{item\:(.*)\}/,
      explainer: getValue
    }, {
      regExp: /\{random\:(.*)\}/,
      explainer: getRandom
    }, {
      regExp: /\{alertView\:(.*)}/,
      explainer: getAlertView
    }];
    var addEvents = function(dom, index, events, ui) {
      var addEvent = function(event, handler) {
        if(previewMode) {
          if($controller != "freeBoardCtrl") {
            dom.css("cursor", "pointer");
          };
          if($controller != "freeBoardCtrl" || expression.event) {
            dom.on(event, function(evt) {
              handler({
                $index: index,
                jquery: evt,
                global: global,
                tools: data,
                ui: element,
                target : element,
                data: ui
              })
            });
          };
        }
      };
      for(var i in events) {
        addEvent(i, events[i]);
      };
    };
    var calculeExp = function(str, item) {
      var defer = q.defer();
      if(typeof str == "string") {
        var defers = [];
        var loop = function(item) {
          var defer = q.defer();
          var regExp = item.regExp;
          var explainer = item.explainer;
          var val = $$.runRegExp(str, regExp, 1);
          var replace = explainer(val);
          if(typeof replace == 'object') {
            var success = function(val) {
              defer.resolve("success");
              str = str.replace(regExp, val);
            };
            replace.then(success)
          } else {
            defer.resolve("success");
            str = str.replace(regExp, replace);
          }
          return defer.promise;
        };
        for(var i in regExps) {
          loop(regExps[i]);
        }
        q.all(defers).then(function(data) {
          var val = eval(str);
          defer.resolve(val);
        });
      } else if(str == undefined) {
        defer.resolve("");
      } else {
        throw new Error(typeof str + " is not a avaliable type");
      }
      return defer.promise;
    };

    element.setFilter = function(obj){
      var rs = element.dataSource.filter(function(elem){
        var re = false;
        var loop = function(key, value){
          if(elem[key].indexOf(value) != -1){
            re = true;
          }
        };
        for(var i in obj){
          loop(i, obj[i])
        }
        return re;
      });
      element.render(rs, true);
    };
    element.render = function(data, filter) {
      if(filter != true){
        element.dataSource = data;
      };
      tbody.children().remove();
      tr.children().remove();
      var createTh = function(item) {
        return $("<th></th>").text(item.name);
      };
      for(var i in expression.format) {
        tr.append(createTh(expression.format[i]))
      };
      var clickFn = expression.$attr("on/click");
      var createContent = function(index, item) {
        var tr = $("<tr></tr>");
        var createTd = function(format) {
          var td = $("<td></td>");
          var createInput = function(item, format) {
            var ipt = $("<input type='text'>").addClass("form-control input-sm");
            return ipt;
          }
          var createButton = function(item, format) {
            var btn = $("<button type='button'>全部发送</button>").addClass("btn btn-default btn-sm");
            btn.on("click", function(event){
              event.stopPropagation();
              if(clickFn){
                clickFn({
                  target : element,
                  clickType : "inline-button",
                  ui : event,
                  data : item
                })
              }
            });
            return btn;
          }
          var createText = function(item, format) {
            var span = $("<span></span>");
            var success = function(value) {
              span.text(value)
            };
            calculeExp(format.value, item).then(success);
            return span;
          };
          var createDate = function(item, format) {
            var span = $("<span></span>");
            var success = function(value) {
              if(value) {
                var style = format.style;
//              var date = new Date(value);
//              var month = date.getMonth() + 1;
//              var year = date.getFullYear();
//              var dt = date.getDate();
//              var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
//              var minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
//              var second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
//              var createTime = year + "-" + month + "-" + dt + "  " + hour + ":" + minute + ":" + second;
                var createTime = useMomentFormat(value,"YYYY-MM-DD HH:mm:ss");
                if(typeof style == "object") {
                  span.css(style);
                }
                span.text(createTime);
              } else {
                span.text("");
              }
            }
            calculeExp(format.value, item).then(success);
            return span;
          };
          var createProgress = function(item, format) {
            var value = calculeExp(format.value);
            var pwrap = $('<div></div>').addClass("progress sm");
            var progress = $('<div></div>').addClass("progress-bar").css("width", value);
            pwrap.append(progress);
            switch(true) {
              case value == 100:
                progress.addClass("progress-bar-aqua");
                break;
              case value > 90:
                progress.addClass("progress-bar-green");
                break;
              case value > 80:
                progress.addClass("progress-bar-yellow");
                break;
              case value > 70:
                progress.addClass("progress-bar-yellow");
                break;
              case value > 60:
                progress.addClass("progress-bar-red");
                break;
              default:
                progress.addClass("progress-bar-danger");
                break;
            }
            return pwrap;
          };
          var createStatus = function(item, format) {
            var span = $("<span></span>").addClass("label label-info");
            var success = function(value) {
              if(value == 0) {
                span.text("新产生").addClass("label-info");
              } else if(value == 5) {
                span.text("已确认").addClass("label-primary");
              } else if(value == 10) {
                span.text("处理中").addClass("label-warning");
              } else if(value == 20) {
                span.text("已解决").addClass("label-success");
              } else {
                span.text("已忽略").addClass("");
              }
              return span;
            };
            calculeExp(format.value, item).then(success);
            return span;
          };
          var createPriority = function(item, format) {
            var span = $("<span></span>").addClass("label");
            var style = format.style;
            var success = function(value) {
              if(value == 1) {
                span.text("警告").addClass("alerts-warning");
              } else if(value == 2) {
                span.text("次要").addClass("alerts-minor");
              } else if(value == 3) {
                span.text("重要").addClass("alerts-major");
              } else if(value == 4) {
                span.text("严重").addClass("alerts-critical");
              }
              return span;
            };
            calculeExp(format.value, item).then(success);
            if(typeof style == "object") {
              span.css(style);
            }
            return span;
          };
          var createMultiCheckList = function(item, format){
            var outer = $("<div></div>").css("position", "relative");
            var wrap = $("<div></div>").addClass("input-group");
            var text = $("<div></div>").addClass("btn btn-default").text(item.name);
            var groupBtn_before = $("<div></div>").addClass("input-group-btn");
            var input = $("<input />").addClass("form-control");
            var groupBtn_after = $("<div></div>").addClass("input-group-btn");
            var icon = $("<span></span>").addClass("glyphicon glyphicon-plus-sign");
            var button1 = $("<button></button>").addClass("btn btn-default");
            var button2 = $("<button></button>").addClass("btn btn-default").text("发送");
            button2.on("click", function(event){
              event.stopPropagation();
              if(clickFn){
                clickFn({
                  target : element,
                  clickType : "outterBtn",
                  ui : event,
                  data : item,
                  value : input.val()
                })
              }
            });
            var ulWrap = $("<div></div>").css("display", "none");
            var ul = $("<ul></ul>").css("width", "auto")
              .css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,.5)")
              .css("border", "1px solid #ddd")
              .css("position", "absolute")
              .css("list-style", "none")
              .css("background-color", "#ddd")
              .css("margin", 0)
              .css("padding", "0px")
              .css("z-index", "99999");
            var windClick;
            var createLi = function(inner){
              var resourceId = element.getParameter("resourceId");
              var kpiId = inner.id;
              var li = $("<li></li>").css("margin", "10px");
              var bg = $("<div></div>").addClass("input-group");
              var gr_bf = $("<div></div>").addClass("input-group-addon");
              var gr_addon = $("<div></div>").addClass("input-group-addon").text("-");
              var gr_af = $("<div></div>").addClass("input-group-btn");
              var text = $("<span></span>").text(inner.label);
              var input = $("<input />").addClass("form-control");
              var button = $("<button></button>").addClass("btn btn-primary").text("发送");
              input.css("min-width", "60px");
              element.getKpiValueCi([resourceId], [kpiId], function(data){
                if(data[0]){
                  gr_addon.text(data[0].value);
                } else {
                  gr_addon.text("-");
                }
              });
              /**
              var socketRun = function(){
                gr_addon.text(30);
                socketCallback({
                  nodeId : resourceId,
                  kpiCode : kpiId,
                  value : 30
                });
                timeout(function(){
                  socketRun();
                },3000)
              };
              socketRun();*/
              var paramSocket = {
                ciid: [resourceId].toString(),
                kpi: [kpiId].toString()
              };
              var uuid = Math.uuid();
              SwSocket.unregister(uuid);
              var operation = "register";
              SwSocket.register(uuid, operation, function(event) {
                gr_addon.text(event.data.value);
              });
              SwSocket.send(uuid, operation, 'kpi', paramSocket);
              input.on("change", function(event){
                inner.$value = input.val();
              });
              button.on("click", function(event){
                windClick();
                event.stopPropagation();
                if(clickFn){
                  clickFn({
                    clickType : "innerBtn",
                    target : element,
                    ui : event,
                    data : item,
                    param : inner,
                    value : input.val()
                  })
                }
              });
              gr_bf.append(text);
              gr_af.append(button);
              bg.append(gr_bf).append(gr_addon).append(input).append(gr_af);
              li.append(bg);
              return li;
            };
            var btnClick;
            ulWrap.on("click", function(event){
              event.stopPropagation();
            });
            windClick = function(event){
              ulWrap.css("display", "none");
              icon.removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
              $("body").off("click.btn");
              timeout(function(){
                button1.on("click.btn", btnClick);
              });
            };
            btnClick = function(event){
              ulWrap.css("display", "block");
              button1.off("click.btn");
              icon.removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
              timeout(function(){
                $("body").on("click.btn", windClick);
              });
            };
            button1.on("click.btn", btnClick);
            for(var i in item.params){
              ul.append(createLi(item.params[i]));
            }
            wrap.append(input);
            wrap.append(groupBtn_after);
            groupBtn_before.append(text);
            button1.append(icon);
            groupBtn_after.append(button1);
            groupBtn_after.append(button2);
            ulWrap.append(ul)
            outer.append(wrap);
            outer.append(ulWrap);
            return outer;
          };
          if(format.type == "text") {
            td.append(createText(item, format))
          } else if(format.type == "date") {
            td.append(createDate(item, format))
          } else if(format.type == "progress") {
            td.append(createProgress(item, format))
          } else if(format.type == "status") {
            td.append(createStatus(item, format))
          } else if(format.type == "priority") {
            td.append(createPriority(item, format))
          } else if(format.type == "input") {
            td.append(createInput(item, format))
          } else if(format.type == "button") {
            td.append(createButton(item, format))
          } else if(format.type == "multiCheckList"){
            td.append(createMultiCheckList(item, format))
          }
          /** get events handler form format value */
          addEvents(td, index, format.on, item);
          return td;
        };
        for(var i in expression.format) {
          tr.append(createTd(expression.format[i]))
        };
        /** get events handler form format value */
        addEvents(tr, index, expression.on, item);
        if(previewMode && expression.$attr("on/click")) {
          if($controller != "freeBoardCtrl") {
            tr.css("cursor", "pointer");
          };
        }
        return tr;
      };
      var createEmpty = function() {
        var tr = $("<tr></tr>");
        var col = expression.format.length;
        var td = $("<td></td>").text("没有符合条件的记录。").attr("colspan", col).css("text-align", "center").css("line-height", "40px");
        tr.append(td);
        return tr;
      };
      if(data.length == 0) {
        if(emptyMsg != false){
          tbody.append(createEmpty())
        };
      } else {
        for(var i = 0; i < data.length; i++) {
          var pass = true;
          if(typeof expression.filter == "function") {
            pass = expression.filter({
              global: global,
              tools: data
            }, data[i]);
          }
          if(pass) {
            tbody.append(createContent(i, data[i]))
          };

        }
      }
    };
    header.append(tr);
    innerContent.css("width", "calc( 100% - 20px)");
    if(element.style) {
      innerContent.css(element.style);
    };
    innerContent.append(header).append(tbody);
    var start = function() {
      var getOption = element.$attr("advance/getListTable");
      if(getOption == "newdevice"){
        element.getLatestDevices(function(devices){
          element.render(devices);
        });
      } else if(getOption == "workorder"){
        element.getTicketsByStatus(function(workorder){
          element.render(workorder);
        });
      } else if(getOption == "allprojects"){
        element.getCurrentProjectsByCustom(function(projects){
          element.render(projects);
        });
      } else if(getOption == "allprojectsbydomain"){
        element.getCurrentProjects(function(projects){
          element.render(projects);
        });
      } else if(getOption == "alert"){
        element.getAlerts(function(workorder){
          element.render(workorder);
        });
      } else if(getOption == "currentDirectiveByDevice"){
        element.currentDirective(function(directives){
          element.render(directives);
        });
      } else if(getOption == "currentAlertByDevice"){
        element.getCurrentAlert(function(alerts){
          element.render(alerts);
        });
      } else if(getOption == "currentAlertByProject"){
        element.getCurrentAlertByProject(function(alerts){
          element.render(alerts);
        });
      }
      /**
      if(fun.indexOf("serviceCenterService") == -1) {
        var success = function(value) {
          if(value == undefined) {
            eval(fun)(function(event) {
              if(event.code == 0 && event.data != null) {
                element.render(event.data);
              }
            });
          } else {
            var applied = function(event) {
              if(event.code == 0 && event.data != null) {
                element.render(event.data);
              }
            }
            if(Array.isArray(value)) {
              value.push(applied)
            } else {
              value = [value, applied];
            }
            try {
              eval(fun).apply(null, value);
            } catch(e) {
              console.log(e);
            }
          }
        };
        var con, exp;
        $$.runExpression(condition, function(funRes) {
          if(funRes.code == "0") {
            var fnResult = funRes.data;
            if(typeof fnResult == 'function') {
              exp = fnResult(data);
            } else {
              exp = fnResult;
            }
            exp = exp ? exp : {};
          } else {
            throw new Error(funRes.message);
          }
        });
        if(typeof exp == "function") {
          con = exp();
        } else {
          con = exp;
        }
        if(con != undefined) {
          if(typeof con == "string") {
            calculeExp(con).then(success);
          } else if(typeof con == "object") {
            var defers = [];
            var traverse = function(attr, target, parent) {
              var loop = function(attr, item, parent) {
                var type = typeof item;
                if(type == "object") {

                  traverse(attr, item, parent);
                } else if(type == "string") {
                  var defer = q.defer();
                  var success = function(value) {
                    parent[attr] = value;
                    defer.resolve("success!");
                  };
                  calculeExp(item).then(success);
                  defers.push(defer.promise);
                } else if(type == "number") {

                } else {

                }
              }
              for(var i in target) {
                loop(i, target[i], target)
              }
            };
            traverse("con", con, window);
            q.all(defers).then(function(data) {
              success(con);
            });
          } else if(typeof con == "number") {
            success(con);
          }
        } else {
          success();
        }
      } else {
        eval(fun + "()").then(callback);
      };*/
    };
    var initFn = expression.$attr("on/init")
    if(typeof initFn == "function") {
      initFn({
        target : element,
        self: element,
        global: global,
        tools: elemData
      })
    } else {
      start();
    }

    return innerContent;
  }
});