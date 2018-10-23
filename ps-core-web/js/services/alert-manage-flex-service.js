define(['../services/services.js'], function(services) {
	'use strict';
	services.factory('alertManageFlexService', ['serviceProxy',
		function(serviceProxy) {
			var service = {};
			var base = "alertManageFlexService";
			service.sendClaimAction = function(alertInfo, callBack) {
				serviceProxy.get(base, "sendClaimAction",alertInfo , callBack);
			};
			service.sendRecoverAction = function(alertInfo, callBack) {
				serviceProxy.get(base, "sendRecoverAction",alertInfo , callBack);
			};
			service.sendForwardAction = function(alertInfo, ticket, callBack) {
				serviceProxy.get(base, "sendForwardAction",[alertInfo , ticket], callBack);
			};
            service.addAlert = function(manualAlertInfo,callBack) {
                serviceProxy.get(base,"addAlert",manualAlertInfo,  callBack);

            };
            service.exportExcelByWeek = function(alertParam,callBack) {
                serviceProxy.get(base,"exportExcelByWeek",alertParam,  callBack);

            };
            //人工报警 获取报警原因列表
            service.getAlertTitleList = function(alertParam,callBack) {
                serviceProxy.get("resourceUIService","findAlertDefinitions",alertParam,  callBack);

            };

			return service;
		}
	]);
});