define(['require'],function(require){
  injectBasicAngular();
  function injectBasicAngular()
  {
    require(["require", "angular", "angular-route"], injectModules);
  };
  function injectModules(){
    require(["service", "value", "controller", "directive", "filter"], formApp);
  };
  function formApp(){
    require(["app", "config"], bootstrapAngular);
  };

  function bootstrapAngular()
  {
    require(['domReady'],function(docment){
      angular.bootstrap(document,['myapp']);
    });
  };
});
