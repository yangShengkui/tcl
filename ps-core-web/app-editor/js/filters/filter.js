define(
	[
		"app",
	],
	function(app){
		app.filter("sub_resourcesfilter", function(){
			function filter(input, dataType){
				var result = [];
				if(input && dataType){
					if(dataType.limit)
					{
						var node = dataType.limit.ci ? dataType.limit.ci : Infinity;
					}
					else
					{
						var node = Infinity;
					}
					var nodeNum = (function(data){
						var num = 0;
						if(data.checked){
							num++;
						}
						return num;
					})(input);
					for(var i in input){
						if((input[i].checked)||(nodeNum + 1 < node)){
							result.push(input[i]);
						}
					}
				}
				return result;
			}
			return filter;
		});
		app.filter("resourcesfilter", function(){
			function filter(input, modelKeyword, nodeKeyword, oldNodeId){
				var result = [];
				for(var i in input){
					var find = (function(data, label){
						var find = (function(data){
							for(var i in data){
								if(data[i].checked){
									return true;
								}
							}
							return false;
						})(data.kpis);
						if(find){
							return true;
						}
						var findModel;
						for(var i in modelKeyword){
							(function(modelkey){
								if(data.modelId == modelkey){
									findModel = true;
								}
							})(modelKeyword[i])
						}
						if((!findModel)&&(modelKeyword != ''))
						{
							return false;
						}
						if((oldNodeId != data.id)&&(oldNodeId != undefined))
						{
							return false;
						}
						if(data.label){
							if(data.label.indexOf(label) == -1)
							{
								return false;
							}
						}
						else
						{
							return false;
						}
						return true;
					})(input[i], nodeKeyword)
					if(find)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
		app.filter("kpifilter", function(){
			function filter(input, kpiKeyword){
				var result = [];
				for(var i in input){
					if(input[i].label){
						var containFilterWord = input[i].label.indexOf(kpiKeyword) != -1;
					}
					else
					{
						var containFilterWord = -1
					}
					var noNeedFilter = (kpiKeyword == "");
					if(containFilterWord || noNeedFilter || input[i].checked)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
		app.filter("unitfilter", function(){
			function filter(input, unitKeyword){
				var result = [];
				for(var i in input){
					var containFilterWord = (input[i].unit == unitKeyword);
					var noNeedFilter = (unitKeyword == "all");
					if(containFilterWord || noNeedFilter || input[i].checked)
					{
						result.push(input[i]);
					}
				}
				return result;
			}
			return filter;
		});
		app.filter("listAllUnit", function(){
			function filter(input){
				var result = ['all'];


				for(var i in input){
					var unit = input[i].unit;
					if(result.indexOf(unit) == -1)
					{
						result.push(unit);
					}
				}
				console.log(result);
				console.log("-----", result);
				return result;
			}
			return filter;
		});
		app.filter("checkResource", function(){
			function filter(input)
			{
				var result = [];
				try{
					if(input != undefined)
					{
						for(var i in input){
							for(var j in input[i].kpis)
							{
								if(input[i].kpis[j].checked){
									result.push(input[i].kpis[j]);
								}
							}
						}
					}
					else
					{
						throw "input is undefined!!!"
					}
				}
				catch(error)
				{
					console.log(error);
				}
				return result;
			}
			return filter;
		});
		app.filter("getResourcesChecked", function(){
			function filter(input)
			{
				var result = [];
				try{
					if(input != undefined)
					{
						if(input.resources)
						{
							var resources = input.resources;
							for(var i in resources) {

								var checked = resources[i].checked;
								if (checked) {
									result.push(resources[i]);
								}
							}
							return result;
						}
						else
						{
							return [];
						}
					}
					else
					{
						throw "input is undefined!!!"
					}
				}
				catch(error)
				{
					console.log(error);
				}
			}
			return filter;
		});
		app.filter("getKpiChecked", function(){
			function filter(input)
			{
				var result = [];
				try{
					if(input != undefined)
					{
						if(input.kpis)
						{
							var kpi = input.kpis;
							for(var i in kpi){

								var checked = kpi[i].checked;
								if(checked)
								{
									result.push(kpi[i]);
								}
							}
							return result;
						}
						else
						{
							return [];
						}
					}
					else
					{
						throw "input is undefined!!!"
					}
				}
				catch(error)
				{
					console.log(error);
				}
			}
			return filter;
		});
		app.filter("getCatList", function(){
			function filter(input)
			{
				var result = [];
				if(input)
				{
					//console.log(input.category);
					for(var i in input.category){
						result.push({
							name : i,
							value : i
						});
					};
				}
				return result;
			}
			return filter;
		});
	}
)