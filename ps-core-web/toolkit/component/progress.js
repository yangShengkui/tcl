/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var serviceCenterService = data.serviceCenterService;
    var innerContent = $("<div></div>")
      .addClass("progress-group");
    var units = [];
    var text = $("<span></span>")
      .addClass("progress-text");
    var number = $("<span></span>")
      .addClass("progress-number");
    var pb_wrap = $("<div></div>")
      .addClass("progress sm");
    var pb_bar = $("<div></div>")
      .addClass("progress-bar")
    var renderItem = function(data) {
      var item = data.$attr("series/0/data/0") ? data.$attr("series/0/data/0") : {};
      text.text(item.name ? item.name : "");
      number.text(item.value ? item.value + "%" : "");
      pb_bar.css("width", item.value ? item.value + "%" : "0px");
      pb_bar.removeClass();
      switch (true) {
        case item.value == 100:
          pb_bar.addClass("progress-bar progress-bar-aqua");
          break;
        case item.value > 90:
          pb_bar.addClass("progress-bar progress-bar-green");
          break;
        case item.value > 80:
          pb_bar.addClass("progress-bar progress-bar-yellow");
          break;
        case item.value > 70:
          pb_bar.addClass("progress-bar progress-bar-yellow");
          break;
        case item.value > 60:
          pb_bar.addClass("progress-bar progress-bar-red");
          break;
        default:
          pb_bar.addClass("progress-bar progress-bar-danger");
          break;
      }
      pb_wrap.append(pb_bar);
      innerContent.append(text);
      innerContent.append(number);
      innerContent.append(pb_wrap);
    };
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
        return rs;
      };
      var dtype = element.data.applied ? "bind" : "manual";
      setSeries(target, runExpression(element.data.series[dtype], data));
    };
    var run = function(){
      var getCiKpi_back = function(ci, kpi){
        var ci = element.data.resource ? element.data.resource : [];
        var kpi = element.data.kpi ? element.data.kpi : [];
        var baseOption = {
          title : {},
          series : [{}]
        }
        if(element.data.applied) {
          serviceCenterService.units.getAll().then(function(data){
            units = data;
            var category = "ci";
            var condition = element.$attr("advance/condition") ? element.$attr("advance/condition") : [];
            var method = element.$attr("advance/getfunction") ? element.$attr("advance/getfunction") : 'kpiDataService.getValueList';
            var type = element.$attr("advance/paramtype") ? element.$attr("advance/paramtype") : "kpi";
            serviceCenterService.getValueListBytime(ci, kpi, undefined, undefined, undefined, category, type, method, condition).then(getValueList, failure);
          });
        } else {
          run({})
        }
        function getValueList(data) {
          run(data);
        };
        function failure(data) {
          run(data);
        };
        function run(data) {
          var baseOption = {
            title : {},
            series : [{}]
          }
          setParameters(baseOption, element.parameters, data);
          renderItem(baseOption);
        };
      };
      element.getCiKpi(getCiKpi_back);
    };
    if(typeof element.data.defer == 'function')
    {
      element.data.defer(function(){
        run();
      });
    }
    else
    {
      run();
    }
    if(element.style)
    {
      innerContent.css(element.style);
    }
    return innerContent;
  }
});
