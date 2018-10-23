define(['../filters/filters.js'], function (filters) {
  'use strict';
  filters.filter("arrayfilter", function () {
    function filter(relation, definitions) {
      if (!relation) {
        return true;
      }
      if (relation.indexOf(':') < 0) {
        return true;
      }
      var values = relation.split(':');
      var field = values[0];
      if (!definitions[field]) {
        return false;
      }
      var valueAry = values[1].indexOf('|') > -1 ? values[1].split('|') : [values[1]];
      var flag = false;
      valueAry.forEach(function (item) {
        if (definitions[field] == item) {
          flag = true;
        }
      });
      return flag;
    }

    return filter;
  });

  filters.filter("substring", function () {
    function filter(value, splitStr) {
      splitStr = splitStr || ',';
      var outputAry = value.split(splitStr);
      return outputAry[outputAry.length - 1];
    }

    return filter;
  });

});