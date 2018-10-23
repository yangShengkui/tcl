/**
 * Created by leonlin on 16/11/3.
 */

define([], function () {
  return function (data) {
    var global = data.global;
    var traverseRow = data.traverseRow;
    var traverseColumn = data.traverseColumn;
    var element = data.element;
    var timeout = data.timeout;
    var previewMode = data.previewMode;
    var col = element.$attr("parameters/col");
    var wrap = $("<div></div>").addClass("repeater row");
    var child = element.children[0];
    var prevElem = {};
    var getOption = element.$attr("advance/getListTable");
    var expression;
    var scope = data.scope;
    $$.runExpression(element.$attr("advance/expression"), function (funRes) {

      if (funRes.code == "0") {
        var fnResult = funRes.data;
        if (typeof fnResult == 'function') {
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
    var initFn = expression.$attr("on/init");
    child.col = [Math.floor(12 / col), 12 % col];
    var render = function (data) {
      var selfcol = element.getValue("repeater/col");
      var maxSelfcol = element.getValue("repeater/maxcol") ? element.getValue("repeater/maxcol") : 6;
      var updown = element.getValue("repeater/updown");
      child.allNum = selfcol;
      child.maxNum = maxSelfcol;
      child.redundantNum = selfcol % maxSelfcol;
      child.updown = updown
      if(maxSelfcol){
          if(selfcol > maxSelfcol){
              selfcol = maxSelfcol
          }
      }
      if (selfcol) {
        child.col = [Math.floor(12 / selfcol), 12 % selfcol];
      }
      var children = [];
      var cloneChild = function (dt) {
        var clone = child.$clone();
        clone.traveseByChild(function (el) {
          Object.defineProperty(el, "$repeatData", {value: dt, enumerable: false});
        });
        return clone;
      };
      for (var i in data) {
        children.push(cloneChild(data[i]));
      }
      prevElem.children = children;
      prevElem.traverse(function () {
      });
      wrap.children().remove();
      traverseColumn(wrap, prevElem.children, previewMode, function (elem) {

        // 做一个弹框
        elem.createCurrentStatusByItem = function (tc, pos) {

          $(".pupop").remove();
          // 判断显示的宽度，高度所在的位置。
          var left, top;
          if (pos.screenWidth - pos.clientX >= 400) {
            left = pos.clientX + 5
          } else {
            left = pos.clientX - 405
          }
          var popup, close;
          popup = $("<div class='pupop'></div>");
          close = $("<i class=\"fa fa-times\" ></i>");
          popup.css({
            "z-index": "99",
            "min-width": "400px",
            "height": "84px",
            "position": "fixed",
            "box-shadow": "1px 1px 10px 1px rgba(0,0,0,.5)",
            "border": "1px solid #000",
            "left": left + "px",
            "top": pos.clientY + "px",
            "overflow": "auto",
            "background-color": "rgba(30,65,93,.9)"
          });
          close.css({
            "position": "absolute",
            "right": "2px",
            "font-size": "16px",
          })
          close.click(function () {
            $(".pupop").remove();
          })
          popup.append(close);
          var table = $("<table></table>")
          var tr = $("<tr><td>基地</td><td>厂部</td><td>产线</td><td style='width: 150px'>设备名称</td></tr>");
          table.css({
            "width": "100%",
            "text-align": "center",
            "margin-top": "15px"

          });
          tr.css({
            "border-bottom": "1px solid #eee",
            "padding": "5px 6px 1px 6px",
          });
          table.append(tr);
          // var tableData = element.getdomainListName(tc);
          for (var i = 0; i < tc.length; i++) {
            var tableData = element.getdomainNameHandler(tc[i].domainPath,[]);
            var TD = $('<tr><td>' + tableData[0] + '</td><td>' + tableData[1] + '</td><td>' + tableData[2]+ '</td><td>' + tc[i].label + '</td></tr>>');
            table.append(TD)
          }
          popup.append(table)
          wrap.append(popup)
          return wrap;

        }
        var expression;
        $$.runExpression(elem.$attr("advance/expression"), function (funRes) {
          if (funRes.code == "0") {
            var fnResult = funRes.data;
            if (typeof fnResult == 'function') {
              expression = fnResult(data);
            } else {
              expression = fnResult;
            }
            expression = expression ? expression : {};
          } else {
            throw new Error(funRes.message);
          }
        });
        var repeatFn = expression.$attr("on/repeat");
        if (repeatFn) {
          repeatFn({
            target: elem,
            data: elem.$repeatData
          })
        }
      });
    };
    element.render = render;
    var start = function () {
      if (getOption == "newdevice") {
        element.getLatestDevices(function (devices) {
          element.render(devices);
        });
      } else if (getOption == "workorder") {
        element.getTicketsByStatus(function (workorder) {
          element.render(workorder);
        });
      } else if (getOption == "energyType") {
        element.energyTypeList(function (energyType) {
          element.render(energyType);
        });
      } else if (getOption == "allprojects") {
        element.getCurrentProjects(function (projects) {
          element.render(projects);
        });
      } else if (getOption == "alert") {
        element.getAlerts(function (workorder) {
          element.render(workorder);
        });
      } else if (getOption == "currentDirectiveByDevice") {
        element.currentDirective(function (directives) {
          element.render(directives);
        });
      } else if (getOption == "currentAlertByDevice") {
        element.getCurrentAlert(function (alerts) {
          element.render(alerts);
        });
      } else if (getOption == "currentAlertByProject") {
        element.getCurrentAlertByProject(function (alerts) {
          element.render(alerts);
        });
      }
    };


    if (previewMode) {
      if (typeof initFn == "function") {
        try {
          initFn({
            target: element,
            global: global,
            scope: scope
          })
        } catch (e) {
          console.log(e);
        }
      } else {
        start();
      }
    } else {
      traverseColumn(wrap, element.children, previewMode);
    }
    return wrap;
  }
});
