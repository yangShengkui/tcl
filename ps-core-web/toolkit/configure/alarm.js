/**
 * Created by leonlin on 16/11/3.
 */
define(['d3'], function(d3){
  return {
    init : function(tg, option){
      var smallMode = option.smallMode;
      var WIDTH = 30;
      var HEIGHT = 30;
      //var AlARMPOINT = WIDTH / 3.2;
        var AlARMPOINT = WIDTH / 4.2;
      var color = "#2d8ee5";
      var alarmColor = "#00e55d";
      var title = option.title;
      var svg = d3.selectAll("#" + tg);
      var viewport = svg.selectAll(".viewport");
      var wholewrap = viewport.append("g")
      var wrap = wholewrap.append("g");
      var rect = wrap.append("rect");
      var alarmWrapShadow = wrap.append("circle");
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
        var r = config.r * 0.5;
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
        if(smallMode){
          setAttr.call(text, {
            transform : "translate(" + WIDTH *.6 + ", 0)"
          });
        } else {
          setAttr.call(text, {
            transform : "translate(0, -" + (HEIGHT *.7) + ")"
          });
        }


        setStyle.call(text, {
          "text-anchor" : smallMode ? "left" : "middle",
          fill : "#fff",
          "font-size" : smallMode ? "10px" : "12px",
          "font-weight" : "bold",
          "text-shadow" : "1px 1px 3px rgba(0,0,0,.8)"
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
          cx : 0,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT * 1.2
        });
        setStyle.call(alarmWrap, {
          fill : "url(#wrapShadow)"
        });
        setAttr.call(alarmWrapShadow, {
          cx : 0,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT * 3
        });
        setStyle.call(alarmWrapShadow, {
          fill : "url(#alarmWrapShadow)"
        });
        setAttr.call(alarm, {
          cx : 0,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT
        });
        setStyle.call(alarm, {
          fill : alarmColor
        });
        setAttr.call(alarmShadow, {
          cx : 0,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT
        });
        setAttr.call(hitarea, {
          width : WIDTH,
          height : HEIGHT,
          transform : "translate(-" + WIDTH / 2 + ",-" + HEIGHT / 2 + ")"
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
          cx : 0,
          cy : AlARMPOINT * .3,
          r : AlARMPOINT *.8
        });
        setStyle.call(alarmHighlight, {
          fill : "url(#alarmHighlight)"
        });

        text.on("click", function(event){
          if(events["textClick"]){
            events["textClick"](event);
          };
        })
        hitarea.on("click", function(event){
          if(events["click"]){
            events["click"](event);
          };
        })
        hitarea.on("mouseover", function(event){
          if(events["mouseover"]){
            events["mouseover"](event);
          };
        })
      };
      threeDbar.prototype.setPos = function(pos){
        wholewrap.attr("transform", "translate(" + pos.x + "," + pos.y + ")");
      };
      threeDbar.prototype.on = function(eventName, handler){
        events[eventName] = handler;
      };
      threeDbar.prototype.setAlarmStatus = function(status){
        var color = ""
        var color3D = "";
        switch (status) {
          case 4 :
            color = "#e74e53";
            color3D = "rgba(72,13,8,.7)";
            break;
          case 3 :
            color = "#ee6b1c";
            color3D = "rgba(72,13,8,.7)";
            break;
          case 2 :
            color = "#ece417";
            color3D = "rgba(94,86,6,.7)";
            break;
          case 1 :
            color = "#00bc79";
            color3D = "rgba(11,86,64,.7)";
            break;
          default :
            color = "#00bc79";
            color3D = "rgba(11,86,64,.7)";
            break;
        }
        setStyle.call(alarm, {
          fill : color
        });
      };
      return new threeDbar(tg);
    }
  }
});
