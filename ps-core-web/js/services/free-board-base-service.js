define(['../services/services.js'], function (services) {
  'use strict';
  services.factory('freeboardBaseService', ['$rootScope', 'serviceProxy', 'SwSocket', 'userDomainService', 'weatherService', 'kqiManagerUIService', 'customMethodService', 'dictionaryService', 'energyConsumeUIService', 'serviceCenterService',
    'userLoginUIService', 'viewFlexService', '$q', '$timeout', '$route', '$routeParams', 'resourceUIService', 'Info', 'growl', 'chartOptionService', 'angular-style', 'ticketTaskService', 'alertService', 'kpiDataService', 'ngDialog',
    'projectUIService', 'thridPartyApiService', '$compile', '$controller', 'FileUploader',
    function (rootScope, serviceProxy, SwSocket, userDomainService, weatherService, kqiManagerUIService, customMethodService, dictionaryService, energyConsumeUIService, serviceCenterService, userLoginUIService, viewFlexService, q, timeout, route,
              routeParam, resourceUIService, Info, growl, chartOptionService, angularStyle, ticketTaskService, alertService, kpiDataService, ngDialog, projectUIService, thridPartyApiService, compile, controller, FileUploader) {
      return function (targetDom) {
        var cur = targetDom;
        var events = {};
        var instance = {};
        var previewMode = false;
        var buttonEnabled = true;
        var _DROPCONFIG_ = {
          greedy: true,
          drop: drop
        };
        var promiseInx = 0;
        var addEvents = function (data) {
          for (var i in data) {
            (function (attr, val) {
              events[attr] = val
            })(i, data[i])
          }
        };
        var setMode = function (bool) {
          previewMode = bool;
        };
        var setButtonDisable = function (bool) {
          buttonEnabled = false;
        };
        var renderLayout = function (inData, config) {
          $("body").find("#popup_background").remove();
          instance.rootTarget = inData;
          //var settingData = inData.setting;
          var settingData;
          $$.runExpression(inData.setting, function (funRes) {
            if (funRes.code == "0") {
              var fnResult = funRes.data;
              if (typeof fnResult == 'function') {
                settingData = fnResult(data, system);
              } else {
                settingData = fnResult;
              }
              settingData = settingData ? settingData : {};
            } else {
              settingData = {};
              //throw new Error(funRes.message);
            }
          });
          var link = $("link[href*=\\.\\.\\/css\\/theme\\/" + (settingData.theme || "default") + "\\.css]");
          if (link.size() == 0) {
            var linkDom = $("<link />");
            linkDom.attr("href", "../css/theme/" + (settingData.theme || "default") + ".css");
            linkDom.attr("rel", "stylesheet");
            var head = $("head");
            head.append(linkDom);
          }
          
          $(".drawarea").css(settingData.style || {
              padding: "15px"
            });
          /**
           if(settingData == undefined) {
            settingData = {
              color : "transparent",
              padding : 15
            }
          }*/
          run(inData.layout);
          function run(layout) {
            console.log("runrunru--------");
            $(cur).children().remove();
            var wrap = $("<div class='wrap'></div>");
            layout.fire = function (eventName, param) {
              timeout(function () {
                layout.traveseByChild(function (element) {
                  var expression;
                  if (element) {
                    if (element.advance) {
                      if (element.advance.expression) {
                        //console.log(element.advance.expression);
                        $$.runExpression(element.advance.expression, function (funRes) {
                          //console.log(funRes.code);
                          if (funRes.code == 0) {
                            if (element.source == "BARCHART") {
                              console.log(funRes.data);
                            }
                            expression = funRes.data;
                            expression = expression ? expression : {};
                          }
                        });
                      }
                    }
                  }
                  
                  if (expression) {
                    var customeEvent = expression.$attr("on/" + eventName);
                    if (customeEvent) {
                      customeEvent({
                        target: element,
                        element: element,
                        global: inData.layout,
                        params: param
                      });
                    }
                  }
                  
                })
              });
            };
            layout.variable = function (variableName) {
              var find = null;
              if (window.variable == undefined) {
                window.variable = {};
              }
              if (window["variable"][variableName]) {
                find = window["variable"][variableName];
              } else {
                layout.traveseByChild(function (element) {
                  if (element.$attr("advance/variable") == variableName) {
                    find = element;
                    window["variable"][variableName] = element;
                  }
                })
              }
              return find;
            };
            layout.traverse(function (attr, element) {
              if (element.hasOwnProperty("__onChange__")) {
                element.oldValue = element.value;
              }
            });
            if (!previewMode) {
              $(cur).attr("id", layout.id);
              if (typeof wrap.droppable == 'function') {
                wrap.droppable({
                  greedy: true
                });
              } else {
                require(['jquery-ui'], function () {
                  wrap.droppable({
                    greedy: true
                  });
                })
              }
            }

            if (!previewMode) {
              $(cur).append(wrap);
              traverseRow(wrap, layout.children, previewMode);
            } else {
              traverseRow($(cur), layout.children, previewMode);
            }
            function traverseColumn(targetDom, data, pMode, renderFinish_callback) {
              for (var i in data) {
                var coldom;
                var c = data[i].col;

                c = typeof c == "object" ? c : [c, 0];
                var val = c[0] + (c[1] ? "-" + c[1] : "" );
                if(data[i].allNum > data[i].maxNum){
                    var styles = ""
                    var num = data[i].allNum % data[i].maxNum
                    var numFloor = Math.floor(data[i].allNum / data[i].maxNum);
                    if(data[i].updown == "up"){
                        if(i == num -1){
                            // val = 12 / num
                            if(i == 0){
                                styles = "margin-right:40%";
                            }else if(i == 1){
                                styles = "margin-right:20px";
                            }

                        }
                    }
                    // else {
                    //   if(i >= numFloor * data[i].maxNum){
                    //       val = 12 / num;
                    //   }
                    // }

                }
                if (!pMode) {
                  if (data[i].type == "tabItem") {
                    coldom = $("<div tabId='tabId_" + i + "' class='col-md-12'></div>");
                    coldom.addClass("tab-content");
                  } else {
                    coldom = $("<div class='col-md-" + data[i].col + " column'></div>");
                  }
                } else {
                  if (data[i].type == "tabItem") {
                    coldom = $("<div tabId='tabId_" + i + "' class='col-md-12'></div>");
                    coldom.addClass("tab-content");
                  } else {
                    if (c) {
                      coldom = $('<div style="'+styles+'" class="col-md-' + val + '"></div>');
                    }
                    
                  }
                }
                
                if (data[i].$attr("parent/parent/source") == "ROW") {
                  if (data[i].$attr("parent/parent/parameters/alignment") == "float") {
                    coldom.css("width", "auto");
                  }
                }
                var coldomInner = $("<div class='wrap'></div>");
                var renderRow = function (tg) {
                  if (coldom) {

                    targetDom.append(coldom);
                    if (!pMode) {
                      coldom.append(coldomInner);
                      coldom.attr("id", data[i].id);
                    }
                    traverseRow(tg, data[i].children, pMode, renderFinish_callback);
                  }
                  
                };
                if (!pMode) {
                  if (data[i].type == "tabItem") {
                    if (data.parent) {
                      if (data.parent.tabInx != undefined) {
                        if (i == data.parent.tabInx) {
                          renderRow(coldom);
                        }
                      } else {
                        if (data[i].default) {
                          renderRow(coldom);
                        }
                      }
                    }
                    
                  } else {
                    renderRow(coldomInner);
                  }
                  
                } else {
                  if (data[i].type == "tabItem") {
                    if (data.parent) {
                      if (data.parent.tabInx != undefined) {
                        if (i == data.parent.tabInx) {
                          if (data[i].children) {
                            if (data[i].children.length > 0) {
                              renderRow(coldom);
                            }
                          }
                        }
                      } else {
                        if (data[i].default) {
                          renderRow(coldom);
                        }
                      }
                    }
                  } else {
                    if (data[i].children) {
                      if (data[i].children.length > 0) {
                        renderRow(coldom);
                      }
                    }
                  }
                }
              }
            }
            function traverseRow(targetDom, data, pMode, renderFinish_callback) {
              traverseRow.promises = traverseRow.promises || [];
              var endDom = $("<div class='emptyEnd'></div>");
              var hasBox = false;
              if ($(targetDom).attr("id")) {
                endDom.attr("id", $(targetDom).attr("id"));
              } else {
                endDom.attr("id", $(targetDom).parent().attr("id"));
              }
              for (var i in data) {
                (function (index, element) {
                  var tElement;
                  var rowDom, instruct;
                  var coldomInner = $("<div class='wrap'></div>");
                  var setting = $("<div class='btn'><span class='proudsmart ps-edit'></span></div>");
                  var move = $("<div id='move' class='btn move'><span class='proudsmart ps-move'></span></div>");
                  var dataBtn = $("<div id='data' class='btn'><span class='proudsmart ps-linked-data'></span></div>");
                  var emptyDom = $("<div id='beforeDom' class='empty'></div>");
                  var delBtn = $("<div class='btn'><span class='proudsmart ps-delete'></span></div>");
                  var copyBtn = $("<button class='btn'><span class='glyphicon glyphicon-duplicate'></span></button>");
                  var pasteBtn = $("<div class='btn'><span class='glyphicon glyphicon-duplicate'></span></div>");
                  var cutBtn = $("<div class='btn'><span class='glyphicon glyphicon-scissors'></span></div>");
                  var tool = $("<div class='tool'></div>");
                  var title = $("<div></div>")
                    .text(element.label)
                    .css("padding", "0 15px")
                    .css("color", "#fff")
                    .css("background-color", "#3c8dbc")
                    .css("float", "left")
                    .css("font-weight", "bold");
                  var tabWrap = $("<div class='tabWrap'></div>");
                  var titleDom = $("<h3 class='box-title'>标题标题</h3>");
                  var minbutton = $('<div class="box-tools pull-right">\
										<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>\
									</div>');
                  tool.append(title);
                  tool.append(delBtn);
                  tool.append(copyBtn);
                  tool.append(cutBtn);
                  if (element.type == "box") {
                    titleDom.css("width", "100%");
                    tool.append(setting);
                    var headerDom = $("<div class='box-header with-border'></div>");
                    headerDom.append(titleDom);
                    rowDom = $("<div class='row column'></div>")
                    if (element.style) {
                      rowDom.css(element.style);
                    }
                    rowDom.append(headerDom);
                    if (!pMode) {
                      rowDom.append(tool);
                    } else {
                      headerDom.append(minbutton);
                    }
                  } else if (element.type == "box-body") {
                    instruct = $("<div class='instruct'></div>")
                    instruct.text("内容区")
                    if (!pMode) {
                      rowDom = $("<div class='row column'></div>");
                      rowDom.append(instruct);
                    } else {
                      rowDom = $("<div></div>");
                    }
                  } else if (element.type == "box-footer") {
                    instruct = $("<div class='instruct'></div>")
                    instruct.text("注释区");
                    if (!pMode) {
                      rowDom = $("<div class='row column'></div>");
                      rowDom.append(instruct);
                    } else {
                      rowDom = $("<div></div>");
                    }
                  } else if (element.type == "block") {
                    if (!pMode) {
                      rowDom = $("<div class='row column block'></div>");
                      rowDom.append(tool);
                    } else {
                      rowDom = $("<div class='row block'></div>");
                      /**
                       if(settingData) {
                        rowDom.css("margin-right", "-" + 0 + "px");
                        rowDom.css("margin-left", "-" + 0 + "px");
                      }*/
                    }
                  } else if (element.type == "tab") {
                    if (!pMode) {
                      rowDom = $("<div class='row column'></div>");
                      rowDom.append(tool);
                    } else {
                      rowDom = $("<div class='row'></div>");
                    }
                    if (element.style) {
                      rowDom.css(element.style)
                    }
                    rowDom.append(tabWrap);
                  } else {
                    if (!pMode) {
                      rowDom = $("<div class='row column'></div>")
                      /**.css("overflow", "hidden)*/;
                      rowDom.append(tool);
                    } else {
                      rowDom = $("<div class='row'></div>");
                    }
                  }
                  var addDom = function (target, dom) {
                    if (dom) {
                      target.append(dom);
                    }
                  };
                  var placeholder = $("<div></div>");
                  addDom((pMode ? targetDom : coldomInner), placeholder);
                  tElement = $("<div></div>");
                  if (element.parameters) {
                    titleDom.text(element.parameters.title);
                  }
                  var promise = (function(defer, inx){
                    defer.id = inx;
                    $$.loadExternalJs(['../toolkit/component/data-switch.js'], function (dataSwitch) {
                      var el = dataSwitch(element);
                      var path = 'toolkit/component/' + el.type;
                      if (el.type != "column" && el.type != "tabItem") {
                        $$.loadExternalJs([path], callback);
                      }
                      function callback(method) {
                        //if(typeof method != "function") return;
                        console.assert((typeof method == "function"), path + "加载失败！" + typeof method );
                        var dom = method({
                            Info: Info,
                            global: inData.layout,
                            location: location,
                            window: window,
                            index: index,
                            element: element,
                            scope: rootScope,
                            compile: compile,
                            ngDialog: ngDialog,
                            wholeJSON: inData,
                            serviceCenterService: serviceCenterService,
                            chartOptionService: chartOptionService,
                            projectUIService: projectUIService,
                            thridPartyApiService: thridPartyApiService,
                            userLoginUIService: userLoginUIService,
                            angularStyle: angularStyle,
                            traverseRow: traverseRow,
                            timeout: timeout,
                            target: pMode ? rowDom : coldomInner,
                            tabWrap: tabWrap,
                            customMethodService: customMethodService,
                            energyConsumeUIService: energyConsumeUIService,
                            dictionaryService: dictionaryService,
                            targetDom: targetDom,
                            coldomInner: coldomInner,
                            kqiManagerUIService: kqiManagerUIService,
                            growl: growl,
                            defer : defer,
                            tElement : tElement,
                            rowDom: rowDom,
                            userDomainService: userDomainService,
                            weatherService: weatherService,
                            serviceProxy: serviceProxy,
                            viewFlexService: viewFlexService,
                            previewMode: pMode,
                            resourceUIService: resourceUIService,
                            ticketTaskService: ticketTaskService,
                            buttonEnabled: buttonEnabled,
                            alertService: alertService,
                            onTabClick: events.onTabClick,
                            SwSocket: SwSocket,
                            kpiDataService: kpiDataService,
                            route: route,
                            routeParam: routeParam,
                            q: q,
                            imageslist: angularStyle.getParameters()["imgSrc"].options.map(function (element) {
                              return element.value;
                            }),
                            traverseColumn: traverseColumn
                            //onTabClick : onTabClick
                          }) || {};
                        if (typeof renderFinish_callback == "function") {
                          renderFinish_callback(element, dom);
                        }
                        if(!dom.underWatch){
                          defer.resolve("not under watch!!");
                        }
                        placeholder.after(dom);
                        placeholder.remove();
                      }
                    });
                    defer.promise.$$state.dom = element;
                    defer.promise.id = inx;
                    promiseInx++;
                    return defer.promise;
                  })(q.defer(), promiseInx);
                  traverseRow.promises.push(promise);
                  tool.append(setting);
                  tool.append(move);
                  if (!pMode) {
                    rowDom.append(coldomInner);
                    rowDom.attr("id", element.id);
                    rowDom.draggable({
                      cursor: 'move',
                      revert: true,
                      handle: move,
                      start: start,
                      stop: stop,
                      cursorAt: {
                        right: 30
                      },
                      helper: function (ui) {
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
                      appendTo: $(".drawarea"),
                      containment: $(".drawarea"),
                      revertDuration: 0,
                      zIndex: 999
                    });
                  }
                  if (targetDom.attr("id") != "whole" && data.length > 0) {
                    emptyDom.attr({
                      id: element.id
                    });
                  }
                  if (!previewMode) {
                    if (typeof emptyDom.contextMenu == 'function') {
                      emptyDom.contextMenu("myMenu1", {
                        'bindings': {
                          'paste': function (t) {
                            var targetId = $(t).attr("id");
                            events.onInsert({id: targetId});
                          },
                          'json': function (t) {
                            var targetId = $(t).attr("id");
                            events.onInsertJSON({id: targetId});
                          }
                        }
                      });
                    }
                    delBtn.attr({
                      id: element.id
                    });
                    delBtn.on("click", function (event, ui) {
                      rootScope.$apply(function () {
                        events.onDelete({event: event, ui: ui});
                      })
                    });
                    cutBtn.attr({
                      id: element.id
                    });
                    cutBtn.on("click", function (event, ui) {
                      rootScope.$apply(function () {
                        events.onCut({event: event, ui: ui});
                      })
                    });
                    var clone = element.$clone();
                    delete clone.$index;
                    delete clone.id;
                    delete clone.template;
                    if (!clone.hasOwnProperty("url")) {
                      clone.url = "images/map/map1.png";
                    }
                    copyBtn.attr({
                      "id": element.id,
                      "data-clipboard-text": JSON.stringify(clone, null, 2)
                    });
                    $$.loadExternalJs(['clipboard'], function (Clipboard) {
                      var clipboard = new Clipboard(copyBtn[0]);
                      clipboard.on('success', function (e) {
                        rootScope.$apply(function () {
                          e.id = element.id;
                          events.onCopy({event: e});
                        });
                        growl.success("成功复制到剪切版");
                        e.clearSelection();
                      });
                      clipboard.on('error', function (e) {
                        console.error('Action:', e.action);
                        console.error('Trigger:', e.trigger);
                      });
                    });
                    /**
                     copyBtn.on("click", function(event, ui){
                      rootScope.$apply(function(){
                        events.onCopy({event : event});
                      });
                      growl.success("成功复制到剪切版");
                    });*/

                    /**
                     $$.loadExternalJs(['zeroclipboard'], function(ZeroClipboard){
                      var client = new ZeroClipboard(copyBtn[0]);
                      client.on( "ready", function( readyEvent ) {
                        client.on( "aftercopy", function( event ) {
                          rootScope.$apply(function(){
                            events.onCopy({event : event});
                          });
                          growl.success("成功复制到剪切版");
                        });
                      });
                    });*/
                    pasteBtn.attr({
                      id: element.id
                    });
                    setting.attr({
                      id: element.id
                    });
                    dataBtn.attr({
                      id: element.id
                    });
                    setting.on("click", function (event, ui) {
                      rootScope.$apply(function () {
                        events.onSetting({event: event, ui: {element: tElement}});
                      })
                    });
                    dataBtn.on("click", function (event, ui) {
                      rootScope.$apply(function () {
                        events.onDataChange({event: event, ui: ui})
                      })
                    });
                  }
                  var hideEndBlank = false;
                  if (element.type != 'box-body' && element.type != 'box-footer') {
                    if (!pMode) {
                      targetDom.append(emptyDom);
                    }
                  }
                  else {
                    hasBox = true;
                  }
                  if (!pMode) {
                    targetDom.append(rowDom);
                  } else {
                    if (element.type == 'col' || element.type == 'row' || element.type == 'box' || element.type == 'box-body' || element.type == 'box-footer' || element.type == 'block' || element.type == 'tab') {
                      targetDom.append(rowDom);
                    }
                  }
                  var dropConfig = _DROPCONFIG_.$clone();
                  dropConfig.over = over;
                  dropConfig.out = out;
                  dropConfig.drop = dropBefore
                  if (typeof emptyDom.droppable == 'function') {
                    emptyDom.droppable(dropConfig);
                  } else {
                    require(['jquery-ui'], function () {
                      emptyDom.droppable(dropConfig);
                    })
                  }
                  if (!pMode) {
                    if (element.type == "box") {
                      traverseRow(coldomInner, element.children, pMode, renderFinish_callback);
                    } else if (element.type != "repeater" && element.type != "injector") {
                      if (element.children) {
                        if (element.children.length > 0) {
                          traverseColumn(coldomInner, element.children, pMode, renderFinish_callback);
                        }
                      }
                    }
                  } else {
                    if (element.type == "box") {
                      traverseRow(rowDom, element.children, pMode, renderFinish_callback);
                    } else if (element.type != "repeater" && element.type != "injector") {
                      if (element.children) {
                        if (element.children.length > 0) {
                          traverseColumn(rowDom, element.children, pMode, renderFinish_callback);
                        }
                      }
                    }
                  }
                })(i, data[i])
              }
              var dropConfig = _DROPCONFIG_.$clone();
              dropConfig.over = over;
              dropConfig.out = out;
              if (typeof endDom.droppable == 'function') {
                endDom.droppable(dropConfig);
              }
              else {
                require(['jquery-ui'], function () {
                  endDom.droppable(dropConfig);
                })
              }
              if (!hasBox) {
                if (!pMode) {
                  targetDom.append(endDom);
                  $$.loadExternalJs(['contextmenu'], function () {
                    endDom.contextMenu("myMenu1", {
                      'bindings': {
                        'paste': function (t) {
                          var targetId = $(t).attr("id");
                          events.onPaste({id: targetId});
                        },
                        'json': function (t) {
                          var targetId = $(t).attr("id");
                          events.onPasteJSON({id: targetId});
                        }
                      }
                    });
                  });
                }
              }
              return traverseRow.promises
            }
          };
        };

        function start(event, ui) {
          $("#drawarea").css("overflow-y", "hidden");
          var targetId = $(event.target).attr("id");
          $("#" + targetId + ".empty").addClass("hideElement");
          $("#" + targetId + ".row").addClass("hideElement");
        }

        function stop(event, ui) {
          $("#drawarea").css("overflow-y", "auto");
          var targetId = $(event.target).attr("id");
          $("#" + targetId + ".empty").removeClass("hideElement");
          $("#" + targetId + ".row").removeClass("hideElement");
        }

        function dropBefore(event, ui) {
          events.onDrop({event: event, ui: ui, before: true});
        }

        function over(event, ui) {
          var targetId = $(event.target).attr("id");
          var dragId = ui.draggable.attr("id");
          if (targetId != dragId) {
            var target = $(event.target);
            target.addClass("hover");
          }
        }

        function out(event, ui) {
          var target = $(event.target);
          target.removeClass("hover");
        }

        function overBefore(event, ui) {

          var target = $(event.target);
          target.children(".wrap").addClass("hover");
        }

        function outBefore(event, ui) {
          var target = $(event.target);
          target.children(".wrap").removeClass("hover");
        }

        function drop(event, ui) {
          events.onDrop({event: event, ui: ui, before: false});
        }

        //上传文件的设置，第4句最重要
        rootScope.fileFormat = "JPG、PNG、xls、xlsx、pdf、doc、docx、jpg、png、jpeg、bmp、gif、svg、pptx、ppt";
        rootScope.fileMaxSize = 10;
        rootScope.serviceOrigin = '/api/rest/upload/resourceFileUIService/uploadResourceFile';
        controller('AppUploadCtrl', {$scope: rootScope, growl: growl, FileUploader: FileUploader});

        instance.renderLayout = renderLayout;
        instance.setMode = setMode;
        instance.setButtonDisable = setButtonDisable;
        instance.addEvents = addEvents;
        return instance;
      }
    }
  ]);
});