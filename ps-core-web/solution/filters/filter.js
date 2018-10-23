define(function(){
  return [{
    name : "myfilter",
    injector : "resourceUIService",
    filter : function(resourceUIService){
      return function(input){
        return input;
      }
    }
  }]
})