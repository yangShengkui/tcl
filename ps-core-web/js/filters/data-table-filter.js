define(['../filters/filters.js'], function(filters) {
	'use strict';
  filters.filter("namefilter", function(){
    function filter(input, querytype, key, columnDefs){
      var result = [];
      if(typeof input == "object"){
        result = input.filter(function(elem){
          if(key === undefined || key === "" ) {
            return true;
          } else {
            if(querytype == undefined || querytype == ""){
              var rs = false;
              for(var i in columnDefs){
                if(columnDefs[i].filterable){
                  var attr = columnDefs[i].data;
                  if(typeof elem[attr] == 'string'){
                    if(elem[attr].indexOf(key) != -1){
                      rs = true;
                    }
                  }
                }
              }
              return rs || elem.selected == true;
            } else {
              var val = elem[querytype];
              if(val != undefined || val == null || val == ""){
                if(typeof val == 'string'){
                  return elem[querytype].indexOf(key) != -1 || elem.selected == true;
                } else if(typeof val == 'number'){
                  return elem[querytype] == key || elem.selected == true;
                } else if (typeof val == 'object') { 
                  var some = val.some(function(item) {
                    return item.roleID === key.roleID;
                  });
                  if (some || elem.selected == true) {
                    return true;
                  }
                }
              }
            }
          };
        });
      };
      return result;
    }
    return filter;
  });
  filters.filter("formatedate", function(){
    function filter(input, format){
      var result;
      if(input != null){
//      var date = new Date(input);
//      var d = {
//        yy : date.getFullYear(),
//        mm : date.getMonth() + 1,
//        dd : date.getDate(),
//        hh : date.getHours() > 9 ? date.getHours() : "0" + date.getHours(),
//        nn : date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes(),
//        ss : date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
//      };
//      result = format;
//      for(var i in d){
//        result = result.replace(i, d[i])
//      }
        if (format == "yy-mm-dd hh:nn:ss") {
          format = "YYYY-MM-DD HH:mm:ss"
        }
        result = useMomentFormat(input,format);
      } else {
        result = "-";
      }
      return result;
    }
    return filter;
  });
  filters.filter("formatetext", function(){
    function filter(input, format, row){
      if(typeof format == "function"){
        return format(input, row);
      } else {
        return input;
      }
    }
    return filter;
  });
});