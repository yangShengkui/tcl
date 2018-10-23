/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var wrap = $("<div></div>");
    var element = data.element;
    var global = data.global;
    var timeout = data.timeout;
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
    var renderFn = expression.render;
    var config = expression.config;
    var initFn = expression.$attr("on/init");
    config = config ? config : {};
    var render = function(data){
      var dom = $("<div></div>");
      dom.css("display", "none");
      var renderItem = function(item){
        if(typeof renderFn == "function"){
          return renderFn({
            target : element,
            global : global,
            item : item
          });
        }
      };
      for(var i in data){
        dom.append(renderItem(data[i]));
      }
      $$.loadExternalJs(['slick'], function(){
        timeout(function(){
          dom.css("display", "block");
          dom.slick(config);
        });
      });
      wrap.append(dom);
    };
    element.render = render;
    if(typeof initFn == "function"){
      try {
        initFn({
          target : element,
          global : global
        });
      } catch(e){
        console.log(e);
      };
    } else {

    };
    wrap.css("width", "calc(100% - 60px)");
    wrap.css("margin", "auto");
    return wrap;
  }
});
