/**
 * Created by leonlin on 16/11/3.
 */
define([], function(){
  return function(data)
  {
    var resourceUIService = data.resourceUIService;
    var previewMode = data.previewMode;
    var buttonEnabled = data.buttonEnabled;
    var fun = "resourceUIService.getLatestDevices";
    var innerContent = $("<table width='100%' class='table table-hover no-margin'>");
    var uldom = $('<ul class="products-list product-list-in-box"></ul>');
    innerContent.append(uldom);
    eval(fun)(function(event){
      try{
        if(event.code == '0')
        {
          var dt = event.data;
          for(var i in event.data)
          {
            (function(index, item){
              if(!previewMode)
              {
                var lidom = $('<li class="item ng-scope" ng-repeat="device in deviceitems">\
																									<div class="product-info">\
																											<a class="product-title ng-binding"><span class="label label-primary pull-left ng-binding">' + format(item.createTime) + '</span>' + item.label + '</a>\
																									</div>\
																							</li>');
                uldom.append(lidom);
              }
              else
              {
                var lidom = $('<li class="item ng-scope" ng-repeat="device in deviceitems" style="cursor : pointer;">\
																									<div class="product-info">\
																											<a class="product-title ng-binding"><span class="label label-primary pull-left ng-binding">' + format(item.createTime) + '</span>' + item.label + '</a>\
																									</div>\
																							</li>');
                uldom.append(lidom);
                if(previewMode)
                {
                  if(buttonEnabled == true)
                  {
                    lidom.on("click", function(event){
                      window.location.href = "../app-oc/index.html#/resource/" + item.modelId + "/" + item.id;
                    });
                  }
                }
              }
            })(i, event.data[i])
          }
        }
        else
        {
          throw event.message;
        }
      }
      catch(err){
        console.log(err);
      }
      function format(time){
        var date = new Date(time);
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var dt = date.getDate();
        var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        var minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        var second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        return year + "-" + month + "-" + dt + "  " + hour + ":" + minute + ":" + second;
      }
    });
    return innerContent;
  }
});
