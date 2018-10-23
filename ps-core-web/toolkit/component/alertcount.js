/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var element = data.element;
    var serviceCenterService = data.serviceCenterService;
    var alertcount = $('<ul></ul>').addClass("nav nav-pills nav-stacked");
    serviceCenterService.getValuesByTimealert().then(function(data){
      var renderLi = function(item) {
        var li = $("<li></li>");
        var a = $("<span></span>")
          .text(item.name)
          .css("line-height", "30px");
        var span = $("<span></span>")
          .addClass("pull-right text-red ng-binding")
          .css("line-height", "30px")
          .text(item.value + "条");
        li.append(a).append(span);
        return li;
      }
      for(var i in data.series[0].data)
      {
        alertcount.append(renderLi(data.series[0].data[i]));
      }
    });
    if(element.style)
    {
      alertcount.css(element.style);
    }
    return alertcount;
  }
});
