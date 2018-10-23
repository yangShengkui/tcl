/**
 * Created by leonlin on 16/11/3.
 */
define(["commonMethod", "configs"], function (commonMethod) {
  return function (data) {
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
    var scope = data.scope;
    var compile = data.compile;
    var condition;
    var listbottom = element.$attr("parameters/listbottom");
    var col = element.$attr("parameters/col") || 1;
    var pageSize = 10;
    delete element.growl;
    Object.defineProperty(element, "dataSource", {
      enumerable: false
    });
    var wrap = $("<div></div>");
    wrap.css("width", "100%");
    //高级列表可能多列超出屏幕
    // wrap.css("overflow-y", "auto");
    // wrap.css("overflow-x", "hidden");
    wrap.css("overflow","auto");
    var innerContent = $("<table></table>").addClass("table table-hover");
    var headerBtnGroup = $("<div></div>").addClass("btn-group").css("margin-bottom", "10px").css("display", "none");
    var expression;
    wrap.append(headerBtnGroup);
    wrap.append(innerContent);
    $$.runExpression(element.$attr("advance/expression"), function (funRes) {
      if (funRes.code == "0") {
        var fnResult = funRes.data;
        if (typeof fnResult == "function") {
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        expression = {};
        console.log(funRes.message);
        //throw new Error(funRes.message);
      }
    });
    var format = expression.format;
    var theme = expression.theme || "default";
    var q = data.q;
    element.setFilter = function (obj) {

    };
    element.setFormat = function (fmt) {
      format = fmt;
    };
    element.search = function () {

    };
    element.render = function (source, callback) {
      var rowlist = [];
      headerBtnGroup.children().remove();
      var srcData;
      var showSelect = source.showSelect;
      if (source instanceof Array) {
        srcData = source;
      } else {
        srcData = source.data;
      }
      format = source.format;
      var rowCallbackKey = source.rowCallbackKey;

      if (showSelect) {
        format.unshift({
          type: "checkbox",
          value: "checked",
          name: "全选"
        });
      }
      pageSize = source.pageSize || pageSize;
      var createHeaderButton = function (btnConfig) {
        var btn = $("<div></div>").addClass(btnConfig.class || "btn btn-primary");
        var clickFn = btnConfig.$attr("on/click");
        var span = $("<span></span>").addClass(btnConfig.icon);
        btn.text(btnConfig.label);
        btn.prepend(span);
        btn.on("click", function (event) {
          if (clickFn) {
            clickFn(event);
          }
        });
        return btn;
      };
      if (source.buttons) {
        headerBtnGroup.css("display", "block");
        for (var i in source.buttons) {
          headerBtnGroup.append(createHeaderButton(source.buttons[i]));
        }
      }

      $$.loadExternalJs(["datatables.net", "datatables.net-bs", "datatables.net-select"], function (dataTable) {
        setTimeout(function () {
          var columns = [];
          var columnDefs = [];
          var windClick;
          var loopformat = function (inx, colInx, fmtInx, fmt) {
            columns.push({
              data: colInx != 0 ? (fmt.value + "_$" + colInx) : fmt.value,
              title: fmt.name,
              render: function (data, type, full) {
                var dt = data;
                var type = fmt.type;
                /**
                 * 限制表格的宽度
                 * @param item
                 * @returns {*|jQuery|HTMLElement}
                 */

                var createText = function (item, fmt) {
                  var nodeId = element.getParameter("resourceId");
                  var appendix = "";
                  if (colInx != 0) {
                    appendix = "_$" + colInx;
                  }
                  var kpiId = item["params" + appendix] ? item["params" + appendix][0].id : "";
                  var span = $("<span></span>");
                  span.attr("fmtInx", fmtInx);
                  if (fmt.websocket == true) {
                    span.attr("webSocket", nodeId + "," + kpiId);
                  }
                  span.css("cursor", "default");

                  var style = fmt.style;
                  if (style) {
                    span.css(style);
                  }
                  var format = fmt.format || function () {
                      return data == undefined ? "" : data;
                    };

                  var renderFn = fmt.render;
                  if (renderFn) {
                    dom = renderFn(data, "display", item, fmt);
                    span.append(dom);
                  } else {
                    span.attr("title", format(data));
                    span.text(format(data) == undefined ? "-" : format(data));
                  }
                  return span;
                };
                var createLink = function (item) {
                  if (item.filePath == "none") {
                    var nodeId = element.getParameter("resourceId");
                    var appendix = "";
                    if (colInx != 0) {
                      appendix = "_$" + colInx;
                    }
                    var kpiId = item["params" + appendix] ? item["params" + appendix][0].id : "";
                    var span = $("<span></span>");
                    span.attr("fmtInx", fmtInx);
                    if (fmt.websocket == true) {
                      span.attr("webSocket", nodeId + "," + kpiId);
                    }
                    span.css("cursor", "default");
                    var style = fmt.style;
                    if (style) {
                      span.css(style);
                    }
                    var format = fmt.format || function () {
                        return data == undefined ? "" : data;
                      };
                    var renderFn = fmt.render;
                    if (renderFn) {
                      dom = renderFn(data, "display", item, fmt);
                      span.append(dom);
                    } else {
                      span.attr("title", format(data));
                      span.text(format(data) == undefined ? "-" : format(data));
                    }
                    return span;
                  } else {
                    var link = $("<a target='_blank'></a>");
                    link.attr("fmtInx", fmtInx);
                    var linkage = fmt.linkage;
                    var value = fmt.value;
                    if (fmt.websocket == true) {
                      link.attr("webSocket", nodeId + "," + kpiId);
                    }

                    var style = fmt.style;
                    if (style) {
                      link.css(style);
                    }

                    var fileName = full.fileName ? full.fileName : full[value];
                    link.text(fileName);
                    link.attr("href", full[linkage]);
                    return link;
                  }

                };
                var createCustomHtml = function (item, fmt) {

                  var div = $("<div></div>");
                  var style = fmt.style || {};
                  var cls = fmt.class || "";
                  var val = fmt.content || {};
                  // 如果传进来是个数组需要展示多个文件
                  if(item.fileList instanceof Array){
                    item.fileList.forEach(function (ele) {
                      var a = $("<a target='_blank' href=" + ele.filePath + ">" + ele.fileName + "</a><br />");
                      div.append(a);
                    })
                  }else {
                    if (typeof style == "object") {
                      div.css(style);
                    }
                    var attsstr = fmt.attr ? fmt.attr : "id";
                    div.attr(attsstr, item[fmt.data]);
                    div.append(val);

                  }
                  return div;
                };
                var createSelect = function (item, fmt) {

                  var td = $("<div></div>");
                  var cls = fmt.class || "";
                  td.addClass(cls);
                  var style = fmt.style;
                  td.css("padding", "3px");
                  if (typeof style == "object") {
                    td.css(style);
                  }
                  return td;
                };
                var createInput = function (item, fmt) {
                  var appendix = "";
                  if (colInx != 0) {
                    appendix = "_$" + colInx;
                  }
                  var changeFn = fmt.$attr("on/change");
                  var input = $("<input />");
                  input.attr("fmtInx", fmtInx);
                  input.addClass("form-control");
                  var style = fmt.style;
                  if (style) {
                    input.css(style);
                  }


                  return input;
                };
                var createCheckBox = function (item, fmt) {
                  var input = $("<input type=\"checkbox\" id=\"checkbox\"/>");
                  input.attr("fmtInx", fmtInx);
                  if (item.checked) {
                    input.attr("checked", true);
                    input.prop("checked", true);
                  }
                  return input;
                };
                var createAlarmSource = function (item, fmt) {
                  var span = $("<span></span>");
                  span.attr("fmtInx", fmtInx);
                  span.css("cursor", "pointer");
                  if (data == 1) {
                    span.text("在线预警");
                  } else if (data == 2) {
                    span.text("智能诊断");
                  } else if (data == 3) {
                    span.text("大数据分析");
                  } else if (data == 4) {
                    span.text("离线诊断");
                  } else if (data == 130) {
                    span.text("点检异常");
                  } else if (data == 100) {
                    span.text("当日点检");
                  } else if (data == 110) {
                    span.text("精密检测");
                  } else if (data == 120) {
                    span.text("检修计划");
                  } else if (data == 140) {
                    span.text("备修委托");
                  } else if (data == 210) {
                    span.text("临时委托");
                  } else if (data == 220) {
                    span.text("辊道备修");
                  } else {
                    span.text(data);
                  }

                  /**
                   span.on("click", function(event){
                    console.log(element);
                  })*/
                  return span;
                };
                var createCheckBox = function (item, fmt) {
                  var input = $("<input type=\"checkbox\" id=\"checkbox\"/>");
                  input.attr("fmtInx", fmtInx);
                  if (item.checked) {
                    input.attr("checked", true);
                    input.prop("checked", true);
                  }
                  return input;
                };
                /**
                 var createlink = function(item, fmt){
                  var a = $("<a></a>").text(data || "");
                  var clickFn = fmt.$attr("on/click");
                  a.attr("fmtInx", fmtInx);
                  if(data != "-"){
                    a.css("text-decoration", "underline");
                    a.css("cursor", "pointer");
                  } else {
                    a.css("text-decoration", "none");
                    a.css("cursor", "default");
                  }
                  return a;
                };*/
                var createButton = function (item, fmt) {
                  var clickFn = fmt.$attr("on/click");
                  var uuid = Math.uuid(32);
                  var icon = $("<span></span>").addClass(fmt.icon || "glyphicon glyphicon-asterisk");
                  var button = $("<button></button>").addClass(fmt.class || "btn btn-primary").text(fmt.label).attr("id", "dataTable_btn_" + inx);
                  button.attr("fmtInx", fmtInx);
                  button.prepend(icon);
                  return button;
                };
                var createButtonGroup = function (item, fmt) {
                  var btnGroup = $("<div></div>").addClass("btn-group");
                  var createButton = function (ix, fm) {
                    var clickFn = fmt.$attr("on/click");
                    var uuid = Math.uuid(32);
                    var icon = $("<span></span>").addClass(fm.icon || "glyphicon glyphicon-asterisk");
                    var button = $("<button></button>").addClass(fm.class || "btn btn-primary").text(full[fm.name] ? fm.sublabel : fm.label).attr("id", "dataTable_btn_" + ix);
                    button.attr("fmtInx", fmtInx);
                    button.prepend(icon);
                    return button;
                  };
                  for (var i in fmt.content) {
                    btnGroup.append(createButton(i, fmt.content[i]));
                  }

                  return btnGroup;
                };
                //这个为了解决告警查询的时候按钮加业务逻辑
                var createButtonGroupAlert = function (item, fmt) {
                  var btnGroup = $("<div></div>").addClass("btn-group");
                  var createButton1 = function (ix, fm) {
                    var clickFn = fm.$attr("on/click");
                    var uuid = Math.uuid(32);
                    var icon = $("<span></span>").addClass(fm.icon || "glyphicon glyphicon-asterisk");
                    var button = $("<button></button>").addClass(fm.class || "btn btn-primary").text(fm.label).attr("id", "dataTable_btn_" + ix);
                    button.attr("fmtInx", fmtInx);
                    button.prepend(icon);
                    if (fm.disabled) {
                      button.attr("disabled", "true");
                    }
                    return button;
                  };
                  for (var i in fmt.content) {
                    fmt.content[i]["disabled"] = false;
                    if (fmt.content[i].name == "confirm" && (full.state != 0)) {
                      fmt.content[i]["disabled"] = true;
                    }
                    if (fmt.content[i].name == "ignore" && (full.state != 0 && full.state != 5 && full.state != 10)) {
                      fmt.content[i]["disabled"] = true;
                    }
                    btnGroup.append(createButton1(i, fmt.content[i]));
                  }

                  return btnGroup;
                };
                var createProgress = function () {
                  var pwrap = $("<div></div>").addClass("progress sm");
                  pwrap.attr("fmtInx", fmtInx);
                  var progress = $("<div></div>").addClass("progress-bar").css("width", data || 0);
                  pwrap.append(progress);
                  switch (true) {
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
                  }

                  return pwrap;
                };
                var createDirectiveInput = function (item, format) {
                  var appendix = "";
                  if (colInx != 0) {
                    appendix = "_$" + colInx;
                  }

                  var outer = $("<div></div>").css("position", "relative");
                  var wrap = $("<div></div>").addClass("input-group");
                  var text = $("<div></div>").addClass("btn btn-default").text(item.name);
                  var groupBtn_before = $("<div></div>").addClass("input-group-btn");
                  var input = $("<input />").addClass("form-control").attr("id", "inputAll_" + full["id" + appendix]);
                  var groupBtn_after = $("<div></div>").addClass("input-group-btn");
                  var icon = $("<span></span>").addClass("glyphicon glyphicon-plus-sign").attr("id", "icon_" + full["id" + appendix]);
                  var button1 = $("<button></button>").addClass("btn btn-default").attr("id", "plusBtn_" + full["id" + appendix]);
                  var button2 = $("<button></button>").addClass("btn btn-default").text("发送").attr("id", "sendBtnAll_" + full["id" + appendix]);
                  $("button[id*=sendBtnAll_" + full["id" + appendix] + "]").on("click", function (event) {
                    event.stopPropagation();
                    var params = {};
                    for (var i in item.params) {
                      params[item.params[i].name] = $("input[id*=inputAll_" + full["id" + appendix] + "]").val();
                    }
                    element.sendItemDirByValue(full.id, params);
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
                  var createLi = function (inner) {
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
                    element.getKpiValueCi([resourceId], [kpiId], function (data) {
                      $("[id*=add_" + inner.id + "]").text(data[0].value);
                    });
                    var paramSocket = {
                      ciid: [resourceId].toString(),
                      kpi: [kpiId].toString()
                    };
                    var uuid = Math.uuid();
                    SwSocket.unregister(uuid);
                    var operation = "register";
                    SwSocket.register(uuid, operation, function (event) {
                      $("[id*=add_" + inner.id + "]").text(event.data.value);
                    });
                    SwSocket.send(uuid, operation, "kpi", paramSocket);
                    $("input[id*=input_" + inner.id).on("change", function (event) {
                      inner.$value = $(this).val();
                    });
                    $("input[id*=input_" + inner.id).on("click", function (event) {
                      event.stopPropagation();
                    });
                    $("button[id*=sendBtn_" + inner.id).on("click", function (event) {
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
                  $("div[id*=ulWrap_" + full["id" + appendix] + "]").on("click", function (event) {
                    event.stopPropagation();
                  });
                  var appendix = "";
                  if (colInx != 0) {
                    appendix = "_$" + colInx;
                  }
                  for (var i in item["params" + appendix]) {
                    ul.append(createLi(item["params" + appendix][i]));
                  }
                  outer.attr("fmtInx", fmtInx);
                  wrap.append(input);
                  wrap.append(groupBtn_after);
                  groupBtn_before.append(text);
                  button1.append(icon);
                  groupBtn_after.append(button1);
                  groupBtn_after.append(button2);
                  ulWrap.append(ul);
                  outer.append(wrap);
                  outer.append(ulWrap);
                  return outer;
                };
                var createDirectiveSingle = function (item, format) {
                  var nodeId = element.getParameter("resourceId");
                  var appendix = "";
                  if (colInx != 0) {
                    appendix = "_$" + colInx;
                  }
                  if (item["params" + appendix]) {
                    var kpiId = item["params" + appendix][0].id;
                    var valueAddon = $("<span></span>");
                    var outer = $("<div></div>").css("position", "relative");
                    var wrap = $("<div></div>").addClass("input-group");
                    var text = $("<div></div>").addClass("btn btn-default").text(item.name);
                    var groupBtn_before = $("<div></div>").addClass("input-group-btn");
                    var input = $("<input />").addClass("form-control").attr("id", "inputAll_" + full["id" + appendix]);
                    var groupBtn_after = $("<div></div>").addClass("input-group-btn");
                    var button2 = $("<button></button>").addClass("btn btn-primary").text("发送").attr("id", "sendBtnAll_" + full["id" + appendix]);
                    var ulWrap = $("<div></div>").attr("id", "ulWrap_" + full["id" + appendix]).css("display", "none");
                    var appendix = "";
                    if (colInx != 0) {
                      appendix = "_$" + colInx;
                    }

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
                    return outer;
                  } else {
                    return "";
                  }

                };
                var createPriority = function () {
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
                  span.css("cursor", "default");
                  return span;
                };

                var createJquery = function (item, format) {
                  var span = $("<div></div>");
                  var renderFn = format.render;
                  if (renderFn) {
                    dom = renderFn(item);
                    span.append(dom);
                  }
                  return span;
                };
                var createOrderStatus = function () {
                  var span = $("<span></span>").addClass("label");
                  span.attr("fmtInx", fmtInx);
                  if (data == 10) {
                    span.text("未发布").addClass(" label-primary");
                  } else if (data == 100) {
                    span.text("处理中").addClass("label-warning");
                  } else if (data == 200) {
                    span.text("已完成").addClass("label-info");
                  } else if (data == 150) {
                    span.text("已撤销").addClass("label-info");
                  }
                  return span;
                };
                var createDate = function () {
                  var span = $("<span></span>");

                  span.css("cursor", "default");
                  var style = fmt.style;
                  if (style) {
                    span.css(style);
                  }
                  span.css("display", "inline-block");
                  var renderFn = fmt.render;
                  if (data) {
                    if (renderFn) {
                      span.text(renderFn(data))
                    } else {
                      span.text(useMomentFormat(data, "yyyy-MM-dd hh:mm:ss"));
                    }
                  } else {
                    span.text("-");
                  }
                  return span;
                };
                /**
                 * 韩星
                 * 表格中行内添加一个时间插件
                 */

                var createDateTimePicker = function (fmt) {

                  var td = $("<div></div>");
                  return td;
                };
                /**
                 *  韩星
                 *  加了一个可以自定义上传图片，上传图片的参数
                 */
                var createUploadFile2 = function (fmt, ctrlGroup) {
                  var group = $("<div></div>");
                  group.attr("id", "group");
                  var cfg;
                  group.addClass("btn-group");
                  var file;
                  var td = $("<td></td>");
                  var style = fmt.style || {};
                  var btnStyle = fmt.btnStyle || {};
                  var cls = fmt.class || "";
                  var disabled = fmt.disabled;
                  var previewBtn = $("<button></button>");
                  var submitBtn = $("<button></button>");
                  submitBtn.attr("id", "submitBtn");
                  var submitFn = fmt.$attr("on/submit");
                  var config = {};
                  config.group = fmt.group;
                  previewBtn.addClass("btn btn-default");
                  previewBtn.text("预览");
                  td.addClass(cls);
                  td.css("padding", "3px");
                  if (typeof style == "object") {
                    td.css(style);
                  }
                  var button = $("<button></button>");
                  button.attr("id", "buttonUpload");
                  var txt = $("<span></span>");
                  txt.attr("id", "txt");
                  var icon = $("<span></span>");
                  var clickFn = fmt.$attr("on/click");
                  var fileDom = $("<input />");
                  fileDom.attr("id", "fileDom");
                  fileDom.attr("type", "file");
                  fileDom.css("display", "none");
                  button.addClass("btn btn-default");
                  button.attr("type", "button");
                  group.append(button);
                  if (fmt.icon) {
                    icon.addClass(fmt.icon);
                    button.append(icon);
                  }
                  if (disabled) {
                    button.prop("disabled", "disabled")
                  }
                  button.css(btnStyle);
                  txt.text("选择文件");
                  button.append(txt);
                  previewBtn.off("click");
                  previewBtn.on("click", function (event) {
                    element.createSystemPopupByJsonName("imagePrev", {
                      title: "图片内容预览",
                      width: "500px",
                      config: cfg
                    }, {
                      file: file
                    })
                  });
                  td.append(fileDom);
                  td.append(group);
                  return td;
                };
                var createStatus = function () {
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
                  return span;
                };
                var wrap = $("<div></div>");
                var dom, fmtClone;
                if (type == "valueBased") {
                  if (!data) data = "";
                  fmtClone = fmt.options[data];
                  if (!fmtClone) {
                    fmtClone = fmt.options[""];
                  }
                  type = fmtClone.type;
                } else {
                  fmtClone = fmt;
                }

                if (type == "text") {
                  dom = createText(full, fmtClone);
                } else if (type == "link") {
                  dom = createLink(full, fmtClone);
                } else if (type == "checkbox") {
                  dom = createCheckBox(full, fmtClone);
                } else if (type == "date") {
                  dom = createDate();
                } else if (type == "input") {
                  dom = createInput(full, fmtClone);
                } else if (type == "select") {
                  dom = createSelect(full, fmtClone);
                } else if (type == "progressbar") {
                  dom = createProgress();
                } else if (type == "priority") {
                  dom = createPriority(full, fmtClone);
                } else if (type == "jquery") {
                  dom = createJquery(full, fmtClone);
                } else if (type == "button") {
                  dom = createButton(full, fmtClone);
                } else if (type == "directiveSingle") {
                  dom = createDirectiveSingle(full, fmtClone);
                } else if (type == "directiveInput") {
                  dom = createDirectiveInput(full, fmtClone);
                } else if (type == "buttonGroup") {
                  dom = createButtonGroup(full, fmtClone);
                } else if (type == "buttonGroupAlert") {
                  dom = createButtonGroupAlert(full, fmtClone);
                } else if (type == "orderStatus") {
                  dom = createOrderStatus(full, fmtClone);
                } else if (type == "status") {
                  dom = createStatus();
                } else if (type == "dateTimePicker") {
                  dom = createDateTimePicker(fmt, fmtClone);
                } else if (type == "alarmSource") {
                  dom = createAlarmSource(full, fmtClone);
                } else if (type == "customHtml") { //加了一个自定义html功能，便于其它功能的扩展
                  dom = createCustomHtml(full, fmtClone);
                } else if (type == "uploadFile2") { //宝钢报告编制特殊处理
                  dom = createUploadFile2(fmt, fmtClone);
                } else {
                  dom = createText(full, fmtClone);
                }
                dom.attr("src_data", data); //将当前值存储在src_data中
                dom.attr("col_index", inx);

                wrap.append(dom);
                return wrap.html();
              }
            });
            columnDefs.push({
              targets: inx,
              global: global,
              width: fmt.width || null,
              data: colInx != 0 ? (fmt.value + "_$" + colInx) : fmt.value
            });
          };
          var seperateToArray = function (data) {
            var rs = [];
            var inx = 1;
            var obj = {};
            var sepData = function (inx) {
              var obj = {};
              var appendix = "_$" + inx;
              var fd = false;
              for (var i in data) {
                if (i.indexOf(appendix) != -1) {
                  obj[i.split("_$")[0]] = data[i];
                  fd = true;
                }
              }
              if (fd) {
                rs.push(obj);
                inx++;
                sepData(inx);
              }
            };
            for (var i in data) {
              if (i.indexOf("_$") == -1) {
                obj[i] = data[i];
              }
            }
            rs.push(obj);
            sepData(inx);
            return rs;
          };
          var loopCol = function (inx) {
            for (var i in format) {
              loopformat(((inx * format.length) + parseInt(i)), inx, i, format[i]);
            }
          };
          for (var i = 0; i < col; i++) {
            loopCol(i);
          }

          var rowCallback = function (row, data, index) {
            var rowData;
            if (source.paging) {
              rowData = rearrangeByCol([data])[0];
              srcData.push(rowData);
            } else {
              rowData = data;
            }
            
            var find = srcData.find(function (item) {
              if (item[rowCallbackKey] === data[rowCallbackKey]) return true;
            })
            var tableElement = function (data) {
              for (var i in data) {
                this[i] = data[i];
              }
              //this.$clone(data);
            };
            if (!rowData.hasOwnProperty("dom")) {
              Object.defineProperty(rowData, "dom", {
                enumerable: false,
                value: $(row)
              });
            }

            rowlist.push(rowData);
            tableElement.prototype = {
              removeRow: function (callback) {
                table.row(row._DT_RowIndex).remove().draw(false);
                if (typeof callback == "function") {
                  var rs = [];
                  var dt = table.data();
                  for (var i in dt) {
                    if (parseInt(i) == i) {
                      rs.push(dt[i]);
                    }
                  }
                  callback(rs);
                }
              }
            };
            find.tableElement = new tableElement(rowData);
            var rowClickFn = source.$attr("on/rowClick");
            if (rowClickFn) {
              // 如果有行点击事件，则把鼠标形状变成手形
              $(row).css({
                "cursor": "pointer"
              });
            }
            $(row).on("click", function (event) {
              if (rowClickFn) {
                rowClickFn({
                  index: index,
                  row: rowData
                });
              }
            });
            var loopformat = function (inx, colInx, fmtInx, fmt) {
              var dom = $(row).find("[col_index*=" + inx + "]");
              if (fmt.type == "valueBased") {
                var val = dom.attr("src_data"); //获得存储的src_data;
                if (!val) val = "";
                var fmtClone = fmt.options[val];
                if (!fmtClone) {
                  fmtClone = fmt.options[""];
                }
                fmt = fmtClone;
              }

              if (fmt.type == "checkbox") {
                dom.on("change", function (event) {
                  $.fn.every = function (callback) {
                    var every = true;
                    $(this).each(function (index, element) {
                      if (!callback(element)) {
                        every = false;
                      }
                    });
                    return every;
                  };
                  var checkall = innerContent.find("input#checkbox").every(function (elem) {
                    return $(elem).prop("checked");
                  });
                  if (checkall) {
                    innerContent.find("#checkboxall").prop("checked", true);
                  } else {
                    innerContent.find("#checkboxall").removeAttr("checked");
                  }
                });
              } else if (fmt.type == "button" || fmt.type == "link") {

                var clickFn = fmt.$attr("on/click");
                dom.on("click", function (event) {
                  if (typeof clickFn == "function") {
                    clickFn({
                      index: index,
                      row: rowData,
                      columnIndex: fmtInx
                    });
                  }
                });
              } else if (fmt.type == "alarmSource") {
                var clickFn = fmt.$attr("on/click");
                dom.on("click", function (event) {
                  if (typeof clickFn == "function") {
                    clickFn({
                      index: index,
                      row: rowData,
                      columnIndex: fmtInx
                    });
                  }
                });
              } else if (fmt.type == "alarmSource") {
                var clickFn = fmt.$attr("on/click");
                dom.on("click", function (event) {
                  if (typeof clickFn == "function") {
                    clickFn({
                      index: index,
                      row: rowData,
                      columnIndex: fmtInx
                    });
                  }
                });
              } else if (fmt.type == "buttonGroup") {
                for (var i in fmt.content) {
                  (function (i) {
                    var clickFn = fmt.content[i].$attr("on/click");
                    var subBtn = dom.find("#dataTable_btn_" + i);
                    subBtn.off("click");
                    subBtn.on("click", function (event) {
                      event.stopPropagation();
                      if (typeof clickFn == "function") {
                        clickFn({
                          index: index,
                          row: rowData
                        });
                      }
                    });
                  })(i);
                }
              } else if (fmt.type == "buttonGroupAlert") {
                for (var i in fmt.content) {
                  (function (i) {
                    var clickFn = fmt.content[i].$attr("on/click");
                    var subBtn = dom.find("#dataTable_btn_" + i);
                    subBtn.off("click");
                    subBtn.on("click", function (event) {
                      event.stopPropagation();
                      if (typeof clickFn == "function") {
                        clickFn({
                          index: index,
                          row: rowData
                        });
                      }
                    });
                  })(i);
                }
              } else if (fmt.type == "input") {
                var changeFn = fmt.$attr("on/change");
                dom.val(data[fmt.value] || "");
                dom.on("change", function (event) {
                  event.stopPropagation();
                  if (changeFn) {
                    changeFn({
                      index: index,
                      row: rowData,
                      value: dom.val()
                    });
                  }
                });
              } else if (fmt.type == "uploadFile2") {

                var submitBtn = $("<button></button>");
                submitBtn.addClass("btn btn-primary");
                submitBtn.text("上传");
                var submitFn = fmt.$attr("on/submit");
                var fileDom = $(row).find("#fileDom");
                var group = $(row).find("#group");
                var button = $(row).find("#buttonUpload");
                var txt = $(row).find("#txt");
                var config = {};
                config.group = fmt.group;
                submitBtn.on("click", function (event) {
                  element.uploadFile1(file, config, function (event) {
                    submitBtn.remove();
                    txt.text(file.name + "已经成功上传！");
                    cfg = event.data;
                    if (submitFn) {
                      submitFn(event, fileDom, fmt, rowData); //需要把返回的全部callback回来
                      // submitFn(event["data"]);
                      // previewBtn.off("click");
                      // previewBtn.on("click", function(evt) {
                      //   element.createSystemPopupByJsonName("imagePrev", {
                      //     title: "图片内容预览",
                      //     width: "500px"
                      //   }, {
                      //     url: event["data"].value
                      //   })
                      // });
                    }
                  })
                });
                fileDom.on("change", function (event) {
                  file = fileDom[0].files[0];
                  txt.css({
                    "overflow": "hidden",
                    "text-overflow": "ellipsis",
                    "white-space": "nowrap",
                    "width": "80px",
                    "display": "block"
                  });
                  txt.text(file.name);
                  txt.attr("title", file.name);
                  group.append(submitBtn);
                });
                button.on("click", function (event) {
                  fileDom.trigger("click");
                });
              } else if (fmt.type == "dateTimePicker") {
                dom.children().remove();
                var td = $("<div></div>");
                var style = fmt.style;
                td.css("padding", "3px");
                if (typeof style == "object") {
                  td.css(style);
                }
                var cls = fmt.class || "";
                var value = fmt.value;
                td.addClass(cls);
                var wrap = $("<div></div>");
                var changeFn = fmt.$attr("on/change");
                var id = Math.uuid();
                var input = $("<input id=dateTime" + id + " />").addClass("form-control").attr("type", "text");
                td.append(wrap);
                wrap.css("position", "relative");
                wrap.append(input);
                setTimeout(function () {
                  $$.loadExternalJs(['laydate'], function (laydate) {
                    laydate.render({
                      elem: '#dateTime' + id, //指定元素'#dateRange'
                      theme: '#393D49',
                      type: 'datetime',
                      btns: ['clear', 'confirm'],
                      value: value ? useMomentFormat(value, "YYYY-MM-DD HH:mm:ss") : '',
                      done: function (value, date, endDate) {
                        if (changeFn) {
                          changeFn({
                            target: element,
                            global: global,
                            row: rowData,
                            value: {
                              getUTCDateString: value == '' ? '' : formatDatebyMomentToUTC(value),  //格林尼治时间格式    element.getDateHandler(value).getUTCDateString()
                              getDateString: value
                            }
                          })
                        }
                      }
                    });
                  })
                })
                dom.append(td);
              } else if (fmt.type == "select") {

                var val = fmt.value + "";
                var changeFn = fmt.$attr("on/change");
                var options = fmt.options || [];
                var format = fmt.format || {
                    "id": "id",
                    "label": "label"
                  };
                var ix = 0;
                var dt = options.map(function (elem) {
                  var rs = {
                    id: ix,
                    text: elem[format.label]
                  };
                  ix++;
                  return rs;
                });
                dom.children().remove();
                $$.loadExternalJs(["select2"], function () {
                  var select2Dom = $("<select></select>");
                  var changeFn = fmt.$attr("on/change");
                  select2Dom.css("width", "100%");
                  var find = options.find(function (elem) {
                    return elem[format["id"]] == data[fmt.value];
                  });
                  var inxStr = options.indexOf(find) + "";
                  var baseSelect2 = {
                    language: {
                      noResults: function () {
                        return fmt.noresults || "没有该匹配项";
                      }
                    },
                    placeholder: fmt.placeholder || "请选择...",
                    data: dt
                  };
                  select2Dom.on("select2:select", function (evt) {
                    if (typeof changeFn == "function") {
                      var id = evt.params.data.id;
                      var find = fmt.options[id];
                      try {
                        changeFn({
                          row: rowData,
                          current: fmt,
                          value: find
                        });
                      } catch (e) {
                        console.log(e);
                      }
                    }
                  });
                  dom.append(select2Dom);
                  select2Dom.select2(baseSelect2);
                  select2Dom.val(inxStr);
                  select2Dom.trigger("change.select2");
                });
              }
            };
            var loopCol = function (inx) {
              for (var i in format) {
                loopformat(((inx * format.length) + parseInt(i)), inx, i, format[i]);
              }
            };
            for (var i = 0; i < col; i++) {
              loopCol(i);
            }
            compile(row)(scope);
          };
          var rearrangeByCol = function (data) {
            var rs = [];
            var extend = function (obj, item) {
              for (var i in item) {
                obj[i] = item[i];
              }

            };
            var clone = function (data, inx) {
              var result = {};
              for (var i in data) {
                var offset = inx != 0 ? "_$" + inx : "";
                result[i + offset] = data[i];
              }
              return result;
            };
            var loop = function (inx, item) {
              var ix = Math.floor(inx / col);
              var ic = inx % col;
              if (!rs[ix]) {
                rs[ix] = {};
              }

              extend(rs[ix], clone(item, ic));
            };
            for (var i in data) {
              loop(i, data[i]);
            }

            return rs;
          };
          var rData = rearrangeByCol(srcData);
          var domTxt = "";
          if (listbottom == "standard") {
            //如果没有数据不显示表格页脚
            if (srcData.length > 0) {
              domTxt = $.ProudSmart.datatable.footerdom;
            } else {
              domTxt = "";
            }
          } else if (listbottom == "none") {
            domTxt = "";
          } else if (listbottom == "pageAndTotal") {
            domTxt = '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-4"l><"col-lg-8"p>>';
          } else if (listbottom == "pageOnly") {
            domTxt = '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-12"p>>';
          } else {
            domTxt = '<"row"<"clo-lg-12">>t<"row footerdom"<"col-lg-12"p>>';
          }
          var initComplete = function () {

          };
          var pipeline = function(opts,handlerFuc,params) {
            var conf = $.extend({
              pages: 1, // number of pages to cache
              url: '', // script url
              data: null, // function or object with parameters to send to the server
              // matching how `ajax.data` works in DataTables
              method: 'POST' // Ajax HTTP method
            }, opts);
    
            // Private variables for storing the cache
            var cacheLower = -1;
            var cacheUpper = null;
            var cacheLastRequest = null;
            var cacheLastJson = null;
    
            return function(request, drawCallback, settings) {
              var ajax = false;
              var requestStart = request.start;
              var drawStart = request.start;
              var requestLength = request.length;
              var requestEnd = requestStart + requestLength;
    //        var sort = request.columns[request.order[0].column].data; //排序列的字段
    //        var sortType = request.order[0].dir; //排序的方式
              request.order.pop();
              if(settings.clearCache) {
                // API requested that the cache be cleared
                ajax = true;
                settings.clearCache = false;
              } else if(cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
                // outside cached data - need to make a request
                ajax = true;
              } else if(JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
              ) {
                // properties changed (ordering, columns, searching)
                ajax = true;
              }
    
              // Store the request for checking next time around
              cacheLastRequest = $.extend(true, {}, request);
    
              if(ajax) {
                // Need data from the server
                if(requestStart < cacheLower) {
                  requestStart = requestStart - (requestLength * (conf.pages - 1));
    
                  if(requestStart < 0) {
                    requestStart = 0;
                  }
                }
    
                cacheLower = requestStart;
                cacheUpper = requestStart + (requestLength * conf.pages);
    
                request.start = requestStart;
                request.length = requestLength * conf.pages;
    
                // Provide the same `data` options as DataTables.
                if($.isFunction(conf.data)) {
                  // As a function it is executed with the data object as an arg
                  // for manipulation. If an object is returned, it is used as the
                  // data object to submit
                  var d = conf.data(request);
                  if(d) {
                    $.extend(request, d);
                  }
                } else if($.isPlainObject(conf.data)) {
                  // As an object, the data given extends the default
                  $.extend(request, conf.data);
                }
                var pageRequest = {
                  start: request.start,
                  length: request.length,
                  //            sort :sort,
                  //            sortType :sortType,
                  statCount: request.draw == 1
                }
                
                handlerFuc(params,pageRequest, function(returnObj, total) {
                  //初始化选中状态
                  returnObj.forEach(function(item){
                    item.selected = false;
                  })
                  var json = {};
                  json.data = returnObj;
                  json.draw = request.draw; // Update the echo for each response
                  json.recordsTotal = total != undefined ? (total == -1 ? cacheLastJson.recordsTotal : total) : returnObj.length;
                  json.recordsFiltered = json.recordsTotal;
                  cacheLastJson = $.extend(true, {}, json);
                  if(cacheLower != drawStart) {
                    json.data.splice(0, drawStart - cacheLower);
                  }
                  if(requestLength >= -1) {
                    json.data.splice(requestLength, json.data.length);
                  }
    
                  drawCallback(json);
                });
              }
            }
          }
          var config = {
            ordering: false,
            dom: domTxt,
            language: $.ProudSmart.datatable.language,
            rowCallback: rowCallback,
            initComplete: initComplete,
            pageLength: pageSize,
            columns: columns,
            columnDefs: columnDefs
          };
          //如果有paging这个处理，说明是真分页了
          if (source.paging) {
            /**
             * 韩星 增加了把查询条件带进去去查
             * source.paging 是否实现分页
             * source.params 是把条件带进来一起查询
             * @type {boolean}
             * 2018-3-22
             */
            config.processing = true;
            config.serverSide = true;
            config.ajax = pipeline({},source.paging,source.params);
          } else {
            config.data = rData
          }
          
          if (table) {
            table.destroy();
            innerContent.empty();
          }
          table = innerContent.DataTable(config);
          if (showSelect) {
            var all = $(innerContent.find("th")[0]);
            all.children().remove();
            all.text("");
            var checkboxall = $("<input type=\"checkbox\" id=\"checkboxall\"/>");
            checkboxall.on("change", function (event) {
              var checked = $(this).prop("checked");
              if (checked) {
                innerContent.find("input#checkbox").prop("checked", true);
              } else {
                innerContent.find("input#checkbox").removeAttr("checked");
              }
            });
            all.append(checkboxall);
          }

          element.search = function () {
            if (arguments.length == 1) {
              var key = arguments[0];
              innerContent.DataTable().search(key, false, true);
            } else if (arguments.length == 2) {
              var inx = arguments[0];
              var key = arguments[1];
              innerContent.DataTable().column(inx).search(key, false, true);
            }
          };
          innerContent.css("width", "100%");
          table.getChecked = function () {
//          return rowlist.filter(function(elem) {
//            var dom = elem.dom;
//            return dom.find("input#checkbox").prop("checked");
//          });
            //去重复 bug676
            var rowlistAllChecked = rowlist.filter(function (elem, index, array) {
              if (elem.dom.find("input#checkbox").prop("checked"))
                return array.indexOf(elem) === index;
              return false;
            });
            return rowlistAllChecked;
          };
          if (callback) {
            callback(table);
          }
        });
      });
    };
    var initFn = expression.$attr("on/init");
    var start = function () {
      if (getOption == "simulate") {
        var param = expression.$attr("simulate");
        if (param == undefined) {
          param = {
            size: 4,
            formatter: [{
              label: "label",
              value: function (index, elem) {
                return "设备列表" + index;
              }
            }, {
              label: "data1",
              value: function (index, elem) {
                return elem.random([0, 100]);
              }
            }, {
              label: "data2",
              value: function (index, elem) {
                return elem.random([0, 100]);
              }
            }, {
              label: "data3",
              value: function (index, elem) {
                return elem.random([0, 1]);
              }
            }]
          };
        } else {
          if (param.formatter == undefined) {
            param.formatter = [{
              label: "label",
              value: function (index, elem) {
                return "设备列表" + index;
              }
            }, {
              label: "data1",
              value: function (index, elem) {
                return elem.random([0, 100]);
              }
            }, {
              label: "data2",
              value: function (index, elem) {
                return elem.random([0, 100]);
              }
            }, {
              label: "data3",
              value: function (index, elem) {
                return elem.random([0, 1]);
              }
            }];
          }
        }
        element.getSimulateList(param, function (data) {
          element.render(data);
        });
      } else if (getOption == "alert") {
        element.getAllAlerts(function (alerts) {
          element.render(alerts);
        });
      } else if (getOption == "newdevice") {
        var params = {
          domainPath: userLoginUIService.user.domains
        };
        element.getDevicesByCondition(params, function (devices) {
          element.render(devices);
        });
      } else if (getOption == "energyType") {
        element.energyTypeList(function (energyType) {
          element.render(energyType);
        });
      } else if (getOption == "currentDirectiveByDevice") {
        element.currentDirective(function (directives) {
          element.render(directives);
        });
      } else if (getOption == "currentAlertByDevice") {
        element.getCurrentAlert(function (alerts) {
          element.render(alerts);
        });
      } else if (getOption == "currentDevicesByProject") {
        element.getCurrentDevices(function (devices) {
          element.render(devices);
        });
      }
    };
    if (typeof initFn == "function") {
      try {
        initFn({
          target: element,
          global: global
        });
      } catch (e) {
        //      growl.error("组件［列表］的初始化表达式配置发生错误" + e.message);
        console.log("组件［列表］的初始化表达式配置发生错误" + e.message);

      }

    } else {
      start();
    }
    return wrap;
  };
});