/**
 * Created by leonlin on 16/11/3.
 */
/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var innerContent = $("<div></div>");
    var ulDom = $('<ul class="nav nav-pills"></ul>');
    var header = $("<thead><th>时间</th><th>数据</th></thead>");
    var tbody = $("<tbody></tbody>");
    var table = $("<table width='100%' class='table table-hover no-margin'>");
    var element = data.element;
    var serviceCenterService = data.serviceCenterService;
    var timeout = data.timeout;
    var global = data.global;
    var removeLast = function(data){
      if(data.length > 0)
      {
        if(data[data.length - 1].length == 0)
        {
          return data.slice(0,-1)
        }
        else
        {
          return data;
        }
      }
      else
      {
        return data;
      }
    };
    var setAxisByCategory = function(target, dt, axis) {
      var removeBlankELement = function(array) {
        if(array) {
          if(array[array.length - 1].length == 0)
          {
            return array.slice(0,-1);
          }
          else
          {
            return array;
          }
        }
        else
        {
          return [];
        }
      }
      var data = removeBlankELement(dt);
      if(data.length >= target[axis].length) {
        for(var i = 0; i < target[axis].length; i++)
        {
          target[axis][i].type = 'category';
          target[axis][i].data = data[i];
        }
        var clone = target[axis][i - 1];
        for(var j = i; j < data.length; j++)
        {
          target[axis][j] = clone;
          target[axis][j].type = 'category';
          target[axis][j].data = data[j];
        }
      }
      else {
        for(var i = 0; i < data.length; i++)
        {
          target[axis][i].type = 'category';
          target[axis][i].data = data[i];
        }
        var clone = data[i - 1];
        for(var j = i; j < target[axis].length; j++)
        {
          target[axis][j].type = 'category';
          target[axis][j].data = clone;
        }
      }
    };
    var system = {};
    var setSeries = function(target, data) {
      if(data) {
        var clone = removeLast(data)
        for(var i in clone) {
          (function(index, dt){
            var last;
            if(target.series[target.series.length - 1]){
              last = target.series[target.series.length - 1].$clone();
            } else {
              last = {}
            }
            var style = target.series[index] == undefined ? last : target.series[index].$clone();
            style.name = dt.name;
            style.data = dt.data;
            if(target.series[index] == undefined)
            {
              target.series[index] = style;
            }
            target.series[index].name = dt.name;
            target.series[index].data = dt.data;
          })(i, clone[i]);
        }
        removeEmptyStyle(target);
        function removeEmptyStyle(target){
          target.series.$remove(function(index, element){
            if(element.hasOwnProperty("data"))
            {
              if(element.data.length > 0 )
              {
                return false;
              }
            }
            return true;
          });
        }
      }
    };
    var setLegend = function(target, data) {
      target.$attr("legend/data", data);
    };
    var setParameters = function(target, data){
      var runExpression = function(expression, data, system){
        var result;
        $$.runExpression(expression, function(funRes){
          if(funRes.code == "0"){
            var fnResult = funRes.data;
            if(typeof fnResult == 'function'){
              result = fnResult(data, system);
              return result;
            }else{
              return result;
            }
          } else {
            throw new Error(funRes.message);
          }
        });
        return result;
      };
      var dtype = element.$attr("data/applied") ? "bind" : "manual";
      if(element.$attr("data/legend")) {
        setLegend(target, runExpression(element.$attr("data/legend")[dtype], data, system));
      }
      setSeries(target, runExpression(element.$attr("data/series")[dtype], data, system));
      setAxisByCategory(target, runExpression(element.$attr("data/xAxis")[dtype], data, system), 'xAxis');
    };
    if(element.$attr("attributes/vertical") == true) {

      table.append(header).append(tbody);
    } else {
      table.append(tbody);
    };
    innerContent.append(ulDom);
    innerContent.append(table)
    var baseOption = {
      series : [{}],
      legend : {
        data : []
      },
      xAxis : [{
        type : "category",
        data : []
      }]
    };
    if(element.style) {
      innerContent.css(element.style);
    };
    timeout(function(){
      var getCiKpi_back = function(ci, kpi){
        var timespan = element.$attr("data/timespan") ? element.$attr("data/timespan") : 0;
        var frequency = element.$attr("data/frequency") ? element.$attr("data/frequency") : 0;
        var format = element.$attr("data/format") ? element.$attr("data/format") : "";
        var category = element.$attr("advance/category") ? element.$attr("advance/category") : "";
        var expression
        $$.runExpression(element.$attr("advance/expression"), function(fnResult){
          if(fnResult.code == "0"){
            var rs = fnResult.data;
            expression = rs ? rs : {};
          } else {
            throw new Error(fnResult.message);
          }
        });
        var condition;
        $$.runExpression(element.$attr("advance/condition"), function(fnResult){
          if(fnResult.code == "0"){
            var rs = fnResult.data;
            condition = rs ? rs : {};
          } else {
            throw new Error(fnResult.message);
          }
        });
        var method = element.$attr("advance/getfunction") ? element.$attr("advance/getfunction") : 'kpiDataService.getValueList';
        var type = element.$attr("advance/paramtype") ? element.$attr("advance/paramtype") : "kpi";
        if(element.$attr("data/applied")) {
          serviceCenterService.getValueListBytime(ci, kpi, timespan, frequency, format, category, type, method, condition).then(getValueList, failure);
        } else {
          run({});
        }
        function getValueList(data) {
          run(data);
        };
        function failure(data) {
          run(data);
        };
        function run(data) {
          var addEvents = function(dom, events){
            var addEvent = function(event, handler){
              dom.on(event, function(evt){
                handler({
                  echart : evt,
                  global : global,
                  tools : data,
                  ui : element
                })
              });
            };
            for(var i in events){
              addEvent(i, events[i]);
            };
          };
          setParameters(baseOption, data);
          addEvents(innerContent, expression.$attr("on"));
          var setOptioin = function(baseOption) {
            if(element.$attr("parameters/vertical")== true) {
              var curInx = 0;
              ulDom.children().remove();
              var loop = function(i, series){
                var tab = $('<li><a>' + baseOption.legend.data[i] + '</a></li>');
                var renderTbody = function(data) {
                  tbody.children().remove();
                  for(var j in data) {
                    var content = $("<tr></tr>");;
                    var td1 = $("<td></td>").css("width", "50%").text(xAxis[j]);
                    var td2 = $("<td></td>").css("width", "50%").text(data[j]);
                    content.append(td1).append(td2);
                    tbody.append(content);
                  }
                };
                tab.css('cursor', 'pointer');
                tab.data('inx', i)
                if(i==curInx) {
                  tab.addClass("active");
                }
                ulDom.append(tab);
                tab.on("click", function(){
                  ulDom.find("li").removeClass('active');
                  $(this).addClass('active');
                  renderTbody(series[i].data);
                });
                renderTbody(series[i].data);
              };
              for(var i in baseOption.series) {
                loop(i, baseOption.series)
              }
            } else {
              tbody.children().remove();
              var createTh = function(xAxis){
                var tr = $('<tr></tr>');
                tr.append($("<th></th>").text("时间"));
                var createTd = function(i, data){
                  var th = $("<th></th>").text(data).css("text-align", "center");
                  if(i%2 == 0){
                    th.css("background-color", "#eee");
                  }
                  return th;
                }
                for(var i in xAxis){
                  tr.append(createTd(i, xAxis[i]))
                }
                return tr;
              };
              var createTr = function(i, serie){
                var tr = $('<tr></tr>');
                var th = $('<th></th>')
                  .css("color", "#3c8dbc")
                  .css("text-align", "left")
                  .text(baseOption.legend.data[i]);
                var addTdDom = function(inx, data){
                  var td = $('<td></td>')
                    .css("color", "#777")
                    .css("text-align", "center")
                    .css("font-weight", "bold")
                    .text(data);
                  if(i%2 == 0){
                    td.css("background-color", "#eee");
                  }
                  return td;
                };
                tr.append(th);
                tbody.append(tr);
                for(var i in serie.data) {
                  tr.append(addTdDom(i, serie.data[i]));
                }
              };
              tbody.append(createTh(baseOption.xAxis[0].data));
              for(var i in baseOption.series) {
                tbody.append(createTr(i, baseOption.series[i]));
              }
            }
          };
          if(typeof element.parameters == "object") {
            setParameters(baseOption, element.parameters, data);
          };
          setOptioin(baseOption)
        };
      };
      element.getCiKpi(getCiKpi_back);
    });
    return innerContent;
  }
});