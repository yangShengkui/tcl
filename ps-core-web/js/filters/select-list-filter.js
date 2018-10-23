define(['../filters/filters.js'], function(filters) {
	'use strict';
  filters.filter("$filter", function(){
    function filter(input, query){
      var result = [];
      if(typeof input == "object"){
        if(typeof query == 'function'){
          var filter = input.filter(function(elem){
            return query(elem);
          })
          result = filter;
        } else {
          result = input;
        }
      };
      return result;
    }
    return filter;
  });
});