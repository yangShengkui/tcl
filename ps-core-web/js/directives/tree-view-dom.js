define(['directives/directives'], function(directives) {
  'use strict';
  directives.initDirective('treeView', ['$timeout', '$compile', function(timeout, compile) {
    return {
      restrict: 'A',
      scope : {
        source : "=",
        formatter : "=",
        mark : "=",
        checkbox : "="
      },
      link: function(scope, element, attr) {
        var description = $("<div></div>")
          .css("z-index", 1999)
          .css("background-color", "#fff")
          .css("box-shadow", "1px 1px 10px rgba(0,0,0,.3)")
          .css("padding", "15px 20px")
          .css("margin", "-5px 0 0 25px")
          .css("display", "block")
          .css("width", "300px")
          .css("position", "fixed");
        var des_text = $("<p></p>")
          .text('')
          .css("color", "#666")
          .css("margin", 0)
          .css("line-height", "16px")
          .css("font-size", "12px")
          .css("font-weight", "normal");
        var des_close = $("<div></div>")
          .append($("<span class='close'>x</span>"))
        var des_title = $("<p></p>")
          .text("描述 :")
          .css("font-weight", "bold")
          .css("color", "#333")
          .css("margin", "10px auto")
          .css("line-height", "16px")
          .css("font-size", "12px");
        description.append(des_close).append(des_title).append(des_text);
        var ready = function(){
          $(element).css("position", "relative");
          $(element).css("border", "1px solid #eee");
          $(element).css("box-shadow", "1px 1px 5px rgba(0,0,0,.1)");
          var getAllChild = function(data){
            var rs = []
            var traverse = function(obj){
              rs.push(obj)
              if(obj[scope.mark]){
                for(var i in obj[scope.mark]){
                  traverse(obj[scope.mark][i])
                }
              }
            };
            for(var i in data[scope.mark]){
              traverse(data[scope.mark][i])
            };
            return rs;
          };
          var sourceWatcher = function(n,o,s){
            var getAllName = function(data){
              var rs = [];
              var traverse = function(data){
                rs.push(data.label);
                var loop = function(elem){
                  traverse(elem);
                };
                if(data.hasOwnProperty(scope.mark)){
                  for(var i in data[scope.mark]){
                    loop(data[scope.mark])
                  }
                }
              };
              traverse(data);
              return rs;
            };
            var render = function(data, type, searchlist){
              var tree = data
              $(element).children().remove();
              var traverse = function(target, data, depth, parentIcon, parentDom, parentUser, parentData){
                depth++;
                data.depth = depth;
                var children;
                var dom = $("<div></div>")
                  .css("border-bottom", "1px solid #ddd")
                  .css("position", "relative")
                  .css("overflow", "hidden")
                  .css("opacity", 0)
                  .css("max-height", 0)
                  .css("line-height", "30px");
                var btn = $("<button></button>")
                  .css("line-height", "12px")
                  .css("padding", "4px 4px 6px 5px")
                  .css("color", "#fff")
                  .css("border", "0")
                  .css("background-color", "#009dea")
                  .css("float", "left")
                  .css("margin", "4px 10px 0px 3px");
                var icon = $("<span></span>")
                  .addClass("glyphicon glyphicon-minus")
                  .css("font-size", "10px")
                  .css("paddin", "0 0 0 1px");
                var userIcon = $("<span></span>").addClass("glyphicon glyphicon-th-list")
                  .css("margin", "0 15px 0 5px")
                  .css("color", "#ccc");
                var text = $("<span></span>")
                  .css("font-size", "12px")
                  .css("margin-left", 10)
                  .text(data.name);
                var checkbox = $("<button></button>")
                  .css("line-height", "12px")
                  .css("font-size", "5px")
                  .css("padding", "3px 4px 3px 4px")
                  .css("border", "1px solid #ddd")
                  .css("margin", "2px 0px 0px 2px")
                  .addClass("checkbox");
                var checkIcon = $("<span></span>").addClass(" glyphicon glyphicon-ok");
                var infoBtn = $("<span></span>").addClass("glyphicon glyphicon-question-sign")
                  .css("cursor", "pointer")
                  .css("font-size", "16px")
                  .css("color", "#ccc")
                  .css("margin-left", "20px");
                var infoBtnClick = function(event){
                  event.stopPropagation();
                  description.remove();
                  var offset = $(event.target).offset();
                  description.css({
                    opacity : 0,
                    top : offset.top - 20,
                    left : offset.left + 5
                  });
                  des_text.text(data.description);
                  $("body").prepend(description);
                  description.animate({
                    opacity : 1
                  }, 300)
                  $("body").on("click.infoleave", infoBtnLeave)
                };
                var infoBtnLeave = function(event){
                  event.stopPropagation();
                  $("body").off();
                  description.remove();
                };
                var inner = $("<div></div>")
                  .css("margin-left", (type != "search" ? depth * 20 : 0) + "px");
                btn.append(icon);
                data.ui = {
                  checkbox : checkbox,
                  checkIcon : checkIcon
                };
                infoBtn.on("click", infoBtnClick);
                if(!parentData){
                  dom.css("background-color", "#eee");
                };
                var foldClick = function (event) {
                  if(children.css("max-height") == "0px"){
                    timeout(function(){
                      icon.removeClass().addClass("glyphicon glyphicon-minus");
                      children.animate({
                        "max-height" : 2000,
                        "opacity" : 1
                      }, 300);
                    });
                  } else {
                    timeout(function(){
                      icon.removeClass().addClass("glyphicon glyphicon-plus");
                      children.animate({
                        "max-height" : 0,
                        "opacity" : 0
                      }, 300);
                    });
                  };
                };
                var checkboxClick = function(){
                  var val;
                  if(data[scope.checkbox] == 0){
                    val = 1;
                  } else {
                    val = 0;
                  }
                  var getChildren = function(dt){
                    dt[scope.checkbox] = val;
                    if(val == 0){
                      dt.ui.checkbox.removeClass().addClass("checkbox");
                      dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-empty");
                    } else {
                      dt.ui.checkbox.removeClass().addClass("checkbox");
                      dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                    }
                    if(dt.hasOwnProperty(scope.mark)){
                      for(var i in dt[scope.mark]){
                        getChildren(dt[scope.mark][i])
                      }
                    }
                  };
                  var getParent = function(dt){
                    var some, every;
                    var allchildren = getAllChild(dt);
                    if(allchildren.length > 1){
                      every = allchildren.every(function(elem){
                        return elem[scope.checkbox] == 1
                      });
                      some = allchildren.some(function(elem){
                        return elem[scope.checkbox] == 1
                      });
                    }else if(allchildren.length == 1){
                      if(data[scope.checkbox] == 0){
                        some = true;
                      }else{
                        every = true;
                      }
                    } else {
                      every = true;
                      some = false;
                    }
                    if(val == 0){
                      if(every){
                        dt[scope.checkbox] = 1;
                        dt.ui.checkbox.removeClass().addClass("checkbox");
                        dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                      } else if(some){
                        dt[scope.checkbox] = 1;
                        dt.ui.checkbox.removeClass().addClass("checkbox part");
                        dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                      } else {
                        dt[scope.checkbox] = 0;
                        dt.ui.checkbox.removeClass().addClass("checkbox");
                        dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-empty");
                      }
                    }
                    else {
                      dt[scope.checkbox] = val;
                      if(every){
                        dt.ui.checkbox.removeClass().addClass("checkbox");
                        dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                      } else {
                        dt.ui.checkbox.removeClass().addClass("checkbox part");
                        dt.ui.checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                      }

                    }
                    if(dt.hasOwnProperty('parent')){
                      getParent(dt['parent'])
                    }
                  };
                  getChildren(data);
                  if(data.parent){
                    getParent(data.parent);
                  }
                };
                checkbox.append(checkIcon);
                checkbox.on("click", checkboxClick);
                target.append(dom);
                inner.append(btn).append(userIcon);
                if(scope.checkbox != undefined){
                  inner.append(checkbox);
                  var every;
                  var allchildren = getAllChild(data);
                  if(allchildren.length > 0){
                    every = allchildren.every(function(elem){
                      return elem[scope.checkbox] == 1
                    });
                  } else {
                    every = true;
                  }
                  if(data[scope.checkbox]){
                    if(every){
                      checkbox.removeClass().addClass("checkbox");
                      checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                    } else {
                      checkbox.removeClass().addClass("checkbox part");
                      checkIcon.removeClass().addClass("glyphicon glyphicon-ok");
                    }
                  } else {
                    checkbox.removeClass().addClass("checkbox");
                    checkIcon.removeClass().addClass("glyphicon glyphicon-empty");
                  }
                }
                inner.append(text);
                dom.animate({
                  "opacity" : 1,
                  "max-height" : "50px"
                }, 300);
                if(data.hasOwnProperty(scope.mark)) {
                  if(data[scope.mark] != null){
                    userIcon.css("display", "none");
                    btn.css("display", "block");
                    dom.css("font-weight", "bold");
                    if(data.show = false){
                      dom.css("max-height", 0);
                    };
                    children = $("<div></div>").css("overflow", "hidden");
                    if(depth >1){
                      children.css("max-height", 0);
                      icon.removeClass().addClass("glyphicon glyphicon-plus");
                    }
                    target.append(children);
                    for(var i in data[scope.mark]){
                      data[scope.mark][i].parent = data;
                      traverse(children, data[scope.mark][i], depth, btn, dom, userIcon, data[scope.mark]);
                    }
                    btn.on("click", foldClick);
                  } else {
                    userIcon.css("display", "inline");
                    btn.css("display", "none");
                  }
                } else {
                  userIcon.css("display", "inline");
                  btn.css("display", "none");
                }
                dom.append(inner);
              };
              if(data instanceof Array){
                for(var i in data){
                  data[i].parent = data;
                  traverse($(element), data[i], -1);
                }
              } else {
                traverse($(element), data, -1);
              }
            };
            if(n != undefined){
              render(n);
              n.getCheckNode = function(){
                var nodes = []
                var getChildren = function(dt){
                  if(dt[scope.checkbox] == 1){
                    nodes.push(dt);
                  }
                  if(dt.hasOwnProperty(scope.mark)){
                    for(var i in dt[scope.mark]){
                      getChildren(dt[scope.mark][i])
                    }
                  }
                };
                getChildren(n);
                return nodes;
              }
            }
          };
          scope.$watch("source", sourceWatcher);
        };
        timeout(ready);
      }
    };
  }]);
});