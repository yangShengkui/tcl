/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  $.fn.dropdowntree = function(obj){
    var options = obj.options || {};
    var format = obj.format || {
        "id" : "id",
        "children" : "children"
      };
    var select = $("<select></select>").addClass("form-control");
    var value = obj.value;
    var key = obj.format.key || "id";
    var mark = obj.format.children || "children";
    var placeholder = obj.placeholder || "请选择..."
    var wraps = [];
    var container = $("<div></div>").attr("id", "container").addClass("noview").css("border-top", "1px solid #ddd");
    var childrenDom = $("<div></div>").addClass("children");
    var changeFn = obj.change;
    console.log("vvv===", value);
    select.on("mousedown", function(event){
      event.preventDefault();
    });
    select.append($("<option id='selectlabel' value='selectlabel'>" + placeholder + "</option>"));
    select.on("click", function(event) {
      if(container.hasClass("noview")) {
        container.removeClass("noview");
        select.addClass("extend");
        setTimeout(function() {
          $('body').on("click.body", docClick);
        });
      }
      function docClick() {
        container.addClass("noview");
        $('body').off("click.body");
        select.removeClass("extend");
      }
    });
    container.append(childrenDom);
    this.append(select);
    this.append(container);
    this.addClass("dropdowntree");
    traverse(options[mark], childrenDom, 1);
    function traverse(children, container, level) {
      children.forEach(function(child) {
        var wrap = $("<div></div>").addClass("wrap");
        var handler = $("<div></div>").addClass("glyphicon");
        var label = $("<span></span>").addClass("labeltxt");
        var childrenDom = $("<div></div>").addClass("children");
        var find = false;
        var children = child[mark];
        /**
        var checkhasViewId = function(child){
          if(child.viewId == scope.ngModel){
            return true;
          } else {
            if(child.hasOwnProperty(mark)){
              var checkViewId = function(chd){
                return checkhasViewId(chd);
              };
              for(var i in child[mark]){
                if(checkViewId(child[mark][i])){
                  return true;
                }
              }
            }
          }
          return false;
        };*/
        handler.data("children", children);
        var lb = 'label';
        child.label = child[lb];
        label.text(child.label ? child.label : child.text);
        for(var i = 0; i <= level; i++) {
          (function(clone, inx) {
            if(inx == level - 1) {
              clone.addClass("last");
            }
            clone.css("left", 10 + inx * 8 + "px");
            wrap.append(clone);
          })($("<div></div>").addClass("vline"), i)
        }
        wrap.append(handler);
        wrap.append(label);
        wrap.attr(key, child[key]);
        wrap.css("padding-left", (level * 8) + "px");
        wraps.push(wrap);
        container.append(wrap);
        if(child[key] == value) {
          select.children().remove();
          select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : "请选择...") + "</option>"));
          wrap.removeClass("active");
          wrap.addClass("active");
        };
        wrap.on("click", function(event) {
          if(typeof changeFn == "function"){
            changeFn({
              data : child
            });
          };
          select.children().remove();
          select.append($("<option id='selectlabel' value='selectlabel'>" + (child.label ? child.label : "请选择...") + "</option>"));
          wraps.forEach(function(elem) {
            elem.removeClass("active");
          });
          wrap.addClass("active");
          /**
          if(attr.hasOwnProperty("model")) {
            attr["model"] = child[key];
            $(element).attr("model", child[key]);
          } else {
            scope.ngModel = child[key];
          }*/
          $('body').trigger("click.body");
        });
        if(children) {
          /**
          if(checkhasViewId(child) == false){
            childrenDom.addClass("hidechildren");
            handler.addClass("glyphicon-plus");
          } else {
            handler.addClass("glyphicon-minus");
          }*/
          handler.addClass("glyphicon-minus");
          handler.on("click", function(event) {
            event.stopPropagation();
            if(handler.hasClass("glyphicon-minus")) {
              handler.removeClass("glyphicon-minus").addClass("glyphicon-plus");
              childrenDom.css("overflow", "hidden");
              childrenDom.animate({
                "height": "100%",
                opacity: 0
              }, 300, function() {
                childrenDom.css({
                  display: "none"
                }).css("overflow", "auto");
              })
            } else {
              handler.removeClass("glyphicon-plus").addClass("glyphicon-minus");
              childrenDom
                .css("overflow", "hidden")
                .css("display", "block");
              childrenDom.animate({
                "height": "100%",
                "position": "absolute",
                opacity: 1
              }, 300);
            }
          });
          container.append(childrenDom);
          traverse(children, childrenDom, level + 1);
        } else {
          handler.addClass("glyphicon glyphicon-duplicate").css("opacity", 0);
        }
      })
    };
  };
  return null;
});
