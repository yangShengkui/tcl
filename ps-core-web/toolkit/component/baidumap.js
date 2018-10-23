/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var previewMode = data.previewMode;
    var global = data.global;
    var timeout = data.timeout;
    var wrap = $("<div></div>");
    var mapDom = $("<div></div>");
    if(element.style) {
      mapDom.css(element.style);
    };
    mapDom.attr("id", "baidumap");
    mapDom.attr("class", "baidu-maps");
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        if(typeof fnResult == 'function') {
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        expression = {};
        //throw new Error(funRes.message);
      }
    });
    element.setSelfDom(wrap);
    var mapStyle = element.runExpression(element.$attr("parameters/mapStyle"));
    var clickFn = expression.$attr("on/click");
    var convertor = function(inputArr,callback) {
      getBaiduMap(function(){
        var convertor = new window.BMap.Convertor();
        var pointArr = [];
        var returnPonitArr = [];
        var loadCount = Math.ceil(inputArr.length/10);
        for (var i = 0;i < inputArr.length;i++) {
          var point = new window.BMap.Point(inputArr[i][0],inputArr[i][1]);
          pointArr.push(point);
          if (pointArr.length  == 10) {
            (function(i){
              convertor.translate(pointArr, 1, 5, function(data){
                if (data.status === 0) {
                  loadCount--
                  for (var j = 0;j < 10;j++) {
                    returnPonitArr[i - 9 + j] = data.points[j]
                  }
                  if (loadCount == 0) {
                    callback(returnPonitArr);
                  }
                }
              });
              pointArr = [];
            })(i)
          }
        }
        if (pointArr.length > 0) {
          convertor.translate(pointArr, 1, 5, function(data){
            if (data.status === 0) {
              loadCount --;
              for (var j = 0;j < pointArr.length;j++) {
                returnPonitArr[inputArr.length-pointArr.length+j] = data.points[j]
              }
              if (loadCount == 0) {
                callback(returnPonitArr);
              }
            }
          })
        }
      });
    }
    element.convertor = convertor;
    var getBaiduMap = function(callback){
      if(window.BMap == undefined){
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
                  callback(window.BMap);
                }
              });
            } else {
              throw new Error('百度视图获取失败!!')
            }
          }
        }, function error(){
          console.log('百度地图加载失败!');
          callback();
        });
      } else {
        callback();
      }
    };
    var convertorByApi = function(inputArr,callback) {
      getBaiduMap(function(){
        var url = window.location.protocol + "//api.map.baidu.com/geoconv/v1/?from=1&to=5&ak=eMekSXxqG1j2wLM57RFN61l8T6eB1EDx&coords=";
        var pointlen = 0;
        var returnPonitArr = [];
        var coords="";
        var loadCount = Math.ceil(inputArr.length/80);
        for (var i = 0;i < inputArr.length;i++) {
          coords += inputArr[i][0]+","+inputArr[i][1]+";";
          pointlen++;
          if (pointlen  == 80) {
            coords = coords.substring(0,coords.length-1);
            (function(i){
              jQuery.ajax({
                type: "GET",
                url: url+coords,
                dataType: "jsonp",
                jsoncallback: 'callBack',
                success: function(data) {
                  if (data.status === 0) {
                    loadCount --;
                    for (var j = 0;j < 80;j++) {
                      returnPonitArr[i - 79 + j] = new window.BMap.Point(data.result[j]["x"],data.result[j]["y"]);
                    }
                    if (loadCount == 0) {
                      callback(returnPonitArr);
                    }
                  }
                },
                error: function(e) {
                  console.log('ajax error');
                }
              });
              pointlen = 0;
              coords = "";
            })(i)
          }
        }
        if (pointlen > 0) {
          coords = coords.substring(0,coords.length-1);
          jQuery.ajax({
            type: "GET",
            url: url+coords,
            dataType: "jsonp",
            jsoncallback: 'callBack',
            success: function(data) {
              if (data.status === 0) {
                loadCount --;
                for (var j = 0;j < pointlen;j++) {
                  returnPonitArr[inputArr.length-pointlen+j] = new window.BMap.Point(data.result[j]["x"],data.result[j]["y"]);
                }
                if (loadCount == 0) {
                  callback(returnPonitArr);
                }
              }
            },
            error: function(e) {
              console.log('ajax error');
            }
          });
        }
      });
    }
    element.convertorByApi = convertorByApi;
    var render = function(data, ms){
      console.log("data ===>", data);
      /**@param data : Object */
      /**
      data = {
        markers : markers
      }*/
      /** @param makers : Array */
      /** @class marker
      marker = {
        icon : {
          url : "../images/ouke/oukeIcon1.svg",
          width : 30,
          height : 30
        },
        lng : 116.404,
        lat : 39.915,
        infoWindow : {
          html : "项目名称1<br><hr />告警总数:12<br>工单总数:14<br>告警总数:12<br>工单总数:14<br>告警总数:12<br>工单总数:14"
        },
        title : "标题1",
        rotation : 0,
        minZoom : 0,
        maxZoom : 10
      }*/
      $$.loadExternalJs(['BMapLib'], function(BMapLib){
        var BMapLib = new BMapLib({
          mapDom : mapDom,
          popupTrigger : previewMode ? "mouseover" : "click",
          init : initFn,
          click :clickFn,
          infoWindowOpen : infoWindowOpen,
          mapStyle : ms || mapStyle
        });
        function infoWindowOpen(event){
          var content = event.html;
          var point = event.data;
          var button = $(content).find("button");
          button.on("click", function(event){
            var id = $(this).attr("id");
            if(id == "device"){
              var modelId = point.data.modelId;
              var resourceId = point.data.id;
              var params = {
                modelId : modelId,
                resourceId : resourceId
              };
              element.linkTo("../app-freeboard/index.html#/template/device/dashboard/" + JSON.stringify(params));
            } else if(id == "model"){
              var modelId = point.data.modelId;
              var params = {
                modelId : modelId
              };
              element.linkTo("../app-freeboard/index.html#/template/model/dashboard/" + JSON.stringify(params));
            } else if(id == "project"){
              var projectId = point.data.projectId;
              var params = {
                projectId : projectId
              };
              element.linkTo("../app-freeboard/index.html#/template/project/dashboard/" + JSON.stringify(params));
            } else if(id == "customer"){
              var customerId = point.data.customerId;
              var params = {
                customerId : customerId
              };
              element.linkTo("../app-freeboard/index.html#/template/customer/dashboard/" + JSON.stringify(params));
            }
          });
        };
        function initFn(event){
          BMapLib.enableScrollWheelZoom(true);
          BMapLib.centerAndZoom(data.center, data.zoom);
          if(data.markers){
            BMapLib.addMarkers(data.markers);
          };
          if(data.polygons){
            BMapLib.addPolygons(data.polygons);
          }

            //折线初始化
            if(data.overlays){
                for (var i in data.overlays){
                    BMapLib.addOverlay(data.overlays[i])
                }
            }
          if(data.symbols){
            BMapLib.addSymbols(data.symbols);
          };
          BMapLib.render();
          element.setZoom = function(zoom){
            BMapLib.setZoom(zoom);
          };
            element.getZoom = function(){
                var zoom = BMapLib.getZoom();
                return zoom;
            };
            element.getOverlays = function(){
                var zoom = BMapLib.getOverlays();
                return zoom;
            };
            element.removeOverlay = function(array){
                for (var i in array){
                    BMapLib.removeOverlay(array[i])
                }
            };
            element.addOverlay = function(array){
                for (var i in array){
                    BMapLib.addOverlay(array[i])
                }
            }
          element.setCenter = function(array){
            BMapLib.setCenter(array);
          };
          element.setHighlightByMakerId = function(id){
            BMapLib.setHighlightByMakerId(id);
          };
          element.setMapStyle = function(mapStyle){
            if(mapStyle){
              BMapLib.setMapStyle(mapStyle);
            }
          };
          element.getBMapLibMap = function() {
            return BMapLib._map;
          };
        };
        function clickFn(event){
          var point = event.data;
          if(previewMode){
            var clickFn = point.$attr("on/click");
            if(typeof clickFn == "function"){
              try{
                clickFn(event);
              } catch(e) {
                console.log(e);
              }
            };
          } else {
            var createItem = function(point){
              var dom = $("<div>" + point.$attr("data/label") + "仪表板配置</div>");
              dom.append($("<hr/>"));
              if(point.type == "device"){
                dom.append($("<button id='model' class='btn btn-default'><span class='glyphicon glyphicon-cog' style='margin-right:5px;'></span>配置设备仪表板</button>"));
                dom.append($("<br/>"));
                dom.append($("<button id='device' class='btn btn-default'><span class='glyphicon glyphicon-cog' style='margin-right:5px;'></span>配置单设备视图</button>"));
              } else if(point.type == "project"){
                dom.append($("<button id='project' class='btn btn-default'><span class='glyphicon glyphicon-cog' style='margin-right:5px;'></span>配置项目仪表板</button>"));
              } else if(point.type == "customer"){
                dom.append("<button id='customer' class='btn btn-default'><span class='glyphicon glyphicon-cog' style='margin-right:5px;'></span>配置客户仪表板</button>");
              } else {
                dom.append("无下钻")
              };
              return dom[0];
            };
            if(point.type){
              point.infoWindow.html = createItem(point);
            } else {
              var clickFn = point.$attr("on/click");
              if(typeof clickFn == "function"){
                try{
                  clickFn(event);
                } catch(e) {
                  console.log(e);
                }
              };
            };
          };
        }
      });
    };
    element.getSampleData = function(){
      return {
        icon : {
          url : "../images/ouke/oukeIcon1.svg",
          width : 30,
          height : 30
        },
        lng : 116.404,
        lat : 39.915,
        infoWindow : {
          html : "项目名称1<br><hr />告警总数:12<br>"
        },
        title : "标题1",
        rotation : 0,
        minZoom : 0,
        maxZoom : 10
      };
    };
    element.render = render;
    var initFn = expression.$attr("on/init");
    if(typeof initFn == "function"){
      try {
        initFn({
          target : element,
          global : global
        })
      } catch(e){
        console.log(e);
      }
    } else {

    };
    //render();
    //
    var trail = function (map,data,zoom,mapLib) {
      var pointArr = [];
      // var zoom =map.getZoom();
      for (var k = 0; k < data.length;k++) {
        var lon = data[k].lon * 0.000001;
        var lat = data[k].lat / 1000000;
        pointArr.push({"fix":{
          lng: lon.toFixed(6),
          lat: lat.toFixed(6)
        },"time":data[k]});
      }
      var pointList = [];
      // 生成坐标点
      var trackPoint = [];
      var pointObj = [];
      for(var i in pointArr){
        trackPoint.push(new BMap.Point(pointArr[i].fix.lng, pointArr[i].fix.lat));
        pointList.push(pointArr[i]);
        pointObj.push(pointArr[i]);
      }
      // map.centerAndZoom(trackPoint[0], 13);
      var sym = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
        scale: 5,
        strokeWeight: 1,
        fillColor: '#ffffff',
        strokeColor: 'rgb(49, 73, 181)',
        fillOpacity: 0.8
      }); // 画线
      var polyline = new BMap.Polyline(trackPoint, {
        strokeColor: "#1869AD",
        strokeWeight: 1,
        strokeOpacity: 1
      });
      map.addOverlay(polyline);
      // 配置图片
      var size = new BMap.Size(40, 70);
      var offset = new BMap.Size(0, 13);
      var imageSize = new BMap.Size(27, 42);
      var start = new BMap.Icon("../images/map/start.png", size, {
        imageSize: imageSize,
        imageOffset: new BMap.Size(8, -1)
      });
      var end = new BMap.Icon("../images/map/end.png", size, {
        imageSize: imageSize,
        imageOffset: new BMap.Size(8, -1)
      });
      var sym = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
        scale: 5,
        strokeWeight: 1,
        fillColor: '#ffffff',
        strokeColor: 'rgb(49, 73, 181)',
        fillOpacity: 0.8
      });

      var markers = [];
      for (var n in pointList) {
        var point = new BMap.Point(pointList[n].fix.lng, pointList[n].fix.lat);
        var pSize = pointList.length - 1;
        var pIcon = '';
        if(n == 0){
          pIcon = start;
        }else if(n == pSize){
          pIcon = end;
        }else{
          pIcon = sym;
        }
        var marker = new BMap.Marker(point, {
          icon: sym
        }); // 创建标注
        var label = new BMap.Label($$.getDateTime(pointList[n].time.utc), {
          offset: new BMap.Size(15, -25)
        });
        label.setStyle({
          width: "120px",
          background: "transparent",
          borderRadius: "5px",
          textAlign: "center",
          borderWidth: "1px",
          borderColor: "#1869AD",
          borderStyle: "solid",
          height: "20px",
          lineHeight: "20px"
        });
        marker.setLabel(label);
        marker.setTitle($$.getDateTime(pointList[n].time.utc));
        if(n == 0){
          marker.setShadow(start);
        }else if(n == pSize){
          marker.setShadow(end);
        }
        markers.push(marker);
        map.addOverlay(marker);
      }
    }
    window.fnOK = function(value){
      var map = element.getLibMapObj;
      var end = parseInt(new Date().getTime() / 1000);
      var start = end - (60*60*24*4);
      var rs = new commonMethod();
      var bm = new BMapLib();
      var map2 = window.BMap;
       rs.getShipTrack(""+value+"", start, end, function (res) {
         if(res.length > 0){
          trail(map,res,12,map2)
         }
       });
    };
    wrap.append(mapDom);
    return wrap;
  }
});
