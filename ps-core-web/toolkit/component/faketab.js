/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    if(data == undefined){
      throw new Error("undefined");
    }
    var element = data.element;
    var global = data.global;
    var condition;
    var coldomInner = data.coldomInner;
    var previewMode = data.previewMode;
    var traverseColumn = data.traverseColumn;
    var rowDom = data.rowDom;
    var customMethodService = data.customMethodService;
    var expression = expression || {};;
    $$.runExpression(element.$attr("advance/expression"), function(expFn){
      if(expFn.code == 0){
        expression = expFn.data;
      }
    });
    $$.runExpression(element.$attr("advance/condition"), function(expFn){
      if(expFn.code == 0){
        condition = expFn.data;
      }
    });
    console.log(condition);
    var format = expression.format || {
        label : "label",
        value : "value"
      };
    var initFn = expression.$attr("on/init");
    var ulDom = $("<div class='nav nav-tabs'></div>");
    element.tabInx = 0
    element.render = function(list, config){
      config = config || {};
      if(config.class){
        ulDom.addClass(config.class);
      }
      ulDom.children().remove();
      var createLiDom = function(index, item){
        var clickFn = item.$attr("on/click") || expression.$attr("on/click");
        var addOn = item.addOn;
        var liDom = $("<li style='cursor:pointer;'></li>");
        var icon = $("<span></span>");
        var text = $("<span></span>")
        icon.addClass(item.icon);
        var createAddOn = function(obj){
          var btnGroup = $("<span></span>");
          btnGroup.css("padding", "0 0 0 5px");
          var createDom = function(dom){
            var btn = $("<button></button>");
            btn.addClass("btn btn-sm btn-default");
            var icon = $("<span></span>");
            var clickFn = dom.$attr("on/click");
            icon.addClass(dom.$attr("icon"));
            btn.append(icon);
            btn.css("padding", "0 3px");
            if(clickFn){
              btn.on("click", function(event){
                event.stopPropagation();
                clickFn(event);
              });
            };
            return btn;
          };
          for(var i in obj){
            btnGroup.append(createDom(obj[i]));
          };
          return btnGroup;
        };
        if(index == element.tabInx ){
          liDom.addClass("active");
        }
        var a = $("<a></a>");
        icon.css("margin-right", "3px");
        text.text(item[format['label']]);
        var clickFunction = function(event){
          if(typeof clickFn == "function"){
            clickFn({
              target : element,
              value : item
            })
          }
        };
        liDom.on("click", clickFunction);
        a.append(icon);
        a.append(text);
        liDom.append(a);
        if(addOn){
          a.append(createAddOn(addOn));
        };
        return liDom;
      }
      for(var i in list) {
        ulDom.append(createLiDom(i, list[i]))
      }
    };
    if(initFn){
      try{
        initFn({
          global : global,
          target : element,
          condition : condition
        });
      } catch(e){
        console.log(e);
      } finally {

      }
    }
    return ulDom;
  }
});
