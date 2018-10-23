define(['controllers/controllers','Array'], function (controllers) {
  'use strict';
  controllers.initController('viewmanageCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl', 'userEnterpriseService', 'viewFlexService', "$window", "freeboardservice", "freeboardBaseService", "dialogue",
    function (scope, rootScope, location, routeParams, timeout, userLoginUIService, Info, growl, userEnterpriseService, viewFlexService, window, freeboardservice, freeboardBaseService, dialogue) {
      var objectLike = /^\{.*\}$/;
      var viewId = decodeURIComponent(routeParams.viewId), allMyViews;
      var isObject = objectLike.test(viewId);
      scope.instance = {};
      function designView(data) {
        this.$clone(data);
      };
      designView.prototype.click = function() {
        // location.path("designView/" + this.viewId)
        viewId = this.viewId;
        runAsDefault();
      };
      scope.addDesignView = function() {
        window.location.href = "../app-freeboard/index.html#/editor/view/editor"
      };
      var renderGraphWhile = function(callback){
        viewFlexService.getManagedViewsByTypeAndRole("designView", function(event){
          if(event.code){
            rootScope.designViews = event.data.map(function(element){
              var clone = element.$clone();
              return new designView(clone)
            });
            scope.currentSelect = rootScope.designViews.find(callback);
            if(!scope.currentSelect){
              if(rootScope.designViews.length > 0){
                scope.currentSelect = rootScope.designViews[0];
              };
            };
            if(scope.currentSelect){
              var vid = scope.currentSelect.viewId;
              viewFlexService.getViewById(vid, function(event){
                var render = function(clone){
                  var input = {
                    layout : clone.data ? clone.data : clone.layout,
                    setting : clone.setting
                  };
                  delete clone.data;
                  scope.editData = new freeboardservice.replaceCiKpi(input, function(){
                    timeout(function(){
                      scope.instance.setMode(true);
                      scope.instance.renderLayout(scope.editData);
                    });
                  });
                };
                var renderEmpty = function(){
                  timeout(function(){
                    scope.editData = {
                      layout : {}
                    };
                    scope.instance.setMode(true);
                    scope.instance.renderLayout(scope.editData);
                  });
                };
                if(event.code == 0){
                  var content = event.$attr("data/content");
                  if(content){
                    var clone = JSON.parse(content);
                    render(clone);
                  } else {
                    renderEmpty();
                  }
                } else {
                  renderEmpty();
                }
              });
            }
          }
        });
      };
      var runAsDefault = function(){
        renderGraphWhile(function(view){
          return view.viewId == viewId;
        });
      };
      var runWhenParamFound = function(){
        var param = JSON.parse(viewId);
        scope.mainlabel = param.label;
        scope.hideNaviBar = true;
        var viewTitle = param.value;
        renderGraphWhile(function(view){
          return view.viewTitle == viewTitle;
        });
      };
      if(isObject){
        runWhenParamFound();
      } else {
        runAsDefault()
      }

    }
  ]);
});