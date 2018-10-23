define(['directives/directives'], function(directives) {
  'use strict';
  directives.directive("warningList", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.scope = {
      ngModel : "="
    };
    directive.restrict = "C";
    directive.link = function(scope, element, attr){
      timeout(domReady);
      function domReady() {
        $(element).animate({
          opacity : 1
        }, 400);
      }
    };
    return directive;
  }]);
  directives.directive("animTr", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.scope = {
      order : "="
    };
    directive.restrict = "A";
    directive.link = function(scope, element, attr){
      timeout(domReady);
      function domReady()
      {
        function render(index){
          $(element).delay(index * 50).animate({
            opacity : 1
          }, 400);
        }
        scope.$watch("order", function(n,o,s){
          if(n != undefined)
          {
            render(n);
          }
        }, true);
      }
    };
    return directive;
  }]);
  directives.directive("svgPie", ["$q", "$timeout", "$location", function(q, timeout, location) {
    var directive = {};
    directive.scope = {
      ngModel : "="
    };
    directive.restrict = "A";
    directive.link = function(scope, element, attr){
      timeout(domReady);
      function domReady(){
        $$.loadExternalJs(["d3"], function(d3){
          var width = $(element).parent().width();
          var height = $(element).parent().height();
          var dom = d3.select($(element)[0]);
          dom.attr("width", width);
          dom.attr("height", height);
          dom.on("click", function(event){
            location.path("bridge/detail");
            console.log("asd");
          });
          var wrap = dom.append("g");
          wrap.attr("transform" , "translate(" + width / 2 + "," + height / 2 + ")");
          var round1 = wrap.append("g");
          round1.attr("transform", "rotate(" + 0 + ")");
          var color1 = round1.append("image");
          color1.attr("opacity" , 0);
          color1.attr("transform" , "translate(" + ( - width / 2 ) + "," + ( - height / 2 ) + ")");
          color1.attr("xlink:href" , "images/gauge1.png");
          color1.style("width", width);
          color1.style("height", height);
          var color3 = round1.append("image");
          color3.attr("opacity" , 0);
          color3.attr("transform" , "translate(" + ( - width / 2 ) + "," + ( - height / 2 ) + ")");
          color3.attr("xlink:href" , "images/gauge3.png");
          color3.style("width", width);
          color3.style("height", height);
          var bg = dom.append("circle");
          bg.attr("cx", width / 2);
          bg.attr("cy", height / 2);
          bg.attr("r", width / 2 *.7);
          bg.attr("fill", "#012f64");
          var text = dom.append("text");
          text.attr("x", width / 2);
          text.attr("y", height / 2 + 6);
          text.attr("text-anchor", "middle");
          text.attr("font-weight", "bold");
          text.style("fill", "#fff");
          text.style("font-size", 16);
          var renderData = function(value) {
            round1.attr({
              "transform" : "rotate(0)"
            });
            round1
              .transition()
              .duration(1200)
              .tween("transform", function(d){
                var node = this;
                var dgStr = node.getAttribute("transform");
                dgStr = dgStr ? dgStr : "rotate(0)";
                var deg = parseInt(parseInt(dgStr.split("rotate(")[1].split(")")[0]) / 3.6);
                var i = d3.interpolate(deg, value);
                return function(t) {
                  node.setAttribute("transform", "rotate(" + i(t) * 3.6 + ")");
                  color3.attr("opacity", i(t) / 100);
                  color1.attr("opacity", i(t) / 100);
                  text.text(parseInt(i(t)));
                }
              });
          };
          scope.$watch("ngModel", function(n,o,s){
            if(n) {
              renderData(n);
            }
          }, true);
        });
      }
    };
    return directive;
  }]);
  directives.directive("svgChart", ["$q", "$timeout", function(q, timeout) {
    return {
      'scope' : {
        "ngModel" : "=",
      },
      'restrict': 'A',
      'link': function(scope, element, iAttrs){
        $$.loadExternalJs(["d3"], function(d3){
          var width = $(element).parent().width();
          var height = $(element).parent().height();
          var svg = d3.select($(element)[0]);
          svg.attr("width", width);
          svg.attr("height", height);
          var renderData = function(data) {
            var ifxAxis;
            var getValue = function(val, rule) {
              if(typeof val == 'number') {
                return val;
              } else if(typeof val == 'string') {
                if(val.indexOf("px") != -1)
                {
                  return parseFloat(val.split("px")[0]);
                }
                else if(val.indexOf("%") != -1)
                {
                  //console.log(rule, rule * parseFloat(val.split("%")[0]) / 100);
                  return rule * parseFloat(val.split("%")[0]) / 100;
                }
              } else {
                return undefined;
              }
            };
            var ox = getValue(data.$attr("grid/left"), width);
            var offsetX = ox ? ox : 40;
            var wd = getValue(data.$attr("grid/width"), width);
            var he = getValue(data.$attr("grid/height"), height);
            //console.log(v, offsetX);
            //console.log(w,h);
            if(data.xAxis.type == "category") {
              var w = wd ? wd : width *.8;
              var h = he ? he : height *.8;
              var xAxisScale = d3.scaleBand();
              //xAxisScale.band(100);
              var xDomain = xAxisScale.domain(data.xAxis.data);
              xDomain.range([0, w]);
              var yAxisScale = d3.scaleLinear()
                .domain([data.$attr("yAxis/min") ? data.$attr("yAxis/min") : 0, data.$attr("yAxis/max") ? data.$attr("yAxis/max") : 100])
                .range([h, 0]);
              var xAxis = d3.axisBottom();
              xAxis.scale(xAxisScale);
              //xAxis.orient("bottom");
              var yAxis = d3.axisLeft();
              yAxis.ticks(5);
              yAxis.scale(yAxisScale);
              //yAxis.orient("left");
              var xAxisItem = svg.append("g");
              xAxisItem.attr("class", "axis");
              xAxisItem.attr("transform", "translate(" + offsetX + "," + (h + height *.05) + ")");
              xAxisItem.call(xAxis);
              var yAxisItem = svg.append("g");
              yAxisItem.attr("class", "axis");
              yAxisItem.attr("transform", "translate(" + offsetX + "," + height *.05 + ")");
              yAxisItem.call(yAxis);
              var xScale = d3.scaleLinear();
              xScale.domain([0, data.xAxis.data.length]);
              xScale.range([0, w]);
              var yScale = d3.scaleLinear();
              yScale.domain([data.$attr("yAxis/min") ? data.$attr("yAxis/min") : 0, data.$attr("yAxis/max") ? data.$attr("yAxis/max") : 100]);
              yScale.range([0, h]);
              ifxAxis = true;
              xAxisItem.select("path.domain").style("fill", "#254c6d");
              xAxisItem.selectAll("text").style("fill", "#1b80bd");
              yAxisItem.select("path.domain").style("opacity", 0);
              yAxisItem.selectAll("text").style("fill", "#1b80bd");
              var aline = yAxisItem.selectAll("line")
              aline.attr("x2", w);
              aline.style("stroke", "#254c6d");
              aline.style("stroke-width", 1);
            } else if(data.yAxis.type == "category") {
              var h = wd ? wd : width *.8;
              var w = he ? he : height *.8;
              var xAxisScale = d3.scaleLinear();
              xAxisScale.domain([data.$attr("xAxis/min") ? data.$attr("xAxis/min") : 0, data.$attr("xAxis/max") ? data.$attr("xAxis/max") : 100]);
              xAxisScale.range([0, h]);
              var yAxisScale = d3.scaleBand();
              yAxisScale.domain(data.yAxis.data);
              yAxisScale.range([w, 0]);
              var xAxis = d3.axisBottom();
              xAxis.ticks(10);
              xAxis.scale(xAxisScale);
              //xAxis.orient("bottom");
              var yAxis = d3.axisLeft();
              yAxis.scale(yAxisScale);
              //yAxis.orient("left");
              var xAxisItem = svg.append("g")
              xAxisItem.attr("class", "axis");
              xAxisItem.attr("transform", "translate(" + offsetX + "," + (w + height *.05) + ")");
              xAxisItem.call(xAxis);
              var yAxisItem = svg.append("g");
              yAxisItem.attr("class", "axis");
              yAxisItem.attr("transform", "translate(" + offsetX + "," + height *.05 + ")");
              yAxisItem.call(yAxis);
              var yScale = d3.scaleLinear();
              yScale.domain([0, data.yAxis.data.length]);
              yScale.range([0, w]);
              var xScale = d3.scaleLinear();
              xScale.domain([data.$attr("xAxis/min") ? data.$attr("xAxis/min") : 0, data.$attr("xAxis/max") ? data.$attr("xAxis/max") : 100]);
              xScale.range([0, h]);
              yAxisItem.select("path.domain").style("fill", "#254c6d");
              yAxisItem.selectAll("text").style("fill", "#1b80bd");
              xAxisItem.select("path.domain").style("opacity", 0);
              xAxisItem.selectAll("text").style("fill", "#1b80bd");
              var ln = xAxisItem.selectAll("line");
              ln.attr("y2", -w);
              ln.style("stroke", "#254c6d");
              ln.style("stroke-width", 1);
              ifxAxis = false;
            }
            var divide = data.series.length;
            var loopSeries = function(seriesIndex, serie) {
              var loopGroup = function(groupIndex, group) {
                svg.append("g");
                var len = group.data.length;
                var wd = w / len / divide;
                //console.log(serie)
                if(serie.type == 'bar') {
                  if(data.area) {
                    var area = svg.selectAll("g.area_" + seriesIndex + "_" + groupIndex)
                      .data(group.data)
                      .enter()
                      .append("g");
                    area.attr("transform", function(d, i){
                      var he = parseInt(this.getAttribute("height"));
                      if(ifxAxis) {
                        return "translate(" + offsetX + "," + (h - he + h *.05) + ")";
                      } else {
                        return "translate(" + offsetX + "," + (height *.85 - (yScale(i)) - wd *.9) + ")";
                      }
                    });
                    var areaRect = area.selectAll("rect")
                      .data(data.area)
                      .enter()
                      .append("rect")
                    areaRect.attr("width", function(d){
                        var rs = getValue(d.position, (ifxAxis ? w : h));
                        return rs;
                      })
                      .attr("height", wd *.9)
                      .attr("fill", function(d){
                        return d.color;
                      });
                  }
                  var rectEnter = svg.selectAll("rect.item_" + seriesIndex + "_" + groupIndex)
                    .data(group.data)
                    .enter()
                    .append("rect");
                  rectEnter
                    .attr("class", "item_" + seriesIndex + "_" + groupIndex)
                    .attr("fill", function(d, i){
                      if(group.color instanceof Array) {
                        return group.color[i % group.color.length];
                      } else {
                        return group.color;
                      }
                    })
                    .attr("width", function(d,i){
                      if(ifxAxis) {
                        var w = getValue(group.width, wd);
                        w = w ? w : wd * .7
                        return w;
                      } else {
                        return 0;
                      }
                    })
                    .attr("height", function(d, i) {
                      //console.log(d);
                      if(ifxAxis) {
                        return 0;
                      } else {
                        var w = getValue(group.width, wd);
                        w = w ? w : wd * .7;
                        return w;
                      }
                    })
                    .attr("transform", function(d, i){
                      var he = parseInt(this.getAttribute("height"));
                      if(ifxAxis) {
                        return "translate(" + (offsetX + xScale(i) + seriesIndex * wd + wd *.15 ) + "," + (h - he + h *.05) + ")";
                      } else {
                        return "translate(" + offsetX *.15 + "," + (height *.75 - (yScale(i) + seriesIndex * wd + wd *.15 )) + ")";
                      }
                    });

                  rectEnter.style({
                      stroke : function(d){
                        if(group.borderColor instanceof Array)
                        {
                          return group.borderColor[i % group.borderColor.length];
                        }
                        else
                        {
                          return group.borderColor;
                        }
                      },
                      "strokeWidth" : 1
                    });
                  if(ifxAxis) {
                    rectEnter.transition()
                      .duration(600)
                      .attr("height", function(d, i) {
                        return yScale(d);
                      })
                      .attr("transform", function(d, i){
                        var sum = 0;
                        for(var inx in serie.group) {
                          if(inx <= groupIndex) {
                            sum += serie.group[inx].data[i];
                          }
                        }
                        return "translate(" + (offsetX + xScale(i) + seriesIndex * wd + wd *.15 ) + "," + (h - yScale(sum) + h *.05) + ")";
                      })
                  } else {
                    rectEnter.transition().duration(600)
                      .attr("width", function(d, i){
                        return xScale(d);
                      })
                      .attr("transform", function(d, i){
                        var sum = 0;
                        for(var inx in serie.group) {
                          if(inx <= groupIndex) {
                            sum += serie.group[inx].data[i];
                          }
                        }
                        return "translate(" + offsetX + "," + (height* .75 - (yScale(i) + seriesIndex * wd + wd *.15 )) + ")";
                      })
                  }
                }
                else if(serie.type == 'line') {
                  var line = d3.line()
                    .x(function(d, i) {
                      return xScale(i) + width *.15;
                    })
                    .y(function(d, i) {
                      return h - yScale(d);
                    });
                  var pth = svg.append("path")
                    .datum(group.data)
                  pth.attr("d", line)
                  pth.attr("class", "item")
                  pth.style("fill", "transparent");
                  pth.style("stroke", function(d, i){
                    if(group.color instanceof Array) {
                      return group.color[i % group.color.length];
                    } else {
                      return group.color;
                    }
                  })
                  pth.style("stroke-width", 3);
                  var csymbol = svg.selectAll("circle.symbol")
                    .data(group.data)
                    .enter()
                    .append("circle");
                  csymbol.attr("class", "symbol");
                  csymbol.attr("r", 5);
                  csymbol.attr("cx", function(d, i) {
                    return xScale(i) + width *.15;
                  })
                  csymbol.attr("cy", function(d, i) {
                    return h - yScale(d);
                  })
                  csymbol.style("fill", function(d, i) {
                    if (group.borderColor instanceof Array) {
                      return group.borderColor[i % group.borderColor.length];
                    } else {
                      return group.borderColor;
                    }
                  });
                }
              };
              for(var i in serie.group) {
                loopGroup(i, serie.group[i])
              }
            };
            for(var i in data.series) {
              loopSeries(i, data.series[i]);
            }
            /*
             svg.selectAll("rect.area")append("rect")
             .attr("class", "area")
             .attr("height", wd)
             .attr("width", 100)
             .attr("transform", "translate(" + offsetX + "," + 10 + ")");
             */
          };
          scope.$watch("ngModel", function(n,o,s){
            if(n)
            {
              renderData(n);
            }
          }, true);
        });
      }
    }
  }]);
  var id = 0;
  directives.directive("changeNum", ["$q", "$timeout", function(q, timeout) {
    return {
      'scope' : {
        "ngModel" : "=",
      },
      'restrict': 'C',
      'link': function(scope, element, iAttrs){
        timeout(function(){
          var nc = new $$.numberChanger(0,10);
          function render(data) {
            var number = data.value;
            nc.stop();
            nc.render(number, function(value){
              $(element).text(value + (scope.ngModel.unit ? scope.ngModel.unit : ""));
            });
            /**
            var number = data.value;
            var final = num < parseInt(number);
            console.log(final);
            if(dd == 0){
              console.log(num, number);
            }
            traverse();
            function traverse() {
              var status = num < parseInt(number);
              $(element).text(num + (scope.ngModel.unit ? scope.ngModel.unit : ""));
              if(final == status){
                num++;
                timeout(function(){
                  traverse(status);
                }, 10);
              };
            }
             */
          };
          scope.$watch("ngModel", function(n, o, s){
            if(n) {
              render(n);
            }
          }, true);
        })
      }
    }
  }]);
  directives.directive("bridgeImage", ["$q", "$timeout", "$location", function(q, timeout, location) {
    return {
      'scope' : {
        "ngModel" : "=",
      },
      'restrict': 'C',
      'link': function(scope, element, iAttrs){
        $(element).css("display","none");

        timeout(function(){
          var blink;
          $$.loadExternalJs(["d3"], function(d3){
            var wrap = $("<div></div>")
              .css({
                cursor : "pointer",
                width : 76,
                height : 76,
                "border-radius" : "50%",
                "box-shadow" : "1px 1px 30px rgba(250,0,0,.2)",
                position : "absolute",
                bottom : "40%",
                left : "45%",
                "background-color":"rgba(250,0,0,.3)"
              })
              .on("click", function(event){
                location.path("bridge/warning");
              });
            $(element).append(wrap);
            var wrap = d3.select(wrap[0]);
            var svg = wrap.append("svg");
            svg.attr("width", 76);
            svg.attr("height", 76);
            function render(show) {
              var animationDuration = 600;
              if(show == true) {
                var group = svg.append("g")
                group.attr("transform" , "translate(38,38)");
                var circle1 = group.append("circle")
                circle1.attr("r" , 38)
                circle1.style("fill" , "#ff0000");
                var circle2 = group.append("circle")
                circle2.attr("r" , 27)
                circle2.style("fill" , "#ff9393");
                var circle3 = group.append("circle");
                circle3.attr("r" , 23)
                circle3.style("fill" , "#ff0000")
                $(element).css("display","block");
                $(element).css("opacity",0);
                $(element).stop().animate({
                  opacity : 1
                }, animationDuration);
                blink = function()
                {
                  circle1
                    .transition()
                    .duration(animationDuration)
                    .attr("r", 30)
                    .attr("opacity",.2);
                  circle2
                    .transition()
                    .duration(animationDuration)
                    .attr("r", 14)
                    .attr("opacity",.2);
                  circle3
                    .transition()
                    .duration(animationDuration)
                    .attr("r", 6)
                    .attr("opacity",.3);
                  timeout(function(){
                    circle1
                      .transition()
                      .duration(animationDuration)
                      .attr("r", 36)
                      .attr("opacity",.5);
                    circle2
                      .transition()
                      .duration(animationDuration)
                      .attr("r", 27)
                      .attr("opacity",.6);
                    circle3
                      .transition()
                      .duration(animationDuration)
                      .attr("r", 20)
                      .attr("opacity",1);
                    timeout(function(){
                      if(typeof blink == 'function')
                      {
                        blink();
                      }
                    },animationDuration)
                  },animationDuration)
                };
                blink();
              }
              else
              {
                blink = undefined;
                svg.selectAll("*").remove();
                $(element).stop().animate({
                  opacity : 0
                }, 400, function(){
                  $(element).css("display","none");
                });
              }
            };
            scope.$watch("ngModel", function(n, o, s){
              if(n != undefined)
              {
                render(n);
              }
            }, true);
          });
        })
      }
    }
  }]);
  directives.directive("bridgeImageTd", ["$q", "$timeout", "$location", function(q, timeout, location) {
    return {
      'scope' : {
        "ngModel" : "=",
      },
      'restrict': 'C',
      'link': function(scope, element, iAttrs){
        $(element).css("display","none");

        timeout(function(){
          var blink;
          $$.loadExternalJs(["d3"], function(d3){
            var wrap = $("<div></div>")
              .css({
                cursor : "pointer",
                width : 46,
                height : 46,
                "border-radius" : "50%",
                "box-shadow" : "1px 1px 30px rgba(250,0,0,.2)",
                position : "absolute",
                bottom : "58%",
                left : "27%",
                "background-color":"rgba(250,0,0,.3)"
              }).on("click", function(event){
                location.path("bridge/warning");
              });;
            $(element).append(wrap);
            var wrap = d3.select(wrap[0]);
            var svg = wrap.append("svg");
            svg.attr("width", 46);
            svg.attr("height", 46);
            function render(show) {
              var animationDuration = 600;
              if(show == false)
              {
                var group = svg.append("g");
                group.attr("transform" , "translate(23,23)");
                var circle1 = group.append("circle");
                circle1.attr("r" , 23);
                circle1.style("fill" , "#ff0000");
                var circle2 = group.append("circle");
                circle2.attr("r" , 17)
                circle2.style("fill" , "#ff9393");
                var circle3 = group.append("circle");
                circle3.attr("r" , 12);
                circle3.style("fill" , "#ff0000");
                $(element).css("display","block");
                $(element).css("opacity",0);
                $(element).stop().animate({
                  opacity : 1
                }, animationDuration);
                blink = function()
                {
                  circle1
                    .transition()
                    .duration(animationDuration)
                    .attr("r", 16)
                    .attr("opacity",.2);
                  circle2
                    .transition()
                    .duration(animationDuration)
                    .attr("r", 6)
                    .attr("opacity",.2);
                  circle3
                    .transition()
                    .duration(animationDuration)
                    .attr("r", 3)
                    .attr("opacity",.3);
                  timeout(function(){
                    circle1
                      .transition()
                      .duration(animationDuration)
                      .attr("r", 23)
                      .attr("opacity",.5);
                    circle2
                      .transition()
                      .duration(animationDuration)
                      .attr("r", 17)
                      .attr("opacity",.6);
                    circle3
                      .transition()
                      .duration(animationDuration)
                      .attr("r", 12)
                      .attr("opacity",1);
                    timeout(function(){
                      if(typeof blink == 'function')
                      {
                        blink();
                      }
                    },animationDuration)
                  },animationDuration)
                };
                blink();
              }
              else
              {
                blink = undefined;
                svg.selectAll("*").remove();
                $(element).stop().animate({
                  opacity : 0
                }, 400, function(){
                  $(element).css("display","none");
                });
              }
            };
            scope.$watch("ngModel", function(n, o, s){
              if(n != undefined)
              {
                render(n);
              }
            }, true);
          });
        })
      }
    }
  }]);
  directives.directive("echart", ["$q", "$timeout", function(q, timeout) {
    return {
      'scope' : {
        "ngModel" : "=",
      },
      'restrict': 'A',
      'link': function(scope, element, iAttrs){
        var extend = function(target, extend)
        {
          traverse(target, extend)
          function traverse(target, extend)
          {
            var repeat = function(attr){
              if(typeof extend[attr] == 'object')
              {
                if(!target.hasOwnProperty(attr))
                {
                  var constructor = extend[attr].constructor;
                  target[attr] = new constructor();
                }
                traverse(target[attr], extend[attr]);
              }
              else
              {
                target[attr] = extend[attr];
              }
            };
            for(var i in extend)
            {
              repeat(i);
            }
          }
        };
        $$.loadExternalJs(['echarts', 'macarons'], init);
        function init(echart, macarons)
        {
          window['echart'] = window['echart'] ? window['echart'] : echart;
          window['macarons'] = window['macarons'] ? window['macarons'] : macarons;
          var parent = $(element).parent();
          $(element).css({
            width : parent.width(),
            height : (parent.height() > 0) ? parent.height() : 0
          });
          timeout(domReady);
          function domReady()
          {
            var ec_instance = echart.init($(element)[0], "macarons");
            var setOption = function(data)
            {
              if(data.bmap)
              {
                require(['baiduMap', 'bmap'], function(a, b){
                  console.log(a, b);
                  var count = 0;
                  wait();
                  function wait()
                  {
                    if(count < 20)
                    {
                      count += 1;
                      timeout(function(){
                        if(window.BMap == undefined)
                        {
                          wait();
                        }
                        else
                        {
                          run(window.Bmap);
                        }
                      });
                    }
                    else
                    {
                      throw new Error('百度视图获取失败!!')
                    }
                  }
                });
              }
              else
              {
                run();
              }
              function run()
              {
                var option = {
                  tooltip : {
                    trigger: 'item'
                  }
                };
                extend(option, data);
                console.log(option);
                ec_instance.setOption(option);
              }
            };
            scope.$watch("ngModel", function(n,o,s){
              if(n)
              {
                setOption(n);
              }
            })
          }
        }
      }
    }
  }]);
  directives.directive("divBar", ["$q", "$timeout", function(q, timeout) {
    return {
      'scope' : {
        "ngModel" : "=",
      },
      'restrict': 'A',
      'link': function(scope, element, iAttrs){
        var empty = $("<div></div>")
          .css({
            display : "block",
            height : 1,
            clear : "both"
          })
        var getItem = function()
        {
          var column = $("<div></div>")
            .css({
              "width": "33%",
              "margin" : "4px auto",
              "float" : "left"
            });
          var title = $("<div></div>")
            .text("指标名称")
            .css({
              "margin" : "5px 0 0 30px",
              "color": "#fff"
            });
          var mark = $("<div></div>")
            .css("width", 10)
            .css("height", 2)
            .css({
              "background-color" : "#36d7ff",
              "margin" : "2px 0 0 45px"
            });
          var value = $("<div></div>")
            .text("234")
            .css({
              "color" : "#fff",
              "margin" : "2px 0 0 55px"
            });
          var bar = $("<div></div>")
            .css("background-image","url(images/bar.png)")
            .css("width", 94)
            .css("height", 12)
            .css({
              "margin" : "5px 30px"
            });
          column.append(title);
          column.append(bar);
          column.append(mark);
          column.append(value);
          return column;
        }
        for(var i = 0; i<6; i++)
        {
          $(element).append(getItem())
        }
        $(element).append(empty);
      }
    }
  }]);
});