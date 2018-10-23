define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.controller('appOilCtrl', appBridgeCtrl);
  appBridgeCtrl.$inject = ["$scope", "$timeout"];
  function appBridgeCtrl(scope, timeout){
    var arr = [];
    var setItem = function(index){
      var valueChange = function(){
        clone.value = parseInt(Math.random() * 100);
        timeout(valueChange, 3000);
      }
      var clone = {};
      clone.label = "指标名称" + index;
      clone.value = parseInt(Math.random() * 100);
      timeout(valueChange, 3000);
      return clone;
    };
    for(var i=0; i<9; i++)
    {
      arr.push(setItem(i))
    }
    scope.gaugesLeft = arr.slice(0,4);
    scope.gaugesRight = arr.slice(5, 9);
    scope.itemStyle = function(index, alert)
    {
      if(alert == true)
      {
        return {"background-color" : "#ff0000"}
      }
      else if(index % 4 == 0)
      {
        return {"background-color" : "#2469ce"}
      }
      else if(index % 4 == 1)
      {
        return {"background-color" : "#235093"}
      }
      else if(index % 4 == 2)
      {
        return {"background-color" : "#173f79"}
      }
      else if(index % 4 == 3)
      {
        return {"background-color" : "#123569"}
      }
    }
  }
});