define(['../filters/filters.js'], function(filters) {
  'use strict';
  filters.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
      return $sce.trustAsResourceUrl(val);
    };
  }])
  filters.filter('trustHtml', ['$sce', function($sce) {
    return function(input) {
      return $sce.trustAsHtml(input);
    }
  }]);
});