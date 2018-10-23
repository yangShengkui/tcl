/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return {
    init : function(fmt){
      Date.prototype.format = function(fmt) {
        var o = {
          "M+" : this.getMonth()+1,                 //月份
          "d+" : this.getDate(),                    //日
          "h+" : this.getHours(),                   //小时
          "m+" : this.getMinutes(),                 //分
          "s+" : this.getSeconds(),                 //秒
          "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
          fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
          if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
          }
        }
        return fmt;
      };
      var time;
      var interval;
      var events = {};
      var formt = "yyyy-MM-dd hh:mm:ss";
      function clock(){
      };
      clock.prototype.setFormat = function(fmt){
        formt = fmt || formt;
      };
      clock.prototype.on = function(eventname, callback){
        events[eventname] = callback;
      };
      clock.prototype.start = function(){
        time = new Date().format(formt);
        events['init'](time);
        interval = setInterval(function(){
          time = new Date().format(formt);
          events['change'](time);
        },1000);
      };
      clock.prototype.getTime = function(){
        return time;
      }
      clock.prototype.stop = function(){
        clearInterval(interval);
      };
      return new clock(fmt);
    }
  };
});
