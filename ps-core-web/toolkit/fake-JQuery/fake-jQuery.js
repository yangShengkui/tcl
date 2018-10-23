/**
 * fake jQuery Created by leonlin.
 */

(function(root, factory){
  if(typeof define === "function" && define.amd){
    /** for AMD use*/
    define([], function(){
      return factory(root);
    })
  } else {
    /** for Global use*/
    root.F$ = root.FjQuery = factory(root);
  }
})(this, function(root){
  var VERSION = "fake jQuery v1.0.0";
  var arr = [];
  function extend(self, target){
    var cur = self;
    for(var i in target){
      cur[i] = target[i];
    }
  };
  function jQuery(selector){
    return new jQuery.fn.init(selector);
  };
  function parseHtml(str){
    var div = document.createElement("div");
    if(typeof str == "string")
      div.innerHTML = str;
    var childNodes = [];
    for(var i = 0; i < div.childNodes.length; i++){
      childNodes.push(div.childNodes[i])
    }
    return childNodes;
  }
  jQuery.fn = jQuery.prototype = [];
  extend(jQuery.fn, {
    push : arr.push
  });
  jQuery.fn.init = function(selector){
    var inputRegExp = /^<.*>$/g;
    var cur = this;
    cur.selector = selector;
    if(inputRegExp.test(selector)){
      Array.prototype.push.apply(this, parseHtml(selector));
    } else if(typeof selector == "function"){
      var callback = selector;
      window.onload = callback;
    } else {
      var collection = document.getElementsByTagName(selector);
      for(var i = 0; i < collection.length; i++){
        this.push(collection[i]);
      };
    };
  };
  jQuery.fn.init.prototype = jQuery.fn;
  extend(jQuery.fn.init.prototype, {
    append : function(doms){
      var cur = this;
      var loop = function(inx, elem){
        var loopDom = function(i, dom){
          elem.appendChild(dom)
        }
        for(var i = 0; i < doms.length; i++){
          loopDom(i, doms[i])
        }
      }
      for(var i = 0; i < cur.length; i++){
        loop(i, cur[i]);
      };
    },
    css : function(context, value){

    },
    attr : function(context, value){

    },
    on : function(eventName, value){

    }
  });
  jQuery.extend = extend;
  return jQuery
});