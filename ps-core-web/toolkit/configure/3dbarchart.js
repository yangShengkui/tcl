/**
 * Created by leonlin on 16/11/3.
 */
define(['d3'], function(d3){
  return {
    init : function(tg, option){
      var WIDTH = 40;
      var HEIGHT = 150;
      var AlARMPOINT = WIDTH / 3.2;
      var color = "#2d8ee5";
      var alarmColor = "#00e55d";
      var title = option.title;
      var svg = d3.selectAll("#" + tg);
      var viewport = svg.selectAll(".viewport");
      var wholewrap = viewport.append("g")
      var wrap = wholewrap.append("g");
      var bottomWrap = wrap.append("ellipse");
      var bottom = wrap.append("ellipse");
      var rect = wrap.append("rect");
      var innerBottom = wrap.append("ellipse");
      var innerRect = wrap.append("rect");
      var innerShadow = wrap.append("rect");
      var innerTop = wrap.append("ellipse");
      var highlight = wrap.append("rect");
      var alarmWrapShadow = wrap.append("circle");
      var top = wrap.append("ellipse");
      var defs = svg.select("defs");
      var alarmWrap = wrap.append("circle");
      var alarm = wrap.append("circle");
      var alarmShadow = wrap.append("circle");
      var alarmHighlight = wrap.append("circle");
      var text = wholewrap.append("text");
      var hitarea = wholewrap.append("rect");
      var events = {};
      var creatGradient = function(id, config){
        var id = id;
        var color1 = config.color1 || "#000";
        var color2 = config.color2 || "#fff";
        var type = config.type || "linearGradient"
        var x1 = config.x1 || "0%";
        var y1 = config.y1 || "0%";
        var x2 = config.x2 || "100%";
        var y2 = config.y2 || "0%";
        var r = config.r;
        var fx = config.fx;
        var fy = config.fy;
        var offset1 = config.offset1 || "0%";
        var offset2 = config.offset2 || "100%";
        var linearGradient = defs.append(type)
          .attr("id", id)
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("r", r)
          .attr("fx", fx)
          .attr("fy", fy);
        var stop1 = linearGradient.append("stop")
          .attr("offset",offset1)
          .style("stop-color", color1);
        var stop2 = linearGradient.append("stop")
          .attr("offset",offset2)
          .style("stop-color", color2);
      };
      var setAttr = function(config){
        var cur = this;
        for(var i in config){
          cur.attr(i, config[i]);
        }
      };
      var setStyle = function(config){
        var cur = this;
        for(var i in config){
          cur.style(i, config[i]);
        }
      };
      function threeDbar(){
        wrap.attr("transform", "scale(1,-1)");
        text.text(title);
        setAttr.call(text, {
          transform : "translate(0, " + (HEIGHT / 5) + ")"
        });
        setStyle.call(text, {
          fill : "#f1d516",
          "font-size" : "14px",
          "font-weight" : "bold"
        });
        creatGradient("innerShadow", {
          color1 : "rgba(0,0,0,.2)",
          color2 : "rgba(0,0,0,0)",
          x1 : "0%",
          x2 : "0%",
          y1 : "100%"
        });
        creatGradient("wrapShadow", {
          color1 : "#999",
          color2 : "#ccc",
          x1 : "0%",
          x2 : "0%",
          y1 : "100%"
        });
        creatGradient("alarmShadow", {
          type : "radialGradient",
          color1 : "rgba(0,0,0,0)",
          color2 : "rgba(0,0,0,.3)",
          x1 : "0%",
          x2 : "0%",
          r : "50%",
          fx : "50%",
          fy : "50%"
        });
        creatGradient("alarmWrapShadow", {
          type : "radialGradient",
          color1 : "rgba(0,0,0,.3)",
          color2 : "rgba(0,0,0,0)",
          x1 : "0%",
          x2 : "0%",
          r : "50%",
          fx : "50%",
          fy : "50%"
        });
        creatGradient("highlight", {
          color1 : "rgba(250,250,250,1)",
          color2 : "rgba(250,250,250,0)",
          x1 : "0%",
          x2 : "0%",
          y1 : "100%"
        });
        creatGradient("alarmHighlight", {
          color1 : "rgba(250,250,250,1)",
          color2 : "rgba(250,250,250,0)",
          x1 : "0%",
          y1 : "100%",
          x2 : "0%",
          y2 : "0%",
          offset2 : "50%"
        });
        setAttr.call(alarmWrap, {
          cx : WIDTH / 2,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT * 1.2
        });
        setStyle.call(alarmWrap, {
          fill : "url(#wrapShadow)"
        });
        setAttr.call(alarmWrapShadow, {
          cx : WIDTH / 2,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT * 3
        });
        setStyle.call(alarmWrapShadow, {
          fill : "url(#alarmWrapShadow)"
        });
        setAttr.call(alarm, {
          cx : WIDTH / 2,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT
        });
        setStyle.call(alarm, {
          fill : alarmColor
        });
        setAttr.call(alarmShadow, {
          cx : WIDTH / 2,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT
        });
        setAttr.call(hitarea, {
          width : WIDTH,
          height : HEIGHT,
          transform : "translate(0,-" + HEIGHT + ")"
        });
        setStyle.call(hitarea, {
          fill : "blue",
          opacity :0,
          cursor : "pointer"
        });
        setStyle.call(alarmShadow, {
          fill : "url(#alarmShadow)"
        })
        setAttr.call(alarmHighlight, {
          cx : WIDTH / 2,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT *.8
        });
        setStyle.call(alarmHighlight, {
          fill : "url(#alarmHighlight)"
        })
        setAttr.call(rect, {
          width : WIDTH,
          height : HEIGHT
        });
        setStyle.call(rect, {
          fill : "#fff",
          opacity :.3
        })
        setAttr.call(highlight, {
          transform : "translate(" + WIDTH / 10 + "," + HEIGHT *.3 + ")",
          width : WIDTH /5,
          height : HEIGHT *.7
        });
        setStyle.call(highlight, {
          fill : "url(#highlight)"
        })
        setAttr.call(innerRect, {
          width : WIDTH,
          height : 0
        })
        setAttr.call(innerShadow, {
          width : WIDTH,
          height : 0
        });
        innerRect.style("fill", color);
        innerShadow.style("fill", "url(#innerShadow)");
        setAttr.call(top, {
          cx: WIDTH / 2,
          cy: HEIGHT,
          rx : WIDTH / 2,
          ry : WIDTH / 6
        });
        setStyle.call(top, {
          fill : "url(#wrapShadow)",
          opacity : 1
        });
        setAttr.call(innerTop, {
          cx: WIDTH / 2,
          cy: 0,
          rx : WIDTH / 2,
          ry : WIDTH / 6
        });
        innerTop.style("fill", color);
        setAttr.call(innerBottom, {
          cx: WIDTH / 2,
          cy: 0,
          rx : WIDTH / 2,
          ry : WIDTH / 6
        });
        innerBottom.style("fill", color);
        setAttr.call(bottomWrap, {
          cx: WIDTH / 2,
          cy: 0,
          rx : WIDTH / 2 * 1.4,
          ry : WIDTH / 6 * 1.4
        });
        bottomWrap.style("fill", "url(#wrapShadow)");
        hitarea.on("click", function(event){
          if(events["click"]){
            events["click"](event);
          };
        })
      };
      threeDbar.prototype.setColor = function(clr){
        color = clr;
        innerRect.style("fill", color);
        innerTop.style("fill", color);
        innerBottom.style("fill", color);
      };
      threeDbar.prototype.setPos = function(pos){
        wholewrap.attr("transform", "translate(" + pos.x + "," + pos.y + ")");
      };
      threeDbar.prototype.setValue = function(value){
        var DURATION = 1000;
        var height = HEIGHT * value / 100;
        innerTop.transition().duration(DURATION).attr("cy", height);
        innerRect.transition().duration(DURATION).attr("height", height);
        innerShadow.transition().duration(DURATION).attr("height", height);
        //value / 100
        //val.attr("d", createArc(0, (option.radius || 50) - 1,  Math.PI / 2 * ( 1 - value / 100), Math.PI / 2));
      };
      threeDbar.prototype.on = function(eventName, handler){
        events[eventName] = handler;
      };
      threeDbar.prototype.setAlarmStatus = function(status){
        var color = "";
        switch (status) {
          case 4 :
            color = "#e74e53";
            break;
          case 3 :
            color = "#ee6b1c";
            break;
          case 2 :
            color = "#ece417";
            break;
          case 1 :
            color = "#00bc79";
            break;
          default :
            color = "#00bc79";
            break;
        }
        setStyle.call(alarm, {
          fill : color
        })
      };
      return new threeDbar(tg);
    }
  }
});
