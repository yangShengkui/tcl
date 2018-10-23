define(['directives/directives', "echarts", "jquery-ui", "macarons", 'bmap', "baiduMap"], function(directives, echarts) {
	'use strict';
	var dragging = false;
	directives.initDirective('editBtn', editBtn_directive);
	editBtn_directive.$inject = ['$timeout', 'variables', "$route"];
	function editBtn_directive(timeout, variables, route) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			dashboard : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				if(route.current.params.mode == 'edit')
				{
					$("#leftPart").addClass("open");
					$("#rightPart").addClass("fold");
					scope.dashboard.mode = "editmode";
				}
				else
				{
					$("#leftPart").removeClass("open");
					$("#rightPart").removeClass("fold");
					scope.dashboard.mode = "viewmode";
				}
			});
			$(element).on("click", function(){
				scope.$apply(function(){
					var body = $('body');
					if(scope.dashboard.callback){
						scope.dashboard.callback();
					}
					if(scope.dashboard.mode == variables._EDITMODE_){
						$("#leftPart").removeClass("open");
						$("#rightPart").removeClass("fold");
						scope.dashboard.mode = variables._VIEWMODE_;
					}
					else
					{
						$("#leftPart").addClass("open");
						$("#rightPart").addClass("fold");
						scope.dashboard.mode = variables._EDITMODE_;
					}
				});
			})
		};
		return directive;
	}
	directives.initDirective('colorSelector', colorSelector_directive);
	colorSelector_directive.$inject = ['$timeout', 'variables'];
	function colorSelector_directive(timeout, variables) {
		/*
		 var kpiQueryModel = {
		 category: 'ci',
		 isRealTimeData: true,
		 timePeriod: 0,
		 kpiCodes: ["alert_code_count"]
		 };
		 var p = ["alert", kpiQueryModel];
		 */
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			bgcolor : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				var colors = ['bg-red', 'bg-yellow', 'bg-aqua', 'bg-blue', 'bg-light-blue', 'bg-green', 'bg-navy', 'bg-teal', 'bg-olive', 'bg-lime', 'bg-orange', 'bg-fuchsia', 'bg-purple', 'bg-maroon', 'bg-white', 'bg-black']
				var wrap = $("<div class='selWrap' id='colorSelector'></div>");
				$(element).on("click.cs", showBlock);
				for(var i in colors){
					(function(color){
						var block = $("<div class='small-box " + color + "'></div>");
						block.css({
							width : 20,
							height : 20,
							margin : 5,
							float : 'left',
							display : block
						});
						wrap.append(block);
						block.on("click.block", function(event){
							event.stopPropagation();
							wrap.css("display", "none");
							$("body").off("click.body");
							$(element).off("click.cs");
							$(element).on("click.cs", showBlock);
							scope.$apply(function(){
								if(scope.bgcolor.attributes)
								{
									scope.bgcolor.attributes.color = color;
								}
								else
								{
									scope.bgcolor.attributes = {
										color : color
									}
								}
								$(element).removeClass().addClass("small-box").addClass(color);
							});
						});
					})(colors[i])
					scope.bgcolor.attributes.color = colors[0];
				}
				function showBlock(event){
					event.stopPropagation();
					wrap.css("display", "block");
					wrap.css("top" , $(element).offset().top);
					wrap.css("left" , $(element).offset().left + 30);
					$(element).off("click.cs");
					$(element).on("click.cs", hideBlock);
					$("body").on("click.body", hideBlock);
				};
				function hideBlock(event){
					event.stopPropagation();
					wrap.css("display", "none");
					$("body").off("click.body");
					$(element).off("click.cs");
					$(element).on("click.cs", showBlock);
				}
				$("body").prepend(wrap);
				wrap.on("click.empty", function(){
					event.stopPropagation();
				});
			});
		};
		return directive;
	}
	directives.initDirective('iconSelector', iconSelector_directive);
	iconSelector_directive.$inject = ['$timeout', 'variables'];
	function iconSelector_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			icon : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				/* var icons = ['fa fa-connectdevelop',
				 'fa fa-warning', 'fa fa-edit', 'fa fa-birthday-cake', 'fa fa-user', 'fa fa-envelope-o',
				 'fa fa-file-code-o', 'fa fa-icon-file', 'fa fa-clock-o', 'fa fa-warning',
				 'ps-lg-nofix ps-dashboard', 'ps-lg-nofix ps-resource', 'ps-lg-nofix ps-performance']; */
				var icons = ['ps-edit', ' ps-back', 'ps-mushroom','ps-planting','ps-current_production',
					'ps-estimated_output','ps-daily_output','ps-duration','ps-sandglass','ps-task','ps-current_production_p',
					'ps-pattern', 'ps-number', 'ps-air-humidity', 'ps-air-temperature', 'ps-camera', 'ps-sunshine',
					'ps-video-camera', 'ps-water', 'ps-fan', 'ps-electric_motor02', 'ps-electric_motor', 'ps-Co2',
					'ps-soil_temperature', 'ps-soil_humidity', 'ps-irrigation', 'ps-spraying', 'ps-chart_brokenline',
					'ps-userinfo', 'ps-user', 'ps-group', 'ps-center', 'ps-server', 'ps-app'];
				var wrap = $("<div class='selWrap' id='iconSelector'></div>");
				$(element).on("click.cs", showBlock);
				for(var i in icons){
					(function(icon){
						var block = $("<div class='icon'><span class='proudsmart " + icon + "' style='font-size : 15px; color : #fff; top : 2px; left : 2px;'></span></div>");
						block.css({
							width : 20,
							height : 20,
							margin : 5,
							float : 'left',
							display : block
						});
						wrap.append(block);
						block.on("click.block", function(event){
							event.stopPropagation();
							wrap.css("display", "block");
							$("body").off("click.body");
							wrap.css("display", "none");
							$(element).off("click.cs");
							$(element).on("click.cs", showBlock);
							scope.$apply(function(){
								if(scope.icon.attributes)
								{
									scope.icon.attributes.icon = icon;
								}
								else
								{
									scope.icon.attributes = {
										icon : icon
									}
								}
								$(element).find("i").removeClass().addClass("proudsmart " + icon);
							});
						});
					})(icons[i]);
					scope.icon.attributes.icon = icons[0];
				}
				function showBlock(event){
					event.stopPropagation();
					wrap.css("top" , $(element).offset().top);
					wrap.css("left" , $(element).offset().left + 30);
					wrap.css("display", "block");
					$(element).off("click.cs");
					$(element).on("click.cs", hideBlock);
					$("body").on("click.body", hideBlock);
				};
				function hideBlock(event){
					event.stopPropagation();
					wrap.css("display", "none");
					$("body").off("click.body");
					$(element).off("click.cs");
					$(element).on("click.cs", showBlock);
				}
				$("body").prepend(wrap);
				wrap.on("click.empty", function(){
					event.stopPropagation();
				});
			});
		};
		return directive;
	}
	directives.initDirective('ciSelectmenu', ciSelectmenu_directive);
	ciSelectmenu_directive.$inject = ['$timeout', 'variables'];
	function ciSelectmenu_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			tool : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				variables.$resources.get().then(function success(data){
					for(var i in data){
						(function(obj){
							var option = $("<option></option>");
							option.text(obj.label);
							option.attr("value", obj.id);
							this.append(option)
						}).call($(element), data[i])
					}
					var nodeId = data[0].id;
					scope.tool.attributes.ci = nodeId;
					var modelId = variables.$resources.getModelIdByNodeId(nodeId);
					variables.$kpis.getBymodelId(modelId).then(function success(data){
						scope.tool.onChange(data);
					}, function error(err){
						console.log(error);
					});

					$(element).selectmenu({
						width : 100,
						change : function(event, ui){
							var nodeId = parseInt(ui.item.value)
							scope.tool.attributes.ci = nodeId;
							var modelId = variables.$resources.getModelIdByNodeId(nodeId);
							variables.$kpis.getBymodelId(modelId).then(function success(data){
								scope.tool.onChange(data);
							}, function error(err){
								console.log(error);
							});
						}
					});
				}, function error(err){})
			});
		};
		return directive;
	};
	directives.initDirective('aciSelectmenu', aciSelectmenu_directive);
	aciSelectmenu_directive.$inject = ['$timeout', 'variables'];
	function aciSelectmenu_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			attr : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				variables.$resources.getCurrent().then(function success(data){
					for(var i in data){
						(function(index, obj){
							if(index != 0)
							{
								var option = $("<option></option>");
								option.text(obj.label);
								option.attr("value", obj.id);
								this.append(option)
							}
						}).call($(element), i, data[i])
					}
					var nodeId = data[1].id;
					scope.attr.attributes.ci = nodeId;
					variables.$resources.getAttrByNodeId(nodeId).then(function success(data){
						scope.attr.onChange(data);
					}, function error(err){
						console.log(error);
					});

					$(element).selectmenu({
						width : 100,
						change : function(event, ui){
							var nodeId = parseInt(ui.item.value);
							variables.$resources.getAttrByNodeId(nodeId).then(function success(data){
								scope.attr.onChange(data);
							}, function error(err){
								console.log(error);
							});
						}
					});
				}, function error(err){})
			});
		};
		return directive;
	};
	directives.initDirective('ciSelectmenuChart', ciSelectmenuChart_directive);
	ciSelectmenuChart_directive.$inject = ['$timeout', 'variables'];
	function ciSelectmenuChart_directive(timeout, variables) {
		var directive = {};
		var kpiCache;
		directive.restrict = "A";
		directive.scope = {
			chart : "="
		};
		directive.link = function(scope, element, attr){
			scope.$watch('chart', function(n, o, s){
				if(n){
					n.add = function(){
						var fill;
						for(var i in kpiCache){
							var find = scope.chart.kpiObjects.some(function(element){
								return  kpiCache[i].id == element.id;
							});
							if(!find){
								fill = {
									id : kpiCache[i].id
								};
								break;
							}
						}
						scope.chart.kpiObjects.push(fill);
						var kpiObj = scope.chart.kpiObjects;
						timeout(function(){
							kpiObj[kpiObj.length - 1].onChange(kpiCache);
						});
					}
				}
			});
			timeout(function(){
				variables.$resources.get().then(function success(data){
					for(var i in data){
						(function(obj){
							var option = $("<option></option>");
							option.text(obj.label);
							option.attr("value", obj.id);
							this.append(option)
						}).call($(element), data[i])
					}
					var nodeId = data[0].id;
					scope.chart.attributes.nodes = [nodeId];
					var modelId = variables.$resources.getModelIdByNodeId(nodeId);
					variables.$kpis.getBymodelId(modelId).then(function success(data){
						kpiCache = data;
						scope.chart.kpiObjects = [{
							id : data[0].id
						}];
						timeout(function(){
							scope.chart.kpiObjects[0].onChange(data);
						});
					}, function error(err){
						console.log(error);
					});

					$(element).selectmenu({
						width : 100,
						change : function(event, ui){
							scope.$apply(function(){
								var nodeId = parseInt(ui.item.value)
								scope.chart.attributes.nodes = [nodeId];
								var modelId = variables.$resources.getModelIdByNodeId(nodeId);
								variables.$kpis.getBymodelId(modelId).then(function success(data){
									kpiCache = data;
									scope.chart.kpiObjects = [{
										id : data[0].id
									}];
									timeout(function(){
										scope.chart.kpiObjects[0].onChange(data);
									});
								}, function error(err){
									console.log(error);
								});
							});
						}
					});
				}, function error(err){})
			});
		};
		return directive;
	};
	directives.initDirective('kpiSelectmenuChart', kpiSelectmenuChart_directive);
	kpiSelectmenuChart_directive.$inject = ['$timeout', 'variables'];
	function kpiSelectmenuChart_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			chart : "=",
			target : "="
		};
		directive.link = function(scope, element, attr){
			scope.$watch('chart', function(n, o, s){
				if(n){
					n.onChange = function(kpis){
						var result = kpis.filter(function(kpi){
							for(var i in s.filter){
								var find = (function(attr, value){
									return kpi[attr] == value;
								})(i, s.filter[i]);
								if(!find){
									return false;
								}
							}
							return true;
						});
						render(result)
					};
				}
			});
			scope.$watch('chart.id', function(n, o, s){
				if(n){
					s.target.attributes.kpis = s.target.kpiObjects.map(function(element){
						return element.id;
					});
				}
			});
			function render(data){
				$(element).children().remove();
				for(var i in data){
					(function(obj){
						var option = $("<option></option>");
						option.text(obj.label);
						option.attr("value", obj.id);
						if(scope.chart.id == obj.id){
							option.prop("selected", "selected");
						}
						this.append(option)
					}).call($(element), data[i])
				}
				var instance = $(element).selectmenu( "instance" );
				if(instance)
				{
					$(element).selectmenu( "refresh" );
				}
				else
				{
					$(element).selectmenu({
						width : 100,
						change : function(event, ui){
							scope.$apply(function(){
								scope.chart.id = parseInt(ui.item.value);
							});
						}
					});
				}
			};
		};
		return directive;
	}
	directives.initDirective('kpiSelectmenu', selectmenu_directive);
	selectmenu_directive.$inject = ['$timeout', 'variables'];
	function selectmenu_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			tool : "=",
			filter : "="
		};
		directive.link = function(scope, element, attr){
			scope.$watch('tool', function(n, o, s){
				if(n){
					n.onChange = function(kpis){
						var result = kpis.filter(function(kpi){
							for(var i in s.filter){
								var find = (function(attr, value){
									return kpi[attr] == value;
								})(i, s.filter[i]);
								if(!find){
									return false;
								}
							}
							return true;
						});
						render(result)
					};
				}
			});
			function render(data){
				$(element).children().remove();
				for(var i in data){
					(function(obj){
						var option = $("<option></option>");
						option.text(obj.label);
						option.attr("value", obj.id);
						this.append(option)
					}).call($(element), data[i])
				}
				var instance = $(element).selectmenu( "instance" );
				if(instance)
				{
					$(element).selectmenu( "refresh" );
				}
				else
				{
					$(element).selectmenu({
						width : 100,
						change : function(event, ui){
							scope.tool.attributes.kpi = parseInt(ui.item.value);
						}
					});
				}
				scope.tool.attributes.kpi = data[0].id;
			};
		};
		return directive;
	}
	directives.initDirective('attrSelectmenu', attrSelectmenu_directive);
	attrSelectmenu_directive.$inject = ['$timeout', 'variables'];
	function attrSelectmenu_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			attr : "=",
			filter : "="
		};
		directive.link = function(scope, element, attr){
			scope.$watch('attr', function(n, o, s){
				if(n){
					n.onChange = function(kpis){
						var result = kpis.filter(function(kpi){
							for(var i in s.filter){
								var find = (function(attr, value){
									return kpi[attr] == value;
								})(i, s.filter[i]);
								if(!find){
									return false;
								}
							}
							return true;
						});
						render(result)
					};
				}
			});
			function render(data){
				$(element).children().remove();
				for(var i in data){
					(function(obj){
						var option = $("<option></option>");
						option.text(obj.label);
						option.attr("value", obj.id);
						this.append(option)
					}).call($(element), data[i])
				}
				var instance = $(element).selectmenu( "instance" );
				if(instance)
				{
					$(element).selectmenu( "refresh" );
				}
				else
				{
					$(element).selectmenu({
						width : 100,
						change : function(event, ui){
							scope.attr.attributes.attrId = parseInt(ui.item.value);
						}
					});
				}
				scope.attr.attributes.attrId = data[0].id;
			};
		};
		return directive;
	}
	directives.initDirective('bootinputfree', bootinputfree_directive);
	bootinputfree_directive.$inject = ['$timeout', 'variables'];
	function bootinputfree_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "C";
		directive.scope = {
			model : "="
		};
		directive.link = function(scope, element, attr){
			var oldValue = '';
			timeout(function(){
				var value = "";
				for(var i in scope.model.cols)
				{
					if(i == scope.model.cols.length - 1)
					{
						value += scope.model.cols[i].col;
					}
					else
					{
						value += scope.model.cols[i].col + "-";
					}
				}
				oldValue = value;
				render(value);
			});
			function render(value){
				var inputDom = $("<input />");
				inputDom.on("blur", function(event){
					scope.$apply(applied);
					function applied()
					{
						var arr = ($(event.target).val()).split("-");
						var sum = arr.reduce(function(prev, next){
							return parseInt(prev) + parseInt(next);
						});
						if(sum != 12)
						{
							$(event.target).val(oldValue);
							alert("输入列数总和要为12！")
						}
						else
						{
							oldValue = $(event.target).val();
							scope.model.cols = arr.map(function(elem){
								return {
									col : elem
								}
							});
						}
					}
				});
				inputDom.val(value);
				$(element).children().remove();
				$(element).append(inputDom);
			}
		};
		return directive;
	}
	directives.initDirective('bootinput', bootinput_directive);
	bootinput_directive.$inject = ['$timeout', 'variables'];
	function bootinput_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "C";
		directive.scope = {
			model : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				render();
			});
			function render(){
				var wrapDiv = $("<div class='row bootShow'></div>");
				for(var i in scope.model.cols)
				{
					(function(index, col){
						var colDiv = $("<div class='cwrap col-md-" + col.col + "'><div style='margin : 0 4px 0 0;background-color : white; border : 1px solid #bfbfbf;'><div class='inner'></div></div></div>");
						var numberInput = $("<input class='colNum' />");
						numberInput.val(col.col);
						numberInput.css("margin", "0px 5px")
						colDiv.append(numberInput);
						for(var i = 0; i < col.col; i++)
						{
							var unitDiv = $("<div class='bwrap' style='width : " + (100 / col.col) + "%;'><div class='block'></div></div>");
							colDiv.find(".inner").append(unitDiv);
						}
						colDiv.find(".inner").append($("<div style='height : 1px; clear : both; width : 100%;'></div>"));
						wrapDiv.append(colDiv);
						numberInput.on("change", function(event){
							scope.$apply(function(){
								var value = parseInt( $(event.target).val() );
								if(value < 2)
								{
									value = 2;
								}
								else if(value > (12 - scope.model.cols.length + 1))
								{
									value = 12 - scope.model.cols.length + 1;
								}
								var sum = 0;
								var parts = 0
								for(var i in scope.model.cols)
								{
									if(scope.model.cols[i] != col)
									{
										sum += scope.model.cols[i].col;
										parts += scope.model.cols[i].col;
									}
									else
									{
										sum += value;
									}
								}
								if(sum <= 12)
								{
									col.col = value;
								}
								else
								{
									col.col = 12 - parts;
								}
								render();
							});
						});
					})(i, scope.model.cols[i])
				}
				$(element).children().remove();
				$(element).append(wrapDiv);
			}
		};
		return directive;
	}
	directives.initDirective('drag', draggable_directive);
	draggable_directive.$inject = ['$timeout', 'variables']
	function draggable_directive(timeout, variables) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			dashboard : "="
		};
		directive.link = function(scope, element, attr){
			$(element).draggable({
				start : function(event, ui){
					dragging = true;
				},
				stop : function(event, ui){
					dragging = false;
				},
				handle : $(element).find(".handler"),
				cursor : 'move',
				appendTo: "body",
				revert : true,
				helper : function(ui){
					if(attr.drag == "layouts"){
						var id = $(ui.currentTarget).attr("id");
						var layout = JSON.parse(JSON.stringify(variables.layouts.filter(function(layout){
							return layout.id == id
						})[0]));
						var result = $("<div class='helper row'></div>")
						for(var i in layout.cols){
							var col = layout.cols[i];
							var divDom = $("<div class='inner col-md-" + col.col + "'></div>");
							result.append(divDom);
						}
					}
					else if(attr.drag == "designViews")
					{
						var result = $("<div class='helper row'></div>").css({
							height : "100px"
						})
					}
					else if(attr.drag == "totalItems")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "progress")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "downTab")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "attrTab")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "basicline")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "basicpie")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "header")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "listone")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "listtwo")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "map")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "sparkline")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					else if(attr.drag == "alertcommon")
					{
						var result = $("<div class='helper row'></div>").css({
							width : "200px",
							height : "100px"
						})
					}
					return result;

				},
				revertDuration : 0,
				zIndex : 9999999,
				connectToSortable : "#sortable"
			});
		};
		return directive;
	}
	directives.initDirective('dashboardDrop', droppable_directive);
	droppable_directive.$inject = ["$q", '$timeout', 'variables', 'kpiDataService', 'resourceUIService', 'viewFlexService', "growl", "basicline", "basicpie", "$location", "$window", "Info", "ticketTaskService", "solutionUIService"];
	function droppable_directive(q, timeout, variables, kpiDataService, resourceUIService, viewFlexService, growl, basicline, basicpie, location, window, Info, ticketTaskService, solutionUIService) {
		var templates = new $Array(variables.layouts);
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			dashboard : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				variables.dashboardView.then(function success(event){
					var beditor;
					var dashboardView = event.data;
					var viewId = event.viewId;
					variables.changeView = function(data){
						$(element).find("#dropBody").children().remove();
						beditor = new bootEditor({
							root : $(element).find("#dropBody"),
							data : data,
							dashboard : scope.dashboard
						});
					};
					beditor = new bootEditor({
						root : $(element).find("#dropBody"),
						data : dashboardView,
						dashboard : scope.dashboard
					});
					scope.dashboard.save = function(){
						var result, param;
						var solutionId = scope.dashboard.solutionId;
						if(solutionId)
						{
							result = beditor.toJSON();
							solutionUIService.saveManageViewContent(solutionId, JSON.stringify(result), function(event){
								if(event.code == 0){
									window.open("index.html#/myView", "_self");
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
							result = beditor.toJSON();
							param = {
								viewTitle : 'dashboard',
								viewName : 'dashboard',
								viewType : "dashboard",
								content : JSON.stringify(result)
							};
							viewFlexService.saveManageDashboard(param, function(event){
								if(event.code == 0){
									window.open("index.html", "_self");
									growl.success("视图首页修改成功", {});
								}
								else
								{
									growl.error("视图首页修改失败", {});
								}
							});
						}
					};
					scope.dashboard.delete = function(){
						viewFlexService.deleteViews([viewId], function(event){
							viewId = undefined;
							window.open("index.html", "_self");
						});
					};
				}, function error(err){
					//growl.addErrorMessage(err);
					console.log(err);
				});
			}, 100);
		};
		function bootEditor(object){
			var cur = this;
			var structure;
			var dashboard = object.dashboard;
			dashboard.on("switchMode", function(){
				timeout(function(){
					cur.resize()
				},100);
			});
			$(window).on("resize", function(){
				timeout(function(){
					cur.resize()
				},100);
			});
			cur.toJSON = function(){
				return structure.toJSON();
			};
			cur.resize = function(){
				structure.each(function(element){
					if((element.type == "designView")||(element.type == "basicline")||(element.type == "basicpie")){
						for(var i in element.echarts){
							element.echarts[i].echart("option", "resize");
						}
					}
				});
			};
			var dragconfig = {
				cursorAt : {
					top : 0,
					left : 450
				},
				start : function(event, ui){
					$(event.target).css("display", "none")
					dragging = true;
				},
				stop : function(event, ui){
					$(event.target).css("display", "block")
					dragging = false;
				},
				appendTo: "body",
				revertDuration : 0,
				cursor : 'move',
				revert: true,
				zIndex : 9999,
				opacity :.5,
				helper : function(ui){
					var clone = $(ui.currentTarget).clone();
					var find = clone.find('.box-body');
					var wrap = $("<div class='help_wrap row'></div>");
					if(find.size() > 0){
						find.children(".innerContent").children().each(function(index, element){
							var cl = $(element).clone();
							cl.children().remove();
							if(cl.filter("[class*=col-]").size() == 0){
								cl.addClass("column col-md-12");
							}
							wrap.append(cl);
						});
					}
					else
					{
						clone.children(".innerContent").children().each(function(index, element){
							var cl = $(element).clone();
							cl.children().remove();
							if(cl.filter("[class*=col-]").size() == 0){
								cl.addClass("column col-md-12");
							}
							wrap.append(cl);
						});
					}
					wrap.css({
						'pointer-events' : 'none'
					});
					return wrap;
				}
			};
			var mouseEvent = {
				mouseover : function(event, ui){
					if(dragging)
					{
						var target = $(event.target);
						target.addClass("drophover");
					}
				},
				mouseout : function(event, ui){
					if(dragging)
					{
						var target = $(event.target);
						target.removeClass("drophover");
					}
				}
			};
			var dropconfig = {
				tolerance : 'pointer',
				drop : function(event, ui){
					var rowWrap, rowInput;
					var variable = {};
					var draggable = $(ui.draggable);
					var dragId = draggable.attr("id");
					var target = $(event.target);
					if(draggable.filter("[drag]").size() > 0)
					{
						var type = draggable.attr("drag");
						rowWrap = $("<div id='" + $randomString(32) + "' class='row rowWrap'></div>");
						variable = JSON.parse(JSON.stringify(variables[type].filter(function(variable){
							return variable.id == dragId
						})[0]));
						variable.target = rowWrap;
					}
					else
					{
						structure.eachRow(function(element){
							var domId = $(element.target).attr("id");
							if(dragId == domId){
								structure.remove(element);
								variable = element;
							}
						});
						rowWrap = variable.target;
					}
					if(target.hasClass("insert_before"))
					{
						var add;
						var colId, rowId;
						if(target.parent().hasClass("box-body"))
						{
							colId = target.parent().parent().parent().parent().attr("id");
							rowId = target.parent().parent().parent().attr("id");
						}
						else
						{
							colId = target.parent().parent().attr("id");
							rowId = target.parent().attr("id");
						}
						structure.eachCol(function(element){
							var domId = $(element.target).attr("id")
							if(colId == domId){
								add = element;
							}
						});
						if(add.rows)
						{
							var temp = [];
							for(var i in add.rows){
								if(rowId == add.rows[i].target.attr("id")){
									temp.push(variable);
								}
								temp.push(add.rows[i]);
							}
							add.rows = temp;
						}
						if(colId == "dropBody"){
							var box = $("<div class='box box-info'>");
							var boxHeader = $('<div class="box-header with-border">\
                                <h3 class="box-title" id="boxTitle"></h3>\
                            </div>');
							rowInput = $("<div class='box-body'></div>");
							rowWrap.children().remove();
							rowWrap.append(box);
							box.append(boxHeader);
							box.append(rowInput);
						}
						else
						{
							var find = rowWrap.find('.box-body');
							if(find.size() > 0)
							{
								//var children = find.children();
								rowWrap.find('.box').remove();
								//rowWrap.append(children);
							}
							rowWrap.children().remove();
							rowInput = rowWrap;
						}
						if(target.parent().hasClass("box-body"))
						{
							target.parent().parent().parent().before(rowWrap);
						}
						else
						{
							target.parent().before(rowWrap);
						}
					}
					else if(target.hasClass("insert_after"))
					{
						var add, colId;
						if(target.parent().hasClass("box-body"))
						{
							colId = target.parent().parent().parent().attr("id");
						}
						else
						{
							colId = target.parent().attr("id");
						}
						structure.eachCol(function(element){
							var domId = $(element.target).attr("id")
							if(colId == domId){
								add = element;
							}
						});
						if(add.rows)
						{
							add.rows.push(variable);
						}
						else
						{
							add.rows = [variable];
						}
						if(colId == "dropBody")
						{
							var box = $("<div class='box'>");
							var boxHeader = $('<div class="box-header with-border">\
                                <h3 class="box-title" id="boxTitle"></h3>\
                            </div>');
							rowInput = $("<div class='box-body'></div>");
							rowWrap.append(box);
							box.append(boxHeader);
							box.append(rowInput);

							var find = rowWrap.find('.box-body');
							if(find.size() > 0)
							{
								var children = find.children();
								rowWrap.find('.box').remove();
								rowWrap.append(children);
								rowWrap.children().remove();
								rowWrap.append(box);
							}
							else
							{
								rowInput.append(rowWrap.children());
							}
						}
						else
						{
							var find = rowWrap.find('.box-body');
							if(find.size() > 0)
							{
								//var children = find.children();
								rowWrap.find('.box').remove();
								//rowWrap.append(children);
							}
							rowWrap.children().remove();
							rowInput = rowWrap;
						}
						if(target.parent().hasClass("box-body"))
						{
							target.parent().parent().before(rowWrap);
						}
						else
						{
							target.before(rowWrap);
						}
					}
					target.removeClass("drophover");
					traverse(rowInput, variable);
					timeout(function(){
						cur.resize()
					},100);
					if($("#dropBody").children(".rowWrap").size() == 0){
						$("#dropBody").children(".insert_after").css("height", "500px");
					}
				}
			};
			init(object);
			function init(object){
				structure = new $tree(JSON.parse(JSON.stringify(object.data)));
				var insertAfter = $("<div class='insert_after'></div>");
				structure.getData().target = object.root;
				for(var i in structure.getData().rows){
					var row = structure.getData().rows[i];
					var rowWrap = $("<div id='" + $randomString(32) + "' class='row rowWrap'></div>");
					var box = $("<div class='box'></div>");
					var boxHeader = $('<div class="box-header with-border">\
                        <h3 id="boxTitle" class="box-title"></h3>\
                    </div>');
					var boxBody = $("<div class='box-body'></div>");
					row.target = rowWrap;
					rowWrap.append(box);
					box.append(boxHeader);
					box.append(boxBody);
					structure.getData().target.append(rowWrap);
					traverse(boxBody, row);
				}
				structure.getData().target.append(insertAfter);
				insertAfter.droppable(dropconfig);
				insertAfter.on(mouseEvent);
			};
			function traverse(target, row){
				var inputTitle = $("<div class='titleWrap'><lable>表标题</lable><input id='btitle'/></div>");
				var toolbar = $("<div class='toolbar'></div>");
				var moveBtn = $("<div class='moveBtn'><span class='proudsmart ps-move'></span></div>");
				var deleteBtn = $("<div class='deleteBtn'><span class='proudsmart ps-delete'></span></div>");
				var insertBefore = $("<div class='insert_before'></div>");
				var innerContent = $("<div class='row innerContent'></div>");
				var innerWrap = $("<div class='innerWrap'></div>");
				if(target.hasClass("box-body")){
					var checkbox = $("<div class='showOutter'><input type='checkbox'/><label>显示外框</label></div>");
					toolbar.append(inputTitle).append(deleteBtn).append(moveBtn).append(checkbox);
					if(row.show != false)
					{
						row.show = true;
						checkbox.find("input").prop("checked", "checked");
						target.parent().parent().removeClass("hideWrap")
					}
					else
					{
						row.show = false;
						checkbox.find("input").removeAttr("checked");
						target.parent().parent().addClass("hideWrap")
					}
					checkbox.find("input").on("click", function(event){
						if($(this).prop("checked")){
							row.show = true;
							target.parent().parent().removeClass("hideWrap")
						}
						else
						{
							row.show = false;
							target.parent().parent().addClass("hideWrap")
						}
					});
					if(row.title)
					{
						inputTitle.find("#btitle").val(row.title);
						var boxTitle = target.parent().find('#boxTitle');
						boxTitle.text(row.title);
					}
					inputTitle.find("#btitle").on("change", function(event){
						var object = $(event.target);
						var boxTitle = target.parent().find('#boxTitle');
						boxTitle.text(object.val());
						row.title = object.val();
					});
				}else{
					delete row.show;
					toolbar.append(deleteBtn).append(moveBtn);
				};
				target.append(insertBefore).append(toolbar).append(innerContent);
				if(row.type=='layout'){
					var cols = row.cols;
					for(var i in cols){
						var column = $("<div id='col_" + $randomString(32) + "' class='column col-md-" + cols[i].col + "'></div>");
						var insertAfter = $("<div class='insert_after'></div>");
						var col = cols[i];
						col.target = column;
						for(var j in col.rows){
							var rowWrap = $("<div id='" + $randomString(32) + "' class='row rowWrap'></div>");
							column.append(rowWrap);
							var inrow = col.rows[j];
							inrow.target = rowWrap;
							traverse(rowWrap, inrow);
						}
						column.append(insertAfter);
						innerContent.append(column);
						insertAfter.droppable(dropconfig);
						insertAfter.on(mouseEvent);
					}
				}
				else if(row.type=='designView')
				{
					innerContent.append(innerWrap);
					var dv = designView(innerWrap, row);
				}
				else if(row.type=='totalItems')
				{
					innerContent.append(innerWrap);
					var dv = totalItems(innerWrap, row);
				}
				else if(row.type=='progress')
				{
					innerContent.append(innerWrap);
					var dv = progress(innerWrap, row);
				}
				else if(row.type=='downTab')
				{
					innerContent.append(innerWrap);
					var dv = downTab(innerWrap, row);
				}
				else if(row.type=='attrTab')
				{
					innerContent.append(innerWrap);
					var dv = attrTab(innerWrap, row);
				}
				else if(row.type=='header')
				{
					innerContent.append(innerWrap);
					var dv = header(innerWrap, row);
				}
				else if(row.type=='basicline')
				{
					innerContent.append(innerWrap);
					row.content = basicline.getOption();
					row.content.elements[0].nodes = row.attributes.nodes;
					row.content.elements[0].kpis = row.attributes.kpis;
					var dv = designView(innerWrap, row);
				}
				else if(row.type=='basicpie')
				{
					innerContent.append(innerWrap);
					row.content = basicpie.getOption();
					row.content.elements[0].nodes = row.attributes.nodes;
					row.content.elements[0].kpis = row.attributes.kpis;
					var dv = designView(innerWrap, row);
				}
				else if(row.type=='listone')
				{
					innerContent.append(innerWrap);
					var dv = listone(innerWrap, row);
				}
				else if(row.type=='listtwo')
				{
					innerContent.append(innerWrap);
					var dv = listtwo(innerWrap, row);
				}
				else if(row.type=='map')
				{
					innerContent.append(innerWrap);
					var dv = map(innerWrap, row);
				}
				else if(row.type=='sparkline')
				{
					innerContent.append(innerWrap);
					var dv = sparkline(innerWrap, row);
				}
				else if(row.type=='alertcommon')
				{
					innerContent.append(innerWrap);
					row.content = basicpie.getOption();
					var dv = designView(innerWrap, row);
				}
				if(target.hasClass("box-body"))
				{
					target.parent().parent().draggable(dragconfig);
					target.parent().parent().draggable("option", "handle", moveBtn);
					target.parent().parent().draggable("option", "handle", moveBtn);
				}
				else
				{
					target.draggable(dragconfig);
					target.draggable("option", "handle", moveBtn);
					target.draggable("option", "handle", moveBtn);
				}
				insertBefore.droppable(dropconfig);
				insertBefore.on(mouseEvent);
				if(target.hasClass("box-body"))
				{
					(function(target){
						target.on("mouseover", function(event){
							event.stopPropagation();
							$(document).find('.boot-mouseOver').removeClass('boot-mouseOver');
							$(event.currentTarget).addClass('boot-mouseOver');
						});
					})(target.parent().parent());
				}
				else
				{
					(function(target){
						target.on("mouseover", function(event){
							event.stopPropagation();
							$(document).find('.boot-mouseOver').removeClass('boot-mouseOver');
							$(event.currentTarget).addClass('boot-mouseOver');
						});
					})(target);
				}
				deleteBtn.on("click", function(event){
					var removed;
					event.stopPropagation();
					if($(event.target).parent().parent().parent().hasClass('box-body')){
						var id = $(event.currentTarget).parent().parent().parent().parent().attr("id");
						console.log("id1", id);
						structure.each(function(element){
							if(element.target.attr("id")==id){
								removed = element;
							}
						});
						structure.remove(removed);
						target.parent().parent().remove();
					}
					else
					{
						//console.log($(event.target).parent().parent());
						var id = $(event.currentTarget).parent().parent().attr("id");
						console.log("id1", id);
						structure.each(function(element){
							if(element.target.attr("id")==id){
								removed = element;
							}
						});
						structure.remove(removed);
						target.remove();
					}
					if($("#dropBody").children(".rowWrap").size() == 0){
						$("#dropBody").children(".insert_after").css("height", "500px");
					}
				});
			};
			function $tree(param){
				var cur = this;
				var data = param;
				cur.getData = function(){
					return data;
				};
				cur.toJSON = function(){
					var clone = {
						rows : []
					};
					for(var i in data.rows){
						var row = data.rows[i];
						var emptyRow = {};
						emptyRow.type = row.type;
						emptyRow.show = row.show;
						emptyRow.title = row.title;
						if(row.type == "designView"){
							emptyRow.content = row.content;
						}
						else if(row.type == "totalItems"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type == "progress"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type == "downTab"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type == "attrTab"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type=='basicline')
						{
							emptyRow.attributes = row.attributes;
							emptyRow.content = row.content;
						}
						else if(row.type=='basicpie')
						{
							emptyRow.attributes = row.attributes;
							emptyRow.content = row.content;
						}
						else if(row.type == "header"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type == "listone"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type == "listtwo"){
							emptyRow.attributes = row.attributes;
						}
						else if(row.type=='map')
						{
							emptyRow.attributes = row.attributes;
						}
						else if(row.type=='sparkline')
						{
							emptyRow.attributes = row.attributes;
						}
						else if(row.type=='alertcommon')
						{
							emptyRow.attributes = row.attributes;
						}
						clone.rows.push(emptyRow)
						traverse(row,emptyRow);
					}
					function traverse(obj, emptyRow){
						if(obj.cols != undefined){
							for(var i in obj.cols){
								(function(col){
									var emptyCol = {
										col : col.col
									};
									if(emptyRow.cols){
										emptyRow.cols.push(emptyCol);
									}
									else
									{
										emptyRow.cols = [emptyCol];
									}
									for(var j in col.rows){
										(function(row){
											var eRow = {};
											eRow.type = row.type;
											emptyCol.type = row.type;
											if(row.type == "designView"){
												eRow.content = row.content;
											}
											else if(row.type == "totalItems"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "progress"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "downTab"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "attrTab"){
												eRow.attributes = row.attributes;
											}
											else if(row.type=='basicline')
											{
												eRow.attributes = row.attributes;
												eRow.content = row.content;
											}
											else if(row.type=='basicpie')
											{
												eRow.attributes = row.attributes;
												eRow.content = row.content;
											}
											else if(row.type == "header"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "listone"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "listtwo"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "map"){
												eRow.attributes = row.attributes;
											}
											else if(row.type == "sparkline"){
												eRow.attributes = row.attributes;
											}
											else if(row.type=='alertcommon')
											{
												eRow.attributes = row.attributes;
											}
											if(emptyCol.rows)
											{
												emptyCol.rows.push(eRow);
											}
											else
											{
												emptyCol.rows = [eRow];
											}
											traverse(row, eRow);
										})(col.rows[j])
									}
								})(obj.cols[i])
							}
						}
					}
					return clone;
				};
				cur.each = function(callback){
					for(var i in data.rows){
						var row = data.rows[i];
						traverse(row)
						callback(row);
					}
					function traverse(row){
						for(var i in row.cols){
							var col = row.cols[i];
							callback(col);
							for(var j in col.rows){
								traverse(col.rows[j]);
								callback(col.rows[j]);
							}
						}
					}
				}
				cur.remove = function(removed){
					var temp = [];
					for(var i in data.rows){
						var row = data.rows[i];
						if(removed != row){
							temp.push(row);
							traverse(row);
						}
						else
						{
						}
					}
					data.rows = temp;
					if(temp.length > 0)
					{
						data.rows = temp;
					}
					else
					{
						delete data.rows;
					}
					function traverse(row){
						for(var i in row.cols){
							var col = row.cols[i];
							var temp = [];
							for(var j in col.rows){
								if($(removed.target).attr("id") != $(col.rows[j].target).attr("id")){
									temp.push(col.rows[j]);
									traverse(col.rows[j]);
								}
								else
								{
								}
							}
							if(temp.length > 0)
							{
								col.rows = temp
							}
							else
							{
								delete col.rows;
							}
						}
					}
				};
				cur.eachRow = function(callback){
					for(var i in data.rows){
						(function(row){
							if(row){
								traverse(row);
								callback(row);
							}
						})(data.rows[i]);
					}
					function traverse(row){
						for(var i in row.cols){
							(function(col){
								for(var j in col.rows){
									(function(row){
										if(row){
											traverse(row);
											callback(row);
										}
									})(col.rows[j])
								}
							})(row.cols[i]);
						}
					}
				};
				cur.eachCol = function(callback){
					callback(data);
					for(var i in data.rows){
						var row = data.rows[i];
						traverse(row);
					}
					function traverse(row){
						for(var i in row.cols){
							var col = row.cols[i];
							callback(col);
							for(var j in col.rows){
								traverse(col.rows[j]);

							}
						}
					}
				}
			}
			function designView(target, mydata){
				var elements, layouts, dom;
				mydata.echarts = [];
				dom = $("<div class='designView'></div>");
				elements = mydata.content.elements;
				layouts = [];
				target.append(dom);
				(function(renderlayout){
					var deferreds = [];
					for(var i in elements){
						var kpiResDefer = []
						var deferred = q.defer();
						deferreds.push(deferred.promise);
						var layouts = [], layout;
						var category = elements[i].category;
						var dataType = elements[i].dataType;
						var option = elements[i].option;
						var formatStr = elements[i].formatStr;
						if(elements[i].layout){
							var col = elements[i].layout.col;
							var row = elements[i].layout.row;
						}
						else
						{
							var col = 0;
							var row = i;
							elements[i].layout = {
								width : 100,
								col : 0,
								row : i
							}
						}
						if(!layouts[row]){
							layouts[row] = [];
						}
						layout = layouts[row][col] = {
							kpis : elements[i].kpis,
							nodes : elements[i].nodes,
							layout : elements[i].layout,
							option : elements[i].option
						};
						var kpisDes, nodesDes, minTimespan, nodes;
						variables.$rootDomain.get().then(function(data){
							var kpiQueryModel, param;
							nodes = [data.id];
							if(mydata.attributes.type != 'alert')
							{
								kpiQueryModel = {
									category: category,
									isRealTimeData: true,
									timePeriod: ((category=="time") ? elements[i].timespan : 0),
									nodeIds: nodes /*elements[i].nodes*/,
									kpiCodes: elements[i].kpis,
									startTime: null,
									endTime: null,
									timeRange: "",
									statisticType: "psiot",
									condList: []
								};
								param = ["kpi",kpiQueryModel];
								var def1 = q.defer();
								var def2 = q.defer();
								kpiResDefer.push(def1.promise);
								variables.$kpis.getBymodelId(data.modelId).then(function success(data){
									kpisDes = data.reduce(function(prev, next){
										var find = elements[i].kpis.some(function(elem){
											return elem == next.id;
										});
										if(find)
										{
											prev[next.id] = next;
										}
										return prev;
									}, {});
									def1.resolve("success");
								}, function error(err){
									console.log(err);
								});
								nodesDes = {}
								nodesDes[data.id] = data;
								q.all(kpiResDefer).then(function(){
									kpiDataService.getValueList(param, function(event){
										var valueList = new $Array(event.data);
										var vlistGroup = (function(){
											var result = new $Array([]);
											for(var i in  kpisDes){
												for(var j in  nodesDes){
													result.push({
														nodeId : j,
														nodeDes : nodesDes[j],
														kpiId : i,
														kpiDes : kpisDes[i],
														valueList : []
													})
												}
											}
											return result;
										})(kpisDes, nodesDes);
										if(category=="time"){
											vlistGroup.each(function(vg){
												for(var i = 0; i < 7; i++)
												{
													var date = new Date(new Date().getTime() - (7 - i) * 24 * 3600 * 1000);
													var year = date.getYear();
													var month = date.getMonth();
													var dt = date.getDate();
													var find = valueList.values().find(function(element){
														return (function(year, month, date){
															var cur = this;
															return (cur.getYear() == year) && (cur.getMonth() == month) && (cur.getDate() == date) && (vg.kpiId == element.kpiCode);
														}).call(new Date(element.arisingTime.split("T")[0].replace(/-/g, "/")), year, month, dt);
													});

													vg.valueList.push({
														kpiCode : vg.kpiId,
														value : find ? find.value : undefined,
														timeStamp : date.getTime()
													});
												};
											})
										}
										else
										{
											vlistGroup.each(function(vg){
												var date = new Date();
												var find = valueList.values().find(function(element){
													return vg.kpiId == element.kpiCode;
												});
												if(find){
													vg.valueList.push({
														kpiCode : vg.kpiId,
														value : find.value,
														timeStamp : date.getTime()
													});
												}
												else
												{
													vg.valueList.push({
														kpiCode : vg.kpiId,
														value : 0,
														timeStamp : date.getTime()
													});
												}
											})
										}

										var optionFormat = dataType.category[category];
										var vlGroup = new $valueListGroup(vlistGroup, 1, formatStr);
										var op = new $option(option);
										var xAxis, legend;
										if(category=="time"){
											if(optionFormat.series){
												if(optionFormat.series.model == "linear")
												{
													op.clearSeries();
													legend = vlGroup.getLegend();
													xAxis = vlGroup.getxAxisByTime();
													vlGroup.eachValueListMerged(function(vg){
														var name = vg.nodeDes.label + "-" + vg.kpiDes.label;
														var data = vg.$valueList;
														op.pushSeries(name, data);
													});
												}
												else if(optionFormat.series.model == "dimensional")
												{
													if(optionFormat.series.value = "ci")
													{

													}
													else if(optionFormat.series.value = "kpi")
													{

													}
												}
											}
										}
										else if(category=="ci")
										{
											if(optionFormat.series){
												if(optionFormat.series.model == "linear")
												{
													var series = [];
													legend = vlGroup.getLegend();
													xAxis = [];
													var first = op.firstSeries();
													vlGroup.eachValueListMerged(function(vg){
														var name = vg.nodeDes.label + "-" + vg.kpiDes.label;
														var data = vg.valueList;
														series.push({
															name : name,
															value : data[0].value
														});
													});
													first.data = series;
												}
												else if(optionFormat.series.model == "dimensional")
												{
													if(optionFormat.series.value = "ci")
													{

													}
													else if(optionFormat.series.value = "kpi")
													{

													}
												}
											}
										}
										if(optionFormat.xAxis){
											op.setFirstxAxis(xAxis);
										}
										if(optionFormat.legend){
											op.setLegend(legend);
										}
										layout.option = op.getOption();
										console.log(layout.option);
										if(mydata.attributes.color){
											layout.option.series[0].itemStyle = {
												normal: {
													color : mydata.attributes.color
												}
											}
											layout.option.series[0].lineStyle = {
												normal: {
													color : mydata.attributes.color
												}
											}
											layout.option.series[0].areaStyle = {
												normal: {
													color : mydata.attributes.color
												}
											}
											layout.option.series[0].markPoint = {};
											layout.option.series[0].markLine = {};
										}
										layout.option.animation = true;
										deferred.resolve("success");

									});
								});
							}
							else
							{
								var kpiQueryModel = {
									category: 'ci',
									isRealTimeData: true,
									timePeriod: 0,
									kpiCodes: ["alert_code_count"]
								};
								param = ["alert", kpiQueryModel];
								kpiDataService.getKpiHierarchyValueList(param, function(event){
									if(event.code == '0')
									{
										var ul = $('<ul class="nav nav-pills nav-stacked"></ul>');
										if(event.data.recordList instanceof Array)
										{
											var op = new $option(option), data=[];
											op.clearSeries();
											for(var i in event.data.recordList)
											{
												data.push({
													name : event.data.recordList[i].category,
													value : event.data.recordList[i].alert_code_count
												});
												var li = $('<li>\
                                                    <a>' + event.data.recordList[i].category + ' <span class="pull-right text-red ng-binding">' + event.data.recordList[i].alert_code_count + '条</span></a>\
                                                </li>');
												ul.append(li);
											}
											dom.after(ul);
											op.pushSeries('常见告警类型', data);
											layout.option = op.getOption();
											layout.option.animation = true;
											deferred.resolve("success")
										}

									}
								})
							}
						})
					}
					q.all(deferreds).then(function(event){
						renderlayout(layouts);
					});
				})(renderlayout);
				function renderlayout(layouts){
					for(var i in layouts){
						var row = $("<div class='rowCls'></div>");
						dom.append(row);
						for(var j in layouts[i]){
							var col = $("<div class='colCls'></div>");
							var width = layouts[i][j].layout.width;
							row.append(col);
							col.css("width", width + "%");
							var height = target.width() * .6;
							//var height = target.width() * layouts[i][j].layout.widthheightPortion;
							col.css("height", 300 + "px");
							col.echart({
								option : layouts[i][j].option
							});
							layouts[i][j].target = col;
							mydata.echarts.push(col);
						}
					}
				}
				return dom;
			}
			function totalItems(target, mydata){
				if(mydata.attributes){
					var resource;
					var currentKpi;
					var kpiId = mydata.attributes.kpi;
					var nodeId = mydata.attributes.ci;
					var innerContent = $("<div class='small-box " + mydata.attributes.color + "'></div>");
					var inner = $("<div class='inner' style='cursor : pointer;'></div>");
					var number = $("<h3><span id='text'></span><span id='unit' style='font-size: 20px'></span></h3>");
					var title = $("<p id='title'></p>");
					var icon;
					if(mydata.attributes.icon.indexOf('fa') == -1)
					{
						icon = $("<div class='icon'><i class='proudsmart " + mydata.attributes.icon + "' style='font-size : 70px;'></i></div>");
					}
					else
					{
						icon = $("<div class='icon'><i class='" + mydata.attributes.icon + "' style='font-size : 70px;'></i></div>");
					}
					inner.append(number);
					inner.append(title);
					innerContent.append(inner);
					innerContent.append(icon);
					target.append(innerContent);
					console.log(nodeId);
					resourceUIService.getResourceById([nodeId], function(event){
						if(event.code == '0'){
							if(event.data == null)
							{
								variables.$rootDomain.get().then(function(data){
									resource = data;
									var modelId = resource.modelId;
									getDataByModelId(modelId);
								});
							}
							else
							{
								var modelId = event.data.modelId;
								getDataByModelId(modelId);
							}
						}
					});
					variables.getValueByRootKpi(kpiId).then(function(value){
						number.find("span#text").text(value);
					});
				}
				function getDataByModelId(modelId){
					variables.$kpis.getBymodelId(modelId).then(function success(data){
						currentKpi = data.find(function(elem){
							return elem.id == kpiId;
						});
						var unit = currentKpi.unit;
						title.text(currentKpi.label);
						innerContent.on("click", function(){
							if(currentKpi.label == '管控设备数')
							{
								window.location.href = "../app-oc/index.html#/resource";
							}
							else if(currentKpi.label == '数据采集点')
							{
								window.location.href = "../app-oc/index.html#/emcsView";
							}
							else if(currentKpi.label == '待处理工单数')
							{
								window.location.href = "../app-oc/index.html#/workorder";
							}
							else if(currentKpi.label == '待处理告警数')
							{
								window.location.href = "../app-oc/index.html#/configAlertByStatus";
							}
							else if(currentKpi.label == '待处理紧急告警数')
							{
								window.location.href = "../app-oc/index.html#/configAlert";
							}
							else if(currentKpi.label == '日开机总时长')
							{
								window.location.href = "../app-oc/index.html#/emcsView";
							}
							else if(currentKpi.label == '当日总产量')
							{
								window.location.href = "../app-oc/index.html#/emcsView";
							}
							else if(currentKpi.label == '生产任务')
							{
								window.location.href = "../app-oc/index.html#/emcsView";
							}
							else
							{
								window.location.href = "../app-oc/index.html#/emcsView";
							}
						});
						variables.$units.get().then(function success(units){
							var find = units.filter(function(elem){
								return elem.unitCode == unit
							});
							if(find[0]){
								if(find[0].unitCode == "Amount")
								{
									if(data[0].label=='数据采集点')
									{
										number.find("span#unit").text("台");
									}
									else
									{
										number.find("span#unit").text("个");
									}

								}
								else
								{
									number.find("span#unit").text(find[0].unitName);
								}
							}
						}, function error(err){
							growl.addErrorMessage(err);
						})
					});
				}
			}
			function header(target, mydata){
				if(mydata.attributes){
					var text = mydata.attributes.text;
					var header = $("<h4 class='visibleWhenView'></h4>");
					var inputDom = $("<div class='hideWhenView'><label>标题名称：</label><input class='form-control'/></div>");
					inputDom.css({
						"margin" : "30px",
					});
					header.css({
						"margin" : "5px"
					})
					target.append(header).append(inputDom);
					if(mydata.attributes.text){
						header.text(mydata.attributes.text);
						inputDom.find("input").val(mydata.attributes.text);
					}
					inputDom.find("input").on('change', function(event){
						var value = $(event.target).val();
						mydata.attributes.text = value;
						header.text(value);
					});
				}
			}
			function attrTab(target, mydata){
				if(mydata.attributes){
					var attrId = mydata.attributes.attrId;
					var nodeId = mydata.attributes.ci;
					var innerContent = $("<div class='small-box " + mydata.attributes.color + "'></div>");
					var inner = $("<div class='inner' style='cursor : pointer;'></div>");
					var number = $("<h3><span id='text'></span><span id='unit' style='font-size: 20px'></span></h3>");
					var title = $("<p id='title'></p>");
					var icon = $("<div class='icon'><i class='proudsmart " + mydata.attributes.icon + "'></i></div>");
					inner.append(number);
					inner.append(title);
					innerContent.append(inner);
					innerContent.append(icon);
					target.append(innerContent);
					variables.$resources.getAttrByNodeId(nodeId).then(function success(data){
						var result = data.filter(function(element){
							return element.id == attrId;
						});
						if(result.length > 0){
							number.find("span#text").text(result[0].label);
							number.find("span#unit").text(result[0].value);
							title.text(result[0].name);
						}
					}, function error(err){

					});
				}
			}
			function sparkline(target, mydata){
				var currentKpi, resource, kpiDefs;
				if(mydata.attributes){
					if(mydata.kpiObjects)
					{
						mydata.attributes.kpis = [];
						for(var i in mydata.kpiObjects)
						{
							mydata.attributes.kpis.push(mydata.kpiObjects[i].id);
						}
					}
				}
				var outer = $('<div class="pad box-pane-right bg-green" style="min-height: 280px"></div>');
				target.append(outer);
				var kpiIds = mydata.attributes.kpis;

				variables.$rootDomain.get().then(function(data){
					resource = data;
					var modelId = resource.modelId;
					variables.$kpis.getBymodelId(modelId).then(function success(data){
						kpiDefs = data.reduce(function(prev, next){
							var find = kpiIds.some(function(elem){
								return elem == next.id;
							});
							if(find)
							{
								prev[next.id] = next;
							}
							return prev;
						}, {});
						variables.getValueListByRootKpis(kpiIds).then(function success(vlist){
							for(var i in kpiDefs){
								var find = vlist.filter(function(elem){
									return elem.kpiCode == kpiDefs[i].id;
								});
								var inner = $('<div class="description-block margin-bottom ng-scope" ng-repeat="item in totalItems4" on-finish-render-filters="">\
                                <div class="sparkbar pad">\
                                </div>\
                                <h5 class="description-header ng-binding">' + (find.length ? find[find.length - 1].value : 0) + '</h5>\
                                <span class="description-text ng-binding">' + kpiDefs[i].label + '</span>\
                            </div>');
								var myvalues = [];
								if(find){
									if(find.length > 7)
									{
										myvalues = find.slice(-7).map(function(el){
											return el.value;
										});
									}
									else
									{
										myvalues = find.slice(-find.length + 1).map(function(el){
											return el.value;
										});
									}
								}
								else
								{
									for(var i= 0; i<7; i++)
									{
										myvalues.push(0);
									}
								}
								outer.append(inner);
								inner.find('.sparkbar').sparkline(myvalues, {type: 'bar', barColor: 'white'} );
							}
						});
					});
				});
			}
			function map(target, mydata){
				var inner = $("<div style='width : 100%; height : 340px;'></div>");
				target.append(inner);
				var baseoption;
				var dashboardOption = {
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
				var init = function() {
					resourceUIService.statDeviceByStandardAddress(function(returnObj) {
						var citys = {
							"北京市": 0
						};
						if (returnObj.code == 0) {
							for (var city in returnObj.data) {
								if (city) {
									var arr = city.split(",");
									if (arr[0].indexOf("市") > -1) {
										if (citys[arr[0]])
											citys[arr[0]] = citys[arr[0]] + returnObj.data[city];
										else
											citys[arr[0]] = returnObj.data[city];
									} else if (arr.length > 1) {
										citys[arr[1]] = returnObj.data[city];
									}
								} else {
									citys["北京市"] = citys["北京市"] + returnObj.data[""]
								}
							}
							for (var city in citys) {
								var obj = {};
								obj.name = city;
								obj.value = baseoption.geoCoord[city];
								if (obj.value) {
									obj.value.push(citys[city]);
								}
								dashboardOption.series[0].data.push(obj);
								if (dashboardOption.series[0].data.length < 5) {
									dashboardOption.series[1].data.push(obj);
								}
							}
							inner.echart({
								option : dashboardOption
							});
						}
					});
				}
				var par = "../localdb/echarts-map.json";
				var info = Info.get(par, function(info) {
					baseoption = info;
					dashboardOption.bmap.mapStyle.styleJson = baseoption.styleJson_dark;
					init();
				});
			}
			function progress(target, mydata){
				if(mydata.attributes){
					var resource, currentKpi;
					var nodeId = mydata.attributes.ci;
					var kpiId = mydata.attributes.kpi;
					var innerContent = $("<div class='progress-group'></div>");
					var text = $("<span class='progress-text' id='value'></span>");
					var number = $("<span class='progress-number'></span>");
					var prg = $("<div class='progress sm'><div class='progress-bar' style='width:80%'></div></div>");
					innerContent.append(text);
					innerContent.append(number);
					innerContent.append(prg);
					target.append(innerContent);
					variables.$kpis.getByKpiIds([kpiId]).then(function success(data){
						text.text(data[0].label);
					});
					variables.$rootDomain.get().then(function(data){
						resource = data;
						var modelId = resource.modelId;
						variables.$kpis.getBymodelId(modelId).then(function success(data){
							currentKpi = data.find(function(elem){
								return elem.id == kpiId;
							});
							variables.getValueByRootKpi(kpiId).then(function(value){
								number.find("span#text").text(value);
								switch (true) {
									case value == 100:
										prg.find(".progress-bar").addClass("progress-bar-aqua");
										break;
									case value > 90:
										prg.find(".progress-bar").addClass("progress-bar-green");
										break;
									case value > 80:
										prg.find(".progress-bar").addClass("progress-bar-yellow");
										break;
									case value > 70:
										prg.find(".progress-bar").addClass("progress-bar-yellow");
										break;
									case value > 60:
										prg.find(".progress-bar").addClass("progress-bar-red");
										break;
									default:
										prg.find(".progress-bar").addClass("progress-bar-danger");
								}
								number.html("<b>" + value + "</b>%");
								prg.find(".progress-bar").css("width", value + "%");
							});
						});
					});
				}
			}
			function downTab(target, mydata){
				if(mydata.attributes){
					var resource;
					var nodeId = mydata.attributes.ci;
					var kpiId = mydata.attributes.kpi;
					var innerContent = $("<div class='description-block border-right'></div>");
					var text = $("<span class='description-percentage'><i class='fa'></i><span id='rate'></span></span>");
					var valueDom = $("<h5 class='description-header'></h5>");
					var disc = $("<span class='description-text'></span>");
					var currentKpi;
					innerContent.append(text);
					innerContent.append(valueDom);
					innerContent.append(disc);
					target.append(innerContent);
					variables.$rootDomain.get().then(function(data){
						resource = data;
						var modelId = resource.modelId;
						variables.$kpis.getBymodelId(modelId).then(function success(data){
							currentKpi = data.find(function(elem){
								return elem.id == kpiId;
							});
							disc.text(currentKpi.label);
						});
						variables.getValueListByRootKpis([kpiId]).then(function(data){
							var value, old, rate;
							if(data.length > 0)
							{
								value = data[0].value;
							}
							if(data.length > 1)
							{
								old = data[data.length - 1];
								if(old > 0)
								{
									rate = (value - old / old) * 100;
								}
								else
								{
									rate = 100
								}
							}
							else
							{
								rate = 0
							}
							text.find("#rate").text(Math.abs(rate) + '%');
							if (rate > 0) {
								text.find("i.fa").addClass("fa-caret-up");
								text.addClass("text-red");
							} else if (rate < 0) {
								text.find("i.fa").addClass("fa-caret-down");
								text.addClass("text-green");
							} else {
								text.find("i.fa").addClass("fa-caret-left");
								text.addClass("text-red");
							}
							var value = value == 0 ? parseInt(Math.random() * 100) : value;
							valueDom.text(value);
						});
					});
				}
			}
			function listone(target, mydata){
				if(mydata.attributes){
					var fun = mydata.attributes.fun;
					var innerContent = $("<table width='100%' class='table table-hover no-margin'>");
					var uldom = $('<ul class="products-list product-list-in-box"></ul>');
					innerContent.append(uldom);
					target.append(innerContent);
					eval(fun)(function(event){
						try{
							if(event.code == '0')
							{
								for(var i in event.data)
								{
									var lidom = $('<li class="item ng-scope" ng-repeat="device in deviceitems">\
                                                <div class="product-info">\
                                                    <a href="../app-oc/index.html#/#resource/' + event.data[i].modelId + '/' + event.data[i].id + '" class="product-title ng-binding"><span class="label label-primary pull-left ng-binding">' + format(event.data[i].createTime) + '</span>' + event.data[i].label + '</a>\
                                                </div>\
                                            </li>');
									uldom.append(lidom);
								}
								uldom.append($('<a href="../app-oc/index.html#/resource" class="uppercase">查看更多</a>'))
							}
							else
							{
								throw event.message;
							}
						}
						catch(err){
							console.log(err);
						}
						function format(time){
							var dateRegExp = /\d{4}\-\d{2}\-\d{2}/;
							var timeRegExp = /\d{2}\:\d{2}\:\d{2}/;
							var date = dateRegExp.exec(time);
							var t = timeRegExp.exec(time);
							if(date != null&& t!= null)
							{
								return date + " " + t;
							}
							else
							{
								return time;
							}
						}
					});
				}
			}
			function listtwo(target, mydata){
				if(mydata.attributes){
					var fun = mydata.attributes.fun;
					var innerContent = $("<table width='100%' class='table table-hover no-margin'>");
					var header = $("<thead><tr><th>工单号</th><th>内容</th><th>紧急度</th></tr></thead>");
					var tbody = $("<tbody></tbody>");
					innerContent.append(header).append(tbody);
					target.append(innerContent);
					var status = 100;
					eval(fun)(status, function(event){
						try{
							if(event.code == '0')
							{
								for(var i = 0; i < (event.data.length > 10 ? 10 : event.data.length) ; i++)
								{
									var content;
									(function(index, item){
										if(item.priorityCode == 0)
										{
											content = $('<tr ng-repeat="item in orderList" class="ng-scope">\
                                            <td><a href="../app-oc/index.html#/orderdetail/' + event.data[i].ticketNo + '/order" class="ng-binding">' + event.data[i].ticketNo + '</a></td>\
                                            <td class="ng-binding">' + event.data[i].message + '</td>\
                                            <!-- <td>{{item.statuslab}}</td> -->\
                                        <td><span class="label alerts-minor">低</span></td>\
                                    </tr>');
										}
										else if(item.priorityCode == 100)
										{
											content = $('<tr ng-repeat="item in orderList" class="ng-scope">\
                                            <td><a href="../app-oc/index.html#/orderdetail/' + event.data[i].ticketNo + '/order" class="ng-binding">' + event.data[i].ticketNo + '</a></td>\
                                            <td class="ng-binding">' + event.data[i].message + '</td>\
                                            <!-- <td>{{item.statuslab}}</td> -->\
                                        <td><span class="label alerts-major">中</span></td>\
                                    </tr>');
										}
										else if(item.priorityCode == 200)
										{
											content = $('<tr ng-repeat="item in orderList" class="ng-scope">\
                                            <td><a href="../app-oc/index.html#/orderdetail/' + event.data[i].ticketNo + '/order" class="ng-binding">' + event.data[i].ticketNo + '</a></td>\
                                            <td class="ng-binding">' + event.data[i].message + '</td>\
                                            <!-- <td>{{item.statuslab}}</td> -->\
                                        <td><span class="label alerts-critical">高</span></td>\
                                    </tr>');
										}
									})(i, event.data[i]);
									tbody.append(content);
								}
							}
							else
							{
								throw event.message;
							}
						}
						catch(err){
							console.log(err);
						}
						tbody.append($('<tr><td colspan="3"><a href="../app-oc/index.html#/workorder" class="btn btn-sm btn-default btn-flat">查看更多</a></td></tr>'))
					});
				}
			}
			$.fn.extend({
				echart : function(){
					var cur = this;
					var target;
					if(arguments.length == 1){
						target = echarts.init(this[0], 'macarons');
						this.data("target", target);
						target.setOption(arguments[0].option);
					}
					else if(arguments[0] == "option")
					{
						if(arguments[2])
						{
							eval(arguments[1])(arguments[2])
						}
						else
						{
							eval(arguments[1] + "()")
						}
					}
					function resize(){
						target = cur.data("target");
						if (target)
							target.resize();
					}
					function setOption(option){
						target = cur.data("target");
						if (target)
							target.setOption(option, true);
					}
				}
			})
		}
		return directive;
	}
});