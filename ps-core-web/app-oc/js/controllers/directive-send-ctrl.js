define(['controllers/controllers'], function (controllers) {
  'use strict';
  controllers.initController('directiveSendCtrl', ['$scope', '$routeParams', '$q', 'userLoginUIService', 'resourceUIService',
    function ($scope, $routeParams, $q, userLoginUIService, resourceUIService) {
      var type = $routeParams.type;
      var id = $routeParams.id;

      var getDataItemsByModelId = function (mId) {
        $scope.kpis = {};
        var defer = $q.defer();
        resourceUIService.getDataItemsByModelId(mId, function (ret) {
          if (ret.code == 0) {
            ret.data.forEach(function (item) {
              $scope.kpis[item.id] = item;
            });
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      var getModels = function () {
        var defer = $q.defer();
        switch (type) {
          case 'device':
            getDevices('device', id).then(function (devices) {
              var d = devices[0];
              resourceUIService.getModelsByCondition({
                id: d.modelId
              }, function (ret) {
                if (ret.code == 0) {
                  $scope.modelList = ret.data;
                  $scope.queryDitem.modelId = ret.data[0].id;
                  defer.resolve();
                }
              });
            });
            break;
          case 'model':
            resourceUIService.getModelsByCondition({
              id: id
            }, function (ret) {
              if (ret.code == 0) {
                $scope.modelList = ret.data;
                $scope.queryDitem.modelId = ret.data[0].id;
                defer.resolve();
              }
            });
            break;
          case 'gateway':
            getDevices('gateway', id).then(function (devices) {
              var defers = [];
              var modelIds = {};
              devices.forEach(function (dev) {
                modelIds[dev.modelId] = dev.modelId;
              });
              Object.keys(modelIds).forEach(function (modelId) {
                var def = $q.defer();
                resourceUIService.getModelsByCondition({
                  id: modelId
                }, function (ret) {
                  if (ret.code == 0) {
                    def.resolve(ret.data);
                  }
                });
                defers.push(def.promise);
              });

              $q.all(defers).then(function (ret) {
                var modelList = [];
                ret.forEach(function (item) {
                  modelList = modelList.concat(item);
                });
                $scope.modelList = modelList;
                $scope.queryDitem.modelId = modelList.length < 1 ? '' : modelList[0].id;
                defer.resolve();
              });
            });
            break;
        }
        return defer.promise;
      };
      var getDevices = function (gType, gId) {
        var defer = $q.defer();
        var obj = {
          gateway: 'gatewayId',
          model: 'modelId',
          device: 'resourceId'
        };
        var param = {};
        param[obj[gType]] = gId;
        resourceUIService.getDevicesByCondition(param, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      var getDirectivesByModelId = function (modelId) {
        var defer = $q.defer();
        resourceUIService.getDirectivesByModelId(modelId, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      var sendDeviceDirective = function (deviceIds, directiveId, param) {
        var defer = $q.defer();
        resourceUIService.sendDeviceDirectiveBatch(deviceIds, directiveId, param, function (ret) {
          if (ret.code == 0) {
            defer.resolve('success');
          }
        });
        return defer.promise;
      };
      var buildDirectiveGrid = function () {
        getModels().then(function () {
          return getDirectivesByModelId($scope.queryDitem.modelId);
        }).then(function (data) {
          getDataItemsByModelId($scope.queryDitem.modelId);
          $scope.$broadcast('DIRECTIVE_SEND_TABLE_INIT', {
            data: data
          });
        });
      };

      $scope.kpis = {};
      $scope.modelList = [];
      $scope.directives = [];
      $scope.queryDitem = {
        modelId: ''
      };
      $scope.sendDirective = function (rowData) {
        getDevices(type, id).then(function (data) {
          var deviceIds = [];
          data.forEach(function (d) {
            deviceIds.push(d.id);
          });
          sendDeviceDirective(deviceIds, rowData.id, rowData.paramMap).then(function (ret) {
            console.log(ret);
          });
        });
      };
      $scope.goSearch = function () {
        buildDirectiveGrid();
      };

      var init = function () {
        $scope.$broadcast('DIRECTIVE_SEND_TABLE_INIT', {
          data: []
        });
        buildDirectiveGrid();
      };
      // 监听登录状态
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function () {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }]);
});