define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.controller('oilViewCtrl', bridgeViewCtrl);
  bridgeViewCtrl.$inject = ["$scope", "$timeout", "$location"];
  function bridgeViewCtrl(scope, timeout, location) {
    scope.bridgeBarOption = {
      xAxis: {
        type : "category",
        max : 21,
        min : 11,
        data : ['10:52:09', '10:58:09', '11:04:09']
      },
      series: [{
        type : "bar",
        group : [{
          color: ["#754d3c"],
          borderColor: ["#ed8d4f"],
          data: [75, 85, 61]
        }]
      },{
        type : "bar",
        group : [{
          color: ["#1566a1"],
          borderColor: ["#29a2eb"],
          data: [50, 25, 15]
        }]
      }]
    };
    scope.chartClick = function()
    {
      location.path("oil/detail");
    };
    scope.listClick = function()
    {
      location.path("oil/warning");
    };
    var changeValue = function(target)
    {
      timeout(function(){
        target.value = parseInt(Math.random() * 100);
        changeValue(target);
      }, 4000);
    };
    scope.indexList = [{
      label : "混凝土表面应变",
      value : 26.34
    },{
      label : "桥梁固有频率",
      value : 60,
      unit : "%"
    },{
      label : "桥梁振动大小",
      value : 89.44
    },{
      label : "拉索预应力",
      value : 65.33
    },{
      label : "吊杆预应力",
      value : 68.23
    },{
      label : "索力",
      value : 25.65
    },{
      label : "裂缝",
      value : 30,
      unit : "MM"
    },{
      label : "斜度",
      value : 30,
      alert : true
    },{
      label : "挠度",
      value : 87
    },{
      label : "相对变形",
      value : 10,
      unit : "%"
    }]
    for(var i in scope.indexList)
    {
      changeValue(scope.indexList[i]);
    }
    scope.bridgeWarning = [{
      label : "什么什么告警提示",
      level : 1
    },{
      label : "什么什么告警提示",
      level : 4
    },{
      label : "什么什么告警提示",
      level : 2
    },{
      label : "什么什么告警提示",
      level : 0
    },{
      label : "什么什么告警提示",
      level : 0
    },{
      label : "什么什么告警提示",
      level : 0
    },{
      label : "什么什么告警提示",
      level : 0
    },{
      label : "什么什么告警提示",
      level : 3
    },{
      label : "什么什么告警提示",
      level : 0
    },{
      label : "什么什么告警提示",
      level : 0
    }]
    scope.bridgeChart1 = {
      xAxis: {
        type : "category",
        data : [11,12,13,14,15,16,17,18,19,20,21]
      },
      series: [{
        type : "bar",
        group : [{
          color: ["#003f75"],
          borderColor: ["#29a2eb"],
          data: [43, 40, 22, 38, 24, 62, 23, 31, 60, 57, 43]
        },{
          color: ["#1571b0"],
          borderColor: ["#29a2eb"],
          data: [42, 41, 32,25,14,8,43,10,36,18,22]
        }]
      }]
    };
    scope.bridgeChart2 = {
      xAxis: {
        type : "category",
        data : [11,12,13,14,15,16,17,18,19,20,21]
      },
      yAxis: {
        type : "value",
        max : 70,
        min : 0,
        split : 3,
      },
      series: [{
        type : "line",
        group : [{
          color: ["#003f75"],
          borderColor: ["#29a2eb"],
          data: [14, 31, 20, 36, 41, 58, 46]
        }]
      }]
    };
    scope.bridgeChart3 = {
      yAxis: {
        type : "category",
        data : [0, 20, 40, 60, 80]
      },
      xAxis: {
        type : "value",
        max : 21,
        min : 11
      },
      series: [{
        type : "bar",
        group : [{
          color: ["#155a90", "#02347a"],
          borderColor: ["#29a2eb", "045fd4"],
          data: [19.5, 20.7, 20.5, 20.2, 20.6]
        }]
      }]
    };
    scope.bridgeChart4 = {
      yAxis: {
        type : "category",
        data : [0, 20, 40, 60, 80]
      },
      xAxis: {
        type : "value",
        max : 19,
        min : 11
      },
      series: [{
        type : "bar",
        group : [{
          color: ["#155a90", "#02347a"],
          borderColor: ["#29a2eb", "045fd4"],
          data: [19.2, 18.7, 19.1, 18.2, 18.6]
        }]
      }]
    };
    scope.bridgeChart5 = {
      yAxis: {
        type : "category",
        data : [0, 20, 40, 60, 80]
      },
      xAxis: {
        type : "value",
        max : 21,
        min : 11
      },
      series: [{
        type : "bar",
        group : [{
          color: ["#155a90", "#02347a"],
          borderColor: ["#29a2eb", "045fd4"],
          data: [14.6, 17, 17.8, 18.9, 16.6]
        }]
      }]
    };
    scope.imgMode = true;
    scope.switchBtn = function()
    {
      scope.imgMode = !scope.imgMode;
    }
  }
});