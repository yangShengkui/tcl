define(['directives/directives', 'ps-tree'], function(directives, pstree) {
  'use strict';
  directives.registerDirective && directives.registerDirective("psTreeView", dataTableDir) || directives.directive('psTreeView', psTreeViewDir);
  psTreeViewDir.$inject = ['$q', '$timeout', '$location', 'viewFlexService'];
  function psTreeViewDir(q, timeout, $location, viewFlexService) {
    return {
      restrict : "E",
      template : "<div></div>",
      replace : true,
      scope : {
        ngModel : "=",
        option : "=",
        init : "&"
      },
      link : function(scope, elem){
        var treeIns, dt;
        function create(d){
          treeIns = pstree(elem[0], {
            value : scope.ngModel,
            animate : false,
            themes : "show-line",
            data : d,
            on : {
              init : function(event){
                var cur = this;
                if(this.depth > 1){
                  this.open = false;
                }
                var group = this.createGroup("group");
                var str = this.view ? this.view.viewTitle + "[" + this.view.viewId + "]" : "无";
                var text = this.createText("id", str, {
                  float : "right",
                  color : "#999"
                });
                var addBtn = this.createButton("add", "选择", {
                  float : "right"
                }, function(e){
                  scope.$apply(function(){
                    $location.path("/rview_select/" + cur.modelId + "/" + cur.id)
                  })
                });
                group.appendChild(addBtn);
                group.appendChild(text);
                this.render(group);
              },
              click : function(event){

              }
            }
          });
          scope.init({treeIns : treeIns})
          runtime('树加载完成');
        }
        function destroy(){
          treeIns && treeIns.destroy();
          elem.children().remove();
        }
        scope.$watch("option", function(n, o, s){
          runtime('n数值改变');
          console.log("n", n);
          n ? create(n) : destroy();
        })
      }
    }
  };
});