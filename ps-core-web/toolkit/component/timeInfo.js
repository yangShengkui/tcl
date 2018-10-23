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
    var div = $("<div></div>");
    var span = $("<span></span>");
    var br = $("<br />")
    //var canvas = $("<canvas width='400' height='400'></canvas>");
    require(['clock'], function(clock){
      var myclock = new clock();
      myclock.start();
      myclock.on("change", function(value){
          span.text(value);
      });
    });
    div.append(span);
    div.append(br);
    //div.append(canvas);
    return div;
  }
});
