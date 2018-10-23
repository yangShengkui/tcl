/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var previewMode = data.previewMode;
    var innerContent = $("<div></div>");
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          expression = fnResult(data);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    var global = data.global;
    var growl = data.growl;
    var wrap = $("<div></div>").addClass("toggle-wrap");
    var inner = $("<div></div>").addClass("toggle-inner");
    wrap.append(inner);
    var customevents = {
      ready : "ready"
    };
    var addEvents = function(dom, events){
      var addEvent = function(event, handler){
        if(customevents[event]){
          customevents[event] = handler;
        } else {
          dom.on(event, function(evt){
            handler({
              jquery : evt,
              global : global,
              tools : data,
              ui : element
            })
          });
        }
      };
      for(var i in events){
        addEvent(i, events[i]);
      };
    };
    addEvents(innerContent, expression.$attr("on"));
    innerContent.append(wrap);
    var initFn = expression.$attr("on/init");
    var render = function(data) {
      if (!data || data == 0)
        wrap.addClass("active");
      else
        wrap.removeClass("active");
      if(previewMode){
        wrap.on("click", function(event){
          if(wrap.hasClass("active")){
            element.toggle = 1;
            wrap.removeClass("active");
          } else {
            element.toggle = 0;
            wrap.addClass("active");
          }
        });
      }
    };
    element.render = render;
    if(initFn){
      try {
        initFn({
          target : element
        });
      } catch(e){
        console.log(e);
      };
    } else {
      if(typeof customevents.ready == "function"){
        customevents.ready({
          target : element,
          global : global,
          tools : data,
          ui : element
        })
      } else{
        render();
      };
    };
    
    if(element.style) {
      innerContent.css(element.style);
    };
    return innerContent;
  }
});