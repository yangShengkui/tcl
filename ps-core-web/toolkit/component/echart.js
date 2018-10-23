/**
 * Created by leonlin on 16/11/3.
 * Update by zhangafa
 */
define(['commonMethod'], function(commonMethod) {
  return function(data) {
    var run, baseOption;
    var extension = {};
    var expression;
    var target;
    var echartTarget;
    var zoomOld;
    var mapJson;
    var tg = {};
    var ci, kpi;
    var oriLength = 0;
    var loadData = [];
    var baidumap;
    var elemData = data;
    var growl = data.growl;
    var element = data.element;
    var buttonEnabled = data.buttonEnabled;
    var serviceCenterService = data.serviceCenterService;
    var kqiManagerUIService = data.kqiManagerUIService;
    var thridPartyApiService = data.thridPartyApiService;
    var angularStyle = data.angularStyle;
    var timeout = data.timeout;
    var global = data.global;
    var window = data.window;
    var route = data.route;
    var previewMode = data.previewMode;
    var rootScope = data.rootScope;
    var Info = data.Info;
    var SwSocket = data.SwSocket;
    var scope = data.scope;
    var ngDialog = data.ngDialog;
    var kqiModel = element.$attr("data/kqiModel");
    var searching = false;
    //原来这里是进行复制的地方，现在进行legend的设置
    var reconstruct = function(data) {
      for(var i in data.series) {
        if(data.legend) {
          if(!data.legend.selected) data.legend.selected = {}
          if(data.series[i].show == false) {
            data.legend.selected[data.series[i].name] = false;
          } else {
            data.legend.selected[data.series[i].name] = true;
          }
        }
      }
      return data;
    };
    
    var wrap = $("<div></div>");
    wrap.css("position", "relative");
    element.resource_applied = [];
    element.kpi_applied = [];
    element.resource_time = {};
    Object.defineProperty(element, "resource_applied", {
      enumerable: false
    });
    Object.defineProperty(element, "kpi_applied", {
      enumerable: false
    });
    var echartDom = $("<div></div>");
    wrap.append(echartDom);
    
    element.showPanel = function(list) {
      var bg = $("<div></div>"),
        page = elemData.routeParam.page,
        para;
      var wrap = $("<div></div>")
        .css("position", "relative");
      var blank = $("<div></div>").css("height", "1px");
      var closeBtn = $("<div></div>")
        .css("cursor", "pointer")
        .css("right", "10px")
        .css("top", "10px")
        .css("position", "absolute");
      var title = $("<div></div>")
        .text("选择本区域项目")
        .css("margin", "20px")
        .css("font-weight", "bold");
      var ul = $("<ul></ul>").css("margin", "10px").css("padding", "0px");
      var createLi = function(data) {
        var li = $("<li></li>").css("padding", "7px").css("margin", "3px")
          .css("color", "#fff")
          .css("list-style", "none")
          .css("cursor", "pointer")
          .css("background-color", "#3c8dbc");
        li.text(data.label);
        li.on("click", function(event) {
          var oldParam = elemData.routeParam.parameter;
          if(oldParam == undefined) {
            oldParam = ['0']
          } else {
            oldParam = JSON.parse(oldParam);
          }
          var resource = {
            projectId: data.id
          };
          oldParam.push(resource);
          para = encodeURIComponent(JSON.stringify(oldParam));
          elemData.window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + page + "|topo/" + para;
        });
        return li;
      };
      for(var i in list) {
        ul.append(createLi(list[i]));
      };
      var closeIcon = $("<span></span>").addClass("glyphicon glyphicon-remove");
      closeBtn.append(closeIcon);
      closeBtn.on("click", function() {
        bg.remove();
      });
      wrap.append(closeBtn);
      wrap.append(blank);
      wrap.append(title);
      wrap.append(ul);
      wrap.css("margin", "100px auto");
      wrap.css("width", "400px");
      wrap.css("min-height", "200px");
      wrap.css("background-color", "#fff");
      bg.css("width", "100%");
      bg.css("height", "100%");
      bg.css("left", "0px");
      bg.css("top", "0px");
      bg.css("position", "absolute");
      bg.css("background-color", "rgba(0,0,0,.6)");
      bg.css("z-index", 1000);
      echartDom.before(bg);
      bg.append(wrap);
    };
    
    element.setResource = function(resources) {
      element.resource_applied = resources;
    };
    
    element.setTime = function(time) {
      element.resource_time = time;
    };
    
    element.setKpi = function(kpi) {
      element.kpi_applied = kpi;
    };
    
    element.setHighlight = function(label) {
      var find, symbol;
      for(var i in baseOption.series) {
        for(var j in baseOption.series[i].data) {
          if(baseOption.series[i].data[j].label == label) {
            symbol = baseOption.series[i].symbol;
            find = baseOption.series[i].data[j];
          }
        }
      }
      if(find) {
        searching = true;
        var highlight = baseOption.series.find(function(data) {
          return data.name == "highlight";
        });
        var select = baseOption.series.find(function(data) {
          return data.name == "select";
        });
        highlight.data = [find];
        highlight.show = true;
        if(select) {
          select.data = [find];
          select.symbol = symbol;
        }
        var opt = target.getModel().getOption();
        opt.series[0].data = highlight.data;
        target.getModel().setOption(opt);
        
        if (baidumap.getZoom() == 9) {
          element.zoomTo(elem.value,true);
        } else {
          element.zoomTo(elem.value);
        }
      }
    };
    
    element.searchHighlight = function(heiLabel) {
      var find;
      for(var i in baseOption.series) {
        for(var j in baseOption.series[i].data) {
          if(baseOption.series[i].data[j].label == heiLabel) {
            find = baseOption.series[i].data[j];
          }
        }
      }
      (function createSearch(valueObj) {
        zoomOld = 9;
        var ifZoom = expression.$attr("zoom");
        var removeCover = function(obj) {
          var find = obj.data.find(function(el) {
            return el.label == heiLabel;
          });
          for(var i in obj.data) {
            obj.data[i].show = true;
            if(find) {
              if(obj.data[i]) {
                if(obj.data[i].value[0] == find.value[0] && obj.data[i].value[1] == find.value[1] && obj.data[i].label != find.label) {
                  obj.data[i].show = false;
                }
              }
            }
          }
        };
        if(ifZoom) {
          searching = true;
          var findPrev = baseOption.series.find(function(elem) {
            return elem.name == "level0";
          });
          var findDetail = baseOption.series.find(function(elem) {
            return elem.name == "level1";
          });
          removeCover(findDetail);
          findPrev.show = false;
          findDetail.show = true;
        };
        var highlight = baseOption.series.find(function(data) {
          return data.name == "highlight";
        });
        highlight.data = [find];
        highlight.show = true;
        var opt = target.getModel().getOption();
        opt.series[0].data = highlight.data;
        target.getModel().setOption(opt);
        
        if (baidumap.getZoom() == 9) {
          element.zoomTo(elem.value,true);
        } else {
          element.zoomTo(elem.value);
        }
      })(find);
    };
    
    var createSearch = function(dtData) {
      var detail = $("<div></div>");
      var slist = dtData.data;
      detail.css("position", "absolute");
      detail.css("z-index", 9);
      detail.css("right", "50px");
      detail.css("top", "20px");
      detail.css("maxHeight", "600px");
      detail.css("overflow", "auto");

      var searchBox = $("<div class='row' style='padding:10px;width:280px;'></div>");
      searchBox.css("cursor", "pointer");
      searchBox.css("background-color", "rgba(250,250,250,.8)");
      searchBox.css("border-bottom", "1px solid #ccc");
      var searchArea = $("<input />").addClass("form-control").css("display", "inline-block").css("height", "35px");
      var txt;
      if(expression) {
        if(expression.filterLabel) {
          txt = expression.filterLabel;
        }
      }
      var text = $("<span></span>").text(txt ? txt : "项目检索")
        .css("color", "#666")
        .css("display", "block")
        .css("font-size", "14px")
        .css("line-height", "30px")
        .css("font-weight", "bold");
      var icon = $("<span></span>").addClass("glyphicon glyphicon-search");
      var button = $("<button></button>").addClass("btn btn-primary");
      var searchlist = $("<div></div>");
      button.append(icon);
      searchBox.append(text)
      searchBox.append(searchArea);
      detail.append(searchBox);
      detail.append(searchlist);
      searchArea.on("keyup", function(event) {
        var key = searchArea.val();
        searchlist.children().remove();
        var createItem = function(elem) {
          var div = $("<div></div>").text(elem.label);
          div.css("padding", "10px");
          div.css("cursor", "pointer");
          div.css("background-color", "rgba(250,250,250,.8)");
          div.css("border-bottom", "1px solid #ccc");
          div.on("click", function(event) {
            event.stopPropagation();
            zoomOld = 9;
            var ifZoom = expression.$attr("zoom");
            searchArea.val(elem.label);
            searchlist.children().remove();
            
            var removeCover = function(obj) {
              var find = obj.data.find(function(el) {
                return el.label == elem.label;
              });
              for(var i in obj.data) {
                obj.data[i].show = true;
                if(find) {
                  if(obj.data[i]) {
                    if(obj.data[i].value[0] == find.value[0] && obj.data[i].value[1] == find.value[1] && obj.data[i].label != find.label) {
                      obj.data[i].show = false;
                    }
                  }
                }
              }
            };
            if(ifZoom) {
              searching = true;
              var findPrev = baseOption.series.find(function(elem) {
                return elem.name == "level0";
              });
              var findDetail = baseOption.series.find(function(elem) {
                return elem.name == "level1";
              });
              removeCover(findDetail);
              findPrev.show = false;
              findDetail.show = true;
            };
            var highlight = baseOption.series.find(function(data) {
              return data.name == "highlight";
            });
            var select = baseOption.series.find(function(data) {
              return data.name == "select";
            });
            highlight.data = dtData.data.filter(function(el) {
              return el.label == elem.label;
            });
            highlight.show = true;
            if(select) {
              select.data = dt.data.filter(function(el) {
                return el.label == elem.label;
              });
            }
            var opt = target.getModel().getOption();
            opt.series[0].data = highlight.data;
            target.getModel().setOption(opt);
            
            if (baidumap.getZoom() == 9) {
              element.zoomTo(elem.value,true);
            } else {
              element.zoomTo(elem.value);
            }
          });
          return div;
        };
        var check = function(item) {
          if(key == "") {
            return true;
          } else {
            var pinyin = $$.chineseCharacterToPinyin(item);
            if(item.indexOf(key) != -1) {
              return true;
            } else if(pinyin.indexOf(key.toUpperCase()) != -1) {
              return true;
            } else {
              return false;
            }
          }
        }
        for(var i in slist) {
          if(check(slist[i].label)) {
            searchlist.append(createItem(slist[i]));
          }
        };
      });
      return detail;
    }
    var createDetail = function() {
      var detail = $("<div></div>").css("background-color", "#fff");
      ci = element.resource_applied;
      kpi = element.kpi_applied;
      if(ci[0]) {
        serviceCenterService.getValuesByCi(ci, kpi).then(function(data) {
          var dataline = data.series[0].data.filter(function(elem) {
            return elem.name.kpi.indexOf("告警") == -1;
          });
          var warningList = data.series[0].data.filter(function(elem) {
            return elem.name.kpi.indexOf("告警") != -1;
          });
          dataline = dataline.sort(function(a, b) {
            if(b.name.kpi == "项目总数") {
              return 1;
            } else {
              return -1;
            }
          });
          detail.css("position", "absolute");
          detail.css("z-index", 9);
          detail.css("left", "10px");
          detail.css("top", "10px");
          var colors = ["#3c8dbc", "#3c8dbc", "#aa0000", "#649835"];
          var loop = function(index, element) {
            var row = $("<div class='row' style='padding:10px;width:170px;'></div>");
            row.css("cursor", "pointer");
            row.css("background-color", "#fff");
            row.css("border-bottom", "1px solid #ddd");
            var col1 = $("<div class='col-md-12'>" + element.name.kpi + "</div>");
            col1.css("color", "#666");
            col1.css("font-size", "14px");
            col1.css("font-weight", "bold");
            var col2 = $("<div class='col-md-12'>" + element.value + "</div>");
            col2.css("color", colors[index]);
            col2.css("font-size", "30px");
            col2.css("font-weight", "bold");
            row.append(col1);
            row.append(col2);
            detail.append(row);
            row.on("click", function(event) {
              if(element.link) {
                window.open(element.link);
              }
            });
          }
          for(var i in dataline) {
            loop(i, dataline[i]);
          }
          var wp = $("<div></div>").css("padding", "10px");
          wp.css("background-color", "#fff");
          var getProgress = function(data) {
            var wrap = $("<div></div>").addClass("progress-group");
            var text = $("<span></span>").addClass("progress-text").text(data.name.kpi);
            var number = $("<span></span>").addClass("progress-number").text(data.value);
            var barWrap = $("<div></div>").addClass("progress sm");
            var bar = $("<div></div>").addClass("progress-bar")
              .css("width", (data.value / 10) * 100 + "%");
            switch(data.name.kpi) {
              case "严重告警计数":
                bar.css("background-color", "#e7675d");
                break;
              case "重要告警计数":
                bar.css("background-color", "#ed9700");
                break;
              case "次要告警计数":
                bar.css("background-color", "#e1cd0a");
                break;
              case "警告告警计数":
                bar.css("background-color", "#25bce7");
                break;
              default:
                bar.css("background-color", "#25bce7");
            }
            wrap.append(text).append(number).append(barWrap);
            barWrap.append(bar);
            bar.css("width", (number / 10) * 100 + "%");
            switch(true) {
              case parseInt(number) > 8:
                bar.removeClass().addClass("progress-bar progress-bar-green");
                break;
              case parseInt(number) > 5:
                bar.removeClass().addClass("progress-bar progress-bar-yellow");
                break;
              case parseInt(number) > 3:
                bar.removeClass().addClass("progress-bar progress-bar-yellow");
                break;
              case parseInt(number) > 1:
                bar.removeClass().addClass("progress-bar progress-bar-red");
                break;
              default:
                bar.removeClass().addClass("progress-bar progress-bar-red");
            }
            return wrap;
          }
          for(var i in warningList) {
            wp.append(getProgress(warningList[i]))
          };
          detail.append(wp);
        });
      }
      return detail;
    };
    var removeLast = function(data) {
      if(data.length > 0) {
        if(data[data.length - 1].length == 0) {
          return data.slice(0, -1)
        } else {
          return data;
        }
      } else {
        return data;
      }
    };
    var setTitle = function(target, text) {
      target.$attr("title/text", text);
    };
    var setSubtitle = function(target, text) {
      target.$attr("title/subtext", text);
    };
    var setAxisByCategory = function(target, dt, axis) {
      var removeBlankELement = function(array) {
        if(array) {
          if(array[array.length - 1].length == 0) {
            return array.slice(0, -1);
          } else {
            return array;
          }
        } else {
          return [];
        }
      };
      var data = removeBlankELement(dt);
      oriLength = dt[0].length;
      if(data.length >= target[axis].length) {
        for(var i = 0; i < target[axis].length; i++) {
          target[axis][i].type = 'category';
          target[axis][i].data = data[i];
        }
        var clone = target[axis][i - 1];
        for(var j = i; j < data.length; j++) {
          target[axis][j] = clone;
          target[axis][j].type = 'category';
          target[axis][j].data = data[j];
        }
      } else {
        for(var i = 0; i < data.length; i++) {
          target[axis][i].type = 'category';
          target[axis][i].data = data[i];
        }
        var clone = data[i - 1];
        for(var j = i; j < target[axis].length; j++) {
          target[axis][j].type = 'category';
          target[axis][j].data = clone;
        }
      }
    };
    var setAxisByValue = function(target, axis) {
      for(var i in target[axis]) {
        target[axis][i].type = "value";
      }
    };
    var system = {};
    var setSeries = function(target, data) {
      if(data) {
        var clone = removeLast(data);
        var inx = 0;
        for(var i in clone) {
          inx++;
          (function(index, dt) {
            var last;
            if(target.series[target.series.length - 1]) {
              last = target.series[target.series.length - 1].$clone();
            } else {
              last = {}
            }
            var style = target.series[index] == undefined ? last : target.series[index].$clone();
            style.name = dt.name;
            style.data = dt.data;
            style.show = dt.show;
            if(target.series[index] == undefined) {
              target.series[index] = style;
            }
            target.series[index].name = dt.name;
            target.series[index].data = dt.data;
            target.series[index].show = dt.show;
          })(i, clone[i]);
        }
        for(var j = inx; j < target.series.length; j++) {
          delete target.series[j];
        };
        removeEmptyStyle(target);

        function removeEmptyStyle(target) {
          target.series.$remove(function(index, element) {
            return !element.hasOwnProperty("data");
          });
        }
      }
    };
    var setLegend = function(target, data) {
      target.$attr("legend/data", data);
      if (target.hasOwnProperty("bmap")) { //如果是bmap的话，不显示legend
        target.$attr("legend/show", false);
      }
    };
    var setVisualMap = function(target, data) {
      var getBaseline = function() {
        var rs = [];
        var loop = function(index, item) {
          if(item.hasOwnProperty("baseline")) {
            rs.push({
              type: item.baseline,
              data: item.data
            })
          }
        };
        for(var i in data) {
          loop(i, data[i]);
        }
        return rs;
      };
      var baseline = getBaseline();
      var loop = function(index, item) {
        if(item.hasOwnProperty("baseline") == false) {
          var loop = function(index, elem, idata) {
            var compare = function(bl) {
              if(bl.type == "over") {
                return elem > bl.data[index];
              } else if(bl.type == "below") {
                return elem < bl.data[index];
              } else {
                return true;
              }
            };
            for(var i in baseline) {
              if(compare(baseline[i]) == false) {
                idata[index] = {
                  name: "alert",
                  value: elem
                };
                break;
              }
            };
          };
          for(var i in item.data) {
            loop(i, item.data[i], item.data)
          }
        }
      };
      for(var i in data) {
        loop(i, data[i])
      };
      return data;
    };
    var setKqiParameters = function(target, parameters, data) {
      setTitle(target, parameters.title);
      setSubtitle(target, parameters.subtitle);
      if(element.data.legend) {
        setLegend(target, data.getLegend());
      }
      var series = setVisualMap(target, data.getSeries());
      setSeries(target, series, data, system);
      if(element.data.xAxisType == "category") {
        setAxisByCategory(target, data.getxAxis(), 'xAxis');
      } else {
        setAxisByValue(target, 'xAxis');
      }
      if(element.data.yAxisType == "category") {
        setAxisByCategory(target, data.getxAxis(), 'yAxis');
      } else {
        setAxisByValue(target, 'yAxis');
      }
    };
    var setParameters = function(target, parameters, data) {
      var runExpression = function(expression, data, system) {
        var result;
        $$.runExpression(expression, function(funRes) {
          if(funRes.code == "0") {
            var fnResult = funRes.data;
            if(typeof fnResult == 'function') {
              result = fnResult(data, system);
            } else {
              result = fnResult;
            }
          } else {
            throw new Error(funRes.message);
          }
        });
        return result;
      };
      setTitle(target, parameters.title);
      setSubtitle(target, parameters.subtitle);
      var dtype = element.data.applied ? "bind" : "manual";
      var dt = runExpression(element.$attr("data/legend/" + dtype), data, system)
      if(element.data.legend) {
        setLegend(target, dt);
      }
      var series = setVisualMap(target, runExpression(element.$attr("data/series/" + dtype), data, system));
      if(baseOption.bmap && expression.showFilter == true) {
        var prev = series.find(function(element) {
          return element.name == "level0";
        });
        var detaildata = series.find(function(element) {
          return element.name == "level1";
        });
        var search = series.find(function(element) {
          return element.searchable == true;
        });
        if(detaildata) {
          detaildata.show = false;
        };
        if(previewMode) {
          echartDom.before(createDetail());
          if(expression.showSearch != false) {
            echartDom.before(createSearch(search));
          };
        };
        element.zoomTo = function(value,panTo) {
          var ifZoom = expression.$attr("zoom");
          if(ifZoom) {
            var point = new BMap.Point(value[0], value[1]); 
            if (!panTo) {
              baidumap.centerAndZoom(point,9);
            } else {
              baidumap.panTo(point)
            }
          };
        };
      }
      setSeries(target, series, data, system);
      if(baseOption.bmap && expression.showFilter == true) {
        if(prev.data.length == 1) {
          if(detaildata) {
            if(detaildata.$attr("data/0/value")) {
              baseOption.bmap.center = detaildata.$attr("data/0/value");
            }
          }
          timeout(function() {
            echartTarget.setOption(reconstruct(baseOption));
          });
        }
      }
      if(element.data.xAxisType == "category") {
        setAxisByCategory(target, runExpression(element.$attr("data/xAxis/" + dtype), data, system), 'xAxis');
      } else {
        setAxisByValue(target, 'xAxis');
      }
      if(element.data.yAxisType == "category") {
        setAxisByCategory(target, runExpression(element.$attr("data/yAxis/" + dtype), data, system), 'yAxis');
      } else {
        setAxisByValue(target, 'yAxis');
      }
    };
    var timespan = element.$attr("data/timespan") ? element.$attr("data/timespan") : 0;
    var frequency = element.$attr("data/frequency") ? element.$attr("data/frequency") : 0;
    var format = element.$attr("data/format") ? element.$attr("data/format") : "";
    var category = element.$attr("advance/category") ? element.$attr("advance/category") : "";
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
        console.log("advance/expression:" + element.$attr("advance/expression"));
      }
    });
    var condition;
    var validValue = function(val) {
      if(typeof val == "number") {
        return true;
      } else if(typeof val == "string") {
        return(/d+/).test(val);
      } else {
        return false;
      }
    }
    var checkHasValue = function(option) {
      var series = option.series;
      if(series instanceof Array) {
        return series.some(function(elem) {
          var hasVal = elem.data.some(function(el) {
            if(typeof el == "object") {
              return validValue(el.value);
            } else {
              return validValue(el);
            }
          });
          return hasVal;
        });
      } else {
        return false;
      }
    };
    var showNoDataSign = function() {
      var find = wrap.find(".showNoDataSign");
      if(find.size() == 0) {
        var div = $("<div></div>");
        var height = wrap.height();
        var text = $("<div></div>");
        text.css("color", "#fff");
        text.css("text-align", "center");
        text.text("视图无数据输入！");
        text.css("line-height", 20 + "px");
        div.addClass("showNoDataSign");
        div.css("width", "100%");
        div.css("height", 20 + "px");
        div.css("position", "absolute")
        div.css("background-color", "rgba(0,0,0,.6)");
        div.css("z-index", 9);
        div.append(text);
        wrap.prepend(div);
      }
    };
    var hideNoDataSign = function() {
      var find = wrap.find(".showNoDataSign");
      find.remove();
    };
    var uuid = Math.uuid();
    extension.customCategory = element.$attr("advance/custom_category");
    extension.aggregate_type = element.$attr("data/aggregate_type");
    extension.granularityUnit = element.$attr("data/granularityUnit");
    extension.aggregate_instance = element.$attr("data/aggregate_instance");
    extension.simulate = expression.simulate;
    var method = element.$attr("advance/getfunction") ? element.$attr("advance/getfunction") : 'kpiDataService.getValueList';
    var type = element.$attr("advance/paramtype") ? element.$attr("advance/paramtype") : "kpi";
    extension.aggregate_rule = element.$attr("data/aggregate_rule") ? element.$attr("data/aggregate_rule") : 0;
    extension.autoFillBlank = element.$attr("data/autoFillBlank") ? element.$attr("data/autoFillBlank") : false;
    var zoomEchartMap = function(zoom) {
      var ifZoom = expression.$attr("zoom");
      if(ifZoom) {
        if (searching) {
          var legend = [{
            name: "level1"
          },{
            name: "highlight"
          }];
          echartTarget.dispatchAction({
            type: 'legendSelect',
            batch: legend
          });
          var unlegend = [{
            name: "level0"
          }];
          echartTarget.dispatchAction({
            type: 'legendUnSelect',
            batch: unlegend
          });
          searching = false;
          return;
        }
        if(zoom < 9 && zoomOld >= 9) {
          var legend = [{
            name: "level0"
          }];
          echartTarget.dispatchAction({
            type: 'legendSelect',
            batch: legend
          });
          var unlegend = [{
            name: "level1"
          },{
            name: "highlight"
          }];
          echartTarget.dispatchAction({
            type: 'legendUnSelect',
            batch: unlegend
          });
        } else if(zoom >= 9 && zoomOld < 9) {
          var legend = [{
            name: "level1"
          }];
          echartTarget.dispatchAction({
            type: 'legendSelect',
            batch: legend
          });
          var unlegend = [{
            name: "level0"
          },{
            name: "highlight"
          }];
          echartTarget.dispatchAction({
            type: 'legendUnSelect',
            batch: unlegend
          });
        }
        zoomOld = zoom;
      }
    };
    run = function(data) {
      baseOption = angularStyle.echartToOption(element.echart);
      if(typeof target.hideLoading == "function") {
        target.hideLoading();
      }
      var setOption = function(baseOption) {
        try {
          target.setOption(reconstruct(baseOption));

          // 获取百度地图实例，使用百度地图自带的控件
          if (target.getModel() && target.getModel().getComponent('bmap')) {
            baidumap = target.getModel().getComponent('bmap').getBMap();
            zoomOld = baidumap.getZoom();
            target.on("bmapRoam", function() {
              zoomEchartMap(baidumap.getZoom())
            })
          }
        } catch(e) {
          if(route.current.$$route.controller == "freeStyleCtrl") {
            growl.error("组件［视图］的传入参数发生错误！");
          }
          console.log("echartinstance.setOption传入参数错误", baseOption);
        };
      };
      $(window).on("resize", function(event) {
        target.resize();
      });
      if(expression.customOption) {
        baseOption = data[category].getOption();
        setOption(baseOption);
      } else {
        if(typeof element.parameters == "object") {
          setParameters(baseOption, element.parameters, data);
        };
        setOption(baseOption);
      };
    };
    var runKqiModel = function() {
      var kqiModelId = kqiModel.id;
      kqiManagerUIService.getKqiModelById(kqiModelId, function(event) {
        if(event.code == "0") {
          var kqiModel = event.data;
          var viewContent = JSON.parse(kqiModel.viewContent);
          var expression = eval("(" + viewContent.expression + ")");
          var simulate = viewContent.simulate;
          var variables = viewContent.variables;
          var obj = {};
          var series = [];
          var xAxis = [];
          var inx = 0;
          obj.getLegend = function() {
            return variables.map(function(elem) {
              return elem.name;
            }).concat(['kqi'])
          };
          obj.getxAxis = function() {
            return [xAxis];
          };
          obj.getSeries = function() {
            return series
          };
          var loopVar = function(variable) {
            var name = variable.name;
            var ob = {
              name: name,
              data: []
            };
            for(var j in simulate) {
              if(simulate[j][name]) {
                ob.data = ob.data.concat(simulate[j][name].split(",").map(function(elem) {
                  return parseInt(elem);
                }));
              }
            }
            series.push(ob);
          };
          for(var i in variables) {
            loopVar(variables[i]);
          }
          var kqiObj = {
            name: "kqi",
            data: []
          };
          var calKqi = function(sim) {
            var arr = [];
            for(var k in variables) {
              if(sim[variables[k].name]) {
                sim[variables[k].name] = sim[variables[k].name].split(",").map(function(elem) {
                  return parseInt(elem);
                });
              }
            }
            arr[sim[variables[0]['name']].length - 1] = expression(sim);
            for(var l in sim[variables[0]['name']]) {
              arr[l] = expression(sim);
              xAxis.push(inx);
              inx++;
            }
            kqiObj.data = kqiObj.data.concat(arr);
          }
          for(var j in simulate) {
            calKqi(simulate[j])
          }
          series.push(kqiObj);
          setKqiParameters(baseOption, element.parameters, obj);
          target.hideLoading();
          target.setOption(reconstruct(baseOption));
          baidumap = target.getModel().getComponent('bmap').getBMap();
          zoomOld = baidumap.getZoom();
          target.on("bmapRoam", function() {
            zoomEchartMap(baidumap.getZoom())
          })
        }
      });
    }
    element.setCondition = function(cond) {
      element.$attr("advance/condition", cond);
    };
    element.getAisInfos = function() {
      var baseConfig = scope.$$childTail.baseConfig;
      if(baseConfig && baseConfig.projectConfig && baseConfig.projectConfig.extendService == "AIS") {
        var interval = baseConfig.projectConfig.updateInterval ? baseConfig.projectConfig.updateInterval : 60000;
        var updateInfo = function() {
          thridPartyApiService.getSignalShipInfo("413149000", function(returnObj) {
            if(returnObj.code == 0) {
              echartTarget.setOption(reconstruct(baseOption));
            }
          })
        }
        var aisInterval = setInterval(function() {
          updateInfo()
        }, interval)
        updateInfo()
      }
    };
    element.unrender = function() {
      console.log("on-destroy");
      SwSocket.unregister(uuid);
      target.clear()
    }
    element.render = function(data) {
      var ci = element.resource_applied;
      var kpi = element.kpi_applied;
      var startTime = element.resource_time.startTime;
      var endTime = element.resource_time.endTime;
      var getValueList = function(data) {
        element.rawData = data;
        Object.defineProperty(element, "rawData", {
          enumerable: false
        });
        run(data);
      };
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
      var failure = function(data) {
        run(data);
      };
      var kpiQueryModel = {
        category: category,
        isRealTimeData: true,
        nodeIds: ci.map(function(elem) {
          return elem.id
        }),
        kpiCodes: kpi.map(function(elem) {
          return elem.id
        }),
        startTime: startTime ? startTime : null,
        endTime: endTime ? endTime : null,
        timeRange: "",
        statisticType: "psiot",
        includeInstance: true,
        timePeriod: getTime(timespan),
        aggregateType: extension.aggregate_type,
        aggregate_rule: extension.aggregate_rule,
        aggregate_instance: extension.aggregate_instance,
        granularityUnit: extension.granularityUnit,
        condList: []
      };
      /**
      $$.runExpression(element.$attr("advance/condition"), function(funRes){
        if(funRes.code == "0"){
          var fnResult = funRes.data;
          condition = fnResult;
        } else {
          throw new Error(funRes.message);
        }
      });*/
      var condi = element.$attr("advance/condition");
      condi = condi ? condi : "";
      var condition;
      try {
        condition = eval(condi);
      } catch(e) {

      };
      if(condition == undefined) {
        condition = JSON.parse(condi);
      }
      if(data) {
        extension.simuData = data;
      }
      serviceCenterService.getValueListBytime(ci, kpi, timespan, frequency, format, category, type, method, condition, extension, kpiQueryModel).then(getValueList, failure);
      var paramSocket = {
        ciid: ci.map(function(el) {
          return el.id;
        }).toString(),
        kpi: kpi.map(function(el) {
          return el.id;
        }).toString()
      };

      var operation = "register";
      var SwSocket_success = function(ec, bo, ci, kpi, data) {
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
        if(data) {
          var ts = element.$attr("rawData/category/timestamps") || [];
          if(ts) {
            var firstTime = ts[0] || 0;
            var tspan = getTime(timespan);
            var ciName = ci.find(function(el) {
              return data.nodeId == el.id;
            });
            var kpiName = kpi.find(function(el) {
              return data.kpiCode == el.id;
            });
            var change = baseOption.series.filter(function(data) {
              return data.name == kpiName.label;
            });
            var nochange = baseOption.series.filter(function(data) {
              return data.name != kpiName.label;
            });
            if(change.length > 0) {
              var dt = new Date();
              var timestamp = dt.getTime();
              baseOption.xAxis[0].data.push(dt.FormatByString(format));
              change[0].data.push(data.value);
              for(var j in nochange) {
                nochange[j].data.push(nochange[j].data[nochange[j].data.length - 1]);
              };
              if((timestamp - firstTime) > tspan) {
                baseOption.xAxis[0].data.shift();
                change[0].data.shift();
                for(var j in nochange) {
                  nochange[j].data.shift();
                };
              }
              ec.setOption(baseOption);
            }
          }
        }
      };

      /**
      test = function(ci, kpi, ec, baseOption){
        timeout(function(){
          SwSocket_success(ec, baseOption, ci, kpi, {
            nodeId : ci[0].id,
            kpiCode : kpi[0].id,
            value : 30
          });
          test(ci, kpi, ec, baseOption);
        }, 3000);
      };
      test(ci, kpi, echartTarget, baseOption);
      */
      (function(ec, baseOption, ci, kpi) {
        SwSocket.register(uuid, operation, function(event) {
          SwSocket_success(ec, baseOption, ci, kpi, event.data);
        });
        SwSocket.send(uuid, operation, 'kpi', paramSocket);
      })(echartTarget, baseOption, ci, kpi);
    };
    if(element.style) {
      wrap.css(element.style)
      echartDom.css("height", element.style.height);
      wrap.css("height", "auto");
    };
    baseOption = angularStyle.echartToOption(element.echart);
    timeout(function() {
      $$.loadExternalJs(['echarts', 'macarons'], function(echarts) {
        var getCiKpi_back = function(ci, kpi) {
          element.resource_applied = ci;
          element.kpi_applied = kpi;
          var start = function() {
            tg.ec = echartTarget = target = echarts.init(echartDom[0], "macarons");
            target.on("click", function(event) {
              event.event.cancelBubble = true;
              var clickFn = expression.$attr("on/click");
              if(typeof clickFn == "function") {
                try {
                  clickFn({
                    echart: event,
                    global: global,
                    target: element
                  })
                } catch(e) {
                  if(route.current.$$route.controller == "freeStyleCtrl") {
                    growl.error("组件［视图］的点击事件表达式配置发生错误！");
                  };
                  console.log(e);
                }

              };
            });
            target.showLoading();
            var init = function() {
              if(kqiModel) {
                runKqiModel();
              } else {
                element.render();
              }
            };
            var initFn = expression.$attr("on/init")
            if(typeof initFn == "function") {
              try {
                initFn({
                  target: element,
                  global: global
                })
              } catch(e) {
                if(route.current.$$route.controller == "freeStyleCtrl") {
                  growl.error("组件［视图］的初始化表达式配置发生错误！");
                };
                console.log(e);
              };
            } else {
              if(expression.$attr("autoload") != false) {
                init();
              }
            }
          };
          if(baseOption.bmap) {
            require(['baiduMap', 'bmap'], function(a, b) {
              var count = 0;
              wait();
              function wait() {
                if(count < 20) {
                  count += 1;
                  timeout(function() {
                    if(window.BMap == undefined) {
                      wait();
                    } else {
                      start();
                    }
                  });
                } else {
                  throw new Error('百度视图获取失败!!');
                }
              }
            }, function error() {
              console.log('百度地图加载失败!');
              start();
            });
          } else if(baseOption.geo) {
            var type = baseOption.geo.map;
            if(mapJson) {
              echarts.registerMap(type, mapJson);
              system.mapJson = mapJson;
              start();
            } else {
              var path = "../localdb/" + type + ".json";
              var info = Info.get(path, function(cJson) {
                mapJson = cJson;
                system.mapJson = mapJson;
                echarts.registerMap(type, mapJson);
                start();
              });
            }
          } else {
            start();
          }
        };
        element.getCiKpi(getCiKpi_back);
      });
    });
    return wrap;
  }
});