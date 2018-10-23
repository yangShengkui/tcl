define(['directives/directives'], function(controllers) {
	'use strict';
	controllers.controller('Dashboard_ver2Ctrl', Dashboard_ver2Ctrl);
	Dashboard_ver2Ctrl.$inject = ["$scope", "variables", "$routeParams"];
	function Dashboard_ver2Ctrl(scope, variables, routeParams){
		console.log("普奥云首页第二版");
		var sUserAgent = navigator.userAgent;
		var bIsIpad = sUserAgent.match(/ipad/i) =="ipad";
		var bIsIphoneOs = sUserAgent.match(/iphone os/i) =="iphone os";
		var bIsAndroid = sUserAgent.match(/android/i) =="android";
		var bIsWM = sUserAgent.match(/windows mobile/i) =="windows mobile";
		if(bIsIpad||bIsIphoneOs||bIsAndroid||bIsWM){
			scope.hideEdit = true;
		}
		else
		{
			scope.hideEdit = false;
		}
		scope.variables = variables;
		scope.dashboard = {};
		scope.dashboard.solutionId = routeParams.solutionId;
		(function(){
			var cur = this;
			cur.editBtnClick = function(){
				cur.mode = (cur.mode == variables._EDITMODE_) ? variables._VIEWMODE_ : variables._EDITMODE_;
			};
			variables.getViews(scope.dashboard.solutionId);
			cur.on = function(event, callback){
				switch(event){
					case "switchMode":
						cur.callback = callback;
						break;
					default:
						break;
				}
			};
		}).call(scope.dashboard);
	}
});