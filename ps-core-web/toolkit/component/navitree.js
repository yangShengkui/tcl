/**
 * Created by leonlin on 16/11/3.
 */
define([], function() {
  return function(data) {
    var elemData = data;
    var navitree = $("<div></div>");
    navitree.addClass("navigate-tree")
    var target = data.element;
    var DIC = ['index', 'navigate', 'factory', 'production', 'devicegroup'];
    var oldOverlay;
    var main = target.getParameter("main");
    target.getDomainAreaLineTree(function(domaintree){
      navitree.empty();
      var id = target.getParameter("id");
      var find = domaintree.find(function(node){
        return node.id == id;
      });
      if(find){
        var navigators = find.getParents();
        if(typeof main == "number"){
          navigators = navigators.filter(function(navi){
            return navi.parent;
          })
        }
        navigators.push(find);
        var createDom = function(inx, navigator){
          var layer = navigator.level;
          var span = $("<span></span>");
          var a = $("<a></a>");
          a.attr("id", "id_" + inx);
          span.css("dispaly", "inline-block");
          span.css("position", "relative");
          span.css("cursor", "pointer");
          span.css("font-weight", "bold");
          span.append(a);
          var overlay;
          var brothers = navigator.getBrothers();
          var createPopup = function(){
            var wrap = $("<div></div>");
            var overlay = $("<div></div>");
            var replace = $("<div></div>");
            overlay.attr("id", "overlay");
            replace.css("width", "100%");
            replace.css("height", "25px");
            wrap.css("max-height", "200px");
            wrap.css("overflow", "auto");
            wrap.css("padding", "5px 0");
            wrap.css("background-color","#fff");
            var renderBrothers = function(brother){
              var div = $("<div></div>");
              div.addClass("link");
              div.css("white-space", "nowrap");
              div.text(brother.label);
              div.css("padding", "3px 10px");
              div.css("cursor", "pointer");
              div.on("click", function(event){
                brother.click();
              });
              return div;
            };
            replace.on("click", function(event){
              event.stopPropagation();
              navigator.click();
            });
            overlay.append(replace);
            for(var i in brothers){
              wrap.append(renderBrothers(brothers[i]));
            };
            overlay.css("position", "absolute");
            overlay.css("z-index", 99999);
            overlay.css("left", 0);
            overlay.css("top", 0);
            overlay.append(wrap);
            return overlay
          }
          a.text(navigator.label);
          a.on("click", function(event){
            event.stopPropagation();
            navigator.click();
          });
          if(brothers.length > 0 /**&& typeof main != "number"*/){
            var mouseEnter;
            var mouseLeave = function(event){
              overlay.remove();
              span.off("mouseleave");
              span.on("mouseenter", mouseEnter);
            };
            mouseEnter = function(event){
              overlay = createPopup();
              span.append(overlay);
              span.off("mouseenter");
              span.on("mouseleave", mouseLeave)
            };
            span.on("mouseenter", mouseEnter);
          };
          return span;
        };
        for(var i in navigators){
          navitree.append(createDom(i, navigators[i]));
          if(i != navigators.length - 1){
            var span = $("<span> > </span>");
            span.css("margin", "0 10px");
            navitree.append(span);
          };
        };
      }
    });
    return navitree;
  }
});