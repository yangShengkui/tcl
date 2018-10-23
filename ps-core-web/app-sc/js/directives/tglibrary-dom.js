define(['directives/directives', 'echarts', 'jquery-ui', 'slick', 'Array'], function(directives, echarts, slick) {
  'use strict';
  directives.registerDirective("tgSlick", tgSlickDir);
  tgSlickDir.$inject = ['$q', '$timeout', '$compile', 'serviceCenterService'];

  function tgSlickDir(q, timeout, compile, serviceCenterService) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      previewList: "=",
      mode: "@",
      click: "&"
    };
    directive.link = function(scope, element) {
      //use : 1. add a attribute 'tg-slick' to your tab (with or without a value);
      timeout(domReady);

      function domReady() {
        initSlick();
        scope.$watch("previewList", $previewList_watcher);
      }

      function initSlick() {
        $(element).slick({
          dots: false,
          arrows: true,
          draggable: false,
          slidesToScroll: 5,
          variableWidth: true,
          infinite: false
        });
      }

      function $previewList_watcher(n, o, s) {
        var newLength, oldLength;
        newLength = n instanceof Array ? n.length : 0;
        //oldLength = o instanceof Array ? o.length : 0;
        if(newLength > 0) {
          removeAllSlick();
          renderSlick(n);
        }

        function removeAllSlick() {
          //remove all slick element one by one.
          var length = $(element).find(".slick-list [slickItem]").size();
          for(var j = length - 1; j > -1; j--) {
            $(element).slick('slickRemove', j);
          }
        }

        function renderSlick(data) {
          serviceCenterService.units.getAll().then(function(units) {
            for(var i in data) {
              (function(index) {
                var TOP_TEXT, BLOCK_IMAGE, BOTTOM_TEXT, $wrap, $slickItem, $pdom, $block, $idom, $h5dom;
                console.log(scope.previewList);
                var unit
                if(scope.previewList[index].kpi != null) {
                  unit = scope.previewList[index].kpi.unit;
                }

                var unitSymbol = units.find(function(ele) {
                    return ele.unitCode == unit;
                  })
                  //initialize 3 parameters used to display kpi information
                TOP_TEXT = "previewList[" + index + "].value + '" + (unitSymbol ? unitSymbol.unitName : '') + "'";
                BLOCK_IMAGE = "previewList[" + index + "].kpi.icon";
                BOTTOM_TEXT = "previewList[" + index + "].label";
                //prepare jquery dom object to compile.
                //$wrap = $('<div>{{mode}}</div>');
                $slickItem = $('<div></div>').attr("slickItem", '').addClass("box-body");
                $pdom = $('<p></p>').addClass("text-muted text-center").attr("ng-bind", TOP_TEXT);
                $block = $('<div></div>').addClass("btn btn-ps-normal").css({
                  width: "72px",
                  height: "72px"
                });
                $idom = $('<i></i>').addClass("ps-lg").attr("ng-class", BLOCK_IMAGE);
                $h5dom = $('<h5></h5>').addClass("text-center").attr("ng-bind", BOTTOM_TEXT);
                $block.append($idom);
                $slickItem.append($pdom).append($block).append($h5dom);
                //$wrap.append($slickItem);
                //compile jquery object to angularjs.
                $(element).slick('slickAdd', compile($slickItem)(scope));
                $slickItem.on("click", function() {
                  scope.$apply(function() {
                    scope.click();
                  });
                })
              })(i);
            }
          });
          //render slick in a clean and empty container.
        }
      }
    };
    return directive;
  }
  directives.registerDirective("tgImage", tgImageDir);
  tgImageDir.$inject = ['$q', '$timeout'];

  function tgImageDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      blk: "=",
    };
    directive.link = function(scope, element, attr) {
      timeout(function() {
        var width = $(element).width();
        $(element).height(width * 720 / 1024);
      });
      $(window).on("resize", function(event) {
        var width = $(element).width();
        $(element).height(width * 720 / 1024);
      })
    };
    return directive;
  }
  directives.registerDirective("ipcam", ipcamDir);
  ipcamDir.$inject = ['$q', '$timeout'];

  function ipcamDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      ic: "=",
    };
    directive.link = function(scope, element, attr) {
      var url;
      $(function() {
        $(document).tooltip({
          position: {
            my: "center bottom-20",
            at: "center top",
            using: function(position, feedback) {
              $(this).css(position);
              $("<div>")
                .addClass("arrow")
                .addClass(feedback.vertical)
                .addClass(feedback.horizontal)
                .appendTo(this);
            }
          }
        });
      });
      timeout(function() {
        scope.$watch("ic", function(n, o, s) {
          if(n) {
            n.openCam = function(value) {
              if(url){
                $(element).find("#videoDiv").attr("src", url);
              }
            };
            n.closeCam = function(value) {
              if(url) {
                $(element).find("#videoDiv").removeAttr("src");
              }
            };
          }
        });
        var ipcaminfo = {},
          loginauth = "",
          goalurl = "";
        $(element).find(".camWrap").resizable();
        $(element).find(".camWrap").draggable({
          handle: $(element).find(".camWrap .camHeader"),
          containment: $(element).parent(),
          snap: true,
          snapMode: "both"
        });
        requestipcam("localdb/ipcam.json", "bigimg");

        function requestipcam(requesturl, imgId) {
          $.ajax({
            url: requesturl,
            type: "Get",
            contenttype: "application/json",
            success: function(data) {
              if(null != data && data != "") {
                if(typeof(data) == "string") ipcaminfo = $.parseJSON(data);
                else ipcaminfo = data;
                loginauth = "user=" + ipcaminfo.username + "&pwd=" + ipcaminfo.password + "&res=0";
                goalurl = "http://" + ipcaminfo.ip + ":" + ipcaminfo.port;
                url = goalurl + "/videostream.cgi?" + loginauth + "&resolution=320*240&rate=12"
                  //$(element).find("#videoDiv").attr("src", url);
                  //+ "&resolution=320*240&rate=12"
              }
            }
          });
        }
      });
    };
    return directive;
  }
  directives.registerDirective("tgDrag", tgDragDir);
  tgDragDir.$inject = ['$q', '$timeout'];

  function tgDragDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      chart: "=",
      target: "="
    };
    directive.link = function(scope, element, attr) {
      timeout(domReady);

      function domReady() {
        $(element).draggable({
          helper: function() {
            var result = $("<div class='tg-helper'></div>").css({
              width: scope.target[scope.target.type].width,
              height: scope.target[scope.target.type].height,
              border: "1px dashed #bbb"
            });
            return result;
          },
          handle: $(element).find("#moveBtn"),
          revert: false,
          cursor: "move",
          cursorAt: [50, 50],
          appendTo: $("body")
        });
      }
    };
    return directive;
  }
  directives.registerDirective("tgDrop", tgDropDir);
  tgDropDir.$inject = ['$q', '$timeout'];

  function tgDropDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      onDrop: "&",
    };
    directive.link = function(scope, element, attr) {
      timeout(domReady);

      function domReady() {
        $(element).droppable({
          drop: drop
        });

        function drop(event, ui) {
          scope.$apply(ready);

          function ready() {
            if($(ui.draggable).attr("id") == "tg-drag") {
              scope.onDrop({
                ui: ui
              });
            }
          }
        }
      }
    };
    return directive;
  }
  directives.registerDirective("tgElement", tgElementDir);
  tgElementDir.$inject = ['$q', '$timeout'];

  function tgElementDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      stopResize: "&",
      stopMove: "&",
      target: "="
    };
    directive.link = function(scope, element, attr) {
      timeout(domReady);

      function domReady() {
        $(element).resizable({
          aspectRatio: scope.target.scale,
          stop: function(event, ui) {
            scope.$apply(ready);

            function ready() {
              scope.stopResize({
                ui: ui
              });
            }
          }
        });
        $(element).draggable({
          containment: $(".drawingArea"),
          stop: function(event, ui) {
            scope.$apply(ready);

            function ready() {
              scope.stopMove({
                ui: ui
              });
            }
          }
        });
      }
    };
    return directive;
  }
  directives.registerDirective("tgEcharts", echartsDir);
  echartsDir.$inject = ['$q', '$timeout'];

  function echartsDir(q, timeout) {
    var directive = {};
    directive.restrict = "C";
    directive.scope = {
      chart: "=",
    };
    directive.link = function(scope, element, attr) {
      var target;
      var _option_;
      timeout(function() {
        scope.$watch("chart", function(n, o, s) {
          if(n) {
            n.setOption = function(option) {
              this._option_ = option;
              target.setOption(this._option_);
            };
            n.pushData = function(value, time) {
              if(this._option_) {
                if(this._option_.series[0].data.length > 25) {
                  this._option_.series[0].data.shift();
                  this._option_.xAxis.data.shift();
                }
                this._option_.series[0].data.push(parseFloat(value));
                this._option_.xAxis.data.push(time);
                target.setOption(this._option_);
              }
            }
          }
        });
        var ci = scope.chart.ci;
        var kpi = scope.chart.kpi;
        var option = scope.chart.option;
        target = echarts.init(element[0], "macarons");
        if(option) {
          target.setOption(option);
        }
        $(window).on("resize." + attr.id, function(event) {
          target.resize();
        });
      });
    };
    return directive;
  }
  directives.registerDirective("tgRotate", tgRotateDir);
  tgRotateDir.$inject = ['$q', '$timeout'];

  function tgRotateDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      rotate: "=",
    };
    directive.link = function(scope, element, attr) {
      timeout(function() {
        scope.$watch("rotate", function(n, o, s) {
          if(n) {
            n.highLight = function() {
              $(element).stop();
              $(element).css("opacity", 1);
              clearTimeout(n.to);
              n.to = setTimeout(function() {
                if(parseFloat($(element).css("opacity")) > 0.6) {
                  $(element).animate({
                    "opacity": .6
                  }, 200)
                }
              }, 1000);
            };
          }
        });
        $(element).css("opacity", .8);
      });
    };
    return directive;
  }
  directives.registerDirective("tgScrollbar", scrollbarDir);
  scrollbarDir.$inject = ['$q', '$timeout'];

  function scrollbarDir(q, timeout) {
    var directive = {};
    directive.restrict = "C";
    directive.scope = {
      control: "=",
    };
    directive.link = function(scope, element, attr) {
      timeout(function() {
        scope.$watch("control", function(n, o, s) {
          if(n) {
            n.setValue = function(value) {
              n.value = value;
              $(element).slider("value", value);
              n.onChange(value);
            };
          }
        });
        $(element).slider({
          range: "min",
          slide: function(event, ui) {
            scope.$apply(function() {
              if(scope.control.onSlide) {
                scope.control.onSlide(ui.value);
              }
              scope.control.value = ui.value;
            });
          },
          stop: function(event, ui) {
            scope.$apply(function() {
              if(scope.control.onChange) {
                scope.control.onChange(ui.value)
              }
              if(typeof scope.control.sendDeviceDirective == 'functioin') {
                scope.control.sendDeviceDirective(ui.value);
              }
              scope.control.value = ui.value;
            });
          }
        });
        if(scope.control.value == '-') {
          $(element).slider("value", 0);
        } else {
          $(element).slider("value", scope.control.value ? scope.control.value : 0);
        }

      });
    };
    return directive;
  }
  directives.registerDirective("tgBlink", blinkDir);
  blinkDir.$inject = ['$q', '$timeout'];

  function blinkDir(q, timeout) {
    var directive = {};
    directive.restrict = "A";
    directive.scope = {
      blk: "=",
    };
    directive.link = function(scope, element, attr) {
      scope.$watch("blk", function(n, o, s) {
        if(n) {
          n.startBlink = function() {
            timeout(function() {
              $(function() {
                blinkFn($(element));
              });
            });
          };
          n.stopBlink = function() {
            $(element).stop();
            $(element).css({
              opacity: 0
            })
          };
        }
      });
      timeout(function() {
        $(function() {
          $(element).css("opacity", 0);
        });
      });

      function blinkFn(selector) {
        $(selector).animate({
          'opacity': 1
        }, {
          duration: 300,
          complete: function() {
            $(selector).animate({
              'opacity': 0
            }, {
              duration: 300,
              complete: function() {
                blinkFn($(selector));
              }
            })
          }
        })
      }
    };
    return directive;
  }
  directives.registerDirective("tgToggle", toggleDir);
  toggleDir.$inject = ['$q', '$timeout'];

  function toggleDir(q, timeout) {
    var directive = {};
    directive.restrict = "C";
    directive.template = "<div class='toggle-wrap'><div class='toggle-inner'></div></div>";
    directive.scope = {
      tg: "=",
    };
    directive.link = function(scope, element, attr) {
      scope.$watch("tg", function(n, o, s) {
        if(n) {
          n.setValue = function(value) {
            n.value = value > 0;
            if(value > 0) {
              $(element).find('.toggle-wrap').addClass("active");
            } else {
              $(element).find('.toggle-wrap').removeClass("active")
            }
            if(n.onChange) {
              n.onChange(value > 0);
            }
          };
        }
      });
      timeout(function() {
        $(function() {
          var val;
          if(typeof scope.tg.value == 'string') {
            val = parseInt(scope.tg.value);
          } else {
            val = scope.tg.value
          }
          if(val > 0) {
            $(element).find('.toggle-wrap').addClass("active");
          } else {
            $(element).find('.toggle-wrap').removeClass("active")
          }
          $(element).on("click", function() {
            scope.$apply(function() {
              scope.tg.value = parseInt(scope.tg.value) > 0 ? 0 : 1;
              if(scope.tg.value > 0) {
                $(element).find('.toggle-wrap').addClass("active");
              } else {
                $(element).find('.toggle-wrap').removeClass("active")
              }
              if(typeof scope.tg.onChange == "function") {
                scope.tg.onChange(!scope.tg.value);
              }

              if(typeof scope.tg.sendDeviceDirective == 'functioin') {
                scope.tg.sendDeviceDirective(scope.tg.value);
              }
            })
          });
        });
      });
    };
    return directive;
  }
});