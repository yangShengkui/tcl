define(['filters/filters'], function(filters){
	'use strict';
	filters.filter("showdifference", function(){
		function filter(input, data){
			var result = [];
			if(input instanceof Array)
			{
				result = input.filter(function(element){
					return element.used == false;
				});
			}
			if(data ? data.resource : false)
			{
				result.push(data.resource);
			}
			return result;
		}
		return filter;
	});
});