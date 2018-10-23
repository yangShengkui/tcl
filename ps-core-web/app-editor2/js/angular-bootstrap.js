define(['require'],function(require){
  injectBasicAngular();
  function injectBasicAngular()
  {
    require(["require", "angular", "angular-route"], injectModules);
  };
  function injectModules(require, angular){
    console.log('start angular!!')
    require(["service", "value", "controller", "directive", "filter"], formApp);
    //require(["service", "value", "controller", "directive", "filter"], formApp);
  };
  function formApp(){
    console.log('finished loaded all modules!!')
    require(["app", "config"], bootstrapAngular);
  };
  function bootstrapAngular()
  {
    console.log('start rendering dom!')
    require(['domReady'],function(docment){
      angular.bootstrap(document,['myapp']);
    });
  };
});
