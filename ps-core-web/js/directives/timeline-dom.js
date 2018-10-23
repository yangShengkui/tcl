define(['directives/directives'], function(directives) {
  'use strict';
  directives.initDirective('historyTimeline', function($timeout) {
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          $scope.$on("deviceHistoryInit", function(event, args) {
            var eventDate = "";
            var htmlString = '<ul class="timeline" >';
            for(var i = 0; i < args.length; i++) {
              if(i == 0) {
                eventDate = args[i].update_date.substring(0, 10);
                htmlString += addTmLabel(eventDate);
              }
              if(eventDate != args[i].update_date.substring(0, 10)) {
                eventDate = args[i].update_date.substring(0, 10);
                htmlString += addTmLabel(eventDate);
              }
              htmlString += addTmItem(args[i]);
            }
            htmlString += '<li><i class="fa fa-clock-o bg-gray"></i></li>';
            htmlString += "</ul>";
            $element.html(htmlString);
          });

          var addTmLabel = function(eventDate) {
            var string = "";
            var random = Math.random();
            var bgClass = random > 0.75 ? "bg-red" : (random > 0.5 ? "bg-orange" : (random > 0.25 ? "bg-yellow" : "bg-green"));
            string += '<li class="time-label"><span class=' + bgClass + '>';
            string += eventDate.replace(/-/, "年").replace(/-/, "月");
            string += '</span></li>';
            return string;
          };

          var addTmItem = function(tmItem) {
            var string = "";
            var eventIcon = "";

            if(tmItem.resource_type == 1) {
              eventIcon = "fa-envelope bg-blue";
            }
            //if(tmItem.author != "system"){
            //  eventIcon = "fa-user bg-aqua";
            //}
            if(tmItem.resource_type == 2) {
              eventIcon = "fa-picture-o bg-yellow";
            }
            if(tmItem.resource_type == 3) {
              eventIcon = "fa-video-camera bg-maroon";
            }
            if(tmItem.file_url != null) {

            }

            string += '<li><i class="fa ' + eventIcon + '"></i>';
            string += '<div class="timeline-item">';
            string += '<span class="time"><i class="fa fa-clock-o"></i>';
            string += tmItem.update_date.substring(0, 19).replace(/-/, "年").replace(/-/, "月").replace(/T/, " ");
            string += '</span>';

            string += '<h3 class="timeline-header"><a href="#">' + tmItem.author + '</a>&nbsp;' + tmItem.subject + '</h3>';
            if(tmItem.resource_type == 1) {
              string += '<div class="timeline-body">' + tmItem.content + '</div>';
            }
            if(tmItem.resource_type == 2) {
              string += '<div class="timeline-body"><img src="../' + tmItem.file_url + '" alt="..." class="margin"></div>';
            }
            if(tmItem.resource_type == 3) {
              string += '<div class="timeline-body">';
              string += '<div class="embed-responsive embed-responsive-16by9">';
              string += '<video src="../' + tmItem.file_url + '" controls="controls"></video>';
              string += '</div></div>';
            }
            string += '</li>';

            return string;
          };
        }
      ]
    };
  });
});