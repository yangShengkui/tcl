define([], function(){
  return function(data)
  {
    var index = data.index;
    var element = data.element;
    var global = data.global;
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    var imageslist = data.imageslist;
    var imageDom = $('<div></div>');
    var events = expression.on;
    imageDom.css("background-position", "center");
    imageDom.css("background-repeat", "no-repeat");
    imageDom.css("background-size", "contain");
    if(element.style) {
      imageDom.css(element.style);
    }
    var initFn = events ? events.$attr("init") : undefined;
    element.setImage = function(image){
      imageDom.css("background-image", "url(" + image + ")");
    };
    element.render = function(image){
      imageDom.css("background-image", "url(" + image + ")");
    };
    element.render(element.parameters.imgSrc);
    if(typeof initFn == "function"){
      initFn({
        $index : index,
        jquery : imageDom,
        global : global,
        tools : data,
        target : element,
        ui : element
      })
    };
    return imageDom;
  }
});
