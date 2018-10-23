define(['directives/directives', 'ps-tree', "Array"], function(directives, pstree) {
  'use strict';
  directives.registerDirective && directives.registerDirective("freeBoardPrev", dataTableDir) || directives.directive('freeBoardPrev', psTreeViewDir);
  psTreeViewDir.$inject = ['$q', '$timeout', '$location', 'freeboardservice', 'viewFlexService'];
  function psTreeViewDir(q, timeout, $location, freeboardservice, viewFlexService) {
    return {
      restrict : "E",
      template : "<div id=\"free-board\" class=\"whole row\" ng-if=\"error==undefined\" style=\"width:auto;\">\n" +
      "            <div class=\"col-md-12\"\n" +
      "              ng-class=\"setting.theme\"\n" +
      "              ng-style=\"setting.style\"\n" +
      "              instance = \"$parent.instance\"\n" +
      "            f-board></div>\n" +
      "          </div>",
      replace : true,
      scope : {
        viewId : "=",
        option : "=",
        init : "&"
      },
      link : function(scope, elem){
        scope.instance = {};
        viewFlexService.getViewById(scope.viewId,function (json) {
          var vt,
            view = json.data,
            viewJson = JSON.parse(view.content),
            groups = viewJson["groups"] || []
          var find = groups.find(function(element) {
            return vt == element.path;
          });
          scope.tabIndex = find ? groups.indexOf(find) : 0;
          var input = {
            layout: groups.length ? groups[scope.tabIndex].layout : viewJson.layout,
            setting: viewJson.setting
          }
          var editData = new freeboardservice.replaceCiKpi(input, function() {
            timeout(function() {
              scope.instance.setMode(true);
              scope.instance.renderLayout(editData);
            });
          }, null, viewJson);
        })
      }
    }
  };
});