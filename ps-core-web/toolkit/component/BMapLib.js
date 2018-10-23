/**
 * Created by leonlin on 16/11/3.
 */
define([], function() {
  var initFn, clickFn, infoWindowOpenFn, popupTrigger;
  var BMapLib = function(obj) {
    var cur = this;
    var mapDom = obj.mapDom;
    var mapStyle = obj.mapStyle;
    popupTrigger = obj.$attr("popupTrigger");
    initFn = obj.$attr("init");
    clickFn = obj.$attr("click");
    infoWindowOpenFn = obj.$attr("infoWindowOpen");
    var baiduIconLoaded = function(callback) {
      var count = 0;
      wait();

      function wait() {
        count += 1;
        setTimeout(function() {
          if(count < 200) {
            if(mapDom.find(".anchorBL").size() < 2) {
              wait();
            } else {
              callback();
            }
          } else {
            callback();
          }

        });
      }
    };
    var getBaiduMap = function(callback) {
      require(['baiduMap', 'bmap'], function(a, b) {
        var count = 0;
        wait();

        function wait() {
          if(count < 20) {
            count += 1;
            setTimeout(function() {
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
      }, function error() {
        console.log('百度地图加载失败!');
        callback();
      });
    };
    getBaiduMap(function(BMap) {
      setTimeout(function() {
        var id = mapDom.attr("id");
        var map = new BMap.Map(id);
        map.setMapStyle({
          styleJson: mapStyle
        });
        cur._map = map;
        map.addEventListener("zoomend", function(event) {
          cur.renderMarkers();
          cur.renderPolygons();
        });
        console.log("---------initFn-------");
        if(typeof initFn == "function") {
          initFn({
            target: mapDom
          })
        }
        baiduIconLoaded(function() {
          mapDom.find(".anchorBL").remove();
        });
      });
    });
    this._markGroup = [];
    this._polygonGroup = [];
    this._symbolGroup = [];
  };
  BMapLib.prototype.centerAndZoom = function(point, level) {
    var map = this._map;
    var point = new BMap.Point(point[0], point[1]);
    map.centerAndZoom(point, level)
  };
  BMapLib.prototype.enableScrollWheelZoom = function(bool) {
    var map = this._map;
    map.enableScrollWheelZoom(bool);
  };
  BMapLib.prototype.setZoom = function(zoom) {
    var map = this._map;
    var closeInfoWindow = function() {
      map.closeInfoWindow();
    };
    setTimeout(function() {
      closeInfoWindow();
    });
    map.setZoom(zoom);
  };
  BMapLib.prototype.getZoom = function() {
    var map = this._map;
    var zoom = map.getZoom();
    return zoom;
  };
  BMapLib.prototype.getOverlays = function() {
    var map = this._map;
    var zoom = map.getOverlays();
    return zoom;
  };
  BMapLib.prototype.removeOverlay = function(arr) {
    var map = this._map;
    map.removeOverlay(arr);
  };
  BMapLib.prototype.addOverlay = function(arr) {
    var arrA = arr[0];
    var arrB = arr[1];
    var obj = arr[2];
    var map = this._map;
    var pointA = new BMap.Point(arrA[0], arrA[1]);
    var pointB = new BMap.Point(arrB[0], arrB[1]);
    var polyline = new BMap.Polyline([pointA, pointB], obj); //定义折线
    map.addOverlay(polyline); //添加折线到地图上
  };
  BMapLib.prototype.setCenter = function(arr) {
    var map = this._map;
    var point = new BMap.Point(arr[0], arr[1]);
    map.setCenter(point);
  };
  BMapLib.prototype.openInfoWindow = function(point) {
    var pt = new BMap.Point(point.lng, point.lat);
    var map = this._map;
    var infoWindow = point.infoWindow || {};
    var html = infoWindow.html;
    var InfoWindowOptions = {
      width: point.infoWindow.width ? point.infoWindow.width : 150, // 信息窗口宽度
      height: point.infoWindow.height ? point.infoWindow.height : 180, // 信息窗口高度
      title: point.infoWindow.title ? point.infoWindow.title : "信息窗口", // 信息窗口标题
      offset: new BMap.Size(5, -30)
    };
    var infoWnd = new BMap.InfoWindow(html, InfoWindowOptions);
    map.openInfoWindow(infoWnd, pt);
    setTimeout(function() {
      if(typeof infoWindowOpenFn == "function") {
        infoWindowOpenFn({
          data: point,
          html: infoWnd.getContent()
        });
      };
    })
  };
  /**
   * 绘制正方形
   */
  BMapLib.prototype.setMapStyle = function(mapStyle) {
    var map = this._map;
    map.setMapStyle({
      styleJson: mapStyle
    });
  };
  BMapLib.prototype.addSquare = function(point) {
    //创建正方形轮廓
    var self = this;
    var map = this._map;
    var point = new BMap.Point(point.lng, point.lat);
    var pt = new BMap.Point(point.lng, point.lat);
    //  备注：   "http://5z6kbx.natappfree.cc/sqare.png"  必须在公网的服务器部署,这个是我本机器开的公网服务器地址
    var myIcon = new BMap.Icon("../images/baidumap/sqare.png", new BMap.Size(50, 50));
    var polygon = new BMap.Marker(pt, {
      icon: myIcon,
      enableClicking: true,
      enableMassClear: true
    });
    self._maskGroup = self._maskGroup || [];
    self._maskGroup.push(polygon);
    for(var i = 0; i < self._maskGroup.length; i++) {
      map.removeOverlay(self._maskGroup[i]);
    }
    map.addOverlay(polygon);
  };
  BMapLib.prototype.addMarker = function(point) {
    var self = this;
    var map = this._map;
    var pt = new BMap.Point(point.lng, point.lat);
    var iconObj = point.$attr("icon/normal") || null;
    var symbolObj = point.$attr("symbol/normal") || null;
    //var clickFn = point.$attr("on/click");
    var createSymbol = function(arr) {
      var points = "";
      var creatPoint = function(inx, numbers) {
        if(inx == 0) {
          points += "M" + numbers[0] + " " + numbers[1] + " ";
        } else if(inx == arr.length - 1) {
          points += "L" + numbers[0] + " " + numbers[1] + " Z";
        } else {
          points += "L" + numbers[0] + " " + numbers[1] + " ";
        }
      };
      for(var i in arr) {
        creatPoint(i, arr[i]);
      };
      var result = "d='" + points + "'";
      return result;
    };
    var icon = {};
    if(iconObj) {
      var size = new BMap.Size(iconObj.width, iconObj.height);
      var imageSize = new BMap.Size(iconObj.width, iconObj.height);
      var iconOption = {
        size: size,
        imageSize: imageSize
      };
      icon = new BMap.Icon(iconObj.url, size, iconOption);
    } else if(symbolObj) {
      var symbolOptions = {
        rotation: symbolObj.rotate || 0,
        fillColor: "yellow",
        strokeColor: "#000",
        strokeWeight: 1,
        fillOpacity: 1
      };
      icon = new BMap.Symbol(createSymbol([
        [-10, 15],
        [10, 15],
        [0, -15],
        [-10, 15]
      ]), symbolOptions);
    }
    var markerOptions = {};
    markerOptions.title = point.title;
    markerOptions.icon = icon;
    markerOptions.rotation = point.rotation;
    var marker = new BMap.Marker(pt, markerOptions);
    marker.id = point.id;
    marker.minZoom = point.minZoom;
    marker.maxZoom = point.maxZoom;
    marker.iconObj = point.icon;
    marker.symbolObj = point.symbol;
    marker._point = point;
    /**
     * 1.marker的层级必须高于外边轮廓（addSquare）的层级
     * 解决不能继续点击的问题，提高marker的层级
     */
    marker.setZIndex(0);
    var closeInfoWindow = function() {
      map.closeInfoWindow();
    };
    var getInfoWindow = function() {
      map.getInfoWindow();
    }
    marker.addEventListener("mouseover", function() {
      if(popupTrigger == "mouseover") {
        self.openInfoWindow(point);
        //self.addSquare(point);
      }
    });
    /**
     marker.addEventListener("mouseout", function(){
      if(popupTrigger == "mouseover"){
        closeInfoWindow();
      };
    });*/
    marker.addEventListener("click", function(event) {
      if(clickFn) {
        try {
          clickFn({
            data: point
          });
        } catch(e) {
          console.log(e);
        }
      }
      if(popupTrigger == "mouseover") {
        closeInfoWindow();
      } else if(popupTrigger == "click") {
        if(getInfoWindow()) {
          closeInfoWindow();
        } else {
          self.openInfoWindow(point);
        }
      }
    });

    this._markGroup.push(marker);
    this.renderMarkers();
  };
  BMapLib.prototype.addPolygon = function(point) {
    var self = this;
    var map = this._map;
    //var clickFn = point.$attr("on/click");
    var createPolygon = function(lng, lat, arr, rotate) {
      var angle = rotate / 180 * Math.PI;
      var points = [];
      var creatPoint = function(numbers) {
        var x0 = numbers[0] * 0.7;
        var y0 = numbers[1] * 1.4;
        var x1 = x0 * Math.cos(angle) + y0 * Math.sin(angle);
        var y1 = y0 * Math.cos(angle) - x0 * Math.sin(angle);
        return new BMap.Point(lng + x1, lat + y1);
      };
      for(var i in arr) {
        points.push(creatPoint(arr[i]));
      };
      return points;
    };
    var pt = new BMap.Point(point.lng, point.lat);
    var PolygonOptions = {
      fillColor: "yellow",
      strokeColor: "#000",
      strokeWeight: 1,
      fillOpacity: 1
    };
    var polygon = new BMap.Polygon(pt, PolygonOptions);
    polygon.minZoom = point.minZoom;
    polygon.maxZoom = point.maxZoom;
    polygon._point = point;
    polygon.setPath(createPolygon(point.lng, point.lat, point.path, point.rotate));
    this._polygonGroup.push(polygon);
    polygon.addEventListener("mouseover", function(e) {
      self.openInfoWindow(point);
      /**
       var infoWindow = point.infoWindow || {};
       var html = infoWindow.html;
       var InfoWindowOptions = {
        width : point.infoWindow.width ? point.infoWindow.width : 150,     // 信息窗口宽度
        height: point.infoWindow.height ? point.infoWindow.height : 180,     // 信息窗口高度
        title : point.infoWindow.title ? point.infoWindow.title : "信息窗口" , // 信息窗口标题
        offset : new BMap.Size(5, -30)
      };
       if (!point.infoWindow.options) point.infoWindow.options = InfoWindowOptions;
       var infoWnd = new BMap.InfoWindow(html, point.infoWindow.options);
       map.openInfoWindow(infoWnd, pt);*/
    });

    polygon.addEventListener("mouseout", function() {
      //焦点离开时不关闭
      //map.closeInfoWindow();
    });
    polygon.addEventListener("click", function(event) {
      map.closeInfoWindow();
      if(clickFn) {
        try {
          clickFn({
            data: point
          });
        } catch(e) {
          console.log(e);
        }
      }
    })
    this.renderPolygons();
  };
  BMapLib.prototype.setHighlightByMakerId = function(id) {
    var self = this;
    var inx = 0;
    var zIndex = 0;
    var loopMarker = function(inx) {
      var marker = self._markGroup[inx];
      if(marker) {
        var type = marker.id == id ? "highlight" : "normal";
        if(marker.iconObj) {
          var iconObj = marker.iconObj[type] || null;
          var size = new BMap.Size(iconObj.width, iconObj.height);
          var imageSize = new BMap.Size(iconObj.width, iconObj.height);
          var iconOption = {
            size: size,
            imageSize: imageSize
          };
          var icon = new BMap.Icon(iconObj.url, size, iconOption);
          marker.setIcon(icon);
          if(type == "highlight") {
            marker.setZIndex(self._markGroup.length);
            self.openInfoWindow(marker._point);
          } else {
            marker.setZIndex(zIndex);
            zIndex++;
          };
          inx++;
          loopMarker(inx);
        } else if(marker.symbolObj) {
          if(type == "highlight") {
            setTimeout(function() {
              self.openInfoWindow(marker._point);
              self._map.setCenter(marker.point);
            });
          }
          inx++;
          loopMarker(inx);
        }
      }
    };
    loopMarker(inx)
    this.render();
  };
  BMapLib.prototype.render = function() {
    this.renderPolygons();
    this.renderMarkers();
    this.renderSymbols();
  };
  BMapLib.prototype.addMarkers = function(points) {
    var self = this;
    for(var i in points) {
      self.addMarker(points[i]);
    }
  };
  BMapLib.prototype.addPolygons = function(points) {
    var self = this;
    for(var i in points) {
      self.addPolygon(points[i]);
    }
  };
  BMapLib.prototype.addSymbols = function(points) {
    var self = this;
    for(var i in points) {
      self.addSymbol(points[i]);
    }
  };
  BMapLib.prototype.renderPolygons = function() {
    var self = this;
    var map = this._map;
    var loop = function(polygon) {
      var zoom = self._map.getZoom();
      if(zoom > polygon.minZoom && zoom <= polygon.maxZoom) {
        map.addOverlay(polygon);
      } else {
        map.removeOverlay(polygon);
      }
    };
    for(var i in this._polygonGroup) {
      loop(this._polygonGroup[i])
    }
  };
  BMapLib.prototype.renderMarkers = function() {
    var self = this;
    var map = this._map;
    var loop = function(marker) {
      var zoom = self._map.getZoom();
      if(zoom > marker.minZoom && zoom <= marker.maxZoom) {
        map.addOverlay(marker);
      } else {
        map.removeOverlay(marker);
      }
    };
    for(var i in this._markGroup) {
      loop(this._markGroup[i])
    }
  };
  BMapLib.prototype.renderSymbols = function() {
    var self = this;
    var map = this._map;
    var loop = function(symbol) {
      var zoom = self._map.getZoom();
      if(zoom > symbol.minZoom && zoom <= symbol.maxZoom) {
        map.addOverlay(symbol);
      } else {
        map.removeOverlay(symbol);
      }
    };
    for(var i in this._symbolGroup) {
      loop(this._symbolGroup[i])
    }
  };
  /**
   var getBaiduMap = function(callback){
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
  };
   var lib = function(mapDom, callback){
    var baiduIconLoaded = function(callback){
      var count = 0;
      wait();
      function wait() {
        count += 1;
        setTimeout(function(){
          if(count < 200){
            if(mapDom.find(".anchorBL").size() < 2) {
              wait();
            } else {
              callback();
            }
          } else {
            callback();
          }

        });
      }
    };
    getBaiduMap(function(BMap){
      setTimeout(function(){
        var id = mapDom.attr("id");
        var map = new BMap.Map(id);
        var maplib = new BMapLib(map);
        map.addEventListener("zoomend", function(event){
          maplib.renderMarkers();
          maplib.renderPolygons();
        });
        baiduIconLoaded(function(){
          //mapDom.find(".anchorBL").remove();//版权问题，不取消
        });
        callback(maplib);
      });
    })
  };
   return lib;*/
  return BMapLib
});