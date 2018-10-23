define(['../services/services.js'], function(services){
	'use strict';
	services.factory("tgmain", tgmainService);
	tgmainService.$inject = ['$q', 'userLoginUIService','$rootScope', 'resourceUIService', 'kpiDataService', 'viewFlexService', '$window', '$location', 'SwSocket'];
	function tgmainService(q, userLoginUIService, rootScope, resourceUIService, kpiDataService, viewFlexService, window, location, SwSocket){
		var uuid, factory = {}, showCam = false, simulateAlert = false, kpiDes = {}, nodeDes = {}, directives = {};
		factory.ifSimulateAlert =function(){
			return simulateAlert;
		};
		factory.ipcam = {};
		factory.health = {

		};
		factory.camClick = function(){
			if(factory.ipcam.openCam){
				factory.ipcam.openCam();
			}
			showCam = true;
		};
		factory.closeCam = function(){
			if(factory.ipcam.closeCam){
				factory.ipcam.closeCam();
			}
			showCam = false;
		};
		factory.showCam = function(){
			return showCam;
		};
		factory.blinks = [{
			id : $randomString(32),
			width : 13,
			height : 20,
			left : 44.7,
			top :7.8,
			background : 'url(../img/tongji/tank1_red.png)'
		},{
			id : $randomString(32),
			width : 9,
			height : 20,
			left : 66.9,
			top : 19.5,
			background : 'url(../img/tongji/tank2_red.png)'
		}];
		factory.marks = [{
			id : $randomString(32),
			width : 1.3,
			left : 50.7,
			top : 25.6,
			value : 100
		},{
			id : $randomString(32),
			width : 1.3,
			left : 70.2,
			top : 34.4,
			value : 100
		}];
		factory.rotates = [{
			id : $randomString(32),
			top : 52,
			left : 43,
			value : 10,
			getValue : getValue
		},{
			id : $randomString(32),
			top : 50,
			left : 46,
			value : 20,
			getValue : getValue
		}];
		factory.bars = [{
			id : $randomString(32),
			width : 1.3,
			height : 7.2,
			left : 50.7,
			top : 26,
			value : 40,
			getValue : getValue,
			webSocketBack : webSocketBack
		},{
			id : $randomString(32),
			width : 1.3,
			height : 7.2,
			left : 70.2,
			top : 34.7,
			value : 50,
			getValue : getValue,
			webSocketBack : webSocketBack
		}];
		factory.fullbars = [{
			id : $randomString(32),
			width : 1.3,
			height : 7.2,
			left : 50.7,
			top : 26,
			value : 100
		},{
			id : $randomString(32),
			width : 1.3,
			height : 7.2,
			left : 70.2,
			top : 34.7,
			value : 100
		}];
		factory.barsOuters = [{
			id : $randomString(32),
			width : 3,
			height : 7.7,
			left : 49.9,
			top : 26.3,
			value : 100
		},{
			id : $randomString(32),
			width : 3,
			height : 8,
			left : 69.4,
			top : 35.1,
			value : 100
		}];
		factory.charts = [{
			min : 0,
			max : 100,
			tg_labal : '混合罐子V102液位曲线',
			color : "#d99a37",
		},{
			min : 0,
			max : 120,
			tg_labal : '混合罐子V103液位曲线',
			color : "#c25262",
		},{
			min : 0,
			max : 20,
			tg_labal : '压力变送器PT101变化曲线',
			color : "#39a4d9",
		},{
			min : 0,
			max : 100,
			tg_labal : '压力变送器PT201变化曲线',
			color : "#d97c39",
		},{
			min : 0,
			max : 100,
			tg_labal : '孔板流量计FT101变化曲线',
			color : "#4ccbb4",
		}];
		rootScope.$on("$destroy", function() {
			SwSocket.unregister(uuid);
		});
		for(var i in factory.charts){
			(function(){
				this.id = $randomString(32);
				this.getOption = getOption;
				this.webSocketBack = webSocketBackChart;
			}).call(factory.charts[i])
		}
		factory.controllPanel = [{
			tg_labal : '调节阀门FV101',
			onSlide : function(value){
				factory.rotates[0].value = parseInt(value);
				if(factory.rotates[0].highLight){
					factory.rotates[0].highLight();
				}
				this.value = value;
			},
			onChange : function(value){
				factory.rotates[0].value = parseInt(value);
				if(factory.rotates[0].highLight){
					factory.rotates[0].highLight();
				}
				this.value = value;
				if(this.sendDeviceDirective){
					this.sendDeviceDirective(value);
				}

			}
		},{
			tg_labal : '调节阀门FV201',
			onSlide : function(value){
				factory.rotates[1].value = parseInt(value);
				if(factory.rotates[1].highLight){
					factory.rotates[1].highLight();
				}
				this.value = value;
			},
			onChange : function(value){
				factory.rotates[1].value = parseInt(value);
				if(factory.rotates[1].highLight){
					factory.rotates[1].highLight();
				}
				this.value = value;
				if(this.sendDeviceDirective) {
					this.sendDeviceDirective(value);
				}
			}
		},{
			tg_labal : '变频器U201',
			onSlide : function(value){
				this.value = value;
			},
			onChange : function(value){
				this.value = value;
				if(this.sendDeviceDirective) {
					this.sendDeviceDirective(value);
				}
			}
		},{
			tg_labal : '调压模块GZ201',
			onSlide : function(value){
				this.value = value;
			},
			onChange : function(value){
				this.value = value;
				if(this.sendDeviceDirective) {
					this.sendDeviceDirective(value);
				}
			},
		}];
		for(var i in factory.controllPanel){
			(function(){
				this.value = 50;
				this.getTitle = getTitle;
				this.getValue = getValue;
				this.webSocketBack = function(value){
					var cur = this;
					rootScope.$apply(function(){
						//cur.value = parseFloat(value);
					});
				}
			}).call(factory.controllPanel[i])
		}
		factory.marks[0].value = 50;
		factory.marks[1].value = 50;
		factory.toggles = [{
			tg_labal : '原料泵P101',
		},{
			tg_labal : '原料泵P201',
		},{
			tg_labal : '变频泵P301',
		}];
		for(var i in factory.toggles){
			(function(){
				this.getBoolean = getBoolean;
				this.onChange = boolChange;
				this.webSocketBack = webSocketBackToggle;
			}).call(factory.toggles[i])
		}
		function boolChange(value){
			this.value = value;
			if(this.sendDeviceDirectiveBoolean){
				this.sendDeviceDirectiveBoolean(value);
			}
		};
		function getTitle(ci){
			var nodeName, cur=this;
			getResourceById(ci).then(function(event){
				nodeName = event.label
				//cur.title = nodeName;
			});
		};
		function webSocketBackToggle(value)
		{
			var cur = this;
			rootScope.$apply(function(){
				cur.value = parseInt(value) == 1 ? true : false;
			});
		};
		function webSocketBack(value){
			var cur = this;
			rootScope.$apply(function(){
				cur.value = value;
			});
		};
		function webSocketBackChart(value, time){
			var cur = this;
			rootScope.$apply(function(){
				if(cur.pushData)
				{
					cur.pushData(value, time);
				}
			});
		};
		function getValue(ci, kpi){
			var nodeName, kpiName, cur=this;
			getValueList([ci], [kpi], 'ci', 0).then(function(arr){
				if(arr.length){
					cur.dataType="real";
					if(cur.setValue)
					{
						cur.setValue(arr[0].value);
					}
					else
					{
						cur.value = arr[0].value
					}
					getResourceById(ci).then(function(event){
						nodeName = event.label
						getKpisByKpiIds(kpi).then(function(event){
							kpiName = event.label;
							//cur.title = nodeName;
						});
					});
				}
				else
				{
					cur.dataType="virtual";
					if(cur.setValue)
					{
						cur.setValue(parseInt(Math.random() * 100));
					}
					else
					{
						cur.value = parseInt(Math.random() * 100)
					}
					getResourceById(ci).then(function(event){
						nodeName = event.label
						getKpisByKpiIds(kpi).then(function(event){
							kpiName = event.label;
							//cur.title = nodeName + "(模拟数据)";
						});
					});
				}
			});
		};
		function getBoolean(ci, kpi){
			var nodeName, kpiName, cur=this;
			getValueList([ci], [kpi], 'ci', 0).then(function(arr){
				if(arr.length){
					cur.dataType = "real";
					if(cur.setValue)
					{
						cur.setValue(arr[0].value);
					}
					else
					{
						cur.value = arr[0].value;
					}
					getResourceById(ci).then(function(event){
						nodeName = event.label
						getKpisByKpiIds(kpi).then(function(event){
							kpiName = event.label;
							cur.title = nodeName;
						});
					});
				}
				else
				{
					cur.dataType = "virtual";
					if(cur.setValue)
					{
						cur.setValue(Math.round(Math.random()) == 1 ? true : false);
					}
					else
					{
						cur.value = Math.round(Math.random()) == 1 ? true : false;
					}
					getResourceById(ci).then(function(event){
						nodeName = event.label
						getKpisByKpiIds(kpi).then(function(event){
							kpiName = event.label;
							cur.title = nodeName + "(模拟数据)";
						});
					});
				}
			});
		};
		factory.blinkClick = function(){
			simulateAlert = !simulateAlert;
			if(simulateAlert){
				for(var i in factory.blinks){
					factory.blinks[i].startBlink();
				}
				factory.health.startBlink();
			}
			else
			{
				for(var i in factory.blinks){
					factory.blinks[i].stopBlink();
				}
				factory.health.stopBlink();
			}
		};
		factory.orderHandlerClick = function(){
			window.open('index.html#/workorder','_self');
		};
		factory.overviewClick = function(){
			window.open('index.html','_self');
		};
		factory.equipmentClick = function(){
			window.open('index.html#/emcsView','_self');
		};
		factory.malfunctionClick = function(){
			window.open('index.html#/configAlert','_self');
		};
		factory.chartClick = function(){
			window.open('index.html#/designView','_self');
		};
		viewFlexService.getAllMyViews(function(event){
			var content;
			var views = new $Array(event.data);
			var find = views.find("viewType", "tongji");
			if(find)
			{
				try
				{
					if(find.content)
					{
						content = JSON.parse(find.content);
						var controllPanel = content.controllPanel;
						var toggles = content.toggles;
						var charts = content.charts;
						var nodes = [];
						var kpis = [];
						for(var i = 0; i < 2; i++)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								factory.rotates[index].title = cp.title;
								factory.rotates[index].getValue(ci, kpi);
							})(i, controllPanel[i])
						}
						for(var i = 0; i < 2; i++)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								factory.bars[index].title = cp.title;
								factory.bars[index].getValue(ci, kpi);
							})(i, charts[i])
						}
						for(var i in controllPanel)
						{
							(function(index, cp){
								var kpi = cp.kpi;
								var ci = cp.node;
								if(nodes.indexOf(ci) == -1)
								{
									nodes.push(ci);
								}
								if(kpis.indexOf(kpi) == -1)
								{
									kpis.push(kpi);
								}
								factory.controllPanel[index].title = cp.title;
								factory.controllPanel[index].getValue(ci, kpi);
								getResourceById(ci).then(function success(event){
									try{
										if(event){
											var modelId = event.modelId;
											getDirectivesByModelId(modelId).then(function success(event){
												try{
													if(event){
														var comId = event[0].id;
														var nodeId = ci;
														factory.controllPanel[index].sendDeviceDirective = function(value){
															resourceUIService.sendDeviceDirective(nodeId, comId, { value : value }, function(event){
															});
														}
													}else{
														throw "event.data is undefined!!"
													}
												}catch(err){
													console.log(err);
												}
											}, function error(err){
												console.log(err);
											})
										}else{
											throw "event.data is undefined!!"
										}
									}catch(err){
										console.log(err);
									}
								}, function error(err){
									console.log(err);
								});
								factory.controllPanel[index].getTitle(ci);
							})(i, controllPanel[i])
						}
						for(var i in toggles)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								if(nodes.indexOf(ci) == -1)
								{
									nodes.push(ci);
								}
								if(kpis.indexOf(kpi) == -1)
								{
									kpis.push(kpi);
								}
								factory.toggles[index].title = cp.title;
								factory.toggles[index].getBoolean(ci, kpi);
								getResourceById(ci).then(function success(event){
									try{
										if(event){
											var modelId = event.modelId;
											getDirectivesByModelId(modelId).then(function success(event){
												try{
													if(event){
														var comId = event[0].id;
														var nodeId = ci;
														factory.toggles[index].sendDeviceDirectiveBoolean = function(value){
															var val = value == true ? 1 : 0;
															resourceUIService.sendDeviceDirective(nodeId, comId, { value : val }, function(event){

															});
														}
													}else{
														throw "event.data is undefined!!"
													}
												}catch(err){
													console.log(err);
												}
											}, function error(err){
												console.log(err);
											})
										}else{
											throw "event.data is undefined!!"
										}
									}catch(err){
										console.log(err);
									}
								}, function error(err){
									console.log(err);
								});
							})(i, toggles[i])
						}
						for(var i in charts)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								var title = cp.title;
								var color = factory.charts[index].color;
								var max = factory.charts[index].max;
								var min = factory.charts[index].min;
								factory.charts[index].title = cp.title;
								factory.charts[index].getOption(ci, kpi, 'time', 24 * 3600 * 100, title, color, max, min);
								if(nodes.indexOf(ci) == -1)
								{
									nodes.push(ci);
								}
								if(kpis.indexOf(kpi) == -1)
								{
									kpis.push(kpi);
								}
							})(i, charts[i])
						}
						uuid = Math.uuid();
						var param = {
							ciid: nodes.toString(),
							kpi: kpis.toString()
						};
						SwSocket.register(uuid, "register", function(event){
							try{
								if(event)
								{
									var kpiId = event.data.kpiCode;
									var nodeId = event.data.nodeId;
									for(var i in controllPanel)
									{
										(function(index, cp){
											var ci = cp.node;
											var kpi = cp.kpi;
											if((ci==nodeId)&&(kpi==kpiId)){
												if(factory.toggles[index])
												{
													factory.controllPanel[index].webSocketBack(event.data.value)
												}
												else
												{
													//console.log(factory.charts[index]);
												}
											}
										})(i, controllPanel[i])
									}
									for(var i in charts)
									{
										(function(index, cp){
											var ci = cp.node;
											var kpi = cp.kpi;
											if((ci==nodeId)&&(kpi==kpiId)){
												var timeStamp = event.data.arisingTime

												var date = newDateJson(timeStamp);
												if(factory.bars[index]){
													factory.bars[index].webSocketBack(event.data.value, $formatDate(date, "时分"));
												}
											}
										})(i, charts[i])
									}
									for(var i in toggles)
									{
										(function(index, cp){
											var ci = cp.node;
											var kpi = cp.kpi;
											if((ci==nodeId)&&(kpi==kpiId)){
												if(factory.toggles[index])
												{
													factory.toggles[index].webSocketBack(event.data.value)
												}
												else
												{
													//console.log(factory.charts[index]);
												}

											}
										})(i, toggles[i])
									}
									for(var i in charts)
									{
										(function(index, cp){
											var ci = cp.node;
											var kpi = cp.kpi;
											if((ci==nodeId)&&(kpi==kpiId)){
												var timeStamp = event.data.arisingTime;

												var date = newDateJson(timeStamp);
												if(factory.charts[index])
												{
													factory.charts[index].webSocketBack(event.data.value, $formatDate(date, "时分"))
												}
												else
												{
													//console.log(factory.charts[index]);
												}

											}
										})(i, charts[i])
									}

								}
								else
								{
									throw 'event is undefined!!'
								}
							}
							catch(error){
								console.log(error);
							}
						});
						SwSocket.send(uuid, "register", 'kpi', param);
					}
					else
					{
						throw "content id undefined!!"
					}
				}
				catch(err)
				{
					console.log(err);
				}
			}
			else
			{
				window.open('index_tongji.html#/tongji/edit','_self');
			}
		});
		function getOption(nodes, kpis, category, timespan, title, color, max, min){
			var deferred, def1, def2, nodesDes, kpisDes, minTimespan, cur = this;
			var kpiResDefer;
			var result = [];
			for(var i = 0; i < 7; i++){
				result.push(parseInt(Math.random() * 30));
			}
			var optionDefault = {
				animation : true,
				grid: {
					left: '8%',
					top : '10%',
					width : "80%",
					height : "80%",
					containLabel: true
				},
				title : {
					show : false,
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
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : ['','','','','','',''],
						"axisLine": {
							"lineStyle": {
								"color": "#b0b0b0",
								"width": 1
							}
						},
						axisLabel : {
							"show": false,
							"textStyle": {}
						},
						splitLine : {
							"lineStyle": {
								"color": "rgb(239, 239, 239)",
								"width": 1
							}
						},
						"axisTick": {
							"show": false,
							"lineStyle": {}
						}
					}
				],
				yAxis : [
					{
						show : true,
						max : max,
						min : min,
						type : 'value',
						splitNumber : 4,
						boundaryGap : true,
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
							"show": false,
							"textStyle": {}
						},
						"axisTick": {
							"show": false,
							"lineStyle": {}
						}
					}
				],
				series : [
					{
						name:'数据',
						type:'line',
						data: result,
						itemStyle: {
							normal: {
								color : color
							},
						},
						lineStyle: {
							normal: {
								color : color
							},
						},
						areaStyle: {
							normal: {
								color : color
							},
						}
					}
				]
			};
			deferred = q.defer();
			def1 = q.defer();
			def2 = q.defer();
			kpiResDefer = [def1.promise, def2.promise];
			resourceUIService.getKpisByKpiIds([kpis], function(event){
				kpisDes = JSON.parse(JSON.stringify(event));
				minTimespan = kpisDes.minTimespan;
				delete kpisDes.minTimespan;
				def1.resolve("success");
			});
			resourceUIService.getResourceByIds([nodes], function(event){
				nodesDes = event;
				def2.resolve("success");
			});
			q.all(kpiResDefer).then(function(){
				getValueList([nodes], [kpis], category, timespan).then(function(event){
					var valueList = new $Array(event);
					var vlistGroup = (function(){
						var result = new $Array([]);
						for(var i in  kpisDes){
							for(var j in  nodesDes){
								result.push({
									nodeId : parseInt(j),
									nodeDes : nodesDes[j],
									kpiId : parseInt(i),
									kpiDes : kpisDes[i],
									valueList : []
								})
							}
						}
						return result;
					})(kpisDes, nodesDes);
					valueList.each(function(value){
						var kpiId = value.kpiCode;
						var nodeId = value.nodeId;
						vlistGroup.each(function(groupValue){
							if((groupValue.kpiId == kpiId)&&(groupValue.nodeId == nodeId)){
								var date = newDateJson(value.arisingTime)
								value.timeStamp = date.getTime();
								groupValue.valueList.push(value);
							}
						});
					});
					if(vlistGroup.first().valueList.length > 0){
						var vlGroup = new $valueListGroup(vlistGroup, minTimespan, '时分');
						var op = new $option(JSON.parse(JSON.stringify(optionDefault)));
						var xAxis, legend;
						op.clearSeries();
						legend = [];
						xAxis = vlGroup.getxAxisByTime();
						vlGroup.eachValueListMerged(function(vg){
							var name = vg.nodeDes.label + "-" + vg.kpiDes.label;
							var data = vg.$valueList;
							op.pushSeries(name, data);
						});
						op.setFirstxAxis(xAxis);
						op.setLegend(legend);
						op.setTitle(title);
						if(op.getOption().series.length > 0){
							cur.dataType = "real";
							if(cur.setOption)
							{
								cur.setOption(op.getOption());
							}
							else
							{
								cur.option = op.getOption();
							}
						}
						else
						{
							cur.dataType = "virtual";
							optionDefault.title.text = title + "(模拟数据)";
							if(cur.setOption)
							{
								cur.setOption(optionDefault);
							}
							else
							{
								cur.option = optionDefault;
							}
						}
						cur.title = title;
					}
					else
					{
						cur.dataType = "virtual";
						optionDefault.title.text = title + "(模拟数据)";
						if(cur.setOption)
						{
							cur.setOption(optionDefault);
						}
						else
						{
							cur.option = optionDefault;
						}
					}
				});
			});
			return deferred.promise;
		}
		function getDirectivesByModelId(modelId){
			var deferred = q.defer();
			if(directives[modelId])
			{
				deferred.resolve(directives[modelId])
			}
			else
			{
				resourceUIService.getDirectivesByModelId([modelId], function(event){
					try
					{
						if(event.code == 0){
							if(event.data)
							{
								directives[modelId] = event.data;
								deferred.resolve(directives[modelId]);
							}
							else
							{
								throw('data is empty');
							}
						}
						else
						{
							throw(event);
						}
					}
					catch(err)
					{
						deferred.reject(err)
						console.log(err);
					}

				});
			}
			return deferred.promise;
		}
		function getResourceById(node){
			var deferred = q.defer();
			if(nodeDes[node])
			{
				deferred.resolve(nodeDes[node])
			}
			else
			{
				resourceUIService.getResourceById([node], function(event){
					try
					{
						if(event.code == 0){
							if(event.data)
							{
								nodeDes[node] = event.data;
								deferred.resolve(nodeDes[node]);
							}
							else
							{
								throw('data is empty');
							}
						}
						else
						{
							throw(event);
						}
					}
					catch(err)
					{
						deferred.reject(err)
						console.log(err);
					}

				});
			}
			return deferred.promise;
		}
		function getKpisByKpiIds(kpi){
			var deferred = q.defer();
			if(kpiDes[kpi])
			{
				deferred.resolve(kpiDes[kpi])
			}
			else
			{
				resourceUIService.getKpisByKpiIds([kpi], function(event){
					try
					{
						if(event)
						{
							kpiDes[kpi] = event[kpi];
							deferred.resolve(kpiDes[kpi]);
						}
						else
						{
							throw('data is empty');
						}
					}
					catch(err)
					{
						deferred.reject(err)
						console.log(err);
					}

				});
			}
			return deferred.promise;
		}
		function getValueList(nodes, kpis, category, timespan){
			var deferred = q.defer();
			var kpiQueryModel = {
				category: category,
				isRealTimeData: true,
				timePeriod: timespan,
				nodeIds: nodes,
				kpiCodes: kpis,
				startTime: null,
				endTime: null,
				timeRange: "",
				statisticType: "psiot",
				condList: []
			};
			var param = ["kpi",kpiQueryModel];
			kpiDataService.getValueList(param, function(event){
				try
				{
					if(event.code == 0){
						if(event.data)
						{
							deferred.resolve(event.data);
						}
						else
						{
							throw "event.data is undefined!";
						}
					}
					else
					{
						throw "cannot get value list!";
					}
				}
				catch(error)
				{
					alert(error)
				}
			});
			return deferred.promise;
		};
		return factory;
	}
	services.factory("edit", editService);
	editService.$inject = ['$q', 'userLoginUIService','$rootScope', 'resourceUIService', 'kpiDataService', 'viewFlexService', '$window', '$route'];
	function editService(q, userLoginUIService, rootScope, resourceUIService, kpiDataService, viewFlexService, window, route){
		var factory = {}, handleView, content, deviceGroupId;
		var resources;
		factory.step = 0;
		if(route.current)
		{
			deviceGroupId = route.current.params.deviceGroupId;
		}
		else
		{

		}
		getResources().then(function success(resources){
			factory.resources = resources;
		}, function error(err){
			console.log(err);
		});
		viewFlexService.getAllMyViews(function(event){
			var views = new $Array(event.data);
			var find = views.find("viewType", "tongji");
			if(find){
				try
				{
					if(find.content)
					{
						content = JSON.parse(find.content);
						var controllPanel = content.controllPanel;
						var toggles = content.toggles;
						var charts = content.charts;
						for(var i in controllPanel)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								var title = cp.title;
								controlSetting.apply(factory.controllPanel[index], [ci, kpi, title])
							})(i, controllPanel[i])
						}
						for(var i in toggles)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								var title = cp.title;
								controlSetting.apply(factory.toggles[index], [ci, kpi, title])
							})(i, toggles[i])
						}
						for(var i in charts)
						{
							(function(index, cp){
								var ci = cp.node;
								var kpi = cp.kpi;
								var title = cp.title;
								controlSetting.apply(factory.charts[index], [ci, kpi, title])
							})(i, charts[i])
						}
					}
					else
					{
						throw "content id undefined!!"
					}
				}
				catch(err)
				{
					console.log(err);
				}
				handleView = function(data)
				{
					var param = [{
						viewId : find.viewId,
						originalViewId : 0,
						viewTitle : "tongji",
						viewName : "tongji",
						viewType : "tongji",
						content : JSON.stringify(data)
					}];
					viewFlexService.updateView(param, function(event){
						window.open('index_tongji.html#/tongji','_self');
					});
				}
			}
			else
			{
				handleView = function(data)
				{
					var param = [{
						viewTitle : "tongji",
						viewName : "tongji",
						viewType : "tongji",
						content : JSON.stringify(data)
					}];
					viewFlexService.addView(param, function(event){
						window.open('index_tongji.html#/tongji','_self');
					});
				}
			}
		});
		factory.save = function(){
			var controllPanel = [], toggles = [], charts=[];
			for(var i in factory.controllPanel)
			{
				(function(obj){
					if (obj.getAttrs != null){
						controllPanel.push(obj.getAttrs());
					}
				})(factory.controllPanel[i])
			}
			for(var i in factory.toggles){
				(function(obj){
					if (obj.getAttrs != null){
						toggles.push(obj.getAttrs());
					}
				})(factory.toggles[i])
			}
			for(var i in factory.charts){
				(function(obj){
					if (obj.getAttrs != null){
						charts.push(obj.getAttrs());
					}
				})(factory.charts[i])
			}
			handleView({
				controllPanel : controllPanel,
				toggles : toggles,
				charts : charts
			})
		};
		factory.controllPanel = [{
			label : "第一个滑动条"
		},{
			label : "第二个滑动条"
		},{
			label : "第三个滑动条"
		},{
			label : "第四个滑动条"
		}];
		factory.toggles = [{
			label : "第一个开关"
		},{
			label : "第二个开关"
		},{
			label : "第三个开关"
		}];
		factory.charts = [{
			label : "第一个视图"
		},{
			label : "第二个视图"
		},{
			label : "第三个视图"
		},{
			label : "第四个视图"
		},{
			label : "第五个视图"
		}];
		function controlSetting(ci, kpi, title){
			this.onChange = onChange;
			this.getAttrs = getAttrs;
			this.setAttrs = setAttrs;
			this.setAttrs(ci, kpi, title)
		};
		function setAttrs(ci, kpi, title)
		{
			var cur = this;
			getResources().then(function success(resources){
				//factory.resources = resources;
				cur.resource = factory.resources.find("id", ci);
				cur.title = title;
				getKpisByResource(cur.resource).then(function success(kpis){
					cur.kpis = kpis;
					cur.kpi = kpis.find("id", kpi);
				}, function error(err){
					console.log(err);
				});
			}, function error(err){
				console.log(err);
			});
		};
		function getAttrs(){
			return {
				title : this.title,
				kpi : this.kpi.id,
				node : this.resource.id
			}
		};
		function onChange(){
			var cur = this;
			cur.title = cur.resource.label;
			getKpisByResource(cur.resource).then(function success(kpis){
				cur.kpis = kpis;
			}, function error(err){
				console.log(err)
			});
		};
		function getResources(){
			var deferred = q.defer();
			if(resources)
			{
				deferred.resolve(resources)
			}
			else
			{
				resourceUIService.getResources(function(event){
					try
					{
						if(event.code == 0){
							if(event.data)
							{
								resources = new $Array(event.data);
								deferred.resolve(resources);
							}
							else
							{
								throw('data is empty');
							}
						}
						else
						{
							throw(event);
						}
					}
					catch(err)
					{
						deferred.reject(err)
						console.log(err);
					}
				});
			}
			return deferred.promise;
		};
		function getKpisByResource(resource){
			var deferred = q.defer();
			if(resource.kpis)
			{
				deferred.resolve(resource.kpis)
			}
			else
			{
				var modelId = resource.modelId
				resourceUIService.getKpisByModelId([modelId], function(event){
					try
					{
						if(event.code == 0){
							if(event.data)
							{
								resource.kpis = new $Array(event.data);
								deferred.resolve(resource.kpis);
							}
							else
							{
								throw('data is empty');
							}
						}
						else
						{
							throw(event);
						}
					}
					catch(err)
					{
						deferred.reject(err)
						console.log(err);
					}

				});
			}
			return deferred.promise;
		}
		return factory;
	};
});