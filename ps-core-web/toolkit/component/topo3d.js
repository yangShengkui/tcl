/**
 * 3Dtopo容器
 */
define([], function() {
  return function(data) {
    var elemData = data;
    if(elemData == undefined) {
      throw new Error("当前3D组态无法获得视图相关信息");
    }
    var viewFlexService = elemData.viewFlexService;
    var userLoginUIService = elemData.userLoginUIService;
    var resourceUIService = elemData.resourceUIService;
    var serviceCenterService = elemData.serviceCenterService;
    var kpiDataService = elemData.kpiDataService;
    var element = elemData.element;
    var global = elemData.global;
    var SwSocket = elemData.SwSocket;
    var q = elemData.q;
    var traverseRow = elemData.traverseRow;
    var traverseCol = elemData.traverseCol;
    var timeout = elemData.timeout;
    var route = elemData.route;
    var previewMode = elemData.previewMode;

    var viewId = element.viewId;
    var commonMethod = element.constructor;
    var json = element.JSON;
    var uuid;
    var all_resources = [];
    var all_kpis = [];
    var parentheight, parentwidth;
    var max_height, max_width;
    var taDom;
    var svgId = "svg_" + Math.uuid();
    var openAngles = {};
    var persentage = 0;
    var events = {};
    var expression;

    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        expression = fnResult;
      } else {
        console.log(funRes.message);
      }
    });

    var topo = $("<div></div>");
    topo.css("position", "relative");
    if(typeof element.setSelfDom == "function") {
      element.setSelfDom(topo);
    }

    element.$on = function(eventName, callback) {
      events[eventName] = callback;
    };

    element.off("$loadCiKpiComplete");
    element.off("$renderGraphComplete");

    element.error = function(str) {
      topo.children().remove();
      var warning = $("<p>" + str + "</p>");
      warning.css({
        "font-size": "12px",
        "min-height": "300px",
        "text-align": "center",
        "line-height": "300px"
      });
      topo.append(warning);
    };

    element.render = function(inputJson) {
      var run = function(json) {
        var parentheight = topo.parent().height();
        var parentwidth = topo.parent().width();
        var domwidth = topo.width();
        if(!element.style.height) {
          topo.css("height", "400px");
        }
        var domheight = topo.height();
        var player = new THREEJSAPP.Player();
        player.load(json);
        player.setSize(domwidth, domheight);
        player.play();
        topo.append(player.dom);
      }
      var callback = function(threejsApp) {
        window.THREE
        if(inputJson) {
          run(inputJson);
        } else {
          element.getViewById(viewId, function(view) {
            inputJson = JSON.parse(view.content);
            run(inputJson);
          });
        }
      };
      $$.loadExternalJs(["threejsApp"], callback);
    };

    delete element.self;
    topo.css("width", "100%");
    topo.css("background-position", "top");
    topo.css("background-size", "contain");
    expression = expression ? expression : {};
    var initEvent = expression.$attr("on/init");
    var clickEvent = expression.$attr("on/click");
    var wholeClickEvent = expression.$attr("on/wholeClick");
    if(element.style) {
      topo.css(element.style);
    }
    if(typeof initEvent == "function") {
      try {
        var callback = function(threejsApp) {
          window.THREE 
          initEvent({
            target: element,
            global: global,
            tools: elemData,
            topoDom: topo[0]
          });
        }
        $$.loadExternalJs(["threejsApp"], callback);
      } catch(e) {
        console.log(e);
      }
    } else {
      element.render(json);
    }
    topo.on("click", function(event) {
      if(typeof wholeClickEvent == "function") {
        try {
          wholeClickEvent({
            target: element,
            global: global
          });
        } catch(e) {
          console.log(e);
        }
      }
    });
    return topo;
  };
});