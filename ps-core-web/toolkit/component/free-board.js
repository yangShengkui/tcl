/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  /**
   * $(d).freeboard(data)
   * $(d).freeboard("option", "renderLayout", layout);
   **/
  var target = {
    inject : function(comp){
      var loop = function(attr, val){
        target[attr] = val;
      };
      for(var i in comp){
        loop(i, comp[i]);
      }
    }
  };
  $.fn.freeboard = function(){
    var cur = this;
    var instance = {};
    var previewMode = false;
    var buttonEnabled = true;
    var _DROPCONFIG_ = {
      greedy : true,
      drop : drop
    };
    var setMode = function(bool){
      previewMode = bool;
    };
    var renderLayout = function(inData){
      var settingData = inData.setting;
      if(settingData == undefined) {
        settingData = {
          color : "transparent",
          padding : 15
        }
      }
      run(inData.layout);
      function run(layout){
        $(cur).children().remove();
        var wrap = $("<div class='wrap'></div>");
        layout.variable = function(variableName){
          var find = null;
          if(window.variable == undefined){
            window.variable = {};
          }
          if(window["variable"][variableName]){
            find = window["variable"][variableName];
          } else {
            layout.traveseByChild(function(element){
              if(element.$attr("advance/variable") == variableName){
                find = element;
                window["variable"][variableName] = element;
              }
            })
          }
          return find;
        };
        layout.traverse(function(attr, element){
          if(element.hasOwnProperty("__onChange__")) {
            element.oldValue = element.value;
          }
        });
        if(!previewMode) {
          $(cur).attr("id", layout.id);
          if(typeof wrap.droppable == 'function') {
            wrap.droppable({
              greedy : true
            });
          } else {
            require(['jquery-ui'], function(){
              wrap.droppable({
                greedy : true
              });
            })
          }
        }
        if(!previewMode) {
          $(cur).append(wrap);
          traverseRow(wrap, layout.children);
        } else {
          traverseRow($(cur), layout.children);
        }
        function traverseColumn(targetDom, data) {
          for(var i in data) {
            var coldom;
            if(!previewMode) {
              if(data[i].type == "tabItem") {
                coldom = $("<div tabId='tabId_" + data[i].tabId + "' style='display:" + data[i].display + "' class='col-md-12'></div>");
                coldom.css("background-color", "#fff");
              } else {
                coldom = $("<div class='col-md-" + data[i].col + " column'></div>");
              }
            } else {
              if(data[i].type == "tabItem") {
                coldom = $("<div tabId='tabId_" + data[i].tabId + "' style='display:" + data[i].display + "' class='col-md-12'></div>");
                coldom.css("background-color", "#fff");
                coldom.css("min-height", "300px");
                if(data[i].parent.parent.parameters.align == "vertical") {
                  coldom.css("float", "left");
                  coldom.css("width", "calc(100% - 100px)");
                }
              } else {
                coldom = $("<div class='col-md-" + data[i].col + "'></div>");
              }
            }
            if(data[i].$attr("parent/parent/source") == "ROW"){
              if(data[i].$attr("parent/parent/parameters/alignment") == "float"){
                coldom.css("width", "auto");
              }
            }
            if(settingData) {
              if(settingData.padding) {
                //coldom.css("padding", "0 " + settingData.padding + "px");
              }
            }
            var coldomInner = $("<div class='wrap'></div>");
            targetDom.append(coldom);
            if(!previewMode) {
              coldom.attr("id", data[i].id);
            }
            if(!previewMode) {
              coldom.append(coldomInner);
              traverseRow(coldomInner, data[i].children);
            } else {
              if(data[i].children) {
                if(data[i].children.length > 0) {
                  traverseRow(coldom, data[i].children);
                }
              }
            }
          };
        }
        function traverseRow(targetDom, data) {
          var endDom = $("<div id='endDom' class='emptyEnd'></div>");
          var hasBox = false;
          endDom.attr("id", $(targetDom).parent().attr("id"));
          for(var i in data) {
            (function(index, element){
              var tElement;
              var rowDom, instruct;
              var coldomInner = $("<div class='wrap'></div>");
              var setting = $("<div class='btn'><span class='proudsmart ps-edit'></span></div>");
              var move = $("<div id='move' class='btn move'><span class='proudsmart ps-move'></span></div>");
              var dataBtn = $("<div id='data' class='btn'><span class='proudsmart ps-linked-data'></span></div>");
              var emptyDom = $("<div id='beforeDom' class='empty'></div>");
              var delBtn = $("<div class='btn'><span class='proudsmart ps-delete'></span></div>");
              var copyBtn = $("<div class='btn'><span class='glyphicon glyphicon-duplicate'></span></div>");
              var pasteBtn = $("<div class='btn'><span class='glyphicon glyphicon-duplicate'></span></div>");
              var cutBtn = $("<div class='btn'><span class='glyphicon glyphicon-scissors'></span></div>");
              var tool = $("<div class='tool'></div>");
              var tabWrap = $("<div class='tabWrap'></div>");
              var titleDom = $("<h3 class='box-title'>标题标题</h3>");
              var minbutton = $('<div class="box-tools pull-right">\
										<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>\
									<button class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>\
									</div>');
              tool.append(delBtn);
              tool.append(copyBtn);
              tool.append(cutBtn);
              if(element.type == "box") {
                titleDom.css("width", "100%");
                tool.append(setting);
                var headerDom = $("<div class='box-header with-border'></div>");
                headerDom.append(titleDom);
                rowDom = $("<div class='row column'></div>")
                if(element.style) {
                  rowDom.css(element.style);
                }
                rowDom.append(headerDom);
                if(!previewMode) {
                  rowDom.append(tool);
                } else {
                  headerDom.append(minbutton);
                }
              } else if(element.type == "box-body") {
                instruct = $("<div class='instruct'></div>")
                instruct.text("内容区")
                if(!previewMode) {
                  rowDom = $("<div class='row column'></div>");
                  rowDom.append(instruct);
                } else {
                  rowDom = $("<div></div>");
                }
              } else if(element.type == "box-footer") {
                instruct = $("<div class='instruct'></div>")
                instruct.text("注释区");
                if(!previewMode) {
                  rowDom = $("<div class='row column'></div>");
                  rowDom.append(instruct);
                } else {
                  rowDom = $("<div></div>");
                }
              } else if(element.type == "block") {
                if(!previewMode) {
                  rowDom = $("<div class='row column'></div>");
                  rowDom.append(tool);
                } else {
                  rowDom = $("<div class='row'></div>");
                  if(settingData) {
                    rowDom.css("margin-right", "-" + 0 + "px");
                    rowDom.css("margin-left", "-" + 0 + "px");
                  }
                }
              } else if(element.type == "tab") {
                if(!previewMode) {
                  rowDom = $("<div class='row column'></div>");
                  rowDom.append(tool);
                } else {
                  rowDom = $("<div class='row'></div>");
                }
                if(element.style) {
                  rowDom.css(element.style)
                }
                rowDom.append(tabWrap);
              } else {
                if(!previewMode) {
                  rowDom = $("<div class='row column'></div>")
                  /**.css("overflow", "hidden)*/;
                  rowDom.append(tool);
                } else {
                  rowDom = $("<div class='row'></div>");
                }
              }
              var addDom = function(target, dom) {
                if(dom) {
                  target.append(dom);
                }
              };
              var placeholder = $("<div></div>");
              addDom((previewMode ? targetDom : coldomInner), placeholder);
              tElement = $("<div></div>");
              if(element.parameters) {
                titleDom.text(element.parameters.title);
              }
              $$.loadExternalJs(['../toolkit/component/data-switch.js'], function(dataSwitch){
                var el = dataSwitch(element);
                var path = '../../toolkit/component/' + el.type;
                $$.loadExternalJs([path], callback);
                function callback(method) {
                  var dom = method({
                    Info : target.Info,
                    global : inData.layout,
                    location : location,
                    window : window,
                    index : index,
                    element : element,
                    serviceCenterService : target.serviceCenterService,
                    chartOptionService : target.chartOptionService,
                    projectUIService : target.projectUIService,
                    angularStyle : target.angularStyle,
                    timeout : target.timeout,
                    target : previewMode ? rowDom : coldomInner,
                    tabWrap : tabWrap,
                    targetDom : targetDom,
                    coldomInner : coldomInner,
                    rowDom : rowDom,
                    previewMode : previewMode,
                    resourceUIService : target.resourceUIService,
                    ticketTaskService : target.ticketTaskService,
                    buttonEnabled : buttonEnabled,
                    alertService : target.alertService,
                    routeParam : target.routeParam,
                    q : target.q,
                    imageslist : target.angularStyle.getParameters()["imgSrc"].options.map(function(element){
                      return element.value;
                    }),
                    traverseColumn : traverseColumn,
                    onTabClick : target.onTabClick
                  });
                  placeholder.after(dom);
                  placeholder.remove();
                }
              });
              tool.append(setting);
              tool.append(move);
              if(!previewMode) {
                rowDom.append(coldomInner);
                rowDom.attr("id", element.id);
                rowDom.draggable({
                  cursor : 'move',
                  revert : true,
                  handle : move,
                  start : start,
                  stop : stop,
                  cursorAt : {
                    right : 30
                  },
                  helper : function(ui){
                    var result = $(
                      "<div class='colDrag row'>" +
                      "<div class='col-xs-12'>" +
                      "<div class='row title'>" +
                      "移动一个区块去其它位置" +
                      "</div>" +
                      "<div class='row' id='grid'>" +
                      "</div>" +
                      "</div>" +
                      "</div>");
                    return result;
                  },
                  appendTo : $(".drawarea"),
                  containment : $(".drawarea"),
                  revertDuration : 0,
                  zIndex : 999
                });
              }
              if(targetDom.attr("id") != "whole" && data.length > 0) {
                emptyDom.attr({
                  id : element.id
                });
              }
              if(!previewMode) {
                if(typeof emptyDom.contextMenu == 'function') {
                  emptyDom.contextMenu("myMenu1", {
                    'bindings' : {
                      'paste': function(t) {
                        var targetId = $(t).attr("id");
                        scope.onInsert({id : targetId});
                      }
                    }
                  });
                }
                delBtn.attr({
                  id : element.id
                });
                delBtn.on("click", function(event, ui){
                  scope.$apply(function(){
                    scope.onDelete({event : event, ui: ui});
                  })
                });
                cutBtn.attr({
                  id : element.id
                });
                cutBtn.on("click", function(event, ui){
                  scope.$apply(function(){
                    scope.onCut({event : event, ui: ui});
                  })
                });
                copyBtn.attr({
                  id : element.id
                });
                copyBtn.on("click", function(event, ui){
                  scope.$apply(function(){
                    scope.onCopy({event : event, ui: ui});
                  })
                });
                pasteBtn.attr({
                  id : element.id
                });
                setting.attr({
                  id : element.id
                });
                dataBtn.attr({
                  id : element.id
                });
                setting.on("click", function(event, ui){
                  scope.$apply(function(){
                    scope.onSetting({event : event, ui : { element : tElement}});
                  })
                });
                dataBtn.on("click", function(event, ui){
                  scope.$apply(function(){
                    scope.onDataChange({event : event, ui: ui})
                  })
                });
              }
              var hideEndBlank = false;
              if(element.type != 'box-body' && element.type != 'box-footer') {
                if(!previewMode) {
                  targetDom.append(emptyDom);
                }
              }
              else {
                hasBox = true;
              }
              if(!previewMode) {
                targetDom.append(rowDom);
              } else {
                if(element.type == 'col' || element.type == 'row' || element.type == 'box' || element.type == 'box-body' || element.type == 'box-footer' || element.type == 'block' || element.type == 'tab')
                {
                  targetDom.append(rowDom);
                }
              }
              var dropConfig = _DROPCONFIG_.$clone();
              dropConfig.over = over;
              dropConfig.out = out;
              dropConfig.drop = dropBefore
              if(typeof emptyDom.droppable == 'function') {
                emptyDom.droppable(dropConfig);
              } else {
                require(['jquery-ui'], function(){
                  emptyDom.droppable(dropConfig);
                })
              }
              if(!previewMode) {
                if(element.type == "box") {
                  traverseRow(coldomInner, element.children);
                } else {
                  if(element.children) {
                    if(element.children.length > 0) {
                      traverseColumn(coldomInner, element.children);
                    }
                  }
                }
              } else {
                if(element.type == "box") {
                  traverseRow(rowDom, element.children);
                } else {
                  if(element.children) {
                    if(element.children.length > 0) {
                      traverseColumn(rowDom, element.children);
                    }
                  }
                }
              }
            })(i, data[i])
          }
          var dropConfig = _DROPCONFIG_.$clone();
          dropConfig.over = over;
          dropConfig.out = out;
          if(typeof endDom.droppable == 'function')
          {
            endDom.droppable(dropConfig);
          }
          else
          {
            require(['jquery-ui'], function(){
              endDom.droppable(dropConfig);
            })
          }
          if(!hasBox)
          {
            if(!previewMode)
            {
              targetDom.append(endDom);
              if(typeof endDom.contextMenu == 'function') {
                endDom.contextMenu("myMenu1", {
                  'bindings' : {
                    'paste': function(t) {
                      var targetId = $(t).attr("id");
                      scope.onPaste({id : targetId});
                    }
                  }
                });
              } else {
                require(['contextMenu'], function(){
                  endDom.contextMenu("myMenu1", {
                    'bindings' : {
                      'paste': function(t) {
                        var targetId = $(t).attr("id");
                        scope.onPaste({id : targetId});
                      }
                    }
                  });
                })
              }
            }
          }
        }
      };
    };
    if(typeof arguments.length == 0){
      if(typeof arguments[0] == "object"){
        renderLayout(arguments[0]);
      } else {
        throw new Error("parameter is not a object");
      }
    } else {
      if(arguments[0] == "option"){
        var method = arguments[1];
        var param = arguments[2];
        eval(method)(param);
      }
    }
    function start(event, ui) {
      $("#drawarea").css("overflow-y" , "hidden");
      var targetId = $(event.target).attr("id");
      $("#" + targetId + ".empty").addClass("hideElement");
      $("#" + targetId + ".row").addClass("hideElement");
    }
    function stop(event, ui) {
      $("#drawarea").css("overflow-y" , "auto");
      var targetId = $(event.target).attr("id");
      $("#" + targetId + ".empty").removeClass("hideElement");
      $("#" + targetId + ".row").removeClass("hideElement");
    }
    function dropBefore(event, ui){
      scope.onDrop({event : event, ui: ui, before : true});
    }
    function over(event, ui){
      var targetId = $(event.target).attr("id");
      var dragId = ui.draggable.attr("id");
      if(targetId != dragId)
      {
        var target = $(event.target);
        target.addClass("hover");
      }
    }
    function out(event, ui){
      var target = $(event.target);
      target.removeClass("hover");
    }
    function overBefore(event, ui){

      var target = $(event.target);
      target.children(".wrap").addClass("hover");
    }
    function outBefore(event, ui){
      var target = $(event.target);
      target.children(".wrap").removeClass("hover");
    }
    function drop(event, ui){
      scope.onDrop({event : event, ui: ui, before : false});
    }
    instance.renderLayout = renderLayout
    instance.setMode = setMode;
    return instance;
  }
  return target;
});
