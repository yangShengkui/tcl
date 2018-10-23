define(["angular"], function(angular) {
	var module = angular.module("myapp");
	module.controller("loginController", ["$scope", "$rootScope", "loginManagement", function(scope, rootScope, lm) {
		rootScope.loading = undefined;
		scope.loginList = [{
			"name": "wangxingbo@proudsmart.com",
			"password": "abc123"
		}, {
			"name": "ps@ps.com",
			"password": "abc1234"
		}, {
			"name": "394160008@qq.com",
			"password": "@WSX3edc"
		}, {
			"name": "zhangjiang79@qq.com",
			"password": "1q2w3e4r"
		}, {
			"name": "adomain@test.com",
			"password": "1q2w3e4r"
		}, {
			"name": "1203538033@qq.com",
			"password": "lin664181"
		}, {
			"name": "18611560122",
			"password": "abc123"
		}];
		scope.sitem = scope.loginList[0];
		scope.login = function(item) {
			lm.login(item);
		}
	}]);
	module.controller("toposhowController", ["$scope","userLoginUIService", "$rootScope", "getviews", "$location", "deleteViews", "unregisterDevice", "$route", function(scope,userLoginUIService, rootScope, getviews, loc, deleteViews, unregisterDevice, route) {
		rootScope.loading = false;
		scope.userInfo = userLoginUIService.user;
		getviews.then(function success(event) {
			var result = []
			for (var i in event.data) {
				if (event.data[i].viewType == "topology") {
					var innerData = JSON.parse(event.data[i].content);
					var clone = JSON.parse(JSON.stringify(event.data[i]));
					clone.content = innerData;
					result.push(clone);
				}
			}
			scope.viewList = result;
		}, function error(error) {
			console.log(error);
		});
		scope.getLocation = undefined;
		scope.viewClick = viewClick;
		scope.addNewTopo = addNewTopo;
		scope.deleteChart = deleteChart;
		scope.backTolist = backTolist;
		scope.renderImage = renderImage;
		scope.elemCLick = elemCLick;
		scope.elePos = elePos;
		scope.popPos = popPos;
		scope.popClose = popClose;
		function popClose() {
			scope.selectedElement = undefined;
		}

		function elePos(top, left) {
			return {
				top: top + "px",
				left: left + "px"
			}
		}

		function popPos(top, left) {
			return {
				top: (top - 120) + "px",
				left: (left - 40) + "px"
			}
		}

		function elemCLick(elem) {
			scope.selectedElement = elem;
		}

		function renderImage(unit) {
			switch (unit) {
				case "Amount":
					return {
						"background-image": "url(images/elementIcon/agriculture.svg)"
					}
					break;
				case "Temperature":
					return {
						"background-image": "url(images/elementIcon/agriculture.svg)"
					}
					break;
				default:
					return {
						"background-image": "url(images/elementIcon/agriculture.svg)"
					}
					break;
			}
		}

		function viewClick(view) {
			scope.selectView = view.content.elements;
		}

		function backTolist(view) {
			scope.selectView = undefined;
		}

		function addNewTopo() {
			loc.path("/topology");
		}

		function deleteChart(viewId, gatewayId, deviceId) {
			deleteViews([viewId]).then(function success(event) {
				unregisterDevice(gatewayId, deviceId).then(function success(event) {
					getviews.then(function success(event) {
						var result = [];
						for (var i in event.data) {
							if (event.data[i].viewType == "topology") {
								result.push(event.data[i]);
							}
						}
						scope.viewList = result;
					}, function error(error) {
						console.log(error);
					});
				});
			}, function error(error) {
				console.log(error)
			});
		}
	}]);
	module.controller("mainController", ["$scope","userLoginUIService", "$rootScope", "$timeout", "$location", "kpiDataService", "getSimpleDistricts", "$window", "$q", "$route", "resourceUIService", "viewFlexService", 'solutionUIService', 'serviceCenterService', function(scope,userLoginUIService, rootScope, timeout, loc, kpiDataService, getSimpleDistricts, window, q, route, resourceUIService, viewFlexService, solutionUIService, serviceCenterService) {
		var deferred, promise, localSearch, currentView, solutionId, id, flag;
		//viewFlexService.deleteViews([10125]);
		rootScope.loading = false;
		rootScope.step = 0;
		scope.saveloading = false;
		scope.userInfo = userLoginUIService.user;
		deferred = q.defer();
		promise = deferred.promise;
		require(["baiduMap"], function(Bmap) {
			Bmap(function(event) {
				if (event != 'error') {
					deferred.resolve(event);
				} else {
					deferred.reject(event);
				}
			});
		});
		scope.editResource = function(model)
		{
			serviceCenterService.resources.getBymodelId(model.id).then(function(data){
				console.log(data);
			});
		};
		resourceUIService.getAllGateways(function(event) {
			var first = [{
				id: '',
				name: '所有网关'
			}];
			var remap = event.data.map(function(element) {
				return {
					id: element.id,
					name: element.name
				}
			})
			scope.gateways = first.concat(remap);
			scope.gatewayId = '';
			console.log(scope.gateways);
		});
		function $modelGroup( ) {
			var cur = this,
				deferred = q.defer(),
				resource = arguments[0];
			if (!cur.attributesDes) {
				resourceUIService.getAttrsByModelId(cur.id, function(event) {
					try {
						if (event.code == 0) {
							cur.attributesDes = event.data;
							Object.defineProperty(cur, "attributesDes", {
								enumerable: false
							});
							Object.defineProperty(cur, "id", {
								enumerable: false
							});
							if (resource) {
								for (var i in cur.attributesDes) {
									(function(name, attribute) {
										attribute.value = resource ? resource[name] : '';
										if (name == 'standardAddress') {
											var arr = resource ? resource[name].split(",") : [],
												province, city, district;
											if (arr[0]) {
												province = scope.$Address.all.find(function(element) {
													return element.label == arr[0];
												});
											}
											if (arr[1]) {
												city = province.children.find(function(element) {
													return element.label == arr[1];
												});
												if (!city) {
													city = province.children[0];
												}
											}
											if (arr[2]) {
												district = city.children.find(function(element) {
													return element.label == arr[2];
												});
												if (!district) {
													district = city.children[0];
												}
											}
											scope.$Address.setPosition(province, city, district);
										} else if (name == 'productionDate') {
											if (resource) {
												if (typeof resource[name] == 'string') {
													attribute.value = resource ? resource[name].split("T")[0] : '';
												}
											}
										}
									})(cur.attributesDes[i].name, cur.attributesDes[i])
								}
							}
							deferred.resolve(cur);
						} else {
							throw event.message;
						}
					} catch (err) {
						deferred.reject(err);
					}
				});
			}
			return deferred.promise;
		};
		scope.openResourceSelect = function(receive)
		{
			var modelId = receive.model.id;
			var model = scope.models.find(function(element){
				return element.id == modelId;
			});
			scope.resourceSelect = model.resourcesArray.filter(function(element){
				var findshow = element.kpiArray.some(function(kpi){
					return kpi.show == true;
				});
				return findshow
			});
			scope.selectResource = function(resource)
			{
				receive.resource = resource;
				var kpi = resource.kpiArray.find(function(element){
					return receive.kpi.id == element.id
				});
				if(typeof kpi == 'object' && kpi != null){
					kpi.show = false;
				}
				delete scope.resourceSelect;
				delete scope.selectResource;
			}
		};

		scope.resourceClose = function()
		{
			delete scope.selectResource;
			delete scope.resourceSelect;
		};
		scope.$Address = {
			setPosition: function(province, city, district) {
				var cur = this;
				if (province) {
					cur.province = province;
					if (city) {
						cur.city = city;
						if (district) {
							cur.district = district;
						} else {
							cur.district = cur.city.children[0];
						}
					} else {
						cur.city = province.children[0];
						cur.district = cur.city.children[0];
					}
				}
				if (cur.onChange) {
					cur.onChange(cur.province, cur.city, cur.district);
				}
			},
			changeProvince: function(province) {
				var cur = this;
				cur.city = province.children[0];
				cur.district = cur.city.children[0];
				if (cur.onChange) {
					cur.onChange(cur.province, cur.city, cur.district);
				}
			},
			changeCity: function(city) {
				var cur = this;
				cur.district = city.children[0];
				if (cur.onChange) {
					cur.onChange(cur.province, cur.city, cur.district);
				}
			},
			changeDistrict: function(district) {
				var cur = this;
				if (cur.onChange) {
					cur.onChange(cur.province, cur.city, cur.district);
				}
			},
			onChange: function(province, city, district) {
				if (scope.equipment.modelGroup.attributesDes) {
					var find = scope.equipment.modelGroup.attributesDes.find(function(element) {
						return element.name == 'standardAddress';
					});
					var lat = scope.equipment.modelGroup.attributesDes.find(function(element) {
						return element.name == 'latitude';
					});
					var lng = scope.equipment.modelGroup.attributesDes.find(function(element) {
						return element.name == 'longitude';
					});
					if (find) {
						find.value = province.label + "," + city.label + "," + district.label;
						var keyword = province.label + " " + city.label + " " + district.label;
						promise.then(function success(event) {
							localSearch = event;
							scope.getLocation = "获取地址中..."
							localSearch.search(keyword);
							localSearch.setSearchCompleteCallback(function(searchResult) {
								scope.$apply(finishApply);

								function finishApply() {
									scope.getLocation = undefined;
									if (searchResult.wr[0]) {
										var lat = searchResult.wr[0].point.lat;
										var lng = searchResult.wr[0].point.lng;
										var latitude = scope.equipment.modelGroup.attributesDes.find(function(element) {
											return element.name == 'latitude';
										});
										latitude.value = lat;
										var longitude = scope.equipment.modelGroup.attributesDes.find(function(element) {
											return element.name == 'longitude';
										});
										longitude.value = lng;
									};
								}
							});
						}, function error(error) {
							scope.getLocation = "N/A";
						});
					}
				}
			}
		};
		var $models = {
			getAll: function() {
				var cur = this,
					deferred = q.defer();
				if (cur.cached) {
					deferred.resolve(cur.cached);
				} else {
					resourceUIService.getModels(function(event) {
						if (event.code == '0') {
							cur.cached = event.data;
							deferred.resolve(event.data);
						} else {
							deferred.reject(event.message);
						}
					})
				}
				return deferred.promise;
			}
		};
		var $DeviceGroupModels = {
			get: function() {
				var cur = this,
					deferred = q.defer();
				if (cur.cached) {
					deferred.resolve(cached);
				} else {
					resourceUIService.getDeviceGroupModels(function(event) {

						try {
							if (event.code == 0) {
								cur.cached = event.data; /* Group Model Defination */
								deferred.resolve(event.data);
							} else {
								throw event.message;
							}

						} catch (err) {
							deferred.reject(err);
						}
					});
				}
				return deferred.promise;
			}
		};
		require(['commonlib'], function(lib) {
			//scope.userInfo = userInfo.getUserInfo();
			scope.kpiIcon = kpiIcon;
			scope.sensorIcon = sensorIcon;
			scope.prevStep_Btn = prevStep_Btn;
			scope.renderImage = renderImage;
			scope.accomplished = accomplished;
			scope.bgSel_click = bgSel_click;
			scope.createNewGraph = createNewGraph;
			scope.renderBgImg = renderBgImg;
			scope.bgSelect = bgSelect;
			scope.backgroundImage = '';
			scope.equipment = Object.create({});
			scope.backgroundImage = [{
				id: 1,
				path: "images/topo/topo_bg1.png"
			}, {
				id: 2,
				path: "images/topo/topo_bg2.jpg"
			}, {
				id: 3,
				path: "images/topo/topo_bg3.jpg"
			}];
			if (route.current) {
				run();
			} else {
				rootScope.$on("locChanges", function() {
					run();
				});
			}
			function dropDeviceGroup(ui, offset)
			{
				var model, resource, kpi;
				var draggable = $(ui.draggable);
				var modelId = draggable.attr("model");
				var kpiId = draggable.attr("kpi");
				var resourceId = draggable.attr("resource");
				model = scope.models.find(function(model){
					return model.id == modelId;
				});
				resource = model.resourcesArray.find(function(resource){
					return resource.id == resourceId;
				});
				kpi = resource.kpiArray.find(function(kpi){
					return kpi.id == kpiId;
				});
				kpi.show = false;
				var object = Object.create({
					remove : function(){
						var cur = this;
						cur.kpi.show = true;
						scope.receivedList = scope.receivedList.filter(function(received){
							return received != cur;
						});
					}
				},{
					kpiSource : {
						value : kpi,
						enumerable : false
					},
					title : {
						value : kpi.label,
						enumerable : true,
						writable : true
					},
					instance : {
						value : kpi.label,
						enumerable : true,
						writable : true
					},
					resource : {
						value : resource,
						enumerable : true,
						writable : true
					},
					model : {
						value : model,
						enumerable : true
					},
					kpi : {
						value : kpi,
						enumerable : true
					},
					top : {
						value : ui.offset.top - offset.top,
						enumerable : true
					},
					left : {
						value : ui.offset.left - offset.left,
						enumerable : true
					}
				});
				if(scope.receivedList){
					scope.receivedList.push(object);
        } else {
          scope.receivedList = [object];
        }
      };
      function dropDevice(ui, offset) {
        var model, resource, kpi;
        var draggable = $(ui.draggable);
        var modelId = draggable.attr("model");
        var kpiId = draggable.attr("kpi");
        var resourceId = draggable.attr("resource");
        model = scope.models.find(function(model) {
          return model.id == modelId;
        });
        resource = scope.resources.find(function(resource) {
          return resource.id == resourceId;
        });
        kpi = resource.kpiArray.find(function(kpi) {
          return kpi.id == kpiId;
        });
        kpi.show = false;
        var object = Object.create({
          remove: function() {
            var cur = this;
            cur.kpi.show = true;
            scope.receivedList = scope.receivedList.filter(function(received) {
              return received != cur;
            });
          }
        }, {
          kpiSource: {
            value: kpi,
            enumerable: false
          },
          title: {
            value: kpi.label,
            enumerable: true,
            writable: true
          },
          instance: {
            value: kpi.label,
            enumerable: true,
            writable: true
          },
          resource: {
            value: resource,
            enumerable: true,
            writable: true
          },
          model: {
            value: model,
            enumerable: true
          },
          kpi: {
            value: kpi,
            enumerable: true
          },
          top: {
            value: ui.offset.top - offset.top,
            enumerable: true
          },
          left: {
            value: ui.offset.left - offset.left,
            enumerable: true
          }
        });
        if (scope.receivedList) {
          scope.receivedList.push(object);
        } else {
          scope.receivedList = [object];
        }
      };
			function rArrList(data)
			{
				var cur = this;
				for(var i in data)
				{
					cur[i] = data[i];
				}
			}
			rArrList.prototype.remove = function()
			{
				var cur = this, findKpi;
				scope.receivedList = scope.receivedList.filter(function(received){
					return received != cur;
				});
				if(cur.resource)
				{
					findKpi = cur.resource.kpiArray.find(function(element){
						return element.id == cur.kpi.id;
					});
					findKpi.show = true;
				}
			}
			function dropDeviceGroupModel(ui, offset)
			{
				var model, kpi;
				var draggable = $(ui.draggable);
				var modelId = draggable.attr("model");
				var kpiId = draggable.attr("kpi");
				model = scope.models.find(function(model){
					return model.id == modelId;
				});
				kpi = model.kpiArrays.find(function(kpi){
					return kpi.id == kpiId;
				});
				kpi.show = false;
				var object = new rArrList({
					kpiSource : kpi,
					title : kpi.label,
					instance : kpi.label,
					model : model,
					kpi : kpi,
					top : ui.offset.top - offset.top,
					left : ui.offset.left - offset.left
				});
				if(scope.receivedList){
					scope.receivedList.push(object);
				}
				else
				{
					scope.receivedList = [object];
				}
			}
			function run() {
				var params = route.current.params;
				scope.equipment.DeviceMode = params.mode;
				if(params.mode == "deviceGroup")
				{
					scope.onDrop = dropDeviceGroup;
				}
				else if(params.mode == "deviceGroupModel" || params.mode == "deviceModel")
				{
					scope.onDrop = dropDeviceGroupModel;
        } else if (params.mode == "device") {
          scope.onDrop = dropDevice;
        }
				id = parseInt(params.id);
				solutionId = parseInt(params.solutionId);
				if(scope.equipment.DeviceMode == 'deviceGroupModel' || scope.equipment.DeviceMode == 'deviceModel'){
					scope.back = backsolution;
				}
				else
				{
					scope.back = backService;
				}
				flag = params.flag;
				viewFlexService.getAllMyViews(function(event) {
					try {
						if (event.code == '0') {
							if (event.data instanceof Array) {
								currentView = event.data.find(function(element) {
									var dt = {};
									if (element.content != null && element.content != undefined) {
										dt = JSON.parse(element.content);
									}
									element.JSON = dt;
									if(dt)
									return id ? id == dt.nodeId : false;
								});
							}
							if (currentView) {
								scope.bgImgId = currentView.JSON ? currentView.JSON.bgImgId : undefined;
								scope.equipment.label = currentView.JSON.label;
							}
							getSimpleDistricts.then(function success(event) {
								if (event.code == 0) {
									scope.$Address.all = event.data;
									if (scope.equipment.DeviceMode == 'device') {
										if (currentView) {
											scope.saveAndExit = updateAsDevice;
											runAsDevice.call(scope, id, currentView.JSON.elements);
										} else {
											scope.saveAndExit = saveAsDevice;
											runAsDevice.call(scope, id);
										}
									}
									else if(scope.equipment.DeviceMode == 'deviceModel')
									{
										if (currentView) {
											scope.saveAndExit = saveAsDeviceModel;
											runAsDeviceModel.call(scope, id, currentView.JSON.elements);
										} else {
											scope.saveAndExit = saveAsDeviceModel;
											runAsDeviceModel.call(scope, id);
										}

									}
									else if (scope.equipment.DeviceMode == 'deviceGroup') {
										if (currentView) {
											scope.saveAndExit = updateAsDeviceGroup;
											runAsDeviceGroup.call(scope, id, currentView.JSON.elements);
										} else {
											scope.saveAndExit = saveAsDeviceGroup;
											runAsDeviceGroup.call(scope, id);
										}
									}
									else if (scope.equipment.DeviceMode == 'deviceGroupModel') {
										if (currentView) {
											scope.saveAndExit = saveAsDeviceGroupModel;
											runAsDeviceGroupModel.call(scope, id, currentView.JSON.elements);
										} else {
											scope.saveAndExit = saveAsDeviceGroupModel;
											runAsDeviceGroupModel.call(scope, id);
										}

									}
								} else {
									throw event.message;
								}

							}, function error(err) {
								console.log(err)
							});
						} else {
							throw event.message;
						}
					} catch (err) {
						console.log(err);
					}
				});
			}
			function saveAsDeviceModel(){
				var data = [];
				if(scope.receivedList instanceof Array)
				{
					data = scope.receivedList.map(function(element) {
						return {
							instance: element.instance,
							top: element.top,
							left: element.left,
							kpi: {
								label: element.kpi.label,
								id: element.kpi.id,
								icon: element.kpi.icon,
								nodeId: element.kpi.nodeId
							},
							model : {
								label : element.model.label,
								id : element.model.id
							}
						};
					});
				}
				var content = {
					bgImgId: scope.bgImgId,
					elements: data
				};
				solutionUIService.saveServiceViewContent(solutionId, 0, JSON.stringify(content), callback);
				function callback(event)
				{
					console.log(event);
					window.location.href = "../app-ac/index.html#/myView";
				}
			};
			function saveAsDeviceGroupModel(){
				var data = [];
				if(scope.receivedList instanceof Array)
				{
					data = scope.receivedList.map(function(element) {
						return {
							instance: element.instance,
							top: element.top,
							left: element.left,
							kpi: {
								label: element.kpi.label,
								id: element.kpi.id,
								icon: element.kpi.icon,
								nodeId: element.kpi.nodeId
							},
							model : {
								label : element.model.label,
								id : element.model.id
							}
						};
					});
				}
				var content = {
					bgImgId: scope.bgImgId,
					elements: data
				};
				solutionUIService.saveServiceViewContent(solutionId, id, 0, JSON.stringify(content), callback);
				function callback(event)
				{
					window.location.href = "../app-ac/index.html#/myView";
				}
			};
			function runAsDevice(nodeId, receivedList) {
				var modelId, temlateView, resources = [];
				scope.step = 1;
				scope.receivedList = receivedList ? receivedList : [];
				scope.receivedList = scope.receivedList.map(function(element){
					return new rArrList(element);
				});
				getServiceViewMap();
				getResource();
				if($.isArray(scope.receivedList))
				{
					if(scope.receivedList.length > 0)
					{
						scope.receivedList = receivedList ? receivedList : [];
						scope.receivedList = scope.receivedList.map(function(element){
							return new rArrList(element);
						});
						getResource();
					}
					else
					{
						getServiceViewMap();
					}
				}
				else
				{
					getServiceViewMap();
				}

				function getServiceViewMap()
				{
					viewFlexService.getServiceViewMap(function(event){
						var content = {};
						if(event.code == "0")
						{
							temlateView = event.data;
						}
					});
					getResource();
				}
				function getResource()
				{
					resourceUIService.getResourceById(nodeId, function(event) {
						try {
							if (event.code == '0') {
								scope.equipment.device = event.data;
								resources = [event.data].map(function(element) {
									return {
										id: element.id,
										gatewayId: element.gatewayId,
										label: element.label,
										show: true
									}
								});
								modelId = event.data.modelId;
								if(typeof temlateView[modelId] == 'string'){
									var objectLike = /\{.*\}/;
									console.log(temlateView);
									if(objectLike.test(temlateView[modelId]))
									{
										content = JSON.parse(temlateView[modelId])
									}
									scope.receivedList = content.elements.map(function(element){
										return new rArrList(element);
									});
									scope.bgImgId = content.bgImgId;
								}
								resourceUIService.getModelByIds([modelId], function(returnObj){
									if (returnObj.code == "0") {
										scope.models = returnObj.data;
									}
								});
								resourceUIService.getKpisByModelId(modelId, function(returnObj) {
									if (returnObj.code == 0) {
										resources.forEach(function(res){
											res.fold = true;
											res.kpiArray = [];
											returnObj.data.forEach(function(kpi) {
												var used = scope.receivedList.some(function(userkpi) {
													return kpi.id == userkpi.kpi.id;
												})
												kpi.show = !used;
												res.kpiArray.push(kpi)
											});
										});
									}
									scope.resources = resources;
									for(var i in scope.receivedList) {
										(function(index, element){
											var find = resources.find(function(elem){
												return element.resource.id == elem.id;
											});
											if(find)
											{
												element.resource = find;
											};
										})(i, scope.receivedList[i])
									}
								});

							} else {
								throw event.message;
							}
						} catch (err) {
							console.log(err);
						}
					})
				}
			}
			function runAsDeviceModel(deviceModelId)
			{
				solutionUIService.getServiceViewContent(solutionId, 0, deviceModelId, function(event){
					var content = {};
					if(event.code == "0")
					{
						if(typeof event.data == 'string'){
							var objectLike = /\{.*\}/;
							if(objectLike.test(event.data))
							{
								content = JSON.parse(event.data)
							}
						}
						if(content.elements)
						{
							scope.receivedList = content.elements.map(function(element){
								return new rArrList(element);
							});
						}
						scope.bgImgId = content.bgImgId;
					}
				});
				scope.step = 1;
				resourceUIService.getModelByIds([deviceModelId], callback);
				function callback(event){
					try
					{
						if(event.code == "0")
						{
							scope.models = event.data;
							for(var i in scope.models)
							{
								(function(index, element){
									element.fold = true;
									serviceCenterService.kpis.getBymodelId(element.id).then(function(data){
										element.kpiArrays = data;
									})
								})(i, scope.models[i])
							}
							console.log(scope.models);
						}
						else
						{
							throw event.message;
						}
					}
					catch(err)
					{
						console.log(err)
					}
				};
				/* 2016 - 05 - 31
				 resourceUIService.getModelsByGroupId(deviceGroupModelId, callback);
				 function callback(event){
				 try {
				 if (event.code == '0') {
				 deferred.resolve(event.data)
				 } else {
				 throw event.message;
				 }
				 } catch (err) {
				 console.log(err);
				 }
				 }
				 */
				//resourceUIService.getAttrsByModelId
			}
			function runAsDeviceGroupModel(deviceGroupModelId)
			{
				/* 2016 - 05 - 31
				var modelGroup = {
					id : deviceGroupModelId
				};
				$modelGroup.call(modelGroup, undefined).then(function success(modelGroup) {
					scope.equipment.modelGroup = modelGroup;
					console.log(scope.equipment)
				});
				*/
				solutionUIService.getServiceViewContent(solutionId, deviceGroupModelId, 0, function(event){
					var content = {};
					if(event.code == "0")
					{
						if(typeof event.data == 'string'){
							var objectLike = /\{.*\}/;
							if(objectLike.test(event.data))
							{
								content = JSON.parse(event.data)
							}
						}
						if(content.elements)
						{
							scope.receivedList = content.elements.map(function(element){
								return new rArrList(element);
							});
						}
						scope.bgImgId = content.bgImgId;
					}
				});
				scope.step = 1;
				solutionUIService.getModelsByGroupId(solutionId, deviceGroupModelId, callback);
				function callback(event){
					try
					{
						if(event.code == "0")
						{
							scope.models = event.data;
							for(var i in scope.models)
							{
								(function(index, element){
									element.fold == true;
									element.unfold = function(){
										var cur = this;
										var bool = !cur.fold;
										for(var j in scope.models)
										{
											scope.models[j].fold = false;
										}
										cur.fold = bool;
									}
									serviceCenterService.kpis.getBymodelId(element.id).then(function(data){
										element.kpiArrays = data;
									})
								})(i, scope.models[i])
							}
							console.log(scope.models);
						}
						else
						{
							throw event.message;
						}
					}
					catch(err)
					{
						console.log(err)
					}
				};
				/* 2016 - 05 - 31
				resourceUIService.getModelsByGroupId(deviceGroupModelId, callback);
				function callback(event){
					try {
						if (event.code == '0') {
							deferred.resolve(event.data)
						} else {
							throw event.message;
						}
					} catch (err) {
						console.log(err);
					}
				}
				*/
				//resourceUIService.getAttrsByModelId
			}
			function runAsDeviceGroup(deviceGroupId, receivedList) {
				var deviceGroupModelId;
				var deferred = q.defer();
				var promise = deferred.promise;
				var curRes;
				scope.receivedList = receivedList ? receivedList : [];
				scope.receivedList = scope.receivedList.map(function(element){
					return new rArrList(element);
				});
				var modelIdused;
				if (deviceGroupId) {
					resourceUIService.getResourceById(deviceGroupId, function(event) {
						try {
							if (event.code == '0') {
								deferred.resolve(event.data)
							} else {
								throw event.message;
							}
						} catch (err) {
							deferred.reject(err);
						}
					});
				} else {
					deferred.resolve(undefined);
				}
				promise.then(function success(resource) {
					curRes = resource;
					$DeviceGroupModels.get().then(function success(data) {
						for (var i in data) {
							(function(index, element) {
								attrsFn.call(element)
							})(i, data[i])
						}
						scope.modelGroups = data;
						if(resource != undefined)
						{
							var find =  scope.modelGroups.find(function(element){
								return element.id == resource.modelId && resource.modelId != undefined;
							});
							if(find)
							{
								scope.equipment.modelGroup = find;
							}
							else
							{
								scope.equipment.modelGroup = scope.modelGroups[0];
							}
							scope.equipment.modelGroup.onChange();
						}
						if(scope.equipment.modelGroup){
							$modelGroup.call(scope.equipment.modelGroup, resource ? resource.values : undefined).then(function success(modelGroup) {
								console.log(modelGroup);
							});
						}
					}, function error(err) {
						console.log(err)
					});
				}, function error(err) {
					console.log(err);
				});
				function attrsFn() {
					var cur = this;
					cur.onChange = function() {
						$modelGroup.call(scope.equipment.modelGroup);
						viewFlexService.getServiceViewMap(function(event){
							var content = {};
							if(event.code == "0")
							{
								if(typeof event.data[cur.id] == 'string'){
									var objectLike = /\{.*\}/;
									console.log(event.data[cur.id]);
									if(objectLike.test(event.data[cur.id]))
									{
										content = JSON.parse(event.data[cur.id])
									}
									if(!id)
									{
										scope.receivedList = content.elements.map(function(element){
											return new rArrList(element);
										});
									}
									/*
									for(var i in receivedList)
									{
										var modelId = receivedList[i].model.id;
										var kpiId = receivedList[i].kpi.id;
										var find = scope.receivedList.some(function(elem){
											console.log(elem.model.id, modelId, elem.kpi.id, kpiId);
											return elem.model.id == modelId && elem.kpi.id == kpiId
										});

										if(!find)
										{
											scope.receivedList.push(receivedList[i]);
										}
									}
									*/
									scope.bgImgId = content.bgImgId;
								}
							}
						});
					}
				}
				scope.nextStep = function() {
					var defers = [];
					scope.step = 1;
					//viewFlexService.getServiceViewMap(callback);

					if(solutionId != 0)
					{
						resourceUIService.getModels(callback);
					}
					else
					{
						$models.getAll().then(function(data){
							callback({
								code : '0',
								data : data
							})
						})
					}
					function callback(event)
					{
						if(event.data instanceof Array)
						{
							scope.models = event.data;
						}
						else
						{
							scope.models = []
						}
						//---------------if model does not exist, must query the model and fill into the list.----------------------
						//---------------and remove those devices which cannot be found in the list --------------------------------
						var clone = [];
						for(var i in scope.receivedList)
						{
							(function(index, ele){
								if(typeof ele.model != "object" || ele.model == null)
								{
									if(typeof ele.resource == "object" && ele.resource != null)
									{
										var resourceId = ele.resource.id;
										resourceUIService.getResourceById(resourceId, function(event){
											if(event.code == "0")
											{
												var find = scope.models.find(function(element){
													if(event.data != null)
													{
														return element.id == event.data.modelId;
													}
													else
													{
														return false;
													}

												})
												if(find){
													ele.model = {
														id : find.id,
														label : find.label
													}
												}
											}
										})
									}
								}
							})(i, scope.receivedList[i])
						}
						//----------------------------------------------------------------------------------------------------------
						if(event.code == "0")
						{
							for (var i in scope.models) {
								var defer = q.defer();
								defers.push(defer.promise);
								(function(index, element, defer) {
									var modelId = element.id;
									element.fold == false;
									element.unfold = function(){
										var cur = this;
										var bool = !cur.fold;
										for(var j in scope.models)
										{
											scope.models[j].fold = false;
										}
										cur.fold = bool;
									}
									serviceCenterService.resources.getBymodelId(modelId).then(function success(data) {
										element.resourcesArray = data.map(function(element) {
											return {
												id: element.id,
												gatewayId: element.gatewayId,
												label: element.label,
												show: true,
												fold : false,
												unfold : unfold
											}
										});
										function unfold()
										{
											var cur = this;
											var bool = !cur.fold;
											for(var j in element.resourcesArray)
											{
												element.resourcesArray[j].fold = false;
											}
											cur.fold = bool;
										};
										serviceCenterService.kpis.getBymodelId(modelId).then(function success(data) {
											//console.log(event);
											for (var i in element.resourcesArray) {
												(function(index, res) {
													res.kpiArray = data.map(function(kpi) {
														var result = {}, received;
														var received = scope.receivedList.find(function(element) {
															if(element.resource)
															{
																return element.resource.id == res.id && element.kpi.id == kpi.id;
															}
															else
															{
																return false;
															}
														});
														result = {
															show: received == undefined,
															icon: kpi.icon,
															nodeId: res.id,
															id: kpi.id,
															label: kpi.label
														};
														return result;
													});
													var findRes = scope.receivedList.filter(function(element) {
														if(element.resource)
														{
															//console.log(element.resource.id, "--", res.id);
															return element.resource.id == res.id;
														}
														else
														{
															return false;
														}
													});
													if(findRes)
													{
														for(var j in findRes)
														{
															findRes[j].resource.kpiArray = res.kpiArray;
														}
													}
												})(index, element.resourcesArray[i]);
											}

											//resource.kpis = data;
											//Array.prototype.push.apply(resources, resource);
											defer.resolve("success");
											/*
											 resourceUIService.getCanRelatedToGroupDevicesByModelId(modelId, function(event){

											 });
											 */
										}, function error(err) {
											console.log(err);
										})
									}, function error(err) {
										console.log(err);
									})
								})(i, scope.models[i], defer)
							}
							q.all(defers).then(function success(data) {
								//remove Array from list which is not found in resource list.
								scope.receivedList = scope.receivedList.filter(function(element){
									var modelId = element.model.id;
									var find = scope.models.some(function(element){
										return element.id == modelId;
									})
									return find;
									/*
									if(typeof element.resource == 'object' && element.resource != null)
									{
										return element.resource.kpiArray != undefined;
									}
									else
									{
										return false;
									}
									*/
								});
								//scope.resources = resources;
								/*
								scope.receivedList = scope.receivedList.filter(function(element) {
									return resources.find(function(el) {
										return el.id == element.resource.id
									});
								});
								*/
							}, function error(err) {
								console.log(err)
							});
						}
					}
					/*
					$models.getAll().then(function success(data) {
						var defers = [];
					}, function error(err) {
						console.log(err);
					});
					*/
				}
			}
      /* 2016 - 05 - 31*/
      function saveAsDevice() {
        var data = scope.receivedList.map(function(element) {
          return {
            instance: element.instance,
            top: element.top,
            left: element.left,
            kpi: {
              label: element.kpi.label,
              id: element.kpi.id,
              icon: element.kpi.icon,
              nodeId: element.kpi.nodeId
            },
            resource: {
              label: element.resource.label,
              id: element.resource.id
            }
          };
        });
        var content = {
          nodeId: scope.resources[0].id,
          bgImgId: scope.bgImgId,
          elements: data
        }
        var param = {
          viewTitle: scope.resources[0].label,
          viewName: "topology",
          viewType: "topology",
          content: JSON.stringify(content)
        };
        viewFlexService.addView(param, function(event) {
          if (event.code == 0) {
            window.location.href = "../app-sc/index_consumer.html#/nongye";
          }
        });
      }

      function updateAsDevice() {
        var data = scope.receivedList.map(function(element) {
          return {
            instance: element.instance,
            top: element.top,
            left: element.left,
            kpi: {
              label: element.kpi.label,
              id: element.kpi.id,
              icon: element.kpi.icon,
              nodeId: element.kpi.nodeId
            },
            resource: {
              label: element.resource.label,
              id: element.resource.id
            }
          };
        });
        var content = {
          nodeId: currentView.JSON.nodeId,
          bgImgId: scope.bgImgId,
          elements: data
        };
        var param = {
          viewId: currentView.viewId,
          originalViewId: 0,
          viewTitle: scope.resources[0].label,
          viewName: "topology",
          viewType: "topology",
          content: JSON.stringify(content)
        };
        viewFlexService.updateView(param, function(event) {
          if (event.code == 0) {
            window.location.href = "../app-sc/index_consumer.html#/nongye";
          }
        })
      }

      function saveAsDeviceGroup() {
        hasEmpty = scope.receivedList.some(function(element) {
          return element.resource != undefined && element.resource != null;
        });
        if (hasEmpty) {
          scope.msg = {
            title: "有未绑定数据标签",
            content: "有标签未绑定数据，保存之后这些标签将被删除，是否继续？",
            btnlist: [{
              text: "取消",
              fn: cancelDataFn
            }, {
              text: "继续",
              fn: saveDataFn
            }]
          }
        } else {
          saveDataFn()
        }

        function cancelDataFn() {
          scope.msg = undefined;
        }

        function saveDataFn() {
          var deviceGroup = {};
          scope.equipment.modelGroup.attributesDes;
          for (var i in scope.equipment.modelGroup.attributesDes) {
            (function(index, element) {
              var attrName = element.name;
              if (scope.equipment.modelGroup.values == undefined) {
                scope.equipment.modelGroup.values = {};
              }
              scope.equipment.modelGroup.values[attrName] = element.value;
            })(i, scope.equipment.modelGroup.attributesDes[i])
          }
          scope.equipment.modelGroup.modelId = scope.equipment.modelGroup.id;
          for (var j in scope.equipment.modelGroup) {
            (function(attr, val) {
              deviceGroup[attr] = val;
            })(j, scope.equipment.modelGroup[j])
          };
          scope.receivedList = scope.receivedList.filter(function(element) {
            return element.resource != undefined && element.resource != null;
          });
          var data = scope.receivedList.map(function(element) {
            return {
              title: element.title,
              instance: element.instance,
              top: element.top,
              left: element.left,
              model: {
                label: element.model.label,
                id: element.model.id
              },
              kpi: {
                label: element.kpi.label,
                id: element.kpi.id,
                icon: element.kpi.icon,
                nodeId: element.kpi.nodeId
              },
              resource: {
                label: element.resource.label,
                id: element.resource.id
              }
            };
          });
          console.log(data)
          resourceUIService.saveDeviceGroup(deviceGroup, function(event) {
            console.log(event);
            try {
              if (event.code == '0') {
                var deviceGroupId = event.data.id;
                deviceToGroup = scope.receivedList.map(function(element) {
                  return {
                    label: element.label,
                    deviceGroupId: deviceGroupId,
                    deviceId: element.resource.id,
                    kpiId: element.kpi.id
                  }
                });
                resourceUIService.saveDeviceToGroups(deviceGroupId, deviceToGroup, function(event) {
                  try {
                    if (event.code == '0') {
                      var content = {
                        label: scope.equipment.label,
                        nodeId: deviceGroupId,
                        bgImgId: scope.bgImgId,
                        elements: data
                      }
                      var param = {
                        viewTitle: "topology",
                        viewName: "topology",
                        viewType: "topology",
                        content: JSON.stringify(content)
                      };
                      viewFlexService.addView(param, function(event) {
                        if (event.code == 0) {
                          window.location.href = "../app-sc/index_consumer.html#/nongye";
                        } else {
                          throw event.message;
                        }
                      });
                    } else {
                      throw event.message;
                    }
                  } catch (err) {
                    console.log(err);
                  }
                });
              } else {
                throw event.message;
              }
            } catch (err) {
              console.log(err)
            }
          });
        }
      }

			function updateAsDeviceGroup() {
				var deviceGroup = {};
				scope.equipment.modelGroup.attributesDes;
				for (var i in scope.equipment.modelGroup.attributesDes) {
					(function(index, element) {
						var attrName = element.name;
						if (scope.equipment.modelGroup.values == undefined) {
							scope.equipment.modelGroup.values = {};
						}
						scope.equipment.modelGroup.values[attrName] = element.value;
					})(i, scope.equipment.modelGroup.attributesDes[i])
				}
				scope.equipment.modelGroup.modelId = scope.equipment.modelGroup.id;
				for (var j in scope.equipment.modelGroup) {
					(function(attr, val) {
						deviceGroup[attr] = val;
					})(j, scope.equipment.modelGroup[j])
				};
				deviceGroup.id = parseInt(id);
				var data = scope.receivedList.map(function(element) {
					var result = {
						instance: element.instance,
						top: element.top,
						left: element.left,
						kpi: {
							label: element.kpi.label,
							id: element.kpi.id,
							icon: element.kpi.icon,
							nodeId: element.kpi.nodeId
						},
						resource: {
							label: element.resource.label,
							id: element.resource.id
						}
					};
					if(element.model)
					{
						result.model = {
							label : element.model.label,
							id : element.model.id
						}
					}
					else
					{

					}
					return result;
				});
				resourceUIService.saveDeviceGroup(deviceGroup, function(event) {
					try {
						if (event.code == '0') {
							var deviceGroupId = event.data.id;
							deviceToGroup = scope.receivedList.map(function(element) {
								return {
									label: element.label,
									deviceGroupId: deviceGroupId,
									deviceId: element.resource.id,
									kpiId: element.kpi.id
								}
							});
							resourceUIService.saveDeviceToGroups(deviceGroupId, deviceToGroup, function(event) {
								try {
									if (event.code == '0') {
										var content = {
											label: scope.equipment.label,
											nodeId: deviceGroupId,
											bgImgId: scope.bgImgId,
											elements: data
										}
										var param = {
											viewId: currentView.viewId,
											originalViewId: 0,
											viewTitle: "topology",
											viewName: "topology",
											viewType: "topology",
											content: JSON.stringify(content)
										};
										viewFlexService.updateView(param, function(event) {
											if (event.code == 0) {
												window.location.href = "../app-sc/index_consumer.html#/nongye";
											} else {
												throw event.message;
											}
										});
									} else {
										throw event.message;
									}
								} catch (err) {
									console.log(err);
								}
							});
						} else {
							throw event.message;
						}
					} catch (err) {
						console.log(err)
					}
				});
			}

			function bgSelect(path) {
				var css = {
					"background-image": "url(../" + path + ")"
				}
				return css;
			};

			function renderBgImg(path) {
				return path ? {
					"background-image": "url(../" + path + ")"
				} : {};
			}

			function kpiIcon(channelType) {
				switch (channelType) {
					case "temperature":
						return {
							"background-image": "url(images/elementIcon/are_temp.svg)"
						}
						break;
					case "humidity":
						return {
							"background-image": "url(images/elementIcon/area_humid.svg)"
						}
						break;
					default:
						return {
							"background-image": "url(images/elementIcon/are_temp.svg)"
						}
						break;
				}
			}

			function sensorIcon(channelType) {
				switch (channelType) {
					case "temperature":
						return {
							"background-image": "url(images/elementIcon/are_temp.svg)"
						}
						break;
					case "humidity":
						return {
							"background-image": "url(images/elementIcon/area_humid.svg)"
						}
						break;
					default:
						return {
							"background-image": "url(images/elementIcon/are_temp.svg)"
						}
						break;
				}
			}

			function renderImage(id, kpis) {
				var unit;
				for (var i in kpis) {
					if (id == kpis[i].id) {
						unit = kpis[i].unit;
					}
				}
				switch (unit) {
					case "Amount":
						return {
							"background-image": "url(images/elementIcon/agriculture.svg)"
						};
						break;
					case "Temperature":
						return {
							"background-image": "url(images/elementIcon/agriculture.svg)"
						};
						break;
					default:
						return {}
						break;
				}
			}
			function createNewGraph() {
				window.location.reload();
			}

			function backService() {
				window.location.href = "../app-sc/index_consumer.html#/nongye";
			}

			function backsolution() {
				window.location.href = "../app-ac/index.html#/myView";
			}

			function accomplished() {
				window.open("../../app/index_consumer.html#/dashboard3", "_self");
			}

			function prevStep_Btn() {
				scope.step = 0;
			}

			function bgSel_click(obj) {
				scope.bgImgId = obj.path;
			}

			function randomString(len) {
				len = len || 32;
				var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
				var maxPos = $chars.length;
				var pwd = '';
				for (i = 0; i < len; i++) {
					pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
				}
				return pwd;
			}
		})
	}]);
});