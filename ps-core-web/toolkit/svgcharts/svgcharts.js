/**
 * Created by leonlin on 16/11/3.
 */
if(typeof define == "function"){
  define(['d3'], createCharts);
} else {
  window.svgcharts = createCharts(d3)
}
function createCharts(d3){
  return {
    init : function(dom, opts){
      //var colors = ["#0ca4fe", "#e8b609", "#e74e54"];
      var colors = ["#00bc79", "#ece417", "#ee6b1c"];
      var wrap = d3.select(dom);
      var svg = wrap.append("svg");
      var defs = svg.append("defs");
      var AxisDom = svg.append("g");
      var DURATION = 1000;
      var seriesDom = svg.append("g");
      var _options_ = opts || null;
      var _grid_;
      var width, height;
      var creatGradient = function(id, config){
        var id = id;
        var color1 = config.color1 || "#000";
        var color2 = config.color2 || "#fff";
        var x1 = config.x1 || "0%";
        var y1 = config.y1 || "0%";
        var x2 = config.x2 || "100%";
        var y2 = config.y2 || "0%";
        var linearGradient = defs.append("linearGradient")
          .attr("id", id)
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2);
        var stop1 = linearGradient.append("stop")
          .attr("offset","0%")
          .style("stop-color", color1);
        var stop2 = linearGradient.append("stop")
          .attr("offset","100%")
          .style("stop-color", color2);
      };
      var resize = function(event){
        setTimeout(function(){
          setSize();
          setGrid(_options_.grid);
          setOption(_options_);
        });
      };
      var setSize = function(){
        width = $(dom).width();
        height = $(dom).height();
        svg.attr("width", width);
        svg.attr("height", height);
      };
      var createDiamond = function(width, deg){
        var path = "M0 0 ";
        var degree = deg / 180 * Math.PI;
        path += "L" + width / 2 + " -" + width * Math.sin(degree) + " ";
        path += "L" + width + " 0 ";
        path += "L" + width / 2 + " " + width * Math.sin(degree) + " ";
        path += "L0 0 ";
        return path;
      };
      var createShadowShapeLeft = function(width, height, deg){
        var degree = deg / 180 * Math.PI;
        var path = "M0 " + width * Math.sin(degree) + " ";
        path += "L-" + width / 2 + " 0 ";
        path += "L-" + width / 2 + " " + height + " ";
        path += "L0 " + (height + width * Math.sin(degree)) + " ";
        path += "L0 0 ";
        return path;
      };
      var createShadowShapeRight = function(width, height, deg){
        var degree = deg / 180 * Math.PI;
        var path = "M0 " + width * Math.sin(degree) + " ";
        path += "L" + width / 2 + " 0 ";
        path += "L" + width / 2 + " " + height + " ";
        path += "L0 " + (height + width * Math.sin(degree)) + " ";
        path += "L0 0 ";
        return path;
      };
      var calculate = function(number, per){
        var regExp = [/(\d+)\%/];
        if(regExp[0].exec(per)[1]){
          return number * parseInt(regExp[0].exec(per)[1]) / 100;
        }
        /** not finished yet */
      };
      var xRange = function(height, length){
        if(length > 2){
          var rs = [];
          var step = height / length;
          for(var i=0; i<length; i++){
            rs.push(i * step);
          };
          return rs;
        } else {
          return [];
        };
      };
      var getMax = function(series){
        var max = 0;
        var values = series.reduce(function(a, b){
          if(b.stack){
            a[b.stack] = a[b.stack] || [];
            for(var i in b.data) {
              a[b.stack][i] = a[b.stack][i] || 0;
              a[b.stack][i] += parseInt(b.data[i]);
            };
          } else {
            a[b.name] = a[b.name] || [];
            for(var i in b.data) {
              a[b.name][i] = a[b.name][i] || 0;
              a[b.name][i] += parseInt(b.data[i]);
            };
          }
          return a;
        }, {});
        var allValue = [];
        for(var i in values){
          Array.prototype.push.apply(allValue, values[i]);
        };
        //console.log(series, values[i]);
        max = Math.max.apply(null, allValue) * 1.2;
        return max;
      };
      var setOption = function(options){
        var w = _grid_.width;
        var h = _grid_.height;
        var xAxis = options.xAxis || null;
        var yAxis = options.yAxis || null;
        var max = yAxis ? (yAxis.max || getMax(options.series)) : getMax(options.series);
        var createAxis = function(){
          AxisDom.selectAll("*").remove();
          var createxAxis = function(data){
            var g = AxisDom.append("g");
            var x = d3.scaleOrdinal()
              .domain(data)
              .range(xRange(w, data.length));
            var step = w / data.length;
            g.call(d3.axisBottom(x));
            g.selectAll("text")
              .attr("fill", xAxis.$attr("axisLabel/color") || "#333")
              .attr("y", xAxis.$attr("axisLabel/margin") || 9)
              .style("display", xAxis.$attr("axisLabel/show") == false ? "none" : "display");
            var line = g.selectAll("line")
              .attr("stroke", xAxis.$attr("axisLine/lineStyle/color") || "#333")
              .style("display", xAxis.$attr("axisLine/show") == false ? "none" : "display");
            g.selectAll("path")
              .attr("stroke", xAxis.$attr("axisTick/color") || "#333")
              .style("display", xAxis.$attr("axisTick/show") == false ? "none" : "display");;
            g.attr("transform", "translate(" + (_grid_.left + step / 2) + ", " + (h + _grid_.top) + ")");
          };
          var createyAxis = function(data){
            var rect = AxisDom.append("path");
            var g = AxisDom.append("g");
            var y = d3.scaleLinear()
              .domain([0, max])
              .range([h, 0]);
            var rectMargin = yAxis.$attr("base/margin") || -10;
            rect.attr("d", "M0 0 " + "L" + _grid_.width + " 0 L" + _grid_.width * 1.02 + " 25 L-" + _grid_.width *.02 + " 25 L0 0");
            rect.attr("transform", "translate(" + _grid_.left + "," + (_grid_.height + _grid_.top + rectMargin) + ")");
            rect.attr("fill", "url(#base)");
            var axis = d3.axisLeft(y);
            axis.ticks(yAxis.$attr("splitNumber") || 5);
            g.call(axis);
            g.selectAll("text")
              .attr("fill", yAxis.$attr("axisLabel/color") || "#333")
              .attr("x", -yAxis.$attr("axisLabel/margin") || -9)
              .style("display", yAxis.$attr("axisLabel/show") == false ? "none" : "display");
            var line = g.selectAll("line")
              .attr("stroke", yAxis.$attr("axisLine/lineStyle/color") || "#333")
              .style("display", yAxis.$attr("axisLine/show") == false ? "none" : "display");
            g.selectAll("path")
              .attr("stroke", yAxis.$attr("axisTick/color") || "#333")
              .style("display", yAxis.$attr("axisTick/show") == false ? "none" : "display");
            line.attr("x1", -6);
            line.attr("x2", _grid_.width);
            g.attr("transform", "translate(" + _grid_.left + ", " + _grid_.top + ")");
          };
          if(xAxis) {
            if(xAxis.show != false){
              createxAxis(xAxis.data);
            }
          };
          if(yAxis) {
            if(yAxis.show != false){
              createyAxis(yAxis.data);
            };
          }
        };
        var createSeries = function(series){
          var types = series.reduce(function(a,b){
            if(a.indexOf(b.type) == -1){
              a.push(b.type);
            };
            return a;
          },[]);
          var extentData = function(series){
            var step = _grid_.width / series[0].data.length;
            var stacks = [], stackObj = {};
            for(var i in series){
              if(stacks.indexOf(series[i].stack) == -1){
                stacks.push(series[i].stack);
                stackObj[series[i].stack] = [];
              }
            };
            var renderBar = function(index, item, value, stackValue, length, mainInx, subInx, stackLength, color, barwidth){
              var w = step / stackLength * barwidth;
              return {
                x : _grid_.left + ( index +  (1 - barwidth) / 2 ) * step + mainInx * w,
                y : _grid_.height * (1- stackValue / max) + _grid_.top,
                width : w,
                height : value / max * _grid_.height,
                color : color
              }
            };
            var renderBar3D = function(index, item, value, stackValue, length, mainInx, subInx, stackLength, color, barwidth, degree, isTop, isBottom){
              var w = step / stackLength * barwidth;
              var rs = {
                x : _grid_.left + ( index +  (1 - barwidth) / 2 ) * step + mainInx * w,
                y : max > 0 ? _grid_.height * (1- stackValue / max) + _grid_.top : _grid_.height + _grid_.top,
                width : w,
                height :  max > 0 ? value / max * _grid_.height : 0,
                stackHeight : max > 0 ? stackValue / max * _grid_.height : 0,
                color : color,
                degree : degree,
                isTop : isTop,
                isBottom : isBottom,
                value : stackValue,
                label : ({
                  normal : {
                    show : false
                  }
                }).$extension(item.label || {})
              };
              if(max){
                // console.log(value, max);
                // console.log(rs);
              };
              //
              return rs;
            };
            var ser = {
              line : [],
              bar : []
            };
            var prepareBarData = function(i, item){
              var inx = 0;
              var barwidth = item.barwidth || .6
              var filter = series.filter(function(elem){
                return elem.stack == item.stack;
              });
              var mainInx = stacks.indexOf(item.stack);
              var subInx = filter.indexOf(item);
              Array.prototype.push.apply(ser['bar'], item.data.map(function(elem){
                if(!stackObj[item.stack][inx]){
                  stackObj[item.stack][inx] = 0;
                }
                stackObj[item.stack][inx] += elem;
                var color = item.$attr("itemStyle/normal/color") || colors[i];
                var rs = renderBar(inx, elem, stackObj[item.stack][inx], item.data.length, mainInx, subInx, stacks.length, color, barwidth);
                inx++;
                return rs;
              }));
            };
            var prepare3DBarData = function(i, item){
              var inx = 0;
              var barwidth = item.barwidth || .6
              var degree = item.degree || 8
              var filter = series.filter(function(elem){
                return elem.stack == item.stack;
              });
              var mainInx = stacks.indexOf(item.stack);
              var subInx = filter.indexOf(item);
              Array.prototype.push.apply(ser['bar'], item.data.map(function(elem){
                if(!stackObj[item.stack][inx]){
                  stackObj[item.stack][inx] = 0;
                }
                stackObj[item.stack][inx] += parseInt(elem);
                var rest = series.slice(i, -1);
                var before = i > 0 ? series.slice(0, i) : [];
                var isTop = rest.every(function(elem){
                  return elem.stack != item.stack;
                });
                var isBottom = before.every(function(elem){
                  return elem.stack != item.stack;
                });
                var cols = item.colors || [];
                var color = item.$attr("itemStyle/normal/color") || cols[inx] || colors[i];
                var rs = renderBar3D(inx, item, elem, stackObj[item.stack][inx], item.data.length, mainInx, subInx, stacks.length, color, barwidth, degree, isTop, isBottom);
                inx++;
                return rs;
              }));
            };
            var prepareLineData = function(){};
            for(var i in series){
              if(series[i].type == 'bar'){
                prepareBarData(i, series[i]);
              } else if(series[i].type == '3dbar'){
                prepare3DBarData(i, series[i]);
              } else if(series[i].type == 'line'){
                prepareLineData(i, series[i]);
              }
            }
            return ser;
          };
          var data = extentData(series);
          var renderBar = function(){
            var update = seriesDom.selectAll("rect#bar").data(data.bar);
            update.transition().duration(DURATION)
              .attr("width", function(d){
                return d.width + "px";
              }).attr("fill", function(d){
                return d.color;
              }).attr("height", function(d){
                return d.height;
              }).attr("transform", function(d){
                return "translate(" + d.x + "," + d.y + ")";
              });
            var enter = seriesDom.selectAll("rect#bar")
              .data(data.bar)
              .enter()
              .append("rect")
              .attr("id", "bar")
              .attr("width", function(d){
                return d.width + "px";
              }).attr("fill", function(d){
                return d.color;
              }).attr("height", function(d){
                return 0;
              }).attr("transform", function(d){
                return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
              });
            enter.transition().duration(DURATION)
              .attr("height", function(d){
                return d.height;
              }).attr("transform", function(d){
                return "translate(" + d.x + "," + d.y + ")";
              })
            var exit = seriesDom.selectAll("rect#bar").data(data.bar).exit();
            exit.transition().duration(DURATION)
              .attr("height", function(d){
                return 0;
              }).attr("transform", function(d){
                return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
              })
          };
          var render3DBar = function(){
            var renderInstruction = function(){
              var update = seriesDom.selectAll("text#instruction").data(data.bar);
              update.transition().duration(DURATION)
                .attr("fill", function(d){
                  return d.$attr("label/normal/color") || "#fff";
                }).attr("x", function(d){
                  return d.x + 10;
                }).attr("y", function(d){
                  return d.y - 10;
                }).style("display", function(d){
                  return d.$attr("label/normal/show") != false
                });
              var enter = seriesDom.selectAll("text#instruction")
                .data(data.bar)
                .enter()
                .append("text")
                .attr("id", "instruction")
                .attr("fill", function(d){
                  return d.$attr("label/normal/color") || "#fff";
                })
                .style("font-weight", "bold")
                .style("display", function(d){
                  return d.$attr("label/normal/show") != false ? "block" : "none";
                })
                .text(function(d){
                  return d.value;
                })
                .attr("x", function(d){
                  return d.x + 10;
                }).attr("y", function(d){
                  return _grid_.height + _grid_.top;
                });
              enter.transition().duration(DURATION)
                .attr("x", function(d){
                  return d.x + 10;
                }).attr("y", function(d){
                  return d.y - 10;
                })
              var exit = seriesDom.selectAll("text#instruction").data(data.bar).exit();
              exit.transition().duration(DURATION)
                .attr("x", function(d){
                  return d.x + 10;
                }).attr("y", function(d){
                  return _grid_.height + _grid_.top;
                });
            }
            var createShadowLeft = function(){
              var updateShadow = seriesDom.selectAll("path#threeDbarShadowLeft").data(data.bar);
              updateShadow.transition().duration(DURATION)
                .attr("d",  function(d){
                  return createShadowShapeLeft(d.width, d.stackHeight, d.degree);
                }).attr("transform", function(d){
                  return "translate(" + (d.x + d.width / 2) + "," + d.y + ")";
                })
              var enterShadow = seriesDom.selectAll("path#threeDbarShadowLeft")
                .data(data.bar)
                .enter()
                .append("path")
                .attr("id", "threeDbarShadowLeft")
                .attr("d",  function(d){
                  return createShadowShapeLeft(d.width, 0, d.degree);
                })
                .style("fill", function(d){
                  return "url(#shadowGradientLeft)";
                }).attr("opacity", function(d){
                  return 1;
                }).attr("transform", function(d){
                  return "translate(" + (d.x + d.width / 2) + "," + (d.y + d.stackHeight) + ")";
                }).style("display", function(d){
                  return d.isTop ? "display" : "none";
                });
              enterShadow.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + (d.x + d.width / 2) + "," + d.y + ")";
                })
                .attr("d",  function(d){
                  return createShadowShapeLeft(d.width,  d.stackHeight, d.degree);
                })
              var exitShadow = seriesDom.selectAll("path#threeDbarShadowLeft").data(data.bar).exit();
              exitShadow.transition().duration(DURATION);
            };
            var createShadowRight = function(){
              var updateShadow = seriesDom.selectAll("path#threeDbarShadowRight").data(data.bar);
              updateShadow.transition().duration(DURATION)
                .attr("d",  function(d){
                  return createShadowShapeRight(d.width, d.stackHeight, d.degree);
                }).attr("transform", function(d){
                  return "translate(" + (d.x + d.width / 2) + "," + d.y + ")";
                });
              var enterShadow = seriesDom.selectAll("path#threeDbarShadowRight")
                .data(data.bar)
                .enter()
                .append("path")
                .attr("id", "threeDbarShadowRight")
                .attr("d",  function(d){
                  return createShadowShapeRight(d.width, 0, d.degree);
                })
                .attr("fill", function(d){
                  return "url(#shadowGradientRight)";
                }).attr("transform", function(d){
                  return "translate(" + (d.x + d.width / 2) + "," + (d.y + d.stackHeight) + ")";
                }).style("display", function(d){
                  return d.isTop ? "display" : "none";
                });
              enterShadow.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + (d.x + d.width / 2) + "," + d.y + ")";
                })
                .attr("d",  function(d){
                  return createShadowShapeRight(d.width,  d.stackHeight, d.degree);
                })
              var exitShadow = seriesDom.selectAll("path#threeDbarShadowRight").data(data.bar).exit();
              exitShadow.transition().duration(DURATION);
            };
            var createTop = function(){
              var updateTop = seriesDom.selectAll("path#threeDbar").data(data.bar);
              updateTop.transition().duration(DURATION)
                .attr("d",  function(d){
                  return createDiamond(d.width, d.degree);
                }).attr("fill", function(d){
                  return d.color;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + d.y + ")";
                });
              var enterTop = seriesDom.selectAll("path#threeDbar")
                .data(data.bar)
                .enter()
                .append("path")
                .attr("id", "threeDbar")
                .attr("d",  function(d){
                  return createDiamond(d.width, d.degree);
                })
                .attr("fill", function(d){
                  return d.color;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                }).style("display", function(d){
                  return d.isTop ? "display" : "none";
                });
              enterTop.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + d.x + "," + d.y + ")";
                })
              var exitTop = seriesDom.selectAll("path#threeDbar").data(data.bar).exit();
              exitTop.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                })
            };
            var createBottom = function(){
              var updateBottom = seriesDom.selectAll("path#threeDbarTop").data(data.bar);
              updateBottom.transition().duration(DURATION)
                .attr("d",  function(d){
                  return createDiamond(d.width, d.degree);
                }).attr("fill", function(d){
                  return d.color;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + (d.y + d.height) + ")";
                });
              var enterBottom = seriesDom.selectAll("path#threeDbarTop")
                .data(data.bar)
                .enter()
                .append("path")
                .attr("id", "threeDbarTop")
                .attr("d",  function(d){
                  return createDiamond(d.width, d.degree);
                })
                .attr("fill", function(d){
                  return d.color;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                });
              enterBottom.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + d.x + "," + (d.y + d.height) + ")";
                })
              var exitBottom = seriesDom.selectAll("path#threeDbarTop").data(data.bar).exit();
              exitBottom.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                })
            };
            var createBottomContain = function(){
              var updateBottom = seriesDom.selectAll("path#threeDbarBC").data(data.bar);
              updateBottom.transition().duration(DURATION)
                .attr("d",  function(d){
                  return createDiamond(d.width * 1.4, d.degree);
                }).attr("transform", function(d){
                  return "translate(" + (d.x - d.width * .2) + "," + (d.y + d.height) + ")";
                });
              var enterBottom = seriesDom.selectAll("path#threeDbarBC")
                .data(data.bar)
                .enter()
                .append("path")
                .attr("id", "threeDbarBC")
                .attr("d",  function(d){
                  return createDiamond(d.width * 1.4, d.degree);
                })
                .style("display", function(d){
                  return d.isBottom ? "display" : "none";
                })
                .attr("fill", function(d){
                  return "url(#container)";
                }).attr("transform", function(d){
                  return "translate(" + (d.x - d.width * .2) + "," + (_grid_.height + _grid_.top) + ")";
                });
              enterBottom.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + (d.x - d.width * .2) + "," + (d.y + d.height) + ")";
                })
              var exitBottom = seriesDom.selectAll("path#threeDbarBC").data(data.bar).exit();
              exitBottom.transition().duration(DURATION)
                .attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                })
            };
            var createBody = function(){
              var updateBody = seriesDom.selectAll("rect#threeDbarBottom").data(data.bar);
              updateBody.transition().duration(DURATION)
                .attr("width", function(d){
                  return d.width + "px";
                }).attr("fill", function(d){
                  return d.color;
                }).attr("height", function(d){
                  return d.height;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + d.y + ")";
                });
              var enterBody = seriesDom.selectAll("rect#threeDbarBottom")
                .data(data.bar)
                .enter()
                .append("rect")
                .attr("id", "threeDbarBottom")
                .attr("width", function(d){
                  return d.width + "px";
                }).attr("fill", function(d){
                  return d.color;
                }).attr("height", function(d){
                  return 0;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                });
              enterBody.transition().duration(DURATION)
                .attr("height", function(d){
                  return d.height;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + d.y + ")";
                })
              var exitBody = seriesDom.selectAll("rect#threeDbarBottom").data(data.bar).exit();
              exitBody.transition().duration(DURATION)
                .attr("height", function(d){
                  return 0;
                }).attr("transform", function(d){
                  return "translate(" + d.x + "," + (_grid_.height + _grid_.top) + ")";
                })
            };
            createBottomContain();
            createBody();
            createBottom();
            createShadowRight();
            createShadowLeft();
            createTop();
            renderInstruction();
          };
          if(types.indexOf("bar") != -1){
            renderBar();
          } else if(types.indexOf("3dbar") != -1){
            render3DBar();
          };
        };
        createAxis();
        createSeries(options.series);
      };
      var refresh = function(){

      };
      var setGrid = function(gd){
        var grid = ({
          top : "10%",
          left : "10%",
          width : "80%",
          height : "80%"
        }).$extension(gd);
        var t = calculate(height, grid.top);
        var w = calculate(width, grid.width);
        var h = calculate(height, grid.height);
        var l = calculate(width, grid.left);
        _grid_ = {
          top : t,
          width : w,
          height : h,
          left : l
        }
      };
      var svgchart = function(dom, options){
        setTimeout(function(){
          setSize();
          if(options) {
            setGrid(options.grid);
            setOption(options);
          };
        });
      };
      svgchart.prototype.setOption = setOption;
      svgchart.prototype.refresh = refresh;
      AxisDom.attr("id", "axis");
      seriesDom.attr("id", "series");
      $(window).on("resize", resize);
      creatGradient('shadowGradientLeft', {
        color1 : "rgba(0,0,0,.1)",
        color2 : "rgba(0,0,0,0)",
        x1 : "0%",
        y1 : "0%",
        x2 : "0%",
        y2 : "1000%",
      });
      creatGradient('shadowGradientRight', {
        color1 : "rgba(0,0,0,.5)",
        color2 : "rgba(0,0,0,.3)"
      });
      creatGradient('container', {
        color1 : "#aaa",
        color2 : "#ddd"
      });
      creatGradient('base', {
        color1 : "rgba(250,250,250,0)",
        color2 : "rgba(250,250,250,.5)",
        x1 : "0%",
        y1 : "0%",
        x2 : "0%",
        y2 : "100%",
      });
      return new svgchart(dom, _options_);
    }
  };
}

