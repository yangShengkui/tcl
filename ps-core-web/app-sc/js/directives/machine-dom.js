define(['directives/directives', "echarts", "jquery-ui", "Array"], function(directives, echarts) {
	'use strict';
	directives.registerDirective('epuipmentEchart', epuipmentEchart_directive);
	epuipmentEchart_directive.$inject = ['$timeout'];
	function epuipmentEchart_directive(timeout) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			chart : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				scope.$watch("chart", function(n,o,s){
					if(n){
						var dom = $(element).find(".inner")[0];
						$(element).height($(element).width() *.5);
						var target = echarts.init(dom, "macarons");
						target.setOption(n);
						$(window).on("resize." + $randomString(), function(){
							$(element).height($(element).width() *.5);
							target.resize();
						});
					}
				});
			});
		};
		return directive;
	}
	directives.registerDirective('dragIcon', dragIcon_directive);
	dragIcon_directive.$inject = ['$timeout'];
	function dragIcon_directive(timeout) {
		var directive = {};
		directive.restrict = "A";
		directive.scope = {
			chart : "=",
			preview : "="
		};
		directive.link = function(scope, element, attr){
			timeout(function(){
				var canvas = $("<canvas id='uploadImage'></canvas>");
				var canvasDom = canvas[0];
				canvas.css({
					width : '80px',
					height : '80px'
				});
				$(element).append(canvas);
				canvasDom.addEventListener('dragover', function (e) {
					e.preventDefault();
				}, false);
				canvasDom.addEventListener("drop", function(evt) {
						evt.preventDefault();
						var files = evt.dataTransfer.files;
						if (files.length > 0) {
							var file = files[0];
							if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
								var reader = new FileReader();
								reader.onload = loadComplete;
								reader.readAsDataURL(file);
							}
						}
					},
					false)
				function loadComplete(evt) {
					scope.$apply(function(){
						scope.preview.icon = evt.target.result;
					});

				}
			});
		};
		return directive;
	}
});

