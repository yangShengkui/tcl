define(['controllers/controllers', 'Array'], function(controllers) {
  'use strict';
  controllers.controller('oilDetailCtrl', bridgeDetailCtrl);
  bridgeDetailCtrl.$inject = ["$scope", "$timeout", "$location"];
  function bridgeDetailCtrl(scope, timeout, location) {
    scope.backBtnClick = function(){
      location.path("bridge");
    }
    scope.mapChart = {
      bmap: {
        center: [121.114129, 31.550339],
        zoom: 11,
        roam: true,
        mapStyle: {
          "styleJson" : [
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": {
                "color": "#021019"
              }
            },
            {
              "featureType": "highway",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#00214f"
              }
            },
            {
              "featureType": "highway",
              "elementType": "geometry.stroke",
              "stylers": {
                "color": "#24547f"
              }
            },
            {
              "featureType": "arterial",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#0b5394"
              }
            },
            {
              "featureType": "arterial",
              "elementType": "geometry.stroke",
              "stylers": {
                "color": "#0c343d"
              }
            },
            {
              "featureType": "local",
              "elementType": "geometry",
              "stylers": {
                "color": "#0b5394"
              }
            },
            {
              "featureType": "land",
              "elementType": "all",
              "stylers": {
                "color": "#061e44"
              }
            },
            {
              "featureType": "railway",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#000000"
              }
            },
            {
              "featureType": "railway",
              "elementType": "geometry.stroke",
              "stylers": {
                "color": "#08304b"
              }
            },
            {
              "featureType": "subway",
              "elementType": "geometry",
              "stylers": {
                "lightness": -70
              }
            },
            {
              "featureType": "building",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#073763"
              }
            },
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": {
                "color": "#857f7f"
              }
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": {
                "color": "#000000"
              }
            },
            {
              "featureType": "building",
              "elementType": "geometry",
              "stylers": {
                "color": "#022338"
              }
            },
            {
              "featureType": "green",
              "elementType": "geometry",
              "stylers": {
                "color": "#062032"
              }
            },
            {
              "featureType": "boundary",
              "elementType": "all",
              "stylers": {
                "color": "#1e1c1c"
              }
            },
            {
              "featureType": "manmade",
              "elementType": "all",
              "stylers": {
                "color": "#022338"
              }
            },
            {
              "featureType": "all",
              "elementType": "labels",
              "stylers": {}
            },
            {
              "featureType": "road",
              "elementType": "labels",
              "stylers": {
                "visibility": "off"
              }
            }
          ]
        }
      }
    };
    scope.bridgeChartUp2 = {
      grid : {
        left : "15%",
        width : "80%",
      },
      xAxis: {
        type : "value",
        max : 100,
        min : 0
      },
      yAxis: {
        type : "category",
        data : ['10:58:04', '10:58:44', '10:59:24', '11:00:04']
      },
      area :[{
        color : "#112b47",
        position : "100%"
      },{
        color : "#224564",
        position : "86%"
      },{
        color : "#3c6482",
        position : "55%"
      }],
      series: [{
        type : "bar",
        group : [{
          color: ["#b1951a"],
          borderColor: ["#ebe029"],
          data: [88, 52, 73, 78],
          width : "20%"
        }]
      }]
    };
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
  }
});