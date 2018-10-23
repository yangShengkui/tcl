/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var url = element.$attr("parameters/url");
    var style = element.$attr("style");
    style = style ? style : {};
    var expression,initFn;
    
    var wrapFrame = $("<div class='embed-responsive embed-responsive-16by9'></div>");
    var target = $("<iframe class='embed-responsive-item'></iframe>");
    target.css(style);
    
    wrapFrame.append(target);
    //window.top = {};
    wrapFrame.css("width", "100%");
    wrapFrame.css("height", "calc( 100vh - 100px)");
    
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        expression = fnResult;
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    initFn = expression.$attr("on/init");
    if(typeof initFn == "function") {
      try {
        initFn({
          target: element,
          self: target
        })
      } catch(e) {
        console.log(e);
      };
    } else if(url) {
      target.attr("src",url);
    }
    
    element.render = function(inputUrl) {
      /**
      var inputurl = "&kw="+params.mmsi;
      localStorage.setItem("AISINFO", JSON.stringify(params));
      */
      target.attr("src",inputUrl);
    };
    element.linkTo = function(url){
      target.attr("src",url);
    }
    return target;
  }
});
