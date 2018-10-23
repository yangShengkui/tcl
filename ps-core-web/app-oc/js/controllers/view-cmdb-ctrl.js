define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
	'use strict';
	controllers.controller('ViewCmdbCtrl', ['$scope', '$routeParams', '$timeout', 'kpiDataService', 'userLoginUIService', 'resourceUIService', 'alertService',
		'SwSocket', 'Info', 'viewFlexService', 'unitService', 'growl', 'userDomainService', 'userEnterpriseService',
		function($scope, $routeParams, $timeout, kpiDataService, userLoginUIService, resourceUIService, alertService,
			SwSocket, Info, viewFlexService, unitService, growl, userDomainService, userEnterpriseService) {
			console.info("切换到资源管理");
			$scope.routePaths = [];
			$scope.routePathNodes = {};
			$scope.selectedDitem = null;
			$scope.selectedDomainitem = null;
			$scope.selectedGateitem = null;
			$scope.selectedDirective = null;
			$scope.visible = false;
			$scope.editVisible = false;
			$scope.treeAry = [];
			$scope.domainsAry = [];
			$scope.gatewaysAry = [];
			$scope.activeMainTab = "设备类型视图";
			$scope.activeTab = '属性';
			$scope.previousMainTab;
			$scope.activeListTab = "tab1";
			$scope.queryDomin = "";
			var uuid = Math.uuid();
			var columns = [];
			var columsData = [];
			var activeTab;
			var previousTab;
			var previousDomainID;
			var previousDomainPath;
			var addUserStatus = false;
			 var info = Info.get("localdb/icon.json", function(info) {
				$scope.iconList = info.qualityIcon;
				$scope.kpiIconList = info.kpiIcon;
			});
			var callback = function(evendata) {
				console.log("callback:", evendata);
				var addDatas = [];
				$scope.$broadcast('OptionStatusChange', {
					"data": addDatas
				});
			};
			var getViewId = function(pName) {
				for (var i in viewFlexService.viewList) {
					var v = viewFlexService.viewList[i];
					if (v.viewType == 'designView' && pName.search(v.viewTitle) > -1) {
						return v.viewId;
					}
				}
				return 0;
			};
			var getColumns = function(ary) {
				for (var i in ary) {
					var col = ary[i];
					if (col.visible == true || col.visible == "true") {
						var colobj = new Object();
						colobj.data = col.dataField;
						colobj.title = col.headerText;
						columns.push(colobj);
					}
				}
			}
			var formatDate = function(str) {
				if (str) {
					str = newDateJson(str).Format(GetDateCategoryStrByLabel());
				}
				return str;
			}
			var getIcon = function(random) {
				var icon;
				switch (true) {
					case random > 0.9:
						icon = "fa fa-hospital-o";
						break;
					case random > 0.8:
						icon = "fa fa-truck";
						break;
					case random > 0.7:
						icon = "fa fa-tv";
						break;
					case random > 0.6:
						icon = "fa fa-users";
						break;
					case random > 0.5:
						icon = "fa fa-bolt";
						break;
					case random > 0.4:
						icon = "fa fa-bank";
						break;
					default:
						icon = "fa fa-plus";
				}
				return icon;
			}
			var getDomainUserCount = function(domain, callback) {
				userDomainService.getAssociateDomain2User(domain.domainPath, function(returnObj) {
					var domainUsers = returnObj.data;
					domain.count = domainUsers.length;
				})
			}
			var getDomainDeviceCount = function(domain, callback) {
				resourceUIService.getResourcesByDomainPath(domain.domainPath, function(returnObj) {
					var domainDevices = returnObj.data;
					domain.count = domainDevices.length;
				})
			}
			var getResourceCount = function(model, callback) {
				resourceUIService.getResourceByModelId(model.id, function(returnObj) {
					if (returnObj.code == 0) {
						var resources = returnObj.data;
						model.count = resources.length;
						model.resources = resources;
						model.isLoaded = model.isLoaded + 1;
						if (callback) {
							callback();
						}
					};
				});
			}

			var initDateRanger = function() {
				return;
				$('input[name="daterange"]').daterangepicker({
					timePicker: true,
					timePicker24Hour: true,
					autoUpdateInput: true,
					opens: "left",
					locale: {
						format: 'YYYY/MM/DD HH:mm:ss'
					}
				});
			}

			/**
			 * 获取资源域视图,此资源域下关联的域用户
			 */
			var getUserFromThisDomain = function() {
				//获取域用户
				var domainPath = $scope.selectedDomainitem.domainPath;
				//查看资源域关联的 域用户
				if (domainPath != "") {
					userDomainService.getAssociateDomain2User(domainPath, function(resultObj) {
						if (resultObj.code == 0) {
							for (var i in resultObj.data) {
								var obj = resultObj.data[i];
								obj.isEdit = 0;
							}
							$scope.domainUserData.data = resultObj.data;
							$scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainUserData);
						}
					})
				} else {
					$scope.domainUserData.data = [];
					$scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainUserData);
				}
			}
			$scope.domainUsers = [];
			var getDomainUsers = function() {
				$scope.domainUsers = [];
				getUserFromThisDomain();
			}


			$scope.gatewayDevices = [];
			$scope.gatewayactiveDevices = [];
			var getDevices = function(gateway) {
				$scope.gatewayDevices = [];
				$scope.gatewayactiveDevices = [];
				gateway.devices = gateway.devices ? gateway.devices : [];
				for (var i in gateway.devices) {
					if (gateway.devices[i].managedStatus != "active") {
						$scope.gatewayDevices.push(gateway.devices[i]);
					}
				}

				$scope.$broadcast(Event.CMDBINFOSINIT + "GATE", {
					data: $scope.gatewayDevices
				});
				resourceUIService.getResourcesByGatewayId(gateway.id, function(returnObj) {
					if (returnObj.code == 0) {
						for (var i in returnObj.data) {
							if (returnObj.data[i].managedStatus == "active")
								$scope.gatewayactiveDevices.push(returnObj.data[i]);
						}

						$scope.$broadcast(Event.CMDBINFOSINIT + "GATEACTIVE", {
							data: $scope.gatewayactiveDevices
						});
					};
				});
			}
			var getResourceAttrs = function(model, callback) {
				resourceUIService.getAttrsByModelId(model.id, function(returnObj) {
					if (returnObj.code == 0) {
						model.attrs = returnObj.data;
						model.isLoaded = model.isLoaded + 1;
						if (callback) {
							callback();
						}
					};
				});

			}
			var getResourceKpis = function(model) {
				resourceUIService.getKpisByModelId(model.id, function(returnObj) {
					if (returnObj.code == 0) {
						model.kpis = returnObj.data;
					};
				});
			}
			var getResourceAlerts = function(model) {
				resourceUIService.getAlertsByModelId(model.id, function(returnObj) {
					if (returnObj.code == 0) {
						model.alerts = returnObj.data;
						model["thresholds"] = [];
						for (var i = 0; i < model.alerts.length; i++) {
							(function(obj, objId, alertId) {
								resourceUIService.getThresholds(objId, alertId, function(response) {
									if (response.code == 0) {
										if (response.data.length > 0) {
											obj["thresholds"].push({
												"alertCode": alertId,
												"thresholdsData": response.data
											});
										}
									};
								});
							})(model, model.id, model.alerts[i].id);
						}
					};
				});
			}
			var getResourceDirectives = function(model) {
				model.directives = [];
				resourceUIService.getDirectivesByModelId(model.id, function(returnObj) {
					if (returnObj.code == 0) {
						model.directives = returnObj.data;
					};
				});
			}

			var getResourceState = function(ids) {
				kpiDataService.getRealTimeKpiData(ids, [999999], function(returnObj) {
					if (returnObj.code == 0) {
						for (var i in returnObj.data) {
							for (var j in resourceUIService.selectedInstances) {
								if (returnObj.data[i].nodeId == resourceUIService.selectedInstances[j].id) {
									resourceUIService.selectedInstances[j].health = 100 - (returnObj.data[i].value * 20)
								}
							}
							$scope.$broadcast(Event.CMDBINFOSINIT, {
								"option": [resourceUIService.selectedInstances, resourceUIService.selectedAttrs]
							});
						}
					}
				});
			}
			var initModelAtts = function(obj, idx) {
				obj.count = 0;
				var random = Math.random();
				// obj.icon = getIcon(random);
				obj.alertlv = random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
				obj.isLoaded = 0;
				obj.type = 0;
				if (idx == 0) {
					getResourceCount(obj, function() {
						if ($scope.selectedDitem.isLoaded >= 2)
							getinstanceList($scope.selectedDitem);
					});
					getResourceAttrs(obj, function() {
						if ($scope.selectedDitem.isLoaded >= 2)
							getinstanceList($scope.selectedDitem);
					});
				} else {
					getResourceCount(obj);
					getResourceAttrs(obj);
				}

				getResourceKpis(obj);
				getResourceAlerts(obj);
				getResourceDirectives(obj);
				return obj;
			}
			var initDomainData = function() {
				var obj = {};
				obj.id = 0;
				obj.domainID = 0;
				obj.domainPath = "";
				obj.domainName = "";
				obj.description = "";
				obj.count = 0;
				var random = Math.random();
				obj.icon = getIcon(random);
				obj.alertlv = random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
				obj.isLoaded = 0;
				obj.type = 1;
				obj.label = obj.name;
				return obj;
			}
			var initDomainAtts = function(obj, idx) {
				obj.id = obj.id ? obj.id : 0;
				obj.domainID = obj.domainID ? obj.domainID : 0;
				obj.domainPath = obj.domainPath ? obj.domainPath : "";
				obj.domainName = obj.domainName ? obj.domainName : "";
				obj.description = obj.description ? obj.description : "";
				obj.count = 0;
				var random = Math.random();
				obj.icon = getIcon(random);
				obj.alertlv = random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
				obj.isLoaded = 0;
				obj.type = 1;
				obj.label = obj.name;

				if (idx == 0) {
					getDomainDeviceCount(obj, function() {
						//待增加内容：获取设备列表的列表
					});
				} else {
					getDomainDeviceCount(obj, function() {
						//待增加内容：获取设备列表的列表
					});
				}
				return obj;
			}
			var initGatewayAtts = function(obj, idx) {
				obj.id = obj.id ? obj.id : 0;
				obj.name = obj.name ? obj.name : "新增网关";
				obj.externalGwId = obj.externalGwId ? obj.externalGwId : "";
				obj.accessName = obj.accessName ? obj.accessName : "";
				obj.accessPassword = obj.accessPassword ? obj.accessPassword : "";
				obj.protocolType = obj.protocolType ? obj.protocolType : "";
				obj.count = obj.devices ? obj.devices.length : 0;
				var random = Math.random();
				obj.icon = getIcon(random);
				obj.alertlv = obj.operationStatus == 4 ? "bg-red" : (obj.operationStatus == 3 ? "bg-orange" : (obj.operationStatus == 2 ? "bg-yellow" : "bg-green"));
				obj.isLoaded = 0;
				obj.label = obj.name;
				obj.onlineStatus = obj.onlineStatus ? obj.onlineStatus : 'online';
				obj.managedStatus = obj.managedStatus ? obj.managedStatus : 'deactive';
				//				obj.onlineStatuslab = obj.onlineStatus== 'offline'?'离线':'在线';
				//				obj.onlineStatuslv = obj.onlineStatus== 'offline'?'bg-aqua':'bg-green';
				//				obj.managedStatuslab = obj.managedStatus=="deactive"?'未激活':'激活';
				//				obj.managedStatuslv = obj.managedStatus=="deactive"?'bg-aqua':'bg-green';
				obj.activeTime = obj.activeTime ? (newDateJson(obj.activeTime).Format(GetDateCategoryStrByLabel(''))) : "";
				obj.expireTime = obj.expireTime ? (newDateJson(obj.expireTime).Format(GetDateCategoryStrByLabel(''))) : "";
				obj.validTime = "";
				if (obj.activeTime && obj.expireTime) {
					obj.validTime = "从" + obj.activeTime + "到" + obj.expireTime;
				}

				return obj;
			}
			var urmpTree = function(ciName) {
				resourceUIService.getModels(function(returnObj) {
					resourceUIService.treeAry = [];
					if (returnObj.code == 0) {
						var tree = returnObj.data;
						for (var i in tree) {
							var obj = tree[i];
							if (!$scope.routePathNodes[obj.parentModelId])
								$scope.routePathNodes[obj.parentModelId] = [];
							$scope.routePathNodes[obj.parentModelId].push(obj);
							if (!$scope.routePathNodes[obj.id])
								$scope.routePathNodes[obj.id] = [];
							resourceUIService.treeAry.push(jQuery.extend(true, {}, obj));
							initModelAtts(obj);
						}

						var addNodes = function(parentNode) {
							for (var modeid in $scope.routePathNodes) {
								if (modeid == parentNode.id) {
									parentNode.nodes = $scope.routePathNodes[modeid]
									for (var i in parentNode.nodes) {
										addNodes(parentNode.nodes[i])
									}
								}
							}
						}
						var initRoutePath = function(node, arr) {
							for (var i in node.nodes) {
								if ($routeParams.modelId == node.nodes[i].id) {
									arr.push(node);
									break;
								} else {
									initRoutePath(node.nodes[i], arr);
								}
							}
						}
						addNodes(resourceUIService.rootModel);
						if ($routeParams.modelId) {
							if ($scope.routePathNodes[$routeParams.modelId]) {
								var arr = [];
								initRoutePath(resourceUIService.rootModel, arr);
								arr.push(resourceUIService.rootModel);
								$scope.routePaths = arr.reverse();
								var parentNode = arr[arr.length - 1];
								for (var i in parentNode.nodes) {
									if ($routeParams.modelId == parentNode.nodes[i].id) {
										$scope.click(parentNode.nodes[i]);
										initModelAtts(parentNode.nodes[i], 0);
										$scope.treeAry = parentNode.nodes;
										break;
									}
								}
							} else {
								$scope.click(resourceUIService.rootModel.nodes[0]);
								initModelAtts(resourceUIService.rootModel.nodes[0], 0);
								$scope.treeAry = resourceUIService.rootModel.nodes;
							}
						} else {
							$scope.click(resourceUIService.rootModel.nodes[0]);
							initModelAtts(resourceUIService.rootModel.nodes[0], 0);
							$scope.treeAry = resourceUIService.rootModel.nodes;
						}
					}
				});
			};
			var getinstanceList = function(item) {
				var newObjAry = [];
				var nodeIds = [];
				var viewId = getViewId(item.label);
				for (var i in item.resources) {
					var obj = item.resources[i];
					var newObj = {};
					newObj.option = "";
					newObj.id = obj.id;
					newObj.label = obj.label;
					newObj.viewId = viewId;
					newObj.createTime = newDateJson(obj.createTime).Format(GetDateCategoryStrByLabel());
					newObj.state = 1;
					newObj.onlineStatus = obj.onlineStatus ? obj.onlineStatus : 'online';
					newObj.alertlv = Math.floor(Math.random() * 4);
					newObj.externalDevId = obj.externalDevId ? obj.externalDevId : "";
					newObj.values = obj.values;
					newObj.data = obj;
					newObj.health = 100;
					newObj.isEdit = 0;
					newObj.selected = false;
					if (newObj.id == $routeParams.nodeId) {
						newObj.selected = true;
					}
					newObjAry.push(newObj);
					nodeIds.push(obj.id);
				}
				getResourceState(nodeIds);
				resourceUIService.selectedInstances = newObjAry;
				resourceUIService.selectedAttrs = item.attrs;
				$scope.$broadcast(Event.CMDBINFOSINIT, {
					"option": [resourceUIService.selectedInstances, resourceUIService.selectedAttrs]
				});
			};
			var reLoader = function() {
					$scope.selectedDitem.isLoaded = 1;
					getResourceCount($scope.selectedDitem, function() {
						getinstanceList($scope.selectedDitem);
					});
				}
				/**
				 * 在设备类型模式下切换属性/指标/告警/指令
				 */
			var changeDItem = function() {
				if ($scope.activeTab == null || $scope.activeTab == "属性") {

				} else if ($scope.activeTab == "指标") {
					$scope.$broadcast(Event.KPIEDITINIT, {
						"data": $scope.selectedDitem.kpis
					});
				} else if ($scope.activeTab == "告警") {
					$scope.$broadcast(Event.ALERTEDITINIT, {
						"data": $scope.selectedDitem
					});
				} else if ($scope.activeTab == "指令") {
					$scope.$broadcast(Event.DIRECTIVESINIT, {
						"data": $scope.selectedDitem.directives
					});
				}
			};

			//资源域视图 域用户
			$scope.domainUserData = {
					columns: [{
						title: "姓名",
						data: "userName"
					}, {
						title: "Email",
						data: "emailAddress"
					}, {
						title: "移动电话",
						data: "mobilePhone"
					}, {
						title: "办公电话",
						data: "officePhone"
					}, {
						title: "操作",
						orderable:false,
						data: "option"
					}],
					data: [{}],
					columnDefs: [{
						"targets": 0,
						"data": "userName",
						"render": function(data, type, full) {
							//返回自定义名字
							if (full.isEdit == 2 && type == "display") {
								var str = '<select id="userDomainName" name="userName" class="combobox form-control">' +
									'<option value="">请选择用户</option>';
								//赋值

								//判断：
								for (var i in $scope.userGridData.data) {
									//	for (var j in $scope.domainUserData.data) {
									//		if ($scope.userGridData.data[i].userName != $scope.domainUserData.data[j].userName){
									//			str += '<option value="' + $scope.userGridData.data[i].userID + '">' + $scope.userGridData.data[i].userName + '</option>';
									//		}
									//	}
									//if ($scope.domainUserData.data[i].userName == data) {
									str += '<option value="' + $scope.userGridData.data[i].userID + '">' + $scope.userGridData.data[i].userName + '</option>';
									//} else {
									//	str += '<option value="' + $scope.userGridData.data[i].domainID + '">' + $scope.userGridData.data[i].name + '</option>';
									//}

								}
								str += '</select>';
								$scope.domainUserData.data = [];
								return str;
							} else {
								return data;
							}
						}
					}, {
						"targets": 4,
						"data": "option",
						"render": function(data, type, full) {
							// 返回自定义内容
							if (full.isEdit == 2) {

								var str = "<div class='input-group'>";
								str += "<a id='save-btn' class='btn btn-social-icon'><i class='fa fa-check'></i></a>"
								str += "<a id='del-btn' class='btn btn-social-icon'><i class='fa fa-close'></i></a>"
								str += "</div>"
								return str;

							} else {

								var str = "<div class='input-group'>";
								str += "<a id='removeDomain-btn' class='btn btn-social-icon' data-toggle='tooltip' title='删除'><i class='fa fa-minus-square-o'></i></a>"
								str += "</div>"
								return str;

							}
						}
					}]
				}
				//end
				//资源域视图 设备列表
			$scope.domainDeviceData = {
				columns: [{
					data: "id",
					title: "编码"
				}, {
					data: "label",
					title: "名称"
				}, {
					data: "createTime",
					title: "上线时间"
				}, {
					data: "onlineStatus",
					title: "在线状态"
				}, {
					data: "health",
					title: "健康度",
					visible: false
				}, {
					data: "domainPath",
					title: "资源域"
				}, {
					data: "option",
					title: "操作",
					orderable: false
				}],
				columnDefs: [{
					"targets": 3,
					"data": "onlineStatus",
					"render": function(data, type, full) {
						// 返回自定义内容
						return "<span class='label " + (data == 'online' ? "label-primary" : "label-warning") + "'>" + (data == 'online' ? "在线" : "离线") + "</span>";
					}
				}, {
					"targets": 4,
					"data": "health",
					"render": function(data, type, full) {
						// 返回自定义内容
						//自定义随机的健康度---等待接口的实现连接
						data = Math.random() * 100;
						return "<div class='progress progress-xs progress-striped active'><div class='progress-bar " + (data > 90 ? "progress-bar-success" : (data > 60 ? "progress-bar-yellow" : "progress-bar-red")) + "' style='width:" + data + "%'></div></div>";
					}
				}, {
					"targets": 5,
					"data": "domainPath",
					"render": function(data, type, full) {
						//return "<input name='domainPath' domain-Picker class='form-control' type='text'>";
						var str = "";
						if (data != null && data != "") {

							for (var i in $scope.domainsAry) {
								if ($scope.domainsAry[i].domainPath == data) {
									str += "<input name='domainPath' domain-Picker class='form-control' type='text' value='" + $scope.domainsAry[i].label + "' domainPath='" + $scope.domainsAry[i].domainPath + "' data-original-title title>";
									//str += "<input name='domainPath'  domain-Picker class='form-control' type='text' domainPath='' value='请选择...'>"
								}
							}
						}
						if (!str) {
							str += "<input name='domainPath'  domain-Picker class='form-control' type='text' domainPath='' value='请选择...'>"
						}
						return str;
					}
				}, {
					"targets": 6,
					"data": "option",
					"render": function(data, type, full) {
						return '<div class="input-group">' +
							'<a id="save-btn" class="btn btn-social-icon" data-toggle="tooltip" title="保存"><i class="fa fa-check hidden-lg hidden-md hidden-sm"></i></a>' +
							'</div>';
					}
				}]
			};

			/**
			 * 获取资源域视图 设备列表
			 */
			var getDomainDeviceList = function() {
				var domainPath = $scope.selectedDomainitem.domainPath;
				if (domainPath != "") {
					resourceUIService.getResourcesByDomainPath(domainPath, function(resultObj) {

						if (resultObj.code == 0) {

							for (var i in resultObj.data) {
								var obj = resultObj.data[i];
								obj.isEdit = 0;
								obj.onlineStatus = obj.onlineStatus ? obj.onlineStatus : 'online';
							}
							$scope.domainDeviceData.data = resultObj.data;
							$scope.$broadcast(Event.DOMAINDEVICESINIT, $scope.domainDeviceData);
						}
					})
				} else {
					$scope.domainDeviceData.data = [];
					$scope.$broadcast(Event.DOMAINDEVICESINIT, $scope.domainDeviceData);
				}
			}
			$scope.delDomainSubItem = function(item) {
				$scope.editVisible = false;
				growl.success("取消添加资源域成功", {});
				domainTree();
			}
			$scope.click = function(item) {
				$scope.editVisible = false;
				$scope.selectedDirective = null;
				if ($scope.activeMainTab == "设备类型视图") {
					if ($scope.selectedDitem == item) return;
					for (var i in $scope.routePaths) {
						if ($scope.selectedDitem && $scope.routePaths[i].id == $scope.selectedDitem.id) {
							$scope.routePaths.splice(i, 1);
						}
					}
					$scope.selectedDitem = item;
					$scope.routePaths.push(item);
					$scope.visible = true;
					if (item.isLoaded >= 2) {
						getinstanceList(item);
						changeDItem();
					}
					$scope.activeListTab = "tab1";
				} else if ($scope.activeMainTab == "资源域视图") {
					$scope.selectedDomainitem = item;
					//判断是否是已经存在的域还是新添加的域
					if ($scope.selectedDomainitem.domainID != 0) {
						$scope.visible = true;
						if ($scope.activeListTab == "tab3") {
							getDomainDeviceList();
						} else if ($scope.activeListTab == "tab4") {
							//获取域用户
							getUserFromThisDomain();
						}
					} else {
						return;
					}
					//if (item.isLoaded >= 2) {
					//	$scope.activeListTab = "tab3";
					//	changeTabItem();
					//}

				} else if ($scope.activeMainTab == "网关视图") {
					$scope.selectedGateitem = item;
					//					$scope.selectedGateitem.isVirtual = $scope.selectedGateitem.isVirtual ? 'true' : 'false';
					getDevices($scope.selectedGateitem);
				}

			}
			$scope.eidtModel = function() {
				initDateRanger();
				$scope.editVisible = !$scope.editVisible;
			}
			$scope.addModel = function() {
				//判断点击的是设备类型的添加按钮、资源域试图的添加按钮、网关试图的添加按钮
				if ($scope.activeMainTab == "设备类型视图") {
					if ($scope.selectedDitem) {
						var doSave = function(newModelName) {
							for (var i in $scope.treeAry) {
								if (newModelName == $scope.treeAry[i].label) {
									growl.warning("当前有重复设备类型名称，请修改", {});
									return;
								}
							}
							var newModel = {};
							newModel.label = newModelName;
							newModel.id = 0;
							newModel.count = 0;
							newModel.icon = getIcon(0);
							newModel.isLoaded = 0;
							newModel.resources = [];
							newModel.parentModelId = $scope.selectedDitem.id;
							resourceUIService.addModel(newModel, function(returnObj) {
								if (returnObj.code == 0) {
									$scope.selectedDitem = initModelAtts(returnObj.data, 0)
									$scope.treeAry.push($scope.selectedDitem);
									$scope.click($scope.selectedDitem);
									$scope.editVisible = true;
								}
							});
						}
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE, //<input type="text" value="新建' + $scope.selectedDitem.label + '" class="form-control">
							message: '设备类型名称: ' +
								'<input type="text" onkeydown="validatorHTML(event)" onpaste="return false" value="新建' + $scope.selectedDitem.label + '" class="form-control">',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {
									var fruit = dialogRef.getModalBody().find('input').val();
									doSave(fruit);
									dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});
					}
				} else if ($scope.activeMainTab == "资源域视图") {
					for (var i in $scope.domainsAry) {
						var obj = $scope.domainsAry[i];
						if (obj.domainID == 0) {
							growl.warning("当前有未保存资源域", {});
							return;
						}
					}

					//传递当前所选择的domainID,domainPath
					//保存当前选择资源域的domainID，domainPath
					previousDomainID = $scope.selectedDomainitem.domainID;
					previousDomainPath = $scope.selectedDomainitem.domainPath;
					$scope.selectedDomainitem = initDomainData();
					$scope.domainsAry.push($scope.selectedDomainitem);
					$scope.editVisible = true;
					//域名输入框获取到光标
					$('#domain-form input').eq(0).attr('autofocus', 'autofocus');

					//添加操作，把域下面的设备列表和域用户清空
					getDomainDeviceList();
					getDomainUsers();

				} else if ($scope.activeMainTab == "网关视图") {
					for (var i in $scope.gatewaysAry) {
						var obj = $scope.gatewaysAry[i];
						if (obj.id == 0) {
							growl.warning("当前有未保存网关", {});
							return;
						}
					}
					$scope.selectedGateitem = initGatewayAtts({}, i);
					$scope.gatewaysAry.push($scope.selectedGateitem);
					$scope.editVisible = true;

					//新增网关，把该忘关下面的未激活和激活设备列表清空
					$scope.gatewayDevices = [];
					$scope.gatewayactiveDevices = [];
					$scope.$broadcast(Event.CMDBINFOSINIT + "GATE", {
						data: $scope.gatewayDevices
					});
					$scope.$broadcast(Event.CMDBINFOSINIT + "GATEACTIVE", {
						data: $scope.gatewayactiveDevices
					});

				}
			}
			$scope.delModel = function() {
				//增加判断哪一个tab页（设备类型视图，资源域视图，网关视图）
				if ($scope.activeMainTab == "设备类型视图") {
					//先判断设备类型是否有子设备类型，在执行是否删除操作
					//有子节点的设备类型不允许删除
					for (var i in $scope.treeAry) {
						if ($scope.selectedDitem.id == $scope.treeAry[i].parentModelId) {
							growl.warning($scope.selectedDitem.label + " 设备类型有子域，不能删除", {});
							return;
						}
					}
					BootstrapDialog.show({
						title: '提示',
						closable: false,
						//size:BootstrapDialog.SIZE_WIDE,
						message: '确认删除 ' + $scope.selectedDitem.label + ' 设备类型吗？',
						buttons: [{
							label: '确定',
							cssClass: 'btn-success',
							action: function(dialogRef) {
								//判断：若该设备类型关联1个或多个设备，不能删除
								if ($scope.selectedDitem.count != 0) {
									growl.warning($scope.selectedDitem.label + " 设备类型关联着设备，不能删除", {});
									dialogRef.close();
									return;
								} else {
									if ($scope.selectedDitem) {
										resourceUIService.deleteModel($scope.selectedDitem.id, function(returnObj) {
											if (returnObj.code == 0) {
												for (var i in $scope.treeAry) {
													if ($scope.treeAry[i].id == $scope.selectedDitem.id) {
														$scope.treeAry.splice(i, 1);

													}
												}
												growl.success("删除 " + $scope.selectedDitem.label + " 设备类型成功")
												$scope.editVisible = false;
												$scope.selectedDitem = initModelAtts($scope.treeAry[$scope.treeAry.length - 1], 0)
											}
										});
									}
								}
								dialogRef.close();
							}
						}, {
							label: '取消',
							action: function(dialogRef) {
								dialogRef.close();
							}
						}]
					});

				} else if ($scope.activeMainTab == "资源域视图") {

					//判断删除的资源域是否是先添加的还未保存，还是已经存在的资源域。
					if ($scope.selectedDomainitem.domainID != 0) {

						var domain = {
							"domainID": $scope.selectedDomainitem.domainID,
							"domainPath": $scope.selectedDomainitem.domainPath
						};
						//接口判断是否可以删除该资源域
						userDomainService.queryDeleteDomain(domain, function(resultObj) {

							// code  data "true"
							if (resultObj.data != "true") {
								growl.warning(resultObj.data, {});
								return;
							} else {
								BootstrapDialog.show({
									title: '提示',
									closable: false,
									//size:BootstrapDialog.SIZE_WIDE,
									message: '确认删除 ' + $scope.selectedDomainitem.name + ' 资源域吗？',
									buttons: [{
										label: '确定',
										cssClass: 'btn-success',
										action: function(dialogRef) {
											if ($scope.selectedDomainitem) {
												userDomainService.deleteDomain($scope.selectedDomainitem.domainID, $scope.selectedDomainitem.domainPath, function(returnObj) {
													if (returnObj.code == 0) {

														$scope.editVisible = false;
														for (var i in $scope.domainsAry) {
															if ($scope.selectedDomainitem.domainID == $scope.domainsAry[i].domainID) {
																$scope.domainsAry.splice(i, 1);
																if (i > 1) {
																	$scope.selectedDomainitem = $scope.domainsAry[i - 1];
																} else {
																	$scope.selectedDomainitem = $scope.domainsAry[0];
																}
															}
														}
														//domainTree();
														growl.success("删除资源域成功", {});
													}
												})
											}
											dialogRef.close();
										}
									}, {
										label: '取消',
										action: function(dialogRef) {
											dialogRef.close();
										}
									}]
								});
							}
						});
					} else {
						domainTree();
						$scope.editVisible = false;
						growl.success("资源域删除成功", {});
						return;
					}
				} else if ($scope.activeMainTab == "网关视图") {
					if ($scope.selectedGateitem.managedStatus == 'active') {
						growl.warning("激活状态的网关不能删除，请先停用该网关。", {});
						return;
					}
					//删除网关
					BootstrapDialog.show({
						title: '删除网关',
						closable: false,
						//size:BootstrapDialog.SIZE_WIDE,
						message: '确认删除' + $scope.selectedGateitem.name + '网关以及该网关下的设备吗？',
						buttons: [{
							label: '确定',
							cssClass: 'btn-success',
							action: function(dialogRef) {
								if ($scope.selectedGateitem) {
									resourceUIService.deleteGateway($scope.selectedGateitem.id, function(returnObj) {
										if (returnObj.code == 0) {
											$scope.editVisible = false;
											$scope.selectedGateitem = null;
											gateWayTree();
											growl.success("删除网关成功", {});
										}
									})
								}
								dialogRef.close();
							}
						}, {
							label: '取消',
							action: function(dialogRef) {
								dialogRef.close();
							}
						}]
					});
				}
			}

			$scope.updateModel = function() {
				if ($scope.selectedDitem) {
					for (var i in resourceUIService.treeAry) {
						if (resourceUIService.treeAry[i].id == $scope.selectedDitem.id && resourceUIService.treeAry[i].label == $scope.selectedDitem.label && resourceUIService.treeAry[i].icon == $scope.selectedDitem.icon) {
							return;
						}
					}
					var obj = {};
					obj.id = $scope.selectedDitem.id;
					obj.label = $scope.selectedDitem.label;
					obj.icon = $scope.selectedDitem.icon;
					resourceUIService.updateModel(obj, function(returnObj) {
						if (returnObj.code == 0) {
							for (var i in $scope.treeAry) {
								if ($scope.treeAry[i].id == $scope.selectedDitem.id) {
									$scope.treeAry[i].label = returnObj.data.label;
									resourceUIService.treeAry[i].label = returnObj.data.label;
									$scope.selectedDitem.label = returnObj.data.label;
								}
							}
							growl.success("修改设备类型视图成功", {});
						}
					});
				}
			}
			$scope.addModelSubItem = function() {
				if ($scope.activeTab == null || $scope.activeTab == "属性") {
					for (var i = $scope.selectedDitem.attrs.length - 1; i > -1; i--) {
						if ($scope.selectedDitem.attrs[i].isNew) {
							if (!$scope.selectedDitem.attrs[i].isDel) {
								growl.warning("当前有未保存属性", {});
								return;
							} else {
								$scope.selectedDitem.attrs.splice(i, 1);
							}

						}
					}
					var newAttr = {
						canEdit: true,
						label: "",
						name: "",
						dataType: 0,
						id: Math.uuid(),
						isNew: true
					}
					$scope.selectedDitem.attrs.push(newAttr);
				} else if ($scope.activeTab == "指标") {
					for (var i = $scope.selectedDitem.kpis.length - 1; i > -1; i--) {
						if ($scope.selectedDitem.kpis[i].isNew) {
							if (!$scope.selectedDitem.kpis[i].isDel) {
								growl.warning("当前有未保存指标", {});
								return;
							} else {
								$scope.selectedDitem.kpis.splice(i, 1);
							}

						}
					}
					var newKpi = {
						isEdit: 2,
						canEdit: true,
						label: "",
						name: "",
						unit: "",
						range: "",
						number: "",
						granularity: "",
						granularityUnit: "",
						option: "",
						id: Math.uuid(),
						isNew: true
					}
					$scope.selectedDitem.kpis.push(newKpi);
					$scope.$broadcast(Event.KPIEDITINIT, {
						"data": $scope.selectedDitem.kpis
					});
				} else if ($scope.activeTab == "告警") {
					for (var i = $scope.selectedDitem.alerts.length - 1; i > -1; i--) {
						if ($scope.selectedDitem.alerts[i].isNew) {
							if (!$scope.selectedDitem.alerts[i].isDel) {
								growl.warning("当前有未保存告警", {});
								return;
							} else {
								$scope.selectedDitem.alerts.splice(i, 1);
							}

						}
					}
					var newAlert = {
						isEdit: 2,
						canEdit: true,
						label: "",
						name: "",
						description: "",
						option: "",
						id: Math.uuid(),
						isNew: true
					}
					$scope.selectedDitem.alerts.push(newAlert);
					$scope.$broadcast(Event.ALERTEDITINIT, {
						"data": $scope.selectedDitem
					});
				} else if ($scope.activeTab == "指令") {
					for (var i = $scope.selectedDitem.directives.length - 1; i > -1; i--) {
						if ($scope.selectedDitem.directives[i].isNew) {
							if (!$scope.selectedDitem.directives[i].isDel) {
								growl.warning("当前有未保存指令", {});
								return;
							} else {
								$scope.selectedDitem.directives.splice(i, 1);
							}

						}
					}
					var newDir = {
						isEdit: 2,
						canEdit: true,
						label: "",
						name: "",
						description: "",
						option: "",
						expression: "",
						protocolType: "",
						id: 0,
						isNew: true
					}
					$scope.selectedDitem.directives.push(newDir);
					$scope.$broadcast(Event.DIRECTIVESINIT, {
						"data": $scope.selectedDitem.directives
					});
				}
			}
			$scope.attrLabel = ""; //属性显示名称
			$scope.iconClick = function(type, indexId, thisId) {
				if ($("#label" + indexId + "").val() != "图标") {
					$scope.attrLabel = $("#label" + indexId + "").val();
				}
				if (type == 'icon') {
					$("#label" + indexId + "").val("图标");
					$("#label" + indexId + "").attr("disabled", true);
					$scope.selectedDitem.attrs[indexId].label = "图标";
				} else {
					if ($("#label" + indexId + "").val() == "图标") {
						$("#label" + indexId + "").val($scope.attrLabel);
					}
					$("#label" + indexId + "").attr("disabled", false);
				}

			}
			$scope.delModelSubItem = function(item) {
				if ($scope.activeTab == null || $scope.activeTab == "属性") {
					BootstrapDialog.show({
						title: '提示',
						closable: false,
						//size:BootstrapDialog.SIZE_WIDE,
						message: '确认删除 ' + $scope.selectedDitem.label + ' 设备的属性吗？',
						buttons: [{
							label: '确定',
							cssClass: 'btn-success',
							action: function(dialogRef) {
								for (var i in $scope.selectedDitem.attrs) {
									var delItem = $scope.selectedDitem.attrs[i];
									if (delItem.id == item.id) {
										$scope.selectedDitem.attrs.splice(i, 1);
										break;
									}
								}
								growl.info("设备属性删除成功，请点击保存按钮以保存修改", {});
								dialogRef.close();
							}
						}, {
							label: '取消',
							action: function(dialogRef) {
								dialogRef.close();
							}
						}]
					});
				} else if ($scope.activeTab == "指标") {

				} else if ($scope.activeTab == "告警") {

				} else if ($scope.activeTab == "指令") {

				}
			}

			$scope.saveModelSubItem = function() {
				var checkPass = true;
				//增加三种视图（设备类型，资源域，网关）的判断
				if ($scope.activeMainTab == "设备类型视图") {
					if ($scope.activeTab == null || $scope.activeTab == "属性") {
						for (var i in $scope.selectedDitem.attrs) {
							var obj = $scope.selectedDitem.attrs[i];
							if (obj.isNew)
								obj.id = 0;
							if (!obj.label) {
								growl.warning("请输入显示名称", {});
								return;
							}
							if (!obj.name) {
								growl.warning("请输入属性名称", {});
								return;
							}
							if (!obj.dataType) {
								growl.warning("请选择数据类型", {});
								return;
							}
						}
						resourceUIService.saveAttrs($scope.selectedDitem.id, $scope.selectedDitem.attrs, function(returnObj) {
							if (returnObj.code == 0) {
								if (returnObj.data)
									$scope.selectedDitem.attrs = returnObj.data;
								//$scope.editVisible = false;
								growl.success("保存属性成功", {});
							}
						})
					} else if ($scope.activeTab == "指标") {

						for (var i = $scope.selectedDitem.kpis.length - 1; i > -1; i--) {
							var obj = $scope.selectedDitem.kpis[i];
							if (!obj.label || !obj.name) {
								if (obj.isNew) {
									$scope.selectedDitem.kpis.splice(i, 1);
									continue;
								} else {
									obj.err = ".danger";
									checkPass = false;
								}
							}
							if (obj.isNew) {
								if (obj.isEdit > 0) {
									growl.info("请√当前修改的数据", {});
									return;
								} else {
									obj.id = 0;
								}
							}

							if (obj.isDel)
								$scope.selectedDitem.kpis.splice(i, 1);
						}
						if (checkPass) {
							resourceUIService.saveKpis($scope.selectedDitem.id, $scope.selectedDitem.kpis, function(returnObj) {
								if (returnObj.code == 0) {
									if (returnObj.data)
										$scope.selectedDitem.kpis = returnObj.data;
									growl.success("保存指标定义成功", {});
									//$scope.editVisible = false;
									changeDItem();
								}
							});
						} else {
							growl.warning("检查数据完整性", {})
						}
					} else if ($scope.activeTab == "告警") {
						for (var i = $scope.selectedDitem.alerts.length - 1; i > -1; i--) {
							var obj = $scope.selectedDitem.alerts[i];
							if (!obj.label || !obj.name) {
								if (obj.isNew) {
									$scope.selectedDitem.alerts.splice(i, 1);
									continue;
								} else {
									obj.err = ".danger";
									checkPass = false;
								}
							}
							if (obj.isNew) {
								if (obj.isEdit > 0) {
									growl.warning("请√当前修改的数据", {});
									return;
								} else {
									obj.id = 0;
								}
							}

							if (obj.isDel)
								$scope.selectedDitem.alerts.splice(i, 1);
						}
						if (checkPass) {
							resourceUIService.saveAlerts($scope.selectedDitem.id, $scope.selectedDitem.alerts, function(returnObj) {
								if (returnObj.code == 0) {
									growl.success("保存告警定义成功", {});
									if (returnObj.data)
										$scope.selectedDitem.alerts = returnObj.data;
									//$scope.editVisible = false;
									changeDItem();
								}
							});
						} else {
							growl.warning("检查数据完整性", {})
						}
					} else if ($scope.activeTab == "指令") {
						resourceUIService.saveDirectives($scope.selectedDitem.id, $scope.selectedDitem.directives, function(returnObj) {
							if (returnObj.code == 0) {
								for (var i in $scope.selectedDitem.directives) {
									if ($scope.selectedDitem.directives[i].isNew) {
										$scope.selectedDitem.directives[i].isNew = false;
									}
								}
								//$scope.editVisible = false;
								growl.success("保存指令成功", {});
							}
						});
					}
				} else if ($scope.activeMainTab == "资源域视图") {

					var name = $.trim($("#domain-form input").eq(0).val());
					var description = $.trim($("#domain-form input").eq(1).val());

					//域名name不能是非法字符
					var reg = /^[\u4E00-\u9FA5\w\d]+$/;
					if (!reg.test(name)) {
						growl.warning("域名只能输入字母、数字、汉字、下划线", {});
						return;
					}

					//新增或修改资源域
					if (name != "" && $.trim(name) != "") { //域名输入限制
						if ($scope.selectedDomainitem.domainID == 0) {

							var domainID = previousDomainID;
							var domainPath = previousDomainPath;

							userDomainService.addDomain(domainID, domainPath, name, description, function(returnObj) {
								if (returnObj.code == 0) {
									if (returnObj.data) {
										//$scope.domainsAry.push(initDomainAtts(returnObj.data));
										//domainTree();
										//$scope.selectedDomainitem = returnObj.data;
										$scope.selectedDomainitem.domainID = returnObj.data.domainID;
										$scope.selectedDomainitem.domainPath = returnObj.data.domainPath;
										$scope.selectedDomainitem.name = returnObj.data.name;
										$scope.selectedDomainitem.description = returnObj.data.description;
										$scope.selectedDomainitem.parentID = returnObj.data.parentID;

										$scope.domainsAry[$scope.domainsAry.length - 1] = $scope.selectedDomainitem;
									}
									$scope.editVisible = false;
									growl.success("新增资源域成功", {});
								} else {
									growl.warning("新增资源域失败", {});
									return;
								}
							})

						} else {
							userDomainService.modifyDomain($scope.selectedDomainitem.domainID, name, description, function(returnObj) {
								if (returnObj.code == 0) {
									if (returnObj.data) {
										//$scope.selectedDomainitem.attrs = returnObj.data;
										domainTree();
									}
									$scope.editVisible = false;
									growl.success("修改资源域成功", {});
								} else {
									growl.warning("修改资源域失败", {});
									return;
								}
							})
						}
					} else {
						growl.warning("域名为必填项，并且不能为空格", {});
						return;
					}
				} else if ($scope.activeMainTab == "网关视图") {
					//					$scope.selectedGateitem.isVirtual = $scope.selectedGateitem.isVirtual == 'true' ? true : false;
					if (!$scope.selectedGateitem.type) {
						growl.warning("请选择网关类型", {});
						return;
					}
					if (!$scope.selectedGateitem.protocolType) {
						growl.warning("请选择协议类型", {});
						return;
					}
					if (!$scope.selectedGateitem.cloudAdapter) {
						growl.warning("请选择适配器类型", {});
						return;
					}
					if (!$scope.selectedGateitem.domain) {
						growl.warning("请选网关所属域", {});
						return;
					}
					if (!$scope.selectedGateitem.externalGwId) {
						growl.warning("请选输入网关标识", {});
						return;
					}
					if (!$scope.selectedGateitem.name) {
						growl.warning("请选输入网关名称", {});
						return;
					}
					BootstrapDialog.show({
						title: '提示',
						closable: false,
						//size:BootstrapDialog.SIZE_WIDE,
						message: '确认保存' + $scope.selectedGateitem.name + '吗？',
						buttons: [{
							label: '确定',
							cssClass: 'btn-success',
							action: function(dialogRef) {
								saveGateway();
								dialogRef.close();
							}
						}, {
							label: '取消',
							action: function(dialogRef) {
								dialogRef.close();
							}
						}]
					});
					var saveGateway = function() {
						if ($scope.selectedGateitem.id == 0) {
							resourceUIService.addGateway($scope.selectedGateitem, function(returnObj) {
								if (returnObj.code == 0) {
									if (returnObj.data) {
										for (var i in $scope.gatewaysAry) {
											var obj = $scope.gatewaysAry[i];
											if (obj.id == 0) {
												$scope.gatewaysAry[i] = initGatewayAtts(returnObj.data);
												$scope.selectedGateitem = $scope.gatewaysAry[i];
											}
										}

									}
									$scope.editVisible = false;
									growl.success("新增网关成功", {});
								}
							});
						} else {
							resourceUIService.updateGateway($scope.selectedGateitem, function(returnObj) {
								if (returnObj.code == 0) {
									if (returnObj.data) {
										for (var i in $scope.gatewaysAry) {
											var obj = $scope.gatewaysAry[i];
											if (obj.id == returnObj.data.id) {
												$scope.gatewaysAry[i] = initGatewayAtts(returnObj.data);
												$scope.selectedGateitem = $scope.gatewaysAry[i];
											}
										}
									}
									$scope.editVisible = false;
									growl.success("修改网关成功", {});
								}
							});
						}
					}
				}
			}

			$scope.userGridData = {
					columns: [{
						title: "姓名",
						data: "userName"
					}, {
						title: "Email",
						data: "emailAddress"
					}, {
						title: "移动电话",
						data: "mobilePhone"
					}, {
						title: "办公电话",
						data: "officePhone"
					}, {
						title: "操作",
						orderable:false,
						data: "option"
					}],
					columnDefs: [{
						"targets": 0,
						"data": "userName",
						"render": function(data, type, full) {
							//返回自定义名字
							if (full.isEdit == 2 && type == "display") {
								var str = '<select id="userDomainName" name="userName" class="combobox form-control">' +
									'<option value="">请选择用户</option>';
								//赋值

								//判断：
								for (var i in $scope.userGridData.data) {
									//	for (var j in $scope.domainUserData.data) {
									//		if ($scope.userGridData.data[i].userName != $scope.domainUserData.data[j].userName){
									//			str += '<option value="' + $scope.userGridData.data[i].userID + '">' + $scope.userGridData.data[i].userName + '</option>';
									//		}
									//	}
									//if ($scope.domainUserData.data[i].userName == data) {
									str += '<option value="' + $scope.userGridData.data[i].userID + '">' + $scope.userGridData.data[i].userName + '</option>';
									//} else {
									//	str += '<option value="' + $scope.userGridData.data[i].domainID + '">' + $scope.userGridData.data[i].name + '</option>';
									//}

								}
								str += '</select>';
								$scope.domainUserData.data = [];
								return str;
							} else {
								return data;
							}
						}
					}, {
						"targets": 4,
						"data": "option",
						"render": function(data, type, full) {
							// 返回自定义内容
							if (full.isEdit == 2) {

								var str = "<div class='input-group'>";
								str += "<a id='save-btn' class='btn btn-social-icon'><i class='fa fa-check'></i></a>"
								str += "<a id='del-btn' class='btn btn-social-icon'><i class='fa fa-close'></i></a>"
								str += "</div>"
								return str;

							} else {

								var str = "<div class='input-group'>";
								str += "<a id='removeDomain-btn' class='btn btn-social-icon' data-toggle='tooltip' title='删除'><i class='fa fa-minus-square-o'></i></a>"
								str += "</div>"
								return str;

							}
						}
					}]
				}
				//添加用户到该域下面
			$scope.addUserToDomain = function() {

				//getDomainUsers();

				//addUserStatus为false时，执行添加操作；
				if (addUserStatus == false) {

					addUserStatus = true;

					var item = $scope.selectedDomainitem;
					if (item) {

						for (var i in $scope.domainUsers) {
							var obj = $scope.domainUsers[i];
							if (obj.domainID == 0) {
								growl.warning("当前有未保存资源域", {});
								return;
							}
						}

						var newObj = {
							userName: '选择用户',
							emailAddress: '',
							mobilePhone: '',
							officePhone: '',
							id: 0,
							domainId: '',
							domainPath: '',
							isEdit: 2,
							userType: 2,
							userTypeLabel: "普通用户",
							jobTitle: "",
							discription: "",
							edit: "",
							userID: null
						}

						for (var i in $scope.domainUserData.data) {
							if ($scope.domainUserData.data[i].userID == null) {
								$scope.domainUserData.data[i] = newObj;

								//	$scope.domainUserData.columnDefs[i] 重新定义
								$scope.domainUserData.columnDefs[i] = {
									"targets": 4,
									"data": "option",
									"render": function(data, type, full) {
										// 返回自定义内容
										var str = "<div class='input-group'>";
										if (full.id == 0)
											str += "<a id='save-btn' class='btn btn-social-icon'><i class='fa fa-save'></i></a>"
										else
											str += "<a id='save-btn' class='btn btn-social-icon'><i class='fa fa-check'></i></a>"
										str += "<a id='del-btn' class='btn btn-social-icon'><i class='fa fa-minus-square-o'></i></a>"
										str += "</div>"
										return str;
									}
								}


								$scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainUserData);
								return;
							}
						}

						$scope.domainUserData.data.push(newObj);

						$scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainUserData);
					}
				} else {
					growl.warning('当前正在添加域用户', {});
				}
			}

			/**
			 * 给网关添加一个未激活设备，等同于网关自动发现
			 */
			$scope.addIns = function() {
					var item = $scope.selectedGateitem;
					if (item) {
						for (var i in $scope.gatewayDevices) {
							var obj = $scope.gatewayDevices[i];
							if (obj.id == 0) {
								growl.warning("当前有未添加到网关设备，请点击保存按钮", {});
								return;
							}
						}

						var newObj = {
							gatewayId: item.id,
							label: '新增设备' + $scope.gatewayDevices.length,
							id: 0,
							domainPath: '',
							domainId: '',
							modelId: '',
							externalDevId: '',
							managedStatus: 'deactive',
							onlineStatus: 'offline',
							operationStatus: 0,
							isEdit: 2
						}

						$scope.gatewayDevices.push(newObj);

						$scope.$broadcast(Event.CMDBINFOSINIT + "GATE", {
							data: $scope.gatewayDevices
						});
					}

				}
				/**
				 * datatables内部操作处理
				 * @param {Object} type
				 * @param {Object} select
				 */
			$scope.doAction = function(type, select) {
				//增加三种视图（设备类型，资源域，网关）显示页的判断
				if ($scope.activeMainTab == "设备类型视图") {
					if (type == "save") {
						select.isEdit = 0;
						if (select.id == 0) {
							var addData = {};
							addData.label = select.label;
							addData.id = select.id;
							addData.values = select.values;
							addData.modelId = $scope.selectedDitem.id;
							resourceUIService.addResource(addData, function(returnObj) {
								if (returnObj.code == 0) {
									reLoader();
									growl.success("保存成功", {});
								}
							});
						} else if (select.id > 0) {
							var updataData = select.data;
							updataData.label = select.label;
							updataData.id = select.id;
							updataData.values = select.values;
							resourceUIService.updateResource(updataData, function(returnObj) {
								if (returnObj.code == 0) {
									reLoader();
									growl.success("保存成功", {});
								}
							});
						}

					} else if (type == "cancel") {
						for (var i in resourceUIService.selectedInstances) {
							resourceUIService.selectedInstances[i]["isEdit"] = 0;
						}
						$scope.$broadcast(Event.CMDBINFOSINIT, {
							"option": [resourceUIService.selectedInstances, $scope.selectedDitem.attrs]
						});
					} else if (type == "delete") {
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '是否要删除设备:' + select.label + '',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {
									resourceUIService.deleteResource(select.id, function(resultObj) {
										if (resultObj.code == 0) {
											reLoader();
										}
									});
									dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});
					} else if (type == "change") {
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '是否要改变设备状态为:' + (select.state == 1 ? '离线' : '在线') + '',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {
									for (var i in resourceUIService.selectedInstances) {
										if (resourceUIService.selectedInstances[i].id == select.id) {
											if (select.state == 1) {
												resourceUIService.selectedInstances[i].state = 0;
											} else {
												resourceUIService.selectedInstances[i].state = 1;
											}
										}
									}
									$scope.$broadcast(Event.CMDBINFOSINIT, {
										"option": [resourceUIService.selectedInstances, resourceUIService.selectedAttrs]
									});

									dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});
					} else if (type == "eidterror") {
						growl.warning("当前有正在编辑的设备", {});
					} else if (type == "directive") {
						location.href = '#directiveview/' + select.data.modelId + '/' + select.id;
					} else if (type == "directive-save") {
						for (var i = $scope.selectedDitem.directives.length - 1; i > -1; i--) {
							if ($scope.selectedDitem.directives[i].id == select.id) {
								$scope.selectedDitem.directives[i] = select;
								if ($scope.selectedDirective)
									$scope.selectedDitem.directives[i].params = $scope.selectedDirective.params;
							}
						}
					} else if (type == "params") {
						resourceUIService.checkDirectiveParam(select, function(returnObj) {
							if (returnObj.code == 0) {
								if (returnObj.data.params.length > 0) {
									$scope.selectedDirective = returnObj.data;
								} else {
									growl.info("当前表达式无法解析出参数", {});
								}

							}
						});
					} else if (type == "message") {
						if ($scope.activeTab == "指令") {
							BootstrapDialog.show({
								title: '提示',
								closable: false,
								//size:BootstrapDialog.SIZE_WIDE,
								message: '确认删除:' + $scope.selectedDitem.label + "设备下的指令吗",
								buttons: [{
									label: '确定',
									cssClass: 'btn-success',
									action: function(dialogRef) {
										for (var i in $scope.selectedDitem.directives) {
											var delItem = $scope.selectedDitem.directives[i];
											if (delItem.id == item.id) {
												$scope.selectedDitem.directives.splice(i, 1);
												break;
											}
										}
										growl.warning("指令删除成功，请点击保存按钮", {});
										//growl.info(select, {});
										dialogRef.close();
									}
								}, {
									label: '取消',
									action: function(dialogRef) {
										dialogRef.close();
									}
								}]
							});
						} else if ($scope.activeTab == "告警") {
							BootstrapDialog.show({
								title: '提示',
								closable: false,
								//size:BootstrapDialog.SIZE_WIDE,
								message: '确认删除:' + $scope.selectedDitem.label + "设备下的告警吗",
								buttons: [{
									label: '确定',
									cssClass: 'btn-success',
									action: function(dialogRef) {
										for (var i in $scope.selectedDitem.alerts) {
											var delItem = $scope.selectedDitem.alerts[i];
											if (delItem.id == item.id) {
												$scope.selectedDitem.alerts.splice(i, 1);
												break;
											}
										}
										growl.warning("告警删除成功，请点击保存按钮", {});
										//growl.info(select, {});
										dialogRef.close();
									}
								}, {
									label: '取消',
									action: function(dialogRef) {
										dialogRef.close();
									}
								}]
							});
						} else if ($scope.activeTab == "指标") {
							BootstrapDialog.show({
								title: '提示',
								closable: false,
								//size:BootstrapDialog.SIZE_WIDE,
								message: '确认删除:' + $scope.selectedDitem.label + "设备下的指标吗",
								buttons: [{
									label: '确定',
									cssClass: 'btn-success',
									action: function(dialogRef) {
										for (var i in $scope.selectedDitem.kpis) {
											var delItem = $scope.selectedDitem.kpis[i];
											if (delItem.id == item.id) {
												$scope.selectedDitem.kpis.splice(i, 1);
												break;
											}
										}
										growl.warning("指标删除成功，请点击保存按钮", {});
										//growl.info(select, {});
										dialogRef.close();
									}
								}, {
									label: '取消',
									action: function(dialogRef) {
										dialogRef.close();
									}
								}]
							});
						}
					} else if (type == 'thresholdMessage') {
						growl.warning(select, {});
					}
				} else if ($scope.activeMainTab == "资源域视图") {
					if (type == "save") {
						select.isEdit = 0;
						var userID = select.userID;
						var newDomainID = $("#domain-selector").val().split(" ")[0];
						var newDomainPath = $("#domain-selector").val().split(" ")[1];
						var oldDomainID = $scope.selectedDomainitem.domainID;



					} else if (type == "cancel") {
						growl.success("取消切换域", {});
						changeDomainTabItem();
					} else if (type == "removeDomain") {
						//select.isEdit = 0;
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '确认将用户 ' + select.userName + ' 移出 ' + $scope.selectedDomainitem.name + ' 资源域吗？',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {

									//根域下面的管理员用户不能被删除
									if (select.userType == 3 && $scope.selectedDomainitem.parentID == 0) {
										growl.warning("根域：" + $scope.selectedDomainitem.name + " 下的管理员用户：" + select.userName + "不能被移出", {});
										dialogRef.close();
										return;
									} else {
										var userID = select.userID;
										userDomainService.deleteDomain2User($scope.selectedDomainitem.domainID, userID, function(returnObj) {
											if (returnObj.code == 0) {
												growl.success("用户移出域成功", {});
												changeDomainTabItem();
											}
										})
										dialogRef.close();
									}
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});

					} else if (type == "saveChangedDomain") {
						//提示
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '确认将资源域 ' + $scope.selectedDomainitem.name + ' 切换到资源域  ' + select.domainName + ' 吗？',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {

									var newDomainPath = select.domainPath;
									var deviceID = select.id;

									resourceUIService.changeDeviceDomain(select.id, newDomainPath, function(resultObj) {
										if (resultObj.code == 0) {
											
											//growl.success("切换资源域成功", {});
											domainTree();
										}
									});
									//刷新页面
                   dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});

					} else if (type == "delDomain") {
						changeDomainTabItem();
					} else if (type == "cancelAddUser2Domain") {
						addUserStatus = false;
						growl.success("取消添加用户到该域", {});
						changeDomainTabItem();
					} else if (type == "saveUserToDomain") {

						var domainID = $scope.selectedDomainitem.domainID;
						var domainPath = $scope.selectedDomainitem.domainPath;
						var userID = $('#userDomainName').val().split(" ")[0];
						var userName = $('#userDomainName').val().split(" ")[1];
						var domain = {
							"domainID": domainID,
							"domainPath": domainPath
						};

						//增加判断，如果选择的用户不存在则返回失败
						if (userID == "") {
							growl.warning("请选择用户", {});
							return;
						} else {
							//增加判断，用户是否已经存在该域中 Strat

							//增加判断，用户是否已经存在该域中 END
							userDomainService.addDomainUser(domain, userID, function(resultObj) {
								if (resultObj.code == 0) {
									growl.success("添加用户到域成功", {});
									// 查询刷新域用户面板
									addUserStatus = false;
									getUserFromThisDomain();
								} else {
									growl.warning("用户已经存在该域中，添加失败", {});
									return;
								}
							});
						}
					}
				} else if ($scope.activeMainTab == "网关视图") {
					if (type == 'gateSave') {
						if (!select.label) {
							growl.warning("名称不能为空", {});
							return;
						}
						if (!select.externalDevId) {
							growl.warning("设备地址不能为空", {});
							return;
						}
						resourceUIService.registerDevice($scope.selectedGateitem.id, select, function(returnObj) {
							if (returnObj.code == 0) {
								gateWayTree();
								growl.success("注册成功", {});
							}
						});
					} else if (type == 'gateActive') {
						if ($scope.selectedGateitem.managedStatus != 'active') {
							growl.warning("网关不是激活状态，无法启用设备!", {});
							return;
						}
						if (!select.modelId) {
							growl.warning("模型不能为空", {});
							return;
						}
						if (!select.domainPath) {
							growl.warning("资源域不能为空", {});
							return;
						}
						//						select.createTime = "2015-10-01T00:00:00.000"
						//						select.updateTime = "2015-10-01T00:00:00.000"
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '确认从 ' + $scope.selectedGateitem.name + ' 网关启用 ' + (select.label ? select.label : '') + ' 设备吗？',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {
									resourceUIService.activateDevice(select, function(returnObj) {
										if (returnObj.code == 0) {
											gateWayTree();
											growl.success("启用成功", {});
											
										}
									});
									dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});

					} else if (type == 'gateDel') {
						//增加注销确认步骤
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '确认从 ' + $scope.selectedGateitem.name + ' 网关注销 ' + select.label + ' 设备吗？',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {
									resourceUIService.unregisterDevice($scope.selectedGateitem.id, select.id, function(returnObj) {
										if (returnObj.code == 0) {
											gateWayTree();
											growl.success("注销成功", {});
											
										}
									});
									dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});

					} else if (type == 'gateActivedelete') {
						BootstrapDialog.show({
							title: '提示',
							closable: false,
							//size:BootstrapDialog.SIZE_WIDE,
							message: '确认从 ' + $scope.selectedGateitem.name + ' 网关停用 ' + select.label + ' 设备吗？',
							buttons: [{
								label: '确定',
								cssClass: 'btn-success',
								action: function(dialogRef) {
									resourceUIService.deactivateDevice(select.id, function(returnObj) {
										if (returnObj.code == 0) {
											gateWayTree();
											growl.success("停用成功", {});
											
										}
									});
									dialogRef.close();
								}
							}, {
								label: '取消',
								action: function(dialogRef) {
									dialogRef.close();
								}
							}]
						});

					}
				}
			}

			var changeDomainItem = function() {
				$scope.editVisible = false;
				if ($scope.activeMainTab == "设备类型视图") {
					$scope.activeTab = '属性';
					$scope.activeListTab = "tab1";
					urmpTree();
				} else if ($scope.activeMainTab == "资源域视图") {
					//if ($scope.domainsAry.length == 0) {
					//	domainTree();
					//}
					domainTree();

					$scope.activeListTab = "tab3";
					//changeDomainTabItem();
				} else if ($scope.activeMainTab == "网关视图") {
					//					if ($scope.gatewaysAry.length == 0) {
					gateWayTree();
					//					}
					$scope.activeListTab = "tab5";
				}
				$scope.$apply();
			};
			var changeDomainTabItem = function() {

				addUserStatus = false;
				//增加过滤，如果是正在添加的资源域，那么取消这个tab页面切换操作
				if ($scope.selectedDomainitem.domainID != 0) {
					if ($scope.activeListTab == "tab3") {
						//资源域视图,获取设备列表
						getDomainDeviceList();
						//var obj;
						////obj.domainPath = $scope.sel
						//getDomainDeviceCount(obj);
					} else if ($scope.activeListTab == "tab4") {
						//资源域视图,获取域用户列表
						getUserFromThisDomain();

						//更新资源域用户count总数
						//var userCount = 0;
						//var domainPath = $scope.selectedDomainitem.domainPath;
						//userDomainService.getAssociateDomain2User(domainPath, function(resultObj) {
						//	if (resultObj.code == 0) {
						//		for (var i in resultObj.data) {
						//			var obj = resultObj.data[i];
						//			obj.isEdit = 0;
						//		}
						//		initDomainAtts({});
						//		var domainUsers = resultObj.data;
						//		userCount = domainUsers.length;
						//		$scope.domainUserData.data = resultObj.data;
						//		$scope.$broadcast(Event.DOMAININFOSINIT, $scope.domainUserData);
						//	}
						//});
						//
						//var obj = {
						//	count:userCount,
						//	domainPath:domainPath
						//};
						//getDomainUserCount(obj,function(){
						//	//待增加内容：获取设备列表的列表
						//});
					}
				} else {
					growl.warning("请先保存新添加的资源域，再进行以下操作", {})
					return;
				}
			}
			var changeTabItem = function() {
				$scope.$apply();
				if ($scope.activeListTab == "tab2") {
					$timeout(function() {
						$scope.$broadcast(Event.CMDBINFOS4MAPINIT, {
							"option": [resourceUIService.selectedInstances, resourceUIService.selectedAttrs]
						});
					});
				}
			}




			var domainTree = function() {
				if (userLoginUIService.user.userType == 3) {
					//3-企业管理员
					$('#showbyusertype').show();
					//获取用户
					userEnterpriseService.queryEnterpriseUser(function(resultObj) {
						if (resultObj.code == 0) {
							//for (var i in resultObj.data) {
							//	var obj = resultObj.data[i];
							//	obj.isEdit = 0;
							//	obj.userTypeLabel = obj.userType == 2 ? "普通用户" : "管理员";
							//}

							$scope.userGridData.data = resultObj.data;

							$scope.$broadcast(Event.DOMAININFOSINIT, $scope.userGridData);
						}
					});
				} else if (userLoginUIService.user.userType == 1 || userLoginUIService.user.userType == 2) {
					//1-个人用户 2-企业普通用户
					$('#showbyusertype').hide();
				}
				if ($scope.domainsAry != null || $scope.domainsAry != undefined || $scope.domainsAry != "") {
					$scope.domainsAry = [];
					userDomainService.queryDomainByUser(userLoginUIService.user.userID, function(returnObj) {
						if (returnObj.code == 0) {
							var tree = returnObj.data;
							for (var i in tree) {
								$scope.domainsAry.push(initDomainAtts(tree[i], i));
								if ($scope.selectedDomainitem == null && i == 0) {
									$scope.selectedDomainitem = $scope.domainsAry[i];
									//获取该域下面的设备列表
									getDomainDeviceList();
								} else if ($scope.selectedDomainitem.domainPath == $scope.domainsAry[i].domainPath) {
									$scope.selectedDomainitem = $scope.domainsAry[i];
									getDomainDeviceList();
								}
							}
						}
					});
				}
			}
			var gateWayTree = function() {
				$scope.gatewaysAry = [];
				resourceUIService.getAllGateways(function(returnObj) {
					if (returnObj.code == 0) {
						for (var i in returnObj.data) {
							$scope.gatewaysAry.push(initGatewayAtts(returnObj.data[i], i));
							if ($scope.selectedGateitem == null && i == 0) {
								$scope.selectedGateitem = $scope.gatewaysAry[i];
								getDevices($scope.selectedGateitem);
							} else if ($scope.selectedGateitem.id == $scope.gatewaysAry[i].id) {
								$scope.selectedGateitem = $scope.gatewaysAry[i];
								getDevices($scope.selectedGateitem);
							}
						}
					}
				});
			}

			$scope.changeManagedStatus = function() {
				if ($scope.selectedGateitem.managedStatus == 'deactive') {

					BootstrapDialog.show({
						title: '提示',
						closable: false,
						//size:BootstrapDialog.SIZE_WIDE,
						message: '确认启用 ' + $scope.selectedGateitem.name + ' 网关吗？',
						buttons: [{
							label: '确定',
							cssClass: 'btn-success',
							action: function(dialogRef) {
								resourceUIService.activateGateway($scope.selectedGateitem.id, function(returnObj) {
									if (returnObj.code == 0) {
										gateWayTree();
										growl.success("启用成功", {});
										
									}
								});
								dialogRef.close();
							}
						}, {
							label: '取消',
							action: function(dialogRef) {
								dialogRef.close();
							}
						}]
					});
				} else {
					BootstrapDialog.show({
						title: '提示',
						closable: false,
						//size:BootstrapDialog.SIZE_WIDE,
						message: '停用网关的操作会使该网关下所有的设备一并停用，请确认要停用 ' + $scope.selectedGateitem.name + ' 网关吗？',
						buttons: [{
							label: '确定',
							cssClass: 'btn-success',
							action: function(dialogRef) {
								resourceUIService.deactivateGateway($scope.selectedGateitem.id, function(returnObj) {
									if (returnObj.code == 0) {
										gateWayTree();
										growl.success("停用成功", {});
										
									}
								});
								dialogRef.close();
							}
						}, {
							label: '取消',
							action: function(dialogRef) {
								dialogRef.close();
							}
						}]
					});
				}

			}
			$scope.qrCode = function() {
				var $textAndPic = $('<div style="padding-left:157px"></div>');
				$textAndPic.qrcode({
					text: "" + $scope.selectedGateitem.id
				});
				BootstrapDialog.show({
					title: '扫一扫加入' + $scope.selectedGateitem.label,
					closable: true,
					//size:BootstrapDialog.SIZE_WIDE,
					message: $textAndPic,
					buttons: [{
						label: '下载APP',
						cssClass: 'btn-success',
						action: function(dialogRef) {
							window.open("http://7mj4hc.com1.z0.glb.clouddn.com/index.html");
							dialogRef.close();
						}
					}, {
						label: '关闭',
						action: function(dialogRef) {
							dialogRef.close();
						}
					}]
				});
			}
			var initEvent = function() {
				//		   		$('a[data-toggle="tab"]').off('shown.bs.tab');
				$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
					$scope.selectedDirective = null;
					var aname = $(e.target).attr("name");
					var targetText = $(e.target).text();
					if (!aname) {
						if (targetText.search("视图") > -1) {
							// 获取已激活主页的名称
							$scope.activeMainTab = $.trim($(e.target).text());
							// 获取前一个激活的主页的名称
							$scope.previousMainTab = $(e.relatedTarget).text();

							changeDomainItem();
						} else {
							// 获取已激活的标签页的名称
							$scope.activeTab = $.trim($(e.target).text());
							// 获取前一个激活的标签页的名称
							previousTab = $.trim($(e.relatedTarget).text());
							changeDItem();
						}
					} else {
						$scope.activeListTab = aname;
						changeTabItem();
						changeDomainTabItem();
					}

				});
			}

			$scope.$on("$destroy", function() {
				console.log("on-destroy");
				SwSocket.unregister(uuid);
			});
			var domainTreeQuery = function() {
				userDomainService.queryDomainTree(userLoginUIService.user.userID, function(data) {
					$scope.domainListDic = data.domainListDic;
					$scope.domainListTree = data.domainListTree;
				});
			}
			$scope.gotoPath = function(item) {
				if (item.nodes == $scope.treeAry) return;
				var newAry = [];
				for (var i in $scope.routePaths) {
					if ($scope.routePaths[i].id == item.id) {
						newAry.push($scope.routePaths[i]);
						break;
					}
					newAry.push($scope.routePaths[i]);
				}
				$scope.routePaths = newAry;
				$scope.showChildren(item);
			}
			$scope.showChildren = function(item) {
				$scope.treeAry = item.nodes;
				$scope.selectedDitem = null;
				$scope.click($scope.treeAry[0]);
			};
			var init = function() {
				resourceUIService.getRootModel(function(returnObj) {
					if (returnObj.code == 0) {
						resourceUIService.rootModel = returnObj.data;
						$scope.routePaths.push(returnObj.data);
						urmpTree();
					}
				});

				domainTree();
				initEvent();
				domainTreeQuery();

				//				}
			}
			$scope.directiveBack = function() {
				$scope.doAction("directive-save", $scope.selectedDirective);
				$scope.selectedDirective = null;
			}
			$scope.saveThresholds = function(modelData, alertCode, thresholds) {
				resourceUIService.saveThresholds(thresholds, function(returnObj) {
					if (returnObj.code == 0) {
						growl.success("阈值设置保存成功", {});
						var hasThreshold = false;
						for (var i = 0; i < modelData.thresholds.length; i++) {
							if (modelData.thresholds[i].alertCode == alertCode) {
								modelData.thresholds[i].thresholdsData = returnObj.data;
								hasThreshold = true;
								break;
							}
						}
						if (!hasThreshold) {
							modelData.thresholds.push({
								"alertCode": alertCode,
								"thresholdsData": returnObj.data
							});
						}
					}
				});
			};
			if (!userLoginUIService.user.isAuthenticated) {
				$scope.$on('loginStatusChanged', function(evt, d) {
					if (userLoginUIService.user.isAuthenticated) {
						init();
					}
				});
			} else {
				init();
			}

		}
	]);
});