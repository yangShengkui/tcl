/**
 * Created by leonlin on 16/11/3.
 */
define(['d3'], function(d3){
  return {
    init : function(tg, option){
      var svg = d3.selectAll("#" + tg);
      var viewport = svg.selectAll(".viewport")
      var wrap = viewport.append("g");
      var option = option || {};
      var inner = wrap.append("g");
      var bg = inner.append("path");
      var val = inner.append("path");
      var createArc = function(innerRadius, outerRadius, startAngle, endAngle){
        var arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle);
        return arc();
      };
      function openAngle(){
        inner.attr("transform", "translate(-" + (option.radius || 50) / 2 + "," + (option.radius || 50) / 2 + ")");
        bg.attr("stroke", "#fff");
        bg.attr("stroke-width", 2);
        bg.attr("d", createArc(0, (option.radius || 50), 0, Math.PI / 2));
        val.style("fill", "#0ecf9b");
        val.attr("d", createArc(0, (option.radius || 50) - 1,  Math.PI / 2, Math.PI / 2));
      };
      openAngle.prototype.setPos = function(pos){
        wrap.attr("transform", "translate(" + pos.x + "," + pos.y + ")");
      };
      openAngle.prototype.setValue = function(value){
        //value / 100
        val.attr("d", createArc(0, (option.radius || 50) - 1,  Math.PI / 2 * ( 1 - value / 100), Math.PI / 2));
      };
      return new openAngle(tg);
    }
  }
});
