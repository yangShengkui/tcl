/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(commonMethod){
  return function(data) {
    var wrap = $("<div></div>").addClass("input-group");
    wrap.css("width", "calc(100% - 10px)");
    var route = data.route;
    var growl = data.growl;
    var element = data.element;
    var global = data.global;
    var expression;
    var dom;
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == 0){
        expression = funRes.data;
        expression = expression ? expression : {};
      } else {
        expression = {};
      }
    });
    var title = element.$attr("parameters/title");
    var initFn = expression.$attr("on/init");
    var createPart = function(format){
      if(format.type == "text"){
        dom = $("<span></span>").addClass("input-group-addon");
        dom.text(format.value);
        if(format.value){
          wrap.append(dom);
        };
      } else if(format.type == "input"){
        dom = $("<input />").addClass("form-control");
        dom.val(format.value);
        dom.on("change", function(event){
          var changeFn = expression.$attr("on/change");
          if(typeof changeFn == "function"){
            changeFn({
              target : element,
              element : element,
              global : global,
              value: dom.val()
            })
          };
        });
        wrap.append(dom);
      };
      if(format.style){
        dom.css(format.style);
      };
    };
    if(expression.format == undefined){
      expression.format = [{
        value : title,
        type : "text"
      },{
        value : "",
        type : "input"
      }]
    }
    for(var i in expression.format){
      createPart(expression.format[i]);
    }
    if(element.style) {
      wrap.css(element.style);
    }
    element.setText = function(str){
      dom.val(str);
    };
    if(typeof initFn == "function"){
      try{
        initFn({
          target: element,
          global : global
        })
      } catch(e){
        if(route.current.$$route.controller == "freeStyleCtrl"){
          growl.error("组件［输入框］的初始化表达式配置发生错误！");
        };
        console.log(e);
      };
    };
    return wrap;
  }
});
