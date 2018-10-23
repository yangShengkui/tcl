/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var element = data.element;
    var wholeJSON =data.wholeJSON;
    var global = data.global;
    var growl = data.growl;
    var innerContent = $("<button class='btn btn-primary'></button>");
    var t = element.$attr("parameters/text");
    var text = $("<span></span>").text(t).css("margin-left", "5px");
    var icon = $("<span></span>")
      .addClass("icon")
    var i = $("<i></i>")
      .addClass(element.parameters.icon.perfix + " " + element.parameters.icon.css)
      .css("font-size", "18px")
      .css("pointer-events", "none");
    var wholeData = wholeJSON;
    while(wholeJSON.parent){
      wholeData = wholeData.parent;
    };
    if(element.style) {
      innerContent.css(element.style);
    };
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
    $$.refineDataStructure.call(wholeData);
    if(expression.copyToClipboard == true){
      innerContent.attr("data-clipboard-text", JSON.stringify(wholeJSON, null, 2));
      $$.loadExternalJs(['zeroclipboard'], function(ZeroClipboard){
        var client = new ZeroClipboard(innerContent[0]);
        client.on( "ready", function( readyEvent ) {
          client.on( "aftercopy", function( event ) {
            growl.success("成功复制到剪切版");
          });
        });
      });
    };
    icon.append(i);
    innerContent.append(icon);
    innerContent.append(text);
    var clickFn = expression.$attr("on/click");
    innerContent.on("click", function(event){
      if(clickFn){
        try{
          clickFn({
            target : element,
            element : element,
            global : global,
            ui : event
          });
        } catch(e){
          console.log(e);
        };
      }
    });
    return innerContent;
  }
});
