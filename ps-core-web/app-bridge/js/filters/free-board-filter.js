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
	filters.filter("unitfilter", function(){
		function filter(input, key){
			var result = [];
			for(var i in input)
			{
				if(key == "" || key == null || key == undefined || key == input[i].unit){
					result.push(input[i])
				}
			}
			return result;
		}
		return filter;
	});
	filters.filter("anchorFilter", function(){
		function filter(input, anchor){
			var rs = input.filter(function(elem){
				if(anchor)
				{
					return elem.value != anchor.value || !anchor.applied;
				}
				else
				{
					return true;
				}
			});
			return rs;
		}
		return filter;
	})
});