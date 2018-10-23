define(['controllers/controllers'], function(controllers) {
	'use strict';
	controllers.initController('viewDirectiveCtrl', ['$scope', '$routeParams','$timeout', 'resourceUIService', 'kpiDataService', 'SwSocket','growl', 
		function($scope, $routeParams,$timeout,resourceUIService,kpiDataService, SwSocket,growl) {
			console.info("viewDirectiveCtrl被触发");
			
			var uuid;
			var item;
			var kpiCodes = [];
			var kpiCode2Name = {};
			var timePeriod = 0; //取值时间长度
			var nodeIds = []; //CI编码数组
			var category; //time或者实例模式

			var modelId= $routeParams.modelId;
			var nodeId = $routeParams.nodeId;
			$scope.selectedDiritem = {};
			$scope.itemKpiValues = {};
			$scope.itemDirValues = {};
			$scope.itemlabel = "";
			$scope.dirItemClick = function(item) {
				$scope.selectedDiritem = item;
			}
			$scope.sendItemDir = function() {
				for (var i in $scope.selectedDiritem.params) {
					var obj = $scope.selectedDiritem.params[i];
					var value = $scope.itemDirValues[obj.name];
					if (!value) {
						growl.warning("请输入:"+$scope.selectedDiritem.params[i].label,{});
						return;
					}
				}
				resourceUIService.sendDeviceDirective(Number(nodeId),$scope.selectedDiritem.id,$scope.itemDirValues,function(returnObj){
					if (returnObj.code == 0) {
						growl.success("指令发送成功",{});
					}
				});
				
			}
			var callback = function(evendata) {
				var kpiname = kpiCode2Name[evendata.data.kpiCode]
				if (kpiname)
					$scope.itemKpiValues[kpiname] = evendata.data.value;
			};

			var queryKpis = function(kpiCodes,nodeIds) {
				var kpiQueryModel = {
					category: "time",
					isRealTimeData: true,
					timePeriod: 0,
					nodeIds: nodeIds,
					kpiCodes: kpiCodes
				};
				var p = ["kpi", kpiQueryModel];
				
				var kpiReturnObj;
				var hierarchyValueHandler = function(returnObj) {

					if (returnObj.code == 0) {
						var xAxisObj;
						kpiReturnObj = returnObj.data;
						for (var i in kpiReturnObj.recordList) {
							var kpirecord = kpiReturnObj.recordList[i];
							for (var j in kpirecord) {
								var jary = j.split("-");
								if (jary.length > 1)
									$scope.itemKpiValues[jary[1]] = kpirecord[j]
							}
						}

						var param = {
							ciid: nodeIds.toString(),
							kpi: kpiCodes.toString()
						};
						var operation = "register";
						//考虑极端情况，一个页面有多个模块监听同一个方法  
						//但展示在页面的数据需对接收的实时监听的数据做不同处理 
						SwSocket.register(uuid, operation, callback);

						//websocket发送请求
						SwSocket.send(uuid, operation, 'kpi', param);
						
					}

				}
				kpiDataService.getKpiHierarchyValueList(p, function(returnObj) {
					hierarchyValueHandler(returnObj);
				});
			}
			var init = function() {
				uuid = Math.uuid();
					
				
				resourceUIService.getDirectivesByModelId(modelId,function(returnObj){
					if (returnObj.code == 0) {
						$scope.modelsDirs = returnObj.data;
						$scope.selectedDiritem = $scope.modelsDirs[0];
					}
				});
				
				resourceUIService.getKpisByModelId(modelId,function(returnObj){
					if (returnObj.code == 0) {
						$scope.modelsKpis = returnObj.data;
						for (var i in $scope.modelsKpis) {
							kpiCodes.push($scope.modelsKpis[i].id);
							kpiCode2Name[$scope.modelsKpis[i].id] = $scope.modelsKpis[i].name;
							$scope.itemKpiValues[$scope.modelsKpis[i].name] = "";
						}
						nodeIds = [nodeId]
						queryKpis(kpiCodes,nodeIds);
					}
				});
				resourceUIService.getResourceById(nodeId,function(returnObj){
					if (returnObj.code == 0) {
						$scope.itemlabel = returnObj.data.label;
					}
				});
				
			}
			
			
			if (modelId && nodeId) {
				init();
			}
			//注销scope时注销方法heartBeat，回调函数callback  
			$scope.$on("$destroy", function() {
				console.log("on-destroy");
				SwSocket.unregister(uuid);
			});
		}
	]);
});