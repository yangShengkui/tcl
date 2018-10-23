/**
 * Created by leonlin on 16/11/3.
 */
define([], function () {
  return function (data) {
    var ra = 0;
    var element = data.element;
    var serviceCenterService = data.serviceCenterService;
    var innerContent = $("<div></div>")
      .addClass("description-block border-right");
    var itag = $("<i></i>");
    var rate = $("<span></span>")
    //var text = $("<span class='description-percentage text-red'><i class='fa fa-caret-up'></i><span id='rate'>" + (element.attributes.percent ? element.attributes.percent.value : '') + "%</span></span>");
    var text = $("<span></span>")
      .addClass("description-percentage");
    var valueDom = $("<h5></h5>")
      .addClass("description-header");
    var disc = $("<span></span>")
      .addClass("description-text");
    text.append(itag);
    text.append(rate);
    innerContent.append(text);
    innerContent.append(valueDom);
    innerContent.append(disc);
    var renderItem = function (data) {
      var val = "0", label = "-";
      var item = data.series[0];
      if (item) {
        var vlist = item.data;
        label = item.name;
        if (vlist.length > 0) {
          last = vlist[vlist.length - 1];
          ra =  Math.round( (last - vlist[0])/vlist[0]*10000)/100.00;
          ra = isNaN(ra) ? '-' : parseInt(ra);
          val = last;
        } else {
          ra = 0;
          val = "-"
        }
      }
      itag.removeClass();
      text.removeClass();
      if (ra > 0) {
        itag.addClass("fa fa-caret-up");
        text.addClass("text-red");
      } else if (ra < 0) {
        itag.addClass("fa fa-caret-down");
        text.addClass("text-green");
      } else {
        itag.addClass("fa fa-caret-left");
        text.addClass("text-gray");
      }
      if(isNaN(ra)){
        rate.text(' - %');
      }else {
        rate.text(' '+Math.abs(ra) + '%');
      }
      valueDom.text(val);
      if(label){
        disc.text(label.replace(/\-/,'/'));
      }
    };
    var setSeries = function (target, data) {
      target.series = data;
    };
    var setParameters = function (target, parameters, data) {
      var runExpression = function (expression, data) {
        var result;
        $$.runExpression(expression, function (funRes) {
          if (funRes.code == "0") {
            var fnResult = funRes.data;
            if (typeof fnResult == 'function') {
              result = fnResult(data);
            } else {
              result = fnResult;
            }
          } else {
            throw new Error(funRes.message);
          }
        });
        return result;
      };
      var dtype = element.data.applied ? "bind" : "manual";
      setSeries(target, runExpression(element.data.series[dtype], data));
    };
    var run = function () {
      var getCiKpi_back = function (ci, kpi) {
        var baseOption = {
          series: [{}]
        }
        if (element.data.applied) {
          var condition = [
            "kpi",
            "{object:kpiQueryModel}"
          ];
          serviceCenterService.getValueListBytime(ci, kpi, 7 * 24 * 3600 * 1000, undefined, "年月日", "time", "kpi", "kpiDataService.getValueList", condition).then(function success(data) {
            run(data);
          });
        } else {
          run()
        }
        ;

        function run(data) {
          var baseOption = {
            series: [{}]
          }
          setParameters(baseOption, element.parameters, data);
          renderItem(baseOption);
        };
      };
      element.getCiKpi(getCiKpi_back);
    }
    if (typeof element.data.defer == 'function') {
      element.data.defer(function () {
        run();
      });
    } else {
      run();
    }
    if (element.style) {
      innerContent.css(element.style);
    }
    return innerContent;
  }
});
