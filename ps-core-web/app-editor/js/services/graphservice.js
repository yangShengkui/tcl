define(['app'], function(services) {
	'use strict';
	services.factory('graphservice', ['$http', '$rootScope', 'serviceProxy',
		function($http, $rootScope, serviceProxy) {
			var factory = {};
			var graphservice = 'resourceUIService';
			factory.getModels = function(callback) {
				serviceProxy.get(graphservice, 'getAllModels', null, function(result) {
					callback(result);
				});
			};
			factory.getResourceByModelId = function(modelId, callback) {
				serviceProxy.get(graphservice, 'getResourceByModelId', [modelId], function(result) {
					callback(result);
				});
			};
			factory.getAttrsByModelId = function(modelId, callback) {
				serviceProxy.get(graphservice, 'getAttrsByModelId', [modelId], function(result) {
					callback(result);
				});
			};
			factory.getKpisByModelId = function(modelId, callback) {
				serviceProxy.get(graphservice, 'getKpisByModelId', [modelId], function(result) {
					callback(result);
				});
			};
			factory.getResources = function(callback) {
				serviceProxy.get(graphservice, 'getResources', null, function(result) {
					callback(result);
				});
			};
			return factory;
		}
	]);
});