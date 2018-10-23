/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data, tools, callback) {
    var nodesDes = tools.nodesDes;
    var kpisDes = tools.kpisDes;
    var q = tools.q;
    var service = {}
    service.resourceUIService = tools.resourceUIService;
    var start = function(){
      var map = new BMap.Map("container");
      var localSearch = new BMap.LocalSearch(map);
      var instances = data.reduce(function(a, b){
        if(a.indexOf(b.instance) == -1){
          a.push(b.instance);
        };
        return a;
      },[]);
      var regroup = function(ci, kpi, callback) {
        var defers = [];
        var dfs = []
        var rs = [];
        var loop = function(ci){
          var rs = {
            ci : ci,
            children : []
          };
          var loop = function(kpi){
            var findValue = function(ci, kpi, instance, target, df) {
              var a = {};
              var defer = q.defer();
              var find = data.find(function(elem){
                return elem.kpiCode == kpi.id && elem.nodeId == ci.id && elem.instance == instance;
              });
              defer.id = instance;
              defer.find = find;
              a.id = instance;
              df.id = instance;
              if(find){
                localSearch.search(find.instance);
                (function(defer,a){
                  var callback = function(searchResult){
                    /** 这样的写法是因为百度地图的回调函数回破坏闭包结构， 但还没发现原因 */
                    var keyword = searchResult.keyword;
                    var df = dfs.find(function(elem){
                      return elem.id == keyword;
                    });
                    var point = searchResult.vr[0].point;
                    var tg = rs.children.find(function(elem) {
                      return elem.instance == keyword;
                    })
                    tg.value = [point.lng, point.lat, df.find.value];
                    df.resolve("success");
                  };
                  localSearch.setSearchCompleteCallback(callback);
                })(defer, a);
              } else {
                target.value = "-";
                defer.resolve("success");
              };
              dfs.push(defer);
              defer.promise.id = instance;
              return defer.promise;
            };
            var loop = function(instance){
              var defer = q.defer();
              var obj = {
                kpi : kpi,
                instance : instance
              };
              defers.push(findValue(ci, kpi, instance, obj, defer));
              rs.children.push(obj);
            };
            for(var i in instances){
              loop(instances[i]);
            }
          };
          for(var i in kpi) {
            loop(kpi[i]);
          }
          return rs;
        };
        for(var i in ci) {
          rs.push(loop(ci[i]))
        }
        q.all(defers).then(function(){
          callback(rs);
        })
      };
      regroup(nodesDes, kpisDes, function(gp){
        var group = gp;
        var getSeries = function(formatter){
          var rs = [];
          var loop = function(gr){
            var rs = {
              name : gr.ci.label,
              data : []
            };
            var loop = function(item){
              var name = item.instance;
              return {
                name : name,
                value: item.value
              }
            };
            for(var i in gr.children){
              rs.data.push(loop(gr.children[i]));
            }
            return rs;
          };
          for(var i in group){
            rs.push(loop(group[i]))
          }
          return rs;
        };
        var getLegend = function(formatter) {
          var rs = [];
          var loop = function(gr){
            var loop = function(item){
              var name;
              if(typeof formatter == "function"){
                name = formatter({
                  ci : gr.ci.label,
                  kpi : item.kpi.label,
                  value : item.value
                })
              } else {
                name = gr.ci.label + "-" + item.kpi.label;
              }
              return name;
            };
            for(var i in gr.children){
              rs.push(loop(gr.children[i]));
            }
          };
          for(var i in group){
            loop(group[i]);
          }
          return rs;
        };
        var rs = {
          getSeries : getSeries,
          getLegend : getLegend,
          data : {
            nodes : nodesDes,
            kpis : kpisDes,
            legend : getLegend(),
            series : getSeries()
          }
        };
        callback(rs);
      });
    };
    require(['baiduMap', 'bmap'], function(a, b){
      var count = 0;
      wait();
      function wait() {
        if(count < 20) {
          count += 1;
          setTimeout(function(){
            if(window.BMap == undefined) {
              wait();
            } else {
              start();
            }
          });
        } else {
          throw new Error('百度视图获取失败!!')
        }
      }
    }, function error(){
      console.log('百度地图加载失败!');
      start();
    });
  }
});
