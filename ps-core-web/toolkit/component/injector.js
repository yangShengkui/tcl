/**
 * Created by leonlin on 16/11/3.
 */
define(function(){
  return function(data) {
    if(data == undefined){
      throw new Error("undefined");
    }
    var q = data.q;
    var element = data.element;
    var constructor = element.constructor;
    var coldomInner = data.coldomInner;
    var previewMode = data.previewMode;
    var traverseColumn = data.traverseColumn;
    var viewFlexService = data.viewFlexService;
    var traverseRow = data.traverseRow;
    var rowDom = data.rowDom;
    var customMethodService = data.customMethodService;
    var style = element.style;
    var cov = $("<div></div>");
    cov.css("width", "100%");
    cov.css("height", "100%");
    cov.css("background-color", "rgba(250,250,250,.5)");
    var wrap = $("<div></div>");
    wrap.addClass("ww");
    wrap.css(style);
    if(!previewMode) {
      wrap.css("opacity", ".1");
      wrap.css("pointer-events", "none");
      wrap.css("background-color", "#eee");
    }
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(expFn){
      if(expFn.code == 0){
        expression = expFn.data;
      }
    });
    expression = expression ? expression : {};
    var initFn = expression.$attr("on/init");
    element.renderJSON = function(json){
      traverseRow(wrap, json.children, true);
    };
    element.render = function(json, a){
      console.log("--------------injector---------------", json);
      var defers = [];
      wrap.children().remove();
      if(json.layout == undefined){
        json.layout = json.groups[0].layout;
      }
      json.layout = json.layout.$remapByChild(function(element){
        var rs = new constructor(element);
        return rs;
      });
      element.children = json.layout.children;
      element.traveseByChild(function(element){
        var defer = q.defer();
        var renderAttr = function(){
          if(element.data){
            element.getCiKpi(function(ci, kpi){
              if(element.data){
                element.data.resource = ci;
                element.data.kpi = kpi;
              };
              defer.resolve("success");
            });
          } else {
            defer.resolve("success");
          };
        };
        if(element.source) {
          var source = element.source;
          if(source == "TOPO") {
            var viewId = 	element.viewId;
            $$.cacheAsyncData.call(viewFlexService.getViewById, [viewId], function(event){
              if(event.code == 0 && event.data != null){
                var json = JSON.parse(event.data.content);
                element.JSON = json;
              }
              renderAttr();
            });
          } else {
            renderAttr();
          }
        } else {
          renderAttr();
        }
        defers.push(defer.promise);
      });
      q.all(defers).then(function(){
        json.layout.traverse(function(){

        });
        json.layout.root = json;
        Object.defineProperty(json.layout, "root", {
          enumerable : false
        });
        traverseRow(wrap, json.layout.children, true);
      });
    };
    if(initFn){
      try{
        initFn({
          target : element
        });
      } catch(e){
        console.log(e);
      } finally {

      }
    }
    return wrap;
  }
});
