define(['../services/services.js'], function(services) {
	'use strict';
	services.factory('basicline', basicline_service);
	function basicline_service(){
		var factory = {};
		var inx = 0;
		var option = {
			title : 'title',
			elements : [{
				category : 'time',
				dataType : {
					type : "line",
					limit : {
						onlyDifferentKpi : false
					},
					category : {
						time : {
							replace : true,
							category : "time",
							series : {
								model : 'linear',
								value : 'ci'
							},
							xAxis : true,
							legend : true
						}
					}
				},
				option : {
					animation : false,
					grid: {
						left: '0%',
						top : '15%',
						width : "90%",
						height : "80%",
						containLabel: true
					},
					title : {
						text: '',
						subtext: ''
					},
					tooltip : {
						trigger: 'axis'
					},
					legend: {
						data:['室内温度','室外温度']
					},
					calculable : true,
					xAxis : [
						{
							type : 'category',
							boundaryGap : false,
							data : ['4/19','4/20','4/21','4/22','4/23','4/24','4/25']
						}
					],
					yAxis : [
						{
							type : 'value',
							axisLabel : {
								formatter: '{value}'
							}
						}
					],
					series : [
						{
							name:'室内温度',
							type:'line',
							data:(function(){
								var result = [];
								for(var i=0; i < 7; i++){
									result.push(parseInt(Math.random() * 100));
								}
							})(),
							markPoint: {
								data: [
									{ type: 'max', name: '最大值' }
								]
							},
							markLine: {
								data: [
									{ type: 'max', name: '最大标准值' },
									{ type: 'min', name: '最小标准值' }
								]
							}
						}
					]
				},
				type : 'line',
				formatStr : '月日',
				nodes : [],
				theme : 'macarons',
				timespan : parseInt(8 * 24 * 3600 * 1000),
				layout : {
					width : 100,
					widthheightPortion :.6,
					row : 0,
					col : 0
				}
			}]
		};
		function renderColor(i){
			switch(i){
				case 0:
					return '#d99a37';
				case 1:
					return '#c25060';
				case 2:
					return '#00c0ff';
				case 3:
					return '#25cb63';
				case 4:
					return '#91d815';
				case 5:
					return '#eea525';
				case 6:
					return '#ee3825';
				default:
					return '#c25060';
			}
		};
		factory.getOption = function(){
			var clone = JSON.parse(JSON.stringify(option));
			/*
			 if(clone.elements[0].option.series.length == 1)
			 {
			 clone.elements[0].option.series[0].areaStyle = {
			 normal: {}
			 }
			 clone.elements[0].option.series[0].itemStyle.normal.color = renderColor(inx);
			 clone.elements[0].option.series[0].lineStyle.normal.color = renderColor(inx);
			 clone.elements[0].option.series[0].areaStyle.normal.color = renderColor(inx);
			 }
			 else
			 {
			 for(var i in clone.elements[0].option.series)
			 {
			 delete clone.elements[0].option.series[i].areaStyle;
			 }
			 }
			 */
			inx++;
			return clone
		};
		return factory;
	};
	services.factory('basicpie', basicpie_service);
	function basicpie_service(){
		var factory = {};
		var option = {
			title : 'title',
			elements : [{
				category : 'ci',
				dataType : {
					type : "pie",
					limit : {
						onlyDifferentKpi : false
					},
					category : {
						ci : {
							replace : true,
							category : "ci",
							series : {
								model : 'linear',
								value : 'ci'
							},
							xAxis : false,
							legend : false
						}
					}
				},
				option : {
					"title": {
						"text": "",
						"subtext": "",
						"x": "center"
					},
					"tooltip": {
						"trigger": "item",
						"formatter": "{a} <br/>{b} : {c} ({d}%)"
					},
					"legend": {
						"orient": "vertical",
						"x": "left",
						"data": [
							"提花机A－产量",
							"提花机B－产量",
							"提花机C－产量",
							"提花机D－产量",
							"提花机E－产量"
						]
					},
					"calculable": true,
					"series": [
						{
							"name": "访问来源",
							"type": "pie",
							"radius": "60%",
							"center": [
								"50%",
								"50%"
							],
							"data": [
								{
									"value": 335,
									"name": "提花机A－产量"
								},
								{
									"value": 310,
									"name": "提花机B－产量"
								},
								{
									"value": 234,
									"name": "提花机C－产量"
								},
								{
									"value": 135,
									"name": "提花机D－产量"
								},
								{
									"value": 1548,
									"name": "提花机E－产量"
								}
							]
						}
					]
				},
				type : 'line',
				nodes : [],
				theme : 'macarons',
				timespan : 0,
				layout : {
					width : 100,
					widthheightPortion :.6,
					row : 0,
					col : 0
				}
			}]
		}
		factory.getOption = function(){
			var clone = JSON.parse(JSON.stringify(option));
			return clone
		};
		return factory;
	};
	services.factory('variables', variables_service);
	variables_service.$inject = ["$rootScope", "$q", "viewFlexService", "Info", "resourceUIService", "kpiDataService", "unitService","ticketService", "growl", "$route", "solutionUIService", "defaultDashboard", "userLoginUIService"];
	function variables_service(rootScope, q, viewFlexService, Info, resourceUIService, kpiDataService, unitService, ticketService, growl, route, solutionUIService, defaultDashboard, userLoginUIService){
		var factory = {}, deferred = q.defer();
		factory.$rootDomain = Object.create({
			get : function(){
				var cur = this,deferred = q.defer();
				if(cur.valueCached)
				{
					deferred.resolve(cur.valueCached)
				}
				else
				{
					resourceUIService.getRootDomain(function success(event){
						try{
							if(event.data)
							{
								cur.valueCached = event.data;
								deferred.resolve(event.data)
							}
							else
							{
								throw "rootCi is undefined !!"
							}
						}
						catch(err){
							deferred.reject(err)
						}
					}, function error(err){
						console.log(err);
					});
				}
				return deferred.promise;
			}
		});
		factory.$units = Object.create({
			get : function(){
				var cur = this,deferred = q.defer();
				if(cur.valueCached)
				{
					deferred.resolve(cur.valueCached)
				}
				else
				{
					unitService.getAllUnits(function success(event){
						try{
							if(event.data)
							{
								cur.valueCached = event.data;
								deferred.resolve(event.data)
							}
							else
							{
								throw "rootCi is undefined !!"
							}
						}
						catch(err){
							deferred.reject(err)
						}
					}, function error(err){
						console.log(err);
					});
				}
				return deferred.promise;
			}
		});
		factory.$resources = Object.create({
			get : function(){
				var cur = this,deferred = q.defer();
				if(cur.valueCached)
				{
					deferred.resolve(cur.valueCached);
				}
				else
				{
					factory.$rootDomain.get().then(function success(rootCi){
						resourceUIService.getResources(function success(event){
							try{
								if(event.data)
								{
									rootCi.label = '企业';
									cur.valueCached = [rootCi];
									cur.valueCached = cur.valueCached.concat(event.data);
									deferred.resolve(cur.valueCached);
								}
								else
								{
									throw "data is undefined !!"
								}
							}
							catch(err){
								deferred.reject(err)
							}
						}, function error(err){
							console.log(err);
						});
					}, function error(err){
						console.log(err);
					});
				}
				return deferred.promise;
			},
			getCurrent : function(){
				var cur = this,deferred = q.defer();
				if(cur.valueCached)
				{
					var result = cur.valueCached.slice(1);
					deferred.resolve(result);
				}
				else
				{
					resourceUIService.getResources(function success(event){
						try{
							if(event.data)
							{
								rootCi.label = '企业';
								cur.valueCached = [event.data];
								deferred.resolve(cur.valueCached);
							}
							else
							{
								throw "data is undefined !!"
							}
						}
						catch(err){
							deferred.reject(err)
						}
					}, function error(err){
						console.log(err);
					});
				}
				return deferred.promise;
			},
			getModelIdByNodeId : function(nodeId){
				var cur = this;
				var find = cur.valueCached.filter(function(element){
					return element.id == nodeId;
				});
				if(find.length > 0){
					return find[0].modelId;
				}
			},
			getAttrByNodeId : function(nodeId){
				var cur = this,deferred = q.defer();
				cur.get().then(function(data){
					var find = data.filter(function(element){
						return element.id == nodeId;
					});
					if(find.length > 0){
						if(find[0].attributes)
						{
							deferred.resolve(find[0].attributes);
						}
						else
						{
							resourceUIService.getResourceByIds([nodeId], function success(event){
								try{
									if(event)
									{
										var values = event[nodeId].values;
										var modelId = find[0].modelId;
										resourceUIService.getAttrsByModelId(modelId, function success(event){
											try{
												if(event.data)
												{
													find.attributes = event.data;
													for(var i in find.attributes){
														(function(attribute){
															attribute.value = values[attribute.name];
														})(find.attributes[i])
													}
													deferred.resolve(event.data);
												}
												else
												{
													throw "data is undefined !!"
												}
											}
											catch(err){
												deferred.reject(err)
											}
										}, function error(err){
											deferred.reject(err)
										});
									}
									else
									{
										throw "data is undefined !!"
									}
								}
								catch(err){
									deferred.reject(err)
								}
							}, function error(err){
								deferred.reject(err)
							});
						}
					}
				});
				return deferred.promise;
			}
		});
		factory.$kpis = Object.create({
			models : [],
			valueCached : [],
			getByKpiIds : function(kpis){
				var cur = this,deferred = q.defer();
				var inside = [];
				var outside = [];
				insideValueCached.apply(null, kpis);
				function insideValueCached(){
					for(var i in arguments){
						(function(kpiId){
							var find = cur.valueCached.filter(function(kpi){
								return kpiId == kpi.id;
							});
							if(find.length > 0){
								inside.push(find[0]);
							}
							else
							{
								outside.push(kpiId);
							}
						})(arguments[i]);
					}
				}
				if(outside.length > 0){
					resourceUIService.getKpisByKpiIds(outside, function success(data){
						try{
							if(data)
							{
								var result = [];
								delete data.minTimespan;
								for(var i in data){
									result.push(data[i]);
									cur.valueCached.push(data[i]);
								}
								deferred.resolve(inside.concat(result));
							}
							else
							{
								throw "data is undefined !!"
							}
						}
						catch(err){
							deferred.reject(err)
						}
					}, function error(err){
						console.log(err);
					})
				}
				else
				{
					deferred.resolve(inside);
				}
				return deferred.promise;
			},
			getBymodelId : function(modelId){
				var cur = this,deferred = q.defer();
				if(cur.models.indexOf(modelId)!=-1)
				{
					var find = cur.valueCached.filter(function(kpi){
						return kpi.modelId == modelId;
					})
					deferred.resolve(find);
				}
				else
				{
					resourceUIService.getKpisByModelId([modelId], function success(event){
						try{
							if(event.data)
							{
								var list = [];
								for(var i in event.data){
									event.data[i].modelId = modelId;
								}
								cur.models.push(modelId);
								cur.valueCached = cur.valueCached.filter(function(kpi){
									return kpi.modeId != modelId;
								});
								cur.valueCached = cur.valueCached.concat(event.data);
								deferred.resolve(event.data);
							}
							else
							{
								throw "data is undefined !!"
							}
						}
						catch(err){
							deferred.reject(err)
						}
					}, function error(err){
						console.log(err);
					});
				}
				return deferred.promise;
			}
		});
		factory.$rootKpis = {
			get : function(){
				var cur = this,deferred = q.defer();
				factory.$rootDomain.get().then(function success(data){
					var rootCi = data
					var modelId = rootCi.modelId;
					factory.$kpis.getBymodelId(modelId).then(function success(data){
						cur.valueCached = data;
						deferred.resolve(data);
					}, function error(err){
						deferred.reject(err)
					});
				}, function error(err){
					deferred.reject(err)
				});
				return deferred.promise;
			}
		};
		factory.$resources.get().then(function success(data){
			factory.resources = data;
		}, function error(err){
			console.log(err);
		});
		factory.$rootKpis.get().then(function success(data){
			factory.kpis = data;
		}, function error(err){
			console.log(err);
		});
		var toolslist = [{
			label : 'totalItems'
		}, {
			label : 'progress'
		}, {
			label : 'downTab'
		}, {
			label : 'attrTab'
		}, {
			label : 'header'
		},{
			label : 'map'
		}];
		(function(){
			for(var i in arguments){
				(function(argument){
					factory[argument.label] = [Object.create(null, {
						id : {
							enumerable : false,
							writable : false,
							id : $randomString(32)
						},
						type : {
							enumerable : true,
							writable : false,
							value : argument.label
						},
						attributes : {
							enumerable : true,
							writable : true,
							value : {}
						}
					})];
				})(arguments[i])
			}
		}).apply(factory, toolslist);
		factory.listone = [Object.create(null, {
			id : {
				enumerable : false,
				writable : false,
				value : $randomString(32)
			},
			type : {
				enumerable : true,
				writable : false,
				value : 'listone'
			},
			attributes : {
				enumerable : true,
				writable : true,
				value : {
					fun : 'resourceUIService.getLatestDevices',
				}
			}
		})];
		factory.resetClick = function(){
			if(typeof factory.changeView == 'function')
			{
				factory.changeView(JSON.parse(JSON.stringify(defaultDashboard)));
			}
		};
		factory.listtwo = [Object.create(null, {
			id : {
				enumerable : false,
				writable : false,
				value : $randomString(32)
			},
			type : {
				enumerable : true,
				writable : false,
				value : 'listtwo'
			},
			attributes : {
				enumerable : true,
				writable : true,
				value : {
					fun : 'ticketTaskService.getTicketsByStatus',
				}
			}
		})];
		var chartslist = [{
			label : 'basicline'
		},{
			label : 'basicpie'
		}];
		(function(){
			var cur = this;
			for(var i in arguments){
				(function(argument){
					cur[argument.label] = [Object.create(null, {
						id : {
							enumerable : false,
							writable : false,
							value : $randomString(32)
						},
						type : {
							enumerable : true,
							writable : false,
							value : argument.label
						},
						attributes : {
							enumerable : true,
							writable : true,
							value : {}
						},
						kpiObjects : {
							enumerable : true,
							writable : true,
							value : []
						}
					})];
				})(arguments[i])
			}
		}).apply(factory, chartslist);
		factory.alertcommon = [Object.create(null, {
			id : {
				enumerable : false,
				writable : false,
				value : $randomString(32)
			},
			type : {
				enumerable : true,
				writable : false,
				value : 'alertcommon'
			},
			attributes : {
				enumerable : true,
				writable : true,
				value : {
					type : 'alert'
				}
			},
			kpiObjects : {
				enumerable : true,
				writable : true,
				value : []
			}
		})];
		factory.sparkline =  [Object.create(null, {
			id : {
				enumerable : false,
				writable : false,
				value : $randomString(32)
			},
			type : {
				enumerable : true,
				writable : false,
				value : 'sparkline'
			},
			attributes : {
				enumerable : true,
				writable : true,
				value : {}
			},
			kpiObjects : {
				enumerable : true,
				writable : true,
				value : []
			}
		})];
		factory.removeKpi = function(kpi, target){
			target.kpiObjects = target.kpiObjects.filter(function(element){
				return element != kpi
			});
			var result = [];
			for(var i in target.kpiObjects)
			{
				result.push(target.kpiObjects[i].id);
			}
			target.attributes.kpi = result;
		};
		factory._EDITMODE_ = "editmode";
		factory._VIEWMODE_ = "viewmode";
		factory.layouts = [{
			id : $randomString(32),
			type : 'layout',
			cols : [{
				col : 12
			}]

		},{
			id : $randomString(32),
			type : 'layout',
			cols: [{
				col: 6
			}, {
				col: 6
			}]
		},{
			id : $randomString(32),
			type : 'layout',
			cols: [{
				col: 8
			}, {
				col: 4
			}]
		},{
			id : $randomString(32),
			type : 'layout',
			cols: [{
				col: 4
			}, {
				col: 8
			}]
		},{
			id : $randomString(32),
			type : 'layout',
			cols: [{
				col: 2
			}, {
				col: 4
			}, {
				col: 6
			}]
		},{
			id : $randomString(32),
			type : 'layout',
			cols: [{
				col: 4
			}, {
				col: 4
			}, {
				col: 4
			}]
		},{
			id : $randomString(32),
			type : 'layout',
			cols: [{
				col: 3
			}, {
				col: 3
			}, {
				col: 3
			}, {
				col: 3
			}]
		},{
			id : $randomString(32),
			type : 'layout',
			freeStyle : true,
			cols: [{
				col: 2
			}, {
				col: 4
			}, {
				col: 6
			}]
		}];
		factory.getViews = function(solutionId){
			var deferred = q.defer();
			factory.dashboardView = deferred.promise;
			if(solutionId){
				solutionUIService.getManageViewContent(solutionId, function(event){
					if(event.code == "0")
					{
						dashboardSolution((event.data != null &&  event.data != undefined)? event.data : undefined);
					}
				});
			}
			else
			{
				manageDashboard();
				/* when there is no solution ID provided, should get view from managed dashboard!!!

				if(userLoginUIService.user.appData)
				{
					var solutionId = userLoginUIService.user.appData.solutionId;
					solutionUIService.getManageViewContent(solutionId, function(event){
						if(event.code == "0")
						{
							manageDashboard((event.data != null &&  event.data != undefined)? event.data : undefined);
						}
					});
				}
				else
				{
					rootScope.$on("loginStatusChanged", function() {
						var solutionId = userLoginUIService.user.appData.solutionId;
						solutionUIService.getManageViewContent(solutionId, function(event){
							if(event.code == "0")
							{
								manageDashboard((event.data != null &&  event.data != undefined)? event.data : undefined);
							}
						});
					});
				}
				*/
			}
			function dashboardSolution(dbView)
			{
				var dashboardView = dbView;
				viewFlexService.getAllMyViews(function(event){
					var allviews = new $Array(event.data);
					var designViews = new $Array(allviews.findAll("viewType", "designView"));
					var temp = [];
					designViews.each(function(designView){
						var contentData;
						var content = designView.content;
						if(content){
							contentData = JSON.parse(content);
						}
						temp.push({
							id : $randomString(32),
							type : "designView",
							content : contentData,
							view : designView
						});
					});
					if(dashboardView != null && dashboardView != undefined)
					{
						try{
							if(dashboardView)
							{
								var content = JSON.parse(dashboardView);
								deferred.resolve({
									data : JSON.parse(dashboardView)
								});
							}
							else
							{
								throw "dashboardView is empty!!"
							}
						}catch(e){
							deferred.reject(e);
						}
					}
					else
					{
						factory.$rootDomain.get().then(function success(root){
							var rootCi = root.id;
							deferred.resolve({
								data : JSON.parse(JSON.stringify(defaultDashboard))
							})
						});

					}
					factory.designViews = temp;

				});
			}
			function manageDashboard()
			{
				viewFlexService.getManageDashboard(function(evnt) {
					var dashboardView;
					if(evnt.data == null)
					{
						dashboardView = solutionDashboard;
					}
					else
					{
						dashboardView = evnt.data;
					}
					viewFlexService.getAllMyViews(function(event){
						var allviews = new $Array(event.data);
						var designViews = new $Array(allviews.findAll("viewType", "designView"));
						var temp = [];
						designViews.each(function(designView){
							var contentData;
							var content = designView.content;
							if(content){
								contentData = JSON.parse(content);
							}
							temp.push({
								id : $randomString(32),
								type : "designView",
								content : contentData,
								view : designView
							});
						});
						if(dashboardView != null && dashboardView != undefined ? dashboardView.viewType == "dashboard" : false)
						{
							try{
								if(dashboardView.content)
								{
									var content = JSON.parse(dashboardView.content);
									deferred.resolve({
										viewId : dashboardView.viewId,
										data : JSON.parse(dashboardView.content)
									});
								}
								else
								{
									throw "dashboardView is empty!!"
								}
							}catch(e){
								deferred.reject(e);
							}
						}
						else if(dashboardView != null && dashboardView != undefined ? dashboardView.viewType == "designView" : true)
						{
							factory.$rootDomain.get().then(function success(root){
								var rootCi = root.id;
								deferred.resolve({
									data : JSON.parse(JSON.stringify(defaultDashboard))
								})
							});

						}
						factory.designViews = temp;

					});
				});
			}
		};
		factory.getValueByRootKpi = function(kpi)
		{
			var deferred = q.defer();
			factory.$rootDomain.get().then(function success(data){
				var rootCi = data.id;
				getValueList([rootCi],[kpi],"ci",0).then(function success(data){
					if(data[0])
					{
						deferred.resolve(data[0].value);
					}
					else
					{
						deferred.resolve(0);
					}
				},function error(err){
					deferred.reject(err);
				})
			},function error(err){
				deferred.reject(err);
			});
			return deferred.promise;
		};
		factory.getValueListByRootKpis = function(kpis)
		{
			var deferred = q.defer();
			factory.$rootDomain.get().then(function success(data){
				var rootCi = data.id;
				getValueList([rootCi],kpis,"time",7*24*3600*1000).then(function success(data){
					if(data[0])
					{
						deferred.resolve(data);
					}
					else
					{
						deferred.resolve([]);
					}
				},function error(err){
					deferred.reject(err);
				})
			},function error(err){
				deferred.reject(err);
			});
			return deferred.promise;
		};
		factory.getValueByCiKpi = function(ci, kpi)
		{
			var deferred = q.defer();
			getValueList([ci],[kpi],"ci",0).then(function success(data){
				if(data[0])
				{
					deferred.resolve(data[0].value);
				}
				else
				{
					deferred.resolve(0);
				}
			},function error(err){
				deferred.reject(err);
			})
			return deferred.promise;
		};
		function getValueList(nodes, kpis, category, timespan){
			var deferred = q.defer();
			var kpiQueryModel = {
				category: category,
				isRealTimeData: true,
				timePeriod: ((category=="time") ? timespan : 0),
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
					deferred.reject(error);
				}
			});
			return deferred.promise;
		};
		return factory;
	};
});