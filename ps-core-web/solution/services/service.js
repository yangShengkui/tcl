define(function(){
  return [{
    name : "_userLoginUIService",
    injector : ["userLoginUIService"],
    service : function(uls){
      uls.test = function(){
        console.log("tstststststs");
      }
      return uls;
    }
  }]
})