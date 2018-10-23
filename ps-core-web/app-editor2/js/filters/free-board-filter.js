define(['filters/filters'], function(filters){
	'use strict';
	filters.filter("percent", function(){
		function filter(input){
			var result;
			if(parseInt(input) > 10)
			{
				result = parseInt(input) + "%"
			}
			else
			{
				result = parseInt(input) + "%"
			}
			return result;
		}
		return filter;
	});
	filters.filter("getunit", function(){
		function filter(input){
			var result = [{
				label : "所有单位",
				value : ""
			}];
			for(var i in input)
			{
				var unit = input[i].unit;
				var some = result.find(function(element){
					return element.value == unit;
				});
				if(!some)
				{
					result.push({
						label : unit,
						value : unit
					});
				}
			}
			return result;
		}
		return filter;
	});
});