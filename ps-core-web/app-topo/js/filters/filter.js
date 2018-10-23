define(
	[
		"angular",
	],
	function(angular){
		var module = angular.module("myapp");
		module.filter("subResourcefilter", function(){
			function filter(input, params){
				var result = [];
				var keyword = params.keyword;
				var gatewayId = params.gatewayId;
				var findKeyword, findGateway;
				console.log(keyword, gatewayId);
				if((keyword == undefined || keyword == '') && gatewayId == '')
				{
					result = input;
				}
				else
				{
					if(input instanceof Array)
					{
						result = input.filter(function(element){
							if(element.resourcesArray instanceof Array)
							{
								findKeyword = element.resourcesArray.some(function(elem){
									if(keyword != '' && keyword != undefined)
									{
										return elem.label.indexOf(keyword) != -1;
									}
									else
									{
										return true;
									}
								});
								findGateway = element.resourcesArray.some(function(elem){
									if(gatewayId)
									{
										return elem.gatewayId == gatewayId;
									}
									else
									{
										return true;
									}
								});
								return findKeyword && findGateway;
							}
							else
							{
								return true;
							}
						});
					}
					else
					{
						result = [];
					}
				}
				return result;
			}
			return filter;
		});
		module.filter("kpiDisp", function(){
			function filter(input){
				var result = [];
				for(var i in input){
					if(input[i].used != true)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
		module.filter("checkshow", function(){
			function filter(input){
				var result = [];
				for(var i in input){
					if(input[i].show != false)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
		module.filter("showOtherFilter", function(){
			function filter(input, channelType){
				var result = [];
				for(var i in input){
					if(input[i].channelType != channelType)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
		module.filter("resourcesfilter", function(){
			function filter(input, nodeKeyword){
				var result = [];
				for(var i in input){
					if(input[i].label){
						var containFilterWord = input[i].label.indexOf(nodeKeyword) != -1;
					}
					else
					{
						var containFilterWord = -1
					}
					var noNeedFilter = (nodeKeyword == "");
					if(containFilterWord || noNeedFilter || input[i].checked)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
	}
)