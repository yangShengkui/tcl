(function(global, factory){
  if(global === window){
    window.globalCtrl = factory();
  }
})(this, function(){
  var events = {};
  function extend(a, b){
    for(var i in b){
      a[i] = b[i];
    }
    return a;
  }
  function on(eventname, handler){
    events[eventname] = handler;
  }
  function emit(){
    var args = [].slice.call(arguments),
      eventname = args.shift(),
      dt = args.shift(),
      scope = dt[0],
      name = dt[1];

    if(events[eventname]){
      events[eventname].call(this, {
        getName : function(){
          return scope[name].attributes['name'];
        },
        update : function(callback){
          callback(scope[name].attributes);
          scope[name] = extend({}, scope[name]);
        }
      });
    }
  }
  return {
    on : on,
    emit : emit
  }
});