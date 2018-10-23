/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var timeout = data.timeout;
    var wrap = $("<div></div>");
var sparkline = $("<div></div>").addClass("description-block margin-bottom");
    wrap.append(sparkline);
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
        console.log(funRes.message);
        //throw new Error(funRes.message);
      }
    });
    var initFn = expression.$attr("on/init");
    var render = function(config) {
      sparkline.children().remove();
      var sparkbar =  $("<div></div>").addClass("sparkbar pad");
      var h5 = $("<h5></h5>")
        .addClass("description-header")
        .css("color", config.color);
      var span = $("<span></span>")
        .addClass("description-text")
        .css("color", config.color);
      span.text(config.title);
      sparkline.append(sparkbar).append(h5).append(span);
      timeout(function(){
        sparkbar.sparkline(config.data, {type: 'bar', barColor: config.color });
      });
      h5.text(elem.data.toString());
    };
    element.render = render;
    timeout(function(){
      $$.loadExternalJs(['sparkline'], function(sparkline){
        if(initFn){
          initFn({
            target : element
          })
        }
      });
    });
    return wrap;
  }
});
