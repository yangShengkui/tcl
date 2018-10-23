define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //首页默认进来
  controllers.initController('Editor3Ctrl', ['$scope', '$routeParams','$rootScope', '$q', 'Info', 'solutionUIService', 'userLoginUIService', 'marketplaceUIService', 
  'userUIService', 'growl','userInitService','ngDialog','viewFlexService','resourceUIService',
    function($scope,$routeParams, $rootScope, $q, Info, solutionUIService, userLoginUIService, marketplaceUIService, 
      userUIService, growl, userInitService ,ngDialog,viewFlexService,resourceUIService) {
      $scope.selectedView = {};
      /**
       * 新建组态视图
       * @param {Object} callbackFun
       */
      var createConfigView = function(callbackFun) {
        $scope.configureInfo = {
          viewId: 0,
          viewTitle: '新建3D组态视图' + new Date().Format("yyyy-MM-dd"),
          viewType: 'configure',
          template: {
            displayModel:"3D",
            type: 0
          },
          domainPath: '',
          description: '3D'
        };

        var dialog = ngDialog.open({
          template: '../partials/dialogue/configure_dia.html',
          className: 'ngdialog-theme-plain',
          scope: $scope
        });
        $scope.checkSameName($scope.configureInfo.viewTitle);
      
        // 模板、项目、普通之间的切换
        var typeWatcher = function(n, o, s) {
          var callback = function(event) {
            var tree = event.data;
            $scope.typeContents = [].concat(tree);
          };
          if(n < 2) {
            $scope.configureInfo.template.resourceId = null;
            callback({
              data: $scope.treeAry
            });
          } else if(n == 2) {
            if($scope.getResourceByModelId) {
              callback($scope.getResourceByModelId)
            } else {
              resourceUIService.getResourceByModelId(302, function(event) {
                $scope.getResourceByModelId = event;
                callback(event);
              });
            };
          }
        };
        $scope.$watch("configureInfo.template.type", typeWatcher);

        //保存按钮
        $scope.saveData = function() {
          if(!$scope.configureInfo.template.resourceId || $scope.configureInfo.template.resourceId == 0) {
            $scope.configureInfo.template =  {
              displayModel:"3D",
              type: 0
            };
          } else {
            if($scope.configureInfo.template.type == 1) {
              $scope.configureInfo.template.resourceType = "device";
            } else {
              $scope.configureInfo.template.resourceType = "project";
            }
          }
          viewFlexService.addView($scope.configureInfo, function(returnObj) {
            if(returnObj.code == 0) {
              var viewId = returnObj.data.viewId;
              if(dialog) {
                dialog.close();
                $('#' + dialog.id).remove();
              }
              growl.success("保存成功");
              location.href = "index.html#/configure/" + viewId;
            }
          });
        };
        $scope.closeDialog = function() {
          if(dialog) {
            dialog.close();
            $('#' + dialog.id).remove();
            window.history.back();
          }
        };
      };
      
      /**
       * 通过viewId获得视图的组态内容
       * @param {Object} scope
       * @param {Object} viewId
       */
      var showViewContent = function(scope, viewId) {
        viewFlexService.getViewById(viewId, function(returnObj) {
          if(returnObj.code == 0) {
            $scope.selectedView = returnObj.data;
            if ($scope.selectedView.content)
              editor.fromJSON( JSON.parse($scope.selectedView.content));
          }
        })
      };
      
      var initHandler = function() {
        editor.clear(); //清除当前的页面
        var loadcount = 0;
        var gotoShowView = function() {
          if(loadcount == 3) {
            if($routeParams.viewId != 0) {
              showViewContent($scope, $routeParams.viewId);
            } else {
              createConfigView(function(viewId) {
                showViewContent($scope, viewId);
              });
            }
          }
        }

        var rootModelDicWatch = $scope.$watch("rootModelDic", function(nv, ov) {
          if((nv && !ov) || ov) {
            loadcount++;
            gotoShowView();
            rootModelDicWatch();
          }
        });

        var domainListTreeWatch = $scope.$watch("domainListTree", function(nv, ov) {
          if((nv && !ov) || ov) {
            loadcount++;
            gotoShowView();
            domainListTreeWatch();
          }
        });
        var myOptionDicWatch = $scope.$watch("myOptionDic", function(nv, ov) {
          if((nv && !ov) || ov) {
            loadcount++;
            gotoShowView();
            myOptionDicWatch();
          }
        });
      }
      /**
       * 检查当前组态视图名称是否可以用
       * @param {Object} viewTitle
       */
      $scope.checkSameName = function(viewTitle) {
        var run = function(allViews) {
          var some = allViews.some(function(elem) {
            return viewTitle == elem.viewTitle;
          });
          if(some) {
            $scope.errorMsg = "此视图名称已被占用";
          } else {
            $scope.errorMsg = null;
          }
          $scope.checkSm = some;
        }
        if($scope.getAllMyViews) {
          run($scope.getAllMyViews)
        } else {
          viewFlexService.getAllMyViews(function(event) {
            if(event.code == 0) {
              $scope.getAllMyViews = event.data;
              run(event.data);
            }
          })
        }
      };
      
      var NUMBER_PRECISION = 6;

      function parseNumber( key, value ) {
    
        return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;
    
      }
      $scope.saveContentData = function() {
        var output = editor.toJSON();
        output.metadata.type = 'App';
        delete output.history;
    
        var vr = output.project.vr;
    
        output = JSON.stringify( output, parseNumber, '\t' );
        output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );  
        $scope.selectedView.content = output;
        viewFlexService.updateView($scope.selectedView, function(returnObj) {
          if(returnObj.code == 0) {
            growl.success("保存成功")
          }
        });
      }
      
      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            initHandler()
          }
        });
      } else {
        initHandler()
      }
    }
  ]);
});