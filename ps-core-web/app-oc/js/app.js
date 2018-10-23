define([
  'angular',
  '../../node_modules/ps-ultility/ps-ultility',
  'solution',
  'angular-route',
  'angular-resource',
  'angular-animate',
  'angular-growl',
  'angular-file-upload',
  "angular-style",
  "angular-popup",
  "angular-dialogue",
  'ng-dialog',
  'controllers/index',
  'directives/index',
  'filters/index',
  'services/index',
  'values/index',
  'ngPstree',
  'ps-components'
], function(angular, ultility, solution) {
  'use strict';
  return function(callback){
    var urlobj = ultility.urlparser(window.location.href),
      url = urlobj.address === "localhost" || urlobj.address === "127.0.0.1"
        ? "../../ps-core/output.angular" : "../../ps-core/output";
    solution(function(){
      require([url], function(m){
        var mod = angular.module('app', [
          'controllers',
          'directives',
          'filters',
          'services',
          'values',
          'angular-growl',
          'ngAnimate',
          'ngRoute',
          'angularFileUpload',
          'ngAngularStyle' ,
          'ngAngularPopup',
          'ngAngularDialogue',
          'ngDialog',
          'solution',
          'ngPstree',
          'psComponents',
          m.name
        ]);
        callback(mod);
      }, function(e){
        console.error(e);
        var mod = angular.module('app', [
          'controllers',
          'directives',
          'filters',
          'services',
          'values',
          'angular-growl',
          'ngAnimate',
          'ngRoute',
          'angularFileUpload',
          'ngAngularStyle' ,
          'ngAngularPopup',
          'ngAngularDialogue',
          'ngDialog',
          'solution',
          'ngPstree',
          'psComponents'
        ]);
        callback(mod);
      });
    })
  };
});