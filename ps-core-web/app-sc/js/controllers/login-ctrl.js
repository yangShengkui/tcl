define(['controllers/controllers'], function(controllers) {
  'use strict';
  controllers.controller('LoginCtrl', ['$scope', 'userLoginUIService', '$route', 
    function($scope, userLoginUIService,route) {
      userLoginUIService.changePos();
    }
  ]);
});