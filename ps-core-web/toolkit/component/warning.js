/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var previewMode = data.previewMode;
    var timeout = data.timeout;
    var warning = $("<div class='warning'></div>");
    var blink = $("<div></div>");
    var radius = element.$attr("parameters/radius");
    var background = element.$attr("parameters/background");
    blink.css("position", "absolute");
    blink.css("background-color", "red");
    blink.css("border-radius", "50%");
    blink.css("width",  radius * 2);
    blink.css("height",  radius * 2);
    blink.css("top",  element.position.y);
    blink.css("left", element.position.x);
    warning.css("position", "relative");
    warning.css("background-position", "center");
    warning.css("background-image", "url(" + background + ")");
    warning.css("background-repeat", "no-repeat");
    warning.css("background-size", "contain");
    warning.append(blink);
    if(element.style){
      warning.css(element.style);
    }
    if(!previewMode) {
      (function(element, blink, warning){
        timeout(function(){
          blink.draggable({
            containment : warning,
            drag : function(event, ui){
              element.position.x = parseInt($(event.target).css("left").split("px")[0]);
              element.position.y = parseInt($(event.target).css("top").split("px")[0]);
            }
          })
        });
      })(element, blink, warning)
    } else {
      (function(element, blink, warning, radius){
        var runblink = function(){
          if(previewMode){
            blink.css({
              top : element.position.y + radius,
              left : element.position.x + radius,
              width : 0,
              height : 0,
              opacity : 1
            });
            blink.animate({
              top : element.position.y - radius * 1.5,
              left : element.position.x - radius * 1.5,
              width : radius * 5,
              height : radius * 5,
              opacity : 0
            }, 800, function(){
              timeout(function(){
                runblink();
              },800);
            })
          } else {
            runblink = null;
          }
        };
        runblink();
      })(element, blink, warning, radius)
    }
    return warning;
  }
});
