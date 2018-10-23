define(['require'], function(require) {
  require(["require", "angular", "angular-route", "app", "config", "services", "values", "controllers", "directives", "filters"],
    function(require, angular) {
      require(['domReady'], function(docment) {
        angular.bootstrap(document, ['myapp']);
      });
    })
});