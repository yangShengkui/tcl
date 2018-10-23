define(['angular', 'ng-message-box', '../modules/model/model.js'], function (angular, ngMessageBox, psModel) {
  var module = angular.module('solutionModules', [ngMessageBox.name, psModel.name]);
  return module;
});