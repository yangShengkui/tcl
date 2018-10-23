define(['directives/directives'], function(directives) {
  'use strict';
  directives.initDirective('selectList', ['$timeout', '$compile', function(timeout, compile) {
    return {
      templateUrl : "../partials/select_list.html",
      restrict: 'A',
      scope : {
        source : "=",
        name : "=",
        titles : "="
      },
      link: function(scope, element, attr) {
        var ready = function(){
          var sourceWatcher = function(n,o,s){
            var keyhistory = [];
            if(n){
              var shiftPress = false, ctrlPress = false;
              var shiftKeyUp = function(event){
                if(event.keyCode == 16){
                  shiftPress = false;
                  $("body").off("keyup.shift");
                  $("body").on("keydown.shift", shiftKeyDown);
                }
              };
              var ctrlKeyUp = function(event){
                if(event.keyCode == 91){
                  ctrlPress = false;
                  $("body").off("keyup.ctrl");
                  $("body").on("keydown.ctrl", ctrlKeyDown);
                }
              };
              var shiftKeyDown = function(event){
                if(event.keyCode == 16){
                  shiftPress = true;
                  $("body").off("keydown.shift");
                  $("body").on("keyup.shift", shiftKeyUp);
                }
              };
              var ctrlKeyDown = function(event){
                if(event.keyCode == 91){
                  ctrlPress = true;
                  $("body").off("keydown.ctrl");
                  $("body").on("keyup.ctrl", ctrlKeyUp);
                }
              };
              var bodyClick = function(event){
                s.$apply(function(){
                  for(var i in n){
                    n[i].selected = false;
                  }
                })
              }
              $("body").on("keydown.shift", shiftKeyDown);
              $("body").on("keydown.ctrl", ctrlKeyDown);
              $("body").on("click.whole", bodyClick)
              scope.dropRight = function(){
                switchItem(true);
              };
              scope.dropLeft = function(){
                switchItem(false);
              };
              scope.leftFilter = function(elem){
                return elem.applied != true && elem.leaveplace != true;
              };
              scope.rightFilter = function(elem){
                return elem.applied == true && elem.leaveplace != true;
              };
              scope.rightFilterNoCheck = function(){
                var every = n.every(function(elem){
                  return elem.applied != true || elem.selected != true;
                })
                return !every;
              };
              scope.leftFilterNoCheck = function(){
                var every = n.every(function(elem){
                  return elem.applied == true || elem.selected != true;
                })
                return !every;
              };
              var switchItem = function(bool){
                console.log("switchItem");
                keyhistory = [];
                var checked = n.filter(function(elem){
                  return elem.selected == true;
                });
                var loop = function(item){
                  item.applied = bool;
                  item.selected = false;
                  item.renew = true;
                };
                for(var i in checked){
                  loop(checked[i])
                }
              }
              scope.leftToRight = function(){
                switchItem(true);
              };
              scope.rightToLeft = function(){
                switchItem(false);
              };
              var loop = function(item){
                item.start = function(){
                  var self = this;
                  if(self.selected != true){
                    self.selected = true;
                    keyhistory = [self];
                  };
                  for(var i in n){
                    if(n[i].selected == true){
                      n[i].leaveplace = true;
                    }
                  }
                };
                item.stop = function(){
                  for(var i in n){
                    if(n[i].leaveplace == true){
                      n[i].leaveplace = false;
                    }
                  }
                };
                item.click = function(){
                  var self = this;
                  var checklist = n.filter(function(elem){
                    if(self.applied) {
                      return self.applied == elem.applied;
                    } else {
                      return elem.applied == false || elem.applied == undefined;
                    }

                  })
                  for(var i in n){
                    n[i].renew = false;
                  }
                  if(ctrlPress || shiftPress){
                    if(shiftPress){
                      keyhistory.$remove(function(index, elem){
                        return elem == self;
                      });
                      keyhistory.push(self);
                      if(keyhistory.length > 1){
                        var lastpress = keyhistory[keyhistory.length - 2];
                        var addFn;
                        var loop = function(elem){
                          if(addFn == undefined){
                            if(elem == self || elem == lastpress){
                              elem.selected = true;
                              addFn = function(el){
                                el.selected = true;
                                if(el == self || el == lastpress){
                                  addFn = undefined;
                                }
                              };
                            }
                          } else if(typeof addFn == 'function'){
                            addFn(elem);
                          }
                        };
                        for(var i in checklist){
                          loop(checklist[i])
                        }
                      };
                    } else {
                      if(self.selected != true){
                        self.selected = true;
                        keyhistory.push(this);
                      } else {
                        self.selected = false;
                        keyhistory.$remove(function(index, elem){
                          return elem == this;
                        });
                      }
                    }
                  } else {
                    for(var i in n){
                      n[i].selected = false;
                    }
                    self.selected = true;
                    keyhistory = [self];
                  }
                  console.log(n);
                }
              };
              for(var i in n){
                loop(n[i]);
              }
            }
          };
          scope.$watch("source", sourceWatcher);
        };
        timeout(ready);
      }
    };
  }]);
  directives.initDirective('selectDrag', ['$timeout', '$compile', function(timeout, compile) {
    return {
      restrict: 'A',
      scope : {
        target : "=",
        start : "&",
        stop : "&",
        name : "="
      },
      link: function(scope, element, attr) {
        var ready = function(){
          var itemWatcher = function(n,o,s){
            if(n){
              var jqueryUiReady = function(){
                var helper = function(ui){
                  var filter = n.filter(function(elem){
                    return elem.selected == true;
                  }).map(function(elem){
                    console.log(elem, scope.name);
                    return elem[scope.name];
                  });
                  var result;
                  if(filter.length >2){
                    var rs = filter.slice(0,2);
                    rs.push("等" + filter.length + "个");
                    result = $("<div></div>").text(rs.toString());
                  } else if(filter.length > 0){
                    var rs = filter;
                    result = $("<div></div>").text(rs.toString());
                  } else if(filter.length == 0){
                    var rs = $(ui.target);
                    console.log(rs);
                    result = $("<div></div>").append(rs);
                  }
                  result.attr("id", "select-helper");
                  result.addClass("item");
                  return result;
                };
                var start = function(){
                  s.$apply(function(){
                    s.start();
                  });
                };
                var stop = function(){
                  s.$apply(function(){
                    s.stop();
                  });
                };
                $(element).draggable({
                  cursor : 'move',
                  cursorAt: { top : 5, left: 5 },
                  appendTo : 'body',
                  revert : true,
                  containment : 'body',
                  scroll : false,
                  revertDuration : 0,
                  zIndex : 9999999,
                  helper : helper,
                  start : start,
                  stop : stop
                })
              };
              $$.loadExternalJs(["jquery-ui"], jqueryUiReady);
            }
          };
          scope.$watch("target", itemWatcher);
        };
        timeout(ready);
      }
    };
  }]);
  directives.initDirective('selectDrop', ['$timeout', '$compile', function(timeout, compile) {
    return {
      restrict: 'A',
      scope : {
        target : "=",
        drop : "&"
      },
      link: function(scope, element, attr) {
        var drop = function(event){
          event.stopPropagation();
          scope.$apply(function(){
            scope.drop();
          })
        };
        var jqueryUiReady = function(){
          $(element).droppable({
            drop : drop
          })
        };
        $$.loadExternalJs(["jquery-ui"], jqueryUiReady);
      }
    };
  }]);
});