define(['controllers/controllers','Array'], function (controllers) {
  'use strict';
  controllers.initController('deviceLogCtrl', ['$scope', '$q', '$rootScope', '$location', '$routeParams', '$timeout', 'kqiManagerUIService','userRoleUIService', 'resourceUIService','userLoginUIService', 'Info', 'growl', 'userEnterpriseService', 'viewFlexService','userDomainService', "$window", "SwSocket", "dialogue", "ngDialog",
    function ($scope, q, rootScope, $location, $routeParams, timeout, kqiManagerUIService, userRoleUIService, resourceUIService, userLoginUIService, Info, growl, userEnterpriseService, viewFlexService, userDomainService, window, SwSocket, dialogue, ngDialog) {
      var gatewayId = $routeParams.gatewayId;
      $scope.getFindDeviceLog = function(queryItem, pageRequest, callback) {
          resourceUIService.findDeviceLog(queryItem, pageRequest, function(returnObj) {
          if(returnObj.code == 0){
            callback(returnObj.data.data, returnObj.data.total);
          }
        })
      }
      $scope.pipeline = function(opts) {
        // Configuration options
        var conf = $.extend({
          pages: 1, // number of pages to cache
          url: '', // script url
          data: null, // function or object with parameters to send to the server
          // matching how `ajax.data` works in DataTables
          method: 'POST' // Ajax HTTP method
        }, opts);

        // Private variables for storing the cache
        var cacheLower = -1;
        var cacheUpper = null;
        var cacheLastRequest = null;
        var cacheLastJson = null;

        return function(request, drawCallback, settings) {
          var ajax = false;
          var requestStart = request.start;
          var drawStart = request.start;
          var requestLength = request.length;
          var requestEnd = requestStart + requestLength;
          // var sort = request.columns[request.order[0].column].data; //排序列的字段
          // var sortType = request.order[0].dir; //排序的方式
          if(settings.clearCache) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
          } else if(cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
          } else if(JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
            JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
            JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
          ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
          }

          // Store the request for checking next time around
          cacheLastRequest = $.extend(true, {}, request);

          if(ajax) {
            // Need data from the server
            if(requestStart < cacheLower) {
              requestStart = requestStart - (requestLength * (conf.pages - 1));

              if(requestStart < 0) {
                requestStart = 0;
              }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength * conf.pages;

            // Provide the same `data` options as DataTables.
            if($.isFunction(conf.data)) {
              // As a function it is executed with the data object as an arg
              // for manipulation. If an object is returned, it is used as the
              // data object to submit
              var d = conf.data(request);
              if(d) {
                $.extend(request, d);
              }
            } else if($.isPlainObject(conf.data)) {
              // As an object, the data given extends the default
              $.extend(request, conf.data);
            }
            var pageRequest = {
              start: request.start,
              length: request.length,
              // sort: sort,
              // sortType: sortType,
              statCount: request.draw == 1
            }

            $scope.getFindDeviceLog({"type":"data_status_log","resourceId":gatewayId}, pageRequest, function(returnObj, total) {
              var json = {};
              json.data = returnObj;
              json.draw = request.draw; // Update the echo for each response
              json.recordsTotal = total != undefined ? (total == -1 ? cacheLastJson.recordsTotal : total) : returnObj.length;
              json.recordsFiltered = json.recordsTotal;
              cacheLastJson = $.extend(true, {}, json);
              if(cacheLower != drawStart) {
                json.data.splice(0, drawStart - cacheLower);
              }
              if(requestLength >= -1) {
                json.data.splice(requestLength, json.data.length);
              }

              drawCallback(json);
            });
          } else {
            if($scope.socketList.length > 0) {
              cacheLastJson.data = $scope.socketList;
            }
            var json = $.extend(true, {}, cacheLastJson);
            json.draw = request.draw; // Update the echo for each response
            json.data.splice(0, requestStart - cacheLower);
            json.data.splice(requestLength, json.data.length);
            drawCallback(json);
          }
        }
      };
      /**
       * 获取所有网关
       * @type {Array}
       */
      $scope.gatewayList = [];
      $scope.gatewayDic = {};
      var  allGateway = function () {
        resourceUIService.findDeviceLog({"type":"data_status_log","resourceId":gatewayId}, function(returnObj) {
            if(returnObj.code == 0){
              $scope.gatewayList = returnObj.data;
              returnObj.data.forEach(function (item) {
                $scope.gatewayDic[item.id] = item;
              });
            }
        });
      }
      /**
       * 获取所有网关日志
       */
      var displayGatewayLog = function () {
        // $scope.$broadcast("device_log", {"option": []});
        resourceUIService.getAllGatewaysByCondition({},function(returnObj) {
          if(returnObj.code == 0){
            // $scope.$broadcast("device_log", returnObj.data);
            $scope.$broadcast("device_log", {"option": []});
          }
        });
      }
      var init = function(){
        // allGateway();
        displayGatewayLog();
      };

      // 监听登录状态
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
});