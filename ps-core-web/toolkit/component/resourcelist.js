/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var element = data.element;
    var previewMode = data.previewMode;
    var serviceCenterService = data.serviceCenterService;
    var fun = element.advance.getfunction;
    var innerContent = $("<table></table>")
      .addClass("table table-hover");
    var items = ['设备名', '流量', '进水压力', '出水压力', '温度','创建日期', '健康度', '当前状态'];
    var header = $('<thead></thead>');
    var tr = $("<tr></tr>");
    header.append(tr);
    var createTh = function(item){
      return $("<th></th>").text(item);
    };
    for(var i in items){
      tr.append(createTh(items[i]))
    }
    var tbody = $("<tbody></tbody>");
    innerContent.append(header).append(tbody);
    var method = eval(fun);
    var callback = function(data){
      console.log(data);
      var createContent = function(index, item){
        var date = new Date(item.createTime);
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var dt = date.getDate();
        var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        var minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        var second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        var createTime = year + "-" + month + "-" + dt + "  " + hour + ":" + minute + ":" + second;
        var value =  parseInt(Math.random()* 100);
        var liquid = parseInt(Math.random()* 100) + "m³ /s";
        var inpress = parseInt(Math.random()* 100) + "Pa";
        var outpress = parseInt(Math.random()* 100) + "Pa";
        var temparature = parseInt(Math.random()* 100) + "℃";
        var health = $('<div></div>').addClass("progress sm");
        var progress = $('<div></div>').addClass("progress-bar").css("width", value);
        health.append(progress);
        switch (true) {
          case value == 100:
            progress.addClass("progress-bar-aqua");
            break;
          case value > 90:
            progress.addClass("progress-bar-green");
            break;
          case value > 80:
            progress.addClass("progress-bar-yellow");
            break;
          case value > 70:
            progress.addClass("progress-bar-yellow");
            break;
          case value > 60:
            progress.addClass("progress-bar-red");
            break;
          default:
            progress.addClass("progress-bar-danger");
            break;
        }
        var tr = $("<tr></tr>");
        var addLabel = function(item){
          var td = $("<td></td>")
          var span = $("<span><span>").text(item.label);
          if(item.path){
            span.css("text-decoration", "underline")
              .css("color", "#3c8dbc")
              .css("font-weight", "bold")
              .css("curosr", "pointer")
          }
          td.append(span);
          return td;
        };
        var addItem = function(item){
          var td = $("<td></td>");
          if(typeof item == 'object'){
            td.append(item)
          } else {
            td.append($("<span></span>").text(item))
          }
          return td;
        };
        var addStatus = function(item){
          var td = $("<td></td>");
          var span = $("<span></span>").addClass("label label-info");
          td.append(span);
          if(item.path && item.managedStatus){
            span.text("开机");
          } else {
            span.text("离线");
          }
          return td
        };
        tr.append(addLabel(item));
        tr.append(addItem(liquid));
        tr.append(addItem(inpress));
        tr.append(addItem(outpress));
        tr.append(addItem(temparature));
        tr.append(addItem(createTime));
        tr.append(addItem(health));
        tr.append(addStatus(item));
        return tr;
        if(previewMode) {
          tr.on("click", function(event){
            if(item.path) {
              window.location.href = "../app-sc/index_freeboard.html#/freeboard/" + routeParams['page'] + "|" + item.path;
            }
          });
        }
      }
      for(var i = 0; i < (data.length > 10 ? 10 : data.length) ; i++) {
        tbody.append(createContent(i, data[i]))
      }
    }
    if(typeof method == "function"){
      var prmise = method();
      if(typeof run == "object"){
        prmise.then(callback);
      } else {
        method(function(event){
          if(event.code == 0 && event.data != null){
            callback(event.data);
          }
        });
      }

    }
    return innerContent;
  }
});
