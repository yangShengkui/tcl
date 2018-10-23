function tool(data) {
  element.initialize(function(){

  });
  /**
  var element = data.element;
  var global = data.global;
  var target = $("<div></div>");
  var route = data.route;
  if(element.style) {
    target.css(element.style);
  };
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
  var render = function(){
  };
  element.render = render
  if(initFn){
    try {
      initFn({
        target : element,
        global : global
      })
    } catch(e){
      element.growl(e.message, "warning");
    }
  } else {
    render();
  };*/
  return target;
}