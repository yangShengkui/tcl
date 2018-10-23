define(['angular'], function (angular) {
  var module = angular.module('psModel', []);
  module.factory('psModel', ['ngDialog', function (ngDialog) {
    var factory = {};

    factory.open = function (option) {
      ngDialog.open({
        template: '../partials/dialogue/common_dialog_for_solution.html',
        className: 'ngdialog-theme-plain',
        controller: '__solutionModelController__',
        closeByEscape: false,
        closeByDocument: false,
        resolve: {
          __solutionModelOption__: function () {
            return option;
          }
        }
      });
    };

    return factory;
  }]);
  module.controller('__solutionModelController__', ['$scope', '__solutionModelOption__', '$timeout', '$q', function ($scope, option, $timeout, $q) {
    $scope.option = option;
    $scope.formData = {};
    $scope.initFns = [];
    $scope.option.body.forEach(function (item) {
      $scope.formData[item.field] = item.value;
      item.checkValue = function () {
        if (item.reg) {
          return;
        }
        if (item.check) {
          item.value = $scope.formData[item.field];
          return !item.check($scope.formData[item.field]);
        }
        return false;
      };
      item.changeFn = function () {
        var fn = item.$attr('on/change');
        item.value = $scope.formData[item.field];
        if (fn) {
          var selectOption;
          if (item.type === 'select' || item.type === 'select2') {
            item.selectData.forEach(function (sd) {
              if (sd.id == $scope.formData[item.field]) {
                selectOption = sd;
              }
            });
          }
          fn($scope.formData[item.field], item, selectOption);
        }
      };
      $scope.initFns.push({
        fn: item.$attr('on/init'),
        param: [item]
      });
    });

    $scope.option.buttons.forEach(function (button) {
      button.clickFn = function (e) {
        e.data = $scope.formData;
        var cFn = button.$attr('on/click');
        if (cFn) {
          cFn(e, $scope.formData, $scope.option);
          if (!e.isDefaultPrevented()) {
            $scope.closeModel();
          }
        } else {
          $scope.closeModel();
        }
      };
    });

    $scope.closeModel = function () {
      $scope.closeThisDialog();
    }

    $timeout(function () {
      var promises = [];
      // 执行所有的init回调
      $scope.initFns.forEach(function (initFn) {
        if (initFn.fn) {
          var defer = $q.defer();
          initFn.param.push(defer);
          initFn.fn.apply(this, initFn.param);
          promises.push(defer.promise);
        }
      });
      $q.all(promises).then(function () {
        console.info('init...');
      });
    });

  }]);
  return module;
});
