/**
 * Created by leonlin on 16/11/3.
 */
define(function(){
  return function(data) {
    var element = data.element,
      slice = Array.prototype.slice,
      tostring = Object.prototype.toString,
      hasownprop = Object.prototype.hasOwnProperty,
      treemenu = createElement("div", "tree-menu2", element.style),
      expression, initFn;
    var _glyphicon = "glyphicon",
      paddingLeft = 20;
      
    function debug(fn){
      try { fn(); } catch(e) { error(e) }
    }
    function log(){
      console.log.apply(console, arguments);
    }
    function error(){
      console.error.apply(console, arguments);
    }
    function toGlyphicon(icon, lib){
      return glyphiconLike(icon) ? icon : lib + icon;
    }
    function glyphiconLike(str){
      return str.indexOf(_glyphicon) !== -1;
    }
    function addCss(elem, css){
      css && eachProp(css, function(element, attr){
        elem.css(attr, element);
      });
    }
    function appendChildren(){
      var self = this;
      var arr = slice.call(arguments, 0);
      each(arr, function(el){
        self.append(el);
      })
    }
    function createElement(tag, cls, css){
      var element = $("<" + tag + "></" + tag + ">");
      cls && element.addClass(cls);
      addCss(element, css);
      return element;
    }
    function each(arr, callback){
      var i;
      for(i = 0; i < arr.length; i++){
        callback && callback(arr[i], i, arr);
      }
    }
    function hasProp(obj, attr){
      return hasownprop.call(obj, attr);
    }
    function eachProp(obj, callback){
      var i;
      for(i in obj){
        hasProp(obj, i) && callback(obj[i], i)
      }
    }
    function isFunc(fn){
      return tostring.call(fn) === "[object Function]";
    }
    function isArray(arr){
      return tostring.call(arr) === "[object Array]";
    }
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        expression = fnResult;
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    function createTree(data){
      var events = {},
        _fa = "fa",
        _glyphicon = "glyphicon glyphicon-",
        _defaultIcon = "asterisk",
        _iconFold = "menu-left",
        _iconUnFold = "menu-down";
      function extend(a, b){
        eachProp(b, function(element, attr){
          a[attr] = element;
        })
      }
      function on(eventName, handler){
        events[eventName] = handler;
      };
      function emit(eventName, event){
        var fn = events[eventName];
        isFunc(fn) && fn(event);
      }
      function createRow(){
        return createElement("div", "tree-wrap");
      }
      function createText(text){
        var span = createElement("span");
        span.text(text);
        return span;
      }
      function createIcon(icon, cls){
        icon = icon || _fa + ".circle";
        var arr = icon.split(".");
        if(arr.length > 1){
          lib = arr[0] + " " + arr[0] + "-";
          icon = arr[1];
        } else {
          lib = _glyphicon;
          icon = arr[0]
        }
        var span = createElement("span", toGlyphicon(icon, lib) + " " + cls);
        return span;
      }
      function createInner(icon, name, url, dept, row, hasChild, data){
        var foldToggle,
          cls = ( dept == 0 && hasChild ) ? "depth-" + dept + " open" : "depth-" + dept,
          div = createElement("div", "tree-element " + cls, {
            "padding-left" : paddingLeft * dept + "px"
          }),
          icon = createIcon(icon, "menu-before"),
          text = createText(name),
          foldIcon = createIcon(_iconUnFold, "menu-addon");
        if(hasChild){
          appendChildren.call(div, foldIcon);
          foldToggle = function(){
            if(foldIcon.hasClass(_glyphicon + _iconUnFold)){
              foldIcon.removeClass(_glyphicon + _iconUnFold)
              foldIcon.addClass(_glyphicon + _iconFold);
              div.removeClass("open")
            } else {
              foldIcon.removeClass(_glyphicon + _iconFold)
              foldIcon.addClass(_glyphicon + _iconUnFold);
              div.addClass("open")
            }
          }
        }
        appendChildren.call(div, icon, text);
        div.on("click", function(e){
          extend(e, {
            $data : data,
            $name : name,
            $url : url
          });
          row.hasClass("hide") && row.removeClass("hide") || row.addClass("hide");
          foldToggle && foldToggle();
          element.trigger("menu:click", e);
        })
        return div;
      }
      function createItem(icon, name, url, dept, row, hasChild, data){
        var div = createElement("div", "tree-item");
        div.append(createInner(icon, name, url, dept, row, hasChild, data));
        return div;
      }
      function traverse(data, dept){
        var i, icon, name, url, children, repeat,
          row = createRow();
        each(data, function(dt, i, source){
          var itemDom, inner;
          if(isArray(dt[2])){
            icon = dt[0];
            name = dt[1];
            children = dt[2];
          } else if(isArray(dt[1])){
            name = dt[0];
            children = dt[1]
          } else if(dt.length < 2){
            name = dt[0];
            children = [];
          } else {
            icon = dt[0];
            name = dt[1];
            url = dt[2];
            children = [];
          }
          inner = traverse(children, dept + 1);
          itemDom = createItem(icon, name, url, dept, inner, !!children.length, dt);
          itemDom.append(inner);
          row.append(itemDom);
        });
        return row;
      }
      return {
        dom : traverse(data, 0),
        on : on
      }
    }
    function clearAll(){
      treemenu.children().remove();
    }
    var render = function(data, format) {
      clearAll();
      var treeIns = createTree(data)
      treemenu.append(treeIns.dom);
      treeIns.on("menu:click", function(e){
        var url = e.$url;
        url && console.log(url);
      });
    };
    element.render = render;
    initFn = expression.$attr("on/init");
    debug(function(){
      initFn && initFn({
        target : element
      })
    });
    return treemenu;
  }
});