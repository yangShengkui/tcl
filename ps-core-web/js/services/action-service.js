define(['../services/services.js', '../../solution/action/config.js'], function(services, config) {
  'use strict';
  services.factory('actionService', ['$rootScope', 'serviceProxy',
    function(rootScope, serviceProxy) {
      var service = {
        addmenu : addmenu
      };
      var args = Array.prototype.slice.call(arguments);
      var menuitems = rootScope['menuitems'];
      function addmenu(name, item){
        var conf = config[name];
        var str = "";
        function getValue(val){
          if(typeof val == "function"){
            return val(item);
          } else {
            return val
          }
        }
        if (conf && conf.options) {
          for(var i in conf.options){
            var url = getValue(conf.options[i].url);
            var label = getValue(conf.options[i].label);
            var functionCode = getValue(conf.options[i].functionCode);
            if (!functionCode || (functionCode && menuitems[functionCode])) {
              str += "<li><a role='button' href='../app-oc/index.html#/" + url + "'>" + label + "</a></li>";
            }
          }
        }

        return str;
      }
      return service;
    }
  ]);
});