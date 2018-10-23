/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(commonMethod) {
  return function(data) {
    var elemData = data;
    var kpiDes = [],
      modeType;
    var global = data.global;
    var growl = data.growl;
    var element = data.element;
    var self = new commonMethod(data);
    var SwSocket = data.SwSocket;
    var serviceCenterService = data.serviceCenterService;
    var webSocket = element.$attr("parameters/webSocket");
    var expression;
    var getoption = element.$attr("advance/getoption");
    var colwidth = element.$attr("parameters/colwidth");
    var formstyle = element.$attr("parameters/itemstyle");
    
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
    
    var resourceUIService = data.resourceUIService;
    if(expression) {
      modeType = expression.type;
    };
    
    var list = [];
    var innerContent = $("<div></div>").addClass("free-board-kpilist-" + formstyle).addClass("row");
    var initFn = expression.$attr("on/init");
    element.socket = function(data) {
      if(webSocket) {
        var find = list.find(function(elem) {
          return elem.data("kpiId") == data.kpiCode;
        });
        if(find) {
          var dom = find.find("#col-value");
          var utext = find.attr("unit");
          if(utext) {
            dom.text(data.value + " " + utext);
          } else {
            dom.text(data.value);
          }
        }
      }
    };
    element.render = function(data) {
      innerContent.children().remove();
      var arr = data;
      var loop = function(kdef) {
        var val = arr.find(function(elem) {
          return elem.kpiCode == kdef.id;
        });
        var allUnit = function(units) {
          var ufind = units.find(function(el) {
            return el.unitCode == kdef.unit
          });
          var value = val ? val.value : "-";
          var domUnit = "";
          if(ufind && ufind.unitName != " ") {
            domUnit = ufind.unitName;
            value = value + (" " + ufind.unitName);
          } else {
            value = value;
          };
          var wrap = $("<div></div>")
            .addClass("col-md-" + (12 / colwidth))
            .attr("unit", domUnit);
          wrap.data("kpiId", kdef.id);
          var row = $("<div></div>")
            .addClass("row");
          var col_l = $("<div></div>")
            .addClass("col-md-6")
            .css("line-height", "30px")
            .css("font-weight", "bold")
            .css("color", "#888")
            .css("padding", "5px 15px")
            .text(kdef.label);
          var col_r = $("<div></div>")
            .addClass("col-md-6 col-right");
          var col_r_inner;
          if(modeType == 'button') {
            var col_r_inner = $("<button></button>").addClass("btn btn-primary");
            col_r_inner.text("复位");
            if(value == 1) {
              col_r_inner.addClass("active");
            }
            col_r_inner.on("click", function(event) {
              var value = col_r_inner.hasClass("active") ? 0 : 1;
              serviceCenterService.directives.getBymodelId(modelId).then(function success(event) {
                if(event instanceof Array) {
                  var com = event.find(function(elem) {
                    return elem.kpiDefinitionIds.indexOf(kdef.id) != -1;
                  });
                  if(com) {
                    var param = {};
                    param[com.params[0].label] = value;
                    if(com) {
                      resourceUIService.sendDeviceDirective(nodes[0], com.id, param, function(event) {
                        console.log(event);
                      });
                    }
                  } else {
                    console.log("没有配置相应的指令！")
                  }
                }
              });
              if(col_r_inner.hasClass("active")) {
                col_r_inner.removeClass("active");
              } else {
                col_r_inner.addClass("active");
              }
            });
          } else {
            col_r_inner = $("<div></div>")
              .attr("id", "col-value")
              .addClass("col-right-inner")
              .text(value);
          }
          col_r.append(col_r_inner);
          row.append(col_l).append(col_r);
          wrap.append(row)
          innerContent.append(wrap);
          list.push(wrap);
        };
        serviceCenterService.units.getAll().then(allUnit);
      };
      var loop1 = function(item) {
        var format = expression.format;
        var format1 = format[0].value;
        var format2 = format[1].value;
        var regExp = /\{item:(.*)\}/;
        var val1 = $$.runRegExp(format1, regExp, 1);
        var val2 = $$.runRegExp(format2, regExp, 1);
        var value = item ? item[val2] : "-";
        if (item.kpiUnit) {
          value = value + " "+item.kpiUnit;
        }
        var wrap = $("<div></div>")
          .addClass("col-md-" + (12 / colwidth)).attr("unit", item.kpiUnit);
        wrap.data("kpiId", item.kpiCode);
        var row = $("<div></div>").addClass("row");
        
        var col_l = $("<div></div>").text(item[val1]+(format[0].subname?format[0].subname:''));
        //如果标签有class设置
        if (format[0].selclass) {
          col_l.addClass(format[0].selclass)
        } else {
          col_l.addClass("col-md-6")
        }
        //如果标签有css设置
        if (format[0].style) {
          for (var k in format[0].style) {
             col_l.css(k, format[0].style[k])
          }
        } else {
          col_l.css("line-height", "30px")
          .css("font-weight", "bold")
          .css("color", "#888")
          .css("padding", "5px 15px")
        }
        
        //标签上不带单位了
        //.text(item.kpiUnit ? item[val1] + (" (" + item.kpiUnit + ")") : item[val1]);
        
        var col_r = $("<div></div>");
        //如果内容外框有class设置
        if (format[1].selclass) {
          col_r.addClass(format[1].selclass);
        } else {
          col_r.addClass("col-md-6 col-right");
        }
          
        var col_r_inner;
        col_r_inner = $("<div></div>").attr("id", "col-value").text(value);
        //如果内容内框有class设置
        if (format[1].selclass_inner) {
          col_r_inner.addClass(format[1].selclass_inner)
        } else {
          col_r_inner.addClass("col-right-inner")
        }
        //如果标签有css设置
        if (format[1].style) {
          for (var k in format[1].style) {
             col_r_inner.css(k, format[1].style[k])
          }
        }
        col_r.append(col_r_inner);
        
        row.append(col_l).append(col_r);
        wrap.append(row)
        innerContent.append(wrap);
        list.push(wrap);
      };
      if(kpiDes.length > 0) {
        for(var i in kpiDes) {
          loop(kpiDes[i]);
        }
      } else if(data.length > 0) {
        for(var i in data) {
          loop1(data[i]);
        }
      } else {
        var err = $("<div></div>");
        err.css("text-align", "center");
        err.css("background-color", "#fff");
        err.css("padding", "10px");
        err.text("没有符合条件的记录。");
        innerContent.append(err)
      };
    };
    if(typeof initFn == "function") {
      try {
        initFn({
          target: element,
          global: global,
          self: self,
          tools: elemData
        })
      } catch(e) {
        console.log(e);
      };
    } else {
      if(getoption == "selected-kpi") {
        var getCiKpi_back = function(resources, kpisData) {
          var nodes = resources.map(function(element) {
            return element.id;
          });
          kpiDes = kpisData;
          var kpis = kpiDes.map(function(element) {
            if(typeof element == "object") {
              return element.id;
            } else {
              return element;
            }
          });
          var paramSocket = {
            ciid: nodes.toString(),
            kpi: kpis.toString()
          };
          var uuid = Math.uuid();
          var operation = "register";
          SwSocket.register(uuid, operation, function(event) {
            element.socket(event.data);
          });
          SwSocket.send(uuid, operation, 'kpi', paramSocket);
          serviceCenterService.getValues(nodes, kpis).then(element.render, function error(err) {
            growl.error(err);
          });
        }
        self.getCiKpi(getCiKpi_back);
      }
    };
    return innerContent
  }
});