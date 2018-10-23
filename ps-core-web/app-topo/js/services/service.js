define(["angular", "commonlib"], function(angular, lib) {
	var module = angular.module("myapp");
	module.run(["$rootScope", "$location", "$route", function(rootScope, loc, route) {
		rootScope.$on('$locationChangeSuccess', locationChangeSuccess);
		function locationChangeSuccess(event) {
			rootScope.$broadcast("locChanges");
			console.log("locationChangeSuccess");
		}
	}]);
	module.factory("userInfo", function() {
		var factory = {};
		var user = '';
		factory.setUserInfo = setUserInfo;
		factory.getUserInfo = getUserInfo;
		function setUserInfo(data) {
			user = data;
		}
		function getUserInfo() {
			return user;
		}
		return factory;
	});
	module.factory("viewsList", ["getviews", "$q", "$route", function(gv, q, route) {
		var factory = {};
		var views;
		factory.setviews = setviews;
		factory.getviews = getviews;

		function setviews() {
			return views;
		}

		function getviews() {
			if (views) {
				return {
					type: "Array",
					data: views
				};
			} else {
				var defer = q.defer();
				gv.then(function success(event) {
					views = event.data;
					defer.resolve({
						type: "Promise",
						data: event.data
					});
				}, function error(error) {
					defer.reject(error)
				})
				return defer.promise;
			}
		}
		return factory;
	}]);
	module.factory("getParams", ["$route", function(route) {
		var factory = function() {
			return route.current.params;
			//return parseInt(route.current.params.nodeId);
		}
		return factory;
	}]);
	module.factory("viewLoader", ["getviews", "$q", "$route", "viewsList", function(getviews, q, route, viewsList) {
		var factory = {};
		factory.getViews = getViews;

		function getViews(callback) {
			getviews.then(function success(event) {
				callback(event.data);
			}, function error(error) {

			});
		}
		return factory;
	}]);
	module.factory("units", ["kpiDataService", "$q", function(kpiDataService, q) {
		var factory = {};
		var defer = new q.defer();
		factory.getUnits = getUnits;

		function getUnits() {
			return defer.promise;
		}
		kpiDataService.getAllUnits(function(event) {
			defer.resolve(event);
		});
		return factory;
	}]);
	module.factory("getviews", ["viewFlexService", "$q", function(viewFlexService, q) {
		var defer = new q.defer();
		factory = defer.promise;
		viewFlexService.getAllMyViews(function(event) {
			defer.resolve(event);
		});
		return factory;
	}]);
	module.factory("getSimpleDistricts", ["resourceUIService", "$q", function(resourceUIService, q) {
		var defer = new q.defer();
		factory = defer.promise;
		resourceUIService.getSimpleDistricts(function(event) {
			defer.resolve(event);
		});
		return factory;
	}]);
	module.factory("deleteViews", ["kpiDataService", "$q", function(kpiDataService, q) {
		var factory = function(ids) {
			var defer = new q.defer();
			kpiDataService.deleteViews(ids, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("updateResource", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(resource) {
			var defer = new q.defer();
			resourceUIService.updateResource(resource, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getSensorChannelsByDeviceId", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(id) {
			var defer = new q.defer();
			resourceUIService.getSensorChannelsByDeviceId(id, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("saveAttrs", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(id, attrs) {
			var defer = new q.defer();
			resourceUIService.saveAttrs(id, attrs, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getResourceById", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(id) {
			var defer = new q.defer();
			resourceUIService.getResourceById(id, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("saveSensorChannels", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(list) {
			var defer = new q.defer();
			resourceUIService.saveSensorChannels(list, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getModels", ["graphservice", "$q", function(graphservice, q) {
		var defer = new q.defer();
		factory = defer.promise;
		graphservice.getModels(function(event) {
			defer.resolve(event);
		});
		return factory;
	}]);
	module.factory("getAllGateways", ['resourceUIService', "$q", function(resourceUIService, q) {
		var defer = new q.defer();
		factory = defer.promise;
		resourceUIService.getAllGateways(function(event) {
			defer.resolve(event);
		});
		return factory;
	}]);
	module.factory("getAttrsByModelId", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(id) {
			var defer = new q.defer();
			resourceUIService.getAttrsByModelId(id, function(event) {
				defer.resolve(event);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getKpisByModelId", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(id) {
			var defer = new q.defer();
			resourceUIService.getKpisByModelId(id, function(event) {
				defer.resolve(event);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getSensorChannelsByDeviceId", ["resourceUIService", "$q", "getAllGateways", function(resourceUIService, q, getAllGateways) {
		var factory = function(id) {
			var defer = new q.defer();
			resourceUIService.getSensorChannelsByDeviceId(id, function(event) {
				defer.resolve(event);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getEmptySensorChannels", ["resourceUIService", "$q", "getAllGateways", function(resourceUIService, q, getAllGateways) {
		var factory = function() {
			var defer = new q.defer();
			resourceUIService.getEmptySensorChannels(function(event) {
				defer.resolve(event);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("getAllGateways", ["resourceUIService", "$q", function(resourceUIService, q) {
		var defer = new q.defer();
		factory = defer.promise;
		resourceUIService.getAllGateways(function(event) {
			defer.resolve(event);
		}, function(error) {
			defer.reject(error);
		});
		return factory;
	}]);
	module.factory("addNewGateway", ["resourceUIService", "$q", function(resourceUIService, q) {
		var defer = new q.defer();
		factory = defer.promise;;
		resourceUIService.getAllGateways(function(event) {
			defer.resolve(event);
		}, function(error) {
			defer.reject(error);
		});
		return factory;
	}]);
	module.factory("registerDevice", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(gateid, device) {
			var defer = new q.defer();
			resourceUIService.registerDevice(gateid, device, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("unregisterDevice", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(gateid, deviceid) {
			var defer = new q.defer();
			resourceUIService.unregisterDevice(gateid, deviceid, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("activateDevice", ["resourceUIService", "$q", function(resourceUIService, q) {
		var factory = function(device) {
			var defer = new q.defer();
			resourceUIService.activateDevice(device, function(event) {
				defer.resolve(event);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		};
		return factory;
	}]);
	module.factory("addNewEquipment", ["getAllGateways", "registerDevice", "activateDevice", "$q", "userInfo", function(getAllGateways, registerDevice, activateDevice, q, userInfo) {
		var factory = function(equipment, values) {
			var defer = new q.defer();
			console.log(values);
			getAllGateways.then(function success(event) {
				var virtual = event.data.filter(function(gateway) {
					return gateway.type == "virtual" && gateway.managedStatus == "active"
				})[0];
				if (virtual) {
					var gatewayid = virtual.id;
					var domainpath = userInfo.getUserInfo().domainPath;
					var device = {
						domainId: '',
						domainPath: domainpath,
						externalDevId: randomNum(),
						gatewayid: gatewayid,
						id: 0,
						isEdit: 2,
						label: equipment.label,
						managedStatus: "deactive",
						modelId: equipment.model.id + "",
						onlineStatus: "offline",
						operationStatus: 0,
						values: values
					};
					console.log(device);
					registerDevice(gatewayid, device).then(function success(event) {
						activateDevice(event.data).then(function success(event) {
							defer.resolve(event);
						}, function error(error) {
							defer.reject(error);
						});
					}, function error(error) {
						defer.reject(error);
					});
				}
			}, function error(error) {
				defer.reject(error);
			});
			return defer.promise;
		};

		function randomNum() {
			var result = parseInt(Math.random() * 1000000000000000);
			return result;
		}
		return factory;
	}]);
	module.factory("ttt", ["$timeout", "$q", function(timeout, q){
		var factory = {};
		factory.test = function()
		{
			var deferred = q.defer();
			timeout(function(){
				deferred.resolve("asdasd");
			}, 2000);
			return deferred.promise;
		};
		return factory;
	}]);
	module.factory("loginManagement", ["$rootScope", "userLoginUIService", "$q", "$location", "$window", "$route", "userInfo", "$timeout", function(rootScope, userLoginUIService, q, loc, window, route, userInfo, timeout) {
		var factory = {};
		var _HOST_ = loc.$$host;
		var _PORT_ = loc.$$port;
		var pathName = loc.path().split("/")[1];
		factory.login = login;
		factory.logout = logout;
		factory.back = back;
		factory.newProf = newProf;
		factory.openProf = openProf;
		factory.loginChecking_login = loginChecking_login;
		factory.loginChecking_others = loginChecking_others;
		function login(item) {
			var name = item.name;
			var password = item.password;
			userLoginUIService.login(name, password, login_callback, onError);
			function onError(e) {}
		}
		function logout() {
			userLoginUIService.logout(logout_callback);
		}
		function loginChecking_login() {
			var defer = q.defer();
			if (userLoginUIService.user.isAuthenticated) {
				pass();
			} else {
				rootScope.$on("loginStatusChanged", function(data) {
					if (userLoginUIService.user.isAuthenticated) {
						pass();
					} else {
						window.location.href = "../app-ac/index.html#/myView";
					}
				})
			};
			function pass() {
				window.location.href = "../app-ac/index.html#/myView";
				/*
				defer.resolve({
					status: "logined",
					data: userLoginUIService.user
				});
				userInfo.setUserInfo(userLoginUIService.user);
				*/
			}
			rootScope.loading = "没有登录";
			return defer.promise;
		}
		factory.test = function()
		{
			var deferred = q.defer();
			timeout(function(){
				deferred.resolve("asdasd");
			}, 2000);
			return deferred.promise;
		}
		function loginChecking_others() {
			var deferred = q.defer();
			if (userLoginUIService.user.isAuthenticated) {
				pass();
			} else {
				rootScope.$on("loginStatusChanged", function(data) {
					if (userLoginUIService.user.isAuthenticated) {
						//window.history.back();
						pass();
					} else {
						//alert("no login！")
						window.location.href = "../app-ac/index.html#/myView";
					}
				})
			};
			function pass() {
				deferred.resolve({
					status: "logined",
					data: userLoginUIService.user
				});
				userInfo.setUserInfo(userLoginUIService.user);
			}
			rootScope.loading = "载入设计器";
			return deferred.promise;
		}

		function login_callback(data) {
			if (data.data) {
				loc.path("/toposhow")
			}
		}

		function newProf() {
			if (loc.path() == "/topology") {
				window.open("index.html#/new/topology", "_self");
			} else {
				window.open("index.html#/topology", "_self");
			}
		}

		function openProf(viewId) {
			window.open("index.html#/topology/" + viewId, "_self");
		}

		function back() {
			window.open("../../app-oc/index.html#/designView", "_self");
		}

		function logout_callback(data) {
			loc.path("/");
		}
		return factory;
	}])
});