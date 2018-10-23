/**
 * Created by leonlin on 16/11/3.
 */
define(['commonMethod'], function(commonMethod) {
  return function(data) {
    var dom = $("<div></div>");
    var self = new commonMethod(data);
    var global = data.global;
    var element = data.element;
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        expression = fnResult;
      } else {
        console.log(funRes.message);
        expression = {};
        //throw new Error(funRes.message);
      }
    });
    var datePicker = expression.$attr("datePicker");
    var config = datePicker ? datePicker : {}
    var changeFn = expression.$attr("on/change");
    var input = $("<input />").addClass("form-control").attr("type", "text");
    var i =  $('<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>')
      .css({
        position: "absolute",
        bottom: "10px",
        right: "14px",
        top: "auto",
        cursor: "pointer"
      });
    dom.append(input).append(i);
    var timeout = data.timeout;
    timeout(function(){
      $$.loadExternalJs(['bootstrap-daterangepicker'],function(daterangepicker){
        dom.daterangepicker(config, function(start, end, label) {
          if(changeFn){
            changeFn({
              target: element,
              element: element,
              global: global,
              tools: data,
              self: self,
              value: {
                start: new Date(start.format("YYYY-MM-DD")),
                end: new Date(end.format("YYYY-MM-DD"))
              }
            })
          }
          input.val(start.format('YYYY-MM-DD') + ", " + end.format('YYYY-MM-DD'));
          console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        });
      })
    });
    return dom;
  }
});
