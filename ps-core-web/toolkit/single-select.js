/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return {
    init : function(dom, format, options){
      var _dom_, _format_, _option_, events = {};
      var button = $("<button></button>")
        .css("width", "100%")
        .addClass("btn btn-default dropdown-toggle");
      button.text("请选择一项内容");
      var ul = $("<ul></ul>").addClass("dropdown-menu").css("width", "100%");
      var caret = $("<span></span>").addClass("caret");
      var searchWrap = $("<div></div>").addClass("input-group");
      var input = $("<input />").addClass("form-control");
      var submitWrap = $("<span></span>").addClass("input-group-btn");
      var a = 0;
      var closeBtn = $("<button></button>")
        .addClass("btn btn-default")
        .append($("<span></span>").addClass("glyphicon glyphicon-remove"));
      var SelectSingle = function(dom, format, options){
        var cur = this;
        _format_ = format || {
            label: "label",
            value: "value"
          };
        _dom_ = dom;
        _option_ = options;
        searchWrap.append(input);
        searchWrap.append(submitWrap);
        submitWrap.append(closeBtn)
        button.append();
        $(_dom_).css({
          "position": "relative"
        });
        ul.on("click", function(event) {
          event.stopPropagation();
        });
        $(_dom_).append(button);
        $(_dom_).append(ul);
        if(_option_){
          cur.setOption(_option_);
        }
      };
      SelectSingle.prototype.on = function(eventName, callback){
        events[eventName] = callback;
      };
      SelectSingle.prototype.setValue = function(val){
        button.append(caret);
        var find = _option_.find(function(elem){
          elem.target.removeClass("active");
          return elem[_format_.value] == val;
        }) || {};
        if(find.target){
          find.target.addClass("active");
          button.text(find[_format_.label]);
        }
      };
      SelectSingle.prototype.setOption = function(options){
        _option_ = options
        var toggle = function() {
          if($(_dom_).hasClass("open")) {
            $(_dom_).removeClass("open");
          } else {
            $(_dom_).addClass("open");
          }
        };
        var documentClick = function(event) {
          input.val("");
          search("");
          toggle();
          $("body").off("click.toggle");
          $("body").off("keydown.toggle");
        };
        var documentKeydown = function(event) {
          if(event.keyCode == 13) {
            var label = input.val();
            search(label);
          };
        }
        var onClick = function(event) {
          event.stopPropagation();
          $("body").on("click.toggle", documentClick);
          $("body").on("keydown.toggle", documentKeydown);
          // 初始化下拉按钮
          $('.ng-pristine.ng-untouched.ng-valid.ng-scope.ng-isolate-scope.ng-not-empty').removeClass('open');
          toggle();
        };
        var keyDownSearch = function() {
          event.stopPropagation();
          timeout(function() {
            var label = input.val();
            search(label);
          });
        }
        var search = function(key) {
          for(var i in options) {
            (function(item) {
              var condition1 = item.label.indexOf(key) != -1;
              var txt;
              if(typeof format.label == "function") {
                txt = format.label(item);
              } else {
                txt = item[format.label];
              };
              if(txt.indexOf(key) != -1) {
                $(item.target).css("display", "block");
              } else {
                $(item.target).css("display", "none");
              }
            })(options[i])
          }
        };
        ul.children().remove();
        var liDom = function(index, elem) {
          var li = $("<li></li>")
            .css({
              cursor: "pointer"
            });
          var a = $("<a></a>");
          if(typeof format.label == "function") {
            a.text(format.label(elem));
          } else {
            a.text(elem[format.label])
          }
          var onClick = function(event) {
            event.stopPropagation();
            $("body").off("click.toggle");
            $("body").off("keydown.toggle");
            input.val("");
            search("");
            ul.find("li.active").removeClass("active");
            li.addClass("active");
            if(typeof format.label == "function") {
              button.text(format.label(elem));
            } else {
              button.text(elem[format.label])
            };
            toggle();
            button.append(caret);
            if(events['click']){
              events['click'](elem[format.value]);
            };
          };
          li.on("click", onClick);
          li.append(a);
          elem.target = li;
          Object.defineProperty(elem, "target", {
            enumerable: false
          });
          return li;
        };
        var li = $("<li></li>").css("padding", "2px 10px");
        ul.append($("<li></li>").addClass("divider"));
        ul.append(li.append(searchWrap));
        ul.append($("<li></li>").addClass("divider"));
        button.off("click");
        button.on("click", onClick);
        closeBtn.on("click", function() {
          event.stopPropagation();
          input.val("")
          search("");
        });
        input.off("focus");
        input.on("focus", function() {
          event.stopPropagation();
          $(document).on("keydown.search", keyDownSearch);
        });
        input.on("blur", function() {
          event.stopPropagation();
          $(document).off("keydown.search");
        });
        for(var i in _option_) {
          ul.append(liDom(i, _option_[i]));
        }
      };
      return new SelectSingle(dom, format, options);
    }
  }
});
