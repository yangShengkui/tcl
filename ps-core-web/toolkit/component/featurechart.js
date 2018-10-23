/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var wrap = $("<div></div>")
      .css({
        position : "relative",
        width : "100%"
      });
    var index = data.index;
    var element = data.element;
    var chartOptionService = data.chartOptionService;
    var timeout = data.timeout;
    /*
    var linData = {
      label : "选择监测类型",
      value : "in",
      type : "select",
      option : [{
        label : "进水口波动偏差预警",
        value : "in"
      },{
        label : "出水口边缘工况预警",
        value : "out"
      }]
    }
    */
    var echartDom = $("<div></div>");
    var echartAlert = $("<div>偏差值低预警</div>");
    var button = $("<button class='btn btn-primary'>模拟分析过程</button>")
      .css({
        margin : "10px"
      });
    echartAlert.css("background-color", "red");
    echartAlert.css("position", "absolute");
    echartAlert.css("color", "#fff");
    echartAlert.css("padding", "10px");
    echartAlert.css("top", "30px");
    echartAlert.css("right", "90px");
    echartAlert.css("width", "140px");
    echartAlert.css("text-align", "center");
    echartAlert.css("font-weight", "bold");
    echartAlert.css("font-size", "16px");
    echartAlert.css("border-radius", "8px");
    echartAlert.css("box-shadow", "1px 1px 10px #ff5a00");
    echartAlert.css("display", "none");
    echartAlert.css("z-index", 999);
    wrap.append(echartDom);
    wrap.append(button);
    timeout(function(){
      if(element.style)
      {
        echartDom.css(element.style);
      }
      echartDom.css("width", wrap.width());
      $$.loadExternalJs(['echarts', 'macarons'], function(echarts){
        var repeat, renderChart;
        var linechart = new chartOptionService.linechart();
        var target = echarts.init(echartDom[0], "macarons");
        var pres_xAxis = [], pres_data1 = [], pres_data2 = [], inx = 0;
        linechart.setTitle({
          text : ""
        });
        var xAxis=[], xAxis_offset = [] ,legend = ['估计值', "测量值"];
        var start = new Date().getTime() - 3 * 24 * 3600 * 1000;
        if(element.parameters.type == 1)
        {
          var data1 = [69,70,71,70,69,68,69,70,69,71,70,71,70,70,71,71,72,71,71,70,71,72,71,71,70,70,70,70,70,69,69,70,70,70,71,71,71,71,70,71,70,71,71,71,72,72,71,72,72,70];
          var data2 = [68.4,69.8,70.6,69.4,68.7,67.6,68.6,69.4,68.6,70.8,69.4,70.6,69.8,69.7,70.6,70.4,71.6,70.6,70.4,69.6,70.8,71.8,70.7,68.4,67.3,67.6,67.9,68.6,69.4,68.7,67.6,67.2,67.4,67.8,68.1,68.8,69.6,68.3,67.4,67.8,68.3,69.4,70.6,69.8,69.4,69.1,69.9,71.6,70.1,69.5];
        }
        else
        {
          var data1 = [85,80,80,80,79,82,82,80,78,83,84,83,80,80,81,82,84,85,85,83,81,82,81,81,80,80,80,80,80,79,79,81,83,82,79,77,80,82,79,78,80,81,82,79,84,83,81,82,84,79];
          var data2 = [84,79,79.6,79.4,79,81.5,81,79.6,77.6,82.5,83.7,82.6,79.4,79.6,80.6,81.5,83.7,84.6,84.5,82.7,80.8,81.4,80.6,80.8,79.8,79.9,79.9,79.8,78.6,78.6,78.4,80.6,82.7,81.7,78.6,76.8,79.4,81.8,78.6,77.8,79.8,80.8,81.9,78.4,83.8,82.4,80.9,81.6,83.4,78.9];
          for(var i in data1)
          {
            if(data1[i] + i * i / 200 < 88)
            {
              data1[i] += i * i /200;
              data2[i] += i * i /200;
            }
            else
            {
              data1[i] = Math.round((88 - Math.random() * 2) * 100) / 100;
              data2[i] = Math.round((88 - Math.random() * 2) * 100) / 100;
            }
          }
        }
        var data1offset1 = [], data2offset2 = [], base1 = 70, base2 = 69.5;
        for(var i in data1)
        {
          xAxis.push(start + i * 300 * 1000);
        }
        linechart.setTimeformat("时分");
        linechart.setLegend(legend);
        (function(tg, button){
          renderChart = function(xAxis, data1, data2)
          {
            linechart.setxAxis({
              data : xAxis
            });
            var xAxis_formatted = linechart.getxAxis();
            linechart.setSeries([{
              name : "估计值",
              data : data1,
              smooth : true,
              markLine : {
                label : {
                  normal : {
                    show : true
                  }
                },
                lineStyle : {
                  normal : {
                    color : "#cc2424"
                  }
                },
                data: [
                  {
                    name: '报警温度',
                    yAxis: 90
                  }
                ]
              },
              itemStyle : {
                normal : {
                  color : "#66c9d8"
                }
              }
            },{
              name : "测量值",
              data : data2,
              smooth : true,
              markLine : {
                label : {
                  normal : {
                    show : true
                  }
                },
                lineStyle : {
                  normal : {
                    type : "solid",
                    color : "#cc2424"
                  }
                },
                data: [
                  {
                    name: '跳闸温度',
                    yAxis: 100
                  }
                ]
              },
              markArea: {
                data: (function(){
                  if(element.parameters.type == 1)
                  {
                    return [
                      [{
                        name: '波动偏差过大',
                        xAxis: xAxis_formatted[22]
                      }, {
                        xAxis: function(){
                          if(xAxis_formatted.length <= 26)
                          {
                            return xAxis_formatted[xAxis_formatted.length - 1]
                          }
                          else
                          {
                            return xAxis_formatted[26]
                          }
                        }()
                      }],
                      [{
                        name: '波动偏差过大',
                        xAxis: xAxis_formatted[29]
                      }, {
                        xAxis: function(){
                          if(xAxis_formatted.length <= 40)
                          {
                            return xAxis_formatted[xAxis_formatted.length - 1]
                          }
                          else
                          {
                            return xAxis_formatted[40]
                          }
                        }()
                      }],
                      [{
                        name: '波动偏差过大',
                        xAxis: xAxis_formatted[43]
                      }, {
                        xAxis: function(){
                          if(xAxis_formatted.length <= 45)
                          {
                            return xAxis_formatted[xAxis_formatted.length - 1]
                          }
                          else
                          {
                            return xAxis_formatted[45]
                          }
                        }()
                      }]
                    ]
                  }
                  else
                  {
                    return [
                      [{
                        name: '长时间接近告警温度',
                        xAxis: xAxis_formatted[32]
                      }, {
                        xAxis: function(){
                          if(xAxis_formatted.length <= 48)
                          {
                            return xAxis_formatted[xAxis_formatted.length - 1]
                          }
                          else
                          {
                            return xAxis_formatted[48]
                          }
                        }()
                      }]
                    ]
                  }
                })(),
                itemStyle : {
                  normal : {
                    color : "#f7dde2"
                  }
                }
              },
              itemStyle : {
                normal : {
                  color : "#8e66d8"
                }
              }
            }]);
            var option = linechart.returnOption();
            option.yAxis.max = 100;
            option.yAxis.min = 60;
            //console.log(JSON.stringify(option, null, 2));
            tg.setOption(option);
          }
          button.on("click", function(event){
            var cur = $(event.currentTarget);
            //console.log(cur);
            pres_xAxis = xAxis.slice(0,20); pres_data1 = data1.slice(0,20); pres_data2 = data2.slice(0,20);
            renderChart(pres_xAxis, pres_data1, pres_data2);
            if(cur.text() == '模拟分析过程')
            {
              repeat = function()
              {
                if(inx < xAxis.length)
                {
                  pres_xAxis.push(xAxis[inx]);
                  pres_data1.push(data1[inx]);
                  pres_data2.push(data2[inx]);
                  timeout(function(){
                    renderChart(pres_xAxis, pres_data1, pres_data2);
                    inx++;
                    if(typeof repeat == 'function')
                    {
                      repeat();
                    }
                  }, 1000)
                }
              }
              inx = 21;
              cur.text('返回初始状态');
              cur.removeClass("btn-primary");
              cur.addClass("btn-cancel");
              repeat();
            }
            else if(cur.text() == '返回初始状态')
            {
              cur.text('模拟分析过程');
              cur.removeClass("btn-cancel");
              cur.addClass("btn-primary");
              repeat = undefined;
            }
          });
          renderChart(xAxis.slice(0,20), data1.slice(0,20), data2.slice(0,20));
        })(target, button);
        $(window).on('resize', function(event){
          target.resize();
        });
      });
    });
    return wrap
  }
});
