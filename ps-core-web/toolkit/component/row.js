/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var global = data.global;
    var target = data.target;
    var route = data.route;
    var targetDom = data.targetDom;
    var traverseColumn = data.traverseColumn;
    var previewMode = data.previewMode;
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
        console.log(element.$attr("advance/expression"));
        //throw new Error(funRes.message);
      }
    });
    var initFn = expression.$attr("on/init");
    element.setDimension = function(arr){
      if(route.current.$$route.controller != "freeBoardCtrl"){
        for(var i in element.children){
          element.children[i].col = arr[i];
        };
        var row = $("<div class=\"row\"></div>");
        /**
        targetDom.attr("id", "thisisId");
        console.log("=========", targetDom, "=========");*/
        setTimeout(function(){
          targetDom.children().remove();
          targetDom.append(row);
          traverseColumn(row, element.children, previewMode, function(){});
        });
      };
    };
    if(typeof initFn == "function"){
      initFn({
        target : element
      })
    }
  }
});
