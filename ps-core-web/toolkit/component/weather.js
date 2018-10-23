/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var dom = $("<div></div>").addClass("row");
    var element = data.element;
    var global = data.global;
    var style = data.element.style;
    var city = element.$attr("parameters/city");
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        if(typeof fnResult == 'function') {
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression || {};
      } else {
        expression = {};
        console.log(funRes.message);
        //throw new Error(funRes.message);
      }
    });
    var initFn = expression.$attr("on/init");
    style = style ? style : {};
    var wrap = $("<div></div>").addClass("weather-layout js-weather-layout weather-flip");
    var weatherService = data.weatherService;
    element.setCity = function(cityName){
      city = cityName;
    };
    var getWeatherInfo = function(callback){
      weatherService.getWeatherByCity(city, function(event){
        if(event.code == "0"){
          var json = JSON.parse(event.data);
          if(json.status == "success"){
            callback(json.results);
          };
        };
      });
    };
    var render = function(){
      getWeatherInfo(function(result){
        var widget = $("<div></div>").addClass("weather-widget col-md-12");
        var main = $("<div></div>").addClass("weather-widget-main");
        var ul = $("<ul></ul>");
        var title = $("<div></div>");
        if(style){
          main.css(style);
        }
        ul.css("margin", 0);
        ul.css("padding", 0);
        ul.css("list-style", "none");
        widget.append(main);
        main.append(title);
        title.text(result[0].currentCity + "近期天气状况");
        title.css("line-height", "30px");
        title.css("border-bottom", "1px solid rgba(250,250,250,.2)");
        title.css("background-color", "rgba(250,250,250,.1)");
        main.append(ul);
        var createItem = function(weather){
          var li = $("<li></li>");
          li.addClass("col-md-3");
          li.css("float", "left");
          li.css("padding", "10px");
          li.css("border-right", "1px solid rgba(250,250,250,.2)");
          var date = $("<p></p>");
          date.css("margin", 0);
          date.text(weather.date);
          var temperature = $("<p></p>");
          temperature.css("margin", 0);
          temperature.addClass("title-deg");
          temperature.text(weather.temperature);
          var icon = $("<p></p>");
          icon.css("margin",0);
          var i = $("<i></i>").addClass("icn-weather");
          i.css("font-size", "60px");
          i.attr("data-weather-icn", weather.weather);
          icon.append(i);
          li.append(icon);
          li.append(temperature);
          li.append(date);
          return li;
        };
        for(var i in result[0].weather_data){
          ul.append(createItem(result[0].weather_data[i]));
        };
        var li = $("<li></li>")
        li.css("clear", "both");
        ul.append(li);
        wrap.append(widget);
        dom.append(wrap);
      });
    };
    element.render = render;
    if(initFn){
      try{
        initFn({
          target: element,
          global : global
        })
      } catch(e){
        if(route.current.$$route.controller == "freeStyleCtrl"){
          growl.error("组件［天气信息］的初始化表达式配置发生错误！");
        };
        console.log(e);
      }
    } else {
      render();
    }
    return dom;
  }
});
