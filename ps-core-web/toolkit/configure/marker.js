/**
 * Created by leonlin on 16/11/3.
 */
define(['d3'], function(d3){
  return {
    init : function(tg, option){
      var svg = d3.selectAll("#" + tg);
      var defs = svg.select("defs");
      var title = option.title;
      var viewport = svg.selectAll(".viewport")
      var wrap = viewport.append("g");
      var path = wrap.append("path");
      var pathShadow = wrap.append("path");
      var insturctionWrap = wrap.append("path");
      var text = wrap.append("text");
      var hitArea = wrap.append("rect");
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
      function marker(){
        creatGradient("markerGradient", {
          type : "radialGradient",
          color1 : "rgba(0,0,0,0)",
          color2 : "rgba(0,0,0,.7)",
          x1 : "50%",
          x2 : "0%",
          r : "100%",
          fx : "50%",
          fy : "100%"
        });
        path.attr("d", "M99.8,0C59.4,0,26.7,33.5,26.7,74.8c0,41.3,73.2,124.7,73.2,124.7S173,116.2,173,74.8C173,33.5,140.2,0,99.8,0z M99.8,106c-20.2,0-36.6-16.7-36.6-37.4c0-20.7,16.4-37.4,36.6-37.4s36.6,16.8,36.6,37.4C136.4,89.3,120,106,99.8,106z")
        path.attr("transform", "scale(.2.2)");
        path.attr("stroke-width", "10px");
        path.attr("stroke", "#fff");
        pathShadow.attr("d", "M99.8,0C59.4,0,26.7,33.5,26.7,74.8c0,41.3,73.2,124.7,73.2,124.7S173,116.2,173,74.8C173,33.5,140.2,0,99.8,0z M99.8,106c-20.2,0-36.6-16.7-36.6-37.4c0-20.7,16.4-37.4,36.6-37.4s36.6,16.8,36.6,37.4C136.4,89.3,120,106,99.8,106z")
        pathShadow.attr("transform", "scale(.2.2)");
        pathShadow.attr("stroke-width", "10px");
        pathShadow.attr("fill", "url(#markerGradient)");
        insturctionWrap.attr("d", "M0,0L100,0L100,30L60,30L50,40L40,30L0,30L0,0");
        insturctionWrap.attr("transform", "translate(-30, -45)");
        insturctionWrap.style("fill", "rgba(8,24,97,.7)");
        insturctionWrap.attr("stroke-width", "2px");
        insturctionWrap.attr("stroke", "#fff");
        text.attr("transform", "translate(20, -26)");
        text.attr("font-weight", "bold");
        text.text(title);
        text.style("fill","#fff");
        text.attr("text-anchor", "middle");
        hitArea.attr("width", "100px");
        hitArea.attr("height", "100px");
        hitArea.attr("opacity",0);
        hitArea.attr("transform", "translate(-30, -50)");
        hitArea.style("cursor", "pointer");
        hitArea.on("click", function(event){
          if(events['click']){
            events['click'](event);
          }
        })
      };
      marker.prototype.setAlarmStatus = function(status){
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
        path.attr("fill", color);
        insturctionWrap.style("fill", color3D);
      };
      marker.prototype.on = function(eventName, callback){
        events[eventName] = callback;
      };
      marker.prototype.setPos = function(pos){
        wrap.attr("transform", "translate(" + pos.x + "," + pos.y + ")");
      };
      return new marker(tg);
    }
  }
});
