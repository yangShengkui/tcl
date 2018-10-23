/**
 * Created by leonlin on 16/11/3.
 */
define([], function() {
  return function(data) {
    var serviceCenterService = data.serviceCenterService;
    var element = data.element;
    var global = data.global;
    var previewMode = data.previewMode;
    var text = $("<div></div>");
    if(element.$attr("data/text")) {
      element.$attr("data/series", element.$attr("data/text"));
      delete element.data.text;
    }
    if(element.style) {
      text.css(element.style);
    }

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
        expression = {};
        console.log("advance/expression:" + element.$attr("advance/expression"));
      }
    });
    element.setText = function(value) {
      text.text(value);
    };
    var initFn = expression.$attr("on/init");
    var repeatFn = expression.$attr("on/repeat");
    if(typeof initFn == "function") {
      try {
        initFn({
          target: element
        })
      } catch(e) {
        console.log(e);
      }
    } else if(typeof repeatFn == "function") {
      try {
        repeatFn({
          target: element
        })
      } catch(e) {
        console.log(e);
      }
    } else {
      if(element.data && element.data.resource.length > 0 && element.data.kpi.length >0) {
        var findId = function(elem) {
          return elem.id;
        }
        var ci = element.data.resource.map(findId)
        var kpi = element.data.kpi.map(findId);
        element.getKpiValueCi(ci, kpi, function(data) {
          data = data == undefined ? "-" : data;
          text.text(data);
        })
      }
    }
    return text;
  }
});