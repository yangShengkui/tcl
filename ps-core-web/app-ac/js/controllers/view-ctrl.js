define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //首页默认进来
  controllers.initController('myViewCtrl', ['$scope', '$rootScope', '$q', 'Info', 'solutionUIService', 'userLoginUIService', 'marketplaceUIService',
  'modelDefinitionService', 'userUIService', 'growl','userInitService',
    function($scope, $rootScope, $q, Info, solutionUIService, userLoginUIService, marketplaceUIService, modelDefinitionService, 
      userUIService, growl, userInitService) {
      $scope.placeList = "";
      $scope.userStatus = "";
      $scope.industryDic = {};
      //不需要登录就能查询应用
      var getAllAppDatas = function() {
//      marketplaceUIService.getActivedStandardAppDatas(function(appList) {
        solutionUIService.getSolutionsByStatus(10,function(returnObj) {
          var appDate = returnObj.data;
          var paramList = [];
          for(var i = 0; i < appDate.length; i++) {
            var htmlViews = {};
            htmlViews['id'] = appDate[i].id;
            htmlViews['label'] = appDate[i].label;
            htmlViews['creator'] = appDate[i].creator;
            if(appDate[i].createTime != null && appDate[i].createTime != '') {
              htmlViews['createTime'] = newDateJson(appDate[i].createTime);
            } else {
              htmlViews['createTime'] = appDate[i].createTime;
            }
            htmlViews['viewIds'] = appDate[i].viewIds;
            htmlViews['modelIds'] = appDate[i].modelIds;
            htmlViews['industry'] = appDate[i].industry;
            $scope.industryDic[htmlViews['industry']] = true;
            htmlViews['status'] = appDate[i].status;
            htmlViews['icon'] = appDate[i].icon;
            htmlViews['desc'] = appDate[i].desc;
            //          if (appDate[i].desc) {
            //            htmlViews['description'] = JSON.parse(appDate[i].desc);
            //          }
            paramList.push(htmlViews);
          }
          $scope.placeList = paramList;
          $rootScope.placeList = paramList;
        });
      }

      var findAllIndustry = function() {
        if($scope.industries) {
          $rootScope.industries = $scope.industries;
          getAllAppDatas();
          return;
        }
        var deferred = $q.defer();
        modelDefinitionService.findAllIndustry(function(returnObj) {
          if(returnObj.code == 0) {
            $scope.industries = returnObj.data;
            $rootScope.industries = returnObj.data;
            deferred.resolve();
          }
        });
        return deferred.promise;
      }

      var promise = findAllIndustry();
      if(promise) {
        promise.then(function() {
          getAllAppDatas();
        });
      }

      //使用视图点击事件
      $scope.viewUse = function(industry) {
        if(userLoginUIService.user.isAuthenticated) {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认应用 ' + escape(industry.label) + ' 吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
//              solutionUIService.buySolution(industry.id, function(returnObj) {
                userInitService.applySolution(userLoginUIService.user,industry.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    growl.success("应用该服务方案成功", {});
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
          //        if (userLoginUIService.user.industry == "" || userLoginUIService.user.industry == null || userLoginUIService.user.industry == 0) {
          //          userLoginUIService.user.industry = industry;
          //          userUIService.modifyIndustry(userLoginUIService.user.userID, userLoginUIService.user.industry, function(userData) {
          //            if (userData.code == 0) {
          //              console.log("修改用户行业成功");
          //              // window.location.href="app/index.html";
          //
          //            }
          //          });
          //        }
          //        if (userLoginUIService.user.industry == industry && userLoginUIService.user.industry != 0) {
          //          marketplaceUIService.buy(id, function(appBuy) {
          //            if (appBuy.code == 0) {
          //              // alert("视图应用成功");
          //              console.log("视图应用成功");
          //              window.location.href = "app/index.html";
          //            }
          //            // else{
          //            // 	console.log("视图应用失败");
          //            // 	growl.warning("视图应用失败!", {});
          //            // }
          //
          //          })
          //        } else {
          //          // alert("不是同一个行业，不让修改");
          //          growl.warning("亲，暂不支持切换行业方案哦！", {});
          //        }
        } else {
          window.location.href = "#/myView";
        }
      }

      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            $scope.userStatus = "yes";
            $scope.industryUser = userLoginUIService.user.industry;
          } else {
            $scope.userStatus = "no";
          }
        });
      } else {
        $scope.userStatus = "yes";
        $scope.industryUser = userLoginUIService.user.industry;
      }

    }
  ]);
  
  controllers.initController('queryAllCtrl', ['$scope', '$rootScope', '$routeParams', 'solutionUIService', 'userLoginUIService', 'growl',
    function($scope, $rootScope, $routeParams, solutionUIService, userLoginUIService, growl) {
      $scope.queryplaceList = [];
      $scope.selectedIndustry = {};
      if($routeParams.industryId) {
        $rootScope.placeList.forEach(function(item) {
          if(item.industry == $routeParams.industryId)
            $scope.queryplaceList.push(item);
        })
        $rootScope.industries.forEach(function(item) {
          if(item.id == $routeParams.industryId)
            $scope.selectedIndustry = item;
        })
      };
      
      //使用视图点击事件
      $scope.viewUse = function(industry) {
        if(userLoginUIService.user.isAuthenticated) {
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            //size:BootstrapDialog.SIZE_WIDE,
            message: '确认应用 ' + escape(industry.label) + ' 吗？',
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function(dialogRef) {
                solutionUIService.buySolution(industry.id, function(returnObj) {
                  if(returnObj.code == 0) {
                    growl.success("应用该服务方案成功", {});
                  }
                })
                dialogRef.close();
              }
            }, {
              label: '取消',
              action: function(dialogRef) {
                dialogRef.close();
              }
            }]
          });
        } else {
          window.location.href = "#/myView";
        }
      }

      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            $scope.userStatus = "yes";
            $scope.industryUser = userLoginUIService.user.industry;
          } else {
            $scope.userStatus = "no";
          }
        });
      } else {
        $scope.userStatus = "yes";
        $scope.industryUser = userLoginUIService.user.industry;
      }

    }
  ]);

  //根据用户id查询用户拥有的应用或者设备
  controllers.initController('userAppControllers', ['$scope', '$rootScope', 'Info', 'solutionUIService', 'userLoginUIService', 'marketplaceUIService', 'userUIService', 'growl', 'ngDialog','viewFlexService',
    function($scope, $rootScope, Info, solutionUIService, userLoginUIService, marketplaceUIService, userUIService, growl, ngDialog,viewFlexService) {
      $scope.placeList = [];
      $rootScope.placeList = [];
      var info = Info.get("localdb/solution.json", function(info) {
        $scope.solutionIcons = info.solutionIcons;
        $scope.serviceViews = info.serviceViews;
        $scope.managedByGroups = info.managedByGroups;
      });
      function initViews() {
        var designView = [];
        viewFlexService.getAllMyViews(function(returnObj) {
          if(returnObj.code == 0) {
            var v = returnObj.data;
            var viewList = [];
            for(var i = 0; i < v.length; i++) {
              var view = v[i];
              if(view) {
                viewList.push(view);
                var description = {};
                if(typeof view.description == "string") {
                  var objectLike = /^\{(.|\n)*\}$/;
                  var reg = objectLike.test(view.description)
                  if(reg){
                    description = JSON.parse(view.description);
                  }
                }
                if(view.viewType == "dashboard") {
                  var viewmenus = {
                    "title": view.viewTitle.split("?")[0],
                    "label": view.viewTitle.split("?")[0],
                    "url": "#/" + view.viewType + "/" + view.viewId,
                    "viewId": view.viewId,
                    "id":  view.viewId,
                    "view": view,
                    "status": description['status'],
                    "statusBg": description["status"] == 1 ? 'bg-red' : (description["status"] == 2 ? 'bg-green' : ''),
                    "statusLab": description["status"] == 1 ? '授权' : (description["status"] == 2 ? '应用' : ''),
                    "icon": "fa fa-area-chart"
                  };
                  if (view.releaseStatus == "1") {
                    designView.push(viewmenus);
                  }
                }
              }
            }
            $scope.designView = designView;
            viewFlexService.viewLoadFinished = true;
            viewFlexService.viewList = viewList;
            $scope.viewList = viewList;
          }
        });
      };


      var selectedView = null;


      $scope.changeViewModel = function(viewInfo) {
        selectedView = viewInfo;
      };

      $scope.confirmView = function() {

        if (!selectedView) {
          growl.warning("请选择一个视图", {});
          return;
        }

        viewFlexService.getViewById(selectedView,function(returnObj) {

          $scope.viewModel = returnObj.data.viewTitle;

          if (returnObj.code == 0) {
            solutionUIService.saveManageViewContent(selectedSolution.id, returnObj.data.content, function (event) {


              if (event.code == 0) {
                growl.success("操作成功", {});
                if (callback) {
                  callback();
                }
              }
            });
          }
        });

        $scope.closeDialog = function() {
          ngDialog.close();
        };


      }


      
      var getMySolutions = function() {
        marketplaceUIService.getMyAppDatas(function(appList) {
          var appDate = appList.data;
          var paramList = [];
          for(var i = 0; i < appDate.length; i++) {
            paramList.push(appDate[i]);
          }
          $scope.placeList = paramList;
          $rootScope.placeList = $scope.placeList;
        });
      };
      var getSolutions = function() {
        $scope.placeList = [];
        $rootScope.placeList = [];
        solutionUIService.getSolutions(function(returnObj) {
          if(returnObj.code == 0) {
            returnObj.data.forEach(function(item) {
              $scope.placeList.push(item)
              $rootScope.placeList.push(item)
            });
          }
        })
      };
      $scope.newSolution = {};
      var dialog;
      $scope.confirm = function() {
        if(!$scope.newSolution.label) {
          growl.warning("方案名称不能为空", {})
          return;
        }
        if(!$scope.newSolution.serviceViewId) {
          growl.warning("方案模板不能为空", {})
          return;
        }
        if($scope.newSolution.managedByGroup != 0 && $scope.newSolution.managedByGroup != 1) {
          growl.warning("方案类型不能为空", {})
          return;
        }
        if(!$scope.newSolution.icon) {
          growl.warning("方案图标不能为空", {})
          return;
        }
        solutionUIService.saveSolution($scope.newSolution, function(returnObj) {
          if(returnObj.code == 0) {
            if(!$scope.newSolution.id) {
              $rootScope.placeList.push(returnObj.data);
              $scope.placeList.push(returnObj.data);
            }
            dialog.close();
            dialog = null;
          }
        });
      };

      $scope.addSolution = function() {
        $scope.newSolution = {};
        dialog = ngDialog.open({
          template: 'partials/solution-info.html',
          //        className: 'ngdialog-theme-plain ',
          scope: $scope
        });
      };
      var selectedSolution = null;
      $scope.dashboardEdit = function(solution) {
        selectedSolution = solution;
        dialog = ngDialog.open({
          template: 'partials/views-info.html',
          scope: $scope
        });
        /* 选中一个视图，而不是去新建一个视图
        console.log(solution);
        var solutionId = solution.id;
        location.href = "../app-freeboard/index.html#/freeboard/solution/solutionView/" + solutionId + "/" + solution.serviceViewId;
        */
      };
      $scope.solutionEdit = function(solution) {
        $scope.newSolution = solution;
        dialog = ngDialog.open({
          template: 'partials/solution-info.html',
          //        className: 'ngdialog-theme-plain ',
          scope: $scope
        });
      };

      $scope.solutionDesgin = function(solution) {
        $rootScope.selectedSolution = solution;
        if(solution.managedByGroup == 1)
          location.href = "#/modelsGroup";
        else
          location.href = "#/models";
      };
      
      $scope.solutionDelete = function(solution) {
        var delHandler = function() {
          solutionUIService.deleteSolution(solution.id, function(returnObj) {
            if(returnObj.code == 0) {
              for(var i in $scope.placeList) {
                if($scope.placeList[i].id == solution.id) {
                  $scope.placeList.splice(i, 1);
                  return;
                }
              }

              $rootScope.placeList = $scope.placeList;
            }
          });
        }
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认删除 ' + escape(solution.label) + ' 吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              //判断：若该设备类型关联1个或多个设备，不能删除
              delHandler();
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      };
      
      $scope.solutionPublish = function(solution) {
        if (solution.status > 0) return;
        var publicHandler = function() {
          solution.status = 10;
          solutionUIService.saveSolution(solution, function(returnObj) {
            if(returnObj.code == 0) {
              for(var i in $scope.placeList) {
                if($scope.placeList[i].id == solution.id) {
                  $scope.placeList[i].status = solution.status;
                  return;
                }
              }
              $rootScope.placeList = $scope.placeList;
            }
          });
        }
        BootstrapDialog.show({
          title: '提示',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: '确认发布 ' + escape(solution.label) + ' 吗？',
          buttons: [{
            label: '确定',
            cssClass: 'btn-success',
            action: function(dialogRef) {
              publicHandler();
              dialogRef.close();
            }
          }, {
            label: '取消',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
      
      //判断用户是否存在
      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            getSolutions();
            initViews();
          }
        });
      } else {
        getSolutions();
        initViews();
      };
    }
  ]);
});