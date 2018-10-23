define(['angular',
  '../solution/module.config.js',
  '../solution/modules/index.js',
  '../js/directives/free-board-dom.js',
  '../js/directives/free-board-prev-dom.js',
  '../js/directives/data-tables-adv-dom.js',
  '../js/directives/tools-dom.js',
  '../js/directives/ps-tree-dom.js'], function(angular, config){
  var slice = Array.prototype.slice,
    tostring = Object.prototype.toString,
    contexts = {},
    isUndefined = isType("Undefined"),
    _tools = [
      'controllers',
      'services',
      'directives',
      'filters'
    ];
  function isType(type){
    return function(obj){
      return tostring.call(obj) === "[object " + type + "]";
    }
  }
  function bind(target, fn){
    return function(){
      fn.apply(target, arguments);
    }
  }
  function each(arr, callback){
    var i;
    for(i = 0; i < arr.length; i++){
      callback(arr[i], i, arr);
    }
  }
  function eachProp(obj, callback){
    var i;
    for( i in obj ){
      callback && callback( obj[i], i )
    }
  }
  /** ES5 下面PROMISE的兼容性写法 */
  if(isUndefined(Promise)){
    Promise = function(fn){
      this.state = 0;
      function resolve(d){
        this.state = 1;
        this.resolveFn && this.resolveFn(d);
      }
      function reject(e){
        this.state = 2;
        this.rejectFn && this.resolveFn(d);
      }
      fn(bind(this, resolve), bind(this, reject));
    }
    Promise.pototype.then = function(fn){
      this.resolveFn = fn;
    }
    Promise.prototype.catch = function(fn){
      this.rejectFn = fn;
    }
    Promise.all = function(promises, callback){
      var i = 0;
      var result = [];
      each(promises, function(promise){
        promise.then(function(d){
          result.push(d);
          result.length == promises.length && callback && callback(result);
        })
      });
    }
  }
  function inject(module, method, list){
    method = method.slice(0,-1);
    each(list, function(item){
      var name = item.name;
      var params = item.injector ? item.injector.concat([item[method]]) : item[method];
      module[method](name, params);
    });
  }
  function loader(dependencies){
    var definition = {
      resolver: ['$q', '$rootScope', function($q, $rootScope) {
        var defered = $q.defer();
        require(dependencies, function() {
          $rootScope.$apply(function() {
            defered.resolve();
          });
        });
        return defered.promise;
      }]
    };
    return definition;
  }
  function getResource(path, e){
    return "../../solution/" + path + "/" + e;
  }
  function getDataFromArgs(args){
    var arr = slice.call(args, 0);
    return arr.reduce(function(a, b){
      return a.concat(b);
    }, []);
  }
  function loadModule(callback){
    var module = angular.module("solution", ['solutionModules']);
    getAllTools = _tools.map(function(type, inx){
      return new Promise(function(resolve, reject){
        var map = config[type] ? config[type].map(function(e){
          return getResource(type, e);
        }) : null;
        map ? require(map, function(){
          var res = getDataFromArgs(arguments);
          contexts[type] = res;
          resolve(res);
        }) : resolve(null);
      })
    })
    Promise.all(getAllTools).then(function(d){
      eachProp(contexts, function(res, type){
        inject(module, type, res);
      })
      module.config([
        '$routeProvider',
        function($routeProvider) {
          var controllers = contexts["controllers"];
          eachProp(controllers, function(ctrl, i){
            $routeProvider.when(ctrl.route, {
              templateUrl: "../solution/partials/" + ctrl.templateUrl,
              controller: ctrl.name,
            })
          });
        }
      ]);
      callback(module);
    });
  }
  return loadModule;
});
