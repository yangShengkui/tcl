/**
 * Created by leonlin on 16/11/3.
 */
define(['svgcharts'], function(svgcharts){
  return function(data) {
    var element = data.element;
    var global = data.global;
    var dom = $("<div></div>");
    element.init(dom, global, {
      render : function(data, expression, parameter, style){
        var dom = $("<div></div>");
        dom.css("height", "100%");
        dom.css("width", "100%");
        var instance = svgcharts.init(dom[0], data);
        element.setOption = function(option){
          instance.setOption(option);
        };
        return dom;
      }
    });
    return dom
  };
});
