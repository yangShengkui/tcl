/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data) {
    var ticketTaskService = data.ticketTaskService;
    var fun = "ticketTaskService.getTicketsByStatus";
    var innerContent = $("<table width='100%' class='table table-hover no-margin'>");
    var header = $("<thead><tr><th>工单号</th><th>内容</th><th>紧急度</th></tr></thead>");
    var tbody = $("<tbody></tbody>");
    var previewMode = data.previewMode;
    var buttonEnabled = data.buttonEnabled;
    var status = 100;
    innerContent.append(header).append(tbody);
    eval(fun)(status, function (event) {
      if (event.code == '0') {
        var dt = event.data;
        var getContent = function(index, element){
          var ticketNo = $("<a></a>").text(element.ticketNo);
          var message = $("<span></span>").text(element.message);
          var status = $("<span></span>").addClass("label");
          var td1 = $("<td></td>").append(ticketNo);
          var td2 = $("<td></td>").append(message);
          var td3 = $("<td></td>").append(status);
          var content = $("<tr></tr>").append(td1).append(td2).append(td3);
          if(element.priorityCode == 0){
            status.text("低").addClass("alerts-minor");
          }
          else if(element.priorityCode == 100){
            status.text("中").addClass("alerts-major");
          }
          else if(element.priorityCode == 200){
            status.text("高").addClass("alerts-critical");
          }
          if (previewMode) {
            if (buttonEnabled == true) {
              content.on("click", function (event) {
                window.open("../app-oc/index.html#/workorder/" + element.ticketNo);
              });
            }
          }
          return content;
        }
        for (var i = 0; i < (event.data.length > 10 ? 10 : event.data.length); i++) {
          tbody.append(getContent(i, event.data[i]));
        }
      };
    })
    return innerContent;
  }
});
