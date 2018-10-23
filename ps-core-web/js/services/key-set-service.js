define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('keySet', ['serviceProxy', '$rootScope',
    function(serviceProxy, rootScope) {
      var factory = {};
      var separateKey = function(str){
        var regExp = /(\w+).?(\w*)/;
        var result = regExp.exec(str);
        if(result != null){
          var name = result[1];
          var cls = result[2];
          return {
            name : name,
            class : cls
          }
        } else {
          return null;
        }
      };
      var handler = function(condition){
        return function(key, callback){
          var keyObj = separateKey(key);
          if(keyObj){
            $(window).off("keydown.key_" + keyObj.name + "_" + keyObj.class);
            $(window).on("keydown.key_" + keyObj.name + "_" + keyObj.class, function(event){
              (function(event, key){
                $$.loadExternalJs(["keyboardJS"], function(keyboardJS){
                  var keyCode = keyboardJS._locale.getKeyCodes(key);
                  if(condition(event, keyCode)){
                    event.preventDefault();
                    rootScope.$apply(function(){
                      callback();
                    });
                  }
                });
              })(event, keyObj.name);
            });
          }
        };
      };
      /**当COMMAND键与KEY同时按下时候执行*/
      factory.onCommandKeyWith = handler(function(event, keyCode){
        return (event.metaKey == true || event.ctrlKey == true) && event.keyCode == keyCode[0] && event.shiftKey == false && event.altKey == false;
      });
      /**当COMMAND键与KEY，SHIFT三按键同时按下时候执行*/
      factory.onCommandAndShiftKeyWith = handler(function(event, keyCode){
        return (event.metaKey == true && event.shiftKey == true) && event.keyCode == keyCode[0] && event.altKey == false;
      });
      factory.offKeyWith = function(key){
        $(window).off("keydown.key_" + key);
      };
      return factory;
    }
  ]);
});
