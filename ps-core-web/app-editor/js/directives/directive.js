define(
	["app", "commonlib", "jquery", "jquery-ui", "colorPicker"], function(app, lib){
		app.directive("contentTr", ["$compile" , function(compile){
			var content = {};
			content.scope = {
				ngModel : "=",
				target : "="
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				var template = (function(type){
					switch(type){
						case "INPUT":
							return "<table><tr ng-model='ngModel' data-target='target' class='standard-input'></tr><table>";
							break;
						case "SLIDER":
							return "<table><tr ng-model='ngModel' data-target='target' class='standard-slider'></tr><table>";
							break;
						case "LINE":
							return "<table><tr><hr></tr><table>";
							break;
						case "SELECT":
							return "<table><tr ng-model='ngModel' data-target='target' class='standard-select'></tr><table>";
							break;
						case "TITLE":
							return "<table><tr><td>{{ngModel.name}}<td></tr><table>";
							break;
						case "COLOR":
							return "<table><tr ng-model='ngModel' data-target='target' class='standard-color'></tr><table>";
							break;
						default :
							return "<table><tr>BAD MODULE</tr><table>";
							break
					}
				})(scope.ngModel.type)
				element.html(template);
				compile(element.contents())(scope);
			}
			return content;
		}]);
		app.directive("clickableInput", ["$timeout", function(timeout){
			var directive = {};
			directive.scope = {
				ngModel : "=",
				ngDisabled : "="
			};
			directive.restrict = "C";
			directive.link = link;
			function link(scope, element){
				var Jelem = $(element);
				var parentDom = Jelem.parent();
				timeout(domReady);
				function domReady(){
					parentDom.on("click", elementClick);
				}
				function elementClick(event){
					event.stopPropagation();
					scope.$apply(applied);
					Jelem.focus();
					parentDom.off("click");
					parentDom.on("keypress.enter", keypressEvent);
					Jelem.blur(elementLostFocus);
					function applied(){
						scope.ngDisabled = false;
					}
				}
				function elementLostFocus(event){
					scope.$apply(applied);
					parentDom.on("click", elementClick);
					parentDom.off("keypress.enter");
					function applied(){
						scope.ngDisabled = true;
					}
				}
				function keypressEvent(event){
					var keycode = event.charCode;
					if(keycode == 13){
						Jelem.blur();
					};
				}
				scope.$watch("ngModel", ngModelWatcher);
				function ngModelWatcher(newVal, oldVal, scope){

				}
			}
			return directive;
		}])
		app.directive("chartIcon", ["$timeout", function(timeout){
			var directive = {};
			directive.scope = {
				ngModel : "="
			};
			directive.restrict = "C";
			directive.link = link;
			function link(scope, element){
				scope.$watch("ngModel", ngModelWatcher);
				function ngModelWatcher(newVal, oldVal, scope){
					switch(newVal)
					{
						case "line":
							element.removeClass().addClass("chartIcon line");
							break;
						case "bar":
							element.removeClass().addClass("chartIcon bar");
							break;
						case  "pie":
							element.removeClass().addClass("chartIcon pie");
							break;
						case "gauge":
							element.removeClass().addClass("chartIcon gauge");
							break;
					}
				}
			}
			return directive;
		}]);
		app.directive("dropdowntree", ["$timeout", function(timeout){
			var directive = {};
			directive.scope = {
				ngModel : "=",
				options : "=",
				change : "&"
			};
			directive.restrict = "C";
			directive.link = link;
			function link(scope, element, attr){
				scope.$watch("ngModel", ngModelWatcher);
				scope.$watch("options", optionsWatcher);
				var select = $("<div></div>").addClass("select");
				var wraps = new lib.ArrayHandler([]);
				select.on("click", function(){
					scope.$apply(function(){
						var elem = $(element).find('[id*=container]');
						if(elem.hasClass("noview")){
							elem.removeClass("noview");
							select.addClass("extend");
							timeout(function(){
								$('body').on("click.body", docClick);
							});
							function docClick(){
								elem.addClass("noview");
								$('body').off("click.body");
								select.removeClass("extend");
							}
						}
					});
				});
				element.append(select);
				function ngModelWatcher(n, o, s){
					if(n){
						//console.log(n);
						n.setCurrentSelect = function(obj)
						{
							select.text(obj.label);
							console.log(obj);
						}
					}
				}
				function optionsWatcher(n, o, s){
					if(n){
						console.log(n);
						var options = n;
						var container = $("<div></div>").attr("id", "container").addClass("noview");
						var childrenDom = $("<div></div>").addClass("children");
						var children = options.children;
						if(children.getData().length > 0)
						{
							select.text(children.first().label);
							scope.change({value : children.first()});
						}
						container.append(childrenDom);
						element.find('[id*=container]').remove();
						element.append(container);
						/*
						containedmodelId = [];
						(function(children){
							if (children) {
								getchild(children);
							}
							function getchild(children) {
								children.each(function (elem) {
									containedmodelId.push(elem.id);
									var children = elem.children;
									if (children) {
										getchild({value : children});
									}
								});
							}
							scope.ngModel = containedmodelId;
						})(children)
						*/
						traverse(children, childrenDom, 1);
						function traverse(children, container, level){
							children.each(function(child){
								var wrap = $("<div></div>").addClass("wrap");
								var handler = $("<div></div>").addClass("glyphicon");
								var label = $("<div></div>").addClass("labeltxt");
								var childrenDom = $("<div></div>").addClass("children");
								var children = child.children;
								wrap.attr("id", child.id);
								handler.data("children", children);
								label.text(child.label);
								for(var i=0; i <= level; i++){
									(function(clone, inx){
										if(inx == level - 1){
											clone.addClass("last");
										}
										clone.css("left", 10 + inx * 20 + "px");
										wrap.append(clone);
									})($("<div></div>").addClass("vline"), i)
								}
								wrap.append(handler);
								wrap.append(label);
								wrap.css("padding-left", (level * 20) + "px");
								wraps.push(wrap);
								container.append(wrap);
								wrap.on("click", function(event){
									scope.$apply(function() {
										var containedmodelId = [child.id];
										select.text(child.label);
										wraps.each(function (elem) {
											elem.removeClass("active");
										});
										wrap.addClass("active");
										var children = child.children;
										containedmodelId = [child.id];
										if (children) {
											getchild(children);
										}
										function getchild(children) {
											children.each(function (elem) {
												containedmodelId.push(elem.id);
												var children = elem.children;
												if (children) {
													getchild(children);
												}
											});
										}
										scope.change({value : child});
										scope.ngModel = containedmodelId;
									});
								});
								if(children){
									handler.addClass("glyphicon-minus");
									handler.on("click", function(event){
										event.stopPropagation();
										if(handler.hasClass("glyphicon-minus")){
											handler.removeClass("glyphicon-minus").addClass("glyphicon-plus");
											childrenDom.animate({
												"max-height" : 0,
												opacity : 0
											},300, function(){
												childrenDom.css({
													"display" : "none"
												});
											})
										}
										else
										{
											handler.removeClass("glyphicon-plus").addClass("glyphicon-minus");
											childrenDom.css({
												"display" : "block"
											});
											childrenDom.animate({
												"max-height" : 200,
												opacity : 1
											},300);
										}
									});
									container.append(childrenDom);
									traverse(children, childrenDom, level+1);
								}
								else
								{
									handler.addClass("glyphicon-hdd")
								}

							})
						}
					}
					else
					{
						element.find('[id*=container]').remove();
					}
				}
			}
			return directive;
		}]);
		app.directive("checkbox", ["$timeout", function(timeout){
			var directive = {};
			directive.scope = {
				ngModel : "="
			};
			directive.restrict = "C";
			directive.template = "<span class='glyphicon glyphicon-ok' ng-show='ngModel'></span>";
			directive.link = link;
			function link(scope, element){
				element.bind("click", elemClick);
				function elemClick(event){
					if( !scope.disabled ){
						scope.$apply(applied);
						function applied(){
							scope.ngModel = !scope.ngModel;
						}
					}
				}
				scope.$watch("ngModel", ngModelWatcher);
				function ngModelWatcher(newVal, oldVal, scope){
					if(newVal == true)
					{
						element.addClass("active");
					}
					else
					{
						element.removeClass("active");
					}
				}
			}
			return directive;
		}]);
		app.directive("standardInput", ["$timeout", function(timeout){
			var standardInput = {};
			standardInput.scope = {
				ngModel : "=",
				target : "="
			};
			var cacheValue;
			standardInput.restrict = "C";
			standardInput.template = "\
				<td><div class='checkbox' ng-model='avaliable' name='{{ngModel.name}}'></div></td>\
				<td class='title' ng-class='{true : \"\", false : \"notavaliable\"}[avaliable]'>{{ngModel.name}}</td>\
				<td class='content'>\
					<input \
						ng-disabled = '!avaliable'\
						ng-model='bindData'\
						ng-model-options='{ updateOn : \"blur\" }''\
						ng-class='{true:\"\",false: \"disabled\"}[avaliable]'\
						class='updateOnEnter mTitle'/>\
				</td>";
			standardInput.link = link;
			function link(scope, element, attrs){
				timeout(onDomReady);
				function onDomReady(){
					scope.$watch("avaliable", avaliableWatcher);
					scope.$watch("target", targetWatcher);
				}
				function targetWatcher(newVal, oldVal, scope){
					if(newVal){
						fillBlankObject();
						if(scope.ngModel.bind.indexOf("[*]") != -1)
						{
							var leftP = scope.ngModel.bind.split("[*]")[0];
							var rightP = scope.ngModel.bind.split("[*]")[1];
							scope.bindData = eval("scope.target." + leftP + "[" + 0 + "]" + rightP);
						}
						else
						{
							scope.bindData = eval("scope.target." + scope.ngModel.bind);
						}

						scope.avaliable = scope.bindData != undefined;
						scope.$watch("bindData", bindDataWatcher);
					}
				}
				function avaliableWatcher(newVal, oldVal, scope){
					if(newVal)
					{
						scope.bindData = scope.bindData ? scope.bindData : cacheValue;
					}
					else
					{
						cacheValue = scope.bindData;
						scope.bindData = undefined
					}
				}
				function fillBlankObject(){
					var params = scope.ngModel.bind.split(".");
					var variable = "scope.target";
					for(var i in params)
					{
						if(i < params.length - 1){
							variable += "." + params[i];
							if(eval(variable + "== undefined"))
							{
								eval(variable + "={}");
							}
						}
					}
				}
				function bindDataWatcher(newVal, oldVal, scope){
					var params = scope.ngModel.bind.split(".");
					var end = params[params.length - 1];
					var evalStr = [];
					if(scope.ngModel.bind.indexOf("[*]") != -1)
					{
						var leftP = scope.ngModel.bind.split("[*]")[0];
						var rightP = scope.ngModel.bind.split("[*]")[1];
						var arr = eval("scope.target." + scope.ngModel.bind.split("[*]")[0]);
						for(var i in arr){
							evalStr.push(leftP + "[" + i + "]" + rightP)
						}
					}
					else
					{
						evalStr.push(scope.ngModel.bind)
					}
					for(var i in evalStr)
					{
						var rs = evalStr[i].split("." + end)[0];
						eval("scope.target." + rs)[end] = newVal;
					}
				}
			}
			return standardInput;
		}]);
		app.directive("standardSelect", function(){
			var standardSelect = {};
			standardSelect.scope = {
				ngModel : "=",
				target : "="
			};
			standardSelect.restrict = "C";
			standardSelect.template = "\
				<td><div class='checkbox' ng-model='avaliable' name='{{ngModel.name}}'></div></td>\
				<td class='title' ng-class='{true : \"\", false : \"notavaliable\"}[avaliable]'>{{ngModel.name}}</td>\
				<td class='content'>\
					<div class='btn-group btn-group-justified' role='group' aria-label='...'>\
						<a ng-repeat='value in ngModel.values'\
							ng-disabled = '!avaliable'\
							ng-click = 'selectClick(value.value)'\
							class='btn btn-primary'\
							ng-class='{true : \"selected\", false : \"\"}[bindData==value.value]'>\
							{{value.name}}\
						</a>\
					</div>\
				</td>";
			standardSelect.link = link;
			function link(scope, element, attrs){
				var cacheValue;
				scope.$watch("target", targetWatcher);
				scope.$watch("target", targetValueWatcher, true);
				scope.$watch("avaliable", avaliableWatcher);
				scope.selectClick = selectClick;
				function selectClick(value){
					scope.bindData = value;
				}
				function targetWatcher(newVal, oldVal, scope){
					if(newVal){
						fillBlankObject();
						if(scope.ngModel.bind.indexOf("[*]") != -1)
						{
							var leftP = scope.ngModel.bind.split("[*]")[0];
							var rightP = scope.ngModel.bind.split("[*]")[1];
							scope.bindData = eval("scope.target." + leftP + "[" + 0 + "]" + rightP);
						}
						else
						{
							scope.bindData = eval("scope.target." + scope.ngModel.bind);
						}
						scope.avaliable = scope.bindData != undefined;
						scope.$watch("bindData", bindDataWatcher);
					}
				}
				function targetValueWatcher(newVal, oldVal, scope){
				}
				function avaliableWatcher(newVal, oldVal, scope){
					if(newVal){
						scope.bindData = scope.bindData ? scope.bindData : cacheValue;
					}else{
						cacheValue = scope.bindData ? scope.bindData : cacheValue;
						scope.bindData = undefined;
					}
				}
				function bindDataWatcher(newVal, oldVal, scope){
					var params = scope.ngModel.bind.split(".");
					var end = params[params.length - 1];
					var evalStr = new Array();
					if(scope.ngModel.bind.indexOf("[*]") != -1)
					{
						var leftP = scope.ngModel.bind.split("[*]")[0];
						var rightP = scope.ngModel.bind.split("[*]")[1];
						var arr = eval("scope.target." + scope.ngModel.bind.split("[*]")[0]);
						for(var i in arr){
							evalStr.push(leftP + "[" + i + "]" + rightP)
						}
					}
					else
					{
						evalStr.push(scope.ngModel.bind)
					}
					for(var i in evalStr)
					{
						var rs = evalStr[i].split("." + end)[0];
						eval("scope.target." + rs)[end] = newVal;
					}
				}
				function fillBlankObject(){
					var params = scope.ngModel.bind.split(".");
					var variable = "scope.target";
					for(var i in params)
					{
						if(i < params.length - 1){
							variable += "." + params[i];
							if(eval(variable + "== undefined"))
							{
								eval(variable + "={}");
							}
						}
					}
				}
			}
			return standardSelect;
		});
		app.directive("standardSlider", ["$timeout", function(timeout){
			var standardInput = {};
			standardInput.scope = {
				ngModel : "=",
				target : "="
			};
			standardInput.restrict = "C";
			standardInput.template = "\
					<td><div class='checkbox' ng-model='avaliable' name='{{ngModel.name}}'></div></td>\
					<td class='title' ng-class='{true : \"\", false : \"notavaliable\"}[avaliable]'>{{ngModel.name}}</td>\
					<td class='content' style='width:130px;'>\
						<div id='number-input'></div>\
					</td>\
					<td class='valcls' style='padding:0;'>\
						<input ng-model='bindData' ng-model-options='{ updateOn : \"blur\" }' ng-disabled='!avaliable' type='unmber'/>\
						<span>{{ngModel.unit}}</span>\
					</td>";
			standardInput.link = link;
			function link(scope, element, attrs){
				timeout(onDomReady);
				function onDomReady(){
					var cachValue;
					var elementTarget;
					scope.$watch("target", targetWatcher);
					scope.$watchGroup(["avaliable", "bindData"], groupWatcher);
					function targetWatcher(newVal, oldVal, scope){
						if(newVal){
							fillBlankObject();
							if(scope.ngModel.bind.indexOf("[*]") != -1)
							{
								var leftP = scope.ngModel.bind.split("[*]")[0];
								var rightP = scope.ngModel.bind.split("[*]")[1];
								scope.bindData = eval("scope.target." + leftP + "[" + 0 + "]" + rightP);
							}
							else
							{
								scope.bindData = eval("scope.target." + scope.ngModel.bind);
							}
							if(scope.bindData != undefined)
							{
								scope.avaliable = true;
							}
							else
							{
								scope.bindData = scope.ngModel.default ? scope.ngModel.default : 0;
								scope.avaliable = false;
							}
							try
							{
								if(scope.bindData == undefined){
									throw "bindData is undefined"
								};
							}
							catch(error)
							{
								alert(error);
							}
							elementTarget = $(element[0]).find("#number-input");
							elementTarget.slider({
								max : scope.ngModel.max,
								min : scope.ngModel.min,
								value : scope.bindData,
								range: "min",
								slide: numberUpdate,
							});
							function numberUpdate(event, ui){
								scope.$apply(function(){
									scope.bindData = ui.value;
								})
							}
						}
					}
					function groupWatcher(newVal, oldVal, scope){
						var aval = newVal[0];
						var data = newVal[1];
						console.log(aval, data);
						var params = scope.ngModel.bind.split(".");
						var end = params[params.length - 1];
						var evalStr = new Array();
						if(scope.ngModel.bind.indexOf("[*]") != -1)
						{
							var leftP = scope.ngModel.bind.split("[*]")[0];
							var rightP = scope.ngModel.bind.split("[*]")[1];
							var arr = eval("scope.target." + scope.ngModel.bind.split("[*]")[0]);
							for(var i in arr){
								evalStr.push(leftP + "[" + i + "]" + rightP)
							}
						}
						else
						{
							evalStr.push(scope.ngModel.bind)
						}
						for(var i in evalStr)
						{
							var rs = evalStr[i].split("." + end)[0];
							if(newVal[0])
							{
								eval("scope.target." + rs)[end] = parseInt(data);
								//scope.bindData = parseInt(data);
								elementTarget.slider("enable");
								elementTarget.slider("option", "value", parseInt(data) ? parseInt(data) : 0);
							}
							else
							{
								//scope.bindData = scope.ngModel.default;
								elementTarget.slider("disable");
								eval("scope.target." + rs)[end] = undefined;
								//elementTarget.slider("option", "value", scope.ngModel.default ? scope.ngModel.default : 0);
							}
						}

					}
					function fillBlankObject(){
						var params = scope.ngModel.bind.split(".");
						var variable = "scope.target";
						for(var i in params)
						{
							if(i < params.length - 1){
								variable += "." + params[i];
								if(eval(variable + "== undefined"))
								{
									eval(variable + "={}");
								}
							}
						}
					}
				}
			}
			return standardInput;
		}]);
		app.directive("standardColor", ["$timeout", function(timeout){
			var standardColor = {};
			standardColor.scope = {
				ngModel : "=",
				target : "="
			};
			standardColor.restrict = "C";
			standardColor.template = "\
				<td><div class='checkbox' ng-model='avaliable' name='{{ngModel.name}}'></div></td>\
				<td class='title' ng-class='{true : \"\", false : \"notavaliable\"}[avaliable]' ng-bind='ngModel.name'></td>\
				<td class='content'>\
					<input \
						id='colorPicker'\
						data-target='target'>\
				</td>";
			standardColor.link = link;
			function link(scope, element, attrs){
				var cachValue;
				var currentTarget
				timeout(onDomReady);
				function onDomReady(){
					currentTarget = $(element[0]).find("input#colorPicker");
					currentTarget.createNewColorPicker({
						onColorChange : onColorChange
					});
					scope.$watch("target", targetWatcher);
					scope.$watch("avaliable", avaliableWatcher);
					function onColorChange(event){
						scope.$apply(dataApplied);
						function dataApplied(){
							scope.bindData = event.color;
						}
					}
					function targetWatcher(newVal, oldVal, scope){
						if(newVal){
							fillBlankObject();
							if(scope.ngModel.bind.indexOf("[*]") != -1)
							{
								var leftP = scope.ngModel.bind.split("[*]")[0];
								var rightP = scope.ngModel.bind.split("[*]")[1];
								scope.bindData = eval("scope.target." + leftP + "[" + 0 + "]" + rightP);
							}
							else
							{
								scope.bindData = eval("scope.target." + scope.ngModel.bind);
							}
							scope.avaliable = scope.bindData != undefined;
							scope.$watch("bindData", bindDataWatcher);
						}
					};
					function avaliableWatcher(newVal, oldVal, scope){
						if(newVal)
						{
							scope.bindData = cachValue ? cachValue : scope.bindData;
							currentTarget.setEnabled();
						}
						else
						{
							cachValue = scope.bindData ?  scope.bindData : cachValue;
							scope.bindData = undefined;
							currentTarget.setDisabled();
						}
					};
					function bindDataWatcher(newVal, oldVal, scope){
						var params = scope.ngModel.bind.split(".");
						var end = params[params.length - 1];
						var evalStr = new Array();
						if(scope.ngModel.bind.indexOf("[*]") != -1)
						{
							var leftP = scope.ngModel.bind.split("[*]")[0];
							var rightP = scope.ngModel.bind.split("[*]")[1];
							var arr = eval("scope.target." + scope.ngModel.bind.split("[*]")[0]);
							for(var i in arr){
								evalStr.push(leftP + "[" + i + "]" + rightP)
							}
						}
						else
						{
							evalStr.push(scope.ngModel.bind)
						}
						for(var i in evalStr)
						{
							var rs = evalStr[i].split("." + end)[0];
							eval("scope.target." + rs)[end] = newVal;
						}
					}
					function fillBlankObject(){
						var params = scope.ngModel.bind.split(".");
						var variable = "scope.target";
						for(var i in params)
						{
							if(i < params.length - 1){
								variable += "." + params[i];
								if(eval(variable + "== undefined"))
								{
									eval(variable + "={}");
								}
							}
						}
					}
				}
			}
			return standardColor;
		}]);
		app.directive("updateOnEnter", ["$timeout", function(timeout){
			var directive = {};
			directive.scope = {
				ngModel : "="
			};
			directive.restrict = "C";
			directive.link = link;
			function link(scope, element, attrs){
				var target = $(element[0]);
				target.bind("keyup", function(event){
					if(event.keyCode == 13)
					{
						target.blur();
					}
				})
			};
			return directive;
		}]);
	}
)