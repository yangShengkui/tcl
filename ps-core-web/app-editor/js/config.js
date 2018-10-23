define(
  [
    "app",
  ],
  function(app) {
    app.config([
      '$httpProvider',
      '$routeProvider',
      function($httpProvider,routeProvider) {
        routeProvider
          .when('/', {
            templateUrl: "partials/login.html",
            controller: "loginController",
            resolve: {
              successLogin: function(loginManagement) {
                return loginManagement.loginChecking_login();
              }
            }
          })
          .when('/echart/:viewId?', {
            templateUrl: "partials/echart.html",
            controller: "mainController",
            resolve: {
              successLogin: function(loginManagement) {
                return loginManagement.loginChecking_others();
              }
            }
          })
          .when('/designechart/:solutionId/:groupId/:modelId', {
            templateUrl: "partials/echart.html",
            controller: "mainController",
            resolve: {
              successLogin: function(loginManagement) {
                return loginManagement.loginChecking_others();
              }
            }
          })
          .when('/new/echart', {
            redirectTo: "/echart"
          })
          .when('/preview/:viewData', {
            templateUrl: "partials/preview.html",
            controller: "prevController"
          })
          .when('/echart3/:viewId?', {
            templateUrl: "partials/echart.html",
            controller: "mainController",
            resolve: {
              successLogin: function(loginManagement) {
                return loginManagement.loginChecking_others();
              }
            }
          })
          .when('/new/echart3', {
            redirectTo: "/echart3"
          })
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
    ])
  }
)