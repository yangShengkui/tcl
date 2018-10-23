/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var element = data.element;
    var global = data.global;
    var target = data.target;
    var route = data.route;
    if(element.style) {
      target.css(element.style);
    };
    if(route.current.$$route.controller == "freeBoardCtrl"){
      target.css("display", "block");
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
        console.log(funRes.message);
        //throw new Error(funRes.message);
      }
    });
    var clickFn = expression.$attr("on/click");
    var initFn = expression.$attr("on/init");
    target.on("click", function(event){
      if(typeof clickFn == "function"){
        target.css("cursor", "pointer");
        if(route.current.$$route.controller != "freeBoardCtrl"){
          clickFn({
            target : element,
            global : global
          })
        };
      }
    });
    element.setCss = function(css){
      target.css(css);
    }
    element.setInvisible = function(isFlag){
      target.css("display", "none");
      if(isFlag) {
        target.css("display", "block");
      }
    }
    if(initFn){
      try {
        initFn({
          target : element,
          global : global
        })
      } catch(e){
        element.growl(e.message, "warning");
      }
    }
  }
});
