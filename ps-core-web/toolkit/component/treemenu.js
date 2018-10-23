/**
 * Created by leonlin on 16/11/3.
 */
define(['toolkit/itree/itree'], function(itree){
  return function(data)
  {
    var element = data.element;
    var div = $("<div class='tree-menu'>");
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        expression = fnResult;
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    var render = function(data, format) {
      div.children().remove();
      var treeIns = itree.init(div, data, format);
      return treeIns;
      //treeIns.exposeToLeve(2);
    };
    element.render = render;
    var initFn = expression.$attr("on/init");
    if(initFn){
      initFn({
        target : element
      });
    };
    return div;
  }
});