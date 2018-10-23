define(['../services/services.js'], function(services) {
	'use strict';
	services.factory('chartOptionService', ['$q',
		function(q) {
			var factory = {};
			var _LINECHARTBASE_ = {
				animation : true,
				title : {
					show : true,
					padding : 30,
					text: '草莓大棚温度变化',
					"textStyle": {
						"fontWeight": "bold",
						"fontSize": 16
					},
				},
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:[]
				},
				calculable : true,
				xAxis : {
					type : 'category',
					boundaryGap : true,
					data : ['','','','','','',''],
					"axisLine": {
						"lineStyle": {
							"color": "#b0b0b0",
							"width": 1
						}
					},
					axisLabel : {
						"show": true,
						"textStyle": {}
					},
					splitLine : {
						"lineStyle": {
							"color": "rgb(239, 239, 239)",
							"width": 1
						}
					},
					"axisTick": {
						"show": true,
						"lineStyle": {}
					}
				},
				yAxis : {
					show : true,
					max : 500,
					min : 0,
					type : 'value',
					boundaryGap : false,
					"axisLine": {
						"lineStyle": {
							"color": "#b0b0b0",
							"width": 1
						}
					},
					splitLine : {
						"lineStyle": {
							"color": "rgb(239, 239, 239)",
							"width": 1
						}
					},
					axisLabel : {
						"show": true,
						"textStyle": {}
					},
					"axisTick": {
						"show": true,
						"lineStyle": {}
					}
				},
				series : [
					{
						name:'数据',
						type:'line',
						data: [],
						boundaryGap: [0.2, 0.2],
						itemStyle: {

						},
						lineStyle: {

						},
						areaStyle: {

						}
					}
				]
			};
			var _PIECHARTBASE_ = {
				title : {
					text: '新建饼图',
					subtext: '纯属虚构',
					x:'center'
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient : 'vertical',
					x : 'left',
					data:['提花机A－产量','提花机B－产量','提花机C－产量','提花机D－产量','提花机E－产量']
				},
				calculable : true,
				series : [
					{
						name:'访问来源',
						type:'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:[
							{value:335, name:'提花机A－产量'},
							{value:310, name:'提花机B－产量'},
							{value:234, name:'提花机C－产量'},
							{value:135, name:'提花机D－产量'},
							{value:1548, name:'提花机E－产量'}
						]
					}
				]
			};
			var _MAPCHART_ = {
				backgroundColor: '#404a59',
				title: {
					text: '',
					subtext: '',
					sublink: '',
					left: 'center',
					textStyle: {
						color: '#fff'
					}
				},
				tooltip: {
					trigger: 'item',
					formatter:function(obj) {
						return obj.seriesName+':'+obj.value[2];
					}
				},
				bmap: {
					center: [104.114129, 37.550339],
					zoom: 5,
					roam: true,
					mapStyle: {
						styleJson: []
					}
				},
				series: [{
					name: '运行设备数',
					type: 'scatter',
					coordinateSystem: 'bmap',
					data: [],
					symbolSize: function(val) {
						var value;
						if(val){
							value =  val[2] * .2;
						}
						else
						{
							value =  0
						}
						return 10 + value > 20 ? 20 : 10 + value;
					},
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: false
						},
						emphasis: {
							show: true
						}
					},
					itemStyle: {
						normal: {
							color: '#ddb926'
						}
					}
				}, {
					name: '运行设备数',
					type: 'effectScatter',
					coordinateSystem: 'bmap',
					data: [],
					symbolSize: function(val) {
						var value;
						if(val){
							value =  val[2] * .2;
						}
						else
						{
							value =  0
						}
						return 10 + value > 20 ? 20 : 10 + value;
					},
					showEffectOn: 'render',
					rippleEffect: {
						brushType: 'stroke'
					},
					hoverAnimation: true,
					label: {
						normal: {
							formatter: '{b}',
							position: 'right',
							show: true
						}
					},
					itemStyle: {
						normal: {
							color: '#f4e925',
							shadowBlur: 10,
							shadowColor: '#333'
						}
					},
					zlevel: 1
				}]
			};
			var _SCATTERCHART_ = {
				title : {
					text: '某设备平均转速／作业温度散点分布',
					subtext: '温度，湿度'
				},
				tooltip : {
					trigger: 'axis',
					showDelay : 0,
					axisPointer:{
						show: true,
						type : 'cross',
						lineStyle: {
							type : 'dashed',
							width : 1
						}
					}
				},
				legend: {
					data:['设备A','设备B']
				},
				xAxis : [
					{
						type : 'value',
						scale:true,
						axisLabel : {
							formatter: '{value}'
						},
						show : true,
						axisLine : {
							lineStyle: {
								color: '#ccc'
							}
						}
					}
				],
				yAxis : [
					{
						type : 'value',
						scale:true,
						axisLabel : {
							formatter: '{value}'
						},
						show : true,
						axisLine : {
							lineStyle: {
								color: '#ccc'
							}
						}
					}
				],
				series : [
					{
						name:'设备A',
						type:'scatter',
						data: [],
						symbolSize : function(val, asd){
							var rs = val[0] * .5
							if(rs > 8)
							{
								return 8
							}
							else if(rs < 2)
							{
								return 2
							}
							else
							{
								return rs;
							}
						},
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							lineStyle: {
								normal: {
									type: 'solid',
									color: '#333',
									width : 2
								}
							},
							data : [
								{ yAxis: 5 },
								{ xAxis: 50 }
							]
						}
					},
					{
						name:'设备B',
						type:'scatter',
						data: [],
						markPoint : {
							data : [
								{type : 'max', name: '最大值'},
								{type : 'min', name: '最小值'}
							]
						},
						markLine : {
							data : [
								{type : 'average', name: '平均值'}
							]
						}
					}
				]
			};
			var _BARCHARTBASE_ = {
				legend: {
					data: []
				},
				title: {
					text: '提花机产量',
					subtext: '',
					sublink: '',
					left: 'left',
					textStyle: {
						color: '#000'
					}
				},
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {

				},
				xAxis : [
					{
						type : 'category',
						interval : 0,
						data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					}
				],
				yAxis: [
					{
						type: 'value',
						min: 0,
						max: 250,
						axisLabel: {
							formatter: '{value}'
						}
					}
				],
				series : [
					{
						name:'数据',
						type:'bar',
						data:[10, 52, 200, 334, 390, 330, 220]
					}
				]
			};
			var _RADARCHARTBASE_ = {
				title : {
					text: '某工业企业生产数据统计',
					subtext: ''
				},
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					orient : 'vertical',
					x : 'right',
					y : 'bottom',
					data:['预计产量','实际产量']
				},
				polar : [
					{
						indicator : [
							{ text: '产品A产量', max: 6000},
							{ text: '产品B产量', max: 16000},
							{ text: '产品C产量', max: 30000},
							{ text: '产品D产量', max: 38000},
							{ text: '产品E产量', max: 52000},
							{ text: '产品F产量', max: 25000}
						]
					}
				],
				calculable : true,
				series : [
					{
						name: '计划 vs 实际',
						type: 'radar',
						data : [
							{
								value : [4300, 10000, 28000, 35000, 50000, 19000],
								name : '预计产量'
							},
							{
								value : [5000, 14000, 28000, 31000, 42000, 21000],
								name : '实际产量'
							}
						]
					}
				]
			};
			var _GAUGECHARTBASE_ = {
				tooltip : {
					formatter: "{a} <br/>{c} {b}"
				},
				series : [
					{
						name: '速度',
						type: 'gauge',
						z: 3,
						min: 0,
						max: 220,
						radius: '80%',
						axisLine: {            // 坐标轴线
							lineStyle: {       // 属性lineStyle控制线条样式
								width: 10
							}
						},
						axisTick: {            // 坐标轴小标记
							length: 15,        // 属性length控制线长
							lineStyle: {       // 属性lineStyle控制线条样式
								color: 'auto'
							}
						},
						splitLine: {           // 分隔线
							length: 20,         // 属性length控制线长
							lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
								color: 'auto'
							}
						},
						title : {
							textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
								fontWeight: 'bolder',
								fontSize: 20,
								fontStyle: 'italic'
							}
						},
						detail : {
							textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
								fontWeight: 'bolder'
							}
						},
						data:[{value: 40, name: 'km/h'}]
					}
				]
			};
			var _FUNNELCHARTBASE_ = {
				title: {
					text: '漏斗图',
					subtext: '纯属虚构'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c}%"
				},
				toolbox: {
					feature: {
						dataView: {readOnly: false},
						restore: {},
						saveAsImage: {}
					}
				},
				legend: {
					data: ['展现','点击','访问','咨询','订单']
				},
				calculable: true,
				series: [
					{
						name:'漏斗图',
						type:'funnel',
						left: '10%',
						top: 60,
						//x2: 80,
						bottom: 60,
						width: '80%',
						// height: {totalHeight} - y - y2,
						min: 0,
						max: 100,
						minSize: '0%',
						maxSize: '100%',
						sort: 'descending',
						gap: 2,
						label: {
							normal: {
								show: true,
								position: 'inside'
							},
							emphasis: {
								textStyle: {
									fontSize: 20
								}
							}
						},
						labelLine: {
							normal: {
								length: 10,
								lineStyle: {
									width: 1,
									type: 'solid'
								}
							}
						},
						itemStyle: {
							normal: {
								borderColor: '#fff',
								borderWidth: 1
							}
						},
						data: [
							{value: 60, name: '访问'},
							{value: 40, name: '咨询'},
							{value: 20, name: '订单'},
							{value: 80, name: '点击'},
							{value: 100, name: '展现'}
						]
					}
				]
			};
			var _VENNCHARTBASE_ = {
				title : {
					text: '访问 vs 咨询',
					subtext: '各个数据的集合'
				},
				tooltip : {
					trigger: 'item',
					formatter: "{b}: {c}"
				},
				toolbox: {
					show : true,
					feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : false,
				series : [
					{
						name:'韦恩图',
						type:'venn',
						itemStyle: {
							normal: {
								label: {
									show: true,
									textStyle: {
										fontFamily: 'Arial, Verdana, sans-serif',
										fontSize: 16,
										fontStyle: 'italic',
										fontWeight: 'bolder'
									}
								},
								labelLine: {
									show: false,
									length: 10,
									lineStyle: {
										// color: 各异,
										width: 1,
										type: 'solid'
									}
								}
							},
							emphasis: {
								color: '#cc99cc',
								borderWidth: 3,
								borderColor: '#996699'
							}
						},
						data:[
							{value:100, name:'访问'},
							{value:50, name:'咨询'},
							{value:20, name:'公共'}
						]
					}
				]
			};
			var _RESTANGLECHARTBASE_ = {
				title : {
					text: '手机占有率',
						subtext: '虚构数据'
				},
				tooltip : {
					trigger: 'item',
						formatter: "{b}: {c}"
				},
				toolbox: {
					show : true,
						feature : {
						mark : {show: true},
						dataView : {show: true, readOnly: false},
						restore : {show: true},
						saveAsImage : {show: true}
					}
				},
				calculable : false,
					series : [
					{
						name:'矩形图',
						type:'treemap',
						itemStyle: {
							normal: {
								label: {
									show: true,
									formatter: "{b}"
								},
								borderWidth: 1
							},
							emphasis: {
								label: {
									show: true
								}
							}
						},
						data:[
							{
								name: '三星',
								value: 6
							},
							{
								name: '小米',
								value: 4
							},
							{
								name: '苹果',
								value: 4
							},
							{
								name: '华为',
								value: 2
							},
							{
								name: '联想',
								value: 2
							},
							{
								name: '魅族',
								value: 1
							},
							{
								name: '中兴',
								value: 1
							}
						]
					}
				]
			};
			var _KCHART_ = {
				title : {
					text: '某设备温度曲线'
				},
				legend: {
					data:['设备温度']
				},
				dataZoom : {
					show : true,
					realtime: true,
					start : 50,
					end : 100
				},
				xAxis : [
					{
						type : 'category',
						boundaryGap : true,
						axisTick: {onGap:false},
						splitLine: {show:false},
						data : []
					}
				],
				yAxis : [
					{
						type : 'value',
						scale:true,
						boundaryGap: [0.01, 0.01]
					}
				],
				series : [
					{
						name:'温度',
						type:'k',
						data:[ ]
					}
				]
			};

			/* initalize a linechart*/
			/* var mychart = new factory.chart(data)*/
			factory.chart = chart;
			factory.chart.prototype.axisReverse = axisReverse;
			factory.chart.prototype.setxAxis = setxAxis;
			factory.chart.prototype.getxAxis = getxAxis;
			factory.chart.prototype.setxAxisArr = setxAxisArr;
			factory.chart.prototype.setTitle = setTitle;
			factory.chart.prototype.setyAxis = setyAxis;
			factory.chart.prototype.setyAxisArr = setyAxisArr;
			factory.chart.prototype.setLegend = setLegend;
			factory.chart.prototype.setLegendByCiKpi = setLegendByCiKpi;
			factory.chart.prototype.setSeries = setSeries;
			factory.chart.prototype.setSeriesByCiKpi = setSeriesByCiKpi;
			factory.chart.prototype.setSeriesWithNameByCiKpi = setSeriesWithNameByCiKpi;
			factory.chart.prototype.setColor = setColor;
			factory.chart.prototype.returnOption = returnOption;
			factory.chart.prototype.simulate = simulate;
			factory.chart.prototype.setLegendformat = setLegendformat;
			factory.chart.prototype.setTimeformat = setTimeformat;
			factory.chart.prototype.timeformat = "年月日时分";
			factory.chart.prototype.legendFormat = "{ci} + '-' + {kpi}";
			factory.chart.prototype.setBaseOption = setBaseOption;
			factory.chart.prototype.setGrid = setGrid;
			factory.chart.prototype.setBoundaryGap = setBoundaryGap;
			for(var i in factory.chart.prototype)
			{
				Object.defineProperty(factory.chart.prototype, i, {
					enumerable : false
				})
			}
			/* inherit linechart from chart*/
			/* var mylinechart = new factory.linechart()*/
			factory.linechart = linechart;
			factory.linechart.prototype = Object.create(factory.chart.prototype, {});
			factory.linechart.prototype.baseOption = _LINECHARTBASE_.$clone();
			/* inherit piechart from chart*/
			/* var mylinechart = new factory.piechart()*/
			factory.piechart = piechart;
			factory.piechart.prototype = Object.create(factory.chart.prototype, {});
			factory.piechart.prototype.baseOption = _PIECHARTBASE_.$clone();
			/* inherit piechart from chart*/
			/* var mylinechart = new factory.piechart()*/
			factory.mapchart = mapchart;
			factory.mapchart.prototype = Object.create(factory.chart.prototype, {});
			factory.mapchart.prototype.baseOption = _MAPCHART_.$clone();
			/* inherit barchart from chart */
			/* var mybarchart = new factory.barchart() */
			factory.barchart = barchart;
			factory.barchart.prototype = Object.create(factory.chart.prototype, {});
			factory.barchart.prototype.baseOption = _BARCHARTBASE_.$clone();
			/* inherit radarchart from chart */
			/* var myradarchart = new factory.radarchart() */
			factory.radarchart = radarchart;
			factory.radarchart.prototype = Object.create(factory.chart.prototype, {});
			factory.radarchart.prototype.baseOption = _RADARCHARTBASE_.$clone();
			factory.radarchart.prototype.setPolar = setPolar;
			/* inherit dashboardchart from chart */
			/* var mydashboardchart = new factory.dashboardchart() */
			factory.gaugechart = gaugechart;
			factory.gaugechart.prototype = Object.create(factory.chart.prototype, {});
			factory.gaugechart.prototype.baseOption = _GAUGECHARTBASE_.$clone();
			/* inherit funnelchart from chart */
			/* var myfunnelchart = new factory.funnelchart() */
			factory.funnelchart = funnelchart;
			factory.funnelchart.prototype = Object.create(factory.chart.prototype, {});
			factory.funnelchart.prototype.baseOption = _FUNNELCHARTBASE_.$clone();
			/* inherit vennchart from chart */
			/* var myvennchart = new factory.vennchart() */
			factory.vennchart = vennchart;
			factory.vennchart.prototype = Object.create(factory.chart.prototype, {});
			factory.vennchart.prototype.baseOption = _VENNCHARTBASE_.$clone();
			/* inherit restangle from chart */
			/* var myrestanglechart = new factory.restanglechart() */
			factory.restanglechart = restanglechart;
			factory.restanglechart.prototype = Object.create(factory.chart.prototype, {});
			factory.restanglechart.prototype.baseOption = _RESTANGLECHARTBASE_.$clone();
			/* inherit scatter from chart */
			/* var myscatterchart = new factory.myscatterchart() */
			factory.scatterchart = scatterchart;
			factory.scatterchart.prototype = Object.create(factory.chart.prototype, {});
			factory.scatterchart.prototype.baseOption = _SCATTERCHART_.$clone();
			/* inherit scatter from chart */
			/* var myscatterchart = new factory.myscatterchart() */
			factory.kchart = kchart;
			factory.kchart.prototype = Object.create(factory.chart.prototype, {});
			factory.kchart.prototype.baseOption = _KCHART_.$clone();

			for(var i in factory.linechart.prototype)
			{
				Object.defineProperty(factory.linechart.prototype, i, {
					enumerable : false
				});
			}
			for(var i in factory.piechart.prototype)
			{
				Object.defineProperty(factory.piechart.prototype, i, {
					enumerable : false
				});
			}
			for(var i in factory.mapchart.prototype)
			{
				Object.defineProperty(factory.mapchart.prototype, i, {
					enumerable : false
				});
			}
			for(var i in factory.scatterchart.prototype)
			{
				Object.defineProperty(factory.scatterchart.prototype, i, {
					enumerable : false
				});
			}
			function scatterchart()
			{
				chart.call(this, _SCATTERCHART_);
			}
			function kchart()
			{
				chart.call(this, _KCHART_);
			}
			function linechart()
			{
				chart.call(this, _LINECHARTBASE_);
			}
			function barchart()
			{
				chart.call(this, _BARCHARTBASE_);
			}
			function radarchart()
			{
				chart.call(this, _RADARCHARTBASE_);
			}
			function gaugechart()
			{
				chart.call(this, _GAUGECHARTBASE_);
			}
			function funnelchart()
			{
				chart.call(this, _FUNNELCHARTBASE_);
			}
			function vennchart()
			{
				chart.call(this, _VENNCHARTBASE_);
			}
			function restanglechart()
			{
				chart.call(this, _RESTANGLECHARTBASE_);
			}
			function mapchart()
			{
				chart.call(this, _MAPCHART_);
			}
			function setTitle(data)
			{
				this.title.$extension(data);
			}
			function piechart()
			{
				chart.call(this, _PIECHARTBASE_);
			}
			function chart(data)
			{
				if(typeof data == "object"){
					this.$clone(data);
				}
			}
			function setGrid(data)
			{
				var grid = {
					grid : {}
				};
				grid.grid.$extension(data);
				this.$extension(grid);
			}
			function setBoundaryGap(value)
			{
				this.boundaryGap = value;
			}
			function axisReverse()
			{
				var tmpX = this.xAxis.$clone();
				var tmpY = this.yAxis.$clone();
				this.xAxis = tmpY;
				this.yAxis = tmpX;
			}
			function setBaseOption(baseOption)
			{
				this.baseOption = baseOption;
				Object.defineProperty(this, 'baseOption', {
					enumerable : false
				});
			}
			function setPolar(data)
			{
				var cur = this;
				this.polar = [{
					indicator : data
				}];
			}
			function setyAxis(data)
			{
				var cur = this;
				if(cur.yAxis)
				{
					if(cur.yAxis.axisLabel)
					{
						cur.yAxis.axisLabel.show = data.show;
					}
					else
					{
						cur.yAxis.axisLabel = {
							show : data.show
						}
					}
				}
				else
				{
					cur.yAxis = {
						axisLabel : {}
					}
				}
				if(data.type){
					cur.yAxis.type = data.type;
				}
				if(data.name){
					cur.yAxis.name = data.name;
				}
				if(data.type == 'log')
				{
					delete cur.yAxis.min;
					delete cur.yAxis.max;
				}
				else
				{
					if(data.max != 'auto'){
						cur.yAxis.max = data.max;
					}else{
						delete cur.yAxis.max;
					}
					if(data.min != 'auto'){
						cur.yAxis.min = data.min;
					}else{
						delete cur.yAxis.min;
					}
				}
			};
			function setyAxisArr(data)
			{
				var cur = this;
				if(cur.yAxis[0])
				{
					if(cur.yAxis[0].axisLabel)
					{
						cur.yAxis[0].axisLabel.show = data.show;
					}
					else
					{
						cur.yAxis[0].axisLabel = {
							show : data.show
						}
					}
				}
				else
				{
					cur.xAxis[0] = {
						axisLabel : {}
					}
				}
				if(data.max != 'auto'){
					cur.yAxis[0].max = data.max;
				}else{
					delete cur.yAxis[0].max;
				}
				if(data.min != 'auto'){
					cur.yAxis[0].min = data.min;
				}else{
					delete cur.yAxis[0].min;
				}
			};
			function setxAxis(data, isTimeformart)
			{
				var cur = this;
				if(cur.xAxis == undefined)
				{
					cur.xAxis = {};
				}
				cur.xAxis.$extension({
					name : data.name,
					axisLabel : {
						show : data.show
					},
					boundaryGap : data.boundaryGap
				});
				if(data.data.length > 0)
				{
					cur.xAxis.data = data.data.map(function(element){
						if(isTimeformart == false)
						{
							return element;
						}
						else
						{
							var date = new Date(element);
							return $formatDate(date, cur.timeformat);
						}
					});
				}
				else
				{
					cur.xAxis.data = ['-','-','-','-','-','-','-'];
				}
			};
			function getxAxis()
			{
				return this.xAxis.data;
			}
			function setxAxisArr(data)
			{
				var cur = this;
				if(cur.xAxis[0])
				{
					if(cur.xAxis[0].axisLabel)
					{
						cur.xAxis[0].axisLabel.show = data.show;
					}
					else
					{
						cur.xAxis[0].axisLabel = {
							show : data.show
						}
					}
				}
				else
				{
					cur.xAxis[0] = {
						axisLabel : {}
					}
				}

				if(data.data.length > 0)
				{
					if(typeof data.formatter == 'function')
					{
						if(cur.xAxis[0].axisLabel)
						{
							cur.xAxis[0].axisLabel.formatter = data.formatter;
						}
						else
						{
							cur.xAxis[0].axisLabel = {
								formatter : data.formatter
							}
						}
					}
					if(data.format == 'string')
					{
						cur.xAxis[0].data = data.data;
					}
					else
					{
						cur.xAxis[0].data = data.data.map(function(element){
							var date = new Date(element);
							return $formatDate(date, cur.timeformat);
						});
					}
				}
				else
				{
					cur.xAxis[0].data = ['-','-','-','-','-','-','-'];
				}
			};
			function setTimeformat(str)
			{
				this.timeformat = str;
			}
			function setLegend(data)
			{
				var cur = this;
				this.legend.data = data
			};
			function setLegendByCiKpi(data)
			{
				var cur = this;
				this.legend.data = data.map(function(element){
					return runFormula.call(cur, element);
				});
			};
			function setLegendformat( str ){
				this.legendFormat = str;
			}
			function runFormula(element){
				var result = [];
				var ci = element.ci;
				var kpi = element.kpi;
				var format = this.legendFormat;
				format = format.replace("{kpi}", "'" + (kpi || "") + "'");
				format = format.replace("{ci}", "'" + (ci || "") + "'");
				return eval(format);
			}
			function setSeries(data)
			{
				var cur = this;
				cur.series = [];
				if(data.length > 0)
				{
					for(var i in data)
					{
						var clone = cur.baseOption.series[0].$clone();
						if(data[i].data.length > 0)
						{
							clone.$extension(data[i])
						}
						else
						{
							clone.$extension(data[i].$clone())
							clone.$extension({
								name : "-",
								data : [{
									name : "-",
									value : "0"
								}]
							});
						}
						cur.series.push(clone)
					}
				}
				else
				{
					var clone = cur.baseOption.series[0].$clone();
					clone.name = '设备，指标';
					clone.data = [0, 0, 0, 0, 0, 0, 0];
					cur.series = [clone];
				}
			};
			function setSeriesByCiKpi(data)
			{
				var cur = this;
				cur.series = [];
				if(data.length > 0){
					for(var i in data)
					{
						var clone = cur.baseOption.series[0].$clone();
						clone.$extension(data[i].$clone());
						clone.$extension({
							name : runFormula.call(cur, data[i].name),
							data : data[i].data
						})
						cur.series.push(clone)
					}
				}else{
					var clone = cur.baseOption.series[0].$clone();
					cur.series = [clone.$extension({
						name : {
							ci : '设备',
							kpi : '指标'
						},
						data : [0, 0, 0, 0, 0, 0, 0]
					})];
				}
			};
			function setSeriesWithNameByCiKpi(data)
			{
				var cur = this;
				cur.series = [];
				for(var i in data)
				{
					var clone = cur.baseOption.series[0].$clone();
					clone.$extension(data[i].$clone());
					clone.$extension({
						name : runFormula.call(cur, data[i].name),
						data : data[i].data.map(function(elem){
							elem.name = runFormula.call(cur, elem.name);
							elem.value = elem.value;
							return elem;
						})
					});
					if(clone.data.length == 0)
					{
						clone.data = [{
							name : clone.name,
							value : 0
						}];
					}
					cur.series.push(clone)
				}
			};
			function simulate()
			{
				var cur = this, result = [];
				for(var i = 0; i < 7; i++){
					result.push(parseInt(Math.random() * 30));
				}
				cur.series[0].data = result;
			}
			function setColor(color)
			{
				var cur = this;
				for(var i in cur.series)
				{
					if(cur.series[i])
					{
						if(color)
						{
							cur.series[i].itemStyle = {
								normal : {
									color : color
								}
							};
							cur.series[i].lineStyle = {
								normal : {
									color : color
								}
							};
							cur.series[i].areaStyle = {
								normal : {
									color : color
								}
							};
						}
						else
						{
							cur.series[i].itemStyle = {};
							cur.series[i].lineStyle = {};
							cur.series[i].areaStyle = {};
						}
					}
				}
			}
			function returnOption() {
				return this.$clone();
			}
			return factory;
		}
	]);
});