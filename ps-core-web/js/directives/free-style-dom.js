define(['directives/directives'], function(directives) {
  'use strict';
  directives.directive("component", ["$q", "$timeout", function(q, timeout) {
    var directive = {};
    directive.scope = {
      ngModel : "="
    };
    directive.restrict = "C";
    directive.link = function(scope, element, attr){
      timeout(domReady);
      function domReady() {
        var btn = $(element).find(".dropBtn");
        var icon = $(element).find(".glyphicon");
        btn.on("click", function(event){
          if($(element).hasClass("drop")) {
            $(element).removeClass("drop");
            icon.removeClass("glyphicon-chevron-up");
            icon.addClass("glyphicon-chevron-down");
          } else {
            $(element).addClass("drop");
            icon.removeClass("glyphicon-chevron-down");
            icon.addClass("glyphicon-chevron-up");
          }
        });
      }
    };
    return directive;
  }]);
});