/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod', 'configs'], function(commonMethod) {
  return function(data) {
    var table;
    var tableFormat;
    var alertView;
    var elemData = data;
    var route = data.route;
    var element = data.element;
    var SwSocket = data.SwSocket;
    var previewMode = data.previewMode;
    var alertService = data.alertService;
    var userLoginUIService = data.userLoginUIService;
    var growl = data.growl;
    var serviceCenterService = data.serviceCenterService;
    var dictionaryService = data.dictionaryService;
    var resourceUIService = data.resourceUIService;
    var ticketTaskService = data.ticketTaskService;
    var projectUIService = data.projectUIService;
    var kpiDataService = data.kpiDataService;
    var window = data.window;
    var fun = element.advance.getfunction;
    var getOption = element.$attr("advance/getListTable");
    var global = data.global;
    var condition;
    var dirdevices = null;
    var listbottom = element.$attr("parameters/listbottom");
    var col = element.$attr("parameters/col") || 1;
    var pageSize = element.$attr("parameters/pageSize");
    Object.defineProperty(element, "dataSource", {
      enumerable : false
    });
    var wrap = $("<div></div>");
    wrap.css("width", "100%");
    wrap.css("overflow", "auto");
    var innerContent = $("<table></table>").addClass("table table-hover");
    var expression;
    wrap.append(innerContent);
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
        expression = {};
        console.log("advance/expression:"+element.$attr("advance/expression"));
      }
    });
    var format = expression.format;
    var q = data.q;
    element.setFilter = function(obj){

    };
    element.setFormat = function(fmt){
      format = fmt;
    };
    element.render = function(data) {
      $$.loadExternalJs(['datatables.net', 'datatables.net-bs', 'datatables.net-select'], function(dataTable){
        setTimeout(function(){
          var columns = [];
          var columnDefs = [];
          var windClick;
          var loopformat = function(inx, colInx, fmtInx, fmt){
            columns.push({
              data : colInx != 0 ? (fmt.value + "_$" + colInx) : fmt.value,
              title : fmt.name,
              render : function(data, type, full) {
                var dt = data;
                var type = fmt.type;
                var createText = function(item){
                  var nodeId = element.getParameter("resourceId");
                  var appendix = "";
                  if(colInx != 0){
                    appendix = "_$" + colInx
                  }
                  var kpiId = item['params' + appendix] ? item['params' + appendix][0].id : '';
                  var wrap = $("<div></div>");
                  var span = $("<span></span>");
                  span.attr("fmtInx", fmtInx);
                  if(fmt.websocket == true){
                    span.attr("webSocket", nodeId + "," + kpiId);
                  };
                  var style = fmt.style;
                  if(style){
                    span.css(style);
                  }
                  span.text(data || "-");
                  wrap.append(span)
                  return wrap.html();
                };
                var createlink = function(){
                  var wrap = $("<div></div>");
                  var a = $("<a></a>").text(data || "");
                  a.attr("fmtInx", fmtInx);
                  a.css("text-decoration", "underline");
                  a.css("cursor", "pointer");
                  wrap.append(a);
                  return wrap.html();
                };
                var createButton = function(item){
                  var wrap = $("<div></div>");
                  var button = $("<button></button>").addClass("btn btn-primary").text("全部发送").attr("id", "sentAllCommand_" + item.id);
                  button.attr("fmtInx", fmtInx);
                  $("button[id*=sentAllCommand_" + item.id + "]").on("click", function(event){
                    event.stopPropagation();
                    var params = {};
                    for(var i in full.params){
                      params[item.params[i].label] = item.params[i].$value;
                    }
                    element.sendItemDirByValue(full.id, params);
                  });
                  wrap.append(button);
                  return wrap.html();
                };
                var createProgress = function() {
                  var wrap = $("<div></div>");
                  var pwrap = $('<div></div>').addClass("progress sm");
                  pwrap.attr("fmtInx", fmtInx);
                  var progress = $('<div></div>').addClass("progress-bar").css("width", data || 0);
                  pwrap.append(progress);
                  switch(true) {
                    case data == 100:
                      progress.addClass("progress-bar-aqua");
                      break;
                    case data > 90:
                      progress.addClass("progress-bar-green");
                      break;
                    case data > 80:
                      progress.addClass("progress-bar-yellow");
                      break;
                    case data > 70:
                      progress.addClass("progress-bar-yellow");
                      break;
                    case data > 60:
                      progress.addClass("progress-bar-red");
                      break;
                    default:
                      progress.addClass("progress-bar-danger");
                      break;
                  };
                  wrap.append(pwrap);
                  return wrap.html();
                };
                var createDirectiveInput = function(item, format){
                  var appendix = "";
                  if(colInx != 0){
                    appendix = "_$" + colInx
                  }
                  var w = $("<div></div>");
                  var outer = $("<div></div>").css("position", "relative");
                  var wrap = $("<div></div>").addClass("input-group");
                  var text = $("<div></div>").addClass("btn btn-default").text(item.name);
                  var groupBtn_before = $("<div></div>").addClass("input-group-btn");
                  var input = $("<input />").addClass("form-control").attr("id", "inputAll_" + full["id" + appendix]);
                  var groupBtn_after = $("<div></div>").addClass("input-group-btn");
                  var icon = $("<span></span>").addClass("glyphicon glyphicon-plus-sign").attr("id", "icon_" + full["id" + appendix]);
                  var button1 = $("<button></button>").addClass("btn btn-default").attr("id", "plusBtn_" + full["id" + appendix]);
                  var button2 = $("<button></button>").addClass("btn btn-default").text("发送").attr("id", "sendBtnAll_" + full["id" + appendix]);
                  $("button[id*=sendBtnAll_" + full["id" + appendix] +"]").on("click", function(event){
                    event.stopPropagation();
                    var params = {};
		    //发送指令重复问题解决  tangyaqin
                    for(var i in item.params){
                      params[item["params" + appendix][i]["name"]] = $("input[id*=inputAll_" + full["id" + appendix] + "]").val();
                    }
                    element.sendItemDirByValue(full["id" + appendix], params);
                    /**
                     if(clickFn){
                      clickFn({
                        target : element,
                        clickType : "outterBtn",
                        ui : event,
                        data : item,
                        value : input.val()
                      })
                    }*/
                  });
                  var ulWrap = $("<div></div>").attr("id", "ulWrap_" + full["id" + appendix]).css("display", "none");
                  var ul = $("<ul></ul>").css("width", "auto")
                    .css("box-shadow", "1px 1px 10px 1px rgba(0,0,0,.5)")
                    .css("border", "1px solid #ddd")
                    .css("position", "absolute")
                    .css("list-style", "none")
                    .css("background-color", "#ddd")
                    .css("margin", 0)
                    .css("padding", "0px")
                    .css("z-index", "99999");
                  var createLi = function(inner){
                    var resourceId = element.getParameter("resourceId");
                    var kpiId = inner.id;
                    var li = $("<li></li>").css("margin", "10px");
                    var bg = $("<div></div>").addClass("input-group");
                    var gr_bf = $("<div></div>").addClass("input-group-addon");
                    var gr_addon = $("<div></div>").attr("id", "add_" + inner.id).addClass("input-group-addon").text("-");
                    var gr_af = $("<div></div>").addClass("input-group-btn");
                    var text = $("<span></span>").text(inner.label);
                    var input = $("<input />").addClass("form-control").attr("id", "input_" + inner.id);
                    var button = $("<button></button>").addClass("btn btn-primary").text("发送").attr("id", "sendBtn_" + inner.id);
                    input.css("min-width", "60px");
                    element.getKpiValueCi([resourceId], [kpiId], function(data){
                      $("[id*=add_" + inner.id + "]").text(data[0].value)
                    });
                    var paramSocket = {
                      ciid: [resourceId].toString(),
                      kpi: [kpiId].toString()
                    };
                    var uuid = Math.uuid();
                    SwSocket.unregister(uuid);
                    var operation = "register";
                    SwSocket.register(uuid, operation, function(event) {
                      $("[id*=add_" + inner.id + "]").text(event.data.value);
                    });
                    SwSocket.send(uuid, operation, 'kpi', paramSocket);
                    $("input[id*=input_" + inner.id).on("change", function(event){
                      inner.$value = $(this).val();
                    });
                    $("input[id*=input_" + inner.id).on("click", function(event){
                      event.stopPropagation();
                    });
                    $("button[id*=sendBtn_" + inner.id).on("click", function(event){
                      windClick();
                      event.stopPropagation();
                      var inputVal = $("input[id*=input_" + inner.id).val();
                      var params = {};
                      params[inner.name] = inputVal;
                      element.sendItemDirByValue(full.id, params);
                    });
                    gr_bf.append(text);
                    gr_af.append(button);
                    bg.append(gr_bf).append(gr_addon).append(input).append(gr_af);
                    li.append(bg);
                    return li;
                  };
                  var btnClick;
                  $("div[id*=ulWrap_" + full["id" + appendix] +"]").on("click", function(event){
                    event.stopPropagation();
                  });
                  var appendix = ""
                  if(colInx != 0){
                    appendix = "_$" + colInx;
                  }
                  for(var i in item["params" + appendix]){
                    ul.append(createLi(item["params" + appendix][i]));
                  }
                  outer.attr("fmtInx", fmtInx);
                  wrap.append(input);
                  wrap.append(groupBtn_after);
                  groupBtn_before.append(text);
                  button1.append(icon);
                  groupBtn_after.append(button1);
                  groupBtn_after.append(button2);
                  ulWrap.append(ul)
                  outer.append(wrap);
                  outer.append(ulWrap);
                  w.append(outer);
                  return w.html();
                };
                var createDirectiveSingle = function(item, format){
                  var nodeId = element.getParameter("resourceId");
                  var appendix = "";
                  if(colInx != 0){
                    appendix = "_$" + colInx
                  }
                  if(item['params' + appendix]){
                    var kpiId = item['params' + appendix][0].id;
                    var w = $("<div></div>");
                    var valueAddon = $('<span></span>');
                    var outer = $("<div></div>").css("position", "relative");
                    var wrap = $("<div></div>").addClass("input-group");
                    var text = $("<div></div>").addClass("btn btn-default").text(item.name);
                    var groupBtn_before = $("<div></div>").addClass("input-group-btn");
                    var input = $("<input />").addClass("form-control").attr("id", "inputAll_" + full["id" + appendix]);
                    var groupBtn_after = $("<div></div>").addClass("input-group-btn");
                    var button2 = $("<button></button>").addClass("btn btn-primary").text("发送").attr("id", "sendBtnAll_" + full["id" + appendix]);
                    var ulWrap = $("<div></div>").attr("id", "ulWrap_" + full["id" + appendix]).css("display", "none");
                    var appendix = ""
                    if(colInx != 0){
                      appendix = "_$" + colInx;
                    };
                    input.attr("webSocket", nodeId + "," + kpiId);
                    outer.attr("fmtInx", fmtInx);
                    valueAddon.addClass("input-group-addon");
                    valueAddon.text("500");
                    wrap.css("width", "100%");
                    wrap.append(input);
                    wrap.append(groupBtn_after);
                    groupBtn_before.append(text);
                    groupBtn_after.append(button2);
                    outer.append(wrap);
                    outer.append(ulWrap);
                    w.append(outer);
                    return w.html();
                  } else {
                    return "";
                  };
                };
                var createStatus = function() {
                  //var span = $("<span></span>").addClass("label label-info");
                  var wrap = $("<div></div>");
                  var span = $("<span></span>").addClass("label");
                  span.attr("fmtInx", fmtInx);
                  if(data == 0) {
                    span.text("新产生").addClass("label-info");
                  } else if(data == 5) {
                    span.text("已确认").addClass("label-primary");
                  } else if(data == 10) {
                    span.text("处理中").addClass("label-warning");
                  } else if(data == 20) {
                    span.text("已解决").addClass("label-success");
                  } else {
                    span.text("已忽略").addClass("");
                  }

                  //calculeExp(format.value, item).then(success);
                  //return span;
                  wrap.append(span);
                  return wrap.html();
                };
                var createPriority = function() {
                  var wrap = $("<div></div>");
                  var span = $("<span></span>").addClass("label");
                  span.attr("fmtInx", fmtInx);
                  if(data == 1) {
                    span.text("警告").addClass("alerts-warning");
                  } else if(data == 2) {
                    span.text("次要").addClass("alerts-minor");
                  } else if(data == 3) {
                    span.text("重要").addClass("alerts-major");
                  } else if(data == 4) {
                    span.text("严重").addClass("alerts-critical");
                  } else {
                    span.text("正常").addClass("alerts-normal").css("background-color", "#2eb473");
                  }
                  wrap.append(span);
                  return wrap.html();
                };
                // 报警来源
                var createAlarmSource = function() {
                  var wrap = $("<div></div>");
                  var span = $("<span></span>").addClass("label");
                  span.attr("fmtInx", fmtInx);
                  if(data == 1) {
                    span.text("在线预警").addClass("alerts-major");
                  } else if(data == 2) {
                    span.text("智能诊断").addClass("alerts-minor");
                  } else if(data == 3) {
                    span.text("大数据分析").addClass("alerts-warning");
                  } else if(data == 4) {
                    span.text("离线诊断").addClass("alerts-critical");
                  }
                  wrap.append(span);
                  return wrap.html();
                };
                var createDate = function(){
                  var wrap = $("<div></div>");
                  var span = $("<span></span>");
                  span.attr("fmtInx", fmtInx);
                  var style = fmt.style;
                  if(style){
                    span.css(style);
                  };
                  span.css("display", "inline-block");
                  if(data){
                    span.text(useMomentFormat(data, GetDateCategoryStrByLabel("年月日时分秒")));
//                  span.text(new Date(data).FormatByString("年月日时分秒"));
                  } else {
                    span.text("-");
                  }
                  wrap.append(span);
                  var html = wrap.html();
                  return html;
                };
                if(type == "text"){
                  return createText(full);
                } else if(type == "date"){
                  return createDate();
                } else if(type == "link"){
                  return createlink();
                } else if(type == "progressbar") {
                  return createProgress()
                } else if(type == "status") {
                  return createStatus();
                } else if(type == "priority") {
                  return createPriority()
                } else if(type == "button") {
                  return createButton(full);
                } else if(type == "alarmSource") {
                  return createAlarmSource(full);
                } else if(type == "directiveSingle") {
                  return createDirectiveSingle(full, fmt);
                } else if(type == "directiveInput") {
                  return createDirectiveInput(full, fmt);
                } else {
                  return createText();
                };
              }
            });
            columnDefs.push({
              targets : inx,
              global : global,
              data : colInx != 0 ? (fmt.value + "_$" + colInx) : fmt.value
            })
          };
          var seperateToArray = function(data){
            var rs = [];
            var inx = 1;
            var obj = {};
            var sepData = function(inx){
              var obj = {};
              var appendix = "_$" + inx;
              var fd = false;
              for(var i in data){
                if(i.indexOf(appendix) != -1){
                  obj[i.split("_$")[0]] = data[i];
                  fd = true;
                }
              }
              if(fd){
                rs.push(obj);
                inx++;
                sepData(inx);
              }
            };
            for(var i in data){
              if(i.indexOf("_$") == -1){
                obj[i] = data[i];
              }
            }
            rs.push(obj);
            sepData(inx);
            return rs;
          };
          var loopCol = function(inx){
            for(var i in format){
              loopformat(((inx * format.length) + parseInt(i)), inx, i, format[i]);
            };
          };
          for(var i = 0; i < col; i ++){
            loopCol(i)
          };
          var rowCallback = function(row, data, index){
            var dt = seperateToArray(data);
            $(row).children().each(function(){
              var curDom = $(this).children();
              if(curDom.size() > 0){
                var fmtInx = curDom.attr("fmtInx");
                var type = format[fmtInx].type;
                var directiveSingleCallback = function(){
                  var input = curDom.find("input");
                  var button = curDom.find("button");
                  var id = input.attr("id").split("inputAll_")[1];
                  var find = dt.find(function(elem){
                    return elem.id == id;
                  });
                  var changeFn = format[fmtInx].$attr("on/change");
                  input.val(find.value);
                  input.on("change", function(event){
                    if(typeof changeFn == "function"){
                      changeFn({
                        target : element,
                        data : find,
                        value : input.val()
                      })
                    }
                  });
                  button.on("click", function(event){
                    var dirname = find.params[0].name;
                    var directiveId = find.id;
                    var val = input.val()
                    var params = {};
                    params[dirname] = val;
                    var resourceId = element.getParameter("resourceId");
                    element.sendDirective(resourceId, directiveId, params, function(event){
                      console.log(event);
                    });
                  });
                }
                if(type == "directiveSingle"){
                  directiveSingleCallback();
                };
              }
            });
            $(row).off("click");
            $(row).on("click", function(event){
              innerContent.find("tr").removeClass("selected");
              $(row).addClass("selected");
              var clickFn = expression.$attr("on/click");
              if(clickFn){
                clickFn({
                  target : element,
                  global : global,
                  data : data
                })
              };
            });
          };
          var rearrangeByCol = function(data){
            var rs = [];
            var extend = function(obj, item){
              for(var i in item){
                obj[i] = item[i];
              };
            };
            var clone = function(data, inx){
              var result = {};
              for(var i in data){
                var offset = inx != 0 ? "_$" + inx : "";
                result[i + offset] = data[i];
              }
              return result;
            };
            var loop = function(inx, item){
              var ix = Math.floor(inx / col);
              var ic = inx % col
              if(!rs[ix]){
                rs[ix] = {}
              };
              extend(rs[ix], clone(item, ic));
            };
            for(var i in data){
              loop(i, data[i])
            };
            return rs;
          };
          var rData = rearrangeByCol(data);
          var domTxt = "";
          if(listbottom == "standard"){
            domTxt = $.ProudSmart.datatable.footerdom;
          } else if(listbottom == "none"){
            domTxt = "";
          } else if(listbottom == "pageAndTotal"){
            domTxt = '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-4"l><"col-lg-8"p>>';
          } else if(listbottom == "pageOnly"){
            domTxt = '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-12"p>>';
          } else {
            domTxt = '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-12"p>>';
          }
          var initComplete = function(){
            var nodes = [];
            var kpis = [];
            innerContent.find("[webSocket]").each(function(index, elem){
              var nodeId = parseInt($(this).attr("webSocket").split(',')[0]);
              var kpiId = parseInt($(this).attr("webSocket").split(',')[1]);
              if(nodes.indexOf(nodeId) == -1){
                nodes.push(nodeId);
              }
              if(kpis.indexOf(kpiId) == -1){
                kpis.push(kpiId);
              }
            });
            element.webSocket(nodes, kpis, function(event){
              var nodeId = event.nodeId;
              var kpiId = event.kpiCode;
              var find = innerContent.find("span[webSocket*='" + nodeId + "," + kpiId + "']");
              find.text(event.value);
              //find.val(event.value);
              var fData = data.find(function(elem){
                if (elem.params) {
                  return elem.params[0].id == kpiId;
                }
              });
              var webSocketReturnFn = expression.$attr("on/webSocketReturn");
              if(webSocketReturnFn){
                try {
                  webSocketReturnFn({
                    target : element,
                    global : global,
                    data : fData
                  })
                } catch(e){
                  console.log(e);
                }
              }
            });
          };
          var config = {
            dom: domTxt,
            language : $.ProudSmart.datatable.language,
            rowCallback : rowCallback,
            initComplete : initComplete,
            pageLength : pageSize,
            data : rData,
            columns: columns,
            ordering:  false,
            columnDefs : columnDefs
          };
          if(table){
            table.destroy();
            innerContent.empty();
          }

          table = innerContent.DataTable(config);
          var btnClick;
          windClick = function(event, name, inx){
            var ulWrap = $("[id*=ulWrap]");
            var icon = $("#icon_" + inx);
            ulWrap.css("display", "none");
            icon.removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
            $("body").off("click.btn");
            setTimeout(function() {
              $("#plusBtn_" + inx).on("click", btnClick);
            });
          };
          btnClick = function(event){
            event.stopPropagation();
            var inx = $(this).attr("id").split("plusBtn_")[1];
            var ulWrap = $("#ulWrap_" + inx);
            var icon = $("#icon_" + inx);
            ulWrap.css("display", "block");
            $(this).off("click");
            icon.removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
            setTimeout(function(){
              $("body").on("click.btn", function(event){
                windClick(event, name, inx);
              });
            });
          };
          $("[id*=plusBtn_]").on('click', btnClick);
          innerContent.css("width", "100%");
        });
      });
    };
    var initFn = expression.$attr("on/init");
    var start = function(){
      if(getOption == "simulate"){
        var param = expression.$attr("simulate");
        if(param == undefined){
          param = {
            size : 4,
            formatter : [{
              label : "label",
              value : function(index, elem){
                return "设备列表" + index;
              }
            },{
              label : "data1",
              value : function(index, elem){
                return elem.random([0,100]);
              }
            },{
              label : "data2",
              value : function(index, elem){
                return elem.random([0,100]);
              }
            },{
              label : "data3",
              value : function(index, elem){
                return elem.random([0,1]);
              }
            }]
          }
        } else {
          if(param.formatter == undefined){
            param.formatter = [{
              label : "label",
              value : function(index, elem){
                return "设备列表" + index;
              }
            },{
              label : "data1",
              value : function(index, elem){
                return elem.random([0,100]);
              }
            },{
              label : "data2",
              value : function(index, elem){
                return elem.random([0,100]);
              }
            },{
              label : "data3",
              value : function(index, elem){
                return elem.random([0,1]);
              }
            }];
          }
        }
        element.getSimulateList(param, function(data){
          element.render(data);
        });
      } else if(getOption == "alert"){
        element.getAllAlerts(function(alerts){
          element.render(alerts);
        });
      } else if(getOption == "newdevice"){
        var params = {
          domainPath : userLoginUIService.user.domains
        };
        element.getDevicesByCondition(params, function(devices){
          element.render(devices);
        });
      } else if (getOption == "energyType") {
        element.energyTypeList(function(energyType) {
          element.render(energyType);
        });
      } else if (getOption == "currentDirectiveByDevice") {
        element.currentDirective(function(directives) {
          element.render(directives);
        });
      } else if(getOption == "currentAlertByDevice"){
        element.getCurrentAlert(function(alerts){
          element.render(alerts);
        });
      } else if(getOption == "currentDevicesByProject"){
        element.getCurrentDevices(function(devices){
          element.render(devices);
        });
      } else if(getOption == "currentDevicesByGateWay"){
        element.getCurrentGatewayDir(function(dirs, devices){
          dirdevices = devices;
          element.render(dirs);
        });
      }
    };
    if(typeof initFn == "function") {
      try{
        initFn({
          target: element,
          global : global,
          tools: elemData
        })
      } catch(e){
        if(route.current.$$route.controller == "freeStyleCtrl"){
//        growl.error("组件［列表］的初始化表达式配置发生错误！");
          console.log("组件［列表］的初始化表达式配置发生错误" + e.message);
        };
        console.log(e);
      }

    } else {
      start();
    }
    return wrap;
  }
});
