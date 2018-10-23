define(
	["angular", "jquery", "jquery-ui"], function(angular){
		var module = angular.module("myapp");
		module.directive("sensorIcon", ["$timeout", function(timeout){
			var content = {};
			content.scope = {
				ngModel : "=",
				pos : "="
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				timeout(domReady);
				function domReady(){
					$(element).draggable({
						helper : "clone",
						revert : false,
						cursor : "move",
						cursorAt : [25,25],
						appendTo : $("body")
					});
				}
			}
			return content;
		}]);
		module.directive("kpiIcon", ["$timeout", function(timeout){
			var content = {};
			content.scope = {
				ngModel : "=",
				pos : "="
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				timeout(domReady);
				function domReady(){
					$(element).draggable({
						helper : "clone",
						revert : false,
						cursor : "move",
						cursorAt : [25,25]
					});
				}
			}
			return content;
		}]);
		module.directive("datepicker", ["$timeout", function(timeout){
			var content = {};
			content.scope = {
				ngModel : "="
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				timeout(domReady);
				function domReady() {
					$("#Datepicker").datepicker({
						dateFormat: "yy-mm-dd",
						onSelect: function (value) {
							scope.$apply(function(){
								scope.ngModel = value;
							});
						}
					});
				}
			}
			return content;
		}]);
		module.directive("handleWrap", ["$timeout", function(timeout){
			var content = {};
			content.scope = {
				receive : "="
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				$(element).draggable({
					containment : $(".profinner"),
					handle : ".iconpart",
					stop : function(event, ui){
						scope.$apply(function(){
							scope.receive.top = ui.offset.top - $(".profinner").offset().top;
							scope.receive.left = ui.offset.left - $(".profinner").offset().left;
						});
					}
				});
			}
			return content;
		}]);
		module.directive("dropArea", ["$timeout", function(timeout){
			var content = {};
			content.scope = {
				onDrop : "&"
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				timeout(function(){
					$(element).droppable({
						accept : "[class*=-icon]",
						drop : dropEvent,
						hoverClass : "drop-hover"
					});
				});
				function dropEvent(event, ui){
					scope.$apply(function(){
						scope.onDrop({
							ui : ui,
							offset : $(element).offset()
						});
					});
				}
			}

			return content;
		}]);
		module.directive("dropdown", ["$timeout", "$q", function(timeout, q){
			var content = {};
			content.scope = {
				ngModel : "=",
				options : "=",
				change : "&"
			};
			content.replace = false;
			content.restrict = "C";
			content.link = link;
			function link(scope, element, attrs)
			{
				require(['commonlib'], function(lib){
					console.log(scope.ngModel);
					var selection;
					var optionElmList = [];
					var deferred = q.defer();
					var promise = deferred.promise;
					scope.$watch("ngModel", ngModelWatcher);
					scope.$watch("options", optionWatcher);
					function ngModelWatcher(n, o, s){
						if(n){
							promise.then(function success(){
								for(var i in optionElmList){
									(function(option){
										var data = option.data("option");
										if(n == data){
											option.attr("selected", "selected");
										}
										else
										{
											option.removeAttr("selected")
										}
									})(optionElmList[i])
								}
								//selection.selectmenu("refresh");
							});
						}
					}
					function optionWatcher(n, o, s){
						if(n){
							var options = new lib.ArrayHandler(n);
							selection = $("<select></select>");
							element.children().remove();
							element.append(selection);
							options.each(function(option){
								var optionElm = $("<option></option>");
								optionElm.text(option.label);
								optionElm.data("option", option);
								selection.append(optionElm);
								optionElmList.push(optionElm)
							});
							selection.selectmenu({
								change : change,
								width : element.width()
							});
							function change(event, ui){
								var element = $(ui.item.element);
								var value = element.data("option");
								s.ngModel = value;
								s.change();
							}
							deferred.resolve("optionLoaded!");
						}
					}
				});
			}
			return content;
		}]);
	}
)