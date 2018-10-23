/**
 * Created by leonlin on 16/11/3.
 */
define(["simulate"], function(simulate){
  return function(data, tools, callback) {
    var Info = tools.Info;
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var instances = data.reduce(function(a,b){
      if(a.indexOf(b.instance) == -1){
        a.push(b.instance);
      }
      return a;
    },[]);
    var simulateFn = tools.simulate;
    var getInfo_back = function(){
      var result = [];
      /** var data = simulate("ci", nodesDes, kpisDes, instance, simulateFn)*/;
      var getLegend = function(formatter){
        return instances;
      };
      var getSeries = function(){
        var rs = result.map(function(item){
          var clone = item.$clone();
          clone.name = clone.name.ci;
          clone.data = clone.value.map(function(itm){
            return {
              "name" : itm.insName,
              "value" : itm.value
            };
          });
          return clone;
        });
        var innerElem = rs[rs.length - 1].$clone();
        var dt = innerElem.data;
        innerElem.name = "行业";
        innerElem.data = dt.slice(0,5);
        rs[rs.length - 1].data = dt.slice(6);
        var lastElem = rs[rs.length - 1].$clone();
        lastElem.name = "top10";
        var dt = lastElem.data;
        dt.sort(function(a, b){
          return b.value - a.value ;
        });
        dt = dt.slice(10);
        var inx = 1;
        dt = dt.map(function(elem){
          var clone = elem.$clone();
          clone.name = "top" + inx;
          inx++;
          return clone;
        });
        lastElem.data = dt;
        rs.push(innerElem);
        rs.push(lastElem);
        return rs;
      };
      var loopNodeDes = function(node){
        var loopKpisDes = function(kpi){
          var vlist = [];
          var loop = function(instance){
            var find = data.find(function(el){
              return instance == el.instance && el.kpiCode == kpi.id && el.nodeId == node.id;
            });
            if(find){
              find.insName = instance;
              vlist.push(find);
            }
          }
          for(var i in instances){
            loop(instances[i]);
          }
          var obj = {
            name :{
              ci : node.label,
              kpi : kpi.label
            },
            value : vlist
          };
          result.push(obj);
        };
        for(var i in kpisDes){
          loopKpisDes(kpisDes[i])
        }
      };
      for(var i in nodesDes){
        loopNodeDes(nodesDes[i])
      };
      callback({
        getLegend : getLegend,
        getSeries : getSeries
      });
    };
    Info.get("../localdb/simulate.json", getInfo_back);
  }
});
