define(['controllers/controllers'], function(controllers) {
	'use strict';
	controllers.controller('Dashboard2Ctrl', ['$scope', 'Info', '$timeout','viewFlexService', 'kpiDataService', 'alertService',
		'resourceUIService', 'userLoginUIService', 'growl','SwSocket','ticketService', '$location', '$q',
		function($scope, Info, $timeout,viewFlexService, kpiDataService, alertService, resourceUIService, userLoginUIService, growl,SwSocket,ticketService, $location, q) {
			console.info("切换到设备概览");
			$scope.deviceitems = [];
			$scope.totalItems2 = [];
			$scope.orderList = [];
			var sparkCharts = [];
			var info = Info.get("localdb/dashboard2.json", function(info) {
				$scope.totalItems = info.totalItems;
				$scope.leftTitle = info.week.title;
			});
			
			/**
			 * 点击主显示块跳转到详细展示
			 */

			$scope.gotoShow = function(item) {
				location.href = item.url;
				if(window.sessionStorage){
					if (item.title == "待处理紧急工单数") {
						sessionStorage.setItem("indexTabOrder","0");
					} else if (item.title == "待处理工单数") {
						sessionStorage.setItem("indexTabOrder","1");
					} else if (item.title == "由我发起工单"){
						sessionStorage.setItem("indexTabOrder","2");
					} else if (item.title == "所有工单") {
						sessionStorage.setItem("indexTabOrder","3")
					}
				}
			}
			
			/**
			 * 切换主显示模块
			 * @param {Object} item
			 * @param {Object} subitem
			 */
			for(var i in userLoginUIService.user.functionCodeSet){

			}
			$scope.changeKpiDisPlay = function(item, subitem) {
				item.visible = false;
				subitem.visible = true;
			};
			
			/**
			 * 点击设备到资源管理
			 */
			$scope.gotoDeviceShow = function(item) {
				location.href = "#/resource/" + item.modelId + "/" + item.id;
			}
			
			/**
			 * 切换周/月数据显示
			 */
			$scope.changeBindData = function(flg) {
				if (info[flg]) {
					$scope.leftTitle = info[flg].title;
					for (var i in $scope.dashboardItems) {
						var item = $scope.dashboardItems[i];
						item.timespan = info[flg].timespan;
						$scope.$broadcast('itemChanger', item);
					}
				}
			}
			
			/**
			 * 获得告警数量
			 */
			var queryAlertCount = function() {
				var params = {};
				params.states = "0";
				alertService.countFromCache(params,function(returnObj) {
					if (returnObj.code == 0) {
						for (var i in $scope.totalItems) {
							var obj = $scope.totalItems[i];
							if (obj.kpiName == "toHandleAlertNum") {
								obj.value = returnObj.data.total;
								break;
							}
						}
					}
				});
			}
			/**
			 * 获得基础的信息基于名为dashboard的性能视图
			 */
			var getBaseViewInfo = function() {
				if (!$scope.rootCi) {
					$timeout(function() {
						getBaseViewInfo();
					});
				}
				sparkCharts = [];
				$scope.dashboardItems = [];
				viewFlexService.getManageDashboard(function(event){
					try{
						if(event.code == 0)
						{
							var v = event.data;
							var userName = $scope.userInfo.userID;
							if (v.viewType == "designView") {
								if (v.content.charAt(0) == "<") {
									var content = jQuery.xml2json(v.content);
									if (content.SubViews) {
										var chartObj = content.SubViews.chart;

										if (chartObj.hasOwnProperty("length")) {

											for (var j in chartObj) {
												var titleObj = kpiDataService.getChartProperty(chartObj[j], "title");
												if (titleObj.value == "TOP") {
													queryData(chartObj[j],topDatahandler);
												}
												if (titleObj.value == "LEFT") {
													titleObj.value = "";
													$scope.dashboardItems = [chartObj[j]];
												}
												if (titleObj.value == "LEFT2") {
													queryData(chartObj[j],left2DataHandler);
												}
												if (titleObj.value == "LEFT3") {
													queryData(chartObj[j],left3DataHandler);
												}
												if (titleObj.value == "RIGHT") {
													queryData(chartObj[j],rightDataHandler);
												}
											}

										} else {
											var titleObj = kpiDataService.getChartProperty(chartObj, "title");
											if (titleObj.value == "TOP") {
												queryData(chartObj,topDatahandler);
											}
										}
									}
								} else {
									var s = v.content;
									content = JSON.parse(s);
									for (var i in content.elements) {
										var ele = content.elements[i];
										if (ele.option.title.text == "企业概览") {
											queryData(ele,topDatahandler);
										} else
										if (ele.option.title.text == "告警趋势") {
											ele.option.title.text = "";
											ele.nodes = [$scope.rootCi]
											$scope.dashboardItems = [ele];
										} else
										if (ele.option.title.text == "环比情况") {
											queryData(ele,left2DataHandler);
										} else
										if (ele.option.title.text == "处理情况") {
											queryData(ele,left3DataHandler);
										} else
										if (ele.option.title.text == "运行情况") {
											queryData(ele,rightDataHandler);
										}
									}
								}
							}
						}
						else
						{
							throw event.msg;
						}
					}catch(err){
						console.log(err)
					}
				});
					/*
				for (var i in viewFlexService.viewList) {
					var v = viewFlexService.viewList[i];

				}
				*/
			}
			var topDatahandler = function(p) {
				queryAlertCount();//获得告警
				var uuid = Math.uuid();
				var callback = function(evendata) {
					console.info("监听到事件");
				}
				kpiDataService.getKpiValueList(p, function(returnObj) {
					if (returnObj.code == 0) {
					
						for (var kpiCode in returnObj.kpisDic) {
							var isHava = false;
							for (var j in $scope.totalItems) {
								var obj = $scope.totalItems[j];
								if (kpiCode == obj.kpi) {
									obj.name = p[1].nodeIds[0]+"?"+kpiCode;
									isHava = true;
									break;
								}
							}
						}
						for (var i in returnObj.data.recordList) {
							var kpirecord = returnObj.data.recordList[i];

							for (var j in $scope.totalItems) {
								var obj = $scope.totalItems[j];
								if (kpirecord[obj.name])
									obj.value = kpirecord[obj.name];
							}
						}
						
						var param = {
							ciid: p[1].nodeIds.toString(),
							kpi: p[1].kpiCodes.toString()
						};
						var operation = "register";
						//考虑极端情况，一个页面有多个模块监听同一个方法  
						//但展示在页面的数据需对接收的实时监听的数据做不同处理 
						SwSocket.register(uuid, operation, callback);

						//websocket发送请求
						SwSocket.send(uuid, operation, 'kpi', param);
					}
				});
				/**
				 * 注销scope时注销方法heartBeat，回调函数callback  
				 */
				$scope.$on("$destroy", function() {
					console.log("on-destroy");
					SwSocket.unregister(uuid);
				});
			}
			var left2DataHandler = function(p) {
				var uuid = Math.uuid();
				var callback = function(evendata) {
					console.info("监听到事件");
				}
				kpiDataService.getKpiValueList(p, function(returnObj) {
					if (returnObj.code == 0) {
						var arr = [];
						for (var kpiCode in returnObj.kpisDic) {
							var newObj = {
								"title": returnObj.kpisDic[kpiCode],
								"lv": "text-green",
								"value": null,
								"state": "fa-caret-up",
								"rate": 0,
								"name": p[1].nodeIds[0]+"?"+kpiCode,
							}
							arr.push(newObj);
						}
						for (var i in returnObj.data.recordList) {
							var kpirecord = returnObj.data.recordList[i];
							for (var j in arr) {
								var obj = arr[j];
								if (obj.value) {
									var rate = 0
									if (kpirecord[obj.name] && kpirecord[obj.name] != 0)
										rate = (kpirecord[obj.name] - obj.value) / kpirecord[obj.name];
									else
										rate = -1;
									if (rate < 0) {
										obj.rate = Math.round(Math.abs(rate) * 100);
										obj.value = kpirecord[obj.name];
										obj.state = "fa-caret-down";
									} else if (rate > 0) {
										obj.rate = Math.round(rate * 100);
										obj.value = kpirecord[obj.name];
										obj.state = "fa-caret-up";
										obj.lv = "text-red"
									} else {
										obj.rate = Math.round(rate * 100);
										obj.value = kpirecord[obj.name];
										obj.state = "fa-caret-left";
										obj.lv = "text-black"
									}
								} else {
									if (kpirecord[obj.name])
										obj.value = kpirecord[obj.name];
								}
							}
						}
						$scope.totalItems2 = arr;
						return;
						var param = {
							ciid: p[1].nodeIds.toString(),
							kpi: p[1].kpiCodes.toString()
						};
						var operation = "register";
						//考虑极端情况，一个页面有多个模块监听同一个方法  
						//但展示在页面的数据需对接收的实时监听的数据做不同处理 
						SwSocket.register(uuid, operation, callback);

						//websocket发送请求
						SwSocket.send(uuid, operation, 'kpi', param);
					}
				});
				/**
				 * 注销scope时注销方法heartBeat，回调函数callback  
				
				$scope.$on("$destroy", function() {
					console.log("on-destroy");
					SwSocket.unregister(uuid);
				});
				 */
			}
			var left3DataHandler = function(p) {
				var uuid = Math.uuid();
				var callback = function(evendata) {
					console.info("监听到事件");
				}
				kpiDataService.getKpiValueList(p, function(returnObj) {
					if (returnObj.code == 0) {
						var arr = [];
						for (var kpiCode in returnObj.kpisDic) {
							var newObj = {
								"title": returnObj.kpisDic[kpiCode],
								"lv": "progress-bar-aqua",
								"value": null,
								"state": "",
								"rate": 0,
								"name": p[1].nodeIds[0]+"?"+kpiCode
							}
							arr.push(newObj);
						}
						for (var i in returnObj.data.recordList) {
							var kpirecord = returnObj.data.recordList[i];
							for (var j in arr) {
								var obj = arr[j];
								if (kpirecord[obj.name]) {
									obj.value = kpirecord[obj.name];
									obj.rate = kpirecord[obj.name];
									switch (true) {
										case obj.rate == 100:
											obj.lv = "progress-bar-aqua";
											break;
										case obj.rate > 90:
											obj.lv = "progress-bar-green";
											break;
										case obj.rate > 80:
											obj.lv = "progress-bar-yellow";
											break;
										case obj.rate > 70:
											obj.lv = "progress-bar-yellow";
											break;
										case obj.rate > 60:
											obj.lv = "progress-bar-red";
											break;
										default:
											obj.lv = "progress-bar-danger";
									}
								}

							}
						}
						$scope.totalItems3 = arr;
						return;
						var param = {
							ciid: p[1].nodeIds.toString(),
							kpi: p[1].kpiCodes.toString()
						};
						var operation = "register";
						//考虑极端情况，一个页面有多个模块监听同一个方法  
						//但展示在页面的数据需对接收的实时监听的数据做不同处理 
						SwSocket.register(uuid, operation, callback);

						//websocket发送请求
						SwSocket.send(uuid, operation, 'kpi', param);
					}
				});
				/**
				 * 注销scope时注销方法heartBeat，回调函数callback  
				 
				$scope.$on("$destroy", function() {
					console.log("on-destroy");
					SwSocket.unregister(uuid);
				});
				*/
			}
			var rightDataHandler = function(p) {
				var uuid = Math.uuid();
				var callback = function(evendata) {
					console.info("监听到事件");
				}
				kpiDataService.getKpiValueList(p, function(returnObj) {
					if (returnObj.code == 0) {
						var arr = [];
						for (var kpiCode in returnObj.kpisDic) {
							var newObj = {
								"title": returnObj.kpisDic[kpiCode],
								"value": 0,
								"valuelist": "",
								"name": p[1].nodeIds[0]+"?"+kpiCode
							}
							arr.push(newObj);
						}
						for (var i in returnObj.data.recordList) {
							var kpirecord = returnObj.data.recordList[i];
							for (var j in arr) {
								var obj = arr[j];
								if (kpirecord[obj.name]) {
									if (obj.valuelist) {
										obj.valuelist = obj.valuelist + "," + kpirecord[obj.name];
									} else {
										obj.valuelist = kpirecord[obj.name];
									}
									//								obj.valuelist.push(kpirecord[obj.name]);
									obj.value = kpirecord[obj.name];
								}

							}
							if (i >6) {
								break;
							}
						}
						$scope.totalItems4 = arr;
						return;
						var param = {
							ciid: p[1].nodeIds.toString(),
							kpi: p[1].kpiCodes.toString()
						};
						var operation = "register";
						//考虑极端情况，一个页面有多个模块监听同一个方法  
						//但展示在页面的数据需对接收的实时监听的数据做不同处理 
						SwSocket.register(uuid, operation, callback);

						//websocket发送请求
						SwSocket.send(uuid, operation, 'kpi', param);
					}
				});
				/**
				 * 注销scope时注销方法heartBeat，回调函数callback  
				
				$scope.$on("$destroy", function() {
					console.log("on-destroy");
					SwSocket.unregister(uuid);
				});
				 */
			}

			var queryData = function(item,handlerFun) {
				var kpiCodes = [];
				var kpiName2Code = new Object();
				var timePeriod;
				var nodeIds = [$scope.rootCi];
				var category;
				var option;
				var formatStr;
				var addDatas = [];
				var perIndex = -1;

				if (item.hasOwnProperty("option")) {
					if (item.hasOwnProperty('timespan')) {
						kpiCodes = item.kpis;
						timePeriod = item.timespan;
						category = item.category;
						if (item.type == "line" || item.type == "bar") {
						} else if (item.type == "pie" || item.type == 'gauge') {
							timePeriod = 0;
						}
						formatStr = {};
						formatStr.value = '';
						if (item.formatStr)
							formatStr.value = item.formatStr;
					} else {
						defaultChart = true;
					}
				} else {
					formatStr = kpiDataService.getChartProperty(item, "categoryAxisFormatStr");
					var arr = kpiDataService.getKpisInfo(item);
					kpiCodes = arr[0];
					kpiName2Code = arr[1];
					category = item.dataSource.filters.category;
					var arr = kpiDataService.getNodesInfo(item);
					timePeriod = arr[1];
				}
				
				var kpiQueryModel = {
					category: category,
					isRealTimeData: true,
					timePeriod: timePeriod,
					nodeIds: nodeIds,
					kpiCodes: kpiCodes
				};
				resourceUIService.getResourceByIds(nodeIds,function(returnObj){
					kpiQueryModel.nodesDic = returnObj;
					var modelIds = [];
					for(var i in returnObj)
					{
						modelIds.push(returnObj[i].modelId);
					}
					resourceUIService.getModelByIds(modelIds, function(event){
						console.log(event);
						var models = event.data;
						var defers = []
						for(var i in event.data)
						{
							var defer = q.defer();
							(function(defer){
								var modelId = event.data[i].id;
								resourceUIService.getKpisByModelId(modelId, function(event){
									console.log(event.data);
									for(var j in kpiCodes)
									{
										var find = event.data.find(function(element){
											return element.id == kpiCodes[j];
										});
										if(find)
										{
											if(kpiQueryModel.kpisDic)
											{
												kpiQueryModel.kpisDic[kpiCodes[j]] = find;
											}
											else
											{
												kpiQueryModel.kpisDic = {};
												kpiQueryModel.kpisDic[kpiCodes[j]] = find;
											}

										}
									}
									defer.resolve("success");
								})
								defers.push(defer.promise);
							})(defer)
						}
						q.all(defers).then(function(data){
							//console.log(kpiQueryModel);
							handlerFun(["kpi", kpiQueryModel]);
						})
					})
					/*
					if (kpiQueryModel.kpisDic) {
						handlerFun(["kpi", kpiQueryModel]);
					}
					*/
				});
				/*
				resourceUIService.getKpisByKpiIds(kpiCodes,function(returnObj){
					kpiQueryModel.kpisDic = returnObj;
					if (kpiQueryModel.nodesDic) {
						handlerFun(["kpi", kpiQueryModel]);
					}
				});
				*/
			};
			//查看执行中工单
			var getOrderList = function() {
				var status = 100;
				ticketService.getTicketsByStatus(status,function(returnObj){
					if (returnObj.code == 0){
						for (var i in returnObj.data) {
							if (i < 10) {
								var obj = returnObj.data[i];
								if (obj.status == 0) {
									obj.statuslab = "待处理";
								} else if(obj.status == 100){
									obj.statuslab = "处理中";
								}else {
									obj.statuslab = "已完成"
								}
								if (obj.priorityCode == 200) {
									obj.severitylab = "高";
									obj.severitybg = "alerts-critical";
								} else if (obj.priorityCode == 100) {
									obj.severitylab = "中";
									obj.severitybg = "alerts-major";
								} else {
									obj.severitylab = "低";
									obj.severitybg = "alerts-minor";
								}
								$scope.orderList.push(obj);
							}

						}
					}
				});
			}
			var getNewResources = function() {
				resourceUIService.getLatestDevices(function(returnObj) {
					if (returnObj.code == 0) {
						for (var i in returnObj.data) {
							var obj = returnObj.data[i];
//							obj.time = new Date(obj.createTime).Format(GetDateCategoryStrByLabel());
							$scope.deviceitems.push(obj)
						}
					}
				})
			}
			var getAlertPieInfo = function() {
				var option = {
					title: {
						text: '',
						subtext: '',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
	
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: false
							},
							dataView: {
								show: false,
								readOnly: false
							},
							magicType: {
								show: false,
								type: ['pie', 'funnel'],
								option: {
									funnel: {
										x: '25%',
										width: '50%',
										funnelAlign: 'left',
										max: 1548
									}
								}
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: false
							}
						}
					},
					calculable: true,
					series: [{
						name: '常见告警',
						type: 'pie',
						radius: '55%',
						center: ['50%', '40%'],
						data: [{
							value:0,
							name:'暂无告警可供分析'
						}]
					}]
				};
				var initAlertPei = function(recordList) {
					option.series[0].data = [];
					for (var i in recordList) {
						var obj = {}
						obj.value = recordList[i].alert_code_count;
						obj.name = recordList[i].category;
						option.series[0].data.push(obj);
						if (option.series[0].data.length > 5)
							break;
					}
					$scope.$broadcast(Event.ECHARTINFOSINIT, {
						"option": option,
						"name":"dashboard"
					});
				};
				var kpiQueryModel = {
					category: 'ci',
					isRealTimeData: true,
					timePeriod: 0,
					kpiCodes: ["alert_code_count"]
				};
				var p = ["alert", kpiQueryModel];
				kpiDataService.getKpiHierarchyValueList(p, function(returnObj) {
					if (returnObj.code ==0) {
						initAlertPei(returnObj.data.recordList);
						$scope.alertTypeInfos = returnObj.data.recordList;
					}
				});
			}

			if (userLoginUIService.user.isAuthenticated && viewFlexService.viewLoadFinished) {
				getBaseViewInfo();
				getOrderList();
				getNewResources();
				getAlertPieInfo();

			} else {
				$scope.$on('viewLoadFinished', function(event, msg) {
					getBaseViewInfo();
					getOrderList();
					getNewResources();
					getAlertPieInfo();

				});
			}
		}
	]);
});