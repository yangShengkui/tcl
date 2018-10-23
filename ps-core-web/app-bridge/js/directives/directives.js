define(['angular'], function(angular) {
	'use strict';
	var directives = angular.module('directives', []);
	directives.datatable = {
		language: {
			lengthMenu: "每页显示 _MENU_ 项",
			zeroRecords: "没有匹配结果",
			info: "第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
			infoEmpty: "第 0 至 0 项，共 0 项",
			infoFiltered: "",
			loadingRecords: "载入中...",
			processing: "处理中...",
			search: "筛选:",
			paginate: {
				first: "首页",
				last: "末页",
				next: "下页",
				previous: "上页"
			}
		}
	};
	directives.config([
		'$compileProvider',
		function($compileProvider) {
			directives.registerDirective = $compileProvider.directive;
		}
	]);
	directives.initDirective = function(directiveName, options) {
		var attrs = [];
		var fun = null;
		if(jQuery.isArray(options)) {
			attrs = options.slice(0, options.length - 1)
			fun = options[options.length - 1]
		} else {
			fun = options;
		}
		if(directives.registerDirective)
		{
			directives.registerDirective(directiveName, fun);
		}
		else
		{
			directives.directive(directiveName, fun);
		}
		if (attrs.length > 0)
			fun.$inject = attrs;
	}
	return directives;
});