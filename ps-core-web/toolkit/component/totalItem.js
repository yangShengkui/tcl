/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(){
  return function(data) {
    var kpiQueryModel = {};
    var element = data.element;
    var location = data.location;
    var buttonEnabled = data.buttonEnabled;
    var resourceUIService = data.resourceUIService;
    var global = data.global;
    var window = data.window;
    var serviceCenterService = data.serviceCenterService;
    var innerContent = $("<div class='small-box'></div>");
    var units = [];
    var previewMode = data.previewMode;
    var $controller = data.route.current.$$route.controller;
    var expression;
    element.resource_applied = [];
    element.kpi_applied = [];
    Object.defineProperty(element, "resource_applied", {
      enumerable : false
    });
    Object.defineProperty(element, "kpi_applied", {
      enumerable : false
    })
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        if(typeof fnResult == 'function'){
          expression = fnResult(data);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        expression = {};
        console.log(funRes.message);
      }
    });
    var clickFn = expression.$attr("on/click");
    element.setResource = function(resources){
      element.resource_applied = resources;
    };
    element.setKpi = function(kpis){
      element.kpi_applied = kpis;
    }
    var valuesize =  expression.valuesize?expression.valuesize:'38px';
    var labelsize =  expression.labelsize?expression.labelsize:'15px';
    var delayedLoad =  expression.delayedLoad?expression.delayedLoad:0;
    var renderItem = function(data) {
      var item = data.$attr("series/0/data/0") ? data.$attr("series/0/data/0") : {};
      var inner = $("<div></div>")
        .addClass("inner");
      var title = $("<span></span>")
        .text((item.value == undefined || item.value == null) ? '-' : item.value)
        .css("color", element.parameters.fontcolor)
      var unitsize = expression.unitsize?expression.unitsize:'20px';
      var unit = $("<span></span>")
        .css("font-size", unitsize)
        .text((item.unit ? item.unit : ''))
        .css("color", element.parameters.fontcolor)

      var number = $("<h3></h3>");
      number.css("font-size", valuesize)
      var subtitle = $("<p></p>")
        .text(item.name ? item.name : '-')
        .css("color", element.parameters.fontcolor)
        .css("font-size", labelsize)
      var icon = $("<div></div>")
        .addClass("icon")
      var iconsize = expression.iconsize?expression.iconsize:'70px';
      var i = $("<i></i>")
        .addClass(element.parameters.icon.perfix + " " + element.parameters.icon.css)
        .css("font-size", iconsize)
        .css("pointer-events", "none");
      icon.append(i);
      number.append(title).append(unit).append(icon);
      
      inner.append(number);
      inner.append(subtitle);
      innerContent.css("color", element.parameters.fontColor);
      innerContent.css('background-color', element.parameters.bgcolor);
      innerContent.append(inner);
      innerContent.append(icon);
      if(previewMode) {
        if(clickFn){
          if($controller != "freeBoardCtrl") {
            innerContent.css("cursor", "pointer");
            innerContent.on("click", function(evt) {
              try{
                clickFn({
                  global: global,
                  data: data,
                  element : element
                });
              } catch(e){
                console.log(e);
              };
            });
          };
        };
      };
    };
    var setTitle = function(target, text){
      target.title.text = text;
    };
    var setSubtitle = function(target, text){
      target.title.subtext = text;
    };
    var setUnit = function(target, text) {
      target.title.unit = text;
    }
    var setSeries = function(target, data) {
      target.series = data;
    };
    var setParameters = function(target, parameters, data){
      var runExpression = function(expression, data){
        var rs;
        $$.runExpression(expression, function(funRes){
          if(funRes.code == "0"){
            var fnResult = funRes.data;
            if(typeof fnResult == 'function'){
              rs = fnResult(data);
            } else {
              rs = fnResult;
            }
          } else {
            throw new Error(funRes.message);
          }
        });
        if(typeof rs == 'function'){
          return rs(data);
        } else if(rs == null) {
          return [];
        } else {
          return rs;
        }
      };
      var dtype = element.data.applied ? "bind" : "manual";
      setTitle(target, parameters.title);
      setSubtitle(target, parameters.subtitle);
      setUnit(target, parameters.unit);
      setSeries(target, runExpression(element.data.series[dtype], data));
    };
    var run = function(){
      var getCiKpi_back = function(ci, kpi){
        var checkNoEmptyArray = function(arr){
          if(arr instanceof Array){
            return arr.length > 0
          } else {
            return false;
          }
        };
        if(!checkNoEmptyArray(element.resource_applied)){
          element.resource_applied = ci;
        }
        element.resource_applied = element.resource_applied ? element.resource_applied : ci;
        element.kpi_applied = kpi;
        var baseOption = {
          title : {},
          series : [{}]
        };
        kpiQueryModel = {
          category: "ci",
          isRealTimeData: true,
          nodeIds: element.resource_applied.map(function(elem){
            return elem.id
          }),
          kpiCodes: element.kpi_applied.map(function(elem){
            return elem.id
          }),
          timeRange: "",
          statisticType: "psiot",
          includeInstance : true,
          condList: []
        };
        if(element.data.applied) {
          serviceCenterService.units.getAll().then(function(data){
            units = data;
            var category = element.$attr("advance/category") ? element.$attr("advance/category") : "time";
            var condi = element.$attr("advance/condition");
            condi = condi ? condi : "";
            var condition;
            try {
              condition = eval(condi);
            } catch(e){

            };
            var method = element.$attr("advance/getfunction") ? element.$attr("advance/getfunction") : 'kpiDataService.getValueList';
            var type = element.$attr("advance/paramtype") ? element.$attr("advance/paramtype") : "kpi";
            serviceCenterService.getValueListBytime(element.resource_applied, element.kpi_applied, undefined, undefined, undefined, category, type, method, condition).then(getValueList, failure);
          });
        } else {
          inrun({})
        }
        function getValueList(data) {
          inrun(data);
        };
        function failure(data) {
          inrun(data);
        };
        function inrun(data) {
          var baseOption = {
            title : {},
            series : [{}]
          }
          setParameters(baseOption, element.parameters, data);
          renderItem(baseOption);
        };
      };
      if (delayedLoad) {
        setTimeout(function() {
          element.getCiKpi(getCiKpi_back);
        },delayedLoad)
      } else {
        element.getCiKpi(getCiKpi_back);
      }
    };
    element.render = function(){
      run();
    };
    var initFn = expression.$attr("on/init");
    if(initFn){
      try {
        initFn({
          target : element,
          global : global
        })
      } catch(e){
        console.log(e);
      }
    } else {
      if(typeof element.data.defer == 'function') {
        element.data.defer(function(){
          run();
        });
      } else {
        run();
      }
    }
    for(var i in element){
      if(element.hasOwnProperty(i) && typeof element[i] == "function"){
        Object.defineProperty(element, i, {enumerable : false});
      }
    }
    if(element.style) {
      innerContent.css(element.style);
    }
    return innerContent;
  }
});
