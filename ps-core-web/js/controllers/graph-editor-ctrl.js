define(['controllers/controllers'], function(controllers) {
	'use strict';
	controllers.controller('graphEditorCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', 'kpiDataService', 'resourceUIService', 'SwSocket', 'Info', 'viewFlexService', 'growl', '$q', '$window', '$location', 'solutionUIService', 'serviceCenterService', 'chartOptionService', 'toolBarList',
		function(scope, rootScope, routeParams, timeout, kpiDataService, resourceUIService, SwSocket, Info, viewFlexService, growl, q, window, location, solutionUIService, serviceCenterService, chartOptionService, toolBarList) {
			var status, rootCi, freeBoardValue, CHARTDATA, solutionId, serviceViewId, allViews, viewId, currentView, loadedView;
			var solutionId = routeParams.solutionId;
			var groupId = routeParams.groupId;
			var modelId = routeParams.modelId;
			var viewId = routeParams.viewId;
			var path = "../localdb/freeboard.json";
			scope.solutionId = solutionId;
			loadedView = {
				id : $randomString(32),
				type : 'column',
				children : [],
				col : 12
			};
			Info.get(path, function(info) {
				if(solutionId)
				{
					scope.titleComposory = false;
					solutionUIService.getModelDashboardViewContent(solutionId, groupId, modelId, getModelDashboardViewSolution);
				}
				else
				{
					scope.titleComposory = true;
					if(viewId)
					{
						viewFlexService.getAllMyViews(callback);
						scope.viewId = viewId;
					}
				}
			});
			function callback(event){
				allViews = event.data.filter(function(element){
					return element.viewType == "designView_v2" && element.viewId != viewId;
				});
				currentView = event.data.find(function(element){
					return element.viewId == viewId;
				});
				if(currentView)
				{
					scope.viewTitle = currentView.viewTitle;
					scope.titleChange();
					getDashboard();
				}
				else
				{
					throw new Error("视图不存在！！")
				}
			}
			function getDashboard(){
				var cachBindData = {};
				if(currentView != undefined)
				{
					var clone, dt = JSON.parse(currentView.content);
					clone = dt;
				}
				else
				{
					clone = standardDashboard.clone();
				}
				loadedView = {
					layout : clone.data,
					setting : clone.setting
				};
				scope.editData = {
					layout : clone.data,
					setting : clone.setting
				};
				scope.editData.layout.traveseByChild(function(element){
					if(element.onChange)
					{
						element.onChange = eval(element.onChange)
					}
					if(element.source)
					{
						var source = element.source;
						element.clone(freeBoardValue[source].clone().$extension(element));
					}
					if(element.data)
					{
						if(element.data.bindTo)
						{
							if(cachBindData[element.data.bindTo])
							{
								element.data = cachBindData[element.data.bindTo];
							}
							else
							{
								cachBindData[element.data.bindTo] = element.data;
							}
						}
					}
					element.id = $randomString(32)
				});
				replaceCiKpi.call(scope.editData.layout, function(){
					timeout(function(){
						scope.editData.renderBoard();
					})
				});
			}
			function getModelDashboardViewSolution(event){
				if(event.code)
				{
					if(event.data != null)
					{
						var clone, dt = JSON.parse(event.data);
						if(dt.version == "V_2")
						{
							clone = {
								layout :dt.data,
								setting : dt.setting
							};
						}
						else
						{
							clone = {
								layout : {
									id : $randomString(32),
									type : 'column',
									children : [],
									col : 12
								},
								setting : {
									padding : 15
								}
							};
						}
					}
					loadedView = clone.clone();
					scope.editData = clone;
					scope.editData.layout.traveseByChild(function(element){
						if(element.onChange)
						{
							element.onChange = eval(element.onChange)
						}
						if(element.source)
						{
							var source = element.source;
							element.clone(freeBoardValue[source].clone().$extension(element.clone()));
						}
						element.id = $randomString(32);
						//console.log("mmm= ", element.clone());
					});
					console.log("hhh = ", scope.editData);
					replaceCiKpi.call(scope.editData.layout, function(){
						timeout(function(){
							scope.editData.renderBoard();
						})
					});
				}
			}
			function toolbar(data)
			{
				this.clone(data);
			}
			toolbar.prototype.click = function(){
				scope.toolbarDetail = this.clone();
				scope.toolbarDetail.sub = scope.toolbarDetail.sub.map(function(element){
					return new subtoolbar(element);
				})
			};
			function subtoolbar(data)
			{
				this.clone(data);
			}
			subtoolbar.prototype.click = function()
			{
				var select = scope.tools[this.dataType.type + 'chart'].clone();
				var tempData = CHARTDATA[this.option];
				var uuid = $randomString(32);
				var selectWrap;
				select.$extension(tempData);
				select.id = $randomString(32);
				if(tempData)
				{
					select.$extension({
						data : {
							bindTo : uuid
						}
					});
					selectWrap = {
						type : "row",
						style : "border : 1px dashed #aaa; padding : 20px 0; margin : 20px auto;",
						children : [{
							type : 'col',
							col : 12,
							children : [{
								id : $randomString(32),
								type : 'multiSelect',
								data : select.data.$extension({
									bindTo : uuid
								})
							}]
						},{
							type : 'col',
							col : 12,
							children : [select]
						}]
					};
				}
				else {
					selectWrap = select;
				}
				scope.toolbarDetail = undefined;
				scope.editData.layout.children.push(select);
				scope.editData.renderBoard();
			};
			function modelSelector(data){
				this.clone(data);
			};
			rootScope.exitDashboard = function()
			{
				var fnlist = [{
					label : '不保存',
					icon : 'btn btn-default pull-left',
					style : {
						width : '50%',
						'border-radius' : 0,
						'font-size' : '18px',
						'font-weight' : 'bold',
						'padding' : 10
					},
					fn : function(){
						if(solutionId && serviceViewId)
						{
							window.location.href = "../app-ac/index.html#/myView";
						}
						else
						{
							window.location.href = "../app-oc/index.html#/designView/" + scope.viewId;
						}
					}
				},{
					label : '取消',
					icon : 'btn btn-cancel',
					style : {
						width : '50%',
						'border-radius' : 0,
						'font-size' : '18px',
						'font-weight' : 'bold',
						'padding' : 10
					},
					fn : function(){
						scope.dialogBox = undefined;
					}
				},{
					label : '保存',
					icon : 'btn btn-success',
					style : {
						width : '50%',
						'border-radius' : 0,
						'font-size' : '18px',
						'font-weight' : 'bold',
						'padding' : 10
					},
					fn : function(){
						rootScope.saveDashboard(function(){
							if(rootScope.viewmode == 'editor')
							{
								if(solutionId && serviceViewId)
								{
									window.location.href = "../app-ac/index.html#/myView";
								}
								else
								{
									window.location.href = "../app-oc/index.html#/designView/" + scope.viewId;
								}
							}
							else
							{
								if(solutionId && serviceViewId)
								{
									window.location.href = "../app-ac/index.html#/myView";
								}
								else
								{
									window.location.href = "../app-oc/index.html#/designView/" + scope.viewId;
								}
							}
						});
					}
				}];
				scope.dialogBox = {
					title : {
						label : '退出DASHBOARD编辑器'
					},
					description : {
						label : '尚有未保存的修改，是否保存？'
					},
					fnlist : fnlist
				};
			};
			modelSelector.prototype.change = function()
			{
				var modelId = this.id;
				var defer = q.defer();
				var defera = q.defer();
				var deferb = q.defer();
				scope.unitFilter = undefined;
				scope.unitFilterDisabled = false;
				serviceCenterService.kpis.getBymodelId(modelId).then(function success(data){
					scope.kpis = data;
					scope.kpiUnits = data.reduce(function(prev, next){
						var some = prev.some(function(elem){
							return elem.value == next.unit;
						});
						if(!some){
							prev.push({
								label : next.unit,
								value : next.unit
							})
						}
						return prev;
					},[{
						label : 'all',
						value : ''
					}]);
					defera.resolve("success");
				}, function error(err){
					console.log(err);
				});
				serviceCenterService.resources.getBymodelId(modelId).then(function success(data){
					scope.resources = data;
					deferb.resolve("success");
				}, function error(err){
					console.log(err);
				});
				q.all([defera.promise,deferb.promise]).then(function(event){
					defer.resolve("success");
				});
				return defer.promise;
			};
			console.log(toolBarList);
			scope.toolBarList = toolBarList.map(function(element){
				return new toolbar(element);
			});
			scope.cols = [{
				inx : 0,
				value : 12
			}];
			scope.drop = {};
			scope.colstyles = [{
				label : '自定义',
				value : []
			},{
				label : '100%',
				value : [12]
			},{
				label : '50% - 50%',
				value : [6,6]
			},{
				label : '66% - 33%',
				value : [8,4]
			},{
				label : '33% - 66%',
				value : [4,8]
			},{
				label : '33% - 33% - 33%',
				value : [4,4,4]
			},{
				label : '25% - 25% - 25% - 25%',
				value : [3,3,3,3]
			}];
			var path1 = "../localdb/editor.json";
			var path2 = "../localdb/freeboard.json";
			scope.titleChange = function()
			{
				if(allViews)
				{
					check();
				}
				else
				{
					viewFlexService.getAllMyViews(function(event){
						if(event.code == '0')
						{
							allViews = event.data.filter(function(element){
								return element.viewType == "designView_v2" && element.viewId != viewId;
							});
							check();
						}
					});
				}
				function check()
				{
					var find = allViews.some(function(element){
						return element.viewTitle == scope.viewTitle;
					});
					scope.correct = !find;
				}
			};
			function refineDataStructure()
			{
				var cachBindData = {};
				this.traveseByChild(function(element){
					delete element.id;
					if(element.$$hashKey)
					{
						delete element.$$hashKey;
					}
					if(element.data)
					{
						if(element.data.model)
						{
							element.data.model = {
								id : element.data.model.id
							}
						}
						if(element.data.resource)
						{
							element.data.resource = element.data.resource.map(function(elem){
								if(elem.id == rootCi.id)
								{
									return "rootCi";
								}
								else
								{
									return elem.id
								}

							})
						}
						if(element.data.kpi)
						{
							element.data.kpi = element.data.kpi.map(function(elem){
								return elem.id
							})
						}
					}
					if(element.attributes)
					{
						for(var i in element.attributes)
						{
							var reset = {
								value : element.attributes[i].value
							};
							if(element.attributes[i].applied != undefined)
							{
								reset.applied = element.attributes[i].applied;
							}
							if(element.attributes[i].data)
							{
								reset.$extension({
									data : {
										value : element.attributes[i].data.value
									}
								})
							}
							element.attributes[i] = reset;
						}
						if(element.data.bindTo)
						{
							if(cachBindData[element.data.bindTo])
							{
								element.data = cachBindData[element.data.bindTo];
							}
							else
							{
								cachBindData[element.data.bindTo] = element.data;
							}
						}
					}
				});
			};
			rootScope.saveDashboard = function(callback)
			{

				if( solutionId || typeof scope.viewTitle == 'string' && scope.viewTitle != '' )
				{
					var savedata = scope.editData.clone();
					refineDataStructure.call(savedata.layout);
					var content = {
						version : 'V_2',
						data : savedata.layout,
						setting : savedata.setting
					};
					if(solutionId)
					{
						solutionUIService.saveModelDashboardViewContent(solutionId, groupId, modelId, JSON.stringify(content), function(event){
							if(event.code == 0){
								//window.location.href = "../app-ac/index.html#/myView";
								growl.success("解决方案视图修改成功", {});
							}
							else
							{
								growl.error("解决方案视图修改失败", {});
							}
						});
					}
					else
					{
						var param = {
							viewTitle : scope.viewTitle.length > 30 ? scope.viewTitle.slice(0,30) : scope.viewTitle,
							viewName : 'designView_v2',
							viewType : "designView_v2",
							content : JSON.stringify(content)
						};
						if(scope.viewId)
						{
							param.viewId = scope.viewId;
							viewFlexService.updateView(param, function(event){
								if (event.code == 0) {
									growl.success("性能视图修改成功", {});
									if(callback)
									{
										callback();
									}
									//window.location.href = "../app-oc/index.html#/designView/" + scope.viewId;
								}
							})
						}
						else
						{
							viewFlexService.addView(param, function(event){
								if (event.code == 0) {
									growl.success("性能视图创建成功", {});
									scope.viewId = event.data.viewId;
									if(callback)
									{
										callback();
									}
									//window.location.href = "../app-oc/index.html#/designView/" + event.data.viewId;
								}
							})
						}
					}
				}
				else
				{
					growl.error("视图名不能为空！", {});
				}
			};
			Info.get(path1, function(info) {
				console.log(info);
				CHARTDATA = info;
				Info.get(path2, function(info) {
					freeBoardValue = info.freeBoardValue;
					init();
				});
			});
			scope.editData = {
				layout : {
					id : $randomString(32),
					type : 'column',
					children : [],
					col : 12
				},
				setting : {
					padding : 15
				}
			};
			rootScope.panelCancel = panelCancel;
			function panelCancel(){
				scope.unitFilter = "";
				scope.unitFilterDisabled = false;
				scope.dataPanel = undefined;
				scope.editPanel = undefined;
				scope.resources = undefined;
				scope.kpis = undefined;
			}
			function init()
			{
				serviceCenterService.rootDomain.get().then(function success(data){
					rootCi = data;
					var model = [data.modelId]
					resourceUIService.getModelByIds(model, function(event){
						var rootModel = event.data[0];
						var allmodel = [rootModel];
						serviceCenterService.models.getAll().then(function success(data){
							Array.prototype.push.apply(allmodel, data);
							scope.allModels = allmodel.map(function(element){
								return new modelSelector(element);
							});
							freeBoardValue.TEXT.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.SPARKLINE.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.LINECHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.GAUGECHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.PIECHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.BARCHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.SCATTERCHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.KCHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							freeBoardValue.RADARCHART.$extension({
								data : {
									model : scope.allModels[0],
									resource : [rootCi],
									modelDisable : false
								}
							});
							scope.tools = {
								grid : freeBoardValue.GRID,
								linechart : freeBoardValue.LINECHART,
								gaugechart : freeBoardValue.GAUGECHART,
								piechart : freeBoardValue.PIECHART,
								barchart : freeBoardValue.BARCHART,
								scatterchart : freeBoardValue.SCATTERCHART,
								kchart : freeBoardValue.KCHART,
								radarchart : freeBoardValue.RADARCHART,
								mapchart : {
									type : 'mapchart'
								},
								map1chart : {
									type : 'map1chart'
								},
								map2chart : {
									type : 'map2chart'
								},
								scatter2chart : {
									type : 'scatter2chart'
								},
								scatter3chart : {
									type : 'scatter3chart'
								},
								relation1chart : {
									type : "relation1chart"
								},
								relation2chart : {
									type : "relation2chart"
								},
								parallels1chart : {
									type : 'parallels1chart'
								},
								parallels2chart : {
									type : 'parallels2chart'
								},
								parallels3chart : {
									type : 'parallels3chart'
								},
								sankey1chart : {
									type : 'sankey1chart'
								},
								sankey2chart : {
									type : 'sankey2chart'
								}
							};
							for(var i in scope.tools)
							{
								console.log(scope.tools[i])
								replaceCiKpi.call(scope.tools[i]);
							}
							scope.editData.renderBoard();
						}, function error(err){
							console.log(err);
						})
					})
				});
			}
			scope.colstyle = scope.colstyles[1];
			scope.gridSelector = {};
			scope.colChange = function(col){
				scope.gridSelector.setValue(col);
			};
			scope.onDelete = function(event)
			{
				var targetId = $(event.target).attr("id");
				var getElem, getParent;
				scope.editData.layout.traveseByChild(function(element, parent){
					if(element.id == targetId)
					{
						getElem = element;
						getParent = parent;
					}
				});
				var find = getParent.find(function(elem){
					return elem == getElem;
				});
				if(find)
				{
					getParent.$remove(function(element){
						return element.id == find.id;
					});
				}
				scope.editData.renderBoard();
			};
			scope.onSetting = function(event, ui)
			{
				var getElem, getParent;
				var targetId = $(event.target).attr("id");
				scope.editData.layout.traveseByChild(function(element, parent){
					if(element.id == targetId)
					{
						getElem = element;
						getParent = parent;
					}
				});
				scope.selectData = getElem;
				scope.editPanel = getElem.clone();
				rootScope.panelClose = function panelCloseData(){
					getElem.$extension(scope.editPanel);
					scope.unitFilter = "";
					scope.unitFilterDisabled = false;
					scope.dataPanel = undefined;
					scope.editPanel = undefined;
					scope.resources = undefined;
					scope.kpis = undefined;
					scope.editData.renderBoard();
				};
			};
			scope.switchToData = function()
			{
				var temp = scope.editPanel;
				scope.editPanel = undefined;
				timeout(function(){
					dataPanelShow(temp);
				}, 400);
				rootScope.panelClose = panelCloseData;
				function panelCloseData(){
					if(scope.dataPanel.data.resource && scope.dataPanel.data.kpi)
					{
						for(var i in scope.dataPanel.attributes)
						{
							if(scope.dataPanel.attributes[i].data)
							{
								if(scope.dataPanel.attributes[i].data.value == 'none')
								{
									scope.dataPanel.attributes[i].data.value = scope.dataPanel.attributes[i].data.option[1].value;
								}

							}
						}
						if(scope.dataPanel.valueGroup)
						{
							scope.dataPanel.valueGroup.data.value = "value";
						}
					}
					else
					{
						for(var i in scope.dataPanel.attributes)
						{
							if(scope.dataPanel.attributes[i].data)
							{
								if(scope.dataPanel.attributes[i].data.value != 'none')
								{
									scope.dataPanel.attributes[i].data.value = 'none';
								}
							}
						}
						if(scope.dataPanel.valueGroup)
						{
							scope.dataPanel.valueGroup.data.value = "custom";
						}
					}
					scope.selectData.$extension(scope.dataPanel);
					scope.editData.renderBoard();
					timeout(function(){
						var temp = scope.selectData.clone();
						scope.editPanel = temp;
						rootScope.panelClose = function(){
							scope.selectData.$extension(scope.editPanel);
							scope.editData.renderBoard();
							scope.unitFilter = "";
							scope.unitFilterDisabled = false;
							scope.dataPanel = undefined;
							scope.editPanel = undefined;
							scope.resources = undefined;
							scope.kpis = undefined;
						};
					}, 400);
					scope.unitFilter = "";
					scope.unitFilterDisabled = false;
					scope.dataPanel = undefined;
					scope.editPanel = undefined;
					scope.resources = undefined;
					scope.kpis = undefined;
				}
			};
			scope.onDataChange = function(event, ui)
			{
				var getElem, getParent;
				var targetId = $(event.target).attr("id");
				scope.editData.layout.traveseByChild(function(element, parent){
					if(element.id == targetId)
					{
						getElem = element;
						getParent = parent;
					}
				});
				for(var i in scope.resources)
				{
					scope.resources[i].checked = false;
				}
				for(var i in scope.kpis)
				{
					scope.kpis[i].checked = false;
				}
				scope.selectData = getElem;
				dataPanelShow(getElem.clone());
				rootScope.panelClose = panelCloseData;
				function panelCloseData(){
					if(scope.dataPanel.data.resource && scope.dataPanel.data.kpi)
					{
						for(var i in scope.dataPanel.attributes)
						{
							if(scope.dataPanel.attributes[i].data)
							{
								if(scope.dataPanel.attributes[i].data.value == 'none')
								{
									scope.dataPanel.attributes[i].data.value = scope.dataPanel.attributes[i].data.option[1].value;
								}

							}
						}
						if(scope.dataPanel.valueGroup)
						{
							scope.dataPanel.valueGroup.data.value = "value";
						}
					}
					else
					{
						for(var i in scope.dataPanel.attributes)
						{
							if(scope.dataPanel.attributes[i].data)
							{
								if(scope.dataPanel.attributes[i].data.value != 'none')
								{
									scope.dataPanel.attributes[i].data.value = 'none';
								}
							}
						}
						if(scope.dataPanel.valueGroup)
						{
							scope.dataPanel.valueGroup.data.value = "custom";
						}
					}
					scope.selectData.$extension(scope.dataPanel.clone());
					scope.editData.renderBoard();
					scope.unitFilter = "";
					scope.unitFilterDisabled = false;
					scope.dataPanel = undefined;
					scope.editPanel = undefined;
					scope.resources = undefined;
					scope.kpis = undefined;
				}
			};
			function panelClose()
			{
				scope.unitFilter = "";
				scope.unitFilterDisabled = false;
				scope.dataPanel = undefined;
				scope.editPanel = undefined;
				scope.resources = undefined;
				scope.kpis = undefined;
				scope.editData.renderBoard();
			}
			scope.onChange = function(cols, reset){
				scope.tools.grid.children = cols.map(function(element){
					var result = {
						type : 'column',
						children : [],
						col : element
					};
					return result
				});
				if(reset)
				{
					scope.colstyle = scope.colstyles[0];
				}
			};
			scope.onDrop = function(event, ui, before)
			{
				var targetId = $(event.target).attr("id");
				var dragId = ui.draggable.attr("id");
				if(targetId != dragId)
				{
					if(dragId.indexOf("add_") == -1)
					{
						var getElem, getParent, clone = {};
						scope.editData.layout.traveseByChild(function(element, parent){
							if(element.id == dragId)
							{
								getElem = element;
								getParent = parent;
							}
						});
						clone = getElem.clone();
						var find = getParent.find(function(elem){
							return elem == getElem;
						});
						if(find)
						{
							getParent.$remove(function(element){
								return element.id == find.id;
							});
						}
						var find, targetParent;
						scope.editData.layout.traveseByChild(function(element, parent){
							if(element.id == targetId)
							{
								find = element;
								targetParent = parent;
							}
						});
						if(before)
						{
							var inx = targetParent.indexOf(find);
							if(inx != -1)
							{
								targetParent.insertBefore(inx, clone);
							}
						}
						else
						{
							find.children.push(clone);
						}
						scope.editData.renderBoard();
					}
					else
					{
						var dragId = dragId.split("add_")[1];
						if(dragId == 'grid')
						{
							var find, pare, children;
							var children = [];
							var row;
							if(scope.tools.clone()[dragId])
							{
								row = scope.tools.clone()[dragId];
							}
							else if(scope.tools.clone()[dragId + 'chart'])
							{
								row = scope.tools.clone()[dragId + 'chart'];
							}
							else
							{
								throw new Error("找不到视图!")
							}
							row.traveseByChild(function(element){
								element.id = $randomString(32);
								element.traverse(function(el){
									if(el.onChange)
									{
										el.onChange = eval(el.onChange)
									}
								});
							});
							scope.editData.layout.traveseByChild(function(element, parent){
								if(element.id == targetId)
								{
									find = element;
									pare = parent;
								}
							});
							if(before)
							{
								var inx = pare.indexOf(find);
								pare.insertBefore(inx, row);
							}
							else
							{
								find.children.push(row);
							}
							scope.editData.renderBoard();
						}
						else
						{
							var find = toolBarList.find(function(element){
								return element.id == dragId;
							});
							var uuid = $randomString(32)
							var option = find.sub[0].option
							var find, pare, children;
							var children = [];
							var select;
							if(scope.tools.clone()[dragId])
							{
								select = scope.tools.clone()[dragId];
							}
							else if(scope.tools.clone()[dragId + 'chart'])
							{
								select = scope.tools.clone()[dragId + 'chart'];
							}
							else
							{
								throw new Error("找不到视图!")
							}

							var tempData = CHARTDATA[option];
							select.id = $randomString(32);
							select.$extension(tempData);
							var selectWrap = {
								type : "row",
								style : "border : 1px dashed #aaa; padding : 20px 0; margin : 20px auto;",
								children : [{
									type : 'col',
									col : 12,
									children : [{
										id : $randomString(32),
										type : 'multiSelect',
										data : {
											bindTo : uuid,
											model : select.data.model,
											resource : select.data.resource
										}
									}]
								},{
									type : 'col',
									col : 12,
									children : [select]
								}]
							};
							selectWrap.traveseByChild(function(element){
								element.id = $randomString(32);
								element.traverse(function(el){
									if(el.onChange)
									{
										el.onChange = eval(el.onChange)
									}
								});
							});
							scope.editData.layout.traveseByChild(function(element, parent){
								if(element.id == targetId)
								{
									find = element;
									pare = parent;
								}
							});
							if(before)
							{
								var inx = pare.indexOf(find);
								pare.insertBefore(inx, selectWrap);
							}
							else
							{
								find.children.push(selectWrap);
							}
							scope.editData.renderBoard();
						}
					}
				}
			};
			scope.kpiChange = function(kpi)
			{
				if(scope.dataPanel.data.maxKpi == 1)
				{
					for(var i in scope.kpis)
					{
						if(scope.kpis[i].id != kpi.id)
						{
							scope.kpis[i].checked = false;
						}
						else
						{
							scope.kpis[i].checked = !scope.kpis[i].checked;
						}
					}
				}
				else
				{
					kpi.checked = !kpi.checked;
				}
				var filter = scope.kpis.filter(function(element){
					return element.checked == true;
				})
				if(filter.length > 0)
				{
					scope.unitFilter = filter[0].unit;
					scope.unitFilterDisabled = true;
					scope.dataPanel.data.kpi = filter;
				}
				else
				{
					scope.unitFilter = "";
					scope.unitFilterDisabled = false;
					scope.dataPanel.data.kpi = undefined;
				}
			};
			scope.resourceChange = function(resource)
			{
				console.log(scope.resources);
				resource.checked = !resource.checked;
				var filter = scope.resources.filter(function(element){
					return element.checked == true;
				});
				if(filter.length > 0)
				{
					scope.dataPanel.data.resource = filter;
				}
				else
				{
					scope.dataPanel.data.resource = undefined;
				}
			};
			function dataPanelShow(temp)
			{
				scope.dataPanel = temp.clone();
				scope.dataPanel.data.model = scope.allModels.find(function(element){
					return element.id == scope.dataPanel.data.model.id;
				});
				scope.dataPanel.data.model.change().then(function success(){
					for(var i in scope.resources)
					{
						var some = false;
						if(scope.dataPanel.data.resource)
						{
							some = scope.dataPanel.data.resource.some(function(elem){
								return scope.resources[i].id == elem.id;
							});
						}
						scope.resources[i].checked = some;
					}
					for(var i in scope.kpis)
					{
						var find;
						if(scope.dataPanel.data.kpi) {
							find = scope.dataPanel.data.kpi.find(function (elem) {
								return scope.kpis[i].id == elem.id;
							});
						}
						if(find)
						{
							scope.unitFilter = find.unit;
							scope.unitFilterDisabled = true;
						}
						scope.kpis[i].checked = ( find != undefined );
					}
				});
			};
			function replaceCiKpi(callback)
			{
				var defers = [];
				var cur = this;
				this.traveseByChild(function(element){
					var resourceArr = [];
					var finished, def = q.defer();
					defers.push(def.promise);
					(function(def){
						if(element.data)
						{
							element.data.defer = function(callback){
								finished = callback;
							};
							if(typeof element.data.model != 'object')
							{
								var modelId = element.data.model;
								resourceUIService.getModelByIds([modelId], function(event){
									if(event.code == '0')
									{
										element.data.model = new modelSelector(event.data[0]);
										getcikpi(modelId);
									}
								});
							}
							else if(element.data.model != undefined)
							{
								var modelId = element.data.model.id;
                if(modelId == undefined)
                {
                  console.log(element, "is empty")
                }
								getcikpi(modelId);
							}
						}
						else
						{
							def.resolve("success");
						}
						function getcikpi(modelId){
              console.log(modelId)
							serviceCenterService.resources.getBymodelId(modelId).then(function success(data){
								if($.isArray(element.data.resource))
								{
									for(var i in element.data.resource)
									{
										if(element.data.resource[i] == 'rootCi')
										{
											element.data.resource[i] = rootCi;
										}
										else if(typeof element.data.resource[i] != 'object')
										{
											var resourceId = element.data.resource[i];
											element.data.resource[i] = data.find(function(elem){
												return resourceId == elem.id;
											});
										}
									}
								}
								serviceCenterService.kpis.getBymodelId(modelId).then(function success(data){
									if($.isArray(element.data.kpi))
									{
										for(var i in element.data.kpi)
										{
											if(typeof element.data.kpi[i] != 'object'){
												var kpiId = element.data.kpi[i];
												element.data.kpi[i] = data.find(function(elem){
													return kpiId == elem.id;
												});
											}
										}
									}
									delete element.data.defer;
									if(typeof finished == 'function')
									{
										finished("success!!");
									}
									def.resolve("success");
								});
							});
						}
					})(def);
				})
				q.all(defers).then(function success(data){
					if(typeof callback == 'function')
					{
						callback();
					}
				});
			}
			scope.mode = "EDIT";
			scope.groupRemove = function(target, list)
			{
				if(list.length > 1)
				{
					list.$remove(function(element){
						return target.id == element.id;
					});
					console.log(list);

					for(var i in list)
					{
						list[i].id = i;
					}
				}
			};
			rootScope.clearDashboard = function()
			{
				scope.editData = {
					layout : {
						id : $randomString(32),
						type : 'column',
						children : [],
						col : 12
					}
				};
				timeout(function(){
					scope.editData.renderBoard();
				});
			};
			rootScope.resetDashboard = function()
			{
				var cachBindData = {};
				scope.editData = loadedView.clone();
				scope.editData.layout.traveseByChild(function(element){
					if(element.onChange)
					{
						element.onChange = eval(element.onChange)
					}
					element.id = $randomString(32);
					if(element.source)
					{
						var source = element.source;
						element.clone(freeBoardValue[source].clone().$extension(element.clone()));
					}
					if(element.data)
					{
						if(element.data.bindTo)
						{
							if(cachBindData[element.data.bindTo])
							{
								element.data = cachBindData[element.data.bindTo];
							}
							else
							{
								cachBindData[element.data.bindTo] = element.data;
							}
						}
					}
				});
				replaceCiKpi.call(scope.editData.layout);
				timeout(function(){
					if(status == "PREV")
					{
						scope.editData.renderBoard(true);
					}
					else
					{
						scope.editData.renderBoard();
					}
				});
			};
			scope.dataTypeChange = function(data, editPanel)
			{
				if(data.value != "none")
				{
					if(editPanel.data.resource == undefined || editPanel.data.kpi == undefined)
					{
						var temp = scope.editPanel;
						scope.editPanel = undefined;
						timeout(function(){
							dataPanelShow(temp);
						}, 400);
						rootScope.panelClose = panelCloseData;
					}
				}
				function panelCloseData(){
					if(scope.dataPanel.data.resource && scope.dataPanel.data.kpi)
					{
						var temp = scope.dataPanel;
						scope.selectData.clone(temp);
						scope.dataPanel = undefined;
						scope.editData.renderBoard();
						timeout(function(){
							rootScope.panelClose = function(){
								scope.editPanel.clone(scope.selectData);
								scope.unitFilter = "";
								scope.unitFilterDisabled = false;
								scope.dataPanel = undefined;
								scope.editPanel = undefined;
								scope.resources = undefined;
								scope.kpis = undefined;
							};;
						}, 400);
					}
					else
					{
						data.value = "none";
					}
					scope.unitFilter = "";
					scope.unitFilterDisabled = false;
					scope.dataPanel = undefined;
					scope.editPanel = undefined;
					scope.resources = undefined;
					scope.kpis = undefined;
				}
			};
			scope.groupAdd = function(list)
			{
				var clone = list[0].clone();
				var value = [];
				for(var i in clone.attributes.value.value.split(","))
				{
					value.push(parseInt(Math.random()*100))
				}
				clone.attributes.value.value = value.toString();
				list.push(clone);
				for(var i in list)
				{
					delete list[i]['$$hashKey'];
					list[i].id = i;
				}
			};
			scope.tabClick = function(mode)
			{
				scope.mode = mode;
				if(mode == "EDIT")
				{
					$(".free-board-left").removeClass("free-board-fold");
					$(".free-board-right").removeClass("free-board-full");
					timeout(function(){
						var target = $(".previewarea");
						target.removeClass("previewarea");
						target.addClass("drawarea");
						scope.editData.renderBoard();
						status = "EDIT";
					}, 300)
				}
				else
				{
					$(".free-board-left").addClass("free-board-fold");
					$(".free-board-right").addClass("free-board-full");
					timeout(function(){
						var target = $(".drawarea");
						target.addClass("previewarea");
						target.removeClass("drawarea");
						scope.editData.renderBoard(true);
						status = "PREV";
					}, 300);
				};
			};
		}
	]);

});