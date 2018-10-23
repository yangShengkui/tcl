define(['controllers/controllers'], function(controllers) {
	'use strict';
	controllers.controller('CalendarCtrl', ['$scope', 'Info',
		function($scope, Info) {
			console.info("切换到日程管理");
			var info = Info.get("../localdb/info.json", function(info) {
				$scope.$broadcast('CalendarStatusInit');
			});
		}
	]);
});