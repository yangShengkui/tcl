/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(commonMethod){
  return function(data) {
    var run, baseOption;
    var extension = {};
    var expression;
    var target;
    var echartTarget;
    var zoomOld;
    var mapJson;
    var tg = {};
    var growl = data.growl;
    var elemData = data;
    var wrap = $("<div></div>");
    var echartDom = $("<div></div>");
    var element = data.element;
    var buttonEnabled = data.buttonEnabled;
    var serviceCenterService = data.serviceCenterService;
    var kqiManagerUIService = data.kqiManagerUIService;
    var angularStyle = data.angularStyle;
    var timeout = data.timeout;
    var global = data.global;
    var window = data.window;
    var route = data.route;
    var previewMode = data.previewMode;
    var rootScope = data.rootScope;
    var Info = data.Info;
    var SwSocket = data.SwSocket;
    var scope = data.scope;
    var ngDialog = data.ngDialog;
    var kqiModel = element.$attr("data/kqiModel");
    var ci,kpi;
    var oriLength = 0;
    var loadData = [];
    var expression;
    if(element.style) {
      wrap.css(element.style)
      echartDom.css("height", element.style.height);
      wrap.css("height", "auto");
    };
    wrap.append(echartDom);
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        expression = {};
        console.log(funRes.message);
      };
    });
    var extension = expression.$attr("on/extension") || [];
    var initFn = expression.$attr("on/init");
    $$.loadExternalJs(['echarts', 'macarons'], function(echarts){
      if(initFn){
        try{
          initFn({
            target: element,
            global : global,
            echarts : echarts
          })
        }catch(e){
          console.log(e);
        }
      }
      element.render = function(option){
        var target = echartTarget = target = echarts.init(echartDom[0], "macarons");
        target.setOption(option);
      };
    });
    return wrap;
  }
});