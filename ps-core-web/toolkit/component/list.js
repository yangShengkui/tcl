/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var element = data.element;
    var innerContent = $("<table width='100%' class='table table-hover no-margin'>");
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes){
      if(funRes.code == "0"){
        var fnResult = funRes.data;
        expression = fnResult;
        expression = expression ? expression : {};
      } else {
        throw new Error(funRes.message);
      }
    });
    var global = data.global;
    var header = $("<thead></thead>");
    var tbody = $("<tbody></tbody>");
    var customevents = {
      ready : "ready"
    };
    var addEvents = function(dom, events){
      var addEvent = function(event, handler){
        if(customevents[event]){
          customevents[event] = handler;
        } else {
          dom.on(event, function(evt){
            handler({
              jquery : evt,
              global : global,
              tools : data,
              ui : element
            })
          });
        }
      };
      for(var i in events){
        addEvent(i, events[i]);
      };
    };
    addEvents(innerContent, expression.$attr("on"));
    innerContent.append(header).append(tbody);
    var render = function(data) {
      header.children().remove();
      tbody.children().remove();
      var tr = $("<tr></tr>");
      header.append(tr);
      for (var i in data[0]) {
        tr.append($("<th>" + data[0][i].label + "</th>"));
      }
      for (i in data) {
        var createContent = function(index, item){
          var content = $('<tr></tr>');
          for (var i in item) {
            content.append($('<td>' + item[i].value + '</td>'));
          }
          return content;
        };
        tbody.append(createContent(i, data[i]));
      };
    };
    element.render = render;
    if(typeof customevents.ready == "function"){
      customevents.ready({
        target : element,
        global : global,
        tools : data,
        ui : element
      })
    }
    return innerContent;
  }
});
/**
 * (function(){
  return {
    click : function(event){
      var target = event.global.variable("productlist");
      var value = event.value.value;
      var number = Math.round(value / 20);
      if(number > 10) {
        number = 10;
      } else if(number < 1) {
        number = 1;
      }
      var result = [];
      for(var j = 0; j < number; j++) {
        var name = ''
        if(j % 4 == 0) {
          name = 'FH (' + event.value.name + ")";
        } else if(j % 4 == 1) {
          name = 'T系列(' + event.value.name + ")";
        } else if(j % 4 == 2) {
          name = 'EH系列(' + event.value.name + ")";
        } else if(j % 4 == 3) {
          name = 'SPZ-FK系列(' + event.value.name + ")";
        }
        result.push({
          category : {
            label : '产品分类',
            value : name
          },
          product : {
            label : '产品份额',
            value : value + Math.round(Math.random() * 100),
          },
          malfunction : {
            label : '平均故障',
            value : Math.round(Math.random() * 100)
          }
        });
      }
      target.render(result);
    }
  }
})
*/