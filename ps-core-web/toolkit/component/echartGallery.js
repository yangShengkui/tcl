define([], function () {
    return function (data) {
        var myChart;
        var element = data.element;
        var target = $("<div></div>")
        if (element.style) {
            target.css(element.style);
        }
        var expression;
        $$.runExpression(element.$attr("advance/expression"), function (funRes) {
            if (funRes.code == 0) {
                expression = funRes.data;
                expression = expression ? expression : {};
            } else {
                expression = {};
            }
        });
        var initFn = expression.$attr("on/init");
        // echart渲染
       var render = function (option) {
            require(['echarts','echartGalleryJs'], function (echarts) {
                myChart = echarts.init($(target)[0]);
                myChart.setOption(option);
            });
        };
      element.render = render;
      element.resize = function(){
            myChart.resize();
        }
        if (initFn) {
            try {
                initFn({
                    target: element
                })
            } catch (e) {
                console.log(e);
            }
        } else {
          render();
        }
        return target;
    }
    return target;
})
