define([], function () {
	function optionDataHandler(type, dataType, formatStr, event, option, unitslist)
	{
		var nodes = event.nodes;
		var units = unitslist;
		var kpis = event.kpis;
		var type = type
		var ctype = dataType.series.value;
		var category = dataType.category;
		var series = [];
		var series_data = [];
		var legend = [];
		var legend_data = [];
		var axis = [];
		var axis_data = [];
		var format = formatStr;
		var polar = [];
		var polar_data = [];
		var option_clone = JSON.parse(JSON.stringify(option));
		if(dataType.series.model == "dimensional"){
			if(category == "time")
			{
				series_data = dimensionalData_byTime(ctype, event.data);
			}
			else if(category == "ci")
			{
				series_data = dimensionalData_byCi(ctype, event.data);
			}
		}
		else if(dataType.series.model == "linear"){
			if(category == "time")
			{
				series_data = linearData_byTime(event.data);
			}
			else if(category == "ci")
			{
				series_data = linearData_byCi(event.data);
			}
		}
		else if(dataType.series.model == "polar"){
			series_data = polarData(ctype, event.data);
		}
		switch(type){
			case "line":
				bindDataToLine.apply(option_clone, [series_data]);
				break;
			case "line_2d":
				bindDataToLine_2d.apply(option_clone, [series_data]);
				break;
			case "line_2axis":
				option_clone = bindDataToLine_2axis(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "line_log":
				//option_clone = bindDataToLine_log(series_data, JSON.parse(JSON.stringify(option_clone)));
				bindDataToLine_log.apply(option_clone, [series_data]);
				break;
			case "bar":
				option_clone = bindDataToBar(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "pie":
				option_clone = bindDataToPie(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "pie_2chart":
				option_clone = bindDataToPie_2Chart(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "gauge":
				option_clone = bindDataToGauge(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "scatter":
				option_clone = bindDataToScatter(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "k":
				option_clone = bindDataToK(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "radar":
				option_clone = bindDataToRader(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "chord":
				option_clone = bindDataToChord(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "funnel":
				option_clone = bindDataToFunnel(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			case "treemap":
				option_clone = bindDataToTreemap(series_data, JSON.parse(JSON.stringify(option_clone)));
				break;
			default :
				break;
		}
		return {
			option : option_clone
		};
		function formatUnit(unit){
			for(var i in units)
			{
				if(unit.toUpperCase() == units[i].unitCode.toUpperCase())
				{
					console.log(units[i].unitName);
					return units[i].unitName;
				}
			}
			return '';
		};
		function bindDataToLine(series_data)
		{
			var ser = []
			var series = series_data.series_v;
			var my_nunit = series_data.unit;
			var legend = series_data.legend_v;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(option_clone.series[0]));
				clone.data = series[i].data;
				clone.name = series[i].name;
				ser.push(clone);
			}
			this.series = ser;
			this.legend.data = legend;
			this.xAxis[0].data = axis[0];
			if(my_nunit != "Amount" && my_nunit != undefined){
				this.yAxis[0].axisLabel = {
					formatter : "{value} " + my_nunit + ""
				};
			}
			else
			{
				this.yAxis[0].axisLabel = {
					formatter : "{value}"
				};
			}
		}
		function bindDataToLine_log(series_data)
		{
			var oPclone = JSON.parse(JSON.stringify(this));
			this.series = [];
			var series = series_data.series_v;
			var my_nunit = formatUnit(series_data.unit);
			var legend = series_data.legend_v;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(oPclone.series[0]));
				clone.data = series[i].data;
				clone.name = series[i].name;
				this.series.push(clone);
			}
			this.legend.data = legend;
			this.xAxis[0].data = axis[0];
		}
		function bindDataToLine_2d(series_data)
		{
			var series = series_data.series;
			for(var i in series)
			{
				this.series[i].data = series[i].data;
			}
			this.legend.data = legend;
		}
		function bindDataToLine_2axis(series_data, option_clone)
		{
			var series = series_data.series_v;
			var legend = series_data.legend_v;
			var axis = series_data.axis;
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series[0].data = series[0].data;
			oPclone.series[0].name = series[0].name;
			oPclone.series[1].data = (function(){
				var oriData = series[1].data;
				var len = oriData.length;
				while(len--) {
					oriData[len] *= -1;
				}
				return oriData;
			})();
			oPclone.series[1].name = series[1].name;
			oPclone.legend.data = legend;
			oPclone.xAxis[0].data = axis[0];
			oPclone.yAxis[0].max = 100;
			oPclone.yAxis[0].name = legend[0];
			delete oPclone.yAxis[1].max;
			oPclone.yAxis[1].name = legend[1];
			oPclone.yAxis[1].axisLabel =  {
				formatter : function(v){
					return  -v;
				}
			};
			return oPclone;
		}
		function bindDataToBar(series_data, option_clone)
		{
			console.log(series_data, option_clone);
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series = [];
			var series = series_data.series;
			var legend = series_data.legend;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(option_clone.series[0]));
				clone.data = series[i].data;
				clone.name = series[i].name;
				oPclone.series.push(clone);
			}
			oPclone.legend.data = legend;
			oPclone.xAxis[0].data = axis[0];
			return oPclone;
		}
		function bindDataToPie(series_data, option_clone)
		{
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series = [];
			var series = series_data.series;
			var legend = series_data.legend;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(option_clone.series[0]));
				clone.data = series[i].data;
				clone.name = series[i].name;
				oPclone.series.push(clone);
			}
			oPclone.legend.data = legend;
			delete oPclone.xAxis;
			return oPclone;
		}
		function bindDataToPie_2Chart(series_data, option_clone)
		{
			console.log(series_data, option_clone)
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			var series = series_data.series;
			oPclone.legend.data = [];
			for(var i in series)
			{
				oPclone.series[i].data = series[i].value;
				if(i == 0){
					oPclone.series[i].itemStyle = {
						normal : {
							label : {
								position : 'inner',
								formatter : function (params) {
									return (params.percent - 0).toFixed(0) + '%'
								},
							},
							labelLine : {
								show : false
							}
						}
					}
				}
				else
				{
					oPclone.series[i].itemStyle = {
						normal : {
							label : {
								formatter : function (params) {
									return (params.percent - 0).toFixed(0) + '%'
								},
							},
							labelLine : {
								show : false
							}
						}
					}
				}
				for(var j in series[i].value)
				{
					oPclone.legend.data.push(series[i].value[j].name);
				}
			}
			delete oPclone.xAxis;
			return oPclone;
		}
		function bindDataToGauge(series_data, option_clone)
		{
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			var series = series_data.series;
			var legend = series_data.legend;
			var axis = series_data.axis;
			for(var i in oPclone.series)
			{
				if(series[0].data[i])
				{
					oPclone.series[0].data[i] = {
						name : series[0].data[i].kpiname,
						value : series[0].data[i].value
					};
				}
			}
			delete oPclone.legend;
			delete oPclone.xAxis;
			console.log(oPclone);
			return oPclone;
		}
		function bindDataToScatter(series_data, option_clone)
		{
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series = [];
			var series = series_data.series;
			var legend = series_data.legend;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(option_clone.series[0]));
				clone.data = series[i].data;
				clone.name = series[i].name;
				oPclone.series.push(clone);
			}
			oPclone.legend.data = legend;
			/*
			 oPclone.dataZoom = {
			 show : true,
			 realtime : true
			 }
			 */
			return oPclone;
		}
		function bindDataToK(series_data, option_clone)
		{
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series = [];
			var series = series_data.series;
			var legend = series_data.legend;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(option_clone.series[0]));
				clone.data = series[i].data;
				clone.name = series[i].name;
				oPclone.series.push(clone);
			}
			oPclone.legend.data = legend;
			oPclone.xAxis[0].data = axis[0];
			/*
			 oPclone.dataZoom = {
			 show : true,
			 realtime : true
			 }
			 */
			return oPclone;
		}
		function bindDataToRader(series_data, option_clone)
		{
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series = [];
			oPclone.series[0] = {};
			oPclone.series[0].type = "radar";
			var series = series_data.series;
			var legend = series_data.legend;
			var polar = series_data.polar;
			var tmp = [];
			for(var i in series[0])
			{

				var clone = JSON.parse(JSON.stringify(option_clone.series[0].data[0]));
				clone.value = series[0][i].data;
				clone.name = series[0][i].name;
				tmp.push(clone);
			}
			oPclone.polar = [];
			oPclone.polar[0] = {};
			oPclone.polar[0].indicator = [];
			for(var j in polar)
			{
				oPclone.polar[0].indicator.push({
					text : polar[j].label,
					max : 100
				})
			}
			oPclone.series[0].data = tmp;
			oPclone.legend.data = legend;
			delete oPclone.xAxis;
			return oPclone;
		}
		function bindDataToChord(series_data, option_clone)
		{
			console.log(series_data, option_clone);
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			var series = series_data.series_a;
			var legend = series_data.legend;
			oPclone.series[0].data = [];
			oPclone.series[0].matrix = [];
			for(var i in series)
			{
				oPclone.series[0].data.push({
					name : series[i].label
				});
				oPclone.series[0].matrix.push(series[i].value);
			}
			oPclone.legend.data = legend;
			delete oPclone.xAxis;
			return oPclone;
		}
		function bindDataToFunnel(series_data, option_clone)
		{
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			var series = series_data.series;
			var legend = series_data.legend_v;
			for(var i in series)
			{
				oPclone.series[i].data = [];
				for(var j in series[i].value)
				{
					oPclone.series[i].data.push({
						name : legend[j],
						value : series[i].value[j]
					});
				}
				oPclone.series[i].name = series[i].name;
			}
			oPclone.legend.data = legend;
			return oPclone;
		}
		function bindDataToTreemap(series_data, option_clone)
		{
			console.log(series_data, option_clone);
			var oPclone = JSON.parse(JSON.stringify(option_clone));
			oPclone.series = [];
			var series = series_data.series;
			var legend = series_data.legend;
			var axis = series_data.axis;
			for(var i in series)
			{
				var clone = JSON.parse(JSON.stringify(option_clone.series[0]));
				var tmp = [];
				for(var j in series[i].data)
				{
					tmp.push({
						name : series[i].data[j].kpiname,
						value : series[i].data[j].value
					})
				}
				clone.data = tmp;
				clone.name = series[i].name;
				oPclone.series.push(clone);
			}
			delete oPclone.legend;
			delete oPclone.xAxis;
			console.log(oPclone);
			return oPclone;
		}
		function linearData_byTime(data){
			var series = [];
			var series_v = [];
			var legend = [];
			var legend_v = [];
			var axis = [];
			for(var i in data)
			{
				(function(records){
					var group = [];
					var xa = [];
					for(var i in records.data){
						(function(record){
							if(record){
								group.push(record.value);
								xa.push(setTimeFormat(record.time, format));
							}
						})(records.data[i]);
					};
					if(group.length){
						axis.push(xa);
						if(nodes.length == 1)
						{
							series.push({
								name : records.label,
								data : group
							});
							series_v.push({
								name : records.label,
								data : group
							});
							legend.push(records.label);
							legend_v.push(records.label);
						}
						else if(kpis.length == 1)
						{
							series.push({
								name : records.cilabel,
								data : group
							});
							series_v.push({
								name : records.cilabel,
								data : group
							});
							legend.push(records.cilabel);
							legend_v.push(records.cilabel);
						}
						else
						{
							series.push({
								name : records.label,
								data : group
							});
							series_v.push({
								name : records.label,
								data : group
							});
							legend.push(records.label);
							legend_v.push(records.label);
						}
					}
				})(data[i])
			}
			return {
				series : series,
				series_v : series_v,
				legend : legend,
				legend_v : legend_v,
				axis : axis,
				unit : data[0] ? formatUnit(data[0].unit) : ''
			};
		}
		function linearData_byCi(data){
			var series = [];
			var legend = [];
			var axis = [];
			axis[0] = [];
			series[0] = {};
			if(data.length > 0)
			{
				series[0].name = data[0].cilabel;
			}
			series[0].data = [];
			for(var i in data)
			{
				if(nodes.length == 1) {
					series[0].data.push({
						name: data[i].kpilabel,
						kpiname: data[i].kpilabel,
						value: data[i].value ? data[i].value : 0
					});
					legend.push(data[i].kpilabel);
					axis[0].push(data[i].kpilabel);
				}
				else if(kpis.length == 1)
				{
					series[0].data.push({
						name: data[i].cilabel,
						kpiname: data[i].cilabel,
						value: data[i].value ? data[i].value : 0
					});
					legend.push(data[i].cilabel);
					axis[0].push(data[i].cilabel);
				}
				else
				{
					series[0].data.push({
						name: data[i].label,
						kpiname: data[i].kpilabel,
						value: data[i].value ? data[i].value : 0
					});
					legend.push(data[i].label);
					axis[0].push(data[i].label);
				}
			}
			return {
				series : series,
				legend : legend,
				axis : axis
			};
		}
		function dimensionalData_byTime(type, data){
			var series = [];
			var legend = [];
			var axis = [];
			for(var i in data)
			{
				var find = false;
				if(type == "ci")
				{
					find = (function(nodeId){
						for(var j in series)
						{
							if(series[j].nodeId == nodeId)
							{
								return series[j];
							}
						}
						return false;
					})(data[i].nodeId);
				}
				else if(type == "kpi")
				{
					find = (function(kpiId){
						for(var j in series)
						{
							if(series[j].kpiId == kpiId)
							{
								return series[j];
							}
						}
						return false;
					})(data[i].kpiId);
				}
				if(find)
				{
					for(var j in find.data)
					{
						if(data[i].data[j])
						{
							find.data[j].push(data[i].data[j].value);
						}
						else
						{
							find.data[j].push(0);
						}

					}

				}
				else
				{
					var group = [];
					var xa = []
					for (var j in data[i].data) {
						group.push([data[i].data[j].value]);
						xa.push(setTimeFormat(data[i].data[j].time, format));
					}
					axis.push(xa);
					series.push({
						nodeId: data[i].nodeId,
						kpiId: data[i].kpiId,
						name: data[i].cilabel,
						data: group
					});
					legend.push(data[i].cilabel);
				}
			}
			return {
				series : series,
				legend : legend,
				axis : axis
			};
		}
		function dimensionalData_byCi(type, data){
			var series = [];
			var series_a = [];
			var legend = [];
			var legend_v = [];
			var polar = [];
			for(var i in data)
			{
				var find = false;
				find = (function(nodeId){
					for(var j in series)
					{
						if(series[j].nodeId == nodeId)
						{
							return {
								series : series[j],
								series_a : series_a[j]
							};
						}
					}
					return false;
				})(data[i].nodeId);
				if(find)
				{
					find.series.value.push({
						name : data[i].label,
						value : data[i].value ? data[i].value : 0
					});
					find.series_a.value.push(data[i].value ? data[i].value : 0);
				}
				else
				{
					var group = [];
					series.push({
						label : data[i].cilabel,
						nodeId : data[i].nodeId,
						kpiId : data[i].kpiId,
						name : data[i].label,
						value : [{
							name : data[i].label,
							value : data[i].value ? data[i].value : 0
						}]
					});
					series_a.push({
						label : data[i].cilabel,
						nodeId : data[i].nodeId,
						kpiId : data[i].kpiId,
						name : data[i].label,
						value : [ data[i].value ? data[i].value : 0 ]
					})
					legend.push(data[i].cilabel);
				}
			}
			for(var i in data)
			{
				var find = false;
				find = (function(kpiId){
					for(var j in polar)
					{
						if(polar[j].kpiId == kpiId)
						{
							return true;
						}
					}
					return false;
				})(data[i].kpiId);
				if(!find)
				{
					polar.push({
						kpiId : data[i].kpiId,
						label : data[i].kpilabel
					});
					legend_v.push(data[i].kpilabel);
				}
			}
			return {
				series : series,
				legend : legend,
				legend_v : legend_v,
				series_a : series_a,
				polar : polar,
			};
		}
		function polarData(type, data){
			var series = [];
			var legend = [];
			var polar = [];
			for(var i in data)
			{
				var find = false;
				find = (function(nodeId){
					for(var j in series[0])
					{
						if(series[0][j].nodeId == nodeId)
						{
							return series[0][j];
						}
					}
					return false;
				})(data[i].nodeId);
				if(find)
				{
					find.data.push(data[i].value ? data[i].value : 0);
				}
				else
				{
					series[0] = series[0] ? series[0] : [];
					series[0].push({
						label : data[i].cilabel,
						nodeId : data[i].nodeId,
						kpiId : data[i].kpiId,
						name : data[i].cilabel,
						data : [data[i].value ? data[i].value : 0]
					});
					legend.push(data[i].cilabel);
				}
			}
			for(var i in data)
			{
				var find = false;
				find = (function(kpiId){
					for(var j in polar)
					{
						if(polar[j].kpiId == kpiId)
						{
							return true;
						}
					}
					return false;
				})(data[i].kpiId);
				if(!find)
				{
					polar.push({
						kpiId : data[i].kpiId,
						label : data[i].kpilabel
					})
				}
			}
			return {
				series : series,
				legend : legend,
				polar : polar,
			};
		}
		function setTimeFormat(time, format){
			var result = '';
			var date = time.split(" ")[0];
			var mytime = time.split(" ")[1]
			var year = date.split("/")[0];
			var month = date.split("/")[1];
			var day = date.split("/")[2];
			var hour = mytime.split(":")[0];
			var minute = mytime.split(":")[1];
			var second = mytime.split(":")[2] ? mytime.split(":")[2] : "00";
			var dateFormat = format.split("-")[0].split("/");
			var timeFormat = format.split("-")[1].split(":");
			for(var i in dateFormat)
			{
				switch(dateFormat[i])
				{
					case "yy":
						result += year + "年";
						break;
					case "mm":
						result += month + "月";
						break;
					case "dd":
						result += day + "日";
						break;
					default:
						break;
				}
			}
			if(dateFormat.length > 1)
			{
				result += ",";
			}
			for(var i in timeFormat)
			{
				switch(timeFormat[i])
				{
					case "hh":
						result += hour > 9 ? hour : "0" + hour;
						break;
					case "mm":
						result += minute > 9 ? minute : "0" + minute;
						break;
					case "ss":
						result += second > 9 ? second : "0" + second;
						break;
					default:
						break;
				}
				if(i < timeFormat.length - 1)
				{
					result += ":";
				}
			}
			return result;
		}
	}
	return optionDataHandler;
});