define(['controllers/controllers', 'bootstrap-dialog','Array'], function(controllers, BootstrapDialog) {
	'use strict';
	var calculateRule = function(range)
	{
		var rs = {};
		try{
			rs = JSON.parse(range);
		}
		catch(e){
			console.log(e);
		}
		finally{
			return rs;
		}
	}
	controllers.initController('ViewMachineCtrl', ['$scope', '$rootScope','$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService',
		'SwSocket', 'Info', 'viewFlexService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', '$q', '$window', '$location', 'solutionUIService', 'serviceCenterService',
		function(scope, rootScope, routeParams, timeout, kpiDataService, userLoginUIService, resourceUIService, alertService,
						 SwSocket, Info, viewFlexService, unitService, growl, userDomainService, userEnterpriseService, q, window, location, solutionUIService, serviceCenterService) {
			var kpisArray = [], solutionId, /* temperary only */modelIdabsolute/* temperary only */;
			scope.$on('$locationChangeSuccess', function(event) {
        if (location.path() == "/servers") {
          userLoginUIService.changePos();
        }
      });
			rootScope.showBtn = false;
			scope.alertsClass = function(level) {
				switch (level) {
					case 0:
						return 'level0';
						break;
					case 1:
						return 'level1';
						break;
					case 2:
						return 'level2';
						break;
					case 3:
						return 'level3';
						break;
					case 4:
						return 'level4';
						break;
					default:
						return 'level0';
						break;
				}
			};
			/* temperary use !!!! */
			scope.editAbsoluteClick = function() {
				window.location.href = "../app-sc/index_machine.html#/machine/absolute/" + modelIdabsolute;
			}
			/* temperary use !!!! */
			scope.alertButtonClick = function(bool) {
				if(bool == false)
				{
					location.path("configAlert/" + routeParams.nodeId);
				}
			};
			scope.renderAlertStatus = function(alertStatus) {
				if(alertStatus < 2)
				{
					return ""
				}
				else if(alertStatus < 4)
				{

				}
				else if(alertStatus < 6)
				{

				}
			};
			scope.gotoNewResource = function() {
				window.location.href = "../app-oc/index.html#/gateways2"
			};
			scope.closeBtn = function() {
				location.path("machine");
			};
			var defer = q.defer();
			if (userLoginUIService.user.userName && userLoginUIService.user.appData) {
				scope.roleID = userLoginUIService.user.roleID ? userLoginUIService.user.roleID : 100;
				if (scope.roleID == 1000) {
					scope.key = userLoginUIService.user.userName ? userLoginUIService.user.userName : '';
				} else {
					scope.key = '';
				}
				defer.resolve("success");
			}
			else {
				scope.$on("loginStatusChanged", function() {
					scope.roleID = userLoginUIService.user.roleID ? userLoginUIService.user.roleID : 100;
					if (scope.roleID == 1000) {
						scope.key = userLoginUIService.user.userName ? userLoginUIService.user.userName : '';
					} else {
						scope.key = '';
					}
					defer.resolve("success");
				});
			}
			function getKpiValueList(nodes, kpis, callback) {
				var kpiQueryModel = {
					category: 'ci',
					isRealTimeData: true,
					timePeriod: 0,
					nodeIds: nodes,
					kpiCodes: kpis,
					startTime: null,
					endTime: null,
					timeRange: "",
					statisticType: "psiot",
					condList: []
				};
				var param = ["kpi", kpiQueryModel];
				kpiDataService.getValueList(param, function(event) {
					callback(event);
				});
			}
			defer.promise.then(function() {
				if(routeParams.nodeId) {
					resourceUIService.getResourceByIds([routeParams.nodeId],getResourceById_callback);
				}
				else {
					resourceUIService.getResources(getResources_callback);
				}
				function getResourceById_callback(event) {
					var resource = event[routeParams.nodeId];
					scope.resources = [resource];
					var modelId = resource.modelId;
					var modelId_back = function(data){
						resource.kpisArray = data;
						if(solutionId) {
							solutionUIService.getServiceViewContent(solutionId, 0, function (event) {
								try {
									if (event.code == 0) {
										if (event.data == null) {
											throw "缺少配置文件！"
										} else {
											var cont = JSON.parse(event.data);
											var nodes = [resource.id];
											var kpis = [999999];
											Array.prototype.push.apply(kpis, getAllkpisFromView.call(cont));
											getKpiValueList(nodes, kpis, function (event) {
												scope.backgroundImage = cont.backgroundImage;
												resource.leftBar = JSON.parse(JSON.stringify(cont.leftBar));
												resource.rightBar = JSON.parse(JSON.stringify(cont.rightBar));
												resource.midBar = JSON.parse(JSON.stringify(cont.midBar));
												resource.preview = JSON.parse(JSON.stringify(cont.preview));
												resource.kpitoUsername = cont.kpitoUsername;
												initResource.call(resource, event.data);
											});
										}
									} else {
										throw event.msg;
									}
								} catch (err) {
									growl.error(err);
								}
							});
						}
						else {
							viewFlexService.getAllMyViews(function(event){
								var find = event.data.find(function(elem){
									if(elem.viewType == 'modelservice')
									{
										var dt = JSON.parse(elem.content);
										return dt.modelId == modelId;
									}
									else
									{
										return false;
									}
								});
								if(find)
								{
									getServiceViewMap_callback({
										data :{
											modelId : find.content,
										}
									});
								}
								else
								{
									viewFlexService.getServiceViewMap(getServiceViewMap_callback);
								}
							});
						}
					}
					serviceCenterService.kpis.getBymodelId(modelId).then(modelId_back);
				}
				function getResources_callback(evnt) {
					var rs = [];
					scope.resources = evnt.data.filter(function(element) {
						return element.category != "RootDomain";
					});
					var getAllKpis = function(resource){
						var defer = q.defer();
						var modelId = resource.modelId;
						if(scope.allKpis == undefined)
						{
							scope.allKpis = {};
						}
						if(scope.allKpis[modelId])
						{
							resource.kpisArray = allKpis[modelId];
							defer.resolve("success");
						}
						else
						{
							var modelBack = function(data)
							{
								scope.allKpis[modelId] = data;
								resource.kpisArray = scope.allKpis[modelId];
								defer.resolve("success");
							}
							serviceCenterService.kpis.getBymodelId(modelId).then(modelBack);
						}
						return defer.promise;
					};
					for(var i in scope.resources) {
						rs.push(getAllKpis(scope.resources[i]))
					};
					q.all(rs).then(function(event){
						if(solutionId) {
							solutionUIService.getServiceViewContent(solutionId, 0, function(event){
								try {
									if (event.code == 0) {
										if (event.data == null) {
											throw "缺少配置文件！"
										} else {
											var cont = JSON.parse(event.data);
											var nodes = scope.resources.map(function(element) {
												return element.id
											});
											var kpis = [999999];
											Array.prototype.push.apply(kpis,getAllkpisFromView.call(cont));
											getKpiValueList(nodes, kpis, function(event) {
												for (var i in scope.resources) {
													(function(resource) {
														scope.backgroundImage = cont.backgroundImage;
														resource.leftBar = JSON.parse(JSON.stringify(cont.leftBar));
														resource.rightBar = JSON.parse(JSON.stringify(cont.rightBar));
														resource.midBar = JSON.parse(JSON.stringify(cont.midBar));
														resource.preview = JSON.parse(JSON.stringify(cont.preview));
														resource.kpitoUsername = cont.kpitoUsername;
														initResource.call(resource, event.data);
													})(scope.resources[i]);
												}
											});
										}
									} else {
										throw event.msg;
									}
								} catch (err) {
									growl.error(err);
								}
							});
						}
						else {
							viewFlexService.getAllMyViews(function(event){
								var filter = event.data.filter(function(elem){
									return elem.viewType == 'modelservice';
								});
								if(filter.length > 0)
								{
									getServiceViewMap_callback({
										data :{
											modelIds : filter,
										}
									});
								}
								else
								{
									viewFlexService.getServiceViewMap(getServiceViewMap_callback);
								}
							});
						}
					});
				};
			});
			function getServiceViewMap_callback(event){
				var nodes = scope.resources.map(function(element) {
					return element.id
				});
				var kpis = [999999];
				for(var i in event.data)
				{
					(function(modelId, content){
						if(typeof content == 'string')
						{
							var cont = JSON.parse(content);
							var getkpis = getAllkpisFromView.call(cont);
							for(var j in getkpis)
							{
								if(kpis.indexOf(getkpis[j]) == -1)
								{
									kpis.push(getkpis[j]);
								}
							}
							getKpiValueList(nodes, kpis, function(event) {
								for (var i in scope.resources) {
									(function(resource) {
										scope.backgroundImage = cont.backgroundImage;
										resource.leftBar = JSON.parse(JSON.stringify(cont.leftBar));
										resource.rightBar = JSON.parse(JSON.stringify(cont.rightBar));
										resource.midBar = JSON.parse(JSON.stringify(cont.midBar));
										resource.preview = JSON.parse(JSON.stringify(cont.preview));
										resource.kpitoUsername = cont.kpitoUsername;
										initResource.call(resource, event.data);
									})(scope.resources[i]);
								}
							});
						}
						else if(content instanceof Array)
						{
							for(var j in content)
							{
								var con = JSON.parse(content[j].content);
								var getkpis = getAllkpisFromView.call(con);con
								for(var k in getkpis)
								{
									if(kpis.indexOf(getkpis[k]) == -1)
									{
										kpis.push(getkpis[k]);
									}
								}
								(function(con){
									getKpiValueList(nodes, kpis, function(event) {
										for (var i in scope.resources) {
											(function(resource) {
												if(resource.modelId == con.modelId)
												{
													scope.backgroundImage = con.backgroundImage;
													resource.leftBar = JSON.parse(JSON.stringify(con.leftBar));
													resource.rightBar = JSON.parse(JSON.stringify(con.rightBar));
													resource.midBar = JSON.parse(JSON.stringify(con.midBar));
													resource.preview = JSON.parse(JSON.stringify(con.preview));
													resource.kpitoUsername = con.kpitoUsername;
													initResource.call(resource, event.data);
												}
											})(scope.resources[i]);
										}
									});
								})(con);
							}
						}
					})(i, event.data[i]);
				};
			};
			function getAllkpisFromView(){
				var kpis = [], cur = this;
				cur.rightBar = cur.rightBar ? cur.rightBar : {};
				cur.rightBar.list = cur.rightBar.list ? cur.rightBar.list : [];
				for (var i in cur.rightBar.list) {
					if (cur.rightBar.list[i].kpi ? cur.rightBar.list[i].kpi.id : false) {
						if (kpis.indexOf(cur.rightBar.list[i].kpi.id) == -1) {
							kpis.push(cur.rightBar.list[i].kpi.id)
						}
					}
				}
				cur.midBar = cur.midBar ? cur.midBar : {};
				cur.midBar.list = cur.midBar.list ? cur.midBar.list : [];
				for (var i in cur.midBar.list) {
					if (cur.midBar.list[i].kpi ? cur.midBar.list[i].kpi.id : false) {
						if (kpis.indexOf(cur.midBar.list[i].kpi.id) == -1) {
							kpis.push(cur.midBar.list[i].kpi.id)
						}
					}
				}
				cur.leftBar = cur.leftBar ? cur.leftBar : {};
				cur.leftBar.columnA = cur.leftBar.columnA ? cur.leftBar.columnA : {};
				cur.leftBar.columnA.list = cur.leftBar.columnA.list ? cur.leftBar.columnA.list : [];
				for (var i in cur.leftBar.columnA.list) {
					if (cur.leftBar.columnA.list[i].kpi ? cur.leftBar.columnA.list[i].kpi.id : false) {
						if (kpis.indexOf(cur.leftBar.columnA.list[i].kpi.id) == -1) {
							kpis.push(cur.leftBar.columnA.list[i].kpi.id)
						}
					}
				}
				cur.leftBar.columnB = cur.leftBar.columnB ? cur.leftBar.columnB : {};
				cur.leftBar.columnB.list = cur.leftBar.columnB.list ? cur.leftBar.columnB.list : [];
				for (var i in cur.leftBar.columnB.list) {
					if (cur.leftBar.columnB.list[i].kpi ? cur.leftBar.columnB.list[i].kpi.id : false) {
						if (kpis.indexOf(cur.leftBar.columnB.list[i].kpi.id) == -1) {
							kpis.push(cur.leftBar.columnB.list[i].kpi.id)
						}
					}
				}
				cur.leftBar.columnC = cur.leftBar.columnC ? cur.leftBar.columnC : {};
				cur.leftBar.columnC.list = cur.leftBar.columnC.list ? cur.leftBar.columnC.list : [];
				for (var i in cur.leftBar.columnC.list) {
					if (cur.leftBar.columnC.list[i].kpi ? cur.leftBar.columnC.list[i].kpi.id : false) {
						if (kpis.indexOf(cur.leftBar.columnC.list[i].kpi.id) == -1) {
							kpis.push(cur.leftBar.columnC.list[i].kpi.id)
						}
					}
				}
				cur.preview = cur.preview ? cur.preview : {};
				cur.preview.list = cur.preview.list ? cur.preview.list : [];
				for (var i in cur.preview.list) {
					if (cur.preview.list[i].kpi ? cur.preview.list[i].kpi.id : false) {
						if (kpis.indexOf(cur.preview.list[i].kpi.id) == -1) {
							kpis.push(cur.preview.list[i].kpi.id)
						}
					}
				}
				return kpis;
			}

			function initResource(kpiValueLists) {
				var cur = this, deferreds = [];
				if(routeParams.nodeId)
				{
					getKpisValue.call(cur, 'leftBar', 'columnA');
					getAttributes.call(cur, 'leftBar', 'columnA');
					getFormulas.call(cur, 'leftBar', 'columnA');
					getKpisValue.call(cur, 'leftBar', 'columnB');
					getAttributes.call(cur, 'leftBar', 'columnB');
					getFormulas.call(cur, 'leftBar', 'columnB');
					getKpisValue.call(cur, 'rightBar');
					getAttributes.call(cur, 'rightBar');
					getFormulas.call(cur, 'rightBar');
					getKpisValue.call(cur, 'midBar');
					getAttributes.call(cur, 'midBar');
					getFormulas.call(cur, 'midBar');
					getCharts.call(cur, 'leftBar', 'columnC');
					scope.currentRes = cur;
				}
				else
				{
					cur.show = false;
					cur.onClick = function() {
						//$(".active.sidebar-toggle2").css("pointer-events", "all");
						location.path("machine/detail/" + cur.id);
					};
					checkVisible.call(cur);
					deferreds.push(getKpisValue.call(cur, 'preview'));
					deferreds.push(getAttributes.call(cur, 'preview'));
					getFormulas.call(cur, 'preview');
					runFormula.call(cur, cur.preview.title, function(data) {
						try
						{
							cur.preview.showTitle = eval(data);
						}
						catch(error)
						{
							console.log(error);
						}
					});
					q.all(deferreds).then(function success() {
						cur.loaded = true;
					});
				}
				function checkVisible() {
					var nodes = [cur.id];
					if(cur.kpitoUsername){
						var kpis = [cur.kpitoUsername];
						if (scope.key == '') {
							cur.show = true;
						} else {
							var find = cur.kpisArray.find(function(element) {
								return element.kpiCode == cur.kpitoUsername && element.nodeId == cur.id;
							});
							if (find) {
								cur.show = (scope.key == find.value);
							} else {
								cur.show = false;
							}
						}
					}
					else
					{
						cur.show = true;
					}
				}
				function runFormula(str, callback) {
					var result = str;
					var cur = this,
						defer = q.defer();
					var kpis = [];
					var nodes = [cur.id];
					var kpiRegExp = /\{kpi\:\d*\}/g;
					if (typeof str == 'string') {
						var kpisArr = str.match(kpiRegExp);
						for (var i in kpisArr) {
							kpis.push(parseInt(kpisArr[i].slice(5, -1)));
						}
						getKpiValueList(nodes, kpis, function(event){
							for (var i in kpis) {
								var find = event.data.find(function(element) {
									return element.kpiCode == kpis[i] && element.nodeId == cur.id;
								});
								if (find) {
									result = result.replace('{kpi:' + find.kpiCode + "}", find.value);
								} else {
									result = result.replace('{kpi:' + kpis[i] + "}", 0);
								}
								callback(result);
							}
						});
						/*

						 */

					} else {
						callback('');
					}
				}
				function getFormulas( /*attribute*/ ) {
					var content = arguments[1] ? cur[arguments[0]][arguments[1]] : cur[arguments[0]];
					for (var i in content.list) {
						(function(attr, val) {
							if ((val.type == 'formula')) {
								runFormula.call(cur, val[val.type], function(data) {
									val.value = eval(data);
								});
							}
						})(i, content.list[i])
					};
				}

				function getKpisValue( /*attribute*/ ) {
					var cur = this;
					var defer = q.defer();
					var kpis = [];
					var content = arguments[1] ? cur[arguments[0]][arguments[1]] : cur[arguments[0]];
					for (var i in content.$attr("list")) {
						(function(attr, val) {
							if ((val.type == 'kpi') && (kpis.indexOf(val.id) == -1)) {
								kpis.push(val.kpi.id);
							}
						})(i, content.list[i])
					};
					var nodes = [cur.id];
					cur.alertStatus = parseInt(Math.random() * 4);
					kpisArray = cur.kpisArray;
					var kpisArr = kpiValueLists;
					var alert = kpisArr.filter(function(kpi) {
						return kpi.kpiCode == 999999 && cur.id == kpi.nodeId;
					});
					if (alert.length > 0) {
						cur.alertStatus = alert[0].value;
					} else {
						cur.alertStatus = 0;
					}
					for (var i in content.list) {
						(function(attr, val) {
							if (val.type == 'kpi') {
								setValue.call(val, kpisArr, val.valueType);
							}
						})(i, content.list[i])
					};
					defer.resolve("success!");
					function setValue(kpis, valueType) {
						var _cur_ = this;
						var value = kpis.filter(function(elem) {
							return elem.kpiCode == _cur_.kpi.id && elem.nodeId == cur.id;
						});
						if (value[0]) {
							var kpiDes = kpisArray.find(function(elem){
								return elem.id == _cur_.kpi.id;
							});
							if(kpiDes != undefined)
							{
								var rangeObj = calculateRule(kpiDes.range);
								if ((typeof rangeObj == "object") && (!rangeObj instanceof Array)){
									if(rangeObj[value[0].value])
									{
										_cur_.value = rangeObj[value[0].value];
									}
									else
									{
										_cur_.value = '-';
									}
								}
								else {
									if (valueType == 'int') {
										if(value[0].value)
										{
											_cur_.value = parseInt(value[0].value);
										}
										else
										{
											_cur_.value = "-";
										}
									} else {
										//console.log(value[0].value)
										if(value[0].value)
										{
											_cur_.value = value[0].value;
										}
										else
										{
											_cur_.value = "-";
										}
									}
								}
								/*
								if (rangeObj[value[0].value] == undefined)
								{
									if (valueType == 'int') {
										if(value[0].value)
										{
											_cur_.value = parseInt(value[0].value);
										}
										else
										{
											_cur_.value = "-";
										}
									} else {
										//console.log(value[0].value)
										if(value[0].value)
										{
											_cur_.value = value[0].value;
										}
										else
										{
											_cur_.value = "-";
										}
									}
								}
								else
								{

								}
								*/
							}
						} else {
							_cur_.value = '';
						}
						if (_cur_.link) {
							var calculateLinkage = function(link)
							{
								var regExps = [{
									replace : /\{kpi\:.*}/g,
									value : /(?!\{kpi\:)\w+\b(?=\})/
								}];
								function getValue(exp){
									var result = exp.value.exec(link);
									if(result != null)
									{
										if(result[0]=='current')
										{
											link =  link.replace(exp.replace, "'" + _cur_.value + "'");
										}
										else
										{
											var kpi = result[0];
											var find = kpiValueLists.find(function(element){
												return element.kpiId == kpi;
											});
											if(find)
											{
												link.replace(exp.replace, find.value);
											}
										}
									}
								};
								for(var i in regExps){
									getValue(regExps[i]);
								}
								location.path(eval(link));
							};
							_cur_.onClick = function() {
								if(_cur_.value != '' && _cur_.value != undefined && _cur_.value != null)
								{
									calculateLinkage(_cur_.linkage);
									//location.path(_cur_.linkage);
								}
							}
						}
					}
					return defer.promise;
				};
				function getAttributes() {
					var cur = this,
						defer = q.defer();
					var content = arguments[1] ? cur[arguments[0]][arguments[1]] : cur[arguments[0]];
					serviceCenterService.attrs.getBymodelId(cur.modelId).then(function(data){
						var attributes = data.map(function(element) {
							element.value = cur.values[element.name];
							return element;
						});
						for (var i in content.list) {
							(function(attr, val) {
								if (val.type == 'attr') {
									var find = attributes.filter(function(element) {
										return element.id == val.attr.id
									});
									if (find.length > 0) {
										val.value = find[0].value;
									} else {
										val.value = '';
									}
								}
							})(i, content.list[i])
						};
						defer.resolve("success!");
					});
					return defer.promise;
				}

				function getCharts() {
					var cur = this,
						nodes = [cur.id],
						kpis = [],
						minTimespan, sum = 0,
						size = 0;
					for (var i in cur.leftBar.columnC.list) {
						(function(attr, val) {
							if ((kpis.indexOf(val.kpi.id) == -1)) {
								kpis.push(val.kpi.id);
							}
						})(i, cur.leftBar.columnC.list[i])
					};
					var kpiQueryModel = {
						category: 'time',
						isRealTimeData: true,
						timePeriod: 8 * 24 * 3600 * 1000,
						nodeIds: nodes,
						kpiCodes: kpis,
						startTime: null,
						endTime: null,
						timeRange: "",
						statisticType: "psiot",
						condList: []
					};
					var param = ["kpi", kpiQueryModel];
					var kpisData = kpisArray.reduce(function(prev,next){
						var kpiCode = next.id;
						if(prev[kpiCode] == undefined){
							prev[kpiCode] = next;
						}
						return prev;
					},{});
					Object.defineProperty(kpisData, "minTimespan", {
						enumerable: false
					});
					for (var i in kpisData) {
						(function(kpi) {
							kpi.valuelist = [];
						})(kpisData[i])
					}
					minTimespan = 23 * 3600 * 1000;
					kpiDataService.getValueList(param, function(event) {
						var myDate = [];
						for (var i in kpisData) {
							(function(kpiCode, val) {
								for (var i = 0; i < 7; i++) {
									var date = new Date(new Date().getTime() - (7 - i) * 24 * 3600 * 1000);
									var year = date.getYear();
									var month = date.getMonth();
									var dt = date.getDate();
									var find = event.data.find(function(element) {
										return (function(year, month, date) {
											var cur = this;
											return (cur.getYear() == year) && (cur.getMonth() == month) && (cur.getDate() == date) && (kpiCode == element.kpiCode);
										}).call(new Date(element.arisingTime.split("T")[0].replace(/-/g, "/")), year, month, dt)
									});
									console.log(find);
									myDate.push({
										kpiCode: kpiCode,
										value: find ? find.value : undefined,
										timeStamp: date.getTime()
									});
								};
							})(i, kpisData[i])
						}
						var data = myDate.reduce(process, kpisData);
						var inx = 0;
						for (var i in cur.leftBar.columnC.list) {
							(function(attr, val) {
								var obj = data[val.kpi.id];
								obj.valuelist = obj.valuelist.reduce(reduceBytime, []);
								var optionDefault = {
									animation: true,
									grid: {
										top: '10%',
										left: '5%',
										width: "90%",
										height: "80%",
										containLabel: false
									},
									title: {
										show: false,
										padding: 30,
										text: '草莓大棚温度变化',
										"textStyle": {
											"fontWeight": "bold",
											"fontSize": 16
										},
									},
									tooltip: {
										trigger: 'axis'
									},
									legend: {
										data: []
									},
									calculable: true,
									xAxis: [{
										type: 'category',
										boundaryGap: false,
										data: ['', '', '', '', '', '', ''],
										"axisLine": {
											"lineStyle": {
												"color": "#b0b0b0",
												"width": 1
											}
										},
										axisLabel: {
											"show": false,
											"textStyle": {}
										},
										splitLine: {
											"lineStyle": {
												"color": "rgb(239, 239, 239)",
												"width": 1
											}
										},
										"axisTick": {
											"show": false,
											"lineStyle": {}
										}
									}],
									yAxis: [{
										show: true,
										type: 'value',
										splitNumber: 4,
										boundaryGap: true,
										min: 0,
										"axisLine": {
											"lineStyle": {
												"color": "#b0b0b0",
												"width": 1
											}
										},
										splitLine: {
											"lineStyle": {
												"color": "rgb(239, 239, 239)",
												"width": 1
											}
										},
										axisLabel: {
											"show": false,
											"textStyle": {}
										},
										"axisTick": {
											"show": false,
											"lineStyle": {}
										}
									}],
									series: [{
										name: '数据',
										type: 'line',
										data: [],
										itemStyle: {
											normal: {
												color: (function() {
													if (inx % 2 == 0) {
														return "#d99a37";
													} else {
														return "#c25262";
													}
												})()
											},
										},
										lineStyle: {
											normal: {
												color: (function() {
													if (inx % 2 == 0) {
														return "#d99a37";
													} else {
														return "#c25262";
													}
												})()
											},
										},
										areaStyle: {
											normal: {
												color: (function(kpiCode) {
													if (inx % 2 == 0) {
														return "#d99a37";
													} else {
														return "#c25262";
													}
												})()
											},
										}
									}]
								};
								val.option = renderOption.call(obj, optionDefault);
								inx++;
							})(i, cur.leftBar.columnC.list[i])
						};
					});
					function renderOption(optionDefault) {
						var cur = this;
						optionDefault.xAxis[0].data = cur.valuelist.map(function(element) {
							return $formatDate(new Date(element.timeStamp), '月日');
						});
						optionDefault.legend.data = [];
						optionDefault.series[0].name = cur.label;
						optionDefault.series[0].data = cur.valuelist.map(function(element) {
							return element.value;
						});
						return optionDefault;
					};

					function reduceBytime(prev, next) {
						var result = prev;
						sum += parseInt(next.value);
						size++;
						if (result.length > 0) {
							var last = result[result.length - 1];
							if (next.timeStamp - last.timeStamp > minTimespan) {
								next.value = parseInt((sum / size));
								sum = 0;
								size = 0;
								result.push(next);
							}
						} else {
							sum = 0;
							size = 0;
							result.push(next);
						}
						return result;

					};

					function process(prev, next) {
						var kpiCode = next.kpiCode;
						var result = prev;
						if (!next.timeStamp) {
							next.timeStamp = newDateJson(next.arisingTime).getTime();
						}

						if (result[kpiCode].valuelist) {
							result[kpiCode].valuelist.push(next)
						} else {
							result[kpiCode].valuelist = [next];
						}
						return result;
					}
				}
			}
		}
	]);
	controllers.initController('ViewMachineEdit', ['$scope', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService',
		'SwSocket', 'Info', 'viewFlexService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService', '$q', 'solutionUIService', '$rootScope', 'serviceCenterService',
		function(scope, routeParams, timeout, kpiDataService, userLoginUIService, resourceUIService, alertService,
						 SwSocket, Info, viewFlexService, unitService, growl, userDomainService, userEnterpriseService, q, solutionUIService, rootScope, serviceCenterService) {
			var handleView, currentView, solutionId, modelId, viewId;
			solutionId = typeof routeParams.solutionId == "string" ? parseInt(routeParams.solutionId) : undefined;
			modelId = typeof routeParams.modelId == "string" ? parseInt(routeParams.modelId) : undefined;
			rootScope.showBtn = true;
			scope.iconSelect = function()
			{
				scope.fronticons = [{
					label : '提花机标签',
					value : 'images/machine/iconfont.png'
				},{
					label : '压缩机标签',
					value : 'images/machine/iconfront2.svg'
				}]
			};
			scope.iconClose = function()
			{
				delete scope.fronticons;
			}
			scope.prevPanel = {
				visible : false,
				show : function()
				{
					this.visible = true;
				},
				hide : function()
				{
					this.visible = false;
				}
			};
			scope.leftPartA = {
				visible : false,
				show : function()
				{
					this.visible = true;
				},
				hide : function()
				{
					this.visible = false;
				}
			};
			scope.leftPartB = {
				visible : false,
				show : function()
				{
					this.visible = true;
				},
				hide : function()
				{
					this.visible = false;
				}
			};
			scope.leftPartC = {
				visible : false,
				show : function()
				{
					this.visible = true;
				},
				hide : function()
				{
					this.visible = false;
				}
			};
			scope.midPart = {
				visible : false,
				show : function()
				{
					this.visible = true;
				},
				hide : function()
				{
					this.visible = false;
				}
			};
			scope.rightPart = {
				visible : false,
				show : function()
				{
					this.visible = true;
				},
				hide : function()
				{
					this.visible = false;
				}
			};
			scope.bgImages = [
				{
					value : 'images/machine/machine.png',
					label : '提花机图片'
				},
				{
					value : 'images/machine/aineng1.png',
					label : '艾能机械1'
				},
				{
					value : 'images/machine/aineng.png',
					label : '艾能机械2'
				}];
			rootScope.saveServiceView = function(){
				scope.saveAndExit();
			};
			rootScope.previewMode = false;
			rootScope.previewServiceView = function(){
				rootScope.previewMode = !rootScope.previewMode
			};
			scope.saveAndExit = function () {
				try {
					var result = {};
					if(scope.kpitoUsername)
					{
						result.kpitoUsername = scope.kpitoUsername.id;
					}
					result.modelId = scope.model.id;
					result.backgroundImage = scope.backgroundImage;
					result.preview = getData.call(scope.preview);
					result.preview.icon = scope.preview.icon;
					result.leftBar = {};
					Object.defineProperty(scope.leftBar, "title", {
						enumerable: false
					});
					result.leftBar.title = scope.leftBar.title;
					for (var i in scope.leftBar) {
						(function (attr, val) {
							if (typeof val != 'function') {
								result.leftBar[attr] = getData.call(val);
							}
						})(i, scope.leftBar[i])
					}
					result.rightBar = getData.call(scope.rightBar);
					result.midBar = getData.call(scope.midBar);
					handleView(result);
				} catch (err) {
					alert(err);
				}
			};

			function getData() {
				var cur = this;
				var result = {
					list: cur.list.map(function (element) {
						var result = {}
						result.type = element.type;
						result.label = element.label;
						if (element.link) {
							result.linkage = element.linkage;
						}
						if (element.showWhenCustomerA != undefined) {
							result.showWhenCustomerA = element.showWhenCustomerA;
						}
						if (element.link != undefined) {
							result.link = element.link;
						}
						if (element.icon) {
							result.icon = element.icon;
						}
						if (result.type != 'formula') {
							if (element[result.type] == undefined) {
								throw '有未选项目存在，保存失败。'
							} else {
								result[result.type] = {
									id: element[result.type].id,
									label: element[result.type].label
								};
							}
						} else {
							result[result.type] = element[result.type];
						}
						return result;
					})
				};
				if (cur.title) {
					result.title = cur.title
				}
				return result;
			}

			function pushData(element) {
				var cur = this;
				element.remove = function (elem) {
					cur.list = cur.list.filter(function (el) {
						return elem != el;
					})
				};
				cur.list.push(element);
			}

			function pushData_rb(element) {
				var self = this;
				element.link = false;
				element.showWhenCustomerA = true;
				element.remove = function (elem) {
					self.list = self.list.filter(function (el) {
						return elem != el;
					})
				};
				element.open = function () {
					var cur = this;
					cur.show = true;
				};
				element.select = function (icon) {
					var cur = this;
					cur.show = false;
					cur.icon = icon;
				};
				element.linkClick = function () {
					cur.link = !cur.link;
				};
				self.list.push(element);
			}

			scope.leftBar = {
				columnA: {
					list: []
				},
				columnB: {
					list: []
				},
				columnC: {
					list: []
				},
			};
			for (var i in scope.leftBar) {
				(function (attr, val) {
					Object.defineProperty(val, "pushData", {
						writable: true,
						enumerable: false,
						value: pushData
					})
				})(i, scope.leftBar[i])
			}
			scope.icons = ['ps-edit', ' ps-back', 'ps-mushroom', 'ps-planting', 'ps-current_production',
				'ps-estimated_output', 'ps-daily_output', 'ps-duration', 'ps-sandglass', 'ps-task', 'ps-current_production_p',
				'ps-pattern', 'ps-number', 'ps-air-humidity', 'ps-air-temperature', 'ps-camera', 'ps-sunshine',
				'ps-video-camera', 'ps-water', 'ps-fan', 'ps-electric_motor02', 'ps-electric_motor', 'ps-Co2',
				'ps-soil_temperature', 'ps-soil_humidity', 'ps-irrigation', 'ps-spraying', 'ps-chart_brokenline',
				'ps-userinfo', 'ps-user', 'ps-group', 'ps-center', 'ps-server', 'ps-app'
			];
			scope.midBar = {
				title: '提花机生产信息',
				list: [],
				pushData: pushData
			};
			scope.rightBar = {
				title: '提花机生产信息',
				list: [],
				pushData: pushData_rb
			};
			Object.defineProperty(scope.rightBar, "pushData", {
				writable: true,
				enumerable: false
			});
			Object.defineProperty(scope.midBar, "pushData", {
				writable: true,
				enumerable: false
			});
			scope.wholeClick = function () {
				for (var i in scope.rightBar.list) {
					scope.rightBar.list[i].show = false;
				}
			};
			scope.preview = {
				title: '',
				list: []
			};
			Object.defineProperty(scope.preview, "pushData", {
				writable: true,
				enumerable: false,
				value: pushData
			});
			var $kpis = Object.create({
				models: [],
				valueCached: [],
				getBymodelId: function (modelId) {
					var cur = this,
						deferred = q.defer();
					if (cur.models.indexOf(modelId) != -1) {
						var find = cur.valueCached.filter(function (kpi) {
							return kpi.modelId == modelId;
						})
						deferred.resolve(find);
					} else {
						resourceUIService.getKpisByModelId([modelId], function success(event) {
							try {
								if (event.data) {
									var list = [];
									for (var i in event.data) {
										event.data[i].modelId = modelId;
									}
									cur.models.push(modelId);
									cur.valueCached = cur.valueCached.filter(function (kpi) {
										return kpi.modeId != modelId;
									});
									cur.valueCached = cur.valueCached.concat(event.data);
									deferred.resolve(event.data);
								} else {
									throw "data is undefined !!"
								}
							} catch (err) {
								deferred.reject(err)
							}
						}, function error(err) {
							console.log(err);
						});
					}
					return deferred.promise;
				}
			});
			var $attr = Object.create({
				models: [],
				valueCached: [],
				getBymodelId: function (modelId) {
					var cur = this,
						deferred = q.defer();
					if (cur.models.indexOf(modelId) != -1) {
						var find = cur.valueCached.filter(function (attr) {
							return attr.modelId == modelId;
						})
						deferred.resolve(find);
					} else {
						serviceCenterService.attrs.getBymodelId(modelId).then(function(data){
							var list = [];
							for (var i in data) {
								data[i].modelId = modelId;
							}
							cur.models.push(modelId);
							cur.valueCached = cur.valueCached.filter(function (attr) {
								return attr.modeId != modelId;
							});
							cur.valueCached = cur.valueCached.concat(data);
							deferred.resolve(data);
						})
					}
					return deferred.promise;
				}
			});
			if(solutionId)
			{
				solutionUIService.getServiceViewContent(solutionId, 0, modelId, function(event){
					try {
						if (event.code == '0') {
							currentView = event.data;
							start();
						} else {
							throw new Error(event.message);
						}
					} catch (err) {
						console.log(err);
					}
				});
			}
			else
			{
				viewFlexService.getAllMyViews(function(event){
					var find = event.data.find(function(element){
						if(element.viewType == 'modelservice')
						{
							var dt = JSON.parse(element.content);
							return dt.modelId == modelId;
						}
						else
						{
							return false;
						}
					});
					viewId = find ? find.viewId : undefined;
					currentView = find ? find.content : undefined;
					start();
				});
			}
			function start(){
				scope.model = {
					id : modelId
				};
				var cont, deferreds = [];
				if(typeof currentView == 'string')
				{
					cont = JSON.parse(currentView);
				}
				else
				{
					cont = {}
				}
				deferreds.push(getKpis.call(scope.model));
				deferreds.push(getAttr.call(scope.model));
				q.all(deferreds).then(function (event) {
					if(typeof scope.model == "object" && scope.model != null)
					{
						scope.kpitoUsername = scope.model['kpi'].find(function (element) {
							return element.id == cont.kpitoUsername;
						});
					}
					scope.preview = cont.preview ? cont.preview : {
						title: '',
						list: []
					};
					scope.leftBar = cont.leftBar ? cont.leftBar : {
						columnA: {
							title: '机台配置信息',
							list: []
						},
						columnB: {
							title: '机台配置信息',
							list: []
						},
						columnC: {
							list: []
						},
					};
					scope.rightBar = cont.rightBar ? cont.rightBar : {
						title: '',
						list: []
					};
					scope.midBar = cont.midBar ? cont.midBar : {
						title: '',
						list: []
					};
					scope.backgroundImage = cont.backgroundImage ? cont.backgroundImage : 'images/machine/machine.png';
					for (var i in scope.preview.list) {
						(function (index, element) {
							getContent.call(element, scope.preview)
						})(i, scope.preview.list[i])
					}
					for (var j in scope.leftBar) {
						(function (attr, val) {
							for (var i in val.list) {
								(function (index, element) {
									getContent.call(element, val);
								})(i, val.list[i])
							}
							;
							if (typeof val == 'object') {
								Object.defineProperty(val, "pushData", {
									writable: true,
									enumerable: false,
									value: pushData
								});
							}
						})(j, scope.leftBar[j])
					}
					for (var k in scope.rightBar.list) {
						(function (index, element) {
							getContent.call(element, scope.rightBar);
							element.remove = function (elem) {
								scope.rightBar.list = scope.rightBar.list.filter(function (el) {
									return elem != el;
								})
							};
							element.open = function () {
								var cur = this;
								cur.show = true;
							};
							element.select = function (icon) {
								var cur = this;
								cur.show = false;
								cur.icon = icon;
							};
							element.linkClick = function () {
								cur.link = !cur.link;
							};
						})(k, scope.rightBar.list[k])
					}
					for (var k in scope.midBar.list) {
						(function (index, element) {
							getContent.call(element, scope.midBar);
							element.remove = function (elem) {
								scope.midBar.list = scope.midBar.list.filter(function (el) {
									return elem != el;
								})
							};
						})(k, scope.midBar.list[k])
					}
					function getContent(target) {
						var cur = this;
						var type = cur.type;
						if (type != 'formula') {
							cur[type] = scope.model[type].find(function (elem) {
								if (cur[type]) {
									return elem.id == cur[type].id
								} else {
									return false;
								}
							});
						}
						cur.remove = function (elem) {
							target.list = target.list.filter(function (el) {
								return elem != el;
							})
						};
					}

					Object.defineProperty(scope.preview, "pushData", {
						writable: true,
						enumerable: false,
						value: pushData
					});
					Object.defineProperty(scope.rightBar, "pushData", {
						writable: true,
						enumerable: false,
						value: pushData_rb
					});
					Object.defineProperty(scope.midBar, "pushData", {
						writable: true,
						enumerable: false,
						value: pushData_rb
					});
					if(solutionId)
					{
						handleView = function (data) {
							var content = JSON.stringify(data);
							//solutionUIService.saveServiceViewContent(solutionId, 0, content, function(event){
							solutionUIService.saveServiceViewContent(solutionId, 0, modelId, content, function(event){
								try {
									if (event.code == '0') {
										window.open('../app-ac/index.html#/myView', '_self');
									} else {
										throw new Error(event.message);
									}
								} catch (err) {
									console.log(err);
								}
							});
						}
					}
					else
					{
						handleView = function (data) {
							data.modelId = modelId;
							var param = {
								originalViewId: 0,
								viewTitle: "modelservice",
								viewName: "modelservice",
								viewType: "modelservice",
								content: JSON.stringify(data)
							};
							if(viewId)
							{
								param.viewId = viewId;
								viewFlexService.updateView(param, function (event) {
									window.open('../app-oc/index.html#/resource_type', '_self');
								});
							}
							else
							{
								viewFlexService.addView(param, function (event) {
									window.open('../app-oc/index.html#/resource_type', '_self');
								});
							}
						}
					}
				});
			}

			function getModels() {
				var deferred = q.defer();
				solutionUIService.getModelsByGroupId(solutionId, 0, function (event) {
					try {
						if (event.code == '0') {
							scope.allModels = event.data.map(function (element) {
								element.onChange = onChange;
								return element;
							});
							scope.model.onChange();
							deferred.resolve('success!!');
						} else {
							throw event.message;
						}
					} catch (err) {
						deferred.reject(err);
					}
				});
				return deferred.promise;
			};

			function onChange() {
				var cur = this;
				getKpis.call(cur);
				getAttr.call(cur);
			};

			function getKpis() {
				var deferred = q.defer();
				var cur = this;
				if(typeof cur == "object" && cur != null)
				{
					$kpis.getBymodelId(cur.id).then(function (data) {
						console.log(data);
						cur.kpi = data.map(function (element) {
							return {
								id: element.id,
								label: element.label
							}
						});
						deferred.resolve("success");
					});
				}
				else
				{
					deferred.resolve("empty");
				}
				return deferred.promise;
			};

			function getAttr() {
				var deferred = q.defer();
				var cur = this;
				if(typeof cur == "object" && cur != null)
				{
					$attr.getBymodelId(cur.id).then(function (data) {
						cur.attr = data.map(function (element) {
							return {
								id: element.id,
								label: element.label
							}
						});
						deferred.resolve("success");
					});
				}
				else
				{
					deferred.resolve("empty");
				}
				return deferred.promise;
			};
		}
	]);
});